import { Metadata } from "next";
import { DsaTreeCanvas } from "@/components/roadmap/dsa-tree-canvas";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { KodePrepLogo } from "@/components/kodeprep-logo";

export const metadata: Metadata = {
  title: "Interactive DSA Roadmap | Algoryn",
  description:
    "Comprehensive hierarchical visual roadmap of Data Structures, Algorithms, Patterns, and Techniques.",
};

export default function StandaloneRoadmapPage() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
      {/* Top Bar */}
      <header className="h-14 border-b border-border/60 bg-background/95 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/60 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Dashboard</span>
          </Link>

          <span className="h-4 w-px bg-border/60" />

          <KodePrepLogo />
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
        >
          Practice Problems
        </Link>
      </header>

      {/* Main Canvas View */}
      <main className="flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden">
        <DsaTreeCanvas />
      </main>
    </div>
  );
}
