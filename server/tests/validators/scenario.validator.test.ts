// ============================================
// Scenario Validator Tests
// ============================================

import {
  createScenarioSchema,
  updateScenarioSchema,
  createStepSchema,
  updateStepSchema,
} from '../../src/validators/scenario.validator';

describe('Scenario Validators', () => {
  describe('createScenarioSchema', () => {
    it('should pass with valid full data', () => {
      const result = createScenarioSchema.parse({
        key: 'faith-basics',
        category: 'faith',
        sortOrder: 1,
        isActive: true,
      });
      expect(result.key).toBe('faith-basics');
      expect(result.category).toBe('faith');
    });

    it('should pass with minimal required fields and apply defaults', () => {
      const result = createScenarioSchema.parse({
        key: 'trust-exercise',
        category: 'bittachon',
      });
      expect(result.sortOrder).toBe(0);
      expect(result.isActive).toBe(true);
    });

    it('should fail without key', () => {
      expect(() => createScenarioSchema.parse({ category: 'faith' })).toThrow();
    });

    it('should fail without category', () => {
      expect(() => createScenarioSchema.parse({ key: 'test' })).toThrow();
    });

    it('should fail with empty key', () => {
      expect(() => createScenarioSchema.parse({ key: '', category: 'x' })).toThrow();
    });
  });

  describe('updateScenarioSchema', () => {
    it('should pass with partial data', () => {
      const result = updateScenarioSchema.parse({ isActive: false });
      expect(result.isActive).toBe(false);
    });

    it('should pass with empty object', () => {
      const result = updateScenarioSchema.parse({});
      expect(Object.keys(result).length).toBe(0);
    });

    it('should fail with negative sortOrder', () => {
      expect(() => updateScenarioSchema.parse({ sortOrder: -1 })).toThrow();
    });
  });

  describe('createStepSchema', () => {
    it('should pass with valid full data', () => {
      const result = createStepSchema.parse({
        stepNumber: 1,
        stepType: 'text',
        configJson: { title: 'Step 1' },
        sortOrder: 0,
      });
      expect(result.stepNumber).toBe(1);
      expect(result.stepType).toBe('text');
    });

    it('should pass with minimal fields and apply defaults', () => {
      const result = createStepSchema.parse({ stepNumber: 3 });
      expect(result.stepType).toBe('text');
      expect(result.sortOrder).toBe(0);
    });

    it('should accept null configJson', () => {
      const result = createStepSchema.parse({ stepNumber: 1, configJson: null });
      expect(result.configJson).toBeNull();
    });

    it('should fail without stepNumber', () => {
      expect(() => createStepSchema.parse({})).toThrow();
    });

    it('should fail with zero stepNumber', () => {
      expect(() => createStepSchema.parse({ stepNumber: 0 })).toThrow();
    });

    it('should accept all valid step types', () => {
      for (const type of ['text', 'prompt', 'action', 'summary']) {
        const result = createStepSchema.parse({ stepNumber: 1, stepType: type });
        expect(result.stepType).toBe(type);
      }
    });

    it('should fail with invalid step type', () => {
      expect(() => createStepSchema.parse({ stepNumber: 1, stepType: 'invalid' })).toThrow();
    });
  });

  describe('updateStepSchema', () => {
    it('should pass with partial data', () => {
      const result = updateStepSchema.parse({ stepType: 'prompt' });
      expect(result.stepType).toBe('prompt');
    });

    it('should pass with empty object', () => {
      const result = updateStepSchema.parse({});
      expect(Object.keys(result).length).toBe(0);
    });

    it('should accept null configJson', () => {
      const result = updateStepSchema.parse({ configJson: null });
      expect(result.configJson).toBeNull();
    });
  });
});
