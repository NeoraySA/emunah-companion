// ============================================
// Scenario Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as scenarioService from '../services/scenario.service';

// ---------------------------------------------------------------------------
// Scenarios
// ---------------------------------------------------------------------------

/**
 * GET /api/v1/scenarios (user – active only, paginated)
 */
export async function listScenariosHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { scenarios, meta } = await scenarioService.listScenarios(req);
    res.json({ success: true, data: scenarios, meta });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/scenarios/all (admin – includes inactive, paginated)
 */
export async function listAllScenariosHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { scenarios, meta } = await scenarioService.listAllScenarios(req);
    res.json({ success: true, data: scenarios, meta });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/scenarios/:id (with steps)
 */
export async function getScenarioHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const scenario = await scenarioService.getScenario(id);
    res.json({ success: true, data: scenario });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/scenarios (admin)
 */
export async function createScenarioHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const scenario = await scenarioService.createScenario(req.body);
    res.status(201).json({ success: true, data: scenario });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/scenarios/:id (admin)
 */
export async function updateScenarioHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const scenario = await scenarioService.updateScenario(id, req.body);
    res.json({ success: true, data: scenario });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/scenarios/:id (admin)
 */
export async function deleteScenarioHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    await scenarioService.deleteScenario(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// Scenario Steps
// ---------------------------------------------------------------------------

/**
 * GET /api/v1/scenarios/:scenarioId/steps
 */
export async function listStepsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const scenarioId = parseInt(req.params.scenarioId, 10);
    const steps = await scenarioService.listSteps(scenarioId);
    res.json({ success: true, data: steps });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/scenarios/:scenarioId/steps (admin)
 */
export async function createStepHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const scenarioId = parseInt(req.params.scenarioId, 10);
    const step = await scenarioService.createStep(scenarioId, req.body);
    res.status(201).json({ success: true, data: step });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/scenarios/:scenarioId/steps/:stepId (admin)
 */
export async function updateStepHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const scenarioId = parseInt(req.params.scenarioId, 10);
    const stepId = parseInt(req.params.stepId, 10);
    const step = await scenarioService.updateStep(scenarioId, stepId, req.body);
    res.json({ success: true, data: step });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/scenarios/:scenarioId/steps/:stepId (admin)
 */
export async function deleteStepHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const scenarioId = parseInt(req.params.scenarioId, 10);
    const stepId = parseInt(req.params.stepId, 10);
    await scenarioService.deleteStep(scenarioId, stepId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
