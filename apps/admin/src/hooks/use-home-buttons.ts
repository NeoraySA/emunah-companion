'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete } from '@/services/api-client';
import type { HomeButton } from '@emunah/shared';

const QUERY_KEY = 'home-buttons';

interface HomeButtonsResponse {
  homeButtons: HomeButton[];
}

interface HomeButtonResponse {
  homeButton: HomeButton;
}

/**
 * Fetch all home buttons (admin – includes inactive).
 */
export function useHomeButtons() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => apiGet<HomeButtonsResponse>('/home-buttons/all').then((r) => r.homeButtons),
  });
}

/**
 * Create a new home button.
 */
export function useCreateHomeButton() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      key: string;
      icon: string;
      route: string;
      sortOrder?: number;
      isActive?: boolean;
    }) => apiPost<HomeButtonResponse>('/home-buttons', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/**
 * Update an existing home button.
 */
export function useUpdateHomeButton() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<HomeButton> }) =>
      apiPut<HomeButtonResponse>(`/home-buttons/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/**
 * Delete (soft) a home button.
 */
export function useDeleteHomeButton() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/home-buttons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
