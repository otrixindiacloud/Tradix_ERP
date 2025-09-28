import { Router } from "express";
import { ReceiptReturnsStorage } from "../storage/receipt-returns-storage";

const router = Router();
const storage = new ReceiptReturnsStorage();

// GET /api/receipt-returns
router.get("/", async (req, res) => {
  try {
    const returns = await storage.getAllReturns();
    res.json(returns);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch receipt returns" });
  }
});

// GET /api/receipt-returns/:id
router.get("/:id", async (req, res) => {
  try {
    const returnItem = await storage.getReturnById(req.params.id);
    if (!returnItem) return res.status(404).json({ message: "Return not found" });
    res.json(returnItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch return" });
  }
});

// POST /api/receipt-returns
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    // Map frontend verbose statuses to compact internal values (schema uses plain varchar with default 'pending')
    const statusMap: Record<string, string> = {
      Draft: "pending",
      "Pending Approval": "pending",
      Approved: "approved",
      Returned: "returned",
      Credited: "credited",
    };
    const normalizedStatus = statusMap[body.status] || body.status;
    // Whitelist only valid columns for supplier_returns
    const payload: any = {
      returnNumber: body.returnNumber,
      supplierId: body.supplierId,
      goodsReceiptId: body.goodsReceiptId,
      returnReason: body.returnReason,
      notes: body.notes,
    };
    if (body.returnDate) {
      // Accept 'YYYY-MM-DD' and convert to Date
      payload.returnDate = /\d{4}-\d{2}-\d{2}$/.test(body.returnDate)
        ? new Date(body.returnDate)
        : body.returnDate;
    }
    if (normalizedStatus) payload.status = normalizedStatus;

    // Basic validation
    const missing = ["returnNumber", "returnReason"].filter(k => !payload[k]);
    if (missing.length) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
    }
    const returnItem = await storage.createReturn(payload);
    res.json(returnItem);
  } catch (err: any) {
    console.error("Failed to create return:", err?.code, err?.message, err);
    if (err?.code === "23505") { // unique_violation
      return res.status(400).json({ message: "Return number already exists" });
    }
    res.status(500).json({ message: "Failed to create return" });
  }
});

// GET /api/receipt-returns/:id/items - list items for a return
router.get("/:id/items", async (req, res) => {
  try {
    const items = await storage.getReturnItems(req.params.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch return items" });
  }
});

// POST /api/receipt-returns/:id/items - create item for a return
router.post("/:id/items", async (req, res) => {
  try {
    const supplierReturnId = req.params.id;
    const body = req.body || {};
    // Map client payload (itemId) to inventoryItemId expected by schema
    const data = {
      supplierReturnId,
      inventoryItemId: body.itemId || body.inventoryItemId,
      quantityReturned: body.quantityReturned || body.returnQuantity || 0,
      unitCost: body.unitCost ?? 0,
      totalCost: body.totalCost ?? 0,
      returnReason: body.returnReason,
      conditionNotes: body.conditionNotes,
    };
    const created = await storage.createReturnItem(data);
    res.json(created);
  } catch (err) {
    res.status(500).json({ message: "Failed to create return item" });
  }
});

// PUT /api/receipt-returns/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await storage.updateReturn(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Return not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update return" });
  }
});

// DELETE /api/receipt-returns/:id
router.delete("/:id", async (req, res) => {
  try {
    await storage.deleteReturn(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete return" });
  }
});

export default router;