import {
  type Customer,
  type Supplier,
  type Item,
  type Enquiry,
  type EnquiryItem,
  type Quotation,
  type QuotationItem,
  type SalesOrder,
  type SalesOrderItem,
  type SupplierLpo,
  type SupplierLpoItem,
  type GoodsReceipt,
  type Delivery,
  type DeliveryItem,
  type Invoice,
  type InvoiceItem,
  type DeliveryPickingSession,
  type DeliveryPickedItem,
  type CreditNote,
  type CreditNoteItem,
  type User,
  type CustomerAcceptance,
  type PurchaseOrder,
  type QuotationItemAcceptance,
  type PoLineItem,
  type AcceptanceConfirmation,
  type ApprovalRule,
  type QuotationApproval,
  type InventoryItem,
  type InventoryVariant,
  type InventoryLevel,
  type GoodsReceiptHeader,
  type GoodsReceiptItem,
  type ScanningSession,
  type ScannedItem,
  type SupplierReturn,
  type SupplierReturnItem,
  type StockMovement,
  type InsertCustomer,
  type InsertSupplier,
  type InsertItem,
  type InsertEnquiry,
  type InsertEnquiryItem,
  type InsertQuotation,
  type InsertQuotationItem,
  type InsertApprovalRule,
  type InsertQuotationApproval,
  type InsertCustomerAcceptance,
  type InsertPurchaseOrder,
  type InsertQuotationItemAcceptance,
  type InsertPoLineItem,
  type InsertAcceptanceConfirmation,
  type InsertSalesOrder,
  type InsertSalesOrderItem,
  type InsertSupplierLpo,
  type InsertSupplierLpoItem,
  type InsertInventoryItem,
  type InsertInventoryVariant,
  type InsertInventoryLevel,
  type InsertGoodsReceiptHeader,
  type InsertGoodsReceiptItem,
  type InsertScanningSession,
  type InsertScannedItem,
  type InsertSupplierReturn,
  type InsertSupplierReturnItem,
  type InsertStockMovement,
  type InsertDelivery,
  type InsertDeliveryItem,
  type InsertInvoiceItem,
  type InsertDeliveryPickingSession,
  type InsertDeliveryPickedItem,
  type InsertCreditNote,
  type InsertCreditNoteItem,
  type InsertInvoice,
} from "@shared/schema";

export interface IUserStorage {
  getUser(id: string): Promise<User | undefined>;
  createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
}

export interface ICustomerStorage {
  getCustomers(limit?: number, offset?: number): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerDetails(id: string): Promise<any>;
  getCustomerTransactionSummary(customerId: string): Promise<any>;
  getCustomerRecentActivities(customerId: string, limit?: number): Promise<any[]>;
  getCustomerPerformanceMetrics(customerId: string): Promise<any>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer>;
}

export interface ISupplierStorage {
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier>;
  deleteSupplier(id: string): Promise<void>;
  
  // Enhanced methods for supplier detail page
  getSupplierDetails(id: string): Promise<{
    supplier: Supplier;
    stats: {
      totalLpos: number;
      totalLpoValue: string;
      pendingLpos: number;
      totalItems: number;
      totalGoodsReceipts: number;
      averageDeliveryDays: number;
      onTimeDeliveryRate: number;
    };
    recentActivities: Array<{
      id: string;
      type: string;
      description: string;
      date: string;
      status?: string;
      amount?: string;
    }>;
  } | null>;
  
  getSupplierLposForDetail(supplierId: string, page?: number, limit?: number): Promise<{
    lpos: Array<{
      id: string;
      lpoNumber: string;
      status: string;
      lpoDate: string;
      expectedDeliveryDate: string | null;
      totalAmount: string | null;
      itemsCount: number;
    }>;
    total: number;
  }>;
  
  getSupplierItems(supplierId: string, page?: number, limit?: number): Promise<{
    items: Array<{
      id: string;
      supplierCode: string;
      barcode: string | null;
      description: string;
      category: string | null;
      unitOfMeasure: string | null;
      costPrice: string | null;
      isActive: boolean;
      lastOrderDate: string | null;
      totalOrdered: number;
    }>;
    total: number;
  }>;
  
  getSupplierGoodsReceipts(supplierId: string, page?: number, limit?: number): Promise<{
    receipts: Array<{
      id: string;
      receiptNumber: string;
      receiptDate: string;
      status: string;
      lpoNumber: string;
      totalItems: number;
      receivedItems: number;
      expectedDeliveryDate: string | null;
      actualDeliveryDate: string | null;
    }>;
    total: number;
  }>;
  
  getSupplierPerformanceMetrics(supplierId: string): Promise<{
    deliveryPerformance: {
      onTimeDeliveries: number;
      totalDeliveries: number;
      onTimeRate: number;
      averageDelayDays: number;
    };
    qualityMetrics: {
      totalReceipts: number;
      acceptedReceipts: number;
      rejectedReceipts: number;
      acceptanceRate: number;
    };
    financialMetrics: {
      totalOrderValue: string;
      averageOrderValue: string;
      paymentTermsCompliance: number;
    };
  }>;
}

export interface IItemStorage {
  getItems(): Promise<Item[]>;
  getItem(id: string): Promise<Item | undefined>;
  getItemByBarcode(barcode: string): Promise<Item | undefined>;
  createItem(item: InsertItem): Promise<Item>;
}

export interface IEnquiryStorage {
  getEnquiries(limit?: number, offset?: number, filters?: {
    status?: string;
    source?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<Enquiry[]>;
  getEnquiry(id: string): Promise<Enquiry | undefined>;
  createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry>;
  updateEnquiry(id: string, enquiry: Partial<InsertEnquiry>): Promise<Enquiry>;
  deleteEnquiry(id: string): Promise<void>;
  
  // Enquiry Item operations
  getEnquiryItems(enquiryId: string): Promise<EnquiryItem[]>;
  getEnquiryItem(id: string): Promise<EnquiryItem | undefined>;
  createEnquiryItem(enquiryItem: InsertEnquiryItem): Promise<EnquiryItem>;
  updateEnquiryItem(id: string, enquiryItem: Partial<InsertEnquiryItem>): Promise<EnquiryItem>;
  deleteEnquiryItem(id: string): Promise<void>;
  bulkCreateEnquiryItems(enquiryItems: InsertEnquiryItem[]): Promise<EnquiryItem[]>;
}

export interface IQuotationStorage {
  getQuotations(limit?: number, offset?: number, filters?: {
    status?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<Quotation[]>;
  getQuotation(id: string): Promise<Quotation | undefined>;
  createQuotation(quotation: InsertQuotation): Promise<Quotation>;
  updateQuotation(id: string, quotation: Partial<InsertQuotation>): Promise<Quotation>;
  deleteQuotation(id: string): Promise<void>;
  generateQuotationFromEnquiry(enquiryId: string, userId: string): Promise<Quotation>;
  
  // Quotation revision operations
  createQuotationRevision(originalId: string, revisionData: any, userId: string): Promise<Quotation>;
  getQuotationRevisions(originalId: string): Promise<Quotation[]>;
  getQuotationHistory(quotationId: string): Promise<any[]>;

  // Quotation Item operations
  getQuotationItems(quotationId: string): Promise<QuotationItem[]>;
  createQuotationItem(item: InsertQuotationItem): Promise<QuotationItem>;
  updateQuotationItem(id: string, item: Partial<InsertQuotationItem>): Promise<QuotationItem>;
  deleteQuotationItem(id: string): Promise<void>;
}

export interface IApprovalStorage {
  getApprovalRules(): Promise<ApprovalRule[]>;
  createApprovalRule(rule: InsertApprovalRule): Promise<ApprovalRule>;
  updateApprovalRule(id: string, rule: Partial<InsertApprovalRule>): Promise<ApprovalRule>;
  deleteApprovalRule(id: string): Promise<void>;
  determineRequiredApprovalLevel(quotation: Partial<Quotation>): Promise<string | null>;

  getQuotationApprovals(quotationId: string): Promise<QuotationApproval[]>;
  createQuotationApproval(approval: InsertQuotationApproval): Promise<QuotationApproval>;
}

export interface ICustomerAcceptanceStorage {
  getCustomerAcceptances(quotationId?: string): Promise<CustomerAcceptance[]>;
  getCustomerAcceptance(id: string): Promise<CustomerAcceptance | undefined>;
  createCustomerAcceptance(acceptance: InsertCustomerAcceptance): Promise<CustomerAcceptance>;
  updateCustomerAcceptance(id: string, acceptance: Partial<InsertCustomerAcceptance>): Promise<CustomerAcceptance>;
  deleteCustomerAcceptance(id: string): Promise<void>;
  supersedeActiveAcceptances(quotationId: string): Promise<void>;

  // Quotation Item Acceptance operations
  getQuotationItemAcceptances(customerAcceptanceId: string): Promise<QuotationItemAcceptance[]>;
  getQuotationItemAcceptance(id: string): Promise<QuotationItemAcceptance | undefined>;
  createQuotationItemAcceptance(itemAcceptance: InsertQuotationItemAcceptance): Promise<QuotationItemAcceptance>;
  updateQuotationItemAcceptance(id: string, itemAcceptance: Partial<InsertQuotationItemAcceptance>): Promise<QuotationItemAcceptance>;
  bulkCreateQuotationItemAcceptances(itemAcceptances: InsertQuotationItemAcceptance[]): Promise<QuotationItemAcceptance[]>;

  // Acceptance Confirmation operations
  getAcceptanceConfirmations(customerAcceptanceId: string): Promise<AcceptanceConfirmation[]>;
  createAcceptanceConfirmation(confirmation: InsertAcceptanceConfirmation): Promise<AcceptanceConfirmation>;
}

export interface IPurchaseOrderStorage {
  getPurchaseOrders(quotationId?: string): Promise<PurchaseOrder[]>;
  getPurchaseOrder(id: string): Promise<PurchaseOrder | undefined>;
  createPurchaseOrder(po: InsertPurchaseOrder): Promise<PurchaseOrder>;
  updatePurchaseOrder(id: string, po: Partial<InsertPurchaseOrder>): Promise<PurchaseOrder>;
  deletePurchaseOrder(id: string): Promise<void>;
  validatePurchaseOrder(id: string, validationData: { status: string; notes?: string; validatedBy: string }): Promise<PurchaseOrder>;

  // PO Line Items operations
  getPoLineItems(purchaseOrderId: string): Promise<PoLineItem[]>;
  createPoLineItem(lineItem: InsertPoLineItem): Promise<PoLineItem>;
  updatePoLineItem(id: string, lineItem: Partial<InsertPoLineItem>): Promise<PoLineItem>;
  bulkCreatePoLineItems(lineItems: InsertPoLineItem[]): Promise<PoLineItem[]>;
}

export interface ISalesOrderStorage {
  getSalesOrders(limit?: number, offset?: number, filters?: {
    status?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    pendingSupplierLpo?: boolean;
  }): Promise<SalesOrder[]>;
  getSalesOrder(id: string): Promise<(SalesOrder & { customer: Customer | null }) | null>;
  createSalesOrder(salesOrder: InsertSalesOrder): Promise<SalesOrder>;
  updateSalesOrder(id: string, salesOrder: Partial<InsertSalesOrder>): Promise<SalesOrder>;
  deleteSalesOrder(id: string): Promise<void>;
  createSalesOrderFromQuotation(quotationId: string, customerAcceptanceId?: string, userId?: string): Promise<SalesOrder>;
  createAmendedSalesOrder(parentOrderId: string, reason: string, userId?: string): Promise<SalesOrder>;
  validateCustomerLpo(id: string, validationData: { status: string; notes?: string; validatedBy: string }): Promise<SalesOrder>;
  getSalesOrderLineage(orderId: string): Promise<SalesOrder[]>;
  
  // Sales Order Item operations
  getSalesOrderItems(salesOrderId: string): Promise<SalesOrderItem[]>;
  getSalesOrderItem(id: string): Promise<SalesOrderItem | undefined>;
  createSalesOrderItem(item: InsertSalesOrderItem): Promise<SalesOrderItem>;
  updateSalesOrderItem(id: string, item: Partial<InsertSalesOrderItem>): Promise<SalesOrderItem>;
  deleteSalesOrderItem(id: string): Promise<void>;
  bulkCreateSalesOrderItems(items: InsertSalesOrderItem[]): Promise<SalesOrderItem[]>;
}

export interface ISupplierLpoStorage {
  getSupplierLpos(limit?: number, offset?: number, filters?: {
    status?: string;
    supplierId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<SupplierLpo[]>;
  getSupplierLposCount(filters?: {
    status?: string;
    supplierId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<number>;
  getSupplierLpo(id: string): Promise<SupplierLpo | undefined>;
  createSupplierLpo(supplierLpo: InsertSupplierLpo): Promise<SupplierLpo>;
  updateSupplierLpo(id: string, supplierLpo: Partial<InsertSupplierLpo>): Promise<SupplierLpo>;
  deleteSupplierLpo(id: string): Promise<void>;
  createSupplierLposFromSalesOrders(salesOrderIds: string[], groupBy: string, userId?: string): Promise<SupplierLpo[]>;
  createAmendedSupplierLpo(parentLpoId: string, reason: string, amendmentType: string, userId?: string): Promise<SupplierLpo>;
  submitForApproval(id: string, userId: string): Promise<SupplierLpo>;
  approveSupplierLpo(id: string, userId: string, notes?: string): Promise<SupplierLpo>;
  rejectSupplierLpo(id: string, userId: string, notes: string): Promise<SupplierLpo>;
  sendToSupplier(id: string, userId: string): Promise<SupplierLpo>;
  confirmBySupplier(id: string, confirmationReference?: string): Promise<SupplierLpo>;
  updateExpectedDeliveryDate(id: string, expectedDeliveryDate: string, userId?: string): Promise<SupplierLpo>;
  getSupplierLpoBacklog(): Promise<any[]>;
  getCustomerOrderBacklog(): Promise<any[]>;
  
  // Supplier LPO Item operations
  getSupplierLpoItems(supplierLpoId: string): Promise<SupplierLpoItem[]>;
  getSupplierLpoItem(id: string): Promise<SupplierLpoItem | undefined>;
  createSupplierLpoItem(item: InsertSupplierLpoItem): Promise<SupplierLpoItem>;
  updateSupplierLpoItem(id: string, item: Partial<InsertSupplierLpoItem>): Promise<SupplierLpoItem>;
  deleteSupplierLpoItem(id: string): Promise<void>;
  bulkCreateSupplierLpoItems(items: InsertSupplierLpoItem[]): Promise<SupplierLpoItem[]>;
}

export interface IInventoryStorage {
  // Inventory Item operations
  getInventoryItems(filters?: {
    search?: string;
    supplierId?: string;
    category?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<any[]>;
  getInventoryItem(id: string): Promise<any | undefined>;
  getInventoryItemBySupplierCode(supplierCode: string): Promise<any | undefined>;
  getInventoryItemByBarcode(barcode: string): Promise<any | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem>;
  deleteInventoryItem(id: string): Promise<void>;
  bulkCreateInventoryItems(items: InsertInventoryItem[]): Promise<InventoryItem[]>;

  // Item Variant operations
  getItemVariants(itemId: string): Promise<InventoryVariant[]>;
  getItemVariant(id: string): Promise<InventoryVariant | undefined>;
  createItemVariant(variant: InsertInventoryVariant): Promise<InventoryVariant>;
  updateItemVariant(id: string, variant: Partial<InsertInventoryVariant>): Promise<InventoryVariant>;
  deleteItemVariant(id: string): Promise<void>;

  // Inventory Level operations
  getInventoryLevels(filters?: {
    itemId?: string;
    location?: string;
    lowStock?: boolean;
  }): Promise<InventoryLevel[]>;
  getInventoryLevel(id: string): Promise<InventoryLevel | undefined>;
  getInventoryLevelByItem(itemId: string, location?: string): Promise<InventoryLevel | undefined>;
  createInventoryLevel(inventory: InsertInventoryLevel): Promise<InventoryLevel>;
  updateInventoryLevel(id: string, inventory: Partial<InsertInventoryLevel>): Promise<InventoryLevel>;
  deleteInventoryLevel(id: string): Promise<void>;
  adjustInventoryQuantity(itemId: string, quantityChange: number, location?: string, reason?: string): Promise<InventoryLevel>;

  // Stock Movement operations
  getStockMovements(filters?: {
    itemId?: string;
    movementType?: string;
    referenceType?: string;
    referenceId?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<StockMovement[]>;
  getStockMovement(id: string): Promise<StockMovement | undefined>;
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;
  getItemStockHistory(itemId: string, limit?: number): Promise<StockMovement[]>;
}

export interface IGoodsReceiptStorage {
  // Goods Receipt Header operations
  getGoodsReceiptHeaders(filters?: {
    status?: string;
    supplierLpoId?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<GoodsReceiptHeader[]>;
  getGoodsReceiptHeader(id: string): Promise<GoodsReceiptHeader | undefined>;
  getGoodsReceiptByNumber(receiptNumber: string): Promise<GoodsReceiptHeader | undefined>;
  createGoodsReceiptHeader(receipt: InsertGoodsReceiptHeader): Promise<GoodsReceiptHeader>;
  updateGoodsReceiptHeader(id: string, receipt: Partial<InsertGoodsReceiptHeader>): Promise<GoodsReceiptHeader>;
  deleteGoodsReceiptHeader(id: string): Promise<void>;

  // Goods Receipt Item operations
  getGoodsReceiptItems(goodsReceiptId: string): Promise<GoodsReceiptItem[]>;
  getGoodsReceiptItem(id: string): Promise<GoodsReceiptItem | undefined>;
  createGoodsReceiptItem(item: InsertGoodsReceiptItem): Promise<GoodsReceiptItem>;
  updateGoodsReceiptItem(id: string, item: Partial<InsertGoodsReceiptItem>): Promise<GoodsReceiptItem>;
  deleteGoodsReceiptItem(id: string): Promise<void>;
  bulkCreateGoodsReceiptItems(items: InsertGoodsReceiptItem[]): Promise<GoodsReceiptItem[]>;

  // Scanning Session operations
  getScanningSessions(filters?: {
    status?: string;
    goodsReceiptId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ScanningSession[]>;
  getScanningSession(id: string): Promise<ScanningSession | undefined>;
  createScanningSession(session: InsertScanningSession): Promise<ScanningSession>;
  updateScanningSession(id: string, session: Partial<InsertScanningSession>): Promise<ScanningSession>;
  deleteScanningSession(id: string): Promise<void>;

  // Scanned Item operations
  getScannedItems(scanningSessionId: string): Promise<ScannedItem[]>;
  getScannedItem(id: string): Promise<ScannedItem | undefined>;
  createScannedItem(item: InsertScannedItem): Promise<ScannedItem>;
  updateScannedItem(id: string, item: Partial<InsertScannedItem>): Promise<ScannedItem>;
  deleteScannedItem(id: string): Promise<void>;
  bulkCreateScannedItems(items: InsertScannedItem[]): Promise<ScannedItem[]>;

  // Supplier Return operations
  getSupplierReturns(filters?: {
    status?: string;
    supplierId?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<SupplierReturn[]>;
  getSupplierReturn(id: string): Promise<SupplierReturn | undefined>;
  getSupplierReturnByNumber(returnNumber: string): Promise<SupplierReturn | undefined>;
  createSupplierReturn(supplierReturn: InsertSupplierReturn): Promise<SupplierReturn>;
  updateSupplierReturn(id: string, supplierReturn: Partial<InsertSupplierReturn>): Promise<SupplierReturn>;
  deleteSupplierReturn(id: string): Promise<void>;

  // Supplier Return Item operations
  getSupplierReturnItems(supplierReturnId: string): Promise<SupplierReturnItem[]>;
  getSupplierReturnItem(id: string): Promise<SupplierReturnItem | undefined>;
  createSupplierReturnItem(item: InsertSupplierReturnItem): Promise<SupplierReturnItem>;
  updateSupplierReturnItem(id: string, item: Partial<InsertSupplierReturnItem>): Promise<SupplierReturnItem>;
  deleteSupplierReturnItem(id: string): Promise<void>;
  bulkCreateSupplierReturnItems(items: InsertSupplierReturnItem[]): Promise<SupplierReturnItem[]>;
}

export interface IDeliveryStorage {
  getDeliveries(filters?: {
    status?: string;
    salesOrderId?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]>;
  getDelivery(id: string): Promise<Delivery | undefined>;
  getDeliveryByNumber(deliveryNumber: string): Promise<Delivery | undefined>;
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  updateDelivery(id: string, delivery: Partial<InsertDelivery>): Promise<Delivery>;
  deleteDelivery(id: string): Promise<void>;
  startDeliveryPicking(deliveryId: string, userId: string): Promise<Delivery>;
  completeDeliveryPicking(deliveryId: string, userId: string, notes?: string): Promise<Delivery>;
  confirmDelivery(deliveryId: string, confirmedBy: string, signature?: string): Promise<Delivery>;

  // Delivery Item operations
  getDeliveryItems(deliveryId: string): Promise<DeliveryItem[]>;
  getDeliveryItem(id: string): Promise<DeliveryItem | undefined>;
  createDeliveryItem(item: InsertDeliveryItem): Promise<DeliveryItem>;
  updateDeliveryItem(id: string, item: Partial<InsertDeliveryItem>): Promise<DeliveryItem>;
  deleteDeliveryItem(id: string): Promise<void>;
  bulkCreateDeliveryItems(items: InsertDeliveryItem[]): Promise<DeliveryItem[]>;

  // Delivery Picking Session operations
  getDeliveryPickingSessions(deliveryId: string): Promise<DeliveryPickingSession[]>;
  getDeliveryPickingSession(id: string): Promise<DeliveryPickingSession | undefined>;
  createDeliveryPickingSession(session: InsertDeliveryPickingSession): Promise<DeliveryPickingSession>;
  updateDeliveryPickingSession(id: string, session: Partial<InsertDeliveryPickingSession>): Promise<DeliveryPickingSession>;
  deleteDeliveryPickingSession(id: string): Promise<void>;

  // Delivery Picked Item operations
  getDeliveryPickedItems(sessionId: string): Promise<DeliveryPickedItem[]>;
  getDeliveryPickedItem(id: string): Promise<DeliveryPickedItem | undefined>;
  createDeliveryPickedItem(item: InsertDeliveryPickedItem): Promise<DeliveryPickedItem>;
  updateDeliveryPickedItem(id: string, item: Partial<InsertDeliveryPickedItem>): Promise<DeliveryPickedItem>;
  deleteDeliveryPickedItem(id: string): Promise<void>;
  bulkCreateDeliveryPickedItems(items: InsertDeliveryPickedItem[]): Promise<DeliveryPickedItem[]>;
}

export interface IShipmentStorage {
  // Shipment operations
  getShipments(filters?: {
    status?: string;
    priority?: string;
    carrierId?: string;
    serviceType?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]>;
  getShipment(id: string): Promise<any>;
  getShipmentByNumber(shipmentNumber: string): Promise<any>;
  getShipmentByTrackingNumber(trackingNumber: string): Promise<any>;
  createShipment(shipment: any): Promise<any>;
  updateShipment(id: string, shipment: any): Promise<any>;
  deleteShipment(id: string): Promise<void>;
  updateShipmentStatus(id: string, status: string, location?: string): Promise<any>;

  // Shipment tracking operations
  getShipmentTrackingEvents(shipmentId: string): Promise<any[]>;
  createTrackingEvent(event: any): Promise<any>;
  getLatestTrackingEvent(shipmentId: string): Promise<any>;
  
  // Analytics and reporting
  getShipmentAnalytics(): Promise<{
    totalShipments: number;
    pendingShipments: number;
    inTransitShipments: number;
    deliveredShipments: number;
    outForDeliveryShipments: number;
  }>;
}

export interface IInvoiceStorage {
  getInvoices(filters?: {
    status?: string;
    type?: string;
    customerId?: string;
    salesOrderId?: string;
    dateFrom?: string;
    dateTo?: string;
    currency?: string;
    limit?: number;
    offset?: number;
  }): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  deleteInvoice(id: string): Promise<void>;
  generateInvoiceFromDelivery(deliveryId: string, invoiceType?: string, userId?: string): Promise<Invoice>;
  generateProformaInvoice(salesOrderId: string, userId?: string): Promise<Invoice>;
  sendInvoice(invoiceId: string, userId: string): Promise<Invoice>;
  markInvoicePaid(invoiceId: string, paidAmount: number, paymentMethod?: string, paymentReference?: string, userId?: string): Promise<Invoice>;

  // Invoice Item operations
  getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]>;
  getInvoiceItem(id: string): Promise<InvoiceItem | undefined>;
  createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem>;
  updateInvoiceItem(id: string, item: Partial<InsertInvoiceItem>): Promise<InvoiceItem>;
  deleteInvoiceItem(id: string): Promise<void>;
  bulkCreateInvoiceItems(items: InsertInvoiceItem[]): Promise<InvoiceItem[]>;

  // Multi-currency operations
  convertCurrency(amount: number, fromCurrency: string, toCurrency: string, exchangeRate?: number): Promise<number>;
  getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number>;
  updateInvoiceCurrency(invoiceId: string, newCurrency: string, exchangeRate: number, userId: string): Promise<Invoice>;
}

export interface ICreditNoteStorage {
  getCreditNotes(filters?: {
    status?: string;
    customerId?: string;
    originalInvoiceId?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<CreditNote[]>;
  getCreditNote(id: string): Promise<CreditNote | undefined>;
  getCreditNoteByNumber(creditNoteNumber: string): Promise<CreditNote | undefined>;
  createCreditNote(creditNote: InsertCreditNote): Promise<CreditNote>;
  updateCreditNote(id: string, creditNote: Partial<InsertCreditNote>): Promise<CreditNote>;
  deleteCreditNote(id: string): Promise<void>;
  generateCreditNoteFromReturn(invoiceId: string, returnItems: any[], reason: string, userId?: string): Promise<CreditNote>;
  applyCreditNote(creditNoteId: string, appliedAmount: number, userId: string): Promise<CreditNote>;

  // Credit Note Item operations
  getCreditNoteItems(creditNoteId: string): Promise<CreditNoteItem[]>;
  getCreditNoteItem(id: string): Promise<CreditNoteItem | undefined>;
  createCreditNoteItem(item: InsertCreditNoteItem): Promise<CreditNoteItem>;
  updateCreditNoteItem(id: string, item: Partial<InsertCreditNoteItem>): Promise<CreditNoteItem>;
  deleteCreditNoteItem(id: string): Promise<void>;
  bulkCreateCreditNoteItems(items: InsertCreditNoteItem[]): Promise<CreditNoteItem[]>;
}

export interface IAuditStorage {
  logAuditEvent(
    entityType: string,
    entityId: string,
    action: string,
    userId?: string,
    oldData?: any,
    newData?: any
  ): Promise<void>;
}

export interface IDashboardStorage {
  getDashboardStats(): Promise<{
    activeEnquiries: number;
    pendingQuotes: number;
    activeOrders: number;
    monthlyRevenue: number;
  }>;
}

export interface IPricingStorage {
  getItemPricing(itemId: string, customerId?: string, quantity?: number): Promise<{
    basePrice: number;
    effectivePrice: number;
    discountApplied: number;
    priceSource: string;
  }>;
}

// Main storage interface combining all modules
export interface IStorage extends 
  IUserStorage,
  ICustomerStorage, 
  ISupplierStorage,
  IItemStorage,
  IEnquiryStorage,
  IQuotationStorage,
  IApprovalStorage,
  ICustomerAcceptanceStorage,
  IPurchaseOrderStorage,
  ISalesOrderStorage,
  ISupplierLpoStorage,
  IInventoryStorage,
  IGoodsReceiptStorage,
  IDeliveryStorage,
  IShipmentStorage,
  IInvoiceStorage,
  ICreditNoteStorage,
  IAuditStorage,
  IDashboardStorage,
  IPricingStorage {
}
