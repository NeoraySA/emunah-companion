// ============================================
// User Routes – Profile Management
// ============================================

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema } from '../validators/user.validator';
import { getProfileHandler, updateProfileHandler } from '../controllers/user.controller';

const userRouter = Router();

// All routes require authentication
userRouter.use(authenticate);

// GET /api/v1/users/me – Get current user profile
userRouter.get('/me', getProfileHandler);

// PUT /api/v1/users/me – Update profile / preferences
userRouter.put('/me', validate(updateProfileSchema), updateProfileHandler);

export { userRouter };
