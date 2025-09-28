import type { Express } from "express";
import { storage } from "../storage";
import { z } from "zod";

const createNotificationSchema = z.object({
  type: z.enum([
    "step_completed", 
    "step_blocked", 
    "workflow_completed", 
    "workflow_stalled", 
    "deadline_approaching", 
    "deadline_missed", 
    "approval_required", 
    "system_alert"
  ]),
  title: z.string().min(1),
  message: z.string().min(1),
  entityId: z.string().uuid(),
  entityType: z.string(),
  entityName: z.string(),
  stepId: z.number().optional(),
  stepName: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
  assignedTo: z.string().optional(),
  actionRequired: z.boolean().default(false),
  actionUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

const updateNotificationSettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  stepCompleted: z.boolean().optional(),
  stepBlocked: z.boolean().optional(),
  workflowCompleted: z.boolean().optional(),
  deadlineApproaching: z.boolean().optional(),
  approvalRequired: z.boolean().optional(),
  systemAlerts: z.boolean().optional(),
  quietHours: z.object({
    enabled: z.boolean(),
    start: z.string(),
    end: z.string(),
  }).optional(),
});

export function registerWorkflowNotificationRoutes(app: Express) {
  // Get notifications
  app.get("/api/workflow/notifications", async (req, res) => {
    try {
      const { status, priority, search, page = 1, limit = 50 } = req.query;
      
      const filters: any = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (search) filters.search = search;

      const notifications = await storage.getWorkflowNotifications(filters, {
        page: Number(page),
        limit: Number(limit)
      });

      res.json(notifications);
    } catch (error) {
      console.error("Error fetching workflow notifications:", error);
      res.status(500).json({ message: "Failed to fetch workflow notifications" });
    }
  });

  // Get single notification
  app.get("/api/workflow/notifications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await storage.getWorkflowNotification(id);
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.json(notification);
    } catch (error) {
      console.error("Error fetching workflow notification:", error);
      res.status(500).json({ message: "Failed to fetch workflow notification" });
    }
  });

  // Create notification
  app.post("/api/workflow/notifications", async (req, res) => {
    try {
      const validatedData = createNotificationSchema.parse(req.body);
      
      const notification = await storage.createWorkflowNotification({
        ...validatedData,
        status: "unread",
        createdAt: new Date().toISOString()
      });

      // Log audit event
      await storage.logAuditEvent(
        "workflow_notification",
        notification.id,
        "created",
        req.user?.id,
        undefined,
        { entityId: validatedData.entityId, type: validatedData.type }
      );

      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating workflow notification:", error);
      res.status(500).json({ message: "Failed to create workflow notification" });
    }
  });

  // Mark notification as read
  app.post("/api/workflow/notifications/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      
      const notification = await storage.updateWorkflowNotification(id, {
        status: "read",
        readAt: new Date().toISOString()
      });

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      // Log audit event
      await storage.logAuditEvent(
        "workflow_notification",
        id,
        "read",
        req.user?.id,
        undefined,
        {}
      );

      res.json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Archive notification
  app.post("/api/workflow/notifications/:id/archive", async (req, res) => {
    try {
      const { id } = req.params;
      
      const notification = await storage.updateWorkflowNotification(id, {
        status: "archived",
        archivedAt: new Date().toISOString()
      });

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      // Log audit event
      await storage.logAuditEvent(
        "workflow_notification",
        id,
        "archived",
        req.user?.id,
        undefined,
        {}
      );

      res.json(notification);
    } catch (error) {
      console.error("Error archiving notification:", error);
      res.status(500).json({ message: "Failed to archive notification" });
    }
  });

  // Delete notification
  app.delete("/api/workflow/notifications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await storage.deleteWorkflowNotification(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Notification not found" });
      }

      // Log audit event
      await storage.logAuditEvent(
        "workflow_notification",
        id,
        "deleted",
        req.user?.id,
        undefined,
        {}
      );

      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Failed to delete notification" });
    }
  });

  // Mark all notifications as read
  app.post("/api/workflow/notifications/mark-all-read", async (req, res) => {
    try {
      const { userId } = req.body;
      
      const updated = await storage.markAllWorkflowNotificationsAsRead(userId || req.user?.id);
      
      // Log audit event
      await storage.logAuditEvent(
        "workflow_notification",
        "all",
        "mark_all_read",
        req.user?.id,
        undefined,
        { count: updated }
      );

      res.json({ 
        message: "All notifications marked as read",
        count: updated 
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  // Get notification settings
  app.get("/api/workflow/notifications/settings", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const settings = await storage.getWorkflowNotificationSettings(userId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      res.status(500).json({ message: "Failed to fetch notification settings" });
    }
  });

  // Update notification settings
  app.put("/api/workflow/notifications/settings", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const validatedData = updateNotificationSettingsSchema.parse(req.body);
      
      const settings = await storage.updateWorkflowNotificationSettings(userId, validatedData);
      
      // Log audit event
      await storage.logAuditEvent(
        "workflow_notification_settings",
        userId,
        "updated",
        req.user?.id,
        undefined,
        validatedData
      );

      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error updating notification settings:", error);
      res.status(500).json({ message: "Failed to update notification settings" });
    }
  });

  // Get notification statistics
  app.get("/api/workflow/notifications/stats", async (req, res) => {
    try {
      const userId = req.user?.id;
      const stats = await storage.getWorkflowNotificationStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching notification statistics:", error);
      res.status(500).json({ message: "Failed to fetch notification statistics" });
    }
  });

  // Send test notification
  app.post("/api/workflow/notifications/test", async (req, res) => {
    try {
      const { type = "system_alert", message = "Test notification" } = req.body;
      
      const notification = await storage.createWorkflowNotification({
        type,
        title: "Test Notification",
        message,
        entityId: "test-entity",
        entityType: "test",
        entityName: "Test Entity",
        priority: "Medium",
        status: "unread",
        actionRequired: false,
        createdAt: new Date().toISOString()
      });

      res.json({ 
        message: "Test notification sent",
        notification 
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
      res.status(500).json({ message: "Failed to send test notification" });
    }
  });

  // Bulk operations
  app.post("/api/workflow/notifications/bulk", async (req, res) => {
    try {
      const { action, notificationIds } = req.body;
      
      if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        return res.status(400).json({ message: "Notification IDs are required" });
      }

      let result;
      switch (action) {
        case "mark_read":
          result = await storage.bulkUpdateWorkflowNotifications(notificationIds, { 
            status: "read", 
            readAt: new Date().toISOString() 
          });
          break;
        case "archive":
          result = await storage.bulkUpdateWorkflowNotifications(notificationIds, { 
            status: "archived", 
            archivedAt: new Date().toISOString() 
          });
          break;
        case "delete":
          result = await storage.bulkDeleteWorkflowNotifications(notificationIds);
          break;
        default:
          return res.status(400).json({ message: "Invalid action" });
      }

      // Log audit event
      await storage.logAuditEvent(
        "workflow_notification",
        "bulk",
        action,
        req.user?.id,
        undefined,
        { count: result, notificationIds }
      );

      res.json({ 
        message: `Bulk ${action} completed`,
        count: result 
      });
    } catch (error) {
      console.error("Error performing bulk notification operation:", error);
      res.status(500).json({ message: "Failed to perform bulk operation" });
    }
  });
}
