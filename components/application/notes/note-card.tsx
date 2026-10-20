"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  RiCompass3Line,
  RiDeleteBinLine,
  RiPencilLine,
} from "@remixicon/react";
import { Badge } from "@/components/base/badges/badge";
import { cx } from "@/utils/cx";

export interface NoteCardItem {
  id: string;
  title: string;
  mode: "INFINITE_CANVAS" | "FIXED_WHITEBOARD" | "DOCUMENT_NOTE";
  elements?: unknown;
  thumbnailUrl?: string | null;
  updatedAt: string;
  createdAt: string;
}

interface NoteCardProps {
  note: NoteCardItem;
  onDelete: (id: string) => void;
  onRename: (id: string, currentTitle: string) => void;
}

function formatRelativeTime(dateString: string): string {
  try {
    const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateString).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

interface ParsedDocBlock {
  id: string;
  type: string;
  text: string;
  level?: number;
  backgroundColor?: string;
  textColor?: string;
}

function parseDocumentBlocks(elements: unknown): ParsedDocBlock[] {
  if (!Array.isArray(elements) || elements.length === 0) return [];
  const results: ParsedDocBlock[] = [];
  for (const b of elements) {
    if (!b || typeof b !== "object") continue;
    let text = "";
    const blockObj = b as {
      id?: string;
      type?: string;
      props?: { level?: number; backgroundColor?: string; textColor?: string };
      content?: unknown;
    };
    if (Array.isArray(blockObj.content)) {
      text = blockObj.content
        .map((c: unknown) => {
          if (typeof c === "string") return c;
          if (c && typeof c === "object" && "text" in c) {
            return String((c as { text: unknown }).text || "");
          }
          return "";
        })
        .join("")
        .trim();
    } else if (typeof blockObj.content === "string") {
      text = blockObj.content.trim();
    }

    if (!text) continue;

    results.push({
      id: String(blockObj.id || Math.random()),
      type: String(blockObj.type || "paragraph"),
      text,
      level: blockObj.props?.level,
      backgroundColor: blockObj.props?.backgroundColor,
      textColor: blockObj.props?.textColor,
    });

    if (results.length >= 8) break;
  }
  return results;
}

interface ParsedCanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor?: string;
  backgroundColor?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  points?: [number, number][];
  opacity?: number;
  isDeleted?: boolean;
}

function parseCanvasElements(elements: unknown): ParsedCanvasElement[] {
  if (!Array.isArray(elements) || elements.length === 0) return [];
  const results: ParsedCanvasElement[] = [];
  for (const item of elements) {
    if (!item || typeof item !== "object") continue;
    const el = item as ParsedCanvasElement;
    if (el.isDeleted) continue;
    if (
      [
        "rectangle",
        "ellipse",
        "diamond",
        "line",
        "arrow",
        "freedraw",
        "text",
        "frame",
      ].includes(el.type)
    ) {
      results.push(el);
      if (results.length >= 35) break;
    }
  }
  return results;
}

function normalizeStroke(color?: string): string {
  if (!color || color === "#000000" || color === "#1e1e1e" || color === "#000" || color === "black") {
    return "#2563eb";
  }
  return color;
}

function normalizeFill(bg?: string): string {
  if (!bg || bg === "transparent" || bg === "none") return "none";
  return bg;
}

function pointsToPath(points?: [number, number][], originX = 0, originY = 0): string {
  if (!Array.isArray(points) || points.length === 0) return "";
  return points
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${originX + p[0]} ${originY + p[1]}`)
    .join(" ");
}

function extractDocumentImage(elements: unknown): string | null {
  if (!Array.isArray(elements) || elements.length === 0) return null;
  for (const b of elements) {
    if (!b || typeof b !== "object") continue;
    const block = b as { type?: string; props?: { url?: unknown } };
    if (block.type === "image" && typeof block.props?.url === "string") {
      const u = block.props.url.trim();
      if (
        u.startsWith("http://") ||
        u.startsWith("https://") ||
        u.startsWith("data:image/") ||
        u.startsWith("/")
      ) {
        return u;
      }
    }
  }
  return null;
}

function getBlockColorClass(color?: string): string {
  if (!color || color === "default") return "";
  switch (color) {
    case "orange":
      return "bg-amber-500/15 text-amber-950 dark:text-amber-200 border border-amber-500/25";
    case "green":
      return "bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 border border-emerald-500/25";
    case "blue":
      return "bg-sky-500/15 text-sky-950 dark:text-sky-200 border border-sky-500/25";
    case "yellow":
      return "bg-yellow-500/15 text-yellow-950 dark:text-yellow-200 border border-yellow-500/25";
    case "red":
      return "bg-rose-500/15 text-rose-950 dark:text-rose-200 border border-rose-500/25";
    case "purple":
      return "bg-purple-500/15 text-purple-950 dark:text-purple-200 border border-purple-500/25";
    case "gray":
      return "bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700";
    default:
      return "bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/20";
  }
}

function computeNumberedBlocks(raw: ParsedDocBlock[]) {
  let counter = 0;
  return raw.map((b) => {
    if (b.type === "numberedListItem") {
      counter += 1;
      return { ...b, numberedIndex: counter };
    }
    counter = 0;
    return { ...b, numberedIndex: 0 };
  });
}

/* -------------------------------------------------------------------------- */
/* Document Preview: Faithful Miniature Document Page (all block types)       */
/* -------------------------------------------------------------------------- */
function DocumentSheetPreview({ elements }: { elements: unknown }) {
  const rawBlocks = useMemo(() => parseDocumentBlocks(elements), [elements]);
  const docImage = useMemo(() => extractDocumentImage(elements), [elements]);
  const blocks = useMemo(() => computeNumberedBlocks(rawBlocks), [rawBlocks]);

  // If document contains an uploaded/pasted image, display it as a rich visual cover
  if (docImage) {
    return (
      <div className="relative w-full h-full bg-slate-50 dark:bg-[#0c101c] overflow-hidden flex items-center justify-center">
        <img
          src={docImage}
          alt={blocks[0]?.text || "Document preview"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover/preview:scale-[1.02]"
        />
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div className="relative w-full h-full p-4 bg-white dark:bg-[#0c101c] flex flex-col justify-center items-start text-slate-400 dark:text-zinc-500">
        <span className="font-semibold text-xs text-slate-600 dark:text-zinc-400">Empty Document</span>
        <p className="text-xs text-slate-400 dark:text-zinc-500 italic mt-1">
          Click to write notes &amp; algorithm solutions...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full px-4 py-3 bg-white dark:bg-[#0c101c] overflow-hidden select-none flex flex-col justify-start gap-[3px]">
      {blocks.map((b) => {
        const colorClass = getBlockColorClass(b.backgroundColor);

        // --- Headings ---
        if (b.type === "heading") {
          if (b.level === 1) {
            return (
              <h3
                key={b.id}
                className="font-bold text-[13px] sm:text-sm leading-snug text-slate-900 dark:text-zinc-100 tracking-tight truncate mt-0.5"
              >
                {b.text}
              </h3>
            );
          }
          if (b.level === 2) {
            return (
              <h4
                key={b.id}
                className="font-semibold text-[11px] sm:text-xs leading-snug text-slate-800 dark:text-zinc-200 truncate mt-1"
              >
                {b.text}
              </h4>
            );
          }
          return (
            <h5
              key={b.id}
              className="font-medium text-[10px] sm:text-[11px] leading-snug text-slate-700 dark:text-zinc-300 truncate mt-0.5"
            >
              {b.text}
            </h5>
          );
        }

        // --- Paragraph ---
        if (b.type === "paragraph") {
          return (
            <p
              key={b.id}
              className={cx(
                "text-[10px] sm:text-[11px] leading-normal truncate",
                colorClass ? `rounded px-1.5 py-px ${colorClass}` : "text-slate-600 dark:text-zinc-400"
              )}
            >
              {b.text}
            </p>
          );
        }

        // --- Bullet list item ---
        if (b.type === "bulletListItem") {
          return (
            <div
              key={b.id}
              className={cx(
                "flex items-start gap-1.5 text-[10px] sm:text-[11px] leading-normal pl-1",
                colorClass ? `rounded px-1.5 py-px ${colorClass}` : "text-slate-700 dark:text-zinc-300"
              )}
            >
              <span
                className={cx(
                  "font-bold shrink-0 mt-px",
                  colorClass ? "opacity-70" : "text-slate-400 dark:text-zinc-500"
                )}
              >
                •
              </span>
              <span className="truncate">{b.text}</span>
            </div>
          );
        }

        // --- Numbered list item ---
        if (b.type === "numberedListItem") {
          return (
            <div
              key={b.id}
              className={cx(
                "flex items-start gap-1.5 text-[10px] sm:text-[11px] leading-normal pl-1",
                colorClass ? `rounded px-1.5 py-px ${colorClass}` : "text-slate-700 dark:text-zinc-300"
              )}
            >
              <span
                className={cx(
                  "shrink-0 mt-px font-medium tabular-nums",
                  colorClass ? "opacity-70" : "text-slate-400 dark:text-zinc-500"
                )}
              >
                {b.numberedIndex}.
              </span>
              <span className="truncate">{b.text}</span>
            </div>
          );
        }

        // --- Check list item ---
        if (b.type === "checkListItem") {
          return (
            <div
              key={b.id}
              className={cx(
                "flex items-start gap-1.5 text-[10px] sm:text-[11px] leading-normal pl-1",
                colorClass ? `rounded px-1.5 py-px ${colorClass}` : "text-slate-700 dark:text-zinc-300"
              )}
            >
              <span className="shrink-0 mt-px text-slate-400 dark:text-zinc-500">☐</span>
              <span className="truncate">{b.text}</span>
            </div>
          );
        }

        // --- Fallback (any other block type) ---
        return (
          <p
            key={b.id}
            className="text-[10px] sm:text-[11px] leading-normal text-slate-600 dark:text-zinc-400 truncate"
          >
            {b.text}
          </p>
        );
      })}

      {/* Subtle fade-out on bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white dark:from-[#0c101c] to-transparent" />
    </div>
  );
}




/* -------------------------------------------------------------------------- */
/* Infinite Canvas Vector Preview: Clean Whiteboard Layout (NO DOTS)          */
/* -------------------------------------------------------------------------- */
function CanvasVectorPreview({
  elements,
  thumbnailUrl,
}: {
  elements: unknown;
  thumbnailUrl?: string | null;
}) {
  const validElements = useMemo(() => parseCanvasElements(elements), [elements]);

  const viewBox = useMemo(() => {
    if (validElements.length === 0) return "0 0 400 240";
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const el of validElements) {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + (el.width || 0));
      maxY = Math.max(maxY, el.y + (el.height || 0));
      if (Array.isArray(el.points)) {
        for (const pt of el.points) {
          minX = Math.min(minX, el.x + pt[0]);
          minY = Math.min(minY, el.y + pt[1]);
          maxX = Math.max(maxX, el.x + pt[0]);
          maxY = Math.max(maxY, el.y + pt[1]);
        }
      }
    }

    const w = Math.max(20, maxX - minX);
    const h = Math.max(20, maxY - minY);
    const pad = Math.max(24, Math.min(80, Math.max(w, h) * 0.15));
    return `${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`;
  }, [validElements]);

  return (
    <div className="relative w-full h-full p-2 bg-white dark:bg-[#0c101c] overflow-hidden flex flex-col justify-between">
      {/* Clean Pure Whiteboard Surface (NO DOTS) */}
      <div className="relative z-10 flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="Canvas preview"
            className="w-full h-full object-contain p-2"
          />
        ) : validElements.length > 0 ? (
          <svg
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full max-h-[105px] filter drop-shadow-2xs transition-transform duration-300 group-hover/preview:scale-[1.02]"
          >
            {validElements.map((el) => {
              const stroke = normalizeStroke(el.strokeColor);
              const fill = normalizeFill(el.backgroundColor);
              const sw = Math.max(2, el.strokeWidth || 2);
              const op = (el.opacity ?? 100) / 100;

              if (el.type === "rectangle" || el.type === "frame") {
                return (
                  <rect
                    key={el.id}
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    rx={6}
                    stroke={stroke}
                    strokeWidth={sw}
                    fill={fill}
                    opacity={op}
                  />
                );
              }

              if (el.type === "ellipse") {
                return (
                  <ellipse
                    key={el.id}
                    cx={el.x + el.width / 2}
                    cy={el.y + el.height / 2}
                    rx={Math.abs(el.width / 2)}
                    ry={Math.abs(el.height / 2)}
                    stroke={stroke}
                    strokeWidth={sw}
                    fill={fill}
                    opacity={op}
                  />
                );
              }

              if (el.type === "diamond") {
                return (
                  <polygon
                    key={el.id}
                    points={`${el.x + el.width / 2},${el.y} ${el.x + el.width},${el.y + el.height / 2} ${el.x + el.width / 2},${el.y + el.height} ${el.x},${el.y + el.height / 2}`}
                    stroke={stroke}
                    strokeWidth={sw}
                    fill={fill}
                    opacity={op}
                  />
                );
              }

              if (el.type === "line" || el.type === "arrow") {
                return (
                  <path
                    key={el.id}
                    d={
                      pointsToPath(el.points, el.x, el.y) ||
                      `M ${el.x} ${el.y} L ${el.x + el.width} ${el.y + el.height}`
                    }
                    stroke={stroke}
                    strokeWidth={sw}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={op}
                  />
                );
              }

              if (el.type === "freedraw") {
                return (
                  <path
                    key={el.id}
                    d={pointsToPath(el.points, el.x, el.y)}
                    stroke={stroke}
                    strokeWidth={sw}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={op}
                  />
                );
              }

              if (el.type === "text" && el.text) {
                return (
                  <text
                    key={el.id}
                    x={el.x}
                    y={el.y + (el.fontSize || 16) * 0.8}
                    fontSize={el.fontSize || 16}
                    fill={stroke}
                    fontWeight="bold"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {el.text}
                  </text>
                );
              }

              return null;
            })}
          </svg>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 text-center p-3 select-none">
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <RiCompass3Line className="size-4" />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 italic">
              Click to sketch & diagram...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main NoteCard Component                                                     */
/* -------------------------------------------------------------------------- */
export function NoteCard({ note, onDelete, onRename }: NoteCardProps) {
  const isInfinite = note.mode === "INFINITE_CANVAS";

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c101c] p-3 sm:p-4 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      {/* Visual Live Preview Header */}
      <Link
        href={`/dashboard/notes/${note.id}`}
        className="block relative h-44 sm:h-48 w-full rounded-xl overflow-hidden mb-3 border border-slate-200/70 dark:border-zinc-800/60 transition-all duration-300 group/preview"
      >
        {isInfinite ? (
          <CanvasVectorPreview elements={note.elements} thumbnailUrl={note.thumbnailUrl} />
        ) : (
          <DocumentSheetPreview elements={note.elements} />
        )}
      </Link>

      {/* Note Info */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/dashboard/notes/${note.id}`}
            className="font-semibold text-sm text-slate-900 dark:text-zinc-100 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title={note.title}
          >
            {note.title}
          </Link>
          <Badge
            color={isInfinite ? "primary" : "neutral"}
            className={cx(
              "text-[10px] px-1.5 py-0.5 shrink-0 font-medium",
              !isInfinite && "!bg-emerald-500/15 !text-emerald-600 dark:!text-emerald-400 border border-emerald-500/20"
            )}
          >
            {isInfinite ? "Canvas" : "Note"}
          </Badge>
        </div>

        <span className="text-[11px] text-slate-400 dark:text-zinc-500">
          Edited {formatRelativeTime(note.updatedAt)}
        </span>
      </div>

      {/* Card Actions Footer - Mobile Optimized Touch Targets (>= 36px) */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
        <Link
          href={`/dashboard/notes/${note.id}`}
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 min-h-[36px] py-1"
        >
          {isInfinite ? "Open Canvas" : "Open Note"}
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onRename(note.id, note.title)}
            aria-label="Rename workspace"
            title="Rename workspace"
            className="p-2 sm:p-1.5 min-h-[36px] min-w-[36px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <RiPencilLine className="size-4 sm:size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(note.id)}
            aria-label="Delete workspace"
            title="Delete workspace"
            className="p-2 sm:p-1.5 min-h-[36px] min-w-[36px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
          >
            <RiDeleteBinLine className="size-4 sm:size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
