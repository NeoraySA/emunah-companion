// ============================================
// Scenario Validation Schemas (Zod)
// ============================================

import { z } from 'zod';

// --- Scenarios ---

export const createScenarioSchema = z.object({
  key: z.string().min(1).max(100),
  category: z.string().min(1).max(100),
  sortOrder: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateScenarioSchema = z.object({
  key: z.string().min(1).max(100).optional(),
  category: z.string().min(1).max(100).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

// --- Scenario Steps ---

const stepTypeEnum = z.enum(['text', 'prompt', 'action', 'summary']);

export const createStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  stepType: stepTypeEnum.optional().default('text'),
  configJson: z.record(z.unknown()).nullable().optional(),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const updateStepSchema = z.object({
  stepNumber: z.number().int().positive().optional(),
  stepType: stepTypeEnum.optional(),
  configJson: z.record(z.unknown()).nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

// Inferred types
export type CreateScenarioInput = z.infer<typeof createScenarioSchema>;
export type UpdateScenarioInput = z.infer<typeof updateScenarioSchema>;
export type CreateStepInput = z.infer<typeof createStepSchema>;
export type UpdateStepInput = z.infer<typeof updateStepSchema>;
