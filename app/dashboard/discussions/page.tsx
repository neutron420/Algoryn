"use client";

import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Heart,
  MessageCircle,
  Eye,
  Bookmark,
  ImageIcon,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
  Trash2,
  Loader2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Code2,
  List,
  ListOrdered,
  Quote,
  Link2,
  Heading1,
  Heading2,
  Edit3,
  Copy,
  Check,
  MoreHorizontal,
  Pencil,
  Flag,
  Flame,
  Plus,
  Search,
} from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface DiscussionCommentItem {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    isVerified?: boolean;
  };
  createdAt: string;
  parentId?: string;
  likesCount: number;
  dislikesCount: number;
  replies: DiscussionCommentItem[];
}

interface DiscussionPostItem {
  id: string;
  userId?: string | null;
  authorName: string;
  authorHandle: string;
  authorRole: string;
  authorEmail?: string | null;
  avatarUrl?: string | null;
  title?: string | null;
  content: string;
  imageUrl?: string | null;
  imageUrls?: string[];
  category: string;
  tags: string[];
  viewsCount: number;
  likesCount: number;
  bookmarksCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface TrendingPostItem {
  id: string;
  title: string;
  likes: number;
  comments: number;
  views: number;
  category: string;
}

interface ContributorItem {
  name: string;
  handle: string;
  role: string;
  avatar?: string | null;
  postCount: number;
}

interface CategoryItem {
  id: string;
  name: string;
  mobileLabel?: string;
  variant: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger" | "danger-soft";
  activeClass: string;
  inactiveClass: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
  {
    id: "All posts",
    name: "All posts",
    mobileLabel: "All Posts",
    variant: "primary",
    activeClass: "bg-blue-600 text-white shadow-sm shadow-blue-500/25 border-blue-600 font-semibold ring-1 ring-blue-500/40",
    inactiveClass: "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70",
  },
  {
    id: "Discussion",
    name: "Discussion",
    mobileLabel: "Discussion",
    variant: "secondary",
    activeClass: "bg-purple-600 text-white shadow-sm shadow-purple-500/25 border-purple-600 font-semibold ring-1 ring-purple-500/40",
    inactiveClass: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30",
  },
  {
    id: "Study Guide",
    name: "Study Guide",
    mobileLabel: "Study Guide",
    variant: "tertiary",
    activeClass: "bg-emerald-600 text-white shadow-sm shadow-emerald-500/25 border-emerald-600 font-semibold ring-1 ring-emerald-500/40",
    inactiveClass: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
  },
  {
    id: "Events",
    name: "Events",
    mobileLabel: "Events",
    variant: "danger-soft",
    activeClass: "bg-rose-600 text-white shadow-sm shadow-rose-500/25 border-rose-600 font-semibold ring-1 ring-rose-500/40",
    inactiveClass: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30",
  },
  {
    id: "System Design",
    name: "System Design",
    mobileLabel: "System Design",
    variant: "outline",
    activeClass: "bg-cyan-600 text-white shadow-sm shadow-cyan-500/25 border-cyan-600 font-semibold ring-1 ring-cyan-500/40",
    inactiveClass: "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30",
  },
  {
    id: "DSA Tips",
    name: "DSA Tips",
    mobileLabel: "DSA Tips",
    variant: "tertiary",
    activeClass: "bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-500/25 border-fuchsia-600 font-semibold ring-1 ring-fuchsia-500/40",
    inactiveClass: "bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/30",
  },
  {
    id: "Career",
    name: "Career",
    mobileLabel: "Career",
    variant: "secondary",
    activeClass: "bg-teal-600 text-white shadow-sm shadow-teal-500/25 border-teal-600 font-semibold ring-1 ring-teal-500/40",
    inactiveClass: "bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30",
  },
  {
    id: "Showcase",
    name: "Showcase",
    mobileLabel: "Showcase",
    variant: "ghost",
    activeClass: "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 border-indigo-600 font-semibold ring-1 ring-indigo-500/40",
    inactiveClass: "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30",
  },
];

function getPostImages(post: { imageUrl?: string | null; imageUrls?: string[] }): string[] {
  if (Array.isArray(post.imageUrls) && post.imageUrls.length > 0) {
    return post.imageUrls;
  }
  if (!post.imageUrl) return [];
  const trimmed = post.imageUrl.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const arr = JSON.parse(trimmed);
      if (Array.isArray(arr)) {
        return arr.filter((u: unknown): u is string => typeof u === "string" && u.trim().length > 0);
      }
    } catch {
      // fallback
    }
  }
  if (trimmed.includes(",")) {
    return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [trimmed];
}


function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return String(num || 0);
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

function formatRelativeTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)}d ago`;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

// Avatar component (real image with graceful initial fallback)
function UserAvatar({
  src,
  name,
  size = 40,
  className = "",
}: {
  src?: string | null;
  name?: string;
  size?: number;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const initial = name ? name.trim()[0]?.toUpperCase() : "U";

  if (src && !imgError) {
    return (
      <div
        className={`relative overflow-hidden shrink-0 rounded-full border border-border/50 bg-muted ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={name || "Avatar"}
          width={size}
          height={size}
          className="size-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center font-bold text-white shadow-2xs border border-border/40 ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(10, Math.floor(size * 0.38)),
        background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
      }}
    >
      {initial}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Markdown Formatter & Renderer Component                            */
/* ------------------------------------------------------------------ */

function CodeBlockViewer({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 rounded-xl border border-border/80 bg-muted/60 dark:bg-zinc-950/80 overflow-hidden font-mono text-xs shadow-2xs">
      <div className="bg-muted/90 dark:bg-zinc-900/90 px-3.5 py-1.5 flex items-center justify-between border-b border-border/50">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-muted"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="size-3 text-green-500" />
              <span className="text-green-500 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-foreground/90 leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MarkdownViewer({ content, className = "" }: { content: string; className?: string }) {
  if (!content) return null;

  // Split into code blocks vs regular text
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`space-y-2 text-sm leading-relaxed text-foreground/90 ${className}`}>
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const lines = part.slice(3, -3).trim().split("\n");
          const firstLine = lines[0]?.trim();
          const hasLang = firstLine && /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : "";
          const code = hasLang ? lines.slice(1).join("\n") : lines.join("\n");

          return <CodeBlockViewer key={index} code={code} lang={lang} />;
        }

        const lines = part.split("\n");
        return (
          <React.Fragment key={index}>
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={lineIdx} className="h-1.5" />;
              }

              // Headers
              if (trimmed.startsWith("### ")) {
                return <h4 key={lineIdx} className="font-bold text-sm text-foreground pt-1">{renderInlineMarkdown(trimmed.slice(4))}</h4>;
              }
              if (trimmed.startsWith("## ")) {
                return <h3 key={lineIdx} className="font-bold text-base text-foreground pt-1.5">{renderInlineMarkdown(trimmed.slice(3))}</h3>;
              }
              if (trimmed.startsWith("# ")) {
                return <h2 key={lineIdx} className="font-bold text-lg text-foreground pt-2">{renderInlineMarkdown(trimmed.slice(2))}</h2>;
              }

              // Blockquotes
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote key={lineIdx} className="border-l-2 border-blue-500 bg-blue-500/5 px-3 py-1 italic text-muted-foreground rounded-r-lg my-1">
                    {renderInlineMarkdown(trimmed.slice(2))}
                  </blockquote>
                );
              }

              // Bullet lists
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <li key={lineIdx} className="list-disc list-inside text-foreground/90 pl-1">
                    {renderInlineMarkdown(trimmed.slice(2))}
                  </li>
                );
              }

              // Numbered list
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <li key={lineIdx} className="list-decimal list-inside text-foreground/90 pl-1">
                    {renderInlineMarkdown(numMatch[2])}
                  </li>
                );
              }

              return (
                <p key={lineIdx} className="leading-relaxed">
                  {renderInlineMarkdown(line)}
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ExpandablePostContent({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isLikelyLong = content.length > 220 || content.includes("\n\n") || content.includes("```");

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const hasOverflow = el.scrollHeight > el.clientHeight + 4;
      setCanExpand(hasOverflow);
    }
  }, [content, isExpanded]);

  const showToggle = canExpand || isLikelyLong;

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={!isExpanded ? "line-clamp-3 overflow-hidden" : ""}
      >
        <MarkdownViewer content={content} />
      </div>

      {!isExpanded && showToggle && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors cursor-pointer mt-0.5 inline-flex items-center gap-0.5"
        >
          <span>see more</span>
        </button>
      )}

      {isExpanded && showToggle && (
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground hover:underline transition-colors cursor-pointer mt-1.5 block"
        >
          <span>see less</span>
        </button>
      )}
    </div>
  );
}

function parseTagsInput(input: string): string[] {
  if (!input || !input.trim()) return [];
  const rawParts = input.includes(",")
    ? input.split(",")
    : input.trim().split(/\s+/);

  return rawParts
    .flatMap((part) => part.trim().split(/\s+/))
    .map((tag) => tag.trim().replace(/^#+/, ""))
    .filter((tag) => tag.length > 0);
}

function cleanTrendingTitle(titleOrContent: string): string {
  if (!titleOrContent) return "Community Discussion";
  const firstLine = titleOrContent.split(/\r?\n/)[0].trim();
  const clean = firstLine
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^#+\s*/g, "")
    .replace(/^>\s*/g, "")
    .replace(/^[-*+]\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[*_~`#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length > 60) {
    return clean.slice(0, 60) + "...";
  }
  return clean || "Community Discussion";
}

function renderInlineMarkdown(text: string): React.ReactNode {
  // Regex matches **bold**, ~~strikethrough~~, <u>underline</u>, *italic*, `inline code`, [link](url), and @mentions (including full names like @First Last)
  const regex = /(\*\*.*?\*\*|~~.*?~~|<u>.*?<\/u>|\*.*?\*|`.*?`|\[.*?\]\(.*?\)|\B@[A-Z][a-zA-Z0-9_.-]*(?:\s+[A-Z][a-zA-Z0-9_.-]*)+|\B@[a-zA-Z0-9_.-]+)/g;
  const tokens = text.split(regex);

  return tokens.map((token, i) => {
    if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
      return <strong key={i} className="font-bold text-foreground">{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("~~") && token.endsWith("~~") && token.length >= 4) {
      return <del key={i} className="line-through text-muted-foreground/80">{token.slice(2, -2)}</del>;
    }
    if (token.startsWith("<u>") && token.endsWith("</u>") && token.length >= 7) {
      return <u key={i} className="underline underline-offset-2">{token.slice(3, -4)}</u>;
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
      return <em key={i} className="italic text-foreground/90">{token.slice(1, -1)}</em>;
    }
    if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-muted/80 text-blue-600 dark:text-blue-400 font-mono text-xs border border-border/40 font-semibold">
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith("@") && token.length >= 2) {
      return (
        <span
          key={i}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold bg-blue-500/10 hover:bg-blue-500/20 px-1.5 py-0.5 rounded-md text-xs transition-colors mx-0.5 select-all"
        >
          {token}
        </span>
      );
    }
    const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-0.5">
          {linkMatch[1]}
        </a>
      );
    }
    return token;
  });
}

function htmlToMarkdown(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined") return html;

  const div = document.createElement("div");
  div.innerHTML = html;

  function traverse(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const children = Array.from(el.childNodes).map(traverse).join("");

    switch (tag) {
      case "b":
      case "strong":
        return children.trim() ? `**${children.trim()}**` : "";
      case "i":
      case "em":
        return children.trim() ? `*${children.trim()}*` : "";
      case "u":
        return children.trim() ? `<u>${children.trim()}</u>` : "";
      case "s":
      case "strike":
      case "del":
        return children.trim() ? `~~${children.trim()}~~` : "";
      case "h1":
        return `\n# ${children.trim()}\n`;
      case "h2":
        return `\n## ${children.trim()}\n`;
      case "h3":
        return `\n### ${children.trim()}\n`;
      case "blockquote":
        return `\n> ${children.trim()}\n`;
      case "ul":
        return `\n${children.trim()}\n`;
      case "ol":
        return `\n${children.trim()}\n`;
      case "li":
        return `- ${children.trim()}\n`;
      case "code":
        if (el.parentElement?.tagName.toLowerCase() === "pre") {
          return children;
        }
        return `\`${children.trim()}\``;
      case "pre":
        return `\n\`\`\`ts\n${children.trim()}\n\`\`\`\n`;
      case "a": {
        const href = el.getAttribute("href") || "#";
        return `[${children.trim()}](${href})`;
      }
      case "br":
        return "\n";
      case "div":
      case "p":
        return children ? `\n${children}` : "";
      default:
        return children;
    }
  }

  const result = Array.from(div.childNodes).map(traverse).join("").trim();
  return result.replace(/\n{3,}/g, "\n\n");
}

/* ------------------------------------------------------------------ */
/* Dynamic Sidebar Widgets Component (Used in Desktop & Mobile Drawer) */
/* ------------------------------------------------------------------ */

function DiscussionsSidebarWidgets({
  tagPages,
  tagsPageIndex,
  setTagsPageIndex,
  currentTagsList,
  selectedTag,
  setSelectedTag,
  trendingPosts,
  setActiveTab,
  contributors,
  sidebarLoading,
  onItemClick,
}: {
  tagPages: string[][];
  tagsPageIndex: number;
  setTagsPageIndex: React.Dispatch<React.SetStateAction<number>>;
  currentTagsList: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  trendingPosts: TrendingPostItem[];
  setActiveTab: (tab: string) => void;
  contributors: ContributorItem[];
  sidebarLoading: boolean;
  onItemClick?: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Widget 1: Filter By Tags */}
      <div className="bg-card border border-border/70 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Filter By Tags</h3>
          {tagPages.length > 1 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => setTagsPageIndex((p) => Math.max(0, p - 1))}
                disabled={tagsPageIndex === 0}
                className="p-1 hover:text-foreground disabled:opacity-30 rounded cursor-pointer"
                aria-label="Previous Tags Page"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <span className="font-mono text-[11px]">
                {tagsPageIndex + 1}/{tagPages.length}
              </span>
              <button
                type="button"
                onClick={() => setTagsPageIndex((p) => Math.min(tagPages.length - 1, p + 1))}
                disabled={tagsPageIndex === tagPages.length - 1}
                className="p-1 hover:text-foreground disabled:opacity-30 rounded cursor-pointer"
                aria-label="Next Tags Page"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Tag pills from Database */}
        {sidebarLoading ? (
          <div className="flex flex-wrap gap-2 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-7 w-16 bg-muted rounded-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {currentTagsList.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSelectedTag(isSelected ? null : tag);
                    onItemClick?.();
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-muted/70 hover:bg-muted text-foreground/85 border border-border/40"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Widget 2: Trending This Week (Dynamic Database Posts) */}
      <div className="bg-card border border-border/70 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame className="size-4 text-amber-500 fill-amber-500/20" />
            <h3 className="font-semibold text-sm text-foreground">Trending This Week</h3>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground/80 uppercase tracking-wider">Top Discussions</span>
        </div>

        {sidebarLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-4 bg-muted rounded w-4/5" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : trendingPosts.length === 0 ? (
          <p className="text-xs text-muted-foreground">No trending posts yet.</p>
        ) : (
          <div className="space-y-2">
            {trendingPosts.map((item, idx) => {
              const rankColors = [
                "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
                "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
                "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
              ];
              const rankBadgeClass = rankColors[idx] || "bg-muted text-muted-foreground border-border/50";

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onItemClick?.();
                    const el = document.getElementById(item.id);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    } else {
                      setActiveTab(item.category);
                      setTimeout(() => {
                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }
                  }}
                  className="group p-2.5 -mx-1 rounded-xl hover:bg-muted/60 transition-all duration-200 cursor-pointer border border-transparent hover:border-border/60"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`size-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 border mt-0.5 ${rankBadgeClass}`}
                    >
                      {idx + 1}
                    </span>

                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="text-xs font-semibold text-foreground/90 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        {cleanTrendingTitle(item.title)}
                      </h4>

                      <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
                        {item.category && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground">
                            {item.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-pink-600/90 font-medium">
                          <Heart className="size-3 fill-pink-500/20 text-pink-500" />
                          {formatNumber(item.likes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="size-3" />
                          {item.comments}
                        </span>
                        <span className="flex items-center gap-1 hover:text-blue-500 transition-colors" title={`${item.views || 0} views`}>
                          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3 fill-current">
                            <g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g>
                          </svg>
                          {formatNumber(item.views || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Widget 3: Top Contributors (Real Database Users & Post Counts) */}
      <div className="bg-card border border-border/70 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        <h3 className="font-semibold text-sm text-foreground">Top Contributors</h3>

        {sidebarLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-muted" />
                <div className="space-y-1 flex-1">
                  <div className="h-3.5 bg-muted rounded w-24" />
                  <div className="h-2.5 bg-muted rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {contributors.map((contributor) => (
              <div
                key={contributor.name}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <UserAvatar
                    src={contributor.avatar}
                    name={contributor.name}
                    size={34}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-foreground truncate">
                      {contributor.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {contributor.handle}
                    </div>
                  </div>
                </div>

                {contributor.postCount > 0 && (
                  <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md shrink-0">
                    {contributor.postCount} {contributor.postCount === 1 ? "post" : "posts"}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function HeroSearchField({
  value,
  onChange,
  onClear,
  placeholder = "Search discussions...",
  className = "",
}: {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Shift + S keyboard shortcut to instantly focus the search field
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "S" || e.key === "s")) {
        const activeEl = document.activeElement as HTMLElement | null;
        if (
          activeEl &&
          (activeEl.tagName === "INPUT" ||
            activeEl.tagName === "TEXTAREA" ||
            activeEl.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="relative w-full flex items-center">
        {/* Search icon */}
        <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
          <Search className="size-3.5 sm:size-4" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-8.5 pr-16 bg-muted/40 hover:bg-muted/60 focus:bg-background text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 rounded-xl border border-border/70 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs"
          aria-label="Search discussions"
        />

        {/* Right side: Clear button if text exists, else HeroUI Kbd badges (Shift + S) */}
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {value ? (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 pointer-events-none select-none">
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground bg-background/90 dark:bg-muted/90 border border-border/80 rounded shadow-2xs">
                Shift
              </kbd>
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground bg-background/90 dark:bg-muted/90 border border-border/80 rounded shadow-2xs">
                S
              </kbd>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HeroUI ComboBox Compound Component System                           */
/* (ComboBox, Input, Label, ListBox, ListBox.Item, ListBox.ItemIndicator) */
/* ------------------------------------------------------------------ */

interface ComboBoxContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  inputValue: string;
  setInputValue: (val: string) => void;
  filterQuery: string;
  setFilterQuery: (val: string) => void;
  selectedKey: string | null;
  setSelectedKey: (key: string) => void;
}

const ComboBoxContext = createContext<ComboBoxContextType | null>(null);


function Input({
  placeholder = "Type to search...",
  className = "",
  value: propValue,
  onChange: propOnChange,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const ctx = useContext(ComboBoxContext);
  const val = propValue !== undefined ? String(propValue) : ctx ? ctx.inputValue : "";

  return (
    <input
      type="text"
      value={val}
      onChange={(e) => {
        if (propOnChange) propOnChange(e);
        if (ctx) {
          ctx.setInputValue(e.target.value);
          ctx.setFilterQuery(e.target.value);
          if (!ctx.isOpen) ctx.setIsOpen(true);
        }
      }}
      onFocus={(e) => {
        if (ctx) {
          if (!ctx.isOpen) ctx.setIsOpen(true);
          e.currentTarget.select();
        }
      }}
      placeholder={placeholder}
      className={`w-full h-10 pl-3.5 pr-9 text-xs sm:text-sm bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none ${className}`}
      {...rest}
    />
  );
}

function ComboBox({
  children,
  className = "",
  selectedKey,
  onSelectionChange,
  inputValue: controlledInput,
  onInputChange,
  defaultInputValue = "",
}: {
  children: React.ReactNode;
  className?: string;
  selectedKey?: string | null;
  onSelectionChange?: (key: string) => void;
  inputValue?: string;
  onInputChange?: (val: string) => void;
  defaultInputValue?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [uncontrolledInput, setUncontrolledInput] = useState(defaultInputValue);
  const [internalSelectedKey, setInternalSelectedKey] = useState<string | null>(
    selectedKey || null
  );
  const [prevSelectedKey, setPrevSelectedKey] = useState(selectedKey);
  if (selectedKey !== prevSelectedKey) {
    setPrevSelectedKey(selectedKey);
    setInternalSelectedKey(selectedKey || null);
    const matched = CATEGORY_ITEMS.find((c) => c.id === selectedKey);
    if (matched && controlledInput === undefined) {
      setUncontrolledInput(matched.name);
    }
    setFilterQuery("");
  }
  const containerRef = useRef<HTMLDivElement>(null);

  const inputValue = controlledInput !== undefined ? controlledInput : uncontrolledInput;
  const setInputValue = (val: string) => {
    if (onInputChange) onInputChange(val);
    setUncontrolledInput(val);
  };

  const currentSelectedKey = selectedKey !== undefined ? selectedKey : internalSelectedKey;
  const handleSelect = (key: string) => {
    setInternalSelectedKey(key);
    setFilterQuery("");
    if (onSelectionChange) onSelectionChange(key);
  };

  const handleSetIsOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setFilterQuery("");
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFilterQuery("");
        const matched = CATEGORY_ITEMS.find((c) => c.id === currentSelectedKey);
        if (matched && controlledInput === undefined) {
          setUncontrolledInput(matched.name);
        }
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, currentSelectedKey, controlledInput]);

  return (
    <ComboBoxContext.Provider
      value={{
        isOpen,
        setIsOpen: handleSetIsOpen,
        inputValue,
        setInputValue,
        filterQuery,
        setFilterQuery,
        selectedKey: currentSelectedKey,
        setSelectedKey: handleSelect,
      }}
    >
      <div ref={containerRef} className={`relative space-y-1 ${className}`}>
        {children}
      </div>
    </ComboBoxContext.Provider>
  );
}

ComboBox.InputGroup = function ComboBoxInputGroup({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center w-full rounded-xl bg-card border border-border/80 shadow-2xs hover:border-blue-500/50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${className}`}
    >
      {children}
    </div>
  );
};

ComboBox.Trigger = function ComboBoxTrigger({
  className = "",
}: {
  className?: string;
}) {
  const ctx = useContext(ComboBoxContext);
  if (!ctx) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        ctx.setIsOpen(!ctx.isOpen);
      }}
      className={`absolute right-2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer ${className}`}
      aria-label="Toggle options"
    >
      <ChevronDown
        className={`size-4 transition-transform duration-200 ${
          ctx.isOpen ? "rotate-180 text-blue-500" : ""
        }`}
      />
    </button>
  );
};

ComboBox.Popover = function ComboBoxPopover({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(ComboBoxContext);
  if (!ctx || !ctx.isOpen) return null;

  return (
    <div
      className={`absolute left-0 right-0 top-full mt-1.5 z-50 bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-150 min-w-[220px] ${className}`}
    >
      {children}
    </div>
  );
};

function ListBox({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="listbox"
      className={`max-h-64 overflow-y-auto space-y-0.5 overscroll-contain ${className}`}
    >
      {children}
    </div>
  );
}

interface ListBoxItemContextType {
  isSelected: boolean;
}
const ListBoxItemContext = createContext<ListBoxItemContextType>({ isSelected: false });

ListBox.Item = function ListBoxItem({
  id,
  textValue,
  children,
  className = "",
}: {
  id: string;
  textValue: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(ComboBoxContext);
  if (!ctx) return null;

  // Filter ONLY when user actively typed in filterQuery
  const query = ctx.filterQuery.trim().toLowerCase();
  const matchesFilter =
    !query ||
    textValue.toLowerCase().includes(query) ||
    id.toLowerCase().includes(query);

  if (!matchesFilter) return null;

  const isSelected = ctx.selectedKey === id;

  return (
    <ListBoxItemContext.Provider value={{ isSelected }}>
      <button
        type="button"
        role="option"
        aria-selected={isSelected}
        onClick={() => {
          ctx.setSelectedKey(id);
          ctx.setInputValue(textValue);
          ctx.setFilterQuery("");
          ctx.setIsOpen(false);
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${
          isSelected
            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
            : "text-foreground hover:bg-muted/70"
        } ${className}`}
      >
        <div className="flex items-center gap-2 truncate flex-1 min-w-0">
          {children}
        </div>
      </button>
    </ListBoxItemContext.Provider>
  );
};

ListBox.ItemIndicator = function ListBoxItemIndicator({
  className = "",
}: {
  className?: string;
}) {
  const { isSelected } = useContext(ListBoxItemContext);
  if (!isSelected) return null;

  return (
    <span
      className={`flex items-center text-blue-600 dark:text-blue-400 shrink-0 ml-2 ${className}`}
      aria-hidden="true"
    >
      <Check className="size-4" />
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Category Filter Bar (PC: Search + Ribbon, Mobile: HeroUI ComboBox) */
/* ------------------------------------------------------------------ */

function CategoryFilterSlider({
  activeTab,
  onSelectTab,
  selectedTag,
  onClearTag,
  trendingPostsCount,
  onOpenMobileTrending,
  searchQuery,
  onSearchChange,
  onClearSearch,
  showBookmarkedOnly,
  onToggleBookmarked,
  bookmarkedCount,
  isAuthenticated,
}: {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  selectedTag: string | null;
  onClearTag: () => void;
  trendingPostsCount: number;
  onOpenMobileTrending: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onClearSearch: () => void;
  showBookmarkedOnly: boolean;
  onToggleBookmarked: (val: boolean) => void;
  bookmarkedCount: number;
  isAuthenticated: boolean;
}) {
  return (
    <div className="space-y-2.5">
      {/* 1. Mobile View: Compact Search + Saved Button (Row 1), Category + Trending (Row 2) */}
      <div className="block sm:hidden space-y-2">
        {/* Row 1: Search Field + Saved Posts Button */}
        <div className="flex items-center gap-2">
          <HeroSearchField
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onClearSearch}
            placeholder="Search discussions..."
            className="flex-1 min-w-0"
          />

          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                toast.error("Please log in to view your saved discussions");
                return;
              }
              onToggleBookmarked(!showBookmarkedOnly);
            }}
            className={`h-10 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 shrink-0 select-none active:scale-95 ${
              showBookmarkedOnly
                ? "bg-blue-600 border-blue-600 text-white shadow-blue-500/20 shadow-xs font-semibold"
                : "bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground border-border/70"
            }`}
            title="Saved discussions"
          >
            <Bookmark className={`size-3.5 ${showBookmarkedOnly ? "fill-current" : ""}`} />
            <span>Saved</span>
            {bookmarkedCount > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                  showBookmarkedOnly
                    ? "bg-white/25 text-white"
                    : "bg-muted-foreground/15 text-foreground"
                }`}
              >
                {bookmarkedCount}
              </span>
            )}
          </button>
        </div>

        {/* Row 2: Category Selector + Trending Button */}
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <ComboBox
              className="w-full"
              selectedKey={activeTab}
              onSelectionChange={onSelectTab}
            >
              <ComboBox.InputGroup>
                <Input placeholder="Filter category..." />
                <ComboBox.Trigger />
              </ComboBox.InputGroup>
              <ComboBox.Popover>
                <ListBox>
                  {CATEGORY_ITEMS.map((item) => (
                    <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                      <span>{item.name}</span>
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </ComboBox.Popover>
            </ComboBox>
          </div>

          <button
            type="button"
            onClick={onOpenMobileTrending}
            className="h-10 px-3.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0 flex items-center gap-1.5"
            title="Trending Topics"
          >
            <Flame className="size-3.5 fill-amber-500/20 text-amber-500" />
            <span>Trending</span>
            {trendingPostsCount > 0 && (
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* 2. PC / Desktop View: Search Bar (Compact) + Category Selector + Saved Posts Button */}
      <div className="hidden sm:flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Compact Search Field (Compact width, NOT oversized) */}
          <HeroSearchField
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onClearSearch}
            placeholder="Search discussions..."
            className="w-60 lg:w-68 shrink-0"
          />

          {/* HeroUI ComboBox Category Selector */}
          <ComboBox
            className="w-56 shrink-0"
            selectedKey={activeTab}
            onSelectionChange={onSelectTab}
          >
            <ComboBox.InputGroup>
              <Input placeholder="Filter category..." />
              <ComboBox.Trigger />
            </ComboBox.InputGroup>
            <ComboBox.Popover>
              <ListBox>
                {CATEGORY_ITEMS.map((item) => (
                  <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                    <span>{item.name}</span>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </ComboBox.Popover>
          </ComboBox>
        </div>

        {/* Right: Saved / Bookmarked Posts Filter Button */}
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              toast.error("Please log in to view your saved discussions");
              return;
            }
            onToggleBookmarked(!showBookmarkedOnly);
          }}
          className={`h-10 px-3.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs flex items-center gap-2 shrink-0 select-none active:scale-95 ${
            showBookmarkedOnly
              ? "bg-blue-600 border-blue-600 text-white shadow-blue-500/20 shadow-xs font-semibold"
              : "bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground border-border/70"
          }`}
          title={showBookmarkedOnly ? "Showing saved discussions (click to show all)" : "View your saved discussions"}
        >
          <Bookmark className={`size-3.5 ${showBookmarkedOnly ? "fill-current" : ""}`} />
          <span>Saved Posts</span>
          {bookmarkedCount > 0 && (
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                showBookmarkedOnly
                  ? "bg-white/25 text-white"
                  : "bg-muted-foreground/15 text-foreground"
              }`}
            >
              {bookmarkedCount}
            </span>
          )}
        </button>
      </div>

      {/* Active Filter Pills (Search query, Tag, or Saved posts) */}
      {(selectedTag || searchQuery || showBookmarkedOnly) && (
        <div className="flex items-center gap-2 pt-0.5 flex-wrap">
          {showBookmarkedOnly && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-semibold animate-in fade-in duration-100">
              <Bookmark className="size-3 fill-current" />
              <span>Saved posts ({bookmarkedCount})</span>
              <button
                type="button"
                onClick={() => onToggleBookmarked(false)}
                className="p-0.5 hover:text-blue-700 hover:bg-blue-500/20 rounded-full transition-colors cursor-pointer"
                title="Show all discussions"
              >
                <X className="size-3" />
              </button>
            </div>
          )}

          {searchQuery && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-semibold">
              <span>Search: &quot;{searchQuery}&quot;</span>
              <button
                type="button"
                onClick={onClearSearch}
                className="p-0.5 hover:text-blue-700 hover:bg-blue-500/20 rounded-full transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="size-3" />
              </button>
            </div>
          )}

          {selectedTag && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-semibold">
              <span>Filtering by #{selectedTag}</span>
              <button
                type="button"
                onClick={onClearTag}
                className="p-0.5 hover:text-blue-700 hover:bg-blue-500/20 rounded-full transition-colors cursor-pointer"
                title="Clear tag"
              >
                <X className="size-3" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              onClearSearch();
              onClearTag();
              onToggleBookmarked(false);
            }}
            className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Discussions Page Component                                    */
/* ------------------------------------------------------------------ */

export default function DiscussionsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<DiscussionPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All posts");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  // Instant client-side search and bookmark filtering across title, content, author, tags, category
  const displayedPosts = React.useMemo(() => {
    let result = posts;
    if (showBookmarkedOnly) {
      result = result.filter((p) => p.isBookmarked);
    }
    if (!searchQuery.trim()) return result;
    const q = searchQuery.toLowerCase().trim();
    return result.filter((p) => {
      const titleMatch = p.title?.toLowerCase().includes(q);
      const contentMatch = p.content.toLowerCase().includes(q);
      const authorMatch =
        p.authorName.toLowerCase().includes(q) ||
        p.authorHandle?.toLowerCase().includes(q);
      const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(q));
      const categoryMatch = p.category.toLowerCase().includes(q);
      return titleMatch || contentMatch || authorMatch || tagMatch || categoryMatch;
    });
  }, [posts, searchQuery, showBookmarkedOnly]);

  const bookmarkedPostsCount = React.useMemo(() => {
    return posts.filter((p) => p.isBookmarked).length;
  }, [posts]);

  const handleBookmarkChange = (postId: string, isBookmarked: boolean) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isBookmarked } : p))
    );
  };

  // Dynamic Sidebar State (Fetched 100% from PostgreSQL database)
  const [tagPages, setTagPages] = useState<string[][]>([]);
  const [trendingPosts, setTrendingPosts] = useState<TrendingPostItem[]>([]);
  const [contributors, setContributors] = useState<ContributorItem[]>([]);
  const [tagsPageIndex, setTagsPageIndex] = useState(0);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Quick Composer State
  const [composerContent, setComposerContent] = useState("");
  const [composerTitle, setComposerTitle] = useState("");
  const [composerCategory, setComposerCategory] = useState("Discussion");
  const [composerTags, setComposerTags] = useState("");
  const [composerImages, setComposerImages] = useState<string[]>([]);
  const [composerTab, setComposerTab] = useState<"write" | "preview">("write");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeStyles, setActiveStyles] = useState<{ bold?: boolean; italic?: boolean; underline?: boolean; strike?: boolean }>({});

  const updateActiveStyles = () => {
    if (typeof document !== "undefined") {
      setActiveStyles({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strike: document.queryCommandState("strikeThrough"),
      });
    }
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    if (!editorRef.current.textContent?.trim() && !html.includes("<img")) {
      setComposerContent("");
    } else {
      setComposerContent(htmlToMarkdown(html));
    }
    updateActiveStyles();
  };

  // Scroll listener to only show mobile FAB when scrolled past the top composer
  useEffect(() => {
    const handleScroll = () => {
      setShowFab(window.scrollY > 280);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

type FormatAction =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "code"
  | "codeblock"
  | "h1"
  | "h2"
  | "list"
  | "listordered"
  | "quote"
  | "link";

  // Visual WYSIWYG Rich Text formatting (no raw stars or asterisks)
  const handleFormat = (type: FormatAction) => {
    setIsExpanded(true);
    setComposerTab("write");
    if (!editorRef.current) return;
    editorRef.current.focus();

    switch (type) {
      case "bold":
        document.execCommand("bold", false);
        break;
      case "italic":
        document.execCommand("italic", false);
        break;
      case "underline":
        document.execCommand("underline", false);
        break;
      case "strikethrough":
        document.execCommand("strikeThrough", false);
        break;
      case "h1":
        document.execCommand("formatBlock", false, "<h2>");
        break;
      case "h2":
        document.execCommand("formatBlock", false, "<h3>");
        break;
      case "quote":
        document.execCommand("formatBlock", false, "<blockquote>");
        break;
      case "list":
        document.execCommand("insertUnorderedList", false);
        break;
      case "listordered":
        document.execCommand("insertOrderedList", false);
        break;
      case "code": {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const codeEl = document.createElement("code");
          codeEl.textContent = range.toString() || "code";
          range.deleteContents();
          range.insertNode(codeEl);
        }
        break;
      }
      case "codeblock": {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const preEl = document.createElement("pre");
          const codeEl = document.createElement("code");
          codeEl.textContent = range.toString() || "// write code here";
          preEl.appendChild(codeEl);
          range.deleteContents();
          range.insertNode(preEl);
        }
        break;
      }
      case "link": {
        const url = window.prompt("Enter link URL (e.g. https://example.com):", "https://");
        if (url) {
          document.execCommand("createLink", false, url);
        }
        break;
      }
    }
    handleEditorInput();
  };

  // Fetch discussions feed from DB (for manual refresh / mutation)
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab !== "All posts") params.set("category", activeTab);
      if (selectedTag) params.set("tag", selectedTag);
      if (user?.uid) params.set("userId", user.uid);
      if (showBookmarkedOnly) params.set("bookmarked", "true");

      const res = await fetch(`/api/discussions?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Error loading discussions:", err);
      toast.error("Failed to load discussions");
    } finally {
      setLoading(false);
    }
  };

  // Initial and reactive load for discussions feed
  useEffect(() => {
    let ignore = false;
    const loadFeed = async () => {
      try {
        const params = new URLSearchParams();
        if (activeTab !== "All posts") params.set("category", activeTab);
        if (selectedTag) params.set("tag", selectedTag);
        if (user?.uid) params.set("userId", user.uid);
        if (showBookmarkedOnly) params.set("bookmarked", "true");

        const res = await fetch(`/api/discussions?${params.toString()}`);
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error("Error loading discussions:", err);
        toast.error("Failed to load discussions");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadFeed();
    return () => {
      ignore = true;
    };
  }, [activeTab, selectedTag, user?.uid, showBookmarkedOnly]);

  // Fetch dynamic sidebar widgets from DB (for manual refresh / mutation)
  const fetchSidebarData = async () => {
    try {
      setSidebarLoading(true);
      const res = await fetch("/api/discussions/sidebar");
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.trending)) setTrendingPosts(data.trending);
        if (Array.isArray(data.contributors)) setContributors(data.contributors);
        if (Array.isArray(data.tagPages)) setTagPages(data.tagPages);
      }
    } catch (err) {
      console.error("Error loading sidebar data:", err);
    } finally {
      setSidebarLoading(false);
    }
  };

  // Initial load for dynamic sidebar widgets
  useEffect(() => {
    let ignore = false;
    const loadSidebar = async () => {
      try {
        const res = await fetch("/api/discussions/sidebar");
        const data = await res.json();
        if (!ignore && data.success) {
          if (Array.isArray(data.trending)) setTrendingPosts(data.trending);
          if (Array.isArray(data.contributors)) setContributors(data.contributors);
          if (Array.isArray(data.tagPages)) setTagPages(data.tagPages);
        }
      } catch (err) {
        console.error("Error loading sidebar data:", err);
      } finally {
        if (!ignore) {
          setSidebarLoading(false);
        }
      }
    };

    loadSidebar();
    return () => {
      ignore = true;
    };
  }, []);

  // Handle Multi-Image Upload (up to 10 photos)
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (composerImages.length + files.length > 10) {
      toast.error(`You can attach a maximum of 10 photos (${composerImages.length} already attached)`);
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} exceeds the 10MB limit`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setComposerImages((prev) => [...prev, ...uploadedUrls].slice(0, 10));
        toast.success(`Attached ${uploadedUrls.length} photo(s)`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Network error uploading photo(s)");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  // Handle Create Post
  const handleCreatePost = async () => {
    if (!composerContent.trim()) {
      toast.error("Please write some content for your post");
      return;
    }

    try {
      setIsSubmitting(true);
      const tagList = parseTagsInput(composerTags);

      const resolvedImageUrl =
        composerImages.length === 1
          ? composerImages[0]
          : composerImages.length > 1
          ? JSON.stringify(composerImages)
          : null;

      const body = {
        title: composerTitle.trim() || null,
        content: composerContent.trim(),
        category: composerCategory,
        tags: tagList,
        imageUrl: resolvedImageUrl,
        imageUrls: composerImages,
        userId: user?.uid || null,
        authorName: user?.displayName || "Coder",
        authorHandle: user?.email ? `@${user.email.split("@")[0]}` : "@coder",
        authorRole: "Software Engineer",
        avatarUrl: user?.photoURL || null,
      };

      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success && data.post) {
        toast.success("Post published to community!");
        // Reset composer
        setComposerContent("");
        setComposerTitle("");
        setComposerTags("");
        setComposerImages([]);
        if (editorRef.current) editorRef.current.innerHTML = "";
        setIsExpanded(false);
        // Refresh feed & sidebar
        fetchPosts();
        fetchSidebarData();
      } else {
        toast.error(data.error || "Failed to publish post");
      }
    } catch (err) {
      console.error("Post creation error:", err);
      toast.error("Network error publishing post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTagsList = tagPages[tagsPageIndex] || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-24 sm:pb-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* ======================================================== */}
          {/* MAIN FEED COLUMN                                         */}
          {/* ======================================================== */}
          <main className="flex-1 w-full min-w-0 max-w-3xl mx-auto space-y-4 sm:space-y-6">
            
            {/* 1. Quick Composer: Sleek Collapsible Pill on Mobile/Desktop */}
            {!isExpanded ? (
              <div
                onClick={() => {
                  setIsExpanded(true);
                  setTimeout(() => editorRef.current?.focus(), 50);
                }}
                className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-card border border-border/80 rounded-xl sm:rounded-2xl shadow-2xs cursor-pointer hover:border-blue-500/40 hover:bg-muted/25 transition-all group select-none"
              >
                <UserAvatar
                  src={user?.photoURL}
                  name={user?.displayName || "User"}
                  size={36}
                  className="sm:size-10 shrink-0"
                />

                <div className="flex-1 min-w-0 flex items-center justify-between px-3.5 py-2 rounded-xl bg-muted/40 group-hover:bg-muted/60 border border-border/50 text-muted-foreground text-xs sm:text-sm font-medium transition-colors">
                  <span className="truncate">Share your experience, guide, or ask a question...</span>
                  <Pencil className="size-3.5 text-blue-500 shrink-0 ml-1.5" />
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                    setTimeout(() => fileInputRef.current?.click(), 50);
                  }}
                  className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Add photo"
                  aria-label="Add photo"
                >
                  <ImageIcon className="size-4" />
                </button>
              </div>
            ) : (
              <div className="bg-card border border-border/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-2xs transition-all focus-within:border-blue-500/50 space-y-3 animate-in fade-in duration-150">
                {/* Header with Avatar, User Name and Close Button */}
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <UserAvatar
                      src={user?.photoURL}
                      name={user?.displayName || "User"}
                      size={32}
                      className="shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-foreground block truncate">
                        {user?.displayName || "New Discussion Post"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Posting publicly</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(false);
                      setComposerTab("write");
                    }}
                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
                    title="Close"
                    aria-label="Close"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Optional Post Title */}
                <input
                  type="text"
                  placeholder="Post title (e.g. How I Built A Real-Time Whiteboard...)"
                  value={composerTitle}
                  onChange={(e) => setComposerTitle(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold placeholder:text-muted-foreground/60 focus:outline-none border-b border-border/40 pb-2"
                />

                {/* Write vs Preview Mode */}
                {composerTab === "write" ? (
                  <div className="relative min-h-[95px] py-1">
                    {!composerContent.trim() && (
                      <div
                        onClick={() => editorRef.current?.focus()}
                        className="absolute top-1 left-0 text-xs sm:text-sm text-muted-foreground/60 pointer-events-none select-none"
                      >
                        What are you working on or want to share?
                      </div>
                    )}
                    <div
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      role="textbox"
                      aria-multiline="true"
                      onInput={handleEditorInput}
                      onKeyUp={updateActiveStyles}
                      onMouseUp={updateActiveStyles}
                      className="w-full min-h-[95px] max-h-[320px] overflow-y-auto bg-transparent text-xs sm:text-sm text-foreground focus:outline-none leading-relaxed select-text [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_s]:line-through [&_del]:line-through [&_h2]:text-base [&_h2]:font-bold [&_h2]:my-1.5 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:my-1 [&_blockquote]:border-l-2 [&_blockquote]:border-blue-500 [&_blockquote]:pl-2.5 [&_blockquote]:italic [&_blockquote]:my-1 [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_code]:bg-muted/80 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:text-blue-500 [&_a]:text-blue-600 [&_a]:underline"
                    />
                  </div>
                ) : (
                  <div className="min-h-[80px] p-3 rounded-xl bg-muted/30 border border-border/40 text-xs sm:text-sm">
                    {composerContent.trim() ? (
                      <MarkdownViewer content={composerContent} />
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        Nothing to preview yet. Switch back to Write to compose your post.
                      </p>
                    )}
                  </div>
                )}

                {/* Attached Photos Preview in Composer (up to 10 photos) */}
                {composerImages.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                      <span>Attached Photos ({composerImages.length}/10)</span>
                      {composerImages.length < 10 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Plus className="size-3" />
                          <span>Add more</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-2 rounded-xl bg-muted/40 border border-border/60">
                      {composerImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border/60 group bg-muted/30">
                          <img src={imgUrl} alt={`Attached ${idx + 1}`} className="size-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setComposerImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 size-5 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90"
                            title="Remove photo"
                            aria-label="Remove photo"
                          >
                            <X className="size-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white font-medium">
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                      {composerImages.length < 10 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="aspect-square rounded-lg border-2 border-dashed border-border/80 hover:border-blue-500/60 bg-background/50 hover:bg-muted/40 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
                          title="Add another photo"
                        >
                          {isUploading ? (
                            <Loader2 className="size-4 animate-spin text-blue-500" />
                          ) : (
                            <>
                              <Plus className="size-4 text-blue-500" />
                              <span className="text-[10px] font-semibold">Add</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Category & Tags Selector (Mobile responsive stack) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground font-medium sm:hidden shrink-0">Category:</span>
                    <select
                      value={composerCategory}
                      onChange={(e) => setComposerCategory(e.target.value)}
                      className="text-xs bg-muted/70 hover:bg-muted border border-border/60 text-foreground rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer font-medium w-full sm:w-auto"
                    >
                      <option value="Discussion">Discussion</option>
                      <option value="Study Guide">Study Guide</option>
                      <option value="Events">Events</option>
                      <option value="System Design">System Design</option>
                      <option value="DSA Tips">DSA Tips</option>
                      <option value="Career">Career</option>
                      <option value="Showcase">Showcase</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    placeholder="Tags (comma separated: React, AWS, DSA)"
                    value={composerTags}
                    onChange={(e) => setComposerTags(e.target.value)}
                    className="text-xs bg-muted/40 border border-border/50 text-foreground rounded-lg px-2.5 py-1.5 focus:outline-none flex-1 min-w-0"
                  />
                </div>

                {/* Composer Bottom Row: Rich Formatting Toolbar, Write/Preview Tabs & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-3 border-t border-border/40">
                  {/* Left: Rich Text Toolbar (horizontally scrollable with touch-friendly paddings) */}
                  <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar py-0.5 max-w-full -mx-1 px-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Attach Image"
                    >
                      {isUploading ? (
                        <Loader2 className="size-4 animate-spin text-blue-500" />
                      ) : (
                        <ImageIcon className="size-4" />
                      )}
                    </button>

                    <div className="h-3.5 w-px bg-border/60 mx-1 shrink-0" />

                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("bold");
                      }}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer font-bold text-xs shrink-0 ${
                        activeStyles.bold
                          ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 font-extrabold shadow-2xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                      }`}
                      title="Bold (Ctrl+B)"
                    >
                      <Bold className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("italic");
                      }}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs shrink-0 ${
                        activeStyles.italic
                          ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold shadow-2xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                      }`}
                      title="Italic (Ctrl+I)"
                    >
                      <Italic className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("underline");
                      }}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs shrink-0 ${
                        activeStyles.underline
                          ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold shadow-2xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                      }`}
                      title="Underline (Ctrl+U)"
                    >
                      <Underline className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("strikethrough");
                      }}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs shrink-0 ${
                        activeStyles.strike
                          ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold shadow-2xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                      }`}
                      title="Strikethrough"
                    >
                      <Strikethrough className="size-3.5" />
                    </button>

                    <div className="h-3.5 w-px bg-border/60 mx-1 shrink-0" />

                    <button
                      type="button"
                      onClick={() => handleFormat("h1")}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors cursor-pointer text-xs font-semibold shrink-0"
                      title="Heading 1 (# text)"
                    >
                      <Heading1 className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormat("h2")}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors cursor-pointer text-xs font-semibold shrink-0"
                      title="Heading 2 (## text)"
                    >
                      <Heading2 className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormat("code")}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors cursor-pointer text-xs font-mono shrink-0"
                      title="Inline Code (`code`, Ctrl+E)"
                    >
                      <Code className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormat("codeblock")}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors cursor-pointer text-xs font-mono shrink-0"
                      title="Code Block (```ts)"
                    >
                      <Code2 className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormat("quote")}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors cursor-pointer text-xs shrink-0"
                      title="Quote (> text)"
                    >
                      <Quote className="size-3.5" />
                    </button>

                    <div className="h-3.5 w-px bg-border/60 mx-1 shrink-0" />

                    <button
                      type="button"
                      onClick={() => handleFormat("list")}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors cursor-pointer text-xs shrink-0"
                      title="Bullet List (- item)"
                    >
                      <List className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormat("listordered")}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors cursor-pointer text-xs shrink-0"
                      title="Numbered List (1. item)"
                    >
                      <ListOrdered className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormat("link")}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors cursor-pointer text-xs shrink-0"
                      title="Add Link ([text](url), Ctrl+K)"
                    >
                      <Link2 className="size-3.5" />
                    </button>
                  </div>

                  {/* Right: Write/Preview Tabs + Cancel + Post Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0">
                    <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/40">
                      <button
                        type="button"
                        onClick={() => setComposerTab("write")}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                          composerTab === "write"
                            ? "bg-background text-foreground shadow-2xs font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Edit3 className="size-3" />
                        <span>Write</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setComposerTab("preview")}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                          composerTab === "preview"
                            ? "bg-background text-foreground shadow-2xs font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Eye className="size-3" />
                        <span>Preview</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsExpanded(false);
                          setComposerTab("write");
                          if (editorRef.current) editorRef.current.innerHTML = "";
                          setComposerContent("");
                        }}
                        className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleCreatePost}
                        disabled={isSubmitting || isUploading || !composerContent.trim()}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-40 disabled:pointer-events-none text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/25 active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" />
                            <span>Posting...</span>
                          </>
                        ) : (
                          <span>Post</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Search & Category Filter */}
            <CategoryFilterSlider
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setSelectedTag(null);
              }}
              selectedTag={selectedTag}
              onClearTag={() => setSelectedTag(null)}
              trendingPostsCount={trendingPosts.length}
              onOpenMobileTrending={() => setMobileSidebarOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearSearch={() => setSearchQuery("")}
              showBookmarkedOnly={showBookmarkedOnly}
              onToggleBookmarked={setShowBookmarkedOnly}
              bookmarkedCount={bookmarkedPostsCount}
              isAuthenticated={Boolean(user)}
            />

            {/* 3. Posts Feed */}
            {loading ? (
              <div className="space-y-4 py-8">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className="bg-card border border-border/60 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-4 animate-pulse"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 sm:size-10 rounded-full bg-muted" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 bg-muted rounded w-48" />
                        <div className="h-3 bg-muted rounded w-28" />
                      </div>
                    </div>
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-44 sm:h-48 bg-muted rounded-xl w-full" />
                  </div>
                ))}
              </div>
            ) : displayedPosts.length === 0 ? (
              <div className="bg-card border border-border/70 rounded-xl sm:rounded-2xl p-8 sm:p-10 text-center space-y-3">
                <div className="size-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
                  {showBookmarkedOnly ? (
                    <Bookmark className="size-6 fill-blue-500/20" />
                  ) : (
                    <MessageCircle className="size-6" />
                  )}
                </div>
                <h3 className="font-semibold text-base">
                  {showBookmarkedOnly ? "No saved discussions yet" : "No discussions found"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {showBookmarkedOnly
                    ? "You haven't bookmarked any discussions yet. Click the bookmark icon on any post to save it here for quick access!"
                    : searchQuery
                    ? `No discussions match "${searchQuery}". Try a different keyword.`
                    : selectedTag
                    ? `No posts found with tag #${selectedTag}. Try clearing the filter.`
                    : "Be the first to start a discussion, ask a question, or post a study guide!"}
                </p>
                {(selectedTag || searchQuery || showBookmarkedOnly) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTag(null);
                      setSearchQuery("");
                      setShowBookmarkedOnly(false);
                    }}
                    className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Clear filters & view all discussions
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                {displayedPosts.map((post) => (
                  <CommunityPostCard
                    key={post.id}
                    post={post}
                    currentUser={user}
                    onTagClick={(tag) => setSelectedTag(tag)}
                    onPostDeleted={() => {
                      setPosts((prev) => prev.filter((p) => p.id !== post.id));
                      fetchSidebarData();
                    }}
                    onBookmarkChange={handleBookmarkChange}
                  />
                ))}
              </div>
            )}
          </main>

          {/* ======================================================== */}
          {/* RIGHT SIDEBAR (Desktop: Fixed Sticky Column)             */}
          {/* ======================================================== */}
          <aside className="w-80 shrink-0 hidden lg:block self-start sticky top-[4.5rem] space-y-6 max-h-[calc(100vh-5.5rem)] overflow-y-auto no-scrollbar pb-6 pr-0.5">
            <DiscussionsSidebarWidgets
              tagPages={tagPages}
              tagsPageIndex={tagsPageIndex}
              setTagsPageIndex={setTagsPageIndex}
              currentTagsList={currentTagsList}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              trendingPosts={trendingPosts}
              setActiveTab={setActiveTab}
              contributors={contributors}
              sidebarLoading={sidebarLoading}
            />
          </aside>
        </div>
      </div>

      {/* Floating "New Post" Button for Mobile (Only shown after scrolling down past the top composer) */}
      {showFab && (
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setIsExpanded(true);
            setTimeout(() => {
              editorRef.current?.focus();
            }, 300);
          }}
          className="lg:hidden fixed bottom-6 right-5 z-40 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3.5 rounded-full shadow-xl shadow-blue-500/35 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer animate-in fade-in zoom-in duration-200"
          title="Create New Post"
          aria-label="Create New Post"
        >
          <Pencil className="size-5" />
        </button>
      )}

      {/* Mobile Slide-over Drawer for Trending & Tags */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-[88vw] max-w-sm h-full bg-card border-l border-border/80 shadow-2xl flex flex-col p-4 sm:p-5 overflow-y-auto space-y-5 z-10 animate-in slide-in-from-right duration-250">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <Flame className="size-4 text-amber-500 fill-amber-500/20" />
                <span>Trending & Tags</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <DiscussionsSidebarWidgets
              tagPages={tagPages}
              tagsPageIndex={tagsPageIndex}
              setTagsPageIndex={setTagsPageIndex}
              currentTagsList={currentTagsList}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              trendingPosts={trendingPosts}
              setActiveTab={setActiveTab}
              contributors={contributors}
              sidebarLoading={sidebarLoading}
              onItemClick={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LinkedIn-Style Image Lightbox Modal                                */
/* ------------------------------------------------------------------ */

function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onChangeIndex,
}: {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && images.length > 1) {
        onChangeIndex((currentIndex - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight" && images.length > 1) {
        onChangeIndex((currentIndex + 1) % images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onChangeIndex]);

  if (!isOpen || images.length === 0) return null;

  const currentSrc = images[currentIndex] || images[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    if (touchDeltaX.current < -40 && images.length > 1) {
      onChangeIndex((currentIndex + 1) % images.length);
    } else if (touchDeltaX.current > 40 && images.length > 1) {
      onChangeIndex((currentIndex - 1 + images.length) % images.length);
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200 select-none touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-2">
          <span className="text-white/90 text-xs sm:text-sm font-semibold tracking-wide bg-white/10 px-3 py-1 rounded-full border border-white/10">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Close Button (Cross Button) */}
        <button
          type="button"
          onClick={onClose}
          className="size-9 sm:size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 active:scale-95"
          title="Close (Esc)"
          aria-label="Close image viewer"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Main Image Center Area with Previous/Next Arrows */}
      <div className="relative flex-1 flex items-center justify-center py-2 sm:py-4 overflow-hidden">
        {/* Previous Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChangeIndex((currentIndex - 1 + images.length) % images.length);
            }}
            className="absolute left-2 sm:left-6 z-10 size-10 sm:size-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg active:scale-90"
            aria-label="Previous photo"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="size-6" />
          </button>
        )}

        {/* The Full Image */}
        <div className="relative max-h-[78vh] max-w-[92vw] flex items-center justify-center">
          <img
            src={currentSrc}
            alt={`Photo ${currentIndex + 1}`}
            className="max-h-[78vh] max-w-[92vw] object-contain rounded-xl shadow-2xl transition-all duration-150 animate-in zoom-in-95"
          />
        </div>

        {/* Next Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChangeIndex((currentIndex + 1) % images.length);
            }}
            className="absolute right-2 sm:right-6 z-10 size-10 sm:size-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg active:scale-90"
            aria-label="Next photo"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="size-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip (if multiple pictures) */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2 z-10">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChangeIndex(idx)}
              className={`relative size-12 sm:size-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                idx === currentIndex
                  ? "border-blue-500 scale-105 shadow-md shadow-blue-500/30"
                  : "border-white/20 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LinkedIn-Style Post Image Gallery Grid (Mobile & Desktop)          */
/* ------------------------------------------------------------------ */

function PostImageGallery({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick: (index: number) => void;
}) {
  if (!images || images.length === 0) return null;

  // 1 Image: Full natural aspect ratio
  if (images.length === 1) {
    return (
      <div
        onClick={() => onImageClick(0)}
        className="relative rounded-2xl overflow-hidden my-3 border border-border/60 w-full max-h-[500px] sm:max-h-[640px] flex items-center justify-center bg-black/[0.02] dark:bg-black/30 cursor-pointer group shadow-2xs"
      >
        <img
          src={images[0]}
          alt="Post photo"
          className="w-auto max-w-full h-auto max-h-[500px] sm:max-h-[640px] object-contain transition-transform duration-300 group-hover:scale-[1.008]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
      </div>
    );
  }

  // 2 Images: Side-by-side (2 equal columns)
  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 rounded-2xl overflow-hidden my-3 border border-border/60 h-52 sm:h-72 md:h-80 shadow-2xs bg-muted/20">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => onImageClick(idx)}
            className="relative w-full h-full cursor-pointer overflow-hidden group"
          >
            <img
              src={img}
              alt={`Post photo ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
          </div>
        ))}
      </div>
    );
  }

  // 3 Images: 1 large photo on the left, 2 stacked vertically (up and down) on the right
  if (images.length === 3) {
    return (
      <div className="grid grid-cols-12 gap-1.5 sm:gap-2 rounded-2xl overflow-hidden my-3 border border-border/60 h-56 sm:h-80 md:h-96 shadow-2xs bg-muted/20">
        {/* Left: 1 Large Photo (Index 0) */}
        <div
          onClick={() => onImageClick(0)}
          className="col-span-7 relative w-full h-full cursor-pointer overflow-hidden group"
        >
          <img
            src={images[0]}
            alt="Post photo 1"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
        </div>

        {/* Right: 2 Photos stacked Up and Down (Index 1 & 2) */}
        <div className="col-span-5 grid grid-rows-2 gap-1.5 sm:gap-2 h-full">
          <div
            onClick={() => onImageClick(1)}
            className="relative w-full h-full cursor-pointer overflow-hidden group"
          >
            <img
              src={images[1]}
              alt="Post photo 2"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
          </div>
          <div
            onClick={() => onImageClick(2)}
            className="relative w-full h-full cursor-pointer overflow-hidden group"
          >
            <img
              src={images[2]}
              alt="Post photo 3"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
          </div>
        </div>
      </div>
    );
  }

  // 4+ Images: 1 large photo on the left, 2 stacked up and down on the right with +N badge on the bottom right photo!
  const remainingCount = images.length - 2;

  return (
    <div className="grid grid-cols-12 gap-1.5 sm:gap-2 rounded-2xl overflow-hidden my-3 border border-border/60 h-56 sm:h-80 md:h-96 shadow-2xs bg-muted/20">
      {/* Left: 1 Large Photo (Index 0) */}
      <div
        onClick={() => onImageClick(0)}
        className="col-span-7 relative w-full h-full cursor-pointer overflow-hidden group"
      >
        <img
          src={images[0]}
          alt="Post photo 1"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
      </div>

      {/* Right: 2 Photos stacked Up and Down */}
      <div className="col-span-5 grid grid-rows-2 gap-1.5 sm:gap-2 h-full">
        {/* Top Right Photo (Index 1) */}
        <div
          onClick={() => onImageClick(1)}
          className="relative w-full h-full cursor-pointer overflow-hidden group"
        >
          <img
            src={images[1]}
            alt="Post photo 2"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
        </div>

        {/* Bottom Right Photo (Index 2) with LinkedIn-style +N overlay */}
        <div
          onClick={() => onImageClick(2)}
          className="relative w-full h-full cursor-pointer overflow-hidden group"
        >
          <img
            src={images[2]}
            alt="Post photo 3"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          {/* Frosted Dark Glass Overlay for +2, +3, +4... */}
          <div className="absolute inset-0 bg-black/60 hover:bg-black/70 backdrop-blur-[2px] transition-colors flex flex-col items-center justify-center text-white">
            <span className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow">
              +{remainingCount}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/90 mt-0.5 drop-shadow">
              Photos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HeroUI Card Compound Component (for Delete & Action Modals)        */
/* ------------------------------------------------------------------ */

function HeroCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl sm:rounded-3xl p-6 shadow-2xl space-y-4 ${className}`}
    >
      {children}
    </div>
  );
}

HeroCard.Header = function HeroCardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`space-y-1.5 ${className}`}>{children}</div>;
};

HeroCard.Title = function HeroCardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-base sm:text-lg font-bold text-foreground tracking-tight ${className}`}>
      {children}
    </h3>
  );
};

HeroCard.Description = function HeroCardDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-xs sm:text-sm text-muted-foreground leading-relaxed ${className}`}>
      {children}
    </p>
  );
};

HeroCard.Footer = function HeroCardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-end gap-2.5 pt-3 border-t border-border/50 ${className}`}>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Post Card Component                                                */
/* ------------------------------------------------------------------ */

interface CurrentUserType {
  uid?: string;
  displayName?: string | null;
  photoURL?: string | null;
  email?: string | null;
}

interface CommunityPostCardProps {
  post: DiscussionPostItem;
  currentUser: CurrentUserType | null | undefined;
  onTagClick: (tag: string) => void;
  onPostDeleted: () => void;
  onBookmarkChange?: (postId: string, isBookmarked: boolean) => void;
}

function CommunityPostCard({
  post,
  currentUser,
  onTagClick,
  onPostDeleted,
  onBookmarkChange,
}: CommunityPostCardProps) {
  const currentUserId = currentUser?.uid;
  const [postData, setPostData] = useState(post);
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [viewsCount, setViewsCount] = useState(post.viewsCount || 0);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<DiscussionCommentItem[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  // GSAP Animation Context
  const containerRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const animateIcon = contextSafe((target: Element | null) => {
    if (target) {
      gsap.fromTo(
        target,
        { scale: 1 },
        {
          scale: 1.25,
          duration: 0.12,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(target, {
              scale: 1,
              duration: 0.15,
              ease: "power2.out",
            });
          },
        }
      );
    }
  });

  // 3-dots dropdown menu state
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Inline Post Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title || "");
  const [editContent, setEditContent] = useState(post.content);
  const [editCategory, setEditCategory] = useState(post.category);
  const [editTags, setEditTags] = useState(post.tags?.join(", ") || "");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Multi-image state for editing (up to 10 photos)
  const [editImages, setEditImages] = useState<string[]>(getPostImages(post));
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingEditImages, setIsUploadingEditImages] = useState(false);

  // LinkedIn-style Image Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Close 3-dots dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  // Keep postData & editImages in sync if prop changes
  const [prevPost, setPrevPost] = useState(post);
  if (post !== prevPost) {
    setPrevPost(post);
    setPostData(post);
    setLiked(post.isLiked);
    setLikesCount(post.likesCount);
    setViewsCount(post.viewsCount || 0);
    setBookmarked(post.isBookmarked);
    setEditImages(getPostImages(post));
  }

  // Remove photo from post in edit mode
  const handleRemoveEditImage = (idxToRemove: number) => {
    setEditImages((prev) => prev.filter((_, i) => i !== idxToRemove));
  };

  // Upload and attach photos in edit mode (up to 10 photos total)
  const handleEditImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (editImages.length + files.length > 10) {
      toast.error(`You can attach up to 10 photos total (${editImages.length} already attached)`);
      return;
    }

    try {
      setIsUploadingEditImages(true);
      const uploadedUrls: string[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} exceeds the 10MB limit`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setEditImages((prev) => [...prev, ...uploadedUrls].slice(0, 10));
        toast.success(`Attached ${uploadedUrls.length} photo(s)`);
      }
    } catch {
      toast.error("Network error uploading photo(s)");
    } finally {
      setIsUploadingEditImages(false);
      if (e.target) e.target.value = "";
    }
  };

  // Save edited post to database
  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    try {
      setIsSavingEdit(true);
      const tagList = parseTagsInput(editTags);

      const resolvedImageUrl =
        editImages.length === 1
          ? editImages[0]
          : editImages.length > 1
          ? JSON.stringify(editImages)
          : null;

      const res = await fetch(`/api/discussions/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim() || null,
          content: editContent.trim(),
          category: editCategory,
          imageUrl: resolvedImageUrl,
          imageUrls: editImages,
          tags: tagList,
          userId: currentUserId,
        }),
      });

      const data = await res.json();
      if (data.success && data.post) {
        setPostData((prev) => ({
          ...prev,
          title: data.post.title,
          content: data.post.content,
          category: data.post.category,
          imageUrl: data.post.imageUrl,
          imageUrls: editImages,
          tags: data.post.tags,
        }));
        setIsEditing(false);
        toast.success("Post updated successfully!");
      } else {
        toast.error(data.error || "Failed to update post");
      }
    } catch {
      toast.error("Network error updating post");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // New root comment input
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Active reply to comment ID
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Comments sort
  const [commentSort, setCommentSort] = useState<"recent" | "popular">("recent");

  // Track user votes on comments: Record<commentId, 'upvote' | 'downvote'>
  const [userCommentVotes, setUserCommentVotes] = useState<Record<string, "upvote" | "downvote">>(() => getStoredCommentVotes());

  // Register view count (+1) when anyone views this post (1 view per unique person ID)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const viewerId = currentUserId || getOrCreateViewerId();
    const storageKey = `algoryn_viewed_${post.id}_${viewerId}`;
    if (localStorage.getItem(storageKey)) {
      return; // This person already counted as viewed!
    }

    let recorded = false;
    const recordView = async () => {
      if (recorded) return;
      recorded = true;
      try {
        localStorage.setItem(storageKey, "1");

        const res = await fetch(`/api/discussions/${post.id}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId || null,
            viewerId,
          }),
        });
        const data = await res.json();
        if (data.success && typeof data.viewsCount === "number") {
          setViewsCount(data.viewsCount);
        }
      } catch (err) {
        console.error("Error incrementing post view:", err);
      }
    };

    if ("IntersectionObserver" in window && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            recordView();
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } else {
      recordView();
    }
  }, [post.id, currentUserId]);

  // Fetch comments when comments section is opened
  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      const url = `/api/discussions/${post.id}/comments${currentUserId ? `?userId=${encodeURIComponent(currentUserId)}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.comments)) {
        setComments(data.comments);
        setCommentsCount(data.totalCount || data.comments.length);
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
      console.error("Error fetching comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleToggleComments = () => {
    if (!commentsOpen) {
      loadComments();
    }
    setCommentsOpen(!commentsOpen);
  };

  // Toggle Like on Post
  const handleToggleLike = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    const nextLiked = !liked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setLiked(nextLiked);
    setLikesCount(nextCount);
    if (nextLiked && e?.currentTarget) {
      animateIcon(e.currentTarget.querySelector("svg"));
    }

    try {
      const res = await fetch(`/api/discussions/${post.id}/like`, {
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
      // Revert on error
      setLiked(!nextLiked);
      setLikesCount(likesCount);
    }
  };

  // Toggle Bookmark on Post
  const handleToggleBookmark = async () => {
    const nextBookmarked = !bookmarked;
    setBookmarked(nextBookmarked);
    onBookmarkChange?.(post.id, nextBookmarked);
    toast.success(nextBookmarked ? "Post bookmarked" : "Bookmark removed");

    try {
      const res = await fetch(`/api/discussions/${post.id}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      const data = await res.json();
      if (data.success) {
        setBookmarked(data.bookmarked);
        onBookmarkChange?.(post.id, data.bookmarked);
      }
    } catch {
      setBookmarked(!nextBookmarked);
      onBookmarkChange?.(post.id, !nextBookmarked);
    }
  };

  // Share Post
  const handleShare = () => {
    const url = `${window.location.origin}/dashboard/discussions#${post.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  // Custom In-App Delete Confirmation Modal State (No browser alert)
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: "post" | "comment";
    commentId?: string;
  }>({
    isOpen: false,
    type: "post",
  });
  const [isDeletingTarget, setIsDeletingTarget] = useState(false);

  // Trigger modal for post deletion
  const handleDeletePost = () => {
    setDeleteModalState({ isOpen: true, type: "post" });
  };

  // Trigger modal for comment deletion
  const handleDeleteComment = (commentId: string) => {
    setDeleteModalState({ isOpen: true, type: "comment", commentId });
  };

  // Execute actual deletion from custom modal confirmation
  const handleConfirmDelete = async () => {
    setIsDeletingTarget(true);
    try {
      if (deleteModalState.type === "post") {
        const res = await fetch(`/api/discussions/${post.id}?userId=${currentUserId || ""}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Discussion post deleted");
          setDeleteModalState({ isOpen: false, type: "post" });
          onPostDeleted();
        } else {
          toast.error(data.error || "Failed to delete post");
        }
      } else if (deleteModalState.type === "comment" && deleteModalState.commentId) {
        const commentId = deleteModalState.commentId;
        const res = await fetch(
          `/api/discussions/${post.id}/comments?commentId=${commentId}&userId=${currentUserId || ""}`,
          { method: "DELETE" }
        );
        const data = await res.json();
        if (data.success) {
          toast.success("Comment deleted");
          const removeCommentFromTree = (list: DiscussionCommentItem[]): DiscussionCommentItem[] => {
            return list
              .filter((c) => c.id !== commentId)
              .map((c) => ({
                ...c,
                replies: c.replies ? removeCommentFromTree(c.replies) : [],
              }));
          };
          setComments((prev) => removeCommentFromTree(prev));
          setCommentsCount((c) => Math.max(0, c - 1));
          setDeleteModalState({ isOpen: false, type: "comment" });
        } else {
          toast.error(data.error || "Failed to delete comment");
        }
      }
    } catch {
      toast.error("Network error deleting item");
    } finally {
      setIsDeletingTarget(false);
    }
  };

  // Edit Comment Content
  const handleEditComment = async (commentId: string, newContent: string): Promise<boolean> => {
    if (!newContent.trim()) {
      toast.error("Comment cannot be empty");
      return false;
    }
    try {
      const res = await fetch(`/api/discussions/${post.id}/comments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId,
          content: newContent.trim(),
          userId: currentUserId || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const updateCommentInTree = (list: DiscussionCommentItem[]): DiscussionCommentItem[] => {
          return list.map((c) => {
            if (c.id === commentId) {
              return { ...c, content: newContent.trim() };
            }
            if (c.replies && c.replies.length > 0) {
              return { ...c, replies: updateCommentInTree(c.replies) };
            }
            return c;
          });
        };
        setComments((prev) => updateCommentInTree(prev));
        toast.success("Comment updated!");
        return true;
      } else {
        toast.error(data.error || "Failed to update comment");
        return false;
      }
    } catch {
      toast.error("Failed to update comment");
      return false;
    }
  };

  // Add Root Comment (Dynamic user data from DB/Auth)
  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;

    try {
      setIsSubmittingComment(true);
      const res = await fetch(`/api/discussions/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newCommentText.trim(),
          userId: currentUserId || null,
          authorName: currentUser?.displayName || "Coder",
          avatarUrl: currentUser?.photoURL || null,
          authorHandle: currentUser?.email ? `@${currentUser.email.split("@")[0]}` : null,
        }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setCommentsCount((c) => c + 1);
        setNewCommentText("");
        toast.success("Comment posted!");
      }
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Add Reply to a comment (Dynamic user data from DB/Auth)
  const handleAddReply = async (parentId: string) => {
    if (!replyText.trim()) return;

    try {
      setIsSubmittingReply(true);
      const res = await fetch(`/api/discussions/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyText.trim(),
          parentId,
          userId: currentUserId || null,
          authorName: currentUser?.displayName || "Coder",
          avatarUrl: currentUser?.photoURL || null,
          authorHandle: currentUser?.email ? `@${currentUser.email.split("@")[0]}` : null,
        }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        // Append child to parent replies recursively
        const insertReplyInTree = (list: DiscussionCommentItem[]): DiscussionCommentItem[] => {
          return list.map((c) => {
            if (c.id === parentId) {
              return { ...c, replies: [...(c.replies || []), data.comment] };
            }
            if (c.replies && c.replies.length > 0) {
              return { ...c, replies: insertReplyInTree(c.replies) };
            }
            return c;
          });
        };
        setComments((prev) => insertReplyInTree(prev));
        setCommentsCount((c) => c + 1);
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

  // Upvote / Downvote Comment (Toggles vote, prevents duplicate voting)
  const handleVoteComment = async (commentId: string, action: "upvote" | "downvote") => {
    const currentVote = userCommentVotes[commentId];
    let nextVote: "upvote" | "downvote" | null = action;
    let likesDelta = 0;
    let dislikesDelta = 0;

    if (currentVote === action) {
      // Toggle off!
      nextVote = null;
      if (action === "upvote") likesDelta = -1;
      else dislikesDelta = -1;
    } else if (currentVote && currentVote !== action) {
      // Switch vote!
      if (action === "upvote") {
        likesDelta = 1;
        dislikesDelta = -1;
      } else {
        dislikesDelta = 1;
        likesDelta = -1;
      }
    } else {
      // New vote!
      if (action === "upvote") likesDelta = 1;
      else dislikesDelta = 1;
    }

    // Optimistic UI updates
    setStoredCommentVote(commentId, nextVote);
    setUserCommentVotes((prev) => {
      const copy = { ...prev };
      if (nextVote) copy[commentId] = nextVote;
      else delete copy[commentId];
      return copy;
    });

    const updateCommentVoteInTree = (list: DiscussionCommentItem[]): DiscussionCommentItem[] => {
      return list.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            likesCount: Math.max(0, (c.likesCount || 0) + likesDelta),
            dislikesCount: Math.max(0, (c.dislikesCount || 0) + dislikesDelta),
          };
        }
        if (c.replies?.length) {
          return { ...c, replies: updateCommentVoteInTree(c.replies) };
        }
        return c;
      });
    };
    setComments((prev) => updateCommentVoteInTree(prev));

    try {
      const res = await fetch(`/api/discussions/${post.id}/comments`, {
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
          const syncServerVotes = (list: DiscussionCommentItem[]): DiscussionCommentItem[] => {
            return list.map((c) => {
              if (c.id === commentId) {
                return { ...c, likesCount: data.likesCount, dislikesCount: data.dislikesCount };
              }
              if (c.replies?.length) {
                return { ...c, replies: syncServerVotes(c.replies) };
              }
              return c;
            });
          };
          setComments((prev) => syncServerVotes(prev));
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

  const isAuthor = Boolean(
    currentUserId && (
      (post.userId && (currentUserId === post.userId || post.userId.trim() === currentUserId.trim())) ||
      (currentUser?.displayName && post.authorName && currentUser.displayName.trim().toLowerCase() === post.authorName.trim().toLowerCase())
    )
  );

  return (
    <article
      ref={containerRef}
      id={post.id}
      className="w-full bg-card border border-border/70 rounded-2xl p-3.5 sm:p-4.5 shadow-2xs hover:border-border transition-colors flex gap-3 sm:gap-3.5 group/card"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Profile Image Column (Left) */}
      <div className="shrink-0 pt-0.5">
        <UserAvatar
          src={post.avatarUrl}
          name={post.authorName}
          size={40}
          className="size-10 rounded-full object-cover shrink-0 ring-1 ring-border/50"
        />
      </div>

      {/* Main Content Column (Right) */}
      <div className="flex-1 min-w-0 space-y-2.5">
        {/* Header (Author, Badge, Handle, Date, Category, 3-dots) */}
        <div className="flex items-start justify-between gap-1">
          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            <span className="font-bold text-foreground text-sm sm:text-[15px] hover:underline cursor-pointer truncate">
              {post.authorName}
            </span>
            {/* Twitter Verified Checkmark */}
            <svg viewBox="0 0 22 22" aria-label="Verified account" className="w-4 h-4 fill-[#1d9bf0] shrink-0">
              <g>
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
              </g>
            </svg>
            <span className="text-muted-foreground text-xs truncate">
              {post.authorHandle || (post.authorEmail ? `@${post.authorEmail.split("@")[0]}` : `@${post.authorName.toLowerCase().replace(/\s+/g, "")}`)}
            </span>
            <span className="text-muted-foreground/60 text-xs">·</span>
            <span className="text-muted-foreground hover:underline cursor-pointer text-xs shrink-0">
              {formatRelativeTime(post.createdAt)}
            </span>
            {post.category && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0 ml-1">
                {post.category}
              </span>
            )}
          </div>

          {/* Three-Dot Menu (More Options: Edit, Delete, Copy Link, Bookmark, Report) */}
          <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-full transition-colors cursor-pointer"
            title="More options"
          >
            <MoreHorizontal className="size-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-card/95 backdrop-blur-md border border-border/80 rounded-xl shadow-lg p-1 z-30 divide-y divide-border/40 animate-in fade-in zoom-in-95 duration-100">
              {isAuthor && (
                <div className="p-0.5 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setEditImages(getPostImages(postData));
                      setEditTitle(postData.title || "");
                      setEditContent(postData.content);
                      setEditCategory(postData.category);
                      setEditTags(postData.tags?.join(", ") || "");
                      setIsEditing(true);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer font-medium"
                  >
                    <Pencil className="size-3.5 text-blue-500" />
                    <span>Edit Post</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleDeletePost();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer font-medium"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Delete Post</span>
                  </button>
                </div>
              )}

              <div className="p-0.5 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleShare();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                >
                  <Link2 className="size-3.5" />
                  <span>Copy Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleToggleBookmark();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                >
                  <Bookmark className="size-3.5" />
                  <span>{bookmarked ? "Remove Bookmark" : "Bookmark Post"}</span>
                </button>

                {!isAuthor && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      toast.success("Post reported. Our moderation team will review this.");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Flag className="size-3.5" />
                    <span>Report Post</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Post Content (Direct In-Place Edit OR Normal View) */}
      {isEditing ? (
        <div className="space-y-3 pt-0.5">
          {/* Direct In-place Title Input */}
          <input
            type="text"
            placeholder="Post Title (optional)..."
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-transparent border-b border-border/60 focus:border-blue-500 text-base font-bold text-foreground tracking-tight px-0 py-1 focus:outline-none transition-colors placeholder:text-muted-foreground/60"
          />

          {/* Direct In-place Body Content Textarea */}
          <textarea
            ref={editTextareaRef}
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full bg-transparent text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none border-b border-border/40 focus:border-blue-500 px-0 py-1 resize-y min-h-[90px] transition-colors"
          />

          {/* Direct In-place Category & Tags Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-0.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              <span className="font-medium text-muted-foreground">Category:</span>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="text-xs bg-muted/60 hover:bg-muted border border-border/60 text-foreground rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer font-medium"
              >
                <option value="Discussion">Discussion</option>
                <option value="Study Guide">Study Guide</option>
                <option value="Events">Events</option>
                <option value="System Design">System Design</option>
                <option value="DSA Tips">DSA Tips</option>
                <option value="Career">Career</option>
                <option value="Showcase">Showcase</option>
              </select>
            </div>

            <div className="flex-1 flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-medium text-muted-foreground shrink-0">Tags:</span>
              <input
                type="text"
                placeholder="React, Nextjs, System Design..."
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="flex-1 bg-muted/40 border border-border/60 text-foreground rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500 min-w-0 placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {/* Hidden File Input for Image Upload */}
          <input
            ref={editFileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleEditImagesSelect}
            className="hidden"
          />

          {/* Direct In-place Attached Photos Grid with instant delete X button */}
          {editImages.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <ImageIcon className="size-3.5 text-blue-500" />
                  <span>Photos ({editImages.length}/10)</span>
                </span>
                {editImages.length < 10 && (
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    disabled={isUploadingEditImages}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="size-3.5" />
                    <span>Add photo</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-0.5">
                {editImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative aspect-video sm:aspect-square rounded-xl overflow-hidden border border-border/70 group bg-muted/20">
                    <img
                      src={imgUrl}
                      alt={`Photo ${idx + 1}`}
                      onClick={() => {
                        setLightboxIndex(idx);
                        setLightboxOpen(true);
                      }}
                      className="size-full object-cover cursor-pointer hover:scale-105 transition-transform"
                      title="Click to view full photo"
                    />
                    {/* Delete Photo X Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveEditImage(idx)}
                      className="absolute top-1.5 right-1.5 size-6 rounded-full bg-black/75 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md active:scale-90"
                      title="Remove photo"
                      aria-label="Remove photo"
                    >
                      <X className="size-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white font-medium">
                      {idx + 1}
                    </span>
                  </div>
                ))}
                {editImages.length < 10 && (
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    disabled={isUploadingEditImages}
                    className="aspect-video sm:aspect-square rounded-xl border-2 border-dashed border-border/80 hover:border-blue-500/60 bg-muted/20 hover:bg-muted/40 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
                    title="Add another photo"
                  >
                    {isUploadingEditImages ? (
                      <Loader2 className="size-4 animate-spin text-blue-500" />
                    ) : (
                      <>
                        <Plus className="size-4 text-blue-500" />
                        <span className="text-[10px] font-semibold">Add Photo</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* In-place Edit Action Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <div className="flex items-center gap-1.5">
              {editImages.length < 10 && (
                <button
                  type="button"
                  onClick={() => editFileInputRef.current?.click()}
                  disabled={isUploadingEditImages}
                  className="px-2.5 py-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 text-xs font-medium active:scale-95"
                  title="Add photos"
                >
                  {isUploadingEditImages ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ImageIcon className="size-4" />
                  )}
                  <span>{editImages.length === 0 ? "Add Photo" : "Add More"}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(postData.title || "");
                  setEditContent(postData.content);
                  setEditImages(getPostImages(postData));
                }}
                className="text-xs font-medium px-4 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSavingEdit || !editContent.trim()}
                className="text-xs font-semibold px-5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                {isSavingEdit ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Post Title */}
          {postData.title && (
            <h2 className="text-base font-bold text-foreground tracking-tight hover:text-blue-600 transition-colors cursor-pointer leading-snug">
              {renderInlineMarkdown(postData.title)}
            </h2>
          )}

          {/* Rich Markdown Content with LinkedIn-style ...more / see less */}
          <ExpandablePostContent content={postData.content} />

          {/* Post Images Gallery (1-10 Images with LinkedIn-style Grid) */}
          <PostImageGallery
            images={getPostImages(postData)}
            onImageClick={(idx) => {
              setLightboxIndex(idx);
              setLightboxOpen(true);
            }}
          />

          {/* Tags */}
          {postData.tags && postData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {postData.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagClick(tag)}
                  className="text-xs font-medium px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* 6. Actions Bar (Reply, Like with GSAP, Bookmark, Share) - Only when NOT editing */}
      {!isEditing && (
        <div className="flex items-center justify-between w-full pt-2 border-t border-border/40 text-muted-foreground">
        {/* Reply / Comment */}
        <button
          onClick={handleToggleComments}
          className={`group/action flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
            commentsOpen ? "text-[#1d9bf0]" : "hover:text-[#1d9bf0]"
          }`}
          type="button"
          title="Reply"
        >
          <div className="p-2 -m-1 rounded-full group-hover/action:bg-[#1d9bf0]/10 transition-colors">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current">
              <g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g>
            </svg>
          </div>
          {commentsCount > 0 && (
            <span className="font-normal text-xs">{formatNumber(commentsCount)}</span>
          )}
        </button>

        {/* Like (GSAP Animated) */}
        <button
          onClick={handleToggleLike}
          className={`group/action flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
            liked ? "text-[#f91880]" : "hover:text-[#f91880]"
          }`}
          type="button"
          title="Like"
        >
          <div className="p-2 -m-1 rounded-full group-hover/action:bg-[#f91880]/10 transition-colors">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="w-[18px] h-[18px] fill-current"
              style={{ transformOrigin: "center center" }}
            >
              {liked ? (
                <g><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g>
              ) : (
                <g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g>
              )}
            </svg>
          </div>
          {likesCount > 0 && (
            <span className="font-normal text-xs">{formatNumber(likesCount)}</span>
          )}
        </button>

        {/* Analytics / Views (Image 2 Twitter-style Bar Chart) */}
        <div
          className="group/action flex items-center gap-1.5 text-xs transition-colors hover:text-[#1d9bf0] cursor-default"
          title={`${viewsCount} Views`}
        >
          <div className="p-2 -m-1 rounded-full group-hover/action:bg-[#1d9bf0]/10 transition-colors">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current">
              <g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g>
            </svg>
          </div>
          <span className="font-normal text-xs">{formatNumber(viewsCount)}</span>
        </div>

        {/* Bookmark & Share Tray */}
        <div className="flex items-center gap-0.5">
          {/* Bookmark */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleBookmark();
            }}
            className={`group/action transition-colors cursor-pointer ${
              bookmarked ? "text-[#1d9bf0]" : "hover:text-[#1d9bf0]"
            }`}
            type="button"
            title="Bookmark"
          >
            <div className="p-2 -m-1 rounded-full group-hover/action:bg-[#1d9bf0]/10 transition-colors">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-[18px] h-[18px] fill-current"
              >
                {bookmarked ? (
                  <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path>
                ) : (
                  <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
                )}
              </svg>
            </div>
          </button>

          {/* Share */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="group/action hover:text-[#1d9bf0] transition-colors cursor-pointer"
            type="button"
            title="Share"
          >
            <div className="p-2 -m-1 rounded-full group-hover/action:bg-[#1d9bf0]/10 transition-colors">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current">
                <g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></g>
              </svg>
            </div>
          </button>
        </div>
      </div>
      )}

      {/* ======================================================== */}
      {/* 7. THREADED COMMENTS SECTION                             */}
      {/* ======================================================== */}
      {commentsOpen && (
        <div className="pt-4 mt-3 border-t border-border/60 space-y-5">
          
          {/* Comment Input Box */}
          <div className="flex items-start gap-3">
            <UserAvatar
              src={currentUser?.photoURL}
              name={currentUser?.displayName || "You"}
              size={36}
            />

            <div className="flex-1 bg-muted/40 border border-border/70 rounded-2xl p-3 focus-within:border-blue-500/50 transition-all space-y-2.5">
              <textarea
                ref={commentTextareaRef}
                placeholder="Add a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                rows={2}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none leading-relaxed"
              />

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/30">
                {newCommentText.trim() && (
                  <button
                    type="button"
                    onClick={() => setNewCommentText("")}
                    className="text-xs text-muted-foreground hover:text-foreground font-medium px-3 py-1 rounded-full hover:bg-muted transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleAddComment}
                  disabled={isSubmittingComment || !newCommentText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold px-5 py-1.5 rounded-full transition-all shadow-xs cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  {isSubmittingComment ? (
                    <>
                      <Loader2 className="size-3 animate-spin" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <span>Comment</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Comments Count & Sort Header */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-foreground">Comments</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {commentsCount}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setCommentSort((s) => (s === "recent" ? "popular" : "recent"))}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium cursor-pointer"
            >
              <SlidersHorizontal className="size-3" />
              <span>{commentSort === "recent" ? "Recent" : "Popular"}</span>
              <ChevronDown className="size-3" />
            </button>
          </div>

          {/* Threaded Comment Items with Tree Branch Lines */}
          {commentsLoading ? (
            <div className="py-4 flex justify-center text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No comments yet. Start the conversation!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((rootComment) => (
                <ThreadedCommentRow
                  key={rootComment.id}
                  comment={rootComment}
                  userVotes={userCommentVotes}
                  onVote={handleVoteComment}
                  replyingToId={replyingToId}
                  onStartReply={(id, mentionName) => {
                    setReplyingToId(id);
                    setReplyText(mentionName ? `@${mentionName.trim()} ` : "");
                  }}
                  onCancelReply={() => {
                    setReplyingToId(null);
                    setReplyText("");
                  }}
                  replyText={replyText}
                  onReplyTextChange={setReplyText}
                  onSubmitReply={handleAddReply}
                  isSubmittingReply={isSubmittingReply}
                  onDeleteComment={handleDeleteComment}
                  onEditComment={handleEditComment}
                  currentUserId={currentUserId}
                  currentUserName={currentUser?.displayName || undefined}
                  postAuthorId={post.userId || undefined}
                />
              ))}
            </div>
          )}
        </div>
      )}
      </div>

      {/* Custom In-App Delete Confirmation Modal (Using HeroUI Card pattern) */}
      {deleteModalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => !isDeletingTarget && setDeleteModalState((s) => ({ ...s, isOpen: false }))}
          />
          <div className="relative z-10 w-full max-w-[400px] animate-in zoom-in-95 duration-200">
            <HeroCard className="w-full sm:w-[400px]">
              <div className="size-11 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center justify-center shadow-2xs">
                <Trash2 aria-label="Delete confirmation icon" className="size-5.5 text-red-600 dark:text-red-400" role="img" />
              </div>
              <HeroCard.Header>
                <HeroCard.Title>
                  {deleteModalState.type === "post" ? "Delete Discussion Post" : "Delete Comment"}
                </HeroCard.Title>
                <HeroCard.Description>
                  {deleteModalState.type === "post"
                    ? "Are you sure you want to delete this discussion and all of its comments? This action is permanent."
                    : "Are you sure you want to permanently delete this comment and its replies? This action cannot be undone."}
                </HeroCard.Description>
              </HeroCard.Header>
              <HeroCard.Footer>
                <button
                  type="button"
                  disabled={isDeletingTarget}
                  onClick={() => setDeleteModalState((s) => ({ ...s, isOpen: false }))}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all border border-border/70 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isDeletingTarget}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-red-600/25 cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  {isDeletingTarget ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-3.5" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </HeroCard.Footer>
            </HeroCard>
          </div>
        </div>
      )}

      {/* LinkedIn-style Fullscreen Image Lightbox Modal */}
      <ImageLightbox
        images={isEditing ? editImages : getPostImages(postData)}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onChangeIndex={(idx) => setLightboxIndex(idx)}
      />
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Comment Three-Dot Menu Component                                  */
/* ------------------------------------------------------------------ */

interface CommentMenuProps {
  commentId?: string;
  content: string;
  isAuthor: boolean;
  canDelete: boolean;
  onStartEdit: () => void;
  onDelete: () => void;
}

function CommentMenu({
  content,
  isAuthor,
  canDelete,
  onStartEdit,
  onDelete,
}: CommentMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted/70 rounded-full transition-colors cursor-pointer"
        title="More options"
      >
        <MoreHorizontal className="size-3.5" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-card/95 backdrop-blur-md border border-border/80 rounded-xl shadow-lg p-1 z-30 divide-y divide-border/40 animate-in fade-in zoom-in-95 duration-100">
          {(isAuthor || canDelete) && (
            <div className="p-0.5 space-y-0.5">
              {isAuthor && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onStartEdit();
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1 text-xs text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer font-medium"
                >
                  <Pencil className="size-3 text-blue-500" />
                  <span>Edit</span>
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer font-medium"
                >
                  <Trash2 className="size-3" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          )}

          <div className="p-0.5 space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigator.clipboard.writeText(content);
                toast.success("Comment copied to clipboard!");
              }}
              className="w-full flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
            >
              <Copy className="size-3" />
              <span>Copy Text</span>
            </button>

            {!isAuthor && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  toast.success("Comment reported to moderation team");
                }}
                className="w-full flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <Flag className="size-3" />
                <span>Report</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Threaded Comment Row (Root + Nested Replies)                      */
/* ------------------------------------------------------------------ */

interface ThreadedCommentRowProps {
  comment: DiscussionCommentItem;
  depth?: number;
  userVotes?: Record<string, "upvote" | "downvote">;
  onVote: (commentId: string, action: "upvote" | "downvote") => void;
  replyingToId: string | null;
  onStartReply: (id: string, mentionName?: string) => void;
  onCancelReply: () => void;
  replyText: string;
  onReplyTextChange: (val: string) => void;
  onSubmitReply: (parentId: string) => void;
  isSubmittingReply: boolean;
  onDeleteComment: (commentId: string) => void;
  onEditComment: (commentId: string, newContent: string) => Promise<boolean>;
  currentUserId?: string | null;
  currentUserName?: string | null;
  postAuthorId?: string | null;
}

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
  onDeleteComment,
  onEditComment,
  currentUserId,
  currentUserName,
  postAuthorId,
}: ThreadedCommentRowProps) {
  const [repliesExpanded, setRepliesExpanded] = useState(true);
  const hasReplies = Boolean(comment.replies && comment.replies.length > 0);
  const isReplyingThis = replyingToId === comment.id;

  // Inline editing state for this comment
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);

  // Author & permissions
  const isAuthor = Boolean(
    currentUserId && (
      (comment.author?.id && (comment.author.id === currentUserId || comment.author.id.trim() === currentUserId.trim())) ||
      (currentUserName && comment.author?.name && currentUserName.trim().toLowerCase() === comment.author.name.trim().toLowerCase())
    )
  );
  const canDelete = isAuthor || Boolean(postAuthorId && currentUserId && postAuthorId === currentUserId);

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    setIsSaving(true);
    const ok = await onEditComment(comment.id, editText.trim());
    setIsSaving(false);
    if (ok) {
      setIsEditing(false);
    }
  };

  return (
    <div className={depth === 0 ? "space-y-3" : "space-y-2"}>
      {/* Comment Header + Content + Actions */}
      <div className="flex items-start gap-2.5 sm:gap-3">
        <UserAvatar
          src={comment.author?.avatarUrl}
          name={comment.author?.name}
          size={depth === 0 ? 32 : 26}
        />

        <div className="flex-1 min-w-0 space-y-1">
          {/* Header with name, time, and menu */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs min-w-0">
              <span className="font-bold text-foreground truncate">{comment.author?.name}</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-muted-foreground">{formatRelativeTime(comment.createdAt)}</span>
            </div>

            <CommentMenu
              commentId={comment.id}
              content={comment.content}
              isAuthor={isAuthor}
              canDelete={canDelete}
              onStartEdit={() => {
                setEditText(comment.content);
                setIsEditing(true);
              }}
              onDelete={() => onDeleteComment(comment.id)}
            />
          </div>

          {/* Inline Edit Form OR Markdown Viewer */}
          {isEditing ? (
            <div className="space-y-2 bg-muted/40 border border-border/70 rounded-xl p-2.5 mt-1">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                className="w-full bg-transparent px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none resize-y min-h-[44px]"
                placeholder="Edit comment..."
              />
              <div className="flex items-center justify-between pt-1 border-t border-border/40">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditText((t) => (t ? `**${t}**` : "**bold**"))}
                    className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                    title="Bold"
                  >
                    <Bold className="size-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditText((t) => (t ? `*${t}*` : "*italic*"))}
                    className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                    title="Italic"
                  >
                    <Italic className="size-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditText((t) => (t ? `\`${t}\`` : "`code`"))}
                    className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer font-mono"
                    title="Code"
                  >
                    <Code className="size-3" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground rounded-lg cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={isSaving || !editText.trim()}
                    className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full disabled:opacity-50 hover:bg-blue-700 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    {isSaving ? <Loader2 className="size-3 animate-spin" /> : "Save"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <MarkdownViewer content={comment.content} className={depth === 0 ? "text-xs sm:text-sm" : "text-xs"} />
          )}

          {/* Action Row */}
          <div className="flex items-center gap-3.5 pt-0.5 text-xs text-muted-foreground">
            {/* Thumbs Up / Down */}
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
                  userVotes?.[comment.id] === "upvote"
                    ? "fill-blue-600 dark:fill-blue-400 text-blue-600 dark:text-blue-400"
                    : ""
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
                  userVotes?.[comment.id] === "downvote"
                    ? "fill-red-500 dark:fill-red-400 text-red-500 dark:text-red-400"
                    : ""
                }`}
              />
              <span>{comment.dislikesCount}</span>
            </button>

            {/* Reply Button (ALWAYS present, pre-fills author mention!) */}
            <button
              type="button"
              onClick={() => onStartReply(comment.id, comment.author?.name)}
              className="font-medium hover:text-blue-600 transition-colors cursor-pointer text-[11px] sm:text-xs flex items-center gap-1"
            >
              Reply
            </button>

            {/* Expand / Collapse Replies Button if this comment has replies */}
            {hasReplies && (
              <button
                type="button"
                onClick={() => setRepliesExpanded(!repliesExpanded)}
                className="flex items-center gap-1 font-semibold text-foreground hover:text-blue-600 transition-colors cursor-pointer text-[11px] sm:text-xs"
              >
                <span>Replies ({comment.replies.length})</span>
                {repliesExpanded ? (
                  <ChevronUp className="size-3" />
                ) : (
                  <ChevronDown className="size-3" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inline Reply Input Box: Opens directly under THIS comment/reply */}
      {isReplyingThis && (
        <div className="ml-1 sm:ml-8 bg-muted/40 border border-border/70 rounded-xl p-2.5 space-y-2 mt-1.5 animate-in fade-in zoom-in-95 duration-100">
          <input
            type="text"
            autoFocus
            ref={(input) => {
              if (input) {
                const len = input.value.length;
                input.setSelectionRange(len, len);
              }
            }}
            placeholder={`Reply to ${comment.author?.name || "user"}...`}
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
              className="bg-blue-600 text-white text-xs font-semibold px-3.5 py-1 rounded-full disabled:opacity-50 hover:bg-blue-700 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            >
              {isSubmittingReply ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "Reply"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Recursive Nested Replies with Connected Tree Branch Line */}
      {hasReplies && repliesExpanded && (
        <div className={`relative ${depth >= 2 ? "pl-2 sm:pl-3.5 ml-1 sm:ml-2.5" : "pl-3 sm:pl-6 ml-1.5 sm:ml-4"} border-l-2 border-border/70 space-y-3 pt-1.5`}>
          {comment.replies.map((childReply) => (
            <ThreadedCommentRow
              key={childReply.id}
              comment={childReply}
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
              onDeleteComment={onDeleteComment}
              onEditComment={onEditComment}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              postAuthorId={postAuthorId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
