"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  RiYoutubeLine,
  RiGithubLine,
  RiGlobalLine,
  RiBookOpenLine,
  RiFlashlightLine,
  RiSearchLine,
  RiBookmarkLine,
  RiBookmarkFill,
  RiExternalLinkLine,
  RiCloseLine,
  RiStarFill,
  RiCheckLine,
  RiStackLine,
  RiPlayFill,
  RiArrowDownSLine,
} from "@remixicon/react";
import {
  SYSTEM_DESIGN_DATA,
  YouTubeChannel,
  GitHubRepo,
  EngineeringBlog,
  BookOrWhitepaper,
  ArchitecturalCheatSheet,
} from "@/lib/system-design-data";
import { Badge } from "@/components/base/badges/badge";
import { cx } from "@/utils/cx";

type TabKey = "all" | "youtube" | "github" | "blogs" | "books" | "cheatsheets";

export function SystemDesignHub() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive active tab directly from search params
  const rawTab = searchParams.get("tab");
  const activeTab: TabKey =
    rawTab && ["all", "youtube", "github", "blogs", "books", "cheatsheets"].includes(rawTab)
      ? (rawTab as TabKey)
      : "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [bookSubFilter, setBookSubFilter] = useState<"all" | "book" | "paper">("all");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Close category dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lazy initialize saved bookmarks from localStorage
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = localStorage.getItem("algoryn_system_design_bookmarks");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem("algoryn_system_design_bookmarks", JSON.stringify(Array.from(next)));
      } catch {
        // Ignore localStorage errors
      }
      return next;
    });
  };

  const handleTabChange = (tab: TabKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/dashboard/system-design?${params.toString()}`, { scroll: false });
  };

  const query = searchQuery.trim().toLowerCase();

  // Filter YouTube Channels
  const filteredYouTube = useMemo(() => {
    return SYSTEM_DESIGN_DATA.youtubeChannels.filter((ch) => {
      if (showSavedOnly && !savedIds.has(ch.id)) return false;
      if (levelFilter !== "all" && ch.level !== levelFilter) return false;
      if (!query) return true;
      return (
        ch.name.toLowerCase().includes(query) ||
        ch.handle.toLowerCase().includes(query) ||
        ch.description.toLowerCase().includes(query) ||
        ch.featuredVideo.toLowerCase().includes(query) ||
        ch.tags.some((t) => t.toLowerCase().includes(query)) ||
        ch.topPlaylists.some((p) => p.toLowerCase().includes(query))
      );
    });
  }, [query, levelFilter, showSavedOnly, savedIds]);

  // Filter GitHub Repos
  const filteredGithub = useMemo(() => {
    return SYSTEM_DESIGN_DATA.githubRepos.filter((repo) => {
      if (showSavedOnly && !savedIds.has(repo.id)) return false;
      if (!query) return true;
      return (
        repo.title.toLowerCase().includes(query) ||
        repo.repo.toLowerCase().includes(query) ||
        repo.description.toLowerCase().includes(query) ||
        repo.topics.some((t) => t.toLowerCase().includes(query)) ||
        repo.highlight.toLowerCase().includes(query)
      );
    });
  }, [query, showSavedOnly, savedIds]);

  // Filter Engineering Blogs
  const filteredBlogs = useMemo(() => {
    return SYSTEM_DESIGN_DATA.engineeringBlogs.filter((blog) => {
      if (showSavedOnly && !savedIds.has(blog.id)) return false;
      if (!query) return true;
      return (
        blog.company.toLowerCase().includes(query) ||
        blog.description.toLowerCase().includes(query) ||
        blog.mustReadArticle.title.toLowerCase().includes(query) ||
        blog.mustReadArticle.topic.toLowerCase().includes(query) ||
        blog.tags.some((t) => t.toLowerCase().includes(query))
      );
    });
  }, [query, showSavedOnly, savedIds]);

  // Filter Books & Whitepapers
  const filteredBooks = useMemo(() => {
    return SYSTEM_DESIGN_DATA.booksAndWhitepapers.filter((item) => {
      if (showSavedOnly && !savedIds.has(item.id)) return false;
      if (bookSubFilter !== "all" && item.type !== bookSubFilter) return false;
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.keyTakeaway.toLowerCase().includes(query) ||
        (item.publisher && item.publisher.toLowerCase().includes(query)) ||
        (item.venue && item.venue.toLowerCase().includes(query))
      );
    });
  }, [query, showSavedOnly, savedIds, bookSubFilter]);

  // Filter Cheat Sheets
  const filteredCheatSheets = useMemo(() => {
    return SYSTEM_DESIGN_DATA.architecturalCheatSheets.filter((item) => {
      if (showSavedOnly && !savedIds.has(item.id)) return false;
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.keyPoints.some((p) => p.toLowerCase().includes(query))
      );
    });
  }, [query, showSavedOnly, savedIds]);

  const totalCuratedCount = SYSTEM_DESIGN_DATA.metadata.totalResources;

  const totalFiltered =
    filteredYouTube.length +
    filteredGithub.length +
    filteredBlogs.length +
    filteredBooks.length +
    filteredCheatSheets.length;

  return (
    <div className="flex flex-col min-h-full w-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Compact Header (Clean, Content-First, Algoryn Standard) */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              System Design Hub
            </h1>
            <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
              • {totalCuratedCount} Resources
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-2xl">
            Curated library of top YouTube breakdowns, GitHub repositories, tier-1 engineering blogs, seminal whitepapers, and architectural cheat sheets.
          </p>
        </div>
      </header>

      {/* Interactive Controls & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        {/* Responsive Category Selector */}
        <div className="flex items-center gap-2">
          {/* 1. Mobile & Tablet Category Dropdown (xl:hidden) - Never overflows or truncates */}
          <div className="relative xl:hidden" ref={categoryDropdownRef}>
            {(() => {
              const currentCategoryMeta = [
                { key: "all" as const, label: "All Categories", shortLabel: "All", icon: RiStackLine, count: totalCuratedCount },
                { key: "youtube" as const, label: "YouTube Breakdowns", shortLabel: "YouTube", icon: RiYoutubeLine, count: SYSTEM_DESIGN_DATA.youtubeChannels.length },
                { key: "github" as const, label: "GitHub Repositories", shortLabel: "GitHub", icon: RiGithubLine, count: SYSTEM_DESIGN_DATA.githubRepos.length },
                { key: "blogs" as const, label: "Engineering Blogs", shortLabel: "Blogs", icon: RiGlobalLine, count: SYSTEM_DESIGN_DATA.engineeringBlogs.length },
                { key: "books" as const, label: "Books & Papers", shortLabel: "Books & Papers", icon: RiBookOpenLine, count: SYSTEM_DESIGN_DATA.booksAndWhitepapers.length },
                { key: "cheatsheets" as const, label: "Cheat Sheets", shortLabel: "Cheat Sheets", icon: RiFlashlightLine, count: SYSTEM_DESIGN_DATA.architecturalCheatSheets.length },
              ].find((c) => c.key === activeTab) || {
                key: "all" as const,
                label: "All Categories",
                shortLabel: "All",
                icon: RiStackLine,
                count: totalCuratedCount,
              };
              const CurIcon = currentCategoryMeta.icon;

              return (
                <>
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0c101c] border border-slate-200/80 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer min-w-56"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <CurIcon className="size-4 text-accent-500 shrink-0" />
                      <span className="truncate">{currentCategoryMeta.label}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                        {currentCategoryMeta.count}
                      </span>
                    </div>
                    <RiArrowDownSLine
                      className={cx("size-4 text-slate-400 transition-transform duration-200 shrink-0", isCategoryDropdownOpen && "rotate-180")}
                    />
                  </button>

                  {isCategoryDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-64 z-50 rounded-xl bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-zinc-800 shadow-xl p-1.5 space-y-0.5">
                      <div className="px-2.5 py-1 text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                        Filter by Category
                      </div>
                      {[
                        { key: "all" as const, label: "All Categories", icon: RiStackLine, count: totalCuratedCount },
                        { key: "youtube" as const, label: "YouTube Breakdowns", icon: RiYoutubeLine, count: SYSTEM_DESIGN_DATA.youtubeChannels.length },
                        { key: "github" as const, label: "GitHub Repositories", icon: RiGithubLine, count: SYSTEM_DESIGN_DATA.githubRepos.length },
                        { key: "blogs" as const, label: "Engineering Blogs", icon: RiGlobalLine, count: SYSTEM_DESIGN_DATA.engineeringBlogs.length },
                        { key: "books" as const, label: "Books & Papers", icon: RiBookOpenLine, count: SYSTEM_DESIGN_DATA.booksAndWhitepapers.length },
                        { key: "cheatsheets" as const, label: "Cheat Sheets", icon: RiFlashlightLine, count: SYSTEM_DESIGN_DATA.architecturalCheatSheets.length },
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = activeTab === tab.key;
                        return (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => {
                              handleTabChange(tab.key);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={cx(
                              "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left",
                              isSelected
                                ? "bg-accent-50 dark:bg-accent-950/40 text-accent-600 dark:text-accent-400 font-semibold"
                                : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100"
                            )}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Icon className={cx("size-4 shrink-0", isSelected ? "text-accent-500" : "text-slate-400 dark:text-zinc-500")} />
                              <span className="truncate">{tab.label}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 font-bold">
                                {tab.count}
                              </span>
                              {isSelected && <RiCheckLine className="size-3.5 text-accent-500" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          {/* 2. Desktop Category Pills (hidden xl:flex) - Clean inline wrapping */}
          <div className="hidden xl:flex items-center gap-1.5 flex-wrap">
            {[
              { key: "all" as const, label: "All", icon: RiStackLine, count: totalCuratedCount },
              { key: "youtube" as const, label: "YouTube Videos", icon: RiYoutubeLine, count: SYSTEM_DESIGN_DATA.youtubeChannels.length },
              { key: "github" as const, label: "GitHub Repos", icon: RiGithubLine, count: SYSTEM_DESIGN_DATA.githubRepos.length },
              { key: "blogs" as const, label: "Engineering Blogs", icon: RiGlobalLine, count: SYSTEM_DESIGN_DATA.engineeringBlogs.length },
              { key: "books" as const, label: "Books & Papers", icon: RiBookOpenLine, count: SYSTEM_DESIGN_DATA.booksAndWhitepapers.length },
              { key: "cheatsheets" as const, label: "Cheat Sheets", icon: RiFlashlightLine, count: SYSTEM_DESIGN_DATA.architecturalCheatSheets.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={cx(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all duration-200 cursor-pointer select-none border",
                    isSelected
                      ? "bg-linear-to-b from-accent-500 to-accent-600 text-white shadow-nav-selected border-transparent font-semibold"
                      : "bg-white dark:bg-[#0c101c] border-slate-200/80 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100 font-medium"
                  )}
                >
                  <Icon
                    className={cx(
                      "size-4 shrink-0 transition-colors",
                      isSelected ? "text-white" : "text-slate-500 dark:text-zinc-400"
                    )}
                  />
                  <span>{tab.label}</span>
                  <span
                    className={cx(
                      "text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ml-0.5 transition-colors",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-zinc-800/80 text-slate-500 dark:text-zinc-400"
                    )}
                  >
                    ({tab.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side search & saved toggles */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-64">
            <RiSearchLine className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, creators, repos..."
              className="w-full pl-8 pr-7 py-1.5 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none focus:ring-1 focus:ring-accent-500 dark:focus:ring-accent-400 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <RiCloseLine className="size-3.5" />
              </button>
            )}
          </div>

          {/* Saved bookmarks toggle */}
          <button
            type="button"
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={cx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-all duration-200 cursor-pointer shrink-0 select-none",
              showSavedOnly
                ? "bg-linear-to-b from-accent-500 to-accent-600 text-white shadow-nav-selected border-transparent font-semibold"
                : "bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/70 font-medium"
            )}
          >
            {showSavedOnly ? <RiBookmarkFill className="size-3.5 text-white" /> : <RiBookmarkLine className="size-3.5" />}
            <span className="hidden sm:inline">Saved</span>
            {savedIds.size > 0 && (
              <span
                className={cx(
                  "text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold",
                  showSavedOnly
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200"
                )}
              >
                {savedIds.size}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8">
        {/* 1. YouTube Channels with 100% Guaranteed Visible Video Thumbnails & Fallbacks */}
        {(activeTab === "all" || activeTab === "youtube") && filteredYouTube.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800/80 pb-2">
              <div className="flex items-center gap-2">
                <RiYoutubeLine className="size-5 text-slate-800 dark:text-zinc-200" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
                  YouTube Video Breakdown & Channels
                </h2>
                <Badge color="neutral" className="text-[10px] font-mono">
                  {filteredYouTube.length}
                </Badge>
              </div>

              {activeTab === "youtube" && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 dark:text-zinc-500 text-[11px]">Level:</span>
                  <div className="flex items-center gap-1 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-0.5 bg-slate-50 dark:bg-zinc-900/60">
                    {(["all", "Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLevelFilter(lvl)}
                        className={cx(
                          "px-2.5 py-0.5 rounded-lg text-[11px] transition-all duration-150 cursor-pointer select-none",
                          levelFilter === lvl
                            ? "bg-linear-to-b from-accent-500 to-accent-600 text-white shadow-nav-selected font-semibold"
                            : "text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100 font-medium"
                        )}
                      >
                        {lvl === "all" ? "All" : lvl}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredYouTube.map((ch) => (
                <YouTubeCard
                  key={ch.id}
                  channel={ch}
                  isSaved={savedIds.has(ch.id)}
                  onToggleSave={() => toggleSave(ch.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2. GitHub Repositories */}
        {(activeTab === "all" || activeTab === "github") && filteredGithub.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-zinc-800/80 pb-2">
              <RiGithubLine className="size-5 text-slate-800 dark:text-zinc-200" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
                Essential GitHub Repositories
              </h2>
              <Badge color="neutral" className="text-[10px] font-mono">
                {filteredGithub.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGithub.map((repo) => (
                <GitHubRepoCard
                  key={repo.id}
                  repo={repo}
                  isSaved={savedIds.has(repo.id)}
                  onToggleSave={() => toggleSave(repo.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. Engineering Blogs */}
        {(activeTab === "all" || activeTab === "blogs") && filteredBlogs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-zinc-800/80 pb-2">
              <RiGlobalLine className="size-5 text-slate-800 dark:text-zinc-200" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
                Tier-1 Engineering Blogs
              </h2>
              <Badge color="neutral" className="text-[10px] font-mono">
                {filteredBlogs.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBlogs.map((blog) => (
                <EngineeringBlogCard
                  key={blog.id}
                  blog={blog}
                  isSaved={savedIds.has(blog.id)}
                  onToggleSave={() => toggleSave(blog.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 4. Books & Whitepapers */}
        {(activeTab === "all" || activeTab === "books") && filteredBooks.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-zinc-800/80 pb-2">
              <div className="flex items-center gap-2">
                <RiBookOpenLine className="size-5 text-slate-800 dark:text-zinc-200" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
                  Seminal Books & Research Whitepapers
                </h2>
                <Badge color="neutral" className="text-[10px] font-mono">
                  {filteredBooks.length}
                </Badge>
              </div>

              {/* Sub-Filter: All / Books Only / Research Papers Only */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200/60 dark:border-zinc-800/80 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setBookSubFilter("all")}
                  className={cx(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    bookSubFilter === "all"
                      ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-2xs"
                      : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                  )}
                >
                  All ({SYSTEM_DESIGN_DATA.booksAndWhitepapers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBookSubFilter("book")}
                  className={cx(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    bookSubFilter === "book"
                      ? "bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-2xs"
                      : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                  )}
                >
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  Books ({SYSTEM_DESIGN_DATA.booksAndWhitepapers.filter(b => b.type === "book").length})
                </button>
                <button
                  type="button"
                  onClick={() => setBookSubFilter("paper")}
                  className={cx(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    bookSubFilter === "paper"
                      ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                      : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                  )}
                >
                  <span className="size-1.5 rounded-full bg-blue-500" />
                  Papers ({SYSTEM_DESIGN_DATA.booksAndWhitepapers.filter(b => b.type === "paper").length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((item) => (
                <BookCard
                  key={item.id}
                  item={item}
                  isSaved={savedIds.has(item.id)}
                  onToggleSave={() => toggleSave(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 5. Architectural Cheat Sheets */}
        {(activeTab === "all" || activeTab === "cheatsheets") && filteredCheatSheets.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-zinc-800/80 pb-2">
              <RiFlashlightLine className="size-5 text-slate-800 dark:text-zinc-200" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
                Architectural Cheat Sheets
              </h2>
              <Badge color="neutral" className="text-[10px] font-mono">
                {filteredCheatSheets.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCheatSheets.map((item) => (
                <CheatSheetCard
                  key={item.id}
                  item={item}
                  isSaved={savedIds.has(item.id)}
                  onToggleSave={() => toggleSave(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {totalFiltered === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800">
            <RiSearchLine className="size-8 text-slate-400 dark:text-zinc-600 mb-2" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">No resources found</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1 max-w-sm">
              We couldn&apos;t find any items matching &quot;{searchQuery}&quot;. Try a different search term or reset your filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setShowSavedOnly(false);
                setLevelFilter("all");
              }}
              className="mt-4 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-linear-to-b from-accent-500 to-accent-600 text-white shadow-nav-selected hover:opacity-95 transition-opacity cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Guaranteed Working Video Thumbnail Component (No empty/broken box)  */
/* ------------------------------------------------------------------ */

function VideoThumbnail({
  channel,
}: {
  channel: YouTubeChannel;
}) {
  const [hasError, setHasError] = useState(false);

  // Prefer verified thumbnailUrl from dataset; fallback to generating from verified videoId
  const thumbnailSrc = useMemo(() => {
    if (channel.thumbnailUrl && channel.thumbnailUrl.startsWith("http")) {
      return channel.thumbnailUrl;
    }
    if (channel.videoId && channel.videoId.length === 11) {
      return `https://i.ytimg.com/vi/${channel.videoId}/hqdefault.jpg`;
    }
    return "";
  }, [channel.thumbnailUrl, channel.videoId]);

  if (hasError || !thumbnailSrc) {
    return (
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 dark:bg-black border border-slate-800 p-4 flex flex-col justify-between select-none">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            System Design
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-white/10 text-white">
            {channel.level}
          </span>
        </div>
        <div className="flex items-center justify-center my-auto">
          <div className="size-11 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20">
            <RiPlayFill className="size-5 ml-0.5" />
          </div>
        </div>
        <div className="text-[11px] font-semibold text-slate-200 truncate">
          {channel.featuredVideo}
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200/60 dark:border-zinc-800 group/thumb">
      <img
        src={thumbnailSrc}
        alt={channel.featuredVideo}
        referrerPolicy="no-referrer"
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onLoad={(e) => {
          // YouTube returns a 120x90 image (naturalWidth === 120 && naturalHeight === 90) when the requested thumbnail is unavailable
          const img = e.currentTarget;
          if (img.naturalWidth === 120 && img.naturalHeight === 90) {
            setHasError(true);
          }
        }}
        onError={() => {
          // Prevent repeated retry loops: set hasError and switch to graceful fallback
          setHasError(true);
        }}
      />
      <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
        <div className="size-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-xs transition-transform group-hover:scale-110">
          <RiPlayFill className="size-5 ml-0.5" />
        </div>
      </div>
      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/80 text-white backdrop-blur-xs">
        {channel.level}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Guaranteed Visible Channel Avatar Component                        */
/* ------------------------------------------------------------------ */

function ChannelAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const [hasError, setHasError] = useState(false);

  const getInitials = (n: string) => {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  if (!avatarUrl || hasError) {
    return (
      <div className="size-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 text-xs font-bold font-mono flex items-center justify-center shrink-0 border border-slate-200 dark:border-zinc-700">
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className="size-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-zinc-700 overflow-hidden">
      <img
        src={avatarUrl}
        alt={name}
        referrerPolicy="no-referrer"
        className="size-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Individual Resource Card Components (Algoryn Monochrome Theme)     */
/* ------------------------------------------------------------------ */

function YouTubeCard({
  channel,
  isSaved,
  onToggleSave,
}: {
  channel: YouTubeChannel;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] p-4 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xs transition-all overflow-hidden">
      <div className="space-y-3">
        {/* Guaranteed Working YouTube Video Thumbnail */}
        <VideoThumbnail channel={channel} />

        {/* Channel Info & Creator */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <ChannelAvatar name={channel.name} avatarUrl={channel.avatarUrl} />
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                {channel.name}
              </h3>
              <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate">
                {channel.handle} {channel.subscriberCount ? `• ${channel.subscriberCount}` : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleSave}
            title={isSaved ? "Remove bookmark" : "Bookmark video"}
            className="text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors cursor-pointer shrink-0 p-1"
          >
            {isSaved ? <RiBookmarkFill className="size-4 text-slate-900 dark:text-zinc-100" /> : <RiBookmarkLine className="size-4" />}
          </button>
        </div>

        {/* Featured Video Title */}
        <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100 line-clamp-1">
          {channel.featuredVideo}
        </div>

        {/* Description */}
        <p className="text-[11px] text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {channel.description}
        </p>

        {/* Top Playlists */}
        {channel.topPlaylists && channel.topPlaylists.length > 0 && (
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Playlists:
            </span>
            <div className="flex flex-wrap gap-1">
              {channel.topPlaylists.slice(0, 2).map((pl, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 font-medium truncate max-w-full"
                >
                  {pl}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer link button */}
      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center gap-2">
        <a
          href={channel.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition-colors"
        >
          <RiPlayFill className="size-3.5" />
          <span>Watch Video</span>
        </a>
        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Visit Channel"
          className="p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
        >
          <RiExternalLinkLine className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

function GitHubRepoCard({
  repo,
  isSaved,
  onToggleSave,
}: {
  repo: GitHubRepo;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] p-4.5 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xs transition-all">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200/60 dark:border-zinc-700/60">
              <RiGithubLine className="size-5 text-slate-800 dark:text-zinc-200" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">
                {repo.title}
              </h3>
              <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate">
                {repo.repo}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleSave}
            title={isSaved ? "Remove bookmark" : "Bookmark repo"}
            className="text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors cursor-pointer shrink-0"
          >
            {isSaved ? <RiBookmarkFill className="size-4 text-slate-900 dark:text-zinc-100" /> : <RiBookmarkLine className="size-4" />}
          </button>
        </div>

        {/* Stars pill */}
        {repo.stars && (
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              <RiStarFill className="size-3 text-slate-500 dark:text-zinc-400" />
              {repo.stars}
            </span>
          </div>
        )}

        <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
          {repo.description}
        </p>

        {/* Highlight callout */}
        {repo.highlight && (
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800 text-[11px] text-slate-600 dark:text-zinc-400">
            <span className="font-semibold text-slate-900 dark:text-zinc-200 block text-[10px] uppercase tracking-wider mb-0.5">
              Start here:
            </span>
            <span className="line-clamp-2">{repo.highlight}</span>
          </div>
        )}
      </div>

      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-zinc-800/60">
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-slate-800 dark:text-zinc-200 transition-colors"
        >
          <span>View on GitHub</span>
          <RiExternalLinkLine className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

function EngineeringBlogCard({
  blog,
  isSaved,
  onToggleSave,
}: {
  blog: EngineeringBlog;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] p-4.5 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xs transition-all">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-zinc-700">
              <img
                src={`https://www.google.com/s2/favicons?domain=${blog.logoDomain}&sz=128`}
                alt={blog.company}
                referrerPolicy="no-referrer"
                className="size-5 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">
                {blog.company}
              </h3>
              <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate">
                {blog.logoDomain}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleSave}
            title={isSaved ? "Remove bookmark" : "Bookmark blog"}
            className="text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors cursor-pointer shrink-0"
          >
            {isSaved ? <RiBookmarkFill className="size-4 text-slate-900 dark:text-zinc-100" /> : <RiBookmarkLine className="size-4" />}
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {blog.description}
        </p>

        {/* Must-read article preview */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800 text-xs">
          <span className="text-[10px] font-mono font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider block mb-0.5">
            Key Architecture Focus:
          </span>
          <div className="font-semibold text-slate-900 dark:text-zinc-100 line-clamp-1 text-xs">
            {blog.mustReadArticle.title}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
            {blog.mustReadArticle.topic}
          </p>
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-zinc-800/60">
        <a
          href={blog.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-slate-800 dark:text-zinc-200 transition-colors"
        >
          <span>Read Engineering Blog</span>
          <RiExternalLinkLine className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Guaranteed Working Book & Research Paper Cover Component           */
/* ------------------------------------------------------------------ */

function BookPaperThumbnail({ item }: { item: BookOrWhitepaper }) {
  const [hasError, setHasError] = useState(false);

  const fallbackUrl =
    item.fallbackImageUrl ||
    (item.type === "book"
      ? "/images/system-design/book-fallback.svg"
      : "/images/system-design/paper-fallback.svg");

  const imageSrc = !hasError && item.coverImageUrl ? item.coverImageUrl : fallbackUrl;

  return (
    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-zinc-800/80 group">
      {/* Background ambient subtle glow */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent z-10 pointer-events-none" />

      {/* Main image */}
      <img
        src={imageSrc}
        alt={item.title}
        referrerPolicy="no-referrer"
        loading="lazy"
        className={cx(
          "w-full h-full transition-transform duration-300 group-hover:scale-105",
          item.type === "book" ? "object-cover object-center" : "object-cover object-top"
        )}
        onError={() => {
          if (!hasError) setHasError(true);
        }}
      />

      {/* Top Left: Type Pill Badge */}
      <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
        <span
          className={cx(
            "px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-xs border",
            item.type === "book"
              ? "bg-amber-500/95 text-white border-amber-400/30"
              : "bg-blue-600/95 text-white border-blue-400/30"
          )}
        >
          {item.type === "book" ? "Book" : "Research Paper"}
        </span>
      </div>

      {/* Top Right: Publisher or Venue */}
      {(item.publisher || item.venue) && (
        <div className="absolute top-2.5 right-2.5 z-20">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-black/80 text-slate-200 backdrop-blur-md border border-white/15">
            {item.venue || item.publisher}
          </span>
        </div>
      )}

      {/* Bottom Right: Year Badge */}
      {item.publicationYear && (
        <div className="absolute bottom-2.5 right-2.5 z-20">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/85 text-white backdrop-blur-md border border-white/15">
            {item.publicationYear}
          </span>
        </div>
      )}
    </div>
  );
}

function BookCard({
  item,
  isSaved,
  onToggleSave,
}: {
  item: BookOrWhitepaper;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] p-4 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xs transition-all overflow-hidden">
      <div className="space-y-3">
        {/* Real Book Cover or Research Paper Preview */}
        <BookPaperThumbnail item={item} />

        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-accent-500 transition-colors">
              {item.title}
            </h3>

            <button
              type="button"
              onClick={onToggleSave}
              title={isSaved ? "Remove bookmark" : "Bookmark item"}
              className="text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors cursor-pointer shrink-0 mt-0.5"
            >
              {isSaved ? <RiBookmarkFill className="size-4 text-slate-900 dark:text-zinc-100" /> : <RiBookmarkLine className="size-4" />}
            </button>
          </div>

          <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate">
            by {item.author}
          </p>
        </div>

        <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
          {item.description}
        </p>

        {/* Key Takeaway box */}
        {item.keyTakeaway && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800 text-xs">
            <span className="text-[10px] font-mono font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider block mb-0.5">
              Key Takeaway:
            </span>
            <p className="text-[11px] text-slate-700 dark:text-zinc-300 italic leading-relaxed">
              &quot;{item.keyTakeaway}&quot;
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-zinc-800/60">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-linear-to-b from-accent-500 to-accent-600 text-white shadow-nav-selected hover:opacity-95 transition-opacity cursor-pointer"
        >
          <span>{item.type === "book" ? "View Book / Details" : "Read Research Paper"}</span>
          <RiExternalLinkLine className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

function CheatSheetCard({
  item,
  isSaved,
  onToggleSave,
}: {
  item: ArchitecturalCheatSheet;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] p-4.5 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xs transition-all">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-zinc-700">
              <RiFlashlightLine className="size-5 text-slate-800 dark:text-zinc-200" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">
                {item.title}
              </h3>
              <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                Core Architectural Concept
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleSave}
            title={isSaved ? "Remove bookmark" : "Bookmark concept"}
            className="text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors cursor-pointer shrink-0"
          >
            {isSaved ? <RiBookmarkFill className="size-4 text-slate-900 dark:text-zinc-100" /> : <RiBookmarkLine className="size-4" />}
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
          {item.summary}
        </p>

        {/* Bullet points */}
        <div className="space-y-1.5 pt-1">
          {item.keyPoints.map((pt, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-zinc-300 leading-normal">
              <RiCheckLine className="size-3.5 text-slate-900 dark:text-zinc-100 shrink-0 mt-0.5" />
              <span>{pt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
