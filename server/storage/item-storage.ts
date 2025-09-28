import { items, auditLogs, type Item, type InsertItem } from "@shared/schema";
import { db } from "../db.js";
import { eq, desc } from "drizzle-orm";
import { BaseStorage } from './base.js';
import { IItemStorage } from './interfaces.js';

export class ItemStorage extends BaseStorage implements IItemStorage {
  async getItems(): Promise<Item[]> {
    return db
      .select()
      .from(items)
      .where(eq(items.isActive, true))
      .orderBy(desc(items.createdAt));
  }

  async getItem(id: string): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item;
  }

  async getItemByBarcode(barcode: string): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.barcode, barcode));
    return item;
  }

  async createItem(itemData: InsertItem): Promise<Item> {
    const [item] = await db.insert(items).values(itemData).returning();
    await this.logAuditEvent("item", item.id, "create", undefined, undefined, item);
    return item;
  }

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
