import type { Express } from "express";
import { storage } from "../storage";
import { 
  insertCreditNoteSchema,
  insertCreditNoteItemSchema
} from "@shared/schema";
import { z } from "zod";

export function registerCreditNoteRoutes(app: Express) {
  // Credit Note routes
  app.get("/api/credit-notes", async (req, res) => {
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
      const creditNotes = await storage.getCreditNotes(filters);
      res.json(creditNotes);
    } catch (error) {
      console.error("Error fetching credit notes:", error);
      res.status(500).json({ message: "Failed to fetch credit notes" });
    }
  });

  app.get("/api/credit-notes/:id", async (req, res) => {
    try {
      const creditNote = await storage.getCreditNote(req.params.id);
      if (!creditNote) {
        return res.status(404).json({ message: "Credit note not found" });
      }
      res.json(creditNote);
    } catch (error) {
      console.error("Error fetching credit note:", error);
      res.status(500).json({ message: "Failed to fetch credit note" });
    }
  });

  app.post("/api/credit-notes", async (req, res) => {
    try {
      const creditNoteData = insertCreditNoteSchema.parse(req.body);
      const creditNote = await storage.createCreditNote(creditNoteData);
      res.status(201).json(creditNote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid credit note data", errors: error.errors });
      }
      console.error("Error creating credit note:", error);
      res.status(500).json({ message: "Failed to create credit note" });
    }
  });

  app.put("/api/credit-notes/:id", async (req, res) => {
    try {
      const creditNoteData = insertCreditNoteSchema.partial().parse(req.body);
      const creditNote = await storage.updateCreditNote(req.params.id, creditNoteData);
      res.json(creditNote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid credit note data", errors: error.errors });
      }
      console.error("Error updating credit note:", error);
      res.status(500).json({ message: "Failed to update credit note" });
    }
  });

  app.delete("/api/credit-notes/:id", async (req, res) => {
    try {
      await storage.deleteCreditNote(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting credit note:", error);
      res.status(500).json({ message: "Failed to delete credit note" });
    }
  });

  // Credit Note Items routes
  app.get("/api/credit-notes/:creditNoteId/items", async (req, res) => {
    try {
      const items = await storage.getCreditNoteItems(req.params.creditNoteId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching credit note items:", error);
      res.status(500).json({ message: "Failed to fetch credit note items" });
    }
  });

  app.post("/api/credit-note-items", async (req, res) => {
    try {
      const itemData = insertCreditNoteItemSchema.parse(req.body);
      const item = await storage.createCreditNoteItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid credit note item data", errors: error.errors });
      }
      console.error("Error creating credit note item:", error);
      res.status(500).json({ message: "Failed to create credit note item" });
    }
  });

  app.post("/api/credit-note-items/bulk", async (req, res) => {
    try {
      const itemsData = z.array(insertCreditNoteItemSchema).parse(req.body);
      const items = await storage.bulkCreateCreditNoteItems(itemsData);
      res.status(201).json(items);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid credit note items data", errors: error.errors });
      }
      console.error("Error bulk creating credit note items:", error);
      res.status(500).json({ message: "Failed to bulk create credit note items" });
    }
  });

  // Generate credit note from return
  app.post("/api/credit-notes/generate-from-return", async (req, res) => {
    try {
      const { invoiceId, returnItems, reason, userId } = req.body;
      const creditNote = await storage.generateCreditNoteFromReturn(invoiceId, returnItems, reason, userId);
      res.status(201).json(creditNote);
    } catch (error) {
      console.error("Error generating credit note from return:", error);
      res.status(500).json({ message: "Failed to generate credit note from return" });
    }
  });

  // Apply credit note
  app.post("/api/credit-notes/:id/apply", async (req, res) => {
    try {
      const { appliedAmount, userId } = req.body;
      const creditNote = await storage.applyCreditNote(req.params.id, appliedAmount, userId);
      res.json(creditNote);
    } catch (error) {
      console.error("Error applying credit note:", error);
      res.status(500).json({ message: "Failed to apply credit note" });
    }
  });
}
