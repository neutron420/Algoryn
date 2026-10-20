"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  RiCompass3Line,
  RiDraftLine,
  RiDeleteBinLine,
  RiPencilLine,
  RiArrowRightUpLine,
} from "@remixicon/react";
import { Badge } from "@/components/base/badges/badge";
import { cx } from "@/utils/cx";

export interface NoteCardItem {
  id: string;
  title: string;
  mode: "INFINITE_CANVAS" | "FIXED_WHITEBOARD" | "DOCUMENT_NOTE";
  elements?: unknown;
  thumbnailUrl?: string | null;
  updatedAt: string;
  createdAt: string;
}

interface NoteCardProps {
  note: NoteCardItem;
  onDelete: (id: string) => void;
  onRename: (id: string, currentTitle: string) => void;
}

function formatRelativeTime(dateString: string): string {
  try {
    const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateString).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

function extractDocumentSnippet(elements: unknown): { title?: string; body?: string } {
  if (!Array.isArray(elements) || elements.length === 0) return {};
  const texts: string[] = [];
  for (const block of elements) {
    if (!block || typeof block !== "object") continue;
    let blockText = "";
    const b = block as { content?: unknown };
    if (Array.isArray(b.content)) {
      blockText = b.content
        .map((c: unknown) => {
          if (typeof c === "string") return c;
          if (c && typeof c === "object" && "text" in c) {
            return String((c as { text: unknown }).text || "");
          }
          return "";
        })
        .join("")
        .trim();
    } else if (typeof b.content === "string") {
      blockText = b.content.trim();
    }
    if (blockText) texts.push(blockText);
    if (texts.length >= 3) break;
  }
  return {
    title: texts[0] || undefined,
    body: texts.slice(1).join(" • ") || undefined,
  };
}

function extractCanvasSummary(elements: unknown): { count: number; labels: string[] } {
  if (!Array.isArray(elements) || elements.length === 0) return { count: 0, labels: [] };
  const labels: string[] = [];
  for (const el of elements) {
    if (el && typeof el === "object" && "type" in el && "text" in el) {
      const item = el as { type: unknown; text: unknown };
      if (item.type === "text" && typeof item.text === "string" && item.text.trim()) {
        labels.push(item.text.trim());
        if (labels.length >= 2) break;
      }
    }
  }
  return {
    count: elements.length,
    labels,
  };
}

export function NoteCard({ note, onDelete, onRename }: NoteCardProps) {
  const isInfinite = note.mode === "INFINITE_CANVAS";

  const docSnippet = useMemo(() => {
    return isInfinite ? {} : extractDocumentSnippet(note.elements);
  }, [isInfinite, note.elements]);

  const canvasSummary = useMemo(() => {
    return isInfinite ? extractCanvasSummary(note.elements) : { count: 0, labels: [] };
  }, [isInfinite, note.elements]);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] p-4 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Decorative Canvas / Note Preview Header */}
      <Link
        href={`/dashboard/notes/${note.id}`}
        className="block relative h-28 w-full rounded-xl overflow-hidden mb-3 border border-slate-100 dark:border-zinc-800/60 transition-colors group/preview"
      >
        {isInfinite ? (
          /* Infinite Canvas Preview Box */
          <div className="absolute inset-0 p-3 bg-linear-to-b from-blue-50/40 via-slate-50 to-white dark:from-blue-950/20 dark:via-zinc-900/40 dark:to-[#0c101c] flex flex-col justify-between overflow-hidden">
            {/* Blueprint Grid Pattern */}
            <div
              className="absolute inset-0 opacity-25 dark:opacity-15 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
            />
            <div className="relative z-10 flex flex-col gap-1 overflow-hidden">
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                <RiCompass3Line className="size-3.5 shrink-0" />
                <span>Canvas Diagram</span>
              </div>
              {canvasSummary.labels.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {canvasSummary.labels.map((lbl, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 truncate max-w-[140px]"
                    >
                      {lbl}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 italic mt-0.5">
                  {canvasSummary.count > 0 ? `${canvasSummary.count} drawing objects` : "Empty canvas • Click to sketch..."}
                </p>
              )}
            </div>
            <div className="relative z-10 flex items-center justify-between text-[9px] text-slate-400 dark:text-zinc-500 pt-1 border-t border-slate-100 dark:border-zinc-800/60">
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-blue-500" />
                <span>Infinite canvas</span>
              </span>
              {canvasSummary.count > 0 && (
                <span className="font-mono text-[9px] font-medium text-slate-500 dark:text-zinc-400">
                  {canvasSummary.count} elements
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Document Note Live Text Preview Box */
          <div className="absolute inset-0 p-3 bg-linear-to-b from-slate-50/90 to-white dark:from-zinc-900/90 dark:to-[#0c101c] flex flex-col justify-between overflow-hidden">
            <div className="flex flex-col gap-1 overflow-hidden">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <RiDraftLine className="size-3.5 shrink-0" />
                <span className="truncate">{docSnippet.title || "Note Content"}</span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-zinc-300 line-clamp-2 leading-relaxed font-sans">
                {docSnippet.body || docSnippet.title ? (docSnippet.body || "...") : "Empty document • Click to start writing..."}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-slate-400 dark:text-zinc-500 pt-1 border-t border-slate-100 dark:border-zinc-800/60">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Rich block note</span>
            </div>
          </div>
        )}

        {/* Floating Open Hover Button */}
        <span className="absolute top-2 right-2 size-6 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-xs flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity z-20">
          <RiArrowRightUpLine className="size-3.5 text-slate-600 dark:text-zinc-300" />
        </span>
      </Link>

      {/* Note Info */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/dashboard/notes/${note.id}`}
            className="font-semibold text-sm text-slate-900 dark:text-zinc-100 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title={note.title}
          >
            {note.title}
          </Link>
          <Badge
            color={isInfinite ? "primary" : "neutral"}
            className={cx(
              "text-[10px] px-1.5 py-0.5 shrink-0 font-medium",
              !isInfinite && "!bg-emerald-500/15 !text-emerald-600 dark:!text-emerald-400 border border-emerald-500/20"
            )}
          >
            {isInfinite ? "Canvas" : "Note"}
          </Badge>
        </div>

        <span className="text-[11px] text-slate-400 dark:text-zinc-500">
          Edited {formatRelativeTime(note.updatedAt)}
        </span>
      </div>

      {/* Card Actions Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
        <Link
          href={`/dashboard/notes/${note.id}`}
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
        >
          {isInfinite ? "Open Canvas" : "Open Note"}
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onRename(note.id, note.title)}
            aria-label="Rename workspace"
            title="Rename workspace"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <RiPencilLine className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(note.id)}
            aria-label="Delete workspace"
            title="Delete workspace"
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
          >
            <RiDeleteBinLine className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
