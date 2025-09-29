import { 
  suppliers, 
  auditLogs, 
  supplierLpos, 
  supplierLpoItems,
  goodsReceiptHeaders,
  goodsReceiptItems,
  items,
  invoices,
  type Supplier, 
  type InsertSupplier 
} from "@shared/schema";
import { db } from "../db.js";
import { eq, desc, and, sql, count, sum } from "drizzle-orm";
import { BaseStorage } from './base.js';
import { ISupplierStorage } from './interfaces.js';

export class SupplierStorage extends BaseStorage implements ISupplierStorage {
  async getSuppliers(): Promise<Supplier[]> {
    return db
      .select()
      .from(suppliers)
      .where(eq(suppliers.isActive, true))
      .orderBy(desc(suppliers.createdAt));
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier;
  }

  async createSupplier(supplierData: InsertSupplier): Promise<Supplier> {
    const [supplier] = await db.insert(suppliers).values(supplierData).returning();
    // TODO: Re-enable audit logging once audit table is properly set up
    // await this.logAuditEvent("supplier", supplier.id, "create", undefined, undefined, supplier);
    return supplier;
  }

  async updateSupplier(id: string, supplierData: Partial<InsertSupplier>): Promise<Supplier> {
    const oldSupplier = await this.getSupplier(id);
    const [supplier] = await db.update(suppliers).set({
      ...supplierData,
      updatedAt: new Date()
    }).where(eq(suppliers.id, id)).returning();
    
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    
    // TODO: Re-enable audit logging once audit table is properly set up
    // await this.logAuditEvent("supplier", supplier.id, "update", undefined, oldSupplier, supplier);
    return supplier;
  }

  async deleteSupplier(id: string): Promise<void> {
    const oldSupplier = await this.getSupplier(id);
    await db.update(suppliers).set({
      isActive: false,
      updatedAt: new Date()
    }).where(eq(suppliers.id, id));
    
    // TODO: Re-enable audit logging once audit table is properly set up
    // await this.logAuditEvent("supplier", id, "delete", undefined, oldSupplier, { isActive: false });
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

  // Enhanced methods for supplier detail page
  async getSupplierDetails(id: string): Promise<{
    supplier: Supplier;
    stats: {
      totalLpos: number;
      totalLpoValue: string;
      pendingLpos: number;
      totalItems: number;
      totalGoodsReceipts: number;
      averageDeliveryDays: number;
      onTimeDeliveryRate: number;
    };
    recentActivities: Array<{
      id: string;
      type: string;
      description: string;
      date: string;
      status?: string;
      amount?: string;
    }>;
  } | null> {
    try {
      console.log('DEBUG: getSupplierDetails called with ID:', id);
      
      const supplier = await this.getSupplier(id);
      console.log('DEBUG: getSupplier result:', supplier ? 'found' : 'not found');
      
      if (!supplier) {
        console.log('DEBUG: Supplier not found, returning null');
        return null;
      }

      // Get LPO statistics
      const lpoStats = await db
        .select({
          totalLpos: count(),
          totalValue: sum(supplierLpos.totalAmount),
          pendingLpos: sql<number>`COUNT(CASE WHEN status IN ('Draft', 'Pending', 'Sent') THEN 1 END)`,
        })
        .from(supplierLpos)
        .where(eq(supplierLpos.supplierId, id));

      console.log('DEBUG: LPO stats:', lpoStats);

      // Get items count
      const itemStats = await db
        .select({ count: count() })
        .from(items)
        .where(eq(items.supplierId, id));

      console.log('DEBUG: Item stats:', itemStats);

      // Get goods receipt statistics - simplified to avoid complexity
      const grStats = await db
        .select({
          totalReceipts: count(),
        })
        .from(goodsReceiptHeaders)
        .innerJoin(supplierLpos, eq(goodsReceiptHeaders.supplierLpoId, supplierLpos.id))
        .where(eq(supplierLpos.supplierId, id));

      console.log('DEBUG: GR stats:', grStats);

      // Get recent activities - simplified
      const recentLpos = await db
        .select({
          id: supplierLpos.id,
          lpoNumber: supplierLpos.lpoNumber,
          status: supplierLpos.status,
          totalAmount: supplierLpos.totalAmount,
          lpoDate: supplierLpos.lpoDate,
        })
        .from(supplierLpos)
        .where(eq(supplierLpos.supplierId, id))
        .orderBy(desc(supplierLpos.lpoDate))
        .limit(10);

      console.log('DEBUG: Recent LPOs:', recentLpos);

      // Combine activities
      const activities = recentLpos.map(lpo => ({
        id: lpo.id,
        type: 'LPO',
        description: `LPO ${lpo.lpoNumber} created`,
        date: lpo.lpoDate ? new Date(lpo.lpoDate).toISOString() : '',
        status: lpo.status || undefined,
        amount: lpo.totalAmount?.toString(),
      })).slice(0, 20);

      const result = {
        supplier,
        stats: {
          totalLpos: lpoStats[0]?.totalLpos || 0,
          totalLpoValue: lpoStats[0]?.totalValue?.toString() || '0',
          pendingLpos: lpoStats[0]?.pendingLpos || 0,
          totalItems: itemStats[0]?.count || 0,
          totalGoodsReceipts: grStats[0]?.totalReceipts || 0,
          averageDeliveryDays: 0, // Simplified
          onTimeDeliveryRate: 0, // Simplified
        },
        recentActivities: activities,
      };

      console.log('DEBUG: Final result:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('Error in getSupplierDetails:', error);
      return null;
    }
  }

  async getSupplierLposForDetail(supplierId: string, page = 1, limit = 20): Promise<{
    lpos: Array<{
      id: string;
      lpoNumber: string;
      status: string;
      lpoDate: string;
      expectedDeliveryDate: string | null;
      totalAmount: string | null;
      itemsCount: number;
    }>;
    total: number;
  }> {
    const offset = (page - 1) * limit;

    const lpos = await db
      .select({
        id: supplierLpos.id,
        lpoNumber: supplierLpos.lpoNumber,
        status: supplierLpos.status,
        lpoDate: supplierLpos.lpoDate,
        expectedDeliveryDate: supplierLpos.expectedDeliveryDate,
        totalAmount: supplierLpos.totalAmount,
        itemsCount: sql<number>`COUNT(${supplierLpoItems.id})`,
      })
      .from(supplierLpos)
      .leftJoin(supplierLpoItems, eq(supplierLpos.id, supplierLpoItems.supplierLpoId))
      .where(eq(supplierLpos.supplierId, supplierId))
      .groupBy(supplierLpos.id)
      .orderBy(desc(supplierLpos.lpoDate))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: count() })
      .from(supplierLpos)
      .where(eq(supplierLpos.supplierId, supplierId));

    return {
      lpos: lpos.map(lpo => ({
        ...lpo,
        lpoDate: lpo.lpoDate?.toISOString() || '',
        expectedDeliveryDate: lpo.expectedDeliveryDate?.toISOString() || null,
        totalAmount: lpo.totalAmount?.toString() || null,
        status: lpo.status || '',
      })),
      total: totalResult[0]?.count || 0,
    };
  }

  async getSupplierItems(supplierId: string, page = 1, limit = 20): Promise<{
    items: Array<{
      id: string;
      supplierCode: string;
      barcode: string | null;
      description: string;
      category: string | null;
      unitOfMeasure: string | null;
      costPrice: string | null;
      isActive: boolean;
      lastOrderDate: string | null;
      totalOrdered: number;
    }>;
    total: number;
  }> {
    const offset = (page - 1) * limit;

    const supplierItems = await db
      .select({
        id: items.id,
        supplierCode: items.supplierCode,
        barcode: items.barcode,
        description: items.description,
        category: items.category,
        unitOfMeasure: items.unitOfMeasure,
        costPrice: items.costPrice,
        isActive: items.isActive,
        lastOrderDate: sql<Date>`MAX(${supplierLpos.lpoDate})`,
        totalOrdered: sql<number>`COALESCE(SUM(${supplierLpoItems.quantity}), 0)`,
      })
      .from(items)
      .leftJoin(supplierLpoItems, eq(items.id, supplierLpoItems.itemId))
      .leftJoin(supplierLpos, eq(supplierLpoItems.supplierLpoId, supplierLpos.id))
      .where(eq(items.supplierId, supplierId))
      .groupBy(items.id)
      .orderBy(desc(items.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: count() })
      .from(items)
      .where(eq(items.supplierId, supplierId));

    return {
      items: supplierItems.map(item => ({
        ...item,
        costPrice: item.costPrice?.toString() || null,
        lastOrderDate: item.lastOrderDate?.toISOString() || null,
        isActive: item.isActive || false,
      })),
      total: totalResult[0]?.count || 0,
    };
  }

  async getSupplierGoodsReceipts(supplierId: string, page = 1, limit = 20): Promise<{
    receipts: Array<{
      id: string;
      receiptNumber: string;
      receiptDate: string;
      status: string;
      lpoNumber: string;
      totalItems: number;
      receivedItems: number;
      expectedDeliveryDate: string | null;
      actualDeliveryDate: string | null;
    }>;
    total: number;
  }> {
    const offset = (page - 1) * limit;

    const receipts = await db
      .select({
        id: goodsReceiptHeaders.id,
        receiptNumber: goodsReceiptHeaders.receiptNumber,
        receiptDate: goodsReceiptHeaders.receiptDate,
        status: goodsReceiptHeaders.status,
        lpoNumber: supplierLpos.lpoNumber,
        expectedDeliveryDate: goodsReceiptHeaders.expectedDeliveryDate,
        actualDeliveryDate: goodsReceiptHeaders.actualDeliveryDate,
        totalItems: sql<number>`COUNT(${goodsReceiptItems.id})`,
        receivedItems: sql<number>`SUM(${goodsReceiptItems.quantityReceived})`,
      })
      .from(goodsReceiptHeaders)
      .innerJoin(supplierLpos, eq(goodsReceiptHeaders.supplierLpoId, supplierLpos.id))
      .leftJoin(goodsReceiptItems, eq(goodsReceiptHeaders.id, goodsReceiptItems.receiptHeaderId))
      .where(eq(supplierLpos.supplierId, supplierId))
      .groupBy(goodsReceiptHeaders.id, supplierLpos.lpoNumber)
      .orderBy(desc(goodsReceiptHeaders.receiptDate))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: count() })
      .from(goodsReceiptHeaders)
      .innerJoin(supplierLpos, eq(goodsReceiptHeaders.supplierLpoId, supplierLpos.id))
      .where(eq(supplierLpos.supplierId, supplierId));

    return {
      receipts: receipts.map(receipt => ({
        ...receipt,
        receiptDate: receipt.receiptDate ? new Date(receipt.receiptDate).toISOString() : '',
        expectedDeliveryDate: receipt.expectedDeliveryDate ? new Date(receipt.expectedDeliveryDate).toISOString() : null,
        actualDeliveryDate: receipt.actualDeliveryDate ? new Date(receipt.actualDeliveryDate).toISOString() : null,
      })),
      total: totalResult[0]?.count || 0,
    };
  }

  async getSupplierPerformanceMetrics(supplierId: string): Promise<{
    deliveryPerformance: {
      onTimeDeliveries: number;
      totalDeliveries: number;
      onTimeRate: number;
      averageDelayDays: number;
    };
    qualityMetrics: {
      totalReceipts: number;
      acceptedReceipts: number;
      rejectedReceipts: number;
      acceptanceRate: number;
    };
    financialMetrics: {
      totalOrderValue: string;
      averageOrderValue: string;
      paymentTermsCompliance: number;
    };
  }> {
    try {
      // Delivery performance - simplified query
      const deliveryStats = await db
        .select({
          totalDeliveries: count(),
          onTimeDeliveries: sql<number>`COUNT(CASE WHEN ${goodsReceiptHeaders.actualDeliveryDate} <= ${goodsReceiptHeaders.expectedDeliveryDate} THEN 1 END)`,
        })
        .from(goodsReceiptHeaders)
        .innerJoin(supplierLpos, eq(goodsReceiptHeaders.supplierLpoId, supplierLpos.id))
        .where(and(
          eq(supplierLpos.supplierId, supplierId),
          sql`${goodsReceiptHeaders.actualDeliveryDate} IS NOT NULL`
        ));

      // Quality metrics
      const qualityStats = await db
        .select({
          totalReceipts: count(),
          acceptedReceipts: sql<number>`COUNT(CASE WHEN ${goodsReceiptHeaders.status} = 'Completed' THEN 1 END)`,
          rejectedReceipts: sql<number>`COUNT(CASE WHEN ${goodsReceiptHeaders.status} = 'Rejected' THEN 1 END)`,
        })
        .from(goodsReceiptHeaders)
        .innerJoin(supplierLpos, eq(goodsReceiptHeaders.supplierLpoId, supplierLpos.id))
        .where(eq(supplierLpos.supplierId, supplierId));

      // Financial metrics
      const financialStats = await db
        .select({
          totalOrderValue: sum(supplierLpos.totalAmount),
          avgOrderValue: sql<number>`AVG(${supplierLpos.totalAmount})`,
          totalOrders: count(),
        })
        .from(supplierLpos)
        .where(eq(supplierLpos.supplierId, supplierId));

      const delivery = deliveryStats[0] || { totalDeliveries: 0, onTimeDeliveries: 0 };
      const quality = qualityStats[0] || { totalReceipts: 0, acceptedReceipts: 0, rejectedReceipts: 0 };
      const financial = financialStats[0] || { totalOrderValue: null, avgOrderValue: 0, totalOrders: 0 };

      return {
        deliveryPerformance: {
          onTimeDeliveries: delivery.onTimeDeliveries,
          totalDeliveries: delivery.totalDeliveries,
          onTimeRate: delivery.totalDeliveries > 0 ? (delivery.onTimeDeliveries / delivery.totalDeliveries) * 100 : 0,
          averageDelayDays: 0, // Simplified for now
        },
        qualityMetrics: {
          totalReceipts: quality.totalReceipts,
          acceptedReceipts: quality.acceptedReceipts,
          rejectedReceipts: quality.rejectedReceipts,
          acceptanceRate: quality.totalReceipts > 0 ? (quality.acceptedReceipts / quality.totalReceipts) * 100 : 0,
        },
        financialMetrics: {
          totalOrderValue: financial.totalOrderValue?.toString() || '0',
          averageOrderValue: financial.avgOrderValue?.toString() || '0',
          paymentTermsCompliance: 100, // TODO: Implement based on actual payment data
        },
      };
    } catch (error) {
      console.error('Error in getSupplierPerformanceMetrics:', error);
      // Return default values instead of throwing
      return {
        deliveryPerformance: {
          onTimeDeliveries: 0,
          totalDeliveries: 0,
          onTimeRate: 0,
          averageDelayDays: 0,
        },
        qualityMetrics: {
          totalReceipts: 0,
          acceptedReceipts: 0,
          rejectedReceipts: 0,
          acceptanceRate: 0,
        },
        financialMetrics: {
          totalOrderValue: '0',
          averageOrderValue: '0',
          paymentTermsCompliance: 100,
        },
      };
    }
  }
}
