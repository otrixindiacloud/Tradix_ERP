import { pgTable, uuid, varchar, timestamp, text, integer, jsonb, createInsertSchema, z } from "./common";
import { enquiryStatusEnum, enquirySourceEnum } from "./enums";
import { customers, users } from "./users-customers";
import { items } from "./items";

// Customer Enquiries
export const enquiries = pgTable("enquiries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  enquiryNumber: varchar("enquiry_number", { length: 50 }).unique().notNull(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  enquiryDate: timestamp("enquiry_date").defaultNow(),
  status: enquiryStatusEnum("status").default("New"),
  source: enquirySourceEnum("source").notNull(),
  targetDeliveryDate: timestamp("target_delivery_date"),
  notes: text("notes"),
  attachments: jsonb("attachments"), // File paths/URLs
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enquiry Items
export const enquiryItems = pgTable("enquiry_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  enquiryId: uuid("enquiry_id").references(() => enquiries.id).notNull(),
  itemId: uuid("item_id").references(() => items.id),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  notes: text("notes"),
});

// Insert schemas
export const insertEnquirySchema = createInsertSchema(enquiries, {
  targetDeliveryDate: z.string().optional(),
}).omit({ id: true, enquiryNumber: true, createdAt: true, updatedAt: true }).extend({
  createdBy: z.string().optional(),
});

export const insertEnquiryItemSchema = createInsertSchema(enquiryItems).omit({ id: true }).extend({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().optional(),
});

// Types
export type Enquiry = typeof enquiries.$inferSelect;
export type EnquiryItem = typeof enquiryItems.$inferSelect;
export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type InsertEnquiryItem = z.infer<typeof insertEnquiryItemSchema>;

import { sql, decimal } from "./common";
