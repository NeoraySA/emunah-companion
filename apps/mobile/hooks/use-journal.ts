import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete } from '@services/api-helpers';
import type { JournalEntry, CreateJournalEntry, UpdateJournalEntry } from '@emunah/shared';

/**
 * Fetch user's journal entries.
 */
export function useJournalEntries() {
  return useQuery({
    queryKey: ['journal'],
    queryFn: () => apiGet<JournalEntry[]>('/journal'),
  });
}

/**
 * Fetch a single journal entry.
 */
export function useJournalEntry(id: number) {
  return useQuery({
    queryKey: ['journal', id],
    queryFn: () => apiGet<JournalEntry>(`/journal/${id}`),
    enabled: !!id,
  });
}

/**
 * Create a new journal entry.
 */
export function useCreateJournalEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJournalEntry) => apiPost<JournalEntry>('/journal', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['journal'] }),
  });
}

/**
 * Update an existing journal entry.
 */
export function useUpdateJournalEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateJournalEntry & { id: number }) =>
      apiPut<JournalEntry>(`/journal/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['journal'] }),
  });
}

/**
 * Delete a journal entry.
 */
export function useDeleteJournalEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiDelete<void>(`/journal/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['journal'] }),
  });
}
