"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  ExternalLink,
  Search,
  LayoutGrid,
  List,
  Globe,
  MapPin,
  Calendar,
  Flame,
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
  Briefcase,
  GraduationCap,
  Compass,
  Radio,
  Zap,
  Building2,
  Star,
  ThumbsUp,
  Clock,
  SlidersHorizontal,
  Settings2,
  ArrowUpDown,
  X,
  RotateCcw,
  ChevronDown,
  User,
  Bookmark,
  Shuffle,
  PanelRightClose,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSolvedProblems } from "@/lib/hooks/use-solved-problems";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { useTargetCompanies } from "@/lib/hooks/use-target-companies";
import { Card } from "@/components/ui/card";
import { ProblemCardSkeleton } from "@/components/problem-card-skeleton";
import { ProblemItem, CodingPlatformType } from "@/types/problem";
import { CompanyLogo } from "@/components/company-logo";
import { CompanyTooltip } from "@/components/company-tooltip";
import { getCompanyDomain } from "@/lib/company-domains";
import { COMPANY_CATEGORIES } from "@/lib/company-categories";
import { getCompanyDetail } from "@/lib/company-details";
import { CodingPlatformIcon } from "@/components/coding-platform-icon";
import { toast } from "sonner";

function getPlatformBadge(platform?: CodingPlatformType) {
  switch (platform) {
    case "LEETCODE":
      return { label: "LeetCode", badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" };
    case "GEEKSFORGEEKS":
      return { label: "GFG", badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
    case "CODECHEF":
      return { label: "CodeChef", badgeClass: "bg-yellow-600/10 text-yellow-700 dark:text-yellow-400 border-yellow-600/30" };
    case "CODEFORCES":
      return { label: "Codeforces", badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" };
    case "ATCODER":
      return { label: "AtCoder", badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30" };
    case "HACKERRANK":
      return { label: "HackerRank", badgeClass: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30" };
    case "CODESTUDIO":
      return { label: "CodeStudio", badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" };
    case "HACKEREARTH":
      return { label: "HackerEarth", badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30" };
    case "INTERVIEWBIT":
      return { label: "InterviewBit", badgeClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30" };
    default:
      return { label: "Direct Q", badgeClass: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30" };
  }
}

function CategoryIcon({ name }: { name?: string }) {
  switch (name) {
    case "Flame":
      return <Flame className="size-3 text-rose-500 shrink-0" />;
    case "Sparkles":
      return <Zap className="size-3 text-fuchsia-500 shrink-0" />;
    case "TrendingUp":
      return <TrendingUp className="size-3 text-amber-500 shrink-0" />;
    case "Landmark":
      return <Landmark className="size-3 text-emerald-500 shrink-0" />;
    case "Crown":
      return <Crown className="size-3 text-purple-500 shrink-0" />;
    case "Cloud":
      return <Cloud className="size-3 text-sky-500 shrink-0" />;
    case "ShieldCheck":
      return <ShieldCheck className="size-3 text-teal-500 shrink-0" />;
    case "Cpu":
      return <Cpu className="size-3 text-indigo-500 shrink-0" />;
    case "ShoppingBag":
      return <ShoppingBag className="size-3 text-pink-500 shrink-0" />;
    case "Car":
      return <Car className="size-3 text-blue-600 shrink-0" />;
    case "UtensilsCrossed":
      return <UtensilsCrossed className="size-3 text-orange-500 shrink-0" />;
    case "MessageSquare":
      return <MessageSquare className="size-3 text-cyan-500 shrink-0" />;
    case "Gamepad2":
      return <Gamepad2 className="size-3 text-violet-500 shrink-0" />;
    case "Activity":
      return <Activity className="size-3 text-rose-600 shrink-0" />;
    case "Briefcase":
      return <Briefcase className="size-3 text-blue-500 shrink-0" />;
    case "GraduationCap":
      return <GraduationCap className="size-3 text-yellow-500 shrink-0" />;
    case "Compass":
      return <Compass className="size-3 text-emerald-600 shrink-0" />;
    case "Radio":
      return <Radio className="size-3 text-violet-600 shrink-0" />;
    case "Zap":
      return <Zap className="size-3 text-amber-600 shrink-0" />;
    default:
      return <Building2 className="size-3 text-primary shrink-0" />;
  }
}

const BADGE_COLOR_PALETTES = [
  "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
  "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
  "bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/30",
  "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
  "bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30",
  "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  "bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/30",
];

function getTopicBadgeStyle(topic: string): string {
  const lower = topic.toLowerCase();
  if (lower.includes("array") || lower.includes("vector"))
    return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30";
  if (lower.includes("string") || lower.includes("char"))
    return "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30";
  if (lower.includes("tree") || lower.includes("graph") || lower.includes("trie"))
    return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
  if (lower.includes("dynamic") || lower.includes("dp"))
    return "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30";
  if (lower.includes("hash") || lower.includes("map"))
    return "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30";
  if (lower.includes("sort") || lower.includes("search") || lower.includes("binary"))
    return "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30";
  if (lower.includes("math") || lower.includes("bit"))
    return "bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30";
  if (lower.includes("backtrack") || lower.includes("recursion"))
    return "bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/30";
  if (lower.includes("stack") || lower.includes("queue") || lower.includes("heap"))
    return "bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/30";

  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BADGE_COLOR_PALETTES[Math.abs(hash) % BADGE_COLOR_PALETTES.length];
}

interface CompanyProblemGridProps {
  problems: ProblemItem[];
  companyName: string;
  companySlug?: string;
}

const SORT_OPTIONS = [
  { id: "recent", label: "Most Recent" },
  { id: "number-asc", label: "LC # (1 → 3000)" },
  { id: "number-desc", label: "LC # (3000 → 1)" },
  { id: "title-asc", label: "Title (A → Z)" },
  { id: "diff-asc", label: "Difficulty (Easy → Hard)" },
  { id: "diff-desc", label: "Difficulty (Hard → Easy)" },
  { id: "popular", label: "Most Verified / Popular" },
] as const;

type SortOptionType = (typeof SORT_OPTIONS)[number]["id"];

export function CompanyProblemGrid({ problems, companyName, companySlug }: CompanyProblemGridProps) {
  // Discovery & Search
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filters
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [timeframeFilter, setTimeframeFilter] = useState<string>("ALL");
  const [platformFilter, setPlatformFilter] = useState<string>("ALL");
  const [sourceFilter, setSourceFilter] = useState<"ALL" | "CURATED" | "COMMUNITY">("ALL");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const [prevStatusParam, setPrevStatusParam] = useState(statusParam);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SOLVED" | "BOOKMARKED" | "UNSOLVED">(
    statusParam === "BOOKMARKED" ? "BOOKMARKED" : "ALL"
  );

  // Sync state when URL status parameter changes (e.g. from sidebar or back/forward navigation)
  if (statusParam !== prevStatusParam) {
    setPrevStatusParam(statusParam);
    if (statusParam === "BOOKMARKED") {
      setStatusFilter("BOOKMARKED");
    } else if (statusParam === "SOLVED" || statusParam === "UNSOLVED") {
      setStatusFilter(statusParam);
    } else {
      setStatusFilter("ALL");
    }
  }

  // Helper to update status filter both in component state and URL search params
  const updateStatusFilter = (newStatus: "ALL" | "SOLVED" | "BOOKMARKED" | "UNSOLVED") => {
    setStatusFilter(newStatus);
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === "BOOKMARKED") {
      params.set("status", "BOOKMARKED");
    } else if (newStatus === "SOLVED") {
      params.set("status", "SOLVED");
    } else if (newStatus === "UNSOLVED") {
      params.set("status", "UNSOLVED");
    } else {
      params.delete("status");
    }
    const newQuery = params.toString();
    const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
    router.replace(newUrl, { scroll: false });
  };

  // Secondary Toolbar: Sort, View, Pagination & Modals
  const [sortBy, setSortBy] = useState<SortOptionType>("recent");
  const [viewMode, setViewMode] = useState<"GRID" | "LIST">("GRID");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [filterTopicSearch, setFilterTopicSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Floating filter sidebar expanded sections state (matching reference image)
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    difficulty: true,
    timeframe: false,
    status: false,
    source: false,
    platform: false,
    topics: false,
  });

  const toggleExpandedFilter = (key: string) => {
    setExpandedFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Upvoting & solved state
  const [upvotesState, setUpvotesState] = useState<Record<number, number>>({});
  const [votedIds, setVotedIds] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem("codeprep_upvoted_problems");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          return new Set(arr);
        }
      }
    } catch {
      // ignore
    }
    return new Set();
  });
  const pageSize = 12;

  // Card-only Skeleton & Switching Transition State (zero artificial delay)
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const prevCompanySlug = useRef(companySlug);

  useEffect(() => {
    const handleSwitchStart = () => {
      setIsSwitching(true);
    };
    window.addEventListener("company-switch-start", handleSwitchStart);
    return () => window.removeEventListener("company-switch-start", handleSwitchStart);
  }, []);

  useEffect(() => {
    if (prevCompanySlug.current !== companySlug) {
      prevCompanySlug.current = companySlug;
      setIsSwitching(false);
    }
  }, [companySlug, problems]);

  const { isSolved } = useSolvedProblems();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isTarget, toggleTarget } = useTargetCompanies();

  // Responsive mobile detector
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleUpvote = async (problemId: number) => {
    if (votedIds.has(problemId)) {
      toast.info("You've already verified this question!");
      return;
    }

    const nextVoted = new Set(votedIds).add(problemId);
    setVotedIds(nextVoted);

    try {
      localStorage.setItem("codeprep_upvoted_problems", JSON.stringify(Array.from(nextVoted)));
    } catch (e) {
      console.error(e);
    }

    setUpvotesState((prev) => ({
      ...prev,
      [problemId]: (prev[problemId] ?? 0) + 1,
    }));

    const realId = problemId >= 1_000_000 ? problemId - 1_000_000 : problemId;
    try {
      const res = await fetch(`/api/submissions/${realId}/upvote`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && !data.alreadyVoted) {
        toast.success("Verified question!");
      } else if (data.alreadyVoted) {
        toast.info("You've already verified this question.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Company metadata
  const slug = useMemo(() => {
    return (companySlug || companyName).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  }, [companySlug, companyName]);

  const category = useMemo(() => {
    return COMPANY_CATEGORIES.find((c) => c.slugs.includes(slug));
  }, [slug]);

  const details = useMemo(() => {
    return getCompanyDetail(slug, category?.name);
  }, [slug, category]);

  const domain = useMemo(() => {
    return getCompanyDomain(companyName);
  }, [companyName]);

  // Extract all topics dynamically with counts
  const allTopicsWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of problems) {
      if (p.topics && Array.isArray(p.topics)) {
        for (const t of p.topics) {
          counts[t] = (counts[t] || 0) + 1;
        }
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([topic, count]) => ({ topic, count }));
  }, [problems]);

  // Available platforms in this company problem set
  const availablePlatforms = useMemo(() => {
    const set = new Set<string>();
    for (const p of problems) {
      if (p.platform) set.add(p.platform);
    }
    return Array.from(set);
  }, [problems]);

  // Toggle single topic
  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
    setCurrentPage(1);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSearch("");
    setDifficultyFilter("ALL");
    setSelectedTopics([]);
    setTimeframeFilter("ALL");
    setPlatformFilter("ALL");
    setSourceFilter("ALL");
    setCurrentPage(1);
    updateStatusFilter("ALL");
  };

  // Active filter count calculation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (difficultyFilter !== "ALL") count++;
    if (selectedTopics.length > 0) count += selectedTopics.length;
    if (timeframeFilter !== "ALL") count++;
    if (platformFilter !== "ALL") count++;
    if (statusFilter !== "ALL") count++;
    if (sourceFilter !== "ALL") count++;
    return count;
  }, [difficultyFilter, selectedTopics, timeframeFilter, platformFilter, statusFilter, sourceFilter]);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      // 1. Search (Title, LC Number, Slug, Topics, Platform)
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchTitle = (p.title || "").toLowerCase().includes(q);
        const matchSlug = (p.slug || "").toLowerCase().includes(q);
        const matchNumber = p.leetcodeNumber != null && String(p.leetcodeNumber).includes(q);
        const matchPlatform = p.platform?.toLowerCase().includes(q);
        const matchTopic = p.topics?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSlug && !matchNumber && !matchPlatform && !matchTopic) {
          return false;
        }
      }

      // 2. Difficulty
      if (difficultyFilter !== "ALL" && p.difficulty !== difficultyFilter) {
        return false;
      }

      // 3. Topics (matches any of the selected topics)
      if (selectedTopics.length > 0) {
        if (!p.topics || !selectedTopics.some((st) => p.topics.includes(st))) {
          return false;
        }
      }

      // 4. Timeframe
      if (timeframeFilter === "THIRTY_DAYS" && p.timeframe !== "THIRTY_DAYS") return false;
      if (
        timeframeFilter === "THREE_MONTHS" &&
        !(p.timeframe === "THIRTY_DAYS" || p.timeframe === "THREE_MONTHS")
      )
        return false;
      if (
        timeframeFilter === "SIX_MONTHS" &&
        !(
          p.timeframe === "THIRTY_DAYS" ||
          p.timeframe === "THREE_MONTHS" ||
          p.timeframe === "SIX_MONTHS"
        )
      )
        return false;
      if (
        timeframeFilter === "MORE_THAN_SIX_MONTHS" &&
        !(p.timeframe === "MORE_THAN_SIX_MONTHS" || p.timeframe === "ALL")
      )
        return false;

      // 5. Platform
      if (platformFilter !== "ALL" && p.platform !== platformFilter) {
        return false;
      }

      // 6. Solved / Bookmark Status
      if (statusFilter === "SOLVED" && !isSolved(p.id)) return false;
      if (statusFilter === "UNSOLVED" && isSolved(p.id)) return false;
      if (statusFilter === "BOOKMARKED" && !isBookmarked(p.id)) return false;

      // 7. Source
      if (sourceFilter === "COMMUNITY" && !p.isCommunity) return false;
      if (sourceFilter === "CURATED" && p.isCommunity) return false;

      return true;
    });
  }, [
    problems,
    search,
    difficultyFilter,
    selectedTopics,
    timeframeFilter,
    platformFilter,
    statusFilter,
    sourceFilter,
    isSolved,
    isBookmarked,
  ]);

  // Sort problems safely
  const sortedProblems = useMemo(() => {
    const list = [...filteredProblems];
    switch (sortBy) {
      case "number-asc":
        return list.sort((a, b) => (a.leetcodeNumber ?? 999999) - (b.leetcodeNumber ?? 999999));
      case "number-desc":
        return list.sort((a, b) => (b.leetcodeNumber ?? 0) - (a.leetcodeNumber ?? 0));
      case "title-asc":
        return list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      case "diff-asc": {
        const rank: Record<string, number> = { EASY: 1, MEDIUM: 2, HARD: 3 };
        return list.sort((a, b) => {
          const rankA = rank[a.difficulty?.toUpperCase()] ?? 99;
          const rankB = rank[b.difficulty?.toUpperCase()] ?? 99;
          return rankA - rankB;
        });
      }
      case "diff-desc": {
        const rank: Record<string, number> = { EASY: 1, MEDIUM: 2, HARD: 3 };
        return list.sort((a, b) => {
          const rankA = rank[a.difficulty?.toUpperCase()] ?? 0;
          const rankB = rank[b.difficulty?.toUpperCase()] ?? 0;
          return rankB - rankA;
        });
      }
      case "popular":
        return list.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
      case "recent":
      default:
        return list;
    }
  }, [filteredProblems, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProblems.length / pageSize) || 1;
  const currentPageClamped = Math.min(currentPage, totalPages);

  const paginatedProblems = useMemo(() => {
    const start = (currentPageClamped - 1) * pageSize;
    return sortedProblems.slice(start, start + pageSize);
  }, [sortedProblems, currentPageClamped, pageSize]);

  // Counts for UI indicators
  const easyCount = useMemo(() => problems.filter((p) => p.difficulty === "EASY").length, [problems]);
  const mediumCount = useMemo(() => problems.filter((p) => p.difficulty === "MEDIUM").length, [problems]);
  const hardCount = useMemo(() => problems.filter((p) => p.difficulty === "HARD").length, [problems]);
  const solvedCount = useMemo(() => problems.filter((p) => isSolved(p.id)).length, [problems, isSolved]);
  const bookmarkedCount = useMemo(() => problems.filter((p) => isBookmarked(p.id)).length, [problems, isBookmarked]);
  const communityCount = useMemo(() => problems.filter((p) => p.isCommunity).length, [problems]);
  const curatedCount = problems.length - communityCount;
  const thirtyDaysCount = useMemo(() => problems.filter((p) => p.timeframe === "THIRTY_DAYS").length, [problems]);
  const threeMonthsCount = useMemo(
    () => problems.filter((p) => p.timeframe === "THIRTY_DAYS" || p.timeframe === "THREE_MONTHS").length,
    [problems]
  );
  const sixMonthsCount = useMemo(
    () =>
      problems.filter(
        (p) =>
          p.timeframe === "THIRTY_DAYS" ||
          p.timeframe === "THREE_MONTHS" ||
          p.timeframe === "SIX_MONTHS"
      ).length,
    [problems]
  );
  const moreThanSixMonthsCount = Math.max(0, problems.length - sixMonthsCount);

  const timeframeLabels: Record<string, string> = {
    ALL: "All Time",
    THIRTY_DAYS: "Past 30 Days",
    THREE_MONTHS: "Past 3 Months",
    SIX_MONTHS: "Past 6 Months",
    MORE_THAN_SIX_MONTHS: "Past Year (6+ Mo)",
  };

  // Random question picker (Shuffle)
  const handlePickRandomProblem = () => {
    if (filteredProblems.length === 0) {
      toast.error("No questions match the current filters");
      return;
    }
    const randomIndex = Math.floor(Math.random() * filteredProblems.length);
    const picked = filteredProblems[randomIndex];
    setIsFilterSheetOpen(false);
    toast.success(`Picked: ${picked.title}`, {
      description: `Difficulty: ${picked.difficulty} • ${picked.platform || "LeetCode"}`,
      action: picked.leetcodeUrl
        ? {
            label: "Open Question",
            onClick: () => window.open(picked.leetcodeUrl, "_blank"),
          }
        : undefined,
    });
    if (picked.leetcodeUrl) {
      window.open(picked.leetcodeUrl, "_blank");
    }
  };

  // Keyboard shortcut listener for / (search), Escape (close modal), and R (shuffle/random)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Search shortcut / or Cmd+K
      if (
        (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // 2. Escape to close filter panel
      if (e.key === "Escape" && isFilterSheetOpen) {
        e.preventDefault();
        setIsFilterSheetOpen(false);
        return;
      }

      // 3. 'R' or 'r' to shuffle / pick random question while panel is open
      if ((e.key === "r" || e.key === "R") && isFilterSheetOpen) {
        const activeEl = document.activeElement;
        if (activeEl?.tagName !== "INPUT" && activeEl?.tagName !== "TEXTAREA") {
          e.preventDefault();
          handlePickRandomProblem();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFilterSheetOpen, filteredProblems]);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* ========================================================================= */}
      {/* 1. COMPACT & CLEAN COMPANY HEADER                                         */}
      {/* Sleek mobile-first design, all information preserved in minimal height    */}
      {/* ========================================================================= */}
      <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-card border shadow-xs relative overflow-hidden">
        <div className="flex items-start justify-between gap-2.5 sm:gap-4">
          {/* Identity: Logo + Details */}
          <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 flex-1">
            <div className="shrink-0 p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-white dark:bg-card/90 border border-border/80 shadow-xs flex items-center justify-center">
              <CompanyLogo
                name={companyName}
                showTooltip
                problemCount={problems.length}
                className="size-9 sm:size-12 md:size-14 text-sm sm:text-lg rounded-md sm:rounded-lg cursor-pointer transition-transform hover:scale-105"
              />
            </div>

            <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <CompanyTooltip name={companyName} problemCount={problems.length} side="bottom" align="start">
                  <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight leading-tight hover:text-primary transition-colors cursor-pointer">
                    {companyName}
                  </h1>
                </CompanyTooltip>

                {category && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted/80 text-foreground text-[10px] sm:text-xs font-semibold border border-border/70 shadow-2xs">
                    <CategoryIcon name={category.iconName} />
                    <span className="truncate max-w-[120px] sm:max-w-[180px]">{category.name}</span>
                  </span>
                )}
              </div>

              {/* Description - Compact 1 line on mobile */}
              {details.description && (
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug line-clamp-1 sm:line-clamp-2">
                  {details.description}
                </p>
              )}

              {/* Location, Founded & Website */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] sm:text-[11px] text-muted-foreground pt-0.5">
                {details.hq && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-2.5 text-muted-foreground/70 shrink-0" />
                    <span>{details.hq}</span>
                  </span>
                )}
                {details.founded && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-2.5 text-muted-foreground/70 shrink-0" />
                    <span>
                      {details.founded.startsWith("19") || details.founded.startsWith("20")
                        ? `Est. ${details.founded}`
                        : details.founded}
                    </span>
                  </span>
                )}
                {domain && (
                  <a
                    href={`https://${domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-mono text-[10px] sm:text-[11px] transition-colors"
                  >
                    <Globe className="size-2.5 shrink-0 text-muted-foreground" />
                    <span>{domain}</span>
                    <ExternalLink className="size-2 shrink-0" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Action: Pin Target Button */}
          <button
            type="button"
            onClick={() => toggleTarget(slug)}
            className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold border transition-all shadow-2xs cursor-pointer shrink-0 ${
              isTarget(slug)
                ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25"
                : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border"
            }`}
            title={isTarget(slug) ? "Pinned in My Target Companies" : "Pin to My Target Companies"}
          >
            <Star className={`size-3 sm:size-3.5 shrink-0 ${isTarget(slug) ? "fill-amber-400 text-amber-500" : ""}`} />
            <span className="hidden xs:inline">{isTarget(slug) ? "Targeted" : "Pin Target"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CONTROLS TOOLBAR: COMPACT SEARCH + FILTERS + SORT + VIEW               */}
      {/* Small, mobile-optimized search inline with controls on desktop            */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-0.5">
        {/* Search — Small, compact & matches theme (white in light mode, dark in dark mode) */}
        <div className="relative w-full max-w-[320px] md:w-64 lg:w-72 shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none stroke-[1.75]" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search problems, topics, number..."
            className="w-full h-8 sm:h-8.5 pl-8 pr-7 rounded-md border border-border bg-card hover:border-border/80 text-foreground text-xs sm:text-[13px] placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 transition-all shadow-2xs"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {search ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                  searchInputRef.current?.focus();
                }}
                className="p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <kbd className="hidden md:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted/70 border border-border/80 rounded select-none pointer-events-none">
                <span>/</span>
              </kbd>
            )}
          </div>
        </div>

        {/* Toolbar Controls: Filters + Saved + Sort + View */}
        <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible">
          {/* Customize Button (Matching ReUI 1:1) */}
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(!isFilterSheetOpen)}
            aria-pressed={isFilterSheetOpen}
            aria-label={isFilterSheetOpen ? "Close customizer" : "Open customizer"}
            className={cn(
              "flex-1 sm:flex-none sm:w-auto sm:px-3 sm:h-8.5 min-w-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer shadow-2xs",
              isFilterSheetOpen
                ? "bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:border-white"
                : activeFilterCount > 0
                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                : "bg-card hover:bg-muted text-foreground border-border"
            )}
            title="Customize and filter questions"
          >
            <Settings2 className="size-3.5 shrink-0" />
            <span className="truncate">Customize</span>
            {activeFilterCount > 0 && (
              <span className="size-4.5 rounded-full bg-white text-primary text-[10px] font-extrabold flex items-center justify-center shrink-0">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Quick Saved Filter Toggle */}
          <button
            type="button"
            onClick={() => {
              updateStatusFilter(statusFilter === "BOOKMARKED" ? "ALL" : "BOOKMARKED");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:h-8.5 rounded-md text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
              statusFilter === "BOOKMARKED"
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40 hover:bg-amber-500/25"
                : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border"
            }`}
            title={statusFilter === "BOOKMARKED" ? "Showing saved questions (click to clear)" : "Filter saved questions"}
          >
            <Bookmark className={`size-3.5 shrink-0 ${statusFilter === "BOOKMARKED" ? "fill-amber-500 text-amber-500" : ""}`} />
            <span className="hidden xs:inline">Saved</span>
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                statusFilter === "BOOKMARKED"
                  ? "bg-amber-500/25 text-amber-600 dark:text-amber-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {bookmarkedCount}
            </span>
          </button>

          {/* Sort Select */}
          <div className="relative flex-1 sm:flex-none sm:w-44 sm:h-8.5 min-w-0">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOptionType);
                setCurrentPage(1);
              }}
              aria-label="Sort questions"
              className="w-full h-full appearance-none pl-6 pr-5 py-1.5 sm:py-0 rounded-md text-[11.5px] sm:text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/40 truncate text-left"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-popover text-popover-foreground py-1 text-xs">
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-0.5 p-0.5 bg-muted/60 rounded-md border border-border/70 shrink-0 md:ml-auto">
            <button
              type="button"
              onClick={() => setViewMode("GRID")}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === "GRID"
                  ? "bg-card text-primary font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("LIST")}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === "LIST"
                  ? "bg-card text-primary font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="List View"
            >
              <List className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TOTAL QUESTIONS COUNT (CLEAN, PROMINENT, UNCONSTRAINED ROW)            */}
      {/* Never squished onto 2 lines, spacious and bold                            */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between pt-1 pb-0.5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
            {filteredProblems.length.toLocaleString()} Questions
          </h2>
          {filteredProblems.length !== problems.length && (
            <span className="text-[11px] text-muted-foreground">
              (filtered from {problems.length.toLocaleString()})
            </span>
          )}
        </div>

        {difficultyFilter !== "ALL" && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-foreground border capitalize">
            {difficultyFilter.toLowerCase()} only
          </span>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. ACTIVE FILTERS (2 FILTERS PER ROW ON MOBILE, NEVER CUT OFF)            */}
      {/* ========================================================================= */}
      {(activeFilterCount > 0 || search.trim()) && (
        <div className="space-y-1.5 pt-1 pb-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <span>Active Filters</span>
              <span className="size-4 rounded-full bg-primary/10 text-primary text-[9px] font-extrabold flex items-center justify-center">
                {activeFilterCount + (search.trim() ? 1 : 0)}
              </span>
            </span>
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-2 max-w-2xl gap-1.5 sm:gap-2">
            {search.trim() && (
              <span className="w-full min-w-0 inline-flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-medium bg-muted/80 text-foreground border border-border/80 shadow-2xs">
                <span className="truncate">&ldquo;{search}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="hover:text-rose-500 cursor-pointer shrink-0 ml-1"
                  aria-label="Clear search"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {difficultyFilter !== "ALL" && (
              <span className="w-full min-w-0 inline-flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-medium bg-muted/80 text-foreground border border-border/80 shadow-2xs capitalize">
                <span className="truncate">Difficulty: {difficultyFilter.toLowerCase()}</span>
                <button
                  type="button"
                  onClick={() => setDifficultyFilter("ALL")}
                  className="hover:text-rose-500 cursor-pointer shrink-0 ml-1"
                  aria-label="Remove difficulty filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {selectedTopics.map((topic) => (
              <span
                key={topic}
                className="w-full min-w-0 inline-flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-2xs"
              >
                <span className="truncate">{topic}</span>
                <button
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className="hover:text-rose-500 cursor-pointer shrink-0 ml-1"
                  aria-label={`Remove topic ${topic}`}
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}

            {timeframeFilter !== "ALL" && (
              <span className="w-full min-w-0 inline-flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-medium bg-muted/80 text-foreground border border-border/80 shadow-2xs">
                <span className="truncate">Time: {timeframeLabels[timeframeFilter]}</span>
                <button
                  type="button"
                  onClick={() => setTimeframeFilter("ALL")}
                  className="hover:text-rose-500 cursor-pointer shrink-0 ml-1"
                  aria-label="Remove timeframe filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {platformFilter !== "ALL" && (
              <span className="w-full min-w-0 inline-flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-medium bg-muted/80 text-foreground border border-border/80 shadow-2xs">
                <span className="truncate">Platform: {getPlatformBadge(platformFilter as CodingPlatformType).label}</span>
                <button
                  type="button"
                  onClick={() => setPlatformFilter("ALL")}
                  className="hover:text-rose-500 cursor-pointer shrink-0 ml-1"
                  aria-label="Remove platform filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {statusFilter !== "ALL" && (
              <span className="w-full min-w-0 inline-flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-medium bg-muted/80 text-foreground border border-border/80 shadow-2xs capitalize">
                <span className="truncate">Status: {statusFilter.toLowerCase()}</span>
                <button
                  type="button"
                  onClick={() => updateStatusFilter("ALL")}
                  className="hover:text-rose-500 cursor-pointer shrink-0 ml-1"
                  aria-label="Remove status filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {sourceFilter !== "ALL" && (
              <span className="w-full min-w-0 inline-flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-medium bg-muted/80 text-foreground border border-border/80 shadow-2xs capitalize">
                <span className="truncate">Source: {sourceFilter.toLowerCase()}</span>
                <button
                  type="button"
                  onClick={() => setSourceFilter("ALL")}
                  className="hover:text-rose-500 cursor-pointer shrink-0 ml-1"
                  aria-label="Remove source filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. PROBLEM LIST / GRID                                                    */}
      {/* Clean, uncrowded cards immediately visible on screen                      */}
      {/* ========================================================================= */}
      {sortedProblems.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 sm:py-16 border rounded-lg bg-card p-6">
          <div className="mx-auto size-12 rounded-full bg-muted/70 flex items-center justify-center mb-3">
            <Search className="size-6 text-muted-foreground/60" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">No questions match your filters</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Try adjusting your search query, difficulty, timeframe, or topic filters.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="size-3.5" />
            <span>Clear All Filters</span>
          </button>
        </div>
      ) : isInitialLoading || isSwitching ? (
        /* Box Format Card Skeleton Grid - Cards Only (Sidebar & Navbar remain unchanged) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProblemCardSkeleton key={i} delay={i * 80} />
          ))}
        </div>
      ) : viewMode === "GRID" ? (
        /* Box Format Card Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {paginatedProblems.map((p) => {
            const solved = isSolved(p.id);
            const bookmarked = isBookmarked(p.id);
            const platformInfo = getPlatformBadge(p.platform);
            const isUpvoted = votedIds.has(p.id);
            const currentVotes = (p.upvotes ?? 0) + (upvotesState[p.id] ?? 0);
            const displayCompanies =
              p.companiesAsking && p.companiesAsking.length > 0
                ? p.companiesAsking
                : p.isCommunity
                ? [{ name: companyName, slug: companySlug || "" }]
                : [];

            return (
              <Card
                key={p.id}
                className={`p-3.5 sm:p-4 rounded-lg flex flex-col justify-between transition-all duration-200 hover:border-primary/50 hover:shadow-xs relative group border ${
                  solved ? "bg-primary/5 border-emerald-500/30" : "bg-card"
                }`}
              >
                <div>
                  {/* Top Bar: Platform Logo + Round / ID + Recency + Difficulty + Bookmark */}
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                      <CodingPlatformIcon platform={p.platform || "LEETCODE"} className="size-3.5 sm:size-4 shrink-0" />
                      <span className="text-[10px] font-mono font-medium text-muted-foreground shrink-0">
                        {p.isCommunity ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                            Community
                          </span>
                        ) : p.leetcodeNumber ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-muted text-foreground border border-border/80">
                            LC {p.leetcodeNumber}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">{p.slug}</span>
                        )}
                      </span>

                      {p.roundType && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60 truncate max-w-[95px]">
                          {p.roundType}
                        </span>
                      )}

                      {/* Recency Badge */}
                      {p.interviewDate ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 shrink-0">
                          <Calendar className="size-2.5" />
                          <span>Asked {p.interviewDate}</span>
                        </span>
                      ) : p.timeframe === "THIRTY_DAYS" ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 shrink-0">
                          <Clock className="size-2.5" />
                          <span>Past 30 Days</span>
                        </span>
                      ) : p.timeframe === "THREE_MONTHS" ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1 shrink-0">
                          <Clock className="size-2.5" />
                          <span>Past 3 Months</span>
                        </span>
                      ) : p.timeframe === "SIX_MONTHS" ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1 shrink-0">
                          <Clock className="size-2.5" />
                          <span>Past 6 Months</span>
                        </span>
                      ) : null}
                    </div>

                    {/* Difficulty Badge & Bookmark Button */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                          p.difficulty === "EASY"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : p.difficulty === "MEDIUM"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {p.difficulty}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleBookmark(p.id, p.title);
                        }}
                        className={`size-6.5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                          bookmarked
                            ? "bg-amber-500/15 border-amber-500/40 text-amber-500 hover:bg-amber-500/25 shadow-2xs"
                            : "bg-muted/40 border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        title={bookmarked ? "Remove from bookmarks" : "Save question"}
                        aria-label={bookmarked ? "Remove from bookmarks" : "Save question"}
                      >
                        <Bookmark className={`size-3.5 ${bookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Problem Title: Clean title without repeating LC number */}
                  <h3
                    className={`font-bold text-[13px] sm:text-sm leading-snug text-foreground mb-2 line-clamp-2 ${
                      solved ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {p.title}
                  </h3>

                  {/* Optional Notes for Community Questions */}
                  {p.notes && (
                    <p className="text-[11px] text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/50 mb-2 line-clamp-2 italic">
                      &ldquo;{p.notes}&rdquo;
                    </p>
                  )}

                  {/* Topics Tags Pills (WITHOUT # symbol) */}
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5">
                    {p.topics.map((t: string, i: number) => (
                      <span
                        key={i}
                        className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-medium border ${getTopicBadgeStyle(
                          t
                        )}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action & Tagged Companies */}
                <div className="pt-2 border-t space-y-1.5 mt-auto">
                  {/* Company & Author attribution */}
                  <div className="space-y-1">
                    {displayCompanies.length > 0 && (
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {p.isCommunity ? "Interview at:" : "Asked by:"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {displayCompanies.slice(0, 4).map((c, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <CompanyLogo
                                name={c.name}
                                showTooltip
                                className="size-5 text-[9px] rounded-md border border-border/60 cursor-pointer hover:scale-110 transition-transform"
                              />
                              {idx === 0 && (
                                <span className="text-[11px] font-semibold text-foreground/90 truncate max-w-[140px]">
                                  {c.name}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dedicated Author Line for Community Questions */}
                    {p.isCommunity && (
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                        <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                          <User className="size-3 text-muted-foreground" />
                          <span>Author:</span>
                        </span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          {p.submittedBy?.photoUrl ? (
                            <img
                              src={p.submittedBy.photoUrl}
                              alt=""
                              className="size-4 rounded-full object-cover border border-border shrink-0"
                            />
                          ) : (
                            <span className="size-4 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center shrink-0">
                              {(p.submittedBy?.displayName || "C")[0].toUpperCase()}
                            </span>
                          )}
                          <span className="text-[11px] font-medium text-foreground/90 truncate max-w-[140px]">
                            {p.submittedBy?.displayName || "Community Member"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Platform Link & Upvote Action */}
                  <div className="flex items-center justify-between pt-0.5 gap-2">
                    {p.isCommunity ? (
                      <button
                        type="button"
                        onClick={() => handleUpvote(p.id)}
                        disabled={isUpvoted}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium border border-border/80 bg-background text-muted-foreground transition-all ${
                          isUpvoted
                            ? "opacity-80 cursor-default"
                            : "hover:bg-muted hover:text-foreground cursor-pointer active:scale-95 shadow-2xs"
                        }`}
                        title={isUpvoted ? "You verified this question" : "I was also asked this question (+1 verification)"}
                      >
                        <ThumbsUp className="size-3 text-muted-foreground" />
                        <span>{currentVotes} verified</span>
                        {isUpvoted && <span className="text-[10px] font-semibold text-muted-foreground">✓</span>}
                      </button>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground font-mono truncate max-w-[40%]">
                        {p.leetcodeNumber ? `LC ${p.leetcodeNumber}` : p.slug}
                      </span>
                    )}

                    {p.leetcodeUrl ? (
                      <a
                        href={p.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-primary hover:underline group-hover:translate-x-0.5 transition-transform shrink-0"
                      >
                        <CodingPlatformIcon platform={p.platform || "LEETCODE"} className="size-3.5 shrink-0" />
                        <span>Solve on {platformInfo.label}</span>
                        <ExternalLink className="size-2.5" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">In-person Q</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View (Table on Desktop, Adaptive on Mobile) */
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px] sm:min-w-[750px]">
              <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider border-b">
                <tr>
                  <th className="py-2.5 px-3 sm:px-4 min-w-[220px] sm:min-w-[280px]">Problem Title</th>
                  <th className="py-2.5 px-3 sm:px-4">Platform</th>
                  <th className="py-2.5 px-3 sm:px-4">Difficulty</th>
                  <th className="py-2.5 px-3 sm:px-4">Topics</th>
                  <th className="py-2.5 px-3 sm:px-4">Companies</th>
                  <th className="py-2.5 px-3 sm:px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedProblems.map((p) => {
                  const solved = isSolved(p.id);
                  const bookmarked = isBookmarked(p.id);
                  const platformInfo = getPlatformBadge(p.platform);
                  const isUpvoted = votedIds.has(p.id);
                  const currentVotes = (p.upvotes ?? 0) + (upvotesState[p.id] ?? 0);
                  const displayCompanies =
                    p.companiesAsking && p.companiesAsking.length > 0
                      ? p.companiesAsking
                      : p.isCommunity
                      ? [{ name: companyName, slug: companySlug || "" }]
                      : [];

                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-3 sm:px-4 font-medium text-foreground min-w-[220px] sm:min-w-[280px]">
                        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                          <CodingPlatformIcon platform={p.platform || "LEETCODE"} className="size-4 shrink-0 mt-0.5 sm:mt-0" />
                          <div className="min-w-0 flex flex-col gap-0.5">
                            <span className={`leading-snug font-medium ${solved ? "line-through text-muted-foreground" : ""}`}>
                              {p.leetcodeNumber ? `${p.leetcodeNumber}. ${p.title}` : p.title}
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {p.roundType && (
                                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60 whitespace-nowrap">
                                  {p.roundType}
                                </span>
                              )}
                              {p.interviewDate ? (
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                                  Asked {p.interviewDate}
                                </span>
                              ) : p.timeframe === "THIRTY_DAYS" ? (
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                                  Past 30 Days
                                </span>
                              ) : p.timeframe === "THREE_MONTHS" ? (
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap">
                                  Past 3 Months
                                </span>
                              ) : p.timeframe === "SIX_MONTHS" ? (
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 whitespace-nowrap">
                                  Past 6 Months
                                </span>
                              ) : null}
                              {p.isCommunity && (
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap inline-flex items-center gap-1">
                                  <span>•</span>
                                  <User className="size-2.5 text-muted-foreground inline" />
                                  <span>by {p.submittedBy?.displayName || "Community Member"}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 sm:px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${platformInfo.badgeClass}`}>
                          <CodingPlatformIcon platform={p.platform || "LEETCODE"} className="size-3" />
                          <span>{platformInfo.label}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 sm:px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                            p.difficulty === "EASY"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : p.difficulty === "MEDIUM"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 sm:px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.topics.slice(0, 3).map((t: string, i: number) => (
                            <span
                              key={i}
                              className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium border ${getTopicBadgeStyle(
                                t
                              )}`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 sm:px-4">
                        <div className="flex items-center gap-1">
                          {displayCompanies.slice(0, 3).map((c, idx) => (
                            <CompanyLogo
                              key={idx}
                              name={c.name}
                              showTooltip
                              className="size-5 text-[9px] rounded-md cursor-pointer hover:scale-110 transition-transform"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          {p.isCommunity && (
                            <button
                              type="button"
                              onClick={() => handleUpvote(p.id)}
                              disabled={isUpvoted}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border border-border/80 bg-background text-muted-foreground transition-all ${
                                isUpvoted
                                  ? "opacity-80 cursor-default"
                                  : "hover:bg-muted hover:text-foreground cursor-pointer active:scale-95"
                              }`}
                              title={isUpvoted ? "You verified this question" : "I was also asked this question (+1 verification)"}
                            >
                              <ThumbsUp className="size-2.5 text-muted-foreground" />
                              <span>{currentVotes}</span>
                              {isUpvoted && <span className="text-[9px] font-semibold text-muted-foreground">✓</span>}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleBookmark(p.id, p.title)}
                            className={`size-6.5 rounded-md flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                              bookmarked
                                ? "bg-amber-500/15 border-amber-500/40 text-amber-500 hover:bg-amber-500/25 shadow-2xs"
                                : "bg-muted/40 border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                            title={bookmarked ? "Remove from bookmarks" : "Save question"}
                            aria-label={bookmarked ? "Remove from bookmarks" : "Save question"}
                          >
                            <Bookmark className={`size-3.5 ${bookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
                          </button>
                          {p.leetcodeUrl ? (
                            <a
                              href={p.leetcodeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline text-xs"
                            >
                              <CodingPlatformIcon platform={p.platform || "LEETCODE"} className="size-3.5" />
                              <span>Solve</span>
                              <ExternalLink className="size-2.5" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">Direct</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGINATION                                                                */}
      {/* ========================================================================= */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t text-xs">
          <span className="text-muted-foreground text-center sm:text-left">
            Showing <span className="font-semibold text-foreground">{paginatedProblems.length}</span> of{" "}
            <span className="font-semibold text-foreground">{sortedProblems.length}</span> questions
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPageClamped === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border font-medium bg-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
            >
              Previous
            </button>

            <span className="text-muted-foreground px-2 whitespace-nowrap">
              Page {currentPageClamped} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPageClamped === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border font-medium bg-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/20 sm:bg-transparent cursor-default transition-opacity duration-200",
          isFilterSheetOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsFilterSheetOpen(false)}
        aria-hidden="true"
      />

      {/* Customize Panel: Slides up from bottom on Mobile (Exact match to screenshot), Floating Card on Desktop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Customize"
        className={cn(
          "fixed z-50 bg-white text-zinc-900 border border-zinc-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isMobile
            ? "inset-x-0 bottom-0 max-h-[88vh] rounded-t-3xl rounded-b-none border-b-0 pb-[env(safe-area-inset-bottom,1rem)]"
            : "top-20 right-6 sm:right-8 w-[260px] max-h-[calc(100vh-6rem)] rounded-2xl",
          isFilterSheetOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : isMobile
            ? "opacity-0 translate-y-full pointer-events-none"
            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        )}
      >
        {/* Mobile drag handle indicator */}
        <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Header: "Customize" + sidebar collapse icon */}
        <div className="px-5 py-3 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-white">
          <span className="text-sm font-semibold tracking-tight text-zinc-900">Customize</span>
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(false)}
            className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            title="Close customizer"
            aria-label="Close customizer"
          >
            <PanelRightClose className="size-4" />
          </button>
        </div>

        {/* Scrollable Option Rows (Exact layout from ReUI with buttery smooth CSS Grid accordion folding) */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100/90 px-2 py-1 text-xs no-scrollbar">
          {/* Row 1: Difficulty */}
          <div className="py-0.5">
            <button
              type="button"
              onClick={() => toggleExpandedFilter("difficulty")}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-zinc-50 transition-colors text-left cursor-pointer group"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-zinc-400 font-medium">Difficulty</span>
                <span className="text-[13px] font-semibold text-zinc-900">
                  {difficultyFilter === "ALL"
                    ? "All Difficulties"
                    : difficultyFilter.charAt(0) + difficultyFilter.slice(1).toLowerCase()}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-3 rounded-full shrink-0 transition-colors duration-200",
                    difficultyFilter === "ALL" && "bg-zinc-400",
                    difficultyFilter === "EASY" && "bg-emerald-500",
                    difficultyFilter === "MEDIUM" && "bg-amber-500",
                    difficultyFilter === "HARD" && "bg-rose-500"
                  )}
                />
                <ChevronDown
                  className={cn(
                    "size-3.5 text-zinc-400 transition-transform duration-200 ease-out group-hover:text-zinc-700",
                    expandedFilters.difficulty && "rotate-180"
                  )}
                />
              </div>
            </button>
            {/* Buttery smooth CSS Grid folding container */}
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
                expandedFilters.difficulty ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
              )}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-2 gap-1 px-2 pb-2 pt-1 bg-zinc-50/70 rounded-lg mx-1 mb-1 border border-zinc-100">
                  {[
                    { id: "ALL", label: "All", count: problems.length },
                    { id: "EASY", label: "Easy", count: easyCount },
                    { id: "MEDIUM", label: "Medium", count: mediumCount },
                    { id: "HARD", label: "Hard", count: hardCount },
                  ].map((diff) => (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => setDifficultyFilter(diff.id)}
                      className={`py-1.5 px-2 rounded-md text-[11px] font-semibold border transition-all duration-150 cursor-pointer text-left flex items-center justify-between active:scale-[0.98] ${
                        difficultyFilter === diff.id
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs"
                          : "bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200/80"
                      }`}
                    >
                      <span>{diff.label}</span>
                      <span
                        className={`text-[10px] font-mono ${
                          difficultyFilter === diff.id ? "text-zinc-300" : "text-zinc-400"
                        }`}
                      >
                        {diff.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Time Range */}
          <div className="py-0.5">
            <button
              type="button"
              onClick={() => toggleExpandedFilter("timeframe")}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-zinc-50 transition-colors text-left cursor-pointer group"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-zinc-400 font-medium">Time Range</span>
                <span className="text-[13px] font-semibold text-zinc-900">
                  {timeframeLabels[timeframeFilter] || "All Time"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-zinc-500 shrink-0" />
                <ChevronDown
                  className={cn(
                    "size-3.5 text-zinc-400 transition-transform duration-200 ease-out group-hover:text-zinc-700",
                    expandedFilters.timeframe && "rotate-180"
                  )}
                />
              </div>
            </button>
            {/* Buttery smooth CSS Grid folding container */}
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
                expandedFilters.timeframe ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
              )}
            >
              <div className="overflow-hidden">
                <div className="space-y-1 px-2 pb-2 pt-1 bg-zinc-50/70 rounded-lg mx-1 mb-1 border border-zinc-100">
                  {[
                    { id: "ALL", label: "All Time", count: problems.length },
                    { id: "THIRTY_DAYS", label: "Past 30 Days", count: thirtyDaysCount },
                    { id: "THREE_MONTHS", label: "Past 3 Months", count: threeMonthsCount },
                    { id: "SIX_MONTHS", label: "Past 6 Months", count: sixMonthsCount },
                    { id: "MORE_THAN_SIX_MONTHS", label: "Past Year (6+ Mo)", count: moreThanSixMonthsCount },
                  ].map((tf) => (
                    <button
                      key={tf.id}
                      type="button"
                      onClick={() => setTimeframeFilter(tf.id)}
                      className={`w-full py-1.5 px-2 rounded-md text-left border transition-all duration-150 cursor-pointer flex items-center justify-between text-[11px] active:scale-[0.98] ${
                        timeframeFilter === tf.id
                          ? "bg-zinc-900 text-white border-zinc-900 font-bold shadow-2xs"
                          : "bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200/80"
                      }`}
                    >
                      <span>{tf.label}</span>
                      <span
                        className={`text-[10px] font-mono ${
                          timeframeFilter === tf.id ? "text-zinc-300" : "text-zinc-400"
                        }`}
                      >
                        {tf.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Question Status */}
          <div className="py-0.5">
            <button
              type="button"
              onClick={() => toggleExpandedFilter("status")}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-zinc-50 transition-colors text-left cursor-pointer group"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-zinc-400 font-medium">Question Status</span>
                <span className="text-[13px] font-semibold text-zinc-900">
                  {statusFilter === "ALL"
                    ? "All Questions"
                    : statusFilter === "BOOKMARKED"
                    ? "Saved Questions"
                    : statusFilter === "SOLVED"
                    ? "Solved Only"
                    : "Unsolved Only"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-zinc-500 shrink-0" />
                <ChevronDown
                  className={cn(
                    "size-3.5 text-zinc-400 transition-transform duration-200 ease-out group-hover:text-zinc-700",
                    expandedFilters.status && "rotate-180"
                  )}
                />
              </div>
            </button>
            {/* Buttery smooth CSS Grid folding container */}
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
                expandedFilters.status ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
              )}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-2 gap-1 px-2 pb-2 pt-1 bg-zinc-50/70 rounded-lg mx-1 mb-1 border border-zinc-100">
                  {[
                    { id: "ALL", label: "All", count: problems.length },
                    { id: "BOOKMARKED", label: "Saved", count: bookmarkedCount },
                    { id: "SOLVED", label: "Solved", count: solvedCount },
                    { id: "UNSOLVED", label: "Unsolved", count: problems.length - solvedCount },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => updateStatusFilter(st.id as typeof statusFilter)}
                      className={`py-1.5 px-2 rounded-md text-[11px] font-semibold border transition-all duration-150 cursor-pointer flex items-center justify-between active:scale-[0.98] ${
                        statusFilter === st.id
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs"
                          : "bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200/80"
                      }`}
                    >
                      <span>{st.label}</span>
                      <span
                        className={`text-[10px] font-mono ${
                          statusFilter === st.id ? "text-zinc-300" : "text-zinc-400"
                        }`}
                      >
                        {st.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Question Source */}
          <div className="py-0.5">
            <button
              type="button"
              onClick={() => toggleExpandedFilter("source")}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-zinc-50 transition-colors text-left cursor-pointer group"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-zinc-400 font-medium">Question Source</span>
                <span className="text-[13px] font-semibold text-zinc-900">
                  {sourceFilter === "ALL"
                    ? "All Sources"
                    : sourceFilter === "CURATED"
                    ? "Curated"
                    : "Community"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="size-3.5 text-zinc-500 shrink-0" />
                <ChevronDown
                  className={cn(
                    "size-3.5 text-zinc-400 transition-transform duration-200 ease-out group-hover:text-zinc-700",
                    expandedFilters.source && "rotate-180"
                  )}
                />
              </div>
            </button>
            {/* Buttery smooth CSS Grid folding container */}
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
                expandedFilters.source ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
              )}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-3 gap-1 px-2 pb-2 pt-1 bg-zinc-50/70 rounded-lg mx-1 mb-1 border border-zinc-100">
                  {[
                    { id: "ALL", label: "All", count: problems.length },
                    { id: "CURATED", label: "Curated", count: curatedCount },
                    { id: "COMMUNITY", label: "Community", count: communityCount },
                  ].map((src) => (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setSourceFilter(src.id as typeof sourceFilter)}
                      className={`py-1.5 px-1 rounded-md text-[11px] font-semibold border transition-all duration-150 cursor-pointer text-center active:scale-[0.98] ${
                        sourceFilter === src.id
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs"
                          : "bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200/80"
                      }`}
                    >
                      <div>{src.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: Platform (if multiple platforms exist) */}
          {availablePlatforms.length > 1 && (
            <div className="py-0.5">
              <button
                type="button"
                onClick={() => toggleExpandedFilter("platform")}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-zinc-50 transition-colors text-left cursor-pointer group"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-zinc-400 font-medium">Coding Platform</span>
                  <span className="text-[13px] font-semibold text-zinc-900">
                    {platformFilter === "ALL" ? "All Platforms" : platformFilter}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="size-3.5 text-zinc-500 shrink-0" />
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-zinc-400 transition-transform duration-200 ease-out group-hover:text-zinc-700",
                      expandedFilters.platform && "rotate-180"
                    )}
                  />
                </div>
              </button>
              {/* Buttery smooth CSS Grid folding container */}
              <div
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  expandedFilters.platform ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                )}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-wrap gap-1 px-2 pb-2 pt-1 bg-zinc-50/70 rounded-lg mx-1 mb-1 border border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setPlatformFilter("ALL")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                        platformFilter === "ALL"
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200/80"
                      }`}
                    >
                      All
                    </button>
                    {availablePlatforms.map((plat) => {
                      const info = getPlatformBadge(plat as CodingPlatformType);
                      return (
                        <button
                          key={plat}
                          type="button"
                          onClick={() => setPlatformFilter(plat)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold border transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                            platformFilter === plat
                              ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs"
                              : "bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200/80"
                          }`}
                        >
                          <CodingPlatformIcon platform={plat as CodingPlatformType} className="size-3 shrink-0" />
                          <span>{info.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Row 6: Topics */}
          <div className="py-0.5">
            <button
              type="button"
              onClick={() => toggleExpandedFilter("topics")}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-zinc-50 transition-colors text-left cursor-pointer group"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-zinc-400 font-medium">
                  Topics ({allTopicsWithCounts.length})
                </span>
                <span className="text-[13px] font-semibold text-zinc-900">
                  {selectedTopics.length === 0
                    ? "All Topics"
                    : `${selectedTopics.length} selected`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Search className="size-3.5 text-zinc-500 shrink-0" />
                <ChevronDown
                  className={cn(
                    "size-3.5 text-zinc-400 transition-transform duration-200 ease-out group-hover:text-zinc-700",
                    expandedFilters.topics && "rotate-180"
                  )}
                />
              </div>
            </button>
            {/* Buttery smooth CSS Grid folding container */}
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
                expandedFilters.topics ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
              )}
            >
              <div className="overflow-hidden">
                <div className="space-y-1.5 px-2 pb-2 pt-1 bg-zinc-50/70 rounded-lg mx-1 mb-1 border border-zinc-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] text-zinc-500">Filter by topic tag</span>
                    {selectedTopics.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedTopics([])}
                        className="text-[10.5px] text-zinc-900 hover:underline font-bold cursor-pointer"
                      >
                        Clear ({selectedTopics.length})
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      value={filterTopicSearch}
                      onChange={(e) => setFilterTopicSearch(e.target.value)}
                      placeholder="Search topics..."
                      className="w-full pl-6 pr-6 py-1 rounded-md border border-zinc-200 bg-white text-[11px] placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    {filterTopicSearch && (
                      <button
                        type="button"
                        onClick={() => setFilterTopicSearch("")}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-0.5"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto pr-0.5 no-scrollbar">
                    {allTopicsWithCounts
                      .filter(({ topic }) =>
                        topic.toLowerCase().includes(filterTopicSearch.toLowerCase().trim())
                      )
                      .map(({ topic, count }) => {
                        const isSelected = selectedTopics.includes(topic);
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => toggleTopic(topic)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] transition-all duration-150 cursor-pointer border active:scale-[0.98] ${
                              isSelected
                                ? "bg-zinc-900 text-white border-zinc-900 font-semibold"
                                : "bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200/80"
                            }`}
                          >
                            <span>{topic}</span>
                            <span
                              className={`text-[9.5px] font-mono ${
                                isSelected ? "text-zinc-300" : "text-zinc-400"
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (Optimized for both Mobile Touch & Desktop) */}
        <div className="p-3 pt-2.5 border-t border-zinc-100 bg-white space-y-2 sm:space-y-1.5 shrink-0">
          {/* Button: Apply Filters */}
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(false)}
            className="w-full h-10 sm:h-8.5 px-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-semibold flex items-center justify-center shadow-2xs transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <span>Apply Filters ({filteredProblems.length})</span>
          </button>

          {/* Button: Shuffle with [R] shortcut badge */}
          <button
            type="button"
            onClick={handlePickRandomProblem}
            className="w-full h-10 sm:h-8.5 px-3.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-semibold flex items-center justify-between shadow-2xs transition-all duration-150 active:scale-[0.98] cursor-pointer relative"
            title="Shuffle / Pick Random Question (Press R)"
          >
            <div className="flex items-center gap-2">
              <Shuffle className="size-3.5 text-zinc-700" />
              <span>Shuffle</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              R
            </kbd>
          </button>

          {/* Button: Reset */}
          <button
            type="button"
            disabled={activeFilterCount === 0}
            onClick={resetAllFilters}
            className="w-full h-9 sm:h-8.5 px-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-semibold flex items-center justify-center shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
