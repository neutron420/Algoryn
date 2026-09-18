"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HeroHeader } from "@/components/templates/nova/sections/header";
import Footer from "@/components/templates/nova/sections/footer-1";
import { Mail, MessageSquare, Send, CheckCircle2, HelpCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Support");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    // Simulate instantaneous feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Thank you! Your message has been received. We will reply within 24 hours.");
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <HeroHeader />

      <main className="flex-1 pt-32 pb-20 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Badge & Title */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400 text-xs font-medium mb-4">
              <Mail className="size-4" />
              <span>We Are Here to Help</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Contact Algoryn Support
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Have questions regarding our company problem roadmaps, bug reports, feature requests, or partnership inquiries? Send us a message anytime.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left Column: Contact Cards & Support Details (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card/40 border border-border/70 rounded-2xl p-6 backdrop-blur-sm shadow-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center size-9 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <Mail className="size-4" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base">Direct Email</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  Our engineering and support team reviews messages throughout the business day.
                </p>
                <a
                  href="mailto:support@algoryn.me"
                  className="text-orange-500 hover:underline font-medium text-sm inline-block"
                >
                  support@algoryn.me
                </a>
              </div>

              <div className="bg-card/40 border border-border/70 rounded-2xl p-6 backdrop-blur-sm shadow-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center size-9 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <HelpCircle className="size-4" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base">Quick Help & FAQs</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                  Check out our curated interview preparation guides and frequently asked questions for immediate answers.
                </p>
                <Link
                  href="/#faqs"
                  className="text-xs font-medium text-orange-500 hover:underline inline-flex items-center gap-1"
                >
                  <span>Browse Landing FAQs</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              <div className="bg-card/40 border border-border/70 rounded-2xl p-6 backdrop-blur-sm shadow-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center size-9 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <Sparkles className="size-4" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base">Response Time</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Typical response time is under <strong>24 business hours</strong>.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Contact Form (3 Cols) */}
            <div className="lg:col-span-3 bg-card/40 border border-border/70 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xs">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center size-14 rounded-full bg-orange-500/10 text-orange-500 mx-auto mb-4">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Message Sent Successfully!</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                    Thank you for reaching out to Algoryn. We have received your inquiry and will follow up with you at <strong>{email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="px-4 py-2 text-xs font-medium rounded-lg border border-border hover:bg-muted text-foreground transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <MessageSquare className="size-5 text-orange-500" />
                    <span>Send a Message</span>
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Your Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Subject / Topic
                    </label>
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                    >
                      <option value="General Support">General Support & Feedback</option>
                      <option value="Curriculum Request">Request New Company / Problem</option>
                      <option value="Bug Report">Technical Bug Report</option>
                      <option value="Partnership & Sponsorship">Advertising & Partnerships</option>
                      <option value="Privacy / Compliance">Privacy & Data Requests</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we assist you with your interview prep journey?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="size-4" />
                        <span>Submit Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
