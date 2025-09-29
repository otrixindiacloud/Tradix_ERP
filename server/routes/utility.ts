import type { Express } from "express";
import { storage } from "../storage";
import { z } from "zod";

export function registerUtilityRoutes(app: Express) {
  // Exchange rates
  app.get("/api/exchange-rates", async (req, res) => {
    try {
      const { fromCurrency, toCurrency } = req.query;
      const exchangeRate = await storage.getExchangeRate(fromCurrency as string, toCurrency as string);
      res.json({ fromCurrency, toCurrency, rate: exchangeRate });
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      res.status(500).json({ message: "Failed to fetch exchange rate" });
    }
  });

  // Original exchange rate route
  app.get("/api/exchange-rate/:from/:to", async (req, res) => {
    try {
      const { from, to } = req.params;
      const exchangeRate = await storage.getExchangeRate(from, to);
      res.json({ exchangeRate });
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      res.status(500).json({ message: "Failed to fetch exchange rate" });
    }
  });

  // Barcode verification
  app.post("/api/barcode/verify", async (req, res) => {
    try {
      const { barcode, itemId } = req.body;
      const result = await storage.verifyItemBarcode(barcode, itemId);
      res.json(result);
    } catch (error) {
      console.error("Error verifying barcode:", error);
      res.status(500).json({ message: "Failed to verify barcode" });
    }
  });

  // Original barcode verification route
  app.post("/api/verify-barcode", async (req, res) => {
    try {
      const { barcode, expectedItemId } = req.body;
      const result = await storage.verifyItemBarcode(barcode, expectedItemId);
      res.json(result);
    } catch (error) {
      console.error("Error verifying barcode:", error);
      res.status(500).json({ message: "Failed to verify barcode" });
    }
  });

  // Currency conversion
  app.post("/api/currency/convert", async (req, res) => {
    try {
      const { amount, fromCurrency, toCurrency, exchangeRate } = req.body;
      const convertedAmount = await storage.convertCurrency(amount, fromCurrency, toCurrency, exchangeRate);
      res.json({ originalAmount: amount, convertedAmount, fromCurrency, toCurrency });
    } catch (error) {
      console.error("Error converting currency:", error);
      res.status(500).json({ message: "Failed to convert currency" });
    }
  });

  // Original currency conversion route
  app.post("/api/convert-currency", async (req, res) => {
    try {
      const { amount, fromCurrency, toCurrency, exchangeRate } = req.body;
      const convertedAmount = await storage.convertCurrency(amount, fromCurrency, toCurrency, exchangeRate);
      res.json({ convertedAmount });
    } catch (error) {
      console.error("Error converting currency:", error);
      res.status(500).json({ message: "Failed to convert currency" });
    }
  });

  // Update invoice currency
  app.post("/api/invoices/:id/update-currency", async (req, res) => {
    try {
      const { newCurrency, exchangeRate, userId } = req.body;
      const invoice = await storage.updateInvoiceCurrency(req.params.id, newCurrency, exchangeRate, userId);
      res.json(invoice);
    } catch (error) {
      console.error("Error updating invoice currency:", error);
      res.status(500).json({ message: "Failed to update invoice currency" });
    }
  });

  // System health check
  app.get("/api/health", async (req, res) => {
    try {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    } catch (error) {
      console.error("Error checking system health:", error);
      res.status(500).json({ message: "Failed to check system health" });
    }
  });
}
