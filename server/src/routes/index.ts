import { Router } from 'express';
import { healthRouter } from './health.routes';
import { authRouter } from './auth.routes';

const router = Router();

// Health check
router.use('/health', healthRouter);

// Auth
router.use('/auth', authRouter);

// Future routes will be added here:
// router.use('/home-buttons', homeButtonRouter);
// router.use('/scenarios', scenarioRouter);
// router.use('/journal', journalRouter);
// router.use('/anchors', anchorRouter);
// router.use('/translations', translationRouter);
// router.use('/media', mediaRouter);
// router.use('/users', userRouter);

export { router };
