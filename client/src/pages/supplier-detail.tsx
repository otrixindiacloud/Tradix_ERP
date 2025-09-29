import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  TrendingUp, 
  Edit, 
  Package, 
  FileText, 
  Receipt, 
  BarChart3,
  Calendar,
  DollarSign,
  Activity,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const supplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactPerson: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface Supplier {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  contactPerson: string | null;
  paymentTerms: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SupplierDetails {
  supplier: Supplier;
  stats: {
    totalLpos: number;
    totalLpoValue: string;
    pendingLpos: number;
    totalItems: number;
    totalGoodsReceipts: number;
    averageDeliveryDays: number;
    onTimeDeliveryRate: number;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    date: string;
    status?: string;
    amount?: string;
  }>;
}

interface PerformanceMetrics {
  deliveryPerformance: {
    onTimeDeliveries: number;
    totalDeliveries: number;
    onTimeRate: number;
    averageDelayDays: number;
  };
  qualityMetrics: {
    totalReceipts: number;
    acceptedReceipts: number;
    rejectedReceipts: number;
    acceptanceRate: number;
  };
  financialMetrics: {
    totalOrderValue: string;
    averageOrderValue: string;
    paymentTermsCompliance: number;
  };
}

interface LpoData {
  lpos: Array<{
    id: string;
    lpoNumber: string;
    status: string;
    lpoDate: string;
    expectedDeliveryDate: string | null;
    totalAmount: string | null;
    itemsCount: number;
  }>;
  total: number;
}

interface ItemData {
  items: Array<{
    id: string;
    supplierCode: string;
    barcode: string | null;
    description: string;
    category: string | null;
    unitOfMeasure: string | null;
    costPrice: string | null;
    isActive: boolean;
    lastOrderDate: string | null;
    totalOrdered: number;
  }>;
  total: number;
}

interface GoodsReceiptData {
  receipts: Array<{
    id: string;
    receiptNumber: string;
    receiptDate: string;
    status: string;
    lpoNumber: string;
    totalItems: number;
    receivedItems: number;
    expectedDeliveryDate: string | null;
    actualDeliveryDate: string | null;
  }>;
  total: number;
}

export default function SupplierDetail() {
  const { id } = useParams();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditDialog, setShowEditDialog] = useState(false);

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Fetch supplier details
  const { data: supplierDetails, isLoading, error } = useQuery<SupplierDetails>({
    queryKey: [`/api/suppliers/${id}/details`],
    queryFn: async () => {
      const response = await fetch(`/api/suppliers/${id}/details`);
      if (!response.ok) {
        throw new Error(`Failed to fetch supplier details: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Fetch performance metrics
  const { data: performanceMetrics } = useQuery<PerformanceMetrics>({
    queryKey: [`/api/suppliers/${id}/performance`],
    queryFn: async () => {
      const response = await fetch(`/api/suppliers/${id}/performance`);
      if (!response.ok) {
        throw new Error(`Failed to fetch performance metrics: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Fetch supplier LPOs
  const { data: lpoData } = useQuery<LpoData>({
    queryKey: [`/api/suppliers/${id}/lpos`],
    queryFn: async () => {
      const response = await fetch(`/api/suppliers/${id}/lpos?page=1&limit=20`);
      if (!response.ok) {
        throw new Error(`Failed to fetch supplier LPOs: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Fetch supplier items
  const { data: itemData } = useQuery<ItemData>({
    queryKey: [`/api/suppliers/${id}/items`],
    queryFn: async () => {
      const response = await fetch(`/api/suppliers/${id}/items?page=1&limit=20`);
      if (!response.ok) {
        throw new Error(`Failed to fetch supplier items: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Fetch goods receipts
  const { data: goodsReceiptData } = useQuery<GoodsReceiptData>({
    queryKey: [`/api/suppliers/${id}/goods-receipts`],
    queryFn: async () => {
      const response = await fetch(`/api/suppliers/${id}/goods-receipts?page=1&limit=20`);
      if (!response.ok) {
        throw new Error(`Failed to fetch goods receipts: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Update supplier mutation
  const updateSupplier = useMutation({
    mutationFn: async (data: SupplierFormData) => {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update supplier");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/suppliers/${id}/details`] });
      toast({
        title: "Success",
        description: "Supplier updated successfully",
      });
      setShowEditDialog(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update supplier",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    if (supplierDetails?.supplier) {
      const supplier = supplierDetails.supplier;
      form.reset({
        name: supplier.name,
        contactPerson: supplier.contactPerson || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
      });
      setShowEditDialog(true);
    }
  };

  const onSubmit = (data: SupplierFormData) => {
    updateSupplier.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading supplier details...</div>
        </div>
      </div>
    );
  }

  if (error || !supplierDetails) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Failed to load supplier details</div>
        </div>
      </div>
    );
  }

  const { supplier, stats, recentActivities } = supplierDetails;

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'approved':
        return 'default';
      case 'pending':
      case 'draft':
        return 'secondary';
      case 'rejected':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (amount: string | null | number) => {
    if (!amount) return 'AED 0.00';
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(value);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/suppliers")}
            className="group flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-200"
          >
            <div className="rounded-lg flex items-center justify-center transition-colors">
              <ArrowLeft className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold">Back to Suppliers</div>
            </div>
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{supplier.name}</h1>
            <p className="text-muted-foreground">
              Supplier ID: {supplier.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={supplier.isActive ? "default" : "secondary"}>
            {supplier.isActive ? "Active" : "Inactive"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
              <Edit className="h-3 w-3 text-blue-600" />
            </div>
            Edit Supplier
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-base font-bold">Total Orders</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLpos}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingLpos} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-green-600" />
              <CardTitle className="text-base font-bold">Order Value</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalLpoValue)}</div>
            <p className="text-xs text-muted-foreground">
              Total ordered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-orange-600" />
              <CardTitle className="text-base font-bold">Items Supplied</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Product lines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-base font-bold">On-Time Delivery</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onTimeDeliveryRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Delivery performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Items
          </TabsTrigger>
          <TabsTrigger value="receipts" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Receipts
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activities
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Supplier Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Supplier Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                    <p className="text-sm">{supplier.contactPerson || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Terms</label>
                    <p className="text-sm">{supplier.paymentTerms || 'Not specified'}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{supplier.email || 'No email provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{supplier.phone || 'No phone provided'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{supplier.address || 'No address provided'}</span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <label>Created</label>
                    <p>{format(new Date(supplier.createdAt), 'PPP')}</p>
                  </div>
                  <div>
                    <label>Last Updated</label>
                    <p>{format(new Date(supplier.updatedAt), 'PPP')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Overview */}
            {performanceMetrics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Delivery Performance</span>
                      <Badge variant={performanceMetrics.deliveryPerformance.onTimeRate > 80 ? "default" : "secondary"}>
                        {performanceMetrics.deliveryPerformance.onTimeRate.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Quality Acceptance</span>
                      <Badge variant={performanceMetrics.qualityMetrics.acceptanceRate > 95 ? "default" : "secondary"}>
                        {performanceMetrics.qualityMetrics.acceptanceRate.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Order Value</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(performanceMetrics.financialMetrics.totalOrderValue)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Order Value</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(performanceMetrics.financialMetrics.averageOrderValue)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Purchase Orders (LPOs)
              </CardTitle>
              <CardDescription>
                All Local Purchase Orders sent to this supplier
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lpoData && lpoData.lpos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>LPO Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Expected Delivery</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lpoData.lpos.map((lpo) => (
                      <TableRow key={lpo.id}>
                        <TableCell className="font-medium">{lpo.lpoNumber}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(lpo.status)}>
                            {lpo.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(lpo.lpoDate), 'PP')}</TableCell>
                        <TableCell>
                          {lpo.expectedDeliveryDate ? format(new Date(lpo.expectedDeliveryDate), 'PP') : 'Not set'}
                        </TableCell>
                        <TableCell>{lpo.itemsCount}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(lpo.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No purchase orders found for this supplier
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Items Tab */}
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Supplier 
                           </CardTitle>
              <CardDescription>
                All items supplied by this supplier
              </CardDescription>
            </CardHeader>
            <CardContent>
              {itemData && itemData.items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier Code</TableHead>
                      <TableHead>Barcode</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>UOM</TableHead>
                      <TableHead className="text-right">Cost Price</TableHead>
                      <TableHead className="text-right">Total Ordered</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemData.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.supplierCode}</TableCell>
                        <TableCell>{item.barcode || 'N/A'}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.category || 'N/A'}</TableCell>
                        <TableCell>{item.unitOfMeasure || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.costPrice)}
                        </TableCell>
                        <TableCell className="text-right">{item.totalOrdered}</TableCell>
                        <TableCell>
                          <Badge variant={item.isActive ? "default" : "secondary"}>
                            {item.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No items found for this supplier
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receipts Tab */}
        <TabsContent value="receipts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Goods Receipts
              </CardTitle>
              <CardDescription>
                History of goods received from this supplier
              </CardDescription>
            </CardHeader>
            <CardContent>
              {goodsReceiptData && goodsReceiptData.receipts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt Number</TableHead>
                      <TableHead>LPO Number</TableHead>
                      <TableHead>Receipt Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items Received</TableHead>
                      <TableHead>Expected Delivery</TableHead>
                      <TableHead>Actual Delivery</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goodsReceiptData.receipts.map((receipt) => (
                      <TableRow key={receipt.id}>
                        <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                        <TableCell>{receipt.lpoNumber}</TableCell>
                        <TableCell>{format(new Date(receipt.receiptDate), 'PP')}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(receipt.status)}>
                            {receipt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{receipt.receivedItems} / {receipt.totalItems}</TableCell>
                        <TableCell>
                          {receipt.expectedDeliveryDate ? format(new Date(receipt.expectedDeliveryDate), 'PP') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {receipt.actualDeliveryDate ? format(new Date(receipt.actualDeliveryDate), 'PP') : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No goods receipts found for this supplier
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          {performanceMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">On-Time Deliveries</span>
                      <span className="text-sm font-medium">
                        {performanceMetrics.deliveryPerformance.onTimeDeliveries} / {performanceMetrics.deliveryPerformance.totalDeliveries}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${performanceMetrics.deliveryPerformance.onTimeRate}%` }}
                      />
                    </div>
                    <div className="text-2xl font-bold text-center">
                      {performanceMetrics.deliveryPerformance.onTimeRate.toFixed(1)}%
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Average Delay</div>
                    <div className="text-lg font-semibold">
                      {performanceMetrics.deliveryPerformance.averageDelayDays.toFixed(1)} days
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Quality Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Accepted Receipts</span>
                      <span className="text-sm font-medium">
                        {performanceMetrics.qualityMetrics.acceptedReceipts} / {performanceMetrics.qualityMetrics.totalReceipts}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${performanceMetrics.qualityMetrics.acceptanceRate}%` }}
                      />
                    </div>
                    <div className="text-2xl font-bold text-center">
                      {performanceMetrics.qualityMetrics.acceptanceRate.toFixed(1)}%
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Rejected Receipts</div>
                    <div className="text-lg font-semibold text-red-500">
                      {performanceMetrics.qualityMetrics.rejectedReceipts}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Total Order Value</div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(performanceMetrics.financialMetrics.totalOrderValue)}
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Average Order Value</div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(performanceMetrics.financialMetrics.averageOrderValue)}
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Payment Compliance</div>
                    <div className="text-lg font-semibold text-green-500">
                      {performanceMetrics.financialMetrics.paymentTermsCompliance.toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>
                Recent interactions and transactions with this supplier
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities && recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {activity.type === 'LPO' && <Package className="h-4 w-4 text-primary" />}
                        {activity.type === 'Goods Receipt' && <Receipt className="h-4 w-4 text-primary" />}
                        {activity.type === 'Payment' && <DollarSign className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <div className="flex items-center gap-2">
                            {activity.status && (
                              <Badge variant={getStatusBadgeVariant(activity.status)} className="text-xs">
                                {activity.status}
                              </Badge>
                            )}
                            {activity.amount && (
                              <span className="text-sm font-medium">{formatCurrency(activity.amount)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(activity.date), 'PPp')}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activities found for this supplier
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Supplier Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact person name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={updateSupplier.isPending}
                >
                  {updateSupplier.isPending ? "Updating..." : "Update Supplier"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}