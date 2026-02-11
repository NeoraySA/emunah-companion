// ============================================
// Scenario Routes (includes nested step routes)
// ============================================

import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createScenarioSchema,
  updateScenarioSchema,
  createStepSchema,
  updateStepSchema,
} from '../validators/scenario.validator';
import {
  listScenariosHandler,
  listAllScenariosHandler,
  getScenarioHandler,
  createScenarioHandler,
  updateScenarioHandler,
  deleteScenarioHandler,
  listStepsHandler,
  createStepHandler,
  updateStepHandler,
  deleteStepHandler,
} from '../controllers/scenario.controller';

const scenarioRouter = Router();

// --- Scenarios ---

// Public / User (paginated)
scenarioRouter.get('/', authenticate, listScenariosHandler);

// Admin (paginated, includes inactive)
scenarioRouter.get('/all', authenticate, authorize('admin'), listAllScenariosHandler);

// Get single scenario with steps
scenarioRouter.get('/:id', authenticate, getScenarioHandler);

// Admin CRUD
scenarioRouter.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createScenarioSchema),
  createScenarioHandler,
);
scenarioRouter.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateScenarioSchema),
  updateScenarioHandler,
);
scenarioRouter.delete('/:id', authenticate, authorize('admin'), deleteScenarioHandler);

// --- Scenario Steps (nested) ---

scenarioRouter.get('/:scenarioId/steps', authenticate, listStepsHandler);
scenarioRouter.post(
  '/:scenarioId/steps',
  authenticate,
  authorize('admin'),
  validate(createStepSchema),
  createStepHandler,
);
scenarioRouter.put(
  '/:scenarioId/steps/:stepId',
  authenticate,
  authorize('admin'),
  validate(updateStepSchema),
  updateStepHandler,
);
scenarioRouter.delete(
  '/:scenarioId/steps/:stepId',
  authenticate,
  authorize('admin'),
  deleteStepHandler,
);

export { scenarioRouter };
