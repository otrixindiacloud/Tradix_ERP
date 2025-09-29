import type { Express, Request, Response } from "express";

interface ActivityItem {
  id: string;
  type: 'enquiry' | 'quotation' | 'sales_order' | 'invoice' | 'purchase_order' | 'goods_receipt' | 'delivery' | 'inventory' | 'customer' | 'supplier' | 'user' | 'system';
  action: string;
  title: string;
  description: string;
  entityId: string;
  entityName?: string;
  userId: string;
  userName: string;
  timestamp: string;
  status?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}

interface ActivityStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byType: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  byUser: Array<{
    userId: string;
    userName: string;
    count: number;
  }>;
}

// Mock data for demonstration
const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "quotation",
    action: "created",
    title: "New Quotation Created",
    description: "Quotation QT-2024-015 created for Al Rawi Trading",
    entityId: "QT-2024-015",
    entityName: "Al Rawi Trading",
    userId: "user-001",
    userName: "Ahmed Al-Mansouri",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    status: "Draft",
    priority: "medium"
  },
  {
    id: "2",
    type: "enquiry",
    action: "received",
    title: "New Enquiry Received",
    description: "Enquiry ENQ-2024-089 received from Gulf Construction Co.",
    entityId: "ENQ-2024-089",
    entityName: "Gulf Construction Co.",
    userId: "system",
    userName: "System",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: "New",
    priority: "high"
  },
  {
    id: "3",
    type: "sales_order",
    action: "approved",
    title: "Sales Order Approved",
    description: "Sales Order SO-2024-012 approved and ready for processing",
    entityId: "SO-2024-012",
    entityName: "Al Rawi Trading",
    userId: "user-002",
    userName: "Sarah Johnson",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: "Approved",
    priority: "high"
  },
  {
    id: "4",
    type: "goods_receipt",
    action: "completed",
    title: "Goods Receipt Completed",
    description: "Goods received for LPO-SUP-001 from ABC Suppliers",
    entityId: "GR-2024-008",
    entityName: "ABC Suppliers",
    userId: "user-003",
    userName: "Mohammed Hassan",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "Completed",
    priority: "medium"
  },
  {
    id: "5",
    type: "invoice",
    action: "sent",
    title: "Invoice Sent",
    description: "Invoice INV-2024-045 sent to customer",
    entityId: "INV-2024-045",
    entityName: "Al Rawi Trading",
    userId: "user-001",
    userName: "Ahmed Al-Mansouri",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: "Sent",
    priority: "low"
  },
  {
    id: "6",
    type: "delivery",
    action: "completed",
    title: "Delivery Completed",
    description: "Delivery DEL-2024-023 completed successfully",
    entityId: "DEL-2024-023",
    entityName: "Gulf Construction Co.",
    userId: "user-004",
    userName: "Ali Al-Rashid",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: "Delivered",
    priority: "medium"
  },
  {
    id: "7",
    type: "inventory",
    action: "updated",
    title: "Inventory Updated",
    description: "Stock levels updated for Steel Beams (Item #STB-001)",
    entityId: "STB-001",
    entityName: "Steel Beams",
    userId: "user-003",
    userName: "Mohammed Hassan",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: "Updated",
    priority: "low"
  },
  {
    id: "8",
    type: "customer",
    action: "created",
    title: "New Customer Added",
    description: "New customer 'Dubai Steel Works' added to the system",
    entityId: "CUST-2024-012",
    entityName: "Dubai Steel Works",
    userId: "user-002",
    userName: "Sarah Johnson",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    status: "Active",
    priority: "medium"
  },
  {
    id: "9",
    type: "quotation",
    action: "accepted",
    title: "Quotation Accepted",
    description: "Quotation QT-2024-010 accepted by customer",
    entityId: "QT-2024-010",
    entityName: "Emirates Construction",
    userId: "system",
    userName: "System",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    status: "Accepted",
    priority: "high"
  },
  {
    id: "10",
    type: "purchase_order",
    action: "created",
    title: "Purchase Order Created",
    description: "Purchase Order PO-2024-007 created for supplier",
    entityId: "PO-2024-007",
    entityName: "Steel Suppliers Ltd",
    userId: "user-001",
    userName: "Ahmed Al-Mansouri",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "Created",
    priority: "medium"
  }
];

const mockStats: ActivityStats = {
  total: 1250,
  today: 45,
  thisWeek: 320,
  thisMonth: 1250,
  byType: [
    { type: 'enquiry', count: 180, percentage: 14.4 },
    { type: 'quotation', count: 220, percentage: 17.6 },
    { type: 'sales_order', count: 190, percentage: 15.2 },
    { type: 'invoice', count: 165, percentage: 13.2 },
    { type: 'purchase_order', count: 140, percentage: 11.2 },
    { type: 'goods_receipt', count: 120, percentage: 9.6 },
    { type: 'delivery', count: 110, percentage: 8.8 },
    { type: 'inventory', count: 85, percentage: 6.8 },
    { type: 'customer', count: 25, percentage: 2.0 },
    { type: 'supplier', count: 15, percentage: 1.2 }
  ],
  byUser: [
    { userId: 'user-001', userName: 'Ahmed Al-Mansouri', count: 320 },
    { userId: 'user-002', userName: 'Sarah Johnson', count: 280 },
    { userId: 'user-003', userName: 'Mohammed Hassan', count: 250 },
    { userId: 'user-004', userName: 'Ali Al-Rashid', count: 200 },
    { userId: 'system', userName: 'System', count: 200 }
  ]
};

export function registerRecentActivitiesRoutes(app: Express) {
  // Get recent activities with filters
  app.get("/api/recent-activities", async (req: Request, res: Response) => {
    try {
      const {
        type,
        action,
        userId,
        startDate,
        endDate,
        search,
        priority,
        page = "1",
        limit = "50"
      } = req.query;

      let filteredActivities = [...mockActivities];

      // Apply filters
      if (type) {
        filteredActivities = filteredActivities.filter(activity => activity.type === type);
      }
      if (action) {
        filteredActivities = filteredActivities.filter(activity => activity.action === action);
      }
      if (userId) {
        filteredActivities = filteredActivities.filter(activity => activity.userId === userId);
      }
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredActivities = filteredActivities.filter(activity => 
          activity.title.toLowerCase().includes(searchTerm) ||
          activity.description.toLowerCase().includes(searchTerm) ||
          activity.entityId.toLowerCase().includes(searchTerm) ||
          (activity.entityName && activity.entityName.toLowerCase().includes(searchTerm))
        );
      }
      if (priority) {
        filteredActivities = filteredActivities.filter(activity => activity.priority === priority);
      }
      if (startDate || endDate) {
        filteredActivities = filteredActivities.filter(activity => {
          const activityDate = new Date(activity.timestamp);
          if (startDate) {
            const start = new Date(startDate as string);
            if (activityDate < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate as string);
            end.setHours(23, 59, 59, 999); // End of day
            if (activityDate > end) return false;
          }
          return true;
        });
      }

      // Sort by timestamp (newest first)
      filteredActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

      const totalPages = Math.ceil(filteredActivities.length / limitNum);

      res.json({
        activities: paginatedActivities,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredActivities.length,
          pages: totalPages
        }
      });
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      res.status(500).json({ error: "Failed to fetch recent activities" });
    }
  });

  // Get activity statistics
  app.get("/api/recent-activities/stats", async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      let stats = { ...mockStats };

      // If date range is provided, filter activities and recalculate stats
      if (startDate || endDate) {
        let filteredActivities = [...mockActivities];
        
        if (startDate || endDate) {
          filteredActivities = filteredActivities.filter(activity => {
            const activityDate = new Date(activity.timestamp);
            if (startDate) {
              const start = new Date(startDate as string);
              if (activityDate < start) return false;
            }
            if (endDate) {
              const end = new Date(endDate as string);
              end.setHours(23, 59, 59, 999);
              if (activityDate > end) return false;
            }
            return true;
          });
        }

        // Recalculate stats based on filtered activities
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        stats = {
          total: filteredActivities.length,
          today: filteredActivities.filter(a => {
            const activityDate = new Date(a.timestamp);
            return activityDate.toDateString() === today.toDateString();
          }).length,
          thisWeek: filteredActivities.filter(a => new Date(a.timestamp) >= weekAgo).length,
          thisMonth: filteredActivities.filter(a => new Date(a.timestamp) >= monthAgo).length,
          byType: [],
          byUser: []
        };

        // Calculate by type
        const typeCounts: Record<string, number> = {};
        filteredActivities.forEach(activity => {
          typeCounts[activity.type] = (typeCounts[activity.type] || 0) + 1;
        });

        stats.byType = Object.entries(typeCounts).map(([type, count]) => ({
          type,
          count,
          percentage: (count / filteredActivities.length) * 100
        }));

        // Calculate by user
        const userCounts: Record<string, { name: string; count: number }> = {};
        filteredActivities.forEach(activity => {
          if (!userCounts[activity.userId]) {
            userCounts[activity.userId] = { name: activity.userName, count: 0 };
          }
          userCounts[activity.userId].count++;
        });

        stats.byUser = Object.entries(userCounts).map(([userId, data]) => ({
          userId,
          userName: data.name,
          count: data.count
        }));
      }

      res.json(stats);
    } catch (error) {
      console.error("Error fetching activity stats:", error);
      res.status(500).json({ error: "Failed to fetch activity statistics" });
    }
  });

  // Export activities to CSV
  app.get("/api/recent-activities/export", async (req: Request, res: Response) => {
    try {
      const { type, action, userId, startDate, endDate, search, priority } = req.query;

      let filteredActivities = [...mockActivities];

      // Apply same filters as the main endpoint
      if (type) {
        filteredActivities = filteredActivities.filter(activity => activity.type === type);
      }
      if (action) {
        filteredActivities = filteredActivities.filter(activity => activity.action === action);
      }
      if (userId) {
        filteredActivities = filteredActivities.filter(activity => activity.userId === userId);
      }
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredActivities = filteredActivities.filter(activity => 
          activity.title.toLowerCase().includes(searchTerm) ||
          activity.description.toLowerCase().includes(searchTerm) ||
          activity.entityId.toLowerCase().includes(searchTerm) ||
          (activity.entityName && activity.entityName.toLowerCase().includes(searchTerm))
        );
      }
      if (priority) {
        filteredActivities = filteredActivities.filter(activity => activity.priority === priority);
      }
      if (startDate || endDate) {
        filteredActivities = filteredActivities.filter(activity => {
          const activityDate = new Date(activity.timestamp);
          if (startDate) {
            const start = new Date(startDate as string);
            if (activityDate < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate as string);
            end.setHours(23, 59, 59, 999);
            if (activityDate > end) return false;
          }
          return true;
        });
      }

      // Sort by timestamp (newest first)
      filteredActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Generate CSV
      const csvHeader = [
        'Timestamp',
        'Type',
        'Action',
        'Title',
        'Description',
        'Entity ID',
        'Entity Name',
        'User ID',
        'User Name',
        'Status',
        'Priority'
      ].join(',');

      const csvRows = filteredActivities.map(activity => [
        new Date(activity.timestamp).toISOString(),
        activity.type,
        activity.action,
        `"${activity.title.replace(/"/g, '""')}"`,
        `"${activity.description.replace(/"/g, '""')}"`,
        activity.entityId,
        activity.entityName || '',
        activity.userId,
        activity.userName,
        activity.status || '',
        activity.priority || ''
      ].join(','));

      const csvContent = [csvHeader, ...csvRows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="recent-activities-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
    } catch (error) {
      console.error("Error exporting activities:", error);
      res.status(500).json({ error: "Failed to export activities" });
    }
  });
}
