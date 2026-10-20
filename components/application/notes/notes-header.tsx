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
  onBack?: () => void;
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
  onBack,
  onManualSave,
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
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="size-9 sm:size-8 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
            title="Back to all notes"
          >
            <RiArrowLeftLine className="size-4" />
          </button>
        ) : (
          <Link
            href="/dashboard/notes"
            className="size-9 sm:size-8 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
            title="Back to all notes"
          >
            <RiArrowLeftLine className="size-4" />
          </Link>
        )}

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
              <RiPencilLine className="size-3 text-slate-400 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0" />
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
        {/* Autosave Status Interactive Pill */}
        <button
          type="button"
          onClick={onManualSave}
          disabled={saveStatus === "saving"}
          className={cx(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer select-none border",
            saveStatus === "saved" &&
              "bg-slate-100/90 dark:bg-zinc-800/90 text-slate-600 dark:text-zinc-300 border-slate-200/60 dark:border-zinc-700/60 hover:bg-slate-200/60 dark:hover:bg-zinc-700/60",
            saveStatus === "saving" &&
              "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-500/30",
            saveStatus === "unsaved" &&
              "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-500/40 hover:bg-amber-100 dark:hover:bg-amber-900/40",
            saveStatus === "error" &&
              "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-500/40 hover:bg-rose-100 dark:hover:bg-rose-900/40"
          )}
          title={
            saveStatus === "unsaved"
              ? "Unsaved changes • Click to save now"
              : saveStatus === "error"
              ? "Autosave error • Click to retry"
              : "Autosave active • All changes saved"
          }
        >
          {saveStatus === "saving" && (
            <>
              <RiLoader4Line className="size-3 text-blue-500 animate-spin shrink-0" />
              <span className="font-medium">Saving...</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-medium text-slate-500 dark:text-zinc-400">Saved</span>
            </>
          )}
          {saveStatus === "unsaved" && (
            <>
              <span className="size-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
              <span className="font-semibold">Save</span>
            </>
          )}
          {saveStatus === "error" && (
            <>
              <span className="size-1.5 rounded-full bg-rose-500 shrink-0" />
              <span className="font-semibold">Retry</span>
            </>
          )}
        </button>

        {/* Clear workspace */}
        {onClearCanvas && (
          <button
            type="button"
            onClick={onClearCanvas}
            aria-label="Clear workspace"
            title={isInfinite ? "Clear canvas" : "Clear document"}
            className="size-9 sm:size-8 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer hidden md:flex"
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
            className="size-9 sm:size-8 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
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
            className="size-9 sm:size-8 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
          >
            <RiDeleteBinLine className="size-4" />
          </button>
        )}
      </div>
    </header>
  );
}
