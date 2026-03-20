import { Feature, FeatureStatus } from "@/types/feature";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { formatDate } from "@/utils/helpers";
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
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: FeatureStatus[] = ["Open", "In Progress", "Completed"];

interface FeatureTableProps {
  features: Feature[];
  onEdit: (feature: Feature) => void;
  onDelete: (feature: Feature) => void;
  onStatusChange: (id: string, status: FeatureStatus) => void;
}

export function FeatureTable({
  features,
  onEdit,
  onDelete,
  onStatusChange,
}: FeatureTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table" aria-label="Feature requests">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Title
              </th>
              <th className="hidden sm:table-cell px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Priority
              </th>
              <th className="hidden lg:table-cell px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Created
              </th>
              <th className="px-4 py-3 text-right font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {features.map((feature, i) => (
              <tr
                key={feature.id}
                className={cn(
                  "group hover:bg-muted/30 transition-colors",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <td className="px-4 py-3.5 max-w-xs">
                  <div>
                    <button
                      onClick={() => onEdit(feature)}
                      className="font-medium text-foreground hover:text-accent transition-colors text-left"
                    >
                      {feature.title}
                    </button>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {feature.description}
                    </p>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-4 py-3.5">
                  <StatusBadge status={feature.status} size="sm" />
                </td>
                <td className="hidden md:table-cell px-4 py-3.5">
                  <PriorityBadge priority={feature.priority} />
                </td>
                <td className="hidden lg:table-cell px-4 py-3.5 text-muted-foreground text-xs tabular">
                  {formatDate(feature.createdAt)}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground"
                        aria-label="Feature options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
