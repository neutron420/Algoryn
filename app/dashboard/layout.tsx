import { KodePrepSidebar } from "@/components/kodeprep-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { AuthGuard } from "@/components/auth-guard";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";

import { getOrSetCache } from "@/lib/redis";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let sidebarCompanies = await getOrSetCache(
    "cache:companies:sidebar",
    async () => {
      let allCompaniesRaw: {
        id: number;
        name: string;
        slug: string;
        _count: { problems: number; communityProblems?: number };
      }[] = [];

      try {
        allCompaniesRaw = await withDbRetry(() =>
          prisma.company.findMany({
            select: {
              id: true,
              name: true,
              slug: true,
              _count: { select: { problems: true, communityProblems: true } },
            },
            orderBy: { problems: { _count: "desc" } },
          })
        );
      } catch (err) {
        console.warn("Failed to fetch sidebar companies in dashboard layout:", err);
      }

      return allCompaniesRaw.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        problemCount: (c._count.problems ?? 0) + (c._count.communityProblems ?? 0),
      }));
    },
    86400 // 24 hours TTL
  );

  // Safety fallback: If cache returned empty, fetch directly from DB to prevent "0 Total"
  if (!sidebarCompanies || sidebarCompanies.length === 0) {
    try {
      const directCompanies = await prisma.company.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { problems: true, communityProblems: true } },
        },
        orderBy: { problems: { _count: "desc" } },
      });
      if (directCompanies.length > 0) {
        sidebarCompanies = directCompanies.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          problemCount: (c._count.problems ?? 0) + (c._count.communityProblems ?? 0),
        }));
      }
    } catch (err) {
      console.warn("Direct fallback for sidebar companies failed:", err);
    }
  }

  return (
    <AuthGuard>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "18rem",
          } as React.CSSProperties
        }
      >
        <KodePrepSidebar companies={sidebarCompanies} selectedCompanySlug="google" />
        <SidebarInset>
          <DashboardNavbar companies={sidebarCompanies} />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
