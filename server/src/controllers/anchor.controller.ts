// ============================================
// Anchor Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as anchorService from '../services/anchor.service';

/**
 * GET /api/v1/anchors – List user's anchors (paginated)
 */
export async function listAnchorsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const result = await anchorService.listAnchors(req, userId);
    res.json({ success: true, data: result.anchors, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/anchors – Create anchor
 */
export async function createAnchorHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const anchor = await anchorService.createAnchor(userId, req.body);
    res.status(201).json({ success: true, data: anchor });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/anchors/:id – Update anchor
 */
export async function updateAnchorHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const id = parseInt(req.params.id, 10);
    const anchor = await anchorService.updateAnchor(id, userId, req.body);
    res.json({ success: true, data: anchor });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/anchors/:id – Soft-delete anchor
 */
export async function deleteAnchorHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const id = parseInt(req.params.id, 10);
    await anchorService.deleteAnchor(id, userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
