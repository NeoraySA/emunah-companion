// ============================================
// Translation Routes
// ============================================

import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { upsertTranslationsSchema } from '../validators/translation.validator';
import {
  getTranslationsHandler,
  upsertTranslationsHandler,
} from '../controllers/translation.controller';

const translationRouter = Router();

// Public – filtered by query params
translationRouter.get('/', getTranslationsHandler);

// Admin – bulk upsert
translationRouter.put(
  '/',
  authenticate,
  authorize('admin'),
  validate(upsertTranslationsSchema),
  upsertTranslationsHandler,
);

export { translationRouter };
