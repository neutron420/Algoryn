"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  RiCloseLine,
  RiCompass3Line,
  RiDraftLine,
  RiAddFill,
  RiCheckFill,
} from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";

const emptySubscribe = () => () => {};

export type NoteWorkspaceModeType = "INFINITE_CANVAS" | "DOCUMENT_NOTE" | "FIXED_WHITEBOARD";

interface CreateNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, mode: NoteWorkspaceModeType) => Promise<void>;
}

export function CreateNoteDialog({ isOpen, onClose, onCreate }: CreateNoteDialogProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<NoteWorkspaceModeType>("INFINITE_CANVAS");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || (mode === "INFINITE_CANVAS" ? "Infinite Canvas Note" : "Document Note");
    setSubmitting(true);
    try {
      await onCreate(finalTitle, mode);
      setTitle("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg max-h-[calc(100svh-2rem)] overflow-y-auto rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] p-4 sm:p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 overscroll-contain">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/80">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
              Create New Workspace
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Choose between an Infinite Canvas or a Document Note
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <RiCloseLine className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              Title
            </label>
            <Input
              size="small"
              placeholder="e.g. Distributed Cache Design, Sliding Window Notes..."
              value={title}
              onChange={(v) => setTitle(v)}
              className="w-full"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
              Workspace Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Infinite Canvas */}
              <button
                type="button"
                onClick={() => setMode("INFINITE_CANVAS")}
                className={cx(
                  "flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer relative",
                  mode === "INFINITE_CANVAS"
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs ring-1 ring-blue-500"
                    : "border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/50"
                )}
              >
                {mode === "INFINITE_CANVAS" && (
                  <span className="absolute top-2.5 right-2.5 size-4 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    <RiCheckFill className="size-3" />
                  </span>
                )}
                <div className="size-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                  <RiCompass3Line className="size-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                  Infinite Canvas
                </span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug">
                  Boundless drawing workspace with Excalidraw, mind maps, arrows, shapes & diagrams.
                </span>
              </button>

              {/* Option 2: Document Note */}
              <button
                type="button"
                onClick={() => setMode("DOCUMENT_NOTE")}
                className={cx(
                  "flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer relative",
                  mode === "DOCUMENT_NOTE" || mode === "FIXED_WHITEBOARD"
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs ring-1 ring-emerald-500"
                    : "border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/50"
                )}
              >
                {(mode === "DOCUMENT_NOTE" || mode === "FIXED_WHITEBOARD") && (
                  <span className="absolute top-2.5 right-2.5 size-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <RiCheckFill className="size-3" />
                  </span>
                )}
                <div className="size-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                  <RiDraftLine className="size-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                  Document Note
                </span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug">
                  Notion-style block notes powered by BlockNote.js with headings, code blocks, lists & checklists.
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="small"
              disabled={submitting}
              className="flex items-center gap-1.5"
            >
              <RiAddFill className="size-4" />
              <span>
                {submitting
                  ? "Creating..."
                  : mode === "INFINITE_CANVAS"
                  ? "Create Canvas"
                  : "Create Note"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
