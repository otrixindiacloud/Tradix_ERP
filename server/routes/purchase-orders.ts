import type { Express } from "express";
import { storage } from "../storage";
import { 
  insertPurchaseOrderSchema,
  insertPoLineItemSchema,
  insertAcceptanceConfirmationSchema
} from "@shared/schema";
import { z } from "zod";

export function registerPurchaseOrderRoutes(app: Express) {
  // Purchase Order routes
  app.get("/api/purchase-orders", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const quotationId = req.query.quotationId as string;
      const filters = quotationId ? { quotationId } : {};
      // Current storage API only supports optional quotationId filtering
      const orders = await storage.getPurchaseOrders(quotationId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      res.status(500).json({ message: "Failed to fetch purchase orders" });
    }
  });

  app.get("/api/purchase-orders/:id", async (req, res) => {
    try {
      const order = await storage.getPurchaseOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Purchase order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching purchase order:", error);
      res.status(500).json({ message: "Failed to fetch purchase order" });
    }
  });

  app.post("/api/purchase-orders", async (req, res) => {
    try {
      console.log('[PO] Create payload raw:', req.body);
  const parsed = insertPurchaseOrderSchema.parse(req.body);
  const orderData = { ...parsed, poDate: new Date(parsed.poDate) } as any;
      console.log('[PO] Parsed orderData:', orderData);

      // Validation: quotation must exist & be Accepted
      const quotation = await storage.getQuotation(orderData.quotationId);
      if (!quotation) {
        return res.status(400).json({ message: "Quotation not found for purchase order" });
      }
      if (quotation.status !== 'Accepted') {
        return res.status(400).json({ message: "Quotation must be Accepted before creating a Purchase Order" });
      }

      // Ensure at least one accepted quotation item exists
      let hasAcceptedItem = false;
      const acceptances = await storage.getCustomerAcceptances(orderData.quotationId);
      for (const acc of acceptances) {
        const itemAcceptances = await storage.getQuotationItemAcceptances(acc.id);
        if (itemAcceptances.some((i: any) => i.isAccepted)) {
          hasAcceptedItem = true;
          break;
        }
      }
      if (!hasAcceptedItem) {
        return res.status(400).json({ message: "No accepted quotation items found; cannot create Purchase Order" });
      }

      const order = await storage.createPurchaseOrder(orderData);
      console.log('[PO] Created order id:', order.id);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid purchase order data", errors: error.errors });
      }
      console.error("Error creating purchase order:", error);
      res.status(500).json({ message: "Failed to create purchase order", error: (error as any)?.message });
    }
  });

  app.put("/api/purchase-orders/:id", async (req, res) => {
    try {
      const orderData = insertPurchaseOrderSchema.partial().parse(req.body);
      const order = await storage.updatePurchaseOrder(req.params.id, orderData);
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid purchase order data", errors: error.errors });
      }
      console.error("Error updating purchase order:", error);
      res.status(500).json({ message: "Failed to update purchase order" });
    }
  });

  app.delete("/api/purchase-orders/:id", async (req, res) => {
    try {
      await storage.deletePurchaseOrder(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting purchase order:", error);
      res.status(500).json({ message: "Failed to delete purchase order" });
    }
  });

  app.post("/api/purchase-orders/:id/validate", async (req, res) => {
    try {
      const validationSchema = z.object({
        status: z.enum(["Valid", "Invalid", "Requires Review"]),
        notes: z.string().optional(),
        validatedBy: z.string().min(1, "Validator ID is required"),
      });

      const validationData = validationSchema.parse(req.body);
      const order = await storage.validatePurchaseOrder(req.params.id, validationData);
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid validation data", errors: error.errors });
      }
      console.error("Error validating purchase order:", error);
      res.status(500).json({ message: "Failed to validate purchase order" });
    }
  });

  // PO Line Items routes
  app.get("/api/purchase-orders/:poId/line-items", async (req, res) => {
    try {
      const lineItems = await storage.getPoLineItems(req.params.poId);
      res.json(lineItems);
    } catch (error) {
      console.error("Error fetching PO line items:", error);
      res.status(500).json({ message: "Failed to fetch PO line items" });
    }
  });

  app.post("/api/purchase-orders/:poId/line-items", async (req, res) => {
    try {
      const lineItemData = insertPoLineItemSchema.parse({
        ...req.body,
        purchaseOrderId: req.params.poId,
      });
      const lineItem = await storage.createPoLineItem(lineItemData);
      res.status(201).json(lineItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid PO line item data", errors: error.errors });
      }
      console.error("Error creating PO line item:", error);
      res.status(500).json({ message: "Failed to create PO line item" });
    }
  });

  app.post("/api/purchase-orders/:poId/line-items/bulk", async (req, res) => {
    try {
      const lineItems = req.body.map((item: any) => 
        insertPoLineItemSchema.parse({
          ...item,
          purchaseOrderId: req.params.poId,
        })
      );
      const results = await storage.bulkCreatePoLineItems(lineItems);
      res.status(201).json(results);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid PO line item data", errors: error.errors });
      }
      console.error("Error creating PO line items:", error);
      res.status(500).json({ message: "Failed to create PO line items" });
    }
  });

  // Customer PO Upload route
  app.post("/api/customer-po-upload", async (req, res) => {
    try {
  const { quotationId, documentPath, documentName, documentType, uploadedBy, poDate, currency, paymentTerms, deliveryTerms, specialInstructions, customerReference } = req.body;

      // Basic presence validation (uploadedBy handled specially below)
      const missing: string[] = [];
      if (!quotationId) missing.push('quotationId');
      if (!documentPath) missing.push('documentPath');
      if (!documentName) missing.push('documentName');
      if (!documentType) missing.push('documentType');
      if (missing.length) {
        return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
      }

      // Resolve / validate uploadedBy
      let resolvedUploadedBy: string | undefined = uploadedBy;
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
      if (!resolvedUploadedBy || !uuidRegex.test(resolvedUploadedBy)) {
        // Attempt lightweight fallback: look for an environment-provided SYSTEM_USER_ID
        if (process.env.SYSTEM_USER_ID && uuidRegex.test(process.env.SYSTEM_USER_ID)) {
          resolvedUploadedBy = process.env.SYSTEM_USER_ID;
        }
        // As a final fallback, leave undefined to trigger error below
      }
      if (!resolvedUploadedBy) {
        // Hardcoded system user fallback (present in seed data)
        const seedSystemUser = 'e459998e-0a4d-4652-946e-44b2ba161d16';
        if (uuidRegex.test(seedSystemUser)) {
          resolvedUploadedBy = seedSystemUser;
        } else {
          return res.status(400).json({ message: 'Unable to resolve uploadedBy user' });
        }
      }

      const quotation = await storage.getQuotation(quotationId);
      if (!quotation) {
        return res.status(400).json({ message: 'Quotation not found' });
      }
      // Removed: allow PO upload for any quotation status

      // Basic accepted items check (same as create route) – relaxed: allow if quotation itself is Accepted
      let hasAcceptedItem = false;
      try {
        const acceptances = await storage.getCustomerAcceptances(quotationId);
        for (const acc of acceptances) {
          const itemAcceptances = await storage.getQuotationItemAcceptances(acc.id);
          if (itemAcceptances.some((i: any) => i.isAccepted)) { hasAcceptedItem = true; break; }
        }
      } catch (e) {
        console.warn('Acceptance lookup failed (continuing):', e);
      }
      if (!hasAcceptedItem && quotation.status !== 'Accepted') {
        return res.status(400).json({ message: 'No accepted quotation items found; cannot upload PO' });
      }

      // Auto-generate PO number
  const poNumber = (storage as any).generateNumber ? (storage as any).generateNumber('PO') : `PO-${Date.now()}`;
      const poPayload = insertPurchaseOrderSchema.parse({
        quotationId,
        poNumber,
        poDate: poDate ? new Date(poDate) : new Date(),
        documentPath,
        documentName,
        documentType,
        uploadedBy: resolvedUploadedBy,
        currency: currency || 'BHD',
        paymentTerms: paymentTerms || undefined,
        deliveryTerms: deliveryTerms || undefined,
        specialInstructions: specialInstructions || undefined,
        customerReference: customerReference || undefined,
      });

      const purchaseOrder = await storage.createPurchaseOrder(poPayload);
      res.status(201).json(purchaseOrder);
    } catch (error) {
      console.error("Error uploading PO:", error);
      res.status(500).json({ message: "Failed to upload PO" });
    }
  });

  // Acceptance Confirmation routes
  app.get("/api/customer-acceptances/:acceptanceId/confirmations", async (req, res) => {
    try {
      const confirmations = await storage.getAcceptanceConfirmations(req.params.acceptanceId);
      res.json(confirmations);
    } catch (error) {
      console.error("Error fetching acceptance confirmations:", error);
      res.status(500).json({ message: "Failed to fetch acceptance confirmations" });
    }
  });

  app.post("/api/customer-acceptances/:acceptanceId/confirmations", async (req, res) => {
    try {
      const confirmationData = insertAcceptanceConfirmationSchema.parse({
        ...req.body,
        customerAcceptanceId: req.params.acceptanceId,
      });
      const confirmation = await storage.createAcceptanceConfirmation(confirmationData);
      res.status(201).json(confirmation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid acceptance confirmation data", errors: error.errors });
      }
      console.error("Error creating acceptance confirmation:", error);
      res.status(500).json({ message: "Failed to create acceptance confirmation" });
    }
  });
}
