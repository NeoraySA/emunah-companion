import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@constants/config';

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  roleName: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

/**
 * Auth store – manages authentication state.
 * Tokens are stored in SecureStore, not in memory.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),

  clearUser: () => set({ user: null, isAuthenticated: false, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
