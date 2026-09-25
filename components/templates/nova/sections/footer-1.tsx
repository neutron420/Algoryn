import Link from 'next/link';
import { ArrowUpRight, Mail } from 'lucide-react';
import { FaDiscord, FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { description, owner } from '@/app/layout.config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-12 overflow-hidden bg-background">
      {/* Background Scenic Landscape Image & Overlay */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <img
          alt="Algoryn Landscape"
          src="/footer-bg.jpg"
          className="size-full object-cover"
        />
        {/* Subtle backdrop overlay for theme compatibility */}
        <div className="absolute inset-0 bg-background/25 dark:bg-background/70 backdrop-blur-[1px]" />
      </div>

      {/* Top CTA Banner */}
      <div className="relative px-6 pt-24 pb-28 text-center md:pt-32 md:pb-36 lg:px-8">
        <h2 className="mx-auto max-w-3xl text-balance font-serif font-bold text-4xl text-zinc-950 sm:text-5xl md:text-6xl lg:text-7xl dark:text-zinc-50 tracking-tight drop-shadow-xs">
          Stop struggling with coding interviews.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-balance text-base font-medium text-zinc-800 sm:text-lg dark:text-zinc-200">
          Practice questions company-wise, master real interview patterns, and crack your dream tech offer.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-zinc-950 px-8 py-3.5 text-sm font-semibold text-zinc-50 shadow-2xl transition-all duration-200 hover:scale-105 hover:bg-zinc-800 active:scale-95 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Start Practicing Free
        </Link>
      </div>

      {/* Floating Card Container */}
      <div className="relative px-4 pb-6 sm:px-6 md:pb-10 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-zinc-200/90 bg-white/95 p-8 shadow-2xl backdrop-blur-md md:p-12 dark:border-border/80 dark:bg-card/95">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 md:grid-cols-12 md:gap-x-12">
            {/* Brand Column */}
            <div className="sm:col-span-2 md:col-span-4">
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <img
                  src="/logos/algorynlog.png"
                  alt="Algoryn"
                  className="size-11 object-contain transition-transform group-hover:scale-105"
                />
                <span className="font-bold text-2xl text-foreground tracking-tight">
                  {owner}
                </span>
              </Link>
              <p className="mt-5 max-w-xs text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>

              {/* Email Pill Button */}
              <a
                href="mailto:support@algoryn.com"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 font-medium text-foreground text-xs shadow-xs transition-shadow hover:shadow"
              >
                <Mail className="size-3.5 text-muted-foreground" />
                <span>support@algoryn.com</span>
              </a>

              {/* Social Icons Row */}
              <div className="mt-6 flex gap-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground/70 shadow-xs transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  <FaGithub className="size-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground/70 shadow-xs transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  <FaLinkedinIn className="size-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground/70 shadow-xs transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  <FaXTwitter className="size-4" />
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                  className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground/70 shadow-xs transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  <FaDiscord className="size-4" />
                </a>
              </div>
            </div>

            {/* Column 1: Platform & Company */}
            <div className="space-y-10 md:col-span-2">
              <div>
                <h4 className="font-semibold text-foreground text-sm">Platform</h4>
                <ul className="mt-5 space-y-3">
                  <li>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Problems</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/interview-experiences"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Debriefs</span>
                      <span className="inline-flex items-center rounded-full bg-blue-500 px-1.5 py-px font-medium text-[10px] text-white leading-none">
                        New
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#pricing"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Pricing</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/discussions"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Discussions</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/leaderboard"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Leaderboard</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground text-sm">Company</h4>
                <ul className="mt-5 space-y-3">
                  <li>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>About Us</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/guides"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Roadmaps</span>
                      <span className="inline-flex items-center rounded-full bg-blue-500 px-1.5 py-px font-medium text-[10px] text-white leading-none">
                        New
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#features"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Features</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Contact Support</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2: DSA Topics & Algoryn for */}
            <div className="space-y-10 md:col-span-2">
              <div>
                <h4 className="font-semibold text-foreground text-sm">Topics</h4>
                <ul className="mt-5 space-y-3">
                  <li>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Arrays & Hashing</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Dynamic Programming</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Trees & Graphs</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Binary Search</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>System Design</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Sliding Window</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground text-sm">Algoryn for</h4>
                <ul className="mt-5 space-y-3">
                  <li>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>College Students</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>SDE Aspirants</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>FAANG Candidates</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Experienced Devs</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 3: Platforms / Integrations */}
            <div className="space-y-10 md:col-span-2">
              <div>
                <h4 className="font-semibold text-foreground text-sm">Platforms</h4>
                <ul className="mt-5 space-y-3">
                  <li>
                    <a
                      href="https://leetcode.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>LeetCode</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://codeforces.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Codeforces</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://codechef.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>CodeChef</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://cses.fi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>CSES Set</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://atcoder.jp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>AtCoder</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://hackerrank.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>HackerRank</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>GitHub Sync</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 4: Resources & Compare */}
            <div className="space-y-10 md:col-span-2">
              <div>
                <h4 className="font-semibold text-foreground text-sm">Resources</h4>
                <ul className="mt-5 space-y-3">
                  <li>
                    <Link
                      href="/guides"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Documentation</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Help Center</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/guides"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>API Reference</span>
                      <ArrowUpRight className="size-3.5 opacity-70" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>System Status</span>
                      <ArrowUpRight className="size-3.5 opacity-70" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/guides"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Tutorials</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Topic Sheets</span>
                      <span className="inline-flex items-center rounded-full bg-blue-500 px-1.5 py-px font-medium text-[10px] text-white leading-none">
                        New
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/discussions"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>Community</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground text-sm">Compare</h4>
                <ul className="mt-5 space-y-3">
                  <li>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>vs LeetCode</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>vs NeetCode</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>vs Striver Sheet</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      <span>vs InterviewBit</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Separator Line */}
          <div className="my-8 h-px w-full bg-border" />

          {/* Bottom Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground text-sm">
              &copy; {currentYear} {owner}. All rights reserved.
            </span>
            <div className="flex gap-6 text-sm">
              <Link
                href="/terms"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
