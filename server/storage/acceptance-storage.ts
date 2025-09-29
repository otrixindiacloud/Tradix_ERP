import { db } from '../db.js';
import { BaseStorage } from './base.js';
import {
  customerAcceptances,
  quotationItemAcceptances,
  acceptanceConfirmations,
  InsertCustomerAcceptance,
  InsertQuotationItemAcceptance,
  InsertAcceptanceConfirmation,
  CustomerAcceptance,
  QuotationItemAcceptance,
  AcceptanceConfirmation
} from '@shared/schema';
import { eq, and } from 'drizzle-orm';

export class AcceptanceStorage extends BaseStorage {
  // Customer Acceptance CRUD
  async getCustomerAcceptances(quotationId?: string): Promise<CustomerAcceptance[]> {
    if (quotationId) {
      return await db.select().from(customerAcceptances).where(eq(customerAcceptances.quotationId, quotationId));
    }
    return await db.select().from(customerAcceptances);
  }

  async getCustomerAcceptance(id: string): Promise<CustomerAcceptance | undefined> {
    const rows = await db.select().from(customerAcceptances).where(eq(customerAcceptances.id, id));
    return rows[0];
  }

  async createCustomerAcceptance(acceptance: InsertCustomerAcceptance): Promise<CustomerAcceptance> {
    const rows = await db.insert(customerAcceptances).values(acceptance).returning();
    return rows[0];
  }

  async updateCustomerAcceptance(id: string, acceptance: Partial<InsertCustomerAcceptance>): Promise<CustomerAcceptance> {
    const existing = await this.getCustomerAcceptance(id);
    if (!existing) throw new Error('Customer acceptance not found');
    const rows = await db.update(customerAcceptances).set(acceptance).where(eq(customerAcceptances.id, id)).returning();
    return rows[0];
  }

  async deleteCustomerAcceptance(id: string): Promise<void> {
    await db.delete(customerAcceptances).where(eq(customerAcceptances.id, id));
  }

  async supersedeActiveAcceptances(quotationId: string): Promise<void> {
    // Mark all active acceptances for this quotation as Superseded
    await db.update(customerAcceptances)
      .set({ status: 'Superseded' as any })
      .where(and(eq(customerAcceptances.quotationId, quotationId), eq(customerAcceptances.status, 'Active')));
  }

  // Quotation Item Acceptances
  async getQuotationItemAcceptances(customerAcceptanceId: string): Promise<QuotationItemAcceptance[]> {
    return await db.select().from(quotationItemAcceptances).where(eq(quotationItemAcceptances.customerAcceptanceId, customerAcceptanceId));
  }

  async getQuotationItemAcceptance(id: string): Promise<QuotationItemAcceptance | undefined> {
    const rows = await db.select().from(quotationItemAcceptances).where(eq(quotationItemAcceptances.id, id));
    return rows[0];
  }

  async createQuotationItemAcceptance(item: InsertQuotationItemAcceptance): Promise<QuotationItemAcceptance> {
    const rows = await db.insert(quotationItemAcceptances).values(item).returning();
    return rows[0];
  }

  async updateQuotationItemAcceptance(id: string, item: Partial<InsertQuotationItemAcceptance>): Promise<QuotationItemAcceptance> {
    const existing = await this.getQuotationItemAcceptance(id);
    if (!existing) throw new Error('Quotation item acceptance not found');
    const rows = await db.update(quotationItemAcceptances).set(item).where(eq(quotationItemAcceptances.id, id)).returning();
    return rows[0];
  }

  async bulkCreateQuotationItemAcceptances(items: InsertQuotationItemAcceptance[]): Promise<QuotationItemAcceptance[]> {
    if (!items.length) return [];
    // De-duplicate by (customerAcceptanceId, quotationItemId)
    const uniqueMap = new Map<string, InsertQuotationItemAcceptance>();
    for (const it of items) {
      const key = `${it.customerAcceptanceId}:${it.quotationItemId}`;
      if (!uniqueMap.has(key)) uniqueMap.set(key, it);
    }
    const deduped = Array.from(uniqueMap.values());
    if (!deduped.length) return [];
    const rows = await db.insert(quotationItemAcceptances).values(deduped).returning();
    return rows;
  }

  // Acceptance Confirmations
  async getAcceptanceConfirmations(customerAcceptanceId: string): Promise<AcceptanceConfirmation[]> {
    return await db.select().from(acceptanceConfirmations).where(eq(acceptanceConfirmations.customerAcceptanceId, customerAcceptanceId));
  }

  async createAcceptanceConfirmation(conf: InsertAcceptanceConfirmation): Promise<AcceptanceConfirmation> {
    const rows = await db.insert(acceptanceConfirmations).values(conf).returning();
    return rows[0];
  }
}
