// ============================================
// Anchor Routes
// ============================================
// All anchor endpoints require authentication (user-scoped).

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createAnchorSchema, updateAnchorSchema } from '../validators/anchor.validator';
import {
  listAnchorsHandler,
  createAnchorHandler,
  updateAnchorHandler,
  deleteAnchorHandler,
} from '../controllers/anchor.controller';

const anchorRouter = Router();

// All routes require authentication
anchorRouter.use(authenticate);

// GET  /api/v1/anchors          – List user's anchors (paginated)
anchorRouter.get('/', listAnchorsHandler);

// POST /api/v1/anchors          – Create anchor
anchorRouter.post('/', validate(createAnchorSchema), createAnchorHandler);

// PUT  /api/v1/anchors/:id      – Update anchor
anchorRouter.put('/:id', validate(updateAnchorSchema), updateAnchorHandler);

// DELETE /api/v1/anchors/:id    – Soft-delete anchor
anchorRouter.delete('/:id', deleteAnchorHandler);

export { anchorRouter };
