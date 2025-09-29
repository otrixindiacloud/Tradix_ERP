import type { Express } from "express";
import { createServer, type Server } from "http";

// Import all route modules
import { registerDashboardRoutes } from "./dashboard";
import { registerCustomerRoutes } from "./customers";
import { registerSupplierRoutes } from "./suppliers";
import { registerItemRoutes } from "./items";
import { registerEnquiryRoutes } from "./enquiries";
import requisitionsRoutes from "./requisitions";
import materialRequestsRoutes from "./material-requests";
import { registerQuotationRoutes } from "./quotations";
import { registerApprovalRoutes } from "./approvals";
import { registerCustomerAcceptanceRoutes } from "./customer-acceptance";
import { registerPurchaseOrderRoutes } from "./purchase-orders";
import { registerSalesOrderRoutes } from "./sales-orders";
import { registerSupplierLpoRoutes } from "./supplier-lpo";
import { registerSupplierQuoteRoutes } from "./supplier-quotes";
import { registerWorkflowRoutes } from "./workflow";
import { registerWorkflowNotificationRoutes } from "./workflow-notifications";
import { registerInventoryRoutes } from "./inventory";
import { registerPhysicalStockRoutes } from "./physical-stock";
import { registerPricingRoutes } from "./pricing";
import { registerAIRoutes } from "./ai";
import { registerDeliveryRoutes } from "./delivery";
import { registerShipmentTrackingRoutes } from "./shipment-tracking";
import { registerInvoiceRoutes } from "./invoice";
import { registerCreditNoteRoutes } from "./credit-notes";
import { registerGoodsReceiptRoutes } from "./goods-receipt";
import { registerPurchaseInvoiceRoutes } from "./purchase-invoices";
import { registerUtilityRoutes } from "./utility";
import auditRoutes from "./audit";
import userRoutes from "./users";
import settingsRoutes from "./settings";
import { analyticsRouter } from "./analytics";
import { registerRecentActivitiesRoutes } from "./recent-activities";
import { registerAuthRoutes } from "./auth";
import { registerFileRoutes } from "./files";
import tableValidationRoutes from "./table-validation";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all route modules
  registerDashboardRoutes(app);
  // Inventory Items API
  const { registerInventoryItemsRoutes } = await import("./inventory-items-index");
  registerInventoryItemsRoutes(app);
  // Stock Issues API
  const { registerStockIssuesRoutes } = await import("./stock-issues-index");
  registerStockIssuesRoutes(app);
  // Receipt Returns API
  const { registerReceiptReturnsRoutes } = await import("./receipt-returns-index");
  registerReceiptReturnsRoutes(app);
  // Register receipts API
  const { registerReceiptsRoutes } = await import("./receipts-index");
  registerReceiptsRoutes(app);
  registerCustomerRoutes(app);
  registerSupplierRoutes(app);
  registerItemRoutes(app);
  registerEnquiryRoutes(app);
  app.use("/api/requisitions", requisitionsRoutes);
  // Alias route for material requests UI (maps to requisitions storage)
  app.use("/api/material-requests", materialRequestsRoutes);
  registerQuotationRoutes(app);
  registerApprovalRoutes(app);
  registerCustomerAcceptanceRoutes(app);
  registerPurchaseOrderRoutes(app);
  registerSalesOrderRoutes(app);
  registerSupplierLpoRoutes(app);
  registerSupplierQuoteRoutes(app);
  registerWorkflowRoutes(app);
  registerWorkflowNotificationRoutes(app);
  registerInventoryRoutes(app);
  registerPhysicalStockRoutes(app);
  registerPricingRoutes(app);
  registerAIRoutes(app);
  registerDeliveryRoutes(app);
  registerShipmentTrackingRoutes(app);
  registerInvoiceRoutes(app);
  registerCreditNoteRoutes(app);
  registerGoodsReceiptRoutes(app);
  registerPurchaseInvoiceRoutes(app);
  registerUtilityRoutes(app);
  registerRecentActivitiesRoutes(app);
  registerAuthRoutes(app);
  registerFileRoutes(app);

  // Register administration routes
  app.use("/api/audit", auditRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/table-validation", tableValidationRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
