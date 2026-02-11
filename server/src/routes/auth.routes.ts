// ============================================
// Auth Routes
// ============================================

import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from '../validators/auth.validator';
import {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  changePasswordHandler,
  meHandler,
} from '../controllers/auth.controller';

const authRouter = Router();

// Public routes
authRouter.post('/register', validate(registerSchema), registerHandler);
authRouter.post('/login', validate(loginSchema), loginHandler);
authRouter.post('/refresh', validate(refreshTokenSchema), refreshHandler);

// Protected routes
authRouter.post('/logout', authenticate, logoutHandler);
authRouter.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  changePasswordHandler,
);
authRouter.get('/me', authenticate, meHandler);

export { authRouter };
