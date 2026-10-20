"use client";

import { Suspense, useState, type ComponentType } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  RiCheckboxCircleFill,
  RiCodeBlock,
  RiPaletteLine,
  RiSettings6Line,
  RiShieldUserLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import { SettingsGeneral } from "@/components/application/settings/settings-general";
import { SettingsProfile } from "@/components/application/settings/settings-profile";
import { SettingsPlatforms } from "@/components/application/settings/settings-platforms";
import { SettingsAppearance } from "@/components/application/settings/settings-appearance";

type TabKey = "general" | "profile" | "platforms" | "appearance";

interface TabItem {
  key: TabKey;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}

const TABS: TabItem[] = [
  { key: "general", label: "General", icon: RiSettings6Line },
  { key: "profile", label: "Profile", icon: RiShieldUserLine },
  { key: "platforms", label: "Coding Platforms", icon: RiCodeBlock },
  { key: "appearance", label: "Appearance", icon: RiPaletteLine },
];

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") as TabKey;
  const activeTab: TabKey =
    tabParam && ["general", "profile", "platforms", "appearance"].includes(tabParam)
      ? tabParam
      : "general";

  // Saved Toast state
  const [savedVisible, setSavedVisible] = useState(false);

  const showSavedToast = () => {
    setSavedVisible(true);
    setTimeout(() => setSavedVisible(false), 2400);
  };

  const handleTabChange = (key: TabKey) => {
    router.replace(`/dashboard/settings?tab=${key}`, { scroll: false });
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)] p-3 sm:p-6 md:p-8 max-w-5xl mx-auto flex flex-col gap-5 sm:gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-slate-200/80 dark:border-zinc-800/80 pb-4 sm:pb-5">
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          Manage your personal profile, study preferences, connected coding profiles, and application appearance.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800/80 w-full sm:w-fit overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={cx(
                "flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap flex-1 sm:flex-initial",
                isActive
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-xs font-semibold"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/50"
              )}
            >
              <Icon className="size-3.5 sm:size-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === "general" && <SettingsGeneral />}
        {activeTab === "profile" && <SettingsProfile onSaved={showSavedToast} />}
        {activeTab === "platforms" && <SettingsPlatforms />}
        {activeTab === "appearance" && <SettingsAppearance />}
      </div>

      {/* Floating Saved Toast */}
      {savedVisible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <RiCheckboxCircleFill className="size-4 shrink-0 text-emerald-400" />
          <span className="text-xs font-medium">Changes saved successfully</span>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 max-w-5xl mx-auto flex flex-col gap-4 animate-pulse">
          <div className="h-8 w-40 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-4 w-72 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-10 w-96 bg-slate-200 dark:bg-zinc-800 rounded-xl mt-4" />
          <div className="h-64 w-full bg-slate-200 dark:bg-zinc-800 rounded-2xl mt-6" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
