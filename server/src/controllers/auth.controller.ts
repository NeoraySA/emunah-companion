// ============================================
// Auth Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

/**
 * POST /api/v1/auth/register
 */
export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        tokens: result.tokens,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/login
 */
export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);

    res.json({
      success: true,
      data: {
        user: result.user,
        tokens: result.tokens,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/refresh
 */
export async function refreshHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refresh(refreshToken);

    res.json({
      success: true,
      data: { tokens },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/logout
 */
export async function logoutHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);

    res.json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/change-password
 */
export async function changePasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    await authService.changePassword(userId, req.body);

    res.json({
      success: true,
      data: { message: 'Password changed successfully' },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/auth/me
 */
export async function meHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const user = await authService.getProfile(userId);

    res.json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}
