import { pgTable, uuid, varchar, timestamp, text, decimal, boolean, integer, jsonb, createInsertSchema } from "./common";
import { supplierLpoStatusEnum } from "./enums";
import { suppliers, users } from "./users-customers";
import { items } from "./items";

// Supplier LPOs (Local Purchase Orders) - Enhanced
export const supplierLpos = pgTable("supplier_lpos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  lpoNumber: varchar("lpo_number", { length: 50 }).unique().notNull(),
  supplierId: uuid("supplier_id").references(() => suppliers.id).notNull(),
  status: supplierLpoStatusEnum("status").default("Draft"),
  lpoDate: timestamp("lpo_date").defaultNow(),
  expectedDeliveryDate: timestamp("expected_delivery_date"),
  requestedDeliveryDate: timestamp("requested_delivery_date"),
  // Auto-generation source tracking
  sourceType: varchar("source_type", { length: 50 }).default("Manual"), // "Auto", "Manual"
  sourceSalesOrderIds: jsonb("source_sales_order_ids"), // Array of sales order IDs for auto-generation
  sourceQuotationIds: jsonb("source_quotation_ids"), // Array of quotation IDs for direct traceability
  groupingCriteria: varchar("grouping_criteria", { length: 100 }), // "supplier", "delivery_date", "custom"
  // Financial details
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("USD"),
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
  parentLpoId: uuid("parent_lpo_id"), // Self-reference will be added as foreign key constraint
  amendmentReason: text("amendment_reason"),
  amendmentType: varchar("amendment_type", { length: 50 }), // "Quantity", "Price", "Delivery", "Terms", "Cancellation"
  // Approval workflow
  requiresApproval: boolean("requires_approval").default(false),
  approvalStatus: varchar("approval_status", { length: 50 }).default("Not Required"), // "Not Required", "Pending", "Approved", "Rejected"
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  approvalNotes: text("approval_notes"),
  // Tracking
  sentToSupplierAt: timestamp("sent_to_supplier_at"),
  confirmedBySupplierAt: timestamp("confirmed_by_supplier_at"),
  supplierConfirmationReference: varchar("supplier_confirmation_reference", { length: 255 }),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Supplier LPO Items - Enhanced
export const supplierLpoItems = pgTable("supplier_lpo_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierLpoId: uuid("supplier_lpo_id").references(() => supplierLpos.id).notNull(),
  salesOrderItemId: uuid("sales_order_item_id"), // References sales_order_items.id
  quotationItemId: uuid("quotation_item_id"), // References quotation_items.id
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
  deliveryStatus: varchar("delivery_status", { length: 50 }).default("Pending"), // "Pending", "Partial", "Complete"
  // Special requirements
  urgency: varchar("urgency", { length: 50 }).default("Normal"), // "Low", "Normal", "High", "Urgent"
  specialInstructions: text("special_instructions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertSupplierLpoSchema = createInsertSchema(supplierLpos).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  version: true, 
  approvedAt: true,
  sentToSupplierAt: true,
  confirmedBySupplierAt: true 
});

export const insertSupplierLpoItemSchema = createInsertSchema(supplierLpoItems).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Types
export type SupplierLpo = typeof supplierLpos.$inferSelect;
export type SupplierLpoItem = typeof supplierLpoItems.$inferSelect;
export type InsertSupplierLpo = typeof insertSupplierLpoSchema;
export type InsertSupplierLpoItem = typeof insertSupplierLpoItemSchema;

import { sql } from "./common";
