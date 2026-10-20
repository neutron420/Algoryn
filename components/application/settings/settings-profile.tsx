"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
  RiBuildingLine,
  RiExternalLinkLine,
  RiGithubLine,
  RiLinkedinLine,
  RiLogoutCircleLine,
  RiMailLine,
  RiMapPinLine,
  RiSaveLine,
  RiUserLine,
} from "@remixicon/react";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/auth-context";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Switch } from "@/components/base/switch/switch";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badge";
import { cx } from "@/utils/cx";
import {
  SettingsCard,
  SettingsRow,
  SettingsSectionLabel,
  SettingsValueField,
} from "./settings-rows";

export interface SettingsProfileProps {
  onSaved?: () => void;
}

/**
 * Editable design-system Input that commits on Enter or Blur.
 */
function ProfileSavableInput({
  value,
  onChange,
  onCommit,
  placeholder,
  leadingIcon,
  type = "text",
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  onCommit: () => void;
  placeholder?: string;
  leadingIcon?: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  type?: string;
  className?: string;
}) {
  const committedRef = useRef(value);

  return (
    <Input
      size="small"
      type={type}
      placeholder={placeholder}
      leadingIcon={leadingIcon}
      value={value}
      onChange={(v) => onChange(v)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          (event.target as HTMLElement).blur();
        }
      }}
      onBlur={() => {
        if (value !== committedRef.current) {
          committedRef.current = value;
          onCommit();
        }
      }}
      className={cx("w-[130px] sm:w-[200px] shrink-0", className)}
    />
  );
}

export function SettingsProfile({ onSaved }: SettingsProfileProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();

  // Loading state
  const [, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Fields
  const [firstName, setFirstName] = useState("Ritesh");
  const [lastName, setLastName] = useState("Singh");
  const [username, setUsername] = useState("ritesh");
  const [email, setEmail] = useState("fnaticritesh2004@gmail.com");
  const [headline, setHeadline] = useState("Full Stack Engineer & Competitive Programmer");
  const [collegeOrCompany, setCollegeOrCompany] = useState("Algoryn");
  const [location, setLocation] = useState("India");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [bio, setBio] = useState("");
  const [publicProfile, setPublicProfile] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("/ritesh-avatar.png");

  // Fetch user profile on mount
  useEffect(() => {
    let mounted = true;

    async function fetchUserProfile() {
      // Initialize with auth context defaults
      if (user) {
        if (user.displayName) {
          const parts = user.displayName.trim().split(/\s+/);
          setFirstName(parts[0] || "");
          setLastName(parts.slice(1).join(" ") || "");
        }
        if (user.email) {
          setEmail(user.email);
          const defaultHandle = user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
          setUsername((prev) => prev === "ritesh" ? defaultHandle : prev);
        }
        if (user.photoURL) {
          setAvatarUrl(user.photoURL);
        }
      }

      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/user/profile?userId=${encodeURIComponent(user.uid)}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (mounted && data?.profile) {
          const p = data.profile;
          if (p.displayName) {
            const parts = p.displayName.trim().split(/\s+/);
            setFirstName(parts[0] || "");
            setLastName(parts.slice(1).join(" ") || "");
          }
          if (p.username) setUsername(p.username);
          if (p.email) setEmail(p.email);
          if (p.headline) setHeadline(p.headline);
          if (p.collegeOrCompany) setCollegeOrCompany(p.collegeOrCompany);
          if (p.location) setLocation(p.location);
          if (p.githubUrl) setGithubUrl(p.githubUrl);
          if (p.linkedinUrl) setLinkedinUrl(p.linkedinUrl);
          if (p.bio) setBio(p.bio);
          if (p.photoUrl) setAvatarUrl(p.photoUrl);
          if (p.sectionVisibility && typeof p.sectionVisibility.publicProfile === "boolean") {
            setPublicProfile(p.sectionVisibility.publicProfile);
          }
        }
      } catch (err) {
        console.warn("Could not fetch user profile details:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUserProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Save changes handler
  const handleSaveProfile = async (silent = false) => {
    if (!user?.uid) {
      if (!silent) toast.error("Please log in to save your profile changes.");
      return;
    }

    setIsSaving(true);
    try {
      const fullDisplayName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const payload = {
        userId: user.uid,
        displayName: fullDisplayName || undefined,
        username: username.trim() || undefined,
        headline: headline.trim() || undefined,
        collegeOrCompany: collegeOrCompany.trim() || undefined,
        location: location.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        bio: bio.trim() || undefined,
        sectionVisibility: {
          publicProfile,
        },
      };

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      onSaved?.();
      if (!silent) {
        toast.success("Profile updated successfully!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublic = async (nextVal: boolean) => {
    setPublicProfile(nextVal);
    if (!user?.uid) return;
    try {
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          sectionVisibility: { publicProfile: nextVal },
        }),
      });
      onSaved?.();
      toast.success(nextVal ? "Public profile enabled" : "Public profile hidden");
    } catch {
      // silent fallback
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Top Profile Summary Header Card */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-background-secondary-default border border-slate-200/60 dark:border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Avatar size="lg" color="blue" src={avatarUrl} alt={`${firstName} ${lastName}`} />
            <span
              className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950"
              title="Active session"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-text-primary text-sm sm:text-base truncate">
                {firstName} {lastName}
              </span>
              <Badge color="primary" className="text-[9px] font-mono px-1.5 py-0.2">
                PRO MEMBER
              </Badge>
            </div>
            <span className="text-xs text-text-secondary truncate max-w-[200px] sm:max-w-[320px]">
              {email}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto pt-1 sm:pt-0">
          <Button
            variant="secondary"
            size="small"
            leadingIcon={RiExternalLinkLine}
            onClick={() => router.push("/dashboard/profile")}
            className="flex-1 sm:flex-none justify-center"
          >
            View Profile
          </Button>
          <Button
            variant="primary"
            size="small"
            leadingIcon={RiSaveLine}
            disabled={isSaving}
            onClick={() => handleSaveProfile(false)}
            className="flex-1 sm:flex-none justify-center"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Identity & Basic Information */}
      <div className="flex w-full flex-col gap-2">
        <SettingsSectionLabel>Identity & Public Details</SettingsSectionLabel>
        <SettingsCard>
          <SettingsRow label="Email Address" description="Primary account email">
            <SettingsValueField icon={RiMailLine} className="w-[130px] sm:w-[200px]">
              <span className="truncate">{email}</span>
            </SettingsValueField>
          </SettingsRow>

          <SettingsRow label="First name" description="Your given name">
            <ProfileSavableInput
              value={firstName}
              onChange={setFirstName}
              onCommit={() => handleSaveProfile(true)}
              placeholder="First name"
              leadingIcon={RiUserLine}
            />
          </SettingsRow>

          <SettingsRow label="Last name" description="Your family / surname">
            <ProfileSavableInput
              value={lastName}
              onChange={setLastName}
              onCommit={() => handleSaveProfile(true)}
              placeholder="Last name"
              leadingIcon={RiUserLine}
            />
          </SettingsRow>

          <SettingsRow label="Username" description="Your unique handle on Algoryn (algoryn.dev/@username)">
            <ProfileSavableInput
              value={username}
              onChange={setUsername}
              onCommit={() => handleSaveProfile(true)}
              placeholder="username"
            />
          </SettingsRow>

          <SettingsRow label="Headline" description="Professional or prep title displayed on your public card">
            <ProfileSavableInput
              value={headline}
              onChange={setHeadline}
              onCommit={() => handleSaveProfile(true)}
              placeholder="e.g. SDE Intern @ Google | Algoryn Top 1%"
            />
          </SettingsRow>

          <SettingsRow label="College or Company" description="Your university or current organization">
            <ProfileSavableInput
              value={collegeOrCompany}
              onChange={setCollegeOrCompany}
              onCommit={() => handleSaveProfile(true)}
              placeholder="e.g. IIT Delhi, Amazon, Microsoft"
              leadingIcon={RiBuildingLine}
            />
          </SettingsRow>

          <SettingsRow label="Location" description="City and Country">
            <ProfileSavableInput
              value={location}
              onChange={setLocation}
              onCommit={() => handleSaveProfile(true)}
              placeholder="e.g. Bengaluru, India"
              leadingIcon={RiMapPinLine}
            />
          </SettingsRow>
        </SettingsCard>
      </div>

      {/* Socials & External Profiles */}
      <div className="flex w-full flex-col gap-2">
        <SettingsSectionLabel>Socials & Links</SettingsSectionLabel>
        <SettingsCard>
          <SettingsRow label="GitHub Profile" description="Link to your GitHub profile or repository portfolio">
            <ProfileSavableInput
              value={githubUrl}
              onChange={setGithubUrl}
              onCommit={() => handleSaveProfile(true)}
              placeholder="https://github.com/yourhandle"
              leadingIcon={RiGithubLine}
            />
          </SettingsRow>

          <SettingsRow label="LinkedIn Profile" description="Link to your professional LinkedIn network">
            <ProfileSavableInput
              value={linkedinUrl}
              onChange={setLinkedinUrl}
              onCommit={() => handleSaveProfile(true)}
              placeholder="https://linkedin.com/in/yourhandle"
              leadingIcon={RiLinkedinLine}
            />
          </SettingsRow>
        </SettingsCard>
      </div>

      {/* Algoryn Account & Session Security */}
      <div className="flex w-full flex-col gap-2">
        <SettingsSectionLabel>Algoryn Account & Security</SettingsSectionLabel>
        <SettingsCard>
          <SettingsRow
            layout="row"
            label="Algoryn Public Profile"
            description="When enabled, your streak, solved stats, and activity will be visible to peers and recruiters"
          >
            <Switch
              aria-label="Public profile"
              isSelected={publicProfile}
              onChange={handleTogglePublic}
            />
          </SettingsRow>

          <SettingsRow
            label="Profile Editor"
            description="Edit rich resume details including Education, Work Experience, and Featured Projects"
          >
            <Button
              variant="secondary"
              size="small"
              leadingIcon={RiExternalLinkLine}
              onClick={() => router.push("/dashboard/profile/edit")}
            >
              Full Profile Editor
            </Button>
          </SettingsRow>

          <SettingsRow label="Account UID" description="Unique cryptographic identifier for your Algoryn account">
            <SettingsValueField muted className="w-[130px] sm:w-[200px] font-mono text-[11px]">
              {user?.uid || "algoryn_authenticated_user"}
            </SettingsValueField>
          </SettingsRow>

          <SettingsRow
            layout="row"
            label="Sign Out"
            description="Securely terminate your current session on this browser"
          >
            <Button
              variant="secondary"
              size="small"
              leadingIcon={RiLogoutCircleLine}
              onClick={handleSignOut}
              className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
            >
              Sign Out
            </Button>
          </SettingsRow>
        </SettingsCard>
      </div>
    </div>
  );
}
