// ============================================
// User Service – Profile Management
// ============================================

import { prisma } from '../utils/prisma';
import { NotFoundError } from '../utils/errors';
import type { UpdateProfileInput } from '../validators/user.validator';
import type { RoleName } from '@emunah/shared';

// ---------------------------------------------------------------------------
// Get profile
// ---------------------------------------------------------------------------

export async function getUserProfile(userId: number) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    include: { role: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    preferredLang: user.preferredLang,
    role: user.role.name as RoleName,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}

// ---------------------------------------------------------------------------
// Update profile
// ---------------------------------------------------------------------------

export async function updateUserProfile(userId: number, input: UpdateProfileInput) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const data: Record<string, unknown> = {};
  if (input.displayName !== undefined) data.displayName = input.displayName;
  if (input.preferredLang !== undefined) data.preferredLang = input.preferredLang;

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    include: { role: true },
  });

  return {
    id: updated.id,
    email: updated.email,
    displayName: updated.displayName,
    preferredLang: updated.preferredLang,
    role: updated.role.name as RoleName,
    isActive: updated.isActive,
    lastLoginAt: updated.lastLoginAt,
    createdAt: updated.createdAt,
  };
}
