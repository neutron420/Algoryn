"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Info, Sparkles } from "lucide-react";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export interface GoogleAdBannerProps {
  /** AdSense Publisher ID (defaults to ca-pub-7449708956977518) */
  client?: string;
  /** Ad unit slot ID from AdSense dashboard (optional) */
  slot?: string;
  /** Format of the ad: auto, rectangle, vertical, horizontal, fluid */
  format?: "auto" | "rectangle" | "vertical" | "horizontal" | "fluid";
  /** Full width responsive sizing */
  responsive?: boolean;
  /** In-feed or multiplex layout key (optional) */
  layoutKey?: string;
  /** Additional custom class names */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** Show the TakeUForward-style "Google Ads" header bar (default: true) */
  label?: boolean;
  /** Minimum container height to prevent layout shift */
  minHeight?: number | string;
}

export function GoogleAdBanner({
  client = "ca-pub-7449708956977518",
  slot,
  format = "auto",
  responsive = true,
  layoutKey,
  className,
  style,
  label = true,
  minHeight = 280,
}: GoogleAdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isPushedRef = useRef(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const el = adRef.current;
    if (!el) return;

    const pushAd = () => {
      if (
        isPushedRef.current ||
        !el ||
        el.offsetWidth === 0 ||
        el.getAttribute("data-adsbygoogle-status") ||
        el.innerHTML.trim().length > 0
      ) {
        return;
      }

      try {
        if (typeof window !== "undefined") {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          isPushedRef.current = true;
        }
      } catch (err) {
        console.warn("Google AdSense load warning:", err);
      }
    };

    // Small delay to allow DOM & styles to compute
    const timer = setTimeout(pushAd, 150);

    // Watch for visibility/width change (e.g. responsive breakpoints)
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && !isPushedRef.current) {
            pushAd();
          }
        }
      });
      observer.observe(el);
    }

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [isClient, slot, format]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/70 bg-card p-3 shadow-2xs transition-all",
        className
      )}
      style={{ minHeight, ...style }}
    >
      {/* TakeUForward-style Header Bar */}
      {label && (
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 text-[11px] font-medium text-muted-foreground select-none">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground/80 tracking-tight">Google Ads</span>
          </div>
          <a
            href="https://support.google.com/adsense/answer/163837"
            target="_blank"
            rel="noopener noreferrer"
            title="About Google Ads"
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
          >
            <Info className="size-3" />
          </a>
        </div>
      )}

      {/* Ad Container */}
      <div className="relative w-full overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
        <ins
          ref={adRef}
          className="adsbygoogle block w-full"
          style={{ display: "block" }}
          data-ad-client={client}
          {...(slot ? { "data-ad-slot": slot } : {})}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
          {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
        />
      </div>
    </div>
  );
}

export default GoogleAdBanner;
