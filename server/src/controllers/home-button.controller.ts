// ============================================
// Home Button Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as homeButtonService from '../services/home-button.service';

/**
 * GET /api/v1/home-buttons (public – active only)
 */
export async function listHomeButtonsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const buttons = await homeButtonService.listHomeButtons();
    res.json({ success: true, data: buttons });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/home-buttons/all (admin – includes inactive)
 */
export async function listAllHomeButtonsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const buttons = await homeButtonService.listAllHomeButtons();
    res.json({ success: true, data: buttons });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/home-buttons/:id
 */
export async function getHomeButtonHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const button = await homeButtonService.getHomeButton(id);
    res.json({ success: true, data: button });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/home-buttons (admin)
 */
export async function createHomeButtonHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const button = await homeButtonService.createHomeButton(req.body);
    res.status(201).json({ success: true, data: button });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/home-buttons/:id (admin)
 */
export async function updateHomeButtonHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const button = await homeButtonService.updateHomeButton(id, req.body);
    res.json({ success: true, data: button });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/home-buttons/:id (admin)
 */
export async function deleteHomeButtonHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    await homeButtonService.deleteHomeButton(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
