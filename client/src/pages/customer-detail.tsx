import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  TrendingUp, 
  Edit, 
  ArrowLeft, 
  Building, 
  Calendar, 
  DollarSign,
  FileText,
  Package,
  Receipt,
  BarChart3,
  Users,
  Clock,
  Target,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CustomerFormDialog } from "@/components/forms/customer-form-dialog";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  customerType: "Retail" | "Wholesale";
  classification: "Internal" | "Corporate" | "Individual" | "Family" | "Ministry";
  taxId: string | null;
  creditLimit: number | null;
  paymentTerms: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CustomerDetails extends Customer {
  transactionSummary: {
    enquiries: Array<{ total: number; status: string }>;
    quotations: Array<{ total: number; totalValue: string; status: string }>;
    salesOrders: Array<{ total: number; totalValue: string; status: string }>;
    invoices: Array<{ total: number; totalValue: string; status: string }>;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    status: string;
    amount: number | null;
    date: string;
  }>;
  performanceMetrics: {
    yearly: { totalOrders: number; totalValue: number; averageOrderValue: number };
    sixMonth: { totalOrders: number; totalValue: number; averageOrderValue: number };
    quarterly: { totalOrders: number; totalValue: number; averageOrderValue: number };
    conversionRates: { enquiryToQuote: number; quoteToOrder: number; overall: number };
  };
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCustomerDetails();
    }
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/customers/${id}/details`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCustomer(data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch customer details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    if (customer) {
      setCustomer({
        ...customer,
        ...updatedCustomer
      });
    }
    setIsEditDialogOpen(false);
    toast({
      title: "Success",
      description: "Customer updated successfully",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'confirmed':
      case 'delivered':
      case 'paid':
        return 'default';
      case 'pending':
      case 'draft':
        return 'secondary';
      case 'cancelled':
      case 'rejected':
      case 'expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enquiry':
        return <FileText className="h-4 w-4" />;
      case 'quotation':
        return <Receipt className="h-4 w-4" />;
      case 'sales_order':
        return <Package className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number | string | null) => {
    if (!amount) return "N/A";
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AED'
    }).format(num);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading customer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Customer Not Found</h2>
            <p className="mt-2 text-gray-600">The requested customer could not be found.</p>
            <Button 
              onClick={() => navigate('/customer-management')} 
              className="mt-4"
            >
              Back to Customers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/customer-management')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <p className="text-gray-600">Customer ID: {customer.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={customer.isActive ? "default" : "secondary"}>
            {customer.isActive ? "Active" : "Inactive"}
          </Badge>
          <Badge variant="outline">{customer.customerType}</Badge>
          <Badge variant="outline">{customer.classification}</Badge>
          <CustomerFormDialog
            customer={customer}
            onCustomerSaved={handleCustomerUpdate}
            trigger={
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Customer
              </Button>
            }
          />
        </div>
      </div>

      {/* Customer Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Info</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{customer.email || "No email"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{customer.phone || "No phone"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{customer.address || "No address"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Info</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Credit Limit</p>
                <p className="text-lg font-semibold">{formatCurrency(customer.creditLimit)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Terms</p>
                <p className="text-sm">{customer.paymentTerms || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tax ID</p>
                <p className="text-sm">{customer.taxId || "Not provided"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders (Year)</p>
                <p className="text-lg font-semibold">{customer.performanceMetrics.yearly.totalOrders}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value (Year)</p>
                <p className="text-lg font-semibold">{formatCurrency(customer.performanceMetrics.yearly.totalValue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-sm">{formatCurrency(customer.performanceMetrics.yearly.averageOrderValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rates</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Enquiry → Quote</p>
                <p className="text-lg font-semibold">{formatPercentage(customer.performanceMetrics.conversionRates.enquiryToQuote)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quote → Order</p>
                <p className="text-lg font-semibold">{formatPercentage(customer.performanceMetrics.conversionRates.quoteToOrder)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall</p>
                <p className="text-sm">{formatPercentage(customer.performanceMetrics.conversionRates.overall)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Basic customer details and classification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
                    <p className="text-sm">{customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer Type</p>
                    <p className="text-sm">{customer.customerType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Classification</p>
                    <p className="text-sm">{customer.classification}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={customer.isActive ? "default" : "secondary"}>
                      {customer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created Date</p>
                    <p className="text-sm">{format(new Date(customer.createdAt), "PPP")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="text-sm">{format(new Date(customer.updatedAt), "PPP")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Summary</CardTitle>
                <CardDescription>Summary of customer transactions by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Enquiries</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {customer.transactionSummary.enquiries.reduce((sum, e) => sum + e.total, 0)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Quotations</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {customer.transactionSummary.quotations.reduce((sum, q) => sum + q.total, 0)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Sales Orders</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {customer.transactionSummary.salesOrders.reduce((sum, s) => sum + s.total, 0)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Invoices</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {customer.transactionSummary.invoices.reduce((sum, i) => sum + i.total, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quotations */}
            <Card>
              <CardHeader>
                <CardTitle>Quotations by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {customer.transactionSummary.quotations.map((quote, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Badge variant="outline">{quote.status}</Badge>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{quote.total} quotes</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(quote.totalValue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sales Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Orders by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {customer.transactionSummary.salesOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Badge variant="outline">{order.status}</Badge>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{order.total} orders</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(order.totalValue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest customer interactions and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customer.recentActivities.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No recent activities found</p>
                ) : (
                  customer.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={getStatusBadgeVariant(activity.status)} className="text-xs">
                            {activity.status}
                          </Badge>
                          {activity.amount && (
                            <span className="text-sm text-muted-foreground">
                              {formatCurrency(activity.amount)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {format(new Date(activity.date), "MMM d, yyyy")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Orders</p>
                    <p className="text-2xl font-bold">{customer.performanceMetrics.quarterly.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-xl font-semibold">{formatCurrency(customer.performanceMetrics.quarterly.totalValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Order Value</p>
                    <p className="text-lg">{formatCurrency(customer.performanceMetrics.quarterly.averageOrderValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6-Month Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Orders</p>
                    <p className="text-2xl font-bold">{customer.performanceMetrics.sixMonth.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-xl font-semibold">{formatCurrency(customer.performanceMetrics.sixMonth.totalValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Order Value</p>
                    <p className="text-lg">{formatCurrency(customer.performanceMetrics.sixMonth.averageOrderValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yearly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Orders</p>
                    <p className="text-2xl font-bold">{customer.performanceMetrics.yearly.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-xl font-semibold">{formatCurrency(customer.performanceMetrics.yearly.totalValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Order Value</p>
                    <p className="text-lg">{formatCurrency(customer.performanceMetrics.yearly.averageOrderValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer History</CardTitle>
              <CardDescription>Complete audit trail of customer changes and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Customer history tracking will be available soon</p>
                <p className="text-sm">This will show all customer updates, notes, and interactions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}