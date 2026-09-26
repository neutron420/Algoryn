"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FeatCard } from "./FeatCard";
import { InterviewPreparationCard } from "./InterviewPreparationCard";
import { ProblemAnalyticsCard } from "./ProblemAnalyticsCard";
import { InterviewExperienceCard } from "./InterviewExperienceCard";
import { CompanyProblemsCard } from "./CompanyProblemsCard";
import { CompetitiveProgrammingCard } from "./CompetitiveProgrammingCard";
import { DiscussionsCard } from "./DiscussionsCard";

export interface BentoCardConfig {
  title: string;
  description: string;
  visual: React.ReactNode;
  colSpan: string;
  height: string;
  href?: string;
  badge?: string;
}

export const CARDS: BentoCardConfig[] = [
  {
    title: "Interview Preparation",
    description:
      "Follow a structured path from company selection to interview-ready problem solving.",
    visual: <InterviewPreparationCard />,
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    height: "min-h-[295px] h-[305px] sm:h-[300px]",
    href: "/dashboard",
    badge: "Flow",
  },
  {
    title: "Problem Solving Analytics",
    description:
      "Track your coding progress across problems, topics, difficulty, and companies.",
    visual: <ProblemAnalyticsCard />,
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    height: "min-h-[295px] h-[305px] sm:h-[300px]",
    href: "/dashboard",
    badge: "Metrics",
  },
  {
    title: "Interview Experiences",
    description:
      "Explore real candidate experiences with round-by-round interview breakdowns.",
    visual: <InterviewExperienceCard />,
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    height: "min-h-[295px] h-[305px] sm:h-[300px]",
    href: "/dashboard/interview-experiences",
    badge: "Debriefs",
  },
  {
    title: "Company-Wise Problems",
    description:
      "Practice problems organized by company, difficulty, topic, and interview timeframe.",
    visual: <CompanyProblemsCard />,
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    height: "min-h-[295px] h-[305px] sm:h-[300px]",
    href: "/dashboard",
    badge: "Curated Banks",
  },
  {
    title: "Competitive Programming",
    description:
      "Connect your competitive programming profiles and track performance across platforms.",
    visual: <CompetitiveProgrammingCard />,
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    height: "min-h-[295px] h-[305px] sm:h-[300px]",
    href: "/dashboard/leaderboard",
    badge: "Sync",
  },
  {
    title: "Discussions",
    description:
      "Engage in peer-to-peer technical strategy, interview queries, compensation discussions, and system design Q&A.",
    visual: <DiscussionsCard />,
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    height: "min-h-[295px] h-[305px] sm:h-[300px]",
    href: "/dashboard/discussions",
    badge: "Community",
  },
];

export interface AlgorynBentoGridProps {
  className?: string;
  showSectionHeader?: boolean;
}

export function AlgorynBentoGrid({
  className,
  showSectionHeader = false,
}: AlgorynBentoGridProps) {
  return (
    <section id="features" className="w-full py-12 sm:py-20 md:py-24 bg-background">
      {showSectionHeader && (
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 px-3 sm:px-4 space-y-2.5 sm:space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20">
            <span>Platform Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground font-serif">
            Everything you need to prep, in one place
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            <span className="font-semibold text-foreground">690+ companies</span>, 15,000+ curated questions, verified candidate debriefs, and competitive programming sync. Filter, solve, and track your interview progress.
          </p>
        </div>
      )}

      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 w-full max-w-6xl mx-auto px-3.5 sm:px-6",
          className
        )}
      >
        {CARDS.map((card, idx) => (
          <FeatCard
            key={idx}
            title={card.title}
            description={card.description}
            href={card.href}
            badge={card.badge}
            className={cn(card.colSpan, card.height)}
          >
            {card.visual}
          </FeatCard>
        ))}
      </div>
    </section>
  );
}

export default AlgorynBentoGrid;
