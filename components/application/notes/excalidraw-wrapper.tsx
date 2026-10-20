"use client";

import { useState, useMemo, useEffect } from "react";
import { Excalidraw, MainMenu, useHandleLibrary } from "@excalidraw/excalidraw";
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

  // Give this window a name so libraries.excalidraw.com redirects back to THIS tab
  // instead of opening a new one (Excalidraw passes window.name as the "target" param)
  useEffect(() => {
    if (!window.name) {
      window.name = "_excalidraw_app";
    }
  }, []);

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

  // Sanitize initialAppState so non-serializable fields (like collaborators) never crash Excalidraw
  const cleanAppState = useMemo<Partial<AppState>>(() => {
    const base: Partial<AppState> = {
      theme: isDark ? "dark" : "light",
      viewBackgroundColor: isDark ? "#0c101c" : "#ffffff",
    };
    if (!initialAppState || typeof initialAppState !== "object") {
      return base;
    }
    const state = initialAppState as Partial<AppState>;
    return {
      ...base,
      viewBackgroundColor:
        typeof state.viewBackgroundColor === "string" ? state.viewBackgroundColor : base.viewBackgroundColor,
      zoom: state.zoom,
      scrollX: typeof state.scrollX === "number" ? state.scrollX : undefined,
      scrollY: typeof state.scrollY === "number" ? state.scrollY : undefined,
      gridSize: typeof state.gridSize === "number" ? state.gridSize : undefined,
    };
  }, [initialAppState, isDark]);

  return (
    <Excalidraw
      excalidrawAPI={handleAPI}
      theme={isDark ? "dark" : "light"}
      libraryReturnUrl={libraryReturnUrl}
      onLibraryChange={handleLibraryChange}
      initialData={{
        elements: initialElements,
        appState: cleanAppState,
        files: initialFiles || {},
        libraryItems: cachedLibraryItems,
      }}
      onChange={onChange}
      UIOptions={{
        canvasActions: {
          loadScene: true,
          saveAsImage: true,
          toggleTheme: true,
          clearCanvas: true,
          export: {
            saveFileToDisk: true,
          },
          changeViewBackgroundColor: true,
        },
      }}
    >
      <MainMenu>
        <MainMenu.DefaultItems.LoadScene />
        <MainMenu.DefaultItems.SaveAsImage />
        <MainMenu.DefaultItems.Export />
        <MainMenu.DefaultItems.ClearCanvas />
        <MainMenu.Separator />
        <MainMenu.DefaultItems.ToggleTheme />
        <MainMenu.DefaultItems.ChangeCanvasBackground />
      </MainMenu>
    </Excalidraw>
  );
}
