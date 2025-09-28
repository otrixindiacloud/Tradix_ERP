var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc19) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc19 = __getOwnPropDesc(from, key)) || desc19.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// shared/utils/uuid.ts
import { nanoid } from "nanoid";
function isValidUUID(value) {
  if (!value || typeof value !== "string") {
    return false;
  }
  return UUID_V4_REGEX.test(value);
}
function validateUserIdOrDefault(userId) {
  if (!userId || userId === "" || !isValidUUID(userId)) {
    return SYSTEM_USER_ID;
  }
  return userId;
}
var UUID_V4_REGEX, SYSTEM_USER_ID;
var init_uuid = __esm({
  "shared/utils/uuid.ts"() {
    "use strict";
    UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    SYSTEM_USER_ID = "e459998e-0a4d-4652-946e-44b2ba161d16";
  }
});

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  acceptanceConfirmations: () => acceptanceConfirmations,
  approvalLevelEnum: () => approvalLevelEnum,
  approvalRules: () => approvalRules,
  auditLogs: () => auditLogs,
  bulkPricingOperations: () => bulkPricingOperations,
  bulkPricingOperationsRelations: () => bulkPricingOperationsRelations,
  createQuotationRevisionSchema: () => createQuotationRevisionSchema,
  creditNoteItems: () => creditNoteItems,
  creditNotes: () => creditNotes,
  customerAcceptances: () => customerAcceptances,
  customerAcceptancesRelations: () => customerAcceptancesRelations,
  customerClassificationEnum: () => customerClassificationEnum,
  customerPoUpload: () => customerPoUpload,
  customerPricing: () => customerPricing,
  customerPricingRelations: () => customerPricingRelations,
  customerTypeEnum: () => customerTypeEnum,
  customers: () => customers,
  customersRelations: () => customersRelations,
  deliveries: () => deliveries,
  deliveryItem: () => deliveryItem,
  deliveryItems: () => deliveryItems,
  deliveryPickedItems: () => deliveryPickedItems,
  deliveryPickingSessions: () => deliveryPickingSessions,
  deliveryStatusEnum: () => deliveryStatusEnum,
  enquiries: () => enquiries,
  enquiriesRelations: () => enquiriesRelations,
  enquiryItems: () => enquiryItems,
  enquirySourceEnum: () => enquirySourceEnum,
  enquiryStatusEnum: () => enquiryStatusEnum,
  goodsReceipt: () => goodsReceipt,
  goodsReceiptHeaders: () => goodsReceiptHeaders,
  goodsReceiptItems: () => goodsReceiptItems,
  goodsReceiptStatusEnum: () => goodsReceiptStatusEnum,
  goodsReceipts: () => goodsReceipts,
  insertAcceptanceConfirmationSchema: () => insertAcceptanceConfirmationSchema,
  insertApprovalRuleSchema: () => insertApprovalRuleSchema,
  insertBulkPricingOperationSchema: () => insertBulkPricingOperationSchema,
  insertCreditNoteItemSchema: () => insertCreditNoteItemSchema,
  insertCreditNoteSchema: () => insertCreditNoteSchema,
  insertCustomerAcceptanceSchema: () => insertCustomerAcceptanceSchema,
  insertCustomerPricingSchema: () => insertCustomerPricingSchema,
  insertCustomerSchema: () => insertCustomerSchema,
  insertDeliveryItemSchema: () => insertDeliveryItemSchema,
  insertDeliveryPickedItemSchema: () => insertDeliveryPickedItemSchema,
  insertDeliveryPickingSessionSchema: () => insertDeliveryPickingSessionSchema,
  insertDeliverySchema: () => insertDeliverySchema,
  insertEnquiryItemSchema: () => insertEnquiryItemSchema,
  insertEnquirySchema: () => insertEnquirySchema,
  insertGoodsReceiptHeaderSchema: () => insertGoodsReceiptHeaderSchema,
  insertGoodsReceiptItemSchema: () => insertGoodsReceiptItemSchema,
  insertInventoryItemSchema: () => insertInventoryItemSchema,
  insertInventoryLevelSchema: () => insertInventoryLevelSchema,
  insertInventoryVariantSchema: () => insertInventoryVariantSchema,
  insertInvoiceItemSchema: () => insertInvoiceItemSchema,
  insertInvoiceSchema: () => insertInvoiceSchema,
  insertItemPricingSchema: () => insertItemPricingSchema,
  insertItemSchema: () => insertItemSchema,
  insertMarkupConfigurationSchema: () => insertMarkupConfigurationSchema,
  insertPhysicalStockAdjustmentItemSchema: () => insertPhysicalStockAdjustmentItemSchema,
  insertPhysicalStockAdjustmentSchema: () => insertPhysicalStockAdjustmentSchema,
  insertPhysicalStockCountItemSchema: () => insertPhysicalStockCountItemSchema,
  insertPhysicalStockCountSchema: () => insertPhysicalStockCountSchema,
  insertPhysicalStockScannedItemSchema: () => insertPhysicalStockScannedItemSchema,
  insertPhysicalStockScanningSessionSchema: () => insertPhysicalStockScanningSessionSchema,
  insertPoLineItemSchema: () => insertPoLineItemSchema,
  insertPriceChangeHistorySchema: () => insertPriceChangeHistorySchema,
  insertPriceListItemSchema: () => insertPriceListItemSchema,
  insertPriceListSchema: () => insertPriceListSchema,
  insertPricingRuleSchema: () => insertPricingRuleSchema,
  insertProductCategorySchema: () => insertProductCategorySchema,
  insertPurchaseOrderSchema: () => insertPurchaseOrderSchema,
  insertQuotationApprovalSchema: () => insertQuotationApprovalSchema,
  insertQuotationItemAcceptanceSchema: () => insertQuotationItemAcceptanceSchema,
  insertQuotationItemSchema: () => insertQuotationItemSchema,
  insertQuotationSchema: () => insertQuotationSchema,
  insertRequisitionItemSchema: () => insertRequisitionItemSchema,
  insertRequisitionSchema: () => insertRequisitionSchema,
  insertSalesOrderItemSchema: () => insertSalesOrderItemSchema,
  insertSalesOrderSchema: () => insertSalesOrderSchema,
  insertScannedItemSchema: () => insertScannedItemSchema,
  insertScanningSessionSchema: () => insertScanningSessionSchema,
  insertShipmentSchema: () => insertShipmentSchema,
  insertShipmentTrackingEventSchema: () => insertShipmentTrackingEventSchema,
  insertStockMovementSchema: () => insertStockMovementSchema,
  insertSupplierLpoItemSchema: () => insertSupplierLpoItemSchema,
  insertSupplierLpoSchema: () => insertSupplierLpoSchema,
  insertSupplierReturnItemSchema: () => insertSupplierReturnItemSchema,
  insertSupplierReturnSchema: () => insertSupplierReturnSchema,
  insertSupplierSchema: () => insertSupplierSchema,
  inventoryItem: () => inventoryItem,
  inventoryItems: () => inventoryItems,
  inventoryLevels: () => inventoryLevels,
  inventoryVariants: () => inventoryVariants,
  invoiceItems: () => invoiceItems,
  invoiceStatusEnum: () => invoiceStatusEnum,
  invoices: () => invoices,
  itemPricing: () => itemPricing,
  itemPricingRelations: () => itemPricingRelations,
  items: () => items,
  itemsRelations: () => itemsRelations,
  legacyGoodsReceiptItems: () => legacyGoodsReceiptItems,
  legacyInventory: () => legacyInventory,
  markupConfiguration: () => markupConfiguration,
  markupConfigurationRelations: () => markupConfigurationRelations,
  materialRequest: () => materialRequest,
  materialRequestSchema: () => materialRequestSchema,
  physicalStock: () => physicalStock,
  physicalStockAdjustmentItems: () => physicalStockAdjustmentItems,
  physicalStockAdjustments: () => physicalStockAdjustments,
  physicalStockCountItems: () => physicalStockCountItems,
  physicalStockCounts: () => physicalStockCounts,
  physicalStockScannedItems: () => physicalStockScannedItems,
  physicalStockScanningSessions: () => physicalStockScanningSessions,
  physicalStockStatusEnum: () => physicalStockStatusEnum,
  poLineItems: () => poLineItems,
  poLineItemsRelations: () => poLineItemsRelations,
  priceChangeHistory: () => priceChangeHistory,
  priceChangeHistoryRelations: () => priceChangeHistoryRelations,
  priceListItems: () => priceListItems,
  priceListItemsRelations: () => priceListItemsRelations,
  priceLists: () => priceLists,
  priceListsRelations: () => priceListsRelations,
  pricingMarkupLevelEnum: () => pricingMarkupLevelEnum,
  pricingRuleTypeEnum: () => pricingRuleTypeEnum,
  pricingRules: () => pricingRules,
  pricingRulesRelations: () => pricingRulesRelations,
  productCategories: () => productCategories,
  productCategoriesRelations: () => productCategoriesRelations,
  purchaseOrders: () => purchaseOrders,
  purchaseOrdersRelations: () => purchaseOrdersRelations,
  quotationApprovals: () => quotationApprovals,
  quotationItemAcceptances: () => quotationItemAcceptances,
  quotationItemAcceptancesRelations: () => quotationItemAcceptancesRelations,
  quotationItems: () => quotationItems,
  quotationStatusEnum: () => quotationStatusEnum,
  quotations: () => quotations,
  quotationsRelations: () => quotationsRelations,
  requisitionItemUrgencyEnum: () => requisitionItemUrgencyEnum,
  requisitionItems: () => requisitionItems,
  requisitionItemsRelations: () => requisitionItemsRelations,
  requisitionPriorityEnum: () => requisitionPriorityEnum,
  requisitionStatusEnum: () => requisitionStatusEnum,
  requisitions: () => requisitions,
  requisitionsRelations: () => requisitionsRelations,
  salesOrderItems: () => salesOrderItems,
  salesOrderStatusEnum: () => salesOrderStatusEnum,
  salesOrders: () => salesOrders,
  salesOrdersRelations: () => salesOrdersRelations,
  scannedItems: () => scannedItems,
  scanningSessions: () => scanningSessions,
  shipmentPriorityEnum: () => shipmentPriorityEnum,
  shipmentServiceTypeEnum: () => shipmentServiceTypeEnum,
  shipmentStatusEnum: () => shipmentStatusEnum,
  shipmentTrackingEvents: () => shipmentTrackingEvents,
  shipmentTrackingEventsRelations: () => shipmentTrackingEventsRelations,
  shipments: () => shipments,
  shipmentsRelations: () => shipmentsRelations,
  shippingTracking: () => shippingTracking,
  stockCountStatusEnum: () => stockCountStatusEnum,
  stockIssue: () => stockIssue,
  stockMovements: () => stockMovements,
  stockTransfer: () => stockTransfer,
  supplierLpoItems: () => supplierLpoItems,
  supplierLpoStatusEnum: () => supplierLpoStatusEnum,
  supplierLpos: () => supplierLpos,
  supplierReturnItems: () => supplierReturnItems,
  supplierReturns: () => supplierReturns,
  suppliers: () => suppliers,
  suppliersRelations: () => suppliersRelations,
  trackingEventTypeEnum: () => trackingEventTypeEnum,
  updateEnquirySchema: () => updateEnquirySchema,
  users: () => users
});
import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  decimal,
  integer,
  jsonb,
  boolean,
  pgEnum,
  uuid,
  date,
  unique
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { nanoid as nanoid2 } from "nanoid";
var deliveryItem, physicalStock, stockTransfer, stockIssue, materialRequest, materialRequestSchema, inventoryItem, goodsReceipt, shippingTracking, customerPoUpload, customerTypeEnum, customerClassificationEnum, enquiryStatusEnum, enquirySourceEnum, quotationStatusEnum, salesOrderStatusEnum, supplierLpoStatusEnum, goodsReceiptStatusEnum, deliveryStatusEnum, invoiceStatusEnum, requisitionStatusEnum, requisitionPriorityEnum, requisitionItemUrgencyEnum, physicalStockStatusEnum, stockCountStatusEnum, shipmentStatusEnum, shipmentPriorityEnum, shipmentServiceTypeEnum, trackingEventTypeEnum, users, customers, suppliers, items, legacyInventory, enquiries, enquiryItems, requisitions, requisitionItems, approvalLevelEnum, quotations, quotationItems, approvalRules, quotationApprovals, salesOrders, salesOrderItems, supplierLpos, supplierLpoItems, goodsReceipts, legacyGoodsReceiptItems, deliveries, deliveryItems, invoices, invoiceItems, deliveryPickingSessions, deliveryPickedItems, creditNotes, creditNoteItems, auditLogs, customerAcceptances, purchaseOrders, quotationItemAcceptances, poLineItems, acceptanceConfirmations, shipments, shipmentTrackingEvents, customersRelations, suppliersRelations, itemsRelations, enquiriesRelations, requisitionsRelations, requisitionItemsRelations, quotationsRelations, customerAcceptancesRelations, purchaseOrdersRelations, quotationItemAcceptancesRelations, poLineItemsRelations, salesOrdersRelations, shipmentsRelations, shipmentTrackingEventsRelations, insertCustomerSchema, insertSupplierSchema, insertItemSchema, insertEnquirySchema, updateEnquirySchema, insertEnquiryItemSchema, insertRequisitionSchema, insertRequisitionItemSchema, insertQuotationSchema, createQuotationRevisionSchema, insertQuotationItemSchema, insertApprovalRuleSchema, insertQuotationApprovalSchema, insertCustomerAcceptanceSchema, insertPurchaseOrderSchema, insertQuotationItemAcceptanceSchema, insertPoLineItemSchema, insertAcceptanceConfirmationSchema, insertSalesOrderSchema, insertSalesOrderItemSchema, insertSupplierLpoSchema, insertSupplierLpoItemSchema, insertInvoiceSchema, inventoryItems, inventoryVariants, inventoryLevels, goodsReceiptHeaders, goodsReceiptItems, scanningSessions, scannedItems, supplierReturns, supplierReturnItems, stockMovements, insertInventoryItemSchema, insertInventoryVariantSchema, insertInventoryLevelSchema, insertScanningSessionSchema, insertScannedItemSchema, insertSupplierReturnSchema, insertSupplierReturnItemSchema, insertGoodsReceiptHeaderSchema, insertGoodsReceiptItemSchema, insertStockMovementSchema, insertDeliverySchema, insertDeliveryItemSchema, insertInvoiceItemSchema, insertDeliveryPickingSessionSchema, insertDeliveryPickedItemSchema, insertShipmentSchema, insertShipmentTrackingEventSchema, insertCreditNoteSchema, insertCreditNoteItemSchema, pricingMarkupLevelEnum, pricingRuleTypeEnum, productCategories, markupConfiguration, itemPricing, customerPricing, pricingRules, priceLists, priceListItems, priceChangeHistory, bulkPricingOperations, productCategoriesRelations, markupConfigurationRelations, itemPricingRelations, customerPricingRelations, pricingRulesRelations, priceListsRelations, priceListItemsRelations, priceChangeHistoryRelations, bulkPricingOperationsRelations, insertProductCategorySchema, insertMarkupConfigurationSchema, insertItemPricingSchema, insertCustomerPricingSchema, insertPricingRuleSchema, insertPriceListSchema, insertPriceListItemSchema, insertPriceChangeHistorySchema, insertBulkPricingOperationSchema, physicalStockCounts, physicalStockCountItems, physicalStockScanningSessions, physicalStockScannedItems, physicalStockAdjustments, physicalStockAdjustmentItems, insertPhysicalStockCountSchema, insertPhysicalStockCountItemSchema, insertPhysicalStockScanningSessionSchema, insertPhysicalStockScannedItemSchema, insertPhysicalStockAdjustmentSchema, insertPhysicalStockAdjustmentItemSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    deliveryItem = pgTable("delivery_item", {
      id: uuid("id").primaryKey().defaultRandom(),
      deliveryId: uuid("delivery_id").notNull().references(() => deliveries.id, { onDelete: "cascade" }),
      salesOrderItemId: uuid("sales_order_item_id").notNull(),
      itemId: uuid("item_id").notNull(),
      barcode: varchar("barcode", { length: 64 }),
      supplierCode: varchar("supplier_code", { length: 64 }),
      description: text("description"),
      orderedQuantity: integer("ordered_quantity").notNull(),
      pickedQuantity: integer("picked_quantity").notNull().default(0),
      deliveredQuantity: integer("delivered_quantity").notNull().default(0),
      unitPrice: varchar("unit_price", { length: 32 }),
      totalPrice: varchar("total_price", { length: 32 }),
      pickedBy: uuid("picked_by"),
      pickedAt: timestamp("picked_at"),
      storageLocation: varchar("storage_location", { length: 64 }),
      pickingNotes: text("picking_notes"),
      qualityChecked: boolean("quality_checked").default(false),
      qualityCheckedBy: uuid("quality_checked_by"),
      qualityCheckedAt: timestamp("quality_checked_at"),
      qualityNotes: text("quality_notes")
    });
    physicalStock = pgTable("physical_stock", {
      id: uuid("id").primaryKey().defaultRandom(),
      itemId: uuid("item_id").notNull(),
      location: varchar("location", { length: 128 }),
      quantity: integer("quantity").notNull(),
      lastUpdated: timestamp("last_updated", { withTimezone: true }).defaultNow(),
      countedBy: varchar("counted_by", { length: 128 }),
      notes: text("notes")
    });
    stockTransfer = pgTable("stock_transfer", {
      id: uuid("id").primaryKey().defaultRandom(),
      fromLocation: varchar("from_location", { length: 128 }).notNull(),
      toLocation: varchar("to_location", { length: 128 }).notNull(),
      itemId: uuid("item_id").notNull(),
      quantity: integer("quantity").notNull(),
      transferDate: timestamp("transfer_date", { withTimezone: true }).defaultNow(),
      status: varchar("status", { length: 32 })
      // e.g., Pending, Completed
    });
    stockIssue = pgTable("stock_issue", {
      id: uuid("id").primaryKey().defaultRandom(),
      issueNumber: varchar("issue_number", { length: 32 }),
      itemId: uuid("item_id").notNull(),
      issuedTo: varchar("issued_to", { length: 128 }),
      quantity: integer("quantity").notNull(),
      issueDate: timestamp("issue_date", { withTimezone: true }).defaultNow(),
      reason: text("reason"),
      // Newly added fields (ensure migrations applied: see add-stock-issue-fixes.sql)
      departmentId: uuid("department_id"),
      notes: text("notes"),
      status: varchar("status", { length: 32 })
    });
    materialRequest = pgTable("material_request", {
      id: uuid("id").primaryKey().defaultRandom(),
      requestedBy: varchar("requested_by", { length: 128 }),
      itemId: uuid("item_id").notNull(),
      quantity: integer("quantity").notNull(),
      requestDate: timestamp("request_date", { withTimezone: true }).defaultNow(),
      status: varchar("status", { length: 32 }),
      // e.g., Pending, Approved, Rejected
      notes: text("notes")
    });
    materialRequestSchema = createInsertSchema(materialRequest).omit({ id: true });
    inventoryItem = pgTable("inventory_item", {
      id: uuid("id").primaryKey().defaultRandom(),
      supplierCode: varchar("supplier_code", { length: 64 }),
      barcode: varchar("barcode", { length: 64 }),
      description: text("description"),
      category: varchar("category", { length: 64 }),
      uom: varchar("uom", { length: 16 }),
      costPrice: integer("cost_price"),
      markupRule: varchar("markup_rule", { length: 32 }),
      color: varchar("color", { length: 32 }),
      size: varchar("size", { length: 32 }),
      packaging: varchar("packaging", { length: 64 }),
      createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
    });
    goodsReceipt = pgTable("goods_receipt", {
      id: uuid("id").primaryKey().defaultRandom(),
      supplierLpoId: uuid("supplier_lpo_id").notNull(),
      itemId: uuid("item_id").notNull(),
      barcode: varchar("barcode", { length: 64 }),
      quantity: integer("quantity").notNull(),
      receiptDate: timestamp("receipt_date", { withTimezone: true }).defaultNow(),
      status: varchar("status", { length: 32 }),
      // e.g., Received, Damaged, Shortage
      notes: text("notes")
    });
    shippingTracking = pgTable("shipping_tracking", {
      id: uuid("id").primaryKey().defaultRandom(),
      salesOrderId: uuid("sales_order_id").notNull(),
      trackingNumber: varchar("tracking_number", { length: 64 }),
      carrier: varchar("carrier", { length: 64 }),
      status: varchar("status", { length: 32 }),
      // e.g., In Transit, Delivered
      shippedDate: timestamp("shipped_date", { withTimezone: true }),
      deliveredDate: timestamp("delivered_date", { withTimezone: true }),
      notes: text("notes")
    });
    customerPoUpload = pgTable("customer_po_upload", {
      id: uuid("id").primaryKey().defaultRandom(),
      customerId: uuid("customer_id").notNull(),
      quotationId: uuid("quotation_id").notNull(),
      poNumber: varchar("po_number", { length: 64 }),
      fileUrl: varchar("file_url", { length: 256 }),
      // Path to uploaded PO file
      uploadDate: timestamp("upload_date", { withTimezone: true }).defaultNow(),
      uploadedBy: varchar("uploaded_by", { length: 128 })
    });
    customerTypeEnum = pgEnum("customer_type", ["Retail", "Wholesale"]);
    customerClassificationEnum = pgEnum("customer_classification", ["Internal", "Corporate", "Individual", "Family", "Ministry"]);
    enquiryStatusEnum = pgEnum("enquiry_status", ["New", "In Progress", "Quoted", "Closed"]);
    enquirySourceEnum = pgEnum("enquiry_source", ["Email", "Phone", "Web Form", "Walk-in"]);
    quotationStatusEnum = pgEnum("quotation_status", ["Draft", "Sent", "Accepted", "Rejected", "Expired"]);
    salesOrderStatusEnum = pgEnum("sales_order_status", ["Draft", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"]);
    supplierLpoStatusEnum = pgEnum("supplier_lpo_status", ["Draft", "Pending", "Sent", "Confirmed", "Received", "Cancelled"]);
    goodsReceiptStatusEnum = pgEnum("goods_receipt_status", ["Pending", "Partial", "Complete", "Discrepancy", "Approved"]);
    deliveryStatusEnum = pgEnum("delivery_status", ["Pending", "Partial", "Complete", "Cancelled"]);
    invoiceStatusEnum = pgEnum("invoice_status", ["Draft", "Sent", "Paid", "Overdue", "Cancelled"]);
    requisitionStatusEnum = pgEnum("requisition_status", ["Draft", "Pending Approval", "Approved", "Rejected", "Processing", "Completed", "Cancelled"]);
    requisitionPriorityEnum = pgEnum("requisition_priority", ["Low", "Medium", "High", "Urgent"]);
    requisitionItemUrgencyEnum = pgEnum("requisition_item_urgency", ["Standard", "Urgent"]);
    physicalStockStatusEnum = pgEnum("physical_stock_status", ["Draft", "In Progress", "Completed", "Approved", "Cancelled"]);
    stockCountStatusEnum = pgEnum("stock_count_status", ["Pending", "Counted", "Verified", "Discrepancy", "Adjusted"]);
    shipmentStatusEnum = pgEnum("shipment_status", ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered", "Delayed", "Cancelled", "Lost"]);
    shipmentPriorityEnum = pgEnum("shipment_priority", ["Low", "Medium", "High", "Urgent"]);
    shipmentServiceTypeEnum = pgEnum("shipment_service_type", ["Standard", "Express", "Overnight", "Economy"]);
    trackingEventTypeEnum = pgEnum("tracking_event_type", ["Pickup", "In Transit", "Sorting", "Out for Delivery", "Delivered", "Exception"]);
    users = pgTable("users", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      username: varchar("username", { length: 100 }).notNull().unique(),
      email: varchar("email", { length: 255 }).unique(),
      firstName: varchar("first_name", { length: 100 }),
      lastName: varchar("last_name", { length: 100 }),
      role: varchar("role", { length: 50 }).notNull().default("user"),
      // Authentication fields
      passwordHash: varchar("password_hash", { length: 255 }),
      isActive: boolean("is_active").default(true),
      lastLoginAt: timestamp("last_login_at"),
      profileImageUrl: varchar("profile_image_url", { length: 500 }),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    customers = pgTable("customers", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      name: varchar("name", { length: 255 }).notNull(),
      email: varchar("email", { length: 255 }),
      phone: varchar("phone", { length: 50 }),
      address: text("address"),
      customerType: customerTypeEnum("customer_type").notNull(),
      classification: customerClassificationEnum("classification").notNull(),
      taxId: varchar("tax_id", { length: 100 }),
      creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }),
      paymentTerms: varchar("payment_terms", { length: 100 }),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => ({
      // Add unique constraints to prevent duplicate entries
      nameUnique: unique("customers_name_unique").on(table.name),
      emailUnique: unique("customers_email_unique").on(table.email)
    }));
    suppliers = pgTable("suppliers", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      name: varchar("name", { length: 255 }).notNull(),
      email: varchar("email", { length: 255 }),
      phone: varchar("phone", { length: 50 }),
      address: text("address"),
      contactPerson: varchar("contact_person", { length: 255 }),
      paymentTerms: varchar("payment_terms", { length: 100 }),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    items = pgTable("items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      supplierCode: varchar("supplier_code", { length: 100 }).notNull(),
      barcode: varchar("barcode", { length: 100 }).unique(),
      description: text("description").notNull(),
      category: varchar("category", { length: 100 }),
      unitOfMeasure: varchar("unit_of_measure", { length: 50 }),
      costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
      retailMarkup: decimal("retail_markup", { precision: 5, scale: 2 }).default("70"),
      wholesaleMarkup: decimal("wholesale_markup", { precision: 5, scale: 2 }).default("40"),
      supplierId: uuid("supplier_id").references(() => suppliers.id),
      variants: jsonb("variants"),
      // For color, size, etc.
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    legacyInventory = pgTable("inventory", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      itemId: uuid("item_id").references(() => items.id).notNull(),
      quantity: integer("quantity").default(0),
      reservedQuantity: integer("reserved_quantity").default(0),
      storageLocation: varchar("storage_location", { length: 100 }),
      lastUpdated: timestamp("last_updated").defaultNow()
    });
    enquiries = pgTable("enquiries", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      enquiryNumber: varchar("enquiry_number", { length: 50 }).unique().notNull(),
      customerId: uuid("customer_id").references(() => customers.id).notNull(),
      enquiryDate: timestamp("enquiry_date").defaultNow(),
      status: enquiryStatusEnum("status").default("New"),
      source: enquirySourceEnum("source").notNull(),
      targetDeliveryDate: timestamp("target_delivery_date"),
      notes: text("notes"),
      attachments: jsonb("attachments"),
      // File paths/URLs
      createdBy: uuid("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    enquiryItems = pgTable("enquiry_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      enquiryId: uuid("enquiry_id").references(() => enquiries.id).notNull(),
      itemId: uuid("item_id").references(() => items.id),
      description: text("description").notNull(),
      quantity: integer("quantity").notNull(),
      unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
      notes: text("notes")
    });
    requisitions = pgTable("requisitions", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      requisitionNumber: varchar("requisition_number", { length: 50 }).unique().notNull(),
      requestedBy: varchar("requested_by", { length: 255 }).notNull(),
      department: varchar("department", { length: 100 }).notNull(),
      priority: requisitionPriorityEnum("priority").notNull(),
      status: requisitionStatusEnum("status").default("Draft"),
      requestDate: timestamp("request_date").defaultNow(),
      requiredDate: timestamp("required_date").notNull(),
      approvedBy: varchar("approved_by", { length: 255 }),
      approvedDate: timestamp("approved_date"),
      totalEstimatedCost: decimal("total_estimated_cost", { precision: 12, scale: 2 }).notNull(),
      justification: text("justification").notNull(),
      notes: text("notes"),
      itemCount: integer("item_count").default(0),
      createdBy: uuid("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    requisitionItems = pgTable("requisition_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      requisitionId: uuid("requisition_id").references(() => requisitions.id).notNull(),
      itemDescription: text("item_description").notNull(),
      quantity: integer("quantity").notNull(),
      unitOfMeasure: varchar("unit_of_measure", { length: 50 }).notNull(),
      estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }).notNull(),
      specification: text("specification"),
      preferredSupplier: varchar("preferred_supplier", { length: 255 }),
      urgency: requisitionItemUrgencyEnum("urgency").default("Standard"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    approvalLevelEnum = pgEnum("approval_level", ["Sales Rep", "Manager", "Finance", "Director"]);
    quotations = pgTable("quotations", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      quoteNumber: varchar("quote_number", { length: 50 }).unique().notNull(),
      revision: integer("revision").default(1),
      // Revision tracking for audit purposes
      parentQuotationId: uuid("parent_quotation_id"),
      revisionReason: text("revision_reason"),
      supersededAt: timestamp("superseded_at"),
      supersededBy: uuid("superseded_by").references(() => users.id),
      isSuperseded: boolean("is_superseded").default(false),
      enquiryId: uuid("enquiry_id").references(() => enquiries.id),
      customerId: uuid("customer_id").references(() => customers.id).notNull(),
      customerType: customerTypeEnum("customer_type").notNull(),
      status: quotationStatusEnum("status").default("Draft"),
      quoteDate: timestamp("quote_date").defaultNow(),
      validUntil: timestamp("valid_until"),
      subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
      discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0"),
      discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }).default("0"),
      taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0"),
      totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
      terms: text("terms"),
      notes: text("notes"),
      approvalStatus: varchar("approval_status", { length: 50 }).default("Pending"),
      requiredApprovalLevel: approvalLevelEnum("required_approval_level"),
      approvedBy: uuid("approved_by").references(() => users.id),
      approvedAt: timestamp("approved_at"),
      rejectionReason: text("rejection_reason"),
      createdBy: uuid("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    quotationItems = pgTable("quotation_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      quotationId: uuid("quotation_id").references(() => quotations.id, { onDelete: "cascade" }).notNull(),
      // supplierCode: varchar("supplier_code", { length: 100 }), // Temporarily commented out due to DB schema issue
      // barcode: varchar("barcode", { length: 100 }), // Temporarily commented out due to DB schema issue
      description: text("description").notNull(),
      quantity: integer("quantity").notNull(),
      costPrice: decimal("cost_price", { precision: 12, scale: 4 }),
      markup: decimal("markup", { precision: 5, scale: 2 }),
      unitPrice: decimal("unit_price", { precision: 12, scale: 4 }).notNull(),
      lineTotal: decimal("line_total", { precision: 12, scale: 2 }).notNull(),
      isAccepted: boolean("is_accepted").default(true),
      rejectionReason: text("rejection_reason"),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow()
    });
    approvalRules = pgTable("approval_rules", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      name: varchar("name", { length: 255 }).notNull(),
      customerType: customerTypeEnum("customer_type"),
      minQuoteValue: decimal("min_quote_value", { precision: 12, scale: 2 }),
      maxQuoteValue: decimal("max_quote_value", { precision: 12, scale: 2 }),
      maxDiscountPercentage: decimal("max_discount_percentage", { precision: 5, scale: 2 }),
      requiredApprovalLevel: approvalLevelEnum("required_approval_level").notNull(),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    quotationApprovals = pgTable("quotation_approvals", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      quotationId: uuid("quotation_id").references(() => quotations.id, { onDelete: "cascade" }).notNull(),
      approverLevel: approvalLevelEnum("approver_level").notNull(),
      approverId: uuid("approver_id").references(() => users.id),
      status: varchar("status", { length: 50 }).notNull(),
      // "Pending", "Approved", "Rejected"
      comments: text("comments"),
      createdAt: timestamp("created_at").defaultNow()
    });
    salesOrders = pgTable("sales_orders", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      orderNumber: varchar("order_number", { length: 50 }).unique().notNull(),
      quotationId: uuid("quotation_id").references(() => quotations.id),
      customerId: uuid("customer_id").references(() => customers.id).notNull(),
      orderDate: timestamp("order_date").defaultNow(),
      status: salesOrderStatusEnum("status").default("Draft"),
      customerPoNumber: varchar("customer_po_number", { length: 100 }),
      customerPoDocument: varchar("customer_po_document", { length: 500 }),
      subtotal: decimal("subtotal", { precision: 12, scale: 2 }),
      taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }),
      totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
      paymentTerms: varchar("payment_terms", { length: 100 }),
      deliveryInstructions: text("delivery_instructions"),
      // Version control for amendments
      version: integer("version").default(1),
      parentOrderId: uuid("parent_order_id"),
      amendmentSequence: integer("amendment_sequence"),
      // Incremental sequence per parent (A1, A2, ...)
      amendmentReason: text("amendment_reason"),
      // Customer LPO validation
      customerLpoRequired: boolean("customer_lpo_required").default(true),
      customerLpoDocumentName: varchar("customer_lpo_document_name", { length: 255 }),
      customerLpoDocumentSize: integer("customer_lpo_document_size"),
      customerLpoValidationStatus: varchar("customer_lpo_validation_status", { length: 50 }).default("Pending"),
      customerLpoValidatedBy: uuid("customer_lpo_validated_by").references(() => users.id),
      customerLpoValidatedAt: timestamp("customer_lpo_validated_at"),
      // Order type tracking
      isPartialOrder: boolean("is_partial_order").default(false),
      sourceType: varchar("source_type", { length: 50 }).default("Manual"),
      // "Auto", "Manual"
      createdBy: uuid("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    salesOrderItems = pgTable("sales_order_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      salesOrderId: uuid("sales_order_id").references(() => salesOrders.id).notNull(),
      itemId: uuid("item_id").references(() => items.id).notNull(),
      lineNumber: integer("line_number"),
      // supplierCode: varchar("supplier_code", { length: 100 }), // Temporarily commented out due to DB schema issue
      // barcode: varchar("barcode", { length: 100 }).notNull(), // Temporarily commented out due to DB schema issue - Mandatory barcode enforcement
      quantity: integer("quantity").notNull(),
      unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
      totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
      deliveryRequirement: text("delivery_requirement"),
      specialInstructions: text("special_instructions")
    });
    supplierLpos = pgTable("supplier_lpos", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      lpoNumber: varchar("lpo_number", { length: 50 }).unique().notNull(),
      supplierId: uuid("supplier_id").references(() => suppliers.id).notNull(),
      status: supplierLpoStatusEnum("status").default("Draft"),
      lpoDate: timestamp("lpo_date").defaultNow(),
      expectedDeliveryDate: timestamp("expected_delivery_date"),
      requestedDeliveryDate: timestamp("requested_delivery_date"),
      // Auto-generation source tracking
      sourceType: varchar("source_type", { length: 50 }).default("Manual"),
      // "Auto", "Manual"
      sourceSalesOrderIds: jsonb("source_sales_order_ids"),
      // Array of sales order IDs for auto-generation
      sourceQuotationIds: jsonb("source_quotation_ids"),
      // Array of quotation IDs for direct traceability
      groupingCriteria: varchar("grouping_criteria", { length: 100 }),
      // "supplier", "delivery_date", "custom"
      // Financial details
      subtotal: decimal("subtotal", { precision: 12, scale: 2 }),
      taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }),
      totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
      currency: varchar("currency", { length: 10 }).default("BHD"),
      // Supplier details snapshot
      supplierContactPerson: varchar("supplier_contact_person", { length: 255 }),
      supplierEmail: varchar("supplier_email", { length: 255 }),
      supplierPhone: varchar("supplier_phone", { length: 50 }),
      // Terms and conditions
      paymentTerms: varchar("payment_terms", { length: 255 }),
      deliveryTerms: varchar("delivery_terms", { length: 255 }),
      termsAndConditions: text("terms_and_conditions"),
      specialInstructions: text("special_instructions"),
      // Amendment tracking
      version: integer("version").default(1),
      parentLpoId: uuid("parent_lpo_id"),
      amendmentReason: text("amendment_reason"),
      amendmentType: varchar("amendment_type", { length: 50 }),
      // "Quantity", "Price", "Delivery", "Terms", "Cancellation"
      // Approval workflow
      requiresApproval: boolean("requires_approval").default(false),
      approvalStatus: varchar("approval_status", { length: 50 }).default("Not Required"),
      // "Not Required", "Pending", "Approved", "Rejected"
      approvedBy: uuid("approved_by").references(() => users.id),
      approvedAt: timestamp("approved_at"),
      approvalNotes: text("approval_notes"),
      // Tracking
      sentToSupplierAt: timestamp("sent_to_supplier_at"),
      confirmedBySupplierAt: timestamp("confirmed_by_supplier_at"),
      supplierConfirmationReference: varchar("supplier_confirmation_reference", { length: 255 }),
      createdBy: uuid("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    supplierLpoItems = pgTable("supplier_lpo_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      supplierLpoId: uuid("supplier_lpo_id").references(() => supplierLpos.id).notNull(),
      salesOrderItemId: uuid("sales_order_item_id").references(() => salesOrderItems.id),
      quotationItemId: uuid("quotation_item_id").references(() => quotationItems.id),
      // Direct link to quotation item
      itemId: uuid("item_id").references(() => items.id).notNull(),
      lineNumber: integer("line_number"),
      // Item details
      supplierCode: varchar("supplier_code", { length: 100 }).notNull(),
      barcode: varchar("barcode", { length: 100 }).notNull(),
      itemDescription: text("item_description").notNull(),
      // Quantities
      quantity: integer("quantity").notNull(),
      receivedQuantity: integer("received_quantity").default(0),
      pendingQuantity: integer("pending_quantity").default(0),
      // Pricing
      unitCost: decimal("unit_cost", { precision: 10, scale: 2 }).notNull(),
      totalCost: decimal("total_cost", { precision: 12, scale: 2 }).notNull(),
      // Delivery
      requestedDeliveryDate: timestamp("requested_delivery_date"),
      confirmedDeliveryDate: timestamp("confirmed_delivery_date"),
      deliveryStatus: varchar("delivery_status", { length: 50 }).default("Pending"),
      // "Pending", "Partial", "Complete"
      // Special requirements
      urgency: varchar("urgency", { length: 50 }).default("Normal"),
      // "Low", "Normal", "High", "Urgent"
      specialInstructions: text("special_instructions"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    goodsReceipts = pgTable("goods_receipts", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      receiptNumber: varchar("receipt_number", { length: 50 }).unique().notNull(),
      supplierLpoId: uuid("supplier_lpo_id").references(() => supplierLpos.id).notNull(),
      receiptDate: timestamp("receipt_date").defaultNow(),
      status: goodsReceiptStatusEnum("status").default("Pending"),
      storageLocation: varchar("storage_location", { length: 100 }),
      notes: text("notes"),
      createdBy: uuid("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    legacyGoodsReceiptItems = pgTable("goods_receipt_items_legacy", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      goodsReceiptId: uuid("goods_receipt_id").references(() => goodsReceipts.id).notNull(),
      itemId: uuid("item_id").references(() => items.id).notNull(),
      orderedQuantity: integer("ordered_quantity").notNull(),
      receivedQuantity: integer("received_quantity").notNull(),
      damagedQuantity: integer("damaged_quantity").default(0),
      notes: text("notes")
    });
    deliveries = pgTable("deliveries", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      deliveryNumber: varchar("delivery_number", { length: 50 }).unique().notNull(),
      salesOrderId: uuid("sales_order_id").references(() => salesOrders.id).notNull(),
      deliveryDate: timestamp("delivery_date"),
      status: deliveryStatusEnum("status").default("Pending"),
      deliveryType: varchar("delivery_type", { length: 50 }).default("Full"),
      // "Full", "Partial"
      deliveryAddress: text("delivery_address"),
      deliveryNotes: text("delivery_notes"),
      deliveryDocument: varchar("delivery_document", { length: 500 }),
      deliveryDocumentName: varchar("delivery_document_name", { length: 255 }),
      deliveryDocumentSize: integer("delivery_document_size"),
      // Picking tracking
      pickingStartedBy: uuid("picking_started_by").references(() => users.id),
      pickingStartedAt: timestamp("picking_started_at"),
      pickingCompletedBy: uuid("picking_completed_by").references(() => users.id),
      pickingCompletedAt: timestamp("picking_completed_at"),
      pickingNotes: text("picking_notes"),
      // Delivery confirmation
      deliveryConfirmedBy: varchar("delivery_confirmed_by", { length: 255 }),
      deliveryConfirmedAt: timestamp("delivery_confirmed_at"),
      deliverySignature: text("delivery_signature"),
      // Base64 encoded signature
      // Tracking
      trackingNumber: varchar("tracking_number", { length: 100 }),
      carrierName: varchar("carrier_name", { length: 100 }),
      estimatedDeliveryDate: timestamp("estimated_delivery_date"),
      actualDeliveryDate: timestamp("actual_delivery_date"),
      createdBy: uuid("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    deliveryItems = pgTable("delivery_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      deliveryId: uuid("delivery_id").references(() => deliveries.id).notNull(),
      salesOrderItemId: uuid("sales_order_item_id").references(() => salesOrderItems.id).notNull(),
      itemId: uuid("item_id").references(() => items.id).notNull(),
      barcode: varchar("barcode", { length: 100 }).notNull(),
      // Barcode for picking verification
      supplierCode: varchar("supplier_code", { length: 100 }).notNull(),
      description: text("description").notNull(),
      orderedQuantity: integer("ordered_quantity").notNull(),
      pickedQuantity: integer("picked_quantity").notNull(),
      deliveredQuantity: integer("delivered_quantity").notNull(),
      unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
      totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
      // Picking details
      pickedBy: uuid("picked_by").references(() => users.id),
      pickedAt: timestamp("picked_at"),
      storageLocation: varchar("storage_location", { length: 100 }),
      pickingNotes: text("picking_notes"),
      // Quality control
      qualityChecked: boolean("quality_checked").default(false),
      qualityCheckedBy: uuid("quality_checked_by").references(() => users.id),
      qualityCheckedAt: timestamp("quality_checked_at"),
      qualityNotes: text("quality_notes")
    });
    invoices = pgTable("invoices", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      invoiceNumber: varchar("invoice_number", { length: 50 }).unique().notNull(),
      invoiceType: varchar("invoice_type", { length: 50 }).default("Final"),
      // "Proforma", "Final", "Credit Note"
      salesOrderId: uuid("sales_order_id").references(() => salesOrders.id).notNull(),
      deliveryId: uuid("delivery_id").references(() => deliveries.id),
      customerId: uuid("customer_id").references(() => customers.id).notNull(),
      invoiceDate: timestamp("invoice_date").defaultNow(),
      dueDate: timestamp("due_date"),
      status: invoiceStatusEnum("status").default("Draft"),
      // Multi-currency support
      currency: varchar("currency", { length: 10 }).default("BHD"),
      exchangeRate: decimal("exchange_rate", { precision: 10, scale: 4 }).default("1.0000"),
      baseCurrency: varchar("base_currency", { length: 10 }).default("BHD"),
      // Financial details in invoice currency
      subtotal: decimal("subtotal", { precision: 12, scale: 2 }),
      taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
      taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }),
      discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0"),
      discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }),
      totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
      paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }).default("0"),
      outstandingAmount: decimal("outstanding_amount", { precision: 12, scale: 2 }),
      // Financial details in base currency
      subtotalBase: decimal("subtotal_base", { precision: 12, scale: 2 }),
      taxAmountBase: decimal("tax_amount_base", { precision: 12, scale: 2 }),
      discountAmountBase: decimal("discount_amount_base", { precision: 12, scale: 2 }),
      totalAmountBase: decimal("total_amount_base", { precision: 12, scale: 2 }),
      // Payment tracking
      paymentTerms: varchar("payment_terms", { length: 100 }),
      paymentMethod: varchar("payment_method", { length: 50 }),
      paymentReference: varchar("payment_reference", { length: 100 }),
      lastPaymentDate: timestamp("last_payment_date"),
      // Auto-generation and linking
      autoGenerated: boolean("auto_generated").default(false),
      generatedFromDeliveryId: uuid("generated_from_delivery_id").references(() => deliveries.id),
      // Return and credit note support
      originalInvoiceId: uuid("original_invoice_id"),
      returnReason: text("return_reason"),
      // Document management
      invoiceDocument: varchar("invoice_document", { length: 500 }),
      invoiceDocumentName: varchar("invoice_document_name", { length: 255 }),
      invoiceDocumentSize: integer("invoice_document_size"),
      notes: text("notes"),
      internalNotes: text("internal_notes"),
      createdBy: uuid("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    invoiceItems = pgTable("invoice_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      invoiceId: uuid("invoice_id").references(() => invoices.id).notNull(),
      deliveryItemId: uuid("delivery_item_id").references(() => deliveryItems.id),
      itemId: uuid("item_id").references(() => items.id).notNull(),
      barcode: varchar("barcode", { length: 100 }).notNull(),
      supplierCode: varchar("supplier_code", { length: 100 }).notNull(),
      description: text("description").notNull(),
      lineNumber: integer("line_number").notNull(),
      quantity: integer("quantity").notNull(),
      // Pricing in invoice currency
      unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
      totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
      discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0"),
      discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
      taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
      taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0"),
      // Pricing in base currency
      unitPriceBase: decimal("unit_price_base", { precision: 10, scale: 2 }).notNull(),
      totalPriceBase: decimal("total_price_base", { precision: 12, scale: 2 }).notNull(),
      discountAmountBase: decimal("discount_amount_base", { precision: 10, scale: 2 }).default("0"),
      taxAmountBase: decimal("tax_amount_base", { precision: 10, scale: 2 }).default("0"),
      // Return and credit note support
      returnQuantity: integer("return_quantity").default(0),
      returnReason: text("return_reason"),
      notes: text("notes")
    });
    deliveryPickingSessions = pgTable("delivery_picking_sessions", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      deliveryId: uuid("delivery_id").references(() => deliveries.id).notNull(),
      sessionNumber: varchar("session_number", { length: 50 }).notNull(),
      startedBy: uuid("started_by").references(() => users.id).notNull(),
      startedAt: timestamp("started_at").defaultNow(),
      completedAt: timestamp("completed_at"),
      status: varchar("status", { length: 50 }).default("In Progress"),
      // "In Progress", "Completed", "Cancelled"
      totalItemsExpected: integer("total_items_expected").notNull(),
      totalItemsPicked: integer("total_items_picked").default(0),
      notes: text("notes")
    });
    deliveryPickedItems = pgTable("delivery_picked_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      pickingSessionId: uuid("picking_session_id").references(() => deliveryPickingSessions.id).notNull(),
      deliveryItemId: uuid("delivery_item_id").references(() => deliveryItems.id).notNull(),
      barcode: varchar("barcode", { length: 100 }).notNull(),
      quantityPicked: integer("quantity_picked").notNull(),
      storageLocation: varchar("storage_location", { length: 100 }),
      pickedBy: uuid("picked_by").references(() => users.id).notNull(),
      pickedAt: timestamp("picked_at").defaultNow(),
      verified: boolean("verified").default(false),
      verifiedBy: uuid("verified_by").references(() => users.id),
      verifiedAt: timestamp("verified_at"),
      notes: text("notes")
    });
    creditNotes = pgTable("credit_notes", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      creditNoteNumber: varchar("credit_note_number", { length: 50 }).unique().notNull(),
      originalInvoiceId: uuid("original_invoice_id").references(() => invoices.id).notNull(),
      customerId: uuid("customer_id").references(() => customers.id).notNull(),
      creditNoteDate: timestamp("credit_note_date").defaultNow(),
      reason: text("reason").notNull(),
      status: varchar("status", { length: 50 }).default("Draft"),
      // "Draft", "Issued", "Applied", "Cancelled"
      // Multi-currency support
      currency: varchar("currency", { length: 10 }).default("BHD"),
      exchangeRate: decimal("exchange_rate", { precision: 10, scale: 4 }).default("1.0000"),
      subtotal: decimal("subtotal", { precision: 12, scale: 2 }),
      taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }),
      totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
      appliedAmount: decimal("applied_amount", { precision: 12, scale: 2 }).default("0"),
      notes: text("notes"),
      createdBy: uuid("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    creditNoteItems = pgTable("credit_note_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      creditNoteId: uuid("credit_note_id").references(() => creditNotes.id).notNull(),
      originalInvoiceItemId: uuid("original_invoice_item_id").references(() => invoiceItems.id).notNull(),
      itemId: uuid("item_id").references(() => items.id).notNull(),
      barcode: varchar("barcode", { length: 100 }).notNull(),
      description: text("description").notNull(),
      returnQuantity: integer("return_quantity").notNull(),
      unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
      totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
      taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
      taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0"),
      returnReason: text("return_reason"),
      condition: varchar("condition", { length: 50 })
      // "Good", "Damaged", "Defective"
    });
    auditLogs = pgTable("audit_log", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      entityType: varchar("entity_type", { length: 100 }).notNull(),
      entityId: uuid("entity_id").notNull(),
      action: varchar("action", { length: 50 }).notNull(),
      oldData: jsonb("old_data"),
      newData: jsonb("new_data"),
      userId: uuid("user_id").references(() => users.id),
      timestamp: timestamp("timestamp").defaultNow()
    });
    customerAcceptances = pgTable("customer_acceptances", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      quotationId: uuid("quotation_id").references(() => quotations.id).notNull(),
      acceptanceType: text("acceptance_type").notNull(),
      // "Full" or "Partial"
      acceptedAt: timestamp("accepted_at").defaultNow().notNull(),
      acceptedBy: varchar("accepted_by", { length: 255 }).notNull(),
      // Customer contact person
      customerEmail: varchar("customer_email", { length: 255 }),
      customerNotes: text("customer_notes"),
      totalAcceptedAmount: decimal("total_accepted_amount", { precision: 12, scale: 2 }),
      status: varchar("status", { length: 50 }).default("Active").notNull(),
      // "Active", "Superseded", "Cancelled"
      internalNotes: text("internal_notes"),
      processedBy: uuid("processed_by").references(() => users.id),
      processedAt: timestamp("processed_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    purchaseOrders = pgTable("purchase_orders", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      quotationId: uuid("quotation_id").references(() => quotations.id).notNull(),
      customerAcceptanceId: uuid("customer_acceptance_id").references(() => customerAcceptances.id),
      poNumber: varchar("po_number", { length: 100 }).notNull(),
      poDate: timestamp("po_date").notNull(),
      customerReference: varchar("customer_reference", { length: 255 }),
      documentPath: varchar("document_path", { length: 500 }).notNull(),
      documentName: varchar("document_name", { length: 255 }).notNull(),
      documentSize: integer("document_size"),
      documentType: varchar("document_type", { length: 50 }).notNull(),
      // PDF, PNG, JPG, etc.
      uploadedBy: uuid("uploaded_by").references(() => users.id).notNull(),
      validationStatus: varchar("validation_status", { length: 50 }).default("Pending").notNull(),
      // "Pending", "Valid", "Invalid", "Requires Review"
      validationNotes: text("validation_notes"),
      validatedBy: uuid("validated_by").references(() => users.id),
      validatedAt: timestamp("validated_at"),
      totalPoAmount: decimal("total_po_amount", { precision: 12, scale: 2 }),
      currency: varchar("currency", { length: 10 }).default("BHD").notNull(),
      paymentTerms: varchar("payment_terms", { length: 255 }),
      deliveryTerms: varchar("delivery_terms", { length: 255 }),
      specialInstructions: text("special_instructions"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    quotationItemAcceptances = pgTable("quotation_item_acceptances", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      customerAcceptanceId: uuid("customer_acceptance_id").references(() => customerAcceptances.id).notNull(),
      quotationItemId: uuid("quotation_item_id").references(() => quotationItems.id).notNull(),
      isAccepted: boolean("is_accepted").notNull(),
      originalQuantity: integer("original_quantity").notNull(),
      acceptedQuantity: integer("accepted_quantity"),
      rejectedQuantity: integer("rejected_quantity"),
      rejectionReason: text("rejection_reason"),
      customerNotes: text("customer_notes"),
      acceptedUnitPrice: decimal("accepted_unit_price", { precision: 12, scale: 4 }),
      acceptedLineTotal: decimal("accepted_line_total", { precision: 12, scale: 2 }),
      deliveryRequirement: text("delivery_requirement"),
      priority: varchar("priority", { length: 50 }).default("Medium"),
      // "Low", "Medium", "High", "Urgent"
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    poLineItems = pgTable("po_line_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      purchaseOrderId: uuid("purchase_order_id").references(() => purchaseOrders.id).notNull(),
      quotationItemId: uuid("quotation_item_id").references(() => quotationItems.id),
      itemDescription: text("item_description").notNull(),
      poQuantity: integer("po_quantity").notNull(),
      poUnitPrice: decimal("po_unit_price", { precision: 12, scale: 4 }),
      poLineTotal: decimal("po_line_total", { precision: 12, scale: 2 }),
      matchStatus: varchar("match_status", { length: 50 }).default("Not Validated").notNull(),
      // "Matched", "Quantity Mismatch", "Price Mismatch", "Item Not Found", "Not Validated"
      discrepancyNotes: text("discrepancy_notes"),
      validatedBy: uuid("validated_by").references(() => users.id),
      validatedAt: timestamp("validated_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    acceptanceConfirmations = pgTable("acceptance_confirmations", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      customerAcceptanceId: uuid("customer_acceptance_id").references(() => customerAcceptances.id).notNull(),
      confirmationType: varchar("confirmation_type", { length: 50 }).notNull(),
      // "Email", "Phone", "Portal", "Document", "Meeting"
      confirmationMethod: varchar("confirmation_method", { length: 255 }).notNull(),
      confirmedBy: varchar("confirmed_by", { length: 255 }).notNull(),
      confirmedAt: timestamp("confirmed_at").notNull(),
      confirmationReference: varchar("confirmation_reference", { length: 255 }),
      confirmationDetails: text("confirmation_details"),
      ipAddress: varchar("ip_address", { length: 45 }),
      userAgent: text("user_agent"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    shipments = pgTable("shipments", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      shipmentNumber: varchar("shipment_number", { length: 50 }).unique().notNull(),
      trackingNumber: varchar("tracking_number", { length: 100 }).unique().notNull(),
      salesOrderId: uuid("sales_order_id").references(() => salesOrders.id),
      supplierId: uuid("supplier_id").references(() => suppliers.id),
      carrierId: uuid("carrier_id").references(() => suppliers.id),
      // Carriers are treated as suppliers
      carrierName: varchar("carrier_name", { length: 255 }).notNull(),
      serviceType: shipmentServiceTypeEnum("service_type").default("Standard").notNull(),
      status: shipmentStatusEnum("status").default("Pending").notNull(),
      priority: shipmentPriorityEnum("priority").default("Medium").notNull(),
      origin: varchar("origin", { length: 255 }).notNull(),
      destination: varchar("destination", { length: 255 }).notNull(),
      estimatedDelivery: timestamp("estimated_delivery"),
      actualDelivery: timestamp("actual_delivery"),
      weight: decimal("weight", { precision: 8, scale: 2 }),
      dimensions: varchar("dimensions", { length: 100 }),
      declaredValue: decimal("declared_value", { precision: 12, scale: 2 }),
      currency: varchar("currency", { length: 10 }).default("AED"),
      shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }),
      customerReference: varchar("customer_reference", { length: 100 }),
      specialInstructions: text("special_instructions"),
      packageCount: integer("package_count").default(1),
      isInsured: boolean("is_insured").default(false),
      requiresSignature: boolean("requires_signature").default(false),
      currentLocation: varchar("current_location", { length: 255 }),
      lastUpdate: timestamp("last_update").defaultNow(),
      createdBy: uuid("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    shipmentTrackingEvents = pgTable("shipment_tracking_events", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      shipmentId: uuid("shipment_id").references(() => shipments.id).notNull(),
      timestamp: timestamp("timestamp").defaultNow().notNull(),
      location: varchar("location", { length: 255 }).notNull(),
      status: varchar("status", { length: 100 }).notNull(),
      description: text("description").notNull(),
      scanType: trackingEventTypeEnum("scan_type").notNull(),
      latitude: decimal("latitude", { precision: 10, scale: 8 }),
      longitude: decimal("longitude", { precision: 11, scale: 8 }),
      employeeId: uuid("employee_id").references(() => users.id),
      facilityId: varchar("facility_id", { length: 100 }),
      nextExpectedLocation: varchar("next_expected_location", { length: 255 }),
      estimatedArrival: timestamp("estimated_arrival"),
      createdAt: timestamp("created_at").defaultNow()
    });
    customersRelations = relations(customers, ({ many }) => ({
      enquiries: many(enquiries),
      quotations: many(quotations),
      salesOrders: many(salesOrders),
      invoices: many(invoices)
    }));
    suppliersRelations = relations(suppliers, ({ many }) => ({
      items: many(items),
      supplierLpos: many(supplierLpos)
    }));
    itemsRelations = relations(items, ({ one, many }) => ({
      supplier: one(suppliers, {
        fields: [items.supplierId],
        references: [suppliers.id]
      }),
      enquiryItems: many(enquiryItems),
      quotationItems: many(quotationItems),
      salesOrderItems: many(salesOrderItems)
    }));
    enquiriesRelations = relations(enquiries, ({ one, many }) => ({
      customer: one(customers, {
        fields: [enquiries.customerId],
        references: [customers.id]
      }),
      items: many(enquiryItems),
      quotations: many(quotations)
    }));
    requisitionsRelations = relations(requisitions, ({ many }) => ({
      items: many(requisitionItems)
    }));
    requisitionItemsRelations = relations(requisitionItems, ({ one }) => ({
      requisition: one(requisitions, {
        fields: [requisitionItems.requisitionId],
        references: [requisitions.id]
      })
    }));
    quotationsRelations = relations(quotations, ({ one, many }) => ({
      enquiry: one(enquiries, {
        fields: [quotations.enquiryId],
        references: [enquiries.id]
      }),
      customer: one(customers, {
        fields: [quotations.customerId],
        references: [customers.id]
      }),
      items: many(quotationItems),
      salesOrders: many(salesOrders),
      customerAcceptances: many(customerAcceptances),
      purchaseOrders: many(purchaseOrders)
    }));
    customerAcceptancesRelations = relations(customerAcceptances, ({ one, many }) => ({
      quotation: one(quotations, {
        fields: [customerAcceptances.quotationId],
        references: [quotations.id]
      }),
      itemAcceptances: many(quotationItemAcceptances),
      purchaseOrders: many(purchaseOrders),
      confirmations: many(acceptanceConfirmations)
    }));
    purchaseOrdersRelations = relations(purchaseOrders, ({ one, many }) => ({
      quotation: one(quotations, {
        fields: [purchaseOrders.quotationId],
        references: [quotations.id]
      }),
      customerAcceptance: one(customerAcceptances, {
        fields: [purchaseOrders.customerAcceptanceId],
        references: [customerAcceptances.id]
      }),
      lineItems: many(poLineItems)
    }));
    quotationItemAcceptancesRelations = relations(quotationItemAcceptances, ({ one }) => ({
      customerAcceptance: one(customerAcceptances, {
        fields: [quotationItemAcceptances.customerAcceptanceId],
        references: [customerAcceptances.id]
      }),
      quotationItem: one(quotationItems, {
        fields: [quotationItemAcceptances.quotationItemId],
        references: [quotationItems.id]
      })
    }));
    poLineItemsRelations = relations(poLineItems, ({ one }) => ({
      purchaseOrder: one(purchaseOrders, {
        fields: [poLineItems.purchaseOrderId],
        references: [purchaseOrders.id]
      }),
      quotationItem: one(quotationItems, {
        fields: [poLineItems.quotationItemId],
        references: [quotationItems.id]
      })
    }));
    salesOrdersRelations = relations(salesOrders, ({ one, many }) => ({
      quotation: one(quotations, {
        fields: [salesOrders.quotationId],
        references: [quotations.id]
      }),
      customer: one(customers, {
        fields: [salesOrders.customerId],
        references: [customers.id]
      }),
      items: many(salesOrderItems),
      deliveries: many(deliveries),
      invoices: many(invoices),
      shipments: many(shipments)
    }));
    shipmentsRelations = relations(shipments, ({ one, many }) => ({
      salesOrder: one(salesOrders, {
        fields: [shipments.salesOrderId],
        references: [salesOrders.id]
      }),
      supplier: one(suppliers, {
        fields: [shipments.supplierId],
        references: [suppliers.id]
      }),
      carrier: one(suppliers, {
        fields: [shipments.carrierId],
        references: [suppliers.id]
      }),
      createdBy: one(users, {
        fields: [shipments.createdBy],
        references: [users.id]
      }),
      trackingEvents: many(shipmentTrackingEvents)
    }));
    shipmentTrackingEventsRelations = relations(shipmentTrackingEvents, ({ one }) => ({
      shipment: one(shipments, {
        fields: [shipmentTrackingEvents.shipmentId],
        references: [shipments.id]
      }),
      employee: one(users, {
        fields: [shipmentTrackingEvents.employeeId],
        references: [users.id]
      })
    }));
    insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true, updatedAt: true });
    insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true, createdAt: true, updatedAt: true });
    insertItemSchema = createInsertSchema(items).omit({ id: true, createdAt: true, updatedAt: true });
    insertEnquirySchema = createInsertSchema(enquiries, {
      targetDeliveryDate: z.string().optional(),
      createdBy: z.string().uuid().optional()
    }).omit({ id: true, enquiryNumber: true, createdAt: true, updatedAt: true });
    updateEnquirySchema = createInsertSchema(enquiries, {
      targetDeliveryDate: z.string().optional(),
      createdBy: z.string().uuid().optional(),
      customerId: z.string().uuid().optional()
      // Make customerId optional for updates
    }).omit({ id: true, enquiryNumber: true, createdAt: true, updatedAt: true }).partial().extend({
      // Override customerId to handle empty strings and null values gracefully
      customerId: z.union([
        z.string().uuid(),
        z.string().length(0),
        // Allow empty string
        z.null()
      ]).optional().transform((val) => {
        if (val === "" || val === null) return void 0;
        return val;
      })
    });
    insertEnquiryItemSchema = createInsertSchema(enquiryItems).omit({ id: true }).extend({
      description: z.string().min(1, "Description is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      unitPrice: z.union([z.number(), z.string().transform((val) => parseFloat(val))]).optional()
    });
    insertRequisitionSchema = createInsertSchema(requisitions, {
      requiredDate: z.string().transform((val) => new Date(val)),
      totalEstimatedCost: z.union([z.number(), z.string().transform((val) => parseFloat(val))]),
      createdBy: z.string().uuid().optional()
    }).omit({ id: true, requisitionNumber: true, createdAt: true, updatedAt: true });
    insertRequisitionItemSchema = createInsertSchema(requisitionItems, {
      estimatedCost: z.union([z.number(), z.string().transform((val) => parseFloat(val))])
    }).omit({ id: true, createdAt: true, updatedAt: true }).extend({
      itemDescription: z.string().min(1, "Item description is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      unitOfMeasure: z.string().min(1, "Unit of measure is required")
    });
    insertQuotationSchema = createInsertSchema(quotations, {
      validUntil: z.union([z.string(), z.date()]).optional().transform((val) => val ? new Date(val) : void 0),
      createdBy: z.string().uuid().optional()
    }).omit({ id: true, createdAt: true, updatedAt: true, parentQuotationId: true, quoteNumber: true });
    createQuotationRevisionSchema = z.object({
      revisionReason: z.string().min(1, "Revision reason is required"),
      quoteDate: z.string().optional(),
      validUntil: z.string().optional(),
      subtotal: z.string().optional(),
      discountPercentage: z.string().optional(),
      discountAmount: z.string().optional(),
      taxAmount: z.string().optional(),
      totalAmount: z.string().optional(),
      terms: z.string().optional(),
      notes: z.string().optional(),
      items: z.array(z.object({
        description: z.string().min(1),
        quantity: z.number().min(1),
        costPrice: z.string().optional(),
        markup: z.string().optional(),
        unitPrice: z.string().min(1),
        lineTotal: z.string().min(1),
        isAccepted: z.boolean().optional(),
        rejectionReason: z.string().optional(),
        notes: z.string().optional()
      })).optional()
    });
    insertQuotationItemSchema = z.object({
      quotationId: z.string().uuid(),
      description: z.string().min(1, "Description is required"),
      quantity: z.number().int().min(1, "Quantity must be at least 1"),
      costPrice: z.union([
        z.number(),
        z.string().min(1).transform((v) => parseFloat(v))
      ]).optional().transform((v) => v === void 0 || v === null || typeof v === "number" && isNaN(v) ? void 0 : v),
      markup: z.union([
        z.number(),
        z.string().min(1).transform((v) => parseFloat(v))
      ]).optional().transform((v) => v === void 0 || v === null || typeof v === "number" && isNaN(v) ? void 0 : v),
      unitPrice: z.union([
        z.number(),
        z.string().min(1).transform((v) => parseFloat(v))
      ]).transform((v) => typeof v === "string" ? parseFloat(v) : v),
      lineTotal: z.union([
        z.number(),
        z.string().min(1).transform((v) => parseFloat(v))
      ]).optional(),
      isAccepted: z.boolean().optional(),
      rejectionReason: z.string().optional(),
      notes: z.string().optional()
    }).superRefine((data, ctx) => {
      if (data.lineTotal === void 0) {
        if (typeof data.quantity === "number" && typeof data.unitPrice === "number") {
          data.lineTotal = parseFloat((data.quantity * data.unitPrice).toFixed(2));
        } else {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Cannot compute lineTotal without numeric quantity and unitPrice" });
        }
      }
    });
    insertApprovalRuleSchema = createInsertSchema(approvalRules).omit({ id: true, createdAt: true, updatedAt: true });
    insertQuotationApprovalSchema = createInsertSchema(quotationApprovals).omit({ id: true, createdAt: true });
    insertCustomerAcceptanceSchema = createInsertSchema(customerAcceptances).omit({ id: true, createdAt: true, updatedAt: true });
    insertPurchaseOrderSchema = createInsertSchema(purchaseOrders, {
      poDate: z.union([
        z.string().min(1).transform((v) => new Date(v)),
        z.date()
      ]).transform((v) => v instanceof Date ? v : new Date(v))
    }).omit({ id: true, createdAt: true, updatedAt: true });
    insertQuotationItemAcceptanceSchema = createInsertSchema(quotationItemAcceptances).omit({ id: true, createdAt: true, updatedAt: true });
    insertPoLineItemSchema = createInsertSchema(poLineItems).omit({ id: true, createdAt: true, updatedAt: true });
    insertAcceptanceConfirmationSchema = createInsertSchema(acceptanceConfirmations, {
      confirmedAt: z.string()
    }).omit({ id: true, createdAt: true });
    insertSalesOrderSchema = createInsertSchema(salesOrders).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      version: true,
      customerLpoValidatedAt: true,
      orderNumber: true
      // Auto-generated in storage layer
    });
    insertSalesOrderItemSchema = createInsertSchema(salesOrderItems).omit({ id: true });
    insertSupplierLpoSchema = createInsertSchema(supplierLpos).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      version: true,
      approvedAt: true,
      sentToSupplierAt: true,
      confirmedBySupplierAt: true
    });
    insertSupplierLpoItemSchema = createInsertSchema(supplierLpoItems).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertInvoiceSchema = createInsertSchema(invoices);
    inventoryItems = pgTable("inventory_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      supplierCode: varchar("supplier_code", { length: 255 }).notNull().unique(),
      description: text("description").notNull(),
      category: varchar("category", { length: 255 }).notNull(),
      unitOfMeasure: varchar("unit_of_measure", { length: 100 }).notNull(),
      supplierId: uuid("supplier_id").references(() => suppliers.id),
      barcode: varchar("barcode", { length: 255 }),
      weight: decimal("weight", { precision: 10, scale: 3 }),
      dimensions: varchar("dimensions", { length: 255 }),
      totalStock: integer("total_stock").default(0),
      reservedQuantity: integer("reserved_quantity").default(0),
      availableQuantity: integer("available_quantity").default(0),
      storageLocation: varchar("storage_location", { length: 255 }),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    inventoryVariants = pgTable("inventory_variants", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      inventoryItemId: uuid("inventory_item_id").notNull().references(() => inventoryItems.id, { onDelete: "cascade" }),
      variantName: varchar("variant_name", { length: 255 }).notNull(),
      variantValue: varchar("variant_value", { length: 255 }).notNull(),
      additionalCost: decimal("additional_cost", { precision: 10, scale: 2 }).default("0"),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    inventoryLevels = pgTable("inventory_levels", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      inventoryItemId: uuid("inventory_item_id").references(() => inventoryItems.id, { onDelete: "cascade" }),
      storageLocation: varchar("storage_location", { length: 255 }).notNull(),
      quantityAvailable: integer("quantity_available").default(0),
      quantityReserved: integer("quantity_reserved").default(0),
      reorderLevel: integer("reorder_level").default(0),
      maxStockLevel: integer("max_stock_level").default(0),
      lastUpdated: timestamp("last_updated").defaultNow(),
      createdAt: timestamp("created_at").defaultNow()
    });
    goodsReceiptHeaders = pgTable("goods_receipt_headers", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      receiptNumber: text("receipt_number").notNull().unique(),
      supplierLpoId: uuid("supplier_lpo_id").references(() => supplierLpos.id),
      supplierId: uuid("supplier_id").notNull().references(() => suppliers.id),
      receiptDate: date("receipt_date").notNull(),
      expectedDeliveryDate: date("expected_delivery_date"),
      actualDeliveryDate: date("actual_delivery_date"),
      receivedBy: text("received_by"),
      status: text("status").notNull().default("Draft"),
      // Draft, Partial, Complete, Discrepancy, Approved
      notes: text("notes"),
      totalItems: integer("total_items").default(0),
      totalQuantityExpected: integer("total_quantity_expected").default(0),
      totalQuantityReceived: integer("total_quantity_received").default(0),
      discrepancyFlag: boolean("discrepancy_flag").default(false),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    goodsReceiptItems = pgTable("goods_receipt_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      receiptHeaderId: uuid("receipt_header_id").notNull().references(() => goodsReceiptHeaders.id, { onDelete: "cascade" }),
      lpoItemId: uuid("lpo_item_id").references(() => supplierLpoItems.id),
      itemId: uuid("item_id").references(() => inventoryItems.id),
      variantId: uuid("variant_id").references(() => inventoryVariants.id),
      barcode: text("barcode"),
      supplierCode: text("supplier_code"),
      itemDescription: text("item_description").notNull(),
      quantityExpected: integer("quantity_expected").notNull(),
      quantityReceived: integer("quantity_received").default(0),
      quantityDamaged: integer("quantity_damaged").default(0),
      quantityShort: integer("quantity_short").default(0),
      unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
      totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
      storageLocation: text("storage_location"),
      batchNumber: text("batch_number"),
      expiryDate: date("expiry_date"),
      condition: text("condition").default("Good"),
      // Good, Damaged, Defective
      discrepancyReason: text("discrepancy_reason"),
      scannedAt: timestamp("scanned_at"),
      receivedAt: timestamp("received_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    scanningSessions = pgTable("scanning_sessions", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      goodsReceiptId: uuid("goods_receipt_id").references(() => goodsReceipts.id, { onDelete: "cascade" }),
      sessionName: varchar("session_name", { length: 255 }).notNull(),
      status: varchar("status", { length: 50 }).default("active"),
      createdBy: varchar("created_by", { length: 255 }),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    scannedItems = pgTable("scanned_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      scanningSessionId: uuid("scanning_session_id").references(() => scanningSessions.id, { onDelete: "cascade" }),
      inventoryItemId: uuid("inventory_item_id").references(() => inventoryItems.id, { onDelete: "cascade" }),
      barcode: varchar("barcode", { length: 255 }).notNull(),
      quantityScanned: integer("quantity_scanned").notNull(),
      scannedAt: timestamp("scanned_at").defaultNow(),
      status: varchar("status", { length: 50 }).default("pending"),
      notes: text("notes")
    });
    supplierReturns = pgTable("supplier_returns", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      returnNumber: varchar("return_number", { length: 255 }).notNull().unique(),
      supplierId: uuid("supplier_id").references(() => suppliers.id),
      goodsReceiptId: uuid("goods_receipt_id").references(() => goodsReceipts.id),
      returnDate: timestamp("return_date").defaultNow(),
      returnReason: text("return_reason").notNull(),
      status: varchar("status", { length: 50 }).default("pending"),
      totalReturnValue: decimal("total_return_value", { precision: 12, scale: 2 }).default("0"),
      debitNoteNumber: varchar("debit_note_number", { length: 255 }),
      debitNoteGenerated: boolean("debit_note_generated").default(false),
      notes: text("notes"),
      createdBy: varchar("created_by", { length: 255 }),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    supplierReturnItems = pgTable("supplier_return_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      supplierReturnId: uuid("supplier_return_id").references(() => supplierReturns.id, { onDelete: "cascade" }),
      inventoryItemId: uuid("inventory_item_id").references(() => inventoryItems.id, { onDelete: "cascade" }),
      quantityReturned: integer("quantity_returned").notNull(),
      unitCost: decimal("unit_cost", { precision: 10, scale: 2 }).notNull(),
      totalCost: decimal("total_cost", { precision: 12, scale: 2 }).notNull(),
      returnReason: text("return_reason"),
      conditionNotes: text("condition_notes"),
      createdAt: timestamp("created_at").defaultNow()
    });
    stockMovements = pgTable("stock_movements", {
      id: text("id").primaryKey().$defaultFn(() => nanoid2()),
      itemId: uuid("item_id").references(() => inventoryItems.id),
      variantId: uuid("variant_id").references(() => inventoryVariants.id),
      movementType: text("movement_type").notNull(),
      // Receipt, Issue, Transfer, Adjustment, Return
      referenceType: text("reference_type"),
      // GoodsReceipt, SalesOrder, Transfer, Adjustment, Return
      referenceId: text("reference_id"),
      storageLocation: text("storage_location"),
      // Explicit from/to locations for transfers (previously only storageLocation was stored)
      fromLocation: varchar("from_location", { length: 128 }),
      toLocation: varchar("to_location", { length: 128 }),
      quantityBefore: integer("quantity_before").notNull(),
      quantityMoved: integer("quantity_moved").notNull(),
      quantityAfter: integer("quantity_after").notNull(),
      unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
      totalValue: decimal("total_value", { precision: 10, scale: 2 }),
      status: text("status"),
      // Draft, Pending Approval, Approved, In Transit, Completed, Cancelled
      notes: text("notes"),
      createdBy: text("created_by"),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertInventoryVariantSchema = createInsertSchema(inventoryVariants).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertInventoryLevelSchema = createInsertSchema(inventoryLevels).omit({
      id: true,
      createdAt: true,
      lastUpdated: true
    });
    insertScanningSessionSchema = createInsertSchema(scanningSessions).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertScannedItemSchema = createInsertSchema(scannedItems).omit({
      id: true,
      scannedAt: true
    });
    insertSupplierReturnSchema = createInsertSchema(supplierReturns).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertSupplierReturnItemSchema = createInsertSchema(supplierReturnItems).omit({
      id: true,
      createdAt: true
    });
    insertGoodsReceiptHeaderSchema = createInsertSchema(goodsReceiptHeaders, {
      receiptDate: z.string(),
      expectedDeliveryDate: z.string().optional(),
      actualDeliveryDate: z.string().optional()
    }).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertGoodsReceiptItemSchema = createInsertSchema(goodsReceiptItems, {
      expiryDate: z.string().optional()
    }).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertStockMovementSchema = createInsertSchema(stockMovements).omit({
      id: true,
      createdAt: true
    });
    insertDeliverySchema = createInsertSchema(deliveries).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertDeliveryItemSchema = createInsertSchema(deliveryItems).omit({
      id: true
    });
    insertInvoiceItemSchema = createInsertSchema(invoiceItems).omit({
      id: true
    });
    insertDeliveryPickingSessionSchema = createInsertSchema(deliveryPickingSessions).omit({
      id: true,
      startedAt: true
    });
    insertDeliveryPickedItemSchema = createInsertSchema(deliveryPickedItems).omit({
      id: true,
      pickedAt: true
    });
    insertShipmentSchema = createInsertSchema(shipments).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      lastUpdate: true
    });
    insertShipmentTrackingEventSchema = createInsertSchema(shipmentTrackingEvents).omit({
      id: true,
      createdAt: true
    });
    insertCreditNoteSchema = createInsertSchema(creditNotes).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertCreditNoteItemSchema = createInsertSchema(creditNoteItems).omit({
      id: true
    });
    pricingMarkupLevelEnum = pgEnum("pricing_markup_level", ["System", "Category", "Item"]);
    pricingRuleTypeEnum = pgEnum("pricing_rule_type", ["Retail", "Wholesale", "Custom"]);
    productCategories = pgTable("product_categories", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description"),
      parentCategoryId: uuid("parent_category_id"),
      retailMarkupPercentage: decimal("retail_markup_percentage", { precision: 5, scale: 2 }),
      wholesaleMarkupPercentage: decimal("wholesale_markup_percentage", { precision: 5, scale: 2 }),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    markupConfiguration = pgTable("markup_configuration", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      level: pricingMarkupLevelEnum("level").notNull(),
      entityId: uuid("entity_id"),
      // null for system-wide, category_id for category, item_id for item
      retailMarkupPercentage: decimal("retail_markup_percentage", { precision: 5, scale: 2 }).notNull(),
      wholesaleMarkupPercentage: decimal("wholesale_markup_percentage", { precision: 5, scale: 2 }).notNull(),
      effectiveFrom: timestamp("effective_from").defaultNow(),
      effectiveTo: timestamp("effective_to"),
      isActive: boolean("is_active").default(true),
      createdBy: uuid("created_by"),
      updatedBy: uuid("updated_by"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    itemPricing = pgTable("item_pricing", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      itemId: uuid("item_id").notNull(),
      supplierCost: decimal("supplier_cost", { precision: 12, scale: 2 }).notNull(),
      retailPrice: decimal("retail_price", { precision: 12, scale: 2 }).notNull(),
      wholesalePrice: decimal("wholesale_price", { precision: 12, scale: 2 }).notNull(),
      retailMarkupPercentage: decimal("retail_markup_percentage", { precision: 5, scale: 2 }),
      wholesaleMarkupPercentage: decimal("wholesale_markup_percentage", { precision: 5, scale: 2 }),
      isManualOverride: boolean("is_manual_override").default(false),
      overrideReason: text("override_reason"),
      currency: varchar("currency", { length: 3 }).default("BHD"),
      effectiveFrom: timestamp("effective_from").defaultNow(),
      effectiveTo: timestamp("effective_to"),
      isActive: boolean("is_active").default(true),
      createdBy: uuid("created_by"),
      updatedBy: uuid("updated_by"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    customerPricing = pgTable("customer_pricing", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      customerId: uuid("customer_id").notNull(),
      itemId: uuid("item_id").notNull(),
      specialPrice: decimal("special_price", { precision: 12, scale: 2 }).notNull(),
      discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }),
      minimumQuantity: integer("minimum_quantity").default(1),
      maximumQuantity: integer("maximum_quantity"),
      validFrom: timestamp("valid_from").defaultNow(),
      validTo: timestamp("valid_to"),
      isActive: boolean("is_active").default(true),
      createdBy: uuid("created_by"),
      updatedBy: uuid("updated_by"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    pricingRules = pgTable("pricing_rules", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description"),
      ruleType: pricingRuleTypeEnum("rule_type").notNull(),
      conditions: jsonb("conditions").notNull(),
      // JSON conditions for rule application
      actions: jsonb("actions").notNull(),
      // JSON actions for price calculation
      priority: integer("priority").default(100),
      isActive: boolean("is_active").default(true),
      createdBy: uuid("created_by"),
      updatedBy: uuid("updated_by"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    priceLists = pgTable("price_lists", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description"),
      type: varchar("type", { length: 50 }).notNull(),
      // "retail", "wholesale", "custom"
      customerId: uuid("customer_id"),
      // for customer-specific price lists
      categoryId: uuid("category_id"),
      // for category-specific price lists
      currency: varchar("currency", { length: 3 }).default("BHD"),
      validFrom: timestamp("valid_from").defaultNow(),
      validTo: timestamp("valid_to"),
      generatedAt: timestamp("generated_at"),
      fileUrl: varchar("file_url", { length: 500 }),
      downloadCount: integer("download_count").default(0),
      isActive: boolean("is_active").default(true),
      createdBy: uuid("created_by"),
      updatedBy: uuid("updated_by"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    priceListItems = pgTable("price_list_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      priceListId: uuid("price_list_id").notNull(),
      itemId: uuid("item_id").notNull(),
      price: decimal("price", { precision: 12, scale: 2 }).notNull(),
      effectivePrice: decimal("effective_price", { precision: 12, scale: 2 }).notNull(),
      discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }),
      minimumQuantity: integer("minimum_quantity").default(1),
      notes: text("notes")
    });
    priceChangeHistory = pgTable("price_change_history", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      itemId: uuid("item_id").notNull(),
      changeType: varchar("change_type", { length: 50 }).notNull(),
      // "cost_update", "markup_change", "manual_override"
      oldSupplierCost: decimal("old_supplier_cost", { precision: 12, scale: 2 }),
      newSupplierCost: decimal("new_supplier_cost", { precision: 12, scale: 2 }),
      oldRetailPrice: decimal("old_retail_price", { precision: 12, scale: 2 }),
      newRetailPrice: decimal("new_retail_price", { precision: 12, scale: 2 }),
      oldWholesalePrice: decimal("old_wholesale_price", { precision: 12, scale: 2 }),
      newWholesalePrice: decimal("new_wholesale_price", { precision: 12, scale: 2 }),
      reason: text("reason"),
      triggeredBy: varchar("triggered_by", { length: 100 }),
      // "system", "manual", "supplier_update"
      userId: uuid("user_id"),
      createdAt: timestamp("created_at").defaultNow()
    });
    bulkPricingOperations = pgTable("bulk_pricing_operations", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      operationType: varchar("operation_type", { length: 50 }).notNull(),
      // "markup_update", "cost_update", "price_override"
      criteria: jsonb("criteria").notNull(),
      // JSON criteria for operation
      changes: jsonb("changes").notNull(),
      // JSON changes to apply
      status: varchar("status", { length: 50 }).default("pending"),
      // "pending", "processing", "completed", "failed"
      affectedItemsCount: integer("affected_items_count").default(0),
      processedItemsCount: integer("processed_items_count").default(0),
      errorLog: text("error_log"),
      startedAt: timestamp("started_at"),
      completedAt: timestamp("completed_at"),
      createdBy: uuid("created_by"),
      createdAt: timestamp("created_at").defaultNow()
    });
    productCategoriesRelations = relations(productCategories, ({ one, many }) => ({
      parentCategory: one(productCategories, {
        fields: [productCategories.parentCategoryId],
        references: [productCategories.id]
      }),
      subCategories: many(productCategories),
      items: many(inventoryItems),
      markupConfigurations: many(markupConfiguration),
      priceLists: many(priceLists)
    }));
    markupConfigurationRelations = relations(markupConfiguration, ({ one }) => ({
      createdByUser: one(users, {
        fields: [markupConfiguration.createdBy],
        references: [users.id]
      }),
      updatedByUser: one(users, {
        fields: [markupConfiguration.updatedBy],
        references: [users.id]
      })
    }));
    itemPricingRelations = relations(itemPricing, ({ one }) => ({
      item: one(inventoryItems, {
        fields: [itemPricing.itemId],
        references: [inventoryItems.id]
      }),
      createdByUser: one(users, {
        fields: [itemPricing.createdBy],
        references: [users.id]
      }),
      updatedByUser: one(users, {
        fields: [itemPricing.updatedBy],
        references: [users.id]
      })
    }));
    customerPricingRelations = relations(customerPricing, ({ one }) => ({
      customer: one(customers, {
        fields: [customerPricing.customerId],
        references: [customers.id]
      }),
      item: one(inventoryItems, {
        fields: [customerPricing.itemId],
        references: [inventoryItems.id]
      }),
      createdByUser: one(users, {
        fields: [customerPricing.createdBy],
        references: [users.id]
      })
    }));
    pricingRulesRelations = relations(pricingRules, ({ one }) => ({
      createdByUser: one(users, {
        fields: [pricingRules.createdBy],
        references: [users.id]
      })
    }));
    priceListsRelations = relations(priceLists, ({ one, many }) => ({
      customer: one(customers, {
        fields: [priceLists.customerId],
        references: [customers.id]
      }),
      category: one(productCategories, {
        fields: [priceLists.categoryId],
        references: [productCategories.id]
      }),
      items: many(priceListItems),
      createdByUser: one(users, {
        fields: [priceLists.createdBy],
        references: [users.id]
      })
    }));
    priceListItemsRelations = relations(priceListItems, ({ one }) => ({
      priceList: one(priceLists, {
        fields: [priceListItems.priceListId],
        references: [priceLists.id]
      }),
      item: one(inventoryItems, {
        fields: [priceListItems.itemId],
        references: [inventoryItems.id]
      })
    }));
    priceChangeHistoryRelations = relations(priceChangeHistory, ({ one }) => ({
      item: one(inventoryItems, {
        fields: [priceChangeHistory.itemId],
        references: [inventoryItems.id]
      }),
      user: one(users, {
        fields: [priceChangeHistory.userId],
        references: [users.id]
      })
    }));
    bulkPricingOperationsRelations = relations(bulkPricingOperations, ({ one }) => ({
      createdByUser: one(users, {
        fields: [bulkPricingOperations.createdBy],
        references: [users.id]
      })
    }));
    insertProductCategorySchema = createInsertSchema(productCategories).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertMarkupConfigurationSchema = createInsertSchema(markupConfiguration).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertItemPricingSchema = createInsertSchema(itemPricing).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertCustomerPricingSchema = createInsertSchema(customerPricing).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPricingRuleSchema = createInsertSchema(pricingRules).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPriceListSchema = createInsertSchema(priceLists).omit({
      id: true,
      generatedAt: true,
      createdAt: true,
      updatedAt: true
    });
    insertPriceListItemSchema = createInsertSchema(priceListItems).omit({
      id: true
    });
    insertPriceChangeHistorySchema = createInsertSchema(priceChangeHistory).omit({
      id: true,
      createdAt: true
    });
    insertBulkPricingOperationSchema = createInsertSchema(bulkPricingOperations).omit({
      id: true,
      createdAt: true
    });
    physicalStockCounts = pgTable("physical_stock_counts", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      countNumber: varchar("count_number", { length: 50 }).notNull().unique(),
      description: text("description"),
      countDate: timestamp("count_date").defaultNow(),
      storageLocation: varchar("storage_location", { length: 255 }),
      countType: varchar("count_type", { length: 50 }).default("Full Count"),
      // "Full Count", "Cycle Count", "Spot Check"
      status: physicalStockStatusEnum("status").default("Draft"),
      scheduledDate: timestamp("scheduled_date"),
      startedBy: uuid("started_by").references(() => users.id),
      startedAt: timestamp("started_at"),
      completedBy: uuid("completed_by").references(() => users.id),
      completedAt: timestamp("completed_at"),
      approvedBy: uuid("approved_by").references(() => users.id),
      approvedAt: timestamp("approved_at"),
      totalItemsExpected: integer("total_items_expected").default(0),
      totalItemsCounted: integer("total_items_counted").default(0),
      totalDiscrepancies: integer("total_discrepancies").default(0),
      notes: text("notes"),
      createdBy: uuid("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    physicalStockCountItems = pgTable("physical_stock_count_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      physicalStockCountId: uuid("physical_stock_count_id").references(() => physicalStockCounts.id, { onDelete: "cascade" }).notNull(),
      inventoryItemId: uuid("inventory_item_id").references(() => inventoryItems.id).notNull(),
      lineNumber: integer("line_number"),
      supplierCode: varchar("supplier_code", { length: 255 }).notNull(),
      barcode: varchar("barcode", { length: 255 }),
      description: text("description").notNull(),
      storageLocation: varchar("storage_location", { length: 255 }),
      // System quantities
      systemQuantity: integer("system_quantity").default(0),
      reservedQuantity: integer("reserved_quantity").default(0),
      availableQuantity: integer("available_quantity").default(0),
      // Physical count quantities
      firstCountQuantity: integer("first_count_quantity"),
      firstCountBy: uuid("first_count_by").references(() => users.id),
      firstCountAt: timestamp("first_count_at"),
      secondCountQuantity: integer("second_count_quantity"),
      secondCountBy: uuid("second_count_by").references(() => users.id),
      secondCountAt: timestamp("second_count_at"),
      finalCountQuantity: integer("final_count_quantity"),
      // Discrepancy tracking
      variance: integer("variance").default(0),
      // final_count - system_quantity
      varianceValue: decimal("variance_value", { precision: 12, scale: 2 }).default("0"),
      status: stockCountStatusEnum("status").default("Pending"),
      requiresRecount: boolean("requires_recount").default(false),
      discrepancyReason: text("discrepancy_reason"),
      adjustmentRequired: boolean("adjustment_required").default(false),
      adjustmentApplied: boolean("adjustment_applied").default(false),
      adjustmentAppliedBy: uuid("adjustment_applied_by").references(() => users.id),
      adjustmentAppliedAt: timestamp("adjustment_applied_at"),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    physicalStockScanningSessions = pgTable("physical_stock_scanning_sessions", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      physicalStockCountId: uuid("physical_stock_count_id").references(() => physicalStockCounts.id, { onDelete: "cascade" }).notNull(),
      sessionName: varchar("session_name", { length: 255 }).notNull(),
      sessionType: varchar("session_type", { length: 50 }).default("First Count"),
      // "First Count", "Second Count", "Recount"
      storageLocation: varchar("storage_location", { length: 255 }),
      status: varchar("status", { length: 50 }).default("Active"),
      // "Active", "Paused", "Completed", "Cancelled"
      startedBy: uuid("started_by").references(() => users.id).notNull(),
      startedAt: timestamp("started_at").defaultNow(),
      pausedAt: timestamp("paused_at"),
      completedAt: timestamp("completed_at"),
      totalScansExpected: integer("total_scans_expected").default(0),
      totalScansCompleted: integer("total_scans_completed").default(0),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    physicalStockScannedItems = pgTable("physical_stock_scanned_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      scanningSessionId: uuid("scanning_session_id").references(() => physicalStockScanningSessions.id, { onDelete: "cascade" }).notNull(),
      physicalStockCountItemId: uuid("physical_stock_count_item_id").references(() => physicalStockCountItems.id),
      inventoryItemId: uuid("inventory_item_id").references(() => inventoryItems.id),
      barcode: varchar("barcode", { length: 255 }).notNull(),
      supplierCode: varchar("supplier_code", { length: 255 }),
      quantityScanned: integer("quantity_scanned").notNull().default(1),
      storageLocation: varchar("storage_location", { length: 255 }),
      scannedBy: uuid("scanned_by").references(() => users.id).notNull(),
      scannedAt: timestamp("scanned_at").defaultNow(),
      verified: boolean("verified").default(false),
      verifiedBy: uuid("verified_by").references(() => users.id),
      verifiedAt: timestamp("verified_at"),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow()
    });
    physicalStockAdjustments = pgTable("physical_stock_adjustments", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      adjustmentNumber: varchar("adjustment_number", { length: 50 }).notNull().unique(),
      physicalStockCountId: uuid("physical_stock_count_id").references(() => physicalStockCounts.id).notNull(),
      adjustmentDate: timestamp("adjustment_date").defaultNow(),
      totalAdjustmentValue: decimal("total_adjustment_value", { precision: 12, scale: 2 }).default("0"),
      status: varchar("status", { length: 50 }).default("Draft"),
      // "Draft", "Applied", "Cancelled"
      appliedBy: uuid("applied_by").references(() => users.id),
      appliedAt: timestamp("applied_at"),
      approvedBy: uuid("approved_by").references(() => users.id),
      approvedAt: timestamp("approved_at"),
      reason: text("reason"),
      notes: text("notes"),
      createdBy: uuid("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    physicalStockAdjustmentItems = pgTable("physical_stock_adjustment_items", {
      id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
      adjustmentId: uuid("adjustment_id").references(() => physicalStockAdjustments.id, { onDelete: "cascade" }).notNull(),
      physicalStockCountItemId: uuid("physical_stock_count_item_id").references(() => physicalStockCountItems.id).notNull(),
      inventoryItemId: uuid("inventory_item_id").references(() => inventoryItems.id).notNull(),
      supplierCode: varchar("supplier_code", { length: 255 }).notNull(),
      description: text("description").notNull(),
      storageLocation: varchar("storage_location", { length: 255 }),
      systemQuantity: integer("system_quantity").notNull(),
      physicalQuantity: integer("physical_quantity").notNull(),
      adjustmentQuantity: integer("adjustment_quantity").notNull(),
      // physical - system
      unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
      adjustmentValue: decimal("adjustment_value", { precision: 12, scale: 2 }),
      reason: text("reason"),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertPhysicalStockCountSchema = createInsertSchema(physicalStockCounts).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPhysicalStockCountItemSchema = createInsertSchema(physicalStockCountItems).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPhysicalStockScanningSessionSchema = createInsertSchema(physicalStockScanningSessions).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPhysicalStockScannedItemSchema = createInsertSchema(physicalStockScannedItems).omit({
      id: true,
      createdAt: true
    });
    insertPhysicalStockAdjustmentSchema = createInsertSchema(physicalStockAdjustments).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPhysicalStockAdjustmentItemSchema = createInsertSchema(physicalStockAdjustmentItems).omit({
      id: true,
      createdAt: true
    });
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  db: () => db,
  drizzleDb: () => db,
  pool: () => pool
});
import "dotenv/config";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    neonConfig.webSocketConstructor = ws;
    console.log("DATABASE_URL from env:", process.env.DATABASE_URL ? "SET" : "NOT SET");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema: schema_exports });
  }
});

// server/storage/base.ts
var BaseStorage;
var init_base = __esm({
  "server/storage/base.ts"() {
    "use strict";
    init_db();
    init_schema();
    BaseStorage = class {
      generateId() {
        return Math.random().toString(36).substr(2, 9);
      }
      generateNumber(prefix) {
        const timestamp4 = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `${prefix}-${timestamp4}${random}`;
      }
      getCurrentTimestamp() {
        return /* @__PURE__ */ new Date();
      }
      async logAuditEvent(entity, entityId, action, userId, oldValue, newValue) {
        try {
          await db.insert(auditLogs).values({
            entityType: entity,
            entityId,
            action,
            userId,
            oldData: oldValue,
            newData: newValue,
            timestamp: this.getCurrentTimestamp()
          });
        } catch (error) {
          console.error("Error logging audit event:", error);
        }
      }
    };
  }
});

// server/storage/user-storage.ts
import { eq as eq2 } from "drizzle-orm";
var UserStorage;
var init_user_storage = __esm({
  "server/storage/user-storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    init_base();
    UserStorage = class extends BaseStorage {
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq2(users.id, id));
        return user;
      }
      async createUser(userData) {
        const [user] = await db.insert(users).values(userData).returning();
        return user;
      }
      async logAuditEvent(entityType, entityId, action, userId, oldData, newData) {
        console.log(`Audit: ${action} on ${entityType} ${entityId} by ${userId}`);
      }
    };
  }
});

// server/storage/customer-storage.ts
import { eq as eq3, desc, sum, count, sql as sql2, and, gte } from "drizzle-orm";
var CustomerStorage;
var init_customer_storage = __esm({
  "server/storage/customer-storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    init_base();
    CustomerStorage = class extends BaseStorage {
      async getCustomers(limit = 50, offset = 0, filters) {
        const conditions = [];
        if (filters?.isActive && filters.isActive !== "all") {
          const isActive = filters.isActive === "true";
          conditions.push(eq3(customers.isActive, isActive));
        } else if (!filters?.isActive) {
          conditions.push(eq3(customers.isActive, true));
        }
        if (filters?.customerType && filters.customerType !== "all") {
          conditions.push(eq3(customers.customerType, filters.customerType));
        }
        if (filters?.classification && filters.classification !== "all") {
          conditions.push(eq3(customers.classification, filters.classification));
        }
        if (filters?.search && filters.search.trim() !== "") {
          const searchTerm = `%${filters.search.trim()}%`;
          conditions.push(sql2`(
        LOWER(${customers.name}) LIKE LOWER(${searchTerm}) OR
        LOWER(${customers.email}) LIKE LOWER(${searchTerm}) OR
        LOWER(${customers.phone}) LIKE LOWER(${searchTerm}) OR
        LOWER(${customers.address}) LIKE LOWER(${searchTerm})
      )`);
        }
        let query = db.select().from(customers);
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
        return query.limit(limit).offset(offset).orderBy(desc(customers.createdAt));
      }
      async getCustomersCount(filters) {
        const conditions = [];
        if (filters?.isActive && filters.isActive !== "all") {
          const isActive = filters.isActive === "true";
          conditions.push(eq3(customers.isActive, isActive));
        } else if (!filters?.isActive) {
          conditions.push(eq3(customers.isActive, true));
        }
        if (filters?.customerType && filters.customerType !== "all") {
          conditions.push(eq3(customers.customerType, filters.customerType));
        }
        if (filters?.classification && filters.classification !== "all") {
          conditions.push(eq3(customers.classification, filters.classification));
        }
        if (filters?.search && filters.search.trim() !== "") {
          const searchTerm = `%${filters.search.trim()}%`;
          conditions.push(sql2`(
        LOWER(${customers.name}) LIKE LOWER(${searchTerm}) OR
        LOWER(${customers.email}) LIKE LOWER(${searchTerm}) OR
        LOWER(${customers.phone}) LIKE LOWER(${searchTerm}) OR
        LOWER(${customers.address}) LIKE LOWER(${searchTerm})
      )`);
        }
        let query = db.select({ count: count() }).from(customers);
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
        const result = await query;
        return Number(result[0]?.count || 0);
      }
      async searchCustomers(searchParams, limit = 50, offset = 0) {
        const conditions = [eq3(customers.isActive, true)];
        if (searchParams.name) {
          conditions.push(sql2`LOWER(${customers.name}) = LOWER(${searchParams.name})`);
        }
        if (searchParams.email) {
          conditions.push(sql2`LOWER(${customers.email}) = LOWER(${searchParams.email})`);
        }
        return db.select().from(customers).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(customers.createdAt));
      }
      async getCustomer(id) {
        const [customer] = await db.select().from(customers).where(eq3(customers.id, id));
        return customer;
      }
      async getCustomerDetails(id) {
        const customer = await this.getCustomer(id);
        if (!customer) return null;
        const transactionSummary = await this.getCustomerTransactionSummary(id);
        const recentActivities = await this.getCustomerRecentActivities(id);
        const performanceMetrics = await this.getCustomerPerformanceMetrics(id);
        return {
          ...customer,
          transactionSummary,
          recentActivities,
          performanceMetrics
        };
      }
      async getCustomerTransactionSummary(customerId) {
        try {
          const enquiryStats = await db.select({
            total: count(),
            status: enquiries.status
          }).from(enquiries).where(eq3(enquiries.customerId, customerId)).groupBy(enquiries.status);
          const quotationStats = await db.select({
            total: count(),
            totalValue: sum(quotations.totalAmount),
            status: quotations.status
          }).from(quotations).where(eq3(quotations.customerId, customerId)).groupBy(quotations.status);
          const salesOrderStats = await db.select({
            total: count(),
            totalValue: sum(salesOrders.totalAmount),
            status: salesOrders.status
          }).from(salesOrders).where(eq3(salesOrders.customerId, customerId)).groupBy(salesOrders.status);
          const invoiceStats = await db.select({
            total: count(),
            totalValue: sum(invoices.totalAmount),
            status: invoices.status
          }).from(invoices).where(eq3(invoices.customerId, customerId)).groupBy(invoices.status);
          return {
            enquiries: enquiryStats,
            quotations: quotationStats,
            salesOrders: salesOrderStats,
            invoices: invoiceStats
          };
        } catch (error) {
          console.error("Error getting customer transaction summary:", error);
          return {
            enquiries: [],
            quotations: [],
            salesOrders: [],
            invoices: []
          };
        }
      }
      async getCustomerRecentActivities(customerId, limit = 10) {
        try {
          const recentEnquiries = await db.select({
            id: enquiries.id,
            type: sql2`'enquiry'`,
            title: sql2`CONCAT('Enquiry ', ${enquiries.enquiryNumber})`,
            status: enquiries.status,
            amount: sql2`NULL`,
            date: enquiries.createdAt
          }).from(enquiries).where(eq3(enquiries.customerId, customerId)).orderBy(desc(enquiries.createdAt)).limit(5);
          const recentQuotations = await db.select({
            id: quotations.id,
            type: sql2`'quotation'`,
            title: sql2`CONCAT('Quotation ', ${quotations.quoteNumber})`,
            status: quotations.status,
            amount: quotations.totalAmount,
            date: quotations.createdAt
          }).from(quotations).where(eq3(quotations.customerId, customerId)).orderBy(desc(quotations.createdAt)).limit(5);
          const recentSalesOrders = await db.select({
            id: salesOrders.id,
            type: sql2`'sales_order'`,
            title: sql2`CONCAT('Sales Order ', ${salesOrders.orderNumber})`,
            status: salesOrders.status,
            amount: salesOrders.totalAmount,
            date: salesOrders.createdAt
          }).from(salesOrders).where(eq3(salesOrders.customerId, customerId)).orderBy(desc(salesOrders.createdAt)).limit(5);
          const allActivities = [
            ...recentEnquiries,
            ...recentQuotations,
            ...recentSalesOrders
          ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
          return allActivities;
        } catch (error) {
          console.error("Error getting customer recent activities:", error);
          return [];
        }
      }
      async getCustomerPerformanceMetrics(customerId) {
        try {
          const now = /* @__PURE__ */ new Date();
          const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          const last6Months = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          const last3Months = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          const yearlyMetrics = await this.getCustomerMetricsForPeriod(customerId, lastYear);
          const sixMonthMetrics = await this.getCustomerMetricsForPeriod(customerId, last6Months);
          const quarterlyMetrics = await this.getCustomerMetricsForPeriod(customerId, last3Months);
          const conversionRates = await this.getCustomerConversionRates(customerId);
          return {
            yearly: yearlyMetrics,
            sixMonth: sixMonthMetrics,
            quarterly: quarterlyMetrics,
            conversionRates
          };
        } catch (error) {
          console.error("Error getting customer performance metrics:", error);
          return {
            yearly: { totalOrders: 0, totalValue: 0, averageOrderValue: 0 },
            sixMonth: { totalOrders: 0, totalValue: 0, averageOrderValue: 0 },
            quarterly: { totalOrders: 0, totalValue: 0, averageOrderValue: 0 },
            conversionRates: { enquiryToQuote: 0, quoteToOrder: 0, overall: 0 }
          };
        }
      }
      async getCustomerMetricsForPeriod(customerId, fromDate) {
        const [orderMetrics] = await db.select({
          totalOrders: count(),
          totalValue: sum(salesOrders.totalAmount)
        }).from(salesOrders).where(
          and(
            eq3(salesOrders.customerId, customerId),
            gte(salesOrders.createdAt, fromDate)
          )
        );
        const totalValue = Number(orderMetrics.totalValue || 0);
        const totalOrders = Number(orderMetrics.totalOrders || 0);
        const averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;
        return {
          totalOrders,
          totalValue,
          averageOrderValue
        };
      }
      async getCustomerConversionRates(customerId) {
        try {
          const [enquiryCount] = await db.select({ count: count() }).from(enquiries).where(eq3(enquiries.customerId, customerId));
          const [quotationCount] = await db.select({ count: count() }).from(quotations).where(eq3(quotations.customerId, customerId));
          const [orderCount] = await db.select({ count: count() }).from(salesOrders).where(eq3(salesOrders.customerId, customerId));
          const enquiryCountValue = Number(enquiryCount.count || 0);
          const quoteCountValue = Number(quotationCount.count || 0);
          const orderCountValue = Number(orderCount.count || 0);
          const enquiryToQuote = enquiryCountValue > 0 ? quoteCountValue / enquiryCountValue * 100 : 0;
          const quoteToOrder = quoteCountValue > 0 ? orderCountValue / quoteCountValue * 100 : 0;
          const overall = enquiryCountValue > 0 ? orderCountValue / enquiryCountValue * 100 : 0;
          return {
            enquiryToQuote: Math.round(enquiryToQuote * 100) / 100,
            quoteToOrder: Math.round(quoteToOrder * 100) / 100,
            overall: Math.round(overall * 100) / 100
          };
        } catch (error) {
          console.error("Error calculating conversion rates:", error);
          return { enquiryToQuote: 0, quoteToOrder: 0, overall: 0 };
        }
      }
      async createCustomer(customerData) {
        if (customerData.name) {
          const existingByName = await db.select().from(customers).where(eq3(customers.name, customerData.name)).limit(1);
          if (existingByName.length > 0) {
            throw new Error(`Customer with name "${customerData.name}" already exists`);
          }
        }
        if (customerData.email) {
          const existingByEmail = await db.select().from(customers).where(eq3(customers.email, customerData.email)).limit(1);
          if (existingByEmail.length > 0) {
            throw new Error(`Customer with email "${customerData.email}" already exists`);
          }
        }
        const [customer] = await db.insert(customers).values(customerData).returning();
        await this.logAuditEvent("customer", customer.id, "create", void 0, void 0, customer);
        return customer;
      }
      async updateCustomer(id, customerData) {
        const oldCustomer = await this.getCustomer(id);
        if (customerData.name) {
          const existingByName = await db.select().from(customers).where(and(
            eq3(customers.name, customerData.name),
            sql2`${customers.id} != ${id}`
          )).limit(1);
          if (existingByName.length > 0) {
            throw new Error(`Customer with name "${customerData.name}" already exists`);
          }
        }
        if (customerData.email) {
          const existingByEmail = await db.select().from(customers).where(and(
            eq3(customers.email, customerData.email),
            sql2`${customers.id} != ${id}`
          )).limit(1);
          if (existingByEmail.length > 0) {
            throw new Error(`Customer with email "${customerData.email}" already exists`);
          }
        }
        const [customer] = await db.update(customers).set({ ...customerData, updatedAt: /* @__PURE__ */ new Date() }).where(eq3(customers.id, id)).returning();
        await this.logAuditEvent("customer", id, "update", void 0, oldCustomer, customer);
        return customer;
      }
      async logAuditEvent(entityType, entityId, action, userId, oldData, newData) {
        await db.insert(auditLogs).values({
          entityType,
          entityId,
          action,
          oldData,
          newData,
          userId
        });
      }
    };
  }
});

// server/storage/supplier-storage.ts
import { eq as eq4, desc as desc2, and as and2, sql as sql3, count as count2, sum as sum2 } from "drizzle-orm";
var SupplierStorage;
var init_supplier_storage = __esm({
  "server/storage/supplier-storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    init_base();
    SupplierStorage = class extends BaseStorage {
      async getSuppliers() {
        return db.select().from(suppliers).where(eq4(suppliers.isActive, true)).orderBy(desc2(suppliers.createdAt));
      }
      async getSupplier(id) {
        const [supplier] = await db.select().from(suppliers).where(eq4(suppliers.id, id));
        return supplier;
      }
      async createSupplier(supplierData) {
        const [supplier] = await db.insert(suppliers).values(supplierData).returning();
        return supplier;
      }
      async updateSupplier(id, supplierData) {
        const oldSupplier = await this.getSupplier(id);
        const [supplier] = await db.update(suppliers).set({
          ...supplierData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq4(suppliers.id, id)).returning();
        if (!supplier) {
          throw new Error("Supplier not found");
        }
        return supplier;
      }
      async deleteSupplier(id) {
        const oldSupplier = await this.getSupplier(id);
        await db.update(suppliers).set({
          isActive: false,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq4(suppliers.id, id));
      }
      async logAuditEvent(entityType, entityId, action, userId, oldData, newData) {
        await db.insert(auditLogs).values({
          entityType,
          entityId,
          action,
          oldData,
          newData,
          userId
        });
      }
      // Enhanced methods for supplier detail page
      async getSupplierDetails(id) {
        try {
          console.log("DEBUG: getSupplierDetails called with ID:", id);
          const supplier = await this.getSupplier(id);
          console.log("DEBUG: getSupplier result:", supplier ? "found" : "not found");
          if (!supplier) {
            console.log("DEBUG: Supplier not found, returning null");
            return null;
          }
          const lpoStats = await db.select({
            totalLpos: count2(),
            totalValue: sum2(supplierLpos.totalAmount),
            pendingLpos: sql3`COUNT(CASE WHEN status IN ('Draft', 'Pending', 'Sent') THEN 1 END)`
          }).from(supplierLpos).where(eq4(supplierLpos.supplierId, id));
          console.log("DEBUG: LPO stats:", lpoStats);
          const itemStats = await db.select({ count: count2() }).from(items).where(eq4(items.supplierId, id));
          console.log("DEBUG: Item stats:", itemStats);
          const grStats = await db.select({
            totalReceipts: count2()
          }).from(goodsReceiptHeaders).innerJoin(supplierLpos, eq4(goodsReceiptHeaders.supplierLpoId, supplierLpos.id)).where(eq4(supplierLpos.supplierId, id));
          console.log("DEBUG: GR stats:", grStats);
          const recentLpos = await db.select({
            id: supplierLpos.id,
            lpoNumber: supplierLpos.lpoNumber,
            status: supplierLpos.status,
            totalAmount: supplierLpos.totalAmount,
            lpoDate: supplierLpos.lpoDate
          }).from(supplierLpos).where(eq4(supplierLpos.supplierId, id)).orderBy(desc2(supplierLpos.lpoDate)).limit(10);
          console.log("DEBUG: Recent LPOs:", recentLpos);
          const activities = recentLpos.map((lpo) => ({
            id: lpo.id,
            type: "LPO",
            description: `LPO ${lpo.lpoNumber} created`,
            date: lpo.lpoDate ? new Date(lpo.lpoDate).toISOString() : "",
            status: lpo.status || void 0,
            amount: lpo.totalAmount?.toString()
          })).slice(0, 20);
          const result = {
            supplier,
            stats: {
              totalLpos: lpoStats[0]?.totalLpos || 0,
              totalLpoValue: lpoStats[0]?.totalValue?.toString() || "0",
              pendingLpos: lpoStats[0]?.pendingLpos || 0,
              totalItems: itemStats[0]?.count || 0,
              totalGoodsReceipts: grStats[0]?.totalReceipts || 0,
              averageDeliveryDays: 0,
              // Simplified
              onTimeDeliveryRate: 0
              // Simplified
            },
            recentActivities: activities
          };
          console.log("DEBUG: Final result:", JSON.stringify(result, null, 2));
          return result;
        } catch (error) {
          console.error("Error in getSupplierDetails:", error);
          return null;
        }
      }
      async getSupplierLposForDetail(supplierId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const lpos = await db.select({
          id: supplierLpos.id,
          lpoNumber: supplierLpos.lpoNumber,
          status: supplierLpos.status,
          lpoDate: supplierLpos.lpoDate,
          expectedDeliveryDate: supplierLpos.expectedDeliveryDate,
          totalAmount: supplierLpos.totalAmount,
          itemsCount: sql3`COUNT(${supplierLpoItems.id})`
        }).from(supplierLpos).leftJoin(supplierLpoItems, eq4(supplierLpos.id, supplierLpoItems.supplierLpoId)).where(eq4(supplierLpos.supplierId, supplierId)).groupBy(supplierLpos.id).orderBy(desc2(supplierLpos.lpoDate)).limit(limit).offset(offset);
        const totalResult = await db.select({ count: count2() }).from(supplierLpos).where(eq4(supplierLpos.supplierId, supplierId));
        return {
          lpos: lpos.map((lpo) => ({
            ...lpo,
            lpoDate: lpo.lpoDate?.toISOString() || "",
            expectedDeliveryDate: lpo.expectedDeliveryDate?.toISOString() || null,
            totalAmount: lpo.totalAmount?.toString() || null,
            status: lpo.status || ""
          })),
          total: totalResult[0]?.count || 0
        };
      }
      async getSupplierItems(supplierId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const supplierItems = await db.select({
          id: items.id,
          supplierCode: items.supplierCode,
          barcode: items.barcode,
          description: items.description,
          category: items.category,
          unitOfMeasure: items.unitOfMeasure,
          costPrice: items.costPrice,
          isActive: items.isActive,
          lastOrderDate: sql3`MAX(${supplierLpos.lpoDate})`,
          totalOrdered: sql3`COALESCE(SUM(${supplierLpoItems.quantity}), 0)`
        }).from(items).leftJoin(supplierLpoItems, eq4(items.id, supplierLpoItems.itemId)).leftJoin(supplierLpos, eq4(supplierLpoItems.supplierLpoId, supplierLpos.id)).where(eq4(items.supplierId, supplierId)).groupBy(items.id).orderBy(desc2(items.createdAt)).limit(limit).offset(offset);
        const totalResult = await db.select({ count: count2() }).from(items).where(eq4(items.supplierId, supplierId));
        return {
          items: supplierItems.map((item) => ({
            ...item,
            costPrice: item.costPrice?.toString() || null,
            lastOrderDate: item.lastOrderDate?.toISOString() || null,
            isActive: item.isActive || false
          })),
          total: totalResult[0]?.count || 0
        };
      }
      async getSupplierGoodsReceipts(supplierId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const receipts = await db.select({
          id: goodsReceiptHeaders.id,
          receiptNumber: goodsReceiptHeaders.receiptNumber,
          receiptDate: goodsReceiptHeaders.receiptDate,
          status: goodsReceiptHeaders.status,
          lpoNumber: supplierLpos.lpoNumber,
          expectedDeliveryDate: goodsReceiptHeaders.expectedDeliveryDate,
          actualDeliveryDate: goodsReceiptHeaders.actualDeliveryDate,
          totalItems: sql3`COUNT(${goodsReceiptItems.id})`,
          receivedItems: sql3`SUM(${goodsReceiptItems.quantityReceived})`
        }).from(goodsReceiptHeaders).innerJoin(supplierLpos, eq4(goodsReceiptHeaders.supplierLpoId, supplierLpos.id)).leftJoin(goodsReceiptItems, eq4(goodsReceiptHeaders.id, goodsReceiptItems.receiptHeaderId)).where(eq4(supplierLpos.supplierId, supplierId)).groupBy(goodsReceiptHeaders.id, supplierLpos.lpoNumber).orderBy(desc2(goodsReceiptHeaders.receiptDate)).limit(limit).offset(offset);
        const totalResult = await db.select({ count: count2() }).from(goodsReceiptHeaders).innerJoin(supplierLpos, eq4(goodsReceiptHeaders.supplierLpoId, supplierLpos.id)).where(eq4(supplierLpos.supplierId, supplierId));
        return {
          receipts: receipts.map((receipt) => ({
            ...receipt,
            receiptDate: receipt.receiptDate ? new Date(receipt.receiptDate).toISOString() : "",
            expectedDeliveryDate: receipt.expectedDeliveryDate ? new Date(receipt.expectedDeliveryDate).toISOString() : null,
            actualDeliveryDate: receipt.actualDeliveryDate ? new Date(receipt.actualDeliveryDate).toISOString() : null
          })),
          total: totalResult[0]?.count || 0
        };
      }
      async getSupplierPerformanceMetrics(supplierId) {
        try {
          const deliveryStats = await db.select({
            totalDeliveries: count2(),
            onTimeDeliveries: sql3`COUNT(CASE WHEN ${goodsReceiptHeaders.actualDeliveryDate} <= ${goodsReceiptHeaders.expectedDeliveryDate} THEN 1 END)`
          }).from(goodsReceiptHeaders).innerJoin(supplierLpos, eq4(goodsReceiptHeaders.supplierLpoId, supplierLpos.id)).where(and2(
            eq4(supplierLpos.supplierId, supplierId),
            sql3`${goodsReceiptHeaders.actualDeliveryDate} IS NOT NULL`
          ));
          const qualityStats = await db.select({
            totalReceipts: count2(),
            acceptedReceipts: sql3`COUNT(CASE WHEN ${goodsReceiptHeaders.status} = 'Completed' THEN 1 END)`,
            rejectedReceipts: sql3`COUNT(CASE WHEN ${goodsReceiptHeaders.status} = 'Rejected' THEN 1 END)`
          }).from(goodsReceiptHeaders).innerJoin(supplierLpos, eq4(goodsReceiptHeaders.supplierLpoId, supplierLpos.id)).where(eq4(supplierLpos.supplierId, supplierId));
          const financialStats = await db.select({
            totalOrderValue: sum2(supplierLpos.totalAmount),
            avgOrderValue: sql3`AVG(${supplierLpos.totalAmount})`,
            totalOrders: count2()
          }).from(supplierLpos).where(eq4(supplierLpos.supplierId, supplierId));
          const delivery = deliveryStats[0] || { totalDeliveries: 0, onTimeDeliveries: 0 };
          const quality = qualityStats[0] || { totalReceipts: 0, acceptedReceipts: 0, rejectedReceipts: 0 };
          const financial = financialStats[0] || { totalOrderValue: null, avgOrderValue: 0, totalOrders: 0 };
          return {
            deliveryPerformance: {
              onTimeDeliveries: delivery.onTimeDeliveries,
              totalDeliveries: delivery.totalDeliveries,
              onTimeRate: delivery.totalDeliveries > 0 ? delivery.onTimeDeliveries / delivery.totalDeliveries * 100 : 0,
              averageDelayDays: 0
              // Simplified for now
            },
            qualityMetrics: {
              totalReceipts: quality.totalReceipts,
              acceptedReceipts: quality.acceptedReceipts,
              rejectedReceipts: quality.rejectedReceipts,
              acceptanceRate: quality.totalReceipts > 0 ? quality.acceptedReceipts / quality.totalReceipts * 100 : 0
            },
            financialMetrics: {
              totalOrderValue: financial.totalOrderValue?.toString() || "0",
              averageOrderValue: financial.avgOrderValue?.toString() || "0",
              paymentTermsCompliance: 100
              // TODO: Implement based on actual payment data
            }
          };
        } catch (error) {
          console.error("Error in getSupplierPerformanceMetrics:", error);
          return {
            deliveryPerformance: {
              onTimeDeliveries: 0,
              totalDeliveries: 0,
              onTimeRate: 0,
              averageDelayDays: 0
            },
            qualityMetrics: {
              totalReceipts: 0,
              acceptedReceipts: 0,
              rejectedReceipts: 0,
              acceptanceRate: 0
            },
            financialMetrics: {
              totalOrderValue: "0",
              averageOrderValue: "0",
              paymentTermsCompliance: 100
            }
          };
        }
      }
    };
  }
});

// server/storage/item-storage.ts
import { eq as eq5, desc as desc3 } from "drizzle-orm";
var ItemStorage;
var init_item_storage = __esm({
  "server/storage/item-storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    init_base();
    ItemStorage = class extends BaseStorage {
      async getItems() {
        return db.select().from(items).where(eq5(items.isActive, true)).orderBy(desc3(items.createdAt));
      }
      async getItem(id) {
        const [item] = await db.select().from(items).where(eq5(items.id, id));
        return item;
      }
      async getItemByBarcode(barcode) {
        const [item] = await db.select().from(items).where(eq5(items.barcode, barcode));
        return item;
      }
      async createItem(itemData) {
        const [item] = await db.insert(items).values(itemData).returning();
        await this.logAuditEvent("item", item.id, "create", void 0, void 0, item);
        return item;
      }
      async logAuditEvent(entityType, entityId, action, userId, oldData, newData) {
        await db.insert(auditLogs).values({
          entityType,
          entityId,
          action,
          oldData,
          newData,
          userId
        });
      }
    };
  }
});

// server/storage/inventory-storage.ts
import { eq as eq6, desc as desc4, and as and3, or, like, gte as gte2, lte } from "drizzle-orm";
import { nanoid as nanoid3 } from "nanoid";
var InventoryStorage;
var init_inventory_storage = __esm({
  "server/storage/inventory-storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    init_base();
    InventoryStorage = class extends BaseStorage {
      db;
      constructor() {
        super();
        this.db = db;
      }
      async getInventoryItems(filters) {
        const conditions = [];
        if (filters?.search) {
          conditions.push(
            or(
              like(inventoryItems.supplierCode, `%${filters.search}%`),
              like(inventoryItems.description, `%${filters.search}%`),
              like(inventoryItems.barcode, `%${filters.search}%`),
              like(suppliers.name, `%${filters.search}%`)
            )
          );
        }
        if (filters?.supplierId) {
          conditions.push(eq6(inventoryItems.supplierId, filters.supplierId));
        }
        if (filters?.category) {
          conditions.push(eq6(inventoryItems.category, filters.category));
        }
        if (filters?.isActive !== void 0) {
          conditions.push(eq6(inventoryItems.isActive, filters.isActive));
        }
        let query = db.select({
          id: inventoryItems.id,
          supplierCode: inventoryItems.supplierCode,
          barcode: inventoryItems.barcode,
          description: inventoryItems.description,
          category: inventoryItems.category,
          unitOfMeasure: inventoryItems.unitOfMeasure,
          weight: inventoryItems.weight,
          dimensions: inventoryItems.dimensions,
          isActive: inventoryItems.isActive,
          supplierId: inventoryItems.supplierId,
          createdAt: inventoryItems.createdAt,
          updatedAt: inventoryItems.updatedAt,
          supplierName: suppliers.name,
          supplier: suppliers
        }).from(inventoryItems).leftJoin(suppliers, eq6(inventoryItems.supplierId, suppliers.id));
        if (conditions.length > 0) {
          query = query.where(and3(...conditions));
        }
        if (filters?.limit) {
          query = query.limit(filters.limit);
        }
        if (filters?.offset) {
          query = query.offset(filters.offset);
        }
        query = query.orderBy(inventoryItems.description);
        const results = await query;
        return results.map((row) => ({
          ...row,
          supplierName: typeof row.supplierName === "string" ? row.supplierName : void 0,
          supplier: row.supplier && typeof row.supplier.id === "string" ? row.supplier : void 0,
          reservedQuantity: 0,
          availableQuantity: 0,
          totalStock: 0,
          storageLocation: null,
          weight: row.weight,
          dimensions: row.dimensions
        }));
      }
      async getInventoryItem(id) {
        const [result] = await db.select({
          id: inventoryItems.id,
          supplierCode: inventoryItems.supplierCode,
          barcode: inventoryItems.barcode,
          description: inventoryItems.description,
          category: inventoryItems.category,
          unitOfMeasure: inventoryItems.unitOfMeasure,
          // Removed invalid columns: unitCost, stockQuantity, reorderThreshold
          weight: inventoryItems.weight,
          dimensions: inventoryItems.dimensions,
          isActive: inventoryItems.isActive,
          supplierId: inventoryItems.supplierId,
          createdAt: inventoryItems.createdAt,
          updatedAt: inventoryItems.updatedAt,
          supplierName: suppliers.name,
          supplier: suppliers
        }).from(inventoryItems).leftJoin(suppliers, eq6(inventoryItems.supplierId, suppliers.id)).where(eq6(inventoryItems.id, id));
        if (!result) return void 0;
        return {
          ...result,
          supplierName: typeof result.supplierName === "string" ? result.supplierName : void 0,
          supplier: result.supplier && typeof result.supplier.id === "string" ? result.supplier : void 0,
          reservedQuantity: 0,
          availableQuantity: 0,
          totalStock: 0,
          storageLocation: null
        };
      }
      async getInventoryItemBySupplierCode(supplierCode) {
        const [result] = await db.select({
          id: inventoryItems.id,
          supplierCode: inventoryItems.supplierCode,
          barcode: inventoryItems.barcode,
          description: inventoryItems.description,
          category: inventoryItems.category,
          unitOfMeasure: inventoryItems.unitOfMeasure,
          // Removed invalid columns: unitCost, stockQuantity, reorderThreshold
          weight: inventoryItems.weight,
          dimensions: inventoryItems.dimensions,
          isActive: inventoryItems.isActive,
          supplierId: inventoryItems.supplierId,
          createdAt: inventoryItems.createdAt,
          updatedAt: inventoryItems.updatedAt,
          supplierName: suppliers.name,
          supplier: suppliers
        }).from(inventoryItems).leftJoin(suppliers, eq6(inventoryItems.supplierId, suppliers.id)).where(eq6(inventoryItems.supplierCode, supplierCode));
        if (!result) return void 0;
        return {
          ...result,
          supplierName: typeof result.supplierName === "string" ? result.supplierName : void 0,
          supplier: result.supplier && typeof result.supplier.id === "string" ? result.supplier : void 0,
          reservedQuantity: 0,
          availableQuantity: 0,
          totalStock: 0,
          storageLocation: null
        };
      }
      async getInventoryItemByBarcode(barcode) {
        const [result] = await db.select({
          id: inventoryItems.id,
          supplierCode: inventoryItems.supplierCode,
          barcode: inventoryItems.barcode,
          description: inventoryItems.description,
          category: inventoryItems.category,
          unitOfMeasure: inventoryItems.unitOfMeasure,
          // Removed invalid columns: unitCost, stockQuantity, reorderLevel
          weight: inventoryItems.weight,
          dimensions: inventoryItems.dimensions,
          isActive: inventoryItems.isActive,
          supplierId: inventoryItems.supplierId,
          createdAt: inventoryItems.createdAt,
          updatedAt: inventoryItems.updatedAt,
          supplierName: suppliers.name,
          supplier: suppliers
        }).from(inventoryItems).leftJoin(suppliers, eq6(inventoryItems.supplierId, suppliers.id)).where(eq6(inventoryItems.barcode, barcode));
        if (!result) return void 0;
        return {
          ...result,
          supplierName: typeof result.supplierName === "string" ? result.supplierName : void 0,
          supplier: result.supplier && typeof result.supplier.id === "string" ? result.supplier : void 0,
          reservedQuantity: 0,
          availableQuantity: 0,
          totalStock: 0,
          storageLocation: null
        };
      }
      async createInventoryItem(itemData) {
        const [item] = await db.insert(inventoryItems).values(itemData).returning();
        await this.logAuditEvent("inventory_item", item.id, "created", void 0, void 0, item);
        return item;
      }
      async updateInventoryItem(id, itemData) {
        const oldItem = await this.getInventoryItem(id);
        const [item] = await db.update(inventoryItems).set({ ...itemData, updatedAt: /* @__PURE__ */ new Date() }).where(eq6(inventoryItems.id, id)).returning();
        await this.logAuditEvent("inventory_item", item.id, "updated", void 0, oldItem, item);
        return item;
      }
      async deleteInventoryItem(id) {
        const oldItem = await this.getInventoryItem(id);
        await db.delete(inventoryItems).where(eq6(inventoryItems.id, id));
        await this.logAuditEvent("inventory_item", id, "deleted", void 0, oldItem, void 0);
      }
      async bulkCreateInventoryItems(items3) {
        const createdItems = await db.insert(inventoryItems).values(items3).returning();
        for (const item of createdItems) {
          await this.logAuditEvent("inventory_item", item.id, "created", void 0, void 0, item);
        }
        return createdItems;
      }
      // Stub implementations for the remaining interface methods
      async getItemVariants(itemId) {
        return [];
      }
      async getItemVariant(id) {
        return void 0;
      }
      async createItemVariant(variant) {
        throw new Error("Method not implemented");
      }
      async updateItemVariant(id, variant) {
        throw new Error("Method not implemented");
      }
      async deleteItemVariant(id) {
      }
      async getInventoryLevels(filters) {
        try {
          const { itemId, location, lowStock } = filters || {};
          const items3 = await this.getInventoryItems({ limit: 1e3 });
          const stockLevels = [];
          for (const item of items3) {
            if (itemId && item.id !== itemId) continue;
            const movements = await this.getStockMovements({
              itemId: item.id,
              limit: 1e3
            });
            let currentQuantity = 0;
            for (const movement of movements) {
              if (movement.movementType === "Receipt" || movement.movementType === "Adjustment") {
                currentQuantity += movement.quantityMoved || 0;
              } else if (movement.movementType === "Issue" || movement.movementType === "Transfer") {
                currentQuantity -= movement.quantityMoved || 0;
              }
            }
            if (location && location !== "MAIN") {
              continue;
            }
            if (lowStock && currentQuantity > 10) {
              continue;
            }
            stockLevels.push({
              id: `level-${item.id}`,
              itemId: item.id,
              itemName: item.description,
              itemCode: item.supplierCode,
              barcode: item.barcode,
              currentQuantity,
              location: location || "MAIN",
              reorderLevel: 10,
              // Default reorder level
              isLowStock: currentQuantity <= 10,
              lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
              supplierName: item.supplierName
            });
          }
          return stockLevels;
        } catch (error) {
          console.error("Error fetching inventory levels:", error);
          return [];
        }
      }
      async getInventoryLevel(id) {
        return void 0;
      }
      async getInventoryLevelByItem(itemId, location) {
        return void 0;
      }
      async createInventoryLevel(inventory) {
        throw new Error("Method not implemented");
      }
      async updateInventoryLevel(id, inventory) {
        throw new Error("Method not implemented");
      }
      async deleteInventoryLevel(id) {
      }
      async adjustInventoryQuantity(itemId, quantityChange, location, reason) {
        throw new Error("Method not implemented");
      }
      async getStockMovements(filters) {
        try {
          let query = this.db.select({
            id: stockMovements.id,
            itemId: stockMovements.itemId,
            variantId: stockMovements.variantId,
            movementType: stockMovements.movementType,
            referenceType: stockMovements.referenceType,
            referenceId: stockMovements.referenceId,
            storageLocation: stockMovements.storageLocation,
            fromLocation: stockMovements.fromLocation,
            toLocation: stockMovements.toLocation,
            quantityBefore: stockMovements.quantityBefore,
            quantityMoved: stockMovements.quantityMoved,
            quantityAfter: stockMovements.quantityAfter,
            unitCost: stockMovements.unitCost,
            totalValue: stockMovements.totalValue,
            status: stockMovements.status,
            notes: stockMovements.notes,
            createdBy: stockMovements.createdBy,
            createdAt: stockMovements.createdAt,
            // Join with inventory items to get item details
            itemName: inventoryItems.description,
            description: inventoryItems.description,
            barcode: inventoryItems.barcode
          }).from(stockMovements).leftJoin(inventoryItems, eq6(stockMovements.itemId, inventoryItems.id)).orderBy(desc4(stockMovements.createdAt));
          if (filters?.itemId) {
            query = query.where(eq6(stockMovements.itemId, filters.itemId));
          }
          if (filters?.movementType) {
            query = query.where(eq6(stockMovements.movementType, filters.movementType));
          }
          if (filters?.referenceType) {
            query = query.where(eq6(stockMovements.referenceType, filters.referenceType));
          }
          if (filters?.referenceId) {
            query = query.where(eq6(stockMovements.referenceId, filters.referenceId));
          }
          if (filters?.location) {
            query = query.where(eq6(stockMovements.storageLocation, filters.location));
          }
          if (filters?.dateFrom) {
            query = query.where(gte2(stockMovements.createdAt, new Date(filters.dateFrom)));
          }
          if (filters?.dateTo) {
            query = query.where(lte(stockMovements.createdAt, new Date(filters.dateTo)));
          }
          if (filters?.limit) {
            query = query.limit(filters.limit);
          }
          if (filters?.offset) {
            query = query.offset(filters.offset);
          }
          const movements = await query;
          return movements.map((movement) => ({
            ...movement,
            referenceNumber: movement.referenceId || `SM-${movement.id.slice(-8).toUpperCase()}`,
            transferDate: movement.createdAt,
            requestedBy: movement.createdBy,
            reason: movement.notes || "Stock Transfer",
            status: movement.status ?? this.mapMovementTypeToTransferStatus(movement.movementType),
            quantity: movement.quantityMoved,
            fromLocation: movement.fromLocation || (movement.movementType === "Transfer" ? movement.storageLocation || "Unknown" : "N/A"),
            toLocation: movement.toLocation || (movement.movementType === "Transfer" ? "Target Location" : movement.storageLocation)
          }));
        } catch (error) {
          console.error("Error fetching stock movements:", error);
          throw error;
        }
      }
      async getStockMovement(id) {
        try {
          const movement = await this.db.select({
            id: stockMovements.id,
            itemId: stockMovements.itemId,
            variantId: stockMovements.variantId,
            movementType: stockMovements.movementType,
            referenceType: stockMovements.referenceType,
            referenceId: stockMovements.referenceId,
            storageLocation: stockMovements.storageLocation,
            quantityBefore: stockMovements.quantityBefore,
            quantityMoved: stockMovements.quantityMoved,
            quantityAfter: stockMovements.quantityAfter,
            unitCost: stockMovements.unitCost,
            totalValue: stockMovements.totalValue,
            status: stockMovements.status,
            notes: stockMovements.notes,
            createdBy: stockMovements.createdBy,
            createdAt: stockMovements.createdAt,
            // Join with inventory items to get item details
            itemName: inventoryItems.description,
            itemCode: inventoryItems.barcode,
            description: inventoryItems.description
          }).from(stockMovements).leftJoin(inventoryItems, eq6(stockMovements.itemId, inventoryItems.id)).where(eq6(stockMovements.id, id)).limit(1);
          return movement[0] || null;
        } catch (error) {
          console.error("Error fetching stock movement:", error);
          throw error;
        }
      }
      async createStockMovement(movement) {
        try {
          const movementId = nanoid3();
          const mappedMovement = {
            id: movementId,
            itemId: movement.itemId || null,
            variantId: movement.variantId || null,
            movementType: movement.movementType || "Transfer",
            referenceType: movement.referenceType || "Transfer",
            referenceId: movement.referenceId || movement.transferNumber || `TRF-${movementId.slice(-8)}`,
            storageLocation: movement.storageLocation || movement.fromLocation || "Unknown",
            fromLocation: movement.fromLocation || movement.storageLocation || null,
            toLocation: movement.toLocation || null,
            quantityBefore: movement.quantityBefore || 0,
            quantityMoved: movement.quantityMoved,
            quantityAfter: movement.quantityAfter || (movement.quantityBefore || 0) + movement.quantityMoved,
            unitCost: movement.unitCost,
            totalValue: movement.totalValue,
            notes: movement.notes || movement.reason || "Stock transfer",
            createdBy: movement.createdBy || movement.requestedBy || "system",
            status: movement.status || "Draft",
            createdAt: movement.transferDate ? new Date(movement.transferDate) : /* @__PURE__ */ new Date()
          };
          const result = await this.db.insert(stockMovements).values(mappedMovement).returning();
          return result[0];
        } catch (error) {
          const err = error;
          console.error("Error creating stock movement:", err?.stack || err);
          throw err;
        }
      }
      mapMovementTypeToTransferStatus(movementType) {
        switch (movementType) {
          case "Transfer":
            return "In Transit";
          case "Receipt":
            return "Completed";
          case "Issue":
            return "Completed";
          case "Adjustment":
            return "Completed";
          default:
            return "Draft";
        }
      }
      async getItemStockHistory(itemId, limit) {
        try {
          let query = this.db.select().from(stockMovements).where(eq6(stockMovements.itemId, itemId)).orderBy(desc4(stockMovements.createdAt));
          if (limit) {
            query = query.limit(limit);
          }
          return await query;
        } catch (error) {
          console.error("Error fetching item stock history:", error);
          throw error;
        }
      }
    };
  }
});

// server/storage/enquiry-storage.ts
import { eq as eq7, desc as desc5, and as and4, or as or2, like as like2, count as count3, sql as sql4 } from "drizzle-orm";
var EnquiryStorage;
var init_enquiry_storage = __esm({
  "server/storage/enquiry-storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    init_base();
    EnquiryStorage = class extends BaseStorage {
      async getEnquiries(limit = 50, offset = 0, filters) {
        try {
          console.log("getEnquiries called with:", { limit, offset, filters });
          const conditions = [];
          if (filters?.status) {
            conditions.push(eq7(enquiries.status, filters.status));
          }
          if (filters?.source) {
            conditions.push(eq7(enquiries.source, filters.source));
          }
          if (filters?.customerId) {
            conditions.push(eq7(enquiries.customerId, filters.customerId));
          }
          if (filters?.dateFrom) {
            conditions.push(sql4`${enquiries.enquiryDate} >= ${filters.dateFrom}`);
          }
          if (filters?.dateTo) {
            conditions.push(sql4`${enquiries.enquiryDate} <= ${filters.dateTo}`);
          }
          if (filters?.search) {
            conditions.push(
              or2(
                like2(enquiries.enquiryNumber, `%${filters.search}%`),
                like2(enquiries.notes, `%${filters.search}%`)
              )
            );
          }
          let query = db.select().from(enquiries);
          if (conditions.length > 0) {
            query = query.where(and4(...conditions));
          }
          console.log("Executing query...");
          const result = await query.limit(limit).offset(offset).orderBy(desc5(enquiries.createdAt));
          console.log("Query result:", result.length, "enquiries found");
          return result;
        } catch (error) {
          console.error("Error in getEnquiries:", error);
          throw error;
        }
      }
      async getEnquiry(id) {
        const [enquiry] = await db.select().from(enquiries).where(eq7(enquiries.id, id));
        return enquiry;
      }
      async createEnquiry(enquiryData) {
        try {
          console.log("Creating enquiry with data:", enquiryData);
          let enquiryNumber;
          let attempts = 0;
          const maxAttempts = 10;
          do {
            const enquiryCount = await db.select({ count: count3() }).from(enquiries);
            const baseNumber = enquiryCount[0].count + 1 + attempts;
            enquiryNumber = `ENQ-2024-${String(baseNumber).padStart(3, "0")}`;
            const existing = await db.select({ id: enquiries.id }).from(enquiries).where(eq7(enquiries.enquiryNumber, enquiryNumber)).limit(1);
            if (existing.length === 0) break;
            attempts++;
          } while (attempts < maxAttempts);
          if (attempts >= maxAttempts) {
            throw new Error("Failed to generate unique enquiry number");
          }
          console.log("Generated enquiry number:", enquiryNumber);
          const processedData = {
            ...enquiryData,
            targetDeliveryDate: enquiryData.targetDeliveryDate ? new Date(enquiryData.targetDeliveryDate) : null,
            enquiryNumber
          };
          console.log("Processed data:", processedData);
          const [enquiry] = await db.insert(enquiries).values(processedData).returning();
          console.log("Created enquiry:", enquiry);
          return enquiry;
        } catch (error) {
          console.error("Error in createEnquiry:", error);
          throw error;
        }
      }
      async updateEnquiry(id, enquiryData) {
        const oldEnquiry = await this.getEnquiry(id);
        const processedData = {
          ...enquiryData,
          targetDeliveryDate: enquiryData.targetDeliveryDate ? new Date(enquiryData.targetDeliveryDate) : null,
          updatedAt: /* @__PURE__ */ new Date()
        };
        const [enquiry] = await db.update(enquiries).set(processedData).where(eq7(enquiries.id, id)).returning();
        await this.logAuditEvent("enquiry", id, "update", void 0, oldEnquiry, enquiry);
        return enquiry;
      }
      async deleteEnquiry(id) {
        const enquiry = await this.getEnquiry(id);
        await db.delete(enquiryItems).where(eq7(enquiryItems.enquiryId, id));
        await db.delete(enquiries).where(eq7(enquiries.id, id));
        await this.logAuditEvent("enquiry", id, "delete", void 0, enquiry, void 0);
      }
      // Enquiry Item operations
      async getEnquiryItems(enquiryId) {
        return db.select().from(enquiryItems).where(eq7(enquiryItems.enquiryId, enquiryId));
      }
      async getEnquiryItem(id) {
        const [item] = await db.select().from(enquiryItems).where(eq7(enquiryItems.id, id));
        return item;
      }
      async createEnquiryItem(enquiryItemData) {
        const processedData = {
          ...enquiryItemData,
          unitPrice: enquiryItemData.unitPrice ? String(enquiryItemData.unitPrice) : void 0
        };
        const [enquiryItem] = await db.insert(enquiryItems).values(processedData).returning();
        await this.logAuditEvent("enquiry_item", enquiryItem.id, "create", void 0, void 0, enquiryItem);
        return enquiryItem;
      }
      async updateEnquiryItem(id, enquiryItemData) {
        const oldItem = await this.getEnquiryItem(id);
        const processedData = {
          ...enquiryItemData,
          unitPrice: enquiryItemData.unitPrice ? String(enquiryItemData.unitPrice) : void 0
        };
        const [enquiryItem] = await db.update(enquiryItems).set(processedData).where(eq7(enquiryItems.id, id)).returning();
        await this.logAuditEvent("enquiry_item", id, "update", void 0, oldItem, enquiryItem);
        return enquiryItem;
      }
      async deleteEnquiryItem(id) {
        const item = await this.getEnquiryItem(id);
        await db.delete(enquiryItems).where(eq7(enquiryItems.id, id));
        await this.logAuditEvent("enquiry_item", id, "delete", void 0, item, void 0);
      }
      async bulkCreateEnquiryItems(enquiryItemsData) {
        if (enquiryItemsData.length === 0) return [];
        const processedData = enquiryItemsData.map((item) => ({
          ...item,
          unitPrice: item.unitPrice ? String(item.unitPrice) : void 0
        }));
        const items3 = await db.insert(enquiryItems).values(processedData).returning();
        for (const item of items3) {
          await this.logAuditEvent("enquiry_item", item.id, "create", void 0, void 0, item);
        }
        return items3;
      }
      async logAuditEvent(entityType, entityId, action, userId, oldData, newData) {
        await db.insert(auditLogs).values({
          entityType,
          entityId,
          action,
          oldData,
          newData,
          userId,
          timestamp: /* @__PURE__ */ new Date()
        });
      }
    };
  }
});

// server/storage/requisition-storage.ts
import { eq as eq8, desc as desc6, and as and5, or as or3, like as like3, count as count4, sql as sql5 } from "drizzle-orm";
var RequisitionStorage;
var init_requisition_storage = __esm({
  "server/storage/requisition-storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    init_base();
    RequisitionStorage = class extends BaseStorage {
      async getRequisitions(limit = 50, offset = 0, filters) {
        try {
          console.log("getRequisitions called with:", { limit, offset, filters });
          const conditions = [];
          let query = db.select().from(requisitions);
          if (filters?.status) {
            conditions.push(eq8(requisitions.status, filters.status));
          }
          if (filters?.priority) {
            conditions.push(eq8(requisitions.priority, filters.priority));
          }
          if (filters?.department) {
            conditions.push(like3(requisitions.department, `%${filters.department}%`));
          }
          if (filters?.dateFrom) {
            conditions.push(sql5`${requisitions.requestDate} >= ${filters.dateFrom}`);
          }
          if (filters?.dateTo) {
            conditions.push(sql5`${requisitions.requestDate} <= ${filters.dateTo}`);
          }
          if (filters?.search) {
            const searchConditions = [
              like3(requisitions.requisitionNumber, `%${filters.search}%`),
              like3(requisitions.requestedBy, `%${filters.search}%`),
              like3(requisitions.justification, `%${filters.search}%`),
              like3(requisitions.notes, `%${filters.search}%`)
            ];
            conditions.push(or3(...searchConditions));
          }
          if (conditions.length > 0) {
            query = query.where(and5(...conditions));
          }
          query = query.orderBy(desc6(requisitions.createdAt)).limit(limit).offset(offset);
          const results = await query;
          console.log(`getRequisitions found ${results.length} results`);
          return results;
        } catch (error) {
          console.error("Error getting requisitions:", error);
          throw error;
        }
      }
      async getRequisition(id) {
        try {
          const [result] = await db.select().from(requisitions).where(eq8(requisitions.id, id));
          return result || null;
        } catch (error) {
          console.error("Error getting requisition:", error);
          throw error;
        }
      }
      async getRequisitionByNumber(requisitionNumber) {
        try {
          const [result] = await db.select().from(requisitions).where(eq8(requisitions.requisitionNumber, requisitionNumber));
          return result || null;
        } catch (error) {
          console.error("Error getting requisition by number:", error);
          throw error;
        }
      }
      async createRequisition(data) {
        try {
          const requisitionNumber = this.generateNumber("REQ");
          const requisitionData = {
            ...data,
            requisitionNumber,
            totalEstimatedCost: data.totalEstimatedCost != null ? String(data.totalEstimatedCost) : "0"
          };
          const [result] = await db.insert(requisitions).values(requisitionData).returning();
          await this.logAuditEvent(
            "requisition",
            result.id,
            "created",
            `Created requisition ${requisitionNumber}`,
            null,
            result
          );
          return result;
        } catch (error) {
          console.error("Error creating requisition:", error);
          throw error;
        }
      }
      async updateRequisition(id, data) {
        try {
          const existing = await this.getRequisition(id);
          if (!existing) {
            throw new Error("Requisition not found");
          }
          const processedData = {
            ...data,
            totalEstimatedCost: data.totalEstimatedCost != null ? String(data.totalEstimatedCost) : "0",
            updatedAt: /* @__PURE__ */ new Date()
          };
          const [result] = await db.update(requisitions).set(processedData).where(eq8(requisitions.id, id)).returning();
          await this.logAuditEvent(
            "requisition",
            id,
            "updated",
            `Updated requisition ${existing.requisitionNumber}`,
            existing,
            result
          );
          return result;
        } catch (error) {
          console.error("Error updating requisition:", error);
          throw error;
        }
      }
      async deleteRequisition(id) {
        try {
          const existing = await this.getRequisition(id);
          if (!existing) {
            return false;
          }
          await db.delete(requisitionItems).where(eq8(requisitionItems.requisitionId, id));
          await db.delete(requisitions).where(eq8(requisitions.id, id));
          await this.logAuditEvent(
            "requisition",
            id,
            "deleted",
            `Deleted requisition ${existing.requisitionNumber}`,
            existing,
            null
          );
          return true;
        } catch (error) {
          console.error("Error deleting requisition:", error);
          throw error;
        }
      }
      async getRequisitionItems(requisitionId) {
        try {
          const results = await db.select().from(requisitionItems).where(eq8(requisitionItems.requisitionId, requisitionId)).orderBy(requisitionItems.createdAt);
          return results;
        } catch (error) {
          console.error("Error getting requisition items:", error);
          throw error;
        }
      }
      async createRequisitionItem(data) {
        try {
          const processedData = {
            ...data,
            estimatedCost: data.estimatedCost != null ? String(data.estimatedCost) : "0"
          };
          const [result] = await db.insert(requisitionItems).values(processedData).returning();
          await this.updateItemCount(data.requisitionId);
          return result;
        } catch (error) {
          console.error("Error creating requisition item:", error);
          throw error;
        }
      }
      async updateRequisitionItem(id, data) {
        try {
          const processedData = {
            ...data,
            estimatedCost: data.estimatedCost != null ? String(data.estimatedCost) : "0",
            updatedAt: /* @__PURE__ */ new Date()
          };
          const [result] = await db.update(requisitionItems).set(processedData).where(eq8(requisitionItems.id, id)).returning();
          if (result.requisitionId) {
            await this.updateItemCount(result.requisitionId);
          }
          return result;
        } catch (error) {
          console.error("Error updating requisition item:", error);
          throw error;
        }
      }
      async deleteRequisitionItem(id) {
        try {
          const [existing] = await db.select().from(requisitionItems).where(eq8(requisitionItems.id, id));
          if (!existing) {
            return false;
          }
          await db.delete(requisitionItems).where(eq8(requisitionItems.id, id));
          await this.updateItemCount(existing.requisitionId);
          return true;
        } catch (error) {
          console.error("Error deleting requisition item:", error);
          throw error;
        }
      }
      async searchRequisitions(searchTerm) {
        try {
          const searchConditions = [
            like3(requisitions.requisitionNumber, `%${searchTerm}%`),
            like3(requisitions.requestedBy, `%${searchTerm}%`),
            like3(requisitions.justification, `%${searchTerm}%`),
            like3(requisitions.notes, `%${searchTerm}%`)
          ];
          const results = await db.select().from(requisitions).where(or3(...searchConditions)).orderBy(desc6(requisitions.createdAt)).limit(20);
          return results;
        } catch (error) {
          console.error("Error searching requisitions:", error);
          throw error;
        }
      }
      async getRequisitionsCount(filters) {
        try {
          const conditions = [];
          if (filters?.status) {
            conditions.push(eq8(requisitions.status, filters.status));
          }
          if (filters?.priority) {
            conditions.push(eq8(requisitions.priority, filters.priority));
          }
          if (filters?.department) {
            conditions.push(like3(requisitions.department, `%${filters.department}%`));
          }
          let query = db.select({ count: count4() }).from(requisitions);
          if (conditions.length > 0) {
            query = query.where(and5(...conditions));
          }
          const [result] = await query;
          return result.count;
        } catch (error) {
          console.error("Error getting requisitions count:", error);
          throw error;
        }
      }
      async updateItemCount(requisitionId) {
        try {
          const [countResult] = await db.select({ count: count4() }).from(requisitionItems).where(eq8(requisitionItems.requisitionId, requisitionId));
          await db.update(requisitions).set({
            itemCount: countResult.count,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq8(requisitions.id, requisitionId));
        } catch (error) {
          console.error("Error updating item count:", error);
          throw error;
        }
      }
    };
  }
});

// server/storage/audit-storage.ts
var AuditStorage;
var init_audit_storage = __esm({
  "server/storage/audit-storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    init_base();
    AuditStorage = class extends BaseStorage {
      async logAuditEvent(entityType, entityId, action, userId, oldData, newData) {
        await db.insert(auditLogs).values({
          entityType,
          entityId,
          action,
          oldData,
          newData,
          userId
        });
      }
    };
  }
});

// shared/schemas/common.ts
import { z as z2 } from "zod";
import { nanoid as nanoid4 } from "nanoid";
import { sql as sql6, relations as relations2 } from "drizzle-orm";
import {
  pgTable as pgTable2,
  text as text2,
  varchar as varchar2,
  timestamp as timestamp2,
  decimal as decimal2,
  integer as integer2,
  jsonb as jsonb2,
  boolean as boolean2,
  pgEnum as pgEnum2,
  uuid as uuid2,
  date as date2
} from "drizzle-orm/pg-core";
import { createInsertSchema as createInsertSchema2 } from "drizzle-zod";
var init_common = __esm({
  "shared/schemas/common.ts"() {
    "use strict";
  }
});

// shared/schemas/enums.ts
var customerTypeEnum2, customerClassificationEnum2, enquiryStatusEnum2, enquirySourceEnum2, quotationStatusEnum2, salesOrderStatusEnum2, supplierLpoStatusEnum2, goodsReceiptStatusEnum2, deliveryStatusEnum2, invoiceStatusEnum2, approvalLevelEnum2, pricingMarkupLevelEnum2, pricingRuleTypeEnum2;
var init_enums = __esm({
  "shared/schemas/enums.ts"() {
    "use strict";
    init_common();
    customerTypeEnum2 = pgEnum2("customer_type", ["Retail", "Wholesale"]);
    customerClassificationEnum2 = pgEnum2("customer_classification", ["Internal", "Corporate", "Individual", "Family", "Ministry"]);
    enquiryStatusEnum2 = pgEnum2("enquiry_status", ["New", "In Progress", "Quoted", "Closed"]);
    enquirySourceEnum2 = pgEnum2("enquiry_source", ["Email", "Phone", "Web Form", "Walk-in"]);
    quotationStatusEnum2 = pgEnum2("quotation_status", ["Draft", "Sent", "Accepted", "Rejected", "Expired"]);
    salesOrderStatusEnum2 = pgEnum2("sales_order_status", ["Draft", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"]);
    supplierLpoStatusEnum2 = pgEnum2("supplier_lpo_status", ["Draft", "Sent", "Confirmed", "Received", "Cancelled"]);
    goodsReceiptStatusEnum2 = pgEnum2("goods_receipt_status", ["Pending", "Partial", "Complete", "Discrepancy", "Approved"]);
    deliveryStatusEnum2 = pgEnum2("delivery_status", ["Pending", "Partial", "Complete", "Cancelled"]);
    invoiceStatusEnum2 = pgEnum2("invoice_status", ["Draft", "Sent", "Paid", "Overdue", "Cancelled"]);
    approvalLevelEnum2 = pgEnum2("approval_level", ["Sales Rep", "Manager", "Finance", "Director"]);
    pricingMarkupLevelEnum2 = pgEnum2("pricing_markup_level", ["System", "Category", "Item"]);
    pricingRuleTypeEnum2 = pgEnum2("pricing_rule_type", ["Retail", "Wholesale", "Custom"]);
  }
});

// shared/schemas/pricing.ts
var pricingMethodEnum, marketDemandEnum, marketPositionEnum, productCategories2, markupConfiguration2, itemPricing2, customerPricing2, pricingRules2, priceLists2, priceListItems2, priceChangeHistory2, bulkPricingOperations2, insertProductCategorySchema2, insertMarkupConfigurationSchema2, insertItemPricingSchema2, insertCustomerPricingSchema2, insertPricingRuleSchema2, insertPriceListSchema2, insertPriceListItemSchema2, insertPriceChangeHistorySchema2, insertBulkPricingOperationSchema2, volumePricingTiers, contractPricing, competitorPricing, dynamicPricingConfig, pricingCalculations, currencyExchangeRates, marginAnalysis, insertVolumePricingTierSchema, insertContractPricingSchema, insertCompetitorPricingSchema, insertDynamicPricingConfigSchema, insertPricingCalculationSchema, insertCurrencyExchangeRateSchema, insertMarginAnalysisSchema;
var init_pricing = __esm({
  "shared/schemas/pricing.ts"() {
    "use strict";
    init_common();
    init_enums();
    pricingMethodEnum = pgEnum2("pricing_method", [
      "cost_plus",
      "margin_based",
      "competitive",
      "value_based",
      "dynamic",
      "contract",
      "volume_tiered"
    ]);
    marketDemandEnum = pgEnum2("market_demand", ["high", "medium", "low"]);
    marketPositionEnum = pgEnum2("market_position", ["above", "at", "below"]);
    productCategories2 = pgTable2("product_categories", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      name: varchar2("name", { length: 255 }).notNull(),
      description: text2("description"),
      parentCategoryId: uuid2("parent_category_id"),
      // Self-reference will be added as foreign key constraint
      retailMarkupPercentage: decimal2("retail_markup_percentage", { precision: 5, scale: 2 }),
      wholesaleMarkupPercentage: decimal2("wholesale_markup_percentage", { precision: 5, scale: 2 }),
      isActive: boolean2("is_active").default(true),
      createdAt: timestamp2("created_at").defaultNow(),
      updatedAt: timestamp2("updated_at").defaultNow()
    });
    markupConfiguration2 = pgTable2("markup_configuration", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      level: pricingMarkupLevelEnum2("level").notNull(),
      entityId: uuid2("entity_id"),
      // null for system-wide, category_id for category, item_id for item
      retailMarkupPercentage: decimal2("retail_markup_percentage", { precision: 5, scale: 2 }).notNull(),
      wholesaleMarkupPercentage: decimal2("wholesale_markup_percentage", { precision: 5, scale: 2 }).notNull(),
      effectiveFrom: timestamp2("effective_from").defaultNow(),
      effectiveTo: timestamp2("effective_to"),
      isActive: boolean2("is_active").default(true),
      createdBy: uuid2("created_by"),
      updatedBy: uuid2("updated_by"),
      createdAt: timestamp2("created_at").defaultNow(),
      updatedAt: timestamp2("updated_at").defaultNow()
    });
    itemPricing2 = pgTable2("item_pricing", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      itemId: uuid2("item_id").notNull(),
      supplierCost: decimal2("supplier_cost", { precision: 12, scale: 2 }).notNull(),
      retailPrice: decimal2("retail_price", { precision: 12, scale: 2 }).notNull(),
      wholesalePrice: decimal2("wholesale_price", { precision: 12, scale: 2 }).notNull(),
      retailMarkupPercentage: decimal2("retail_markup_percentage", { precision: 5, scale: 2 }),
      wholesaleMarkupPercentage: decimal2("wholesale_markup_percentage", { precision: 5, scale: 2 }),
      isManualOverride: boolean2("is_manual_override").default(false),
      overrideReason: text2("override_reason"),
      currency: varchar2("currency", { length: 3 }).default("USD"),
      effectiveFrom: timestamp2("effective_from").defaultNow(),
      effectiveTo: timestamp2("effective_to"),
      isActive: boolean2("is_active").default(true),
      createdBy: uuid2("created_by"),
      updatedBy: uuid2("updated_by"),
      createdAt: timestamp2("created_at").defaultNow(),
      updatedAt: timestamp2("updated_at").defaultNow()
    });
    customerPricing2 = pgTable2("customer_pricing", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      customerId: uuid2("customer_id").notNull(),
      itemId: uuid2("item_id").notNull(),
      specialPrice: decimal2("special_price", { precision: 12, scale: 2 }).notNull(),
      discountPercentage: decimal2("discount_percentage", { precision: 5, scale: 2 }),
      minimumQuantity: integer2("minimum_quantity").default(1),
      maximumQuantity: integer2("maximum_quantity"),
      validFrom: timestamp2("valid_from").defaultNow(),
      validTo: timestamp2("valid_to"),
      isActive: boolean2("is_active").default(true),
      createdBy: uuid2("created_by"),
      updatedBy: uuid2("updated_by"),
      createdAt: timestamp2("created_at").defaultNow(),
      updatedAt: timestamp2("updated_at").defaultNow()
    });
    pricingRules2 = pgTable2("pricing_rules", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      name: varchar2("name", { length: 255 }).notNull(),
      description: text2("description"),
      ruleType: pricingRuleTypeEnum2("rule_type").notNull(),
      conditions: jsonb2("conditions").notNull(),
      // JSON conditions for rule application
      actions: jsonb2("actions").notNull(),
      // JSON actions for price calculation
      priority: integer2("priority").default(100),
      isActive: boolean2("is_active").default(true),
      createdBy: uuid2("created_by"),
      updatedBy: uuid2("updated_by"),
      createdAt: timestamp2("created_at").defaultNow(),
      updatedAt: timestamp2("updated_at").defaultNow()
    });
    priceLists2 = pgTable2("price_lists", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      name: varchar2("name", { length: 255 }).notNull(),
      description: text2("description"),
      type: varchar2("type", { length: 50 }).notNull(),
      // "retail", "wholesale", "custom"
      customerId: uuid2("customer_id"),
      // for customer-specific price lists
      categoryId: uuid2("category_id"),
      // for category-specific price lists
      currency: varchar2("currency", { length: 3 }).default("USD"),
      validFrom: timestamp2("valid_from").defaultNow(),
      validTo: timestamp2("valid_to"),
      generatedAt: timestamp2("generated_at"),
      fileUrl: varchar2("file_url", { length: 500 }),
      downloadCount: integer2("download_count").default(0),
      isActive: boolean2("is_active").default(true),
      createdBy: uuid2("created_by"),
      updatedBy: uuid2("updated_by"),
      createdAt: timestamp2("created_at").defaultNow(),
      updatedAt: timestamp2("updated_at").defaultNow()
    });
    priceListItems2 = pgTable2("price_list_items", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      priceListId: uuid2("price_list_id").notNull(),
      itemId: uuid2("item_id").notNull(),
      price: decimal2("price", { precision: 12, scale: 2 }).notNull(),
      effectivePrice: decimal2("effective_price", { precision: 12, scale: 2 }).notNull(),
      discountPercentage: decimal2("discount_percentage", { precision: 5, scale: 2 }),
      minimumQuantity: integer2("minimum_quantity").default(1),
      notes: text2("notes")
    });
    priceChangeHistory2 = pgTable2("price_change_history", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      itemId: uuid2("item_id").notNull(),
      changeType: varchar2("change_type", { length: 50 }).notNull(),
      // "cost_update", "markup_change", "manual_override"
      oldSupplierCost: decimal2("old_supplier_cost", { precision: 12, scale: 2 }),
      newSupplierCost: decimal2("new_supplier_cost", { precision: 12, scale: 2 }),
      oldRetailPrice: decimal2("old_retail_price", { precision: 12, scale: 2 }),
      newRetailPrice: decimal2("new_retail_price", { precision: 12, scale: 2 }),
      oldWholesalePrice: decimal2("old_wholesale_price", { precision: 12, scale: 2 }),
      newWholesalePrice: decimal2("new_wholesale_price", { precision: 12, scale: 2 }),
      reason: text2("reason"),
      triggeredBy: varchar2("triggered_by", { length: 100 }),
      // "system", "manual", "supplier_update"
      userId: uuid2("user_id"),
      createdAt: timestamp2("created_at").defaultNow()
    });
    bulkPricingOperations2 = pgTable2("bulk_pricing_operations", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      operationType: varchar2("operation_type", { length: 50 }).notNull(),
      // "markup_update", "cost_update", "price_override"
      criteria: jsonb2("criteria").notNull(),
      // JSON criteria for operation
      changes: jsonb2("changes").notNull(),
      // JSON changes to apply
      status: varchar2("status", { length: 50 }).default("pending"),
      // "pending", "processing", "completed", "failed"
      affectedItemsCount: integer2("affected_items_count").default(0),
      processedItemsCount: integer2("processed_items_count").default(0),
      errorLog: text2("error_log"),
      startedAt: timestamp2("started_at"),
      completedAt: timestamp2("completed_at"),
      createdBy: uuid2("created_by"),
      createdAt: timestamp2("created_at").defaultNow()
    });
    insertProductCategorySchema2 = createInsertSchema2(productCategories2).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertMarkupConfigurationSchema2 = createInsertSchema2(markupConfiguration2).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertItemPricingSchema2 = createInsertSchema2(itemPricing2).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertCustomerPricingSchema2 = createInsertSchema2(customerPricing2).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPricingRuleSchema2 = createInsertSchema2(pricingRules2).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPriceListSchema2 = createInsertSchema2(priceLists2).omit({
      id: true,
      generatedAt: true,
      createdAt: true,
      updatedAt: true
    });
    insertPriceListItemSchema2 = createInsertSchema2(priceListItems2).omit({
      id: true
    });
    insertPriceChangeHistorySchema2 = createInsertSchema2(priceChangeHistory2).omit({
      id: true,
      createdAt: true
    });
    insertBulkPricingOperationSchema2 = createInsertSchema2(bulkPricingOperations2).omit({
      id: true,
      createdAt: true
    });
    volumePricingTiers = pgTable2("volume_pricing_tiers", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      itemId: uuid2("item_id").notNull(),
      customerId: uuid2("customer_id"),
      // null for general, specific customer for custom tiers
      tierName: varchar2("tier_name", { length: 100 }).notNull(),
      minQuantity: integer2("min_quantity").notNull(),
      maxQuantity: integer2("max_quantity"),
      // null for unlimited
      discountPercentage: decimal2("discount_percentage", { precision: 5, scale: 2 }),
      specialPrice: decimal2("special_price", { precision: 12, scale: 2 }),
      currency: varchar2("currency", { length: 3 }).default("USD"),
      effectiveFrom: timestamp2("effective_from").defaultNow(),
      effectiveTo: timestamp2("effective_to"),
      isActive: boolean2("is_active").default(true),
      createdAt: timestamp2("created_at").defaultNow(),
      updatedAt: timestamp2("updated_at").defaultNow()
    });
    contractPricing = pgTable2("contract_pricing", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      contractNumber: varchar2("contract_number", { length: 50 }).unique().notNull(),
      customerId: uuid2("customer_id").notNull(),
      supplierId: uuid2("supplier_id"),
      itemId: uuid2("item_id").notNull(),
      contractPrice: decimal2("contract_price", { precision: 12, scale: 2 }).notNull(),
      minimumQuantity: integer2("minimum_quantity"),
      maximumQuantity: integer2("maximum_quantity"),
      currency: varchar2("currency", { length: 3 }).default("USD"),
      contractStartDate: timestamp2("contract_start_date").notNull(),
      contractEndDate: timestamp2("contract_end_date").notNull(),
      priceProtectionClause: text2("price_protection_clause"),
      autoRenewal: boolean2("auto_renewal").default(false),
      renewalNoticeDays: integer2("renewal_notice_days").default(30),
      status: varchar2("status", { length: 20 }).default("active"),
      // active, expired, cancelled, suspended
      terms: text2("terms"),
      createdBy: uuid2("created_by"),
      approvedBy: uuid2("approved_by"),
      createdAt: timestamp2("created_at").defaultNow(),
      updatedAt: timestamp2("updated_at").defaultNow()
    });
    competitorPricing = pgTable2("competitor_pricing", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      competitorName: varchar2("competitor_name", { length: 255 }).notNull(),
      itemId: uuid2("item_id").notNull(),
      competitorSku: varchar2("competitor_sku", { length: 100 }),
      price: decimal2("price", { precision: 12, scale: 2 }).notNull(),
      currency: varchar2("currency", { length: 3 }).default("USD"),
      source: varchar2("source", { length: 100 }),
      // website, catalog, direct_quote, etc.
      sourceUrl: varchar2("source_url", { length: 500 }),
      verifiedAt: timestamp2("verified_at").defaultNow(),
      isActive: boolean2("is_active").default(true),
      notes: text2("notes"),
      collectedBy: uuid2("collected_by"),
      createdAt: timestamp2("created_at").defaultNow()
    });
    dynamicPricingConfig = pgTable2("dynamic_pricing_config", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      itemId: uuid2("item_id").notNull(),
      categoryId: uuid2("category_id"),
      customerId: uuid2("customer_id"),
      enabled: boolean2("enabled").default(false),
      // Market factors
      marketDemandFactor: decimal2("market_demand_factor", { precision: 3, scale: 2 }).default("1.00"),
      seasonalFactor: decimal2("seasonal_factor", { precision: 3, scale: 2 }).default("1.00"),
      competitorFactor: decimal2("competitor_factor", { precision: 3, scale: 2 }).default("1.00"),
      inventoryFactor: decimal2("inventory_factor", { precision: 3, scale: 2 }).default("1.00"),
      // Constraints
      minPrice: decimal2("min_price", { precision: 12, scale: 2 }),
      maxPrice: decimal2("max_price", { precision: 12, scale: 2 }),
      minMarginPercentage: decimal2("min_margin_percentage", { precision: 5, scale: 2 }).default("10.00"),
      maxMarkupPercentage: decimal2("max_markup_percentage", { precision: 5, scale: 2 }),
      // Update frequency
      updateFrequencyHours: integer2("update_frequency_hours").default(24),
      lastUpdated: timestamp2("last_updated").defaultNow(),
      isActive: boolean2("is_active").default(true),
      createdAt: timestamp2("created_at").defaultNow(),
      updatedAt: timestamp2("updated_at").defaultNow()
    });
    pricingCalculations = pgTable2("pricing_calculations", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      itemId: uuid2("item_id").notNull(),
      customerId: uuid2("customer_id"),
      method: pricingMethodEnum("method").notNull(),
      // Input parameters
      costPrice: decimal2("cost_price", { precision: 12, scale: 2 }).notNull(),
      quantity: integer2("quantity").default(1),
      requestedCurrency: varchar2("requested_currency", { length: 3 }).default("USD"),
      // Calculated results
      basePrice: decimal2("base_price", { precision: 12, scale: 2 }).notNull(),
      finalPrice: decimal2("final_price", { precision: 12, scale: 2 }).notNull(),
      grossMargin: decimal2("gross_margin", { precision: 12, scale: 2 }),
      marginPercentage: decimal2("margin_percentage", { precision: 5, scale: 2 }),
      markupPercentage: decimal2("markup_percentage", { precision: 5, scale: 2 }),
      // Applied factors
      volumeDiscount: decimal2("volume_discount", { precision: 5, scale: 2 }),
      seasonalAdjustment: decimal2("seasonal_adjustment", { precision: 5, scale: 2 }),
      competitiveAdjustment: decimal2("competitive_adjustment", { precision: 5, scale: 2 }),
      // Metadata
      calculationFactors: jsonb2("calculation_factors"),
      // Array of applied factors
      competitorPrices: jsonb2("competitor_prices"),
      // Array of competitor price data
      validUntil: timestamp2("valid_until"),
      calculatedAt: timestamp2("calculated_at").defaultNow()
    });
    currencyExchangeRates = pgTable2("currency_exchange_rates", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      fromCurrency: varchar2("from_currency", { length: 3 }).notNull(),
      toCurrency: varchar2("to_currency", { length: 3 }).notNull(),
      rate: decimal2("rate", { precision: 10, scale: 6 }).notNull(),
      source: varchar2("source", { length: 100 }),
      // ecb, fed, manual, etc.
      effectiveDate: timestamp2("effective_date").defaultNow(),
      expiresAt: timestamp2("expires_at"),
      isActive: boolean2("is_active").default(true),
      createdAt: timestamp2("created_at").defaultNow()
    });
    marginAnalysis = pgTable2("margin_analysis", {
      id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
      itemId: uuid2("item_id").notNull(),
      customerId: uuid2("customer_id"),
      categoryId: uuid2("category_id"),
      // Time period
      analysisDate: timestamp2("analysis_date").defaultNow(),
      periodStart: timestamp2("period_start").notNull(),
      periodEnd: timestamp2("period_end").notNull(),
      // Volume metrics
      totalQuantitySold: integer2("total_quantity_sold").default(0),
      totalRevenue: decimal2("total_revenue", { precision: 12, scale: 2 }).default("0"),
      totalCost: decimal2("total_cost", { precision: 12, scale: 2 }).default("0"),
      // Margin metrics
      averageSellingPrice: decimal2("average_selling_price", { precision: 12, scale: 2 }),
      averageCost: decimal2("average_cost", { precision: 12, scale: 2 }),
      grossMargin: decimal2("gross_margin", { precision: 12, scale: 2 }),
      marginPercentage: decimal2("margin_percentage", { precision: 5, scale: 2 }),
      // Performance indicators
      marginTrend: varchar2("margin_trend", { length: 20 }),
      // increasing, decreasing, stable
      profitabilityRating: varchar2("profitability_rating", { length: 20 }),
      // excellent, good, fair, poor
      recommendedAction: text2("recommended_action"),
      createdAt: timestamp2("created_at").defaultNow()
    });
    insertVolumePricingTierSchema = createInsertSchema2(volumePricingTiers).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertContractPricingSchema = createInsertSchema2(contractPricing).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertCompetitorPricingSchema = createInsertSchema2(competitorPricing).omit({
      id: true,
      createdAt: true
    });
    insertDynamicPricingConfigSchema = createInsertSchema2(dynamicPricingConfig).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPricingCalculationSchema = createInsertSchema2(pricingCalculations).omit({
      id: true,
      calculatedAt: true
    });
    insertCurrencyExchangeRateSchema = createInsertSchema2(currencyExchangeRates).omit({
      id: true,
      createdAt: true
    });
    insertMarginAnalysisSchema = createInsertSchema2(marginAnalysis).omit({
      id: true,
      createdAt: true
    });
  }
});

// server/services/pricing-engine.ts
import { eq as eq9 } from "drizzle-orm";
var CURRENCY_RATES, EnhancedPricingEngine, pricingEngine;
var init_pricing_engine = __esm({
  "server/services/pricing-engine.ts"() {
    "use strict";
    init_db();
    init_schema();
    CURRENCY_RATES = {
      BHD: 1,
      // Treat Bahraini Dinar as base for internal conversions now
      USD: 2.65,
      // Approx rate: 1 BHD ≈ 2.65 USD (inverse of 0.376)
      AED: 9.95,
      // 1 BHD ≈ 9.95 AED
      KWD: 0.81,
      // 1 BHD ≈ 0.81 KWD
      SAR: 9.94,
      // 1 BHD ≈ 9.94 SAR
      EUR: 0.93,
      // 1 BHD ≈ 0.93 EUR (approx)
      GBP: 0.79
      // 1 BHD ≈ 0.79 GBP (approx)
    };
    EnhancedPricingEngine = class {
      /**
       * Calculate comprehensive pricing for an item
       */
      async calculatePrice(config, quantity = 1) {
        const item = await this.getItemWithCost(config.itemId);
        if (!item) {
          throw new Error(`Item not found: ${config.itemId}`);
        }
        const costPrice = parseFloat(item.costPrice || "0");
        let basePrice = costPrice;
        let finalPrice = costPrice;
        const factors = [];
        switch (config.method) {
          case "cost_plus" /* COST_PLUS */:
            finalPrice = this.calculateCostPlus(costPrice, config.markup || 0);
            factors.push(`Cost-plus with ${config.markup}% markup`);
            break;
          case "margin_based" /* MARGIN_BASED */:
            finalPrice = this.calculateMarginBased(costPrice, config.targetMargin || 0);
            factors.push(`Margin-based with ${config.targetMargin}% target margin`);
            break;
          case "competitive" /* COMPETITIVE */:
            finalPrice = this.calculateCompetitive(costPrice, config.competitorPrices || []);
            factors.push("Competitive pricing based on market analysis");
            break;
          case "volume_tiered" /* VOLUME_TIERED */:
            finalPrice = this.calculateVolumeTiered(costPrice, quantity, config.volumeTiers || []);
            factors.push(`Volume pricing for quantity ${quantity}`);
            break;
          case "dynamic" /* DYNAMIC */:
            finalPrice = this.calculateDynamic(costPrice, config);
            factors.push("Dynamic pricing with market factors");
            break;
          case "contract" /* CONTRACT */:
            finalPrice = config.contractPrice || costPrice;
            factors.push("Contract pricing");
            break;
          default:
            const markup2 = config.customerType === "Retail" ? 0.7 : 0.4;
            finalPrice = costPrice * (1 + markup2);
            factors.push(`Default ${config.customerType} markup: ${markup2 * 100}%`);
        }
        basePrice = finalPrice;
        const volumeResult = this.applyVolumeDiscounts(finalPrice, quantity, config.volumeTiers || []);
        finalPrice = volumeResult.price;
        if (volumeResult.discount > 0) {
          factors.push(`Volume discount: ${volumeResult.discount}%`);
        }
        if (config.seasonalFactor && config.seasonalFactor !== 1) {
          finalPrice *= config.seasonalFactor;
          factors.push(`Seasonal factor: ${config.seasonalFactor}`);
        }
        if (config.minPrice && finalPrice < config.minPrice) {
          finalPrice = config.minPrice;
          factors.push(`Applied minimum price: ${config.minPrice}`);
        }
        if (config.maxPrice && finalPrice > config.maxPrice) {
          finalPrice = config.maxPrice;
          factors.push(`Applied maximum price: ${config.maxPrice}`);
        }
        const conversionRate = this.getCurrencyRate(config.baseCurrency, config.targetCurrency);
        const priceInTargetCurrency = finalPrice * conversionRate;
        const grossMargin = finalPrice - costPrice;
        const marginPercentage = grossMargin / finalPrice * 100;
        const markup = finalPrice - costPrice;
        const markupPercentage = markup / costPrice * 100;
        let competitorAverage;
        let marketPosition;
        if (config.competitorPrices && config.competitorPrices.length > 0) {
          competitorAverage = config.competitorPrices.reduce((a, b) => a + b, 0) / config.competitorPrices.length;
          if (finalPrice > competitorAverage * 1.1) marketPosition = "above";
          else if (finalPrice < competitorAverage * 0.9) marketPosition = "below";
          else marketPosition = "at";
        }
        return {
          itemId: config.itemId,
          customerId: config.customerId,
          method: config.method,
          costPrice,
          basePrice,
          finalPrice,
          baseCurrency: config.baseCurrency,
          targetCurrency: config.targetCurrency,
          conversionRate,
          priceInTargetCurrency,
          grossMargin,
          marginPercentage,
          markup,
          markupPercentage,
          appliedVolumeDiscount: volumeResult.discount,
          volumeTierApplied: volumeResult.tier,
          competitorAverage,
          marketPosition,
          calculatedAt: /* @__PURE__ */ new Date(),
          validUntil: config.contractValidTo,
          factors
        };
      }
      /**
       * Cost-plus pricing: Cost + Fixed Markup
       */
      calculateCostPlus(cost, markupPercentage) {
        return cost * (1 + markupPercentage / 100);
      }
      /**
       * Margin-based pricing: Price = Cost / (1 - Margin%)
       */
      calculateMarginBased(cost, targetMarginPercentage) {
        if (targetMarginPercentage >= 100) {
          throw new Error("Target margin cannot be 100% or higher");
        }
        return cost / (1 - targetMarginPercentage / 100);
      }
      /**
       * Competitive pricing based on competitor analysis
       */
      calculateCompetitive(cost, competitorPrices) {
        if (competitorPrices.length === 0) {
          return cost * 1.3;
        }
        const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
        const targetPrice = avgCompetitorPrice * 0.95;
        const minPrice = cost / (1 - 0.2);
        return Math.max(targetPrice, minPrice);
      }
      /**
       * Volume-tiered pricing with quantity discounts
       */
      calculateVolumeTiered(cost, quantity, tiers) {
        const defaultMarkup = 0.4;
        let basePrice = cost * (1 + defaultMarkup);
        const applicableTier = tiers.find(
          (tier) => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity)
        );
        if (applicableTier) {
          if (applicableTier.specialPrice) {
            return applicableTier.specialPrice;
          } else {
            return basePrice * (1 - applicableTier.discountPercentage / 100);
          }
        }
        return basePrice;
      }
      /**
       * Dynamic pricing with market factors
       */
      calculateDynamic(cost, config) {
        let price = cost * 1.3;
        if (config.marketDemand === "high") price *= 1.1;
        else if (config.marketDemand === "low") price *= 0.9;
        if (config.competitorPrices && config.competitorPrices.length > 0) {
          const avgCompetitor = config.competitorPrices.reduce((a, b) => a + b, 0) / config.competitorPrices.length;
          if (price > avgCompetitor * 1.1) price = avgCompetitor * 1.05;
          else if (price < avgCompetitor * 0.9) price = avgCompetitor * 0.95;
        }
        return price;
      }
      /**
       * Apply volume discounts to calculated price
       */
      applyVolumeDiscounts(price, quantity, tiers) {
        const applicableTier = tiers.find(
          (tier) => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity)
        );
        if (applicableTier) {
          const discountedPrice = price * (1 - applicableTier.discountPercentage / 100);
          return {
            price: discountedPrice,
            discount: applicableTier.discountPercentage,
            tier: applicableTier
          };
        }
        return { price, discount: 0 };
      }
      /**
       * Get currency conversion rate
       */
      getCurrencyRate(fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return 1;
        const fromRate = CURRENCY_RATES[fromCurrency] || 1;
        const toRate = CURRENCY_RATES[toCurrency] || 1;
        return toRate / fromRate;
      }
      /**
       * Get item with cost information
       */
      async getItemWithCost(itemId) {
        const [item] = await db.select().from(items).where(eq9(items.id, itemId)).limit(1);
        return item;
      }
      /**
       * Calculate optimal pricing for customer type and quantity
       */
      async calculateOptimalPrice(itemId, customerId, quantity = 1) {
        const [customer] = await db.select().from(customers).where(eq9(customers.id, customerId)).limit(1);
        if (!customer) {
          throw new Error(`Customer not found: ${customerId}`);
        }
        const item = await this.getItemWithCost(itemId);
        if (!item) {
          throw new Error(`Item not found: ${itemId}`);
        }
        let method = "margin_based" /* MARGIN_BASED */;
        let targetMargin = customer.customerType === "Retail" ? 70 : 40;
        if (quantity >= 100) {
          method = "volume_tiered" /* VOLUME_TIERED */;
        }
        const volumeTiers = [
          { minQuantity: 1, maxQuantity: 9, discountPercentage: 0 },
          { minQuantity: 10, maxQuantity: 49, discountPercentage: 5 },
          { minQuantity: 50, maxQuantity: 99, discountPercentage: 10 },
          { minQuantity: 100, maxQuantity: 499, discountPercentage: 15 },
          { minQuantity: 500, discountPercentage: 20 }
        ];
        const config = {
          itemId,
          customerId,
          customerType: customer.customerType,
          method,
          baseCurrency: "USD",
          targetCurrency: "USD",
          targetMargin,
          volumeTiers,
          minMargin: 10
          // Minimum 10% margin
        };
        return this.calculatePrice(config, quantity);
      }
      /**
       * Batch calculate prices for multiple items
       */
      async calculateBatchPrices(itemIds, customerId, quantities = []) {
        const results = [];
        for (let i = 0; i < itemIds.length; i++) {
          const itemId = itemIds[i];
          const quantity = quantities[i] || 1;
          try {
            const result = await this.calculateOptimalPrice(itemId, customerId, quantity);
            results.push(result);
          } catch (error) {
            console.error(`Error calculating price for item ${itemId}:`, error);
          }
        }
        return results;
      }
      /**
       * Generate price analysis report
       */
      async generatePriceAnalysis(itemId) {
        const item = await this.getItemWithCost(itemId);
        if (!item) {
          throw new Error(`Item not found: ${itemId}`);
        }
        const scenarios = [
          {
            itemId,
            customerType: "Retail",
            method: "margin_based" /* MARGIN_BASED */,
            targetMargin: 70,
            baseCurrency: "USD",
            targetCurrency: "USD"
          },
          {
            itemId,
            customerType: "Wholesale",
            method: "margin_based" /* MARGIN_BASED */,
            targetMargin: 40,
            baseCurrency: "USD",
            targetCurrency: "USD"
          },
          {
            itemId,
            customerType: "Wholesale",
            method: "volume_tiered" /* VOLUME_TIERED */,
            baseCurrency: "USD",
            targetCurrency: "USD",
            volumeTiers: [
              { minQuantity: 100, discountPercentage: 15 },
              { minQuantity: 500, discountPercentage: 25 }
            ]
          }
        ];
        const currentPricing = [];
        for (const scenario of scenarios) {
          const result = await this.calculatePrice(scenario);
          currentPricing.push(result);
        }
        const recommendations = [];
        const costPrice = parseFloat(item.costPrice || "0");
        if (currentPricing[0].marginPercentage < 50) {
          recommendations.push("Consider increasing retail margin for better profitability");
        }
        if (currentPricing[1].marginPercentage < 25) {
          recommendations.push("Wholesale margin is below industry standards");
        }
        recommendations.push("Consider implementing volume discounts for quantities above 50 units");
        recommendations.push("Monitor competitor pricing regularly for optimal positioning");
        return {
          item,
          currentPricing,
          recommendations,
          competitivePosition: "Market analysis pending - integrate with competitor data"
        };
      }
    };
    pricingEngine = new EnhancedPricingEngine();
  }
});

// server/storage/pricing-storage.ts
var pricing_storage_exports = {};
__export(pricing_storage_exports, {
  EnhancedPricingStorage: () => EnhancedPricingStorage,
  enhancedPricingStorage: () => enhancedPricingStorage
});
import { eq as eq10, and as and7, gte as gte4, lte as lte3, desc as desc8, asc as asc2, like as like4 } from "drizzle-orm";
var EnhancedPricingStorage, enhancedPricingStorage;
var init_pricing_storage = __esm({
  "server/storage/pricing-storage.ts"() {
    "use strict";
    init_db();
    init_pricing();
    init_schema();
    init_base();
    init_pricing_engine();
    EnhancedPricingStorage = class extends BaseStorage {
      // Volume Pricing Tiers Management
      async getVolumePricingTiers(itemId, customerId) {
        const conditions = [];
        if (itemId) {
          conditions.push(eq10(volumePricingTiers.itemId, itemId));
        }
        if (customerId) {
          conditions.push(eq10(volumePricingTiers.customerId, customerId));
        }
        conditions.push(eq10(volumePricingTiers.isActive, true));
        return await db.select().from(volumePricingTiers).where(conditions.length > 0 ? and7(...conditions) : void 0).orderBy(asc2(volumePricingTiers.minQuantity));
      }
      async createVolumePricingTier(tier) {
        const [created] = await db.insert(volumePricingTiers).values(tier).returning();
        await this.logAuditEvent(
          "volume_pricing_tier",
          created.id,
          "created",
          tier.customerId || "system",
          null,
          created
        );
        return created;
      }
      async updateVolumePricingTier(id, updates) {
        const existing = await this.getVolumePricingTier(id);
        if (!existing) {
          throw new Error("Volume pricing tier not found");
        }
        const [updated] = await db.update(volumePricingTiers).set({ ...updates, updatedAt: this.getCurrentTimestamp() }).where(eq10(volumePricingTiers.id, id)).returning();
        await this.logAuditEvent(
          "volume_pricing_tier",
          id,
          "updated",
          updates.customerId || "system",
          existing,
          updated
        );
        return updated;
      }
      async getVolumePricingTier(id) {
        const [tier] = await db.select().from(volumePricingTiers).where(eq10(volumePricingTiers.id, id)).limit(1);
        return tier;
      }
      // Contract Pricing Management
      async getContractPricing(filters) {
        const conditions = [];
        if (filters?.customerId) {
          conditions.push(eq10(contractPricing.customerId, filters.customerId));
        }
        if (filters?.itemId) {
          conditions.push(eq10(contractPricing.itemId, filters.itemId));
        }
        if (filters?.status) {
          conditions.push(eq10(contractPricing.status, filters.status));
        }
        if (filters?.activeOnly) {
          const now = /* @__PURE__ */ new Date();
          conditions.push(
            and7(
              eq10(contractPricing.status, "active"),
              lte3(contractPricing.contractStartDate, now),
              gte4(contractPricing.contractEndDate, now)
            )
          );
        }
        return await db.select().from(contractPricing).where(conditions.length > 0 ? and7(...conditions) : void 0).orderBy(desc8(contractPricing.contractStartDate));
      }
      async createContractPricing(contract) {
        const contractNumber = contract.contractNumber || this.generateNumber("CNT");
        const contractData = {
          ...contract,
          contractNumber
        };
        const [created] = await db.insert(contractPricing).values(contractData).returning();
        await this.logAuditEvent(
          "contract_pricing",
          created.id,
          "created",
          contract.createdBy || "system",
          null,
          created
        );
        return created;
      }
      async updateContractPricing(id, updates) {
        const existing = await this.getContractPricing({ customerId: updates.customerId });
        const [updated] = await db.update(contractPricing).set({ ...updates, updatedAt: this.getCurrentTimestamp() }).where(eq10(contractPricing.id, id)).returning();
        await this.logAuditEvent(
          "contract_pricing",
          id,
          "updated",
          updates.createdBy || "system",
          existing,
          updated
        );
        return updated;
      }
      // Competitor Pricing Management
      async getCompetitorPricing(itemId, competitorName) {
        const conditions = [];
        if (itemId) {
          conditions.push(eq10(competitorPricing.itemId, itemId));
        }
        if (competitorName) {
          conditions.push(like4(competitorPricing.competitorName, `%${competitorName}%`));
        }
        conditions.push(eq10(competitorPricing.isActive, true));
        return await db.select().from(competitorPricing).where(conditions.length > 0 ? and7(...conditions) : void 0).orderBy(desc8(competitorPricing.verifiedAt));
      }
      async createCompetitorPricing(pricing) {
        const [created] = await db.insert(competitorPricing).values(pricing).returning();
        await this.logAuditEvent(
          "competitor_pricing",
          created.id,
          "created",
          pricing.collectedBy || "system",
          null,
          created
        );
        return created;
      }
      async updateCompetitorPricing(id, updates) {
        const [updated] = await db.update(competitorPricing).set(updates).where(eq10(competitorPricing.id, id)).returning();
        await this.logAuditEvent(
          "competitor_pricing",
          id,
          "updated",
          updates.collectedBy || "system",
          null,
          updated
        );
        return updated;
      }
      // Dynamic Pricing Configuration
      async getDynamicPricingConfig(itemId, customerId) {
        const conditions = [];
        if (itemId) {
          conditions.push(eq10(dynamicPricingConfig.itemId, itemId));
        }
        if (customerId) {
          conditions.push(eq10(dynamicPricingConfig.customerId, customerId));
        }
        conditions.push(eq10(dynamicPricingConfig.isActive, true));
        return await db.select().from(dynamicPricingConfig).where(conditions.length > 0 ? and7(...conditions) : void 0).orderBy(desc8(dynamicPricingConfig.updatedAt));
      }
      async createDynamicPricingConfig(config) {
        const [created] = await db.insert(dynamicPricingConfig).values(config).returning();
        await this.logAuditEvent(
          "dynamic_pricing_config",
          created.id,
          "created",
          "system",
          null,
          created
        );
        return created;
      }
      async updateDynamicPricingConfig(id, updates) {
        const [updated] = await db.update(dynamicPricingConfig).set({ ...updates, updatedAt: this.getCurrentTimestamp() }).where(eq10(dynamicPricingConfig.id, id)).returning();
        await this.logAuditEvent(
          "dynamic_pricing_config",
          id,
          "updated",
          "system",
          null,
          updated
        );
        return updated;
      }
      // Currency Exchange Rates
      async getCurrencyExchangeRates(fromCurrency, toCurrency) {
        const conditions = [];
        if (fromCurrency) {
          conditions.push(eq10(currencyExchangeRates.fromCurrency, fromCurrency));
        }
        if (toCurrency) {
          conditions.push(eq10(currencyExchangeRates.toCurrency, toCurrency));
        }
        conditions.push(eq10(currencyExchangeRates.isActive, true));
        return await db.select().from(currencyExchangeRates).where(conditions.length > 0 ? and7(...conditions) : void 0).orderBy(desc8(currencyExchangeRates.effectiveDate));
      }
      async createCurrencyExchangeRate(rate) {
        const [created] = await db.insert(currencyExchangeRates).values(rate).returning();
        await this.logAuditEvent(
          "currency_exchange_rate",
          created.id,
          "created",
          "system",
          null,
          created
        );
        return created;
      }
      // Pricing Calculations with Enhanced Engine
      async calculateItemPrice(itemId, customerId, quantity = 1, method) {
        try {
          let result;
          if (method) {
            const [item] = await db.select().from(items).where(eq10(items.id, itemId)).limit(1);
            const [customer] = await db.select().from(customers).where(eq10(customers.id, customerId)).limit(1);
            if (!item || !customer) {
              throw new Error("Item or customer not found");
            }
            const volumeTiers = await this.getVolumePricingTiers(itemId, customerId);
            const competitorPrices = await this.getCompetitorPricing(itemId);
            const competitorPriceValues = competitorPrices.map((cp) => parseFloat(cp.price.toString()));
            const config = {
              itemId,
              customerId,
              customerType: customer.customerType,
              method,
              baseCurrency: "BHD",
              targetCurrency: "BHD",
              volumeTiers: volumeTiers.map((vt) => ({
                minQuantity: vt.minQuantity,
                maxQuantity: vt.maxQuantity || void 0,
                discountPercentage: parseFloat(vt.discountPercentage?.toString() || "0"),
                specialPrice: vt.specialPrice ? parseFloat(vt.specialPrice.toString()) : void 0
              })),
              competitorPrices: competitorPriceValues
            };
            result = await pricingEngine.calculatePrice(config, quantity);
          } else {
            result = await pricingEngine.calculateOptimalPrice(itemId, customerId, quantity);
          }
          await this.storePricingCalculation(result, quantity);
          return result;
        } catch (error) {
          console.error("Error calculating item price:", error);
          throw error;
        }
      }
      async calculateBatchPrices(itemIds, customerId, quantities) {
        return await pricingEngine.calculateBatchPrices(itemIds, customerId, quantities);
      }
      async storePricingCalculation(result, quantity) {
        const calculationData = {
          itemId: result.itemId,
          customerId: result.customerId,
          method: result.method,
          costPrice: result.costPrice.toString(),
          quantity,
          requestedCurrency: result.baseCurrency,
          basePrice: result.basePrice.toString(),
          finalPrice: result.finalPrice.toString(),
          grossMargin: result.grossMargin.toString(),
          marginPercentage: result.marginPercentage.toString(),
          markupPercentage: result.markupPercentage.toString(),
          volumeDiscount: result.appliedVolumeDiscount?.toString() || "0",
          calculationFactors: result.factors,
          competitorPrices: result.competitorAverage ? [result.competitorAverage] : null,
          validUntil: result.validUntil || null
        };
        await db.insert(pricingCalculations).values(calculationData);
      }
      // Margin Analysis
      async generateMarginAnalysis(itemId, customerId, categoryId, periodStart, periodEnd) {
        const analysisDate = /* @__PURE__ */ new Date();
        const defaultPeriodStart = periodStart || new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3);
        const defaultPeriodEnd = periodEnd || /* @__PURE__ */ new Date();
        const mockAnalysisData = {
          itemId: itemId || "",
          customerId,
          categoryId,
          analysisDate,
          periodStart: defaultPeriodStart,
          periodEnd: defaultPeriodEnd,
          totalQuantitySold: 100,
          totalRevenue: "15000.00",
          totalCost: "9000.00",
          averageSellingPrice: "150.00",
          averageCost: "90.00",
          grossMargin: "6000.00",
          marginPercentage: "40.00",
          marginTrend: "stable",
          profitabilityRating: "good",
          recommendedAction: "Maintain current pricing strategy. Consider volume discounts for quantities above 50 units."
        };
        const [created] = await db.insert(marginAnalysis).values(mockAnalysisData).returning();
        return created;
      }
      async getMarginAnalysis(filters) {
        const conditions = [];
        if (filters?.itemId) {
          conditions.push(eq10(marginAnalysis.itemId, filters.itemId));
        }
        if (filters?.customerId) {
          conditions.push(eq10(marginAnalysis.customerId, filters.customerId));
        }
        if (filters?.categoryId) {
          conditions.push(eq10(marginAnalysis.categoryId, filters.categoryId));
        }
        if (filters?.dateFrom) {
          conditions.push(gte4(marginAnalysis.analysisDate, filters.dateFrom));
        }
        if (filters?.dateTo) {
          conditions.push(lte3(marginAnalysis.analysisDate, filters.dateTo));
        }
        return await db.select().from(marginAnalysis).where(conditions.length > 0 ? and7(...conditions) : void 0).orderBy(desc8(marginAnalysis.analysisDate));
      }
      // Advanced Pricing Reports
      async getPricingPerformanceReport(dateFrom, dateTo) {
        const calculations = await db.select().from(pricingCalculations).where(
          and7(
            gte4(pricingCalculations.calculatedAt, dateFrom),
            lte3(pricingCalculations.calculatedAt, dateTo)
          )
        ).orderBy(desc8(pricingCalculations.calculatedAt));
        const totalCalculations = calculations.length;
        const averageMargin = calculations.reduce((sum4, calc) => sum4 + parseFloat(calc.marginPercentage?.toString() || "0"), 0) / totalCalculations;
        const methodDistribution = calculations.reduce((acc, calc) => {
          acc[calc.method] = (acc[calc.method] || 0) + 1;
          return acc;
        }, {});
        return {
          period: { from: dateFrom, to: dateTo },
          totalCalculations,
          averageMargin: averageMargin.toFixed(2),
          methodDistribution,
          calculations: calculations.slice(0, 100)
          // Return top 100 for display
        };
      }
      async getCompetitivePositionReport(itemId) {
        const conditions = itemId ? [eq10(competitorPricing.itemId, itemId)] : [];
        conditions.push(eq10(competitorPricing.isActive, true));
        const competitorData = await db.select().from(competitorPricing).where(and7(...conditions)).orderBy(desc8(competitorPricing.verifiedAt));
        const itemAnalysis = competitorData.reduce((acc, pricing) => {
          const key = pricing.itemId;
          if (!acc[key]) {
            acc[key] = {
              itemId: key,
              competitorCount: 0,
              prices: [],
              averagePrice: 0,
              minPrice: Number.MAX_VALUE,
              maxPrice: 0
            };
          }
          const price = parseFloat(pricing.price.toString());
          acc[key].competitorCount++;
          acc[key].prices.push(price);
          acc[key].minPrice = Math.min(acc[key].minPrice, price);
          acc[key].maxPrice = Math.max(acc[key].maxPrice, price);
          return acc;
        }, {});
        Object.values(itemAnalysis).forEach((analysis) => {
          analysis.averagePrice = analysis.prices.reduce((a, b) => a + b, 0) / analysis.prices.length;
        });
        return Object.values(itemAnalysis);
      }
    };
    enhancedPricingStorage = new EnhancedPricingStorage();
  }
});

// server/storage/quotation-storage.ts
import { eq as eq11, and as and8, gte as gte5, lte as lte4, desc as desc9, asc as asc3, like as like5, or as or5 } from "drizzle-orm";
var QuotationStorage;
var init_quotation_storage = __esm({
  "server/storage/quotation-storage.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_base();
    init_uuid();
    QuotationStorage = class extends BaseStorage {
      // Helper method to get enquiry with customer details
      async getEnquiryWithCustomer(enquiryId) {
        const result = await db.select({
          id: enquiries.id,
          enquiryNumber: enquiries.enquiryNumber,
          notes: enquiries.notes,
          customerId: enquiries.customerId,
          customer: {
            id: customers.id,
            name: customers.name,
            customerType: customers.customerType,
            email: customers.email,
            phone: customers.phone
          }
        }).from(enquiries).innerJoin(customers, eq11(enquiries.customerId, customers.id)).where(eq11(enquiries.id, enquiryId));
        return result[0];
      }
      // Quotation operations
      async getQuotations(limit = 50, offset = 0, filters) {
        const conditions = [];
        if (filters?.status) {
          conditions.push(eq11(quotations.status, filters.status));
        }
        if (filters?.customerId) {
          conditions.push(eq11(quotations.customerId, filters.customerId));
        }
        if (filters?.dateFrom) {
          conditions.push(gte5(quotations.createdAt, new Date(filters.dateFrom)));
        }
        if (filters?.dateTo) {
          conditions.push(lte4(quotations.createdAt, new Date(filters.dateTo)));
        }
        if (filters?.search) {
          conditions.push(
            or5(
              like5(quotations.quoteNumber, `%${filters.search}%`),
              like5(quotations.notes, `%${filters.search}%`)
            )
          );
        }
        return await db.select({
          // All quotation fields
          id: quotations.id,
          quoteNumber: quotations.quoteNumber,
          revision: quotations.revision,
          parentQuotationId: quotations.parentQuotationId,
          revisionReason: quotations.revisionReason,
          supersededAt: quotations.supersededAt,
          supersededBy: quotations.supersededBy,
          isSuperseded: quotations.isSuperseded,
          enquiryId: quotations.enquiryId,
          customerId: quotations.customerId,
          customerType: quotations.customerType,
          status: quotations.status,
          quoteDate: quotations.quoteDate,
          validUntil: quotations.validUntil,
          subtotal: quotations.subtotal,
          discountPercentage: quotations.discountPercentage,
          discountAmount: quotations.discountAmount,
          taxAmount: quotations.taxAmount,
          totalAmount: quotations.totalAmount,
          terms: quotations.terms,
          notes: quotations.notes,
          approvalStatus: quotations.approvalStatus,
          requiredApprovalLevel: quotations.requiredApprovalLevel,
          approvedBy: quotations.approvedBy,
          approvedAt: quotations.approvedAt,
          rejectionReason: quotations.rejectionReason,
          createdBy: quotations.createdBy,
          createdAt: quotations.createdAt,
          updatedAt: quotations.updatedAt,
          // PO document fields
          customerPoNumber: purchaseOrders.poNumber,
          customerPoDocument: purchaseOrders.documentPath,
          customerPoDocumentName: purchaseOrders.documentName
        }).from(quotations).leftJoin(purchaseOrders, eq11(quotations.id, purchaseOrders.quotationId)).where(conditions.length > 0 ? and8(...conditions) : void 0).orderBy(desc9(quotations.createdAt)).limit(limit).offset(offset);
      }
      async getQuotation(id) {
        const result = await db.select({
          // All quotation fields
          id: quotations.id,
          quoteNumber: quotations.quoteNumber,
          revision: quotations.revision,
          parentQuotationId: quotations.parentQuotationId,
          revisionReason: quotations.revisionReason,
          supersededAt: quotations.supersededAt,
          supersededBy: quotations.supersededBy,
          isSuperseded: quotations.isSuperseded,
          enquiryId: quotations.enquiryId,
          customerId: quotations.customerId,
          customerType: quotations.customerType,
          status: quotations.status,
          quoteDate: quotations.quoteDate,
          validUntil: quotations.validUntil,
          subtotal: quotations.subtotal,
          discountPercentage: quotations.discountPercentage,
          discountAmount: quotations.discountAmount,
          taxAmount: quotations.taxAmount,
          totalAmount: quotations.totalAmount,
          terms: quotations.terms,
          notes: quotations.notes,
          approvalStatus: quotations.approvalStatus,
          requiredApprovalLevel: quotations.requiredApprovalLevel,
          approvedBy: quotations.approvedBy,
          approvedAt: quotations.approvedAt,
          rejectionReason: quotations.rejectionReason,
          createdBy: quotations.createdBy,
          createdAt: quotations.createdAt,
          updatedAt: quotations.updatedAt,
          // PO document fields
          customerPoNumber: purchaseOrders.poNumber,
          customerPoDocument: purchaseOrders.documentPath,
          customerPoDocumentName: purchaseOrders.documentName
        }).from(quotations).leftJoin(purchaseOrders, eq11(quotations.id, purchaseOrders.quotationId)).where(eq11(quotations.id, id)).limit(1);
        return result[0];
      }
      async createQuotation(quotation, userId) {
        let quoteNumber;
        let attempts = 0;
        const maxAttempts = 10;
        do {
          quoteNumber = this.generateNumber("QT");
          const existing = await db.select({ id: quotations.id }).from(quotations).where(eq11(quotations.quoteNumber, quoteNumber)).limit(1);
          if (existing.length === 0) break;
          attempts++;
        } while (attempts < maxAttempts);
        if (attempts >= maxAttempts) {
          throw new Error("Failed to generate unique quotation number");
        }
        const now = this.getCurrentTimestamp();
        const processedQuotation = {
          ...quotation,
          validUntil: quotation.validUntil ? new Date(quotation.validUntil) : void 0
        };
        const newQuotation = {
          ...processedQuotation,
          quoteNumber,
          // Use the correct field name from schema
          createdAt: now,
          updatedAt: now
        };
        const result = await db.insert(quotations).values(newQuotation).returning();
        const inserted = result[0];
        await this.logAuditEvent(
          "quotation",
          inserted.id,
          "created",
          userId || quotation.createdBy || "system",
          null,
          inserted
        );
        return inserted;
      }
      async updateQuotation(id, quotation) {
        const existing = await this.getQuotation(id);
        if (!existing) {
          throw new Error("Quotation not found");
        }
        const updatedQuotation = {
          ...quotation,
          updatedAt: this.getCurrentTimestamp()
        };
        await db.update(quotations).set(updatedQuotation).where(eq11(quotations.id, id));
        await this.logAuditEvent(
          "quotation",
          id,
          "updated",
          quotation.createdBy || "system",
          existing,
          { ...existing, ...updatedQuotation }
        );
        return { ...existing, ...updatedQuotation };
      }
      async deleteQuotation(id) {
        const existing = await this.getQuotation(id);
        if (!existing) {
          throw new Error("Quotation not found");
        }
        await db.delete(quotationItems).where(eq11(quotationItems.quotationId, id));
        await db.delete(quotations).where(eq11(quotations.id, id));
        await this.logAuditEvent(
          "quotation",
          id,
          "deleted",
          void 0,
          existing,
          null
        );
      }
      async generateQuotationFromEnquiry(enquiryId, userId = "system") {
        try {
          console.log("generateQuotationFromEnquiry called with:", { enquiryId, userId });
          const enquiry = await this.getEnquiryWithCustomer(enquiryId);
          if (!enquiry) {
            throw new Error("Enquiry not found");
          }
          console.log("Retrieved enquiry and customer:", {
            enquiry: { id: enquiry.id, notes: enquiry.notes },
            customer: { id: enquiry.customer.id, name: enquiry.customer.name, customerType: enquiry.customer.customerType }
          });
          const enquiryItemsList = await db.select().from(enquiryItems).where(eq11(enquiryItems.enquiryId, enquiryId));
          console.log("Retrieved enquiry items:", enquiryItemsList.length, "items");
          const { enhancedPricingStorage: enhancedPricingStorage2 } = await Promise.resolve().then(() => (init_pricing_storage(), pricing_storage_exports));
          const quotationData = {
            customerId: enquiry.customerId,
            customerType: enquiry.customer.customerType,
            enquiryId: enquiry.id,
            status: "Draft",
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
            // 30 days
            subtotal: "0",
            discountPercentage: "0",
            discountAmount: "0",
            taxAmount: "0",
            totalAmount: "0",
            // Will be calculated from items
            notes: `Generated from enquiry ${enquiry.enquiryNumber}`,
            createdBy: validateUserIdOrDefault(userId)
          };
          console.log("Creating quotation with data:", quotationData);
          const quotation = await this.createQuotation(quotationData, userId);
          console.log("Successfully created quotation:", quotation);
          if (enquiryItemsList.length > 0) {
            let totalAmount = 0;
            const createdItems = [];
            for (const enquiryItem of enquiryItemsList) {
              try {
                let itemId = enquiryItem.itemId;
                if (!itemId) {
                  const basePrice = parseFloat(enquiryItem.unitPrice || "0");
                  const markup = enquiry.customer.customerType === "Retail" ? 0.7 : 0.4;
                  const quotedPrice = basePrice * (1 + markup);
                  const totalPrice = quotedPrice * enquiryItem.quantity;
                  totalAmount += totalPrice;
                  const quotationItemData = {
                    quotationId: quotation.id,
                    description: enquiryItem.description,
                    quantity: enquiryItem.quantity,
                    costPrice: basePrice,
                    markup: markup * 100,
                    unitPrice: quotedPrice,
                    lineTotal: totalPrice,
                    notes: enquiryItem.notes || ""
                  };
                  console.log("Creating quotation item (fallback pricing):", quotationItemData);
                  const created = await this.createQuotationItem(quotationItemData);
                  createdItems.push(created);
                } else {
                  const pricingResult = await enhancedPricingStorage2.calculateItemPrice(
                    itemId,
                    enquiry.customerId,
                    enquiryItem.quantity
                  );
                  const quotationItemData = {
                    quotationId: quotation.id,
                    description: enquiryItem.description,
                    quantity: enquiryItem.quantity,
                    costPrice: pricingResult.costPrice,
                    markup: pricingResult.markupPercentage,
                    unitPrice: pricingResult.finalPrice,
                    lineTotal: pricingResult.finalPrice * enquiryItem.quantity,
                    notes: `${enquiryItem.notes || ""} | Pricing method: ${pricingResult.method} | Factors: ${pricingResult.factors.join(", ")}`
                  };
                  totalAmount += pricingResult.finalPrice * enquiryItem.quantity;
                  console.log("Creating quotation item (enhanced pricing):", quotationItemData);
                  const created = await this.createQuotationItem(quotationItemData);
                  createdItems.push(created);
                }
              } catch (pricingError) {
                console.error("Error calculating enhanced pricing for item:", pricingError);
                const basePrice = parseFloat(enquiryItem.unitPrice || "0");
                const markup = enquiry.customer.customerType === "Retail" ? 0.7 : 0.4;
                const quotedPrice = basePrice * (1 + markup);
                const totalPrice = quotedPrice * enquiryItem.quantity;
                totalAmount += totalPrice;
                const quotationItemData = {
                  quotationId: quotation.id,
                  description: enquiryItem.description,
                  quantity: enquiryItem.quantity,
                  costPrice: basePrice,
                  markup: markup * 100,
                  unitPrice: quotedPrice,
                  lineTotal: totalPrice,
                  notes: enquiryItem.notes || ""
                };
                console.log("Creating quotation item (fallback after error):", quotationItemData);
                const created = await this.createQuotationItem(quotationItemData);
                createdItems.push(created);
              }
            }
            const updatedQuotation = {
              subtotal: totalAmount.toFixed(2),
              totalAmount: totalAmount.toFixed(2)
            };
            console.log("Updating quotation totals:", updatedQuotation);
            await this.updateQuotation(quotation.id, updatedQuotation);
          }
          const refreshed = await this.getQuotation(quotation.id);
          console.log("Successfully generated quotation with items from enquiry");
          return refreshed || quotation;
        } catch (error) {
          console.error("Error generating quotation from enquiry:", error);
          throw error;
        }
      }
      // Quotation revision operations
      async createQuotationRevision(originalId, revisionData, userId) {
        const original = await this.getQuotation(originalId);
        if (!original) {
          throw new Error("Original quotation not found");
        }
        const revisionQuotation = {
          ...original,
          parentQuotationId: originalId,
          revision: (original.revision || 0) + 1,
          status: "Draft",
          createdBy: validateUserIdOrDefault(userId),
          ...revisionData
        };
        delete revisionQuotation.id;
        delete revisionQuotation.createdAt;
        delete revisionQuotation.updatedAt;
        const newQuotation = await this.createQuotation(revisionQuotation, userId);
        try {
          const originalItems = await this.getQuotationItems(originalId);
          if (originalItems.length) {
            let subtotal = 0;
            const duplicated = originalItems.map((it) => {
              const qty = Number(it.quantity) || 0;
              const unit = parseFloat(it.unitPrice || "0");
              const lineTotal = parseFloat(it.lineTotal || (qty * unit).toFixed(2));
              subtotal += lineTotal;
              return {
                quotationId: newQuotation.id,
                description: it.description,
                quantity: qty,
                costPrice: typeof it.costPrice === "string" ? parseFloat(it.costPrice) : it.costPrice,
                markup: typeof it.markup === "string" ? parseFloat(it.markup) : it.markup,
                unitPrice: typeof it.unitPrice === "string" ? parseFloat(it.unitPrice) : it.unitPrice,
                lineTotal: typeof lineTotal === "string" ? parseFloat(lineTotal) : lineTotal,
                isAccepted: true,
                // fresh revision assumes active items
                notes: it.notes || void 0
              };
            });
            for (const dup of duplicated) {
              await this.createQuotationItem(dup);
            }
            await this.updateQuotation(newQuotation.id, {
              subtotal: subtotal.toFixed(2),
              totalAmount: subtotal.toFixed(2)
            });
          }
        } catch (dupErr) {
          console.error("Failed duplicating quotation items for revision", dupErr);
        }
        return await this.getQuotation(newQuotation.id) || newQuotation;
      }
      async getQuotationRevisions(originalId) {
        return await db.select().from(quotations).where(eq11(quotations.parentQuotationId, originalId)).orderBy(asc3(quotations.revision));
      }
      async getQuotationHistory(quotationId) {
        return [];
      }
      // Quotation Item operations
      async getQuotationItems(quotationId) {
        return await db.select().from(quotationItems).where(eq11(quotationItems.quotationId, quotationId)).orderBy(asc3(quotationItems.createdAt));
      }
      async createQuotationItem(item) {
        try {
          const baseItem = {
            ...item
            // createdAt left to DB default
          };
          const inserted = await db.insert(quotationItems).values(baseItem).returning();
          const row = inserted[0];
          return row;
        } catch (error) {
          console.error("createQuotationItem failed:", error);
          throw error;
        }
      }
      async updateQuotationItem(id, item) {
        const existing = await db.select().from(quotationItems).where(eq11(quotationItems.id, id)).limit(1);
        if (!existing[0]) {
          throw new Error("Quotation item not found");
        }
        const updatedItem = {
          ...item,
          unitPrice: item.unitPrice !== void 0 ? String(item.unitPrice) : void 0,
          costPrice: item.costPrice !== void 0 ? String(item.costPrice) : void 0,
          markup: item.markup !== void 0 ? String(item.markup) : void 0,
          lineTotal: item.lineTotal !== void 0 ? String(item.lineTotal) : void 0
        };
        await db.update(quotationItems).set(updatedItem).where(eq11(quotationItems.id, id));
        await this.logAuditEvent(
          "quotation_item",
          id,
          "updated",
          "system",
          // Use system as fallback since modifiedBy doesn't exist in InsertQuotationItem
          existing[0],
          { ...existing[0], ...updatedItem }
        );
        return { ...existing[0], ...updatedItem };
      }
      async deleteQuotationItem(id) {
        const existing = await db.select().from(quotationItems).where(eq11(quotationItems.id, id)).limit(1);
        if (!existing[0]) {
          throw new Error("Quotation item not found");
        }
        await db.delete(quotationItems).where(eq11(quotationItems.id, id));
        await this.logAuditEvent(
          "quotation_item",
          id,
          "deleted",
          void 0,
          existing[0],
          null
        );
      }
      // Quotation Approval operations
      async getQuotationApprovals(quotationId) {
        return await db.select().from(quotationApprovals).where(eq11(quotationApprovals.quotationId, quotationId)).orderBy(asc3(quotationApprovals.createdAt));
      }
      async createQuotationApproval(approval) {
        const approverId = approval.approverId && typeof approval.approverId === "string" && approval.approverId.length === 36 ? approval.approverId : null;
        const id = crypto.randomUUID();
        const now = this.getCurrentTimestamp();
        const allowedApprovalStatuses = ["Pending", "Approved", "Rejected"];
        const status = allowedApprovalStatuses.includes(approval.status) ? approval.status : "Pending";
        const newApproval = {
          ...approval,
          id,
          approverId,
          status,
          createdAt: now
        };
        await db.insert(quotationApprovals).values(newApproval);
        await this.logAuditEvent(
          "quotation_approval",
          id,
          "created",
          approverId || "system",
          null,
          newApproval
        );
        return { ...newApproval };
      }
    };
  }
});

// server/storage/delivery-storage.ts
import { eq as eq12, and as and9, desc as desc10, sql as sql8 } from "drizzle-orm";
var DeliveryStorage;
var init_delivery_storage = __esm({
  "server/storage/delivery-storage.ts"() {
    "use strict";
    init_base();
    init_db();
    init_schema();
    DeliveryStorage = class extends BaseStorage {
      // Normalize a delivery item record so non-nullable string fields never contain null
      normalizeDeliveryItemRecord(rec) {
        return {
          ...rec,
          barcode: rec.barcode ?? "",
          supplierCode: rec.supplierCode ?? "",
          description: rec.description ?? "",
          unitPrice: rec.unitPrice ?? "0.00",
          totalPrice: rec.totalPrice ?? "0.00"
        };
      }
      // Delivery operations
      async getDeliveries(filters) {
        try {
          const conditions = [];
          if (filters?.status) {
            conditions.push(eq12(deliveries.status, filters.status));
          }
          if (filters?.salesOrderId) {
            conditions.push(eq12(deliveries.salesOrderId, filters.salesOrderId));
          }
          if (filters?.dateFrom) {
            conditions.push(sql8`${deliveries.deliveryDate} >= ${filters.dateFrom}`);
          }
          if (filters?.dateTo) {
            conditions.push(sql8`${deliveries.deliveryDate} <= ${filters.dateTo}`);
          }
          let query = db.select().from(deliveries).leftJoin(salesOrders, eq12(deliveries.salesOrderId, salesOrders.id)).leftJoin(customers, eq12(salesOrders.customerId, customers.id));
          if (filters?.search) {
            const term = `%${filters.search.toLowerCase()}%`;
            conditions.push(sql8`(lower(${deliveries.deliveryNumber}) like ${term} OR lower(${deliveries.trackingNumber}) like ${term})`);
          }
          if (conditions.length > 0) {
            query = query.where(and9(...conditions));
          }
          query = query.orderBy(desc10(deliveries.createdAt));
          if (filters?.limit) {
            query = query.limit(filters.limit);
          }
          if (filters?.offset) {
            query = query.offset(filters.offset);
          }
          const results = await query;
          return results.map((row) => {
            const rawCust = row.customers;
            const customer = rawCust ? {
              id: rawCust.id,
              name: rawCust.name || rawCust.customerName || rawCust.companyName || rawCust.fullName || rawCust.customer_name || null,
              customerType: rawCust.customerType || rawCust.customer_type || null,
              address: rawCust.address || rawCust.billingAddress || rawCust.billing_address || null
            } : null;
            const so = row.sales_orders;
            const delivery = row.deliveries;
            return {
              ...delivery,
              salesOrder: so ? { ...so, customer } : null,
              customer,
              __customerEmbedded: true
            };
          });
        } catch (error) {
          console.error("Error fetching deliveries:", error);
          throw new Error("Failed to fetch deliveries");
        }
      }
      async getDelivery(id) {
        try {
          const result = await db.select().from(deliveries).leftJoin(salesOrders, eq12(deliveries.salesOrderId, salesOrders.id)).leftJoin(customers, eq12(salesOrders.customerId, customers.id)).where(eq12(deliveries.id, id)).limit(1);
          const first = result[0];
          if (!first) return void 0;
          const row = first;
          const rawCust = row.customers;
          const customer = rawCust ? {
            id: rawCust.id,
            name: rawCust.name || rawCust.customerName || rawCust.companyName || rawCust.fullName || rawCust.customer_name || null,
            customerType: rawCust.customerType || rawCust.customer_type || null,
            address: rawCust.address || rawCust.billingAddress || rawCust.billing_address || null
          } : null;
          const allowedStatuses = ["Pending", "Cancelled", "Partial", "Complete"];
          const statusNorm = allowedStatuses.includes(row.delivery_note.status) ? row.delivery_note.status : "Pending";
          return {
            ...row.delivery_note,
            status: statusNorm,
            salesOrder: row.sales_orders ? { ...row.sales_orders, customer } : null,
            customer,
            __customerEmbedded: true
          };
        } catch (error) {
          console.error("Error fetching delivery:", error);
          throw new Error("Failed to fetch delivery");
        }
      }
      async getDeliveryByNumber(deliveryNumber) {
        try {
          const result = await db.select().from(deliveries).where(eq12(deliveries.deliveryNumber, deliveryNumber)).limit(1);
          if (!result[0]) return void 0;
          const allowedStatuses = ["Pending", "Cancelled", "Partial", "Complete"];
          const statusNorm = allowedStatuses.includes(result[0].status || "") ? result[0].status : "Pending";
          return {
            ...result[0],
            status: statusNorm
          };
        } catch (error) {
          console.error("Error fetching delivery by number:", error);
          throw new Error("Failed to fetch delivery by number");
        }
      }
      async createDelivery(delivery) {
        try {
          const incomingNumber = delivery.deliveryNumber;
          if (!incomingNumber || incomingNumber === "PENDING") {
            delivery.deliveryNumber = this.generateNumber("DLV");
          }
          if (delivery.status && delivery.status.toUpperCase() === "DRAFT") {
            delivery.status = "Pending";
          }
          if (delivery.status == null) delivery.status = "Pending";
          const allowedFields = [
            "id",
            "deliveryNumber",
            "salesOrderId",
            "deliveryDate",
            "deliveryType",
            "deliveryAddress",
            "status",
            "pickingStartedBy",
            "pickingStartedAt",
            "pickingCompletedBy",
            "pickingCompletedAt",
            "pickingNotes",
            "deliveryConfirmedBy",
            "deliveryConfirmedAt",
            "deliverySignature",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy"
          ];
          const sanitized = {};
          for (const key of allowedFields) {
            if (delivery[key] !== void 0 && delivery[key] !== null) {
              sanitized[key] = delivery[key];
            }
          }
          sanitized.status = delivery.status;
          const result = await db.insert(deliveries).values(sanitized).returning();
          return {
            ...result[0],
            status: ["Pending", "Cancelled", "Partial", "Complete"].includes(result[0].status || "") ? result[0].status : "Pending"
          };
        } catch (error) {
          console.error("Error creating delivery:", error);
          throw new Error("Failed to create delivery");
        }
      }
      async updateDelivery(id, delivery) {
        try {
          if (!id || typeof id !== "string" || id.length === 0) {
            throw new Error("Invalid delivery ID");
          }
          const updateData = {
            ...delivery,
            updatedAt: /* @__PURE__ */ new Date()
          };
          if (delivery.status) {
            const allowedStatuses = ["Pending", "Cancelled", "Partial", "Complete"];
            if (!allowedStatuses.includes(delivery.status)) {
              throw new Error(`Invalid status: ${delivery.status}. Must be one of: ${allowedStatuses.join(", ")}`);
            }
            updateData.status = delivery.status;
          }
          const filteredData = Object.fromEntries(
            Object.entries(updateData).filter(([key, value]) => value !== null && value !== void 0)
          );
          console.log("Updating delivery with data:", { id, filteredData });
          const result = await db.update(deliveries).set(filteredData).where(eq12(deliveries.id, id)).returning();
          if (result.length === 0) {
            throw new Error("Delivery not found");
          }
          console.log("Delivery updated successfully:", result[0]);
          return result[0];
        } catch (error) {
          console.error("Error updating delivery:", error);
          throw new Error(`Failed to update delivery: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      async deleteDelivery(id) {
        try {
          await db.delete(deliveries).where(eq12(deliveries.id, id));
        } catch (error) {
          console.error("Error deleting delivery:", error);
          throw new Error("Failed to delete delivery");
        }
      }
      async startDeliveryPicking(deliveryId, userId) {
        try {
          const result = await db.update(deliveries).set({
            pickingStartedBy: userId,
            pickingStartedAt: /* @__PURE__ */ new Date(),
            status: "Partial",
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq12(deliveries.id, deliveryId)).returning();
          if (result.length === 0) {
            throw new Error("Delivery not found");
          }
          return result[0];
        } catch (error) {
          console.error("Error starting delivery picking:", error);
          throw new Error("Failed to start delivery picking");
        }
      }
      async completeDeliveryPicking(deliveryId, userId, notes) {
        try {
          const result = await db.update(deliveries).set({
            pickingCompletedBy: userId,
            pickingCompletedAt: /* @__PURE__ */ new Date(),
            status: "Complete",
            pickingNotes: notes,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq12(deliveries.id, deliveryId)).returning();
          if (result.length === 0) {
            throw new Error("Delivery not found");
          }
          return result[0];
        } catch (error) {
          console.error("Error completing delivery picking:", error);
          throw new Error("Failed to complete delivery picking");
        }
      }
      async confirmDelivery(deliveryId, confirmedBy, signature) {
        try {
          const result = await db.update(deliveries).set({
            deliveryConfirmedBy: confirmedBy,
            deliveryConfirmedAt: /* @__PURE__ */ new Date(),
            deliverySignature: signature,
            status: "Complete",
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq12(deliveries.id, deliveryId)).returning();
          if (result.length === 0) {
            throw new Error("Delivery not found");
          }
          return result[0];
        } catch (error) {
          console.error("Error confirming delivery:", error);
          throw new Error("Failed to confirm delivery");
        }
      }
      // Delivery Item operations
      async getDeliveryItems(deliveryId) {
        try {
          const items3 = await db.select().from(deliveryItems).where(eq12(deliveryItems.deliveryId, deliveryId));
          return items3.map((i) => this.normalizeDeliveryItemRecord(i));
        } catch (error) {
          console.error("Error fetching delivery items:", error);
          throw new Error("Failed to fetch delivery items");
        }
      }
      async getDeliveryItem(id) {
        try {
          const result = await db.select().from(deliveryItems).where(eq12(deliveryItems.id, id)).limit(1);
          if (!result[0]) return void 0;
          return this.normalizeDeliveryItemRecord(result[0]);
        } catch (error) {
          console.error("Error fetching delivery item:", error);
          throw new Error("Failed to fetch delivery item");
        }
      }
      async createDeliveryItem(item) {
        try {
          const enriched = { ...item };
          if (!enriched.barcode || !enriched.description || !enriched.unitPrice || !enriched.totalPrice) {
            if (enriched.salesOrderItemId) {
              const soItemRows = await db.select().from(salesOrderItems).where(eq12(salesOrderItems.id, enriched.salesOrderItemId)).limit(1);
              const soItem = soItemRows[0];
              if (soItem) {
                const itemRows = await db.select().from(items).where(eq12(items.id, soItem.itemId)).limit(1);
                const masterItem = itemRows[0];
                enriched.itemId = enriched.itemId || soItem.itemId;
                enriched.lineNumber = enriched.lineNumber || soItem.lineNumber || 1;
                enriched.orderedQuantity = enriched.orderedQuantity || soItem.quantity;
                const qty = enriched.pickedQuantity || enriched.deliveredQuantity || enriched.orderedQuantity || soItem.quantity || 0;
                const unitPrice = soItem.unitPrice;
                enriched.unitPrice = enriched.unitPrice || unitPrice || "0.00";
                enriched.totalPrice = enriched.totalPrice || Number(unitPrice || 0) * Number(qty || 0);
                enriched.description = enriched.description || (masterItem?.description || "Delivery Item");
                enriched.barcode = enriched.barcode || (masterItem?.barcode || `AUTO-${Date.now()}`);
                enriched.supplierCode = enriched.supplierCode || (masterItem?.supplierCode || "AUTO-SUP");
                enriched.pickedQuantity = enriched.pickedQuantity || qty;
                enriched.deliveredQuantity = enriched.deliveredQuantity || qty;
              }
            }
            enriched.barcode = enriched.barcode || `AUTO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
            enriched.supplierCode = enriched.supplierCode || "AUTO-SUP";
            enriched.description = enriched.description || "Delivery Item";
            enriched.orderedQuantity = enriched.orderedQuantity || enriched.pickedQuantity || enriched.deliveredQuantity || 0;
            enriched.pickedQuantity = enriched.pickedQuantity || enriched.orderedQuantity || 0;
            enriched.deliveredQuantity = enriched.deliveredQuantity || enriched.pickedQuantity || 0;
            enriched.unitPrice = enriched.unitPrice || "0.00";
            enriched.totalPrice = enriched.totalPrice || "0.00";
          }
          enriched.unitPrice = enriched.unitPrice ?? "0.00";
          enriched.totalPrice = enriched.totalPrice ?? "0.00";
          const result = await db.insert(deliveryItems).values(enriched).returning();
          if (!result[0] || !result[0].id) {
            throw new Error("Failed to create delivery item: missing id");
          }
          const normalizedInput = Object.fromEntries(
            Object.entries(result[0]).map(
              ([k, v]) => v === null ? [k, void 0] : [k, v]
            )
          );
          return this.normalizeDeliveryItemRecord(normalizedInput);
        } catch (error) {
          console.error("Error creating delivery item:", error);
          throw new Error("Failed to create delivery item");
        }
      }
      async updateDeliveryItem(id, item) {
        try {
          if (item.unitPrice == null) item.unitPrice = "0.00";
          if (item.totalPrice == null) item.totalPrice = "0.00";
          const result = await db.update(deliveryItems).set({ ...item }).where(eq12(deliveryItems.id, id)).returning();
          if (!result[0]) throw new Error("Delivery item not found");
          return this.normalizeDeliveryItemRecord(result[0]);
        } catch (error) {
          console.error("Error updating delivery item:", error);
          throw new Error("Failed to update delivery item");
        }
      }
      async deleteDeliveryItem(id) {
        try {
          await db.delete(deliveryItems).where(eq12(deliveryItems.id, id));
        } catch (error) {
          console.error("Error deleting delivery item:", error);
          throw new Error("Failed to delete delivery item");
        }
      }
      async bulkCreateDeliveryItems(items3) {
        try {
          const result = await db.insert(deliveryItems).values(items3).returning();
          return result.map((r) => this.normalizeDeliveryItemRecord(r));
        } catch (error) {
          console.error("Error bulk creating delivery items:", error);
          throw new Error("Failed to bulk create delivery items");
        }
      }
      // Delivery Picking Session operations
      async getDeliveryPickingSessions(deliveryId) {
        try {
          return await db.select().from(deliveryPickingSessions).where(eq12(deliveryPickingSessions.deliveryId, deliveryId)).orderBy(desc10(deliveryPickingSessions.startedAt));
        } catch (error) {
          console.error("Error fetching delivery picking sessions:", error);
          throw new Error("Failed to fetch delivery picking sessions");
        }
      }
      async getDeliveryPickingSession(id) {
        try {
          const result = await db.select().from(deliveryPickingSessions).where(eq12(deliveryPickingSessions.id, id)).limit(1);
          return result[0];
        } catch (error) {
          console.error("Error fetching delivery picking session:", error);
          throw new Error("Failed to fetch delivery picking session");
        }
      }
      async createDeliveryPickingSession(session2) {
        try {
          const result = await db.insert(deliveryPickingSessions).values(session2).returning();
          return result[0];
        } catch (error) {
          console.error("Error creating delivery picking session:", error);
          throw new Error("Failed to create delivery picking session");
        }
      }
      async updateDeliveryPickingSession(id, session2) {
        try {
          const result = await db.update(deliveryPickingSessions).set({ ...session2 }).where(eq12(deliveryPickingSessions.id, id)).returning();
          if (result.length === 0) {
            throw new Error("Delivery picking session not found");
          }
          return result[0];
        } catch (error) {
          console.error("Error updating delivery picking session:", error);
          throw new Error("Failed to update delivery picking session");
        }
      }
      async completePickingSession(sessionId) {
        try {
          const result = await db.update(deliveryPickingSessions).set({
            status: "Completed",
            completedAt: /* @__PURE__ */ new Date()
          }).where(eq12(deliveryPickingSessions.id, sessionId)).returning();
          if (result.length === 0) {
            throw new Error("Delivery picking session not found");
          }
          return result[0];
        } catch (error) {
          console.error("Error completing picking session:", error);
          throw new Error("Failed to complete picking session");
        }
      }
      // Delivery Picked Item operations
      async getDeliveryPickedItems(sessionId) {
        try {
          return await db.select().from(deliveryPickedItems).where(eq12(deliveryPickedItems.pickingSessionId, sessionId)).orderBy(desc10(deliveryPickedItems.pickedAt));
        } catch (error) {
          console.error("Error fetching delivery picked items:", error);
          throw new Error("Failed to fetch delivery picked items");
        }
      }
      async deleteDeliveryPickingSession(id) {
        try {
          await db.delete(deliveryPickingSessions).where(eq12(deliveryPickingSessions.id, id));
        } catch (error) {
          console.error("Error deleting delivery picking session:", error);
          throw new Error("Failed to delete delivery picking session");
        }
      }
      async deleteDeliveryPickedItem(id) {
        try {
          await db.delete(deliveryPickedItems).where(eq12(deliveryPickedItems.id, id));
        } catch (error) {
          console.error("Error deleting delivery picked item:", error);
          throw new Error("Failed to delete delivery picked item");
        }
      }
      async bulkCreateDeliveryPickedItems(items3) {
        try {
          const result = await db.insert(deliveryPickedItems).values(items3).returning();
          return result;
        } catch (error) {
          console.error("Error bulk creating delivery picked items:", error);
          throw new Error("Failed to bulk create delivery picked items");
        }
      }
      async getDeliveryPickedItem(id) {
        try {
          const result = await db.select().from(deliveryPickedItems).where(eq12(deliveryPickedItems.id, id)).limit(1);
          return result[0];
        } catch (error) {
          console.error("Error fetching delivery picked item:", error);
          throw new Error("Failed to fetch delivery picked item");
        }
      }
      async createDeliveryPickedItem(item) {
        try {
          const result = await db.insert(deliveryPickedItems).values(item).returning();
          return result[0];
        } catch (error) {
          console.error("Error creating delivery picked item:", error);
          throw new Error("Failed to create delivery picked item");
        }
      }
      async updateDeliveryPickedItem(id, item) {
        try {
          const result = await db.update(deliveryPickedItems).set({ ...item }).where(eq12(deliveryPickedItems.id, id)).returning();
          if (result.length === 0) {
            throw new Error("Delivery picked item not found");
          }
          return result[0];
        } catch (error) {
          console.error("Error updating delivery picked item:", error);
          throw new Error("Failed to update delivery picked item");
        }
      }
      async verifyPickedItem(itemId, userId) {
        try {
          const result = await db.update(deliveryPickedItems).set({
            verified: true,
            verifiedBy: userId,
            verifiedAt: /* @__PURE__ */ new Date()
          }).where(eq12(deliveryPickedItems.id, itemId)).returning();
          if (result.length === 0) {
            throw new Error("Delivery picked item not found");
          }
          return result[0];
        } catch (error) {
          console.error("Error verifying picked item:", error);
          throw new Error("Failed to verify picked item");
        }
      }
      // Barcode scanning and verification
      async verifyItemBarcode(barcode, expectedItemId) {
        try {
          const result = await db.select().from(items).where(eq12(items.barcode, barcode)).limit(1);
          if (result.length === 0) {
            return { valid: false, message: "Barcode not found" };
          }
          const item = result[0];
          if (expectedItemId && item.id !== expectedItemId) {
            return { valid: false, item, message: "Barcode does not match expected item" };
          }
          return { valid: true, item, message: "Barcode verified successfully" };
        } catch (error) {
          console.error("Error verifying item barcode:", error);
          return { valid: false, message: "Error verifying barcode" };
        }
      }
      async scanItemForPicking(barcode, sessionId, quantity, userId, storageLocation) {
        try {
          const verification = await this.verifyItemBarcode(barcode);
          if (!verification.valid) {
            throw new Error(verification.message);
          }
          const deliveryItemsRows = await db.select().from(deliveryItems).where(eq12(deliveryItems.barcode, barcode)).limit(1);
          if (deliveryItemsRows.length === 0) {
            throw new Error("Item not found in delivery");
          }
          const pickedItem = {
            pickingSessionId: sessionId,
            deliveryItemId: deliveryItemsRows[0].id,
            barcode,
            quantityPicked: quantity,
            storageLocation,
            pickedBy: userId,
            verified: false
          };
          return await this.createDeliveryPickedItem(pickedItem);
        } catch (error) {
          console.error("Error scanning item for picking:", error);
          throw new Error("Failed to scan item for picking");
        }
      }
      async getAvailableItemsForPicking(deliveryId) {
        try {
          const result = await db.select({
            id: deliveryItems.id,
            barcode: deliveryItems.barcode,
            supplierCode: deliveryItems.supplierCode,
            description: deliveryItems.description,
            orderedQuantity: deliveryItems.orderedQuantity,
            pickedQuantity: deliveryItems.pickedQuantity,
            deliveredQuantity: deliveryItems.deliveredQuantity,
            storageLocation: deliveryItems.storageLocation
          }).from(deliveryItems).where(eq12(deliveryItems.deliveryId, deliveryId));
          return result;
        } catch (error) {
          console.error("Error fetching available items for picking:", error);
          throw new Error("Failed to fetch available items for picking");
        }
      }
    };
  }
});

// server/storage/shipment-storage.ts
import { eq as eq13, and as and10, desc as desc11, sql as sql9, count as count5, ilike, or as or6 } from "drizzle-orm";
var ShipmentStorage;
var init_shipment_storage = __esm({
  "server/storage/shipment-storage.ts"() {
    "use strict";
    init_base();
    init_db();
    init_schema();
    ShipmentStorage = class extends BaseStorage {
      // Shipment operations
      async getShipments(filters) {
        try {
          const conditions = [];
          if (filters?.status) {
            const allowedStatuses = [
              "Pending",
              "Delivered",
              "Cancelled",
              "Picked Up",
              "In Transit",
              "Out for Delivery",
              "Delayed",
              "Lost"
            ];
            if (allowedStatuses.includes(filters.status)) {
              conditions.push(eq13(shipments.status, filters.status));
            }
          }
          if (filters?.priority) {
            const allowedPriorities = ["Low", "Medium", "High", "Urgent"];
            if (allowedPriorities.includes(filters.priority)) {
              conditions.push(eq13(shipments.priority, filters.priority));
            }
          }
          if (filters?.carrierId) {
            conditions.push(eq13(shipments.carrierId, filters.carrierId));
          }
          if (filters?.serviceType) {
            const allowedServiceTypes = ["Standard", "Express", "Overnight", "Economy"];
            if (allowedServiceTypes.includes(filters.serviceType)) {
              conditions.push(eq13(shipments.serviceType, filters.serviceType));
            }
          }
          if (filters?.search) {
            conditions.push(
              or6(
                ilike(shipments.shipmentNumber, `%${filters.search}%`),
                ilike(shipments.trackingNumber, `%${filters.search}%`),
                ilike(salesOrders.orderNumber, `%${filters.search}%`),
                ilike(customers.name, `%${filters.search}%`)
              )
            );
          }
          if (filters?.dateFrom) {
            conditions.push(sql9`${shipments.createdAt} >= ${filters.dateFrom}`);
          }
          if (filters?.dateTo) {
            conditions.push(sql9`${shipments.createdAt} <= ${filters.dateTo}`);
          }
          let query = db.select({
            id: shipments.id,
            shipmentNumber: shipments.shipmentNumber,
            trackingNumber: shipments.trackingNumber,
            salesOrderId: shipments.salesOrderId,
            salesOrderNumber: salesOrders.orderNumber,
            supplierId: shipments.supplierId,
            supplierName: suppliers.name,
            carrierId: shipments.carrierId,
            carrierName: shipments.carrierName,
            serviceType: shipments.serviceType,
            status: shipments.status,
            priority: shipments.priority,
            origin: shipments.origin,
            destination: shipments.destination,
            estimatedDelivery: shipments.estimatedDelivery,
            actualDelivery: shipments.actualDelivery,
            weight: shipments.weight,
            dimensions: shipments.dimensions,
            declaredValue: shipments.declaredValue,
            currency: shipments.currency,
            shippingCost: shipments.shippingCost,
            customerReference: shipments.customerReference,
            specialInstructions: shipments.specialInstructions,
            packageCount: shipments.packageCount,
            isInsured: shipments.isInsured,
            requiresSignature: shipments.requiresSignature,
            currentLocation: shipments.currentLocation,
            lastUpdate: shipments.lastUpdate,
            createdAt: shipments.createdAt,
            updatedAt: shipments.updatedAt,
            customer: {
              id: customers.id,
              name: customers.name,
              email: customers.email
            }
          }).from(shipments).leftJoin(salesOrders, eq13(shipments.salesOrderId, salesOrders.id)).leftJoin(customers, eq13(salesOrders.customerId, customers.id)).leftJoin(suppliers, eq13(shipments.supplierId, suppliers.id));
          if (conditions.length > 0) {
            query = query.where(and10(...conditions));
          }
          query = query.orderBy(desc11(shipments.createdAt));
          if (filters?.limit) {
            query = query.limit(filters.limit);
          }
          if (filters?.offset) {
            query = query.offset(filters.offset);
          }
          const results = await query;
          return results;
        } catch (error) {
          console.error("Error fetching shipments:", error);
          throw new Error("Failed to fetch shipments");
        }
      }
      async getShipment(id) {
        try {
          const result = await db.select({
            id: shipments.id,
            shipmentNumber: shipments.shipmentNumber,
            trackingNumber: shipments.trackingNumber,
            salesOrderId: shipments.salesOrderId,
            salesOrderNumber: salesOrders.orderNumber,
            supplierId: shipments.supplierId,
            supplierName: suppliers.name,
            carrierId: shipments.carrierId,
            carrierName: shipments.carrierName,
            serviceType: shipments.serviceType,
            status: shipments.status,
            priority: shipments.priority,
            origin: shipments.origin,
            destination: shipments.destination,
            estimatedDelivery: shipments.estimatedDelivery,
            actualDelivery: shipments.actualDelivery,
            weight: shipments.weight,
            dimensions: shipments.dimensions,
            declaredValue: shipments.declaredValue,
            currency: shipments.currency,
            shippingCost: shipments.shippingCost,
            customerReference: shipments.customerReference,
            specialInstructions: shipments.specialInstructions,
            packageCount: shipments.packageCount,
            isInsured: shipments.isInsured,
            requiresSignature: shipments.requiresSignature,
            currentLocation: shipments.currentLocation,
            lastUpdate: shipments.lastUpdate,
            createdAt: shipments.createdAt,
            updatedAt: shipments.updatedAt,
            customer: {
              id: customers.id,
              name: customers.name,
              email: customers.email
            }
          }).from(shipments).leftJoin(salesOrders, eq13(shipments.salesOrderId, salesOrders.id)).leftJoin(customers, eq13(salesOrders.customerId, customers.id)).leftJoin(suppliers, eq13(shipments.supplierId, suppliers.id)).where(eq13(shipments.id, id)).limit(1);
          return result[0] || null;
        } catch (error) {
          console.error("Error fetching shipment:", error);
          throw new Error("Failed to fetch shipment");
        }
      }
      async getShipmentByNumber(shipmentNumber) {
        try {
          const result = await db.select().from(shipments).where(eq13(shipments.shipmentNumber, shipmentNumber)).limit(1);
          return result[0] || null;
        } catch (error) {
          console.error("Error fetching shipment by number:", error);
          throw new Error("Failed to fetch shipment by number");
        }
      }
      async getShipmentByTrackingNumber(trackingNumber) {
        try {
          const result = await db.select({
            id: shipments.id,
            shipmentNumber: shipments.shipmentNumber,
            trackingNumber: shipments.trackingNumber,
            salesOrderId: shipments.salesOrderId,
            salesOrderNumber: salesOrders.orderNumber,
            supplierId: shipments.supplierId,
            supplierName: suppliers.name,
            carrierId: shipments.carrierId,
            carrierName: shipments.carrierName,
            serviceType: shipments.serviceType,
            status: shipments.status,
            priority: shipments.priority,
            origin: shipments.origin,
            destination: shipments.destination,
            estimatedDelivery: shipments.estimatedDelivery,
            actualDelivery: shipments.actualDelivery,
            weight: shipments.weight,
            dimensions: shipments.dimensions,
            declaredValue: shipments.declaredValue,
            currency: shipments.currency,
            shippingCost: shipments.shippingCost,
            customerReference: shipments.customerReference,
            specialInstructions: shipments.specialInstructions,
            packageCount: shipments.packageCount,
            isInsured: shipments.isInsured,
            requiresSignature: shipments.requiresSignature,
            currentLocation: shipments.currentLocation,
            lastUpdate: shipments.lastUpdate,
            createdAt: shipments.createdAt,
            updatedAt: shipments.updatedAt,
            customer: {
              id: customers.id,
              name: customers.name,
              email: customers.email
            }
          }).from(shipments).leftJoin(salesOrders, eq13(shipments.salesOrderId, salesOrders.id)).leftJoin(customers, eq13(salesOrders.customerId, customers.id)).leftJoin(suppliers, eq13(shipments.supplierId, suppliers.id)).where(eq13(shipments.trackingNumber, trackingNumber)).limit(1);
          return result[0] || null;
        } catch (error) {
          console.error("Error fetching shipment by tracking number:", error);
          throw new Error("Failed to fetch shipment by tracking number");
        }
      }
      async createShipment(shipmentData) {
        try {
          if (!shipmentData.shipmentNumber) {
            shipmentData.shipmentNumber = this.generateNumber("SHP");
          }
          if (!shipmentData.trackingNumber) {
            shipmentData.trackingNumber = `TRK${Math.random().toString().substr(2, 9)}`;
          }
          const result = await db.insert(shipments).values({
            ...shipmentData,
            lastUpdate: /* @__PURE__ */ new Date()
          }).returning();
          await this.createTrackingEvent({
            shipmentId: result[0].id,
            timestamp: /* @__PURE__ */ new Date(),
            location: shipmentData.origin || "Origin",
            status: "Shipment Created",
            description: "Shipment has been created and is pending pickup",
            scanType: "Pickup"
          });
          await this.logAuditEvent(
            "shipment",
            result[0].id,
            "created",
            shipmentData.createdBy,
            null,
            result[0]
          );
          return await this.getShipment(result[0].id);
        } catch (error) {
          console.error("Error creating shipment:", error);
          if (error instanceof Error && error.message) {
            throw new Error(error.message);
          }
          throw error;
        }
      }
      async updateShipment(id, shipmentData) {
        try {
          const result = await db.update(shipments).set({
            ...shipmentData,
            updatedAt: /* @__PURE__ */ new Date(),
            lastUpdate: /* @__PURE__ */ new Date()
          }).where(eq13(shipments.id, id)).returning();
          if (result.length === 0) {
            throw new Error("Shipment not found");
          }
          await this.logAuditEvent(
            "shipment",
            id,
            "updated",
            shipmentData.updatedBy,
            null,
            result[0]
          );
          return await this.getShipment(id);
        } catch (error) {
          console.error("Error updating shipment:", error);
          throw new Error("Failed to update shipment");
        }
      }
      async deleteShipment(id) {
        try {
          await db.delete(shipmentTrackingEvents).where(eq13(shipmentTrackingEvents.shipmentId, id));
          const result = await db.delete(shipments).where(eq13(shipments.id, id)).returning();
          if (result.length === 0) {
            throw new Error("Shipment not found");
          }
          await this.logAuditEvent(
            "shipment",
            id,
            "deleted",
            void 0,
            null,
            null
          );
        } catch (error) {
          console.error("Error deleting shipment:", error);
          throw new Error("Failed to delete shipment");
        }
      }
      async updateShipmentStatus(id, status, location) {
        try {
          const updateData = {
            status,
            lastUpdate: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          };
          if (location) {
            updateData.currentLocation = location;
          }
          if (status === "Delivered") {
            updateData.actualDelivery = /* @__PURE__ */ new Date();
          }
          const result = await db.update(shipments).set(updateData).where(eq13(shipments.id, id)).returning();
          if (result.length === 0) {
            throw new Error("Shipment not found");
          }
          await this.createTrackingEvent({
            shipmentId: id,
            timestamp: /* @__PURE__ */ new Date(),
            location: location || result[0].currentLocation || "Unknown",
            status,
            description: `Shipment status updated to ${status}`,
            scanType: this.getEventTypeFromStatus(status)
          });
          return await this.getShipment(id);
        } catch (error) {
          console.error("Error updating shipment status:", error);
          throw new Error("Failed to update shipment status");
        }
      }
      // Shipment tracking operations
      async getShipmentTrackingEvents(shipmentId) {
        try {
          const result = await db.select({
            id: shipmentTrackingEvents.id,
            shipmentId: shipmentTrackingEvents.shipmentId,
            timestamp: shipmentTrackingEvents.timestamp,
            location: shipmentTrackingEvents.location,
            status: shipmentTrackingEvents.status,
            description: shipmentTrackingEvents.description,
            scanType: shipmentTrackingEvents.scanType,
            latitude: shipmentTrackingEvents.latitude,
            longitude: shipmentTrackingEvents.longitude,
            facilityId: shipmentTrackingEvents.facilityId,
            nextExpectedLocation: shipmentTrackingEvents.nextExpectedLocation,
            estimatedArrival: shipmentTrackingEvents.estimatedArrival,
            createdAt: shipmentTrackingEvents.createdAt,
            employee: {
              id: users.id,
              firstName: users.firstName,
              lastName: users.lastName
            }
          }).from(shipmentTrackingEvents).leftJoin(users, eq13(shipmentTrackingEvents.employeeId, users.id)).where(eq13(shipmentTrackingEvents.shipmentId, shipmentId)).orderBy(desc11(shipmentTrackingEvents.timestamp));
          return result;
        } catch (error) {
          console.error("Error fetching tracking events:", error);
          throw new Error("Failed to fetch tracking events");
        }
      }
      async createTrackingEvent(eventData) {
        try {
          const result = await db.insert(shipmentTrackingEvents).values({
            ...eventData,
            timestamp: eventData.timestamp || /* @__PURE__ */ new Date()
          }).returning();
          return result[0];
        } catch (error) {
          console.error("Error creating tracking event:", error);
          throw new Error("Failed to create tracking event");
        }
      }
      async getLatestTrackingEvent(shipmentId) {
        try {
          const result = await db.select().from(shipmentTrackingEvents).where(eq13(shipmentTrackingEvents.shipmentId, shipmentId)).orderBy(desc11(shipmentTrackingEvents.timestamp)).limit(1);
          return result[0] || null;
        } catch (error) {
          console.error("Error fetching latest tracking event:", error);
          throw new Error("Failed to fetch latest tracking event");
        }
      }
      // Analytics and reporting
      async getShipmentAnalytics() {
        try {
          const results = await db.select({
            status: shipments.status,
            count: count5()
          }).from(shipments).groupBy(shipments.status);
          const analytics = {
            totalShipments: 0,
            pendingShipments: 0,
            inTransitShipments: 0,
            deliveredShipments: 0,
            outForDeliveryShipments: 0
          };
          results.forEach((row) => {
            analytics.totalShipments += row.count;
            switch (row.status) {
              case "Pending":
                analytics.pendingShipments = row.count;
                break;
              case "In Transit":
                analytics.inTransitShipments = row.count;
                break;
              case "Delivered":
                analytics.deliveredShipments = row.count;
                break;
              case "Out for Delivery":
                analytics.outForDeliveryShipments = row.count;
                break;
            }
          });
          return analytics;
        } catch (error) {
          console.error("Error fetching shipment analytics:", error);
          throw new Error("Failed to fetch shipment analytics");
        }
      }
      // Helper method to map status to event type
      getEventTypeFromStatus(status) {
        switch (status) {
          case "Picked Up":
            return "Pickup";
          case "In Transit":
            return "In Transit";
          case "Out for Delivery":
            return "Out for Delivery";
          case "Delivered":
            return "Delivered";
          case "Delayed":
          case "Lost":
          case "Cancelled":
            return "Exception";
          default:
            return "In Transit";
        }
      }
    };
  }
});

// server/storage/sales-order-storage.ts
import { eq as eq14, and as and11, desc as desc12, sql as sql10, or as or7, like as like6 } from "drizzle-orm";
var SalesOrderStorage;
var init_sales_order_storage = __esm({
  "server/storage/sales-order-storage.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_base();
    SalesOrderStorage = class extends BaseStorage {
      async getSalesOrders(limit = 50, offset = 0, filters) {
        const conditions = [];
        if (filters) {
          if (filters.status) conditions.push(eq14(salesOrders.status, filters.status));
          if (filters.customerId) conditions.push(eq14(salesOrders.customerId, filters.customerId));
          if (filters.dateFrom) conditions.push(sql10`${salesOrders.orderDate} >= ${filters.dateFrom}`);
          if (filters.dateTo) conditions.push(sql10`${salesOrders.orderDate} <= ${filters.dateTo}`);
          if (filters.search) conditions.push(sql10`${salesOrders.orderNumber} ILIKE ${`%${filters.search}%`}`);
        }
        let query = db.select({ so: salesOrders, cust: customers }).from(salesOrders).leftJoin(customers, eq14(salesOrders.customerId, customers.id));
        if (conditions.length) {
          query = query.where(and11(...conditions));
        }
        const rows = await query.orderBy(desc12(salesOrders.createdAt)).limit(limit).offset(offset);
        return rows.map((r) => {
          const c = r.cust ? {
            id: r.cust.id,
            name: r.cust.name || r.cust.customerName || r.cust.companyName || r.cust.fullName,
            customerType: r.cust.customerType || null,
            address: r.cust.address || r.cust.billingAddress || null
          } : null;
          return { ...r.so, customer: c, __customerEmbedded: true };
        });
      }
      async getSalesOrder(id) {
        const result = await db.select({
          salesOrder: salesOrders,
          customer: customers
        }).from(salesOrders).leftJoin(customers, eq14(salesOrders.customerId, customers.id)).where(eq14(salesOrders.id, id)).limit(1);
        if (result.length === 0) {
          return null;
        }
        const row = result[0];
        const customer = row.customer ? {
          id: row.customer.id,
          name: row.customer.name || row.customer.customerName || row.customer.companyName || row.customer.fullName,
          email: row.customer.email ?? null,
          isActive: row.customer.isActive ?? null,
          createdAt: row.customer.createdAt ?? null,
          updatedAt: row.customer.updatedAt ?? null,
          phone: row.customer.phone ?? null,
          address: row.customer.address ?? row.customer.billingAddress ?? null,
          customerType: row.customer.customerType ?? null,
          vatNumber: row.customer.vatNumber ?? null,
          trnNumber: row.customer.trnNumber ?? null,
          companyName: row.customer.companyName ?? null,
          paymentTerms: row.customer.paymentTerms ?? null
        } : null;
        return { ...row.salesOrder, customer, __customerEmbedded: true };
      }
      async createSalesOrder(salesOrder) {
        const orderNumber = `SO-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(await this.getNextSequenceNumber()).padStart(3, "0")}`;
        const newSalesOrder = {
          // id omitted -> DB default gen_random_uuid()
          orderNumber,
          ...salesOrder,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        const result = await db.insert(salesOrders).values(newSalesOrder).returning();
        return result[0];
      }
      async updateSalesOrder(id, salesOrder) {
        const updatedSalesOrder = {
          ...salesOrder,
          updatedAt: /* @__PURE__ */ new Date()
        };
        const result = await db.update(salesOrders).set(updatedSalesOrder).where(eq14(salesOrders.id, id)).returning();
        return result[0];
      }
      async deleteSalesOrder(id) {
        await db.delete(salesOrders).where(eq14(salesOrders.id, id));
      }
      async createSalesOrderFromQuotation(quotationId, userId) {
        const quotation = await db.select().from(quotations).where(eq14(quotations.id, quotationId)).limit(1);
        if (!quotation[0]) {
          throw new Error("Quotation not found");
        }
        const quotationData = quotation[0];
        const quotationItemsData = await db.select().from(quotationItems).where(eq14(quotationItems.quotationId, quotationId));
        const orderNumber = `SO-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(await this.getNextSequenceNumber()).padStart(3, "0")}`;
        const salesOrderData = {
          orderNumber,
          quotationId,
          customerId: quotationData.customerId,
          orderDate: /* @__PURE__ */ new Date(),
          status: "Draft",
          totalAmount: quotationData.totalAmount,
          createdBy: userId,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        const result = await db.insert(salesOrders).values(salesOrderData).returning();
        const createdSalesOrder = result[0];
        if (quotationItemsData.length > 0) {
          let existingItem = (await db.select().from(items).limit(1))[0];
          if (!existingItem) {
            const created = await db.insert(items).values({
              supplierCode: `GEN-${Date.now()}`,
              description: "Generic Item"
            }).returning();
            existingItem = created[0];
          }
          const fallbackItemId = existingItem.id;
          const salesOrderItemsData = quotationItemsData.map((qi) => {
            const qty = Number(qi.quantity) || 0;
            const unit = Number(qi.unitPrice) || 0;
            const lineTotal = Number(qi.lineTotal) || unit * qty;
            return {
              salesOrderId: createdSalesOrder.id,
              itemId: fallbackItemId,
              quantity: qty,
              unitPrice: unit.toFixed(2),
              totalPrice: lineTotal.toFixed(2),
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            };
          });
          await db.insert(salesOrderItems).values(salesOrderItemsData);
        }
        return createdSalesOrder;
      }
      async createAmendedSalesOrder(parentOrderId, reason, userId) {
        const parentOrder = await this.getSalesOrder(parentOrderId);
        if (!parentOrder) {
          throw new Error("Parent sales order not found");
        }
        return await db.transaction(async (tx) => {
          const baseOrderNumber = parentOrder.orderNumber.replace(/-A\d+$/, "");
          const existingOrders = await tx.select({
            orderNumber: salesOrders.orderNumber,
            amendmentSequence: salesOrders.amendmentSequence
          }).from(salesOrders).where(
            or7(
              eq14(salesOrders.parentOrderId, parentOrderId),
              eq14(salesOrders.orderNumber, baseOrderNumber),
              like6(salesOrders.orderNumber, `${baseOrderNumber}-A%`)
            )
          ).for("update");
          const used = /* @__PURE__ */ new Set();
          for (const order of existingOrders) {
            if (order.amendmentSequence && order.amendmentSequence > 0) {
              used.add(order.amendmentSequence);
            }
            const match = /-A(\d+)$/.exec(order.orderNumber);
            if (match) {
              used.add(Number(match[1]));
            }
          }
          let nextSeq = 1;
          while (used.has(nextSeq)) {
            nextSeq++;
          }
          const amendedOrderNumber = `${baseOrderNumber}-A${nextSeq}`;
          const newVersion = (parentOrder.version || 1) + 1;
          const amendedSalesOrder = {
            orderNumber: amendedOrderNumber,
            amendmentSequence: nextSeq,
            parentOrderId,
            customerId: parentOrder.customerId,
            orderDate: /* @__PURE__ */ new Date(),
            status: "Draft",
            totalAmount: parentOrder.totalAmount,
            createdBy: userId,
            version: newVersion,
            amendmentReason: reason,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          };
          const result = await tx.insert(salesOrders).values(amendedSalesOrder).returning();
          const created = result[0];
          await tx.update(salesOrders).set({ updatedAt: /* @__PURE__ */ new Date() }).where(eq14(salesOrders.id, parentOrderId));
          return created;
        });
      }
      async validateCustomerLpo(id, validationData) {
        const salesOrder = await this.getSalesOrder(id);
        if (!salesOrder) {
          throw new Error("Sales order not found");
        }
        const updatedSalesOrder = {
          customerLpoValidationStatus: validationData.status,
          customerLpoValidatedBy: validationData.validatedBy,
          customerLpoValidatedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        const result = await db.update(salesOrders).set(updatedSalesOrder).where(eq14(salesOrders.id, id)).returning();
        return result[0];
      }
      // Sales Order Item operations
      async getSalesOrderItems(salesOrderId) {
        return db.select().from(salesOrderItems).where(eq14(salesOrderItems.salesOrderId, salesOrderId));
      }
      async getSalesOrderItem(id) {
        const result = await db.select().from(salesOrderItems).where(eq14(salesOrderItems.id, id)).limit(1);
        return result[0];
      }
      async createSalesOrderItem(item) {
        const newItem = {
          ...item,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        const result = await db.insert(salesOrderItems).values(newItem).returning();
        return result[0];
      }
      async updateSalesOrderItem(id, item) {
        const updatedItem = {
          ...item,
          updatedAt: /* @__PURE__ */ new Date()
        };
        const result = await db.update(salesOrderItems).set(updatedItem).where(eq14(salesOrderItems.id, id)).returning();
        return result[0];
      }
      async deleteSalesOrderItem(id) {
        await db.delete(salesOrderItems).where(eq14(salesOrderItems.id, id));
      }
      async bulkCreateSalesOrderItems(items3) {
        const itemsWithIds = items3.map((item) => ({
          ...item,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }));
        const result = await db.insert(salesOrderItems).values(itemsWithIds).returning();
        return result;
      }
      async getNextSequenceNumber() {
        const result = await db.execute(sql10`
      SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 'SO-\\d{4}-(\\d+)') AS INTEGER)), 0) + 1 AS next_number
      FROM sales_orders
      WHERE order_number LIKE 'SO-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-%'
    `);
        const row = result.rows?.[0];
        return row?.next_number || 1;
      }
      /**
       * Get lineage (root + amendments) for a given order id. Root first then amendments by amendment_sequence.
       */
      async getSalesOrderLineage(orderId) {
        const current = await db.select().from(salesOrders).where(eq14(salesOrders.id, orderId)).limit(1);
        if (!current.length) return [];
        let root = current[0];
        if (root.parentOrderId) {
          const maybeRoot = await db.select().from(salesOrders).where(eq14(salesOrders.id, root.parentOrderId)).limit(1);
          if (maybeRoot.length) root = maybeRoot[0];
        }
        const lineage = await db.execute(sql10`
      SELECT * FROM sales_orders
      WHERE id = ${root.id} OR parent_order_id = ${root.id}
      ORDER BY CASE WHEN amendment_sequence IS NULL THEN 0 ELSE amendment_sequence END
    `);
        return lineage.rows;
      }
    };
  }
});

// server/storage/purchase-order-storage.ts
import { eq as eq15, inArray } from "drizzle-orm";
var PurchaseOrderStorage;
var init_purchase_order_storage = __esm({
  "server/storage/purchase-order-storage.ts"() {
    "use strict";
    init_db();
    init_base();
    init_schema();
    PurchaseOrderStorage = class extends BaseStorage {
      async getPurchaseOrders(limit = 50, offset = 0, filters = {}) {
        let query = db.select().from(purchaseOrders);
        if (filters.quotationId) {
          query = query.where(eq15(purchaseOrders.quotationId, filters.quotationId));
        }
        const result = await query.limit(limit).offset(offset);
        return result;
      }
      async getPurchaseOrder(id) {
        const rows = await db.select().from(purchaseOrders).where(eq15(purchaseOrders.id, id));
        return rows[0];
      }
      async createPurchaseOrder(po) {
        console.log("[PO-STORAGE] createPurchaseOrder received:", { poDateType: typeof po.poDate, poDateValue: po.poDate });
        const normalized = { ...po };
        if (normalized.poDate && !(normalized.poDate instanceof Date)) {
          try {
            normalized.poDate = new Date(normalized.poDate);
          } catch (e) {
            console.warn("[PO-STORAGE] Failed to convert poDate, using current date");
            normalized.poDate = /* @__PURE__ */ new Date();
          }
        }
        if (po.quotationId) {
          const quotation = await db.select().from(quotations).where(eq15(quotations.id, po.quotationId));
          if (!quotation.length) throw new Error("Quotation not found for PO");
          const q = quotation[0];
          if (q.status !== "Accepted") {
            throw new Error("Quotation must be Accepted before uploading PO");
          }
        }
        const rows = await db.insert(purchaseOrders).values(normalized).returning();
        return rows[0];
      }
      async updatePurchaseOrder(id, po) {
        const existing = await this.getPurchaseOrder(id);
        if (!existing) throw new Error("Purchase order not found");
        const rows = await db.update(purchaseOrders).set(po).where(eq15(purchaseOrders.id, id)).returning();
        return rows[0];
      }
      async deletePurchaseOrder(id) {
        await db.delete(purchaseOrders).where(eq15(purchaseOrders.id, id));
      }
      async validatePurchaseOrder(id, validation) {
        const existing = await this.getPurchaseOrder(id);
        if (!existing) throw new Error("Purchase order not found");
        const rows = await db.update(purchaseOrders).set({
          validationStatus: validation.status,
          validationNotes: validation.notes,
          validatedBy: validation.validatedBy,
          validatedAt: /* @__PURE__ */ new Date()
        }).where(eq15(purchaseOrders.id, id)).returning();
        return rows[0];
      }
      async getPoLineItems(purchaseOrderId) {
        return await db.select().from(poLineItems).where(eq15(poLineItems.purchaseOrderId, purchaseOrderId));
      }
      async createPoLineItem(line) {
        const rows = await db.insert(poLineItems).values(line).returning();
        return rows[0];
      }
      async updatePoLineItem(id, line) {
        const rows = await db.update(poLineItems).set(line).where(eq15(poLineItems.id, id)).returning();
        return rows[0];
      }
      async bulkCreatePoLineItems(lines) {
        if (!lines.length) return [];
        const rows = await db.insert(poLineItems).values(lines).returning();
        return rows;
      }
      // Extended validation helper: ensure PO lines correspond to accepted quotation items
      async validateLinesAgainstAcceptance(purchaseOrderId) {
        const issues = [];
        const lines = await this.getPoLineItems(purchaseOrderId);
        const po = await this.getPurchaseOrder(purchaseOrderId);
        if (!po) return { valid: false, issues: ["PO not found"] };
        if (!po.quotationId) return { valid: true, issues };
        const quotationItemRows = await db.select().from(quotationItems).where(eq15(quotationItems.quotationId, po.quotationId));
        const acceptedItems = await db.select().from(quotationItemAcceptances).where(inArray(quotationItemAcceptances.quotationItemId, quotationItemRows.map((r) => r.id)));
        const acceptedSet = new Set(acceptedItems.filter((ai) => ai.isAccepted).map((ai) => ai.quotationItemId));
        for (const line of lines) {
          if (line.quotationItemId && !acceptedSet.has(line.quotationItemId)) {
            issues.push(`Line ${line.id} references quotation item not accepted`);
          }
        }
        return { valid: issues.length === 0, issues };
      }
    };
  }
});

// server/storage/acceptance-storage.ts
import { eq as eq16, and as and13 } from "drizzle-orm";
var AcceptanceStorage;
var init_acceptance_storage = __esm({
  "server/storage/acceptance-storage.ts"() {
    "use strict";
    init_db();
    init_base();
    init_schema();
    AcceptanceStorage = class extends BaseStorage {
      // Customer Acceptance CRUD
      async getCustomerAcceptances(quotationId) {
        if (quotationId) {
          return await db.select().from(customerAcceptances).where(eq16(customerAcceptances.quotationId, quotationId));
        }
        return await db.select().from(customerAcceptances);
      }
      async getCustomerAcceptance(id) {
        const rows = await db.select().from(customerAcceptances).where(eq16(customerAcceptances.id, id));
        return rows[0];
      }
      async createCustomerAcceptance(acceptance) {
        const rows = await db.insert(customerAcceptances).values(acceptance).returning();
        return rows[0];
      }
      async updateCustomerAcceptance(id, acceptance) {
        const existing = await this.getCustomerAcceptance(id);
        if (!existing) throw new Error("Customer acceptance not found");
        const rows = await db.update(customerAcceptances).set(acceptance).where(eq16(customerAcceptances.id, id)).returning();
        return rows[0];
      }
      async deleteCustomerAcceptance(id) {
        await db.delete(customerAcceptances).where(eq16(customerAcceptances.id, id));
      }
      async supersedeActiveAcceptances(quotationId) {
        await db.update(customerAcceptances).set({ status: "Superseded" }).where(and13(eq16(customerAcceptances.quotationId, quotationId), eq16(customerAcceptances.status, "Active")));
      }
      // Quotation Item Acceptances
      async getQuotationItemAcceptances(customerAcceptanceId) {
        return await db.select().from(quotationItemAcceptances).where(eq16(quotationItemAcceptances.customerAcceptanceId, customerAcceptanceId));
      }
      async getQuotationItemAcceptance(id) {
        const rows = await db.select().from(quotationItemAcceptances).where(eq16(quotationItemAcceptances.id, id));
        return rows[0];
      }
      async createQuotationItemAcceptance(item) {
        const rows = await db.insert(quotationItemAcceptances).values(item).returning();
        return rows[0];
      }
      async updateQuotationItemAcceptance(id, item) {
        const existing = await this.getQuotationItemAcceptance(id);
        if (!existing) throw new Error("Quotation item acceptance not found");
        const rows = await db.update(quotationItemAcceptances).set(item).where(eq16(quotationItemAcceptances.id, id)).returning();
        return rows[0];
      }
      async bulkCreateQuotationItemAcceptances(items3) {
        if (!items3.length) return [];
        const uniqueMap = /* @__PURE__ */ new Map();
        for (const it of items3) {
          const key = `${it.customerAcceptanceId}:${it.quotationItemId}`;
          if (!uniqueMap.has(key)) uniqueMap.set(key, it);
        }
        const deduped = Array.from(uniqueMap.values());
        if (!deduped.length) return [];
        const rows = await db.insert(quotationItemAcceptances).values(deduped).returning();
        return rows;
      }
      // Acceptance Confirmations
      async getAcceptanceConfirmations(customerAcceptanceId) {
        return await db.select().from(acceptanceConfirmations).where(eq16(acceptanceConfirmations.customerAcceptanceId, customerAcceptanceId));
      }
      async createAcceptanceConfirmation(conf) {
        const rows = await db.insert(acceptanceConfirmations).values(conf).returning();
        return rows[0];
      }
    };
  }
});

// server/storage/goods-receipt-storage.ts
import { eq as eq17 } from "drizzle-orm";
import { randomUUID } from "crypto";
var GoodsReceiptStorage;
var init_goods_receipt_storage = __esm({
  "server/storage/goods-receipt-storage.ts"() {
    "use strict";
    init_db();
    init_schema();
    GoodsReceiptStorage = class {
      generateReceiptNumber() {
        return `GRN-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      }
      async createGoodsReceiptHeader(receipt) {
        try {
          console.log("[GoodsReceiptStorage.createGoodsReceiptHeader][START]", { incoming: receipt });
          const base = { ...receipt };
          if (!base.receiptNumber) base.receiptNumber = this.generateReceiptNumber();
          if (!base.id) base.id = randomUUID();
          if (!base.status) base.status = "Draft";
          if (!base.receiptDate) base.receiptDate = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
          const normalizeDate = (d) => {
            if (!d) return d;
            if (typeof d === "string" && d.length >= 10) return d.slice(0, 10);
            if (d instanceof Date) return d.toISOString().slice(0, 10);
            return d;
          };
          base.receiptDate = normalizeDate(base.receiptDate);
          base.expectedDeliveryDate = normalizeDate(base.expectedDeliveryDate);
          base.actualDeliveryDate = normalizeDate(base.actualDeliveryDate);
          if (!base.supplierId && base.supplierLpoId) {
            console.warn("[GoodsReceiptStorage.createGoodsReceiptHeader] Missing supplierId; derivation from supplierLpoId not implemented");
          }
          const parseInput = { ...base };
          delete parseInput.id;
          let toInsert;
          try {
            toInsert = insertGoodsReceiptHeaderSchema.parse(parseInput);
          } catch (zerr) {
            console.error("[GoodsReceiptStorage.createGoodsReceiptHeader] Validation failed", zerr, { parseInput });
            throw zerr;
          }
          const assignedId = base.id;
          console.log("[GoodsReceiptStorage.createGoodsReceiptHeader][ID RESOLUTION]", { assignedId });
          const projected = {
            id: assignedId,
            receiptNumber: toInsert.receiptNumber,
            supplierLpoId: toInsert.supplierLpoId,
            supplierId: toInsert.supplierId,
            receiptDate: toInsert.receiptDate,
            expectedDeliveryDate: toInsert.expectedDeliveryDate,
            actualDeliveryDate: toInsert.actualDeliveryDate,
            receivedBy: toInsert.receivedBy,
            status: toInsert.status,
            notes: toInsert.notes,
            totalItems: toInsert.totalItems,
            totalQuantityExpected: toInsert.totalQuantityExpected,
            totalQuantityReceived: toInsert.totalQuantityReceived,
            discrepancyFlag: toInsert.discrepancyFlag
          };
          console.log("[GoodsReceiptStorage.createGoodsReceiptHeader][PROJECTED]", projected);
          try {
            const inserted = await db.insert(goodsReceiptHeaders).values(projected).returning();
            console.log("[GoodsReceiptStorage.createGoodsReceiptHeader][PRIMARY OK]", { id: inserted[0]?.id });
            return inserted[0];
          } catch (errPrimary) {
            console.error("[GoodsReceiptStorage.createGoodsReceiptHeader] Primary insert failed", errPrimary);
            const minimal = {
              id: projected.id,
              receiptNumber: projected.receiptNumber,
              supplierLpoId: projected.supplierLpoId,
              supplierId: projected.supplierId,
              receiptDate: projected.receiptDate,
              status: projected.status || "Draft"
            };
            console.log("[GoodsReceiptStorage.createGoodsReceiptHeader][MINIMAL RETRY]", minimal);
            try {
              const inserted2 = await db.insert(goodsReceiptHeaders).values(minimal).returning();
              console.log("[GoodsReceiptStorage.createGoodsReceiptHeader][SECONDARY OK]", { id: inserted2[0]?.id });
              return inserted2[0];
            } catch (errSecondary) {
              console.error("[GoodsReceiptStorage.createGoodsReceiptHeader] Secondary insert failed", errSecondary);
              throw errPrimary;
            }
          }
        } catch (err) {
          console.error("[GoodsReceiptStorage.createGoodsReceiptHeader] Error", err, { input: receipt });
          throw err;
        }
      }
      async createGoodsReceiptItem(item) {
        try {
          const start = Date.now();
          const base = { ...item };
          console.log("[GoodsReceiptStorage.createGoodsReceiptItem][INPUT]", base);
          if (!base.itemDescription) base.itemDescription = base.description || "Item";
          if (!base.quantityExpected && base.quantityReceived) base.quantityExpected = base.quantityReceived;
          if (base.goodsReceiptId && !base.receiptHeaderId) {
            base.receiptHeaderId = base.goodsReceiptId;
          }
          try {
            const parsed = insertGoodsReceiptItemSchema.parse(base);
            console.log("[GoodsReceiptStorage.createGoodsReceiptItem][PARSED]", parsed);
            const rowToInsert = { id: randomUUID(), ...parsed };
            console.log("[GoodsReceiptStorage.createGoodsReceiptItem][ROW TO INSERT]", rowToInsert);
            let inserted;
            try {
              inserted = await db.insert(goodsReceiptItems).values(rowToInsert).returning();
            } catch (dbErr) {
              const pgInfo = {
                code: dbErr?.code,
                detail: dbErr?.detail,
                table: dbErr?.table,
                constraint: dbErr?.constraint,
                message: dbErr?.message
              };
              console.error("[GoodsReceiptStorage.createGoodsReceiptItem][DB ERROR]", pgInfo);
              const wrapped = new Error(dbErr?.message || "DB insert failed for goods receipt item");
              wrapped.db = pgInfo;
              throw wrapped;
            }
            const row = inserted[0];
            console.log("[GoodsReceiptStorage.createGoodsReceiptItem][SUCCESS]", { id: row?.id, ms: Date.now() - start });
            return row;
          } catch (inner) {
            console.error("[GoodsReceiptStorage.createGoodsReceiptItem][ERROR]", inner);
            throw inner;
          }
        } catch (err) {
          console.error("[GoodsReceiptStorage.createGoodsReceiptItem] Error", err, { input: item });
          throw err;
        }
      }
      async getGoodsReceiptHeaders(filters) {
        let q = db.select().from(goodsReceiptHeaders);
        return await q;
      }
      async getGoodsReceiptHeader(id) {
        const r = await db.select().from(goodsReceiptHeaders).where(eq17(goodsReceiptHeaders.id, id)).limit(1);
        return r[0];
      }
      async getGoodsReceiptItems(headerId) {
        return db.select().from(goodsReceiptItems).where(eq17(goodsReceiptItems.receiptHeaderId, headerId));
      }
      async createGoodsReceiptItemsBulk(itemsArr) {
        if (!itemsArr.length) return [];
        const prepared = itemsArr.map((it) => {
          const base = { ...it };
          if (!base.itemDescription) base.itemDescription = base.description || "Item";
          if (!base.quantityExpected && base.quantityReceived) base.quantityExpected = base.quantityReceived;
          return insertGoodsReceiptItemSchema.parse(base);
        });
        return db.insert(goodsReceiptItems).values(prepared).returning();
      }
      async approveGoodsReceipt(id, approvedBy) {
        try {
          console.log("[GoodsReceiptStorage.approveGoodsReceipt][START]", { id, approvedBy });
          const updated = await db.update(goodsReceiptHeaders).set({
            status: "Approved",
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq17(goodsReceiptHeaders.id, id)).returning();
          if (!updated.length) {
            throw new Error("Goods receipt not found");
          }
          console.log("[GoodsReceiptStorage.approveGoodsReceipt][SUCCESS]", { id: updated[0]?.id });
          return updated[0];
        } catch (err) {
          console.error("[GoodsReceiptStorage.approveGoodsReceipt] Error", err, { id, approvedBy });
          throw err;
        }
      }
      async updateGoodsReceiptStatus(id, status) {
        try {
          console.log("[GoodsReceiptStorage.updateGoodsReceiptStatus][START]", { id, status });
          const updated = await db.update(goodsReceiptHeaders).set({
            status,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq17(goodsReceiptHeaders.id, id)).returning();
          if (!updated.length) {
            throw new Error("Goods receipt not found");
          }
          console.log("[GoodsReceiptStorage.updateGoodsReceiptStatus][SUCCESS]", { id: updated[0]?.id });
          return updated[0];
        } catch (err) {
          console.error("[GoodsReceiptStorage.updateGoodsReceiptStatus] Error", err, { id, status });
          throw err;
        }
      }
      async updateGoodsReceiptHeader(id, data) {
        try {
          console.log("[GoodsReceiptStorage.updateGoodsReceiptHeader][START]", { id, data });
          const updateData = {
            ...data,
            updatedAt: /* @__PURE__ */ new Date()
          };
          const updated = await db.update(goodsReceiptHeaders).set(updateData).where(eq17(goodsReceiptHeaders.id, id)).returning();
          if (!updated.length) {
            throw new Error("Goods receipt not found");
          }
          console.log("[GoodsReceiptStorage.updateGoodsReceiptHeader][SUCCESS]", { id: updated[0]?.id });
          return updated[0];
        } catch (err) {
          console.error("[GoodsReceiptStorage.updateGoodsReceiptHeader] Error", err, { id, data });
          throw err;
        }
      }
    };
  }
});

// server/storage/supplier-lpo-storage.ts
import { and as and14, desc as desc13, eq as eq18, sql as sql11 } from "drizzle-orm";
var SupplierLpoStorage;
var init_supplier_lpo_storage = __esm({
  "server/storage/supplier-lpo-storage.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_base();
    SupplierLpoStorage = class extends BaseStorage {
      async getSupplierLpos(limit = 50, offset = 0, filters) {
        let base = db.select({
          id: supplierLpos.id,
          lpoNumber: supplierLpos.lpoNumber,
          supplierId: supplierLpos.supplierId,
          supplierName: suppliers.name,
          status: supplierLpos.status,
          lpoDate: supplierLpos.lpoDate,
          expectedDeliveryDate: supplierLpos.expectedDeliveryDate,
          requestedDeliveryDate: supplierLpos.requestedDeliveryDate,
          subtotal: supplierLpos.subtotal,
          taxAmount: supplierLpos.taxAmount,
          totalAmount: supplierLpos.totalAmount,
          currency: supplierLpos.currency,
          approvalStatus: supplierLpos.approvalStatus,
          requiresApproval: supplierLpos.requiresApproval,
          paymentTerms: supplierLpos.paymentTerms,
          deliveryTerms: supplierLpos.deliveryTerms,
          version: supplierLpos.version,
          createdAt: supplierLpos.createdAt,
          updatedAt: supplierLpos.updatedAt,
          createdBy: supplierLpos.createdBy,
          sourceType: supplierLpos.sourceType,
          sourceSalesOrderIds: supplierLpos.sourceSalesOrderIds,
          sourceQuotationIds: supplierLpos.sourceQuotationIds,
          groupingCriteria: supplierLpos.groupingCriteria,
          termsAndConditions: supplierLpos.termsAndConditions,
          specialInstructions: supplierLpos.specialInstructions,
          parentLpoId: supplierLpos.parentLpoId,
          amendmentReason: supplierLpos.amendmentReason,
          amendmentType: supplierLpos.amendmentType,
          approvedBy: supplierLpos.approvedBy,
          approvedAt: supplierLpos.approvedAt,
          approvalNotes: supplierLpos.approvalNotes,
          sentToSupplierAt: supplierLpos.sentToSupplierAt,
          confirmedBySupplierAt: supplierLpos.confirmedBySupplierAt,
          supplierConfirmationReference: supplierLpos.supplierConfirmationReference,
          supplierContactPerson: supplierLpos.supplierContactPerson,
          supplierEmail: supplierLpos.supplierEmail,
          supplierPhone: supplierLpos.supplierPhone
        }).from(supplierLpos).leftJoin(suppliers, eq18(supplierLpos.supplierId, suppliers.id));
        const conditions = [];
        if (filters) {
          if (filters.status) conditions.push(eq18(supplierLpos.status, filters.status));
          if (filters.supplierId) conditions.push(eq18(supplierLpos.supplierId, filters.supplierId));
          if (filters.dateFrom) conditions.push(sql11`${supplierLpos.lpoDate} >= ${filters.dateFrom}`);
          if (filters.dateTo) conditions.push(sql11`${supplierLpos.lpoDate} <= ${filters.dateTo}`);
          if (filters.search) conditions.push(sql11`(${supplierLpos.lpoNumber} ILIKE ${`%${filters.search}%`} OR ${suppliers.name} ILIKE ${`%${filters.search}%`})`);
          if (conditions.length) base = base.where(and14(...conditions));
        }
        return base.orderBy(desc13(supplierLpos.createdAt)).limit(limit).offset(offset);
      }
      async getSupplierLpo(id) {
        const r = await db.select().from(supplierLpos).where(eq18(supplierLpos.id, id)).limit(1);
        return r[0];
      }
      async getSupplierLposCount(filters) {
        let base = db.select({ count: sql11`count(*)` }).from(supplierLpos).leftJoin(suppliers, eq18(supplierLpos.supplierId, suppliers.id));
        const conditions = [];
        if (filters) {
          if (filters.status) conditions.push(eq18(supplierLpos.status, filters.status));
          if (filters.supplierId) conditions.push(eq18(supplierLpos.supplierId, filters.supplierId));
          if (filters.dateFrom) conditions.push(sql11`${supplierLpos.lpoDate} >= ${filters.dateFrom}`);
          if (filters.dateTo) conditions.push(sql11`${supplierLpos.lpoDate} <= ${filters.dateTo}`);
          if (filters.search) conditions.push(sql11`(${supplierLpos.lpoNumber} ILIKE ${`%${filters.search}%`} OR ${suppliers.name} ILIKE ${`%${filters.search}%`})`);
          if (conditions.length) base = base.where(and14(...conditions));
        }
        const result = await base;
        return result[0]?.count || 0;
      }
      async createSupplierLpo(data) {
        const lpoNumber = data.lpoNumber || this.generateNumber("LPO");
        let supplierId = data.supplierId;
        if (!supplierId) {
          const existing = await db.select().from(suppliers).limit(1);
          if (existing[0]) supplierId = existing[0].id;
          else {
            const created = await db.insert(suppliers).values({ name: "Auto Supplier", contactPerson: "System" }).returning();
            supplierId = created[0].id;
          }
        }
        console.debug("[SupplierLpoStorage.createSupplierLpo] Preparing insert", { lpoNumber, supplierId });
        const record = {
          lpoNumber,
          supplierId,
          status: data.status || "Draft",
          sourceType: data.sourceType || "Manual",
          groupingCriteria: data.groupingCriteria,
          subtotal: data.subtotal,
          taxAmount: data.taxAmount,
          totalAmount: data.totalAmount,
          currency: data.currency || "BHD",
          requiresApproval: data.requiresApproval || false,
          approvalStatus: data.approvalStatus || (data.requiresApproval ? "Pending" : "Not Required"),
          createdBy: data.createdBy || null,
          // Allow null for createdBy
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          version: 1,
          sourceSalesOrderIds: data.sourceSalesOrderIds,
          sourceQuotationIds: data.sourceQuotationIds
        };
        console.debug("[SupplierLpoStorage.createSupplierLpo] Insert record", record);
        const inserted = await db.insert(supplierLpos).values(record).returning();
        console.debug("[SupplierLpoStorage.createSupplierLpo] Insert result", inserted);
        if (!inserted || !inserted[0]) {
          console.error("[SupplierLpoStorage.createSupplierLpo] Insert returned empty result set", { record });
          throw new Error("Failed to insert supplier LPO");
        }
        return inserted[0];
      }
      async updateSupplierLpo(id, data) {
        const updated = { ...data, updatedAt: /* @__PURE__ */ new Date() };
        const res = await db.update(supplierLpos).set(updated).where(eq18(supplierLpos.id, id)).returning();
        return res[0];
      }
      async deleteSupplierLpo(id) {
        await db.delete(supplierLpos).where(eq18(supplierLpos.id, id));
      }
      async createSupplierLposFromSalesOrders(salesOrderIds, groupBy, userId, supplierIdOverride) {
        if (!salesOrderIds.length) return [];
        const out = [];
        for (const soId of salesOrderIds) {
          const so = (await db.select().from(salesOrders).where(eq18(salesOrders.id, soId)).limit(1))[0];
          if (!so) continue;
          const soItems = await db.select().from(salesOrderItems).where(eq18(salesOrderItems.salesOrderId, soId));
          let subtotal = 0;
          soItems.forEach((i) => subtotal += Number(i.totalPrice || 0));
          const lpo = await this.createSupplierLpo({ supplierId: supplierIdOverride, sourceType: "Auto", groupingCriteria: groupBy, subtotal: subtotal.toFixed(2), totalAmount: subtotal.toFixed(2), sourceSalesOrderIds: [soId], createdBy: userId });
          const existingItem = (await db.select().from(items).limit(1))[0];
          const fallbackBarcode = existingItem?.barcode || `AUTO-${Date.now()}`;
          const lpoItems = soItems.map((soi, idx) => ({
            supplierLpoId: lpo.id,
            itemId: soi.itemId || existingItem?.id,
            salesOrderItemId: soi.id,
            supplierCode: existingItem?.supplierCode || "GEN-SUP",
            barcode: fallbackBarcode,
            itemDescription: "Auto-generated from Sales Order",
            quantity: soi.quantity,
            receivedQuantity: 0,
            pendingQuantity: soi.quantity,
            // initial pending equals ordered
            unitCost: soi.unitPrice || "0",
            totalCost: soi.totalPrice || "0",
            currency: "BHD",
            lineNumber: idx + 1,
            deliveryStatus: "Pending"
          }));
          if (lpoItems.length) await db.insert(supplierLpoItems).values(lpoItems);
          out.push(lpo);
        }
        return out;
      }
      async createAmendedSupplierLpo(parentLpoId, reason, amendmentType, userId) {
        const parent = await this.getSupplierLpo(parentLpoId);
        if (!parent) throw new Error("Parent LPO not found");
        return this.createSupplierLpo({ supplierId: parent.supplierId, sourceType: parent.sourceType, groupingCriteria: parent.groupingCriteria, subtotal: parent.subtotal, totalAmount: parent.totalAmount, currency: parent.currency, version: (parent.version || 1) + 1, parentLpoId, amendmentReason: reason, amendmentType, createdBy: userId, requiresApproval: parent.requiresApproval, approvalStatus: parent.approvalStatus, sourceSalesOrderIds: parent.sourceSalesOrderIds });
      }
      async submitForApproval(id, userId) {
        const lpo = await this.getSupplierLpo(id);
        if (!lpo) throw new Error("Supplier LPO not found");
        return this.updateSupplierLpo(id, { requiresApproval: true, approvalStatus: "Pending" });
      }
      async approveSupplierLpo(id, userId, notes) {
        const lpo = await this.getSupplierLpo(id);
        if (!lpo) throw new Error("Supplier LPO not found");
        return this.updateSupplierLpo(id, { approvalStatus: "Approved", approvedBy: userId, approvedAt: /* @__PURE__ */ new Date(), approvalNotes: notes });
      }
      async rejectSupplierLpo(id, userId, notes) {
        const lpo = await this.getSupplierLpo(id);
        if (!lpo) throw new Error("Supplier LPO not found");
        return this.updateSupplierLpo(id, { approvalStatus: "Rejected", approvalNotes: notes });
      }
      async sendToSupplier(id, userId) {
        const lpo = await this.getSupplierLpo(id);
        if (!lpo) throw new Error("Supplier LPO not found");
        return this.updateSupplierLpo(id, { status: "Sent", sentToSupplierAt: /* @__PURE__ */ new Date() });
      }
      async confirmBySupplier(id, confirmationReference) {
        const lpo = await this.getSupplierLpo(id);
        if (!lpo) throw new Error("Supplier LPO not found");
        return this.updateSupplierLpo(id, { status: "Confirmed", confirmedBySupplierAt: /* @__PURE__ */ new Date(), supplierConfirmationReference: confirmationReference });
      }
      async updateExpectedDeliveryDate(id, expectedDeliveryDate, userId) {
        const lpo = await this.getSupplierLpo(id);
        if (!lpo) throw new Error("Supplier LPO not found");
        return this.updateSupplierLpo(id, {
          expectedDeliveryDate: new Date(expectedDeliveryDate),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      async getSupplierLpoBacklog() {
        return db.select().from(supplierLpos).where(sql11`${supplierLpos.status} IN ('Draft','Sent')`);
      }
      async getCustomerOrderBacklog() {
        return [];
      }
      async getSupplierLpoItems(lpoId) {
        return db.select().from(supplierLpoItems).where(eq18(supplierLpoItems.supplierLpoId, lpoId));
      }
      async getSupplierLpoItem(id) {
        const r = await db.select().from(supplierLpoItems).where(eq18(supplierLpoItems.id, id)).limit(1);
        return r[0];
      }
      async createSupplierLpoItem(item) {
        const r = await db.insert(supplierLpoItems).values(item).returning();
        return r[0];
      }
      async updateSupplierLpoItem(id, item) {
        const r = await db.update(supplierLpoItems).set(item).where(eq18(supplierLpoItems.id, id)).returning();
        return r[0];
      }
      async deleteSupplierLpoItem(id) {
        await db.delete(supplierLpoItems).where(eq18(supplierLpoItems.id, id));
      }
      async bulkCreateSupplierLpoItems(itemsArr) {
        if (!itemsArr.length) return [];
        const r = await db.insert(supplierLpoItems).values(itemsArr).returning();
        return r;
      }
    };
  }
});

// server/storage/invoice-storage.ts
import { and as and15, desc as desc14, eq as eq19, sql as sql12 } from "drizzle-orm";
function num(val) {
  if (val === null || val === void 0) return 0;
  const n = typeof val === "number" ? val : parseFloat(val);
  return isNaN(n) ? 0 : n;
}
var InvoiceStorage;
var init_invoice_storage = __esm({
  "server/storage/invoice-storage.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_base();
    InvoiceStorage = class extends BaseStorage {
      // Basic list with lightweight filtering & pagination
      async getInvoices(filters) {
        const limit = filters?.limit ?? 50;
        const offset = filters?.offset ?? 0;
        let q = db.select().from(invoices);
        const conds = [];
        if (filters) {
          if (filters.status) conds.push(eq19(invoices.status, filters.status));
          if (filters.type) conds.push(eq19(invoices.invoiceType, filters.type));
          if (filters.customerId) conds.push(eq19(invoices.customerId, filters.customerId));
          if (filters.salesOrderId) conds.push(eq19(invoices.salesOrderId, filters.salesOrderId));
          if (filters.currency) conds.push(eq19(invoices.currency, filters.currency));
          if (filters.dateFrom) conds.push(sql12`${invoices.invoiceDate} >= ${filters.dateFrom}`);
          if (filters.dateTo) conds.push(sql12`${invoices.invoiceDate} <= ${filters.dateTo}`);
          if (filters.search) conds.push(sql12`${invoices.invoiceNumber} ILIKE ${`%${filters.search}%`}`);
          if (conds.length) q = q.where(and15(...conds));
        }
        return q.orderBy(desc14(invoices.createdAt)).limit(limit).offset(offset);
      }
      async getInvoice(id) {
        const r = await db.select().from(invoices).where(eq19(invoices.id, id)).limit(1);
        return r[0];
      }
      async getInvoiceByNumber(invoiceNumber) {
        const r = await db.select().from(invoices).where(eq19(invoices.invoiceNumber, invoiceNumber)).limit(1);
        return r[0];
      }
      async createInvoice(data) {
        const invoiceNumber = data.invoiceNumber || this.generateNumber("INV");
        const now = /* @__PURE__ */ new Date();
        const record = { ...data, invoiceNumber, createdAt: now, updatedAt: now };
        try {
          const inserted = await db.insert(invoices).values(record).returning();
          return inserted[0];
        } catch (err) {
          if (err?.code === "23503" && String(err?.detail || "").includes("created_by")) {
            const fallback = { ...record, createdBy: null };
            const inserted = await db.insert(invoices).values(fallback).returning();
            return inserted[0];
          }
          throw err;
        }
      }
      async updateInvoice(id, data) {
        const updated = await db.update(invoices).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq19(invoices.id, id)).returning();
        return updated[0];
      }
      async deleteInvoice(id) {
        await db.delete(invoices).where(eq19(invoices.id, id));
      }
      // Generation from delivery: derive customer, sales order, sums from delivered items
      async generateInvoiceFromDelivery(deliveryId, invoiceType = "Final", userId) {
        console.log(`[DEBUG] Starting invoice generation for delivery: ${deliveryId}`);
        let deliveryRec;
        let soId;
        let so;
        let items3;
        try {
          const deliveryRecArr = await db.select().from(deliveries).where(eq19(deliveries.id, deliveryId)).limit(1);
          deliveryRec = deliveryRecArr[0];
          if (!deliveryRec) throw new Error("Delivery not found");
          console.log(`[DEBUG] Found delivery: ${deliveryRec.deliveryNumber}`);
          soId = deliveryRec.salesOrderId;
          console.log(`[DEBUG] Sales order ID: ${soId}`);
          if (!soId) {
            throw new Error("Delivery must be linked to a sales order to generate an invoice");
          }
          const soArr = await db.select().from(salesOrders).where(eq19(salesOrders.id, soId)).limit(1);
          so = soArr[0];
          if (!so) {
            throw new Error("Sales order not found for the delivery");
          }
          console.log(`[DEBUG] Found sales order: ${so.orderNumber}`);
          items3 = await db.select().from(deliveryItems).where(eq19(deliveryItems.deliveryId, deliveryId));
          console.log(`[DEBUG] Found ${items3.length} delivery items`);
        } catch (error) {
          console.error(`[DEBUG] Error in initial data fetching:`, error);
          throw error;
        }
        let itemsToProcess = items3;
        if (items3.length === 0 && soId) {
          console.log(`[DEBUG] No delivery items found, creating from sales order items`);
          const salesOrderItemsData = await db.select().from(salesOrderItems).where(eq19(salesOrderItems.salesOrderId, soId));
          console.log(`[DEBUG] Found ${salesOrderItemsData.length} sales order items`);
          itemsToProcess = salesOrderItemsData.map((soItem, index) => ({
            id: `virtual-${soItem.id}`,
            deliveryId,
            salesOrderItemId: soItem.id,
            itemId: soItem.itemId,
            lineNumber: soItem.lineNumber || index + 1,
            barcode: `AUTO-${Date.now()}-${index}`,
            supplierCode: "AUTO-SUP",
            description: "Item from Sales Order",
            orderedQuantity: soItem.quantity,
            pickedQuantity: soItem.quantity,
            deliveredQuantity: soItem.quantity,
            unitPrice: soItem.unitPrice,
            totalPrice: soItem.totalPrice,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }));
          console.log(`[DEBUG] Created ${itemsToProcess.length} virtual delivery items`);
        }
        let subtotal = 0;
        const invoiceItemsToInsert = [];
        let lineNumber = 1;
        for (const di of itemsToProcess) {
          console.log(`[DEBUG] Processing delivery item: ${di.id}`);
          const soItemArr = di.salesOrderItemId ? await db.select().from(salesOrderItems).where(eq19(salesOrderItems.id, di.salesOrderItemId)).limit(1) : [];
          const soItem = soItemArr[0];
          console.log(`[DEBUG] Sales order item: ${soItem?.id || "None"}`);
          const qty = num(di.deliveredQuantity || di.pickedQuantity || di.orderedQuantity || soItem?.quantity || 0);
          const unitPrice = num(soItem?.unitPrice || di.unitPrice || 0);
          const lineTotal = qty * unitPrice;
          subtotal += lineTotal;
          const barcode = di.barcode || soItem?.barcode || `AUTO-${lineNumber}`;
          const supplierCode = di.supplierCode || soItem?.supplierCode || "AUTO-SUP";
          const description = soItem?.description || di.description || "Item";
          const itemId = soItem?.itemId || di.itemId || null;
          console.log(`[DEBUG] Item ID: ${itemId}, Barcode: ${barcode}, Supplier Code: ${supplierCode}`);
          if (!itemId) {
            console.log(`[DEBUG] WARNING: No itemId found for delivery item ${di.id}, skipping...`);
            continue;
          }
          if (!barcode || !supplierCode || !description) {
            console.log(`[DEBUG] WARNING: Missing required fields for delivery item ${di.id}, skipping...`);
            continue;
          }
          invoiceItemsToInsert.push({
            invoiceId: "TEMP",
            deliveryItemId: di.id.startsWith("virtual-") ? null : di.id,
            salesOrderItemId: di.salesOrderItemId || soItem?.id || null,
            itemId,
            barcode,
            supplierCode,
            description: soItem?.description || di.description || "Item",
            lineNumber,
            quantity: qty,
            unitPrice,
            totalPrice: lineTotal,
            discountPercentage: "0",
            discountAmount: 0,
            taxRate: "0",
            taxAmount: 0,
            unitPriceBase: unitPrice,
            totalPriceBase: lineTotal,
            discountAmountBase: 0,
            taxAmountBase: 0,
            returnQuantity: 0,
            notes: null
          });
          lineNumber++;
        }
        console.log(`[DEBUG] Subtotal calculated: ${subtotal}`);
        console.log(`[DEBUG] Invoice items to insert: ${invoiceItemsToInsert.length}`);
        if (invoiceItemsToInsert.length === 0) {
          throw new Error("No valid items found for invoice generation");
        }
        if (!so.customerId) {
          throw new Error("Sales order is missing customer ID");
        }
        if (!soId) {
          throw new Error("Sales order ID is required for invoice generation");
        }
        if (subtotal <= 0) {
          throw new Error("Invoice subtotal must be greater than zero");
        }
        console.log(`[DEBUG] Validation passed - proceeding with invoice creation`);
        console.log(`[DEBUG] Sales Order ID: ${soId}`);
        console.log(`[DEBUG] Customer ID: ${so.customerId}`);
        console.log(`[DEBUG] Subtotal: ${subtotal}`);
        const invoiceNumber = this.generateNumber("INV");
        console.log(`[DEBUG] Generated invoice number: ${invoiceNumber}`);
        const invoiceInsert = {
          invoiceNumber,
          invoiceType,
          salesOrderId: soId,
          // This is now guaranteed to be non-null
          deliveryId,
          customerId: so.customerId,
          // Use sales order customer ID as primary source
          status: "Draft",
          currency: so.currency || "BHD",
          exchangeRate: so.exchangeRate || "1.0000",
          baseCurrency: so.baseCurrency || "BHD",
          subtotal,
          taxRate: "0",
          taxAmount: 0,
          discountPercentage: "0",
          discountAmount: 0,
          totalAmount: subtotal,
          paidAmount: 0,
          outstandingAmount: subtotal,
          subtotalBase: subtotal,
          taxAmountBase: 0,
          discountAmountBase: 0,
          totalAmountBase: subtotal,
          autoGenerated: true,
          generatedFromDeliveryId: deliveryId,
          createdBy: userId || null,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        console.log(`[DEBUG] Inserting invoice with customerId: ${invoiceInsert.customerId}`);
        let invoice;
        try {
          const inserted = await db.insert(invoices).values(invoiceInsert).returning();
          invoice = inserted[0];
          console.log(`[DEBUG] Invoice created successfully: ${invoice.id}`);
        } catch (err) {
          console.log(`[DEBUG] Invoice creation failed:`, err);
          console.log(`[DEBUG] Error code: ${err?.code}`);
          console.log(`[DEBUG] Error detail: ${err?.detail}`);
          console.log(`[DEBUG] Error message: ${err?.message}`);
          console.log(`[DEBUG] Invoice data being inserted:`, JSON.stringify(invoiceInsert, null, 2));
          if (err?.code === "23503") {
            if (String(err?.detail || "").includes("created_by")) {
              console.log(`[DEBUG] Retrying with null createdBy`);
              const inserted = await db.insert(invoices).values({ ...invoiceInsert, createdBy: null }).returning();
              invoice = inserted[0];
              console.log(`[DEBUG] Invoice created with null createdBy: ${invoice.id}`);
            } else if (String(err?.detail || "").includes("customer_id")) {
              throw new Error(`Invalid customer ID: ${invoiceInsert.customerId}. Customer not found. Please ensure the sales order has a valid customer assigned.`);
            } else if (String(err?.detail || "").includes("sales_order_id")) {
              throw new Error(`Invalid sales order ID: ${invoiceInsert.salesOrderId}. Sales order not found. Please ensure the delivery is properly linked to a valid sales order.`);
            } else if (String(err?.detail || "").includes("delivery_id")) {
              throw new Error(`Invalid delivery ID: ${invoiceInsert.deliveryId}. Delivery not found.`);
            } else {
              throw new Error(`Database constraint violation: ${err?.detail || err?.message}`);
            }
          } else if (err?.code === "23505") {
            throw new Error(`Invoice number ${invoiceInsert.invoiceNumber} already exists. Please try again.`);
          } else {
            throw new Error(`Database error: ${err?.message || "Unknown error occurred"}`);
          }
        }
        console.log(`[DEBUG] Updating invoice items with invoice ID: ${invoice.id}`);
        for (const it of invoiceItemsToInsert) it.invoiceId = invoice.id;
        if (invoiceItemsToInsert.length) {
          try {
            console.log(`[DEBUG] Inserting ${invoiceItemsToInsert.length} invoice items`);
            await db.insert(invoiceItems).values(invoiceItemsToInsert).returning();
            console.log(`[DEBUG] Invoice items inserted successfully`);
          } catch (err) {
            console.log(`[DEBUG] Invoice items insertion failed:`, err);
            console.log(`[DEBUG] Error code: ${err?.code}`);
            console.log(`[DEBUG] Error detail: ${err?.detail}`);
            console.log(`[DEBUG] Error message: ${err?.message}`);
            console.log(`[DEBUG] Full error:`, JSON.stringify(err, null, 2));
            if (err?.code === "23503") {
              if (String(err?.detail || "").includes("invoice_id")) {
                throw new Error(`Invalid invoice ID for items. Invoice may not have been created properly.`);
              } else if (String(err?.detail || "").includes("item_id")) {
                throw new Error(`Invalid item ID in invoice items. One or more items not found.`);
              } else {
                throw new Error(`Database constraint violation in invoice items: ${err?.detail || err?.message}`);
              }
            } else {
              throw new Error(`Database error inserting invoice items: ${err?.message || "Unknown error occurred"}`);
            }
          }
        }
        console.log(`[DEBUG] Invoice generation completed successfully`);
        return invoice;
      }
      async generateProformaInvoice(salesOrderId, userId) {
        const salesOrder = await db.select().from(salesOrders).where(eq19(salesOrders.id, salesOrderId)).limit(1);
        if (!salesOrder.length) {
          throw new Error("Sales order not found");
        }
        const invoiceNumber = this.generateNumber("PFINV");
        const record = {
          invoiceNumber,
          invoiceType: "Proforma",
          salesOrderId,
          customerId: salesOrder[0].customerId,
          status: "Draft",
          currency: salesOrder[0].currency || "BHD",
          exchangeRate: salesOrder[0].exchangeRate || "1.0000",
          baseCurrency: salesOrder[0].baseCurrency || "BHD",
          subtotal: 0,
          taxRate: "0",
          taxAmount: 0,
          discountPercentage: "0",
          discountAmount: 0,
          totalAmount: 0,
          paidAmount: 0,
          outstandingAmount: 0,
          subtotalBase: 0,
          taxAmountBase: 0,
          discountAmountBase: 0,
          totalAmountBase: 0,
          autoGenerated: true,
          createdBy: userId || null,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        try {
          const inserted = await db.insert(invoices).values(record).returning();
          return inserted[0];
        } catch (err) {
          if (err?.code === "23503" && String(err?.detail || "").includes("created_by")) {
            const inserted = await db.insert(invoices).values({ ...record, createdBy: null }).returning();
            return inserted[0];
          }
          throw err;
        }
      }
      async sendInvoice(invoiceId, email, userId) {
        const updated = await this.updateInvoice(invoiceId, { status: "Sent" });
        return {
          message: "Invoice marked as sent",
          invoice: updated,
          email: email || null
        };
      }
      async markInvoicePaid(invoiceId, paidAmount, paymentMethod, paymentReference, userId) {
        const inv = await this.getInvoice(invoiceId);
        if (!inv) throw new Error("Invoice not found");
        const newPaid = num(inv.paidAmount) + paidAmount;
        const outstanding = Math.max(0, num(inv.totalAmount) - newPaid);
        const status = outstanding === 0 ? "Paid" : inv.status;
        return this.updateInvoice(invoiceId, { paidAmount: newPaid, outstandingAmount: outstanding, status });
      }
      // Items
      async getInvoiceItems(invoiceId) {
        return db.select().from(invoiceItems).where(eq19(invoiceItems.invoiceId, invoiceId));
      }
      async getInvoiceItem(id) {
        const r = await db.select().from(invoiceItems).where(eq19(invoiceItems.id, id)).limit(1);
        return r[0];
      }
      async createInvoiceItem(item) {
        const r = await db.insert(invoiceItems).values(item).returning();
        return r[0];
      }
      async updateInvoiceItem(id, item) {
        const r = await db.update(invoiceItems).set({ ...item, updatedAt: /* @__PURE__ */ new Date() }).where(eq19(invoiceItems.id, id)).returning();
        return r[0];
      }
      async deleteInvoiceItem(id) {
        await db.delete(invoiceItems).where(eq19(invoiceItems.id, id));
      }
      async bulkCreateInvoiceItems(itemsArr) {
        if (!itemsArr.length) return [];
        return await db.insert(invoiceItems).values(itemsArr).returning();
      }
      // Currency helpers (VERY simplified placeholder FX logic)
      async getExchangeRate(fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return 1;
        return 1;
      }
      async convertCurrency(amount, fromCurrency, toCurrency, exchangeRate) {
        const rate = exchangeRate || await this.getExchangeRate(fromCurrency, toCurrency);
        return amount * rate;
      }
      async updateInvoiceCurrency(invoiceId, newCurrency, exchangeRate, userId) {
        const inv = await this.getInvoice(invoiceId);
        if (!inv) throw new Error("Invoice not found");
        const subtotalBase = await this.convertCurrency(num(inv.subtotal), inv.currency, newCurrency, exchangeRate);
        const taxAmountBase = await this.convertCurrency(num(inv.taxAmount), inv.currency, newCurrency, exchangeRate);
        const discountAmountBase = await this.convertCurrency(num(inv.discountAmount), inv.currency, newCurrency, exchangeRate);
        const totalAmountBase = await this.convertCurrency(num(inv.totalAmount), inv.currency, newCurrency, exchangeRate);
        return this.updateInvoice(invoiceId, { currency: newCurrency, exchangeRate, subtotalBase, taxAmountBase, discountAmountBase, totalAmountBase });
      }
    };
  }
});

// server/storage/physical-stock-storage.ts
import { eq as eq20, and as and16, desc as desc15, asc as asc4, sql as sql13 } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { nanoid as nanoid5 } from "nanoid";
var PhysicalStockStorage;
var init_physical_stock_storage = __esm({
  "server/storage/physical-stock-storage.ts"() {
    "use strict";
    init_base();
    init_db();
    init_schema();
    PhysicalStockStorage = class _PhysicalStockStorage extends BaseStorage {
      async createPhysicalStockItem({ itemId, location, quantity, lastUpdated, countedBy, notes }) {
        const [newItem] = await db.insert(physicalStock).values({
          itemId,
          location,
          quantity,
          lastUpdated: new Date(lastUpdated),
          countedBy,
          notes
        }).returning();
        await this.logAuditEvent(
          "physical_stock",
          newItem.id,
          "created",
          countedBy,
          null,
          newItem
        );
        return newItem;
      }
      // === PHYSICAL STOCK ITEMS ===
      async getAllPhysicalStockItems() {
        return await db.select().from(physicalStock);
      }
      async updatePhysicalStockItem(id, data) {
        const [oldItem] = await db.select().from(physicalStock).where(eq20(physicalStock.id, id)).limit(1);
        if (!oldItem) return null;
        const updateData = { ...data };
        if (data.lastUpdated) {
          updateData.lastUpdated = new Date(data.lastUpdated);
        }
        const [updated] = await db.update(physicalStock).set(updateData).where(eq20(physicalStock.id, id)).returning();
        await this.logAuditEvent("physical_stock", id, "updated", data.countedBy, oldItem, updated);
        return updated;
      }
      async deletePhysicalStockItem(id, userId) {
        const [oldItem] = await db.select().from(physicalStock).where(eq20(physicalStock.id, id)).limit(1);
        if (!oldItem) return false;
        await db.delete(physicalStock).where(eq20(physicalStock.id, id));
        await this.logAuditEvent("physical_stock", id, "deleted", userId, oldItem, null);
        return true;
      }
      // === PHYSICAL STOCK COUNTS ===
      async createPhysicalStockCount(data) {
        const countNumber = this.generateNumber("PSC");
        const [physicalStockCount] = await db.insert(physicalStockCounts).values({
          ...data,
          countNumber
        }).returning();
        await this.logAuditEvent(
          "physical_stock_count",
          physicalStockCount.id,
          "created",
          data.createdBy || void 0,
          null,
          physicalStockCount
        );
        return physicalStockCount;
      }
      // Aliases for user joins
      static startedByUser = alias(users, "startedByUser");
      static completedByUser = alias(users, "completedByUser");
      static createdByUser = alias(users, "createdByUser");
      async getPhysicalStockCounts(limit, offset) {
        const startedByUser = _PhysicalStockStorage.startedByUser;
        const completedByUser = _PhysicalStockStorage.completedByUser;
        const createdByUser = _PhysicalStockStorage.createdByUser;
        let query = db.select({
          id: physicalStockCounts.id,
          countNumber: physicalStockCounts.countNumber,
          description: physicalStockCounts.description,
          countDate: physicalStockCounts.countDate,
          storageLocation: physicalStockCounts.storageLocation,
          countType: physicalStockCounts.countType,
          status: physicalStockCounts.status,
          scheduledDate: physicalStockCounts.scheduledDate,
          startedBy: physicalStockCounts.startedBy,
          startedAt: physicalStockCounts.startedAt,
          completedBy: physicalStockCounts.completedBy,
          completedAt: physicalStockCounts.completedAt,
          approvedBy: physicalStockCounts.approvedBy,
          approvedAt: physicalStockCounts.approvedAt,
          totalItemsExpected: physicalStockCounts.totalItemsExpected,
          totalItemsCounted: physicalStockCounts.totalItemsCounted,
          totalDiscrepancies: physicalStockCounts.totalDiscrepancies,
          notes: physicalStockCounts.notes,
          createdBy: physicalStockCounts.createdBy,
          createdAt: physicalStockCounts.createdAt,
          updatedAt: physicalStockCounts.updatedAt,
          // User details
          startedByUser: {
            id: startedByUser.id,
            firstName: startedByUser.firstName,
            lastName: startedByUser.lastName
          },
          completedByUser: {
            id: completedByUser.id,
            firstName: completedByUser.firstName,
            lastName: completedByUser.lastName
          },
          createdByUser: {
            id: createdByUser.id,
            firstName: createdByUser.firstName,
            lastName: createdByUser.lastName
          }
        }).from(physicalStockCounts).leftJoin(startedByUser, eq20(physicalStockCounts.startedBy, startedByUser.id)).leftJoin(completedByUser, eq20(physicalStockCounts.completedBy, completedByUser.id)).leftJoin(createdByUser, eq20(physicalStockCounts.createdBy, createdByUser.id)).orderBy(desc15(physicalStockCounts.createdAt));
        if (typeof limit === "number" && typeof offset === "number") {
          return await query.limit(limit).offset(offset);
        } else if (typeof limit === "number") {
          return await query.limit(limit);
        }
        return await query;
      }
      async getPhysicalStockCountById(id) {
        const [physicalStockCount] = await db.select().from(physicalStockCounts).where(eq20(physicalStockCounts.id, id)).limit(1);
        return physicalStockCount || null;
      }
      async getPhysicalStockCountByNumber(countNumber) {
        const [physicalStockCount] = await db.select().from(physicalStockCounts).where(eq20(physicalStockCounts.countNumber, countNumber)).limit(1);
        return physicalStockCount || null;
      }
      async updatePhysicalStockCount(id, data, userId) {
        const oldData = await this.getPhysicalStockCountById(id);
        if (!oldData) return null;
        const [updated] = await db.update(physicalStockCounts).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq20(physicalStockCounts.id, id)).returning();
        await this.logAuditEvent(
          "physical_stock_count",
          id,
          "updated",
          userId,
          oldData,
          updated
        );
        return updated;
      }
      async deletePhysicalStockCount(id, userId) {
        const oldData = await this.getPhysicalStockCountById(id);
        if (!oldData) return false;
        await db.delete(physicalStockCounts).where(eq20(physicalStockCounts.id, id));
        await this.logAuditEvent(
          "physical_stock_count",
          id,
          "deleted",
          userId,
          oldData,
          null
        );
        return true;
      }
      // === PHYSICAL STOCK COUNT ITEMS ===
      async createPhysicalStockCountItem(data) {
        const [countItem] = await db.insert(physicalStockCountItems).values(data).returning();
        return countItem;
      }
      async getPhysicalStockCountItems(physicalStockCountId) {
        return await db.select({
          id: physicalStockCountItems.id,
          physicalStockCountId: physicalStockCountItems.physicalStockCountId,
          inventoryItemId: physicalStockCountItems.inventoryItemId,
          lineNumber: physicalStockCountItems.lineNumber,
          supplierCode: physicalStockCountItems.supplierCode,
          barcode: physicalStockCountItems.barcode,
          description: physicalStockCountItems.description,
          storageLocation: physicalStockCountItems.storageLocation,
          systemQuantity: physicalStockCountItems.systemQuantity,
          reservedQuantity: physicalStockCountItems.reservedQuantity,
          availableQuantity: physicalStockCountItems.availableQuantity,
          firstCountQuantity: physicalStockCountItems.firstCountQuantity,
          firstCountBy: physicalStockCountItems.firstCountBy,
          firstCountAt: physicalStockCountItems.firstCountAt,
          secondCountQuantity: physicalStockCountItems.secondCountQuantity,
          secondCountBy: physicalStockCountItems.secondCountBy,
          secondCountAt: physicalStockCountItems.secondCountAt,
          finalCountQuantity: physicalStockCountItems.finalCountQuantity,
          variance: physicalStockCountItems.variance,
          varianceValue: physicalStockCountItems.varianceValue,
          status: physicalStockCountItems.status,
          requiresRecount: physicalStockCountItems.requiresRecount,
          discrepancyReason: physicalStockCountItems.discrepancyReason,
          adjustmentRequired: physicalStockCountItems.adjustmentRequired,
          adjustmentApplied: physicalStockCountItems.adjustmentApplied,
          adjustmentAppliedBy: physicalStockCountItems.adjustmentAppliedBy,
          adjustmentAppliedAt: physicalStockCountItems.adjustmentAppliedAt,
          notes: physicalStockCountItems.notes,
          createdAt: physicalStockCountItems.createdAt,
          updatedAt: physicalStockCountItems.updatedAt,
          // Inventory item details
          inventoryItem: {
            id: inventoryItems.id,
            supplierCode: inventoryItems.supplierCode,
            description: inventoryItems.description,
            category: inventoryItems.category,
            unitOfMeasure: inventoryItems.unitOfMeasure,
            barcode: inventoryItems.barcode
          },
          // Current stock level
          currentStock: {
            quantityAvailable: inventoryLevels.quantityAvailable,
            quantityReserved: inventoryLevels.quantityReserved,
            storageLocation: inventoryLevels.storageLocation
          }
        }).from(physicalStockCountItems).leftJoin(inventoryItems, eq20(physicalStockCountItems.inventoryItemId, inventoryItems.id)).leftJoin(inventoryLevels, eq20(physicalStockCountItems.inventoryItemId, inventoryLevels.inventoryItemId)).where(eq20(physicalStockCountItems.physicalStockCountId, physicalStockCountId)).orderBy(asc4(physicalStockCountItems.lineNumber));
      }
      async updatePhysicalStockCountItem(id, data) {
        const [updated] = await db.update(physicalStockCountItems).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq20(physicalStockCountItems.id, id)).returning();
        return updated || null;
      }
      async populatePhysicalStockCountItems(physicalStockCountId, storageLocation) {
        const whereClauses = [eq20(inventoryItems.isActive, true)];
        if (storageLocation) {
          whereClauses.push(eq20(inventoryLevels.storageLocation, storageLocation));
        }
        const inventoryData = await db.select({
          inventoryItemId: inventoryItems.id,
          supplierCode: inventoryItems.supplierCode,
          barcode: inventoryItems.barcode,
          description: inventoryItems.description,
          storageLocation: inventoryLevels.storageLocation,
          quantityAvailable: inventoryLevels.quantityAvailable,
          quantityReserved: inventoryLevels.quantityReserved
        }).from(inventoryItems).leftJoin(inventoryLevels, eq20(inventoryItems.id, inventoryLevels.inventoryItemId)).where(and16(...whereClauses));
        let lineNumber = 1;
        const itemsToInsert = inventoryData.map((item) => ({
          physicalStockCountId,
          inventoryItemId: item.inventoryItemId,
          lineNumber: lineNumber++,
          supplierCode: item.supplierCode,
          barcode: item.barcode || "",
          description: item.description,
          storageLocation: item.storageLocation || storageLocation || "",
          systemQuantity: item.quantityAvailable || 0,
          reservedQuantity: item.quantityReserved || 0,
          availableQuantity: (item.quantityAvailable || 0) - (item.quantityReserved || 0),
          variance: 0,
          varianceValue: "0",
          status: "Pending"
        }));
        if (itemsToInsert.length > 0) {
          await db.insert(physicalStockCountItems).values(itemsToInsert);
          await db.update(physicalStockCounts).set({
            totalItemsExpected: itemsToInsert.length,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq20(physicalStockCounts.id, physicalStockCountId));
        }
        return itemsToInsert.length;
      }
      // === SCANNING SESSIONS ===
      async createScanningSession(data) {
        const [session2] = await db.insert(physicalStockScanningSessions).values(data).returning();
        return session2;
      }
      async getScanningSessionsByCountId(physicalStockCountId) {
        return await db.select().from(physicalStockScanningSessions).where(eq20(physicalStockScanningSessions.physicalStockCountId, physicalStockCountId)).orderBy(desc15(physicalStockScanningSessions.createdAt));
      }
      async updateScanningSession(id, data) {
        const [updated] = await db.update(physicalStockScanningSessions).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq20(physicalStockScanningSessions.id, id)).returning();
        return updated || null;
      }
      // === SCANNED ITEMS ===
      async createScannedItem(data) {
        const [scannedItem] = await db.insert(physicalStockScannedItems).values(data).returning();
        await db.update(physicalStockScanningSessions).set({
          totalScansCompleted: sql13`${physicalStockScanningSessions.totalScansCompleted} + 1`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq20(physicalStockScanningSessions.id, data.scanningSessionId));
        return scannedItem;
      }
      async getScannedItemsBySession(scanningSessionId) {
        return await db.select({
          id: physicalStockScannedItems.id,
          scanningSessionId: physicalStockScannedItems.scanningSessionId,
          physicalStockCountItemId: physicalStockScannedItems.physicalStockCountItemId,
          inventoryItemId: physicalStockScannedItems.inventoryItemId,
          barcode: physicalStockScannedItems.barcode,
          supplierCode: physicalStockScannedItems.supplierCode,
          quantityScanned: physicalStockScannedItems.quantityScanned,
          storageLocation: physicalStockScannedItems.storageLocation,
          scannedBy: physicalStockScannedItems.scannedBy,
          scannedAt: physicalStockScannedItems.scannedAt,
          verified: physicalStockScannedItems.verified,
          verifiedBy: physicalStockScannedItems.verifiedBy,
          verifiedAt: physicalStockScannedItems.verifiedAt,
          notes: physicalStockScannedItems.notes,
          createdAt: physicalStockScannedItems.createdAt,
          // Inventory item details
          inventoryItem: {
            id: inventoryItems.id,
            description: inventoryItems.description,
            supplierCode: inventoryItems.supplierCode
          }
        }).from(physicalStockScannedItems).leftJoin(inventoryItems, eq20(physicalStockScannedItems.inventoryItemId, inventoryItems.id)).where(eq20(physicalStockScannedItems.scanningSessionId, scanningSessionId)).orderBy(desc15(physicalStockScannedItems.scannedAt));
      }
      async processBarcodeScan(scanningSessionId, barcode, scannedBy, quantity = 1, storageLocation) {
        const [inventoryItem2] = await db.select().from(inventoryItems).where(eq20(inventoryItems.barcode, barcode)).limit(1);
        if (!inventoryItem2) {
          return { success: false, message: "Item not found with this barcode" };
        }
        const [countItem] = await db.select().from(physicalStockCountItems).leftJoin(physicalStockScanningSessions, eq20(physicalStockCountItems.physicalStockCountId, physicalStockScanningSessions.physicalStockCountId)).where(
          and16(
            eq20(physicalStockScanningSessions.id, scanningSessionId),
            eq20(physicalStockCountItems.inventoryItemId, inventoryItem2.id)
          )
        ).limit(1);
        if (!countItem) {
          return { success: false, message: "Item not included in this physical stock count" };
        }
        const scannedItem = await this.createScannedItem({
          scanningSessionId,
          physicalStockCountItemId: countItem.physical_stock_count_items.id,
          inventoryItemId: inventoryItem2.id,
          barcode,
          supplierCode: inventoryItem2.supplierCode,
          quantityScanned: quantity,
          storageLocation: storageLocation || "",
          scannedBy
        });
        return { success: true, message: "Item scanned successfully", scannedItem };
      }
      // === PHYSICAL STOCK ADJUSTMENTS ===
      async createPhysicalStockAdjustment(data) {
        const adjustmentNumber = this.generateNumber("PSA");
        const [adjustment] = await db.insert(physicalStockAdjustments).values({
          ...data,
          adjustmentNumber
        }).returning();
        return adjustment;
      }
      async generateAdjustmentsFromCount(physicalStockCountId, createdBy) {
        const discrepancyItems = await db.select().from(physicalStockCountItems).where(
          and16(
            eq20(physicalStockCountItems.physicalStockCountId, physicalStockCountId),
            eq20(physicalStockCountItems.adjustmentRequired, true),
            eq20(physicalStockCountItems.adjustmentApplied, false)
          )
        );
        if (discrepancyItems.length === 0) {
          return null;
        }
        const totalAdjustmentValue = discrepancyItems.reduce((sum4, item) => {
          return sum4 + parseFloat(item.varianceValue || "0");
        }, 0);
        const adjustment = await this.createPhysicalStockAdjustment({
          physicalStockCountId,
          totalAdjustmentValue: totalAdjustmentValue.toString(),
          reason: "Physical stock count variance adjustment",
          createdBy
        });
        const adjustmentItems = discrepancyItems.map((item) => ({
          adjustmentId: adjustment.id,
          physicalStockCountItemId: item.id,
          inventoryItemId: item.inventoryItemId,
          supplierCode: item.supplierCode,
          description: item.description,
          storageLocation: item.storageLocation || "",
          systemQuantity: item.systemQuantity || 0,
          physicalQuantity: item.finalCountQuantity || 0,
          adjustmentQuantity: item.variance || 0,
          adjustmentValue: item.varianceValue || "0",
          reason: item.discrepancyReason
        }));
        if (adjustmentItems.length > 0) {
          await db.insert(physicalStockAdjustmentItems).values(adjustmentItems);
        }
        return adjustment;
      }
      async applyPhysicalStockAdjustment(adjustmentId, appliedBy) {
        const [adjustment] = await db.select().from(physicalStockAdjustments).where(eq20(physicalStockAdjustments.id, adjustmentId)).limit(1);
        if (!adjustment || adjustment.status !== "Draft") {
          return false;
        }
        const adjustmentItems = await db.select().from(physicalStockAdjustmentItems).where(eq20(physicalStockAdjustmentItems.adjustmentId, adjustmentId));
        for (const item of adjustmentItems) {
          await db.update(inventoryLevels).set({
            quantityAvailable: sql13`${inventoryLevels.quantityAvailable} + ${item.adjustmentQuantity}`,
            lastUpdated: /* @__PURE__ */ new Date()
          }).where(eq20(inventoryLevels.inventoryItemId, item.inventoryItemId));
          await db.insert(stockMovements).values({
            id: nanoid5(),
            itemId: item.inventoryItemId,
            movementType: item.adjustmentQuantity > 0 ? "Adjustment In" : "Adjustment Out",
            referenceType: "PhysicalStockAdjustment",
            referenceId: adjustmentId,
            storageLocation: item.storageLocation,
            quantityBefore: item.systemQuantity,
            quantityMoved: Math.abs(item.adjustmentQuantity),
            quantityAfter: item.systemQuantity + item.adjustmentQuantity,
            unitCost: item.unitCost,
            totalValue: item.adjustmentValue,
            notes: `Physical stock count adjustment: ${item.reason}`,
            createdBy: appliedBy
          });
          await db.update(physicalStockCountItems).set({
            adjustmentApplied: true,
            adjustmentAppliedBy: appliedBy,
            adjustmentAppliedAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq20(physicalStockCountItems.id, item.physicalStockCountItemId));
        }
        await db.update(physicalStockAdjustments).set({
          status: "Applied",
          appliedBy,
          appliedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq20(physicalStockAdjustments.id, adjustmentId));
        return true;
      }
      // === SUMMARY FUNCTIONS ===
      async getPhysicalStockCountSummary(physicalStockCountId) {
        const countSummary = await db.select({
          totalItems: sql13`count(*)`,
          pendingItems: sql13`count(*) filter (where ${physicalStockCountItems.status} = 'Pending')`,
          countedItems: sql13`count(*) filter (where ${physicalStockCountItems.status} = 'Counted')`,
          verifiedItems: sql13`count(*) filter (where ${physicalStockCountItems.status} = 'Verified')`,
          discrepancyItems: sql13`count(*) filter (where ${physicalStockCountItems.status} = 'Discrepancy')`,
          adjustedItems: sql13`count(*) filter (where ${physicalStockCountItems.adjustmentApplied} = true)`,
          totalVarianceValue: sql13`coalesce(sum(${physicalStockCountItems.varianceValue}), 0)`
        }).from(physicalStockCountItems).where(eq20(physicalStockCountItems.physicalStockCountId, physicalStockCountId));
        return countSummary[0] || {
          totalItems: 0,
          pendingItems: 0,
          countedItems: 0,
          verifiedItems: 0,
          discrepancyItems: 0,
          adjustedItems: 0,
          totalVarianceValue: "0"
        };
      }
      async finalizePhysicalStockCount(physicalStockCountId, completedBy) {
        const countItems = await db.select().from(physicalStockCountItems).where(eq20(physicalStockCountItems.physicalStockCountId, physicalStockCountId));
        for (const item of countItems) {
          const finalCount = item.secondCountQuantity || item.firstCountQuantity || 0;
          const variance = finalCount - (item.systemQuantity || 0);
          const requiresAdjustment = Math.abs(variance) > 0;
          await db.update(physicalStockCountItems).set({
            finalCountQuantity: finalCount,
            variance,
            status: Math.abs(variance) > 0 ? "Discrepancy" : "Verified",
            adjustmentRequired: requiresAdjustment,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq20(physicalStockCountItems.id, item.id));
        }
        const summary = await this.getPhysicalStockCountSummary(physicalStockCountId);
        await db.update(physicalStockCounts).set({
          status: "Completed",
          completedBy,
          completedAt: /* @__PURE__ */ new Date(),
          totalItemsCounted: summary.totalItems,
          totalDiscrepancies: summary.discrepancyItems,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq20(physicalStockCounts.id, physicalStockCountId));
        return true;
      }
    };
  }
});

// server/storage/modular-storage-clean.ts
var ModularStorage;
var init_modular_storage_clean = __esm({
  "server/storage/modular-storage-clean.ts"() {
    "use strict";
    init_user_storage();
    init_customer_storage();
    init_supplier_storage();
    init_item_storage();
    init_inventory_storage();
    init_enquiry_storage();
    init_requisition_storage();
    init_audit_storage();
    init_quotation_storage();
    init_delivery_storage();
    init_shipment_storage();
    init_sales_order_storage();
    init_purchase_order_storage();
    init_acceptance_storage();
    init_goods_receipt_storage();
    init_supplier_lpo_storage();
    init_invoice_storage();
    init_physical_stock_storage();
    init_base();
    ModularStorage = class extends BaseStorage {
      // ...existing code...
      userStorage;
      customerStorage;
      supplierStorage;
      itemStorage;
      inventoryStorage;
      enquiryStorage;
      requisitionStorage;
      auditStorage;
      quotationStorage;
      deliveryStorage;
      shipmentStorage;
      salesOrderStorage;
      purchaseOrderStorage;
      acceptanceStorage;
      goodsReceiptStorage;
      supplierLpoStorage;
      invoiceStorage;
      physicalStockStorage;
      constructor() {
        super();
        this.userStorage = new UserStorage();
        this.customerStorage = new CustomerStorage();
        this.supplierStorage = new SupplierStorage();
        this.itemStorage = new ItemStorage();
        this.inventoryStorage = new InventoryStorage();
        this.enquiryStorage = new EnquiryStorage();
        this.requisitionStorage = new RequisitionStorage();
        this.auditStorage = new AuditStorage();
        this.quotationStorage = new QuotationStorage();
        this.deliveryStorage = new DeliveryStorage();
        this.shipmentStorage = new ShipmentStorage();
        this.salesOrderStorage = new SalesOrderStorage();
        this.purchaseOrderStorage = new PurchaseOrderStorage();
        this.acceptanceStorage = new AcceptanceStorage();
        this.goodsReceiptStorage = new GoodsReceiptStorage();
        this.supplierLpoStorage = new SupplierLpoStorage();
        this.invoiceStorage = new InvoiceStorage();
        this.physicalStockStorage = new PhysicalStockStorage();
        return new Proxy(this, {
          get(target, prop, receiver) {
            if (prop in target) {
              return Reflect.get(target, prop, receiver);
            }
            return () => {
              throw new Error(`Method '${String(prop)}' not yet implemented in modular storage. Please implement it in the appropriate storage module.`);
            };
          }
        });
      }
      // User operations - delegate to UserStorage
      async getUser(id) {
        return this.userStorage.getUser(id);
      }
      async createUser(user) {
        return this.userStorage.createUser(user);
      }
      // Customer operations - delegate to CustomerStorage
      async getCustomers(limit, offset, filters) {
        return this.customerStorage.getCustomers(limit, offset, filters);
      }
      async getCustomer(id) {
        return this.customerStorage.getCustomer(id);
      }
      async getCustomersCount(filters) {
        return this.customerStorage.getCustomersCount(filters);
      }
      async createCustomer(customer) {
        return this.customerStorage.createCustomer(customer);
      }
      async updateCustomer(id, customer) {
        return this.customerStorage.updateCustomer(id, customer);
      }
      async getCustomerDetails(id) {
        return this.customerStorage.getCustomerDetails(id);
      }
      async getCustomerTransactionSummary(customerId) {
        return this.customerStorage.getCustomerTransactionSummary(customerId);
      }
      async getCustomerRecentActivities(customerId, limit) {
        return this.customerStorage.getCustomerRecentActivities(customerId, limit);
      }
      async getCustomerPerformanceMetrics(customerId) {
        return this.customerStorage.getCustomerPerformanceMetrics(customerId);
      }
      // Supplier operations - delegate to SupplierStorage
      async getSuppliers() {
        return this.supplierStorage.getSuppliers();
      }
      async getSupplier(id) {
        return this.supplierStorage.getSupplier(id);
      }
      async createSupplier(supplier) {
        return this.supplierStorage.createSupplier(supplier);
      }
      async updateSupplier(id, supplier) {
        return this.supplierStorage.updateSupplier(id, supplier);
      }
      async deleteSupplier(id) {
        return this.supplierStorage.deleteSupplier(id);
      }
      // Enhanced supplier detail methods
      async getSupplierDetails(id) {
        return this.supplierStorage.getSupplierDetails(id);
      }
      async getSupplierLposForDetail(supplierId, page, limit) {
        return this.supplierStorage.getSupplierLposForDetail(supplierId, page, limit);
      }
      async getSupplierItems(supplierId, page, limit) {
        return this.supplierStorage.getSupplierItems(supplierId, page, limit);
      }
      async getSupplierGoodsReceipts(supplierId, page, limit) {
        return this.supplierStorage.getSupplierGoodsReceipts(supplierId, page, limit);
      }
      async getSupplierPerformanceMetrics(supplierId) {
        return this.supplierStorage.getSupplierPerformanceMetrics(supplierId);
      }
      // Item operations - delegate to ItemStorage
      async getItems() {
        return this.itemStorage.getItems();
      }
      async getItem(id) {
        return this.itemStorage.getItem(id);
      }
      async getItemByBarcode(barcode) {
        return this.itemStorage.getItemByBarcode(barcode);
      }
      async createItem(item) {
        return this.itemStorage.createItem(item);
      }
      // Enquiry operations - delegate to EnquiryStorage
      async getEnquiries(limit, offset, filters) {
        return this.enquiryStorage.getEnquiries(limit, offset, filters);
      }
      async getEnquiry(id) {
        return this.enquiryStorage.getEnquiry(id);
      }
      async createEnquiry(enquiry) {
        return this.enquiryStorage.createEnquiry(enquiry);
      }
      async updateEnquiry(id, enquiry) {
        return this.enquiryStorage.updateEnquiry(id, enquiry);
      }
      async deleteEnquiry(id) {
        return this.enquiryStorage.deleteEnquiry(id);
      }
      async getEnquiryItems(enquiryId) {
        return this.enquiryStorage.getEnquiryItems(enquiryId);
      }
      async getEnquiryItem(id) {
        return this.enquiryStorage.getEnquiryItem(id);
      }
      async createEnquiryItem(enquiryItem) {
        return this.enquiryStorage.createEnquiryItem(enquiryItem);
      }
      async updateEnquiryItem(id, enquiryItem) {
        return this.enquiryStorage.updateEnquiryItem(id, enquiryItem);
      }
      async deleteEnquiryItem(id) {
        return this.enquiryStorage.deleteEnquiryItem(id);
      }
      // Requisition operations - delegate to RequisitionStorage
      async getRequisitions(limit, offset, filters) {
        return this.requisitionStorage.getRequisitions(limit, offset, filters);
      }
      async getRequisition(id) {
        return this.requisitionStorage.getRequisition(id);
      }
      async getRequisitionByNumber(requisitionNumber) {
        return this.requisitionStorage.getRequisitionByNumber(requisitionNumber);
      }
      async createRequisition(requisition) {
        return this.requisitionStorage.createRequisition(requisition);
      }
      async updateRequisition(id, requisition) {
        return this.requisitionStorage.updateRequisition(id, requisition);
      }
      async deleteRequisition(id) {
        return this.requisitionStorage.deleteRequisition(id);
      }
      async getRequisitionItems(requisitionId) {
        return this.requisitionStorage.getRequisitionItems(requisitionId);
      }
      async createRequisitionItem(requisitionItem) {
        return this.requisitionStorage.createRequisitionItem(requisitionItem);
      }
      async updateRequisitionItem(id, requisitionItem) {
        return this.requisitionStorage.updateRequisitionItem(id, requisitionItem);
      }
      async deleteRequisitionItem(id) {
        return this.requisitionStorage.deleteRequisitionItem(id);
      }
      async searchRequisitions(searchTerm) {
        return this.requisitionStorage.searchRequisitions(searchTerm);
      }
      async getRequisitionsCount(filters) {
        return this.requisitionStorage.getRequisitionsCount(filters);
      }
      // Customer Acceptance operations - delegate to AcceptanceStorage
      async getCustomerAcceptances(quotationId) {
        return this.acceptanceStorage.getCustomerAcceptances(quotationId);
      }
      async getCustomerAcceptance(id) {
        return this.acceptanceStorage.getCustomerAcceptance(id);
      }
      async createCustomerAcceptance(acceptance) {
        return this.acceptanceStorage.createCustomerAcceptance(acceptance);
      }
      async updateCustomerAcceptance(id, acceptance) {
        return this.acceptanceStorage.updateCustomerAcceptance(id, acceptance);
      }
      async deleteCustomerAcceptance(id) {
        return this.acceptanceStorage.deleteCustomerAcceptance(id);
      }
      async supersedeActiveAcceptances(quotationId) {
        return this.acceptanceStorage.supersedeActiveAcceptances(quotationId);
      }
      // Quotation Item Acceptance operations
      async getQuotationItemAcceptances(customerAcceptanceId) {
        return this.acceptanceStorage.getQuotationItemAcceptances(customerAcceptanceId);
      }
      async getQuotationItemAcceptance(id) {
        return this.acceptanceStorage.getQuotationItemAcceptance(id);
      }
      async createQuotationItemAcceptance(itemAcceptance) {
        return this.acceptanceStorage.createQuotationItemAcceptance(itemAcceptance);
      }
      async updateQuotationItemAcceptance(id, itemAcceptance) {
        return this.acceptanceStorage.updateQuotationItemAcceptance(id, itemAcceptance);
      }
      async bulkCreateQuotationItemAcceptances(itemAcceptances) {
        return this.acceptanceStorage.bulkCreateQuotationItemAcceptances(itemAcceptances);
      }
      // Acceptance Confirmations
      async getAcceptanceConfirmations(customerAcceptanceId) {
        return this.acceptanceStorage.getAcceptanceConfirmations(customerAcceptanceId);
      }
      async createAcceptanceConfirmation(confirmation) {
        return this.acceptanceStorage.createAcceptanceConfirmation(confirmation);
      }
      async bulkCreateEnquiryItems(enquiryItems3) {
        return this.enquiryStorage.bulkCreateEnquiryItems(enquiryItems3);
      }
      // Quotation operations - delegate to QuotationStorage
      async getQuotations(limit, offset, filters) {
        return this.quotationStorage.getQuotations(limit, offset, filters);
      }
      async getQuotation(id) {
        return this.quotationStorage.getQuotation(id);
      }
      async createQuotation(quotation) {
        return this.quotationStorage.createQuotation(quotation);
      }
      async updateQuotation(id, quotation) {
        return this.quotationStorage.updateQuotation(id, quotation);
      }
      async deleteQuotation(id) {
        return this.quotationStorage.deleteQuotation(id);
      }
      async generateQuotationFromEnquiry(enquiryId, userId) {
        return this.quotationStorage.generateQuotationFromEnquiry(enquiryId, userId);
      }
      async createQuotationRevision(originalId, revisionData, userId) {
        return this.quotationStorage.createQuotationRevision(originalId, revisionData, userId);
      }
      async getQuotationRevisions(originalId) {
        return this.quotationStorage.getQuotationRevisions(originalId);
      }
      async getQuotationHistory(quotationId) {
        return this.quotationStorage.getQuotationHistory(quotationId);
      }
      async getQuotationItems(quotationId) {
        return this.quotationStorage.getQuotationItems(quotationId);
      }
      async createQuotationItem(item) {
        return this.quotationStorage.createQuotationItem(item);
      }
      async updateQuotationItem(id, item) {
        return this.quotationStorage.updateQuotationItem(id, item);
      }
      async deleteQuotationItem(id) {
        return this.quotationStorage.deleteQuotationItem(id);
      }
      async getQuotationApprovals(quotationId) {
        return this.quotationStorage.getQuotationApprovals(quotationId);
      }
      async createQuotationApproval(approval) {
        return this.quotationStorage.createQuotationApproval(approval);
      }
      // Audit operations - delegate to AuditStorage  
      async logAuditEvent(entityType, entityId, action, userId, oldData, newData) {
        return this.auditStorage.logAuditEvent(entityType, entityId, action, userId, oldData, newData);
      }
      // Sales Order operations - delegate to SalesOrderStorage
      async getSalesOrders(limit, offset, filters) {
        return this.salesOrderStorage.getSalesOrders(limit, offset, filters);
      }
      async getSalesOrder(id) {
        return this.salesOrderStorage.getSalesOrder(id);
      }
      async createSalesOrder(salesOrder) {
        return this.salesOrderStorage.createSalesOrder(salesOrder);
      }
      async updateSalesOrder(id, salesOrder) {
        return this.salesOrderStorage.updateSalesOrder(id, salesOrder);
      }
      async deleteSalesOrder(id) {
        return this.salesOrderStorage.deleteSalesOrder(id);
      }
      async createSalesOrderFromQuotation(quotationId, userId) {
        return this.salesOrderStorage.createSalesOrderFromQuotation(quotationId, userId);
      }
      async createAmendedSalesOrder(parentOrderId, reason, userId) {
        return this.salesOrderStorage.createAmendedSalesOrder(parentOrderId, reason, userId);
      }
      async validateCustomerLpo(id, validationData) {
        return this.salesOrderStorage.validateCustomerLpo(id, validationData);
      }
      // Sales Order Item operations
      async getSalesOrderItems(salesOrderId) {
        return this.salesOrderStorage.getSalesOrderItems(salesOrderId);
      }
      async getSalesOrderItem(id) {
        return this.salesOrderStorage.getSalesOrderItem(id);
      }
      async createSalesOrderItem(item) {
        return this.salesOrderStorage.createSalesOrderItem(item);
      }
      async updateSalesOrderItem(id, item) {
        return this.salesOrderStorage.updateSalesOrderItem(id, item);
      }
      async deleteSalesOrderItem(id) {
        return this.salesOrderStorage.deleteSalesOrderItem(id);
      }
      async bulkCreateSalesOrderItems(items3) {
        return this.salesOrderStorage.bulkCreateSalesOrderItems(items3);
      }
      async getApprovalRules() {
        console.warn("getApprovalRules: Using stub implementation - should be moved to ApprovalStorage");
        return [];
      }
      async createApprovalRule(rule) {
        console.warn("createApprovalRule: Using stub implementation - should be moved to ApprovalStorage");
        return { id: "rule-" + Date.now(), ...rule };
      }
      async updateApprovalRule(id, rule) {
        console.warn("updateApprovalRule: Using stub implementation - should be moved to ApprovalStorage");
        return { id, ...rule };
      }
      async deleteApprovalRule(id) {
        console.warn("deleteApprovalRule: Using stub implementation - should be moved to ApprovalStorage");
      }
      async determineRequiredApprovalLevel(quotation) {
        console.warn("determineRequiredApprovalLevel: Using stub implementation - should be moved to ApprovalStorage");
        return null;
      }
      // Supplier LPO operations
      async getSupplierLpos(limit, offset, filters) {
        return this.supplierLpoStorage.getSupplierLpos(limit, offset, filters);
      }
      async getSupplierLposCount(filters) {
        return this.supplierLpoStorage.getSupplierLposCount(filters);
      }
      async getSupplierLpo(id) {
        return this.supplierLpoStorage.getSupplierLpo(id);
      }
      async createSupplierLpo(lpo) {
        return this.supplierLpoStorage.createSupplierLpo(lpo);
      }
      async updateSupplierLpo(id, lpo) {
        return this.supplierLpoStorage.updateSupplierLpo(id, lpo);
      }
      async deleteSupplierLpo(id) {
        return this.supplierLpoStorage.deleteSupplierLpo(id);
      }
      async createSupplierLposFromSalesOrders(salesOrderIds, groupBy, userId, supplierIdOverride) {
        return this.supplierLpoStorage.createSupplierLposFromSalesOrders(salesOrderIds, groupBy, userId, supplierIdOverride);
      }
      async createAmendedSupplierLpo(parentLpoId, reason, amendmentType, userId) {
        return this.supplierLpoStorage.createAmendedSupplierLpo(parentLpoId, reason, amendmentType, userId);
      }
      async submitForApproval(id, userId) {
        return this.supplierLpoStorage.submitForApproval(id, userId);
      }
      async approveSupplierLpo(id, userId, notes) {
        return this.supplierLpoStorage.approveSupplierLpo(id, userId, notes);
      }
      async rejectSupplierLpo(id, userId, notes) {
        return this.supplierLpoStorage.rejectSupplierLpo(id, userId, notes);
      }
      async sendToSupplier(id, userId) {
        return this.supplierLpoStorage.sendToSupplier(id, userId);
      }
      async confirmBySupplier(id, confirmationReference) {
        return this.supplierLpoStorage.confirmBySupplier(id, confirmationReference);
      }
      async updateExpectedDeliveryDate(id, expectedDeliveryDate, userId) {
        return this.supplierLpoStorage.updateExpectedDeliveryDate(id, expectedDeliveryDate, userId);
      }
      async getSupplierLpoBacklog() {
        return this.supplierLpoStorage.getSupplierLpoBacklog();
      }
      async getCustomerOrderBacklog() {
        return this.supplierLpoStorage.getCustomerOrderBacklog();
      }
      async getSupplierLpoItems(lpoId) {
        return this.supplierLpoStorage.getSupplierLpoItems(lpoId);
      }
      async getSupplierLpoItem(id) {
        return this.supplierLpoStorage.getSupplierLpoItem(id);
      }
      async createSupplierLpoItem(item) {
        return this.supplierLpoStorage.createSupplierLpoItem(item);
      }
      async updateSupplierLpoItem(id, item) {
        return this.supplierLpoStorage.updateSupplierLpoItem(id, item);
      }
      async deleteSupplierLpoItem(id) {
        return this.supplierLpoStorage.deleteSupplierLpoItem(id);
      }
      async bulkCreateSupplierLpoItems(items3) {
        return this.supplierLpoStorage.bulkCreateSupplierLpoItems(items3);
      }
      async getPurchaseOrders(quotationId) {
        return this.purchaseOrderStorage.getPurchaseOrders(50, 0, quotationId ? { quotationId } : {});
      }
      async getPurchaseOrder(id) {
        return this.purchaseOrderStorage.getPurchaseOrder(id);
      }
      async createPurchaseOrder(po) {
        return this.purchaseOrderStorage.createPurchaseOrder(po);
      }
      async updatePurchaseOrder(id, po) {
        return this.purchaseOrderStorage.updatePurchaseOrder(id, po);
      }
      async deletePurchaseOrder(id) {
        return this.purchaseOrderStorage.deletePurchaseOrder(id);
      }
      async validatePurchaseOrder(id, validation) {
        return this.purchaseOrderStorage.validatePurchaseOrder(id, validation);
      }
      async getPoLineItems(purchaseOrderId) {
        return this.purchaseOrderStorage.getPoLineItems(purchaseOrderId);
      }
      async createPoLineItem(lineItem) {
        return this.purchaseOrderStorage.createPoLineItem(lineItem);
      }
      async updatePoLineItem(id, lineItem) {
        return this.purchaseOrderStorage.updatePoLineItem(id, lineItem);
      }
      async bulkCreatePoLineItems(lineItems) {
        return this.purchaseOrderStorage.bulkCreatePoLineItems(lineItems);
      }
      async getInventoryItems(filters) {
        return this.inventoryStorage.getInventoryItems(filters);
      }
      async getInventoryItem(id) {
        return this.inventoryStorage.getInventoryItem(id);
      }
      async getInventoryItemBySupplierCode(supplierCode) {
        return this.inventoryStorage.getInventoryItemBySupplierCode(supplierCode);
      }
      async getInventoryItemByBarcode(barcode) {
        return this.inventoryStorage.getInventoryItemByBarcode(barcode);
      }
      async createInventoryItem(itemData) {
        return this.inventoryStorage.createInventoryItem(itemData);
      }
      async updateInventoryItem(id, itemData) {
        return this.inventoryStorage.updateInventoryItem(id, itemData);
      }
      async deleteInventoryItem(id) {
        return this.inventoryStorage.deleteInventoryItem(id);
      }
      async getGoodsReceiptHeaders(filters) {
        return this.goodsReceiptStorage.getGoodsReceiptHeaders?.(filters) ?? [];
      }
      async createGoodsReceiptHeader(receipt) {
        return this.goodsReceiptStorage.createGoodsReceiptHeader(receipt);
      }
      async createGoodsReceiptItem(item) {
        return this.goodsReceiptStorage.createGoodsReceiptItem(item);
      }
      // Delivery Storage Methods
      async getDeliveries(filters) {
        return this.deliveryStorage.getDeliveries(filters);
      }
      async getDelivery(id) {
        return this.deliveryStorage.getDelivery(id);
      }
      async getDeliveryByNumber(deliveryNumber) {
        return this.deliveryStorage.getDeliveryByNumber(deliveryNumber);
      }
      async createDelivery(delivery) {
        return this.deliveryStorage.createDelivery(delivery);
      }
      async updateDelivery(id, delivery) {
        return this.deliveryStorage.updateDelivery(id, delivery);
      }
      async deleteDelivery(id) {
        return this.deliveryStorage.deleteDelivery(id);
      }
      async startDeliveryPicking(deliveryId, userId) {
        return this.deliveryStorage.startDeliveryPicking(deliveryId, userId);
      }
      async completeDeliveryPicking(deliveryId, userId, notes) {
        return this.deliveryStorage.completeDeliveryPicking(deliveryId, userId, notes);
      }
      async confirmDelivery(deliveryId, confirmedBy, signature) {
        return this.deliveryStorage.confirmDelivery(deliveryId, confirmedBy, signature);
      }
      // Delivery Item operations
      async getDeliveryItems(deliveryId) {
        return this.deliveryStorage.getDeliveryItems(deliveryId);
      }
      async getDeliveryItem(id) {
        return this.deliveryStorage.getDeliveryItem(id);
      }
      async createDeliveryItem(item) {
        return this.deliveryStorage.createDeliveryItem(item);
      }
      async updateDeliveryItem(id, item) {
        return this.deliveryStorage.updateDeliveryItem(id, item);
      }
      async deleteDeliveryItem(id) {
        return this.deliveryStorage.deleteDeliveryItem(id);
      }
      async bulkCreateDeliveryItems(items3) {
        return this.deliveryStorage.bulkCreateDeliveryItems(items3);
      }
      // Delivery Picking Session operations
      async getDeliveryPickingSessions(deliveryId) {
        return this.deliveryStorage.getDeliveryPickingSessions(deliveryId);
      }
      async getDeliveryPickingSession(id) {
        return this.deliveryStorage.getDeliveryPickingSession(id);
      }
      async createDeliveryPickingSession(session2) {
        return this.deliveryStorage.createDeliveryPickingSession(session2);
      }
      async updateDeliveryPickingSession(id, session2) {
        return this.deliveryStorage.updateDeliveryPickingSession(id, session2);
      }
      async completePickingSession(sessionId) {
        return this.deliveryStorage.completePickingSession(sessionId);
      }
      // Delivery Picked Item operations
      async getDeliveryPickedItems(sessionId) {
        return this.deliveryStorage.getDeliveryPickedItems(sessionId);
      }
      async getDeliveryPickedItem(id) {
        return this.deliveryStorage.getDeliveryPickedItem(id);
      }
      async createDeliveryPickedItem(item) {
        return this.deliveryStorage.createDeliveryPickedItem(item);
      }
      async updateDeliveryPickedItem(id, item) {
        return this.deliveryStorage.updateDeliveryPickedItem(id, item);
      }
      async verifyPickedItem(itemId, userId) {
        return this.deliveryStorage.verifyPickedItem(itemId, userId);
      }
      // Shipment operations - delegate to ShipmentStorage
      async getShipments(filters) {
        return this.shipmentStorage.getShipments(filters);
      }
      async getShipment(id) {
        return this.shipmentStorage.getShipment(id);
      }
      async getShipmentByNumber(shipmentNumber) {
        return this.shipmentStorage.getShipmentByNumber(shipmentNumber);
      }
      async getShipmentByTrackingNumber(trackingNumber) {
        return this.shipmentStorage.getShipmentByTrackingNumber(trackingNumber);
      }
      async createShipment(shipment) {
        return this.shipmentStorage.createShipment(shipment);
      }
      async updateShipment(id, shipment) {
        return this.shipmentStorage.updateShipment(id, shipment);
      }
      async deleteShipment(id) {
        return this.shipmentStorage.deleteShipment(id);
      }
      async updateShipmentStatus(id, status, location) {
        return this.shipmentStorage.updateShipmentStatus(id, status, location);
      }
      async getShipmentTrackingEvents(shipmentId) {
        return this.shipmentStorage.getShipmentTrackingEvents(shipmentId);
      }
      async createTrackingEvent(event) {
        return this.shipmentStorage.createTrackingEvent(event);
      }
      async getLatestTrackingEvent(shipmentId) {
        return this.shipmentStorage.getLatestTrackingEvent(shipmentId);
      }
      async getShipmentAnalytics() {
        return this.shipmentStorage.getShipmentAnalytics();
      }
      // Workflow analytics
      async getWorkflowAnalytics(period = "30d") {
        try {
          const now = /* @__PURE__ */ new Date();
          let startDate;
          switch (period) {
            case "7d":
              startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
              break;
            case "30d":
              startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
              break;
            case "90d":
              startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1e3);
              break;
            case "1y":
              startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1e3);
              break;
            default:
              startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
          }
          const totalWorkflows = 12;
          const completedWorkflows = Math.floor(Math.random() * 8) + 2;
          const inProgressWorkflows = Math.floor(Math.random() * 4) + 1;
          const blockedWorkflows = Math.floor(Math.random() * 2);
          const cancelledWorkflows = Math.floor(Math.random() * 2);
          const averageCompletionTime = Math.floor(Math.random() * 10) + 5;
          const efficiency = Math.floor(Math.random() * 30) + 70;
          const totalValue = Math.floor(Math.random() * 1e5) + 5e4;
          const monthlyTrends = [];
          for (let i = 5; i >= 0; i--) {
            const monthDate = new Date(now.getTime() - i * 30 * 24 * 60 * 60 * 1e3);
            monthlyTrends.push({
              month: monthDate.toISOString().substring(0, 7),
              completed: Math.floor(Math.random() * 10) + 5,
              inProgress: Math.floor(Math.random() * 5) + 2,
              blocked: Math.floor(Math.random() * 3),
              cancelled: Math.floor(Math.random() * 2)
            });
          }
          const stepBreakdown = {
            "Customer": Math.floor(Math.random() * 20) + 80,
            "Enquiry": Math.floor(Math.random() * 20) + 70,
            "Quotation": Math.floor(Math.random() * 20) + 50,
            "Acceptance": Math.floor(Math.random() * 20) + 40,
            "Customer PO Upload": Math.floor(Math.random() * 20) + 35,
            "Sales Order": Math.floor(Math.random() * 20) + 30,
            "Supplier LPO": Math.floor(Math.random() * 20) + 25,
            "Goods Receipt": Math.floor(Math.random() * 20) + 20,
            "Inventory": Math.floor(Math.random() * 20) + 15,
            "Delivery Note": Math.floor(Math.random() * 20) + 10,
            "Invoice": Math.floor(Math.random() * 20) + 5
          };
          const priorityDistribution = {
            "Low": Math.floor(Math.random() * 20) + 10,
            "Medium": Math.floor(Math.random() * 30) + 40,
            "High": Math.floor(Math.random() * 20) + 20,
            "Urgent": Math.floor(Math.random() * 10) + 5
          };
          const teamPerformance = [
            {
              userId: "user1",
              userName: "John Doe",
              completedWorkflows: Math.floor(Math.random() * 20) + 10,
              averageTime: Math.floor(Math.random() * 5) + 8,
              efficiency: Math.floor(Math.random() * 20) + 80
            },
            {
              userId: "user2",
              userName: "Jane Smith",
              completedWorkflows: Math.floor(Math.random() * 25) + 15,
              averageTime: Math.floor(Math.random() * 4) + 6,
              efficiency: Math.floor(Math.random() * 15) + 85
            },
            {
              userId: "user3",
              userName: "Mike Johnson",
              completedWorkflows: Math.floor(Math.random() * 15) + 8,
              averageTime: Math.floor(Math.random() * 6) + 10,
              efficiency: Math.floor(Math.random() * 25) + 75
            }
          ];
          const stepAnalytics = [
            { stepId: 1, stepName: "Customer", averageDuration: 1, completionRate: 95, bottleneckScore: 0.1, commonBlockers: [], efficiency: 95, successRate: 98 },
            { stepId: 2, stepName: "Enquiry", averageDuration: 2, completionRate: 90, bottleneckScore: 0.2, commonBlockers: ["Incomplete requirements"], efficiency: 88, successRate: 92 },
            { stepId: 4, stepName: "Quotation", averageDuration: 1, completionRate: 85, bottleneckScore: 0.3, commonBlockers: ["Pricing accuracy"], efficiency: 82, successRate: 90 },
            { stepId: 5, stepName: "Acceptance", averageDuration: 3, completionRate: 80, bottleneckScore: 0.6, commonBlockers: ["Customer approval"], efficiency: 75, successRate: 88 },
            { stepId: 6, stepName: "Customer PO Upload", averageDuration: 1, completionRate: 85, bottleneckScore: 0.2, commonBlockers: ["Document format"], efficiency: 80, successRate: 92 },
            { stepId: 7, stepName: "Sales Order", averageDuration: 1, completionRate: 90, bottleneckScore: 0.1, commonBlockers: [], efficiency: 88, successRate: 95 },
            { stepId: 8, stepName: "Supplier LPO", averageDuration: 1, completionRate: 88, bottleneckScore: 0.2, commonBlockers: ["Supplier availability"], efficiency: 85, successRate: 90 },
            { stepId: 9, stepName: "Goods Receipt", averageDuration: 2, completionRate: 82, bottleneckScore: 0.4, commonBlockers: ["Delivery delays", "Quality issues"], efficiency: 78, successRate: 85 },
            { stepId: 10, stepName: "Inventory", averageDuration: 1, completionRate: 90, bottleneckScore: 0.1, commonBlockers: [], efficiency: 88, successRate: 95 },
            { stepId: 11, stepName: "Delivery Note", averageDuration: 1, completionRate: 85, bottleneckScore: 0.3, commonBlockers: ["Logistics coordination"], efficiency: 82, successRate: 88 },
            { stepId: 12, stepName: "Invoice", averageDuration: 1, completionRate: 88, bottleneckScore: 0.2, commonBlockers: ["Payment terms"], efficiency: 85, successRate: 92 }
          ];
          const performanceMetrics = {
            onTimeDelivery: Math.floor(Math.random() * 20) + 75,
            // 75-95%
            averageDelay: Math.floor(Math.random() * 3) + 1,
            // 1-4 days
            reworkRate: Math.floor(Math.random() * 10) + 5,
            // 5-15%
            qualityScore: Math.floor(Math.random() * 15) + 80,
            // 80-95%
            customerSatisfaction: Math.floor(Math.random() * 20) + 75,
            // 75-95%
            costEfficiency: Math.floor(Math.random() * 25) + 70
            // 70-95%
          };
          const riskAnalysis = {
            highRiskWorkflows: Math.floor(Math.random() * 5) + 2,
            mediumRiskWorkflows: Math.floor(Math.random() * 8) + 5,
            lowRiskWorkflows: Math.floor(Math.random() * 10) + 15,
            commonRiskFactors: ["Supplier delays", "Quality issues", "Customer changes", "Resource constraints"],
            escalationRate: Math.floor(Math.random() * 15) + 5
            // 5-20%
          };
          const complianceMetrics = {
            auditCompliance: Math.floor(Math.random() * 10) + 90,
            // 90-100%
            documentationCompleteness: Math.floor(Math.random() * 15) + 80,
            // 80-95%
            approvalCycleTime: Math.floor(Math.random() * 3) + 2,
            // 2-5 days
            regulatoryAdherence: Math.floor(Math.random() * 10) + 85
            // 85-95%
          };
          const resourceUtilization = {
            departmentUtilization: {
              "Sales": Math.floor(Math.random() * 20) + 70,
              "Procurement": Math.floor(Math.random() * 25) + 65,
              "Warehouse": Math.floor(Math.random() * 30) + 60,
              "Logistics": Math.floor(Math.random() * 20) + 75
            },
            workloadDistribution: {
              "High": Math.floor(Math.random() * 10) + 5,
              "Medium": Math.floor(Math.random() * 20) + 40,
              "Low": Math.floor(Math.random() * 15) + 30
            },
            capacityPlanning: {
              currentCapacity: 100,
              projectedDemand: Math.floor(Math.random() * 20) + 80,
              capacityGap: Math.floor(Math.random() * 10) - 5
            }
          };
          const predictiveAnalytics = {
            forecastedCompletion: [
              { date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1e3).toISOString().substring(0, 10), expectedCompletions: Math.floor(Math.random() * 5) + 3, confidence: 85 },
              { date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1e3).toISOString().substring(0, 10), expectedCompletions: Math.floor(Math.random() * 8) + 5, confidence: 75 },
              { date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1e3).toISOString().substring(0, 10), expectedCompletions: Math.floor(Math.random() * 15) + 10, confidence: 65 }
            ],
            trendAnalysis: {
              direction: Math.random() > 0.5 ? "up" : "down",
              changeRate: Math.floor(Math.random() * 20) + 5,
              // 5-25%
              seasonality: Math.random() > 0.7
            }
          };
          return {
            totalWorkflows,
            completedWorkflows,
            inProgressWorkflows,
            blockedWorkflows,
            cancelledWorkflows,
            averageCompletionTime,
            efficiency,
            totalValue,
            monthlyTrends,
            stepBreakdown,
            priorityDistribution,
            teamPerformance,
            stepAnalytics,
            performanceMetrics,
            riskAnalysis,
            complianceMetrics,
            resourceUtilization,
            predictiveAnalytics
          };
        } catch (error) {
          console.error("Error fetching workflow analytics:", error);
          throw new Error("Failed to fetch workflow analytics");
        }
      }
      // Barcode scanning and verification
      async verifyItemBarcode(barcode, expectedItemId) {
        return this.deliveryStorage.verifyItemBarcode(barcode, expectedItemId);
      }
      async scanItemForPicking(barcode, sessionId, quantity, userId, storageLocation) {
        return this.deliveryStorage.scanItemForPicking(barcode, sessionId, quantity, userId, storageLocation);
      }
      async getAvailableItemsForPicking(deliveryId) {
        return this.deliveryStorage.getAvailableItemsForPicking(deliveryId);
      }
      async getInvoices(...args) {
        return this.invoiceStorage.getInvoices(args[0]);
      }
      async getInvoice(id) {
        return this.invoiceStorage.getInvoice(id);
      }
      async getInvoiceByNumber(invoiceNumber) {
        return this.invoiceStorage.getInvoiceByNumber(invoiceNumber);
      }
      async createInvoice(invoice) {
        return this.invoiceStorage.createInvoice(invoice);
      }
      async updateInvoice(id, invoice) {
        return this.invoiceStorage.updateInvoice(id, invoice);
      }
      async deleteInvoice(id) {
        return this.invoiceStorage.deleteInvoice(id);
      }
      async generateInvoiceFromDelivery(deliveryId, invoiceType, userId) {
        return this.invoiceStorage.generateInvoiceFromDelivery(deliveryId, invoiceType, userId);
      }
      async generateProformaInvoice(salesOrderId, userId) {
        return this.invoiceStorage.generateProformaInvoice(salesOrderId, userId);
      }
      async sendInvoice(invoiceId, userId) {
        return this.invoiceStorage.sendInvoice(invoiceId, userId);
      }
      async getInvoiceItems(invoiceId) {
        return this.invoiceStorage.getInvoiceItems(invoiceId);
      }
      async createInvoiceItem(data) {
        return this.invoiceStorage.createInvoiceItem(data);
      }
      async updateInvoiceItem(id, data) {
        return this.invoiceStorage.updateInvoiceItem(id, data);
      }
      async deleteInvoiceItem(id) {
        return this.invoiceStorage.deleteInvoiceItem(id);
      }
      async markInvoicePaid(invoiceId, paidAmount, paymentMethod, paymentReference, userId) {
        return this.invoiceStorage.markInvoicePaid(invoiceId, paidAmount, paymentMethod, paymentReference, userId);
      }
      async bulkCreateInvoiceItems(items3) {
        return this.invoiceStorage.bulkCreateInvoiceItems(items3);
      }
      async updateInvoiceCurrency(invoiceId, newCurrency, exchangeRate, userId) {
        return this.invoiceStorage.updateInvoiceCurrency(invoiceId, newCurrency, exchangeRate, userId);
      }
      async getCreditNotes(...args) {
        console.warn("getCreditNotes: Using stub implementation - should be moved to CreditNoteStorage");
        return [];
      }
      async getDashboardStats() {
        try {
          const [enquiries3, quotations3, salesOrders3] = await Promise.all([
            this.enquiryStorage.getEnquiries(100, 0),
            this.quotationStorage.getQuotations(100, 0),
            this.salesOrderStorage.getSalesOrders(100, 0)
          ]);
          const activeEnquiries = enquiries3.filter((e) => e.status === "New" || e.status === "In Progress").length;
          const pendingQuotes = quotations3.filter((q) => q.status === "Draft" || q.status === "Sent").length;
          const activeOrders = salesOrders3.filter((o) => o.status === "Confirmed" || o.status === "Processing" || o.status === "Shipped").length;
          const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
          const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
          const monthlyRevenue = salesOrders3.filter((o) => {
            const orderDate = new Date(o.orderDate);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
          }).reduce((sum4, order) => sum4 + (Number(order.totalAmount) || 0), 0);
          return {
            activeEnquiries,
            pendingQuotes,
            activeOrders,
            monthlyRevenue
          };
        } catch (error) {
          console.error("Error calculating dashboard stats:", error);
          return {
            activeEnquiries: 0,
            pendingQuotes: 0,
            activeOrders: 0,
            monthlyRevenue: 0
          };
        }
      }
      async getStockMovements(filters) {
        return this.inventoryStorage.getStockMovements(filters);
      }
      async getStockMovement(id) {
        return this.inventoryStorage.getStockMovement(id);
      }
      async createStockMovement(movement) {
        return this.inventoryStorage.createStockMovement(movement);
      }
      async getCustomerStats() {
        try {
          const customers3 = await this.customerStorage.getCustomers(1e3, 0);
          const stats = {
            totalCustomers: customers3.length,
            activeCustomers: customers3.filter((c) => c.isActive).length,
            retailCustomers: customers3.filter((c) => c.customerType === "Retail").length,
            wholesaleCustomers: customers3.filter((c) => c.customerType === "Wholesale").length,
            totalCreditLimit: customers3.reduce((sum4, c) => sum4 + (Number(c.creditLimit) || 0), 0),
            averageCreditLimit: 0
          };
          stats.averageCreditLimit = stats.totalCustomers > 0 ? stats.totalCreditLimit / stats.totalCustomers : 0;
          return stats;
        } catch (error) {
          console.error("Error calculating customer stats:", error);
          return {
            totalCustomers: 0,
            activeCustomers: 0,
            retailCustomers: 0,
            wholesaleCustomers: 0,
            totalCreditLimit: 0,
            averageCreditLimit: 0
          };
        }
      }
      // Physical Stock operations - delegate to PhysicalStockStorage
      async getAllPhysicalStockItems() {
        return this.physicalStockStorage.getAllPhysicalStockItems();
      }
      async createPhysicalStockItem(data) {
        return this.physicalStockStorage.createPhysicalStockItem(data);
      }
      async updatePhysicalStockItem(id, data) {
        return this.physicalStockStorage.updatePhysicalStockItem(id, data);
      }
      async deletePhysicalStockItem(id, userId) {
        return this.physicalStockStorage.deletePhysicalStockItem(id, userId);
      }
      async getPhysicalStockCounts(limit, offset) {
        return this.physicalStockStorage.getPhysicalStockCounts(limit, offset);
      }
      async getPhysicalStockCountById(id) {
        return this.physicalStockStorage.getPhysicalStockCountById(id);
      }
      async getPhysicalStockCountByNumber(countNumber) {
        return this.physicalStockStorage.getPhysicalStockCountByNumber(countNumber);
      }
      async createPhysicalStockCount(data) {
        return this.physicalStockStorage.createPhysicalStockCount(data);
      }
      async updatePhysicalStockCount(id, data, userId) {
        return this.physicalStockStorage.updatePhysicalStockCount(id, data, userId);
      }
      async deletePhysicalStockCount(id, userId) {
        return this.physicalStockStorage.deletePhysicalStockCount(id, userId);
      }
      async getPhysicalStockCountItems(physicalStockCountId) {
        return this.physicalStockStorage.getPhysicalStockCountItems(physicalStockCountId);
      }
      async createPhysicalStockCountItem(data) {
        return this.physicalStockStorage.createPhysicalStockCountItem(data);
      }
      async updatePhysicalStockCountItem(id, data) {
        return this.physicalStockStorage.updatePhysicalStockCountItem(id, data);
      }
      async populatePhysicalStockCountItems(physicalStockCountId, storageLocation) {
        return this.physicalStockStorage.populatePhysicalStockCountItems(physicalStockCountId, storageLocation);
      }
      async createScanningSession(data) {
        return this.physicalStockStorage.createScanningSession(data);
      }
      async getScanningSessionsByCountId(physicalStockCountId) {
        return this.physicalStockStorage.getScanningSessionsByCountId(physicalStockCountId);
      }
      async updateScanningSession(id, data) {
        return this.physicalStockStorage.updateScanningSession(id, data);
      }
      async createScannedItem(data) {
        return this.physicalStockStorage.createScannedItem(data);
      }
      async getScannedItemsBySession(scanningSessionId) {
        return this.physicalStockStorage.getScannedItemsBySession(scanningSessionId);
      }
      async processBarcodeScan(scanningSessionId, barcode, scannedBy, quantity, storageLocation) {
        return this.physicalStockStorage.processBarcodeScan(scanningSessionId, barcode, scannedBy, quantity, storageLocation);
      }
      async createPhysicalStockAdjustment(data) {
        return this.physicalStockStorage.createPhysicalStockAdjustment(data);
      }
      async generateAdjustmentsFromCount(physicalStockCountId, createdBy) {
        return this.physicalStockStorage.generateAdjustmentsFromCount(physicalStockCountId, createdBy);
      }
      async applyPhysicalStockAdjustment(adjustmentId, appliedBy) {
        return this.physicalStockStorage.applyPhysicalStockAdjustment(adjustmentId, appliedBy);
      }
      async getPhysicalStockCountSummary(physicalStockCountId) {
        return this.physicalStockStorage.getPhysicalStockCountSummary(physicalStockCountId);
      }
      async finalizePhysicalStockCount(physicalStockCountId, completedBy) {
        return this.physicalStockStorage.finalizePhysicalStockCount(physicalStockCountId, completedBy);
      }
      // Missing methods that are being called by routes
      async getInventoryLevels(filters) {
        return this.inventoryStorage.getInventoryLevels(filters);
      }
      async getSupplierReturns(filters) {
        console.warn("getSupplierReturns: Using stub implementation - should be moved to SupplierReturnStorage");
        return [];
      }
      async getGoodsReceiptItems(goodsReceiptId) {
        return this.goodsReceiptStorage.getGoodsReceiptItems(goodsReceiptId);
      }
      // Additional missing methods that might be called
      async getGoodsReceiptHeader(id) {
        return this.goodsReceiptStorage.getGoodsReceiptHeader(id);
      }
      async updateGoodsReceiptHeader(id, data) {
        console.warn("updateGoodsReceiptHeader: Using stub implementation");
        return { id, ...data };
      }
      async updateGoodsReceiptItem(id, data) {
        console.warn("updateGoodsReceiptItem: Using stub implementation");
        return { id, ...data };
      }
      async bulkCreateGoodsReceiptItems(items3) {
        return this.goodsReceiptStorage.createGoodsReceiptItemsBulk(items3);
      }
      async updateGoodsReceiptStatus(id, status) {
        return this.goodsReceiptStorage.updateGoodsReceiptStatus(id, status);
      }
      async approveGoodsReceipt(id, approvedBy) {
        return this.goodsReceiptStorage.approveGoodsReceipt(id, approvedBy);
      }
      // Supplier return methods (stubs for now)
      async getSupplierReturn(id) {
        console.warn("getSupplierReturn: Using stub implementation");
        return null;
      }
      async createSupplierReturn(data) {
        console.warn("createSupplierReturn: Using stub implementation");
        return { id: "stub-" + Date.now(), ...data };
      }
      async updateSupplierReturn(id, data) {
        console.warn("updateSupplierReturn: Using stub implementation");
        return { id, ...data };
      }
      async getSupplierReturnItems(returnId) {
        console.warn("getSupplierReturnItems: Using stub implementation");
        return [];
      }
      async createSupplierReturnItem(data) {
        console.warn("createSupplierReturnItem: Using stub implementation");
        return { id: "stub-" + Date.now(), ...data };
      }
      async bulkCreateSupplierReturnItems(items3) {
        console.warn("bulkCreateSupplierReturnItems: Using stub implementation");
        return items3.map((item) => ({ id: "stub-" + Date.now(), ...item }));
      }
    };
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  storage: () => storage
});
async function initStorage() {
  if (USE_TEST_STORAGE) {
    console.log("[STORAGE] Using test storage with mock data");
    throw new Error("Test storage not available");
  } else {
    console.log("[STORAGE] Using modular database storage");
    try {
      const { db: db2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const schema = await Promise.resolve().then(() => (init_schema(), schema_exports));
      await db2.select().from(schema.enquiries).limit(1);
      storage = new ModularStorage();
      console.log("[STORAGE] ModularStorage initialized successfully");
    } catch (error) {
      console.warn("[STORAGE] Database connection failed, falling back to test storage:", error?.message);
      throw new Error("Database connection failed and test storage not available");
    }
  }
}
var storage, FORCE_DATABASE, USE_TEST_STORAGE;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_modular_storage_clean();
    FORCE_DATABASE = process.env.FORCE_REAL_DB === "true";
    USE_TEST_STORAGE = !FORCE_DATABASE && process.env.NODE_ENV === "development" && (process.env.DATABASE_URL?.includes("invalid") || process.env.FORCE_TEST_STORAGE === "true" || !process.env.DATABASE_URL);
    void initStorage();
  }
});

// server/storage/base-storage.ts
var BaseStorage2;
var init_base_storage = __esm({
  "server/storage/base-storage.ts"() {
    "use strict";
    BaseStorage2 = class {
      // Common storage logic, e.g., audit logging
      async logAuditEvent(event, details) {
        console.log(`[Audit] ${event}`, details);
      }
    };
  }
});

// server/storage/inventory-items-storage.ts
import { eq as eq27 } from "drizzle-orm";
var InventoryItemsStorage;
var init_inventory_items_storage = __esm({
  "server/storage/inventory-items-storage.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_base_storage();
    InventoryItemsStorage = class extends BaseStorage2 {
      async getAllItems() {
        return await db.select().from(inventoryItems);
      }
      async createItem(data) {
        const [newItem] = await db.insert(inventoryItems).values(data).returning();
        return newItem;
      }
      async updateItem(id, data) {
        const [updated] = await db.update(inventoryItems).set(data).where(eq27(inventoryItems.id, id)).returning();
        return updated || null;
      }
    };
  }
});

// server/routes/inventory-items.ts
import { Router as Router9 } from "express";
var router9, storage4, inventory_items_default;
var init_inventory_items = __esm({
  "server/routes/inventory-items.ts"() {
    "use strict";
    init_inventory_items_storage();
    router9 = Router9();
    storage4 = new InventoryItemsStorage();
    router9.get("/", async (req, res) => {
      try {
        const items3 = await storage4.getAllItems();
        res.json(items3);
      } catch (err) {
        res.status(500).json({ message: "Failed to fetch inventory items" });
      }
    });
    router9.post("/", async (req, res) => {
      try {
        const item = await storage4.createItem(req.body);
        res.json(item);
      } catch (err) {
        res.status(500).json({ message: "Failed to create item" });
      }
    });
    router9.put("/:id", async (req, res) => {
      try {
        const updated = await storage4.updateItem(req.params.id, req.body);
        res.json(updated);
      } catch (err) {
        res.status(500).json({ message: "Failed to update item" });
      }
    });
    inventory_items_default = router9;
  }
});

// server/routes/inventory-items-index.ts
var inventory_items_index_exports = {};
__export(inventory_items_index_exports, {
  registerInventoryItemsRoutes: () => registerInventoryItemsRoutes
});
function registerInventoryItemsRoutes(app2) {
  app2.use("/api/inventory-items", inventory_items_default);
}
var init_inventory_items_index = __esm({
  "server/routes/inventory-items-index.ts"() {
    "use strict";
    init_inventory_items();
  }
});

// server/storage/stock-issues-storage.ts
import { eq as eq28 } from "drizzle-orm";
var StockIssuesStorage;
var init_stock_issues_storage = __esm({
  "server/storage/stock-issues-storage.ts"() {
    "use strict";
    init_db();
    init_schema();
    StockIssuesStorage = class {
      async getAllStockIssues() {
        const results = await db.select({
          id: stockIssue.id,
          issueNumber: stockIssue.issueNumber,
          itemId: stockIssue.itemId,
          quantity: stockIssue.quantity,
          issueDate: stockIssue.issueDate,
          status: stockIssue.status,
          issuedTo: stockIssue.issuedTo,
          departmentId: stockIssue.departmentId,
          notes: stockIssue.notes,
          itemName: inventoryItems.description,
          itemCode: inventoryItems.barcode
        }).from(stockIssue).leftJoin(inventoryItems, eq28(stockIssue.itemId, inventoryItems.id));
        return results;
      }
      async getStockIssueById(id) {
        const result = await db.select().from(stockIssue).where(eq28(stockIssue.id, id));
        return result[0] || null;
      }
      async createStockIssue(data) {
        if (data && "issueDate" in data) {
          const v = data.issueDate;
          if (v == null || v === "") {
            delete data.issueDate;
          } else if (!(v instanceof Date)) {
            try {
              const d = new Date(v);
              if (!isNaN(d.getTime())) data.issueDate = d;
              else delete data.issueDate;
            } catch {
              delete data.issueDate;
            }
          }
        }
        console.log("[DEBUG][createStockIssue] Final payload to insert:", {
          ...data,
          issueDate: data.issueDate instanceof Date ? data.issueDate.toISOString() : data.issueDate
        });
        const [created] = await db.insert(stockIssue).values(data).returning();
        return created;
      }
      async updateStockIssue(id, data) {
        if (data && "issueDate" in data) {
          const v = data.issueDate;
          if (v == null || v === "") {
            delete data.issueDate;
          } else if (!(v instanceof Date)) {
            try {
              const d = new Date(v);
              if (!isNaN(d.getTime())) data.issueDate = d;
              else delete data.issueDate;
            } catch {
              delete data.issueDate;
            }
          }
        }
        console.log("[DEBUG][updateStockIssue] Payload:", {
          ...data,
          issueDate: data.issueDate instanceof Date ? data.issueDate.toISOString() : data.issueDate
        });
        const [updated] = await db.update(stockIssue).set(data).where(eq28(stockIssue.id, id)).returning();
        return updated || null;
      }
      async deleteStockIssue(id) {
        await db.delete(stockIssue).where(eq28(stockIssue.id, id));
      }
    };
  }
});

// server/routes/stock-issues.ts
import { Router as Router10 } from "express";
var router10, storage5, stock_issues_default;
var init_stock_issues = __esm({
  "server/routes/stock-issues.ts"() {
    "use strict";
    init_stock_issues_storage();
    console.log("[DEBUG] stock-issues route loaded");
    router10 = Router10();
    storage5 = new StockIssuesStorage();
    router10.get("/", async (req, res) => {
      console.log("[DEBUG] GET /api/stock-issues called");
      try {
        const issues = await storage5.getAllStockIssues();
        res.json(issues);
      } catch (err) {
        res.status(500).json({ message: "Failed to fetch stock issues" });
      }
    });
    router10.get("/:id", async (req, res) => {
      try {
        const issue = await storage5.getStockIssueById(req.params.id);
        if (!issue) return res.status(404).json({ message: "Not found" });
        res.json(issue);
      } catch (err) {
        res.status(500).json({ message: "Failed to fetch stock issue" });
      }
    });
    router10.post("/", async (req, res) => {
      try {
        const body = req.body || {};
        console.log("[DEBUG][POST /api/stock-issues] Raw body received:", body);
        const rawIssueDate = body.issueDate ?? body.issue_date;
        const payload = {
          issueNumber: body.issueNumber ?? body.issue_number,
          itemId: body.itemId ?? body.item_id,
          issuedTo: body.issuedTo ?? body.issued_to,
          quantity: body.quantity != null ? Number(body.quantity) : void 0,
          issueDate: rawIssueDate,
          reason: body.reason,
          departmentId: body.departmentId ?? body.department_id,
          notes: body.notes,
          status: body.status
        };
        const problems = [];
        const uuidRegex = /^[0-9a-fA-F-]{36}$/;
        if (!payload.itemId || typeof payload.itemId !== "string" || !uuidRegex.test(payload.itemId)) {
          problems.push("itemId (UUID) is required");
        }
        if (payload.quantity == null || isNaN(payload.quantity) || payload.quantity <= 0) {
          problems.push("quantity must be > 0");
        }
        if (problems.length) {
          return res.status(422).json({ message: "Validation failed", issues: problems, payload });
        }
        if (payload.issueDate) {
          if (payload.issueDate instanceof Date) {
            if (isNaN(payload.issueDate.getTime())) payload.issueDate = void 0;
          } else if (typeof payload.issueDate === "string" || typeof payload.issueDate === "number") {
            const d = new Date(payload.issueDate);
            if (!isNaN(d.getTime())) payload.issueDate = d;
            else payload.issueDate = void 0;
          } else {
            payload.issueDate = void 0;
          }
        }
        if (payload.issueDate && !(payload.issueDate instanceof Date)) {
          const d = new Date(payload.issueDate);
          payload.issueDate = isNaN(d.getTime()) ? void 0 : d;
        }
        console.log("[DEBUG][POST] issueDate final type:", typeof payload.issueDate, "value:", payload.issueDate instanceof Date ? payload.issueDate.toISOString() : payload.issueDate);
        Object.keys(payload).forEach((k) => payload[k] === void 0 && delete payload[k]);
        console.log("[DEBUG][POST] Normalized Stock Issue Payload", payload);
        const issue = await storage5.createStockIssue(payload);
        res.json(issue);
      } catch (err) {
        console.error("Stock Issue Creation Error:", err, "Raw Payload:", req.body);
        const errorMessage = err instanceof Error && err.message ? err.message : String(err);
        res.status(500).json({
          message: "Failed to create stock issue",
          error: errorMessage,
          received: req.body,
          hint: "Verify itemId references an existing inventory item and that migrations for stock_issue table are applied."
        });
      }
    });
    router10.put("/:id", async (req, res) => {
      try {
        const body = req.body || {};
        const rawIssueDate = body.issueDate ?? body.issue_date;
        const payload = {
          issueNumber: body.issueNumber ?? body.issue_number,
          itemId: body.itemId ?? body.item_id,
          issuedTo: body.issuedTo ?? body.issued_to,
          quantity: body.quantity != null ? Number(body.quantity) : void 0,
          issueDate: rawIssueDate,
          reason: body.reason,
          departmentId: body.departmentId ?? body.department_id,
          notes: body.notes,
          status: body.status
        };
        const problems = [];
        const uuidRegex = /^[0-9a-fA-F-]{36}$/;
        if (payload.itemId && (typeof payload.itemId !== "string" || !uuidRegex.test(payload.itemId))) {
          problems.push("itemId must be a valid UUID");
        }
        if (payload.quantity != null && (isNaN(payload.quantity) || payload.quantity <= 0)) {
          problems.push("quantity must be > 0");
        }
        if (problems.length) {
          return res.status(422).json({ message: "Validation failed", issues: problems, payload });
        }
        if (payload.issueDate) {
          if (payload.issueDate instanceof Date) {
            if (isNaN(payload.issueDate.getTime())) payload.issueDate = void 0;
          } else if (typeof payload.issueDate === "string" || typeof payload.issueDate === "number") {
            const d = new Date(payload.issueDate);
            if (!isNaN(d.getTime())) payload.issueDate = d;
            else payload.issueDate = void 0;
          } else {
            payload.issueDate = void 0;
          }
        }
        if (payload.issueDate && !(payload.issueDate instanceof Date)) {
          const d = new Date(payload.issueDate);
          payload.issueDate = isNaN(d.getTime()) ? void 0 : d;
        }
        console.log("[DEBUG][PUT] issueDate final type:", typeof payload.issueDate, "value:", payload.issueDate instanceof Date ? payload.issueDate.toISOString() : payload.issueDate);
        Object.keys(payload).forEach((k) => payload[k] === void 0 && delete payload[k]);
        console.log("[DEBUG][PUT] Normalized Stock Issue Payload", payload);
        const updated = await storage5.updateStockIssue(req.params.id, payload);
        res.json(updated);
      } catch (err) {
        console.error("Stock Issue Update Error", err);
        res.status(500).json({ message: "Failed to update stock issue" });
      }
    });
    router10.delete("/:id", async (req, res) => {
      try {
        await storage5.deleteStockIssue(req.params.id);
        res.json({ success: true });
      } catch (err) {
        res.status(500).json({ message: "Failed to delete stock issue" });
      }
    });
    stock_issues_default = router10;
  }
});

// server/routes/stock-issues-index.ts
var stock_issues_index_exports = {};
__export(stock_issues_index_exports, {
  registerStockIssuesRoutes: () => registerStockIssuesRoutes
});
function registerStockIssuesRoutes(app2) {
  app2.use("/api/stock-issues", stock_issues_default);
}
var init_stock_issues_index = __esm({
  "server/routes/stock-issues-index.ts"() {
    "use strict";
    init_stock_issues();
  }
});

// server/storage/receipt-returns-storage.ts
import { eq as eq29 } from "drizzle-orm";
var ReceiptReturnsStorage;
var init_receipt_returns_storage = __esm({
  "server/storage/receipt-returns-storage.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_base_storage();
    ReceiptReturnsStorage = class extends BaseStorage2 {
      async getAllReturns() {
        return await db.select().from(supplierReturns);
      }
      async getReturnById(id) {
        const [ret] = await db.select().from(supplierReturns).where(eq29(supplierReturns.id, id));
        return ret || null;
      }
      async createReturn(data) {
        const [newReturn] = await db.insert(supplierReturns).values(data).returning();
        return newReturn;
      }
      async updateReturn(id, data) {
        const [updated] = await db.update(supplierReturns).set(data).where(eq29(supplierReturns.id, id)).returning();
        return updated || null;
      }
      async getReturnItems(returnId) {
        return await db.select().from(supplierReturnItems).where(eq29(supplierReturnItems.supplierReturnId, returnId));
      }
      async createReturnItem(data) {
        const [newItem] = await db.insert(supplierReturnItems).values(data).returning();
        return newItem;
      }
      async updateReturnItem(id, data) {
        const [updated] = await db.update(supplierReturnItems).set(data).where(eq29(supplierReturnItems.id, id)).returning();
        return updated || null;
      }
      async deleteReturn(id) {
        await db.delete(supplierReturns).where(eq29(supplierReturns.id, id));
      }
    };
  }
});

// server/routes/receipt-returns.ts
import { Router as Router11 } from "express";
var router11, storage6, receipt_returns_default;
var init_receipt_returns = __esm({
  "server/routes/receipt-returns.ts"() {
    "use strict";
    init_receipt_returns_storage();
    router11 = Router11();
    storage6 = new ReceiptReturnsStorage();
    router11.get("/", async (req, res) => {
      try {
        const returns = await storage6.getAllReturns();
        res.json(returns);
      } catch (err) {
        res.status(500).json({ message: "Failed to fetch receipt returns" });
      }
    });
    router11.get("/:id", async (req, res) => {
      try {
        const returnItem = await storage6.getReturnById(req.params.id);
        if (!returnItem) return res.status(404).json({ message: "Return not found" });
        res.json(returnItem);
      } catch (err) {
        res.status(500).json({ message: "Failed to fetch return" });
      }
    });
    router11.post("/", async (req, res) => {
      try {
        const body = req.body || {};
        const statusMap = {
          Draft: "pending",
          "Pending Approval": "pending",
          Approved: "approved",
          Returned: "returned",
          Credited: "credited"
        };
        const normalizedStatus = statusMap[body.status] || body.status;
        const payload = {
          returnNumber: body.returnNumber,
          supplierId: body.supplierId,
          goodsReceiptId: body.goodsReceiptId,
          returnReason: body.returnReason,
          notes: body.notes
        };
        if (body.returnDate) {
          payload.returnDate = /\d{4}-\d{2}-\d{2}$/.test(body.returnDate) ? new Date(body.returnDate) : body.returnDate;
        }
        if (normalizedStatus) payload.status = normalizedStatus;
        const missing = ["returnNumber", "returnReason"].filter((k) => !payload[k]);
        if (missing.length) {
          return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
        }
        const returnItem = await storage6.createReturn(payload);
        res.json(returnItem);
      } catch (err) {
        console.error("Failed to create return:", err?.code, err?.message, err);
        if (err?.code === "23505") {
          return res.status(400).json({ message: "Return number already exists" });
        }
        res.status(500).json({ message: "Failed to create return" });
      }
    });
    router11.get("/:id/items", async (req, res) => {
      try {
        const items3 = await storage6.getReturnItems(req.params.id);
        res.json(items3);
      } catch (err) {
        res.status(500).json({ message: "Failed to fetch return items" });
      }
    });
    router11.post("/:id/items", async (req, res) => {
      try {
        const supplierReturnId = req.params.id;
        const body = req.body || {};
        const data = {
          supplierReturnId,
          inventoryItemId: body.itemId || body.inventoryItemId,
          quantityReturned: body.quantityReturned || body.returnQuantity || 0,
          unitCost: body.unitCost ?? 0,
          totalCost: body.totalCost ?? 0,
          returnReason: body.returnReason,
          conditionNotes: body.conditionNotes
        };
        const created = await storage6.createReturnItem(data);
        res.json(created);
      } catch (err) {
        res.status(500).json({ message: "Failed to create return item" });
      }
    });
    router11.put("/:id", async (req, res) => {
      try {
        const updated = await storage6.updateReturn(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: "Return not found" });
        res.json(updated);
      } catch (err) {
        res.status(500).json({ message: "Failed to update return" });
      }
    });
    router11.delete("/:id", async (req, res) => {
      try {
        await storage6.deleteReturn(req.params.id);
        res.json({ success: true });
      } catch (err) {
        res.status(500).json({ message: "Failed to delete return" });
      }
    });
    receipt_returns_default = router11;
  }
});

// server/routes/receipt-returns-index.ts
var receipt_returns_index_exports = {};
__export(receipt_returns_index_exports, {
  registerReceiptReturnsRoutes: () => registerReceiptReturnsRoutes
});
function registerReceiptReturnsRoutes(app2) {
  app2.use("/api/receipt-returns", receipt_returns_default);
}
var init_receipt_returns_index = __esm({
  "server/routes/receipt-returns-index.ts"() {
    "use strict";
    init_receipt_returns();
  }
});

// server/storage/receipts-storage.ts
import { eq as eq30, sql as sql21 } from "drizzle-orm";
import { randomUUID as randomUUID3 } from "crypto";
var ReceiptsStorage;
var init_receipts_storage = __esm({
  "server/storage/receipts-storage.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_base_storage();
    ReceiptsStorage = class extends BaseStorage2 {
      async getAllReceipts() {
        const results = await db.select({
          receipt: goodsReceiptHeaders,
          customer: customers
        }).from(goodsReceiptHeaders).leftJoin(supplierLpos, eq30(goodsReceiptHeaders.supplierLpoId, supplierLpos.id)).leftJoin(
          salesOrders,
          sql21`${supplierLpos.sourceSalesOrderIds} @> jsonb_build_array(${salesOrders.id}::text)`
        ).leftJoin(customers, eq30(salesOrders.customerId, customers.id));
        const receiptMap = /* @__PURE__ */ new Map();
        results.forEach((row) => {
          const receiptId = row.receipt.id;
          if (!receiptMap.has(receiptId)) {
            const customer = row.customer ? {
              id: row.customer.id,
              name: row.customer.name,
              email: row.customer.email,
              phone: row.customer.phone,
              address: row.customer.address,
              customerType: row.customer.customerType
            } : null;
            receiptMap.set(receiptId, {
              ...row.receipt,
              customer,
              __customerEmbedded: true
            });
          }
        });
        return Array.from(receiptMap.values());
      }
      async createReceipt(data) {
        const base = { ...data };
        if (!base.receiptNumber) base.receiptNumber = `RCPT-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
        if (!base.id) base.id = randomUUID3();
        if (!base.status) base.status = "Pending";
        if (!base.receiptDate) base.receiptDate = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
        const parseInput = { ...base };
        delete parseInput.id;
        let toInsert;
        try {
          toInsert = insertGoodsReceiptHeaderSchema.parse(parseInput);
        } catch (zerr) {
          throw zerr;
        }
        const projected = {
          id: base.id,
          receiptNumber: toInsert.receiptNumber,
          supplierLpoId: toInsert.supplierLpoId,
          supplierId: toInsert.supplierId,
          receiptDate: toInsert.receiptDate,
          expectedDeliveryDate: toInsert.expectedDeliveryDate,
          actualDeliveryDate: toInsert.actualDeliveryDate,
          receivedBy: toInsert.receivedBy,
          status: toInsert.status,
          notes: toInsert.notes,
          totalItems: toInsert.totalItems,
          totalQuantityExpected: toInsert.totalQuantityExpected,
          totalQuantityReceived: toInsert.totalQuantityReceived,
          discrepancyFlag: toInsert.discrepancyFlag
        };
        const [inserted] = await db.insert(goodsReceiptHeaders).values(projected).returning();
        return inserted;
      }
      async getReceiptById(id) {
        const [receipt] = await db.select().from(goodsReceiptHeaders).where(eq30(goodsReceiptHeaders.id, id));
        return receipt || null;
      }
      async updateReceipt(id, data) {
        const parseInput = { ...data };
        delete parseInput.id;
        let toUpdate;
        try {
          toUpdate = insertGoodsReceiptHeaderSchema.partial().parse(parseInput);
        } catch (zerr) {
          throw zerr;
        }
        const [updated] = await db.update(goodsReceiptHeaders).set(toUpdate).where(eq30(goodsReceiptHeaders.id, id)).returning();
        return updated || null;
      }
      async deleteReceipt(id) {
        await db.delete(goodsReceiptHeaders).where(eq30(goodsReceiptHeaders.id, id));
        return { success: true };
      }
    };
  }
});

// server/routes/receipts.ts
import { Router as Router12 } from "express";
import { ZodError } from "zod";
var router12, storage7, receipts_default;
var init_receipts = __esm({
  "server/routes/receipts.ts"() {
    "use strict";
    init_receipts_storage();
    router12 = Router12();
    storage7 = new ReceiptsStorage();
    router12.get("/", async (req, res) => {
      try {
        const receipts = await storage7.getAllReceipts();
        res.json(receipts);
      } catch (err) {
        res.status(500).json({ message: "Failed to fetch receipts" });
      }
    });
    router12.post("/", async (req, res) => {
      try {
        const receipt = await storage7.createReceipt(req.body);
        res.json(receipt);
      } catch (err) {
        if (err instanceof ZodError) {
          res.status(400).json({ message: "Validation error", details: err.errors });
        } else {
          res.status(500).json({ message: "Failed to create receipt", error: err instanceof Error ? err.message : String(err) });
        }
      }
    });
    router12.put("/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updated = await storage7.updateReceipt(id, req.body);
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
    receipts_default = router12;
  }
});

// server/routes/receipts-index.ts
var receipts_index_exports = {};
__export(receipts_index_exports, {
  registerReceiptsRoutes: () => registerReceiptsRoutes
});
function registerReceiptsRoutes(app2) {
  app2.use("/api/receipts", receipts_default);
}
var init_receipts_index = __esm({
  "server/routes/receipts-index.ts"() {
    "use strict";
    init_receipts();
  }
});

// server/index.ts
import dotenv from "dotenv";
import express3 from "express";

// server/middleware/user-resolution.ts
init_uuid();
function resolveUserId(req, _res, next) {
  const headerUser = req.header("x-user-id");
  const sessionUser = req.user?.id;
  if (sessionUser && isValidUUID(sessionUser)) {
    req.resolvedUserId = sessionUser;
  } else if (headerUser && isValidUUID(headerUser)) {
    req.resolvedUserId = headerUser;
  } else {
    req.resolvedUserId = SYSTEM_USER_ID;
  }
  next();
}

// server/routes/index.ts
import { createServer } from "http";

// server/routes/dashboard.ts
init_storage();
function registerDashboardRoutes(app2) {
  app2.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });
}

// server/routes/customers.ts
init_storage();
init_schema();
import { z as z3 } from "zod";
function registerCustomerRoutes(app2) {
  app2.get("/api/customers", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      const page = Math.floor(offset / limit) + 1;
      const filters = {
        customerType: req.query.customerType,
        classification: req.query.classification,
        isActive: req.query.isActive,
        search: req.query.search,
        // Legacy support for name/email search
        name: req.query.name,
        email: req.query.email
      };
      Object.keys(filters).forEach((key) => {
        if (filters[key] === void 0) {
          delete filters[key];
        }
      });
      let customers3;
      let totalCount;
      if (filters.name || filters.email) {
        customers3 = await storage.searchCustomers({ name: filters.name, email: filters.email }, limit, offset);
        const stats = await storage.getCustomerStats();
        totalCount = stats.totalCustomers;
      } else {
        customers3 = await storage.getCustomers(limit, offset, filters);
        totalCount = await storage.getCustomersCount(filters);
      }
      const pagination = {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      };
      res.json({
        customers: customers3,
        pagination
      });
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });
  app2.get("/api/customers/stats", async (req, res) => {
    try {
      const stats = await storage.getCustomerStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching customer stats:", error);
      res.status(500).json({ message: "Failed to fetch customer statistics" });
    }
  });
  app2.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });
  app2.get("/api/customers/:id/details", async (req, res) => {
    try {
      const customerDetails = await storage.getCustomerDetails(req.params.id);
      if (!customerDetails) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customerDetails);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      res.status(500).json({ message: "Failed to fetch customer details" });
    }
  });
  app2.post("/api/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      if (error instanceof Error && error.message.includes("already exists")) {
        return res.status(409).json({
          message: "Duplicate customer",
          error: error.message
        });
      }
      console.error("Error creating customer:", error);
      res.status(500).json({ message: "Failed to create customer" });
    }
  });
  app2.put("/api/customers/:id", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(req.params.id, customerData);
      res.json(customer);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      if (error instanceof Error && error.message.includes("already exists")) {
        return res.status(409).json({
          message: "Duplicate customer",
          error: error.message
        });
      }
      console.error("Error updating customer:", error);
      res.status(500).json({ message: "Failed to update customer" });
    }
  });
}

// server/routes/suppliers.ts
init_storage();
init_schema();
import { z as z4 } from "zod";
function registerSupplierRoutes(app2) {
  app2.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers5 = await storage.getSuppliers();
      res.json(suppliers5);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });
  app2.get("/api/suppliers/:id", async (req, res) => {
    try {
      const supplier = await storage.getSupplier(req.params.id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      console.error("Error fetching supplier:", error);
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });
  app2.post("/api/suppliers", async (req, res) => {
    try {
      const supplierData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(supplierData);
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid supplier data", errors: error.errors });
      }
      console.error("Error creating supplier:", error);
      res.status(500).json({ message: "Failed to create supplier" });
    }
  });
  app2.put("/api/suppliers/:id", async (req, res) => {
    try {
      const supplierData = insertSupplierSchema.partial().parse(req.body);
      const supplier = await storage.updateSupplier(req.params.id, supplierData);
      res.json(supplier);
    } catch (error) {
      if (error instanceof z4.ZodError) {
        return res.status(400).json({ message: "Invalid supplier data", errors: error.errors });
      }
      console.error("Error updating supplier:", error);
      res.status(500).json({ message: "Failed to update supplier" });
    }
  });
  app2.delete("/api/suppliers/:id", async (req, res) => {
    try {
      await storage.deleteSupplier(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      res.status(500).json({ message: "Failed to delete supplier" });
    }
  });
  app2.get("/api/suppliers/:id/details", async (req, res) => {
    try {
      console.log("DEBUG: Route called - supplier details for ID:", req.params.id);
      console.log("DEBUG: Storage object type:", typeof storage);
      console.log("DEBUG: getSupplierDetails method type:", typeof storage.getSupplierDetails);
      if (typeof storage.getSupplierDetails !== "function") {
        console.log("DEBUG: getSupplierDetails is not a function!");
        return res.status(500).json({ message: "Storage method not available" });
      }
      const details = await storage.getSupplierDetails(req.params.id);
      console.log("DEBUG: Storage method result:", details ? "success" : "null");
      if (!details) {
        console.log("DEBUG: Returning 404 - supplier not found");
        return res.status(404).json({ message: "Supplier not found" });
      }
      console.log("DEBUG: Returning details");
      res.json(details);
    } catch (error) {
      console.error("Error fetching supplier details:", error);
      res.status(500).json({ message: "Failed to fetch supplier details" });
    }
  });
  app2.get("/api/suppliers/:id/lpos", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const lpos = await storage.getSupplierLposForDetail(req.params.id, page, limit);
      res.json(lpos);
    } catch (error) {
      console.error("Error fetching supplier LPOs:", error);
      res.status(500).json({ message: "Failed to fetch supplier LPOs" });
    }
  });
  app2.get("/api/suppliers/:id/items", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const items3 = await storage.getSupplierItems(req.params.id, page, limit);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching supplier items:", error);
      res.status(500).json({ message: "Failed to fetch supplier items" });
    }
  });
  app2.get("/api/suppliers/:id/goods-receipts", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const receipts = await storage.getSupplierGoodsReceipts(req.params.id, page, limit);
      res.json(receipts);
    } catch (error) {
      console.error("Error fetching supplier goods receipts:", error);
      res.status(500).json({ message: "Failed to fetch supplier goods receipts" });
    }
  });
  app2.get("/api/suppliers/:id/performance", async (req, res) => {
    try {
      const metrics = await storage.getSupplierPerformanceMetrics(req.params.id);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching supplier performance metrics:", error);
      res.status(500).json({ message: "Failed to fetch supplier performance metrics" });
    }
  });
}

// server/routes/items.ts
init_storage();
init_schema();
import { z as z5 } from "zod";
function registerItemRoutes(app2) {
  app2.get("/api/items", async (req, res) => {
    try {
      const items3 = await storage.getItems();
      res.json(items3);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });
  app2.get("/api/items/barcode/:barcode", async (req, res) => {
    try {
      const item = await storage.getItemByBarcode(req.params.barcode);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching item by barcode:", error);
      res.status(500).json({ message: "Failed to fetch item" });
    }
  });
  app2.post("/api/items", async (req, res) => {
    try {
      const itemData = insertItemSchema.parse(req.body);
      const item = await storage.createItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z5.ZodError) {
        return res.status(400).json({ message: "Invalid item data", errors: error.errors });
      }
      console.error("Error creating item:", error);
      res.status(500).json({ message: "Failed to create item" });
    }
  });
}

// server/routes/enquiries.ts
init_storage();
init_schema();
import { z as z6 } from "zod";
function registerEnquiryRoutes(app2) {
  app2.post("/api/enquiries/:id/send-rfq", async (req, res) => {
    try {
      const enquiryId = req.params.id;
      const { supplierId } = req.body;
      if (!supplierId) {
        return res.status(400).json({ message: "Missing supplierId" });
      }
      await storage.logAuditEvent("enquiry", enquiryId, "send-rfq", void 0, void 0, { supplierId });
      res.json({ message: `RFQ sent to supplier ${supplierId} for enquiry ${enquiryId}` });
    } catch (error) {
      console.error("Error sending RFQ:", error);
      res.status(500).json({ message: "Failed to send RFQ" });
    }
  });
  app2.get("/api/enquiries", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      const filters = {
        status: req.query.status,
        source: req.query.source,
        customerId: req.query.customerId,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        search: req.query.search
      };
      Object.keys(filters).forEach((key) => {
        if (filters[key] === void 0) {
          delete filters[key];
        }
      });
      const enquiries3 = await storage.getEnquiries(limit, offset, Object.keys(filters).length > 0 ? filters : void 0);
      res.json(enquiries3);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      res.status(500).json({ message: "Failed to fetch enquiries" });
    }
  });
  app2.get("/api/enquiries/:id", async (req, res) => {
    try {
      const enquiry = await storage.getEnquiry(req.params.id);
      if (!enquiry) {
        return res.status(404).json({ message: "Enquiry not found" });
      }
      try {
        const items3 = await storage.getEnquiryItems(req.params.id);
        return res.json({ ...enquiry, items: items3 });
      } catch (itemErr) {
        console.warn("Failed to fetch enquiry items for", req.params.id, itemErr);
        return res.json({ ...enquiry, items: [] });
      }
    } catch (error) {
      console.error("Error fetching enquiry:", error);
      res.status(500).json({ message: "Failed to fetch enquiry" });
    }
  });
  app2.post("/api/enquiries", async (req, res) => {
    try {
      console.log("Received enquiry data:", req.body);
      console.log("insertEnquirySchema shape:", insertEnquirySchema.shape);
      const enquiryData = insertEnquirySchema.parse(req.body);
      const enquiry = await storage.createEnquiry(enquiryData);
      res.status(201).json(enquiry);
    } catch (error) {
      if (error instanceof z6.ZodError) {
        console.log("Validation error:", error.errors);
        return res.status(400).json({ message: "Invalid enquiry data", errors: error.errors });
      }
      console.error("Error creating enquiry:", error);
      res.status(500).json({ message: "Failed to create enquiry" });
    }
  });
  app2.put("/api/enquiries/:id", async (req, res) => {
    try {
      const enquiryData = updateEnquirySchema.parse(req.body);
      const enquiry = await storage.updateEnquiry(req.params.id, enquiryData);
      res.json(enquiry);
    } catch (error) {
      if (error instanceof z6.ZodError) {
        console.log("Validation error:", error.errors);
        return res.status(400).json({ message: "Invalid enquiry data", errors: error.errors });
      }
      console.error("Error updating enquiry:", error);
      res.status(500).json({ message: "Failed to update enquiry" });
    }
  });
  app2.delete("/api/enquiries/:id", async (req, res) => {
    try {
      await storage.deleteEnquiry(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      res.status(500).json({ message: "Failed to delete enquiry" });
    }
  });
  app2.get("/api/enquiries/:id/items", async (req, res) => {
    try {
      const items3 = await storage.getEnquiryItems(req.params.id);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching enquiry items:", error);
      res.status(500).json({ message: "Failed to fetch enquiry items" });
    }
  });
  app2.get("/api/enquiry-items", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      console.error("Error fetching all enquiry items:", error);
      res.status(500).json({ message: "Failed to fetch enquiry items" });
    }
  });
  app2.get("/api/enquiry-items/:id", async (req, res) => {
    try {
      const item = await storage.getEnquiryItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Enquiry item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching enquiry item:", error);
      res.status(500).json({ message: "Failed to fetch enquiry item" });
    }
  });
  app2.post("/api/enquiry-items", async (req, res) => {
    try {
      const itemData = insertEnquiryItemSchema.parse(req.body);
      const item = await storage.createEnquiryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z6.ZodError) {
        return res.status(400).json({ message: "Invalid enquiry item data", errors: error.errors });
      }
      console.error("Error creating enquiry item:", error);
      res.status(500).json({ message: "Failed to create enquiry item" });
    }
  });
  app2.post("/api/enquiry-items/bulk", async (req, res) => {
    try {
      const { items: itemsData } = req.body;
      const validatedItems = z6.array(insertEnquiryItemSchema).parse(itemsData);
      const items3 = await storage.bulkCreateEnquiryItems(validatedItems);
      res.status(201).json(items3);
    } catch (error) {
      if (error instanceof z6.ZodError) {
        return res.status(400).json({ message: "Invalid enquiry items data", errors: error.errors });
      }
      console.error("Error creating enquiry items:", error);
      res.status(500).json({ message: "Failed to create enquiry items" });
    }
  });
  app2.put("/api/enquiry-items/:id", async (req, res) => {
    try {
      const itemData = insertEnquiryItemSchema.partial().parse(req.body);
      const item = await storage.updateEnquiryItem(req.params.id, itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z6.ZodError) {
        return res.status(400).json({ message: "Invalid enquiry item data", errors: error.errors });
      }
      console.error("Error updating enquiry item:", error);
      res.status(500).json({ message: "Failed to update enquiry item" });
    }
  });
  app2.delete("/api/enquiry-items/:id", async (req, res) => {
    try {
      await storage.deleteEnquiryItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting enquiry item:", error);
      res.status(500).json({ message: "Failed to delete enquiry item" });
    }
  });
  app2.put("/api/enquiries/:id/attachments", async (req, res) => {
    try {
      const { attachments } = req.body;
      const enquiry = await storage.updateEnquiry(req.params.id, { attachments });
      res.json(enquiry);
    } catch (error) {
      console.error("Error updating enquiry attachments:", error);
      res.status(500).json({ message: "Failed to update enquiry attachments" });
    }
  });
}

// server/routes/requisitions.ts
import { Router } from "express";

// server/storage/index.ts
init_base();
init_user_storage();
init_customer_storage();
init_supplier_storage();
init_item_storage();
init_inventory_storage();
init_enquiry_storage();
init_requisition_storage();
init_audit_storage();
init_quotation_storage();
init_sales_order_storage();
init_delivery_storage();
init_shipment_storage();
init_physical_stock_storage();
init_invoice_storage();
init_modular_storage_clean();

// server/storage/supplier-quote-storage.ts
init_db();
init_schema();
import { eq as eq21, and as and17, gte as gte6, lte as lte5 } from "drizzle-orm";
import { alias as alias2 } from "drizzle-orm/pg-core";
var SupplierQuoteStorage = class {
  static async list(params) {
    const whereClauses = [];
    if (params.supplier && params.supplier !== "" && params.supplier !== "all") {
      whereClauses.push(eq21(quotations.customerId, params.supplier));
    }
    if (params.status && params.status !== "" && params.status !== "all") {
      whereClauses.push(eq21(quotations.status, params.status));
    }
    if (params.dateFrom) {
      whereClauses.push(gte6(quotations.validUntil, params.dateFrom));
    }
    if (params.dateTo) {
      whereClauses.push(lte5(quotations.validUntil, params.dateTo));
    }
    if (params.search && params.search.trim() !== "") {
    }
    if (params.search && params.search.trim() !== "") {
    }
    const suppliers5 = alias2(customers, "suppliers");
    const actualCustomers = alias2(customers, "customers");
    const query = db.select({
      quotation: quotations,
      supplier: suppliers5,
      customer: actualCustomers
    }).from(quotations).leftJoin(suppliers5, eq21(quotations.customerId, suppliers5.id)).leftJoin(salesOrders, eq21(quotations.id, salesOrders.quotationId)).leftJoin(actualCustomers, eq21(salesOrders.customerId, actualCustomers.id));
    let results;
    if (whereClauses.length > 0) {
      results = await query.where(and17(...whereClauses));
    } else {
      results = await query;
    }
    const processedResults = results.map((row) => {
      const supplier = row.supplier ? {
        id: row.supplier.id,
        name: row.supplier.name || row.supplier.customerName || row.supplier.companyName || row.supplier.fullName,
        email: row.supplier.email,
        phone: row.supplier.phone,
        address: row.supplier.address || row.supplier.billingAddress,
        customerType: row.supplier.customerType
      } : null;
      const customer = row.customer ? {
        id: row.customer.id,
        name: row.customer.name || row.customer.customerName || row.customer.companyName || row.customer.fullName,
        email: row.customer.email,
        phone: row.customer.phone,
        address: row.customer.address || row.customer.billingAddress,
        customerType: row.customer.customerType
      } : null;
      return {
        ...row.quotation,
        supplier,
        supplierName: supplier?.name || "Unknown Supplier",
        customer,
        __customerEmbedded: true
      };
    });
    return processedResults;
  }
  static async getById(id) {
    const result = await db.select({
      id: quotations.id,
      quoteNumber: quotations.quoteNumber,
      revision: quotations.revision,
      parentQuotationId: quotations.parentQuotationId,
      revisionReason: quotations.revisionReason,
      supersededAt: quotations.supersededAt,
      supersededBy: quotations.supersededBy,
      isSuperseded: quotations.isSuperseded,
      enquiryId: quotations.enquiryId,
      customerId: quotations.customerId,
      customerType: quotations.customerType,
      status: quotations.status,
      quoteDate: quotations.quoteDate,
      validUntil: quotations.validUntil,
      subtotal: quotations.subtotal,
      discountPercentage: quotations.discountPercentage,
      discountAmount: quotations.discountAmount,
      taxAmount: quotations.taxAmount,
      totalAmount: quotations.totalAmount,
      terms: quotations.terms,
      notes: quotations.notes,
      approvalStatus: quotations.approvalStatus,
      requiredApprovalLevel: quotations.requiredApprovalLevel,
      approvedBy: quotations.approvedBy,
      approvedAt: quotations.approvedAt,
      rejectionReason: quotations.rejectionReason,
      createdBy: quotations.createdBy,
      createdAt: quotations.createdAt,
      updatedAt: quotations.updatedAt,
      // Add supplier name from customers table
      supplierName: customers.name
    }).from(quotations).leftJoin(customers, eq21(quotations.customerId, customers.id)).where(eq21(quotations.id, id)).limit(1);
    return result[0];
  }
  static async getItems(quoteId) {
    return await db.select().from(quotationItems).where(eq21(quotationItems.quotationId, quoteId));
  }
  static async create(data) {
    const [quote] = await db.insert(quotations).values(data).returning();
    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        await db.insert(quotationItems).values({ ...item, quotationId: quote.id });
      }
    }
    return await this.getById(quote.id);
  }
  static async update(id, updates) {
    try {
      const updateData = {
        ...updates,
        updatedAt: /* @__PURE__ */ new Date()
      };
      await db.update(quotations).set(updateData).where(eq21(quotations.id, id));
      return await this.getById(id);
    } catch (error) {
      console.error("Database error in SupplierQuoteStorage.update:", error);
      throw new Error(`Failed to update supplier quote: ${error instanceof Error ? error.message : "Unknown database error"}`);
    }
  }
  static async hasReferences(id) {
    const [salesOrderRefs, customerAcceptanceRefs, purchaseOrderRefs] = await Promise.all([
      db.select({ id: salesOrders.id }).from(salesOrders).where(eq21(salesOrders.quotationId, id)).limit(1),
      db.select({ id: customerAcceptances.id }).from(customerAcceptances).where(eq21(customerAcceptances.quotationId, id)).limit(1),
      db.select({ id: purchaseOrders.id }).from(purchaseOrders).where(eq21(purchaseOrders.quotationId, id)).limit(1)
    ]);
    return salesOrderRefs.length > 0 || customerAcceptanceRefs.length > 0 || purchaseOrderRefs.length > 0;
  }
  static async delete(id) {
    await db.transaction(async (tx) => {
      await tx.delete(quotationItems).where(eq21(quotationItems.quotationId, id));
      await tx.delete(quotations).where(eq21(quotations.id, id));
    });
    return { message: "Supplier quote deleted successfully" };
  }
};

// server/storage/index.ts
init_modular_storage_clean();
var storage2 = new ModularStorage();

// server/routes/requisitions.ts
init_schema();
import { z as z7 } from "zod";
var router = Router();
router.get("/", async (req, res) => {
  try {
    const {
      page = "1",
      limit = "20",
      status,
      priority,
      department,
      dateFrom,
      dateTo,
      search
    } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    const filters = {
      status,
      priority,
      department,
      dateFrom,
      dateTo,
      search
    };
    Object.keys(filters).forEach((key) => {
      if (filters[key] === void 0 || filters[key] === "") {
        delete filters[key];
      }
    });
    const requisitions2 = await storage2.getRequisitions(limitNum, offset, filters);
    const total = await storage2.getRequisitionsCount(filters);
    res.json({
      data: requisitions2,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error("Error getting requisitions:", error);
    res.status(500).json({
      message: "Failed to get requisitions",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const requisition = await storage2.getRequisition(id);
    if (!requisition) {
      return res.status(404).json({ message: "Requisition not found" });
    }
    res.json(requisition);
  } catch (error) {
    console.error("Error getting requisition:", error);
    res.status(500).json({
      message: "Failed to get requisition",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router.get("/:id/items", async (req, res) => {
  try {
    const { id } = req.params;
    const items3 = await storage2.getRequisitionItems(id);
    res.json(items3);
  } catch (error) {
    console.error("Error getting requisition items:", error);
    res.status(500).json({
      message: "Failed to get requisition items",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router.post("/", async (req, res) => {
  try {
    const validatedData = insertRequisitionSchema.parse(req.body);
    const requisition = await storage2.createRequisition(validatedData);
    res.status(201).json(requisition);
  } catch (error) {
    console.error("Error creating requisition:", error);
    if (error instanceof z7.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors
      });
    }
    res.status(500).json({
      message: "Failed to create requisition",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = insertRequisitionSchema.partial().parse(req.body);
    const requisition = await storage2.updateRequisition(id, validatedData);
    res.json(requisition);
  } catch (error) {
    console.error("Error updating requisition:", error);
    if (error instanceof z7.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors
      });
    }
    res.status(500).json({
      message: "Failed to update requisition",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage2.deleteRequisition(id);
    if (!success) {
      return res.status(404).json({ message: "Requisition not found" });
    }
    res.json({ message: "Requisition deleted successfully" });
  } catch (error) {
    console.error("Error deleting requisition:", error);
    res.status(500).json({
      message: "Failed to delete requisition",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router.post("/:id/items", async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = insertRequisitionItemSchema.parse({
      ...req.body,
      requisitionId: id
    });
    const item = await storage2.createRequisitionItem(validatedData);
    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating requisition item:", error);
    if (error instanceof z7.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors
      });
    }
    res.status(500).json({
      message: "Failed to create requisition item",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router.put("/items/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const validatedData = insertRequisitionItemSchema.partial().parse(req.body);
    const item = await storage2.updateRequisitionItem(itemId, validatedData);
    res.json(item);
  } catch (error) {
    console.error("Error updating requisition item:", error);
    if (error instanceof z7.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors
      });
    }
    res.status(500).json({
      message: "Failed to update requisition item",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router.delete("/items/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const success = await storage2.deleteRequisitionItem(itemId);
    if (!success) {
      return res.status(404).json({ message: "Requisition item not found" });
    }
    res.json({ message: "Requisition item deleted successfully" });
  } catch (error) {
    console.error("Error deleting requisition item:", error);
    res.status(500).json({
      message: "Failed to delete requisition item",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router.get("/search/:searchTerm", async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const requisitions2 = await storage2.searchRequisitions(searchTerm);
    res.json(requisitions2);
  } catch (error) {
    console.error("Error searching requisitions:", error);
    res.status(500).json({
      message: "Failed to search requisitions",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
var requisitions_default = router;

// server/routes/material-requests.ts
import { Router as Router2 } from "express";
init_schema();
import { z as z8 } from "zod";
var router2 = Router2();
console.log("[routes] material-requests alias router initializing");
router2.get("/", async (req, res) => {
  try {
    const { page = "1", limit = "20", status, priority, department, dateFrom, dateTo, search, include } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    const filters = { status, priority, department, dateFrom, dateTo, search };
    Object.keys(filters).forEach((key) => {
      if (filters[key] === void 0) delete filters[key];
    });
    const requests = await storage2.getRequisitions(limitNum, offset, filters);
    if (include === "items") {
      const withItems = await Promise.all(requests.map(async (r) => {
        try {
          const items3 = await storage2.getRequisitionItems(r.id);
          return { ...r, items: items3 };
        } catch {
          return { ...r, items: [] };
        }
      }));
      return res.json(withItems);
    }
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch material requests", error });
  }
});
router2.get("/:id", async (req, res) => {
  try {
    const request = await storage2.getRequisition(req.params.id);
    if (!request) return res.status(404).json({ message: "Material request not found" });
    let items3 = [];
    try {
      items3 = await storage2.getRequisitionItems(req.params.id);
    } catch (e) {
      items3 = [];
    }
    res.json({ ...request, items: items3 });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch material request", error });
  }
});
router2.post("/", async (req, res) => {
  try {
    const { items: items3 = [], ...header } = req.body || {};
    if (!header.totalEstimatedCost && Array.isArray(items3)) {
      header.totalEstimatedCost = items3.reduce((sum4, it) => sum4 + Number(it.quantity) * Number(it.estimatedCost || 0), 0);
    }
    if (header.requiredDate && typeof header.requiredDate !== "string") {
      header.requiredDate = new Date(header.requiredDate).toISOString();
    }
    const validatedData = insertRequisitionSchema.parse(header);
    const created = await storage2.createRequisition(validatedData);
    const createdItems = [];
    for (const item of items3) {
      try {
        const parsedItem = insertRequisitionItemSchema.parse({ ...item, requisitionId: created.id });
        const saved = await storage2.createRequisitionItem(parsedItem);
        createdItems.push(saved);
      } catch (e) {
        console.error("Failed to create requisition item", e);
      }
    }
    res.status(201).json({ ...created, items: createdItems });
  } catch (error) {
    if (error instanceof z8.ZodError) {
      return res.status(400).json({ message: "Invalid material request data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create material request", error });
  }
});
router2.put("/:id", async (req, res) => {
  try {
    const validatedData = insertRequisitionSchema.partial().parse(req.body);
    const updated = await storage2.updateRequisition(req.params.id, validatedData);
    res.json(updated);
  } catch (error) {
    if (error instanceof z8.ZodError) {
      return res.status(400).json({ message: "Invalid material request data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to update material request", error });
  }
});
router2.delete("/:id", async (req, res) => {
  try {
    const success = await storage2.deleteRequisition(req.params.id);
    if (!success) return res.status(404).json({ message: "Material request not found" });
    res.json({ message: "Material request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete material request", error });
  }
});
router2.get("/:id/items", async (req, res) => {
  try {
    const items3 = await storage2.getRequisitionItems(req.params.id);
    res.json(items3);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch request items", error });
  }
});
router2.post("/:id/items", async (req, res) => {
  try {
    const validatedData = insertRequisitionItemSchema.parse({ ...req.body, requisitionId: req.params.id });
    const created = await storage2.createRequisitionItem(validatedData);
    res.status(201).json(created);
  } catch (error) {
    if (error instanceof z8.ZodError) {
      return res.status(400).json({ message: "Invalid request item data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to add request item", error });
  }
});
router2.put("/:id/items/:itemId", async (req, res) => {
  try {
    const validatedData = insertRequisitionItemSchema.partial().parse(req.body);
    const updated = await storage2.updateRequisitionItem(req.params.itemId, validatedData);
    res.json(updated);
  } catch (error) {
    if (error instanceof z8.ZodError) {
      return res.status(400).json({ message: "Invalid request item data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to update request item", error });
  }
});
router2.delete("/:id/items/:itemId", async (req, res) => {
  try {
    const success = await storage2.deleteRequisitionItem(req.params.itemId);
    if (!success) return res.status(404).json({ message: "Request item not found" });
    res.json({ message: "Request item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete request item", error });
  }
});
var material_requests_default = router2;

// server/routes/quotations.ts
init_storage();
init_schema();
init_uuid();

// server/utils/user.ts
init_uuid();
function getAttributingUserId(req) {
  const candidate = req.resolvedUserId || req.body && req.body.userId;
  if (candidate && typeof candidate === "string" && isValidUUID(candidate)) return candidate;
  return SYSTEM_USER_ID;
}
function getOptionalUserId(req) {
  const candidate = req.resolvedUserId || req.body && req.body.userId;
  if (candidate && typeof candidate === "string" && isValidUUID(candidate)) return candidate;
  return void 0;
}

// server/routes/quotations.ts
import { z as z9 } from "zod";

// server/pdf/pdf-utils.ts
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
function fmtCurrency(amount, currency = "BHD") {
  const n = amount == null ? 0 : typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(n)) return `${currency} 0.00`;
  return `${currency} ${n.toFixed(2)}`;
}
function fmtDate(date3) {
  if (!date3) return "";
  try {
    return new Date(date3).toLocaleDateString("en-GB");
  } catch {
    return "";
  }
}
function baseDoc() {
  return new jsPDF();
}
function numberToWords(num2) {
  if (!Number.isFinite(num2)) return "";
  if (num2 === 0) return "Zero";
  const belowTwenty = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function words(n) {
    if (n < 20) return belowTwenty[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? "-" + belowTwenty[n % 10] : "");
    if (n < 1e3) return belowTwenty[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + words(n % 100) : "");
    if (n < 1e6) return words(Math.floor(n / 1e3)) + " Thousand" + (n % 1e3 ? " " + words(n % 1e3) : "");
    if (n < 1e9) return words(Math.floor(n / 1e6)) + " Million" + (n % 1e6 ? " " + words(n % 1e6) : "");
    return words(Math.floor(n / 1e9)) + " Billion" + (n % 1e9 ? " " + words(n % 1e9) : "");
  }
  return words(Math.floor(num2));
}
function amountInWords(total, currency) {
  const integerPart = Math.floor(total);
  const fractional = Math.round((total - integerPart) * 100);
  const words = numberToWords(integerPart) || "Zero";
  return `${currency} ${words} ${fractional > 0 ? fractional + "/100" : ""}`.trim();
}
function buildEnhancedInvoicePdf(ctx) {
  const { invoice, items: items3, customer } = ctx;
  const doc = baseDoc();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(16).setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  const isProforma = String(invoice.invoiceType || "").toLowerCase() === "proforma";
  doc.text(isProforma ? "PROFORMA INVOICE" : "TAX INVOICE", pageWidth / 2, 20, { align: "center" });
  const invoiceDetailsY = 30;
  doc.setFontSize(9).setFont("helvetica", "normal");
  doc.text("Inv No :", pageWidth - 80, invoiceDetailsY);
  doc.text(`INV-${invoice.invoiceNumber}`, pageWidth - 50, invoiceDetailsY);
  doc.text("Date :", pageWidth - 80, invoiceDetailsY + 5);
  doc.text(fmtDate(invoice.invoiceDate || invoice.createdAt), pageWidth - 50, invoiceDetailsY + 5);
  doc.setFontSize(9).setFont("helvetica", "bold");
  doc.text("VAT Reg No : 100004744700962", 20, invoiceDetailsY);
  doc.setFont("helvetica", "normal");
  const companyTableY = 45;
  const coreHead = [["Invoice Type", "Status", "Sales Order", "Delivery", "Payment Terms", "Due Date", "Currency", "Exch Rate"]];
  const coreBody = [[
    invoice.invoiceType || "Final",
    invoice.status || "",
    invoice.salesOrderId ? String(invoice.salesOrderId).slice(0, 8) : "",
    invoice.deliveryId ? String(invoice.deliveryId).slice(0, 8) : "",
    invoice.paymentTerms || "",
    fmtDate(invoice.dueDate),
    invoice.currency || "BHD",
    invoice.exchangeRate || "1.0000"
  ]];
  autoTable(doc, {
    startY: companyTableY,
    head: coreHead,
    body: coreBody,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: "bold" },
    margin: { left: 20, right: 20 },
    didParseCell: (data) => {
      if (data.section === "head") data.cell.styles.halign = "center";
    }
  });
  const afterCompanyTable = doc.lastAutoTable?.finalY + 10 || companyTableY + 25;
  doc.setFontSize(9).setFont("helvetica", "bold");
  doc.text("Customer Name :", 20, afterCompanyTable);
  doc.text("Deliver To :", pageWidth / 2 + 20, afterCompanyTable);
  doc.setFont("helvetica", "normal");
  const customerName = customer.customerName || customer.name || "Customer";
  doc.text(customerName.toUpperCase(), 20, afterCompanyTable + 8);
  const custDetailsY = afterCompanyTable + 15;
  const custLines = [
    customer.address || "EX KANDO POLYTHENE AND PROJECTS",
    customer.email || "Building 574, Road 381 Manama Centre",
    customer.phone || "Office Block 302, Manama,",
    customer.taxId ? `TRN :${customer.taxId}` : "TRN :20000001520002"
  ];
  custLines.forEach((line, idx) => {
    doc.text(line, 20, custDetailsY + idx * 5);
  });
  const deliverLines = [
    "EX KANDO POLYTHENE AND PROJECTS",
    "Building 574, Road 381 Manama Centre, Office Block 302",
    "Manama"
  ];
  deliverLines.forEach((line, idx) => {
    doc.text(line, pageWidth / 2 + 20, custDetailsY + idx * 5);
  });
  const tableStartY = custDetailsY + 35;
  const currency = invoice.currency || "BHD";
  const rows = items3.map((it, i) => {
    const qty = Number(it.quantity) || 0;
    const rate = Number(it.unitPrice) || 0;
    const discountRate = Number(it.discountPercentage) || 0;
    const discountAmount2 = rate * qty * discountRate / 100;
    const netAmount = rate * qty - discountAmount2;
    const vatRate = Number(it.taxRate) || 10;
    const vatAmount = netAmount * vatRate / 100;
    const lineTotal = netAmount + vatAmount;
    let enhancedDesc = it.description || "Item Description";
    if (it.supplierCode) enhancedDesc += `
Supplier Code: ${it.supplierCode}`;
    if (it.barcode) enhancedDesc += `
Barcode: ${it.barcode}`;
    if (it.item?.category) enhancedDesc += `
Category: ${it.item.category}`;
    return [
      (i + 1).toString(),
      enhancedDesc,
      `${qty} PCS`,
      `${currency} ${rate.toFixed(3)}`,
      discountRate > 0 ? `${discountRate.toFixed(1)}%` : "0%",
      `${currency} ${discountAmount2.toFixed(2)}`,
      `${currency} ${netAmount.toFixed(2)}`,
      `${vatRate}%`,
      `${currency} ${vatAmount.toFixed(2)}`,
      `${currency} ${lineTotal.toFixed(2)}`
    ];
  });
  autoTable(doc, {
    startY: tableStartY,
    head: [["Sl.", "Description & Item Details", "Qty", "Unit Rate", "Disc. %", "Disc. Amt", "Net Amount", "VAT %", "VAT Amt", "Line Total"]],
    body: rows,
    styles: {
      fontSize: 7,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      valign: "middle"
    },
    headStyles: {
      fillColor: [255, 255, 255],
      // White background
      textColor: [0, 0, 0],
      // Black text
      fontStyle: "bold",
      halign: "center"
    },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      1: { cellWidth: 60, halign: "left" },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 20, halign: "right" },
      4: { cellWidth: 15, halign: "center" },
      5: { cellWidth: 18, halign: "right" },
      6: { cellWidth: 20, halign: "right" },
      7: { cellWidth: 12, halign: "center" },
      8: { cellWidth: 18, halign: "right" },
      9: { cellWidth: 20, halign: "right", fontStyle: "bold" }
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    margin: { left: 15, right: 15 }
  });
  const afterItemsTable = doc.lastAutoTable?.finalY || tableStartY + 40;
  const subtotal = Number(invoice.subtotal) || items3.reduce((sum4, it) => sum4 + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
  const discountPerc = Number(invoice.discountPercentage) || 0;
  const discountAmount = Number(invoice.discountAmount) || subtotal * discountPerc / 100;
  const taxRate = Number(invoice.taxRate) || 0;
  const taxAmount = Number(invoice.taxAmount) || (subtotal - discountAmount) * taxRate / 100;
  const total = Number(invoice.totalAmount) || subtotal - discountAmount + taxAmount;
  const paidAmount = Number(invoice.paidAmount) || 0;
  const outstandingAmount = Number(invoice.outstandingAmount) || total - paidAmount;
  const subtotalBase = Number(invoice.subtotalBase) || 0;
  const discountAmountBase = Number(invoice.discountAmountBase) || 0;
  const taxAmountBase = Number(invoice.taxAmountBase) || 0;
  const totalAmountBase = Number(invoice.totalAmountBase) || 0;
  const baseCurrency = invoice.baseCurrency || invoice.currency || "BHD";
  const finStartY = afterItemsTable + 5;
  autoTable(doc, {
    startY: finStartY,
    head: [[`${currency} Summary`, "Amount"]],
    body: [
      ["Subtotal", subtotal.toFixed(2)],
      ["Discount", discountAmount.toFixed(2)],
      ["Tax Rate", taxRate.toFixed(2) + "%"],
      ["Tax Amount", taxAmount.toFixed(2)],
      ["Total", total.toFixed(2)],
      ["Paid", paidAmount.toFixed(2)],
      ["Outstanding", outstandingAmount.toFixed(2)]
    ],
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [220, 220, 220], textColor: 0, fontStyle: "bold" },
    columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 30, halign: "right" } },
    margin: { left: 20 }
  });
  if (baseCurrency && baseCurrency !== currency) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 3,
      head: [[`${baseCurrency} Base Summary`, "Amount"]],
      body: [
        ["Subtotal (Base)", subtotalBase.toFixed(2)],
        ["Discount (Base)", discountAmountBase.toFixed(2)],
        ["Tax (Base)", taxAmountBase.toFixed(2)],
        ["Total (Base)", totalAmountBase.toFixed(2)]
      ],
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: "bold" },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 30, halign: "right" } },
      margin: { left: 90 }
    });
  }
  const summaryY = doc.lastAutoTable?.finalY + 8;
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  const summaryItems = [
    ["Amount Chargeable (in words):", ""],
    [amountInWords(total, currency), ""],
    ["Subtotal:", subtotal.toFixed(2)],
    ["Discount:", discountAmount.toFixed(2)],
    ["Tax:", taxAmount.toFixed(2)],
    ["Total*:", total.toFixed(2)],
    ["Paid:", paidAmount.toFixed(2)],
    ["Outstanding:", outstandingAmount.toFixed(2)]
  ];
  let currentY = summaryY;
  summaryItems.forEach(([label, amount], idx) => {
    if (idx < 2) {
      doc.setFont("helvetica", "bold").setFontSize(8);
      doc.text(label, 20, currentY);
      if (amount) {
        doc.setFont("helvetica", "normal");
        doc.text(amount, 20, currentY + 5);
      }
      currentY += idx === 0 ? 5 : 10;
    } else {
      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.text(label, pageWidth - 80, currentY);
      doc.setFont("helvetica", "bold");
      doc.text(`${currency} ${amount}`, pageWidth - 25, currentY, { align: "right" });
      if (label.includes("Total*")) {
        doc.line(pageWidth - 80, currentY + 1, pageWidth - 20, currentY + 1);
      }
      currentY += 6;
    }
  });
  const notesY = currentY + 6;
  doc.setFont("helvetica", "bold").setFontSize(8).text("Notes:", 20, notesY);
  doc.setFont("helvetica", "normal");
  const notes = invoice.notes || "---";
  const internalNotes = invoice.internalNotes || "";
  const returnReason = invoice.returnReason || "";
  const splitNotes = doc.splitTextToSize(notes, pageWidth - 40);
  doc.text(splitNotes, 20, notesY + 4);
  let afterNotesY = notesY + 4 + splitNotes.length * 4;
  if (internalNotes) {
    doc.setFont("helvetica", "bold").text("Internal Notes:", 20, afterNotesY + 2);
    doc.setFont("helvetica", "normal");
    const intLines = doc.splitTextToSize(internalNotes, pageWidth - 40);
    doc.text(intLines, 20, afterNotesY + 6);
    afterNotesY += 6 + intLines.length * 4;
  }
  if (returnReason) {
    doc.setFont("helvetica", "bold").text("Return Reason:", 20, afterNotesY + 2);
    doc.setFont("helvetica", "normal");
    const rrLines = doc.splitTextToSize(returnReason, pageWidth - 40);
    doc.text(rrLines, 20, afterNotesY + 6);
    afterNotesY += 6 + rrLines.length * 4;
  }
  const termsY = afterNotesY + 6;
  doc.setFont("helvetica", "bold").setFontSize(8).text("Declaration:", 20, termsY);
  doc.setFont("helvetica", "normal").text("We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.", 20, termsY + 4, { maxWidth: pageWidth - 40 });
  const bottomY = termsY + 18;
  doc.setFontSize(7).text("CK 6491-1, Reg.Address: Building 728, Road 2012, Town 2564, Country:Bahrain", 20, bottomY);
  const metaLeftY = bottomY + 6;
  doc.setFont("helvetica", "bold").setFontSize(7).text("Created:", 20, metaLeftY);
  doc.setFont("helvetica", "normal").text(fmtDate(invoice.createdAt), 40, metaLeftY);
  doc.setFont("helvetica", "bold").text("Updated:", 20, metaLeftY + 4);
  doc.setFont("helvetica", "normal").text(fmtDate(invoice.updatedAt), 40, metaLeftY + 4);
  if (invoice.paymentMethod) {
    doc.setFont("helvetica", "bold").text("Payment Method:", 20, metaLeftY + 8);
    doc.setFont("helvetica", "normal").text(String(invoice.paymentMethod), 50, metaLeftY + 8);
  }
  if (invoice.paymentReference) {
    doc.setFont("helvetica", "bold").text("Payment Ref:", 20, metaLeftY + 12);
    doc.setFont("helvetica", "normal").text(String(invoice.paymentReference), 50, metaLeftY + 12);
  }
  if (invoice.lastPaymentDate) {
    doc.setFont("helvetica", "bold").text("Last Payment:", 20, metaLeftY + 16);
    doc.setFont("helvetica", "normal").text(fmtDate(invoice.lastPaymentDate), 50, metaLeftY + 16);
  }
  doc.setFont("helvetica", "bold").text("for GOLDEN STYLE W.L.L", pageWidth - 80, bottomY + 8);
  doc.setFont("helvetica", "normal").text("Authorised Signatory", pageWidth - 80, bottomY + 16);
  const footerY = pageHeight - 20;
  doc.setFontSize(7).setTextColor(0);
  doc.text("Generated by GT ERP", 20, footerY);
  doc.text((/* @__PURE__ */ new Date()).toLocaleDateString(), pageWidth - 20, footerY, { align: "right" });
  return Buffer.from(doc.output("arraybuffer"));
}
function buildSimpleInvoicePdf(ctx) {
  const { invoice } = ctx;
  const doc = baseDoc();
  doc.setFontSize(16).setFont("helvetica", "bold").text("INVOICE", 20, 20);
  doc.setFontSize(10).setFont("helvetica", "normal").text(`Invoice #: ${invoice.invoiceNumber}`, 20, 30);
  return Buffer.from(doc.output("arraybuffer"));
}
function generateInvoicePdf(ctx) {
  const buffer = ctx.mode === "simple" ? buildSimpleInvoicePdf(ctx) : buildEnhancedInvoicePdf(ctx);
  return { buffer, byteLength: buffer.length, fileName: `invoice-${ctx.invoice.invoiceNumber}.pdf`, contentType: "application/pdf" };
}
function generateQuotationPdf(ctx) {
  if (ctx.mode === "simple") {
    const { quotation: quotation2, items: items4, customer: customer2 } = ctx;
    const doc2 = baseDoc();
    doc2.setFontSize(18).setFont("helvetica", "bold").text("QUOTATION", 20, 20);
    doc2.setFontSize(10).setFont("helvetica", "normal");
    doc2.text(`Quote #: ${quotation2.quotationNumber || quotation2.quoteNumber}`, 20, 30);
    doc2.text(`Date: ${fmtDate(quotation2.quotationDate || quotation2.quoteDate || quotation2.createdAt)}`, 20, 36);
    doc2.setFont("helvetica", "bold").text("Customer:", 20, 48);
    doc2.setFont("helvetica", "normal").text(customer2.customerName || customer2.name || "", 20, 54);
    const rows = items4.map((it, i) => [
      (i + 1).toString(),
      it.description || "",
      it.quantity.toString(),
      fmtCurrency(it.unitPrice, quotation2.currency || "BHD"),
      fmtCurrency(it.lineTotal, quotation2.currency || "BHD")
    ]);
    autoTable(doc2, { startY: 70, head: [["#", "Description", "Qty", "Unit", "Total"]], body: rows, styles: { fontSize: 8 }, headStyles: { fillColor: [255, 255, 255], textColor: 0 } });
    const buffer2 = Buffer.from(doc2.output("arraybuffer"));
    return { buffer: buffer2, byteLength: buffer2.length, fileName: `quotation-${quotation2.quotationNumber || quotation2.quoteNumber}.pdf`, contentType: "application/pdf" };
  }
  const { quotation, items: items3, customer } = ctx;
  const doc = baseDoc();
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFontSize(16).setFont("helvetica", "bold").text("QUOTATION", pageWidth / 2, 15, { align: "center" });
  doc.setFontSize(8).setFont("helvetica", "normal");
  const customerCode = customer.customerCode || customer.code || "";
  const salesPerson = quotation.salesPerson || quotation.createdBy || "";
  const paymentTerms = quotation.terms ? quotation.terms.split("\n")[0].slice(0, 40) : "30 Days";
  const leadTime = quotation.leadTime || "10 days after receiving agreed LPO";
  const qDate = fmtDate(quotation.quoteDate || quotation.createdAt);
  const validUntil = fmtDate(quotation.validUntil);
  autoTable(doc, {
    startY: 22,
    head: [["Quotation No", "Quotation Date", "Customer Code", "Sales Person", "Payment Terms", "Lead Time / Validity"]],
    body: [[
      quotation.quotationNumber || quotation.quoteNumber,
      qDate,
      customerCode,
      String(salesPerson).slice(0, 12),
      paymentTerms,
      validUntil || leadTime
    ]],
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: "bold" },
    margin: { left: 15, right: 15 }
  });
  const afterMeta = doc.lastAutoTable.finalY + 3;
  const addressLines = [
    customer.customerName || customer.name || "",
    customer.address || "",
    customer.email || "",
    customer.phone || customer.phone || ""
  ].filter(Boolean);
  const addressText = addressLines.length ? addressLines.join("\n") : "N/A";
  const contactPerson = quotation.contactPerson || customer.contactPerson || "---";
  const contactLines = [contactPerson, customer.contactEmail || customer.email || "", customer.contactPhone || customer.phone || ""].filter(Boolean).join("\n");
  autoTable(doc, {
    startY: afterMeta,
    body: [
      [{ content: "Customer Name & Address:\n" + addressText, styles: { halign: "left" } }, { content: "Customer Contact Person:\n" + contactLines, styles: { halign: "left" } }]
    ],
    styles: { fontSize: 7, cellPadding: 3 },
    columnStyles: { 0: { cellWidth: (pageWidth - 30) / 2 }, 1: { cellWidth: (pageWidth - 30) / 2 } },
    theme: "grid",
    margin: { left: 15, right: 15 }
  });
  const afterAddress = doc.lastAutoTable.finalY + 5;
  const currency = quotation.currency || "BHD";
  const itemRows = items3.map((it, i) => {
    const qty = Number(it.quantity) || 0;
    const unit = Number(it.unitPrice) || 0;
    const discPerc = Number(quotation.discountPercentage) || 0;
    const gross = qty * unit;
    const discAmt = gross * discPerc / 100;
    const net = gross - discAmt;
    const vatPerc = Number(quotation.taxRate) || 0;
    const vatAmt = net * vatPerc / 100;
    const lineTotal = net + vatAmt;
    let enhancedDesc = it.description || "Product Description";
    if (it.supplierCode) enhancedDesc += `
Code: ${it.supplierCode}`;
    if (it.barcode) enhancedDesc += `
Barcode: ${it.barcode}`;
    if (it.item?.category) enhancedDesc += `
Category: ${it.item.category}`;
    if (it.specifications) enhancedDesc += `
Specs: ${it.specifications}`;
    return [
      (i + 1).toString(),
      enhancedDesc,
      `${qty} PCS`,
      `${currency} ${unit.toFixed(3)}`,
      discPerc ? `${discPerc.toFixed(1)}%` : "0%",
      `${currency} ${discAmt.toFixed(2)}`,
      `${currency} ${net.toFixed(2)}`,
      vatPerc ? `${vatPerc.toFixed(1)}%` : "0%",
      `${currency} ${vatAmt.toFixed(2)}`,
      `${currency} ${lineTotal.toFixed(2)}`
    ];
  });
  autoTable(doc, {
    startY: afterAddress,
    head: [["Sl.", "Item Description & Specifications", "Qty", "Unit Rate", "Disc.%", "Disc. Amt", "Net Total", "VAT %", "VAT Amt", "Line Total"]],
    body: itemRows,
    styles: {
      fontSize: 7,
      cellPadding: 2,
      valign: "middle",
      lineColor: [0, 0, 0],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [255, 255, 255],
      // White background
      textColor: [0, 0, 0],
      // Black text
      fontStyle: "bold",
      halign: "center"
    },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      1: { cellWidth: 55, halign: "left" },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 20, halign: "right" },
      4: { cellWidth: 15, halign: "center" },
      5: { cellWidth: 18, halign: "right" },
      6: { cellWidth: 20, halign: "right" },
      7: { cellWidth: 12, halign: "center" },
      8: { cellWidth: 18, halign: "right" },
      9: { cellWidth: 20, halign: "right", fontStyle: "bold" }
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    margin: { left: 15, right: 15 }
  });
  const afterItems = doc.lastAutoTable.finalY + 4;
  const subtotal = Number(quotation.subtotal) || itemRows.reduce((s, r) => s + Number(r[7]), 0);
  const discountAmount = Number(quotation.discountAmount) || 0;
  const taxAmount = Number(quotation.taxAmount) || 0;
  const totalAmount = Number(quotation.totalAmount) || subtotal - discountAmount + taxAmount;
  autoTable(doc, {
    startY: afterItems,
    theme: "plain",
    body: [
      ["Total Amount", subtotal.toFixed(2)],
      ["Discount Amount", discountAmount.toFixed(2)],
      ["VAT Amount", taxAmount.toFixed(2)],
      ["Grand Total", totalAmount.toFixed(2)]
    ],
    styles: { fontSize: 7, cellPadding: 2 },
    columnStyles: { 0: { halign: "right", cellWidth: 40, fontStyle: "bold" }, 1: { halign: "right", cellWidth: 25, fontStyle: "bold" } },
    margin: { left: pageWidth - 15 - 65, right: 15 }
  });
  const afterSummary = doc.lastAutoTable.finalY + 6;
  doc.setFont("helvetica", "bold").setFontSize(7).text(`${currency} In Words:`, 15, afterSummary);
  doc.setFont("helvetica", "normal");
  doc.text(amountInWords(totalAmount, currency) + " ONLY", 15, afterSummary + 4);
  const remarks = quotation.notes || quotation.terms || "";
  const remarksLines = doc.splitTextToSize("Remarks:\n" + (remarks || "---"), pageWidth - 30);
  autoTable(doc, {
    startY: afterSummary + 8,
    body: [[{ content: remarksLines.join("\n"), styles: { fontSize: 7, halign: "left" } }]],
    styles: { cellPadding: 3 },
    margin: { left: 15, right: 15 },
    theme: "grid"
  });
  const afterRemarks = doc.lastAutoTable.finalY + 6;
  const validity = validUntil ? `This quote is valid until ${validUntil}` : "This quote is valid for 15 days";
  doc.setFont("helvetica", "normal").setFontSize(7).text(validity, 15, afterRemarks);
  const sigY = afterRemarks + 14;
  doc.setFont("helvetica", "normal").text("_________________________", 15, sigY);
  doc.text("_________________________", pageWidth / 2 + 20, sigY);
  doc.setFont("helvetica", "bold").setFontSize(7).text("Authorized Signatory", 15, sigY + 5);
  doc.text("Customer Signature Date & Stamp", pageWidth / 2 + 20, sigY + 5);
  const buffer = Buffer.from(doc.output("arraybuffer"));
  return { buffer, byteLength: buffer.length, fileName: `quotation-${quotation.quotationNumber || quotation.quoteNumber}.pdf`, contentType: "application/pdf" };
}

// server/utils/pdf-response.ts
function sendPdf(res, result) {
  res.setHeader("Content-Type", result.contentType || "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${result.fileName}"`);
  res.setHeader("Content-Length", result.byteLength);
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.send(result.buffer);
}

// server/routes/quotations.ts
function registerQuotationRoutes(app2) {
  app2.use("/api/quotations/:id", (req, res, next) => {
    console.log("[QUOTATION ROUTE DEBUG]", {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      params: req.params
    });
    next();
  });
  app2.get("/api/quotations", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      const filters = {
        status: req.query.status,
        customerId: req.query.customerId,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        search: req.query.search
      };
      const quotations3 = await storage.getQuotations(limit, offset, filters);
      res.json(quotations3);
    } catch (error) {
      console.error("Error fetching quotations:", error);
      res.status(500).json({ message: "Failed to fetch quotations" });
    }
  });
  app2.get("/api/quotations/:id", async (req, res) => {
    try {
      const quotation = await storage.getQuotation(req.params.id);
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      res.json(quotation);
    } catch (error) {
      console.error("Error fetching quotation:", error);
      res.status(500).json({ message: "Failed to fetch quotation" });
    }
  });
  app2.post("/api/quotations", async (req, res) => {
    try {
      const quotationData = insertQuotationSchema.parse(req.body);
      const quotation = await storage.createQuotation(quotationData);
      res.status(201).json(quotation);
    } catch (error) {
      if (error instanceof z9.ZodError) {
        return res.status(400).json({ message: "Invalid quotation data", errors: error.errors });
      }
      console.error("Error creating quotation:", error);
      res.status(500).json({ message: "Failed to create quotation" });
    }
  });
  function requireAdminRole(req, res, next) {
    const role = req.header("x-user-role") || req.user && req.user.role;
    if (role === "admin") {
      return next();
    }
    return res.status(403).json({ message: "Forbidden: Admin role required for approval" });
  }
  const quotationStatusUpdateSchema = z9.object({
    status: z9.string().optional(),
    approvalStatus: z9.string().optional(),
    rejectionReason: z9.string().optional()
  }).passthrough();
  app2.put("/api/quotations/:id", requireAdminRole, async (req, res) => {
    try {
      const userId = getAttributingUserId(req);
      const optionalUserId = getOptionalUserId(req);
      const role = req.header("x-user-role") || req.user && req.user.role;
      const now = /* @__PURE__ */ new Date();
      console.log("[QUOTATION STATUS UPDATE - INCOMING]", {
        userId,
        optionalUserId,
        role,
        payload: req.body,
        params: req.params
      });
      console.log("[QUOTATION STATUS UPDATE - USER ID VALIDATION]", {
        userId,
        isValidUUID: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(userId)
      });
      let quotationData;
      try {
        quotationData = quotationStatusUpdateSchema.parse(req.body);
      } catch (zodErr) {
        const zErr = zodErr;
        console.error("[QUOTATION STATUS UPDATE - ZOD ERROR]", zErr.errors, "Payload:", req.body);
        return res.status(400).json({ message: "Invalid quotation data", errors: zErr.errors, received: req.body });
      }
      const allowedStatus = ["Draft", "Sent", "Accepted", "Rejected", "Expired"];
      let updateFields = {};
      if (quotationData.status && allowedStatus.includes(quotationData.status)) {
        updateFields.status = quotationData.status;
      }
      if (typeof quotationData.approvalStatus === "string") {
        updateFields.approvalStatus = quotationData.approvalStatus;
      }
      if (typeof quotationData.rejectionReason === "string") {
        updateFields.rejectionReason = quotationData.rejectionReason;
      }
      if (quotationData.approvalStatus === "Approved") {
        if (optionalUserId) {
          updateFields.approvedBy = optionalUserId;
        }
        updateFields.approvedAt = now;
        updateFields.status = "Accepted";
        updateFields.approvalStatus = "Approved";
        await storage.createQuotationApproval({
          quotationId: req.params.id,
          approverLevel: "Manager",
          // TODO: derive from business logic
          approverId: optionalUserId || void 0,
          status: "Approved",
          comments: "Approved via API"
        });
      } else if (quotationData.approvalStatus === "Rejected") {
        if (optionalUserId) {
          updateFields.approvedBy = optionalUserId;
        }
        updateFields.approvedAt = now;
        updateFields.status = "Rejected";
        updateFields.approvalStatus = "Rejected";
        updateFields.rejectionReason = quotationData.rejectionReason || "Rejected via API";
        await storage.createQuotationApproval({
          quotationId: req.params.id,
          approverLevel: "Manager",
          // TODO: derive from business logic
          approverId: optionalUserId || void 0,
          status: "Rejected",
          comments: updateFields.rejectionReason
        });
      }
      const allowedKeys = ["status", "approvalStatus", "rejectionReason", "approvedBy", "approvedAt"];
      const filteredUpdateFields = {};
      for (const key of allowedKeys) {
        if (key in updateFields) filteredUpdateFields[key] = updateFields[key];
      }
      console.log("[QUOTATION STATUS UPDATE - FILTERED FIELDS]", filteredUpdateFields);
      try {
        const quotation = await storage.updateQuotation(req.params.id, filteredUpdateFields);
        console.log("[QUOTATION STATUS UPDATED]", quotation);
        res.json(quotation);
      } catch (updateErr) {
        const uErr = updateErr;
        console.error("[QUOTATION STATUS UPDATE - UPDATE ERROR]", uErr, "Fields:", filteredUpdateFields);
        res.status(500).json({ message: "Failed to update quotation", error: uErr.message, fields: filteredUpdateFields });
      }
    } catch (error) {
      const err = error;
      console.error("[QUOTATION STATUS UPDATE - UNEXPECTED ERROR]", err);
      res.status(500).json({ message: "Failed to update quotation", error: err.message });
    }
  });
  app2.delete("/api/quotations/:id", async (req, res) => {
    try {
      await storage.deleteQuotation(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting quotation:", error);
      res.status(500).json({ message: "Failed to delete quotation" });
    }
  });
  app2.post("/api/quotations/generate/:enquiryId", async (req, res) => {
    try {
      const userId = req.resolvedUserId || validateUserIdOrDefault(req.body.userId);
      console.log("Generating quotation for enquiry:", req.params.enquiryId);
      const quotation = await storage.generateQuotationFromEnquiry(req.params.enquiryId, userId);
      console.log("Quotation generated successfully:", quotation.id);
      res.status(201).json(quotation);
    } catch (error) {
      console.error("Error generating quotation:", error);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      res.status(500).json({
        message: "Failed to generate quotation from enquiry",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/quotations/:id/revisions", async (req, res) => {
    try {
      const userId = req.resolvedUserId || validateUserIdOrDefault(req.body.userId);
      const revisionData = req.body;
      if (!revisionData.revisionReason) {
        return res.status(400).json({ message: "Revision reason is required" });
      }
      const newRevision = await storage.createQuotationRevision(req.params.id, revisionData, userId);
      res.status(201).json(newRevision);
    } catch (error) {
      console.error("Error creating quotation revision:", error);
      res.status(500).json({ message: "Failed to create quotation revision" });
    }
  });
  app2.get("/api/quotations/:id/revisions", async (req, res) => {
    try {
      const revisions = await storage.getQuotationRevisions(req.params.id);
      res.json(revisions);
    } catch (error) {
      console.error("Error fetching quotation revisions:", error);
      res.status(500).json({ message: "Failed to fetch quotation revisions" });
    }
  });
  app2.get("/api/quotations/:id/history", async (req, res) => {
    try {
      const history = await storage.getQuotationHistory(req.params.id);
      res.json(history);
    } catch (error) {
      console.error("Error fetching quotation history:", error);
      res.status(500).json({ message: "Failed to fetch quotation history" });
    }
  });
  app2.get("/api/quotations/:id/items", async (req, res) => {
    try {
      console.log("Fetching quotation items for quotation ID:", req.params.id);
      const items3 = await storage.getQuotationItems(req.params.id);
      console.log("Found quotation items:", items3.length);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching quotation items:", error);
      res.status(500).json({ message: "Failed to fetch quotation items" });
    }
  });
  app2.post("/api/quotations/:id/items", async (req, res) => {
    try {
      console.log("DEBUG: Attempting to create quotation item with body:", req.body);
      console.log("DEBUG: Quotation ID from params:", req.params.id);
      const itemData = insertQuotationItemSchema.parse({
        ...req.body,
        quotationId: req.params.id
      });
      console.log("DEBUG: Parsed item data:", itemData);
      const item = await storage.createQuotationItem(itemData);
      console.log("DEBUG: Created item:", item);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z9.ZodError) {
        console.error("DEBUG: Zod validation error:", error.errors);
        return res.status(400).json({
          message: "Invalid quotation item data",
          errors: error.errors,
          received: req.body
        });
      }
      console.error("DEBUG: Other error creating quotation item:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        message: "Failed to create quotation item",
        error: errorMessage,
        stack: error instanceof Error ? error.stack : void 0
      });
    }
  });
  app2.put("/api/quotation-items/:id", async (req, res) => {
    try {
      const allowedKeys = ["description", "quantity", "costPrice", "markup", "unitPrice", "lineTotal", "isAccepted", "rejectionReason", "notes"];
      const partial = {};
      for (const key of allowedKeys) {
        if (key in req.body) {
          partial[key] = req.body[key];
        }
      }
      ["quantity"].forEach((k) => {
        if (partial[k] !== void 0) partial[k] = Number(partial[k]);
      });
      const item = await storage.updateQuotationItem(req.params.id, partial);
      res.json(item);
    } catch (error) {
      if (error instanceof z9.ZodError) {
        return res.status(400).json({ message: "Invalid quotation item data", errors: error.errors });
      }
      console.error("Error updating quotation item:", error);
      res.status(500).json({ message: "Failed to update quotation item" });
    }
  });
  app2.delete("/api/quotation-items/:id", async (req, res) => {
    try {
      await storage.deleteQuotationItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting quotation item:", error);
      res.status(500).json({ message: "Failed to delete quotation item" });
    }
  });
  app2.post("/api/quotations/from-enquiry/:enquiryId", async (req, res) => {
    try {
      const enquiryId = req.params.enquiryId;
      const userId = getAttributingUserId(req);
      console.log("Received request to generate quotation from enquiry:", { enquiryId, userId });
      const quotation = await storage.generateQuotationFromEnquiry(enquiryId, userId);
      res.status(201).json(quotation);
    } catch (error) {
      console.error("Error generating quotation from enquiry:", error);
      res.status(500).json({
        message: "Failed to generate quotation from enquiry",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/quotations/:id/pdf", async (req, res) => {
    try {
      const quotationId = req.params.id;
      const quotation = await storage.getQuotation(quotationId);
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      const items3 = await storage.getQuotationItems(quotationId);
      const customer = await storage.getCustomer(quotation.customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      const result = generateQuotationPdf({ quotation, items: items3, customer });
      sendPdf(res, result);
    } catch (error) {
      console.error("Error generating quotation PDF:", error);
      res.status(500).json({ message: "Failed to generate quotation PDF" });
    }
  });
}

// server/routes/approvals.ts
init_storage();
init_schema();
import { z as z10 } from "zod";
function registerApprovalRoutes(app2) {
  app2.get("/api/approval-rules", async (req, res) => {
    try {
      const rules = await storage.getApprovalRules();
      res.json(rules);
    } catch (error) {
      console.error("Error fetching approval rules:", error);
      res.status(500).json({ message: "Failed to fetch approval rules" });
    }
  });
  app2.post("/api/approval-rules", async (req, res) => {
    try {
      const ruleData = insertApprovalRuleSchema.parse(req.body);
      const rule = await storage.createApprovalRule(ruleData);
      res.status(201).json(rule);
    } catch (error) {
      if (error instanceof z10.ZodError) {
        return res.status(400).json({ message: "Invalid approval rule data", errors: error.errors });
      }
      console.error("Error creating approval rule:", error);
      res.status(500).json({ message: "Failed to create approval rule" });
    }
  });
  app2.put("/api/approval-rules/:id", async (req, res) => {
    try {
      const ruleData = insertApprovalRuleSchema.partial().parse(req.body);
      const rule = await storage.updateApprovalRule(req.params.id, ruleData);
      res.json(rule);
    } catch (error) {
      if (error instanceof z10.ZodError) {
        return res.status(400).json({ message: "Invalid approval rule data", errors: error.errors });
      }
      console.error("Error updating approval rule:", error);
      res.status(500).json({ message: "Failed to update approval rule" });
    }
  });
  app2.delete("/api/approval-rules/:id", async (req, res) => {
    try {
      await storage.deleteApprovalRule(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting approval rule:", error);
      res.status(500).json({ message: "Failed to delete approval rule" });
    }
  });
  app2.get("/api/quotations/:id/approvals", async (req, res) => {
    try {
      const approvals = await storage.getQuotationApprovals(req.params.id);
      res.json(approvals);
    } catch (error) {
      console.error("Error fetching quotation approvals:", error);
      res.status(500).json({ message: "Failed to fetch quotation approvals" });
    }
  });
  app2.post("/api/quotations/:id/approvals", async (req, res) => {
    try {
      const approvalData = insertQuotationApprovalSchema.parse({
        ...req.body,
        quotationId: req.params.id
      });
      const approval = await storage.createQuotationApproval(approvalData);
      res.status(201).json(approval);
    } catch (error) {
      if (error instanceof z10.ZodError) {
        return res.status(400).json({ message: "Invalid quotation approval data", errors: error.errors });
      }
      console.error("Error creating quotation approval:", error);
      res.status(500).json({ message: "Failed to create quotation approval" });
    }
  });
}

// server/routes/customer-acceptance.ts
init_storage();
init_schema();
import { z as z11 } from "zod";
function registerCustomerAcceptanceRoutes(app2) {
  app2.get("/api/customer-acceptances", async (req, res) => {
    try {
      const quotationId = req.query.quotationId;
      const acceptances = await storage.getCustomerAcceptances(quotationId);
      res.json(acceptances);
    } catch (error) {
      console.error("Error fetching customer acceptances:", error);
      res.status(500).json({ message: "Failed to fetch customer acceptances" });
    }
  });
  app2.get("/api/customer-acceptances/:id", async (req, res) => {
    try {
      const acceptance = await storage.getCustomerAcceptance(req.params.id);
      if (!acceptance) {
        return res.status(404).json({ message: "Customer acceptance not found" });
      }
      res.json(acceptance);
    } catch (error) {
      console.error("Error fetching customer acceptance:", error);
      res.status(500).json({ message: "Failed to fetch customer acceptance" });
    }
  });
  app2.post("/api/customer-acceptances", async (req, res) => {
    try {
      console.log("[ACCEPTANCE] Create request body:", req.body);
      const acceptanceData = insertCustomerAcceptanceSchema.parse(req.body);
      const acceptance = await storage.createCustomerAcceptance(acceptanceData);
      console.log("[ACCEPTANCE] Created acceptance:", acceptance);
      res.status(201).json(acceptance);
    } catch (error) {
      if (error instanceof z11.ZodError) {
        return res.status(400).json({ message: "Invalid customer acceptance data", errors: error.errors });
      }
      console.error("Error creating customer acceptance:", error);
      res.status(500).json({ message: "Failed to create customer acceptance" });
    }
  });
  app2.put("/api/customer-acceptances/:id", async (req, res) => {
    try {
      const acceptanceData = insertCustomerAcceptanceSchema.partial().parse(req.body);
      const acceptance = await storage.updateCustomerAcceptance(req.params.id, acceptanceData);
      res.json(acceptance);
    } catch (error) {
      if (error instanceof z11.ZodError) {
        return res.status(400).json({ message: "Invalid customer acceptance data", errors: error.errors });
      }
      console.error("Error updating customer acceptance:", error);
      res.status(500).json({ message: "Failed to update customer acceptance" });
    }
  });
  app2.delete("/api/customer-acceptances/:id", async (req, res) => {
    try {
      await storage.deleteCustomerAcceptance(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting customer acceptance:", error);
      res.status(500).json({ message: "Failed to delete customer acceptance" });
    }
  });
  app2.post("/api/customer-acceptances/supersede", async (req, res) => {
    try {
      const { quotationId } = req.body;
      if (!quotationId) {
        return res.status(400).json({ message: "Quotation ID is required" });
      }
      await storage.supersedeActiveAcceptances(quotationId);
      res.json({ message: "Active acceptances superseded successfully" });
    } catch (error) {
      console.error("Error superseding customer acceptances:", error);
      res.status(500).json({ message: "Failed to supersede customer acceptances" });
    }
  });
  app2.get("/api/customer-acceptances/:acceptanceId/item-acceptances", async (req, res) => {
    try {
      const itemAcceptances = await storage.getQuotationItemAcceptances(req.params.acceptanceId);
      res.json(itemAcceptances);
    } catch (error) {
      console.error("Error fetching quotation item acceptances:", error);
      res.status(500).json({ message: "Failed to fetch quotation item acceptances" });
    }
  });
  app2.post("/api/customer-acceptances/:acceptanceId/item-acceptances", async (req, res) => {
    try {
      console.log("[ITEM-ACCEPTANCE] Single create body:", req.body);
      const itemAcceptanceData = insertQuotationItemAcceptanceSchema.parse({
        ...req.body,
        customerAcceptanceId: req.params.acceptanceId
      });
      const itemAcceptance = await storage.createQuotationItemAcceptance(itemAcceptanceData);
      console.log("[ITEM-ACCEPTANCE] Created:", itemAcceptance);
      res.status(201).json(itemAcceptance);
    } catch (error) {
      if (error instanceof z11.ZodError) {
        return res.status(400).json({ message: "Invalid quotation item acceptance data", errors: error.errors });
      }
      console.error("Error creating quotation item acceptance:", error);
      res.status(500).json({ message: "Failed to create quotation item acceptance" });
    }
  });
  app2.post("/api/customer-acceptances/:acceptanceId/item-acceptances/bulk", async (req, res) => {
    try {
      console.log("[ITEM-ACCEPTANCE:BULK] Raw body:", req.body);
      const prepared = req.body.map((item) => ({
        ...item,
        customerAcceptanceId: req.params.acceptanceId,
        originalQuantity: item.originalQuantity ?? item.acceptedQuantity ?? item.rejectedQuantity ?? 0
      }));
      console.log("[ITEM-ACCEPTANCE:BULK] Prepared payload:", prepared);
      const itemAcceptances = prepared.map((item) => insertQuotationItemAcceptanceSchema.parse(item));
      const results = await storage.bulkCreateQuotationItemAcceptances(itemAcceptances);
      console.log("[ITEM-ACCEPTANCE:BULK] Created records count=", results.length);
      res.status(201).json(results);
    } catch (error) {
      if (error instanceof z11.ZodError) {
        return res.status(400).json({ message: "Invalid quotation item acceptance data", errors: error.errors });
      }
      console.error("Error creating quotation item acceptances:", error);
      res.status(500).json({ message: "Failed to create quotation item acceptances" });
    }
  });
}

// server/routes/purchase-orders.ts
init_storage();
init_schema();
import { z as z12 } from "zod";
function registerPurchaseOrderRoutes(app2) {
  app2.get("/api/purchase-orders", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      const quotationId = req.query.quotationId;
      const filters = quotationId ? { quotationId } : {};
      const orders = await storage.getPurchaseOrders(quotationId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      res.status(500).json({ message: "Failed to fetch purchase orders" });
    }
  });
  app2.get("/api/purchase-orders/:id", async (req, res) => {
    try {
      const order = await storage.getPurchaseOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Purchase order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching purchase order:", error);
      res.status(500).json({ message: "Failed to fetch purchase order" });
    }
  });
  app2.post("/api/purchase-orders", async (req, res) => {
    try {
      console.log("[PO] Create payload raw:", req.body);
      const parsed = insertPurchaseOrderSchema.parse(req.body);
      const orderData = { ...parsed, poDate: new Date(parsed.poDate) };
      console.log("[PO] Parsed orderData:", orderData);
      const quotation = await storage.getQuotation(orderData.quotationId);
      if (!quotation) {
        return res.status(400).json({ message: "Quotation not found for purchase order" });
      }
      if (quotation.status !== "Accepted") {
        return res.status(400).json({ message: "Quotation must be Accepted before creating a Purchase Order" });
      }
      let hasAcceptedItem = false;
      const acceptances = await storage.getCustomerAcceptances(orderData.quotationId);
      for (const acc of acceptances) {
        const itemAcceptances = await storage.getQuotationItemAcceptances(acc.id);
        if (itemAcceptances.some((i) => i.isAccepted)) {
          hasAcceptedItem = true;
          break;
        }
      }
      if (!hasAcceptedItem) {
        return res.status(400).json({ message: "No accepted quotation items found; cannot create Purchase Order" });
      }
      const order = await storage.createPurchaseOrder(orderData);
      console.log("[PO] Created order id:", order.id);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z12.ZodError) {
        return res.status(400).json({ message: "Invalid purchase order data", errors: error.errors });
      }
      console.error("Error creating purchase order:", error);
      res.status(500).json({ message: "Failed to create purchase order", error: error?.message });
    }
  });
  app2.put("/api/purchase-orders/:id", async (req, res) => {
    try {
      const orderData = insertPurchaseOrderSchema.partial().parse(req.body);
      const order = await storage.updatePurchaseOrder(req.params.id, orderData);
      res.json(order);
    } catch (error) {
      if (error instanceof z12.ZodError) {
        return res.status(400).json({ message: "Invalid purchase order data", errors: error.errors });
      }
      console.error("Error updating purchase order:", error);
      res.status(500).json({ message: "Failed to update purchase order" });
    }
  });
  app2.delete("/api/purchase-orders/:id", async (req, res) => {
    try {
      await storage.deletePurchaseOrder(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting purchase order:", error);
      res.status(500).json({ message: "Failed to delete purchase order" });
    }
  });
  app2.post("/api/purchase-orders/:id/validate", async (req, res) => {
    try {
      const validationSchema = z12.object({
        status: z12.enum(["Valid", "Invalid", "Requires Review"]),
        notes: z12.string().optional(),
        validatedBy: z12.string().min(1, "Validator ID is required")
      });
      const validationData = validationSchema.parse(req.body);
      const order = await storage.validatePurchaseOrder(req.params.id, validationData);
      res.json(order);
    } catch (error) {
      if (error instanceof z12.ZodError) {
        return res.status(400).json({ message: "Invalid validation data", errors: error.errors });
      }
      console.error("Error validating purchase order:", error);
      res.status(500).json({ message: "Failed to validate purchase order" });
    }
  });
  app2.get("/api/purchase-orders/:poId/line-items", async (req, res) => {
    try {
      const lineItems = await storage.getPoLineItems(req.params.poId);
      res.json(lineItems);
    } catch (error) {
      console.error("Error fetching PO line items:", error);
      res.status(500).json({ message: "Failed to fetch PO line items" });
    }
  });
  app2.post("/api/purchase-orders/:poId/line-items", async (req, res) => {
    try {
      const lineItemData = insertPoLineItemSchema.parse({
        ...req.body,
        purchaseOrderId: req.params.poId
      });
      const lineItem = await storage.createPoLineItem(lineItemData);
      res.status(201).json(lineItem);
    } catch (error) {
      if (error instanceof z12.ZodError) {
        return res.status(400).json({ message: "Invalid PO line item data", errors: error.errors });
      }
      console.error("Error creating PO line item:", error);
      res.status(500).json({ message: "Failed to create PO line item" });
    }
  });
  app2.post("/api/purchase-orders/:poId/line-items/bulk", async (req, res) => {
    try {
      const lineItems = req.body.map(
        (item) => insertPoLineItemSchema.parse({
          ...item,
          purchaseOrderId: req.params.poId
        })
      );
      const results = await storage.bulkCreatePoLineItems(lineItems);
      res.status(201).json(results);
    } catch (error) {
      if (error instanceof z12.ZodError) {
        return res.status(400).json({ message: "Invalid PO line item data", errors: error.errors });
      }
      console.error("Error creating PO line items:", error);
      res.status(500).json({ message: "Failed to create PO line items" });
    }
  });
  app2.post("/api/customer-po-upload", async (req, res) => {
    try {
      const { quotationId, documentPath, documentName, documentType, uploadedBy, poDate, currency, paymentTerms, deliveryTerms, specialInstructions, customerReference } = req.body;
      const missing = [];
      if (!quotationId) missing.push("quotationId");
      if (!documentPath) missing.push("documentPath");
      if (!documentName) missing.push("documentName");
      if (!documentType) missing.push("documentType");
      if (missing.length) {
        return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
      }
      let resolvedUploadedBy = uploadedBy;
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
      if (!resolvedUploadedBy || !uuidRegex.test(resolvedUploadedBy)) {
        if (process.env.SYSTEM_USER_ID && uuidRegex.test(process.env.SYSTEM_USER_ID)) {
          resolvedUploadedBy = process.env.SYSTEM_USER_ID;
        }
      }
      if (!resolvedUploadedBy) {
        const seedSystemUser = "e459998e-0a4d-4652-946e-44b2ba161d16";
        if (uuidRegex.test(seedSystemUser)) {
          resolvedUploadedBy = seedSystemUser;
        } else {
          return res.status(400).json({ message: "Unable to resolve uploadedBy user" });
        }
      }
      const quotation = await storage.getQuotation(quotationId);
      if (!quotation) {
        return res.status(400).json({ message: "Quotation not found" });
      }
      let hasAcceptedItem = false;
      try {
        const acceptances = await storage.getCustomerAcceptances(quotationId);
        for (const acc of acceptances) {
          const itemAcceptances = await storage.getQuotationItemAcceptances(acc.id);
          if (itemAcceptances.some((i) => i.isAccepted)) {
            hasAcceptedItem = true;
            break;
          }
        }
      } catch (e) {
        console.warn("Acceptance lookup failed (continuing):", e);
      }
      if (!hasAcceptedItem && quotation.status !== "Accepted") {
        return res.status(400).json({ message: "No accepted quotation items found; cannot upload PO" });
      }
      const poNumber = storage.generateNumber ? storage.generateNumber("PO") : `PO-${Date.now()}`;
      const poPayload = insertPurchaseOrderSchema.parse({
        quotationId,
        poNumber,
        poDate: poDate ? new Date(poDate) : /* @__PURE__ */ new Date(),
        documentPath,
        documentName,
        documentType,
        uploadedBy: resolvedUploadedBy,
        currency: currency || "BHD",
        paymentTerms: paymentTerms || void 0,
        deliveryTerms: deliveryTerms || void 0,
        specialInstructions: specialInstructions || void 0,
        customerReference: customerReference || void 0
      });
      const purchaseOrder = await storage.createPurchaseOrder(poPayload);
      res.status(201).json(purchaseOrder);
    } catch (error) {
      console.error("Error uploading PO:", error);
      res.status(500).json({ message: "Failed to upload PO" });
    }
  });
  app2.get("/api/customer-acceptances/:acceptanceId/confirmations", async (req, res) => {
    try {
      const confirmations = await storage.getAcceptanceConfirmations(req.params.acceptanceId);
      res.json(confirmations);
    } catch (error) {
      console.error("Error fetching acceptance confirmations:", error);
      res.status(500).json({ message: "Failed to fetch acceptance confirmations" });
    }
  });
  app2.post("/api/customer-acceptances/:acceptanceId/confirmations", async (req, res) => {
    try {
      const confirmationData = insertAcceptanceConfirmationSchema.parse({
        ...req.body,
        customerAcceptanceId: req.params.acceptanceId
      });
      const confirmation = await storage.createAcceptanceConfirmation(confirmationData);
      res.status(201).json(confirmation);
    } catch (error) {
      if (error instanceof z12.ZodError) {
        return res.status(400).json({ message: "Invalid acceptance confirmation data", errors: error.errors });
      }
      console.error("Error creating acceptance confirmation:", error);
      res.status(500).json({ message: "Failed to create acceptance confirmation" });
    }
  });
}

// server/routes/sales-orders.ts
init_storage();
init_schema();
import { z as z13 } from "zod";
function registerSalesOrderRoutes(app2) {
  app2.get("/api/sales-orders", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      const filters = {
        status: req.query.status,
        customerId: req.query.customerId,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        search: req.query.search,
        // Filter for sales orders pending supplier LPO creation
        pendingSupplierLpo: req.query.pendingSupplierLpo === "true"
      };
      Object.keys(filters).forEach((key) => {
        if (filters[key] === void 0) {
          delete filters[key];
        }
      });
      const salesOrders3 = await storage.getSalesOrders(limit, offset, Object.keys(filters).length > 0 ? filters : void 0);
      res.json(salesOrders3);
    } catch (error) {
      console.error("Error fetching sales orders:", error);
      res.status(500).json({ message: "Failed to fetch sales orders" });
    }
  });
  app2.get("/api/sales-orders/:id", async (req, res) => {
    try {
      const salesOrder = await storage.getSalesOrder(req.params.id);
      if (!salesOrder) {
        return res.status(404).json({ message: "Sales order not found" });
      }
      res.json(salesOrder);
    } catch (error) {
      console.error("Error fetching sales order:", error);
      res.status(500).json({ message: "Failed to fetch sales order" });
    }
  });
  app2.post("/api/sales-orders", async (req, res) => {
    try {
      const salesOrderData = insertSalesOrderSchema.parse(req.body);
      const salesOrder = await storage.createSalesOrder(salesOrderData);
      res.status(201).json(salesOrder);
    } catch (error) {
      if (error instanceof z13.ZodError) {
        return res.status(400).json({ message: "Invalid sales order data", errors: error.errors });
      }
      console.error("Error creating sales order:", error);
      res.status(500).json({ message: "Failed to create sales order" });
    }
  });
  app2.put("/api/sales-orders/:id", async (req, res) => {
    try {
      const salesOrderData = insertSalesOrderSchema.partial().parse(req.body);
      const salesOrder = await storage.updateSalesOrder(req.params.id, salesOrderData);
      res.json(salesOrder);
    } catch (error) {
      if (error instanceof z13.ZodError) {
        return res.status(400).json({ message: "Invalid sales order data", errors: error.errors });
      }
      console.error("Error updating sales order:", error);
      res.status(500).json({ message: "Failed to update sales order" });
    }
  });
  app2.delete("/api/sales-orders/:id", async (req, res) => {
    try {
      await storage.deleteSalesOrder(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting sales order:", error);
      res.status(500).json({ message: "Failed to delete sales order" });
    }
  });
  app2.post("/api/sales-orders/from-quotation", async (req, res) => {
    try {
      const { quotationId } = req.body;
      if (!quotationId) {
        return res.status(400).json({ message: "Quotation ID is required" });
      }
      const salesOrder = await storage.createSalesOrderFromQuotation(quotationId, getOptionalUserId(req));
      res.status(201).json(salesOrder);
    } catch (error) {
      console.error("Error creating sales order from quotation:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to create sales order from quotation" });
    }
  });
  app2.post("/api/sales-orders/:id/amend", async (req, res) => {
    try {
      const schema = z13.object({
        reason: z13.string().min(5, "Amendment reason required"),
        userId: z13.string().optional()
      });
      const body = schema.parse(req.body);
      const userIdResolved = body.userId || getOptionalUserId(req);
      const amended = await storage.createAmendedSalesOrder(req.params.id, body.reason, userIdResolved);
      res.status(201).json(amended);
    } catch (error) {
      if (error instanceof z13.ZodError) {
        return res.status(400).json({ message: "Invalid amendment data", errors: error.errors });
      }
      console.error("Error creating amended sales order:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to create amended sales order" });
    }
  });
  app2.put("/api/sales-orders/:id/validate-lpo", async (req, res) => {
    try {
      const validationSchema = z13.object({
        status: z13.enum(["Approved", "Rejected"]),
        notes: z13.string().optional(),
        validatedBy: z13.string().optional(),
        override: z13.boolean().optional()
      });
      const validationData = validationSchema.parse(req.body);
      validationData.validatedBy = validationData.validatedBy || getAttributingUserId(req);
      const existing = await storage.getSalesOrder(req.params.id);
      if (!existing) return res.status(404).json({ message: "Sales order not found" });
      if (existing.customerLpoValidationStatus === "Approved" && validationData.status !== "Approved" && !validationData.override) {
        return res.status(400).json({ message: "LPO already approved; override required to change status" });
      }
      const salesOrder = await storage.validateCustomerLpo(req.params.id, validationData);
      res.json(salesOrder);
    } catch (error) {
      if (error instanceof z13.ZodError) {
        return res.status(400).json({ message: "Invalid validation data", errors: error.errors });
      }
      console.error("Error validating customer LPO:", error);
      res.status(500).json({ message: "Failed to validate customer LPO" });
    }
  });
  app2.get("/api/sales-orders/:id/lineage", async (req, res) => {
    try {
      const lineage = await storage.getSalesOrderLineage(req.params.id);
      res.json({ count: lineage.length, lineage });
    } catch (error) {
      console.error("Error fetching sales order lineage:", error);
      res.status(500).json({ message: "Failed to fetch sales order lineage" });
    }
  });
  app2.get("/api/sales-orders/:id/items", async (req, res) => {
    try {
      const items3 = await storage.getSalesOrderItems(req.params.id);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching sales order items:", error);
      res.status(500).json({ message: "Failed to fetch sales order items" });
    }
  });
  app2.get("/api/sales-order-items/:id", async (req, res) => {
    try {
      const item = await storage.getSalesOrderItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Sales order item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching sales order item:", error);
      res.status(500).json({ message: "Failed to fetch sales order item" });
    }
  });
  app2.post("/api/sales-order-items", async (req, res) => {
    try {
      const itemData = insertSalesOrderItemSchema.parse(req.body);
      const item = await storage.createSalesOrderItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z13.ZodError) {
        return res.status(400).json({ message: "Invalid sales order item data", errors: error.errors });
      }
      console.error("Error creating sales order item:", error);
      res.status(500).json({ message: "Failed to create sales order item" });
    }
  });
  app2.put("/api/sales-order-items/:id", async (req, res) => {
    try {
      const allowedKeys = ["description", "quantity", "unitPrice", "lineTotal", "notes"];
      const partial = {};
      for (const key of allowedKeys) {
        if (key in req.body) partial[key] = req.body[key];
      }
      if (partial.quantity !== void 0) partial.quantity = Number(partial.quantity);
      const item = await storage.updateSalesOrderItem(req.params.id, partial);
      res.json(item);
    } catch (error) {
      if (error instanceof z13.ZodError) {
        return res.status(400).json({ message: "Invalid sales order item data", errors: error.errors });
      }
      console.error("Error updating sales order item:", error);
      res.status(500).json({ message: "Failed to update sales order item" });
    }
  });
  app2.delete("/api/sales-order-items/:id", async (req, res) => {
    try {
      await storage.deleteSalesOrderItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting sales order item:", error);
      res.status(500).json({ message: "Failed to delete sales order item" });
    }
  });
  app2.post("/api/sales-order-items/bulk", async (req, res) => {
    try {
      const itemsData = req.body.items;
      const validatedItems = z13.array(insertSalesOrderItemSchema).parse(itemsData);
      const items3 = await storage.bulkCreateSalesOrderItems(validatedItems);
      res.status(201).json(items3);
    } catch (error) {
      if (error instanceof z13.ZodError) {
        return res.status(400).json({ message: "Invalid sales order items data", errors: error.errors });
      }
      console.error("Error creating sales order items:", error);
      res.status(500).json({ message: "Failed to create sales order items" });
    }
  });
  app2.get("/api/sales-orders/available-for-delivery", async (req, res) => {
    try {
      const salesOrders3 = await storage.getSalesOrders(50, 0);
      const confirmedOrders = salesOrders3.filter((order) => order.status === "Confirmed");
      res.json(confirmedOrders);
    } catch (error) {
      console.error("Error fetching available sales orders for delivery:", error);
      res.status(500).json({ message: "Failed to fetch available sales orders for delivery", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });
}

// server/routes/supplier-lpo.ts
init_storage();
init_schema();
import { z as z14 } from "zod";
function registerSupplierLpoRoutes(app2) {
  app2.get("/api/supplier-lpos", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      const filters = {
        status: req.query.status,
        supplierId: req.query.supplierId,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        search: req.query.search,
        requiresApproval: req.query.requiresApproval === "true",
        pendingSupplierConfirmation: req.query.pendingSupplierConfirmation === "true"
      };
      Object.keys(filters).forEach((key) => {
        if (filters[key] === void 0) {
          delete filters[key];
        }
      });
      const supplierLpos2 = await storage.getSupplierLpos(limit, offset, Object.keys(filters).length > 0 ? filters : void 0);
      const totalCount = await storage.getSupplierLposCount(Object.keys(filters).length > 0 ? filters : void 0);
      res.json({
        data: supplierLpos2,
        total: totalCount,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
        totalPages: Math.ceil(totalCount / limit)
      });
    } catch (error) {
      console.error("Error fetching supplier LPOs:", error);
      res.status(500).json({ message: "Failed to fetch supplier LPOs" });
    }
  });
  app2.post("/api/supplier-lpos/from-sales-order", async (req, res) => {
    try {
      const { salesOrderId, supplierId } = req.body;
      if (!salesOrderId) {
        return res.status(400).json({ message: "salesOrderId required" });
      }
      const lpos = await storage.createSupplierLposFromSalesOrders([salesOrderId], "supplier", getAttributingUserId(req), supplierId);
      if (!lpos || lpos.length === 0) {
        return res.status(500).json({ message: "No Supplier LPO created" });
      }
      res.status(201).json(lpos[0]);
    } catch (error) {
      console.error("[SUPPLIER-LPO:SINGLE] Error creating supplier LPO from sales order. Payload=", req.body);
      console.error(error);
      if (error instanceof Error) {
        res.status(500).json({ message: error.message, stack: error.stack });
      } else {
        res.status(500).json({ message: "Failed to create supplier LPO from sales order" });
      }
    }
  });
  app2.post("/api/supplier-lpos/from-sales-orders", async (req, res) => {
    try {
      const { salesOrderIds, groupBy = "supplier", supplierId } = req.body;
      if (!Array.isArray(salesOrderIds) || salesOrderIds.length === 0) {
        return res.status(400).json({ message: "salesOrderIds array required" });
      }
      const lpos = await storage.createSupplierLposFromSalesOrders(salesOrderIds, groupBy, getAttributingUserId(req), supplierId);
      res.status(201).json(lpos);
    } catch (error) {
      console.error("[SUPPLIER-LPO:BATCH] Error creating supplier LPOs from sales orders. Payload=", req.body);
      console.error(error);
      if (error instanceof Error) {
        res.status(500).json({ message: error.message, stack: error.stack });
      } else {
        res.status(500).json({ message: "Failed to create supplier LPOs" });
      }
    }
  });
  app2.get("/api/supplier-lpos/:id", async (req, res) => {
    try {
      const supplierLpo = await storage.getSupplierLpo(req.params.id);
      if (!supplierLpo) {
        return res.status(404).json({ message: "Supplier LPO not found" });
      }
      res.json(supplierLpo);
    } catch (error) {
      console.error("Error fetching supplier LPO:", error);
      res.status(500).json({ message: "Failed to fetch supplier LPO" });
    }
  });
  app2.post("/api/supplier-lpos/:id/amend", async (req, res) => {
    try {
      const { reason, amendmentType } = req.body;
      if (!reason || !amendmentType) {
        return res.status(400).json({ message: "Amendment reason and type are required" });
      }
      const amendedLpo = await storage.createAmendedSupplierLpo(req.params.id, reason, amendmentType, getAttributingUserId(req));
      res.status(201).json(amendedLpo);
    } catch (error) {
      console.error("Error creating amended supplier LPO:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to create amended supplier LPO" });
    }
  });
  app2.post("/api/supplier-lpos/:id/submit-for-approval", async (req, res) => {
    try {
      const supplierLpo = await storage.submitForApproval(req.params.id, getAttributingUserId(req));
      res.json(supplierLpo);
    } catch (error) {
      console.error("Error submitting supplier LPO for approval:", error);
      res.status(500).json({ message: "Failed to submit supplier LPO for approval" });
    }
  });
  app2.post("/api/supplier-lpos/:id/approve", async (req, res) => {
    try {
      const { notes } = req.body;
      const supplierLpo = await storage.approveSupplierLpo(req.params.id, getAttributingUserId(req), notes);
      res.json(supplierLpo);
    } catch (error) {
      console.error("Error approving supplier LPO:", error);
      res.status(500).json({ message: "Failed to approve supplier LPO" });
    }
  });
  app2.post("/api/supplier-lpos/:id/reject", async (req, res) => {
    try {
      const { notes } = req.body;
      if (!notes) {
        return res.status(400).json({ message: "Rejection notes are required" });
      }
      const supplierLpo = await storage.rejectSupplierLpo(req.params.id, getAttributingUserId(req), notes);
      res.json(supplierLpo);
    } catch (error) {
      console.error("Error rejecting supplier LPO:", error);
      res.status(500).json({ message: "Failed to reject supplier LPO" });
    }
  });
  app2.post("/api/supplier-lpos/:id/send-to-supplier", async (req, res) => {
    try {
      const supplierLpo = await storage.sendToSupplier(req.params.id, getAttributingUserId(req));
      res.json(supplierLpo);
    } catch (error) {
      console.error("Error sending supplier LPO to supplier:", error);
      res.status(500).json({ message: "Failed to send supplier LPO to supplier" });
    }
  });
  app2.post("/api/supplier-lpos/:id/confirm-by-supplier", async (req, res) => {
    try {
      const { confirmationReference } = req.body;
      const supplierLpo = await storage.confirmBySupplier(req.params.id, confirmationReference);
      res.json(supplierLpo);
    } catch (error) {
      console.error("Error confirming supplier LPO:", error);
      res.status(500).json({ message: "Failed to confirm supplier LPO" });
    }
  });
  app2.patch("/api/supplier-lpos/:id/expected-delivery", async (req, res) => {
    try {
      console.log("PATCH /api/supplier-lpos/:id/expected-delivery called with:", req.params.id, req.body);
      const { expectedDeliveryDate, userId } = req.body;
      if (!expectedDeliveryDate) {
        console.log("Missing expectedDeliveryDate in request body");
        return res.status(400).json({ message: "Expected delivery date is required" });
      }
      const supplierLpo = await storage.updateExpectedDeliveryDate(req.params.id, expectedDeliveryDate, userId);
      console.log("Successfully updated expected delivery date:", supplierLpo);
      res.json(supplierLpo);
    } catch (error) {
      console.error("Error updating expected delivery date:", error);
      res.status(500).json({ message: "Failed to update expected delivery date" });
    }
  });
  app2.get("/api/supplier-lpos/backlog", async (req, res) => {
    try {
      const backlog = await storage.getSupplierLpoBacklog();
      res.json(backlog);
    } catch (error) {
      console.error("Error fetching supplier LPO backlog:", error);
      res.status(500).json({ message: "Failed to fetch supplier LPO backlog" });
    }
  });
  app2.get("/api/customer-orders/backlog", async (req, res) => {
    try {
      const backlog = await storage.getCustomerOrderBacklog();
      res.json(backlog);
    } catch (error) {
      console.error("Error fetching customer order backlog:", error);
      res.status(500).json({ message: "Failed to fetch customer order backlog" });
    }
  });
  app2.get("/api/supplier-lpos/:lpoId/items", async (req, res) => {
    try {
      const items3 = await storage.getSupplierLpoItems(req.params.lpoId);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching supplier LPO items:", error);
      res.status(500).json({ message: "Failed to fetch supplier LPO items" });
    }
  });
  app2.get("/api/supplier-lpo-items/:id", async (req, res) => {
    try {
      const item = await storage.getSupplierLpoItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Supplier LPO item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching supplier LPO item:", error);
      res.status(500).json({ message: "Failed to fetch supplier LPO item" });
    }
  });
  app2.post("/api/supplier-lpo-items", async (req, res) => {
    try {
      const itemData = insertSupplierLpoItemSchema.parse(req.body);
      const item = await storage.createSupplierLpoItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z14.ZodError) {
        return res.status(400).json({ message: "Invalid supplier LPO item data", errors: error.errors });
      }
      console.error("Error creating supplier LPO item:", error);
      res.status(500).json({ message: "Failed to create supplier LPO item" });
    }
  });
  app2.put("/api/supplier-lpo-items/:id", async (req, res) => {
    try {
      const itemData = insertSupplierLpoItemSchema.partial().parse(req.body);
      const item = await storage.updateSupplierLpoItem(req.params.id, itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z14.ZodError) {
        return res.status(400).json({ message: "Invalid supplier LPO item data", errors: error.errors });
      }
      console.error("Error updating supplier LPO item:", error);
      res.status(500).json({ message: "Failed to update supplier LPO item" });
    }
  });
  app2.delete("/api/supplier-lpo-items/:id", async (req, res) => {
    try {
      await storage.deleteSupplierLpoItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting supplier LPO item:", error);
      res.status(500).json({ message: "Failed to delete supplier LPO item" });
    }
  });
  app2.post("/api/supplier-lpo-items/bulk", async (req, res) => {
    try {
      const itemsData = req.body.items;
      const validatedItems = z14.array(insertSupplierLpoItemSchema).parse(itemsData);
      const items3 = await storage.bulkCreateSupplierLpoItems(validatedItems);
      res.status(201).json(items3);
    } catch (error) {
      if (error instanceof z14.ZodError) {
        return res.status(400).json({ message: "Invalid supplier LPO items data", errors: error.errors });
      }
      console.error("Error bulk creating supplier LPO items:", error);
      res.status(500).json({ message: "Failed to bulk create supplier LPO items" });
    }
  });
}

// server/routes/supplier-quotes.ts
import { z as z15 } from "zod";
init_db();
init_schema();
init_base();
init_uuid();
import { eq as eq22 } from "drizzle-orm";
var supplierQuoteSearchSchema = z15.object({
  page: z15.coerce.number().min(1).default(1),
  limit: z15.coerce.number().min(1).max(100).default(20),
  search: z15.string().optional(),
  status: z15.string().optional(),
  priority: z15.string().optional(),
  supplier: z15.string().optional(),
  currency: z15.string().optional(),
  dateFrom: z15.string().optional(),
  dateTo: z15.string().optional()
});
var supplierQuoteCreateSchema = z15.object({
  supplierId: z15.string().uuid(),
  requisitionId: z15.string().uuid().optional(),
  priority: z15.enum(["Low", "Medium", "High", "Urgent"]),
  requestDate: z15.string(),
  validUntil: z15.string(),
  paymentTerms: z15.string(),
  deliveryTerms: z15.string(),
  notes: z15.string().optional(),
  items: z15.array(z15.object({
    itemDescription: z15.string(),
    quantity: z15.number().positive(),
    unitOfMeasure: z15.string(),
    specification: z15.string().optional()
  }))
});
var supplierQuoteUpdateSchema = z15.object({
  supplierId: z15.string().uuid().optional(),
  rfqNumber: z15.string().optional(),
  // Not stored in DB but accepted for frontend compatibility
  status: z15.enum(["Draft", "Sent", "Accepted", "Rejected", "Expired"]).optional(),
  priority: z15.enum(["Low", "Medium", "High", "Urgent"]).optional(),
  // Not stored in DB but accepted for frontend compatibility
  responseDate: z15.string().optional(),
  // Not stored in DB but accepted for frontend compatibility
  validUntil: z15.string().optional(),
  totalAmount: z15.string().optional(),
  currency: z15.enum(["AED", "USD", "EUR", "GBP", "BHD"]).optional(),
  // Not stored in DB but accepted for frontend compatibility
  paymentTerms: z15.string().optional(),
  deliveryTerms: z15.string().optional(),
  notes: z15.string().optional(),
  evaluationScore: z15.number().min(0).max(10).optional(),
  // Not stored in DB but accepted for frontend compatibility
  competitiveRank: z15.number().positive().optional()
  // Not stored in DB but accepted for frontend compatibility
});
function registerSupplierQuoteRoutes(app2) {
  app2.get("/api/supplier-quotes", async (req, res) => {
    try {
      const params = supplierQuoteSearchSchema.parse(req.query);
      const quotes = await SupplierQuoteStorage.list(params);
      res.json({ data: quotes });
    } catch (error) {
      console.error("Error fetching supplier quotes:", error);
      res.status(500).json({ message: "Failed to fetch supplier quotes" });
    }
  });
  app2.get("/api/supplier-quotes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const quote = await SupplierQuoteStorage.getById(id);
      if (!quote) {
        return res.status(404).json({ message: "Supplier quote not found" });
      }
      res.json(quote);
    } catch (error) {
      console.error("Error fetching supplier quote:", error);
      res.status(500).json({ message: "Failed to fetch supplier quote" });
    }
  });
  app2.get("/api/supplier-quotes/:id/items", async (req, res) => {
    try {
      const { id } = req.params;
      const items3 = await SupplierQuoteStorage.getItems(id);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching supplier quote items:", error);
      res.status(500).json({ message: "Failed to fetch supplier quote items" });
    }
  });
  app2.post("/api/supplier-quotes", async (req, res) => {
    try {
      const data = supplierQuoteCreateSchema.parse(req.body);
      const newQuote = await SupplierQuoteStorage.create(data);
      res.status(201).json(newQuote);
    } catch (error) {
      console.error("Error creating supplier quote:", error);
      if (error instanceof z15.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create supplier quote" });
    }
  });
  app2.patch("/api/supplier-quotes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = supplierQuoteUpdateSchema.parse(req.body);
      const existingQuote = await SupplierQuoteStorage.getById(id);
      if (!existingQuote) {
        return res.status(404).json({ message: "Supplier quote not found" });
      }
      const processedData = {};
      if (data.supplierId) {
        processedData.customerId = data.supplierId;
      }
      if (data.status) processedData.status = data.status;
      if (data.validUntil) {
        try {
          processedData.validUntil = new Date(data.validUntil);
        } catch (error) {
          console.error("Invalid date format for validUntil:", data.validUntil);
          return res.status(400).json({ message: "Invalid date format for validUntil" });
        }
      }
      if (data.notes) processedData.notes = data.notes;
      if (data.totalAmount) {
        try {
          processedData.totalAmount = parseFloat(data.totalAmount).toString();
        } catch (error) {
          console.error("Invalid totalAmount format:", data.totalAmount);
          return res.status(400).json({ message: "Invalid totalAmount format" });
        }
      }
      if (data.paymentTerms || data.deliveryTerms) {
        const existingTerms = existingQuote.terms || "";
        const newTerms = [];
        if (data.paymentTerms) newTerms.push(`Payment Terms: ${data.paymentTerms}`);
        if (data.deliveryTerms) newTerms.push(`Delivery Terms: ${data.deliveryTerms}`);
        processedData.terms = existingTerms + (existingTerms ? "\n" : "") + newTerms.join("\n");
      }
      if (Object.keys(processedData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      const updatedQuote = await SupplierQuoteStorage.update(id, processedData);
      res.json(updatedQuote);
    } catch (error) {
      console.error("Error updating supplier quote:", error);
      if (error instanceof z15.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({
        message: "Failed to update supplier quote",
        error: errorMessage
      });
    }
  });
  app2.delete("/api/supplier-quotes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const hasReferences = await SupplierQuoteStorage.hasReferences(id);
      if (hasReferences) {
        return res.status(400).json({
          message: "Cannot delete supplier quote. It is referenced by sales orders, customer acceptances, or purchase orders. Please delete the related records first."
        });
      }
      const result = await SupplierQuoteStorage.delete(id);
      res.json(result);
    } catch (error) {
      console.error("Error deleting supplier quote:", error);
      if (error.code === "23503") {
        return res.status(400).json({
          message: "Cannot delete supplier quote. It is referenced by other records. Please delete the related records first."
        });
      }
      res.status(500).json({ message: "Failed to delete supplier quote" });
    }
  });
  app2.post("/api/supplier-quotes/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedQuote = {
        id,
        status: "Approved",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      res.json(updatedQuote);
    } catch (error) {
      console.error("Error approving supplier quote:", error);
      res.status(500).json({ message: "Failed to approve supplier quote" });
    }
  });
  app2.post("/api/supplier-quotes/:id/reject", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedQuote = {
        id,
        status: "Rejected",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      res.json(updatedQuote);
    } catch (error) {
      console.error("Error rejecting supplier quote:", error);
      res.status(500).json({ message: "Failed to reject supplier quote" });
    }
  });
  app2.post("/api/customer-quotes", async (req, res) => {
    try {
      const { enquiryId, customerId, suppliers: suppliers5 } = req.body;
      if (!enquiryId || !customerId || !suppliers5 || !Array.isArray(suppliers5) || suppliers5.length === 0) {
        return res.status(400).json({
          message: "Missing required fields: enquiryId, customerId, and suppliers array are required"
        });
      }
      const enquiry = await db.select({
        id: enquiries.id,
        enquiryNumber: enquiries.enquiryNumber,
        customerId: enquiries.customerId,
        enquiryDate: enquiries.enquiryDate,
        status: enquiries.status,
        notes: enquiries.notes,
        targetDeliveryDate: enquiries.targetDeliveryDate,
        customer: {
          id: customers.id,
          name: customers.name,
          email: customers.email,
          phone: customers.phone,
          address: customers.address,
          customerType: customers.customerType
        }
      }).from(enquiries).leftJoin(customers, eq22(enquiries.customerId, customers.id)).where(eq22(enquiries.id, enquiryId)).limit(1);
      if (!enquiry.length) {
        return res.status(404).json({ message: "Enquiry not found" });
      }
      const enquiryData = enquiry[0];
      const enquiryItemsList = await db.select().from(enquiryItems).where(eq22(enquiryItems.enquiryId, enquiryId));
      const supplierIds = suppliers5.map((s) => s.supplierId);
      console.log("Validating suppliers:", supplierIds);
      if (supplierIds.length === 0) {
        return res.status(400).json({ message: "No suppliers provided" });
      }
      const supplierNames = suppliers5.map((s) => s.supplierName).join(", ");
      const baseStorage = new BaseStorage();
      let quoteNumber;
      let attempts = 0;
      const maxAttempts = 10;
      do {
        quoteNumber = baseStorage.generateNumber("QT");
        const existing = await db.select({ id: quotations.id }).from(quotations).where(eq22(quotations.quoteNumber, quoteNumber)).limit(1);
        if (existing.length === 0) break;
        attempts++;
      } while (attempts < maxAttempts);
      if (attempts >= maxAttempts) {
        throw new Error("Failed to generate unique quotation number");
      }
      const quoteData = {
        quoteNumber,
        customerId: enquiryData.customerId,
        // Use the actual customer ID from enquiry
        customerType: enquiryData.customer.customerType,
        // Use customer's actual type
        enquiryId,
        status: "Draft",
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
        // 30 days from now
        subtotal: "0",
        discountPercentage: "0",
        discountAmount: "0",
        taxAmount: "0",
        totalAmount: "0",
        notes: `Quote request for enquiry ${enquiryData.enquiryNumber} from customer ${enquiryData.customer.name} to suppliers: ${supplierNames}`,
        createdBy: SYSTEM_USER_ID
        // Use system user ID
      };
      const [quotation] = await db.insert(quotations).values(quoteData).returning();
      if (enquiryItemsList.length > 0) {
        const quotationItemsData = enquiryItemsList.map((item) => ({
          quotationId: quotation.id,
          description: item.description,
          // Use correct field name
          quantity: item.quantity,
          unitPrice: item.unitPrice ? item.unitPrice.toString() : "0.00",
          lineTotal: item.unitPrice ? (Number(item.unitPrice) * item.quantity).toString() : "0.00",
          notes: item.notes || `Requested for enquiry ${enquiryData.enquiryNumber}`
        }));
        await db.insert(quotationItems).values(quotationItemsData);
      }
      res.status(201).json({
        message: "Quote request sent successfully",
        quoteId: quotation.id,
        quoteNumber: quotation.quoteNumber,
        enquiryId,
        suppliers: suppliers5.map((s) => ({ id: s.supplierId, name: s.supplierName })),
        customerName: enquiryData.customer.name,
        enquiryNumber: enquiryData.enquiryNumber,
        itemsCount: enquiryItemsList.length
      });
    } catch (error) {
      console.error("Error creating customer quote request:", error);
      res.status(500).json({
        message: "Failed to create quote request",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}

// server/routes/workflow.ts
init_storage();
var WORKFLOW_STEPS = [
  {
    id: 1,
    name: "Customer",
    description: "Create and manage customer information",
    estimatedDuration: 1,
    requiredFields: ["customerName", "contactInfo", "customerType", "classification"],
    dependencies: [],
    validationRules: {
      customerName: { required: true, minLength: 2 },
      contactInfo: { required: true, type: "email" },
      customerType: { required: true, enum: ["Retail", "Wholesale"] },
      classification: { required: true, enum: ["Internal", "Corporate", "Individual", "Family", "Ministry"] }
    },
    successCriteria: "Customer profile created with complete information",
    nextActions: ["Create enquiry for customer"]
  }
  // Add other steps as needed for validation
];
function validateRequiredFields(data, validationRules, missingFields, validationErrors) {
  let isValid = true;
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = data[field];
    if (rules.required && (!value || value === "")) {
      missingFields.push(field);
      validationErrors[field] = `${field} is required`;
      isValid = false;
      continue;
    }
    if (!rules.required && (!value || value === "")) {
      continue;
    }
    if (rules.minLength && typeof value === "string" && value.length < rules.minLength) {
      validationErrors[field] = `${field} must be at least ${rules.minLength} characters`;
      isValid = false;
    }
    if (rules.min && typeof value === "number" && value < rules.min) {
      validationErrors[field] = `${field} must be at least ${rules.min}`;
      isValid = false;
    }
    if (rules.type === "email" && typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      validationErrors[field] = `${field} must be a valid email address`;
      isValid = false;
    }
    if (rules.enum && !rules.enum.includes(value)) {
      validationErrors[field] = `${field} must be one of: ${rules.enum.join(", ")}`;
      isValid = false;
    }
    if (rules.pattern && typeof value === "string" && !new RegExp(rules.pattern).test(value)) {
      validationErrors[field] = `${field} format is invalid`;
      isValid = false;
    }
    if (rules.minItems && Array.isArray(value) && value.length < rules.minItems) {
      validationErrors[field] = `${field} must have at least ${rules.minItems} items`;
      isValid = false;
    }
  }
  return isValid;
}
function registerWorkflowRoutes(app2) {
  app2.get("/api/workflow/validate/:step/:entityId", async (req, res) => {
    try {
      const { step, entityId } = req.params;
      let canProceed = false;
      let message = "";
      let nextStep = "";
      let requiredActions = [];
      let missingFields = [];
      let validationErrors = {};
      let stepMetadata = {};
      const stepConfig = WORKFLOW_STEPS.find((s) => s.name.toLowerCase() === step.toLowerCase());
      if (stepConfig) {
        stepMetadata = {
          description: stepConfig.description,
          estimatedDuration: stepConfig.estimatedDuration,
          requiredFields: stepConfig.requiredFields,
          dependencies: stepConfig.dependencies,
          validationRules: stepConfig.validationRules,
          successCriteria: stepConfig.successCriteria,
          nextActions: stepConfig.nextActions
        };
      }
      switch (step) {
        case "customer":
          try {
            const customer = await storage.getCustomer(entityId);
            canProceed = customer && validateRequiredFields(customer, stepConfig?.validationRules || {}, missingFields, validationErrors);
            message = canProceed ? "Customer information is complete and ready" : "Customer information is incomplete";
            nextStep = "enquiry";
            if (!canProceed) {
              requiredActions.push("Complete customer profile with all required fields");
              requiredActions.push("Verify contact information");
              requiredActions.push("Set customer classification");
            }
          } catch (error) {
            canProceed = false;
            message = "Customer not found or invalid entity ID";
            requiredActions.push("Create customer first");
          }
          break;
        case "enquiry":
          try {
            const enquiry = await storage.getEnquiry(entityId);
            canProceed = enquiry && (enquiry.status === "In Progress" || enquiry.status === "New") && validateRequiredFields(enquiry, stepConfig?.validationRules || {}, missingFields, validationErrors);
            message = canProceed ? "Enquiry is ready for quotation" : "Enquiry must be in progress with complete details";
            nextStep = "quotation";
            if (!canProceed) {
              requiredActions.push("Update enquiry status to 'In Progress'");
              requiredActions.push("Complete enquiry details");
              requiredActions.push("Specify product requirements");
              requiredActions.push("Set urgency level");
            }
          } catch (error) {
            canProceed = false;
            message = "Enquiry not found or invalid entity ID";
            requiredActions.push("Create enquiry first");
          }
          break;
        case "quotation":
          const quotation = await storage.getQuotation(entityId);
          canProceed = quotation?.status === "Sent" || quotation?.status === "Draft";
          message = canProceed ? "Quotation is ready for customer review" : "Quotation must be sent to customer";
          nextStep = "acceptance";
          if (!canProceed) {
            requiredActions.push("Send quotation to customer");
          }
          break;
        case "acceptance":
          const quotationForAcceptance = await storage.getQuotation(entityId);
          canProceed = quotationForAcceptance?.status === "Sent";
          message = canProceed ? "Awaiting customer acceptance" : "Quotation must be sent to customer first";
          nextStep = "customer-po-upload";
          if (!canProceed) {
            requiredActions.push("Send quotation to customer");
          }
          break;
        case "customer-po-upload":
          const acceptedQuote = await storage.getQuotation(entityId);
          canProceed = acceptedQuote?.status === "Accepted";
          message = canProceed ? "Customer PO can be uploaded" : "Quote must be accepted by customer";
          nextStep = "sales-order";
          if (!canProceed) {
            requiredActions.push("Customer must accept the quotation");
          }
          break;
        case "sales-order":
          const quotationWithPO = await storage.getQuotation(entityId);
          canProceed = quotationWithPO?.status === "Accepted";
          message = canProceed ? "Sales order can be created" : "PO document must be uploaded and validated";
          nextStep = "supplier-lpo";
          if (!canProceed) {
            requiredActions.push("Upload customer PO document");
            requiredActions.push("Validate PO against quotation");
          }
          break;
        case "supplier-lpo":
          const salesOrder = await storage.getSalesOrder(entityId);
          canProceed = salesOrder?.status === "Confirmed" || salesOrder?.status === "Pending";
          message = canProceed ? "Supplier LPO can be created" : "Sales order must be confirmed";
          nextStep = "goods-receipt";
          if (!canProceed) {
            requiredActions.push("Confirm sales order");
          }
          break;
        case "goods-receipt":
          const salesOrderForGoods = await storage.getSalesOrder(entityId);
          canProceed = salesOrderForGoods?.status === "Confirmed" || salesOrderForGoods?.status === "Pending";
          message = canProceed ? "Goods can be received" : "Supplier LPO must be sent and confirmed";
          nextStep = "inventory";
          if (!canProceed) {
            requiredActions.push("Send LPO to supplier");
            requiredActions.push("Wait for supplier confirmation");
          }
          break;
        case "inventory":
          canProceed = true;
          message = canProceed ? "Inventory can be updated" : "Goods must be received first";
          nextStep = "delivery-note";
          if (!canProceed) {
            requiredActions.push("Receive goods from supplier");
            requiredActions.push("Update goods receipt status");
          }
          break;
        case "delivery-note":
          canProceed = true;
          message = canProceed ? "Delivery note can be created" : "Inventory must be updated first";
          nextStep = "invoice";
          if (!canProceed) {
            requiredActions.push("Update inventory levels");
            requiredActions.push("Process stock allocation");
          }
          break;
        case "invoice":
          canProceed = true;
          message = canProceed ? "Invoice can be generated" : "Delivery must be completed";
          nextStep = "completed";
          if (!canProceed) {
            requiredActions.push("Complete delivery process");
            requiredActions.push("Update delivery status");
          }
          break;
        default:
          message = "Invalid workflow step";
          requiredActions.push("Contact system administrator");
      }
      res.json({
        canProceed,
        message,
        step,
        entityId,
        nextStep,
        requiredActions,
        missingFields,
        validationErrors,
        stepMetadata,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Error validating workflow step:", error);
      res.status(500).json({ message: "Failed to validate workflow step" });
    }
  });
  app2.get("/api/workflow/progress/:entityId", async (req, res) => {
    try {
      const { entityId } = req.params;
      const { entityType = "enquiry" } = req.query;
      let progress = {
        id: `workflow-${entityId}`,
        entityId,
        entityType,
        entityName: `Entity ${entityId}`,
        currentStep: 1,
        completedSteps: [],
        status: "pending",
        progress: 0,
        nextAction: "",
        estimatedCompletion: null,
        blockers: [],
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
        priority: "Medium",
        totalValue: 0,
        startDate: (/* @__PURE__ */ new Date()).toISOString(),
        duration: 0,
        efficiency: 0,
        // Enhanced fields for better flow implementation
        stepDetails: WORKFLOW_STEPS.map((step) => ({
          stepId: step.id,
          stepName: step.name,
          description: step.description,
          estimatedDuration: step.estimatedDuration,
          requiredFields: step.requiredFields,
          completedFields: [],
          missingFields: step.requiredFields,
          dependencies: step.dependencies,
          dependenciesMet: step.dependencies.length === 0,
          validationRules: step.validationRules,
          successCriteria: step.successCriteria,
          nextActions: step.nextActions,
          status: "not_started"
        })),
        // Workflow metadata
        workflowVersion: "1.0.0",
        createdBy: "system",
        lastModifiedBy: "system",
        tags: [],
        category: "sales",
        department: "sales",
        location: "main",
        // Performance metrics
        stepEfficiency: {},
        averageStepDuration: 0,
        bottlenecks: [],
        riskFactors: [],
        // Compliance and audit
        auditTrail: [],
        // Notifications and alerts
        notifications: [],
        // Escalation
        escalationLevel: 0
      };
      switch (entityType) {
        case "enquiry":
          const enquiry = await storage.getEnquiry(entityId);
          if (enquiry) {
            progress.currentStep = 2;
            progress.completedSteps = [1];
            progress.status = enquiry.status.toLowerCase();
            if (enquiry.status === "Quoted") {
              progress.completedSteps = [1, 2, 3];
              progress.currentStep = 5;
            }
          }
          break;
        case "quotation":
          const quotation = await storage.getQuotation(entityId);
          if (quotation) {
            progress.currentStep = 4;
            progress.completedSteps = [1, 2];
            progress.status = quotation.status.toLowerCase();
            if (quotation.status === "Accepted") {
              progress.completedSteps = [1, 2, 3, 4, 5];
              progress.currentStep = 6;
            }
          }
          break;
        case "sales-order":
          const salesOrder = await storage.getSalesOrder(entityId);
          if (salesOrder) {
            progress.currentStep = 7;
            progress.completedSteps = [1, 2, 3, 4, 5, 6];
            progress.status = salesOrder.status.toLowerCase();
          }
          break;
      }
      res.json(progress);
    } catch (error) {
      console.error("Error fetching workflow progress:", error);
      res.status(500).json({ message: "Failed to fetch workflow progress" });
    }
  });
  app2.post("/api/workflow/complete/:step/:entityId", async (req, res) => {
    try {
      const { step, entityId } = req.params;
      const { notes, nextStep } = req.body;
      if (entityId.startsWith("test-")) {
        res.json({
          message: `Step ${step} marked as complete`,
          nextStep: nextStep || getNextStep(step)
        });
        return;
      }
      await storage.logAuditEvent(
        "workflow",
        entityId,
        "step_completed",
        req.user?.id,
        void 0,
        { step, notes, nextStep }
      );
      res.json({
        message: `Step ${step} marked as complete`,
        nextStep: nextStep || getNextStep(step)
      });
    } catch (error) {
      console.error("Error completing workflow step:", error);
      res.status(500).json({ message: "Failed to complete workflow step" });
    }
  });
  app2.get("/api/workflow/progress", async (req, res) => {
    try {
      const { status, priority, assignedTo, search } = req.query;
      const enquiries3 = await storage.getEnquiries();
      const quotations3 = await storage.getQuotations();
      const salesOrders3 = await storage.getSalesOrders();
      const workflows = [];
      for (const enquiry of enquiries3) {
        const workflow = {
          id: `workflow-enquiry-${enquiry.id}`,
          entityId: enquiry.id,
          entityType: "enquiry",
          entityName: `Enquiry ${enquiry.id}`,
          currentStep: 2,
          completedSteps: [1],
          status: enquiry.status.toLowerCase(),
          progress: 20,
          nextAction: "Complete enquiry details",
          estimatedCompletion: null,
          blockers: [],
          lastUpdated: enquiry.updatedAt || enquiry.createdAt,
          priority: "Medium",
          totalValue: 0,
          startDate: enquiry.createdAt,
          duration: Math.floor((Date.now() - new Date(enquiry.createdAt).getTime()) / (1e3 * 60 * 60 * 24)),
          efficiency: 0,
          stepDetails: WORKFLOW_STEPS.map((step) => ({
            stepId: step.id,
            stepName: step.name,
            description: step.description,
            estimatedDuration: step.estimatedDuration,
            requiredFields: step.requiredFields,
            completedFields: [],
            missingFields: step.requiredFields,
            dependencies: step.dependencies,
            dependenciesMet: step.dependencies.length === 0,
            validationRules: step.validationRules,
            successCriteria: step.successCriteria,
            nextActions: step.nextActions,
            status: step.id <= 2 ? "completed" : step.id === 2 ? "in_progress" : "not_started"
          }))
        };
        if (status && status !== "all" && workflow.status !== status) continue;
        if (priority && priority !== "all" && workflow.priority.toLowerCase() !== priority) continue;
        if (search && !workflow.entityName.toLowerCase().includes(search.toLowerCase())) continue;
        workflows.push(workflow);
      }
      for (const quotation of quotations3) {
        const workflow = {
          id: `workflow-quotation-${quotation.id}`,
          entityId: quotation.id,
          entityType: "quotation",
          entityName: `Quotation ${quotation.id}`,
          currentStep: 4,
          completedSteps: [1, 2, 3],
          status: quotation.status.toLowerCase(),
          progress: 40,
          nextAction: "Send quotation to customer",
          estimatedCompletion: null,
          blockers: [],
          lastUpdated: quotation.updatedAt || quotation.createdAt,
          priority: "Medium",
          totalValue: quotation.totalAmount || 0,
          startDate: quotation.createdAt,
          duration: Math.floor((Date.now() - new Date(quotation.createdAt).getTime()) / (1e3 * 60 * 60 * 24)),
          efficiency: 0,
          stepDetails: WORKFLOW_STEPS.map((step) => ({
            stepId: step.id,
            stepName: step.name,
            description: step.description,
            estimatedDuration: step.estimatedDuration,
            requiredFields: step.requiredFields,
            completedFields: [],
            missingFields: step.requiredFields,
            dependencies: step.dependencies,
            dependenciesMet: step.dependencies.length === 0,
            validationRules: step.validationRules,
            successCriteria: step.successCriteria,
            nextActions: step.nextActions,
            status: step.id <= 4 ? "completed" : step.id === 4 ? "in_progress" : "not_started"
          }))
        };
        if (status && status !== "all" && workflow.status !== status) continue;
        if (priority && priority !== "all" && workflow.priority.toLowerCase() !== priority) continue;
        if (search && !workflow.entityName.toLowerCase().includes(search.toLowerCase())) continue;
        workflows.push(workflow);
      }
      for (const salesOrder of salesOrders3) {
        const workflow = {
          id: `workflow-sales-order-${salesOrder.id}`,
          entityId: salesOrder.id,
          entityType: "sales-order",
          entityName: `Sales Order ${salesOrder.id}`,
          currentStep: 7,
          completedSteps: [1, 2, 3, 4, 5, 6],
          status: salesOrder.status.toLowerCase(),
          progress: 70,
          nextAction: "Create supplier LPO",
          estimatedCompletion: null,
          blockers: [],
          lastUpdated: salesOrder.updatedAt || salesOrder.createdAt,
          priority: "Medium",
          totalValue: salesOrder.totalAmount || 0,
          startDate: salesOrder.createdAt,
          duration: Math.floor((Date.now() - new Date(salesOrder.createdAt).getTime()) / (1e3 * 60 * 60 * 24)),
          efficiency: 0,
          stepDetails: WORKFLOW_STEPS.map((step) => ({
            stepId: step.id,
            stepName: step.name,
            description: step.description,
            estimatedDuration: step.estimatedDuration,
            requiredFields: step.requiredFields,
            completedFields: [],
            missingFields: step.requiredFields,
            dependencies: step.dependencies,
            dependenciesMet: step.dependencies.length === 0,
            validationRules: step.validationRules,
            successCriteria: step.successCriteria,
            nextActions: step.nextActions,
            status: step.id <= 7 ? "completed" : step.id === 7 ? "in_progress" : "not_started"
          }))
        };
        if (status && status !== "all" && workflow.status !== status) continue;
        if (priority && priority !== "all" && workflow.priority.toLowerCase() !== priority) continue;
        if (search && !workflow.entityName.toLowerCase().includes(search.toLowerCase())) continue;
        workflows.push(workflow);
      }
      res.json(workflows);
    } catch (error) {
      console.error("Error fetching workflow progress:", error);
      res.status(500).json({ message: "Failed to fetch workflow progress" });
    }
  });
  app2.get("/api/workflow/analytics", async (req, res) => {
    try {
      const { period = "30d" } = req.query;
      const enquiries3 = await storage.getEnquiries();
      const quotations3 = await storage.getQuotations();
      const salesOrders3 = await storage.getSalesOrders();
      const totalWorkflows = enquiries3.length + quotations3.length + salesOrders3.length;
      const completedWorkflows = quotations3.filter((q) => q.status === "Accepted").length + salesOrders3.filter((so) => so.status === "Completed").length;
      const inProgressWorkflows = enquiries3.filter((e) => e.status === "In Progress").length + quotations3.filter((q) => q.status === "Sent").length + salesOrders3.filter((so) => so.status === "Pending").length;
      const blockedWorkflows = enquiries3.filter((e) => e.status === "Closed").length + quotations3.filter((q) => q.status === "Rejected").length + salesOrders3.filter((so) => so.status === "Cancelled").length;
      const analytics = {
        totalWorkflows,
        completedWorkflows,
        inProgressWorkflows,
        blockedWorkflows,
        cancelledWorkflows: blockedWorkflows,
        averageCompletionTime: 15,
        // Mock data
        efficiency: totalWorkflows > 0 ? Math.round(completedWorkflows / totalWorkflows * 100) : 0,
        totalValue: quotations3.reduce((sum4, q) => sum4 + (q.totalAmount || 0), 0) + salesOrders3.reduce((sum4, so) => sum4 + (so.totalAmount || 0), 0),
        monthlyTrends: [
          { month: "Jan", completed: 5, inProgress: 3, blocked: 1, cancelled: 0 },
          { month: "Feb", completed: 8, inProgress: 4, blocked: 2, cancelled: 1 },
          { month: "Mar", completed: 12, inProgress: 6, blocked: 1, cancelled: 0 },
          { month: "Apr", completed: 15, inProgress: 8, blocked: 3, cancelled: 1 },
          { month: "May", completed: 18, inProgress: 10, blocked: 2, cancelled: 0 },
          { month: "Jun", completed: 22, inProgress: 12, blocked: 4, cancelled: 2 }
        ],
        stepBreakdown: {
          "Customer": enquiries3.length + quotations3.length + salesOrders3.length,
          "Enquiry": enquiries3.length,
          "Quotation": quotations3.length,
          "Acceptance": quotations3.filter((q) => q.status === "Accepted").length,
          "Customer PO Upload": quotations3.filter((q) => q.status === "Accepted").length,
          "Sales Order": salesOrders3.length,
          "Supplier LPO": salesOrders3.length,
          "Goods Receipt": 0,
          // Mock data
          "Inventory": 0,
          // Mock data
          "Delivery Note": 0,
          // Mock data
          "Invoice": 0
          // Mock data
        },
        priorityDistribution: {
          "Urgent": 2,
          "High": 5,
          "Medium": 15,
          "Low": 8
        },
        teamPerformance: [
          { userId: "user1", userName: "John Doe", completedWorkflows: 12, averageTime: 8, efficiency: 85 },
          { userId: "user2", userName: "Jane Smith", completedWorkflows: 15, averageTime: 6, efficiency: 92 },
          { userId: "user3", userName: "Mike Wilson", completedWorkflows: 8, averageTime: 10, efficiency: 78 }
        ]
      };
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching workflow analytics:", error);
      res.status(500).json({ message: "Failed to fetch workflow analytics" });
    }
  });
}
function getNextStep(currentStep) {
  const stepMap = {
    "customer": "enquiry",
    "enquiry": "quotation",
    "quotation": "acceptance",
    "acceptance": "customer-po-upload",
    "customer-po-upload": "sales-order",
    "sales-order": "supplier-lpo",
    "supplier-lpo": "goods-receipt",
    "goods-receipt": "inventory",
    "inventory": "delivery-note",
    "delivery-note": "invoice",
    "invoice": "completed"
  };
  return stepMap[currentStep] || "completed";
}

// server/routes/workflow-notifications.ts
init_storage();
import { z as z16 } from "zod";
var createNotificationSchema = z16.object({
  type: z16.enum([
    "step_completed",
    "step_blocked",
    "workflow_completed",
    "workflow_stalled",
    "deadline_approaching",
    "deadline_missed",
    "approval_required",
    "system_alert"
  ]),
  title: z16.string().min(1),
  message: z16.string().min(1),
  entityId: z16.string().uuid(),
  entityType: z16.string(),
  entityName: z16.string(),
  stepId: z16.number().optional(),
  stepName: z16.string().optional(),
  priority: z16.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
  assignedTo: z16.string().optional(),
  actionRequired: z16.boolean().default(false),
  actionUrl: z16.string().url().optional(),
  metadata: z16.record(z16.any()).optional()
});
var updateNotificationSettingsSchema = z16.object({
  emailNotifications: z16.boolean().optional(),
  pushNotifications: z16.boolean().optional(),
  stepCompleted: z16.boolean().optional(),
  stepBlocked: z16.boolean().optional(),
  workflowCompleted: z16.boolean().optional(),
  deadlineApproaching: z16.boolean().optional(),
  approvalRequired: z16.boolean().optional(),
  systemAlerts: z16.boolean().optional(),
  quietHours: z16.object({
    enabled: z16.boolean(),
    start: z16.string(),
    end: z16.string()
  }).optional()
});
function registerWorkflowNotificationRoutes(app2) {
  app2.get("/api/workflow/notifications", async (req, res) => {
    try {
      const { status, priority, search, page = 1, limit = 50 } = req.query;
      const filters = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (search) filters.search = search;
      const notifications = await storage.getWorkflowNotifications(filters, {
        page: Number(page),
        limit: Number(limit)
      });
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching workflow notifications:", error);
      res.status(500).json({ message: "Failed to fetch workflow notifications" });
    }
  });
  app2.get("/api/workflow/notifications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await storage.getWorkflowNotification(id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      console.error("Error fetching workflow notification:", error);
      res.status(500).json({ message: "Failed to fetch workflow notification" });
    }
  });
  app2.post("/api/workflow/notifications", async (req, res) => {
    try {
      const validatedData = createNotificationSchema.parse(req.body);
      const notification = await storage.createWorkflowNotification({
        ...validatedData,
        status: "unread",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      await storage.logAuditEvent(
        "workflow_notification",
        notification.id,
        "created",
        req.user?.id,
        void 0,
        { entityId: validatedData.entityId, type: validatedData.type }
      );
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z16.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error("Error creating workflow notification:", error);
      res.status(500).json({ message: "Failed to create workflow notification" });
    }
  });
  app2.post("/api/workflow/notifications/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await storage.updateWorkflowNotification(id, {
        status: "read",
        readAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      await storage.logAuditEvent(
        "workflow_notification",
        id,
        "read",
        req.user?.id,
        void 0,
        {}
      );
      res.json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });
  app2.post("/api/workflow/notifications/:id/archive", async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await storage.updateWorkflowNotification(id, {
        status: "archived",
        archivedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      await storage.logAuditEvent(
        "workflow_notification",
        id,
        "archived",
        req.user?.id,
        void 0,
        {}
      );
      res.json(notification);
    } catch (error) {
      console.error("Error archiving notification:", error);
      res.status(500).json({ message: "Failed to archive notification" });
    }
  });
  app2.delete("/api/workflow/notifications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteWorkflowNotification(id);
      if (!deleted) {
        return res.status(404).json({ message: "Notification not found" });
      }
      await storage.logAuditEvent(
        "workflow_notification",
        id,
        "deleted",
        req.user?.id,
        void 0,
        {}
      );
      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Failed to delete notification" });
    }
  });
  app2.post("/api/workflow/notifications/mark-all-read", async (req, res) => {
    try {
      const { userId } = req.body;
      const updated = await storage.markAllWorkflowNotificationsAsRead(userId || req.user?.id);
      await storage.logAuditEvent(
        "workflow_notification",
        "all",
        "mark_all_read",
        req.user?.id,
        void 0,
        { count: updated }
      );
      res.json({
        message: "All notifications marked as read",
        count: updated
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });
  app2.get("/api/workflow/notifications/settings", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const settings = await storage.getWorkflowNotificationSettings(userId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      res.status(500).json({ message: "Failed to fetch notification settings" });
    }
  });
  app2.put("/api/workflow/notifications/settings", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const validatedData = updateNotificationSettingsSchema.parse(req.body);
      const settings = await storage.updateWorkflowNotificationSettings(userId, validatedData);
      await storage.logAuditEvent(
        "workflow_notification_settings",
        userId,
        "updated",
        req.user?.id,
        void 0,
        validatedData
      );
      res.json(settings);
    } catch (error) {
      if (error instanceof z16.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error("Error updating notification settings:", error);
      res.status(500).json({ message: "Failed to update notification settings" });
    }
  });
  app2.get("/api/workflow/notifications/stats", async (req, res) => {
    try {
      const userId = req.user?.id;
      const stats = await storage.getWorkflowNotificationStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching notification statistics:", error);
      res.status(500).json({ message: "Failed to fetch notification statistics" });
    }
  });
  app2.post("/api/workflow/notifications/test", async (req, res) => {
    try {
      const { type = "system_alert", message = "Test notification" } = req.body;
      const notification = await storage.createWorkflowNotification({
        type,
        title: "Test Notification",
        message,
        entityId: "test-entity",
        entityType: "test",
        entityName: "Test Entity",
        priority: "Medium",
        status: "unread",
        actionRequired: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      res.json({
        message: "Test notification sent",
        notification
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
      res.status(500).json({ message: "Failed to send test notification" });
    }
  });
  app2.post("/api/workflow/notifications/bulk", async (req, res) => {
    try {
      const { action, notificationIds } = req.body;
      if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        return res.status(400).json({ message: "Notification IDs are required" });
      }
      let result;
      switch (action) {
        case "mark_read":
          result = await storage.bulkUpdateWorkflowNotifications(notificationIds, {
            status: "read",
            readAt: (/* @__PURE__ */ new Date()).toISOString()
          });
          break;
        case "archive":
          result = await storage.bulkUpdateWorkflowNotifications(notificationIds, {
            status: "archived",
            archivedAt: (/* @__PURE__ */ new Date()).toISOString()
          });
          break;
        case "delete":
          result = await storage.bulkDeleteWorkflowNotifications(notificationIds);
          break;
        default:
          return res.status(400).json({ message: "Invalid action" });
      }
      await storage.logAuditEvent(
        "workflow_notification",
        "bulk",
        action,
        req.user?.id,
        void 0,
        { count: result, notificationIds }
      );
      res.json({
        message: `Bulk ${action} completed`,
        count: result
      });
    } catch (error) {
      console.error("Error performing bulk notification operation:", error);
      res.status(500).json({ message: "Failed to perform bulk operation" });
    }
  });
}

// server/routes/inventory.ts
init_schema();
import { z as z17 } from "zod";

// server/services/stock-service.ts
init_storage();
import { randomUUID as randomUUID2 } from "crypto";
async function recordMovement(input) {
  const {
    itemId,
    quantity,
    referenceType,
    referenceId,
    location = "MAIN",
    reason,
    notes,
    createdBy = "system"
  } = input;
  if (!quantity || quantity === 0) {
    throw new Error("Movement quantity must be non-zero");
  }
  const movementType = input.movementType || (quantity > 0 ? "IN" : "OUT");
  const qtyAbs = Math.abs(quantity);
  let level = await storage.getInventoryLevelByItem(itemId, location).catch(() => void 0);
  const beforeQty = level ? level.quantityAvailable ?? 0 : 0;
  const afterQty = beforeQty + quantity;
  if (afterQty < 0) {
    throw new Error(`Resulting stock would be negative (item=${itemId}, before=${beforeQty}, change=${quantity})`);
  }
  if (!level) {
    level = await storage.createInventoryLevel({
      inventoryItemId: itemId,
      storageLocation: location,
      quantityAvailable: afterQty,
      quantityReserved: 0,
      reorderLevel: 0,
      maxStockLevel: 0
    });
  } else {
    level = await storage.updateInventoryLevel(level.id, { quantityAvailable: afterQty });
  }
  const movement = await storage.createStockMovement({
    id: randomUUID2(),
    itemId,
    movementType,
    quantityMoved: qtyAbs,
    quantityBefore: beforeQty,
    quantityAfter: afterQty,
    storageLocation: location,
    referenceType,
    referenceId,
    reason,
    notes,
    createdBy
  });
  return { movement, level };
}
function receiveStock(params) {
  return recordMovement({ ...params, movementType: "IN" });
}

// server/routes/inventory.ts
init_storage();
function registerInventoryRoutes(app2) {
  app2.get("/api/inventory-items", async (req, res) => {
    try {
      const { search, supplierId, category, isActive, limit, offset } = req.query;
      const filters = {
        search,
        supplierId,
        category,
        isActive: isActive === "true" ? true : isActive === "false" ? false : void 0,
        limit: limit ? parseInt(limit) : void 0,
        offset: offset ? parseInt(offset) : void 0
      };
      const items3 = await storage.getInventoryItems(filters);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      res.status(500).json({ message: "Failed to fetch inventory items" });
    }
  });
  app2.get("/api/inventory-items/:id", async (req, res) => {
    try {
      const item = await storage.getInventoryItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      res.status(500).json({ message: "Failed to fetch inventory item" });
    }
  });
  app2.get("/api/inventory-items/supplier-code/:supplierCode", async (req, res) => {
    try {
      const item = await storage.getInventoryItemBySupplierCode(req.params.supplierCode);
      if (!item) {
        return res.status(404).json({ message: "Item not found with this supplier code" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching item by supplier code:", error);
      res.status(500).json({ message: "Failed to fetch item by supplier code" });
    }
  });
  app2.get("/api/inventory-items/barcode/:barcode", async (req, res) => {
    try {
      const item = await storage.getInventoryItemByBarcode(req.params.barcode);
      if (!item) {
        return res.status(404).json({ message: "Item not found with this barcode" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching item by barcode:", error);
      res.status(500).json({ message: "Failed to fetch item by barcode" });
    }
  });
  app2.post("/api/inventory-items", async (req, res) => {
    try {
      const itemData = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z17.ZodError) {
        return res.status(400).json({ message: "Invalid inventory item data", errors: error.errors });
      }
      console.error("Error creating inventory item:", error);
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });
  app2.put("/api/inventory-items/:id", async (req, res) => {
    try {
      const itemData = insertInventoryItemSchema.partial().parse(req.body);
      const item = await storage.updateInventoryItem(req.params.id, itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z17.ZodError) {
        return res.status(400).json({ message: "Invalid inventory item data", errors: error.errors });
      }
      console.error("Error updating inventory item:", error);
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });
  app2.delete("/api/inventory-items/:id", async (req, res) => {
    try {
      await storage.deleteInventoryItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });
  app2.post("/api/inventory-items/bulk", async (req, res) => {
    try {
      const itemsData = z17.array(insertInventoryItemSchema).parse(req.body);
      const items3 = await storage.bulkCreateInventoryItems(itemsData);
      res.status(201).json(items3);
    } catch (error) {
      if (error instanceof z17.ZodError) {
        return res.status(400).json({ message: "Invalid inventory items data", errors: error.errors });
      }
      console.error("Error bulk creating inventory items:", error);
      res.status(500).json({ message: "Failed to bulk create inventory items" });
    }
  });
  app2.get("/api/inventory-items/:itemId/variants", async (req, res) => {
    try {
      const variants = await storage.getItemVariants(req.params.itemId);
      res.json(variants);
    } catch (error) {
      console.error("Error fetching item variants:", error);
      res.status(500).json({ message: "Failed to fetch item variants" });
    }
  });
  app2.post("/api/item-variants", async (req, res) => {
    try {
      const variantData = insertInventoryVariantSchema.parse(req.body);
      const variant = await storage.createItemVariant(variantData);
      res.status(201).json(variant);
    } catch (error) {
      if (error instanceof z17.ZodError) {
        return res.status(400).json({ message: "Invalid item variant data", errors: error.errors });
      }
      console.error("Error creating item variant:", error);
      res.status(500).json({ message: "Failed to create item variant" });
    }
  });
  app2.put("/api/item-variants/:id", async (req, res) => {
    try {
      const variantData = insertInventoryVariantSchema.partial().parse(req.body);
      const variant = await storage.updateItemVariant(req.params.id, variantData);
      res.json(variant);
    } catch (error) {
      if (error instanceof z17.ZodError) {
        return res.status(400).json({ message: "Invalid item variant data", errors: error.errors });
      }
      console.error("Error updating item variant:", error);
      res.status(500).json({ message: "Failed to update item variant" });
    }
  });
  app2.delete("/api/item-variants/:id", async (req, res) => {
    try {
      await storage.deleteItemVariant(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting item variant:", error);
      res.status(500).json({ message: "Failed to delete item variant" });
    }
  });
  app2.get("/api/inventory-levels", async (req, res) => {
    try {
      const { itemId, location, lowStock } = req.query;
      const filters = {
        itemId,
        location,
        lowStock: lowStock === "true"
      };
      const levels = await storage.getInventoryLevels(filters);
      res.json(levels);
    } catch (error) {
      console.error("Error fetching inventory levels:", error);
      res.status(500).json({ message: "Failed to fetch inventory levels" });
    }
  });
  app2.post("/api/inventory-levels", async (req, res) => {
    try {
      const inventoryData = insertInventoryLevelSchema.parse(req.body);
      const level = await storage.createInventoryLevel(inventoryData);
      res.status(201).json(level);
    } catch (error) {
      if (error instanceof z17.ZodError) {
        return res.status(400).json({ message: "Invalid inventory level data", errors: error.errors });
      }
      console.error("Error creating inventory level:", error);
      res.status(500).json({ message: "Failed to create inventory level" });
    }
  });
  app2.put("/api/inventory-levels/:id", async (req, res) => {
    try {
      const inventoryData = insertInventoryLevelSchema.partial().parse(req.body);
      const level = await storage.updateInventoryLevel(req.params.id, inventoryData);
      res.json(level);
    } catch (error) {
      if (error instanceof z17.ZodError) {
        return res.status(400).json({ message: "Invalid inventory level data", errors: error.errors });
      }
      console.error("Error updating inventory level:", error);
      res.status(500).json({ message: "Failed to update inventory level" });
    }
  });
  app2.post("/api/inventory-levels/adjust", async (req, res) => {
    try {
      const { itemId, quantityChange, location, reason, createdBy } = req.body;
      if (!itemId || !quantityChange) {
        return res.status(400).json({ message: "itemId and quantityChange are required" });
      }
      const movement = await recordMovement({
        itemId,
        quantity: quantityChange,
        location,
        reason: reason || "Manual adjustment",
        referenceType: "Adjustment",
        createdBy: createdBy || "system"
      });
      res.json({ level: movement.level, movement: movement.movement });
    } catch (error) {
      console.error("Error adjusting inventory quantity:", error);
      res.status(500).json({ message: error?.message || "Failed to adjust inventory quantity" });
    }
  });
  app2.get("/api/inventory-items/:itemId/stock-history", async (req, res) => {
    try {
      const { limit } = req.query;
      const movements = await storage.getItemStockHistory(
        req.params.itemId,
        limit ? parseInt(limit) : void 0
      );
      res.json(movements);
    } catch (error) {
      console.error("Error fetching item stock history:", error);
      res.status(500).json({ message: "Failed to fetch item stock history" });
    }
  });
  app2.get("/api/stock-movements", async (req, res) => {
    try {
      const { movementType, itemId, location, limit, offset } = req.query;
      const filters = {
        movementType,
        itemId,
        location,
        limit: limit ? parseInt(limit) : void 0,
        offset: offset ? parseInt(offset) : void 0
      };
      const movements = await storage.getStockMovements(filters);
      res.json(movements);
    } catch (error) {
      const err = error;
      console.error("Error fetching stock movements:", err?.stack || err);
      res.status(500).json({ message: "Failed to fetch stock movements", error: err?.message || String(err) });
    }
  });
  app2.get("/api/stock-movements/:id", async (req, res) => {
    try {
      const movement = await storage.getStockMovement(req.params.id);
      if (!movement) {
        return res.status(404).json({ message: "Stock movement not found" });
      }
      res.json(movement);
    } catch (error) {
      console.error("Error fetching stock movement:", error);
      res.status(500).json({ message: "Failed to fetch stock movement" });
    }
  });
  app2.post("/api/stock-movements", async (req, res) => {
    try {
      const movementData = {
        itemId: req.body.itemId,
        variantId: req.body.variantId,
        movementType: req.body.movementType,
        referenceType: req.body.referenceType,
        referenceId: req.body.referenceId,
        transferNumber: req.body.transferNumber,
        quantityMoved: req.body.quantityMoved,
        quantityBefore: req.body.quantityBefore,
        quantityAfter: req.body.quantityAfter,
        fromLocation: req.body.fromLocation,
        toLocation: req.body.toLocation,
        storageLocation: req.body.storageLocation,
        transferDate: req.body.transferDate,
        requestedBy: req.body.requestedBy,
        createdBy: req.body.createdBy || req.body.requestedBy || "system",
        reason: req.body.reason,
        notes: req.body.notes,
        status: req.body.status,
        unitCost: req.body.unitCost,
        totalValue: req.body.totalValue
      };
      const movement = await storage.createStockMovement(movementData);
      res.status(201).json(movement);
    } catch (error) {
      console.error("Error creating stock movement:", error);
      res.status(500).json({ message: "Failed to create stock movement" });
    }
  });
}

// server/routes/physical-stock.ts
init_schema();
import { z as z18 } from "zod";
function registerPhysicalStockRoutes(app2) {
  app2.get("/api/physical-stock", async (req, res) => {
    try {
      const items3 = await storage2.getAllPhysicalStockItems();
      const mapped = (Array.isArray(items3) ? items3 : []).map((item) => ({
        id: item.id,
        itemId: item.itemId,
        location: item.location,
        quantity: item.quantity,
        lastUpdated: item.lastUpdated,
        countedBy: item.countedBy || null,
        notes: item.notes || null
      }));
      res.json(mapped);
    } catch (error) {
      console.error("Error fetching physical stock items:", error);
      res.status(500).json({ message: "Failed to fetch physical stock" });
    }
  });
  app2.post("/api/physical-stock", async (req, res) => {
    try {
      const { itemId, location, quantity, lastUpdated, countedBy, notes } = req.body;
      if (!itemId || !location || typeof quantity !== "number" || !lastUpdated || !countedBy) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const newItem = await storage2.createPhysicalStockItem({
        itemId,
        location,
        quantity,
        lastUpdated,
        countedBy,
        notes
      });
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error creating physical stock item:", error);
      res.status(500).json({ message: "Failed to create physical stock item" });
    }
  });
  app2.put("/api/physical-stock/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      console.log("[DEBUG] PUT /api/physical-stock/" + id, { body: updateData });
      const updated = await storage2.updatePhysicalStockItem(id, updateData);
      if (!updated) {
        return res.status(404).json({ message: "Physical stock item not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating physical stock item:", error);
      res.status(500).json({ message: "Failed to update physical stock item" });
    }
  });
  app2.delete("/api/physical-stock/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.header("X-User-ID");
      const success = await storage2.deletePhysicalStockItem(id, userId);
      if (!success) {
        return res.status(404).json({ message: "Physical stock item not found" });
      }
      res.json({ message: "Physical stock item deleted" });
    } catch (error) {
      console.error("Error deleting physical stock item:", error);
      res.status(500).json({ message: "Failed to delete physical stock item" });
    }
  });
  app2.get("/api/physical-stock-counts", async (req, res) => {
    try {
      const items3 = await storage2.getAllPhysicalStockItems();
      const mapped = (Array.isArray(items3) ? items3 : []).map((item) => ({
        id: item.id,
        itemId: item.itemId,
        location: item.location,
        quantity: item.quantity,
        lastUpdated: item.lastUpdated
      }));
      res.json(mapped);
    } catch (error) {
      console.error("Error fetching physical stock items:", error);
      res.status(500).json({ message: "Failed to fetch physical stock items" });
    }
  });
  app2.get("/api/physical-stock-counts/:id", async (req, res) => {
    try {
      const count7 = await storage2.getPhysicalStockCountById(req.params.id);
      if (!count7) {
        return res.status(404).json({ message: "Physical stock count not found" });
      }
      res.json(count7);
    } catch (error) {
      console.error("Error fetching physical stock count:", error);
      res.status(500).json({ message: "Failed to fetch physical stock count" });
    }
  });
  app2.get("/api/physical-stock-counts/number/:countNumber", async (req, res) => {
    try {
      const count7 = await storage2.getPhysicalStockCountByNumber(req.params.countNumber);
      if (!count7) {
        return res.status(404).json({ message: "Physical stock count not found" });
      }
      res.json(count7);
    } catch (error) {
      console.error("Error fetching physical stock count:", error);
      res.status(500).json({ message: "Failed to fetch physical stock count" });
    }
  });
  app2.post("/api/physical-stock-counts", async (req, res) => {
    try {
      const validatedData = insertPhysicalStockCountSchema.parse(req.body);
      const count7 = await storage2.createPhysicalStockCount(validatedData);
      res.status(201).json(count7);
    } catch (error) {
      if (error instanceof z18.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating physical stock count:", error);
      res.status(500).json({ message: "Failed to create physical stock count" });
    }
  });
  app2.put("/api/physical-stock-counts/:id", async (req, res) => {
    try {
      const validatedData = insertPhysicalStockCountSchema.partial().parse(req.body);
      const userId = req.header("X-User-ID");
      const count7 = await storage2.updatePhysicalStockCount(req.params.id, validatedData, userId);
      if (!count7) {
        return res.status(404).json({ message: "Physical stock count not found" });
      }
      res.json(count7);
    } catch (error) {
      if (error instanceof z18.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating physical stock count:", error);
      res.status(500).json({ message: "Failed to update physical stock count" });
    }
  });
  app2.delete("/api/physical-stock-counts/:id", async (req, res) => {
    try {
      const userId = req.header("X-User-ID");
      const success = await storage2.deletePhysicalStockCount(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ message: "Physical stock count not found" });
      }
      res.json({ message: "Physical stock count deleted successfully" });
    } catch (error) {
      console.error("Error deleting physical stock count:", error);
      res.status(500).json({ message: "Failed to delete physical stock count" });
    }
  });
  app2.get("/api/physical-stock-counts/:id/items", async (req, res) => {
    try {
      const items3 = await storage2.getPhysicalStockCountItems(req.params.id);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching physical stock count items:", error);
      res.status(500).json({ message: "Failed to fetch physical stock count items" });
    }
  });
  app2.post("/api/physical-stock-counts/:id/items", async (req, res) => {
    try {
      const validatedData = insertPhysicalStockCountItemSchema.parse({
        ...req.body,
        physicalStockCountId: req.params.id
      });
      const item = await storage2.createPhysicalStockCountItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z18.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating physical stock count item:", error);
      res.status(500).json({ message: "Failed to create physical stock count item" });
    }
  });
  app2.put("/api/physical-stock-count-items/:id", async (req, res) => {
    try {
      const validatedData = insertPhysicalStockCountItemSchema.partial().parse(req.body);
      const item = await storage2.updatePhysicalStockCountItem(req.params.id, validatedData);
      if (!item) {
        return res.status(404).json({ message: "Physical stock count item not found" });
      }
      res.json(item);
    } catch (error) {
      if (error instanceof z18.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating physical stock count item:", error);
      res.status(500).json({ message: "Failed to update physical stock count item" });
    }
  });
  app2.post("/api/physical-stock-counts/:id/populate", async (req, res) => {
    try {
      const { storageLocation } = req.body;
      const itemsAdded = await storage2.populatePhysicalStockCountItems(req.params.id, storageLocation);
      res.json({ message: `${itemsAdded} items added to physical stock count`, itemsAdded });
    } catch (error) {
      console.error("Error populating physical stock count:", error);
      res.status(500).json({ message: "Failed to populate physical stock count" });
    }
  });
  app2.get("/api/physical-stock-counts/:id/scanning-sessions", async (req, res) => {
    try {
      const sessions = await storage2.getScanningSessionsByCountId(req.params.id);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching scanning sessions:", error);
      res.status(500).json({ message: "Failed to fetch scanning sessions" });
    }
  });
  app2.post("/api/physical-stock-counts/:id/scanning-sessions", async (req, res) => {
    try {
      const validatedData = insertPhysicalStockScanningSessionSchema.parse({
        ...req.body,
        physicalStockCountId: req.params.id
      });
      const session2 = await storage2.createScanningSession(validatedData);
      res.status(201).json(session2);
    } catch (error) {
      if (error instanceof z18.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating scanning session:", error);
      res.status(500).json({ message: "Failed to create scanning session" });
    }
  });
  app2.put("/api/scanning-sessions/:id", async (req, res) => {
    try {
      const validatedData = insertPhysicalStockScanningSessionSchema.partial().parse(req.body);
      const session2 = await storage2.updateScanningSession(req.params.id, validatedData);
      if (!session2) {
        return res.status(404).json({ message: "Scanning session not found" });
      }
      res.json(session2);
    } catch (error) {
      if (error instanceof z18.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating scanning session:", error);
      res.status(500).json({ message: "Failed to update scanning session" });
    }
  });
  app2.get("/api/scanning-sessions/:id/items", async (req, res) => {
    try {
      const items3 = await storage2.getScannedItemsBySession(req.params.id);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching scanned items:", error);
      res.status(500).json({ message: "Failed to fetch scanned items" });
    }
  });
  app2.post("/api/scanning-sessions/:id/scan", async (req, res) => {
    try {
      const { barcode, quantity = 1, storageLocation } = req.body;
      const scannedBy = req.header("X-User-ID");
      if (!barcode) {
        return res.status(400).json({ message: "Barcode is required" });
      }
      if (!scannedBy) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const result = await storage2.processBarcodeScan(
        req.params.id,
        barcode,
        scannedBy,
        quantity,
        storageLocation
      );
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      res.json(result);
    } catch (error) {
      console.error("Error processing barcode scan:", error);
      res.status(500).json({ message: "Failed to process barcode scan" });
    }
  });
  app2.post("/api/scanning-sessions/:id/items", async (req, res) => {
    try {
      const validatedData = insertPhysicalStockScannedItemSchema.parse({
        ...req.body,
        scanningSessionId: req.params.id
      });
      const item = await storage2.createScannedItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z18.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating scanned item:", error);
      res.status(500).json({ message: "Failed to create scanned item" });
    }
  });
  app2.post("/api/physical-stock-counts/:id/adjustments", async (req, res) => {
    try {
      const createdBy = req.header("X-User-ID");
      const adjustment = await storage2.generateAdjustmentsFromCount(req.params.id, createdBy);
      if (!adjustment) {
        return res.status(400).json({ message: "No adjustments needed or count not ready for adjustment" });
      }
      res.status(201).json(adjustment);
    } catch (error) {
      console.error("Error creating adjustment:", error);
      res.status(500).json({ message: "Failed to create adjustment" });
    }
  });
  app2.post("/api/physical-stock-adjustments/:id/apply", async (req, res) => {
    try {
      const appliedBy = req.header("X-User-ID");
      if (!appliedBy) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const success = await storage2.applyPhysicalStockAdjustment(req.params.id, appliedBy);
      if (!success) {
        return res.status(400).json({ message: "Adjustment could not be applied" });
      }
      res.json({ message: "Adjustment applied successfully" });
    } catch (error) {
      console.error("Error applying adjustment:", error);
      res.status(500).json({ message: "Failed to apply adjustment" });
    }
  });
  app2.get("/api/physical-stock-counts/:id/summary", async (req, res) => {
    try {
      const summary = await storage2.getPhysicalStockCountSummary(req.params.id);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
      res.status(500).json({ message: "Failed to fetch summary" });
    }
  });
  app2.post("/api/physical-stock-counts/:id/finalize", async (req, res) => {
    try {
      const completedBy = req.header("X-User-ID");
      if (!completedBy) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const success = await storage2.finalizePhysicalStockCount(req.params.id, completedBy);
      if (!success) {
        return res.status(400).json({ message: "Count could not be finalized" });
      }
      res.json({ message: "Physical stock count finalized successfully" });
    } catch (error) {
      console.error("Error finalizing count:", error);
      res.status(500).json({ message: "Failed to finalize count" });
    }
  });
  app2.get("/api/physical-stock-counts/:id/variance-report", async (req, res) => {
    try {
      const items3 = await storage2.getPhysicalStockCountItems(req.params.id);
      const varianceItems = items3.filter((item) => Math.abs(item.variance || 0) > 0);
      const report = {
        countId: req.params.id,
        totalItems: items3.length,
        varianceItems: varianceItems.length,
        totalVarianceValue: varianceItems.reduce((sum4, item) => sum4 + parseFloat(item.varianceValue || "0"), 0),
        items: varianceItems.map((item) => ({
          supplierCode: item.supplierCode,
          description: item.description,
          systemQuantity: item.systemQuantity,
          physicalQuantity: item.finalCountQuantity,
          variance: item.variance,
          varianceValue: item.varianceValue,
          status: item.status,
          discrepancyReason: item.discrepancyReason
        }))
      };
      res.json(report);
    } catch (error) {
      console.error("Error generating variance report:", error);
      res.status(500).json({ message: "Failed to generate variance report" });
    }
  });
  app2.get("/api/physical-stock-counts/:id/statistics", async (req, res) => {
    try {
      const summary = await storage2.getPhysicalStockCountSummary(req.params.id);
      const count7 = await storage2.getPhysicalStockCountById(req.params.id);
      if (!count7) {
        return res.status(404).json({ message: "Physical stock count not found" });
      }
      const statistics = {
        ...summary,
        countDetails: {
          countNumber: count7.countNumber,
          status: count7.status,
          countType: count7.countType,
          storageLocation: count7.storageLocation,
          scheduledDate: count7.scheduledDate,
          startedAt: count7.startedAt,
          completedAt: count7.completedAt
        },
        progressPercentage: summary.totalItems > 0 ? Math.round(summary.countedItems / summary.totalItems * 100) : 0,
        accuracyPercentage: summary.totalItems > 0 ? Math.round((summary.totalItems - summary.discrepancyItems) / summary.totalItems * 100) : 0
      };
      res.json(statistics);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
}

// server/routes/pricing.ts
init_pricing_storage();
init_pricing_engine();
import { Router as Router3 } from "express";
import { z as z19 } from "zod";
var router3 = Router3();
var calculatePriceSchema = z19.object({
  itemId: z19.string().uuid("Invalid item ID"),
  customerId: z19.string().uuid("Invalid customer ID"),
  quantity: z19.number().min(1, "Quantity must be at least 1").default(1),
  method: z19.enum([
    "cost_plus",
    "margin_based",
    "competitive",
    "value_based",
    "dynamic",
    "contract",
    "volume_tiered"
  ]).optional(),
  targetCurrency: z19.string().length(3, "Currency must be 3 characters").default("BHD")
});
var batchCalculatePricesSchema = z19.object({
  items: z19.array(z19.object({
    itemId: z19.string().uuid(),
    quantity: z19.number().min(1).default(1)
  })),
  customerId: z19.string().uuid("Invalid customer ID"),
  targetCurrency: z19.string().length(3).default("BHD")
});
var volumeTierSchema = z19.object({
  itemId: z19.string().uuid("Invalid item ID"),
  customerId: z19.string().uuid("Invalid customer ID").optional(),
  tierName: z19.string().min(1, "Tier name is required"),
  minQuantity: z19.number().min(1, "Minimum quantity must be at least 1"),
  maxQuantity: z19.number().optional(),
  discountPercentage: z19.number().min(0).max(100).optional(),
  specialPrice: z19.number().min(0).optional(),
  currency: z19.string().length(3).default("BHD"),
  effectiveFrom: z19.string().datetime().optional(),
  effectiveTo: z19.string().datetime().optional()
});
var contractPricingSchema = z19.object({
  contractNumber: z19.string().min(1, "Contract number is required").optional(),
  customerId: z19.string().uuid("Invalid customer ID"),
  supplierId: z19.string().uuid("Invalid supplier ID").optional(),
  itemId: z19.string().uuid("Invalid item ID"),
  contractPrice: z19.number().min(0, "Contract price must be positive"),
  minimumQuantity: z19.number().min(0).optional(),
  maximumQuantity: z19.number().min(0).optional(),
  currency: z19.string().length(3).default("BHD"),
  contractStartDate: z19.string().datetime(),
  contractEndDate: z19.string().datetime(),
  priceProtectionClause: z19.string().optional(),
  autoRenewal: z19.boolean().default(false),
  renewalNoticeDays: z19.number().min(1).default(30),
  terms: z19.string().optional(),
  createdBy: z19.string().uuid().optional()
});
var competitorPricingSchema = z19.object({
  competitorName: z19.string().min(1, "Competitor name is required"),
  itemId: z19.string().uuid("Invalid item ID"),
  competitorSku: z19.string().optional(),
  price: z19.number().min(0, "Price must be positive"),
  currency: z19.string().length(3).default("BHD"),
  source: z19.string().optional(),
  sourceUrl: z19.string().url().optional(),
  notes: z19.string().optional(),
  collectedBy: z19.string().uuid().optional()
});
var dynamicPricingConfigSchema = z19.object({
  itemId: z19.string().uuid("Invalid item ID"),
  categoryId: z19.string().uuid().optional(),
  customerId: z19.string().uuid().optional(),
  enabled: z19.boolean().default(false),
  marketDemandFactor: z19.number().min(0.1).max(5).default(1),
  seasonalFactor: z19.number().min(0.1).max(5).default(1),
  competitorFactor: z19.number().min(0.1).max(5).default(1),
  inventoryFactor: z19.number().min(0.1).max(5).default(1),
  minPrice: z19.number().min(0).optional(),
  maxPrice: z19.number().min(0).optional(),
  minMarginPercentage: z19.number().min(0).max(100).default(10),
  maxMarkupPercentage: z19.number().min(0).optional(),
  updateFrequencyHours: z19.number().min(1).default(24)
});
var currencyRateSchema = z19.object({
  fromCurrency: z19.string().length(3, "Currency must be 3 characters"),
  toCurrency: z19.string().length(3, "Currency must be 3 characters"),
  rate: z19.number().min(0, "Rate must be positive"),
  source: z19.string().optional(),
  effectiveDate: z19.string().datetime().optional(),
  expiresAt: z19.string().datetime().optional()
});
var marginAnalysisSchema = z19.object({
  itemId: z19.string().uuid().optional(),
  customerId: z19.string().uuid().optional(),
  categoryId: z19.string().uuid().optional(),
  periodStart: z19.string().datetime(),
  periodEnd: z19.string().datetime()
});
router3.post("/calculate-price", async (req, res) => {
  try {
    const data = calculatePriceSchema.parse(req.body);
    const result = await enhancedPricingStorage.calculateItemPrice(
      data.itemId,
      data.customerId,
      data.quantity,
      data.method
    );
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error calculating price:", error);
    if (error instanceof z19.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to calculate price"
    });
  }
});
router3.post("/calculate-batch-prices", async (req, res) => {
  try {
    const data = batchCalculatePricesSchema.parse(req.body);
    const itemIds = data.items.map((item) => item.itemId);
    const quantities = data.items.map((item) => item.quantity);
    const results = await enhancedPricingStorage.calculateBatchPrices(
      itemIds,
      data.customerId,
      quantities
    );
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error("Error calculating batch prices:", error);
    if (error instanceof z19.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to calculate batch prices"
    });
  }
});
router3.get("/volume-tiers", async (req, res) => {
  try {
    const { itemId, customerId } = req.query;
    const tiers = await enhancedPricingStorage.getVolumePricingTiers(
      itemId,
      customerId
    );
    res.json({
      success: true,
      data: tiers
    });
  } catch (error) {
    console.error("Error fetching volume tiers:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch volume pricing tiers"
    });
  }
});
router3.post("/volume-tiers", async (req, res) => {
  try {
    const data = volumeTierSchema.parse(req.body);
    const tier = await enhancedPricingStorage.createVolumePricingTier({
      ...data,
      effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : void 0,
      effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : void 0
    });
    res.status(201).json({
      success: true,
      data: tier
    });
  } catch (error) {
    console.error("Error creating volume tier:", error);
    if (error instanceof z19.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create volume pricing tier"
    });
  }
});
router3.put("/volume-tiers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = volumeTierSchema.partial().parse(req.body);
    const tier = await enhancedPricingStorage.updateVolumePricingTier(id, {
      ...data,
      effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : void 0,
      effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : void 0
    });
    res.json({
      success: true,
      data: tier
    });
  } catch (error) {
    console.error("Error updating volume tier:", error);
    if (error instanceof z19.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update volume pricing tier"
    });
  }
});
router3.get("/contract-pricing", async (req, res) => {
  try {
    const { customerId, itemId, status, activeOnly } = req.query;
    const contracts = await enhancedPricingStorage.getContractPricing({
      customerId,
      itemId,
      status,
      activeOnly: activeOnly === "true"
    });
    res.json({
      success: true,
      data: contracts
    });
  } catch (error) {
    console.error("Error fetching contract pricing:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch contract pricing"
    });
  }
});
router3.post("/contract-pricing", async (req, res) => {
  try {
    const data = contractPricingSchema.parse(req.body);
    const contract = await enhancedPricingStorage.createContractPricing({
      ...data,
      contractStartDate: new Date(data.contractStartDate),
      contractEndDate: new Date(data.contractEndDate)
    });
    res.status(201).json({
      success: true,
      data: contract
    });
  } catch (error) {
    console.error("Error creating contract pricing:", error);
    if (error instanceof z19.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create contract pricing"
    });
  }
});
router3.get("/competitor-pricing", async (req, res) => {
  try {
    const { itemId, competitorName } = req.query;
    const pricing = await enhancedPricingStorage.getCompetitorPricing(
      itemId,
      competitorName
    );
    res.json({
      success: true,
      data: pricing
    });
  } catch (error) {
    console.error("Error fetching competitor pricing:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch competitor pricing"
    });
  }
});
router3.post("/competitor-pricing", async (req, res) => {
  try {
    const data = competitorPricingSchema.parse(req.body);
    const pricing = await enhancedPricingStorage.createCompetitorPricing(data);
    res.status(201).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    console.error("Error creating competitor pricing:", error);
    if (error instanceof z19.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create competitor pricing"
    });
  }
});
router3.get("/dynamic-pricing-config", async (req, res) => {
  try {
    const { itemId, customerId } = req.query;
    const configs = await enhancedPricingStorage.getDynamicPricingConfig(
      itemId,
      customerId
    );
    res.json({
      success: true,
      data: configs
    });
  } catch (error) {
    console.error("Error fetching dynamic pricing config:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dynamic pricing configuration"
    });
  }
});
router3.post("/dynamic-pricing-config", async (req, res) => {
  try {
    const data = dynamicPricingConfigSchema.parse(req.body);
    const config = await enhancedPricingStorage.createDynamicPricingConfig(data);
    res.status(201).json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error("Error creating dynamic pricing config:", error);
    if (error instanceof z19.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create dynamic pricing configuration"
    });
  }
});
router3.get("/currency-rates", async (req, res) => {
  try {
    const { fromCurrency, toCurrency } = req.query;
    const rates = await enhancedPricingStorage.getCurrencyExchangeRates(
      fromCurrency,
      toCurrency
    );
    res.json({
      success: true,
      data: rates
    });
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch currency exchange rates"
    });
  }
});
router3.post("/currency-rates", async (req, res) => {
  try {
    const data = currencyRateSchema.parse(req.body);
    const rate = await enhancedPricingStorage.createCurrencyExchangeRate({
      ...data,
      effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : void 0,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : void 0
    });
    res.status(201).json({
      success: true,
      data: rate
    });
  } catch (error) {
    console.error("Error creating currency rate:", error);
    if (error instanceof z19.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create currency exchange rate"
    });
  }
});
router3.post("/margin-analysis", async (req, res) => {
  try {
    const data = marginAnalysisSchema.parse(req.body);
    const analysis = await enhancedPricingStorage.generateMarginAnalysis(
      data.itemId,
      data.customerId,
      data.categoryId,
      new Date(data.periodStart),
      new Date(data.periodEnd)
    );
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error("Error generating margin analysis:", error);
    if (error instanceof z19.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to generate margin analysis"
    });
  }
});
router3.get("/margin-analysis", async (req, res) => {
  try {
    const { itemId, customerId, categoryId, dateFrom, dateTo } = req.query;
    const analyses = await enhancedPricingStorage.getMarginAnalysis({
      itemId,
      customerId,
      categoryId,
      dateFrom: dateFrom ? new Date(dateFrom) : void 0,
      dateTo: dateTo ? new Date(dateTo) : void 0
    });
    res.json({
      success: true,
      data: analyses
    });
  } catch (error) {
    console.error("Error fetching margin analysis:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch margin analysis"
    });
  }
});
router3.get("/reports/pricing-performance", async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    if (!dateFrom || !dateTo) {
      return res.status(400).json({
        success: false,
        error: "dateFrom and dateTo are required"
      });
    }
    const report = await enhancedPricingStorage.getPricingPerformanceReport(
      new Date(dateFrom),
      new Date(dateTo)
    );
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error("Error generating pricing performance report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate pricing performance report"
    });
  }
});
router3.get("/reports/competitive-position", async (req, res) => {
  try {
    const { itemId } = req.query;
    const report = await enhancedPricingStorage.getCompetitivePositionReport(
      itemId
    );
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error("Error generating competitive position report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate competitive position report"
    });
  }
});
router3.get("/price-analysis/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const analysis = await pricingEngine.generatePriceAnalysis(itemId);
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error("Error generating price analysis:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate price analysis"
    });
  }
});
function registerPricingRoutes(app2) {
  app2.use("/api/pricing", router3);
  console.log("\u2705 Pricing routes registered");
}

// server/ai-service.ts
init_storage();
async function generateAIResponse(message, context = [], pageContext) {
  const lowerMessage = message.toLowerCase();
  try {
    if (containsKeywords(lowerMessage, ["enquiry", "enquiries", "inquiry", "inquiries"])) {
      return await handleEnquiryQuestions(lowerMessage, pageContext);
    }
    if (containsKeywords(lowerMessage, ["quotation", "quote", "pricing"])) {
      return await handleQuotationQuestions(lowerMessage, pageContext);
    }
    if (containsKeywords(lowerMessage, ["inventory", "stock", "items", "products"])) {
      return await handleInventoryQuestions(lowerMessage, pageContext);
    }
    if (containsKeywords(lowerMessage, ["customer", "client"])) {
      return await handleCustomerQuestions(lowerMessage, pageContext);
    }
    if (containsKeywords(lowerMessage, ["sales", "order", "purchase"])) {
      return await handleSalesQuestions(lowerMessage, pageContext);
    }
    if (containsKeywords(lowerMessage, ["report", "analytics", "dashboard"])) {
      return await handleReportingQuestions(lowerMessage, pageContext);
    }
    if (containsKeywords(lowerMessage, ["help", "how", "what", "guide"])) {
      return await handleHelpQuestions(lowerMessage, pageContext);
    }
    return {
      response: "I'm here to help with your ERP needs! I can assist you with enquiries, quotations, inventory management, customer information, sales orders, and reporting. What would you like to know more about?",
      suggestions: [
        "Show me recent enquiries",
        "Help me create a quotation",
        "Check inventory levels",
        "Customer management tips",
        "Sales order status",
        "Generate reports"
      ]
    };
  } catch (error) {
    console.error("Error generating AI response:", error);
    return {
      response: "I apologize, but I'm having trouble processing your request right now. Please try asking your question in a different way.",
      suggestions: [
        "Ask about enquiries",
        "Get help with quotations",
        "Check inventory",
        "View dashboard"
      ]
    };
  }
}
async function handleEnquiryQuestions(message, pageContext) {
  try {
    const stats = await storage.getDashboardStats();
    if (containsKeywords(message, ["recent", "latest", "new"])) {
      const enquiries3 = await storage.getEnquiries(5, 0);
      return {
        response: `I found ${enquiries3.length} recent enquiries in the system:

${enquiries3.map(
          (e, i) => `${i + 1}. #${e.enquiryNumber} - Status: ${e.status} - ${e.enquiryDate ? new Date(e.enquiryDate).toLocaleDateString() : "No date"}`
        ).join("\n")}

Would you like me to help you with any specific enquiry or create a new one?`,
        suggestions: [
          "Create new enquiry",
          "Show enquiry details",
          "Filter by customer",
          "Check enquiry status"
        ]
      };
    }
    if (containsKeywords(message, ["create", "new", "add"])) {
      return {
        response: "I can help you create a new enquiry! Here's what you'll need:\n\n\u2022 Customer information\n\u2022 Enquiry subject/description\n\u2022 Items or services needed\n\u2022 Expected delivery date\n\u2022 Any special requirements\n\nWould you like me to guide you through the process step by step?",
        suggestions: [
          "Go to enquiry form",
          "Select customer first",
          "Add enquiry items",
          "Set delivery requirements"
        ]
      };
    }
    if (containsKeywords(message, ["status", "progress", "update"])) {
      return {
        response: `Current enquiry status overview:

\u2022 Active Enquiries: ${stats.activeEnquiries || 0}
\u2022 Pending Quotes: ${stats.pendingQuotes || 0}
\u2022 Active Orders: ${stats.activeOrders || 0}

Which enquiries would you like to review?`,
        suggestions: [
          "Show new enquiries",
          "Review in progress",
          "Check quoted enquiries",
          "Update enquiry status"
        ]
      };
    }
  } catch (error) {
    console.error("Error handling enquiry questions:", error);
  }
  return {
    response: "I can help you with enquiry management including creating new enquiries, checking status, and reviewing existing ones. What specific aspect would you like assistance with?",
    suggestions: [
      "View all enquiries",
      "Create new enquiry",
      "Search enquiries",
      "Enquiry reports"
    ]
  };
}
async function handleQuotationQuestions(message, pageContext) {
  try {
    if (containsKeywords(message, ["create", "new", "generate"])) {
      return {
        response: "I can help you create a quotation! The process involves:\n\n1. Select the enquiry or create items manually\n2. Add products/services with quantities\n3. Set pricing (retail/wholesale markups apply automatically)\n4. Review terms and conditions\n5. Generate and send the quotation\n\nDo you have an existing enquiry to quote, or do you want to create a custom quotation?",
        suggestions: [
          "Quote from enquiry",
          "Create custom quotation",
          "Set pricing rules",
          "Review quotation templates"
        ]
      };
    }
    if (containsKeywords(message, ["pricing", "price", "markup", "cost"])) {
      return {
        response: "Our pricing system uses automatic markups:\n\n\u2022 Retail customers: 70% markup (default)\n\u2022 Wholesale customers: 40% markup (default)\n\u2022 Custom pricing rules can be set per customer\n\u2022 Bulk pricing discounts available\n\nWould you like me to help you configure pricing for specific customers or items?",
        suggestions: [
          "Set customer pricing",
          "Configure markup rules",
          "Apply bulk discounts",
          "Review price lists"
        ]
      };
    }
    const quotations3 = await storage.getQuotations(5, 0);
    return {
      response: `You have ${quotations3.length} recent quotations in the system:

${quotations3.map(
        (q, i) => `${i + 1}. #${q.quoteNumber} - ${q.status} - $${q.totalAmount || 0}`
      ).join("\n")}

What would you like to do with quotations?`,
      suggestions: [
        "Create new quotation",
        "Review pending quotes",
        "Send quotation",
        "Convert to sales order"
      ]
    };
  } catch (error) {
    console.error("Error handling quotation questions:", error);
  }
  return {
    response: "I can assist with quotation management including creating quotes, setting pricing, and converting to sales orders. How can I help?",
    suggestions: [
      "New quotation",
      "Pricing help",
      "Quotation status",
      "Customer quotes"
    ]
  };
}
async function handleInventoryQuestions(message, pageContext) {
  try {
    if (containsKeywords(message, ["levels", "stock", "quantity", "available"])) {
      const items3 = await storage.getInventoryItems({ limit: 10 });
      return {
        response: `Current inventory overview:

\u2022 Total items: ${items3.length}
\u2022 Active products: ${items3.filter((i) => i.isActive).length}

Recent inventory items:
${items3.slice(0, 5).map(
          (item, i) => `${i + 1}. ${item.description} - Qty: ${item.totalQuantity || 0}`
        ).join("\n")}

Would you like to check specific items or update inventory levels?`,
        suggestions: [
          "Search specific item",
          "Update stock levels",
          "Add new items",
          "Check low stock alerts"
        ]
      };
    }
    if (containsKeywords(message, ["low", "shortage", "reorder", "alert"])) {
      return {
        response: "I can help you identify items that need restocking:\n\n\u2022 Set minimum stock levels\n\u2022 Monitor inventory alerts\n\u2022 Generate reorder reports\n\u2022 Track supplier lead times\n\nWould you like me to show you items with low stock levels?",
        suggestions: [
          "Show low stock items",
          "Set reorder points",
          "Contact suppliers",
          "Generate purchase orders"
        ]
      };
    }
    if (containsKeywords(message, ["add", "new", "create", "item"])) {
      return {
        response: "To add new inventory items, you'll need:\n\n\u2022 Supplier code and description\n\u2022 Category and unit of measure\n\u2022 Cost price and supplier information\n\u2022 Markup percentages (retail/wholesale)\n\u2022 Barcode (optional)\n\nI can guide you through the process. Would you like to start adding a new item?",
        suggestions: [
          "Add new item",
          "Import from supplier",
          "Set item categories",
          "Configure pricing"
        ]
      };
    }
  } catch (error) {
    console.error("Error handling inventory questions:", error);
  }
  return {
    response: "I can help with inventory management including stock levels, adding new items, and tracking quantities. What specific inventory task can I assist with?",
    suggestions: [
      "Check stock levels",
      "Add new items",
      "Update quantities",
      "Inventory reports"
    ]
  };
}
async function handleCustomerQuestions(message, pageContext) {
  try {
    const customers3 = await storage.getCustomers(5, 0);
    if (containsKeywords(message, ["add", "new", "create"])) {
      return {
        response: "To add a new customer, I'll need:\n\n\u2022 Customer name and contact information\n\u2022 Customer type (Retail/Wholesale)\n\u2022 Classification (Internal/Corporate/Individual/Family/Ministry)\n\u2022 Address and tax ID\n\u2022 Credit limit and payment terms\n\nShall I guide you through creating a new customer profile?",
        suggestions: [
          "Create retail customer",
          "Add wholesale customer",
          "Set payment terms",
          "Configure credit limits"
        ]
      };
    }
    if (containsKeywords(message, ["list", "show", "all", "view"])) {
      return {
        response: `You have ${customers3.length} recent customers in the system:

${customers3.map(
          (c, i) => `${i + 1}. ${c.name} - ${c.customerType} (${c.classification})`
        ).join("\n")}

Would you like to view details for any specific customer?`,
        suggestions: [
          "Search customers",
          "Filter by type",
          "Customer details",
          "Update customer info"
        ]
      };
    }
  } catch (error) {
    console.error("Error handling customer questions:", error);
  }
  return {
    response: "I can help with customer management including adding new customers, updating information, and setting up payment terms. What would you like to do?",
    suggestions: [
      "Add new customer",
      "View all customers",
      "Search customers",
      "Customer reports"
    ]
  };
}
async function handleSalesQuestions(message, pageContext) {
  try {
    if (containsKeywords(message, ["order", "sales", "purchase"])) {
      const salesOrders3 = await storage.getSalesOrders(5, 0);
      return {
        response: `Sales order overview:

\u2022 Total recent orders: ${salesOrders3.length}

Recent sales orders:
${salesOrders3.map(
          (so, i) => `${i + 1}. Order #${so.orderNumber} - ${so.status} ($${so.totalAmount})`
        ).join("\n")}

What would you like to do with sales orders?`,
        suggestions: [
          "Create new order",
          "Update order status",
          "Process delivery",
          "Generate invoice"
        ]
      };
    }
  } catch (error) {
    console.error("Error handling sales questions:", error);
  }
  return {
    response: "I can assist with sales order management, purchase orders, and delivery coordination. How can I help?",
    suggestions: [
      "View sales orders",
      "Create purchase order",
      "Track deliveries",
      "Sales reports"
    ]
  };
}
async function handleReportingQuestions(message, pageContext) {
  try {
    const stats = await storage.getDashboardStats();
    return {
      response: `Here's your current business overview:

\u{1F4CA} **Dashboard Summary:**
\u2022 Active Enquiries: ${stats.activeEnquiries || 0}
\u2022 Pending Quotes: ${stats.pendingQuotes || 0}
\u2022 Active Orders: ${stats.activeOrders || 0}
\u2022 Monthly Revenue: $${stats.monthlyRevenue || 0}

Which specific reports would you like to generate?`,
      suggestions: [
        "Sales performance report",
        "Inventory analysis",
        "Customer activity report",
        "Revenue analytics"
      ]
    };
  } catch (error) {
    console.error("Error handling reporting questions:", error);
  }
  return {
    response: "I can help you generate various reports including sales, inventory, customer analytics, and financial summaries. What type of report do you need?",
    suggestions: [
      "Sales reports",
      "Inventory reports",
      "Customer analytics",
      "Financial summary"
    ]
  };
}
async function handleHelpQuestions(message, pageContext) {
  const currentPage = pageContext?.currentPage;
  if (currentPage) {
    const pageHelp = getPageSpecificHelp(currentPage);
    if (pageHelp) {
      return pageHelp;
    }
  }
  return {
    response: "I'm here to help you navigate the ERP system! Here are the main areas I can assist with:\n\n\u{1F50D} **Enquiry Management** - Create and track customer enquiries\n\u{1F4B0} **Quotations** - Generate quotes with automatic pricing\n\u{1F4E6} **Inventory** - Manage stock levels and items\n\u{1F465} **Customers** - Customer profiles and management\n\u{1F4CB} **Sales Orders** - Process and track orders\n\u{1F4CA} **Reports** - Generate business insights\n\nWhat would you like to learn more about?",
    suggestions: [
      "How to create an enquiry",
      "Quotation process guide",
      "Inventory management tips",
      "Customer setup help"
    ]
  };
}
function getPageSpecificHelp(page) {
  const helpMap = {
    "/enquiries": {
      response: "On the Enquiries page, you can:\n\n\u2022 View all customer enquiries\n\u2022 Create new enquiries\n\u2022 Filter by status, customer, or date\n\u2022 Convert enquiries to quotations\n\u2022 Track enquiry progress\n\nClick 'New Enquiry' to start or use the filters to find specific enquiries.",
      suggestions: [
        "Create new enquiry",
        "Filter enquiries",
        "Convert to quotation",
        "Update enquiry status"
      ]
    },
    "/quotations": {
      response: "On the Quotations page, you can:\n\n\u2022 View all quotations\n\u2022 Create new quotes from enquiries\n\u2022 Send quotations to customers\n\u2022 Track approval status\n\u2022 Convert accepted quotes to sales orders\n\nUse 'New Quotation' to start or click on existing quotes to edit.",
      suggestions: [
        "Create new quotation",
        "Send to customer",
        "Check approval status",
        "Convert to sales order"
      ]
    },
    "/inventory": {
      response: "On the Inventory page, you can:\n\n\u2022 View all inventory items\n\u2022 Check stock levels\n\u2022 Add new items\n\u2022 Update quantities\n\u2022 Manage item categories\n\nUse the search and filters to find specific items quickly.",
      suggestions: [
        "Add new item",
        "Update stock levels",
        "Search items",
        "Set categories"
      ]
    }
  };
  return helpMap[page];
}
function getContextualSuggestions(page) {
  const suggestionMap = {
    "/dashboard": [
      "Show me today's summary",
      "Recent enquiries",
      "Pending quotations",
      "Low stock alerts"
    ],
    "/enquiries": [
      "Create new enquiry",
      "Show recent enquiries",
      "Filter by customer",
      "Convert to quotation"
    ],
    "/quotations": [
      "Create new quotation",
      "Pending approvals",
      "Send quotation",
      "Pricing help"
    ],
    "/inventory": [
      "Check stock levels",
      "Add new item",
      "Low stock report",
      "Update quantities"
    ],
    "/customers": [
      "Add new customer",
      "Customer activity",
      "Payment terms",
      "Credit limits"
    ],
    "/sales-orders": [
      "Create sales order",
      "Order status",
      "Delivery tracking",
      "Generate invoice"
    ]
  };
  return suggestionMap[page] || [
    "How can I help?",
    "Show dashboard",
    "Recent activity",
    "System overview"
  ];
}
function containsKeywords(text4, keywords) {
  return keywords.some((keyword) => text4.includes(keyword));
}

// server/routes/ai.ts
function registerAIRoutes(app2) {
  app2.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context, pageContext } = req.body;
      const response = await generateAIResponse(message, context, pageContext);
      res.json(response);
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({
        error: "Failed to process AI request",
        response: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        suggestions: ["Try asking a different question", "Check your connection", "Contact support"]
      });
    }
  });
  app2.get("/api/ai/suggestions", async (req, res) => {
    try {
      const { page } = req.query;
      const suggestions = getContextualSuggestions(page);
      res.json(suggestions);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      res.status(500).json([]);
    }
  });
}

// server/routes/delivery.ts
init_storage();
init_schema();
import { z as z20 } from "zod";
function registerDeliveryRoutes(app2) {
  app2.get("/api/deliveries", async (req, res) => {
    try {
      const { customerId, status, dateFrom, dateTo, limit, offset } = req.query;
      const filters = {
        customerId,
        status,
        dateFrom,
        dateTo,
        limit: limit ? parseInt(limit) : void 0,
        offset: offset ? parseInt(offset) : void 0
      };
      const deliveries2 = await storage.getDeliveries(filters);
      res.json(deliveries2);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      res.status(500).json({ message: "Failed to fetch deliveries" });
    }
  });
  app2.get("/api/deliveries/:id", async (req, res) => {
    try {
      const delivery = await storage.getDelivery(req.params.id);
      if (!delivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
      res.json(delivery);
    } catch (error) {
      console.error("Error fetching delivery:", error);
      res.status(500).json({ message: "Failed to fetch delivery" });
    }
  });
  app2.post("/api/deliveries", async (req, res) => {
    try {
      const raw = { ...req.body };
      if (raw.deliveryDate && typeof raw.deliveryDate === "string") {
        const parsedDate = new Date(raw.deliveryDate);
        if (!isNaN(parsedDate.getTime())) raw.deliveryDate = parsedDate;
      }
      if (!raw.deliveryDate) raw.deliveryDate = /* @__PURE__ */ new Date();
      if (!raw.salesOrderId) {
        return res.status(400).json({ message: "Sales Order ID is required" });
      }
      if (raw.deliveryNumber === void 0) delete raw.deliveryNumber;
      const createDeliveryInputSchema = z20.object({
        salesOrderId: z20.string().uuid("Invalid sales order ID format"),
        deliveryAddress: z20.string().min(1).optional(),
        deliveryNotes: z20.string().optional(),
        deliveryDate: z20.date().optional(),
        deliveryType: z20.string().optional(),
        status: z20.string().optional()
        // allow callers to override if needed
      });
      const deliveryData = createDeliveryInputSchema.parse(raw);
      const delivery = await storage.createDelivery(deliveryData);
      res.status(201).json(delivery);
    } catch (error) {
      if (error instanceof z20.ZodError) {
        return res.status(400).json({ message: "Invalid delivery data", errors: error.errors });
      }
      console.error("Error creating delivery:", error);
      res.status(500).json({ message: "Failed to create delivery" });
    }
  });
  app2.put("/api/deliveries/:id", async (req, res) => {
    try {
      const deliveryData = insertDeliverySchema.partial().parse(req.body);
      const delivery = await storage.updateDelivery(req.params.id, deliveryData);
      res.json(delivery);
    } catch (error) {
      if (error instanceof z20.ZodError) {
        return res.status(400).json({ message: "Invalid delivery data", errors: error.errors });
      }
      console.error("Error updating delivery:", error);
      res.status(500).json({ message: "Failed to update delivery" });
    }
  });
  app2.delete("/api/deliveries/:id", async (req, res) => {
    try {
      await storage.deleteDelivery(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting delivery:", error);
      res.status(500).json({ message: "Failed to delete delivery" });
    }
  });
  app2.post("/api/deliveries/:deliveryId/items", async (req, res) => {
    try {
      const itemData = { ...req.body, deliveryId: req.params.deliveryId };
      const item = await storage.createDeliveryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating delivery item:", error);
      res.status(500).json({ message: "Failed to create delivery item" });
    }
  });
  app2.post("/api/deliveries/scan-item", async (req, res) => {
    try {
      const { barcode, sessionId, quantity, storageLocation } = req.body;
      const pickedItem = await storage.scanItemForPicking(barcode, sessionId, quantity, "system", storageLocation);
      res.json(pickedItem);
    } catch (error) {
      console.error("Error scanning item for picking:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to scan item" });
    }
  });
  app2.get("/api/deliveries/:id/available-items", async (req, res) => {
    try {
      const items3 = await storage.getAvailableItemsForPicking(req.params.id);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching available items for picking:", error);
      res.status(500).json({ message: "Failed to fetch available items" });
    }
  });
  app2.get("/api/deliveries/:deliveryId/items", async (req, res) => {
    try {
      const items3 = await storage.getDeliveryItems(req.params.deliveryId);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching delivery items:", error);
      res.status(500).json({ message: "Failed to fetch delivery items" });
    }
  });
  app2.get("/api/delivery-items/:id", async (req, res) => {
    try {
      const item = await storage.getDeliveryItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Delivery item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching delivery item:", error);
      res.status(500).json({ message: "Failed to fetch delivery item" });
    }
  });
  app2.post("/api/delivery-items", async (req, res) => {
    try {
      const itemData = insertDeliveryItemSchema.parse(req.body);
      const item = await storage.createDeliveryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z20.ZodError) {
        return res.status(400).json({ message: "Invalid delivery item data", errors: error.errors });
      }
      console.error("Error creating delivery item:", error);
      res.status(500).json({ message: "Failed to create delivery item" });
    }
  });
  app2.put("/api/delivery-items/:id", async (req, res) => {
    try {
      const itemData = insertDeliveryItemSchema.partial().parse(req.body);
      const item = await storage.updateDeliveryItem(req.params.id, itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z20.ZodError) {
        return res.status(400).json({ message: "Invalid delivery item data", errors: error.errors });
      }
      console.error("Error updating delivery item:", error);
      res.status(500).json({ message: "Failed to update delivery item" });
    }
  });
  app2.delete("/api/delivery-items/:id", async (req, res) => {
    try {
      await storage.deleteDeliveryItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting delivery item:", error);
      res.status(500).json({ message: "Failed to delete delivery item" });
    }
  });
  app2.post("/api/delivery-items/bulk", async (req, res) => {
    try {
      const itemsData = z20.array(insertDeliveryItemSchema).parse(req.body);
      const items3 = await storage.bulkCreateDeliveryItems(itemsData);
      res.status(201).json(items3);
    } catch (error) {
      if (error instanceof z20.ZodError) {
        return res.status(400).json({ message: "Invalid delivery items data", errors: error.errors });
      }
      console.error("Error bulk creating delivery items:", error);
      res.status(500).json({ message: "Failed to bulk create delivery items" });
    }
  });
  app2.post("/api/deliveries/:id/start-picking", async (req, res) => {
    try {
      const { userId } = req.body;
      const delivery = await storage.startDeliveryPicking(req.params.id, userId);
      res.json(delivery);
    } catch (error) {
      console.error("Error starting delivery picking:", error);
      res.status(500).json({ message: "Failed to start delivery picking" });
    }
  });
  app2.post("/api/deliveries/:id/complete-picking", async (req, res) => {
    try {
      const { userId, notes } = req.body;
      const delivery = await storage.completeDeliveryPicking(req.params.id, userId, notes);
      res.json(delivery);
    } catch (error) {
      console.error("Error completing delivery picking:", error);
      res.status(500).json({ message: "Failed to complete delivery picking" });
    }
  });
  app2.post("/api/deliveries/:id/confirm", async (req, res) => {
    try {
      const { confirmedBy, signature } = req.body;
      const delivery = await storage.confirmDelivery(req.params.id, confirmedBy, signature);
      res.json(delivery);
    } catch (error) {
      console.error("Error confirming delivery:", error);
      res.status(500).json({ message: "Failed to confirm delivery" });
    }
  });
  app2.get("/api/delivery-notes", async (req, res) => {
    try {
      const { customerId, status, dateFrom, dateTo, limit, offset, search, page, pageSize, salesOrderId } = req.query;
      let resolvedLimit = limit ? parseInt(limit, 10) : void 0;
      let resolvedOffset = offset ? parseInt(offset, 10) : void 0;
      if (pageSize) {
        const ps = parseInt(pageSize, 10);
        if (!isNaN(ps)) resolvedLimit = ps;
      }
      if (page) {
        const pg = parseInt(page, 10);
        if (!isNaN(pg) && resolvedLimit) {
          resolvedOffset = (pg - 1) * resolvedLimit;
        }
      }
      const filters = {
        status,
        salesOrderId,
        dateFrom,
        dateTo,
        limit: resolvedLimit,
        offset: resolvedOffset,
        search: search || void 0
      };
      const deliveries2 = await storage.getDeliveries(filters);
      res.json(deliveries2);
    } catch (error) {
      console.error("Error fetching delivery notes:", error);
      res.status(500).json({ message: "Failed to fetch delivery notes" });
    }
  });
  app2.get("/api/delivery-notes/:id", async (req, res) => {
    try {
      const delivery = await storage.getDelivery(req.params.id);
      if (!delivery) {
        return res.status(404).json({ message: "Delivery note not found" });
      }
      res.json(delivery);
    } catch (error) {
      console.error("Error fetching delivery note:", error);
      res.status(500).json({ message: "Failed to fetch delivery note" });
    }
  });
  app2.post("/api/delivery-notes", async (req, res) => {
    try {
      const raw = { ...req.body };
      if (raw.deliveryDate && typeof raw.deliveryDate === "string") {
        const parsedDate = new Date(raw.deliveryDate);
        if (!isNaN(parsedDate.getTime())) raw.deliveryDate = parsedDate;
      }
      if (!raw.deliveryDate) raw.deliveryDate = /* @__PURE__ */ new Date();
      const validated = insertDeliverySchema.parse(raw);
      const delivery = await storage.createDelivery(validated);
      res.json(delivery);
    } catch (error) {
      console.error("Error creating delivery note:", error);
      if (error instanceof z20.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create delivery note" });
    }
  });
  app2.patch("/api/delivery-notes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const raw = { ...req.body };
      if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Invalid delivery ID format" });
      }
      if (raw.deliveryDate && typeof raw.deliveryDate === "string") {
        const parsedDate = new Date(raw.deliveryDate);
        if (!isNaN(parsedDate.getTime())) {
          raw.deliveryDate = parsedDate;
        } else {
          delete raw.deliveryDate;
        }
      }
      const timestampFields = ["pickingStartedAt", "pickingCompletedAt", "deliveryConfirmedAt", "actualDeliveryDate", "estimatedDeliveryDate"];
      timestampFields.forEach((field) => {
        if (raw[field] && typeof raw[field] === "string") {
          const parsedDate = new Date(raw[field]);
          if (!isNaN(parsedDate.getTime())) {
            raw[field] = parsedDate;
          } else {
            delete raw[field];
          }
        }
      });
      console.log("PATCH /api/delivery-notes/:id", { id, body: raw });
      const delivery = await storage.updateDelivery(id, raw);
      res.json(delivery);
    } catch (error) {
      console.error("Error updating delivery note:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        message: "Failed to update delivery note",
        error: errorMessage,
        details: error instanceof Error ? error.stack : void 0
      });
    }
  });
  app2.delete("/api/delivery-notes/:id", async (req, res) => {
    try {
      await storage.deleteDelivery(req.params.id);
      res.json({ message: "Delivery note deleted successfully" });
    } catch (error) {
      console.error("Error deleting delivery note:", error);
      res.status(500).json({ message: "Failed to delete delivery note" });
    }
  });
}

// server/routes/shipment-tracking.ts
init_storage();
init_schema();
import { z as zod } from "zod";
function registerShipmentTrackingRoutes(app2) {
  app2.get("/api/shipments", async (req, res) => {
    try {
      const {
        status,
        priority,
        carrierId,
        serviceType,
        search,
        dateFrom,
        dateTo,
        limit,
        offset
      } = req.query;
      const filters = {
        status,
        priority,
        carrierId,
        serviceType,
        search,
        dateFrom,
        dateTo,
        limit: limit ? parseInt(limit) : void 0,
        offset: offset ? parseInt(offset) : void 0
      };
      const shipments2 = await storage.getShipments(filters);
      res.json(shipments2);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      res.status(500).json({ message: "Failed to fetch shipments" });
    }
  });
  app2.get("/api/shipments/:id", async (req, res) => {
    try {
      const shipment = await storage.getShipment(req.params.id);
      if (!shipment) return res.status(404).json({ message: "Shipment not found" });
      res.json(shipment);
    } catch (error) {
      console.error("Error fetching shipment:", error);
      res.status(500).json({ message: "Failed to fetch shipment" });
    }
  });
  app2.get("/api/shipments/tracking/:trackingNumber", async (req, res) => {
    try {
      const shipment = await storage.getShipmentByTrackingNumber(req.params.trackingNumber);
      if (!shipment) return res.status(404).json({ message: "Shipment not found" });
      res.json(shipment);
    } catch (error) {
      console.error("Error fetching shipment by tracking number:", error);
      res.status(500).json({ message: "Failed to fetch shipment" });
    }
  });
  app2.post("/api/shipments", async (req, res) => {
    try {
      const data = { ...req.body };
      data.status ||= "Pending";
      data.serviceType ||= "Standard";
      data.priority ||= "Medium";
      ["estimatedDelivery", "actualDelivery", "lastUpdate"].forEach((f) => {
        if (typeof data[f] === "string") {
          const s = data[f].trim();
          if (!s) data[f] = void 0;
          else {
            const d = new Date(s);
            if (!isNaN(d.getTime())) data[f] = d;
            else data[f] = void 0;
          }
        }
      });
      if (!data.carrierName && data.carrierId) {
        try {
          const c = await storage.getSupplier(data.carrierId);
          if (c?.name) data.carrierName = c.name;
        } catch {
        }
      }
      const relaxed = insertShipmentSchema.partial({ shipmentNumber: true, trackingNumber: true, carrierName: true }).extend({
        estimatedDelivery: zod.date().optional().nullable(),
        actualDelivery: zod.date().optional().nullable(),
        lastUpdate: zod.date().optional().nullable(),
        carrierName: zod.string().optional()
      });
      ["estimatedDelivery", "actualDelivery", "lastUpdate"].forEach((f) => {
        if (typeof data[f] === "string") {
          const d = new Date(data[f]);
          if (!isNaN(d.getTime())) data[f] = d;
          else delete data[f];
        }
      });
      const parsed = relaxed.safeParse(data);
      if (!parsed.success) {
        const msgs = parsed.error.errors.map((e) => `${e.path.join(".") || "field"}: ${e.message}`);
        return res.status(400).json({ message: msgs.join(" | "), debugErrors: parsed.error.errors, received: data });
      }
      if (!data.origin || !data.origin.trim()) return res.status(400).json({ message: "origin: Required", received: data });
      if (!data.destination || !data.destination.trim()) return res.status(400).json({ message: "destination: Required", received: data });
      if (!data.carrierId) return res.status(400).json({ message: "carrierId: Required", received: data });
      const shipment = await storage.createShipment(parsed.data);
      return res.status(201).json(shipment);
    } catch (err) {
      console.error("Error creating shipment (final handler):", err);
      return res.status(500).json({ message: err?.message || "Failed to create shipment" });
    }
  });
  app2.put("/api/shipments/:id", async (req, res) => {
    try {
      const shipmentData = req.body;
      const shipment = await storage.updateShipment(req.params.id, shipmentData);
      res.json(shipment);
    } catch (error) {
      console.error("Error updating shipment:", error);
      if (error instanceof Error && error.message === "Shipment not found") {
        return res.status(404).json({ message: "Shipment not found" });
      }
      res.status(500).json({ message: "Failed to update shipment" });
    }
  });
  app2.delete("/api/shipments/:id", async (req, res) => {
    try {
      await storage.deleteShipment(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting shipment:", error);
      if (error instanceof Error && error.message === "Shipment not found") {
        return res.status(404).json({ message: "Shipment not found" });
      }
      res.status(500).json({ message: "Failed to delete shipment" });
    }
  });
  app2.patch("/api/shipments/:id/status", async (req, res) => {
    try {
      const { status, location } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const shipment = await storage.updateShipmentStatus(req.params.id, status, location);
      res.json(shipment);
    } catch (error) {
      console.error("Error updating shipment status:", error);
      if (error instanceof Error && error.message === "Shipment not found") {
        return res.status(404).json({ message: "Shipment not found" });
      }
      res.status(500).json({ message: "Failed to update shipment status" });
    }
  });
  app2.get("/api/shipments/:id/tracking", async (req, res) => {
    try {
      const events = await storage.getShipmentTrackingEvents(req.params.id);
      res.json(events);
    } catch (error) {
      console.error("Error fetching tracking events:", error);
      res.status(500).json({ message: "Failed to fetch tracking events" });
    }
  });
  app2.post("/api/shipments/:id/tracking", async (req, res) => {
    try {
      const eventData = {
        ...req.body,
        shipmentId: req.params.id
      };
      if (!eventData.location) {
        return res.status(400).json({ message: "Location is required" });
      }
      if (!eventData.status) {
        return res.status(400).json({ message: "Status is required" });
      }
      if (!eventData.description) {
        return res.status(400).json({ message: "Description is required" });
      }
      if (!eventData.scanType) {
        return res.status(400).json({ message: "Scan type is required" });
      }
      const event = await storage.createTrackingEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating tracking event:", error);
      res.status(500).json({ message: "Failed to create tracking event" });
    }
  });
  app2.get("/api/shipments/:id/tracking/latest", async (req, res) => {
    try {
      const event = await storage.getLatestTrackingEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "No tracking events found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching latest tracking event:", error);
      res.status(500).json({ message: "Failed to fetch latest tracking event" });
    }
  });
  app2.get("/api/shipments/analytics/summary", async (req, res) => {
    try {
      const analytics = await storage.getShipmentAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching shipment analytics:", error);
      res.status(500).json({ message: "Failed to fetch shipment analytics" });
    }
  });
  app2.get("/api/track/:trackingNumber", async (req, res) => {
    try {
      const shipment = await storage.getShipmentByTrackingNumber(req.params.trackingNumber);
      if (!shipment) {
        return res.status(404).json({ message: "Tracking number not found" });
      }
      const events = await storage.getShipmentTrackingEvents(shipment.id);
      const publicTrackingData = {
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        origin: shipment.origin,
        destination: shipment.destination,
        estimatedDelivery: shipment.estimatedDelivery,
        actualDelivery: shipment.actualDelivery,
        currentLocation: shipment.currentLocation,
        lastUpdate: shipment.lastUpdate,
        events: events.map((event) => ({
          timestamp: event.timestamp,
          location: event.location,
          status: event.status,
          description: event.description,
          scanType: event.scanType
        }))
      };
      res.json(publicTrackingData);
    } catch (error) {
      console.error("Error in public tracking:", error);
      res.status(500).json({ message: "Failed to fetch tracking information" });
    }
  });
  app2.get("/api/carriers", async (req, res) => {
    try {
      const suppliers5 = await storage.getSuppliers();
      const carriers = suppliers5.map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        isActive: supplier.isActive
      }));
      res.json(carriers);
    } catch (error) {
      console.error("Error fetching carriers:", error);
      res.status(500).json({ message: "Failed to fetch carriers" });
    }
  });
}

// server/routes/invoice.ts
init_storage();
init_schema();
import { z as z21 } from "zod";
function registerInvoiceRoutes(app2) {
  console.log("[INVOICE ROUTES] Registering invoice routes...");
  app2.get("/api/invoices/health", (req, res) => {
    res.json({
      status: "ok",
      message: "Invoice routes are loaded",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app2.get("/api/invoices/test", async (req, res) => {
    try {
      console.log("[TEST] Testing database connection...");
      const testQuery = await storage.getInvoices({ limit: 1 });
      console.log("[TEST] Database connection successful");
      res.json({
        status: "success",
        message: "Database connection working",
        invoiceCount: Array.isArray(testQuery) ? testQuery.length : 0
      });
    } catch (error) {
      console.error("[TEST] Database connection failed:", error);
      res.status(500).json({
        status: "error",
        message: "Database connection failed",
        error: error.message
      });
    }
  });
  app2.get("/api/invoices/diagnose/:deliveryId", async (req, res) => {
    try {
      const { deliveryId } = req.params;
      console.log(`[DIAGNOSE] Checking delivery: ${deliveryId}`);
      const delivery = await storage.getDelivery(deliveryId);
      if (!delivery) {
        return res.status(404).json({
          status: "error",
          message: "Delivery not found",
          deliveryId
        });
      }
      console.log(`[DIAGNOSE] Delivery found:`, {
        id: delivery.id,
        deliveryNumber: delivery.deliveryNumber,
        status: delivery.status,
        salesOrderId: delivery.salesOrderId
      });
      let salesOrder = null;
      if (delivery.salesOrderId) {
        salesOrder = await storage.getSalesOrder(delivery.salesOrderId);
        console.log(`[DIAGNOSE] Sales order found:`, {
          id: salesOrder?.id,
          orderNumber: salesOrder?.orderNumber,
          customerId: salesOrder?.customerId
        });
      }
      const deliveryItems2 = await storage.getDeliveryItems(deliveryId);
      console.log(`[DIAGNOSE] Delivery items:`, deliveryItems2.length);
      res.json({
        status: "success",
        delivery: {
          id: delivery.id,
          deliveryNumber: delivery.deliveryNumber,
          status: delivery.status,
          salesOrderId: delivery.salesOrderId
        },
        salesOrder: salesOrder ? {
          id: salesOrder.id,
          orderNumber: salesOrder.orderNumber,
          customerId: salesOrder.customerId
        } : null,
        deliveryItemsCount: deliveryItems2.length,
        canGenerateInvoice: delivery.status === "Complete" && delivery.salesOrderId && salesOrder?.customerId
      });
    } catch (error) {
      console.error("[DIAGNOSE] Error:", error);
      res.status(500).json({
        status: "error",
        message: "Diagnostic failed",
        error: error.message
      });
    }
  });
  app2.get("/api/invoices", async (req, res) => {
    try {
      const { customerId, status, dateFrom, dateTo, limit, offset } = req.query;
      const filters = {
        customerId,
        status,
        dateFrom,
        dateTo,
        limit: limit ? parseInt(limit) : void 0,
        offset: offset ? parseInt(offset) : void 0
      };
      const invoices4 = await storage.getInvoices(filters);
      res.json(invoices4);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });
  app2.get("/api/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });
  app2.get("/api/invoices/by-number/:invoiceNumber", async (req, res) => {
    try {
      const invoice = await storage.getInvoiceByNumber(req.params.invoiceNumber);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      console.error("Error fetching invoice by number:", error);
      res.status(500).json({ message: "Failed to fetch invoice by number" });
    }
  });
  app2.post("/api/invoices", async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(invoiceData);
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z21.ZodError) {
        return res.status(400).json({ message: "Invalid invoice data", errors: error.errors });
      }
      console.error("Error creating invoice:", error);
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });
  app2.put("/api/invoices/:id", async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.partial().parse(req.body);
      const invoice = await storage.updateInvoice(req.params.id, invoiceData);
      res.json(invoice);
    } catch (error) {
      if (error instanceof z21.ZodError) {
        return res.status(400).json({ message: "Invalid invoice data", errors: error.errors });
      }
      console.error("Error updating invoice:", error);
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });
  app2.delete("/api/invoices/:id", async (req, res) => {
    try {
      await storage.deleteInvoice(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });
  app2.get("/api/invoices/:invoiceId/items", async (req, res) => {
    try {
      const items3 = await storage.getInvoiceItems(req.params.invoiceId);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching invoice items:", error);
      res.status(500).json({ message: "Failed to fetch invoice items" });
    }
  });
  app2.get("/api/invoice-items/:id", async (req, res) => {
    try {
      const item = await storage.getInvoiceItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Invoice item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching invoice item:", error);
      res.status(500).json({ message: "Failed to fetch invoice item" });
    }
  });
  app2.post("/api/invoice-items", async (req, res) => {
    try {
      const itemData = insertInvoiceItemSchema.parse(req.body);
      const item = await storage.createInvoiceItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z21.ZodError) {
        return res.status(400).json({ message: "Invalid invoice item data", errors: error.errors });
      }
      console.error("Error creating invoice item:", error);
      res.status(500).json({ message: "Failed to create invoice item" });
    }
  });
  app2.put("/api/invoice-items/:id", async (req, res) => {
    try {
      const itemData = insertInvoiceItemSchema.partial().parse(req.body);
      const item = await storage.updateInvoiceItem(req.params.id, itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z21.ZodError) {
        return res.status(400).json({ message: "Invalid invoice item data", errors: error.errors });
      }
      console.error("Error updating invoice item:", error);
      res.status(500).json({ message: "Failed to update invoice item" });
    }
  });
  app2.delete("/api/invoice-items/:id", async (req, res) => {
    try {
      await storage.deleteInvoiceItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting invoice item:", error);
      res.status(500).json({ message: "Failed to delete invoice item" });
    }
  });
  app2.post("/api/invoice-items/bulk", async (req, res) => {
    try {
      const itemsData = z21.array(insertInvoiceItemSchema).parse(req.body);
      const items3 = await storage.bulkCreateInvoiceItems(itemsData);
      res.status(201).json(items3);
    } catch (error) {
      if (error instanceof z21.ZodError) {
        return res.status(400).json({ message: "Invalid invoice items data", errors: error.errors });
      }
      console.error("Error bulk creating invoice items:", error);
      res.status(500).json({ message: "Failed to bulk create invoice items" });
    }
  });
  app2.post("/api/invoices/:id/send", async (req, res) => {
    try {
      const { email } = req.body;
      const result = await storage.sendInvoice(req.params.id, email);
      res.json(result);
    } catch (error) {
      console.error("Error sending invoice:", error);
      res.status(500).json({ message: "Failed to send invoice" });
    }
  });
  app2.post("/api/invoices/:id/mark-paid", async (req, res) => {
    try {
      const { paidAmount, paymentMethod, paymentReference, userId } = req.body;
      const invoice = await storage.markInvoicePaid(req.params.id, paidAmount, paymentMethod, paymentReference, userId);
      res.json(invoice);
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      res.status(500).json({ message: "Failed to mark invoice as paid" });
    }
  });
  app2.post("/api/invoices/:id/cancel", async (req, res) => {
    try {
      const { reason } = req.body;
      const invoice = await storage.updateInvoice(req.params.id, { status: "Cancelled", notes: reason });
      res.json(invoice);
    } catch (error) {
      console.error("Error cancelling invoice:", error);
      res.status(500).json({ message: "Failed to cancel invoice" });
    }
  });
  app2.post("/api/invoices/generate-from-delivery", async (req, res) => {
    try {
      console.log(`[ROUTE] Invoice generation request received:`, req.body);
      const { deliveryId, invoiceType, userId } = req.body;
      if (!deliveryId) {
        console.log(`[ROUTE] ERROR: No delivery ID provided`);
        return res.status(400).json({ message: "Delivery ID is required" });
      }
      console.log(`[ROUTE] Calling storage.generateInvoiceFromDelivery with:`, { deliveryId, invoiceType, userId });
      try {
        console.log(`[ROUTE] Testing storage access...`);
        const testInvoices = await storage.getInvoices({ limit: 1 });
        console.log(`[ROUTE] Storage test successful, found ${Array.isArray(testInvoices) ? testInvoices.length : 0} invoices`);
      } catch (storageError) {
        console.error(`[ROUTE] Storage test failed:`, storageError);
        throw new Error(`Storage access failed: ${storageError.message}`);
      }
      const invoice = await storage.generateInvoiceFromDelivery(deliveryId, invoiceType, userId);
      console.log(`[ROUTE] Invoice generation successful:`, invoice?.id);
      res.status(201).json(invoice);
    } catch (error) {
      console.error("Error generating invoice from delivery:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code
      });
      res.status(500).json({
        message: "Failed to generate invoice from delivery",
        error: error.message,
        details: error.stack
      });
    }
  });
  app2.post("/api/invoices/generate-proforma", async (req, res) => {
    try {
      const { salesOrderId, userId } = req.body;
      const invoice = await storage.generateProformaInvoice(salesOrderId, userId);
      res.status(201).json(invoice);
    } catch (error) {
      console.error("Error generating proforma invoice:", error);
      res.status(500).json({ message: "Failed to generate proforma invoice" });
    }
  });
  app2.put("/api/invoices/:id/currency", async (req, res) => {
    try {
      const { newCurrency, exchangeRate, userId } = req.body;
      const invoice = await storage.updateInvoiceCurrency(req.params.id, newCurrency, exchangeRate, userId);
      res.json(invoice);
    } catch (error) {
      console.error("Error updating invoice currency:", error);
      res.status(500).json({ message: "Failed to update invoice currency" });
    }
  });
  app2.post("/api/invoices/:invoiceId/items", async (req, res) => {
    try {
      const itemData = { ...req.body, invoiceId: req.params.invoiceId };
      const item = await storage.createInvoiceItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating invoice item:", error);
      res.status(500).json({ message: "Failed to create invoice item" });
    }
  });
  app2.get("/api/invoices/:id/pdf", async (req, res) => {
    try {
      const invoiceId = req.params.id;
      const invoice = await storage.getInvoice(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      const invoiceItems3 = await storage.getInvoiceItems(invoiceId);
      const enhancedItems = await Promise.all(
        invoiceItems3.map(async (invoiceItem) => {
          let itemDetails = null;
          if (invoiceItem.itemId) {
            try {
              itemDetails = await storage.getItem(invoiceItem.itemId);
            } catch (error) {
              console.warn(`Could not fetch item details for ${invoiceItem.itemId}:`, error);
            }
          }
          return {
            ...invoiceItem,
            item: itemDetails
          };
        })
      );
      const customer = await storage.getCustomer(invoice.customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      let salesOrder = null;
      let delivery = null;
      try {
        if (invoice.salesOrderId) {
          salesOrder = await storage.getSalesOrder(invoice.salesOrderId);
        }
        if (invoice.deliveryId) {
          delivery = await storage.getDelivery(invoice.deliveryId);
        }
      } catch (error) {
        console.warn("Could not fetch related order/delivery data:", error);
      }
      const result = generateInvoicePdf({
        invoice,
        items: enhancedItems,
        customer,
        related: { salesOrder, delivery },
        mode: "enhanced"
      });
      sendPdf(res, result);
    } catch (error) {
      console.error("Error generating comprehensive invoice PDF:", error);
      res.status(500).json({
        message: "Failed to generate invoice PDF",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}

// server/routes/credit-notes.ts
init_storage();
init_schema();
import { z as z22 } from "zod";
function registerCreditNoteRoutes(app2) {
  app2.get("/api/credit-notes", async (req, res) => {
    try {
      const { customerId, status, dateFrom, dateTo, limit, offset } = req.query;
      const filters = {
        customerId,
        status,
        dateFrom,
        dateTo,
        limit: limit ? parseInt(limit) : void 0,
        offset: offset ? parseInt(offset) : void 0
      };
      const creditNotes2 = await storage.getCreditNotes(filters);
      res.json(creditNotes2);
    } catch (error) {
      console.error("Error fetching credit notes:", error);
      res.status(500).json({ message: "Failed to fetch credit notes" });
    }
  });
  app2.get("/api/credit-notes/:id", async (req, res) => {
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
  app2.post("/api/credit-notes", async (req, res) => {
    try {
      const creditNoteData = insertCreditNoteSchema.parse(req.body);
      const creditNote = await storage.createCreditNote(creditNoteData);
      res.status(201).json(creditNote);
    } catch (error) {
      if (error instanceof z22.ZodError) {
        return res.status(400).json({ message: "Invalid credit note data", errors: error.errors });
      }
      console.error("Error creating credit note:", error);
      res.status(500).json({ message: "Failed to create credit note" });
    }
  });
  app2.put("/api/credit-notes/:id", async (req, res) => {
    try {
      const creditNoteData = insertCreditNoteSchema.partial().parse(req.body);
      const creditNote = await storage.updateCreditNote(req.params.id, creditNoteData);
      res.json(creditNote);
    } catch (error) {
      if (error instanceof z22.ZodError) {
        return res.status(400).json({ message: "Invalid credit note data", errors: error.errors });
      }
      console.error("Error updating credit note:", error);
      res.status(500).json({ message: "Failed to update credit note" });
    }
  });
  app2.delete("/api/credit-notes/:id", async (req, res) => {
    try {
      await storage.deleteCreditNote(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting credit note:", error);
      res.status(500).json({ message: "Failed to delete credit note" });
    }
  });
  app2.get("/api/credit-notes/:creditNoteId/items", async (req, res) => {
    try {
      const items3 = await storage.getCreditNoteItems(req.params.creditNoteId);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching credit note items:", error);
      res.status(500).json({ message: "Failed to fetch credit note items" });
    }
  });
  app2.post("/api/credit-note-items", async (req, res) => {
    try {
      const itemData = insertCreditNoteItemSchema.parse(req.body);
      const item = await storage.createCreditNoteItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z22.ZodError) {
        return res.status(400).json({ message: "Invalid credit note item data", errors: error.errors });
      }
      console.error("Error creating credit note item:", error);
      res.status(500).json({ message: "Failed to create credit note item" });
    }
  });
  app2.post("/api/credit-note-items/bulk", async (req, res) => {
    try {
      const itemsData = z22.array(insertCreditNoteItemSchema).parse(req.body);
      const items3 = await storage.bulkCreateCreditNoteItems(itemsData);
      res.status(201).json(items3);
    } catch (error) {
      if (error instanceof z22.ZodError) {
        return res.status(400).json({ message: "Invalid credit note items data", errors: error.errors });
      }
      console.error("Error bulk creating credit note items:", error);
      res.status(500).json({ message: "Failed to bulk create credit note items" });
    }
  });
  app2.post("/api/credit-notes/generate-from-return", async (req, res) => {
    try {
      const { invoiceId, returnItems, reason, userId } = req.body;
      const creditNote = await storage.generateCreditNoteFromReturn(invoiceId, returnItems, reason, userId);
      res.status(201).json(creditNote);
    } catch (error) {
      console.error("Error generating credit note from return:", error);
      res.status(500).json({ message: "Failed to generate credit note from return" });
    }
  });
  app2.post("/api/credit-notes/:id/apply", async (req, res) => {
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

// server/routes/goods-receipt.ts
init_storage();
init_schema();
import { z as z23 } from "zod";
function registerGoodsReceiptRoutes(app2) {
  app2.post("/api/goods-receipts", async (req, res) => {
    try {
      const { header, items: items3 } = req.body;
      const headerData = insertGoodsReceiptHeaderSchema.parse(header);
      const itemsData = z23.array(insertGoodsReceiptItemSchema).parse(items3);
      const createdHeader = await storage.createGoodsReceiptHeader(headerData);
      const itemsWithHeaderId = itemsData.map((item) => ({ ...item, goodsReceiptId: createdHeader.id }));
      const createdItems = await storage.bulkCreateGoodsReceiptItems(itemsWithHeaderId);
      for (const item of createdItems) {
        const qtyMoved = item.quantityReceived || item.quantityExpected || 0;
        if (qtyMoved > 0 && item.itemId) {
          await receiveStock({
            itemId: item.itemId,
            quantity: qtyMoved,
            referenceType: "GoodsReceipt",
            referenceId: createdHeader.id,
            location: "MAIN",
            reason: "Goods receipt",
            createdBy: header?.receivedBy || "system"
          });
        }
      }
      res.status(201).json({ header: createdHeader, items: createdItems });
    } catch (error) {
      if (error instanceof z23.ZodError) {
        return res.status(400).json({ message: "Invalid goods receipt data", errors: error.errors });
      }
      console.error("Error creating goods receipt:", error);
      res.status(500).json({ message: "Failed to create goods receipt" });
    }
  });
  app2.get("/api/goods-receipt-headers", async (req, res) => {
    try {
      const { supplierId, status, dateFrom, dateTo, limit, offset } = req.query;
      const filters = {
        supplierId,
        status,
        dateFrom,
        dateTo,
        limit: limit ? parseInt(limit) : void 0,
        offset: offset ? parseInt(offset) : void 0
      };
      const headers = await storage.getGoodsReceiptHeaders(filters);
      res.json(headers);
    } catch (error) {
      console.error("Error fetching goods receipt headers:", error);
      res.status(500).json({ message: "Failed to fetch goods receipt headers" });
    }
  });
  app2.get("/api/goods-receipt-headers/:id", async (req, res) => {
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
  app2.patch("/api/goods-receipt-headers/:id/approve", async (req, res) => {
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
  app2.patch("/api/goods-receipt-headers/:id/status", async (req, res) => {
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
  app2.patch("/api/goods-receipt-headers/:id", async (req, res) => {
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
  app2.post("/api/goods-receipt-headers", async (req, res) => {
    try {
      console.log("[GR HEADER][RAW BODY]", req.body);
      const startTs = Date.now();
      try {
        if (!req.body?.supplierId) {
          return res.status(400).json({ message: "supplierId is required" });
        }
        const supplier = await storage.getSupplier(req.body.supplierId);
        if (!supplier) {
          return res.status(400).json({ message: `supplierId ${req.body.supplierId} does not exist` });
        }
        if (req.body.supplierLpoId) {
          try {
            const lpo = await storage.getSupplierLpo(req.body.supplierLpoId);
            if (lpo && lpo.supplierId && lpo.supplierId !== req.body.supplierId) {
              console.warn("[GR HEADER][SUPPLIER MISMATCH]", { headerSupplierId: req.body.supplierId, lpoSupplierId: lpo.supplierId });
            }
          } catch (e) {
            console.warn("[GR HEADER][LPO LOOKUP FAILED]", req.body.supplierLpoId, e);
          }
        }
        const headerData = insertGoodsReceiptHeaderSchema.parse(req.body);
        console.log("[GR HEADER][PARSED]", headerData);
        const header = await storage.createGoodsReceiptHeader(headerData);
        console.log("[GR HEADER][CREATED]", { id: header.id, supplierId: header.supplierId, status: header.status, processingMs: Date.now() - startTs });
        return res.status(201).json(header);
      } catch (zerr) {
        if (zerr instanceof z23.ZodError) {
          console.error("[GR HEADER][VALIDATION ERROR]", JSON.stringify(zerr.errors, null, 2));
          return res.status(400).json({ message: "Invalid goods receipt header data", errors: zerr.errors, raw: req.body });
        }
        console.error("[GR HEADER][UNEXPECTED ERROR BEFORE RESPONSE]", zerr);
        return res.status(500).json({ message: "Failed to create goods receipt header", detail: zerr?.message });
      }
    } catch (error) {
      if (error instanceof z23.ZodError) {
        return res.status(400).json({ message: "Invalid goods receipt header data", errors: error.errors });
      }
      console.error("[GR HEADER][FINAL CATCH] Error creating goods receipt header:", error);
      res.status(500).json({ message: "Failed to create goods receipt header" });
    }
  });
  app2.put("/api/goods-receipt-headers/:id", async (req, res) => {
    try {
      const headerData = insertGoodsReceiptHeaderSchema.partial().parse(req.body);
      const header = await storage.updateGoodsReceiptHeader(req.params.id, headerData);
      res.json(header);
    } catch (error) {
      if (error instanceof z23.ZodError) {
        return res.status(400).json({ message: "Invalid goods receipt header data", errors: error.errors });
      }
      console.error("Error updating goods receipt header:", error);
      res.status(500).json({ message: "Failed to update goods receipt header" });
    }
  });
  app2.get("/api/goods-receipt-headers/:goodsReceiptId/items", async (req, res) => {
    try {
      const items3 = await storage.getGoodsReceiptItems(req.params.goodsReceiptId);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching goods receipt items:", error);
      res.status(500).json({ message: "Failed to fetch goods receipt items" });
    }
  });
  app2.post("/api/goods-receipt-items", async (req, res) => {
    try {
      const itemData = insertGoodsReceiptItemSchema.parse(req.body);
      const item = await storage.createGoodsReceiptItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z23.ZodError) {
        return res.status(400).json({ message: "Invalid goods receipt item data", errors: error.errors });
      }
      const devErr = error;
      const dbInfo = devErr?.db ? { db: devErr.db } : {};
      console.error("Error creating goods receipt item:", { message: devErr?.message, stack: devErr?.stack, ...dbInfo });
      res.status(500).json({ message: "Failed to create goods receipt item", devError: devErr?.message, ...dbInfo });
    }
  });
  app2.put("/api/goods-receipt-items/:id", async (req, res) => {
    try {
      const itemData = insertGoodsReceiptItemSchema.partial().parse(req.body);
      const item = await storage.updateGoodsReceiptItem(req.params.id, itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z23.ZodError) {
        return res.status(400).json({ message: "Invalid goods receipt item data", errors: error.errors });
      }
      console.error("Error updating goods receipt item:", error);
      res.status(500).json({ message: "Failed to update goods receipt item" });
    }
  });
  app2.post("/api/goods-receipt-items/bulk", async (req, res) => {
    try {
      const itemsData = z23.array(insertGoodsReceiptItemSchema).parse(req.body);
      const items3 = await storage.bulkCreateGoodsReceiptItems(itemsData);
      res.status(201).json(items3);
    } catch (error) {
      if (error instanceof z23.ZodError) {
        return res.status(400).json({ message: "Invalid goods receipt items data", errors: error.errors });
      }
      console.error("Error bulk creating goods receipt items:", error);
      res.status(500).json({ message: "Failed to bulk create goods receipt items" });
    }
  });
  app2.get("/api/scanning-sessions", async (req, res) => {
    try {
      const { goodsReceiptId, status, limit, offset } = req.query;
      const filters = {
        goodsReceiptId,
        status,
        limit: limit ? parseInt(limit) : void 0,
        offset: offset ? parseInt(offset) : void 0
      };
      const sessions = await storage.getScanningSessions(filters);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching scanning sessions:", error);
      res.status(500).json({ message: "Failed to fetch scanning sessions" });
    }
  });
  app2.post("/api/scanning-sessions", async (req, res) => {
    try {
      const sessionData = insertScanningSessionSchema.parse(req.body);
      const session2 = await storage.createScanningSession(sessionData);
      res.status(201).json(session2);
    } catch (error) {
      if (error instanceof z23.ZodError) {
        return res.status(400).json({ message: "Invalid scanning session data", errors: error.errors });
      }
      console.error("Error creating scanning session:", error);
      res.status(500).json({ message: "Failed to create scanning session" });
    }
  });
  app2.put("/api/scanning-sessions/:id", async (req, res) => {
    try {
      const sessionData = insertScanningSessionSchema.partial().parse(req.body);
      const session2 = await storage.updateScanningSession(req.params.id, sessionData);
      res.json(session2);
    } catch (error) {
      if (error instanceof z23.ZodError) {
        return res.status(400).json({ message: "Invalid scanning session data", errors: error.errors });
      }
      console.error("Error updating scanning session:", error);
      res.status(500).json({ message: "Failed to update scanning session" });
    }
  });
  app2.get("/api/scanning-sessions/:sessionId/items", async (req, res) => {
    try {
      const items3 = await storage.getScannedItems(req.params.sessionId);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching scanned items:", error);
      res.status(500).json({ message: "Failed to fetch scanned items" });
    }
  });
  app2.post("/api/scanned-items", async (req, res) => {
    try {
      const itemData = insertScannedItemSchema.parse(req.body);
      const item = await storage.createScannedItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z23.ZodError) {
        return res.status(400).json({ message: "Invalid scanned item data", errors: error.errors });
      }
      console.error("Error creating scanned item:", error);
      res.status(500).json({ message: "Failed to create scanned item" });
    }
  });
  app2.post("/api/scanned-items/bulk", async (req, res) => {
    try {
      const itemsData = z23.array(insertScannedItemSchema).parse(req.body);
      const items3 = await storage.bulkCreateScannedItems(itemsData);
      res.status(201).json(items3);
    } catch (error) {
      if (error instanceof z23.ZodError) {
        return res.status(400).json({ message: "Invalid scanned items data", errors: error.errors });
      }
      console.error("Error bulk creating scanned items:", error);
      res.status(500).json({ message: "Failed to bulk create scanned items" });
    }
  });
  app2.post("/api/scanning-sessions/:id/finalize", async (req, res) => {
    try {
      const sessionId = req.params.id;
      const session2 = await storage.getScanningSession(sessionId);
      if (!session2) return res.status(404).json({ message: "Scanning session not found" });
      if (session2.status === "Completed") {
        return res.status(200).json({ message: "Already finalized", session: session2 });
      }
      const scanned = await storage.getScannedItems(sessionId);
      const grouped = /* @__PURE__ */ new Map();
      for (const s of scanned) {
        const invId = s.inventoryItemId;
        const qty = s.quantityScanned;
        if (!invId || !qty) continue;
        grouped.set(invId, (grouped.get(invId) || 0) + qty);
      }
      const movements = [];
      for (const [itemId, qty] of Array.from(grouped.entries())) {
        if (qty > 0) {
          try {
            const mv = await receiveStock({
              itemId,
              quantity: qty,
              referenceType: "ScanFinalize",
              referenceId: sessionId,
              location: "MAIN",
              reason: "Scanning session finalization"
            });
            movements.push(mv);
          } catch (e) {
            console.error("[ScanningSession][Finalize] Movement error", { itemId, qty, error: e?.message });
          }
        }
      }
      const updated = await storage.updateScanningSession(sessionId, { status: "Completed" });
      res.json({ session: updated, movements });
    } catch (error) {
      console.error("[ScanningSession][Finalize] Error", error);
      res.status(500).json({ message: "Failed to finalize scanning session" });
    }
  });
  app2.get("/api/supplier-returns", async (req, res) => {
    try {
      const { supplierId, status, dateFrom, dateTo, limit, offset } = req.query;
      const filters = {
        supplierId,
        status,
        dateFrom,
        dateTo,
        limit: limit ? parseInt(limit) : void 0,
        offset: offset ? parseInt(offset) : void 0
      };
      const returns = await storage.getSupplierReturns(filters);
      res.json(returns);
    } catch (error) {
      console.error("Error fetching supplier returns:", error);
      res.status(500).json({ message: "Failed to fetch supplier returns" });
    }
  });
  app2.get("/api/supplier-returns/:id", async (req, res) => {
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
  app2.post("/api/supplier-returns", async (req, res) => {
    try {
      const returnData = insertSupplierReturnSchema.parse(req.body);
      const returnRecord = await storage.createSupplierReturn(returnData);
      res.status(201).json(returnRecord);
    } catch (error) {
      if (error instanceof z23.ZodError) {
        return res.status(400).json({ message: "Invalid supplier return data", errors: error.errors });
      }
      console.error("Error creating supplier return:", error);
      res.status(500).json({ message: "Failed to create supplier return" });
    }
  });
  app2.put("/api/supplier-returns/:id", async (req, res) => {
    try {
      const returnData = insertSupplierReturnSchema.partial().parse(req.body);
      const returnRecord = await storage.updateSupplierReturn(req.params.id, returnData);
      res.json(returnRecord);
    } catch (error) {
      if (error instanceof z23.ZodError) {
        return res.status(400).json({ message: "Invalid supplier return data", errors: error.errors });
      }
      console.error("Error updating supplier return:", error);
      res.status(500).json({ message: "Failed to update supplier return" });
    }
  });
  app2.get("/api/supplier-returns/:returnId/items", async (req, res) => {
    try {
      const items3 = await storage.getSupplierReturnItems(req.params.returnId);
      res.json(items3);
    } catch (error) {
      console.error("Error fetching supplier return items:", error);
      res.status(500).json({ message: "Failed to fetch supplier return items" });
    }
  });
  app2.post("/api/supplier-return-items", async (req, res) => {
    try {
      const itemData = insertSupplierReturnItemSchema.parse(req.body);
      const item = await storage.createSupplierReturnItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z23.ZodError) {
        return res.status(400).json({ message: "Invalid supplier return item data", errors: error.errors });
      }
      console.error("Error creating supplier return item:", error);
      res.status(500).json({ message: "Failed to create supplier return item" });
    }
  });
  app2.post("/api/supplier-return-items/bulk", async (req, res) => {
    try {
      const itemsData = z23.array(insertSupplierReturnItemSchema).parse(req.body);
      const items3 = await storage.bulkCreateSupplierReturnItems(itemsData);
      res.status(201).json(items3);
    } catch (error) {
      if (error instanceof z23.ZodError) {
        return res.status(400).json({ message: "Invalid supplier return items data", errors: error.errors });
      }
      console.error("Error bulk creating supplier return items:", error);
      res.status(500).json({ message: "Failed to bulk create supplier return items" });
    }
  });
}

// server/routes/purchase-invoices.ts
init_storage();
function registerPurchaseInvoiceRoutes(app2) {
  app2.get("/api/purchase-invoices", async (req, res) => {
    try {
      const { status, supplier, currency, search, dateFrom, dateTo } = req.query;
      const grHeaders = await storage.getGoodsReceiptHeaders({});
      const results = await Promise.all((grHeaders || []).map(async (gr) => {
        const lpo = gr.supplierLpoId ? await storage.getSupplierLpo(gr.supplierLpoId) : null;
        const currencyCode = lpo?.currency || "BHD";
        const supplierName = lpo?.supplierId ? (await storage.getSupplier(lpo.supplierId))?.name : void 0;
        const subtotal = String(lpo?.subtotal ?? "0.00");
        const taxAmount = String(lpo?.taxAmount ?? "0.00");
        const totalAmount = String(lpo?.totalAmount ?? subtotal);
        return {
          id: gr.id,
          invoiceNumber: gr.receiptNumber,
          supplierInvoiceNumber: void 0,
          supplierId: lpo?.supplierId || gr.supplierId,
          supplierName: supplierName || "Supplier",
          purchaseOrderId: lpo?.id,
          purchaseOrderNumber: lpo?.lpoNumber,
          goodsReceiptId: gr.id,
          goodsReceiptNumber: gr.receiptNumber,
          status: (gr.status === "Complete" ? "Approved" : gr.status === "Pending" ? "Draft" : gr.status) || "Draft",
          paymentStatus: "Unpaid",
          invoiceDate: gr.receiptDate,
          dueDate: gr.expectedDeliveryDate || gr.receiptDate,
          receivedDate: gr.actualDeliveryDate,
          paymentDate: void 0,
          subtotal,
          taxAmount,
          discountAmount: "0.00",
          totalAmount,
          paidAmount: "0.00",
          remainingAmount: totalAmount,
          currency: currencyCode,
          paymentTerms: lpo?.paymentTerms || "",
          attachments: [],
          itemCount: 0,
          isRecurring: false,
          createdAt: gr.createdAt,
          updatedAt: gr.updatedAt,
          notes: gr.notes || ""
        };
      }));
      const filtered = (results || []).filter((row) => {
        if (status && status !== "all" && row.status !== status) return false;
        if (supplier && row.supplierName && !row.supplierName.toLowerCase().includes(supplier.toLowerCase())) return false;
        if (currency && row.currency !== currency) return false;
        if (search) {
          const s = search.toLowerCase();
          const hay = `${row.invoiceNumber} ${row.supplierInvoiceNumber || ""} ${row.supplierName}`.toLowerCase();
          if (!hay.includes(s)) return false;
        }
        if (dateFrom && row.invoiceDate && String(row.invoiceDate) < dateFrom) return false;
        if (dateTo && row.invoiceDate && String(row.invoiceDate) > dateTo) return false;
        return true;
      });
      res.json(filtered);
    } catch (error) {
      console.error("Error fetching purchase invoices:", error);
      res.status(500).json({ message: "Failed to fetch purchase invoices" });
    }
  });
}

// server/routes/utility.ts
init_storage();
function registerUtilityRoutes(app2) {
  app2.get("/api/exchange-rates", async (req, res) => {
    try {
      const { fromCurrency, toCurrency } = req.query;
      const exchangeRate = await storage.getExchangeRate(fromCurrency, toCurrency);
      res.json({ fromCurrency, toCurrency, rate: exchangeRate });
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      res.status(500).json({ message: "Failed to fetch exchange rate" });
    }
  });
  app2.get("/api/exchange-rate/:from/:to", async (req, res) => {
    try {
      const { from, to } = req.params;
      const exchangeRate = await storage.getExchangeRate(from, to);
      res.json({ exchangeRate });
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      res.status(500).json({ message: "Failed to fetch exchange rate" });
    }
  });
  app2.post("/api/barcode/verify", async (req, res) => {
    try {
      const { barcode, itemId } = req.body;
      const result = await storage.verifyItemBarcode(barcode, itemId);
      res.json(result);
    } catch (error) {
      console.error("Error verifying barcode:", error);
      res.status(500).json({ message: "Failed to verify barcode" });
    }
  });
  app2.post("/api/verify-barcode", async (req, res) => {
    try {
      const { barcode, expectedItemId } = req.body;
      const result = await storage.verifyItemBarcode(barcode, expectedItemId);
      res.json(result);
    } catch (error) {
      console.error("Error verifying barcode:", error);
      res.status(500).json({ message: "Failed to verify barcode" });
    }
  });
  app2.post("/api/currency/convert", async (req, res) => {
    try {
      const { amount, fromCurrency, toCurrency, exchangeRate } = req.body;
      const convertedAmount = await storage.convertCurrency(amount, fromCurrency, toCurrency, exchangeRate);
      res.json({ originalAmount: amount, convertedAmount, fromCurrency, toCurrency });
    } catch (error) {
      console.error("Error converting currency:", error);
      res.status(500).json({ message: "Failed to convert currency" });
    }
  });
  app2.post("/api/convert-currency", async (req, res) => {
    try {
      const { amount, fromCurrency, toCurrency, exchangeRate } = req.body;
      const convertedAmount = await storage.convertCurrency(amount, fromCurrency, toCurrency, exchangeRate);
      res.json({ convertedAmount });
    } catch (error) {
      console.error("Error converting currency:", error);
      res.status(500).json({ message: "Failed to convert currency" });
    }
  });
  app2.post("/api/invoices/:id/update-currency", async (req, res) => {
    try {
      const { newCurrency, exchangeRate, userId } = req.body;
      const invoice = await storage.updateInvoiceCurrency(req.params.id, newCurrency, exchangeRate, userId);
      res.json(invoice);
    } catch (error) {
      console.error("Error updating invoice currency:", error);
      res.status(500).json({ message: "Failed to update invoice currency" });
    }
  });
  app2.get("/api/health", async (req, res) => {
    try {
      res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
    } catch (error) {
      console.error("Error checking system health:", error);
      res.status(500).json({ message: "Failed to check system health" });
    }
  });
}

// server/routes/audit.ts
init_db();
import { Router as Router4 } from "express";

// shared/schemas/audit.ts
init_common();

// shared/schemas/users-customers.ts
init_common();
init_enums();
var users2 = pgTable2("users", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  username: varchar2("username", { length: 100 }).notNull().unique(),
  email: varchar2("email", { length: 255 }).unique(),
  firstName: varchar2("first_name", { length: 100 }),
  lastName: varchar2("last_name", { length: 100 }),
  role: varchar2("role", { length: 50 }).notNull().default("user"),
  passwordHash: varchar2("password_hash", { length: 255 }),
  isActive: boolean2("is_active").default(true),
  lastLoginAt: timestamp2("last_login_at"),
  profileImageUrl: varchar2("profile_image_url", { length: 500 }),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
});
var customers2 = pgTable2("customers", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  name: varchar2("name", { length: 255 }).notNull(),
  email: varchar2("email", { length: 255 }),
  phone: varchar2("phone", { length: 50 }),
  address: text2("address"),
  customerType: customerTypeEnum2("customer_type").notNull(),
  classification: customerClassificationEnum2("classification").notNull(),
  taxId: varchar2("tax_id", { length: 100 }),
  creditLimit: decimal2("credit_limit", { precision: 12, scale: 2 }),
  paymentTerms: varchar2("payment_terms", { length: 100 }),
  isActive: boolean2("is_active").default(true),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
});
var suppliers4 = pgTable2("suppliers", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  name: varchar2("name", { length: 255 }).notNull(),
  email: varchar2("email", { length: 255 }),
  phone: varchar2("phone", { length: 50 }),
  address: text2("address"),
  contactPerson: varchar2("contact_person", { length: 255 }),
  paymentTerms: varchar2("payment_terms", { length: 100 }),
  isActive: boolean2("is_active").default(true),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
});
var insertCustomerSchema2 = createInsertSchema2(customers2).omit({ id: true, createdAt: true, updatedAt: true });
var insertSupplierSchema2 = createInsertSchema2(suppliers4).omit({ id: true, createdAt: true, updatedAt: true });

// shared/schemas/audit.ts
var auditLog = pgTable2("audit_log", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  entityType: varchar2("entity_type", { length: 100 }).notNull(),
  entityId: uuid2("entity_id").notNull(),
  action: varchar2("action", { length: 50 }).notNull(),
  oldData: jsonb2("old_data"),
  newData: jsonb2("new_data"),
  userId: uuid2("user_id").references(() => users2.id),
  timestamp: timestamp2("timestamp").defaultNow()
});

// server/routes/audit.ts
import { eq as eq23, desc as desc16, and as and18, gte as gte7, lte as lte6, sql as sql15 } from "drizzle-orm";
var router4 = Router4();
router4.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      entityType,
      action,
      userId,
      startDate,
      endDate,
      search
    } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let whereConditions = [];
    if (entityType) {
      whereConditions.push(eq23(auditLog.entityType, entityType));
    }
    if (action) {
      whereConditions.push(eq23(auditLog.action, action));
    }
    if (userId) {
      whereConditions.push(eq23(auditLog.userId, userId));
    }
    if (startDate) {
      whereConditions.push(gte7(auditLog.timestamp, new Date(startDate)));
    }
    if (endDate) {
      whereConditions.push(lte6(auditLog.timestamp, new Date(endDate)));
    }
    const logs = await db.select().from(auditLog).where(whereConditions.length > 0 ? and18(...whereConditions) : void 0).orderBy(desc16(auditLog.timestamp)).limit(Number(limit)).offset(offset);
    const totalCount = await db.select({ count: sql15`count(*)` }).from(auditLog).where(whereConditions.length > 0 ? and18(...whereConditions) : void 0);
    res.json({
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(totalCount[0]?.count || 0),
        pages: Math.ceil(Number(totalCount[0]?.count || 0) / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});
router4.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const log2 = await db.select().from(auditLog).where(eq23(auditLog.id, id)).limit(1);
    if (log2.length === 0) {
      return res.status(404).json({ error: "Audit log not found" });
    }
    res.json(log2[0]);
  } catch (error) {
    console.error("Error fetching audit log:", error);
    res.status(500).json({ error: "Failed to fetch audit log" });
  }
});
router4.get("/entity/:entityType/:entityId", async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const logs = await db.select().from(auditLog).where(
      and18(
        eq23(auditLog.entityType, entityType),
        eq23(auditLog.entityId, entityId)
      )
    ).orderBy(desc16(auditLog.timestamp));
    res.json(logs);
  } catch (error) {
    console.error("Error fetching entity audit logs:", error);
    res.status(500).json({ error: "Failed to fetch entity audit logs" });
  }
});
router4.get("/stats/summary", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let whereConditions = [];
    if (startDate) {
      whereConditions.push(gte7(auditLog.timestamp, new Date(startDate)));
    }
    if (endDate) {
      whereConditions.push(lte6(auditLog.timestamp, new Date(endDate)));
    }
    const stats = await db.select({
      totalActions: sql15`count(*)`,
      uniqueUsers: sql15`count(distinct ${auditLog.userId})`,
      uniqueEntities: sql15`count(distinct ${auditLog.entityType})`
    }).from(auditLog).where(whereConditions.length > 0 ? and18(...whereConditions) : void 0);
    const actionBreakdown = await db.select({
      action: auditLog.action,
      count: sql15`count(*)`
    }).from(auditLog).where(whereConditions.length > 0 ? and18(...whereConditions) : void 0).groupBy(auditLog.action);
    res.json({
      summary: stats[0],
      actionBreakdown
    });
  } catch (error) {
    console.error("Error fetching audit statistics:", error);
    res.status(500).json({ error: "Failed to fetch audit statistics" });
  }
});
var audit_default = router4;

// server/routes/users.ts
init_db();
import { Router as Router5 } from "express";
import { eq as eq24, desc as desc17, and as and19, sql as sql16 } from "drizzle-orm";
var router5 = Router5();
router5.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      role,
      search
    } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let whereConditions = [];
    if (role) {
      whereConditions.push(eq24(users2.role, role));
    }
    if (search) {
      whereConditions.push(
        sql16`(${users2.firstName} ILIKE ${`%${search}%`} OR ${users2.lastName} ILIKE ${`%${search}%`} OR ${users2.email} ILIKE ${`%${search}%`} OR ${users2.username} ILIKE ${`%${search}%`})`
      );
    }
    const userList = await db.select().from(users2).where(whereConditions.length > 0 ? and19(...whereConditions) : void 0).orderBy(desc17(users2.createdAt)).limit(Number(limit)).offset(offset);
    const totalCount = await db.select({ count: sql16`count(*)` }).from(users2).where(whereConditions.length > 0 ? and19(...whereConditions) : void 0);
    res.json({
      users: userList,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(totalCount[0]?.count || 0),
        pages: Math.ceil(Number(totalCount[0]?.count || 0) / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
router5.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.select().from(users2).where(eq24(users2.id, id)).limit(1);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});
router5.post("/", async (req, res) => {
  try {
    const { username, email, firstName, lastName, role } = req.body;
    if (!username || !role) {
      return res.status(400).json({ error: "Username and role are required" });
    }
    const newUser = await db.insert(users2).values({
      username,
      email,
      firstName,
      lastName,
      role
    }).returning();
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === "23505") {
      res.status(400).json({ error: "Username or email already exists" });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  }
});
router5.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, firstName, lastName, role, profileImageUrl } = req.body;
    const updatedUser = await db.update(users2).set({
      username,
      email,
      firstName,
      lastName,
      role,
      profileImageUrl,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq24(users2.id, id)).returning();
    if (updatedUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === "23505") {
      res.status(400).json({ error: "Username or email already exists" });
    } else {
      res.status(500).json({ error: "Failed to update user" });
    }
  }
});
router5.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await db.delete(users2).where(eq24(users2.id, id)).returning();
    if (deletedUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});
router5.get("/stats/roles", async (req, res) => {
  try {
    const roleStats = await db.select({
      role: users2.role,
      count: sql16`count(*)`
    }).from(users2).groupBy(users2.role);
    const totalUsers = await db.select({ count: sql16`count(*)` }).from(users2);
    res.json({
      roleStats,
      totalUsers: Number(totalUsers[0]?.count || 0)
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: "Failed to fetch user statistics" });
  }
});
var users_default = router5;

// server/routes/settings.ts
init_db();
import { Router as Router6 } from "express";
import { pgTable as pgTable3, varchar as varchar3, text as text3, jsonb as jsonb3, timestamp as timestamp3 } from "drizzle-orm/pg-core";
var systemSettings = pgTable3("system_settings", {
  id: varchar3("id", { length: 100 }).primaryKey(),
  category: varchar3("category", { length: 50 }).notNull(),
  key: varchar3("key", { length: 100 }).notNull(),
  value: text3("value"),
  jsonValue: jsonb3("json_value"),
  description: text3("description"),
  updatedAt: timestamp3("updated_at").defaultNow(),
  updatedBy: varchar3("updated_by", { length: 100 })
});
var router6 = Router6();
router6.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let whereCondition = {};
    if (category) {
      whereCondition = { category };
    }
    const settings = await db.select().from(systemSettings).where(category ? eq(systemSettings.category, category) : void 0).orderBy(systemSettings.category, systemSettings.key);
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});
router6.get("/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await db.select().from(systemSettings).where(eq(systemSettings.key, key)).limit(1);
    if (setting.length === 0) {
      return res.status(404).json({ error: "Setting not found" });
    }
    res.json(setting[0]);
  } catch (error) {
    console.error("Error fetching setting:", error);
    res.status(500).json({ error: "Failed to fetch setting" });
  }
});
router6.put("/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const { value, jsonValue, description, updatedBy } = req.body;
    const updatedSetting = await db.update(systemSettings).set({
      value,
      jsonValue,
      description,
      updatedAt: /* @__PURE__ */ new Date(),
      updatedBy
    }).where(eq(systemSettings.key, key)).returning();
    if (updatedSetting.length === 0) {
      const newSetting = await db.insert(systemSettings).values({
        id: key,
        key,
        value,
        jsonValue,
        description,
        updatedBy
      }).returning();
      return res.json(newSetting[0]);
    }
    res.json(updatedSetting[0]);
  } catch (error) {
    console.error("Error updating setting:", error);
    res.status(500).json({ error: "Failed to update setting" });
  }
});
router6.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const settings = await db.select().from(systemSettings).where(eq(systemSettings.category, category)).orderBy(systemSettings.key);
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings by category:", error);
    res.status(500).json({ error: "Failed to fetch settings by category" });
  }
});
router6.put("/bulk", async (req, res) => {
  try {
    const { settings, updatedBy } = req.body;
    if (!Array.isArray(settings)) {
      return res.status(400).json({ error: "Settings must be an array" });
    }
    const results = [];
    for (const setting of settings) {
      const { key, value, jsonValue, description, category } = setting;
      const updatedSetting = await db.update(systemSettings).set({
        value,
        jsonValue,
        description,
        category,
        updatedAt: /* @__PURE__ */ new Date(),
        updatedBy
      }).where(eq(systemSettings.key, key)).returning();
      if (updatedSetting.length === 0) {
        const newSetting = await db.insert(systemSettings).values({
          id: key,
          key,
          value,
          jsonValue,
          description,
          category,
          updatedBy
        }).returning();
        results.push(newSetting[0]);
      } else {
        results.push(updatedSetting[0]);
      }
    }
    res.json(results);
  } catch (error) {
    console.error("Error bulk updating settings:", error);
    res.status(500).json({ error: "Failed to bulk update settings" });
  }
});
router6.get("/config/system", async (req, res) => {
  try {
    const config = await db.select().from(systemSettings).where(eq(systemSettings.category, "system"));
    const configObject = {};
    config.forEach((setting) => {
      configObject[setting.key] = setting.jsonValue || setting.value;
    });
    res.json(configObject);
  } catch (error) {
    console.error("Error fetching system config:", error);
    res.status(500).json({ error: "Failed to fetch system config" });
  }
});
var settings_default = router6;

// server/routes/analytics.ts
init_db();
import { Router as Router7 } from "express";
import { sql as sql18, count as count6, eq as eq25 } from "drizzle-orm";

// shared/schemas/enquiries.ts
init_common();
init_enums();

// shared/schemas/items.ts
init_common();
var items2 = pgTable2("items", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  supplierCode: varchar2("supplier_code", { length: 100 }).notNull(),
  barcode: varchar2("barcode", { length: 100 }).unique(),
  description: text2("description").notNull(),
  category: varchar2("category", { length: 100 }),
  unitOfMeasure: varchar2("unit_of_measure", { length: 50 }),
  costPrice: decimal2("cost_price", { precision: 10, scale: 2 }),
  retailMarkup: decimal2("retail_markup", { precision: 5, scale: 2 }).default("70"),
  wholesaleMarkup: decimal2("wholesale_markup", { precision: 5, scale: 2 }).default("40"),
  supplierId: uuid2("supplier_id").references(() => suppliers4.id),
  variants: jsonb2("variants"),
  // For color, size, etc.
  isActive: boolean2("is_active").default(true),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
});
var legacyInventory2 = pgTable2("inventory", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  itemId: uuid2("item_id").references(() => items2.id).notNull(),
  quantity: integer2("quantity").default(0),
  reservedQuantity: integer2("reserved_quantity").default(0),
  storageLocation: varchar2("storage_location", { length: 100 }),
  lastUpdated: timestamp2("last_updated").defaultNow()
});
var insertItemSchema2 = createInsertSchema2(items2).omit({ id: true, createdAt: true, updatedAt: true });

// shared/schemas/enquiries.ts
init_common();
var enquiries2 = pgTable2("enquiries", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  enquiryNumber: varchar2("enquiry_number", { length: 50 }).unique().notNull(),
  customerId: uuid2("customer_id").references(() => customers2.id).notNull(),
  enquiryDate: timestamp2("enquiry_date").defaultNow(),
  status: enquiryStatusEnum2("status").default("New"),
  source: enquirySourceEnum2("source").notNull(),
  targetDeliveryDate: timestamp2("target_delivery_date"),
  notes: text2("notes"),
  attachments: jsonb2("attachments"),
  // File paths/URLs
  createdBy: uuid2("created_by").references(() => users2.id),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
});
var enquiryItems2 = pgTable2("enquiry_items", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  enquiryId: uuid2("enquiry_id").references(() => enquiries2.id).notNull(),
  itemId: uuid2("item_id").references(() => items2.id),
  description: text2("description").notNull(),
  quantity: integer2("quantity").notNull(),
  unitPrice: decimal2("unit_price", { precision: 10, scale: 2 }),
  notes: text2("notes")
});
var insertEnquirySchema2 = createInsertSchema2(enquiries2, {
  targetDeliveryDate: z2.string().optional()
}).omit({ id: true, enquiryNumber: true, createdAt: true, updatedAt: true }).extend({
  createdBy: z2.string().optional()
});
var insertEnquiryItemSchema2 = createInsertSchema2(enquiryItems2).omit({ id: true }).extend({
  description: z2.string().min(1, "Description is required"),
  quantity: z2.number().min(1, "Quantity must be at least 1"),
  unitPrice: z2.number().optional()
});

// shared/schemas/quotations.ts
init_common();
init_enums();
var quotations2 = pgTable2("quotations", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  quoteNumber: varchar2("quote_number", { length: 50 }).unique().notNull(),
  revision: integer2("revision").default(1),
  // Revision tracking for audit purposes
  parentQuotationId: uuid2("parent_quotation_id"),
  revisionReason: text2("revision_reason"),
  supersededAt: timestamp2("superseded_at"),
  supersededBy: uuid2("superseded_by").references(() => users2.id),
  isSuperseded: boolean2("is_superseded").default(false),
  enquiryId: uuid2("enquiry_id").references(() => enquiries2.id),
  customerId: uuid2("customer_id").references(() => customers2.id).notNull(),
  customerType: customerTypeEnum2("customer_type").notNull(),
  status: quotationStatusEnum2("status").default("Draft"),
  quoteDate: timestamp2("quote_date").defaultNow(),
  validUntil: timestamp2("valid_until"),
  subtotal: decimal2("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
  discountPercentage: decimal2("discount_percentage", { precision: 5, scale: 2 }).default("0"),
  discountAmount: decimal2("discount_amount", { precision: 12, scale: 2 }).default("0"),
  taxAmount: decimal2("tax_amount", { precision: 12, scale: 2 }).default("0"),
  totalAmount: decimal2("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  terms: text2("terms"),
  notes: text2("notes"),
  approvalStatus: varchar2("approval_status", { length: 50 }).default("Pending"),
  requiredApprovalLevel: approvalLevelEnum2("required_approval_level"),
  approvedBy: uuid2("approved_by").references(() => users2.id),
  approvedAt: timestamp2("approved_at"),
  rejectionReason: text2("rejection_reason"),
  createdBy: uuid2("created_by").references(() => users2.id),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
});
var quotationItems2 = pgTable2("quotation_items", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  quotationId: uuid2("quotation_id").references(() => quotations2.id, { onDelete: "cascade" }).notNull(),
  description: text2("description").notNull(),
  quantity: integer2("quantity").notNull(),
  costPrice: decimal2("cost_price", { precision: 12, scale: 4 }),
  markup: decimal2("markup", { precision: 5, scale: 2 }),
  unitPrice: decimal2("unit_price", { precision: 12, scale: 4 }).notNull(),
  lineTotal: decimal2("line_total", { precision: 12, scale: 2 }).notNull(),
  isAccepted: boolean2("is_accepted").default(true),
  rejectionReason: text2("rejection_reason"),
  notes: text2("notes"),
  createdAt: timestamp2("created_at").defaultNow()
});
var approvalRules2 = pgTable2("approval_rules", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  name: varchar2("name", { length: 255 }).notNull(),
  customerType: customerTypeEnum2("customer_type"),
  minQuoteValue: decimal2("min_quote_value", { precision: 12, scale: 2 }),
  maxQuoteValue: decimal2("max_quote_value", { precision: 12, scale: 2 }),
  maxDiscountPercentage: decimal2("max_discount_percentage", { precision: 5, scale: 2 }),
  requiredApprovalLevel: approvalLevelEnum2("required_approval_level").notNull(),
  isActive: boolean2("is_active").default(true),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
});
var quotationApprovals2 = pgTable2("quotation_approvals", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  quotationId: uuid2("quotation_id").references(() => quotations2.id, { onDelete: "cascade" }).notNull(),
  approverLevel: approvalLevelEnum2("approver_level").notNull(),
  approverId: uuid2("approver_id").references(() => users2.id),
  status: varchar2("status", { length: 50 }).notNull(),
  // "Pending", "Approved", "Rejected"
  comments: text2("comments"),
  createdAt: timestamp2("created_at").defaultNow()
});
var insertQuotationSchema2 = createInsertSchema2(quotations2, {
  validUntil: z2.string().optional()
}).omit({ id: true, quoteNumber: true, createdAt: true, updatedAt: true, parentQuotationId: true }).extend({
  createdBy: z2.string().optional()
});
var createQuotationRevisionSchema2 = z2.object({
  revisionReason: z2.string().min(1, "Revision reason is required"),
  quoteDate: z2.string().optional(),
  validUntil: z2.string().optional(),
  subtotal: z2.string().optional(),
  discountPercentage: z2.string().optional(),
  discountAmount: z2.string().optional(),
  taxAmount: z2.string().optional(),
  totalAmount: z2.string().optional(),
  terms: z2.string().optional(),
  notes: z2.string().optional(),
  items: z2.array(z2.object({
    description: z2.string().min(1),
    quantity: z2.number().min(1),
    costPrice: z2.string().optional(),
    markup: z2.string().optional(),
    unitPrice: z2.string().min(1),
    lineTotal: z2.string().min(1),
    isAccepted: z2.boolean().optional(),
    rejectionReason: z2.string().optional(),
    notes: z2.string().optional()
  })).optional()
});
var insertQuotationItemSchema2 = createInsertSchema2(quotationItems2).omit({ id: true, createdAt: true });
var insertApprovalRuleSchema2 = createInsertSchema2(approvalRules2).omit({ id: true, createdAt: true, updatedAt: true });
var insertQuotationApprovalSchema2 = createInsertSchema2(quotationApprovals2).omit({ id: true, createdAt: true });

// shared/schemas/sales-orders.ts
init_common();
init_enums();
init_common();
var salesOrders2 = pgTable2("sales_orders", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  orderNumber: varchar2("order_number", { length: 50 }).unique().notNull(),
  quotationId: uuid2("quotation_id"),
  // Will reference quotations.id
  customerId: uuid2("customer_id").references(() => customers2.id).notNull(),
  orderDate: timestamp2("order_date").defaultNow(),
  status: salesOrderStatusEnum2("status").default("Draft"),
  customerPoNumber: varchar2("customer_po_number", { length: 100 }),
  customerPoDocument: varchar2("customer_po_document", { length: 500 }),
  subtotal: decimal2("subtotal", { precision: 12, scale: 2 }),
  taxAmount: decimal2("tax_amount", { precision: 12, scale: 2 }),
  totalAmount: decimal2("total_amount", { precision: 12, scale: 2 }),
  paymentTerms: varchar2("payment_terms", { length: 100 }),
  deliveryInstructions: text2("delivery_instructions"),
  // Version control for amendments
  version: integer2("version").default(1),
  parentOrderId: uuid2("parent_order_id"),
  // Self-reference will be added as foreign key constraint
  amendmentReason: text2("amendment_reason"),
  // Customer LPO validation
  customerLpoRequired: boolean2("customer_lpo_required").default(true),
  customerLpoDocumentName: varchar2("customer_lpo_document_name", { length: 255 }),
  customerLpoDocumentSize: integer2("customer_lpo_document_size"),
  customerLpoValidationStatus: varchar2("customer_lpo_validation_status", { length: 50 }).default("Pending"),
  customerLpoValidatedBy: uuid2("customer_lpo_validated_by").references(() => users2.id),
  customerLpoValidatedAt: timestamp2("customer_lpo_validated_at"),
  // Order type tracking
  isPartialOrder: boolean2("is_partial_order").default(false),
  sourceType: varchar2("source_type", { length: 50 }).default("Manual"),
  // "Auto", "Manual"
  createdBy: uuid2("created_by").references(() => users2.id),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
});
var salesOrderItems2 = pgTable2("sales_order_items", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  salesOrderId: uuid2("sales_order_id").references(() => salesOrders2.id).notNull(),
  itemId: uuid2("item_id").references(() => items2.id).notNull(),
  lineNumber: integer2("line_number"),
  quantity: integer2("quantity").notNull(),
  unitPrice: decimal2("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal2("total_price", { precision: 12, scale: 2 }).notNull(),
  deliveryRequirement: text2("delivery_requirement"),
  specialInstructions: text2("special_instructions")
});
var insertSalesOrderSchema2 = createInsertSchema2(salesOrders2).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  version: true,
  customerLpoValidatedAt: true,
  orderNumber: true
  // Auto-generated in storage layer
});
var insertSalesOrderItemSchema2 = createInsertSchema2(salesOrderItems2).omit({ id: true });

// shared/schemas/invoices.ts
init_common();
init_enums();
var invoices3 = pgTable2("invoices", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  invoiceNumber: varchar2("invoice_number", { length: 50 }).unique().notNull(),
  invoiceType: varchar2("invoice_type", { length: 50 }).default("Final"),
  // "Proforma", "Final", "Credit Note"
  salesOrderId: uuid2("sales_order_id"),
  // References sales_orders.id
  deliveryId: uuid2("delivery_id"),
  // References deliveries.id
  customerId: uuid2("customer_id").references(() => customers2.id).notNull(),
  invoiceDate: timestamp2("invoice_date").defaultNow(),
  dueDate: timestamp2("due_date"),
  status: invoiceStatusEnum2("status").default("Draft"),
  // Multi-currency support
  currency: varchar2("currency", { length: 10 }).default("USD"),
  exchangeRate: decimal2("exchange_rate", { precision: 10, scale: 4 }).default("1.0000"),
  baseCurrency: varchar2("base_currency", { length: 10 }).default("USD"),
  // Financial details in invoice currency
  subtotal: decimal2("subtotal", { precision: 12, scale: 2 }),
  taxRate: decimal2("tax_rate", { precision: 5, scale: 2 }).default("0"),
  taxAmount: decimal2("tax_amount", { precision: 12, scale: 2 }),
  discountPercentage: decimal2("discount_percentage", { precision: 5, scale: 2 }).default("0"),
  discountAmount: decimal2("discount_amount", { precision: 12, scale: 2 }),
  totalAmount: decimal2("total_amount", { precision: 12, scale: 2 }),
  paidAmount: decimal2("paid_amount", { precision: 12, scale: 2 }).default("0"),
  outstandingAmount: decimal2("outstanding_amount", { precision: 12, scale: 2 }),
  // Financial details in base currency
  subtotalBase: decimal2("subtotal_base", { precision: 12, scale: 2 }),
  taxAmountBase: decimal2("tax_amount_base", { precision: 12, scale: 2 }),
  discountAmountBase: decimal2("discount_amount_base", { precision: 12, scale: 2 }),
  totalAmountBase: decimal2("total_amount_base", { precision: 12, scale: 2 }),
  // Payment tracking
  paymentTerms: varchar2("payment_terms", { length: 100 }),
  paymentMethod: varchar2("payment_method", { length: 50 }),
  paymentReference: varchar2("payment_reference", { length: 100 }),
  lastPaymentDate: timestamp2("last_payment_date"),
  // Auto-generation and linking
  autoGenerated: boolean2("auto_generated").default(false),
  generatedFromDeliveryId: uuid2("generated_from_delivery_id"),
  // References deliveries.id
  // Return and credit note support
  originalInvoiceId: uuid2("original_invoice_id"),
  // Self-reference will be added as foreign key constraint
  returnReason: text2("return_reason"),
  // Document management
  invoiceDocument: varchar2("invoice_document", { length: 500 }),
  invoiceDocumentName: varchar2("invoice_document_name", { length: 255 }),
  invoiceDocumentSize: integer2("invoice_document_size"),
  notes: text2("notes"),
  internalNotes: text2("internal_notes"),
  createdBy: uuid2("created_by").references(() => users2.id),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
});
var invoiceItems2 = pgTable2("invoice_items", {
  id: uuid2("id").primaryKey().default(sql6`gen_random_uuid()`),
  invoiceId: uuid2("invoice_id").references(() => invoices3.id).notNull(),
  deliveryItemId: uuid2("delivery_item_id"),
  // References delivery_items.id
  itemId: uuid2("item_id").references(() => items2.id).notNull(),
  barcode: varchar2("barcode", { length: 100 }).notNull(),
  supplierCode: varchar2("supplier_code", { length: 100 }).notNull(),
  description: text2("description").notNull(),
  lineNumber: integer2("line_number").notNull(),
  quantity: integer2("quantity").notNull(),
  // Pricing in invoice currency
  unitPrice: decimal2("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal2("total_price", { precision: 12, scale: 2 }).notNull(),
  discountPercentage: decimal2("discount_percentage", { precision: 5, scale: 2 }).default("0"),
  discountAmount: decimal2("discount_amount", { precision: 10, scale: 2 }).default("0"),
  taxRate: decimal2("tax_rate", { precision: 5, scale: 2 }).default("0"),
  taxAmount: decimal2("tax_amount", { precision: 10, scale: 2 }).default("0"),
  // Pricing in base currency
  unitPriceBase: decimal2("unit_price_base", { precision: 10, scale: 2 }).notNull(),
  totalPriceBase: decimal2("total_price_base", { precision: 12, scale: 2 }).notNull(),
  discountAmountBase: decimal2("discount_amount_base", { precision: 10, scale: 2 }).default("0"),
  taxAmountBase: decimal2("tax_amount_base", { precision: 10, scale: 2 }).default("0"),
  // Return and credit note support
  returnQuantity: integer2("return_quantity").default(0),
  returnReason: text2("return_reason"),
  notes: text2("notes")
});
var insertInvoiceSchema2 = createInsertSchema2(invoices3);
var insertInvoiceItemSchema2 = createInsertSchema2(invoiceItems2).omit({
  id: true
});

// server/routes/analytics.ts
var router7 = Router7();
router7.get("/dashboard", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const enquiryStats = await db.select({
      total_enquiries: count6(),
      new_enquiries: sql18`COUNT(CASE WHEN status = 'New' THEN 1 END)`,
      in_progress_enquiries: sql18`COUNT(CASE WHEN status = 'In Progress' THEN 1 END)`,
      quoted_enquiries: sql18`COUNT(CASE WHEN status = 'Quoted' THEN 1 END)`,
      closed_enquiries: sql18`COUNT(CASE WHEN status = 'Closed' THEN 1 END)`
    }).from(enquiries2);
    const quotationStats = await db.select({
      total_quotations: count6(),
      draft_quotations: sql18`COUNT(CASE WHEN status = 'Draft' THEN 1 END)`,
      sent_quotations: sql18`COUNT(CASE WHEN status = 'Sent' THEN 1 END)`,
      accepted_quotations: sql18`COUNT(CASE WHEN status = 'Accepted' THEN 1 END)`,
      rejected_quotations: sql18`COUNT(CASE WHEN status = 'Rejected' THEN 1 END)`,
      total_quotation_value: sql18`COALESCE(SUM(total_amount), 0)`
    }).from(quotations2);
    const salesOrderStats = await db.select({
      total_orders: count6(),
      pending_orders: sql18`COUNT(CASE WHEN status = 'Draft' THEN 1 END)`,
      confirmed_orders: sql18`COUNT(CASE WHEN status = 'Confirmed' THEN 1 END)`,
      shipped_orders: sql18`COUNT(CASE WHEN status = 'Shipped' THEN 1 END)`,
      delivered_orders: sql18`COUNT(CASE WHEN status = 'Delivered' THEN 1 END)`,
      total_order_value: sql18`COALESCE(SUM(total_amount), 0)`
    }).from(salesOrders2);
    const invoiceStats = await db.select({
      total_invoices: count6(),
      draft_invoices: sql18`COUNT(CASE WHEN status = 'Draft' THEN 1 END)`,
      sent_invoices: sql18`COUNT(CASE WHEN status = 'Sent' THEN 1 END)`,
      paid_invoices: sql18`COUNT(CASE WHEN status = 'Paid' THEN 1 END)`,
      overdue_invoices: sql18`COUNT(CASE WHEN status = 'Overdue' THEN 1 END)`,
      total_invoice_value: sql18`COALESCE(SUM(total_amount), 0)`,
      total_paid_amount: sql18`COALESCE(SUM(paid_amount), 0)`
    }).from(invoices3);
    const customerStats = await db.select({
      total_customers: count6(),
      active_customers: sql18`COUNT(CASE WHEN is_active = true THEN 1 END)`,
      retail_customers: sql18`COUNT(CASE WHEN customer_type = 'Retail' THEN 1 END)`,
      wholesale_customers: sql18`COUNT(CASE WHEN customer_type = 'Wholesale' THEN 1 END)`
    }).from(customers2);
    res.json({
      enquiries: enquiryStats[0] || {
        total_enquiries: 0,
        new_enquiries: 0,
        in_progress_enquiries: 0,
        quoted_enquiries: 0,
        closed_enquiries: 0
      },
      quotations: quotationStats[0] || {
        total_quotations: 0,
        draft_quotations: 0,
        sent_quotations: 0,
        accepted_quotations: 0,
        rejected_quotations: 0,
        total_quotation_value: 0
      },
      salesOrders: salesOrderStats[0] || {
        total_orders: 0,
        pending_orders: 0,
        confirmed_orders: 0,
        shipped_orders: 0,
        delivered_orders: 0,
        total_order_value: 0
      },
      invoices: invoiceStats[0] || {
        total_invoices: 0,
        draft_invoices: 0,
        sent_invoices: 0,
        paid_invoices: 0,
        overdue_invoices: 0,
        total_invoice_value: 0,
        total_paid_amount: 0
      },
      customers: customerStats[0] || {
        total_customers: 0,
        active_customers: 0,
        retail_customers: 0,
        wholesale_customers: 0
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    res.status(500).json({ error: "Failed to fetch dashboard analytics" });
  }
});
router7.get("/sales/trends", async (req, res) => {
  try {
    const { period = "month" } = req.query;
    let dateFormat = "month";
    let interval = "12 months";
    switch (period) {
      case "day":
        dateFormat = "day";
        interval = "30 days";
        break;
      case "week":
        dateFormat = "week";
        interval = "12 weeks";
        break;
      case "year":
        dateFormat = "year";
        interval = "5 years";
        break;
      default:
        dateFormat = "month";
        interval = "12 months";
    }
    const salesTrends = await db.execute(sql18`
      WITH date_series AS (
        SELECT 
          DATE_TRUNC(${sql18.raw(`'${dateFormat}'`)}, created_at) as period,
          COUNT(*)::text as count,
          COALESCE(SUM(total_amount), 0)::text as total_value,
          ROUND(AVG(total_amount), 2)::text as avg_order_value
        FROM sales_orders 
        WHERE created_at >= NOW() - INTERVAL ${sql18.raw(`'${interval}'`)}
        GROUP BY DATE_TRUNC(${sql18.raw(`'${dateFormat}'`)}, created_at)
        ORDER BY period DESC
      )
      SELECT 
        TO_CHAR(period, 'YYYY-MM-DD') as period,
        count,
        total_value,
        avg_order_value
      FROM date_series
    `);
    res.json(salesTrends.rows || []);
  } catch (error) {
    console.error("Error fetching sales trends:", error);
    res.status(500).json({ error: "Failed to fetch sales trends" });
  }
});
router7.get("/customers/top", async (req, res) => {
  try {
    const topCustomers = await db.execute(sql18`
      SELECT 
        c.id,
        c.name,
        c.email,
        c.customer_type,
        COUNT(so.id)::text as order_count,
        COALESCE(SUM(so.total_amount), 0)::text as total_value,
        ROUND(COALESCE(AVG(so.total_amount), 0), 2)::text as avg_order_value,
        MAX(so.created_at) as last_order_date
      FROM customers c
      LEFT JOIN sales_orders so ON c.id = so.customer_id
      WHERE c.name != '' AND c.name IS NOT NULL
      GROUP BY c.id, c.name, c.email, c.customer_type
      HAVING COUNT(so.id) > 0
      ORDER BY total_value DESC
      LIMIT 10
    `);
    res.json(topCustomers.rows || []);
  } catch (error) {
    console.error("Error fetching top customers:", error);
    res.status(500).json({ error: "Failed to fetch top customers" });
  }
});
router7.get("/products/top", async (req, res) => {
  try {
    const topProducts = await db.execute(sql18`
      WITH product_sales AS (
        SELECT 
          qi.description,
          qi.supplier_code,
          COALESCE(i.category, 'General') as category,
          SUM(qi.quantity)::text as total_quantity,
          SUM(qi.quantity * qi.unit_price)::text as total_value,
          COUNT(DISTINCT q.id)::text as order_count
        FROM quotation_items qi
        JOIN quotations q ON qi.quotation_id = q.id
        LEFT JOIN items i ON qi.supplier_code = i.supplier_code
        WHERE qi.description IS NOT NULL AND qi.description != ''
        GROUP BY qi.description, qi.supplier_code, i.category
        
        UNION ALL
        
        SELECT 
          soi.description,
          COALESCE(soi.supplier_code, 'N/A') as supplier_code,
          COALESCE(i.category, 'General') as category,
          SUM(soi.quantity)::text as total_quantity,
          SUM(soi.quantity * soi.unit_price)::text as total_value,
          COUNT(DISTINCT so.id)::text as order_count
        FROM sales_order_items soi
        JOIN sales_orders so ON soi.sales_order_id = so.id
        LEFT JOIN items i ON soi.supplier_code = i.supplier_code
        WHERE soi.description IS NOT NULL AND soi.description != ''
        GROUP BY soi.description, soi.supplier_code, i.category
      )
      SELECT 
        ROW_NUMBER() OVER (ORDER BY SUM(total_value::numeric) DESC) as id,
        description,
        supplier_code,
        category,
        SUM(total_quantity::integer)::text as total_quantity,
        SUM(total_value::numeric)::text as total_value,
        SUM(order_count::integer)::text as order_count
      FROM product_sales
      GROUP BY description, supplier_code, category
      ORDER BY SUM(total_value::numeric) DESC
      LIMIT 10
    `);
    res.json(topProducts.rows?.map((row) => ({
      id: row.id?.toString() || "0",
      supplier_code: row.supplier_code || "N/A",
      description: row.description || "Unknown Product",
      category: row.category || "General",
      total_quantity: parseInt(row.total_quantity || "0"),
      total_value: parseFloat(row.total_value || "0"),
      order_count: parseInt(row.order_count || "0")
    })) || []);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.json([{
      id: "1",
      supplier_code: "N/A",
      description: "Product data analysis in progress",
      category: "System",
      total_quantity: 0,
      total_value: 0,
      order_count: 0
    }]);
  }
});
router7.get("/conversion/funnel", async (req, res) => {
  try {
    const enquiryCount = await db.select({ count: count6() }).from(enquiries2);
    const quotationCount = await db.select({ count: count6() }).from(quotations2);
    const salesOrderCount = await db.select({ count: count6() }).from(salesOrders2);
    const invoiceCount = await db.select({ count: count6() }).from(invoices3);
    const enquiries_val = enquiryCount[0]?.count || 0;
    const quotations_val = quotationCount[0]?.count || 0;
    const sales_orders_val = salesOrderCount[0]?.count || 0;
    const invoices_val = invoiceCount[0]?.count || 0;
    const enquiry_to_quote_rate = enquiries_val > 0 ? Math.round(quotations_val / enquiries_val * 100) : 0;
    const quote_to_order_rate = quotations_val > 0 ? Math.round(sales_orders_val / quotations_val * 100) : 0;
    const order_to_invoice_rate = sales_orders_val > 0 ? Math.round(invoices_val / sales_orders_val * 100) : 0;
    const funnel = {
      enquiries: enquiries_val,
      quotations: quotations_val,
      sales_orders: sales_orders_val,
      invoices: invoices_val,
      enquiry_to_quote_rate,
      quote_to_order_rate,
      order_to_invoice_rate
    };
    res.json(funnel);
  } catch (error) {
    console.error("Error fetching conversion funnel:", error);
    res.status(500).json({ error: "Failed to fetch conversion funnel" });
  }
});
router7.get("/inventory", async (req, res) => {
  try {
    const inventoryStats = await db.execute(sql18`
      SELECT 
        COUNT(DISTINCT i.id)::text as total_items,
        COALESCE(SUM(CASE WHEN ii.quantity < 10 THEN 1 ELSE 0 END), 0)::text as low_stock_items,
        COALESCE(SUM(CASE WHEN ii.quantity = 0 THEN 1 ELSE 0 END), 0)::text as out_of_stock_items,
        COALESCE(SUM(ii.quantity * i.unit_price), 0)::text as total_inventory_value
      FROM items i
      LEFT JOIN inventory_items ii ON i.id = ii.item_id
    `);
    const categoryBreakdown = await db.execute(sql18`
      SELECT 
        COALESCE(i.category, 'Uncategorized') as category,
        COUNT(i.id)::text as count,
        COALESCE(SUM(ii.quantity * i.unit_price), 0)::text as value
      FROM items i
      LEFT JOIN inventory_items ii ON i.id = ii.item_id
      GROUP BY i.category
      ORDER BY value DESC
    `);
    const stockMovements2 = await db.execute(sql18`
      SELECT 
        DATE(created_at) as date,
        SUM(CASE WHEN movement_type = 'IN' THEN quantity ELSE 0 END)::text as receipts,
        SUM(CASE WHEN movement_type = 'OUT' THEN quantity ELSE 0 END)::text as issues,
        SUM(CASE WHEN movement_type = 'ADJUSTMENT' THEN quantity ELSE 0 END)::text as adjustments
      FROM stock_movements
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `);
    const stats = inventoryStats.rows?.[0] || {};
    res.json({
      total_items: parseInt(stats.total_items || "0"),
      total_quantity: 0,
      // This would need to be calculated from inventory_items
      total_inventory_value: parseFloat(stats.total_inventory_value || "0"),
      low_stock_items: parseInt(stats.low_stock_items || "0"),
      out_of_stock_items: parseInt(stats.out_of_stock_items || "0"),
      high_value_items: 0,
      // Could be calculated based on value threshold
      category_breakdown: categoryBreakdown.rows?.map((row) => ({
        category: row.category,
        count: parseInt(row.count || "0"),
        value: parseFloat(row.value || "0")
      })) || [],
      stock_movements: stockMovements2.rows?.map((row) => ({
        date: row.date,
        receipts: parseInt(row.receipts || "0"),
        issues: parseInt(row.issues || "0"),
        adjustments: parseInt(row.adjustments || "0")
      })) || []
    });
  } catch (error) {
    console.error("Error fetching inventory analytics:", error);
    res.json({
      total_items: 0,
      total_quantity: 0,
      total_inventory_value: 0,
      low_stock_items: 0,
      out_of_stock_items: 0,
      high_value_items: 0,
      category_breakdown: [],
      stock_movements: []
    });
  }
});
router7.get("/suppliers", async (req, res) => {
  try {
    const supplierStats = await db.select({
      total_suppliers: count6(),
      active_suppliers: sql18`COUNT(CASE WHEN is_active = true THEN 1 END)`
    }).from(suppliers4);
    const topSuppliers = await db.execute(sql18`
      SELECT 
        s.id,
        s.name,
        COUNT(slo.id)::text as order_count,
        COALESCE(SUM(slo.total_amount), 0)::text as total_value,
        COALESCE(AVG(EXTRACT(days FROM (slo.expected_delivery_date - slo.created_at))), 0)::text as avg_delivery_time,
        4.5 as quality_rating
      FROM suppliers s
      LEFT JOIN supplier_lpos slo ON s.id = slo.supplier_id
      WHERE s.name != '' AND s.name IS NOT NULL
      GROUP BY s.id, s.name
      HAVING COUNT(slo.id) > 0
      ORDER BY total_value DESC
      LIMIT 10
    `);
    const supplierPerformance = await db.execute(sql18`
      SELECT 
        s.id as supplier_id,
        s.name,
        COALESCE(
          ROUND(
            (COUNT(CASE WHEN slo.status = 'Received' AND slo.expected_delivery_date >= slo.updated_at THEN 1 END) * 100.0 / 
             NULLIF(COUNT(CASE WHEN slo.status = 'Received' THEN 1 END), 0)
            ), 2
          ), 0
        ) as on_time_delivery,
        4.2 as quality_score,
        85.5 as cost_efficiency
      FROM suppliers s
      LEFT JOIN supplier_lpos slo ON s.id = slo.supplier_id
      WHERE s.name != '' AND s.name IS NOT NULL
      GROUP BY s.id, s.name
      HAVING COUNT(slo.id) > 0
      ORDER BY on_time_delivery DESC
      LIMIT 10
    `);
    const stats = supplierStats[0] || { total_suppliers: 0, active_suppliers: 0 };
    res.json({
      total_suppliers: stats.total_suppliers,
      active_suppliers: stats.active_suppliers,
      top_suppliers: topSuppliers.rows?.map((row) => ({
        id: row.id,
        name: row.name,
        order_count: parseInt(row.order_count || "0"),
        total_value: parseFloat(row.total_value || "0"),
        avg_delivery_time: parseFloat(row.avg_delivery_time || "0"),
        quality_rating: parseFloat(row.quality_rating || "4.5")
      })) || [],
      supplier_performance: supplierPerformance.rows?.map((row) => ({
        supplier_id: row.supplier_id,
        name: row.name,
        on_time_delivery: parseFloat(row.on_time_delivery || "0"),
        quality_score: parseFloat(row.quality_score || "4.2"),
        cost_efficiency: parseFloat(row.cost_efficiency || "85.5")
      })) || []
    });
  } catch (error) {
    console.error("Error fetching supplier analytics:", error);
    res.json({
      total_suppliers: 0,
      active_suppliers: 0,
      top_suppliers: [],
      supplier_performance: []
    });
  }
});
router7.get("/financial", async (req, res) => {
  try {
    const totalRevenueResult = await db.select({
      revenue: sql18`COALESCE(SUM(total_amount), 0)`
    }).from(invoices3).where(eq25(invoices3.status, "Paid"));
    const totalOutstandingResult = await db.select({
      outstanding: sql18`COALESCE(SUM(outstanding_amount), 0)`
    }).from(invoices3);
    const revenueByType = await db.execute(sql18`
      SELECT 
        c.customer_type,
        COALESCE(SUM(i.total_amount), 0)::text as revenue
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      WHERE i.status = 'Paid'
      GROUP BY c.customer_type
    `);
    const invoiceTotals = await db.select({
      total_invoice_value: sql18`COALESCE(SUM(total_amount), 0)`,
      total_paid_amount: sql18`COALESCE(SUM(paid_amount), 0)`
    }).from(invoices3);
    const avgOrderValue = await db.select({
      avg_value: sql18`COALESCE(AVG(total_amount), 0)`
    }).from(salesOrders2);
    const monthlyGrowth = await db.execute(sql18`
      WITH monthly_revenue AS (
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          SUM(total_amount) as revenue
        FROM invoices 
        WHERE status = 'Paid' AND created_at >= NOW() - INTERVAL '2 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
        LIMIT 2
      )
      SELECT 
        CASE 
          WHEN LAG(revenue) OVER (ORDER BY month) > 0 THEN
            ROUND(((revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month)) * 100, 2)
          ELSE 0
        END as growth_rate
      FROM monthly_revenue
      ORDER BY month DESC
      LIMIT 1
    `);
    const totalRevenue = totalRevenueResult[0]?.revenue || 0;
    const totalOutstanding = totalOutstandingResult[0]?.outstanding || 0;
    const totalInvoiceValue = invoiceTotals[0]?.total_invoice_value || 0;
    const totalPaidAmount = invoiceTotals[0]?.total_paid_amount || 0;
    const grossProfit = totalPaidAmount * 0.3;
    const grossMargin = totalPaidAmount > 0 ? grossProfit / totalPaidAmount * 100 : 0;
    const retailRevenue = revenueByType.rows?.find((r) => r.customer_type === "Retail")?.revenue || 0;
    const wholesaleRevenue = revenueByType.rows?.find((r) => r.customer_type === "Wholesale")?.revenue || 0;
    res.json({
      revenue: {
        total_revenue: totalRevenue,
        retail_revenue: parseFloat(retailRevenue || "0"),
        wholesale_revenue: parseFloat(wholesaleRevenue || "0"),
        monthly_growth: monthlyGrowth.rows?.[0]?.growth_rate || 0
      },
      costs: {
        total_costs: totalInvoiceValue - totalPaidAmount,
        cost_of_goods_sold: totalPaidAmount * 0.7,
        // Assuming 70% COGS
        operating_costs: totalPaidAmount * 0.1
        // Assuming 10% operating costs
      },
      profitability: {
        gross_profit: grossProfit,
        gross_margin: grossMargin,
        net_profit: grossProfit * 0.8,
        // Assuming 80% of gross profit is net
        net_margin: grossMargin * 0.8
      },
      pricing_analysis: {
        avg_retail_markup: 80,
        avg_wholesale_markup: 40,
        price_variance: 5.2
      },
      totalRevenue,
      totalOutstanding,
      profitMargin: grossMargin,
      avgOrderValue: avgOrderValue[0]?.avg_value || 0
    });
  } catch (error) {
    console.error("Error fetching financial analytics:", error);
    res.status(500).json({ error: "Failed to fetch financial analytics" });
  }
});
router7.get("/audit-trail", async (req, res) => {
  try {
    const userActivity = await db.execute(sql18`
      WITH user_actions AS (
        SELECT 
          created_by as user_id,
          'Enquiry' as action_type,
          created_at
        FROM enquiries 
        WHERE created_by IS NOT NULL AND created_at >= NOW() - INTERVAL '30 days'
        
        UNION ALL
        
        SELECT 
          created_by as user_id,
          'Quotation' as action_type,
          created_at
        FROM quotations 
        WHERE created_by IS NOT NULL AND created_at >= NOW() - INTERVAL '30 days'
        
        UNION ALL
        
        SELECT 
          created_by as user_id,
          'Sales Order' as action_type,
          created_at
        FROM sales_orders 
        WHERE created_by IS NOT NULL AND created_at >= NOW() - INTERVAL '30 days'
      )
      SELECT 
        ua.user_id,
        COALESCE(u.username, 'Unknown User') as user_name,
        COUNT(*)::text as action_count,
        MAX(ua.created_at) as last_activity
      FROM user_actions ua
      LEFT JOIN users u ON ua.user_id = u.id
      GROUP BY ua.user_id, u.username
      ORDER BY action_count DESC
      LIMIT 10
    `);
    const criticalActions = await db.execute(sql18`
      SELECT 
        'High Value Quotation' as action,
        COUNT(*)::text as count,
        MAX(created_at) as last_occurred
      FROM quotations 
      WHERE total_amount > 10000 AND created_at >= NOW() - INTERVAL '30 days'
      
      UNION ALL
      
      SELECT 
        'Large Sales Order' as action,
        COUNT(*)::text as count,
        MAX(created_at) as last_occurred
      FROM sales_orders 
      WHERE total_amount > 15000 AND created_at >= NOW() - INTERVAL '30 days'
      
      ORDER BY count DESC
    `);
    const totalActions = await db.execute(sql18`
      SELECT COUNT(*) as total FROM (
        SELECT created_at FROM enquiries WHERE created_at >= NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT created_at FROM quotations WHERE created_at >= NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT created_at FROM sales_orders WHERE created_at >= NOW() - INTERVAL '30 days'
      ) as all_actions
    `);
    const completedActions = await db.execute(sql18`
      SELECT COUNT(*) as completed FROM (
        SELECT created_at FROM enquiries WHERE status != 'New' AND created_at >= NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT created_at FROM quotations WHERE status != 'Draft' AND created_at >= NOW() - INTERVAL '30 days'
        UNION ALL
        SELECT created_at FROM sales_orders WHERE status != 'Draft' AND created_at >= NOW() - INTERVAL '30 days'
      ) as completed_actions
    `);
    const total = parseInt(totalActions.rows?.[0]?.total || "0");
    const completed = parseInt(completedActions.rows?.[0]?.completed || "0");
    const complianceScore = total > 0 ? Math.round(completed / total * 100) : 95;
    res.json({
      total_actions: total,
      user_activity: userActivity.rows?.map((row) => ({
        user_id: row.user_id,
        user_name: row.user_name,
        action_count: parseInt(row.action_count || "0"),
        last_activity: row.last_activity
      })) || [],
      critical_actions: criticalActions.rows?.map((row) => ({
        action: row.action,
        count: parseInt(row.count || "0"),
        last_occurred: row.last_occurred
      })) || [],
      compliance_score: complianceScore
    });
  } catch (error) {
    console.error("Error fetching audit trail analytics:", error);
    res.json({
      total_actions: 0,
      user_activity: [],
      critical_actions: [],
      compliance_score: 95
    });
  }
});
router7.get("/enquiry-sources", async (req, res) => {
  try {
    const enquirySourcesData = await db.execute(sql18`
      SELECT 
        source,
        COUNT(*)::text as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM enquiries)), 2) as percentage
      FROM enquiries 
      GROUP BY source
      ORDER BY count DESC
    `);
    const sourcePerformance = await db.execute(sql18`
      SELECT 
        e.source,
        COUNT(DISTINCT e.id)::text as enquiry_count,
        COUNT(DISTINCT q.id)::text as quotation_count,
        CASE 
          WHEN COUNT(DISTINCT e.id) > 0 THEN
            ROUND((COUNT(DISTINCT q.id) * 100.0 / COUNT(DISTINCT e.id)), 2)
          ELSE 0
        END as conversion_rate,
        COALESCE(AVG(q.total_amount), 0)::text as avg_value
      FROM enquiries e
      LEFT JOIN quotations q ON e.id = q.enquiry_id
      GROUP BY e.source
      ORDER BY conversion_rate DESC
    `);
    const formattedSources = {};
    enquirySourcesData.rows?.forEach((row) => {
      formattedSources[row.source.toLowerCase().replace(/[\s-]/g, "_")] = parseInt(row.count);
    });
    res.json({
      email: formattedSources.email || 0,
      phone: formattedSources.phone || 0,
      web_form: formattedSources.web_form || 0,
      walk_in: formattedSources["walk-in"] || 0,
      referral: formattedSources.referral || 0,
      source_performance: sourcePerformance.rows?.map((row) => ({
        source: row.source,
        conversion_rate: parseFloat(row.conversion_rate) || 0,
        avg_value: parseFloat(row.avg_value) || 0
      })) || []
    });
  } catch (error) {
    console.error("Error fetching enquiry source analytics:", error);
    res.status(500).json({ error: "Failed to fetch enquiry source analytics" });
  }
});

// server/routes/recent-activities.ts
var mockActivities = [
  {
    id: "1",
    type: "quotation",
    action: "created",
    title: "New Quotation Created",
    description: "Quotation QT-2024-015 created for Al Rawi Trading",
    entityId: "QT-2024-015",
    entityName: "Al Rawi Trading",
    userId: "user-001",
    userName: "Ahmed Al-Mansouri",
    timestamp: new Date(Date.now() - 2 * 60 * 1e3).toISOString(),
    status: "Draft",
    priority: "medium"
  },
  {
    id: "2",
    type: "enquiry",
    action: "received",
    title: "New Enquiry Received",
    description: "Enquiry ENQ-2024-089 received from Gulf Construction Co.",
    entityId: "ENQ-2024-089",
    entityName: "Gulf Construction Co.",
    userId: "system",
    userName: "System",
    timestamp: new Date(Date.now() - 15 * 60 * 1e3).toISOString(),
    status: "New",
    priority: "high"
  },
  {
    id: "3",
    type: "sales_order",
    action: "approved",
    title: "Sales Order Approved",
    description: "Sales Order SO-2024-012 approved and ready for processing",
    entityId: "SO-2024-012",
    entityName: "Al Rawi Trading",
    userId: "user-002",
    userName: "Sarah Johnson",
    timestamp: new Date(Date.now() - 30 * 60 * 1e3).toISOString(),
    status: "Approved",
    priority: "high"
  },
  {
    id: "4",
    type: "goods_receipt",
    action: "completed",
    title: "Goods Receipt Completed",
    description: "Goods received for LPO-SUP-001 from ABC Suppliers",
    entityId: "GR-2024-008",
    entityName: "ABC Suppliers",
    userId: "user-003",
    userName: "Mohammed Hassan",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString(),
    status: "Completed",
    priority: "medium"
  },
  {
    id: "5",
    type: "invoice",
    action: "sent",
    title: "Invoice Sent",
    description: "Invoice INV-2024-045 sent to customer",
    entityId: "INV-2024-045",
    entityName: "Al Rawi Trading",
    userId: "user-001",
    userName: "Ahmed Al-Mansouri",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1e3).toISOString(),
    status: "Sent",
    priority: "low"
  },
  {
    id: "6",
    type: "delivery",
    action: "completed",
    title: "Delivery Completed",
    description: "Delivery DEL-2024-023 completed successfully",
    entityId: "DEL-2024-023",
    entityName: "Gulf Construction Co.",
    userId: "user-004",
    userName: "Ali Al-Rashid",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1e3).toISOString(),
    status: "Delivered",
    priority: "medium"
  },
  {
    id: "7",
    type: "inventory",
    action: "updated",
    title: "Inventory Updated",
    description: "Stock levels updated for Steel Beams (Item #STB-001)",
    entityId: "STB-001",
    entityName: "Steel Beams",
    userId: "user-003",
    userName: "Mohammed Hassan",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1e3).toISOString(),
    status: "Updated",
    priority: "low"
  },
  {
    id: "8",
    type: "customer",
    action: "created",
    title: "New Customer Added",
    description: "New customer 'Dubai Steel Works' added to the system",
    entityId: "CUST-2024-012",
    entityName: "Dubai Steel Works",
    userId: "user-002",
    userName: "Sarah Johnson",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1e3).toISOString(),
    status: "Active",
    priority: "medium"
  },
  {
    id: "9",
    type: "quotation",
    action: "accepted",
    title: "Quotation Accepted",
    description: "Quotation QT-2024-010 accepted by customer",
    entityId: "QT-2024-010",
    entityName: "Emirates Construction",
    userId: "system",
    userName: "System",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1e3).toISOString(),
    status: "Accepted",
    priority: "high"
  },
  {
    id: "10",
    type: "purchase_order",
    action: "created",
    title: "Purchase Order Created",
    description: "Purchase Order PO-2024-007 created for supplier",
    entityId: "PO-2024-007",
    entityName: "Steel Suppliers Ltd",
    userId: "user-001",
    userName: "Ahmed Al-Mansouri",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1e3).toISOString(),
    status: "Created",
    priority: "medium"
  }
];
var mockStats = {
  total: 1250,
  today: 45,
  thisWeek: 320,
  thisMonth: 1250,
  byType: [
    { type: "enquiry", count: 180, percentage: 14.4 },
    { type: "quotation", count: 220, percentage: 17.6 },
    { type: "sales_order", count: 190, percentage: 15.2 },
    { type: "invoice", count: 165, percentage: 13.2 },
    { type: "purchase_order", count: 140, percentage: 11.2 },
    { type: "goods_receipt", count: 120, percentage: 9.6 },
    { type: "delivery", count: 110, percentage: 8.8 },
    { type: "inventory", count: 85, percentage: 6.8 },
    { type: "customer", count: 25, percentage: 2 },
    { type: "supplier", count: 15, percentage: 1.2 }
  ],
  byUser: [
    { userId: "user-001", userName: "Ahmed Al-Mansouri", count: 320 },
    { userId: "user-002", userName: "Sarah Johnson", count: 280 },
    { userId: "user-003", userName: "Mohammed Hassan", count: 250 },
    { userId: "user-004", userName: "Ali Al-Rashid", count: 200 },
    { userId: "system", userName: "System", count: 200 }
  ]
};
function registerRecentActivitiesRoutes(app2) {
  app2.get("/api/recent-activities", async (req, res) => {
    try {
      const {
        type,
        action,
        userId,
        startDate,
        endDate,
        search,
        priority,
        page = "1",
        limit = "50"
      } = req.query;
      let filteredActivities = [...mockActivities];
      if (type) {
        filteredActivities = filteredActivities.filter((activity) => activity.type === type);
      }
      if (action) {
        filteredActivities = filteredActivities.filter((activity) => activity.action === action);
      }
      if (userId) {
        filteredActivities = filteredActivities.filter((activity) => activity.userId === userId);
      }
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredActivities = filteredActivities.filter(
          (activity) => activity.title.toLowerCase().includes(searchTerm) || activity.description.toLowerCase().includes(searchTerm) || activity.entityId.toLowerCase().includes(searchTerm) || activity.entityName && activity.entityName.toLowerCase().includes(searchTerm)
        );
      }
      if (priority) {
        filteredActivities = filteredActivities.filter((activity) => activity.priority === priority);
      }
      if (startDate || endDate) {
        filteredActivities = filteredActivities.filter((activity) => {
          const activityDate = new Date(activity.timestamp);
          if (startDate) {
            const start = new Date(startDate);
            if (activityDate < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (activityDate > end) return false;
          }
          return true;
        });
      }
      filteredActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedActivities = filteredActivities.slice(startIndex, endIndex);
      const totalPages = Math.ceil(filteredActivities.length / limitNum);
      res.json({
        activities: paginatedActivities,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredActivities.length,
          pages: totalPages
        }
      });
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      res.status(500).json({ error: "Failed to fetch recent activities" });
    }
  });
  app2.get("/api/recent-activities/stats", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let stats = { ...mockStats };
      if (startDate || endDate) {
        let filteredActivities = [...mockActivities];
        if (startDate || endDate) {
          filteredActivities = filteredActivities.filter((activity) => {
            const activityDate = new Date(activity.timestamp);
            if (startDate) {
              const start = new Date(startDate);
              if (activityDate < start) return false;
            }
            if (endDate) {
              const end = new Date(endDate);
              end.setHours(23, 59, 59, 999);
              if (activityDate > end) return false;
            }
            return true;
          });
        }
        const today = /* @__PURE__ */ new Date();
        const weekAgo = /* @__PURE__ */ new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthAgo = /* @__PURE__ */ new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        stats = {
          total: filteredActivities.length,
          today: filteredActivities.filter((a) => {
            const activityDate = new Date(a.timestamp);
            return activityDate.toDateString() === today.toDateString();
          }).length,
          thisWeek: filteredActivities.filter((a) => new Date(a.timestamp) >= weekAgo).length,
          thisMonth: filteredActivities.filter((a) => new Date(a.timestamp) >= monthAgo).length,
          byType: [],
          byUser: []
        };
        const typeCounts = {};
        filteredActivities.forEach((activity) => {
          typeCounts[activity.type] = (typeCounts[activity.type] || 0) + 1;
        });
        stats.byType = Object.entries(typeCounts).map(([type, count7]) => ({
          type,
          count: count7,
          percentage: count7 / filteredActivities.length * 100
        }));
        const userCounts = {};
        filteredActivities.forEach((activity) => {
          if (!userCounts[activity.userId]) {
            userCounts[activity.userId] = { name: activity.userName, count: 0 };
          }
          userCounts[activity.userId].count++;
        });
        stats.byUser = Object.entries(userCounts).map(([userId, data]) => ({
          userId,
          userName: data.name,
          count: data.count
        }));
      }
      res.json(stats);
    } catch (error) {
      console.error("Error fetching activity stats:", error);
      res.status(500).json({ error: "Failed to fetch activity statistics" });
    }
  });
  app2.get("/api/recent-activities/export", async (req, res) => {
    try {
      const { type, action, userId, startDate, endDate, search, priority } = req.query;
      let filteredActivities = [...mockActivities];
      if (type) {
        filteredActivities = filteredActivities.filter((activity) => activity.type === type);
      }
      if (action) {
        filteredActivities = filteredActivities.filter((activity) => activity.action === action);
      }
      if (userId) {
        filteredActivities = filteredActivities.filter((activity) => activity.userId === userId);
      }
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredActivities = filteredActivities.filter(
          (activity) => activity.title.toLowerCase().includes(searchTerm) || activity.description.toLowerCase().includes(searchTerm) || activity.entityId.toLowerCase().includes(searchTerm) || activity.entityName && activity.entityName.toLowerCase().includes(searchTerm)
        );
      }
      if (priority) {
        filteredActivities = filteredActivities.filter((activity) => activity.priority === priority);
      }
      if (startDate || endDate) {
        filteredActivities = filteredActivities.filter((activity) => {
          const activityDate = new Date(activity.timestamp);
          if (startDate) {
            const start = new Date(startDate);
            if (activityDate < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (activityDate > end) return false;
          }
          return true;
        });
      }
      filteredActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const csvHeader = [
        "Timestamp",
        "Type",
        "Action",
        "Title",
        "Description",
        "Entity ID",
        "Entity Name",
        "User ID",
        "User Name",
        "Status",
        "Priority"
      ].join(",");
      const csvRows = filteredActivities.map((activity) => [
        new Date(activity.timestamp).toISOString(),
        activity.type,
        activity.action,
        `"${activity.title.replace(/"/g, '""')}"`,
        `"${activity.description.replace(/"/g, '""')}"`,
        activity.entityId,
        activity.entityName || "",
        activity.userId,
        activity.userName,
        activity.status || "",
        activity.priority || ""
      ].join(","));
      const csvContent = [csvHeader, ...csvRows].join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="recent-activities-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv"`);
      res.send(csvContent);
    } catch (error) {
      console.error("Error exporting activities:", error);
      res.status(500).json({ error: "Failed to export activities" });
    }
  });
}

// server/routes/auth.ts
init_db();
import express from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import ConnectPGSimple from "connect-pg-simple";
import { eq as eq26 } from "drizzle-orm";
var strategyInitialized = false;
function registerAuthRoutes(app2) {
  const PgStore = ConnectPGSimple(session);
  if (!app2._authInitialized) {
    app2.use(session({
      store: new PgStore({
        conString: process.env.DATABASE_URL,
        tableName: "session",
        createTableIfMissing: true
      }),
      secret: process.env.SESSION_SECRET || "dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 1e3 * 60 * 60 * 8
        // 8h
      }
    }));
    app2.use(passport.initialize());
    app2.use(passport.session());
    if (!strategyInitialized) {
      passport.use(new LocalStrategy(async (username, password, done) => {
        try {
          const row = await db.select().from(users2).where(eq26(users2.username, username)).limit(1);
          const user = row[0];
          if (!user) return done(null, false, { message: "Invalid credentials" });
          if (!user.passwordHash) return done(null, false, { message: "User has no password set" });
          const ok = await bcrypt.compare(password, user.passwordHash);
          if (!ok) return done(null, false, { message: "Invalid credentials" });
          return done(null, { id: user.id, username: user.username, role: user.role });
        } catch (e) {
          return done(e);
        }
      }));
      passport.serializeUser((user, done) => done(null, user.id));
      passport.deserializeUser(async (id, done) => {
        try {
          const row = await db.select().from(users2).where(eq26(users2.id, id)).limit(1);
          const user = row[0];
          if (!user) return done(null, false);
          done(null, { id: user.id, username: user.username, role: user.role });
        } catch (e) {
          done(e);
        }
      });
      strategyInitialized = true;
    }
    app2._authInitialized = true;
  }
  const router13 = express.Router();
  router13.post("/register", async (req, res) => {
    try {
      const { username, password, email, role } = req.body;
      if (!username || !password) return res.status(400).json({ message: "Username & password required" });
      const existing = await db.select().from(users2).where(eq26(users2.username, username)).limit(1);
      if (existing.length) return res.status(409).json({ message: "Username already exists" });
      const hash = await bcrypt.hash(password, 10);
      const inserted = await db.insert(users2).values({ username, email, role: role || "user", passwordHash: hash }).returning();
      res.status(201).json({ id: inserted[0].id, username, role: inserted[0].role });
    } catch (e) {
      console.error("Register error", e);
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  router13.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Login failed" });
      req.logIn(user, (err2) => {
        if (err2) return next(err2);
        return res.json({ user });
      });
    })(req, res, next);
  });
  router13.post("/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out" });
    });
  });
  router13.get("/me", (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    res.json({ user: req.user });
  });
  router13.get("/secure-check", (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    res.json({ message: "Access granted", user: req.user });
  });
  app2.use("/api/auth", router13);
}

// server/routes/files.ts
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
var uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
var storage3 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});
var upload = multer({
  storage: storage3,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  }
});
function registerFileRoutes(app2) {
  app2.post("/api/files/upload", upload.array("files", 10), async (req, res) => {
    try {
      console.log("File upload request received");
      console.log("Content-Type:", req.headers["content-type"]);
      console.log("req.files:", req.files);
      let files = [];
      if (req.files && Array.isArray(req.files)) {
        files = req.files;
      } else if (req.file) {
        files = [req.file];
      }
      console.log("Files processed:", files.length);
      if (files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      const uploadedFiles = files.map((file) => ({
        id: path.parse(file.filename).name,
        // UUID without extension
        name: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: `/api/files/download/${file.filename}`,
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
      }));
      console.log("Responding with uploaded files:", uploadedFiles);
      res.json({
        message: "Files uploaded successfully",
        files: uploadedFiles
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ message: "Failed to upload files", error: error.message });
    }
  });
  app2.get("/api/files/download/:filename", (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(uploadsDir, filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }
      const realPath = fs.realpathSync(filePath);
      const realUploadsDir = fs.realpathSync(uploadsDir);
      if (!realPath.startsWith(realUploadsDir)) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });
  app2.get("/api/files/info/:filename", (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(uploadsDir, filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }
      const stats = fs.statSync(filePath);
      res.json({
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      });
    } catch (error) {
      console.error("Error getting file info:", error);
      res.status(500).json({ message: "Failed to get file info" });
    }
  });
  app2.delete("/api/files/:filename", (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(uploadsDir, filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }
      const realPath = fs.realpathSync(filePath);
      const realUploadsDir = fs.realpathSync(uploadsDir);
      if (!realPath.startsWith(realUploadsDir)) {
        return res.status(403).json({ message: "Access denied" });
      }
      fs.unlinkSync(filePath);
      res.json({ message: "File deleted successfully" });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ message: "Failed to delete file" });
    }
  });
}

// server/routes/table-validation.ts
init_db();
import { Router as Router8 } from "express";
import { sql as sql20 } from "drizzle-orm";

// server/utils/database-validator.ts
init_db();
import { sql as sql19 } from "drizzle-orm";
var DatabaseValidator = class _DatabaseValidator {
  static instance;
  static getInstance() {
    if (!_DatabaseValidator.instance) {
      _DatabaseValidator.instance = new _DatabaseValidator();
    }
    return _DatabaseValidator.instance;
  }
  /**
   * Get all tables in the database
   */
  async getAllTables() {
    try {
      const result = await db.execute(sql19`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      return result.rows.map((row) => row.table_name);
    } catch (error) {
      console.error("Error fetching tables:", error);
      throw error;
    }
  }
  /**
   * Validate a single table
   */
  async validateTable(tableName) {
    const result = {
      tableName,
      exists: false,
      rowCount: 0,
      hasData: false,
      issues: [],
      warnings: [],
      recommendations: [],
      isValid: true
    };
    try {
      const existsResult = await db.execute(sql19`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${tableName}
        )
      `);
      result.exists = Boolean(existsResult.rows[0].exists);
      if (!result.exists) {
        result.issues.push("Table does not exist");
        result.isValid = false;
        return result;
      }
      const countResult = await db.execute(sql19.raw(`SELECT COUNT(*) as count FROM "${tableName}"`));
      result.rowCount = parseInt(String(countResult.rows[0].count));
      result.hasData = result.rowCount > 0;
      await this.checkTableIssues(tableName, result);
      this.generateRecommendations(result);
    } catch (error) {
      result.issues.push(`Error validating table: ${error instanceof Error ? error.message : "Unknown error"}`);
      result.isValid = false;
    }
    return result;
  }
  /**
   * Check for common table issues
   */
  async checkTableIssues(tableName, result) {
    try {
      const pkResult = await db.execute(sql19`
        SELECT COUNT(*) as count
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = ${tableName}
        AND tc.constraint_type = 'PRIMARY KEY'
      `);
      if (parseInt(String(pkResult.rows[0].count)) === 0) {
        result.issues.push("Missing primary key");
        result.isValid = false;
      }
      const timestampResult = await db.execute(sql19`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = ${tableName}
        AND column_name IN ('created_at', 'updated_at')
      `);
      const timestampColumns = timestampResult.rows.map((row) => row.column_name);
      if (!timestampColumns.includes("created_at")) {
        result.warnings.push("Missing created_at column");
      }
      if (!timestampColumns.includes("updated_at")) {
        result.warnings.push("Missing updated_at column");
      }
      await this.checkOrphanedForeignKeys(tableName, result);
      if (result.hasData) {
        await this.checkDuplicateRows(tableName, result);
      }
      await this.checkNullValues(tableName, result);
    } catch (error) {
      result.warnings.push(`Could not perform all checks: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  /**
   * Check for orphaned foreign keys
   */
  async checkOrphanedForeignKeys(tableName, result) {
    try {
      const fkResult = await db.execute(sql19`
        SELECT 
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = ${tableName}
      `);
      for (const fk of fkResult.rows) {
        const orphanedResult = await db.execute(sql19.raw(`
          SELECT COUNT(*) as count
          FROM "${tableName}" t
          WHERE t."${fk.column_name}" IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM "${fk.foreign_table_name}" f
            WHERE f."${fk.foreign_column_name}" = t."${fk.column_name}"
          )
        `));
        const orphanedCount = parseInt(String(orphanedResult.rows[0].count));
        if (orphanedCount > 0) {
          result.issues.push(`Found ${orphanedCount} orphaned records in ${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`);
          result.isValid = false;
        }
      }
    } catch (error) {
      result.warnings.push(`Could not check foreign key constraints: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  /**
   * Check for duplicate rows
   */
  async checkDuplicateRows(tableName, result) {
    try {
      const pkResult = await db.execute(sql19`
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = ${tableName}
        AND tc.constraint_type = 'PRIMARY KEY'
        ORDER BY kcu.ordinal_position
      `);
      if (pkResult.rows.length > 0) {
        const pkColumns = pkResult.rows.map((row) => `"${row.column_name}"`).join(", ");
        const duplicateResult = await db.execute(sql19.raw(`
          SELECT COUNT(*) as count
          FROM (
            SELECT ${pkColumns}, COUNT(*) as cnt
            FROM "${tableName}"
            GROUP BY ${pkColumns}
            HAVING COUNT(*) > 1
          ) duplicates
        `));
        const duplicateCount = parseInt(String(duplicateResult.rows[0].count));
        if (duplicateCount > 0) {
          result.issues.push(`Found ${duplicateCount} duplicate primary key combinations`);
          result.isValid = false;
        }
      }
    } catch (error) {
      result.warnings.push(`Could not check for duplicates: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  /**
   * Check for NULL values in required fields
   */
  async checkNullValues(tableName, result) {
    try {
      const nullResult = await db.execute(sql19`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = ${tableName}
        AND is_nullable = 'NO'
        AND column_default IS NULL
      `);
      for (const column of nullResult.rows) {
        const nullCountResult = await db.execute(sql19.raw(`
          SELECT COUNT(*) as count
          FROM "${tableName}"
          WHERE "${column.column_name}" IS NULL
        `));
        const nullCount = parseInt(String(nullCountResult.rows[0].count));
        if (nullCount > 0) {
          result.issues.push(`Found ${nullCount} NULL values in required column ${column.column_name}`);
          result.isValid = false;
        }
      }
    } catch (error) {
      result.warnings.push(`Could not check for NULL values: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  /**
   * Generate recommendations based on validation results
   */
  generateRecommendations(result) {
    if (!result.hasData) {
      result.recommendations.push("Consider adding sample data for testing");
    }
    if (result.warnings.some((w) => w.includes("created_at"))) {
      result.recommendations.push("Add created_at column for audit trail");
    }
    if (result.warnings.some((w) => w.includes("updated_at"))) {
      result.recommendations.push("Add updated_at column for change tracking");
    }
    if (result.rowCount > 1e4) {
      result.recommendations.push("Consider adding indexes for better performance");
    }
    if (result.issues.length === 0 && result.warnings.length === 0) {
      result.recommendations.push("Table is in good condition");
    }
  }
  /**
   * Validate all tables in the database
   */
  async validateAllTables() {
    const startTime = Date.now();
    const tables = await this.getAllTables();
    const tableResults = [];
    console.log(`Starting validation of ${tables.length} tables...`);
    for (const tableName of tables) {
      console.log(`Validating table: ${tableName}`);
      const result = await this.validateTable(tableName);
      tableResults.push(result);
    }
    const validTables = tableResults.filter((r) => r.isValid).length;
    const tablesWithIssues = tableResults.filter((r) => !r.isValid).length;
    const totalIssues = tableResults.reduce((sum4, r) => sum4 + r.issues.length, 0);
    const totalRows = tableResults.reduce((sum4, r) => sum4 + r.rowCount, 0);
    let overallHealth;
    if (tablesWithIssues === 0 && totalIssues === 0) {
      overallHealth = "excellent";
    } else if (tablesWithIssues <= 2 && totalIssues <= 5) {
      overallHealth = "good";
    } else if (tablesWithIssues <= 5 && totalIssues <= 15) {
      overallHealth = "fair";
    } else {
      overallHealth = "poor";
    }
    const recommendations = this.generateOverallRecommendations(tableResults);
    const report = {
      overallHealth,
      totalTables: tables.length,
      validTables,
      tablesWithIssues,
      totalRows,
      totalIssues,
      tableResults,
      recommendations,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    const duration = Date.now() - startTime;
    console.log(`Validation completed in ${duration}ms`);
    console.log(`Overall health: ${overallHealth}`);
    console.log(`Valid tables: ${validTables}/${tables.length}`);
    console.log(`Total issues: ${totalIssues}`);
    return report;
  }
  /**
   * Generate overall recommendations
   */
  generateOverallRecommendations(tableResults) {
    const recommendations = [];
    const tablesWithoutData = tableResults.filter((r) => !r.hasData).length;
    if (tablesWithoutData > 0) {
      recommendations.push(`${tablesWithoutData} tables are empty - consider adding sample data`);
    }
    const tablesWithOrphanedData = tableResults.filter(
      (r) => r.issues.some((i) => i.includes("orphaned"))
    ).length;
    if (tablesWithOrphanedData > 0) {
      recommendations.push(`${tablesWithOrphanedData} tables have orphaned foreign key references - consider cleanup`);
    }
    const tablesWithDuplicates = tableResults.filter(
      (r) => r.issues.some((i) => i.includes("duplicate"))
    ).length;
    if (tablesWithDuplicates > 0) {
      recommendations.push(`${tablesWithDuplicates} tables have duplicate records - consider deduplication`);
    }
    const tablesMissingTimestamps = tableResults.filter(
      (r) => r.warnings.some((w) => w.includes("created_at") || w.includes("updated_at"))
    ).length;
    if (tablesMissingTimestamps > 0) {
      recommendations.push(`${tablesMissingTimestamps} tables are missing audit timestamp columns`);
    }
    if (recommendations.length === 0) {
      recommendations.push("Database is in excellent condition - no major issues found");
    }
    return recommendations;
  }
  /**
   * Fix common issues automatically
   */
  async fixCommonIssues(tableName) {
    const fixed = [];
    const errors = [];
    try {
      const hasCreatedAt = await this.columnExists(tableName, "created_at");
      if (!hasCreatedAt) {
        try {
          await db.execute(sql19.raw(`ALTER TABLE "${tableName}" ADD COLUMN created_at TIMESTAMP DEFAULT NOW()`));
          fixed.push("Added created_at column");
        } catch (error) {
          errors.push(`Failed to add created_at column: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      const hasUpdatedAt = await this.columnExists(tableName, "updated_at");
      if (!hasUpdatedAt) {
        try {
          await db.execute(sql19.raw(`ALTER TABLE "${tableName}" ADD COLUMN updated_at TIMESTAMP DEFAULT NOW()`));
          fixed.push("Added updated_at column");
        } catch (error) {
          errors.push(`Failed to add updated_at column: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
    } catch (error) {
      errors.push(`Error fixing issues for table ${tableName}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    return { fixed, errors };
  }
  /**
   * Check if a column exists in a table
   */
  async columnExists(tableName, columnName) {
    try {
      const result = await db.execute(sql19`
        SELECT EXISTS (
          SELECT FROM information_schema.columns
          WHERE table_name = ${tableName}
          AND column_name = ${columnName}
        )
      `);
      return Boolean(result.rows[0].exists);
    } catch (error) {
      return false;
    }
  }
};
var database_validator_default = DatabaseValidator;

// server/routes/table-validation.ts
var router8 = Router8();
router8.get("/tables", async (req, res) => {
  try {
    const tables = await db.execute(sql20`
      SELECT 
        table_name,
        table_type,
        table_schema
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    res.json({
      success: true,
      tables: tables.rows,
      count: tables.rows.length
    });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tables",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router8.get("/tables/:tableName/structure", async (req, res) => {
  try {
    const { tableName } = req.params;
    const columns = await db.execute(sql20`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        ordinal_position
      FROM information_schema.columns 
      WHERE table_name = ${tableName}
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    const constraints = await db.execute(sql20`
      SELECT 
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      LEFT JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.table_name = ${tableName}
      AND tc.table_schema = 'public'
    `);
    const indexes = await db.execute(sql20`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = ${tableName}
      AND schemaname = 'public'
    `);
    res.json({
      success: true,
      tableName,
      columns: columns.rows,
      constraints: constraints.rows,
      indexes: indexes.rows,
      columnCount: columns.rows.length
    });
  } catch (error) {
    console.error(`Error fetching structure for table ${req.params.tableName}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch table structure",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router8.get("/tables/:tableName/data", async (req, res) => {
  try {
    const { tableName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    const countResult = await db.execute(sql20.raw(`SELECT COUNT(*) as total FROM "${tableName}"`));
    const total = parseInt(countResult.rows[0].total);
    const data = await db.execute(sql20.raw(`
      SELECT * FROM "${tableName}" 
      ORDER BY created_at DESC NULLS LAST, id DESC NULLS LAST
      LIMIT ${limit} OFFSET ${offset}
    `));
    res.json({
      success: true,
      tableName,
      data: data.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error(`Error fetching data for table ${req.params.tableName}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch table data",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router8.get("/tables/:tableName/validate", async (req, res) => {
  try {
    const { tableName } = req.params;
    const tableExists = await db.execute(sql20`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
      )
    `);
    if (!tableExists.rows[0].exists) {
      return res.status(404).json({
        success: false,
        error: "Table not found"
      });
    }
    const stats = await db.execute(sql20.raw(`
      SELECT 
        schemaname,
        tablename,
        attname,
        n_distinct,
        correlation,
        most_common_vals,
        most_common_freqs
      FROM pg_stats 
      WHERE tablename = '${tableName}'
    `));
    const orphanedChecks = await db.execute(sql20.raw(`
      SELECT 
        'orphaned_check' as check_type,
        COUNT(*) as count
      FROM "${tableName}" t
      WHERE NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = '${tableName}'
      )
    `));
    const rowCount = await db.execute(sql20.raw(`SELECT COUNT(*) as count FROM "${tableName}"`));
    res.json({
      success: true,
      tableName,
      validation: {
        exists: true,
        rowCount: parseInt(rowCount.rows[0].count),
        statistics: stats.rows,
        orphanedRecords: parseInt(orphanedChecks.rows[0].count),
        isValid: true
      }
    });
  } catch (error) {
    console.error(`Error validating table ${req.params.tableName}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to validate table",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router8.get("/tables/summary", async (req, res) => {
  try {
    const tables = await db.execute(sql20`
      SELECT 
        t.table_name,
        t.table_type,
        COALESCE(s.n_tup_ins, 0) as insert_count,
        COALESCE(s.n_tup_upd, 0) as update_count,
        COALESCE(s.n_tup_del, 0) as delete_count,
        COALESCE(s.n_live_tup, 0) as live_tuples,
        COALESCE(s.n_dead_tup, 0) as dead_tuples,
        s.last_vacuum,
        s.last_autovacuum,
        s.last_analyze,
        s.last_autoanalyze
      FROM information_schema.tables t
      LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
      WHERE t.table_schema = 'public' 
      AND t.table_type = 'BASE TABLE'
      ORDER BY t.table_name
    `);
    const tableNames = tables.rows.map((row) => row.table_name);
    const rowCounts = await Promise.all(
      tableNames.map(async (tableName) => {
        try {
          const result = await db.execute(sql20.raw(`SELECT COUNT(*) as count FROM "${tableName}"`));
          return {
            tableName,
            rowCount: parseInt(result.rows[0].count)
          };
        } catch (error) {
          return {
            tableName,
            rowCount: 0,
            error: error instanceof Error ? error.message : "Unknown error"
          };
        }
      })
    );
    const summary = tables.rows.map((table) => {
      const rowCount = rowCounts.find((rc) => rc.tableName === table.table_name);
      return {
        ...table,
        actualRowCount: rowCount?.rowCount || 0,
        hasError: !!rowCount?.error,
        error: rowCount?.error
      };
    });
    res.json({
      success: true,
      tables: summary,
      totalTables: summary.length,
      totalRows: summary.reduce((sum4, table) => sum4 + (table.actualRowCount || 0), 0)
    });
  } catch (error) {
    console.error("Error fetching tables summary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tables summary",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router8.get("/health", async (req, res) => {
  try {
    const connectionTest = await db.execute(sql20`SELECT 1 as test`);
    const dbSize = await db.execute(sql20`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `);
    const tableCount = await db.execute(sql20`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    const tables = await db.execute(sql20`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    let totalRows = 0;
    const tableRowCounts = [];
    for (const table of tables.rows) {
      try {
        const result = await db.execute(sql20.raw(`SELECT COUNT(*) as count FROM "${table.table_name}"`));
        const count7 = parseInt(result.rows[0].count);
        totalRows += count7;
        tableRowCounts.push({
          tableName: table.table_name,
          rowCount: count7
        });
      } catch (error) {
        tableRowCounts.push({
          tableName: table.table_name,
          rowCount: 0,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
    res.json({
      success: true,
      health: {
        connected: true,
        databaseSize: dbSize.rows[0].size,
        tableCount: parseInt(tableCount.rows[0].count),
        totalRows,
        tableRowCounts,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  } catch (error) {
    console.error("Error checking database health:", error);
    res.status(500).json({
      success: false,
      error: "Database health check failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router8.get("/validate", async (req, res) => {
  try {
    const validator = database_validator_default.getInstance();
    const report = await validator.validateAllTables();
    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error("Error validating database:", error);
    res.status(500).json({
      success: false,
      error: "Failed to validate database",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router8.get("/tables/:tableName/validate-detailed", async (req, res) => {
  try {
    const { tableName } = req.params;
    const validator = database_validator_default.getInstance();
    const result = await validator.validateTable(tableName);
    res.json({
      success: true,
      validation: result
    });
  } catch (error) {
    console.error(`Error validating table ${req.params.tableName}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to validate table",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router8.post("/tables/:tableName/fix", async (req, res) => {
  try {
    const { tableName } = req.params;
    const validator = database_validator_default.getInstance();
    const result = await validator.fixCommonIssues(tableName);
    res.json({
      success: true,
      tableName,
      fixed: result.fixed,
      errors: result.errors
    });
  } catch (error) {
    console.error(`Error fixing issues for table ${req.params.tableName}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to fix table issues",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router8.get("/tables/:tableName/stats", async (req, res) => {
  try {
    const { tableName } = req.params;
    const sizeResult = await db.execute(sql20.raw(`
      SELECT 
        pg_size_pretty(pg_total_relation_size('${tableName}')) as total_size,
        pg_size_pretty(pg_relation_size('${tableName}')) as table_size,
        pg_size_pretty(pg_indexes_size('${tableName}')) as indexes_size
    `));
    const statsResult = await db.execute(sql20.raw(`
      SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        n_live_tup as live_tuples,
        n_dead_tup as dead_tuples,
        last_vacuum,
        last_autovacuum,
        last_analyze,
        last_autoanalyze
      FROM pg_stat_user_tables 
      WHERE relname = '${tableName}'
    `));
    const indexesResult = await db.execute(sql20.raw(`
      SELECT 
        indexname,
        indexdef,
        pg_size_pretty(pg_relation_size(indexname::regclass)) as size
      FROM pg_indexes 
      WHERE tablename = '${tableName}'
    `));
    res.json({
      success: true,
      tableName,
      size: sizeResult.rows[0],
      statistics: statsResult.rows[0] || {},
      indexes: indexesResult.rows
    });
  } catch (error) {
    console.error(`Error fetching stats for table ${req.params.tableName}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch table statistics",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
var table_validation_default = router8;

// server/routes/index.ts
async function registerRoutes(app2) {
  registerDashboardRoutes(app2);
  const { registerInventoryItemsRoutes: registerInventoryItemsRoutes2 } = await Promise.resolve().then(() => (init_inventory_items_index(), inventory_items_index_exports));
  registerInventoryItemsRoutes2(app2);
  const { registerStockIssuesRoutes: registerStockIssuesRoutes2 } = await Promise.resolve().then(() => (init_stock_issues_index(), stock_issues_index_exports));
  registerStockIssuesRoutes2(app2);
  const { registerReceiptReturnsRoutes: registerReceiptReturnsRoutes2 } = await Promise.resolve().then(() => (init_receipt_returns_index(), receipt_returns_index_exports));
  registerReceiptReturnsRoutes2(app2);
  const { registerReceiptsRoutes: registerReceiptsRoutes2 } = await Promise.resolve().then(() => (init_receipts_index(), receipts_index_exports));
  registerReceiptsRoutes2(app2);
  registerCustomerRoutes(app2);
  registerSupplierRoutes(app2);
  registerItemRoutes(app2);
  registerEnquiryRoutes(app2);
  app2.use("/api/requisitions", requisitions_default);
  app2.use("/api/material-requests", material_requests_default);
  registerQuotationRoutes(app2);
  registerApprovalRoutes(app2);
  registerCustomerAcceptanceRoutes(app2);
  registerPurchaseOrderRoutes(app2);
  registerSalesOrderRoutes(app2);
  registerSupplierLpoRoutes(app2);
  registerSupplierQuoteRoutes(app2);
  registerWorkflowRoutes(app2);
  registerWorkflowNotificationRoutes(app2);
  registerInventoryRoutes(app2);
  registerPhysicalStockRoutes(app2);
  registerPricingRoutes(app2);
  registerAIRoutes(app2);
  registerDeliveryRoutes(app2);
  registerShipmentTrackingRoutes(app2);
  registerInvoiceRoutes(app2);
  registerCreditNoteRoutes(app2);
  registerGoodsReceiptRoutes(app2);
  registerPurchaseInvoiceRoutes(app2);
  registerUtilityRoutes(app2);
  registerRecentActivitiesRoutes(app2);
  registerAuthRoutes(app2);
  registerFileRoutes(app2);
  app2.use("/api/audit", audit_default);
  app2.use("/api/users", users_default);
  app2.use("/api/settings", settings_default);
  app2.use("/api/analytics", router7);
  app2.use("/api/table-validation", table_validation_default);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    },
    proxy: {
      "/api": "http://localhost:5000"
    }
  }
});

// server/vite.ts
import { nanoid as nanoid6 } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid6()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
init_db();
import { eq as eq31 } from "drizzle-orm";
import bcrypt2 from "bcryptjs";
dotenv.config();
var app = express3();
app.use((req, res, next) => {
  console.log(`[DEBUG][REQ] ${req.method} ${req.originalUrl}`);
  next();
});
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use(resolveUserId);
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  try {
    const adminPass = process.env.INIT_ADMIN_PASSWORD || "admin123";
    const hash = await bcrypt2.hash(adminPass, 10);
    const requiredAdmins = [
      { username: "admin", email: "admin@example.com" },
      { username: "testadmin", email: "testadmin@example.com" }
    ];
    for (const adm of requiredAdmins) {
      const existing = await db.select().from(users2).where(eq31(users2.username, adm.username)).limit(1);
      if (!existing.length) {
        await db.insert(users2).values({ username: adm.username, role: "admin", passwordHash: hash, email: adm.email });
        log(`Seeded missing admin user '${adm.username}'.`);
      }
    }
  } catch (e) {
    console.error("Admin seed error", e);
  }
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "localhost", () => {
    try {
      const storageModule = (init_storage(), __toCommonJS(storage_exports));
      const activeStorage = storageModule.storage;
      const ctorName = activeStorage ? activeStorage.constructor?.name : "undefined";
      log(`serving on port ${port} (storage=${ctorName})`);
    } catch (e) {
      log(`serving on port ${port} (storage=load-error)`);
    }
  });
})();
