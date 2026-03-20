/**
 * Base API configuration.
 * Set VITE_API_BASE_URL in your .env file to point to your backend.
 * Falls back to a mock mode when no URL is set.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Generic fetch wrapper with error handling.
 * Swap this with axios or any HTTP client as needed.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseURL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}
