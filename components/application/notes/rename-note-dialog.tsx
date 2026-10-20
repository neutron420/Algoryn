"use client";

import { useState } from "react";
import { RiPencilLine, RiCloseLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

interface RenameNoteDialogProps {
  isOpen: boolean;
  currentTitle: string;
  onClose: () => void;
  onConfirm: (newTitle: string) => Promise<void>;
}

function RenameNoteForm({
  currentTitle,
  onClose,
  onConfirm,
}: {
  currentTitle: string;
  onClose: () => void;
  onConfirm: (newTitle: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(currentTitle);
  const [renaming, setRenaming] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim() === currentTitle) {
      onClose();
      return;
    }
    setRenaming(true);
    try {
      await onConfirm(title.trim());
      onClose();
    } finally {
      setRenaming(false);
    }
  };

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] p-4 sm:p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
      <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <RiPencilLine className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
              Rename Note
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Update the title of your workspace
            </p>
          </div>
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
            placeholder="e.g. Redis Caching Patterns, Graph Traversal..."
            value={title}
            onChange={(v) => setTitle(v)}
            className="w-full"
            autoFocus
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={onClose}
            disabled={renaming}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="small"
            disabled={renaming || !title.trim() || title.trim() === currentTitle}
          >
            {renaming ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function RenameNoteDialog({
  isOpen,
  currentTitle,
  onClose,
  onConfirm,
}: RenameNoteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <RenameNoteForm
        key={currentTitle}
        currentTitle={currentTitle}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    </div>
  );
}
