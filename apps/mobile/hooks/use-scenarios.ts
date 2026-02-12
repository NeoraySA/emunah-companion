import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@services/api-helpers';
import type { Scenario, ScenarioWithSteps } from '@emunah/shared';

/**
 * Fetch active scenarios list.
 */
export function useScenarios() {
  return useQuery({
    queryKey: ['scenarios'],
    queryFn: () => apiGet<Scenario[]>('/scenarios'),
  });
}

/**
 * Fetch a single scenario with its steps.
 */
export function useScenario(id: number) {
  return useQuery({
    queryKey: ['scenarios', id],
    queryFn: () => apiGet<ScenarioWithSteps>(`/scenarios/${id}`),
    enabled: !!id,
  });
}
