// ============================================
// Translation Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as translationService from '../services/translation.service';
import { getTranslationsQuerySchema } from '../validators/translation.validator';
import { ValidationError } from '../utils/errors';
import { ZodError } from 'zod';

/**
 * GET /api/v1/translations?entityType=...&entityId=...&languageId=...
 */
export async function getTranslationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = getTranslationsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      const details = (parsed.error as ZodError).errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      throw new ValidationError('Invalid query parameters', details);
    }

    const translations = await translationService.getTranslations(parsed.data);
    res.json({ success: true, data: translations });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/translations (admin – bulk upsert)
 */
export async function upsertTranslationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const results = await translationService.upsertTranslations(req.body);
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
}
