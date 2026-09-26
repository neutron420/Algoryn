import { Metadata } from "next";
import { HeroHeader } from "@/components/templates/nova/sections/header";
import Footer from "@/components/templates/nova/sections/footer-1";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  Compass,
} from "lucide-react";
import { GoogleAdBanner } from "@/components/ads/google-ad-banner";

export const metadata: Metadata = {
  title: "Coding Interview Guides & DSA Roadmaps | Algoryn",
  description:
    "Master the top algorithmic patterns, FAANG company interview breakdown guides, and DSA study roadmaps with Algoryn's curated educational articles.",
};

const guides = [
  {
    category: "Algorithmic Patterns",
    title: "The 14 Fundamental LeetCode Patterns Every Candidate Must Know",
    readTime: "8 min read",
    desc: "Stop memorizing 500+ problems. Learn how Two Pointers, Sliding Window, Fast & Slow Pointers, and Monotonic Stacks solve 80% of technical phone screens.",
    tag: "Essential",
    highlights: ["Sliding Window", "Two Pointers", "Monotonic Stack", "Fast & Slow Pointers"],
  },
  {
    category: "Company Strategies",
    title: "Cracking the Meta (Facebook) E4/E5 Coding Interview",
    readTime: "10 min read",
    desc: "Detailed breakdown of Meta's 45-minute coding rounds: why speed is king, the most frequent graph and tree questions, and how to write bug-free solutions on CoderPad.",
    tag: "FAANG",
    highlights: ["45-min Speed Drills", "Top Graph & Tree Patterns", "Optimal Big-O Analysis"],
  },
  {
    category: "System & Complexity",
    title: "Big-O Time & Space Complexity: The Practical Interview Cheat Sheet",
    readTime: "6 min read",
    desc: "A developer's quick reference to analyzing recursive call stacks, amortized complexity, auxiliary space, and how to discuss tradeoffs with your interviewer.",
    tag: "Foundations",
    highlights: ["Recursion Stacks", "Amortized O(1)", "Space vs. Time Tradeoffs"],
  },
  {
    category: "Company Strategies",
    title: "Google Technical Interview Prep: Dealing with Ambiguous Graph Problems",
    readTime: "11 min read",
    desc: "Google interviewers love problems with multiple valid approaches. Discover how to clarify requirements, test edge cases, and implement Dijkstra / Topological Sort.",
    tag: "FAANG",
    highlights: ["Dijkstra & BFS", "Topological Sort", "Edge Case Verification"],
  },
  {
    category: "Study Roadmaps",
    title: "Zero to Offer: A 12-Week Structured Coding Interview Schedule",
    readTime: "9 min read",
    desc: "A week-by-week practice roadmap balancing Arrays, Dynamic Programming, Heap/Queue, Graphs, and Mock Interviews without burning out.",
    tag: "Roadmap",
    highlights: ["Week-by-Week Syllabus", "Spaced Repetition", "Mock Interview Routine"],
  },
  {
    category: "Dynamic Programming",
    title: "Demystifying 1D & 2D Dynamic Programming: From Memoization to Tabulation",
    readTime: "12 min read",
    desc: "A step-by-step framework to identify state transitions, base cases, and optimize memory from O(N^2) down to O(N) space.",
    tag: "Advanced",
    highlights: ["State Transition Diagrams", "Space Optimization", "Knapsack Variants"],
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <HeroHeader />

      <main className="flex-1 pt-32 pb-20 px-6 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Badge & Title */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400 text-xs font-medium mb-4">
              <BookOpen className="size-4" />
              <span>Public Study Library</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Interview Guides & DSA Roadmaps
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Comprehensive, pattern-based study guides curated by senior engineers to help you ace technical screens at Google, Meta, Amazon, and top startups.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Core Patterns", val: "14 Patterns", icon: Layers },
              { label: "Target Companies", val: "25+ Tech Giants", icon: Compass },
              { label: "Curated Problems", val: "500+ LeetCode", icon: Code2 },
              { label: "Average Time Saved", val: "60+ Hours", icon: TrendingUp },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-card/40 border border-border/70 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-xs text-center">
                  <div className="inline-flex items-center justify-center size-8 rounded-lg bg-orange-500/10 text-orange-500 mb-2">
                    <Icon className="size-4" />
                  </div>
                  <div className="text-base sm:text-lg font-bold text-foreground">{stat.val}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Articles & Guides Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {guides.map((item, idx) => (
              <article
                key={idx}
                className="group flex flex-col justify-between bg-card/40 border border-border/70 hover:border-orange-500/40 rounded-2xl p-6 backdrop-blur-sm shadow-xs transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      {item.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                      <Clock className="size-3" />
                      {item.readTime}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-orange-500 transition-colors mb-2.5 leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {item.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium bg-background/80 text-muted-foreground px-2.5 py-1 rounded-lg border border-border/50"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs font-medium text-orange-500 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    <span>Read Study Guide</span>
                    <ArrowRight className="size-3.5" />
                  </span>
                  <Link
                    href="/dashboard"
                    className="text-xs text-muted-foreground hover:text-foreground underline decoration-dotted transition-colors"
                  >
                    Practice Problems &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Deep Publisher Content Section: 14 Core Patterns Overview */}
          <section className="bg-card/40 border border-border/70 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xs mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2.5">
              <Cpu className="size-6 text-orange-500" />
              The 14 LeetCode Patterns: Quick Reference Table
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              When preparing for technical interviews, questions naturally cluster around 14 recurring patterns. Here is how to quickly recognize them during your interviews:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-2.5 font-semibold">Pattern</th>
                    <th className="py-2.5 font-semibold">Typical Keyword / Signal</th>
                    <th className="py-2.5 font-semibold">Classic Problem</th>
                    <th className="py-2.5 font-semibold">Average Complexity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-foreground/90">
                  <tr>
                    <td className="py-3 font-medium text-orange-500">Sliding Window</td>
                    <td className="py-3 text-muted-foreground">Subarrays, substrings, contiguous elements, longest/shortest</td>
                    <td className="py-3">Longest Substring Without Repeating Characters</td>
                    <td className="py-3 font-mono text-xs">O(N) time / O(K) space</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-orange-500">Two Pointers</td>
                    <td className="py-3 text-muted-foreground">Sorted array, pair sums, triplets, reversing in-place</td>
                    <td className="py-3">Two Sum II, 3Sum, Container With Most Water</td>
                    <td className="py-3 font-mono text-xs">O(N) time / O(1) space</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-orange-500">Fast & Slow Pointers</td>
                    <td className="py-3 text-muted-foreground">Linked list cycles, midpoints, loop detection</td>
                    <td className="py-3">Linked List Cycle II, Middle of Linked List</td>
                    <td className="py-3 font-mono text-xs">O(N) time / O(1) space</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-orange-500">Monotonic Stack</td>
                    <td className="py-3 text-muted-foreground">Next greater element, histogram areas, temperatures</td>
                    <td className="py-3">Daily Temperatures, Largest Rectangle in Histogram</td>
                    <td className="py-3 font-mono text-xs">O(N) time / O(N) space</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-orange-500">Top K Elements (Heap)</td>
                    <td className="py-3 text-muted-foreground">Kth largest/smallest, stream medians, frequent elements</td>
                    <td className="py-3">Top K Frequent Elements, Kth Largest in Array</td>
                    <td className="py-3 font-mono text-xs">O(N log K) time</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-orange-500">Breadth-First Search</td>
                    <td className="py-3 text-muted-foreground">Shortest path in unweighted graphs, level-order traversal</td>
                    <td className="py-3">Word Ladder, Binary Tree Level Order Traversal</td>
                    <td className="py-3 font-mono text-xs">O(V + E) time</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-orange-500">Topological Sort</td>
                    <td className="py-3 text-muted-foreground">Course prerequisites, task dependency ordering, DAGs</td>
                    <td className="py-3">Course Schedule II, Alien Dictionary</td>
                    <td className="py-3 font-mono text-xs">O(V + E) time</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Google Ads Placement */}
          <GoogleAdBanner format="horizontal" minHeight={160} className="my-8" />

          {/* Bottom Call to Action */}
          <div className="text-center p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-orange-500/10 via-background to-card border border-orange-500/20">
            <h2 className="text-2xl font-bold text-foreground mb-2">Want to Put These Patterns Into Practice?</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Launch our company problem tracker to filter problems by Google, Meta, Amazon, Apple, and track your progress.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition-all shadow-sm"
            >
              <span>Go to Practice Dashboard</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
