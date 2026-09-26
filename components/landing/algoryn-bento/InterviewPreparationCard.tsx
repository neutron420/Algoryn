"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Layers,
  Code2,
  CheckCircle2,
  Target,
} from "lucide-react";

type PrepStep = "company" | "round" | "topic" | "problem" | "solved" | "verified";

const VW = 320;
const VH = 240;

interface NodeConfig {
  id: string;
  x: number;
  y: number;
  icon?: React.ElementType;
  label?: string;
  sublabel?: string;
  type: "box" | "circle";
}

const NODES: NodeConfig[] = [
  {
    id: "company",
    x: 52,
    y: 120,
    icon: Building2,
    label: "GOOGLE",
    sublabel: "Target",
    type: "box",
  },
  {
    id: "roundRouter",
    x: 125,
    y: 120,
    type: "circle",
  },
  {
    id: "topic",
    x: 198,
    y: 120,
    icon: Layers,
    label: "DSA / DP",
    sublabel: "Medium",
    type: "box",
  },
  {
    id: "problem",
    x: 275,
    y: 54,
    icon: Code2,
    label: "TWO SUM",
    sublabel: "#1 LeetCode",
    type: "box",
  },
  {
    id: "solved",
    x: 275,
    y: 186,
    icon: CheckCircle2,
    label: "SOLVED",
    sublabel: "100% Passed",
    type: "box",
  },
];

interface FlowPath {
  id: string;
  d: string;
  activeSteps: PrepStep[];
  colorClass: string;
}

const PATHS: FlowPath[] = [
  {
    id: "company-to-router",
    d: "M 80 120 L 113 120",
    activeSteps: ["company", "round"],
    colorClass: "text-blue-500 dark:text-blue-400",
  },
  {
    id: "router-to-topic",
    d: "M 137 120 L 170 120",
    activeSteps: ["topic"],
    colorClass: "text-indigo-500 dark:text-indigo-400",
  },
  {
    id: "topic-to-problem",
    d: "M 198 92 L 198 54 L 247 54",
    activeSteps: ["problem"],
    colorClass: "text-cyan-500 dark:text-cyan-400",
  },
  {
    id: "topic-to-solved",
    d: "M 198 148 L 198 186 L 247 186",
    activeSteps: ["solved", "verified"],
    colorClass: "text-emerald-500 dark:text-emerald-400",
  },
  {
    id: "verified-loop",
    d: "M 170 120 L 137 120",
    activeSteps: ["verified"],
    colorClass: "text-emerald-500 dark:text-emerald-400",
  },
];

const NODE_COLORS: Record<
  string,
  { bg: string; border: string; text: string; buttonBg: string; buttonBorder: string }
> = {
  company: {
    bg: "bg-blue-500/10 dark:bg-blue-500/5",
    border: "border-blue-500/60 dark:border-blue-400/50",
    text: "text-blue-600 dark:text-blue-400",
    buttonBg: "bg-gradient-to-b from-blue-500 to-blue-600",
    buttonBorder: "border-blue-600",
  },
  roundRouter: {
    bg: "bg-amber-500/10 dark:bg-amber-500/5",
    border: "border-amber-500/60 dark:border-amber-400/50",
    text: "text-amber-600 dark:text-amber-400",
    buttonBg: "bg-amber-500",
    buttonBorder: "border-amber-600",
  },
  topic: {
    bg: "bg-indigo-500/10 dark:bg-indigo-500/5",
    border: "border-indigo-500/60 dark:border-indigo-400/50",
    text: "text-indigo-600 dark:text-indigo-400",
    buttonBg: "bg-gradient-to-b from-indigo-500 to-indigo-600",
    buttonBorder: "border-indigo-600",
  },
  problem: {
    bg: "bg-cyan-500/10 dark:bg-cyan-500/5",
    border: "border-cyan-500/60 dark:border-cyan-400/50",
    text: "text-cyan-600 dark:text-cyan-400",
    buttonBg: "bg-gradient-to-b from-cyan-500 to-cyan-600",
    buttonBorder: "border-cyan-600",
  },
  solved: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/5",
    border: "border-emerald-500/60 dark:border-emerald-400/50",
    text: "text-emerald-600 dark:text-emerald-400",
    buttonBg: "bg-gradient-to-b from-emerald-500 to-emerald-600",
    buttonBorder: "border-emerald-600",
  },
};

export function InterviewPreparationCard() {
  const [step, setStep] = useState<PrepStep>("company");

  useEffect(() => {
    const steps: PrepStep[] = ["company", "round", "topic", "problem", "solved", "verified"];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % steps.length;
      setStep(steps[idx]);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const isNodeActive = (nodeId: string) => {
    switch (step) {
      case "company":
        return nodeId === "company";
      case "round":
        return nodeId === "roundRouter";
      case "topic":
        return nodeId === "topic";
      case "problem":
        return nodeId === "topic" || nodeId === "problem";
      case "solved":
        return nodeId === "problem" || nodeId === "solved";
      case "verified":
        return nodeId === "solved" || nodeId === "company" || nodeId === "roundRouter";
      default:
        return false;
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden select-none bg-neutral-50 dark:bg-neutral-950/80 rounded-xl flex items-center justify-center p-2">
      {/* ── Layer 1: Clean dotted grid ── */}
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <pattern id="algoryn-prep-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle
              cx="1.5"
              cy="1.5"
              r="0.75"
              fill="currentColor"
              className="text-zinc-200 dark:text-zinc-800/60"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#algoryn-prep-grid)" />
      </svg>

      {/* ── Layer 2: Connector SVG & Nodes ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Base Static Connection Paths */}
        <path
          d="M 80 120 L 113 120"
          fill="none"
          stroke="currentColor"
          className="text-zinc-200 dark:text-zinc-800/80"
          strokeWidth="1"
        />
        <path
          d="M 137 120 L 170 120"
          fill="none"
          stroke="currentColor"
          className="text-zinc-200 dark:text-zinc-800/80"
          strokeWidth="1"
        />
        <path
          d="M 198 92 L 198 54 L 247 54"
          fill="none"
          stroke="currentColor"
          className="text-zinc-200 dark:text-zinc-800/80"
          strokeWidth="1"
        />
        <path
          d="M 198 148 L 198 186 L 247 186"
          fill="none"
          stroke="currentColor"
          className="text-zinc-200 dark:text-zinc-800/80"
          strokeWidth="1"
        />

        {/* Animated Flow Overlays */}
        {PATHS.map((p) => {
          const isActive = p.activeSteps.includes(step);
          if (!isActive) return null;

          return (
            <g key={p.id}>
              {/* Outer soft glow stroke */}
              <motion.path
                d={p.d}
                fill="none"
                stroke="currentColor"
                className={p.colorClass}
                strokeWidth="3.5"
                strokeOpacity="0.25"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              {/* Sharp solid flowing stroke */}
              <motion.path
                d={p.d}
                fill="none"
                stroke="currentColor"
                className={p.colorClass}
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </g>
          );
        })}

        {/* ForeignObjects for Nodes */}
        {NODES.map((node) => {
          const isBox = node.type === "box";
          const w = isBox ? 56 : 24;
          const h = isBox ? 56 : 24;
          const isActive = isNodeActive(node.id);
          const colorStyles = NODE_COLORS[node.id];

          return (
            <foreignObject
              key={node.id}
              x={node.x - w / 2}
              y={node.y - h / 2}
              width={w}
              height={h}
              className="overflow-visible"
            >
              <div className="w-full h-full flex items-center justify-center">
                {isBox && node.icon ? (
                  <motion.div
                    animate={{
                      scale: isActive ? 1.06 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`w-full h-full rounded-[14px] border flex flex-col items-center justify-center text-white transition-all duration-300 ${
                      colorStyles.buttonBg
                    } ${colorStyles.buttonBorder} ${
                      isActive
                        ? "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_0_12px_rgba(59,130,246,0.35)]"
                        : "opacity-85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_1px_2px_rgba(0,0,0,0.08)]"
                    }`}
                  >
                    <div className="mb-0.5 flex items-center justify-center">
                      <node.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-mono font-bold tracking-tight select-none leading-none">
                      {node.label}
                    </span>
                    <span className="text-[6.5px] font-mono text-white/80 select-none mt-0.5 leading-none">
                      {node.sublabel}
                    </span>
                  </motion.div>
                ) : (
                  /* Central Round Router Node */
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-xs transition-all duration-300 ${
                      isActive
                        ? "bg-amber-500/20 border-amber-500/80 ring-2 ring-amber-500/20"
                        : "bg-background/90 border-zinc-300 dark:border-zinc-800"
                    }`}
                    title="Round Selector"
                  >
                    <Target
                      className={`w-3 h-3 transition-colors ${
                        isActive ? "text-amber-500 animate-spin" : "text-zinc-400 dark:text-zinc-600"
                      }`}
                      style={{ animationDuration: "6s" }}
                    />
                  </div>
                )}
              </div>
            </foreignObject>
          );
        })}
      </svg>

      {/* Subtle Step Status Indicator */}
      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[7.5px] sm:text-[8px] font-mono text-muted-foreground gap-2">
        <span className="flex items-center gap-1.5 truncate min-w-0">
          <span className="size-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
          <span className="truncate">Flow: Company → Topic → Solved</span>
        </span>
        <span className="uppercase text-[7.5px] tracking-wider font-semibold text-primary/80 shrink-0">
          Step: {step}
        </span>
      </div>
    </div>
  );
}

export default InterviewPreparationCard;
