"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  Building2,
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Loader2,
  Calendar,
  Send,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "sonner";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import InterviewExperienceDetailSkeleton from "@/components/interview-experience-detail-skeleton";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface CommentAuthor {
  id: string;
  name: string;
  avatarUrl?: string | null;
  isVerified?: boolean;
}

interface DiscussionCommentItem {
  id: string;
  content: string;
  author: CommentAuthor;
  createdAt: string;
  parentId?: string;
  likesCount: number;
  dislikesCount: number;
  replies: DiscussionCommentItem[];
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

/* ------------------------------------------------------------------ */
/* Utilities                                                          */
/* ------------------------------------------------------------------ */

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

const COMMENT_VOTES_STORAGE_KEY = "algoryn_comment_votes";

function getStoredCommentVotes(): Record<string, "upvote" | "downvote"> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(COMMENT_VOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStoredCommentVote(commentId: string, vote: "upvote" | "downvote" | null) {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredCommentVotes();
    if (vote) {
      existing[commentId] = vote;
    } else {
      delete existing[commentId];
    }
    localStorage.setItem(COMMENT_VOTES_STORAGE_KEY, JSON.stringify(existing));
  } catch {}
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
/* Markdown Viewer Component                                          */
/* ------------------------------------------------------------------ */

function formatInline(text: string) {
  if (!text) return null;

  // Tokenizer regex: matches `code`, $math$, ***bold italic***, **bold**, *italic*
  const regex = /(`[^`]+`|\$[^$]+\$|\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*[^*\n]+?\*)/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (!part) return null;

    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={idx} className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[12px] border border-border/50">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("$") && part.endsWith("$") && part.length >= 2) {
      return (
        <code key={idx} className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[12px] border border-blue-500/20 font-semibold">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("***") && part.endsWith("***") && part.length >= 6) {
      return (
        <strong key={idx} className="font-bold text-foreground italic">
          {part.slice(3, -3)}
        </strong>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={idx} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <span key={idx} className="font-semibold text-foreground italic">
          {part.slice(1, -1)}
        </span>
      );
    }

    // Clean any accidental stray asterisks from raw plain text so no stars show
    const cleaned = part.replace(/\*/g, "");
    return cleaned;
  });
}

function MarkdownViewer({ content, className = "" }: { content: string; className?: string }) {
  if (!content) return null;

  const lines = content.split("\n");
  const blocks: Array<{ type: string; content: string; lang?: string; num?: string; label?: string }> = [];
  let inCodeBlock = false;
  let codeLang = "";
  let codeBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        blocks.push({ type: "code", content: codeBuffer.join("\n"), lang: codeLang });
        inCodeBlock = false;
        codeBuffer = [];
        codeLang = "";
      } else {
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim();
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Horizontal divider
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      blocks.push({ type: "hr", content: "" });
      continue;
    }

    if (trimmed.startsWith("#### ")) {
      blocks.push({ type: "h4", content: trimmed.slice(5) });
    } else if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", content: trimmed.slice(4) });
    } else if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", content: trimmed.slice(3) });
    } else if (trimmed.startsWith("# ")) {
      blocks.push({ type: "h1", content: trimmed.slice(2) });
    } else if (trimmed.startsWith("> ")) {
      blocks.push({ type: "quote", content: trimmed.slice(2) });
    } else if (trimmed.startsWith("*") && trimmed.endsWith("*") && trimmed.length > 2 && !trimmed.slice(1, -1).includes("*")) {
      // Standalone takeaway or quote note (e.g. *Overall, I solved...*, *Got the selection mail...*)
      blocks.push({ type: "callout", content: trimmed.slice(1, -1).trim() });
    } else if (/^(Company|Role|Batch\s*\/\s*Year|Interview Type|Verdict|Package Band|Duration|Platform|Total Questions|Format|Result|Task|Follow-up):\s*(.+)$/i.test(trimmed)) {
      // Clean Key-Value row without any bullet dots
      const m = trimmed.match(/^([^:]+):\s*(.+)$/);
      if (m) {
        blocks.push({ type: "kv", label: m[1].trim(), content: m[2].trim() });
      } else {
        blocks.push({ type: "p", content: trimmed });
      }
    } else if (/^(DSA Question \d+|Question \d+|Database Question|Core CS Fundamentals|System Design Discussion)/i.test(trimmed)) {
      // Question or Section header (clean left accent, no circle dots)
      blocks.push({ type: "question_title", content: trimmed });
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
      // Clean bullet (clean subtle dash, no giant bright circle dots)
      blocks.push({ type: "bullet", content: trimmed.slice(2).trim() });
    } else if (/^(\d+)\.\s*(.*)$/.test(trimmed)) {
      // Clean numbered item (shows actual number badge, NO orange dots)
      const m = trimmed.match(/^(\d+)\.\s*(.*)$/);
      blocks.push({ type: "numbered", num: m ? m[1] : "", content: m ? m[2] : trimmed });
    } else if (trimmed.length > 0) {
      const stripped = trimmed.replace(/^#+\s*/, "");
      if (trimmed.startsWith("###") || trimmed.startsWith("##") || trimmed.startsWith("#")) {
        blocks.push({ type: "h3", content: stripped });
      } else if (
        trimmed === "Summary" ||
        trimmed === "Questions Asked in OA (4 Questions)" ||
        trimmed === "Questions Asked in the Interview" ||
        trimmed === "Preparation Strategy & Tips" ||
        trimmed === "Operating Systems (OS):" ||
        trimmed === "DBMS:" ||
        trimmed === "OOP Principles:" ||
        trimmed === "Solution Provided:" ||
        trimmed === "Approach:"
      ) {
        blocks.push({ type: "h3", content: trimmed });
      } else {
        blocks.push({ type: "p", content: trimmed });
      }
    }
  }

  if (inCodeBlock && codeBuffer.length > 0) {
    blocks.push({ type: "code", content: codeBuffer.join("\n"), lang: codeLang });
  }

  return (
    <div className={`space-y-3.5 ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === "hr") {
          return <hr key={idx} className="my-6 border-t border-border/60" />;
        }
        if (block.type === "h1") {
          return (
            <h2 key={idx} className="text-xl sm:text-2xl font-bold text-foreground mt-6 mb-2 pb-1 border-b border-border/40">
              {formatInline(block.content)}
            </h2>
          );
        }
        if (block.type === "h2") {
          return (
            <h3 key={idx} className="text-lg sm:text-xl font-bold text-foreground mt-5 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-blue-600 shrink-0" />
              <span>{formatInline(block.content)}</span>
            </h3>
          );
        }
        if (block.type === "h3") {
          return (
            <h4 key={idx} className="text-sm sm:text-base font-bold text-foreground mt-4 mb-1 text-blue-600 dark:text-blue-400">
              {formatInline(block.content)}
            </h4>
          );
        }
        if (block.type === "h4") {
          return (
            <h5 key={idx} className="text-xs sm:text-sm font-bold text-foreground mt-3 mb-1">
              {formatInline(block.content)}
            </h5>
          );
        }
        if (block.type === "question_title") {
          return (
            <div key={idx} className="mt-5 mb-2 font-bold text-sm sm:text-base text-foreground border-l-2 border-blue-600 pl-3 py-0.5">
              {formatInline(block.content)}
            </div>
          );
        }
        if (block.type === "kv") {
          return (
            <div key={idx} className="flex items-baseline gap-2 py-0.5 text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-foreground shrink-0">{block.label}:</span>
              <span className="text-foreground/90">{formatInline(block.content)}</span>
            </div>
          );
        }
        if (block.type === "callout") {
          const isSuccess = block.content.toLowerCase().includes("selection") || block.content.toLowerCase().includes("offer");
          return (
            <div
              key={idx}
              className={`my-3 p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                isSuccess
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-medium"
                  : "bg-blue-500/5 border-blue-500/20 text-foreground/90 italic"
              }`}
            >
              {formatInline(block.content)}
            </div>
          );
        }
        if (block.type === "code") {
          return (
            <div key={idx} className="my-3 rounded-xl overflow-hidden border border-border/70 bg-zinc-950 dark:bg-black">
              {block.lang && (
                <div className="bg-zinc-900/80 px-3 py-1 text-[11px] font-mono text-zinc-400 border-b border-border/40">
                  {block.lang}
                </div>
              )}
              <pre className="p-3.5 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
                <code>{block.content}</code>
              </pre>
            </div>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote key={idx} className="border-l-2 border-blue-500 pl-3.5 my-2 italic text-muted-foreground bg-blue-500/5 py-2 rounded-r-lg text-xs sm:text-sm">
              {formatInline(block.content)}
            </blockquote>
          );
        }
        if (block.type === "bullet") {
          return (
            <div key={idx} className="flex items-start gap-2 ml-1 my-1 text-foreground/90 leading-relaxed text-xs sm:text-sm">
              <span className="text-muted-foreground select-none font-bold shrink-0">–</span>
              <div className="flex-1 min-w-0">{formatInline(block.content)}</div>
            </div>
          );
        }
        if (block.type === "numbered") {
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-1 my-1.5 text-foreground/90 leading-relaxed text-xs sm:text-sm">
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-muted text-foreground border border-border/50 shrink-0 select-none">
                {block.num}.
              </span>
              <div className="flex-1 min-w-0">{formatInline(block.content)}</div>
            </div>
          );
        }
        return (
          <p key={idx} className="leading-relaxed text-foreground/90 text-xs sm:text-sm">
            {formatInline(block.content)}
          </p>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Threaded Comment Item                                               */
/* ------------------------------------------------------------------ */

function ThreadedCommentRow({
  comment,
  depth = 0,
  userVotes,
  onVote,
  replyingToId,
  onStartReply,
  onCancelReply,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  isSubmittingReply,
}: {
  comment: DiscussionCommentItem;
  depth?: number;
  userVotes?: Record<string, "upvote" | "downvote">;
  onVote: (id: string, action: "upvote" | "downvote") => void;
  replyingToId: string | null;
  onStartReply: (id: string, name?: string) => void;
  onCancelReply: () => void;
  replyText: string;
  onReplyTextChange: (val: string) => void;
  onSubmitReply: (id: string) => void;
  isSubmittingReply: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const isReplying = replyingToId === comment.id;
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="space-y-2.5">
      <div className="flex items-start gap-2.5 group">
        <div className="size-7 sm:size-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
          {comment.author?.avatarUrl ? (
            <img src={comment.author.avatarUrl} alt="" className="size-full rounded-full object-cover" />
          ) : (
            comment.author?.name?.[0]?.toUpperCase() || "C"
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-foreground">{comment.author?.name || "Candidate"}</span>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-muted-foreground">{formatRelativeTime(comment.createdAt)}</span>
          </div>

          <div className="text-xs sm:text-sm text-foreground/90 bg-muted/30 border border-border/50 rounded-xl p-2.5">
            <MarkdownViewer content={comment.content} />
          </div>

          {/* Comment action bar */}
          <div className="flex items-center gap-3 pt-0.5 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => onVote(comment.id, "upvote")}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                userVotes?.[comment.id] === "upvote"
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "hover:text-blue-600"
              }`}
              title={userVotes?.[comment.id] === "upvote" ? "Undo Like" : "Like"}
            >
              <ThumbsUp
                className={`size-3.5 transition-transform active:scale-125 ${
                  userVotes?.[comment.id] === "upvote" ? "fill-blue-600 dark:fill-blue-400 text-blue-600 dark:text-blue-400" : ""
                }`}
              />
              <span>{comment.likesCount}</span>
            </button>

            <button
              type="button"
              onClick={() => onVote(comment.id, "downvote")}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                userVotes?.[comment.id] === "downvote"
                  ? "text-red-500 dark:text-red-400 font-semibold"
                  : "hover:text-foreground"
              }`}
              title={userVotes?.[comment.id] === "downvote" ? "Undo Dislike" : "Dislike"}
            >
              <ThumbsDown
                className={`size-3.5 transition-transform active:scale-125 ${
                  userVotes?.[comment.id] === "downvote" ? "fill-red-500 dark:fill-red-400 text-red-500 dark:text-red-400" : ""
                }`}
              />
              <span>{comment.dislikesCount}</span>
            </button>

            <button
              type="button"
              onClick={() => onStartReply(comment.id, comment.author?.name)}
              className="font-medium hover:text-blue-600 transition-colors cursor-pointer text-xs"
            >
              Reply
            </button>

            {hasReplies && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-[11px] font-semibold text-foreground hover:text-blue-600 transition-colors cursor-pointer"
              >
                <span>Replies ({comment.replies.length})</span>
                {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inline reply box */}
      {isReplying && (
        <div className="ml-8 sm:ml-10 bg-muted/40 border border-border/70 rounded-xl p-2.5 space-y-2 animate-in fade-in zoom-in-95 duration-100">
          <input
            type="text"
            autoFocus
            placeholder={`Reply to ${comment.author?.name || "candidate"}...`}
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && replyText.trim() && !isSubmittingReply) {
                e.preventDefault();
                onSubmitReply(comment.id);
              }
            }}
            className="w-full bg-transparent px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-border/40">
            <button
              type="button"
              onClick={onCancelReply}
              className="text-xs text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-lg hover:bg-muted cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSubmitReply(comment.id)}
              disabled={isSubmittingReply || !replyText.trim()}
              className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full disabled:opacity-50 hover:bg-blue-700 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            >
              {isSubmittingReply ? <Loader2 className="size-3 animate-spin" /> : "Reply"}
            </button>
          </div>
        </div>
      )}

      {/* Nested Replies tree */}
      {hasReplies && expanded && (
        <div className="pl-4 sm:pl-6 ml-3 sm:ml-4 border-l-2 border-border/60 space-y-2.5 pt-1">
          {comment.replies.map((reply) => (
            <ThreadedCommentRow
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              userVotes={userVotes}
              onVote={onVote}
              replyingToId={replyingToId}
              onStartReply={onStartReply}
              onCancelReply={onCancelReply}
              replyText={replyText}
              onReplyTextChange={onReplyTextChange}
              onSubmitReply={onSubmitReply}
              isSubmittingReply={isSubmittingReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Detail Page Component                                         */
/* ------------------------------------------------------------------ */

export default function InterviewExperienceDetailPage() {
  const params = useParams();
  const postId = params?.id as string;
  const { user } = useAuth();
  const currentUserId = user?.uid;

  const [experience, setExperience] = useState<InterviewExperienceItem | null>(() => {
    if (typeof window !== "undefined" && postId) {
      try {
        const cached = sessionStorage.getItem(`algoryn_cached_exp_${postId}`);
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined" && postId) {
      try {
        const cached = sessionStorage.getItem(`algoryn_cached_exp_${postId}`);
        if (cached) return false;
      } catch {}
    }
    return true;
  });
  const [liked, setLiked] = useState(() => experience?.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(() => experience?.likesCount ?? 0);
  const [viewsCount, setViewsCount] = useState(() => experience?.viewsCount ?? 0);
  const [bookmarked, setBookmarked] = useState(() => experience?.isBookmarked ?? false);

  // Comments state
  const [comments, setComments] = useState<DiscussionCommentItem[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [userCommentVotes, setUserCommentVotes] = useState<Record<string, "upvote" | "downvote">>(() => getStoredCommentVotes());

  const containerRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const animateLike = contextSafe((target: Element | null) => {
    if (target) {
      gsap.fromTo(
        target,
        { scale: 1 },
        {
          scale: 1.35,
          duration: 0.12,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(target, { scale: 1, duration: 0.15, ease: "power2.out" });
          },
        }
      );
    }
  });

  // Fetch Experience Data
  useEffect(() => {
    if (!postId) return;

    const fetchDetail = async () => {
      try {
        if (!experience) {
          setLoading(true);
        }
        const res = await fetch(`/api/discussions/${postId}${currentUserId ? `?userId=${encodeURIComponent(currentUserId)}` : ""}`);
        const data = await res.json();
        if (data.success && data.post) {
          setExperience(data.post);
          setLiked(data.post.isLiked);
          setLikesCount(data.post.likesCount);
          setViewsCount(data.post.viewsCount || 0);
          setBookmarked(data.post.isBookmarked);
          try {
            sessionStorage.setItem(`algoryn_cached_exp_${postId}`, JSON.stringify(data.post));
          } catch {}
        } else if (!experience) {
          toast.error("Interview experience not found");
        }
      } catch (err) {
        console.error("Error loading interview experience:", err);
        if (!experience) {
          toast.error("Failed to load interview experience");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [postId, currentUserId]);

  // Record Unique View (+1 per person ID, zero on refresh)
  useEffect(() => {
    if (!postId || typeof window === "undefined") return;

    const viewerId = currentUserId || getOrCreateViewerId();
    const storageKey = `algoryn_viewed_${postId}_${viewerId}`;
    if (localStorage.getItem(storageKey)) {
      return;
    }

    let recorded = false;
    const recordView = async () => {
      if (recorded) return;
      recorded = true;
      try {
        localStorage.setItem(storageKey, "1");
        const res = await fetch(`/api/discussions/${postId}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId || null, viewerId }),
        });
        const data = await res.json();
        if (data.success && typeof data.viewsCount === "number") {
          setViewsCount(data.viewsCount);
        }
      } catch (err) {
        console.error("Error incrementing view:", err);
      }
    };

    recordView();
  }, [postId, currentUserId]);

  // Fetch Comments
  useEffect(() => {
    if (!postId) return;

    const loadComments = async () => {
      try {
        setCommentsLoading(true);
        const url = `/api/discussions/${postId}/comments${currentUserId ? `?userId=${encodeURIComponent(currentUserId)}` : ""}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && Array.isArray(data.comments)) {
          setComments(data.comments);
          if (data.userVotes && typeof data.userVotes === "object") {
            setUserCommentVotes((prev) => {
              const merged = { ...prev, ...data.userVotes };
              try {
                localStorage.setItem(COMMENT_VOTES_STORAGE_KEY, JSON.stringify(merged));
              } catch {}
              return merged;
            });
          }
        }
      } catch (err) {
        console.error("Error loading comments:", err);
      } finally {
        setCommentsLoading(false);
      }
    };

    loadComments();
  }, [postId, currentUserId]);

  // Handle Post Like
  const handleToggleLike = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    const nextLiked = !liked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setLiked(nextLiked);
    setLikesCount(nextCount);
    if (nextLiked && e?.currentTarget) {
      animateLike(e.currentTarget.querySelector("svg"));
    }

    try {
      const res = await fetch(`/api/discussions/${postId}/like`, {
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

  // Handle Bookmark
  const handleToggleBookmark = async () => {
    const nextBookmarked = !bookmarked;
    setBookmarked(nextBookmarked);
    try {
      await fetch(`/api/discussions/${postId}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      toast.success(nextBookmarked ? "Saved to bookmarks" : "Removed from bookmarks");
    } catch {
      setBookmarked(!nextBookmarked);
    }
  };

  // Handle Share
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Handle Add Comment
  const handleAddComment = async () => {
    if (!newCommentText.trim() || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);
      const res = await fetch(`/api/discussions/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newCommentText.trim(),
          userId: currentUserId || null,
          authorName: user?.displayName || "Coder",
          avatarUrl: user?.photoURL || null,
          authorHandle: user?.email ? `@${user.email.split("@")[0]}` : null,
        }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setNewCommentText("");
        toast.success("Comment posted!");
      }
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle Reply
  const handleAddReply = async (parentId: string) => {
    if (!replyText.trim() || isSubmittingReply) return;

    try {
      setIsSubmittingReply(true);
      const res = await fetch(`/api/discussions/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyText.trim(),
          parentId,
          userId: currentUserId || null,
          authorName: user?.displayName || "Coder",
          avatarUrl: user?.photoURL || null,
          authorHandle: user?.email ? `@${user.email.split("@")[0]}` : null,
        }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        const insertReply = (list: DiscussionCommentItem[]): DiscussionCommentItem[] => {
          return list.map((c) => {
            if (c.id === parentId) {
              return { ...c, replies: [...(c.replies || []), data.comment] };
            }
            if (c.replies?.length) {
              return { ...c, replies: insertReply(c.replies) };
            }
            return c;
          });
        };
        setComments((prev) => insertReply(prev));
        setReplyText("");
        setReplyingToId(null);
        toast.success("Reply posted!");
      }
    } catch {
      toast.error("Failed to post reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Handle Comment Vote
  const handleVoteComment = async (commentId: string, action: "upvote" | "downvote") => {
    const currentVote = userCommentVotes[commentId];
    let nextVote: "upvote" | "downvote" | null = action;
    let likesDelta = 0;
    let dislikesDelta = 0;

    if (currentVote === action) {
      nextVote = null;
      if (action === "upvote") likesDelta = -1;
      else dislikesDelta = -1;
    } else if (currentVote && currentVote !== action) {
      if (action === "upvote") {
        likesDelta = 1;
        dislikesDelta = -1;
      } else {
        dislikesDelta = 1;
        likesDelta = -1;
      }
    } else {
      if (action === "upvote") likesDelta = 1;
      else dislikesDelta = 1;
    }

    setStoredCommentVote(commentId, nextVote);
    setUserCommentVotes((prev) => {
      const copy = { ...prev };
      if (nextVote) copy[commentId] = nextVote;
      else delete copy[commentId];
      return copy;
    });

    const updateVotesInTree = (list: DiscussionCommentItem[]): DiscussionCommentItem[] => {
      return list.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            likesCount: Math.max(0, (c.likesCount || 0) + likesDelta),
            dislikesCount: Math.max(0, (c.dislikesCount || 0) + dislikesDelta),
          };
        }
        if (c.replies?.length) {
          return { ...c, replies: updateVotesInTree(c.replies) };
        }
        return c;
      });
    };
    setComments((prev) => updateVotesInTree(prev));

    try {
      const res = await fetch(`/api/discussions/${postId}/comments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId,
          action,
          userId: currentUserId || null,
          currentVote: currentVote || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.likesCount !== undefined && data.dislikesCount !== undefined) {
          const syncVotes = (list: DiscussionCommentItem[]): DiscussionCommentItem[] => {
            return list.map((c) => {
              if (c.id === commentId) {
                return { ...c, likesCount: data.likesCount, dislikesCount: data.dislikesCount };
              }
              if (c.replies?.length) {
                return { ...c, replies: syncVotes(c.replies) };
              }
              return c;
            });
          };
          setComments((prev) => syncVotes(prev));
        }
        if (data.userVote !== undefined) {
          setStoredCommentVote(commentId, data.userVote);
          setUserCommentVotes((prev) => {
            const copy = { ...prev };
            if (data.userVote) copy[commentId] = data.userVote;
            else delete copy[commentId];
            return copy;
          });
        }
      }
    } catch (err) {
      console.error("Error voting on comment:", err);
    }
  };

  if (loading && !experience) {
    return <InterviewExperienceDetailSkeleton />;
  }

  if (!experience) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4 text-center py-20">
        <h2 className="text-xl font-bold text-foreground">Interview Experience Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested debrief may have been removed or does not exist.</p>
        <Link
          href="/dashboard/interview-experiences"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
        >
          <ChevronLeft className="size-4" />
          <span>Back to All Experiences</span>
        </Link>
      </div>
    );
  }

  const verdictStyles: Record<string, string> = {
    Offer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    Accepted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    Rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    "In Progress": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  };

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto p-3.5 sm:p-6 space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Top Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/interview-experiences"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back<span className="hidden sm:inline"> to Interview Experiences</span></span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-lg border border-border/60 hover:bg-muted transition-colors cursor-pointer"
          >
            <Share2 className="size-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Experience Article Card */}
      <article className="bg-card border border-border/70 rounded-2xl p-4 sm:p-7 shadow-xs space-y-4 sm:space-y-5">
        {/* Meta badges row: Company + Round + Verdict */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Company Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold shadow-2xs">
            <Building2 className="size-3.5 shrink-0" />
            <span>{experience.company}</span>
          </div>

          {/* Round Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-semibold shadow-2xs">
            <Briefcase className="size-3.5 shrink-0" />
            <span>{experience.round}</span>
          </div>

          {/* Verdict Badge */}
          {experience.verdict && (
            <div
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                verdictStyles[experience.verdict] || "bg-muted text-muted-foreground border-border/50"
              }`}
            >
              {experience.verdict === "Offer" || experience.verdict === "Accepted" ? (
                <CheckCircle2 className="size-3.5" />
              ) : experience.verdict === "Rejected" ? (
                <XCircle className="size-3.5" />
              ) : (
                <Clock className="size-3.5" />
              )}
              <span>{experience.verdict}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight leading-snug">
          {experience.title}
        </h1>

        {/* Candidate Info Bar */}
        <div className="flex items-center justify-between gap-3 pt-2 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {experience.avatarUrl ? (
                <img src={experience.avatarUrl} alt="" className="size-full rounded-full object-cover" />
              ) : (
                experience.authorName?.[0]?.toUpperCase() || "C"
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm text-foreground">{experience.authorName}</span>
                <span className="text-[11px] text-muted-foreground font-mono">{experience.authorHandle}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{experience.authorRole}</p>
            </div>
          </div>

          <div className="text-right text-[11px] text-muted-foreground flex items-center gap-1">
            <Calendar className="size-3" />
            <span>{formatRelativeTime(experience.createdAt)}</span>
          </div>
        </div>

        {/* Debrief Content (Rich Markdown) */}
        <div className="pt-2 leading-relaxed">
          <MarkdownViewer content={experience.content} className="text-sm sm:text-base" />
        </div>

        {/* Photos / Attachments */}
        {experience.imageUrls && experience.imageUrls.length > 0 && (
          <div className="pt-4 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attachments</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {experience.imageUrls.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl overflow-hidden border border-border/70 group relative block"
                >
                  <img src={url} alt={`Attachment ${idx + 1}`} className="w-full h-48 object-cover group-hover:scale-102 transition-transform duration-200" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1">
                    <ExternalLink className="size-3.5" />
                    <span>View Full Size</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {experience.tags && experience.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-4">
            {experience.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-md bg-muted/60 text-muted-foreground border border-border/40 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Actions Row: Like, Comments, Analytics View Count, Bookmark, Share */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50 text-muted-foreground">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Like */}
            <button
              type="button"
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer group ${
                liked ? "text-[#f91880] font-semibold" : "hover:text-[#f91880]"
              }`}
              title="Like Experience"
            >
              <Heart className={`size-4 transition-transform active:scale-125 ${liked ? "fill-current" : ""}`} />
              <span>{formatNumber(likesCount)}</span>
            </button>

            {/* Comment count */}
            <div className="flex items-center gap-1.5 text-xs">
              <MessageCircle className="size-4" />
              <span>{formatNumber(comments.length)}</span>
            </div>

            {/* Analytics / Views (Image 2 Style) */}
            <div
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#1d9bf0] cursor-default transition-colors"
              title={`${viewsCount} Views`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
                <g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g>
              </svg>
              <span>{formatNumber(viewsCount)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Bookmark */}
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer ${
                bookmarked ? "text-blue-600" : "hover:text-foreground"
              }`}
              title="Bookmark Experience"
            >
              <Bookmark className={`size-4 ${bookmarked ? "fill-current" : ""}`} />
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 className="size-4" />
            </button>
          </div>
        </div>
      </article>

      {/* Discussion / Comments Section */}
      <section className="bg-card border border-border/70 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm sm:text-base text-foreground">Discussion &amp; Advice</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {comments.length}
            </span>
          </div>
        </div>

        {/* Comment input form */}
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="size-full rounded-full object-cover" />
            ) : (
              user?.displayName?.[0]?.toUpperCase() || "Y"
            )}
          </div>

          <div className="flex-1 bg-muted/40 border border-border/70 rounded-2xl p-3 focus-within:border-blue-500/50 transition-all space-y-2.5">
            <textarea
              placeholder="Ask a question about this interview round or share your advice..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              rows={2}
              className="w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none leading-relaxed"
            />
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/30">
              <button
                type="button"
                onClick={handleAddComment}
                disabled={isSubmittingComment || !newCommentText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              >
                {isSubmittingComment ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-3" />
                    <span>Comment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Comments tree */}
        {commentsLoading ? (
          <div className="py-6 flex justify-center text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No questions or comments yet. Be the first to ask about this interview!
          </p>
        ) : (
          <div className="space-y-4 pt-2">
            {comments.map((rootComment) => (
              <ThreadedCommentRow
                key={rootComment.id}
                comment={rootComment}
                userVotes={userCommentVotes}
                onVote={handleVoteComment}
                replyingToId={replyingToId}
                onStartReply={(id, name) => {
                  setReplyingToId(id);
                  setReplyText(name ? `@${name.trim()} ` : "");
                }}
                onCancelReply={() => {
                  setReplyingToId(null);
                  setReplyText("");
                }}
                replyText={replyText}
                onReplyTextChange={setReplyText}
                onSubmitReply={handleAddReply}
                isSubmittingReply={isSubmittingReply}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
