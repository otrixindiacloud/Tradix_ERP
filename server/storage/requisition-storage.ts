import { 
  requisitions, 
  requisitionItems, 
  auditLogs, 
  type Requisition, 
  type RequisitionItem,
  type InsertRequisition, 
  type InsertRequisitionItem 
} from "@shared/schema";
import { db } from "../db.js";
import { eq, desc, and, or, like, count, sql } from "drizzle-orm";
import { BaseStorage } from './base.js';

export interface IRequisitionStorage {
  getRequisitions(limit?: number, offset?: number, filters?: {
    status?: string;
    priority?: string;
    department?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<Requisition[]>;
  
  getRequisition(id: string): Promise<Requisition | null>;
  getRequisitionByNumber(requisitionNumber: string): Promise<Requisition | null>;
  createRequisition(data: InsertRequisition): Promise<Requisition>;
  updateRequisition(id: string, data: Partial<InsertRequisition>): Promise<Requisition>;
  deleteRequisition(id: string): Promise<boolean>;
  
  getRequisitionItems(requisitionId: string): Promise<RequisitionItem[]>;
  createRequisitionItem(data: InsertRequisitionItem): Promise<RequisitionItem>;
  updateRequisitionItem(id: string, data: Partial<InsertRequisitionItem>): Promise<RequisitionItem>;
  deleteRequisitionItem(id: string): Promise<boolean>;
  
  searchRequisitions(searchTerm: string): Promise<Requisition[]>;
  getRequisitionsCount(filters?: any): Promise<number>;
}

export class RequisitionStorage extends BaseStorage implements IRequisitionStorage {
  async getRequisitions(limit = 50, offset = 0, filters?: {
    status?: string;
    priority?: string;
    department?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<Requisition[]> {
    try {
      console.log("getRequisitions called with:", { limit, offset, filters });
      
      const conditions = [];
      
      let query = db.select().from(requisitions);
      
      if (filters?.status) {
        conditions.push(eq(requisitions.status, filters.status as any));
      }
      
      if (filters?.priority) {
        conditions.push(eq(requisitions.priority, filters.priority as any));
      }
      
      if (filters?.department) {
        conditions.push(like(requisitions.department, `%${filters.department}%`));
      }
      
      if (filters?.dateFrom) {
        conditions.push(sql`${requisitions.requestDate} >= ${filters.dateFrom}`);
      }
      
      if (filters?.dateTo) {
        conditions.push(sql`${requisitions.requestDate} <= ${filters.dateTo}`);
      }
      
      if (filters?.search) {
        const searchConditions = [
          like(requisitions.requisitionNumber, `%${filters.search}%`),
          like(requisitions.requestedBy, `%${filters.search}%`),
          like(requisitions.justification, `%${filters.search}%`),
          like(requisitions.notes, `%${filters.search}%`)
        ];
        conditions.push(or(...searchConditions));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      query = query.orderBy(desc(requisitions.createdAt)).limit(limit).offset(offset);
      
      const results = await query;
      console.log(`getRequisitions found ${results.length} results`);
      return results;
    } catch (error) {
      console.error("Error getting requisitions:", error);
      throw error;
    }
  }

  async getRequisition(id: string): Promise<Requisition | null> {
    try {
      const [result] = await db.select().from(requisitions).where(eq(requisitions.id, id));
      return result || null;
    } catch (error) {
      console.error("Error getting requisition:", error);
      throw error;
    }
  }

  async getRequisitionByNumber(requisitionNumber: string): Promise<Requisition | null> {
    try {
      const [result] = await db.select().from(requisitions).where(eq(requisitions.requisitionNumber, requisitionNumber));
      return result || null;
    } catch (error) {
      console.error("Error getting requisition by number:", error);
      throw error;
    }
  }

  async createRequisition(data: InsertRequisition): Promise<Requisition> {
    try {
      const requisitionNumber = this.generateNumber("REQ");
      const requisitionData = {
        ...data,
        requisitionNumber,
        totalEstimatedCost: data.totalEstimatedCost != null ? String(data.totalEstimatedCost) : '0'
      };
      
      const [result] = await db.insert(requisitions).values(requisitionData).returning();
      
      await this.logAuditEvent(
        'requisition',
        result.id,
        'created',
        `Created requisition ${requisitionNumber}`,
        null,
        result
      );
      
      return result;
    } catch (error) {
      console.error("Error creating requisition:", error);
      throw error;
    }
  }

  async updateRequisition(id: string, data: Partial<InsertRequisition>): Promise<Requisition> {
    try {
      const existing = await this.getRequisition(id);
      if (!existing) {
        throw new Error("Requisition not found");
      }
      
      const processedData = {
        ...data,
        totalEstimatedCost: data.totalEstimatedCost != null ? String(data.totalEstimatedCost) : '0',
        updatedAt: new Date()
      };
      
      const [result] = await db
        .update(requisitions)
        .set(processedData)
        .where(eq(requisitions.id, id))
        .returning();
      
      await this.logAuditEvent(
        'requisition',
        id,
        'updated',
        `Updated requisition ${existing.requisitionNumber}`,
        existing,
        result
      );
      
      return result;
    } catch (error) {
      console.error("Error updating requisition:", error);
      throw error;
    }
  }

  async deleteRequisition(id: string): Promise<boolean> {
    try {
      const existing = await this.getRequisition(id);
      if (!existing) {
        return false;
      }
      
      // Delete related items first
      await db.delete(requisitionItems).where(eq(requisitionItems.requisitionId, id));
      
      // Delete the requisition
      await db.delete(requisitions).where(eq(requisitions.id, id));
      
      await this.logAuditEvent(
        'requisition',
        id,
        'deleted',
        `Deleted requisition ${existing.requisitionNumber}`,
        existing,
        null
      );
      
      return true;
    } catch (error) {
      console.error("Error deleting requisition:", error);
      throw error;
    }
  }

  async getRequisitionItems(requisitionId: string): Promise<RequisitionItem[]> {
    try {
      const results = await db
        .select()
        .from(requisitionItems)
        .where(eq(requisitionItems.requisitionId, requisitionId))
        .orderBy(requisitionItems.createdAt);
      
      return results;
    } catch (error) {
      console.error("Error getting requisition items:", error);
      throw error;
    }
  }

  async createRequisitionItem(data: InsertRequisitionItem): Promise<RequisitionItem> {
    try {
      const processedData = {
        ...data,
        estimatedCost: data.estimatedCost != null ? String(data.estimatedCost) : '0'
      };
      
      const [result] = await db.insert(requisitionItems).values(processedData).returning();
      
      // Update item count on the requisition
      await this.updateItemCount(data.requisitionId);
      
      return result;
    } catch (error) {
      console.error("Error creating requisition item:", error);
      throw error;
    }
  }

  async updateRequisitionItem(id: string, data: Partial<InsertRequisitionItem>): Promise<RequisitionItem> {
    try {
      const processedData = {
        ...data,
        estimatedCost: data.estimatedCost != null ? String(data.estimatedCost) : '0',
        updatedAt: new Date()
      };
      
      const [result] = await db
        .update(requisitionItems)
        .set(processedData)
        .where(eq(requisitionItems.id, id))
        .returning();
      
      if (result.requisitionId) {
        await this.updateItemCount(result.requisitionId);
      }
      
      return result;
    } catch (error) {
      console.error("Error updating requisition item:", error);
      throw error;
    }
  }

  async deleteRequisitionItem(id: string): Promise<boolean> {
    try {
      const [existing] = await db.select().from(requisitionItems).where(eq(requisitionItems.id, id));
      if (!existing) {
        return false;
      }
      
      await db.delete(requisitionItems).where(eq(requisitionItems.id, id));
      
      await this.updateItemCount(existing.requisitionId);
      
      return true;
    } catch (error) {
      console.error("Error deleting requisition item:", error);
      throw error;
    }
  }

  async searchRequisitions(searchTerm: string): Promise<Requisition[]> {
    try {
      const searchConditions = [
        like(requisitions.requisitionNumber, `%${searchTerm}%`),
        like(requisitions.requestedBy, `%${searchTerm}%`),
        like(requisitions.justification, `%${searchTerm}%`),
        like(requisitions.notes, `%${searchTerm}%`)
      ];
      
      const results = await db
        .select()
        .from(requisitions)
        .where(or(...searchConditions))
        .orderBy(desc(requisitions.createdAt))
        .limit(20);
      
      return results;
    } catch (error) {
      console.error("Error searching requisitions:", error);
      throw error;
    }
  }

  async getRequisitionsCount(filters?: any): Promise<number> {
    try {
      const conditions = [];
      
      if (filters?.status) {
        conditions.push(eq(requisitions.status, filters.status));
      }
      
      if (filters?.priority) {
        conditions.push(eq(requisitions.priority, filters.priority));
      }
      
      if (filters?.department) {
        conditions.push(like(requisitions.department, `%${filters.department}%`));
      }
      
      let query = db.select({ count: count() }).from(requisitions);
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const [result] = await query;
      return result.count;
    } catch (error) {
      console.error("Error getting requisitions count:", error);
      throw error;
    }
  }

  private async updateItemCount(requisitionId: string): Promise<void> {
    try {
      const [countResult] = await db
        .select({ count: count() })
        .from(requisitionItems)
        .where(eq(requisitionItems.requisitionId, requisitionId));
      
      await db
        .update(requisitions)
        .set({ 
          itemCount: countResult.count,
          updatedAt: new Date()
        })
        .where(eq(requisitions.id, requisitionId));
    } catch (error) {
      console.error("Error updating item count:", error);
      throw error;
    }
  }
}