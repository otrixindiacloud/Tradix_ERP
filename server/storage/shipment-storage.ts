import { BaseStorage } from './base.js';
import { IShipmentStorage } from './interfaces.js';
import { db } from '../db';
import { 
  shipments,
  shipmentTrackingEvents,
  salesOrders,
  customers,
  suppliers,
  users
} from '@shared/schema';
import { eq, and, desc, sql, count, ilike, or } from 'drizzle-orm';

export class ShipmentStorage extends BaseStorage implements IShipmentStorage {
  // Shipment operations
  async getShipments(filters?: {
    status?: string;
    priority?: string;
    carrierId?: string;
    serviceType?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    try {
      // Apply filters
      const conditions = [];

      if (filters?.status) {
        // Only allow valid enum values for status
        const allowedStatuses = [
          'Pending',
          'Delivered',
          'Cancelled',
          'Picked Up',
          'In Transit',
          'Out for Delivery',
          'Delayed',
          'Lost'
        ] as const;
        if (allowedStatuses.includes(filters.status as any)) {
          conditions.push(eq(shipments.status, filters.status as typeof allowedStatuses[number]));
        }
      }
      if (filters?.priority) {
        const allowedPriorities = ['Low', 'Medium', 'High', 'Urgent'] as const;
        if (allowedPriorities.includes(filters.priority as any)) {
          conditions.push(eq(shipments.priority, filters.priority as typeof allowedPriorities[number]));
        }
      }
      if (filters?.carrierId) {
        conditions.push(eq(shipments.carrierId, filters.carrierId));
      }
      if (filters?.serviceType) {
        const allowedServiceTypes = ['Standard', 'Express', 'Overnight', 'Economy'] as const;
        if (allowedServiceTypes.includes(filters.serviceType as any)) {
          conditions.push(eq(shipments.serviceType, filters.serviceType as typeof allowedServiceTypes[number]));
        }
      }
      if (filters?.search) {
        conditions.push(
          or(
            ilike(shipments.shipmentNumber, `%${filters.search}%`),
            ilike(shipments.trackingNumber, `%${filters.search}%`),
            ilike(salesOrders.orderNumber, `%${filters.search}%`),
            ilike(customers.name, `%${filters.search}%`)
          )
        );
      }
      if (filters?.dateFrom) {
        conditions.push(sql`${shipments.createdAt} >= ${filters.dateFrom}`);
      }
      if (filters?.dateTo) {
        conditions.push(sql`${shipments.createdAt} <= ${filters.dateTo}`);
      }

      let query = db
        .select({
          id: shipments.id,
          shipmentNumber: shipments.shipmentNumber,
          trackingNumber: shipments.trackingNumber,
          salesOrderId: shipments.salesOrderId,
          salesOrderNumber: salesOrders.orderNumber,
          supplierId: shipments.supplierId,
          supplierName: suppliers.name,
          carrierId: shipments.carrierId,
          carrierName: shipments.carrierName,
          serviceType: shipments.serviceType,
          status: shipments.status,
          priority: shipments.priority,
          origin: shipments.origin,
          destination: shipments.destination,
          estimatedDelivery: shipments.estimatedDelivery,
          actualDelivery: shipments.actualDelivery,
          weight: shipments.weight,
          dimensions: shipments.dimensions,
          declaredValue: shipments.declaredValue,
          currency: shipments.currency,
          shippingCost: shipments.shippingCost,
          customerReference: shipments.customerReference,
          specialInstructions: shipments.specialInstructions,
          packageCount: shipments.packageCount,
          isInsured: shipments.isInsured,
          requiresSignature: shipments.requiresSignature,
          currentLocation: shipments.currentLocation,
          lastUpdate: shipments.lastUpdate,
          createdAt: shipments.createdAt,
          updatedAt: shipments.updatedAt,
          customer: {
            id: customers.id,
            name: customers.name,
            email: customers.email
          }
        })
        .from(shipments)
        .leftJoin(salesOrders, eq(shipments.salesOrderId, salesOrders.id))
        .leftJoin(customers, eq(salesOrders.customerId, customers.id))
        .leftJoin(suppliers, eq(shipments.supplierId, suppliers.id));

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      query = query.orderBy(desc(shipments.createdAt));

      // Move limit/offset after all joins
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.offset(filters.offset);
      }

      const results = await query;
      return results;
    } catch (error) {
      console.error('Error fetching shipments:', error);
      throw new Error('Failed to fetch shipments');
    }
  }

  async getShipment(id: string): Promise<any> {
    try {
      const result = await db
        .select({
          id: shipments.id,
          shipmentNumber: shipments.shipmentNumber,
          trackingNumber: shipments.trackingNumber,
          salesOrderId: shipments.salesOrderId,
          salesOrderNumber: salesOrders.orderNumber,
          supplierId: shipments.supplierId,
          supplierName: suppliers.name,
          carrierId: shipments.carrierId,
          carrierName: shipments.carrierName,
          serviceType: shipments.serviceType,
          status: shipments.status,
          priority: shipments.priority,
          origin: shipments.origin,
          destination: shipments.destination,
          estimatedDelivery: shipments.estimatedDelivery,
          actualDelivery: shipments.actualDelivery,
          weight: shipments.weight,
          dimensions: shipments.dimensions,
          declaredValue: shipments.declaredValue,
          currency: shipments.currency,
          shippingCost: shipments.shippingCost,
          customerReference: shipments.customerReference,
          specialInstructions: shipments.specialInstructions,
          packageCount: shipments.packageCount,
          isInsured: shipments.isInsured,
          requiresSignature: shipments.requiresSignature,
          currentLocation: shipments.currentLocation,
          lastUpdate: shipments.lastUpdate,
          createdAt: shipments.createdAt,
          updatedAt: shipments.updatedAt,
          customer: {
            id: customers.id,
            name: customers.name,
            email: customers.email
          }
        })
        .from(shipments)
        .leftJoin(salesOrders, eq(shipments.salesOrderId, salesOrders.id))
        .leftJoin(customers, eq(salesOrders.customerId, customers.id))
        .leftJoin(suppliers, eq(shipments.supplierId, suppliers.id))
        .where(eq(shipments.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error fetching shipment:', error);
      throw new Error('Failed to fetch shipment');
    }
  }

  async getShipmentByNumber(shipmentNumber: string): Promise<any> {
    try {
      const result = await db
        .select()
        .from(shipments)
        .where(eq(shipments.shipmentNumber, shipmentNumber))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error fetching shipment by number:', error);
      throw new Error('Failed to fetch shipment by number');
    }
  }

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<any> {
    try {
      const result = await db
        .select({
          id: shipments.id,
          shipmentNumber: shipments.shipmentNumber,
          trackingNumber: shipments.trackingNumber,
          salesOrderId: shipments.salesOrderId,
          salesOrderNumber: salesOrders.orderNumber,
          supplierId: shipments.supplierId,
          supplierName: suppliers.name,
          carrierId: shipments.carrierId,
          carrierName: shipments.carrierName,
          serviceType: shipments.serviceType,
          status: shipments.status,
          priority: shipments.priority,
          origin: shipments.origin,
          destination: shipments.destination,
          estimatedDelivery: shipments.estimatedDelivery,
          actualDelivery: shipments.actualDelivery,
          weight: shipments.weight,
          dimensions: shipments.dimensions,
          declaredValue: shipments.declaredValue,
          currency: shipments.currency,
          shippingCost: shipments.shippingCost,
          customerReference: shipments.customerReference,
          specialInstructions: shipments.specialInstructions,
          packageCount: shipments.packageCount,
          isInsured: shipments.isInsured,
          requiresSignature: shipments.requiresSignature,
          currentLocation: shipments.currentLocation,
          lastUpdate: shipments.lastUpdate,
          createdAt: shipments.createdAt,
          updatedAt: shipments.updatedAt,
          customer: {
            id: customers.id,
            name: customers.name,
            email: customers.email
          }
        })
        .from(shipments)
        .leftJoin(salesOrders, eq(shipments.salesOrderId, salesOrders.id))
        .leftJoin(customers, eq(salesOrders.customerId, customers.id))
        .leftJoin(suppliers, eq(shipments.supplierId, suppliers.id))
        .where(eq(shipments.trackingNumber, trackingNumber))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error fetching shipment by tracking number:', error);
      throw new Error('Failed to fetch shipment by tracking number');
    }
  }

  async createShipment(shipmentData: any): Promise<any> {
    try {
      // Generate shipment number if not provided
      if (!shipmentData.shipmentNumber) {
        shipmentData.shipmentNumber = this.generateNumber('SHP');
      }

      // Generate tracking number if not provided
      if (!shipmentData.trackingNumber) {
        shipmentData.trackingNumber = `TRK${Math.random().toString().substr(2, 9)}`;
      }

      const result = await db
        .insert(shipments)
        .values({
          ...shipmentData,
          lastUpdate: new Date(),
        })
        .returning();

      // Create initial tracking event
      await this.createTrackingEvent({
        shipmentId: result[0].id,
        timestamp: new Date(),
        location: shipmentData.origin || 'Origin',
        status: 'Shipment Created',
        description: 'Shipment has been created and is pending pickup',
        scanType: 'Pickup'
      });

      // Log audit event
      await this.logAuditEvent(
        'shipment',
        result[0].id,
        'created',
        shipmentData.createdBy,
        null,
        result[0]
      );

      return await this.getShipment(result[0].id);
    } catch (error) {
      console.error('Error creating shipment:', error);
      if (error instanceof Error && error.message) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async updateShipment(id: string, shipmentData: any): Promise<any> {
    try {
      const result = await db
        .update(shipments)
        .set({
          ...shipmentData,
          updatedAt: new Date(),
          lastUpdate: new Date(),
        })
        .where(eq(shipments.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error('Shipment not found');
      }

      await this.logAuditEvent(
        'shipment',
        id,
        'updated',
        shipmentData.updatedBy,
        null,
        result[0]
      );

      return await this.getShipment(id);
    } catch (error) {
      console.error('Error updating shipment:', error);
      throw new Error('Failed to update shipment');
    }
  }

  async deleteShipment(id: string): Promise<void> {
    try {
      // Delete tracking events first
      await db.delete(shipmentTrackingEvents).where(eq(shipmentTrackingEvents.shipmentId, id));
      
      // Delete shipment
      const result = await db.delete(shipments).where(eq(shipments.id, id)).returning();

      if (result.length === 0) {
        throw new Error('Shipment not found');
      }
      await this.logAuditEvent(
        'shipment',
        id,
        'deleted',
        undefined,
        null,
        null
      );
    } catch (error) {
      console.error('Error deleting shipment:', error);
      throw new Error('Failed to delete shipment');
    }
  }

  async updateShipmentStatus(id: string, status: string, location?: string): Promise<any> {
    try {
      const updateData: any = {
        status,
        lastUpdate: new Date(),
        updatedAt: new Date(),
      };

      if (location) {
        updateData.currentLocation = location;
      }

      // If status is Delivered, set actual delivery date
      if (status === 'Delivered') {
        updateData.actualDelivery = new Date();
      }

      const result = await db
        .update(shipments)
        .set(updateData)
        .where(eq(shipments.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error('Shipment not found');
      }

      // Create tracking event for status change
      await this.createTrackingEvent({
        shipmentId: id,
        timestamp: new Date(),
        location: location || result[0].currentLocation || 'Unknown',
        status: status,
        description: `Shipment status updated to ${status}`,
        scanType: this.getEventTypeFromStatus(status)
      });

      return await this.getShipment(id);
    } catch (error) {
      console.error('Error updating shipment status:', error);
      throw new Error('Failed to update shipment status');
    }
  }

  // Shipment tracking operations
  async getShipmentTrackingEvents(shipmentId: string): Promise<any[]> {
    try {
      const result = await db
        .select({
          id: shipmentTrackingEvents.id,
          shipmentId: shipmentTrackingEvents.shipmentId,
          timestamp: shipmentTrackingEvents.timestamp,
          location: shipmentTrackingEvents.location,
          status: shipmentTrackingEvents.status,
          description: shipmentTrackingEvents.description,
          scanType: shipmentTrackingEvents.scanType,
          latitude: shipmentTrackingEvents.latitude,
          longitude: shipmentTrackingEvents.longitude,
          facilityId: shipmentTrackingEvents.facilityId,
          nextExpectedLocation: shipmentTrackingEvents.nextExpectedLocation,
          estimatedArrival: shipmentTrackingEvents.estimatedArrival,
          createdAt: shipmentTrackingEvents.createdAt,
          employee: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName
          }
        })
        .from(shipmentTrackingEvents)
        .leftJoin(users, eq(shipmentTrackingEvents.employeeId, users.id))
        .where(eq(shipmentTrackingEvents.shipmentId, shipmentId))
        .orderBy(desc(shipmentTrackingEvents.timestamp));

      return result;
    } catch (error) {
      console.error('Error fetching tracking events:', error);
      throw new Error('Failed to fetch tracking events');
    }
  }

  async createTrackingEvent(eventData: any): Promise<any> {
    try {
      const result = await db
        .insert(shipmentTrackingEvents)
        .values({
          ...eventData,
          timestamp: eventData.timestamp || new Date(),
        })
        .returning();

      return result[0];
    } catch (error) {
      console.error('Error creating tracking event:', error);
      throw new Error('Failed to create tracking event');
    }
  }

  async getLatestTrackingEvent(shipmentId: string): Promise<any> {
    try {
      const result = await db
        .select()
        .from(shipmentTrackingEvents)
        .where(eq(shipmentTrackingEvents.shipmentId, shipmentId))
        .orderBy(desc(shipmentTrackingEvents.timestamp))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error fetching latest tracking event:', error);
      throw new Error('Failed to fetch latest tracking event');
    }
  }

  // Analytics and reporting
  async getShipmentAnalytics(): Promise<{
    totalShipments: number;
    pendingShipments: number;
    inTransitShipments: number;
    deliveredShipments: number;
    outForDeliveryShipments: number;
  }> {
    try {
      const results = await db
        .select({
          status: shipments.status,
          count: count()
        })
        .from(shipments)
        .groupBy(shipments.status);

      const analytics = {
        totalShipments: 0,
        pendingShipments: 0,
        inTransitShipments: 0,
        deliveredShipments: 0,
        outForDeliveryShipments: 0,
      };

      results.forEach(row => {
        analytics.totalShipments += row.count;
        
        switch (row.status) {
          case 'Pending':
            analytics.pendingShipments = row.count;
            break;
          case 'In Transit':
            analytics.inTransitShipments = row.count;
            break;
          case 'Delivered':
            analytics.deliveredShipments = row.count;
            break;
          case 'Out for Delivery':
            analytics.outForDeliveryShipments = row.count;
            break;
        }
      });

      return analytics;
    } catch (error) {
      console.error('Error fetching shipment analytics:', error);
      throw new Error('Failed to fetch shipment analytics');
    }
  }

  // Helper method to map status to event type
  private getEventTypeFromStatus(status: string): string {
    switch (status) {
      case 'Picked Up':
        return 'Pickup';
      case 'In Transit':
        return 'In Transit';
      case 'Out for Delivery':
        return 'Out for Delivery';
      case 'Delivered':
        return 'Delivered';
      case 'Delayed':
      case 'Lost':
      case 'Cancelled':
        return 'Exception';
      default:
        return 'In Transit';
    }
  }
}