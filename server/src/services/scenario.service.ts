// ============================================
// Scenario Service – Business Logic
// ============================================

import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { NotFoundError, ConflictError } from '../utils/errors';
import { parsePagination, parseSort, buildPaginationMeta } from '../utils/pagination';
import type { Request } from 'express';
import type {
  CreateScenarioInput,
  UpdateScenarioInput,
  CreateStepInput,
  UpdateStepInput,
} from '../validators/scenario.validator';

// ---------------------------------------------------------------------------
// Scenarios
// ---------------------------------------------------------------------------

const SCENARIO_SORT_FIELDS = ['sortOrder', 'createdAt', 'category', 'key'];

/**
 * List active scenarios with pagination (user-facing).
 */
export async function listScenarios(req: Request) {
  const pagination = parsePagination(req);
  const sort = parseSort(req, SCENARIO_SORT_FIELDS, 'sortOrder');

  const [total, scenarios] = await prisma.$transaction([
    prisma.scenario.count({ where: { deletedAt: null, isActive: true } }),
    prisma.scenario.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { [sort.sortBy]: sort.order },
      skip: pagination.skip,
      take: pagination.limit,
      include: { _count: { select: { steps: { where: { deletedAt: null } } } } },
    }),
  ]);

  return { scenarios, meta: buildPaginationMeta(total, pagination) };
}

/**
 * List all scenarios including inactive (admin).
 */
export async function listAllScenarios(req: Request) {
  const pagination = parsePagination(req);
  const sort = parseSort(req, SCENARIO_SORT_FIELDS, 'sortOrder');

  const [total, scenarios] = await prisma.$transaction([
    prisma.scenario.count({ where: { deletedAt: null } }),
    prisma.scenario.findMany({
      where: { deletedAt: null },
      orderBy: { [sort.sortBy]: sort.order },
      skip: pagination.skip,
      take: pagination.limit,
      include: { _count: { select: { steps: { where: { deletedAt: null } } } } },
    }),
  ]);

  return { scenarios, meta: buildPaginationMeta(total, pagination) };
}

/**
 * Get a single scenario with all its steps.
 */
export async function getScenario(id: number) {
  const scenario = await prisma.scenario.findFirst({
    where: { id, deletedAt: null },
    include: {
      steps: {
        where: { deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
  if (!scenario) throw new NotFoundError('Scenario not found');
  return scenario;
}

/**
 * Create a new scenario (admin).
 */
export async function createScenario(input: CreateScenarioInput) {
  const existing = await prisma.scenario.findUnique({ where: { key: input.key } });
  if (existing && !existing.deletedAt) {
    throw new ConflictError(`Scenario with key "${input.key}" already exists`);
  }
  return prisma.scenario.create({ data: input });
}

/**
 * Update a scenario (admin).
 */
export async function updateScenario(id: number, input: UpdateScenarioInput) {
  await getScenario(id);

  if (input.key) {
    const existing = await prisma.scenario.findUnique({ where: { key: input.key } });
    if (existing && existing.id !== id && !existing.deletedAt) {
      throw new ConflictError(`Scenario with key "${input.key}" already exists`);
    }
  }

  return prisma.scenario.update({ where: { id }, data: input });
}

/**
 * Soft-delete a scenario (admin).
 */
export async function deleteScenario(id: number) {
  await getScenario(id);
  return prisma.scenario.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

// ---------------------------------------------------------------------------
// Scenario Steps
// ---------------------------------------------------------------------------

/**
 * Ensure scenario exists.
 */
async function ensureScenario(scenarioId: number) {
  const scenario = await prisma.scenario.findFirst({
    where: { id: scenarioId, deletedAt: null },
  });
  if (!scenario) throw new NotFoundError('Scenario not found');
  return scenario;
}

/**
 * List steps for a scenario.
 */
export async function listSteps(scenarioId: number) {
  await ensureScenario(scenarioId);
  return prisma.scenarioStep.findMany({
    where: { scenarioId, deletedAt: null },
    orderBy: { sortOrder: 'asc' },
  });
}

/**
 * Create a step within a scenario (admin).
 */
export async function createStep(scenarioId: number, input: CreateStepInput) {
  await ensureScenario(scenarioId);

  // Check for duplicate stepNumber within this scenario
  const existing = await prisma.scenarioStep.findFirst({
    where: { scenarioId, stepNumber: input.stepNumber, deletedAt: null },
  });
  if (existing) {
    throw new ConflictError(`Step number ${input.stepNumber} already exists in this scenario`);
  }

  return prisma.scenarioStep.create({
    data: {
      scenarioId,
      stepNumber: input.stepNumber,
      stepType: input.stepType,
      sortOrder: input.sortOrder,
      configJson:
        input.configJson === null
          ? Prisma.JsonNull
          : (input.configJson as Prisma.InputJsonValue | undefined),
    },
  });
}

/**
 * Update a step (admin).
 */
export async function updateStep(scenarioId: number, stepId: number, input: UpdateStepInput) {
  await ensureScenario(scenarioId);

  const step = await prisma.scenarioStep.findFirst({
    where: { id: stepId, scenarioId, deletedAt: null },
  });
  if (!step) throw new NotFoundError('Step not found');

  if (input.stepNumber && input.stepNumber !== step.stepNumber) {
    const existing = await prisma.scenarioStep.findFirst({
      where: { scenarioId, stepNumber: input.stepNumber, deletedAt: null, id: { not: stepId } },
    });
    if (existing) {
      throw new ConflictError(`Step number ${input.stepNumber} already exists in this scenario`);
    }
  }

  const data: Record<string, unknown> = { ...input };
  if (data.configJson === null) {
    data.configJson = Prisma.JsonNull;
  }
  return prisma.scenarioStep.update({ where: { id: stepId }, data });
}

/**
 * Soft-delete a step (admin).
 */
export async function deleteStep(scenarioId: number, stepId: number) {
  await ensureScenario(scenarioId);

  const step = await prisma.scenarioStep.findFirst({
    where: { id: stepId, scenarioId, deletedAt: null },
  });
  if (!step) throw new NotFoundError('Step not found');

  return prisma.scenarioStep.update({
    where: { id: stepId },
    data: { deletedAt: new Date() },
  });
}
