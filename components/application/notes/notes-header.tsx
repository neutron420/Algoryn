"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  RiArrowLeftLine,
  RiCompass3Line,
  RiDeleteBinLine,
  RiDownload2Line,
  RiEraserLine,
  RiDraftLine,
  RiLoader4Line,
  RiPencilLine,
} from "@remixicon/react";
import { Badge } from "@/components/base/badges/badge";
import { cx } from "@/utils/cx";

export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

interface NotesHeaderProps {
  title: string;
  mode: "INFINITE_CANVAS" | "FIXED_WHITEBOARD" | "DOCUMENT_NOTE";
  saveStatus: SaveStatus;
  onRename: (newTitle: string) => void;
  onManualSave?: () => void;
  onClearCanvas?: () => void;
  onExport?: (format: string) => void;
  onDelete?: () => void;
}

export function NotesHeader({
  title,
  mode,
  saveStatus,
  onRename,
  onClearCanvas,
  onExport,
  onDelete,
}: NotesHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const isInfinite = mode === "INFINITE_CANVAS";

  const handleCommitTitle = () => {
    setIsEditingTitle(false);
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== title) {
      onRename(trimmed);
    } else {
      setTitleValue(title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommitTitle();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
      setTitleValue(title);
    }
  };

  return (
    <header className="h-14 w-full px-3 sm:px-5 flex items-center justify-between gap-3 border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#0c101c]/80 backdrop-blur-md z-20 shrink-0">
      {/* Left: Navigation and Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link
          href="/dashboard/notes"
          className="size-8 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          title="Back to all notes"
        >
          <RiArrowLeftLine className="size-4" />
        </Link>

        <div className="flex items-center gap-2 min-w-0">
          {isEditingTitle ? (
            <input
              ref={inputRef}
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleCommitTitle}
              onKeyDown={handleKeyDown}
              className="text-xs sm:text-sm font-bold bg-slate-100 dark:bg-zinc-800 border border-blue-500 rounded px-1.5 py-0.5 text-slate-900 dark:text-zinc-100 outline-none w-44 sm:w-64 max-w-full"
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsEditingTitle(true);
                setTitleValue(title);
              }}
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[160px] xs:max-w-[220px] sm:max-w-xs md:max-w-md text-left cursor-pointer"
              title="Click to rename"
            >
              <span className="truncate">{title}</span>
              <RiPencilLine className="size-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          )}

          <Badge
            color={isInfinite ? "primary" : "neutral"}
            className={cx(
              "hidden sm:inline-flex text-[10px] px-1.5 py-0.5 shrink-0 font-medium",
              !isInfinite && "!bg-emerald-500/15 !text-emerald-600 dark:!text-emerald-400 border border-emerald-500/20"
            )}
          >
            {isInfinite ? (
              <span className="flex items-center gap-1">
                <RiCompass3Line className="size-3" />
                Canvas
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <RiDraftLine className="size-3" />
                Note
              </span>
            )}
          </Badge>
        </div>
      </div>

      {/* Right: Autosave status & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Autosave Status Pill */}
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100/70 dark:bg-zinc-800/60 text-[11px] font-medium"
          title={`Autosave status: ${saveStatus}`}
        >
          {saveStatus === "saving" && (
            <>
              <RiLoader4Line className="size-3 text-blue-500 animate-spin" />
              <span className="text-slate-500 dark:text-zinc-400 hidden xs:inline">Saving...</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-slate-500 dark:text-zinc-400 hidden xs:inline">Saved</span>
            </>
          )}
          {saveStatus === "unsaved" && (
            <>
              <span className="size-2 rounded-full bg-amber-500 shrink-0" />
              <span className="text-slate-500 dark:text-zinc-400 hidden xs:inline">Unsaved</span>
            </>
          )}
          {saveStatus === "error" && (
            <>
              <span className="size-2 rounded-full bg-rose-500 shrink-0" />
              <span className="text-rose-600 dark:text-rose-400 hidden xs:inline">Save error</span>
            </>
          )}
        </div>

        {/* Clear workspace */}
        {onClearCanvas && (
          <button
            type="button"
            onClick={onClearCanvas}
            aria-label="Clear workspace"
            title={isInfinite ? "Clear canvas" : "Clear document"}
            className="p-1.5 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer hidden md:flex"
          >
            <RiEraserLine className="size-4" />
          </button>
        )}

        {/* Export document/image */}
        {onExport && (
          <button
            type="button"
            onClick={() => onExport(isInfinite ? "png" : "markdown")}
            aria-label={isInfinite ? "Export canvas image" : "Export markdown"}
            title={isInfinite ? "Export as PNG image" : "Export as Markdown (.md)"}
            className="p-1.5 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <RiDownload2Line className="size-4" />
          </button>
        )}

        {/* Delete button */}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete note"
            title="Delete this note"
            className="p-1.5 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
          >
            <RiDeleteBinLine className="size-4" />
          </button>
        )}
      </div>
    </header>
  );
}
