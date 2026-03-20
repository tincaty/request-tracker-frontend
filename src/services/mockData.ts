import { Feature } from "@/types/feature";

export const mockFeatures: Feature[] = [
  {
    id: "feat_001",
    title: "Dark mode support",
    description:
      "Add a system-aware dark mode toggle that respects the user's OS preference and stores their choice in local storage for persistence across sessions.",
    priority: "High",
    status: "In Progress",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "feat_002",
    title: "CSV export for reports",
    description:
      "Allow users to export their feature request data as a CSV file for external reporting, analysis, or sharing with stakeholders.",
    priority: "Medium",
    status: "Open",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "feat_003",
    title: "Email notifications on status change",
    description:
      "Send automated email notifications to the request author when the status of their feature request is updated by an admin or team member.",
    priority: "High",
    status: "Open",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "feat_004",
    title: "Bulk status update",
    description:
      "Enable selecting multiple feature requests and updating their status in one operation to improve admin workflow efficiency.",
    priority: "Medium",
    status: "Open",
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "feat_005",
    title: "User voting / upvote system",
    description:
      "Let users upvote feature requests they care about. Display a vote count on each card and allow sorting by popularity.",
    priority: "High",
    status: "Completed",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "feat_006",
    title: "Keyboard shortcuts",
    description:
      "Implement a set of keyboard shortcuts for power users: new request (N), search (/ or Ctrl+K), and quick status change.",
    priority: "Low",
    status: "Open",
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "feat_007",
    title: "Tagging and categorization",
    description:
      "Add a tag system to feature requests so teams can organize by product area, team, or sprint. Tags should be filterable.",
    priority: "Medium",
    status: "In Progress",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "feat_008",
    title: "API webhook integration",
    description:
      "Support outgoing webhooks to notify external systems (Slack, Jira, etc.) when a feature request is created, updated, or resolved.",
    priority: "Low",
    status: "Completed",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function simulateDelay(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
