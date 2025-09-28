import { inventoryItems, suppliers, stockMovements, type InventoryItem, type Supplier, type InsertInventoryItem, type InventoryVariant, type InsertInventoryVariant, type InventoryLevel, type InsertInventoryLevel, type StockMovement, type InsertStockMovement } from "@shared/schema";
import { db } from "../db.js";
import { eq, desc, and, or, like, gte, lte } from "drizzle-orm";
import { BaseStorage } from './base.js';
import { IInventoryStorage } from './interfaces.js';
import { nanoid } from 'nanoid';

export interface InventoryItemWithSupplier extends InventoryItem {
  supplier?: Supplier;
  supplierName?: string;
  reservedQuantity?: number | null;
  availableQuantity?: number | null;
  totalStock?: number | null;
  storageLocation: string | null;
}

export class InventoryStorage extends BaseStorage implements IInventoryStorage {
  db: any;
  constructor() {
    super();
    this.db = db;
  }
  async getInventoryItems(filters?: {
    search?: string;
    supplierId?: string;
    category?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<InventoryItemWithSupplier[]> {
    const conditions = [];
    if (filters?.search) {
      conditions.push(
        or(
          like(inventoryItems.supplierCode, `%${filters.search}%`),
          like(inventoryItems.description, `%${filters.search}%`),
          like(inventoryItems.barcode, `%${filters.search}%`),
          like(suppliers.name, `%${filters.search}%`)
        )
      );
    }
    if (filters?.supplierId) {
      conditions.push(eq(inventoryItems.supplierId, filters.supplierId));
    }
    if (filters?.category) {
      conditions.push(eq(inventoryItems.category, filters.category));
    }
    if (filters?.isActive !== undefined) {
      conditions.push(eq(inventoryItems.isActive, filters.isActive));
    }

    let query = db
      .select({
        id: inventoryItems.id,
        supplierCode: inventoryItems.supplierCode,
        barcode: inventoryItems.barcode,
        description: inventoryItems.description,
        category: inventoryItems.category,
        unitOfMeasure: inventoryItems.unitOfMeasure,
        weight: inventoryItems.weight,
        dimensions: inventoryItems.dimensions,
        isActive: inventoryItems.isActive,
        supplierId: inventoryItems.supplierId,
        createdAt: inventoryItems.createdAt,
        updatedAt: inventoryItems.updatedAt,
        supplierName: suppliers.name,
        supplier: suppliers
      })
      .from(inventoryItems)
      .leftJoin(suppliers, eq(inventoryItems.supplierId, suppliers.id));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    query = query.orderBy(inventoryItems.description);

    const results = await query;
    // Transform results to include supplier information and required fields
    return results.map(row => ({
      ...row,
      supplierName: typeof row.supplierName === 'string' ? row.supplierName : undefined,
      supplier: row.supplier && typeof row.supplier.id === 'string' ? row.supplier : undefined,
      reservedQuantity: 0,
      availableQuantity: 0,
      totalStock: 0,
      storageLocation: null,
      weight: row.weight,
      dimensions: row.dimensions
    }));
  }

  async getInventoryItem(id: string): Promise<InventoryItemWithSupplier | undefined> {
    const [result] = await db
      .select({
        id: inventoryItems.id,
        supplierCode: inventoryItems.supplierCode,
        barcode: inventoryItems.barcode,
        description: inventoryItems.description,
        category: inventoryItems.category,
        unitOfMeasure: inventoryItems.unitOfMeasure,
  // Removed invalid columns: unitCost, stockQuantity, reorderThreshold
        weight: inventoryItems.weight,
        dimensions: inventoryItems.dimensions,
        isActive: inventoryItems.isActive,
        supplierId: inventoryItems.supplierId,
        createdAt: inventoryItems.createdAt,
        updatedAt: inventoryItems.updatedAt,
        supplierName: suppliers.name,
        supplier: suppliers
      })
      .from(inventoryItems)
      .leftJoin(suppliers, eq(inventoryItems.supplierId, suppliers.id))
      .where(eq(inventoryItems.id, id));
    if (!result) return undefined;
    return {
      ...result,
      supplierName: typeof result.supplierName === 'string' ? result.supplierName : undefined,
      supplier: result.supplier && typeof result.supplier.id === 'string' ? result.supplier : undefined,
      reservedQuantity: 0,
      availableQuantity: 0,
      totalStock: 0,
      storageLocation: null
    };
  }

  async getInventoryItemBySupplierCode(supplierCode: string): Promise<InventoryItemWithSupplier | undefined> {
    const [result] = await db
      .select({
        id: inventoryItems.id,
        supplierCode: inventoryItems.supplierCode,
        barcode: inventoryItems.barcode,
        description: inventoryItems.description,
        category: inventoryItems.category,
        unitOfMeasure: inventoryItems.unitOfMeasure,
  // Removed invalid columns: unitCost, stockQuantity, reorderThreshold
        weight: inventoryItems.weight,
        dimensions: inventoryItems.dimensions,
        isActive: inventoryItems.isActive,
        supplierId: inventoryItems.supplierId,
        createdAt: inventoryItems.createdAt,
        updatedAt: inventoryItems.updatedAt,
        supplierName: suppliers.name,
        supplier: suppliers
      })
      .from(inventoryItems)
      .leftJoin(suppliers, eq(inventoryItems.supplierId, suppliers.id))
      .where(eq(inventoryItems.supplierCode, supplierCode));
    if (!result) return undefined;
    return {
      ...result,
      supplierName: typeof result.supplierName === 'string' ? result.supplierName : undefined,
      supplier: result.supplier && typeof result.supplier.id === 'string' ? result.supplier : undefined,
      reservedQuantity: 0,
      availableQuantity: 0,
      totalStock: 0,
      storageLocation: null
    };
  }

  async getInventoryItemByBarcode(barcode: string): Promise<InventoryItemWithSupplier | undefined> {
    const [result] = await db
      .select({
        id: inventoryItems.id,
        supplierCode: inventoryItems.supplierCode,
        barcode: inventoryItems.barcode,
        description: inventoryItems.description,
        category: inventoryItems.category,
        unitOfMeasure: inventoryItems.unitOfMeasure,
  // Removed invalid columns: unitCost, stockQuantity, reorderLevel
        weight: inventoryItems.weight,
        dimensions: inventoryItems.dimensions,
        isActive: inventoryItems.isActive,
        supplierId: inventoryItems.supplierId,
        createdAt: inventoryItems.createdAt,
        updatedAt: inventoryItems.updatedAt,
        supplierName: suppliers.name,
        supplier: suppliers
      })
      .from(inventoryItems)
      .leftJoin(suppliers, eq(inventoryItems.supplierId, suppliers.id))
      .where(eq(inventoryItems.barcode, barcode));
    if (!result) return undefined;
    return {
      ...result,
      supplierName: typeof result.supplierName === 'string' ? result.supplierName : undefined,
      supplier: result.supplier && typeof result.supplier.id === 'string' ? result.supplier : undefined,
      reservedQuantity: 0,
      availableQuantity: 0,
      totalStock: 0,
      storageLocation: null
    };
  }

  async createInventoryItem(itemData: InsertInventoryItem): Promise<InventoryItem> {
  const [item] = await db.insert(inventoryItems).values(itemData).returning();
  await this.logAuditEvent("inventory_item", item.id, "created", undefined, undefined, item);
  return item;
  }

  async updateInventoryItem(id: string, itemData: Partial<InsertInventoryItem>): Promise<InventoryItem> {
    const oldItem = await this.getInventoryItem(id);
    const [item] = await db
      .update(inventoryItems)
      .set({ ...itemData, updatedAt: new Date() })
      .where(eq(inventoryItems.id, id))
      .returning();
    
  await this.logAuditEvent("inventory_item", item.id, "updated", undefined, oldItem, item);
    return item;
  }

  async deleteInventoryItem(id: string): Promise<void> {
    const oldItem = await this.getInventoryItem(id);
    await db.delete(inventoryItems).where(eq(inventoryItems.id, id));
  await this.logAuditEvent("inventory_item", id, "deleted", undefined, oldItem, undefined);
  }

  async bulkCreateInventoryItems(items: InsertInventoryItem[]): Promise<InventoryItem[]> {
    const createdItems = await db.insert(inventoryItems).values(items).returning();
    for (const item of createdItems) {
      await this.logAuditEvent("inventory_item", item.id, "created", undefined, undefined, item);
    }
    return createdItems;
  }

  // Stub implementations for the remaining interface methods
  async getItemVariants(itemId: string): Promise<InventoryVariant[]> {
    // TODO: Implement when needed
    return [];
  }

  async getItemVariant(id: string): Promise<InventoryVariant | undefined> {
    // TODO: Implement when needed
    return undefined;
  }

  async createItemVariant(variant: InsertInventoryVariant): Promise<InventoryVariant> {
    // TODO: Implement when needed
    throw new Error("Method not implemented");
  }

  async updateItemVariant(id: string, variant: Partial<InsertInventoryVariant>): Promise<InventoryVariant> {
    // TODO: Implement when needed
    throw new Error("Method not implemented");
  }

  async deleteItemVariant(id: string): Promise<void> {
    // TODO: Implement when needed
  }

  async getInventoryLevels(filters?: any): Promise<any[]> {
    try {
      // For now, return a basic implementation that shows current stock levels
      // This would typically query a dedicated inventory_levels table
      // Since we don't have that table yet, we'll calculate from stock movements
      
      const { itemId, location, lowStock } = filters || {};
      
      // Get all inventory items
      const items = await this.getInventoryItems({ limit: 1000 });
      
      // Calculate current stock levels from stock movements
      const stockLevels = [];
      
      for (const item of items) {
        if (itemId && item.id !== itemId) continue;
        
        // Get stock movements for this item
        const movements = await this.getStockMovements({ 
          itemId: item.id, 
          limit: 1000 
        });
        
        // Calculate current quantity
        let currentQuantity = 0;
        for (const movement of movements) {
          if (movement.movementType === 'Receipt' || movement.movementType === 'Adjustment') {
            currentQuantity += movement.quantityMoved || 0;
          } else if (movement.movementType === 'Issue' || movement.movementType === 'Transfer') {
            currentQuantity -= movement.quantityMoved || 0;
          }
        }
        
        // Apply location filter if specified
        if (location && location !== 'MAIN') {
          // For now, assume all stock is in MAIN location
          continue;
        }
        
        // Apply low stock filter if specified
        if (lowStock && currentQuantity > 10) {
          continue;
        }
        
        stockLevels.push({
          id: `level-${item.id}`,
          itemId: item.id,
          itemName: item.description,
          itemCode: item.supplierCode,
          barcode: item.barcode,
          currentQuantity,
          location: location || 'MAIN',
          reorderLevel: 10, // Default reorder level
          isLowStock: currentQuantity <= 10,
          lastUpdated: new Date().toISOString(),
          supplierName: item.supplierName
        });
      }
      
      return stockLevels;
    } catch (error) {
      console.error('Error fetching inventory levels:', error);
      return [];
    }
  }

  async getInventoryLevel(id: string): Promise<any> {
    // TODO: Implement when needed
    return undefined;
  }

  async getInventoryLevelByItem(itemId: string, location?: string): Promise<any> {
    // TODO: Implement when needed
    return undefined;
  }

  async createInventoryLevel(inventory: any): Promise<any> {
    // TODO: Implement when needed
    throw new Error("Method not implemented");
  }

  async updateInventoryLevel(id: string, inventory: any): Promise<any> {
    // TODO: Implement when needed
    throw new Error("Method not implemented");
  }

  async deleteInventoryLevel(id: string): Promise<void> {
    // TODO: Implement when needed
  }

  async adjustInventoryQuantity(itemId: string, quantityChange: number, location?: string, reason?: string): Promise<any> {
    // TODO: Implement when needed
    throw new Error("Method not implemented");
  }

  async getStockMovements(filters?: {
    itemId?: string;
    movementType?: string;
    referenceType?: string;
    referenceId?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    try {
      let query = this.db
        .select({
          id: stockMovements.id,
          itemId: stockMovements.itemId,
          variantId: stockMovements.variantId,
          movementType: stockMovements.movementType,
          referenceType: stockMovements.referenceType,
          referenceId: stockMovements.referenceId,
          storageLocation: stockMovements.storageLocation,
          fromLocation: stockMovements.fromLocation,
          toLocation: stockMovements.toLocation,
          quantityBefore: stockMovements.quantityBefore,
          quantityMoved: stockMovements.quantityMoved,
          quantityAfter: stockMovements.quantityAfter,
          unitCost: stockMovements.unitCost,
          totalValue: stockMovements.totalValue,
          status: stockMovements.status,
          notes: stockMovements.notes,
          createdBy: stockMovements.createdBy,
          createdAt: stockMovements.createdAt,
          // Join with inventory items to get item details
          itemName: inventoryItems.description,
          description: inventoryItems.description,
          barcode: inventoryItems.barcode,

        })
        .from(stockMovements)
        .leftJoin(inventoryItems, eq(stockMovements.itemId, inventoryItems.id))
        .orderBy(desc(stockMovements.createdAt));

      // Apply filters
      if (filters?.itemId) {
        query = query.where(eq(stockMovements.itemId, filters.itemId));
      }
      if (filters?.movementType) {
        query = query.where(eq(stockMovements.movementType, filters.movementType));
      }
      if (filters?.referenceType) {
        query = query.where(eq(stockMovements.referenceType, filters.referenceType));
      }
      if (filters?.referenceId) {
        query = query.where(eq(stockMovements.referenceId, filters.referenceId));
      }
      if (filters?.location) {
        query = query.where(eq(stockMovements.storageLocation, filters.location));
      }
      if (filters?.dateFrom) {
        query = query.where(gte(stockMovements.createdAt, new Date(filters.dateFrom)));
      }
      if (filters?.dateTo) {
        query = query.where(lte(stockMovements.createdAt, new Date(filters.dateTo)));
      }

      // Apply pagination
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.offset(filters.offset);
      }

      const movements = await query;
      
      // Format the data for better frontend consumption
      return movements.map((movement: any) => ({
        ...movement,
        referenceNumber: movement.referenceId || `SM-${movement.id.slice(-8).toUpperCase()}`,
        transferDate: movement.createdAt,
        requestedBy: movement.createdBy,
        reason: movement.notes || 'Stock Transfer',
        status: movement.status ?? this.mapMovementTypeToTransferStatus(movement.movementType),
        quantity: movement.quantityMoved,
        fromLocation: movement.fromLocation || (movement.movementType === 'Transfer' ? (movement.storageLocation || 'Unknown') : 'N/A'),
        toLocation: movement.toLocation || (movement.movementType === 'Transfer' ? 'Target Location' : movement.storageLocation),
      }));
    } catch (error) {
      console.error('Error fetching stock movements:', error);
      throw error;
    }
  }

  async getStockMovement(id: string): Promise<any> {
    try {
      const movement = await this.db
        .select({
          id: stockMovements.id,
          itemId: stockMovements.itemId,
          variantId: stockMovements.variantId,
          movementType: stockMovements.movementType,
          referenceType: stockMovements.referenceType,
          referenceId: stockMovements.referenceId,
          storageLocation: stockMovements.storageLocation,
          quantityBefore: stockMovements.quantityBefore,
          quantityMoved: stockMovements.quantityMoved,
          quantityAfter: stockMovements.quantityAfter,
          unitCost: stockMovements.unitCost,
          totalValue: stockMovements.totalValue,
          status: stockMovements.status,
          notes: stockMovements.notes,
          createdBy: stockMovements.createdBy,
          createdAt: stockMovements.createdAt,
          // Join with inventory items to get item details
          itemName: inventoryItems.description,
          itemCode: inventoryItems.barcode,
          description: inventoryItems.description,
        })
        .from(stockMovements)
        .leftJoin(inventoryItems, eq(stockMovements.itemId, inventoryItems.id))
        .where(eq(stockMovements.id, id))
        .limit(1);

      return movement[0] || null;
    } catch (error) {
      console.error('Error fetching stock movement:', error);
      throw error;
    }
  }

  async createStockMovement(movement: {
    movementType: string;
    quantityBefore: number;
    quantityMoved: number;
    quantityAfter: number;
    itemId?: string;
    variantId?: string;
    storageLocation?: string;
    notes?: string;
    referenceType?: string;
    referenceId?: string;
    unitCost?: string;
    totalValue?: string;
    createdBy?: string;
    transferNumber?: string;
    fromLocation?: string;
    toLocation?: string;
    transferDate?: string;
    requestedBy?: string;
    reason?: string;
    status?: string;
  }): Promise<any> {
    try {
      const movementId = nanoid();
      
      // Handle transfer-specific data mapping
      const mappedMovement = {
  id: movementId,
  itemId: movement.itemId || null,
  variantId: movement.variantId || null,
  movementType: movement.movementType || 'Transfer',
  referenceType: movement.referenceType || 'Transfer',
  referenceId: movement.referenceId || movement.transferNumber || `TRF-${movementId.slice(-8)}`,
  storageLocation: movement.storageLocation || movement.fromLocation || 'Unknown',
  fromLocation: movement.fromLocation || movement.storageLocation || null,
  toLocation: movement.toLocation || null,
  quantityBefore: movement.quantityBefore || 0,
  quantityMoved: movement.quantityMoved,
  quantityAfter: movement.quantityAfter || (movement.quantityBefore || 0) + movement.quantityMoved,
  unitCost: movement.unitCost,
  totalValue: movement.totalValue,
  notes: movement.notes || movement.reason || 'Stock transfer',
  createdBy: movement.createdBy || movement.requestedBy || 'system',
  status: movement.status || 'Draft',
  createdAt: movement.transferDate ? new Date(movement.transferDate) : new Date(),
      };

      const result = await this.db
        .insert(stockMovements)
        .values(mappedMovement)
        .returning();

      return result[0];
    } catch (error) {
      const err = error as any;
      console.error('Error creating stock movement:', err?.stack || err);
      throw err;
    }
  }

  private mapMovementTypeToTransferStatus(movementType: string): string {
    switch (movementType) {
      case 'Transfer':
        return 'In Transit';
      case 'Receipt':
        return 'Completed';
      case 'Issue':
        return 'Completed';
      case 'Adjustment':
        return 'Completed';
      default:
        return 'Draft';
    }
  }

  async getItemStockHistory(itemId: string, limit?: number): Promise<any[]> {
    try {
      let query = this.db
        .select()
        .from(stockMovements)
        .where(eq(stockMovements.itemId, itemId))
        .orderBy(desc(stockMovements.createdAt));

      if (limit) {
        query = query.limit(limit);
      }

      return await query;
    } catch (error) {
      console.error('Error fetching item stock history:', error);
      throw error;
    }
  }
}