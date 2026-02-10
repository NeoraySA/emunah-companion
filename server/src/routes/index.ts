import { Router } from 'express';
import { healthRouter } from './health.routes';

const router = Router();

// Health check
router.use('/health', healthRouter);

// Future routes will be added here:
// router.use('/auth', authRouter);
// router.use('/home-buttons', homeButtonRouter);
// router.use('/scenarios', scenarioRouter);
// router.use('/journal', journalRouter);
// router.use('/anchors', anchorRouter);
// router.use('/translations', translationRouter);
// router.use('/media', mediaRouter);
// router.use('/users', userRouter);

export { router };
