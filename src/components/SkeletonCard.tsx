import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted animate-pulse",
        className
      )}
    />
  );
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-5 space-y-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <SkeletonLine className="h-5 w-3/5" />
        <SkeletonLine className="h-5 w-16 rounded-full" />
      </div>
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-4/5" />
      <div className="flex items-center justify-between pt-1">
        <SkeletonLine className="h-5 w-16 rounded-full" />
        <SkeletonLine className="h-4 w-20" />
      </div>
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
