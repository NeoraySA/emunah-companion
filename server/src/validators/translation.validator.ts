// ============================================
// Translation Validation Schemas (Zod)
// ============================================

import { z } from 'zod';

export const getTranslationsQuerySchema = z.object({
  entityType: z.string().min(1).max(50),
  entityId: z.coerce.number().int().positive().optional(),
  languageId: z.coerce.number().int().positive().optional(),
  fieldName: z.string().max(100).optional(),
});

const singleTranslationSchema = z.object({
  entityType: z.string().min(1).max(50),
  entityId: z.number().int().positive(),
  languageId: z.number().int().positive(),
  fieldName: z.string().min(1).max(100),
  value: z.string().min(1),
});

export const upsertTranslationsSchema = z.object({
  translations: z.array(singleTranslationSchema).min(1).max(500),
});

export type GetTranslationsQuery = z.infer<typeof getTranslationsQuerySchema>;
export type UpsertTranslationsInput = z.infer<typeof upsertTranslationsSchema>;
