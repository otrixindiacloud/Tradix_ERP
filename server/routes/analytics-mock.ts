import { Router } from "express";

const router = Router();

// Mock analytics data for demonstration
const mockAnalyticsData = {
  enquiries: {
    total_enquiries: 15,
    new_enquiries: 3,
    in_progress_enquiries: 5,
    quoted_enquiries: 4,
    closed_enquiries: 3
  },
  quotations: {
    total_quotations: 12,
    draft_quotations: 2,
    sent_quotations: 4,
    accepted_quotations: 4,
    rejected_quotations: 2,
    total_quotation_value: 45000
  },
  salesOrders: {
    total_orders: 8,
    pending_orders: 1,
    confirmed_orders: 3,
    shipped_orders: 2,
    delivered_orders: 2,
    total_order_value: 35000
  },
  invoices: {
    total_invoices: 6,
    draft_invoices: 1,
    sent_invoices: 2,
    paid_invoices: 2,
    overdue_invoices: 1,
    total_invoice_value: 30000,
    total_paid_amount: 25000
  },
  customers: {
    total_customers: 25,
    active_customers: 20,
    retail_customers: 15,
    wholesale_customers: 10
  },
  suppliers: {
    total_suppliers: 8,
    active_suppliers: 6
  },
  inventory: {
    total_items: 150,
    total_quantity: 5000,
    total_inventory_value: 125000
  }
};

const mockSalesTrends = [
  { period: '2024-01', count: 2, total_value: 5000 },
  { period: '2024-02', count: 3, total_value: 7500 },
  { period: '2024-03', count: 4, total_value: 12000 },
  { period: '2024-04', count: 2, total_value: 6000 },
  { period: '2024-05', count: 5, total_value: 15000 },
  { period: '2024-06', count: 3, total_value: 9000 },
  { period: '2024-07', count: 4, total_value: 11000 },
  { period: '2024-08', count: 6, total_value: 18000 },
  { period: '2024-09', count: 3, total_value: 8500 }
];

const mockTopCustomers = [
  {
    id: '1',
    name: 'ABC Trading Co.',
    customer_type: 'Wholesale',
    order_count: 8,
    total_value: 15000,
    avg_order_value: 1875
  },
  {
    id: '2',
    name: 'XYZ Retail Store',
    customer_type: 'Retail',
    order_count: 12,
    total_value: 8500,
    avg_order_value: 708
  },
  {
    id: '3',
    name: 'Ministry of Health',
    customer_type: 'Wholesale',
    order_count: 3,
    total_value: 12000,
    avg_order_value: 4000
  }
];

const mockTopProducts = [
  {
    id: '1',
    supplier_code: 'GMS-001',
    description: 'Surgical Gloves - Latex Free',
    category: 'Personal Protective Equipment',
    total_quantity: 500,
    total_value: 2500,
    order_count: 15
  },
  {
    id: '2',
    supplier_code: 'GMS-002',
    description: 'N95 Respirator Masks',
    category: 'Personal Protective Equipment',
    total_quantity: 300,
    total_value: 3600,
    order_count: 12
  },
  {
    id: '3',
    supplier_code: 'MTS-001',
    description: 'Digital Thermometer',
    category: 'Medical Equipment',
    total_quantity: 100,
    total_value: 4500,
    order_count: 8
  }
];

const mockConversionFunnel = {
  enquiries: 15,
  quotations: 12,
  sales_orders: 8,
  invoices: 6,
  enquiry_to_quote_rate: 80.0,
  quote_to_order_rate: 66.7,
  order_to_invoice_rate: 75.0
};

const mockInventoryAnalytics = {
  total_items: 150,
  total_quantity: 5000,
  total_inventory_value: 125000,
  low_stock_items: 12,
  out_of_stock_items: 3,
  high_value_items: 25,
  category_breakdown: [
    { category: 'Personal Protective Equipment', count: 45, value: 25000 },
    { category: 'Medical Equipment', count: 35, value: 45000 },
    { category: 'Diagnostic Tools', count: 30, value: 30000 },
    { category: 'Surgical Instruments', count: 25, value: 20000 },
    { category: 'Pharmaceuticals', count: 15, value: 5000 }
  ],
  stock_movements: [
    { date: '2024-09-01', receipts: 150, issues: 120, adjustments: 5 },
    { date: '2024-09-02', receipts: 200, issues: 180, adjustments: 2 },
    { date: '2024-09-03', receipts: 100, issues: 90, adjustments: 3 },
    { date: '2024-09-04', receipts: 300, issues: 250, adjustments: 1 },
    { date: '2024-09-05', receipts: 180, issues: 160, adjustments: 4 }
  ]
};

const mockSupplierAnalytics = {
  total_suppliers: 8,
  active_suppliers: 6,
  top_suppliers: [
    {
      id: '1',
      name: 'Global Medical Supplies Ltd.',
      order_count: 15,
      total_value: 25000,
      avg_delivery_time: 7,
      quality_rating: 4.5
    },
    {
      id: '2',
      name: 'MedTech Solutions Inc.',
      order_count: 12,
      total_value: 18000,
      avg_delivery_time: 5,
      quality_rating: 4.8
    }
  ],
  supplier_performance: [
    {
      supplier_id: '1',
      name: 'Global Medical Supplies Ltd.',
      on_time_delivery: 85,
      quality_score: 4.5,
      cost_efficiency: 0.75
    },
    {
      supplier_id: '2',
      name: 'MedTech Solutions Inc.',
      on_time_delivery: 95,
      quality_score: 4.8,
      cost_efficiency: 0.82
    }
  ]
};

const mockFinancialAnalytics = {
  revenue: {
    total_revenue: 30000,
    retail_revenue: 8500,
    wholesale_revenue: 21500,
    monthly_growth: 12.5
  },
  costs: {
    total_costs: 18000,
    cost_of_goods_sold: 15000,
    operating_costs: 3000
  },
  profitability: {
    gross_profit: 15000,
    gross_margin: 50.0,
    net_profit: 12000,
    net_margin: 40.0
  },
  pricing_analysis: {
    avg_retail_markup: 80.0,
    avg_wholesale_markup: 40.0,
    price_variance: 5.2
  }
};

const mockAuditTrailAnalytics = {
  total_actions: 1250,
  user_activity: [
    {
      user_id: '1',
      user_name: 'John Smith',
      action_count: 450,
      last_activity: '2024-09-12T10:30:00Z'
    },
    {
      user_id: '2',
      user_name: 'Sarah Johnson',
      action_count: 380,
      last_activity: '2024-09-12T09:15:00Z'
    },
    {
      user_id: '3',
      user_name: 'Mike Wilson',
      action_count: 320,
      last_activity: '2024-09-11T16:45:00Z'
    }
  ],
  critical_actions: [
    {
      action: 'DELETE',
      count: 5,
      last_occurred: '2024-09-10T14:20:00Z'
    },
    {
      action: 'UPDATE_PRICE',
      count: 25,
      last_occurred: '2024-09-12T08:30:00Z'
    },
    {
      action: 'APPROVE_QUOTATION',
      count: 15,
      last_occurred: '2024-09-12T11:15:00Z'
    }
  ],
  compliance_score: 92
};

const mockEnquirySourceAnalytics = {
  email: 8,
  phone: 4,
  web_form: 2,
  walk_in: 1,
  referral: 0,
  source_performance: [
    {
      source: 'Email',
      conversion_rate: 75.0,
      avg_value: 2500
    },
    {
      source: 'Phone',
      conversion_rate: 100.0,
      avg_value: 1800
    },
    {
      source: 'Web Form',
      conversion_rate: 50.0,
      avg_value: 1200
    },
    {
      source: 'Walk-in',
      conversion_rate: 100.0,
      avg_value: 800
    }
  ]
};

// Get dashboard KPIs
router.get("/dashboard", async (req, res) => {
  try {
    res.json(mockAnalyticsData);
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    res.status(500).json({ error: "Failed to fetch dashboard analytics" });
  }
});

// Get sales trends
router.get("/sales/trends", async (req, res) => {
  try {
    res.json(mockSalesTrends);
  } catch (error) {
    console.error("Error fetching sales trends:", error);
    res.status(500).json({ error: "Failed to fetch sales trends" });
  }
});

// Get top customers
router.get("/customers/top", async (req, res) => {
  try {
    res.json(mockTopCustomers);
  } catch (error) {
    console.error("Error fetching top customers:", error);
    res.status(500).json({ error: "Failed to fetch top customers" });
  }
});

// Get top products
router.get("/products/top", async (req, res) => {
  try {
    res.json(mockTopProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: "Failed to fetch top products" });
  }
});

// Get conversion funnel
router.get("/conversion/funnel", async (req, res) => {
  try {
    res.json(mockConversionFunnel);
  } catch (error) {
    console.error("Error fetching conversion funnel:", error);
    res.status(500).json({ error: "Failed to fetch conversion funnel" });
  }
});

// Get inventory analytics
router.get("/inventory", async (req, res) => {
  try {
    res.json(mockInventoryAnalytics);
  } catch (error) {
    console.error("Error fetching inventory analytics:", error);
    res.status(500).json({ error: "Failed to fetch inventory analytics" });
  }
});

// Get supplier analytics
router.get("/suppliers", async (req, res) => {
  try {
    res.json(mockSupplierAnalytics);
  } catch (error) {
    console.error("Error fetching supplier analytics:", error);
    res.status(500).json({ error: "Failed to fetch supplier analytics" });
  }
});

// Get financial analytics
router.get("/financial", async (req, res) => {
  try {
    res.json(mockFinancialAnalytics);
  } catch (error) {
    console.error("Error fetching financial analytics:", error);
    res.status(500).json({ error: "Failed to fetch financial analytics" });
  }
});

// Get audit trail analytics
router.get("/audit-trail", async (req, res) => {
  try {
    res.json(mockAuditTrailAnalytics);
  } catch (error) {
    console.error("Error fetching audit trail analytics:", error);
    res.status(500).json({ error: "Failed to fetch audit trail analytics" });
  }
});

// Get enquiry source analytics
router.get("/enquiry-sources", async (req, res) => {
  try {
    res.json(mockEnquirySourceAnalytics);
  } catch (error) {
    console.error("Error fetching enquiry source analytics:", error);
    res.status(500).json({ error: "Failed to fetch enquiry source analytics" });
  }
});

export default router;
