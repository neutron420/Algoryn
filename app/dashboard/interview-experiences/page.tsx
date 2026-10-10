"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Search,
  Plus,
  ChevronDown,
  X,
  Target,
  EyeOff,
  Flame,
  FileText,
  Trash2,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  BarChart2,
  Layers,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { ExperienceCardSkeleton } from "@/components/experience-card-skeleton";
import { toast } from "sonner";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/* ------------------------------------------------------------------ */
/* Types & Constants                                                  */
/* ------------------------------------------------------------------ */

const POPULAR_COMPANIES = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Apple",
  "Netflix",
  "Uber",
  "Stripe",
  "Salesforce",
  "Atlassian",
  "Adobe",
  "Oracle",
  "Goldman Sachs",
  "Bloomberg",
  "Airbnb",
  "Coinbase",
];

const INTERVIEW_ROUNDS = [
  "Online Assessment (OA)",
  "Round 1 - Technical (DSA)",
  "Round 2 - Technical (DSA)",
  "Round 3 - System Design",
  "Round 4 - Behavioral / HR",
  "Full Interview Loop",
];

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];

interface DbCompanyItem {
  id: number;
  name: string;
  slug: string;
  problemCount?: number;
}

interface TrendingExperienceItem {
  id: string;
  title: string;
  company: string;
  round: string;
  role?: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  authorName?: string | null;
}

interface InterviewExperienceItem {
  id: string;
  userId?: string | null;
  authorName: string;
  authorHandle: string;
  authorRole: string;
  avatarUrl?: string | null;
  title?: string | null;
  content: string;
  imageUrl?: string | null;
  imageUrls?: string[];
  category: string;
  company: string;
  round: string;
  verdict: string;
  difficulty?: string;
  tags: string[];
  viewsCount: number;
  likesCount: number;
  bookmarksCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface LocalDraftItem {
  title: string;
  content: string;
  tags: string[];
  isAnonymous?: boolean;
  savedAt: string;
  company?: string;
  role?: string;
  difficulty?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return String(num || 0);
}

function formatRelativeTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function getOrCreateViewerId(): string {
  if (typeof window === "undefined") return "guest";
  try {
    let id = localStorage.getItem("algoryn_viewer_id");
    if (!id) {
      id = "viewer_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
      localStorage.setItem("algoryn_viewer_id", id);
    }
    return id;
  } catch {
    return "guest";
  }
}

/* ------------------------------------------------------------------ */
/* Clean, Information-Dense Card Component                            */
/* ------------------------------------------------------------------ */

function ExperienceCard({
  item,
  currentUserId,
  onLikeToggle,
  onBookmarkToggle,
}: {
  item: InterviewExperienceItem;
  currentUserId?: string | null;
  onLikeToggle: (id: string, nextLiked: boolean, count: number) => void;
  onBookmarkToggle: (id: string, nextBookmarked: boolean) => void;
}) {
  const [liked, setLiked] = useState(item.isLiked);
  const [likesCount, setLikesCount] = useState(item.likesCount);
  const [viewsCount, setViewsCount] = useState(item.viewsCount || 0);
  const [bookmarked, setBookmarked] = useState(item.isBookmarked);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handlePreloadExperience = () => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`algoryn_cached_exp_${item.id}`, JSON.stringify(item));
        router.prefetch(`/dashboard/interview-experiences/${item.id}`);
      }
    } catch {}
  };

  const { contextSafe } = useGSAP({ scope: cardRef });

  const animateLike = contextSafe((target: Element | null) => {
    if (target) {
      gsap.fromTo(
        target,
        { scale: 1 },
        {
          scale: 1.3,
          duration: 0.12,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(target, { scale: 1, duration: 0.15, ease: "power2.out" });
          },
        }
      );
    }
  });

  // Track unique view (1 view per viewer ID)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const viewerId = currentUserId || getOrCreateViewerId();
    const storageKey = `algoryn_viewed_${item.id}_${viewerId}`;
    if (localStorage.getItem(storageKey)) return;

    let recorded = false;
    const recordView = async () => {
      if (recorded) return;
      recorded = true;
      try {
        localStorage.setItem(storageKey, "1");
        const res = await fetch(`/api/discussions/${item.id}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId || null, viewerId }),
        });
        const data = await res.json();
        if (data.success && typeof data.viewsCount === "number") {
          setViewsCount(data.viewsCount);
        }
      } catch (err) {
        console.error("Error registering view:", err);
      }
    };

    if ("IntersectionObserver" in window && cardRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            recordView();
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(cardRef.current);
      return () => observer.disconnect();
    } else {
      recordView();
    }
  }, [item.id, currentUserId]);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextLiked = !liked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setLiked(nextLiked);
    setLikesCount(nextCount);
    onLikeToggle(item.id, nextLiked, nextCount);
    if (nextLiked && e.currentTarget) {
      animateLike(e.currentTarget.querySelector("svg"));
    }

    try {
      const res = await fetch(`/api/discussions/${item.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      const data = await res.json();
      if (data.success) {
        setLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch {
      setLiked(!nextLiked);
      setLikesCount(likesCount);
    }
  };

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextBookmarked = !bookmarked;
    setBookmarked(nextBookmarked);
    onBookmarkToggle(item.id, nextBookmarked);
    try {
      await fetch(`/api/discussions/${item.id}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      toast.success(nextBookmarked ? "Saved to bookmarks" : "Removed from bookmarks");
    } catch {
      setBookmarked(!nextBookmarked);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/dashboard/interview-experiences/${item.id}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const cleanSnippet = item.content
    .replace(/^#+\s+/gm, "")
    .replace(/^[-*•]\s+/gm, "")
    .replace(/^---\s*$/gm, "")
    .replace(/\*\*\*(.*?)\*\*\*/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\$([^$]+)\$/g, "$1")
    .trim()
    .slice(0, 240);

  return (
    <article
      ref={cardRef}
      onPointerEnter={handlePreloadExperience}
      onTouchStart={handlePreloadExperience}
      className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-150 flex flex-col justify-between space-y-3 shadow-2xs group"
    >
      <div className="space-y-2.5">
        {/* Meta Pill Row: Company, Role, Verdict, Round, Difficulty, Date */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Company Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/40 font-semibold text-[11px]">
              <Building2 className="size-3 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{item.company}</span>
            </span>

            {/* Role / Job Title */}
            <span className="font-medium text-slate-800 dark:text-zinc-200">
              {item.authorRole || "Software Engineer"}
            </span>

            {/* Verdict / Outcome */}
            {item.verdict && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                  item.verdict === "Offer" || item.verdict === "Accepted"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40"
                    : item.verdict === "Rejected"
                    ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40"
                    : "bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700"
                }`}
              >
                {item.verdict === "Offer" || item.verdict === "Accepted" ? (
                  <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                ) : item.verdict === "Rejected" ? (
                  <XCircle className="size-3 text-rose-600 dark:text-rose-400" />
                ) : (
                  <Clock className="size-3" />
                )}
                <span>
                  {item.verdict === "Offer" || item.verdict === "Accepted"
                    ? `Selected · ${new Date(item.createdAt).getFullYear() || 2026}`
                    : item.verdict}
                </span>
              </span>
            )}

            {/* Round */}
            {item.round && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-400 border border-slate-200/80 dark:border-zinc-700/60 text-[11px]">
                <Briefcase className="size-3 shrink-0" />
                <span>{item.round}</span>
              </span>
            )}

            {/* Difficulty Badge */}
            {item.difficulty && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                  item.difficulty === "Easy"
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200"
                    : item.difficulty === "Hard"
                    ? "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200"
                    : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200"
                }`}
              >
                {item.difficulty}
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-400 dark:text-zinc-500 shrink-0">
            {formatRelativeTime(item.createdAt)}
          </span>
        </div>

        {/* Post Title */}
        <Link
          href={`/dashboard/interview-experiences/${item.id}`}
          onClick={handlePreloadExperience}
          className="block group/title"
        >
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors leading-snug">
            {item.title}
          </h2>
        </Link>

        {/* Concise Excerpt */}
        <Link
          href={`/dashboard/interview-experiences/${item.id}`}
          onClick={handlePreloadExperience}
          className="block text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-3 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors"
        >
          {cleanSnippet}...
        </Link>

        {/* Relevant Tags & Technologies */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap text-xs pt-0.5">
            {item.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Author & Actions Footer Bar */}
      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-3 text-slate-500 dark:text-zinc-400 text-xs">
        {/* Author Info */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`size-6 rounded-full text-white font-bold flex items-center justify-center text-[10px] shrink-0 ${
              item.authorName === "Anonymous"
                ? "bg-slate-700 text-slate-200"
                : "bg-blue-600"
            }`}
          >
            {item.authorName === "Anonymous" ? (
              <EyeOff className="size-3 text-emerald-400" />
            ) : item.avatarUrl ? (
              <img src={item.avatarUrl} alt="" className="size-full rounded-full object-cover" />
            ) : (
              item.authorName?.[0]?.toUpperCase() || "C"
            )}
          </div>
          <span className="text-xs font-medium text-slate-800 dark:text-zinc-200 truncate">
            {item.authorName}
          </span>
          {item.authorName === "Anonymous" ? (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
              Anonymous
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 hidden sm:inline truncate">
              {item.authorRole}
            </span>
          )}
        </div>

        {/* Interactive Actions Tray */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Upvote / Like */}
          <button
            type="button"
            onClick={handleToggleLike}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              liked ? "text-[#f91880] font-semibold" : "hover:text-[#f91880]"
            }`}
            title="Upvote"
          >
            <Heart className={`size-3.5 transition-transform active:scale-125 ${liked ? "fill-current" : ""}`} />
            <span>{formatNumber(likesCount)}</span>
          </button>

          {/* Comments Link */}
          <Link
            href={`/dashboard/interview-experiences/${item.id}`}
            onClick={handlePreloadExperience}
            className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Comments"
          >
            <MessageCircle className="size-3.5" />
            <span>{formatNumber(item.commentsCount)}</span>
          </Link>

          {/* Views Analytics */}
          <div className="flex items-center gap-1 text-slate-400 dark:text-zinc-500 cursor-default" title={`${viewsCount} Views`}>
            <BarChart2 className="size-3.5" />
            <span>{formatNumber(viewsCount)}</span>
          </div>

          {/* Bookmark */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`transition-colors cursor-pointer ${
              bookmarked ? "text-blue-600 dark:text-blue-400" : "hover:text-slate-800 dark:hover:text-zinc-200"
            }`}
            title="Bookmark"
          >
            <Bookmark className={`size-3.5 ${bookmarked ? "fill-current" : ""}`} />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="hover:text-slate-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            title="Share Link"
          >
            <Share2 className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Main Interview Experiences Page                                    */
/* ------------------------------------------------------------------ */

export default function InterviewExperiencesPage() {
  const { user } = useAuth();
  const currentUserId = user?.uid;
  const router = useRouter();

  // Navigation tab: "experiences" (main feed) vs "my-drops" (personal area)
  const [activeTab, setActiveTab] = useState<"experiences" | "my-drops">("experiences");

  // Published community experiences
  const [experiences, setExperiences] = useState<InterviewExperienceItem[]>([]);
  const [trending, setTrending] = useState<TrendingExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Database Companies for filter
  const [dbCompanies, setDbCompanies] = useState<DbCompanyItem[]>([]);

  // Filters for Main Feed
  const [selectedCompany, setSelectedCompany] = useState<string>("ALL");
  const [selectedRound, setSelectedRound] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "comments">("latest");

  // Dropdown States
  const [companyFilterOpen, setCompanyFilterOpen] = useState(false);
  const [companyFilterSearch, setCompanyFilterSearch] = useState("");
  const [roundFilterOpen, setRoundFilterOpen] = useState(false);
  const [difficultyFilterOpen, setDifficultyFilterOpen] = useState(false);

  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const roundDropdownRef = useRef<HTMLDivElement>(null);
  const difficultyDropdownRef = useRef<HTMLDivElement>(null);

  // My Drops State
  const [myDropsSubTab, setMyDropsSubTab] = useState<"all" | "published" | "drafts">("all");
  const [myPublishedPosts, setMyPublishedPosts] = useState<InterviewExperienceItem[]>([]);
  const [myPublishedLoading, setMyPublishedLoading] = useState(false);
  const [savedDraft, setSavedDraft] = useState<LocalDraftItem | null>(null);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(e.target as Node)) {
        setCompanyFilterOpen(false);
      }
      if (roundDropdownRef.current && !roundDropdownRef.current.contains(e.target as Node)) {
        setRoundFilterOpen(false);
      }
      if (difficultyDropdownRef.current && !difficultyDropdownRef.current.contains(e.target as Node)) {
        setDifficultyFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch top database companies initially
  useEffect(() => {
    let active = true;
    async function loadDbCompanies() {
      try {
        const res = await fetch("/api/companies?limit=100&sort=problemCount&order=desc");
        const json = await res.json();
        if (active && json.data && Array.isArray(json.data)) {
          setDbCompanies(json.data);
        }
      } catch (err) {
        console.error("Failed to load companies from DB:", err);
      }
    }
    loadDbCompanies();
    return () => {
      active = false;
    };
  }, []);

  // Fetch experiences from the database
  useEffect(() => {
    let isCurrent = true;

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCompany !== "ALL") params.append("company", selectedCompany);
        if (selectedRound !== "ALL") params.append("round", selectedRound);
        if (selectedDifficulty !== "ALL") params.append("difficulty", selectedDifficulty);
        if (searchQuery.trim()) params.append("search", searchQuery.trim());
        params.append("sort", sortBy);
        if (currentUserId) params.append("userId", currentUserId);

        const res = await fetch(`/api/interview-experiences?${params.toString()}`);
        const data = await res.json();
        if (isCurrent && data.success) {
          if (Array.isArray(data.experiences)) {
            setExperiences(data.experiences);
          }
          if (Array.isArray(data.trending)) {
            setTrending(data.trending);
          }
        }
      } catch (err) {
        console.error("Error loading interview experiences:", err);
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }, searchQuery ? 300 : 0);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [selectedCompany, selectedRound, selectedDifficulty, sortBy, searchQuery, currentUserId]);

  // Load My Drops: Personal published posts & local draft
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load local draft
    try {
      const draftRaw = localStorage.getItem("algoryn_structured_draft_v4");
      if (draftRaw) {
        const parsed = JSON.parse(draftRaw);
        if (parsed && (parsed.title || parsed.content)) {
          // Extract company or role heuristics if available
          let extractedCompany = "General";
          let extractedRole = "Software Engineer";
          if (parsed.content) {
            const coMatch = parsed.content.match(/\*\*([A-Za-z0-9\s]+)\*\*/);
            if (coMatch && coMatch[1]) extractedCompany = coMatch[1].trim();
            const roleMatch = parsed.content.match(/\*\*Status:\*\*\s*([^\n\r]+)/i);
            if (roleMatch && roleMatch[1]) extractedRole = roleMatch[1].trim();
          }
          setSavedDraft({
            title: parsed.title || "Untitled Draft",
            content: parsed.content || "",
            tags: Array.isArray(parsed.tags) ? parsed.tags : [],
            isAnonymous: Boolean(parsed.isAnonymous),
            savedAt: parsed.savedAt || new Date().toISOString(),
            company: extractedCompany,
            role: extractedRole,
          });
        } else {
          setSavedDraft(null);
        }
      } else {
        setSavedDraft(null);
      }
    } catch {
      setSavedDraft(null);
    }

    // Load user's published contributions from backend
    if (currentUserId) {
      setMyPublishedLoading(true);
      fetch(`/api/interview-experiences?authorId=${currentUserId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.experiences)) {
            setMyPublishedPosts(data.experiences);
          }
        })
        .catch((err) => console.error("Error fetching personal drops:", err))
        .finally(() => setMyPublishedLoading(false));
    }
  }, [currentUserId, activeTab]);

  const handleDeleteDraft = () => {
    if (confirm("Are you sure you want to delete this draft? This cannot be undone.")) {
      try {
        localStorage.removeItem("algoryn_structured_draft_v4");
        setSavedDraft(null);
        toast.success("Draft deleted successfully");
      } catch {
        toast.error("Failed to delete draft");
      }
    }
  };

  const availableCompanies: DbCompanyItem[] =
    dbCompanies.length > 0
      ? dbCompanies
      : POPULAR_COMPANIES.map((name, idx) => ({
          id: idx + 1,
          name,
          slug: name.toLowerCase(),
          problemCount: undefined,
        }));

  const filteredCompaniesForFilter = availableCompanies.filter((c) =>
    companyFilterSearch.trim() ? c.name.toLowerCase().includes(companyFilterSearch.trim().toLowerCase()) : true
  );

  const hasActiveFilters =
    selectedCompany !== "ALL" ||
    selectedRound !== "ALL" ||
    selectedDifficulty !== "ALL" ||
    Boolean(searchQuery.trim());

  const resetAllFilters = () => {
    setSelectedCompany("ALL");
    setSelectedRound("ALL");
    setSelectedDifficulty("ALL");
    setSearchQuery("");
  };

  const totalMyDropsCount = (myPublishedPosts.length || 0) + (savedDraft ? 1 : 0);

  return (
    <div className="w-full min-h-screen bg-[#fcfdfd] dark:bg-[#090d16] text-slate-800 dark:text-zinc-200">
      <div className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-5 space-y-4">
        {/* 1. Header (Compact, Content-First, Professional) */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-zinc-800">
          <div className="space-y-1">
            {/* Page Title & Description */}
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Interview Experiences
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-2xl">
              Real interview rounds, coding questions, and preparation insights shared by candidates.
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="shrink-0">
            <Link
              href="/dashboard/interview-experiences/share"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-98"
            >
              <Plus className="size-4" />
              <span>Share Experience</span>
            </Link>
          </div>
        </header>

        {/* 2. Simplified Page Tabs: Interview Experiences & My Drops */}
        <nav className="flex items-center gap-8 border-b border-slate-200 dark:border-zinc-800 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("experiences")}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "experiences"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
            }`}
          >
            <span>Interview Experiences</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-normal">
              {experiences.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("my-drops")}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "my-drops"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
            }`}
          >
            <span>My Drops</span>
            {user && totalMyDropsCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-normal">
                {totalMyDropsCount}
              </span>
            )}
          </button>
        </nav>

        {/* ============================================================= */}
        {/* TAB 1: MAIN INTERVIEW EXPERIENCES FEED                         */}
        {/* ============================================================= */}
        {activeTab === "experiences" && (
          <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
            {/* Main Column */}
            <div className="flex-1 min-w-0 space-y-4 w-full">
              {/* Filter & Sorting Toolbar */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 shadow-2xs space-y-2.5">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search company, role, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 rounded-lg pl-9 pr-8 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filter Controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Company Filter Dropdown */}
                    <div className="relative" ref={companyDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setCompanyFilterOpen((v) => !v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          selectedCompany !== "ALL"
                            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700"
                            : "bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-slate-300"
                        }`}
                      >
                        <Building2 className="size-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[110px]">
                          {selectedCompany === "ALL" ? "All Companies" : selectedCompany}
                        </span>
                        <ChevronDown className="size-3 text-slate-400 shrink-0" />
                      </button>

                      {companyFilterOpen && (
                        <div className="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-64 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl p-2 z-30 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                          <input
                            type="text"
                            placeholder="Filter companies..."
                            value={companyFilterSearch}
                            onChange={(e) => setCompanyFilterSearch(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 outline-none focus:border-blue-500 mb-1"
                            autoFocus
                          />
                          <div className="max-h-52 overflow-y-auto space-y-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCompany("ALL");
                                setCompanyFilterOpen(false);
                                setCompanyFilterSearch("");
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                selectedCompany === "ALL"
                                  ? "bg-blue-50 text-blue-600 font-bold"
                                  : "hover:bg-slate-50 text-slate-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                              }`}
                            >
                              All Companies
                            </button>
                            {filteredCompaniesForFilter.slice(0, 30).map((c) => (
                              <button
                                key={c.id || c.name}
                                type="button"
                                onClick={() => {
                                  setSelectedCompany(c.name);
                                  setCompanyFilterOpen(false);
                                  setCompanyFilterSearch("");
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer truncate ${
                                  selectedCompany.toLowerCase() === c.name.toLowerCase()
                                    ? "bg-blue-50 text-blue-600 font-bold"
                                    : "hover:bg-slate-50 text-slate-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                }`}
                              >
                                {c.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Round Filter Dropdown */}
                    <div className="relative" ref={roundDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setRoundFilterOpen((v) => !v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          selectedRound !== "ALL"
                            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700"
                            : "bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-slate-300"
                        }`}
                      >
                        <Briefcase className="size-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[100px]">
                          {selectedRound === "ALL" ? "All Rounds" : selectedRound}
                        </span>
                        <ChevronDown className="size-3 text-slate-400 shrink-0" />
                      </button>

                      {roundFilterOpen && (
                        <div className="absolute right-0 mt-1.5 w-60 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl p-1.5 z-30 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRound("ALL");
                              setRoundFilterOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                              selectedRound === "ALL"
                                ? "bg-blue-50 text-blue-600 font-bold"
                                : "hover:bg-slate-50 text-slate-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            }`}
                          >
                            All Rounds
                          </button>
                          {INTERVIEW_ROUNDS.map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => {
                                setSelectedRound(r);
                                setRoundFilterOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer truncate ${
                                selectedRound === r
                                  ? "bg-blue-50 text-blue-600 font-bold"
                                  : "hover:bg-slate-50 text-slate-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Difficulty Filter Dropdown */}
                    <div className="relative" ref={difficultyDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setDifficultyFilterOpen((v) => !v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          selectedDifficulty !== "ALL"
                            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700"
                            : "bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-slate-300"
                        }`}
                      >
                        <Target className="size-3.5 text-slate-400 shrink-0" />
                        <span>
                          {selectedDifficulty === "ALL" ? "Difficulty" : selectedDifficulty}
                        </span>
                        <ChevronDown className="size-3 text-slate-400 shrink-0" />
                      </button>

                      {difficultyFilterOpen && (
                        <div className="absolute right-0 mt-1.5 w-40 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl p-1.5 z-30 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDifficulty("ALL");
                              setDifficultyFilterOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                              selectedDifficulty === "ALL"
                                ? "bg-blue-50 text-blue-600 font-bold"
                                : "hover:bg-slate-50 text-slate-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            }`}
                          >
                            All Difficulties
                          </button>
                          {DIFFICULTY_LEVELS.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setSelectedDifficulty(d);
                                setDifficultyFilterOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                selectedDifficulty === d
                                  ? "bg-blue-50 text-blue-600 font-bold"
                                  : "hover:bg-slate-50 text-slate-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sort Selector */}
                    <div className="flex items-center bg-slate-100 dark:bg-zinc-800 rounded-lg p-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setSortBy("latest")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                          sortBy === "latest"
                            ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-2xs font-semibold"
                            : "text-slate-500 dark:text-zinc-400 hover:text-slate-800"
                        }`}
                      >
                        Latest
                      </button>
                      <button
                        type="button"
                        onClick={() => setSortBy("popular")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                          sortBy === "popular"
                            ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-2xs font-semibold"
                            : "text-slate-500 dark:text-zinc-400 hover:text-slate-800"
                        }`}
                      >
                        Upvoted
                      </button>
                      <button
                        type="button"
                        onClick={() => setSortBy("comments")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                          sortBy === "comments"
                            ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-2xs font-semibold"
                            : "text-slate-500 dark:text-zinc-400 hover:text-slate-800"
                        }`}
                      >
                        Discussed
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filter Chips */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800 text-xs flex-wrap">
                    <span className="text-[11px] font-medium text-slate-400">Active filters:</span>
                    {selectedCompany !== "ALL" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium text-[11px] border border-blue-200">
                        {selectedCompany}
                        <button
                          type="button"
                          onClick={() => setSelectedCompany("ALL")}
                          className="hover:text-slate-900 cursor-pointer"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    )}
                    {selectedRound !== "ALL" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium text-[11px] border border-slate-200">
                        {selectedRound}
                        <button
                          type="button"
                          onClick={() => setSelectedRound("ALL")}
                          className="hover:text-slate-900 cursor-pointer"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    )}
                    {selectedDifficulty !== "ALL" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium text-[11px] border border-slate-200">
                        {selectedDifficulty}
                        <button
                          type="button"
                          onClick={() => setSelectedDifficulty("ALL")}
                          className="hover:text-slate-900 cursor-pointer"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium text-[11px] border border-slate-200">
                        &ldquo;{searchQuery}&rdquo;
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="hover:text-slate-900 cursor-pointer"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer ml-auto"
                    >
                      Reset all
                    </button>
                  </div>
                )}
              </div>

              {/* Feed Card List */}
              {loading ? (
                <div className="space-y-3.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ExperienceCardSkeleton key={i} delay={i * 60} />
                  ))}
                </div>
              ) : experiences.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-10 text-center space-y-3 shadow-2xs">
                  <div className="size-11 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                    <Briefcase className="size-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-zinc-100">
                    No interview experiences found
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
                    No posts match your selected company or round filters. Be the first to share your interview story!
                  </p>
                  <Link
                    href="/dashboard/interview-experiences/share"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <Plus className="size-3.5" />
                    <span>Share Interview Experience</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {experiences.map((item) => (
                    <ExperienceCard
                      key={item.id}
                      item={item}
                      currentUserId={currentUserId}
                      onLikeToggle={(id, nextLiked, count) => {
                        setExperiences((prev) =>
                          prev.map((e) => (e.id === id ? { ...e, isLiked: nextLiked, likesCount: count } : e))
                        );
                      }}
                      onBookmarkToggle={(id, nextBookmarked) => {
                        setExperiences((prev) =>
                          prev.map((e) => (e.id === id ? { ...e, isBookmarked: nextBookmarked } : e))
                        );
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Useful Sidebar (No Ads!) */}
            <aside className="hidden lg:flex flex-col gap-4 w-76 shrink-0 sticky top-16">
              {/* Trending Experiences Card */}
              {trending.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
                    <Flame className="size-4 text-amber-500" />
                    <span>Trending Loops</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {trending.slice(0, 4).map((t) => (
                      <Link
                        key={t.id}
                        href={`/dashboard/interview-experiences/${t.id}`}
                        className="py-2.5 block group first:pt-0 last:pb-0"
                      >
                        <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-0.5">
                          {t.company} · {t.round}
                        </div>
                        <h4 className="text-xs font-medium text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {t.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                          <span>{t.views} views</span>
                          <span>{t.likes} upvotes</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Companies Quick Jump */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
                  <Building2 className="size-4 text-blue-600 dark:text-blue-400" />
                  <span>Popular Companies</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {POPULAR_COMPANIES.slice(0, 10).map((company) => (
                    <button
                      key={company}
                      type="button"
                      onClick={() => setSelectedCompany(company)}
                      className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer border ${
                        selectedCompany === company
                          ? "bg-blue-600 text-white border-blue-600 font-semibold"
                          : "bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-700 hover:border-blue-400 hover:text-blue-600"
                      }`}
                    >
                      {company}
                    </button>
                  ))}
                </div>
              </div>

              {/* Community Guidelines Card */}
              <div className="bg-slate-50/70 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-4 space-y-2 text-xs text-slate-600 dark:text-zinc-400">
                <div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-blue-600" />
                  <span>Writing a Great Experience</span>
                </div>
                <ul className="space-y-1.5 text-[11px] leading-relaxed list-disc list-inside">
                  <li>Break down each interview round clearly (OA, Tech, Behavioral).</li>
                  <li>Link problems tested using the Question Collection search.</li>
                  <li>Include trade-offs and complexity for your approaches.</li>
                </ul>
              </div>
            </aside>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 2: MY DROPS (Personal Drafts & Contributions)             */}
        {/* ============================================================= */}
        {activeTab === "my-drops" && (
          <div className="space-y-5 w-full">
            {!user ? (
              /* Auth Prompt if not logged in */
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-8 text-center space-y-3.5 shadow-2xs max-w-lg mx-auto my-8">
                <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                  <LogIn className="size-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-zinc-100">
                  Sign in to view My Drops
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Track your personal drafts, review status, and manage your published interview experiences.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <span>Sign In to Algoryn</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ) : (
              /* Authenticated User's Personal Drops */
              <div className="space-y-4">
                {/* Sub-filter tabs: All, Published, Drafts */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setMyDropsSubTab("all")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      myDropsSubTab === "all"
                        ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    All ({totalMyDropsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMyDropsSubTab("published")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      myDropsSubTab === "published"
                        ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    Published ({myPublishedPosts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMyDropsSubTab("drafts")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      myDropsSubTab === "drafts"
                        ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    Drafts ({savedDraft ? 1 : 0})
                  </button>
                </div>

                {/* Content List */}
                <div className="space-y-3.5">
                  {/* Local Draft Section */}
                  {(myDropsSubTab === "all" || myDropsSubTab === "drafts") && savedDraft && (
                    <div className="bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 text-xs font-semibold">
                            <Clock className="size-3 text-amber-600 shrink-0" />
                            <span>Draft</span>
                          </span>
                          <span className="text-xs text-slate-500 dark:text-zinc-400">
                            Saved locally at {formatRelativeTime(savedDraft.savedAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href="/dashboard/interview-experiences/share"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <span>Continue Writing</span>
                            <ArrowRight className="size-3" />
                          </Link>
                          <button
                            type="button"
                            onClick={handleDeleteDraft}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                            title="Delete Draft"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                          {savedDraft.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 mt-1">
                          {savedDraft.content.slice(0, 180)}...
                        </p>
                      </div>

                      {savedDraft.tags && savedDraft.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {savedDraft.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Published Contributions */}
                  {(myDropsSubTab === "all" || myDropsSubTab === "published") &&
                    myPublishedPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold">
                              <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                              <span>Published</span>
                            </span>
                            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                              {post.company} · {post.authorRole}
                            </span>
                            <span className="text-xs text-slate-400">
                              Published {formatRelativeTime(post.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/interview-experiences/${post.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-blue-600 hover:border-blue-400 text-xs font-semibold transition-colors"
                            >
                              <span>View Experience</span>
                              <ExternalLink className="size-3" />
                            </Link>
                          </div>
                        </div>

                        <div>
                          <Link href={`/dashboard/interview-experiences/${post.id}`}>
                            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 mt-1">
                            {post.content.slice(0, 180)}...
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 border-t border-slate-100 dark:border-zinc-800">
                          <span>{post.viewsCount || 0} views</span>
                          <span>{post.likesCount || 0} upvotes</span>
                          <span>{post.commentsCount || 0} comments</span>
                        </div>
                      </div>
                    ))}

                  {/* Empty State when no drafts or published posts exist */}
                  {totalMyDropsCount === 0 && !myPublishedLoading && (
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-10 text-center space-y-3 shadow-2xs">
                      <div className="size-11 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                        <FileText className="size-5" />
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-zinc-100">
                        No interview drops yet
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
                        You have not shared any interview experiences or saved any drafts yet. Start writing your interview journey now!
                      </p>
                      <Link
                        href="/dashboard/interview-experiences/share"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
                      >
                        <Plus className="size-3.5" />
                        <span>Share Your Experience</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
