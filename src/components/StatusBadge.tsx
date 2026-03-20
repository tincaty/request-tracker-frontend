import { FeatureStatus } from "@/types/feature";
import { cn } from "@/lib/utils";
import { Circle, Clock, CheckCircle2 } from "lucide-react";

interface StatusBadgeProps {
  status: FeatureStatus;
  className?: string;
  size?: "sm" | "md";
}

const statusConfig: Record<
  FeatureStatus,
  { label: string; icon: React.ElementType; colorClass: string }
> = {
  Open: {
    label: "Open",
    icon: Circle,
    colorClass:
      "bg-status-open-bg text-status-open border border-status-open/20",
  },
  "In Progress": {
    label: "In Progress",
    icon: Clock,
    colorClass:
      "bg-status-in-progress-bg text-status-in-progress border border-status-in-progress/20",
  },
  Completed: {
    label: "Completed",
    icon: CheckCircle2,
    colorClass:
      "bg-status-completed-bg text-status-completed border border-status-completed/20",
  },
};

export function StatusBadge({ status, className, size = "md" }: StatusBadgeProps) {
  const { label, icon: Icon, colorClass } = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        colorClass,
        className
      )}
    >
      <Icon className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} strokeWidth={2.5} />
      {label}
    </span>
  );
}
