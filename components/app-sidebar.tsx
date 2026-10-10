"use client";

import React, { useState, useMemo, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Code2,
  Building2,
  MessagesSquare,
  Briefcase,
  GitBranch,
  Trophy,
  UserRound,
  Bookmark,
  Boxes,
  Network,
  Newspaper,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Search,
  LogOut,
  LogIn,
  X,
  Flame,
  Sparkles,
  TrendingUp,
  Landmark,
  Crown,
  Cloud,
  ShieldCheck,
  Cpu,
  ShoppingBag,
  Car,
  UtensilsCrossed,
  MessageSquare,
  Gamepad2,
  Activity,
  GraduationCap,
  Compass,
  Radio,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/auth-context";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { COMPANY_CATEGORIES, CompanyCategoryDef } from "@/lib/company-categories";
import { CompanyLogo } from "@/components/company-logo";
import { KodePrepLogo } from "@/components/kodeprep-logo";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Category Icon Helper (Monochrome Outline Style)                    */
/* ------------------------------------------------------------------ */

function CategoryIcon({
  name,
  className,
}: {
  name: CompanyCategoryDef["iconName"] | string;
  className?: string;
}) {
  const common = cn("size-4 shrink-0 text-slate-500 dark:text-zinc-400", className);
  switch (name) {
    case "Flame":
      return <Flame className={common} />;
    case "Sparkles":
      return <Sparkles className={common} />;
    case "TrendingUp":
      return <TrendingUp className={common} />;
    case "Landmark":
      return <Landmark className={common} />;
    case "Crown":
      return <Crown className={common} />;
    case "Cloud":
      return <Cloud className={common} />;
    case "ShieldCheck":
      return <ShieldCheck className={common} />;
    case "Cpu":
      return <Cpu className={common} />;
    case "ShoppingBag":
      return <ShoppingBag className={common} />;
    case "Car":
      return <Car className={common} />;
    case "UtensilsCrossed":
      return <UtensilsCrossed className={common} />;
    case "MessageSquare":
      return <MessageSquare className={common} />;
    case "Gamepad2":
      return <Gamepad2 className={common} />;
    case "Activity":
      return <Activity className={common} />;
    case "Briefcase":
      return <Briefcase className={common} />;
    case "GraduationCap":
      return <GraduationCap className={common} />;
    case "Compass":
      return <Compass className={common} />;
    case "Radio":
      return <Radio className={common} />;
    case "Zap":
      return <Zap className={common} />;
    default:
      return <Building2 className={common} />;
  }
}

/* ------------------------------------------------------------------ */
/* Reusable Navigation Item Component (TakeUforward Quality)          */
/* ------------------------------------------------------------------ */

interface NavItemProps {
  href?: string;
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string | number;
  badgeVariant?: "default" | "pro" | "new" | "tree" | "soon" | "count";
  isActive?: boolean;
  isExpanded?: boolean;
  hasChevron?: boolean;
  isSubItem?: boolean;
  title?: string;
  className?: string;
}

function NavItem({
  href,
  onClick,
  icon: Icon,
  label,
  badge,
  badgeVariant = "default",
  isActive = false,
  isExpanded,
  hasChevron = false,
  isSubItem = false,
  title,
  className,
}: NavItemProps) {
  const content = (
    <div
      className={cn(
        "w-full flex items-center justify-between text-xs font-medium rounded-lg transition-colors cursor-pointer select-none group",
        isSubItem ? "py-1.5 px-2.5 pl-8" : "py-2 px-2.5",
        isActive
          ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-semibold shadow-2xs"
          : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100",
        className
      )}
      title={title || label}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <Icon
          className={cn(
            "size-4 shrink-0 transition-colors",
            isActive
              ? "text-slate-900 dark:text-zinc-100"
              : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300"
          )}
        />
        <span className="truncate leading-none">{label}</span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 ml-1">
        {badge !== undefined && badge !== null && (
          <span
            className={cn(
              "text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none",
              badgeVariant === "new"
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40"
                : badgeVariant === "tree"
                ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40"
                : badgeVariant === "soon"
                ? "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-700/60"
                : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-medium"
            )}
          >
            {badge}
          </span>
        )}

        {hasChevron && (
          <ChevronDown
            className={cn(
              "size-3 text-slate-400 dark:text-zinc-500 transition-transform duration-150",
              isExpanded && "rotate-180"
            )}
          />
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} aria-current={isActive ? "page" : undefined} className="block w-full">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="block w-full text-left">
      {content}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Tree Branch Connector Item (TakeUForward Hierarchy Style)          */
/* ------------------------------------------------------------------ */

interface TreeBranchItemProps {
  isLast?: boolean;
  children: React.ReactNode;
  className?: string;
}

function TreeBranchItem({
  isLast = false,
  children,
  className,
}: TreeBranchItemProps) {
  return (
    <div className={cn("relative flex items-center min-h-[30px]", className)}>
      {/* Tree connector lines */}
      <div
        className="absolute left-[13px] top-0 bottom-0 pointer-events-none w-3.5"
        aria-hidden="true"
      >
        {/* Top-half to horizontal branch curve */}
        <div className="absolute left-0 top-0 h-1/2 w-3.5 border-l border-b border-slate-300/80 dark:border-zinc-700 rounded-bl-[7px]" />
        {/* Continuous downward stem to next sibling */}
        {!isLast && (
          <div className="absolute left-0 top-1/2 bottom-0 w-px border-l border-slate-300/80 dark:border-zinc-700" />
        )}
      </div>

      {/* Indented child content */}
      <div className="pl-6 w-full">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Types & Sidebar Props                                              */
/* ------------------------------------------------------------------ */

export interface CompanySidebarItem {
  id: number;
  name: string;
  slug: string;
  problemCount: number;
}

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  companies?: CompanySidebarItem[];
  selectedCompanySlug?: string;
}

const PRIMARY_CATEGORY_LIMIT = 5;

/* ------------------------------------------------------------------ */
/* Main Application Sidebar Component                                 */
/* ------------------------------------------------------------------ */

export function AppSidebar({
  companies = [],
  selectedCompanySlug = "google",
  className,
  ...props
}: AppSidebarProps) {
  const { user, signOut } = useAuth();
  const { count: bookmarkCount } = useBookmarks();
  const { isMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  // Collapsible section state
  const [practiceOpen, setPracticeOpen] = useState(true);
  const [companiesOpen, setCompaniesOpen] = useState(true);
  const [systemDesignOpen, setSystemDesignOpen] = useState(false);

  // Drilldown state for company categories
  const [drilldownCategory, setDrilldownCategory] = useState<
    | (CompanyCategoryDef & { items: CompanySidebarItem[] })
    | { id: string; name: string; iconName?: string; items: CompanySidebarItem[] }
    | null
  >(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [pendingCompanySlug, setPendingCompanySlug] = useState<string | null>(null);

  const isBookmarksActive = searchParams.get("status") === "BOOKMARKED";
  const activeCompanySlug = searchParams.get("company") || selectedCompanySlug || "google";
  const displayedCompanySlug = pendingCompanySlug || activeCompanySlug;

  if (pendingCompanySlug && searchParams.get("company") === pendingCompanySlug) {
    setPendingCompanySlug(null);
  }

  // Group companies into defined categories
  const categorizedCompanies = useMemo(() => {
    const companyMap = new Map<string, CompanySidebarItem>();
    companies.forEach((c) => companyMap.set(c.slug.toLowerCase(), c));

    const categorizedIds = new Set<number>();

    const categories = COMPANY_CATEGORIES.map((cat) => {
      const items: CompanySidebarItem[] = [];
      cat.slugs.forEach((slug) => {
        const company = companyMap.get(slug);
        if (company) {
          items.push(company);
          categorizedIds.add(company.id);
        }
      });
      return {
        ...cat,
        items,
      };
    }).filter((cat) => cat.items.length > 0);

    const otherItems = companies.filter((c) => !categorizedIds.has(c.id));

    return {
      categories,
      otherItems,
    };
  }, [companies]);

  // Find active category
  const activeCategoryId = useMemo(() => {
    for (const cat of categorizedCompanies.categories) {
      if (cat.items.some((c) => c.slug === displayedCompanySlug)) {
        return cat.id;
      }
    }
    if (categorizedCompanies.otherItems.some((c) => c.slug === displayedCompanySlug)) {
      return "__other";
    }
    return null;
  }, [categorizedCompanies, displayedCompanySlug]);

  // Prefetch top companies in category on drilldown
  useEffect(() => {
    if (drilldownCategory && drilldownCategory.items.length > 0) {
      drilldownCategory.items.slice(0, 4).forEach((c) => {
        router.prefetch(`/dashboard?company=${c.slug}`);
      });
    }
  }, [drilldownCategory, router]);

  const selectCompany = (slug: string) => {
    if (slug === displayedCompanySlug) return;
    setPendingCompanySlug(slug);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("company-switch-start", { detail: slug }));
    }
    startTransition(() => {
      router.push(`/dashboard?company=${slug}`);
      if (isMobile) {
        setOpenMobile(false);
      }
    });
  };

  const handleClose = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      toggleSidebar();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    if (isMobile) {
      setOpenMobile(false);
    }
    router.push("/login");
  };

  // Filter drilldown items
  const filteredDrilldownItems = useMemo(() => {
    if (!drilldownCategory) return [];
    if (!categorySearchQuery.trim()) return drilldownCategory.items;
    const q = categorySearchQuery.toLowerCase().trim();
    return drilldownCategory.items.filter((c) => c.name.toLowerCase().includes(q));
  }, [drilldownCategory, categorySearchQuery]);

  const primaryCategories = categorizedCompanies.categories.slice(0, PRIMARY_CATEGORY_LIMIT);
  const remainingCategories = categorizedCompanies.categories.slice(PRIMARY_CATEGORY_LIMIT);

  return (
    <Sidebar
      collapsible="offcanvas"
      className={cn(
        "border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0c101c] select-none",
        className
      )}
      {...props}
    >
      {/* ========================================================================= */}
      {/* 1. HEADER (LOGO + COLLAPSE/CLOSE BUTTON)                                   */}
      {/* ========================================================================= */}
      <SidebarHeader className="h-14 flex-row items-center justify-between p-0 px-4 border-b border-slate-200/80 dark:border-zinc-800/80 shrink-0 bg-transparent">
        <KodePrepLogo />
        <button
          type="button"
          onClick={handleClose}
          className="size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Close sidebar"
          aria-label="Close sidebar"
        >
          <X className="size-4" />
        </button>
      </SidebarHeader>

      {/* ========================================================================= */}
      {/* 2. SCROLLABLE NAVIGATION CONTENT                                          */}
      {/* ========================================================================= */}
      <SidebarContent className="flex-1 overflow-y-auto no-scrollbar p-2.5 pb-6 space-y-4">
        {drilldownCategory ? (
          /* --------------------------------------------------------------------- */
          /* DRILLDOWN VIEW: COMPANIES IN SELECTED CATEGORY                        */
          /* --------------------------------------------------------------------- */
          <SidebarGroup className="p-0 space-y-2 animate-in fade-in-50 duration-150">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setDrilldownCategory(null);
                setCategorySearchQuery("");
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Categories</span>
            </button>

            {/* Category Header Card */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60">
              <div className="flex items-center gap-2 min-w-0">
                <CategoryIcon name={drilldownCategory.iconName || "Building2"} />
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                  {drilldownCategory.name}
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 text-slate-500 border border-slate-200 dark:border-zinc-700 shrink-0">
                {drilldownCategory.items.length}
              </span>
            </div>

            {/* Quick Search inside Category */}
            {drilldownCategory.items.length > 6 && (
              <div className="relative pt-0.5">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  placeholder={`Search ${drilldownCategory.name}...`}
                  className="w-full pl-7 pr-7 py-1 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 placeholder:text-slate-400 text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-slate-400"
                />
                {categorySearchQuery && (
                  <button
                    type="button"
                    onClick={() => setCategorySearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            )}

            {/* Companies List */}
            <SidebarGroupContent className="space-y-0.5 pt-1">
              {filteredDrilldownItems.map((company) => {
                const isActive = displayedCompanySlug === company.slug;
                return (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => selectCompany(company.slug)}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer group",
                      isActive
                        ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-semibold shadow-2xs"
                        : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/60"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CompanyLogo
                        name={company.name}
                        className="size-4 text-[9px] rounded border border-slate-200 dark:border-zinc-700 shrink-0"
                      />
                      <span className="truncate">{company.name}</span>
                    </div>

                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0",
                        isActive
                          ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100"
                          : "text-slate-400"
                      )}
                    >
                      {company.problemCount}
                    </span>
                  </button>
                );
              })}

              {filteredDrilldownItems.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No matching companies</p>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <>
            {/* =================================================================== */}
            {/* SECTION A — LEARN                                                   */}
            {/* =================================================================== */}
            <SidebarGroup className="p-0 space-y-0.5">
              <SidebarGroupLabel className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest px-2.5 pb-1 h-auto">
                Learn
              </SidebarGroupLabel>

              <SidebarGroupContent className="space-y-0.5">
                {/* Dashboard */}
                <NavItem
                  href="/dashboard"
                  onClick={() => isMobile && setOpenMobile(false)}
                  icon={LayoutDashboard}
                  label="Dashboard"
                  isActive={pathname === "/dashboard" && !searchParams.get("track") && !isBookmarksActive}
                />

                {/* Practice Collapsible Group (DSA, SQL, Aptitude) with TakeUForward Tree Branch Lines */}
                <div>
                  <NavItem
                    onClick={() => setPracticeOpen(!practiceOpen)}
                    icon={Code2}
                    label="Practice"
                    hasChevron
                    isExpanded={practiceOpen}
                  />

                  {practiceOpen && (
                    <div className="space-y-0.5 mt-0.5 ml-1 animate-in fade-in-50 duration-150">
                      <TreeBranchItem isLast={false}>
                        <Link
                          href="/dashboard?track=dsa"
                          onClick={() => isMobile && setOpenMobile(false)}
                          className={cn(
                            "w-full flex items-center py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer",
                            searchParams.get("track") === "dsa"
                              ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-semibold"
                              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100"
                          )}
                        >
                          DSA
                        </Link>
                      </TreeBranchItem>

                      <TreeBranchItem isLast={false}>
                        <Link
                          href="/dashboard?track=sql"
                          onClick={() => isMobile && setOpenMobile(false)}
                          className={cn(
                            "w-full flex items-center py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer",
                            searchParams.get("track") === "sql"
                              ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-semibold"
                              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100"
                          )}
                        >
                          SQL
                        </Link>
                      </TreeBranchItem>

                      <TreeBranchItem isLast={true}>
                        <Link
                          href="/dashboard?track=aptitude"
                          onClick={() => isMobile && setOpenMobile(false)}
                          className={cn(
                            "w-full flex items-center py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer",
                            searchParams.get("track") === "aptitude"
                              ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-semibold"
                              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100"
                          )}
                        >
                          Aptitude
                        </Link>
                      </TreeBranchItem>
                    </div>
                  )}
                </div>

                {/* Company Preparation Collapsible Group */}
                <div className="pt-0.5">
                  <NavItem
                    onClick={() => setCompaniesOpen(!companiesOpen)}
                    icon={Building2}
                    label="Company Preparation"
                    badge={companies.length}
                    badgeVariant="count"
                    hasChevron
                    isExpanded={companiesOpen}
                  />

                  {companiesOpen && (
                    <div className="space-y-0.5 mt-0.5 ml-1 animate-in fade-in-50 duration-150">
                      {primaryCategories.map((category, idx) => {
                        const isCatActive = activeCategoryId === category.id;
                        const isLast =
                          remainingCategories.length === 0 &&
                          idx === primaryCategories.length - 1;

                        return (
                          <TreeBranchItem key={category.id} isLast={isLast}>
                            <button
                              type="button"
                              onClick={() => {
                                setDrilldownCategory(category);
                                setCategorySearchQuery("");
                              }}
                              className={cn(
                                "w-full flex items-center justify-between py-1.5 px-2.5 text-xs rounded-lg transition-colors cursor-pointer group text-left",
                                isCatActive
                                  ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-semibold"
                                  : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100"
                              )}
                            >
                              <span className="truncate pr-1">{category.name}</span>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[10px] font-mono text-slate-400">
                                  {category.items.length}
                                </span>
                                <ChevronRight className="size-3 text-slate-300 group-hover:text-slate-500" />
                              </div>
                            </button>
                          </TreeBranchItem>
                        );
                      })}

                      {/* View More Categories */}
                      {remainingCategories.length > 0 && (
                        <>
                          {showAllCategories ? (
                            <>
                              {remainingCategories.map((category) => (
                                <TreeBranchItem key={category.id} isLast={false}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDrilldownCategory(category);
                                      setCategorySearchQuery("");
                                    }}
                                    className="w-full flex items-center justify-between py-1.5 px-2.5 text-xs rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors cursor-pointer group text-left"
                                  >
                                    <span className="truncate pr-1">{category.name}</span>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <span className="text-[10px] font-mono text-slate-400">
                                        {category.items.length}
                                      </span>
                                      <ChevronRight className="size-3 text-slate-300 group-hover:text-slate-500" />
                                    </div>
                                  </button>
                                </TreeBranchItem>
                              ))}
                              <TreeBranchItem isLast={true}>
                                <button
                                  type="button"
                                  onClick={() => setShowAllCategories(false)}
                                  className="w-full text-left py-1.5 px-2.5 text-[11px] font-medium text-slate-400 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors"
                                >
                                  Show fewer categories
                                </button>
                              </TreeBranchItem>
                            </>
                          ) : (
                            <TreeBranchItem isLast={true}>
                              <button
                                type="button"
                                onClick={() => setShowAllCategories(true)}
                                className="w-full text-left py-1.5 px-2.5 text-xs text-blue-600 dark:text-blue-400 hover:underline transition-colors flex items-center justify-between"
                              >
                                <span>View more categories</span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  +{remainingCategories.length}
                                </span>
                              </button>
                            </TreeBranchItem>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Separator */}
            <div className="border-t border-slate-100 dark:border-zinc-800/80 my-2" />

            {/* =================================================================== */}
            {/* SECTION B — COMMUNITY                                               */}
            {/* =================================================================== */}
            <SidebarGroup className="p-0 space-y-0.5">
              <SidebarGroupLabel className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest px-2.5 pb-1 h-auto">
                Community
              </SidebarGroupLabel>

              <SidebarGroupContent className="space-y-0.5">
                <NavItem
                  href="/dashboard/discussions"
                  onClick={() => isMobile && setOpenMobile(false)}
                  icon={MessagesSquare}
                  label="Discussions"
                  badge="NEW"
                  badgeVariant="new"
                  isActive={pathname === "/dashboard/discussions"}
                />

                <NavItem
                  href="/dashboard/interview-experiences"
                  onClick={() => isMobile && setOpenMobile(false)}
                  icon={Briefcase}
                  label="Interview Experiences"
                  badge="NEW"
                  badgeVariant="new"
                  isActive={pathname?.startsWith("/dashboard/interview-experiences")}
                />

                <NavItem
                  href="/dashboard/roadmap"
                  onClick={() => isMobile && setOpenMobile(false)}
                  icon={GitBranch}
                  label="DSA Roadmap"
                  badge="TREE"
                  badgeVariant="tree"
                  isActive={pathname === "/dashboard/roadmap"}
                />

                <NavItem
                  onClick={() => {
                    toast.info("Leaderboard is coming soon!", {
                      description: "Global community solver rankings, streaks, and milestone badges are launching soon.",
                    });
                  }}
                  icon={Trophy}
                  label="Leaderboard"
                  badge="Soon"
                  badgeVariant="soon"
                />

                <NavItem
                  href="/dashboard/profile"
                  onClick={() => isMobile && setOpenMobile(false)}
                  icon={UserRound}
                  label="My Profile"
                  isActive={pathname === "/dashboard/profile"}
                />
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Separator */}
            <div className="border-t border-slate-100 dark:border-zinc-800/80 my-2" />

            {/* =================================================================== */}
            {/* SECTION C — RESOURCES                                               */}
            {/* =================================================================== */}
            <SidebarGroup className="p-0 space-y-0.5">
              <SidebarGroupLabel className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest px-2.5 pb-1 h-auto">
                Resources
              </SidebarGroupLabel>

              <SidebarGroupContent className="space-y-0.5">
                {/* Bookmarks */}
                <NavItem
                  onClick={() => {
                    const targetUrl = isBookmarksActive
                      ? `/dashboard${activeCompanySlug ? `?company=${activeCompanySlug}` : ""}`
                      : `/dashboard?status=BOOKMARKED${activeCompanySlug ? `&company=${activeCompanySlug}` : ""}`;
                    startTransition(() => {
                      router.push(targetUrl);
                      if (isMobile) setOpenMobile(false);
                    });
                  }}
                  icon={Bookmark}
                  label="Bookmarks"
                  badge={bookmarkCount > 0 ? bookmarkCount : undefined}
                  badgeVariant="count"
                  isActive={isBookmarksActive}
                />

                {/* System Design Collapsible Group (LLD / HLD) */}
                <div>
                  <NavItem
                    onClick={() => setSystemDesignOpen(!systemDesignOpen)}
                    icon={Boxes}
                    label="System Design"
                    hasChevron
                    isExpanded={systemDesignOpen}
                  />

                  {systemDesignOpen && (
                    <div className="space-y-0.5 mt-0.5 ml-1 animate-in fade-in-50 duration-150">
                      <TreeBranchItem isLast={false}>
                        <button
                          type="button"
                          onClick={() => {
                            toast.info("Low Level Design (LLD) is coming soon!", {
                              description: "OOP patterns, machine coding rounds, and schema templates are in development.",
                            });
                          }}
                          className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors cursor-pointer text-left"
                        >
                          <span>LLD</span>
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-700/60">
                            Soon
                          </span>
                        </button>
                      </TreeBranchItem>

                      <TreeBranchItem isLast={true}>
                        <button
                          type="button"
                          onClick={() => {
                            toast.info("High Level Design (HLD) is coming soon!", {
                              description: "Distributed architectures, microservices, and interview blueprints are launching soon.",
                            });
                          }}
                          className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors cursor-pointer text-left"
                        >
                          <span>HLD</span>
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-700/60">
                            Soon
                          </span>
                        </button>
                      </TreeBranchItem>
                    </div>
                  )}
                </div>

                {/* Blogs & Guides */}
                <NavItem
                  href="/guides"
                  onClick={() => isMobile && setOpenMobile(false)}
                  icon={Newspaper}
                  label="Blogs & Guides"
                  isActive={pathname === "/guides"}
                />
              </SidebarGroupContent>
            </SidebarGroup>

          </>
        )}
      </SidebarContent>

      {/* ========================================================================= */}
      {/* 3. SECTION E — ACCOUNT (BOTTOM ANCHORED)                                  */}
      {/* ========================================================================= */}
      <SidebarFooter className="shrink-0 p-3 pb-3.5 border-t border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c]">
        {user ? (
          <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/60 p-2.5 px-3 flex items-center justify-between gap-2 shadow-2xs">
            {/* User Profile Info */}
            <Link
              href="/dashboard/profile"
              onClick={() => isMobile && setOpenMobile(false)}
              className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity cursor-pointer"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="size-8 rounded-md object-cover border border-slate-200 dark:border-zinc-700 shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="size-8 rounded-md bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 flex items-center justify-center font-bold text-xs shrink-0">
                  {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100 truncate leading-snug">
                    {user.displayName || user.email?.split("@")[0] || "User"}
                  </p>
                  <VerifiedBadge className="size-3 shrink-0" />
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 leading-none shrink-0">
                    Pro
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate leading-normal pt-0.5 min-h-[16px]">
                  {user.email || "Free Tier"}
                </p>
              </div>
            </Link>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign Out"
              aria-label="Sign Out"
              className="size-7 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            onClick={() => isMobile && setOpenMobile(false)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs transition-all shadow-xs cursor-pointer"
          >
            <LogIn className="size-3.5" />
            <span>Login to Algoryn</span>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export { AppSidebar as KodePrepSidebar };
