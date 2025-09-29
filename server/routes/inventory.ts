import { Express } from 'express';
import { z } from 'zod';
import { insertInventoryItemSchema, insertInventoryVariantSchema, insertInventoryLevelSchema } from '../../shared/schema.js';
import { recordMovement } from '../services/stock-service.js';
import { storage } from '../storage.js';

export function registerInventoryRoutes(app: Express) {
  // ===== INVENTORY MANAGEMENT ROUTES =====

  // Inventory Items routes
  app.get("/api/inventory-items", async (req, res) => {
    try {
      const { search, supplierId, category, isActive, limit, offset } = req.query;
      const filters = {
        search: search as string,
        supplierId: supplierId as string,
        category: category as string,
        isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      const items = await storage.getInventoryItems(filters);
      res.json(items);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      res.status(500).json({ message: "Failed to fetch inventory items" });
    }
  });

  app.get("/api/inventory-items/:id", async (req, res) => {
    try {
      const item = await storage.getInventoryItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      res.status(500).json({ message: "Failed to fetch inventory item" });
    }
  });

  app.get("/api/inventory-items/supplier-code/:supplierCode", async (req, res) => {
    try {
      const item = await storage.getInventoryItemBySupplierCode(req.params.supplierCode);
      if (!item) {
        return res.status(404).json({ message: "Item not found with this supplier code" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching item by supplier code:", error);
      res.status(500).json({ message: "Failed to fetch item by supplier code" });
    }
  });

  app.get("/api/inventory-items/barcode/:barcode", async (req, res) => {
    try {
      const item = await storage.getInventoryItemByBarcode(req.params.barcode);
      if (!item) {
        return res.status(404).json({ message: "Item not found with this barcode" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching item by barcode:", error);
      res.status(500).json({ message: "Failed to fetch item by barcode" });
    }
  });

  app.post("/api/inventory-items", async (req, res) => {
    try {
      const itemData = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory item data", errors: error.errors });
      }
      console.error("Error creating inventory item:", error);
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });

  app.put("/api/inventory-items/:id", async (req, res) => {
    try {
      const itemData = insertInventoryItemSchema.partial().parse(req.body);
      const item = await storage.updateInventoryItem(req.params.id, itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory item data", errors: error.errors });
      }
      console.error("Error updating inventory item:", error);
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });

  app.delete("/api/inventory-items/:id", async (req, res) => {
    try {
      await storage.deleteInventoryItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });

  app.post("/api/inventory-items/bulk", async (req, res) => {
    try {
      const itemsData = z.array(insertInventoryItemSchema).parse(req.body);
      const items = await storage.bulkCreateInventoryItems(itemsData);
      res.status(201).json(items);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory items data", errors: error.errors });
      }
      console.error("Error bulk creating inventory items:", error);
      res.status(500).json({ message: "Failed to bulk create inventory items" });
    }
  });

  // Item Variants routes
  app.get("/api/inventory-items/:itemId/variants", async (req, res) => {
    try {
      const variants = await (storage as any).getItemVariants(req.params.itemId);
      res.json(variants);
    } catch (error) {
      console.error("Error fetching item variants:", error);
      res.status(500).json({ message: "Failed to fetch item variants" });
    }
  });

  app.post("/api/item-variants", async (req, res) => {
    try {
      const variantData = insertInventoryVariantSchema.parse(req.body);
      const variant = await (storage as any).createItemVariant(variantData);
      res.status(201).json(variant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid item variant data", errors: error.errors });
      }
      console.error("Error creating item variant:", error);
      res.status(500).json({ message: "Failed to create item variant" });
    }
  });

  app.put("/api/item-variants/:id", async (req, res) => {
    try {
      const variantData = insertInventoryVariantSchema.partial().parse(req.body);
      const variant = await (storage as any).updateItemVariant(req.params.id, variantData);
      res.json(variant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid item variant data", errors: error.errors });
      }
      console.error("Error updating item variant:", error);
      res.status(500).json({ message: "Failed to update item variant" });
    }
  });

  app.delete("/api/item-variants/:id", async (req, res) => {
    try {
      await (storage as any).deleteItemVariant(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting item variant:", error);
      res.status(500).json({ message: "Failed to delete item variant" });
    }
  });

  // Inventory Levels routes (stock management)
  app.get("/api/inventory-levels", async (req, res) => {
    try {
      const { itemId, location, lowStock } = req.query;
      const filters = {
        itemId: itemId as string,
        location: location as string,
        lowStock: lowStock === "true",
      };
      const levels = await storage.getInventoryLevels(filters);
      res.json(levels);
    } catch (error) {
      console.error("Error fetching inventory levels:", error);
      res.status(500).json({ message: "Failed to fetch inventory levels" });
    }
  });

  app.post("/api/inventory-levels", async (req, res) => {
    try {
      const inventoryData = insertInventoryLevelSchema.parse(req.body);
      const level = await storage.createInventoryLevel(inventoryData);
      res.status(201).json(level);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory level data", errors: error.errors });
      }
      console.error("Error creating inventory level:", error);
      res.status(500).json({ message: "Failed to create inventory level" });
    }
  });

  app.put("/api/inventory-levels/:id", async (req, res) => {
    try {
      const inventoryData = insertInventoryLevelSchema.partial().parse(req.body);
      const level = await storage.updateInventoryLevel(req.params.id, inventoryData);
      res.json(level);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory level data", errors: error.errors });
      }
      console.error("Error updating inventory level:", error);
      res.status(500).json({ message: "Failed to update inventory level" });
    }
  });

  app.post("/api/inventory-levels/adjust", async (req, res) => {
    try {
      const { itemId, quantityChange, location, reason, createdBy } = req.body;
      if (!itemId || !quantityChange) {
        return res.status(400).json({ message: 'itemId and quantityChange are required' });
      }
      const movement = await recordMovement({
        itemId,
        quantity: quantityChange,
        location,
        reason: reason || 'Manual adjustment',
        referenceType: 'Adjustment',
        createdBy: createdBy || 'system'
      });
      res.json({ level: movement.level, movement: movement.movement });
    } catch (error: any) {
      console.error("Error adjusting inventory quantity:", error);
      res.status(500).json({ message: error?.message || "Failed to adjust inventory quantity" });
    }
  });

  // Stock History route
  app.get("/api/inventory-items/:itemId/stock-history", async (req, res) => {
    try {
      const { limit } = req.query;
      const movements = await storage.getItemStockHistory(
        req.params.itemId,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(movements);
    } catch (error) {
      console.error("Error fetching item stock history:", error);
      res.status(500).json({ message: "Failed to fetch item stock history" });
    }
  });

  // Stock Movements routes
  app.get("/api/stock-movements", async (req, res) => {
    try {
      const { movementType, itemId, location, limit, offset } = req.query;
      const filters = {
        movementType: movementType as string,
        itemId: itemId as string,
        location: location as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      const movements = await storage.getStockMovements(filters);
      res.json(movements);
    } catch (error) {
      const err = error as any;
      console.error("Error fetching stock movements:", err?.stack || err);
      res.status(500).json({ message: "Failed to fetch stock movements", error: err?.message || String(err) });
    }
  });

  app.get("/api/stock-movements/:id", async (req, res) => {
    try {
      const movement = await storage.getStockMovement(req.params.id);
      if (!movement) {
        return res.status(404).json({ message: "Stock movement not found" });
      }
      res.json(movement);
    } catch (error) {
      console.error("Error fetching stock movement:", error);
      res.status(500).json({ message: "Failed to fetch stock movement" });
    }
  });

  app.post("/api/stock-movements", async (req, res) => {
    try {
      const movementData = {
        itemId: req.body.itemId,
        variantId: req.body.variantId,
        movementType: req.body.movementType,
        referenceType: req.body.referenceType,
        referenceId: req.body.referenceId,
        transferNumber: req.body.transferNumber,
        quantityMoved: req.body.quantityMoved,
        quantityBefore: req.body.quantityBefore,
        quantityAfter: req.body.quantityAfter,
        fromLocation: req.body.fromLocation,
        toLocation: req.body.toLocation,
        storageLocation: req.body.storageLocation,
        transferDate: req.body.transferDate,
        requestedBy: req.body.requestedBy,
        createdBy: req.body.createdBy || req.body.requestedBy || "system",
        reason: req.body.reason,
        notes: req.body.notes,
        status: req.body.status,
        unitCost: req.body.unitCost,
        totalValue: req.body.totalValue,
      };
      const movement = await storage.createStockMovement(movementData);
      res.status(201).json(movement);
    } catch (error) {
      console.error("Error creating stock movement:", error);
      res.status(500).json({ message: "Failed to create stock movement" });
    }
  });
}
