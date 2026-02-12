// ============================================
// Journal Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as journalService from '../services/journal.service';
import { journalQuerySchema } from '../validators/journal.validator';

/**
 * GET /api/v1/journal – List user's journal entries (paginated)
 */
export async function listJournalEntriesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const filters = journalQuerySchema.parse(req.query);
    const result = await journalService.listJournalEntries(req, userId, filters);
    res.json({ success: true, data: result.entries, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/journal/:id – Get single journal entry
 */
export async function getJournalEntryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const id = parseInt(req.params.id, 10);
    const entry = await journalService.getJournalEntry(id, userId);
    res.json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/journal – Create journal entry
 */
export async function createJournalEntryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const entry = await journalService.createJournalEntry(userId, req.body);
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/journal/:id – Update journal entry
 */
export async function updateJournalEntryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const id = parseInt(req.params.id, 10);
    const entry = await journalService.updateJournalEntry(id, userId, req.body);
    res.json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/journal/:id – Soft-delete journal entry
 */
export async function deleteJournalEntryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const id = parseInt(req.params.id, 10);
    await journalService.deleteJournalEntry(id, userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
