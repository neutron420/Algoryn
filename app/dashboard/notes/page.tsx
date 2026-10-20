"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  RiAddFill,
  RiCompass3Line,
  RiDraftLine,
  RiLoader4Line,
  RiSearchLine,
} from "@remixicon/react";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/auth-context";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { NoteCard, type NoteCardItem } from "@/components/application/notes/note-card";
import { CreateNoteDialog, type NoteWorkspaceModeType } from "@/components/application/notes/create-note-dialog";
import { DeleteNoteDialog } from "@/components/application/notes/delete-note-dialog";
import { RenameNoteDialog } from "@/components/application/notes/rename-note-dialog";
import { cx } from "@/utils/cx";

type ModeFilter = "ALL" | "CANVAS" | "DOCUMENT";

export default function NotesDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [notes, setNotes] = useState<NoteCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("ALL");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ id: string; title: string } | null>(null);

  // Fetch user notes on auth ready
  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid) {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    let isMounted = true;
    fetch(`/api/notes?userId=${encodeURIComponent(user.uid)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then((data) => {
        if (isMounted && Array.isArray(data.notes)) {
          setNotes(data.notes);
        }
      })
      .catch((err) => {
        console.warn("Failed to load notes:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  // Create new note
  const handleCreateNote = async (
    title: string,
    mode: NoteWorkspaceModeType
  ) => {
    if (!user?.uid) {
      toast.error("Please sign in to create a note");
      return;
    }
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          title,
          mode,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create note workspace");
      }

      const data = await res.json();
      toast.success(mode === "INFINITE_CANVAS" ? "Canvas created!" : "Note created!");
      router.push(`/dashboard/notes/${data.note.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error creating workspace";
      toast.error(msg);
    }
  };

  // Trigger custom delete modal
  const handleDeleteNote = (noteId: string) => {
    const target = notes.find((n) => n.id === noteId);
    if (target) {
      setDeleteTarget({ id: target.id, title: target.title });
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!user?.uid || !deleteTarget) return;

    try {
      const res = await fetch(`/api/notes/${deleteTarget.id}?userId=${encodeURIComponent(user.uid)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      toast.success("Note deleted");
    } catch {
      toast.error("Could not delete note");
    }
  };

  // Trigger custom rename modal
  const handleRenameNote = (noteId: string, currentTitle: string) => {
    setRenameTarget({ id: noteId, title: currentTitle });
  };

  // Confirm rename handler
  const handleConfirmRename = async (newTitle: string) => {
    if (!user?.uid || !renameTarget) return;

    try {
      setNotes((prev) =>
        prev.map((n) => (n.id === renameTarget.id ? { ...n, title: newTitle } : n))
      );
      const res = await fetch(`/api/notes/${renameTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, title: newTitle }),
      });
      if (!res.ok) throw new Error("Failed to rename");
      toast.success("Renamed");
    } catch {
      toast.error("Could not rename note");
    }
  };

  // Filter notes by search and mode
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (modeFilter === "CANVAS") {
        return n.mode === "INFINITE_CANVAS";
      }
      if (modeFilter === "DOCUMENT") {
        return n.mode === "DOCUMENT_NOTE" || n.mode === "FIXED_WHITEBOARD";
      }
      return true;
    });
  }, [notes, searchQuery, modeFilter]);

  const canvasCount = useMemo(() => notes.filter((n) => n.mode === "INFINITE_CANVAS").length, [notes]);
  const documentCount = useMemo(
    () => notes.filter((n) => n.mode === "DOCUMENT_NOTE" || n.mode === "FIXED_WHITEBOARD").length,
    [notes]
  );

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-5 flex flex-col gap-4">
      {/* Sleek, Compact Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <RiDraftLine className="size-4" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Notes & Canvas
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
              {notes.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          {/* Search Box */}
          <div className="w-full sm:w-56">
            <Input
              size="small"
              placeholder="Search..."
              leadingIcon={RiSearchLine}
              value={searchQuery}
              onChange={(v) => setSearchQuery(v)}
              className="w-full"
            />
          </div>

          {/* Create CTA Button */}
          <Button
            variant="primary"
            size="small"
            onClick={() => setCreateDialogOpen(true)}
            className="shrink-0 font-semibold flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <RiAddFill className="size-4" />
            <span className="inline sm:hidden">Create</span>
            <span className="hidden sm:inline">Create Workspace</span>
          </Button>
        </div>
      </div>

      {/* Mode Filter Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 self-start">
        <button
          type="button"
          onClick={() => setModeFilter("ALL")}
          className={cx(
            "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
            modeFilter === "ALL"
              ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-2xs"
              : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
          )}
        >
          All ({notes.length})
        </button>
        <button
          type="button"
          onClick={() => setModeFilter("CANVAS")}
          className={cx(
            "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
            modeFilter === "CANVAS"
              ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-2xs"
              : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
          )}
        >
          <RiCompass3Line className="size-3.5" />
          Canvases ({canvasCount})
        </button>
        <button
          type="button"
          onClick={() => setModeFilter("DOCUMENT")}
          className={cx(
            "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
            modeFilter === "DOCUMENT"
              ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-2xs"
              : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
          )}
        >
          <RiDraftLine className="size-3.5" />
          Notes ({documentCount})
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3 text-slate-400 dark:text-zinc-500">
          <RiLoader4Line className="size-8 animate-spin text-blue-500" />
          <span className="text-xs font-medium">Loading your notes...</span>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/20 text-center">
          <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center mb-3">
            <RiDraftLine className="size-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
            {searchQuery ? "No matching notes found" : "No notes yet"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-sm">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different keyword.`
              : "Create an infinite canvas for architecture diagrams or a rich note for DSA algorithms and interview answers."}
          </p>
          {!searchQuery && (
            <div className="mt-4">
              <Button
                variant="primary"
                size="small"
                onClick={() => setCreateDialogOpen(true)}
                className="flex items-center gap-1.5"
              >
                <RiAddFill className="size-4" />
                <span>Create Canvas</span>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDeleteNote}
              onRename={handleRenameNote}
            />
          ))}
        </div>
      )}

      {/* Create Modal Dialog */}
      <CreateNoteDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateNote}
      />

      {/* Custom Delete Modal Dialog */}
      <DeleteNoteDialog
        isOpen={!!deleteTarget}
        noteTitle={deleteTarget?.title || ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Custom Rename Modal Dialog */}
      <RenameNoteDialog
        isOpen={!!renameTarget}
        currentTitle={renameTarget?.title || ""}
        onClose={() => setRenameTarget(null)}
        onConfirm={handleConfirmRename}
      />
    </div>
  );
}
