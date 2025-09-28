import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { formatDate } from "date-fns";
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  User,
  Calendar,
  DollarSign,
  Package,
  Truck,
  ShoppingCart,
  Upload,
  CheckCircle2,
  Eye,
  Download,
  Edit,
  Send,
  X
} from "lucide-react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, getStatusColor } from "@/lib/utils";
import { WORKFLOW_STEPS } from "@/lib/constants";

interface ProcessFlowDetails {
  currentStep: number;
  completedSteps: number[];
  quotationId?: string;
  quotationNumber?: string;
  enquiryId?: string;
  enquiryNumber?: string;
  customerId?: string;
  customerName?: string;
  customerType?: string;
  status: string;
  totalValue: number;
  createdAt?: string;
  lastUpdated?: string;
  estimatedCompletion?: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignedTo?: string;
  notes?: string;
}

interface StepDetails {
  id: number;
  name: string;
  status: "completed" | "current" | "pending" | "blocked";
  completedAt?: string;
  assignedTo?: string;
  notes?: string;
  estimatedDuration: string;
  actualDuration?: string;
  documents?: string[];
}

export default function ProcessFlowDetailsPage() {
  const [, navigate] = useLocation();

  // Dynamic data queries
  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: async () => {
      const res = await fetch("/api/customers");
      if (!res.ok) throw new Error("Failed to fetch customers");
      return res.json();
    }
  });

  const { data: enquiriesData, isLoading: enquiriesLoading } = useQuery({
    queryKey: ["/api/enquiries"],
    queryFn: async () => {
      const res = await fetch("/api/enquiries");
      if (!res.ok) throw new Error("Failed to fetch enquiries");
      return res.json();
    }
  });

  const { data: quotationsData, isLoading: quotationsLoading } = useQuery({
    queryKey: ["/api/quotations"],
    queryFn: async () => {
      const res = await fetch("/api/quotations");
      if (!res.ok) throw new Error("Failed to fetch quotations");
      return res.json();
    }
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/sales-orders"],
    queryFn: async () => {
      const res = await fetch("/api/sales-orders");
      if (!res.ok) throw new Error("Failed to fetch sales orders");
      return res.json();
    }
  });

  // Parse optional query params for customerId or quotationId
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const customerIdParam = searchParams.get('customerId');
  const quotationIdParam = searchParams.get('quotationId');

  // Extract arrays
  const customers = customersData?.customers || customersData || [];
  const enquiries = enquiriesData?.enquiries || enquiriesData || [];
  const quotations = quotationsData?.quotations || quotationsData || [];
  const salesOrders = ordersData?.salesOrders || ordersData || [];

  // Determine base customer / quotation context
  const { processFlow, stepDetails, recentActivities } = useMemo(() => {
    if (customersLoading || enquiriesLoading || quotationsLoading || ordersLoading) {
      return { processFlow: null, stepDetails: [] as StepDetails[], recentActivities: [] as any[] };
    }

    // Identify target quotation or customer
    let targetQuotation: any = null;
    if (quotationIdParam) {
      targetQuotation = quotations.find((q: any) => q.id === quotationIdParam || q.quoteNumber === quotationIdParam);
    }
    if (!targetQuotation) {
      // Filter by customer if provided
      const filtQuotations = customerIdParam
        ? quotations.filter((q: any) => (q.customer?.id || q.customerId) === customerIdParam)
        : quotations;
      // Pick latest by date
      targetQuotation = [...filtQuotations].sort((a: any, b: any) => new Date(b.quotationDate || b.createdAt).getTime() - new Date(a.quotationDate || a.createdAt).getTime())[0];
    }

    const customerId = customerIdParam || (targetQuotation?.customer?.id || targetQuotation?.customerId);
    const customer = customers.find((c: any) => c.id === customerId) || targetQuotation?.customer;
    const customerName = customer?.name;
    const customerType = customer?.customerType || customer?.classification || 'Unknown';

    // Related enquiry: try match by enquiryId stored on quotation if present, else latest enquiry for customer
    let relatedEnquiry = null;
    if (targetQuotation?.enquiryId) {
      relatedEnquiry = enquiries.find((e: any) => e.id === targetQuotation.enquiryId);
    }
    if (!relatedEnquiry && customerId) {
      const customerEnquiries = enquiries.filter((e: any) => (e.customer?.id || e.customerId) === customerId);
      relatedEnquiry = [...customerEnquiries].sort((a: any, b: any) => new Date(b.enquiryDate || b.createdAt).getTime() - new Date(a.enquiryDate || a.createdAt).getTime())[0];
    }

    // Sales order related to quotation
    const relatedSalesOrder = targetQuotation ? salesOrders.find((o: any) => o.quoteId === targetQuotation.id || o.quotationId === targetQuotation.id) : null;

    // Build completed steps logic (mirrors dashboard dynamic logic)
    let completedSteps: number[] = [];
    let currentStep = 1;
    if (customerId) { completedSteps.push(1); currentStep = 2; }
    if (relatedEnquiry) { completedSteps.push(2); currentStep = 3; }
    if (targetQuotation) {
      completedSteps.push(3); currentStep = 4;
      const status = targetQuotation.status;
      if (status === 'Sent') { completedSteps.push(4); currentStep = 5; }
      else if (status === 'Accepted') { completedSteps.push(4,5,6); currentStep = 7; }
      else if (status === 'Rejected' || status === 'Rejected by Customer' || status === 'Expired') { /* stay at 4 */ }
      else if (status === 'Approved') { /* waiting to send */ }
    }
    if (relatedSalesOrder) { completedSteps.push(7); currentStep = 8; }

    // Build processFlow object
    const processFlow: ProcessFlowDetails = {
      currentStep,
      completedSteps,
      quotationId: targetQuotation?.id,
      quotationNumber: targetQuotation?.quoteNumber,
      enquiryId: relatedEnquiry?.id,
      enquiryNumber: relatedEnquiry?.enquiryNumber,
      customerId,
      customerName,
      customerType,
      status: targetQuotation?.status || 'Draft',
      totalValue: targetQuotation?.totalAmount || targetQuotation?.grandTotal || 0,
      createdAt: targetQuotation?.createdAt || relatedEnquiry?.createdAt,
      lastUpdated: targetQuotation?.updatedAt || targetQuotation?.createdAt,
      estimatedCompletion: undefined,
      priority: 'High',
      assignedTo: targetQuotation?.assignedTo || 'Sales Team',
      notes: targetQuotation?.notes || ''
    };

    // Dynamic step details construction
    const stepNames = [
      'Customer', 'Enquiry', 'Quotation', 'Customer Acceptance', 'PO Upload', 'Sales Order', 'Supplier LPO', 'Goods Receipt', 'Inventory', 'Delivery & Picking', 'Invoice'
    ];

    const stepDetails: StepDetails[] = stepNames.slice(0, 10).map((name, idx) => {
      const id = idx + 1;
      let status: StepDetails['status'] = 'pending';
      if (completedSteps.includes(id)) status = 'completed';
      else if (id === currentStep) status = 'current';
      return {
        id,
        name: id === 1 ? 'Enquiry' : name === 'Customer' ? 'Customer' : name.replace('Customer ', ''),
        status,
        assignedTo: id === currentStep ? processFlow.assignedTo : undefined,
        notes: (() => {
          switch (id) {
            case 1: return relatedEnquiry ? 'Enquiry captured' : 'Awaiting enquiry';
            case 2: return targetQuotation ? 'Quotation prepared' : 'Pending quotation';
            case 3: return targetQuotation ? `Status: ${targetQuotation.status}` : 'No quotation yet';
            case 4: return processFlow.status === 'Sent' ? 'Awaiting customer acceptance' : 'Pending send/acceptance';
            case 5: return completedSteps.includes(5) ? 'Acceptance recorded' : 'Waiting on acceptance';
            case 7: return relatedSalesOrder ? 'Sales order confirmed' : 'Pending sales order';
            default: return 'Pending';
          }
        })(),
        estimatedDuration: '—',
        documents: []
      };
    });

    // Dynamic activity timeline generation based on discovered related entities & statuses
    const activities: any[] = [];
    const pushActivity = (partial: any) => {
      if (!partial.timestamp) return; // skip if no timestamp available
      activities.push({ id: activities.length + 1, user: processFlow.assignedTo || 'System', icon: FileText, ...partial });
    };

    // Enquiry event
    if (relatedEnquiry?.createdAt) {
      pushActivity({
        action: 'Enquiry Created',
        description: `${relatedEnquiry.enquiryNumber || 'Enquiry'} captured for ${customerName || 'customer'}`,
        timestamp: relatedEnquiry.createdAt,
        icon: CheckCircle2
      });
    }

    // Quotation creation event
    if (targetQuotation?.createdAt) {
      pushActivity({
        action: 'Quotation Created',
        description: `${targetQuotation.quoteNumber || 'Quotation'} created`,
        timestamp: targetQuotation.createdAt,
        icon: FileText
      });
    }

    // Quotation sent
    if (targetQuotation?.status === 'Sent') {
      pushActivity({
        action: 'Quotation Sent',
        description: `${targetQuotation.quoteNumber || 'Quotation'} sent to customer` ,
        timestamp: targetQuotation.updatedAt || targetQuotation.createdAt,
        icon: Send
      });
    }

    // Quotation accepted / rejected / expired events
    if (['Accepted','Rejected','Rejected by Customer','Expired'].includes(targetQuotation?.status)) {
      pushActivity({
        action: `Quotation ${targetQuotation.status}`,
        description: `${targetQuotation.quoteNumber || 'Quotation'} ${targetQuotation.status?.toLowerCase()}`,
        timestamp: targetQuotation.updatedAt || targetQuotation.createdAt,
        icon: targetQuotation.status === 'Accepted' ? CheckCircle : X
      });
    }

    // Sales order created
    if (relatedSalesOrder?.createdAt) {
      pushActivity({
        action: 'Sales Order Created',
        description: `${relatedSalesOrder.orderNumber || 'Sales Order'} generated from ${targetQuotation?.quoteNumber || 'quotation'}`,
        timestamp: relatedSalesOrder.createdAt,
        icon: ShoppingCart
      });
    }

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return { processFlow, stepDetails, recentActivities: activities };
  }, [customersLoading, enquiriesLoading, quotationsLoading, ordersLoading, customers, enquiries, quotations, salesOrders, customerIdParam, quotationIdParam]);

  const isLoading = customersLoading || enquiriesLoading || quotationsLoading || ordersLoading;

  // recentActivities now provided by useMemo (dynamic, customer-specific)

  if (isLoading || !processFlow) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading process flow details...</p>
        </div>
      </div>
    );
  }

  const progress = ((processFlow.completedSteps.length + (processFlow.currentStep > 0 ? 1 : 0)) / WORKFLOW_STEPS.length) * 100;
  const currentStepData = stepDetails?.find(step => step.id === processFlow.currentStep);
  const completedStepsData = stepDetails?.filter(step => processFlow.completedSteps.includes(step.id));
  const pendingStepsData = stepDetails?.filter(step => step.id > processFlow.currentStep);

  const getStepIcon = (stepId: number) => {
    switch (stepId) {
      case 1: return User;
      case 2: return FileText;
      case 3: return CheckCircle;
      case 4: return Upload;
      case 5: return ShoppingCart;
      case 6: return Truck;
      case 7: return Package;
      case 8: return Package;
      case 9: return Truck;
      case 10: return DollarSign;
      default: return Clock;
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-white bg-green-600";
      case "current": return "text-white bg-gray-600";
      case "pending": return "text-white bg-gray-400";
      case "blocked": return "text-white bg-red-600";
      default: return "text-white bg-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "text-white bg-red-600";
      case "High": return "text-white bg-orange-600";
      case "Medium": return "text-white bg-yellow-600";
      case "Low": return "text-white bg-green-600";
      default: return "text-white bg-gray-600";
    }
  };

  // PDF Download logic
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);
  const handleDownloadDocument = (stepId: number, docName: string) => {
    setDownloadingDoc(`${stepId}-${docName}`);
    try {
      const step = stepDetails?.find(s => s.id === stepId);
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const lineHeight = 18;
      let y = 40;
      pdf.setFontSize(16);
      pdf.text(`Document: ${docName}`, 40, y);
      y += lineHeight;
      pdf.setFontSize(12);
      pdf.text(`Related Step: ${step?.name || stepId}`, 40, y); y += lineHeight;
      if (step?.status) { pdf.text(`Step Status: ${step.status}`, 40, y); y += lineHeight; }
      if (step?.assignedTo) { pdf.text(`Assigned To: ${step.assignedTo}`, 40, y); y += lineHeight; }
      if (step?.estimatedDuration) { pdf.text(`Estimated Duration: ${step.estimatedDuration}`, 40, y); y += lineHeight; }
      if (step?.actualDuration) { pdf.text(`Actual Duration: ${step.actualDuration}`, 40, y); y += lineHeight; }
      if (step?.completedAt) { pdf.text(`Completed: ${formatDate(new Date(step.completedAt), "MMM dd, yyyy 'at' h:mm a")}`, 40, y); y += lineHeight; }
      if (step?.notes) {
        y += 10;
        const notesLines = pdf.splitTextToSize(`Notes: ${step.notes}`, 520);
        pdf.text(notesLines, 40, y);
        y += notesLines.length * lineHeight;
      }
      y += 20;
      pdf.setFontSize(10);
      pdf.text(`Generated: ${formatDate(new Date(), "MMM dd, yyyy 'at' h:mm a")}`, 40, y);
      pdf.save(docName.replace(/\s+/g, "-") + ".pdf");
    } catch (e) {
      console.error("Failed to generate PDF", e);
    } finally {
      setDownloadingDoc(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="page-title">
              Process Flow Details
            </h1>
            <p className="text-gray-600 text-lg">
              {processFlow.quotationNumber} - {processFlow.customerName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <Badge className={`${getPriorityColor(processFlow.priority)} flex items-center gap-1`}>
              <span className="border border-blue-500 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-semibold mr-2">High</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {processFlow.status}
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress: {processFlow.completedSteps.length + 1} of {WORKFLOW_STEPS.length} steps</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{processFlow.completedSteps.length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">1</div>
                <div className="text-sm text-gray-600">Current</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{WORKFLOW_STEPS.length - processFlow.completedSteps.length - 1}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/quotations/${processFlow.quotationId}`)}
          data-testid="button-view-quotation"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Quotation
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/enquiries/${processFlow.enquiryId}`)}
          data-testid="button-view-enquiry"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Enquiry
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.print()}
          data-testid="button-export"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="steps">Step Details</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer & Project Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Customer Name</label>
                      <div className="font-medium">{processFlow.customerName}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Customer Type</label>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{processFlow.customerType}</Badge>
                        <span className="text-sm text-gray-600">
                          ({processFlow.customerType === "Retail" ? "70%" : "40%"} markup)
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Customer ID</label>
                      <div className="font-mono text-sm">{processFlow.customerId}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Assigned To</label>
                      <div className="font-medium">{processFlow.assignedTo}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Quotation Number</label>
                      <div className="font-mono text-sm text-blue-600">{processFlow.quotationNumber}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Enquiry Number</label>
                      <div className="font-mono text-sm text-blue-600">{processFlow.enquiryNumber}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Value</label>
                      <div className="font-bold text-lg text-green-600">
                        {formatCurrency(processFlow.totalValue)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Priority</label>
                      <Badge className={getPriorityColor(processFlow.priority)}>
                        {processFlow.priority}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <div className="text-sm">
                        {processFlow.createdAt ? formatDate(new Date(processFlow.createdAt), "MMM dd, yyyy 'at' h:mm a") : '—'}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <div className="text-sm">
                        {processFlow.lastUpdated ? formatDate(new Date(processFlow.lastUpdated), "MMM dd, yyyy 'at' h:mm a") : '—'}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Estimated Completion</label>
                      <div className="text-sm">
                        {processFlow.estimatedCompletion ? formatDate(new Date(processFlow.estimatedCompletion), "MMM dd, yyyy") : '—'}
                      </div>
                    </div>
                  </div>
                  
                  {processFlow.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Notes</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                        {processFlow.notes}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Current Step Status */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Current Step
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${getStepStatusColor(currentStepData?.status || "current")}`}>
                      {React.createElement(getStepIcon(processFlow.currentStep), { className: "h-8 w-8" })}
                    </div>
                    <h3 className="font-semibold text-lg">{WORKFLOW_STEPS[processFlow.currentStep - 1]?.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{currentStepData?.notes}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Assigned To:</span>
                      <span className="font-medium">{currentStepData?.assignedTo || "TBD"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Estimated Duration:</span>
                      <span className="font-medium">{currentStepData?.estimatedDuration || "TBD"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <Badge className={getStepStatusColor(currentStepData?.status || "current")}>
                        {currentStepData?.status || "Current"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="steps" className="space-y-6">
          <div className="space-y-4">
            {stepDetails?.map((step) => {
              const IconComponent = getStepIcon(step.id);
              return (
                <Card key={step.id} className={`${step.status === "current" ? "border-gray-500 bg-gray-50" : ""}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStepStatusColor(step.status)}`}>
                          {step.status === "completed" ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <IconComponent className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{step.name}</h3>
                          <p className="text-sm text-gray-600">{step.notes}</p>
                          {step.completedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Completed: {formatDate(new Date(step.completedAt), "MMM dd, yyyy 'at' h:mm a")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStepStatusColor(step.status)}>
                          {step.status}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">
                          {step.assignedTo}
                        </div>
                        <div className="text-xs text-gray-500">
                          {step.actualDuration || step.estimatedDuration}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities?.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border-l-4 border-gray-500 bg-gray-50">
                      <IconComponent className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-gray-600">{activity.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(new Date(activity.timestamp), "MMM dd, yyyy 'at' h:mm a")} • {activity.user}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Related Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stepDetails?.map((step) => {
                  if (!step.documents || step.documents.length === 0) return null;
                  
                  return (
                    <div key={step.id} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{step.name} Documents</h4>
                      <div className="space-y-2">
                        {step.documents.map((doc, index) => {
                          const key = `${step.id}-${doc}-${index}`;
                          const isLoading = downloadingDoc === key;
                          return (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-600" />
                                <span className="text-sm">{doc}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={isLoading}
                                onClick={() => handleDownloadDocument(step.id, doc)}
                                data-testid={`button-download-${step.id}-${index}`}
                              >
                                {isLoading ? (
                                  <span className="text-xs">...</span>
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
