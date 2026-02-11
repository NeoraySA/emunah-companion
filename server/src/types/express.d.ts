// ============================================
// Express type augmentation
// ============================================

import type { JwtPayload } from '@emunah/shared';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
