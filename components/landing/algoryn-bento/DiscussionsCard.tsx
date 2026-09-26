"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Eye,
  Bookmark,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface DiscussionThread {
  id: string;
  authorName: string;
  authorInitials: string;
  authorRole: string;
  avatarGradient: string;
  avatarBorder: string;
  title: string;
  snippet: string;
  category: string;
  categoryBadge: string;
  likes: number;
  comments: number;
  views: number;
  timeAgo: string;
}

const DISCUSSIONS: DiscussionThread[] = [
  {
    id: "disc-1",
    authorName: "Ritesh M.",
    authorInitials: "R",
    authorRole: "Google SDE",
    avatarGradient: "from-blue-500 to-indigo-600",
    avatarBorder: "ring-blue-500/40",
    title: "Google L4 Interview Prep Strategy & Topic Breakdown",
    snippet:
      "Focus heavily on DP with bitmasking, graph shortest paths, and concurrency trade-offs during live coding.",
    category: "Interview Q&A",
    categoryBadge: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    likes: 48,
    comments: 16,
    views: 380,
    timeAgo: "2h ago",
  },
  {
    id: "disc-2",
    authorName: "Maya S.",
    authorInitials: "M",
    authorRole: "Amazon SDE-2",
    avatarGradient: "from-amber-500 to-orange-600",
    avatarBorder: "ring-amber-500/40",
    title: "System Design: Distributed Cache & Redis Invalidation",
    snippet:
      "When designing for high write-throughput, write-through vs cache-aside makes all the difference in consistency.",
    category: "System Design",
    categoryBadge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    likes: 74,
    comments: 29,
    views: 620,
    timeAgo: "4h ago",
  },
  {
    id: "disc-3",
    authorName: "Rohit K.",
    authorInitials: "R",
    authorRole: "Meta E4",
    avatarGradient: "from-emerald-500 to-teal-600",
    avatarBorder: "ring-emerald-500/40",
    title: "Mastering Monotonic Stack & Sliding Window Patterns",
    snippet:
      "Recognizing the 'next greater element' pattern immediately simplifies 40+ medium/hard problems on LeetCode.",
    category: "DSA Tips",
    categoryBadge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    likes: 92,
    comments: 38,
    views: 890,
    timeAgo: "1d ago",
  },
];

export function DiscussionsCard() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % DISCUSSIONS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const thread = DISCUSSIONS[activeIdx];

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 select-none overflow-hidden">
      {/* ── Top Bar: Community Header with Trending Tag ── */}
      <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="size-3 text-pink-500" />
          <p className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
            Community Discussions
          </p>
        </div>
        <span className="text-[8px] font-mono font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
          Live Forum
        </span>
      </div>

      {/* ── Animated Discussion Thread Card ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={thread.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="rounded-2xl border border-border/70 bg-card/95 dark:bg-neutral-950/80 p-2.5 sm:p-3 shadow-xs space-y-1.5 sm:space-y-2 my-auto"
        >
          {/* Author Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Cartoon / Stylized Avatar with Initial */}
              <div
                className={`size-6.5 sm:size-7 rounded-full bg-gradient-to-tr ${thread.avatarGradient} text-white font-bold flex items-center justify-center text-xs shrink-0 ring-2 ${thread.avatarBorder} shadow-xs`}
              >
                <span>{thread.authorInitials}</span>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10.5px] sm:text-[11px] font-bold text-foreground truncate">
                    {thread.authorName}
                  </span>
                  <span className="text-[8.5px] sm:text-[9px] text-muted-foreground font-mono truncate">
                    • {thread.authorRole}
                  </span>
                </div>
                <span className="text-[7.5px] sm:text-[8px] text-muted-foreground/70 font-mono">
                  {thread.timeAgo}
                </span>
              </div>
            </div>

            {/* Category Pill */}
            <span
              className={`text-[7.5px] sm:text-[8px] font-mono font-semibold px-2 py-0.5 rounded-md border shrink-0 ${thread.categoryBadge}`}
            >
              {thread.category}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-xs font-bold text-foreground leading-snug line-clamp-1">
            {thread.title}
          </h4>

          {/* Snippet */}
          <p className="text-[9px] sm:text-[9.5px] text-muted-foreground line-clamp-2 leading-relaxed">
            {thread.snippet}
          </p>

          {/* Engagement Metrics Tray */}
          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[9px] font-mono text-muted-foreground">
            <div className="flex items-center gap-3">
              {/* Likes */}
              <span className="flex items-center gap-1 text-pink-600 dark:text-pink-400 font-semibold">
                <Heart className="size-3 fill-pink-500/20 text-pink-500" />
                <span>{thread.likes}</span>
              </span>

              {/* Comments */}
              <span className="flex items-center gap-1 hover:text-foreground transition-colors">
                <MessageCircle className="size-3 text-blue-500" />
                <span>{thread.comments}</span>
              </span>

              {/* Views */}
              <span className="flex items-center gap-1">
                <Eye className="size-3" />
                <span>{thread.views}</span>
              </span>
            </div>

            <div className="flex items-center gap-1 text-[8px] text-primary hover:underline cursor-pointer">
              <span>View Thread →</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom Carousel Progress Dots ── */}
      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[8px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1 text-muted-foreground/80">
          <Sparkles className="size-2.5 text-amber-500" />
          <span>Active developer threads</span>
        </span>

        <div className="flex items-center gap-1">
          {DISCUSSIONS.map((_, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className="rounded-full bg-foreground/25 cursor-pointer"
              animate={{
                width: i === activeIdx ? 12 : 4,
                opacity: i === activeIdx ? 0.8 : 0.25,
              }}
              style={{ height: 3 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiscussionsCard;
