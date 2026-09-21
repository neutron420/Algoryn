"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
  Flame,
  X,
  Code2,
  Target,
  MessageSquare,
  Coins,
  Layers,
  Compass,
} from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { ExperienceCardSkeleton } from "@/components/experience-card-skeleton";
import { toast } from "sonner";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/* Constants & Types                                                  */
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
  "Round 4 - Hiring Manager / Behavioral",
  "HR / Culture Fit",
  "Full Interview Loop",
];

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
  tags: string[];
  viewsCount: number;
  likesCount: number;
  bookmarksCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
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
/* Feed Experience Card Component                                     */
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

  // Unique view tracking (1 view per unique person ID, 0 on refresh)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const viewerId = currentUserId || getOrCreateViewerId();
    const storageKey = `algoryn_viewed_${item.id}_${viewerId}`;
    if (localStorage.getItem(storageKey)) {
      return;
    }

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

  const verdictStyles: Record<string, string> = {
    Offer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    Accepted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    Rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    "In Progress": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  };

  const cleanSnippet = item.content
    .replace(/^#+\s+/gm, "")
    .replace(/^[-*•]\s+/gm, "")
    .replace(/^---\s*$/gm, "")
    .replace(/\*\*\*(.*?)\*\*\*/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\$([^$]+)\$/g, "$1")
    .replace(/\*/g, "")
    .trim()
    .slice(0, 220);

  return (
    <article
      ref={cardRef}
      onPointerEnter={handlePreloadExperience}
      onTouchStart={handlePreloadExperience}
      className="bg-card border border-border/70 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-border transition-all duration-200 group flex flex-col justify-between space-y-3.5"
    >
      <div className="space-y-3">
        {/* Top Meta: Company + Role + Result + Round + Date */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Company Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold">
              <Building2 className="size-3" />
              <span>{item.company}</span>
            </span>

            {/* Role */}
            <span className="text-xs font-semibold text-foreground/90">
              {item.authorRole || "Software Engineer"}
            </span>

            {/* Result Badge */}
            {item.verdict && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                  verdictStyles[item.verdict] || "bg-muted text-muted-foreground border-border/50"
                }`}
              >
                {item.verdict === "Offer" || item.verdict === "Accepted" ? (
                  <CheckCircle2 className="size-3" />
                ) : item.verdict === "Rejected" ? (
                  <XCircle className="size-3" />
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

            {/* Round Badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/50 text-[11px] font-medium">
              <Briefcase className="size-3" />
              <span>{item.round}</span>
            </span>
          </div>

          <span className="text-[11px] text-muted-foreground shrink-0">{formatRelativeTime(item.createdAt)}</span>
        </div>

        {/* Title Link to Dynamic [id] Page */}
        <Link
          href={`/dashboard/interview-experiences/${item.id}`}
          onClick={handlePreloadExperience}
          className="block group/title"
        >
          <h2 className="text-base sm:text-lg font-bold text-foreground group-hover/title:text-blue-600 transition-colors leading-snug">
            {item.title}
          </h2>
        </Link>

        {/* Content Snippet */}
        <Link
          href={`/dashboard/interview-experiences/${item.id}`}
          onClick={handlePreloadExperience}
          className="block text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 hover:text-foreground/90 transition-colors"
        >
          {cleanSnippet}...
        </Link>

        {/* Topics */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap text-xs pt-0.5">
            <span className="text-[11px] font-medium text-muted-foreground">Topics:</span>
            {item.tags.slice(0, 5).map((tag, idx) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-foreground/80 hover:text-blue-600 transition-colors"
              >
                {tag}
                {idx < Math.min(item.tags.length, 5) - 1 ? " ·" : ""}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Bar: Author Info & Interactive Actions */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-3 text-muted-foreground">
        {/* Author badge */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-6 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
            {item.avatarUrl ? (
              <img src={item.avatarUrl} alt="" className="size-full rounded-full object-cover" />
            ) : (
              item.authorName?.[0]?.toUpperCase() || "C"
            )}
          </div>
          <span className="text-xs font-medium text-foreground truncate">{item.authorName}</span>
          <span className="text-[11px] text-muted-foreground/80 hidden sm:inline truncate">
            {item.authorRole}
          </span>
        </div>

        {/* Actions Tray */}
        <div className="flex items-center gap-3.5 sm:gap-4 shrink-0">
          {/* Like */}
          <button
            type="button"
            onClick={handleToggleLike}
            className={`flex items-center gap-1 text-xs transition-colors cursor-pointer ${
              liked ? "text-[#f91880] font-semibold" : "hover:text-[#f91880]"
            }`}
            title="Like"
          >
            <Heart className={`size-3.5 transition-transform active:scale-125 ${liked ? "fill-current" : ""}`} />
            <span>{formatNumber(likesCount)}</span>
          </button>

          {/* Comments Link */}
          <Link
            href={`/dashboard/interview-experiences/${item.id}`}
            onClick={handlePreloadExperience}
            className="flex items-center gap-1 text-xs hover:text-blue-600 transition-colors"
            title="Comments"
          >
            <MessageCircle className="size-3.5" />
            <span>{formatNumber(item.commentsCount)}</span>
          </Link>

          {/* Views Analytics (Image 2 Style) */}
          <div
            className="flex items-center gap-1 text-xs hover:text-[#1d9bf0] cursor-default transition-colors"
            title={`${viewsCount} Views`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 fill-current">
              <g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g>
            </svg>
            <span>{formatNumber(viewsCount)}</span>
          </div>

          {/* Bookmark */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`transition-colors cursor-pointer ${
              bookmarked ? "text-blue-600" : "hover:text-foreground"
            }`}
            title="Bookmark"
          >
            <Bookmark className={`size-3.5 ${bookmarked ? "fill-current" : ""}`} />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="hover:text-foreground transition-colors cursor-pointer"
            title="Share"
          >
            <Share2 className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page Feed Component                                           */
/* ------------------------------------------------------------------ */

export default function InterviewExperiencesPage() {
  const { user } = useAuth();
  const currentUserId = user?.uid;
  const router = useRouter();

  const [experiences, setExperiences] = useState<InterviewExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Database Companies
  const [dbCompanies, setDbCompanies] = useState<DbCompanyItem[]>([]);

  // Filters
  const [selectedCompany, setSelectedCompany] = useState<string>("ALL");
  const [selectedRound, setSelectedRound] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "comments">("latest");

  // Dropdown States
  const [companyFilterOpen, setCompanyFilterOpen] = useState(false);
  const [companyFilterSearch, setCompanyFilterSearch] = useState("");
  const [roundFilterOpen, setRoundFilterOpen] = useState(false);

  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const roundDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(e.target as Node)) {
        setCompanyFilterOpen(false);
      }
      if (roundDropdownRef.current && !roundDropdownRef.current.contains(e.target as Node)) {
        setRoundFilterOpen(false);
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

  // Fetch experiences and trending debriefs
  useEffect(() => {
    let isCurrent = true;

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCompany !== "ALL") params.append("company", selectedCompany);
        if (selectedRound !== "ALL") params.append("round", selectedRound);
        if (searchQuery.trim()) params.append("search", searchQuery.trim());
        params.append("sort", sortBy);
        if (currentUserId) params.append("userId", currentUserId);

        const res = await fetch(`/api/interview-experiences?${params.toString()}`);
        const data = await res.json();
        if (isCurrent && data.success) {
          if (Array.isArray(data.experiences)) {
            setExperiences(data.experiences);
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
  }, [selectedCompany, selectedRound, sortBy, searchQuery, currentUserId]);

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

  return (
    <div className="max-w-4xl mx-auto p-3.5 sm:p-6 space-y-6 pb-20">
      <div className="space-y-4">
          {/* Hero Banner (What's on your mind? with Share Experience button) */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs">
            {/* Ambient Gradient Glows */}
            <div className="absolute -right-16 -top-16 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-1/3 -bottom-16 w-52 h-52 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Dashed Trajectory Flight-Path Curve */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none hidden md:block select-none"
              viewBox="0 0 700 180"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M 120 130 C 220 130, 260 40, 360 48 C 460 56, 500 140, 600 120 C 650 110, 670 60, 700 48"
                stroke="currentColor"
                className="text-border/80 dark:text-border/50"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>

            {/* Left Content Area */}
            <div className="relative z-10 max-w-sm sm:max-w-md space-y-3">
              <div className="space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  What&apos;s on your mind?
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  What&apos;s your story? Real interview questions, round breakdowns (OA, DSA, System Design), or success tips...
                </p>
              </div>

              <div className="pt-1">
                <Link
                  href="/dashboard/interview-experiences/share"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-blue-500/20 active:scale-95"
                >
                  <span>Share Experience</span>
                  <Plus className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Floating Animated Badges & Elements along the Curved Path */}
            <div className="absolute inset-0 pointer-events-none hidden md:block overflow-hidden">
              {/* 1. Target Bullseye / OA Badge */}
              <div
                className="absolute top-[12%] right-[32%] flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-md border border-border/80 shadow-xs text-xs font-semibold text-foreground pointer-events-auto hover:scale-105 transition-transform"
                style={{ animation: "floatSlow 4s ease-in-out infinite" }}
              >
                <span className="size-4.5 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                  <Target className="size-2.5 text-rose-500" />
                </span>
                <span className="text-[10px] font-bold">OA Round</span>
              </div>

              {/* 2. Candidate Avatar: Google L4 */}
              <div
                className="absolute top-[34%] right-[8%] flex items-center gap-2 px-2.5 py-1 rounded-full bg-card/95 backdrop-blur-md border border-border/80 shadow-md text-xs font-bold text-foreground pointer-events-auto hover:scale-105 transition-all cursor-pointer"
                style={{ animation: "floatDelayed 4.5s ease-in-out infinite" }}
                onClick={() => setSelectedCompany("Google")}
                title="Filter Google Debriefs"
              >
                <div className="relative size-6 rounded-full overflow-hidden shrink-0 ring-1.5 ring-blue-500/50">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                    alt="Google SWE"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-blue-600 ring-1 ring-card flex items-center justify-center text-[7px] font-black text-white">
                    G
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold leading-tight">Google L4</span>
                  <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 leading-none">Accepted</span>
                </div>
              </div>

              {/* 3. Round 1 DSA Badge */}
              <div
                className="absolute bottom-[16%] right-[30%] flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-md border border-orange-500/30 text-orange-600 dark:text-orange-400 shadow-xs text-xs font-semibold pointer-events-auto hover:scale-105 transition-transform"
                style={{ animation: "floatGentle 4.2s ease-in-out infinite" }}
              >
                <Code2 className="size-3 text-orange-500 shrink-0" />
                <span className="text-[10px] font-semibold">DSA Round</span>
              </div>

              {/* 4. Candidate Avatar: Amazon SDE-2 */}
              <div
                className="absolute bottom-[14%] right-[6%] flex items-center gap-2 px-2.5 py-1 rounded-full bg-card/95 backdrop-blur-md border border-border/80 shadow-sm text-xs font-bold text-foreground pointer-events-auto hover:scale-105 transition-all cursor-pointer"
                style={{ animation: "floatSlow 4.8s ease-in-out infinite" }}
                onClick={() => setSelectedCompany("Amazon")}
                title="Filter Amazon Debriefs"
              >
                <div className="relative size-6 rounded-full overflow-hidden shrink-0 ring-1.5 ring-amber-500/40">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
                    alt="Amazon SDE"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-amber-600 ring-1 ring-card flex items-center justify-center text-[7px] font-black text-white">
                    A
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold leading-tight">Amazon SDE</span>
                  <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 leading-none">Offer</span>
                </div>
              </div>
            </div>
          </div>
          {/* Sleek Compact Filter Bar (No wasted vertical space) */}
          <div className="bg-card border border-border/70 rounded-2xl p-2.5 sm:p-3 shadow-2xs space-y-2.5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search debriefs by company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted/40 border border-border/60 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/50"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Controls Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                {/* 2-Col Grid on mobile for Company and Round */}
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 flex-1 sm:flex-initial">
                  {/* Company Dropdown Filter */}
                  <div className="relative w-full sm:w-auto" ref={companyDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setCompanyFilterOpen((v) => !v)}
                      className={`flex items-center justify-between gap-1.5 sm:gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer w-full sm:w-auto ${
                        selectedCompany !== "ALL"
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : "bg-muted/40 hover:bg-muted text-foreground border-border/60"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Building2 className="size-3.5 shrink-0" />
                        <span className="truncate max-w-[85px] xs:max-w-[110px] sm:max-w-[140px]">
                          {selectedCompany === "ALL" ? "All Companies" : selectedCompany}
                        </span>
                      </div>
                      <ChevronDown className="size-3.5 opacity-70 shrink-0" />
                    </button>

                    {companyFilterOpen && (
                      <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 bg-popover text-popover-foreground border border-border/80 rounded-2xl shadow-xl p-2 z-30 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                        {/* Search inside companies */}
                        <div className="relative">
                          <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search 690+ companies..."
                            value={companyFilterSearch}
                            onChange={(e) => setCompanyFilterSearch(e.target.value)}
                            className="w-full bg-muted/60 border border-border/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500"
                            autoFocus
                          />
                        </div>

                        <div className="max-h-56 overflow-y-auto space-y-0.5 scrollbar-thin">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCompany("ALL");
                              setCompanyFilterOpen(false);
                              setCompanyFilterSearch("");
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                              selectedCompany === "ALL" ? "bg-blue-600 text-white font-bold" : "hover:bg-muted text-foreground"
                            }`}
                          >
                            <Building2 className={`size-3.5 shrink-0 ${selectedCompany === "ALL" ? "text-white" : "text-blue-500"}`} />
                            <span>All Companies</span>
                          </button>
                          {filteredCompaniesForFilter.slice(0, 50).map((c) => (
                            <button
                              key={c.id || c.name}
                              type="button"
                              onClick={() => {
                                setSelectedCompany(c.name);
                                setCompanyFilterOpen(false);
                                setCompanyFilterSearch("");
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                                selectedCompany.toLowerCase() === c.name.toLowerCase()
                                  ? "bg-blue-600 text-white font-bold"
                                  : "hover:bg-muted text-foreground"
                              }`}
                            >
                              <span className="size-1.5 rounded-full bg-blue-500/70 shrink-0" />
                              <span className="truncate">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Round Dropdown Filter */}
                  <div className="relative w-full sm:w-auto" ref={roundDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setRoundFilterOpen((v) => !v)}
                      className={`flex items-center justify-between gap-1.5 sm:gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer w-full sm:w-auto ${
                        selectedRound !== "ALL"
                          ? "bg-orange-600 text-white border-orange-600 shadow-2xs"
                          : "bg-muted/40 hover:bg-muted text-foreground border-border/60"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Briefcase className="size-3.5 shrink-0" />
                        <span className="truncate max-w-[85px] xs:max-w-[110px] sm:max-w-[140px]">
                          {selectedRound === "ALL" ? "All Rounds" : selectedRound}
                        </span>
                      </div>
                      <ChevronDown className="size-3.5 opacity-70 shrink-0" />
                    </button>

                    {roundFilterOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-popover text-popover-foreground border border-border/80 rounded-2xl shadow-xl p-1.5 z-30 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRound("ALL");
                            setRoundFilterOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                            selectedRound === "ALL" ? "bg-orange-600 text-white font-bold" : "hover:bg-muted text-foreground"
                          }`}
                        >
                          <Target className={`size-3.5 shrink-0 ${selectedRound === "ALL" ? "text-white" : "text-orange-500"}`} />
                          <span>All Rounds</span>
                        </button>
                        {INTERVIEW_ROUNDS.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => {
                              setSelectedRound(r);
                              setRoundFilterOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                              selectedRound === r ? "bg-orange-600 text-white font-bold" : "hover:bg-muted text-foreground"
                            }`}
                          >
                            <span className={`size-1.5 rounded-full shrink-0 ${selectedRound === r ? "bg-white" : "bg-orange-500/70"}`} />
                            <span className="truncate">{r}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sort Toggle */}
                <div className="flex items-center bg-muted/40 border border-border/60 rounded-xl p-1 w-full sm:w-auto justify-center sm:justify-start shrink-0 text-xs">
                  <button
                    type="button"
                    onClick={() => setSortBy("latest")}
                    className={`flex-1 sm:flex-initial text-center px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      sortBy === "latest" ? "bg-card text-foreground font-bold shadow-2xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Latest
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy("popular")}
                    className={`flex-1 sm:flex-initial text-center px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      sortBy === "popular" ? "bg-card text-foreground font-bold shadow-2xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Upvoted
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy("comments")}
                    className={`flex-1 sm:flex-initial text-center px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      sortBy === "comments" ? "bg-card text-foreground font-bold shadow-2xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Discussed
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Row (Takes only minimal space when filters are engaged) */}
            {(selectedCompany !== "ALL" || selectedRound !== "ALL" || searchQuery) && (
              <div className="flex items-center gap-2 pt-2 border-t border-border/40 text-xs flex-wrap">
                <span className="text-[11px] font-medium text-muted-foreground">Active:</span>
                {selectedCompany !== "ALL" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[11px] border border-blue-500/20">
                    <Building2 className="size-3 text-blue-500 shrink-0" />
                    <span>{selectedCompany}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCompany("ALL")}
                      className="hover:text-foreground cursor-pointer ml-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}
                {selectedRound !== "ALL" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold text-[11px] border border-orange-500/20">
                    <Target className="size-3 text-orange-500 shrink-0" />
                    <span>{selectedRound}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedRound("ALL")}
                      className="hover:text-foreground cursor-pointer ml-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-muted text-foreground font-semibold text-[11px] border border-border/60">
                    &ldquo;{searchQuery}&rdquo;
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="hover:text-foreground cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCompany("ALL");
                    setSelectedRound("ALL");
                    setSearchQuery("");
                  }}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer ml-auto"
                >
                  Reset all
                </button>
              </div>
            )}
          </div>

          {/* Experience Feed List */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ExperienceCardSkeleton key={i} delay={i * 80} />
              ))}
            </div>
          ) : experiences.length === 0 ? (
            <div className="bg-card border border-border/70 rounded-2xl p-10 text-center space-y-3">
              <div className="size-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto">
                <Briefcase className="size-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">No interview experiences found</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                No debriefs match your current filter. Be the first to share your interview experience for this company or round!
              </p>
              <Link
                href="/dashboard/interview-experiences/share"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="size-3.5" />
                <span>Share First Experience</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
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
    </div>
  );
}
