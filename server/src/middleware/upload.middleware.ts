// ============================================
// Multer Configuration – File Upload Middleware
// ============================================

import multer from 'multer';
import { BadRequestError } from '../utils/errors';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Audio
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  // Video
  'video/mp4',
  'video/webm',
  // Documents
  'application/pdf',
];

/**
 * Multer instance configured for memory storage with file type + size validation.
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError(`File type '${file.mimetype}' is not allowed`));
    }
  },
});
