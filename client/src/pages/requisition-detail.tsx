import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  User,
  Calendar,
  Package,
  FileText,
  DollarSign,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusPill from "@/components/status/status-pill";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Requisition {
  id: string;
  requisitionNumber: string;
  requestedBy: string;
  department: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Draft" | "Pending Approval" | "Approved" | "Rejected" | "Processing" | "Completed" | "Cancelled";
  requestDate: string;
  requiredDate: string;
  approvedBy?: string;
  approvedDate?: string;
  totalEstimatedCost: string;
  justification: string;
  notes?: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

interface RequisitionItem {
  id: string;
  requisitionId: string;
  itemDescription: string;
  quantity: number;
  unitOfMeasure: string;
  estimatedCost: string;
  specification?: string;
  preferredSupplier?: string;
  urgency: "Standard" | "Urgent";
}

export default function RequisitionDetailPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showNewItemDialog, setShowNewItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<RequisitionItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<RequisitionItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<RequisitionItem, 'id' | 'requisitionId'>>({
    itemDescription: '',
    quantity: 1,
    unitOfMeasure: 'Units',
    estimatedCost: '0',
    specification: '',
    preferredSupplier: '',
    urgency: 'Standard'
  });

  const requisitionId = params.id;

  // Fetch requisition
  const { data: requisition, isLoading: requisitionLoading, error: requisitionError } = useQuery({
    queryKey: ['/api/requisitions', requisitionId],
    enabled: !!requisitionId,
    queryFn: async () => {
      const res = await fetch(`/api/requisitions/${requisitionId}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to load requisition');
      }
      return res.json();
    }
  });

  // Fetch items
  const { data: items = [], isLoading: itemsLoading, error: itemsError } = useQuery({
    queryKey: ['/api/requisitions', requisitionId, 'items'],
    enabled: !!requisitionId,
    queryFn: async () => {
      const res = await fetch(`/api/requisitions/${requisitionId}/items`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to load items');
      }
      return res.json();
    }
  });

  // Create item
  const createItem = useMutation({
    mutationFn: async (data: Omit<RequisitionItem, 'id' | 'requisitionId'>) => {
      const res = await fetch(`/api/requisitions/${requisitionId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, quantity: Number(data.quantity), estimatedCost: data.estimatedCost })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create item');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/requisitions', requisitionId, 'items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/requisitions', requisitionId] });
      toast({ title: 'Success', description: 'Item added' });
      setShowNewItemDialog(false);
      setNewItem({ itemDescription: '', quantity: 1, unitOfMeasure: 'Units', estimatedCost: '0', specification: '', preferredSupplier: '', urgency: 'Standard' });
    },
    onError: (err: any) => toast({ title: 'Error', description: err?.message || 'Failed to add item', variant: 'destructive' })
  });

  // Update item
  const updateItem = useMutation({
    mutationFn: async (data: RequisitionItem) => {
      const res = await fetch(`/api/requisitions/items/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemDescription: data.itemDescription,
          quantity: Number(data.quantity),
            unitOfMeasure: data.unitOfMeasure,
            estimatedCost: data.estimatedCost,
            specification: data.specification,
            preferredSupplier: data.preferredSupplier,
            urgency: data.urgency
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update item');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/requisitions', requisitionId, 'items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/requisitions', requisitionId] });
      toast({ title: 'Success', description: 'Item updated' });
      setEditingItem(null);
    },
    onError: (err: any) => toast({ title: 'Error', description: err?.message || 'Failed to update item', variant: 'destructive' })
  });

  // Delete item
  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/requisitions/items/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to delete item');
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/requisitions', requisitionId, 'items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/requisitions', requisitionId] });
      toast({ title: 'Success', description: 'Item deleted' });
      setDeletingItem(null);
    },
    onError: (err: any) => toast({ title: 'Error', description: err?.message || 'Failed to delete item', variant: 'destructive' })
  });

  // Delete requisition
  const deleteRequisition = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/requisitions/${requisitionId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to delete requisition');
      }
      return true;
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Requisition deleted' });
      navigate('/requisitions');
    },
    onError: (err: any) => toast({ title: 'Error', description: err?.message || 'Failed to delete requisition', variant: 'destructive' })
  });

  const handleDelete = () => {
    deleteRequisition.mutate();
    setShowDeleteDialog(false);
  };

  const getPriorityColor = (priority: string) => {
    // Professional, minimal styling: no filled backgrounds, just subtle border + semantic text color
    switch (priority) {
      case "Urgent": return "bg-transparent text-red-600 border-red-300";
      case "High": return "bg-transparent text-orange-600 border-orange-300";
      case "Medium": return "bg-transparent text-amber-600 border-amber-300";
      case "Low": return "bg-transparent text-emerald-600 border-emerald-300";
      default: return "bg-transparent text-slate-600 border-slate-300";
    }
  };

  if (requisitionLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!requisition) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Requisition Not Found</h2>
          <p className="text-gray-600 mt-2">The requisition you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate("/requisitions")}
            className="group flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-200"
          >
            <ArrowLeft className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
            <div className="text-sm font-bold">Back to Requisitions</div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate("/requisitions")}
            className="group flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-200"
          >
            <ArrowLeft className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
            <div className="text-sm font-bold">Back to Requisitions</div>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {requisition.requisitionNumber}
            </h1>
            <p className="text-gray-600">
              Requested by {requisition.requestedBy}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(`/requisitions?edit=${requisitionId}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleteRequisition.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteRequisition.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-base text-gray-600 font-bold">Status</p>
                <StatusPill status={requisition.status} />
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
                <p className="text-base text-gray-600 font-bold">Priority</p>
                <Badge variant="outline" className={getPriorityColor(requisition.priority) + " shadow-none"}>
                  {requisition.priority}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-base text-gray-600 font-bold">Items</p>
                <p className="font-semibold">{requisition.itemCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-base text-gray-600 font-bold">Estimated Cost</p>
                <p className="font-semibold">{requisition.totalEstimatedCost}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Requested By</label>
                <p className="mt-1">{requisition.requestedBy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="mt-1">{requisition.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Request Date</label>
                <p className="mt-1">{formatDate(new Date(requisition.requestDate), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Required Date</label>
                <p className="mt-1">{formatDate(new Date(requisition.requiredDate), 'MMM dd, yyyy')}</p>
              </div>
              {requisition.approvedBy && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Approved By</label>
                    <p className="mt-1">{requisition.approvedBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Approved Date</label>
                    <p className="mt-1">
                      {requisition.approvedDate ? formatDate(new Date(requisition.approvedDate), 'MMM dd, yyyy') : '-'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Justification & Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Justification & Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Justification</label>
              <p className="mt-1 text-gray-900">{requisition.justification}</p>
            </div>
            {requisition.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Additional Notes</label>
                <p className="mt-1 text-gray-900">{requisition.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Items Section */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold tracking-tight">Requisition Items</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setShowNewItemDialog(true)} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/80 backdrop-blur-sm">
                  <tr className="border-b border-slate-200">
                    <th className="text-left font-medium text-slate-600 px-3 py-2">Description</th>
                    <th className="text-left font-medium text-slate-600 px-3 py-2">Qty</th>
                    <th className="text-left font-medium text-slate-600 px-3 py-2">Unit</th>
                    <th className="text-left font-medium text-slate-600 px-3 py-2">Est. Cost</th>
                    <th className="text-left font-medium text-slate-600 px-3 py-2">Urgency</th>
                    <th className="text-left font-medium text-slate-600 px-3 py-2">Preferred Supplier</th>
                    <th className="text-left font-medium text-slate-600 px-3 py-2 w-[84px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {itemsLoading && (
                    <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-500">Loading items...</td></tr>
                  )}
                  {!itemsLoading && items.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-500">No items added yet.</td></tr>
                  )}
                  {!itemsLoading && items.map((item: RequisitionItem, idx: number) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-3 py-2 align-top">
                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-800 leading-snug">{item.itemDescription}</p>
                          {item.specification && (
                            <p className="text-xs text-slate-500 leading-snug line-clamp-2">{item.specification}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top">{item.quantity}</td>
                      <td className="px-3 py-2 align-top">{item.unitOfMeasure}</td>
                      <td className="px-3 py-2 align-top">{item.estimatedCost}</td>
                      <td className="px-3 py-2 align-top">
                        <Badge variant={item.urgency === "Urgent" ? "destructive" : "secondary"} className="text-xs px-2 py-0.5">
                          {item.urgency}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 align-top text-slate-700">{item.preferredSupplier || <span className="text-slate-400">-</span>}</td>
                      <td className="px-2 py-1 align-top">
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => setEditingItem(item)} className="h-8 w-8" aria-label="Edit Item">
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Edit</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => setDeletingItem(item)} disabled={deleteItem.isPending} className="h-8 w-8" aria-label="Delete Item">
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Requisition</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this requisition? This action cannot be undone.
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
      {/* New Item Dialog */}
      <Dialog open={showNewItemDialog} onOpenChange={setShowNewItemDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input value={newItem.itemDescription} onChange={(e) => setNewItem({ ...newItem, itemDescription: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input type="number" min={1} value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium">Unit</label>
                <Input value={newItem.unitOfMeasure} onChange={(e) => setNewItem({ ...newItem, unitOfMeasure: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Estimated Cost</label>
                <Input type="number" step="0.01" value={newItem.estimatedCost} onChange={(e) => setNewItem({ ...newItem, estimatedCost: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Urgency</label>
                <Select value={newItem.urgency} onValueChange={(v: any) => setNewItem({ ...newItem, urgency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Specification</label>
              <Textarea rows={2} value={newItem.specification} onChange={(e) => setNewItem({ ...newItem, specification: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Preferred Supplier</label>
              <Input value={newItem.preferredSupplier} onChange={(e) => setNewItem({ ...newItem, preferredSupplier: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewItemDialog(false)}>Cancel</Button>
              <Button onClick={() => createItem.mutate(newItem)} disabled={createItem.isPending || !newItem.itemDescription}>
                {createItem.isPending ? 'Saving...' : 'Add Item'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(o) => { if (!o) setEditingItem(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
            {editingItem && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input value={editingItem.itemDescription} onChange={(e) => setEditingItem({ ...editingItem, itemDescription: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <Input type="number" min={1} value={editingItem.quantity} onChange={(e) => setEditingItem({ ...editingItem, quantity: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unit</label>
                    <Input value={editingItem.unitOfMeasure} onChange={(e) => setEditingItem({ ...editingItem, unitOfMeasure: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Estimated Cost</label>
                    <Input type="number" step="0.01" value={editingItem.estimatedCost} onChange={(e) => setEditingItem({ ...editingItem, estimatedCost: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Urgency</label>
                    <Select value={editingItem.urgency} onValueChange={(v: any) => setEditingItem({ ...editingItem, urgency: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Specification</label>
                  <Textarea rows={2} value={editingItem.specification || ''} onChange={(e) => setEditingItem({ ...editingItem, specification: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Preferred Supplier</label>
                  <Input value={editingItem.preferredSupplier || ''} onChange={(e) => setEditingItem({ ...editingItem, preferredSupplier: e.target.value })} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
                  <Button onClick={() => editingItem && updateItem.mutate(editingItem)} disabled={updateItem.isPending}>
                    {updateItem.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}
        </DialogContent>
      </Dialog>

      {/* Delete Item Confirmation */}
      <AlertDialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingItem?.itemDescription}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingItem && deleteItem.mutate(deletingItem.id)} disabled={deleteItem.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteItem.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}