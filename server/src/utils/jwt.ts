// ============================================
// JWT Utilities
// ============================================

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config';
import type { JwtPayload } from '@emunah/shared';

/**
 * Generate an access token (short-lived)
 */
export function generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  // parseExpiryToMs validates the format; we pass the expiry in seconds
  const expiresInSec = Math.floor(parseExpiryToMs(config.jwt.accessExpiresIn) / 1000);
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: expiresInSec,
  });
}

/**
 * Generate a refresh token (long-lived, opaque random string)
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Verify and decode an access token
 */
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
}

/**
 * Parse expiry string (e.g., '15m', '7d') to milliseconds
 */
export function parseExpiryToMs(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhdw])$/);
  if (!match) throw new Error(`Invalid expiry format: ${expiry}`);

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
}

/**
 * Get access token expiry in seconds (for response)
 */
export function getAccessExpirySeconds(): number {
  return Math.floor(parseExpiryToMs(config.jwt.accessExpiresIn) / 1000);
}
