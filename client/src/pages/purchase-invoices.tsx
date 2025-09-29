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
  Receipt,
  DollarSign,
  Building2,
  CreditCard,
  Calculator
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusPill from "@/components/status/status-pill";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import DataTable from "@/components/tables/data-table";
import { useToast } from "@/hooks/use-toast";

interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplierInvoiceNumber?: string;
  supplierId: string;
  supplierName: string;
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  goodsReceiptId?: string;
  goodsReceiptNumber?: string;
  status: "Draft" | "Pending Approval" | "Approved" | "Paid" | "Partially Paid" | "Overdue" | "Discrepancy" | "Cancelled";
  paymentStatus: "Unpaid" | "Partially Paid" | "Paid" | "Overdue";
  invoiceDate: string;
  dueDate: string;
  receivedDate?: string;
  paymentDate?: string;
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  totalAmount: string;
  paidAmount: string;
  remainingAmount: string;
  currency: "BHD" | "AED" | "EUR" | "GBP";
  paymentTerms: string;
  paymentMethod?: "Bank Transfer" | "Cheque" | "Cash" | "Credit Card" | "Letter of Credit";
  bankReference?: string;
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
  attachments: string[];
  itemCount: number;
  isRecurring: boolean;
  nextInvoiceDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface PurchaseInvoiceItem {
  id: string;
  invoiceId: string;
  itemDescription: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  unitOfMeasure: string;
  taxRate: string;
  discountRate: string;
  goodsReceiptItemId?: string;
}

// Minimal supplier shape for selection
interface Supplier {
  id: string;
  name: string;
}

type NewPurchaseInvoice = {
  supplierId: string;
  supplierInvoiceNumber: string;
  purchaseOrderNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  currency: PurchaseInvoice['currency'];
  notes: string;
};

export default function PurchaseInvoicesPage() {
  const [, navigate] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    supplier: "",
    currency: "",
    search: "",
    dateFrom: "",
    dateTo: "",
  });

  // Add showFilters state for toggling filter visibility
  const [showFilters, setShowFilters] = useState(false);

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });

  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [deletingInvoice, setDeletingInvoice] = useState<PurchaseInvoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<PurchaseInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Bank Transfer" | "Cheque" | "Cash" | "Credit Card" | "Letter of Credit">("Bank Transfer");
  const [paymentReference, setPaymentReference] = useState("");
  const [newInvoice, setNewInvoice] = useState<NewPurchaseInvoice>({
    supplierId: "",
    supplierInvoiceNumber: "",
    purchaseOrderNumber: "",
    invoiceDate: "",
    dueDate: "",
    paymentTerms: "",
    currency: "BHD",
    notes: "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for development - replace with actual API call
  const mockPurchaseInvoices: PurchaseInvoice[] = [
    {
      id: "pi-001",
      invoiceNumber: "PI-2024-001",
      supplierInvoiceNumber: "SUP-INV-001",
      supplierId: "sup-001",
      supplierName: "Tech Solutions LLC",
      purchaseOrderId: "po-001",
      purchaseOrderNumber: "PO-2024-001",
      goodsReceiptId: "gr-001",
      goodsReceiptNumber: "GR-2024-001",
      status: "Approved",
      paymentStatus: "Unpaid",
      invoiceDate: "2024-01-15",
      dueDate: "2024-02-14",
      receivedDate: "2024-01-17",
      subtotal: "5000.00",
      taxAmount: "250.00",
      discountAmount: "100.00",
      totalAmount: "5150.00",
      paidAmount: "0.00",
      remainingAmount: "5150.00",
  currency: "BHD",
      paymentTerms: "Net 30",
      notes: "Hardware procurement invoice",
      attachments: ["invoice.pdf", "delivery_note.pdf"],
      itemCount: 3,
      isRecurring: false,
      createdAt: "2024-01-17T10:00:00Z",
      updatedAt: "2024-01-17T14:30:00Z"
    },
    {
      id: "pi-002",
      invoiceNumber: "PI-2024-002",
      supplierInvoiceNumber: "SUP-INV-002",
      supplierId: "sup-002",
      supplierName: "Office Supplies Co",
      purchaseOrderId: "po-002",
      purchaseOrderNumber: "PO-2024-002",
      status: "Paid",
      paymentStatus: "Paid",
      invoiceDate: "2024-01-12",
      dueDate: "2024-01-27",
      receivedDate: "2024-01-14",
      paymentDate: "2024-01-26",
      subtotal: "2000.00",
      taxAmount: "100.00",
      discountAmount: "50.00",
      totalAmount: "2050.00",
      paidAmount: "2050.00",
      remainingAmount: "0.00",
  currency: "BHD",
      paymentTerms: "Net 15",
      attachments: [],
      paymentMethod: "Bank Transfer",
      bankReference: "TXN-123456789",
      approvedBy: "John Smith",
      approvalDate: "2024-01-15",
      itemCount: 5,
      isRecurring: true,
      nextInvoiceDate: "2024-02-12",
      createdAt: "2024-01-14T09:30:00Z",
      updatedAt: "2024-01-26T16:45:00Z"
    },
    {
      id: "pi-003",
      invoiceNumber: "PI-2024-003",
      supplierId: "sup-003",
      supplierName: "Industrial Equipment Ltd",
      status: "Overdue",
      paymentStatus: "Overdue",
      invoiceDate: "2024-01-05",
      dueDate: "2024-01-20",
      receivedDate: "2024-01-07",
      subtotal: "8500.00",
      taxAmount: "425.00",
      discountAmount: "0.00",
      totalAmount: "8925.00",
      paidAmount: "0.00",
      remainingAmount: "8925.00",
  currency: "BHD",
      paymentTerms: "Net 15",
      attachments: [],
      itemCount: 2,
      isRecurring: false,
      createdAt: "2024-01-07T11:20:00Z",
      updatedAt: "2024-01-07T11:20:00Z"
    }
  ];

  // Suppliers fetched from API
  const { data: suppliers = [], isLoading: suppliersLoading, error: suppliersError } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
    queryFn: async () => {
      const resp = await fetch("/api/suppliers");
      if (!resp.ok) throw new Error("Failed to load suppliers");
      return resp.json();
    }
  });

  const { data: purchaseInvoices = [], isLoading, error } = useQuery<PurchaseInvoice[]>({
    queryKey: ["/api/purchase-invoices", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.paymentStatus) params.set('paymentStatus', filters.paymentStatus);
      if (filters.supplier) params.set('supplier', filters.supplier);
      if (filters.currency) params.set('currency', filters.currency);
      if (filters.search) params.set('search', filters.search);
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.set('dateTo', filters.dateTo);
      const resp = await fetch(`/api/purchase-invoices?${params.toString()}`);
      if (!resp.ok) {
        throw new Error('Failed to load purchase invoices');
      }
      const data = await resp.json();
      return data as PurchaseInvoice[];
    },
  });

  // Create purchase invoice mutation (API based)
  const createPurchaseInvoice = useMutation({
    mutationFn: async (data: NewPurchaseInvoice) => {
      const payload: Record<string, any> = {};
      Object.entries(data).forEach(([k, v]) => { if (v !== "") payload[k] = v; });
      if (payload.invoiceDate) payload.invoiceDate = new Date(payload.invoiceDate);
      if (payload.dueDate) payload.dueDate = new Date(payload.dueDate);
      if (!payload.invoiceNumber) payload.invoiceNumber = `PI-TEMP-${Date.now()}`; // backend may override
      try { console.debug('Create Purchase Invoice Payload', payload); } catch {}
      const resp = await fetch('/api/purchase-invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create purchase invoice');
      }
      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/purchase-invoices'] });
      toast({ title: 'Success', description: 'Purchase invoice created successfully' });
      setShowNewDialog(false);
      setNewInvoice({
        supplierId: '',
        supplierInvoiceNumber: '',
        purchaseOrderNumber: '',
        invoiceDate: '',
        dueDate: '',
        paymentTerms: '',
        currency: 'BHD',
        notes: '',
      });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error?.message || 'Failed to create purchase invoice', variant: 'destructive' });
    }
  });

  // Process payment mutation
  const processPayment = useMutation({
    mutationFn: async (data: { invoiceId: string; amount: string; method: string; reference: string }) => {
      // Mock implementation - replace with actual API call
      const invoice = mockPurchaseInvoices.find(inv => inv.id === data.invoiceId);
      if (invoice) {
        const paidAmount = parseFloat(invoice.paidAmount) + parseFloat(data.amount);
        const totalAmount = parseFloat(invoice.totalAmount);
        
        invoice.paidAmount = paidAmount.toFixed(2);
        invoice.remainingAmount = (totalAmount - paidAmount).toFixed(2);
        invoice.paymentMethod = data.method as any;
        invoice.bankReference = data.reference;
        invoice.updatedAt = new Date().toISOString();
        
        if (paidAmount >= totalAmount) {
          invoice.paymentStatus = "Paid";
          invoice.status = "Paid";
          invoice.paymentDate = new Date().toISOString().split('T')[0];
        } else {
          invoice.paymentStatus = "Partially Paid";
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchase-invoices"] });
      toast({
        title: "Success",
        description: "Payment processed successfully",
      });
      setShowPaymentDialog(false);
      setPaymentInvoice(null);
      setPaymentAmount("");
      setPaymentReference("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    },
  });

  // Delete purchase invoice mutation
  const deletePurchaseInvoice = useMutation({
    mutationFn: async (id: string) => {
      // Mock implementation - replace with actual API call
      const index = mockPurchaseInvoices.findIndex(inv => inv.id === id);
      if (index > -1) {
        mockPurchaseInvoices.splice(index, 1);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchase-invoices"] });
      toast({
        title: "Success",
        description: "Purchase invoice deleted successfully",
      });
      setDeletingInvoice(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete purchase invoice",
        variant: "destructive",
      });
    },
  });

  // Handle delete invoice (disabled in derived view)
  const handleDelete = (invoice: PurchaseInvoice) => {
    toast({
      title: "Read-only",
      description: "Deleting purchase invoices isn't available yet.",
    });
  };

  // Handle payment (disabled in derived view)
  const handlePayment = (invoice: PurchaseInvoice) => {
    toast({
      title: "Not implemented",
      description: "Recording payments for purchase invoices will be available once write APIs are added.",
    });
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

  // Export purchase invoices function
  const exportPurchaseInvoices = (format: 'csv' | 'excel') => {
    if (!purchaseInvoices || purchaseInvoices.length === 0) {
      toast({
        title: "No Data",
        description: "No purchase invoices to export",
        variant: "destructive",
      });
      return;
    }

    try {
      const exportData = purchaseInvoices.map((invoice: PurchaseInvoice) => ({
        'Invoice Number': invoice.invoiceNumber,
        'Supplier Invoice Number': invoice.supplierInvoiceNumber || '',
        'Supplier Name': invoice.supplierName,
        'Purchase Order': invoice.purchaseOrderNumber || '',
        'Goods Receipt': invoice.goodsReceiptNumber || '',
        'Status': invoice.status,
        'Payment Status': invoice.paymentStatus,
        'Invoice Date': invoice.invoiceDate ? formatDate(new Date(invoice.invoiceDate), "yyyy-MM-dd") : '',
        'Due Date': invoice.dueDate ? formatDate(new Date(invoice.dueDate), "yyyy-MM-dd") : '',
        'Received Date': invoice.receivedDate ? formatDate(new Date(invoice.receivedDate), "yyyy-MM-dd") : '',
        'Payment Date': invoice.paymentDate ? formatDate(new Date(invoice.paymentDate), "yyyy-MM-dd") : '',
        'Subtotal': parseFloat(invoice.subtotal || '0'),
        'Tax Amount': parseFloat(invoice.taxAmount || '0'),
        'Discount Amount': parseFloat(invoice.discountAmount || '0'),
        'Total Amount': parseFloat(invoice.totalAmount || '0'),
        'Paid Amount': parseFloat(invoice.paidAmount || '0'),
        'Remaining Amount': parseFloat(invoice.remainingAmount || '0'),
        'Currency': invoice.currency,
        'Payment Terms': invoice.paymentTerms,
        'Payment Method': invoice.paymentMethod || '',
        'Bank Reference': invoice.bankReference || '',
        'Approved By': invoice.approvedBy || '',
        'Approval Date': invoice.approvalDate ? formatDate(new Date(invoice.approvalDate), "yyyy-MM-dd") : '',
        'Item Count': invoice.itemCount,
        'Is Recurring': invoice.isRecurring ? 'Yes' : 'No',
        'Next Invoice Date': invoice.nextInvoiceDate ? formatDate(new Date(invoice.nextInvoiceDate), "yyyy-MM-dd") : '',
        'Notes': invoice.notes || '',
        'Created At': invoice.createdAt ? formatDate(new Date(invoice.createdAt), "yyyy-MM-dd") : ''
      }));

      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(format === 'csv' ? ',' : '\t'),
        ...exportData.map((row: any) => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            if (format === 'csv' && typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(format === 'csv' ? ',' : '\t')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { 
        type: format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/vnd.ms-excel;charset=utf-8;' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `purchase-invoices-export-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xls'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: `Purchase invoices exported as ${format.toUpperCase()} successfully`,
      });
    } catch (error) {
      console.error("Error exporting purchase invoices:", error);
      toast({
        title: "Error",
        description: "Failed to export purchase invoices",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft": return <Clock className="h-4 w-4" />;
      case "Pending Approval": return <AlertTriangle className="h-4 w-4" />;
      case "Approved": return <CheckCircle className="h-4 w-4" />;
      case "Paid": return <CheckCircle className="h-4 w-4" />;
      case "Partially Paid": return <Clock className="h-4 w-4" />;
      case "Overdue": return <XCircle className="h-4 w-4" />;
      case "Discrepancy": return <AlertTriangle className="h-4 w-4" />;
      case "Cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  

  const getPaymentStatusBadgeProps = (status: string) => {
    switch (status) {
      case "Paid": 
        return {
          variant: "outline" as const,
          className: "border-green-500 text-green-600 hover:bg-green-50"
        };
      case "Partially Paid": 
        return {
          variant: "outline" as const,
          className: "border-yellow-500 text-yellow-600 hover:bg-yellow-50"
        };
      case "Unpaid": 
        return {
          variant: "outline" as const,
          className: "border-orange-500 text-orange-600 hover:bg-orange-50"
        };
      case "Overdue": 
        return {
          variant: "outline" as const,
          className: "border-red-500 text-red-600 hover:bg-red-50"
        };
      default: 
        return {
          variant: "outline" as const,
          className: "border-gray-500 text-gray-600 hover:bg-gray-50"
        };
    }
  };

  const columns = [
    {
      key: "invoiceNumber",
      header: "Invoice Number",
      render: (value: string, invoice: PurchaseInvoice) => (
        <div className="flex items-center gap-2">
          <Link href={`/purchase-invoices/${invoice.id}`} className="font-medium text-gray-600 hover:text-gray-800">
            {value}
          </Link>
          {invoice.isRecurring && (
            <Badge variant="outline" className="text-xs">
              Recurring
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "supplierName",
      header: "Supplier",
      render: (value: string, invoice: PurchaseInvoice) => (
        <div>
          <div className="font-medium">{value}</div>
          {invoice.supplierInvoiceNumber && (
            <div className="text-sm text-gray-500">Ref: {invoice.supplierInvoiceNumber}</div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value: string) => (
        <StatusPill status={value.toLowerCase().replace(' ', '-')} />
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment",
      render: (value: string) => {
        const badgeProps = getPaymentStatusBadgeProps(value);
        return (
          <Badge 
            variant={badgeProps.variant}
            className={`${badgeProps.className} flex items-center justify-center gap-2`}
          >
            <span className="font-medium">{value}</span>
          </Badge>
        );
      },
    },
    {
      key: "totalAmount",
      header: "Total Amount",
      className: "text-right",
      render: (value: string, invoice: PurchaseInvoice) => (
        <div className="text-right">
          <div className="font-medium">
            {invoice.currency} {parseFloat(value).toLocaleString()}
          </div>
          {parseFloat(invoice.remainingAmount) > 0 && (
            <div className="text-xs text-red-600">
              Remaining: {invoice.currency} {parseFloat(invoice.remainingAmount).toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      className: "text-right",
      render: (value: string, invoice: PurchaseInvoice) => {
        const date = new Date(value);
        const isOverdue = date < new Date() && invoice.paymentStatus !== "Paid";
        return (
          <div className={`text-right ${isOverdue ? 'text-red-600' : ''}`}>
            {formatDate(date, "MMM dd, yyyy")}
            {isOverdue && (
              <div className="text-xs text-red-500">Overdue</div>
            )}
          </div>
        );
      },
    },
    {
      key: "invoiceDate",
      header: "Invoice Date",
      className: "text-right",
      render: (value: string) => formatDate(new Date(value), "MMM dd, yyyy"),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, invoice: PurchaseInvoice) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/purchase-invoices/${invoice.id}`);
            }}
            data-testid={`button-view-${invoice.id}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(invoice);
            }}
            data-testid={`button-delete-${invoice.id}`}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  // Pagination logic
  const totalPages = Math.ceil(purchaseInvoices.length / pageSize);
  const paginatedInvoices = purchaseInvoices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Calculate totals
  const totalInvoiceAmount = purchaseInvoices.reduce((sum: number, inv: PurchaseInvoice) => sum + parseFloat(inv.totalAmount), 0);
  const totalPaidAmount = purchaseInvoices.reduce((sum: number, inv: PurchaseInvoice) => sum + parseFloat(inv.paidAmount), 0);
  const totalOutstandingAmount = purchaseInvoices.reduce((sum: number, inv: PurchaseInvoice) => sum + parseFloat(inv.remainingAmount), 0);

  return (
    <div className="space-y-6">
      {/* Card-style header with green theme */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg">
              <Receipt className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-bold tracking-tight text-black">
                  Purchase Invoices
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Supplier invoice management and payment processing
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-green-700">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  <span className="font-medium">Accounts Payable</span>
                </div>
                <div className="text-sm text-blue-700 font-bold">
                  Total Invoices: {purchaseInvoices.length}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
              {/* <Button onClick={() => setShowNewDialog(true)} className="border-blue-500 bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-200" data-testid="button-new-purchase-invoice">
                <Plus className="h-4 w-4" />
                New Invoice
              </Button> */}
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6">
        <Card className="flex flex-row items-start gap-4 p-4 shadow-sm border border-gray-200 bg-white">
          <div className="rounded-full bg-blue-100 p-2 mt-1">
            <Calculator className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-700">Total Invoiced</div>
            <div className="text-2xl font-bold text-gray-900">
              BHD {totalInvoiceAmount === 0 ? '0' : ((totalInvoiceAmount/1000).toFixed(1).replace(/\.0$/, "") + 'k')}
            </div>
          </div>
        </Card>
        <Card className="flex flex-row items-start gap-4 p-4 shadow-sm border border-gray-200 bg-white">
          <div className="rounded-full bg-green-100 p-2 mt-1">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-700">Total Paid</div>
            <div className="text-2xl font-bold text-gray-900">
              BHD {totalPaidAmount === 0 ? '0' : ((totalPaidAmount/1000).toFixed(1).replace(/\.0$/, "") + 'k')}
            </div>
          </div>
        </Card>
        <Card className="flex flex-row items-start gap-4 p-4 shadow-sm border border-gray-200 bg-white">
          <div className="rounded-full bg-red-100 p-2 mt-1">
            <DollarSign className="h-6 w-6 text-red-500" />
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-700">Outstanding</div>
            <div className="text-2xl font-bold text-gray-900">
              BHD {totalOutstandingAmount === 0 ? '0' : ((totalOutstandingAmount/1000).toFixed(1).replace(/\.0$/, "") + 'k')}
            </div>
          </div>
        </Card>
        <Card className="flex flex-row items-start gap-4 p-4 shadow-sm border border-gray-200 bg-white">
          <div className="rounded-full bg-orange-100 p-2 mt-1">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-700">Overdue</div>
            <div className="text-2xl font-bold text-gray-900">
              {purchaseInvoices?.filter((inv: PurchaseInvoice) => inv.paymentStatus === "Overdue").length || 0}
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border border-gray-200 mb-8">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2 justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Filters</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((prev) => !prev)}
              className="shadow-sm flex items-center gap-1 px-2 py-0 h-6 min-h-0 text-xs ml-auto"
              data-testid="button-toggle-filters"
            >
              <Filter className="h-4 w-4 mr-1" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search invoices..."
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
                    <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Discrepancy">Discrepancy</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={filters.paymentStatus}
                  onValueChange={(value) => setFilters({ ...filters, paymentStatus: value })}
                >
                  <SelectTrigger data-testid="select-payment-status">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment Statuses</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={filters.currency}
                  onValueChange={(value) => setFilters({ ...filters, currency: value })}
                >
                  <SelectTrigger data-testid="select-currency">
                    <SelectValue placeholder="All Currencies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Currencies</SelectItem>
                    <SelectItem value="BHD">BHD</SelectItem>
                    <SelectItem value="AED">AED</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  placeholder="Filter by supplier..."
                  value={filters.supplier}
                  onChange={(e) => setFilters({ ...filters, supplier: e.target.value })}
                  className="border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-md shadow-none"
                />
              </div>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground",
                        dateRange.from && "border-blue-300 bg-blue-50"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={8}>
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={(range) => handleDateRangeChange(range?.from, range?.to)}
                      numberOfMonths={2}
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Purchase Invoices Table */}
      <Card className="shadow-lg border border-gray-200 mb-8">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Purchase Invoices</h3>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" data-testid="button-export-table">
                    <FileDown className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportPurchaseInvoices('csv')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportPurchaseInvoices('excel')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error loading purchase invoices</p>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/purchase-invoices"] })}>
                Retry
              </Button>
            </div>
          ) : (
            <div>
              <DataTable
                data={paginatedInvoices || []}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="No purchase invoices found. Create your first invoice to get started."
                onRowClick={(invoice: any) => {
                  navigate(`/purchase-invoices/${invoice.id}`);
                }}
              />
              {/* Pagination Controls */}
              {purchaseInvoices.length > pageSize && (
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

      {/* New Purchase Invoice Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Purchase Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplierId">Supplier</Label>
                <Select
                  value={newInvoice.supplierId}
                  onValueChange={(value) => setNewInvoice({ ...newInvoice, supplierId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliersLoading && (
                      <div className="p-2 text-sm text-gray-500">Loading suppliers...</div>
                    )}
                    {suppliersError && !suppliersLoading && (
                      <div className="p-2 text-sm text-red-500">Failed to load suppliers</div>
                    )}
                    {!suppliersLoading && !suppliersError && suppliers.length === 0 && (
                      <div className="p-2 text-sm text-gray-500">No suppliers found</div>
                    )}
                    {!suppliersLoading && !suppliersError && suppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="supplierInvoiceNumber">Supplier Invoice Number</Label>
                <Input
                  id="supplierInvoiceNumber"
                  value={newInvoice.supplierInvoiceNumber}
                  onChange={(e) => setNewInvoice({ ...newInvoice, supplierInvoiceNumber: e.target.value })}
                  placeholder="Supplier's invoice reference"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchaseOrderNumber">Purchase Order (Optional)</Label>
                <Input
                  id="purchaseOrderNumber"
                  value={newInvoice.purchaseOrderNumber}
                  onChange={(e) => setNewInvoice({ ...newInvoice, purchaseOrderNumber: e.target.value })}
                  placeholder="PO-2024-XXX"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={newInvoice.currency}
                  onValueChange={(value: PurchaseInvoice['currency']) => 
                    setNewInvoice({ ...newInvoice, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BHD">BHD</SelectItem>
                    <SelectItem value="AED">AED</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={newInvoice.invoiceDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, invoiceDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input
                id="paymentTerms"
                value={newInvoice.paymentTerms}
                onChange={(e) => setNewInvoice({ ...newInvoice, paymentTerms: e.target.value })}
                placeholder="e.g., Net 30, Net 15"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={newInvoice.notes}
                onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                placeholder="Additional notes or comments"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => createPurchaseInvoice.mutate(newInvoice)}
                disabled={createPurchaseInvoice.isPending || !newInvoice.supplierId || !newInvoice.invoiceDate || !newInvoice.dueDate}
              >
                {createPurchaseInvoice.isPending ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Invoice</Label>
              <div className="font-medium">{paymentInvoice?.invoiceNumber}</div>
              <div className="text-sm text-gray-500">{paymentInvoice?.supplierName}</div>
            </div>
            <div>
              <Label>Total Amount</Label>
              <div className="font-medium">{paymentInvoice?.currency} {paymentInvoice && parseFloat(paymentInvoice.totalAmount).toLocaleString()}</div>
            </div>
            <div>
              <Label>Remaining Amount</Label>
              <div className="font-medium text-red-600">{paymentInvoice?.currency} {paymentInvoice && parseFloat(paymentInvoice.remainingAmount).toLocaleString()}</div>
            </div>
            <div>
              <Label htmlFor="paymentAmount">Payment Amount</Label>
              <Input
                id="paymentAmount"
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(value: "Bank Transfer" | "Cheque" | "Cash" | "Credit Card" | "Letter of Credit") => 
                  setPaymentMethod(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Letter of Credit">Letter of Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentReference">Reference/Transaction ID</Label>
              <Input
                id="paymentReference"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="Transaction reference number"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (paymentInvoice) {
                    processPayment.mutate({
                      invoiceId: paymentInvoice.id,
                      amount: paymentAmount,
                      method: paymentMethod,
                      reference: paymentReference
                    });
                  }
                }}
                disabled={processPayment.isPending || !paymentAmount || parseFloat(paymentAmount) <= 0}
              >
                {processPayment.isPending ? "Processing..." : "Process Payment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingInvoice} onOpenChange={() => setDeletingInvoice(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the purchase invoice
              "{deletingInvoice?.invoiceNumber}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingInvoice && deletePurchaseInvoice.mutate(deletingInvoice.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletePurchaseInvoice.isPending}
            >
              {deletePurchaseInvoice.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}