import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@services/api-helpers';
import type { HomeButton } from '@emunah/shared';

/**
 * Fetch active home buttons for the home screen.
 * Public endpoint – no auth required.
 */
export function useHomeButtons() {
  return useQuery({
    queryKey: ['home-buttons'],
    queryFn: () => apiGet<HomeButton[]>('/home-buttons'),
  });
}
