"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";
import type { ComponentType, ReactNode } from "react";
import { cx } from "@/utils/cx";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/** Grouped card — rows divide themselves with borders that respect pl-12. */
export function SettingsCard({ className, children }: { className?: string; children: ReactNode }) {
  const localize = useTemplateCopy();
  return localize((
    <div
      className={cx(
        "flex w-full flex-col rounded-2xl bg-background-secondary-default ps-3",
        className,
      )}
    >
      {children}
    </div>
  ));
}

/** Muted 12px section heading above a card. */
export function SettingsSectionLabel({ className, children }: { className?: string; children: ReactNode }) {
  const localize = useTemplateCopy();
  return localize((
    <p className={cx("w-full px-2 sm:px-3 text-[11px] sm:text-body-2-medium font-semibold uppercase tracking-wider text-text-tertiary", className)}>
      {children}
    </p>
  ));
}

/** One label + control row. Fits comfortably on mobile and desktop without overflowing. */
export function SettingsRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children?: ReactNode;
  layout?: "auto" | "row" | "stack";
}) {
  const localize = useTemplateCopy();
  return localize((
    <div
      className={cx(
        "flex min-h-[48px] sm:min-h-[52px] w-full items-center justify-between gap-2 sm:gap-4 py-2.5 pe-2.5",
        "border-b border-separator-border last:border-b-0",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-xs sm:text-sm font-medium text-text-primary leading-tight truncate">{label}</p>
        {description && (
          <p className="text-[10px] sm:text-xs text-text-secondary mt-0.5 leading-tight truncate">{description}</p>
        )}
      </div>
      <div className="shrink-0 flex items-center justify-end">
        {children}
      </div>
    </div>
  ));
}

/**
 * Grey read-only value field, compact on mobile.
 */
export function SettingsValueField({
  icon: Icon,
  children,
  muted = false,
  className,
}: {
  icon?: IconComponent;
  children: ReactNode;
  muted?: boolean;
  className?: string;
}) {
  const localize = useTemplateCopy();
  return localize((
    <div
      className={cx(
        "flex h-8 w-[140px] sm:w-[200px] shrink-0 items-center gap-1 rounded-lg bg-background-tertiary-default px-2",
        className,
      )}
    >
      {Icon && <Icon className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />}
      <span
        className={cx(
          "truncate text-[11px] sm:text-body-regular",
          muted ? "text-text-secondary" : "text-text-primary",
        )}
      >
        {children}
      </span>
    </div>
  ));
}
