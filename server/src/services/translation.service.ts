// ============================================
// Translation Service – Business Logic
// ============================================

import { prisma } from '../utils/prisma';
import type {
  GetTranslationsQuery,
  UpsertTranslationsInput,
} from '../validators/translation.validator';

/**
 * Get translations filtered by query params.
 */
export async function getTranslations(query: GetTranslationsQuery) {
  const where: Record<string, unknown> = {
    entityType: query.entityType,
  };
  if (query.entityId) where.entityId = query.entityId;
  if (query.languageId) where.languageId = query.languageId;
  if (query.fieldName) where.fieldName = query.fieldName;

  return prisma.translation.findMany({
    where,
    orderBy: [{ entityId: 'asc' }, { fieldName: 'asc' }],
    include: {
      language: { select: { code: true, name: true } },
    },
  });
}

/**
 * Upsert translations in bulk (admin).
 * Uses composite unique key: [entityType, entityId, languageId, fieldName].
 */
export async function upsertTranslations(input: UpsertTranslationsInput) {
  const results = await prisma.$transaction(
    input.translations.map((t) =>
      prisma.translation.upsert({
        where: {
          entityType_entityId_languageId_fieldName: {
            entityType: t.entityType,
            entityId: t.entityId,
            languageId: t.languageId,
            fieldName: t.fieldName,
          },
        },
        create: {
          entityType: t.entityType,
          entityId: t.entityId,
          languageId: t.languageId,
          fieldName: t.fieldName,
          value: t.value,
        },
        update: {
          value: t.value,
        },
      }),
    ),
  );

  return results;
}
