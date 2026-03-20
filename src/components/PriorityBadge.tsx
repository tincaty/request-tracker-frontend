import { FeaturePriority } from "@/types/feature";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

interface PriorityBadgeProps {
  priority: FeaturePriority;
  className?: string;
  showLabel?: boolean;
}

const priorityConfig: Record<
  FeaturePriority,
  { label: string; icon: React.ElementType; colorClass: string }
> = {
  Low: {
    label: "Low",
    icon: ArrowDown,
    colorClass:
      "bg-priority-low-bg text-priority-low border border-priority-low/20",
  },
  Medium: {
    label: "Medium",
    icon: ArrowRight,
    colorClass:
      "bg-priority-medium-bg text-priority-medium border border-priority-medium/20",
  },
  High: {
    label: "High",
    icon: ArrowUp,
    colorClass:
      "bg-priority-high-bg text-priority-high border border-priority-high/20",
  },
};

export function PriorityBadge({
  priority,
  className,
  showLabel = true,
}: PriorityBadgeProps) {
  const { label, icon: Icon, colorClass } = priorityConfig[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border",
        colorClass,
        className
      )}
      title={`Priority: ${label}`}
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {showLabel && label}
    </span>
  );
}
