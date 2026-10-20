"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { RiLoader4Line } from "@remixicon/react";
import type { SaveStatus } from "./notes-header";

// Dynamic import with SSR disabled
const DocumentEditorInner = dynamic(
  () => import("./document-editor-inner"),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 w-full h-[calc(100svh-140px)] flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-[#0c101c] text-slate-500 dark:text-zinc-400">
        <RiLoader4Line className="size-8 text-emerald-500 animate-spin" />
        <span className="text-xs font-medium">Loading document note workspace...</span>
      </div>
    ),
  }
);

interface DocumentEditorProps {
  noteId: string;
  userId: string;
  initialContent?: unknown;
  onSaveStatusChange: (status: SaveStatus) => void;
  onRegisterExportHandler?: (handler: (format: "markdown" | "html" | "json") => Promise<void>) => void;
  onRegisterClearHandler?: (handler: () => void) => void;
}

export function DocumentEditor({
  noteId,
  userId,
  initialContent,
  onSaveStatusChange,
  onRegisterExportHandler,
  onRegisterClearHandler,
}: DocumentEditorProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="relative flex-1 w-full h-[calc(100svh-3.5rem)] flex flex-col overflow-hidden bg-slate-50/70 dark:bg-[#090d16]">
      <DocumentEditorInner
        noteId={noteId}
        userId={userId}
        initialContent={initialContent}
        isDark={isDark}
        onSaveStatusChange={onSaveStatusChange}
        onRegisterExportHandler={onRegisterExportHandler}
        onRegisterClearHandler={onRegisterClearHandler}
      />
    </div>
  );
}
