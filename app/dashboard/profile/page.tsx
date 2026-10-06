"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "sonner";
import {
  Edit3,
  Copy,
  Check,
  Flame,
  MapPin,
  Eye,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Globe,
  Share2,
  Calendar,
  Sparkles,
  Award,
  Link2,
  Code2,
  Plus,
  X,
  Loader2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Unlink,
  CheckCircle2,
  Camera,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram, FaXTwitter, FaCode } from "react-icons/fa6";
import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiGeeksforgeeks,
  SiHackerrank,
} from "react-icons/si";
import { INDIAN_COLLEGES } from "@/lib/profile-constants";
import { useTheme } from "next-themes";
import { GithubActivity, type Contribution } from "@/components/profile/activity-heatmap";

interface UserProfileData {
  id: string;
  displayName: string | null;
  username?: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoUrl: string | null;
  bannerUrl: string | null;
  headline: string | null;
  bio: string | null;
  collegeOrCompany: string | null;
  location: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  portfolioUrl: string | null;
  roleType?: string | null;
  graduationYear?: number | null;
  educationHistory?: any;
  experienceHistory?: any;
  skillsData?: any;
  projectList?: any;
  connectionsData?: any;
  sectionVisibility?: any;
  createdAt: string;
  updatedAt: string;
}

interface StatsData {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  bookmarksCount: number;
  submissionsCount: number;
  postsCount: number;
  globalRank: number;
  totalScore: number;
}

interface TopicStat {
  name: string;
  count: number;
}

interface PlatformAccount {
  id: number;
  platform: string;
  username: string;
  isVerified: boolean;
  lastSyncedAt?: string | null;
  stats?: {
    totalSolved?: number;
    rating?: number;
    rank?: string;
  } | null;
}

const SUPPORTED_PLATFORMS = [
  { id: "LEETCODE", label: "LeetCode", icon: SiLeetcode, color: "text-amber-500", placeholder: "e.g. neutron420" },
  { id: "CODEFORCES", label: "Codeforces", icon: SiCodeforces, color: "text-blue-600", placeholder: "e.g. Coder-04Rit" },
  { id: "CODECHEF", label: "CodeChef", icon: SiCodechef, color: "text-amber-700", placeholder: "e.g. your_codechef_handle" },
  { id: "GEEKSFORGEEKS", label: "GeeksforGeeks", icon: SiGeeksforgeeks, color: "text-emerald-600", placeholder: "e.g. your_gfg_handle" },
  { id: "HACKERRANK", label: "HackerRank", icon: SiHackerrank, color: "text-green-600", placeholder: "e.g. your_hackerrank_handle" },
  { id: "ATCODER", label: "AtCoder", icon: FaCode, color: "text-slate-800 dark:text-slate-200", placeholder: "e.g. your_atcoder_handle" },
  { id: "CODESTUDIO", label: "CodeStudio", icon: Code2, color: "text-orange-500", placeholder: "e.g. your_codestudio_handle" },
  { id: "INTERVIEWBIT", label: "InterviewBit", icon: Award, color: "text-teal-600", placeholder: "e.g. your_interviewbit_handle" },
];

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8fafc]/80 dark:bg-background py-6 sm:py-8 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1280px] mx-auto animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            {/* HERO IDENTITY CARD SKELETON */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs overflow-hidden">
              <div className="h-28 sm:h-36 md:h-40 w-full bg-slate-200 dark:bg-zinc-800" />
              <div className="px-5 sm:px-7 pb-6 pt-0 relative">
                <div className="flex items-end justify-between gap-3 -mt-10 sm:-mt-12 mb-3">
                  <div className="size-20 sm:size-24 md:size-26 rounded-full p-1 bg-white dark:bg-card shadow-md shrink-0">
                    <div className="size-full rounded-full bg-slate-200 dark:bg-zinc-800" />
                  </div>
                  <div className="pt-2 sm:pt-4">
                    <div className="h-7 w-24 rounded-lg bg-slate-200 dark:bg-zinc-800" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-6 w-44 rounded-md bg-slate-200 dark:bg-zinc-800" />
                    <div className="h-4 w-24 rounded-md bg-slate-200 dark:bg-zinc-800" />
                    <div className="h-5 w-16 rounded-md bg-slate-200 dark:bg-zinc-800" />
                  </div>
                  <div className="h-4 w-48 rounded-md bg-slate-200 dark:bg-zinc-800" />
                </div>
              </div>
            </div>

            {/* ABOUT CARD SKELETON */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xs space-y-3">
              <div className="h-3 w-16 rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-3.5 w-5/6 rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-3.5 w-2/3 rounded bg-slate-200 dark:bg-zinc-800" />
              </div>
            </div>

            {/* FEATURED PROJECTS SKELETON */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-3 w-28 rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-3 w-10 rounded bg-slate-200 dark:bg-zinc-800" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="h-28 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800" />
                <div className="h-28 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800" />
              </div>
            </div>

            {/* HEATMAP SKELETON */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-6 w-24 rounded-lg bg-slate-200 dark:bg-zinc-800" />
              </div>
              <div className="h-28 w-full rounded-xl bg-slate-100 dark:bg-zinc-900" />
            </div>

            {/* DSA SKELETON */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-3 w-28 rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-6 w-28 rounded-full bg-slate-200 dark:bg-zinc-800" />
              </div>
              <div className="h-44 rounded-xl bg-slate-100 dark:bg-zinc-900" />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 space-y-5 sm:space-y-6">

            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-slate-100 dark:bg-zinc-900" />
                <div className="h-4 w-full rounded bg-slate-100 dark:bg-zinc-900" />
                <div className="h-4 w-full rounded bg-slate-100 dark:bg-zinc-900" />
              </div>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-zinc-900" />
              <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-zinc-900" />
            </div>

            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-zinc-900" />
              <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-zinc-900" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const STANDARD_DSA_TOPICS = [
  "Arrays",
  "Dynamic Programming",
  "Strings",
  "Graphs",
  "Hashing",
  "Recursion & Backtracking",
  "Linked List",
  "Stack & Queues",
  "Binary Search",
  "Binary Trees",
  "Mathematics",
  "Bit Manipulation",
  "Greedy Algorithms",
  "Heaps",
  "Sorting",
  "Binary Search Trees",
  "Tries",
  "Advanced Range Data Structures",
  "General & N-ary Trees",
  "Ordered Sets & Maps",
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<UserProfileData | null>(null);

  const [stats, setStats] = useState<StatsData>({
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    bookmarksCount: 0,
    submissionsCount: 0,
    postsCount: 0,
    globalRank: 0,
    totalScore: 0,
  });
  const [topTopics, setTopTopics] = useState<TopicStat[]>(
    STANDARD_DSA_TOPICS.map((name) => ({ name, count: 0 }))
  );
  const [leetcodeTopics, setLeetcodeTopics] = useState<TopicStat[]>([]);
  const [platformTopics, setPlatformTopics] = useState<Record<string, TopicStat[]>>({});
  const [activityData, setActivityData] = useState<{
    dailySubmissions: Record<string, number>;
    totalContributions: number;
    activeDays: number;
    bestStreak: number;
    currentStreak: number;
    contestsCount: number;
  }>({
    dailySubmissions: {},
    totalContributions: 0,
    activeDays: 0,
    bestStreak: 0,
    currentStreak: 0,
    contestsCount: 0,
  });
  const [problemTargets, setProblemTargets] = useState({
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [platformAccounts, setPlatformAccounts] = useState<PlatformAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeDsaTab, setActiveDsaTab] = useState<string>("algoryn");
  const [dsaTopicPage, setDsaTopicPage] = useState(0);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeHeatmapPlatform, setActiveHeatmapPlatform] = useState<string>("algoryn");

  const heatmapContributions: Contribution[] = useMemo(() => {
    let dailyMap: Record<string, number> = {};
    if (activeHeatmapPlatform === "leetcode" && (activityData as any).leetcodeSubmissions) {
      dailyMap = (activityData as any).leetcodeSubmissions;
    } else if (activeHeatmapPlatform === "codeforces" && (activityData as any).codeforcesSubmissions) {
      dailyMap = (activityData as any).codeforcesSubmissions;
    } else if (activeHeatmapPlatform === "algoryn") {
      dailyMap = activityData.dailySubmissions || {};
    } else if (activeHeatmapPlatform === "all") {
      const merged: Record<string, number> = { ...(activityData.dailySubmissions || {}) };
      const lc = (activityData as any).leetcodeSubmissions || {};
      const cf = (activityData as any).codeforcesSubmissions || {};
      for (const [d, c] of Object.entries(lc)) {
        merged[d] = (merged[d] || 0) + Number(c);
      }
      for (const [d, c] of Object.entries(cf)) {
        merged[d] = (merged[d] || 0) + Number(c);
      }
      dailyMap = merged;
    } else {
      dailyMap = activityData.dailySubmissions || {};
    }

    return Object.entries(dailyMap).map(([date, count]) => ({
      date,
      count: Number(count) || 0,
    }));
  }, [activityData, activeHeatmapPlatform]);

  const heatmapColors = useMemo(() => {
    if (activeHeatmapPlatform === "leetcode") {
      return isDark
        ? (["#451a03", "#78350f", "#d97706", "#fbbf24"] as const)
        : (["#fef3c7", "#fcd34d", "#f59e0b", "#d97706"] as const);
    }
    // Striver / Algoryn clean ascending blue palette
    return isDark
      ? (["#1e3a5f", "#1d4ed8", "#3b82f6", "#60a5fa"] as const)
      : (["#bfdbfe", "#60a5fa", "#2563eb", "#1d4ed8"] as const);
  }, [activeHeatmapPlatform, isDark]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Cover Banner Crop Modal State
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
  const [coverRepositionY, setCoverRepositionY] = useState(50); // 0% to 100%
  const [isCoverSaving, setIsCoverSaving] = useState(false);
  const [isCoverDragging, setIsCoverDragging] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCoverPreviewUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCoverImage = async () => {
    if (!user?.uid) {
      toast.error("Please log in to update your cover image");
      return;
    }
    setIsCoverSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          bannerUrl: coverPreviewUrl || null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Cover image updated successfully!");
        setProfile((prev) => (prev ? { ...prev, bannerUrl: coverPreviewUrl || null } : prev));
        setEditForm((prev) => ({ ...prev, bannerUrl: coverPreviewUrl }));
        setIsCoverModalOpen(false);
        loadProfile(user.uid, false);
      } else {
        toast.error(data.error || "Failed to update cover image");
      }
    } catch (err) {
      console.error("Cover image save error:", err);
      toast.error("Network error while saving cover image");
    } finally {
      setIsCoverSaving(false);
    }
  };

  // Platform Connect State
  const [isConnectingPlatform, setIsConnectingPlatform] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("LEETCODE");
  const [platformUsername, setPlatformUsername] = useState("");
  const [isPlatformSubmitting, setIsPlatformSubmitting] = useState(false);
  const [syncingPlatform, setSyncingPlatform] = useState<string | null>(null);

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({
    displayName: "",
    headline: "",
    bio: "",
    collegeOrCompany: "",
    location: "",
    photoUrl: "",
    bannerUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    portfolioUrl: "",
  });

  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const [isModalCollegeOpen, setIsModalCollegeOpen] = useState(false);
  const [modalCollegeSearch, setModalCollegeSearch] = useState("");
  const [apiModalColleges, setApiModalColleges] = useState<string[]>([]);
  const modalCollegeWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalCollegeWrapperRef.current &&
        !modalCollegeWrapperRef.current.contains(event.target as Node)
      ) {
        setIsModalCollegeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamic fetch to /api/colleges when typing in modal college input
  useEffect(() => {
    const q = (modalCollegeSearch || "").trim();
    if (q.length < 2) {
      setApiModalColleges([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/colleges?search=${encodeURIComponent(q)}&limit=40`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.colleges)) {
            setApiModalColleges(data.colleges);
          }
        }
      } catch {
        // fallback to local list
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [modalCollegeSearch]);

  const filteredModalColleges = useMemo(() => {
    const q = (modalCollegeSearch || editForm.collegeOrCompany || "").trim().toLowerCase();
    if (!q) return INDIAN_COLLEGES.slice(0, 45);
    const searchTerms = q.split(/\s+/).filter(Boolean);
    const local = INDIAN_COLLEGES.filter((c) => {
      const lower = c.toLowerCase();
      return searchTerms.every((term) => lower.includes(term));
    });
    const merged = Array.from(new Set([...local, ...apiModalColleges]));
    return merged.slice(0, 50);
  }, [modalCollegeSearch, editForm.collegeOrCompany, apiModalColleges]);

  const loadPlatforms = useCallback(async (uid: string) => {
    try {
      const res = await fetch(`/api/user/platforms?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.accounts)) {
          setPlatformAccounts(data.accounts);
        }
      }
    } catch (err) {
      console.error("Failed to load user platforms:", err);
    }
  }, []);

  const loadProfile = useCallback(async (uid: string, showSkeleton: boolean = true) => {
    if (showSkeleton) setIsLoading(true);
    try {
      const res = await fetch(`/api/user/profile?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profile) {
          setProfile(data.profile);
          if (data.stats) {
            setStats({
              totalSolved: data.stats.totalSolved ?? 0,
              easySolved: data.stats.easySolved ?? 0,
              mediumSolved: data.stats.mediumSolved ?? 0,
              hardSolved: data.stats.hardSolved ?? 0,
              bookmarksCount: data.stats.bookmarksCount ?? 0,
              submissionsCount: data.stats.submissionsCount ?? 0,
              postsCount: data.stats.postsCount ?? 0,
              globalRank: data.stats.globalRank ?? 0,
              totalScore: data.stats.totalScore ?? 0,
            });
          }
          if (data.topTopics && Array.isArray(data.topTopics)) {
            setTopTopics(data.topTopics);
          }
          if (data.platformTopics) {
            setPlatformTopics(data.platformTopics);
          }
          if (data.leetcodeTopics && Array.isArray(data.leetcodeTopics)) {
            setLeetcodeTopics(data.leetcodeTopics);
          }
          if (data.activity) {
            setActivityData(data.activity);
          }
          if (data.problemTargets) {
            setProblemTargets(data.problemTargets);
          }
          if (data.platformAccounts && data.platformAccounts.length > 0) {
            setPlatformAccounts(data.platformAccounts);
            const lcAcc = data.platformAccounts.find((p: any) => p.platform?.toUpperCase() === "LEETCODE");
            const lcSt = Array.isArray(lcAcc?.stats) ? lcAcc.stats[0] : lcAcc?.stats;
            if ((!data.stats?.totalSolved || data.stats.totalSolved === 0) && (lcSt?.totalSolved > 0)) {
              setActiveDsaTab("leetcode");
            }
          } else {
            loadPlatforms(uid);
          }

          const cp = data.profile.connectionsData?.codingProfiles;
          if (cp && (!data.platformAccounts || data.platformAccounts.length === 0)) {
            const hasHandles = Object.values(cp).some((v: any) => (v as any)?.value);
            if (hasHandles) {
              fetch("/api/user/platforms/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: uid }),
              })
                .then((r) => r.json())
                .then(() => {
                  loadPlatforms(uid);
                })
                .catch(() => {});
            }
          }
          setEditForm({
            displayName: data.profile.displayName || "",
            headline: data.profile.headline || "",
            bio: data.profile.bio || "",
            collegeOrCompany: data.profile.collegeOrCompany || "",
            location: data.profile.location || "",
            photoUrl: data.profile.photoUrl || "",
            bannerUrl: data.profile.bannerUrl || "",
            githubUrl: data.profile.githubUrl || "",
            linkedinUrl: data.profile.linkedinUrl || "",
            twitterUrl: data.profile.twitterUrl || "",
            instagramUrl: data.profile.instagramUrl || "",
            portfolioUrl: data.profile.portfolioUrl || "",
          });
        }
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    } finally {
      if (showSkeleton) {
        setIsLoading(false);
      }
    }
  }, [loadPlatforms]);

  useEffect(() => {
    if (user?.uid) {
      loadProfile(user.uid);
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user?.uid, authLoading, loadProfile]);

  const username = useMemo(() => {
    if (profile?.username) {
      return profile.username;
    }
    if (profile?.displayName) {
      return profile.displayName.toLowerCase().replace(/[^a-z0-9]/g, "");
    }
    if (user?.email) {
      return user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    }
    return "user";
  }, [profile?.username, profile?.displayName, user?.email]);


  const handleOpenEdit = () => {
    router.push("/dashboard/profile/edit");
  };

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setEditForm((prev) => ({ ...prev, photoUrl: dataUrl }));
      toast.success("Profile photo uploaded!");
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Banner image must be under 3MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setEditForm((prev) => ({ ...prev, bannerUrl: dataUrl }));
      toast.success("Cover banner uploaded!");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) {
      toast.error("Please sign in to update your profile");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          displayName: editForm.displayName,
          headline: editForm.headline,
          bio: editForm.bio,
          collegeOrCompany: editForm.collegeOrCompany,
          location: editForm.location,
          photoUrl: editForm.photoUrl || null,
          bannerUrl: editForm.bannerUrl || null,
          githubUrl: editForm.githubUrl,
          linkedinUrl: editForm.linkedinUrl,
          twitterUrl: editForm.twitterUrl,
          instagramUrl: editForm.instagramUrl,
          portfolioUrl: editForm.portfolioUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Profile updated successfully!");
        setIsEditModalOpen(false);
        loadProfile(user.uid, false);
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      toast.error("Network error while saving profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectPlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) {
      toast.error("Please sign in to connect a platform");
      return;
    }
    if (!platformUsername.trim()) {
      toast.error("Please enter a username or handle");
      return;
    }

    setIsPlatformSubmitting(true);
    try {
      const res = await fetch("/api/user/platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          platform: selectedPlatform,
          username: platformUsername.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Successfully connected ${selectedPlatform}!`);
        setPlatformUsername("");
        setIsConnectingPlatform(false);
        loadPlatforms(user.uid);
      } else {
        toast.error(data.error || "Failed to connect platform account");
      }
    } catch (err) {
      console.error("Connect platform error:", err);
      toast.error("Network error while linking platform");
    } finally {
      setIsPlatformSubmitting(false);
    }
  };

  const handleSyncPlatform = async (platformName: string) => {
    if (!user?.uid) return;
    setSyncingPlatform(platformName);
    try {
      const res = await fetch("/api/user/platforms/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          platform: platformName,
          force: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Synced ${platformName} stats successfully!`);
        await loadProfile(user.uid, false);
      } else {
        toast.error(data.error || data.message || `Failed to sync ${platformName}`);
      }
    } catch (err) {
      console.error("Sync error:", err);
      toast.error(`Error syncing ${platformName}`);
    } finally {
      setSyncingPlatform(null);
    }
  };

  const handleDisconnectPlatform = async (platformName: string) => {
    if (!user?.uid) return;
    try {
      const res = await fetch(`/api/user/platforms?userId=${user.uid}&platform=${platformName}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Disconnected ${platformName}`);
        loadPlatforms(user.uid);
      } else {
        toast.error(data.error || "Failed to disconnect platform");
      }
    } catch (err) {
      console.error("Disconnect error:", err);
      toast.error("Error disconnecting platform");
    }
  };

  const lcAccount = platformAccounts.find(
    (p) => p.platform.toUpperCase() === "LEETCODE"
  );
  const lcStats = (lcAccount?.stats as any)?.[0] || lcAccount?.stats;

  const cfAccount = platformAccounts.find(
    (p) => p.platform.toUpperCase() === "CODEFORCES"
  );
  const cfStats = (cfAccount?.stats as any)?.[0] || cfAccount?.stats;

  const currentHeatmapMetrics = useMemo(() => {
    let dailyMap = activityData.dailySubmissions || {};
    if (activeHeatmapPlatform === "leetcode" && (activityData as any).leetcodeSubmissions) {
      dailyMap = (activityData as any).leetcodeSubmissions;
    } else if (activeHeatmapPlatform === "codeforces" && (activityData as any).codeforcesSubmissions) {
      dailyMap = (activityData as any).codeforcesSubmissions;
    }

    const activeDays = Object.keys(dailyMap).length;
    const totalContributions = Object.values(dailyMap).reduce((a, b) => a + b, 0);

    return {
      totalContributions: totalContributions > 0 ? totalContributions : activityData.totalContributions,
      activeDays: activeDays > 0 ? activeDays : activityData.activeDays,
      bestStreak: activityData.bestStreak,
      contestsCount: activeHeatmapPlatform === "leetcode"
        ? (lcStats?.contestsCount ?? (lcStats?.rawData as any)?.contestsCount ?? 0)
        : activeHeatmapPlatform === "codeforces"
        ? (cfStats?.contestsCount ?? (cfStats?.rawData as any)?.contestsCount ?? 0)
        : activityData.contestsCount,
    };
  }, [activityData, activeHeatmapPlatform, lcStats, cfStats]);

  const heatmapGrid = useMemo(() => {
    const weeks: Array<Array<{ date: string; count: number; level: number }>> = [];
    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let dailyMap = activityData.dailySubmissions || {};
    if (activeHeatmapPlatform === "leetcode" && (activityData as any).leetcodeSubmissions) {
      dailyMap = (activityData as any).leetcodeSubmissions;
    } else if (activeHeatmapPlatform === "codeforces" && (activityData as any).codeforcesSubmissions) {
      dailyMap = (activityData as any).codeforcesSubmissions;
    }

    for (let w = 51; w >= 0; w--) {
      const week: Array<{ date: string; count: number; level: number }> = [];
      for (let d = 0; d < 7; d++) {
        const dayDate = new Date(now);
        dayDate.setDate(now.getDate() - (w * 7 + (6 - d)));
        const dateStr = dayDate.toISOString().split("T")[0];

        const count = dailyMap[dateStr] || 0;
        let level = 0;
        if (count === 1) level = 1;
        else if (count === 2) level = 2;
        else if (count >= 3 && count <= 5) level = 3;
        else if (count > 5) level = 4;

        week.push({ date: dateStr, count, level });
      }
      weeks.push(week);
    }
    return { weeks, months };
  }, [activityData, activeHeatmapPlatform]);

  const isLcTab = activeDsaTab === "leetcode";
  const isCfTab = activeDsaTab === "codeforces";

  const totalDsaTarget = isCfTab
    ? 2500
    : isLcTab
    ? 3300
    : (problemTargets.total || 0);
  const currentTotalSolved = isCfTab
    ? (cfStats?.totalSolved ?? 0)
    : isLcTab
    ? (lcStats?.totalSolved ?? 0)
    : (stats.totalSolved ?? 0);
  const easyCount = isCfTab
    ? (cfStats?.easySolved ?? 0)
    : isLcTab
    ? (lcStats?.easySolved ?? 0)
    : (stats.easySolved ?? 0);
  const mediumCount = isCfTab
    ? (cfStats?.mediumSolved ?? 0)
    : isLcTab
    ? (lcStats?.mediumSolved ?? 0)
    : (stats.mediumSolved ?? 0);
  const hardCount = isCfTab
    ? (cfStats?.hardSolved ?? 0)
    : isLcTab
    ? (lcStats?.hardSolved ?? 0)
    : (stats.hardSolved ?? 0);

  const easyTotal = isCfTab ? 1200 : isLcTab ? 840 : (problemTargets.easy || 0);
  const mediumTotal = isCfTab ? 800 : isLcTab ? 1750 : (problemTargets.medium || 0);
  const hardTotal = isCfTab ? 500 : isLcTab ? 750 : (problemTargets.hard || 0);

  const diffLabels = isCfTab
    ? { easy: "Div 3", medium: "Div 2", hard: "Div 1" }
    : isLcTab
    ? { easy: "Easy", medium: "Medium", hard: "Hard" }
    : { easy: "Basic", medium: "Core", hard: "Pro" };

  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  // Dedicated difficulty sectors (each up to ~95 deg arc length, separated by gaps)
  const sectorLength = (95 / 360) * circumference;

  const easyArcLength = Math.max((easyCount / Math.max(easyTotal, 1)) * sectorLength, easyCount > 0 ? 6 : 0);
  const medArcLength = Math.max((mediumCount / Math.max(mediumTotal, 1)) * sectorLength, mediumCount > 0 ? 6 : 0);
  const hardArcLength = Math.max((hardCount / Math.max(hardTotal, 1)) * sectorLength, hardCount > 0 ? 6 : 0);

  // Sector start angles on circumference
  const easyOffset = -((145 / 360) * circumference);
  const medOffset = -((265 / 360) * circumference);
  const hardOffset = -((25 / 360) * circumference);

  const currentTopics = useMemo(() => {
    const upperKey = activeDsaTab.toUpperCase();
    if (platformTopics[upperKey] && platformTopics[upperKey].length > 0) {
      return platformTopics[upperKey];
    }
    if (activeDsaTab === "leetcode" && leetcodeTopics.length > 0) {
      return leetcodeTopics;
    }
    if (activeDsaTab === "algoryn") {
      return topTopics;
    }
    return topTopics;
  }, [activeDsaTab, platformTopics, leetcodeTopics, topTopics]);

  // DSA Topic-wise Sliding Carousel Logic (10 topics per slide)
  const TOPICS_PER_PAGE = 10;
  const totalTopicPages = Math.max(Math.ceil(currentTopics.length / TOPICS_PER_PAGE), 1);
  const pagedTopics = useMemo(() => {
    const pages: TopicStat[][] = [];
    for (let i = 0; i < currentTopics.length; i += TOPICS_PER_PAGE) {
      pages.push(currentTopics.slice(i, i + TOPICS_PER_PAGE));
    }
    return pages.length > 0 ? pages : [[]];
  }, [currentTopics]);

  const dsaTouchStartXRef = useRef<number | null>(null);
  const dsaTouchEndXRef = useRef<number | null>(null);

  const handleDsaTouchStart = (e: React.TouchEvent) => {
    dsaTouchStartXRef.current = e.touches[0].clientX;
    dsaTouchEndXRef.current = null;
  };

  const handleDsaTouchMove = (e: React.TouchEvent) => {
    dsaTouchEndXRef.current = e.touches[0].clientX;
  };

  const handleDsaTouchEnd = () => {
    if (dsaTouchStartXRef.current !== null && dsaTouchEndXRef.current !== null) {
      const diff = dsaTouchStartXRef.current - dsaTouchEndXRef.current;
      if (diff > 40 && dsaTopicPage < totalTopicPages - 1) {
        setDsaTopicPage((p) => p + 1);
      } else if (diff < -40 && dsaTopicPage > 0) {
        setDsaTopicPage((p) => p - 1);
      }
    }
    dsaTouchStartXRef.current = null;
    dsaTouchEndXRef.current = null;
  };

  useEffect(() => {
    setDsaTopicPage(0);
  }, [activeDsaTab]);

  // Compute unified active coding profiles from platformAccounts & connectionsData
  const activeCodingProfiles = useMemo(() => {
    const list: Array<{
      platform: string;
      username: string;
      isVerified: boolean;
      url?: string;
      stats?: any;
    }> = [];
    const seen = new Set<string>();

    if (Array.isArray(platformAccounts)) {
      for (const acc of platformAccounts) {
        if (acc.username && !seen.has(acc.platform.toUpperCase())) {
          seen.add(acc.platform.toUpperCase());
          const statObj = Array.isArray(acc.stats) ? acc.stats[0] : acc.stats;
          list.push({
            platform: acc.platform.toUpperCase(),
            username: acc.username,
            isVerified: acc.isVerified ?? true,
            stats: statObj || null,
          });
        }
      }
    }

    if (profile?.connectionsData?.codingProfiles) {
      const cp = profile.connectionsData.codingProfiles;
      for (const [key, obj] of Object.entries(cp) as [string, { value: string; isVisible: boolean }][]) {
        if (obj?.value && obj.isVisible !== false && !seen.has(key.toUpperCase())) {
          seen.add(key.toUpperCase());
          const raw = obj.value.trim();
          const handle = raw.replace(/\/$/, "").split("/").pop() || raw;
          list.push({
            platform: key.toUpperCase(),
            username: handle,
            isVerified: false,
            url: raw.startsWith("http") ? raw : undefined,
          });
        }
      }
    }

    return list;
  }, [platformAccounts, profile?.connectionsData?.codingProfiles]);

  // Compute active social links from profile fields or connectionsData
  const activeSocialLinks = useMemo(() => {
    const list: Array<{ id: string; name: string; url: string; handle: string; icon: any; color: string }> = [];

    const github = profile?.githubUrl || profile?.connectionsData?.socialProfiles?.github?.value;
    if (github && profile?.connectionsData?.socialProfiles?.github?.isVisible !== false) {
      list.push({
        id: "github",
        name: "GitHub",
        url: github.startsWith("http") ? github : `https://github.com/${github}`,
        handle: github.replace(/\/$/, "").split("/").pop() || github,
        icon: FaGithub,
        color: "text-slate-900 dark:text-zinc-100",
      });
    }

    const linkedin = profile?.linkedinUrl || profile?.connectionsData?.socialProfiles?.linkedin?.value;
    if (linkedin && profile?.connectionsData?.socialProfiles?.linkedin?.isVisible !== false) {
      list.push({
        id: "linkedin",
        name: "LinkedIn",
        url: linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`,
        handle: linkedin.replace(/\/$/, "").split("/").pop() || linkedin,
        icon: FaLinkedin,
        color: "text-blue-600",
      });
    }

    const twitter = profile?.twitterUrl || profile?.connectionsData?.socialProfiles?.twitter?.value;
    if (twitter && profile?.connectionsData?.socialProfiles?.twitter?.isVisible !== false) {
      list.push({
        id: "twitter",
        name: "Twitter / X",
        url: twitter.startsWith("http") ? twitter : `https://x.com/${twitter}`,
        handle: twitter.replace(/\/$/, "").split("/").pop() || twitter,
        icon: FaXTwitter,
        color: "text-slate-900 dark:text-zinc-100",
      });
    }

    const instagram = profile?.instagramUrl || profile?.connectionsData?.socialProfiles?.instagram?.value;
    if (instagram && profile?.connectionsData?.socialProfiles?.instagram?.isVisible !== false) {
      list.push({
        id: "instagram",
        name: "Instagram",
        url: instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram}`,
        handle: instagram.replace(/\/$/, "").split("/").pop() || instagram,
        icon: FaInstagram,
        color: "text-pink-600",
      });
    }

    return list;
  }, [profile?.githubUrl, profile?.linkedinUrl, profile?.twitterUrl, profile?.instagramUrl, profile?.connectionsData?.socialProfiles]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const displayName = profile?.displayName || user?.displayName || (user?.email ? user.email.split("@")[0] : "User");
  const userHeadline = profile?.headline || profile?.roleType || "Developer";
  const userLocation = profile?.location || "";
  const userBio = profile?.bio || "";
  const userCollegeOrCompany = profile?.collegeOrCompany || "";

  return (
    <div className="min-h-screen bg-[#f8fafc]/80 dark:bg-background py-6 sm:py-8 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* ================================================================= */}
          {/* LEFT MAIN COLUMN (~68% width - 8 cols on lg)                      */}
          {/* ================================================================= */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            
            {/* 1. HERO IDENTITY CARD */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs overflow-hidden">
              {/* Cover Banner: LinkedIn 4:1 Aspect Ratio */}
              <div className="relative w-full aspect-[4/1] min-h-[140px] max-h-[250px] sm:h-44 md:h-52 bg-slate-100 dark:bg-muted/40 overflow-hidden group">
                {profile?.bannerUrl ? (
                  <img
                    src={profile.bannerUrl}
                    alt="Cover Banner"
                    className="size-full object-cover object-center"
                  />
                ) : (
                  <div
                    onClick={() => {
                      setCoverPreviewUrl(profile?.bannerUrl || editForm.bannerUrl || "");
                      setIsCoverModalOpen(true);
                    }}
                    className="size-full bg-gradient-to-r from-blue-600/10 via-indigo-500/10 to-purple-600/10 dark:from-zinc-900 dark:via-zinc-800/80 dark:to-zinc-900 flex items-center justify-center select-none cursor-pointer group-hover:opacity-95 transition-opacity"
                  >
                    <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white px-3.5 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                      <Camera className="size-3.5" />
                      <span>Add cover image</span>
                    </span>
                  </div>
                )}

                {/* Edit Banner Button (Top Right) */}
                <button
                  type="button"
                  onClick={() => {
                    setCoverPreviewUrl(profile?.bannerUrl || editForm.bannerUrl || "");
                    setIsCoverModalOpen(true);
                  }}
                  title="Crop cover image"
                  className="absolute top-3 right-3 p-1.5 sm:p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-all opacity-80 hover:opacity-100 cursor-pointer shadow-xs"
                >
                  <Edit3 className="size-3.5 sm:size-4" />
                </button>
              </div>

              {/* Avatar + Main Details Bar */}
              <div className="px-4 sm:px-7 pb-6 pt-0 relative">
                <div className="flex items-end justify-between gap-3 -mt-10 sm:-mt-12 mb-3">
                  {/* Circular Avatar */}
                  <div className="relative size-20 sm:size-24 md:size-26 rounded-full p-1 bg-white dark:bg-card shadow-md shrink-0">
                    <div className="size-full rounded-full overflow-hidden bg-amber-400 border-2 border-amber-300 dark:border-amber-500/60 flex items-center justify-center">
                      {profile?.photoUrl || user?.photoURL ? (
                        <img
                          src={profile?.photoUrl || user?.photoURL || ""}
                          alt={displayName}
                          className="size-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-2xl sm:text-3xl font-black text-amber-950">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {/* Edit Avatar Badge */}
                    <button
                      type="button"
                      onClick={handleOpenEdit}
                      className="absolute bottom-1 right-1 p-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md border-2 border-white dark:border-card cursor-pointer transition-transform hover:scale-110"
                      title="Change Avatar"
                    >
                      <Edit3 className="size-2.5 sm:size-3" />
                    </button>
                  </div>

                  {/* Edit Profile Action Button: Positioned down slightly & sleeker/smaller */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-4">
                    <Link
                      href="/dashboard/profile/edit"
                      className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <Edit3 className="size-3" />
                      <span>Edit Profile</span>
                    </Link>
                  </div>
                </div>

                {/* Name, Handle, Role Badge */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
                      {displayName}
                    </h1>
                    <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400">
                      @{username}
                    </span>
                    {userHeadline && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 font-semibold text-[11px] sm:text-xs">
                        {userHeadline}
                      </span>
                    )}
                  </div>

                  {/* Location & Profile Views */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 pt-0.5 flex-wrap">
                    {userLocation ? (
                      <span className="inline-flex items-center gap-1">
                        <span>{userLocation.replace(/\s+,/g, ",")}</span>
                      </span>
                    ) : null}
                    {userLocation && <span className="text-slate-300 dark:text-zinc-700">•</span>}
                    <span className="inline-flex items-center gap-1">
                      <Eye className="size-3.5 text-slate-400" />
                      <span>{Math.max(1, stats.totalSolved * 2 + stats.postsCount + 1)} profile views</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ABOUT CARD */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  About
                </h2>
                <Link href="/dashboard/profile/edit" className="text-xs text-blue-600 hover:underline">
                  Edit
                </Link>
              </div>
              {userBio ? (
                <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                  {userBio}
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-slate-400 dark:text-zinc-500 italic">
                  No bio added yet. Tell the world about yourself in Edit Profile.
                </p>
              )}
            </div>

            {/* 3. FEATURED PROJECTS */}
            {profile?.sectionVisibility?.showProjects !== false && (
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3.5">
                  <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Featured Projects
                  </h2>
                  <Link href="/dashboard/profile/edit" className="text-xs text-blue-600 hover:underline">
                    Edit
                  </Link>
                </div>
                {Array.isArray(profile?.projectList) && profile.projectList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.projectList
                      .filter((p: any) => p.isVisible !== false)
                      .map((proj: any, idx: number) => (
                        <div
                          key={proj.id || idx}
                          className="rounded-xl border border-slate-200 dark:border-zinc-800 p-4 bg-slate-50/40 dark:bg-zinc-900/30 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200">
                                {proj.title}
                              </h3>
                              <div className="flex items-center gap-1">
                                {proj.liveUrl && (
                                  <a
                                    href={proj.liveUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 text-slate-400 hover:text-blue-600"
                                    title="Live Demo"
                                  >
                                    <ExternalLink className="size-3.5" />
                                  </a>
                                )}
                                {proj.githubUrl && (
                                  <a
                                    href={proj.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    title="GitHub"
                                  >
                                    <FaGithub className="size-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
                              {proj.description}
                            </p>
                          </div>
                          {proj.techStack && proj.techStack.length > 0 && (
                            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                              {proj.techStack.map((tech: string) => (
                                <span
                                  key={tech}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-6 text-center bg-slate-50/50 dark:bg-zinc-900/30">
                    <div className="inline-flex size-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 items-center justify-center mb-2">
                      <Code2 className="size-5" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200">
                      Algoryn - Technical Interview Platform
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
                      Company-wise curated interview problems, active streak tracking, and interactive community discussions.
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap">
                      {["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind"].map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. CONSISTENCY (HEATMAP CARD) */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xs">
              {/* Header with platform count */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Consistency
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                    {activeCodingProfiles.length} platform{activeCodingProfiles.length === 1 ? "" : "s"} connected
                  </span>
                </div>
              </div>

              {/* Platform Filter Buttons */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveHeatmapPlatform("algoryn")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    activeHeatmapPlatform === "algoryn"
                      ? "bg-blue-600 text-white font-semibold shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300"
                  }`}
                >
                  <Layers className="size-3" />
                  <span>Algoryn</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHeatmapPlatform("all")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    activeHeatmapPlatform === "all"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-zinc-950 font-semibold shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300"
                  }`}
                >
                  All
                </button>
                {activeCodingProfiles.map((cp) => {
                  const platMeta = SUPPORTED_PLATFORMS.find((p) => p.id === cp.platform) || { label: cp.platform, icon: FaCode, color: "text-slate-600" };
                  const PIcon = platMeta.icon;
                  const platformKey = cp.platform.toLowerCase();
                  const activeColors: Record<string, string> = {
                    leetcode: "bg-amber-500 text-white font-semibold shadow-xs",
                    codeforces: "bg-blue-600 text-white font-semibold shadow-xs",
                    codechef: "bg-amber-700 text-white font-semibold shadow-xs",
                    geeksforgeeks: "bg-emerald-600 text-white font-semibold shadow-xs",
                    hackerrank: "bg-green-600 text-white font-semibold shadow-xs",
                  };
                  return (
                    <button
                      key={cp.platform}
                      type="button"
                      onClick={() => setActiveHeatmapPlatform(platformKey)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                        activeHeatmapPlatform === platformKey
                          ? (activeColors[platformKey] || "bg-slate-900 text-white font-semibold shadow-xs")
                          : "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300"
                      }`}
                    >
                      <PIcon className="size-3" />
                      <span>{platMeta.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Heatmap UI component */}
              <div className="w-full">
                <GithubActivity
                  contributions={heatmapContributions}
                  theme={isDark ? "dark" : "light"}
                  colors={heatmapColors}
                  empty={isDark ? "#242321" : "#e2e8f0"}
                  mode="2d"
                  shape="rounded"
                  blocks="skyline"
                  stats="cards"
                  tint={true}
                  allowModeToggle={true}
                  display={{
                    header: false,
                    year: true,
                    months: true,
                    weekdays: true,
                    legend: true,
                    counts: true,
                  }}
                />
              </div>
            </div>

            {/* 5. DSA PROGRESS CARD */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-5">
                <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  DSA Progress
                </h2>
                <div className="inline-flex rounded-full bg-slate-100 dark:bg-zinc-800 p-0.5 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setActiveDsaTab("algoryn")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      activeDsaTab === "algoryn"
                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
                    }`}
                  >
                    <Layers className="size-3" />
                    <span>Algoryn</span>
                    {stats.totalSolved > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-700/60 text-white font-mono">
                        {stats.totalSolved}
                      </span>
                    )}
                  </button>
                  {activeCodingProfiles.map((cp) => {
                    const platMeta = SUPPORTED_PLATFORMS.find((p) => p.id === cp.platform) || { label: cp.platform, icon: FaCode, color: "text-slate-600" };
                    const PIcon = platMeta.icon;
                    const tabKey = cp.platform.toLowerCase();
                    const tabStats = tabKey === "leetcode" ? lcStats : tabKey === "codeforces" ? cfStats : cp.stats;
                    const solvedCount = tabStats?.totalSolved ?? 0;
                    const activeColors: Record<string, string> = {
                      leetcode: "bg-amber-500 text-white font-semibold shadow-xs",
                      codeforces: "bg-blue-600 text-white font-semibold shadow-xs",
                      codechef: "bg-amber-700 text-white font-semibold shadow-xs",
                      geeksforgeeks: "bg-emerald-600 text-white font-semibold shadow-xs",
                      hackerrank: "bg-green-600 text-white font-semibold shadow-xs",
                    };
                    const activeBadgeColors: Record<string, string> = {
                      leetcode: "bg-amber-600/70 text-white",
                      codeforces: "bg-blue-700/70 text-white",
                      codechef: "bg-amber-800/70 text-white",
                      geeksforgeeks: "bg-emerald-700/70 text-white",
                      hackerrank: "bg-green-700/70 text-white",
                    };
                    return (
                      <button
                        key={cp.platform}
                        type="button"
                        onClick={() => setActiveDsaTab(tabKey)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          activeDsaTab === tabKey
                            ? (activeColors[tabKey] || "bg-slate-900 text-white font-semibold shadow-xs")
                            : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
                        }`}
                      >
                        <PIcon className="size-3" />
                        <span>{platMeta.label}</span>
                        {solvedCount > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            activeDsaTab === tabKey
                              ? (activeBadgeColors[tabKey] || "bg-slate-700/70 text-white")
                              : "bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300"
                          }`}>
                            {solvedCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Split Content: Circular Donut Ring on Left, Topic-wise bars on Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Circular Donut Ring Box */}
                <div className="md:col-span-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/20 p-5 flex flex-col items-center justify-center">
                  <div className="w-full text-left text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-3">
                    DSA Progress
                  </div>
                  
                  <div className="relative size-40 sm:size-44 flex items-center justify-center">
                    <svg className="size-full" viewBox="0 0 160 160">
                      {/* Base Track */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="11"
                        className="text-slate-100 dark:text-zinc-800"
                      />
                      {/* Basic / Easy / Div 3 Arc - Emerald */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="11"
                        strokeDasharray={`${easyArcLength} ${circumference}`}
                        strokeDashoffset={easyOffset}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      />
                      {/* Core / Medium / Div 2 Arc - Amber with Glow */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke="#f59e0b"
                        strokeWidth="11"
                        strokeDasharray={`${medArcLength} ${circumference}`}
                        strokeDashoffset={medOffset}
                        strokeLinecap="round"
                        style={{ filter: "drop-shadow(0 0 5px rgba(245, 158, 11, 0.45))" }}
                        className="transition-all duration-700 ease-out"
                      />
                      {/* Pro / Hard / Div 1 Arc - Rose */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke="#ef4444"
                        strokeWidth="11"
                        strokeDasharray={`${hardArcLength} ${circumference}`}
                        strokeDashoffset={hardOffset}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>

                    {/* Donut Center Count */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
                        {currentTotalSolved}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                        / {totalDsaTarget}
                      </span>
                    </div>
                  </div>

                  {/* Ring Breakdown Legend */}
                  <div className="w-full mt-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-zinc-300">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        <span>{diffLabels.easy}</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-zinc-100">
                        {easyCount} <span className="text-slate-400 font-normal">/ {easyTotal}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-zinc-300">
                        <span className="size-2 rounded-full bg-amber-500" />
                        <span>{diffLabels.medium}</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-zinc-100">
                        {mediumCount} <span className="text-slate-400 font-normal">/ {mediumTotal}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-zinc-300">
                        <span className="size-2 rounded-full bg-rose-500" />
                        <span>{diffLabels.hard}</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-zinc-100">
                        {hardCount} <span className="text-slate-400 font-normal">/ {hardTotal}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Topic-Wise Progress Bars (Sliding Carousel) */}
                <div className="md:col-span-7 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/20 p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                        DSA Topic-wise Analysis
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                        {currentTopics.length} topics
                      </span>
                    </div>

                    {/* Sliding Controls */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium select-none">
                        {dsaTopicPage * TOPICS_PER_PAGE + 1}–{Math.min((dsaTopicPage + 1) * TOPICS_PER_PAGE, currentTopics.length)} of {currentTopics.length}
                      </span>
                      <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 p-0.5 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setDsaTopicPage((prev) => Math.max(0, prev - 1))}
                          disabled={dsaTopicPage === 0}
                          aria-label="Previous topics"
                          title="Previous topics"
                          className="p-1 rounded-md text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        >
                          <ChevronLeft className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDsaTopicPage((prev) => Math.min(totalTopicPages - 1, prev + 1))}
                          disabled={dsaTopicPage >= totalTopicPages - 1}
                          aria-label="Next topics"
                          title="Next topics"
                          className="p-1 rounded-md text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        >
                          <ChevronRight className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sliding Topics Viewport */}
                  <div
                    className="relative overflow-hidden w-full touch-pan-y"
                    onTouchStart={handleDsaTouchStart}
                    onTouchMove={handleDsaTouchMove}
                    onTouchEnd={handleDsaTouchEnd}
                  >
                    <div
                      className="flex transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${dsaTopicPage * 100}%)` }}
                    >
                      {pagedTopics.map((pageItems, pageIdx) => {
                        const maxVal = Math.max(...currentTopics.map((item) => item.count), 1);
                        return (
                          <div key={pageIdx} className="w-full shrink-0 space-y-2.5">
                            {pageItems.map((t) => {
                              const pct = maxVal > 0 && t.count > 0 ? Math.min(Math.round((t.count / maxVal) * 100), 100) : 0;
                              return (
                                <div key={t.name} className="group py-0.5">
                                  {/* Mobile View (< sm): Full topic title + count, followed by full-width progress bar */}
                                  <div className="flex sm:hidden items-center justify-between gap-2 text-xs mb-1">
                                    <span className="font-medium text-[11px] text-slate-700 dark:text-zinc-300">
                                      {t.name}
                                    </span>
                                    <span className="font-bold text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                                      {t.count}
                                    </span>
                                  </div>
                                  <div className="sm:hidden h-2 w-full bg-slate-100 dark:bg-zinc-800/80 rounded-full overflow-hidden mb-1.5">
                                    {t.count > 0 ? (
                                      <div
                                        className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-500 shadow-2xs"
                                        style={{ width: `${Math.max(pct, 3)}%` }}
                                      />
                                    ) : null}
                                  </div>

                                  {/* Tablet & Desktop View (>= sm): Side-by-side pill layout with right-aligned title */}
                                  <div className="hidden sm:flex items-center gap-3 text-xs">
                                    <span className="w-36 md:w-44 text-right text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-200 font-medium text-xs truncate shrink-0 transition-colors">
                                      {t.name}
                                    </span>
                                    <div className="flex-1 flex items-center min-h-[22px]">
                                      {t.count > 0 ? (
                                        <div
                                          className="h-5 sm:h-6 bg-[#dbeafe] dark:bg-blue-900/60 rounded-md sm:rounded-lg flex items-center justify-end pr-2.5 transition-all duration-500 shadow-2xs"
                                          style={{ width: `${Math.max(pct, 12)}%` }}
                                        >
                                          <span className="text-[11px] font-bold text-blue-900 dark:text-blue-100">
                                            {t.count}
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="h-5 sm:h-6 px-2.5 rounded-md bg-slate-100/70 dark:bg-zinc-800/60 flex items-center justify-center text-[10px] text-slate-400 font-medium">
                                          0
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Slide Dots Indicator */}
                  {totalTopicPages > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-3 pt-0.5">
                      {Array.from({ length: totalTopicPages }).map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setDsaTopicPage(idx)}
                          aria-label={`Slide ${idx + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            dsaTopicPage === idx
                              ? "w-6 bg-blue-600 dark:bg-blue-500"
                              : "w-2 bg-slate-200 dark:bg-zinc-700 hover:bg-slate-300 dark:hover:bg-zinc-600"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* ================================================================= */}
          {/* RIGHT SIDEBAR COLUMN (~32% width - 4 cols on lg)                  */}
          {/* ================================================================= */}
          <div className="lg:col-span-4 space-y-5 sm:space-y-6">


            {/* 2. AT A GLANCE CARD */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 shadow-xs">
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3.5">
                At a Glance
              </h3>
              <div className="space-y-2.5 text-xs sm:text-[13px]">
                {profile?.sectionVisibility?.showProblemsSolved !== false && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-zinc-400">Problems solved</span>
                    <span className="font-bold text-slate-900 dark:text-zinc-100">
                      {stats.totalSolved > 0
                        ? stats.totalSolved
                        : (lcStats?.totalSolved || 0) + (cfStats?.totalSolved || 0) > 0
                        ? `${(lcStats?.totalSolved || 0) + (cfStats?.totalSolved || 0)}`
                        : 0}
                    </span>
                  </div>
                )}
                {profile?.sectionVisibility?.showBestStreak !== false && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-zinc-400">Best streak</span>
                    <span className="font-bold text-slate-900 dark:text-zinc-100 inline-flex items-center gap-1">
                      <Flame className="size-3.5 text-amber-500" />
                      <span>{activityData.bestStreak} day{activityData.bestStreak === 1 ? "" : "s"}</span>
                    </span>
                  </div>
                )}
                {profile?.sectionVisibility?.showLanguagesGlance !== false && (
                  <div className="flex items-start justify-between gap-3 pt-2.5 border-t border-slate-100 dark:border-zinc-800">
                    <span className="text-slate-500 dark:text-zinc-400 shrink-0 mt-1">Languages</span>
                    <div className="flex flex-wrap items-center justify-end gap-1.5 text-right">
                      {profile?.skillsData?.languages && profile.skillsData.languages.length > 0 ? (
                        profile.skillsData.languages.map((lang: string) => (
                          <span
                            key={lang}
                            className="rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50/80 dark:bg-zinc-800/60 px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-zinc-200 shadow-2xs"
                          >
                            {lang}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 dark:text-zinc-500 text-xs">None added</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. SKILLS CARD */}
            {profile?.sectionVisibility?.showSkills !== false && (
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Skills
                  </h3>
                  <Link href="/dashboard/profile/edit" className="text-xs text-blue-600 hover:underline">
                    Edit
                  </Link>
                </div>
                
                {profile?.skillsData && (
                  (profile.skillsData.languages && profile.skillsData.languages.length > 0) ||
                  (profile.skillsData.backendInfra && profile.skillsData.backendInfra.length > 0) ||
                  (profile.skillsData.concepts && profile.skillsData.concepts.length > 0)
                ) ? (
                  <div className="space-y-3.5">
                    {profile.skillsData.languages && profile.skillsData.languages.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
                          Languages
                        </h4>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {profile.skillsData.languages.map((skill: string) => (
                            <span
                              key={skill}
                              className="rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50/80 dark:bg-zinc-800/60 px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-zinc-200 shadow-2xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.skillsData.backendInfra && profile.skillsData.backendInfra.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
                          Backend &amp; Infra
                        </h4>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {profile.skillsData.backendInfra.map((infra: string) => (
                            <span
                              key={infra}
                              className="rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50/80 dark:bg-zinc-800/60 px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-zinc-200 shadow-2xs"
                            >
                              {infra}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.skillsData.concepts && profile.skillsData.concepts.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
                          Concepts
                        </h4>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {profile.skillsData.concepts.map((concept: string) => (
                            <span
                              key={concept}
                              className="rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50/80 dark:bg-zinc-800/60 px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-zinc-200 shadow-2xs"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-5 text-center bg-slate-50/50 dark:bg-zinc-900/30">
                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">No skills added yet</p>
                    <Link
                      href="/dashboard/profile/edit"
                      className="text-[11px] font-semibold text-blue-600 hover:underline mt-1 inline-block"
                    >
                      + Add your skills
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 4. WORK EXPERIENCE */}
            {profile?.sectionVisibility?.showExperience !== false && (
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Work Experience
                  </h3>
                  <Link href="/dashboard/profile/edit?tab=experience" className="text-xs text-blue-600 hover:underline">
                    Edit
                  </Link>
                </div>
                {Array.isArray(profile?.experienceHistory) && profile.experienceHistory.length > 0 ? (
                  <div className="space-y-3">
                    {profile.experienceHistory
                      .filter((exp: any) => exp.isVisible !== false)
                      .map((exp: any, idx: number) => (
                        <div key={exp.id || idx} className="space-y-0.5 text-xs">
                          <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                            {exp.company}
                          </p>
                          <p className="text-slate-600 dark:text-zinc-400 font-medium">
                            {exp.role} {exp.employmentType ? `• ${exp.employmentType}` : ""}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {exp.startDate} - {exp.endDate} {exp.location ? `• ${exp.location}` : ""}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-5 text-center bg-slate-50/50 dark:bg-zinc-900/30">
                    <div className="inline-flex size-9 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 items-center justify-center mb-1.5">
                      <Briefcase className="size-4" />
                    </div>
                    <p className="text-xs font-medium text-slate-600 dark:text-zinc-400">No experience added yet</p>
                    <Link
                      href="/dashboard/profile/edit?tab=experience"
                      className="text-[11px] font-semibold text-blue-600 hover:underline mt-1 inline-block"
                    >
                      + Add your experience
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 5. EDUCATION */}
            {profile?.sectionVisibility?.showEducation !== false && (
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Education
                  </h3>
                  <Link href="/dashboard/profile/edit?tab=education" className="text-xs text-blue-600 hover:underline">
                    Edit
                  </Link>
                </div>
                {Array.isArray(profile?.educationHistory) && profile.educationHistory.length > 0 ? (
                  <div className="space-y-3">
                    {profile.educationHistory
                      .filter((edu: any) => edu.isVisible !== false)
                      .map((edu: any, idx: number) => (
                        <div key={edu.id || idx} className="space-y-1 text-xs">
                          <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                            {edu.school}
                          </p>
                          <p className="text-slate-500 dark:text-zinc-400">
                            {edu.degree} {edu.fieldOfStudy ? `• ${edu.fieldOfStudy}` : ""}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-zinc-500 pt-0.5">
                            <span>{edu.startDate} - {edu.endDate}</span>
                            {edu.grade && (
                              <>
                                <span>•</span>
                                <span>{edu.grade} CGPA</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : profile?.collegeOrCompany ? (
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                      {profile.collegeOrCompany}
                    </p>
                    <p className="text-slate-500 dark:text-zinc-400">
                      {profile.roleType || "Student"}
                    </p>
                    {profile.graduationYear && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-zinc-500 pt-0.5">
                        <span>Class of {profile.graduationYear}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-5 text-center bg-slate-50/50 dark:bg-zinc-900/30">
                    <div className="inline-flex size-9 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 items-center justify-center mb-1.5">
                      <GraduationCap className="size-4" />
                    </div>
                    <p className="text-xs font-medium text-slate-600 dark:text-zinc-400">No education added yet</p>
                    <Link
                      href="/dashboard/profile/edit?tab=education"
                      className="text-[11px] font-semibold text-blue-600 hover:underline mt-1 inline-block"
                    >
                      + Add your education
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 6. ADVANCED CODING PROFILES */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Coding Profiles
                </h3>
                <button
                  type="button"
                  onClick={() => setIsConnectingPlatform(!isConnectingPlatform)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <Plus className="size-3" />
                  <span>{isConnectingPlatform ? "Close" : "Connect"}</span>
                </button>
              </div>

              {/* Advanced Connect Dropdown Box */}
              {isConnectingPlatform && (
                <form
                  onSubmit={handleConnectPlatform}
                  className="mb-3.5 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2.5 animate-in fade-in duration-200 text-xs"
                >
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                      Select Platform
                    </label>
                    <select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {SUPPORTED_PLATFORMS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                      Profile Username / Handle
                    </label>
                    <input
                      type="text"
                      value={platformUsername}
                      onChange={(e) => setPlatformUsername(e.target.value)}
                      placeholder={
                        SUPPORTED_PLATFORMS.find((p) => p.id === selectedPlatform)?.placeholder || "Enter username"
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPlatformSubmitting}
                    className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isPlatformSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
                    <span>{isPlatformSubmitting ? "Verifying & Linking..." : "Link Profile"}</span>
                  </button>
                </form>
              )}

              {/* Connected Profiles List - 2-Row Card Layout */}
              {activeCodingProfiles.length > 0 ? (
                <div className="space-y-2.5">
                  {activeCodingProfiles.map((account) => {
                    const platMeta =
                      SUPPORTED_PLATFORMS.find((p) => p.id === account.platform) || {
                        label: account.platform,
                        icon: FaCode,
                        color: "text-slate-600",
                      };
                    const IconComp = platMeta.icon;
                    const isSyncing = syncingPlatform === account.platform;

                    const statsObj = account.stats;
                    const totalSolved = statsObj?.totalSolved;
                    const rating = statsObj?.rating;
                    const rank = statsObj?.rank || (statsObj?.rawData as any)?.rank;

                    return (
                      <div
                        key={account.platform}
                        className="rounded-xl border border-slate-200 dark:border-zinc-800 p-3 bg-slate-50/40 dark:bg-zinc-900/20 hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-colors group"
                      >
                        {/* Row 1: Icon + Name + Solved Badge | Sync + Status */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <IconComp className={`size-5 ${platMeta.color} shrink-0`} />
                            <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-tight truncate">
                              {platMeta.label}
                            </span>
                            {totalSolved !== undefined && totalSolved > 0 && (
                              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded-md shrink-0">
                                {totalSolved} solved
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleSyncPlatform(account.platform)}
                              disabled={isSyncing}
                              title="Sync stats now"
                              className="p-1 rounded-md text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                            >
                              <RefreshCw className={`size-3 ${isSyncing ? "animate-spin text-blue-600" : ""}`} />
                            </button>
                            {statsObj ? (
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 inline-flex items-center gap-1">
                                <CheckCircle2 className="size-2.5" />
                                <span>Synced</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSyncPlatform(account.platform)}
                                className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200/60 inline-flex items-center gap-1 cursor-pointer hover:bg-amber-100"
                              >
                                <span>Sync now</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDisconnectPlatform(account.platform)}
                              title="Disconnect account"
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
                            >
                              <Unlink className="size-3" />
                            </button>
                          </div>
                        </div>
                        {/* Row 2: @handle • Rating (Rank) */}
                        <div className="mt-1 pl-[28px] text-[11px] text-slate-500 dark:text-zinc-400 font-mono truncate">
                          @{account.username}
                          {rating ? (
                            <span className="text-slate-600 dark:text-zinc-300">
                              {" "}&bull; Rating {rating}
                              {rank && !String(rank).startsWith("#") ? ` (${rank})` : ""}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-5 text-center bg-slate-50/50 dark:bg-zinc-900/30">
                  <div className="inline-flex size-9 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 items-center justify-center mb-1.5">
                    <Code2 className="size-4" />
                  </div>
                  <p className="text-xs font-medium text-slate-600 dark:text-zinc-400">No coding profiles connected</p>
                  <button
                    type="button"
                    onClick={() => setIsConnectingPlatform(true)}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-1 cursor-pointer block mx-auto"
                  >
                    + Connect a platform
                  </button>
                </div>
              )}
            </div>

            {/* 7. DYNAMIC SOCIAL LINKS */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Social Links
                </h3>
                <Link
                  href="/dashboard/profile/edit"
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Edit
                </Link>
              </div>

              {activeSocialLinks.length > 0 ? (
                <div className="space-y-3">
                  {activeSocialLinks.map((social) => {
                    const IconComp = social.icon;
                    return (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <IconComp className={`size-4.5 ${social.color} shrink-0`} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors leading-tight truncate">
                              {social.name}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono truncate">
                              {social.handle}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0">
                          <span className="hidden xs:inline">Visit</span>
                          <ExternalLink className="size-3" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-5 text-center bg-slate-50/50 dark:bg-zinc-900/30">
                  <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">No social links added yet</p>
                  <Link
                    href="/dashboard/profile/edit"
                    className="text-[11px] font-semibold text-blue-600 hover:underline mt-1 inline-block"
                  >
                    + Add social links
                  </Link>
                </div>
              )}
            </div>

            {/* 8. OTHER LINKS */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 shadow-xs">
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">
                Other Links
              </h3>
              {profile?.portfolioUrl ? (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Globe className="size-3.5 text-blue-500 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-zinc-200 truncate">
                      {profile.portfolioUrl}
                    </span>
                  </div>
                  <ExternalLink className="size-3 text-slate-400 shrink-0" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="w-full rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-4 text-center bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <div className="inline-flex size-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 items-center justify-center mb-1">
                    <Link2 className="size-3.5" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Click to add portfolio link</p>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADVANCED EDIT PROFILE MODAL (WITH FILE UPLOADER & LINK INPUTS)             */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50">
                Edit Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Scrollable Form */}
            <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) => setEditForm((f) => ({ ...f, displayName: e.target.value }))}
                  placeholder="e.g. Ritesh Singh"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Headline / Role Badge
                </label>
                <input
                  type="text"
                  value={editForm.headline}
                  onChange={(e) => setEditForm((f) => ({ ...f, headline: e.target.value }))}
                  placeholder="e.g. Student or Full-Stack Engineer"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Bhubaneswar, Odisha, India"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative" ref={modalCollegeWrapperRef}>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300">
                    College or Workplace
                  </label>
                  <span className="text-[10px] text-slate-400">All India coverage</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={editForm.collegeOrCompany}
                    onFocus={() => {
                      setModalCollegeSearch(editForm.collegeOrCompany);
                      setIsModalCollegeOpen(true);
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditForm((f) => ({ ...f, collegeOrCompany: val }));
                      setModalCollegeSearch(val);
                      setIsModalCollegeOpen(true);
                    }}
                    placeholder="Search or type college (e.g. CVRGU, IIT, NIT, BITS)..."
                    className="w-full px-3 py-2 pr-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsModalCollegeOpen((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </div>

                {isModalCollegeOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-transparent cursor-default"
                      onClick={() => setIsModalCollegeOpen(false)}
                    />
                    <div className="absolute z-50 left-0 right-0 top-full mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-black/10 py-0 text-xs">
                      {/* Sticky Header */}
                      <div className="sticky top-0 z-10 px-3.5 py-2 bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-zinc-200 uppercase tracking-wider">
                        <span>Select College / Workplace</span>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-700">
                          {filteredModalColleges.length} matches
                        </span>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {filteredModalColleges.length > 0 ? (
                          filteredModalColleges.map((cName) => (
                            <button
                              key={cName}
                              type="button"
                              onClick={() => {
                                setEditForm((f) => ({ ...f, collegeOrCompany: cName }));
                                setIsModalCollegeOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 transition-colors flex items-center justify-between cursor-pointer ${
                                editForm.collegeOrCompany === cName
                                  ? "bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 font-semibold"
                                  : "text-slate-800 dark:text-zinc-200"
                              }`}
                            >
                              <span className="truncate pr-2">{cName}</span>
                              {editForm.collegeOrCompany === cName && (
                                <Check className="size-3.5 text-blue-600 shrink-0" />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="p-3.5 text-center text-xs text-slate-400 space-y-2">
                            <p>No exact match in our 51,000+ colleges list.</p>
                            {modalCollegeSearch.trim() && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditForm((f) => ({ ...f, collegeOrCompany: modalCollegeSearch.trim() }));
                                  setIsModalCollegeOpen(false);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 transition-colors cursor-pointer text-xs"
                              >
                                + Use "{modalCollegeSearch.trim()}" as my institution
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Sticky Footer */}
                      <div className="sticky bottom-0 z-10 px-3 py-1.5 bg-slate-50 dark:bg-zinc-800/90 border-t border-slate-200 dark:border-zinc-700 text-[10px] text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                        <span>Click to select institution</span>
                        <button
                          type="button"
                          onClick={() => setIsModalCollegeOpen(false)}
                          className="hover:text-slate-800 dark:text-zinc-200 font-semibold underline cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  About / Bio
                </label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell the community about yourself, tech stack, and goals..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* PROFILE PHOTO: FILE UPLOAD OR URL + LIVE PREVIEW */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-zinc-300">
                    Profile Photo
                  </label>
                  <span className="text-[11px] text-slate-400">Upload file or enter URL</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Photo Preview Thumbnail */}
                  <div className="size-12 rounded-full overflow-hidden bg-slate-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-700 shrink-0">
                    {editForm.photoUrl ? (
                      <img src={editForm.photoUrl} alt="Preview" className="size-full object-cover" />
                    ) : (
                      <div className="size-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="size-5" />
                      </div>
                    )}
                  </div>

                  {/* Upload from device button */}
                  <input
                    type="file"
                    ref={photoFileInputRef}
                    onChange={handlePhotoFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer shadow-xs"
                  >
                    <Upload className="size-3.5 text-blue-600" />
                    <span>Upload Image File</span>
                  </button>

                  {editForm.photoUrl && (
                    <button
                      type="button"
                      onClick={() => setEditForm((f) => ({ ...f, photoUrl: "" }))}
                      className="text-xs text-rose-500 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <input
                  type="url"
                  value={editForm.photoUrl}
                  onChange={(e) => setEditForm((f) => ({ ...f, photoUrl: e.target.value }))}
                  placeholder="Or paste image URL (https://...)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              {/* COVER BANNER: FILE UPLOAD OR URL + LIVE PREVIEW */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-zinc-300">
                    Cover Banner
                  </label>
                  <span className="text-[11px] text-slate-400">Upload banner file or enter URL</span>
                </div>

                {/* Banner Preview Strip: 4:1 Aspect Ratio */}
                <div className="w-full aspect-[4/1] min-h-[70px] max-h-[130px] rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 relative flex items-center justify-center">
                  {editForm.bannerUrl ? (
                    <img src={editForm.bannerUrl} alt="Banner Preview" className="size-full object-cover" />
                  ) : (
                    <span className="text-xs font-serif font-bold text-slate-500">
                      Build. Grow. Serve.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={bannerFileInputRef}
                    onChange={handleBannerFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bannerFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer shadow-xs"
                  >
                    <Upload className="size-3.5 text-blue-600" />
                    <span>Upload Banner File</span>
                  </button>

                  {editForm.bannerUrl && (
                    <button
                      type="button"
                      onClick={() => setEditForm((f) => ({ ...f, bannerUrl: "" }))}
                      className="text-xs text-rose-500 hover:underline cursor-pointer"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>

                <input
                  type="url"
                  value={editForm.bannerUrl}
                  onChange={(e) => setEditForm((f) => ({ ...f, bannerUrl: e.target.value }))}
                  placeholder="Or paste banner URL (https://...)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              {/* DYNAMIC SOCIAL LINKS */}
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Social &amp; Portfolio Links
                </span>
                <div className="space-y-2">
                  <input
                    type="url"
                    value={editForm.githubUrl}
                    onChange={(e) => setEditForm((f) => ({ ...f, githubUrl: e.target.value }))}
                    placeholder="GitHub URL (e.g. https://github.com/neutron420)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                  <input
                    type="url"
                    value={editForm.linkedinUrl}
                    onChange={(e) => setEditForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
                    placeholder="LinkedIn URL (e.g. https://linkedin.com/in/ritesh-singh1)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                  <input
                    type="url"
                    value={editForm.twitterUrl}
                    onChange={(e) => setEditForm((f) => ({ ...f, twitterUrl: e.target.value }))}
                    placeholder="Twitter / X URL (e.g. https://x.com/yourhandle)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                  <input
                    type="url"
                    value={editForm.instagramUrl}
                    onChange={(e) => setEditForm((f) => ({ ...f, instagramUrl: e.target.value }))}
                    placeholder="Instagram URL (e.g. https://instagram.com/ritesshhh.rs)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                  <input
                    type="url"
                    value={editForm.portfolioUrl}
                    onChange={(e) => setEditForm((f) => ({ ...f, portfolioUrl: e.target.value }))}
                    placeholder="Portfolio URL (e.g. https://ritesh.dev)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 font-medium text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {isSaving && <Loader2 className="size-4 animate-spin" />}
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CROP COVER IMAGE MODAL (Matches user's screenshot) */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-card w-full max-w-xl rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
                  Crop cover image
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Drag to reposition. Image must be at least 1080 × 200px.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCoverModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content / Dropzone */}
            {!coverPreviewUrl ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsCoverDragging(true);
                }}
                onDragLeave={() => setIsCoverDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsCoverDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleCoverFileSelect(file);
                }}
                className={`rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3 transition-colors ${
                  isCoverDragging
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                    : "border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/40"
                }`}
              >
                <span className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                  Drag and drop an image here, or
                </span>
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs sm:text-sm font-semibold shadow-2xs transition-all cursor-pointer"
                >
                  <Upload className="size-4 text-slate-500 dark:text-zinc-400" />
                  <span>Choose image</span>
                </button>
                <input
                  ref={coverFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCoverFileSelect(file);
                  }}
                />
                <div className="w-full max-w-sm pt-3 border-t border-slate-200/60 dark:border-zinc-800 mt-2">
                  <input
                    type="text"
                    value={coverPreviewUrl}
                    onChange={(e) => setCoverPreviewUrl(e.target.value)}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative w-full aspect-[4/1] rounded-xl overflow-hidden border border-slate-300 dark:border-zinc-700 shadow-inner bg-slate-100 dark:bg-zinc-900 select-none">
                  <img
                    src={coverPreviewUrl}
                    alt="Cover preview"
                    style={{ objectPosition: `center ${coverRepositionY}%` }}
                    className="size-full object-cover transition-all"
                  />
                  <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-medium bg-black/60 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                    Preview (1080 × 200px)
                  </span>
                </div>

                {/* Reposition Slider */}
                <div className="flex items-center justify-between gap-3 px-1">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                    Vertical position: {coverRepositionY}%
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={coverRepositionY}
                    onChange={(e) => setCoverRepositionY(Number(e.target.value))}
                    className="flex-1 max-w-[200px] h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1 font-medium"
                  >
                    <Upload className="size-3" />
                    <span>Change image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCoverPreviewUrl("");
                      if (coverFileInputRef.current) coverFileInputRef.current.value = "";
                    }}
                    className="text-xs text-rose-500 hover:underline cursor-pointer flex items-center gap-1 font-medium"
                  >
                    <Trash2 className="size-3" />
                    <span>Remove</span>
                  </button>
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCoverFileSelect(file);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsCoverModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCoverImage}
                disabled={isCoverSaving || !coverPreviewUrl}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isCoverSaving ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Upload</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
