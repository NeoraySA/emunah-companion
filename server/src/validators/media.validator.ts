// ============================================
// Media Validators
// ============================================

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Upload metadata (optional, sent alongside file)
// ---------------------------------------------------------------------------

export const uploadMediaSchema = z.object({
  entityType: z.string().max(50).optional(),
  entityId: z.coerce.number().int().positive().optional(),
});

export type UploadMediaInput = z.infer<typeof uploadMediaSchema>;

// ---------------------------------------------------------------------------
// List query
// ---------------------------------------------------------------------------

export const listMediaQuerySchema = z.object({
  entityType: z.string().max(50).optional(),
  entityId: z.coerce.number().int().positive().optional(),
});

export type ListMediaQueryInput = z.infer<typeof listMediaQuerySchema>;
