import { create } from 'zustand';
import {
  loginApi,
  registerApi,
  logoutApi,
  getMeApi,
  clearTokens,
  getAccessToken,
} from '@services/auth-service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

/**
 * Auth store – manages authentication state.
 * Tokens are stored in SecureStore, not in memory.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const result = await loginApi({ email, password });
    set({ user: result.user, isAuthenticated: true, isLoading: false });
  },

  register: async (email, password, fullName) => {
    const result = await registerApi({ email, password, fullName });
    set({ user: result.user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await logoutApi();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  initialize: async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      const profile = await getMeApi();
      set({ user: profile, isAuthenticated: true, isLoading: false });
    } catch {
      await clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  clearUser: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}));
