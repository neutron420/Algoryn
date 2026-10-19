"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { RiSideBarFill } from "@remixicon/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NavbarSearch } from "@/components/navbar-search";
import { NotificationBell } from "@/components/notification-bell";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";
import { CompanySidebarItem } from "@/components/kodeprep-sidebar";
import { NavbarShareButton } from "./navbar-share-button";

interface DashboardNavbarProps {
  companies: CompanySidebarItem[];
}

export function DashboardNavbar({ companies }: DashboardNavbarProps) {
  const { openMobile, setOpenMobile } = useSidebar();
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
    <div className="flex h-13 sm:h-14 shrink-0 items-center justify-between gap-2 px-3 sm:px-5">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <button
          type="button"
          onClick={() => setOpenMobile(!openMobile)}
          aria-label="Open sidebar navigation"
          className="md:hidden flex size-8 items-center justify-center rounded-lg border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer shadow-2xs shrink-0 -ml-0.5"
        >
          <RiSideBarFill className="size-4 -scale-x-100" />
        </button>

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

        {/* Dynamic Notification Bell */}
        <NotificationBell />

        {/* User Nav Dropdown */}
        <UserNav />
      </div>
    </div>
  );
}
