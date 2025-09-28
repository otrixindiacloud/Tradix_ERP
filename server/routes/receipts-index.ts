import type { Express } from "express";
import receiptsRoutes from "./receipts";

export function registerReceiptsRoutes(app: Express) {
  app.use("/api/receipts", receiptsRoutes);
}
