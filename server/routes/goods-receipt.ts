import type { Express } from "express";
import { storage } from "../storage";
import { receiveStock } from "../services/stock-service.js";
import { 
  insertGoodsReceiptHeaderSchema,
  insertGoodsReceiptItemSchema,
  insertScanningSessionSchema,
  insertScannedItemSchema,
  insertSupplierReturnSchema,
  insertSupplierReturnItemSchema
} from "@shared/schema";
import { z } from "zod";

export function registerGoodsReceiptRoutes(app: Express) {
  // Batch create goods receipt header and items
  app.post("/api/goods-receipts", async (req, res) => {
    try {
      const { header, items } = req.body; // Expect { header, items }
      const headerData = insertGoodsReceiptHeaderSchema.parse(header);
      const itemsData = z.array(insertGoodsReceiptItemSchema).parse(items);
      const createdHeader = await storage.createGoodsReceiptHeader(headerData);
      const itemsWithHeaderId = itemsData.map(item => ({ ...item, goodsReceiptId: createdHeader.id }));
      const createdItems = await storage.bulkCreateGoodsReceiptItems(itemsWithHeaderId);
      for (const item of createdItems) {
        const qtyMoved = item.quantityReceived || item.quantityExpected || 0;
        if (qtyMoved > 0 && item.itemId) {
          await receiveStock({
            itemId: item.itemId,
            quantity: qtyMoved,
            referenceType: "GoodsReceipt",
            referenceId: createdHeader.id,
            location: 'MAIN',
            reason: 'Goods receipt',
            createdBy: header?.receivedBy || 'system'
          });
        }
      }
      res.status(201).json({ header: createdHeader, items: createdItems });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid goods receipt data", errors: error.errors });
      }
      console.error("Error creating goods receipt:", error);
      res.status(500).json({ message: "Failed to create goods receipt" });
    }
  });
  // Goods Receipt Headers routes
  app.get("/api/goods-receipt-headers", async (req, res) => {
    try {
      const { supplierId, status, dateFrom, dateTo, limit, offset } = req.query;
      const filters = {
        supplierId: supplierId as string,
        status: status as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      const headers = await storage.getGoodsReceiptHeaders(filters);
      res.json(headers);
    } catch (error) {
      console.error("Error fetching goods receipt headers:", error);
      res.status(500).json({ message: "Failed to fetch goods receipt headers" });
    }
  });

  app.get("/api/goods-receipt-headers/:id", async (req, res) => {
    try {
      const header = await storage.getGoodsReceiptHeader(req.params.id);
      if (!header) {
        return res.status(404).json({ message: "Goods receipt header not found" });
      }
      res.json(header);
    } catch (error) {
      console.error("Error fetching goods receipt header:", error);
      res.status(500).json({ message: "Failed to fetch goods receipt header" });
    }
  });

  // Approve goods receipt
  app.patch("/api/goods-receipt-headers/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const { approvedBy } = req.body;
      const approvedReceipt = await storage.approveGoodsReceipt(id, approvedBy);
      res.json(approvedReceipt);
    } catch (error) {
      console.error("Error approving goods receipt:", error);
      res.status(500).json({ message: "Failed to approve goods receipt" });
    }
  });

  // Update goods receipt status
  app.patch("/api/goods-receipt-headers/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedReceipt = await storage.updateGoodsReceiptStatus(id, status);
      res.json(updatedReceipt);
    } catch (error) {
      console.error("Error updating goods receipt status:", error);
      res.status(500).json({ message: "Failed to update goods receipt status" });
    }
  });

  // Update goods receipt
  app.patch("/api/goods-receipt-headers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedReceipt = await storage.updateGoodsReceiptHeader(id, updateData);
      res.json(updatedReceipt);
    } catch (error) {
      console.error("Error updating goods receipt:", error);
      res.status(500).json({ message: "Failed to update goods receipt" });
    }
  });

  app.post("/api/goods-receipt-headers", async (req, res) => {
    try {
      console.log('[GR HEADER][RAW BODY]', req.body);
      const startTs = Date.now();
      try {
        // Supplier existence validation (prevent opaque FK 500)
        if (!req.body?.supplierId) {
          return res.status(400).json({ message: "supplierId is required" });
        }
        const supplier = await storage.getSupplier(req.body.supplierId);
        if (!supplier) {
          return res.status(400).json({ message: `supplierId ${req.body.supplierId} does not exist` });
        }
        // If supplierLpoId provided but supplierId mismatch, warn (don't block yet)
        if (req.body.supplierLpoId) {
          try {
            const lpo = await storage.getSupplierLpo(req.body.supplierLpoId);
            if (lpo && lpo.supplierId && lpo.supplierId !== req.body.supplierId) {
              console.warn('[GR HEADER][SUPPLIER MISMATCH]', { headerSupplierId: req.body.supplierId, lpoSupplierId: lpo.supplierId });
            }
          } catch (e) {
            console.warn('[GR HEADER][LPO LOOKUP FAILED]', req.body.supplierLpoId, e);
          }
        }
        const headerData = insertGoodsReceiptHeaderSchema.parse(req.body);
        console.log('[GR HEADER][PARSED]', headerData);
        const header = await storage.createGoodsReceiptHeader(headerData);
        console.log('[GR HEADER][CREATED]', { id: header.id, supplierId: header.supplierId, status: header.status, processingMs: Date.now() - startTs });
        return res.status(201).json(header);
      } catch (zerr) {
        if (zerr instanceof z.ZodError) {
          console.error('[GR HEADER][VALIDATION ERROR]', JSON.stringify(zerr.errors, null, 2));
          return res.status(400).json({ message: "Invalid goods receipt header data", errors: zerr.errors, raw: req.body });
        }
        // Likely a database error or FK/unique violation
        console.error('[GR HEADER][UNEXPECTED ERROR BEFORE RESPONSE]', zerr);
        return res.status(500).json({ message: 'Failed to create goods receipt header', detail: (zerr as any)?.message });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid goods receipt header data", errors: error.errors });
      }
      console.error("[GR HEADER][FINAL CATCH] Error creating goods receipt header:", error);
      res.status(500).json({ message: "Failed to create goods receipt header" });
    }
  });

  app.put("/api/goods-receipt-headers/:id", async (req, res) => {
    try {
      const headerData = insertGoodsReceiptHeaderSchema.partial().parse(req.body);
      const header = await storage.updateGoodsReceiptHeader(req.params.id, headerData);
      res.json(header);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid goods receipt header data", errors: error.errors });
      }
      console.error("Error updating goods receipt header:", error);
      res.status(500).json({ message: "Failed to update goods receipt header" });
    }
  });

  // Goods Receipt Items routes
  app.get("/api/goods-receipt-headers/:goodsReceiptId/items", async (req, res) => {
    try {
      const items = await storage.getGoodsReceiptItems(req.params.goodsReceiptId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching goods receipt items:", error);
      res.status(500).json({ message: "Failed to fetch goods receipt items" });
    }
  });

  app.post("/api/goods-receipt-items", async (req, res) => {
    try {
      const itemData = insertGoodsReceiptItemSchema.parse(req.body);
      const item = await storage.createGoodsReceiptItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid goods receipt item data", errors: error.errors });
      }
      const devErr: any = error as any;
      const dbInfo = devErr?.db ? { db: devErr.db } : {};
      console.error("Error creating goods receipt item:", { message: devErr?.message, stack: devErr?.stack, ...dbInfo });
      res.status(500).json({ message: "Failed to create goods receipt item", devError: devErr?.message, ...dbInfo });
    }
  });

  app.put("/api/goods-receipt-items/:id", async (req, res) => {
    try {
      const itemData = insertGoodsReceiptItemSchema.partial().parse(req.body);
      const item = await storage.updateGoodsReceiptItem(req.params.id, itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid goods receipt item data", errors: error.errors });
      }
      console.error("Error updating goods receipt item:", error);
      res.status(500).json({ message: "Failed to update goods receipt item" });
    }
  });

  app.post("/api/goods-receipt-items/bulk", async (req, res) => {
    try {
      const itemsData = z.array(insertGoodsReceiptItemSchema).parse(req.body);
      const items = await storage.bulkCreateGoodsReceiptItems(itemsData);
      res.status(201).json(items);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid goods receipt items data", errors: error.errors });
      }
      console.error("Error bulk creating goods receipt items:", error);
      res.status(500).json({ message: "Failed to bulk create goods receipt items" });
    }
  });

  // Scanning Sessions routes
  app.get("/api/scanning-sessions", async (req, res) => {
    try {
      const { goodsReceiptId, status, limit, offset } = req.query;
      const filters = {
        goodsReceiptId: goodsReceiptId as string,
        status: status as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      const sessions = await storage.getScanningSessions(filters);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching scanning sessions:", error);
      res.status(500).json({ message: "Failed to fetch scanning sessions" });
    }
  });

  app.post("/api/scanning-sessions", async (req, res) => {
    try {
      const sessionData = insertScanningSessionSchema.parse(req.body);
      const session = await storage.createScanningSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid scanning session data", errors: error.errors });
      }
      console.error("Error creating scanning session:", error);
      res.status(500).json({ message: "Failed to create scanning session" });
    }
  });

  app.put("/api/scanning-sessions/:id", async (req, res) => {
    try {
      const sessionData = insertScanningSessionSchema.partial().parse(req.body);
      const session = await storage.updateScanningSession(req.params.id, sessionData);
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid scanning session data", errors: error.errors });
      }
      console.error("Error updating scanning session:", error);
      res.status(500).json({ message: "Failed to update scanning session" });
    }
  });

  // Scanned Items routes
  app.get("/api/scanning-sessions/:sessionId/items", async (req, res) => {
    try {
      const items = await storage.getScannedItems(req.params.sessionId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching scanned items:", error);
      res.status(500).json({ message: "Failed to fetch scanned items" });
    }
  });

  app.post("/api/scanned-items", async (req, res) => {
    try {
      const itemData = insertScannedItemSchema.parse(req.body);
      const item = await storage.createScannedItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid scanned item data", errors: error.errors });
      }
      console.error("Error creating scanned item:", error);
      res.status(500).json({ message: "Failed to create scanned item" });
    }
  });

  app.post("/api/scanned-items/bulk", async (req, res) => {
    try {
      const itemsData = z.array(insertScannedItemSchema).parse(req.body);
      const items = await storage.bulkCreateScannedItems(itemsData);
      res.status(201).json(items);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid scanned items data", errors: error.errors });
      }
      console.error("Error bulk creating scanned items:", error);
      res.status(500).json({ message: "Failed to bulk create scanned items" });
    }
  });

  // Finalize scanning session -> aggregate scanned items and create stock movements
  app.post('/api/scanning-sessions/:id/finalize', async (req, res) => {
    try {
      const sessionId = req.params.id;
      const session = await storage.getScanningSession(sessionId);
      if (!session) return res.status(404).json({ message: 'Scanning session not found' });
      if (session.status === 'Completed') {
        return res.status(200).json({ message: 'Already finalized', session });
      }
      const scanned = await storage.getScannedItems(sessionId);
      const grouped = new Map<string, number>();
      for (const s of scanned) {
        const invId: any = (s as any).inventoryItemId;
        const qty: any = (s as any).quantityScanned;
        if (!invId || !qty) continue;
        grouped.set(invId, (grouped.get(invId) || 0) + qty);
      }
      const movements: any[] = [];
      for (const [itemId, qty] of Array.from(grouped.entries())) {
        if (qty > 0) {
          try {
            const mv = await receiveStock({
              itemId,
              quantity: qty,
              referenceType: 'ScanFinalize',
              referenceId: sessionId,
              location: 'MAIN',
              reason: 'Scanning session finalization'
            });
            movements.push(mv);
          } catch (e) {
            console.error('[ScanningSession][Finalize] Movement error', { itemId, qty, error: (e as any)?.message });
          }
        }
      }
      const updated = await storage.updateScanningSession(sessionId, { status: 'Completed' } as any);
      res.json({ session: updated, movements });
    } catch (error) {
      console.error('[ScanningSession][Finalize] Error', error);
      res.status(500).json({ message: 'Failed to finalize scanning session' });
    }
  });

  // Supplier Returns routes
  app.get("/api/supplier-returns", async (req, res) => {
    try {
      const { supplierId, status, dateFrom, dateTo, limit, offset } = req.query;
      const filters = {
        supplierId: supplierId as string,
        status: status as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      const returns = await storage.getSupplierReturns(filters);
      res.json(returns);
    } catch (error) {
      console.error("Error fetching supplier returns:", error);
      res.status(500).json({ message: "Failed to fetch supplier returns" });
    }
  });

  app.get("/api/supplier-returns/:id", async (req, res) => {
    try {
      const returnRecord = await storage.getSupplierReturn(req.params.id);
      if (!returnRecord) {
        return res.status(404).json({ message: "Supplier return not found" });
      }
      res.json(returnRecord);
    } catch (error) {
      console.error("Error fetching supplier return:", error);
      res.status(500).json({ message: "Failed to fetch supplier return" });
    }
  });

  app.post("/api/supplier-returns", async (req, res) => {
    try {
      const returnData = insertSupplierReturnSchema.parse(req.body);
      const returnRecord = await storage.createSupplierReturn(returnData);
      res.status(201).json(returnRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supplier return data", errors: error.errors });
      }
      console.error("Error creating supplier return:", error);
      res.status(500).json({ message: "Failed to create supplier return" });
    }
  });

  app.put("/api/supplier-returns/:id", async (req, res) => {
    try {
      const returnData = insertSupplierReturnSchema.partial().parse(req.body);
      const returnRecord = await storage.updateSupplierReturn(req.params.id, returnData);
      res.json(returnRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supplier return data", errors: error.errors });
      }
      console.error("Error updating supplier return:", error);
      res.status(500).json({ message: "Failed to update supplier return" });
    }
  });

  // Supplier Return Items routes
  app.get("/api/supplier-returns/:returnId/items", async (req, res) => {
    try {
      const items = await storage.getSupplierReturnItems(req.params.returnId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching supplier return items:", error);
      res.status(500).json({ message: "Failed to fetch supplier return items" });
    }
  });

  app.post("/api/supplier-return-items", async (req, res) => {
    try {
      const itemData = insertSupplierReturnItemSchema.parse(req.body);
      const item = await storage.createSupplierReturnItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supplier return item data", errors: error.errors });
      }
      console.error("Error creating supplier return item:", error);
      res.status(500).json({ message: "Failed to create supplier return item" });
    }
  });

  app.post("/api/supplier-return-items/bulk", async (req, res) => {
    try {
      const itemsData = z.array(insertSupplierReturnItemSchema).parse(req.body);
      const items = await storage.bulkCreateSupplierReturnItems(itemsData);
      res.status(201).json(items);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supplier return items data", errors: error.errors });
      }
      console.error("Error bulk creating supplier return items:", error);
      res.status(500).json({ message: "Failed to bulk create supplier return items" });
    }
  });
}
