import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, jsonb, sql, createInsertSchema, pgEnum } from "./common";
import { pricingMarkupLevelEnum, pricingRuleTypeEnum } from "./enums";
import { users, customers } from "./users-customers";
import { inventoryItems } from "./inventory";

// Enhanced pricing method enums
export const pricingMethodEnum = pgEnum("pricing_method", [
  "cost_plus", 
  "margin_based", 
  "competitive", 
  "value_based", 
  "dynamic", 
  "contract", 
  "volume_tiered"
]);

export const marketDemandEnum = pgEnum("market_demand", ["high", "medium", "low"]);
export const marketPositionEnum = pgEnum("market_position", ["above", "at", "below"]);

// ENHANCED PRICING & COSTING ENGINE TABLES

// Product Categories for pricing hierarchy
export const productCategories = pgTable("product_categories", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  parentCategoryId: uuid("parent_category_id"), // Self-reference will be added as foreign key constraint
  retailMarkupPercentage: decimal("retail_markup_percentage", { precision: 5, scale: 2 }),
  wholesaleMarkupPercentage: decimal("wholesale_markup_percentage", { precision: 5, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// System-wide markup configuration
export const markupConfiguration = pgTable("markup_configuration", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  level: pricingMarkupLevelEnum("level").notNull(),
  entityId: uuid("entity_id"), // null for system-wide, category_id for category, item_id for item
  retailMarkupPercentage: decimal("retail_markup_percentage", { precision: 5, scale: 2 }).notNull(),
  wholesaleMarkupPercentage: decimal("wholesale_markup_percentage", { precision: 5, scale: 2 }).notNull(),
  effectiveFrom: timestamp("effective_from").defaultNow(),
  effectiveTo: timestamp("effective_to"),
  isActive: boolean("is_active").default(true),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Item pricing with calculated prices
export const itemPricing = pgTable("item_pricing", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: uuid("item_id").notNull(),
  supplierCost: decimal("supplier_cost", { precision: 12, scale: 2 }).notNull(),
  retailPrice: decimal("retail_price", { precision: 12, scale: 2 }).notNull(),
  wholesalePrice: decimal("wholesale_price", { precision: 12, scale: 2 }).notNull(),
  retailMarkupPercentage: decimal("retail_markup_percentage", { precision: 5, scale: 2 }),
  wholesaleMarkupPercentage: decimal("wholesale_markup_percentage", { precision: 5, scale: 2 }),
  isManualOverride: boolean("is_manual_override").default(false),
  overrideReason: text("override_reason"),
  currency: varchar("currency", { length: 3 }).default("USD"),
  effectiveFrom: timestamp("effective_from").defaultNow(),
  effectiveTo: timestamp("effective_to"),
  isActive: boolean("is_active").default(true),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer-specific pricing overrides
export const customerPricing = pgTable("customer_pricing", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: uuid("customer_id").notNull(),
  itemId: uuid("item_id").notNull(),
  specialPrice: decimal("special_price", { precision: 12, scale: 2 }).notNull(),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }),
  minimumQuantity: integer("minimum_quantity").default(1),
  maximumQuantity: integer("maximum_quantity"),
  validFrom: timestamp("valid_from").defaultNow(),
  validTo: timestamp("valid_to"),
  isActive: boolean("is_active").default(true),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pricing rule engine for complex calculations
export const pricingRules = pgTable("pricing_rules", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ruleType: pricingRuleTypeEnum("rule_type").notNull(),
  conditions: jsonb("conditions").notNull(), // JSON conditions for rule application
  actions: jsonb("actions").notNull(), // JSON actions for price calculation
  priority: integer("priority").default(100),
  isActive: boolean("is_active").default(true),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Price list generation and management
export const priceLists = pgTable("price_lists", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // "retail", "wholesale", "custom"
  customerId: uuid("customer_id"), // for customer-specific price lists
  categoryId: uuid("category_id"), // for category-specific price lists
  currency: varchar("currency", { length: 3 }).default("USD"),
  validFrom: timestamp("valid_from").defaultNow(),
  validTo: timestamp("valid_to"),
  generatedAt: timestamp("generated_at"),
  fileUrl: varchar("file_url", { length: 500 }),
  downloadCount: integer("download_count").default(0),
  isActive: boolean("is_active").default(true),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Price list items for generated lists
export const priceListItems = pgTable("price_list_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  priceListId: uuid("price_list_id").notNull(),
  itemId: uuid("item_id").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  effectivePrice: decimal("effective_price", { precision: 12, scale: 2 }).notNull(),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }),
  minimumQuantity: integer("minimum_quantity").default(1),
  notes: text("notes"),
});

// Price change history for audit trail
export const priceChangeHistory = pgTable("price_change_history", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: uuid("item_id").notNull(),
  changeType: varchar("change_type", { length: 50 }).notNull(), // "cost_update", "markup_change", "manual_override"
  oldSupplierCost: decimal("old_supplier_cost", { precision: 12, scale: 2 }),
  newSupplierCost: decimal("new_supplier_cost", { precision: 12, scale: 2 }),
  oldRetailPrice: decimal("old_retail_price", { precision: 12, scale: 2 }),
  newRetailPrice: decimal("new_retail_price", { precision: 12, scale: 2 }),
  oldWholesalePrice: decimal("old_wholesale_price", { precision: 12, scale: 2 }),
  newWholesalePrice: decimal("new_wholesale_price", { precision: 12, scale: 2 }),
  reason: text("reason"),
  triggeredBy: varchar("triggered_by", { length: 100 }), // "system", "manual", "supplier_update"
  userId: uuid("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bulk pricing operations for efficient updates
export const bulkPricingOperations = pgTable("bulk_pricing_operations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  operationType: varchar("operation_type", { length: 50 }).notNull(), // "markup_update", "cost_update", "price_override"
  criteria: jsonb("criteria").notNull(), // JSON criteria for operation
  changes: jsonb("changes").notNull(), // JSON changes to apply
  status: varchar("status", { length: 50 }).default("pending"), // "pending", "processing", "completed", "failed"
  affectedItemsCount: integer("affected_items_count").default(0),
  processedItemsCount: integer("processed_items_count").default(0),
  errorLog: text("error_log"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

// PRICING INSERT SCHEMAS
export const insertProductCategorySchema = createInsertSchema(productCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarkupConfigurationSchema = createInsertSchema(markupConfiguration).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertItemPricingSchema = createInsertSchema(itemPricing).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerPricingSchema = createInsertSchema(customerPricing).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPricingRuleSchema = createInsertSchema(pricingRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPriceListSchema = createInsertSchema(priceLists).omit({
  id: true,
  generatedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPriceListItemSchema = createInsertSchema(priceListItems).omit({
  id: true,
});

export const insertPriceChangeHistorySchema = createInsertSchema(priceChangeHistory).omit({
  id: true,
  createdAt: true,
});

export const insertBulkPricingOperationSchema = createInsertSchema(bulkPricingOperations).omit({
  id: true,
  createdAt: true,
});

// ENHANCED TRADING INDUSTRY PRICING TABLES

// Volume pricing tiers for quantity-based discounts
export const volumePricingTiers = pgTable("volume_pricing_tiers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: uuid("item_id").notNull(),
  customerId: uuid("customer_id"), // null for general, specific customer for custom tiers
  tierName: varchar("tier_name", { length: 100 }).notNull(),
  minQuantity: integer("min_quantity").notNull(),
  maxQuantity: integer("max_quantity"), // null for unlimited
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }),
  specialPrice: decimal("special_price", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("USD"),
  effectiveFrom: timestamp("effective_from").defaultNow(),
  effectiveTo: timestamp("effective_to"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contract pricing for long-term agreements
export const contractPricing = pgTable("contract_pricing", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  contractNumber: varchar("contract_number", { length: 50 }).unique().notNull(),
  customerId: uuid("customer_id").notNull(),
  supplierId: uuid("supplier_id"),
  itemId: uuid("item_id").notNull(),
  contractPrice: decimal("contract_price", { precision: 12, scale: 2 }).notNull(),
  minimumQuantity: integer("minimum_quantity"),
  maximumQuantity: integer("maximum_quantity"),
  currency: varchar("currency", { length: 3 }).default("USD"),
  contractStartDate: timestamp("contract_start_date").notNull(),
  contractEndDate: timestamp("contract_end_date").notNull(),
  priceProtectionClause: text("price_protection_clause"),
  autoRenewal: boolean("auto_renewal").default(false),
  renewalNoticeDays: integer("renewal_notice_days").default(30),
  status: varchar("status", { length: 20 }).default("active"), // active, expired, cancelled, suspended
  terms: text("terms"),
  createdBy: uuid("created_by"),
  approvedBy: uuid("approved_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Competitive pricing analysis
export const competitorPricing = pgTable("competitor_pricing", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  competitorName: varchar("competitor_name", { length: 255 }).notNull(),
  itemId: uuid("item_id").notNull(),
  competitorSku: varchar("competitor_sku", { length: 100 }),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  source: varchar("source", { length: 100 }), // website, catalog, direct_quote, etc.
  sourceUrl: varchar("source_url", { length: 500 }),
  verifiedAt: timestamp("verified_at").defaultNow(),
  isActive: boolean("is_active").default(true),
  notes: text("notes"),
  collectedBy: uuid("collected_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Dynamic pricing configurations
export const dynamicPricingConfig = pgTable("dynamic_pricing_config", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: uuid("item_id").notNull(),
  categoryId: uuid("category_id"),
  customerId: uuid("customer_id"),
  enabled: boolean("enabled").default(false),
  
  // Market factors
  marketDemandFactor: decimal("market_demand_factor", { precision: 3, scale: 2 }).default("1.00"),
  seasonalFactor: decimal("seasonal_factor", { precision: 3, scale: 2 }).default("1.00"),
  competitorFactor: decimal("competitor_factor", { precision: 3, scale: 2 }).default("1.00"),
  inventoryFactor: decimal("inventory_factor", { precision: 3, scale: 2 }).default("1.00"),
  
  // Constraints
  minPrice: decimal("min_price", { precision: 12, scale: 2 }),
  maxPrice: decimal("max_price", { precision: 12, scale: 2 }),
  minMarginPercentage: decimal("min_margin_percentage", { precision: 5, scale: 2 }).default("10.00"),
  maxMarkupPercentage: decimal("max_markup_percentage", { precision: 5, scale: 2 }),
  
  // Update frequency
  updateFrequencyHours: integer("update_frequency_hours").default(24),
  lastUpdated: timestamp("last_updated").defaultNow(),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pricing calculation history and analytics
export const pricingCalculations = pgTable("pricing_calculations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: uuid("item_id").notNull(),
  customerId: uuid("customer_id"),
  method: pricingMethodEnum("method").notNull(),
  
  // Input parameters
  costPrice: decimal("cost_price", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").default(1),
  requestedCurrency: varchar("requested_currency", { length: 3 }).default("USD"),
  
  // Calculated results
  basePrice: decimal("base_price", { precision: 12, scale: 2 }).notNull(),
  finalPrice: decimal("final_price", { precision: 12, scale: 2 }).notNull(),
  grossMargin: decimal("gross_margin", { precision: 12, scale: 2 }),
  marginPercentage: decimal("margin_percentage", { precision: 5, scale: 2 }),
  markupPercentage: decimal("markup_percentage", { precision: 5, scale: 2 }),
  
  // Applied factors
  volumeDiscount: decimal("volume_discount", { precision: 5, scale: 2 }),
  seasonalAdjustment: decimal("seasonal_adjustment", { precision: 5, scale: 2 }),
  competitiveAdjustment: decimal("competitive_adjustment", { precision: 5, scale: 2 }),
  
  // Metadata
  calculationFactors: jsonb("calculation_factors"), // Array of applied factors
  competitorPrices: jsonb("competitor_prices"), // Array of competitor price data
  validUntil: timestamp("valid_until"),
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

// Currency exchange rates (for multi-currency support)
export const currencyExchangeRates = pgTable("currency_exchange_rates", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  fromCurrency: varchar("from_currency", { length: 3 }).notNull(),
  toCurrency: varchar("to_currency", { length: 3 }).notNull(),
  rate: decimal("rate", { precision: 10, scale: 6 }).notNull(),
  source: varchar("source", { length: 100 }), // ecb, fed, manual, etc.
  effectiveDate: timestamp("effective_date").defaultNow(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Margin analysis and reporting
export const marginAnalysis = pgTable("margin_analysis", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: uuid("item_id").notNull(),
  customerId: uuid("customer_id"),
  categoryId: uuid("category_id"),
  
  // Time period
  analysisDate: timestamp("analysis_date").defaultNow(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  // Volume metrics
  totalQuantitySold: integer("total_quantity_sold").default(0),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0"),
  totalCost: decimal("total_cost", { precision: 12, scale: 2 }).default("0"),
  
  // Margin metrics
  averageSellingPrice: decimal("average_selling_price", { precision: 12, scale: 2 }),
  averageCost: decimal("average_cost", { precision: 12, scale: 2 }),
  grossMargin: decimal("gross_margin", { precision: 12, scale: 2 }),
  marginPercentage: decimal("margin_percentage", { precision: 5, scale: 2 }),
  
  // Performance indicators
  marginTrend: varchar("margin_trend", { length: 20 }), // increasing, decreasing, stable
  profitabilityRating: varchar("profitability_rating", { length: 20 }), // excellent, good, fair, poor
  recommendedAction: text("recommended_action"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced insert schemas
export const insertVolumePricingTierSchema = createInsertSchema(volumePricingTiers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContractPricingSchema = createInsertSchema(contractPricing).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompetitorPricingSchema = createInsertSchema(competitorPricing).omit({
  id: true,
  createdAt: true,
});

export const insertDynamicPricingConfigSchema = createInsertSchema(dynamicPricingConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPricingCalculationSchema = createInsertSchema(pricingCalculations).omit({
  id: true,
  calculatedAt: true,
});

export const insertCurrencyExchangeRateSchema = createInsertSchema(currencyExchangeRates).omit({
  id: true,
  createdAt: true,
});

export const insertMarginAnalysisSchema = createInsertSchema(marginAnalysis).omit({
  id: true,
  createdAt: true,
});

// ENHANCED PRICING TYPE EXPORTS
export type ProductCategory = typeof productCategories.$inferSelect;
export type MarkupConfiguration = typeof markupConfiguration.$inferSelect;
export type ItemPricing = typeof itemPricing.$inferSelect;
export type CustomerPricing = typeof customerPricing.$inferSelect;
export type PricingRule = typeof pricingRules.$inferSelect;
export type PriceList = typeof priceLists.$inferSelect;

// New enhanced types
export type VolumePricingTier = typeof volumePricingTiers.$inferSelect;
export type ContractPricing = typeof contractPricing.$inferSelect;
export type CompetitorPricing = typeof competitorPricing.$inferSelect;
export type DynamicPricingConfig = typeof dynamicPricingConfig.$inferSelect;
export type PricingCalculation = typeof pricingCalculations.$inferSelect;
export type CurrencyExchangeRate = typeof currencyExchangeRates.$inferSelect;
export type MarginAnalysis = typeof marginAnalysis.$inferSelect;
export type PriceListItem = typeof priceListItems.$inferSelect;
export type PriceChangeHistory = typeof priceChangeHistory.$inferSelect;
export type BulkPricingOperation = typeof bulkPricingOperations.$inferSelect;

export type InsertProductCategory = typeof insertProductCategorySchema;
export type InsertMarkupConfiguration = typeof insertMarkupConfigurationSchema;
export type InsertItemPricing = typeof insertItemPricingSchema;
export type InsertCustomerPricing = typeof insertCustomerPricingSchema;
export type InsertPricingRule = typeof insertPricingRuleSchema;
export type InsertPriceList = typeof insertPriceListSchema;
export type InsertPriceListItem = typeof insertPriceListItemSchema;
export type InsertPriceChangeHistory = typeof insertPriceChangeHistorySchema;
export type InsertBulkPricingOperation = typeof insertBulkPricingOperationSchema;
