import type { Express } from "express";
import { storage } from "../storage";
import { insertApprovalRuleSchema, insertQuotationApprovalSchema } from "@shared/schema";
import { z } from "zod";

export function registerApprovalRoutes(app: Express) {
  // Approval Rules routes
  app.get("/api/approval-rules", async (req, res) => {
    try {
      const rules = await storage.getApprovalRules();
      res.json(rules);
    } catch (error) {
      console.error("Error fetching approval rules:", error);
      res.status(500).json({ message: "Failed to fetch approval rules" });
    }
  });

  app.post("/api/approval-rules", async (req, res) => {
    try {
      const ruleData = insertApprovalRuleSchema.parse(req.body);
      const rule = await storage.createApprovalRule(ruleData);
      res.status(201).json(rule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid approval rule data", errors: error.errors });
      }
      console.error("Error creating approval rule:", error);
      res.status(500).json({ message: "Failed to create approval rule" });
    }
  });

  app.put("/api/approval-rules/:id", async (req, res) => {
    try {
      const ruleData = insertApprovalRuleSchema.partial().parse(req.body);
      const rule = await storage.updateApprovalRule(req.params.id, ruleData);
      res.json(rule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid approval rule data", errors: error.errors });
      }
      console.error("Error updating approval rule:", error);
      res.status(500).json({ message: "Failed to update approval rule" });
    }
  });

  app.delete("/api/approval-rules/:id", async (req, res) => {
    try {
      await storage.deleteApprovalRule(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting approval rule:", error);
      res.status(500).json({ message: "Failed to delete approval rule" });
    }
  });

  // Quotation Approvals routes
  app.get("/api/quotations/:id/approvals", async (req, res) => {
    try {
      const approvals = await storage.getQuotationApprovals(req.params.id);
      res.json(approvals);
    } catch (error) {
      console.error("Error fetching quotation approvals:", error);
      res.status(500).json({ message: "Failed to fetch quotation approvals" });
    }
  });

  app.post("/api/quotations/:id/approvals", async (req, res) => {
    try {
      const approvalData = insertQuotationApprovalSchema.parse({
        ...req.body,
        quotationId: req.params.id,
      });
      const approval = await storage.createQuotationApproval(approvalData);
      res.status(201).json(approval);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quotation approval data", errors: error.errors });
      }
      console.error("Error creating quotation approval:", error);
      res.status(500).json({ message: "Failed to create quotation approval" });
    }
  });
}
