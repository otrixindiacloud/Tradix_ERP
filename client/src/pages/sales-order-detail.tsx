import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
// Status badge class helper
const getStatusBadgeClass = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'draft':
      return "bg-gray-50 text-gray-700 border-gray-200";
    case 'under review':
    case 'pending':
      return "border-orange-500 text-orange-600 hover:bg-orange-50";
    case 'approved':
      return "bg-teal-50 text-teal-700 border-teal-200";
    case 'sent':
      return "bg-blue-50 text-blue-700 border-blue-200";
    case 'accepted':
    case 'completed':
      return "bg-green-50 text-green-700 border-green-200";
    case 'rejected':
    case 'rejected by customer':
      return "bg-red-50 text-red-700 border-red-200";
    case 'expired':
      return "bg-red-50 text-red-700 border-red-200";
    case 'cancelled':
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusPill from "@/components/status/status-pill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, Edit, Trash2, FileText, Truck, Package, 
  AlertCircle, CheckCircle, Clock, Copy, RefreshCw,
  Eye, Download, Upload, FileCheck, Building2, User, Mail, Phone
} from "lucide-react";
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUserId } from "@/hooks/useUserId";
import { apiRequest } from "@/lib/queryClient";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import type { SalesOrder, SalesOrderItem, Customer } from "@shared/schema";

interface SalesOrderWithRelations extends SalesOrder {
  customer?: Customer;
  items?: SalesOrderItem[];
}

export default function SalesOrderDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showAmendDialog, setShowAmendDialog] = useState(false);
  const [showLpoValidationDialog, setShowLpoValidationDialog] = useState(false);
  const [showCustomerDetailsDialog, setShowCustomerDetailsDialog] = useState(false);
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
  const userId = useUserId();

  // Fetch sales order details
  const { data: salesOrder, isLoading, error } = useQuery<SalesOrderWithRelations>({
    queryKey: ["/api/sales-orders", id],
    queryFn: async () => {
      const response = await fetch(`/api/sales-orders/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch sales order: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Fetch sales order items
  const { data: salesOrderItems = [] } = useQuery<SalesOrderItem[]>({
    queryKey: ["/api/sales-orders", id, "items"],
    queryFn: async () => {
      const response = await fetch(`/api/sales-orders/${id}/items`);
      if (!response.ok) {
        throw new Error(`Failed to fetch sales order items: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Mutations
  const updateOrderStatus = useMutation({
    mutationFn: async ({ status }: { status: string }) => {
      const response = await apiRequest("PUT", `/api/sales-orders/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-orders", id] });
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
    mutationFn: async ({ reason }: { reason: string }) => {
      const response = await apiRequest("POST", `/api/sales-orders/${id}/amend`, {
        reason,
        userId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-orders"] });
      setShowAmendDialog(false);
      setAmendmentReason("");
      toast({
        title: "Success",
        description: "Amended sales order created successfully",
      });
      // Navigate to the new amended order
      if (data?.id) {
        setLocation(`/sales-orders/${data.id}`);
      }
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
    mutationFn: async ({ status, notes }: { status: string; notes?: string }) => {
      const response = await apiRequest("PUT", `/api/sales-orders/${id}/validate-lpo`, {
        status,
        notes,
        validatedBy: userId,
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-orders", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/sales-orders"] });
      setShowLpoValidationDialog(false);
      setLpoValidationStatus("");
      setLpoValidationNotes("");
      const status = variables?.status;
      const orderNum = data?.orderNumber || salesOrder?.orderNumber;
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
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/sales-orders/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-orders"] });
      toast({
        title: "Success",
        description: "Sales order deleted successfully",
      });
      setLocation("/sales-orders");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete sales order",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !salesOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Sales Order Not Found</h3>
          <p className="text-gray-600 mt-1">
            {error?.message || "The sales order you're looking for doesn't exist or has been removed."}
          </p>
          <Button 
            className="mt-4" 
            onClick={() => setLocation("/sales-orders")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/sales-orders")}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {salesOrder.orderNumber}
                </h1>
                {salesOrder.version && salesOrder.version > 1 && (
                  <Badge variant="outline">Version {salesOrder.version}</Badge>
                )}
                {salesOrder.parentOrderId && (
                  <Badge variant="outline" className="text-orange-600">
                    AMENDED
                  </Badge>
                )}
                {salesOrder.isPartialOrder && (
                  <Badge variant="outline" className="text-blue-600">
                    PARTIAL ORDER
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mt-1">
                Sales Order Details • {salesOrder.customer?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <StatusPill status={salesOrder.status?.toLowerCase() || 'draft'} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {salesOrder.status === "Draft" && (
              <Button
                onClick={() => {
                  setConfirmDialog({
                    open: true,
                    title: "Confirm Sales Order",
                    description: `Are you sure you want to confirm sales order ${salesOrder.orderNumber}? This action cannot be undone.`,
                    onConfirm: () => updateOrderStatus.mutate({ status: "Confirmed" }),
                  });
                }}
                disabled={updateOrderStatus.isPending}
                variant="outline"
                className={getStatusBadgeClass("accepted")}
              >
                {updateOrderStatus.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Order
                  </>
                )}
              </Button>
            )}
            
            {salesOrder.status === "Confirmed" && salesOrder.customerLpoValidationStatus === "Approved" && (
              <Button
                onClick={() => updateOrderStatus.mutate({ status: "Processing" })}
                variant="outline"
                className={getStatusBadgeClass("pending")}
              >
                <Package className="h-4 w-4 mr-2" />
                Start Processing
              </Button>
            )}
            
            {salesOrder.status === "Processing" && (
              <Button
                onClick={() => updateOrderStatus.mutate({ status: "Shipped" })}
                variant="outline"
                className={getStatusBadgeClass("sent")}
              >
                <Truck className="h-4 w-4 mr-2" />
                Mark as Shipped
              </Button>
            )}
            
            {salesOrder.customerLpoRequired && salesOrder.customerLpoValidationStatus === "Pending" && (
              <Button
                onClick={() => setShowLpoValidationDialog(true)}
                variant="outline"
                className={getStatusBadgeClass("pending")}
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Validate Customer LPO
              </Button>
            )}
            
            <Button
              onClick={() => setShowAmendDialog(true)}
              variant="outline"
              className={getStatusBadgeClass("under review")}
            >
              <Edit className="h-4 w-4 mr-2" />
              Create Amendment
            </Button>
            
            {salesOrder.status === "Draft" && (
              <Button
                onClick={() => {
                  setConfirmDialog({
                    open: true,
                    title: "Delete Sales Order",
                    description: `Are you sure you want to delete sales order ${salesOrder.orderNumber}? This action cannot be undone.`,
                    onConfirm: () => deleteSalesOrder.mutate(),
                    variant: "destructive",
                  });
                }}
                variant="outline"
                className={getStatusBadgeClass("rejected")}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Order
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="items">Items ({salesOrderItems.length})</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Order Number</label>
                      <p className="font-mono text-lg">{salesOrder.orderNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1">
                        <StatusPill status={salesOrder.status?.toLowerCase() || 'draft'} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Source Type</label>
                      <p>{salesOrder.sourceType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Order Date</label>
                      <p>{salesOrder.orderDate ? formatDate(new Date(salesOrder.orderDate)) : "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Customer PO Number</label>
                      <p className="font-mono">{salesOrder.customerPoNumber || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Version</label>
                      <p>{salesOrder.version || 1}</p>
                    </div>
                  </div>
                  
                  {salesOrder.amendmentReason && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Amendment Reason</label>
                      <p className="text-sm bg-orange-50 border border-orange-200 rounded p-3 mt-1">
                        {salesOrder.amendmentReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {salesOrder.customerLpoRequired && (
                <Card>
                  <CardHeader>
                    <CardTitle>Customer LPO Validation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <div className="mt-1">
                          <StatusPill status={(salesOrder.customerLpoValidationStatus || 'pending').toLowerCase()} />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Validated By</label>
                        <p>{salesOrder.customerLpoValidatedBy || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Validated At</label>
                        <p>{salesOrder.customerLpoValidatedAt ? formatDate(salesOrder.customerLpoValidatedAt) : "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Subtotal</label>
                      <p className="text-lg font-semibold">{formatCurrency(Number(salesOrder.subtotal) || 0)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tax Amount</label>
                      <p className="text-lg font-semibold">{formatCurrency(Number(salesOrder.taxAmount) || 0)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Amount</label>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(Number(salesOrder.totalAmount) || 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {(salesOrder.paymentTerms || salesOrder.deliveryInstructions) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Terms & Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {salesOrder.paymentTerms && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                        <p className="text-sm mt-1">{salesOrder.paymentTerms}</p>
                      </div>
                    )}
                    {salesOrder.deliveryInstructions && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Delivery Instructions</label>
                        <p className="text-sm mt-1">{salesOrder.deliveryInstructions}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="items" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {salesOrderItems.length > 0 ? (
                    <div className="space-y-4">
                      {salesOrderItems.map((item, index) => (
                        <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="grid grid-cols-6 gap-4">
                            <div>
                              <label className="text-xs font-medium text-gray-500">Line #</label>
                              <p className="font-medium">{item.lineNumber}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Supplier Code</label>
                              <p className="font-mono text-sm">{item.itemId}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Barcode</label>
                              <p className="font-mono text-sm text-blue-600">
                                {'barcode' in item && (item as any).barcode
                                  ? (item as any).barcode
                                  : <span className="text-gray-400 italic">(not captured)</span>}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Quantity</label>
                              <p className="font-medium">{item.quantity}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Unit Price</label>
                              <p className="font-medium">{formatCurrency(Number(item.unitPrice) || 0)}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Total Price</label>
                              <p className="font-bold text-blue-600">{formatCurrency(Number(item.totalPrice) || 0)}</p>
                            </div>
                          </div>
                          {item.specialInstructions && (
                            <div className="mt-3 pt-3 border-t">
                              <label className="text-xs font-medium text-gray-500">Special Instructions</label>
                              <p className="text-sm mt-1">{item.specialInstructions}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No items found for this sales order.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Version History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4 bg-green-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Version {salesOrder.version || 1}</p>
                          <p className="text-sm text-gray-600">Current Version</p>
                          {salesOrder.amendmentReason && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Reason:</span> {salesOrder.amendmentReason}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="border-green-500 text-green-600">Current</Badge>
                      </div>
                    </div>
                    
                    {salesOrder.parentOrderId && (
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Parent Order</p>
                            <p className="text-sm text-gray-600">Original sales order</p>
                          </div>
                          <Badge variant="outline">Previous</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Customer Information Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Customer Name</label>
                <p className="font-medium">{salesOrder.customer?.name || "Unknown Customer"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Customer Type</label>
                <p>{salesOrder.customer?.customerType || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Classification</label>
                <p>{salesOrder.customer?.classification || "N/A"}</p>
              </div>
              {salesOrder.customer?.email && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm">{salesOrder.customer.email}</p>
                </div>
              )}
              {salesOrder.customer?.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm">{salesOrder.customer.phone}</p>
                </div>
              )}
              {salesOrder.customer?.address && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-sm">{salesOrder.customer.address}</p>
                </div>
              )}
              <div className="pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomerDetailsDialog(true)}
                  className="w-full"
                >
                  <User className="h-4 w-4 mr-2" />
                  View Customer Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Amendment Dialog */}
      <Dialog open={showAmendDialog} onOpenChange={setShowAmendDialog}>
        <DialogContent>
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
              />
            </div>
            <p className="text-sm text-gray-600">
              This will create a new version of the sales order with version {(salesOrder.version || 1) + 1}.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" className={getStatusBadgeClass("cancelled")} onClick={() => setShowAmendDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (amendmentReason.trim()) {
                  createAmendedOrder.mutate({ reason: amendmentReason.trim() });
                }
              }}
              disabled={!amendmentReason.trim() || createAmendedOrder.isPending}
              variant="outline"
              className={getStatusBadgeClass("sent")}
            >
              {createAmendedOrder.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Create Amendment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* LPO Validation Dialog */}
      <Dialog open={showLpoValidationDialog} onOpenChange={setShowLpoValidationDialog}>
        <DialogContent>
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
              />
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-medium">Order: {salesOrder.orderNumber}</p>
              <p className="text-sm text-gray-600">Customer PO: {salesOrder.customerPoNumber}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className={getStatusBadgeClass("cancelled")} onClick={() => setShowLpoValidationDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (lpoValidationStatus) {
                  validateCustomerLpo.mutate({
                    status: lpoValidationStatus,
                    notes: lpoValidationNotes.trim() || undefined,
                  });
                }
              }}
              disabled={!lpoValidationStatus || validateCustomerLpo.isPending}
              variant="outline"
              className={getStatusBadgeClass("approved")}
            >
              {validateCustomerLpo.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Validate LPO'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Details Dialog */}
      <Dialog open={showCustomerDetailsDialog} onOpenChange={setShowCustomerDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Customer Details
            </DialogTitle>
            <DialogDescription>
              Complete customer information and profile details
            </DialogDescription>
          </DialogHeader>
          {salesOrder.customer && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Customer Name</label>
                    <p className="text-lg font-semibold text-gray-900">{salesOrder.customer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Customer Type</label>
                    <div className="mt-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {salesOrder.customer.customerType}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Classification</label>
                    <div className="mt-1">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {salesOrder.customer.classification}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Customer ID</label>
                    <p className="font-mono text-sm text-gray-600">{salesOrder.customer.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created Date</label>
                    <p className="text-sm text-gray-600">
                      {salesOrder.customer.createdAt ? formatDate(new Date(salesOrder.customer.createdAt)) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-sm text-gray-600">
                      {salesOrder.customer.updatedAt ? formatDate(new Date(salesOrder.customer.updatedAt)) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-900">
                        {salesOrder.customer.email || "No email provided"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-900">
                        {salesOrder.customer.phone || "No phone provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              {salesOrder.customer.address && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Address</h4>
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <p className="text-sm text-gray-900 whitespace-pre-line">
                      {salesOrder.customer.address}
                    </p>
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {salesOrder.customer.taxId && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tax ID</label>
                      <p className="font-mono text-sm text-gray-900 mt-1">{salesOrder.customer.taxId}</p>
                    </div>
                  )}
                  {salesOrder.customer.paymentTerms && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                      <p className="text-sm text-gray-900 mt-1">{salesOrder.customer.paymentTerms}</p>
                    </div>
                  )}
                  {salesOrder.customer.creditLimit && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Credit Limit</label>
                      <p className="text-sm text-gray-900 mt-1 font-semibold">
                        {formatCurrency(Number(salesOrder.customer.creditLimit))}
                      </p>
                    </div>
                  )}
                  {/* Notes field removed: not present on Customer type */}
                </div>
              </div>

              {/* Customer Statistics */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">-</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">-</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">-</p>
                    <p className="text-sm text-gray-600">Avg Order Value</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Statistics will be available in a future update
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setLocation(`/customers/${salesOrder.customer?.id}`)}
              className={getStatusBadgeClass("sent") + " flex items-center gap-2"}
            >
              <Eye className="h-4 w-4" />
              View Full Profile
            </Button>
            <Button className={getStatusBadgeClass("cancelled")} onClick={() => setShowCustomerDetailsDialog(false)}>
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