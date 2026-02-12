// ============================================
// Journal Routes
// ============================================
// All journal endpoints require authentication (user-scoped).

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createJournalSchema, updateJournalSchema } from '../validators/journal.validator';
import {
  listJournalEntriesHandler,
  getJournalEntryHandler,
  createJournalEntryHandler,
  updateJournalEntryHandler,
  deleteJournalEntryHandler,
} from '../controllers/journal.controller';

const journalRouter = Router();

// All routes require authentication
journalRouter.use(authenticate);

// GET  /api/v1/journal          – List user's entries (paginated, filterable)
journalRouter.get('/', listJournalEntriesHandler);

// GET  /api/v1/journal/:id      – Get single entry
journalRouter.get('/:id', getJournalEntryHandler);

// POST /api/v1/journal          – Create entry
journalRouter.post('/', validate(createJournalSchema), createJournalEntryHandler);

// PUT  /api/v1/journal/:id      – Update entry
journalRouter.put('/:id', validate(updateJournalSchema), updateJournalEntryHandler);

// DELETE /api/v1/journal/:id    – Soft-delete entry
journalRouter.delete('/:id', deleteJournalEntryHandler);

export { journalRouter };
