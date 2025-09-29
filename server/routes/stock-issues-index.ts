import type { Express } from "express";
import stockIssuesRoutes from "./stock-issues";

export function registerStockIssuesRoutes(app: Express) {
  app.use("/api/stock-issues", stockIssuesRoutes);
}
