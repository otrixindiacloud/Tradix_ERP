import { Router } from "express";
import { storage } from "../storage/index.js";
import { insertRequisitionSchema, insertRequisitionItemSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

// Get all requisitions with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const { 
      page = "1", 
      limit = "20", 
      status, 
      priority, 
      department, 
      dateFrom, 
      dateTo, 
      search 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;
    
    const filters = {
      status: status as string,
      priority: priority as string,
      department: department as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      search: search as string
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof typeof filters] === undefined || filters[key as keyof typeof filters] === '') {
        delete filters[key as keyof typeof filters];
      }
    });
    
    const requisitions = await storage.getRequisitions(limitNum, offset, filters);
    const total = await storage.getRequisitionsCount(filters);
    
    res.json({
      data: requisitions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error("Error getting requisitions:", error);
    res.status(500).json({ 
      message: "Failed to get requisitions",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get requisition by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const requisition = await storage.getRequisition(id);
    
    if (!requisition) {
      return res.status(404).json({ message: "Requisition not found" });
    }
    
    res.json(requisition);
  } catch (error) {
    console.error("Error getting requisition:", error);
    res.status(500).json({ 
      message: "Failed to get requisition",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get requisition items
router.get("/:id/items", async (req, res) => {
  try {
    const { id } = req.params;
    const items = await storage.getRequisitionItems(id);
    res.json(items);
  } catch (error) {
    console.error("Error getting requisition items:", error);
    res.status(500).json({ 
      message: "Failed to get requisition items",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Create new requisition
router.post("/", async (req, res) => {
  try {
    const validatedData = insertRequisitionSchema.parse(req.body);
    const requisition = await storage.createRequisition(validatedData);
    res.status(201).json(requisition);
  } catch (error) {
    console.error("Error creating requisition:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors
      });
    }
    res.status(500).json({ 
      message: "Failed to create requisition",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Update requisition
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = insertRequisitionSchema.partial().parse(req.body);
    const requisition = await storage.updateRequisition(id, validatedData);
    res.json(requisition);
  } catch (error) {
    console.error("Error updating requisition:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors
      });
    }
    res.status(500).json({ 
      message: "Failed to update requisition",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Delete requisition
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.deleteRequisition(id);
    
    if (!success) {
      return res.status(404).json({ message: "Requisition not found" });
    }
    
    res.json({ message: "Requisition deleted successfully" });
  } catch (error) {
    console.error("Error deleting requisition:", error);
    res.status(500).json({ 
      message: "Failed to delete requisition",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Create requisition item
router.post("/:id/items", async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = insertRequisitionItemSchema.parse({
      ...req.body,
      requisitionId: id
    });
    const item = await storage.createRequisitionItem(validatedData);
    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating requisition item:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors
      });
    }
    res.status(500).json({ 
      message: "Failed to create requisition item",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Update requisition item
router.put("/items/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const validatedData = insertRequisitionItemSchema.partial().parse(req.body);
    const item = await storage.updateRequisitionItem(itemId, validatedData);
    res.json(item);
  } catch (error) {
    console.error("Error updating requisition item:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors
      });
    }
    res.status(500).json({ 
      message: "Failed to update requisition item",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Delete requisition item
router.delete("/items/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const success = await storage.deleteRequisitionItem(itemId);
    
    if (!success) {
      return res.status(404).json({ message: "Requisition item not found" });
    }
    
    res.json({ message: "Requisition item deleted successfully" });
  } catch (error) {
    console.error("Error deleting requisition item:", error);
    res.status(500).json({ 
      message: "Failed to delete requisition item",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Search requisitions
router.get("/search/:searchTerm", async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const requisitions = await storage.searchRequisitions(searchTerm);
    res.json(requisitions);
  } catch (error) {
    console.error("Error searching requisitions:", error);
    res.status(500).json({ 
      message: "Failed to search requisitions",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;