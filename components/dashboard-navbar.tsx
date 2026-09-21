"use client";

import { useSearchParams } from "next/navigation";
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
import Link from "next/link";
import { CompanySidebarItem } from "@/components/kodeprep-sidebar";

interface DashboardNavbarProps {
  companies: CompanySidebarItem[];
}

export function DashboardNavbar({ companies }: DashboardNavbarProps) {
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("company") || companies[0]?.slug || "google";
  const foundCompany = companies.find((c) => c.slug === activeSlug);
  const activeCompanyName = foundCompany?.name || (activeSlug.charAt(0).toUpperCase() + activeSlug.slice(1));

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur-md px-3 sm:px-6">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <SidebarTrigger className="-ml-1" />

        <Breadcrumb className="min-w-0">
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:inline-flex">
              <BreadcrumbLink render={<Link href="/" />}>Algoryn</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:inline-block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-primary max-w-[80px] xs:max-w-[120px] sm:max-w-xs truncate text-xs sm:text-sm">
                {activeCompanyName}
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
      </div>
    </header>
  );
}
