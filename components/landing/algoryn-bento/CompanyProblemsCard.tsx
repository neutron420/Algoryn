"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CompanyItem {
  name: string;
  problems: number;
  fill: number;
  initial: string;
  gradient: string;
  badge: string;
  dot: string;
  buttonBg: string;
  buttonBorder: string;
}

const COMPANIES: CompanyItem[] = [
  {
    name: "Google",
    problems: 142,
    fill: 88,
    initial: "G",
    gradient: "from-blue-500 to-cyan-400",
    badge: "bg-blue-500/15 text-blue-500 dark:text-blue-400",
    dot: "bg-blue-500",
    buttonBg: "bg-blue-600",
    buttonBorder: "border-blue-700",
  },
  {
    name: "Amazon",
    problems: 128,
    fill: 76,
    initial: "A",
    gradient: "from-amber-500 to-orange-400",
    badge: "bg-amber-500/15 text-amber-500 dark:text-amber-400",
    dot: "bg-amber-500",
    buttonBg: "bg-amber-600",
    buttonBorder: "border-amber-700",
  },
  {
    name: "Meta",
    problems: 96,
    fill: 60,
    initial: "M",
    gradient: "from-indigo-500 to-sky-400",
    badge: "bg-indigo-500/15 text-indigo-500 dark:text-indigo-400",
    dot: "bg-indigo-500",
    buttonBg: "bg-indigo-600",
    buttonBorder: "border-indigo-700",
  },
  {
    name: "Microsoft",
    problems: 84,
    fill: 52,
    initial: "MS",
    gradient: "from-emerald-500 to-teal-400",
    badge: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400",
    dot: "bg-emerald-500",
    buttonBg: "bg-emerald-600",
    buttonBorder: "border-emerald-700",
  },
];

interface ProblemLogItem {
  company: string;
  title: string;
  meta: string;
  t: string;
}

const RECENT_PROBLEMS: ProblemLogItem[] = [
  { company: "Google", title: "Two Sum", meta: "Easy · OA", t: "0.2s" },
  { company: "Amazon", title: "LRU Cache", meta: "Medium · Round 1", t: "1.1s" },
  { company: "Meta", title: "Binary Tree Max Path", meta: "Hard · Round 2", t: "2.4s" },
  { company: "Microsoft", title: "Design URL Shortener", meta: "System Design", t: "3.8s" },
  { company: "Google", title: "Median of Two Sorted Arrays", meta: "Hard · DSA", t: "5.1s" },
  { company: "Amazon", title: "Word Break II", meta: "Hard · Round 2", t: "6.8s" },
];

export function CompanyProblemsCard() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => (prev + 1) % RECENT_PROBLEMS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const activeProblem = RECENT_PROBLEMS[tick];
  const activeCompany = activeProblem.company;
  const activeCompConfig =
    COMPANIES.find((c) => c.name.toLowerCase() === activeCompany.toLowerCase()) ??
    COMPANIES[0];

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 select-none overflow-hidden">
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
        <p className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground">
          Curated Company Banks
        </p>
        <span className="text-[8px] font-mono font-medium text-primary">
          690+ Companies
        </span>
      </div>

      {/* ── 4 Company Progress Rows ── */}
      <div className="flex flex-col gap-2 my-auto">
        {COMPANIES.map((company, i) => {
          const isActive = company.name.toLowerCase() === activeCompany.toLowerCase();

          return (
            <div key={company.name} className="flex items-center gap-2 group relative">
              {/* 3D Company Badge */}
              <div
                className={`relative flex shrink-0 items-center justify-center w-6 h-6 rounded-[8px] border transition-all duration-300 font-bold text-[9px] ${
                  isActive
                    ? `text-white ${company.buttonBg} ${company.buttonBorder} scale-105 shadow-xs`
                    : "bg-muted/40 border-border/50 text-muted-foreground"
                }`}
              >
                <span className="font-mono tracking-tight">{company.initial}</span>
              </div>

              {/* Company Name */}
              <span
                className={`text-[9.5px] font-mono w-16 shrink-0 transition-colors duration-300 truncate ${
                  isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}
              >
                {company.name}
              </span>

              {/* Progress bar track */}
              <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden relative shadow-inner">
                <motion.div
                  className={`absolute left-0 top-0 bottom-0 rounded-full overflow-hidden bg-gradient-to-r ${company.gradient}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${company.fill}%`, opacity: isActive ? 1 : 0.35 }}
                  transition={{
                    width: { duration: 1.2, delay: i * 0.1, type: "spring", bounce: 0.2 },
                    opacity: { duration: 0.4 },
                  }}
                >
                  {/* Scanning light beam effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                    />
                  )}
                </motion.div>
              </div>

              {/* Problem Count */}
              <div
                className={`flex items-center gap-1 w-12 justify-end transition-all duration-300 shrink-0 ${
                  isActive ? "opacity-100 scale-105" : "opacity-60 scale-100"
                }`}
              >
                <span
                  className={`text-[8.5px] font-mono tabular-nums ${
                    isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {company.problems}
                </span>
                {isActive && (
                  <motion.div
                    className={`w-1.5 h-1.5 rounded-full ${company.dot}`}
                    animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Active Problem Ticker Box ── */}
      <motion.div
        key={`${activeProblem.company}-${activeProblem.title}-${tick}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border/50 bg-card/90 dark:bg-neutral-950/80 p-2 my-1"
      >
        <div className="flex items-center justify-between text-[7.5px] font-mono mb-1">
          <span
            className={`font-bold uppercase px-1.5 py-0.5 rounded-md ${activeCompConfig.badge}`}
          >
            {activeProblem.company}
          </span>
          <span className="text-muted-foreground">{activeProblem.meta}</span>
          <span className="text-muted-foreground/60 tabular-nums">{activeProblem.t}</span>
        </div>
        <p className="text-[9px] font-semibold text-foreground font-mono truncate">
          {activeProblem.title}
        </p>
      </motion.div>

      {/* ── Live Beacon Footer ── */}
      <div className="flex items-center gap-2 pt-1 border-t border-border/40">
        <div className="relative flex items-center justify-center w-2 h-2">
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-400/40"
            animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
        <span className="text-[7.5px] font-mono text-muted-foreground truncate">
          Live interview frequency & timeframe sync
        </span>
      </div>
    </div>
  );
}

export default CompanyProblemsCard;
