/**
 * UUID Utility Functions
 * 
 * This module provides standardized UUID generation, validation, and handling
 * to ensure consistency across the entire ERP system.
 * 
 * UUID Strategy:
 * - Use PostgreSQL gen_random_uuid() for database-generated UUIDs (preferred)
 * - Use nanoid() for text-based IDs where needed for compatibility
 * - All user-facing IDs should be UUIDs for consistency
 */

import { nanoid } from "nanoid";

/**
 * UUID v4 validation regex
 */
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates if a string is a valid UUID v4
 */
export function isValidUUID(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }
  return UUID_V4_REGEX.test(value);
}

/**
 * Validates and normalizes a UUID string
 * @param value - The UUID string to validate
 * @param fieldName - Name of the field for error messages
 * @returns The normalized UUID or throws an error
 */
export function validateUUID(value: string, fieldName = 'UUID'): string {
  if (!value) {
    throw new Error(`${fieldName} is required`);
  }
  
  if (!isValidUUID(value)) {
    throw new Error(`${fieldName} must be a valid UUID format`);
  }
  
  return value.toLowerCase();
}

/**
 * Validates UUID and returns null if invalid (for optional fields)
 */
export function validateOptionalUUID(value: string | null | undefined, fieldName = 'UUID'): string | null {
  if (!value || value === '') {
    return null;
  }
  
  if (!isValidUUID(value)) {
    throw new Error(`${fieldName} must be a valid UUID format`);
  }
  
  return value.toLowerCase();
}

/**
 * Generates a nanoid for text-based ID fields
 * Used for compatibility with existing schemas
 */
export function generateNanoId(): string {
  return nanoid();
}

/**
 * System User ID - centralized constant
 * This should be updated to match your actual system user ID
 */
export const SYSTEM_USER_ID = "e459998e-0a4d-4652-946e-44b2ba161d16";

/**
 * Validates that a user ID is valid or falls back to system user
 */
export function validateUserIdOrDefault(userId: string | null | undefined): string {
  if (!userId || userId === '' || !isValidUUID(userId)) {
    return SYSTEM_USER_ID;
  }
  return userId;
}

/**
 * Type guard to check if a value is a valid UUID string
 */
export function assertUUID(value: unknown, fieldName = 'value'): asserts value is string {
  if (typeof value !== 'string' || !isValidUUID(value)) {
    throw new Error(`${fieldName} must be a valid UUID`);
  }
}

/**
 * Converts various ID formats to a consistent format
 * Handles both UUID and nanoid formats
 */
export function normalizeId(id: string): string {
  if (!id) {
    throw new Error('ID cannot be empty');
  }
  
  // If it's a UUID, normalize to lowercase
  if (isValidUUID(id)) {
    return id.toLowerCase();
  }
  
  // For nanoid or other formats, return as-is
  return id;
}

/**
 * Database ID type definitions for better type safety
 */
export type UUIDString = string; // Should be a valid UUID v4
export type NanoIdString = string; // Should be a valid nanoid
export type DatabaseId = UUIDString | NanoIdString;

/**
 * Entity ID patterns - documents which entities use which ID type
 */
export const ENTITY_ID_PATTERNS = {
  // Core business entities use UUID
  users: 'uuid',
  customers: 'uuid',
  suppliers: 'uuid',
  items: 'uuid',
  enquiries: 'uuid',
  quotations: 'uuid',
  salesOrders: 'uuid',
  supplierLpos: 'uuid',
  invoices: 'uuid',
  
  // Inventory/operational entities may use nanoid for performance
  goodsReceiptHeaders: 'uuid',
  goodsReceiptItems: 'uuid',
  stockMovements: 'nanoid',
  
  // Audit and tracking entities use UUID
  auditLogs: 'uuid',
  acceptanceConfirmations: 'uuid',
} as const;

/**
 * Type-safe ID validation based on entity type
 */
export function validateEntityId(entityType: keyof typeof ENTITY_ID_PATTERNS, id: string): string {
  const idType = ENTITY_ID_PATTERNS[entityType];
  
  if (idType === 'uuid' && !isValidUUID(id)) {
    throw new Error(`${entityType} ID must be a valid UUID`);
  }
  
  if (!id || id.trim() === '') {
    throw new Error(`${entityType} ID cannot be empty`);
  }
  
  return normalizeId(id);
}

/**
 * Helper to safely extract UUID from request parameters
 */
export function extractUUIDFromParams(params: Record<string, any>, paramName: string): string {
  const value = params[paramName];
  if (!value) {
    throw new Error(`${paramName} parameter is required`);
  }
  
  return validateUUID(value, paramName);
}

/**
 * UUID validation middleware helper
 */
export function createUUIDValidator(paramName: string) {
  return (req: any, res: any, next: any) => {
    try {
      req.validatedParams = req.validatedParams || {};
      req.validatedParams[paramName] = extractUUIDFromParams(req.params, paramName);
      next();
    } catch (error) {
      res.status(400).json({ 
        message: 'Invalid request', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

export default {
  isValidUUID,
  validateUUID,
  validateOptionalUUID,
  generateNanoId,
  SYSTEM_USER_ID,
  validateUserIdOrDefault,
  assertUUID,
  normalizeId,
  validateEntityId,
  extractUUIDFromParams,
  createUUIDValidator,
  ENTITY_ID_PATTERNS,
};