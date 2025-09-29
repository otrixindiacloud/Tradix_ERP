import type { Express } from "express";
import { storage } from "../storage";
import { z as zod } from "zod";
import { insertShipmentSchema } from "@shared/schema";

export function registerShipmentTrackingRoutes(app: Express) {
  // Get all shipments with filtering
  app.get("/api/shipments", async (req, res) => {
    try {
      const { 
        status, priority, carrierId, serviceType, search, dateFrom, dateTo, limit, offset 
      } = req.query;
      const filters = {
        status: status as string,
        priority: priority as string,
        carrierId: carrierId as string,
        serviceType: serviceType as string,
        search: search as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      const shipments = await storage.getShipments(filters);
      res.json(shipments);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      res.status(500).json({ message: "Failed to fetch shipments" });
    }
  });

  // Get shipment by ID
  app.get("/api/shipments/:id", async (req, res) => {
    try {
      const shipment = await storage.getShipment(req.params.id);
      if (!shipment) return res.status(404).json({ message: "Shipment not found" });
      res.json(shipment);
    } catch (error) {
      console.error("Error fetching shipment:", error);
      res.status(500).json({ message: "Failed to fetch shipment" });
    }
  });

  // Get shipment by tracking number
  app.get("/api/shipments/tracking/:trackingNumber", async (req, res) => {
    try {
      const shipment = await storage.getShipmentByTrackingNumber(req.params.trackingNumber);
      if (!shipment) return res.status(404).json({ message: "Shipment not found" });
      res.json(shipment);
    } catch (error) {
      console.error("Error fetching shipment by tracking number:", error);
      res.status(500).json({ message: "Failed to fetch shipment" });
    }
  });

  // Create new shipment (clean, tolerant)
  app.post("/api/shipments", async (req, res) => {
    try {
  const data: any = { ...req.body };
      // Provide defaults
      data.status ||= 'Pending';
      data.serviceType ||= 'Standard';
      data.priority ||= 'Medium';

      // Normalize date-like fields: allow string, convert if valid, else undefined
      ['estimatedDelivery','actualDelivery','lastUpdate'].forEach(f => {
        if (typeof data[f] === 'string') {
          const s = data[f].trim();
          if (!s) data[f] = undefined; else {
            const d = new Date(s);
            if (!isNaN(d.getTime())) data[f] = d; else data[f] = undefined;
          }
        }
      });

      // Carrier name lookup if missing
      if (!data.carrierName && data.carrierId) {
        try { const c = await storage.getSupplier(data.carrierId); if (c?.name) data.carrierName = c.name; } catch {}
      }

      // Build relaxed schema (shipmentNumber & trackingNumber optional at creation); date fields optional
      const relaxed = insertShipmentSchema.partial({ shipmentNumber: true, trackingNumber: true, carrierName: true })
        .extend({
          estimatedDelivery: zod.date().optional().nullable(),
          actualDelivery: zod.date().optional().nullable(),
          lastUpdate: zod.date().optional().nullable(),
          carrierName: zod.string().optional(),
        });

      // Attempt to coerce any leftover strings that look like dates
      ['estimatedDelivery','actualDelivery','lastUpdate'].forEach(f => {
        if (typeof data[f] === 'string') {
          const d = new Date(data[f]);
          if (!isNaN(d.getTime())) data[f] = d; else delete data[f];
        }
      });

      const parsed = relaxed.safeParse(data);
      if (!parsed.success) {
        const msgs = parsed.error.errors.map(e => `${e.path.join('.') || 'field'}: ${e.message}`);
        return res.status(400).json({ message: msgs.join(' | '), debugErrors: parsed.error.errors, received: data });
      }

      // Minimal manual required fields (origin / destination)
      if (!data.origin || !data.origin.trim()) return res.status(400).json({ message: 'origin: Required', received: data });
      if (!data.destination || !data.destination.trim()) return res.status(400).json({ message: 'destination: Required', received: data });
      if (!data.carrierId) return res.status(400).json({ message: 'carrierId: Required', received: data });

      const shipment = await storage.createShipment(parsed.data);
      return res.status(201).json(shipment);
    } catch (err: any) {
      console.error('Error creating shipment (final handler):', err);
      return res.status(500).json({ message: err?.message || 'Failed to create shipment' });
    }
  });

  // Update shipment
  app.put("/api/shipments/:id", async (req, res) => {
    try {
      const shipmentData = req.body;
      const shipment = await storage.updateShipment(req.params.id, shipmentData);
      res.json(shipment);
    } catch (error) {
      console.error("Error updating shipment:", error);
      if (error instanceof Error && error.message === 'Shipment not found') {
        return res.status(404).json({ message: "Shipment not found" });
      }
      res.status(500).json({ message: "Failed to update shipment" });
    }
  });

  // Delete shipment
  app.delete("/api/shipments/:id", async (req, res) => {
    try {
      await storage.deleteShipment(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting shipment:", error);
      if (error instanceof Error && error.message === 'Shipment not found') {
        return res.status(404).json({ message: "Shipment not found" });
      }
      res.status(500).json({ message: "Failed to delete shipment" });
    }
  });

  // Update shipment status
  app.patch("/api/shipments/:id/status", async (req, res) => {
    try {
      const { status, location } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const shipment = await storage.updateShipmentStatus(req.params.id, status, location);
      res.json(shipment);
    } catch (error) {
      console.error("Error updating shipment status:", error);
      if (error instanceof Error && error.message === 'Shipment not found') {
        return res.status(404).json({ message: "Shipment not found" });
      }
      res.status(500).json({ message: "Failed to update shipment status" });
    }
  });

  // Get shipment tracking events
  app.get("/api/shipments/:id/tracking", async (req, res) => {
    try {
      const events = await storage.getShipmentTrackingEvents(req.params.id);
      res.json(events);
    } catch (error) {
      console.error("Error fetching tracking events:", error);
      res.status(500).json({ message: "Failed to fetch tracking events" });
    }
  });

  // Create tracking event
  app.post("/api/shipments/:id/tracking", async (req, res) => {
    try {
      const eventData = {
        ...req.body,
        shipmentId: req.params.id
      };

      // Basic validation
      if (!eventData.location) {
        return res.status(400).json({ message: "Location is required" });
      }
      if (!eventData.status) {
        return res.status(400).json({ message: "Status is required" });
      }
      if (!eventData.description) {
        return res.status(400).json({ message: "Description is required" });
      }
      if (!eventData.scanType) {
        return res.status(400).json({ message: "Scan type is required" });
      }

      const event = await storage.createTrackingEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating tracking event:", error);
      res.status(500).json({ message: "Failed to create tracking event" });
    }
  });

  // Get latest tracking event for a shipment
  app.get("/api/shipments/:id/tracking/latest", async (req, res) => {
    try {
      const event = await storage.getLatestTrackingEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "No tracking events found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching latest tracking event:", error);
      res.status(500).json({ message: "Failed to fetch latest tracking event" });
    }
  });

  // Get shipment analytics
  app.get("/api/shipments/analytics/summary", async (req, res) => {
    try {
      const analytics = await storage.getShipmentAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching shipment analytics:", error);
      res.status(500).json({ message: "Failed to fetch shipment analytics" });
    }
  });

  // Public tracking endpoint (no authentication required)
  app.get("/api/track/:trackingNumber", async (req, res) => {
    try {
      const shipment = await storage.getShipmentByTrackingNumber(req.params.trackingNumber);
      if (!shipment) {
        return res.status(404).json({ message: "Tracking number not found" });
      }

      // Get tracking events
      const events = await storage.getShipmentTrackingEvents(shipment.id);

      // Return public tracking information (limited data)
      const publicTrackingData = {
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        origin: shipment.origin,
        destination: shipment.destination,
        estimatedDelivery: shipment.estimatedDelivery,
        actualDelivery: shipment.actualDelivery,
        currentLocation: shipment.currentLocation,
        lastUpdate: shipment.lastUpdate,
        events: events.map(event => ({
          timestamp: event.timestamp,
          location: event.location,
          status: event.status,
          description: event.description,
          scanType: event.scanType
        }))
      };

      res.json(publicTrackingData);
    } catch (error) {
      console.error("Error in public tracking:", error);
      res.status(500).json({ message: "Failed to fetch tracking information" });
    }
  });

  // Get carriers (suppliers acting as carriers)
  app.get("/api/carriers", async (req, res) => {
    try {
      // Get suppliers that can act as carriers
      const suppliers = await storage.getSuppliers();
      const carriers = suppliers.map(supplier => ({
        id: supplier.id,
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        isActive: supplier.isActive
      }));
      res.json(carriers);
    } catch (error) {
      console.error("Error fetching carriers:", error);
      res.status(500).json({ message: "Failed to fetch carriers" });
    }
  });
}