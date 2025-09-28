import { auditLogs } from "@shared/schema";
import { db } from "../db.js";
import { BaseStorage } from './base.js';
import { IAuditStorage } from './interfaces.js';

export class AuditStorage extends BaseStorage implements IAuditStorage {
  async logAuditEvent(
    entityType: string,
    entityId: string,
    action: string,
    userId?: string,
    oldData?: any,
    newData?: any
  ): Promise<void> {
    await db.insert(auditLogs).values({
      entityType,
      entityId,
      action,
      oldData,
      newData,
      userId,
    });
  }
}
