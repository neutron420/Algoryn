"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface AnnouncementProps
  extends React.HTMLAttributes<HTMLElement> {
  href?: string;
}

export function Announcement({
  className,
  href,
  children,
  ...props
}: AnnouncementProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "group relative inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3.5 py-1 text-xs font-medium backdrop-blur-md transition-all hover:bg-muted hover:border-primary/40 hover:shadow-xs cursor-pointer shadow-2xs",
          className
        )}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3.5 py-1 text-xs font-medium backdrop-blur-md transition-all shadow-2xs",
        className
      )}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  );
}

export function AnnouncementTag({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function AnnouncementTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-foreground font-medium",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
