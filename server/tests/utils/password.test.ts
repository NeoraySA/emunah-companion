// ============================================
// Password Utility Tests
// ============================================

import { hashPassword, comparePassword } from '../../src/utils/password';

describe('Password Utilities', () => {
  const plainPassword = 'MySecureP@ss1';

  describe('hashPassword', () => {
    it('should return a bcrypt hash', async () => {
      const hash = await hashPassword(plainPassword);

      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(plainPassword);
      expect(hash.startsWith('$2b$')).toBe(true); // bcrypt prefix
    });

    it('should produce different hashes for the same password', async () => {
      const hash1 = await hashPassword(plainPassword);
      const hash2 = await hashPassword(plainPassword);

      expect(hash1).not.toBe(hash2); // Different salts
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const hash = await hashPassword(plainPassword);
      const result = await comparePassword(plainPassword, hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const hash = await hashPassword(plainPassword);
      const result = await comparePassword('WrongPassword1', hash);

      expect(result).toBe(false);
    });
  });
});
