import { Router } from "express";
import { InventoryItemsStorage } from "../storage/inventory-items-storage";

const router = Router();
const storage = new InventoryItemsStorage();

// GET /api/inventory-items
router.get("/", async (req, res) => {
  try {
    const items = await storage.getAllItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch inventory items" });
  }
});

// POST /api/inventory-items
router.post("/", async (req, res) => {
  try {
    const item = await storage.createItem(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to create item" });
  }
});

// PUT /api/inventory-items/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await storage.updateItem(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update item" });
  }
});

export default router;
