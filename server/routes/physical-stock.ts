import { Express } from 'express';
import { z } from 'zod';
import {
  insertPhysicalStockCountSchema,
  insertPhysicalStockCountItemSchema,
  insertPhysicalStockScanningSessionSchema,
  insertPhysicalStockScannedItemSchema,
  insertPhysicalStockAdjustmentSchema,
} from '../../shared/schema.js';
import { storage } from '../storage/index.js';

export function registerPhysicalStockRoutes(app: Express) {
  // ===== PHYSICAL STOCK COUNT ROUTES =====

    // GET /api/physical-stock: Return all physical stock items
    app.get("/api/physical-stock", async (req, res) => {
      try {
        const items = await storage.getAllPhysicalStockItems();
        // Map to expected frontend fields
        const mapped = (Array.isArray(items) ? items : []).map((item: any) => ({
          id: item.id,
          itemId: item.itemId,
          location: item.location,
          quantity: item.quantity,
          lastUpdated: item.lastUpdated,
          countedBy: item.countedBy || null,
          notes: item.notes || null,
        }));
        res.json(mapped);
      } catch (error) {
        console.error("Error fetching physical stock items:", error);
        res.status(500).json({ message: "Failed to fetch physical stock" });
      }
    });

    // POST /api/physical-stock: Create new physical stock entry
    app.post("/api/physical-stock", async (req, res) => {
      try {
        // Basic validation (should match frontend PhysicalStockForm)
        const { itemId, location, quantity, lastUpdated, countedBy, notes } = req.body;
        if (!itemId || !location || typeof quantity !== "number" || !lastUpdated || !countedBy) {
          return res.status(400).json({ message: "Missing required fields" });
        }
        const newItem = await storage.createPhysicalStockItem({
          itemId,
          location,
          quantity,
          lastUpdated,
          countedBy,
          notes,
        });
        res.status(201).json(newItem);
      } catch (error) {
        console.error("Error creating physical stock item:", error);
        res.status(500).json({ message: "Failed to create physical stock item" });
      }
    });

    // PUT /api/physical-stock/:id - update a physical stock entry
    app.put("/api/physical-stock/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const updateData = req.body;
        console.log('[DEBUG] PUT /api/physical-stock/' + id, { body: updateData });
       const updated = await storage.updatePhysicalStockItem(id, updateData);
        if (!updated) {
          return res.status(404).json({ message: "Physical stock item not found" });
        }
        res.json(updated);
      } catch (error) {
        console.error("Error updating physical stock item:", error);
        res.status(500).json({ message: "Failed to update physical stock item" });
      }
    });

    // DELETE /api/physical-stock/:id - delete a physical stock entry
    app.delete("/api/physical-stock/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const userId = req.header('X-User-ID');
        const success = await storage.deletePhysicalStockItem(id, userId);
        if (!success) {
          return res.status(404).json({ message: "Physical stock item not found" });
        }
        res.json({ message: "Physical stock item deleted" });
      } catch (error) {
        console.error("Error deleting physical stock item:", error);
        res.status(500).json({ message: "Failed to delete physical stock item" });
      }
    });

  // Get all physical stock items (real DB physical_stock table)
  app.get("/api/physical-stock-counts", async (req, res) => {
    try {
      const items = await storage.getAllPhysicalStockItems();
      // Map to expected frontend fields
      const mapped = (Array.isArray(items) ? items : []).map((item: any) => ({
        id: item.id,
        itemId: item.itemId,
        location: item.location,
        quantity: item.quantity,
        lastUpdated: item.lastUpdated,
      }));
      res.json(mapped);
    } catch (error) {
      console.error("Error fetching physical stock items:", error);
      res.status(500).json({ message: "Failed to fetch physical stock items" });
    }
  });

  // Get physical stock count by ID
  app.get("/api/physical-stock-counts/:id", async (req, res) => {
    try {
      const count = await storage.getPhysicalStockCountById(req.params.id);
      if (!count) {
        return res.status(404).json({ message: "Physical stock count not found" });
      }
      res.json(count);
    } catch (error) {
      console.error("Error fetching physical stock count:", error);
      res.status(500).json({ message: "Failed to fetch physical stock count" });
    }
  });

  // Get physical stock count by number
  app.get("/api/physical-stock-counts/number/:countNumber", async (req, res) => {
    try {
      const count = await storage.getPhysicalStockCountByNumber(req.params.countNumber);
      if (!count) {
        return res.status(404).json({ message: "Physical stock count not found" });
      }
      res.json(count);
    } catch (error) {
      console.error("Error fetching physical stock count:", error);
      res.status(500).json({ message: "Failed to fetch physical stock count" });
    }
  });

  // Create new physical stock count
  app.post("/api/physical-stock-counts", async (req, res) => {
    try {
      const validatedData = insertPhysicalStockCountSchema.parse(req.body);
      const count = await storage.createPhysicalStockCount(validatedData);
      res.status(201).json(count);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating physical stock count:", error);
      res.status(500).json({ message: "Failed to create physical stock count" });
    }
  });

  // Update physical stock count
  app.put("/api/physical-stock-counts/:id", async (req, res) => {
    try {
      const validatedData = insertPhysicalStockCountSchema.partial().parse(req.body);
      const userId = req.header('X-User-ID');
      const count = await storage.updatePhysicalStockCount(req.params.id, validatedData, userId);
      if (!count) {
        return res.status(404).json({ message: "Physical stock count not found" });
      }
      res.json(count);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating physical stock count:", error);
      res.status(500).json({ message: "Failed to update physical stock count" });
    }
  });

  // Delete physical stock count
  app.delete("/api/physical-stock-counts/:id", async (req, res) => {
    try {
      const userId = req.header('X-User-ID');
      const success = await storage.deletePhysicalStockCount(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ message: "Physical stock count not found" });
      }
      res.json({ message: "Physical stock count deleted successfully" });
    } catch (error) {
      console.error("Error deleting physical stock count:", error);
      res.status(500).json({ message: "Failed to delete physical stock count" });
    }
  });

  // ===== PHYSICAL STOCK COUNT ITEMS ROUTES =====

  // Get items for a physical stock count
  app.get("/api/physical-stock-counts/:id/items", async (req, res) => {
    try {
      const items = await storage.getPhysicalStockCountItems(req.params.id);
      res.json(items);
    } catch (error) {
      console.error("Error fetching physical stock count items:", error);
      res.status(500).json({ message: "Failed to fetch physical stock count items" });
    }
  });

  // Create physical stock count item
  app.post("/api/physical-stock-counts/:id/items", async (req, res) => {
    try {
      const validatedData = insertPhysicalStockCountItemSchema.parse({
        ...req.body,
        physicalStockCountId: req.params.id,
      });
      const item = await storage.createPhysicalStockCountItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating physical stock count item:", error);
      res.status(500).json({ message: "Failed to create physical stock count item" });
    }
  });

  // Update physical stock count item
  app.put("/api/physical-stock-count-items/:id", async (req, res) => {
    try {
      const validatedData = insertPhysicalStockCountItemSchema.partial().parse(req.body);
      const item = await storage.updatePhysicalStockCountItem(req.params.id, validatedData);
      if (!item) {
        return res.status(404).json({ message: "Physical stock count item not found" });
      }
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating physical stock count item:", error);
      res.status(500).json({ message: "Failed to update physical stock count item" });
    }
  });

  // Populate physical stock count with inventory items
  app.post("/api/physical-stock-counts/:id/populate", async (req, res) => {
    try {
      const { storageLocation } = req.body;
      const itemsAdded = await storage.populatePhysicalStockCountItems(req.params.id, storageLocation);
      res.json({ message: `${itemsAdded} items added to physical stock count`, itemsAdded });
    } catch (error) {
      console.error("Error populating physical stock count:", error);
      res.status(500).json({ message: "Failed to populate physical stock count" });
    }
  });

  // ===== SCANNING SESSION ROUTES =====

  // Get scanning sessions for a physical stock count
  app.get("/api/physical-stock-counts/:id/scanning-sessions", async (req, res) => {
    try {
      const sessions = await storage.getScanningSessionsByCountId(req.params.id);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching scanning sessions:", error);
      res.status(500).json({ message: "Failed to fetch scanning sessions" });
    }
  });

  // Create scanning session
  app.post("/api/physical-stock-counts/:id/scanning-sessions", async (req, res) => {
    try {
      const validatedData = insertPhysicalStockScanningSessionSchema.parse({
        ...req.body,
        physicalStockCountId: req.params.id,
      });
      const session = await storage.createScanningSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating scanning session:", error);
      res.status(500).json({ message: "Failed to create scanning session" });
    }
  });

  // Update scanning session
  app.put("/api/scanning-sessions/:id", async (req, res) => {
    try {
      const validatedData = insertPhysicalStockScanningSessionSchema.partial().parse(req.body);
      const session = await storage.updateScanningSession(req.params.id, validatedData);
      if (!session) {
        return res.status(404).json({ message: "Scanning session not found" });
      }
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating scanning session:", error);
      res.status(500).json({ message: "Failed to update scanning session" });
    }
  });

  // ===== BARCODE SCANNING ROUTES =====

  // Get scanned items for a session
  app.get("/api/scanning-sessions/:id/items", async (req, res) => {
    try {
      const items = await storage.getScannedItemsBySession(req.params.id);
      res.json(items);
    } catch (error) {
      console.error("Error fetching scanned items:", error);
      res.status(500).json({ message: "Failed to fetch scanned items" });
    }
  });

  // Process barcode scan
  app.post("/api/scanning-sessions/:id/scan", async (req, res) => {
    try {
      const { barcode, quantity = 1, storageLocation } = req.body;
      const scannedBy = req.header('X-User-ID');
      
      if (!barcode) {
        return res.status(400).json({ message: "Barcode is required" });
      }
      
      if (!scannedBy) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const result = await storage.processBarcodeScan(
        req.params.id,
        barcode,
        scannedBy,
        quantity,
        storageLocation
      );

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.json(result);
    } catch (error) {
      console.error("Error processing barcode scan:", error);
      res.status(500).json({ message: "Failed to process barcode scan" });
    }
  });

  // Add scanned item manually
  app.post("/api/scanning-sessions/:id/items", async (req, res) => {
    try {
      const validatedData = insertPhysicalStockScannedItemSchema.parse({
        ...req.body,
        scanningSessionId: req.params.id,
      });
      const item = await storage.createScannedItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating scanned item:", error);
      res.status(500).json({ message: "Failed to create scanned item" });
    }
  });

  // ===== PHYSICAL STOCK ADJUSTMENTS ROUTES =====

  // Create adjustment from physical stock count
  app.post("/api/physical-stock-counts/:id/adjustments", async (req, res) => {
    try {
      const createdBy = req.header('X-User-ID');
      const adjustment = await storage.generateAdjustmentsFromCount(req.params.id, createdBy);
      
      if (!adjustment) {
        return res.status(400).json({ message: "No adjustments needed or count not ready for adjustment" });
      }

      res.status(201).json(adjustment);
    } catch (error) {
      console.error("Error creating adjustment:", error);
      res.status(500).json({ message: "Failed to create adjustment" });
    }
  });

  // Apply physical stock adjustment
  app.post("/api/physical-stock-adjustments/:id/apply", async (req, res) => {
    try {
      const appliedBy = req.header('X-User-ID');
      
      if (!appliedBy) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const success = await storage.applyPhysicalStockAdjustment(req.params.id, appliedBy);
      
      if (!success) {
        return res.status(400).json({ message: "Adjustment could not be applied" });
      }

      res.json({ message: "Adjustment applied successfully" });
    } catch (error) {
      console.error("Error applying adjustment:", error);
      res.status(500).json({ message: "Failed to apply adjustment" });
    }
  });

  // ===== SUMMARY AND FINALIZATION ROUTES =====

  // Get physical stock count summary
  app.get("/api/physical-stock-counts/:id/summary", async (req, res) => {
    try {
      const summary = await storage.getPhysicalStockCountSummary(req.params.id);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
      res.status(500).json({ message: "Failed to fetch summary" });
    }
  });

  // Finalize physical stock count
  app.post("/api/physical-stock-counts/:id/finalize", async (req, res) => {
    try {
      const completedBy = req.header('X-User-ID');
      
      if (!completedBy) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const success = await storage.finalizePhysicalStockCount(req.params.id, completedBy);
      
      if (!success) {
        return res.status(400).json({ message: "Count could not be finalized" });
      }

      res.json({ message: "Physical stock count finalized successfully" });
    } catch (error) {
      console.error("Error finalizing count:", error);
      res.status(500).json({ message: "Failed to finalize count" });
    }
  });

  // ===== REPORTING ROUTES =====

  // Get physical stock variance report
  app.get("/api/physical-stock-counts/:id/variance-report", async (req, res) => {
    try {
      const items = await storage.getPhysicalStockCountItems(req.params.id);
      const varianceItems = items.filter((item: any) => Math.abs(item.variance || 0) > 0);
      
      const report = {
        countId: req.params.id,
        totalItems: items.length,
        varianceItems: varianceItems.length,
        totalVarianceValue: varianceItems.reduce((sum: number, item: any) => sum + parseFloat(item.varianceValue || '0'), 0),
        items: varianceItems.map((item: any) => ({
          supplierCode: item.supplierCode,
          description: item.description,
          systemQuantity: item.systemQuantity,
          physicalQuantity: item.finalCountQuantity,
          variance: item.variance,
          varianceValue: item.varianceValue,
          status: item.status,
          discrepancyReason: item.discrepancyReason,
        }))
      };

      res.json(report);
    } catch (error) {
      console.error("Error generating variance report:", error);
      res.status(500).json({ message: "Failed to generate variance report" });
    }
  });

  // Get physical stock count statistics
  app.get("/api/physical-stock-counts/:id/statistics", async (req, res) => {
    try {
      const summary = await storage.getPhysicalStockCountSummary(req.params.id);
      const count = await storage.getPhysicalStockCountById(req.params.id);
      
      if (!count) {
        return res.status(404).json({ message: "Physical stock count not found" });
      }

      const statistics = {
        ...summary,
        countDetails: {
          countNumber: count.countNumber,
          status: count.status,
          countType: count.countType,
          storageLocation: count.storageLocation,
          scheduledDate: count.scheduledDate,
          startedAt: count.startedAt,
          completedAt: count.completedAt,
        },
        progressPercentage: summary.totalItems > 0 ? Math.round((summary.countedItems / summary.totalItems) * 100) : 0,
        accuracyPercentage: summary.totalItems > 0 ? Math.round(((summary.totalItems - summary.discrepancyItems) / summary.totalItems) * 100) : 0,
      };

      res.json(statistics);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
}