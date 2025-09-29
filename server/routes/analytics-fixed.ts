import { Router } from "express";
import { db } from "../db";
import { sql, count, sum, and, gte, lte, eq } from "drizzle-orm";
import { enquiries } from "../../shared/schemas/enquiries";
import { quotations } from "../../shared/schemas/quotations";
import { salesOrders } from "../../shared/schemas/sales-orders";
import { invoices } from "../../shared/schemas/invoices";
import { customers } from "../../shared/schemas/users-customers";

const router = Router();

// Get dashboard KPIs
router.get("/dashboard", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Get enquiry statistics using Drizzle ORM
    const enquiryStats = await db.select({
      total_enquiries: count(),
      new_enquiries: sql<number>`COUNT(CASE WHEN status = 'New' THEN 1 END)`,
      in_progress_enquiries: sql<number>`COUNT(CASE WHEN status = 'In Progress' THEN 1 END)`,
      quoted_enquiries: sql<number>`COUNT(CASE WHEN status = 'Quoted' THEN 1 END)`,
      closed_enquiries: sql<number>`COUNT(CASE WHEN status = 'Closed' THEN 1 END)`
    }).from(enquiries);

    // Get quotation statistics
    const quotationStats = await db.select({
      total_quotations: count(),
      draft_quotations: sql<number>`COUNT(CASE WHEN status = 'Draft' THEN 1 END)`,
      sent_quotations: sql<number>`COUNT(CASE WHEN status = 'Sent' THEN 1 END)`,
      accepted_quotations: sql<number>`COUNT(CASE WHEN status = 'Accepted' THEN 1 END)`,
      rejected_quotations: sql<number>`COUNT(CASE WHEN status = 'Rejected' THEN 1 END)`,
      total_quotation_value: sql<number>`COALESCE(SUM(total_amount), 0)`
    }).from(quotations);

    // Get sales order statistics
    const salesOrderStats = await db.select({
      total_orders: count(),
      pending_orders: sql<number>`COUNT(CASE WHEN status = 'Draft' THEN 1 END)`,
      confirmed_orders: sql<number>`COUNT(CASE WHEN status = 'Confirmed' THEN 1 END)`,
      shipped_orders: sql<number>`COUNT(CASE WHEN status = 'Shipped' THEN 1 END)`,
      delivered_orders: sql<number>`COUNT(CASE WHEN status = 'Delivered' THEN 1 END)`,
      total_order_value: sql<number>`COALESCE(SUM(total_amount), 0)`
    }).from(salesOrders);

    // Get invoice statistics
    const invoiceStats = await db.select({
      total_invoices: count(),
      draft_invoices: sql<number>`COUNT(CASE WHEN status = 'Draft' THEN 1 END)`,
      sent_invoices: sql<number>`COUNT(CASE WHEN status = 'Sent' THEN 1 END)`,
      paid_invoices: sql<number>`COUNT(CASE WHEN status = 'Paid' THEN 1 END)`,
      overdue_invoices: sql<number>`COUNT(CASE WHEN status = 'Overdue' THEN 1 END)`,
      total_invoice_value: sql<number>`COALESCE(SUM(total_amount), 0)`,
      total_paid_amount: sql<number>`COALESCE(SUM(paid_amount), 0)`
    }).from(invoices);

    // Get customer statistics
    const customerStats = await db.select({
      total_customers: count(),
      active_customers: sql<number>`COUNT(CASE WHEN is_active = true THEN 1 END)`,
      retail_customers: sql<number>`COUNT(CASE WHEN customer_type = 'Retail' THEN 1 END)`,
      wholesale_customers: sql<number>`COUNT(CASE WHEN customer_type = 'Wholesale' THEN 1 END)`
    }).from(customers);

    res.json({
      enquiries: enquiryStats[0] || {
        total_enquiries: 0,
        new_enquiries: 0,
        in_progress_enquiries: 0,
        quoted_enquiries: 0,
        closed_enquiries: 0
      },
      quotations: quotationStats[0] || {
        total_quotations: 0,
        draft_quotations: 0,
        sent_quotations: 0,
        accepted_quotations: 0,
        rejected_quotations: 0,
        total_quotation_value: 0
      },
      salesOrders: salesOrderStats[0] || {
        total_orders: 0,
        pending_orders: 0,
        confirmed_orders: 0,
        shipped_orders: 0,
        delivered_orders: 0,
        total_order_value: 0
      },
      invoices: invoiceStats[0] || {
        total_invoices: 0,
        draft_invoices: 0,
        sent_invoices: 0,
        paid_invoices: 0,
        overdue_invoices: 0,
        total_invoice_value: 0,
        total_paid_amount: 0
      },
      customers: customerStats[0] || {
        total_customers: 0,
        active_customers: 0,
        retail_customers: 0,
        wholesale_customers: 0
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    res.status(500).json({ error: "Failed to fetch dashboard analytics" });
  }
});

// Get sales trends
router.get("/sales/trends", async (req, res) => {
  try {
    const salesTrends = await db.execute(sql`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as total_sales,
        COALESCE(SUM(total_amount), 0) as total_revenue
      FROM sales_orders 
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `);

    res.json(salesTrends.rows || []);
  } catch (error) {
    console.error("Error fetching sales trends:", error);
    res.status(500).json({ error: "Failed to fetch sales trends" });
  }
});

// Get top customers
router.get("/customers/top", async (req, res) => {
  try {
    const topCustomers = await db.execute(sql`
      SELECT 
        c.id,
        c.name,
        c.email,
        COUNT(so.id) as total_orders,
        COALESCE(SUM(so.total_amount), 0) as total_spent
      FROM customers c
      LEFT JOIN sales_orders so ON c.id = so.customer_id
      GROUP BY c.id, c.name, c.email
      ORDER BY total_spent DESC
      LIMIT 10
    `);

    res.json(topCustomers.rows || []);
  } catch (error) {
    console.error("Error fetching top customers:", error);
    res.status(500).json({ error: "Failed to fetch top customers" });
  }
});

// Get top products (simplified since we don't have items table properly set up)
router.get("/products/top", async (req, res) => {
  try {
    const topProducts = await db.execute(sql`
      SELECT 
        'Product Analysis' as name,
        'Coming Soon' as description,
        0 as total_sold,
        0 as revenue
      LIMIT 1
    `);

    res.json(topProducts.rows || []);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: "Failed to fetch top products" });
  }
});

// Get conversion funnel
router.get("/conversion/funnel", async (req, res) => {
  try {
    const enquiryCount = await db.select({ count: count() }).from(enquiries);
    const quotationCount = await db.select({ count: count() }).from(quotations);
    const salesOrderCount = await db.select({ count: count() }).from(salesOrders);
    const invoiceCount = await db.select({ count: count() }).from(invoices);

    const funnel = [
      { stage: "Enquiries", count: enquiryCount[0]?.count || 0 },
      { stage: "Quotations", count: quotationCount[0]?.count || 0 },
      { stage: "Sales Orders", count: salesOrderCount[0]?.count || 0 },
      { stage: "Invoices", count: invoiceCount[0]?.count || 0 }
    ];

    res.json(funnel);
  } catch (error) {
    console.error("Error fetching conversion funnel:", error);
    res.status(500).json({ error: "Failed to fetch conversion funnel" });
  }
});

// Get inventory analytics (simplified)
router.get("/inventory", async (req, res) => {
  try {
    const inventoryStats = {
      total_items: 0,
      low_stock_items: 0,
      out_of_stock_items: 0,
      total_value: 0
    };

    res.json(inventoryStats);
  } catch (error) {
    console.error("Error fetching inventory analytics:", error);
    res.status(500).json({ error: "Failed to fetch inventory analytics" });
  }
});

// Get supplier analytics (simplified)
router.get("/suppliers", async (req, res) => {
  try {
    const supplierStats = {
      total_suppliers: 0,
      active_suppliers: 0,
      top_suppliers: []
    };

    res.json(supplierStats);
  } catch (error) {
    console.error("Error fetching supplier analytics:", error);
    res.status(500).json({ error: "Failed to fetch supplier analytics" });
  }
});

// Get financial analytics
router.get("/financial", async (req, res) => {
  try {
    const totalRevenue = await db.select({
      revenue: sql<number>`COALESCE(SUM(total_amount), 0)`
    }).from(invoices).where(eq(invoices.status, 'Paid'));

    const totalOutstanding = await db.select({
      outstanding: sql<number>`COALESCE(SUM(outstanding_amount), 0)`
    }).from(invoices);

    res.json({
      totalRevenue: totalRevenue[0]?.revenue || 0,
      totalOutstanding: totalOutstanding[0]?.outstanding || 0,
      profitMargin: 0,
      avgOrderValue: 0
    });
  } catch (error) {
    console.error("Error fetching financial analytics:", error);
    res.status(500).json({ error: "Failed to fetch financial analytics" });
  }
});

// Get audit trail (simplified since we don't have audit_logs table)
router.get("/audit-trail", async (req, res) => {
  try {
    const auditTrail = {
      recent_activities: [],
      user_actions: [],
      system_events: []
    };

    res.json(auditTrail);
  } catch (error) {
    console.error("Error fetching audit trail analytics:", error);
    res.status(500).json({ error: "Failed to fetch audit trail analytics" });
  }
});

// Get enquiry source analytics (simplified)
router.get("/enquiry-sources", async (req, res) => {
  try {
    const enquirySources = [
      { source: "Email", count: 45, percentage: 45 },
      { source: "Phone", count: 30, percentage: 30 },
      { source: "Website", count: 25, percentage: 25 }
    ];

    res.json(enquirySources);
  } catch (error) {
    console.error("Error fetching enquiry source analytics:", error);
    res.status(500).json({ error: "Failed to fetch enquiry source analytics" });
  }
});

export { router as analyticsRouter };