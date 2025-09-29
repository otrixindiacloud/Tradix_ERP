import type { Express } from "express";
import { storage } from "../storage";
import { 
  insertSalesOrderSchema,
  insertSalesOrderItemSchema
} from "@shared/schema";
import { z } from "zod";
import { getAttributingUserId, getOptionalUserId } from '../utils/user';

export function registerSalesOrderRoutes(app: Express) {
  // Sales Order routes
  app.get("/api/sales-orders", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const filters = {
        status: req.query.status as string,
        customerId: req.query.customerId as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        search: req.query.search as string,
        // Filter for sales orders pending supplier LPO creation
        pendingSupplierLpo: req.query.pendingSupplierLpo === "true",
      };
      
      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });

      const salesOrders = await storage.getSalesOrders(limit, offset, Object.keys(filters).length > 0 ? filters : undefined);
      // Each sales order now includes { customer, __customerEmbedded: true }
      res.json(salesOrders);
    } catch (error) {
      console.error("Error fetching sales orders:", error);
      res.status(500).json({ message: "Failed to fetch sales orders" });
    }
  });

  app.get("/api/sales-orders/:id", async (req, res) => {
    try {
      const salesOrder = await storage.getSalesOrder(req.params.id);
      if (!salesOrder) {
        return res.status(404).json({ message: "Sales order not found" });
      }
      // Single sales order enriched with embedded customer + transition flag
      res.json(salesOrder);
    } catch (error) {
      console.error("Error fetching sales order:", error);
      res.status(500).json({ message: "Failed to fetch sales order" });
    }
  });

  app.post("/api/sales-orders", async (req, res) => {
    try {
      const salesOrderData = insertSalesOrderSchema.parse(req.body);
      const salesOrder = await storage.createSalesOrder(salesOrderData);
      res.status(201).json(salesOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid sales order data", errors: error.errors });
      }
      console.error("Error creating sales order:", error);
      res.status(500).json({ message: "Failed to create sales order" });
    }
  });

  app.put("/api/sales-orders/:id", async (req, res) => {
    try {
      const salesOrderData = insertSalesOrderSchema.partial().parse(req.body);
      const salesOrder = await storage.updateSalesOrder(req.params.id, salesOrderData);
      res.json(salesOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid sales order data", errors: error.errors });
      }
      console.error("Error updating sales order:", error);
      res.status(500).json({ message: "Failed to update sales order" });
    }
  });

  app.delete("/api/sales-orders/:id", async (req, res) => {
    try {
      await storage.deleteSalesOrder(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting sales order:", error);
      res.status(500).json({ message: "Failed to delete sales order" });
    }
  });

  app.post("/api/sales-orders/from-quotation", async (req, res) => {
    try {
      const { quotationId } = req.body;
      if (!quotationId) {
        return res.status(400).json({ message: "Quotation ID is required" });
      }
      const salesOrder = await storage.createSalesOrderFromQuotation(quotationId, getOptionalUserId(req));
      res.status(201).json(salesOrder);
    } catch (error) {
      console.error("Error creating sales order from quotation:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to create sales order from quotation" });
    }
  });

  app.post("/api/sales-orders/:id/amend", async (req, res) => {
    try {
      const schema = z.object({
        reason: z.string().min(5, "Amendment reason required"),
        userId: z.string().optional(),
      });
      const body = schema.parse(req.body);
      const userIdResolved = body.userId || getOptionalUserId(req);
      const amended = await storage.createAmendedSalesOrder(req.params.id, body.reason, userIdResolved);
      res.status(201).json(amended);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid amendment data", errors: error.errors });
      }
      console.error("Error creating amended sales order:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to create amended sales order" });
    }
  });

  // Validate customer LPO
  app.put("/api/sales-orders/:id/validate-lpo", async (req, res) => {
    try {
      const validationSchema = z.object({
        status: z.enum(["Approved", "Rejected"]),
        notes: z.string().optional(),
        validatedBy: z.string().optional(),
        override: z.boolean().optional(),
      });

      const validationData = validationSchema.parse(req.body);
      // inject resolved validator if not provided
      (validationData as any).validatedBy = validationData.validatedBy || getAttributingUserId(req);

      // fetch order to enforce rule: once Approved cannot be revalidated unless override flag true
      const existing = await storage.getSalesOrder(req.params.id);
      if (!existing) return res.status(404).json({ message: "Sales order not found" });
      if (existing.customerLpoValidationStatus === 'Approved' && validationData.status !== 'Approved' && !validationData.override) {
        return res.status(400).json({ message: "LPO already approved; override required to change status" });
      }

      const salesOrder = await storage.validateCustomerLpo(req.params.id, validationData as { status: string; notes?: string; validatedBy: string });
      res.json(salesOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid validation data", errors: error.errors });
      }
      console.error("Error validating customer LPO:", error);
      res.status(500).json({ message: "Failed to validate customer LPO" });
    }
  });

  // Lineage endpoint
  app.get("/api/sales-orders/:id/lineage", async (req, res) => {
    try {
      const lineage = await storage.getSalesOrderLineage(req.params.id);
      res.json({ count: lineage.length, lineage });
    } catch (error) {
      console.error('Error fetching sales order lineage:', error);
      res.status(500).json({ message: 'Failed to fetch sales order lineage' });
    }
  });

  // Sales Order Items routes
  app.get("/api/sales-orders/:id/items", async (req, res) => {
    try {
      const items = await storage.getSalesOrderItems(req.params.id);
      res.json(items);
    } catch (error) {
      console.error("Error fetching sales order items:", error);
      res.status(500).json({ message: "Failed to fetch sales order items" });
    }
  });

  app.get("/api/sales-order-items/:id", async (req, res) => {
    try {
      const item = await storage.getSalesOrderItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Sales order item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching sales order item:", error);
      res.status(500).json({ message: "Failed to fetch sales order item" });
    }
  });

  app.post("/api/sales-order-items", async (req, res) => {
    try {
      const itemData = insertSalesOrderItemSchema.parse(req.body);
      const item = await storage.createSalesOrderItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid sales order item data", errors: error.errors });
      }
      console.error("Error creating sales order item:", error);
      res.status(500).json({ message: "Failed to create sales order item" });
    }
  });

  app.put("/api/sales-order-items/:id", async (req, res) => {
    try {
      const allowedKeys = ["description","quantity","unitPrice","lineTotal","notes"]; // minimal editable fields
      const partial: any = {};
      for (const key of allowedKeys) {
        if (key in req.body) partial[key] = (req.body as any)[key];
      }
      if (partial.quantity !== undefined) partial.quantity = Number(partial.quantity);
      const item = await storage.updateSalesOrderItem(req.params.id, partial);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid sales order item data", errors: error.errors });
      }
      console.error("Error updating sales order item:", error);
      res.status(500).json({ message: "Failed to update sales order item" });
    }
  });

  app.delete("/api/sales-order-items/:id", async (req, res) => {
    try {
      await storage.deleteSalesOrderItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting sales order item:", error);
      res.status(500).json({ message: "Failed to delete sales order item" });
    }
  });

  app.post("/api/sales-order-items/bulk", async (req, res) => {
    try {
      const itemsData = req.body.items;
      const validatedItems = z.array(insertSalesOrderItemSchema).parse(itemsData);
      const items = await storage.bulkCreateSalesOrderItems(validatedItems);
      res.status(201).json(items);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid sales order items data", errors: error.errors });
      }
      console.error("Error creating sales order items:", error);
      res.status(500).json({ message: "Failed to create sales order items" });
    }
  });

  // Get sales orders available for delivery (confirmed orders without complete deliveries)
  app.get("/api/sales-orders/available-for-delivery", async (req, res) => {
    try {
      // Get all sales orders (simplified version to ensure it works)
      const salesOrders = await storage.getSalesOrders(50, 0);
      // Filter for confirmed orders on the response side
      const confirmedOrders = salesOrders.filter(order => order.status === "Confirmed");
      res.json(confirmedOrders);
    } catch (error) {
      console.error("Error fetching available sales orders for delivery:", error);
      res.status(500).json({ message: "Failed to fetch available sales orders for delivery", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });
}
