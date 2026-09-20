"use client";

import * as React from "react";

export type TypewriterPhase =
  | "idle"
  | "typing"
  | "holding"
  | "deleting"
  | "waiting";

export interface UseTypewriterOptions {
  /** ms per typed character. */
  typeMs?: number;
  /** ms per deleted character. */
  deleteMs?: number;
  /** ms the finished phrase stays on screen. */
  holdMs?: number;
  /** ms of empty pause between phrases. */
  gapMs?: number;
  /** ms before the first phrase starts. */
  startDelayMs?: number;
  /** Pause the animation (e.g. while offscreen). */
  enabled?: boolean;
  /** Humanize typing speed with a little randomness. */
  jitter?: boolean;
}

export function usePrefersReducedMotion() {
  const subscribe = React.useCallback((callback: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
  }, []);

  const getSnapshot = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  const getServerSnapshot = () => false;

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Cycles through `phrases`, typing each in, holding it, then deleting it.
 * Respects prefers-reduced-motion (shows the first phrase statically).
 */
export function useTypewriter(
  phrases: string[],
  {
    typeMs = 70,
    deleteMs = 28,
    holdMs = 1800,
    gapMs = 450,
    startDelayMs = 400,
    enabled = true,
    jitter = true,
  }: UseTypewriterOptions = {},
) {
  const [text, setText] = React.useState("");
  const [phase, setPhase] = React.useState<TypewriterPhase>("idle");
  const reduced = usePrefersReducedMotion();
  const phrasesKey = phrases.join(" ");

  React.useEffect(() => {
    if (!enabled || phrases.length === 0 || reduced) return;

    let cancelled = false;
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));
    const tick = (base: number) =>
      jitter ? base * (0.6 + Math.random() * 0.8) : base;

    (async () => {
      await sleep(startDelayMs);
      let index = 0;
      while (!cancelled) {
        const phrase = phrases[index % phrases.length];
        setPhase("typing");
        for (let i = 1; i <= phrase.length; i++) {
          if (cancelled) return;
          setText(phrase.slice(0, i));
          await sleep(tick(typeMs));
        }
        setPhase("holding");
        await sleep(holdMs);
        if (cancelled) return;
        setPhase("deleting");
        for (let i = phrase.length - 1; i >= 0; i--) {
          if (cancelled) return;
          setText(phrase.slice(0, i));
          await sleep(deleteMs);
        }
        setPhase("waiting");
        await sleep(gapMs);
        index++;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, reduced, phrasesKey, typeMs, deleteMs, holdMs, gapMs, startDelayMs, jitter, phrases]);

  const activeText = reduced && phrases.length > 0 ? (phrases[0] ?? "") : text;
  const activePhase = reduced ? ("idle" as const) : phase;

  return { text: activeText, phase: activePhase };
}
