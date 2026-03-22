import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import {
  Feature,
  CreateFeatureDTO,
  UpdateFeatureDTO,
  FeatureFilters,
  FilterStatus,
  FeatureStatus,
} from "@/types/feature";
import {
  getFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
  updateByStatus, // ✅ new import for PATCH
} from "@/services/featureService";
import { toast } from "sonner";

interface FeatureState {
  features: Feature[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  filters: FeatureFilters;
  selectedFeature: Feature | null;
  isFormOpen: boolean;
  isDeleteDialogOpen: boolean;
  featureToDelete: Feature | null;
}

const initialState: FeatureState = {
  features: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  filters: { status: "All", search: "", priority: "All" },
  selectedFeature: null,
  isFormOpen: false,
  isDeleteDialogOpen: false,
  featureToDelete: null,
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_FEATURES"; payload: Feature[] }
  | { type: "ADD_FEATURE"; payload: Feature }
  | { type: "UPDATE_FEATURE"; payload: Feature }
  | { type: "DELETE_FEATURE"; payload: string }
  | { type: "SET_FILTER_STATUS"; payload: FilterStatus }
  | { type: "SET_FILTER_SEARCH"; payload: string }
  | { type: "SET_SELECTED_FEATURE"; payload: Feature | null }
  | { type: "OPEN_FORM"; payload?: Feature }
  | { type: "CLOSE_FORM" }
  | { type: "OPEN_DELETE_DIALOG"; payload: Feature }
  | { type: "CLOSE_DELETE_DIALOG" };

function reducer(state: FeatureState, action: Action): FeatureState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_FEATURES":
      return { ...state, features: action.payload, error: null };
    case "ADD_FEATURE":
      return { ...state, features: [action.payload, ...state.features] };
    case "UPDATE_FEATURE":
      return {
        ...state,
        features: state.features.map((f) =>
          f.id === action.payload.id ? action.payload : f
        ),
      };
    case "DELETE_FEATURE":
      return {
        ...state,
        features: state.features.filter((f) => f.id !== action.payload),
      };
    case "SET_FILTER_STATUS":
      return { ...state, filters: { ...state.filters, status: action.payload } };
    case "SET_FILTER_SEARCH":
      return { ...state, filters: { ...state.filters, search: action.payload } };
    case "SET_SELECTED_FEATURE":
      return { ...state, selectedFeature: action.payload };
    case "OPEN_FORM":
      return {
        ...state,
        isFormOpen: true,
        selectedFeature: action.payload ?? null,
      };
    case "CLOSE_FORM":
      return { ...state, isFormOpen: false, selectedFeature: null };
    case "OPEN_DELETE_DIALOG":
      return {
        ...state,
        isDeleteDialogOpen: true,
        featureToDelete: action.payload,
      };
    case "CLOSE_DELETE_DIALOG":
      return { ...state, isDeleteDialogOpen: false, featureToDelete: null };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface FeatureContextValue extends FeatureState {
  filteredFeatures: Feature[];
  loadFeatures: () => Promise<void>;
  handleCreateFeature: (data: CreateFeatureDTO) => Promise<void>;
  handleUpdateFeature: (id: string, data: UpdateFeatureDTO) => Promise<void>;
  handleDeleteFeature: (id: string) => Promise<void>;
  handleQuickStatusChange: (id: string, status: FeatureStatus) => Promise<void>;
  setFilterStatus: (status: FilterStatus) => void;
  setFilterSearch: (search: string) => void;
  openCreateForm: () => void;
  openEditForm: (feature: Feature) => void;
  closeForm: () => void;
  openDeleteDialog: (feature: Feature) => void;
  closeDeleteDialog: () => void;
}

const FeatureContext = createContext<FeatureContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const filteredFeatures = React.useMemo(() => {
    let list = [...state.features];
    if (state.filters.status !== "All") {
      list = list.filter((f) => f.status === state.filters.status);
    }
    const q = state.filters.search.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [state.features, state.filters]);

  const loadFeatures = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const data = await getFeatures();
      dispatch({ type: "SET_FEATURES", payload: data });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load features";
      dispatch({ type: "SET_ERROR", payload: msg });
      toast.error(msg);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const handleCreateFeature = useCallback(async (data: CreateFeatureDTO) => {
    dispatch({ type: "SET_SUBMITTING", payload: true });
    try {
      const created = await createFeature(data);
      dispatch({ type: "ADD_FEATURE", payload: created });
      dispatch({ type: "CLOSE_FORM" });
      toast.success("Feature request created successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create feature";
      toast.error(msg);
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  }, []);

  const handleUpdateFeature = useCallback(async (id: string, data: UpdateFeatureDTO) => {
    dispatch({ type: "SET_SUBMITTING", payload: true });
    try {
      const updated = await updateFeature(id, data);
      dispatch({ type: "UPDATE_FEATURE", payload: updated });
      dispatch({ type: "CLOSE_FORM" });
      toast.success("Feature request updated");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update feature";
      toast.error(msg);
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  }, []);

  const handleDeleteFeature = useCallback(async (id: string) => {
    dispatch({ type: "SET_SUBMITTING", payload: true });
    try {
      await deleteFeature(id);
      dispatch({ type: "DELETE_FEATURE", payload: id });
      dispatch({ type: "CLOSE_DELETE_DIALOG" });
      toast.success("Feature request deleted");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete feature";
      toast.error(msg);
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  }, []);

  /**
   * ✅ New: Quick status change using PATCH endpoint
   */
  const handleQuickStatusChange = useCallback(
    async (id: string, status: FeatureStatus) => {
      const prev = state.features.find((f) => f.id === id);
      if (!prev) return;

      // Optimistic UI
      dispatch({ type: "UPDATE_FEATURE", payload: { ...prev, status } });

      try {
        const updated = await updateByStatus(id, status);
        dispatch({ type: "UPDATE_FEATURE", payload: updated });
        toast.success(`Status updated to "${status}"`);
      } catch (err) {
        // Rollback
        dispatch({ type: "UPDATE_FEATURE", payload: prev });
        toast.error("Failed to update status");
      }
    },
    [state.features]
  );

  const setFilterStatus = useCallback((status: FilterStatus) => {
    dispatch({ type: "SET_FILTER_STATUS", payload: status });
  }, []);

  const setFilterSearch = useCallback((search: string) => {
    dispatch({ type: "SET_FILTER_SEARCH", payload: search });
  }, []);

  const openCreateForm = useCallback(() => dispatch({ type: "OPEN_FORM" }), []);
  const openEditForm = useCallback((feature: Feature) => dispatch({ type: "OPEN_FORM", payload: feature }), []);
  const closeForm = useCallback(() => dispatch({ type: "CLOSE_FORM" }), []);
  const openDeleteDialog = useCallback((feature: Feature) => dispatch({ type: "OPEN_DELETE_DIALOG", payload: feature }), []);
  const closeDeleteDialog = useCallback(() => dispatch({ type: "CLOSE_DELETE_DIALOG" }), []);

  return (
    <FeatureContext.Provider
      value={{
        ...state,
        filteredFeatures,
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
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
}

export function useFeatureContext(): FeatureContextValue {
  const ctx = useContext(FeatureContext);
  if (!ctx) throw new Error("useFeatureContext must be used within a FeatureProvider");
  return ctx;
}