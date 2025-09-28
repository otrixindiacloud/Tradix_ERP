import { useState, useEffect, useMemo } from "react";
import { Select } from "@/components/ui/select";
import { SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import WorkflowStepper from "@/components/workflow/workflow-stepper";
import StepCard from "@/components/workflow/step-card";
import WorkflowProgressTracker from "@/components/workflow/workflow-progress-tracker";
import DataTable from "@/components/tables/data-table";
import AIInsightsWidget from "@/components/ai-assistant/ai-insights-widget";
import { NotificationDemo } from "@/components/notifications/notification-demo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatCurrencyCompact, formatDate, getStatusColor } from "@/lib/utils";
import { Download, Plus, TrendingUp, TrendingDown, Eye, CheckCircle, HelpCircle, FileText, ShoppingCart, DollarSign, CheckCircle2, Upload, Package, BarChart3, Clock } from "lucide-react";
import { 
  FaDownload, 
  FaPlus, 
  FaEye, 
  FaCheckCircle, 
  FaQuestionCircle, 
  FaFileInvoice, 
  FaShoppingCart, 
  FaDollarSign, 
  FaCheckCircle as FaCheckCircle2, 
  FaUpload, 
  FaBox,
  FaHome,
  FaTruck,
  FaWarehouse,
  FaBoxes,
  FaMoneyBillWave,
  FaChartBar,
  FaRobot,
  FaCog,
  FaUsers,
  FaBell,
  FaHistory,
  FaFileExport,
  FaChartLine,
  FaCogs,
  FaUserCog,
  FaDatabase,
  FaClipboardList,
  FaTruckLoading,
  FaBoxOpen,
  FaBrain,
  FaTasks,
  FaFileAlt,
  FaShoppingBag,
  FaFileInvoiceDollar,
  FaTruckMoving,
  FaSync,
  FaBuilding,
  FaReceipt,
  FaRegCheckCircle
} from "react-icons/fa";


export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  // Fetch customers
  const { data: customersData = { customers: [] }, isLoading: customersLoading } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");
      if (!response.ok) throw new Error("Failed to fetch customers");
      return response.json();
    },
  });
  const customers = customersData.customers || [];
  // Fast lookup map for customer enrichment (used when enquiry/order rows only have customerId)
  const customerIndex = useMemo(() => {
    const idx: Record<string, any> = {};
    customers.forEach((c: any) => { if (c?.id) idx[c.id] = c; });
    return idx;
  }, [customers]);
  const [selectedEnquiries, setSelectedEnquiries] = useState<string[]>([]);

  // Fetch a single customer when an ID is selected (ensures fresh data even if list was paginated or stale)
  const { data: selectedCustomerData, isLoading: selectedCustomerLoading } = useQuery({
    queryKey: ["/api/customers", selectedCustomerId],
    queryFn: async () => {
      if (!selectedCustomerId) return null;
      const res = await fetch(`/api/customers/${selectedCustomerId}`);
      if (!res.ok) throw new Error("Failed to fetch customer");
      return res.json();
    },
    enabled: !!selectedCustomerId,
  });

  // Resolve the currently selected customer (prefer single fetch result, else fallback to list)
  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return selectedCustomerData || customers.find((c: any) => c.id === selectedCustomerId) || null;
  }, [selectedCustomerId, selectedCustomerData, customers]);
  
  // Load selected enquiries from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedEnquiries');
    if (saved) {
      try {
        setSelectedEnquiries(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing selected enquiries from localStorage:', error);
      }
    }
  }, []);

  // Save selected enquiries to localStorage whenever it changes
  useEffect(() => {
    if (selectedEnquiries.length > 0) {
      localStorage.setItem('selectedEnquiries', JSON.stringify(selectedEnquiries));
    } else {
      localStorage.removeItem('selectedEnquiries');
    }
  }, [selectedEnquiries]);
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      return response.json();
    },
  });

  const { data: enquiries, isLoading: enquiriesLoading } = useQuery({
    queryKey: ["/api/enquiries"],
    queryFn: async () => {
      const response = await fetch("/api/enquiries?limit=5");
      if (!response.ok) {
        throw new Error('Failed to fetch enquiries');
      }
      return response.json();
    },
  });

  const { data: salesOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/sales-orders"],
    queryFn: async () => {
      const response = await fetch("/api/sales-orders?limit=5");
      if (!response.ok) {
        throw new Error('Failed to fetch sales orders');
      }
      return response.json();
    },
  });

  const { data: quotations, isLoading: quotationsLoading } = useQuery({
    queryKey: ["/api/quotations"],
    queryFn: async () => {
      const response = await fetch("/api/quotations?limit=5");
      if (!response.ok) {
        throw new Error('Failed to fetch quotations');
      }
      return response.json();
    },
  });


  // Task action handlers
  const handleTaskAction = (task: any) => {
    switch (task.action.toLowerCase()) {
      case "review":
        // Navigate to quotation that needs review
        if (task.description.includes("QT-")) {
          const quoteId = task.description.match(/QT-\d+-\d+/)?.[0];
          setLocation(`/quotations?search=${quoteId}`);
        }
        break;
      case "validate":
        // Navigate to sales order for validation
        if (task.description.includes("SO-")) {
          const orderId = task.description.match(/SO-\d+-\d+/)?.[0];
          setLocation(`/sales-orders?search=${orderId}`);
        }
        break;
      case "create":
        // Navigate to supplier LPO creation
        if (task.description.includes("SO-")) {
          setLocation("/supplier-lpo");
        }
        break;
      case "update":
        // Navigate to inventory management
        setLocation("/inventory-management");
        break;
      default:
        // Mark as complete
        setCompletedTasks(prev => [...prev, task.id]);
        break;
    }
  };

  const isTaskCompleted = (taskId: number) => completedTasks.includes(taskId);

  const enquiryColumns = [
    {
      key: "enquiryNumber",
      header: "Enquiry ID",
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: "customer.name",
      header: "Customer",
      render: (value: string, item: any) => {
        const resolvedCustomer = item.customer || customerIndex[item.customerId];
        return (
          <div>
            <p className="text-sm font-medium text-gray-900" data-testid={`enquiry-customer-name-${item.id}`}>
              {resolvedCustomer?.name || "Unknown"}
            </p>
            <p className="text-xs text-gray-600">
              {resolvedCustomer?.customerType || resolvedCustomer?.classification || "-"}
            </p>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
    },
    {
      key: "enquiryDate",
      header: "Date",
      className: "text-right",
    },
    {
      key: "actions",
      header: "Actions",
      render: (value: string, item: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setLocation(`/enquiries/${item.id}`);
          }}
          data-testid={`button-view-details-enquiry-${item.id}`}
        >
          <FaEye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      ),
    },
  ];

  const orderColumns = [
    {
      key: "orderNumber",
      header: "Order ID",
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: "customer.name",
      header: "Customer",
      render: (value: string, item: any) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{item.customer?.name || "Unknown"}</p>
          <p className="text-xs text-gray-600">{item.customer?.classification || "-"}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
    },
    {
      key: "totalAmount",
      header: "Value",
      className: "text-right",
    },
    {
      key: "actions",
      header: "Actions",
      render: (value: string, item: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setLocation(`/sales-orders/${item.id}`);
          }}
          data-testid={`button-view-details-order-${item.id}`}
        >
          <FaEye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      ),
    },
  ];

  // Helper to format relative time (simple, client-side)
  const timeAgo = (dateString?: string) => {
    if (!dateString) return '';
    const now = Date.now();
    const ts = new Date(dateString).getTime();
    const diffSec = Math.max(1, Math.floor((now - ts) / 1000));
    const units: [number, string][] = [
      [60, 'second'],
      [60, 'minute'],
      [24, 'hour'],
      [7, 'day'],
      [4.34524, 'week'],
      [12, 'month'],
      [Number.POSITIVE_INFINITY, 'year']
    ];
    let unitIndex = 0;
    let count = diffSec;
    for (let i = 0; i < units.length; i++) {
      const [threshold, label] = units[i];
      if (count < threshold) {
        const value = Math.floor(count);
        return `${value} ${label}${value !== 1 ? 's' : ''} ago`;
      }
      count /= threshold;
      unitIndex = i;
    }
    return 'just now';
  };

  const quotationColumns = [
    {
      key: 'quoteNumber',
      header: 'Quote ID',
      render: (value: string, item: any) => (
        <div>
          <span className="font-mono text-sm text-gray-600">{value}</span>
          {item?.customer?.name && (
            <p className="text-xs text-gray-500 mt-0.5" data-testid={`quote-customer-${item.id}`}>{item.customer.name}</p>
          )}
        </div>
      )
    },
    {
      key: 'customer.name',
      header: 'Customer',
      render: (value: string, item: any) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{item.customer?.name || 'Unknown'}</p>
          <p className="text-xs text-gray-600">{item.customer?.customerType || '-'}</p>
        </div>
      )
    },
    { key: 'status', header: 'Status' },
    { key: 'totalAmount', header: 'Value', className: 'text-right' },
    {
      key: 'actions',
      header: 'Actions',
      render: (value: string, item: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); setLocation(`/quotations/${item.id}`); }}
          data-testid={`button-view-details-quotation-${item.id}`}
        >
          <FaEye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      )
    }
  ];

  // Precompute flattened arrays (API may return {items:[]} or direct array)
  const enquiriesArray = (enquiries?.enquiries || enquiries || []) as any[];
  const quotationsArray = (quotations?.quotations || quotations || []) as any[];
  const ordersArray = (salesOrders?.salesOrders || salesOrders || []) as any[];

  const filteredEnquiriesTable = useMemo(() => {
    const base = selectedCustomerId ? enquiriesArray.filter(e => (e.customer?.id || e.customerId) === selectedCustomerId) : enquiriesArray;
    return [...base].sort((a,b) => new Date(b.enquiryDate || b.createdAt).getTime() - new Date(a.enquiryDate || a.createdAt).getTime()).slice(0,5);
  }, [enquiriesArray, selectedCustomerId]);

  const filteredQuotationsTable = useMemo(() => {
    const base = selectedCustomerId ? quotationsArray.filter(q => (q.customer?.id || q.customerId) === selectedCustomerId) : quotationsArray;
    return [...base].sort((a,b) => new Date(b.quotationDate || b.createdAt).getTime() - new Date(a.quotationDate || a.createdAt).getTime()).slice(0,5);
  }, [quotationsArray, selectedCustomerId]);

  const filteredOrdersTable = useMemo(() => {
    const base = selectedCustomerId ? ordersArray.filter(o => (o.customer?.id || o.customerId) === selectedCustomerId) : ordersArray;
    return [...base].sort((a,b) => new Date(b.orderDate || b.createdAt).getTime() - new Date(a.orderDate || a.createdAt).getTime()).slice(0,5);
  }, [ordersArray, selectedCustomerId]);

  // Dynamic recent activities derived from fetched entities
  const { recentActivities, urgentTasks } = useMemo(() => {
    const acts: any[] = [];
    const tasks: any[] = [];
    const push = (obj: any) => acts.push({ id: acts.length + 1, ...obj });

    const filteredEnquiries = (enquiries?.enquiries || enquiries || []).filter((e: any) => !selectedCustomerId || (e.customer?.id || e.customerId) === selectedCustomerId);
    const filteredQuotations = (quotations?.quotations || quotations || []).filter((q: any) => !selectedCustomerId || (q.customer?.id || q.customerId) === selectedCustomerId);
    const filteredOrders = (salesOrders?.salesOrders || salesOrders || []).filter((o: any) => !selectedCustomerId || (o.customer?.id || o.customerId) === selectedCustomerId);

    // Enquiries activities
    filteredEnquiries.slice(0, 10).forEach((e: any) => {
      push({
        icon: FaQuestionCircle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        message: `New enquiry ${e.enquiryNumber || ''} from ${e.customer?.name || 'Customer'}`,
        time: timeAgo(e.enquiryDate || e.createdAt)
      });
    });

    // Quotation activities (created & status changes)
    filteredQuotations.slice(0, 15).forEach((q: any) => {
      push({
        icon: FaFileInvoice,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        message: `Quotation ${q.quoteNumber || ''} created for ${q.customer?.name || 'Customer'}`,
        time: timeAgo(q.createdAt)
      });
      if (q.status === 'Sent') {
        push({
          icon: FaUpload,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          message: `Quotation ${q.quoteNumber} sent to ${q.customer?.name || 'customer'}`,
          time: timeAgo(q.updatedAt || q.createdAt)
        });
      } else if (q.status === 'Accepted') {
        push({
          icon: FaCheckCircle2,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          message: `Quote ${q.quoteNumber} accepted by ${q.customer?.name || 'customer'}`,
          time: timeAgo(q.updatedAt || q.createdAt)
        });
      } else if (q.status === 'Rejected' || q.status === 'Rejected by Customer') {
        push({
          icon: FaHistory,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          message: `Quote ${q.quoteNumber} ${q.status.toLowerCase()}`,
          time: timeAgo(q.updatedAt || q.createdAt)
        });
      } else if (q.status === 'Expired') {
        push({
          icon: FaHistory,
          color: 'text-amber-600',
          bgColor: 'bg-amber-100',
          message: `Quotation ${q.quoteNumber} expired`,
          time: timeAgo(q.updatedAt || q.createdAt)
        });
      }
    });

    // Sales orders activities
    filteredOrders.slice(0, 10).forEach((o: any) => {
      push({
        icon: FaShoppingCart,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        message: `Sales order ${o.orderNumber || ''} created for ${o.customer?.name || 'Customer'}`,
        time: timeAgo(o.createdAt)
      });
    });

    // Sort by time (acts already relative; re-sort by original timestamp if available stored in hidden field?)
    // Since we only have relative strings now, we keep insertion order (approx by entity recency due to input ordering)

    // Dynamic urgent tasks logic
    filteredQuotations.slice(0, 10).forEach((q: any) => {
      if (q.status === 'Draft' || q.status === 'Under Review') {
        tasks.push({
          id: tasks.length + 1,
            title: q.status === 'Draft' ? 'Quote approval required' : 'Internal review pending',
          description: `${q.quoteNumber || 'Quotation'} - ${q.status === 'Draft' ? 'Complete & submit' : 'Awaiting approval'}`,
          priority: q.status === 'Draft' ? 'urgent' : 'high',
          action: q.status === 'Draft' ? 'Review' : 'Review'
        });
      }
      if (q.status === 'Sent') {
        tasks.push({
          id: tasks.length + 1,
          title: 'Awaiting customer acceptance',
          description: `${q.quoteNumber} - Follow up if no response`,
          priority: 'medium',
          action: 'Review'
        });
      }
      if (q.status === 'Accepted') {
        tasks.push({
          id: tasks.length + 1,
          title: 'Create Sales Order',
          description: `${q.quoteNumber} accepted - convert to SO`,
          priority: 'urgent',
          action: 'Create'
        });
      }
      if (q.status === 'Expired') {
        tasks.push({
          id: tasks.length + 1,
          title: 'Renew expired quotation',
          description: `${q.quoteNumber} - Issue new revision`,
          priority: 'high',
          action: 'Review'
        });
      }
    });

    filteredOrders.slice(0, 10).forEach((o: any) => {
      if (o.status === 'Draft') {
        tasks.push({
          id: tasks.length + 1,
          title: 'Validate sales order',
          description: `${o.orderNumber} requires validation`,
          priority: 'high',
          action: 'Validate'
        });
      }
    });

    // Deduplicate tasks by title+description
    const uniqueTasks: any[] = [];
    const seen = new Set<string>();
    for (const t of tasks) {
      const key = t.title + '|' + t.description;
      if (!seen.has(key)) { seen.add(key); uniqueTasks.push(t); }
    }

    return { recentActivities: acts.slice(0, 12), urgentTasks: uniqueTasks.slice(0, 12) };
  }, [enquiries, quotations, salesOrders, selectedCustomerId]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-50 border-red-200";
      case "high":
        return "bg-orange-50 border-orange-200";
      case "medium":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">
              Process Flow Dashboard
            </h2>
            <p className="text-gray-600 text-lg">
              End-to-end automation from customer enquiry to invoicing
            </p>
          </div>
          <div className="flex space-x-3 items-center">
            {/* Customer Select Dropdown */}
            <div className="flex items-center gap-2 min-w-[220px]">
              <span className="text-sm text-gray-700">Customer:</span>
              <Select
                value={selectedCustomerId}
                onValueChange={setSelectedCustomerId}
                disabled={customersLoading}
              >
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue placeholder={customersLoading ? "Loading..." : "Select Customer"} />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="btn-primary flex items-center space-x-2" data-testid="button-new-enquiry" onClick={() => setLocation("/enquiries?new=true")}> 
              <FaPlus className="h-4 w-4" />
              <span>New Enquiry</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 hover:bg-gray-50" data-testid="button-export" onClick={() => window.print()}>
              <FaDownload className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Sequential Workflow Stepper (only when a customer is selected) */}
        {(() => {
          if (!selectedCustomerId) {
            return (
              <div className="mb-4">
                <WorkflowStepper
                  currentStep={0}
                  completedSteps={[]}
                  quotationId={undefined}
                  quotationNumber={""}
                  onMarkComplete={undefined}
                  onViewDetails={undefined}
                />
              </div>
            );
          }
          // Filter all entities for the selected customer (support both customer?.id and customerId)
          const filteredEnquiries = selectedCustomerId
            ? (enquiries || []).filter((e: any) => (e.customer?.id || e.customerId) === selectedCustomerId)
            : (enquiries || []);
          const filteredQuotations = selectedCustomerId
            ? (quotations || []).filter((q: any) => (q.customer?.id || q.customerId) === selectedCustomerId)
            : (quotations || []);
          const filteredOrders = selectedCustomerId
            ? (salesOrders || []).filter((o: any) => (o.customer?.id || o.customerId) === selectedCustomerId)
            : (salesOrders || []);

          // Sort by date descending to get the latest entity for each
          const sortedEnquiries = [...filteredEnquiries].sort((a, b) => new Date(b.enquiryDate || b.createdAt).getTime() - new Date(a.enquiryDate || a.createdAt).getTime());
          const sortedQuotations = [...filteredQuotations].sort((a, b) => new Date(b.quotationDate || b.createdAt).getTime() - new Date(a.quotationDate || a.createdAt).getTime());
          const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.orderDate || b.createdAt).getTime() - new Date(a.orderDate || a.createdAt).getTime());

          // Determine workflow progress
          let currentStep = 1;
          let completedSteps: number[] = [];
          let reflectionCard = null;
          let currentQuote = sortedQuotations[0];
          // Step 1: Customer always complete if selected
          if (selectedCustomerId) {
            completedSteps.push(1);
            currentStep = 2;
          }
          // Step 2: Enquiry exists
          if (sortedEnquiries.length > 0) {
            completedSteps.push(2);
            currentStep = 3;
          }
          // Step 3: Quotation exists
          if (sortedQuotations.length > 0) {
            completedSteps.push(3);
            currentStep = 4;
            // Dynamic status-based progress + reflection card
            const latestQuote = sortedQuotations[0];
            const status = latestQuote.status;

            type StatusHandlerResult = { extraCompleted: number[]; currentStep: number; card: JSX.Element | null };
            const statusHandlers: Record<string, (q: any) => StatusHandlerResult> = {
              Draft: (q) => ({
                extraCompleted: [],
                currentStep: 4,
                card: (
                  <div className="bg-white rounded-lg shadow border p-4 mt-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg text-gray-900">
                          <span role="img" aria-label="pencil">✏️</span> Current Step: Prepare Quotation
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        Draft #{q.quoteNumber} - Complete pricing & terms then submit for review.
                      </div>
                      {q.customer && (
                        <div className="text-xs text-gray-600">
                          Customer: <span className="font-medium text-gray-900">{q.customer.name}</span>
                          {q.customer.customerType && <span className="ml-2">({q.customer.customerType})</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setLocation(`/quotations/${q.id}`)}>
                        <Eye className="h-4 w-4 mr-1" /> Edit Quote
                      </Button>
                    </div>
                  </div>
                )
              }),
              'Under Review': (q) => ({
                extraCompleted: [],
                currentStep: 4,
                card: (
                  <div className="bg-white rounded-lg shadow border p-4 mt-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg text-gray-900">
                          <span role="img" aria-label="hourglass">⏳</span> Internal Review Pending
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        Quote #{q.quoteNumber} awaiting internal approval.
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setLocation(`/quotations/${q.id}`)}>
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </div>
                  </div>
                )
              }),
              Approved: (q) => ({
                extraCompleted: [],
                currentStep: 4,
                card: (
                  <div className="bg-white rounded-lg shadow border p-4 mt-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg text-gray-900">
                          <span role="img" aria-label="flag">🏁</span> Ready To Send
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        Quote #{q.quoteNumber} approved. Send to customer to progress.
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="success" onClick={() => setLocation(`/quotations/${q.id}`)}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Send Quote
                      </Button>
                    </div>
                  </div>
                )
              }),
              Sent: (q) => ({
                extraCompleted: [4],
                currentStep: 5,
                card: (
                  <div className="bg-white rounded-lg shadow border p-4 mt-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg text-gray-900">
                          <span role="img" aria-label="flag">🏁</span> Current Step: Customer Acceptance
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 mb-1">
                        <span className="text-sm">
                          <FaFileInvoice className="inline-block mr-1 text-gray-500" />
                          Quote #{q.quoteNumber} - Waiting for customer response
                        </span>
                      </div>
                      {q.customer && (
                        <div className="text-xs text-gray-600">
                          Customer: <span className="font-medium text-gray-900">{q.customer.name}</span>
                          {q.customer.customerType && (
                            <span className="ml-2">({q.customer.customerType})</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setLocation(`/quotations/${q.id}`)}>
                        <Eye className="h-4 w-4 mr-1" /> View Details
                      </Button>
                    </div>
                  </div>
                )
              }),
              Accepted: (q) => ({
                extraCompleted: [4, 5, 6],
                currentStep: 7,
                card: (
                  <div className="bg-white rounded-lg shadow border p-4 mt-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg text-gray-900">
                          <span role="img" aria-label="check">✅</span> Current Step: Sales Order
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 mb-1">
                        <span className="text-sm">
                          <FaFileInvoice className="inline-block mr-1 text-gray-500" />
                          Quote #{q.quoteNumber} accepted by customer
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="success" onClick={() => setLocation(`/sales-orders/new?fromQuote=${q.id}`)}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Create Sales Order
                      </Button>
                    </div>
                  </div>
                )
              }),
              Rejected: (q) => ({
                extraCompleted: [],
                currentStep: 4,
                card: (
                  <div className="bg-white rounded-lg shadow border p-4 mt-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg text-gray-900">
                          <span role="img" aria-label="cross">❌</span> Quote Rejected Internally
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">Revise pricing or terms and resubmit.</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setLocation(`/quotations/${q.id}`)}>
                        <Eye className="h-4 w-4 mr-1" /> Revise
                      </Button>
                    </div>
                  </div>
                )
              }),
              'Rejected by Customer': (q) => ({
                extraCompleted: [4], // It was sent, so mark step 4 complete
                currentStep: 5,
                card: (
                  <div className="bg-white rounded-lg shadow border p-4 mt-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg text-gray-900">
                          <span role="img" aria-label="warning">⚠️</span> Customer Rejected Quote
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">Review feedback and issue a revised quotation.</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setLocation(`/quotations/${q.id}`)}>
                        <Eye className="h-4 w-4 mr-1" /> Open Quote
                      </Button>
                    </div>
                  </div>
                )
              }),
              Expired: (q) => ({
                extraCompleted: [],
                currentStep: 4,
                card: (
                  <div className="bg-white rounded-lg shadow border p-4 mt-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg text-gray-900">
                          <span role="img" aria-label="timer">⌛</span> Quotation Expired
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">Create a new revision to continue.</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setLocation(`/quotations/${q.id}`)}>
                        <Eye className="h-4 w-4 mr-1" /> Revise Quote
                      </Button>
                    </div>
                  </div>
                )
              })
            };

            const handler = statusHandlers[status] || ((q: any) => ({ extraCompleted: [], currentStep: 4, card: null }));
            const result = handler(latestQuote);
            if (result.extraCompleted.length) {
              completedSteps.push(...result.extraCompleted);
              currentStep = result.currentStep;
            } else {
              // If no extra steps complete but handler advanced currentStep, honor it
              currentStep = result.currentStep;
            }
            reflectionCard = result.card;
            currentQuote = latestQuote;
          }
          // Step 7: Sales Order exists
          if (sortedOrders.length > 0) {
            completedSteps.push(7);
            currentStep = 8;
            // You can extend this logic for further steps (Supplier LPO, Goods Receipt, etc.)
          }

          // If there is no enquiry yet show a subtle hint card under the placeholder
          if (filteredEnquiries.length === 0) {
            reflectionCard = reflectionCard || (
              <div className="bg-white rounded-lg shadow border p-4 mt-4 text-sm text-gray-700">
                No enquiries found for this customer yet. Start by creating a new enquiry.
              </div>
            );
          }

          return (
            <div>
              <WorkflowStepper
                currentStep={currentStep}
                completedSteps={completedSteps}
                quotationId={currentQuote?.id}
                quotationNumber={currentQuote?.quoteNumber || "QT-2024-001"}
                quotationStatus={currentQuote?.status}
                onMarkComplete={() => {
                  if (currentQuote?.id) {
                    setLocation(`/quotations/${currentQuote.id}/acceptance`);
                  } else {
                    setLocation('/quotations/new');
                  }
                }}
                onViewDetails={() => {
                  setLocation(`/process-flow-details?customerId=${selectedCustomerId}`);
                }}
                reflectionCard={reflectionCard}
              />
            </div>
          );
        })()}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
        <div className="kpi-card shadow-lg">
          <div className="kpi-card-content">
            <div className="flex items-start justify-between">
              <div className="kpi-icon bg-amber-100 flex-shrink-0 mr-4">
                <FaRegCheckCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="kpi-label">Active Enquiries</p>
                <p className="kpi-value" data-testid="stat-active-enquiries">
                  {statsLoading ? "..." : stats?.activeEnquiries || 0}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 kpi-trend-up mr-1" />
              <span className="kpi-trend-up">+12%</span>
              <span className="text-gray-600 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <div className="kpi-card shadow-lg">
          <div className="kpi-card-content">
            <div className="flex items-start justify-between">
              <div className="kpi-icon bg-gray-100 flex-shrink-0 mr-4">
                <FaFileInvoice className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="kpi-label">Pending Quotes</p>
                <p className="kpi-value" data-testid="stat-pending-quotes">
                  {statsLoading ? "..." : stats?.pendingQuotes || 0}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDown className="h-4 w-4 kpi-trend-down mr-1" />
              <span className="kpi-trend-down">-5%</span>
              <span className="text-gray-600 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <div className="kpi-card shadow-lg">
          <div className="kpi-card-content">
            <div className="flex items-start justify-between">
              <div className="kpi-icon bg-green-100 flex-shrink-0 mr-4">
                <FaShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="kpi-label">Active Orders</p>
                <p className="kpi-value" data-testid="stat-active-orders">
                  {statsLoading ? "..." : stats?.activeOrders || 0}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 kpi-trend-up mr-1" />
              <span className="kpi-trend-up">+8%</span>
              <span className="text-gray-600 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <div className="kpi-card shadow-lg">
          <div className="kpi-card-content">
            <div className="flex items-start justify-between">
              <div className="kpi-icon bg-green-100 flex-shrink-0 mr-4">
                <FaDollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="kpi-label">Revenue (Month)</p>
                <p
                  className="kpi-value" 
                  data-testid="stat-monthly-revenue"
                  title={statsLoading ? undefined : formatCurrencyCompact(stats?.monthlyRevenue || 0).full}
                >
                  {statsLoading ? "..." : formatCurrencyCompact(stats?.monthlyRevenue || 0).short}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 kpi-trend-up mr-1" />
              <span className="kpi-trend-up">+23%</span>
              <span className="text-gray-600 ml-1">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Enquiries Progress Section */}

      {/* AI Insights Widget */}
      <div className="mb-8">
        <AIInsightsWidget page="/dashboard" data={stats} className="shadow-lg" />
      </div>

      {/* Workflow Progress Overview */}
      <div className="mb-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Workflow Progress Overview</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/workflow-dashboard")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Full Dashboard
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WorkflowProgressTracker showAnalytics={true} />
          </CardContent>
        </Card>
      </div>

      {/* Notification Demo */}
      <div className="mb-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaBell className="h-5 w-5 text-blue-600" />
              Notification System Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationDemo />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Current Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activities */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FaHistory className="h-5 w-5 text-gray-600" />
              Recent Activities
            </CardTitle>
            <Button variant="ghost" size="sm" data-testid="button-view-all-activities" onClick={() => setLocation("/recent-activities")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900" data-testid={`activity-${activity.id}`}>
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Tasks */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FaTasks className="h-5 w-5 text-red-600" />
              Tasks Requiring Action
            </CardTitle>
            <Badge className="bg-red-500 text-white" data-testid="badge-urgent-tasks">
              5 Urgent
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {urgentTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${getPriorityColor(task.priority)} ${isTaskCompleted(task.id) ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)}`}></div>
                    <div>
                      <p className={`text-sm font-medium text-gray-900 ${isTaskCompleted(task.id) ? 'line-through' : ''}`} data-testid={`task-title-${task.id}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-600" data-testid={`task-description-${task.id}`}>
                        {task.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isTaskCompleted(task.id) ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <FaCheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleTaskAction(task)}
                          data-testid={`button-${task.action.toLowerCase()}-${task.id}`}
                        >
                          {task.action}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCompletedTasks(prev => [...prev, task.id])}
                          data-testid={`button-mark-complete-${task.id}`}
                        >
                          <FaCheckCircle className="h-4 w-4 mr-1" />
                          Mark Complete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables Section (Enquiries & Orders) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Enquiries */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FaQuestionCircle className="h-5 w-5 text-blue-600" />
              Recent Enquiries
            </CardTitle>
            <Button variant="ghost" size="sm" data-testid="button-manage-all-enquiries" onClick={() => setLocation("/enquiries")}> 
              Manage All
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredEnquiriesTable}
              columns={enquiryColumns}
              isLoading={enquiriesLoading}
              emptyMessage="No enquiries found"
            />
          </CardContent>
        </Card>
        
        {/* Active Orders */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FaCheckCircle className="h-5 w-5 text-green-600" />
              Active Sales Orders
            </CardTitle>
            <Button variant="ghost" size="sm" data-testid="button-view-all-orders" onClick={() => setLocation("/sales-orders")}> 
              View All Orders
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredOrdersTable}
              columns={orderColumns}
              isLoading={ordersLoading}
              emptyMessage="No active orders found"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
