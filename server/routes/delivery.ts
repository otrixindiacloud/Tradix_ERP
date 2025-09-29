import type { Express } from "express";
import { storage } from "../storage";
import { 
  insertDeliverySchema,
  insertDeliveryItemSchema
} from "@shared/schema";
import { z } from "zod";

export function registerDeliveryRoutes(app: Express) {
  // Delivery routes
  app.get("/api/deliveries", async (req, res) => {
    try {
      const { customerId, status, dateFrom, dateTo, limit, offset } = req.query;
      const filters = {
        customerId: customerId as string,
        status: status as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      const deliveries = await storage.getDeliveries(filters);
      res.json(deliveries);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      res.status(500).json({ message: "Failed to fetch deliveries" });
    }
  });

  app.get("/api/deliveries/:id", async (req, res) => {
    try {
      const delivery = await storage.getDelivery(req.params.id);
      if (!delivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
      res.json(delivery);
    } catch (error) {
      console.error("Error fetching delivery:", error);
      res.status(500).json({ message: "Failed to fetch delivery" });
    }
  });

  app.post("/api/deliveries", async (req, res) => {
    try {
      const raw = { ...req.body } as any;
      if (raw.deliveryDate && typeof raw.deliveryDate === 'string') {
        const parsedDate = new Date(raw.deliveryDate);
        if (!isNaN(parsedDate.getTime())) raw.deliveryDate = parsedDate;
      }
      if (!raw.deliveryDate) raw.deliveryDate = new Date();
      
      // Ensure salesOrderId is present
      if (!raw.salesOrderId) {
        return res.status(400).json({ message: "Sales Order ID is required" });
      }
      
      // Accept minimal payload; storage will generate deliveryNumber & default status
      if (raw.deliveryNumber === undefined) delete raw.deliveryNumber; // ensure absent so storage layer generates
      // The insertDeliverySchema is generated from an expanded deliveries table (not the delivery_note table actually used)
      // and marks deliveryNumber as required. Frontend intentionally omits deliveryNumber so storage can generate it.
      // This mismatch caused "Invalid delivery data" errors. We therefore use a relaxed schema here.
      const createDeliveryInputSchema = z.object({
        salesOrderId: z.string().uuid("Invalid sales order ID format"),
        deliveryAddress: z.string().min(1).optional(),
        deliveryNotes: z.string().optional(),
        deliveryDate: z.date().optional(),
        deliveryType: z.string().optional(),
        status: z.string().optional(), // allow callers to override if needed
      });

      const deliveryData = createDeliveryInputSchema.parse(raw);
      const delivery = await storage.createDelivery(deliveryData as any);
      res.status(201).json(delivery);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid delivery data", errors: error.errors });
      }
      console.error("Error creating delivery:", error);
      res.status(500).json({ message: "Failed to create delivery" });
    }
  });

  app.put("/api/deliveries/:id", async (req, res) => {
    try {
      const deliveryData = insertDeliverySchema.partial().parse(req.body);
      const delivery = await storage.updateDelivery(req.params.id, deliveryData);
      res.json(delivery);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid delivery data", errors: error.errors });
      }
      console.error("Error updating delivery:", error);
      res.status(500).json({ message: "Failed to update delivery" });
    }
  });

  app.delete("/api/deliveries/:id", async (req, res) => {
    try {
      await storage.deleteDelivery(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting delivery:", error);
      res.status(500).json({ message: "Failed to delete delivery" });
    }
  });

    // Delivery item operations
  app.post("/api/deliveries/:deliveryId/items", async (req, res) => {
    try {
      const itemData = { ...req.body, deliveryId: req.params.deliveryId };
      const item = await storage.createDeliveryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating delivery item:", error);
      res.status(500).json({ message: "Failed to create delivery item" });
    }
  });

  // Scan item for picking
  app.post("/api/deliveries/scan-item", async (req, res) => {
    try {
      const { barcode, sessionId, quantity, storageLocation } = req.body;
      const pickedItem = await storage.scanItemForPicking(barcode, sessionId, quantity, "system", storageLocation);
      res.json(pickedItem);
    } catch (error) {
      console.error("Error scanning item for picking:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to scan item" });
    }
  });

  // Get available items for picking
  app.get("/api/deliveries/:id/available-items", async (req, res) => {
    try {
      const items = await storage.getAvailableItemsForPicking(req.params.id);
      res.json(items);
    } catch (error) {
      console.error("Error fetching available items for picking:", error);
      res.status(500).json({ message: "Failed to fetch available items" });
    }
  });
  app.get("/api/deliveries/:deliveryId/items", async (req, res) => {
    try {
      const items = await storage.getDeliveryItems(req.params.deliveryId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching delivery items:", error);
      res.status(500).json({ message: "Failed to fetch delivery items" });
    }
  });

  app.get("/api/delivery-items/:id", async (req, res) => {
    try {
      const item = await storage.getDeliveryItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Delivery item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching delivery item:", error);
      res.status(500).json({ message: "Failed to fetch delivery item" });
    }
  });

  app.post("/api/delivery-items", async (req, res) => {
    try {
      const itemData = insertDeliveryItemSchema.parse(req.body);
      const item = await storage.createDeliveryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid delivery item data", errors: error.errors });
      }
      console.error("Error creating delivery item:", error);
      res.status(500).json({ message: "Failed to create delivery item" });
    }
  });

  app.put("/api/delivery-items/:id", async (req, res) => {
    try {
      const itemData = insertDeliveryItemSchema.partial().parse(req.body);
      const item = await storage.updateDeliveryItem(req.params.id, itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid delivery item data", errors: error.errors });
      }
      console.error("Error updating delivery item:", error);
      res.status(500).json({ message: "Failed to update delivery item" });
    }
  });

  app.delete("/api/delivery-items/:id", async (req, res) => {
    try {
      await storage.deleteDeliveryItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting delivery item:", error);
      res.status(500).json({ message: "Failed to delete delivery item" });
    }
  });

  app.post("/api/delivery-items/bulk", async (req, res) => {
    try {
      const itemsData = z.array(insertDeliveryItemSchema).parse(req.body);
      const items = await storage.bulkCreateDeliveryItems(itemsData);
      res.status(201).json(items);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid delivery items data", errors: error.errors });
      }
      console.error("Error bulk creating delivery items:", error);
      res.status(500).json({ message: "Failed to bulk create delivery items" });
    }
  });

  // Delivery management actions
  app.post("/api/deliveries/:id/start-picking", async (req, res) => {
    try {
      const { userId } = req.body;
      const delivery = await storage.startDeliveryPicking(req.params.id, userId);
      res.json(delivery);
    } catch (error) {
      console.error("Error starting delivery picking:", error);
      res.status(500).json({ message: "Failed to start delivery picking" });
    }
  });

  app.post("/api/deliveries/:id/complete-picking", async (req, res) => {
    try {
      const { userId, notes } = req.body;
      const delivery = await storage.completeDeliveryPicking(req.params.id, userId, notes);
      res.json(delivery);
    } catch (error) {
      console.error("Error completing delivery picking:", error);
      res.status(500).json({ message: "Failed to complete delivery picking" });
    }
  });

  app.post("/api/deliveries/:id/confirm", async (req, res) => {
    try {
      const { confirmedBy, signature } = req.body;
      const delivery = await storage.confirmDelivery(req.params.id, confirmedBy, signature);
      res.json(delivery);
    } catch (error) {
      console.error("Error confirming delivery:", error);
      res.status(500).json({ message: "Failed to confirm delivery" });
    }
  });

  // Delivery Notes routes (aliases to delivery routes for UI consistency)
  app.get("/api/delivery-notes", async (req, res) => {
    try {
      // Accept both legacy limit/offset and page/pageSize params
      const { customerId, status, dateFrom, dateTo, limit, offset, search, page, pageSize, salesOrderId } = req.query as any;

      let resolvedLimit: number | undefined = limit ? parseInt(limit, 10) : undefined;
      let resolvedOffset: number | undefined = offset ? parseInt(offset, 10) : undefined;

      if (pageSize) {
        const ps = parseInt(pageSize, 10);
        if (!isNaN(ps)) resolvedLimit = ps;
      }
      if (page) {
        const pg = parseInt(page, 10);
        if (!isNaN(pg) && resolvedLimit) {
          resolvedOffset = (pg - 1) * resolvedLimit;
        }
      }

      const filters = {
        status: status as string,
        salesOrderId: salesOrderId as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        limit: resolvedLimit,
        offset: resolvedOffset,
        search: (search as string) || undefined
      };
      const deliveries = await storage.getDeliveries(filters);
      res.json(deliveries);
    } catch (error) {
      console.error("Error fetching delivery notes:", error);
      res.status(500).json({ message: "Failed to fetch delivery notes" });
    }
  });

  app.get("/api/delivery-notes/:id", async (req, res) => {
    try {
      const delivery = await storage.getDelivery(req.params.id);
      if (!delivery) {
        return res.status(404).json({ message: "Delivery note not found" });
      }
      res.json(delivery);
    } catch (error) {
      console.error("Error fetching delivery note:", error);
      res.status(500).json({ message: "Failed to fetch delivery note" });
    }
  });

  app.post("/api/delivery-notes", async (req, res) => {
    try {
      const raw = { ...req.body } as any;
      if (raw.deliveryDate && typeof raw.deliveryDate === 'string') {
        const parsedDate = new Date(raw.deliveryDate);
        if (!isNaN(parsedDate.getTime())) raw.deliveryDate = parsedDate;
      }
      if (!raw.deliveryDate) raw.deliveryDate = new Date();

      const validated = insertDeliverySchema.parse(raw);
      const delivery = await storage.createDelivery(validated);
      res.json(delivery);
    } catch (error) {
      console.error("Error creating delivery note:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create delivery note" });
    }
  });

  app.patch("/api/delivery-notes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const raw = { ...req.body } as any;

      // Validate ID format
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: "Invalid delivery ID format" });
      }

      // Handle date parsing
      if (raw.deliveryDate && typeof raw.deliveryDate === 'string') {
        const parsedDate = new Date(raw.deliveryDate);
        if (!isNaN(parsedDate.getTime())) {
          raw.deliveryDate = parsedDate;
        } else {
          delete raw.deliveryDate; // Remove invalid date
        }
      }

      // Handle other timestamp fields
      const timestampFields = ['pickingStartedAt', 'pickingCompletedAt', 'deliveryConfirmedAt', 'actualDeliveryDate', 'estimatedDeliveryDate'];
      timestampFields.forEach(field => {
        if (raw[field] && typeof raw[field] === 'string') {
          const parsedDate = new Date(raw[field]);
          if (!isNaN(parsedDate.getTime())) {
            raw[field] = parsedDate;
          } else {
            delete raw[field]; // Remove invalid date
          }
        }
      });

      console.log('PATCH /api/delivery-notes/:id', { id, body: raw });

      const delivery = await storage.updateDelivery(id, raw);
      res.json(delivery);
    } catch (error) {
      console.error("Error updating delivery note:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ 
        message: "Failed to update delivery note",
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      });
    }
  });

  app.delete("/api/delivery-notes/:id", async (req, res) => {
    try {
      await storage.deleteDelivery(req.params.id);
      res.json({ message: "Delivery note deleted successfully" });
    } catch (error) {
      console.error("Error deleting delivery note:", error);
      res.status(500).json({ message: "Failed to delete delivery note" });
    }
  });
}
