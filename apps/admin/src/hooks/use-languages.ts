'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/services/api-client';
import type { Language } from '@emunah/shared';

const QUERY_KEY = 'languages';

interface LanguagesResponse {
  languages: Language[];
}

/**
 * Fetch all active languages.
 */
export function useLanguages() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => apiGet<LanguagesResponse>('/languages').then((r) => r.languages),
    staleTime: 30 * 60 * 1000, // 30 minutes – languages rarely change
  });
}
