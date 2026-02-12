// ============================================
// User Profile Validators
// ============================================

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Update profile (self)
// ---------------------------------------------------------------------------

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(255).optional(),
  preferredLang: z.string().min(2).max(10).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ---------------------------------------------------------------------------
// Admin – list users query
// ---------------------------------------------------------------------------

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
  sort: z
    .enum(['createdAt', 'email', 'displayName', 'lastLoginAt'])
    .default('createdAt')
    .optional(),
  order: z.enum(['asc', 'desc']).default('desc').optional(),
  search: z.string().max(255).optional(),
  role: z.enum(['admin', 'editor', 'user']).optional(),
  isActive: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

// ---------------------------------------------------------------------------
// Admin – update user
// ---------------------------------------------------------------------------

export const adminUpdateUserSchema = z.object({
  displayName: z.string().min(1).max(255).optional(),
  preferredLang: z.string().min(2).max(10).optional(),
  role: z.enum(['admin', 'editor', 'user']).optional(),
  isActive: z.boolean().optional(),
});

export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
