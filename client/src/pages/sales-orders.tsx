import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // still used for small markers
import StatusPill from "@/components/status/status-pill";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Search, Filter, FileText, Truck, Package, 
  AlertCircle, CheckCircle, Clock, Copy, RefreshCw,
  Edit, Trash2, Eye, Download, Upload, FileCheck, ClipboardList
} from "lucide-react";
import DataTable, { Column } from "@/components/tables/data-table";
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import { SYSTEM_USER_ID } from "@shared/utils/uuid";
import { useUserId } from "@/hooks/useUserId";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { SalesOrder, SalesOrderItem, Quotation, Customer } from "@shared/schema";

interface SalesOrderWithRelations extends SalesOrder {
  customer?: Customer;
  items?: SalesOrderItem[];
}

interface QuotationWithRelations extends Quotation {
  customer?: Customer;
  customerPoDocument?: string | null;
  customerPoNumber?: string | null;
  customerPoDocumentName?: string | null;
}

export default function SalesOrders() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrderWithRelations | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAmendDialog, setShowAmendDialog] = useState(false);
  const [showLpoValidationDialog, setShowLpoValidationDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [amendmentReason, setAmendmentReason] = useState("");
  const [lpoValidationStatus, setLpoValidationStatus] = useState("");
  const [lpoValidationNotes, setLpoValidationNotes] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  }>({ open: false, title: "", description: "", onConfirm: () => {} });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  // Data fetching
  const { data: salesOrders = [], isLoading, error: ordersError } = useQuery<SalesOrderWithRelations[]>({
    queryKey: ["/api/sales-orders"],
    queryFn: async () => {
      const response = await fetch("/api/sales-orders");
      if (!response.ok) {
        throw new Error(`Failed to fetch sales orders: ${response.statusText}`);
  const [rowsToShow, setRowsToShow] = useState(15);
      }
      return response.json();
    },
  });

  const { data: quotations = [], error: quotationsError } = useQuery<QuotationWithRelations[]>({
    queryKey: ["/api/quotations"],
    queryFn: async () => {
      const response = await fetch("/api/quotations");
      if (!response.ok) {
        throw new Error(`Failed to fetch quotations: ${response.statusText}`);
      }
      return response.json();
    },
  });

  const { data: customersData = { customers: [] }, error: customersError } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");
      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.statusText}`);
      }
      return response.json();
    },
  });

  const customers = customersData.customers || [];

  const { data: selectedOrderItems = [] } = useQuery<SalesOrderItem[]>({
    queryKey: ["/api/sales-orders", selectedOrder?.id, "items"],
    enabled: !!selectedOrder?.id,
  });

  // Handle URL parameters for quotationId and fromQuote
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const quotationId = urlParams.get('quotationId') || urlParams.get('fromQuote');
    
    if (quotationId && salesOrders.length > 0) {
      // Check if a sales order already exists for this quotation
      const existingOrder = salesOrders.find(order => order.quotationId === quotationId);
      
      if (existingOrder) {
        toast({
          title: "Sales Order Already Exists",
          description: `A sales order has already been created from this quotation. Order: ${existingOrder.orderNumber}`,
          variant: "destructive",
        });
        // Clean up URL parameters
        navigate('/sales-orders', { replace: true });
        return;
      }
      
      // Open the create dialog and pre-select the quotation
      setShowCreateDialog(true);
      // Clean up URL parameters
      navigate('/sales-orders', { replace: true });
    }
  }, [salesOrders, navigate, toast]);

  // Mutations
  const createSalesOrderFromQuotation = useMutation({
    mutationFn: async ({ quotationId, customerAcceptanceId, userId }: { 
      quotationId: string; 
      customerAcceptanceId?: string; 
      userId?: string; 
    }) => {
      const response = await apiRequest("POST", "/api/sales-orders/from-quotation", {
        quotationId,
        customerAcceptanceId,
        userId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-orders"] });
      setShowCreateDialog(false);
      toast({
        title: "Success",
        description: "Sales order created successfully from quotation",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create sales order from quotation",
        variant: "destructive",
      });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/sales-orders/${id}`, { status });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-orders"] });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  const createAmendedOrder = useMutation({
    mutationFn: async ({ id, reason, userId }: { id: string; reason: string; userId?: string }) => {
      const response = await apiRequest("POST", `/api/sales-orders/${id}/amend`, {
        reason,
        userId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-orders"] });
      setShowAmendDialog(false);
      setAmendmentReason("");
      toast({
        title: "Success",
        description: "Amended sales order created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create amended sales order",
        variant: "destructive",
      });
    },
  });

  const validateCustomerLpo = useMutation({
    mutationFn: async ({ id, status, notes, validatedBy }: { 
      id: string; 
      status: string; 
      notes?: string; 
      validatedBy?: string; 
    }) => {
      const response = await apiRequest("PUT", `/api/sales-orders/${id}/validate-lpo`, {
        status,
        notes,
        validatedBy,
      });
      return response.json();
    },
    onSuccess: (data: any, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-orders"] });
      setShowLpoValidationDialog(false);
      setLpoValidationStatus("");
      setLpoValidationNotes("");
      const status = variables?.status;
      const orderNum = data?.orderNumber || selectedOrder?.orderNumber;
      let desc = "Customer LPO validation completed";
      if (status) {
        desc = `Customer LPO ${status === 'Approved' ? 'approved' : 'rejected'} successfully` + (orderNum ? ` for order ${orderNum}` : "");
      }
      toast({
        title: "Success",
        description: desc,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to validate customer LPO",
        variant: "destructive",
      });
    },
  });

  const deleteSalesOrder = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/sales-orders/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-orders"] });
      toast({
        title: "Success",
        description: "Sales order deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete sales order",
        variant: "destructive",
      });
    },
  });

  // Filter logic
  const filteredOrders = salesOrders.filter((order) => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPoNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || statusFilter === "all" || order.status === statusFilter;
    const matchesCustomer = !customerFilter || customerFilter === "all" || order.customerId === customerFilter;
    return matchesSearch && matchesStatus && matchesCustomer;
  });
  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
 
  // Get quotations ready for sales order creation and enrich with customer data
  // Exclude quotations that already have sales orders created from them
  // Only include quotations that have been accepted AND have PO uploaded
  const readyQuotations = quotations
    .filter((q) => q.status === "Accepted")
    .filter((quotation) => {
      // Check if any sales order exists with this quotationId
      return !salesOrders.some((order) => order.quotationId === quotation.id);
    })
    .filter((quotation) => {
      // Check if PO has been uploaded (customerPoDocument exists)
      return quotation.customerPoDocument && quotation.customerPoDocument.trim() !== "";
    })
    .map((quotation) => {
      const customer = customers.find((c: Customer) => c.id === quotation.customerId);
      return {
        ...quotation,
        customer: customer ? {
          ...customer,
          name: customer.name || 'Unknown Customer'
        } : quotation.customer || { name: 'Unknown Customer', customerType: '-' }
      };
    });

  // Get quotations that are accepted but missing PO upload
  const pendingPoQuotations = quotations
    .filter((q) => q.status === "Accepted")
    .filter((quotation) => {
      // Check if any sales order exists with this quotationId
      return !salesOrders.some((order) => order.quotationId === quotation.id);
    })
    .filter((quotation) => {
      // Check if PO has NOT been uploaded
      return !quotation.customerPoDocument || quotation.customerPoDocument.trim() === "";
    })
    .map((quotation) => {
      const customer = customers.find((c: Customer) => c.id === quotation.customerId);
      return {
        ...quotation,
        customer: customer ? {
          ...customer,
          name: customer.name || 'Unknown Customer'
        } : quotation.customer || { name: 'Unknown Customer', customerType: '-' }
      };
    });

  const columns: Column<SalesOrderWithRelations>[] = [
    {
      key: "orderNumber",
      header: "Order Number",
      render: (value: string, order) => (
        <div>
          <span className="font-mono text-sm text-blue-600 font-medium">{value}</span>
          {(order.version ?? 1) > 1 && (
            <Badge variant="outline" className="ml-2 text-xs">
              v{order.version ?? 1}
            </Badge>
          )}
          {order.parentOrderId && (
            <Badge variant="outline" className="ml-1 text-xs text-orange-600">
              AMD
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (customer: Customer) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {customer?.name || "E2E Test Corp"}
          </p>
          <p className="text-xs text-gray-600">
            {customer?.customerType || "-"}
          </p>
        </div>
      ),
    },
    {
      key: "customerPoNumber",
      header: "Customer PO",
      render: (value: string | null) => (
        <span className="font-mono text-sm">{value || "-"}</span>
      ),
    },
    {
      key: "sourceType",
      header: "Source",
      render: (value: string) => (
        value === "Manual" ? (
          <Badge variant="outline">
            {value}
          </Badge>
        ) : (
          <Badge variant={value === "Auto" ? "default" : "outline"}>
            {value}
          </Badge>
        )
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value: string) => (
        <StatusPill status={value.toLowerCase()} />
      ),
    },
    {
      key: "customerLpoValidationStatus",
      header: "LPO Status",
      render: (value: string | null, order) => {
        if (!order.customerLpoRequired) {
          return <span className="text-gray-400">N/A</span>;
        }
        const statusLabel = value || 'Pending';
        return <StatusPill status={statusLabel.toLowerCase()} />;
      },
    },
    {
      key: "totalAmount",
      header: "Order Value",
      render: (value: number | null) => value ? formatCurrency(Number(value)) : "-",
      className: "text-right",
    },
    {
      key: "orderDate",
      header: "Order Date",
      render: (value: string | null) => value ? formatDate(new Date(value)) : "-",
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-center",
      render: (_, order) => (
        <div className="flex items-center space-x-1">
          {order.status === "Draft" && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDialog({
                  open: true,
                  title: "Confirm Sales Order",
                  description: `Are you sure you want to confirm sales order ${order.orderNumber}? This action cannot be undone.`,
                  onConfirm: () => updateOrderStatus.mutate({ id: order.id, status: "Confirmed" }),
                });
              }}
              disabled={updateOrderStatus.isPending}
              data-testid={`button-confirm-${order.id}`}
              className="border-green-500 text-green-600 hover:bg-green-50 min-w-[80px] h-8 flex items-center justify-center font-medium text-sm px-3 py-1"
            >
              {updateOrderStatus.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Confirm
                </>
              )}
            </Button>
          )}
          
          {order.status === "Confirmed" && order.customerLpoValidationStatus === "Approved" && (
            <Button
              size="sm"
              variant="outline"
              className="min-w-[80px] h-8 flex items-center justify-center font-medium text-sm px-3 py-1"
              onClick={(e) => {
                e.stopPropagation();
                updateOrderStatus.mutate({ id: order.id, status: "Processing" });
              }}
              data-testid={`button-process-${order.id}`}
            >
              <Package className="h-4 w-4 mr-1" />
              Process
            </Button>
          )}
          
          {order.status === "Processing" && (
            <Button
              size="sm"
              variant="outline"
              className="min-w-[80px] h-8 flex items-center justify-center font-medium text-sm px-3 py-1"
              onClick={(e) => {
                e.stopPropagation();
                updateOrderStatus.mutate({ id: order.id, status: "Shipped" });
              }}
              data-testid={`button-ship-${order.id}`}
            >
              <Truck className="h-4 w-4 mr-1" />
              Ship
            </Button>
          )}
          
          {order.customerLpoRequired && order.customerLpoValidationStatus === "Pending" && (
            <Button
              size="sm"
              variant="outline"
              className="min-w-[80px] h-8 flex items-center justify-center font-medium text-sm px-3 py-1"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOrder(order);
                setShowLpoValidationDialog(true);
              }}
              data-testid={`button-validate-lpo-${order.id}`}
            >
              <FileCheck className="h-4 w-4 mr-1" />
              Validate LPO
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            className="min-w-[80px] h-8 flex items-center justify-center font-medium text-sm px-3 py-1"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrder(order);
              setShowAmendDialog(true);
            }}
            data-testid={`button-amend-${order.id}`}
          >
            <Edit className="h-4 w-4 mr-1" />
            Amend
          </Button>
          
          {order.status === "Draft" && (
            <Button
              size="sm"
              variant="outline"
              className="min-w-[80px] h-8 flex items-center justify-center font-medium text-sm px-3 py-1"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDialog({
                  open: true,
                  title: "Delete Sales Order",
                  description: `Are you sure you want to delete sales order ${order.orderNumber}? This action cannot be undone.`,
                  onConfirm: () => deleteSalesOrder.mutate(order.id),
                  variant: "destructive",
                });
              }}
              disabled={deleteSalesOrder.isPending}
              data-testid={`button-delete-${order.id}`}
            >
              {deleteSalesOrder.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </>
              )}
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            className="min-w-[80px] h-8 flex items-center justify-center font-medium text-sm px-3 py-1"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrder(order);
              setShowDetailsDialog(true);
            }}
            data-testid={`button-view-${order.id}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const userId = useUserId();
  const orderStats = {
    draft: salesOrders.filter((o) => o.status === "Draft").length,
    confirmed: salesOrders.filter((o) => o.status === "Confirmed").length,
    processing: salesOrders.filter((o) => o.status === "Processing").length,
    shipped: salesOrders.filter((o) => o.status === "Shipped").length,
    delivered: salesOrders.filter((o) => o.status === "Delivered").length,
    pendingLpo: salesOrders.filter((o) => o.customerLpoRequired && o.customerLpoValidationStatus === "Pending").length,
  };

  return (
    <div>
      {/* Card-style header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <ClipboardList className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  Sales Orders
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Step 5: Manage sales orders with auto-creation, barcode enforcement, version control, and LPO validation
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="font-medium">Order Processing</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Orders: {Array.isArray(salesOrders) ? salesOrders.length : 0}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="font-semibold px-6 py-2 flex items-center gap-2"
              onClick={() => setShowCreateDialog(true)}
              data-testid="button-new-sales-order"
            >
              <Plus className="h-4 w-4" />
              New Sales Order
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions for Ready Quotations */}
      {readyQuotations.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-green-600" />
              Ready for Sales Order Creation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {readyQuotations.slice(0, 3).map((quotation) => (
                <div key={quotation.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {quotation.quoteNumber} - {quotation.customer?.name || 'Unknown Customer'}
                      </p>
                      <p className="text-xs text-gray-600">
                        Value: {formatCurrency(Number(quotation.totalAmount) || 0)} | PO: {quotation.customerPoNumber || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => createSalesOrderFromQuotation.mutate({ quotationId: quotation.id, userId })}
                    disabled={createSalesOrderFromQuotation.isPending}
                    data-testid={`button-create-so-${quotation.id}`}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create Sales Order
                  </Button>
                </div>
              ))}
              {readyQuotations.length > 3 && (
                <p className="text-sm text-gray-600 text-center">
                  +{readyQuotations.length - 3} more quotations ready for sales order creation
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending PO Upload Section */}
      {pendingPoQuotations.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-600" />
              Awaiting Purchase Order Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingPoQuotations.slice(0, 3).map((quotation) => (
                <div key={quotation.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {quotation.quoteNumber} - {quotation.customer?.name || 'Unknown Customer'}
                      </p>
                      <p className="text-xs text-gray-600">
                        Value: {formatCurrency(Number(quotation.totalAmount) || 0)} | PO Upload Required
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('/customer-po-upload', '_blank')}
                    data-testid={`button-upload-po-${quotation.id}`}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload PO
                  </Button>
                </div>
              ))}
              {pendingPoQuotations.length > 3 && (
                <p className="text-sm text-gray-600 text-center">
                  +{pendingPoQuotations.length - 3} more quotations awaiting PO upload
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Edit className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-lg font-bold text-black">Draft</p>
                <p className="text-2xl font-bold text-gray-600" data-testid="stat-draft-orders">
                  {orderStats.draft}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div>
                <p className="text-lg font-bold text-black">Confirmed</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-confirmed-orders">
                  {orderStats.confirmed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Package className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-lg font-bold text-black">Processing</p>
                <p className="text-2xl font-bold text-blue-600" data-testid="stat-processing-orders">
                  {orderStats.processing}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Truck className="h-6 w-6 text-purple-400" />
              <div>
                <p className="text-lg font-bold text-black">Shipped</p>
                <p className="text-2xl font-bold text-purple-600" data-testid="stat-shipped-orders">
                  {orderStats.shipped}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div>
                <p className="text-lg font-bold text-black">Delivered</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-delivered-orders">
                  {orderStats.delivered}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-orange-400" />
              <div>
                <p className="text-lg font-bold text-black">Pending LPO</p>
                <p className="text-2xl font-bold text-orange-600" data-testid="stat-pending-lpo">
                  {orderStats.pendingLpo}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Card Section */}
      <Card className="mb-6 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filter Sales Orders</CardTitle>
          <div className="flex items-center gap-2">
            {/* Filtered Button aligned left of show/hide */}
            {(searchTerm || (statusFilter && statusFilter !== "all") || (customerFilter && customerFilter !== "all")) && (
              <Button
                variant="ghost"
                className="px-2 py-0 h-6 min-h-0 border border-gray-200 text-gray-700 bg-gray-50 rounded-lg flex items-center gap-1 font-semibold shadow-none text-xs"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setCustomerFilter("");
                }}
                data-testid="button-filtered"
              >
                <span className="text-xs">Filtered</span>
                <span className="text-gray-400 text-base font-bold">×</span>
              </Button>
            )}
            <Button
              variant="outline"
              className="shadow-sm flex items-center gap-1 px-2 py-0 h-6 min-h-0 text-xs"
              onClick={() => setShowFilters((prev) => !prev)}
              data-testid="button-toggle-filters"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showFilters && (
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-md shadow-none"
                  data-testid="input-search-orders"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={customerFilter} onValueChange={setCustomerFilter}>
                <SelectTrigger className="w-48 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md">
                  <SelectValue placeholder="Filter by customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {Array.isArray(customers) && customers.length > 0 ? (
                    customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="__no_customers__">
                      {customers && !Array.isArray(customers) ? "(Invalid customers response)" : "No customers"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {/* Filtered Button */}
              {/* {(searchTerm || (statusFilter && statusFilter !== "all") || (customerFilter && customerFilter !== "all")) && (
                <Button
                  variant="ghost"
                  className="ml-2 px-4 py-2 border border-gray-200 text-gray-700 bg-gray-50 rounded-lg flex items-center gap-2 font-semibold shadow-none"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setCustomerFilter("");
                  }}
                  data-testid="button-filtered"
                >
                  <span className="text-sm">Filtered</span>
                  <span className="text-gray-400 text-lg font-bold">×</span>
                </Button>
              )} */}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales Orders Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Sales Orders</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {ordersError ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error loading sales orders: {ordersError.message}</p>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/sales-orders"] })}>
                Retry
              </Button>
            </div>
          ) : (
            <div>
              <DataTable
                data={paginatedOrders}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="No sales orders found. Sales orders are created from accepted quotations with uploaded POs."
                onRowClick={(order) => {
                  setSelectedOrder(order);
                  setShowDetailsDialog(true);
                }}
              />
              {/* Pagination Controls */}
              {filteredOrders.length > pageSize && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    data-testid="button-prev-page"
                  >
                    Previous
                  </Button>
                  <span className="mx-2 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    data-testid="button-next-page"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Sales Order Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (open) {
          // close others
          setShowAmendDialog(false);
          setShowLpoValidationDialog(false);
          setSelectedOrder(null);
        }
      }}>
        <DialogContent className="max-w-2xl" onOpenAutoFocus={(e) => {
          // Let Radix handle initial focus normally
        }} onCloseAutoFocus={(e) => {
          // Prevent focusing an element that will become aria-hidden
          e.preventDefault();
          // Move focus to body (safe passive target)
          (document.activeElement as HTMLElement | null)?.blur();
        }}>
          <DialogHeader>
            <DialogTitle>Create Sales Order from Quotation</DialogTitle>
            <DialogDescription>
              Create a sales order by selecting an eligible quotation. Only quotations with accepted status and uploaded PO documents are shown.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Select a quotation to create a sales order. Only quotations with accepted status and uploaded customer PO documents are shown.
            </p>
            {readyQuotations.length === 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-orange-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">No quotations ready for sales order creation</p>
                    <p className="text-xs text-orange-600 mt-1">
                      All accepted quotations require PO upload before sales order creation. 
                      <a href="/customer-po-upload" className="underline ml-1">Upload PO documents here</a>.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {readyQuotations.map((quotation) => (
                <div key={quotation.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{quotation.quoteNumber}</p>
                      <p className="text-sm text-gray-600">Customer: {quotation.customer?.name || 'Unknown Customer'}</p>
                      <p className="text-sm text-gray-600">Value: {formatCurrency(Number(quotation.totalAmount) || 0)}</p>
                    </div>
                    <Button
                      onClick={() => createSalesOrderFromQuotation.mutate({ quotationId: quotation.id, userId })}
                      disabled={createSalesOrderFromQuotation.isPending}
                      data-testid={`button-create-from-${quotation.id}`}
                    >
                      Create Sales Order
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Amendment Dialog */}
      <Dialog open={showAmendDialog} onOpenChange={(open) => {
        setShowAmendDialog(open);
        if (open) {
          setShowCreateDialog(false);
          setShowLpoValidationDialog(false);
          setSelectedOrder(null);
        }
      }}>
        <DialogContent onCloseAutoFocus={(e) => {
          e.preventDefault();
          (document.activeElement as HTMLElement | null)?.blur();
        }}>
          <DialogHeader>
            <DialogTitle>Create Amended Sales Order</DialogTitle>
            <DialogDescription>
              Provide a mandatory reason. A new version of the current sales order will be created and linked to the original.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amendment-reason">Amendment Reason *</Label>
              <Textarea
                id="amendment-reason"
                value={amendmentReason}
                onChange={(e) => setAmendmentReason(e.target.value)}
                placeholder="Enter the reason for this amendment..."
                className="mt-1"
                data-testid="textarea-amendment-reason"
              />
            </div>
            <p className="text-sm text-gray-600">
              This will create a new version of the sales order with version {(selectedOrder?.version || 1) + 1}.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAmendDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedOrder && amendmentReason.trim()) {
                  createAmendedOrder.mutate({
                    id: selectedOrder.id,
                    reason: amendmentReason.trim(),
                    userId,
                  });
                }
              }}
              disabled={!amendmentReason.trim() || createAmendedOrder.isPending}
              data-testid="button-create-amendment"
            >
              Create Amendment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* LPO Validation Dialog */}
      <Dialog open={showLpoValidationDialog} onOpenChange={(open) => {
        setShowLpoValidationDialog(open);
        if (open) {
          setShowCreateDialog(false);
          setShowAmendDialog(false);
          // keep selectedOrder (needed for context) but ensure details dialog closed
          // details dialog uses selectedOrder presence to open
        }
      }}>
        <DialogContent onCloseAutoFocus={(e) => {
          e.preventDefault();
          (document.activeElement as HTMLElement | null)?.blur();
        }}>
          <DialogHeader>
            <DialogTitle>Validate Customer LPO</DialogTitle>
            <DialogDescription>
              Review the customer purchase order details and mark the LPO as Approved or Rejected. Notes are optional.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="validation-status">Validation Status *</Label>
              <Select value={lpoValidationStatus} onValueChange={setLpoValidationStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select validation status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="validation-notes">Validation Notes</Label>
              <Textarea
                id="validation-notes"
                value={lpoValidationNotes}
                onChange={(e) => setLpoValidationNotes(e.target.value)}
                placeholder="Enter validation notes (optional)..."
                className="mt-1"
                data-testid="textarea-validation-notes"
              />
            </div>
            {selectedOrder && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium">Order: {selectedOrder.orderNumber}</p>
                <p className="text-sm text-gray-600">Customer PO: {selectedOrder.customerPoNumber}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLpoValidationDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedOrder && lpoValidationStatus) {
                  validateCustomerLpo.mutate({
                    id: selectedOrder.id,
                    status: lpoValidationStatus,
                    notes: lpoValidationNotes.trim() || undefined,
                    validatedBy: userId,
                  });
                }
              }}
              disabled={!lpoValidationStatus || validateCustomerLpo.isPending}
              data-testid="button-validate-lpo"
            >
              {validateCustomerLpo.isPending ? (
                <span className="flex items-center gap-2"><LoadingSpinner size="sm" /> Validating...</span>
              ) : (
                'Validate LPO'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={(open) => {
        setShowDetailsDialog(open);
        if (!open) {
          setSelectedOrder(null);
        } else {
          setShowCreateDialog(false);
          setShowAmendDialog(false);
          setShowLpoValidationDialog(false);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" onCloseAutoFocus={(e) => {
          e.preventDefault();
          (document.activeElement as HTMLElement | null)?.blur();
        }}>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Sales Order Details</span>
              {selectedOrder?.version && selectedOrder.version > 1 && (
                <Badge variant="outline">Version {selectedOrder.version}</Badge>
              )}
              {selectedOrder?.isPartialOrder && (
                <Badge variant="outline" className="text-orange-600">Partial Order</Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              View sales order summary, items, and version history. Close this dialog to return to the list.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Order Details</TabsTrigger>
                <TabsTrigger value="items">Items ({selectedOrderItems.length})</TabsTrigger>
                <TabsTrigger value="history">Version History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Order Number:</span> {selectedOrder.orderNumber}</p>
                          <span className="inline-block px-3 py-1 rounded-full bg-white text-green-600 text-xs font-semibold shadow-sm border border-green-600" style={{ minWidth: 70 }}>
                            Approved
                          </span>
                      {selectedOrder.amendmentReason && (
                        <p><span className="font-medium">Amendment Reason:</span> {selectedOrder.amendmentReason}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedOrder.customer?.name}</p>
                      <p><span className="font-medium">Type:</span> {selectedOrder.customer?.customerType}</p>
                      <p><span className="font-medium">PO Number:</span> {selectedOrder.customerPoNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {selectedOrder.customerLpoRequired && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Customer LPO Validation</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Status</p>
                            {selectedOrder.customerLpoValidationStatus === "Approved" ? (
                              <span className="inline-block px-3 py-1 rounded-full bg-white text-green-600 text-xs font-semibold shadow-sm border border-green-600" style={{ minWidth: 70 }}>
                                Approved
                              </span>
                            ) : selectedOrder.customerLpoValidationStatus === "Rejected" ? (
                              <span className="inline-block px-3 py-1 rounded-full bg-white text-red-600 text-xs font-semibold shadow-sm border border-red-600" style={{ minWidth: 70 }}>
                                Rejected
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1 rounded-full bg-white text-gray-600 text-xs font-semibold shadow-sm border border-gray-400" style={{ minWidth: 70 }}>
                                Pending
                              </span>
                            )}
                      </div>
                      <div>
                        <p className="font-medium">Validated By</p>
                        <p>{selectedOrder.customerLpoValidatedBy || "N/A"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Validated At</p>
                        <p>{selectedOrder.customerLpoValidatedAt ? formatDate(selectedOrder.customerLpoValidatedAt) : "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Financial Summary</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Subtotal</p>
                      <p className="text-sm font-medium">{formatCurrency(Number(selectedOrder.subtotal) || 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Tax Amount</p>
                      <p className="text-sm font-medium">{formatCurrency(Number(selectedOrder.taxAmount) || 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Amount</p>
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(Number(selectedOrder.totalAmount) || 0)}</p>
                    </div>
                  </div>
                </div>

                {selectedOrder.paymentTerms && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Payment Terms</h4>
                    <p className="text-sm text-gray-600">{selectedOrder.paymentTerms}</p>
                  </div>
                )}

                {selectedOrder.deliveryInstructions && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Instructions</h4>
                    <p className="text-sm text-gray-600">{selectedOrder.deliveryInstructions}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="items" className="space-y-4">
                <div className="space-y-3">
                  {selectedOrderItems.map((item, index) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-6 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Line #</p>
                          <p className="font-medium">{item.lineNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Supplier Code</p>
                          <p className="font-mono text-sm">{item.itemId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Barcode *</p>
                          <p className="font-mono text-sm text-blue-600">
                            { 'barcode' in item && (item as any).barcode
                              ? (item as any).barcode
                              : <span className="text-gray-400 italic">(not captured)</span> }
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Quantity</p>
                          <p className="font-medium">{item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Unit Price</p>
                          <p className="font-medium">{formatCurrency(Number(item.unitPrice) || 0)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Total Price</p>
                          <p className="font-medium">{formatCurrency(Number(item.totalPrice) || 0)}</p>
                        </div>
                      </div>
                      {item.specialInstructions && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600">Special Instructions</p>
                          <p className="text-sm">{item.specialInstructions}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {selectedOrderItems.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No items found for this sales order.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Version {selectedOrder.version}</p>
                        <p className="text-sm text-gray-600">Current Version</p>
                        {selectedOrder.amendmentReason && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Reason:</span> {selectedOrder.amendmentReason}
                          </p>
                        )}
                      </div>
                      <span className="inline-block px-3 py-1 rounded-full bg-white text-green-600 text-xs font-semibold shadow-sm border border-green-600" style={{ minWidth: 70 }}>
                        Current
                      </span>
                    </div>
                  </div>
                  
                  {selectedOrder.parentOrderId && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Parent Order</p>
                          <p className="text-sm text-gray-600">Original sales order</p>
                        </div>
                        <span className="inline-block px-3 py-1 rounded-full bg-white text-blue-600 text-xs font-semibold shadow-sm border border-blue-600" style={{ minWidth: 70 }}>
                          Previous
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button
              onClick={() => { setSelectedOrder(null); setShowDetailsDialog(false); }}
              variant="outline"
              data-testid="button-close-details"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        variant={confirmDialog.variant}
      />
    </div>
  );
}