import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Package, 
  Truck, 
  Scan, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus,
  Search,
  Calendar,
  MapPin,
  User,
  FileText,
  BarChart3,
  Eye
} from "lucide-react";
import type { Delivery, DeliveryItem, DeliveryPickingSession, SalesOrder, Customer } from "@shared/schema";

interface DeliveryWithDetails extends Delivery {
  salesOrder?: SalesOrder;
  customer?: Customer;
  deliveryItems?: DeliveryItem[];
  totalItems?: number;
  completedItems?: number;
}

const DeliveryManagement = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryWithDetails | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    dateFrom: "",
    dateTo: "",
    search: ""
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPickingDialog, setShowPickingDialog] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [currentSession, setCurrentSession] = useState<DeliveryPickingSession | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch deliveries with comprehensive filtering
  const { data: deliveries = [], isLoading: deliveriesLoading, error: deliveriesError } = useQuery({
    queryKey: ["/api/deliveries", filters],
    queryFn: async () => {
      // Only include non-empty filters in the query string
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== "" && v !== "all")
      );
      const result = await apiRequest("GET", `/api/deliveries?${new URLSearchParams(cleanedFilters)}`);
      console.log("Deliveries API response:", result);
      if (!Array.isArray(result)) {
        console.error("Deliveries API returned non-array:", result);
        return [];
      }
      return result;
    },
  });

  // Fetch sales orders for delivery creation
  const { data: rawSalesOrders } = useQuery({
    queryKey: ["/api/sales-orders"],
    queryFn: () => apiRequest("GET", "/api/sales-orders?status=Confirmed"),
  });

  // Ensure salesOrders is always an array
  const salesOrders: SalesOrder[] = Array.isArray(rawSalesOrders) ? rawSalesOrders : [];

  // Fetch customers for display
  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: () => apiRequest("GET", "/api/customers"),
  });

  // Create delivery mutation
  const createDeliveryMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/deliveries", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deliveries"] });
      setShowCreateDialog(false);
      toast({ title: "Success", description: "Delivery created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Start picking mutation
  const startPickingMutation = useMutation({
    mutationFn: (deliveryId: string) => apiRequest("POST", `/api/deliveries/${deliveryId}/start-picking`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deliveries"] });
      toast({ title: "Success", description: "Picking started successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Complete picking mutation
  const completePickingMutation = useMutation({
    mutationFn: ({ deliveryId, notes }: { deliveryId: string; notes?: string }) => 
      apiRequest("POST", `/api/deliveries/${deliveryId}/complete-picking`, { notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deliveries"] });
      setShowPickingDialog(false);
      toast({ title: "Success", description: "Picking completed successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Barcode scan mutation
  const scanBarcodeMutation = useMutation({
    mutationFn: (data: { barcode: string; sessionId: string; quantity: number }) => 
      apiRequest("POST", "/api/deliveries/scan-item", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deliveries"] });
      setScannedBarcode("");
      toast({ title: "Success", description: "Item scanned successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Confirm delivery mutation
  const confirmDeliveryMutation = useMutation({
    mutationFn: ({ deliveryId, confirmedBy, signature }: { deliveryId: string; confirmedBy: string; signature?: string }) => 
      apiRequest("POST", `/api/deliveries/${deliveryId}/confirm`, { confirmedBy, signature }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deliveries"] });
      toast({ title: "Success", description: "Delivery confirmed successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      "Pending": "secondary",
      "Partial": "warning", 
      "Complete": "success",
      "Cancelled": "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending": return <Clock className="h-4 w-4" />;
      case "Partial": return <AlertCircle className="h-4 w-4" />;
      case "Complete": return <CheckCircle className="h-4 w-4" />;
      case "Cancelled": return <AlertCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const handleCreateDelivery = (data: any) => {
    createDeliveryMutation.mutate({
      ...data,
      deliveryNumber: `DEL-${Date.now()}`,
      status: "Pending",
      deliveryType: "Full"
    });
  };

  const handleStartPicking = (delivery: DeliveryWithDetails) => {
    setSelectedDelivery(delivery);
    setShowPickingDialog(true);
    startPickingMutation.mutate(delivery.id);
  };

  const handleScanBarcode = () => {
    if (!scannedBarcode || !currentSession) return;
    
    scanBarcodeMutation.mutate({
      barcode: scannedBarcode,
      sessionId: currentSession.id,
      quantity: 1
    });
  };

  const handleConfirmDelivery = (deliveryId: string, confirmedBy: string) => {
    confirmDeliveryMutation.mutate({ deliveryId, confirmedBy });
  };

  // Filter deliveries based on search and filters
  const filteredDeliveries = Array.isArray(deliveries)
    ? deliveries.filter((delivery: DeliveryWithDetails) => {
        // If no filters, show all deliveries
        if (!filters.status && !filters.search) return true;
        const matchesStatus = !filters.status || delivery.status === filters.status;
        const matchesSearch = !filters.search || 
          delivery.deliveryNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
          delivery.salesOrder?.orderNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
          delivery.customer?.name?.toLowerCase().includes(filters.search.toLowerCase());
        return matchesStatus && matchesSearch;
      })
    : [];

  const deliveryStats = {
    total: Array.isArray(deliveries) ? deliveries.length : 0,
    pending: Array.isArray(deliveries) ? deliveries.filter((d: Delivery) => d.status === "Pending").length : 0,
    partial: Array.isArray(deliveries) ? deliveries.filter((d: Delivery) => d.status === "Partial").length : 0,
    complete: Array.isArray(deliveries) ? deliveries.filter((d: Delivery) => d.status === "Complete").length : 0,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Enhanced Card-style header */}
      <div className="mb-6">
        <div className="rounded-2xl border border-gray-200 shadow-lg flex items-center justify-between px-8 py-8 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg border border-gray-200">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2" data-testid="text-page-title">
                Delivery & Invoicing Management
              </h1>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                  <Package className="h-3 w-3 mr-1" />
                  Step 9
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-600 text-sm font-medium">
                    Comprehensive delivery management with barcode picking and automated invoicing
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Button className="font-semibold px-6 py-2" onClick={() => setShowCreateDialog(true)} data-testid="button-create-delivery">
            <span className="mr-2">+</span> Create Delivery
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-900">Total Deliveries</p>
              <p className="text-2xl font-bold">{deliveryStats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-900">Pending</p>
              <p className="text-2xl font-bold">{deliveryStats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <AlertCircle className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-900">In Progress</p>
              <p className="text-2xl font-bold">{deliveryStats.partial}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-900">Completed</p>
              <p className="text-2xl font-bold">{deliveryStats.complete}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Delivery number, order, customer..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                data-testid="input-search"
                className="border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-md shadow-none"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Partial">In Progress</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                data-testid="input-date-from"
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                data-testid="input-date-to"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Delivery Overview</TabsTrigger>
          <TabsTrigger value="picking">Barcode Picking</TabsTrigger>
          <TabsTrigger value="tracking">Delivery Tracking</TabsTrigger>
          <TabsTrigger value="invoicing">Invoice Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery List</CardTitle>
              <CardDescription>
                Manage all deliveries with comprehensive tracking and status updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deliveriesLoading ? (
                <div className="text-center py-8">Loading deliveries...</div>
              ) : deliveriesError ? (
                <div className="text-center py-8 text-red-600">
                  Error loading deliveries: {deliveriesError.message}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Delivery #</TableHead>
                      <TableHead>Sales Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeliveries.map((delivery: DeliveryWithDetails) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(delivery.status ?? "")}
                            {delivery.deliveryNumber}
                          </div>
                        </TableCell>
                        <TableCell>{delivery.salesOrder?.orderNumber || "N/A"}</TableCell>
                        <TableCell>{delivery.customer?.name || "N/A"}</TableCell>
                        <TableCell>{getStatusBadge(delivery.status ?? "")}</TableCell>
                        <TableCell>
                          {delivery.deliveryDate ? 
                            new Date(delivery.deliveryDate).toLocaleDateString() : 
                            "Not scheduled"
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            {delivery.completedItems || 0}/{delivery.totalItems || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {delivery.status === "Pending" && (
                              <Button
                                size="sm"
                                onClick={() => handleStartPicking(delivery)}
                                data-testid={`button-start-picking-${delivery.id}`}
                              >
                                <Scan className="h-4 w-4 mr-1" />
                                Start Picking
                              </Button>
                            )}
                            {delivery.status === "Partial" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedDelivery(delivery)}
                                data-testid={`button-continue-picking-${delivery.id}`}
                              >
                                <Scan className="h-4 w-4 mr-1" />
                                Continue
                              </Button>
                            )}
                            {delivery.status === "Complete" && (
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleConfirmDelivery(delivery.id, "System")}
                                data-testid={`button-confirm-delivery-${delivery.id}`}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Confirm
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Upload delivery document
                                toast({ title: "Info", description: "Delivery document upload feature coming soon" });
                              }}
                              data-testid={`button-upload-doc-${delivery.id}`}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedDelivery(delivery)}
                              data-testid={`button-view-delivery-${delivery.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="picking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                Barcode Picking Station
              </CardTitle>
              <CardDescription>
                Scan items for delivery picking with real-time verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="barcode">Scan Barcode</Label>
                    <div className="flex gap-2">
                      <Input
                        id="barcode"
                        placeholder="Scan or enter barcode..."
                        value={scannedBarcode}
                        onChange={(e) => setScannedBarcode(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleScanBarcode()}
                        data-testid="input-barcode"
                      />
                      <Button 
                        onClick={handleScanBarcode}
                        disabled={!scannedBarcode || !currentSession}
                        data-testid="button-scan"
                      >
                        <Scan className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {selectedDelivery && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Current Delivery</h3>
                      <div className="p-4 bg-muted rounded-lg">
                        <p><strong>Delivery:</strong> {selectedDelivery.deliveryNumber}</p>
                        <p><strong>Customer:</strong> {selectedDelivery.customer?.name}</p>
                        <p><strong>Status:</strong> {getStatusBadge(selectedDelivery.status ?? "")}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Picking Progress</h3>
                  <div className="space-y-2">
                    {/* Progress would be rendered here from picked items */}
                    <div className="text-center text-muted-foreground py-8">
                      Select a delivery to start picking
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Tracking
              </CardTitle>
              <CardDescription>
                Track delivery status and location in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trackingNumber">Tracking Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="trackingNumber"
                        placeholder="Enter tracking number..."
                        data-testid="input-tracking-number"
                      />
                      <Button data-testid="button-track">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="carrier">Carrier</Label>
                    <Select>
                      <SelectTrigger data-testid="select-carrier">
                        <SelectValue placeholder="Select carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dhl">DHL</SelectItem>
                        <SelectItem value="fedex">FedEx</SelectItem>
                        <SelectItem value="ups">UPS</SelectItem>
                        <SelectItem value="local">Local Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Delivery Status Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Delivery Confirmed</p>
                        <p className="text-sm text-green-700">Customer has confirmed receipt</p>
                        <p className="text-xs text-green-600">Today at 2:30 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Out for Delivery</p>
                        <p className="text-sm text-blue-700">Package is on the delivery vehicle</p>
                        <p className="text-xs text-blue-600">Today at 8:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Package className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-yellow-900">Picked Up</p>
                        <p className="text-sm text-yellow-700">Package collected from warehouse</p>
                        <p className="text-xs text-yellow-600">Yesterday at 4:15 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoicing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Management
              </CardTitle>
              <CardDescription>
                Automated invoice generation and multi-currency support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => {
                      // Generate invoice for completed deliveries
                      toast({ title: "Info", description: "Invoice generation feature coming soon" });
                    }}
                    className="h-20"
                  >
                    <div className="text-center">
                      <FileText className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-medium">Generate Invoice</div>
                      <div className="text-xs opacity-70">From completed deliveries</div>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => {
                      // Generate proforma invoice
                      toast({ title: "Info", description: "Proforma invoice generation feature coming soon" });
                    }}
                    variant="outline"
                    className="h-20"
                  >
                    <div className="text-center">
                      <FileText className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-medium">Proforma Invoice</div>
                      <div className="text-xs opacity-70">From sales orders</div>
                    </div>
                  </Button>
                </div>
                
                <div className="text-center text-muted-foreground py-4">
                  <p>Invoice management features will include:</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Multi-currency support</li>
                    <li>• Automatic invoice generation</li>
                    <li>• Delivery note upload</li>
                    <li>• Returns & credit notes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Delivery Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Delivery</DialogTitle>
            <DialogDescription>
              Create a delivery from a confirmed sales order
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleCreateDelivery({
              salesOrderId: formData.get("salesOrderId"),
              deliveryDate: formData.get("deliveryDate"),
              deliveryAddress: formData.get("deliveryAddress"),
              deliveryNotes: formData.get("deliveryNotes")
            });
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="salesOrderId" className="text-right">Sales Order</Label>
                <Select name="salesOrderId" required>
                  <SelectTrigger className="col-span-3" data-testid="select-sales-order">
                    <SelectValue placeholder="Select sales order" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesOrders.map((order: SalesOrder) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.orderNumber} - {order.customerId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deliveryDate" className="text-right">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  name="deliveryDate"
                  type="date"
                  className="col-span-3"
                  data-testid="input-delivery-date"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deliveryAddress" className="text-right">Address</Label>
                <Textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  className="col-span-3"
                  placeholder="Enter delivery address..."
                  data-testid="textarea-delivery-address"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deliveryNotes" className="text-right">Notes</Label>
                <Textarea
                  id="deliveryNotes"
                  name="deliveryNotes"
                  className="col-span-3"
                  placeholder="Special delivery instructions..."
                  data-testid="textarea-delivery-notes"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deliveryDocument" className="text-right">Document</Label>
                <div className="col-span-3">
                  <Input
                    id="deliveryDocument"
                    name="deliveryDocument"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    data-testid="input-delivery-document"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload delivery note, PO, or other relevant documents (PDF, JPG, PNG)
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateDialog(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createDeliveryMutation.isPending}
                data-testid="button-create"
              >
                {createDeliveryMutation.isPending ? "Creating..." : "Create Delivery"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Picking Session Dialog */}
      <Dialog open={showPickingDialog} onOpenChange={setShowPickingDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Barcode Picking Session</DialogTitle>
            <DialogDescription>
              Scan items to complete delivery picking
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDelivery && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Delivery Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Delivery:</strong> {selectedDelivery.deliveryNumber}</p>
                    <p><strong>Customer:</strong> {selectedDelivery.customer?.name}</p>
                    <p><strong>Status:</strong> {getStatusBadge(selectedDelivery.status ?? "")}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Picking Progress</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Items Picked:</strong> {selectedDelivery.completedItems || 0}/{selectedDelivery.totalItems || 0}</p>
                    <p><strong>Progress:</strong> {Math.round(((selectedDelivery.completedItems || 0) / (selectedDelivery.totalItems || 1)) * 100)}%</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPickingDialog(false)}
                data-testid="button-close-picking"
              >
                Close
              </Button>
              <Button 
                onClick={() => selectedDelivery && completePickingMutation.mutate({ deliveryId: selectedDelivery.id })}
                disabled={completePickingMutation.isPending}
                data-testid="button-complete-picking"
              >
                {completePickingMutation.isPending ? "Completing..." : "Complete Picking"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryManagement;