import { IStorage } from './interfaces.js';
import { UserStorage } from './user-storage.js';
import { CustomerStorage } from './customer-storage.js';
import { SupplierStorage } from './supplier-storage.js';
import { ItemStorage } from './item-storage.js';
import { InventoryStorage } from './inventory-storage.js';
import { EnquiryStorage } from './enquiry-storage.js';
import { RequisitionStorage } from './requisition-storage.js';
import { AuditStorage } from './audit-storage.js';
import { QuotationStorage } from './quotation-storage.js';
import { DeliveryStorage } from './delivery-storage.js';
import { ShipmentStorage } from './shipment-storage.js';
import { SalesOrderStorage } from './sales-order-storage.js';
import { PurchaseOrderStorage } from './purchase-order-storage.js';
import { AcceptanceStorage } from './acceptance-storage.js';
import { GoodsReceiptStorage } from './goods-receipt-storage.js';
import { SupplierLpoStorage } from './supplier-lpo-storage.js';
import { InvoiceStorage } from './invoice-storage.js';
import { PhysicalStockStorage } from './physical-stock-storage.js';

// Import the existing DatabaseStorage as a fallback for operations
// not yet modularized
// Note: Temporarily commented out while we complete modularization
// import { DatabaseStorage } from "../storage.js";
import { BaseStorage } from './base.js';

// Comprehensive modular storage that delegates to specific modules
// This version implements all operations without fallback dependency
// Note: Temporarily not declaring implements IStorage to avoid compile errors
// while stub methods are being incrementally added. Once all interface methods
// are implemented, we can re-add `implements IStorage` for full type safety.
export class ModularStorage extends BaseStorage {
  // ...existing code...
  private userStorage: UserStorage;
  private customerStorage: CustomerStorage;
  private supplierStorage: SupplierStorage;
  private itemStorage: ItemStorage;
  private inventoryStorage: InventoryStorage;
  private enquiryStorage: EnquiryStorage;
  private requisitionStorage: RequisitionStorage;
  private auditStorage: AuditStorage;
  private quotationStorage: QuotationStorage;
  private deliveryStorage: DeliveryStorage;
  private shipmentStorage: ShipmentStorage;
  private salesOrderStorage: SalesOrderStorage;
  private purchaseOrderStorage: PurchaseOrderStorage;
  private acceptanceStorage: AcceptanceStorage;
  private goodsReceiptStorage: GoodsReceiptStorage;
  private supplierLpoStorage: SupplierLpoStorage;
  private invoiceStorage: InvoiceStorage;
  private physicalStockStorage: PhysicalStockStorage;

  constructor() {
    super();
    this.userStorage = new UserStorage();
    this.customerStorage = new CustomerStorage();
    this.supplierStorage = new SupplierStorage();
    this.itemStorage = new ItemStorage();
    this.inventoryStorage = new InventoryStorage();
    this.enquiryStorage = new EnquiryStorage();
    this.requisitionStorage = new RequisitionStorage();
    this.auditStorage = new AuditStorage();
    this.quotationStorage = new QuotationStorage();
    this.deliveryStorage = new DeliveryStorage();
    this.shipmentStorage = new ShipmentStorage();
    this.salesOrderStorage = new SalesOrderStorage();
    this.purchaseOrderStorage = new PurchaseOrderStorage();
    this.acceptanceStorage = new AcceptanceStorage();
    this.goodsReceiptStorage = new GoodsReceiptStorage();
  this.supplierLpoStorage = new SupplierLpoStorage();
    this.invoiceStorage = new InvoiceStorage();
    this.physicalStockStorage = new PhysicalStockStorage();

    // Create proxy to forward any missing methods with helpful error messages
    return new Proxy(this, {
      get(target: any, prop: string | symbol, receiver: any) {
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }
        // For unimplemented methods, return a function that throws a helpful error
        return () => {
          throw new Error(`Method '${String(prop)}' not yet implemented in modular storage. Please implement it in the appropriate storage module.`);
        };
      }
    });
  }

  // User operations - delegate to UserStorage
  async getUser(id: string) {
    return this.userStorage.getUser(id);
  }

  async createUser(user: Parameters<UserStorage['createUser']>[0]) {
    return this.userStorage.createUser(user);
  }

  // Customer operations - delegate to CustomerStorage
  async getCustomers(limit?: number, offset?: number, filters?: any) {
    return this.customerStorage.getCustomers(limit, offset, filters);
  }

  async getCustomer(id: string) {
    return this.customerStorage.getCustomer(id);
  }

  async getCustomersCount(filters?: any) {
    return this.customerStorage.getCustomersCount(filters);
  }

  async createCustomer(customer: Parameters<CustomerStorage['createCustomer']>[0]) {
    return this.customerStorage.createCustomer(customer);
  }

  async updateCustomer(id: string, customer: Parameters<CustomerStorage['updateCustomer']>[1]) {
    return this.customerStorage.updateCustomer(id, customer);
  }

  async getCustomerDetails(id: string) {
    return this.customerStorage.getCustomerDetails(id);
  }

  async getCustomerTransactionSummary(customerId: string) {
    return this.customerStorage.getCustomerTransactionSummary(customerId);
  }

  async getCustomerRecentActivities(customerId: string, limit?: number) {
    return this.customerStorage.getCustomerRecentActivities(customerId, limit);
  }

  async getCustomerPerformanceMetrics(customerId: string) {
    return this.customerStorage.getCustomerPerformanceMetrics(customerId);
  }

  // Supplier operations - delegate to SupplierStorage
  async getSuppliers() {
    return this.supplierStorage.getSuppliers();
  }

  async getSupplier(id: string) {
    return this.supplierStorage.getSupplier(id);
  }

  async createSupplier(supplier: Parameters<SupplierStorage['createSupplier']>[0]) {
    return this.supplierStorage.createSupplier(supplier);
  }

  async updateSupplier(id: string, supplier: Parameters<SupplierStorage['updateSupplier']>[1]) {
    return this.supplierStorage.updateSupplier(id, supplier);
  }

  async deleteSupplier(id: string) {
    return this.supplierStorage.deleteSupplier(id);
  }

  // Enhanced supplier detail methods
  async getSupplierDetails(id: string) {
    return this.supplierStorage.getSupplierDetails(id);
  }

  async getSupplierLposForDetail(supplierId: string, page?: number, limit?: number) {
    return this.supplierStorage.getSupplierLposForDetail(supplierId, page, limit);
  }

  async getSupplierItems(supplierId: string, page?: number, limit?: number) {
    return this.supplierStorage.getSupplierItems(supplierId, page, limit);
  }

  async getSupplierGoodsReceipts(supplierId: string, page?: number, limit?: number) {
    return this.supplierStorage.getSupplierGoodsReceipts(supplierId, page, limit);
  }

  async getSupplierPerformanceMetrics(supplierId: string) {
    return this.supplierStorage.getSupplierPerformanceMetrics(supplierId);
  }

  // Item operations - delegate to ItemStorage
  async getItems() {
    return this.itemStorage.getItems();
  }

  async getItem(id: string) {
    return this.itemStorage.getItem(id);
  }

  async getItemByBarcode(barcode: string) {
    return this.itemStorage.getItemByBarcode(barcode);
  }

  async createItem(item: Parameters<ItemStorage['createItem']>[0]) {
    return this.itemStorage.createItem(item);
  }

  // Enquiry operations - delegate to EnquiryStorage
  async getEnquiries(limit?: number, offset?: number, filters?: Parameters<EnquiryStorage['getEnquiries']>[2]) {
    return this.enquiryStorage.getEnquiries(limit, offset, filters);
  }

  async getEnquiry(id: string) {
    return this.enquiryStorage.getEnquiry(id);
  }

  async createEnquiry(enquiry: Parameters<EnquiryStorage['createEnquiry']>[0]) {
    return this.enquiryStorage.createEnquiry(enquiry);
  }

  async updateEnquiry(id: string, enquiry: Parameters<EnquiryStorage['updateEnquiry']>[1]) {
    return this.enquiryStorage.updateEnquiry(id, enquiry);
  }

  async deleteEnquiry(id: string) {
    return this.enquiryStorage.deleteEnquiry(id);
  }

  async getEnquiryItems(enquiryId: string) {
    return this.enquiryStorage.getEnquiryItems(enquiryId);
  }

  async getEnquiryItem(id: string) {
    return this.enquiryStorage.getEnquiryItem(id);
  }

  async createEnquiryItem(enquiryItem: Parameters<EnquiryStorage['createEnquiryItem']>[0]) {
    return this.enquiryStorage.createEnquiryItem(enquiryItem);
  }

  async updateEnquiryItem(id: string, enquiryItem: Parameters<EnquiryStorage['updateEnquiryItem']>[1]) {
    return this.enquiryStorage.updateEnquiryItem(id, enquiryItem);
  }

  async deleteEnquiryItem(id: string) {
    return this.enquiryStorage.deleteEnquiryItem(id);
  }

  // Requisition operations - delegate to RequisitionStorage
  async getRequisitions(limit?: number, offset?: number, filters?: Parameters<RequisitionStorage['getRequisitions']>[2]) {
    return this.requisitionStorage.getRequisitions(limit, offset, filters);
  }

  async getRequisition(id: string) {
    return this.requisitionStorage.getRequisition(id);
  }

  async getRequisitionByNumber(requisitionNumber: string) {
    return this.requisitionStorage.getRequisitionByNumber(requisitionNumber);
  }

  async createRequisition(requisition: Parameters<RequisitionStorage['createRequisition']>[0]) {
    return this.requisitionStorage.createRequisition(requisition);
  }

  async updateRequisition(id: string, requisition: Parameters<RequisitionStorage['updateRequisition']>[1]) {
    return this.requisitionStorage.updateRequisition(id, requisition);
  }

  async deleteRequisition(id: string) {
    return this.requisitionStorage.deleteRequisition(id);
  }

  async getRequisitionItems(requisitionId: string) {
    return this.requisitionStorage.getRequisitionItems(requisitionId);
  }

  async createRequisitionItem(requisitionItem: Parameters<RequisitionStorage['createRequisitionItem']>[0]) {
    return this.requisitionStorage.createRequisitionItem(requisitionItem);
  }

  async updateRequisitionItem(id: string, requisitionItem: Parameters<RequisitionStorage['updateRequisitionItem']>[1]) {
    return this.requisitionStorage.updateRequisitionItem(id, requisitionItem);
  }

  async deleteRequisitionItem(id: string) {
    return this.requisitionStorage.deleteRequisitionItem(id);
  }

  async searchRequisitions(searchTerm: string) {
    return this.requisitionStorage.searchRequisitions(searchTerm);
  }

  async getRequisitionsCount(filters?: any) {
    return this.requisitionStorage.getRequisitionsCount(filters);
  }

  // Customer Acceptance operations - delegate to AcceptanceStorage
  async getCustomerAcceptances(quotationId?: string) {
    return this.acceptanceStorage.getCustomerAcceptances(quotationId);
  }

  async getCustomerAcceptance(id: string) {
    return this.acceptanceStorage.getCustomerAcceptance(id);
  }

  async createCustomerAcceptance(acceptance: Parameters<AcceptanceStorage['createCustomerAcceptance']>[0]) {
    return this.acceptanceStorage.createCustomerAcceptance(acceptance);
  }

  async updateCustomerAcceptance(id: string, acceptance: Parameters<AcceptanceStorage['updateCustomerAcceptance']>[1]) {
    return this.acceptanceStorage.updateCustomerAcceptance(id, acceptance);
  }

  async deleteCustomerAcceptance(id: string) {
    return this.acceptanceStorage.deleteCustomerAcceptance(id);
  }

  async supersedeActiveAcceptances(quotationId: string) {
    return this.acceptanceStorage.supersedeActiveAcceptances(quotationId);
  }

  // Quotation Item Acceptance operations
  async getQuotationItemAcceptances(customerAcceptanceId: string) {
    return this.acceptanceStorage.getQuotationItemAcceptances(customerAcceptanceId);
  }

  async getQuotationItemAcceptance(id: string) {
    return this.acceptanceStorage.getQuotationItemAcceptance(id);
  }

  async createQuotationItemAcceptance(itemAcceptance: Parameters<AcceptanceStorage['createQuotationItemAcceptance']>[0]) {
    return this.acceptanceStorage.createQuotationItemAcceptance(itemAcceptance);
  }

  async updateQuotationItemAcceptance(id: string, itemAcceptance: Parameters<AcceptanceStorage['updateQuotationItemAcceptance']>[1]) {
    return this.acceptanceStorage.updateQuotationItemAcceptance(id, itemAcceptance);
  }

  async bulkCreateQuotationItemAcceptances(itemAcceptances: Parameters<AcceptanceStorage['bulkCreateQuotationItemAcceptances']>[0]) {
    return this.acceptanceStorage.bulkCreateQuotationItemAcceptances(itemAcceptances);
  }

  // Acceptance Confirmations
  async getAcceptanceConfirmations(customerAcceptanceId: string) {
    return this.acceptanceStorage.getAcceptanceConfirmations(customerAcceptanceId);
  }

  async createAcceptanceConfirmation(confirmation: Parameters<AcceptanceStorage['createAcceptanceConfirmation']>[0]) {
    return this.acceptanceStorage.createAcceptanceConfirmation(confirmation);
  }

  async bulkCreateEnquiryItems(enquiryItems: Parameters<EnquiryStorage['bulkCreateEnquiryItems']>[0]) {
    return this.enquiryStorage.bulkCreateEnquiryItems(enquiryItems);
  }

  // Quotation operations - delegate to QuotationStorage
  async getQuotations(limit?: number, offset?: number, filters?: Parameters<QuotationStorage['getQuotations']>[2]) {
    return this.quotationStorage.getQuotations(limit, offset, filters);
  }

  async getQuotation(id: string) {
    return this.quotationStorage.getQuotation(id);
  }

  async createQuotation(quotation: Parameters<QuotationStorage['createQuotation']>[0]) {
    return this.quotationStorage.createQuotation(quotation);
  }

  async updateQuotation(id: string, quotation: Parameters<QuotationStorage['updateQuotation']>[1]) {
    return this.quotationStorage.updateQuotation(id, quotation);
  }

  async deleteQuotation(id: string) {
    return this.quotationStorage.deleteQuotation(id);
  }

  async generateQuotationFromEnquiry(enquiryId: string, userId: string) {
    return this.quotationStorage.generateQuotationFromEnquiry(enquiryId, userId);
  }

  async createQuotationRevision(originalId: string, revisionData: any, userId: string) {
    return this.quotationStorage.createQuotationRevision(originalId, revisionData, userId);
  }

  async getQuotationRevisions(originalId: string) {
    return this.quotationStorage.getQuotationRevisions(originalId);
  }

  async getQuotationHistory(quotationId: string) {
    return this.quotationStorage.getQuotationHistory(quotationId);
  }

  async getQuotationItems(quotationId: string) {
    return this.quotationStorage.getQuotationItems(quotationId);
  }

  async createQuotationItem(item: Parameters<QuotationStorage['createQuotationItem']>[0]) {
    return this.quotationStorage.createQuotationItem(item);
  }

  async updateQuotationItem(id: string, item: Parameters<QuotationStorage['updateQuotationItem']>[1]) {
    return this.quotationStorage.updateQuotationItem(id, item);
  }

  async deleteQuotationItem(id: string) {
    return this.quotationStorage.deleteQuotationItem(id);
  }

  async getQuotationApprovals(quotationId: string) {
    return this.quotationStorage.getQuotationApprovals(quotationId);
  }

  async createQuotationApproval(approval: Parameters<QuotationStorage['createQuotationApproval']>[0]) {
    return this.quotationStorage.createQuotationApproval(approval);
  }

  // Audit operations - delegate to AuditStorage  
  async logAuditEvent(
    entityType: string,
    entityId: string,
    action: string,
    userId?: string,
    oldData?: any,
    newData?: any
  ) {
    return this.auditStorage.logAuditEvent(entityType, entityId, action, userId, oldData, newData);
  }

  // Sales Order operations - delegate to SalesOrderStorage
  async getSalesOrders(limit?: number, offset?: number, filters?: any) {
    return this.salesOrderStorage.getSalesOrders(limit, offset, filters);
  }

  async getSalesOrder(id: string) {
    return this.salesOrderStorage.getSalesOrder(id);
  }

  async createSalesOrder(salesOrder: any) {
    return this.salesOrderStorage.createSalesOrder(salesOrder);
  }

  async updateSalesOrder(id: string, salesOrder: any) {
    return this.salesOrderStorage.updateSalesOrder(id, salesOrder);
  }

  async deleteSalesOrder(id: string) {
    return this.salesOrderStorage.deleteSalesOrder(id);
  }

  async createSalesOrderFromQuotation(quotationId: string, userId?: string) {
    return this.salesOrderStorage.createSalesOrderFromQuotation(quotationId, userId);
  }

  async createAmendedSalesOrder(parentOrderId: string, reason: string, userId?: string) {
    return this.salesOrderStorage.createAmendedSalesOrder(parentOrderId, reason, userId);
  }

  async validateCustomerLpo(id: string, validationData: any) {
    return this.salesOrderStorage.validateCustomerLpo(id, validationData);
  }

  // Sales Order Item operations
  async getSalesOrderItems(salesOrderId: string) {
    return this.salesOrderStorage.getSalesOrderItems(salesOrderId);
  }

  async getSalesOrderItem(id: string) {
    return this.salesOrderStorage.getSalesOrderItem(id);
  }

  async createSalesOrderItem(item: any) {
    return this.salesOrderStorage.createSalesOrderItem(item);
  }

  async updateSalesOrderItem(id: string, item: any) {
    return this.salesOrderStorage.updateSalesOrderItem(id, item);
  }

  async deleteSalesOrderItem(id: string) {
    return this.salesOrderStorage.deleteSalesOrderItem(id);
  }

  async bulkCreateSalesOrderItems(items: any[]) {
    return this.salesOrderStorage.bulkCreateSalesOrderItems(items);
  }

  async getApprovalRules() {
    console.warn('getApprovalRules: Using stub implementation - should be moved to ApprovalStorage');
    return [];
  }

  async createApprovalRule(rule: any) {
    console.warn('createApprovalRule: Using stub implementation - should be moved to ApprovalStorage');
    return { id: 'rule-' + Date.now(), ...rule };
  }

  async updateApprovalRule(id: string, rule: any) {
    console.warn('updateApprovalRule: Using stub implementation - should be moved to ApprovalStorage');
    return { id, ...rule };
  }

  async deleteApprovalRule(id: string) {
    console.warn('deleteApprovalRule: Using stub implementation - should be moved to ApprovalStorage');
  }

  async determineRequiredApprovalLevel(quotation: any) {
    console.warn('determineRequiredApprovalLevel: Using stub implementation - should be moved to ApprovalStorage');
    return null;
  }


  // Supplier LPO operations
  async getSupplierLpos(limit?: number, offset?: number, filters?: any) {
    return this.supplierLpoStorage.getSupplierLpos(limit, offset, filters);
  }
  async getSupplierLposCount(filters?: any) {
    return this.supplierLpoStorage.getSupplierLposCount(filters);
  }
  async getSupplierLpo(id: string) { return this.supplierLpoStorage.getSupplierLpo(id); }
  async createSupplierLpo(lpo: any) { return this.supplierLpoStorage.createSupplierLpo(lpo); }
  async updateSupplierLpo(id: string, lpo: any) { return this.supplierLpoStorage.updateSupplierLpo(id, lpo); }
  async deleteSupplierLpo(id: string) { return this.supplierLpoStorage.deleteSupplierLpo(id); }
  async createSupplierLposFromSalesOrders(salesOrderIds: string[], groupBy: string, userId?: string, supplierIdOverride?: string) { return this.supplierLpoStorage.createSupplierLposFromSalesOrders(salesOrderIds, groupBy, userId, supplierIdOverride); }
  async createAmendedSupplierLpo(parentLpoId: string, reason: string, amendmentType: string, userId?: string) { return this.supplierLpoStorage.createAmendedSupplierLpo(parentLpoId, reason, amendmentType, userId); }
  async submitForApproval(id: string, userId: string) { return this.supplierLpoStorage.submitForApproval(id, userId); }
  async approveSupplierLpo(id: string, userId: string, notes?: string) { return this.supplierLpoStorage.approveSupplierLpo(id, userId, notes); }
  async rejectSupplierLpo(id: string, userId: string, notes: string) { return this.supplierLpoStorage.rejectSupplierLpo(id, userId, notes); }
  async sendToSupplier(id: string, userId: string) { return this.supplierLpoStorage.sendToSupplier(id, userId); }
  async confirmBySupplier(id: string, confirmationReference?: string) { return this.supplierLpoStorage.confirmBySupplier(id, confirmationReference); }
  async updateExpectedDeliveryDate(id: string, expectedDeliveryDate: string, userId?: string) { return this.supplierLpoStorage.updateExpectedDeliveryDate(id, expectedDeliveryDate, userId); }
  async getSupplierLpoBacklog() { return this.supplierLpoStorage.getSupplierLpoBacklog(); }
  async getCustomerOrderBacklog() { return this.supplierLpoStorage.getCustomerOrderBacklog(); }
  async getSupplierLpoItems(lpoId: string) { return this.supplierLpoStorage.getSupplierLpoItems(lpoId); }
  async getSupplierLpoItem(id: string) { return this.supplierLpoStorage.getSupplierLpoItem(id); }
  async createSupplierLpoItem(item: any) { return this.supplierLpoStorage.createSupplierLpoItem(item); }
  async updateSupplierLpoItem(id: string, item: any) { return this.supplierLpoStorage.updateSupplierLpoItem(id, item); }
  async deleteSupplierLpoItem(id: string) { return this.supplierLpoStorage.deleteSupplierLpoItem(id); }
  async bulkCreateSupplierLpoItems(items: any[]) { return this.supplierLpoStorage.bulkCreateSupplierLpoItems(items); }

  async getPurchaseOrders(quotationId?: string) {
    return this.purchaseOrderStorage.getPurchaseOrders(50, 0, quotationId ? { quotationId } : {});
  }

  async getPurchaseOrder(id: string) {
    return this.purchaseOrderStorage.getPurchaseOrder(id);
  }

  async createPurchaseOrder(po: any) {
    return this.purchaseOrderStorage.createPurchaseOrder(po);
  }

  async updatePurchaseOrder(id: string, po: any) {
    return this.purchaseOrderStorage.updatePurchaseOrder(id, po);
  }

  async deletePurchaseOrder(id: string) {
    return this.purchaseOrderStorage.deletePurchaseOrder(id);
  }

  async validatePurchaseOrder(id: string, validation: any) {
    return this.purchaseOrderStorage.validatePurchaseOrder(id, validation);
  }

  async getPoLineItems(purchaseOrderId: string) {
    return this.purchaseOrderStorage.getPoLineItems(purchaseOrderId);
  }

  async createPoLineItem(lineItem: any) {
    return this.purchaseOrderStorage.createPoLineItem(lineItem);
  }

  async updatePoLineItem(id: string, lineItem: any) {
    return this.purchaseOrderStorage.updatePoLineItem(id, lineItem);
  }

  async bulkCreatePoLineItems(lineItems: any[]) {
    return this.purchaseOrderStorage.bulkCreatePoLineItems(lineItems);
  }

  async getInventoryItems(filters?: any) {
    return this.inventoryStorage.getInventoryItems(filters);
  }

  async getInventoryItem(id: string) {
    return this.inventoryStorage.getInventoryItem(id);
  }

  async getInventoryItemBySupplierCode(supplierCode: string) {
    return this.inventoryStorage.getInventoryItemBySupplierCode(supplierCode);
  }

  async getInventoryItemByBarcode(barcode: string) {
    return this.inventoryStorage.getInventoryItemByBarcode(barcode);
  }

  async createInventoryItem(itemData: any) {
    return this.inventoryStorage.createInventoryItem(itemData);
  }

  async updateInventoryItem(id: string, itemData: any) {
    return this.inventoryStorage.updateInventoryItem(id, itemData);
  }

  async deleteInventoryItem(id: string) {
    return this.inventoryStorage.deleteInventoryItem(id);
  }

  async getGoodsReceiptHeaders(filters?: any) {
    return this.goodsReceiptStorage.getGoodsReceiptHeaders?.(filters) ?? [];
  }

  async createGoodsReceiptHeader(receipt: any) {
    return this.goodsReceiptStorage.createGoodsReceiptHeader(receipt);
  }

  async createGoodsReceiptItem(item: any) {
    return this.goodsReceiptStorage.createGoodsReceiptItem(item);
  }

  // Delivery Storage Methods
  async getDeliveries(filters?: any) {
    return this.deliveryStorage.getDeliveries(filters);
  }

  async getDelivery(id: string) {
    return this.deliveryStorage.getDelivery(id);
  }

  async getDeliveryByNumber(deliveryNumber: string) {
    return this.deliveryStorage.getDeliveryByNumber(deliveryNumber);
  }

  async createDelivery(delivery: any) {
    return this.deliveryStorage.createDelivery(delivery);
  }

  async updateDelivery(id: string, delivery: any) {
    return this.deliveryStorage.updateDelivery(id, delivery);
  }

  async deleteDelivery(id: string) {
    return this.deliveryStorage.deleteDelivery(id);
  }

  async startDeliveryPicking(deliveryId: string, userId: string) {
    return this.deliveryStorage.startDeliveryPicking(deliveryId, userId);
  }

  async completeDeliveryPicking(deliveryId: string, userId: string, notes?: string) {
    return this.deliveryStorage.completeDeliveryPicking(deliveryId, userId, notes);
  }

  async confirmDelivery(deliveryId: string, confirmedBy: string, signature?: string) {
    return this.deliveryStorage.confirmDelivery(deliveryId, confirmedBy, signature);
  }

  // Delivery Item operations
  async getDeliveryItems(deliveryId: string) {
    return this.deliveryStorage.getDeliveryItems(deliveryId);
  }

  async getDeliveryItem(id: string) {
    return this.deliveryStorage.getDeliveryItem(id);
  }

  async createDeliveryItem(item: any) {
    return this.deliveryStorage.createDeliveryItem(item);
  }

  async updateDeliveryItem(id: string, item: any) {
    return this.deliveryStorage.updateDeliveryItem(id, item);
  }

  async deleteDeliveryItem(id: string) {
    return this.deliveryStorage.deleteDeliveryItem(id);
  }

  async bulkCreateDeliveryItems(items: any[]) {
    return this.deliveryStorage.bulkCreateDeliveryItems(items);
  }

  // Delivery Picking Session operations
  async getDeliveryPickingSessions(deliveryId: string) {
    return this.deliveryStorage.getDeliveryPickingSessions(deliveryId);
  }

  async getDeliveryPickingSession(id: string) {
    return this.deliveryStorage.getDeliveryPickingSession(id);
  }

  async createDeliveryPickingSession(session: any) {
    return this.deliveryStorage.createDeliveryPickingSession(session);
  }

  async updateDeliveryPickingSession(id: string, session: any) {
    return this.deliveryStorage.updateDeliveryPickingSession(id, session);
  }

  async completePickingSession(sessionId: string) {
    return this.deliveryStorage.completePickingSession(sessionId);
  }

  // Delivery Picked Item operations
  async getDeliveryPickedItems(sessionId: string) {
    return this.deliveryStorage.getDeliveryPickedItems(sessionId);
  }

  async getDeliveryPickedItem(id: string) {
    return this.deliveryStorage.getDeliveryPickedItem(id);
  }

  async createDeliveryPickedItem(item: any) {
    return this.deliveryStorage.createDeliveryPickedItem(item);
  }

  async updateDeliveryPickedItem(id: string, item: any) {
    return this.deliveryStorage.updateDeliveryPickedItem(id, item);
  }

  async verifyPickedItem(itemId: string, userId: string) {
    return this.deliveryStorage.verifyPickedItem(itemId, userId);
  }

  // Shipment operations - delegate to ShipmentStorage
  async getShipments(filters?: any) {
    return this.shipmentStorage.getShipments(filters);
  }

  async getShipment(id: string) {
    return this.shipmentStorage.getShipment(id);
  }

  async getShipmentByNumber(shipmentNumber: string) {
    return this.shipmentStorage.getShipmentByNumber(shipmentNumber);
  }

  async getShipmentByTrackingNumber(trackingNumber: string) {
    return this.shipmentStorage.getShipmentByTrackingNumber(trackingNumber);
  }

  async createShipment(shipment: any) {
    return this.shipmentStorage.createShipment(shipment);
  }

  async updateShipment(id: string, shipment: any) {
    return this.shipmentStorage.updateShipment(id, shipment);
  }

  async deleteShipment(id: string) {
    return this.shipmentStorage.deleteShipment(id);
  }

  async updateShipmentStatus(id: string, status: string, location?: string) {
    return this.shipmentStorage.updateShipmentStatus(id, status, location);
  }

  async getShipmentTrackingEvents(shipmentId: string) {
    return this.shipmentStorage.getShipmentTrackingEvents(shipmentId);
  }

  async createTrackingEvent(event: any) {
    return this.shipmentStorage.createTrackingEvent(event);
  }

  async getLatestTrackingEvent(shipmentId: string) {
    return this.shipmentStorage.getLatestTrackingEvent(shipmentId);
  }

  async getShipmentAnalytics() {
    return this.shipmentStorage.getShipmentAnalytics();
  }

  // Workflow analytics
  async getWorkflowAnalytics(period: string = '30d') {
    try {
      // Calculate date range based on period
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get basic workflow statistics
      const totalWorkflows = 12; // Based on WORKFLOW_STEPS length
      const completedWorkflows = Math.floor(Math.random() * 8) + 2; // Mock data
      const inProgressWorkflows = Math.floor(Math.random() * 4) + 1;
      const blockedWorkflows = Math.floor(Math.random() * 2);
      const cancelledWorkflows = Math.floor(Math.random() * 2);

      // Calculate derived metrics
      const averageCompletionTime = Math.floor(Math.random() * 10) + 5; // 5-15 days
      const efficiency = Math.floor(Math.random() * 30) + 70; // 70-100%
      const totalValue = Math.floor(Math.random() * 100000) + 50000; // $50k-$150k

      // Generate monthly trends
      const monthlyTrends = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getTime() - i * 30 * 24 * 60 * 60 * 1000);
        monthlyTrends.push({
          month: monthDate.toISOString().substring(0, 7),
          completed: Math.floor(Math.random() * 10) + 5,
          inProgress: Math.floor(Math.random() * 5) + 2,
          blocked: Math.floor(Math.random() * 3),
          cancelled: Math.floor(Math.random() * 2)
        });
      }

      // Generate step breakdown
      const stepBreakdown = {
        'Customer': Math.floor(Math.random() * 20) + 80,
        'Enquiry': Math.floor(Math.random() * 20) + 70,
        'Quotation': Math.floor(Math.random() * 20) + 50,
        'Acceptance': Math.floor(Math.random() * 20) + 40,
        'Customer PO Upload': Math.floor(Math.random() * 20) + 35,
        'Sales Order': Math.floor(Math.random() * 20) + 30,
        'Supplier LPO': Math.floor(Math.random() * 20) + 25,
        'Goods Receipt': Math.floor(Math.random() * 20) + 20,
        'Inventory': Math.floor(Math.random() * 20) + 15,
        'Delivery Note': Math.floor(Math.random() * 20) + 10,
        'Invoice': Math.floor(Math.random() * 20) + 5
      };

      // Generate priority distribution
      const priorityDistribution = {
        'Low': Math.floor(Math.random() * 20) + 10,
        'Medium': Math.floor(Math.random() * 30) + 40,
        'High': Math.floor(Math.random() * 20) + 20,
        'Urgent': Math.floor(Math.random() * 10) + 5
      };

      // Generate team performance
      const teamPerformance = [
        {
          userId: 'user1',
          userName: 'John Doe',
          completedWorkflows: Math.floor(Math.random() * 20) + 10,
          averageTime: Math.floor(Math.random() * 5) + 8,
          efficiency: Math.floor(Math.random() * 20) + 80
        },
        {
          userId: 'user2',
          userName: 'Jane Smith',
          completedWorkflows: Math.floor(Math.random() * 25) + 15,
          averageTime: Math.floor(Math.random() * 4) + 6,
          efficiency: Math.floor(Math.random() * 15) + 85
        },
        {
          userId: 'user3',
          userName: 'Mike Johnson',
          completedWorkflows: Math.floor(Math.random() * 15) + 8,
          averageTime: Math.floor(Math.random() * 6) + 10,
          efficiency: Math.floor(Math.random() * 25) + 75
        }
      ];

      // Enhanced analytics for better flow implementation
      const stepAnalytics = [
        { stepId: 1, stepName: 'Customer', averageDuration: 1, completionRate: 95, bottleneckScore: 0.1, commonBlockers: [], efficiency: 95, successRate: 98 },
        { stepId: 2, stepName: 'Enquiry', averageDuration: 2, completionRate: 90, bottleneckScore: 0.2, commonBlockers: ['Incomplete requirements'], efficiency: 88, successRate: 92 },
        { stepId: 4, stepName: 'Quotation', averageDuration: 1, completionRate: 85, bottleneckScore: 0.3, commonBlockers: ['Pricing accuracy'], efficiency: 82, successRate: 90 },
        { stepId: 5, stepName: 'Acceptance', averageDuration: 3, completionRate: 80, bottleneckScore: 0.6, commonBlockers: ['Customer approval'], efficiency: 75, successRate: 88 },
        { stepId: 6, stepName: 'Customer PO Upload', averageDuration: 1, completionRate: 85, bottleneckScore: 0.2, commonBlockers: ['Document format'], efficiency: 80, successRate: 92 },
        { stepId: 7, stepName: 'Sales Order', averageDuration: 1, completionRate: 90, bottleneckScore: 0.1, commonBlockers: [], efficiency: 88, successRate: 95 },
        { stepId: 8, stepName: 'Supplier LPO', averageDuration: 1, completionRate: 88, bottleneckScore: 0.2, commonBlockers: ['Supplier availability'], efficiency: 85, successRate: 90 },
        { stepId: 9, stepName: 'Goods Receipt', averageDuration: 2, completionRate: 82, bottleneckScore: 0.4, commonBlockers: ['Delivery delays', 'Quality issues'], efficiency: 78, successRate: 85 },
        { stepId: 10, stepName: 'Inventory', averageDuration: 1, completionRate: 90, bottleneckScore: 0.1, commonBlockers: [], efficiency: 88, successRate: 95 },
        { stepId: 11, stepName: 'Delivery Note', averageDuration: 1, completionRate: 85, bottleneckScore: 0.3, commonBlockers: ['Logistics coordination'], efficiency: 82, successRate: 88 },
        { stepId: 12, stepName: 'Invoice', averageDuration: 1, completionRate: 88, bottleneckScore: 0.2, commonBlockers: ['Payment terms'], efficiency: 85, successRate: 92 }
      ];

      const performanceMetrics = {
        onTimeDelivery: Math.floor(Math.random() * 20) + 75, // 75-95%
        averageDelay: Math.floor(Math.random() * 3) + 1, // 1-4 days
        reworkRate: Math.floor(Math.random() * 10) + 5, // 5-15%
        qualityScore: Math.floor(Math.random() * 15) + 80, // 80-95%
        customerSatisfaction: Math.floor(Math.random() * 20) + 75, // 75-95%
        costEfficiency: Math.floor(Math.random() * 25) + 70 // 70-95%
      };

      const riskAnalysis = {
        highRiskWorkflows: Math.floor(Math.random() * 5) + 2,
        mediumRiskWorkflows: Math.floor(Math.random() * 8) + 5,
        lowRiskWorkflows: Math.floor(Math.random() * 10) + 15,
        commonRiskFactors: ['Supplier delays', 'Quality issues', 'Customer changes', 'Resource constraints'],
        escalationRate: Math.floor(Math.random() * 15) + 5 // 5-20%
      };

      const complianceMetrics = {
        auditCompliance: Math.floor(Math.random() * 10) + 90, // 90-100%
        documentationCompleteness: Math.floor(Math.random() * 15) + 80, // 80-95%
        approvalCycleTime: Math.floor(Math.random() * 3) + 2, // 2-5 days
        regulatoryAdherence: Math.floor(Math.random() * 10) + 85 // 85-95%
      };

      const resourceUtilization = {
        departmentUtilization: {
          'Sales': Math.floor(Math.random() * 20) + 70,
          'Procurement': Math.floor(Math.random() * 25) + 65,
          'Warehouse': Math.floor(Math.random() * 30) + 60,
          'Logistics': Math.floor(Math.random() * 20) + 75
        },
        workloadDistribution: {
          'High': Math.floor(Math.random() * 10) + 5,
          'Medium': Math.floor(Math.random() * 20) + 40,
          'Low': Math.floor(Math.random() * 15) + 30
        },
        capacityPlanning: {
          currentCapacity: 100,
          projectedDemand: Math.floor(Math.random() * 20) + 80,
          capacityGap: Math.floor(Math.random() * 10) - 5
        }
      };

      const predictiveAnalytics = {
        forecastedCompletion: [
          { date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), expectedCompletions: Math.floor(Math.random() * 5) + 3, confidence: 85 },
          { date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), expectedCompletions: Math.floor(Math.random() * 8) + 5, confidence: 75 },
          { date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), expectedCompletions: Math.floor(Math.random() * 15) + 10, confidence: 65 }
        ],
        trendAnalysis: {
          direction: Math.random() > 0.5 ? 'up' : 'down',
          changeRate: Math.floor(Math.random() * 20) + 5, // 5-25%
          seasonality: Math.random() > 0.7
        }
      };

      return {
        totalWorkflows,
        completedWorkflows,
        inProgressWorkflows,
        blockedWorkflows,
        cancelledWorkflows,
        averageCompletionTime,
        efficiency,
        totalValue,
        monthlyTrends,
        stepBreakdown,
        priorityDistribution,
        teamPerformance,
        stepAnalytics,
        performanceMetrics,
        riskAnalysis,
        complianceMetrics,
        resourceUtilization,
        predictiveAnalytics
      };
    } catch (error) {
      console.error('Error fetching workflow analytics:', error);
      throw new Error('Failed to fetch workflow analytics');
    }
  }

  // Barcode scanning and verification
  async verifyItemBarcode(barcode: string, expectedItemId?: string) {
    return this.deliveryStorage.verifyItemBarcode(barcode, expectedItemId);
  }

  async scanItemForPicking(barcode: string, sessionId: string, quantity: number, userId: string, storageLocation?: string) {
    return this.deliveryStorage.scanItemForPicking(barcode, sessionId, quantity, userId, storageLocation);
  }

  async getAvailableItemsForPicking(deliveryId: string) {
    return this.deliveryStorage.getAvailableItemsForPicking(deliveryId);
  }

  async getInvoices(...args: any[]) {
    return this.invoiceStorage.getInvoices(args[0]);
  }

  async getInvoice(id: string) {
    return this.invoiceStorage.getInvoice(id);
  }

  async getInvoiceByNumber(invoiceNumber: string) {
    return this.invoiceStorage.getInvoiceByNumber(invoiceNumber);
  }

  async createInvoice(invoice: any) {
    return this.invoiceStorage.createInvoice(invoice);
  }

  async updateInvoice(id: string, invoice: any) {
    return this.invoiceStorage.updateInvoice(id, invoice);
  }

  async deleteInvoice(id: string) {
    return this.invoiceStorage.deleteInvoice(id);
  }

  async generateInvoiceFromDelivery(deliveryId: string, invoiceType?: string, userId?: string) {
    return this.invoiceStorage.generateInvoiceFromDelivery(deliveryId, invoiceType, userId);
  }

  async generateProformaInvoice(salesOrderId: string, userId?: string) {
    return this.invoiceStorage.generateProformaInvoice(salesOrderId, userId);
  }

  async sendInvoice(invoiceId: string, userId: string) {
    return this.invoiceStorage.sendInvoice(invoiceId, userId);
  }

  async getInvoiceItems(invoiceId: string) {
    return this.invoiceStorage.getInvoiceItems(invoiceId);
  }

  async createInvoiceItem(data: any) {
    return this.invoiceStorage.createInvoiceItem(data);
  }

  async updateInvoiceItem(id: string, data: any) {
    return this.invoiceStorage.updateInvoiceItem(id, data);
  }

  async deleteInvoiceItem(id: string) {
    return this.invoiceStorage.deleteInvoiceItem(id);
  }

  async markInvoicePaid(invoiceId: string, paidAmount: number, paymentMethod?: string, paymentReference?: string, userId?: string) {
    return this.invoiceStorage.markInvoicePaid(invoiceId, paidAmount, paymentMethod, paymentReference, userId);
  }


  async bulkCreateInvoiceItems(items: any[]) {
    return this.invoiceStorage.bulkCreateInvoiceItems(items as any);
  }

  async updateInvoiceCurrency(invoiceId: string, newCurrency: string, exchangeRate: number, userId: string) {
    return this.invoiceStorage.updateInvoiceCurrency(invoiceId, newCurrency, exchangeRate, userId);
  }

  async getCreditNotes(...args: any[]) {
    console.warn('getCreditNotes: Using stub implementation - should be moved to CreditNoteStorage');
    return [];
  }

  async getDashboardStats() {
    try {
      // Get counts from different modules
      const [enquiries, quotations, salesOrders] = await Promise.all([
        this.enquiryStorage.getEnquiries(100, 0),
        this.quotationStorage.getQuotations(100, 0),
        this.salesOrderStorage.getSalesOrders(100, 0)
      ]);

      // Calculate stats
      const activeEnquiries = enquiries.filter((e: any) => e.status === 'New' || e.status === 'In Progress').length;
      const pendingQuotes = quotations.filter((q: any) => q.status === 'Draft' || q.status === 'Sent').length;
      const activeOrders = salesOrders.filter((o: any) => o.status === 'Confirmed' || o.status === 'Processing' || o.status === 'Shipped').length;
      
      // Calculate monthly revenue (simplified)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = salesOrders
        .filter((o: any) => {
          const orderDate = new Date(o.orderDate);
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        })
        .reduce((sum: number, order: any) => sum + (Number(order.totalAmount) || 0), 0);

      return {
        activeEnquiries,
        pendingQuotes,
        activeOrders,
        monthlyRevenue
      };
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      return {
        activeEnquiries: 0,
        pendingQuotes: 0,
        activeOrders: 0,
        monthlyRevenue: 0
      };
    }
  }

  async getStockMovements(filters?: {
    itemId?: string;
    movementType?: string;
    referenceType?: string;
    referenceId?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }) {
    return this.inventoryStorage.getStockMovements(filters);
  }

  async getStockMovement(id: string) {
    return this.inventoryStorage.getStockMovement(id);
  }

  async createStockMovement(movement: any) {
    return this.inventoryStorage.createStockMovement(movement);
  }

  async getCustomerStats() {
    try {
      const customers = await this.customerStorage.getCustomers(1000, 0);
      
      const stats = {
        totalCustomers: customers.length,
        activeCustomers: customers.filter((c: any) => c.isActive).length,
        retailCustomers: customers.filter((c: any) => c.customerType === 'Retail').length,
        wholesaleCustomers: customers.filter((c: any) => c.customerType === 'Wholesale').length,
        totalCreditLimit: customers.reduce((sum: number, c: any) => sum + (Number(c.creditLimit) || 0), 0),
        averageCreditLimit: 0
      };
      
      stats.averageCreditLimit = stats.totalCustomers > 0 ? stats.totalCreditLimit / stats.totalCustomers : 0;
      
      return stats;
    } catch (error) {
      console.error('Error calculating customer stats:', error);
      return {
        totalCustomers: 0,
        activeCustomers: 0,
        retailCustomers: 0,
        wholesaleCustomers: 0,
        totalCreditLimit: 0,
        averageCreditLimit: 0
      };
    }
  }

  // Physical Stock operations - delegate to PhysicalStockStorage
  async getAllPhysicalStockItems() {
    return this.physicalStockStorage.getAllPhysicalStockItems();
  }

  async createPhysicalStockItem(data: Parameters<PhysicalStockStorage['createPhysicalStockItem']>[0]) {
    return this.physicalStockStorage.createPhysicalStockItem(data);
  }

  async updatePhysicalStockItem(id: string, data: any) {
    return this.physicalStockStorage.updatePhysicalStockItem(id, data);
  }

  async deletePhysicalStockItem(id: string, userId?: string) {
    return this.physicalStockStorage.deletePhysicalStockItem(id, userId);
  }

  async getPhysicalStockCounts(limit?: number, offset?: number) {
    return this.physicalStockStorage.getPhysicalStockCounts(limit, offset);
  }

  async getPhysicalStockCountById(id: string) {
    return this.physicalStockStorage.getPhysicalStockCountById(id);
  }

  async getPhysicalStockCountByNumber(countNumber: string) {
    return this.physicalStockStorage.getPhysicalStockCountByNumber(countNumber);
  }

  async createPhysicalStockCount(data: Parameters<PhysicalStockStorage['createPhysicalStockCount']>[0]) {
    return this.physicalStockStorage.createPhysicalStockCount(data);
  }

  async updatePhysicalStockCount(id: string, data: Parameters<PhysicalStockStorage['updatePhysicalStockCount']>[1], userId?: string) {
    return this.physicalStockStorage.updatePhysicalStockCount(id, data, userId);
  }

  async deletePhysicalStockCount(id: string, userId?: string) {
    return this.physicalStockStorage.deletePhysicalStockCount(id, userId);
  }

  async getPhysicalStockCountItems(physicalStockCountId: string) {
    return this.physicalStockStorage.getPhysicalStockCountItems(physicalStockCountId);
  }

  async createPhysicalStockCountItem(data: Parameters<PhysicalStockStorage['createPhysicalStockCountItem']>[0]) {
    return this.physicalStockStorage.createPhysicalStockCountItem(data);
  }

  async updatePhysicalStockCountItem(id: string, data: Parameters<PhysicalStockStorage['updatePhysicalStockCountItem']>[1]) {
    return this.physicalStockStorage.updatePhysicalStockCountItem(id, data);
  }

  async populatePhysicalStockCountItems(physicalStockCountId: string, storageLocation?: string) {
    return this.physicalStockStorage.populatePhysicalStockCountItems(physicalStockCountId, storageLocation);
  }

  async createScanningSession(data: Parameters<PhysicalStockStorage['createScanningSession']>[0]) {
    return this.physicalStockStorage.createScanningSession(data);
  }

  async getScanningSessionsByCountId(physicalStockCountId: string) {
    return this.physicalStockStorage.getScanningSessionsByCountId(physicalStockCountId);
  }

  async updateScanningSession(id: string, data: Parameters<PhysicalStockStorage['updateScanningSession']>[1]) {
    return this.physicalStockStorage.updateScanningSession(id, data);
  }

  async createScannedItem(data: Parameters<PhysicalStockStorage['createScannedItem']>[0]) {
    return this.physicalStockStorage.createScannedItem(data);
  }

  async getScannedItemsBySession(scanningSessionId: string) {
    return this.physicalStockStorage.getScannedItemsBySession(scanningSessionId);
  }

  async processBarcodeScan(scanningSessionId: string, barcode: string, scannedBy: string, quantity?: number, storageLocation?: string) {
    return this.physicalStockStorage.processBarcodeScan(scanningSessionId, barcode, scannedBy, quantity, storageLocation);
  }

  async createPhysicalStockAdjustment(data: Parameters<PhysicalStockStorage['createPhysicalStockAdjustment']>[0]) {
    return this.physicalStockStorage.createPhysicalStockAdjustment(data);
  }

  async generateAdjustmentsFromCount(physicalStockCountId: string, createdBy?: string) {
    return this.physicalStockStorage.generateAdjustmentsFromCount(physicalStockCountId, createdBy);
  }

  async applyPhysicalStockAdjustment(adjustmentId: string, appliedBy: string) {
    return this.physicalStockStorage.applyPhysicalStockAdjustment(adjustmentId, appliedBy);
  }

  async getPhysicalStockCountSummary(physicalStockCountId: string) {
    return this.physicalStockStorage.getPhysicalStockCountSummary(physicalStockCountId);
  }

  async finalizePhysicalStockCount(physicalStockCountId: string, completedBy: string) {
    return this.physicalStockStorage.finalizePhysicalStockCount(physicalStockCountId, completedBy);
  }

  // Missing methods that are being called by routes
  async getInventoryLevels(filters?: any) {
    return this.inventoryStorage.getInventoryLevels(filters);
  }

  async getSupplierReturns(filters?: any) {
    // For now, return empty array as this functionality is not yet implemented
    console.warn('getSupplierReturns: Using stub implementation - should be moved to SupplierReturnStorage');
    return [];
  }

  async getGoodsReceiptItems(goodsReceiptId: string) {
    return this.goodsReceiptStorage.getGoodsReceiptItems(goodsReceiptId);
  }

  // Additional missing methods that might be called
  async getGoodsReceiptHeader(id: string) {
    return this.goodsReceiptStorage.getGoodsReceiptHeader(id);
  }

  async updateGoodsReceiptHeader(id: string, data: any) {
    // For now, return a stub as this functionality is not yet implemented
    console.warn('updateGoodsReceiptHeader: Using stub implementation');
    return { id, ...data };
  }

  async updateGoodsReceiptItem(id: string, data: any) {
    // For now, return a stub as this functionality is not yet implemented
    console.warn('updateGoodsReceiptItem: Using stub implementation');
    return { id, ...data };
  }

  async bulkCreateGoodsReceiptItems(items: any[]) {
    return this.goodsReceiptStorage.createGoodsReceiptItemsBulk(items);
  }

  async updateGoodsReceiptStatus(id: string, status: string) {
    return this.goodsReceiptStorage.updateGoodsReceiptStatus(id, status);
  }

  async approveGoodsReceipt(id: string, approvedBy?: string) {
    return this.goodsReceiptStorage.approveGoodsReceipt(id, approvedBy);
  }


  // Supplier return methods (stubs for now)
  async getSupplierReturn(id: string) {
    console.warn('getSupplierReturn: Using stub implementation');
    return null;
  }

  async createSupplierReturn(data: any) {
    console.warn('createSupplierReturn: Using stub implementation');
    return { id: 'stub-' + Date.now(), ...data };
  }

  async updateSupplierReturn(id: string, data: any) {
    console.warn('updateSupplierReturn: Using stub implementation');
    return { id, ...data };
  }

  async getSupplierReturnItems(returnId: string) {
    console.warn('getSupplierReturnItems: Using stub implementation');
    return [];
  }

  async createSupplierReturnItem(data: any) {
    console.warn('createSupplierReturnItem: Using stub implementation');
    return { id: 'stub-' + Date.now(), ...data };
  }

  async bulkCreateSupplierReturnItems(items: any[]) {
    console.warn('bulkCreateSupplierReturnItems: Using stub implementation');
    return items.map(item => ({ id: 'stub-' + Date.now(), ...item }));
  }

}
