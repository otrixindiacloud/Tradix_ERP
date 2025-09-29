import { Router } from "express";
import { db } from "../db";
import { auditLog } from "../../shared/schemas/audit";
import { eq, desc, and, gte, lte, like, sql } from "drizzle-orm";

const router = Router();

// Get audit logs with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      entityType,
      action,
      userId,
      startDate,
      endDate,
      search
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    let whereConditions = [];
    
    if (entityType) {
      whereConditions.push(eq(auditLog.entityType, entityType as string));
    }
    
    if (action) {
      whereConditions.push(eq(auditLog.action, action as string));
    }
    
    if (userId) {
      whereConditions.push(eq(auditLog.userId, userId as string));
    }
    
    if (startDate) {
      whereConditions.push(gte(auditLog.timestamp, new Date(startDate as string)));
    }
    
    if (endDate) {
      whereConditions.push(lte(auditLog.timestamp, new Date(endDate as string)));
    }

    const logs = await db
      .select()
      .from(auditLog)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(auditLog.timestamp))
      .limit(Number(limit))
      .offset(offset);

    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(auditLog)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    res.json({
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(totalCount[0]?.count || 0),
        pages: Math.ceil(Number(totalCount[0]?.count || 0) / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

// Get audit log by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const log = await db
      .select()
      .from(auditLog)
      .where(eq(auditLog.id, id))
      .limit(1);

    if (log.length === 0) {
      return res.status(404).json({ error: "Audit log not found" });
    }

    res.json(log[0]);
  } catch (error) {
    console.error("Error fetching audit log:", error);
    res.status(500).json({ error: "Failed to fetch audit log" });
  }
});

// Get audit logs for a specific entity
router.get("/entity/:entityType/:entityId", async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    
    const logs = await db
      .select()
      .from(auditLog)
      .where(
        and(
          eq(auditLog.entityType, entityType),
          eq(auditLog.entityId, entityId)
        )
      )
      .orderBy(desc(auditLog.timestamp));

    res.json(logs);
  } catch (error) {
    console.error("Error fetching entity audit logs:", error);
    res.status(500).json({ error: "Failed to fetch entity audit logs" });
  }
});

// Get audit log statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let whereConditions = [];
    
    if (startDate) {
      whereConditions.push(gte(auditLog.timestamp, new Date(startDate as string)));
    }
    
    if (endDate) {
      whereConditions.push(lte(auditLog.timestamp, new Date(endDate as string)));
    }

    const stats = await db
      .select({
        totalActions: sql`count(*)`,
        uniqueUsers: sql`count(distinct ${auditLog.userId})`,
        uniqueEntities: sql`count(distinct ${auditLog.entityType})`
      })
      .from(auditLog)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const actionBreakdown = await db
      .select({
        action: auditLog.action,
        count: sql`count(*)`
      })
      .from(auditLog)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .groupBy(auditLog.action);

    res.json({
      summary: stats[0],
      actionBreakdown
    });
  } catch (error) {
    console.error("Error fetching audit statistics:", error);
    res.status(500).json({ error: "Failed to fetch audit statistics" });
  }
});

export default router;
