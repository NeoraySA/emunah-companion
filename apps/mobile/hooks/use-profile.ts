import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPut } from '@services/api-helpers';
import type { UserProfile } from '@emunah/shared';
import { useAuthStore } from '@store/auth-store';

/**
 * Fetch current user profile.
 */
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => apiGet<UserProfile>('/users/me'),
  });
}

/**
 * Update current user profile (displayName, preferredLang).
 */
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { displayName?: string; preferredLang?: string }) =>
      apiPut<UserProfile>('/users/me', data),
    onSuccess: (profile) => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      // Keep auth store in sync
      useAuthStore.getState().setUser({
        id: profile.id,
        email: profile.email,
        fullName: profile.displayName ?? '',
        roleName: profile.role,
      });
    },
  });
}
