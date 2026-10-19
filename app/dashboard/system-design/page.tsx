import { Metadata } from "next";
import { SystemDesignHub } from "@/components/system-design/system-design-hub";

export const metadata: Metadata = {
  title: "System Design Hub | Algoryn",
  description:
    "Master High-Level Design (HLD), Low-Level Design (LLD), System Building Blocks, and Scalable FAANG Architectures.",
};

export default function SystemDesignPage() {
  return (
    <div className="flex flex-col min-h-full w-full bg-slate-50/50 dark:bg-[#0c101c]">
      <SystemDesignHub />
    </div>
  );
}
