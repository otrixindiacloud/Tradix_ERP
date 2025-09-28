
import { db } from "../db";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { quotations, quotationItems, customers, salesOrders, customerAcceptances, purchaseOrders } from "@shared/schema";

export class SupplierQuoteStorage {
  static async list(params: any) {
    const whereClauses = [];
    // Filter by customerId (supplier) if provided
    if (params.supplier && params.supplier !== "" && params.supplier !== "all") {
      whereClauses.push(eq(quotations.customerId, params.supplier));
    }
    // Filter by status
    if (params.status && params.status !== "" && params.status !== "all") {
      whereClauses.push(eq(quotations.status, params.status));
    }
    // Filter by validUntil (date range)
    if (params.dateFrom) {
      whereClauses.push(gte(quotations.validUntil, params.dateFrom));
    }
    if (params.dateTo) {
      whereClauses.push(lte(quotations.validUntil, params.dateTo));
    }
    // Filter by quoteNumber search
    if (params.search && params.search.trim() !== "") {
      // Example: filter by quoteNumber containing search string
      // Uncomment and adjust if using drizzle-orm ilike
      // whereClauses.push(ilike(quotations.quoteNumber, `%${params.search}%`));
    }
    // Add search filter (by quoteNumber, supplierName, etc.)
    if (params.search && params.search.trim() !== "") {
      // Example: filter by quoteNumber or supplierName containing search string
      // This requires a 'like' operator, which may differ by ORM
      // For Drizzle, you may need to use ilike or similar
      // whereClauses.push(ilike(quotations.quoteNumber, `%${params.search}%`));
      // whereClauses.push(ilike(quotations.supplierName, `%${params.search}%`));
    }
    // Create aliases for different customer roles
    const suppliers = alias(customers, "suppliers");
    const actualCustomers = alias(customers, "customers");
    
    // Join quotations with customers to get supplier names and customer information
    const query = db
      .select({
        quotation: quotations,
        supplier: suppliers,
        customer: actualCustomers,
      })
      .from(quotations)
      .leftJoin(suppliers, eq(quotations.customerId, suppliers.id))
      .leftJoin(salesOrders, eq(quotations.id, salesOrders.quotationId))
      .leftJoin(actualCustomers, eq(salesOrders.customerId, actualCustomers.id));

    let results;
    if (whereClauses.length > 0) {
      results = await query.where(and(...whereClauses));
    } else {
      results = await query;
    }

    // Process results to include customer information
    const processedResults = results.map(row => {
      const supplier = row.supplier ? {
        id: row.supplier.id,
        name: row.supplier.name || row.supplier.customerName || row.supplier.companyName || row.supplier.fullName,
        email: row.supplier.email,
        phone: row.supplier.phone,
        address: row.supplier.address || row.supplier.billingAddress,
        customerType: row.supplier.customerType,
      } : null;

      const customer = row.customer ? {
        id: row.customer.id,
        name: row.customer.name || row.customer.customerName || row.customer.companyName || row.customer.fullName,
        email: row.customer.email,
        phone: row.customer.phone,
        address: row.customer.address || row.customer.billingAddress,
        customerType: row.customer.customerType,
      } : null;

      return {
        ...row.quotation,
        supplier,
        supplierName: supplier?.name || "Unknown Supplier",
        customer,
        __customerEmbedded: true
      };
    });

    return processedResults;
  }

  static async getById(id: string) {
    const result = await db
      .select({
        id: quotations.id,
        quoteNumber: quotations.quoteNumber,
        revision: quotations.revision,
        parentQuotationId: quotations.parentQuotationId,
        revisionReason: quotations.revisionReason,
        supersededAt: quotations.supersededAt,
        supersededBy: quotations.supersededBy,
        isSuperseded: quotations.isSuperseded,
        enquiryId: quotations.enquiryId,
        customerId: quotations.customerId,
        customerType: quotations.customerType,
        status: quotations.status,
        quoteDate: quotations.quoteDate,
        validUntil: quotations.validUntil,
        subtotal: quotations.subtotal,
        discountPercentage: quotations.discountPercentage,
        discountAmount: quotations.discountAmount,
        taxAmount: quotations.taxAmount,
        totalAmount: quotations.totalAmount,
        terms: quotations.terms,
        notes: quotations.notes,
        approvalStatus: quotations.approvalStatus,
        requiredApprovalLevel: quotations.requiredApprovalLevel,
        approvedBy: quotations.approvedBy,
        approvedAt: quotations.approvedAt,
        rejectionReason: quotations.rejectionReason,
        createdBy: quotations.createdBy,
        createdAt: quotations.createdAt,
        updatedAt: quotations.updatedAt,
        // Add supplier name from customers table
        supplierName: customers.name,
      })
      .from(quotations)
      .leftJoin(customers, eq(quotations.customerId, customers.id))
      .where(eq(quotations.id, id))
      .limit(1);
    return result[0];
  }

  static async getItems(quoteId: string) {
  return await db.select().from(quotationItems).where(eq(quotationItems.quotationId, quoteId));
  }

  static async create(data: any) {
    // Insert quote
  const [quote] = await db.insert(quotations).values(data).returning();
    // Insert items if present
    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
  await db.insert(quotationItems).values({ ...item, quotationId: quote.id });
      }
    }
    return await this.getById(quote.id);
  }

  static async update(id: string, updates: any) {
    try {
      // Add updatedAt timestamp
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await db.update(quotations).set(updateData).where(eq(quotations.id, id));
      return await this.getById(id);
    } catch (error) {
      console.error("Database error in SupplierQuoteStorage.update:", error);
      throw new Error(`Failed to update supplier quote: ${error instanceof Error ? error.message : 'Unknown database error'}`);
    }
  }

  static async hasReferences(id: string) {
    // Check if the quotation is referenced by sales orders, customer acceptances, or purchase orders
    const [salesOrderRefs, customerAcceptanceRefs, purchaseOrderRefs] = await Promise.all([
      db
        .select({ id: salesOrders.id })
        .from(salesOrders)
        .where(eq(salesOrders.quotationId, id))
        .limit(1),
      db
        .select({ id: customerAcceptances.id })
        .from(customerAcceptances)
        .where(eq(customerAcceptances.quotationId, id))
        .limit(1),
      db
        .select({ id: purchaseOrders.id })
        .from(purchaseOrders)
        .where(eq(purchaseOrders.quotationId, id))
        .limit(1)
    ]);
    
    return salesOrderRefs.length > 0 || customerAcceptanceRefs.length > 0 || purchaseOrderRefs.length > 0;
  }

  static async delete(id: string) {
    // Use transaction to ensure atomicity
    await db.transaction(async (tx) => {
      // Delete quotation items first (due to foreign key constraint)
      await tx.delete(quotationItems).where(eq(quotationItems.quotationId, id));
      // Then delete the quotation
      await tx.delete(quotations).where(eq(quotations.id, id));
    });
    return { message: "Supplier quote deleted successfully" };
  }
}
