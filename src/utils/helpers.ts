import { FeatureStatus, FeaturePriority } from "@/types/feature";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

export function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const STATUS_ORDER: Record<FeatureStatus, number> = {
  Open: 0,
  "In Progress": 1,
  Completed: 2,
};

export const PRIORITY_ORDER: Record<FeaturePriority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

export function getPriorityWeight(priority: FeaturePriority): number {
  return PRIORITY_ORDER[priority];
}

export function truncate(str: string, maxLength = 120): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}
