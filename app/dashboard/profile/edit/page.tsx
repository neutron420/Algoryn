"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "sonner";
import {
  User as UserIcon,
  GraduationCap,
  Briefcase,
  Wrench,
  Rocket,
  Link2,
  FileText,
  Save,
  Upload,
  Trash2,
  Camera,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Pencil,
  Eye,
  EyeOff,
  Plus,
  X,
  Loader2,
  Check,
  Search,
  ExternalLink,
  Sparkles,
  LayoutGrid,
  ArrowLeft,
  Info,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa6";
import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiGeeksforgeeks,
  SiHackerrank,
} from "react-icons/si";
import {
  INDIAN_COLLEGES,
  PROGRAMMING_LANGUAGES,
  POPULAR_LANGUAGES,
  TECH_STACK_OPTIONS,
  POPULAR_TECH_STACK,
  CS_CONCEPTS_OPTIONS,
  POPULAR_CONCEPTS,
} from "@/lib/profile-constants";

interface EducationItem {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  grade?: string;
  isVisible: boolean;
}

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description?: string;
  isVisible: boolean;
}

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  isVisible: boolean;
}

interface SkillsState {
  languages: string[];
  backendInfra: string[];
  concepts: string[];
}

interface OtherLinkItem {
  id: string;
  title: string;
  url: string;
}

interface SectionVisibilityState {
  showEducation: boolean;
  showExperience: boolean;
  showSkills: boolean;
  showProjects: boolean;
  showConnections: boolean;
  showCodingProfiles: boolean;
  showSocialLinks: boolean;
  showOtherLinks: boolean;
  showAchievements: boolean;
  showAtAGlance: boolean;
  showTitles: boolean;
  showTrophies: boolean;
  showProblemsSolved: boolean;
  showBestStreak: boolean;
  showGlobalRank?: boolean;
  showLanguagesGlance: boolean;
  hiddenItems?: Record<string, boolean>;
}

const DEFAULT_COLLEGES = INDIAN_COLLEGES;

const GRADUATION_YEARS = Array.from({ length: 14 }, (_, i) => 2020 + i);

const ROLE_OPTIONS = [
  "Student",
  "Working Professional",
  "Fresher / Looking for Jobs",
  "Self-taught Developer",
  "School Student",
];

const CODING_PLATFORM_CONFIG = [
  { id: "leetcode", name: "LeetCode", prefix: "https://leetcode.com/u/", icon: SiLeetcode, color: "text-amber-500", placeholder: "https://leetcode.com/u/username or username" },
  { id: "codeforces", name: "Codeforces", prefix: "https://codeforces.com/profile/", icon: SiCodeforces, color: "text-blue-500", placeholder: "https://codeforces.com/profile/username or username" },
  { id: "hackerrank", name: "HackerRank", prefix: "https://www.hackerrank.com/profile/", icon: SiHackerrank, color: "text-emerald-500", placeholder: "Enter your profile or username" },
  { id: "geeksforgeeks", name: "GeeksforGeeks", prefix: "https://www.geeksforgeeks.org/user/", icon: SiGeeksforgeeks, color: "text-green-600", placeholder: "Enter your profile or username" },
  { id: "codechef", name: "CodeChef", prefix: "https://www.codechef.com/users/", icon: SiCodechef, color: "text-amber-700", placeholder: "Enter your profile or username" },
  { id: "atcoder", name: "AtCoder", prefix: "https://atcoder.jp/users/", icon: SiLeetcode, color: "text-neutral-700 dark:text-neutral-300", placeholder: "Enter your profile or username" },
  { id: "hackerearth", name: "HackerEarth", prefix: "https://www.hackerearth.com/@", icon: SiHackerrank, color: "text-blue-600", placeholder: "Enter your profile or username" },
  { id: "codestudio", name: "CodeStudio / Coding Ninjas", prefix: "https://www.naukri.com/code360/profile/", icon: Sparkles, color: "text-orange-500", placeholder: "Enter your profile or username" },
  { id: "interviewbit", name: "InterviewBit", prefix: "https://www.interviewbit.com/profile/", icon: SiLeetcode, color: "text-indigo-600", placeholder: "Enter your profile or username" },
];

const SOCIAL_PLATFORM_CONFIG = [
  { id: "github", name: "GitHub", prefix: "https://github.com/", icon: FaGithub, color: "text-slate-900 dark:text-zinc-100", placeholder: "https://github.com/username or username" },
  { id: "linkedin", name: "LinkedIn", prefix: "https://www.linkedin.com/in/", icon: FaLinkedin, color: "text-blue-600", placeholder: "https://www.linkedin.com/in/username or username" },
  { id: "instagram", name: "Instagram", prefix: "https://www.instagram.com/", icon: FaInstagram, color: "text-pink-600", placeholder: "https://www.instagram.com/username or username" },
  { id: "twitter", name: "X", prefix: "https://x.com/", icon: FaXTwitter, color: "text-slate-900 dark:text-zinc-100", placeholder: "Enter your profile or username" },
  { id: "youtube", name: "YouTube", prefix: "https://youtube.com/@", icon: FaYoutube, color: "text-red-600", placeholder: "Enter your profile or channel" },
  { id: "portfolio", name: "Portfolio / Website", prefix: "https://", icon: FaGlobe, color: "text-emerald-600", placeholder: "https://yourportfolio.com" },
];

const DEFAULT_LANGUAGES = PROGRAMMING_LANGUAGES;
const DEFAULT_BACKEND = TECH_STACK_OPTIONS;
const DEFAULT_CONCEPTS = CS_CONCEPTS_OPTIONS;

function EditProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background text-slate-800 dark:text-zinc-100 font-sans pb-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 animate-pulse">
        {/* Top Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded bg-slate-200 dark:bg-zinc-800" />
            <div className="h-7 w-40 rounded-md bg-slate-200 dark:bg-zinc-800" />
            <div className="h-3.5 w-64 rounded bg-slate-200 dark:bg-zinc-800" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-zinc-800" />
            <div className="h-8 w-28 rounded-lg bg-slate-200 dark:bg-zinc-800" />
          </div>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar Skeleton */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-2 sm:p-2.5 shadow-xs space-y-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-10 rounded-xl bg-slate-100 dark:bg-zinc-900" />
              ))}
            </div>
          </div>

          {/* Right Content Skeleton */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="h-4 w-32 rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="h-36 rounded-xl bg-slate-100 dark:bg-zinc-900" />
            </div>
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="h-4 w-32 rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="size-20 rounded-full bg-slate-100 dark:bg-zinc-900" />
            </div>
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="h-4 w-32 rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-10 rounded-xl bg-slate-100 dark:bg-zinc-900" />
                <div className="h-10 rounded-xl bg-slate-100 dark:bg-zinc-900" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


const MONTH_OPTIONS = [
  "Month",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = ["Year", ...Array.from({ length: 45 }, (_, i) => String(CURRENT_YEAR + 6 - i))];

function parseMonthYear(dateStr?: string) {
  if (!dateStr || dateStr === "Present") return { month: "Month", year: "Year" };
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 2) {
    return { month: parts[0], year: parts[1] };
  }
  if (parts.length === 1) {
    if (/^\d{4}$/.test(parts[0])) return { month: "Month", year: parts[0] };
    return { month: parts[0], year: "Year" };
  }
  return { month: "Month", year: "Year" };
}

function formatMonthYear(month: string, year: string) {
  const m = month && month !== "Month" ? month : "";
  const y = year && year !== "Year" ? year : "";
  if (m && y) return `${m} ${y}`;
  if (y) return y;
  if (m) return m;
  return "";
}

function getWordCount(text?: string) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "basic" | "education" | "experience" | "skills" | "projects" | "connections" | "achievements"
  >("basic");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);
  // Query param tab reader
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && ["basic", "education", "experience", "skills", "projects", "connections", "achievements"].includes(tab)) {
        setActiveTab(tab as any);
      }
    }
  }, []);


  // Basic Details
  const [bannerUrl, setBannerUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingBanner, setIsDeletingBanner] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  // Profile Information
  const [roleType, setRoleType] = useState("Student");
  const [graduationYear, setGraduationYear] = useState<number | "">("");
  const [college, setCollege] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");

  // College Dropdown Combobox state
  const [isCollegeOpen, setIsCollegeOpen] = useState(false);
  const [collegeSearch, setCollegeSearch] = useState("");
  const collegeWrapperRef = useRef<HTMLDivElement>(null);

  // Education Tab State
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);

  // Experience Tab State
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);

  // Skills Tab State
  const [skills, setSkills] = useState<SkillsState>({
    languages: [],
    backendInfra: [],
    concepts: [],
  });
  const [newLanguageInput, setNewLanguageInput] = useState("");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langWrapperRef = useRef<HTMLDivElement>(null);

  const [newBackendInput, setNewBackendInput] = useState("");
  const [isBackendDropdownOpen, setIsBackendDropdownOpen] = useState(false);
  const backendWrapperRef = useRef<HTMLDivElement>(null);

  const [newConceptInput, setNewConceptInput] = useState("");
  const [isConceptDropdownOpen, setIsConceptDropdownOpen] = useState(false);
  const conceptWrapperRef = useRef<HTMLDivElement>(null);

  // Education Modal School Dropdown
  const [isEduSchoolOpen, setIsEduSchoolOpen] = useState(false);
  const [eduSchoolSearch, setEduSchoolSearch] = useState("");
  const eduSchoolWrapperRef = useRef<HTMLDivElement>(null);

  // Projects Tab State
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [newProjectTechInput, setNewProjectTechInput] = useState("");
  const [isProjectTechOpen, setIsProjectTechOpen] = useState(false);
  const projectTechWrapperRef = useRef<HTMLDivElement>(null);

  // Connections Tab State
  const [codingProfiles, setCodingProfiles] = useState<Record<string, { value: string; isVisible: boolean }>>({
    leetcode: { value: "", isVisible: true },
    codeforces: { value: "", isVisible: true },
    hackerrank: { value: "", isVisible: true },
    geeksforgeeks: { value: "", isVisible: true },
    codechef: { value: "", isVisible: true },
    atcoder: { value: "", isVisible: true },
    hackerearth: { value: "", isVisible: true },
    codestudio: { value: "", isVisible: true },
    interviewbit: { value: "", isVisible: true },
  });

  const [socialProfiles, setSocialProfiles] = useState<Record<string, { value: string; isVisible: boolean }>>({
    github: { value: "", isVisible: true },
    linkedin: { value: "", isVisible: true },
    instagram: { value: "", isVisible: true },
    twitter: { value: "", isVisible: true },
    youtube: { value: "", isVisible: true },
    portfolio: { value: "", isVisible: true },
  });

  const [otherLinks, setOtherLinks] = useState<OtherLinkItem[]>([]);
  const [isOtherLinkModalOpen, setIsOtherLinkModalOpen] = useState(false);
  const [newOtherLinkTitle, setNewOtherLinkTitle] = useState("");
  const [newOtherLinkUrl, setNewOtherLinkUrl] = useState("");

  // Section Visibility State
  const [visibility, setVisibility] = useState<SectionVisibilityState>({
    showEducation: true,
    showExperience: true,
    showSkills: true,
    showProjects: true,
    showConnections: true,
    showCodingProfiles: true,
    showSocialLinks: true,
    showOtherLinks: true,
    showAchievements: true,
    showAtAGlance: true,
    showTitles: true,
    showTrophies: true,
    showProblemsSolved: true,
    showBestStreak: true,
    showLanguagesGlance: true,
    hiddenItems: {},
  });

  // Image Upload Dialog / File Prompt Helper
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);

  // Close college combobox on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (collegeWrapperRef.current && !collegeWrapperRef.current.contains(target)) {
        setIsCollegeOpen(false);
      }
      if (langWrapperRef.current && !langWrapperRef.current.contains(target)) {
        setIsLangDropdownOpen(false);
      }
      if (backendWrapperRef.current && !backendWrapperRef.current.contains(target)) {
        setIsBackendDropdownOpen(false);
      }
      if (conceptWrapperRef.current && !conceptWrapperRef.current.contains(target)) {
        setIsConceptDropdownOpen(false);
      }
      if (eduSchoolWrapperRef.current && !eduSchoolWrapperRef.current.contains(target)) {
        setIsEduSchoolOpen(false);
      }
      if (projectTechWrapperRef.current && !projectTechWrapperRef.current.contains(target)) {
        setIsProjectTechOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch initial profile
  useEffect(() => {
    async function loadProfile() {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/user/profile?userId=${encodeURIComponent(user.uid)}`);
        const data = await res.json();

        if (data?.profile) {
          const p = data.profile;
          setDisplayName(p.displayName || user.displayName || "");
          setUsername(p.username || (user.email ? user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") : ""));
          setEmail(p.email || user.email || "");
          setPhoneNumber(p.phoneNumber || user.phoneNumber || "");
          setLocation(p.location || "");
          setHeadline(p.headline || "");
          setBio(p.bio || "");
          setBannerUrl(p.bannerUrl || "");
          setPhotoUrl(p.photoUrl || user.photoURL || "");
          setRoleType(p.roleType || "Student");
          setGraduationYear(p.graduationYear || "");
          setCollege(p.collegeOrCompany || "");

          // Education History
          if (Array.isArray(p.educationHistory)) {
            setEducations(p.educationHistory);
          } else {
            setEducations([]);
          }

          // Experience History
          if (Array.isArray(p.experienceHistory)) {
            setExperiences(p.experienceHistory);
          } else {
            setExperiences([]);
          }

          // Skills
          if (p.skillsData && typeof p.skillsData === "object") {
            setSkills({
              languages: Array.isArray(p.skillsData.languages) ? p.skillsData.languages : [],
              backendInfra: Array.isArray(p.skillsData.backendInfra) ? p.skillsData.backendInfra : [],
              concepts: Array.isArray(p.skillsData.concepts) ? p.skillsData.concepts : [],
            });
          }

          // Projects
          if (Array.isArray(p.projectList)) {
            setProjects(p.projectList);
          } else {
            setProjects([]);
          }

          // Connections Data
          if (p.connectionsData && typeof p.connectionsData === "object") {
            if (p.connectionsData.codingProfiles) {
              setCodingProfiles((prev) => ({
                ...prev,
                ...p.connectionsData.codingProfiles,
              }));
            }
            if (p.connectionsData.socialProfiles) {
              setSocialProfiles((prev) => ({
                ...prev,
                ...p.connectionsData.socialProfiles,
              }));
            }
            if (Array.isArray(p.connectionsData.otherLinks)) {
              setOtherLinks(p.connectionsData.otherLinks);
            }
          } else {
            // Populate from individual URLs if present
            setSocialProfiles((prev) => ({
              ...prev,
              github: { value: p.githubUrl || "", isVisible: true },
              linkedin: { value: p.linkedinUrl || "", isVisible: true },
              instagram: { value: p.instagramUrl || "", isVisible: true },
              twitter: { value: p.twitterUrl || "", isVisible: true },
              portfolio: { value: p.portfolioUrl || "", isVisible: true },
            }));
          }

          // Section Visibility
          if (p.sectionVisibility && typeof p.sectionVisibility === "object") {
            setVisibility((prev) => ({
              ...prev,
              ...p.sectionVisibility,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load profile for editing:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  // Dynamic API state for colleges
  const [apiColleges, setApiColleges] = useState<string[]>([]);
  const [apiEduColleges, setApiEduColleges] = useState<string[]>([]);

  // Dynamic fetch to /api/colleges when typing in main college search
  useEffect(() => {
    const q = collegeSearch.trim();
    if (q.length < 2) {
      setApiColleges([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/colleges?search=${encodeURIComponent(q)}&limit=40`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.colleges)) {
            setApiColleges(data.colleges);
          }
        }
      } catch {
        // fallback to local list
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [collegeSearch]);

  // Dynamic fetch to /api/colleges when typing in education modal school search
  useEffect(() => {
    const q = eduSchoolSearch.trim();
    if (q.length < 2) {
      setApiEduColleges([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/colleges?search=${encodeURIComponent(q)}&limit=40`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.colleges)) {
            setApiEduColleges(data.colleges);
          }
        }
      } catch {
        // fallback to local list
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [eduSchoolSearch]);

  // Filtered colleges for combobox (Smart search across India + Dynamic API results)
  const filteredColleges = useMemo(() => {
    const q = collegeSearch.trim().toLowerCase();
    if (!q) return INDIAN_COLLEGES.slice(0, 50);
    const searchTerms = q.split(/\s+/).filter(Boolean);
    const local = INDIAN_COLLEGES.filter((c) => {
      const lower = c.toLowerCase();
      return searchTerms.every((term) => lower.includes(term));
    });
    const merged = Array.from(new Set([...local, ...apiColleges]));
    return merged.slice(0, 60);
  }, [collegeSearch, apiColleges]);

  // Filtered languages for Skills combobox
  const filteredLanguages = useMemo(() => {
    const q = newLanguageInput.trim().toLowerCase();
    const available = PROGRAMMING_LANGUAGES.filter(
      (lang) => !skills.languages.includes(lang)
    );
    if (!q) return available;
    return available.filter((lang) => lang.toLowerCase().includes(q));
  }, [newLanguageInput, skills.languages]);

  // Filtered backend/infra for Skills combobox
  const filteredBackend = useMemo(() => {
    const q = newBackendInput.trim().toLowerCase();
    const available = TECH_STACK_OPTIONS.filter(
      (tech) => !skills.backendInfra.includes(tech)
    );
    if (!q) return available;
    return available.filter((tech) => tech.toLowerCase().includes(q));
  }, [newBackendInput, skills.backendInfra]);

  // Filtered concepts for Skills combobox
  const filteredConcepts = useMemo(() => {
    const q = newConceptInput.trim().toLowerCase();
    const available = CS_CONCEPTS_OPTIONS.filter(
      (concept) => !skills.concepts.includes(concept)
    );
    if (!q) return available;
    return available.filter((concept) => concept.toLowerCase().includes(q));
  }, [newConceptInput, skills.concepts]);

  // Filtered colleges for Education modal (Instant local + Dynamic API)
  const filteredEduSchools = useMemo(() => {
    const q = eduSchoolSearch.trim().toLowerCase();
    if (!q) return INDIAN_COLLEGES.slice(0, 50);
    const searchTerms = q.split(/\s+/).filter(Boolean);
    const local = INDIAN_COLLEGES.filter((c) => {
      const lower = c.toLowerCase();
      return searchTerms.every((term) => lower.includes(term));
    });
    const merged = Array.from(new Set([...local, ...apiEduColleges]));
    return merged.slice(0, 60);
  }, [eduSchoolSearch, apiEduColleges]);

  // Filtered tech stack for Project modal
  const filteredProjectTech = useMemo(() => {
    const q = newProjectTechInput.trim().toLowerCase();
    const combined = Array.from(new Set([...TECH_STACK_OPTIONS, ...PROGRAMMING_LANGUAGES]));
    const current = editingProject?.techStack || [];
    const available = combined.filter((tech) => !current.includes(tech));
    if (!q) return available.slice(0, 30);
    return available.filter((tech) => tech.toLowerCase().includes(q));
  }, [newProjectTechInput, editingProject?.techStack]);

  // Handle Banner Upload via Cloudflare R2 (/api/upload)
  const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Banner image must be less than 5 MB");
      return;
    }

    setIsUploadingBanner(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "banners");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (uploadRes.ok && uploadData.success && uploadData.url) {
        setBannerUrl(uploadData.url);
        if (user?.uid) {
          await fetch("/api/user/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.uid, bannerUrl: uploadData.url }),
          });
        }
        toast.success("Cover banner updated successfully!");
        return;
      }
      throw new Error(uploadData.error || "Upload failed");
    } catch {
      // Fallback to local DataURL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setBannerUrl(reader.result);
          toast.success("Banner image loaded. Remember to click 'Save changes'.");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingBanner(false);
      if (bannerFileRef.current) {
        bannerFileRef.current.value = "";
      }
    }
  };

  // Immediate Banner Removal
  const handleDeleteBanner = async () => {
    setIsDeletingBanner(true);
    setBannerUrl("");
    if (bannerFileRef.current) {
      bannerFileRef.current.value = "";
    }

    if (user?.uid) {
      try {
        const res = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, bannerUrl: null }),
        });
        if (res.ok) {
          toast.success("Banner removed successfully!");
          setIsDeletingBanner(false);
          return;
        }
      } catch {
        // Fallback to commit on save
      }
    }
    toast.success("Banner removed. Click 'Save changes' to commit.");
    setIsDeletingBanner(false);
  };

  // Handle Avatar Upload via Cloudflare R2 (/api/upload)
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar image must be less than 2 MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "avatars");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (uploadRes.ok && uploadData.success && uploadData.url) {
        setPhotoUrl(uploadData.url);
        if (user?.uid) {
          await fetch("/api/user/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.uid, photoUrl: uploadData.url }),
          });
        }
        toast.success("Profile photo updated successfully!");
        return;
      }
      throw new Error(uploadData.error || "Upload failed");
    } catch {
      // Fallback to local DataURL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPhotoUrl(reader.result);
          toast.success("Profile photo loaded. Remember to click 'Save changes'.");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingAvatar(false);
      if (avatarFileRef.current) {
        avatarFileRef.current.value = "";
      }
    }
  };

  // Immediate Avatar Removal
  const handleDeleteAvatar = async () => {
    setIsDeletingAvatar(true);
    setPhotoUrl("");
    if (avatarFileRef.current) {
      avatarFileRef.current.value = "";
    }

    if (user?.uid) {
      try {
        const res = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, photoUrl: null }),
        });
        if (res.ok) {
          toast.success("Profile picture removed successfully!");
          setIsDeletingAvatar(false);
          return;
        }
      } catch {
        // Fallback to commit on save
      }
    }
    toast.success("Profile picture removed. Click 'Save changes' to commit.");
    setIsDeletingAvatar(false);
  };

  // Tag chip add / remove helpers
  const handleAddLanguage = (val: string) => {
    const clean = val.trim();
    if (!clean) return;
    if (!skills.languages.includes(clean)) {
      setSkills((prev) => ({ ...prev, languages: [...prev.languages, clean] }));
    }
    setNewLanguageInput("");
  };

  const handleRemoveLanguage = (val: string) => {
    setSkills((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== val),
    }));
  };

  const handleAddBackend = (val: string) => {
    const clean = val.trim();
    if (!clean) return;
    if (!skills.backendInfra.includes(clean)) {
      setSkills((prev) => ({ ...prev, backendInfra: [...prev.backendInfra, clean] }));
    }
    setNewBackendInput("");
  };

  const handleRemoveBackend = (val: string) => {
    setSkills((prev) => ({
      ...prev,
      backendInfra: prev.backendInfra.filter((b) => b !== val),
    }));
  };

  const handleAddConcept = (val: string) => {
    const clean = val.trim();
    if (!clean) return;
    if (!skills.concepts.includes(clean)) {
      setSkills((prev) => ({ ...prev, concepts: [...prev.concepts, clean] }));
    }
    setNewConceptInput("");
  };

  const handleRemoveConcept = (val: string) => {
    setSkills((prev) => ({
      ...prev,
      concepts: prev.concepts.filter((c) => c !== val),
    }));
  };

  // Master Save Handler
  const handleSaveChanges = async () => {
    if (!user?.uid) {
      toast.error("Please log in to save changes");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        userId: user.uid,
        displayName: displayName.trim(),
        username: username.trim(),
        phoneNumber: phoneNumber.trim(),
        location: location.trim(),
        roleType,
        graduationYear: graduationYear ? Number(graduationYear) : null,
        collegeOrCompany: college.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        bannerUrl: bannerUrl || null,
        photoUrl: photoUrl || null,
        githubUrl: socialProfiles.github?.value || null,
        linkedinUrl: socialProfiles.linkedin?.value || null,
        twitterUrl: socialProfiles.twitter?.value || null,
        instagramUrl: socialProfiles.instagram?.value || null,
        portfolioUrl: socialProfiles.portfolio?.value || null,
        educationHistory: educations,
        experienceHistory: experiences,
        skillsData: skills,
        projectList: projects,
        connectionsData: {
          codingProfiles,
          socialProfiles,
          otherLinks,
        },
        sectionVisibility: visibility,
      };

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Trigger background sync for linked coding profiles so stats fetch immediately
      fetch("/api/user/platforms/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      }).catch(() => {});

      toast.success("Profile saved successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save profile";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <EditProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background text-slate-800 dark:text-zinc-100 font-sans pb-16">
      {/* Hidden File Inputs for Banner & Picture */}
      <input
        type="file"
        ref={bannerFileRef}
        onChange={handleBannerFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={avatarFileRef}
        onChange={handleAvatarFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Top Breadcrumb & Page Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mb-1 font-medium">
              <Link
                href="/dashboard/profile"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Profile
              </Link>
              <span>/</span>
              <span className="text-slate-900 dark:text-zinc-200">Edit Profile</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Edit Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
              Customize your information and control how it appears to others
            </p>
          </div>

          {/* Top Action Buttons: Edit Layout & Save changes */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsLayoutModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-blue-500/80 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs sm:text-sm font-semibold transition-colors cursor-pointer bg-white dark:bg-zinc-900"
            >
              <LayoutGrid className="size-4" />
              <span>Edit Layout</span>
            </button>

            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              <span>Save changes</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Left Vertical Navigation, Right Content Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR TABS (~3 cols on md/lg - sticky on desktop, swipeable pill bar on mobile) */}
          <div className="md:col-span-4 lg:col-span-3 md:sticky md:top-20 md:self-start z-10 w-full">
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-1.5 sm:p-2.5 shadow-xs flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: "basic", label: "Basic Information", icon: UserIcon },
                { id: "education", label: "Education", icon: GraduationCap },
                { id: "experience", label: "Experience", icon: Briefcase },
                { id: "skills", label: "Skills", icon: Wrench },
                { id: "projects", label: "Projects", icon: Rocket },
                { id: "connections", label: "Connections", icon: Link2 },
                { id: "achievements", label: "Progress & Achievements", icon: FileText },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`shrink-0 whitespace-nowrap flex items-center gap-2 sm:gap-3 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer text-left ${
                      isActive
                        ? "bg-blue-600 text-white md:bg-blue-50 md:text-blue-600 dark:md:bg-blue-950/60 dark:md:text-blue-400 shadow-xs"
                        : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    <IconComponent className="size-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT MAIN PANEL (~9 cols on md/lg) */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            
            {/* ============================================================== */}
            {/* TAB 1: BASIC INFORMATION                                       */}
            {/* ============================================================== */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                
                {/* 1. Profile Banner Card (LinkedIn 4:1 Ratio) */}
                <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                        Profile Banner
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        Recommended 1584 × 396 px (4:1 aspect ratio). JPEG, PNG, or WebP up to 5 MB.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => bannerFileRef.current?.click()}
                        disabled={isUploadingBanner}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
                      >
                        {isUploadingBanner ? (
                          <Loader2 className="size-3.5 animate-spin text-blue-600" />
                        ) : (
                          <Upload className="size-3.5 text-blue-600" />
                        )}
                        <span>{isUploadingBanner ? "Uploading..." : "Change Banner"}</span>
                      </button>
                      {bannerUrl && (
                        <button
                          type="button"
                          onClick={handleDeleteBanner}
                          disabled={isDeletingBanner}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-xs font-semibold disabled:opacity-60"
                          title="Remove Banner"
                        >
                          {isDeletingBanner ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Banner Preview Area: LinkedIn 4:1 Panoramic Aspect Ratio */}
                  <div className="w-full aspect-[4/1] min-h-[140px] max-h-[240px] rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-slate-100/70 dark:bg-zinc-900/40 overflow-hidden flex items-center justify-center relative shadow-inner">
                    {bannerUrl ? (
                      <img
                        src={bannerUrl}
                        alt="Profile Banner Preview"
                        className="size-full object-cover object-center"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="size-6 text-slate-300 dark:text-zinc-600 mx-auto mb-1.5" />
                        <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                          No custom banner uploaded yet.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Profile Picture Card */}
                <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                        Profile Picture
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        Minimum 400 × 400px. JPEG, PNG, or WebP up to 2 MB. You can crop after upload.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => avatarFileRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
                      >
                        {isUploadingAvatar ? (
                          <Loader2 className="size-3.5 animate-spin text-blue-600" />
                        ) : (
                          <Upload className="size-3.5 text-blue-600" />
                        )}
                        <span>{isUploadingAvatar ? "Uploading..." : "Change Picture"}</span>
                      </button>
                      {photoUrl && (
                        <button
                          type="button"
                          onClick={handleDeleteAvatar}
                          disabled={isDeletingAvatar}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-xs font-semibold disabled:opacity-60"
                          title="Remove Picture"
                        >
                          {isDeletingAvatar ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Avatar Preview */}
                  <div className="relative size-20 sm:size-24 rounded-full p-1 bg-white dark:bg-zinc-900 border-2 border-slate-100 dark:border-zinc-800 shadow-xs">
                    <div className="size-full rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt="Avatar"
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-slate-500">
                          {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => avatarFileRef.current?.click()}
                      className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 shadow-xs cursor-pointer hover:bg-slate-50"
                      title="Upload Avatar"
                    >
                      <Camera className="size-3" />
                    </button>
                  </div>
                </div>

                {/* 3. Basic Details Card */}
                <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-4">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                    Basic Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Alex Johnson"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Username */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. alexj2024"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 leading-relaxed -mt-2">
                    3-20 characters. Letters, numbers, and underscores only. After saving a new username, you cannot change it again for one year.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Mobile Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Bhubaneswar , Odisha , India"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 4. Profile Information Card (Role, Graduation Year, College Combobox, Headline) */}
                <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-4">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                    Profile Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* I am dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        I am
                      </label>
                      <div className="relative">
                        <select
                          value={roleType}
                          onChange={(e) => setRoleType(e.target.value)}
                          className="w-full appearance-none px-3.5 py-2.5 pr-9 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                        >
                          {ROLE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Graduation Year */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Graduation Year
                      </label>
                      <div className="relative">
                        <select
                          value={graduationYear}
                          onChange={(e) => setGraduationYear(e.target.value ? Number(e.target.value) : "")}
                          className="w-full appearance-none px-3.5 py-2.5 pr-9 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                        >
                          <option value="">Select graduation year</option>
                          {GRADUATION_YEARS.map((yr) => (
                            <option key={yr} value={yr}>
                              {yr}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* College Combobox Dropdown */}
                  <div className="space-y-1.5 relative" ref={collegeWrapperRef}>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        College / University
                      </label>
                      <span className="text-[11px] text-slate-400">All India coverage</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={college}
                        onFocus={() => {
                          setCollegeSearch(college);
                          setIsCollegeOpen(true);
                        }}
                        onChange={(e) => {
                          setCollege(e.target.value);
                          setCollegeSearch(e.target.value);
                          setIsCollegeOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && isCollegeOpen) {
                            e.preventDefault();
                            if (filteredColleges.length > 0) {
                              setCollege(filteredColleges[0]);
                            }
                            setIsCollegeOpen(false);
                          } else if (e.key === "Escape") {
                            setIsCollegeOpen(false);
                          }
                        }}
                        placeholder="Search colleges across India (e.g. IIT, NIT, BITS, CVRGU, VIT, RVCE)..."
                        className="w-full px-3.5 py-2.5 pr-16 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
                        {college && (
                          <button
                            type="button"
                            onClick={() => {
                              setCollege("");
                              setCollegeSearch("");
                              setIsCollegeOpen(false);
                            }}
                            className="p-1 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
                            title="Clear"
                          >
                            <X className="size-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsCollegeOpen((prev) => !prev)}
                          className="p-1 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
                        >
                          <ChevronDown className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Dropdown Options */}
                    {isCollegeOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40 bg-transparent cursor-default"
                          onClick={() => setIsCollegeOpen(false)}
                        />
                        <div className="absolute z-50 left-0 right-0 top-full mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-black/10 py-0 text-xs sm:text-sm">
                          <div className="sticky top-0 z-10 px-3.5 py-2 text-[11px] font-bold text-slate-700 dark:text-zinc-200 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between bg-slate-100 dark:bg-zinc-800 uppercase tracking-wider">
                            <span>Colleges & Universities in India</span>
                            <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-700">
                              {filteredColleges.length} matches
                            </span>
                          </div>

                          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                            {filteredColleges.length > 0 ? (
                              filteredColleges.map((cName) => (
                                <button
                                  key={cName}
                                  type="button"
                                  onClick={() => {
                                    setCollege(cName);
                                    setIsCollegeOpen(false);
                                  }}
                                  className={`w-full text-left px-3.5 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 transition-colors flex items-center justify-between cursor-pointer ${
                                    college === cName
                                      ? "bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 font-semibold"
                                      : "text-slate-700 dark:text-zinc-300"
                                  }`}
                                >
                                  <span className="truncate pr-2">{cName}</span>
                                  {college === cName && <Check className="size-3.5 text-blue-600 shrink-0" />}
                                </button>
                              ))
                            ) : (
                              <div className="px-3.5 py-3 text-center text-xs text-slate-400 space-y-2">
                                <p>No matching college found in our 51,000+ list.</p>
                                {collegeSearch.trim() && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCollege(collegeSearch.trim());
                                      setIsCollegeOpen(false);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 transition-colors cursor-pointer text-xs"
                                  >
                                    + Use "{collegeSearch.trim()}" as my college
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {collegeSearch.trim() && filteredColleges.length > 0 && !filteredColleges.includes(collegeSearch.trim()) && (
                            <div className="border-t border-slate-100 dark:border-zinc-800 p-2 text-center bg-slate-50/60 dark:bg-zinc-900/60">
                              <button
                                type="button"
                                onClick={() => {
                                  setCollege(collegeSearch.trim());
                                  setIsCollegeOpen(false);
                                }}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                              >
                                + Use "{collegeSearch.trim()}" as custom college
                              </button>
                            </div>
                          )}

                          <div className="sticky bottom-0 z-10 px-3 py-1.5 bg-slate-50 dark:bg-zinc-800/90 border-t border-slate-200 dark:border-zinc-700 text-[10px] text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                            <span>Click any college to select</span>
                            <button
                              type="button"
                              onClick={() => setIsCollegeOpen(false)}
                              className="hover:text-slate-800 dark:text-zinc-200 font-semibold underline cursor-pointer"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Headline */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Headline
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {headline.length}/100
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={100}
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. Software Engineer @ Google | Competitive Programmer"
                        className="w-full px-3.5 py-2.5 pr-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:border-blue-500"
                      />
                      {headline && (
                        <button
                          type="button"
                          onClick={() => setHeadline("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                          title="Clear headline"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. About you (Bio) Card */}
                <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                      About you (Bio)
                    </h2>
                    {bio && (
                      <button
                        type="button"
                        onClick={() => setBio("")}
                        className="text-xs text-rose-500 hover:underline cursor-pointer font-medium"
                      >
                        Clear Bio
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        About
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {bio.length} characters
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell the community about yourself, tech stack, and goals..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:border-blue-500 leading-relaxed resize-y"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: EDUCATION                                               */}
            {/* ============================================================== */}
            {activeTab === "education" && (
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                    Education
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Show on profile</span>
                    <button
                      type="button"
                      onClick={() =>
                        setVisibility((prev) => ({
                          ...prev,
                          showEducation: !prev.showEducation,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        visibility.showEducation ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                          visibility.showEducation ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {editingEducation ? (
                  /* INLINE EDUCATION FORM: OPENS IN PLACE LIKE TAKEUFORWARD */
                  <div className="rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 p-4 sm:p-5 space-y-4 shadow-2xs">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                        {educations.some((e) => e.id === editingEducation.id) ? "Edit education" : "Add education"}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">Show on profile</span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingEducation({
                              ...editingEducation,
                              isVisible: editingEducation.isVisible === false ? true : false,
                            })
                          }
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                            editingEducation.isVisible !== false ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
                          }`}
                        >
                          <span
                            className={`inline-block size-3.5 transform rounded-full bg-white transition-transform ${
                              editingEducation.isVisible !== false ? "translate-x-4.5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* School / College (with search combobox) */}
                      <div className="sm:col-span-2 relative" ref={eduSchoolWrapperRef}>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">
                            School / College <span className="text-rose-500">*</span>
                          </label>
                          <span className="text-[10px] text-slate-400">All India coverage (51,000+ colleges)</span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={editingEducation.school}
                            onFocus={() => {
                              setEduSchoolSearch(editingEducation.school);
                              setIsEduSchoolOpen(true);
                            }}
                            onChange={(e) => {
                              setEditingEducation({ ...editingEducation, school: e.target.value });
                              setEduSchoolSearch(e.target.value);
                              setIsEduSchoolOpen(true);
                            }}
                            placeholder="Search or enter college (e.g. CVRGU, IIT, NIT, BITS)..."
                            className="w-full px-3.5 py-2.5 pr-9 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setIsEduSchoolOpen((prev) => !prev)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                          >
                            <ChevronDown className="size-4" />
                          </button>
                        </div>

                        {isEduSchoolOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-40 bg-transparent cursor-default"
                              onClick={() => setIsEduSchoolOpen(false)}
                            />
                            <div className="absolute z-50 left-0 right-0 top-full mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl ring-1 ring-black/10 py-0 text-xs">
                              <div className="sticky top-0 z-10 px-3.5 py-2 bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-zinc-200 uppercase tracking-wider">
                                <span>Select School / University</span>
                                <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-700">
                                  {filteredEduSchools.length} matches
                                </span>
                              </div>
                              <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {filteredEduSchools.length > 0 ? (
                                  filteredEduSchools.map((cName) => (
                                    <button
                                      key={cName}
                                      type="button"
                                      onClick={() => {
                                        setEditingEducation({ ...editingEducation, school: cName });
                                        setIsEduSchoolOpen(false);
                                      }}
                                      className={`w-full text-left px-3.5 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 transition-colors flex items-center justify-between cursor-pointer ${
                                        editingEducation.school === cName
                                          ? "bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 font-semibold"
                                          : "text-slate-800 dark:text-zinc-200"
                                      }`}
                                    >
                                      <span className="truncate pr-2">{cName}</span>
                                      {editingEducation.school === cName && (
                                        <Check className="size-3.5 text-blue-600 shrink-0" />
                                      )}
                                    </button>
                                  ))
                                ) : (
                                  <div className="p-3.5 text-center text-xs text-slate-400 space-y-2">
                                    <p>No exact match in our 51,000+ colleges list.</p>
                                    {eduSchoolSearch.trim() && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingEducation({
                                            ...editingEducation,
                                            school: eduSchoolSearch.trim(),
                                          });
                                          setIsEduSchoolOpen(false);
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 transition-colors cursor-pointer text-xs"
                                      >
                                        + Use "{eduSchoolSearch.trim()}" as my school
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="sticky bottom-0 z-10 px-3 py-1.5 bg-slate-50 dark:bg-zinc-800/90 border-t border-slate-200 dark:border-zinc-700 text-[10px] text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                                <span>Click to select college</span>
                                <button
                                  type="button"
                                  onClick={() => setIsEduSchoolOpen(false)}
                                  className="hover:text-slate-800 dark:text-zinc-200 font-semibold underline cursor-pointer"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Degree */}
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                          Degree <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={editingEducation.degree}
                          onChange={(e) =>
                            setEditingEducation({ ...editingEducation, degree: e.target.value })
                          }
                          placeholder="e.g. Bachelor of Technology"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
                        />
                      </div>

                      {/* Field of Study */}
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          value={editingEducation.fieldOfStudy || ""}
                          onChange={(e) =>
                            setEditingEducation({ ...editingEducation, fieldOfStudy: e.target.value })
                          }
                          placeholder="e.g. Computer Science and Engineering"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
                        />
                      </div>

                      {/* Grade / CGPA */}
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                          Grade / CGPA
                        </label>
                        <input
                          type="text"
                          value={editingEducation.grade || ""}
                          onChange={(e) =>
                            setEditingEducation({ ...editingEducation, grade: e.target.value })
                          }
                          placeholder="e.g. 8.26 CGPA or 85%"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
                        />
                      </div>

                      {/* Start Date */}
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                          Start Date <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={parseMonthYear(editingEducation.startDate).month}
                            onChange={(e) => {
                              const curr = parseMonthYear(editingEducation.startDate);
                              setEditingEducation({
                                ...editingEducation,
                                startDate: formatMonthYear(e.target.value, curr.year),
                              });
                            }}
                            className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs sm:text-sm focus:outline-hidden focus:border-blue-500 cursor-pointer"
                          >
                            {MONTH_OPTIONS.map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <select
                            value={parseMonthYear(editingEducation.startDate).year}
                            onChange={(e) => {
                              const curr = parseMonthYear(editingEducation.startDate);
                              setEditingEducation({
                                ...editingEducation,
                                startDate: formatMonthYear(curr.month, e.target.value),
                              });
                            }}
                            className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs sm:text-sm focus:outline-hidden focus:border-blue-500 cursor-pointer"
                          >
                            {YEAR_OPTIONS.map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* End Date */}
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                          End Date
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            disabled={editingEducation.isCurrent || editingEducation.endDate === "Present"}
                            value={
                              editingEducation.isCurrent || editingEducation.endDate === "Present"
                                ? "Month"
                                : parseMonthYear(editingEducation.endDate).month
                            }
                            onChange={(e) => {
                              const curr = parseMonthYear(editingEducation.endDate);
                              setEditingEducation({
                                ...editingEducation,
                                endDate: formatMonthYear(e.target.value, curr.year),
                              });
                            }}
                            className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs sm:text-sm focus:outline-hidden focus:border-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {MONTH_OPTIONS.map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <select
                            disabled={editingEducation.isCurrent || editingEducation.endDate === "Present"}
                            value={
                              editingEducation.isCurrent || editingEducation.endDate === "Present"
                                ? "Year"
                                : parseMonthYear(editingEducation.endDate).year
                            }
                            onChange={(e) => {
                              const curr = parseMonthYear(editingEducation.endDate);
                              setEditingEducation({
                                ...editingEducation,
                                endDate: formatMonthYear(curr.month, e.target.value),
                              });
                            }}
                            className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs sm:text-sm focus:outline-hidden focus:border-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {YEAR_OPTIONS.map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Checkbox: I currently study here */}
                      <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="edu-inline-current"
                          checked={editingEducation.isCurrent || editingEducation.endDate === "Present"}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setEditingEducation({
                              ...editingEducation,
                              isCurrent: isChecked,
                              endDate: isChecked ? "Present" : "",
                            });
                          }}
                          className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <label
                          htmlFor="edu-inline-current"
                          className="text-xs text-slate-700 dark:text-zinc-300 font-medium cursor-pointer"
                        >
                          I currently study here
                        </label>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEducation(null);
                          setIsEduSchoolOpen(false);
                        }}
                        className="px-4 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!editingEducation.school.trim()) {
                            toast.error("School or college name is required");
                            return;
                          }
                          if (!editingEducation.degree.trim()) {
                            toast.error("Degree is required");
                            return;
                          }
                          setEducations((prev) => {
                            const idx = prev.findIndex((e) => e.id === editingEducation.id);
                            if (idx >= 0) {
                              const next = [...prev];
                              next[idx] = editingEducation;
                              return next;
                            }
                            return [...prev, editingEducation];
                          });
                          setEditingEducation(null);
                          setIsEduSchoolOpen(false);
                          toast.success("Education saved");
                        }}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        Save education
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Education Items List */}
                    <div className="space-y-3">
                      {educations.map((edu, idx) => (
                        <div
                          key={edu.id || idx}
                          className="flex items-center justify-between p-4 rounded-xl border border-slate-300 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/40 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <GripVertical className="size-4 text-slate-400 mt-1 cursor-grab" />
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                                {edu.school}
                              </h3>
                              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                                {edu.degree} {edu.fieldOfStudy ? `• ${edu.fieldOfStudy}` : ""}
                              </p>
                              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
                                {edu.startDate} - {edu.endDate} {edu.grade ? `| ${edu.grade}` : ""}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingEducation(edu);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEducations((prev) =>
                                  prev.map((item) =>
                                    item.id === edu.id ? { ...item, isVisible: !item.isVisible } : item
                                  )
                                );
                              }}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                edu.isVisible !== false
                                  ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                  : "text-slate-400 hover:bg-slate-200/60"
                              }`}
                              title="Toggle Visibility"
                            >
                              {edu.isVisible !== false ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEducations((prev) => prev.filter((item) => item.id !== edu.id));
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* + Add Education Dashed Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEducation({
                            id: `edu_${Date.now()}`,
                            school: "",
                            degree: "",
                            fieldOfStudy: "",
                            startDate: "",
                            endDate: "Present",
                            isCurrent: true,
                            grade: "",
                            isVisible: true,
                          });
                        }}
                        className="w-full py-4 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/60 hover:border-blue-400 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Plus className="size-4" />
                        <span>Add Education</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 3: EXPERIENCE                                              */}
            {/* ============================================================== */}
            {activeTab === "experience" && (
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                    Experience
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Show on profile</span>
                    <button
                      type="button"
                      onClick={() =>
                        setVisibility((prev) => ({
                          ...prev,
                          showExperience: !prev.showExperience,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        visibility.showExperience ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                          visibility.showExperience ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {editingExperience ? (
                  /* INLINE FORM: EXACTLY MATCHING TAKEUFORWARD media_1791296675642.png */
                  <div className="rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 p-4 sm:p-5 space-y-4 shadow-2xs">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                        {experiences.some((e) => e.id === editingExperience.id) ? "Edit experience" : "Add experience"}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">Show on profile</span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingExperience({
                              ...editingExperience,
                              isVisible: editingExperience.isVisible === false ? true : false,
                            })
                          }
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                            editingExperience.isVisible !== false ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
                          }`}
                        >
                          <span
                            className={`inline-block size-3.5 transform rounded-full bg-white transition-transform ${
                              editingExperience.isVisible !== false ? "translate-x-4.5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Form Fields matching TUF */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Job Title */}
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                          Job title <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={editingExperience.role}
                          onChange={(e) =>
                            setEditingExperience({ ...editingExperience, role: e.target.value })
                          }
                          placeholder="Enter a job title"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
                        />
                      </div>

                      {/* Company */}
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                          Company <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={editingExperience.company}
                          onChange={(e) =>
                            setEditingExperience({ ...editingExperience, company: e.target.value })
                          }
                          placeholder="Enter a company"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
                        />
                      </div>

                      {/* Location */}
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={editingExperience.location || ""}
                          onChange={(e) =>
                            setEditingExperience({ ...editingExperience, location: e.target.value })
                          }
                          placeholder="Enter a location"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
                        />
                      </div>

                      {/* Start Date */}
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                          Start Date <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={parseMonthYear(editingExperience.startDate).month}
                            onChange={(e) => {
                              const curr = parseMonthYear(editingExperience.startDate);
                              setEditingExperience({
                                ...editingExperience,
                                startDate: formatMonthYear(e.target.value, curr.year),
                              });
                            }}
                            className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs sm:text-sm focus:outline-hidden focus:border-blue-500 cursor-pointer"
                          >
                            {MONTH_OPTIONS.map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <select
                            value={parseMonthYear(editingExperience.startDate).year}
                            onChange={(e) => {
                              const curr = parseMonthYear(editingExperience.startDate);
                              setEditingExperience({
                                ...editingExperience,
                                startDate: formatMonthYear(curr.month, e.target.value),
                              });
                            }}
                            className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs sm:text-sm focus:outline-hidden focus:border-blue-500 cursor-pointer"
                          >
                            {YEAR_OPTIONS.map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* End Date */}
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                          End Date
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            disabled={editingExperience.isCurrent || editingExperience.endDate === "Present"}
                            value={
                              editingExperience.isCurrent || editingExperience.endDate === "Present"
                                ? "Month"
                                : parseMonthYear(editingExperience.endDate).month
                            }
                            onChange={(e) => {
                              const curr = parseMonthYear(editingExperience.endDate);
                              setEditingExperience({
                                ...editingExperience,
                                endDate: formatMonthYear(e.target.value, curr.year),
                              });
                            }}
                            className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs sm:text-sm focus:outline-hidden focus:border-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {MONTH_OPTIONS.map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <select
                            disabled={editingExperience.isCurrent || editingExperience.endDate === "Present"}
                            value={
                              editingExperience.isCurrent || editingExperience.endDate === "Present"
                                ? "Year"
                                : parseMonthYear(editingExperience.endDate).year
                            }
                            onChange={(e) => {
                              const curr = parseMonthYear(editingExperience.endDate);
                              setEditingExperience({
                                ...editingExperience,
                                endDate: formatMonthYear(curr.month, e.target.value),
                              });
                            }}
                            className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs sm:text-sm focus:outline-hidden focus:border-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {YEAR_OPTIONS.map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Checkbox: I currently work here */}
                      <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="exp-inline-current"
                          checked={editingExperience.isCurrent || editingExperience.endDate === "Present"}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setEditingExperience({
                              ...editingExperience,
                              isCurrent: isChecked,
                              endDate: isChecked ? "Present" : "",
                            });
                          }}
                          className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <label
                          htmlFor="exp-inline-current"
                          className="text-xs text-slate-700 dark:text-zinc-300 font-medium cursor-pointer"
                        >
                          I currently work here
                        </label>
                      </div>

                      {/* Textarea Description with max 150 words limit */}
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                          What did you build or impact? (max 150 words)
                        </label>
                        <textarea
                          rows={3}
                          value={editingExperience.description || ""}
                          onChange={(e) => {
                            const text = e.target.value;
                            const count = getWordCount(text);
                            if (count <= 150 || text.length < (editingExperience.description || "").length) {
                              setEditingExperience({ ...editingExperience, description: text });
                            }
                          }}
                          placeholder="Enter what did you build or impact? (max 150 words)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
                        />
                        <div className="text-right text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
                          {getWordCount(editingExperience.description)} / 150 words
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setEditingExperience(null)}
                        className="px-4 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!editingExperience.company.trim()) {
                            toast.error("Company name is required");
                            return;
                          }
                          if (!editingExperience.role.trim()) {
                            toast.error("Job title is required");
                            return;
                          }
                          setExperiences((prev) => {
                            const idx = prev.findIndex((e) => e.id === editingExperience.id);
                            if (idx >= 0) {
                              const next = [...prev];
                              next[idx] = editingExperience;
                              return next;
                            }
                            return [...prev, editingExperience];
                          });
                          setEditingExperience(null);
                          toast.success("Experience saved");
                        }}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        Save experience
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Items List */}
                    {experiences.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 dark:border-zinc-800 p-8 sm:p-12 text-center bg-slate-50/30 dark:bg-zinc-900/20">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-1">
                          No experience added yet
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-sm mx-auto">
                          Internships, research and campus roles all belong here. Strong projects can fill this gap too.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {experiences.map((exp) => (
                          <div
                            key={exp.id}
                            className="flex items-center justify-between p-4 rounded-xl border border-slate-300 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/40 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <GripVertical className="size-4 text-slate-400 mt-1 cursor-grab" />
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                                  {exp.company}
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                                  {exp.role} {exp.employmentType ? `• ${exp.employmentType}` : ""}
                                </p>
                                <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
                                  {exp.startDate} - {exp.endDate} {exp.location ? `| ${exp.location}` : ""}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingExperience(exp)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Pencil className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setExperiences((prev) =>
                                    prev.map((item) =>
                                      item.id === exp.id ? { ...item, isVisible: !item.isVisible } : item
                                    )
                                  );
                                }}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  exp.isVisible !== false ? "text-emerald-600" : "text-slate-400"
                                }`}
                                title="Toggle Visibility"
                              >
                                {exp.isVisible !== false ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setExperiences((prev) => prev.filter((item) => item.id !== exp.id));
                                }}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* + Add your experience button */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingExperience({
                          id: `exp_${Date.now()}`,
                          company: "",
                          role: "",
                          employmentType: "Full-time",
                          location: "",
                          startDate: "",
                          endDate: "Present",
                          isCurrent: true,
                          description: "",
                          isVisible: true,
                        });
                      }}
                      className="w-full py-4 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/60 hover:border-blue-400 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Plus className="size-4" />
                      <span>Add your experience</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 4: SKILLS                                                  */}
            {/* ============================================================== */}
            {activeTab === "skills" && (
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                    Skills
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Show on profile</span>
                    <button
                      type="button"
                      onClick={() =>
                        setVisibility((prev) => ({
                          ...prev,
                          showSkills: !prev.showSkills,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        visibility.showSkills ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                          visibility.showSkills ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 1. Languages */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Languages
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {skills.languages.length} added
                    </span>
                  </div>

                  <div className="relative" ref={langWrapperRef}>
                    <div className="min-h-12 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                      {skills.languages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800/60 shadow-2xs"
                        >
                          <span>{lang}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveLanguage(lang)}
                            className="hover:text-rose-500 cursor-pointer transition-colors"
                          >
                            <X className="size-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={newLanguageInput}
                        onFocus={() => setIsLangDropdownOpen(true)}
                        onChange={(e) => {
                          setNewLanguageInput(e.target.value);
                          setIsLangDropdownOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newLanguageInput.trim()) {
                              handleAddLanguage(newLanguageInput);
                              setIsLangDropdownOpen(false);
                            }
                          } else if (e.key === "Escape") {
                            setIsLangDropdownOpen(false);
                          }
                        }}
                        placeholder={
                          skills.languages.length === 0
                            ? "Search or type language (e.g. C++, Java, Python)..."
                            : "+ add language..."
                        }
                        className="text-xs bg-transparent border-none outline-hidden px-2 py-1 text-slate-700 dark:text-zinc-200 min-w-[200px] flex-1"
                      />
                    </div>

                    {/* Languages Dropdown List */}
                    {isLangDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40 bg-transparent cursor-default"
                          onClick={() => setIsLangDropdownOpen(false)}
                        />
                        <div className="absolute z-50 left-0 right-0 top-full mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-black/10 py-0 text-xs">
                          <div className="sticky top-0 z-10 px-3.5 py-2 text-[11px] font-bold text-slate-700 dark:text-zinc-200 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between bg-slate-100 dark:bg-zinc-800 uppercase tracking-wider">
                            <span>Programming Languages</span>
                            <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-700">
                              {filteredLanguages.length} choices
                            </span>
                          </div>

                          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                            {filteredLanguages.length > 0 ? (
                              filteredLanguages.map((lang) => (
                                <button
                                  key={lang}
                                  type="button"
                                  onClick={() => {
                                    handleAddLanguage(lang);
                                    setIsLangDropdownOpen(false);
                                  }}
                                  className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 transition-colors flex items-center justify-between text-slate-800 dark:text-zinc-200 cursor-pointer"
                                >
                                  <span>{lang}</span>
                                  <Plus className="size-3.5 text-slate-400 group-hover:text-blue-600" />
                                </button>
                              ))
                            ) : (
                              <div className="p-3 text-center text-slate-400">
                                {newLanguageInput.trim() ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleAddLanguage(newLanguageInput);
                                      setIsLangDropdownOpen(false);
                                    }}
                                    className="text-blue-600 font-semibold hover:underline cursor-pointer"
                                  >
                                    + Add "{newLanguageInput.trim()}" as custom language
                                  </button>
                                ) : (
                                  <span>All standard languages added</span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="sticky bottom-0 z-10 px-3 py-1.5 bg-slate-50 dark:bg-zinc-800/90 border-t border-slate-200 dark:border-zinc-700 text-[10px] text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                            <span>Click to add to your skills</span>
                            <button
                              type="button"
                              onClick={() => setIsLangDropdownOpen(false)}
                              className="hover:text-slate-800 dark:text-zinc-200 font-semibold underline cursor-pointer"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick Add Popular Languages Chips */}
                  <div className="flex items-center flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium mr-1">
                      Popular:
                    </span>
                    {POPULAR_LANGUAGES.map((lang) => {
                      const isAdded = skills.languages.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddLanguage(lang)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                            isAdded
                              ? "bg-slate-100 dark:bg-zinc-800/50 text-slate-400 dark:text-zinc-600 cursor-default"
                              : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-zinc-700 hover:border-blue-300 border border-transparent"
                          }`}
                        >
                          {isAdded ? `✓ ${lang}` : `+ ${lang}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Backend & Infra (Tech Stack) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Backend, Frontend & Tech Stack
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {skills.backendInfra.length} added
                    </span>
                  </div>

                  <div className="relative" ref={backendWrapperRef}>
                    <div className="min-h-12 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                      {skills.backendInfra.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800/60 shadow-2xs"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBackend(item)}
                            className="hover:text-rose-500 cursor-pointer transition-colors"
                          >
                            <X className="size-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={newBackendInput}
                        onFocus={() => setIsBackendDropdownOpen(true)}
                        onChange={(e) => {
                          setNewBackendInput(e.target.value);
                          setIsBackendDropdownOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newBackendInput.trim()) {
                              handleAddBackend(newBackendInput);
                              setIsBackendDropdownOpen(false);
                            }
                          } else if (e.key === "Escape") {
                            setIsBackendDropdownOpen(false);
                          }
                        }}
                        placeholder={
                          skills.backendInfra.length === 0
                            ? "Search or type tech (e.g. Next.js, Docker, AWS, Redis)..."
                            : "+ add tech..."
                        }
                        className="text-xs bg-transparent border-none outline-hidden px-2 py-1 text-slate-700 dark:text-zinc-200 min-w-[200px] flex-1"
                      />
                    </div>

                    {/* Tech Stack Dropdown List */}
                    {isBackendDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40 bg-transparent cursor-default"
                          onClick={() => setIsBackendDropdownOpen(false)}
                        />
                        <div className="absolute z-50 left-0 right-0 top-full mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-black/10 py-0 text-xs">
                          <div className="sticky top-0 z-10 px-3.5 py-2 text-[11px] font-bold text-slate-700 dark:text-zinc-200 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between bg-slate-100 dark:bg-zinc-800 uppercase tracking-wider">
                            <span>Frameworks & Technologies</span>
                            <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-700">
                              {filteredBackend.length} choices
                            </span>
                          </div>

                          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                            {filteredBackend.length > 0 ? (
                              filteredBackend.map((item) => (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => {
                                    handleAddBackend(item);
                                    setIsBackendDropdownOpen(false);
                                  }}
                                  className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors flex items-center justify-between text-slate-800 dark:text-zinc-200 cursor-pointer"
                                >
                                  <span>{item}</span>
                                  <Plus className="size-3.5 text-slate-400" />
                                </button>
                              ))
                            ) : (
                              <div className="p-3 text-center text-slate-400">
                                {newBackendInput.trim() ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleAddBackend(newBackendInput);
                                      setIsBackendDropdownOpen(false);
                                    }}
                                    className="text-emerald-600 font-semibold hover:underline cursor-pointer"
                                  >
                                    + Add "{newBackendInput.trim()}" as custom tech
                                  </button>
                                ) : (
                                  <span>All standard technologies added</span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="sticky bottom-0 z-10 px-3 py-1.5 bg-slate-50 dark:bg-zinc-800/90 border-t border-slate-200 dark:border-zinc-700 text-[10px] text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                            <span>Click to add to your tech stack</span>
                            <button
                              type="button"
                              onClick={() => setIsBackendDropdownOpen(false)}
                              className="hover:text-slate-800 dark:text-zinc-200 font-semibold underline cursor-pointer"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick Add Popular Tech Stack Chips */}
                  <div className="flex items-center flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium mr-1">
                      Popular:
                    </span>
                    {POPULAR_TECH_STACK.map((tech) => {
                      const isAdded = skills.backendInfra.includes(tech);
                      return (
                        <button
                          key={tech}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddBackend(tech)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                            isAdded
                              ? "bg-slate-100 dark:bg-zinc-800/50 text-slate-400 dark:text-zinc-600 cursor-default"
                              : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-zinc-700 hover:border-emerald-300 border border-transparent"
                          }`}
                        >
                          {isAdded ? `✓ ${tech}` : `+ ${tech}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Concepts */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Computer Science & System Concepts
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {skills.concepts.length} added
                    </span>
                  </div>

                  <div className="relative" ref={conceptWrapperRef}>
                    <div className="min-h-12 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                      {skills.concepts.map((concept) => (
                        <span
                          key={concept}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-200 dark:border-purple-800/60 shadow-2xs"
                        >
                          <span>{concept}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveConcept(concept)}
                            className="hover:text-rose-500 cursor-pointer transition-colors"
                          >
                            <X className="size-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={newConceptInput}
                        onFocus={() => setIsConceptDropdownOpen(true)}
                        onChange={(e) => {
                          setNewConceptInput(e.target.value);
                          setIsConceptDropdownOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newConceptInput.trim()) {
                              handleAddConcept(newConceptInput);
                              setIsConceptDropdownOpen(false);
                            }
                          } else if (e.key === "Escape") {
                            setIsConceptDropdownOpen(false);
                          }
                        }}
                        placeholder={
                          skills.concepts.length === 0
                            ? "Search or type concept (e.g. DSA, System Design, OOP)..."
                            : "+ add concept..."
                        }
                        className="text-xs bg-transparent border-none outline-hidden px-2 py-1 text-slate-700 dark:text-zinc-200 min-w-[200px] flex-1"
                      />
                    </div>

                    {/* Concepts Dropdown List */}
                    {isConceptDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40 bg-transparent cursor-default"
                          onClick={() => setIsConceptDropdownOpen(false)}
                        />
                        <div className="absolute z-50 left-0 right-0 top-full mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-black/10 py-0 text-xs">
                          <div className="sticky top-0 z-10 px-3.5 py-2 text-[11px] font-bold text-slate-700 dark:text-zinc-200 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between bg-slate-100 dark:bg-zinc-800 uppercase tracking-wider">
                            <span>Computer Science Concepts</span>
                            <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-700">
                              {filteredConcepts.length} choices
                            </span>
                          </div>

                          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                            {filteredConcepts.length > 0 ? (
                              filteredConcepts.map((concept) => (
                                <button
                                  key={concept}
                                  type="button"
                                  onClick={() => {
                                    handleAddConcept(concept);
                                    setIsConceptDropdownOpen(false);
                                  }}
                                  className="w-full text-left px-3.5 py-2.5 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors flex items-center justify-between text-slate-800 dark:text-zinc-200 cursor-pointer"
                                >
                                  <span>{concept}</span>
                                  <Plus className="size-3.5 text-slate-400" />
                                </button>
                              ))
                            ) : (
                              <div className="p-3 text-center text-slate-400">
                                {newConceptInput.trim() ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleAddConcept(newConceptInput);
                                      setIsConceptDropdownOpen(false);
                                    }}
                                    className="text-purple-600 font-semibold hover:underline cursor-pointer"
                                  >
                                    + Add "{newConceptInput.trim()}" as custom concept
                                  </button>
                                ) : (
                                  <span>All standard concepts added</span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="sticky bottom-0 z-10 px-3 py-1.5 bg-slate-50 dark:bg-zinc-800/90 border-t border-slate-200 dark:border-zinc-700 text-[10px] text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                            <span>Click to add to your skills</span>
                            <button
                              type="button"
                              onClick={() => setIsConceptDropdownOpen(false)}
                              className="hover:text-slate-800 dark:text-zinc-200 font-semibold underline cursor-pointer"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick Add Popular Concepts Chips */}
                  <div className="flex items-center flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium mr-1">
                      Popular:
                    </span>
                    {POPULAR_CONCEPTS.map((concept) => {
                      const isAdded = skills.concepts.includes(concept);
                      return (
                        <button
                          key={concept}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddConcept(concept)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                            isAdded
                              ? "bg-slate-100 dark:bg-zinc-800/50 text-slate-400 dark:text-zinc-600 cursor-default"
                              : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-zinc-700 hover:border-purple-300 border border-transparent"
                          }`}
                        >
                          {isAdded ? `✓ ${concept}` : `+ ${concept}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 5: PROJECTS                                                */}
            {/* ============================================================== */}
            {activeTab === "projects" && (
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                    Projects
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Show on profile</span>
                    <button
                      type="button"
                      onClick={() =>
                        setVisibility((prev) => ({
                          ...prev,
                          showProjects: !prev.showProjects,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        visibility.showProjects ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                          visibility.showProjects ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {projects.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-8 sm:p-12 text-center bg-slate-50/30 dark:bg-zinc-900/20">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-1">
                      No projects added yet
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-zinc-500">
                      Showcase your best work here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/40 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4"
                      >
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                            {proj.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 line-clamp-2">
                            {proj.description}
                          </p>
                          {proj.techStack && proj.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {proj.techStack.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-zinc-800 text-[10px] font-medium text-slate-700 dark:text-zinc-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProject(proj);
                              setIsProjectModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setProjects((prev) =>
                                prev.map((item) =>
                                  item.id === proj.id ? { ...item, isVisible: !item.isVisible } : item
                                )
                              );
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              proj.isVisible !== false ? "text-emerald-600" : "text-slate-400"
                            }`}
                            title="Toggle Visibility"
                          >
                            {proj.isVisible !== false ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setProjects((prev) => prev.filter((item) => item.id !== proj.id));
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* + Add your project button */}
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject({
                      id: `proj_${Date.now()}`,
                      title: "",
                      description: "",
                      techStack: [],
                      liveUrl: "",
                      githubUrl: "",
                      isVisible: true,
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="w-full py-4 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/60 hover:border-blue-400 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="size-4" />
                  <span>Add your project</span>
                </button>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 6: CONNECTIONS (CODING PROFILES, SOCIALS, OTHER LINKS)    */}
            {/* ============================================================== */}
            {activeTab === "connections" && (
              <div className="space-y-6">
                
                {/* 1. Coding profiles */}
                <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                      Coding profiles
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Show on profile</span>
                      <button
                        type="button"
                        onClick={() =>
                          setVisibility((prev) => ({
                            ...prev,
                            showCodingProfiles: !prev.showCodingProfiles,
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          visibility.showCodingProfiles ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
                        }`}
                      >
                        <span
                          className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                            visibility.showCodingProfiles ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {CODING_PLATFORM_CONFIG.map((plat) => {
                      const IconComp = plat.icon;
                      const entry = codingProfiles[plat.id] || { value: "", isVisible: true };
                      return (
                        <div
                          key={plat.id}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60"
                        >
                          <GripVertical className="size-4 text-slate-400 cursor-grab shrink-0" />
                          <div className="size-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            <IconComp className={`size-4 ${plat.color}`} />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 w-20 sm:w-32 md:w-36 shrink-0 truncate">
                            {plat.name}
                          </span>
                          <div className="relative flex-1 min-w-0">
                            <input
                              type="text"
                              value={entry.value}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCodingProfiles((prev) => ({
                                  ...prev,
                                  [plat.id]: { ...entry, value: val },
                                }));
                              }}
                              placeholder={plat.placeholder}
                              className="w-full px-3 py-2 pr-8 rounded-xl border border-slate-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 dark:bg-zinc-950/40 text-xs sm:text-sm text-slate-800 dark:text-zinc-200 outline-hidden transition-all"
                            />
                            {entry.value && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCodingProfiles((prev) => ({
                                    ...prev,
                                    [plat.id]: { ...entry, value: "" },
                                  }));
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                                title="Clear profile"
                              >
                                <X className="size-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setCodingProfiles((prev) => ({
                                  ...prev,
                                  [plat.id]: { ...entry, isVisible: !entry.isVisible },
                                }));
                              }}
                              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                entry.isVisible !== false
                                  ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                  : "text-slate-400 hover:bg-slate-200/60"
                              }`}
                              title="Toggle Visibility"
                            >
                              {entry.isVisible !== false ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Social Links */}
                <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                      Social Links
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Show on profile</span>
                      <button
                        type="button"
                        onClick={() =>
                          setVisibility((prev) => ({
                            ...prev,
                            showSocialLinks: !prev.showSocialLinks,
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          visibility.showSocialLinks ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
                        }`}
                      >
                        <span
                          className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                            visibility.showSocialLinks ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {SOCIAL_PLATFORM_CONFIG.map((social) => {
                      const IconComp = social.icon;
                      const entry = socialProfiles[social.id] || { value: "", isVisible: true };
                      return (
                        <div
                          key={social.id}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60"
                        >
                          <GripVertical className="size-4 text-slate-400 cursor-grab shrink-0" />
                          <div className="size-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            <IconComp className={`size-4 ${social.color}`} />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 w-20 sm:w-32 md:w-36 shrink-0 truncate">
                            {social.name}
                          </span>
                          <div className="relative flex-1 min-w-0">
                            <input
                              type="text"
                              value={entry.value}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSocialProfiles((prev) => ({
                                  ...prev,
                                  [social.id]: { ...entry, value: val },
                                }));
                              }}
                              placeholder={social.placeholder}
                              className="w-full px-3 py-2 pr-8 rounded-xl border border-slate-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 dark:bg-zinc-950/40 text-xs sm:text-sm text-slate-800 dark:text-zinc-200 outline-hidden transition-all"
                            />
                            {entry.value && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSocialProfiles((prev) => ({
                                    ...prev,
                                    [social.id]: { ...entry, value: "" },
                                  }));
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                                title="Clear profile"
                              >
                                <X className="size-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setSocialProfiles((prev) => ({
                                  ...prev,
                                  [social.id]: { ...entry, isVisible: !entry.isVisible },
                                }));
                              }}
                              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                entry.isVisible !== false
                                  ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                  : "text-slate-400 hover:bg-slate-200/60"
                              }`}
                              title="Toggle Visibility"
                            >
                              {entry.isVisible !== false ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Other Links */}
                <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                      Other Links
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Show on profile</span>
                      <button
                        type="button"
                        onClick={() =>
                          setVisibility((prev) => ({
                            ...prev,
                            showOtherLinks: !prev.showOtherLinks,
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          visibility.showOtherLinks ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
                        }`}
                      >
                        <span
                          className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                            visibility.showOtherLinks ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {otherLinks.length > 0 && (
                    <div className="space-y-2">
                      {otherLinks.map((ol) => (
                        <div
                          key={ol.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                              {ol.title}:
                            </span>
                            <a
                              href={ol.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-600 hover:underline truncate max-w-xs"
                            >
                              {ol.url}
                            </a>
                          </div>
                          <button
                            type="button"
                            onClick={() => setOtherLinks((prev) => prev.filter((item) => item.id !== ol.id))}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setNewOtherLinkTitle("");
                      setNewOtherLinkUrl("");
                      setIsOtherLinkModalOpen(true);
                    }}
                    className="w-full py-4 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/60 hover:border-blue-400 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="size-4" />
                    <span>Add other links</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 7: PROGRESS & ACHIEVEMENTS                                 */}
            {/* ============================================================== */}
            {activeTab === "achievements" && (
              <div className="space-y-6">
                
                {/* Achievements Card */}
                <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                      Achievements
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Show on profile</span>
                      <button
                        type="button"
                        onClick={() =>
                          setVisibility((prev) => ({
                            ...prev,
                            showAchievements: !prev.showAchievements,
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          visibility.showAchievements ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
                        }`}
                      >
                        <span
                          className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                            visibility.showAchievements ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {/* Titles */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                      <div className="flex items-center gap-3">
                        <GripVertical className="size-4 text-slate-400 cursor-grab" />
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 block">
                            Titles
                          </span>
                          <span className="text-[11px] text-slate-400">Current: —</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setVisibility((prev) => ({
                            ...prev,
                            showTitles: !prev.showTitles,
                          }))
                        }
                        className={`p-1.5 rounded-lg cursor-pointer ${
                          visibility.showTitles ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        {visibility.showTitles ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                      </button>
                    </div>

                    {/* Trophies */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                      <div className="flex items-center gap-3">
                        <GripVertical className="size-4 text-slate-400 cursor-grab" />
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 block">
                            Trophies
                          </span>
                          <span className="text-[11px] text-slate-400">0 earned</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setVisibility((prev) => ({
                            ...prev,
                            showTrophies: !prev.showTrophies,
                          }))
                        }
                        className={`p-1.5 rounded-lg cursor-pointer ${
                          visibility.showTrophies ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        {visibility.showTrophies ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* At a glance Card */}
                <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
                      At a glance
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Show on profile</span>
                      <button
                        type="button"
                        onClick={() =>
                          setVisibility((prev) => ({
                            ...prev,
                            showAtAGlance: !prev.showAtAGlance,
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          visibility.showAtAGlance ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
                        }`}
                      >
                        <span
                          className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                            visibility.showAtAGlance ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {/* Problems Solved */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                      <div className="flex items-center gap-3">
                        <GripVertical className="size-4 text-slate-400 cursor-grab" />
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 block">
                            Problems solved
                          </span>
                          <span className="text-[11px] text-slate-400">Total solved on CodePrep & synced platforms</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setVisibility((prev) => ({
                            ...prev,
                            showProblemsSolved: !prev.showProblemsSolved,
                          }))
                        }
                        className={`p-1.5 rounded-lg cursor-pointer ${
                          visibility.showProblemsSolved ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        {visibility.showProblemsSolved ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                      </button>
                    </div>

                    {/* Best streak */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                      <div className="flex items-center gap-3">
                        <GripVertical className="size-4 text-slate-400 cursor-grab" />
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 block">
                            Best streak
                          </span>
                          <span className="text-[11px] text-slate-400">Maximum daily active streak</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setVisibility((prev) => ({
                            ...prev,
                            showBestStreak: !prev.showBestStreak,
                          }))
                        }
                        className={`p-1.5 rounded-lg cursor-pointer ${
                          visibility.showBestStreak ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        {visibility.showBestStreak ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                      </button>
                    </div>

                    {/* Languages */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                      <div className="flex items-center gap-3">
                        <GripVertical className="size-4 text-slate-400 cursor-grab" />
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 block">
                            Languages
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {skills.languages && skills.languages.length > 0 ? (
                              skills.languages.map((l) => (
                                <span
                                  key={l}
                                  className="rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50/80 dark:bg-zinc-800/60 px-2 py-0.5 text-[11px] font-medium text-slate-800 dark:text-zinc-200 shadow-2xs"
                                >
                                  {l}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-slate-400">None added</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setVisibility((prev) => ({
                            ...prev,
                            showLanguagesGlance: !prev.showLanguagesGlance,
                          }))
                        }
                        className={`p-1.5 rounded-lg cursor-pointer ${
                          visibility.showLanguagesGlance ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        {visibility.showLanguagesGlance ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Save Action Bar for Mobile & Desktop */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-300 dark:border-zinc-700 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLayoutModalOpen(true)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-blue-500/80 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs sm:text-sm font-semibold transition-colors cursor-pointer bg-white dark:bg-zinc-900"
                >
                  <LayoutGrid className="size-4" />
                  <span>Edit Layout</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                <span>Save all changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODAL 3: ADD / EDIT PROJECT                                           */}
      {/* ==================================================================== */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-card w-full max-w-lg max-h-[90dvh] flex flex-col rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
            {/* Modal Header (Sticky) */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-white dark:bg-card">
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                {projects.some((p) => p.id === editingProject.id) ? "Edit Project" : "Add Project"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsProjectModalOpen(false);
                  setIsProjectTechOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
              <div>
                <label className="font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                  placeholder="e.g. CloudScale Distributed Key-Value Store"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  placeholder="What problem does it solve and what was your role?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
                />
              </div>

              {/* Project Tech Stack Combobox & Chips */}
              <div className="space-y-1.5 relative" ref={projectTechWrapperRef}>
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-zinc-300 block">
                    Tech Stack & Languages
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {(editingProject.techStack || []).length} selected
                  </span>
                </div>

                <div className="min-h-11 p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                  {(editingProject.techStack || []).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800/60"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProject({
                            ...editingProject,
                            techStack: (editingProject.techStack || []).filter((item) => item !== t),
                          })
                        }
                        className="hover:text-rose-500 cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={newProjectTechInput}
                    onFocus={() => setIsProjectTechOpen(true)}
                    onChange={(e) => {
                      setNewProjectTechInput(e.target.value);
                      setIsProjectTechOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = newProjectTechInput.trim();
                        if (val && !(editingProject.techStack || []).includes(val)) {
                          setEditingProject({
                            ...editingProject,
                            techStack: [...(editingProject.techStack || []), val],
                          });
                        }
                        setNewProjectTechInput("");
                        setIsProjectTechOpen(false);
                      } else if (e.key === "Escape") {
                        setIsProjectTechOpen(false);
                      }
                    }}
                    placeholder="+ add tech or language..."
                    className="text-xs bg-transparent border-none outline-hidden px-1.5 py-1 text-slate-700 dark:text-zinc-200 min-w-[140px] flex-1"
                  />
                </div>

                {isProjectTechOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-transparent cursor-default"
                      onClick={() => setIsProjectTechOpen(false)}
                    />
                    <div className="absolute z-50 left-0 right-0 top-full mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-black/10 py-0 text-xs">
                      <div className="sticky top-0 z-10 px-3.5 py-2 text-[11px] font-bold text-slate-700 dark:text-zinc-200 border-b border-slate-200 dark:border-zinc-700 flex justify-between bg-slate-100 dark:bg-zinc-800 uppercase tracking-wider">
                        <span>Available Tech & Languages</span>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-700">
                          {filteredProjectTech.length} options
                        </span>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {filteredProjectTech.length > 0 ? (
                          filteredProjectTech.map((tech) => (
                            <button
                              key={tech}
                              type="button"
                              onClick={() => {
                                setEditingProject({
                                  ...editingProject,
                                  techStack: [...(editingProject.techStack || []), tech],
                                });
                                setNewProjectTechInput("");
                                setIsProjectTechOpen(false);
                              }}
                              className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 transition-colors flex items-center justify-between text-slate-800 dark:text-zinc-200 cursor-pointer"
                            >
                              <span>{tech}</span>
                              <Plus className="size-3.5 text-slate-400" />
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-center text-slate-400">
                            {newProjectTechInput.trim() ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const val = newProjectTechInput.trim();
                                  setEditingProject({
                                    ...editingProject,
                                    techStack: [...(editingProject.techStack || []), val],
                                  });
                                  setNewProjectTechInput("");
                                  setIsProjectTechOpen(false);
                                }}
                                className="text-blue-600 font-semibold hover:underline cursor-pointer"
                              >
                                + Add "{newProjectTechInput.trim()}"
                              </button>
                            ) : (
                              <span>All common tech added</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="sticky bottom-0 z-10 px-3 py-1.5 bg-slate-50 dark:bg-zinc-800/90 border-t border-slate-200 dark:border-zinc-700 text-[10px] text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                        <span>Click to add tech</span>
                        <button
                          type="button"
                          onClick={() => setIsProjectTechOpen(false)}
                          className="hover:text-slate-800 dark:text-zinc-200 font-semibold underline cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Popular tech chips for projects */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {POPULAR_TECH_STACK.slice(0, 8).map((tech) => {
                    const isAdded = (editingProject.techStack || []).includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        disabled={isAdded}
                        onClick={() => {
                          setEditingProject({
                            ...editingProject,
                            techStack: [...(editingProject.techStack || []), tech],
                          });
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                          isAdded
                            ? "bg-slate-100 dark:bg-zinc-800/40 text-slate-400 cursor-default"
                            : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                        }`}
                      >
                        {isAdded ? `✓ ${tech}` : `+ ${tech}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    value={editingProject.liveUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, liveUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={editingProject.githubUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, githubUrl: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer (Sticky) */}
            <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-2.5 shrink-0 bg-slate-50/70 dark:bg-zinc-900/70">
              <button
                type="button"
                onClick={() => {
                  setIsProjectModalOpen(false);
                  setIsProjectTechOpen(false);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer text-slate-700 dark:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingProject.title.trim()) {
                    toast.error("Project title is required");
                    return;
                  }
                  setProjects((prev) => {
                    const idx = prev.findIndex((p) => p.id === editingProject.id);
                    if (idx >= 0) {
                      const next = [...prev];
                      next[idx] = editingProject;
                      return next;
                    }
                    return [...prev, editingProject];
                  });
                  setIsProjectModalOpen(false);
                  setIsProjectTechOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: ADD OTHER LINK                                               */}
      {/* ==================================================================== */}
      {isOtherLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-card w-full max-w-sm max-h-[90dvh] flex flex-col rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-white dark:bg-card">
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                Add Other Link
              </h3>
              <button
                type="button"
                onClick={() => setIsOtherLinkModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
              <div>
                <label className="font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newOtherLinkTitle}
                  onChange={(e) => setNewOtherLinkTitle(e.target.value)}
                  placeholder="e.g. Substack, Medium, or Portfolio"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={newOtherLinkUrl}
                  onChange={(e) => setNewOtherLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-3 shrink-0 bg-slate-50/70 dark:bg-zinc-900/60">
              <button
                type="button"
                onClick={() => setIsOtherLinkModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newOtherLinkTitle.trim() || !newOtherLinkUrl.trim()) {
                    toast.error("Title and URL are required");
                    return;
                  }
                  setOtherLinks((prev) => [
                    ...prev,
                    {
                      id: `link_${Date.now()}`,
                      title: newOtherLinkTitle.trim(),
                      url: newOtherLinkUrl.trim(),
                    },
                  ]);
                  setIsOtherLinkModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: EDIT LAYOUT                                                  */}
      {/* ==================================================================== */}
      {isLayoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-card w-full max-w-md max-h-[90dvh] flex flex-col rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-white dark:bg-card">
              <div className="flex items-center gap-2">
                <LayoutGrid className="size-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                  Profile Layout & Visibility
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLayoutModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
              <p className="text-xs text-slate-500">
                Toggle which sections appear on your public and authenticated profile.
              </p>

              <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-zinc-800/80">
                {[
                  { key: "showEducation", label: "Education section" },
                  { key: "showExperience", label: "Experience section" },
                  { key: "showSkills", label: "Skills section" },
                  { key: "showProjects", label: "Projects section" },
                  { key: "showCodingProfiles", label: "Coding profiles" },
                  { key: "showSocialLinks", label: "Social links" },
                  { key: "showAchievements", label: "Achievements & Trophies" },
                  { key: "showAtAGlance", label: "At a glance statistics" },
                ].map(({ key, label }) => {
                  const isChecked = Boolean(visibility[key as keyof SectionVisibilityState]);
                  return (
                    <div key={key} className="flex items-center justify-between pt-2">
                      <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-zinc-300">
                        {label}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setVisibility((prev) => ({
                            ...prev,
                            [key]: !isChecked,
                          }))
                        }
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                          isChecked ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
                        }`}
                      >
                        <span
                          className={`inline-block size-3.5 transform rounded-full bg-white transition-transform ${
                            isChecked ? "translate-x-4.5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-3 shrink-0 bg-slate-50/70 dark:bg-zinc-900/60">
              <button
                type="button"
                onClick={() => setIsLayoutModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
