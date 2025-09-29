import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { formatDate } from "date-fns";
import { 
  ArrowLeft, 
  Download, 
  FileText,
  Clock,
  DollarSign,
  Building2,
  Calendar,
  Receipt,
  Package,
  AlertTriangle,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import StatusPill from "@/components/status/status-pill"; // not needed now
import { useToast } from "@/hooks/use-toast";
// Delete functionality not yet supported for derived invoices

interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplierInvoiceNumber?: string;
  supplierId: string;
  supplierName: string;
  supplierEmail?: string;
  supplierPhone?: string;
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  goodsReceiptId?: string;
  goodsReceiptNumber?: string;
  status: "Draft" | "Pending Approval" | "Approved" | "Paid" | "Partially Paid" | "Overdue" | "Disputed" | "Cancelled";
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
  attachments: Array<string | { url: string; name?: string }>;
  itemCount: number;
  isRecurring: boolean;
  nextInvoiceDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface PurchaseInvoiceItem {
  id: string;
  goodsReceiptId?: string;
  itemDescription: string;
  supplierCode?: string;
  barcode?: string;
  quantity: number;
  unitPrice?: string;
  totalPrice?: string;
  unitOfMeasure?: string;
  taxRate?: string;
  discountRate?: string;
  discountAmount?: string;
  taxAmount?: string;
  notes?: string;
}

// Payments not yet implemented on backend for derived purchase invoices
type PaymentEntry = never;

export default function PurchaseInvoiceDetailPage() {
  // Handles viewing an attachment (opens in new tab or downloads)
  const handleViewAttachment = (attachment: { url: string; name?: string }) => {
    if (attachment?.url) {
      window.open(attachment.url, '_blank');
    }
  };
  const { id } = useParams();
  const [, navigate] = useLocation();
  // UI state for features not yet supported; kept for future enablement
  const [showEditDialog] = useState(false);
  const [showPaymentDialog] = useState(false);
  const [showDeleteDialog] = useState(false);
  const [editingInvoice] = useState<PurchaseInvoice | null>(null);
  const [paymentAmount] = useState("");
  const [paymentMethod] = useState<"Bank Transfer" | "Cheque" | "Cash" | "Credit Card" | "Letter of Credit">("Bank Transfer");
  const [paymentReference] = useState("");
  const [paymentNotes] = useState("");
  
  const { toast } = useToast();

  // Download PDF handler (mock implementation)
  // Print Invoice handler (mock implementation)
  const handlePrint = () => {
    // For now, just trigger browser print dialog
    window.print();
    toast({
      title: "Print Started",
      description: "Invoice print dialog opened.",
    });
  };
  const handleDownloadPDF = () => {
    if (!invoice || !invoice.attachments || invoice.attachments.length === 0) {
      toast({
        title: "No PDF Available",
        description: "No invoice PDF found for download.",
        variant: "destructive",
      });
      return;
    }
    // Find the first PDF attachment
    const pdfAttachment = invoice.attachments.find(att => {
      if (typeof att === 'string') return att.endsWith('.pdf');
      if (att && typeof att === 'object' && att.url) return att.url.endsWith('.pdf');
      return false;
    });
    if (!pdfAttachment) {
      toast({
        title: "No PDF Available",
        description: "No invoice PDF found for download.",
        variant: "destructive",
      });
      return;
    }
    let url = '';
    let filename = '';
    if (typeof pdfAttachment === 'string') {
      url = `/files/${pdfAttachment}`;
      filename = pdfAttachment;
    } else if (pdfAttachment && typeof pdfAttachment === 'object') {
      url = pdfAttachment.url;
      filename = pdfAttachment.name || pdfAttachment.url.split('/').pop() || 'invoice.pdf';
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast({
      title: "Download Started",
      description: `Invoice PDF (${filename}) download started.`,
    });
  };
  // Fetch all derived purchase invoices then select the one we need (no single endpoint yet)
  const { data: invoices, isLoading } = useQuery<PurchaseInvoice[]>({
    queryKey: ["/api/purchase-invoices"],
    queryFn: async () => {
      const resp = await fetch("/api/purchase-invoices");
      if (!resp.ok) throw new Error("Failed to fetch purchase invoices");
      return resp.json();
    }
  });

  const invoice = useMemo(() => (invoices || []).find(inv => inv.id === id), [invoices, id]);

  // Fetch items from goods receipt items endpoint if goodsReceiptId present
  const { data: invoiceItems = [] } = useQuery<PurchaseInvoiceItem[]>({
    queryKey: ["/api/goods-receipt-headers", invoice?.goodsReceiptId, "items"],
    enabled: !!invoice?.goodsReceiptId,
    queryFn: async () => {
      const resp = await fetch(`/api/goods-receipt-headers/${invoice!.goodsReceiptId}/items`);
      if (!resp.ok) throw new Error("Failed to fetch goods receipt items");
      return resp.json();
    }
  });

  const paymentHistory: PaymentEntry[] = [];

  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case "Draft": 
        return {
          variant: "outline" as const,
          className: "border-gray-500 text-gray-600 hover:bg-gray-50"
        };
      case "Pending Approval": 
        return {
          variant: "outline" as const,
          className: "border-yellow-500 text-yellow-600 hover:bg-yellow-50"
        };
      case "Approved": 
        return {
          variant: "outline" as const,
          className: "border-green-500 text-green-600 hover:bg-green-50"
        };
      case "Paid": 
        return {
          variant: "outline" as const,
          className: ""
        };
      case "Partially Paid": 
        return {
          variant: "outline" as const,
          className: "border-orange-500 text-orange-600 hover:bg-orange-50"
        };
      case "Overdue": 
        return {
          variant: "outline" as const,
          className: "border-red-500 text-red-600 hover:bg-red-50"
        };
      case "Disputed": 
        return {
          variant: "outline" as const,
          className: "border-purple-500 text-purple-600 hover:bg-purple-50"
        };
      case "Cancelled": 
        return {
          variant: "outline" as const,
          className: "border-gray-500 text-gray-600 hover:bg-gray-50"
        };
      default: 
        return {
          variant: "outline" as const,
          className: "border-gray-500 text-gray-600 hover:bg-gray-50"
        };
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
          className: ""
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (!invoice && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
          <p className="text-gray-600 mb-4">The requested purchase invoice could not be found.</p>
          <Link href="/purchase-invoices">
            <Button>Back to Purchase Invoices</Button>
          </Link>
        </div>
      </div>
    );
  }

  // If still loading invoices, show spinner (previous loading branch covers but guard here)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  // Defensive: if invoice somehow undefined after loading
  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
          <p className="text-gray-600 mb-4">The requested purchase invoice could not be found.</p>
          <Link href="/purchase-invoices">
            <Button>Back to Purchase Invoices</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/purchase-invoices">
            <Button variant="outline" size="sm" onClick={() => navigate('/purchase-invoices')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Purchase Invoices
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{invoice?.invoiceNumber}</h1>
            <p className="text-gray-600">{invoice?.supplierName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled title="Edit not available (derived invoice)">
            Edit
          </Button>
          <Button variant="outline" disabled title="Download requires attachment integration">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button disabled title="Payments not implemented for derived invoices">Record Payment</Button>
        </div>
      </div>

      {/* Status and Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div>
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Status</p>
                <Badge 
                  variant={getStatusBadgeProps(invoice?.status || 'Draft').variant}
                  className={getStatusBadgeProps(invoice?.status || 'Draft').className}
                >
                  <span className="font-medium">{invoice?.status}</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

  <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div>
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Total Amount</p>
                <p className="text-xl font-bold">{invoice?.currency} {parseFloat(invoice?.totalAmount || '0').toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

  <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-6 w-6" />
              <div>
                <p className="text-sm font-bold text-black">Payment Status</p>
                <Badge 
                  variant={getPaymentStatusBadgeProps(invoice?.paymentStatus || 'Unpaid').variant}
                  className={getPaymentStatusBadgeProps(invoice?.paymentStatus || 'Unpaid').className}
                >
                  <span className="font-medium">{invoice?.paymentStatus}</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

  <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div>
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Due Date</p>
                  <p className="text-lg font-semibold">{invoice?.dueDate ? formatDate(new Date(invoice.dueDate), 'MMM dd, yyyy') : '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Invoice Number</Label>
                  <p className="text-lg font-semibold">{invoice?.invoiceNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Supplier Invoice Number</Label>
                  <p className="text-lg">{invoice?.supplierInvoiceNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Invoice Date</Label>
                  <p className="text-lg">{invoice?.invoiceDate ? formatDate(new Date(invoice.invoiceDate), 'MMM dd, yyyy') : '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Due Date</Label>
                  <p className="text-lg">{invoice?.dueDate ? formatDate(new Date(invoice.dueDate), 'MMM dd, yyyy') : '-'}</p>
                </div>
                {invoice?.receivedDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Received Date</Label>
                    <p className="text-lg">{formatDate(new Date(invoice.receivedDate), 'MMM dd, yyyy')}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-600">Payment Terms</Label>
                  <p className="text-lg">{invoice?.paymentTerms || '-'}</p>
                </div>
                {invoice?.purchaseOrderNumber && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Purchase Order</Label>
                    <p className="text-lg">{invoice.purchaseOrderNumber}</p>
                  </div>
                )}
                {invoice?.goodsReceiptNumber && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Goods Receipt</Label>
                    <p className="text-lg">{invoice.goodsReceiptNumber}</p>
                  </div>
                )}
              </div>
              {invoice?.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Notes</Label>
                  <p className="text-gray-800">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Invoice Items ({invoiceItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-gray-600">Item</th>
                      <th className="text-center py-3 px-2 font-medium text-gray-600">Qty</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-600">Unit Price</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-600">Discount</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-600">Tax</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item: any) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{item.itemDescription || item.description || 'Item'}</p>
                            {item.supplierCode && <p className="text-sm text-gray-600">{item.supplierCode}</p>}
                            {item.barcode && (<p className="text-xs text-gray-500">Barcode: {item.barcode}</p>)}
                            {item.notes && (<p className="text-xs text-gray-500 italic">{item.notes}</p>)}
                          </div>
                        </td>
                        <td className="text-center py-3 px-2">
                          {item.quantity} {item.unitOfMeasure || ''}
                        </td>
                        <td className="text-right py-3 px-2">
                          {invoice?.currency} {parseFloat(item.unitPrice || '0').toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-2">
                          {item.discountAmount && parseFloat(item.discountAmount) > 0 ? (
                            <span className="text-green-600">-{invoice?.currency} {parseFloat(item.discountAmount).toLocaleString()}</span>
                          ) : '-'}
                        </td>
                        <td className="text-right py-3 px-2">
                          {invoice?.currency} {parseFloat(item.taxAmount || '0').toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-2 font-medium">
                          {invoice?.currency} {parseFloat(item.totalPrice || '0').toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Separator className="my-4" />

              {/* Invoice Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{invoice?.currency} {parseFloat(invoice?.subtotal || '0').toLocaleString()}</span>
                </div>
                {invoice?.discountAmount && parseFloat(invoice.discountAmount) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-green-600">-{invoice?.currency} {parseFloat(invoice.discountAmount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">{invoice?.currency} {parseFloat(invoice.taxAmount || '0').toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{invoice?.currency} {parseFloat(invoice?.totalAmount || '0').toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Paid:</span>
                  <span>{invoice?.currency} {parseFloat(invoice?.paidAmount || '0').toLocaleString()}</span>
                </div>
                {invoice?.remainingAmount && parseFloat(invoice.remainingAmount) > 0 && (
                  <div className="flex justify-between text-red-600 font-medium">
                    <span>Remaining:</span>
                    <span>{invoice?.currency} {parseFloat(invoice.remainingAmount).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Supplier Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-600">Name</Label>
                <p className="font-medium">{invoice?.supplierName}</p>
              </div>
              {invoice?.supplierEmail && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-blue-600">{invoice.supplierEmail}</p>
                </div>
              )}
              {invoice?.supplierPhone && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                  <p>{invoice.supplierPhone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment History (not available yet) */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Payment History
              </CardTitle>
            </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center py-4">Payment integration coming soon</p>
                  )
            </CardContent>
          </Card>


          {/* Quick Actions (limited - derived data) */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" disabled className="w-full justify-start" title="Download not available yet">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" disabled className="w-full justify-start" title="Print not available yet">
                <FileText className="h-4 w-4 mr-2" />
                Print Invoice
              </Button>
              <Button disabled className="w-full justify-start" title="Payments not available">Record Payment</Button>
              <Button variant="destructive" disabled className="w-full justify-start" title="Delete not available">Delete Invoice</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Removed Edit / Payment / Delete dialogs since backend support not implemented for derived invoices */}
    </div>
  );
}