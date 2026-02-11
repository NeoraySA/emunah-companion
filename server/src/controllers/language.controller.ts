// ============================================
// Language Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as languageService from '../services/language.service';

/**
 * GET /api/v1/languages
 */
export async function listLanguagesHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const languages = await languageService.listLanguages();
    res.json({ success: true, data: languages });
  } catch (err) {
    next(err);
  }
}
