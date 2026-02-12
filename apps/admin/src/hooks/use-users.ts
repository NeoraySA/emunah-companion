'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPut, apiDelete } from '@/services/api-client';
import type { AdminUser, PaginationMeta, RoleName } from '@emunah/shared';

const QUERY_KEY = 'admin-users';

interface ListUsersParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  role?: RoleName;
  isActive?: boolean;
}

/**
 * Fetch paginated users list (admin).
 */
export function useUsers(params: ListUsersParams = {}) {
  const queryParams: Record<string, unknown> = {};
  if (params.page) queryParams.page = params.page;
  if (params.limit) queryParams.limit = params.limit;
  if (params.sort) queryParams.sort = params.sort;
  if (params.order) queryParams.order = params.order;
  if (params.search) queryParams.search = params.search;
  if (params.role) queryParams.role = params.role;
  if (params.isActive !== undefined) queryParams.isActive = String(params.isActive);

  return useQuery({
    queryKey: [QUERY_KEY, queryParams],
    queryFn: async () => {
      // The API returns { success, data: users[], meta }
      // apiGet returns the data field, but meta is outside data
      // We need to handle this specially
      const { apiClient } = await import('@/services/api-client');
      const response = await apiClient.get('/users', { params: queryParams });
      return {
        users: response.data.data as AdminUser[],
        meta: response.data.meta as PaginationMeta,
      };
    },
  });
}

/**
 * Update a user (role, isActive, displayName, etc.).
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { role?: RoleName; isActive?: boolean; displayName?: string; preferredLang?: string };
    }) => apiPut<AdminUser>(`/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/**
 * Soft-delete a user.
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete<void>(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
