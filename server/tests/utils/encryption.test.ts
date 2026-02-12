// ============================================
// Encryption Utility Tests
// ============================================

// Set encryption key BEFORE importing the module
const TEST_KEY = 'a'.repeat(64); // 32 bytes in hex
process.env.JOURNAL_ENCRYPTION_KEY = TEST_KEY;

import { encrypt, decrypt } from '../../src/utils/encryption';

describe('Encryption Utility', () => {
  describe('encrypt', () => {
    it('should return encrypted buffer and hex IV', () => {
      const result = encrypt('Hello, World!');
      expect(result.encrypted).toBeInstanceOf(Buffer);
      expect(result.encrypted.length).toBeGreaterThan(0);
      expect(result.iv).toMatch(/^[0-9a-f]{32}$/);
    });

    it('should produce different IVs for same plaintext', () => {
      const r1 = encrypt('same text');
      const r2 = encrypt('same text');
      expect(r1.iv).not.toBe(r2.iv);
    });

    it('should handle empty string', () => {
      const result = encrypt('');
      expect(result.encrypted).toBeInstanceOf(Buffer);
      expect(result.iv).toMatch(/^[0-9a-f]{32}$/);
    });

    it('should handle Hebrew characters', () => {
      const result = encrypt('שלום עולם');
      expect(result.encrypted).toBeInstanceOf(Buffer);
    });

    it('should handle long text', () => {
      const longText = 'א'.repeat(10000);
      const result = encrypt(longText);
      expect(result.encrypted.length).toBeGreaterThan(0);
    });
  });

  describe('decrypt', () => {
    it('should decrypt back to original plaintext', () => {
      const original = 'Hello, World!';
      const { encrypted, iv } = encrypt(original);
      const decrypted = decrypt(encrypted, iv);
      expect(decrypted).toBe(original);
    });

    it('should decrypt Hebrew text correctly', () => {
      const original = 'היום למדתי על אמונה וביטחון';
      const { encrypted, iv } = encrypt(original);
      const decrypted = decrypt(encrypted, iv);
      expect(decrypted).toBe(original);
    });

    it('should decrypt empty string', () => {
      const { encrypted, iv } = encrypt('');
      expect(decrypt(encrypted, iv)).toBe('');
    });

    it('should throw with wrong IV', () => {
      const { encrypted } = encrypt('test');
      const wrongIv = 'b'.repeat(32);
      expect(() => decrypt(encrypted, wrongIv)).toThrow();
    });
  });

  describe('roundtrip', () => {
    it('should handle special characters', () => {
      const text = '🙏 "quotes" & <tags> \n newlines \t tabs';
      const { encrypted, iv } = encrypt(text);
      expect(decrypt(encrypted, iv)).toBe(text);
    });

    it('should handle JSON content', () => {
      const json = JSON.stringify({ title: 'יומן', body: 'תוכן', mood: 'happy' });
      const { encrypted, iv } = encrypt(json);
      const decrypted = decrypt(encrypted, iv);
      expect(JSON.parse(decrypted)).toEqual({ title: 'יומן', body: 'תוכן', mood: 'happy' });
    });
  });
});
