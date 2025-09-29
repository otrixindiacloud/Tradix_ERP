import type { Express } from "express";
import receiptReturnsRoutes from "./receipt-returns";

export function registerReceiptReturnsRoutes(app: Express) {
  app.use("/api/receipt-returns", receiptReturnsRoutes);
}