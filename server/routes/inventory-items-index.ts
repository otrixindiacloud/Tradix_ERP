import type { Express } from "express";
import inventoryItemsRoutes from "./inventory-items";

export function registerInventoryItemsRoutes(app: Express) {
  app.use("/api/inventory-items", inventoryItemsRoutes);
}
