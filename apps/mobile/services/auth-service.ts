import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@constants/config';
import apiClient from './api-client';
import type { AuthUser } from '@store/auth-store';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
  await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await axios.post(`${API_BASE_URL}/auth/login`, payload);
  const result = data.data as LoginResponse;
  await saveTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
  return result;
}

export async function registerApi(payload: RegisterPayload): Promise<LoginResponse> {
  const { data } = await axios.post(`${API_BASE_URL}/auth/register`, payload);
  const result = data.data as LoginResponse;
  await saveTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
  return result;
}

export async function logoutApi(): Promise<void> {
  try {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      await apiClient.post('/auth/logout', { refreshToken });
    }
  } catch {
    // Ignore errors – we clear tokens regardless
  } finally {
    await clearTokens();
  }
}

export async function getMeApi(): Promise<AuthUser> {
  const { data } = await apiClient.get('/auth/me');
  return data.data as AuthUser;
}

export async function refreshTokenApi(): Promise<AuthTokens> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
  const tokens: AuthTokens = {
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  };
  await saveTokens(tokens);
  return tokens;
}
