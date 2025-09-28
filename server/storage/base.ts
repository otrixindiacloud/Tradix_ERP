import { db } from '../db.js';
import { auditLogs } from '@shared/schema';

export abstract class BaseStorage {
  protected generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  protected generateNumber(prefix: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${timestamp}${random}`;
  }

  protected getCurrentTimestamp(): Date {
    return new Date();
  }

  async logAuditEvent(
    entity: string,
    entityId: string,
    action: "created" | "updated" | "deleted",
    userId: string | undefined,
    oldValue: any,
    newValue: any
  ): Promise<void> {
    try {
      await db.insert(auditLogs).values({
        entityType: entity,
        entityId,
        action,
        userId,
        oldData: oldValue,
        newData: newValue,
        timestamp: this.getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("Error logging audit event:", error);
      // Decide if you want to throw the error or just log it
    }
  }
}
