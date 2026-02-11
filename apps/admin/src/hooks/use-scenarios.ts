'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete } from '@/services/api-client';
import type { Scenario } from '@emunah/shared';

const QUERY_KEY = 'scenarios';

/**
 * Hook for fetching scenarios list.
 */
export function useScenarios() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => apiGet<Scenario[]>('/scenarios'),
  });
}

/**
 * Hook for fetching a single scenario by ID.
 */
export function useScenario(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => apiGet<Scenario>(`/scenarios/${id}`),
    enabled: !!id,
  });
}

/**
 * Hook for creating a new scenario.
 */
export function useCreateScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Scenario>) => apiPost<Scenario>('/scenarios', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/**
 * Hook for updating a scenario.
 */
export function useUpdateScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Scenario> }) =>
      apiPut<Scenario>(`/scenarios/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
}

/**
 * Hook for deleting a scenario.
 */
export function useDeleteScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/scenarios/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
