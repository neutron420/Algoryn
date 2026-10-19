"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  type ComponentType,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import {
  RiCloseLine,
  RiCustomerServiceLine,
  RiHomeLine,
  RiSearchLine,
  RiSettings4Line,
  RiSideBarFill,
  RiUserSmileLine,
  RiBuildingLine,
  RiMessage2Line,
  RiFileTextLine,
  RiGitBranchLine,
  RiTrophyLine,
  RiBookmarkLine,
  RiArrowDownSLine,
  RiAddFill,
  RiServerLine,
  RiArrowLeftLine,
  RiYoutubeLine,
  RiGithubLine,
  RiGlobalLine,
  RiBookOpenLine,
  RiStackLine,
} from "@remixicon/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SettingsModal } from "@/components/application/settings/settings-modal";
import { Badge } from "@/components/base/badges/badge";
import { Button as BaseButton } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Kbd } from "@/components/base/kbd/kbd";
import { cx } from "@/utils/cx";
import { DashboardTeamMenu } from "@/components/application/dashboard/dashboard-team-menu";
import { DashboardUserMenu } from "@/components/application/dashboard/dashboard-user-menu";
import { useSidebar } from "@/components/ui/sidebar";

const SubmitQuestionDialog = dynamic(
  () => import("@/components/submit-question-dialog").then((mod) => mod.SubmitQuestionDialog),
  { ssr: false }
);

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/**
 * Collapsible slot: blurs + fades + shrinks away when rail closes.
 */
function Collapsible({ collapsed, children, className }: { collapsed: boolean; children: ReactNode; className?: string }) {
  const localize = useTemplateCopy();
  return localize((
    <span
      className={cx(
        "flex min-w-0 items-center overflow-hidden transition-[max-width,opacity,filter] duration-300 ease-in-out",
        collapsed ? "max-w-0 opacity-0 blur-[3px]" : "max-w-full opacity-100 blur-0",
        className,
      )}
    >
      {children}
    </span>
  ));
}

/**
 * Tree Branch Connector Item matching the user's design screenshot:
 * Curved elbow line connector (rounded-bl-[6px]) with continuous downward stem.
 */
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
    <div className={cx("relative flex items-center min-h-[26px]", className)}>
      {/* Tree connector lines */}
      <div
        className="absolute left-[13px] top-0 bottom-0 pointer-events-none w-3.5"
        aria-hidden="true"
      >
        {/* Top-half to horizontal branch curve */}
        <div className="absolute left-0 top-0 h-1/2 w-3.5 border-l border-b border-slate-300/80 dark:border-zinc-700/80 rounded-bl-[6px]" />
        {/* Continuous downward stem to next sibling */}
        {!isLast && (
          <div className="absolute left-0 top-1/2 bottom-0 w-px border-l border-slate-300/80 dark:border-zinc-700/80" />
        )}
      </div>

      {/* Indented child content */}
      <div className="pl-6 w-full">{children}</div>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  badge,
  isSelected = false,
  collapsed = false,
  href,
  onClick,
  hasChevron = false,
  isExpanded = false,
}: {
  icon: IconComponent;
  label: string;
  badge?: ReactNode;
  isSelected?: boolean;
  collapsed?: boolean;
  href?: string;
  onClick?: () => void;
  hasChevron?: boolean;
  isExpanded?: boolean;
}) {
  const localize = useTemplateCopy();
  const content = (
    <div
      aria-label={label}
      title={collapsed ? label : undefined}
      className={cx(
        "flex items-center justify-between overflow-hidden rounded-xl py-1.5 px-2 text-xs font-medium cursor-pointer select-none",
        "transition-all duration-300 ease-in-out",
        collapsed ? "size-9 justify-center p-0 mx-auto" : "w-full",
        isSelected
          ? "bg-linear-to-b from-accent-500 to-accent-600 text-white shadow-nav-selected"
          : "hover:bg-background-secondary-hover text-text-secondary hover:text-text-primary",
      )}
    >
      <span className={cx("flex min-w-0 items-center gap-2", collapsed && "justify-center")}>
        <Icon
          className={cx("size-4 shrink-0", isSelected ? "text-white" : "text-foreground-icon-secondary")}
          aria-hidden
        />
        <Collapsible collapsed={collapsed}>
          <span
            className={cx(
              "text-xs font-medium whitespace-nowrap",
              isSelected ? "text-white font-semibold" : "text-text-secondary",
            )}
          >
            {label}
          </span>
        </Collapsible>
      </span>
      <div className="flex items-center gap-1.5 shrink-0">
        {badge && <Collapsible collapsed={collapsed}>{badge}</Collapsible>}
        {hasChevron && !collapsed && (
          <Collapsible collapsed={collapsed}>
            <RiArrowDownSLine
              className={cx(
                "size-3.5 text-foreground-icon-tertiary transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </Collapsible>
        )}
      </div>
    </div>
  );

  if (href) {
    return localize((
      <Link
        href={href}
        onClick={onClick}
        aria-current={isSelected ? "page" : undefined}
        className="block w-full"
      >
        {content}
      </Link>
    ));
  }

  return localize((
    <button
      type="button"
      onClick={onClick}
      aria-current={isSelected ? "page" : undefined}
      className="block w-full text-left"
    >
      {content}
    </button>
  ));
}

export interface DashboardNavItem {
  key: string;
  label: string;
  icon: IconComponent;
  href?: string;
  badge?: string | number;
}

export type DashboardNavKey = string;

export interface CompanySidebarItem {
  id: number;
  name: string;
  slug: string;
  problemCount: number;
}

export interface AppSidebarProps {
  companies?: CompanySidebarItem[];
  selectedCompanySlug?: string;
  mobile?: boolean;
  onClose?: () => void;
  fluid?: boolean;
  showThemeToggle?: boolean;
  selected?: DashboardNavKey;
  items?: DashboardNavItem[];
  flat?: boolean;
  className?: string;
  [key: string]: unknown;
}

const DEFAULT_COMPANIES: CompanySidebarItem[] = [
  { id: 1, name: "Google", slug: "google", problemCount: 182 },
  { id: 2, name: "Amazon", slug: "amazon", problemCount: 214 },
  { id: 3, name: "Microsoft", slug: "microsoft", problemCount: 165 },
  { id: 4, name: "Meta", slug: "meta", problemCount: 143 },
  { id: 5, name: "Apple", slug: "apple", problemCount: 98 },
  { id: 6, name: "Netflix", slug: "netflix", problemCount: 76 },
  { id: 7, name: "Uber", slug: "uber", problemCount: 64 },
  { id: 8, name: "Adobe", slug: "adobe", problemCount: 58 },
];

export function DashboardSidebar({
  companies = [],
  selectedCompanySlug = "google",
  mobile = false,
  onClose,
  fluid = false,
  selected,
  flat = false,
  className,
}: AppSidebarProps = {}) {
  const localize = useTemplateCopy();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active company slug from URL or prop
  const currentCompanySlug = searchParams.get("company") || selectedCompanySlug || "google";
  const isBookmarksActive = searchParams.get("status") === "BOOKMARKED";
  const isSystemDesignPage = pathname?.startsWith("/dashboard/system-design");
  const currentDesignTab = searchParams.get("tab") || "all";

  // Effective selected route
  let defaultSelected = "dashboard";
  if (isBookmarksActive) defaultSelected = "bookmarks";
  else if (pathname === "/dashboard/profile") defaultSelected = "profile";
  else if (pathname?.startsWith("/dashboard/discussions")) defaultSelected = "discussions";
  else if (pathname?.startsWith("/dashboard/interview-experiences")) defaultSelected = "interviews";
  else if (pathname?.startsWith("/roadmap") || pathname?.startsWith("/dashboard/roadmap")) defaultSelected = "roadmap";
  else if (pathname?.startsWith("/dashboard/system-design")) defaultSelected = "system-design";
  else if (pathname?.startsWith("/dashboard/leaderboard")) defaultSelected = "leaderboard";

  const effectiveSelected = selected || defaultSelected;

  const [collapsedState, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [companiesOpen, setCompaniesOpen] = useState(true);
  const [showMoreCompanies, setShowMoreCompanies] = useState(false);
  const [suppressUserHover, setSuppressUserHover] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [query, setQuery] = useState("");

  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const searchFieldRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const collapsed = mobile ? false : collapsedState;
  const normalizedQuery = query.trim().toLocaleLowerCase();

  // Normalize company list
  const allCompanies = useMemo(() => {
    if (companies && companies.length > 0) return companies;
    return DEFAULT_COMPANIES;
  }, [companies]);

  // Companies for the tree branch view
  const treeCompanies = useMemo(() => {
    const limit = showMoreCompanies ? 14 : 6;
    let list = allCompanies.slice(0, limit);

    // Ensure active company from URL is always in the visible tree
    if (currentCompanySlug && !list.some((c) => c.slug === currentCompanySlug)) {
      const activeItem = allCompanies.find((c) => c.slug === currentCompanySlug);
      if (activeItem) {
        list = [activeItem, ...list.slice(0, limit - 1)];
      }
    }
    return list;
  }, [allCompanies, showMoreCompanies, currentCompanySlug]);

  const selectCompany = (slug: string) => {
    router.push(`/dashboard?company=${slug}`);
    if (mobile && onClose) onClose();
  };

  const activateSearch = useCallback(() => {
    if (!mobile) setCollapsed(false);
    setSearchActive(true);
  }, [mobile]);

  const deactivateSearch = useCallback((restoreFocus: boolean) => {
    setQuery("");
    setSearchActive(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => searchTriggerRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!searchActive) return;
    const frame = window.requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [searchActive]);

  useEffect(() => {
    if (!searchActive) return;
    const onOutsideClick = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Node && searchFieldRef.current?.contains(target)) return;
      deactivateSearch(false);
    };
    document.addEventListener("click", onOutsideClick);
    return () => document.removeEventListener("click", onOutsideClick);
  }, [deactivateSearch, searchActive]);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if (event.key.toLocaleLowerCase() === "l" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        activateSearch();
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, [activateSearch]);

  const matches = (label: string) => label.toLocaleLowerCase().includes(normalizedQuery);

  return localize((
    <aside
      className={cx(
        "flex shrink-0 flex-col justify-between overflow-hidden",
        mobile
          ? "h-full w-full static top-0 rounded-2xl sm:rounded-3xl border-0 bg-white dark:bg-[#0c101c] p-3"
          : cx(
              "h-[calc(100svh-1.5rem)] sticky top-3",
              flat
                ? "bg-background-full"
                : "rounded-3xl border border-border-button-white bg-background-secondary-default shadow-sidebar",
              collapsed
                ? "w-[60px] p-2.5"
                : fluid
                  ? "w-full p-2.5 lg:w-[260px]"
                  : "w-[260px] p-2.5"
            ),
        "transition-all duration-300 ease-in-out",
        className,
      )}
    >
      <div
        className={cx(
          "flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto overflow-x-hidden overscroll-contain",
          "[scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.45)_transparent]",
          "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700",
          "[&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500",
          collapsed ? "w-full items-center p-0" : "w-full pr-1 pb-6"
        )}
      >
        {/* Workspace switcher / collapse control */}
        <div
          className={cx(
            "flex w-full transition-[gap] duration-300 ease-in-out",
            collapsed
              ? "flex-col items-center justify-center gap-2 pt-0.5"
              : "flex-row items-center justify-between px-1",
          )}
        >
          <div
            className={cx(
              "transition-[max-width,opacity,transform] duration-300 ease-in-out",
              collapsed ? "w-full flex items-center justify-center" : "min-w-0 flex-1 overflow-hidden",
              mobile && flat && searchActive
                ? "max-w-0 scale-95 opacity-0"
                : "max-w-[206px] scale-100 opacity-100",
            )}
          >
            <DashboardUserMenu
              collapsed={collapsed}
              suppressHover={suppressUserHover}
              onHoverSuppressionEnd={() => setSuppressUserHover(false)}
              avatarClassName={
                flat
                  ? "bg-background-tertiary-default dark:bg-background-secondary-default"
                  : undefined
              }
            />
          </div>

          {mobile ? (
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={onClose}
              className="p-1.5 -mr-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <RiCloseLine className="size-5" aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              onClick={() => {
                const isExpanding = collapsedState;
                if (!isExpanding) deactivateSearch(false);
                setCollapsed(!collapsedState);
                setSuppressUserHover(isExpanding);
              }}
              className={cx(
                "cursor-pointer text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center shrink-0",
                collapsed ? "size-8 mx-auto" : "size-7",
              )}
            >
              <RiSideBarFill
                className={cx("size-4 transition-transform duration-300 ease-in-out", collapsed ? "rtl:-scale-x-100" : "-scale-x-100 rtl:scale-x-100")}
                aria-hidden
              />
            </button>
          )}
        </div>

        <div className="flex w-full flex-col gap-2">
          {/* Quick search */}
          {!flat && (searchActive && !collapsed ? (
            <div
              ref={searchFieldRef}
              className="flex w-full items-center gap-1.5 rounded-full bg-background-tertiary-default py-1.5 pe-2 ps-2 ring-2 ring-inset ring-border-button-active transition-[background-color,box-shadow] duration-200 ease"
            >
              <RiSearchLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
              <input
                ref={searchInputRef}
                type="search"
                aria-label="Filter navigation"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    deactivateSearch(true);
                  }
                }}
                placeholder="Search..."
                className="min-w-0 flex-1 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-tertiary"
              />
              <CloseButton
                size="2xs"
                aria-label="Clear navigation search"
                onClick={() => deactivateSearch(true)}
                className="bg-background-tertiary-hover size-4"
              />
            </div>
          ) : (
            <button
              ref={searchTriggerRef}
              type="button"
              aria-label="Quick Search"
              title={collapsed ? "Quick Search" : undefined}
              onClick={activateSearch}
              className={cx(
                "flex cursor-pointer items-center gap-2 p-1.5 hover:bg-background-tertiary-hover/55",
                "transition-[width,border-radius,background-color] duration-300 ease-in-out",
                collapsed
                  ? "size-9 rounded-full bg-background-tertiary-default justify-center mx-auto"
                  : "w-full rounded-full bg-background-tertiary-default px-2",
              )}
            >
              <span className={cx("flex min-w-0 items-center gap-1.5", !collapsed && "flex-1")}>
                <RiSearchLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                <Collapsible collapsed={collapsed}>
                  <span className="text-xs whitespace-nowrap text-text-secondary">
                    Quick Search
                  </span>
                </Collapsible>
              </span>
              <Collapsible collapsed={collapsed}>
                <Kbd className="text-[9px] px-1 py-0.5">⌘L</Kbd>
              </Collapsible>
            </button>
          ))}
          {/* Action Button: Back to Prep on System Design page, otherwise Share Question */}
          {isSystemDesignPage ? (
            <BaseButton
              variant="secondary"
              size="small"
              leadingIcon={RiArrowLeftLine}
              iconOnly={collapsed}
              aria-label="Back to Company Prep"
              onClick={() => {
                router.push("/dashboard");
                if (mobile && onClose) onClose();
              }}
              className={cx(
                "font-semibold transition-all border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800",
                collapsed ? "!size-8 !p-0 mx-auto" : "w-full rounded-xl"
              )}
            >
              Back to Prep
            </BaseButton>
          ) : (
            <BaseButton
              variant="primary"
              size="small"
              leadingIcon={RiAddFill}
              iconOnly={collapsed}
              aria-label="Share Question"
              onClick={() => setShareDialogOpen(true)}
              className={cx(
                "font-semibold transition-all shadow-xs",
                collapsed ? "!size-8 !p-0 mx-auto" : "w-full rounded-xl"
              )}
            >
              Share Question
            </BaseButton>
          )}

          {/* Primary Navigation Rows */}
          <nav className={cx("flex w-full flex-col gap-0.5 pb-6", !collapsed && "px-0.5")}>
            {isSystemDesignPage ? (
              <>
                {!collapsed && (
                  <div className="px-2 pt-1 pb-1">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      System Design Library
                    </span>
                  </div>
                )}

                {/* All Resources */}
                {matches("All Resources") && (
                  <NavItem
                    icon={RiStackLine}
                    label="All Resources"
                    href="/dashboard/system-design?tab=all"
                    badge={
                      <Badge
                        color={currentDesignTab === "all" ? "primary" : "neutral"}
                        className="text-[9px] font-mono font-bold px-1.5 py-0.2"
                      >
                        107
                      </Badge>
                    }
                    isSelected={currentDesignTab === "all"}
                    collapsed={collapsed}
                    onClick={() => mobile && onClose && onClose()}
                  />
                )}

                {/* YouTube Videos */}
                {matches("YouTube Videos") && (
                  <NavItem
                    icon={RiYoutubeLine}
                    label="YouTube Videos"
                    href="/dashboard/system-design?tab=youtube"
                    badge={
                      <Badge
                        color={currentDesignTab === "youtube" ? "primary" : "neutral"}
                        className="text-[9px] font-mono font-bold px-1.5 py-0.2"
                      >
                        47
                      </Badge>
                    }
                    isSelected={currentDesignTab === "youtube"}
                    collapsed={collapsed}
                    onClick={() => mobile && onClose && onClose()}
                  />
                )}

                {/* GitHub Repos */}
                {matches("GitHub Repos") && (
                  <NavItem
                    icon={RiGithubLine}
                    label="GitHub Repos"
                    href="/dashboard/system-design?tab=github"
                    badge={
                      <Badge
                        color={currentDesignTab === "github" ? "primary" : "neutral"}
                        className="text-[9px] font-mono font-bold px-1.5 py-0.2"
                      >
                        18
                      </Badge>
                    }
                    isSelected={currentDesignTab === "github"}
                    collapsed={collapsed}
                    onClick={() => mobile && onClose && onClose()}
                  />
                )}

                {/* Tech Blogs */}
                {matches("Tech Blogs") && (
                  <NavItem
                    icon={RiGlobalLine}
                    label="Tech Blogs"
                    href="/dashboard/system-design?tab=blogs"
                    badge={
                      <Badge
                        color={currentDesignTab === "blogs" ? "primary" : "neutral"}
                        className="text-[9px] font-mono font-bold px-1.5 py-0.2"
                      >
                        25
                      </Badge>
                    }
                    isSelected={currentDesignTab === "blogs"}
                    collapsed={collapsed}
                    onClick={() => mobile && onClose && onClose()}
                  />
                )}

                {/* Books & Papers */}
                {matches("Books & Whitepapers") && (
                  <NavItem
                    icon={RiBookOpenLine}
                    label="Books & Papers"
                    href="/dashboard/system-design?tab=books"
                    badge={
                      <Badge
                        color={currentDesignTab === "books" ? "primary" : "neutral"}
                        className="text-[9px] font-mono font-bold px-1.5 py-0.2"
                      >
                        17
                      </Badge>
                    }
                    isSelected={currentDesignTab === "books"}
                    collapsed={collapsed}
                    onClick={() => mobile && onClose && onClose()}
                  />
                )}

                {/* Quick Switcher back to other platforms */}
                {!collapsed && (
                  <div className="px-2 pt-3 pb-1 border-t border-slate-100 dark:border-zinc-800/60 mt-2">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      Quick Switch
                    </span>
                  </div>
                )}

                <NavItem
                  icon={RiBuildingLine}
                  label="Company Prep"
                  href="/dashboard"
                  collapsed={collapsed}
                  onClick={() => mobile && onClose && onClose()}
                />
                <NavItem
                  icon={RiGitBranchLine}
                  label="DSA Roadmap"
                  href="/dashboard/roadmap"
                  collapsed={collapsed}
                  onClick={() => mobile && onClose && onClose()}
                />
              </>
            ) : (
              <>
                {/* 1. Dashboard */}
                {matches("Dashboard") && (
                  <NavItem
                    icon={RiHomeLine}
                    label="Dashboard"
                    href="/dashboard"
                    isSelected={effectiveSelected === "dashboard" && !searchParams.get("company") && !isBookmarksActive}
                    collapsed={collapsed}
                    onClick={() => {
                      if (mobile && onClose) onClose();
                    }}
                  />
                )}

                {/* 2. Company Prep with Tree Branch Hierarchy */}
                {matches("Company Prep") && (
                  <div>
                    <NavItem
                      icon={RiBuildingLine}
                      label="Company Prep"
                      badge={
                        <Badge color={effectiveSelected === "companies" ? "primary" : "neutral"} className="text-[9px] font-mono font-bold px-1.5 py-0.2">
                          {allCompanies.length > 0 ? allCompanies.length : 694}
                        </Badge>
                      }
                      hasChevron
                      isExpanded={companiesOpen}
                      onClick={() => {
                        setCompaniesOpen(!companiesOpen);
                        if (collapsed) setCollapsed(false);
                      }}
                      collapsed={collapsed}
                    />

                    {/* Tree Branch Sub-Items with curved lines */}
                    {companiesOpen && !collapsed && (
                      <div className="space-y-0.5 mt-0.5 animate-in fade-in-50 duration-150">
                        {treeCompanies.map((company, index) => {
                          const isLast = !showMoreCompanies && allCompanies.length > 6
                            ? false
                            : index === treeCompanies.length - 1;
                          const isActive = currentCompanySlug === company.slug;

                          return (
                            <TreeBranchItem key={company.slug} isLast={isLast}>
                              <button
                                type="button"
                                onClick={() => selectCompany(company.slug)}
                                className={cx(
                                  "w-full flex items-center justify-between py-1 px-2 rounded-lg text-xs transition-colors cursor-pointer group text-left",
                                  isActive
                                    ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-semibold shadow-2xs"
                                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100/70 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100"
                                )}
                              >
                                <span className="truncate pr-1 text-[12px]">{company.name}</span>
                                <span
                                  className={cx(
                                    "text-[10px] font-mono font-medium px-1.5 py-0.2 rounded shrink-0",
                                    isActive
                                      ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-2xs"
                                      : "text-slate-400 dark:text-zinc-500 bg-slate-100/80 dark:bg-zinc-800/80"
                                  )}
                                >
                                  {company.problemCount}
                                </span>
                              </button>
                            </TreeBranchItem>
                          );
                        })}

                        {allCompanies.length > 6 && (
                          <TreeBranchItem isLast={true}>
                            <button
                              type="button"
                              onClick={() => setShowMoreCompanies(!showMoreCompanies)}
                              className="w-full flex items-center justify-between py-1 px-2 rounded-lg text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors cursor-pointer text-left"
                            >
                              <span>{showMoreCompanies ? "Show fewer" : "Show more companies"}</span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {showMoreCompanies ? "" : `+${allCompanies.length - 6}`}
                              </span>
                            </button>
                          </TreeBranchItem>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Discussions */}
                {matches("Discussions") && (
                  <NavItem
                    icon={RiMessage2Line}
                    label="Discussions"
                    href="/dashboard/discussions"
                    badge={<Badge color="primary" className="text-[9px] font-mono font-bold px-1.5 py-0.2">New</Badge>}
                    isSelected={effectiveSelected === "discussions"}
                    collapsed={collapsed}
                    onClick={() => mobile && onClose && onClose()}
                  />
                )}

                {/* 4. Interview Hub */}
                {matches("Interview Hub") && (
                  <NavItem
                    icon={RiFileTextLine}
                    label="Interview Hub"
                    href="/dashboard/interview-experiences"
                    badge={<Badge color="primary" className="text-[9px] font-mono font-bold px-1.5 py-0.2">New</Badge>}
                    isSelected={effectiveSelected === "interviews"}
                    collapsed={collapsed}
                    onClick={() => mobile && onClose && onClose()}
                  />
                )}

                {/* 5. DSA Roadmap */}
                {matches("DSA Roadmap") && (
                  <NavItem
                    icon={RiGitBranchLine}
                    label="DSA Roadmap"
                    href="/dashboard/roadmap"
                    badge={<Badge color="neutral" className="text-[9px] font-mono font-bold px-1.5 py-0.2">Tree</Badge>}
                    isSelected={effectiveSelected === "roadmap"}
                    collapsed={collapsed}
                    onClick={() => mobile && onClose && onClose()}
                  />
                )}

                {/* 6. System Design */}
                {matches("System Design") && (
                  <NavItem
                    icon={RiServerLine}
                    label="System Design"
                    href="/dashboard/system-design"
                    badge={<Badge color="primary" className="text-[9px] font-mono font-bold px-1.5 py-0.2">HLD</Badge>}
                    isSelected={effectiveSelected === "system-design"}
                    collapsed={collapsed}
                    onClick={() => mobile && onClose && onClose()}
                  />
                )}

                {/* 7. Leaderboard */}
                {matches("Leaderboard") && (
                  <NavItem
                    icon={RiTrophyLine}
                    label="Leaderboard"
                    href="/dashboard/leaderboard"
                    badge={<Badge color="neutral" className="text-[9px] font-mono font-bold px-1.5 py-0.2">Soon</Badge>}
                    isSelected={effectiveSelected === "leaderboard"}
                    collapsed={collapsed}
                    onClick={() => mobile && onClose && onClose()}
                  />
                )}

                {/* 8. Bookmarks */}
                {matches("Bookmarks") && (
                  <NavItem
                    icon={RiBookmarkLine}
                    label="Bookmarks"
                    href="/dashboard?status=BOOKMARKED"
                    isSelected={effectiveSelected === "bookmarks"}
                    collapsed={collapsed}
                    onClick={() => mobile && onClose && onClose()}
                  />
                )}

                {/* 9. My Profile */}
                {matches("My Profile") && (
                  <NavItem
                    icon={RiUserSmileLine}
                    label="My Profile"
                    href="/dashboard/profile"
                    isSelected={effectiveSelected === "profile"}
                    collapsed={collapsed}
                    onClick={() => mobile && onClose && onClose()}
                  />
                )}
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Bottom section (Support, Settings, and User profile card) */}
      <div className="flex w-full shrink-0 flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] z-10">
        <nav className="flex w-full flex-col gap-0.5">
          {matches("Support") && (
            <NavItem
              icon={RiCustomerServiceLine}
              label="Support"
              href="/contact"
              collapsed={collapsed}
              onClick={() => mobile && onClose && onClose()}
            />
          )}
          {matches("Settings") && (
            <NavItem
              icon={RiSettings4Line}
              label="Settings"
              collapsed={collapsed}
              onClick={() => setSettingsOpen(true)}
            />
          )}
        </nav>

        {/* User Card */}
        <DashboardTeamMenu
          collapsed={collapsed}
          className={flat ? "!bg-background-secondary-default" : undefined}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        planArtSrc="/templates/settings-plan-art.png"
      />

      {shareDialogOpen && (
        <SubmitQuestionDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          companySlug={currentCompanySlug}
          companyName={allCompanies.find((c) => c.slug === currentCompanySlug)?.name || "Google"}
          onSuccess={() => {
            router.refresh();
          }}
        />
      )}
    </aside>
  ));
}

/**
 * Main AppSidebar with Responsive Desktop + Mobile Drawer Sheet
 */
export function AppSidebar(props: AppSidebarProps) {
  const { openMobile, setOpenMobile } = useSidebar();

  // Close on Escape key
  useEffect(() => {
    if (!openMobile) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMobile(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openMobile, setOpenMobile]);

  return (
    <>
      {/* Desktop Sidebar (visible on md+) */}
      <div className="hidden md:flex shrink-0">
        <DashboardSidebar {...props} />
      </div>

      {/* Mobile Drawer (visible on < md when triggered by navbar hamburger) */}
      {openMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop (Tapping closes drawer) */}
          <div
            onClick={() => setOpenMobile(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
          />

          {/* Floating Rounded Mobile Sidebar Card (Curved on ALL 4 corners!) */}
          <div className="fixed top-2 bottom-2 left-2 z-50 w-[285px] xs:w-[295px] max-w-[calc(100vw-1rem)] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-left duration-200">
            <DashboardSidebar
              {...props}
              mobile={true}
              onClose={() => setOpenMobile(false)}
              className="!h-full !w-full !max-w-full !rounded-2xl sm:!rounded-3xl !border-0 !top-0 !static !shadow-none bg-white dark:bg-[#0c101c]"
            />
          </div>
        </div>
      )}
    </>
  );
}

export { AppSidebar as KodePrepSidebar };
export const DASHBOARD_NAV: DashboardNavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: RiHomeLine, href: "/dashboard" },
  { key: "companies", label: "Company Prep", icon: RiBuildingLine, href: "/dashboard", badge: 694 },
  { key: "discussions", label: "Discussions", icon: RiMessage2Line, href: "/dashboard/discussions", badge: "New" },
  { key: "interviews", label: "Interview Hub", icon: RiFileTextLine, href: "/dashboard/interview-experiences", badge: "New" },
  { key: "roadmap", label: "DSA Roadmap", icon: RiGitBranchLine, href: "/dashboard/roadmap", badge: "Tree" },
  { key: "leaderboard", label: "Leaderboard", icon: RiTrophyLine, href: "/dashboard/leaderboard", badge: "Soon" },
  { key: "bookmarks", label: "Bookmarks", icon: RiBookmarkLine, href: "/dashboard?status=BOOKMARKED" },
  { key: "profile", label: "My Profile", icon: RiUserSmileLine, href: "/dashboard/profile" },
];
