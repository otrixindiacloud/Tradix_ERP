import { relations } from "./common";

// Import all tables from their respective modules
import { users, customers, suppliers } from "./users-customers";
import { items } from "./items";
import { enquiries, enquiryItems } from "./enquiries";
import { quotations, quotationItems, approvalRules, quotationApprovals } from "./quotations";
import { 
  customerAcceptances, 
  purchaseOrders, 
  quotationItemAcceptances, 
  poLineItems, 
  acceptanceConfirmations 
} from "./customer-acceptance";
import { salesOrders, salesOrderItems } from "./sales-orders";
import { supplierLpos, supplierLpoItems } from "./purchase-orders";
import { inventoryItems, inventoryVariants, inventoryLevels, stockMovements } from "./inventory";
import { goodsReceipts, legacyGoodsReceiptItems, goodsReceiptHeaders, goodsReceiptItems } from "./goods-receipt";
import { deliveries, deliveryItems, deliveryPickingSessions, deliveryPickedItems } from "./delivery";
import { invoices, invoiceItems } from "./invoices";
import { creditNotes, creditNoteItems } from "./delivery-credit";
import { scanningSessions, scannedItems, supplierReturns, supplierReturnItems } from "./scanning-returns";
import { 
  productCategories, 
  markupConfiguration, 
  itemPricing, 
  customerPricing, 
  pricingRules, 
  priceLists, 
  priceListItems, 
  priceChangeHistory, 
  bulkPricingOperations 
} from "./pricing";

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  enquiries: many(enquiries),
  quotations: many(quotations),
  salesOrders: many(salesOrders),
  invoices: many(invoices),
  creditNotes: many(creditNotes),
  customerAcceptances: many(customerAcceptances),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  items: many(items),
  supplierLpos: many(supplierLpos),
  inventoryItems: many(inventoryItems),
  supplierReturns: many(supplierReturns),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [items.supplierId],
    references: [suppliers.id],
  }),
  enquiryItems: many(enquiryItems),
  deliveryItems: many(deliveryItems),
  invoiceItems: many(invoiceItems),
  creditNoteItems: many(creditNoteItems),
}));

export const enquiriesRelations = relations(enquiries, ({ one, many }) => ({
  customer: one(customers, {
    fields: [enquiries.customerId],
    references: [customers.id],
  }),
  items: many(enquiryItems),
  quotations: many(quotations),
}));

export const quotationsRelations = relations(quotations, ({ one, many }) => ({
  enquiry: one(enquiries, {
    fields: [quotations.enquiryId],
    references: [enquiries.id],
  }),
  customer: one(customers, {
    fields: [quotations.customerId],
    references: [customers.id],
  }),
  items: many(quotationItems),
  salesOrders: many(salesOrders),
  customerAcceptances: many(customerAcceptances),
  purchaseOrders: many(purchaseOrders),
}));

export const customerAcceptancesRelations = relations(customerAcceptances, ({ one, many }) => ({
  quotation: one(quotations, {
    fields: [customerAcceptances.quotationId],
    references: [quotations.id],
  }),
  itemAcceptances: many(quotationItemAcceptances),
  purchaseOrders: many(purchaseOrders),
  confirmations: many(acceptanceConfirmations),
}));

export const purchaseOrdersRelations = relations(purchaseOrders, ({ one, many }) => ({
  quotation: one(quotations, {
    fields: [purchaseOrders.quotationId],
    references: [quotations.id],
  }),
  customerAcceptance: one(customerAcceptances, {
    fields: [purchaseOrders.customerAcceptanceId],
    references: [customerAcceptances.id],
  }),
  lineItems: many(poLineItems),
}));

export const quotationItemAcceptancesRelations = relations(quotationItemAcceptances, ({ one }) => ({
  customerAcceptance: one(customerAcceptances, {
    fields: [quotationItemAcceptances.customerAcceptanceId],
    references: [customerAcceptances.id],
  }),
  quotationItem: one(quotationItems, {
    fields: [quotationItemAcceptances.quotationItemId],
    references: [quotationItems.id],
  }),
}));

export const poLineItemsRelations = relations(poLineItems, ({ one }) => ({
  purchaseOrder: one(purchaseOrders, {
    fields: [poLineItems.purchaseOrderId],
    references: [purchaseOrders.id],
  }),
  quotationItem: one(quotationItems, {
    fields: [poLineItems.quotationItemId],
    references: [quotationItems.id],
  }),
}));

export const salesOrdersRelations = relations(salesOrders, ({ one, many }) => ({
  quotation: one(quotations, {
    fields: [salesOrders.quotationId],
    references: [quotations.id],
  }),
  customer: one(customers, {
    fields: [salesOrders.customerId],
    references: [customers.id],
  }),
  items: many(salesOrderItems),
  deliveries: many(deliveries),
  invoices: many(invoices),
}));

// PRICING RELATIONS
export const productCategoriesRelations = relations(productCategories, ({ one, many }) => ({
  parentCategory: one(productCategories, {
    fields: [productCategories.parentCategoryId],
    references: [productCategories.id],
  }),
  subCategories: many(productCategories),
  items: many(inventoryItems),
  markupConfigurations: many(markupConfiguration),
  priceLists: many(priceLists),
}));

export const markupConfigurationRelations = relations(markupConfiguration, ({ one }) => ({
  createdByUser: one(users, {
    fields: [markupConfiguration.createdBy],
    references: [users.id],
  }),
  updatedByUser: one(users, {
    fields: [markupConfiguration.updatedBy],
    references: [users.id],
  }),
}));

export const itemPricingRelations = relations(itemPricing, ({ one }) => ({
  item: one(inventoryItems, {
    fields: [itemPricing.itemId],
    references: [inventoryItems.id],
  }),
  createdByUser: one(users, {
    fields: [itemPricing.createdBy],
    references: [users.id],
  }),
  updatedByUser: one(users, {
    fields: [itemPricing.updatedBy],
    references: [users.id],
  }),
}));

export const customerPricingRelations = relations(customerPricing, ({ one }) => ({
  customer: one(customers, {
    fields: [customerPricing.customerId],
    references: [customers.id],
  }),
  item: one(inventoryItems, {
    fields: [customerPricing.itemId],
    references: [inventoryItems.id],
  }),
  createdByUser: one(users, {
    fields: [customerPricing.createdBy],
    references: [users.id],
  }),
}));

export const pricingRulesRelations = relations(pricingRules, ({ one }) => ({
  createdByUser: one(users, {
    fields: [pricingRules.createdBy],
    references: [users.id],
  }),
}));

export const priceListsRelations = relations(priceLists, ({ one, many }) => ({
  customer: one(customers, {
    fields: [priceLists.customerId],
    references: [customers.id],
  }),
  category: one(productCategories, {
    fields: [priceLists.categoryId],
    references: [productCategories.id],
  }),
  items: many(priceListItems),
  createdByUser: one(users, {
    fields: [priceLists.createdBy],
    references: [users.id],
  }),
}));

export const priceListItemsRelations = relations(priceListItems, ({ one }) => ({
  priceList: one(priceLists, {
    fields: [priceListItems.priceListId],
    references: [priceLists.id],
  }),
  item: one(inventoryItems, {
    fields: [priceListItems.itemId],
    references: [inventoryItems.id],
  }),
}));

export const priceChangeHistoryRelations = relations(priceChangeHistory, ({ one }) => ({
  item: one(inventoryItems, {
    fields: [priceChangeHistory.itemId],
    references: [inventoryItems.id],
  }),
  user: one(users, {
    fields: [priceChangeHistory.userId],
    references: [users.id],
  }),
}));

export const bulkPricingOperationsRelations = relations(bulkPricingOperations, ({ one }) => ({
  createdByUser: one(users, {
    fields: [bulkPricingOperations.createdBy],
    references: [users.id],
  }),
}));
