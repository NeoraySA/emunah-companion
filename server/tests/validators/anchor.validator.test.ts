// ============================================
// Anchor Validator Tests
// ============================================

import { createAnchorSchema, updateAnchorSchema } from '../../src/validators/anchor.validator';

describe('Anchor Validators', () => {
  describe('createAnchorSchema', () => {
    it('should pass with full valid data', () => {
      const result = createAnchorSchema.parse({
        title: 'Morning reminder',
        body: 'Remember to be grateful',
        scheduleType: 'daily',
        scheduleConfig: { time: '08:00' },
        isActive: true,
      });
      expect(result.title).toBe('Morning reminder');
      expect(result.scheduleType).toBe('daily');
    });

    it('should pass with title only and apply defaults', () => {
      const result = createAnchorSchema.parse({ title: 'Quick note' });
      expect(result.scheduleType).toBe('once');
      expect(result.isActive).toBe(true);
    });

    it('should fail without title', () => {
      expect(() => createAnchorSchema.parse({})).toThrow();
    });

    it('should fail with empty title', () => {
      expect(() => createAnchorSchema.parse({ title: '' })).toThrow();
    });

    it('should accept all schedule types', () => {
      for (const type of ['once', 'daily', 'weekly', 'custom']) {
        const result = createAnchorSchema.parse({ title: 'Test', scheduleType: type });
        expect(result.scheduleType).toBe(type);
      }
    });

    it('should fail with invalid schedule type', () => {
      expect(() => createAnchorSchema.parse({ title: 'Test', scheduleType: 'hourly' })).toThrow();
    });

    it('should accept null scheduleConfig', () => {
      const result = createAnchorSchema.parse({ title: 'Test', scheduleConfig: null });
      expect(result.scheduleConfig).toBeNull();
    });
  });

  describe('updateAnchorSchema', () => {
    it('should pass with partial data', () => {
      const result = updateAnchorSchema.parse({ isActive: false });
      expect(result.isActive).toBe(false);
    });

    it('should pass with empty object', () => {
      const result = updateAnchorSchema.parse({});
      expect(Object.keys(result).length).toBe(0);
    });

    it('should accept null body', () => {
      const result = updateAnchorSchema.parse({ body: null });
      expect(result.body).toBeNull();
    });

    it('should accept null scheduleConfig', () => {
      const result = updateAnchorSchema.parse({ scheduleConfig: null });
      expect(result.scheduleConfig).toBeNull();
    });

    it('should fail with empty title', () => {
      expect(() => updateAnchorSchema.parse({ title: '' })).toThrow();
    });
  });
});
