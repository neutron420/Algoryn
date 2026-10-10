"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

interface TableBlock {
  type: "table";
  headers: string[];
  rows: string[][];
}

interface CodeBlock {
  type: "code";
  lang: string;
  code: string;
}

interface StandardBlock {
  type: "h1" | "h2" | "h3" | "h4" | "hr" | "quote" | "bullet" | "numbered" | "p";
  content: string;
  num?: string;
}

type ParsedBlock = TableBlock | CodeBlock | StandardBlock;

/**
 * Format inline markdown tokens:
 * - Links: [text](url)
 * - Bold: **text**
 * - Italic: *text* or _text_
 * - Underline: <u>text</u>
 * - Strikethrough: ~~text~~
 * - Inline Code: `code`
 */
export function formatMarkdownInline(text: string): React.ReactNode {
  if (!text) return "";

  // Tokenize for links first: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseBasicInline(text.slice(lastIndex, match.index), `sub-${lastIndex}`));
    }
    const linkText = match[1];
    const linkUrl = match[2];
    parts.push(
      <a
        key={`link-${match.index}`}
        href={linkUrl.startsWith("http") || linkUrl.startsWith("/") ? linkUrl : `https://${linkUrl}`}
        target={linkUrl.startsWith("/") ? "_self" : "_blank"}
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-baseline gap-0.5"
      >
        <span>{formatMarkdownInline(linkText)}</span>
        <ExternalLink className="size-2.5 inline self-center opacity-70" />
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(parseBasicInline(text.slice(lastIndex), `sub-${lastIndex}`));
  }

  return <>{parts}</>;
}

function parseBasicInline(text: string, keyPrefix: string): React.ReactNode {
  // Replace HTML underline <u>...</u>
  const segments = text.split(/(<u>.*?<\/u>|\*\*.*?\*\*|\*.*?\*|~~.*?~~|`.*?`)/g);

  return segments.map((seg, i) => {
    const k = `${keyPrefix}-${i}`;
    if (seg.startsWith("<u>") && seg.endsWith("</u>")) {
      return <u key={k}>{seg.slice(3, -4)}</u>;
    }
    if (seg.startsWith("**") && seg.endsWith("**") && seg.length >= 4) {
      return (
        <strong key={k} className="font-semibold text-slate-900 dark:text-zinc-100">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    if (seg.startsWith("*") && seg.endsWith("*") && seg.length >= 2) {
      return <em key={k}>{seg.slice(1, -1)}</em>;
    }
    if (seg.startsWith("~~") && seg.endsWith("~~") && seg.length >= 4) {
      return <del key={k} className="line-through text-slate-400 dark:text-zinc-500">{seg.slice(2, -2)}</del>;
    }
    if (seg.startsWith("`") && seg.endsWith("`") && seg.length >= 2) {
      return (
        <code
          key={k}
          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-mono text-[11px] sm:text-xs border border-slate-200/60 dark:border-zinc-700/60"
        >
          {seg.slice(1, -1)}
        </code>
      );
    }
    return seg;
  });
}

/**
 * TakeUforward-accurate Markdown Parser & Live Preview Component
 */
export function InterviewMarkdownPreview({ content, className = "" }: MarkdownPreviewProps) {
  if (!content || !content.trim()) {
    return (
      <div className="p-8 text-center text-slate-400 dark:text-zinc-500 text-sm italic">
        Start writing your interview experience on the left to see the live formatted preview here.
      </div>
    );
  }

  const lines = content.split("\n");
  const blocks: ParsedBlock[] = [];

  let inCode = false;
  let codeLang = "";
  let codeLines: string[] = [];

  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (inTable && tableHeaders.length > 0) {
      blocks.push({
        type: "table",
        headers: tableHeaders,
        rows: tableRows,
      });
      inTable = false;
      tableHeaders = [];
      tableRows = [];
    }
  };

  const flushCode = () => {
    if (inCode) {
      blocks.push({
        type: "code",
        lang: codeLang,
        code: codeLines.join("\n"),
      });
      inCode = false;
      codeLang = "";
      codeLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Code block detection
    if (trimmed.startsWith("```")) {
      flushTable();
      if (inCode) {
        flushCode();
      } else {
        inCode = true;
        codeLang = trimmed.slice(3).trim();
        codeLines = [];
      }
      continue;
    }

    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }

    // Table detection: line starting and ending with |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());

      // Check if it's separator line (e.g. | --- | --- |)
      const isSeparator = cells.every((c) => /^:?-+:?$/.test(c));

      if (!inTable) {
        // First table row is header
        inTable = true;
        tableHeaders = cells;
        tableRows = [];
      } else if (isSeparator) {
        // ignore separator line
        continue;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    // Horizontal rule
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      blocks.push({ type: "hr", content: "" });
      continue;
    }

    // Empty line
    if (!trimmed) {
      continue;
    }

    // Headings
    if (trimmed.startsWith("#### ")) {
      blocks.push({ type: "h4", content: trimmed.slice(5) });
    } else if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", content: trimmed.slice(4) });
    } else if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", content: trimmed.slice(3) });
    } else if (trimmed.startsWith("# ")) {
      blocks.push({ type: "h1", content: trimmed.slice(2) });
    } else if (trimmed.startsWith("> ")) {
      blocks.push({ type: "quote", content: trimmed.slice(2) });
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      blocks.push({ type: "bullet", content: trimmed.slice(2).trim() });
    } else if (/^(\d+)\.\s+(.*)$/.test(trimmed)) {
      const m = trimmed.match(/^(\d+)\.\s+(.*)$/);
      blocks.push({ type: "numbered", num: m ? m[1] : "1", content: m ? m[2] : trimmed });
    } else {
      blocks.push({ type: "p", content: trimmed });
    }
  }

  flushTable();
  flushCode();

  return (
    <div className={`space-y-4 font-sans text-slate-700 dark:text-zinc-300 leading-relaxed ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === "hr") {
          return <hr key={idx} className="my-6 border-t border-slate-200 dark:border-zinc-800" />;
        }

        if (block.type === "h1") {
          return (
            <h1
              key={idx}
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight mt-6 mb-3 pb-1 border-b border-slate-200 dark:border-zinc-800"
            >
              {formatMarkdownInline(block.content)}
            </h1>
          );
        }

        if (block.type === "h2") {
          return (
            <h2
              key={idx}
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight mt-6 mb-2.5 flex items-center gap-2"
            >
              <span>{formatMarkdownInline(block.content)}</span>
            </h2>
          );
        }

        if (block.type === "h3") {
          return (
            <h3
              key={idx}
              className="text-base sm:text-lg font-bold text-slate-800 dark:text-zinc-200 tracking-tight mt-4 mb-2"
            >
              {formatMarkdownInline(block.content)}
            </h3>
          );
        }

        if (block.type === "h4") {
          return (
            <h4
              key={idx}
              className="text-sm sm:text-base font-bold text-slate-800 dark:text-zinc-200 mt-3 mb-1.5"
            >
              {formatMarkdownInline(block.content)}
            </h4>
          );
        }

        if (block.type === "quote") {
          return (
            <div
              key={idx}
              className="flex items-start gap-2 my-2.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 italic"
            >
              <span className="text-slate-400 dark:text-zinc-500 font-bold select-none text-base leading-none shrink-0">›</span>
              <div className="flex-1 min-w-0 leading-relaxed">
                {formatMarkdownInline(block.content)}
              </div>
            </div>
          );
        }

        if (block.type === "bullet") {
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-2 my-1 text-xs sm:text-sm leading-relaxed">
              <span className="size-1.5 rounded-full bg-slate-500 dark:bg-zinc-400 mt-2 shrink-0 select-none" />
              <div className="flex-1 min-w-0">{formatMarkdownInline(block.content)}</div>
            </div>
          );
        }

        if (block.type === "numbered") {
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-2 my-1 text-xs sm:text-sm leading-relaxed">
              <span className="font-semibold text-slate-700 dark:text-zinc-300 shrink-0 select-none text-xs">
                {block.num}.
              </span>
              <div className="flex-1 min-w-0">{formatMarkdownInline(block.content)}</div>
            </div>
          );
        }

        if (block.type === "code") {
          return (
            <div key={idx} className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117]">
              {block.lang && (
                <div className="px-3 py-1 bg-[#161b22] text-[11px] font-mono text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                  {block.lang}
                </div>
              )}
              <pre className="p-3.5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        if (block.type === "table") {
          return (
            <div
              key={idx}
              className="my-4 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900/60 shadow-xs"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-zinc-800/80 border-b border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 font-semibold">
                      {block.headers.map((h, hIdx) => (
                        <th key={hIdx} className="px-3.5 py-2.5 font-semibold">
                          {formatMarkdownInline(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {block.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3.5 py-2.5 text-slate-700 dark:text-zinc-300">
                            {formatMarkdownInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
            {formatMarkdownInline(block.content)}
          </p>
        );
      })}
    </div>
  );
}
