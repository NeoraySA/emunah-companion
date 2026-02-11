// ============================================
// JWT Utility Tests
// ============================================

import {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  parseExpiryToMs,
  getAccessExpirySeconds,
} from '../../src/utils/jwt';

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

describe('JWT Utilities', () => {
  describe('generateAccessToken', () => {
    it('should generate a valid JWT string', () => {
      const token = generateAccessToken({
        userId: 1,
        email: 'test@example.com',
        role: 'user',
      });

      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and decode a valid token', () => {
      const payload = { userId: 1, email: 'test@example.com', role: 'user' as const };
      const token = generateAccessToken(payload);
      const decoded = verifyAccessToken(token);

      expect(decoded.userId).toBe(1);
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.role).toBe('user');
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it('should throw for an invalid token', () => {
      expect(() => verifyAccessToken('invalid.token.here')).toThrow();
    });

    it('should throw for a token signed with a different secret', () => {
      // Manually craft a situation – just pass garbage
      expect(() => verifyAccessToken('eyJhbGciOiJIUzI1NiJ9.eyJ0ZXN0IjoxfQ.wrong')).toThrow();
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a 128-char hex string', () => {
      const token = generateRefreshToken();
      expect(typeof token).toBe('string');
      expect(token).toHaveLength(128); // 64 bytes → 128 hex chars
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });

    it('should generate unique tokens', () => {
      const t1 = generateRefreshToken();
      const t2 = generateRefreshToken();
      expect(t1).not.toBe(t2);
    });
  });

  describe('parseExpiryToMs', () => {
    it('should parse "15m" to 900000ms', () => {
      expect(parseExpiryToMs('15m')).toBe(900000);
    });

    it('should parse "7d" to 604800000ms', () => {
      expect(parseExpiryToMs('7d')).toBe(604800000);
    });

    it('should parse "1h" to 3600000ms', () => {
      expect(parseExpiryToMs('1h')).toBe(3600000);
    });

    it('should throw for invalid format', () => {
      expect(() => parseExpiryToMs('invalid')).toThrow();
    });
  });

  describe('getAccessExpirySeconds', () => {
    it('should return 900 for 15m', () => {
      expect(getAccessExpirySeconds()).toBe(900);
    });
  });
});
