"use client";

import Link from "next/link";
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

export function NoteCard({ note, onDelete, onRename }: NoteCardProps) {
  const isInfinite = note.mode === "INFINITE_CANVAS";

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] p-4 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Decorative Canvas / Note Preview Header */}
      <Link
        href={`/dashboard/notes/${note.id}`}
        className="block relative h-28 w-full rounded-xl overflow-hidden mb-3 border border-slate-100 dark:border-zinc-800/60 transition-colors"
      >
        <div
          className={cx(
            "absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
            isInfinite
              ? "bg-linear-to-br from-blue-50/70 via-slate-50 to-indigo-50/50 dark:from-blue-950/20 dark:via-zinc-900/40 dark:to-indigo-950/20"
              : "bg-linear-to-br from-emerald-50/70 via-slate-50 to-teal-50/50 dark:from-emerald-950/20 dark:via-zinc-900/40 dark:to-teal-950/20"
          )}
        >
          {/* Subtle Grid Background Pattern */}
          <div
            className="absolute inset-0 opacity-20 dark:opacity-10"
            style={{
              backgroundImage: isInfinite
                ? "radial-gradient(#64748b 1px, transparent 1px)"
                : "radial-gradient(#10b981 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />

          <div className="size-10 rounded-xl bg-white/90 dark:bg-zinc-800/90 shadow-sm flex items-center justify-center text-slate-700 dark:text-zinc-200 z-10">
            {isInfinite ? (
              <RiCompass3Line className="size-5 text-blue-500" />
            ) : (
              <RiDraftLine className="size-5 text-emerald-500" />
            )}
          </div>
        </div>

        {/* Floating Open Hover Button */}
        <span className="absolute top-2 right-2 size-6 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
