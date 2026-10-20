"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Select, SelectItem } from "@/components/base/select/select";
import { Switch } from "@/components/base/switch/switch";
import {
  SettingsCard,
  SettingsRow,
  SettingsSectionLabel,
} from "./settings-rows";

const SELECT_TRIGGER = "h-8 w-[130px] sm:w-[200px] shrink-0 gap-1 rounded-lg px-2 py-1 text-xs";

const STORAGE_KEY = "algoryn_general_settings";

interface GeneralSettingsState {
  preferredLanguage: string;
  dailyGoal: string;
  targetTrack: string;
  dailyReminder: boolean;
  streakSaver: boolean;
  discussionReplies: boolean;
  systemDesignUpdates: boolean;
}

const DEFAULT_SETTINGS: GeneralSettingsState = {
  preferredLanguage: "cpp",
  dailyGoal: "2",
  targetTrack: "faang",
  dailyReminder: true,
  streakSaver: true,
  discussionReplies: true,
  systemDesignUpdates: false,
};

export function SettingsGeneral(props: { planArtSrc?: string } = {}) {
  void props;
  const [settings, setSettings] = useState<GeneralSettingsState>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        }
      } catch {
        // fallback
      }
    }
    return DEFAULT_SETTINGS;
  });

  const updateSetting = <K extends keyof GeneralSettingsState>(
    key: K,
    value: GeneralSettingsState[K]
  ) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    toast.success("Preferences saved");
  };

  return (
    <div className="flex w-full flex-col gap-5 sm:gap-6">
      {/* Coding & Prep Preferences */}
      <div className="flex w-full flex-col gap-2">
        <SettingsSectionLabel>Preparation & Practice Preferences</SettingsSectionLabel>
        <SettingsCard>
          <SettingsRow
            label="Preferred Language"
            description="Default runtime & solution tab"
          >
            <Select
              aria-label="Preferred Language"
              selectedKey={settings.preferredLanguage}
              onSelectionChange={(key) => updateSetting("preferredLanguage", String(key))}
              className="shrink-0"
              triggerClassName={SELECT_TRIGGER}
            >
              <SelectItem id="cpp">C++ (C++20)</SelectItem>
              <SelectItem id="java">Java 21</SelectItem>
              <SelectItem id="python">Python 3.12</SelectItem>
              <SelectItem id="javascript">JavaScript / TS</SelectItem>
              <SelectItem id="go">Go (Golang)</SelectItem>
            </Select>
          </SettingsRow>

          <SettingsRow
            label="Daily Practice Goal"
            description="Target problems to solve per day"
          >
            <Select
              aria-label="Daily Practice Goal"
              selectedKey={settings.dailyGoal}
              onSelectionChange={(key) => updateSetting("dailyGoal", String(key))}
              className="shrink-0"
              triggerClassName={SELECT_TRIGGER}
            >
              <SelectItem id="1">1 Problem / Day</SelectItem>
              <SelectItem id="2">2 Problems / Day</SelectItem>
              <SelectItem id="3">3 Problems / Day</SelectItem>
              <SelectItem id="5">5 Problems / Day</SelectItem>
            </Select>
          </SettingsRow>

          <SettingsRow
            label="Primary Track"
            description="Recommended company sheets & roadmap"
          >
            <Select
              aria-label="Primary Target Track"
              selectedKey={settings.targetTrack}
              onSelectionChange={(key) => updateSetting("targetTrack", String(key))}
              className="shrink-0"
              triggerClassName={SELECT_TRIGGER}
            >
              <SelectItem id="faang">FAANG & Big Tech</SelectItem>
              <SelectItem id="hft">HFT & Quant</SelectItem>
              <SelectItem id="startups">Startups & Unicorns</SelectItem>
              <SelectItem id="backend">Distributed Systems</SelectItem>
            </Select>
          </SettingsRow>
        </SettingsCard>
      </div>

      {/* Notifications & Reminders */}
      <div className="flex w-full flex-col gap-2">
        <SettingsSectionLabel>Practice Reminders & Notifications</SettingsSectionLabel>
        <SettingsCard>
          <SettingsRow
            layout="row"
            label="Daily Practice Reminder"
            description="Receive an in-app reminder when you haven't solved a problem today"
          >
            <Switch
              aria-label="Daily Practice Reminder"
              isSelected={settings.dailyReminder}
              onChange={(val) => updateSetting("dailyReminder", val)}
            />
          </SettingsRow>

          <SettingsRow
            layout="row"
            label="Streak Saver Alert"
            description="Send an alert before the day ends if your streak is in jeopardy"
          >
            <Switch
              aria-label="Streak Saver Alert"
              isSelected={settings.streakSaver}
              onChange={(val) => updateSetting("streakSaver", val)}
            />
          </SettingsRow>

          <SettingsRow
            layout="row"
            label="Discussion Mentions & Replies"
            description="Notify when a fellow developer replies to your interview post or solution"
          >
            <Switch
              aria-label="Discussion Mentions & Replies"
              isSelected={settings.discussionReplies}
              onChange={(val) => updateSetting("discussionReplies", val)}
            />
          </SettingsRow>

          <SettingsRow
            layout="row"
            label="System Design Hub Updates"
            description="Notify when new high-scale architectural teardowns or books are added"
          >
            <Switch
              aria-label="System Design Hub Updates"
              isSelected={settings.systemDesignUpdates}
              onChange={(val) => updateSetting("systemDesignUpdates", val)}
            />
          </SettingsRow>
        </SettingsCard>
      </div>
    </div>
  );
}
