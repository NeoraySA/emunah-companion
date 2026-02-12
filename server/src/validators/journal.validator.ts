// ============================================
// Journal Entry Validators
// ============================================

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export const createJournalSchema = z.object({
  scenarioId: z.number().int().positive().optional(),
  title: z.string().max(500).optional(),
  body: z.string().min(1, 'Body is required'),
  mood: z.string().max(50).optional(),
});

export type CreateJournalInput = z.infer<typeof createJournalSchema>;

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export const updateJournalSchema = z.object({
  title: z.string().max(500).nullable().optional(),
  body: z.string().min(1).optional(),
  mood: z.string().max(50).nullable().optional(),
});

export type UpdateJournalInput = z.infer<typeof updateJournalSchema>;

// ---------------------------------------------------------------------------
// Query params (for listing)
// ---------------------------------------------------------------------------

export const journalQuerySchema = z.object({
  scenarioId: z.coerce.number().int().positive().optional(),
  mood: z.string().max(50).optional(),
});

export type JournalQueryInput = z.infer<typeof journalQuerySchema>;
