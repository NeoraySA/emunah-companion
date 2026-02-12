// ============================================
// AES-256-CBC Encryption Utility
// ============================================
// Used to encrypt/decrypt journal entries.
// Key is read from JOURNAL_ENCRYPTION_KEY env var (32-byte hex = 64 chars).

import crypto from 'crypto';
import { config } from '../config';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // 128-bit IV

/**
 * Get the encryption key buffer from config.
 * Key must be a 64-char hex string (32 bytes).
 */
function getKey(): Buffer {
  const hex = config.journalEncryptionKey;
  if (!hex || hex.length !== 64) {
    throw new Error(
      'JOURNAL_ENCRYPTION_KEY must be a 64-character hex string (32 bytes). ' +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }
  return Buffer.from(hex, 'hex');
}

/**
 * Encrypt a plaintext string.
 * Returns { encrypted: Buffer, iv: string (hex) }.
 */
export function encrypt(plaintext: string): { encrypted: Buffer; iv: string } {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);

  return {
    encrypted,
    iv: iv.toString('hex'),
  };
}

/**
 * Decrypt an encrypted buffer back to plaintext.
 */
export function decrypt(encrypted: Buffer, ivHex: string): string {
  const key = getKey();
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return decrypted.toString('utf8');
}
