"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  /** Optional extra classes for sizing/spanning */
  className?: string;
  /** Optional clickable destination route in Algoryn */
  href?: string;
  /** Optional badge in card header */
  badge?: string;
}

export function FeatCard({
  title,
  description,
  children,
  className = "",
  href,
  badge,
}: FeatCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col gap-1.5 sm:gap-2 overflow-hidden rounded-[20px] p-3.5 sm:p-4 text-left transition-all duration-300",
        "bg-card/95 border border-border/70 active:scale-[0.99] touch-manipulation",
        "shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.03)]",
        "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.25)]",
        "hover:border-border hover:shadow-md",
        className
      )}
    >
      <div className="z-10 flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-sm tracking-tight truncate">
              {title}
            </h3>
            {badge && (
              <span className="text-[9px] sm:text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                {badge}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed max-w-[96%] line-clamp-2 sm:line-clamp-none">
            {description}
          </p>
        </div>

        {href && (
          <div className="size-6 rounded-full bg-muted/60 border border-border/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-primary/10 group-hover:border-primary/30 transition-all shrink-0">
            <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        )}
      </div>

      <div className="relative mt-1.5 sm:mt-2 flex-1 w-full rounded-[14px] overflow-hidden border border-border/50 bg-background/50 dark:bg-neutral-950/50">
        {children}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-[20px]">
        {content}
      </Link>
    );
  }

  return content;
}

export default FeatCard;
