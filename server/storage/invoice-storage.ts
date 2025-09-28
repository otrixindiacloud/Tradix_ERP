import { db } from '../db';
import { invoices, invoiceItems, InsertInvoice, InsertInvoiceItem, salesOrders, deliveryItems, deliveries, salesOrderItems, items } from '@shared/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { BaseStorage } from './base';

// Helper to coerce numeric strings -> number safely
function num(val: any): number { if (val === null || val === undefined) return 0; const n = typeof val === 'number' ? val : parseFloat(val); return isNaN(n) ? 0 : n; }

export class InvoiceStorage extends BaseStorage {
  // Basic list with lightweight filtering & pagination
  async getInvoices(filters?: { status?: string; customerId?: string; type?: string; salesOrderId?: string; dateFrom?: string; dateTo?: string; search?: string; currency?: string; limit?: number; offset?: number; }) {
    const limit = filters?.limit ?? 50; const offset = filters?.offset ?? 0;
    let q: any = db.select().from(invoices);
    const conds: any[] = [];
    if (filters) {
      if (filters.status) conds.push(eq(invoices.status, filters.status as any));
      if (filters.type) conds.push(eq(invoices.invoiceType, filters.type as any));
      if (filters.customerId) conds.push(eq(invoices.customerId, filters.customerId));
      if (filters.salesOrderId) conds.push(eq(invoices.salesOrderId, filters.salesOrderId));
      if (filters.currency) conds.push(eq(invoices.currency, filters.currency));
      if (filters.dateFrom) conds.push(sql`${invoices.invoiceDate} >= ${filters.dateFrom}`);
      if (filters.dateTo) conds.push(sql`${invoices.invoiceDate} <= ${filters.dateTo}`);
      if (filters.search) conds.push(sql`${invoices.invoiceNumber} ILIKE ${`%${filters.search}%`}`);
      if (conds.length) q = (q as any).where(and(...conds));
    }
    return (q as any).orderBy(desc(invoices.createdAt)).limit(limit).offset(offset);
  }

  async getInvoice(id: string) {
    const r = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
    return r[0];
  }

  async getInvoiceByNumber(invoiceNumber: string) {
    const r = await db.select().from(invoices).where(eq(invoices.invoiceNumber, invoiceNumber)).limit(1);
    return r[0];
  }

  async createInvoice(data: InsertInvoice) {
    const invoiceNumber = data.invoiceNumber || this.generateNumber('INV');
    const now = new Date();
    const record: any = { ...data, invoiceNumber, createdAt: now, updatedAt: now };
    try {
      const inserted = await db.insert(invoices).values(record).returning();
      return inserted[0];
    } catch (err: any) {
      // If FK constraint on created_by fails (system test user not in users table), retry with null
      if (err?.code === '23503' && String(err?.detail || '').includes('created_by')) {
        const fallback = { ...record, createdBy: null };
        const inserted = await db.insert(invoices).values(fallback).returning();
        return inserted[0];
      }
      throw err;
    }
  }

  async updateInvoice(id: string, data: Partial<InsertInvoice>) {
    const updated = await db.update(invoices).set({ ...data, updatedAt: new Date() }).where(eq(invoices.id, id)).returning();
    return updated[0];
  }

  async deleteInvoice(id: string) {
    await db.delete(invoices).where(eq(invoices.id, id));
  }

  // Generation from delivery: derive customer, sales order, sums from delivered items
  async generateInvoiceFromDelivery(deliveryId: string, invoiceType: string = 'Final', userId?: string) {
    console.log(`[DEBUG] Starting invoice generation for delivery: ${deliveryId}`);
    
    let deliveryRec: any;
    let soId: string;
    let so: any;
    let items: any[];
    
    try {
      const deliveryRecArr = await db.select().from(deliveries).where(eq(deliveries.id, deliveryId)).limit(1);
      deliveryRec = deliveryRecArr[0];
      if (!deliveryRec) throw new Error('Delivery not found');
      console.log(`[DEBUG] Found delivery: ${deliveryRec.deliveryNumber}`);
      soId = deliveryRec.salesOrderId;
      console.log(`[DEBUG] Sales order ID: ${soId}`);
      
      // Sales order ID is required for invoice generation
      if (!soId) {
        throw new Error('Delivery must be linked to a sales order to generate an invoice');
      }
      
      const soArr = await db.select().from(salesOrders).where(eq(salesOrders.id, soId)).limit(1);
      so = soArr[0];
      if (!so) {
        throw new Error('Sales order not found for the delivery');
      }
      console.log(`[DEBUG] Found sales order: ${so.orderNumber}`);
      items = await db.select().from(deliveryItems).where(eq(deliveryItems.deliveryId, deliveryId));
      console.log(`[DEBUG] Found ${items.length} delivery items`);
    } catch (error) {
      console.error(`[DEBUG] Error in initial data fetching:`, error);
      throw error;
    }
    
    // If no delivery items found, create them from sales order items
    let itemsToProcess = items;
    if (items.length === 0 && soId) {
      console.log(`[DEBUG] No delivery items found, creating from sales order items`);
      const salesOrderItemsData = await db.select().from(salesOrderItems).where(eq(salesOrderItems.salesOrderId, soId));
      console.log(`[DEBUG] Found ${salesOrderItemsData.length} sales order items`);
      
      // Create virtual delivery items from sales order items
      itemsToProcess = salesOrderItemsData.map((soItem: any, index: number) => ({
        id: `virtual-${soItem.id}`,
        deliveryId: deliveryId,
        salesOrderItemId: soItem.id,
        itemId: soItem.itemId,
        lineNumber: soItem.lineNumber || index + 1,
        barcode: `AUTO-${Date.now()}-${index}`,
        supplierCode: 'AUTO-SUP',
        description: soItem.specialInstructions || 'Item from Sales Order',
        orderedQuantity: soItem.quantity,
        pickedQuantity: soItem.quantity,
        deliveredQuantity: soItem.quantity,
        unitPrice: soItem.unitPrice,
        totalPrice: soItem.totalPrice,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      console.log(`[DEBUG] Created ${itemsToProcess.length} virtual delivery items`);
    }
    
    // Attempt to get pricing from related sales order items if present
    let subtotal = 0;
    const invoiceItemsToInsert: any[] = [];
    let lineNumber = 1;
    for (const di of itemsToProcess as any[]) {
      console.log(`[DEBUG] Processing delivery item: ${di.id}`);
      const soItemArr = di.salesOrderItemId ? await db.select().from(salesOrderItems).where(eq(salesOrderItems.id, di.salesOrderItemId)).limit(1) : [];
      const soItem: any = soItemArr[0];
      console.log(`[DEBUG] Sales order item: ${soItem?.id || 'None'}`);
      console.log(`[DEBUG] Sales order item data:`, soItem ? {
        id: soItem.id,
        itemId: soItem.itemId,
        quantity: soItem.quantity,
        unitPrice: soItem.unitPrice,
        totalPrice: soItem.totalPrice
      } : 'None');
      
      const qty = num(di.deliveredQuantity || di.pickedQuantity || di.orderedQuantity || soItem?.quantity || 0);
      const unitPrice = num(soItem?.unitPrice || di.unitPrice || 0);
      const lineTotal = qty * unitPrice;
      subtotal += lineTotal;
      const barcode = di.barcode || soItem?.barcode || `AUTO-${lineNumber}`;
      const supplierCode = di.supplierCode || soItem?.supplierCode || 'AUTO-SUP';
      const description = soItem?.description || di.description || 'Item';
      const itemId = soItem?.itemId || di.itemId || null;
      console.log(`[DEBUG] Item ID: ${itemId}, Barcode: ${barcode}, Supplier Code: ${supplierCode}`);
      
      // Check if the item exists in the items table
      if (itemId) {
        const itemArr = await db.select().from(items).where(eq(items.id, itemId)).limit(1);
        const item = itemArr[0];
        console.log(`[DEBUG] Item master data:`, item ? {
          id: item.id,
          supplierCode: item.supplierCode,
          barcode: item.barcode,
          description: item.description
        } : 'Item not found in master data');
        
        // If item exists, use its data for better accuracy
        if (item) {
          const finalBarcode = di.barcode || item.barcode || `AUTO-${lineNumber}`;
          const finalSupplierCode = di.supplierCode || item.supplierCode || 'AUTO-SUP';
          const finalDescription = di.description || item.description || 'Item';
          
          console.log(`[DEBUG] Using item master data - Barcode: ${finalBarcode}, Supplier Code: ${finalSupplierCode}, Description: ${finalDescription}`);
        }
      }
      
      if (!itemId) {
        console.log(`[DEBUG] WARNING: No itemId found for delivery item ${di.id}, attempting to create minimal item...`);
        
        // Try to create a minimal item as a last resort
        try {
          const minimalItem = {
            supplierCode: di.supplierCode || 'AUTO-SUP',
            barcode: di.barcode || `AUTO-${Date.now()}-${lineNumber}`,
            description: di.description || 'Auto-generated item for invoice',
            category: 'Auto-generated',
            unitOfMeasure: 'EA',
            costPrice: '0.00',
            isActive: true
          };
          
          const [createdItem] = await db.insert(items).values(minimalItem).returning();
          console.log(`[DEBUG] Created minimal item: ${createdItem.id}`);
          
          // Update the itemId for this delivery item
          const updatedItemId = createdItem.id;
          console.log(`[DEBUG] Using created item ID: ${updatedItemId}`);
          
          // Continue with the created item
          const finalBarcode = di.barcode || createdItem.barcode || `AUTO-${lineNumber}`;
          const finalSupplierCode = di.supplierCode || createdItem.supplierCode || 'AUTO-SUP';
          const finalDescription = di.description || createdItem.description || 'Item';
          
          invoiceItemsToInsert.push({
            invoiceId: 'TEMP',
            deliveryItemId: di.id.startsWith('virtual-') ? null : di.id,
            salesOrderItemId: di.salesOrderItemId || soItem?.id || null,
            itemId: updatedItemId,
            barcode: finalBarcode,
            supplierCode: finalSupplierCode,
            description: finalDescription,
            lineNumber,
            quantity: qty,
            unitPrice: unitPrice,
            totalPrice: lineTotal,
            discountPercentage: '0',
            discountAmount: 0,
            taxRate: '0',
            taxAmount: 0,
            unitPriceBase: unitPrice,
            totalPriceBase: lineTotal,
            discountAmountBase: 0,
            taxAmountBase: 0,
            returnQuantity: 0,
            notes: null
          });
          lineNumber++;
          continue;
        } catch (createError) {
          console.log(`[DEBUG] ERROR: Failed to create minimal item:`, createError);
          console.log(`[DEBUG] WARNING: Skipping delivery item ${di.id} due to missing itemId and failed item creation`);
          continue;
        }
      }
      
      // Ensure we have all required fields - but be more lenient with barcode and supplierCode
      // since they might not be available in sales order items due to schema limitations
      if (!description) {
        console.log(`[DEBUG] WARNING: Missing description for delivery item ${di.id}, skipping...`);
        continue;
      }
      
      invoiceItemsToInsert.push({
        invoiceId: 'TEMP',
        deliveryItemId: di.id.startsWith('virtual-') ? null : di.id,
        salesOrderItemId: di.salesOrderItemId || soItem?.id || null,
        itemId: itemId,
        barcode,
        supplierCode,
        description: soItem?.description || di.description || 'Item',
        lineNumber,
        quantity: qty,
        unitPrice: unitPrice,
        totalPrice: lineTotal,
        discountPercentage: '0',
        discountAmount: 0,
        taxRate: '0',
        taxAmount: 0,
        unitPriceBase: unitPrice,
        totalPriceBase: lineTotal,
        discountAmountBase: 0,
        taxAmountBase: 0,
        returnQuantity: 0,
        notes: null
      });
      lineNumber++;
    }
    console.log(`[DEBUG] Subtotal calculated: ${subtotal}`);
    console.log(`[DEBUG] Invoice items to insert: ${invoiceItemsToInsert.length}`);
    console.log(`[DEBUG] Items processed: ${itemsToProcess.length}`);
    
    if (invoiceItemsToInsert.length === 0) {
      console.log(`[DEBUG] ERROR: No valid items found for invoice generation`);
      console.log(`[DEBUG] Items to process:`, itemsToProcess.map(item => ({
        id: item.id,
        itemId: item.itemId,
        barcode: item.barcode,
        supplierCode: item.supplierCode,
        description: item.description
      })));
      
      // Provide more helpful error message
      if (itemsToProcess.length === 0) {
        throw new Error('No delivery items found for this delivery. Please ensure the delivery has items before generating an invoice.');
      } else {
        throw new Error(`Found ${itemsToProcess.length} delivery items but none could be processed for invoice generation. This may be due to missing item references or invalid data.`);
      }
    }
    
    // Validate that we have all required data
    if (!so.customerId) {
      throw new Error('Sales order is missing customer ID');
    }
    
    // Additional validation for required fields
    if (!soId) {
      throw new Error('Sales order ID is required for invoice generation');
    }
    
    if (subtotal <= 0) {
      throw new Error('Invoice subtotal must be greater than zero');
    }
    
    console.log(`[DEBUG] Validation passed - proceeding with invoice creation`);
    console.log(`[DEBUG] Sales Order ID: ${soId}`);
    console.log(`[DEBUG] Customer ID: ${so.customerId}`);
    console.log(`[DEBUG] Subtotal: ${subtotal}`);
    
    const invoiceNumber = this.generateNumber('INV');
    console.log(`[DEBUG] Generated invoice number: ${invoiceNumber}`);
    const invoiceInsert: any = {
      invoiceNumber,
      invoiceType,
      salesOrderId: soId, // This is now guaranteed to be non-null
      deliveryId,
      customerId: so.customerId, // Use sales order customer ID as primary source
      status: 'Draft',
      currency: so.currency || 'BHD',
      exchangeRate: so.exchangeRate || '1.0000',
      baseCurrency: so.baseCurrency || 'BHD',
      subtotal: subtotal,
      taxRate: '0',
      taxAmount: 0,
      discountPercentage: '0',
      discountAmount: 0,
      totalAmount: subtotal,
      paidAmount: 0,
      outstandingAmount: subtotal,
      subtotalBase: subtotal,
      taxAmountBase: 0,
      discountAmountBase: 0,
      totalAmountBase: subtotal,
      autoGenerated: true,
      generatedFromDeliveryId: deliveryId,
      createdBy: userId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.log(`[DEBUG] Inserting invoice with customerId: ${invoiceInsert.customerId}`);
    let invoice: any;
    try {
      const inserted = await db.insert(invoices).values(invoiceInsert).returning();
      invoice = inserted[0];
      console.log(`[DEBUG] Invoice created successfully: ${invoice.id}`);
    } catch (err: any) {
      console.log(`[DEBUG] Invoice creation failed:`, err);
      console.log(`[DEBUG] Error code: ${err?.code}`);
      console.log(`[DEBUG] Error detail: ${err?.detail}`);
      console.log(`[DEBUG] Error message: ${err?.message}`);
      console.log(`[DEBUG] Invoice data being inserted:`, JSON.stringify(invoiceInsert, null, 2));
      
      // Handle foreign key constraint violations
      if (err?.code === '23503') {
        if (String(err?.detail || '').includes('created_by')) {
          console.log(`[DEBUG] Retrying with null createdBy`);
          const inserted = await db.insert(invoices).values({ ...invoiceInsert, createdBy: null }).returning();
          invoice = inserted[0];
          console.log(`[DEBUG] Invoice created with null createdBy: ${invoice.id}`);
        } else if (String(err?.detail || '').includes('customer_id')) {
          throw new Error(`Invalid customer ID: ${invoiceInsert.customerId}. Customer not found. Please ensure the sales order has a valid customer assigned.`);
        } else if (String(err?.detail || '').includes('sales_order_id')) {
          throw new Error(`Invalid sales order ID: ${invoiceInsert.salesOrderId}. Sales order not found. Please ensure the delivery is properly linked to a valid sales order.`);
        } else if (String(err?.detail || '').includes('delivery_id')) {
          throw new Error(`Invalid delivery ID: ${invoiceInsert.deliveryId}. Delivery not found.`);
        } else {
          throw new Error(`Database constraint violation: ${err?.detail || err?.message}`);
        }
      } else if (err?.code === '23505') {
        // Unique constraint violation
        throw new Error(`Invoice number ${invoiceInsert.invoiceNumber} already exists. Please try again.`);
      } else {
        throw new Error(`Database error: ${err?.message || 'Unknown error occurred'}`);
      }
    }
    // Insert items
    console.log(`[DEBUG] Updating invoice items with invoice ID: ${invoice.id}`);
    for (const it of invoiceItemsToInsert) it.invoiceId = invoice.id;
    if (invoiceItemsToInsert.length) {
      try {
        console.log(`[DEBUG] Inserting ${invoiceItemsToInsert.length} invoice items`);
        await db.insert(invoiceItems).values(invoiceItemsToInsert as any).returning();
        console.log(`[DEBUG] Invoice items inserted successfully`);
      } catch (err: any) {
        console.log(`[DEBUG] Invoice items insertion failed:`, err);
        console.log(`[DEBUG] Error code: ${err?.code}`);
        console.log(`[DEBUG] Error detail: ${err?.detail}`);
        console.log(`[DEBUG] Error message: ${err?.message}`);
        console.log(`[DEBUG] Full error:`, JSON.stringify(err, null, 2));
        
        if (err?.code === '23503') {
          if (String(err?.detail || '').includes('invoice_id')) {
            throw new Error(`Invalid invoice ID for items. Invoice may not have been created properly.`);
          } else if (String(err?.detail || '').includes('item_id')) {
            throw new Error(`Invalid item ID in invoice items. One or more items not found.`);
          } else {
            throw new Error(`Database constraint violation in invoice items: ${err?.detail || err?.message}`);
          }
        } else {
          throw new Error(`Database error inserting invoice items: ${err?.message || 'Unknown error occurred'}`);
        }
      }
    }
    console.log(`[DEBUG] Invoice generation completed successfully`);
    return invoice;
  }

  async generateProformaInvoice(salesOrderId: string, userId?: string) {
    // Get sales order to extract customer ID
    const salesOrder = await db.select().from(salesOrders).where(eq(salesOrders.id, salesOrderId)).limit(1);
    if (!salesOrder.length) {
      throw new Error('Sales order not found');
    }

    // Create proforma invoice referencing SO with proper customer ID
    const invoiceNumber = this.generateNumber('PFINV');
    const record: any = {
      invoiceNumber,
      invoiceType: 'Proforma',
      salesOrderId,
      customerId: salesOrder[0].customerId,
      status: 'Draft',
      currency: (salesOrder[0] as any).currency || 'BHD',
      exchangeRate: (salesOrder[0] as any).exchangeRate || '1.0000',
      baseCurrency: (salesOrder[0] as any).baseCurrency || 'BHD',
      subtotal: 0,
      taxRate: '0',
      taxAmount: 0,
      discountPercentage: '0',
      discountAmount: 0,
      totalAmount: 0,
      paidAmount: 0,
      outstandingAmount: 0,
      subtotalBase: 0,
      taxAmountBase: 0,
      discountAmountBase: 0,
      totalAmountBase: 0,
      autoGenerated: true,
      createdBy: userId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    try {
      const inserted = await db.insert(invoices).values(record).returning();
      return inserted[0];
    } catch (err: any) {
      if (err?.code === '23503' && String(err?.detail || '').includes('created_by')) {
        const inserted = await db.insert(invoices).values({ ...record, createdBy: null }).returning();
        return inserted[0];
      }
      throw err;
    }
  }

  async sendInvoice(invoiceId: string, email?: string, userId?: string) {
    // Mark as sent; in a real implementation, trigger email sending here using provided email or customer email on record
    const updated = await this.updateInvoice(invoiceId, { status: 'Sent' } as any);
    return {
      message: 'Invoice marked as sent',
      invoice: updated,
      email: email || null,
    };
  }

  async markInvoicePaid(invoiceId: string, paidAmount: number, paymentMethod?: string, paymentReference?: string, userId?: string) {
    const inv = await this.getInvoice(invoiceId);
    if (!inv) throw new Error('Invoice not found');
    const newPaid = num(inv.paidAmount) + paidAmount;
    const outstanding = Math.max(0, num(inv.totalAmount) - newPaid);
    const status = outstanding === 0 ? 'Paid' : inv.status;
    return this.updateInvoice(invoiceId, { paidAmount: newPaid as any, outstandingAmount: outstanding as any, status } as any);
  }

  // Items
  async getInvoiceItems(invoiceId: string) { return db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId)); }
  async getInvoiceItem(id: string) { const r = await db.select().from(invoiceItems).where(eq(invoiceItems.id, id)).limit(1); return r[0]; }
  async createInvoiceItem(item: InsertInvoiceItem) { const r = await db.insert(invoiceItems).values(item as any).returning(); return r[0]; }
  async updateInvoiceItem(id: string, item: Partial<InsertInvoiceItem>) { const r = await db.update(invoiceItems).set({ ...(item as any), updatedAt: new Date() }).where(eq(invoiceItems.id, id)).returning(); return r[0]; }
  async deleteInvoiceItem(id: string) { await db.delete(invoiceItems).where(eq(invoiceItems.id, id)); }
  async bulkCreateInvoiceItems(itemsArr: InsertInvoiceItem[]) { if (!itemsArr.length) return []; return await db.insert(invoiceItems).values(itemsArr as any).returning(); }

  // Currency helpers (VERY simplified placeholder FX logic)
  async getExchangeRate(fromCurrency: string, toCurrency: string) { if (fromCurrency === toCurrency) return 1; return 1; }
  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string, exchangeRate?: number) { const rate = exchangeRate || await this.getExchangeRate(fromCurrency, toCurrency); return amount * rate; }
  async updateInvoiceCurrency(invoiceId: string, newCurrency: string, exchangeRate: number, userId: string) {
    const inv = await this.getInvoice(invoiceId); if (!inv) throw new Error('Invoice not found');
    const subtotalBase = await this.convertCurrency(num(inv.subtotal), inv.currency as any, newCurrency, exchangeRate);
    const taxAmountBase = await this.convertCurrency(num(inv.taxAmount), inv.currency as any, newCurrency, exchangeRate);
    const discountAmountBase = await this.convertCurrency(num(inv.discountAmount), inv.currency as any, newCurrency, exchangeRate);
    const totalAmountBase = await this.convertCurrency(num(inv.totalAmount), inv.currency as any, newCurrency, exchangeRate);
    return this.updateInvoice(invoiceId, { currency: newCurrency as any, exchangeRate: exchangeRate as any, subtotalBase: subtotalBase as any, taxAmountBase: taxAmountBase as any, discountAmountBase: discountAmountBase as any, totalAmountBase: totalAmountBase as any } as any);
  }
}