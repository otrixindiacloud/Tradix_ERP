import { pgTable, uuid, varchar, timestamp, text, decimal, boolean, integer, jsonb, createInsertSchema } from "./common";
import { salesOrderStatusEnum } from "./enums";
import { customers, users } from "./users-customers";
import { items } from "./items";

// Sales Orders
export const salesOrders = pgTable("sales_orders", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: varchar("order_number", { length: 50 }).unique().notNull(),
  quotationId: uuid("quotation_id"), // Will reference quotations.id
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
  parentOrderId: uuid("parent_order_id"), // Self-reference will be added as foreign key constraint
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
  sourceType: varchar("source_type", { length: 50 }).default("Manual"), // "Auto", "Manual"
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sales Order Items  
export const salesOrderItems = pgTable("sales_order_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  salesOrderId: uuid("sales_order_id").references(() => salesOrders.id).notNull(),
  itemId: uuid("item_id").references(() => items.id).notNull(),
  lineNumber: integer("line_number"),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
  deliveryRequirement: text("delivery_requirement"),
  specialInstructions: text("special_instructions"),
});

// Insert schemas
export const insertSalesOrderSchema = createInsertSchema(salesOrders).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  version: true, 
  customerLpoValidatedAt: true,
  orderNumber: true  // Auto-generated in storage layer
});

export const insertSalesOrderItemSchema = createInsertSchema(salesOrderItems).omit({ id: true });

// Types
export type SalesOrder = typeof salesOrders.$inferSelect;
export type SalesOrderItem = typeof salesOrderItems.$inferSelect;
export type InsertSalesOrder = typeof insertSalesOrderSchema;
export type InsertSalesOrderItem = typeof insertSalesOrderItemSchema;

import { sql } from "./common";
