"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { Select, SelectItem } from "@/components/base/select/select";
import { Switch } from "@/components/base/switch/switch";
import { toast } from "sonner";
import {
  SettingsCard,
  SettingsRow,
  SettingsSectionLabel,
} from "./settings-rows";

const SELECT_TRIGGER = "h-8 w-[130px] sm:w-[190px] shrink-0 gap-1 rounded-lg px-2 py-1 text-xs";

export function SettingsAppearance() {
  const [codeFontSize, setCodeFontSize] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("algoryn_code_font_size") || "14";
      } catch {
        return "14";
      }
    }
    return "14";
  });

  const [compactMode, setCompactMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("algoryn_compact_mode") === "true";
      } catch {
        return false;
      }
    }
    return false;
  });

  const [smoothAnimations, setSmoothAnimations] = useState(true);

  const handleFontChange = (val: string) => {
    setCodeFontSize(val);
    try {
      localStorage.setItem("algoryn_code_font_size", val);
    } catch {}
    toast.success(`Code font size set to ${val}px`);
  };

  const handleCompactChange = (val: boolean) => {
    setCompactMode(val);
    try {
      localStorage.setItem("algoryn_compact_mode", String(val));
    } catch {}
    toast.success(val ? "Compact layout enabled" : "Spacious layout enabled");
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Theme Section */}
      <div className="flex w-full flex-col gap-2">
        <SettingsSectionLabel>Theme & Display</SettingsSectionLabel>
        <SettingsCard>
          <SettingsRow
            layout="row"
            label="Theme Mode"
            description="Toggle between clean light and sleek dark mode"
          >
            <div className="flex items-center gap-2">
              <ThemeToggle appearance="segmented" size="small" />
            </div>
          </SettingsRow>

          <SettingsRow
            label="Code Editor Font Size"
            description="Font size for syntax highlighted solution code blocks"
          >
            <Select
              aria-label="Code Font Size"
              selectedKey={codeFontSize}
              onSelectionChange={(k) => handleFontChange(String(k))}
              className="shrink-0"
              triggerClassName={SELECT_TRIGGER}
            >
              <SelectItem id="12">12px (Compact)</SelectItem>
              <SelectItem id="14">14px (Default)</SelectItem>
              <SelectItem id="16">16px (Large)</SelectItem>
              <SelectItem id="18">18px (Extra Large)</SelectItem>
            </Select>
          </SettingsRow>

          <SettingsRow
            layout="row"
            label="Compact UI Density"
            description="Reduces padding in lists and question tables for higher data density"
          >
            <Switch
              aria-label="Compact UI Density"
              isSelected={compactMode}
              onChange={handleCompactChange}
            />
          </SettingsRow>

          <SettingsRow
            layout="row"
            label="UI Micro-animations"
            description="Enable subtle transitions, animated gradients, and hover reveals"
          >
            <Switch
              aria-label="UI Micro-animations"
              isSelected={smoothAnimations}
              onChange={(v) => {
                setSmoothAnimations(v);
                toast.success(v ? "Animations enabled" : "Reduced motion enabled");
              }}
            />
          </SettingsRow>
        </SettingsCard>
      </div>
    </div>
  );
}
