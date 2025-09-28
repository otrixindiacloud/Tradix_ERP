import { BaseStorage } from './base.js';
import { db } from '../db.js';
import { 
  physicalStock,
  physicalStockCounts,
  physicalStockCountItems,
  physicalStockScanningSessions,
  physicalStockScannedItems,
  physicalStockAdjustments,
  physicalStockAdjustmentItems,
  inventoryItems,
  inventoryLevels,
  users,
  stockMovements,
  type PhysicalStockCount,
  type PhysicalStockCountItem,
  type PhysicalStockScanningSession,
  type PhysicalStockScannedItem,
  type PhysicalStockAdjustment,
  type PhysicalStockAdjustmentItem,
  type InsertPhysicalStockCount,
  type InsertPhysicalStockCountItem,
  type InsertPhysicalStockScanningSession,
  type InsertPhysicalStockScannedItem,
  type InsertPhysicalStockAdjustment,
  type InsertPhysicalStockAdjustmentItem
} from '@shared/schema';
import { eq, and, desc, asc, sql, inArray } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

export class PhysicalStockStorage extends BaseStorage {
  async createPhysicalStockItem({ itemId, location, quantity, lastUpdated, countedBy, notes }: {
    itemId: string;
    location: string;
    quantity: number;
    lastUpdated: string;
    countedBy: string;
    notes?: string;
  }) {
    // Insert new record into physical_stock table
    const [newItem] = await db.insert(physicalStock).values({
      itemId,
      location,
      quantity,
      lastUpdated: new Date(lastUpdated),
      countedBy,
      notes,
    }).returning();
    // Audit log (optional)
    await this.logAuditEvent(
      'physical_stock',
      newItem.id,
      'created',
      countedBy,
      null,
      newItem
    );
    return newItem;
  }
  // === PHYSICAL STOCK ITEMS ===
  async getAllPhysicalStockItems() {
    // Returns all rows from the physicalStock table
    // Ensure physicalStock is imported from @shared/schema
    return await db.select().from(physicalStock);
  }
  
  async updatePhysicalStockItem(id: string, data: Partial<{ itemId: string; location: string; quantity: number; lastUpdated: string; countedBy: string; notes?: string }>) {
    // Fetch old data for audit
    const [oldItem] = await db.select().from(physicalStock).where(eq(physicalStock.id, id)).limit(1);
    if (!oldItem) return null;
    const updateData: any = { ...data };
    if (data.lastUpdated) {
      updateData.lastUpdated = new Date(data.lastUpdated);
    }
    const [updated] = await db
      .update(physicalStock)
      .set(updateData)
      .where(eq(physicalStock.id, id))
      .returning();
    await this.logAuditEvent('physical_stock', id, 'updated', data.countedBy, oldItem, updated);
    return updated;
  }

  async deletePhysicalStockItem(id: string, userId?: string) {
    const [oldItem] = await db.select().from(physicalStock).where(eq(physicalStock.id, id)).limit(1);
    if (!oldItem) return false;
    await db.delete(physicalStock).where(eq(physicalStock.id, id));
    await this.logAuditEvent('physical_stock', id, 'deleted', userId, oldItem, null);
    return true;
  }
  
  // === PHYSICAL STOCK COUNTS ===
  
  async createPhysicalStockCount(data: InsertPhysicalStockCount): Promise<PhysicalStockCount> {
    const countNumber = this.generateNumber('PSC');
    
    const [physicalStockCount] = await db.insert(physicalStockCounts).values({
      ...data,
      countNumber,
    }).returning();

    await this.logAuditEvent(
      'physical_stock_count',
      physicalStockCount.id,
      'created',
      data.createdBy || undefined,
      null,
      physicalStockCount
    );

    return physicalStockCount;
  }

  // Aliases for user joins
  static startedByUser = alias(users, 'startedByUser');
  static completedByUser = alias(users, 'completedByUser');
  static createdByUser = alias(users, 'createdByUser');

  async getPhysicalStockCounts(limit?: number, offset?: number) {
    const startedByUser = PhysicalStockStorage.startedByUser;
    const completedByUser = PhysicalStockStorage.completedByUser;
    const createdByUser = PhysicalStockStorage.createdByUser;
      let query = db
        .select({
          id: physicalStockCounts.id,
          countNumber: physicalStockCounts.countNumber,
          description: physicalStockCounts.description,
          countDate: physicalStockCounts.countDate,
          storageLocation: physicalStockCounts.storageLocation,
          countType: physicalStockCounts.countType,
          status: physicalStockCounts.status,
          scheduledDate: physicalStockCounts.scheduledDate,
          startedBy: physicalStockCounts.startedBy,
          startedAt: physicalStockCounts.startedAt,
          completedBy: physicalStockCounts.completedBy,
          completedAt: physicalStockCounts.completedAt,
          approvedBy: physicalStockCounts.approvedBy,
          approvedAt: physicalStockCounts.approvedAt,
          totalItemsExpected: physicalStockCounts.totalItemsExpected,
          totalItemsCounted: physicalStockCounts.totalItemsCounted,
          totalDiscrepancies: physicalStockCounts.totalDiscrepancies,
          notes: physicalStockCounts.notes,
          createdBy: physicalStockCounts.createdBy,
          createdAt: physicalStockCounts.createdAt,
          updatedAt: physicalStockCounts.updatedAt,
          // User details
          startedByUser: {
            id: startedByUser.id,
            firstName: startedByUser.firstName,
            lastName: startedByUser.lastName,
          },
          completedByUser: {
            id: completedByUser.id,
            firstName: completedByUser.firstName,
            lastName: completedByUser.lastName,
          },
          createdByUser: {
            id: createdByUser.id,
            firstName: createdByUser.firstName,
            lastName: createdByUser.lastName,
          },
        })
        .from(physicalStockCounts)
        .leftJoin(startedByUser, eq(physicalStockCounts.startedBy, startedByUser.id))
        .leftJoin(completedByUser, eq(physicalStockCounts.completedBy, completedByUser.id))
        .leftJoin(createdByUser, eq(physicalStockCounts.createdBy, createdByUser.id))
        .orderBy(desc(physicalStockCounts.createdAt));

      if (typeof limit === 'number' && typeof offset === 'number') {
        return await query.limit(limit).offset(offset);
      } else if (typeof limit === 'number') {
        return await query.limit(limit);
      }
      return await query;
  }

  async getPhysicalStockCountById(id: string): Promise<PhysicalStockCount | null> {
    const [physicalStockCount] = await db
      .select()
      .from(physicalStockCounts)
      .where(eq(physicalStockCounts.id, id))
      .limit(1);

    return physicalStockCount || null;
  }

  async getPhysicalStockCountByNumber(countNumber: string): Promise<PhysicalStockCount | null> {
    const [physicalStockCount] = await db
      .select()
      .from(physicalStockCounts)
      .where(eq(physicalStockCounts.countNumber, countNumber))
      .limit(1);

    return physicalStockCount || null;
  }

  async updatePhysicalStockCount(id: string, data: Partial<InsertPhysicalStockCount>, userId?: string): Promise<PhysicalStockCount | null> {
    const oldData = await this.getPhysicalStockCountById(id);
    if (!oldData) return null;

    const [updated] = await db
      .update(physicalStockCounts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(physicalStockCounts.id, id))
      .returning();

    await this.logAuditEvent(
      'physical_stock_count',
      id,
      'updated',
      userId,
      oldData,
      updated
    );

    return updated;
  }

  async deletePhysicalStockCount(id: string, userId?: string): Promise<boolean> {
    const oldData = await this.getPhysicalStockCountById(id);
    if (!oldData) return false;

    await db.delete(physicalStockCounts).where(eq(physicalStockCounts.id, id));

    await this.logAuditEvent(
      'physical_stock_count',
      id,
      'deleted',
      userId,
      oldData,
      null
    );

    return true;
  }

  // === PHYSICAL STOCK COUNT ITEMS ===

  async createPhysicalStockCountItem(data: InsertPhysicalStockCountItem): Promise<PhysicalStockCountItem> {
    const [countItem] = await db.insert(physicalStockCountItems).values(data).returning();
    return countItem;
  }

  async getPhysicalStockCountItems(physicalStockCountId: string) {
    return await db
      .select({
        id: physicalStockCountItems.id,
        physicalStockCountId: physicalStockCountItems.physicalStockCountId,
        inventoryItemId: physicalStockCountItems.inventoryItemId,
        lineNumber: physicalStockCountItems.lineNumber,
        supplierCode: physicalStockCountItems.supplierCode,
        barcode: physicalStockCountItems.barcode,
        description: physicalStockCountItems.description,
        storageLocation: physicalStockCountItems.storageLocation,
        systemQuantity: physicalStockCountItems.systemQuantity,
        reservedQuantity: physicalStockCountItems.reservedQuantity,
        availableQuantity: physicalStockCountItems.availableQuantity,
        firstCountQuantity: physicalStockCountItems.firstCountQuantity,
        firstCountBy: physicalStockCountItems.firstCountBy,
        firstCountAt: physicalStockCountItems.firstCountAt,
        secondCountQuantity: physicalStockCountItems.secondCountQuantity,
        secondCountBy: physicalStockCountItems.secondCountBy,
        secondCountAt: physicalStockCountItems.secondCountAt,
        finalCountQuantity: physicalStockCountItems.finalCountQuantity,
        variance: physicalStockCountItems.variance,
        varianceValue: physicalStockCountItems.varianceValue,
        status: physicalStockCountItems.status,
        requiresRecount: physicalStockCountItems.requiresRecount,
        discrepancyReason: physicalStockCountItems.discrepancyReason,
        adjustmentRequired: physicalStockCountItems.adjustmentRequired,
        adjustmentApplied: physicalStockCountItems.adjustmentApplied,
        adjustmentAppliedBy: physicalStockCountItems.adjustmentAppliedBy,
        adjustmentAppliedAt: physicalStockCountItems.adjustmentAppliedAt,
        notes: physicalStockCountItems.notes,
        createdAt: physicalStockCountItems.createdAt,
        updatedAt: physicalStockCountItems.updatedAt,
        // Inventory item details
        inventoryItem: {
          id: inventoryItems.id,
          supplierCode: inventoryItems.supplierCode,
          description: inventoryItems.description,
          category: inventoryItems.category,
          unitOfMeasure: inventoryItems.unitOfMeasure,
          barcode: inventoryItems.barcode,
        },
        // Current stock level
        currentStock: {
          quantityAvailable: inventoryLevels.quantityAvailable,
          quantityReserved: inventoryLevels.quantityReserved,
          storageLocation: inventoryLevels.storageLocation,
        }
      })
      .from(physicalStockCountItems)
      .leftJoin(inventoryItems, eq(physicalStockCountItems.inventoryItemId, inventoryItems.id))
      .leftJoin(inventoryLevels, eq(physicalStockCountItems.inventoryItemId, inventoryLevels.inventoryItemId))
      .where(eq(physicalStockCountItems.physicalStockCountId, physicalStockCountId))
      .orderBy(asc(physicalStockCountItems.lineNumber));
  }

  async updatePhysicalStockCountItem(id: string, data: Partial<InsertPhysicalStockCountItem>): Promise<PhysicalStockCountItem | null> {
    const [updated] = await db
      .update(physicalStockCountItems)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(physicalStockCountItems.id, id))
      .returning();

    return updated || null;
  }

  async populatePhysicalStockCountItems(physicalStockCountId: string, storageLocation?: string): Promise<number> {
    // Get all inventory items with their current stock levels
    // Build where clause
    const whereClauses = [eq(inventoryItems.isActive, true)];
    if (storageLocation) {
      whereClauses.push(eq(inventoryLevels.storageLocation, storageLocation));
    }

    const inventoryData = await db
      .select({
        inventoryItemId: inventoryItems.id,
        supplierCode: inventoryItems.supplierCode,
        barcode: inventoryItems.barcode,
        description: inventoryItems.description,
        storageLocation: inventoryLevels.storageLocation,
        quantityAvailable: inventoryLevels.quantityAvailable,
        quantityReserved: inventoryLevels.quantityReserved,
      })
      .from(inventoryItems)
      .leftJoin(inventoryLevels, eq(inventoryItems.id, inventoryLevels.inventoryItemId))
      .where(and(...whereClauses));

    let lineNumber = 1;
    const itemsToInsert = inventoryData.map(item => ({
      physicalStockCountId,
      inventoryItemId: item.inventoryItemId,
      lineNumber: lineNumber++,
      supplierCode: item.supplierCode,
      barcode: item.barcode || '',
      description: item.description,
      storageLocation: item.storageLocation || storageLocation || '',
      systemQuantity: item.quantityAvailable || 0,
      reservedQuantity: item.quantityReserved || 0,
      availableQuantity: (item.quantityAvailable || 0) - (item.quantityReserved || 0),
      variance: 0,
      varianceValue: '0',
      status: 'Pending' as const,
    }));

    if (itemsToInsert.length > 0) {
      await db.insert(physicalStockCountItems).values(itemsToInsert);
      
      // Update the total items expected in the count
      await db
        .update(physicalStockCounts)
        .set({ 
          totalItemsExpected: itemsToInsert.length,
          updatedAt: new Date()
        })
        .where(eq(physicalStockCounts.id, physicalStockCountId));
    }

    return itemsToInsert.length;
  }

  // === SCANNING SESSIONS ===

  async createScanningSession(data: InsertPhysicalStockScanningSession): Promise<PhysicalStockScanningSession> {
    const [session] = await db.insert(physicalStockScanningSessions).values(data).returning();
    return session;
  }

  async getScanningSessionsByCountId(physicalStockCountId: string) {
    return await db
      .select()
      .from(physicalStockScanningSessions)
      .where(eq(physicalStockScanningSessions.physicalStockCountId, physicalStockCountId))
      .orderBy(desc(physicalStockScanningSessions.createdAt));
  }

  async updateScanningSession(id: string, data: Partial<InsertPhysicalStockScanningSession>): Promise<PhysicalStockScanningSession | null> {
    const [updated] = await db
      .update(physicalStockScanningSessions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(physicalStockScanningSessions.id, id))
      .returning();

    return updated || null;
  }

  // === SCANNED ITEMS ===

  async createScannedItem(data: InsertPhysicalStockScannedItem): Promise<PhysicalStockScannedItem> {
    const [scannedItem] = await db.insert(physicalStockScannedItems).values(data).returning();
    
    // Update the scanning session's total scans completed
    await db
      .update(physicalStockScanningSessions)
      .set({ 
        totalScansCompleted: sql`${physicalStockScanningSessions.totalScansCompleted} + 1`,
        updatedAt: new Date()
      })
      .where(eq(physicalStockScanningSessions.id, data.scanningSessionId));

    return scannedItem;
  }

  async getScannedItemsBySession(scanningSessionId: string) {
    return await db
      .select({
        id: physicalStockScannedItems.id,
        scanningSessionId: physicalStockScannedItems.scanningSessionId,
        physicalStockCountItemId: physicalStockScannedItems.physicalStockCountItemId,
        inventoryItemId: physicalStockScannedItems.inventoryItemId,
        barcode: physicalStockScannedItems.barcode,
        supplierCode: physicalStockScannedItems.supplierCode,
        quantityScanned: physicalStockScannedItems.quantityScanned,
        storageLocation: physicalStockScannedItems.storageLocation,
        scannedBy: physicalStockScannedItems.scannedBy,
        scannedAt: physicalStockScannedItems.scannedAt,
        verified: physicalStockScannedItems.verified,
        verifiedBy: physicalStockScannedItems.verifiedBy,
        verifiedAt: physicalStockScannedItems.verifiedAt,
        notes: physicalStockScannedItems.notes,
        createdAt: physicalStockScannedItems.createdAt,
        // Inventory item details
        inventoryItem: {
          id: inventoryItems.id,
          description: inventoryItems.description,
          supplierCode: inventoryItems.supplierCode,
        }
      })
      .from(physicalStockScannedItems)
      .leftJoin(inventoryItems, eq(physicalStockScannedItems.inventoryItemId, inventoryItems.id))
      .where(eq(physicalStockScannedItems.scanningSessionId, scanningSessionId))
      .orderBy(desc(physicalStockScannedItems.scannedAt));
  }

  async processBarcodeScan(
    scanningSessionId: string,
    barcode: string,
    scannedBy: string,
    quantity: number = 1,
    storageLocation?: string
  ): Promise<{ success: boolean; message: string; scannedItem?: PhysicalStockScannedItem }> {
    // Find inventory item by barcode
    const [inventoryItem] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.barcode, barcode))
      .limit(1);

    if (!inventoryItem) {
      return { success: false, message: 'Item not found with this barcode' };
    }

    // Find the corresponding physical stock count item
    const [countItem] = await db
      .select()
      .from(physicalStockCountItems)
      .leftJoin(physicalStockScanningSessions, eq(physicalStockCountItems.physicalStockCountId, physicalStockScanningSessions.physicalStockCountId))
      .where(
        and(
          eq(physicalStockScanningSessions.id, scanningSessionId),
          eq(physicalStockCountItems.inventoryItemId, inventoryItem.id)
        )
      )
      .limit(1);

    if (!countItem) {
      return { success: false, message: 'Item not included in this physical stock count' };
    }

    // Create scanned item record
    const scannedItem = await this.createScannedItem({
      scanningSessionId,
      physicalStockCountItemId: countItem.physical_stock_count_items.id,
      inventoryItemId: inventoryItem.id,
      barcode,
      supplierCode: inventoryItem.supplierCode,
      quantityScanned: quantity,
      storageLocation: storageLocation || '',
      scannedBy,
    });

    return { success: true, message: 'Item scanned successfully', scannedItem };
  }

  // === PHYSICAL STOCK ADJUSTMENTS ===

  async createPhysicalStockAdjustment(
    data: Omit<InsertPhysicalStockAdjustment, 'adjustmentNumber'>
  ): Promise<PhysicalStockAdjustment> {
    const adjustmentNumber = this.generateNumber('PSA');
    
    const [adjustment] = await db.insert(physicalStockAdjustments).values({
      ...data,
      adjustmentNumber,
    }).returning();

    return adjustment;
  }

  async generateAdjustmentsFromCount(physicalStockCountId: string, createdBy?: string): Promise<PhysicalStockAdjustment | null> {
    // Get all count items with discrepancies
    const discrepancyItems = await db
      .select()
      .from(physicalStockCountItems)
      .where(
        and(
          eq(physicalStockCountItems.physicalStockCountId, physicalStockCountId),
          eq(physicalStockCountItems.adjustmentRequired, true),
          eq(physicalStockCountItems.adjustmentApplied, false)
        )
      );

    if (discrepancyItems.length === 0) {
      return null; // No adjustments needed
    }

    // Calculate total adjustment value
    const totalAdjustmentValue = discrepancyItems.reduce((sum, item) => {
      return sum + parseFloat(item.varianceValue || '0');
    }, 0);

    // Create adjustment header
    const adjustment = await this.createPhysicalStockAdjustment({
      physicalStockCountId,
      totalAdjustmentValue: totalAdjustmentValue.toString(),
      reason: 'Physical stock count variance adjustment',
      createdBy,
    });

    // Create adjustment items
    const adjustmentItems = discrepancyItems.map(item => ({
      adjustmentId: adjustment.id,
      physicalStockCountItemId: item.id,
      inventoryItemId: item.inventoryItemId,
      supplierCode: item.supplierCode,
      description: item.description,
      storageLocation: item.storageLocation || '',
      systemQuantity: item.systemQuantity || 0,
      physicalQuantity: item.finalCountQuantity || 0,
      adjustmentQuantity: item.variance || 0,
      adjustmentValue: item.varianceValue || '0',
      reason: item.discrepancyReason,
    }));

    if (adjustmentItems.length > 0) {
      await db.insert(physicalStockAdjustmentItems).values(adjustmentItems);
    }

    return adjustment;
  }

  async applyPhysicalStockAdjustment(adjustmentId: string, appliedBy: string): Promise<boolean> {
    // Get adjustment and its items
    const [adjustment] = await db
      .select()
      .from(physicalStockAdjustments)
      .where(eq(physicalStockAdjustments.id, adjustmentId))
      .limit(1);

    if (!adjustment || adjustment.status !== 'Draft') {
      return false;
    }

    const adjustmentItems = await db
      .select()
      .from(physicalStockAdjustmentItems)
      .where(eq(physicalStockAdjustmentItems.adjustmentId, adjustmentId));

    // Apply inventory adjustments and create stock movements
    for (const item of adjustmentItems) {
      // Update inventory levels
      await db
        .update(inventoryLevels)
        .set({
          quantityAvailable: sql`${inventoryLevels.quantityAvailable} + ${item.adjustmentQuantity}`,
          lastUpdated: new Date(),
        })
        .where(eq(inventoryLevels.inventoryItemId, item.inventoryItemId));

      // Create stock movement record
      await db.insert(stockMovements).values({
        id: nanoid(),
        itemId: item.inventoryItemId,
        movementType: item.adjustmentQuantity > 0 ? 'Adjustment In' : 'Adjustment Out',
        referenceType: 'PhysicalStockAdjustment',
        referenceId: adjustmentId,
        storageLocation: item.storageLocation,
        quantityBefore: item.systemQuantity,
        quantityMoved: Math.abs(item.adjustmentQuantity),
        quantityAfter: item.systemQuantity + item.adjustmentQuantity,
        unitCost: item.unitCost,
        totalValue: item.adjustmentValue,
        notes: `Physical stock count adjustment: ${item.reason}`,
        createdBy: appliedBy,
      });

      // Update the count item as adjusted
      await db
        .update(physicalStockCountItems)
        .set({
          adjustmentApplied: true,
          adjustmentAppliedBy: appliedBy,
          adjustmentAppliedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(physicalStockCountItems.id, item.physicalStockCountItemId));
    }

    // Update adjustment status
    await db
      .update(physicalStockAdjustments)
      .set({
        status: 'Applied',
        appliedBy,
        appliedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(physicalStockAdjustments.id, adjustmentId));

    return true;
  }

  // === SUMMARY FUNCTIONS ===

  async getPhysicalStockCountSummary(physicalStockCountId: string) {
    const countSummary = await db
      .select({
        totalItems: sql<number>`count(*)`,
        pendingItems: sql<number>`count(*) filter (where ${physicalStockCountItems.status} = 'Pending')`,
        countedItems: sql<number>`count(*) filter (where ${physicalStockCountItems.status} = 'Counted')`,
        verifiedItems: sql<number>`count(*) filter (where ${physicalStockCountItems.status} = 'Verified')`,
        discrepancyItems: sql<number>`count(*) filter (where ${physicalStockCountItems.status} = 'Discrepancy')`,
        adjustedItems: sql<number>`count(*) filter (where ${physicalStockCountItems.adjustmentApplied} = true)`,
        totalVarianceValue: sql<string>`coalesce(sum(${physicalStockCountItems.varianceValue}), 0)`,
      })
      .from(physicalStockCountItems)
      .where(eq(physicalStockCountItems.physicalStockCountId, physicalStockCountId));

    return countSummary[0] || {
      totalItems: 0,
      pendingItems: 0,
      countedItems: 0,
      verifiedItems: 0,
      discrepancyItems: 0,
      adjustedItems: 0,
      totalVarianceValue: '0',
    };
  }

  async finalizePhysicalStockCount(physicalStockCountId: string, completedBy: string): Promise<boolean> {
    // Calculate final counts and variances for all items
    const countItems = await db
      .select()
      .from(physicalStockCountItems)
      .where(eq(physicalStockCountItems.physicalStockCountId, physicalStockCountId));

    for (const item of countItems) {
      const finalCount = item.secondCountQuantity || item.firstCountQuantity || 0;
      const variance = finalCount - (item.systemQuantity || 0);
      const requiresAdjustment = Math.abs(variance) > 0;

      await db
        .update(physicalStockCountItems)
        .set({
          finalCountQuantity: finalCount,
          variance,
          status: Math.abs(variance) > 0 ? 'Discrepancy' : 'Verified',
          adjustmentRequired: requiresAdjustment,
          updatedAt: new Date(),
        })
        .where(eq(physicalStockCountItems.id, item.id));
    }

    // Update the physical stock count status
    const summary = await this.getPhysicalStockCountSummary(physicalStockCountId);
    
    await db
      .update(physicalStockCounts)
      .set({
        status: 'Completed',
        completedBy,
        completedAt: new Date(),
        totalItemsCounted: summary.totalItems,
        totalDiscrepancies: summary.discrepancyItems,
        updatedAt: new Date(),
      })
      .where(eq(physicalStockCounts.id, physicalStockCountId));

    return true;
  }
}