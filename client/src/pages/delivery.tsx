import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Filter, Truck, Package, FileText, Upload, Clock, CheckCircle, AlertCircle } from "lucide-react";
import DataTable, { Column } from "@/components/tables/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";

export default function Delivery() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedDeliveryForDetails, setSelectedDeliveryForDetails] = useState<any>(null);
  const [showOrderSelectionDialog, setShowOrderSelectionDialog] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    deliveryAddress: "",
    deliveryNotes: "",
    deliveryDocument: null as File | null,
  });
  // Inline filter controls
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCustomer, setFilterCustomer] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: salesOrders, isLoading, error: ordersError } = useQuery({
    queryKey: ["/api/sales-orders"],
    queryFn: async () => {
      const response = await fetch("/api/sales-orders");
      if (!response.ok) {
        throw new Error(`Failed to fetch sales orders: ${response.statusText}`);
      }
      return response.json();
    },
  });

  const { data: deliveries, error: deliveriesError } = useQuery({
    queryKey: ["/api/deliveries"],
    queryFn: async () => {
      const response = await fetch("/api/deliveries");
      if (!response.ok) {
        throw new Error(`Failed to fetch deliveries: ${response.statusText}`);
      }
      return response.json();
    },
  });
  // Determine if backend already embeds customers (transition period)
  const deliveriesEmbedded = Array.isArray(deliveries) && deliveries.some((d: any) => d && d.__customerEmbedded);
  const salesOrdersEmbedded = Array.isArray(salesOrders) && salesOrders.some((o: any) => o && o.__customerEmbedded);

  // Only fetch customers if neither deliveries nor sales orders are enriched
  const shouldFetchCustomers = !(deliveriesEmbedded || salesOrdersEmbedded);

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: async () => {
      if (!shouldFetchCustomers) return [];
      try {
        const resp = await fetch("/api/customers");
        if (!resp.ok) return [];
        const data = await resp.json();
        if (Array.isArray(data)) return data;
        if (Array.isArray((data as any)?.data)) return (data as any).data;
        if (data && typeof data === 'object') {
          const vals = Object.values(data).filter(v => typeof v === 'object');
            if (vals.every((v: any) => v && (v.id || v.name))) return vals;
        }
        return [];
      } catch (e) {
        console.warn("Failed to load customers for delivery mapping", e);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: shouldFetchCustomers,
  });

  const customerMap = useMemo(() => {
    if (!shouldFetchCustomers) return {} as Record<string, any>;
    const map: Record<string, any> = {};
    if (Array.isArray(customers)) customers.forEach((c: any) => { if (c && c.id) map[c.id] = c; });
    else if (customers && typeof customers === 'object') Object.values(customers as any).forEach((c: any) => { if (c && c.id) map[c.id] = c; });
    return map;
  }, [customers, shouldFetchCustomers]);
  const createDelivery = useMutation({
    mutationFn: async (data: any) => {
      // Send as JSON instead of FormData
      const payload = {
        salesOrderId: data.salesOrderId,
        deliveryAddress: data.deliveryAddress,
        deliveryNotes: data.deliveryNotes,
        // Note: File upload will need to be handled separately if needed
        // For now, we'll skip the document upload functionality
      };
      
      const response = await fetch("/api/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || "Delivery creation failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sales-orders"] });
      toast({
        title: "Success",
        description: "Delivery created successfully",
      });
      setSelectedOrder(null);
      setDeliveryData({ deliveryAddress: "", deliveryNotes: "", deliveryDocument: null });
    },
    onError: (error: any) => {
      let errorMsg = "Failed to create delivery";
      if (error?.message) errorMsg = error.message;
      if (error?.errors) errorMsg += ": " + error.errors.map((e: any) => e.message).join(", ");
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    },
  });

  const updateDeliveryStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/deliveries/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deliveries"] });
      toast({
        title: "Success",
        description: "Delivery status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update delivery status",
        variant: "destructive",
      });
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setDeliveryData({ ...deliveryData, deliveryDocument: acceptedFiles[0] });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    multiple: false,
  });

  // Show all deliveries with their associated order information
  const allDeliveriesWithOrders = (Array.isArray(deliveries) ? deliveries : [])?.map((delivery: any) => {
    const order = (Array.isArray(salesOrders) ? salesOrders : [])?.find((o: any) => o.id === delivery.salesOrderId);
    // Prefer embedded customer on delivery, then sales order
    let customerObj = delivery.customer || order?.customer;
    if (!customerObj) {
      const id = order?.customerId || order?.customer_id || delivery.customerId || delivery.customer_id;
      if (id) customerObj = customerMap[id] || { id, name: id };
    }
    if (!customerObj) customerObj = { id: 'Unknown', name: 'Unknown' };
    return { ...delivery, order, orderNumber: order?.orderNumber || 'N/A', customer: customerObj, totalAmount: order?.totalAmount || 0, orderDate: order?.orderDate || delivery.createdAt };
  }) || [];

  // Also include orders ready for delivery (shipped but no delivery created yet)
  const ordersReadyForDelivery = (Array.isArray(salesOrders) ? salesOrders : [])
    ?.filter((order: any) => order.status === "Shipped" && !(Array.isArray(deliveries) ? deliveries : [])?.some((d: any) => d.salesOrderId === order.id))
    .map((order: any) => {
      let customerObj = order.customer;
      if (!customerObj) {
        const id = order.customerId || order.customer_id;
        if (id) customerObj = customerMap[id] || { id, name: id };
      }
      return {
        id: `pending-${order.id}`,
        salesOrderId: order.id,
        status: 'Ready for Delivery',
        deliveryAddress: customerObj?.address || '',
        deliveryNotes: '',
        createdAt: order.orderDate,
        order,
        orderNumber: order.orderNumber,
        customer: customerObj,
        totalAmount: order.totalAmount,
        orderDate: order.orderDate,
        isPendingDelivery: true,
      };
    }) || [];

  // Combine all deliveries and pending orders
  const allDeliveryData = [...allDeliveriesWithOrders, ...ordersReadyForDelivery];
  
  const filteredDeliveryData = allDeliveryData?.filter((item: any) =>
    (item.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus ? item.status?.toLowerCase() === filterStatus.toLowerCase() : true) &&
    (filterCustomer ? item.customer?.name?.toLowerCase().includes(filterCustomer.toLowerCase()) : true)
  ) || [];
  // Pagination logic
  const totalPages = Math.ceil(filteredDeliveryData.length / pageSize);
  const paginatedDeliveryData = filteredDeliveryData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<any>[] = [
    {
      key: "orderNumber",
      header: "Order ID",
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600 font-medium">{value}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (_: any, item: any) => {
        const name = item.customer?.name || item.customer?.customerName || item.customer?.id || 'Unknown';
        return (
          <div className="flex flex-col leading-tight" data-testid={`cell-customer-${item.id || item.salesOrderId}`}>
            <span className="text-sm font-medium text-gray-900 truncate max-w-[160px]" title={name}>{name}</span>
            {item.customer?.id && item.customer?.id !== name && (
              <span className="text-[10px] text-gray-500 font-mono" title={item.customer.id}>{item.customer.id}</span>
            )}
          </div>
        );
      },
    },
    {
      key: "totalAmount",
      header: "Order Value",
      render: (value: number) => value ? formatCurrency(value) : "-",
      className: "text-right",
    },
    {
      key: "status",
      header: "Delivery Status",
      render: (status: string, item: any) => {
        if (item.isPendingDelivery) {
          return (
            <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50">
              <Package className="h-3 w-3 mr-1" />
              Ready for Delivery
            </Badge>
          );
        }
        
        // Apply color coding based on delivery status
        let colorClass = "";
        switch (status?.toLowerCase()) {
          case "pending":
            colorClass = "border-blue-500 text-blue-600 bg-blue-50";
            break;
          case "in transit":
          case "intransit":
            colorClass = "text-blue-600 border-blue-300 bg-blue-50";
            break;
          case "delivered":
          case "complete":
          case "completed":
            colorClass = "text-white border-green-500 bg-green-500";
            break;
          case "partial":
          case "partially delivered":
            colorClass = "text-amber-600 border-amber-300 bg-amber-50";
            break;
          case "failed":
          case "cancelled":
          case "canceled":
            colorClass = "text-red-600 border-red-300 bg-red-50";
            break;
          case "returned":
            colorClass = "text-purple-600 border-purple-300 bg-purple-50";
            break;
          default:
            colorClass = "text-gray-600 border-gray-300 bg-gray-50";
        }
        
        return (
          <Badge variant="outline" className={colorClass}>
            {status}
          </Badge>
        );
      },
    },
    {
      key: "deliveryAddress",
      header: "Delivery Address",
      render: (address: string) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 truncate">
            {address || "No address specified"}
          </p>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created Date",
      render: (value: string) => formatDate(value),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, item: any) => {
        return (
          <div className="flex items-center space-x-2">
            {item.isPendingDelivery && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOrder(item.order);
                  setDeliveryData({
                    deliveryAddress: item.order.customer?.address || "",
                    deliveryNotes: "",
                    deliveryDocument: null,
                  });
                }}
                data-testid={`button-create-delivery-${item.salesOrderId}`}
              >
                <Truck className="h-4 w-4 mr-1" />
                Create Delivery
              </Button>
            )}
            {!item.isPendingDelivery && item.status === "Pending" && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  updateDeliveryStatus.mutate({ id: item.id, status: "Complete" });
                }}
                data-testid={`button-complete-delivery-${item.id}`}
              >
                Complete
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDeliveryForDetails(item);
              }}
              data-testid={`button-view-${item.id || item.salesOrderId}`}
            >
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const deliveryStats = {
    readyForDelivery: ordersReadyForDelivery?.length || 0,
    pendingDelivery: (Array.isArray(deliveries) ? deliveries : [])?.filter((d: any) => d.status === "Pending").length || 0,
    partialDelivery: (Array.isArray(deliveries) ? deliveries : [])?.filter((d: any) => d.status === "Partial").length || 0,
    completeDelivery: (Array.isArray(deliveries) ? deliveries : [])?.filter((d: any) => d.status === "Complete").length || 0,
  };

  return (
    <div>
      {/* Enhanced Card-style header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-lg border border-gray-200 relative overflow-hidden mb-6">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-orange-50/50 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-48 h-24 bg-gradient-to-tr from-red-50/30 to-transparent rounded-tr-full"></div>
        
        <div className="relative px-8 py-6 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg border border-gray-200">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1" data-testid="text-page-title">
                  Customer Delivery
                </h2>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                    <Package className="h-3 w-3 mr-1" />
                    Step 9
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-600 text-sm font-medium">
                      Managing customer deliveries
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
              Generate delivery notes and manage customer deliveries with barcode picking and real-time tracking
            </p>
          </div>
          
          <div className="flex items-center gap-4 ml-8">
            
            
            
            
            <button
              className="group flex items-center gap-3 bg-blue-600 text-white hover:bg-blue-500 text-white-900 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-200"
              onClick={() => setShowOrderSelectionDialog(true)}   
            >
              {/* <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors"> */}
                <Plus className="h-4 w-4 text-white-600 group-hover:scale-110 transition-transform duration-200" />
              {/* </div> */}
              <div className="text-left">
                <div className="text-sm font-bold">Create Delivery</div>
                <div className="text-xs text-white-500">New Shipment</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Ready for Delivery</p>
                <p className="text-2xl font-bold text-blue-600" data-testid="stat-ready-delivery">
                  {deliveryStats.readyForDelivery}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  Shipped orders awaiting delivery
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Pending Delivery</p>
                <p className="text-2xl font-bold text-orange-600" data-testid="stat-pending-delivery">
                  {deliveryStats.pendingDelivery}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  Deliveries in progress
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mt-1">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Partial Delivery</p>
                <p className="text-2xl font-bold text-amber-600" data-testid="stat-partial-delivery">
                  {deliveryStats.partialDelivery}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  Partially delivered orders
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Complete Delivery</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-complete-delivery">
                  {deliveryStats.completeDelivery}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  Successfully delivered orders
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Delivery Management</CardTitle>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search deliveries and orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
                  data-testid="input-search-orders"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  data-testid="select-filter-status"
                >
                  <option value="">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                  <option value="Complete">Complete</option>
                  <option value="Ready for Delivery">Ready for Delivery</option>
                  <option value="Failed">Failed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Customer:</label>
                <Input
                  type="text"
                  placeholder="Customer name..."
                  value={filterCustomer}
                  onChange={e => setFilterCustomer(e.target.value)}
                  className="w-40"
                  data-testid="input-filter-customer"
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => { setFilterStatus(""); setFilterCustomer(""); }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <DataTable
              data={paginatedDeliveryData}
              columns={columns}
              isLoading={isLoading}
              emptyMessage="No deliveries found. Create deliveries from shipped orders."
              onRowClick={(item) => {
                if (item.isPendingDelivery) {
                  setSelectedOrder({
                    ...item.order,
                    id: item.salesOrderId || item.order.id // Ensure id is UUID
                  });
                  setDeliveryData({
                    deliveryAddress: item.order.customer?.address || "",
                    deliveryNotes: "",
                    deliveryDocument: null,
                  });
                }
              }}
            />
            {/* Pagination Controls */}
            {filteredDeliveryData.length > pageSize && (
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
        </CardContent>
      </Card>

      {/* Create Delivery Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Delivery Note</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Order Number:</span> {selectedOrder.orderNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Customer:</span> {selectedOrder.customer?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Order Value:</span> {formatCurrency(selectedOrder.totalAmount)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">PO Number:</span> {selectedOrder.customerPoNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Enter delivery address..."
                  value={deliveryData.deliveryAddress}
                  onChange={(e) => setDeliveryData({ ...deliveryData, deliveryAddress: e.target.value })}
                  className="min-h-[80px]"
                  data-testid="textarea-delivery-address"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Delivery Notes
                </label>
                <Textarea
                  placeholder="Special delivery instructions..."
                  value={deliveryData.deliveryNotes}
                  onChange={(e) => setDeliveryData({ ...deliveryData, deliveryNotes: e.target.value })}
                  className="min-h-[80px]"
                  data-testid="textarea-delivery-notes"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Delivery Document (Optional)
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  data-testid="dropzone-delivery-document"
                >
                  <input {...getInputProps()} />
                  {deliveryData.deliveryDocument ? (
                    <div className="flex items-center justify-center space-x-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        {deliveryData.deliveryDocument.name}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeliveryData({ ...deliveryData, deliveryDocument: null });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        {isDragActive
                          ? "Drop the delivery document here..."
                          : "Drag & drop delivery document, or click to select"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, PNG, JPG files up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedOrder(null);
                    setDeliveryData({ deliveryAddress: "", deliveryNotes: "", deliveryDocument: null });
                  }}
                  data-testid="button-cancel-delivery"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedOrder && deliveryData.deliveryAddress.trim()) {
                      // Use salesOrderId if present, else fallback to id
                      const salesOrderId = selectedOrder.salesOrderId || selectedOrder.id;
                      createDelivery.mutate({
                        salesOrderId,
                        ...deliveryData,
                      });
                    }
                  }}
                  disabled={!deliveryData.deliveryAddress.trim() || createDelivery.isPending}
                  data-testid="button-create-delivery"
                >
                  {createDelivery.isPending ? "Creating..." : "Create Delivery"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delivery Details Dialog */}
      <Dialog open={!!selectedDeliveryForDetails} onOpenChange={() => setSelectedDeliveryForDetails(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              Delivery Details
            </DialogTitle>
          </DialogHeader>
          {selectedDeliveryForDetails && (
            <div className="space-y-6">
              {/* Header Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    Delivery Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Delivery ID:</span>
                      <span className="ml-2 font-mono text-sm font-medium">
                        {selectedDeliveryForDetails.id || 'Pending'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="ml-2">
                        <Badge 
                          variant="outline" 
                          className={`${
                            selectedDeliveryForDetails.status?.toLowerCase() === 'complete' 
                              ? 'text-green-600 border-green-300 bg-green-50'
                              : selectedDeliveryForDetails.status?.toLowerCase() === 'pending'
                              ? 'text-blue-600 border-blue-300 bg-blue-50'
                              : selectedDeliveryForDetails.isPendingDelivery
                              ? 'text-orange-600 border-orange-300 bg-orange-50'
                              : 'text-gray-600 border-gray-300 bg-gray-50'
                          }`}
                        >
                          {selectedDeliveryForDetails.status || 'Ready for Delivery'}
                        </Badge>
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Created Date:</span>
                      <span className="ml-2 text-sm font-medium">
                        {formatDate(selectedDeliveryForDetails.createdAt)}
                      </span>
                    </div>
                    {selectedDeliveryForDetails.deliveryNotes && (
                      <div>
                        <span className="text-sm text-gray-600">Notes:</span>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border">
                          {selectedDeliveryForDetails.deliveryNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-green-600" />
                    Order Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Order Number:</span>
                      <span className="ml-2 font-mono text-sm font-medium text-blue-600">
                        {selectedDeliveryForDetails.orderNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Order Date:</span>
                      <span className="ml-2 text-sm font-medium">
                        {formatDate(selectedDeliveryForDetails.orderDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Order Value:</span>
                      <span className="ml-2 text-sm font-bold text-green-600">
                        {formatCurrency(selectedDeliveryForDetails.totalAmount)}
                      </span>
                    </div>
                    {selectedDeliveryForDetails.order?.customerPoNumber && (
                      <div>
                        <span className="text-sm text-gray-600">PO Number:</span>
                        <span className="ml-2 font-mono text-sm font-medium">
                          {selectedDeliveryForDetails.order.customerPoNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-purple-600" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Customer Name:</span>
                    <span className="ml-2 text-sm font-medium">
                      {selectedDeliveryForDetails.customer?.id || 'Unknown Customer'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Customer Type:</span>
                    <span className="ml-2 text-sm font-medium">
                      {selectedDeliveryForDetails.customer?.customerType || 'N/A'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">Customer Address:</span>
                    <p className="mt-1 text-sm text-gray-900 bg-white p-2 rounded border">
                      {selectedDeliveryForDetails.customer?.address || 'No address available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-orange-600" />
                  Delivery Address
                </h4>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedDeliveryForDetails.deliveryAddress || 'No delivery address specified'}
                  </p>
                </div>
              </div>

              {/* Order Items (if available) */}
              {selectedDeliveryForDetails.order?.items && selectedDeliveryForDetails.order.items.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-600" />
                    Order Items ({selectedDeliveryForDetails.order.items.length})
                  </h4>
                  <div className="bg-white rounded border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium text-gray-900">Description</th>
                            <th className="px-3 py-2 text-center font-medium text-gray-900">Quantity</th>
                            <th className="px-3 py-2 text-right font-medium text-gray-900">Unit Price</th>
                            <th className="px-3 py-2 text-right font-medium text-gray-900">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedDeliveryForDetails.order.items.map((item: any, index: number) => (
                            <tr key={index} className="border-b border-gray-100">
                              <td className="px-3 py-2 text-gray-900">{item.description}</td>
                              <td className="px-3 py-2 text-center text-gray-700">{item.quantity}</td>
                              <td className="px-3 py-2 text-right text-gray-700">{formatCurrency(item.unitPrice)}</td>
                              <td className="px-3 py-2 text-right font-medium text-gray-900">{formatCurrency(item.lineTotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Action History (if available) */}
              {selectedDeliveryForDetails.auditLog && selectedDeliveryForDetails.auditLog.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    Activity History
                  </h4>
                  <div className="space-y-2">
                    {selectedDeliveryForDetails.auditLog.map((log: any, index: number) => (
                      <div key={index} className="bg-white p-3 rounded border flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{log.action}</p>
                          <p className="text-xs text-gray-500">{formatDate(log.timestamp)} by {log.userId}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  {selectedDeliveryForDetails.isPendingDelivery && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedOrder(selectedDeliveryForDetails.order);
                        setDeliveryData({
                          deliveryAddress: selectedDeliveryForDetails.order.customer?.address || "",
                          deliveryNotes: "",
                          deliveryDocument: null,
                        });
                        setSelectedDeliveryForDetails(null);
                      }}
                      className="border-orange-500 text-orange-600 hover:bg-orange-50"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Create Delivery
                    </Button>
                  )}
                  {!selectedDeliveryForDetails.isPendingDelivery && selectedDeliveryForDetails.status === "Pending" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        updateDeliveryStatus.mutate({ 
                          id: selectedDeliveryForDetails.id, 
                          status: "Complete" 
                        });
                        setSelectedDeliveryForDetails(null);
                      }}
                      className="border-green-500 text-green-600 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDeliveryForDetails(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Selection Dialog for Header Create Delivery Button */}
      {/* Filter Dialog */}
      <Dialog open={showOrderSelectionDialog} onOpenChange={setShowOrderSelectionDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Truck className="h-4 w-4 text-orange-600" />
              </div>
              Select Order for Delivery
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Choose an order that is ready for delivery from the list below:
            </p>
            
            {ordersReadyForDelivery && ordersReadyForDelivery.length > 0 ? (
              <div className="space-y-3">
                {ordersReadyForDelivery.map((order: any) => (
                  <div
                    key={order.salesOrderId}
                    className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedOrder({
                        ...order.order,
                        id: order.salesOrderId || order.order.id // Ensure id is UUID
                      });
                      setDeliveryData({
                        deliveryAddress: order.order.customer?.address || "",
                        deliveryNotes: "",
                        deliveryDocument: null,
                      });
                      setShowOrderSelectionDialog(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="font-mono text-sm font-medium text-blue-600">
                            {order.orderNumber}
                          </span>
                          <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50">
                            <Package className="h-3 w-3 mr-1" />
                            Ready for Delivery
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Customer:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {order.customer_id || 'Unknown Customer'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Order Value:</span>
                            <span className="ml-2 font-medium text-green-600">
                              {formatCurrency(order.totalAmount)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Order Date:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {formatDate(order.orderDate)}
                            </span>
                          </div>
                        </div>
                        {order.customer?.address && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-600">Address:</span>
                            <span className="ml-2 text-gray-900">
                              {order.customer.address}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-300 text-orange-600 hover:bg-orange-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder({
                              ...order.order,
                              id: order.salesOrderId || order.order.id // Ensure id is UUID
                            });
                            setDeliveryData({
                              deliveryAddress: order.order.customer?.address || "",
                              deliveryNotes: "",
                              deliveryDocument: null,
                            });
                            setShowOrderSelectionDialog(false);
                          }}
                        >
                          <Truck className="h-4 w-4 mr-1" />
                          Create Delivery
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Ready for Delivery</h3>
                <p className="text-gray-600">
                  There are currently no shipped orders available for delivery creation.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Orders must be in "Shipped" status to create deliveries.
                </p>
              </div>
            )}
            
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowOrderSelectionDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
