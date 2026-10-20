"use client";

import { useState } from "react";
import { RiDeleteBinLine, RiCloseLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";

interface DeleteNoteDialogProps {
  isOpen: boolean;
  noteTitle: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteNoteDialog({
  isOpen,
  noteTitle,
  onClose,
  onConfirm,
}: DeleteNoteDialogProps) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] p-4 sm:p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <RiDeleteBinLine className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                Delete Note
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                This action cannot be undone
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

        <div className="py-4 text-sm text-slate-600 dark:text-zinc-300">
          Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-white">&ldquo;{noteTitle}&rdquo;</span>? All blocks and canvas elements will be permanently removed.
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="small"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
