import { db } from '../db.js';
import { BaseStorage } from './base.js';
import {
  purchaseOrders,
  poLineItems,
  InsertPurchaseOrder,
  PurchaseOrder,
  InsertPoLineItem,
  PoLineItem,
  quotations,
  quotationItems,
  quotationItemAcceptances,
} from '@shared/schema';
import { eq, and, inArray } from 'drizzle-orm';

export class PurchaseOrderStorage extends BaseStorage {
  async getPurchaseOrders(limit = 50, offset = 0, filters: any = {}): Promise<PurchaseOrder[]> {
    let query = db.select().from(purchaseOrders);
    if (filters.quotationId) {
      query = query.where(eq(purchaseOrders.quotationId, filters.quotationId));
    }
    const result = await query.limit(limit).offset(offset);
    return result;
  }

  async getPurchaseOrder(id: string): Promise<PurchaseOrder | undefined> {
    const rows = await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, id));
    return rows[0];
  }

  async createPurchaseOrder(po: InsertPurchaseOrder): Promise<PurchaseOrder> {
    console.log('[PO-STORAGE] createPurchaseOrder received:', { poDateType: typeof (po as any).poDate, poDateValue: (po as any).poDate });
    // Force poDate to a real Date instance
    const normalized: any = { ...po };
    if (normalized.poDate && !(normalized.poDate instanceof Date)) {
      try {
        normalized.poDate = new Date(normalized.poDate);
      } catch (e) {
        console.warn('[PO-STORAGE] Failed to convert poDate, using current date');
        normalized.poDate = new Date();
      }
    }
    // Basic validation: quotation must exist and be Accepted (or status indicates acceptance)
    if (po.quotationId) {
      const quotation = await db.select().from(quotations).where(eq(quotations.id, po.quotationId));
      if (!quotation.length) throw new Error('Quotation not found for PO');
      const q = quotation[0];
      if (q.status !== 'Accepted') {
        throw new Error('Quotation must be Accepted before uploading PO');
      }
    }
    const rows = await db.insert(purchaseOrders).values(normalized).returning();
    return rows[0];
  }

  async updatePurchaseOrder(id: string, po: Partial<InsertPurchaseOrder>): Promise<PurchaseOrder> {
    const existing = await this.getPurchaseOrder(id);
    if (!existing) throw new Error('Purchase order not found');
    const rows = await db.update(purchaseOrders).set(po).where(eq(purchaseOrders.id, id)).returning();
    return rows[0];
  }

  async deletePurchaseOrder(id: string): Promise<void> {
    await db.delete(purchaseOrders).where(eq(purchaseOrders.id, id));
  }

  async validatePurchaseOrder(id: string, validation: { status: string; notes?: string; validatedBy: string }): Promise<PurchaseOrder> {
    const existing = await this.getPurchaseOrder(id);
    if (!existing) throw new Error('Purchase order not found');
    const rows = await db.update(purchaseOrders).set({
      validationStatus: validation.status as any,
      validationNotes: validation.notes,
      validatedBy: validation.validatedBy as any,
      validatedAt: new Date(),
    }).where(eq(purchaseOrders.id, id)).returning();
    return rows[0];
  }

  async getPoLineItems(purchaseOrderId: string): Promise<PoLineItem[]> {
    return await db.select().from(poLineItems).where(eq(poLineItems.purchaseOrderId, purchaseOrderId));
  }

  async createPoLineItem(line: InsertPoLineItem): Promise<PoLineItem> {
    const rows = await db.insert(poLineItems).values(line).returning();
    return rows[0];
  }

  async updatePoLineItem(id: string, line: Partial<InsertPoLineItem>): Promise<PoLineItem> {
    const rows = await db.update(poLineItems).set(line).where(eq(poLineItems.id, id)).returning();
    return rows[0];
  }

  async bulkCreatePoLineItems(lines: InsertPoLineItem[]): Promise<PoLineItem[]> {
    if (!lines.length) return [];
    const rows = await db.insert(poLineItems).values(lines).returning();
    return rows;
  }

  // Extended validation helper: ensure PO lines correspond to accepted quotation items
  async validateLinesAgainstAcceptance(purchaseOrderId: string): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];
    const lines = await this.getPoLineItems(purchaseOrderId);
    const po = await this.getPurchaseOrder(purchaseOrderId);
    if (!po) return { valid: false, issues: ['PO not found'] };
    if (!po.quotationId) return { valid: true, issues }; // Nothing to validate

    const quotationItemRows = await db.select().from(quotationItems).where(eq(quotationItems.quotationId, po.quotationId));
    const acceptedItems = await db.select().from(quotationItemAcceptances).where(inArray(quotationItemAcceptances.quotationItemId, quotationItemRows.map(r => r.id)));

    const acceptedSet = new Set(acceptedItems.filter(ai => ai.isAccepted).map(ai => ai.quotationItemId));

    for (const line of lines) {
      if (line.quotationItemId && !acceptedSet.has(line.quotationItemId)) {
        issues.push(`Line ${line.id} references quotation item not accepted`);
      }
    }

    return { valid: issues.length === 0, issues };
  }
}
