import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, date, sql, nanoid, createInsertSchema, z } from "./common";
import { goodsReceiptStatusEnum } from "./enums";
import { suppliers, users } from "./users-customers";
import { inventoryItems, inventoryVariants } from "./inventory";

// Goods Receipts
export const goodsReceipts = pgTable("goods_receipts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  receiptNumber: varchar("receipt_number", { length: 50 }).unique().notNull(),
  supplierLpoId: uuid("supplier_lpo_id"), // References supplier_lpos.id
  receiptDate: timestamp("receipt_date").defaultNow(),
  status: goodsReceiptStatusEnum("status").default("Pending"),
  storageLocation: varchar("storage_location", { length: 100 }),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Legacy Goods Receipt Items (keeping for existing data)
export const legacyGoodsReceiptItems = pgTable("goods_receipt_items_legacy", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  goodsReceiptId: uuid("goods_receipt_id").references(() => goodsReceipts.id).notNull(),
  itemId: uuid("item_id"), // References items.id
  orderedQuantity: integer("ordered_quantity").notNull(),
  receivedQuantity: integer("received_quantity").notNull(),
  damagedQuantity: integer("damaged_quantity").default(0),
  notes: text("notes"),
});

// Enhanced Goods Receipt Management
export const goodsReceiptHeaders = pgTable("goods_receipt_headers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  receiptNumber: text("receipt_number").notNull().unique(),
  supplierLpoId: uuid("supplier_lpo_id"), // References supplier_lpos.id
  supplierId: uuid("supplier_id").notNull().references(() => suppliers.id),
  receiptDate: date("receipt_date").notNull(),
  expectedDeliveryDate: date("expected_delivery_date"),
  actualDeliveryDate: date("actual_delivery_date"),
  receivedBy: text("received_by"),
  status: text("status").notNull().default("Draft"), // Draft, Partial, Complete, Discrepancy, Approved
  notes: text("notes"),
  totalItems: integer("total_items").default(0),
  totalQuantityExpected: integer("total_quantity_expected").default(0),
  totalQuantityReceived: integer("total_quantity_received").default(0),
  discrepancyFlag: boolean("discrepancy_flag").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const goodsReceiptItems = pgTable("goods_receipt_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  receiptHeaderId: uuid("receipt_header_id").notNull().references(() => goodsReceiptHeaders.id, { onDelete: "cascade" }),
  lpoItemId: uuid("lpo_item_id"), // References supplier_lpo_items.id
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
  condition: text("condition").default("Good"), // Good, Damaged, Defective
  discrepancyReason: text("discrepancy_reason"),
  scannedAt: timestamp("scanned_at"),
  receivedAt: timestamp("received_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertGoodsReceiptHeaderSchema = createInsertSchema(goodsReceiptHeaders, {
  receiptDate: z.string(),
  expectedDeliveryDate: z.string().optional(),
  actualDeliveryDate: z.string().optional(),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertGoodsReceiptItemSchema = createInsertSchema(goodsReceiptItems, {
  expiryDate: z.string().optional(),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Types
export type GoodsReceipt = typeof goodsReceipts.$inferSelect;
export type GoodsReceiptHeader = typeof goodsReceiptHeaders.$inferSelect;
export type GoodsReceiptItem = typeof goodsReceiptItems.$inferSelect;
export type InsertGoodsReceiptHeader = typeof insertGoodsReceiptHeaderSchema;
export type InsertGoodsReceiptItem = typeof insertGoodsReceiptItemSchema;
