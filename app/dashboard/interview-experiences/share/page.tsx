"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Code,
  Link2,
  Image as ImageIcon,
  Code2,
  Quote,
  Table as TableIcon,
  RotateCcw,
  Undo2,
  Redo2,
  Plus,
  X,
  Loader2,
  Eye,
  EyeOff,
  Coins,
  CheckCircle2,
  ExternalLink,
  Search,
  BookOpen,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Database,
  Building2,
  Briefcase,
  MapPin,
  Send,
  Save,
  HelpCircle,
  Check,
  LayoutTemplate,
  FileText,
  FileCode,
} from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "sonner";
import { InterviewMarkdownPreview } from "@/components/interview-experiences/markdown-preview";

/* ------------------------------------------------------------------ */
/* Structured Templates (Realistic & Helpful — No Lorem Ipsum)         */
/* ------------------------------------------------------------------ */

export const FULL_LOOP_TEMPLATE = `Recently completed the full software engineering interview loop at **Google** for the L4 role. The entire process took about 3 weeks from the recruiter screen to the hiring committee offer decision.

**Status:** Software Engineer (L4 / Mid-Level)

**Location:** Mountain View, CA / Remote

**Applied Through:** LinkedIn Referral

**Difficulty:** Medium

---

## Online Assessment

**Duration:** 90 minutes | **Method:** HackerRank

The assessment consisted of 2 coding problems followed by 10 multiple-choice questions on operating systems and DBMS fundamentals:

* [Sliding Window Substring with Character Constraints] - Tricky edge case with duplicate characters
* [Graph Traversal with Dynamic Weighting] - Medium difficulty pathfinding problem with BFS/Dijkstra
* [CS Fundamentals] - Questions on OS threading, locks, virtual memory, and SQL index types

Make sure to test edge cases with empty arrays, large bounds (10^9), and negative values before submitting.

> Write modular functions and descriptive variable names; hidden test cases ran against strict timeouts.

---

## Technical Round 1

**Duration:** 45 minutes | **Method:** Google Meet & Google Docs

| No. | Name | ID |
| --- | --- | --- |
| 1. | [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) | 236 |
| 2. | [Word Break II](https://leetcode.com/problems/word-break-ii/) | 140 |

Topics and concepts tested:
* Binary Trees & Recursion
* Memoization & Backtracking
* Time Complexity Trade-offs (O(N) vs O(2^N))

The interviewer started by asking me to explain recursive vs iterative tree traversals. Then moved directly to coding LCA with constraints. After completing that in 20 minutes, they asked Word Break as a follow-up.

> Speak out your thought process before writing a single line of code; interviewers evaluate your communication just as much as your code.

---

## Technical Round 2

**Duration:** 45 minutes | **Method:** Google Meet & CoderPad

| No. | Name | ID |
| --- | --- | --- |
| 1. | [Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) | 210 |

The coding questions included:
* [Topological Sorting with Cycle Detection](https://leetcode.com/problems/course-schedule-ii/) - Given N prerequisites and course dependencies, find the valid order to finish all courses or return empty array if impossible.
* Follow-up: What if each course has a required duration and tasks can run concurrently across K workers?

After the coding discussion, they asked questions on:
* Kahn's Algorithm (BFS with indegree array) vs DFS with 3-color states
* Thread pools and concurrent task scheduling

### Approach

Started by building an adjacency list graph and an indegree count array. Pushed all nodes with indegree 0 into a FIFO queue. In each iteration, popped a course, appended it to the topological order list, and decremented the indegrees of its neighbors. If any neighbor's indegree reached 0, added it to the queue. Checked whether the result length equaled total courses to detect cycles.

> Clearly explain space complexity trade-offs between adjacency list vs matrix representation.

---

## Preparation Strategy

* Solved around 250 problems focusing on Blind 75 and company-tagged questions on Algoryn.
* Practiced mock interviews weekly on Pramp and with peers to get comfortable talking while coding.
* Read the *System Design Primer* for high-level concepts and trade-offs.

## Final Advice

* Clarify constraints, input bounds, and edge cases (null inputs, duplicate numbers, disconnected components) before coding.
* Treat the interviewer as a teammate working through the problem together.`;

export const OA_AND_TECH_TEMPLATE = `Recently interviewed for the Software Engineer role at **Amazon**. The overall hiring experience was smooth and fast-paced.

**Status:** Software Development Engineer (SDE-1)

**Location:** Seattle, WA / Hybrid

**Applied Through:** University Career Portal

**Difficulty:** Medium

---

## Online Assessment

**Duration:** 90 minutes | **Method:** HackerRank

The OA had 2 algorithmic problems and a 15-minute Amazon Leadership Principles assessment:

* [Package Delivery Route Optimization] - Greedy / Min-Heap scheduling
* [Customer Query Frequency Stream] - Hash Map + Doubly Linked List (LRU pattern)

> For Amazon OAs, passing both coding questions with 100% test cases is essential before behavioral review.

---

## Technical Round 1

**Duration:** 60 minutes | **Method:** Chime & LiveCode

| No. | Name | ID |
| --- | --- | --- |
| 1. | [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) | 994 |

Topics and concepts tested:
* Multi-source BFS
* Matrix boundary validation
* Amazon Leadership Principles (Customer Obsession, Ownership)

### Approach

Used multi-source Breadth-First Search. Pushed all initially rotten orange coordinates into a queue and counted the total fresh oranges. In each round of BFS, expanded in 4 cardinal directions and converted adjacent fresh oranges to rotten. Decremented the fresh orange counter each time. Returned the elapsed minutes if fresh oranges reached 0, otherwise returned -1.

> Focus on Amazon Leadership Principles for at least 20 minutes of the round. Have STAR method stories ready.

---

## Final Advice

* Ask clarifying questions regarding constraints (e.g. empty grid, no rotten oranges, no fresh oranges).
* Be crisp with your time and space complexity explanations.`;

export const BLANK_TEMPLATE = `[Introduction describing the interview experience and company]

**Status:** [Job Title / Level]

**Location:** [City, State / Country]

**Applied Through:** [Application Platform / Referral]

**Difficulty:** [Easy / Medium / Hard]

---

## Technical Round 1

**Duration:** [X] minutes | **Method:** [Platform Name]

| No. | Name | ID |
| --- | --- | --- |
| 1. | [Problem title](https://example.com) | Problem ID |

Topics and concepts tested:
* [Topic 1]
* [Topic 2]

### Approach

[Explain the approach, reasoning, algorithms, or concepts discussed.]

> [Important takeaway.]`;

const POPULAR_TAG_SUGGESTIONS = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Uber",
  "Apple",
  "Atlassian",
  "Adobe",
  "Online Assessment",
  "Technical Round",
  "System Design",
  "Full-Time",
  "Internship",
  "Offer",
];

interface AlgorynProblemItem {
  id: number;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  leetcodeNumber?: number | null;
  leetcodeUrl?: string;
  topics?: string[];
}

export default function ShareInterviewExperiencePage() {
  const router = useRouter();
  const { user } = useAuth();
  const currentUserId = user?.uid || null;

  // Primary post states
  const [title, setTitle] = useState("Google L4 Software Engineer Interview Experience 2026");
  const [content, setContent] = useState(FULL_LOOP_TEMPLATE);
  const [tags, setTags] = useState<string[]>(["Google", "Interview Experience", "Full-Time", "Offer"]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Metadata synchronizer states
  const [metaCompany, setMetaCompany] = useState("Google");
  const [metaRole, setMetaRole] = useState("Software Engineer (L4 / Mid-Level)");
  const [metaLocation, setMetaLocation] = useState("Mountain View, CA / Remote");
  const [metaAppliedThrough, setMetaAppliedThrough] = useState("LinkedIn Referral");
  const [metaDifficulty, setMetaDifficulty] = useState("Medium");
  const [showMetaDrawer, setShowMetaDrawer] = useState(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInputOpen, setTagInputOpen] = useState(false);
  const [tagInputValue, setTagInputValue] = useState("");
  const [activeMobileTab, setActiveMobileTab] = useState<"edit" | "preview">("edit");
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Problem Search Modal state
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [problemSearchQuery, setProblemSearchQuery] = useState("");
  const [problemSearchResults, setProblemSearchResults] = useState<AlgorynProblemItem[]>([]);
  const [isSearchingProblems, setIsSearchingProblems] = useState(false);
  const [problemModalTab, setProblemModalTab] = useState<"algoryn" | "custom">("algoryn");
  const [customProblemTitle, setCustomProblemTitle] = useState("");
  const [customProblemId, setCustomProblemId] = useState("");
  const [customProblemUrl, setCustomProblemUrl] = useState("");

  // Link insertion Modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  // Section templates modal
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showCodeTemplateMenu, setShowCodeTemplateMenu] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);
  const templateMenuRef = useRef<HTMLDivElement>(null);
  const codeTemplateMenuRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<string[]>([FULL_LOOP_TEMPLATE]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Load saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("algoryn_structured_draft_v4");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.content) {
          setContent(parsed.content);
          setHistory([parsed.content]);
          setHistoryIndex(0);
        }
        if (Array.isArray(parsed.tags) && parsed.tags.length > 0) {
          setTags(parsed.tags);
        }
        if (typeof parsed.isAnonymous === "boolean") {
          setIsAnonymous(parsed.isAnonymous);
        }
        if (parsed.savedAt) {
          setLastSavedTime(new Date(parsed.savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }
      }
    } catch {
      // ignore parsing errors
    }
  }, []);

  // Autosave draft every 10 seconds or on modification
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const draft = {
          title,
          content,
          tags,
          isAnonymous,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem("algoryn_structured_draft_v4", JSON.stringify(draft));
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } catch {}
    }, 3000);

    return () => clearTimeout(timer);
  }, [title, content, tags, isAnonymous]);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(e.target as Node)) {
        setTagInputOpen(false);
      }
      if (templateMenuRef.current && !templateMenuRef.current.contains(e.target as Node)) {
        setShowTemplateMenu(false);
      }
      if (codeTemplateMenuRef.current && !codeTemplateMenuRef.current.contains(e.target as Node)) {
        setShowCodeTemplateMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Query Algoryn problems when problem search query changes
  useEffect(() => {
    if (!showProblemModal || problemModalTab !== "algoryn") return;

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingProblems(true);
      try {
        const res = await fetch(`/api/problems?search=${encodeURIComponent(problemSearchQuery.trim())}&limit=8`);
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setProblemSearchResults(json.data);
        } else {
          setProblemSearchResults([]);
        }
      } catch {
        setProblemSearchResults([]);
      } finally {
        setIsSearchingProblems(false);
      }
    }, 250);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [problemSearchQuery, showProblemModal, problemModalTab]);

  // Update content with undo/redo history tracking
  const updateContentWithHistory = (newVal: string) => {
    setContent(newVal);
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newVal];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setContent(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setContent(next);
    }
  };

  // Helper to insert Markdown syntax around selection or at cursor
  const insertFormatting = (prefix: string, suffix = "", defaultPlaceholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = selected.length > 0 ? `${prefix}${selected}${suffix}` : `${prefix}${defaultPlaceholder}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    updateContentWithHistory(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = selected.length > 0 ? start + replacement.length : start + prefix.length + defaultPlaceholder.length;
      textarea.setSelectionRange(
        selected.length > 0 ? start : start + prefix.length,
        newCursorPos
      );
    }, 0);
  };

  // Append a structured section to the content
  const appendSection = (sectionMarkdown: string, sectionName: string) => {
    const separator = content.trim().endsWith("---") ? "\n\n" : "\n\n---\n\n";
    const newContent = `${content.trim()}${separator}${sectionMarkdown.trim()}\n`;
    updateContentWithHistory(newContent);
    toast.success(`Added ${sectionName} section`);
    setShowSectionPicker(false);
  };

  // Insert a real Algoryn problem or custom problem into table
  const insertProblemRow = (item: { title: string; id: string; url: string }) => {
    const textarea = textareaRef.current;
    const cleanUrl = item.url.trim();
    const problemLink = cleanUrl ? `[${item.title}](${cleanUrl})` : item.title;

    // Detect if content already contains a markdown table
    const tableRegex = /\| No\. \| Name \| ID \|/i;
    const hasExistingTable = tableRegex.test(content);

    if (hasExistingTable) {
      // Find the last row of the table and compute next row number
      const lines = content.split("\n");
      let insertIndex = -1;
      let nextRowNo = 1;

      for (let i = lines.length - 1; i >= 0; i--) {
        const trimmed = lines[i].trim();
        if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
          const matchNo = trimmed.match(/\|\s*(\d+)\.?\s*\|/);
          if (matchNo) {
            nextRowNo = parseInt(matchNo[1], 10) + 1;
          }
          insertIndex = i + 1;
          break;
        }
      }

      if (insertIndex !== -1) {
        const newRow = `| ${nextRowNo}. | ${problemLink} | ${item.id} |`;
        lines.splice(insertIndex, 0, newRow);
        updateContentWithHistory(lines.join("\n"));
        toast.success(`Added "${item.title}" to table`);
        setShowProblemModal(false);
        return;
      }
    }

    // Otherwise insert a new table snippet at cursor
    const tableSnippet = `\n\n| No. | Name | ID |\n| --- | --- | --- |\n| 1. | ${problemLink} | ${item.id} |\n\n`;
    insertFormatting(tableSnippet, "");
    toast.success(`Inserted problem table with "${item.title}"`);
    setShowProblemModal(false);
  };

  // Synchronize Metadata form with markdown overview block
  const handleSyncMetadataToPost = () => {
    let updated = content;

    // Replace Company in first paragraph if pattern matches
    if (metaCompany.trim()) {
      updated = updated.replace(/\*\*([A-Za-z0-9\s&.-]+)\*\*/, `**${metaCompany.trim()}**`);
    }

    // Replace Status
    if (metaRole.trim()) {
      if (/\*\*Status:\*\*\s*[^\n\r]+/i.test(updated)) {
        updated = updated.replace(/\*\*Status:\*\*\s*[^\n\r]+/i, `**Status:** ${metaRole.trim()}`);
      } else {
        updated = `**Status:** ${metaRole.trim()}\n\n` + updated;
      }
    }

    // Replace Location
    if (metaLocation.trim()) {
      if (/\*\*Location:\*\*\s*[^\n\r]+/i.test(updated)) {
        updated = updated.replace(/\*\*Location:\*\*\s*[^\n\r]+/i, `**Location:** ${metaLocation.trim()}`);
      }
    }

    // Replace Applied Through
    if (metaAppliedThrough.trim()) {
      if (/\*\*Applied Through:\*\*\s*[^\n\r]+/i.test(updated)) {
        updated = updated.replace(/\*\*Applied Through:\*\*\s*[^\n\r]+/i, `**Applied Through:** ${metaAppliedThrough.trim()}`);
      }
    }

    // Replace Difficulty
    if (metaDifficulty.trim()) {
      if (/\*\*Difficulty:\*\*\s*[^\n\r]+/i.test(updated)) {
        updated = updated.replace(/\*\*Difficulty:\*\*\s*[^\n\r]+/i, `**Difficulty:** ${metaDifficulty.trim()}`);
      }
    }

    updateContentWithHistory(updated);
    toast.success("Synchronized metadata fields with post overview!");
  };

  // Save Draft Manually
  const handleSaveDraft = () => {
    try {
      const draft = {
        title,
        content,
        tags,
        isAnonymous,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("algoryn_structured_draft_v4", JSON.stringify(draft));
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      toast.success("Draft saved successfully to local storage!");
    } catch {
      toast.error("Could not save draft");
    }
  };

  // Tag Management
  const handleAddTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim().replace(/^#/, "");
    if (!clean) return;
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInputValue("");
    setTagInputOpen(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Submit Post
  const handleSubmitPost = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your interview experience");
      return;
    }

    if (!content.trim()) {
      toast.error("Please write your interview experience before submitting");
      return;
    }

    // Extract company heuristic
    let extractedCompany = metaCompany.trim() || "General";
    for (const t of tags) {
      if (POPULAR_TAG_SUGGESTIONS.slice(0, 8).includes(t)) {
        extractedCompany = t;
        break;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        tags,
        company: extractedCompany,
        role: metaRole.trim() || "Software Engineer",
        round: "Full Interview Loop",
        verdict: metaDifficulty === "Easy" ? "Offer" : "Offer",
        difficulty: metaDifficulty || "Medium",
        isAnonymous,
        userId: isAnonymous ? null : currentUserId,
        authorName: isAnonymous ? "Anonymous" : user?.displayName || "Coder",
        authorHandle: isAnonymous ? "@anonymous" : user?.email ? `@${user.email.split("@")[0]}` : null,
        avatarUrl: isAnonymous ? null : user?.photoURL || null,
      };

      const res = await fetch("/api/interview-experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to publish interview experience");
      }

      // Clear draft on successful submission
      try {
        localStorage.removeItem("algoryn_structured_draft_v4");
      } catch {}

      toast.success(
        isAnonymous
          ? "Interview experience published anonymously!"
          : "Interview experience published successfully!"
      );

      if (data.id) {
        router.push(`/dashboard/interview-experiences/${data.id}`);
      } else {
        router.push("/dashboard/interview-experiences");
      }
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to publish interview experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-slate-800 dark:text-zinc-200 transition-colors">
      {/* Main Content Area (Full Page Width - No Redundant Second Header) */}
      <main className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 space-y-3.5">
        {/* Top Action Bar: Template Chooser, Autosave Status, Save as Draft, Submit Post */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-1">
          {/* Left: Template Switcher & Add Section Shortcut */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Template Selection Dropdown with React Icons */}
            <div className="relative inline-block" ref={templateMenuRef}>
              <button
                type="button"
                onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-slate-300 dark:hover:border-zinc-600 text-xs font-semibold transition-colors cursor-pointer outline-none shadow-2xs"
              >
                <LayoutTemplate className="size-3.5 text-blue-600 dark:text-blue-400" />
                <span>Choose Template</span>
                <ChevronDown className={`size-3 text-slate-400 transition-transform duration-200 ${showTemplateMenu ? "rotate-180" : ""}`} />
              </button>

              {showTemplateMenu && (
                <div className="absolute left-0 mt-1.5 w-72 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    Interview Templates
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTemplateMenu(false);
                      if (confirm("Load Google Full-Loop Template? Current text will be replaced.")) {
                        updateContentWithHistory(FULL_LOOP_TEMPLATE);
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <div className="size-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      <Code2 className="size-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-zinc-200">Google Full-Loop</div>
                      <div className="text-[11px] text-slate-400 dark:text-zinc-500">OA + 2 Tech + Approach</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTemplateMenu(false);
                      if (confirm("Load Amazon OA + 1 Round Template? Current text will be replaced.")) {
                        updateContentWithHistory(OA_AND_TECH_TEMPLATE);
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <div className="size-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                      <Briefcase className="size-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-zinc-200">Amazon Loop</div>
                      <div className="text-[11px] text-slate-400 dark:text-zinc-500">OA + 1 Tech + Leadership</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTemplateMenu(false);
                      if (confirm("Start with a Blank Template? Current text will be replaced.")) {
                        updateContentWithHistory(BLANK_TEMPLATE);
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <div className="size-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <FileText className="size-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-zinc-200">Blank Post Template</div>
                      <div className="text-[11px] text-slate-400 dark:text-zinc-500">Clean structure scaffold</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Add Section Quick Menu Button */}
            <button
              type="button"
              onClick={() => setShowSectionPicker(!showSectionPicker)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Section</span>
            </button>

            {/* Quick Metadata Form Toggle */}
            <button
              type="button"
              onClick={() => setShowMetaDrawer(!showMetaDrawer)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                showMetaDrawer
                  ? "bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400"
                  : "border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:text-blue-600"
              }`}
            >
              <SlidersHorizontal className="size-3.5" />
              <span>Metadata Fields</span>
            </button>

            {/* Search Algoryn Problem Bank */}
            <button
              type="button"
              onClick={() => {
                setProblemModalTab("algoryn");
                setShowProblemModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium hover:bg-emerald-100/60 transition-colors cursor-pointer"
            >
              <Database className="size-3.5 text-emerald-600" />
              <span>Search Question Collection</span>
            </button>
          </div>

          {/* Right: Autosave status + Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            {lastSavedTime && (
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 hidden md:inline-flex items-center gap-1">
                <Check className="size-3 text-emerald-500" />
                <span>Saved draft {lastSavedTime}</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={isSubmitting || !title.trim()}
              onClick={handleSubmitPost}
              className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs ${
                !title.trim()
                  ? "bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 cursor-not-allowed opacity-80"
                  : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md active:scale-98"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Post</span>
              )}
            </button>
          </div>
        </div>

        {/* Optional Add Section Popover Menu */}
        {showSectionPicker && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-3 sm:p-4 shadow-xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 animate-in fade-in duration-150">
            <button
              type="button"
              onClick={() =>
                appendSection(
                  `## Online Assessment\n\n**Duration:** 90 minutes | **Method:** HackerRank\n\n[Describe the assessment format and time constraints.]\n\n* [Problem 1: Topic / Constraints]\n* [Problem 2: Topic / Constraints]\n\n[Additional observations on question difficulty and hidden test cases.]\n\n> [Important takeaway or assessment tip.]`,
                  "Online Assessment"
                )
              }
              className="p-2.5 text-left rounded-xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-zinc-700/60 transition-colors group cursor-pointer"
            >
              <div className="font-bold text-xs text-slate-800 dark:text-zinc-200 group-hover:text-blue-600">
                + Online Assessment
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Duration, method & OA problem list</div>
            </button>

            <button
              type="button"
              onClick={() =>
                appendSection(
                  `## Technical Round 3\n\n**Duration:** 45 minutes | **Method:** Google Meet & CoderPad\n\n| No. | Name | ID |\n| --- | --- | --- |\n| 1. | [Problem Title / Name](https://example.com) | Problem ID |\n\nTopics and concepts tested:\n* [Topic 1]\n* [Topic 2]\n\n[Explain the discussion and questions asked.]\n\n### Approach\n\n[Explain your thought process, data structures, and edge cases.]\n\n> [Key takeaway from this round.]`,
                  "Technical Round"
                )
              }
              className="p-2.5 text-left rounded-xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-zinc-700/60 transition-colors group cursor-pointer"
            >
              <div className="font-bold text-xs text-slate-800 dark:text-zinc-200 group-hover:text-blue-600">
                + Technical Round
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Coding problem table & Approach</div>
            </button>

            <button
              type="button"
              onClick={() =>
                appendSection(
                  `## System Design Round\n\n**Duration:** 60 minutes | **Method:** Zoom & Excalidraw\n\n**Design Question:** [e.g. Design a Distributed Key-Value Store / Video Streaming Platform]\n\nKey areas discussed:\n* Functional Requirements: [Low latency read/write, pagination]\n* Non-Functional Requirements: [99.99% Availability, Consistency model]\n* High-Level Architecture: [Load Balancers, Microservices, Cache, DB Sharding]\n\n### Architecture & Trade-offs\n\n[Explain SQL vs NoSQL choices, cache eviction strategies, and replication topology.]\n\n> Focus on back-of-the-envelope estimation early on.`,
                  "System Design"
                )
              }
              className="p-2.5 text-left rounded-xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-zinc-700/60 transition-colors group cursor-pointer"
            >
              <div className="font-bold text-xs text-slate-800 dark:text-zinc-200 group-hover:text-blue-600">
                + System Design
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">HLD/LLD requirements & trade-offs</div>
            </button>

            <button
              type="button"
              onClick={() =>
                appendSection(
                  `## Behavioral & Hiring Manager Round\n\n**Duration:** 45 minutes | **Method:** Google Meet\n\nKey questions asked (STAR Method):\n* "Tell me about a difficult technical conflict you had with a teammate and how you resolved it."\n* "Describe a project where you took leadership outside your usual responsibilities."\n* "How do you handle ambiguous requirements and tight production deadlines?"\n\n> Ground your answers in real metrics, measurable outcomes, and what you learned.`,
                  "Behavioral Round"
                )
              }
              className="p-2.5 text-left rounded-xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-zinc-700/60 transition-colors group cursor-pointer"
            >
              <div className="font-bold text-xs text-slate-800 dark:text-zinc-200 group-hover:text-blue-600">
                + Behavioral / HR
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">STAR behavioral questions & tips</div>
            </button>

            <button
              type="button"
              onClick={() =>
                appendSection(
                  `## Preparation Strategy\n\n* Solved ~250 problems focusing on Blind 75 and company-tagged questions on Algoryn.\n* Practiced weekly peer mock interviews on Pramp to build communication confidence.\n* Reviewed core CS fundamentals (OS Virtual Memory, Concurrency, and DBMS Indexing).`,
                  "Preparation Strategy"
                )
              }
              className="p-2.5 text-left rounded-xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-zinc-700/60 transition-colors group cursor-pointer"
            >
              <div className="font-bold text-xs text-slate-800 dark:text-zinc-200 group-hover:text-blue-600">
                + Prep Strategy
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Resources used and problem counts</div>
            </button>

            <button
              type="button"
              onClick={() =>
                appendSection(
                  `## Final Advice\n\n* Always clarify constraints, input edge cases, and bounds before typing code.\n* Keep talking through your thoughts; treat the interviewer like a teammate, not an examiner.\n* Verify your solution with a sample dry-run walk-through before declaring completion.`,
                  "Final Advice"
                )
              }
              className="p-2.5 text-left rounded-xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-zinc-700/60 transition-colors group cursor-pointer"
            >
              <div className="font-bold text-xs text-slate-800 dark:text-zinc-200 group-hover:text-blue-600">
                + Final Advice
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Key takeaways and interview tips</div>
            </button>
          </div>
        )}

        {/* Expandable Synchronized Metadata Form Bar */}
        {showMetaDrawer && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-blue-200 dark:border-blue-900/50 p-4 shadow-sm space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="size-3.5" />
                Synchronize Overview Metadata
              </span>
              <button
                type="button"
                onClick={handleSyncMetadataToPost}
                className="text-xs font-semibold px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Sync to Markdown</span>
                <Check className="size-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-zinc-400 font-medium mb-1">Company</label>
                <input
                  type="text"
                  value={metaCompany}
                  onChange={(e) => setMetaCompany(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-zinc-400 font-medium mb-1">Role / Status</label>
                <input
                  type="text"
                  value={metaRole}
                  onChange={(e) => setMetaRole(e.target.value)}
                  placeholder="e.g. Software Engineer (L4)"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-zinc-400 font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={metaLocation}
                  onChange={(e) => setMetaLocation(e.target.value)}
                  placeholder="e.g. Mountain View, CA / Remote"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-zinc-400 font-medium mb-1">Applied Through</label>
                <input
                  type="text"
                  value={metaAppliedThrough}
                  onChange={(e) => setMetaAppliedThrough(e.target.value)}
                  placeholder="e.g. LinkedIn Referral"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-zinc-400 font-medium mb-1">Difficulty</label>
                <select
                  value={metaDifficulty}
                  onChange={(e) => setMetaDifficulty(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Title of Post Container */}
        <div className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-slate-200/90 dark:border-zinc-800 p-4 sm:p-5 shadow-2xs space-y-3 focus-within:border-blue-500/80 transition-all">
          <label
            htmlFor="post-title-input"
            className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider"
          >
            Title of Post
          </label>
          <input
            id="post-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your title..."
            className="w-full bg-transparent text-base sm:text-lg font-semibold text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none border-none p-0 focus:ring-0 leading-relaxed"
          />

          {/* Tags & Anonymous Toggle Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-zinc-800/60">
            {/* Left: Tags */}
            <div className="flex flex-wrap items-center gap-2" ref={tagDropdownRef}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/60 group"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-red-500 transition-colors ml-0.5 cursor-pointer"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}

              {/* Tags + button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTagInputOpen(!tagInputOpen)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:border-slate-300 dark:hover:border-zinc-600 transition-colors cursor-pointer bg-white dark:bg-zinc-900"
                >
                  <span>Tags</span>
                  <Plus className="size-3" />
                </button>

                {/* Tag Selection Dropdown */}
                {tagInputOpen && (
                  <div className="absolute left-0 mt-2 w-64 p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-slate-200 dark:border-zinc-800 z-50 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center gap-1 border-b border-slate-100 dark:border-zinc-800 pb-2">
                      <input
                        type="text"
                        value={tagInputValue}
                        onChange={(e) => setTagInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag(tagInputValue);
                          }
                        }}
                        placeholder="Add tag and press Enter..."
                        className="w-full text-xs bg-transparent outline-none text-slate-800 dark:text-zinc-200 placeholder:text-slate-400"
                        autoFocus
                      />
                      {tagInputValue && (
                        <button
                          type="button"
                          onClick={() => handleAddTag(tagInputValue)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 px-1 cursor-pointer"
                        >
                          Add
                        </button>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1.5">
                        Suggested Tags
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                        {POPULAR_TAG_SUGGESTIONS.map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => handleAddTag(sug)}
                            disabled={tags.includes(sug)}
                            className={`text-[11px] px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                              tags.includes(sug)
                                ? "bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600 cursor-default"
                                : "bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400"
                            }`}
                          >
                            +{sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Anonymous Toggle Button */}
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer ${
                isAnonymous
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-xs hover:bg-emerald-100/60"
                  : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:text-slate-900 dark:hover:text-zinc-200 hover:border-slate-300"
              }`}
              title="Toggle Anonymous Posting"
            >
              {isAnonymous ? (
                <EyeOff className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Eye className="size-3.5 text-slate-400" />
              )}
              <span>{isAnonymous ? "Anonymous Active" : "Post as Anonymous"}</span>
              <span
                className={`size-1.5 rounded-full ${
                  isAnonymous ? "bg-emerald-500 animate-pulse" : "bg-slate-300 dark:bg-zinc-600"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile View Tab Switcher */}
        <div className="flex lg:hidden items-center justify-center p-1 rounded-xl bg-slate-200/80 dark:bg-zinc-800/80 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setActiveMobileTab("edit")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeMobileTab === "edit"
                ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs"
                : "text-slate-600 dark:text-zinc-400"
            }`}
          >
            Markdown Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab("preview")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeMobileTab === "preview"
                ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs"
                : "text-slate-600 dark:text-zinc-400"
            }`}
          >
            Live Preview
          </button>
        </div>

        {/* 2-Column Split: Editor (Left) & Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-stretch w-full flex-1">
          {/* Left Column: Markdown Editor */}
          <div
            className={`bg-white dark:bg-zinc-900/60 rounded-2xl border border-slate-200/90 dark:border-zinc-800 shadow-2xs flex flex-col overflow-hidden min-h-[calc(100vh-270px)] ${
              activeMobileTab === "preview" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* TakeUforward-Accurate Formatting Toolbar */}
            <div className="p-2 sm:p-2.5 border-b border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-900/90 flex flex-wrap items-center gap-1 text-slate-700 dark:text-zinc-300 select-none">
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => insertFormatting("**", "**", "bold text")}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Bold (**text**)"
                >
                  <Bold className="size-3.5 sm:size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("*", "*", "italic text")}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Italic (*text*)"
                >
                  <Italic className="size-3.5 sm:size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<u>", "</u>", "underlined text")}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Underline (<u>text</u>)"
                >
                  <Underline className="size-3.5 sm:size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("~~", "~~", "strikethrough text")}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Strikethrough (~~text~~)"
                >
                  <Strikethrough className="size-3.5 sm:size-4" />
                </button>
              </div>

              <div className="w-px h-4 bg-slate-300 dark:bg-zinc-700 mx-1" />

              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => insertFormatting("\n* ", "", "List item")}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Bullet List (* item)"
                >
                  <List className="size-3.5 sm:size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("\n1. ", "", "Numbered item")}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Numbered List (1. item)"
                >
                  <ListOrdered className="size-3.5 sm:size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("\n## ", "", "Heading Title")}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Heading 2 (## Title)"
                >
                  <span className="font-bold text-xs sm:text-sm font-sans">H2</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("`", "`", "code")}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Inline Code (`code`)"
                >
                  <Code className="size-3.5 sm:size-4" />
                </button>
              </div>

              <div className="w-px h-4 bg-slate-300 dark:bg-zinc-700 mx-1" />

              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    const textarea = textareaRef.current;
                    const selected = textarea
                      ? content.substring(textarea.selectionStart, textarea.selectionEnd)
                      : "";
                    setLinkText(selected || "problem title");
                    setLinkUrl("https://");
                    setShowLinkModal(true);
                  }}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Insert Link ([text](url))"
                >
                  <Link2 className="size-3.5 sm:size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("![Image description](", ")", "https://example.com/image.png")}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Insert Image (![alt](url))"
                >
                  <ImageIcon className="size-3.5 sm:size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("\n```cpp\n", "\n```\n", "// write code here")}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Code Block (```)"
                >
                  <Code2 className="size-3.5 sm:size-4" />
                </button>
                {/* Code Solution Template Menu */}
                <div className="relative inline-block" ref={codeTemplateMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowCodeTemplateMenu(!showCodeTemplateMenu)}
                    className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                    title="Insert Code Solution Template (C++, Python, Java, TS)"
                  >
                    <FileCode className="size-3.5 sm:size-4 text-blue-600 dark:text-blue-400" />
                  </button>

                  {showCodeTemplateMenu && (
                    <div className="absolute left-0 mt-1 w-56 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                        Code Templates
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          insertFormatting(
                            "\n```cpp\n// Time Complexity: O(N) | Space Complexity: O(1)\nclass Solution {\npublic:\n    void solve() {\n        // Your code here\n    }\n};\n```\n",
                            ""
                          );
                          setShowCodeTemplateMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer"
                      >
                        <Code2 className="size-3.5 text-blue-500" />
                        <span>C++ Solution Template</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          insertFormatting(
                            "\n```python\n# Time Complexity: O(N) | Space Complexity: O(1)\nclass Solution:\n    def solve(self):\n        # Your code here\n        pass\n```\n",
                            ""
                          );
                          setShowCodeTemplateMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer"
                      >
                        <Code2 className="size-3.5 text-amber-500" />
                        <span>Python Solution Template</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          insertFormatting(
                            "\n```java\n// Time Complexity: O(N) | Space Complexity: O(1)\nclass Solution {\n    public void solve() {\n        // Your code here\n    }\n}\n```\n",
                            ""
                          );
                          setShowCodeTemplateMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer"
                      >
                        <Code2 className="size-3.5 text-red-500" />
                        <span>Java Solution Template</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          insertFormatting(
                            "\n```typescript\n// Time Complexity: O(N) | Space Complexity: O(1)\nfunction solve(): void {\n    // Your code here\n}\n```\n",
                            ""
                          );
                          setShowCodeTemplateMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer"
                      >
                        <Code2 className="size-3.5 text-emerald-500" />
                        <span>JavaScript / TypeScript</span>
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => insertFormatting("\n> ", "", "Quote or note here")}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Blockquote (> quote)"
                >
                  <Quote className="size-3.5 sm:size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tableTemplate = `\n\n| No. | Name | ID |\n| --- | --- | --- |\n| 1. | [Problem Title / Name](https://example.com) | 1 |\n\n`;
                    insertFormatting(tableTemplate, "");
                  }}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Insert Markdown Table (| No. | Name | ID |)"
                >
                  <TableIcon className="size-3.5 sm:size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProblemModalTab("algoryn");
                    setShowProblemModal(true);
                  }}
                  className="px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold text-xs transition-colors"
                  title="Search & Insert Algoryn Problem to Table"
                >
                  <Database className="size-3.5" />
                  <span className="hidden sm:inline">Add Question</span>
                </button>
              </div>

              <div className="w-px h-4 bg-slate-300 dark:bg-zinc-700 mx-1" />

              <div className="flex items-center gap-0.5 ml-auto">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="size-3.5 sm:size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="size-3.5 sm:size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset editor to original template? Current changes will be overwritten.")) {
                      updateContentWithHistory(FULL_LOOP_TEMPLATE);
                    }
                  }}
                  className="size-7 sm:size-8 rounded-lg flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-500 hover:text-red-500 transition-colors ml-1"
                  title="Reset to Default Template"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Markdown Textarea */}
            <div className="relative flex-1 p-4 sm:p-5 flex flex-col min-h-[calc(100vh-270px)]">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => updateContentWithHistory(e.target.value)}
                placeholder="Write your structured interview experience in Markdown..."
                className="w-full flex-1 min-h-[calc(100vh-380px)] bg-transparent text-xs sm:text-sm font-mono text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 outline-none resize-none leading-relaxed selection:bg-blue-100 dark:selection:bg-blue-900/50"
                spellCheck={false}
              />

              {/* Bottom editor status */}
              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500">
                <div className="flex items-center gap-3">
                  <span>{content.length} characters</span>
                  <span>•</span>
                  <span>{content.trim() ? content.trim().split(/\s+/).length : 0} words</span>
                </div>
                <span className="hidden sm:inline italic">Structured Markdown format with problem tables & links</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Formatted Preview */}
          <div
            className={`bg-white dark:bg-zinc-900/60 rounded-2xl border border-slate-200/90 dark:border-zinc-800 shadow-2xs flex flex-col overflow-hidden min-h-[calc(100vh-270px)] ${
              activeMobileTab === "edit" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Live Preview Header */}
            <div className="px-4 sm:px-5 py-3 border-b border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-900/90 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 tracking-wide uppercase">
                  Live Preview
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-zinc-500 font-medium">
                {isAnonymous ? (
                  <span className="inline-flex items-center gap-1 text-slate-600 dark:text-zinc-400">
                    <EyeOff className="size-3" /> Anonymous
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="size-3" /> {user?.displayName || "Author"}
                  </span>
                )}
              </div>
            </div>

            {/* Live Preview Render Area */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[calc(100vh-330px)]">
              {/* Optional Post Title Preview */}
              {title.trim() && (
                <div className="mb-4 pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight leading-snug">
                    {title}
                  </h1>
                </div>
              )}

              {/* Formatted Markdown Content */}
              <InterviewMarkdownPreview content={content} />
            </div>
          </div>
        </div>
      </main>

      {/* Algoryn Problem Bank Picker Modal */}
      {showProblemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 w-full max-w-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="size-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  Insert Coding Problem to Table
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProblemModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Tabs: Algoryn Database vs Custom/External Problem */}
            <div className="flex border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 px-5 pt-2 gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setProblemModalTab("algoryn")}
                className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
                  problemModalTab === "algoryn"
                    ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Algoryn Problem Collection
              </button>
              <button
                type="button"
                onClick={() => setProblemModalTab("custom")}
                className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
                  problemModalTab === "custom"
                    ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Custom / External Problem
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {problemModalTab === "algoryn" ? (
                <>
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={problemSearchQuery}
                      onChange={(e) => setProblemSearchQuery(e.target.value)}
                      placeholder="Search Algoryn problems by title or topic (e.g. Tree, Graph, Two Sum)..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 outline-none focus:border-emerald-500"
                      autoFocus
                    />
                  </div>

                  {/* Results List */}
                  {isSearchingProblems ? (
                    <div className="py-10 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin text-emerald-600" />
                      <span>Searching Algoryn problem collection...</span>
                    </div>
                  ) : problemSearchResults.length > 0 ? (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Verified Algoryn Questions ({problemSearchResults.length})
                      </span>
                      {problemSearchResults.map((prob) => {
                        const difficultyColor =
                          prob.difficulty === "HARD"
                            ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:border-red-800"
                            : prob.difficulty === "MEDIUM"
                            ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800"
                            : "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800";

                        return (
                          <div
                            key={prob.id}
                            className="p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 hover:border-emerald-500/80 bg-slate-50/50 dark:bg-zinc-800/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all flex items-center justify-between gap-3 group"
                          >
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-xs text-slate-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors">
                                  {prob.title}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${difficultyColor}`}
                                >
                                  {prob.difficulty}
                                </span>
                                {prob.leetcodeNumber && (
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    #{prob.leetcodeNumber}
                                  </span>
                                )}
                              </div>
                              {prob.topics && prob.topics.length > 0 && (
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                                  {prob.topics.join(" · ")}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                insertProblemRow({
                                  title: prob.title,
                                  id: String(prob.leetcodeNumber || prob.id),
                                  url: prob.leetcodeUrl || `/dashboard/problems/${prob.slug}`,
                                })
                              }
                              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                            >
                              Add to Table
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : problemSearchQuery ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No matching problems found in Algoryn bank. Try another keyword or add as a custom problem.
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-slate-400">
                      Type in the box above to search through Algoryn&apos;s coding question bank.
                    </div>
                  )}
                </>
              ) : (
                /* Custom Problem Tab */
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">
                      Problem Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customProblemTitle}
                      onChange={(e) => setCustomProblemTitle(e.target.value)}
                      placeholder="e.g. Design Underground System / Rotten Oranges"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Problem ID or Number</label>
                    <input
                      type="text"
                      value={customProblemId}
                      onChange={(e) => setCustomProblemId(e.target.value)}
                      placeholder="e.g. 1396 or OA-Q1"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">
                      Optional URL Link (LeetCode, HackerRank, Algoryn)
                    </label>
                    <input
                      type="text"
                      value={customProblemUrl}
                      onChange={(e) => setCustomProblemUrl(e.target.value)}
                      placeholder="https://leetcode.com/problems/..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={!customProblemTitle.trim()}
                      onClick={() => {
                        insertProblemRow({
                          title: customProblemTitle.trim(),
                          id: customProblemId.trim() || "1",
                          url: customProblemUrl.trim(),
                        });
                        setCustomProblemTitle("");
                        setCustomProblemId("");
                        setCustomProblemUrl("");
                      }}
                      className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Insert into Table
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Insert Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 w-full max-w-sm shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Insert Link</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Link Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Lowest Common Ancestor"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Target URL</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (linkUrl.trim()) {
                    insertFormatting(`[${linkText || "link"}](${linkUrl.trim()})`, "");
                  }
                  setShowLinkModal(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
