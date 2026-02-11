import axios from 'axios';
import { API_BASE_URL } from '@constants/config';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './auth-service';
import { useAuthStore } from '@store/auth-store';

/**
 * Pre-configured Axios instance for API calls.
 * Handles JWT token injection and refresh logic.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – attach access token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor – handle 401 / token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        await saveTokens({
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        });

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch {
        // Refresh failed – clear tokens, reset auth state → triggers redirect to login
        await clearTokens();
        useAuthStore.getState().clearUser();
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
