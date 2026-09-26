import { Metadata } from "next";
import { DsaTreeCanvas } from "@/components/roadmap/dsa-tree-canvas";

export const metadata: Metadata = {
  title: "Interactive DSA Roadmap | Algoryn",
  description:
    "Comprehensive hierarchical visual roadmap of Data Structures, Algorithms, Patterns, and Techniques.",
};

export default function DsaRoadmapPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-background">
      <DsaTreeCanvas />
    </div>
  );
}
