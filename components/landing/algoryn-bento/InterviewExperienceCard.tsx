"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, CircleDot, Clock, Building2 } from "lucide-react";

interface InterviewLog {
  company: string;
  round: string;
  topic: string;
  status: "completed" | "in-progress" | "pending";
  t: string;
}

const STATUS_ICONS: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; gradient: string; border: string }
> = {
  completed: {
    icon: Check,
    color: "text-emerald-500",
    bg: "bg-emerald-500/15",
    gradient: "bg-gradient-to-b from-emerald-400 to-emerald-600",
    border: "border-emerald-600",
  },
  "in-progress": {
    icon: CircleDot,
    color: "text-blue-500",
    bg: "bg-blue-500/15",
    gradient: "bg-gradient-to-b from-blue-400 to-blue-600",
    border: "border-blue-600",
  },
  pending: {
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/15",
    gradient: "bg-gradient-to-b from-amber-400 to-amber-600",
    border: "border-amber-600",
  },
};

export function InterviewExperienceCard() {
  const experiences: InterviewLog[] = [
    {
      company: "Google",
      round: "Technical Round",
      topic: "Arrays & Dynamic Programming",
      status: "completed",
      t: "45m",
    },
    {
      company: "Amazon",
      round: "Online Assessment",
      topic: "Graphs + SQL Optimization",
      status: "completed",
      t: "60m",
    },
    {
      company: "Microsoft",
      round: "System Design",
      topic: "Distributed URL Shortener",
      status: "in-progress",
      t: "45m",
    },
    {
      company: "Meta",
      round: "Behavioral",
      topic: "Project Ownership & Conflict",
      status: "completed",
      t: "30m",
    },
    {
      company: "Uber",
      round: "Machine Coding",
      topic: "Concurrency & Rate Limiting",
      status: "pending",
      t: "Queued",
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % experiences.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [experiences.length]);

  // Signed slot: 0 = front active card, negative = above, positive = below
  const getSlot = (i: number) => {
    const N = experiences.length;
    let rel = i - activeIdx;
    if (rel > Math.floor(N / 2)) rel -= N;
    if (rel < -Math.floor(N / 2)) rel += N;
    return rel;
  };

  const Y: Record<string, number> = { "-2": -66, "-1": -36, "0": 0, "1": 36, "2": 66 };

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden select-none p-2">
      {experiences.map((exp, i) => {
        const slot = getSlot(i);
        const si = STATUS_ICONS[exp.status];
        const abs = Math.abs(slot);
        const isActive = slot === 0;
        const isVisible = abs <= 2;

        const yOffset = Y[String(slot)] ?? (slot < 0 ? -140 : 140);
        const scale = isActive ? 1 : abs === 1 ? 0.93 : 0.86;
        const opacity = isActive ? 1 : abs === 1 ? 0.65 : 0.35;
        const zIndex = isActive ? 30 : abs === 1 ? 20 : 10;
        const Icon = si.icon;

        return (
          <motion.div
            key={exp.company + exp.round}
            className="absolute left-2 right-2 mx-auto"
            style={{ zIndex }}
            animate={{
              y: isVisible ? yOffset : slot < 0 ? -150 : 150,
              scale,
              opacity: isVisible ? opacity : 0,
            }}
            transition={{
              y: { type: "spring", stiffness: 450, damping: 35 },
              scale: { type: "spring", stiffness: 450, damping: 35 },
              opacity: { duration: 0.25, ease: "easeOut" },
            }}
          >
            <div
              className={`w-full rounded-2xl border flex items-center gap-2.5 transition-all ${
                isActive
                  ? "px-3 py-2 bg-card border-border shadow-xs"
                  : "px-2.5 py-1.5 bg-muted/40 border-border/50"
              }`}
            >
              {/* Status 3D icon badge */}
              <div
                className={`shrink-0 rounded-[8px] flex items-center justify-center font-bold text-white transition-all duration-300 ${
                  si.gradient
                } border ${si.border} shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.1)] ${
                  isActive ? "size-7" : "size-5"
                }`}
              >
                <Icon
                  className={`${isActive ? "size-3.5" : "size-2.5"} ${
                    exp.status === "in-progress" ? "animate-pulse" : ""
                  }`}
                />
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`font-semibold text-foreground leading-none shrink-0 ${
                      isActive ? "text-[10.5px] sm:text-[11px]" : "text-[9px] sm:text-[9.5px]"
                    }`}
                  >
                    {exp.company}
                  </span>
                  <span className="text-[8.5px] sm:text-[9px] text-muted-foreground font-mono truncate min-w-0">
                    • {exp.round}
                  </span>
                  <span
                    className={`font-mono uppercase tracking-wide rounded px-1.5 py-0.5 leading-none ml-auto shrink-0 ${
                      si.bg
                    } ${si.color} ${isActive ? "text-[7.5px]" : "text-[6.5px]"}`}
                  >
                    {exp.status}
                  </span>
                </div>
                {isActive && (
                  <p className="text-[9px] text-muted-foreground truncate mt-1 leading-tight flex items-center gap-1">
                    <span className="text-foreground/75 font-medium">{exp.topic}</span>
                  </p>
                )}
              </div>

              {isActive && (
                <span className="text-[8.5px] font-mono text-muted-foreground/70 shrink-0 bg-muted/60 px-1.5 py-0.5 rounded">
                  {exp.t}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Progress Dots */}
      <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
        {experiences.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full bg-foreground/25"
            animate={{
              width: i === activeIdx ? 14 : 4,
              opacity: i === activeIdx ? 0.75 : 0.2,
            }}
            style={{ height: 3 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>
    </div>
  );
}

export default InterviewExperienceCard;
