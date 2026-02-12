// ============================================
// Anchor (Reminder) Validators
// ============================================

import { z } from 'zod';

const scheduleTypeEnum = z.enum(['once', 'daily', 'weekly', 'custom']);

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export const createAnchorSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  body: z.string().optional(),
  scheduleType: scheduleTypeEnum.default('once'),
  scheduleConfig: z.record(z.unknown()).nullable().optional(),
  isActive: z.boolean().default(true),
});

export type CreateAnchorInput = z.infer<typeof createAnchorSchema>;

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export const updateAnchorSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  body: z.string().nullable().optional(),
  scheduleType: scheduleTypeEnum.optional(),
  scheduleConfig: z.record(z.unknown()).nullable().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateAnchorInput = z.infer<typeof updateAnchorSchema>;
