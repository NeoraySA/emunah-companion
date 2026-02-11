'use client';

import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@emunah/shared';
import {
  loginApi,
  logoutApi,
  getMeApi,
  getAccessToken,
  clearTokens,
} from '@/services/auth-service';

// ---- Types ----

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ---- Context ----

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ---- Provider ----

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // On mount: check if we have a stored token and fetch profile
  useEffect(() => {
    const init = async () => {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getMeApi();
        setUser(profile);
      } catch {
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const profile = await loginApi(email, password);

      // Only admin and editor can access the admin panel
      if (profile.role !== 'admin' && profile.role !== 'editor') {
        clearTokens();
        throw new Error('אין לך הרשאות גישה לפאנל הניהול');
      }

      setUser(profile);
      router.push('/dashboard');
    },
    [router],
  );

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---- Hook ----

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
