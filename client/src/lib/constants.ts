export const WORKFLOW_STEPS = [
  { 
    id: 1, 
    name: "Customer", 
    path: "/customers", 
    icon: "fas fa-user", 
    color: "text-blue-700",
    description: "Create and manage customer information",
    estimatedDuration: 1, // days
    requiredFields: ["customerName", "contactInfo", "customerType", "classification"],
    dependencies: [],
    validationRules: {
      customerName: { required: true, minLength: 2 },
      contactInfo: { required: true, type: "email" },
      customerType: { required: true, enum: ["Retail", "Wholesale"] },
      classification: { required: true, enum: ["Internal", "Corporate", "Individual", "Family", "Ministry"] }
    },
    successCriteria: "Customer profile created with complete information",
    nextActions: ["Create enquiry for customer"]
  },
  { 
    id: 2, 
    name: "Enquiry", 
    path: "/enquiries", 
    icon: "fas fa-question-circle", 
    color: "text-amber-500",
    description: "Process customer enquiry and requirements",
    estimatedDuration: 2,
    requiredFields: ["enquiryDetails", "productRequirements", "quantity", "urgency", "source"],
    dependencies: [1], // Requires Customer step
    validationRules: {
      enquiryDetails: { required: true, minLength: 10 },
      productRequirements: { required: true, minLength: 5 },
      quantity: { required: true, type: "number", min: 1 },
      urgency: { required: true, enum: ["Low", "Medium", "High", "Urgent"] },
      source: { required: true, enum: ["Email", "Phone", "Web Form", "Walk-in"] }
    },
    successCriteria: "Enquiry details captured and status set to 'In Progress'",
    nextActions: ["Generate quotation"]
  },
  { 
    id: 3, 
    name: "Quotation", 
    path: "/quotations", 
    icon: "fas fa-file-alt", 
    color: "text-blue-500",
    description: "Generate and send quotation to customer",
    estimatedDuration: 1,
    requiredFields: ["quotationNumber", "lineItems", "pricing", "validityPeriod", "termsAndConditions"],
    dependencies: [2], // Requires Enquiry step
    validationRules: {
      quotationNumber: { required: true, pattern: "^QT-\\d{4}-\\d{3}$" },
      lineItems: { required: true, minItems: 1 },
      pricing: { required: true, type: "object" },
      validityPeriod: { required: true, type: "number", min: 1 },
      termsAndConditions: { required: true, minLength: 20 }
    },
    successCriteria: "Quotation generated and sent to customer",
    nextActions: ["Wait for customer acceptance"]
  },
  { 
    id: 4, 
    name: "Acceptance", 
    path: "/customer-acceptance", 
    icon: "fas fa-check-circle", 
    color: "text-green-500",
    description: "Customer accepts quotation and provides purchase order",
    estimatedDuration: 3,
    requiredFields: ["acceptanceDate", "customerPO", "acceptedTerms", "deliveryRequirements"],
    dependencies: [3], // Requires Quotation step
    validationRules: {
      acceptanceDate: { required: true, type: "date" },
      customerPO: { required: true, minLength: 5 },
      acceptedTerms: { required: true, type: "boolean" },
      deliveryRequirements: { required: true, minLength: 10 }
    },
    successCriteria: "Customer acceptance received with valid PO",
    nextActions: ["Create sales order"]
  },
  { 
    id: 5, 
    name: "Customer PO Upload", 
    path: "/customer-po-upload", 
    icon: "fas fa-upload", 
    color: "text-purple-500",
    description: "Upload and process customer purchase order",
    estimatedDuration: 1,
    requiredFields: ["poDocument", "poNumber", "poDate", "poAmount", "poTerms"],
    dependencies: [4], // Requires Acceptance step
    validationRules: {
      poDocument: { required: true, type: "file" },
      poNumber: { required: true, minLength: 3 },
      poDate: { required: true, type: "date" },
      poAmount: { required: true, type: "number", min: 0 },
      poTerms: { required: true, minLength: 5 }
    },
    successCriteria: "Customer PO uploaded and validated",
    nextActions: ["Generate sales order"]
  },
  { 
    id: 6, 
    name: "Sales Order", 
    path: "/sales-orders", 
    icon: "fas fa-shopping-cart", 
    color: "text-green-600",
    description: "Create internal sales order based on customer PO",
    estimatedDuration: 1,
    requiredFields: ["salesOrderNumber", "orderItems", "totalAmount", "deliveryDate", "paymentTerms"],
    dependencies: [5], // Requires Customer PO Upload step
    validationRules: {
      salesOrderNumber: { required: true, pattern: "^SO-\\d{4}-\\d{3}$" },
      orderItems: { required: true, minItems: 1 },
      totalAmount: { required: true, type: "number", min: 0 },
      deliveryDate: { required: true, type: "date" },
      paymentTerms: { required: true, enum: ["Net 30", "Net 15", "COD", "Prepaid"] }
    },
    successCriteria: "Sales order created and approved",
    nextActions: ["Generate supplier LPO"]
  },
  { 
    id: 7, 
    name: "Supplier LPO", 
    path: "/supplier-lpo", 
    icon: "fas fa-truck", 
    color: "text-indigo-500",
    description: "Create and send LPO to selected supplier",
    estimatedDuration: 1,
    requiredFields: ["lpoNumber", "supplierDetails", "orderItems", "deliveryInstructions", "paymentTerms"],
    dependencies: [6], // Requires Sales Order step
    validationRules: {
      lpoNumber: { required: true, pattern: "^LPO-\\d{4}-\\d{3}$" },
      supplierDetails: { required: true, type: "object" },
      orderItems: { required: true, minItems: 1 },
      deliveryInstructions: { required: true, minLength: 10 },
      paymentTerms: { required: true, enum: ["Net 30", "Net 15", "COD", "Prepaid"] }
    },
    successCriteria: "LPO sent to supplier and acknowledged",
    nextActions: ["Track goods receipt"]
  },
  { 
    id: 8, 
    name: "Goods Receipt", 
    path: "/goods-receipt", 
    icon: "fas fa-box-open", 
    color: "text-orange-500",
    description: "Receive and verify goods from supplier",
    estimatedDuration: 2,
    requiredFields: ["receiptDate", "receivedItems", "quantityReceived", "qualityCheck", "damageReport"],
    dependencies: [7], // Requires Supplier LPO step
    validationRules: {
      receiptDate: { required: true, type: "date" },
      receivedItems: { required: true, minItems: 1 },
      quantityReceived: { required: true, type: "number", min: 0 },
      qualityCheck: { required: true, enum: ["Pass", "Fail", "Partial"] },
      damageReport: { required: true, type: "boolean" }
    },
    successCriteria: "All goods received and quality verified",
    nextActions: ["Update inventory"]
  },
  { 
    id: 9, 
    name: "Inventory", 
    path: "/inventory", 
    icon: "fas fa-warehouse", 
    color: "text-gray-600",
    description: "Update inventory with received goods",
    estimatedDuration: 1,
    requiredFields: ["inventoryUpdate", "locationAssignment", "stockLevels", "barcodeAssignment"],
    dependencies: [8], // Requires Goods Receipt step
    validationRules: {
      inventoryUpdate: { required: true, type: "object" },
      locationAssignment: { required: true, minLength: 3 },
      stockLevels: { required: true, type: "object" },
      barcodeAssignment: { required: true, type: "boolean" }
    },
    successCriteria: "Inventory updated with all received items",
    nextActions: ["Prepare for delivery"]
  },
  { 
    id: 10, 
    name: "Delivery Note", 
    path: "/delivery-note", 
    icon: "fas fa-truck-moving", 
    color: "text-blue-600",
    description: "Create delivery note and arrange shipment",
    estimatedDuration: 1,
    requiredFields: ["deliveryNoteNumber", "deliveryAddress", "deliveryDate", "carrierDetails", "trackingNumber"],
    dependencies: [9], // Requires Inventory step
    validationRules: {
      deliveryNoteNumber: { required: true, pattern: "^DN-\\d{4}-\\d{3}$" },
      deliveryAddress: { required: true, minLength: 10 },
      deliveryDate: { required: true, type: "date" },
      carrierDetails: { required: true, type: "object" },
      trackingNumber: { required: true, minLength: 5 }
    },
    successCriteria: "Delivery note created and goods dispatched",
    nextActions: ["Generate invoice"]
  },
  { 
    id: 11, 
    name: "Invoice", 
    path: "/invoicing", 
    icon: "fas fa-file-invoice", 
    color: "text-green-600",
    description: "Generate and send invoice to customer",
    estimatedDuration: 1,
    requiredFields: ["invoiceNumber", "invoiceDate", "lineItems", "totalAmount", "paymentInstructions"],
    dependencies: [10], // Requires Delivery Note step
    validationRules: {
      invoiceNumber: { required: true, pattern: "^INV-\\d{4}-\\d{3}$" },
      invoiceDate: { required: true, type: "date" },
      lineItems: { required: true, minItems: 1 },
      totalAmount: { required: true, type: "number", min: 0 },
      paymentInstructions: { required: true, minLength: 10 }
    },
    successCriteria: "Invoice generated and sent to customer",
    nextActions: ["Track payment and close order"]
  },
] as const;

export const CUSTOMER_TYPES = ["Retail", "Wholesale"] as const;
export const CUSTOMER_CLASSIFICATIONS = ["Internal", "Corporate", "Individual", "Family", "Ministry"] as const;
export const ENQUIRY_SOURCES = ["Email", "Phone", "Web Form", "Walk-in"] as const;
export const ENQUIRY_STATUSES = ["New", "In Progress", "Quoted", "Closed"] as const;
export const QUOTATION_STATUSES = ["Draft", "Sent", "Accepted", "Rejected", "Expired"] as const;

export const PRICING_CONFIG = {
  RETAIL_MARKUP: 70,
  WHOLESALE_MARKUP: 40,
} as const;
