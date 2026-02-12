// ============================================
// GCS (Google Cloud Storage) Client
// ============================================

import { Storage } from '@google-cloud/storage';
import { config } from '../config';

const storage = new Storage({
  projectId: config.gcs.projectId,
});

/**
 * Get the media bucket instance.
 */
export function getMediaBucket() {
  return storage.bucket(config.gcs.mediaBucket);
}

/**
 * Upload a buffer to GCS and return the public path.
 */
export async function uploadToGcs(
  buffer: Buffer,
  gcsPath: string,
  mimeType: string,
): Promise<string> {
  const bucket = getMediaBucket();
  const file = bucket.file(gcsPath);

  await file.save(buffer, {
    contentType: mimeType,
    resumable: false,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });

  return gcsPath;
}

/**
 * Generate a signed URL for private access to a GCS object.
 */
export async function getSignedUrl(gcsPath: string): Promise<string> {
  const bucket = getMediaBucket();
  const file = bucket.file(gcsPath);

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + config.gcs.signedUrlExpiry * 1000,
  });

  return url;
}

/**
 * Delete an object from GCS.
 */
export async function deleteFromGcs(gcsPath: string): Promise<void> {
  const bucket = getMediaBucket();
  const file = bucket.file(gcsPath);

  try {
    await file.delete();
  } catch (err: unknown) {
    // Ignore 404 – file may already be deleted
    if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 404) {
      return;
    }
    throw err;
  }
}
