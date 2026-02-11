import { useCallback } from 'react';
import { useAuthStore } from '@store/auth-store';

/**
 * Convenience hook that wraps the Zustand auth store.
 * Components should use this instead of importing the store directly.
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, login, register, logout, initialize } = useAuthStore();

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      await login(email, password);
    },
    [login],
  );

  const handleRegister = useCallback(
    async (email: string, password: string, fullName: string) => {
      await register(email, password, fullName);
    },
    [register],
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout,
    initialize,
  };
}
