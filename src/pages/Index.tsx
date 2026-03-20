import { useEffect, useMemo, useState } from "react";
import { FeatureProvider, useFeatureContext } from "@/context/FeatureContext";
import { FilterBar } from "@/components/FilterBar";
import { FeatureCard } from "@/components/FeatureCard";
import { FeatureTable } from "@/components/FeatureTable";
import { FeatureForm } from "@/components/FeatureForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { FilterStatus, Feature } from "@/types/feature";
import {
  Plus,
  LayoutGrid,
  List,
  AlertCircle,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Stats card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  colorClass,
  delay,
}: {
  label: string;
  value: number;
  colorClass: string;
  delay: number;
}) {
  return (
    <div
      className="rounded-lg border border-border bg-card p-4 shadow-card animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn("text-2xl font-bold tabular mb-1", colorClass)}>{value}</div>
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

// ── Inner dashboard (needs context) ──────────────────────────────────────────

type ViewMode = "grid" | "table";

function Dashboard() {
  const {
    isLoading,
    isSubmitting,
    error,
    filteredFeatures,
    features,
    filters,
    isFormOpen,
    selectedFeature,
    isDeleteDialogOpen,
    featureToDelete,
    loadFeatures,
    handleCreateFeature,
    handleUpdateFeature,
    handleDeleteFeature,
    handleQuickStatusChange,
    setFilterStatus,
    setFilterSearch,
    openCreateForm,
    openEditForm,
    closeForm,
    openDeleteDialog,
    closeDeleteDialog,
  } = useFeatureContext();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  // Count features per status for filter tabs
  const counts = useMemo(() => {
    const all = features.length;
    const open = features.filter((f) => f.status === "Open").length;
    const inProgress = features.filter((f) => f.status === "In Progress").length;
    const completed = features.filter((f) => f.status === "Completed").length;
    // Apply search to counts
    const query = filters.search.toLowerCase().trim();
    if (!query) {
      return {
        All: all,
        Open: open,
        "In Progress": inProgress,
        Completed: completed,
      } as Record<FilterStatus, number>;
    }
    const searched = features.filter(
      (f) =>
        f.title.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query)
    );
    return {
      All: searched.length,
      Open: searched.filter((f) => f.status === "Open").length,
      "In Progress": searched.filter((f) => f.status === "In Progress").length,
      Completed: searched.filter((f) => f.status === "Completed").length,
    } as Record<FilterStatus, number>;
  }, [features, filters.search]);

  const statsData = [
    {
      label: "Total Requests",
      value: features.length,
      colorClass: "text-foreground",
      delay: 0,
    },
    {
      label: "Open",
      value: features.filter((f) => f.status === "Open").length,
      colorClass: "text-status-open",
      delay: 60,
    },
    {
      label: "In Progress",
      value: features.filter((f) => f.status === "In Progress").length,
      colorClass: "text-status-in-progress",
      delay: 120,
    },
    {
      label: "Completed",
      value: features.filter((f) => f.status === "Completed").length,
      colorClass: "text-status-completed",
      delay: 180,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Layers className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">
                Feature Tracker
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Manage & prioritize feature requests
              </p>
            </div>
          </div>
          <Button
            onClick={openCreateForm}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Request</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {statsData.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Controls row */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FilterBar
            activeStatus={filters.status}
            search={filters.search}
            onStatusChange={setFilterStatus}
            onSearchChange={setFilterSearch}
            counts={counts}
          />

          {/* View mode toggle */}
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1 w-fit self-end sm:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-md p-1.5 transition-all",
                viewMode === "grid"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Grid view"
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "rounded-md p-1.5 transition-all",
                viewMode === "table"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Table view"
              title="Table view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Result count */}
        {!isLoading && (
          <p className="text-xs text-muted-foreground mb-4 animate-fade-in">
            {filteredFeatures.length === features.length
              ? `Showing ${features.length} request${features.length !== 1 ? "s" : ""}`
              : `Showing ${filteredFeatures.length} of ${features.length} requests`}
          </p>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-6 animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-destructive hover:text-destructive"
              onClick={loadFeatures}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Loading */}
        {isLoading && <SkeletonGrid />}

        {/* Empty state */}
        {!isLoading && !error && filteredFeatures.length === 0 && (
          <EmptyState
            onAction={openCreateForm}
            isFiltered={
              filters.status !== "All" || filters.search.trim().length > 0
            }
          />
        )}

        {/* Content */}
        {!isLoading && !error && filteredFeatures.length > 0 && (
          <>
            {viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFeatures.map((feature, i) => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    onEdit={openEditForm}
                    onDelete={openDeleteDialog}
                    onStatusChange={handleQuickStatusChange}
                    style={{ animationDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>
            ) : (
              <FeatureTable
                features={filteredFeatures}
                onEdit={openEditForm}
                onDelete={openDeleteDialog}
                onStatusChange={handleQuickStatusChange}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <FeatureForm
        open={isFormOpen}
        onClose={closeForm}
        onSubmit={handleCreateFeature}
        onUpdate={handleUpdateFeature}
        feature={selectedFeature}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        feature={featureToDelete}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteFeature}
        isDeleting={isSubmitting}
      />
    </div>
  );
}

// ── Page export with provider ─────────────────────────────────────────────────

export default function Index() {
  return (
    <FeatureProvider>
      <Dashboard />
      <Toaster richColors closeButton />
    </FeatureProvider>
  );
}
