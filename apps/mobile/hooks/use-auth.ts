import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@store/auth-store';
import { apiGet } from '@services/api-helpers';
import { STORAGE_KEYS } from '@constants/config';
import type { AuthUser } from '@store/auth-store';

/**
 * Hook to check and restore authentication state on app startup.
 * Reads tokens from SecureStore and validates with server.
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, clearUser, setLoading, logout } =
    useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);

      if (!token) {
        clearUser();
        return;
      }

      // Validate token by fetching current user profile
      const profile = await apiGet<AuthUser>('/auth/me');
      setUser(profile);
    } catch {
      clearUser();
    } finally {
      setIsReady(true);
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading: isLoading && !isReady,
    logout,
    refreshAuth: checkAuth,
  };
}
