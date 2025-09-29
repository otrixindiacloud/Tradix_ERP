import { Request, Response, type Express } from "express";
import { z } from "zod";
import { SupplierQuoteStorage } from "../storage/supplier-quote-storage";
import { db } from "../db";
import { enquiries, enquiryItems, customers, suppliers, quotations, quotationItems } from "@shared/schema";
import { eq } from "drizzle-orm";
import { BaseStorage } from "../storage/base";
import { SYSTEM_USER_ID } from "@shared/utils/uuid";

// Validation schemas
const supplierQuoteSearchSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  supplier: z.string().optional(),
  currency: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

const supplierQuoteCreateSchema = z.object({
  supplierId: z.string().uuid(),
  requisitionId: z.string().uuid().optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  requestDate: z.string(),
  validUntil: z.string(),
  paymentTerms: z.string(),
  deliveryTerms: z.string(),
  notes: z.string().optional(),
  items: z.array(z.object({
    itemDescription: z.string(),
    quantity: z.number().positive(),
    unitOfMeasure: z.string(),
    specification: z.string().optional(),
  }))
});

const supplierQuoteUpdateSchema = z.object({
  supplierId: z.string().uuid().optional(),
  rfqNumber: z.string().optional(), // Not stored in DB but accepted for frontend compatibility
  status: z.enum(["Draft", "Sent", "Accepted", "Rejected", "Expired"]).optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(), // Not stored in DB but accepted for frontend compatibility
  responseDate: z.string().optional(), // Not stored in DB but accepted for frontend compatibility
  validUntil: z.string().optional(),
  totalAmount: z.string().optional(),
  currency: z.enum(["AED", "USD", "EUR", "GBP", "BHD"]).optional(), // Not stored in DB but accepted for frontend compatibility
  paymentTerms: z.string().optional(),
  deliveryTerms: z.string().optional(),
  notes: z.string().optional(),
  evaluationScore: z.number().min(0).max(10).optional(), // Not stored in DB but accepted for frontend compatibility
  competitiveRank: z.number().positive().optional(), // Not stored in DB but accepted for frontend compatibility
});

export function registerSupplierQuoteRoutes(app: Express) {
  
  // Get all supplier quotes with filtering
  app.get("/api/supplier-quotes", async (req: Request, res: Response) => {
    try {
      const params = supplierQuoteSearchSchema.parse(req.query);
      const quotes = await SupplierQuoteStorage.list(params);
      res.json({ data: quotes });
    } catch (error) {
      console.error("Error fetching supplier quotes:", error);
      res.status(500).json({ message: "Failed to fetch supplier quotes" });
    }
  });

  // Get supplier quote by ID
  app.get("/api/supplier-quotes/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const quote = await SupplierQuoteStorage.getById(id);
      if (!quote) {
        return res.status(404).json({ message: "Supplier quote not found" });
      }
      res.json(quote);
    } catch (error) {
      console.error("Error fetching supplier quote:", error);
      res.status(500).json({ message: "Failed to fetch supplier quote" });
    }
  });

  // Get supplier quote items
  app.get("/api/supplier-quotes/:id/items", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const items = await SupplierQuoteStorage.getItems(id);
      res.json(items);
    } catch (error) {
      console.error("Error fetching supplier quote items:", error);
      res.status(500).json({ message: "Failed to fetch supplier quote items" });
    }
  });

  // Create new supplier quote
  app.post("/api/supplier-quotes", async (req: Request, res: Response) => {
    try {
      const data = supplierQuoteCreateSchema.parse(req.body);
      const newQuote = await SupplierQuoteStorage.create(data);
      res.status(201).json(newQuote);
    } catch (error) {
      console.error("Error creating supplier quote:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create supplier quote" });
    }
  });

  // Update supplier quote
  app.patch("/api/supplier-quotes/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = supplierQuoteUpdateSchema.parse(req.body);
      
      // Check if the quotation exists first
      const existingQuote = await SupplierQuoteStorage.getById(id);
      if (!existingQuote) {
        return res.status(404).json({ message: "Supplier quote not found" });
      }
      
      // Convert string dates to Date objects and map fields
      const processedData: any = {};
      
      // Map supplierId to customerId (quotations table uses customerId for suppliers)
      if (data.supplierId) {
        processedData.customerId = data.supplierId;
      }
      
      // Only update fields that actually exist in the quotations table
      if (data.status) processedData.status = data.status;
      if (data.validUntil) {
        try {
          processedData.validUntil = new Date(data.validUntil);
        } catch (error) {
          console.error("Invalid date format for validUntil:", data.validUntil);
          return res.status(400).json({ message: "Invalid date format for validUntil" });
        }
      }
      if (data.notes) processedData.notes = data.notes;
      if (data.totalAmount) {
        try {
          processedData.totalAmount = parseFloat(data.totalAmount).toString();
        } catch (error) {
          console.error("Invalid totalAmount format:", data.totalAmount);
          return res.status(400).json({ message: "Invalid totalAmount format" });
        }
      }
      
      // Store paymentTerms and deliveryTerms in the terms field (combining them)
      if (data.paymentTerms || data.deliveryTerms) {
        const existingTerms = existingQuote.terms || "";
        const newTerms = [];
        if (data.paymentTerms) newTerms.push(`Payment Terms: ${data.paymentTerms}`);
        if (data.deliveryTerms) newTerms.push(`Delivery Terms: ${data.deliveryTerms}`);
        processedData.terms = existingTerms + (existingTerms ? "\n" : "") + newTerms.join('\n');
      }
      
      // Validate that we have at least one field to update
      if (Object.keys(processedData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      
      // Note: priority, evaluationScore, competitiveRank, and rfqNumber are not stored in the quotations table
      // These fields are ignored for now as they don't exist in the current schema
      
      const updatedQuote = await SupplierQuoteStorage.update(id, processedData);
      res.json(updatedQuote);
    } catch (error) {
      console.error("Error updating supplier quote:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      // Provide more specific error information
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ 
        message: "Failed to update supplier quote", 
        error: errorMessage 
      });
    }
  });

  // Delete supplier quote
  app.delete("/api/supplier-quotes/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if the quotation is referenced by other records
      const hasReferences = await SupplierQuoteStorage.hasReferences(id);
      if (hasReferences) {
        return res.status(400).json({ 
          message: "Cannot delete supplier quote. It is referenced by sales orders, customer acceptances, or purchase orders. Please delete the related records first." 
        });
      }
      
      const result = await SupplierQuoteStorage.delete(id);
      res.json(result);
    } catch (error) {
      console.error("Error deleting supplier quote:", error);
      if (error.code === '23503') {
        return res.status(400).json({ 
          message: "Cannot delete supplier quote. It is referenced by other records. Please delete the related records first." 
        });
      }
      res.status(500).json({ message: "Failed to delete supplier quote" });
    }
  });

  // Approve supplier quote
  app.post("/api/supplier-quotes/:id/approve", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Mock response - replace with actual storage call
      const updatedQuote = {
        id,
        status: "Approved",
        updatedAt: new Date().toISOString()
      };

      res.json(updatedQuote);
    } catch (error) {
      console.error("Error approving supplier quote:", error);
      res.status(500).json({ message: "Failed to approve supplier quote" });
    }
  });

  // Reject supplier quote
  app.post("/api/supplier-quotes/:id/reject", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Mock response - replace with actual storage call
      const updatedQuote = {
        id,
        status: "Rejected",
        updatedAt: new Date().toISOString()
      };

      res.json(updatedQuote);
    } catch (error) {
      console.error("Error rejecting supplier quote:", error);
      res.status(500).json({ message: "Failed to reject supplier quote" });
    }
  });

  // Create supplier quote request from enquiry (customer-quotes endpoint)
  app.post("/api/customer-quotes", async (req: Request, res: Response) => {
    try {
      const { enquiryId, customerId, suppliers } = req.body;

      if (!enquiryId || !customerId || !suppliers || !Array.isArray(suppliers) || suppliers.length === 0) {
        return res.status(400).json({ 
          message: "Missing required fields: enquiryId, customerId, and suppliers array are required" 
        });
      }

      // Get enquiry with customer details
      const enquiry = await db
        .select({
          id: enquiries.id,
          enquiryNumber: enquiries.enquiryNumber,
          customerId: enquiries.customerId,
          enquiryDate: enquiries.enquiryDate,
          status: enquiries.status,
          notes: enquiries.notes,
          targetDeliveryDate: enquiries.targetDeliveryDate,
          customer: {
            id: customers.id,
            name: customers.name,
            email: customers.email,
            phone: customers.phone,
            address: customers.address,
            customerType: customers.customerType,
          }
        })
        .from(enquiries)
        .leftJoin(customers, eq(enquiries.customerId, customers.id))
        .where(eq(enquiries.id, enquiryId))
        .limit(1);

      if (!enquiry.length) {
        return res.status(404).json({ message: "Enquiry not found" });
      }

      const enquiryData = enquiry[0];

      // Get enquiry items
      const enquiryItemsList = await db
        .select()
        .from(enquiryItems)
        .where(eq(enquiryItems.enquiryId, enquiryId));

      // Validate all suppliers exist (simplified validation for now)
      const supplierIds = suppliers.map(s => s.supplierId);
      console.log('Validating suppliers:', supplierIds);
      
      // For now, just validate that we have supplier IDs
      if (supplierIds.length === 0) {
        return res.status(400).json({ message: "No suppliers provided" });
      }

      // Build supplier names string for notes
      const supplierNames = suppliers.map(s => s.supplierName).join(', ');

      // Generate unique quote number
      const baseStorage = new BaseStorage();
      let quoteNumber: string;
      let attempts = 0;
      const maxAttempts = 10;
      
      do {
        quoteNumber = baseStorage.generateNumber("QT");
        
        // Check if this number already exists
        const existing = await db.select({ id: quotations.id }).from(quotations).where(eq(quotations.quoteNumber, quoteNumber)).limit(1);
        if (existing.length === 0) break;
        
        attempts++;
      } while (attempts < maxAttempts);
      
      if (attempts >= maxAttempts) {
        throw new Error("Failed to generate unique quotation number");
      }

      // Create supplier quote request data
      const quoteData = {
        quoteNumber: quoteNumber,
        customerId: enquiryData.customerId, // Use the actual customer ID from enquiry
        customerType: enquiryData.customer.customerType, // Use customer's actual type
        enquiryId: enquiryId,
        status: "Draft" as const,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        subtotal: "0",
        discountPercentage: "0",
        discountAmount: "0",
        taxAmount: "0",
        totalAmount: "0",
        notes: `Quote request for enquiry ${enquiryData.enquiryNumber} from customer ${enquiryData.customer.name} to suppliers: ${supplierNames}`,
        createdBy: SYSTEM_USER_ID, // Use system user ID
      };

      // Create the quotation
      const [quotation] = await db.insert(quotations).values(quoteData).returning();

      // Create quotation items from enquiry items
      if (enquiryItemsList.length > 0) {
        const quotationItemsData = enquiryItemsList.map(item => ({
          quotationId: quotation.id,
          description: item.description, // Use correct field name
          quantity: item.quantity,
          unitPrice: item.unitPrice ? item.unitPrice.toString() : "0.00",
          lineTotal: item.unitPrice ? (Number(item.unitPrice) * item.quantity).toString() : "0.00",
          notes: item.notes || `Requested for enquiry ${enquiryData.enquiryNumber}`,
        }));

        await db.insert(quotationItems).values(quotationItemsData);
      }

      // Return success response with created quote details
      res.status(201).json({
        message: "Quote request sent successfully",
        quoteId: quotation.id,
        quoteNumber: quotation.quoteNumber,
        enquiryId: enquiryId,
        suppliers: suppliers.map(s => ({ id: s.supplierId, name: s.supplierName })),
        customerName: enquiryData.customer.name,
        enquiryNumber: enquiryData.enquiryNumber,
        itemsCount: enquiryItemsList.length,
      });

    } catch (error) {
      console.error("Error creating customer quote request:", error);
      res.status(500).json({ 
        message: "Failed to create quote request", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
}