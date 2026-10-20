"use client";

import { useDirection } from "@/components/foundations/direction/direction";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  RiCheckboxCircleFill,
  RiCloseLine,
  RiCodeBlock,
  RiExternalLinkLine,
  RiGitMergeLine,
  RiPaletteLine,
  RiSettings6Line,
  RiShieldUserLine,
  RiStackLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import { SettingsGeneral } from "./settings-general";
import { SettingsProfile } from "./settings-profile";
import { SettingsPlatforms } from "./settings-platforms";
import { SettingsAppearance } from "./settings-appearance";

export type SettingsPage = "general" | "profile" | "platforms" | "appearance";

export interface SettingsModalProps {
  /** Controlled open state, owned by the host page, sidebar, or menu. */
  isOpen: boolean;
  /** Called by the backdrop, close button, and Escape key. */
  onClose: () => void;
  /** Page selected each time the modal opens. */
  defaultPage?: SettingsPage;
  /** Optional product artwork used by the animated Current plan card. */
  planArtSrc?: string;
  /** Optional marketplace pane, including its own fixed header and scroll region. */
  marketplace?: ReactNode;
}

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

interface NavEntry {
  label: string;
  icon: IconComponent;
  page?: SettingsPage;
  href?: string;
}

const NAV_GROUPS: { label: string; items: NavEntry[] }[] = [
  {
    label: "Settings",
    items: [
      { label: "General", icon: RiSettings6Line, page: "general" },
      { label: "Profile", icon: RiShieldUserLine, page: "profile" },
      { label: "Coding Platforms", icon: RiCodeBlock, page: "platforms" },
      { label: "Appearance", icon: RiPaletteLine, page: "appearance" },
    ],
  },
  {
    label: "Quick Navigation",
    items: [
      { label: "Full Profile", icon: RiExternalLinkLine, href: "/dashboard/profile" },
      { label: "Roadmaps", icon: RiGitMergeLine, href: "/dashboard/roadmap" },
      { label: "System Design", icon: RiStackLine, href: "/dashboard/system-design" },
    ],
  },
];

const PAGE_TITLES: Record<SettingsPage, string> = {
  general: "General Settings",
  profile: "Profile Details",
  platforms: "Connected Platforms",
  appearance: "Appearance & Theme",
};

export function SettingsModal({
  isOpen,
  onClose,
  defaultPage = "general",
  planArtSrc,
}: SettingsModalProps) {
  const router = useRouter();
  const direction = useDirection();
  const [page, setPage] = useState<SettingsPage>(defaultPage);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const unmountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [savedPhase, setSavedPhase] = useState<"hidden" | "shown" | "leaving">("hidden");
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSavedToast = () => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
    setSavedPhase("shown");
    savedTimer.current = setTimeout(() => {
      setSavedPhase("leaving");
      savedTimer.current = setTimeout(() => setSavedPhase("hidden"), 220);
    }, 2000);
  };

  const [contentScrolled, setContentScrolled] = useState(false);

  useEffect(() => {
    let animFrame: number | null = null;
    if (isOpen) {
      if (unmountTimer.current) clearTimeout(unmountTimer.current);
      animFrame = requestAnimationFrame(() => {
        setPage(defaultPage);
        setMounted(true);
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      animFrame = requestAnimationFrame(() => {
        setVisible(false);
        setSavedPhase("hidden");
        unmountTimer.current = setTimeout(() => setMounted(false), 320);
      });
    }
    return () => {
      if (animFrame !== null) cancelAnimationFrame(animFrame);
      if (unmountTimer.current) clearTimeout(unmountTimer.current);
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, [isOpen, defaultPage]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Escape closes
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div dir={direction} className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4" role="presentation">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close settings"
        tabIndex={-1}
        onClick={onClose}
        className={cx(
          "absolute inset-0 cursor-default bg-black/75 backdrop-blur-sm sm:backdrop-blur-md transition-opacity duration-300 ease-out",
          visible ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Animated wrapper */}
      <div
        className={cx(
          "relative",
          "transform-gpu transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-[opacity,transform,filter]",
          visible ? "scale-100 opacity-100 blur-0" : "scale-[0.85] opacity-0 blur-[4px]",
        )}
      >
        {/* Panel — Compact floating card on mobile, not taking whole screen */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Settings"
          tabIndex={-1}
          className={cx(
            "relative flex h-[500px] sm:h-[614px] max-h-[82vh] w-[92vw] sm:w-[871px] max-w-[420px] sm:max-w-[871px]",
            "overflow-clip rounded-2xl sm:rounded-3xl bg-background-full border border-slate-200/80 dark:border-zinc-800/80 shadow-2xl outline-none",
          )}
        >
          {/* Nav rail — Clean icon rail on mobile, full labeled rail on desktop */}
          <nav
            aria-label="Settings sections"
            className="flex w-12 sm:w-52 lg:w-60 shrink-0 flex-col gap-4 sm:gap-5 overflow-y-auto border-e border-separator-border bg-background-secondary-default p-1.5 sm:p-2.5"
          >
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="flex w-full flex-col gap-1.5 pt-1">
                <span className="hidden ps-2 text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-text-tertiary sm:block">
                  {group.label}
                </span>
                <div className="flex w-full flex-col gap-1">
                  {group.items.map((item) => {
                    const selected = item.page !== undefined && item.page === page;
                    return (
                      <button
                        key={`${group.label}:${item.label}`}
                        type="button"
                        aria-label={item.label}
                        title={item.label}
                        aria-current={selected ? "page" : undefined}
                        onClick={() => {
                          if (item.href) {
                            onClose();
                            router.push(item.href);
                          } else if (item.page) {
                            setPage(item.page);
                            setContentScrolled(false);
                          }
                        }}
                        className={cx(
                          "flex w-full cursor-pointer items-center justify-center sm:justify-start gap-2.5 rounded-xl p-2 sm:px-2.5 text-start",
                          "outline-none transition-colors duration-150 ease focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                          selected
                            ? "bg-background-secondary-hover text-text-primary font-medium shadow-2xs"
                            : "text-text-secondary hover:bg-background-secondary-hover/60 hover:text-text-primary",
                        )}
                      >
                        <item.icon className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
                        <span
                          className={cx(
                            "hidden truncate text-sm sm:block",
                            selected ? "text-text-primary font-medium" : "text-text-secondary",
                          )}
                        >
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Content pane */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex shrink-0 items-center justify-between px-3.5 sm:px-8 pt-3.5 sm:pt-6 pb-2.5 sm:pb-3 border-b border-separator-border/40">
              <h2 className="text-sm sm:text-title-3-medium font-semibold text-text-primary">{PAGE_TITLES[page]}</h2>
              <button
                type="button"
                aria-label="Close settings"
                onClick={onClose}
                className={cx(
                  "flex size-6 sm:size-7 shrink-0 cursor-pointer items-center justify-center rounded-full",
                  "bg-background-tertiary-default text-foreground-icon-secondary",
                  "transition-colors duration-150 ease hover:bg-background-tertiary-hover",
                  "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                )}
              >
                <RiCloseLine className="size-3.5 sm:size-4" aria-hidden />
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <div
                className="h-full overflow-y-auto px-3 sm:px-8 py-3.5 sm:py-6"
                onScroll={(e) => setContentScrolled(e.currentTarget.scrollTop > 0)}
              >
                {page === "profile" ? (
                  <SettingsProfile onSaved={showSavedToast} />
                ) : page === "platforms" ? (
                  <SettingsPlatforms />
                ) : page === "appearance" ? (
                  <SettingsAppearance />
                ) : (
                  <SettingsGeneral planArtSrc={planArtSrc} />
                )}
              </div>

              {/* Progressive top fade */}
              <div
                aria-hidden
                className={cx(
                  "pointer-events-none absolute inset-x-0 top-0 h-4 sm:h-6 bg-linear-to-b from-background-primary-default to-transparent",
                  "transition-opacity duration-200 ease-out",
                  contentScrolled ? "opacity-100" : "opacity-0",
                )}
              />
            </div>
          </div>
        </div>

        {/* Saved toast */}
        <div
          aria-live="polite"
          className={cx(
            "pointer-events-none absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5",
            "rounded-full border border-border-button-default bg-background-primary-default py-1 pe-3 ps-2 shadow-dropdown",
            "transition-[opacity,transform,filter] duration-200 ease-out",
            savedPhase === "shown" && "translate-y-1/2 opacity-100 scale-100 blur-0",
            savedPhase === "hidden" && "translate-y-[calc(50%+12px)] opacity-0 scale-90 blur-[2px]",
            savedPhase === "leaving" && "translate-y-[calc(50%-10px)] opacity-0 scale-90 blur-[2px]",
          )}
        >
          <RiCheckboxCircleFill className="size-4 shrink-0 text-emerald-500" aria-hidden />
          <span className="text-xs font-medium whitespace-nowrap text-text-primary">Saved</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
