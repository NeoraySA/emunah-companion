// ============================================
// User Profile Validators
// ============================================

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Update profile
// ---------------------------------------------------------------------------

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(255).optional(),
  preferredLang: z.string().min(2).max(10).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
