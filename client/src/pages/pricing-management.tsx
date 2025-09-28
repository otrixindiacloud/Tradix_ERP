import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Calculator, 
  TrendingUp, 
  Settings, 
  Target,
  DollarSign,
  BarChart3,
  Users,
  Package,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Enhanced schemas for new pricing features
const volumeTierSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  customerId: z.string().optional(),
  tierName: z.string().min(1, "Tier name is required"),
  minQuantity: z.number().min(1, "Minimum quantity must be at least 1"),
  maxQuantity: z.number().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  specialPrice: z.number().min(0).optional(),
  currency: z.string().length(3).default("BHD"),
});

const contractPricingSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  itemId: z.string().min(1, "Item ID is required"),
  contractPrice: z.number().min(0, "Contract price must be positive"),
  contractStartDate: z.string().min(1, "Start date is required"),
  contractEndDate: z.string().min(1, "End date is required"),
  minimumQuantity: z.number().min(0).optional(),
  maximumQuantity: z.number().min(0).optional(),
  terms: z.string().optional(),
});

const competitorPricingSchema = z.object({
  competitorName: z.string().min(1, "Competitor name is required"),
  itemId: z.string().min(1, "Item ID is required"),
  price: z.number().min(0, "Price must be positive"),
  currency: z.string().length(3).default("BHD"),
  source: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

const enhancedPriceCalculationSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  customerId: z.string().min(1, "Customer ID is required"),
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
  targetCurrency: z.string().length(3).default("BHD"),
});

export default function EnhancedPricingManagement() {
  const [activeTab, setActiveTab] = useState("calculator");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Forms
  const volumeTierForm = useForm({
    resolver: zodResolver(volumeTierSchema),
    defaultValues: {
      itemId: "",
      customerId: "",
      tierName: "",
      minQuantity: 1,
      maxQuantity: undefined,
      discountPercentage: 0,
      specialPrice: undefined,
  currency: "BHD",
    },
  });

  const contractForm = useForm({
    resolver: zodResolver(contractPricingSchema),
    defaultValues: {
      customerId: "",
      itemId: "",
      contractPrice: 0,
      contractStartDate: "",
      contractEndDate: "",
      minimumQuantity: 0,
      maximumQuantity: undefined,
      terms: "",
    },
  });

  const competitorForm = useForm({
    resolver: zodResolver(competitorPricingSchema),
    defaultValues: {
      competitorName: "",
      itemId: "",
      price: 0,
  currency: "BHD",
      source: "",
      sourceUrl: "",
      notes: "",
    },
  });

  const calculatorForm = useForm({
    resolver: zodResolver(enhancedPriceCalculationSchema),
    defaultValues: {
      itemId: "",
      customerId: "",
      quantity: 1,
      method: undefined,
  targetCurrency: "BHD",
    },
  });

  // Queries
  const { data: volumeTiers, isLoading: volumeLoading } = useQuery({
    queryKey: ["/api/pricing/volume-tiers"],
    queryFn: async () => {
      const response = await fetch("/api/pricing/volume-tiers");
      if (!response.ok) throw new Error("Failed to fetch volume tiers");
      return response.json();
    },
  });

  const { data: contractPricing, isLoading: contractLoading } = useQuery({
    queryKey: ["/api/pricing/contract-pricing"],
    queryFn: async () => {
      const response = await fetch("/api/pricing/contract-pricing");
      if (!response.ok) throw new Error("Failed to fetch contract pricing");
      return response.json();
    },
  });

  const { data: competitorPricing, isLoading: competitorLoading } = useQuery({
    queryKey: ["/api/pricing/competitor-pricing"],
    queryFn: async () => {
      const response = await fetch("/api/pricing/competitor-pricing");
      if (!response.ok) throw new Error("Failed to fetch competitor pricing");
      return response.json();
    },
  });

  // Mutations
  const createVolumeTierMutation = useMutation({
    mutationFn: async (data: z.infer<typeof volumeTierSchema>) => {
      const response = await fetch("/api/pricing/volume-tiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create volume tier");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pricing/volume-tiers"] });
      toast({ title: "Success", description: "Volume tier created successfully" });
      volumeTierForm.reset();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create volume tier", 
        variant: "destructive" 
      });
    },
  });

  const createContractMutation = useMutation({
    mutationFn: async (data: z.infer<typeof contractPricingSchema>) => {
      const response = await fetch("/api/pricing/contract-pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create contract pricing");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pricing/contract-pricing"] });
      toast({ title: "Success", description: "Contract pricing created successfully" });
      contractForm.reset();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create contract pricing", 
        variant: "destructive" 
      });
    },
  });

  const createCompetitorMutation = useMutation({
    mutationFn: async (data: z.infer<typeof competitorPricingSchema>) => {
      const response = await fetch("/api/pricing/competitor-pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create competitor pricing");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pricing/competitor-pricing"] });
      toast({ title: "Success", description: "Competitor pricing added successfully" });
      competitorForm.reset();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to add competitor pricing", 
        variant: "destructive" 
      });
    },
  });

  const calculatePriceMutation = useMutation({
    mutationFn: async (data: z.infer<typeof enhancedPriceCalculationSchema>) => {
      const response = await fetch("/api/pricing/calculate-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to calculate price");
      return response.json();
    },
    onSuccess: (result: any) => {
      const pricing = result.data;
      toast({ 
        title: "Price Calculation Complete", 
        description: `Final Price: ${pricing.targetCurrency} ${pricing.priceInTargetCurrency.toFixed(2)} | Margin: ${pricing.marginPercentage.toFixed(2)}% | Method: ${pricing.method}`,
        duration: 5000
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to calculate price", 
        variant: "destructive" 
      });
    },
  });

  const onCreateVolumeTier = (data: z.infer<typeof volumeTierSchema>) => {
    createVolumeTierMutation.mutate(data);
  };

  const onCreateContract = (data: z.infer<typeof contractPricingSchema>) => {
    createContractMutation.mutate(data);
  };

  const onCreateCompetitor = (data: z.infer<typeof competitorPricingSchema>) => {
    createCompetitorMutation.mutate(data);
  };

  const onCalculatePrice = (data: z.infer<typeof enhancedPriceCalculationSchema>) => {
    calculatePriceMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enhanced Pricing & Costing Engine</h1>
          <p className="text-muted-foreground">
            Advanced pricing management with multiple calculation methods, volume discounts, and competitive analysis
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="calculator" data-testid="tab-calculator">
            <Calculator className="h-4 w-4 mr-2" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="volume-tiers" data-testid="tab-volume-tiers">
            <Package className="h-4 w-4 mr-2" />
            Volume Tiers
          </TabsTrigger>
          <TabsTrigger value="contracts" data-testid="tab-contracts">
            <Calendar className="h-4 w-4 mr-2" />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="competitors" data-testid="tab-competitors">
            <Target className="h-4 w-4 mr-2" />
            Competitors
          </TabsTrigger>
          <TabsTrigger value="analysis" data-testid="tab-analysis">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="reports" data-testid="tab-reports">
            <TrendingUp className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Price Calculator */}
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Price Calculator</CardTitle>
              <CardDescription>
                Calculate prices using advanced methods including cost-plus, margin-based, competitive, and volume pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...calculatorForm}>
                <form onSubmit={calculatorForm.handleSubmit(onCalculatePrice)} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={calculatorForm.control}
                      name="itemId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter item ID" {...field} data-testid="input-calculator-item-id" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={calculatorForm.control}
                      name="customerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter customer ID" {...field} data-testid="input-calculator-customer-id" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={calculatorForm.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="1" 
                              {...field} 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              data-testid="input-calculator-quantity" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={calculatorForm.control}
                      name="method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pricing Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-pricing-method">
                                <SelectValue placeholder="Select pricing method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cost_plus">Cost Plus</SelectItem>
                              <SelectItem value="margin_based">Margin Based</SelectItem>
                              <SelectItem value="competitive">Competitive</SelectItem>
                              <SelectItem value="volume_tiered">Volume Tiered</SelectItem>
                              <SelectItem value="dynamic">Dynamic</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={calculatorForm.control}
                      name="targetCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-currency">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BHD">BHD</SelectItem>
                              <SelectItem value="AED">AED</SelectItem>
                              <SelectItem value="KWD">KWD</SelectItem>
                              <SelectItem value="SAR">SAR</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={calculatePriceMutation.isPending} 
                    data-testid="button-calculate-enhanced-price"
                    className="w-full"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    {calculatePriceMutation.isPending ? "Calculating..." : "Calculate Enhanced Price"}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Pricing Methods Available</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <p><strong>Cost Plus:</strong> Cost + Fixed Markup %</p>
                  <p><strong>Margin Based:</strong> Target margin percentage</p>
                  <p><strong>Competitive:</strong> Market-based pricing</p>
                  <p><strong>Volume Tiered:</strong> Quantity-based discounts</p>
                  <p><strong>Dynamic:</strong> Real-time market factors</p>
                  <p><strong>Contract:</strong> Pre-negotiated prices</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volume Pricing Tiers */}
        <TabsContent value="volume-tiers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Volume Pricing Tiers</CardTitle>
                  <CardDescription>
                    Configure quantity-based discounts for bulk purchases
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button data-testid="button-create-volume-tier">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Volume Tier
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Volume Pricing Tier</DialogTitle>
                      <DialogDescription>
                        Set up quantity-based pricing for specific items and customers
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...volumeTierForm}>
                      <form onSubmit={volumeTierForm.handleSubmit(onCreateVolumeTier)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={volumeTierForm.control}
                            name="itemId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Item ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter item ID" {...field} data-testid="input-volume-item-id" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={volumeTierForm.control}
                            name="customerId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Customer ID (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Leave empty for all customers" {...field} data-testid="input-volume-customer-id" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={volumeTierForm.control}
                          name="tierName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tier Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Bulk Discount Tier 1" {...field} data-testid="input-tier-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={volumeTierForm.control}
                            name="minQuantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Minimum Quantity</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="10" 
                                    {...field} 
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    data-testid="input-min-quantity" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={volumeTierForm.control}
                            name="maxQuantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Maximum Quantity (Optional)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="100" 
                                    {...field} 
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                    data-testid="input-max-quantity" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={volumeTierForm.control}
                            name="discountPercentage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Discount Percentage</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="10.5" 
                                    {...field} 
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    data-testid="input-discount-percentage" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={volumeTierForm.control}
                            name="specialPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Special Price (Optional)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="50.00" 
                                    {...field} 
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                    data-testid="input-special-price" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          disabled={createVolumeTierMutation.isPending} 
                          data-testid="button-submit-volume-tier"
                        >
                          {createVolumeTierMutation.isPending ? "Creating..." : "Create Volume Tier"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {volumeLoading ? (
                <div className="text-center py-4">Loading volume tiers...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tier Name</TableHead>
                      <TableHead>Item ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Quantity Range</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Special Price</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(volumeTiers?.data || []).map((tier: any) => (
                      <TableRow key={tier.id} data-testid={`row-volume-tier-${tier.id}`}>
                        <TableCell className="font-medium">{tier.tierName}</TableCell>
                        <TableCell>{tier.itemId}</TableCell>
                        <TableCell>{tier.customerId || "All Customers"}</TableCell>
                        <TableCell>
                          {tier.minQuantity} - {tier.maxQuantity || "∞"}
                        </TableCell>
                        <TableCell>
                          {tier.discountPercentage ? `${tier.discountPercentage}%` : "-"}
                        </TableCell>
                        <TableCell>
                          {tier.specialPrice ? `${tier.currency} ${tier.specialPrice}` : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={tier.isActive ? "default" : "secondary"}>
                            {tier.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contract Pricing */}
        <TabsContent value="contracts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contract Pricing</CardTitle>
                  <CardDescription>
                    Manage long-term pricing agreements with customers
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button data-testid="button-create-contract">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Contract
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Contract Pricing</DialogTitle>
                      <DialogDescription>
                        Set up long-term pricing agreements for specific customers and items
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...contractForm}>
                      <form onSubmit={contractForm.handleSubmit(onCreateContract)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={contractForm.control}
                            name="customerId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Customer ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter customer ID" {...field} data-testid="input-contract-customer-id" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={contractForm.control}
                            name="itemId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Item ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter item ID" {...field} data-testid="input-contract-item-id" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={contractForm.control}
                          name="contractPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contract Price</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="100.00" 
                                  {...field} 
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  data-testid="input-contract-price" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={contractForm.control}
                            name="contractStartDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="datetime-local" 
                                    {...field} 
                                    data-testid="input-contract-start-date" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={contractForm.control}
                            name="contractEndDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="datetime-local" 
                                    {...field} 
                                    data-testid="input-contract-end-date" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={contractForm.control}
                            name="minimumQuantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Minimum Quantity</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="0" 
                                    {...field} 
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    data-testid="input-contract-min-quantity" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={contractForm.control}
                            name="maximumQuantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Maximum Quantity</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="1000" 
                                    {...field} 
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                    data-testid="input-contract-max-quantity" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={contractForm.control}
                          name="terms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Terms & Conditions</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter contract terms and conditions..." 
                                  {...field} 
                                  data-testid="input-contract-terms" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          disabled={createContractMutation.isPending} 
                          data-testid="button-submit-contract"
                        >
                          {createContractMutation.isPending ? "Creating..." : "Create Contract"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {contractLoading ? (
                <div className="text-center py-4">Loading contract pricing...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity Range</TableHead>
                      <TableHead>Valid Period</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(contractPricing?.data || []).map((contract: any) => (
                      <TableRow key={contract.id} data-testid={`row-contract-${contract.id}`}>
                        <TableCell className="font-medium">{contract.contractNumber}</TableCell>
                        <TableCell>{contract.customerId}</TableCell>
                        <TableCell>{contract.itemId}</TableCell>
                        <TableCell>{contract.currency} {contract.contractPrice}</TableCell>
                        <TableCell>
                          {contract.minimumQuantity || 0} - {contract.maximumQuantity || "∞"}
                        </TableCell>
                        <TableCell>
                          {new Date(contract.contractStartDate).toLocaleDateString()} - {new Date(contract.contractEndDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={contract.status === "active" ? "default" : "secondary"}>
                            {contract.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitor Pricing */}
        <TabsContent value="competitors" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Competitor Pricing Analysis</CardTitle>
                  <CardDescription>
                    Track and analyze competitor prices for better market positioning
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-competitor-pricing">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Competitor Price
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Add Competitor Pricing</DialogTitle>
                      <DialogDescription>
                        Record competitor pricing information for market analysis
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...competitorForm}>
                      <form onSubmit={competitorForm.handleSubmit(onCreateCompetitor)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={competitorForm.control}
                            name="competitorName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Competitor Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Competitor ABC" {...field} data-testid="input-competitor-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={competitorForm.control}
                            name="itemId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Item ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter item ID" {...field} data-testid="input-competitor-item-id" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={competitorForm.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="100.00" 
                                    {...field} 
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    data-testid="input-competitor-price" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={competitorForm.control}
                            name="currency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-competitor-currency">
                                      <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="BHD">BHD</SelectItem>
                                    <SelectItem value="AED">AED</SelectItem>
                                    <SelectItem value="KWD">KWD</SelectItem>
                                    <SelectItem value="SAR">SAR</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={competitorForm.control}
                          name="source"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Source</FormLabel>
                              <FormControl>
                                <Input placeholder="Website, catalog, quote, etc." {...field} data-testid="input-competitor-source" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={competitorForm.control}
                          name="sourceUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Source URL (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://..." {...field} data-testid="input-competitor-url" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={competitorForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Additional notes..." {...field} data-testid="input-competitor-notes" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          disabled={createCompetitorMutation.isPending} 
                          data-testid="button-submit-competitor"
                        >
                          {createCompetitorMutation.isPending ? "Adding..." : "Add Competitor Price"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {competitorLoading ? (
                <div className="text-center py-4">Loading competitor pricing...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Competitor</TableHead>
                      <TableHead>Item ID</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Verified Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(competitorPricing?.data || []).map((pricing: any) => (
                      <TableRow key={pricing.id} data-testid={`row-competitor-${pricing.id}`}>
                        <TableCell className="font-medium">{pricing.competitorName}</TableCell>
                        <TableCell>{pricing.itemId}</TableCell>
                        <TableCell>{pricing.currency} {pricing.price}</TableCell>
                        <TableCell>{pricing.source || "-"}</TableCell>
                        <TableCell>{new Date(pricing.verifiedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={pricing.isActive ? "default" : "secondary"}>
                            {pricing.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Placeholder tabs for Analysis and Reports */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Analysis</CardTitle>
              <CardDescription>
                Advanced pricing analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Pricing analysis features coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Reports</CardTitle>
              <CardDescription>
                Generate comprehensive pricing and margin reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Advanced reporting features coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}