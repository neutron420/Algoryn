"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { Briefcase, CheckCheck, Database, Server, Sparkles } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { TextureButton } from "@/components/ui/texture-button";

const plans = [
  {
    name: "Starter",
    description:
      "Free forever for all developers practicing for technical coding interviews.",
    price: 0,
    buttonText: "Start Practicing Free",
    buttonVariant: "outline" as const,
    badge: "Free Forever",
    badgeVariant: "emerald" as const,
    features: [
      { text: "690+ Company Question Banks", icon: <Briefcase size={20} /> },
      { text: "15,000+ Interview Questions", icon: <Database size={20} /> },
      { text: "Live Solved Progress Sync", icon: <Server size={20} /> },
    ],
    includes: [
      "Free includes:",
      "All 690+ company interview sheets",
      "74 curated DSA topic tags & filters",
      "Real-time instant search across problems",
      "Direct links to LeetCode, Codeforces & CodeChef",
      "Target company pinning to header",
      "Personal bookmarks vault in sidebar",
    ],
  },
  {
    name: "Pro Interview",
    description:
      "Advanced AI mock interviews, company hiring analytics, and revision streaks.",
    price: 500,
    buttonText: "Get Pro Access",
    buttonVariant: "default" as const,
    badge: "Most Popular",
    badgeVariant: "orange" as const,
    popular: true,
    features: [
      { text: "AI Technical Mock Interviews", icon: <Briefcase size={20} /> },
      { text: "Hiring Trends & Frequency Analytics", icon: <Database size={20} /> },
      { text: "Spaced Repetition Flashcards", icon: <Server size={20} /> },
    ],
    includes: [
      "Everything in Starter, plus:",
      "AI simulated technical coding rounds",
      "Company hiring predictions & recency tags",
      "Weak-topic diagnostic analysis",
      "Optimal time & space complexity breakdowns",
      "Golden verified pro badge on profile",
      "Priority roadmap feature requests",
    ],
  },
  {
    name: "Campus & Teams",
    description:
      "Placement drive preparation tracks for colleges, bootcamps, and coding clubs.",
    price: 900,
    buttonText: "Get Team Access",
    buttonVariant: "outline" as const,
    badge: "For Teams",
    badgeVariant: "zinc" as const,
    features: [
      { text: "Cohort & Batch Leaderboards", icon: <Briefcase size={20} /> },
      { text: "Custom Question Contests", icon: <Database size={20} /> },
      { text: "Dedicated Mentor Support", icon: <Server size={20} /> },
    ],
    includes: [
      "Everything in Pro, plus:",
      "Batch progress tracking & leaderboards",
      "College placement drive tracks",
      "Custom company contest creator",
      "Export student performance CSV",
      "Dedicated discord mentor channel",
      "Custom role permissions & workspaces",
    ],
  },
];

export default function PricingSection5() {
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.4,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -15,
      opacity: 0,
    },
  };

  return (
    <section id="pricing" className="bg-background py-16 sm:py-24 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative" ref={pricingRef}>
        
        {/* Header Section */}
        <article className="text-left mb-8 sm:mb-12 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="size-3.5" />
            <span>Pricing Plans</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-foreground tracking-tight leading-[1.15]">
            We&apos;ve got a plan that&apos;s perfect for you
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Practice company-wise interview questions free forever. Upgrade anytime for advanced AI mocks and team analytics.
          </p>

          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-xs sm:text-sm font-medium text-muted-foreground shadow-sm">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Monthly Subscription • Cancel Anytime</span>
            </div>
          </div>
        </article>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan, index) => (
            <TimelineContent
              key={plan.name}
              as="div"
              animationNum={2 + index}
              timelineRef={pricingRef}
              customVariants={revealVariants}
            >
              <Card
                className={`relative border flex flex-col justify-between h-full rounded-2xl transition-all duration-300 ${
                  plan.popular
                    ? "ring-2 ring-orange-500 bg-orange-50/40 dark:bg-orange-950/20 border-orange-300 dark:border-orange-800 shadow-xl shadow-orange-500/10"
                    : "bg-card border-border shadow-sm hover:shadow-md"
                }`}
              >
                <CardHeader className="text-left p-6 sm:p-7 pb-4">
                  <div className="flex justify-between items-center mb-2 gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      {plan.name}
                    </h3>
                    {plan.popular ? (
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                        {plan.badge}
                      </span>
                    ) : (
                      <span className="bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full text-xs font-medium border border-border">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 min-h-[38px] leading-relaxed">
                    {plan.description}
                  </p>
                  
                  {/* Clearly Visible Price Tag with NumberFlow Animation in Rupees */}
                  <div className="flex items-baseline gap-1 py-1">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight flex items-baseline">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold mr-0.5 text-foreground">₹</span>
                      <NumberFlow
                        value={plan.price}
                        className="text-3xl sm:text-4xl md:text-5xl font-black"
                      />
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm font-medium ml-1">
                      {plan.price === 0 ? "/forever" : "/month"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-6 sm:p-7 pt-0 flex flex-col justify-between flex-grow">
                  {/* Action CTA Button */}
                  <Link href="/dashboard" className="block w-full mb-6">
                    <TextureButton
                      variant={plan.popular ? "orange" : "primary"}
                      size="lg"
                      className="w-full py-1 text-sm sm:text-base font-semibold shadow-sm"
                    >
                      {plan.buttonText}
                    </TextureButton>
                  </Link>

                  {/* Feature benefits list */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                      Included Features
                    </h4>
                    <p className="font-semibold text-xs sm:text-sm text-foreground mb-2.5">
                      {plan.includes[0]}
                    </p>
                    <ul className="space-y-2.5 font-medium">
                      {plan.includes.slice(1).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2.5">
                          <span className="size-4.5 sm:size-5 bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/40 rounded-full grid place-content-center shrink-0 mt-0.5">
                            <CheckCheck className="size-3 sm:size-3.5 text-orange-500" />
                          </span>
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TimelineContent>
          ))}
        </div>

      </div>
    </section>
  );
}
