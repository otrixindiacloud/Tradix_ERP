import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { formatDate, format } from "date-fns";
import { 
  Plus, 
  Filter, 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CalendarIcon,
  FileDown,
  ChevronDown,
  Calculator,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusPill from "@/components/status/status-pill";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import DataTable from "@/components/tables/data-table";
import { useToast } from "@/hooks/use-toast";

interface Quotation {
  id: string;
  quoteNumber: string;
  revision: number;
  customerId: string;
  customerType: "Retail" | "Wholesale";
  status: "Draft" | "Sent" | "Approved" | "Rejected" | "Expired" | "Accepted";
  quoteDate: string;
  validUntil: string;
  subtotal: string;
  discountPercentage: string;
  discountAmount: string;
  taxAmount: string;
  totalAmount: string;
  terms: string;
  notes: string;
  approvalStatus: string;
  requiredApprovalLevel: string;
  createdAt: string;
}

import { useAuth } from "@/components/auth/auth-context";

export default function QuotationsPage() {
  const [, navigate] = useLocation();
  // Get current user from auth context
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [filters, setFilters] = useState({
    status: "",
    customerType: "",
    search: "",
    dateFrom: "",
    dateTo: "",
  });
  
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [deletingQuotation, setDeletingQuotation] = useState<Quotation | null>(null);
  const [viewQuotation, setViewQuotation] = useState<Quotation | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Helper function to invalidate all quotation-related queries
  const invalidateAllQuotationQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/quotations"] });
    queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
    // Also invalidate any specific quotation queries
    queryClient.invalidateQueries({ 
      predicate: (query) => {
        return query.queryKey[0] === "/api/quotations";
      }
    });
  };

  const { data: quotations = [], isLoading, error } = useQuery({
    queryKey: ["/api/quotations", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "") {
          params.append(key, value);
        }
      });
      
      const response = await fetch(`/api/quotations?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch quotations: ${response.statusText}`);
      }
      return response.json();
    },
    // Add stale time to ensure fresh data
    staleTime: 0,
    // Add refetch on window focus to catch new quotations
    refetchOnWindowFocus: true,
  });

  // Fetch customers data
  const { data: customersData = { customers: [] } } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      return response.json();
    },
  });

  const customers = customersData.customers || [];

  // Merge quotations with customer names
  const enrichedQuotations = quotations.map((quotation: Quotation) => {
    const customer = customers.find((c: any) => c.id === quotation.customerId);
    return {
      ...quotation,
      customerName: customer?.name || 'Unknown Customer'
    };
  });

  // Delete quotation mutation
  const deleteQuotation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/quotations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete quotation");
    },
    onSuccess: () => {
      invalidateAllQuotationQueries();
      toast({
        title: "Success",
        description: "Quotation deleted successfully",
      });
      setDeletingQuotation(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete quotation",
        variant: "destructive",
      });
    },
  });

  // Approve quotation mutation
  const approveQuotation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/quotations/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to approve quotation");
      return response.json();
    },
    onSuccess: () => {
      invalidateAllQuotationQueries();
      toast({
        title: "Success",
        description: "Quotation approved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve quotation",
        variant: "destructive",
      });
    },
  });

  // Update quotation status mutation
  const updateQuotationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/quotations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update quotation status");
      return response.json();
    },
    onSuccess: () => {
      invalidateAllQuotationQueries();
      toast({
        title: "Success",
        description: "Quotation status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update quotation status",
        variant: "destructive",
      });
    },
  });

  // Handle edit quotation
  const handleEdit = (quotation: Quotation) => {
    setEditingQuotation(quotation);
    setShowEditDialog(true);
  };

  // Handle delete quotation
  const handleDelete = (quotation: Quotation) => {
    setDeletingQuotation(quotation);
  };

  // Handle download PDF
  const handleDownload = (quotation: Quotation) => {
    // Navigate to quotation detail which has PDF download functionality
    navigate(`/quotations/${quotation.id}`);
    // The PDF download will be triggered from the detail page
  };

  // Handle date range change
  const handleDateRangeChange = (from: Date | undefined, to: Date | undefined) => {
    setDateRange({ from, to });
    setFilters(prev => ({
      ...prev,
      dateFrom: from ? format(from, "yyyy-MM-dd") : "",
      dateTo: to ? format(to, "yyyy-MM-dd") : ""
    }));
  };

  // Export quotations function
  const exportQuotations = (format: 'csv' | 'excel') => {
    if (!enrichedQuotations || enrichedQuotations.length === 0) {
      toast({
        title: "No Data",
        description: "No quotations to export",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare data for export
      const exportData = enrichedQuotations.map((quotation: any) => ({
        'Quote Number': quotation.quoteNumber || '',
        'Revision': quotation.revision || 1,
        'Customer Name': quotation.customerName || '',
        'Customer Type': quotation.customerType || '',
        'Status': quotation.status || '',
        'Approval Status': quotation.approvalStatus || '',
        'Required Approval Level': quotation.requiredApprovalLevel || '',
        'Quote Date': quotation.quoteDate ? formatDate(new Date(quotation.quoteDate), "yyyy-MM-dd") : '',
        'Valid Until': quotation.validUntil ? formatDate(new Date(quotation.validUntil), "yyyy-MM-dd") : '',
        'Subtotal': parseFloat(quotation.subtotal || '0'),
        'Discount Percentage': parseFloat(quotation.discountPercentage || '0'),
        'Discount Amount': parseFloat(quotation.discountAmount || '0'),
        'Tax Amount': parseFloat(quotation.taxAmount || '0'),
        'Total Amount': parseFloat(quotation.totalAmount || '0'),
        'Terms': quotation.terms || '',
        'Notes': quotation.notes || '',
        'Created At': quotation.createdAt ? formatDate(new Date(quotation.createdAt), "yyyy-MM-dd") : ''
      }));

      if (format === 'csv') {
        // Convert to CSV
        const headers = Object.keys(exportData[0]);
        const csvContent = [
          headers.join(','),
          ...exportData.map((row: any) => 
            headers.map(header => {
              const value = row[header as keyof typeof row];
              // Escape commas and quotes in CSV
              if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            }).join(',')
          )
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quotations-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else if (format === 'excel') {
        // For Excel, we'll create a simple CSV that Excel can open
        // In a real application, you might want to use a library like xlsx
        const headers = Object.keys(exportData[0]);
        const csvContent = [
          headers.join('\t'),
          ...exportData.map((row: any) => 
            headers.map(header => {
              const value = row[header as keyof typeof row];
              return value;
            }).join('\t')
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quotations-export-${new Date().toISOString().split('T')[0]}.xls`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      toast({
        title: "Success",
        description: `Quotations exported as ${format.toUpperCase()} successfully`,
      });
    } catch (error) {
      console.error("Error exporting quotations:", error);
      toast({
        title: "Error",
        description: "Failed to export quotations",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft": return <Clock className="h-4 w-4" />;
      case "Sent": return <FileText className="h-4 w-4" />;
      case "Approved": return <CheckCircle className="h-4 w-4" />;
      case "Rejected": return <XCircle className="h-4 w-4" />;
      case "Expired": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "text-gray-700";
      case "Sent": return "text-gray-700";
      case "Accepted": return "text-green-700";
      case "Rejected": return "text-red-700";
      
      case "Expired": return "text-orange-700";
      default: return "text-gray-700";
    }
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "text-green-700";
      case "Pending": return "text-orange-600";
      case "Rejected": return "text-red-700";
      default: return "text-gray-700";
    }
  };

  // Helper functions for badge styling similar to customer management
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

  const getApprovalBadgeClass = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'pending':
      case 'not required':
        return "border-orange-500 text-orange-600 hover:bg-orange-50";
      case 'approved':
        return "bg-green-50 text-green-700 border-green-200";
      case 'rejected':
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const columns = [
    {
      key: "quoteNumber",
      header: "Quote Number",
      render: (value: string, quotation: Quotation) => (
        <div className="flex items-center gap-2">
          <Link href={`/quotations/${quotation.id}`} className="font-medium text-gray-600 hover:text-gray-800">
            {value}
          </Link>
          {quotation.revision > 1 && (
            <Badge variant="outline" className="text-xs">
              Rev {quotation.revision}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      render: (value: string, quotation: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{quotation.customerType}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value: string) => (
        <Badge 
          variant="outline"
          className={getStatusBadgeClass(value)}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "approvalStatus",
      header: "Approval",
      render: (value: string, quotation: Quotation) => (
        <div>
          <Badge 
            variant="outline"
            className={getApprovalBadgeClass(value)}
          >
            {value}
          </Badge>
          {quotation.requiredApprovalLevel && (
            <div className="text-xs text-gray-500 mt-1">
              Req: {quotation.requiredApprovalLevel}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Total",
      className: "text-right",
      render: (value: string, quotation: Quotation) => (
        <div className="text-right">
          <div className="font-medium">${parseFloat(value).toLocaleString()}</div>
          {parseFloat(quotation.discountPercentage) > 0 && (
            <div className="text-xs text-green-600">
              -{quotation.discountPercentage}% discount
            </div>
          )}
        </div>
      ),
    },
    {
      key: "validUntil",
      header: "Valid Until",
      className: "text-right",
      render: (value: string) => {
        const date = new Date(value);
        const isExpired = date < new Date();
        return (
          <div className={`text-right ${isExpired ? 'text-red-600' : ''}`}>
            {formatDate(date, "MMM dd, yyyy")}
            {isExpired && (
              <div className="text-xs text-red-500">Expired</div>
            )}
          </div>
        );
      },
    },
    {
      key: "createdAt",
      header: "Created",
      className: "text-right",
      render: (value: string) => formatDate(new Date(value), "MMM dd, yyyy"),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-center",
      render: (_: any, quotation: Quotation) => (
        <div className="flex gap-1">
          {/* Only show Approve button for client user, hide other actions */}
          {user?.username === "client" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                approveQuotation.mutate(quotation.id);
              }}
              disabled={approveQuotation.isPending}
              data-testid={`button-approve-${quotation.id}`}
            >
              <CheckCircle className="h-4 w-4 text-green-600" /> 
              {approveQuotation.isPending ? "Approving..." : "Approve"}
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewQuotation(quotation);
                  setShowViewDialog(true);
                }}
                data-testid={`button-view-${quotation.id}`}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(quotation);
                }}
                data-testid={`button-edit-${quotation.id}`}
              >
                <Edit className="h-4 w-4 text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(quotation);
                }}
                data-testid={`button-download-${quotation.id}`}
              >
                <Download className="h-4 w-4 text-black" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(quotation);
                }}
                data-testid={`button-delete-${quotation.id}`}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  // Pagination logic
  const totalPages = Math.ceil(enrichedQuotations.length / pageSize);
  const paginatedQuotations = enrichedQuotations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Card-style header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Quotations
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Step 2: Manage quotations, pricing, and approvals
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="font-medium">Live Pricing</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Quotes: {Array.isArray(quotations) ? quotations.length : 0}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/quotations/new">
              <Button className="font-semibold px-6 py-2 flex items-center gap-2" data-testid="button-new-quotation">
                <Plus className="h-4 w-4" />
                New Quotation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters Section with Show/Hide Button inside Card */}
      <Card className="mb-6 p-6 rounded-xl shadow-sm border border-gray-100 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Filters</h3>
          <button
            className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full border-gray-100 font-medium text-xs"
            onClick={() => setShowFilter((prev) => !prev)}
            aria-label={showFilter ? "Hide Filters" : "Show Filters"}
            type="button"
          >
            <Filter className="h-4 w-4 border-gray-100" />
            {showFilter ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        {showFilter && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search quotes..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-md shadow-none"
                data-testid="input-search"
              />
            </div>
            <div>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
          </div>
        )}
      </Card>

      {/* Quotations Table (Card Layout) */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Quotations</CardTitle>
            <CardDescription>
              Showing {paginatedQuotations.length} of {enrichedQuotations.length} quotations
              {dateRange.from && dateRange.to && (
                <span className="block mt-1 text-blue-600">
                  Date Range: {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                </span>
              )}
            </CardDescription>
          </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    invalidateAllQuotationQueries();
                    toast({
                      title: "Refreshed",
                      description: "Quotations data refreshed successfully",
                    });
                  }}
                  data-testid="button-refresh"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" data-testid="button-export-table">
                      <FileDown className="h-4 w-4 mr-2" />
                      Export
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => exportQuotations('csv')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportQuotations('excel')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export as Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error loading quotations: {error?.message || 'Unknown error'}</p>
              <Button 
                onClick={() => {
                  invalidateAllQuotationQueries();
                }}
                data-testid="button-retry"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : (
            <>
              <DataTable
                data={paginatedQuotations || []}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="No quotations found. Create your first quotation to get started."
                onRowClick={(quotation: any) => {
                  navigate(`/quotations/${quotation.id}`);
                }}
              />
              {quotations.length > pageSize && (
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
                  <span className="mx-2 text-sm">Page {currentPage} of {totalPages}</span>
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Quotation Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Quotation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Currently, quotation editing is done through the detail page. 
              You will be redirected to the quotation detail page where you can make changes.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setShowEditDialog(false);
                  if (editingQuotation) {
                    navigate(`/quotations/${editingQuotation.id}`);
                  }
                }}
              >
                Go to Detail Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Quotation Quick Detail Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Quotation Details</DialogTitle>
          </DialogHeader>
          {viewQuotation ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Quote Number</div>
                  <div className="font-medium">{viewQuotation.quoteNumber}</div>
                </div>
                <div>
                  <div className="text-gray-500">Revision</div>
                  <div className="font-medium">{viewQuotation.revision}</div>
                </div>
                <div>
                  <div className="text-gray-500">Status</div>
                  <Badge variant="outline" className={getStatusBadgeClass(viewQuotation.status)}>{viewQuotation.status}</Badge>
                </div>
                <div>
                  <div className="text-gray-500">Approval</div>
                  <Badge variant="outline" className={getApprovalBadgeClass(viewQuotation.approvalStatus)}>{viewQuotation.approvalStatus || 'N/A'}</Badge>
                </div>
                <div>
                  <div className="text-gray-500">Customer Type</div>
                  <div className="font-medium">{viewQuotation.customerType}</div>
                </div>
                <div>
                  <div className="text-gray-500">Total</div>
                  <div className="font-semibold">${parseFloat(viewQuotation.totalAmount || '0').toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Quote Date</div>
                  <div>{formatDate(new Date(viewQuotation.quoteDate), 'MMM dd, yyyy')}</div>
                </div>
                <div>
                  <div className="text-gray-500">Valid Until</div>
                  <div>{formatDate(new Date(viewQuotation.validUntil), 'MMM dd, yyyy')}</div>
                </div>
                <div>
                  <div className="text-gray-500">Created At</div>
                  <div>{formatDate(new Date(viewQuotation.createdAt), 'MMM dd, yyyy')}</div>
                </div>
              </div>
              {viewQuotation.notes && (
                <div>
                  <div className="text-gray-500 text-sm mb-1">Notes</div>
                  <div className="bg-gray-50 rounded-md p-3 text-sm whitespace-pre-wrap max-h-48 overflow-auto">
                    {viewQuotation.notes}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => navigate(`/quotations/${viewQuotation.id}`)}>Open Full Page</Button>
                <Button onClick={() => setShowViewDialog(false)}>Close</Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No quotation selected.</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingQuotation} onOpenChange={() => setDeletingQuotation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quotation
              "{deletingQuotation?.quoteNumber}" and all associated data including items and history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingQuotation && deleteQuotation.mutate(deletingQuotation.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteQuotation.isPending}
            >
              {deleteQuotation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}