import { db } from "../db";
import { supplierLpos, supplierLpoItems, salesOrders, salesOrderItems, items, suppliers, InsertSupplierLpo, InsertSupplierLpoItem } from "@shared/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { BaseStorage } from "./base";

export class SupplierLpoStorage extends BaseStorage {
  async getSupplierLpos(limit = 50, offset = 0, filters?: { status?: string; supplierId?: string; dateFrom?: string; dateTo?: string; search?: string; }) {
    let base = db.select({
      id: supplierLpos.id,
      lpoNumber: supplierLpos.lpoNumber,
      supplierId: supplierLpos.supplierId,
      supplierName: suppliers.name,
      status: supplierLpos.status,
      lpoDate: supplierLpos.lpoDate,
      expectedDeliveryDate: supplierLpos.expectedDeliveryDate,
      requestedDeliveryDate: supplierLpos.requestedDeliveryDate,
      subtotal: supplierLpos.subtotal,
      taxAmount: supplierLpos.taxAmount,
      totalAmount: supplierLpos.totalAmount,
      currency: supplierLpos.currency,
      approvalStatus: supplierLpos.approvalStatus,
      requiresApproval: supplierLpos.requiresApproval,
      paymentTerms: supplierLpos.paymentTerms,
      deliveryTerms: supplierLpos.deliveryTerms,
      version: supplierLpos.version,
      createdAt: supplierLpos.createdAt,
      updatedAt: supplierLpos.updatedAt,
      createdBy: supplierLpos.createdBy,
      sourceType: supplierLpos.sourceType,
      sourceSalesOrderIds: supplierLpos.sourceSalesOrderIds,
      sourceQuotationIds: supplierLpos.sourceQuotationIds,
      groupingCriteria: supplierLpos.groupingCriteria,
      termsAndConditions: supplierLpos.termsAndConditions,
      specialInstructions: supplierLpos.specialInstructions,
      parentLpoId: supplierLpos.parentLpoId,
      amendmentReason: supplierLpos.amendmentReason,
      amendmentType: supplierLpos.amendmentType,
      approvedBy: supplierLpos.approvedBy,
      approvedAt: supplierLpos.approvedAt,
      approvalNotes: supplierLpos.approvalNotes,
      sentToSupplierAt: supplierLpos.sentToSupplierAt,
      confirmedBySupplierAt: supplierLpos.confirmedBySupplierAt,
      supplierConfirmationReference: supplierLpos.supplierConfirmationReference,
      supplierContactPerson: supplierLpos.supplierContactPerson,
      supplierEmail: supplierLpos.supplierEmail,
      supplierPhone: supplierLpos.supplierPhone
    }).from(supplierLpos)
    .leftJoin(suppliers, eq(supplierLpos.supplierId, suppliers.id));
    
    const conditions: any[] = [];
    if (filters) {
      if (filters.status) conditions.push(eq(supplierLpos.status, filters.status as any));
      if (filters.supplierId) conditions.push(eq(supplierLpos.supplierId, filters.supplierId));
      if (filters.dateFrom) conditions.push(sql`${supplierLpos.lpoDate} >= ${filters.dateFrom}`);
      if (filters.dateTo) conditions.push(sql`${supplierLpos.lpoDate} <= ${filters.dateTo}`);
      if (filters.search) conditions.push(sql`(${supplierLpos.lpoNumber} ILIKE ${`%${filters.search}%`} OR ${suppliers.name} ILIKE ${`%${filters.search}%`})`);
      if (conditions.length) base = (base as any).where(and(...conditions));
    }
    return (base as any).orderBy(desc(supplierLpos.createdAt)).limit(limit).offset(offset);
  }
  async getSupplierLpo(id: string) { const r = await db.select().from(supplierLpos).where(eq(supplierLpos.id, id)).limit(1); return r[0]; }
  
  async getSupplierLposCount(filters?: { status?: string; supplierId?: string; dateFrom?: string; dateTo?: string; search?: string; }) {
    let base = db.select({ count: sql<number>`count(*)` }).from(supplierLpos)
      .leftJoin(suppliers, eq(supplierLpos.supplierId, suppliers.id));
    
    const conditions: any[] = [];
    if (filters) {
      if (filters.status) conditions.push(eq(supplierLpos.status, filters.status as any));
      if (filters.supplierId) conditions.push(eq(supplierLpos.supplierId, filters.supplierId));
      if (filters.dateFrom) conditions.push(sql`${supplierLpos.lpoDate} >= ${filters.dateFrom}`);
      if (filters.dateTo) conditions.push(sql`${supplierLpos.lpoDate} <= ${filters.dateTo}`);
      if (filters.search) conditions.push(sql`(${supplierLpos.lpoNumber} ILIKE ${`%${filters.search}%`} OR ${suppliers.name} ILIKE ${`%${filters.search}%`})`);
      if (conditions.length) base = (base as any).where(and(...conditions));
    }
    const result = await base;
    return result[0]?.count || 0;
  }
  async createSupplierLpo(data: Partial<InsertSupplierLpo>) {
    const lpoNumber = data.lpoNumber || this.generateNumber("LPO");
    let supplierId = data.supplierId;
    if (!supplierId) {
      const existing = await db.select().from(suppliers).limit(1);
      if (existing[0]) supplierId = existing[0].id; else {
        const created = await db.insert(suppliers).values({ name: "Auto Supplier", contactPerson: "System" } as any).returning();
        supplierId = created[0].id;
      }
    }
    console.debug('[SupplierLpoStorage.createSupplierLpo] Preparing insert', { lpoNumber, supplierId });
        const record: any = {
      lpoNumber,
      supplierId,
      status: data.status || 'Draft',
      sourceType: data.sourceType || 'Manual',
      groupingCriteria: data.groupingCriteria,
      subtotal: data.subtotal,
      taxAmount: data.taxAmount,
      totalAmount: data.totalAmount,
  currency: data.currency || 'BHD',
      requiresApproval: data.requiresApproval || false,
      approvalStatus: data.approvalStatus || (data.requiresApproval ? 'Pending' : 'Not Required'),
      createdBy: (data as any).createdBy || null, // Allow null for createdBy
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      sourceSalesOrderIds: data.sourceSalesOrderIds,
      sourceQuotationIds: data.sourceQuotationIds,
    };
    console.debug('[SupplierLpoStorage.createSupplierLpo] Insert record', record);
    const inserted = await db.insert(supplierLpos).values(record).returning();
    console.debug('[SupplierLpoStorage.createSupplierLpo] Insert result', inserted);
    if (!inserted || !inserted[0]) {
      console.error('[SupplierLpoStorage.createSupplierLpo] Insert returned empty result set', { record });
      throw new Error('Failed to insert supplier LPO');
    }
    return inserted[0];
  }
  async updateSupplierLpo(id: string, data: Partial<InsertSupplierLpo>) { const updated: any = { ...data, updatedAt: new Date() }; const res = await db.update(supplierLpos).set(updated).where(eq(supplierLpos.id, id)).returning(); return res[0]; }
  async deleteSupplierLpo(id: string) { await db.delete(supplierLpos).where(eq(supplierLpos.id, id)); }
  async createSupplierLposFromSalesOrders(salesOrderIds: string[], groupBy: string, userId?: string, supplierIdOverride?: string) {
    if (!salesOrderIds.length) return [];
    const out: any[] = [];
    for (const soId of salesOrderIds) {
      const so = (await db.select().from(salesOrders).where(eq(salesOrders.id, soId)).limit(1))[0];
      if (!so) continue;
      const soItems = await db.select().from(salesOrderItems).where(eq(salesOrderItems.salesOrderId, soId));
      let subtotal = 0; soItems.forEach(i=> subtotal += Number(i.totalPrice||0));
  const lpo = await this.createSupplierLpo({ supplierId: supplierIdOverride, sourceType: 'Auto', groupingCriteria: groupBy, subtotal: subtotal.toFixed(2), totalAmount: subtotal.toFixed(2), sourceSalesOrderIds: [soId], createdBy: userId } as any);
      const existingItem = (await db.select().from(items).limit(1))[0];
      const fallbackBarcode = existingItem?.barcode || `AUTO-${Date.now()}`;
      const lpoItems = soItems.map((soi, idx) => ({
        supplierLpoId: lpo.id,
        itemId: soi.itemId || existingItem?.id,
        salesOrderItemId: soi.id,
        supplierCode: existingItem?.supplierCode || 'GEN-SUP',
        barcode: fallbackBarcode,
        itemDescription: 'Auto-generated from Sales Order',
        quantity: soi.quantity,
        receivedQuantity: 0,
        pendingQuantity: soi.quantity, // initial pending equals ordered
        unitCost: soi.unitPrice as any || '0',
        totalCost: soi.totalPrice as any || '0',
  currency: 'BHD',
        lineNumber: idx + 1,
        deliveryStatus: 'Pending'
      }));
      if (lpoItems.length) await db.insert(supplierLpoItems).values(lpoItems as any);
      out.push(lpo);
    }
    return out;
  }
  async createAmendedSupplierLpo(parentLpoId: string, reason: string, amendmentType: string, userId?: string) {
    const parent = await this.getSupplierLpo(parentLpoId); if (!parent) throw new Error('Parent LPO not found');
    return this.createSupplierLpo({ supplierId: parent.supplierId, sourceType: parent.sourceType, groupingCriteria: parent.groupingCriteria, subtotal: parent.subtotal, totalAmount: parent.totalAmount, currency: parent.currency, version: (parent.version||1)+1, parentLpoId, amendmentReason: reason, amendmentType, createdBy: userId, requiresApproval: parent.requiresApproval, approvalStatus: parent.approvalStatus, sourceSalesOrderIds: parent.sourceSalesOrderIds } as any);
  }
  async submitForApproval(id: string, userId: string) { const lpo = await this.getSupplierLpo(id); if (!lpo) throw new Error('Supplier LPO not found'); return this.updateSupplierLpo(id, { requiresApproval: true, approvalStatus: 'Pending' } as any); }
  async approveSupplierLpo(id: string, userId: string, notes?: string) { const lpo = await this.getSupplierLpo(id); if (!lpo) throw new Error('Supplier LPO not found'); return this.updateSupplierLpo(id, { approvalStatus: 'Approved', approvedBy: userId as any, approvedAt: new Date(), approvalNotes: notes } as any); }
  async rejectSupplierLpo(id: string, userId: string, notes: string) { const lpo = await this.getSupplierLpo(id); if (!lpo) throw new Error('Supplier LPO not found'); return this.updateSupplierLpo(id, { approvalStatus: 'Rejected', approvalNotes: notes } as any); }
  async sendToSupplier(id: string, userId: string) { const lpo = await this.getSupplierLpo(id); if (!lpo) throw new Error('Supplier LPO not found'); return this.updateSupplierLpo(id, { status: 'Sent', sentToSupplierAt: new Date() } as any); }
  async confirmBySupplier(id: string, confirmationReference?: string) { const lpo = await this.getSupplierLpo(id); if (!lpo) throw new Error('Supplier LPO not found'); return this.updateSupplierLpo(id, { status: 'Confirmed', confirmedBySupplierAt: new Date(), supplierConfirmationReference: confirmationReference } as any); }
  async updateExpectedDeliveryDate(id: string, expectedDeliveryDate: string, userId?: string) { 
    const lpo = await this.getSupplierLpo(id); 
    if (!lpo) throw new Error('Supplier LPO not found'); 
    return this.updateSupplierLpo(id, { 
      expectedDeliveryDate: new Date(expectedDeliveryDate), 
      updatedAt: new Date() 
    } as any); 
  }
  async getSupplierLpoBacklog() { return db.select().from(supplierLpos).where(sql`${supplierLpos.status} IN ('Draft','Sent')`); }
  async getCustomerOrderBacklog() { return []; }
  async getSupplierLpoItems(lpoId: string) { return db.select().from(supplierLpoItems).where(eq(supplierLpoItems.supplierLpoId, lpoId)); }
  async getSupplierLpoItem(id: string) { const r = await db.select().from(supplierLpoItems).where(eq(supplierLpoItems.id, id)).limit(1); return r[0]; }
  async createSupplierLpoItem(item: InsertSupplierLpoItem) { const r = await db.insert(supplierLpoItems).values(item as any).returning(); return r[0]; }
  async updateSupplierLpoItem(id: string, item: Partial<InsertSupplierLpoItem>) { const r = await db.update(supplierLpoItems).set(item as any).where(eq(supplierLpoItems.id, id)).returning(); return r[0]; }
  async deleteSupplierLpoItem(id: string) { await db.delete(supplierLpoItems).where(eq(supplierLpoItems.id, id)); }
  async bulkCreateSupplierLpoItems(itemsArr: InsertSupplierLpoItem[]) { if (!itemsArr.length) return []; const r = await db.insert(supplierLpoItems).values(itemsArr as any).returning(); return r; }
}
