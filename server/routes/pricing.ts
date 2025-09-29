import { Router, type Express } from "express";
import { z } from "zod";
import { enhancedPricingStorage } from "../storage/pricing-storage.js";
import { pricingEngine, PricingMethod } from "../services/pricing-engine.js";

const router = Router();

// Input validation schemas
const calculatePriceSchema = z.object({
  itemId: z.string().uuid("Invalid item ID"),
  customerId: z.string().uuid("Invalid customer ID"),
  quantity: z.number().min(1, "Quantity must be at least 1").default(1),
  method: z.enum([
    "cost_plus",
    "margin_based", 
    "competitive",
    "value_based",
    "dynamic",
    "contract",
    "volume_tiered"
  ]).optional(),
  targetCurrency: z.string().length(3, "Currency must be 3 characters").default("BHD")
});

const batchCalculatePricesSchema = z.object({
  items: z.array(z.object({
    itemId: z.string().uuid(),
    quantity: z.number().min(1).default(1)
  })),
  customerId: z.string().uuid("Invalid customer ID"),
  targetCurrency: z.string().length(3).default("BHD")
});

const volumeTierSchema = z.object({
  itemId: z.string().uuid("Invalid item ID"),
  customerId: z.string().uuid("Invalid customer ID").optional(),
  tierName: z.string().min(1, "Tier name is required"),
  minQuantity: z.number().min(1, "Minimum quantity must be at least 1"),
  maxQuantity: z.number().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  specialPrice: z.number().min(0).optional(),
  currency: z.string().length(3).default("BHD"),
  effectiveFrom: z.string().datetime().optional(),
  effectiveTo: z.string().datetime().optional()
});

const contractPricingSchema = z.object({
  contractNumber: z.string().min(1, "Contract number is required").optional(),
  customerId: z.string().uuid("Invalid customer ID"),
  supplierId: z.string().uuid("Invalid supplier ID").optional(),
  itemId: z.string().uuid("Invalid item ID"),
  contractPrice: z.number().min(0, "Contract price must be positive"),
  minimumQuantity: z.number().min(0).optional(),
  maximumQuantity: z.number().min(0).optional(),
  currency: z.string().length(3).default("BHD"),
  contractStartDate: z.string().datetime(),
  contractEndDate: z.string().datetime(),
  priceProtectionClause: z.string().optional(),
  autoRenewal: z.boolean().default(false),
  renewalNoticeDays: z.number().min(1).default(30),
  terms: z.string().optional(),
  createdBy: z.string().uuid().optional()
});

const competitorPricingSchema = z.object({
  competitorName: z.string().min(1, "Competitor name is required"),
  itemId: z.string().uuid("Invalid item ID"),
  competitorSku: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  currency: z.string().length(3).default("BHD"),
  source: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  notes: z.string().optional(),
  collectedBy: z.string().uuid().optional()
});

const dynamicPricingConfigSchema = z.object({
  itemId: z.string().uuid("Invalid item ID"),
  categoryId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  enabled: z.boolean().default(false),
  marketDemandFactor: z.number().min(0.1).max(5).default(1.0),
  seasonalFactor: z.number().min(0.1).max(5).default(1.0),
  competitorFactor: z.number().min(0.1).max(5).default(1.0),
  inventoryFactor: z.number().min(0.1).max(5).default(1.0),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minMarginPercentage: z.number().min(0).max(100).default(10),
  maxMarkupPercentage: z.number().min(0).optional(),
  updateFrequencyHours: z.number().min(1).default(24)
});

const currencyRateSchema = z.object({
  fromCurrency: z.string().length(3, "Currency must be 3 characters"),
  toCurrency: z.string().length(3, "Currency must be 3 characters"),
  rate: z.number().min(0, "Rate must be positive"),
  source: z.string().optional(),
  effectiveDate: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional()
});

const marginAnalysisSchema = z.object({
  itemId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime()
});

// Enhanced Pricing Calculation Routes
router.post("/calculate-price", async (req, res) => {
  try {
    const data = calculatePriceSchema.parse(req.body);
    
    const result = await enhancedPricingStorage.calculateItemPrice(
      data.itemId,
      data.customerId,
      data.quantity,
      data.method as PricingMethod
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error calculating price:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid input data", 
        details: error.errors 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to calculate price" 
    });
  }
});

router.post("/calculate-batch-prices", async (req, res) => {
  try {
    const data = batchCalculatePricesSchema.parse(req.body);
    
    const itemIds = data.items.map(item => item.itemId);
    const quantities = data.items.map(item => item.quantity);
    
    const results = await enhancedPricingStorage.calculateBatchPrices(
      itemIds,
      data.customerId,
      quantities
    );
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error("Error calculating batch prices:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid input data", 
        details: error.errors 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to calculate batch prices" 
    });
  }
});

// Volume Pricing Tiers Routes
router.get("/volume-tiers", async (req, res) => {
  try {
    const { itemId, customerId } = req.query;
    
    const tiers = await enhancedPricingStorage.getVolumePricingTiers(
      itemId as string,
      customerId as string
    );
    
    res.json({
      success: true,
      data: tiers
    });
  } catch (error) {
    console.error("Error fetching volume tiers:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch volume pricing tiers" 
    });
  }
});

router.post("/volume-tiers", async (req, res) => {
  try {
    const data = volumeTierSchema.parse(req.body);
    
    const tier = await enhancedPricingStorage.createVolumePricingTier({
      ...data,
      effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : undefined,
      effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : undefined
    });
    
    res.status(201).json({
      success: true,
      data: tier
    });
  } catch (error) {
    console.error("Error creating volume tier:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid input data", 
        details: error.errors 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: "Failed to create volume pricing tier" 
    });
  }
});

router.put("/volume-tiers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = volumeTierSchema.partial().parse(req.body);
    
    const tier = await enhancedPricingStorage.updateVolumePricingTier(id, {
      ...data,
      effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : undefined,
      effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : undefined
    });
    
    res.json({
      success: true,
      data: tier
    });
  } catch (error) {
    console.error("Error updating volume tier:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid input data", 
        details: error.errors 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: "Failed to update volume pricing tier" 
    });
  }
});

// Contract Pricing Routes
router.get("/contract-pricing", async (req, res) => {
  try {
    const { customerId, itemId, status, activeOnly } = req.query;
    
    const contracts = await enhancedPricingStorage.getContractPricing({
      customerId: customerId as string,
      itemId: itemId as string,
      status: status as string,
      activeOnly: activeOnly === "true"
    });
    
    res.json({
      success: true,
      data: contracts
    });
  } catch (error) {
    console.error("Error fetching contract pricing:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch contract pricing" 
    });
  }
});

router.post("/contract-pricing", async (req, res) => {
  try {
    const data = contractPricingSchema.parse(req.body);
    
    const contract = await enhancedPricingStorage.createContractPricing({
      ...data,
      contractStartDate: new Date(data.contractStartDate),
      contractEndDate: new Date(data.contractEndDate)
    });
    
    res.status(201).json({
      success: true,
      data: contract
    });
  } catch (error) {
    console.error("Error creating contract pricing:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid input data", 
        details: error.errors 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: "Failed to create contract pricing" 
    });
  }
});

// Competitor Pricing Routes
router.get("/competitor-pricing", async (req, res) => {
  try {
    const { itemId, competitorName } = req.query;
    
    const pricing = await enhancedPricingStorage.getCompetitorPricing(
      itemId as string,
      competitorName as string
    );
    
    res.json({
      success: true,
      data: pricing
    });
  } catch (error) {
    console.error("Error fetching competitor pricing:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch competitor pricing" 
    });
  }
});

router.post("/competitor-pricing", async (req, res) => {
  try {
    const data = competitorPricingSchema.parse(req.body);
    
    const pricing = await enhancedPricingStorage.createCompetitorPricing(data);
    
    res.status(201).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    console.error("Error creating competitor pricing:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid input data", 
        details: error.errors 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: "Failed to create competitor pricing" 
    });
  }
});

// Dynamic Pricing Configuration Routes
router.get("/dynamic-pricing-config", async (req, res) => {
  try {
    const { itemId, customerId } = req.query;
    
    const configs = await enhancedPricingStorage.getDynamicPricingConfig(
      itemId as string,
      customerId as string
    );
    
    res.json({
      success: true,
      data: configs
    });
  } catch (error) {
    console.error("Error fetching dynamic pricing config:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch dynamic pricing configuration" 
    });
  }
});

router.post("/dynamic-pricing-config", async (req, res) => {
  try {
    const data = dynamicPricingConfigSchema.parse(req.body);
    
    const config = await enhancedPricingStorage.createDynamicPricingConfig(data);
    
    res.status(201).json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error("Error creating dynamic pricing config:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid input data", 
        details: error.errors 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: "Failed to create dynamic pricing configuration" 
    });
  }
});

// Currency Exchange Rates Routes
router.get("/currency-rates", async (req, res) => {
  try {
    const { fromCurrency, toCurrency } = req.query;
    
    const rates = await enhancedPricingStorage.getCurrencyExchangeRates(
      fromCurrency as string,
      toCurrency as string
    );
    
    res.json({
      success: true,
      data: rates
    });
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch currency exchange rates" 
    });
  }
});

router.post("/currency-rates", async (req, res) => {
  try {
    const data = currencyRateSchema.parse(req.body);
    
    const rate = await enhancedPricingStorage.createCurrencyExchangeRate({
      ...data,
      effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
    });
    
    res.status(201).json({
      success: true,
      data: rate
    });
  } catch (error) {
    console.error("Error creating currency rate:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid input data", 
        details: error.errors 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: "Failed to create currency exchange rate" 
    });
  }
});

// Margin Analysis Routes
router.post("/margin-analysis", async (req, res) => {
  try {
    const data = marginAnalysisSchema.parse(req.body);
    
    const analysis = await enhancedPricingStorage.generateMarginAnalysis(
      data.itemId,
      data.customerId,
      data.categoryId,
      new Date(data.periodStart),
      new Date(data.periodEnd)
    );
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error("Error generating margin analysis:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid input data", 
        details: error.errors 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: "Failed to generate margin analysis" 
    });
  }
});

router.get("/margin-analysis", async (req, res) => {
  try {
    const { itemId, customerId, categoryId, dateFrom, dateTo } = req.query;
    
    const analyses = await enhancedPricingStorage.getMarginAnalysis({
      itemId: itemId as string,
      customerId: customerId as string,
      categoryId: categoryId as string,
      dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo: dateTo ? new Date(dateTo as string) : undefined
    });
    
    res.json({
      success: true,
      data: analyses
    });
  } catch (error) {
    console.error("Error fetching margin analysis:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch margin analysis" 
    });
  }
});

// Advanced Reports Routes
router.get("/reports/pricing-performance", async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    
    if (!dateFrom || !dateTo) {
      return res.status(400).json({
        success: false,
        error: "dateFrom and dateTo are required"
      });
    }
    
    const report = await enhancedPricingStorage.getPricingPerformanceReport(
      new Date(dateFrom as string),
      new Date(dateTo as string)
    );
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error("Error generating pricing performance report:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to generate pricing performance report" 
    });
  }
});

router.get("/reports/competitive-position", async (req, res) => {
  try {
    const { itemId } = req.query;
    
    const report = await enhancedPricingStorage.getCompetitivePositionReport(
      itemId as string
    );
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error("Error generating competitive position report:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to generate competitive position report" 
    });
  }
});

// Price Analysis Route
router.get("/price-analysis/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const analysis = await pricingEngine.generatePriceAnalysis(itemId);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error("Error generating price analysis:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to generate price analysis" 
    });
  }
});

export function registerPricingRoutes(app: Express) {
  app.use("/api/pricing", router);
  console.log("✅ Pricing routes registered");
}

export default router;