import { pgTable, uuid, varchar, text, decimal, integer, jsonb, boolean, timestamp, sql, createInsertSchema } from "./common";
import { suppliers } from "./users-customers";

// Items/Products
export const items = pgTable("items", {
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
  variants: jsonb("variants"), // For color, size, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Legacy Inventory (keeping for existing data)
export const legacyInventory = pgTable("inventory", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: uuid("item_id").references(() => items.id).notNull(),
  quantity: integer("quantity").default(0),
  reservedQuantity: integer("reserved_quantity").default(0),
  storageLocation: varchar("storage_location", { length: 100 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Insert schemas
export const insertItemSchema = createInsertSchema(items).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type Item = typeof items.$inferSelect;
export type InsertItem = typeof insertItemSchema;
