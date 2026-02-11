'use client';

import { apiClient } from './api-client';
import type { AuthTokens, UserProfile } from '@emunah/shared';

// ---- Token Management (localStorage) ----

const ACCESS_TOKEN_KEY = 'emunah_access_token';
const REFRESH_TOKEN_KEY = 'emunah_refresh_token';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(tokens: AuthTokens): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  // Set a lightweight cookie for Next.js middleware to detect auth state
  document.cookie = 'emunah_auth=1; path=/; max-age=604800; SameSite=Lax';
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  // Clear the auth cookie
  document.cookie = 'emunah_auth=; path=/; max-age=0';
}

// ---- API Interceptor: attach Authorization header ----

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---- Auth API Calls ----

interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

interface RefreshResponse {
  tokens: AuthTokens;
}

/**
 * Login with email + password. Stores tokens on success.
 */
export async function loginApi(email: string, password: string): Promise<UserProfile> {
  const response = await apiClient.post<{ success: true; data: AuthResponse }>('/auth/login', {
    email,
    password,
  });

  const { user, tokens } = response.data.data;
  setTokens(tokens);
  return user;
}

/**
 * Refresh the access token using stored refresh token.
 */
export async function refreshApi(): Promise<AuthTokens | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await apiClient.post<{ success: true; data: RefreshResponse }>(
      '/auth/refresh',
      { refreshToken },
    );
    const { tokens } = response.data.data;
    setTokens(tokens);
    return tokens;
  } catch {
    clearTokens();
    return null;
  }
}

/**
 * Logout – invalidate refresh token and clear local storage.
 */
export async function logoutApi(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await apiClient.post('/auth/logout', { refreshToken });
    }
  } finally {
    clearTokens();
  }
}

/**
 * Get current user profile.
 */
export async function getMeApi(): Promise<UserProfile> {
  const response = await apiClient.get<{ success: true; data: { user: UserProfile } }>('/auth/me');
  return response.data.data.user;
}
