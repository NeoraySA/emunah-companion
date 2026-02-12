// ============================================
// Anchor Service – Business Logic
// ============================================

import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { NotFoundError } from '../utils/errors';
import { parsePagination, parseSort, buildPaginationMeta } from '../utils/pagination';
import type { Request } from 'express';
import type { CreateAnchorInput, UpdateAnchorInput } from '../validators/anchor.validator';

const SORT_FIELDS = ['createdAt', 'title', 'isActive', 'scheduleType'];

// ---------------------------------------------------------------------------
// List (paginated, user-scoped)
// ---------------------------------------------------------------------------

export async function listAnchors(req: Request, userId: number) {
  const pagination = parsePagination(req);
  const sort = parseSort(req, SORT_FIELDS, 'createdAt');

  const where = { userId, deletedAt: null };

  const [total, anchors] = await prisma.$transaction([
    prisma.anchor.count({ where }),
    prisma.anchor.findMany({
      where,
      orderBy: { [sort.sortBy]: sort.order },
      skip: pagination.skip,
      take: pagination.limit,
    }),
  ]);

  return { anchors, meta: buildPaginationMeta(total, pagination) };
}

// ---------------------------------------------------------------------------
// Get single (user-scoped)
// ---------------------------------------------------------------------------

export async function getAnchor(id: number, userId: number) {
  const anchor = await prisma.anchor.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!anchor) {
    throw new NotFoundError('Anchor not found');
  }

  return anchor;
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createAnchor(userId: number, input: CreateAnchorInput) {
  const data: Prisma.AnchorCreateInput = {
    title: input.title,
    body: input.body ?? null,
    scheduleType: input.scheduleType,
    scheduleConfig:
      input.scheduleConfig === null || input.scheduleConfig === undefined
        ? Prisma.JsonNull
        : (input.scheduleConfig as Prisma.InputJsonValue),
    isActive: input.isActive,
    user: { connect: { id: userId } },
  };

  return prisma.anchor.create({ data });
}

// ---------------------------------------------------------------------------
// Update (user-scoped)
// ---------------------------------------------------------------------------

export async function updateAnchor(id: number, userId: number, input: UpdateAnchorInput) {
  const existing = await prisma.anchor.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError('Anchor not found');
  }

  const data: Record<string, unknown> = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.body !== undefined) data.body = input.body;
  if (input.scheduleType !== undefined) data.scheduleType = input.scheduleType;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  if (input.scheduleConfig !== undefined) {
    data.scheduleConfig =
      input.scheduleConfig === null
        ? Prisma.JsonNull
        : (input.scheduleConfig as Prisma.InputJsonValue);
  }

  return prisma.anchor.update({ where: { id }, data });
}

// ---------------------------------------------------------------------------
// Delete (soft, user-scoped)
// ---------------------------------------------------------------------------

export async function deleteAnchor(id: number, userId: number) {
  const existing = await prisma.anchor.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError('Anchor not found');
  }

  await prisma.anchor.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
