import { ProblemCardSkeleton } from "@/components/problem-card-skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex-1 p-2.5 sm:p-5 lg:p-8 w-full max-w-full space-y-3.5 sm:space-y-4">
      {/* Target Companies Quick-Switch Ribbon Skeleton */}
      <div className="flex items-center gap-2 overflow-hidden py-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 rounded-full bg-muted/60 animate-pulse shrink-0"
            style={{ width: `${80 + (i % 3) * 20}px` }}
          />
        ))}
      </div>

      {/* Problem Cards Grid Skeleton - ONLY problem cards have skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <ProblemCardSkeleton key={i} delay={i * 80} />
        ))}
      </div>
    </div>
  );
}
