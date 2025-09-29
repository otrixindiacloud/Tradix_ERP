import { pgEnum } from "./common";

// Enums
export const customerTypeEnum = pgEnum("customer_type", ["Retail", "Wholesale"]);
export const customerClassificationEnum = pgEnum("customer_classification", ["Internal", "Corporate", "Individual", "Family", "Ministry"]);
export const enquiryStatusEnum = pgEnum("enquiry_status", ["New", "In Progress", "Quoted", "Closed"]);
export const enquirySourceEnum = pgEnum("enquiry_source", ["Email", "Phone", "Web Form", "Walk-in"]);
export const quotationStatusEnum = pgEnum("quotation_status", ["Draft", "Sent", "Accepted", "Rejected", "Expired"]);
export const salesOrderStatusEnum = pgEnum("sales_order_status", ["Draft", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"]);
export const supplierLpoStatusEnum = pgEnum("supplier_lpo_status", ["Draft", "Sent", "Confirmed", "Received", "Cancelled"]);
export const goodsReceiptStatusEnum = pgEnum("goods_receipt_status", ["Pending", "Partial", "Complete", "Discrepancy", "Approved"]);
export const deliveryStatusEnum = pgEnum("delivery_status", ["Pending", "Partial", "Complete", "Cancelled"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["Draft", "Sent", "Paid", "Overdue", "Cancelled"]);
export const approvalLevelEnum = pgEnum("approval_level", ["Sales Rep", "Manager", "Finance", "Director"]);
export const pricingMarkupLevelEnum = pgEnum("pricing_markup_level", ["System", "Category", "Item"]);
export const pricingRuleTypeEnum = pgEnum("pricing_rule_type", ["Retail", "Wholesale", "Custom"]);
