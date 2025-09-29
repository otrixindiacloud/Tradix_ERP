import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, FileText, Send, DollarSign, Clock, CheckCircle, Download, Edit, Plane, AlertTriangle, FileDown, ChevronDown, Receipt } from "lucide-react";
import DataTable, { Column } from "@/components/tables/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDate, formatCurrency, formatCurrencyCompact, getStatusColor } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Invoicing() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Email invoice mutation
  const emailInvoice = useMutation({
    mutationFn: async ({ id, email }: { id: string; email?: string }) => {
      const response = await apiRequest("POST", `/api/invoices/${id}/send`, { email });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({ title: "Sent", description: "Invoice email dispatched (status set to Sent)." });
    },
    onError: (err: any) => {
      console.error("Send invoice error", err);
      toast({ title: "Error", description: "Failed to send invoice", variant: "destructive" });
    },
  });

  const { data: invoices, isLoading, error: invoicesError } = useQuery({
    queryKey: ["/api/invoices"],
    queryFn: async () => {
      const response = await fetch("/api/invoices");
      if (!response.ok) {
        throw new Error(`Failed to fetch invoices: ${response.statusText}`);
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

  // Fetch customers data to get customer names
  const { data: customersData = { customers: [] } } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");
      if (!response.ok) throw new Error("Failed to fetch customers");
      return response.json();
    },
  });

  const customers = customersData.customers || [];

  // Dialog state
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [deliverySearch, setDeliverySearch] = useState("");
  const [invoiceType, setInvoiceType] = useState("Standard");
  // Quick Proforma dialog state
  const [showQuickProformaDialog, setShowQuickProformaDialog] = useState(false);
  const [quickProformaSearch, setQuickProformaSearch] = useState("");
  const [selectedDraftInvoiceId, setSelectedDraftInvoiceId] = useState<string | null>(null);

  const createInvoice = useMutation({
    mutationFn: async ({ deliveryId, invoiceType }: { deliveryId: string; invoiceType: string }) => {
      // Use dedicated generation endpoint for consistency with backend route
      const response = await apiRequest("POST", "/api/invoices/generate-from-delivery", { deliveryId, invoiceType });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: "Success",
        description: "Invoice generated successfully",
      });
      setSelectedDelivery(null);
      setShowGenerateDialog(false);
    },
    onError: (err: any) => {
      console.error("Generate invoice error", err);
      toast({
        title: "Error",
        description: "Failed to generate invoice",
        variant: "destructive",
      });
    },
  });

  const updateInvoiceStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/invoices/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: "Success",
        description: "Invoice status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      });
    },
  });

  const generateProformaInvoice = useMutation({
    mutationFn: async ({ salesOrderId, invoiceType }: { salesOrderId: string; invoiceType: string }) => {
      // Always send both salesOrderId and invoiceType for backend compatibility
      const response = await apiRequest("POST", "/api/invoices/generate-proforma", { salesOrderId, invoiceType });
      let data: any = null;
      try {
        data = await response.json();
      } catch (e) {
        // Likely received HTML (SyntaxError). Convert to structured error.
        throw new Error('Server returned non-JSON response while generating proforma. Check server logs.');
      }
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to generate proforma invoice');
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: "Success",
        description: "Proforma invoice generated successfully",
      });
    },
    onError: (err: any) => {
      console.error('Proforma generation failed', err);
      toast({
        title: "Error",
        description: "Failed to generate proforma invoice",
        variant: "destructive",
      });
    },
  });
  // Remove alternate mutation, use only main mutation for proforma

  const downloadInvoicePDF = async (invoiceId: string, invoiceNumber: string, invoiceType: string = 'Standard') => {
    try {
      // Show loading state
      const isProforma = invoiceType === 'Proforma';
      toast({
        title: "Generating PDF",
        description: `Creating comprehensive ${isProforma ? 'proforma' : ''} invoice with material specifications...`,
      });

      // Pass invoiceType as query param for backend compatibility
      const response = await fetch(`/api/invoices/${invoiceId}/pdf?invoiceType=${encodeURIComponent(invoiceType)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate PDF' }));
        throw new Error(errorData.message || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filePrefix = isProforma ? 'Golden-Tag-Proforma' : 'Golden-Tag-Invoice';
      a.download = `${filePrefix}-${invoiceNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      toast({
        title: "Success",
        description: `Comprehensive ${isProforma ? 'proforma' : ''} invoice PDF downloaded successfully with all material specifications and company details`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const handleGenerateQuickProforma = () => {
    if (!selectedDraftInvoiceId) {
      toast({ title: 'Select Invoice', description: 'Please select a draft invoice first.', variant: 'destructive' });
      return;
    }
    const invoice = (enrichedInvoices || []).find((inv: any) => inv.id === selectedDraftInvoiceId);
    if (!invoice || !invoice.salesOrderId) {
      toast({ title: 'Invalid Selection', description: 'Selected invoice missing linked Sales Order.', variant: 'destructive' });
      return;
    }
    generateProformaInvoice.mutate(
      { salesOrderId: invoice.salesOrderId, invoiceType: 'Proforma' },
      {
        onSuccess: (data: any) => {
          // Attempt auto-download of generated proforma if backend returns new invoice id/number
            // Expect data to include invoice or id; fallback to refetch result later
            const newInvoiceId = data?.invoice?.id || data?.id;
            const newInvoiceNumber = data?.invoice?.invoiceNumber || data?.invoiceNumber || 'PROFORMA';
            if (newInvoiceId) {
              // Delay a moment to ensure backend persistence
              setTimeout(() => {
                downloadInvoicePDF(newInvoiceId, newInvoiceNumber, 'Proforma');
              }, 600);
            }
          setShowQuickProformaDialog(false);
          setSelectedDraftInvoiceId(null);
        },
      }
    );
  };

  const exportInvoices = (format: 'csv' | 'excel') => {
    if (!filteredInvoices || filteredInvoices.length === 0) {
      toast({
        title: "No Data",
        description: "No invoices to export",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare data for export
      const exportData = filteredInvoices.map((invoice: any) => ({
        'Invoice Number': invoice.invoiceNumber || '',
        'Customer Name': invoice.customer?.name || '',
        'Customer Type': invoice.customer?.customerType || '',
        'Sales Order': invoice.salesOrder?.orderNumber || '',
        'Status': invoice.status || '',
        'Invoice Amount': invoice.totalAmount || 0,
        'Paid Amount': invoice.paidAmount || 0,
        'Due Date': invoice.dueDate ? formatDate(invoice.dueDate) : '',
        'Invoice Date': invoice.invoiceDate ? formatDate(invoice.invoiceDate) : '',
        'Subtotal': invoice.subtotal || 0,
        'Tax Amount': invoice.taxAmount || 0,
        'Notes': invoice.notes || ''
      }));

      if (format === 'csv') {
        // Convert to CSV
        const headers = Object.keys(exportData[0]);
        const csvContent = [
          headers.join(','),
          ...exportData.map((row: Record<string, unknown>) =>
            headers.map(header => {
              const value = row[header];
              // Escape commas, quotes, and newlines in CSV
              if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
              }
              return value ?? "";
            }).join(',')
          )
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoices-export-${new Date().toISOString().split('T')[0]}.csv`;
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
          ...exportData.map((row: Record<string, unknown>) =>
            headers.map(header => {
              const value = row[header];
              // For Excel, tab-separated values are preferred
              if (typeof value === 'string' && (value.includes('\t') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
              }
              return value ?? "";
            }).join('\t')
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoices-export-${new Date().toISOString().split('T')[0]}.xls`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      toast({
        title: "Success",
        description: `Invoices exported as ${format.toUpperCase()} successfully`,
      });
    } catch (error) {
      console.error("Error exporting invoices:", error);
      toast({
        title: "Error",
        description: "Failed to export invoices",
        variant: "destructive",
      });
    }
  };

  // Filter for completed deliveries ready for invoicing
  const enrichedDeliveries = deliveries?.map((delivery: any) => {
    if (delivery.salesOrder?.customerId) {
      const customer = customers.find((c: any) => c.id === delivery.salesOrder.customerId);
      return {
        ...delivery,
        salesOrder: {
          ...delivery.salesOrder,
          customer: customer ? {
            ...customer,
            name: customer.name || 'Unknown Customer'
          } : delivery.salesOrder.customer || { name: 'Unknown Customer', customerType: '-' }
        }
      };
    }
    return delivery;
  });

  const completedDeliveries = enrichedDeliveries?.filter((delivery: any) => 
    delivery.status === "Complete" && !invoices?.some((inv: any) => inv.salesOrderId === delivery.salesOrderId)
  );

  // Enrich invoices with customer names from customers API
  const enrichedInvoices = invoices?.map((invoice: any) => {
    const customer = customers.find((c: any) => c.id === invoice.customerId);
    return {
      ...invoice,
      customer: customer ? {
        ...customer,
        name: customer.name || 'Unknown Customer'
      } : invoice.customer || { name: 'Unknown Customer', customerType: '-' }
    };
  });

  // Draft invoices eligible for quick proforma generation (must have linked Sales Order)
  const draftInvoicesWithSO = (enrichedInvoices || []).filter((inv: any) => inv.status === 'Draft' && inv.salesOrderId);

  const filteredInvoices = enrichedInvoices?.filter((invoice: any) => {
    const matchesSearch = invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];
  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / pageSize);
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<any>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice ID",
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600 font-medium">{value}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (customer: any) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {customer?.name || "Unknown Customer"}
          </p>
          <p className="text-xs text-gray-600">
            {customer?.customerType || "-"}
          </p>
        </div>
      ),
    },
    {
      key: "salesOrderNumber",
      header: "Sales Order",
      render: (_, invoice: any) => (
        <span className="font-mono text-sm text-gray-600">
          {invoice.salesOrder?.orderNumber || "N/A"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
        render: (value: string) => (
          value === "Draft"
            ? <Badge variant="outline" className="border-gray-400 text-gray-600 bg-gray-50">{value}</Badge>
            : <Badge variant="outline" className={getStatusColor(value)}>{value}</Badge>
        ),
    },
    {
      key: "totalAmount",
      header: "Invoice Amount",
      render: (value: number) => value ? formatCurrency(value) : "-",
      className: "text-right",
    },
    {
      key: "paidAmount",
      header: "Paid Amount",
      render: (value: number) => value ? formatCurrency(value) : formatCurrency(0),
      className: "text-right",
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (value: string) => {
        if (!value) return "-";
        const isOverdue = new Date(value) < new Date();
        return (
          <div className={isOverdue ? "text-red-600 font-medium" : ""}>
            {formatDate(value)}
            {isOverdue && <span className="ml-1 text-xs">(Overdue)</span>}
          </div>
        );
      },
    },
    {
      key: "invoiceDate",
      header: "Invoice Date",
      render: (value: string) => formatDate(value),
    },
    {
      key: "invoiceType",
      header: "Type",
      render: (value: string) => (
        <Badge 
          variant="outline" 
          className={
            value === "Proforma" 
              ? "bg-purple-100 text-purple-800 border-purple-300" 
              : "bg-blue-100 text-blue-800 border-blue-300"
          }
        >
          {value || "Standard"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, invoice: any) => (
        <div className="flex items-center space-x-2">
          {invoice.status === "Draft" && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                updateInvoiceStatus.mutate({ id: invoice.id, status: "Sent" });
              }}
              data-testid={`button-send-${invoice.id}`}
            >
              <Send className="h-4 w-4 mr-1" />
              Send
            </Button>
          )}
          {invoice.status === "Sent" && (
            <Button
              size="sm"
              variant="success"
              onClick={(e) => {
                e.stopPropagation();
                updateInvoiceStatus.mutate({ id: invoice.id, status: "Paid" });
              }}
              data-testid={`button-mark-paid-${invoice.id}`}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark Paid
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              downloadInvoicePDF(invoice.id, invoice.invoiceNumber, invoice.invoiceType);
            }}
            data-testid={`button-download-${invoice.id}`}
            title={`Download ${invoice.invoiceType === 'Proforma' ? 'Proforma' : 'Standard'} Invoice PDF with Material Specs`}
            className="text-black hover:text-black hover:bg-gray-50"
          >
            <Download className="h-4 w-4 text-black" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              const email = invoice.customer?.email;
              emailInvoice.mutate({ id: invoice.id, email });
            }}
            data-testid={`button-email-${invoice.id}`}
            title="Email Invoice to Customer"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedInvoice(invoice);
            }}
            data-testid={`button-view-${invoice.id}`}
            title="View Details"
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const invoiceStats = {
    draft: invoices?.filter((inv: any) => inv.status === "Draft").length || 0,
    sent: invoices?.filter((inv: any) => inv.status === "Sent").length || 0,
    paid: invoices?.filter((inv: any) => inv.status === "Paid").length || 0,
    overdue: invoices?.filter((inv: any) => {
      return inv.status === "Sent" && inv.dueDate && new Date(inv.dueDate) < new Date();
    }).length || 0,
    totalRevenue: invoices?.filter((inv: any) => inv.status === "Paid")
      .reduce((sum: number, inv: any) => {
        const amt = Number(inv.totalAmount);
        return sum + (isNaN(amt) ? 0 : amt);
      }, 0) || 0,
  };

  // Ref for scrolling to deliveries section
  const deliveriesSectionRef = useState<any>(null);

  const handleReadyForInvoiceClick = () => {
    if (deliveriesSectionRef[0] && deliveriesSectionRef[0].scrollIntoView) {
      deliveriesSectionRef[0].scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Page Header - Card Style */}
      <div className="mb-6">
        <Card className="rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <Receipt className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent" data-testid="text-page-title">
                    Invoicing
                  </h2>
                </div>
                <p className="text-muted-foreground text-lg">
                  Step 10: Generate and manage customer invoices with multi-currency support
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="font-medium">Invoice Generation</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Invoices: {Array.isArray(invoices) ? invoices.length : 0}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowGenerateDialog(true)}
                data-testid="button-open-generate-invoice"
                className="flex items-center gap-2 "
              >
                <Plus className="h-4 w-4" /> 
                Generate Invoice
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowQuickProformaDialog(true);
                }}
                disabled={generateProformaInvoice.isPending}
                data-testid="button-generate-proforma-quick"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                {generateProformaInvoice.isPending ? "Generating..." : "Quick Proforma"}
              </Button>
              <Button
                variant="success"
                className="flex items-center px-4 py-2 gap-2"
                data-testid="badge-ready-for-invoice"
                onClick={handleReadyForInvoiceClick}
                style={{ cursor: "pointer" }}
              >
                <DollarSign className="h-4 w-4" />
                {completedDeliveries?.length || 0} Ready for Invoice
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions for Completed Deliveries */}
      {completedDeliveries && completedDeliveries.length > 0 && (
        <Card className="mb-6" ref={el => deliveriesSectionRef[1](el)}>
          <CardHeader>
            <CardTitle>Deliveries Ready for Invoicing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedDeliveries.slice(0, 3).map((delivery: any) => (
                <div key={delivery.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {delivery.salesOrder?.orderNumber} - {delivery.salesOrder?.customer?.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Delivery: {delivery.deliveryNumber} | Value: {formatCurrency(delivery.salesOrder?.totalAmount)}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => createInvoice.mutate({ deliveryId: delivery.id, invoiceType })}
                    disabled={createInvoice.isPending}
                    data-testid={`button-create-invoice-${delivery.id}`}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {createInvoice.isPending ? "Generating..." : "Create Invoice"}
                  </Button>
                </div>
              ))}
              {completedDeliveries.length > 3 && (
                <p className="text-sm text-gray-600 text-center">
                  +{completedDeliveries.length - 3} more deliveries ready for invoicing
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mt-1">
                <Edit className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-bold">Draft Invoices</p>
                <p className="text-2xl font-bold text-gray-600" data-testid="stat-draft-invoices">
                  {invoiceStats.draft}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                <Plane className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-bold">Sent Invoices</p>
                <p className="text-2xl font-bold text-blue-600" data-testid="stat-sent-invoices">
                  {invoiceStats.sent}
                </p>
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
                <p className="text-sm text-gray-600 font-bold">Paid Invoices</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-paid-invoices">
                  {invoiceStats.paid}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mt-1">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-bold">Overdue</p>
                <p className="text-2xl font-bold text-red-600" data-testid="stat-overdue-invoices">
                  {invoiceStats.overdue}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-bold">Total Revenue</p>
                <p
                  className="text-2xl font-bold text-green-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px] md:max-w-[140px] lg:max-w-[180px]"
                  data-testid="stat-total-revenue"
                  title={formatCurrency(invoiceStats.totalRevenue)}
                >
                  {formatCurrencyCompact(invoiceStats.totalRevenue).short}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  From paid invoices
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Invoices</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-md shadow-none"
                  data-testid="input-search-invoices"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" data-testid="button-filter">
                <Filter className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" data-testid="button-export">
                    <FileDown className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportInvoices('csv')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportInvoices('excel')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <DataTable
              data={paginatedInvoices}
              columns={columns}
              isLoading={isLoading}
              emptyMessage="No invoices found. Invoices are created from completed deliveries."
              onRowClick={(invoice) => {
                setSelectedInvoice(invoice);
              }}
            />
            {/* Pagination Controls */}
            {filteredInvoices.length > pageSize && (
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

      {/* Invoice Details Dialog - Enhanced with Material Information */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Invoice Details - {selectedInvoice?.invoiceNumber}</span>
              <Badge variant="outline" className={getStatusColor(selectedInvoice?.status || '')}>
                {selectedInvoice?.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Invoice Header Information */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Invoice Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number:</span>
                      <span className="font-mono font-medium">{selectedInvoice.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedInvoice.invoiceType || 'Final'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Currency:</span>
                      <span className="font-medium">{selectedInvoice.currency || 'BHD'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>{formatDate(selectedInvoice.invoiceDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span>{selectedInvoice.dueDate ? formatDate(selectedInvoice.dueDate) : "Upon Receipt"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="font-medium">{selectedInvoice.customer?.name}</p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedInvoice.customer?.customerType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Classification:</span>
                      <span className="font-medium">{selectedInvoice.customer?.classification}</span>
                    </div>
                    {selectedInvoice.customer?.email && (
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="text-blue-600">{selectedInvoice.customer.email}</p>
                      </div>
                    )}
                    {selectedInvoice.customer?.phone && (
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p>{selectedInvoice.customer.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-900 mb-3 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Financial Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(selectedInvoice.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">{formatCurrency(selectedInvoice.taxAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-blue-600">{formatCurrency(selectedInvoice.totalAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Paid:</span>
                      <span className="font-medium">{formatCurrency(selectedInvoice.paidAmount || 0)}</span>
                    </div>
                    {(selectedInvoice.totalAmount || 0) > (selectedInvoice.paidAmount || 0) && (
                      <div className="flex justify-between text-red-600 font-medium">
                        <span>Outstanding:</span>
                        <span>{formatCurrency((selectedInvoice.totalAmount || 0) - (selectedInvoice.paidAmount || 0))}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Material Specifications & Items */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Material Specifications & Items
                </h4>
                <div className="text-sm text-gray-600 mb-3">
                  This invoice includes detailed material specifications, supplier codes, barcodes, and comprehensive item information as required for business operations.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded border">
                    <span className="text-xs text-gray-500">Document Features</span>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>✓ Complete company branding</li>
                      <li>✓ Supplier codes & barcodes</li>
                      <li>✓ Material specifications</li>
                      <li>✓ Multi-currency support</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <span className="text-xs text-gray-500">Business Information</span>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>✓ Golden Tag WLL details</li>
                      <li>✓ Banking information</li>
                      <li>✓ Legal registration numbers</li>
                      <li>✓ Terms & conditions</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <span className="text-xs text-gray-500">Customer Requirements</span>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>✓ Detailed item descriptions</li>
                      <li>✓ Quantity & pricing</li>
                      <li>✓ Tax calculations</li>
                      <li>✓ Payment tracking</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {selectedInvoice.paymentTerms && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Payment Terms</h4>
                  <p className="text-sm text-gray-700">{selectedInvoice.paymentTerms}</p>
                </div>
              )}

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-700">{selectedInvoice.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="space-x-2">
                  {selectedInvoice?.salesOrderId && (
                    <Button
                      variant="outline"
                      onClick={() => generateProformaInvoice.mutate({ salesOrderId: selectedInvoice.salesOrderId, invoiceType: 'Proforma' })}
                      disabled={generateProformaInvoice.isPending}
                      data-testid="button-generate-proforma-from-invoice"
                    >
                      {generateProformaInvoice.isPending ? "Generating..." : "Generate Proforma"}
                    </Button>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => downloadInvoicePDF(selectedInvoice.id, selectedInvoice.invoiceNumber)}
                    data-testid="button-download-pdf"
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Comprehensive PDF</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => emailInvoice.mutate({ id: selectedInvoice.id, email: selectedInvoice.customer?.email })}
                    data-testid="button-email-pdf"
                    className="flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Email Invoice</span>
                  </Button>
                  <Button
                    onClick={() => setSelectedInvoice(null)}
                    data-testid="button-close-details"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Generate Invoice Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Generate Invoice from Delivery</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search deliveries..."
                value={deliverySearch}
                onChange={(e) => setDeliverySearch(e.target.value)}
                data-testid="input-search-deliveries"
              />
              <Select value={invoiceType} onValueChange={setInvoiceType}>
                <SelectTrigger className="w-48" data-testid="select-invoice-type">
                  <SelectValue placeholder="Invoice Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Proforma">Proforma</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="max-h-80 overflow-y-auto border rounded-md divide-y" data-testid="list-deliveries-for-invoice">
              {completedDeliveries && completedDeliveries
                .filter((d: any) => {
                  if (!deliverySearch) return true;
                  const term = deliverySearch.toLowerCase();
                  return (
                    d.deliveryNumber?.toLowerCase().includes(term) ||
                    d.salesOrder?.orderNumber?.toLowerCase().includes(term) ||
                    d.salesOrder?.customer?.name?.toLowerCase().includes(term)
                  );
                })
                .map((delivery: any) => (
                  <div key={delivery.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {delivery.deliveryNumber} / {delivery.salesOrder?.orderNumber}
                      </p>
                      <p className="text-xs text-gray-600">
                        {delivery.salesOrder?.customer?.name} · Value {formatCurrency(delivery.salesOrder?.totalAmount)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => createInvoice.mutate({ deliveryId: delivery.id, invoiceType })}
                      disabled={createInvoice.isPending}
                      data-testid={`button-generate-invoice-${delivery.id}`}
                    >
                      {createInvoice.isPending ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                ))}
              {(!completedDeliveries || completedDeliveries.length === 0) && (
                <div className="p-4 text-sm text-gray-500" data-testid="empty-no-deliveries">No deliveries available for invoicing.</div>
              )}
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowGenerateDialog(false)} data-testid="button-close-generate-dialog">Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Proforma Generation Dialog */}
      <Dialog open={showQuickProformaDialog} onOpenChange={setShowQuickProformaDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Quick Proforma Generation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Select a draft invoice (must be linked to a Sales Order) to generate a Proforma PDF instantly.
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search draft invoices..."
                value={quickProformaSearch}
                onChange={(e) => setQuickProformaSearch(e.target.value)}
                data-testid="input-search-quick-proforma"
              />
            </div>
            <div className="max-h-72 overflow-y-auto border rounded-md divide-y" data-testid="list-draft-invoices-quick-proforma">
              {draftInvoicesWithSO
                .filter((inv: any) => {
                  if (!quickProformaSearch) return true;
                  const term = quickProformaSearch.toLowerCase();
                  return (
                    inv.invoiceNumber?.toLowerCase().includes(term) ||
                    inv.salesOrder?.orderNumber?.toLowerCase().includes(term) ||
                    inv.customer?.name?.toLowerCase().includes(term)
                  );
                })
                .map((inv: any) => (
                  <div
                    key={inv.id}
                    className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${selectedDraftInvoiceId === inv.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedDraftInvoiceId(inv.id)}
                    data-testid={`quick-proforma-invoice-${inv.id}`}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <span className="font-mono">{inv.invoiceNumber}</span>
                        <Badge variant="outline" className="bg-gray-100">Draft</Badge>
                      </p>
                      <p className="text-xs text-gray-600">
                        SO: {inv.salesOrder?.orderNumber} · {inv.customer?.name} · Value {formatCurrency(inv.totalAmount || inv.subtotal || 0)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedDraftInvoiceId === inv.id && (
                        <span className="text-xs text-blue-600 font-medium">Selected</span>
                      )}
                    </div>
                  </div>
                ))}
              {draftInvoicesWithSO.length === 0 && (
                <div className="p-4 text-sm text-gray-500" data-testid="empty-no-draft-invoices">No eligible draft invoices found.</div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {draftInvoicesWithSO.length} draft invoice(s) with Sales Orders available
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowQuickProformaDialog(false)}
                  data-testid="button-close-quick-proforma-dialog"
                >
                  Close
                </Button>
                <Button
                  onClick={handleGenerateQuickProforma}
                  disabled={generateProformaInvoice.isPending || !selectedDraftInvoiceId}
                  data-testid="button-generate-quick-proforma-confirm"
                >
                  {generateProformaInvoice.isPending ? 'Generating...' : 'Generate & Download'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
