// ============================================
// Language Routes
// ============================================

import { Router } from 'express';
import { listLanguagesHandler } from '../controllers/language.controller';

const languageRouter = Router();

// Public
languageRouter.get('/', listLanguagesHandler);

export { languageRouter };
