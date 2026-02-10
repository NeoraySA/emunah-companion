import apiClient from './api-client';
import type { ApiSuccessResponse } from '@emunah/shared';

// ---------- Generic request helpers ----------

/**
 * GET request with typed response.
 */
export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get<ApiSuccessResponse<T>>(url, { params });
  return response.data.data;
}

/**
 * POST request with typed response.
 */
export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.post<ApiSuccessResponse<T>>(url, body);
  return response.data.data;
}

/**
 * PUT request with typed response.
 */
export async function apiPut<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.put<ApiSuccessResponse<T>>(url, body);
  return response.data.data;
}

/**
 * PATCH request with typed response.
 */
export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.patch<ApiSuccessResponse<T>>(url, body);
  return response.data.data;
}

/**
 * DELETE request with typed response.
 */
export async function apiDelete<T>(url: string): Promise<T> {
  const response = await apiClient.delete<ApiSuccessResponse<T>>(url);
  return response.data.data;
}
