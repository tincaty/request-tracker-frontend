// Feature request data model
export type FeatureStatus = "Open" | "In Progress" | "Completed";
export type FeaturePriority = "Low" | "Medium" | "High";

export interface Feature {
  id: string;
  title: string;
  description: string;
  priority: FeaturePriority;
  status: FeatureStatus;
  createdAt: string; // ISO date string
  updatedAt?: string;
}

export type CreateFeatureDTO = Omit<Feature, "id" | "createdAt" | "updatedAt">;
export type UpdateFeatureDTO = Partial<CreateFeatureDTO>;

export type FilterStatus = "All" | FeatureStatus;

export interface FeatureFilters {
  status: FilterStatus;
  search: string;
  priority?: FeaturePriority | "All";
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
