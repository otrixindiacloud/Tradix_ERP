import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, date, sql, nanoid, createInsertSchema } from "./common";
import { suppliers } from "./users-customers";

// Enhanced Item table for supplier-coded items with variants
export const inventoryItems = pgTable("inventory_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierCode: varchar("supplier_code", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  unitOfMeasure: varchar("unit_of_measure", { length: 100 }).notNull(),
  supplierId: uuid("supplier_id").references(() => suppliers.id),
  barcode: varchar("barcode", { length: 255 }),
  weight: decimal("weight", { precision: 10, scale: 3 }),
  dimensions: varchar("dimensions", { length: 255 }),
  quantity: integer("quantity").default(0),
  reservedQuantity: integer("reserved_quantity").default(0),
  availableQuantity: integer("available_quantity").default(0),
  totalStock: integer("total_stock").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Item variants for color, size, etc.
export const inventoryVariants = pgTable("inventory_variants", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  inventoryItemId: uuid("inventory_item_id").notNull().references(() => inventoryItems.id, { onDelete: "cascade" }),
  variantName: varchar("variant_name", { length: 255 }).notNull(),
  variantValue: varchar("variant_value", { length: 255 }).notNull(),
  additionalCost: decimal("additional_cost", { precision: 10, scale: 2 }).default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Current stock levels - renamed to inventoryLevels to match the database
export const inventoryLevels = pgTable("inventory_levels", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  inventoryItemId: uuid("inventory_item_id").references(() => inventoryItems.id, { onDelete: "cascade" }),
  storageLocation: varchar("storage_location", { length: 255 }).notNull(),
  quantityAvailable: integer("quantity_available").default(0),
  quantityReserved: integer("quantity_reserved").default(0),
  reorderLevel: integer("reorder_level").default(0),
  maxStockLevel: integer("max_stock_level").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Stock Movement Tracking
export const stockMovements = pgTable("stock_movements", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  itemId: text("item_id").references(() => inventoryItems.id),
  variantId: text("variant_id").references(() => inventoryVariants.id),
  movementType: text("movement_type").notNull(), // Receipt, Issue, Transfer, Adjustment, Return
  referenceType: text("reference_type"), // GoodsReceipt, SalesOrder, Transfer, Adjustment, Return
  referenceId: text("reference_id"),
  storageLocation: text("storage_location"),
  quantityBefore: integer("quantity_before").notNull(),
  quantityMoved: integer("quantity_moved").notNull(),
  quantityAfter: integer("quantity_after").notNull(),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }),
  status: text("status"),
  notes: text("notes"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for inventory management
export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertInventoryVariantSchema = createInsertSchema(inventoryVariants).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertInventoryLevelSchema = createInsertSchema(inventoryLevels).omit({ 
  id: true, 
  createdAt: true, 
  lastUpdated: true 
});

export const insertStockMovementSchema = createInsertSchema(stockMovements).omit({ 
  id: true, 
  createdAt: true 
});

// Types
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InventoryVariant = typeof inventoryVariants.$inferSelect;
export type InventoryLevel = typeof inventoryLevels.$inferSelect;
export type StockMovement = typeof stockMovements.$inferSelect;
export type InsertInventoryItem = typeof insertInventoryItemSchema;
export type InsertInventoryVariant = typeof insertInventoryVariantSchema;
export type InsertInventoryLevel = typeof insertInventoryLevelSchema;
export type InsertStockMovement = typeof insertStockMovementSchema;
