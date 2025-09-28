import type { Express } from "express";
import { storage } from "../storage";
import { insertCustomerSchema } from "@shared/schema";
import { z } from "zod";

export function registerCustomerRoutes(app: Express) {
  // Customer routes
  app.get("/api/customers", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const page = Math.floor(offset / limit) + 1;
      
      // Extract filter parameters
      const filters = {
        customerType: req.query.customerType as string,
        classification: req.query.classification as string,
        isActive: req.query.isActive as string,
        search: req.query.search as string,
        // Legacy support for name/email search
        name: req.query.name as string,
        email: req.query.email as string
      };
      
      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });
      
      
      let customers;
      let totalCount;
      
      // Check if using legacy name/email search
      if (filters.name || filters.email) {
        customers = await (storage as any).searchCustomers({ name: filters.name, email: filters.email }, limit, offset);
        // For legacy search, we'll use the stats total (not ideal but maintains compatibility)
        const stats = await (storage as any).getCustomerStats();
        totalCount = stats.totalCustomers;
      } else {
        // Use new filter system
        customers = await (storage as any).getCustomers(limit, offset, filters);
        totalCount = await (storage as any).getCustomersCount(filters);
      }
      
      const pagination = {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      };
      
      res.json({
        customers,
        pagination
      });
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get("/api/customers/stats", async (req, res) => {
    try {
      const stats = await (storage as any).getCustomerStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching customer stats:", error);
      res.status(500).json({ message: "Failed to fetch customer statistics" });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.get("/api/customers/:id/details", async (req, res) => {
    try {
      const customerDetails = await (storage as any).getCustomerDetails(req.params.id);
      if (!customerDetails) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customerDetails);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      res.status(500).json({ message: "Failed to fetch customer details" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      
      // Handle duplicate constraint violations
      if (error instanceof Error && error.message.includes("already exists")) {
        return res.status(409).json({ 
          message: "Duplicate customer", 
          error: error.message 
        });
      }
      
      console.error("Error creating customer:", error);
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(req.params.id, customerData);
      res.json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      
      // Handle duplicate constraint violations
      if (error instanceof Error && error.message.includes("already exists")) {
        return res.status(409).json({ 
          message: "Duplicate customer", 
          error: error.message 
        });
      }
      
      console.error("Error updating customer:", error);
      res.status(500).json({ message: "Failed to update customer" });
    }
  });
}
