"use client";

import React from "react";
import { motion } from "framer-motion";
import { LeetCode } from "@/components/templates/nova/svgs/leetcode";
import { Codeforces } from "@/components/templates/nova/svgs/codeforces";
import { CodeChef } from "@/components/templates/nova/svgs/codechef";
import { AtCoder } from "@/components/templates/nova/svgs/atcoder";

interface CPPlatform {
  name: string;
  metric: string;
  metricLabel: string;
  subMetric: string;
  fill: number;
  icon: React.ElementType;
  progressColor: string;
  badgeBg: string;
}

const PLATFORMS: CPPlatform[] = [
  {
    name: "LeetCode",
    metric: "247",
    metricLabel: "Solved",
    subMetric: "Top 4.8%",
    fill: 78,
    icon: LeetCode,
    progressColor: "bg-[#FFA116]",
    badgeBg: "text-[#FFA116]",
  },
  {
    name: "Codeforces",
    metric: "1482",
    metricLabel: "Rating",
    subMetric: "Specialist",
    fill: 68,
    icon: Codeforces,
    progressColor: "bg-[#1F8ACB]",
    badgeBg: "text-[#1F8ACB]",
  },
  {
    name: "CodeChef",
    metric: "3★",
    metricLabel: "Div 2",
    subMetric: "1,680 pts",
    fill: 62,
    icon: CodeChef,
    progressColor: "bg-[#8B6F47] dark:bg-[#D2B48C]",
    badgeBg: "text-[#8B6F47] dark:text-[#D2B48C]",
  },
  {
    name: "AtCoder",
    metric: "842",
    metricLabel: "Rating",
    subMetric: "Green rank",
    fill: 54,
    icon: AtCoder,
    progressColor: "bg-emerald-600 dark:bg-emerald-500",
    badgeBg: "text-emerald-600 dark:text-emerald-400",
  },
];

export function CompetitiveProgrammingCard() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2.5 select-none">
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {PLATFORMS.map((platform, i) => {
          const Icon = platform.icon;

          return (
            <motion.div
              key={platform.name}
              className="relative rounded-[16px] border border-border/60 bg-card/95 dark:bg-neutral-950/70 shadow-2xs hover:shadow-xs transition-all duration-300 flex flex-col justify-between p-2.5 group hover:border-border"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 320, damping: 25 }}
            >
              {/* Top Row: Official Authentic Logo + Metric */}
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-xl bg-muted/30 dark:bg-neutral-900 border border-border/70 dark:border-border/40 shadow-xs flex items-center justify-center p-1.5 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-5 h-5 shrink-0" />
                </div>

                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-xs font-mono font-bold text-foreground leading-none">
                    {platform.metric}
                  </span>
                  <span className="text-[7.5px] font-mono text-muted-foreground uppercase tracking-wider leading-none">
                    {platform.metricLabel}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Name + Sub-metric + Animated Progress Bar */}
              <div className="mt-2.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="font-semibold text-foreground tracking-tight">
                    {platform.name}
                  </span>
                  <span className={`text-[8px] font-medium ${platform.badgeBg}`}>
                    {platform.subMetric}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden shadow-inner relative">
                  <motion.div
                    className={`absolute left-0 top-0 bottom-0 rounded-full ${platform.progressColor}`}
                    initial={{ width: "0%" }}
                    whileInView={{ width: `${platform.fill}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.9, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default CompetitiveProgrammingCard;
