import { pgTable, uuid, varchar, text, decimal, integer, timestamp, sql, createInsertSchema } from "./common";
import { customers, users } from "./users-customers";
import { items } from "./items";
import { invoices, invoiceItems } from "./invoices";

// Credit Notes - For returns and adjustments
export const creditNotes = pgTable("credit_notes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  creditNoteNumber: varchar("credit_note_number", { length: 50 }).unique().notNull(),
  originalInvoiceId: uuid("original_invoice_id").references(() => invoices.id).notNull(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  creditNoteDate: timestamp("credit_note_date").defaultNow(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 50 }).default("Draft"), // "Draft", "Issued", "Applied", "Cancelled"
  // Multi-currency support
  currency: varchar("currency", { length: 10 }).default("USD"),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 4 }).default("1.0000"),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
  appliedAmount: decimal("applied_amount", { precision: 12, scale: 2 }).default("0"),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Credit Note Items
export const creditNoteItems = pgTable("credit_note_items", {
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
  condition: varchar("condition", { length: 50 }), // "Good", "Damaged", "Defective"
});

// Insert schemas
export const insertCreditNoteSchema = createInsertSchema(creditNotes).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertCreditNoteItemSchema = createInsertSchema(creditNoteItems).omit({ 
  id: true 
});

// Types
export type CreditNote = typeof creditNotes.$inferSelect;
export type CreditNoteItem = typeof creditNoteItems.$inferSelect;
export type InsertCreditNote = typeof insertCreditNoteSchema;
export type InsertCreditNoteItem = typeof insertCreditNoteItemSchema;
