'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPut } from '@/services/api-client';
import type { Translation, UpsertTranslation } from '@emunah/shared';

const QUERY_KEY = 'translations';

interface TranslationsResponse {
  translations: Translation[];
}

/**
 * Fetch translations for a specific entity.
 */
export function useTranslations(params: {
  entityType?: string;
  entityId?: number;
  languageId?: number;
}) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () =>
      apiGet<TranslationsResponse>('/translations', params as Record<string, unknown>).then(
        (r) => r.translations,
      ),
    enabled: !!params.entityType,
  });
}

/**
 * Bulk upsert translations.
 */
export function useUpsertTranslations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (translations: UpsertTranslation[]) =>
      apiPut<TranslationsResponse>('/translations', { translations }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
