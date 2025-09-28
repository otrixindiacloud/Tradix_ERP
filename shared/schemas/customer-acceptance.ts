import { pgTable, uuid, varchar, timestamp, text, decimal, boolean, integer, createInsertSchema, sql, z } from "./common";
import { customers, users } from "./users-customers";

// Forward declarations for tables that will be imported from other modules
// These will be properly typed when the relations are established

// Customer Acceptance tracking
export const customerAcceptances = pgTable("customer_acceptances", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  quotationId: uuid("quotation_id").notNull(), // References quotations.id
  acceptanceType: text("acceptance_type").notNull(), // "Full" or "Partial"
  acceptedAt: timestamp("accepted_at").defaultNow().notNull(),
  acceptedBy: varchar("accepted_by", { length: 255 }).notNull(), // Customer contact person
  customerEmail: varchar("customer_email", { length: 255 }),
  customerNotes: text("customer_notes"),
  totalAcceptedAmount: decimal("total_accepted_amount", { precision: 12, scale: 2 }),
  status: varchar("status", { length: 50 }).default("Active").notNull(), // "Active", "Superseded", "Cancelled"
  internalNotes: text("internal_notes"),
  processedBy: uuid("processed_by").references(() => users.id),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Purchase Order uploads
export const purchaseOrders = pgTable("purchase_orders", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  quotationId: uuid("quotation_id").notNull(), // References quotations.id
  customerAcceptanceId: uuid("customer_acceptance_id").references(() => customerAcceptances.id),
  poNumber: varchar("po_number", { length: 100 }).notNull(),
  poDate: timestamp("po_date").notNull(),
  customerReference: varchar("customer_reference", { length: 255 }),
  documentPath: varchar("document_path", { length: 500 }).notNull(),
  documentName: varchar("document_name", { length: 255 }).notNull(),
  documentSize: integer("document_size"),
  documentType: varchar("document_type", { length: 50 }).notNull(), // PDF, PNG, JPG, etc.
  uploadedBy: uuid("uploaded_by").references(() => users.id).notNull(),
  validationStatus: varchar("validation_status", { length: 50 }).default("Pending").notNull(), // "Pending", "Valid", "Invalid", "Requires Review"
  validationNotes: text("validation_notes"),
  validatedBy: uuid("validated_by").references(() => users.id),
  validatedAt: timestamp("validated_at"),
  totalPoAmount: decimal("total_po_amount", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  paymentTerms: varchar("payment_terms", { length: 255 }),
  deliveryTerms: varchar("delivery_terms", { length: 255 }),
  specialInstructions: text("special_instructions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Item-level acceptance tracking with enhanced details
export const quotationItemAcceptances = pgTable("quotation_item_acceptances", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  customerAcceptanceId: uuid("customer_acceptance_id").references(() => customerAcceptances.id).notNull(),
  quotationItemId: uuid("quotation_item_id").notNull(), // References quotation_items.id
  isAccepted: boolean("is_accepted").notNull(),
  originalQuantity: integer("original_quantity").notNull(),
  acceptedQuantity: integer("accepted_quantity"),
  rejectedQuantity: integer("rejected_quantity"),
  rejectionReason: text("rejection_reason"),
  customerNotes: text("customer_notes"),
  acceptedUnitPrice: decimal("accepted_unit_price", { precision: 12, scale: 4 }),
  acceptedLineTotal: decimal("accepted_line_total", { precision: 12, scale: 2 }),
  deliveryRequirement: text("delivery_requirement"),
  priority: varchar("priority", { length: 50 }).default("Medium"), // "Low", "Medium", "High", "Urgent"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// PO Line Items for detailed validation
export const poLineItems = pgTable("po_line_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  purchaseOrderId: uuid("purchase_order_id").references(() => purchaseOrders.id).notNull(),
  quotationItemId: uuid("quotation_item_id"), // References quotation_items.id
  itemDescription: text("item_description").notNull(),
  poQuantity: integer("po_quantity").notNull(),
  poUnitPrice: decimal("po_unit_price", { precision: 12, scale: 4 }),
  poLineTotal: decimal("po_line_total", { precision: 12, scale: 2 }),
  matchStatus: varchar("match_status", { length: 50 }).default("Not Validated").notNull(), // "Matched", "Quantity Mismatch", "Price Mismatch", "Item Not Found", "Not Validated"
  discrepancyNotes: text("discrepancy_notes"),
  validatedBy: uuid("validated_by").references(() => users.id),
  validatedAt: timestamp("validated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Acceptance confirmation log for audit trail
export const acceptanceConfirmations = pgTable("acceptance_confirmations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  customerAcceptanceId: uuid("customer_acceptance_id").references(() => customerAcceptances.id).notNull(),
  confirmationType: varchar("confirmation_type", { length: 50 }).notNull(), // "Email", "Phone", "Portal", "Document", "Meeting"
  confirmationMethod: varchar("confirmation_method", { length: 255 }).notNull(),
  confirmedBy: varchar("confirmed_by", { length: 255 }).notNull(),
  confirmedAt: timestamp("confirmed_at").notNull(),
  confirmationReference: varchar("confirmation_reference", { length: 255 }),
  confirmationDetails: text("confirmation_details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertCustomerAcceptanceSchema = createInsertSchema(customerAcceptances).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders, {
  poDate: z.string(),
}).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuotationItemAcceptanceSchema = createInsertSchema(quotationItemAcceptances).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPoLineItemSchema = createInsertSchema(poLineItems).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAcceptanceConfirmationSchema = createInsertSchema(acceptanceConfirmations, {
  confirmedAt: z.string(),
}).omit({ id: true, createdAt: true });

// Types
export type CustomerAcceptance = typeof customerAcceptances.$inferSelect;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type QuotationItemAcceptance = typeof quotationItemAcceptances.$inferSelect;
export type PoLineItem = typeof poLineItems.$inferSelect;
export type AcceptanceConfirmation = typeof acceptanceConfirmations.$inferSelect;
export type InsertCustomerAcceptance = typeof insertCustomerAcceptanceSchema;
export type InsertPurchaseOrder = typeof insertPurchaseOrderSchema;
export type InsertQuotationItemAcceptance = typeof insertQuotationItemAcceptanceSchema;
export type InsertPoLineItem = typeof insertPoLineItemSchema;
export type InsertAcceptanceConfirmation = typeof insertAcceptanceConfirmationSchema;

// Remove the problematic import at the end
// import { sql, z } from "./common";
// import { quotationItems } from "./quotations";
