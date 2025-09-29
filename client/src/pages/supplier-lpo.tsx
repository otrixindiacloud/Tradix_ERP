import React, { useState } from "react";
import { useUserId } from "@/hooks/useUserId";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CalendarIcon, Package, Truck, FileText, Plus, Search, Filter, RefreshCw, CheckCircle, XCircle, Clock, Send, Eye } from "lucide-react";
import { format } from "date-fns";
import type { SupplierLpo, SupplierLpoItem, Supplier } from "@shared/schema";

interface LpoFilters {
  status?: string;
  supplierId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

const statusColors = {
  Draft: "text-gray-700 bg-gray-100 border border-gray-300",
  Sent: "text-gray-700 bg-gray-100 border border-gray-300",
  Confirmed: "text-green-700 bg-green-100 border border-green-300",
  Received: "text-purple-700 bg-purple-100 border border-purple-300",
  Cancelled: "text-red-700 bg-red-100 border border-red-300",
  Missing: "flex items-center gap-2 text-red-700 bg-red-100 border border-red-300 px-4 h-8 min-w-[100px] justify-center font-medium text-base",
};

const approvalStatusColors = {
  "Not Required": "text-white bg-blue-500 border border-blue-500 font-semibold px-4 py-1 rounded-full",
  Pending: "text-yellow-700 bg-yellow-100 border border-yellow-300",
  Approved: "text-green-700 bg-green-100 border border-green-300",
  Rejected: "text-red-700 bg-red-100 border border-red-300",
};

export default function SupplierLpoPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const userId = useUserId();
  const [filters, setFilters] = useState<LpoFilters>({});
  const [selectedLpo, setSelectedLpo] = useState<SupplierLpo | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAutoGenerate, setShowAutoGenerate] = useState(false);
  const [showBacklog, setShowBacklog] = useState(false);
  const [showCreateLpo, setShowCreateLpo] = useState(false);
  const [settingDeliveryLpoId, setSettingDeliveryLpoId] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState<string>("");
  const [editLpo, setEditLpo] = useState<SupplierLpo | null>(null);
  // Mutation for updating expected delivery date
  const updateExpectedDeliveryMutation = useMutation({
    mutationFn: async ({ lpoId, expectedDeliveryDate }: { lpoId: string; expectedDeliveryDate: string }) => {
      try {
        const response = await apiRequest("PATCH", `/api/supplier-lpos/${lpoId}/expected-delivery`, { expectedDeliveryDate, userId });
        return response;
      } catch (error: any) {
        // Enhanced error handling for JSON parsing issues
        if (error.message?.includes("HTML instead of JSON")) {
          throw new Error("Server endpoint not found. Please ensure the server is running with the latest code.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Expected delivery date updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/supplier-lpos"] });
      setSettingDeliveryLpoId(null);
      setCalendarDate("");
    },
    onError: (error: any) => {
      console.error("Delivery date update error:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update expected delivery date", 
        variant: "destructive" 
      });
    },
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch supplier LPOs with filters
  const { data: supplierLpos, isLoading } = useQuery({
    queryKey: ["/api/supplier-lpos", filters, currentPage],
    queryFn: async ({ queryKey }) => {
      const [url, filterParams, page] = queryKey as [string, typeof filters, number];
      const params = new URLSearchParams();
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      // Add pagination parameters
      params.append('limit', pageSize.toString());
      params.append('offset', ((page - 1) * pageSize).toString());
      const response = await fetch(`${url}?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  // Fetch suppliers for filter dropdown
  const { data: suppliers } = useQuery({
    queryKey: ["/api/suppliers"],
  });

  // Fetch backlog data
  const { data: backlogData } = useQuery({
    queryKey: ["/api/supplier-lpos/backlog"],
    enabled: showBacklog,
  });

  // Fetch customer order backlog
  const { data: customerBacklog } = useQuery({
    queryKey: ["/api/customer-orders/backlog"],
    enabled: showBacklog,
  });

  // Mutation for sending LPO to supplier
  const sendToSupplierMutation = useMutation({
    mutationFn: async (lpoId: string) => {
      const response = await apiRequest("POST", `/api/supplier-lpos/${lpoId}/send-to-supplier`, { userId });
      return response;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "LPO sent to supplier successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/supplier-lpos"] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to send LPO to supplier",
        variant: "destructive" 
      });
    },
  });

  // Mutation for approving LPO
  const approveLpoMutation = useMutation({
    mutationFn: async ({ lpoId, notes }: { lpoId: string; notes?: string }) => {
      const response = await apiRequest("POST", `/api/supplier-lpos/${lpoId}/approve`, { userId, notes });
      return response;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "LPO approved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/supplier-lpos"] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to approve LPO",
        variant: "destructive" 
      });
    },
  });

  const handleFilterChange = (key: keyof LpoFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getStatusBadge = (status: string) => (
    status === "Missing"
      ? (
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors.Missing}`}>
            <XCircle className="h-4 w-4" />
            Missing
          </span>
        )
      : (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[status as keyof typeof statusColors] || "text-gray-700 bg-gray-100 border border-gray-300"}`}>
            {status}
          </span>
        )
  );

  const getApprovalStatusBadge = (status: string) => (
    <span className={`inline-flex items-center text-sm font-medium ${approvalStatusColors[status as keyof typeof approvalStatusColors] || "text-gray-700 bg-gray-100 border border-gray-300 px-3 py-1 rounded-full"}`}>
      {status}
    </span>
  );

  // Handler for saving expected delivery date in EditExpectedDeliveryDialog
  const handleEditSave = (date: string) => {
    if (!editLpo) return;
    updateExpectedDeliveryMutation.mutate({ lpoId: editLpo.id, expectedDeliveryDate: date }, {
      onSuccess: () => {
        setEditLpo(null);
      },
      onError: () => {
        // Error handling is already done in the mutation
      }
    });
  };

  // Pagination logic - API already handles pagination
  const lpoList = Array.isArray(supplierLpos?.data) ? supplierLpos.data : [];
  const totalPages = supplierLpos?.totalPages || 1;
  const paginatedLpos = lpoList; // API already returns paginated data

  // Status chip styles (icon + colored border/background) for main table
  const statusChipStyles: Record<string, string> = {
    Draft: "border-slate-300 text-slate-700 bg-slate-50",
    Sent: "border-blue-300 text-blue-700 bg-blue-50",
    Confirmed: "border-emerald-300 text-emerald-700 bg-emerald-50",
    Received: "border-purple-300 text-purple-700 bg-purple-50",
    Cancelled: "border-rose-300 text-rose-700 bg-rose-50",
    Missing: "border-red-300 text-red-700 bg-red-50"
  };
  const statusIconMap: Record<string, React.ReactNode> = {
    Draft: <FileText className="h-3.5 w-3.5" />,
    Sent: <Send className="h-3.5 w-3.5" />,
    Confirmed: <CheckCircle className="h-3.5 w-3.5" />,
    Received: <Package className="h-3.5 w-3.5" />,
    Cancelled: <XCircle className="h-3.5 w-3.5" />,
    Missing: <XCircle className="h-3.5 w-3.5" />
  };

  const renderStatusChip = (status?: string) => {
    const key = status || 'Missing';
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm ${statusChipStyles[key] || statusChipStyles.Missing}`}>
        {statusIconMap[key]}
        <span>{key}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Card-style header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-indigo-100/30 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-48 h-24 bg-gradient-to-tr from-gray-100/20 to-transparent rounded-tr-full"></div>
        
        <div className="relative px-8 py-6 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 bg-clip-text text-transparent">
                  Supplier LPO Management
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                    Step 6
                  </span>
                  <span className="text-gray-600 text-sm">
                    Manage Local Purchase Orders with suppliers
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
              Streamline your supplier relationships with automated LPO generation, amendment tracking, and comprehensive approval workflows
            </p>
          </div>
          
          <div className="flex gap-4 ml-8">
            <Button
              variant="outline"
              className="group flex items-center gap-3 border-2 border-green-600 bg-green-50 hover:bg-green-100 text-green-700 font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow-md focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
              onClick={() => setShowAutoGenerate(true)}
              data-testid="button-auto-generate-lpo"
            >
              <div className="w-8 h-8 bg-green-100 border border-green-200 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <RefreshCw className="h-4 w-4 text-green-600 group-hover:rotate-180 transition-transform duration-500" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">Auto Generate</div>
                <div className="text-xs opacity-80">LPOs</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="group flex items-center gap-3 bg-blue-600 text-white font-semibold px-6 py-3"
              onClick={() => setShowCreateLpo(true)}
              data-testid="button-new-supplier-lpo"
            >
              {/* <div className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors"> */}
                <Plus className="h-4 w-4 text-white-600 group-hover:scale-110 transition-transform duration-200" />
              {/* </div> */}
              <div className="text-left">
                <div className="text-sm  font-bold">New Supplier</div>
                <div className="text-xs opacity-80">LPO</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
      {/* Create Supplier LPO Dialog */}
      {showCreateLpo && (
        <Dialog open={showCreateLpo} onOpenChange={open => setShowCreateLpo(open)}>
          <DialogContent className="max-w-md w-full p-0" style={{ maxHeight: '80vh',maxWidth:'80vh' ,overflowY: 'auto' }}>
            <DialogHeader className="px-4 pt-4">
              <DialogTitle className="text-xl">New Supplier LPO</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4">
              <CreateLpoForm 
                onClose={() => setShowCreateLpo(false)} 
                onCreated={() => {
                  setShowCreateLpo(false);
                  queryClient.invalidateQueries({ queryKey: ["/api/supplier-lpos"] });
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Auto Generate LPOs Dialog */}
      {showAutoGenerate && (
        <Dialog open={showAutoGenerate} onOpenChange={open => setShowAutoGenerate(open)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Auto Generate Supplier LPOs</DialogTitle>
            </DialogHeader>
            <AutoGenerateLposForm onClose={() => setShowAutoGenerate(false)} />
          </DialogContent>
        </Dialog>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FileText className="h-6 w-6 text-gray-600" />
              <span className="font-bold text-lg">Total LPOs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-gray-600">
                {Array.isArray(supplierLpos) ? supplierLpos.length : 0}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Clock className="h-6 w-6 text-yellow-600" />
              <span className="font-bold text-lg">Pending Approval</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-yellow-600">
                {Array.isArray(supplierLpos) ? supplierLpos.filter((lpo: SupplierLpo) => lpo.approvalStatus === "Pending").length : 0}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Send className="h-6 w-6 text-gray-600" />
              <span className="font-bold text-lg">Sent to Suppliers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-gray-600">
                {Array.isArray(supplierLpos) ? supplierLpos.filter((lpo: SupplierLpo) => lpo.status === "Sent").length : 0}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="font-bold text-lg">Confirmed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-green-600">
                {Array.isArray(supplierLpos) ? supplierLpos.filter((lpo: SupplierLpo) => lpo.status === "Confirmed").length : 0}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backlog Report */}
      {showBacklog && (
        <Tabs defaultValue="supplier-backlog" className="w-full">
          <TabsList>
            <TabsTrigger value="supplier-backlog">Supplier LPO Backlog</TabsTrigger>
            <TabsTrigger value="customer-backlog">Customer Order Backlog</TabsTrigger>
          </TabsList>
          <TabsContent value="supplier-backlog">
            <Card>
              <CardHeader>
                <CardTitle>Supplier LPO Backlog Report</CardTitle>
                <CardDescription>
                  Outstanding supplier orders requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BacklogTable data={backlogData as any[]} type="supplier" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="customer-backlog">
            <Card>
              <CardHeader>
                <CardTitle>Customer Order Backlog Report</CardTitle>
                <CardDescription>
                  Outstanding customer orders requiring supplier fulfillment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BacklogTable data={customerBacklog as any[]} type="customer" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                <Filter className="h-4 w-4 text-gray-600" />
              </div>
              <CardTitle className="text-base">Filters</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm flex items-center gap-1 px-2 py-0 h-6 min-h-0 text-xs"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                <Filter className="w-3 h-3 mr-1" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
              {Object.keys(filters).length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  data-testid="button-clear-filters"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={filters.status || ""}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger data-testid="select-status-filter">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="supplier-filter">Supplier</Label>
              <Select
                value={filters.supplierId || ""}
                onValueChange={(value) => handleFilterChange("supplierId", value)}
              >
                <SelectTrigger data-testid="select-supplier-filter">
                  <SelectValue placeholder="All suppliers" />
                </SelectTrigger>
                <SelectContent>
                  {(Array.isArray(suppliers) ? suppliers : []).map((supplier: Supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date-from">Date From</Label>
              <Input
                id="date-from"
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                data-testid="input-date-from"
              />
            </div>
            <div>
              <Label htmlFor="date-to">Date To</Label>
              <Input
                id="date-to"
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                data-testid="input-date-to"
              />
            </div>
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="LPO number, supplier..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                data-testid="input-search"
                className="border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-md shadow-none"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* LPOs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier LPOs</CardTitle>
          <CardDescription>
            Manage and track all Local Purchase Orders with suppliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="border border-blue-300 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="border-r border-gray-200">LPO Number</TableHead>
                    <TableHead className="border-r border-gray-200">Supplier</TableHead>
                    <TableHead className="border-r border-gray-200">Status</TableHead>
                    <TableHead className="border-r border-gray-200">Approval</TableHead>
                    <TableHead className="border-r border-gray-200">LPO Date</TableHead>
                    <TableHead className="border-r border-gray-200">Expected Delivery</TableHead>
                    <TableHead className="border-r border-gray-200">Total Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLpos.map((lpo: SupplierLpo & { supplierName?: string }) => (
                    <TableRow
                      key={lpo.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200"
                      onClick={() => setSelectedLpo(lpo)}
                      data-testid={`row-lpo-${lpo.id}`}
                    >
                      <TableCell className="font-medium border-r border-gray-200">{lpo.lpoNumber}</TableCell>
                      <TableCell className="border-r border-gray-200">
                        <div className="text-sm font-medium text-slate-700 truncate max-w-[180px]" title={lpo.supplierName || '-' }>
                          {lpo.supplierName || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="border-r border-gray-200">
                        {renderStatusChip(lpo.status || undefined)}
                      </TableCell>
                      <TableCell className="border-r border-gray-200">{getApprovalStatusBadge(lpo.approvalStatus || "Not Required")}</TableCell>
                      <TableCell className="border-r border-gray-200">
                        {lpo.lpoDate ? format(new Date(lpo.lpoDate), "MMM dd, yyyy") : "-"}
                      </TableCell>
                      <TableCell className="border-r border-gray-200">
                        {lpo.expectedDeliveryDate ? (
                          <span className="px-2 py-1 rounded bg-green-50 text-green-700 font-semibold border border-green-200">
                            {format(new Date(lpo.expectedDeliveryDate), "MMM dd, yyyy")}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-gray-100 text-gray-500 border border-gray-200">Date is not set</span>
                        )}
                      </TableCell>
                      <TableCell className="border-r border-gray-200">
                        {lpo.currency} {Number(lpo.totalAmount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 relative">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-600 text-green-600 hover:bg-green-50"
                            onClick={e => {
                              e.stopPropagation();
                              setEditLpo(lpo);
                            }}
                            data-testid={`button-set-expected-delivery-${lpo.id}`}
                          >
                            Set Date
                          </Button>
                          {lpo.status === "Draft" && lpo.approvalStatus === "Approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className=""
                              onClick={(e) => {
                                e.stopPropagation();
                                sendToSupplierMutation.mutate(lpo.id);
                              }}
                              data-testid={`button-send-${lpo.id}`}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          {lpo.approvalStatus === "Pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                approveLpoMutation.mutate({ lpoId: lpo.id });
                              }}
                              data-testid={`button-approve-${lpo.id}`}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* Pagination Controls */}
              {lpoList.length > pageSize && (
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

      {/* LPO Detail Dialog */}
      {selectedLpo && (
        <LpoDetailDialog
          lpo={selectedLpo}
          open={!!selectedLpo}
          onClose={() => setSelectedLpo(null)}
        />
      )}
      {editLpo && (
        <EditExpectedDeliveryDialog
          lpo={editLpo}
          open={!!editLpo}
          onClose={() => setEditLpo(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

// Auto Generate LPOs Form Component
function AutoGenerateLposForm({ onClose }: { onClose: () => void }) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState("supplier");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: salesOrders } = useQuery({
    queryKey: ["/api/sales-orders", { status: "Confirmed" }],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/sales-orders?status=Confirmed");
      // Parse the response as JSON
      return typeof response.json === "function" ? await response.json() : response;
    },
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        "POST",
        "/api/supplier-lpos/from-sales-orders",
        {
          salesOrderIds: selectedOrders,
          groupBy,
          userId: "current-user-id",
        }
      );
      return response;
    },
    onSuccess: async (data) => {
      const result = typeof data.json === "function" ? await data.json() : data;
      toast({ 
        title: "Success", 
        description: `Generated ${Array.isArray(result) ? result.length : 0} supplier LPO(s) successfully` 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/supplier-lpos"] });
      onClose();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to generate LPOs",
        variant: "destructive" 
      });
    },
  });

  return (
    <div className="space-y-6">
      {/* Group By Selector */}
      <div>
        <Label>Group By</Label>
        <Select value={groupBy} onValueChange={setGroupBy}>
          <SelectTrigger data-testid="select-group-by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="delivery_date">Expected Delivery Date</SelectItem>
            <SelectItem value="custom">Custom Grouping</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sales Orders List */}
      <div>
        <Label>Select Sales Orders</Label>
        <div className="border rounded-md p-3 max-h-64 overflow-y-auto space-y-1">
          {(Array.isArray(salesOrders) ? salesOrders : []).map((order: any) => (
            <div key={order.id} className="flex items-center justify-between py-1 pr-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrders([...selectedOrders, order.id]);
                    } else {
                      setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                    }
                  }}
                  data-testid={`checkbox-order-${order.id}`}
                />
                <span className="text-sm">
                  {order.orderNumber} - {order.customer?.name || 'Unknown Customer'} - ${Number(order.totalAmount || 0).toLocaleString()}
                </span>
              </label>
              {order.status && (
                <Badge variant="outline" className="text-xs">
                  {order.status}
                </Badge>
              )}
            </div>
          ))}
          {(!salesOrders || salesOrders.length === 0) && (
            <div className="text-sm text-gray-500 py-4 text-center">No confirmed sales orders available.</div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose} data-testid="button-cancel">
          Cancel
        </Button>
        <Button
          onClick={() => generateMutation.mutate()}
          disabled={selectedOrders.length === 0 || generateMutation.isPending}
          data-testid="button-generate"
          className="border border-red-500 text-red-600 bg-red-50 hover:bg-red-100 px-4 h-8 min-w-[100px] justify-center font-medium text-base"
        >
          {generateMutation.isPending ? "Generating..." : "Generate LPOs"}
        </Button>
      </div>
    </div>
  );
}

// Backlog Table Component
function BacklogTable({ data, type }: { data: any[]; type: "supplier" | "customer" }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No backlog items found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{type === "supplier" ? "LPO Number" : "Order Number"}</TableHead>
          <TableHead>{type === "supplier" ? "Supplier" : "Customer"}</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Days Pending</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Items</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.lpoId || item.orderId}>
            <TableCell className="font-medium">
              {item.lpoNumber || item.orderNumber}
            </TableCell>
            <TableCell>{item.supplierName || item.customerName}</TableCell>
            <TableCell>
              <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                {item.status}
              </Badge>
            </TableCell>
            <TableCell>
              {format(new Date(item.lpoDate || item.orderDate), "MMM dd, yyyy")}
            </TableCell>
            <TableCell>
              <span className={`font-medium ${Number(item.daysPending) > 7 ? "text-red-600" : "text-gray-600"}`}>
                {item.daysPending} days
              </span>
            </TableCell>
            <TableCell>
              ${Number(item.totalAmount || 0).toLocaleString()}
            </TableCell>
            <TableCell>
              {item.itemCount} items
              {item.pendingItems && ` (${item.pendingItems} pending)`}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// LPO Detail Dialog Component
function LpoDetailDialog({ 
  lpo, 
  open, 
  onClose 
}: { 
  lpo: SupplierLpo; 
  open: boolean; 
  onClose: () => void; 
}) {
  const { data: lpoItems } = useQuery({
    queryKey: ["/api/supplier-lpos", lpo.id, "items"],
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>LPO Details - {lpo.lpoNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <div className="mt-1">
                {lpo.status && getStatusBadge(lpo.status)}
              </div>
            </div>
            <div>
              <Label>Approval Status</Label>
              <div className="mt-1">
                <Badge className={approvalStatusColors[lpo.approvalStatus as keyof typeof approvalStatusColors] || "text-white"}>
                  {lpo.approvalStatus || "Not Required"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div>
                <Label>Subtotal</Label>
                <div className="text-lg font-semibold">
                  {lpo.currency} {Number(lpo.subtotal || 0).toLocaleString()}
                </div>
              </div>
              <div>
                <Label>Tax Amount</Label>
                <div className="text-lg font-semibold">
                  {lpo.currency} {Number(lpo.taxAmount || 0).toLocaleString()}
                </div>
              </div>
              <div>
                <Label>Total Amount</Label>
                <div className="text-lg font-semibold text-blue-600">
                  {lpo.currency} {Number(lpo.totalAmount || 0).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Supplier Code</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(Array.isArray(lpoItems) ? lpoItems : []).map((item: SupplierLpoItem) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.itemDescription}</TableCell>
                      <TableCell>{item.supplierCode}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {lpo.currency} {Number(item.unitCost).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {lpo.currency} {Number(item.totalCost).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[item.deliveryStatus as keyof typeof statusColors] || "text-white"}>
                          {item.deliveryStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getStatusBadge(status: string) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[status as keyof typeof statusColors] || "text-gray-700 bg-gray-100 border border-gray-300"}`}>
      {status}
    </span>
  );
}

// Create LPO Form Component
function CreateLpoForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [formData, setFormData] = useState({
    supplierId: "",
    lpoDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: "",
    requestedDeliveryDate: "",
    paymentTerms: "",
    deliveryTerms: "",
    termsAndConditions: "",
    specialInstructions: "",
    requiresApproval: false,
    currency: "BHD",
    items: [] as Array<{
      itemId: string;
      supplierCode: string;
      barcode: string;
      itemDescription: string;
      quantity: number;
      unitCost: number;
      urgency: string;
      specialInstructions: string;
    }>
  });
  const [showAddItem, setShowAddItem] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch suppliers and items
  const { data: suppliers } = useQuery({
    queryKey: ["/api/suppliers"],
  });

  const { data: items } = useQuery({
    queryKey: ["/api/items"],
  });

  // Create LPO mutation
  const createLpoMutation = useMutation({
    mutationFn: async () => {
      const lpoData = {
        ...formData,
        lpoNumber: `LPO-${Date.now()}`, // Generate LPO number
        createdBy: "current-user-id",
        subtotal: formData.items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0),
        taxAmount: 0, // Calculate tax if needed
        totalAmount: formData.items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0),
        sourceType: "Manual",
        version: 1,
        approvalStatus: formData.requiresApproval ? "Pending" : "Not Required",
      };

      const response = await apiRequest("POST", "/api/supplier-lpos", lpoData);
      return response;
    },
    onSuccess: () => {
      toast({ 
        title: "Success", 
        description: "LPO created successfully" 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/supplier-lpos"] });
      onClose();
      if (onCreated) onCreated();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create LPO",
        variant: "destructive" 
      });
    },
  });

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        itemId: "",
        supplierCode: "",
        barcode: "",
        itemDescription: "",
        quantity: 1,
        unitCost: 0,
        urgency: "Normal",
        specialInstructions: ""
      }]
    }));
    setShowAddItem(true);
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the LPO",
        variant: "destructive"
      });
      return;
    }
    createLpoMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="supplier">Supplier *</Label>
          <Select
            value={formData.supplierId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, supplierId: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(suppliers)
                ? suppliers.map((supplier: any) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))
                : []
              }
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="lpoDate">LPO Date *</Label>
          <Input
            id="lpoDate"
            type="date"
            value={formData.lpoDate}
            onChange={(e) => setFormData(prev => ({ ...prev, lpoDate: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
          <Input
            id="expectedDeliveryDate"
            type="date"
            value={formData.expectedDeliveryDate}
            onChange={(e) => setFormData(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="requestedDeliveryDate">Requested Delivery Date</Label>
          <Input
            id="requestedDeliveryDate"
            type="date"
            value={formData.requestedDeliveryDate}
            onChange={(e) => setFormData(prev => ({ ...prev, requestedDeliveryDate: e.target.value }))}
          />
        </div>
      </div>

      {/* Financial Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BHD">BHD</SelectItem>
              <SelectItem value="BHD">BHD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="QAR">QAR</SelectItem>
              <SelectItem value="AED">AED</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="requiresApproval"
            checked={formData.requiresApproval}
            onChange={(e) => setFormData(prev => ({ ...prev, requiresApproval: e.target.checked }))}
          />
          <Label htmlFor="requiresApproval">Requires Approval</Label>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Input
            id="paymentTerms"
            value={formData.paymentTerms}
            onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
            placeholder="e.g., Net 30 days"
          />
        </div>
        <div>
          <Label htmlFor="deliveryTerms">Delivery Terms</Label>
          <Input
            id="deliveryTerms"
            value={formData.deliveryTerms}
            onChange={(e) => setFormData(prev => ({ ...prev, deliveryTerms: e.target.value }))}
            placeholder="e.g., FOB Destination"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="termsAndConditions">Terms and Conditions</Label>
        <textarea
          id="termsAndConditions"
          className="w-full p-2 border rounded-md"
          rows={3}
          value={formData.termsAndConditions}
          onChange={(e) => setFormData(prev => ({ ...prev, termsAndConditions: e.target.value }))}
          placeholder="Enter terms and conditions..."
        />
      </div>

      <div>
        <Label htmlFor="specialInstructions">Special Instructions</Label>
        <textarea
          id="specialInstructions"
          className="w-full p-2 border rounded-md"
          rows={3}
          value={formData.specialInstructions}
          onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
          placeholder="Enter any special instructions..."
        />
      </div>

      {/* Items Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-lg font-semibold">Items</Label>
          <Button type="button" onClick={addItem} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {formData.items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
            No items added yet. Click "Add Item" to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Item {index + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Item</Label>
                      <Select
                        value={item.itemId}
                        onValueChange={(value) => {
                          updateItem(index, "itemId", value);
                          const selectedItem = (Array.isArray(items) ? items : []).find((i: any) => i.id === value);
                          if (selectedItem) {
                            updateItem(index, "itemDescription", selectedItem.description);
                            updateItem(index, "barcode", selectedItem.barcode || "");
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {(Array.isArray(items) ? items : []).map((item: any) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} - {item.sku}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Supplier Code</Label>
                      <Input
                        value={item.supplierCode}
                        onChange={(e) => updateItem(index, "supplierCode", e.target.value)}
                        placeholder="Enter supplier code"
                        required
                      />
                    </div>
                    <div>
                      <Label>Barcode</Label>
                      <Input
                        value={item.barcode}
                        onChange={(e) => updateItem(index, "barcode", e.target.value)}
                        placeholder="Enter barcode"
                        required
                      />
                    </div>
                    <div>
                      <Label>Urgency</Label>
                      <Select
                        value={item.urgency}
                        onValueChange={(value) => updateItem(index, "urgency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Unit Cost</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitCost}
                        onChange={(e) => updateItem(index, "unitCost", parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Item Description</Label>
                    <textarea
                      className="w-full p-2 border rounded-md"
                      rows={2}
                      value={item.itemDescription}
                      onChange={(e) => updateItem(index, "itemDescription", e.target.value)}
                      placeholder="Enter item description"
                      required
                    />
                  </div>
                  <div>
                    <Label>Special Instructions</Label>
                    <textarea
                      className="w-full p-2 border rounded-md"
                      rows={2}
                      value={item.specialInstructions}
                      onChange={(e) => updateItem(index, "specialInstructions", e.target.value)}
                      placeholder="Enter special instructions for this item"
                    />
                  </div>
                  <div className="text-right font-semibold">
                    Total: {formData.currency} {(item.quantity * item.unitCost).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {formData.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">Subtotal</div>
                <div className="text-lg font-semibold">
                  {formData.currency} {formData.items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Tax</div>
                <div className="text-lg font-semibold">
                  {formData.currency} 0.00
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-lg font-semibold text-blue-600">
                  {formData.currency} {formData.items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="outline"
          className="border-green-600 text-green-600 bg-green-50 hover:bg-green-100"
          disabled={createLpoMutation.isPending || formData.items.length === 0}
        >
          {createLpoMutation.isPending ? "Creating..." : "Create LPO"}
        </Button>
      </div>
    </form>
  );
}

function EditExpectedDeliveryDialog({ lpo, open, onClose, onSave }: {
  lpo: SupplierLpo;
  open: boolean;
  onClose: () => void;
  onSave: (date: string) => void;
}) {
  const [date, setDate] = useState(
    lpo.expectedDeliveryDate
      ? (lpo.expectedDeliveryDate instanceof Date
          ? lpo.expectedDeliveryDate.toISOString().split('T')[0]
          : String(lpo.expectedDeliveryDate).split('T')[0])
      : ""
  );
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!date) return;
    setSaving(true);
    onSave(date);
  };

  // Reset saving state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setSaving(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Expected Delivery Date</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Expected Delivery Date</Label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              min={new Date().toISOString().split('T')[0]}
              data-testid={`edit-calendar-expected-delivery-${lpo.id}`}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={!date || saving}
              className="border-green-600 text-green-600 bg-green-50 hover:bg-green-100"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}