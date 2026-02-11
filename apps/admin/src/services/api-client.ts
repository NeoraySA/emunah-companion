import axios from 'axios';
import type { ApiSuccessResponse } from '@emunah/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

/**
 * Configured Axios instance for API calls.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor – attach token from cookie/session
apiClient.interceptors.request.use(
  (config) => {
    // Token will be handled via httpOnly cookies or Authorization header
    // For now, we rely on cookies set by the server
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor – handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Generic GET request with typed response.
 */
export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get<ApiSuccessResponse<T>>(url, { params });
  return response.data.data;
}

/**
 * Generic POST request with typed response.
 */
export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.post<ApiSuccessResponse<T>>(url, body);
  return response.data.data;
}

/**
 * Generic PUT request with typed response.
 */
export async function apiPut<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.put<ApiSuccessResponse<T>>(url, body);
  return response.data.data;
}

/**
 * Generic PATCH request with typed response.
 */
export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.patch<ApiSuccessResponse<T>>(url, body);
  return response.data.data;
}

/**
 * Generic DELETE request with typed response.
 */
export async function apiDelete<T>(url: string): Promise<T> {
  const response = await apiClient.delete<ApiSuccessResponse<T>>(url);
  return response.data.data;
}
