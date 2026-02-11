// ============================================
// Auth Service – Business Logic
// ============================================

import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import {
  generateAccessToken,
  generateRefreshToken,
  parseExpiryToMs,
  getAccessExpirySeconds,
} from '../utils/jwt';
import { config } from '../config';
import { UnauthorizedError, ConflictError, NotFoundError, BadRequestError } from '../utils/errors';
import type { AuthTokens, UserProfile, RoleName } from '@emunah/shared';
import type { RegisterInput, LoginInput, ChangePasswordInput } from '../validators/auth.validator';

/**
 * Register a new user (default role: "user")
 */
export async function register(
  input: RegisterInput,
): Promise<{ user: UserProfile; tokens: AuthTokens }> {
  // Check if email already exists
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    throw new ConflictError('Email already registered');
  }

  // Find the "user" role
  const userRole = await prisma.role.findUnique({
    where: { name: 'user' },
  });
  if (!userRole) {
    throw new Error('Default role "user" not found in database');
  }

  // Create user
  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      displayName: input.displayName ?? null,
      preferredLang: input.preferredLang ?? 'he',
      roleId: userRole.id,
    },
    include: { role: true },
  });

  // Generate tokens
  const tokens = await createTokens(user.id, user.email, user.role.name as RoleName);

  return {
    user: toUserProfile(user),
    tokens,
  };
}

/**
 * Login with email and password
 */
export async function login(input: LoginInput): Promise<{ user: UserProfile; tokens: AuthTokens }> {
  // Find user by email (including soft-deleted check)
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { role: true },
  });

  if (!user || user.deletedAt !== null || !user.isActive) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Verify password
  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Update last login time
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate tokens
  const tokens = await createTokens(user.id, user.email, user.role.name as RoleName);

  return {
    user: toUserProfile(user),
    tokens,
  };
}

/**
 * Refresh the access token using a valid refresh token
 */
export async function refresh(refreshTokenValue: string): Promise<AuthTokens> {
  // Find the refresh token in DB
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenValue },
    include: { user: { include: { role: true } } },
  });

  if (!storedToken) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  // Check expiry
  if (storedToken.expiresAt < new Date()) {
    // Clean up expired token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new UnauthorizedError('Refresh token expired');
  }

  // Check user is still active
  const { user } = storedToken;
  if (!user.isActive || user.deletedAt !== null) {
    throw new UnauthorizedError('User account is inactive');
  }

  // Delete old refresh token (rotation)
  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  // Generate new token pair
  return createTokens(user.id, user.email, user.role.name as RoleName);
}

/**
 * Logout – invalidate a refresh token
 */
export async function logout(refreshTokenValue: string): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshTokenValue },
  });
}

/**
 * Change password for authenticated user
 */
export async function changePassword(userId: number, input: ChangePasswordInput): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Verify current password
  const valid = await comparePassword(input.currentPassword, user.passwordHash);
  if (!valid) {
    throw new BadRequestError('Current password is incorrect');
  }

  // Hash new password and update
  const newHash = await hashPassword(input.newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  // Invalidate all refresh tokens for this user (force re-login)
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
}

/**
 * Get user profile by id
 */
export async function getProfile(userId: number): Promise<UserProfile> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user || user.deletedAt !== null) {
    throw new NotFoundError('User not found');
  }

  return toUserProfile(user);
}

// ---- Internal Helpers ----

/**
 * Create access + refresh tokens and persist refresh token in DB
 */
async function createTokens(userId: number, email: string, role: RoleName): Promise<AuthTokens> {
  const accessToken = generateAccessToken({ userId, email, role });
  const refreshToken = generateRefreshToken();

  const refreshExpiryMs = parseExpiryToMs(config.jwt.refreshExpiresIn);
  const expiresAt = new Date(Date.now() + refreshExpiryMs);

  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: getAccessExpirySeconds(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toUserProfile(user: any): UserProfile {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    preferredLang: user.preferredLang,
    role: user.role.name as RoleName,
    createdAt: user.createdAt.toISOString(),
  };
}
