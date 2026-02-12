// ============================================
// Media Validator Tests
// ============================================

import { uploadMediaSchema, listMediaQuerySchema } from '../../src/validators/media.validator';

describe('Media Validators', () => {
  describe('uploadMediaSchema', () => {
    it('should pass with full metadata', () => {
      const result = uploadMediaSchema.parse({
        entityType: 'scenario',
        entityId: '5',
      });
      expect(result.entityType).toBe('scenario');
      expect(result.entityId).toBe(5);
    });

    it('should pass with empty object', () => {
      const result = uploadMediaSchema.parse({});
      expect(result.entityType).toBeUndefined();
      expect(result.entityId).toBeUndefined();
    });

    it('should coerce entityId from string', () => {
      const result = uploadMediaSchema.parse({ entityId: '10' });
      expect(result.entityId).toBe(10);
    });

    it('should fail with non-positive entityId', () => {
      expect(() => uploadMediaSchema.parse({ entityId: '0' })).toThrow();
    });
  });

  describe('listMediaQuerySchema', () => {
    it('should parse filters', () => {
      const result = listMediaQuerySchema.parse({
        entityType: 'home_button',
        entityId: '3',
      });
      expect(result.entityType).toBe('home_button');
      expect(result.entityId).toBe(3);
    });

    it('should pass with empty object', () => {
      const result = listMediaQuerySchema.parse({});
      expect(Object.keys(result).length).toBe(0);
    });
  });
});
