import { db } from "../db";
import { salesOrders, salesOrderItems, quotations, quotationItems, items, customers } from "@shared/schema";
import { eq, and, desc, sql, or, like } from "drizzle-orm";
import { validateUUID, SYSTEM_USER_ID } from "@shared/utils/uuid";
import { ISalesOrderStorage } from "./interfaces";
import { BaseStorage } from "./base";

export class SalesOrderStorage extends BaseStorage implements ISalesOrderStorage {
  async getSalesOrders(limit = 50, offset = 0, filters?: {
    status?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    pendingSupplierLpo?: boolean;
  }) {
    // Build query with left join to customers so we can embed minimal customer object
    const conditions = [] as any[];
    if (filters) {
      if (filters.status) conditions.push(eq(salesOrders.status, filters.status as any));
      if (filters.customerId) conditions.push(eq(salesOrders.customerId, filters.customerId));
      if (filters.dateFrom) conditions.push(sql`${salesOrders.orderDate} >= ${filters.dateFrom}`);
      if (filters.dateTo) conditions.push(sql`${salesOrders.orderDate} <= ${filters.dateTo}`);
      if (filters.search) conditions.push(sql`${salesOrders.orderNumber} ILIKE ${`%${filters.search}%`}`);
    }

    let query = db
      .select({ so: salesOrders, cust: customers })
      .from(salesOrders)
      .leftJoin(customers, eq(salesOrders.customerId, customers.id));

    // Drizzle ORM chaining: .where() must come after .leftJoin()
    if (conditions.length) {
      query = query.where(and(...conditions));
    }

    const rows = await query.orderBy(desc(salesOrders.createdAt)).limit(limit).offset(offset);
    // Map to enriched shape with embedded customer + transition flag
    return rows.map(r => {
      const c = r.cust ? {
        id: (r.cust as any).id,
        name: (r.cust as any).name || (r.cust as any).customerName || (r.cust as any).companyName || (r.cust as any).fullName,
        customerType: (r.cust as any).customerType || null,
        address: (r.cust as any).address || (r.cust as any).billingAddress || null,
      } : null;
      return { ...r.so, customer: c, __customerEmbedded: true };
    });
  }

  async getSalesOrder(id: string) {
    const result = await db
      .select({
        salesOrder: salesOrders,
        customer: customers,
      })
      .from(salesOrders)
      .leftJoin(customers, eq(salesOrders.customerId, customers.id))
      .where(eq(salesOrders.id, id))
      .limit(1);
    
    if (result.length === 0) {
      return null;
    }
    const row = result[0];
    const customer = row.customer
      ? {
          id: (row.customer as any).id,
          name:
            (row.customer as any).name ||
            (row.customer as any).customerName ||
            (row.customer as any).companyName ||
            (row.customer as any).fullName,
          email: (row.customer as any).email ?? null,
          isActive: (row.customer as any).isActive ?? null,
          createdAt: (row.customer as any).createdAt ?? null,
          updatedAt: (row.customer as any).updatedAt ?? null,
          phone: (row.customer as any).phone ?? null,
          address:
            (row.customer as any).address ??
            (row.customer as any).billingAddress ??
            null,
          customerType: (row.customer as any).customerType ?? null,
          vatNumber: (row.customer as any).vatNumber ?? null,
          trnNumber: (row.customer as any).trnNumber ?? null,
          companyName: (row.customer as any).companyName ?? null,
          paymentTerms: (row.customer as any).paymentTerms ?? null,
        }
      : null;
    return { ...row.salesOrder, customer, __customerEmbedded: true };
  }

  async createSalesOrder(salesOrder: any) {
    const orderNumber = `SO-${new Date().getFullYear()}-${String(await this.getNextSequenceNumber()).padStart(3, '0')}`;
    
    const newSalesOrder = {
      // id omitted -> DB default gen_random_uuid()
      orderNumber,
      ...salesOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    const result = await db.insert(salesOrders).values(newSalesOrder).returning();
    return result[0];
  }

  async updateSalesOrder(id: string, salesOrder: any) {
    const updatedSalesOrder = {
      ...salesOrder,
      updatedAt: new Date(),
    };

    const result = await db
      .update(salesOrders)
      .set(updatedSalesOrder)
      .where(eq(salesOrders.id, id))
      .returning();
    
    return result[0];
  }

  async deleteSalesOrder(id: string) {
    await db.delete(salesOrders).where(eq(salesOrders.id, id));
  }

  async createSalesOrderFromQuotation(quotationId: string, userId?: string) {
    // Get the quotation with its items
    const quotation = await db.select().from(quotations).where(eq(quotations.id, quotationId)).limit(1);
    if (!quotation[0]) {
      throw new Error('Quotation not found');
    }

    const quotationData = quotation[0];

    // Validate that quotation is accepted
    if (quotationData.status !== 'Accepted') {
      throw new Error('Quotation must be accepted before creating sales order');
    }

    // Validate that PO has been uploaded
    if (!quotationData.customerPoDocument || quotationData.customerPoDocument.trim() === '') {
      throw new Error('Purchase order document must be uploaded before creating sales order');
    }
    const quotationItemsData = await db
      .select()
      .from(quotationItems)
      .where(eq(quotationItems.quotationId, quotationId));

    // Generate sales order number
    const orderNumber = `SO-${new Date().getFullYear()}-${String(await this.getNextSequenceNumber()).padStart(3, '0')}`;

    // Create the sales order
    const salesOrderData = {
      orderNumber,
      quotationId,
      customerId: quotationData.customerId,
      orderDate: new Date(),
      status: 'Draft' as const,
      totalAmount: quotationData.totalAmount,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    const result = await db.insert(salesOrders).values(salesOrderData).returning();
    const createdSalesOrder = result[0];

    // Create sales order items from quotation items
    if (quotationItemsData.length > 0) {
      // Determine a valid itemId to satisfy FK (use first existing item or create a generic one)
      let existingItem = (await db.select().from(items).limit(1))[0];
      if (!existingItem) {
        const created = await db.insert(items).values({
          supplierCode: `GEN-${Date.now()}`,
          description: 'Generic Item',
        }).returning();
        existingItem = created[0];
      }
      const fallbackItemId = existingItem.id;

      const salesOrderItemsData = quotationItemsData.map(qi => {
        const qty = Number(qi.quantity) || 0;
        const unit = Number(qi.unitPrice) || 0;
        const lineTotal = Number(qi.lineTotal) || unit * qty;
        return {
          salesOrderId: createdSalesOrder.id,
          itemId: fallbackItemId,
          quantity: qty,
          unitPrice: unit.toFixed(2),
          totalPrice: lineTotal.toFixed(2),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
      await db.insert(salesOrderItems).values(salesOrderItemsData);
    }

    return createdSalesOrder;
  }

  async createAmendedSalesOrder(parentOrderId: string, reason: string, userId?: string) {
    // Get the parent sales order
    const parentOrder = await this.getSalesOrder(parentOrderId);
    if (!parentOrder) {
      throw new Error('Parent sales order not found');
    }
    
    // Use transaction to ensure atomic operation
    return await db.transaction(async (tx) => {
      // Extract base order number (remove any existing amendment suffix)
      const baseOrderNumber = parentOrder.orderNumber.replace(/-A\d+$/, '');
      
      // Lock and get all existing orders related to this base order to prevent race conditions
      const existingOrders = await tx
        .select({
          orderNumber: salesOrders.orderNumber,
          amendmentSequence: salesOrders.amendmentSequence
        })
        .from(salesOrders)
        .where(
          or(
            eq(salesOrders.parentOrderId, parentOrderId),
            eq(salesOrders.orderNumber, baseOrderNumber),
            like(salesOrders.orderNumber, `${baseOrderNumber}-A%`)
          )
        )
        .for('update');
      
      // Find next available sequence number
      const used = new Set<number>();
      for (const order of existingOrders) {
        if (order.amendmentSequence && order.amendmentSequence > 0) {
          used.add(order.amendmentSequence);
        }
        // Also extract from order_number pattern for safety
        const match = /-A(\d+)$/.exec(order.orderNumber);
        if (match) {
          used.add(Number(match[1]));
        }
      }
      
      let nextSeq = 1;
      while (used.has(nextSeq)) {
        nextSeq++;
      }
      
      const amendedOrderNumber = `${baseOrderNumber}-A${nextSeq}`;
      const newVersion = (parentOrder.version || 1) + 1;

      const amendedSalesOrder = {
        orderNumber: amendedOrderNumber,
        amendmentSequence: nextSeq,
        parentOrderId,
        customerId: parentOrder.customerId,
        orderDate: new Date(),
        status: 'Draft' as const,
        totalAmount: parentOrder.totalAmount,
        createdBy: userId,
        version: newVersion,
        amendmentReason: reason,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      // Insert within the same transaction
      const result = await tx.insert(salesOrders).values(amendedSalesOrder).returning();
      const created = result[0];
      
      // Update parent timestamp
      await tx.update(salesOrders).set({ updatedAt: new Date() }).where(eq(salesOrders.id, parentOrderId));
      
      return created;
    });
  }

  async validateCustomerLpo(id: string, validationData: { status: string; notes?: string; validatedBy: string }) {
    const salesOrder = await this.getSalesOrder(id);
    if (!salesOrder) {
      throw new Error('Sales order not found');
    }

    const updatedSalesOrder = {
      customerLpoValidationStatus: validationData.status,
      customerLpoValidatedBy: validationData.validatedBy,
      customerLpoValidatedAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .update(salesOrders)
      .set(updatedSalesOrder)
      .where(eq(salesOrders.id, id))
      .returning();
    
    return result[0];
  }

  // Sales Order Item operations
  async getSalesOrderItems(salesOrderId: string) {
    return db
      .select()
      .from(salesOrderItems)
      .where(eq(salesOrderItems.salesOrderId, salesOrderId));
  }

  async getSalesOrderItem(id: string) {
    const result = await db.select().from(salesOrderItems).where(eq(salesOrderItems.id, id)).limit(1);
    return result[0];
  }

  async createSalesOrderItem(item: any) {
    const newItem = {
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    const result = await db.insert(salesOrderItems).values(newItem).returning();
    return result[0];
  }

  async updateSalesOrderItem(id: string, item: any) {
    const updatedItem = {
      ...item,
      updatedAt: new Date(),
    };

    const result = await db
      .update(salesOrderItems)
      .set(updatedItem)
      .where(eq(salesOrderItems.id, id))
      .returning();
    
    return result[0];
  }

  async deleteSalesOrderItem(id: string) {
    await db.delete(salesOrderItems).where(eq(salesOrderItems.id, id));
  }

  async bulkCreateSalesOrderItems(items: any[]) {
    const itemsWithIds = items.map(item => ({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await db.insert(salesOrderItems).values(itemsWithIds).returning();
    return result;
  }

  private async getNextSequenceNumber(): Promise<number> {
    const result = await db.execute(sql`
      SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 'SO-\\d{4}-(\\d+)') AS INTEGER)), 0) + 1 AS next_number
      FROM sales_orders
      WHERE order_number LIKE 'SO-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-%'
    `);
    const row: any = result.rows?.[0];
    return row?.next_number || 1;
  }

  /**
   * Get lineage (root + amendments) for a given order id. Root first then amendments by amendment_sequence.
   */
  async getSalesOrderLineage(orderId: string) {
    const current = await db.select().from(salesOrders).where(eq(salesOrders.id, orderId)).limit(1);
    if (!current.length) return [];
    let root = current[0];
    if (root.parentOrderId) {
      const maybeRoot = await db.select().from(salesOrders).where(eq(salesOrders.id, root.parentOrderId)).limit(1);
      if (maybeRoot.length) root = maybeRoot[0];
    }
    const lineage: any = await db.execute(sql`
      SELECT * FROM sales_orders
      WHERE id = ${root.id} OR parent_order_id = ${root.id}
      ORDER BY CASE WHEN amendment_sequence IS NULL THEN 0 ELSE amendment_sequence END
    `);
    return lineage.rows;
  }
}
