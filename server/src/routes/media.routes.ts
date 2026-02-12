// ============================================
// Media Routes
// ============================================

import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import {
  uploadMediaHandler,
  listMediaHandler,
  getMediaUrlHandler,
  deleteMediaHandler,
} from '../controllers/media.controller';

const mediaRouter = Router();

// All routes require authentication
mediaRouter.use(authenticate);

// POST /api/v1/media/upload – Upload file (admin only)
mediaRouter.post('/upload', authorize('admin'), upload.single('file'), uploadMediaHandler);

// GET  /api/v1/media – List media assets (admin only)
mediaRouter.get('/', authorize('admin'), listMediaHandler);

// GET  /api/v1/media/:id/url – Get signed URL (any authenticated user)
mediaRouter.get('/:id/url', getMediaUrlHandler);

// DELETE /api/v1/media/:id – Soft-delete (admin only)
mediaRouter.delete('/:id', authorize('admin'), deleteMediaHandler);

export { mediaRouter };
