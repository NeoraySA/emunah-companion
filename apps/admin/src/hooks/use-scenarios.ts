'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete, apiClient } from '@/services/api-client';
import type { Scenario, ScenarioStep, ScenarioWithSteps, StepType } from '@emunah/shared';

const QUERY_KEY = 'scenarios';
const STEPS_QUERY_KEY = 'scenario-steps';

// ---- Scenarios ----

/**
 * Fetch all scenarios (admin list – includes inactive).
 */
export function useScenarios() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const response = await apiClient.get<{
        success: true;
        data: Scenario[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      }>('/scenarios/all', { params: { limit: 100 } });
      return response.data.data;
    },
  });
}

/**
 * Fetch a single scenario by ID (with steps).
 */
export function useScenario(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => apiGet<ScenarioWithSteps>(`/scenarios/${id}`),
    enabled: !!id,
  });
}

/**
 * Create a new scenario.
 */
export function useCreateScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { key: string; category: string; sortOrder?: number; isActive?: boolean }) =>
      apiPost<Scenario>('/scenarios', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/**
 * Update a scenario.
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
 * Delete a scenario.
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

// ---- Scenario Steps ----

/**
 * Fetch steps for a scenario.
 */
export function useScenarioSteps(scenarioId: number) {
  return useQuery({
    queryKey: [STEPS_QUERY_KEY, scenarioId],
    queryFn: () => apiGet<ScenarioStep[]>(`/scenarios/${scenarioId}/steps`),
    enabled: !!scenarioId,
  });
}

/**
 * Create a step.
 */
export function useCreateStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scenarioId,
      data,
    }: {
      scenarioId: number;
      data: {
        stepNumber: number;
        stepType: StepType;
        configJson?: Record<string, unknown>;
        sortOrder?: number;
      };
    }) => apiPost<ScenarioStep>(`/scenarios/${scenarioId}/steps`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [STEPS_QUERY_KEY, variables.scenarioId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.scenarioId] });
    },
  });
}

/**
 * Update a step.
 */
export function useUpdateStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scenarioId,
      stepId,
      data,
    }: {
      scenarioId: number;
      stepId: number;
      data: Partial<ScenarioStep>;
    }) => apiPut<ScenarioStep>(`/scenarios/${scenarioId}/steps/${stepId}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [STEPS_QUERY_KEY, variables.scenarioId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.scenarioId] });
    },
  });
}

/**
 * Delete a step.
 */
export function useDeleteStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scenarioId, stepId }: { scenarioId: number; stepId: number }) =>
      apiDelete(`/scenarios/${scenarioId}/steps/${stepId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [STEPS_QUERY_KEY, variables.scenarioId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.scenarioId] });
    },
  });
}
