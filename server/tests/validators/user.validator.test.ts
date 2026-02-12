// ============================================
// User Validator Tests
// ============================================

import { updateProfileSchema } from '../../src/validators/user.validator';

describe('User Validators', () => {
  describe('updateProfileSchema', () => {
    it('should pass with displayName', () => {
      const result = updateProfileSchema.parse({ displayName: 'Moshe' });
      expect(result.displayName).toBe('Moshe');
    });

    it('should pass with preferredLang', () => {
      const result = updateProfileSchema.parse({ preferredLang: 'en' });
      expect(result.preferredLang).toBe('en');
    });

    it('should pass with both fields', () => {
      const result = updateProfileSchema.parse({
        displayName: 'שרה',
        preferredLang: 'he',
      });
      expect(result.displayName).toBe('שרה');
      expect(result.preferredLang).toBe('he');
    });

    it('should pass with empty object', () => {
      const result = updateProfileSchema.parse({});
      expect(Object.keys(result).length).toBe(0);
    });

    it('should fail with empty displayName', () => {
      expect(() => updateProfileSchema.parse({ displayName: '' })).toThrow();
    });

    it('should fail with too-short preferredLang', () => {
      expect(() => updateProfileSchema.parse({ preferredLang: 'x' })).toThrow();
    });

    it('should accept Hebrew display name', () => {
      const result = updateProfileSchema.parse({ displayName: 'דוד המלך' });
      expect(result.displayName).toBe('דוד המלך');
    });
  });
});
