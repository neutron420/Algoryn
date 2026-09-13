"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ShimmeringSkeletonWrapper,
  SkeletonBox,
  SkeletonLine,
} from "@/components/wensity/shimmering-skeleton-wrapper";

export interface ProblemCardSkeletonProps {
  className?: string;
  loading?: boolean;
  delay?: number;
}

export function ProblemCardSkeleton({
  className,
  loading = true,
  delay = 0,
}: ProblemCardSkeletonProps) {
  return (
    <ShimmeringSkeletonWrapper
      loading={loading}
      rounded="rounded-lg"
      className={cn(
        "rounded-lg border border-border/70 bg-card p-3.5 sm:p-4 flex flex-col justify-between space-y-3 shadow-2xs transition-all",
        className
      )}
    >
      <div className="space-y-3">
        {/* Card Header: Platform Logo + Round / ID + Recency | Difficulty + Bookmark */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            {/* Platform Icon */}
            <SkeletonBox width={16} height={16} radius={4} delay={delay} />
            {/* LC Number / Badge */}
            <SkeletonBox width={46} height={18} radius={4} delay={delay + 40} />
            {/* Recency Tag */}
            <SkeletonBox width={72} height={18} radius={4} delay={delay + 80} />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Difficulty Badge */}
            <SkeletonBox width={48} height={18} radius={6} delay={delay + 120} />
            {/* Bookmark Icon Button */}
            <SkeletonBox width={26} height={26} radius={6} delay={delay + 160} />
          </div>
        </div>

        {/* Problem Title: 2 lines with subtle stagger */}
        <div className="space-y-1.5 pt-0.5">
          <SkeletonLine width="88%" height={14} delay={delay + 60} />
          <SkeletonLine width="52%" height={12} delay={delay + 100} />
        </div>

        {/* Topic Tag Pills */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          <SkeletonBox width={56} height={20} radius={6} delay={delay + 120} />
          <SkeletonBox width={68} height={20} radius={6} delay={delay + 160} />
          <SkeletonBox width={48} height={20} radius={6} delay={delay + 200} />
        </div>
      </div>

      {/* Card Footer: Company attribution & Solve indicator */}
      <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5">
          <SkeletonLine width={48} height={10} delay={delay + 140} />
          <SkeletonBox width={20} height={20} radius={6} delay={delay + 180} />
          <SkeletonLine width={60} height={12} delay={delay + 220} />
        </div>
        <SkeletonBox width={42} height={16} radius={4} delay={delay + 240} />
      </div>
    </ShimmeringSkeletonWrapper>
  );
}

export default ProblemCardSkeleton;
