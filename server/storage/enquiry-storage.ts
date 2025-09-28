import { 
  enquiries, 
  enquiryItems, 
  auditLogs, 
  type Enquiry, 
  type EnquiryItem,
  type InsertEnquiry, 
  type InsertEnquiryItem 
} from "@shared/schema";
import { db } from "../db.js";
import { eq, desc, and, or, like, count, sql } from "drizzle-orm";
import { BaseStorage } from './base.js';
import { IEnquiryStorage } from './interfaces.js';

export class EnquiryStorage extends BaseStorage implements IEnquiryStorage {
  async getEnquiries(limit = 50, offset = 0, filters?: {
    status?: string;
    source?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<Enquiry[]> {
    try {
      console.log("getEnquiries called with:", { limit, offset, filters });
      
      const conditions = [];
      
      if (filters?.status) {
        conditions.push(eq(enquiries.status, filters.status as any));
      }
      
      if (filters?.source) {
        conditions.push(eq(enquiries.source, filters.source as any));
      }
      
      if (filters?.customerId) {
        conditions.push(eq(enquiries.customerId, filters.customerId));
      }
      
      if (filters?.dateFrom) {
        conditions.push(sql`${enquiries.enquiryDate} >= ${filters.dateFrom}`);
      }
      
      if (filters?.dateTo) {
        conditions.push(sql`${enquiries.enquiryDate} <= ${filters.dateTo}`);
      }
      
      if (filters?.search) {
        conditions.push(
          or(
            like(enquiries.enquiryNumber, `%${filters.search}%`),
            like(enquiries.notes, `%${filters.search}%`)
          )
        );
      }
      
      let query = db.select().from(enquiries);
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      console.log("Executing query...");
      const result = await query
        .limit(limit)
        .offset(offset)
        .orderBy(desc(enquiries.createdAt));
      
      console.log("Query result:", result.length, "enquiries found");
      return result;
    } catch (error) {
      console.error("Error in getEnquiries:", error);
      throw error;
    }
  }

  async getEnquiry(id: string): Promise<Enquiry | undefined> {
    const [enquiry] = await db.select().from(enquiries).where(eq(enquiries.id, id));
    return enquiry;
  }

  async createEnquiry(enquiryData: InsertEnquiry): Promise<Enquiry> {
    try {
      console.log("Creating enquiry with data:", enquiryData);
      
      // Generate unique enquiry number
      let enquiryNumber: string;
      let attempts = 0;
      const maxAttempts = 10;
      
      do {
        const enquiryCount = await db.select({ count: count() }).from(enquiries);
        const baseNumber = enquiryCount[0].count + 1 + attempts;
        enquiryNumber = `ENQ-2024-${String(baseNumber).padStart(3, '0')}`;
        
        // Check if this number already exists
        const existing = await db.select({ id: enquiries.id }).from(enquiries).where(eq(enquiries.enquiryNumber, enquiryNumber)).limit(1);
        if (existing.length === 0) break;
        
        attempts++;
      } while (attempts < maxAttempts);
      
      if (attempts >= maxAttempts) {
        throw new Error("Failed to generate unique enquiry number");
      }
      
      console.log("Generated enquiry number:", enquiryNumber);
      
      // Convert date string to Date object if provided
      const processedData = {
        ...enquiryData,
        targetDeliveryDate: enquiryData.targetDeliveryDate ? new Date(enquiryData.targetDeliveryDate) : null,
        enquiryNumber
      };
      console.log("Processed data:", processedData);
      
      const [enquiry] = await db
        .insert(enquiries)
        .values(processedData)
        .returning();
      
      console.log("Created enquiry:", enquiry);
      
      // await this.logAuditEvent("enquiry", enquiry.id, "create", enquiryData.createdBy || undefined, undefined, enquiry);
      return enquiry;
    } catch (error) {
      console.error("Error in createEnquiry:", error);
      throw error;
    }
  }

  async updateEnquiry(id: string, enquiryData: Partial<InsertEnquiry>): Promise<Enquiry> {
    const oldEnquiry = await this.getEnquiry(id);
    
    // Convert date string to Date object if provided
    const processedData = {
      ...enquiryData,
      targetDeliveryDate: enquiryData.targetDeliveryDate ? new Date(enquiryData.targetDeliveryDate) : null,
      updatedAt: new Date()
    };
    
    const [enquiry] = await db
      .update(enquiries)
      .set(processedData)
      .where(eq(enquiries.id, id))
      .returning();
    
    await this.logAuditEvent("enquiry", id, "update", undefined, oldEnquiry, enquiry);
    return enquiry;
  }

  async deleteEnquiry(id: string): Promise<void> {
    const enquiry = await this.getEnquiry(id);
    
    // First delete all enquiry items
    await db.delete(enquiryItems).where(eq(enquiryItems.enquiryId, id));
    
    // Then delete the enquiry
    await db.delete(enquiries).where(eq(enquiries.id, id));
    
    await this.logAuditEvent("enquiry", id, "delete", undefined, enquiry, undefined);
  }

  // Enquiry Item operations
  async getEnquiryItems(enquiryId: string): Promise<EnquiryItem[]> {
    return db.select().from(enquiryItems).where(eq(enquiryItems.enquiryId, enquiryId));
  }

  async getEnquiryItem(id: string): Promise<EnquiryItem | undefined> {
    const [item] = await db.select().from(enquiryItems).where(eq(enquiryItems.id, id));
    return item;
  }

  async createEnquiryItem(enquiryItemData: InsertEnquiryItem): Promise<EnquiryItem> {
    // Convert unitPrice from number to string if present
    const processedData = {
      ...enquiryItemData,
      unitPrice: enquiryItemData.unitPrice ? String(enquiryItemData.unitPrice) : undefined
    };
    
    const [enquiryItem] = await db
      .insert(enquiryItems)
      .values(processedData)
      .returning();
    
    await this.logAuditEvent("enquiry_item", enquiryItem.id, "create", undefined, undefined, enquiryItem);
    return enquiryItem;
  }

  async updateEnquiryItem(id: string, enquiryItemData: Partial<InsertEnquiryItem>): Promise<EnquiryItem> {
    const oldItem = await this.getEnquiryItem(id);
    
    // Convert unitPrice from number to string if present
    const processedData = {
      ...enquiryItemData,
      unitPrice: enquiryItemData.unitPrice ? String(enquiryItemData.unitPrice) : undefined
    };
    
    const [enquiryItem] = await db
      .update(enquiryItems)
      .set(processedData)
      .where(eq(enquiryItems.id, id))
      .returning();
    
    await this.logAuditEvent("enquiry_item", id, "update", undefined, oldItem, enquiryItem);
    return enquiryItem;
  }

  async deleteEnquiryItem(id: string): Promise<void> {
    const item = await this.getEnquiryItem(id);
    await db.delete(enquiryItems).where(eq(enquiryItems.id, id));
    
    await this.logAuditEvent("enquiry_item", id, "delete", undefined, item, undefined);
  }

  async bulkCreateEnquiryItems(enquiryItemsData: InsertEnquiryItem[]): Promise<EnquiryItem[]> {
    if (enquiryItemsData.length === 0) return [];
    
    // Convert unitPrice from number to string for all items
    const processedData = enquiryItemsData.map(item => ({
      ...item,
      unitPrice: item.unitPrice ? String(item.unitPrice) : undefined
    }));
    
    const items = await db
      .insert(enquiryItems)
      .values(processedData)
      .returning();
    
    // Log audit events for bulk creation
    for (const item of items) {
      await this.logAuditEvent("enquiry_item", item.id, "create", undefined, undefined, item);
    }
    
    return items;
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
      timestamp: new Date(),
    });
  }
}
