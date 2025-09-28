import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, RefreshCw, Search, User, Mail, Phone, MapPin, CreditCard, TrendingUp, Eye, Users, ShoppingCart, Store, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  retailCustomers: number;
  wholesaleCustomers: number;
  totalCreditLimit: number;
  averageCreditLimit: number;
}

const CUSTOMER_TYPES = [
  { value: "Retail", label: "Retail" },
  { value: "Wholesale", label: "Wholesale" }
];

const CUSTOMER_CLASSIFICATIONS = [
  { value: "Internal", label: "Internal" },
  { value: "Corporate", label: "Corporate" },
  { value: "Individual", label: "Individual" },
  { value: "Family", label: "Family" },
  { value: "Ministry", label: "Ministry" }
];

const PAYMENT_TERMS = [
  { value: "Net 15", label: "Net 15" },
  { value: "Net 30", label: "Net 30" },
  { value: "Net 45", label: "Net 45" },
  { value: "Net 60", label: "Net 60" },
  { value: "COD", label: "Cash on Delivery" },
  { value: "Prepaid", label: "Prepaid" }
];

export default function CustomerManagementPage() {
  // Clear all filters to default
  const clearFilters = () => {
    setFilters({
      customerType: "all",
      classification: "all",
      isActive: "all",
      search: ""
    });
  };
  const [location, navigate] = useLocation();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    pages: 0
  });


  // Filters
  const [filters, setFilters] = useState({
    customerType: "all",
    classification: "all",
    isActive: "all",
    search: ""
  });
  // Filter visibility toggle
  const [showFilters, setShowFilters] = useState(false);

  // Returns true if any filter is active (not default values)
  const hasActiveFilters =
    filters.customerType !== "all" ||
    filters.classification !== "all" ||
    filters.isActive !== "all" ||
    (filters.search && filters.search.trim() !== "");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    customerType: "Retail",
    classification: "Individual",
    taxId: "",
    creditLimit: "",
    paymentTerms: "Net 30",
    isActive: true
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch customers with React Query
  const { data: customersData, isLoading: loading, error } = useQuery({
    queryKey: ["/api/customers", filters, pagination.page, pagination.limit],
    queryFn: async () => {
      const offset = (pagination.page - 1) * pagination.limit;
      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });

      const response = await fetch(`/api/customers?${params}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      
      // Update pagination state with response data
      setPagination(data.pagination);
      return data;
    },
  });

  const customers = customersData?.customers || [];

  // Fetch stats with React Query
  const { data: stats } = useQuery({
    queryKey: ["/api/customers/stats"],
    queryFn: async () => {
      const response = await fetch("/api/customers/stats", {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch customer stats');
      }
      return response.json();
    },
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Customer name is required";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    
    if (formData.creditLimit && isNaN(parseFloat(formData.creditLimit))) {
      errors.creditLimit = "Credit limit must be a valid number";
    }
    
    setFormErrors(errors);
    return errors;
  };

  const createCustomerMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let message = "Failed to create customer";
        try {
          const error = await response.json();
          message = error?.message || error?.error || message;
        } catch {}
        throw new Error(message);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Customer created successfully"
      });
      setIsCreateDialogOpen(false);
      resetForm();
      // Invalidate both customer queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers/stats"] });
    },
    onError: (error: any) => {
      let errorMessage = "Failed to create customer";
      
      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    },
  });

  const handleCreateCustomer = async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: Object.values(errors).join(", "),
        variant: "destructive"
      });
      return;
    }

    // Build payload matching backend Zod schema; omit blank optionals and keep creditLimit as string
    const payload: any = {
      name: formData.name,
      customerType: formData.customerType,
      classification: formData.classification,
      isActive: formData.isActive,
    };
    if (formData.email && formData.email.trim() !== "") payload.email = formData.email.trim();
    if (formData.phone && formData.phone.trim() !== "") payload.phone = formData.phone.trim();
    if (formData.address && formData.address.trim() !== "") payload.address = formData.address.trim();
    if (formData.taxId && formData.taxId.trim() !== "") payload.taxId = formData.taxId.trim();
    if (formData.creditLimit && formData.creditLimit.trim() !== "") payload.creditLimit = formData.creditLimit.trim();
    if (formData.paymentTerms && formData.paymentTerms.trim() !== "") payload.paymentTerms = formData.paymentTerms.trim();

    createCustomerMutation.mutate(payload);
  };

  const updateCustomerMutation = useMutation({
    mutationFn: async ({ customerId, data }: { customerId: string; data: any }) => {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update customer");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Customer updated successfully"
      });
      setIsEditDialogOpen(false);
      setEditingCustomer(null);
      resetForm();
      // Invalidate both customer queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers/stats"] });
    },
    onError: (error: any) => {
      let errorMessage = "Failed to update customer";
      
      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    },
  });

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return;

    updateCustomerMutation.mutate({
      customerId: editingCustomer.id,
      data: {
        ...formData,
        creditLimit: formData.creditLimit && formData.creditLimit.trim() !== "" ? formData.creditLimit : null
      }
    });
  };

  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: string) => {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete customer");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Customer deleted successfully"
      });
      // Invalidate both customer queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete customer",
        variant: "destructive"
      });
    },
  });

  const handleDeleteCustomer = async (customerId: string) => {
    deleteCustomerMutation.mutate(customerId);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      customerType: "Retail",
      classification: "Individual",
      taxId: "",
      creditLimit: "",
      paymentTerms: "Net 30",
      isActive: true
    });
    setFormErrors({});
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      customerType: customer.customerType,
      classification: customer.classification,
      taxId: customer.taxId || "",
      creditLimit: customer.creditLimit?.toString() || "",
      paymentTerms: customer.paymentTerms || "Net 30",
      isActive: customer.isActive
    });
    setIsEditDialogOpen(true);
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "Retail": return "outline";
      case "Wholesale": return "outline"; // Will be styled with purple
      default: return "outline";
    }
  };

  const getClassificationBadgeVariant = (classification: string) => {
    switch (classification) {
      case "Corporate": return "outline";
      case "Individual": return "outline";
      case "Family": return "outline";
      case "Ministry": return "outline";
      case "Internal": return "outline";
      default: return "outline";
    }
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return "No limit";
    return new Intl.NumberFormat('en-KW', {
      style: 'currency',
      currency: 'BHD'
    }).format(value);
  };

  const formatCurrencyCompact = (value: number | null) => {
    if (!value) return "No limit";
    
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M BHD`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K BHD`;
    } else {
      return `${value.toFixed(value % 1 === 0 ? 0 : 1)} BHD`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Customer Management
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Manage customer master data and information
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="font-medium">Active System</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {/* <Button onClick={() => fetchCustomers()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button> */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Customer</DialogTitle>
                <DialogDescription>
                  Add a new customer to the system with complete information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Customer Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter customer name"
                      className={formErrors.name ? "border-red-500" : ""}
                    />
                    {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID</Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
                      placeholder="Enter tax ID"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerType">Customer Type *</Label>
                    <Select value={formData.customerType} onValueChange={(value) => setFormData(prev => ({ ...prev, customerType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CUSTOMER_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classification">Classification *</Label>
                    <Select value={formData.classification} onValueChange={(value) => setFormData(prev => ({ ...prev, classification: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select classification" />
                      </SelectTrigger>
                      <SelectContent>
                        {CUSTOMER_CLASSIFICATIONS.map(classification => (
                          <SelectItem key={classification.value} value={classification.value}>
                            {classification.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="creditLimit">Credit Limit</Label>
                    <Input
                      id="creditLimit"
                      type="number"
                      value={formData.creditLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: e.target.value }))}
                      placeholder="Enter credit limit"
                      className={formErrors.creditLimit ? "border-red-500" : ""}
                    />
                    {formErrors.creditLimit && <p className="text-sm text-red-500">{formErrors.creditLimit}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select value={formData.paymentTerms} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentTerms: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_TERMS.map(term => (
                          <SelectItem key={term.value} value={term.value}>
                            {term.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false);
                  setFormErrors({});
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateCustomer}
                  disabled={createCustomerMutation.isPending}
                >
                  {createCustomerMutation.isPending ? "Creating..." : "Create Customer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-50/50"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Total Customers</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.totalCustomers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                {stats.activeCustomers} active customers
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-green-50/50"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Retail Customers</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.retailCustomers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  {((stats.retailCustomers / stats.totalCustomers) * 100).toFixed(1)}%
                </div>
                <span className="text-gray-500">of total</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-purple-50/50"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Wholesale Customers</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Store className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.wholesaleCustomers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-purple-600" />
                  {((stats.wholesaleCustomers / stats.totalCustomers) * 100).toFixed(1)}%
                </div>
                <span className="text-gray-500">of total</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-orange-50/50"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Total Credit Limit</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-orange-600" /> 
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrencyCompact(stats.totalCreditLimit)}
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <span className="text-gray-500">Avg:</span>
                {formatCurrencyCompact(stats.averageCreditLimit)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Search & Filter</CardTitle>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Badge variant="secondary" className="gap-1">
                  Filtered
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={clearFilters}
                    data-testid="button-clear-filters"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search customers..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classification">Classification</Label>
                <Select value={filters.classification} onValueChange={(value) => handleFilterChange("classification", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All classifications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All classifications</SelectItem>
                    {CUSTOMER_CLASSIFICATIONS.map(classification => (
                      <SelectItem key={classification.value} value={classification.value}>
                        {classification.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <Select value={filters.isActive} onValueChange={(value) => handleFilterChange("isActive", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerType">Customer Type</Label>
                <Select value={filters.customerType} onValueChange={(value) => handleFilterChange("customerType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {CUSTOMER_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            Showing {customers.length} of {pagination.total} customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Classification</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Credit Limit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer: Customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {customer.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            customer.customerType === "Wholesale" ? "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-150" :
                            customer.customerType === "Retail" ? "bg-green-50 text-green-700 border-green-200" :
                            ""
                          }
                        >
                          {customer.customerType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            customer.classification === "Corporate" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            customer.classification === "Individual" ? "bg-green-50 text-green-700 border-green-200" :
                            customer.classification === "Family" ? "bg-orange-50 text-orange-700 border-orange-200" :
                            customer.classification === "Ministry" ? "bg-red-50 text-red-700 border-red-200" :
                            customer.classification === "Internal" ? "bg-gray-50 text-gray-700 border-gray-200" :
                            ""
                          }
                        >
                          {customer.classification}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {customer.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatCurrency(customer.creditLimit)}
                        </div>
                        {customer.paymentTerms && (
                          <div className="text-xs text-muted-foreground">
                            {customer.paymentTerms}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            customer.isActive 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {customer.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/customers/${customer.id}`)}
                            title="View customer details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(customer)}
                            className=""
                            title="Edit customer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                                title="Delete customer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the customer
                                  "{customer.name}" and remove all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCustomer(customer.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.pages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Customer Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-taxId">Tax ID</Label>
                <Input
                  id="edit-taxId"
                  value={formData.taxId}
                  onChange={(e) => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
                  placeholder="Enter tax ID"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-customerType">Customer Type *</Label>
                <Select value={formData.customerType} onValueChange={(value) => setFormData(prev => ({ ...prev, customerType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CUSTOMER_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-classification">Classification *</Label>
                <Select value={formData.classification} onValueChange={(value) => setFormData(prev => ({ ...prev, classification: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent>
                    {CUSTOMER_CLASSIFICATIONS.map(classification => (
                      <SelectItem key={classification.value} value={classification.value}>
                        {classification.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-creditLimit">Credit Limit</Label>
                <Input
                  id="edit-creditLimit"
                  type="number"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: e.target.value }))}
                  placeholder="Enter credit limit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-paymentTerms">Payment Terms</Label>
                <Select value={formData.paymentTerms} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentTerms: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TERMS.map(term => (
                      <SelectItem key={term.value} value={term.value}>
                        {term.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="edit-isActive" className="text-sm">
                Active customer
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateCustomer}
              disabled={updateCustomerMutation.isPending}
            >
              {updateCustomerMutation.isPending ? "Updating..." : "Update Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
