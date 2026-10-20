"use client";

import { useState, useMemo } from "react";
import { Excalidraw, useHandleLibrary } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI, BinaryFiles, AppState, LibraryItems } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement, OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

export interface ExcalidrawWrapperProps {
  initialElements: readonly ExcalidrawElement[];
  initialAppState?: Partial<AppState>;
  initialFiles?: BinaryFiles;
  isDark: boolean;
  onAPIReady: (api: ExcalidrawImperativeAPI) => void;
  onChange: (
    elements: readonly OrderedExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => void;
}

export default function ExcalidrawWrapper({
  initialElements,
  initialAppState,
  initialFiles,
  isDark,
  onAPIReady,
  onChange,
}: ExcalidrawWrapperProps) {
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);

  // Hook up Excalidraw library handling - listens for URL hash on return from libraries.excalidraw.com!
  useHandleLibrary({ excalidrawAPI: api });

  const handleAPI = (excalidrawAPI: ExcalidrawImperativeAPI) => {
    setApi(excalidrawAPI);
    onAPIReady(excalidrawAPI);
  };

  const libraryReturnUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.origin + window.location.pathname;
    }
    return undefined;
  }, []);

  const cachedLibraryItems = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("algoryn-excalidraw-library");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const handleLibraryChange = (items: LibraryItems) => {
    try {
      localStorage.setItem("algoryn-excalidraw-library", JSON.stringify(items));
    } catch {
      // ignore storage quota error
    }
  };

  return (
    <Excalidraw
      excalidrawAPI={handleAPI}
      theme={isDark ? "dark" : "light"}
      libraryReturnUrl={libraryReturnUrl}
      onLibraryChange={handleLibraryChange}
      initialData={{
        elements: initialElements,
        appState: {
          theme: isDark ? "dark" : "light",
          viewBackgroundColor: isDark ? "#0c101c" : "#ffffff",
          ...(initialAppState || {}),
        },
        files: initialFiles || {},
        libraryItems: cachedLibraryItems,
      }}
      onChange={onChange}
      UIOptions={{
        canvasActions: {
          saveAsImage: true,
          toggleTheme: true,
          clearCanvas: true,
          export: {
            saveFileToDisk: true,
          },
        },
      }}
    />
  );
}
