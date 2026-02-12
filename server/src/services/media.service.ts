// ============================================
// Media Service – Business Logic
// ============================================

import crypto from 'crypto';
import { prisma } from '../utils/prisma';
import { NotFoundError } from '../utils/errors';
import { uploadToGcs, getSignedUrl } from '../utils/gcs';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';
import type { Request } from 'express';
import type { UploadMediaInput, ListMediaQueryInput } from '../validators/media.validator';

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

export async function uploadMedia(
  file: Express.Multer.File,
  uploadedBy: number,
  input: UploadMediaInput,
) {
  // Generate unique GCS path: media/<year>/<month>/<uuid>-<originalname>
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const uniqueId = crypto.randomUUID();
  const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
  const gcsPath = `media/${year}/${month}/${uniqueId}-${safeName}`;

  // Upload to GCS
  await uploadToGcs(file.buffer, gcsPath, file.mimetype);

  // Save metadata to database
  const asset = await prisma.mediaAsset.create({
    data: {
      filename: file.originalname,
      mimeType: file.mimetype,
      gcsPath,
      sizeBytes: file.size,
      uploadedBy,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
    },
  });

  return asset;
}

// ---------------------------------------------------------------------------
// List (paginated, admin)
// ---------------------------------------------------------------------------

export async function listMedia(req: Request, filters: ListMediaQueryInput) {
  const pagination = parsePagination(req);

  const where: Record<string, unknown> = { deletedAt: null };
  if (filters.entityType) where.entityType = filters.entityType;
  if (filters.entityId) where.entityId = filters.entityId;

  const [total, assets] = await prisma.$transaction([
    prisma.mediaAsset.count({ where }),
    prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.limit,
    }),
  ]);

  return { assets, meta: buildPaginationMeta(total, pagination) };
}

// ---------------------------------------------------------------------------
// Get signed URL (user-facing)
// ---------------------------------------------------------------------------

export async function getMediaSignedUrl(id: number) {
  const asset = await prisma.mediaAsset.findFirst({
    where: { id, deletedAt: null },
  });

  if (!asset) {
    throw new NotFoundError('Media asset not found');
  }

  const url = await getSignedUrl(asset.gcsPath);

  return { url, asset };
}

// ---------------------------------------------------------------------------
// Delete (soft, admin)
// ---------------------------------------------------------------------------

export async function deleteMedia(id: number) {
  const asset = await prisma.mediaAsset.findFirst({
    where: { id, deletedAt: null },
  });

  if (!asset) {
    throw new NotFoundError('Media asset not found');
  }

  // Soft-delete in DB (keep GCS file for potential recovery)
  await prisma.mediaAsset.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  // Optionally delete from GCS (uncomment for hard delete)
  // await deleteFromGcs(asset.gcsPath);
}
