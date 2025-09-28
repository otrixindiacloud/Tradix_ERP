// Modular Schema Index - Re-exports all schema modules
// This file provides a single entry point for all schema definitions

// Core utilities and types
export * from "./common";
export * from "./enums";

// User and business entity schemas
export * from "./users-customers";
export * from "./items";

// Business process schemas
export * from "./enquiries";
export * from "./quotations";
export * from "./customer-acceptance";
export * from "./sales-orders";
export * from "./purchase-orders";

// Inventory and warehouse management
export * from "./inventory";
export * from "./goods-receipt";
export * from "./scanning-returns";

// Delivery and invoicing
export * from "./delivery";
export * from "./invoices";
export * from "./delivery-credit";

// Pricing and costing
export * from "./pricing";

// System schemas
export * from "./audit";

// Relations - import to register them with Drizzle
export * from "./relations";

// Re-export the relations for backward compatibility
import {
  customersRelations,
  suppliersRelations,
  itemsRelations,
  enquiriesRelations,
  quotationsRelations,
  customerAcceptancesRelations,
  purchaseOrdersRelations,
  quotationItemAcceptancesRelations,
  poLineItemsRelations,
  salesOrdersRelations,
  productCategoriesRelations,
  markupConfigurationRelations,
  itemPricingRelations,
  customerPricingRelations,
  pricingRulesRelations,
  priceListsRelations,
  priceListItemsRelations,
  priceChangeHistoryRelations,
  bulkPricingOperationsRelations,
} from "./relations";

export {
  customersRelations,
  suppliersRelations,
  itemsRelations,
  enquiriesRelations,
  quotationsRelations,
  customerAcceptancesRelations,
  purchaseOrdersRelations,
  quotationItemAcceptancesRelations,
  poLineItemsRelations,
  salesOrdersRelations,
  productCategoriesRelations,
  markupConfigurationRelations,
  itemPricingRelations,
  customerPricingRelations,
  pricingRulesRelations,
  priceListsRelations,
  priceListItemsRelations,
  priceChangeHistoryRelations,
  bulkPricingOperationsRelations,
};
