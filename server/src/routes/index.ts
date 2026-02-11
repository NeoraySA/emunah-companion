import { Router } from 'express';
import { healthRouter } from './health.routes';
import { authRouter } from './auth.routes';
import { languageRouter } from './language.routes';
import { homeButtonRouter } from './home-button.routes';
import { translationRouter } from './translation.routes';
import { scenarioRouter } from './scenario.routes';

const router = Router();

// Health check
router.use('/health', healthRouter);

// Auth
router.use('/auth', authRouter);

// Core resources
router.use('/languages', languageRouter);
router.use('/home-buttons', homeButtonRouter);
router.use('/translations', translationRouter);
router.use('/scenarios', scenarioRouter);

// Future routes will be added here:
// router.use('/journal', journalRouter);
// router.use('/anchors', anchorRouter);
// router.use('/media', mediaRouter);
// router.use('/users', userRouter);

export { router };
