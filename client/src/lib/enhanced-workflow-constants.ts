// Enhanced Workflow Constants for Comprehensive ERP Flow
// Organized into three main modules: Sales Management, Purchase Management, and Inventory Management

export interface WorkflowStep {
  id: number;
  name: string;
  path: string;
  icon: string;
  color: string;
  description: string;
  estimatedDuration: number; // days
  requiredFields: string[];
  dependencies: number[];
  validationRules: Record<string, any>;
  successCriteria: string;
  nextActions: string[];
  module: 'Sales' | 'Purchase' | 'Inventory';
  subModule?: string;
  isOptional?: boolean;
  requiresApproval?: boolean;
  approvalLevel?: 'Manager' | 'Director' | 'Finance';
}

// SALES MANAGEMENT MODULE
export const SALES_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 1,
    name: "Customer Management",
    path: "/customers",
    icon: "fas fa-users",
    color: "text-blue-700",
    description: "Create and manage customer information, profiles, and relationships",
    estimatedDuration: 1,
    requiredFields: ["customerName", "contactInfo", "customerType", "classification", "creditLimit", "paymentTerms"],
    dependencies: [],
    validationRules: {
      customerName: { required: true, minLength: 2 },
      contactInfo: { required: true, type: "email" },
      customerType: { required: true, enum: ["Retail", "Wholesale"] },
      classification: { required: true, enum: ["Internal", "Corporate", "Individual", "Family", "Ministry"] },
      creditLimit: { required: true, type: "number", min: 0 },
      paymentTerms: { required: true, enum: ["Net 30", "Net 15", "COD", "Prepaid"] }
    },
    successCriteria: "Customer profile created with complete information and credit approval",
    nextActions: ["Create enquiry for customer"],
    module: "Sales",
    subModule: "Customer Management"
  },
  {
    id: 2,
    name: "Enquiry Management",
    path: "/enquiries",
    icon: "fas fa-question-circle",
    color: "text-amber-500",
    description: "Process customer enquiry, requirements, and initial qualification",
    estimatedDuration: 2,
    requiredFields: ["enquiryDetails", "productRequirements", "quantity", "urgency", "source", "expectedDelivery"],
    dependencies: [1],
    validationRules: {
      enquiryDetails: { required: true, minLength: 10 },
      productRequirements: { required: true, minLength: 5 },
      quantity: { required: true, type: "number", min: 1 },
      urgency: { required: true, enum: ["Low", "Medium", "High", "Urgent"] },
      source: { required: true, enum: ["Email", "Phone", "Web Form", "Walk-in", "Referral"] },
      expectedDelivery: { required: true, type: "date" }
    },
    successCriteria: "Enquiry details captured, qualified, and status set to 'In Progress'",
    nextActions: ["Generate quotation"],
    module: "Sales",
    subModule: "Enquiry Management"
  },
  {
    id: 3,
    name: "Quotation Management",
    path: "/quotations",
    icon: "fas fa-file-alt",
    color: "text-blue-500",
    description: "Generate, manage, and track quotations with pricing and terms",
    estimatedDuration: 1,
    requiredFields: ["quotationNumber", "lineItems", "pricing", "validityPeriod", "termsAndConditions", "discounts"],
    dependencies: [2],
    validationRules: {
      quotationNumber: { required: true, pattern: "^QT-\\d{4}-\\d{3}$" },
      lineItems: { required: true, minItems: 1 },
      pricing: { required: true, type: "object" },
      validityPeriod: { required: true, type: "number", min: 1 },
      termsAndConditions: { required: true, minLength: 20 },
      discounts: { required: false, type: "object" }
    },
    successCriteria: "Quotation generated, approved, and sent to customer",
    nextActions: ["Wait for customer acceptance"],
    module: "Sales",
    subModule: "Quotation Management",
    requiresApproval: true,
    approvalLevel: "Manager"
  },
  {
    id: 4,
    name: "Customer PO Upload",
    path: "/customer-po-upload",
    icon: "fas fa-upload",
    color: "text-purple-500",
    description: "Upload, validate, and process customer purchase orders",
    estimatedDuration: 1,
    requiredFields: ["poDocument", "poNumber", "poDate", "poAmount", "poTerms", "poValidation"],
    dependencies: [3],
    validationRules: {
      poDocument: { required: true, type: "file" },
      poNumber: { required: true, minLength: 3 },
      poDate: { required: true, type: "date" },
      poAmount: { required: true, type: "number", min: 0 },
      poTerms: { required: true, minLength: 5 },
      poValidation: { required: true, type: "boolean" }
    },
    successCriteria: "Customer PO uploaded, validated, and approved",
    nextActions: ["Generate sales order"],
    module: "Sales",
    subModule: "Customer PO Management"
  },
  {
    id: 5,
    name: "Sales Order Management",
    path: "/sales-orders",
    icon: "fas fa-shopping-cart",
    color: "text-green-600",
    description: "Create, manage, and track sales orders from customer POs",
    estimatedDuration: 1,
    requiredFields: ["salesOrderNumber", "orderItems", "totalAmount", "deliveryDate", "paymentTerms", "orderStatus"],
    dependencies: [4],
    validationRules: {
      salesOrderNumber: { required: true, pattern: "^SO-\\d{4}-\\d{3}$" },
      orderItems: { required: true, minItems: 1 },
      totalAmount: { required: true, type: "number", min: 0 },
      deliveryDate: { required: true, type: "date" },
      paymentTerms: { required: true, enum: ["Net 30", "Net 15", "COD", "Prepaid"] },
      orderStatus: { required: true, enum: ["Draft", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"] }
    },
    successCriteria: "Sales order created, confirmed, and ready for fulfillment",
    nextActions: ["Generate delivery note"],
    module: "Sales",
    subModule: "Sales Order Management"
  },
  {
    id: 6,
    name: "Delivery Note Management",
    path: "/delivery-note",
    icon: "fas fa-truck-moving",
    color: "text-blue-600",
    description: "Create delivery notes, manage shipments, and track deliveries",
    estimatedDuration: 1,
    requiredFields: ["deliveryNoteNumber", "deliveryAddress", "deliveryDate", "carrierDetails", "trackingNumber", "deliveryStatus"],
    dependencies: [5],
    validationRules: {
      deliveryNoteNumber: { required: true, pattern: "^DN-\\d{4}-\\d{3}$" },
      deliveryAddress: { required: true, minLength: 10 },
      deliveryDate: { required: true, type: "date" },
      carrierDetails: { required: true, type: "object" },
      trackingNumber: { required: true, minLength: 5 },
      deliveryStatus: { required: true, enum: ["Prepared", "Dispatched", "In Transit", "Delivered", "Returned"] }
    },
    successCriteria: "Delivery note created and goods dispatched to customer",
    nextActions: ["Generate invoice"],
    module: "Sales",
    subModule: "Delivery Management"
  },
  {
    id: 7,
    name: "Invoicing Management",
    path: "/invoicing",
    icon: "fas fa-file-invoice",
    color: "text-green-600",
    description: "Generate, send, and track invoices and payments",
    estimatedDuration: 1,
    requiredFields: ["invoiceNumber", "invoiceDate", "lineItems", "totalAmount", "paymentInstructions", "invoiceStatus"],
    dependencies: [6],
    validationRules: {
      invoiceNumber: { required: true, pattern: "^INV-\\d{4}-\\d{3}$" },
      invoiceDate: { required: true, type: "date" },
      lineItems: { required: true, minItems: 1 },
      totalAmount: { required: true, type: "number", min: 0 },
      paymentInstructions: { required: true, minLength: 10 },
      invoiceStatus: { required: true, enum: ["Draft", "Sent", "Paid", "Overdue", "Cancelled"] }
    },
    successCriteria: "Invoice generated, sent to customer, and payment tracked",
    nextActions: ["Track payment and close order"],
    module: "Sales",
    subModule: "Invoicing Management"
  }
];

// PURCHASE MANAGEMENT MODULE
export const PURCHASE_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 8,
    name: "Supplier Management",
    path: "/suppliers",
    icon: "fas fa-truck",
    color: "text-indigo-600",
    description: "Manage supplier information, contracts, and performance",
    estimatedDuration: 1,
    requiredFields: ["supplierName", "contactInfo", "supplierType", "contractDetails", "performanceRating", "paymentTerms"],
    dependencies: [],
    validationRules: {
      supplierName: { required: true, minLength: 2 },
      contactInfo: { required: true, type: "email" },
      supplierType: { required: true, enum: ["Manufacturer", "Distributor", "Service Provider", "Local Supplier"] },
      contractDetails: { required: true, type: "object" },
      performanceRating: { required: true, type: "number", min: 1, max: 5 },
      paymentTerms: { required: true, enum: ["Net 30", "Net 15", "COD", "Prepaid"] }
    },
    successCriteria: "Supplier profile created with complete information and contract established",
    nextActions: ["Create requisition"],
    module: "Purchase",
    subModule: "Supplier Management"
  },
  {
    id: 9,
    name: "Requisition Management",
    path: "/requisitions",
    icon: "fas fa-clipboard-list",
    color: "text-orange-500",
    description: "Create and manage internal requisitions for goods and services",
    estimatedDuration: 1,
    requiredFields: ["requisitionNumber", "requestedItems", "quantity", "urgency", "requestedBy", "department", "budgetCode"],
    dependencies: [8],
    validationRules: {
      requisitionNumber: { required: true, pattern: "^REQ-\\d{4}-\\d{3}$" },
      requestedItems: { required: true, minItems: 1 },
      quantity: { required: true, type: "number", min: 1 },
      urgency: { required: true, enum: ["Low", "Medium", "High", "Urgent"] },
      requestedBy: { required: true, minLength: 2 },
      department: { required: true, enum: ["Sales", "Operations", "IT", "Finance", "HR"] },
      budgetCode: { required: true, minLength: 3 }
    },
    successCriteria: "Requisition created, approved, and ready for quotation",
    nextActions: ["Request supplier quotes"],
    module: "Purchase",
    subModule: "Requisition Management",
    requiresApproval: true,
    approvalLevel: "Manager"
  },
  {
    id: 10,
    name: "Supplier Quotes Management",
    path: "/supplier-quotes",
    icon: "fas fa-file-contract",
    color: "text-amber-600",
    description: "Request, receive, and evaluate supplier quotations",
    estimatedDuration: 3,
    requiredFields: ["quoteNumber", "supplierDetails", "quoteItems", "pricing", "validityPeriod", "evaluationScore"],
    dependencies: [9],
    validationRules: {
      quoteNumber: { required: true, pattern: "^SQ-\\d{4}-\\d{3}$" },
      supplierDetails: { required: true, type: "object" },
      quoteItems: { required: true, minItems: 1 },
      pricing: { required: true, type: "object" },
      validityPeriod: { required: true, type: "number", min: 1 },
      evaluationScore: { required: true, type: "number", min: 1, max: 10 }
    },
    successCriteria: "Supplier quotes received, evaluated, and best quote selected",
    nextActions: ["Generate supplier LPO"],
    module: "Purchase",
    subModule: "Supplier Quotes Management"
  },
  {
    id: 11,
    name: "Supplier LPO Management",
    path: "/supplier-lpo",
    icon: "fas fa-handshake",
    color: "text-indigo-500",
    description: "Create, send, and track Local Purchase Orders to suppliers",
    estimatedDuration: 1,
    requiredFields: ["lpoNumber", "supplierDetails", "orderItems", "deliveryInstructions", "paymentTerms", "lpoStatus"],
    dependencies: [10],
    validationRules: {
      lpoNumber: { required: true, pattern: "^LPO-\\d{4}-\\d{3}$" },
      supplierDetails: { required: true, type: "object" },
      orderItems: { required: true, minItems: 1 },
      deliveryInstructions: { required: true, minLength: 10 },
      paymentTerms: { required: true, enum: ["Net 30", "Net 15", "COD", "Prepaid"] },
      lpoStatus: { required: true, enum: ["Draft", "Sent", "Acknowledged", "Confirmed", "Cancelled"] }
    },
    successCriteria: "LPO sent to supplier and acknowledged",
    nextActions: ["Track shipment"],
    module: "Purchase",
    subModule: "Supplier LPO Management"
  },
  {
    id: 12,
    name: "Shipment Tracking",
    path: "/shipment-tracking",
    icon: "fas fa-shipping-fast",
    color: "text-cyan-500",
    description: "Track shipments, monitor delivery status, and manage logistics",
    estimatedDuration: 5,
    requiredFields: ["trackingNumber", "carrierDetails", "shipmentDate", "expectedDelivery", "currentStatus", "locationUpdates"],
    dependencies: [11],
    validationRules: {
      trackingNumber: { required: true, minLength: 5 },
      carrierDetails: { required: true, type: "object" },
      shipmentDate: { required: true, type: "date" },
      expectedDelivery: { required: true, type: "date" },
      currentStatus: { required: true, enum: ["Dispatched", "In Transit", "Out for Delivery", "Delivered", "Delayed"] },
      locationUpdates: { required: true, type: "array" }
    },
    successCriteria: "Shipment tracked and delivered successfully",
    nextActions: ["Process goods receipt"],
    module: "Purchase",
    subModule: "Shipment Tracking"
  },
  {
    id: 13,
    name: "Goods Receipt Management",
    path: "/goods-receipt",
    icon: "fas fa-box-open",
    color: "text-orange-500",
    description: "Receive, inspect, and process goods from suppliers",
    estimatedDuration: 2,
    requiredFields: ["receiptDate", "receivedItems", "quantityReceived", "qualityCheck", "damageReport", "receiptStatus"],
    dependencies: [12],
    validationRules: {
      receiptDate: { required: true, type: "date" },
      receivedItems: { required: true, minItems: 1 },
      quantityReceived: { required: true, type: "number", min: 0 },
      qualityCheck: { required: true, enum: ["Pass", "Fail", "Partial", "Pending"] },
      damageReport: { required: true, type: "boolean" },
      receiptStatus: { required: true, enum: ["Received", "Inspected", "Accepted", "Rejected", "Partial"] }
    },
    successCriteria: "All goods received, inspected, and quality verified",
    nextActions: ["Update inventory"],
    module: "Purchase",
    subModule: "Goods Receipt Management"
  },
  {
    id: 14,
    name: "Purchase Invoice Management",
    path: "/purchase-invoices",
    icon: "fas fa-receipt",
    color: "text-red-500",
    description: "Process, validate, and manage supplier invoices and payments",
    estimatedDuration: 1,
    requiredFields: ["invoiceNumber", "supplierDetails", "invoiceDate", "lineItems", "totalAmount", "paymentStatus"],
    dependencies: [13],
    validationRules: {
      invoiceNumber: { required: true, minLength: 3 },
      supplierDetails: { required: true, type: "object" },
      invoiceDate: { required: true, type: "date" },
      lineItems: { required: true, minItems: 1 },
      totalAmount: { required: true, type: "number", min: 0 },
      paymentStatus: { required: true, enum: ["Pending", "Approved", "Paid", "Overdue", "Disputed"] }
    },
    successCriteria: "Purchase invoice processed, approved, and payment scheduled",
    nextActions: ["Complete purchase cycle"],
    module: "Purchase",
    subModule: "Purchase Invoice Management",
    requiresApproval: true,
    approvalLevel: "Finance"
  }
];

// INVENTORY MANAGEMENT MODULE
export const INVENTORY_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 15,
    name: "Inventory Items Management",
    path: "/inventory-items",
    icon: "fas fa-boxes",
    color: "text-gray-600",
    description: "Manage inventory items, SKUs, and product catalog",
    estimatedDuration: 1,
    requiredFields: ["itemCode", "itemName", "description", "category", "unitOfMeasure", "reorderLevel", "maxStock"],
    dependencies: [],
    validationRules: {
      itemCode: { required: true, minLength: 3 },
      itemName: { required: true, minLength: 2 },
      description: { required: true, minLength: 10 },
      category: { required: true, enum: ["Raw Materials", "Finished Goods", "Consumables", "Equipment", "Services"] },
      unitOfMeasure: { required: true, enum: ["PCS", "KG", "L", "M", "BOX", "SET"] },
      reorderLevel: { required: true, type: "number", min: 0 },
      maxStock: { required: true, type: "number", min: 0 }
    },
    successCriteria: "Inventory items created with complete specifications and stock levels",
    nextActions: ["Set up delivery and picking"],
    module: "Inventory",
    subModule: "Inventory Items Management"
  },
  {
    id: 16,
    name: "Delivery & Picking Management",
    path: "/delivery-picking",
    icon: "fas fa-hand-holding-box",
    color: "text-blue-500",
    description: "Manage delivery schedules, picking lists, and fulfillment operations",
    estimatedDuration: 1,
    requiredFields: ["pickingListNumber", "deliverySchedule", "pickedItems", "pickingStatus", "deliveryRoute", "pickingNotes"],
    dependencies: [15],
    validationRules: {
      pickingListNumber: { required: true, pattern: "^PL-\\d{4}-\\d{3}$" },
      deliverySchedule: { required: true, type: "date" },
      pickedItems: { required: true, minItems: 1 },
      pickingStatus: { required: true, enum: ["Pending", "In Progress", "Completed", "Partial", "Cancelled"] },
      deliveryRoute: { required: true, type: "object" },
      pickingNotes: { required: false, type: "string" }
    },
    successCriteria: "Picking list created and items picked for delivery",
    nextActions: ["Update inventory levels"],
    module: "Inventory",
    subModule: "Delivery & Picking Management"
  },
  {
    id: 17,
    name: "Inventory Management",
    path: "/inventory-management",
    icon: "fas fa-warehouse",
    color: "text-gray-600",
    description: "Comprehensive inventory control, tracking, and optimization",
    estimatedDuration: 1,
    requiredFields: ["currentStock", "reservedStock", "availableStock", "stockMovements", "inventoryValuation", "stockAlerts"],
    dependencies: [16],
    validationRules: {
      currentStock: { required: true, type: "object" },
      reservedStock: { required: true, type: "object" },
      availableStock: { required: true, type: "object" },
      stockMovements: { required: true, type: "array" },
      inventoryValuation: { required: true, type: "number", min: 0 },
      stockAlerts: { required: true, type: "array" }
    },
    successCriteria: "Inventory levels updated and stock movements tracked",
    nextActions: ["Process material requests"],
    module: "Inventory",
    subModule: "Inventory Management"
  },
  {
    id: 18,
    name: "Material Requests Management",
    path: "/material-requests",
    icon: "fas fa-clipboard-check",
    color: "text-purple-500",
    description: "Process internal material requests and allocations",
    estimatedDuration: 1,
    requiredFields: ["requestNumber", "requestedBy", "requestedItems", "quantity", "urgency", "approvalStatus", "allocationStatus"],
    dependencies: [17],
    validationRules: {
      requestNumber: { required: true, pattern: "^MR-\\d{4}-\\d{3}$" },
      requestedBy: { required: true, minLength: 2 },
      requestedItems: { required: true, minItems: 1 },
      quantity: { required: true, type: "number", min: 1 },
      urgency: { required: true, enum: ["Low", "Medium", "High", "Urgent"] },
      approvalStatus: { required: true, enum: ["Pending", "Approved", "Rejected"] },
      allocationStatus: { required: true, enum: ["Pending", "Allocated", "Issued", "Cancelled"] }
    },
    successCriteria: "Material request processed and items allocated",
    nextActions: ["Process inventory receipts"],
    module: "Inventory",
    subModule: "Material Requests Management",
    requiresApproval: true,
    approvalLevel: "Manager"
  },
  {
    id: 19,
    name: "Inventory Receipts Management",
    path: "/inventory-receipts",
    icon: "fas fa-arrow-down",
    color: "text-green-500",
    description: "Process incoming inventory receipts and stock updates",
    estimatedDuration: 1,
    requiredFields: ["receiptNumber", "receivedItems", "quantityReceived", "receiptDate", "supplierDetails", "qualityStatus"],
    dependencies: [18],
    validationRules: {
      receiptNumber: { required: true, pattern: "^IR-\\d{4}-\\d{3}$" },
      receivedItems: { required: true, minItems: 1 },
      quantityReceived: { required: true, type: "number", min: 0 },
      receiptDate: { required: true, type: "date" },
      supplierDetails: { required: true, type: "object" },
      qualityStatus: { required: true, enum: ["Pass", "Fail", "Pending", "Partial"] }
    },
    successCriteria: "Inventory receipts processed and stock levels updated",
    nextActions: ["Process stock issues"],
    module: "Inventory",
    subModule: "Inventory Receipts Management"
  },
  {
    id: 20,
    name: "Stock Issues Management",
    path: "/stock-issues",
    icon: "fas fa-arrow-up",
    color: "text-red-500",
    description: "Process stock issues, allocations, and outbound movements",
    estimatedDuration: 1,
    requiredFields: ["issueNumber", "issuedItems", "quantityIssued", "issueDate", "issuedTo", "issueReason", "issueStatus"],
    dependencies: [19],
    validationRules: {
      issueNumber: { required: true, pattern: "^SI-\\d{4}-\\d{3}$" },
      issuedItems: { required: true, minItems: 1 },
      quantityIssued: { required: true, type: "number", min: 0 },
      issueDate: { required: true, type: "date" },
      issuedTo: { required: true, minLength: 2 },
      issueReason: { required: true, enum: ["Sales", "Internal Use", "Maintenance", "Return", "Disposal"] },
      issueStatus: { required: true, enum: ["Pending", "Approved", "Issued", "Cancelled"] }
    },
    successCriteria: "Stock issues processed and inventory levels updated",
    nextActions: ["Process returns receipt"],
    module: "Inventory",
    subModule: "Stock Issues Management",
    requiresApproval: true,
    approvalLevel: "Manager"
  },
  {
    id: 21,
    name: "Returns Receipt Management",
    path: "/returns-receipt",
    icon: "fas fa-undo",
    color: "text-orange-500",
    description: "Process returned items, quality checks, and inventory updates",
    estimatedDuration: 1,
    requiredFields: ["returnNumber", "returnedItems", "returnReason", "returnDate", "qualityCheck", "disposition", "returnStatus"],
    dependencies: [20],
    validationRules: {
      returnNumber: { required: true, pattern: "^RT-\\d{4}-\\d{3}$" },
      returnedItems: { required: true, minItems: 1 },
      returnReason: { required: true, enum: ["Defective", "Wrong Item", "Customer Return", "Overstock", "Expired"] },
      returnDate: { required: true, type: "date" },
      qualityCheck: { required: true, enum: ["Pass", "Fail", "Pending"] },
      disposition: { required: true, enum: ["Restock", "Repair", "Dispose", "Return to Supplier"] },
      returnStatus: { required: true, enum: ["Received", "Inspected", "Processed", "Completed"] }
    },
    successCriteria: "Returns processed and inventory disposition completed",
    nextActions: ["Process stock transfers"],
    module: "Inventory",
    subModule: "Returns Receipt Management"
  },
  {
    id: 22,
    name: "Transfer Stocks Management",
    path: "/transfer-stocks",
    icon: "fas fa-exchange-alt",
    color: "text-cyan-500",
    description: "Manage stock transfers between locations and warehouses",
    estimatedDuration: 1,
    requiredFields: ["transferNumber", "transferItems", "fromLocation", "toLocation", "transferDate", "transferReason", "transferStatus"],
    dependencies: [21],
    validationRules: {
      transferNumber: { required: true, pattern: "^TS-\\d{4}-\\d{3}$" },
      transferItems: { required: true, minItems: 1 },
      fromLocation: { required: true, minLength: 2 },
      toLocation: { required: true, minLength: 2 },
      transferDate: { required: true, type: "date" },
      transferReason: { required: true, enum: ["Reallocation", "Emergency", "Seasonal", "Maintenance", "Consolidation"] },
      transferStatus: { required: true, enum: ["Pending", "In Transit", "Received", "Completed", "Cancelled"] }
    },
    successCriteria: "Stock transfer completed and inventory levels updated",
    nextActions: ["Conduct physical stock count"],
    module: "Inventory",
    subModule: "Transfer Stocks Management",
    requiresApproval: true,
    approvalLevel: "Manager"
  },
  {
    id: 23,
    name: "Physical Stock Management",
    path: "/physical-stock",
    icon: "fas fa-clipboard-list",
    color: "text-indigo-500",
    description: "Conduct physical stock counts, reconciliation, and adjustments",
    estimatedDuration: 2,
    requiredFields: ["countNumber", "countDate", "countedItems", "actualQuantity", "systemQuantity", "variance", "adjustmentStatus"],
    dependencies: [22],
    validationRules: {
      countNumber: { required: true, pattern: "^PS-\\d{4}-\\d{3}$" },
      countDate: { required: true, type: "date" },
      countedItems: { required: true, minItems: 1 },
      actualQuantity: { required: true, type: "object" },
      systemQuantity: { required: true, type: "object" },
      variance: { required: true, type: "object" },
      adjustmentStatus: { required: true, enum: ["Pending", "Approved", "Adjusted", "Completed"] }
    },
    successCriteria: "Physical stock count completed and inventory reconciled",
    nextActions: ["Complete inventory cycle"],
    module: "Inventory",
    subModule: "Physical Stock Management",
    requiresApproval: true,
    approvalLevel: "Director"
  }
];

// Combined workflow steps
export const ENHANCED_WORKFLOW_STEPS: WorkflowStep[] = [
  ...SALES_WORKFLOW_STEPS,
  ...PURCHASE_WORKFLOW_STEPS,
  ...INVENTORY_WORKFLOW_STEPS
];

// Module configurations
export const WORKFLOW_MODULES = {
  SALES: {
    name: "Sales Management",
    color: "text-blue-600",
    icon: "fas fa-chart-line",
    steps: SALES_WORKFLOW_STEPS,
    description: "End-to-end sales process from customer enquiry to invoicing"
  },
  PURCHASE: {
    name: "Purchase Management", 
    color: "text-indigo-600",
    icon: "fas fa-shopping-cart",
    steps: PURCHASE_WORKFLOW_STEPS,
    description: "Complete procurement process from requisition to payment"
  },
  INVENTORY: {
    name: "Inventory Management",
    color: "text-gray-600", 
    icon: "fas fa-warehouse",
    steps: INVENTORY_WORKFLOW_STEPS,
    description: "Comprehensive inventory control and stock management"
  }
} as const;

// Workflow status types
export const WORKFLOW_STATUSES = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress", 
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  ON_HOLD: "On Hold",
  REQUIRES_APPROVAL: "Requires Approval"
} as const;

// Approval levels
export const APPROVAL_LEVELS = {
  MANAGER: "Manager",
  DIRECTOR: "Director", 
  FINANCE: "Finance"
} as const;

// Step status types
export type StepStatus = "pending" | "in_progress" | "completed" | "cancelled" | "on_hold" | "requires_approval";

// Workflow progress interface
export interface WorkflowProgress {
  id: string;
  entityId: string;
  entityType: string;
  currentStep: number;
  completedSteps: number[];
  status: StepStatus;
  progress: number; // percentage
  lastUpdated: string;
  module: 'Sales' | 'Purchase' | 'Inventory';
  subModule?: string;
  estimatedCompletion?: string;
  actualCompletion?: string;
  notes?: string;
  assignedTo?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
}

// Helper functions
export const getStepById = (stepId: number): WorkflowStep | undefined => {
  return ENHANCED_WORKFLOW_STEPS.find(step => step.id === stepId);
};

export const getStepsByModule = (module: 'Sales' | 'Purchase' | 'Inventory'): WorkflowStep[] => {
  return ENHANCED_WORKFLOW_STEPS.filter(step => step.module === module);
};

export const getNextSteps = (currentStepId: number): WorkflowStep[] => {
  const currentStep = getStepById(currentStepId);
  if (!currentStep) return [];
  
  return ENHANCED_WORKFLOW_STEPS.filter(step => 
    step.dependencies.includes(currentStepId) || 
    (step.dependencies.length === 0 && step.id > currentStepId)
  );
};

export const calculateProgress = (completedSteps: number[], totalSteps: number): number => {
  return Math.round((completedSteps.length / totalSteps) * 100);
};

export const getModuleColor = (module: 'Sales' | 'Purchase' | 'Inventory'): string => {
  return WORKFLOW_MODULES[module].color;
};

export const getModuleIcon = (module: 'Sales' | 'Purchase' | 'Inventory'): string => {
  return WORKFLOW_MODULES[module].icon;
};
