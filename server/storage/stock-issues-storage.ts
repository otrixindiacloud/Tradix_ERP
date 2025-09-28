
import { db } from "../db";
import { stockIssue, inventoryItems } from "../../shared/schema";
import { eq } from "drizzle-orm";

export class StockIssuesStorage {
  async getAllStockIssues() {
    // Join stockIssue with inventoryItem to get item description
    const results = await db
      .select({
        id: stockIssue.id,
        issueNumber: stockIssue.issueNumber,
        itemId: stockIssue.itemId,
        quantity: stockIssue.quantity,
        issueDate: stockIssue.issueDate,
        status: stockIssue.status,
        issuedTo: stockIssue.issuedTo,
        departmentId: stockIssue.departmentId,
        notes: stockIssue.notes,
        itemName: inventoryItems.description,
        itemCode: inventoryItems.barcode,
      })
      .from(stockIssue)
      .leftJoin(inventoryItems, eq(stockIssue.itemId, inventoryItems.id));
    return results;
  }

  async getStockIssueById(id: string) {
    const result = await db.select().from(stockIssue).where(eq(stockIssue.id, id));
    return result[0] || null;
  }

  async createStockIssue(data: any) {
    // Defensive normalization: ensure issueDate is a Date object or remove it so DB default applies
    if (data && 'issueDate' in data) {
      const v = data.issueDate;
      if (v == null || v === '') {
        delete data.issueDate; // allow default
      } else if (!(v instanceof Date)) {
        try {
          const d = new Date(v);
            if (!isNaN(d.getTime())) data.issueDate = d; else delete data.issueDate;
        } catch {
          delete data.issueDate;
        }
      }
    }
    console.log('[DEBUG][createStockIssue] Final payload to insert:', {
      ...data,
      issueDate: data.issueDate instanceof Date ? data.issueDate.toISOString() : data.issueDate
    });
    const [created] = await db.insert(stockIssue).values(data).returning();
    return created;
  }

  async updateStockIssue(id: string, data: any) {
    if (data && 'issueDate' in data) {
      const v = data.issueDate;
      if (v == null || v === '') {
        delete data.issueDate;
      } else if (!(v instanceof Date)) {
        try {
          const d = new Date(v);
          if (!isNaN(d.getTime())) data.issueDate = d; else delete data.issueDate;
        } catch { delete data.issueDate; }
      }
    }
    console.log('[DEBUG][updateStockIssue] Payload:', {
      ...data,
      issueDate: data.issueDate instanceof Date ? data.issueDate.toISOString() : data.issueDate
    });
    const [updated] = await db.update(stockIssue).set(data).where(eq(stockIssue.id, id)).returning();
    return updated || null;
  }

  async deleteStockIssue(id: string) {
    await db.delete(stockIssue).where(eq(stockIssue.id, id));
  }
}
