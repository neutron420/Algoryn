"use client";

import { useEffect, useState } from "react";
import {
  RiCodeBlock,
  RiExternalLinkLine,
  RiRefreshLine,
} from "@remixicon/react";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/auth-context";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import {
  SettingsCard,
  SettingsRow,
  SettingsSectionLabel,
} from "./settings-rows";

interface PlatformAccount {
  id: number;
  platform: string;
  username: string;
  isVerified: boolean;
  lastSyncedAt?: string;
  syncError?: string;
  stats?: unknown;
}

const SUPPORTED_PLATFORMS = [
  {
    key: "LEETCODE",
    name: "LeetCode",
    placeholder: "username (e.g. ritesh_04)",
    urlPrefix: "https://leetcode.com/u/",
    iconColor: "text-amber-500",
  },
  {
    key: "CODEFORCES",
    name: "Codeforces",
    placeholder: "handle (e.g. fnatic_coder)",
    urlPrefix: "https://codeforces.com/profile/",
    iconColor: "text-blue-500",
  },
  {
    key: "GITHUB",
    name: "GitHub",
    placeholder: "github username",
    urlPrefix: "https://github.com/",
    iconColor: "text-zinc-400",
  },
  {
    key: "CODECHEF",
    name: "CodeChef",
    placeholder: "handle (e.g. ritesh_chef)",
    urlPrefix: "https://www.codechef.com/users/",
    iconColor: "text-amber-700",
  },
  {
    key: "GEEKSFORGEEKS",
    name: "GeeksforGeeks",
    placeholder: "gfg username",
    urlPrefix: "https://auth.geeksforgeeks.org/user/",
    iconColor: "text-emerald-500",
  },
];

export function SettingsPlatforms() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<PlatformAccount[]>([]);
  const [, setLoading] = useState(true);
  const [inputHandles, setInputHandles] = useState<Record<string, string>>({});
  const [connecting, setConnecting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    async function loadPlatforms() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/user/platforms?userId=${encodeURIComponent(user.uid)}`);
        if (res.ok) {
          const data = await res.json();
          if (mounted && Array.isArray(data.accounts)) {
            setAccounts(data.accounts);
            const initialMap: Record<string, string> = {};
            for (const acc of data.accounts) {
              initialMap[acc.platform.toUpperCase()] = acc.username;
            }
            setInputHandles(initialMap);
          }
        }
      } catch (err) {
        console.warn("Failed to load platforms:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadPlatforms();
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleConnect = async (platformKey: string) => {
    const username = (inputHandles[platformKey] || "").trim();
    if (!username) {
      toast.error(`Please enter your ${platformKey} username.`);
      return;
    }

    if (!user?.uid) {
      toast.error("Please log in to link coding profiles.");
      return;
    }

    setConnecting((prev) => ({ ...prev, [platformKey]: true }));
    try {
      const res = await fetch("/api/user/platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          platform: platformKey,
          username,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Could not verify ${platformKey} profile.`);
      }

      toast.success(`Successfully connected ${platformKey}!`);

      // Refresh accounts list
      const refreshed = await fetch(`/api/user/platforms?userId=${encodeURIComponent(user.uid)}`);
      if (refreshed.ok) {
        const d = await refreshed.json();
        if (Array.isArray(d.accounts)) {
          setAccounts(d.accounts);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect platform";
      toast.error(msg);
    } finally {
      setConnecting((prev) => ({ ...prev, [platformKey]: false }));
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Intro Header */}
      <div className="p-4 rounded-2xl bg-background-secondary-default border border-slate-200/60 dark:border-zinc-800/60 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <RiCodeBlock className="size-5 text-indigo-500" />
          <h3 className="font-semibold text-text-primary text-sm sm:text-base">
            Connected Coding Platforms
          </h3>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
          Connect your competitive programming profiles. Algoryn periodically fetches your ratings, solved problems, and submission history to benchmark your interview readiness on your public profile and leaderboard.
        </p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <SettingsSectionLabel>Platform Handles & Sync</SettingsSectionLabel>
        <SettingsCard>
          {SUPPORTED_PLATFORMS.map((plat) => {
            const existing = accounts.find((a) => a.platform.toUpperCase() === plat.key);
            const isConn = Boolean(existing);
            const isWorking = connecting[plat.key] || false;

            return (
              <SettingsRow
                key={plat.key}
                label={plat.name}
                description={
                  existing?.isVerified
                    ? `Verified • Last synced ${existing.lastSyncedAt ? new Date(existing.lastSyncedAt).toLocaleDateString() : "recently"}`
                    : `Enter your public ${plat.name} handle to sync solve history`
                }
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <Input
                    size="small"
                    placeholder={plat.placeholder}
                    value={inputHandles[plat.key] ?? (existing?.username || "")}
                    onChange={(val) =>
                      setInputHandles((prev) => ({ ...prev, [plat.key]: val }))
                    }
                    className="w-full sm:w-[200px]"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isConn ? "secondary" : "primary"}
                      size="small"
                      disabled={isWorking}
                      onClick={() => handleConnect(plat.key)}
                      className="flex-1 sm:flex-none justify-center shrink-0"
                    >
                      {isWorking ? (
                        <RiRefreshLine className="size-3.5 animate-spin" />
                      ) : isConn ? (
                        <span className="flex items-center gap-1">
                          <RiRefreshLine className="size-3.5" />
                          Sync
                        </span>
                      ) : (
                        "Connect"
                      )}
                    </Button>
                    {isConn && existing?.username && (
                      <a
                        href={`${plat.urlPrefix}${existing.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-border-button-default hover:bg-background-tertiary-hover text-text-secondary transition-colors shrink-0"
                        title={`Open ${plat.name} profile in new tab`}
                      >
                        <RiExternalLinkLine className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
              </SettingsRow>
            );
          })}
        </SettingsCard>
      </div>
    </div>
  );
}
