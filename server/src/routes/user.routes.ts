// ============================================
// User Routes – Profile & Admin Management
// ============================================

import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema, adminUpdateUserSchema } from '../validators/user.validator';
import {
  getProfileHandler,
  updateProfileHandler,
  listUsersHandler,
  getUserHandler,
  adminUpdateUserHandler,
  deleteUserHandler,
} from '../controllers/user.controller';

const userRouter = Router();

// All routes require authentication
userRouter.use(authenticate);

// --- Self-profile routes ---
// GET /api/v1/users/me – Get current user profile
userRouter.get('/me', getProfileHandler);

// PUT /api/v1/users/me – Update profile / preferences
userRouter.put('/me', validate(updateProfileSchema), updateProfileHandler);

// --- Admin routes (must come after /me to avoid conflict) ---
// GET /api/v1/users – List all users
userRouter.get('/', authorize('admin'), listUsersHandler);

// GET /api/v1/users/:id – Get single user
userRouter.get('/:id', authorize('admin'), getUserHandler);

// PUT /api/v1/users/:id – Update user (role, status, etc.)
userRouter.put('/:id', authorize('admin'), validate(adminUpdateUserSchema), adminUpdateUserHandler);

// DELETE /api/v1/users/:id – Soft-delete user
userRouter.delete('/:id', authorize('admin'), deleteUserHandler);

export { userRouter };
