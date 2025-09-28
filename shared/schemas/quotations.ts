import { pgTable, uuid, varchar, integer, timestamp, text, decimal, boolean, sql, createInsertSchema, z } from "./common";
import { quotationStatusEnum, approvalLevelEnum, customerTypeEnum } from "./enums";
import { customers, users } from "./users-customers";
import { enquiries } from "./enquiries";

// Quotations
export const quotations = pgTable("quotations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  quoteNumber: varchar("quote_number", { length: 50 }).unique().notNull(),
  revision: integer("revision").default(1),
  // Revision tracking for audit purposes
  parentQuotationId: uuid("parent_quotation_id"),
  revisionReason: text("revision_reason"),
  supersededAt: timestamp("superseded_at"),
  supersededBy: uuid("superseded_by").references(() => users.id),
  isSuperseded: boolean("is_superseded").default(false),
  enquiryId: uuid("enquiry_id").references(() => enquiries.id),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  customerType: customerTypeEnum("customer_type").notNull(),
  status: quotationStatusEnum("status").default("Draft"),
  quoteDate: timestamp("quote_date").defaultNow(),
  validUntil: timestamp("valid_until"),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0"),
  discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }).default("0"),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  terms: text("terms"),
  notes: text("notes"),
  approvalStatus: varchar("approval_status", { length: 50 }).default("Pending"),
  requiredApprovalLevel: approvalLevelEnum("required_approval_level"),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quotation Items
export const quotationItems = pgTable("quotation_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  quotationId: uuid("quotation_id").references(() => quotations.id, { onDelete: "cascade" }).notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  costPrice: decimal("cost_price", { precision: 12, scale: 4 }),
  markup: decimal("markup", { precision: 5, scale: 2 }),
  unitPrice: decimal("unit_price", { precision: 12, scale: 4 }).notNull(),
  lineTotal: decimal("line_total", { precision: 12, scale: 2 }).notNull(),
  isAccepted: boolean("is_accepted").default(true),
  rejectionReason: text("rejection_reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Approval Rules
export const approvalRules = pgTable("approval_rules", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  customerType: customerTypeEnum("customer_type"),
  minQuoteValue: decimal("min_quote_value", { precision: 12, scale: 2 }),
  maxQuoteValue: decimal("max_quote_value", { precision: 12, scale: 2 }),
  maxDiscountPercentage: decimal("max_discount_percentage", { precision: 5, scale: 2 }),
  requiredApprovalLevel: approvalLevelEnum("required_approval_level").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quotation Approvals (Audit Trail)
export const quotationApprovals = pgTable("quotation_approvals", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  quotationId: uuid("quotation_id").references(() => quotations.id, { onDelete: "cascade" }).notNull(),
  approverLevel: approvalLevelEnum("approver_level").notNull(),
  approverId: uuid("approver_id").references(() => users.id),
  status: varchar("status", { length: 50 }).notNull(), // "Pending", "Approved", "Rejected"
  comments: text("comments"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertQuotationSchema = createInsertSchema(quotations, {
  validUntil: z.string().optional(),
}).omit({ id: true, quoteNumber: true, createdAt: true, updatedAt: true, parentQuotationId: true }).extend({
  createdBy: z.string().optional(),
});

// Revision creation schema
export const createQuotationRevisionSchema = z.object({
  revisionReason: z.string().min(1, "Revision reason is required"),
  quoteDate: z.string().optional(),
  validUntil: z.string().optional(),
  subtotal: z.string().optional(),
  discountPercentage: z.string().optional(),
  discountAmount: z.string().optional(),
  taxAmount: z.string().optional(),
  totalAmount: z.string().optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().min(1),
    costPrice: z.string().optional(),
    markup: z.string().optional(),
    unitPrice: z.string().min(1),
    lineTotal: z.string().min(1),
    isAccepted: z.boolean().optional(),
    rejectionReason: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
});

export const insertQuotationItemSchema = createInsertSchema(quotationItems).omit({ id: true, createdAt: true });
export const insertApprovalRuleSchema = createInsertSchema(approvalRules).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuotationApprovalSchema = createInsertSchema(quotationApprovals).omit({ id: true, createdAt: true });

// Types
export type Quotation = typeof quotations.$inferSelect;
export type QuotationItem = typeof quotationItems.$inferSelect;
export type ApprovalRule = typeof approvalRules.$inferSelect;
export type QuotationApproval = typeof quotationApprovals.$inferSelect;
export type InsertQuotation = z.infer<typeof insertQuotationSchema>;
export type InsertQuotationItem = z.infer<typeof insertQuotationItemSchema>;
export type InsertApprovalRule = z.infer<typeof insertApprovalRuleSchema>;
export type InsertQuotationApproval = z.infer<typeof insertQuotationApprovalSchema>;
