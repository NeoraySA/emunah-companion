// ============================================
// Home Button Validator Tests
// ============================================

import {
  createHomeButtonSchema,
  updateHomeButtonSchema,
} from '../../src/validators/home-button.validator';

describe('Home Button Validators', () => {
  describe('createHomeButtonSchema', () => {
    it('should pass with valid full data', () => {
      const result = createHomeButtonSchema.parse({
        key: 'scenarios',
        icon: 'book-outline',
        route: '/scenarios',
        sortOrder: 1,
        isActive: true,
      });
      expect(result.key).toBe('scenarios');
      expect(result.sortOrder).toBe(1);
    });

    it('should pass with minimal required fields', () => {
      const result = createHomeButtonSchema.parse({
        key: 'journal',
        icon: 'journal-outline',
        route: '/journal',
      });
      expect(result.sortOrder).toBe(0); // default
      expect(result.isActive).toBe(true); // default
    });

    it('should fail without key', () => {
      expect(() => createHomeButtonSchema.parse({ icon: 'star', route: '/test' })).toThrow();
    });

    it('should fail without icon', () => {
      expect(() => createHomeButtonSchema.parse({ key: 'test', route: '/test' })).toThrow();
    });

    it('should fail without route', () => {
      expect(() => createHomeButtonSchema.parse({ key: 'test', icon: 'star' })).toThrow();
    });

    it('should fail with empty key', () => {
      expect(() =>
        createHomeButtonSchema.parse({ key: '', icon: 'star', route: '/test' }),
      ).toThrow();
    });

    it('should fail with negative sortOrder', () => {
      expect(() =>
        createHomeButtonSchema.parse({ key: 'x', icon: 'star', route: '/test', sortOrder: -1 }),
      ).toThrow();
    });
  });

  describe('updateHomeButtonSchema', () => {
    it('should pass with partial data', () => {
      const result = updateHomeButtonSchema.parse({ isActive: false });
      expect(result.isActive).toBe(false);
    });

    it('should pass with empty object', () => {
      const result = updateHomeButtonSchema.parse({});
      expect(Object.keys(result).length).toBe(0);
    });

    it('should fail with empty key string', () => {
      expect(() => updateHomeButtonSchema.parse({ key: '' })).toThrow();
    });
  });
});
