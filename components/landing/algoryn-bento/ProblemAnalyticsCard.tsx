"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ProblemAnalyticsCard() {
  const bars = [45, 75, 35, 85, 60, 95, 50];
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev === 0 ? 1 : 0));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Problems Solved", value: "247", trend: "+18%", trendLabel: "weekly" },
    { label: "Daily Streak", value: "14 Days", trend: "+12%", trendLabel: "prev" },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-3 justify-between p-2.5 select-none">
      {/* Stats row with interactive slide offset */}
      <div className="flex gap-3 pt-1 pr-1 pb-0.5 pl-0.5">
        {stats.map((s, i) => {
          const isActive = i === activeIdx || hoveredIdx === i;

          return (
            <div key={i} className="flex-1 h-[72px] relative select-none">
              {/* Background Hatched Scale Card */}
              <div
                className="absolute inset-0 rounded-xl border border-border/40 dark:border-border/20 bg-muted/10 text-border/30 dark:text-border/20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 6px, currentColor 6px, currentColor 7px)",
                }}
              />

              {/* Foreground sliding card */}
              <motion.div
                className="absolute inset-0 w-full h-full rounded-xl bg-card/90 dark:bg-neutral-950/80 border border-border/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] p-2.5 hover:bg-muted/30 transition-colors duration-300 backdrop-blur-[2px] flex items-center justify-between gap-2.5 cursor-pointer"
                animate={{
                  x: isActive ? "0.35rem" : "0rem",
                  y: isActive ? "-0.35rem" : "0rem",
                }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Metric Info */}
                <div className="flex flex-col min-w-0">
                  <span className="text-[7.5px] text-muted-foreground font-mono uppercase tracking-wider leading-none">
                    {s.label}
                  </span>
                  <span className="text-sm sm:text-base font-bold font-mono text-foreground leading-none mt-1.5 tracking-tight">
                    {s.value}
                  </span>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span
                      className={`text-[8px] font-mono font-bold ${
                        s.trend.startsWith("+") ? "text-emerald-500" : "text-rose-400"
                      }`}
                    >
                      {s.trend}
                    </span>
                    <span className="text-[7px] text-muted-foreground/60 font-mono">
                      {s.trendLabel}
                    </span>
                  </div>
                </div>

                {/* Micro Sparkline */}
                <div className="w-11 h-6 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 48 24" aria-hidden="true">
                    <motion.path
                      d={
                        i === 0
                          ? "M 0 18 L 16 11 L 32 14 L 48 4"
                          : "M 0 4 L 16 12 L 32 8 L 48 18"
                      }
                      fill="none"
                      stroke="currentColor"
                      className="text-blue-500 dark:text-blue-400"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: "easeOut" }}
                    />
                    {(i === 0
                      ? [
                          { x: 0, y: 18 },
                          { x: 16, y: 11 },
                          { x: 32, y: 14 },
                          { x: 48, y: 4 },
                        ]
                      : [
                          { x: 0, y: 4 },
                          { x: 16, y: 12 },
                          { x: 32, y: 8 },
                          { x: 48, y: 18 },
                        ]
                    ).map((pt, idx) => (
                      <motion.circle
                        key={idx}
                        cx={pt.x}
                        cy={pt.y}
                        r="1.5"
                        className="fill-background stroke-blue-500 dark:stroke-blue-400"
                        strokeWidth="1"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 + idx * 0.08, duration: 0.25 }}
                      />
                    ))}
                  </svg>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* 7-Day Bar chart representing weekly problem solved distribution */}
      <div className="flex-1 flex items-end gap-2 px-0.5 min-h-[85px]">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 h-full rounded-lg dark:bg-neutral-950/80 border border-border/70 dark:border-border/30 relative overflow-hidden bg-muted/10 text-border/40 dark:text-border/20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 5px, currentColor 5px, currentColor 6px)",
            }}
          >
            {/* Animated Solid Filled Bar with glowing bevel */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-blue-600 dark:bg-blue-500 border-t border-x border-blue-400/80 shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.7),0_1px_3px_rgba(59,130,246,0.3)] rounded-t-[7px]"
              initial={{ height: "0%" }}
              animate={{
                height: [
                  `${h}%`,
                  `${Math.min(95, h + 14)}%`,
                  `${Math.max(12, h - 18)}%`,
                  `${Math.min(90, h + 8)}%`,
                  `${h}%`,
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 3.2 + (i % 3) * 0.7,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          </div>
        ))}
      </div>

      {/* X Day Labels */}
      <div className="flex gap-2 px-0.5">
        {days.map((d, i) => (
          <p
            key={i}
            className="flex-1 text-center text-[7.5px] text-muted-foreground font-mono font-medium"
          >
            {d}
          </p>
        ))}
      </div>
    </div>
  );
}

export default ProblemAnalyticsCard;
