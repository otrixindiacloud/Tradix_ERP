import { Router } from "express";
import { storage } from "../storage/index.js";
import { insertRequisitionSchema, insertRequisitionItemSchema } from "@shared/schema";
import { z } from "zod";

/**
 * Material Requests Routes (Alias of Requisitions)
 * ------------------------------------------------
 * The UI page /material-requests consumes this API. Internally we reuse the
 * richer requisitions + requisition_items data model instead of the older
 * minimal material_request table. This file exposes a domain-specific alias
 * while keeping business logic in the requisition storage layer.
 *
 * Enhancements:
 * - GET /api/material-requests?include=items will embed items[] for each record
 * - GET /api/material-requests/:id always returns { ...header, items: [] }
 * - POST already creates items in a loop (idempotent/validated)
 */

const router = Router();
console.log('[routes] material-requests alias router initializing');

// Get all material requests
router.get("/", async (req, res) => {
  try {
    const { page = "1", limit = "20", status, priority, department, dateFrom, dateTo, search, include } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;
    const filters: Record<string, any> = { status, priority, department, dateFrom, dateTo, search };
    Object.keys(filters).forEach(key => { if (filters[key] === undefined) delete filters[key]; });

    const requests = await storage.getRequisitions(limitNum, offset, filters);

    if (include === 'items') {
      // Attach items for each requisition (note: simple N+1 approach; optimize later if needed)
      const withItems = await Promise.all(requests.map(async (r: any) => {
        try {
          const items = await storage.getRequisitionItems(r.id);
          return { ...r, items };
        } catch {
          return { ...r, items: [] };
        }
      }));
      return res.json(withItems);
    }

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch material requests", error });
  }
});

// Get single material request
router.get("/:id", async (req, res) => {
  try {
    const request = await storage.getRequisition(req.params.id);
    if (!request) return res.status(404).json({ message: "Material request not found" });
    let items = [] as any[];
    try {
      items = await storage.getRequisitionItems(req.params.id);
    } catch (e) {
      items = [];
    }
    res.json({ ...request, items });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch material request", error });
  }
});

// Create new material request
router.post("/", async (req, res) => {
  try {
    const { items = [], ...header } = req.body || {};

    // Auto compute total if not provided
    if (!header.totalEstimatedCost && Array.isArray(items)) {
      header.totalEstimatedCost = items.reduce((sum: number, it: any) => sum + (Number(it.quantity) * Number(it.estimatedCost || 0)), 0);
    }

    // Ensure requiredDate is present (frontend sends string)
    if (header.requiredDate && typeof header.requiredDate !== 'string') {
      header.requiredDate = new Date(header.requiredDate).toISOString();
    }

    const validatedData = insertRequisitionSchema.parse(header);
    const created = await storage.createRequisition(validatedData);

    // Create items if provided
    const createdItems = [] as any[];
    for (const item of items) {
      try {
        const parsedItem = insertRequisitionItemSchema.parse({ ...item, requisitionId: created.id });
        const saved = await storage.createRequisitionItem(parsedItem);
        createdItems.push(saved);
      } catch (e) {
        console.error('Failed to create requisition item', e);
      }
    }

    // Return with items
    res.status(201).json({ ...created, items: createdItems });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid material request data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create material request", error });
  }
});

// Update material request
router.put("/:id", async (req, res) => {
  try {
    const validatedData = insertRequisitionSchema.partial().parse(req.body);
    const updated = await storage.updateRequisition(req.params.id, validatedData);
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid material request data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to update material request", error });
  }
});

// Delete material request
router.delete("/:id", async (req, res) => {
  try {
    const success = await storage.deleteRequisition(req.params.id);
    if (!success) return res.status(404).json({ message: "Material request not found" });
    res.json({ message: "Material request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete material request", error });
  }
});

// Get items for a material request
router.get("/:id/items", async (req, res) => {
  try {
    const items = await storage.getRequisitionItems(req.params.id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch request items", error });
  }
});

// Add item to a material request
router.post("/:id/items", async (req, res) => {
  try {
    const validatedData = insertRequisitionItemSchema.parse({ ...req.body, requisitionId: req.params.id });
    const created = await storage.createRequisitionItem(validatedData);
    res.status(201).json(created);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid request item data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to add request item", error });
  }
});

// Update item in a material request
router.put("/:id/items/:itemId", async (req, res) => {
  try {
    const validatedData = insertRequisitionItemSchema.partial().parse(req.body);
    const updated = await storage.updateRequisitionItem(req.params.itemId, validatedData);
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid request item data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to update request item", error });
  }
});

// Delete item from a material request
router.delete("/:id/items/:itemId", async (req, res) => {
  try {
    const success = await storage.deleteRequisitionItem(req.params.itemId);
    if (!success) return res.status(404).json({ message: "Request item not found" });
    res.json({ message: "Request item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete request item", error });
  }
});

export default router;
