import { eq, and, gte, lte, desc, asc, isNull, sql, or, like } from "drizzle-orm";
import { db } from "../db.js";
import {
  volumePricingTiers,
  contractPricing, 
  competitorPricing,
  dynamicPricingConfig,
  pricingCalculations,
  currencyExchangeRates,
  marginAnalysis,
  itemPricing,
  markupConfiguration,
  productCategories,
  type VolumePricingTier,
  type ContractPricing,
  type CompetitorPricing,
  type DynamicPricingConfig,
  type PricingCalculation,
  type CurrencyExchangeRate,
  type MarginAnalysis
} from "@shared/schemas/pricing";
import {
  items,
  customers,
} from "@shared/schema";
import { BaseStorage } from './base.js';
import { pricingEngine, PricingMethod, type PricingConfiguration, type PricingResult } from '../services/pricing-engine.js';

export class EnhancedPricingStorage extends BaseStorage {

  // Volume Pricing Tiers Management
  async getVolumePricingTiers(itemId?: string, customerId?: string) {
    const conditions = [];
    
    if (itemId) {
      conditions.push(eq(volumePricingTiers.itemId, itemId));
    }
    
    if (customerId) {
      conditions.push(eq(volumePricingTiers.customerId, customerId));
    }
    
    conditions.push(eq(volumePricingTiers.isActive, true));
    
    return await db
      .select()
      .from(volumePricingTiers)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(volumePricingTiers.minQuantity));
  }

  async createVolumePricingTier(tier: any): Promise<VolumePricingTier> {
    const [created] = await db.insert(volumePricingTiers).values(tier).returning();
    
    await this.logAuditEvent(
      "volume_pricing_tier",
      created.id,
      "created",
      tier.customerId || "system",
      null,
      created
    );
    
    return created;
  }

  async updateVolumePricingTier(id: string, updates: any): Promise<VolumePricingTier> {
    const existing = await this.getVolumePricingTier(id);
    if (!existing) {
      throw new Error("Volume pricing tier not found");
    }

    const [updated] = await db
      .update(volumePricingTiers)
      .set({ ...updates, updatedAt: this.getCurrentTimestamp() })
      .where(eq(volumePricingTiers.id, id))
      .returning();

    await this.logAuditEvent(
      "volume_pricing_tier",
      id,
      "updated",
      updates.customerId || "system",
      existing,
      updated
    );

    return updated;
  }

  async getVolumePricingTier(id: string): Promise<VolumePricingTier | undefined> {
    const [tier] = await db
      .select()
      .from(volumePricingTiers)
      .where(eq(volumePricingTiers.id, id))
      .limit(1);
    
    return tier;
  }

  // Contract Pricing Management
  async getContractPricing(filters?: {
    customerId?: string;
    itemId?: string;
    status?: string;
    activeOnly?: boolean;
  }) {
    const conditions = [];
    
    if (filters?.customerId) {
      conditions.push(eq(contractPricing.customerId, filters.customerId));
    }
    
    if (filters?.itemId) {
      conditions.push(eq(contractPricing.itemId, filters.itemId));
    }
    
    if (filters?.status) {
      conditions.push(eq(contractPricing.status, filters.status));
    }
    
    if (filters?.activeOnly) {
      const now = new Date();
      conditions.push(
        and(
          eq(contractPricing.status, "active"),
          lte(contractPricing.contractStartDate, now),
          gte(contractPricing.contractEndDate, now)
        )
      );
    }
    
    return await db
      .select()
      .from(contractPricing)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(contractPricing.contractStartDate));
  }

  async createContractPricing(contract: any): Promise<ContractPricing> {
    // Generate contract number if not provided
    const contractNumber = contract.contractNumber || this.generateNumber("CNT");
    
    const contractData = {
      ...contract,
      contractNumber
    };

    const [created] = await db.insert(contractPricing).values(contractData).returning();
    
    await this.logAuditEvent(
      "contract_pricing",
      created.id,
      "created",
      contract.createdBy || "system",
      null,
      created
    );
    
    return created;
  }

  async updateContractPricing(id: string, updates: any): Promise<ContractPricing> {
    const existing = await this.getContractPricing({ customerId: updates.customerId });
    
    const [updated] = await db
      .update(contractPricing)
      .set({ ...updates, updatedAt: this.getCurrentTimestamp() })
      .where(eq(contractPricing.id, id))
      .returning();

    await this.logAuditEvent(
      "contract_pricing",
      id,
      "updated",
      updates.createdBy || "system",
      existing,
      updated
    );

    return updated;
  }

  // Competitor Pricing Management
  async getCompetitorPricing(itemId?: string, competitorName?: string) {
    const conditions = [];
    
    if (itemId) {
      conditions.push(eq(competitorPricing.itemId, itemId));
    }
    
    if (competitorName) {
      conditions.push(like(competitorPricing.competitorName, `%${competitorName}%`));
    }
    
    conditions.push(eq(competitorPricing.isActive, true));
    
    return await db
      .select()
      .from(competitorPricing)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(competitorPricing.verifiedAt));
  }

  async createCompetitorPricing(pricing: any): Promise<CompetitorPricing> {
    const [created] = await db.insert(competitorPricing).values(pricing).returning();
    
    await this.logAuditEvent(
      "competitor_pricing",
      created.id,
      "created",
      pricing.collectedBy || "system",
      null,
      created
    );
    
    return created;
  }

  async updateCompetitorPricing(id: string, updates: any): Promise<CompetitorPricing> {
    const [updated] = await db
      .update(competitorPricing)
      .set(updates)
      .where(eq(competitorPricing.id, id))
      .returning();

    await this.logAuditEvent(
      "competitor_pricing",
      id,
      "updated",
      updates.collectedBy || "system",
      null,
      updated
    );

    return updated;
  }

  // Dynamic Pricing Configuration
  async getDynamicPricingConfig(itemId?: string, customerId?: string) {
    const conditions = [];
    
    if (itemId) {
      conditions.push(eq(dynamicPricingConfig.itemId, itemId));
    }
    
    if (customerId) {
      conditions.push(eq(dynamicPricingConfig.customerId, customerId));
    }
    
    conditions.push(eq(dynamicPricingConfig.isActive, true));
    
    return await db
      .select()
      .from(dynamicPricingConfig)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(dynamicPricingConfig.updatedAt));
  }

  async createDynamicPricingConfig(config: any): Promise<DynamicPricingConfig> {
    const [created] = await db.insert(dynamicPricingConfig).values(config).returning();
    
    await this.logAuditEvent(
      "dynamic_pricing_config",
      created.id,
      "created",
      "system",
      null,
      created
    );
    
    return created;
  }

  async updateDynamicPricingConfig(id: string, updates: any): Promise<DynamicPricingConfig> {
    const [updated] = await db
      .update(dynamicPricingConfig)
      .set({ ...updates, updatedAt: this.getCurrentTimestamp() })
      .where(eq(dynamicPricingConfig.id, id))
      .returning();

    await this.logAuditEvent(
      "dynamic_pricing_config",
      id,
      "updated",
      "system",
      null,
      updated
    );

    return updated;
  }

  // Currency Exchange Rates
  async getCurrencyExchangeRates(fromCurrency?: string, toCurrency?: string) {
    const conditions = [];
    
    if (fromCurrency) {
      conditions.push(eq(currencyExchangeRates.fromCurrency, fromCurrency));
    }
    
    if (toCurrency) {
      conditions.push(eq(currencyExchangeRates.toCurrency, toCurrency));
    }
    
    conditions.push(eq(currencyExchangeRates.isActive, true));
    
    return await db
      .select()
      .from(currencyExchangeRates)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(currencyExchangeRates.effectiveDate));
  }

  async createCurrencyExchangeRate(rate: any): Promise<CurrencyExchangeRate> {
    const [created] = await db.insert(currencyExchangeRates).values(rate).returning();
    
    await this.logAuditEvent(
      "currency_exchange_rate",
      created.id,
      "created",
      "system",
      null,
      created
    );
    
    return created;
  }

  // Pricing Calculations with Enhanced Engine
  async calculateItemPrice(
    itemId: string,
    customerId: string,
    quantity: number = 1,
    method?: PricingMethod
  ): Promise<PricingResult> {
    try {
      // Use the enhanced pricing engine
      let result: PricingResult;
      
      if (method) {
        // Get item and customer details for configuration
        const [item] = await db.select().from(items).where(eq(items.id, itemId)).limit(1);
        const [customer] = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
        
        if (!item || !customer) {
          throw new Error("Item or customer not found");
        }

        // Get volume tiers if using volume pricing
        const volumeTiers = await this.getVolumePricingTiers(itemId, customerId);
        
        // Get competitor pricing
        const competitorPrices = await this.getCompetitorPricing(itemId);
        const competitorPriceValues = competitorPrices.map(cp => parseFloat(cp.price.toString()));

        // Build configuration
        const config: PricingConfiguration = {
          itemId,
          customerId,
          customerType: customer.customerType,
          method,
          baseCurrency: "BHD",
          targetCurrency: "BHD",
          volumeTiers: volumeTiers.map(vt => ({
            minQuantity: vt.minQuantity,
            maxQuantity: vt.maxQuantity || undefined,
            discountPercentage: parseFloat(vt.discountPercentage?.toString() || "0"),
            specialPrice: vt.specialPrice ? parseFloat(vt.specialPrice.toString()) : undefined
          })),
          competitorPrices: competitorPriceValues
        };

        result = await pricingEngine.calculatePrice(config, quantity);
      } else {
        // Use optimal pricing calculation
        result = await pricingEngine.calculateOptimalPrice(itemId, customerId, quantity);
      }

      // Store calculation in history
      await this.storePricingCalculation(result, quantity);

      return result;
    } catch (error) {
      console.error("Error calculating item price:", error);
      throw error;
    }
  }

  async calculateBatchPrices(
    itemIds: string[],
    customerId: string,
    quantities?: number[]
  ): Promise<PricingResult[]> {
    return await pricingEngine.calculateBatchPrices(itemIds, customerId, quantities);
  }

  private async storePricingCalculation(result: PricingResult, quantity: number): Promise<void> {
    const calculationData: any = {
      itemId: result.itemId,
      customerId: result.customerId,
      method: result.method as any,
      costPrice: result.costPrice.toString(),
      quantity,
      requestedCurrency: result.baseCurrency,
      basePrice: result.basePrice.toString(),
      finalPrice: result.finalPrice.toString(),
      grossMargin: result.grossMargin.toString(),
      marginPercentage: result.marginPercentage.toString(),
      markupPercentage: result.markupPercentage.toString(),
      volumeDiscount: result.appliedVolumeDiscount?.toString() || "0",
      calculationFactors: result.factors,
      competitorPrices: result.competitorAverage ? [result.competitorAverage] : null,
      validUntil: result.validUntil || null
    };

  await db.insert(pricingCalculations).values(calculationData as any);
  }

  // Margin Analysis
  async generateMarginAnalysis(
    itemId?: string,
    customerId?: string,
    categoryId?: string,
    periodStart?: Date,
    periodEnd?: Date
  ): Promise<MarginAnalysis> {
    const analysisDate = new Date();
    const defaultPeriodStart = periodStart || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const defaultPeriodEnd = periodEnd || new Date();

    // Aggregate sales data for the period (this would typically come from sales order items)
  const mockAnalysisData: any = {
      itemId: itemId || "",
      customerId,
      categoryId,
      analysisDate,
      periodStart: defaultPeriodStart,
      periodEnd: defaultPeriodEnd,
      totalQuantitySold: 100,
      totalRevenue: "15000.00",
      totalCost: "9000.00",
      averageSellingPrice: "150.00",
      averageCost: "90.00",
      grossMargin: "6000.00",
      marginPercentage: "40.00",
      marginTrend: "stable",
      profitabilityRating: "good",
      recommendedAction: "Maintain current pricing strategy. Consider volume discounts for quantities above 50 units."
    };

    const [created] = await db.insert(marginAnalysis).values(mockAnalysisData).returning();
    return created;
  }

  async getMarginAnalysis(filters?: {
    itemId?: string;
    customerId?: string;
    categoryId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    const conditions = [];
    
    if (filters?.itemId) {
      conditions.push(eq(marginAnalysis.itemId, filters.itemId));
    }
    
    if (filters?.customerId) {
      conditions.push(eq(marginAnalysis.customerId, filters.customerId));
    }
    
    if (filters?.categoryId) {
      conditions.push(eq(marginAnalysis.categoryId, filters.categoryId));
    }
    
    if (filters?.dateFrom) {
      conditions.push(gte(marginAnalysis.analysisDate, filters.dateFrom));
    }
    
    if (filters?.dateTo) {
      conditions.push(lte(marginAnalysis.analysisDate, filters.dateTo));
    }
    
    return await db
      .select()
      .from(marginAnalysis)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(marginAnalysis.analysisDate));
  }

  // Advanced Pricing Reports
  async getPricingPerformanceReport(dateFrom: Date, dateTo: Date) {
    const calculations = await db
      .select()
      .from(pricingCalculations)
      .where(
        and(
          gte(pricingCalculations.calculatedAt, dateFrom),
          lte(pricingCalculations.calculatedAt, dateTo)
        )
      )
      .orderBy(desc(pricingCalculations.calculatedAt));

    // Aggregate performance metrics
    const totalCalculations = calculations.length;
    const averageMargin = calculations.reduce((sum, calc) => 
      sum + parseFloat(calc.marginPercentage?.toString() || "0"), 0) / totalCalculations;
    
    const methodDistribution = calculations.reduce((acc, calc) => {
      acc[calc.method] = (acc[calc.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      period: { from: dateFrom, to: dateTo },
      totalCalculations,
      averageMargin: averageMargin.toFixed(2),
      methodDistribution,
      calculations: calculations.slice(0, 100) // Return top 100 for display
    };
  }

  async getCompetitivePositionReport(itemId?: string) {
    const conditions = itemId ? [eq(competitorPricing.itemId, itemId)] : [];
    conditions.push(eq(competitorPricing.isActive, true));

    const competitorData = await db
      .select()
      .from(competitorPricing)
      .where(and(...conditions))
      .orderBy(desc(competitorPricing.verifiedAt));

    // Group by item and analyze positioning
    const itemAnalysis = competitorData.reduce((acc, pricing) => {
      const key = pricing.itemId;
      if (!acc[key]) {
        acc[key] = {
          itemId: key,
          competitorCount: 0,
          prices: [],
          averagePrice: 0,
          minPrice: Number.MAX_VALUE,
          maxPrice: 0
        };
      }
      
      const price = parseFloat(pricing.price.toString());
      acc[key].competitorCount++;
      acc[key].prices.push(price);
      acc[key].minPrice = Math.min(acc[key].minPrice, price);
      acc[key].maxPrice = Math.max(acc[key].maxPrice, price);
      
      return acc;
    }, {} as Record<string, any>);

    // Calculate averages
    Object.values(itemAnalysis).forEach((analysis: any) => {
      analysis.averagePrice = analysis.prices.reduce((a: number, b: number) => a + b, 0) / analysis.prices.length;
    });

    return Object.values(itemAnalysis);
  }
}

export const enhancedPricingStorage = new EnhancedPricingStorage();