import { Metadata } from "next";
import { DsaTreeCanvas } from "@/components/roadmap/dsa-tree-canvas";

export const metadata: Metadata = {
  title: "Interactive DSA Roadmap | Algoryn",
  description:
    "Comprehensive hierarchical visual roadmap of Data Structures, Algorithms, Patterns, and Techniques.",
};

export default function DsaRoadmapPage() {
  return (
    <div className="relative flex flex-col h-[calc(100svh-6rem)] md:h-[calc(100svh-6.5rem)] w-full overflow-hidden bg-white dark:bg-[#0c101c]">
      <DsaTreeCanvas />
    </div>
  );
}
