// ============================================
// User Service – Profile & Admin Management
// ============================================

import { prisma } from '../utils/prisma';
import { NotFoundError, BadRequestError } from '../utils/errors';
import type {
  UpdateProfileInput,
  ListUsersQuery,
  AdminUpdateUserInput,
} from '../validators/user.validator';
import type { RoleName } from '@emunah/shared';

// ---------------------------------------------------------------------------
// Helper – format user for response
// ---------------------------------------------------------------------------

function formatUser(user: {
  id: number;
  email: string;
  displayName: string | null;
  preferredLang: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  role: { name: string };
}) {
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
// Get profile (self)
// ---------------------------------------------------------------------------

export async function getUserProfile(userId: number) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    include: { role: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return formatUser(user);
}

// ---------------------------------------------------------------------------
// Update profile (self)
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

  return formatUser(updated);
}

// =====================================================================
// Admin functions
// =====================================================================

// ---------------------------------------------------------------------------
// List users (admin)
// ---------------------------------------------------------------------------

export async function listUsers(query: ListUsersQuery) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;
  const sortField = query.sort ?? 'createdAt';
  const sortOrder = query.order ?? 'desc';

  const where: Record<string, unknown> = { deletedAt: null };

  // Filter by role name
  if (query.role) {
    const role = await prisma.role.findFirst({ where: { name: query.role } });
    if (role) where.roleId = role.id;
  }

  // Filter by active status
  if (query.isActive !== undefined) {
    where.isActive = query.isActive;
  }

  // Search by email or displayName
  if (query.search) {
    where.OR = [{ email: { contains: query.search } }, { displayName: { contains: query.search } }];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { role: true },
      orderBy: { [sortField]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: users.map(formatUser),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ---------------------------------------------------------------------------
// Get single user (admin)
// ---------------------------------------------------------------------------

export async function getUserById(userId: number) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    include: { role: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return formatUser(user);
}

// ---------------------------------------------------------------------------
// Update user (admin) – can change role, active status, etc.
// ---------------------------------------------------------------------------

export async function adminUpdateUser(userId: number, input: AdminUpdateUserInput) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const data: Record<string, unknown> = {};
  if (input.displayName !== undefined) data.displayName = input.displayName;
  if (input.preferredLang !== undefined) data.preferredLang = input.preferredLang;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  // Change role
  if (input.role) {
    const role = await prisma.role.findFirst({ where: { name: input.role } });
    if (!role) throw new BadRequestError(`Role "${input.role}" not found`);
    data.roleId = role.id;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    include: { role: true },
  });

  return formatUser(updated);
}

// ---------------------------------------------------------------------------
// Soft-delete user (admin)
// ---------------------------------------------------------------------------

export async function deleteUser(userId: number) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date(), isActive: false },
  });
}
