/**
 * Enhanced Pricing & Costing Engine for Trading Industry
 * Supports multiple calculation methods, volume pricing, currency conversion,
 * margin analysis, and competitive pricing strategies
 */

import { db } from "../db.js";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import {
  items,
  customers,
  suppliers,
  itemPricing,
  markupConfiguration,
  productCategories,
  type Customer,
  type Item,
  type Supplier
} from "@shared/schema";

// Enhanced pricing calculation methods
export enum PricingMethod {
  COST_PLUS = "cost_plus",           // Cost + Fixed Markup
  MARGIN_BASED = "margin_based",     // Price = Cost / (1 - Margin%)
  COMPETITIVE = "competitive",        // Market-based pricing
  VALUE_BASED = "value_based",       // Customer value perception
  DYNAMIC = "dynamic",               // Real-time market pricing
  CONTRACT = "contract",             // Long-term agreement pricing
  VOLUME_TIERED = "volume_tiered"    // Quantity-based pricing tiers
}

// Currency conversion rates (in production, this would come from external API)
export const CURRENCY_RATES = {
  BHD: 1.0, // Treat Bahraini Dinar as base for internal conversions now
  USD: 2.65, // Approx rate: 1 BHD ≈ 2.65 USD (inverse of 0.376)
  AED: 9.95, // 1 BHD ≈ 9.95 AED
  KWD: 0.81, // 1 BHD ≈ 0.81 KWD
  SAR: 9.94, // 1 BHD ≈ 9.94 SAR
  EUR: 0.93, // 1 BHD ≈ 0.93 EUR (approx)
  GBP: 0.79  // 1 BHD ≈ 0.79 GBP (approx)
};

// Volume pricing tiers interface
export interface VolumeTier {
  minQuantity: number;
  maxQuantity?: number;
  discountPercentage: number;
  specialPrice?: number;
}

// Enhanced pricing configuration
export interface PricingConfiguration {
  itemId: string;
  customerId?: string;
  customerType: "Retail" | "Wholesale";
  method: PricingMethod;
  baseCurrency: string;
  targetCurrency: string;
  
  // Cost-plus specific
  markup?: number;
  
  // Margin-based specific  
  targetMargin?: number;
  
  // Volume pricing
  volumeTiers?: VolumeTier[];
  
  // Contract pricing
  contractPrice?: number;
  contractValidFrom?: Date;
  contractValidTo?: Date;
  
  // Dynamic pricing factors
  competitorPrices?: number[];
  marketDemand?: "high" | "medium" | "low";
  seasonalFactor?: number;
  
  // Minimum/Maximum constraints
  minPrice?: number;
  maxPrice?: number;
  minMargin?: number;
}

// Pricing calculation result
export interface PricingResult {
  itemId: string;
  customerId?: string;
  method: PricingMethod;
  
  // Calculated prices
  costPrice: number;
  basePrice: number;
  finalPrice: number;
  
  // Currency conversion
  baseCurrency: string;
  targetCurrency: string;
  conversionRate: number;
  priceInTargetCurrency: number;
  
  // Margin analysis
  grossMargin: number;
  marginPercentage: number;
  markup: number;
  markupPercentage: number;
  
  // Volume pricing
  appliedVolumeDiscount?: number;
  volumeTierApplied?: VolumeTier;
  
  // Competitive analysis
  competitorAverage?: number;
  marketPosition?: "above" | "at" | "below";
  
  // Calculation metadata
  calculatedAt: Date;
  validUntil?: Date;
  factors: string[];
}

export class EnhancedPricingEngine {
  
  /**
   * Calculate comprehensive pricing for an item
   */
  async calculatePrice(config: PricingConfiguration, quantity: number = 1): Promise<PricingResult> {
    // Get base item cost
    const item = await this.getItemWithCost(config.itemId);
    if (!item) {
      throw new Error(`Item not found: ${config.itemId}`);
    }
    
    const costPrice = parseFloat(item.costPrice || "0");
    let basePrice = costPrice;
    let finalPrice = costPrice;
    const factors: string[] = [];
    
    // Apply pricing method
    switch (config.method) {
      case PricingMethod.COST_PLUS:
        finalPrice = this.calculateCostPlus(costPrice, config.markup || 0);
        factors.push(`Cost-plus with ${config.markup}% markup`);
        break;
        
      case PricingMethod.MARGIN_BASED:
        finalPrice = this.calculateMarginBased(costPrice, config.targetMargin || 0);
        factors.push(`Margin-based with ${config.targetMargin}% target margin`);
        break;
        
      case PricingMethod.COMPETITIVE:
        finalPrice = this.calculateCompetitive(costPrice, config.competitorPrices || []);
        factors.push("Competitive pricing based on market analysis");
        break;
        
      case PricingMethod.VOLUME_TIERED:
        finalPrice = this.calculateVolumeTiered(costPrice, quantity, config.volumeTiers || []);
        factors.push(`Volume pricing for quantity ${quantity}`);
        break;
        
      case PricingMethod.DYNAMIC:
        finalPrice = this.calculateDynamic(costPrice, config);
        factors.push("Dynamic pricing with market factors");
        break;
        
      case PricingMethod.CONTRACT:
        finalPrice = config.contractPrice || costPrice;
        factors.push("Contract pricing");
        break;
        
      default:
        // Fallback to existing markup logic
        const markup = config.customerType === "Retail" ? 0.7 : 0.4;
        finalPrice = costPrice * (1 + markup);
        factors.push(`Default ${config.customerType} markup: ${markup * 100}%`);
    }
    
    basePrice = finalPrice;
    
    // Apply volume discounts if configured
    const volumeResult = this.applyVolumeDiscounts(finalPrice, quantity, config.volumeTiers || []);
    finalPrice = volumeResult.price;
    
    if (volumeResult.discount > 0) {
      factors.push(`Volume discount: ${volumeResult.discount}%`);
    }
    
    // Apply seasonal factors
    if (config.seasonalFactor && config.seasonalFactor !== 1) {
      finalPrice *= config.seasonalFactor;
      factors.push(`Seasonal factor: ${config.seasonalFactor}`);
    }
    
    // Apply min/max constraints
    if (config.minPrice && finalPrice < config.minPrice) {
      finalPrice = config.minPrice;
      factors.push(`Applied minimum price: ${config.minPrice}`);
    }
    
    if (config.maxPrice && finalPrice > config.maxPrice) {
      finalPrice = config.maxPrice;
      factors.push(`Applied maximum price: ${config.maxPrice}`);
    }
    
    // Currency conversion
    const conversionRate = this.getCurrencyRate(config.baseCurrency, config.targetCurrency);
    const priceInTargetCurrency = finalPrice * conversionRate;
    
    // Calculate margins and markup
    const grossMargin = finalPrice - costPrice;
    const marginPercentage = (grossMargin / finalPrice) * 100;
    const markup = finalPrice - costPrice;
    const markupPercentage = (markup / costPrice) * 100;
    
    // Competitive analysis
    let competitorAverage: number | undefined;
    let marketPosition: "above" | "at" | "below" | undefined;
    
    if (config.competitorPrices && config.competitorPrices.length > 0) {
      competitorAverage = config.competitorPrices.reduce((a, b) => a + b, 0) / config.competitorPrices.length;
      
      if (finalPrice > competitorAverage * 1.1) marketPosition = "above";
      else if (finalPrice < competitorAverage * 0.9) marketPosition = "below";
      else marketPosition = "at";
    }
    
    return {
      itemId: config.itemId,
      customerId: config.customerId,
      method: config.method,
      
      costPrice,
      basePrice,
      finalPrice,
      
      baseCurrency: config.baseCurrency,
      targetCurrency: config.targetCurrency,
      conversionRate,
      priceInTargetCurrency,
      
      grossMargin,
      marginPercentage,
      markup,
      markupPercentage,
      
      appliedVolumeDiscount: volumeResult.discount,
      volumeTierApplied: volumeResult.tier,
      
      competitorAverage,
      marketPosition,
      
      calculatedAt: new Date(),
      validUntil: config.contractValidTo,
      factors
    };
  }
  
  /**
   * Cost-plus pricing: Cost + Fixed Markup
   */
  private calculateCostPlus(cost: number, markupPercentage: number): number {
    return cost * (1 + markupPercentage / 100);
  }
  
  /**
   * Margin-based pricing: Price = Cost / (1 - Margin%)
   */
  private calculateMarginBased(cost: number, targetMarginPercentage: number): number {
    if (targetMarginPercentage >= 100) {
      throw new Error("Target margin cannot be 100% or higher");
    }
    return cost / (1 - targetMarginPercentage / 100);
  }
  
  /**
   * Competitive pricing based on competitor analysis
   */
  private calculateCompetitive(cost: number, competitorPrices: number[]): number {
    if (competitorPrices.length === 0) {
      return cost * 1.3; // Default 30% markup if no competitor data
    }
    
    // Strategy: Price slightly below average competitor price, but maintain minimum margin
    const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
    const targetPrice = avgCompetitorPrice * 0.95; // 5% below average
    
    // Ensure minimum 20% margin
    const minPrice = cost / (1 - 0.20);
    
    return Math.max(targetPrice, minPrice);
  }
  
  /**
   * Volume-tiered pricing with quantity discounts
   */
  private calculateVolumeTiered(cost: number, quantity: number, tiers: VolumeTier[]): number {
    const defaultMarkup = 0.4; // 40% default markup
    let basePrice = cost * (1 + defaultMarkup);
    
    // Find applicable tier
    const applicableTier = tiers.find(tier => 
      quantity >= tier.minQuantity && 
      (!tier.maxQuantity || quantity <= tier.maxQuantity)
    );
    
    if (applicableTier) {
      if (applicableTier.specialPrice) {
        return applicableTier.specialPrice;
      } else {
        return basePrice * (1 - applicableTier.discountPercentage / 100);
      }
    }
    
    return basePrice;
  }
  
  /**
   * Dynamic pricing with market factors
   */
  private calculateDynamic(cost: number, config: PricingConfiguration): number {
    let price = cost * 1.3; // Base 30% markup
    
    // Adjust for market demand
    if (config.marketDemand === "high") price *= 1.1;
    else if (config.marketDemand === "low") price *= 0.9;
    
    // Adjust for competitor prices
    if (config.competitorPrices && config.competitorPrices.length > 0) {
      const avgCompetitor = config.competitorPrices.reduce((a, b) => a + b, 0) / config.competitorPrices.length;
      
      // Stay within 10% of competitor average
      if (price > avgCompetitor * 1.1) price = avgCompetitor * 1.05;
      else if (price < avgCompetitor * 0.9) price = avgCompetitor * 0.95;
    }
    
    return price;
  }
  
  /**
   * Apply volume discounts to calculated price
   */
  private applyVolumeDiscounts(price: number, quantity: number, tiers: VolumeTier[]): {
    price: number;
    discount: number;
    tier?: VolumeTier;
  } {
    const applicableTier = tiers.find(tier => 
      quantity >= tier.minQuantity && 
      (!tier.maxQuantity || quantity <= tier.maxQuantity)
    );
    
    if (applicableTier) {
      const discountedPrice = price * (1 - applicableTier.discountPercentage / 100);
      return {
        price: discountedPrice,
        discount: applicableTier.discountPercentage,
        tier: applicableTier
      };
    }
    
    return { price, discount: 0 };
  }
  
  /**
   * Get currency conversion rate
   */
  private getCurrencyRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return 1.0;
    
    const fromRate = CURRENCY_RATES[fromCurrency as keyof typeof CURRENCY_RATES] || 1.0;
    const toRate = CURRENCY_RATES[toCurrency as keyof typeof CURRENCY_RATES] || 1.0;
    
    return toRate / fromRate;
  }
  
  /**
   * Get item with cost information
   */
  private async getItemWithCost(itemId: string): Promise<Item | undefined> {
    const [item] = await db
      .select()
      .from(items)
      .where(eq(items.id, itemId))
      .limit(1);
    
    return item;
  }
  
  /**
   * Calculate optimal pricing for customer type and quantity
   */
  async calculateOptimalPrice(
    itemId: string, 
    customerId: string, 
    quantity: number = 1
  ): Promise<PricingResult> {
    // Get customer details
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);
    
    if (!customer) {
      throw new Error(`Customer not found: ${customerId}`);
    }
    
    // Get item category for markup configuration
    const item = await this.getItemWithCost(itemId);
    if (!item) {
      throw new Error(`Item not found: ${itemId}`);
    }
    
    // Determine pricing method based on customer type and quantity
    let method = PricingMethod.MARGIN_BASED;
    let targetMargin = customer.customerType === "Retail" ? 70 : 40;
    
    // Use volume pricing for large quantities
    if (quantity >= 100) {
      method = PricingMethod.VOLUME_TIERED;
    }
    
    // Create volume tiers for trading scenarios
    const volumeTiers: VolumeTier[] = [
      { minQuantity: 1, maxQuantity: 9, discountPercentage: 0 },
      { minQuantity: 10, maxQuantity: 49, discountPercentage: 5 },
      { minQuantity: 50, maxQuantity: 99, discountPercentage: 10 },
      { minQuantity: 100, maxQuantity: 499, discountPercentage: 15 },
      { minQuantity: 500, discountPercentage: 20 }
    ];
    
    const config: PricingConfiguration = {
      itemId,
      customerId,
      customerType: customer.customerType,
      method,
      baseCurrency: "USD",
      targetCurrency: "USD",
      targetMargin,
      volumeTiers,
      minMargin: 10 // Minimum 10% margin
    };
    
    return this.calculatePrice(config, quantity);
  }
  
  /**
   * Batch calculate prices for multiple items
   */
  async calculateBatchPrices(
    itemIds: string[],
    customerId: string,
    quantities: number[] = []
  ): Promise<PricingResult[]> {
    const results: PricingResult[] = [];
    
    for (let i = 0; i < itemIds.length; i++) {
      const itemId = itemIds[i];
      const quantity = quantities[i] || 1;
      
      try {
        const result = await this.calculateOptimalPrice(itemId, customerId, quantity);
        results.push(result);
      } catch (error) {
        console.error(`Error calculating price for item ${itemId}:`, error);
        // Continue with other items
      }
    }
    
    return results;
  }
  
  /**
   * Generate price analysis report
   */
  async generatePriceAnalysis(itemId: string): Promise<{
    item: Item;
    currentPricing: PricingResult[];
    recommendations: string[];
    competitivePosition: string;
  }> {
    const item = await this.getItemWithCost(itemId);
    if (!item) {
      throw new Error(`Item not found: ${itemId}`);
    }
    
    // Calculate pricing for different scenarios
    const scenarios: PricingConfiguration[] = [
      {
        itemId,
        customerType: "Retail",
        method: PricingMethod.MARGIN_BASED,
        targetMargin: 70,
        baseCurrency: "USD",
        targetCurrency: "USD"
      },
      {
        itemId,
        customerType: "Wholesale",
        method: PricingMethod.MARGIN_BASED,
        targetMargin: 40,
        baseCurrency: "USD",
        targetCurrency: "USD"
      },
      {
        itemId,
        customerType: "Wholesale",
        method: PricingMethod.VOLUME_TIERED,
        baseCurrency: "USD",
        targetCurrency: "USD",
        volumeTiers: [
          { minQuantity: 100, discountPercentage: 15 },
          { minQuantity: 500, discountPercentage: 25 }
        ]
      }
    ];
    
    const currentPricing: PricingResult[] = [];
    for (const scenario of scenarios) {
      const result = await this.calculatePrice(scenario);
      currentPricing.push(result);
    }
    
    // Generate recommendations
    const recommendations: string[] = [];
    const costPrice = parseFloat(item.costPrice || "0");
    
    if (currentPricing[0].marginPercentage < 50) {
      recommendations.push("Consider increasing retail margin for better profitability");
    }
    
    if (currentPricing[1].marginPercentage < 25) {
      recommendations.push("Wholesale margin is below industry standards");
    }
    
    recommendations.push("Consider implementing volume discounts for quantities above 50 units");
    recommendations.push("Monitor competitor pricing regularly for optimal positioning");
    
    return {
      item,
      currentPricing,
      recommendations,
      competitivePosition: "Market analysis pending - integrate with competitor data"
    };
  }
}

// Export singleton instance
export const pricingEngine = new EnhancedPricingEngine();