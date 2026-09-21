"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Briefcase,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Trash2,
  X,
  Save,
  Send,
  Loader2,
  ChevronDown,
  Layers,
  BookOpen,
  Award,
  Eye,
  FileText,
  Image as ImageIcon,
  Upload,
  ExternalLink,
  Target,
  PenLine,
} from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/* Types & Constants                                                  */
/* ------------------------------------------------------------------ */

export interface QuestionItem {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface RoundItem {
  id: string;
  roundType: string;
  duration: string;
  topics: string[];
  questions: QuestionItem[];
  experience: string;
  images: string[];
}

interface DbCompanyItem {
  id: number;
  name: string;
  slug: string;
  problemCount?: number;
}

const POPULAR_COMPANIES = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Apple",
  "Netflix",
  "Uber",
  "Stripe",
  "Salesforce",
  "Atlassian",
  "Adobe",
  "Oracle",
  "Goldman Sachs",
  "Bloomberg",
  "Airbnb",
  "Coinbase",
];

const ROUND_TYPES = [
  "Online Assessment (OA)",
  "Technical Round 1 (DSA)",
  "Technical Round 2 (DSA)",
  "System Design (HLD/LLD)",
  "Hiring Manager / Behavioral",
  "HR / Culture Fit",
  "Take-home Assignment",
];

const COMMON_TOPICS = [
  "Arrays",
  "Strings",
  "Hash Tables",
  "Two Pointers",
  "Sliding Window",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Recursion",
  "Binary Search",
  "System Design",
  "HLD",
  "LLD",
  "Concurrency",
  "Database",
  "Behavioral",
];

const INTERVIEW_TYPES = [
  "Full-Time",
  "Internship",
  "Contract",
  "New Grad / Campus",
];

const VERDICTS = [
  "Offer Accepted",
  "Offer Received",
  "Rejected",
  "In Progress",
];

/* ------------------------------------------------------------------ */
/* Main Share Experience Builder Component                            */
/* ------------------------------------------------------------------ */

export default function ShareExperiencePage() {
  const router = useRouter();
  const { user } = useAuth();
  const currentUserId = user?.uid || null;

  // Form State: Basic Information
  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("Software Engineer");
  const [interviewType, setInterviewType] = useState("Full-Time");
  const [interviewDate, setInterviewDate] = useState("2026");
  const [result, setResult] = useState("Offer Accepted");

  // Companies autocomplete
  const [dbCompanies, setDbCompanies] = useState<DbCompanyItem[]>([]);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const companyRef = useRef<HTMLDivElement>(null);

  // Form State: Interview Rounds
  const [rounds, setRounds] = useState<RoundItem[]>([
    {
      id: "round-1",
      roundType: "Online Assessment (OA)",
      duration: "60 mins",
      topics: ["Arrays", "Dynamic Programming"],
      questions: [],
      experience:
        "The OA was hosted on HackerRank with 2 coding questions and 15 MCQ questions on CS fundamentals. Clean, modular code with all edge cases tested helped pass all 15 test cases.",
      images: [],
    },
    {
      id: "round-2",
      roundType: "Technical Round 1 (DSA)",
      duration: "45 mins",
      topics: ["Graphs", "Trees"],
      questions: [
        {
          id: "q-1",
          title: "Lowest Common Ancestor in Binary Tree & Graph Cycle Detection",
          topic: "Graphs",
          difficulty: "Medium",
        },
      ],
      experience:
        "Interviewer focused on time complexity trade-offs. I started with a DFS approach, explained the visited state array, and then wrote clean production code.",
      images: [],
    },
  ]);

  // Form State: Preparation & Advice
  const [preparation, setPreparation] = useState(
    "Solved around 250 LeetCode problems focusing on Blind 75 and company-tagged questions. Used Algoryn topic sheets for Graph algorithms and dynamic programming."
  );
  const [advice, setAdvice] = useState(
    "Always clarify constraints and edge cases before jumping into code. Think out loud and treat the interviewer as a collaborator, not an examiner."
  );

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingRoundId, setUploadingRoundId] = useState<string | null>(null);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");

  // Hidden file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Companies
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/companies?limit=100&sort=problemCount&order=desc");
        const json = await res.json();
        if (active && json.data) setDbCompanies(json.data);
      } catch {
        /* ignore */
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // Click outside company dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) {
        setCompanyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load Saved Draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem("algoryn_structured_draft_v3");
      if (saved) {
        const d = JSON.parse(saved);
        if (d.company) setCompany(d.company);
        if (d.role) setRole(d.role);
        if (d.interviewType) setInterviewType(d.interviewType);
        if (d.interviewDate) setInterviewDate(d.interviewDate);
        if (d.result) setResult(d.result);
        if (Array.isArray(d.rounds) && d.rounds.length > 0) setRounds(d.rounds);
        if (typeof d.preparation === "string") setPreparation(d.preparation);
        if (typeof d.advice === "string") setAdvice(d.advice);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Save Draft
  const handleSaveDraft = () => {
    const draft = {
      company,
      role,
      interviewType,
      interviewDate,
      result,
      rounds,
      preparation,
      advice,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("algoryn_structured_draft_v3", JSON.stringify(draft));
    toast.success("Draft saved successfully!");
  };

  // Add Round
  const handleAddRound = () => {
    const newRoundIndex = rounds.length + 1;
    const newRound: RoundItem = {
      id: `round-${Date.now()}`,
      roundType: newRoundIndex === 3 ? "System Design (HLD/LLD)" : `Technical Round ${newRoundIndex} (DSA)`,
      duration: "45 mins",
      topics: [],
      questions: [],
      experience: "",
      images: [],
    };
    setRounds([...rounds, newRound]);
    toast.success(`Added Round ${newRoundIndex}`);
  };

  // Remove Round
  const handleRemoveRound = (roundId: string) => {
    if (rounds.length <= 1) {
      toast.error("At least one round is required");
      return;
    }
    setRounds(rounds.filter((r) => r.id !== roundId));
  };

  // Update Round
  const handleUpdateRound = (roundId: string, updates: Partial<RoundItem>) => {
    setRounds(rounds.map((r) => (r.id === roundId ? { ...r, ...updates } : r)));
  };

  // Add Question to Round
  const handleAddQuestion = (roundId: string) => {
    setRounds(
      rounds.map((r) => {
        if (r.id === roundId) {
          const newQ: QuestionItem = {
            id: `q-${Date.now()}`,
            title: "",
            topic: "DSA",
            difficulty: "Medium",
          };
          return { ...r, questions: [...r.questions, newQ] };
        }
        return r;
      })
    );
  };

  // Remove Question
  const handleRemoveQuestion = (roundId: string, questionId: string) => {
    setRounds(
      rounds.map((r) => {
        if (r.id === roundId) {
          return { ...r, questions: r.questions.filter((q) => q.id !== questionId) };
        }
        return r;
      })
    );
  };

  // Update Question
  const handleUpdateQuestion = (
    roundId: string,
    questionId: string,
    updates: Partial<QuestionItem>
  ) => {
    setRounds(
      rounds.map((r) => {
        if (r.id === roundId) {
          return {
            ...r,
            questions: r.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)),
          };
        }
        return r;
      })
    );
  };

  // Toggle Topic on Round
  const handleToggleTopic = (roundId: string, topicName: string) => {
    setRounds(
      rounds.map((r) => {
        if (r.id === roundId) {
          const exists = r.topics.includes(topicName);
          const nextTopics = exists
            ? r.topics.filter((t) => t !== topicName)
            : [...r.topics, topicName].slice(0, 6);
          return { ...r, topics: nextTopics };
        }
        return r;
      })
    );
  };

  // Trigger Native File Dialog for Cloudflare R2 Image Upload
  const handleTriggerUpload = (roundId: string) => {
    setUploadingRoundId(roundId);
    fileInputRef.current?.click();
  };

  // Handle File Selected -> Upload to Cloudflare R2 via /api/upload
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingRoundId) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG, JPEG, WebP, GIF)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size must be less than 10MB");
      return;
    }

    const toastId = toast.loading(`Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "interview-experiences");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        toast.success("Photo attached successfully!", { id: toastId });
        setRounds((prev) =>
          prev.map((r) =>
            r.id === uploadingRoundId ? { ...r, images: [...(r.images || []), data.url] } : r
          )
        );
      } else {
        toast.error(data.error || "Failed to upload photo", { id: toastId });
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Network error while uploading photo", { id: toastId });
    } finally {
      setUploadingRoundId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Remove an uploaded image from round
  const handleRemoveImage = (roundId: string, imgUrl: string) => {
    setRounds((prev) =>
      prev.map((r) =>
        r.id === roundId ? { ...r, images: r.images.filter((url) => url !== imgUrl) } : r
      )
    );
  };

  // Compile full Markdown content for storage
  const compileMarkdownContent = () => {
    let md = `## Summary\n\n`;
    md += `- **Company:** ${company}\n`;
    md += `- **Role:** ${role}\n`;
    md += `- **Interview Type:** ${interviewType}\n`;
    md += `- **Date / Year:** ${interviewDate}\n`;
    md += `- **Verdict:** ${result}\n\n`;
    md += `---\n\n`;

    rounds.forEach((rnd, idx) => {
      md += `## Round ${idx + 1}: ${rnd.roundType}\n\n`;
      md += `**Duration:** ${rnd.duration || "45 mins"}`;
      if (rnd.topics.length > 0) {
        md += ` | **Topics:** ${rnd.topics.join(", ")}`;
      }
      md += `\n\n`;

      if (rnd.questions.length > 0) {
        md += `### Questions Asked\n\n`;
        md += `| No. | Question / Problem | Topic | Difficulty |\n`;
        md += `| --- | --- | --- | --- |\n`;
        rnd.questions.forEach((q, qIdx) => {
          md += `| ${qIdx + 1}. | ${q.title || "Coding Problem"} | ${q.topic || "DSA"} | ${q.difficulty} |\n`;
        });
        md += `\n`;
      }

      if (rnd.experience.trim()) {
        md += `### Round Experience & Approach\n\n${rnd.experience.trim()}\n\n`;
      }

      if (rnd.images && rnd.images.length > 0) {
        md += `### Attached Diagrams & Photos\n\n`;
        rnd.images.forEach((img, imgIdx) => {
          md += `![Round ${idx + 1} Attachment ${imgIdx + 1}](${img})\n\n`;
        });
      }

      md += `---\n\n`;
    });

    if (preparation.trim()) {
      md += `## Preparation Strategy\n\n${preparation.trim()}\n\n---\n\n`;
    }

    if (advice.trim()) {
      md += `## Advice for Candidates\n\n${advice.trim()}\n`;
    }

    return md;
  };

  // Publish Experience
  const handlePublish = async () => {
    if (!company.trim()) {
      toast.error("Please enter a company name");
      return;
    }
    if (!role.trim()) {
      toast.error("Please enter your role or job title");
      return;
    }
    if (rounds.length === 0) {
      toast.error("Please add at least one interview round");
      return;
    }

    try {
      setIsSubmitting(true);

      const title = `${company} — ${role} Interview Experience (${interviewDate})`;
      const compiledContent = compileMarkdownContent();

      // Collect all unique topics as tags
      const topicTags = Array.from(new Set(rounds.flatMap((r) => r.topics))).slice(0, 8);
      const allTags = [company.trim(), interviewType, ...topicTags];

      // Collect all images uploaded to Cloudflare R2
      const allImages = rounds.flatMap((r) => r.images || []);

      const authorName = user?.displayName || (user?.email ? user.email.split("@")[0] : "Anonymous Candidate");
      const authorHandle = user?.email ? `@${user.email.split("@")[0]}` : "@candidate";
      const avatarUrl = user?.photoURL || null;

      const res = await fetch("/api/interview-experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: compiledContent,
          company: company.trim(),
          role: role.trim(),
          round: `${rounds.length} ${rounds.length === 1 ? "Round" : "Rounds"}`,
          verdict: result.includes("Offer") || result === "Accepted" ? "Offer" : result,
          tags: allTags,
          userId: currentUserId || null,
          authorName,
          authorHandle,
          avatarUrl,
          imageUrls: allImages,
        }),
      });

      const data = await res.json();
      if (data.success && data.experience) {
        localStorage.removeItem("algoryn_structured_draft_v3");
        toast.success("Interview experience published successfully!");
        router.push(`/dashboard/interview-experiences/${data.experience.id}`);
      } else {
        toast.error(data.error || "Failed to publish interview experience");
      }
    } catch {
      toast.error("Something went wrong while publishing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCompanySuggestions =
    dbCompanies.length > 0
      ? dbCompanies.filter((c) => c.name.toLowerCase().includes(company.toLowerCase())).slice(0, 8)
      : POPULAR_COMPANIES.filter((c) => c.toLowerCase().includes(company.toLowerCase())).map((name, idx) => ({
          id: idx,
          name,
          slug: name.toLowerCase(),
        }));

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Hidden file input for Cloudflare R2 file uploads */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Image Zoom Modal */}
      {previewImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImageModal(null)}
        >
          <div className="relative max-w-3xl w-full bg-card rounded-2xl overflow-hidden p-2 border border-border/80">
            <button
              type="button"
              onClick={() => setPreviewImageModal(null)}
              className="absolute top-4 right-4 size-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-10"
            >
              <X className="size-4" />
            </button>
            <img src={previewImageModal} alt="Enlarged diagram" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Main Page Content (No duplicate navbar header)                */}
      {/* ============================================================ */}
      <main className="max-w-[1440px] mx-auto px-3.5 sm:px-6 pt-3 sm:pt-4 pb-16 space-y-3.5 sm:space-y-4">
        {/* Top In-Page Action Bar (Single unified action bar) */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md py-2.5 -mx-3.5 sm:-mx-6 px-3.5 sm:px-6 border-b border-border/40 flex items-center justify-between gap-2 shadow-2xs">
          <Link
            href="/dashboard/interview-experiences"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group shrink-0"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back<span className="hidden sm:inline"> to Experiences</span></span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/40 transition-colors cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting || !company.trim() || !role.trim()}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground text-white shadow-2xs transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Publish<span className="hidden sm:inline"> Experience</span></span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile View Switcher (Edit Form vs Live Preview) */}
        <div className="lg:hidden flex items-center p-1 rounded-xl bg-muted/70 border border-border/70 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMobileTab("form")}
            className={`flex-1 py-1.5 sm:py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mobileTab === "form"
                ? "bg-card text-foreground font-bold shadow-2xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PenLine className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span>Form ({rounds.length} {rounds.length === 1 ? "Round" : "Rounds"})</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`flex-1 py-1.5 sm:py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mobileTab === "preview"
                ? "bg-card text-foreground font-bold shadow-2xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span>Preview Debrief</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ─── Left Column: Structured Form (7 cols) ─── */}
          <div className={`lg:col-span-7 space-y-5 min-w-0 w-full ${mobileTab === "preview" ? "hidden lg:block" : "block"}`}>
            {/* Section 1: Basic Information */}
            <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                <Briefcase className="size-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  1. Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Search */}
                <div className="space-y-1.5 relative" ref={companyRef}>
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Company <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Google, Amazon..."
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        setCompanyDropdownOpen(true);
                      }}
                      onFocus={() => setCompanyDropdownOpen(true)}
                      className="w-full bg-muted/40 border border-border/60 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setCompanyDropdownOpen((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <ChevronDown className="size-3.5" />
                    </button>
                  </div>

                  {companyDropdownOpen && filteredCompanySuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-popover text-popover-foreground border border-border/80 rounded-xl shadow-xl p-1 z-40 space-y-0.5 scrollbar-thin">
                      {filteredCompanySuggestions.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => {
                            setCompany(c.name);
                            setCompanyDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-muted text-foreground transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <Building2 className="size-3 text-muted-foreground" />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Role / Job Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Role / Level <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer · SDE-1"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Interview Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Interview Type
                  </label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:border-blue-500"
                  >
                    {INTERVIEW_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date / Year */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Interview Date / Year
                  </label>
                  <div className="relative">
                    <Calendar className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. 2026, or Q1 2026"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full bg-muted/40 border border-border/60 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Result / Verdict */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Result / Outcome
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {VERDICTS.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setResult(v)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          result === v
                            ? v.includes("Offer") || v === "Accepted"
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                              : v === "Rejected"
                              ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                              : "bg-amber-600 text-white border-amber-600 shadow-2xs"
                            : "bg-muted/40 hover:bg-muted text-foreground border-border/60"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Interview Rounds */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="size-4 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                    2. Interview Rounds ({rounds.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddRound}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold border border-blue-200/50 dark:border-blue-900/50 transition-colors cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Add Round</span>
                </button>
              </div>

              {rounds.map((rnd, idx) => (
                <div
                  key={rnd.id}
                  className="bg-card border border-border/70 rounded-2xl p-5 shadow-2xs space-y-4 transition-all"
                >
                  {/* Round Card Header */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <span className="size-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        Round {idx + 1}
                      </span>
                    </div>

                    {rounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRound(rnd.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="Delete Round"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Round Meta Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Round Type
                      </label>
                      <select
                        value={rnd.roundType}
                        onChange={(e) => handleUpdateRound(rnd.id, { roundType: e.target.value })}
                        className="w-full bg-muted/40 border border-border/60 rounded-xl px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:border-blue-500"
                      >
                        {ROUND_TYPES.map((rt) => (
                          <option key={rt} value={rt}>
                            {rt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Duration
                      </label>
                      <div className="relative">
                        <Clock className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. 45 mins, 60 mins"
                          value={rnd.duration}
                          onChange={(e) => handleUpdateRound(rnd.id, { duration: e.target.value })}
                          className="w-full bg-muted/40 border border-border/60 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Topics in this Round */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Topics Covered
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {COMMON_TOPICS.map((topic) => {
                        const active = rnd.topics.includes(topic);
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => handleToggleTopic(rnd.id, topic)}
                            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                              active
                                ? "bg-blue-600 text-white font-bold"
                                : "bg-muted/50 hover:bg-muted text-muted-foreground border border-border/40"
                            }`}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Questions Asked Sub-section */}
                  <div className="space-y-2.5 pt-2 border-t border-border/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-foreground">
                          Questions Asked
                        </span>
                        {rnd.questions.length > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-500/20">
                            {rnd.questions.length}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddQuestion(rnd.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded-lg border border-blue-500/20 transition-all cursor-pointer active:scale-95"
                      >
                        <Plus className="size-3" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    {rnd.questions.length === 0 ? (
                      <div className="p-3 rounded-xl bg-muted/20 border border-dashed border-border/70 text-center space-y-1">
                        <p className="text-xs text-muted-foreground italic">
                          No specific questions added for this round yet.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleAddQuestion(rnd.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          <Plus className="size-3" />
                          <span>Add first question</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {rnd.questions.map((q, qIdx) => (
                          <div
                            key={q.id}
                            className="p-3 rounded-xl bg-card border border-border/70 shadow-2xs space-y-2.5 focus-within:border-blue-500/60 transition-colors"
                          >
                            {/* Question Header: Badge on left, Delete on right */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center justify-center size-5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px] border border-blue-500/20">
                                  Q{qIdx + 1}
                                </span>
                                <span className="text-[11px] font-semibold text-muted-foreground">
                                  Question {qIdx + 1}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveQuestion(rnd.id, q.id)}
                                className="size-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title="Remove Question"
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>

                            {/* Problem Title Input */}
                            <input
                              type="text"
                              placeholder="Problem title or concept (e.g. Trapping Rain Water, LRU Cache)..."
                              value={q.title}
                              onChange={(e) =>
                                handleUpdateQuestion(rnd.id, q.id, { title: e.target.value })
                              }
                              className="w-full bg-muted/40 hover:bg-muted/60 focus:bg-background border border-border/60 focus:border-blue-500/80 rounded-lg px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all"
                            />

                            {/* Topic + Difficulty Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-0.5">
                              {/* Topic Input */}
                              <div className="sm:col-span-6">
                                <input
                                  type="text"
                                  placeholder="Topic (e.g. Arrays, Graph, LLD)"
                                  value={q.topic}
                                  onChange={(e) =>
                                    handleUpdateQuestion(rnd.id, q.id, { topic: e.target.value })
                                  }
                                  className="w-full bg-muted/40 hover:bg-muted/60 focus:bg-background border border-border/60 focus:border-blue-500/80 rounded-lg px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all h-[34px]"
                                />
                              </div>

                              {/* Difficulty 3-Button Segmented Control (LeetCode Style) */}
                              <div className="sm:col-span-6">
                                <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-muted/50 border border-border/60 h-[34px] items-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateQuestion(rnd.id, q.id, { difficulty: "Easy" })
                                    }
                                    className={`h-full rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                                      q.difficulty === "Easy"
                                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-2xs font-extrabold"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    Easy
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateQuestion(rnd.id, q.id, { difficulty: "Medium" })
                                    }
                                    className={`h-full rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                                      q.difficulty === "Medium"
                                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-2xs font-extrabold"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    Medium
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateQuestion(rnd.id, q.id, { difficulty: "Hard" })
                                    }
                                    className={`h-full rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                                      q.difficulty === "Hard"
                                        ? "bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-2xs font-extrabold"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    Hard
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Round Experience Notes */}
                  <div className="space-y-1.5 pt-2 border-t border-border/30">
                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Round Experience & Discussion
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the interviewer's style, follow-up questions, edge cases discussed, time allocation..."
                      value={rnd.experience}
                      onChange={(e) => handleUpdateRound(rnd.id, { experience: e.target.value })}
                      className="w-full bg-muted/40 border border-border/60 rounded-xl p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/40 resize-y focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                    />
                  </div>

                  {/* Cloudflare R2 Uploads for Diagrams / Whiteboard */}
                  <div className="space-y-2 pt-2 border-t border-border/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <ImageIcon className="size-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Whiteboard Diagrams & Screenshots</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTriggerUpload(rnd.id)}
                        disabled={uploadingRoundId === rnd.id}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        {uploadingRoundId === rnd.id ? (
                          <>
                            <Loader2 className="size-3 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="size-3" />
                            <span>Attach Photo</span>
                          </>
                        )}
                      </button>
                    </div>

                    {rnd.images && rnd.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                        {rnd.images.map((imgUrl, iIdx) => (
                          <div
                            key={iIdx}
                            className="relative group rounded-xl overflow-hidden border border-border/70 bg-muted/20 h-24 flex items-center justify-center"
                          >
                            <img
                              src={imgUrl}
                              alt={`Round ${idx + 1} Diagram ${iIdx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setPreviewImageModal(imgUrl)}
                                className="p-1 rounded-md bg-white/20 text-white hover:bg-white/40 transition-colors"
                                title="Zoom Image"
                              >
                                <Eye className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(rnd.id, imgUrl)}
                                className="p-1 rounded-md bg-rose-600/80 text-white hover:bg-rose-600 transition-colors"
                                title="Remove Image"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Bottom Add Round Button */}
              <button
                type="button"
                onClick={handleAddRound}
                className="w-full py-2.5 rounded-xl border border-dashed border-border/80 hover:border-blue-500/60 bg-card hover:bg-blue-50/20 dark:hover:bg-blue-950/20 text-xs font-bold text-blue-600 dark:text-blue-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="size-3.5" />
                <span>Add Another Round</span>
              </button>
            </div>

            {/* Section 3: Additional Insights */}
            <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                <BookOpen className="size-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  3. Preparation & Advice
                </h2>
              </div>

              {/* Preparation */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Target className="size-3.5 text-blue-500" />
                  <span>Preparation — How did you prepare?</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Resources used (LeetCode, books, mock interviews), timeline, focus topics..."
                  value={preparation}
                  onChange={(e) => setPreparation(e.target.value)}
                  className="w-full bg-muted/40 border border-border/60 rounded-xl p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/40 resize-y focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              {/* Advice */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Award className="size-3.5 text-emerald-500" />
                  <span>Advice — What advice would you give other candidates?</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Key tips for the interview day, handling tricky problems, negotiation advice..."
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  className="w-full bg-muted/40 border border-border/60 rounded-xl p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/40 resize-y focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* ─── Right Column: Flawless Live Debrief Preview (5 cols) ─── */}
          <div className={`lg:col-span-5 sticky top-18 space-y-3 min-w-0 w-full ${mobileTab === "form" ? "hidden lg:block" : "block"}`}>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                {/* Clean Professional Icon - NO AI SPARKLE ICON */}
                <FileText className="size-3.5 text-blue-600 dark:text-blue-400" />
                <span>Live Debrief Preview</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Instant Render
              </span>
            </div>

            <div className="bg-card border border-border/70 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden scrollbar-thin min-w-0 w-full max-w-full">
              {/* Header Preview */}
              <div className="space-y-2 pb-3 border-b border-border/50 min-w-0 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold">
                    <Building2 className="size-3" />
                    <span>{company || "Company"}</span>
                  </span>

                  <span className="text-xs font-semibold text-foreground truncate max-w-[140px]">
                    {role || "Software Engineer"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${
                      result.includes("Offer") || result === "Accepted"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : result === "Rejected"
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                    }`}
                  >
                    <CheckCircle2 className="size-3" />
                    <span>{result}</span>
                  </span>

                  <span className="text-[11px] text-muted-foreground ml-auto font-mono shrink-0">
                    {interviewDate}
                  </span>
                </div>

                <h1 className="text-base sm:text-lg font-bold text-foreground leading-snug break-all [overflow-wrap:anywhere]">
                  {company} — {role} Interview Experience ({interviewDate})
                </h1>

                {/* Author row */}
                <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground min-w-0">
                  <div className="size-5 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                    {user?.displayName?.[0]?.toUpperCase() || "A"}
                  </div>
                  <span className="font-semibold text-foreground truncate">
                    {user?.displayName || "Anonymous Candidate"}
                  </span>
                  <span>•</span>
                  <span className="shrink-0">{interviewType}</span>
                </div>
              </div>

              {/* Rounds Breakdown Preview */}
              <div className="space-y-3.5 min-w-0 w-full">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Rounds Breakdown ({rounds.length})
                </h3>

                {rounds.map((rnd, idx) => (
                  <div
                    key={rnd.id}
                    className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-2.5 transition-all overflow-hidden min-w-0 w-full max-w-full"
                  >
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-foreground min-w-0 flex-1">
                        <span className="size-4.5 rounded-md bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span className="break-words truncate">{rnd.roundType}</span>
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded shrink-0">
                        {rnd.duration}
                      </span>
                    </div>

                    {/* Topics badges */}
                    {rnd.topics.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {rnd.topics.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold border border-blue-500/15"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Questions Table with fixed layout and robust cell wrapping */}
                    {rnd.questions.length > 0 && (
                      <div className="rounded-lg border border-border/50 overflow-hidden text-[11px] w-full">
                        <table className="w-full text-left table-fixed">
                          <colgroup>
                            <col className="w-[50%]" />
                            <col className="w-[30%]" />
                            <col className="w-[20%]" />
                          </colgroup>
                          <thead className="bg-muted/60 text-muted-foreground font-semibold">
                            <tr>
                              <th className="px-2.5 py-1 text-left">Question</th>
                              <th className="px-2 py-1 text-left">Topic</th>
                              <th className="px-2 py-1 text-right">Level</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/30">
                            {rnd.questions.map((q) => (
                              <tr key={q.id}>
                                <td className="px-2.5 py-1.5 text-foreground font-medium break-words [overflow-wrap:anywhere] leading-snug">
                                  {q.title || "Coding Problem"}
                                </td>
                                <td className="px-2 py-1.5 text-muted-foreground break-words [overflow-wrap:anywhere] leading-snug">
                                  {q.topic}
                                </td>
                                <td className="px-2 py-1.5 text-right whitespace-nowrap">
                                  <span
                                    className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                      q.difficulty === "Easy"
                                        ? "text-emerald-600 bg-emerald-500/10"
                                        : q.difficulty === "Medium"
                                        ? "text-amber-600 bg-amber-500/10"
                                        : "text-rose-600 bg-rose-500/10"
                                    }`}
                                  >
                                    {q.difficulty}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Experience snippet with unbreakable string protection */}
                    {rnd.experience && (
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap break-all [overflow-wrap:anywhere] max-w-full">
                        {rnd.experience}
                      </p>
                    )}

                    {/* Attached Diagrams Preview */}
                    {rnd.images && rnd.images.length > 0 && (
                      <div className="pt-1.5 border-t border-border/30 space-y-1">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                          Attached Whiteboard / Diagram ({rnd.images.length})
                        </span>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {rnd.images.map((imgUrl, iIdx) => (
                            <img
                              key={iIdx}
                              src={imgUrl}
                              alt="Diagram"
                              onClick={() => setPreviewImageModal(imgUrl)}
                              className="size-14 rounded-lg object-cover border border-border/60 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Prep & Advice Preview */}
              {(preparation || advice) && (
                <div className="pt-3 border-t border-border/40 space-y-3 min-w-0 w-full">
                  {preparation && (
                    <div className="space-y-1 p-3 rounded-xl bg-muted/20 border border-border/40 min-w-0 w-full overflow-hidden">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <BookOpen className="size-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Preparation Strategy</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap break-all [overflow-wrap:anywhere] max-w-full">
                        {preparation}
                      </p>
                    </div>
                  )}

                  {advice && (
                    <div className="space-y-1 p-3 rounded-xl bg-muted/20 border border-border/40 min-w-0 w-full overflow-hidden">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Award className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Advice for Candidates</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap break-all [overflow-wrap:anywhere] max-w-full">
                        {advice}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
