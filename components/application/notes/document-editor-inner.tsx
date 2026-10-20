"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import type { PartialBlock, Block } from "@blocknote/core";
import type { SaveStatus } from "./notes-header";

export interface DocumentEditorInnerProps {
  noteId: string;
  userId: string;
  initialContent?: unknown;
  isDark: boolean;
  onSaveStatusChange: (status: SaveStatus) => void;
  onRegisterExportHandler?: (handler: (format: "markdown" | "html" | "json") => Promise<void>) => void;
  onRegisterClearHandler?: (handler: () => void) => void;
}

export default function DocumentEditorInner({
  noteId,
  userId,
  initialContent,
  isDark,
  onSaveStatusChange,
  onRegisterExportHandler,
  onRegisterClearHandler,
}: DocumentEditorInnerProps) {
  // Parse initial blocks safely
  const initialBlocks = useMemo<PartialBlock[] | undefined>(() => {
    if (Array.isArray(initialContent) && initialContent.length > 0) {
      return initialContent as PartialBlock[];
    }
    return [
      {
        type: "heading",
        props: { level: 1 },
        content: "Untitled Note",
      },
      {
        type: "paragraph",
        content: "Start typing notes, interview solutions, algorithm trade-offs, or press '/' to insert blocks...",
      },
    ];
  }, [initialContent]);

  // Instantiate BlockNote editor
  const editor = useCreateBlockNote({
    initialContent: initialBlocks,
  });

  // Autosave references
  const lastSavedRef = useRef<string>(JSON.stringify(initialBlocks));
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRevisionRef = useRef(0);
  const isSavingRef = useRef(false);

  // Perform backend autosave
  const performSave = useCallback(
    async (blocks: Block[]) => {
      const currentSerialized = JSON.stringify(blocks);
      if (currentSerialized === lastSavedRef.current) {
        onSaveStatusChange("saved");
        return;
      }

      const currentRev = ++saveRevisionRef.current;
      isSavingRef.current = true;
      onSaveStatusChange("saving");

      try {
        const payload = {
          userId,
          elements: blocks,
          appState: {},
          files: {},
        };

        const res = await fetch(`/api/notes/${noteId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });

        if (!res.ok) {
          throw new Error("Failed to save document");
        }

        if (currentRev === saveRevisionRef.current) {
          lastSavedRef.current = currentSerialized;
          onSaveStatusChange("saved");
        }
      } catch (err) {
        console.error("[DocumentEditor] Autosave error:", err);
        onSaveStatusChange("error");
      } finally {
        isSavingRef.current = false;
      }
    },
    [noteId, userId, onSaveStatusChange]
  );

  // Handle editor content changes with responsive 600ms debounce
  const handleChange = useCallback(() => {
    if (!editor) return;
    onSaveStatusChange("unsaved");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      performSave(editor.document);
    }, 600);
  }, [editor, onSaveStatusChange, performSave]);

  // Hook into BlockNote's document change event on every stroke/block modification
  useEditorChange(() => {
    handleChange();
  }, editor);

  // Keyboard shortcut Ctrl+S / Cmd+S for instant saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (editor) {
          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
          performSave(editor.document);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor, performSave]);

  // Flush pending save on page leave / unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (saveTimeoutRef.current && editor) {
        clearTimeout(saveTimeoutRef.current);
        const payload = JSON.stringify({
          userId,
          elements: editor.document,
          appState: {},
          files: {},
        });
        navigator.sendBeacon(`/api/notes/${noteId}`, payload);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Immediately flush save on unmount/navigation with keepalive fetch
      if (saveTimeoutRef.current && editor) {
        clearTimeout(saveTimeoutRef.current);
        performSave(editor.document);
      }
    };
  }, [noteId, userId, editor, performSave]);

  // Register Export Handler with parent header
  useEffect(() => {
    if (!onRegisterExportHandler || !editor) return;

    const handleExport = async (format: "markdown" | "html" | "json") => {
      if (format === "markdown") {
        const md = await editor.blocksToMarkdownLossy(editor.document);
        const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `note-${noteId}.md`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === "html") {
        const html = await editor.blocksToHTMLLossy(editor.document);
        const styledHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Note</title><style>body{font-family:system-ui,-apple-system,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#1e293b;}</style></head><body>${html}</body></html>`;
        const blob = new Blob([styledHtml], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `note-${noteId}.html`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === "json") {
        const json = JSON.stringify(editor.document, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `note-${noteId}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    };

    onRegisterExportHandler(handleExport);
  }, [editor, noteId, onRegisterExportHandler]);

  // Register Clear Document Handler
  useEffect(() => {
    if (!onRegisterClearHandler || !editor) return;

    const handleClear = () => {
      editor.replaceBlocks(editor.document, [
        {
          type: "paragraph",
          content: "",
        },
      ]);
      handleChange();
    };

    onRegisterClearHandler(handleClear);
  }, [editor, handleChange, onRegisterClearHandler]);

  return (
    <div className="w-full flex-1 overflow-y-auto bg-slate-50/50 dark:bg-[#0c101c] py-4 sm:py-8 px-2 sm:px-6 flex justify-center">
      <div className="w-full max-w-4xl min-h-[calc(100svh-140px)] bg-white dark:bg-[#0e1322] border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm px-3 sm:px-8 md:px-12 py-6 sm:py-10">
        <BlockNoteView
          editor={editor}
          theme={isDark ? "dark" : "light"}
          onChange={handleChange}
          className="algoryn-blocknote-view min-h-[500px]"
        />
      </div>
    </div>
  );
}
