// ============================================
// User Controller – Profile & Admin Management
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { listUsersQuerySchema } from '../validators/user.validator';

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

// =====================================================================
// Admin handlers
// =====================================================================

/**
 * GET /api/v1/users – List all users (admin)
 */
export async function listUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listUsersQuerySchema.parse(req.query);
    const result = await userService.listUsers(query);
    res.json({ success: true, data: result.users, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/users/:id – Get single user (admin)
 */
export async function getUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const user = await userService.getUserById(id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/users/:id – Update user role/status (admin)
 */
export async function adminUpdateUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const user = await userService.adminUpdateUser(id, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/users/:id – Soft-delete user (admin)
 */
export async function deleteUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
