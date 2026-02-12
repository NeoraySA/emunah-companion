'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';

const QUERY_KEY = 'dashboard-stats';

interface DashboardStats {
  scenarios: number;
  homeButtons: number;
  translations: number;
  users: number;
  media: number;
}

/**
 * Fetch dashboard counts from multiple endpoints.
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async (): Promise<DashboardStats> => {
      // Fetch counts in parallel from existing endpoints
      const [scenariosRes, homeButtonsRes, translationsRes, mediaRes] = await Promise.allSettled([
        apiClient.get('/scenarios/all', { params: { page: 1, limit: 1 } }),
        apiClient.get('/home-buttons/all'),
        apiClient.get('/translations', { params: { entityType: 'scenario' } }),
        apiClient.get('/media', { params: { page: 1, limit: 1 } }),
      ]);

      const scenariosCount =
        scenariosRes.status === 'fulfilled'
          ? (scenariosRes.value.data?.meta?.total ??
            scenariosRes.value.data?.data?.scenarios?.length ??
            0)
          : 0;

      const homeButtonsCount =
        homeButtonsRes.status === 'fulfilled'
          ? (homeButtonsRes.value.data?.data?.homeButtons?.length ?? 0)
          : 0;

      const translationsCount =
        translationsRes.status === 'fulfilled'
          ? (translationsRes.value.data?.data?.translations?.length ?? 0)
          : 0;

      const mediaCount =
        mediaRes.status === 'fulfilled'
          ? (mediaRes.value.data?.meta?.total ?? mediaRes.value.data?.data?.meta?.total ?? 0)
          : 0;

      return {
        scenarios: scenariosCount,
        homeButtons: homeButtonsCount,
        translations: translationsCount,
        users: 0, // Requires admin user-list endpoint (future)
        media: mediaCount,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
