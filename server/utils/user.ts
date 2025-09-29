import type { Request } from 'express';
import { SYSTEM_USER_ID, isValidUUID } from '@shared/utils/uuid';

/**
 * Returns an attributing user id for storage/audit operations.
 * Priority order:
 * 1. req.resolvedUserId injected by resolveUserId middleware
 * 2. body.userId if valid UUID
 * 3. SYSTEM_USER_ID fallback
 */
export function getAttributingUserId(req: Request): string {
  const candidate = (req as any).resolvedUserId || (req.body && (req.body as any).userId);
  if (candidate && typeof candidate === 'string' && isValidUUID(candidate)) return candidate;
  return SYSTEM_USER_ID;
}

/**
 * Extracts optional user id (returns undefined instead of fallback) when you need to know if a real user was present.
 */
export function getOptionalUserId(req: Request): string | undefined {
  const candidate = (req as any).resolvedUserId || (req.body && (req.body as any).userId);
  if (candidate && typeof candidate === 'string' && isValidUUID(candidate)) return candidate;
  return undefined;
}