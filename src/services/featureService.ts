import { Feature, CreateFeatureDTO, UpdateFeatureDTO ,FeatureStatus} from "@/types/feature";
import { apiRequest } from "./api";
import { mockFeatures, simulateDelay } from "./mockData";

const USE_MOCK = !import.meta.env.VITE_API_BASE_URL;

// In-memory mock store
let mockStore: Feature[] = [...mockFeatures];

function generateId(): string {
  return `feat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Fetch all feature requests.
 * Replace mock implementation with: apiRequest<Feature[]>("/features")
 */
export async function getFeatures(): Promise<Feature[]> {
  if (USE_MOCK) {
    await simulateDelay();
    return [...mockStore].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return apiRequest<Feature[]>("/");
}

/**
 * Fetch a single feature request by ID.
 */
export async function getFeatureById(id: string): Promise<Feature> {
  if (USE_MOCK) {
    await simulateDelay(300);
    const feature = mockStore.find((f) => f.id === id);
    if (!feature) throw new Error("Feature not found");
    return { ...feature };
  }
  return apiRequest<Feature>(`/${id}`);
}

/**
 * Create a new feature request.
 */
export async function createFeature(data: CreateFeatureDTO): Promise<Feature> {
  if (USE_MOCK) {
    await simulateDelay();
    const newFeature: Feature = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),

    };
    mockStore = [newFeature, ...mockStore];
    return { ...newFeature };
  }
  return apiRequest<Feature>("/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing feature request.
 */
export async function updateFeature(id: string, data: UpdateFeatureDTO): Promise<Feature> {
  if (USE_MOCK) {
    await simulateDelay();
    const index = mockStore.findIndex((f) => f.id === id);
    if (index === -1) throw new Error("Feature not found");
    const updated: Feature = {
      ...mockStore[index],
      ...data,
    };
    mockStore = mockStore.map((f) => (f.id === id ? updated : f));
    return { ...updated };
  }
  return apiRequest<Feature>(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a feature request by ID.
 */
export async function deleteFeature(id: string): Promise<void> {
  if (USE_MOCK) {
    await simulateDelay();
    const exists = mockStore.some((f) => f.id === id);
    if (!exists) throw new Error("Feature not found");
    mockStore = mockStore.filter((f) => f.id !== id);
    return;
  }
  return apiRequest<void>(`/${id}`, { method: "DELETE" });
}


/**
 * Update feature status only
 */
export async function updateByStatus(
  id: string,
  status: FeatureStatus // <-- enforce valid status
): Promise<Feature> {
  if (USE_MOCK) {
    await simulateDelay();

    const index = mockStore.findIndex((f) => f.id === id);
    if (index === -1) throw new Error("Feature not found");

    const updated: Feature = {
      ...mockStore[index],
      status, 
    };

    mockStore = mockStore.map((f) => (f.id === id ? updated : f));
    return { ...updated };
  }

  // Call backend PATCH endpoint
  return apiRequest<Feature>(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }), 
  });
}