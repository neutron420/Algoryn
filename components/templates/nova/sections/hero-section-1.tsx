"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { TextureButton } from "@/components/ui/texture-button";
import { HeroHeader } from "./header";
import Image from "next/image";
import { LeetCode } from "../svgs/leetcode";
import { Codeforces } from "../svgs/codeforces";
import { CodeChef } from "../svgs/codechef";
import { HackerRank } from "../svgs/hackerrank";
import { AtCoder } from "../svgs/atcoder";
import { CSES } from "../svgs/cses";
import { GeeksForGeeks } from "../svgs/geeksforgeeks";
import { TopCoder } from "../svgs/topcoder";
import { ArrowUpRightIcon } from "lucide-react";
import { HighlightText } from "@/components/ui/highlight-text";
import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from "@/components/kibo-ui/announcement";

export default function HeroSection() {
  const router = useRouter();
  const { user } = useAuth();

  const handleStartPracticing = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <section className="bg-background relative">
          {/* Subtle Ambient Top Background Image & Gradient */}
          <div className="mask-radial-from-45% mask-radial-to-75% mask-radial-at-top mask-radial-[75%_100%] mask-t-from-50% lg:aspect-9/4 absolute inset-0 aspect-square lg:top-20 dark:opacity-25 dark:invert pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1740516367177-ae20098c8786?q=80&w=2268&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              width={2268}
              height={1740}
              priority
              unoptimized
              className="size-full object-cover object-top"
            />
          </div>

          {/* Hero Content Container */}
          <div className="relative z-10 pt-28 pb-16 sm:pt-36 sm:pb-20 md:pt-40 md:pb-24">
            {/* 1. Centered Header: Announcement Badge, Title, Description & CTA */}
            <div className="mx-auto max-w-4xl px-6 text-center">
              {/* Top Announcement Badges */}
              <div className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 mb-6 sm:mb-8">
                <Announcement href="/dashboard/discussions">
                  <AnnouncementTag>Latest update</AnnouncementTag>
                  <AnnouncementTitle>
                    Discussions are now live!
                    <ArrowUpRightIcon className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" size={14} />
                  </AnnouncementTitle>
                </Announcement>

                <a
                  href="https://x.com/RiteshS18572143"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-orange-300/80 hover:border-orange-500 bg-[#fffaf3] dark:bg-orange-950/20 hover:bg-[#fff4e6] text-zinc-900 dark:text-zinc-100 transition-all shadow-2xs group text-xs"
                >
                  <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 text-[11px] font-normal transition-colors leading-none">
                    Advertise with
                  </span>
                  <Image
                    src="/ritesh-avatar.png"
                    alt="Ritesh Singh"
                    width={16}
                    height={16}
                    className="size-3.5 rounded-full object-cover border border-orange-200 shrink-0"
                  />
                  <span className="text-zinc-950 dark:text-zinc-100 group-hover:text-orange-950 dark:group-hover:text-orange-300 text-[11px] font-medium transition-colors leading-none">
                    Algoryn
                  </span>
                </a>
              </div>

              <h1 className="text-balance font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal sm:font-medium tracking-[-0.035em] text-foreground leading-[1.12]">
                Crack interviews,{" "}
                <br className="hidden sm:inline" />
                <span className="text-orange-500 font-normal sm:font-medium">company by company.</span>
              </h1>
              <p className="text-muted-foreground mt-4 sm:mt-5 text-balance text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                <HighlightText variant="orange" className="opacity-80">15,000+ interview questions</HighlightText> &amp; 3,200+ DSA problems across{" "}
                <HighlightText variant="yellow" className="opacity-80">690+ companies</HighlightText>, tagged by topic.
                Tick off what you solve.
              </p>

              <div className="mt-7 sm:mt-8 flex justify-center">
                <TextureButton
                  size="lg"
                  onClick={handleStartPracticing}
                  className="shadow-md hover:shadow-lg transition-all"
                >
                  Start Practicing
                </TextureButton>
              </div>

              {/* 2. Platform Pills Row (All platforms visible, clean & modern) */}
              <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <LeetCode className="size-3.5 shrink-0" />
                  <span>LeetCode</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <Codeforces className="size-3.5 shrink-0" />
                  <span>Codeforces</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <CodeChef className="size-3.5 shrink-0" />
                  <span>CodeChef</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <HackerRank className="size-3.5 shrink-0" />
                  <span>HackerRank</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <GeeksForGeeks className="size-3.5 shrink-0" />
                  <span>GeeksForGeeks</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <AtCoder className="size-3.5 shrink-0" />
                  <span>AtCoder</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <CSES className="size-3.5 shrink-0" />
                  <span>CSES</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <TopCoder className="size-3.5 shrink-0" />
                  <span>TopCoder</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <svg viewBox="0 0 24 24" fill="none" className="size-3.5 shrink-0 rounded-xs" aria-label="CodeStudio">
                    <rect width="24" height="24" rx="5" fill="#F05A28" />
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>CodeStudio</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <svg viewBox="0 0 24 24" fill="none" className="size-3.5 shrink-0 rounded-xs" aria-label="HackerEarth">
                    <rect width="24" height="24" rx="5" fill="#2C3454" />
                    <path d="M7 6v12M17 6v12M7 12h10" stroke="#32C5FF" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <span>HackerEarth</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 hover:border-border transition-colors text-foreground/85 text-[11.5px] font-medium shadow-2xs">
                  <svg viewBox="0 0 24 24" fill="none" className="size-3.5 shrink-0 rounded-xs" aria-label="InterviewBit">
                    <rect width="24" height="24" rx="5" fill="#009688" />
                    <path d="M8 7v10M13 7h3a2.5 2.5 0 0 1 0 5H13v5h3a2.5 2.5 0 0 0 0-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>InterviewBit</span>
                </div>
              </div>
            </div>

            {/* 3. LARGE PRODUCT SHOWCASE WITH TECHNICAL DASHED FRAME & CORNER CROSSES */}
            <div className="mt-10 sm:mt-12 md:mt-14 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
              {/* Soft Ambient Radial Glow behind the showcase */}
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -top-16 sm:-top-24 left-1/2 -translate-x-1/2 w-[70%] h-[240px] sm:h-[340px] bg-gradient-to-b from-primary/8 via-primary/3 to-transparent blur-3xl pointer-events-none -z-10 rounded-full"
                />

                {/* Outer Technical Frame: clearly visible black dashed border with 4 corner '+' cross markers */}
                <div className="relative p-3 sm:p-5 md:p-6 lg:p-7 rounded-lg sm:rounded-xl border-[1.5px] border-dashed border-zinc-900 dark:border-zinc-200 bg-zinc-900/[0.02] dark:bg-white/[0.02]">
                  {/* Corner "+" cross markers perfectly placed at the 4 dashed corner intersections */}
                  <span
                    aria-hidden="true"
                    className="absolute -top-3 -left-3 size-6 flex items-center justify-center font-mono text-base font-bold leading-none text-zinc-950 dark:text-zinc-50 bg-background select-none pointer-events-none"
                  >
                    +
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute -top-3 -right-3 size-6 flex items-center justify-center font-mono text-base font-bold leading-none text-zinc-950 dark:text-zinc-50 bg-background select-none pointer-events-none"
                  >
                    +
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-3 -left-3 size-6 flex items-center justify-center font-mono text-base font-bold leading-none text-zinc-950 dark:text-zinc-50 bg-background select-none pointer-events-none"
                  >
                    +
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-3 -right-3 size-6 flex items-center justify-center font-mono text-base font-bold leading-none text-zinc-950 dark:text-zinc-50 bg-background select-none pointer-events-none"
                  >
                    +
                  </span>

                  {/* Inner Product Screenshot Container */}
                  <div className="relative rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 flex items-center justify-center">
                    <Image
                      src="/banner1.png"
                      alt="Algoryn Company-wise Interview Platform Preview"
                      width={1024}
                      height={660}
                      priority
                      quality={95}
                      className="w-full h-auto block select-none"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1200px"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. COMPANIES & INFRASTRUCTURE BANNER (MATCHING REFERENCE SPEC) */}
            <div className="mt-12 sm:mt-16 md:mt-20 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-xs font-medium text-muted-foreground tracking-wide mb-3 sm:mb-4">
                Some of the companies &amp; infrastructure powering Algoryn
              </p>

              {/* Technical dark dashed grid container with '+' corner crosshairs */}
              <div className="relative border border-dashed border-zinc-800/90 dark:border-zinc-700/90 bg-card/60 rounded-sm">
                {/* Corner '+' cross markers (bold & dark matching reference) */}
                <span
                  aria-hidden="true"
                  className="absolute -top-2.5 -left-2.5 size-5 flex items-center justify-center font-mono text-sm font-black leading-none text-zinc-800 dark:text-zinc-200 bg-background select-none pointer-events-none"
                >
                  +
                </span>
                <span
                  aria-hidden="true"
                  className="absolute -top-2.5 -right-2.5 size-5 flex items-center justify-center font-mono text-sm font-black leading-none text-zinc-800 dark:text-zinc-200 bg-background select-none pointer-events-none"
                >
                  +
                </span>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-2.5 -left-2.5 size-5 flex items-center justify-center font-mono text-sm font-black leading-none text-zinc-800 dark:text-zinc-200 bg-background select-none pointer-events-none"
                >
                  +
                </span>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-2.5 -right-2.5 size-5 flex items-center justify-center font-mono text-sm font-black leading-none text-zinc-800 dark:text-zinc-200 bg-background select-none pointer-events-none"
                >
                  +
                </span>

                {/* 6 Partners Grid: 1 after another on mobile, 6 columns on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-dashed divide-zinc-800/90 dark:divide-zinc-700/90">
                  {/* 1. Neon DB */}
                  <a
                    href="https://neon.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-4 sm:p-5 hover:bg-muted/40 transition-colors group"
                  >
                    <div className="size-8 rounded-lg bg-white dark:bg-zinc-900 border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden p-1.5 shadow-xs">
                      <Image
                        src="/logos/neondb.png"
                        alt="Neon DB"
                        width={32}
                        height={32}
                        className="size-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-sm lg:text-[13px] font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors truncate">
                        Neon DB
                      </span>
                      <span className="text-xs lg:text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
                        Serverless Postgres
                      </span>
                    </div>
                  </a>

                  {/* 2. Upstash */}
                  <a
                    href="https://upstash.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-4 sm:p-5 hover:bg-muted/40 transition-colors group"
                  >
                    <div className="size-8 rounded-lg bg-white dark:bg-zinc-900 border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden p-1.5 shadow-xs">
                      <Image
                        src="/logos/upstash.png"
                        alt="Upstash"
                        width={32}
                        height={32}
                        className="size-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-sm lg:text-[13px] font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors truncate">
                        Upstash
                      </span>
                      <span className="text-xs lg:text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
                        Serverless Data
                      </span>
                    </div>
                  </a>

                  {/* 3. Firebase */}
                  <a
                    href="https://firebase.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-4 sm:p-5 hover:bg-muted/40 transition-colors group"
                  >
                    <div className="size-8 rounded-lg bg-white dark:bg-zinc-900 border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden p-1.5 shadow-xs">
                      <Image
                        src="/logos/firebase.svg"
                        alt="Firebase"
                        width={32}
                        height={32}
                        className="size-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-sm lg:text-[13px] font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors truncate">
                        Firebase
                      </span>
                      <span className="text-xs lg:text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
                        Auth &amp; Cloud
                      </span>
                    </div>
                  </a>

                  {/* 4. Cloudflare */}
                  <a
                    href="https://cloudflare.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-4 sm:p-5 hover:bg-muted/40 transition-colors group"
                  >
                    <div className="size-8 rounded-lg bg-white dark:bg-zinc-900 border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden p-1.5 shadow-xs">
                      <Image
                        src="/logos/cloudflare.png"
                        alt="Cloudflare"
                        width={32}
                        height={32}
                        className="size-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-sm lg:text-[13px] font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors truncate">
                        Cloudflare
                      </span>
                      <span className="text-xs lg:text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
                        Edge Network
                      </span>
                    </div>
                  </a>

                  {/* 5. Google AdSense */}
                  <a
                    href="https://adsense.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-4 sm:p-5 hover:bg-muted/40 transition-colors group"
                  >
                    <div className="size-8 rounded-lg bg-white dark:bg-zinc-900 border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden p-1.5 shadow-xs">
                      <Image
                        src="/logos/google-adsense.png"
                        alt="Google AdSense"
                        width={32}
                        height={32}
                        className="size-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-sm lg:text-[13px] font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors truncate">
                        Google AdSense
                      </span>
                      <span className="text-xs lg:text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
                        Ad Partner
                      </span>
                    </div>
                  </a>

                  {/* 6. Vercel */}
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-4 sm:p-5 hover:bg-muted/40 transition-colors group"
                  >
                    <div className="size-8 rounded-lg bg-white dark:bg-zinc-900 border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-foreground">
                        <path d="M12 2L24 22H0L12 2Z" />
                      </svg>
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-sm lg:text-[13px] font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors truncate">
                        Vercel
                      </span>
                      <span className="text-xs lg:text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
                        Edge Platform
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
