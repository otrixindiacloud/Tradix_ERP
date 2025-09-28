import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  ArrowRightLeft,
  Plus, 
  Search, 
  Filter,
  Edit, 
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  DollarSign,
  FileText,
  TrendingDown,
  Building2,
  Package,
  Minus,
  Activity,
  BarChart3,
  Trash
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DataTable from "@/components/tables/data-table";
import { formatDate, formatCurrency } from "@/lib/utils";

// Helper: format a date (string from input or Date) to backend-required 'YYYY-MM-DD HH:mm:ss+00'
function toBackendTimestamp(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  let d: Date | null = null;
  if (value instanceof Date) {
    d = value;
  } else if (typeof value === 'string' && value.trim()) {
    // Accept ISO already
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) return value;
    // Date-only -> midnight UTC
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, day] = value.split('-').map(Number);
      d = new Date(Date.UTC(y, (m as number) - 1, day, 0, 0, 0));
    } else {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) d = parsed;
    }
  }
  if (!d || isNaN(d.getTime())) return null;
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z'); // Trim ms for cleanliness
}

// Form schemas
const stockIssueSchema = z.object({
  issueNumber: z.string().min(1, "Issue number is required"),
  itemId: z.string().min(1, "Item is required"),
  quantityIssued: z.number().min(1, "Quantity must be greater than 0"),
  issuedTo: z.string().min(1, "Issued to is required"),
  issueDate: z.string().min(1, "Issue date is required").or(z.null()),
  purpose: z.string().min(1, "Purpose is required"),
  departmentId: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().optional(), // Add status field
});

type StockIssueForm = z.infer<typeof stockIssueSchema>;

// Status icon helper (no background colors, only icon + label)
const getStatusIcon = (status: string | undefined) => {
  switch (status) {
    case "Issued":
      return <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
    case "Applied":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "Cancelled":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "Draft":
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

// Status classes for bordered pill (no background fill)
const getStatusClasses = (status: string | undefined) => {
  switch (status) {
    case "Issued":
      return "border-blue-300 text-blue-700 bg-blue-50";
    case "Applied":
      return "border-green-300 text-green-700 bg-green-50";
    case "Cancelled":
      return "border-red-300 text-red-700 bg-red-50";
    case "Draft":
    default:
      return "border-gray-300 text-gray-700 bg-gray-50";
  }
};

export default function StockIssuesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch stock issues from new API
  const { data: stockIssues = [], isLoading } = useQuery({
    queryKey: ["stock-issues"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/stock-issues");
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Failed to fetch stock issues:", error);
        return [];
      }
    },
  });

  // Fetch items for dropdown
   const { data: items = [] } = useQuery({
      queryKey: ["inventory-items"],
      queryFn: async () => {
        try {
          const response = await apiRequest("GET", "/api/inventory-items");
          const data = await response.json();
          return Array.isArray(data) ? data : [];
        } catch (error) {
          console.error("Failed to fetch inventory items:", error);
          return [];
        }
      },
    });

  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ["stock-issues-stats"],
    queryFn: async () => {
      const issuesArray = Array.isArray(stockIssues) ? stockIssues : [];
      const total = issuesArray.length;
      const draft = issuesArray.filter(i => i.status === "Draft").length;
      const issued = issuesArray.filter(i => i.status === "Issued").length;
      const applied = issuesArray.filter(i => i.status === "Applied").length;
      const cancelled = issuesArray.filter(i => i.status === "Cancelled").length;
      
      // Calculate total value issued
      const totalValue = issuesArray.reduce((sum, issue) => {
        return sum + (parseFloat(issue.quantity || "0") * parseFloat(issue.unitPrice || "0"));
      }, 0);
      
      return { total, draft, issued, applied, cancelled, totalValue };
    },
    enabled: Array.isArray(stockIssues) && stockIssues.length > 0,
  });

  // Create stock issue mutation
  const createIssueMutation = useMutation({
    mutationFn: async (data: StockIssueForm) => {
      const isoDate = toBackendTimestamp(data.issueDate);
      const issueData: any = {
        issueNumber: data.issueNumber || undefined,
        itemId: data.itemId,
        issuedTo: data.issuedTo || undefined,
        quantity: Number(data.quantityIssued),
        reason: data.purpose || undefined,
        notes: data.notes || undefined,
        departmentId: data.departmentId || undefined,
        status: data.status || "Draft",
      };
      if (isoDate) issueData.issueDate = isoDate; // only send if valid
      return await apiRequest("POST", "/api/stock-issues", issueData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-issues"] });
      setShowCreateDialog(false);
      form.reset();
      toast({ title: "Success", description: "Stock issue created successfully" });
    },
    onError: async (error: any) => {
      // Attempt to surface server validation details if present
      let details: string | undefined;
      const msg: string = error?.message || '';
      if (msg.includes('{')) {
        try {
          const jsonStart = msg.indexOf('{');
            const raw = msg.substring(jsonStart);
            const parsed = JSON.parse(raw);
            if (parsed?.issues) details = Array.isArray(parsed.issues) ? parsed.issues.join('; ') : undefined;
            else if (parsed?.error) details = parsed.error;
        } catch {/* ignore parse errors */}
      }
      toast({
        title: "Failed to create stock issue",
        description: details || msg || "Unknown error",
        variant: "destructive",
      });
    },
  });
  // Update stock issue mutation
  const updateIssueMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<StockIssueForm> }) => {
      return await apiRequest("PUT", `/api/stock-issues/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-issues"] });
      toast({ title: "Success", description: "Stock issue updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update stock issue", variant: "destructive" });
    },
  });

  // Delete stock issue mutation
  const deleteIssueMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/stock-issues/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-issues"] });
      toast({ title: "Success", description: "Stock issue deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete stock issue", variant: "destructive" });
    },
  });

  const form = useForm<StockIssueForm>({
    resolver: zodResolver(stockIssueSchema),
    defaultValues: {
      issueNumber: "",
      itemId: "",
      quantityIssued: 0,
      issuedTo: "",
      issueDate: "",
      purpose: "",
      departmentId: "",
      notes: "",
    },
  });

  const onSubmit = (data: StockIssueForm) => {
    // Validate date before submit
    // Always convert to ISO string for backend
    const validDate = data.issueDate ? toBackendTimestamp(data.issueDate) : null;
    // Allow creation even if date parse fails (DB default will apply); keep field shape (string | null)
    createIssueMutation.mutate({ ...data, issueDate: validDate });
  };

  // Filter stock issues
  const filteredIssues = (Array.isArray(stockIssues) ? stockIssues : []).filter((issue: any) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = [
      issue.issueNumber,
      issue.issuedTo,
      issue.reason, // backend uses reason
      issue.notes,
      issue.itemName,
      issue.itemCode,
    ].some((v: any) => typeof v === "string" && v.toLowerCase().includes(q));

    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Table columns
  const columns = [
    {
      key: "issueNumber",
      header: "Issue Number",
      render: (_: any, issue: any) => (
  <span className="font-mono text-sm font-medium">{issue.issueNumber || "N/A"}</span>
      ),
    },
    {
      key: "itemName",
      header: "Item",
      render: (_: any, issue: any) => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-500" />
          <span>{issue.itemName || "N/A"}</span>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Minus className="h-4 w-4 text-red-500" />
          <span className="font-medium text-red-600">{value || "0"}</span>
        </div>
      ),
    },
    {
      key: "issuedTo",
      header: "Issued To",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span>{value || "N/A"}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (_: any, issue: any) => (
        <div className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusClasses(issue.status)}`}>
          {getStatusIcon(issue.status)}
          <span>{issue.status || "Draft"}</span>
        </div>
      ),
    },
    {
      key: "issueDate",
      header: "Issue Date",
      render: (_: any, issue: any) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{issue.issueDate ? formatDate(issue.issueDate) : "N/A"}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, issue: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedIssue(issue);
              setShowDetailsDialog(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedIssue(issue);
              setShowEditDialog(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              deleteIssueMutation.mutate(issue.id);
            }}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-red-50 rounded-xl p-6 border border-slate-200/50 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200/50">
              <ArrowRightLeft className="h-10 w-10 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">Stock Issues</h1>
              <p className="text-slate-600 text-base">Manage stock issues for production, sales, and internal use</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>Inventory Tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="px-6 py-2.5 font-medium">
                <Plus className="h-4 w-4 mr-2" />
                Issue Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Stock Issue</DialogTitle>
                <DialogDescription>
                  Issue stock items for production, sales, or internal use
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="issueNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter issue number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="itemId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select item" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {items.map((item: any) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.description || item.name || item.itemCode}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantityIssued"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity to Issue</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Enter quantity"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="issueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value ?? ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="issuedTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issued To</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter person/department" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purpose</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select purpose" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Production">Production</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                              <SelectItem value="Internal Use">Internal Use</SelectItem>
                              <SelectItem value="Maintenance">Maintenance</SelectItem>
                              <SelectItem value="Testing">Testing</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any additional notes..."
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createIssueMutation.isPending}>
                      {createIssueMutation.isPending ? "Creating..." : "Create Issue"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All stock issues</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <FileText className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
              <p className="text-xs text-muted-foreground">Pending approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issued</CardTitle>
              <ArrowRightLeft className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.issued}</div>
              <p className="text-xs text-muted-foreground">Stock issued</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applied</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.applied}</div>
              <p className="text-xs text-muted-foreground">Successfully applied</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <p className="text-xs text-muted-foreground">Cancelled issues</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                ${stats.totalValue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Issued value</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search stock issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Issued">Issued</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stock Issues Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stock Issues</CardTitle>
          <CardDescription>
            {filteredIssues.length} of {Array.isArray(stockIssues) ? stockIssues.length : 0} stock issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredIssues}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No stock issues found. Create your first stock issue to get started."
          />
      </CardContent>
    </Card>
      {/* Issue Details Dialog */}
      {/* Edit Issue Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Stock Issue</DialogTitle>
            <DialogDescription>
              Edit details for Issue #{selectedIssue?.issueNumber || "N/A"}
            </DialogDescription>
          </DialogHeader>
          {selectedIssue && (
            <EditStockIssueForm
              issue={selectedIssue}
              items={items}
              onClose={() => setShowEditDialog(false)}
              onSuccess={() => {
                setShowEditDialog(false);
                queryClient.invalidateQueries({ queryKey: ["stock-issues"] });
                toast({ title: "Success", description: "Stock issue updated successfully" });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Stock Issue Details</DialogTitle>
            <DialogDescription>
              Issue #{selectedIssue?.issueNumber || "N/A"}
            </DialogDescription>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Issue Number</Label>
                    <p className="text-sm font-medium">{selectedIssue.issueNumber || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Item</Label>
                    <p className="text-sm font-medium">{selectedIssue.itemName || selectedIssue.itemCode || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Quantity Issued</Label>
                    <p className="text-sm font-medium text-red-600">{selectedIssue.quantity || "0"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <div className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusClasses(selectedIssue.status)}`}>
                      {getStatusIcon(selectedIssue.status)}
                      <span>{selectedIssue.status || "Draft"}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Issue Date</Label>
                    <p className="text-sm font-medium">
                      {selectedIssue.issueDate ? formatDate(selectedIssue.issueDate) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Issued To</Label>
                    <p className="text-sm font-medium">{selectedIssue.issuedTo || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Purpose</Label>
                    <p className="text-sm font-medium">{selectedIssue.reason || "N/A"}</p>
                  </div>
                </div>
              </div>
              {selectedIssue.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Notes</Label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                    {selectedIssue.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit form component
function EditStockIssueForm({ issue, items, onClose, onSuccess }: { issue: any, items: any[], onClose: () => void, onSuccess: () => void }) {
  const { toast } = useToast();
  const form = useForm<StockIssueForm>({
    resolver: zodResolver(stockIssueSchema),
    defaultValues: {
      issueNumber: issue.issueNumber || "",
      itemId: issue.itemId || "",
      quantityIssued: issue.quantity || 0,
      issuedTo: issue.issuedTo || "",
      issueDate: issue.issueDate ? issue.issueDate.split("T")[0] : "",
      purpose: issue.reason || "",
      departmentId: issue.departmentId || "",
      notes: issue.notes || "",
      status: issue.status || "Draft",
    },
  });

  const queryClient = useQueryClient();
  // Use the main updateIssueMutation from props
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: StockIssueForm) => {
      // Always send ISO string or null for backend
      const validDate = toBackendTimestamp(data.issueDate);
      const updateData = {
        issueNumber: data.issueNumber,
        itemId: data.itemId,
        issuedTo: data.issuedTo,
        quantity: Number(data.quantityIssued),
        issueDate: validDate,
        reason: data.purpose,
        notes: data.notes,
        status: data.status,
      };
      return await apiRequest("PUT", `/api/stock-issues/${issue.id}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-issues"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update stock issue", variant: "destructive" });
    },
  });

  const onSubmit = (data: StockIssueForm) => {
  mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="issueNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter issue number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="itemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {items.map((item: any) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.description || item.name || item.itemCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Issued">Issued</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantityIssued"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity to Issue</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter quantity"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="issuedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issued To</FormLabel>
                <FormControl>
                  <Input placeholder="Enter person/department" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Internal Use">Internal Use</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Testing">Testing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter any additional notes..."
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Issue"}
          </Button>
        </div>
      </form>
    </Form>
  );
}