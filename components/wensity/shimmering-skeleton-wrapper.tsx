"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════════
 *  ShimmeringSkeletonWrapper
 *  ───────────────────────────────────────────────────────────────────────
 *  How premium skeletons actually work (Vercel, Linear, GitHub):
 *
 *    • Each placeholder box paints its OWN slowly-moving gradient via
 *      `background-position`. The shimmer therefore only appears ON the
 *      placeholder geometry — never on the gaps between boxes. (The old
 *      overlay-sweep approach made it look like an unrelated white
 *      highlight gliding across the entire card, which is why earlier
 *      attempts felt "off".)
 *    • The wrapper itself is purely a context provider — it owns the
 *      `loading` flag, the speed, and the colour tokens so every box in
 *      the same wrapper sweeps in lockstep.
 *    • One CSS keyframe (`wensity-shimmer-bg`) shifts the gradient
 *      `background-position` from 200% to -200% — composited on the
 *      box's own paint surface, never inflating layout.
 *
 *  GPU contract: animates only `background-position`, which is composited
 *  on the same layer as the box's existing background — zero layout, zero
 *  paint of surrounding geometry.
 * ════════════════════════════════════════════════════════════════════════ */

type Ctx = {
  loading: boolean;
  reduce: boolean;
  duration: number; // seconds
  highlight: string;
  base: string;
};

const SkeletonCtx = React.createContext<Ctx | null>(null);

export function useSkeletonCtx(): Ctx {
  // Sensible defaults so primitives can be used standalone too.
  return (
    React.useContext(SkeletonCtx) ?? {
      loading: true,
      reduce: false,
      duration: 1.6,
      highlight: "var(--shimmer-hi)",
      base: "var(--shimmer-base)",
    }
  );
}

export interface ShimmeringSkeletonWrapperProps {
  children: React.ReactNode;
  /** Show the skeleton state. When `false`, renders children with no shimmer. */
  loading?: boolean;
  /** Sweep cycle duration in seconds. Premium feel = slow. Default 1.6s. */
  duration?: number;
  /** Highlight colour of the moving slice. */
  highlight?: string;
  /** Resting colour of each placeholder box. */
  base?: string;
  /** Optional border-radius applied to the wrapper itself. */
  rounded?: string;
  className?: string;
}

export function ShimmeringSkeletonWrapper({
  children,
  loading = true,
  duration = 1.6,
  highlight,
  base,
  rounded,
  className,
}: ShimmeringSkeletonWrapperProps) {
  const reduce = useReducedMotion() ?? false;

  const ctx: Ctx = React.useMemo(
    () => ({
      loading,
      reduce,
      duration,
      highlight: highlight ?? "var(--shimmer-hi)",
      base: base ?? "var(--shimmer-base)",
    }),
    [loading, reduce, duration, highlight, base]
  );

  return (
    <SkeletonCtx.Provider value={ctx}>
      <div
        aria-busy={loading || undefined}
        aria-live={loading ? "polite" : undefined}
        className={cn(
          "relative",
          // Theme-aware tokens. Light = warm slate; dark = soft white-on-black.
          "[--shimmer-base:rgb(228_228_231/0.9)] [--shimmer-hi:rgb(244_244_245/1)]",
          "dark:[--shimmer-base:rgb(255_255_255/0.045)] dark:[--shimmer-hi:rgb(255_255_255/0.10)]",
          rounded,
          className
        )}
      >
        {children}
      </div>
    </SkeletonCtx.Provider>
  );
}

/* ───────────────── Skeleton primitives ───────────────── */

export interface SkeletonShellProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  /** Per-box stagger in milliseconds for cascading shimmer. Default 0. */
  delay?: number;
  style?: React.CSSProperties;
}

export function SkeletonShell({
  className,
  width,
  height,
  radius = 10,
  delay = 0,
  style,
}: SkeletonShellProps) {
  const { loading, reduce, duration, highlight, base } = useSkeletonCtx();

  const r = typeof radius === "number" ? `${radius}px` : radius;

  if (!loading) {
    return (
      <div
        className={className}
        style={{ width, height, borderRadius: r, ...style }}
      />
    );
  }

  // Resting fill is the base colour; the moving gradient lives ON the box.
  const bgImage = `linear-gradient(90deg, ${base} 0%, ${base} 35%, ${highlight} 50%, ${base} 65%, ${base} 100%)`;

  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius: r,
        backgroundColor: base,
        backgroundImage: reduce ? undefined : bgImage,
        backgroundSize: "200% 100%",
        backgroundRepeat: "no-repeat",
        animation: reduce
          ? undefined
          : `wensity-shimmer-bg ${duration}s linear infinite`,
        animationDelay: reduce ? undefined : `${delay}ms`,
        willChange: "background-position",
        ...style,
      }}
    />
  );
}

export interface SkeletonBoxProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  delay?: number;
  style?: React.CSSProperties;
}

export function SkeletonBox(props: SkeletonBoxProps) {
  return <SkeletonShell {...props} />;
}

export interface SkeletonLineProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  delay?: number;
  style?: React.CSSProperties;
}

export function SkeletonLine({
  className,
  width = "100%",
  height = 12,
  delay = 0,
  style,
}: SkeletonLineProps) {
  return (
    <SkeletonShell
      className={className}
      width={width}
      height={height}
      radius={9999}
      delay={delay}
      style={style}
    />
  );
}

export interface SkeletonCircleProps {
  className?: string;
  size?: number | string;
  delay?: number;
  style?: React.CSSProperties;
}

export function SkeletonCircle({
  className,
  size = 40,
  delay = 0,
  style,
}: SkeletonCircleProps) {
  return (
    <SkeletonShell
      className={className}
      width={size}
      height={size}
      radius="9999px"
      delay={delay}
      style={style}
    />
  );
}
