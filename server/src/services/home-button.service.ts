// ============================================
// Home Button Service – Business Logic
// ============================================

import { prisma } from '../utils/prisma';
import { NotFoundError, ConflictError } from '../utils/errors';
import type {
  CreateHomeButtonInput,
  UpdateHomeButtonInput,
} from '../validators/home-button.validator';

/**
 * List active home buttons (public – ordered by sortOrder).
 */
export async function listHomeButtons() {
  return prisma.homeButton.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
}

/**
 * List all home buttons including inactive (admin).
 */
export async function listAllHomeButtons() {
  return prisma.homeButton.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: 'asc' },
  });
}

/**
 * Get a single home button by id.
 */
export async function getHomeButton(id: number) {
  const button = await prisma.homeButton.findFirst({
    where: { id, deletedAt: null },
  });
  if (!button) throw new NotFoundError('Home button not found');
  return button;
}

/**
 * Create a new home button (admin).
 */
export async function createHomeButton(input: CreateHomeButtonInput) {
  const existing = await prisma.homeButton.findUnique({ where: { key: input.key } });
  if (existing && !existing.deletedAt) {
    throw new ConflictError(`Home button with key "${input.key}" already exists`);
  }

  return prisma.homeButton.create({ data: input });
}

/**
 * Update a home button (admin).
 */
export async function updateHomeButton(id: number, input: UpdateHomeButtonInput) {
  await getHomeButton(id); // throws NotFoundError if missing

  if (input.key) {
    const existing = await prisma.homeButton.findUnique({ where: { key: input.key } });
    if (existing && existing.id !== id && !existing.deletedAt) {
      throw new ConflictError(`Home button with key "${input.key}" already exists`);
    }
  }

  return prisma.homeButton.update({
    where: { id },
    data: input,
  });
}

/**
 * Soft-delete a home button (admin).
 */
export async function deleteHomeButton(id: number) {
  await getHomeButton(id); // throws NotFoundError if missing
  return prisma.homeButton.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
