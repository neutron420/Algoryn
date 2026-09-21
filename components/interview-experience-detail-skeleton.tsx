"use client";

import React from "react";
import {
  ShimmeringSkeletonWrapper,
  SkeletonBox,
  SkeletonLine,
  SkeletonCircle,
} from "@/components/wensity/shimmering-skeleton-wrapper";

export function InterviewExperienceDetailSkeleton() {
  return (
    <ShimmeringSkeletonWrapper loading={true} className="max-w-4xl mx-auto p-3.5 sm:p-6 space-y-6 pb-20">
      {/* Top Navigation Breadcrumb Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SkeletonBox width={16} height={16} radius={4} delay={0} />
          <SkeletonLine width={180} height={14} delay={30} />
        </div>
        <SkeletonBox width={64} height={28} radius={8} delay={60} />
      </div>

      {/* Main Experience Article Card Skeleton */}
      <div className="bg-card border border-border/70 rounded-2xl p-4 sm:p-7 shadow-xs space-y-5">
        {/* Meta badges row: Company + Round + Verdict */}
        <div className="flex items-center gap-2 flex-wrap">
          <SkeletonBox width={90} height={26} radius={8} delay={60} />
          <SkeletonBox width={100} height={26} radius={8} delay={90} />
          <SkeletonBox width={75} height={26} radius={8} delay={120} />
        </div>

        {/* Title (2 lines) */}
        <div className="space-y-2 pt-1">
          <SkeletonLine width="90%" height={26} delay={100} />
          <SkeletonLine width="60%" height={24} delay={130} />
        </div>

        {/* Candidate Info Bar */}
        <div className="flex items-center justify-between gap-3 pt-2 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <SkeletonCircle size={36} delay={140} />
            <div className="space-y-1">
              <SkeletonLine width={120} height={14} delay={160} />
              <SkeletonLine width={160} height={11} delay={180} />
            </div>
          </div>
          <SkeletonBox width={70} height={14} radius={4} delay={170} />
        </div>

        {/* Debrief Summary Card Skeleton */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-2.5">
          <SkeletonLine width={100} height={16} delay={190} />
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <SkeletonCircle size={6} delay={200} />
              <SkeletonLine width="65%" height={12} delay={210} />
            </div>
            <div className="flex items-center gap-2">
              <SkeletonCircle size={6} delay={220} />
              <SkeletonLine width="55%" height={12} delay={230} />
            </div>
            <div className="flex items-center gap-2">
              <SkeletonCircle size={6} delay={240} />
              <SkeletonLine width="70%" height={12} delay={250} />
            </div>
          </div>
        </div>

        {/* Round 1 Card Skeleton */}
        <div className="p-4 sm:p-5 rounded-xl bg-muted/20 border border-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SkeletonBox width={22} height={22} radius={6} delay={220} />
              <SkeletonLine width={160} height={18} delay={240} />
            </div>
            <SkeletonBox width={70} height={16} radius={4} delay={250} />
          </div>

          <div className="space-y-1.5 pt-1">
            <SkeletonLine width="100%" height={12} delay={260} />
            <SkeletonLine width="92%" height={12} delay={280} />
          </div>

          {/* Questions Table Skeleton */}
          <div className="rounded-lg border border-border/50 overflow-hidden pt-1">
            <div className="bg-muted/60 p-2.5 flex items-center justify-between border-b border-border/40">
              <SkeletonLine width={120} height={12} delay={290} />
              <SkeletonLine width={60} height={12} delay={300} />
            </div>
            <div className="p-2.5 space-y-2 bg-card">
              <div className="flex items-center justify-between">
                <SkeletonLine width="60%" height={12} delay={310} />
                <SkeletonBox width={45} height={16} radius={4} delay={320} />
              </div>
              <div className="flex items-center justify-between">
                <SkeletonLine width="50%" height={12} delay={330} />
                <SkeletonBox width={50} height={16} radius={4} delay={340} />
              </div>
              <div className="flex items-center justify-between">
                <SkeletonLine width="55%" height={12} delay={350} />
                <SkeletonBox width={45} height={16} radius={4} delay={360} />
              </div>
            </div>
          </div>
        </div>

        {/* Round 2 Card Skeleton */}
        <div className="p-4 sm:p-5 rounded-xl bg-muted/20 border border-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SkeletonBox width={22} height={22} radius={6} delay={300} />
              <SkeletonLine width={200} height={18} delay={320} />
            </div>
            <SkeletonBox width={70} height={16} radius={4} delay={330} />
          </div>

          <div className="space-y-1.5 pt-1">
            <SkeletonLine width="95%" height={12} delay={340} />
            <SkeletonLine width="88%" height={12} delay={360} />
          </div>

          {/* Code block skeleton */}
          <div className="my-2 rounded-xl overflow-hidden border border-border/60 bg-zinc-900/60 p-3.5 space-y-2">
            <SkeletonLine width="40%" height={11} delay={370} />
            <SkeletonLine width="75%" height={11} delay={390} />
            <SkeletonLine width="60%" height={11} delay={410} />
            <SkeletonLine width="30%" height={11} delay={430} />
          </div>
        </div>

        {/* Footer Actions: Like, Bookmark, Comments */}
        <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SkeletonBox width={70} height={32} radius={10} delay={400} />
            <SkeletonBox width={90} height={32} radius={10} delay={420} />
          </div>
          <SkeletonBox width={36} height={32} radius={10} delay={440} />
        </div>
      </div>
    </ShimmeringSkeletonWrapper>
  );
}

export default InterviewExperienceDetailSkeleton;
