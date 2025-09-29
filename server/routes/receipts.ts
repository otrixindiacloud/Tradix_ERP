
import { Router } from "express";
import { ReceiptsStorage } from "../storage/receipts-storage";
import { ZodError } from "zod";

const router = Router();
const storage = new ReceiptsStorage();

// GET /api/receipts
router.get("/", async (req, res) => {
  try {
    const receipts = await storage.getAllReceipts();
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch receipts" });
  }
});

// POST /api/receipts
router.post("/", async (req, res) => {
  try {
    const receipt = await storage.createReceipt(req.body);
    res.json(receipt);
  } catch (err) {
    if (err instanceof ZodError) {
      // Zod validation error
      res.status(400).json({ message: "Validation error", details: err.errors });
    } else {
      res.status(500).json({ message: "Failed to create receipt", error: err instanceof Error ? err.message : String(err) });
    }
  }
});

// PUT /api/receipts/:id
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await storage.updateReceipt(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Receipt not found" });
    }
    res.json(updated);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ message: "Validation error", details: err.errors });
    } else {
      res.status(500).json({ message: "Failed to update receipt", error: err instanceof Error ? err.message : String(err) });
    }
  }
});

export default router;
