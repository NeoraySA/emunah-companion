// ============================================
// Home Button Validation Schemas (Zod)
// ============================================

import { z } from 'zod';

export const createHomeButtonSchema = z.object({
  key: z.string().min(1).max(100),
  icon: z.string().min(1).max(255),
  route: z.string().min(1).max(255),
  sortOrder: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateHomeButtonSchema = z.object({
  key: z.string().min(1).max(100).optional(),
  icon: z.string().min(1).max(255).optional(),
  route: z.string().min(1).max(255).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type CreateHomeButtonInput = z.infer<typeof createHomeButtonSchema>;
export type UpdateHomeButtonInput = z.infer<typeof updateHomeButtonSchema>;
