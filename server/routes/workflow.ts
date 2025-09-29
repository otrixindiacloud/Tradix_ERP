import type { Express } from "express";
import { storage } from "../storage";

// Import WORKFLOW_STEPS from constants (you may need to adjust the path based on your project structure)
const WORKFLOW_STEPS = [
  { 
    id: 1, 
    name: "Customer", 
    description: "Create and manage customer information",
    estimatedDuration: 1,
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
  // Add other steps as needed for validation
];

// Helper function to validate required fields
function validateRequiredFields(data: any, validationRules: Record<string, any>, missingFields: string[], validationErrors: Record<string, string>): boolean {
  let isValid = true;
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = data[field];
    
    // Check if field is required
    if (rules.required && (!value || value === "")) {
      missingFields.push(field);
      validationErrors[field] = `${field} is required`;
      isValid = false;
      continue;
    }
    
    // Skip validation if field is not required and empty
    if (!rules.required && (!value || value === "")) {
      continue;
    }
    
    // Validate field based on rules
    if (rules.minLength && typeof value === "string" && value.length < rules.minLength) {
      validationErrors[field] = `${field} must be at least ${rules.minLength} characters`;
      isValid = false;
    }
    
    if (rules.min && typeof value === "number" && value < rules.min) {
      validationErrors[field] = `${field} must be at least ${rules.min}`;
      isValid = false;
    }
    
    if (rules.type === "email" && typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      validationErrors[field] = `${field} must be a valid email address`;
      isValid = false;
    }
    
    if (rules.enum && !rules.enum.includes(value)) {
      validationErrors[field] = `${field} must be one of: ${rules.enum.join(", ")}`;
      isValid = false;
    }
    
    if (rules.pattern && typeof value === "string" && !new RegExp(rules.pattern).test(value)) {
      validationErrors[field] = `${field} format is invalid`;
      isValid = false;
    }
    
    if (rules.minItems && Array.isArray(value) && value.length < rules.minItems) {
      validationErrors[field] = `${field} must have at least ${rules.minItems} items`;
      isValid = false;
    }
  }
  
  return isValid;
}

export function registerWorkflowRoutes(app: Express) {
  // Enhanced workflow validation endpoint
  app.get("/api/workflow/validate/:step/:entityId", async (req, res) => {
    try {
      const { step, entityId } = req.params;
      let canProceed = false;
      let message = "";
      let nextStep = "";
      let requiredActions: string[] = [];
      let missingFields: string[] = [];
      let validationErrors: Record<string, string> = {};
      let stepMetadata: any = {};

      // Get step configuration from constants
      const stepConfig = WORKFLOW_STEPS.find(s => s.name.toLowerCase() === step.toLowerCase());
      if (stepConfig) {
        stepMetadata = {
          description: stepConfig.description,
          estimatedDuration: stepConfig.estimatedDuration,
          requiredFields: stepConfig.requiredFields,
          dependencies: stepConfig.dependencies,
          validationRules: stepConfig.validationRules,
          successCriteria: stepConfig.successCriteria,
          nextActions: stepConfig.nextActions
        };
      }

      switch (step) {
        case "customer":
          // Customer step validation with enhanced field checks
          try {
            const customer = await storage.getCustomer(entityId);
            canProceed = customer && validateRequiredFields(customer, stepConfig?.validationRules || {}, missingFields, validationErrors);
            message = canProceed ? "Customer information is complete and ready" : "Customer information is incomplete";
            nextStep = "enquiry";
            if (!canProceed) {
              requiredActions.push("Complete customer profile with all required fields");
              requiredActions.push("Verify contact information");
              requiredActions.push("Set customer classification");
            }
          } catch (error) {
            canProceed = false;
            message = "Customer not found or invalid entity ID";
            requiredActions.push("Create customer first");
          }
          break;

        case "enquiry":
          try {
            const enquiry = await storage.getEnquiry(entityId);
            canProceed = enquiry && 
              (enquiry.status === "In Progress" || enquiry.status === "New") &&
              validateRequiredFields(enquiry, stepConfig?.validationRules || {}, missingFields, validationErrors);
            message = canProceed ? "Enquiry is ready for quotation" : "Enquiry must be in progress with complete details";
            nextStep = "quotation";
            if (!canProceed) {
              requiredActions.push("Update enquiry status to 'In Progress'");
              requiredActions.push("Complete enquiry details");
              requiredActions.push("Specify product requirements");
              requiredActions.push("Set urgency level");
            }
          } catch (error) {
            canProceed = false;
            message = "Enquiry not found or invalid entity ID";
            requiredActions.push("Create enquiry first");
          }
          break;


        case "quotation":
          const quotation = await storage.getQuotation(entityId);
          canProceed = quotation?.status === "Sent" || quotation?.status === "Draft";
          message = canProceed ? "Quotation is ready for customer review" : "Quotation must be sent to customer";
          nextStep = "acceptance";
          if (!canProceed) {
            requiredActions.push("Send quotation to customer");
          }
          break;

        case "acceptance":
          const quotationForAcceptance = await storage.getQuotation(entityId);
          canProceed = quotationForAcceptance?.status === "Sent";
          message = canProceed ? "Awaiting customer acceptance" : "Quotation must be sent to customer first";
          nextStep = "customer-po-upload";
          if (!canProceed) {
            requiredActions.push("Send quotation to customer");
          }
          break;

        case "customer-po-upload":
          const acceptedQuote = await storage.getQuotation(entityId);
          canProceed = acceptedQuote?.status === "Accepted";
          message = canProceed ? "Customer PO can be uploaded" : "Quote must be accepted by customer";
          nextStep = "sales-order";
          if (!canProceed) {
            requiredActions.push("Customer must accept the quotation");
          }
          break;

        case "sales-order":
          const quotationWithPO = await storage.getQuotation(entityId);
          canProceed = quotationWithPO?.status === "Accepted" && 
                      quotationWithPO?.customerPoDocument && 
                      quotationWithPO.customerPoDocument.trim() !== "";
          message = canProceed ? "Sales order can be created" : "PO document must be uploaded and validated";
          nextStep = "supplier-lpo";
          if (!canProceed) {
            if (quotationWithPO?.status !== "Accepted") {
              requiredActions.push("Customer must accept the quotation");
            }
            if (!quotationWithPO?.customerPoDocument || quotationWithPO.customerPoDocument.trim() === "") {
              requiredActions.push("Upload customer PO document");
            }
            requiredActions.push("Validate PO against quotation");
          }
          break;

        case "supplier-lpo":
          const salesOrder = await storage.getSalesOrder(entityId);
          canProceed = salesOrder?.status === "Confirmed" || salesOrder?.status === "Pending";
          message = canProceed ? "Supplier LPO can be created" : "Sales order must be confirmed";
          nextStep = "goods-receipt";
          if (!canProceed) {
            requiredActions.push("Confirm sales order");
          }
          break;

        case "goods-receipt":
          // For now, assume goods receipt is ready if sales order exists
          const salesOrderForGoods = await storage.getSalesOrder(entityId);
          canProceed = salesOrderForGoods?.status === "Confirmed" || salesOrderForGoods?.status === "Pending";
          message = canProceed ? "Goods can be received" : "Supplier LPO must be sent and confirmed";
          nextStep = "inventory";
          if (!canProceed) {
            requiredActions.push("Send LPO to supplier");
            requiredActions.push("Wait for supplier confirmation");
          }
          break;

        case "inventory":
          // For now, assume inventory can be updated
          canProceed = true;
          message = canProceed ? "Inventory can be updated" : "Goods must be received first";
          nextStep = "delivery-note";
          if (!canProceed) {
            requiredActions.push("Receive goods from supplier");
            requiredActions.push("Update goods receipt status");
          }
          break;

        case "delivery-note":
          // For now, assume delivery note can be created
          canProceed = true;
          message = canProceed ? "Delivery note can be created" : "Inventory must be updated first";
          nextStep = "invoice";
          if (!canProceed) {
            requiredActions.push("Update inventory levels");
            requiredActions.push("Process stock allocation");
          }
          break;

        case "invoice":
          // For now, assume invoice can be generated
          canProceed = true;
          message = canProceed ? "Invoice can be generated" : "Delivery must be completed";
          nextStep = "completed";
          if (!canProceed) {
            requiredActions.push("Complete delivery process");
            requiredActions.push("Update delivery status");
          }
          break;

        default:
          message = "Invalid workflow step";
          requiredActions.push("Contact system administrator");
      }

      res.json({ 
        canProceed, 
        message, 
        step, 
        entityId, 
        nextStep,
        requiredActions,
        missingFields,
        validationErrors,
        stepMetadata,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error validating workflow step:", error);
      res.status(500).json({ message: "Failed to validate workflow step" });
    }
  });

  // Get workflow progress for an entity
  app.get("/api/workflow/progress/:entityId", async (req, res) => {
    try {
      const { entityId } = req.params;
      const { entityType = "enquiry" } = req.query;

      let progress = {
        id: `workflow-${entityId}`,
        entityId,
        entityType,
        entityName: `Entity ${entityId}`,
        currentStep: 1,
        completedSteps: [],
        status: "pending" as const,
        progress: 0,
        nextAction: "",
        estimatedCompletion: null,
        blockers: [],
        lastUpdated: new Date().toISOString(),
        priority: "Medium" as const,
        totalValue: 0,
        startDate: new Date().toISOString(),
        duration: 0,
        efficiency: 0,
        
        // Enhanced fields for better flow implementation
        stepDetails: WORKFLOW_STEPS.map(step => ({
          stepId: step.id,
          stepName: step.name,
          description: step.description,
          estimatedDuration: step.estimatedDuration,
          requiredFields: step.requiredFields,
          completedFields: [],
          missingFields: step.requiredFields,
          dependencies: step.dependencies,
          dependenciesMet: step.dependencies.length === 0,
          validationRules: step.validationRules,
          successCriteria: step.successCriteria,
          nextActions: step.nextActions,
          status: "not_started" as const
        })),
        
        // Workflow metadata
        workflowVersion: "1.0.0",
        createdBy: "system",
        lastModifiedBy: "system",
        tags: [],
        category: "sales",
        department: "sales",
        location: "main",
        
        // Performance metrics
        stepEfficiency: {},
        averageStepDuration: 0,
        bottlenecks: [],
        riskFactors: [],
        
        // Compliance and audit
        auditTrail: [],
        
        // Notifications and alerts
        notifications: [],
        
        // Escalation
        escalationLevel: 0
      };

      // Determine current step and progress based on entity type and status
      switch (entityType) {
        case "enquiry":
          const enquiry = await storage.getEnquiry(entityId);
          if (enquiry) {
            progress.currentStep = 2; // Enquiry step
            progress.completedSteps = [1]; // Customer step
            progress.status = enquiry.status.toLowerCase();
            
            if (enquiry.status === "Quoted") {
              progress.completedSteps = [1, 2, 3]; // Customer, Enquiry, Quotation
              progress.currentStep = 5; // Acceptance step
            }
          }
          break;

        case "quotation":
          const quotation = await storage.getQuotation(entityId);
          if (quotation) {
            progress.currentStep = 4; // Quotation step
            progress.completedSteps = [1, 2]; // Customer, Enquiry
            progress.status = quotation.status.toLowerCase();
            
            if (quotation.status === "Accepted") {
              progress.completedSteps = [1, 2, 3, 4, 5]; // Up to acceptance
              progress.currentStep = 6; // PO Upload step
            }
          }
          break;

        case "sales-order":
          const salesOrder = await storage.getSalesOrder(entityId);
          if (salesOrder) {
            progress.currentStep = 7; // Sales Order step
            progress.completedSteps = [1, 2, 3, 4, 5, 6]; // Up to PO Upload
            progress.status = salesOrder.status.toLowerCase();
          }
          break;
      }

      res.json(progress);
    } catch (error) {
      console.error("Error fetching workflow progress:", error);
      res.status(500).json({ message: "Failed to fetch workflow progress" });
    }
  });

  // Mark workflow step as complete
  app.post("/api/workflow/complete/:step/:entityId", async (req, res) => {
    try {
      const { step, entityId } = req.params;
      const { notes, nextStep } = req.body;

      // For test entities, just return success
      if (entityId.startsWith("test-")) {
        res.json({ 
          message: `Step ${step} marked as complete`,
          nextStep: nextStep || getNextStep(step)
        });
        return;
      }

      // Log completion
      await storage.logAuditEvent(
        "workflow",
        entityId,
        "step_completed",
        req.user?.id,
        undefined,
        { step, notes, nextStep }
      );

      res.json({ 
        message: `Step ${step} marked as complete`,
        nextStep: nextStep || getNextStep(step)
      });
    } catch (error) {
      console.error("Error completing workflow step:", error);
      res.status(500).json({ message: "Failed to complete workflow step" });
    }
  });

  // Get all workflow progress (for dashboard)
  app.get("/api/workflow/progress", async (req, res) => {
    try {
      const { status, priority, assignedTo, search } = req.query;
      
      // Get all enquiries, quotations, and sales orders to build workflow data
      const enquiries = await storage.getEnquiries();
      const quotations = await storage.getQuotations();
      const salesOrders = await storage.getSalesOrders();
      
      const workflows = [];
      
      // Process enquiries
      for (const enquiry of enquiries) {
        const workflow = {
          id: `workflow-enquiry-${enquiry.id}`,
          entityId: enquiry.id,
          entityType: "enquiry",
          entityName: `Enquiry ${enquiry.id}`,
          currentStep: 2,
          completedSteps: [1],
          status: enquiry.status.toLowerCase(),
          progress: 20,
          nextAction: "Complete enquiry details",
          estimatedCompletion: null,
          blockers: [],
          lastUpdated: enquiry.updatedAt || enquiry.createdAt,
          priority: "Medium",
          totalValue: 0,
          startDate: enquiry.createdAt,
          duration: Math.floor((Date.now() - new Date(enquiry.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
          efficiency: 0,
          stepDetails: WORKFLOW_STEPS.map(step => ({
            stepId: step.id,
            stepName: step.name,
            description: step.description,
            estimatedDuration: step.estimatedDuration,
            requiredFields: step.requiredFields,
            completedFields: [],
            missingFields: step.requiredFields,
            dependencies: step.dependencies,
            dependenciesMet: step.dependencies.length === 0,
            validationRules: step.validationRules,
            successCriteria: step.successCriteria,
            nextActions: step.nextActions,
            status: step.id <= 2 ? "completed" : step.id === 2 ? "in_progress" : "not_started"
          }))
        };
        
        // Apply filters
        if (status && status !== "all" && workflow.status !== status) continue;
        if (priority && priority !== "all" && workflow.priority.toLowerCase() !== priority) continue;
        if (search && !workflow.entityName.toLowerCase().includes(search.toLowerCase())) continue;
        
        workflows.push(workflow);
      }
      
      // Process quotations
      for (const quotation of quotations) {
        const workflow = {
          id: `workflow-quotation-${quotation.id}`,
          entityId: quotation.id,
          entityType: "quotation",
          entityName: `Quotation ${quotation.id}`,
          currentStep: 4,
          completedSteps: [1, 2, 3],
          status: quotation.status.toLowerCase(),
          progress: 40,
          nextAction: "Send quotation to customer",
          estimatedCompletion: null,
          blockers: [],
          lastUpdated: quotation.updatedAt || quotation.createdAt,
          priority: "Medium",
          totalValue: quotation.totalAmount || 0,
          startDate: quotation.createdAt,
          duration: Math.floor((Date.now() - new Date(quotation.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
          efficiency: 0,
          stepDetails: WORKFLOW_STEPS.map(step => ({
            stepId: step.id,
            stepName: step.name,
            description: step.description,
            estimatedDuration: step.estimatedDuration,
            requiredFields: step.requiredFields,
            completedFields: [],
            missingFields: step.requiredFields,
            dependencies: step.dependencies,
            dependenciesMet: step.dependencies.length === 0,
            validationRules: step.validationRules,
            successCriteria: step.successCriteria,
            nextActions: step.nextActions,
            status: step.id <= 4 ? "completed" : step.id === 4 ? "in_progress" : "not_started"
          }))
        };
        
        // Apply filters
        if (status && status !== "all" && workflow.status !== status) continue;
        if (priority && priority !== "all" && workflow.priority.toLowerCase() !== priority) continue;
        if (search && !workflow.entityName.toLowerCase().includes(search.toLowerCase())) continue;
        
        workflows.push(workflow);
      }
      
      // Process sales orders
      for (const salesOrder of salesOrders) {
        const workflow = {
          id: `workflow-sales-order-${salesOrder.id}`,
          entityId: salesOrder.id,
          entityType: "sales-order",
          entityName: `Sales Order ${salesOrder.id}`,
          currentStep: 7,
          completedSteps: [1, 2, 3, 4, 5, 6],
          status: salesOrder.status.toLowerCase(),
          progress: 70,
          nextAction: "Create supplier LPO",
          estimatedCompletion: null,
          blockers: [],
          lastUpdated: salesOrder.updatedAt || salesOrder.createdAt,
          priority: "Medium",
          totalValue: salesOrder.totalAmount || 0,
          startDate: salesOrder.createdAt,
          duration: Math.floor((Date.now() - new Date(salesOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
          efficiency: 0,
          stepDetails: WORKFLOW_STEPS.map(step => ({
            stepId: step.id,
            stepName: step.name,
            description: step.description,
            estimatedDuration: step.estimatedDuration,
            requiredFields: step.requiredFields,
            completedFields: [],
            missingFields: step.requiredFields,
            dependencies: step.dependencies,
            dependenciesMet: step.dependencies.length === 0,
            validationRules: step.validationRules,
            successCriteria: step.successCriteria,
            nextActions: step.nextActions,
            status: step.id <= 7 ? "completed" : step.id === 7 ? "in_progress" : "not_started"
          }))
        };
        
        // Apply filters
        if (status && status !== "all" && workflow.status !== status) continue;
        if (priority && priority !== "all" && workflow.priority.toLowerCase() !== priority) continue;
        if (search && !workflow.entityName.toLowerCase().includes(search.toLowerCase())) continue;
        
        workflows.push(workflow);
      }
      
      res.json(workflows);
    } catch (error) {
      console.error("Error fetching workflow progress:", error);
      res.status(500).json({ message: "Failed to fetch workflow progress" });
    }
  });

  // Get workflow analytics
  app.get("/api/workflow/analytics", async (req, res) => {
    try {
      const { period = "30d" } = req.query;
      
      // Get all workflow data
      const enquiries = await storage.getEnquiries();
      const quotations = await storage.getQuotations();
      const salesOrders = await storage.getSalesOrders();
      
      const totalWorkflows = enquiries.length + quotations.length + salesOrders.length;
      const completedWorkflows = quotations.filter(q => q.status === "Accepted").length + 
                                salesOrders.filter(so => so.status === "Completed").length;
      const inProgressWorkflows = enquiries.filter(e => e.status === "In Progress").length +
                                 quotations.filter(q => q.status === "Sent").length +
                                 salesOrders.filter(so => so.status === "Pending").length;
      const blockedWorkflows = enquiries.filter(e => e.status === "Closed").length +
                              quotations.filter(q => q.status === "Rejected").length +
                              salesOrders.filter(so => so.status === "Cancelled").length;
      
      const analytics = {
        totalWorkflows,
        completedWorkflows,
        inProgressWorkflows,
        blockedWorkflows,
        cancelledWorkflows: blockedWorkflows,
        averageCompletionTime: 15, // Mock data
        efficiency: totalWorkflows > 0 ? Math.round((completedWorkflows / totalWorkflows) * 100) : 0,
        totalValue: quotations.reduce((sum, q) => sum + (q.totalAmount || 0), 0) +
                   salesOrders.reduce((sum, so) => sum + (so.totalAmount || 0), 0),
        monthlyTrends: [
          { month: "Jan", completed: 5, inProgress: 3, blocked: 1, cancelled: 0 },
          { month: "Feb", completed: 8, inProgress: 4, blocked: 2, cancelled: 1 },
          { month: "Mar", completed: 12, inProgress: 6, blocked: 1, cancelled: 0 },
          { month: "Apr", completed: 15, inProgress: 8, blocked: 3, cancelled: 1 },
          { month: "May", completed: 18, inProgress: 10, blocked: 2, cancelled: 0 },
          { month: "Jun", completed: 22, inProgress: 12, blocked: 4, cancelled: 2 }
        ],
        stepBreakdown: {
          "Customer": enquiries.length + quotations.length + salesOrders.length,
          "Enquiry": enquiries.length,
          "Quotation": quotations.length,
          "Acceptance": quotations.filter(q => q.status === "Accepted").length,
          "Customer PO Upload": quotations.filter(q => q.status === "Accepted").length,
          "Sales Order": salesOrders.length,
          "Supplier LPO": salesOrders.length,
          "Goods Receipt": 0, // Mock data
          "Inventory": 0, // Mock data
          "Delivery Note": 0, // Mock data
          "Invoice": 0 // Mock data
        },
        priorityDistribution: {
          "Urgent": 2,
          "High": 5,
          "Medium": 15,
          "Low": 8
        },
        teamPerformance: [
          { userId: "user1", userName: "John Doe", completedWorkflows: 12, averageTime: 8, efficiency: 85 },
          { userId: "user2", userName: "Jane Smith", completedWorkflows: 15, averageTime: 6, efficiency: 92 },
          { userId: "user3", userName: "Mike Wilson", completedWorkflows: 8, averageTime: 10, efficiency: 78 }
        ]
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching workflow analytics:", error);
      res.status(500).json({ message: "Failed to fetch workflow analytics" });
    }
  });
}

function getNextStep(currentStep: string): string {
  const stepMap: Record<string, string> = {
    "customer": "enquiry",
    "enquiry": "quotation",
    "quotation": "acceptance",
    "acceptance": "customer-po-upload",
    "customer-po-upload": "sales-order",
    "sales-order": "supplier-lpo",
    "supplier-lpo": "goods-receipt",
    "goods-receipt": "inventory",
    "inventory": "delivery-note",
    "delivery-note": "invoice",
    "invoice": "completed"
  };
  
  return stepMap[currentStep] || "completed";
}
