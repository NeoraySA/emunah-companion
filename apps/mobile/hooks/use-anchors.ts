import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete } from '@services/api-helpers';
import type { Anchor, CreateAnchor } from '@emunah/shared';

/**
 * Fetch user's anchors.
 */
export function useAnchors() {
  return useQuery({
    queryKey: ['anchors'],
    queryFn: () => apiGet<Anchor[]>('/anchors'),
  });
}

/**
 * Create a new anchor.
 */
export function useCreateAnchor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAnchor) => apiPost<Anchor>('/anchors', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['anchors'] }),
  });
}

/**
 * Update an existing anchor.
 */
export function useUpdateAnchor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<CreateAnchor> & { id: number }) =>
      apiPut<Anchor>(`/anchors/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['anchors'] }),
  });
}

/**
 * Delete an anchor.
 */
export function useDeleteAnchor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiDelete<void>(`/anchors/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['anchors'] }),
  });
}
