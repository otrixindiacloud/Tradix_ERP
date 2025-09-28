import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, RadialBarChart, RadialBar, ComposedChart, Legend } from "recharts";
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package, RefreshCw, Download, Calendar, Warehouse, Truck, AlertTriangle, FileText, BarChart3, PieChart as PieChartIcon, Activity, Shield, Bell, Database, Target, Zap, Eye, Filter, ArrowUp, ArrowDown, Sparkles, Star, ThumbsUp, Clock, CheckCircle } from "lucide-react";
import { format, subDays, subMonths, subYears } from "date-fns";

interface DashboardKPIs {
  enquiries: {
    total_enquiries: number;
    new_enquiries: number;
    in_progress_enquiries: number;
    quoted_enquiries: number;
    closed_enquiries: number;
  };
  quotations: {
    total_quotations: number;
    draft_quotations: number;
    sent_quotations: number;
    accepted_quotations: number;
    rejected_quotations: number;
    total_quotation_value: number;
  };
  salesOrders: {
    total_orders: number;
    pending_orders: number;
    confirmed_orders: number;
    shipped_orders: number;
    delivered_orders: number;
    total_order_value: number;
  };
  invoices: {
    total_invoices: number;
    draft_invoices: number;
    sent_invoices: number;
    paid_invoices: number;
    overdue_invoices: number;
    total_invoice_value: number;
    total_paid_amount: number;
  };
  customers: {
    total_customers: number;
    active_customers: number;
    retail_customers: number;
    wholesale_customers: number;
  };
  suppliers: {
    total_suppliers: number;
    active_suppliers: number;
  };
  inventory: {
    total_items: number;
    total_quantity: number;
    total_inventory_value: number;
  };
}

interface SalesTrend {
  period: string;
  count: number;
  total_value: number;
}

interface TopCustomer {
  id: string;
  name: string;
  customer_type: string;
  order_count: number;
  total_value: number;
  avg_order_value: number;
}

interface TopProduct {
  id: string;
  supplier_code: string;
  description: string;
  category: string;
  total_quantity: number;
  total_value: number;
  order_count: number;
}

interface ConversionFunnel {
  enquiries: number;
  quotations: number;
  sales_orders: number;
  invoices: number;
  enquiry_to_quote_rate: number;
  quote_to_order_rate: number;
  order_to_invoice_rate: number;
}

interface InventoryAnalytics {
  total_items: number;
  total_quantity: number;
  total_inventory_value: number;
  low_stock_items: number;
  out_of_stock_items: number;
  high_value_items: number;
  category_breakdown: Array<{
    category: string;
    count: number;        // number of distinct items
    totalstock: number;   // total stock units (aggregated quantity)
  }>;
  stock_movements: Array<{
    date: string;
    receipts: number;
    issues: number;
    adjustments: number;
  }>;
}

interface SupplierAnalytics {
  total_suppliers: number;
  active_suppliers: number;
  top_suppliers: Array<{
    id: string;
    name: string;
    order_count: number;
    total_value: number;
    avg_delivery_time: number;
    quality_rating: number;
  }>;
  supplier_performance: Array<{
    supplier_id: string;
    name: string;
    on_time_delivery: number;
    quality_score: number;
    cost_efficiency: number;
  }>;
}

interface FinancialAnalytics {
  revenue: {
    total_revenue: number;
    retail_revenue: number;
    wholesale_revenue: number;
    monthly_growth: number;
  };
  costs: {
    total_costs: number;
    cost_of_goods_sold: number;
    operating_costs: number;
  };
  profitability: {
    gross_profit: number;
    gross_margin: number;
    net_profit: number;
    net_margin: number;
  };
  pricing_analysis: {
    avg_retail_markup: number;
    avg_wholesale_markup: number;
    price_variance: number;
  };
}

interface AuditTrailAnalytics {
  total_actions: number;
  user_activity: Array<{
    user_id: string;
    user_name: string;
    action_count: number;
    last_activity: string;
  }>;
  critical_actions: Array<{
    action: string;
    count: number;
    last_occurred: string;
  }>;
  compliance_score: number;
}

interface EnquirySourceAnalytics {
  email: number;
  phone: number;
  web_form: number;
  walk_in: number;
  referral: number;
  source_performance: Array<{
    source: string;
    conversion_rate: number;
    avg_value: number;
  }>;
}

const PERIOD_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" }
];

const CHART_COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", 
  "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6366F1"
];

const SOLID_COLORS = [
  "bg-blue-500",
  "bg-green-500", 
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-orange-500"
];

// Global threshold for grouping small inventory categories into 'Other'
const CATEGORY_OTHER_PERCENT_THRESHOLD = 0.02; // 2%

export default function AnalyticsPage() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [salesTrends, setSalesTrends] = useState<SalesTrend[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel | null>(null);
  const [inventoryAnalytics, setInventoryAnalytics] = useState<InventoryAnalytics | null>(null);
  const [inventoryCategoryMetric, setInventoryCategoryMetric] = useState<'totalstock' | 'count'>('totalstock');
  const [supplierAnalytics, setSupplierAnalytics] = useState<SupplierAnalytics | null>(null);
  const [financialAnalytics, setFinancialAnalytics] = useState<FinancialAnalytics | null>(null);
  const [auditTrailAnalytics, setAuditTrailAnalytics] = useState<AuditTrailAnalytics | null>(null);
  const [enquirySourceAnalytics, setEnquirySourceAnalytics] = useState<EnquirySourceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = getStartDate(period);
      
      const params = new URLSearchParams({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });

      // Default values for all data structures
      const defaultKpis: DashboardKPIs = {
        enquiries: {
          total_enquiries: 0,
          new_enquiries: 0,
          in_progress_enquiries: 0,
          quoted_enquiries: 0,
          closed_enquiries: 0
        },
        quotations: {
          total_quotations: 0,
          draft_quotations: 0,
          sent_quotations: 0,
          accepted_quotations: 0,
          rejected_quotations: 0,
          total_quotation_value: 0
        },
        salesOrders: {
          total_orders: 0,
          pending_orders: 0,
          confirmed_orders: 0,
          shipped_orders: 0,
          delivered_orders: 0,
          total_order_value: 0
        },
        invoices: {
          total_invoices: 0,
          draft_invoices: 0,
          sent_invoices: 0,
          paid_invoices: 0,
          overdue_invoices: 0,
          total_invoice_value: 0,
          total_paid_amount: 0
        },
        customers: {
          total_customers: 0,
          active_customers: 0,
          retail_customers: 0,
          wholesale_customers: 0
        },
        suppliers: {
          total_suppliers: 0,
          active_suppliers: 0
        },
        inventory: {
          total_items: 0,
          total_quantity: 0,
          total_inventory_value: 0
        }
      };

      // Fetch all analytics data in parallel with error handling for each
      const [
        kpisRes, trendsRes, customersRes, productsRes, funnelRes,
        inventoryRes, supplierRes, financialRes, auditRes, enquirySourceRes
      ] = await Promise.allSettled([
        fetch(`/api/analytics/dashboard?${params}`),
        fetch(`/api/analytics/sales/trends?${params}&period=day`),
        fetch(`/api/analytics/customers/top?${params}`),
        fetch(`/api/analytics/products/top?${params}`),
        fetch(`/api/analytics/conversion/funnel?${params}`),
        fetch(`/api/analytics/inventory?${params}`),
        fetch(`/api/analytics/suppliers?${params}`),
        fetch(`/api/analytics/financial?${params}`),
        fetch(`/api/analytics/audit-trail?${params}`),
        fetch(`/api/analytics/enquiry-sources?${params}`)
      ]);

      // Process each response with error handling
      const processResponse = async (response: PromiseSettledResult<Response>, defaultValue: any) => {
        if (response.status === 'fulfilled' && response.value.ok) {
          try {
            return await response.value.json();
          } catch (error) {
            console.error("Error parsing JSON:", error);
            return defaultValue;
          }
        } else {
          console.error("API request failed:", response.status === 'rejected' ? response.reason : 'Request failed');
          return defaultValue;
        }
      };

      const [
        kpisData, trendsData, customersData, productsData, funnelData,
        inventoryDataRaw, supplierData, financialData, auditData, enquirySourceData
      ] = await Promise.all([
        processResponse(kpisRes, defaultKpis),
        processResponse(trendsRes, []),
        processResponse(customersRes, []),
        processResponse(productsRes, []),
        processResponse(funnelRes, null),
        processResponse(inventoryRes, null),
        processResponse(supplierRes, null),
        processResponse(financialRes, null),
        processResponse(auditRes, null),
        processResponse(enquirySourceRes, null)
      ]);

  // If inventory analytics missing key metrics (total_quantity/high_value_items/category_breakdown), derive dynamically from inventory items endpoint
  let inventoryData = inventoryDataRaw;
  const HIGH_VALUE_ITEM_VALUE_THRESHOLD = 1000; // could be made configurable via UI
  const CATEGORY_OTHER_PERCENT_THRESHOLD = 0.02; // categories <2% of selected metric get grouped into 'Other'
      try {
        if (inventoryData) {
          const categoryBreakdownEmpty = !inventoryData.category_breakdown || inventoryData.category_breakdown.length === 0;
          const needsEnhance = (inventoryData.total_quantity === 0) || (inventoryData.high_value_items === 0) || categoryBreakdownEmpty;
          if (needsEnhance) {
            const itemsRes = await fetch(`/api/inventory-items`);
            if (itemsRes.ok) {
              const itemsJson = await itemsRes.json();
              if (Array.isArray(itemsJson)) {
                const totals = itemsJson.reduce((acc: any, it: any) => {
                  const qRaw = it.quantity ?? it.stockQuantity ?? it.qty ?? 0;
                  const q = Number(isNaN(qRaw) ? 0 : qRaw);
                  const costRaw = it.unit_price ?? it.unitPrice ?? it.cost_price ?? it.costPrice ?? 0;
                  const cost = Number(isNaN(costRaw) ? 0 : costRaw);
                  const category = (it.category || it.item_category || 'Uncategorized') as string;
                  acc.totalQty += q;
                  const value = q * cost;
                  acc.totalValue += value;
                  if (value >= HIGH_VALUE_ITEM_VALUE_THRESHOLD) acc.highValueCount += 1;
                  // category aggregation
                  if (!acc.categories[category]) {
                    acc.categories[category] = { category, count: 0, totalstock: 0 };
                  }
                  acc.categories[category].count += 1; // number of distinct items in that category
                  acc.categories[category].totalstock += q; // aggregate units
                  return acc;
                }, { totalQty: 0, totalValue: 0, highValueCount: 0, categories: {} as Record<string, { category: string; count: number; totalstock: number }> });
                const derivedCategoryBreakdown = categoryBreakdownEmpty 
                  ? (Object.values(totals.categories) as Array<{ category: string; count: number; totalstock: number }>).sort((a,b)=> b.totalstock - a.totalstock)
                  : inventoryData.category_breakdown?.map((c:any)=> ({ ...c, totalstock: c.totalstock ?? c.value ?? 0 }));
                inventoryData = {
                  ...inventoryData,
                  total_quantity: totals.totalQty,
                  // Only override inventory value if backend returned 0 meaning incomplete
                  total_inventory_value: inventoryData.total_inventory_value === 0 ? totals.totalValue : inventoryData.total_inventory_value,
                  high_value_items: totals.highValueCount,
                  category_breakdown: derivedCategoryBreakdown,
                };
              }
            }
          }
        }
      } catch (e) {
        console.warn("Inventory enhancement failed", e);
      }

      setKpis(kpisData);
      setSalesTrends(trendsData);
      setTopCustomers(customersData);
      setTopProducts(productsData);
      setConversionFunnel(funnelData);
    setInventoryAnalytics(inventoryData);
      setSupplierAnalytics(supplierData);
      setFinancialAnalytics(financialData);
      setAuditTrailAnalytics(auditData);
      setEnquirySourceAnalytics(enquirySourceData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Set default values on complete failure
      setKpis({
        enquiries: { total_enquiries: 0, new_enquiries: 0, in_progress_enquiries: 0, quoted_enquiries: 0, closed_enquiries: 0 },
        quotations: { total_quotations: 0, draft_quotations: 0, sent_quotations: 0, accepted_quotations: 0, rejected_quotations: 0, total_quotation_value: 0 },
        salesOrders: { total_orders: 0, pending_orders: 0, confirmed_orders: 0, shipped_orders: 0, delivered_orders: 0, total_order_value: 0 },
        invoices: { total_invoices: 0, draft_invoices: 0, sent_invoices: 0, paid_invoices: 0, overdue_invoices: 0, total_invoice_value: 0, total_paid_amount: 0 },
        customers: { total_customers: 0, active_customers: 0, retail_customers: 0, wholesale_customers: 0 },
        suppliers: { total_suppliers: 0, active_suppliers: 0 },
        inventory: { total_items: 0, total_quantity: 0, total_inventory_value: 0 }
      });
      setSalesTrends([]);
      setTopCustomers([]);
      setTopProducts([]);
      setConversionFunnel(null);
      setInventoryAnalytics(null);
      setSupplierAnalytics(null);
      setFinancialAnalytics(null);
      setAuditTrailAnalytics(null);
      setEnquirySourceAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  // Derived memo for category breakdown with metric toggle & 'Other' grouping
  const displayedCategoryBreakdown = useMemo(() => {
    if (!inventoryAnalytics || !inventoryAnalytics.category_breakdown) return [] as any[];
    const metric = inventoryCategoryMetric; // 'totalstock' or 'count'
    const data = inventoryAnalytics.category_breakdown;
    const total = data.reduce((acc, c) => acc + (c[metric as keyof typeof c] as number || 0), 0);
    if (total === 0) return data;
    const main: typeof data = [] as any;
    let otherStock = 0, otherCount = 0;
    data.forEach(c => {
      const v = (c[metric as keyof typeof c] as number) || 0;
      if (total > 0 && v / total < CATEGORY_OTHER_PERCENT_THRESHOLD && data.length > 6) {
        otherStock += c.totalstock;
        otherCount += c.count;
      } else {
        main.push(c);
      }
    });
    if (otherStock > 0) {
      main.push({ category: 'Other', count: otherCount, totalstock: otherStock });
    }
    return main;
  }, [inventoryAnalytics, inventoryCategoryMetric]);

  const getStartDate = (period: string) => {
    switch (period) {
      case "7d": return subDays(new Date(), 7);
      case "30d": return subDays(new Date(), 30);
      case "90d": return subDays(new Date(), 90);
      case "1y": return subYears(new Date(), 1);
      default: return subDays(new Date(), 30);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-KW', {
      style: 'currency',
      currency: 'BHD'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-KW').format(value);
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <TrendingUp className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return "text-green-500";
    if (current < previous) return "text-red-500";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-32">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 mx-auto border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">Loading Analytics Dashboard</h3>
              <p className="text-gray-600">Preparing your business insights...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-lg border p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Analytics & Intelligence
                <Sparkles className="inline-block ml-3 h-8 w-8 text-blue-500" />
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Real-time business insights with advanced data visualization and intelligent analytics
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Updated: {new Date().toLocaleTimeString()}
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Live Data
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {PERIOD_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={fetchAnalytics} 
                variant="outline" 
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-xl p-2 shadow-lg border">
          <TabsList className="grid w-full grid-cols-6 gap-2">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              <BarChart3 className="inline-block mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="sales"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              <TrendingUp className="inline-block mr-2 h-4 w-4" />
              Sales
            </TabsTrigger>
            <TabsTrigger 
              value="inventory"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              <Warehouse className="inline-block mr-2 h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger 
              value="suppliers"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              <Truck className="inline-block mr-2 h-4 w-4" />
              Suppliers
            </TabsTrigger>
            <TabsTrigger 
              value="financial"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              <DollarSign className="inline-block mr-2 h-4 w-4" />
              Financial
            </TabsTrigger>
            <TabsTrigger 
              value="compliance"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
            >
              <Shield className="inline-block mr-2 h-4 w-4" />
              Compliance
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced KPI Cards with Gradients */}
          {!kpis ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center bg-white rounded-xl p-8 shadow-lg border">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Analytics Data Available</h3>
                <p className="text-gray-600 mb-4">Unable to load dashboard metrics at this time</p>
                <Button onClick={fetchAnalytics}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Loading
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Enquiries Card */}
              <Card className="bg-white border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="p-3 rounded-full bg-blue-500 mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Enquiries</CardTitle>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(kpis.enquiries?.total_enquiries || 0)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center text-green-600">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span className="font-medium">+12.5%</span>
                    </div>
                    <span className="text-gray-500">vs last period</span>
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-gray-600">
                    <span>New: {kpis.enquiries?.new_enquiries || 0}</span>
                    <span>Active: {kpis.enquiries?.in_progress_enquiries || 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Total Quotations Card */}
              <Card className="bg-white border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="p-3 rounded-full bg-green-500 mr-4">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Quotations</CardTitle>
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(kpis.quotations?.total_quotations || 0)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center text-green-600">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span className="font-medium">+8.3%</span>
                    </div>
                    <span className="text-gray-500">vs last period</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Value: {formatCurrency(kpis.quotations?.total_quotation_value || 0)}
                  </div>
                </CardContent>
              </Card>

              {/* Sales Orders Card */}
              <Card className="bg-white border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="p-3 rounded-full bg-purple-500 mr-4">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium text-gray-600">Sales Orders</CardTitle>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatNumber(kpis.salesOrders?.total_orders || 0)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center text-green-600">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span className="font-medium">+15.7%</span>
                    </div>
                    <span className="text-gray-500">vs last period</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Value: {formatCurrency(kpis.salesOrders?.total_order_value || 0)}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Card */}
              <Card className="bg-white border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="p-3 rounded-full bg-yellow-500 mr-4">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatCurrency(kpis.invoices?.total_paid_amount || 0)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center text-green-600">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span className="font-medium">+22.1%</span>
                    </div>
                    <span className="text-gray-500">vs last period</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    of {formatCurrency(kpis.invoices?.total_invoice_value || 0)} invoiced
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Enhanced Status Breakdown with Modern Design */}
          {kpis && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Enquiry Status Card */}
              <Card className="bg-white shadow-lg border hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-blue-500 text-white rounded-t-lg">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Enquiry Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      <span className="text-sm font-medium">New</span>
                      <Badge className="bg-blue-500 text-white">
                        {kpis.enquiries?.new_enquiries || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
                      <span className="text-sm font-medium">In Progress</span>
                      <Badge className="bg-yellow-500 text-white">
                        {kpis.enquiries?.in_progress_enquiries || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                      <span className="text-sm font-medium">Quoted</span>
                      <Badge className="bg-green-500 text-white">
                        {kpis.enquiries?.quoted_enquiries || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                      <span className="text-sm font-medium">Closed</span>
                      <Badge className="bg-red-500 text-white">
                        {kpis.enquiries?.closed_enquiries || 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Status Card */}
              <Card className="bg-white shadow-lg border hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-purple-500 text-white rounded-t-lg">
                  <CardTitle className="text-lg flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
                      <span className="text-sm font-medium">Pending</span>
                      <Badge className="bg-orange-500 text-white">
                        {kpis.salesOrders?.pending_orders || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      <span className="text-sm font-medium">Confirmed</span>
                      <Badge className="bg-blue-500 text-white">
                        {kpis.salesOrders?.confirmed_orders || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                      <span className="text-sm font-medium">Shipped</span>
                      <Badge className="bg-purple-500 text-white">
                        {kpis.salesOrders?.shipped_orders || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                      <span className="text-sm font-medium">Delivered</span>
                      <Badge className="bg-green-500 text-white">
                        {kpis.salesOrders?.delivered_orders || 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Types Card */}
              <Card className="bg-white shadow-lg border hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-green-500 text-white rounded-t-lg">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Customer Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors">
                      <span className="text-sm font-medium">Retail</span>
                      <Badge className="bg-teal-500 text-white">
                        {kpis.customers?.retail_customers || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                      <span className="text-sm font-medium">Wholesale</span>
                      <Badge className="bg-indigo-500 text-white">
                        {kpis.customers?.wholesale_customers || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors">
                      <span className="text-sm font-medium">Active</span>
                      <Badge className="bg-emerald-500 text-white">
                        {kpis.customers?.active_customers || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-cyan-50 hover:bg-cyan-100 transition-colors">
                      <span className="text-sm font-medium">Total</span>
                      <Badge className="bg-cyan-500 text-white">
                        {kpis.customers?.total_customers || 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          {/* Enhanced Sales Trends Chart */}
          <Card className="bg-white shadow-lg border">
            <CardHeader className="bg-green-500 text-white">
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="h-6 w-6 mr-3" />
                Sales Performance Trends
              </CardTitle>
              <CardDescription className="text-green-100">
                Daily sales performance with advanced analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={salesTrends || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="period" 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value, name) => [
                        name === 'count' ? formatNumber(value as number) : formatCurrency(value as number),
                        name === 'count' ? 'Orders' : 'Value'
                      ]}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#10B981" 
                      fill="#10B981"
                      fillOpacity={0.3}
                      strokeWidth={3}
                      name="Order Count"
                    />
                    <Bar 
                      dataKey="total_value" 
                      fill="#3B82F6"
                      name="Total Value"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total_value" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                      name="Value Trend"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Top Customers and Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-lg border">
              <CardHeader className="bg-blue-500 text-white">
                <CardTitle className="flex items-center text-lg">
                  <Star className="h-5 w-5 mr-2" />
                  Top Performing Customers
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Best customers by order value and frequency
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {topCustomers && topCustomers.length > 0 ? topCustomers.map((customer, index) => (
                    <div key={customer.id} className="group">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:shadow-lg">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full ${SOLID_COLORS[index % SOLID_COLORS.length]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                              {index + 1}
                            </div>
                            {index < 3 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Star className="h-3 w-3 text-yellow-800" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {customer.name}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {customer.customer_type}
                              </Badge>
                              <span>•</span>
                              <span className="flex items-center">
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                {customer.order_count} orders
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-blue-600">
                            {formatCurrency(customer.total_value)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Avg: {formatCurrency(customer.avg_order_value)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No customer data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border">
              <CardHeader className="bg-orange-500 text-white">
                <CardTitle className="flex items-center text-lg">
                  <Package className="h-5 w-5 mr-2" />
                  Top Selling Products
                </CardTitle>
                <CardDescription className="text-orange-100">
                  Best performing products by value and volume
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {topProducts && topProducts.length > 0 ? topProducts.map((product, index) => (
                    <div key={product.id} className="group">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-all duration-300 border border-orange-200 hover:border-orange-300 hover:shadow-lg">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full ${SOLID_COLORS[(index + 3) % SOLID_COLORS.length]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                              {index + 1}
                            </div>
                            {index < 3 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                <ThumbsUp className="h-3 w-3 text-yellow-800" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors truncate">
                              {product.description}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center space-x-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {product.supplier_code}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                              <span className="flex items-center">
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                {product.order_count} orders
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-orange-600">
                            {formatCurrency(product.total_value)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Qty: {formatNumber(product.total_quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No product data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Conversion Funnel */}
          {conversionFunnel && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/30 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                  <CardTitle className="flex items-center text-lg">
                    <Target className="h-5 w-5 mr-2" />
                    Conversion Funnel Analysis
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Customer journey from enquiry to invoice
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Enquiries */}
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Enquiries</span>
                      <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        {conversionFunnel.enquiries}
                      </Badge>
                    </div>
                    <div className="h-6 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-full"></div>
                    </div>
                    <div className="text-center mt-1 text-sm font-semibold text-blue-600">100%</div>
                  </div>
                  
                  {/* Quotations */}
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Quotations</span>
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        {conversionFunnel.quotations}
                      </Badge>
                    </div>
                    <div className="h-6 bg-gradient-to-r from-green-200 to-green-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000"
                        style={{ width: `${conversionFunnel.enquiry_to_quote_rate}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-600">
                        {conversionFunnel.enquiry_to_quote_rate}% conversion
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {conversionFunnel.enquiry_to_quote_rate}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Sales Orders */}
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Sales Orders</span>
                      <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                        {conversionFunnel.sales_orders}
                      </Badge>
                    </div>
                    <div className="h-6 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-1000"
                        style={{ width: `${conversionFunnel.quote_to_order_rate}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-600">
                        {conversionFunnel.quote_to_order_rate}% conversion
                      </span>
                      <span className="text-sm font-semibold text-orange-600">
                        {conversionFunnel.quote_to_order_rate}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Invoices */}
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Invoices</span>
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        {conversionFunnel.invoices}
                      </Badge>
                    </div>
                    <div className="h-6 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000"
                        style={{ width: `${conversionFunnel.order_to_invoice_rate}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-600">
                        {conversionFunnel.order_to_invoice_rate}% conversion
                      </span>
                      <span className="text-sm font-semibold text-purple-600">
                        {conversionFunnel.order_to_invoice_rate}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border">
                <CardHeader className="bg-indigo-500 text-white">
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="h-5 w-5 mr-2" />
                    Conversion Metrics
                  </CardTitle>
                  <CardDescription className="text-indigo-100">
                    Key performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Enquiry to Quote */}
                    <div className="text-center p-6 rounded-xl bg-green-50 border border-green-200">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {conversionFunnel.enquiry_to_quote_rate}%
                      </div>
                      <div className="text-sm font-medium text-green-700">Enquiry to Quote</div>
                      <div className="text-xs text-green-600 mt-1">Conversion Rate</div>
                    </div>
                    
                    {/* Quote to Order */}
                    <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {conversionFunnel.quote_to_order_rate}%
                      </div>
                      <div className="text-sm font-medium text-blue-700">Quote to Order</div>
                      <div className="text-xs text-blue-600 mt-1">Win Rate</div>
                    </div>
                    
                    {/* Order to Invoice */}
                    <div className="text-center p-6 rounded-xl bg-purple-50 border border-purple-200">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {conversionFunnel.order_to_invoice_rate}%
                      </div>
                      <div className="text-sm font-medium text-purple-700">Order to Invoice</div>
                      <div className="text-xs text-purple-600 mt-1">Fulfillment Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Enhanced Enquiry Source Analytics */}
          {enquirySourceAnalytics && (
            <Card className="bg-white shadow-lg border">
              <CardHeader className="bg-cyan-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <Bell className="h-6 w-6 mr-3" />
                  Multi-Channel Enquiry Performance
                </CardTitle>
                <CardDescription className="text-cyan-100">
                  Source-wise enquiry analytics with performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {/* Email Channel */}
                  <div className="group text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:shadow-lg cursor-pointer">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {enquirySourceAnalytics?.email || 0}
                    </div>
                    <div className="text-sm font-medium text-blue-700 mt-1">Email</div>
                    <div className="text-xs text-blue-600 mt-1">Digital Channel</div>
                  </div>

                  {/* Phone Channel */}
                  <div className="group text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-300 border border-green-200 hover:border-green-300 hover:shadow-lg cursor-pointer">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {enquirySourceAnalytics?.phone || 0}
                    </div>
                    <div className="text-sm font-medium text-green-700 mt-1">Phone</div>
                    <div className="text-xs text-green-600 mt-1">Direct Contact</div>
                  </div>

                  {/* Web Form Channel */}
                  <div className="group text-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-all duration-300 border border-purple-200 hover:border-purple-300 hover:shadow-lg cursor-pointer">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500 flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {enquirySourceAnalytics?.web_form || 0}
                    </div>
                    <div className="text-sm font-medium text-purple-700 mt-1">Web Form</div>
                    <div className="text-xs text-purple-600 mt-1">Online</div>
                  </div>

                  {/* Walk-in Channel */}
                  <div className="group text-center p-6 rounded-xl bg-orange-50 hover:bg-orange-100 transition-all duration-300 border border-orange-200 hover:border-orange-300 hover:shadow-lg cursor-pointer">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-500 flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {enquirySourceAnalytics?.walk_in || 0}
                    </div>
                    <div className="text-sm font-medium text-orange-700 mt-1">Walk-in</div>
                    <div className="text-xs text-orange-600 mt-1">Physical Visit</div>
                  </div>

                  {/* Referral Channel */}
                  <div className="group text-center p-6 rounded-xl bg-pink-50 hover:bg-pink-100 transition-all duration-300 border border-pink-200 hover:border-pink-300 hover:shadow-lg cursor-pointer">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-pink-500 flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-pink-600">
                      {enquirySourceAnalytics?.referral || 0}
                    </div>
                    <div className="text-sm font-medium text-pink-700 mt-1">Referral</div>
                    <div className="text-xs text-pink-600 mt-1">Word of Mouth</div>
                  </div>
                </div>

                {/* Source Performance Chart */}
                {enquirySourceAnalytics?.source_performance && enquirySourceAnalytics.source_performance.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-indigo-600" />
                      Channel Performance Metrics
                    </h4>
                    <div className="h-[300px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={enquirySourceAnalytics.source_performance}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis 
                            dataKey="source" 
                            stroke="#6B7280"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#6B7280"
                            fontSize={12}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value, name) => [
                              name === 'conversion_rate' ? `${value}%` : formatCurrency(value as number),
                              name === 'conversion_rate' ? 'Conversion Rate' : 'Avg Value'
                            ]}
                          />
                          <Bar 
                            dataKey="conversion_rate" 
                            fill="url(#conversionGradient)"
                            name="Conversion Rate"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar 
                            dataKey="avg_value" 
                            fill="url(#valueGradient2)"
                            name="Avg Value"
                            radius={[4, 4, 0, 0]}
                          />
                          <defs>
                            <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.4}/>
                            </linearGradient>
                            <linearGradient id="valueGradient2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0.4}/>
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Enhanced Inventory Analytics Tab */}
        <TabsContent value="inventory" className="space-y-6">
          {inventoryAnalytics && (
            <>
              {/* Inventory KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(inventoryAnalytics.total_items)}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatNumber(inventoryAnalytics.total_quantity)} total quantity
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(inventoryAnalytics.total_inventory_value)}</div>
                    <div className="text-xs text-muted-foreground">
                      Total stock value
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{inventoryAnalytics.low_stock_items}</div>
                    <div className="text-xs text-muted-foreground">
                      Need reordering
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{inventoryAnalytics.out_of_stock_items}</div>
                    <div className="text-xs text-muted-foreground">
                      Urgent restock needed
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Category Breakdown with metric toggle (using totalstock) */}
              <Card>
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Inventory by Category</CardTitle>
                    <CardDescription>Distribution by {inventoryCategoryMetric === 'totalstock' ? 'stock units' : 'item count'}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                   
                    <Button 
                      variant={inventoryCategoryMetric === 'count' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setInventoryCategoryMetric('count')}
                    >Items</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={displayedCategoryBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={90}
                          dataKey={inventoryCategoryMetric}
                          nameKey="category"
                          label={(p:any) => {
                            const total = displayedCategoryBreakdown.reduce((acc, c:any) => acc + (c[inventoryCategoryMetric] || 0), 0);
                            const raw = p[inventoryCategoryMetric] || 0;
                            const pct = total ? ((raw / total) * 100).toFixed(1) : 0;
                            return `${p.category}: ${raw} (${pct}%)`;
                          }}
                        >
                          {displayedCategoryBreakdown.map((entry:any, index:number) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(val:any, name:any, p:any) => {
                            if (inventoryCategoryMetric === 'totalstock') return [val, 'Stock Units'];
                            return [val, inventoryCategoryMetric === 'count' ? 'Items' : 'Value'];
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {displayedCategoryBreakdown.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {displayedCategoryBreakdown.map((c:any, i:number) => {
                        const metricVal = c[inventoryCategoryMetric] || 0;
                        const total = displayedCategoryBreakdown.reduce((acc, d:any) => acc + (d[inventoryCategoryMetric] || 0), 0);
                        const pct = total ? ((metricVal / total) * 100).toFixed(1) : '0.0';
                        return (
                          <div key={c.category} className="flex items-center gap-2 border rounded px-2 py-1 bg-white">
                            <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                            <span className="flex-1 truncate" title={c.category}>{c.category}</span>
                            <span className="font-medium">{metricVal}</span>
                            <span className="text-muted-foreground">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stock Movements */}
              <Card>
                <CardHeader>
                  <CardTitle>Stock Movements</CardTitle>
                  <CardDescription>Recent inventory transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={inventoryAnalytics?.stock_movements || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="receipts" fill="#82ca9d" name="Receipts" />
                        <Bar dataKey="issues" fill="#ffc658" name="Issues" />
                        <Bar dataKey="adjustments" fill="#ff7300" name="Adjustments" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Supplier Analytics Tab */}
        <TabsContent value="suppliers" className="space-y-4">
          {supplierAnalytics && (
            <>
              {/* Supplier KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{supplierAnalytics.total_suppliers}</div>
                    <div className="text-xs text-muted-foreground">
                      {supplierAnalytics.active_suppliers} active
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {supplierAnalytics?.top_suppliers && supplierAnalytics.top_suppliers.length > 0 
                        ? Math.round(supplierAnalytics.top_suppliers.reduce((acc, s) => acc + s.avg_delivery_time, 0) / supplierAnalytics.top_suppliers.length)
                        : 0} days
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Average across suppliers
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Quality Rating</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {supplierAnalytics?.top_suppliers && supplierAnalytics.top_suppliers.length > 0 
                        ? (supplierAnalytics.top_suppliers.reduce((acc, s) => acc + s.quality_rating, 0) / supplierAnalytics.top_suppliers.length).toFixed(1)
                        : 0}/5
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Average rating
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Suppliers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Suppliers</CardTitle>
                  <CardDescription>Best performing suppliers by order value and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {supplierAnalytics.top_suppliers && supplierAnalytics.top_suppliers.length > 0 ? supplierAnalytics.top_suppliers.map((supplier, index) => (
                      <div key={supplier.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {supplier.order_count} orders • {supplier.avg_delivery_time} days avg delivery
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(supplier.total_value)}</div>
                          <div className="text-sm text-muted-foreground">
                            ⭐ {supplier.quality_rating}/5
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No supplier data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Supplier Performance Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Performance Matrix</CardTitle>
                  <CardDescription>Quality vs Delivery performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={supplierAnalytics?.supplier_performance || []}>
                        <CartesianGrid />
                        <XAxis 
                          type="number" 
                          dataKey="on_time_delivery" 
                          name="On-Time Delivery %"
                          domain={[0, 100]}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="quality_score" 
                          name="Quality Score"
                          domain={[0, 5]}
                        />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          formatter={(value, name) => [
                            name === 'quality_score' ? `${value}/5` : `${value}%`,
                            name === 'quality_score' ? 'Quality Score' : 'On-Time Delivery'
                          ]}
                        />
                        <Scatter dataKey="cost_efficiency" fill="#8884d8" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Financial Analytics Tab */}
        <TabsContent value="financial" className="space-y-4">
          {financialAnalytics && (
            <>
              {/* Financial KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(financialAnalytics?.revenue?.total_revenue || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(financialAnalytics?.revenue?.monthly_growth || 0) > 0 ? '+' : ''}{financialAnalytics?.revenue?.monthly_growth || 0}% growth
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(financialAnalytics?.profitability?.gross_profit || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {financialAnalytics?.profitability?.gross_margin || 0}% margin
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                    <Target className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(financialAnalytics?.profitability?.net_profit || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {financialAnalytics?.profitability?.net_margin || 0}% margin
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cost of Goods</CardTitle>
                    <Package className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(financialAnalytics?.costs?.cost_of_goods_sold || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(financialAnalytics?.costs?.total_costs || 0)} total costs
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Channel</CardTitle>
                    <CardDescription>Retail vs Wholesale revenue breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Retail', value: financialAnalytics?.revenue?.retail_revenue || 0, color: '#8884d8' },
                              { name: 'Wholesale', value: financialAnalytics?.revenue?.wholesale_revenue || 0, color: '#82ca9d' }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#8884d8" />
                            <Cell fill="#82ca9d" />
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Analysis</CardTitle>
                    <CardDescription>Markup and pricing performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Retail Markup</span>
                        <Badge variant="outline">{financialAnalytics?.pricing_analysis?.avg_retail_markup || 0}%</Badge>
                      </div>
                      <Progress value={financialAnalytics?.pricing_analysis?.avg_retail_markup || 0} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Wholesale Markup</span>
                        <Badge variant="outline">{financialAnalytics?.pricing_analysis?.avg_wholesale_markup || 0}%</Badge>
                      </div>
                      <Progress value={financialAnalytics?.pricing_analysis?.avg_wholesale_markup || 0} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Price Variance</span>
                        <Badge variant="outline">{financialAnalytics?.pricing_analysis?.price_variance || 0}%</Badge>
                      </div>
                      <Progress value={Math.abs(financialAnalytics?.pricing_analysis?.price_variance || 0)} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Compliance & Audit Tab */}
        <TabsContent value="compliance" className="space-y-4">
          {auditTrailAnalytics && (
            <>
              {/* Compliance KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(auditTrailAnalytics.total_actions)}</div>
                    <div className="text-xs text-muted-foreground">
                      System activities tracked
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                    <Shield className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{auditTrailAnalytics.compliance_score}%</div>
                    <div className="text-xs text-muted-foreground">
                      System compliance rating
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{auditTrailAnalytics?.user_activity?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">
                      Users with recent activity
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Recent user actions and activity levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auditTrailAnalytics.user_activity && auditTrailAnalytics.user_activity.length > 0 ? auditTrailAnalytics.user_activity.map((user, index) => (
                      <div key={user.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                            {(user.user_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{user.user_name}</div>
                            <div className="text-sm text-muted-foreground">
                              Last activity: {new Date(user.last_activity).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{user.action_count} actions</div>
                          <div className="text-sm text-muted-foreground">
                            Total activities
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No user activity data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Critical Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Critical Actions</CardTitle>
                  <CardDescription>High-priority system actions and their frequency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auditTrailAnalytics.critical_actions && auditTrailAnalytics.critical_actions.length > 0 ? auditTrailAnalytics.critical_actions.map((action, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <div>
                            <div className="font-medium">{action.action}</div>
                            <div className="text-sm text-muted-foreground">
                              Last occurred: {new Date(action.last_occurred).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant="destructive">{action.count} times</Badge>
                      </div>
                    )) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No critical actions data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
