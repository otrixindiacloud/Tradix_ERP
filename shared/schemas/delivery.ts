import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, sql, createInsertSchema } from "./common";
import { deliveryStatusEnum } from "./enums";
import { users } from "./users-customers";
import { items } from "./items";

// Deliveries - Enhanced with barcode picking and comprehensive tracking
export const deliveries = pgTable("deliveries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  deliveryNumber: varchar("delivery_number", { length: 50 }).unique().notNull(),
  salesOrderId: uuid("sales_order_id"), // References sales_orders.id
  deliveryDate: timestamp("delivery_date"),
  status: deliveryStatusEnum("status").default("Pending"),
  deliveryType: varchar("delivery_type", { length: 50 }).default("Full"), // "Full", "Partial"
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
  deliverySignature: text("delivery_signature"), // Base64 encoded signature
  // Tracking
  trackingNumber: varchar("tracking_number", { length: 100 }),
  carrierName: varchar("carrier_name", { length: 100 }),
  estimatedDeliveryDate: timestamp("estimated_delivery_date"),
  actualDeliveryDate: timestamp("actual_delivery_date"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Delivery Items - Enhanced with barcode tracking and picking details
export const deliveryItems = pgTable("delivery_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  deliveryId: uuid("delivery_id").references(() => deliveries.id).notNull(),
  salesOrderItemId: uuid("sales_order_item_id"), // References sales_order_items.id
  itemId: uuid("item_id").references(() => items.id).notNull(),
  lineNumber: integer("line_number").notNull(),
  barcode: varchar("barcode", { length: 100 }).notNull(), // Barcode for picking verification
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
  qualityNotes: text("quality_notes"),
});

// Delivery Picking Sessions - Track barcode scanning during picking
export const deliveryPickingSessions = pgTable("delivery_picking_sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  deliveryId: uuid("delivery_id").references(() => deliveries.id).notNull(),
  sessionNumber: varchar("session_number", { length: 50 }).notNull(),
  startedBy: uuid("started_by").references(() => users.id).notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  status: varchar("status", { length: 50 }).default("In Progress"), // "In Progress", "Completed", "Cancelled"
  totalItemsExpected: integer("total_items_expected").notNull(),
  totalItemsPicked: integer("total_items_picked").default(0),
  notes: text("notes"),
});

// Delivery Picked Items - Individual barcode scans during picking
export const deliveryPickedItems = pgTable("delivery_picked_items", {
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
  notes: text("notes"),
});

// Insert schemas
export const insertDeliverySchema = createInsertSchema(deliveries).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertDeliveryItemSchema = createInsertSchema(deliveryItems).omit({ 
  id: true 
});

export const insertDeliveryPickingSessionSchema = createInsertSchema(deliveryPickingSessions).omit({ 
  id: true, 
  startedAt: true 
});

export const insertDeliveryPickedItemSchema = createInsertSchema(deliveryPickedItems).omit({ 
  id: true, 
  pickedAt: true 
});

// Types
export type Delivery = typeof deliveries.$inferSelect;
export type DeliveryItem = typeof deliveryItems.$inferSelect;
export type DeliveryPickingSession = typeof deliveryPickingSessions.$inferSelect;
export type DeliveryPickedItem = typeof deliveryPickedItems.$inferSelect;
export type InsertDelivery = typeof insertDeliverySchema;
export type InsertDeliveryItem = typeof insertDeliveryItemSchema;
export type InsertDeliveryPickingSession = typeof insertDeliveryPickingSessionSchema;
export type InsertDeliveryPickedItem = typeof insertDeliveryPickedItemSchema;
