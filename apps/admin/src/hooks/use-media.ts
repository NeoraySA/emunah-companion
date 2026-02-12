'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiDelete, apiClient } from '@/services/api-client';
import type { MediaAsset, MediaUploadResponse } from '@emunah/shared';

const QUERY_KEY = 'media';

interface MediaListResponse {
  media: MediaAsset[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface MediaUrlResponse {
  url: string;
}

/**
 * Fetch paginated media list.
 */
export function useMedia(params?: {
  page?: number;
  limit?: number;
  entityType?: string;
  entityId?: number;
}) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: async () => {
      const response = await apiClient.get<{ success: true; data: MediaListResponse }>('/media', {
        params,
      });
      return response.data.data;
    },
  });
}

/**
 * Upload a file.
 */
export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post<{ success: true; data: MediaUploadResponse }>(
        '/media/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/**
 * Get signed URL for a media asset.
 */
export function useMediaUrl(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, 'url', id],
    queryFn: () => apiGet<MediaUrlResponse>(`/media/${id}/url`).then((r) => r.url),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes (signed URLs valid for ~15 min)
  });
}

/**
 * Delete a media asset.
 */
export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
