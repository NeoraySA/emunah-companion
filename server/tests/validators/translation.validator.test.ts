// ============================================
// Translation Validator Tests
// ============================================

import {
  getTranslationsQuerySchema,
  upsertTranslationsSchema,
} from '../../src/validators/translation.validator';

describe('Translation Validators', () => {
  describe('getTranslationsQuerySchema', () => {
    it('should pass with entityType only', () => {
      const result = getTranslationsQuerySchema.parse({ entityType: 'scenario' });
      expect(result.entityType).toBe('scenario');
      expect(result.entityId).toBeUndefined();
    });

    it('should parse numeric entityId from string', () => {
      const result = getTranslationsQuerySchema.parse({
        entityType: 'home_button',
        entityId: '5',
      });
      expect(result.entityId).toBe(5);
    });

    it('should pass with all fields', () => {
      const result = getTranslationsQuerySchema.parse({
        entityType: 'scenario',
        entityId: '1',
        languageId: '2',
        fieldName: 'title',
      });
      expect(result.languageId).toBe(2);
      expect(result.fieldName).toBe('title');
    });

    it('should fail without entityType', () => {
      expect(() => getTranslationsQuerySchema.parse({})).toThrow();
    });

    it('should fail with empty entityType', () => {
      expect(() => getTranslationsQuerySchema.parse({ entityType: '' })).toThrow();
    });
  });

  describe('upsertTranslationsSchema', () => {
    const validTranslation = {
      entityType: 'scenario',
      entityId: 1,
      languageId: 1,
      fieldName: 'title',
      value: 'שלום',
    };

    it('should pass with valid single translation', () => {
      const result = upsertTranslationsSchema.parse({
        translations: [validTranslation],
      });
      expect(result.translations).toHaveLength(1);
    });

    it('should pass with multiple translations', () => {
      const result = upsertTranslationsSchema.parse({
        translations: [validTranslation, { ...validTranslation, languageId: 2, value: 'Hello' }],
      });
      expect(result.translations).toHaveLength(2);
    });

    it('should fail with empty translations array', () => {
      expect(() => upsertTranslationsSchema.parse({ translations: [] })).toThrow();
    });

    it('should fail without value', () => {
      expect(() =>
        upsertTranslationsSchema.parse({
          translations: [
            { entityType: 'scenario', entityId: 1, languageId: 1, fieldName: 'title' },
          ],
        }),
      ).toThrow();
    });

    it('should fail with empty value', () => {
      expect(() =>
        upsertTranslationsSchema.parse({
          translations: [{ ...validTranslation, value: '' }],
        }),
      ).toThrow();
    });
  });
});
