import { AppSidebar } from "@/components/app-sidebar";
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
        className="p-2 sm:p-2.5 md:p-3 gap-2 sm:gap-2.5 md:gap-3 bg-slate-100/70 dark:bg-[#07090e] min-h-svh w-full"
        style={
          {
            "--sidebar-width": "18rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar companies={sidebarCompanies} selectedCompanySlug="google" />
        <div className="flex-1 flex flex-col min-w-0 gap-2 sm:gap-2.5 md:gap-3">
          {/* Floating Separate Rounded Navbar Island (TakeUForward Architecture) */}
          <header className="rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] shadow-2xs shrink-0">
            <DashboardNavbar companies={sidebarCompanies} />
          </header>

          {/* Floating Separate Rounded Dashboard Content Island */}
          <SidebarInset className="rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] shadow-xs overflow-hidden flex flex-col flex-1 min-w-0 min-h-[calc(100svh-5.5rem)] md:min-h-[calc(100svh-6rem)]">
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
