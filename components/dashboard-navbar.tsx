"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NavbarSearch } from "@/components/navbar-search";
import { NavbarShareButton } from "@/components/navbar-share-button";
import { NotificationBell } from "@/components/notification-bell";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";
import { CompanySidebarItem } from "@/components/kodeprep-sidebar";

interface DashboardNavbarProps {
  companies: CompanySidebarItem[];
}

export function DashboardNavbar({ companies }: DashboardNavbarProps) {
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("company") || companies[0]?.slug || "google";
  const foundCompany = companies.find((c) => c.slug === activeSlug);
  const activeCompanyName = foundCompany?.name || (activeSlug.charAt(0).toUpperCase() + activeSlug.slice(1));

  // Dynamically resolve breadcrumb based on active pathname
  let breadcrumbLabel = activeCompanyName;
  if (pathname === "/dashboard/profile") {
    breadcrumbLabel = "Profile";
  } else if (pathname === "/dashboard/profile/edit") {
    breadcrumbLabel = "Edit Profile";
  } else if (pathname.startsWith("/dashboard/discussions")) {
    breadcrumbLabel = "Discussions";
  } else if (pathname.startsWith("/dashboard/roadmap")) {
    breadcrumbLabel = "Roadmap";
  } else if (pathname.startsWith("/dashboard/interview-experiences")) {
    breadcrumbLabel = "Interview Experiences";
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur-md px-2.5 sm:px-6">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <SidebarTrigger className="-ml-1" />

        <Breadcrumb className="min-w-0">
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:inline-flex">
              <BreadcrumbLink render={<Link href="/" />}>Algoryn</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:inline-block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-primary max-w-[100px] xs:max-w-[140px] sm:max-w-xs truncate text-xs sm:text-sm">
                {breadcrumbLabel}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto shrink-0">
        {/* Quick Search across all companies in Navbar */}
        <NavbarSearch
          companies={companies}
          currentCompanySlug={activeSlug}
        />

        {/* Share Interview Question Button */}
        <NavbarShareButton
          companySlug={activeSlug}
          companyName={activeCompanyName}
        />

        {/* Dynamic Notification Bell */}
        <NotificationBell />

        {/* User Nav Dropdown */}
        <UserNav />
      </div>
    </header>
  );
}
