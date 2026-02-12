// ============================================
// Media Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as mediaService from '../services/media.service';
import { uploadMediaSchema, listMediaQuerySchema } from '../validators/media.validator';
import { BadRequestError } from '../utils/errors';

/**
 * POST /api/v1/media/upload – Upload file to GCS (admin)
 */
export async function uploadMediaHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new BadRequestError('No file uploaded');
    }

    const input = uploadMediaSchema.parse(req.body);
    const userId = req.user!.userId;
    const asset = await mediaService.uploadMedia(req.file, userId, input);
    res.status(201).json({ success: true, data: asset });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/media – List media assets (admin, paginated)
 */
export async function listMediaHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = listMediaQuerySchema.parse(req.query);
    const result = await mediaService.listMedia(req, filters);
    res.json({ success: true, data: result.assets, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/media/:id/url – Get signed URL for asset (authenticated)
 */
export async function getMediaUrlHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const { url, asset } = await mediaService.getMediaSignedUrl(id);
    res.json({
      success: true,
      data: {
        url,
        filename: asset.filename,
        mimeType: asset.mimeType,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/media/:id – Soft-delete media record (admin)
 */
export async function deleteMediaHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    await mediaService.deleteMedia(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
