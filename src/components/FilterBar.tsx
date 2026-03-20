import { Search, X } from "lucide-react";
import { FilterStatus } from "@/types/feature";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FILTER_TABS: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "All" },
  { label: "Open", value: "Open" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];

interface FilterBarProps {
  activeStatus: FilterStatus;
  search: string;
  onStatusChange: (status: FilterStatus) => void;
  onSearchChange: (value: string) => void;
  counts: Record<FilterStatus, number>;
}

export function FilterBar({
  activeStatus,
  search,
  onStatusChange,
  onSearchChange,
  counts,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Status Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-muted p-1 w-fit">
        {FILTER_TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onStatusChange(value)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150",
              activeStatus === value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
            <span
              className={cn(
                "min-w-[18px] rounded-full px-1.5 py-0 text-xs font-semibold tabular",
                activeStatus === value
                  ? "bg-primary/10 text-primary"
                  : "bg-transparent text-muted-foreground"
              )}
            >
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search requests…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-8 h-9 text-sm bg-card"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => onSearchChange("")}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
