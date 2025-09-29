import type { Express } from "express";
import { storage } from "../storage";
import { insertSupplierSchema } from "@shared/schema";
import { z } from "zod";

export function registerSupplierRoutes(app: Express) {
  // Get all suppliers
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  // Get single supplier
  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const supplier = await storage.getSupplier(req.params.id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      console.error("Error fetching supplier:", error);
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });

  // Create supplier
  app.post("/api/suppliers", async (req, res) => {
    try {
      const supplierData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(supplierData);
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supplier data", errors: error.errors });
      }
      console.error("Error creating supplier:", error);
      res.status(500).json({ message: "Failed to create supplier" });
    }
  });

  // Update supplier
  app.put("/api/suppliers/:id", async (req, res) => {
    try {
      const supplierData = insertSupplierSchema.partial().parse(req.body);
      const supplier = await storage.updateSupplier(req.params.id, supplierData);
      res.json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supplier data", errors: error.errors });
      }
      console.error("Error updating supplier:", error);
      res.status(500).json({ message: "Failed to update supplier" });
    }
  });

  // Delete supplier (soft delete)
  app.delete("/api/suppliers/:id", async (req, res) => {
    try {
      await storage.deleteSupplier(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      res.status(500).json({ message: "Failed to delete supplier" });
    }
  });

  // Get supplier details (enhanced with stats and activities)
  app.get("/api/suppliers/:id/details", async (req, res) => {
    try {
      console.log('DEBUG: Route called - supplier details for ID:', req.params.id);
      console.log('DEBUG: Storage object type:', typeof storage);
      console.log('DEBUG: getSupplierDetails method type:', typeof storage.getSupplierDetails);
      
      if (typeof storage.getSupplierDetails !== 'function') {
        console.log('DEBUG: getSupplierDetails is not a function!');
        return res.status(500).json({ message: "Storage method not available" });
      }
      
      const details = await storage.getSupplierDetails(req.params.id);
      console.log('DEBUG: Storage method result:', details ? 'success' : 'null');
      
      if (!details) {
        console.log('DEBUG: Returning 404 - supplier not found');
        return res.status(404).json({ message: "Supplier not found" });
      }
      
      console.log('DEBUG: Returning details');
      res.json(details);
    } catch (error) {
      console.error("Error fetching supplier details:", error);
      res.status(500).json({ message: "Failed to fetch supplier details" });
    }
  });

  // Get supplier LPOs with pagination
  app.get("/api/suppliers/:id/lpos", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const lpos = await storage.getSupplierLposForDetail(req.params.id, page, limit);
      res.json(lpos);
    } catch (error) {
      console.error("Error fetching supplier LPOs:", error);
      res.status(500).json({ message: "Failed to fetch supplier LPOs" });
    }
  });

  // Get supplier items with pagination
  app.get("/api/suppliers/:id/items", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const items = await storage.getSupplierItems(req.params.id, page, limit);
      res.json(items);
    } catch (error) {
      console.error("Error fetching supplier items:", error);
      res.status(500).json({ message: "Failed to fetch supplier items" });
    }
  });

  // Get supplier goods receipts with pagination
  app.get("/api/suppliers/:id/goods-receipts", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const receipts = await storage.getSupplierGoodsReceipts(req.params.id, page, limit);
      res.json(receipts);
    } catch (error) {
      console.error("Error fetching supplier goods receipts:", error);
      res.status(500).json({ message: "Failed to fetch supplier goods receipts" });
    }
  });

  // Get supplier performance metrics
  app.get("/api/suppliers/:id/performance", async (req, res) => {
    try {
      const metrics = await storage.getSupplierPerformanceMetrics(req.params.id);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching supplier performance metrics:", error);
      res.status(500).json({ message: "Failed to fetch supplier performance metrics" });
    }
  });
}
