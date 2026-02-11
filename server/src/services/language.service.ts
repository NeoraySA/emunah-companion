// ============================================
// Language Service – Business Logic
// ============================================

import { prisma } from '../utils/prisma';

/**
 * List all active languages (ordered by id).
 */
export async function listLanguages() {
  return prisma.language.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      code: true,
      name: true,
      isDefault: true,
      isActive: true,
    },
  });
}
