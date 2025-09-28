import { BaseStorage } from './base.js';
import { IDeliveryStorage } from './interfaces.js';
import { db } from '../db';
import { 
  Delivery, 
  DeliveryItem, 
  DeliveryPickingSession, 
  DeliveryPickedItem,
  InsertDelivery,
  InsertDeliveryItem,
  InsertDeliveryPickingSession,
  InsertDeliveryPickedItem,
  deliveries,
  deliveryItems,
  deliveryPickingSessions,
  deliveryPickedItems,
  salesOrders,
  salesOrderItems,
  customers,
  items
} from '@shared/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export interface DeliveryWithDetails extends Delivery {
  customer?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    isActive: boolean | null;
    customerType: string | null;
    vatNumber: string | null;
    trnNumber: string | null;
    companyName: string | null;
    paymentTerms: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  } | null;
  salesOrder?: {
    id: string;
    orderNumber: string;
    status: string | null;
    totalAmount: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  } | null;
}

export class DeliveryStorage extends BaseStorage implements IDeliveryStorage {
  // Normalize a delivery item record so non-nullable string fields never contain null
  private normalizeDeliveryItemRecord<T extends Partial<DeliveryItem>>(rec: T): T & Pick<DeliveryItem, 'barcode' | 'supplierCode' | 'description' | 'unitPrice' | 'totalPrice'> {
    return {
      ...rec,
      barcode: (rec as any).barcode ?? '',
      supplierCode: (rec as any).supplierCode ?? '',
      description: (rec as any).description ?? '',
      unitPrice: (rec as any).unitPrice ?? '0.00',
      totalPrice: (rec as any).totalPrice ?? '0.00'
    };
  }
  // Delivery operations
  async getDeliveries(filters?: {
    status?: string;
    salesOrderId?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<DeliveryWithDetails[]> {
    try {
      // Build all filter conditions
      const conditions: any[] = [];
      if (filters?.status) {
        conditions.push(eq(deliveries.status, filters.status as any));
      }
      if (filters?.salesOrderId) {
        conditions.push(eq(deliveries.salesOrderId, filters.salesOrderId));
      }
      if (filters?.dateFrom) {
        conditions.push(sql`${deliveries.deliveryDate} >= ${filters.dateFrom}`);
      }
      if (filters?.dateTo) {
        conditions.push(sql`${deliveries.deliveryDate} <= ${filters.dateTo}`);
      }

      let query = db
        .select()
        .from(deliveries)
        .leftJoin(salesOrders, eq(deliveries.salesOrderId, salesOrders.id))
        .leftJoin(customers, eq(salesOrders.customerId, customers.id));

      // Apply search if provided (on deliveryNumber, trackingNumber, customer name)
      if (filters?.search) {
        const term = `%${filters.search.toLowerCase()}%`;
        conditions.push(sql`(lower(${deliveries.deliveryNumber}) like ${term} OR lower(${deliveries.trackingNumber}) like ${term})`);
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      query = query.orderBy(desc(deliveries.createdAt));

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.offset(filters.offset);
      }

      const results = await query;
      return results.map(row => {
        const rawCust: any = (row as any).customers;
        const customer = rawCust ? {
          id: rawCust.id,
          name: rawCust.name || rawCust.customerName || rawCust.companyName || rawCust.fullName || rawCust.customer_name || null,
          customerType: rawCust.customerType || rawCust.customer_type || null,
          address: rawCust.address || rawCust.billingAddress || rawCust.billing_address || null
        } : null;
        const so: any = (row as any).sales_orders;
        const delivery: any = (row as any).deliveries;
        return {
          ...delivery,
          salesOrder: so ? { ...so, customer } : null,
          customer,
          __customerEmbedded: true
        };
      });
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      throw new Error('Failed to fetch deliveries');
    }
  }

  async getDelivery(id: string): Promise<any | undefined> {
    try {
      const result = await db
        .select()
        .from(deliveries)
        .leftJoin(salesOrders, eq(deliveries.salesOrderId, salesOrders.id))
        .leftJoin(customers, eq(salesOrders.customerId, customers.id))
        .where(eq(deliveries.id, id))
        .limit(1);

      const first = result[0];
      if (!first) return undefined;
      const row: any = first;
      const rawCust: any = row.customers;
      const customer = rawCust ? {
        id: rawCust.id,
        name: rawCust.name || rawCust.customerName || rawCust.companyName || rawCust.fullName || rawCust.customer_name || null,
        customerType: rawCust.customerType || rawCust.customer_type || null,
        address: rawCust.address || rawCust.billingAddress || rawCust.billing_address || null
      } : null;
      const allowedStatuses = ['Pending', 'Cancelled', 'Partial', 'Complete'];
      const statusNorm = allowedStatuses.includes(row.delivery_note.status) ? row.delivery_note.status : 'Pending';
      return {
        ...row.delivery_note,
        status: statusNorm as Delivery['status'],
        salesOrder: row.sales_orders ? { ...row.sales_orders, customer } : null,
        customer,
        __customerEmbedded: true
      };
    } catch (error) {
      console.error('Error fetching delivery:', error);
      throw new Error('Failed to fetch delivery');
    }
  }

  async getDeliveryByNumber(deliveryNumber: string): Promise<Delivery | undefined> {
    try {
      const result = await db
        .select()
        .from(deliveries)
        .where(eq(deliveries.deliveryNumber, deliveryNumber))
        .limit(1);

      if (!result[0]) return undefined;
      // Normalize status to allowed union type
      const allowedStatuses = ['Pending', 'Cancelled', 'Partial', 'Complete'];
      const statusNorm = allowedStatuses.includes(result[0].status || '') ? result[0].status : 'Pending';
      return {
        ...result[0],
        status: statusNorm as Delivery['status']
      };
    } catch (error) {
      console.error('Error fetching delivery by number:', error);
      throw new Error('Failed to fetch delivery by number');
    }
  }

  async createDelivery(delivery: InsertDelivery): Promise<Delivery> {
    try {
      // Ensure a delivery number is always generated if not provided or if placeholder was supplied
      const incomingNumber = (delivery as any).deliveryNumber;
      if (!incomingNumber || incomingNumber === 'PENDING') {
        (delivery as any).deliveryNumber = this.generateNumber('DLV');
      }
      // Normalize status: some callers may attempt to send Draft/PENDING variants
      if ((delivery as any).status && (delivery as any).status.toUpperCase() === 'DRAFT') {
        (delivery as any).status = 'Pending';
      }
      // Fix status type: must be string, not null
      if (delivery.status == null) delivery.status = 'Pending';
      // Remove null values and only include fields defined in the schema
      const allowedFields = [
        'id', 'deliveryNumber', 'salesOrderId', 'deliveryDate', 'deliveryType', 'deliveryAddress',
        'status', 'pickingStartedBy', 'pickingStartedAt', 'pickingCompletedBy', 'pickingCompletedAt',
        'pickingNotes', 'deliveryConfirmedBy', 'deliveryConfirmedAt', 'deliverySignature',
        'createdAt', 'createdBy', 'updatedAt', 'updatedBy'
      ];
      const sanitized: any = {};
      for (const key of allowedFields) {
        if (delivery[key as keyof typeof delivery] !== undefined && delivery[key as keyof typeof delivery] !== null) {
          sanitized[key] = delivery[key as keyof typeof delivery];
        }
      }
      // Always set status as string
      sanitized.status = delivery.status as string;
      const result = await db
        .insert(deliveries)
        .values(sanitized)
        .returning();

      // Return the result as is, since Delivery type does not have barcode, supplierCode, or description
      // Ensure status is cast to the allowed union type
      return {
        ...result[0],
        status: (['Pending', 'Cancelled', 'Partial', 'Complete'].includes(result[0].status || '')
          ? result[0].status
          : 'Pending') as Delivery['status']
      };
    } catch (error) {
      console.error('Error creating delivery:', error);
      throw new Error('Failed to create delivery');
    }
  }

  async updateDelivery(id: string, delivery: Partial<InsertDelivery>): Promise<Delivery> {
    try {
      // Validate delivery ID format
      if (!id || typeof id !== 'string' || id.length === 0) {
        throw new Error('Invalid delivery ID');
      }

      // Prepare update data with proper type handling
      const updateData: any = {
        ...delivery,
        updatedAt: new Date()
      };

      // Ensure status is valid
      if (delivery.status) {
        const allowedStatuses = ['Pending', 'Cancelled', 'Partial', 'Complete'];
        if (!allowedStatuses.includes(delivery.status)) {
          throw new Error(`Invalid status: ${delivery.status}. Must be one of: ${allowedStatuses.join(', ')}`);
        }
        updateData.status = delivery.status;
      }

      // Filter out null/undefined values but keep empty strings and 0
      const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([key, value]) => value !== null && value !== undefined)
      );

      console.log('Updating delivery with data:', { id, filteredData });

      const result = await db
        .update(deliveries)
        .set(filteredData)
        .where(eq(deliveries.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error('Delivery not found');
      }

      console.log('Delivery updated successfully:', result[0]);

      return result[0] as Delivery;
    } catch (error) {
      console.error('Error updating delivery:', error);
      throw new Error(`Failed to update delivery: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteDelivery(id: string): Promise<void> {
    try {
      await db
        .delete(deliveries)
        .where(eq(deliveries.id, id));
    } catch (error) {
      console.error('Error deleting delivery:', error);
      throw new Error('Failed to delete delivery');
    }
  }

  async startDeliveryPicking(deliveryId: string, userId: string): Promise<Delivery> {
    try {
      const result = await db
        .update(deliveries)
        .set({
          pickingStartedBy: userId,
          pickingStartedAt: new Date(),
          status: 'Partial',
          updatedAt: new Date()
        })
        .where(eq(deliveries.id, deliveryId))
        .returning();

      if (result.length === 0) {
        throw new Error('Delivery not found');
      }

      return result[0];
    } catch (error) {
      console.error('Error starting delivery picking:', error);
      throw new Error('Failed to start delivery picking');
    }
  }

  async completeDeliveryPicking(deliveryId: string, userId: string, notes?: string): Promise<Delivery> {
    try {
      const result = await db
        .update(deliveries)
        .set({
          pickingCompletedBy: userId,
          pickingCompletedAt: new Date(),
          status: 'Complete',
          pickingNotes: notes,
          updatedAt: new Date()
        })
        .where(eq(deliveries.id, deliveryId))
        .returning();

      if (result.length === 0) {
        throw new Error('Delivery not found');
      }

      return result[0];
    } catch (error) {
      console.error('Error completing delivery picking:', error);
      throw new Error('Failed to complete delivery picking');
    }
  }

  async confirmDelivery(deliveryId: string, confirmedBy: string, signature?: string): Promise<Delivery> {
    try {
      const result = await db
        .update(deliveries)
        .set({
          deliveryConfirmedBy: confirmedBy,
          deliveryConfirmedAt: new Date(),
          deliverySignature: signature,
          status: 'Complete',
          updatedAt: new Date()
        })
        .where(eq(deliveries.id, deliveryId))
        .returning();

      if (result.length === 0) {
        throw new Error('Delivery not found');
      }

      return result[0];
    } catch (error) {
      console.error('Error confirming delivery:', error);
      throw new Error('Failed to confirm delivery');
    }
  }

  // Delivery Item operations
  async getDeliveryItems(deliveryId: string): Promise<DeliveryItem[]> {
    try {
      // Remove orderBy lineNumber (doesn't exist)
      const items = await db
        .select()
        .from(deliveryItems)
        .where(eq(deliveryItems.deliveryId, deliveryId));
      return items.map(i => this.normalizeDeliveryItemRecord(i));
    } catch (error) {
      console.error('Error fetching delivery items:', error);
      throw new Error('Failed to fetch delivery items');
    }
  }

  async getDeliveryItem(id: string): Promise<DeliveryItem | undefined> {
    try {
      const result = await db
        .select()
        .from(deliveryItems)
        .where(eq(deliveryItems.id, id))
        .limit(1);
      if (!result[0]) return undefined;
      return this.normalizeDeliveryItemRecord(result[0]);
    } catch (error) {
      console.error('Error fetching delivery item:', error);
      throw new Error('Failed to fetch delivery item');
    }
  }

  async createDeliveryItem(item: InsertDeliveryItem): Promise<DeliveryItem> {
    try {
      // If minimal payload (deliveryId + salesOrderItemId + quantity) provided, enrich from sales order item + item master
      const enriched: any = { ...item };
      if (!enriched.barcode || !enriched.description || !enriched.unitPrice || !enriched.totalPrice) {
        if (enriched.salesOrderItemId) {
          const soItemRows = await db.select().from(salesOrderItems).where(eq(salesOrderItems.id, enriched.salesOrderItemId)).limit(1);
          const soItem = soItemRows[0];
          if (soItem) {
            const itemRows = await db.select().from(items).where(eq(items.id, soItem.itemId)).limit(1);
            const masterItem = itemRows[0] as any;
            enriched.itemId = enriched.itemId || soItem.itemId;
            enriched.lineNumber = enriched.lineNumber || soItem.lineNumber || 1;
            enriched.orderedQuantity = enriched.orderedQuantity || soItem.quantity;
            // Attempt to map pricing
            const qty = enriched.pickedQuantity || enriched.deliveredQuantity || enriched.orderedQuantity || soItem.quantity || 0;
            const unitPrice = soItem.unitPrice as any;
            enriched.unitPrice = enriched.unitPrice || unitPrice || '0.00';
            enriched.totalPrice = enriched.totalPrice || (Number(unitPrice || 0) * Number(qty || 0));
            // Map descriptive fields
            enriched.description = enriched.description || (masterItem?.description || 'Delivery Item');
            enriched.barcode = enriched.barcode || (masterItem?.barcode || `AUTO-${Date.now()}`);
            enriched.supplierCode = enriched.supplierCode || (masterItem?.supplierCode || 'AUTO-SUP');
            // Quantities default
            enriched.pickedQuantity = enriched.pickedQuantity || qty;
            enriched.deliveredQuantity = enriched.deliveredQuantity || qty;
          }
        }
        // Fallback defaults to satisfy NOT NULL constraints
        enriched.barcode = enriched.barcode || `AUTO-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
        enriched.supplierCode = enriched.supplierCode || 'AUTO-SUP';
        enriched.description = enriched.description || 'Delivery Item';
        enriched.orderedQuantity = enriched.orderedQuantity || enriched.pickedQuantity || enriched.deliveredQuantity || 0;
        enriched.pickedQuantity = enriched.pickedQuantity || enriched.orderedQuantity || 0;
        enriched.deliveredQuantity = enriched.deliveredQuantity || enriched.pickedQuantity || 0;
        enriched.unitPrice = enriched.unitPrice || '0.00';
        enriched.totalPrice = enriched.totalPrice || '0.00';
      }

      // Fix unitPrice/totalPrice: must be string, not null
      enriched.unitPrice = enriched.unitPrice ?? '0.00';
      enriched.totalPrice = enriched.totalPrice ?? '0.00';
      const result = await db.insert(deliveryItems).values(enriched).returning();
      if (!result[0] || !result[0].id) {
        throw new Error('Failed to create delivery item: missing id');
      }
      // Convert all nulls to undefined for fields expected as string | undefined
      const normalizedInput = Object.fromEntries(
        Object.entries(result[0]).map(([k, v]) =>
          v === null ? [k, undefined] : [k, v]
        )
      );
      return this.normalizeDeliveryItemRecord(normalizedInput) as DeliveryItem;
    } catch (error) {
      console.error('Error creating delivery item:', error);
      throw new Error('Failed to create delivery item');
    }
  }

  async updateDeliveryItem(id: string, item: Partial<InsertDeliveryItem>): Promise<DeliveryItem> {
    try {
      // Fix unitPrice/totalPrice: must be string, not null
      if (item.unitPrice == null) item.unitPrice = '0.00';
      if (item.totalPrice == null) item.totalPrice = '0.00';
      const result = await db.update(deliveryItems).set({ ...item }).where(eq(deliveryItems.id, id)).returning();
      if (!result[0]) throw new Error('Delivery item not found');
      return this.normalizeDeliveryItemRecord(result[0]);
    } catch (error) {
      console.error('Error updating delivery item:', error);
      throw new Error('Failed to update delivery item');
    }
  }

  async deleteDeliveryItem(id: string): Promise<void> {
    try {
      await db
        .delete(deliveryItems)
        .where(eq(deliveryItems.id, id));
    } catch (error) {
      console.error('Error deleting delivery item:', error);
      throw new Error('Failed to delete delivery item');
    }
  }

  async bulkCreateDeliveryItems(items: InsertDeliveryItem[]): Promise<DeliveryItem[]> {
    try {
      const result = await db.insert(deliveryItems).values(items).returning();
      return result.map(r => this.normalizeDeliveryItemRecord(r));
    } catch (error) {
      console.error('Error bulk creating delivery items:', error);
      throw new Error('Failed to bulk create delivery items');
    }
  }

  // Delivery Picking Session operations
  async getDeliveryPickingSessions(deliveryId: string): Promise<DeliveryPickingSession[]> {
    try {
      return await db
        .select()
        .from(deliveryPickingSessions)
        .where(eq(deliveryPickingSessions.deliveryId, deliveryId))
        .orderBy(desc(deliveryPickingSessions.startedAt));
    } catch (error) {
      console.error('Error fetching delivery picking sessions:', error);
      throw new Error('Failed to fetch delivery picking sessions');
    }
  }

  async getDeliveryPickingSession(id: string): Promise<DeliveryPickingSession | undefined> {
    try {
      const result = await db
        .select()
        .from(deliveryPickingSessions)
        .where(eq(deliveryPickingSessions.id, id))
        .limit(1);

      return result[0];
    } catch (error) {
      console.error('Error fetching delivery picking session:', error);
      throw new Error('Failed to fetch delivery picking session');
    }
  }

  async createDeliveryPickingSession(session: InsertDeliveryPickingSession): Promise<DeliveryPickingSession> {
    try {
      const result = await db
        .insert(deliveryPickingSessions)
        .values(session)
        .returning();

      return result[0];
    } catch (error) {
      console.error('Error creating delivery picking session:', error);
      throw new Error('Failed to create delivery picking session');
    }
  }

  async updateDeliveryPickingSession(id: string, session: Partial<InsertDeliveryPickingSession>): Promise<DeliveryPickingSession> {
    try {
      const result = await db
        .update(deliveryPickingSessions)
        .set({ ...session })
        .where(eq(deliveryPickingSessions.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error('Delivery picking session not found');
      }

      return result[0];
    } catch (error) {
      console.error('Error updating delivery picking session:', error);
      throw new Error('Failed to update delivery picking session');
    }
  }

  async completePickingSession(sessionId: string): Promise<DeliveryPickingSession> {
    try {
      const result = await db
        .update(deliveryPickingSessions)
        .set({
          status: 'Completed',
          completedAt: new Date()
        })
        .where(eq(deliveryPickingSessions.id, sessionId))
        .returning();

      if (result.length === 0) {
        throw new Error('Delivery picking session not found');
      }

      return result[0];
    } catch (error) {
      console.error('Error completing picking session:', error);
      throw new Error('Failed to complete picking session');
    }
  }

  // Delivery Picked Item operations
  async getDeliveryPickedItems(sessionId: string): Promise<DeliveryPickedItem[]> {
    try {
      return await db
        .select()
        .from(deliveryPickedItems)
        .where(eq(deliveryPickedItems.pickingSessionId, sessionId))
        .orderBy(desc(deliveryPickedItems.pickedAt));
    } catch (error) {
      console.error('Error fetching delivery picked items:', error);
      throw new Error('Failed to fetch delivery picked items');
    }
  }

  async deleteDeliveryPickingSession(id: string): Promise<void> {
    try {
      await db
        .delete(deliveryPickingSessions)
        .where(eq(deliveryPickingSessions.id, id));
    } catch (error) {
      console.error('Error deleting delivery picking session:', error);
      throw new Error('Failed to delete delivery picking session');
    }
  }

  async deleteDeliveryPickedItem(id: string): Promise<void> {
    try {
      await db
        .delete(deliveryPickedItems)
        .where(eq(deliveryPickedItems.id, id));
    } catch (error) {
      console.error('Error deleting delivery picked item:', error);
      throw new Error('Failed to delete delivery picked item');
    }
  }

  async bulkCreateDeliveryPickedItems(items: InsertDeliveryPickedItem[]): Promise<DeliveryPickedItem[]> {
    try {
      const result = await db
        .insert(deliveryPickedItems)
        .values(items)
        .returning();

      return result;
    } catch (error) {
      console.error('Error bulk creating delivery picked items:', error);
      throw new Error('Failed to bulk create delivery picked items');
    }
  }

  async getDeliveryPickedItem(id: string): Promise<DeliveryPickedItem | undefined> {
    try {
      const result = await db
        .select()
        .from(deliveryPickedItems)
        .where(eq(deliveryPickedItems.id, id))
        .limit(1);

      return result[0];
    } catch (error) {
      console.error('Error fetching delivery picked item:', error);
      throw new Error('Failed to fetch delivery picked item');
    }
  }

  async createDeliveryPickedItem(item: InsertDeliveryPickedItem): Promise<DeliveryPickedItem> {
    try {
      const result = await db
        .insert(deliveryPickedItems)
        .values(item)
        .returning();

      return result[0];
    } catch (error) {
      console.error('Error creating delivery picked item:', error);
      throw new Error('Failed to create delivery picked item');
    }
  }

  async updateDeliveryPickedItem(id: string, item: Partial<InsertDeliveryPickedItem>): Promise<DeliveryPickedItem> {
    try {
      const result = await db
        .update(deliveryPickedItems)
        .set({ ...item })
        .where(eq(deliveryPickedItems.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error('Delivery picked item not found');
      }

      return result[0];
    } catch (error) {
      console.error('Error updating delivery picked item:', error);
      throw new Error('Failed to update delivery picked item');
    }
  }

  async verifyPickedItem(itemId: string, userId: string): Promise<DeliveryPickedItem> {
    try {
      const result = await db
        .update(deliveryPickedItems)
        .set({
          verified: true,
          verifiedBy: userId,
          verifiedAt: new Date()
        })
        .where(eq(deliveryPickedItems.id, itemId))
        .returning();

      if (result.length === 0) {
        throw new Error('Delivery picked item not found');
      }

      return result[0];
    } catch (error) {
      console.error('Error verifying picked item:', error);
      throw new Error('Failed to verify picked item');
    }
  }

  // Barcode scanning and verification
  async verifyItemBarcode(barcode: string, expectedItemId?: string): Promise<{ valid: boolean; item?: any; message: string }> {
    try {
      const result = await db
        .select()
        .from(items)
        .where(eq(items.barcode, barcode))
        .limit(1);

      if (result.length === 0) {
        return { valid: false, message: 'Barcode not found' };
      }

      const item = result[0];
      
      if (expectedItemId && item.id !== expectedItemId) {
        return { valid: false, item, message: 'Barcode does not match expected item' };
      }

      return { valid: true, item, message: 'Barcode verified successfully' };
    } catch (error) {
      console.error('Error verifying item barcode:', error);
      return { valid: false, message: 'Error verifying barcode' };
    }
  }

  async scanItemForPicking(barcode: string, sessionId: string, quantity: number, userId: string, storageLocation?: string): Promise<DeliveryPickedItem> {
    try {
      // First verify the barcode
      const verification = await this.verifyItemBarcode(barcode);
      if (!verification.valid) {
        throw new Error(verification.message);
      }

      // Get the delivery item for this barcode
      const deliveryItemsRows = await db
        .select()
        .from(deliveryItems)
        .where(eq(deliveryItems.barcode, barcode))
        .limit(1);

      if (deliveryItemsRows.length === 0) {
        throw new Error('Item not found in delivery');
      }

      // Create picked item record
      const pickedItem: InsertDeliveryPickedItem = {
        pickingSessionId: sessionId,
        deliveryItemId: deliveryItemsRows[0].id,
        barcode,
        quantityPicked: quantity,
        storageLocation,
        pickedBy: userId,
        verified: false
      };

      return await this.createDeliveryPickedItem(pickedItem);
    } catch (error) {
      console.error('Error scanning item for picking:', error);
      throw new Error('Failed to scan item for picking');
    }
  }

  async getAvailableItemsForPicking(deliveryId: string): Promise<any[]> {
    try {
      const result = await db
        .select({
          id: deliveryItems.id,
          barcode: deliveryItems.barcode,
          supplierCode: deliveryItems.supplierCode,
          description: deliveryItems.description,
          orderedQuantity: deliveryItems.orderedQuantity,
          pickedQuantity: deliveryItems.pickedQuantity,
          deliveredQuantity: deliveryItems.deliveredQuantity,
          storageLocation: deliveryItems.storageLocation
        })
        .from(deliveryItems)
        .where(eq(deliveryItems.deliveryId, deliveryId));

      return result;
    } catch (error) {
      console.error('Error fetching available items for picking:', error);
      throw new Error('Failed to fetch available items for picking');
    }
  }
}
