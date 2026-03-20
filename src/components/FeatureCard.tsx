import { Feature, FeatureStatus } from "@/types/feature";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { formatDate } from "@/utils/helpers";
import { truncate } from "@/utils/helpers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, RefreshCw } from "lucide-react";

const STATUS_OPTIONS: FeatureStatus[] = ["Open", "In Progress", "Completed"];

interface FeatureCardProps {
  feature: Feature;
  onEdit: (feature: Feature) => void;
  onDelete: (feature: Feature) => void;
  onStatusChange: (id: string, status: FeatureStatus) => void;
  style?: React.CSSProperties;
}

export function FeatureCard({
  feature,
  onEdit,
  onDelete,
  onStatusChange,
  style,
}: FeatureCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-lg border border-border bg-card p-5",
        "transition-[box-shadow,transform] duration-200",
        "hover:shadow-card-hover hover:-translate-y-0.5",
        "shadow-card animate-fade-in"
      )}
      style={style}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className="text-sm font-semibold text-card-foreground leading-snug flex-1 cursor-pointer hover:text-accent transition-colors"
          title={feature.title}
          onClick={() => onEdit(feature)}
        >
          {feature.title}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 -mt-0.5 -mr-1 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
              aria-label="Feature options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(feature)}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal pb-1">
              Change status
            </DropdownMenuLabel>
            {STATUS_OPTIONS.filter((s) => s !== feature.status).map((s) => (
              <DropdownMenuItem
                key={s}
                onClick={() => onStatusChange(feature.id, s)}
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Mark as {s}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(feature)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed flex-1">
        {truncate(feature.description)}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/60">
        <div className="flex items-center gap-1.5">
          <StatusBadge status={feature.status} size="sm" />
          <PriorityBadge priority={feature.priority} />
        </div>
        <time
          className="text-xs text-muted-foreground tabular shrink-0"
          dateTime={feature.createdAt}
          title={`Created: ${new Date(feature.createdAt).toLocaleDateString()}`}
        >
          {formatDate(feature.createdAt)}
        </time>
      </div>
    </article>
  );
}
