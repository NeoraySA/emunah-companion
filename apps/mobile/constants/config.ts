/**
 * App-wide configuration constants.
 * Values may be overridden by environment variables at build time.
 */

// API
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

// Secure storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'emunah_access_token',
  REFRESH_TOKEN: 'emunah_refresh_token',
  LANGUAGE: 'emunah_language',
} as const;

// Default language
export const DEFAULT_LANGUAGE = 'he';

// Theme colors (matching app.json splash background)
export const COLORS = {
  primary: '#1a365d',
  primaryLight: '#2d4a7c',
  secondary: '#3b82f6',
  accent: '#f59e0b',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  background: '#f8fafc',
  surface: '#ffffff',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  border: '#e2e8f0',
} as const;
