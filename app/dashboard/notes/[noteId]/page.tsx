"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/auth-context";
import { NotesHeader, type SaveStatus } from "@/components/application/notes/notes-header";
import { NotesCanvas } from "@/components/application/notes/notes-canvas";
import { DocumentEditor } from "@/components/application/notes/document-editor";
import { RiLoader4Line, RiErrorWarningLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import type { BinaryFiles, AppState } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";

interface NoteData {
  id: string;
  userId: string;
  title: string;
  mode: "INFINITE_CANVAS" | "FIXED_WHITEBOARD" | "DOCUMENT_NOTE";
  elements: readonly ExcalidrawElement[] | unknown[];
  appState?: Partial<AppState>;
  files?: BinaryFiles;
  createdAt: string;
  updatedAt: string;
}

export default function NoteCanvasPage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const router = useRouter();
  const { noteId } = use(params);
  const { user, loading: authLoading } = useAuth();

  const [note, setNote] = useState<NoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  // Export & Clear callback refs from child canvas/document
  const exportHandlerRef = useRef<((format: string) => Promise<void>) | null>(null);
  const clearHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid) {
      const timer = setTimeout(() => {
        setError("Please sign in to view this note.");
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    let isMounted = true;
    fetch(`/api/notes/${noteId}?userId=${encodeURIComponent(user.uid)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load note");
        return data;
      })
      .then((data) => {
        if (isMounted) setNote(data.note as NoteData);
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Error loading note");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [authLoading, user?.uid, noteId]);

  // Rename note title handler
  const handleRename = async (newTitle: string) => {
    if (!user?.uid || !note) return;
    try {
      setNote((prev) => (prev ? { ...prev, title: newTitle } : null));
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, title: newTitle }),
      });
      if (!res.ok) throw new Error("Failed to rename note");
      toast.success("Note renamed");
    } catch {
      toast.error("Could not update note title");
    }
  };

  // Delete note handler
  const handleDelete = async () => {
    if (!user?.uid) return;
    if (!confirm("Are you sure you want to delete this note? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/notes/${noteId}?userId=${encodeURIComponent(user.uid)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete note");
      toast.success("Note deleted");
      router.push("/dashboard/notes");
    } catch {
      toast.error("Could not delete note");
    }
  };

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="flex-1 w-full h-[calc(100svh-5rem)] flex flex-col items-center justify-center gap-3 bg-white dark:bg-[#0c101c] text-slate-500 dark:text-zinc-400">
        <RiLoader4Line className="size-8 text-blue-500 animate-spin" />
        <span className="text-sm font-medium">Opening workspace...</span>
      </div>
    );
  }

  // Error / unauthorized state
  if (error || !note) {
    return (
      <div className="flex-1 w-full h-[calc(100svh-5rem)] flex flex-col items-center justify-center gap-2 px-4 text-center bg-white dark:bg-[#0c101c]">
        <div className="size-12 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-500 mb-2">
          <RiErrorWarningLine className="size-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
          Cannot open note
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-sm">
          {error || "Note not found or permission denied."}
        </p>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" size="small" onClick={() => router.push("/dashboard/notes")}>
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  const isCanvas = note.mode === "INFINITE_CANVAS";

  return (
    <div className="flex-1 flex flex-col w-full h-[calc(100svh-4.5rem)] md:h-[calc(100svh-5rem)] overflow-hidden">
      {/* Top action header */}
      <NotesHeader
        title={note.title}
        mode={note.mode}
        saveStatus={saveStatus}
        onRename={handleRename}
        onBack={() => router.push("/dashboard/notes")}
        onManualSave={() => {
          if (saveStatus === "unsaved") {
            toast.info("Saving in background...");
          } else {
            toast.success("All changes are saved");
          }
        }}
        onClearCanvas={() => clearHandlerRef.current?.()}
        onExport={(fmt) => exportHandlerRef.current?.(fmt)}
        onDelete={handleDelete}
      />

      {/* Main workspace (Excalidraw Infinite Canvas OR BlockNote Document Note) */}
      {isCanvas ? (
        <NotesCanvas
          noteId={note.id}
          userId={user!.uid}
          initialElements={(note.elements || []) as readonly ExcalidrawElement[]}
          initialAppState={note.appState}
          initialFiles={note.files}
          mode={note.mode}
          onSaveStatusChange={setSaveStatus}
          onRegisterExportHandler={(fn) => {
            exportHandlerRef.current = fn as (format: string) => Promise<void>;
          }}
          onRegisterClearHandler={(fn) => {
            clearHandlerRef.current = fn;
          }}
        />
      ) : (
        <DocumentEditor
          noteId={note.id}
          userId={user!.uid}
          initialContent={note.elements}
          onSaveStatusChange={setSaveStatus}
          onRegisterExportHandler={(fn) => {
            exportHandlerRef.current = fn as (format: string) => Promise<void>;
          }}
          onRegisterClearHandler={(fn) => {
            clearHandlerRef.current = fn;
          }}
        />
      )}
    </div>
  );
}
