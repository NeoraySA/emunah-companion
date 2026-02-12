// ============================================
// Journal Service – Business Logic (Encrypted)
// ============================================

import crypto from 'crypto';
import { prisma } from '../utils/prisma';
import { NotFoundError } from '../utils/errors';
import { encrypt, decrypt } from '../utils/encryption';
import { parsePagination, parseSort, buildPaginationMeta } from '../utils/pagination';
import { config } from '../config';
import type { Request } from 'express';
import type {
  CreateJournalInput,
  UpdateJournalInput,
  JournalQueryInput,
} from '../validators/journal.validator';

const SORT_FIELDS = ['createdAt', 'mood'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface DecryptedEntry {
  id: number;
  userId: number;
  scenarioId: number | null;
  title: string | null;
  body: string;
  mood: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Decrypt a single journal entry from DB form to plaintext.
 */
function decryptEntry(entry: {
  id: number;
  userId: number;
  scenarioId: number | null;
  titleEncrypted: Buffer | null;
  bodyEncrypted: Buffer;
  encryptionIv: string;
  mood: string | null;
  createdAt: Date;
  updatedAt: Date;
}): DecryptedEntry {
  return {
    id: entry.id,
    userId: entry.userId,
    scenarioId: entry.scenarioId,
    title: entry.titleEncrypted ? decrypt(entry.titleEncrypted, entry.encryptionIv) : null,
    body: decrypt(entry.bodyEncrypted, entry.encryptionIv),
    mood: entry.mood,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}

// ---------------------------------------------------------------------------
// List (paginated, user-scoped)
// ---------------------------------------------------------------------------

export async function listJournalEntries(req: Request, userId: number, filters: JournalQueryInput) {
  const pagination = parsePagination(req);
  const sort = parseSort(req, SORT_FIELDS, 'createdAt');

  const where: Record<string, unknown> = {
    userId,
    deletedAt: null,
  };

  if (filters.scenarioId) {
    where.scenarioId = filters.scenarioId;
  }
  if (filters.mood) {
    where.mood = filters.mood;
  }

  const [total, entries] = await prisma.$transaction([
    prisma.journalEntry.count({ where }),
    prisma.journalEntry.findMany({
      where,
      orderBy: { [sort.sortBy]: sort.order },
      skip: pagination.skip,
      take: pagination.limit,
    }),
  ]);

  const decrypted = entries.map(decryptEntry);

  return { entries: decrypted, meta: buildPaginationMeta(total, pagination) };
}

// ---------------------------------------------------------------------------
// Get single (user-scoped)
// ---------------------------------------------------------------------------

export async function getJournalEntry(id: number, userId: number) {
  const entry = await prisma.journalEntry.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!entry) {
    throw new NotFoundError('Journal entry not found');
  }

  return decryptEntry(entry);
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createJournalEntry(userId: number, input: CreateJournalInput) {
  // Encrypt body (required)
  const bodyResult = encrypt(input.body);

  // Encrypt title if provided (use same IV for simplicity)
  let titleEncrypted: Buffer | null = null;
  if (input.title) {
    const iv = Buffer.from(bodyResult.iv, 'hex');
    const key = Buffer.from(config.journalEncryptionKey, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    titleEncrypted = Buffer.concat([cipher.update(input.title, 'utf8'), cipher.final()]);
  }

  const entry = await prisma.journalEntry.create({
    data: {
      userId,
      scenarioId: input.scenarioId ?? null,
      titleEncrypted,
      bodyEncrypted: bodyResult.encrypted,
      encryptionIv: bodyResult.iv,
      mood: input.mood ?? null,
    },
  });

  return decryptEntry(entry);
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export async function updateJournalEntry(id: number, userId: number, input: UpdateJournalInput) {
  // Verify ownership
  const existing = await prisma.journalEntry.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError('Journal entry not found');
  }

  const data: Record<string, unknown> = {};

  // If body is being updated, re-encrypt everything with a new IV
  if (input.body !== undefined) {
    const bodyResult = encrypt(input.body);
    data.bodyEncrypted = bodyResult.encrypted;
    data.encryptionIv = bodyResult.iv;

    // Re-encrypt title with the new IV
    const titleText =
      input.title !== undefined
        ? input.title
        : existing.titleEncrypted
          ? decrypt(existing.titleEncrypted, existing.encryptionIv)
          : null;

    if (titleText) {
      const iv = Buffer.from(bodyResult.iv, 'hex');
      const key = Buffer.from(config.journalEncryptionKey, 'hex');
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      data.titleEncrypted = Buffer.concat([cipher.update(titleText, 'utf8'), cipher.final()]);
    } else {
      data.titleEncrypted = null;
    }
  } else if (input.title !== undefined) {
    // Only title is changing — re-encrypt with existing IV
    if (input.title === null) {
      data.titleEncrypted = null;
    } else {
      const iv = Buffer.from(existing.encryptionIv, 'hex');
      const key = Buffer.from(config.journalEncryptionKey, 'hex');
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      data.titleEncrypted = Buffer.concat([cipher.update(input.title, 'utf8'), cipher.final()]);
    }
  }

  if (input.mood !== undefined) {
    data.mood = input.mood;
  }

  const updated = await prisma.journalEntry.update({
    where: { id },
    data,
  });

  return decryptEntry(updated);
}

// ---------------------------------------------------------------------------
// Delete (soft)
// ---------------------------------------------------------------------------

export async function deleteJournalEntry(id: number, userId: number) {
  const existing = await prisma.journalEntry.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError('Journal entry not found');
  }

  await prisma.journalEntry.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
