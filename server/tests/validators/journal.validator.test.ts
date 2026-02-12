// ============================================
// Journal Validator Tests
// ============================================

import {
  createJournalSchema,
  updateJournalSchema,
  journalQuerySchema,
} from '../../src/validators/journal.validator';

describe('Journal Validators', () => {
  describe('createJournalSchema', () => {
    it('should pass with full valid data', () => {
      const result = createJournalSchema.parse({
        scenarioId: 1,
        title: 'My entry',
        body: 'Today I learned...',
        mood: 'grateful',
      });
      expect(result.body).toBe('Today I learned...');
      expect(result.scenarioId).toBe(1);
    });

    it('should pass with body only (minimal)', () => {
      const result = createJournalSchema.parse({ body: 'Just a thought' });
      expect(result.body).toBe('Just a thought');
      expect(result.title).toBeUndefined();
      expect(result.mood).toBeUndefined();
    });

    it('should fail without body', () => {
      expect(() => createJournalSchema.parse({})).toThrow();
    });

    it('should fail with empty body', () => {
      expect(() => createJournalSchema.parse({ body: '' })).toThrow();
    });

    it('should fail with non-positive scenarioId', () => {
      expect(() => createJournalSchema.parse({ body: 'x', scenarioId: 0 })).toThrow();
    });
  });

  describe('updateJournalSchema', () => {
    it('should pass with partial data', () => {
      const result = updateJournalSchema.parse({ mood: 'happy' });
      expect(result.mood).toBe('happy');
    });

    it('should pass with empty object', () => {
      const result = updateJournalSchema.parse({});
      expect(Object.keys(result).length).toBe(0);
    });

    it('should accept null title', () => {
      const result = updateJournalSchema.parse({ title: null });
      expect(result.title).toBeNull();
    });

    it('should accept null mood', () => {
      const result = updateJournalSchema.parse({ mood: null });
      expect(result.mood).toBeNull();
    });
  });

  describe('journalQuerySchema', () => {
    it('should parse scenarioId from string', () => {
      const result = journalQuerySchema.parse({ scenarioId: '5' });
      expect(result.scenarioId).toBe(5);
    });

    it('should pass with mood filter', () => {
      const result = journalQuerySchema.parse({ mood: 'grateful' });
      expect(result.mood).toBe('grateful');
    });

    it('should pass with empty object', () => {
      const result = journalQuerySchema.parse({});
      expect(result.scenarioId).toBeUndefined();
    });
  });
});
