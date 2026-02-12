// ============================================
// User Controller – Profile Management
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

/**
 * GET /api/v1/users/me – Get current user profile
 */
export async function getProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const profile = await userService.getUserProfile(userId);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/users/me – Update current user profile
 */
export async function updateProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const profile = await userService.updateUserProfile(userId, req.body);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}
