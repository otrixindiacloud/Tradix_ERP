import type { Request, Response, NextFunction } from 'express';
import { SYSTEM_USER_ID, isValidUUID } from '@shared/utils/uuid';

declare module 'express-serve-static-core' {
  interface Request {
    resolvedUserId?: string;
  }
}

/**
 * Resolves a user id for attribution.
 * Priority:
 * 1. Authenticated session user (req.user.id)
 * 2. X-User-Id header (validated UUID)
 * 3. SYSTEM_USER_ID constant
 */
export function resolveUserId(req: Request, _res: Response, next: NextFunction) {
  const headerUser = req.header('x-user-id');
  const sessionUser = (req as any).user?.id;
  if (sessionUser && isValidUUID(sessionUser)) {
    req.resolvedUserId = sessionUser;
  } else if (headerUser && isValidUUID(headerUser)) {
    req.resolvedUserId = headerUser;
  } else {
    req.resolvedUserId = SYSTEM_USER_ID;
  }
  next();
}
