// ============================================
// Home Button Routes
// ============================================

import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createHomeButtonSchema,
  updateHomeButtonSchema,
} from '../validators/home-button.validator';
import {
  listHomeButtonsHandler,
  listAllHomeButtonsHandler,
  getHomeButtonHandler,
  createHomeButtonHandler,
  updateHomeButtonHandler,
  deleteHomeButtonHandler,
} from '../controllers/home-button.controller';

const homeButtonRouter = Router();

// Public
homeButtonRouter.get('/', listHomeButtonsHandler);

// Admin
homeButtonRouter.get('/all', authenticate, authorize('admin'), listAllHomeButtonsHandler);
homeButtonRouter.get('/:id', authenticate, authorize('admin', 'editor'), getHomeButtonHandler);
homeButtonRouter.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createHomeButtonSchema),
  createHomeButtonHandler,
);
homeButtonRouter.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateHomeButtonSchema),
  updateHomeButtonHandler,
);
homeButtonRouter.delete('/:id', authenticate, authorize('admin'), deleteHomeButtonHandler);

export { homeButtonRouter };
