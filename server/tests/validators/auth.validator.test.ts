// ============================================
// Auth Validator Tests
// ============================================

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from '../../src/validators/auth.validator';

describe('Auth Validators', () => {
  describe('registerSchema', () => {
    it('should pass with valid data', () => {
      const result = registerSchema.parse({
        email: 'user@example.com',
        password: 'SecurePass1',
        displayName: 'Test User',
        preferredLang: 'he',
      });
      expect(result.email).toBe('user@example.com');
      expect(result.preferredLang).toBe('he');
    });

    it('should pass without optional fields', () => {
      const result = registerSchema.parse({
        email: 'user@example.com',
        password: 'SecurePass1',
      });
      expect(result.preferredLang).toBe('he'); // default
      expect(result.displayName).toBeUndefined();
    });

    it('should fail with invalid email', () => {
      expect(() => registerSchema.parse({ email: 'not-email', password: 'SecurePass1' })).toThrow();
    });

    it('should fail with short password', () => {
      expect(() => registerSchema.parse({ email: 'user@example.com', password: 'Ab1' })).toThrow();
    });

    it('should fail with password missing uppercase', () => {
      expect(() =>
        registerSchema.parse({ email: 'user@example.com', password: 'lowercase1' }),
      ).toThrow();
    });

    it('should fail with password missing digit', () => {
      expect(() =>
        registerSchema.parse({ email: 'user@example.com', password: 'NoDigitsHere' }),
      ).toThrow();
    });

    it('should fail with invalid language', () => {
      expect(() =>
        registerSchema.parse({
          email: 'user@example.com',
          password: 'SecurePass1',
          preferredLang: 'fr',
        }),
      ).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('should pass with valid data', () => {
      const result = loginSchema.parse({
        email: 'user@example.com',
        password: 'anything',
      });
      expect(result.email).toBe('user@example.com');
    });

    it('should fail with missing password', () => {
      expect(() => loginSchema.parse({ email: 'user@example.com' })).toThrow();
    });

    it('should fail with invalid email', () => {
      expect(() => loginSchema.parse({ email: 'bad', password: 'test' })).toThrow();
    });
  });

  describe('refreshTokenSchema', () => {
    it('should pass with a refresh token', () => {
      const result = refreshTokenSchema.parse({ refreshToken: 'abcdef123' });
      expect(result.refreshToken).toBe('abcdef123');
    });

    it('should fail with empty string', () => {
      expect(() => refreshTokenSchema.parse({ refreshToken: '' })).toThrow();
    });
  });

  describe('changePasswordSchema', () => {
    it('should pass with valid data', () => {
      const result = changePasswordSchema.parse({
        currentPassword: 'OldPass1',
        newPassword: 'NewSecure1',
      });
      expect(result.newPassword).toBe('NewSecure1');
    });

    it('should fail with weak new password', () => {
      expect(() =>
        changePasswordSchema.parse({
          currentPassword: 'OldPass1',
          newPassword: 'weak',
        }),
      ).toThrow();
    });
  });
});
