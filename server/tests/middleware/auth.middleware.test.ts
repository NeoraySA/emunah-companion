// ============================================
// Auth Middleware Tests
// ============================================

import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../../src/middleware/auth.middleware';
import { generateAccessToken } from '../../src/utils/jwt';

// Mock config
jest.mock('../../src/config', () => ({
  config: {
    jwt: {
      accessSecret: 'test-access-secret-key-for-jwt',
      refreshSecret: 'test-refresh-secret-key-for-jwt',
      accessExpiresIn: '15m',
      refreshExpiresIn: '7d',
    },
  },
}));

function createMockReq(override: Partial<Request> = {}): Request {
  return {
    headers: {},
    ...override,
  } as Request;
}

function createMockRes(): Response {
  return {} as Response;
}

describe('authenticate middleware', () => {
  it('should call next with error when no Authorization header', () => {
    const req = createMockReq();
    const res = createMockRes();
    const next: NextFunction = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it('should call next with error for invalid token', () => {
    const req = createMockReq({
      headers: { authorization: 'Bearer invalid.token' },
    });
    const res = createMockRes();
    const next: NextFunction = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it('should set req.user and call next() for valid token', () => {
    const token = generateAccessToken({
      userId: 1,
      email: 'test@example.com',
      role: 'admin',
    });

    const req = createMockReq({
      headers: { authorization: `Bearer ${token}` },
    });
    const res = createMockRes();
    const next: NextFunction = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(); // no error
    expect(req.user).toBeDefined();
    expect(req.user!.userId).toBe(1);
    expect(req.user!.role).toBe('admin');
  });
});

describe('authorize middleware', () => {
  it('should call next with ForbiddenError when role not allowed', () => {
    const req = createMockReq();
    req.user = { userId: 1, email: 'test@example.com', role: 'user' };
    const res = createMockRes();
    const next: NextFunction = jest.fn();

    authorize('admin')(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('should call next() when role is allowed', () => {
    const req = createMockReq();
    req.user = { userId: 1, email: 'test@example.com', role: 'admin' };
    const res = createMockRes();
    const next: NextFunction = jest.fn();

    authorize('admin', 'editor')(req, res, next);

    expect(next).toHaveBeenCalledWith(); // no error
  });

  it('should call next with UnauthorizedError when no user', () => {
    const req = createMockReq();
    const res = createMockRes();
    const next: NextFunction = jest.fn();

    authorize('admin')(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });
});
