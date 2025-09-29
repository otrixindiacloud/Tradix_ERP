import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, sql, createInsertSchema } from "./common";
import { suppliers } from "./users-customers";
import { inventoryItems } from "./inventory";
import { goodsReceipts } from "./goods-receipt";

// Bulk Scanning Sessions
export const scanningSessions = pgTable("scanning_sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  goodsReceiptId: uuid("goods_receipt_id").references(() => goodsReceipts.id, { onDelete: "cascade" }),
  sessionName: varchar("session_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("active"),
  createdBy: varchar("created_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const scannedItems = pgTable("scanned_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  scanningSessionId: uuid("scanning_session_id").references(() => scanningSessions.id, { onDelete: "cascade" }),
  inventoryItemId: uuid("inventory_item_id").references(() => inventoryItems.id, { onDelete: "cascade" }),
  barcode: varchar("barcode", { length: 255 }).notNull(),
  quantityScanned: integer("quantity_scanned").notNull(),
  scannedAt: timestamp("scanned_at").defaultNow(),
  status: varchar("status", { length: 50 }).default("pending"),
  notes: text("notes"),
});

// Supplier Returns Management
export const supplierReturns = pgTable("supplier_returns", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const supplierReturnItems = pgTable("supplier_return_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierReturnId: uuid("supplier_return_id").references(() => supplierReturns.id, { onDelete: "cascade" }),
  inventoryItemId: uuid("inventory_item_id").references(() => inventoryItems.id, { onDelete: "cascade" }),
  quantityReturned: integer("quantity_returned").notNull(),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }).notNull(),
  totalCost: decimal("total_cost", { precision: 12, scale: 2 }).notNull(),
  returnReason: text("return_reason"),
  conditionNotes: text("condition_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertScanningSessionSchema = createInsertSchema(scanningSessions).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertScannedItemSchema = createInsertSchema(scannedItems).omit({ 
  id: true, 
  scannedAt: true 
});

export const insertSupplierReturnSchema = createInsertSchema(supplierReturns).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertSupplierReturnItemSchema = createInsertSchema(supplierReturnItems).omit({ 
  id: true, 
  createdAt: true 
});

// Types
export type ScanningSession = typeof scanningSessions.$inferSelect;
export type ScannedItem = typeof scannedItems.$inferSelect;
export type SupplierReturn = typeof supplierReturns.$inferSelect;
export type SupplierReturnItem = typeof supplierReturnItems.$inferSelect;
export type InsertScanningSession = typeof insertScanningSessionSchema;
export type InsertScannedItem = typeof insertScannedItemSchema;
export type InsertSupplierReturn = typeof insertSupplierReturnSchema;
export type InsertSupplierReturnItem = typeof insertSupplierReturnItemSchema;
