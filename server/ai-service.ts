import { storage } from "./storage";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
}

interface PageContext {
  currentPage?: string;
  userRole?: string;
  recentActivity?: any[];
}

// ERP-specific AI responses and logic
export async function generateAIResponse(
  message: string, 
  context: Message[] = [], 
  pageContext?: PageContext
): Promise<{ response: string; suggestions: string[] }> {
  const lowerMessage = message.toLowerCase();
  
  try {
    // Analyze the message and provide contextual responses
    if (containsKeywords(lowerMessage, ['enquiry', 'enquiries', 'inquiry', 'inquiries'])) {
      return await handleEnquiryQuestions(lowerMessage, pageContext);
    }
    
    if (containsKeywords(lowerMessage, ['quotation', 'quote', 'pricing'])) {
      return await handleQuotationQuestions(lowerMessage, pageContext);
    }
    
    if (containsKeywords(lowerMessage, ['inventory', 'stock', 'items', 'products'])) {
      return await handleInventoryQuestions(lowerMessage, pageContext);
    }
    
    if (containsKeywords(lowerMessage, ['customer', 'client'])) {
      return await handleCustomerQuestions(lowerMessage, pageContext);
    }
    
    if (containsKeywords(lowerMessage, ['sales', 'order', 'purchase'])) {
      return await handleSalesQuestions(lowerMessage, pageContext);
    }
    
    if (containsKeywords(lowerMessage, ['report', 'analytics', 'dashboard'])) {
      return await handleReportingQuestions(lowerMessage, pageContext);
    }
    
    if (containsKeywords(lowerMessage, ['help', 'how', 'what', 'guide'])) {
      return await handleHelpQuestions(lowerMessage, pageContext);
    }
    
    // Default response with general suggestions
    return {
      response: "I'm here to help with your ERP needs! I can assist you with enquiries, quotations, inventory management, customer information, sales orders, and reporting. What would you like to know more about?",
      suggestions: [
        "Show me recent enquiries",
        "Help me create a quotation",
        "Check inventory levels",
        "Customer management tips",
        "Sales order status",
        "Generate reports"
      ]
    };
    
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      response: "I apologize, but I'm having trouble processing your request right now. Please try asking your question in a different way.",
      suggestions: [
        "Ask about enquiries",
        "Get help with quotations",
        "Check inventory",
        "View dashboard"
      ]
    };
  }
}

async function handleEnquiryQuestions(message: string, pageContext?: PageContext) {
  try {
    const stats = await storage.getDashboardStats();
    
    if (containsKeywords(message, ['recent', 'latest', 'new'])) {
      const enquiries = await storage.getEnquiries(5, 0);
      
      return {
        response: `I found ${enquiries.length} recent enquiries in the system:\n\n${
          enquiries.map((e, i) => 
            `${i + 1}. #${e.enquiryNumber} - Status: ${e.status} - ${e.enquiryDate ? new Date(e.enquiryDate).toLocaleDateString() : 'No date'}`
          ).join('\n')
        }\n\nWould you like me to help you with any specific enquiry or create a new one?`,
        suggestions: [
          "Create new enquiry",
          "Show enquiry details",
          "Filter by customer",
          "Check enquiry status"
        ]
      };
    }
    
    if (containsKeywords(message, ['create', 'new', 'add'])) {
      return {
        response: "I can help you create a new enquiry! Here's what you'll need:\n\n• Customer information\n• Enquiry subject/description\n• Items or services needed\n• Expected delivery date\n• Any special requirements\n\nWould you like me to guide you through the process step by step?",
        suggestions: [
          "Go to enquiry form",
          "Select customer first",
          "Add enquiry items",
          "Set delivery requirements"
        ]
      };
    }
    
    if (containsKeywords(message, ['status', 'progress', 'update'])) {
      return {
        response: `Current enquiry status overview:\n\n• Active Enquiries: ${stats.activeEnquiries || 0}\n• Pending Quotes: ${stats.pendingQuotes || 0}\n• Active Orders: ${stats.activeOrders || 0}\n\nWhich enquiries would you like to review?`,
        suggestions: [
          "Show new enquiries",
          "Review in progress",
          "Check quoted enquiries",
          "Update enquiry status"
        ]
      };
    }
    
  } catch (error) {
    console.error('Error handling enquiry questions:', error);
  }
  
  return {
    response: "I can help you with enquiry management including creating new enquiries, checking status, and reviewing existing ones. What specific aspect would you like assistance with?",
    suggestions: [
      "View all enquiries",
      "Create new enquiry",
      "Search enquiries",
      "Enquiry reports"
    ]
  };
}

async function handleQuotationQuestions(message: string, pageContext?: PageContext) {
  try {
    if (containsKeywords(message, ['create', 'new', 'generate'])) {
      return {
        response: "I can help you create a quotation! The process involves:\n\n1. Select the enquiry or create items manually\n2. Add products/services with quantities\n3. Set pricing (retail/wholesale markups apply automatically)\n4. Review terms and conditions\n5. Generate and send the quotation\n\nDo you have an existing enquiry to quote, or do you want to create a custom quotation?",
        suggestions: [
          "Quote from enquiry",
          "Create custom quotation",
          "Set pricing rules",
          "Review quotation templates"
        ]
      };
    }
    
    if (containsKeywords(message, ['pricing', 'price', 'markup', 'cost'])) {
      return {
        response: "Our pricing system uses automatic markups:\n\n• Retail customers: 70% markup (default)\n• Wholesale customers: 40% markup (default)\n• Custom pricing rules can be set per customer\n• Bulk pricing discounts available\n\nWould you like me to help you configure pricing for specific customers or items?",
        suggestions: [
          "Set customer pricing",
          "Configure markup rules",
          "Apply bulk discounts",
          "Review price lists"
        ]
      };
    }
    
    const quotations = await storage.getQuotations(5, 0);
    
    return {
      response: `You have ${quotations.length} recent quotations in the system:\n\n${
        quotations.map((q, i) => 
          `${i + 1}. #${q.quoteNumber} - ${q.status} - $${q.totalAmount || 0}`
        ).join('\n')
      }\n\nWhat would you like to do with quotations?`,
      suggestions: [
        "Create new quotation",
        "Review pending quotes",
        "Send quotation",
        "Convert to sales order"
      ]
    };
    
  } catch (error) {
    console.error('Error handling quotation questions:', error);
  }
  
  return {
    response: "I can assist with quotation management including creating quotes, setting pricing, and converting to sales orders. How can I help?",
    suggestions: [
      "New quotation",
      "Pricing help",
      "Quotation status",
      "Customer quotes"
    ]
  };
}

async function handleInventoryQuestions(message: string, pageContext?: PageContext) {
  try {
    if (containsKeywords(message, ['levels', 'stock', 'quantity', 'available'])) {
      const items = await storage.getInventoryItems({ limit: 10 });
      
      return {
        response: `Current inventory overview:\n\n• Total items: ${items.length}\n• Active products: ${items.filter(i => i.isActive).length}\n\nRecent inventory items:\n${
          items.slice(0, 5).map((item, i) => 
            `${i + 1}. ${item.description} - Qty: ${item.totalQuantity || 0}`
          ).join('\n')
        }\n\nWould you like to check specific items or update inventory levels?`,
        suggestions: [
          "Search specific item",
          "Update stock levels",
          "Add new items",
          "Check low stock alerts"
        ]
      };
    }
    
    if (containsKeywords(message, ['low', 'shortage', 'reorder', 'alert'])) {
      return {
        response: "I can help you identify items that need restocking:\n\n• Set minimum stock levels\n• Monitor inventory alerts\n• Generate reorder reports\n• Track supplier lead times\n\nWould you like me to show you items with low stock levels?",
        suggestions: [
          "Show low stock items",
          "Set reorder points",
          "Contact suppliers",
          "Generate purchase orders"
        ]
      };
    }
    
    if (containsKeywords(message, ['add', 'new', 'create', 'item'])) {
      return {
        response: "To add new inventory items, you'll need:\n\n• Supplier code and description\n• Category and unit of measure\n• Cost price and supplier information\n• Markup percentages (retail/wholesale)\n• Barcode (optional)\n\nI can guide you through the process. Would you like to start adding a new item?",
        suggestions: [
          "Add new item",
          "Import from supplier",
          "Set item categories",
          "Configure pricing"
        ]
      };
    }
    
  } catch (error) {
    console.error('Error handling inventory questions:', error);
  }
  
  return {
    response: "I can help with inventory management including stock levels, adding new items, and tracking quantities. What specific inventory task can I assist with?",
    suggestions: [
      "Check stock levels",
      "Add new items",
      "Update quantities",
      "Inventory reports"
    ]
  };
}

async function handleCustomerQuestions(message: string, pageContext?: PageContext) {
  try {
    const customers = await storage.getCustomers(5, 0);
    
    if (containsKeywords(message, ['add', 'new', 'create'])) {
      return {
        response: "To add a new customer, I'll need:\n\n• Customer name and contact information\n• Customer type (Retail/Wholesale)\n• Classification (Internal/Corporate/Individual/Family/Ministry)\n• Address and tax ID\n• Credit limit and payment terms\n\nShall I guide you through creating a new customer profile?",
        suggestions: [
          "Create retail customer",
          "Add wholesale customer",
          "Set payment terms",
          "Configure credit limits"
        ]
      };
    }
    
    if (containsKeywords(message, ['list', 'show', 'all', 'view'])) {
      return {
        response: `You have ${customers.length} recent customers in the system:\n\n${
          customers.map((c, i) => 
            `${i + 1}. ${c.name} - ${c.customerType} (${c.classification})`
          ).join('\n')
        }\n\nWould you like to view details for any specific customer?`,
        suggestions: [
          "Search customers",
          "Filter by type",
          "Customer details",
          "Update customer info"
        ]
      };
    }
    
  } catch (error) {
    console.error('Error handling customer questions:', error);
  }
  
  return {
    response: "I can help with customer management including adding new customers, updating information, and setting up payment terms. What would you like to do?",
    suggestions: [
      "Add new customer",
      "View all customers",
      "Search customers",
      "Customer reports"
    ]
  };
}

async function handleSalesQuestions(message: string, pageContext?: PageContext) {
  try {
    if (containsKeywords(message, ['order', 'sales', 'purchase'])) {
      const salesOrders = await storage.getSalesOrders(5, 0);
      
      return {
        response: `Sales order overview:\n\n• Total recent orders: ${salesOrders.length}\n\nRecent sales orders:\n${
          salesOrders.map((so, i) => 
            `${i + 1}. Order #${so.orderNumber} - ${so.status} ($${so.totalAmount})`
          ).join('\n')
        }\n\nWhat would you like to do with sales orders?`,
        suggestions: [
          "Create new order",
          "Update order status",
          "Process delivery",
          "Generate invoice"
        ]
      };
    }
    
  } catch (error) {
    console.error('Error handling sales questions:', error);
  }
  
  return {
    response: "I can assist with sales order management, purchase orders, and delivery coordination. How can I help?",
    suggestions: [
      "View sales orders",
      "Create purchase order",
      "Track deliveries",
      "Sales reports"
    ]
  };
}

async function handleReportingQuestions(message: string, pageContext?: PageContext) {
  try {
    const stats = await storage.getDashboardStats();
    
    return {
      response: `Here's your current business overview:\n\n📊 **Dashboard Summary:**\n• Active Enquiries: ${stats.activeEnquiries || 0}\n• Pending Quotes: ${stats.pendingQuotes || 0}\n• Active Orders: ${stats.activeOrders || 0}\n• Monthly Revenue: $${stats.monthlyRevenue || 0}\n\nWhich specific reports would you like to generate?`,
      suggestions: [
        "Sales performance report",
        "Inventory analysis",
        "Customer activity report",
        "Revenue analytics"
      ]
    };
    
  } catch (error) {
    console.error('Error handling reporting questions:', error);
  }
  
  return {
    response: "I can help you generate various reports including sales, inventory, customer analytics, and financial summaries. What type of report do you need?",
    suggestions: [
      "Sales reports",
      "Inventory reports",
      "Customer analytics",
      "Financial summary"
    ]
  };
}

async function handleHelpQuestions(message: string, pageContext?: PageContext) {
  const currentPage = pageContext?.currentPage;
  
  if (currentPage) {
    const pageHelp = getPageSpecificHelp(currentPage);
    if (pageHelp) {
      return pageHelp;
    }
  }
  
  return {
    response: "I'm here to help you navigate the ERP system! Here are the main areas I can assist with:\n\n🔍 **Enquiry Management** - Create and track customer enquiries\n💰 **Quotations** - Generate quotes with automatic pricing\n📦 **Inventory** - Manage stock levels and items\n👥 **Customers** - Customer profiles and management\n📋 **Sales Orders** - Process and track orders\n📊 **Reports** - Generate business insights\n\nWhat would you like to learn more about?",
    suggestions: [
      "How to create an enquiry",
      "Quotation process guide",
      "Inventory management tips",
      "Customer setup help"
    ]
  };
}

function getPageSpecificHelp(page: string) {
  const helpMap: Record<string, { response: string; suggestions: string[] }> = {
    '/enquiries': {
      response: "On the Enquiries page, you can:\n\n• View all customer enquiries\n• Create new enquiries\n• Filter by status, customer, or date\n• Convert enquiries to quotations\n• Track enquiry progress\n\nClick 'New Enquiry' to start or use the filters to find specific enquiries.",
      suggestions: [
        "Create new enquiry",
        "Filter enquiries",
        "Convert to quotation",
        "Update enquiry status"
      ]
    },
    '/quotations': {
      response: "On the Quotations page, you can:\n\n• View all quotations\n• Create new quotes from enquiries\n• Send quotations to customers\n• Track approval status\n• Convert accepted quotes to sales orders\n\nUse 'New Quotation' to start or click on existing quotes to edit.",
      suggestions: [
        "Create new quotation",
        "Send to customer",
        "Check approval status",
        "Convert to sales order"
      ]
    },
    '/inventory': {
      response: "On the Inventory page, you can:\n\n• View all inventory items\n• Check stock levels\n• Add new items\n• Update quantities\n• Manage item categories\n\nUse the search and filters to find specific items quickly.",
      suggestions: [
        "Add new item",
        "Update stock levels",
        "Search items",
        "Set categories"
      ]
    }
  };
  
  return helpMap[page];
}

export function getContextualSuggestions(page: string): string[] {
  const suggestionMap: Record<string, string[]> = {
    '/dashboard': [
      "Show me today's summary",
      "Recent enquiries",
      "Pending quotations",
      "Low stock alerts"
    ],
    '/enquiries': [
      "Create new enquiry",
      "Show recent enquiries",
      "Filter by customer",
      "Convert to quotation"
    ],
    '/quotations': [
      "Create new quotation",
      "Pending approvals",
      "Send quotation",
      "Pricing help"
    ],
    '/inventory': [
      "Check stock levels",
      "Add new item",
      "Low stock report",
      "Update quantities"
    ],
    '/customers': [
      "Add new customer",
      "Customer activity",
      "Payment terms",
      "Credit limits"
    ],
    '/sales-orders': [
      "Create sales order",
      "Order status",
      "Delivery tracking",
      "Generate invoice"
    ]
  };
  
  return suggestionMap[page] || [
    "How can I help?",
    "Show dashboard",
    "Recent activity",
    "System overview"
  ];
}

function containsKeywords(text: string, keywords: string[]): boolean {
  return keywords.some(keyword => text.includes(keyword));
}
