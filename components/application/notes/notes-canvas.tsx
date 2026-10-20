"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";
import { useTheme } from "next-themes";
import { RiLoader4Line } from "@remixicon/react";
import type { SaveStatus } from "./notes-header";
import type { ExcalidrawImperativeAPI, BinaryFiles, AppState } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement, OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

// Dynamic import of ExcalidrawWrapper with SSR disabled
const ExcalidrawWrapper = dynamic(
  () => import("./excalidraw-wrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-[#0c101c] text-slate-500 dark:text-zinc-400">
        <RiLoader4Line className="size-8 text-blue-500 animate-spin" />
        <span className="text-xs font-medium">Loading canvas workspace...</span>
      </div>
    ),
  }
);

interface NotesCanvasProps {
  noteId: string;
  userId: string;
  initialElements: readonly ExcalidrawElement[];
  initialAppState?: Partial<AppState>;
  initialFiles?: BinaryFiles;
  mode: "INFINITE_CANVAS" | "FIXED_WHITEBOARD" | "DOCUMENT_NOTE";
  onSaveStatusChange: (status: SaveStatus) => void;
  onRegisterExportHandler?: (handler: (format: "png" | "svg" | "json") => Promise<void>) => void;
  onRegisterClearHandler?: (handler: () => void) => void;
}

export function NotesCanvas({
  noteId,
  userId,
  initialElements,
  initialAppState,
  initialFiles,
  mode,
  onSaveStatusChange,
  onRegisterExportHandler,
  onRegisterClearHandler,
}: NotesCanvasProps) {
  const { resolvedTheme } = useTheme();
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  // Autosave references
  const lastSavedElementsRef = useRef<string>(JSON.stringify(initialElements || []));
  const latestDataRef = useRef<{
    elements: readonly ExcalidrawElement[];
    appState: Partial<AppState>;
    files: BinaryFiles;
  }>({
    elements: initialElements || [],
    appState: initialAppState || {},
    files: initialFiles || {},
  });
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRevisionRef = useRef(0);
  const isSavingRef = useRef(false);

  // Setup initial template for Fixed Whiteboard if canvas is completely empty
  const preparedElements = useMemo<readonly ExcalidrawElement[]>(() => {
    if ((!initialElements || initialElements.length === 0) && mode === "FIXED_WHITEBOARD") {
      // Create a clean whiteboard boundary frame
      return [
        {
          id: "whiteboard-frame",
          type: "frame",
          x: 100,
          y: 80,
          width: 1200,
          height: 800,
          angle: 0,
          strokeColor: "#94a3b8",
          backgroundColor: "transparent",
          fillStyle: "solid",
          strokeWidth: 2,
          strokeStyle: "dashed",
          roughness: 0,
          opacity: 100,
          name: "Canvas Frame (1200x800)",
        } as unknown as ExcalidrawElement,
      ];
    }
    return initialElements || [];
  }, [initialElements, mode]);

  // Perform actual save request to backend
  const performSave = useCallback(async () => {
    const currentSerialized = JSON.stringify(latestDataRef.current.elements);
    if (currentSerialized === lastSavedElementsRef.current && !latestDataRef.current.files) {
      onSaveStatusChange("saved");
      return;
    }

    const currentRev = ++saveRevisionRef.current;
    isSavingRef.current = true;
    onSaveStatusChange("saving");

    try {
      const payload = {
        userId,
        elements: latestDataRef.current.elements,
        appState: {
          zoom: latestDataRef.current.appState?.zoom,
          scrollX: latestDataRef.current.appState?.scrollX,
          scrollY: latestDataRef.current.appState?.scrollY,
          viewBackgroundColor: latestDataRef.current.appState?.viewBackgroundColor,
          gridSize: latestDataRef.current.appState?.gridSize,
        },
        files: latestDataRef.current.files,
      };

      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      if (!res.ok) {
        throw new Error("Failed to save canvas state");
      }

      // If no new edits happened while this request was in flight, mark saved
      if (currentRev === saveRevisionRef.current) {
        lastSavedElementsRef.current = currentSerialized;
        onSaveStatusChange("saved");
      }
    } catch (err) {
      console.error("[NotesCanvas] Autosave error:", err);
      onSaveStatusChange("error");
    } finally {
      isSavingRef.current = false;
    }
  }, [noteId, userId, onSaveStatusChange]);

  // Debounce autosave triggers with responsive 700ms duration
  const triggerDebouncedSave = useCallback(() => {
    onSaveStatusChange("unsaved");
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      performSave();
    }, 700);
  }, [onSaveStatusChange, performSave]);

  // Listen to Excalidraw scene changes
  const handleChange = useCallback(
    (
      elements: readonly OrderedExcalidrawElement[],
      appState: AppState,
      files: BinaryFiles
    ) => {
      latestDataRef.current = {
        elements,
        appState,
        files,
      };
      triggerDebouncedSave();
    },
    [triggerDebouncedSave]
  );

  // Keyboard shortcut Ctrl+S / Cmd+S for instant saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        performSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [performSave]);

  // Flush pending save before unmounting or navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        const payload = JSON.stringify({
          userId,
          elements: latestDataRef.current.elements,
          appState: latestDataRef.current.appState,
          files: latestDataRef.current.files,
        });
        navigator.sendBeacon(`/api/notes/${noteId}`, payload);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Immediately flush pending changes on client navigation
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        performSave();
      }
    };
  }, [noteId, userId, performSave]);

  // Register Export Handler with parent header
  useEffect(() => {
    if (!onRegisterExportHandler) return;

    const handleExport = async (format: "png" | "svg" | "json") => {
      if (!excalidrawAPI) return;
      const elements = excalidrawAPI.getSceneElements();
      if (!elements || elements.length === 0) return;

      if (format === "json") {
        const data = {
          type: "excalidraw",
          version: 2,
          source: "https://algoryn.dev",
          elements,
          appState: excalidrawAPI.getAppState(),
          files: excalidrawAPI.getFiles(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `canvas-note-${noteId}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const { exportToBlob, exportToSvg } = await import("@excalidraw/excalidraw");
        if (format === "png") {
          const blob = await exportToBlob({
            elements,
            appState: excalidrawAPI.getAppState(),
            files: excalidrawAPI.getFiles(),
            mimeType: "image/png",
          });
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `canvas-note-${noteId}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        } else if (format === "svg") {
          const svg = await exportToSvg({
            elements,
            appState: excalidrawAPI.getAppState(),
            files: excalidrawAPI.getFiles(),
          });
          const svgString = new XMLSerializer().serializeToString(svg);
          const blob = new Blob([svgString], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `canvas-note-${noteId}.svg`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    };

    onRegisterExportHandler(handleExport);
  }, [excalidrawAPI, noteId, onRegisterExportHandler]);

  // Register Clear Canvas Handler
  useEffect(() => {
    if (!onRegisterClearHandler) return;
    const handleClear = () => {
      if (excalidrawAPI) {
        excalidrawAPI.resetScene();
        handleChange([], excalidrawAPI.getAppState(), {});
      }
    };
    onRegisterClearHandler(handleClear);
  }, [excalidrawAPI, handleChange, onRegisterClearHandler]);

  // Sync theme changes dynamically
  const isDark = resolvedTheme === "dark";

  return (
    <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden bg-white dark:bg-[#0c101c]">
      <ExcalidrawWrapper
        initialElements={preparedElements}
        initialAppState={initialAppState}
        initialFiles={initialFiles}
        isDark={isDark}
        onAPIReady={setExcalidrawAPI}
        onChange={handleChange}
      />
    </div>
  );
}
