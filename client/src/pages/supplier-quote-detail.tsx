import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation, useParams } from "wouter";
import { formatDate } from "date-fns";
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Star,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusPill from "@/components/status/status-pill";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface SupplierQuote {
  id: string;
  quoteNumber: string;
  supplierId: string;
  supplierName: string;
  requisitionId?: string;
  requisitionNumber?: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending" | "Draft" | "Sent" | "Received" | "Under Review" | "Approved" | "Rejected" | "Accepted" | "Expired";
  requestDate: string;
  responseDate?: string;
  validUntil: string;
  totalAmount: string;
  currency: string;
  paymentTerms: string;
  deliveryTerms: string;
  notes?: string;
  attachments?: string[];
  score?: number;
  rank?: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

interface SupplierQuoteItem {
  id: string;
  quotationId: string;
  description: string; // Changed from itemDescription to description
  quantity: number;
  unitPrice: string;
  lineTotal: string; // Changed from totalPrice to lineTotal
  unitOfMeasure?: string;
  specifications?: string;
  leadTime?: string;
  warranty?: string;
  notes?: string;
}

export default function SupplierQuoteDetailPage() {

  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState<SupplierQuote | null>(null);
  const quoteId = params.id;

  // Fetch quote details from API
  const [quote, setQuote] = useState<SupplierQuote | null>(null);
  const [items, setItems] = useState<SupplierQuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch quote and items on mount or quoteId change
  React.useEffect(() => {
    if (!quoteId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/supplier-quotes/${quoteId}`).then(async r => {
        if (!r.ok) throw new Error("Failed to fetch quote");
        return r.json();
      }),
      fetch(`/api/supplier-quotes/${quoteId}/items`).then(async r => {
        if (!r.ok) throw new Error("Failed to fetch items");
        return r.json();
      })
    ]).then(([quoteData, itemsData]) => {
      setQuote(quoteData);
      setItems(itemsData);
      setLoading(false);
    }).catch(e => {
      setError(e.message);
      setLoading(false);
    });
  }, [quoteId]);

  const handleDelete = () => {
    toast({
      title: "Success",
      description: "Supplier quote deleted successfully (mock)",
    });
    navigate("/supplier-quotes");
    setShowDeleteDialog(false);
  };

  const handleApprove = () => {
    toast({
      title: "Success",
      description: "Supplier quote approved (mock)",
    });
  };

  const handleReject = () => {
    toast({
      title: "Success",
      description: "Supplier quote rejected (mock)",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-500 text-white border-red-600";
      case "High": return "bg-orange-500 text-white border-orange-600";
      case "Medium": return "bg-yellow-500 text-white border-yellow-600";
      case "Low": return "bg-green-500 text-white border-green-600";
      default: return "bg-gray-500 text-white border-gray-600";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-600";
    if (score >= 7) return "text-yellow-600";
    return "text-red-600";
  };

  if (!quote) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Supplier Quote Not Found</h2>
          <p className="text-gray-600 mt-2">The supplier quote you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate("/supplier-quotes")}
            className="group flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-200 mt-4"
          >
            <ArrowLeft className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
            <div className="text-sm font-bold">Back to Supplier Quotes</div>
          </button>
        </div>
      </div>
    );
  }

  // Add missing handleEditClick function
  const handleEditClick = () => {
    if (quote) {
      setEditForm(quote);
      setShowEditDialog(true);
    }
  };

  // Add missing handleEditChange function
  const handleEditChange = <K extends keyof SupplierQuote>(key: K, value: SupplierQuote[K]) => {
    setEditForm(prev => prev ? { ...prev, [key]: value } : prev);
  };

  // Add missing handleEditSave function (mock implementation)
  const handleEditSave = () => {
    toast({
      title: "Success",
      description: "Supplier quote updated (mock)",
    });
    setShowEditDialog(false);
    // Optionally update quote state with editForm
    if (editForm) setQuote(editForm);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate("/supplier-quotes")}
            className="group flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-200"
          >
            <ArrowLeft className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
            <div className="text-sm font-bold">Back to Supplier Quotes</div>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {quote.quoteNumber}
            </h1>
            <p className="text-gray-600">
              From {quote.supplierName}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {quote.status === "Under Review" && (
            <>
              <Button 
                variant="outline"
                onClick={handleApprove}
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button 
                variant="outline"
                onClick={handleReject}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          <Button 
            variant="outline"
            onClick={handleEditClick}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Status</p>
                <StatusPill status={quote.status} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Priority</p>
                <Badge className={getPriorityColor(quote.priority)}>
                  {quote.priority}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Total Amount</p>
                <p className="font-semibold">{quote.currency} {quote.totalAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Score</p>
                <p className={`font-semibold ${getScoreColor(quote.score || 0)}`}>
                  {quote.score}/10
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Rank</p>
                <p className="font-semibold">#{quote.rank}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quote Information */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Supplier</label>
                <p className="mt-1">{quote.supplierName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Requisition</label>
                <p className="mt-1">{quote.requisitionNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Request Date</label>
                <p className="mt-1">{
                  quote.requestDate && !isNaN(Date.parse(quote.requestDate))
                    ? formatDate(new Date(quote.requestDate), 'MMM dd, yyyy')
                    : 'N/A'
                }</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Response Date</label>
                <p className="mt-1">
                  {quote.responseDate && !isNaN(Date.parse(quote.responseDate))
                    ? formatDate(new Date(quote.responseDate), 'MMM dd, yyyy')
                    : 'Pending'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Valid Until</label>
                <p className="mt-1">{
                  quote.validUntil && !isNaN(Date.parse(quote.validUntil))
                    ? formatDate(new Date(quote.validUntil), 'MMM dd, yyyy')
                    : 'N/A'
                }</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Currency</label>
                <p className="mt-1">{quote.currency}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms & Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Payment Terms</label>
              <p className="mt-1 text-gray-900">{quote.paymentTerms}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Delivery Terms</label>
              <p className="mt-1 text-gray-900">{quote.deliveryTerms}</p>
            </div>
            {quote.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="mt-1 text-gray-900">{quote.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Items Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quote Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Unit Price</th>
                  <th className="text-left p-2">Total Price</th>
                  <th className="text-left p-2">Lead Time</th>
                  <th className="text-left p-2">Warranty</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        {item.specifications && (
                          <p className="text-sm text-gray-500">{item.specifications}</p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-gray-400 italic mt-1">{item.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-2">{item.quantity} {item.unitOfMeasure || 'pcs'}</td>
                    <td className="p-2">{quote.currency} {parseFloat(item.unitPrice).toLocaleString()}</td>
                    <td className="p-2 font-medium">{quote.currency} {parseFloat(item.lineTotal).toLocaleString()}</td>
                    <td className="p-2">{item.leadTime || '-'}</td>
                    <td className="p-2">{item.warranty || '-'}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-200 font-semibold">
                  <td colSpan={3} className="p-2 text-right">Total Amount:</td>
                  <td className="p-2">{quote.currency} {quote.totalAmount}</td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {/* Edit Supplier Quote Modal Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Supplier Quote</DialogTitle>
          </DialogHeader>
          {editForm && (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
                <Input
                  value={editForm.supplierName}
                  onChange={e => handleEditChange("supplierName", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    className="w-full border rounded p-2"
                    value={editForm.priority}
                    onChange={e => handleEditChange("priority", e.target.value as SupplierQuote["priority"])}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    className="w-full border rounded p-2"
                    value={editForm.status}
                    onChange={e => handleEditChange("status", e.target.value as SupplierQuote["status"])}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Received">Received</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <Input
                    type="number"
                    value={editForm.totalAmount}
                    onChange={e => handleEditChange("totalAmount", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Currency</label>
                  <Input
                    value={editForm.currency}
                    onChange={e => handleEditChange("currency", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
                <Input
                  value={editForm.paymentTerms}
                  onChange={e => handleEditChange("paymentTerms", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery Terms</label>
                <Input
                  value={editForm.deliveryTerms}
                  onChange={e => handleEditChange("deliveryTerms", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <Textarea
                  value={editForm.notes || ""}
                  onChange={e => handleEditChange("notes", e.target.value)}
                />
              </div>
            </form>
          )}
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="default" onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier Quote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this supplier quote? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}