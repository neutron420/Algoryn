"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ShimmeringSkeletonWrapper,
  SkeletonBox,
  SkeletonLine,
  SkeletonCircle,
} from "@/components/wensity/shimmering-skeleton-wrapper";

export interface ExperienceCardSkeletonProps {
  className?: string;
  loading?: boolean;
  delay?: number;
}

export function ExperienceCardSkeleton({
  className,
  loading = true,
  delay = 0,
}: ExperienceCardSkeletonProps) {
  return (
    <ShimmeringSkeletonWrapper
      loading={loading}
      rounded="rounded-2xl"
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-4 sm:p-5 flex flex-col justify-between space-y-3.5 shadow-2xs transition-all",
        className
      )}
    >
      <div className="space-y-3">
        {/* Top Meta: Company + Round + Verdict + Date */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Company Badge */}
            <SkeletonBox width={90} height={22} radius={6} delay={delay} />
            {/* Round Badge */}
            <SkeletonBox width={110} height={22} radius={6} delay={delay + 40} />
            {/* Verdict Badge */}
            <SkeletonBox width={70} height={22} radius={6} delay={delay + 80} />
          </div>
          {/* Date */}
          <SkeletonBox width={60} height={14} radius={4} delay={delay + 60} />
        </div>

        {/* Title (2 lines) */}
        <div className="space-y-1.5 pt-0.5">
          <SkeletonLine width="85%" height={18} delay={delay + 60} />
          <SkeletonLine width="55%" height={16} delay={delay + 100} />
        </div>

        {/* Content Snippet (3 lines) */}
        <div className="space-y-1.5">
          <SkeletonLine width="100%" height={12} delay={delay + 90} />
          <SkeletonLine width="95%" height={12} delay={delay + 120} />
          <SkeletonLine width="70%" height={12} delay={delay + 150} />
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <SkeletonBox width={58} height={20} radius={4} delay={delay + 140} />
          <SkeletonBox width={72} height={20} radius={4} delay={delay + 170} />
          <SkeletonBox width={48} height={20} radius={4} delay={delay + 200} />
        </div>
      </div>

      {/* Bottom Action Bar: Author Info & Interactive Actions */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-3">
        {/* Author badge */}
        <div className="flex items-center gap-2 min-w-0">
          <SkeletonCircle size={24} delay={delay + 160} />
          <SkeletonLine width={80} height={12} delay={delay + 190} />
          <SkeletonLine width={96} height={10} delay={delay + 220} />
        </div>

        {/* Actions tray */}
        <div className="flex items-center gap-3.5 sm:gap-4 shrink-0">
          <SkeletonBox width={32} height={14} radius={4} delay={delay + 200} />
          <SkeletonBox width={32} height={14} radius={4} delay={delay + 230} />
          <SkeletonBox width={32} height={14} radius={4} delay={delay + 260} />
          <SkeletonBox width={16} height={14} radius={4} delay={delay + 280} />
          <SkeletonBox width={16} height={14} radius={4} delay={delay + 300} />
        </div>
      </div>
    </ShimmeringSkeletonWrapper>
  );
}

export default ExperienceCardSkeleton;
