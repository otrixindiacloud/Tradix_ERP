
import { db } from "../db.js";
import { inventoryItems } from "@shared/schema";
import { eq } from "drizzle-orm";
import { BaseStorage } from "./base-storage";

export class InventoryItemsStorage extends BaseStorage {
  async getAllItems() {
    return await db.select().from(inventoryItems);
  }

  async createItem(data: any) {
    const [newItem] = await db.insert(inventoryItems).values(data).returning();
    return newItem;
  }

  async updateItem(id: string, data: any) {
    const [updated] = await db.update(inventoryItems).set(data).where(eq(inventoryItems.id, id)).returning();
    return updated || null;
  }
}
