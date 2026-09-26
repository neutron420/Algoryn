"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PenLine,
  CheckCircle2,
  Sparkles,
  Building2,
  Layers,
  ArrowRight,
} from "lucide-react";

interface DebriefRound {
  id: string;
  name: string;
  type: string;
  detail: string;
  status: "Verified" | "Optimal" | "Accepted";
}

const DEBRIEF_ROUNDS: DebriefRound[] = [
  {
    id: "r1",
    name: "Round 1: Online Assessment",
    type: "HackerRank OA",
    detail: "2 Coding Q's + 15 CS Fundamentals",
    status: "Verified",
  },
  {
    id: "r2",
    name: "Round 2: Technical DSA",
    type: "Live Interview",
    detail: "Binary Tree LCA & Graph Cycles",
    status: "Optimal",
  },
  {
    id: "r3",
    name: "Round 3: System Design",
    type: "Architecture",
    detail: "Distributed URL Shortener & Redis Cache",
    status: "Accepted",
  },
];

export function ShareExperienceCard() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % DEBRIEF_ROUNDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 select-none overflow-hidden">
      {/* ── Top Bar: Candidate Interview Header ── */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs">
            G
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-foreground truncate">
                Google • SWE (L4)
              </span>
            </div>
            <span className="text-[8px] font-mono text-muted-foreground truncate">
              On-Campus / 2026 Batch
            </span>
          </div>
        </div>

        {/* Verdict Badge */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[8px] font-mono font-semibold shrink-0"
        >
          <CheckCircle2 className="size-2.5 text-emerald-500" />
          <span>Offer Accepted</span>
        </motion.div>
      </div>

      {/* ── Middle: Interactive Round Breakdown Stepper ── */}
      <div className="flex flex-col gap-1.5 my-auto">
        {DEBRIEF_ROUNDS.map((round, idx) => {
          const isActive = idx === activeStep;

          return (
            <motion.div
              key={round.id}
              className={`rounded-xl border p-2 transition-all duration-300 ${
                isActive
                  ? "bg-card border-blue-500/60 shadow-xs ring-1 ring-blue-500/20"
                  : "bg-muted/30 border-border/50 opacity-70"
              }`}
              animate={{
                x: isActive ? 2 : 0,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
              <div className="flex items-center justify-between text-[9px] mb-0.5">
                <div className="flex items-center gap-1.5 font-mono">
                  <span
                    className={`size-1.5 rounded-full ${
                      isActive ? "bg-blue-500 animate-ping" : "bg-muted-foreground/40"
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {round.name}
                  </span>
                </div>
                <span
                  className={`text-[7.5px] font-mono font-medium px-1.5 py-0.2 rounded ${
                    isActive
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {round.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[8px] font-mono text-muted-foreground/80 pl-3">
                <span className="truncate">{round.detail}</span>
                <span className="shrink-0 text-[7px] text-muted-foreground/60">{round.type}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Bottom Action Row ── */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[8px] font-mono text-muted-foreground">
          <Sparkles className="size-3 text-amber-500" />
          <span>Real candidate debrief</span>
        </div>

        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[8.5px] font-semibold transition-all shadow-2xs group cursor-pointer">
          <PenLine className="size-2.5" />
          <span>Share Experience</span>
          <ArrowRight className="size-2.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}

export default ShareExperienceCard;
