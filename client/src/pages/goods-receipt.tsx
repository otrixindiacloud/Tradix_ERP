import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, Pencil, Trash, Package, Scan, AlertTriangle, Check, Clock, CheckCircle, Truck, CheckCircle2, XCircle } from "lucide-react";
import DataTable, { Column } from "@/components/tables/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function GoodsReceipt() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLpo, setSelectedLpo] = useState<any>(null);
  const [receiptData, setReceiptData] = useState({
    storageLocation: "",
    notes: "",
    items: [] as any[],
  });
  // Dialog state for view/edit/delete actions on Goods Receipt Header
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: supplierLpos, isLoading } = useQuery({
    queryKey: ["/api/supplier-lpos"],
  });

  const { data: goodsReceipts } = useQuery({
    queryKey: ["/api/goods-receipt-headers"],
  });

  // Mutation for deleting a goods receipt header
  const deleteGoodsReceipt = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/goods-receipt-headers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goods-receipt-headers"] });
      setDeleteDialogOpen(false);
      setSelectedReceipt(null);
      toast({ title: "Deleted", description: "Goods receipt deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete goods receipt", variant: "destructive" });
    },
  });

  const createGoodsReceipt = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/goods-receipt-headers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goods-receipt-headers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/supplier-lpos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Success",
        description: "Goods receipt created successfully",
      });
      setSelectedLpo(null);
      setReceiptData({ storageLocation: "", notes: "", items: [] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create goods receipt",
        variant: "destructive",
      });
    },
  });

  // Mutation for approving goods receipt
  const approveGoodsReceipt = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PATCH", `/api/goods-receipt-headers/${id}/approve`, { approvedBy: "current_user" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goods-receipt-headers"] });
      toast({ title: "Success", description: "Goods receipt approved successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve goods receipt", variant: "destructive" });
    },
  });

  // Mutation for updating goods receipt status
  const updateGoodsReceiptStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/goods-receipt-headers/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goods-receipt-headers"] });
      toast({ title: "Success", description: "Goods receipt status updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update goods receipt status", variant: "destructive" });
    },
  });

  // Mutation for updating goods receipt
  const updateGoodsReceipt = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PATCH", `/api/goods-receipt-headers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goods-receipt-headers"] });
      toast({ title: "Success", description: "Goods receipt updated successfully" });
      setEditDialogOpen(false);
      setEditForm(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update goods receipt", variant: "destructive" });
    },
  });

  // Filter for confirmed supplier LPOs ready for goods receipt
  const lposArray = Array.isArray(supplierLpos?.data) ? supplierLpos.data : (Array.isArray(supplierLpos) ? supplierLpos : []);
  const confirmedLpos = lposArray.filter((lpo: any) => lpo.status === "Confirmed");
  
  const filteredLpos = confirmedLpos?.filter((lpo: any) =>
    lpo.lpoNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lpo.supplierName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<any>[] = [
    {
      key: "lpoNumber",
      header: "LPO Number",
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600 font-medium">{value}</span>
      ),
    },
    {
      key: "supplier",
      header: "Supplier",
      render: (supplier: any) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {supplier?.name || "Unknown Supplier"}
          </p>
          <p className="text-xs text-gray-600">
            {supplier?.contactPerson || "-"}
          </p>
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "LPO Value",
      render: (value: number) => value ? formatCurrency(value) : "-",
      className: "text-right",
    },
    {
      key: "expectedDeliveryDate",
      header: "Expected Delivery",
      render: (value: string) => {
        const isOverdue = value && new Date(value) < new Date();
        return (
          <div className={isOverdue ? "text-red-600" : ""}>
            {value ? formatDate(value) : "-"}
            {isOverdue && <span className="ml-1 text-xs">(Overdue)</span>}
          </div>
        );
      },
    },
    {
      key: "receiptStatus",
      header: "Receipt Status",
      render: (_, lpo: any) => {
        const receipt = (Array.isArray(goodsReceipts) ? goodsReceipts : []).find((gr: any) => gr.supplierLpoId === lpo.id);
        if (!receipt) {
          return (
            <Badge variant="outline" className="text-orange-600">
              <Package className="h-3 w-3 mr-1" />
              Pending Receipt
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className={getStatusColor(receipt.status)}>
            {receipt.status}
          </Badge>
        );
      },
    },
    {
      key: "lpoDate",
      header: "LPO Date",
      render: (value: string) => formatDate(value),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, lpo: any) => {
        const receipt = (Array.isArray(goodsReceipts) ? goodsReceipts : []).find((gr: any) => gr.supplierLpoId === lpo.id);
        return (
          <div className="flex items-center space-x-2">
            {!receipt && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLpo(lpo);
                  // Initialize receipt data with LPO items
                  setReceiptData({
                    storageLocation: "",
                    notes: "",
                    items: lpo.items?.map((item: any) => ({
                      ...item,
                      receivedQuantity: item.quantity,
                      damagedQuantity: 0,
                    })) || [],
                  });
                }}
                data-testid={`button-receive-${lpo.id}`}
              >
                <Package className="h-4 w-4 mr-1" />
                Receive Goods
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                console.log("View LPO details:", lpo);
              }}
              data-testid={`button-view-${lpo.id}`}
            >
              <Scan className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const receiptStats = {
    pending: confirmedLpos?.filter((lpo: any) => 
      !(Array.isArray(goodsReceipts) ? goodsReceipts : [])?.some((gr: any) => gr.supplierLpoId === lpo.id)
    ).length || 0,
    partial: (Array.isArray(goodsReceipts) ? goodsReceipts : [])?.filter((gr: any) => gr.status === "Partial").length || 0,
    completed: (Array.isArray(goodsReceipts) ? goodsReceipts : [])?.filter((gr: any) => gr.status === "Complete").length || 0,
    approved: (Array.isArray(goodsReceipts) ? goodsReceipts : [])?.filter((gr: any) => gr.status === "Approved").length || 0,
    discrepancy: (Array.isArray(goodsReceipts) ? goodsReceipts : [])?.filter((gr: any) => gr.status === "Discrepancy").length || 0,
  };

  const handleItemQuantityChange = (index: number, field: string, value: number) => {
    const updatedItems = [...receiptData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setReceiptData({ ...receiptData, items: updatedItems });
  };

  const processGoodsReceipt = () => {
    if (!selectedLpo || !receiptData.storageLocation.trim()) {
      toast({
        title: "Error",
        description: "Please provide storage location",
        variant: "destructive",
      });
      return;
    }

    const hasDiscrepancy = receiptData.items.some(item => 
      item.receivedQuantity !== item.quantity || item.damagedQuantity > 0
    );

    const status = hasDiscrepancy ? "Discrepancy" : "Complete";

    createGoodsReceipt.mutate({
      supplierLpoId: selectedLpo.id,
      storageLocation: receiptData.storageLocation,
      notes: receiptData.notes,
      status,
      items: receiptData.items,
    });
  };

  return (
    <div>
      {/* Enhanced Card-style header with orange theme */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 relative overflow-hidden mb-6">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-orange-50/50 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-48 h-24 bg-gradient-to-tr from-orange-100/30 to-transparent rounded-tr-full"></div>
        <div className="relative px-8 py-6 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg border border-orange-100">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-black mb-1" data-testid="text-page-title">
                  Goods Receipt
                </h2>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                    <Package className="h-3 w-3 mr-1" />
                    Step 7
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-600 text-sm font-medium">
                      Processing incoming shipments
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
              Receive and validate goods against supplier LPOs with barcode scanning and quality control
            </p>
          </div>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Pending Receipt</p>
                <p className="text-2xl font-bold text-orange-600" data-testid="stat-pending-receipt">
                  {receiptStats.pending}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  Confirmed LPOs awaiting receipt
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Partial Receipt</p>
                <p className="text-2xl font-bold text-blue-600" data-testid="stat-partial-receipt">
                  {receiptStats.partial}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  Partially received shipments
                </div>
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
                <p className="text-sm font-bold text-gray-900">Complete Receipt</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-complete-receipt">
                  {receiptStats.completed}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  Fully received shipments
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mt-1">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Approved</p>
                <p className="text-2xl font-bold text-emerald-600" data-testid="stat-approved-receipt">
                  {receiptStats.approved}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  Approved receipts
                </div>
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
                <p className="text-sm font-bold text-gray-900">Discrepancies</p>
                <p className="text-2xl font-bold text-red-600" data-testid="stat-discrepancy-receipt">
                  {receiptStats.discrepancy}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  Receipts with issues
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goods Receipt Table - Goods Receipt Headers (single table only) */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Goods Receipt Headers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={Array.isArray(goodsReceipts) ? goodsReceipts : []}
            columns={[
              {
                key: "receiptNumber",
                header: "Receipt Number",
                render: (v: any, row: any) => <span className="font-mono text-xs">{v || row.id}</span>
              },
              {
                key: "supplierName",
                header: "Supplier Name",
                render: (v: any, row: any) => {
                  // Find supplier name from LPO data
                  const lpo = lposArray.find((l: any) => l.id === row.supplierLpoId);
                  return (
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {lpo?.supplierName || row.supplierName || "Unknown Supplier"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {lpo?.supplierId ? `ID: ${lpo.supplierId.slice(0, 8)}...` : ""}
                      </div>
                    </div>
                  );
                }
              },
              {
                key: "lpoNumber",
                header: "LPO Number",
                render: (v: any, row: any) => {
                  const lpo = lposArray.find((l: any) => l.id === row.supplierLpoId);
                  return (
                    <div className="text-sm">
                      <div className="font-mono text-blue-600 font-medium">
                        {lpo?.lpoNumber || v || row.supplierLpoId}
                      </div>
                      <div className="text-xs text-gray-500">
                        {lpo?.lpoDate ? formatDate(lpo.lpoDate) : ""}
                      </div>
                    </div>
                  );
                }
              },
              { key: "storageLocation", header: "Storage Location" },
              {
                key: "lpoValue",
                header: "LPO Value",
                render: (v: any, row: any) => {
                  const lpo = lposArray.find((l: any) => l.id === row.supplierLpoId);
                  return (
                    <div className="text-sm text-right">
                      <div className="font-medium text-gray-900">
                        {lpo?.totalAmount ? formatCurrency(parseFloat(lpo.totalAmount)) : "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {lpo?.currency || ""}
                      </div>
                    </div>
                  );
                }
              },
              { key: "status", header: "Status", render: (v: any) => {
           let color = "bg-gray-100 text-gray-700 border-gray-300";
           if (v === "Draft") color = "bg-yellow-100 text-yellow-700 border-yellow-300";
           else if (v === "Pending") color = "bg-gray-100 text-gray-700 border-gray-300";
           else if (v === "Partial") color = "bg-blue-100 text-blue-700 border-blue-300";
           else if (v === "Complete" || v === "Completed") color = "bg-green-100 text-green-700 border-green-300";
           else if (v === "Approved") color = "bg-emerald-100 text-emerald-700 border-emerald-300";
           else if (v === "Discrepancy") color = "bg-red-100 text-red-700 border-red-300";
           return <Badge variant="outline" className={color}>{v}</Badge>;
              } },
              { key: "createdAt", header: "Created At", render: (v: any) => v ? formatDate(v) : "-" },
              {
                key: "actions",
                header: "Actions",
                render: (_: any, row: any) => (
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" onClick={() => { setSelectedReceipt(row); setViewDialogOpen(true); }} title="View">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => { setSelectedReceipt(row); setEditForm({ ...row }); setEditDialogOpen(true); }} title="Edit">
                      <Pencil className="h-4 w-4 text-green-600" />
                    </Button>
                    {row.status === "Complete" && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => approveGoodsReceipt.mutate(row.id)} 
                        title="Approve"
                        disabled={approveGoodsReceipt.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </Button>
                    )}
                    {row.status === "Approved" && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => updateGoodsReceiptStatus.mutate({ id: row.id, status: "Complete" })} 
                        title="Unapprove"
                        disabled={updateGoodsReceiptStatus.isPending}
                      >
                        <XCircle className="h-4 w-4 text-orange-600" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => { setSelectedReceipt(row); setDeleteDialogOpen(true); }} title="Delete">
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ),
              },
            ]}
            isLoading={isLoading}
            emptyMessage="No goods receipt headers found."
          />
        </CardContent>
      </Card>
      {/* Dialogs for view/edit/delete actions */}
      <Dialog open={viewDialogOpen} onOpenChange={(open) => { setViewDialogOpen(open); if (!open) setSelectedReceipt(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <DialogTitle className="text-blue-700">Goods Receipt Details</DialogTitle>
            </div>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4 p-2">
              <div className="grid grid-cols-2 gap-4 bg-blue-50 rounded p-3 mb-2">
                <div><span className="font-semibold text-gray-700">Receipt Number:</span> <span className="font-mono">{selectedReceipt.receiptNumber || selectedReceipt.id}</span></div>
                <div><span className="font-semibold text-gray-700">LPO Number:</span> <span className="font-mono">{selectedReceipt.lpoNumber || selectedReceipt.supplierLpoNumber}</span></div>
                <div><span className="font-semibold text-gray-700">Supplier:</span> {
                  (() => {
                    const lpo = lposArray.find((l: any) => l.id === selectedReceipt.supplierLpoId);
                    return lpo?.supplierName || selectedReceipt.supplierName || "Unknown Supplier";
                  })()
                }</div>
                <div><span className="font-semibold text-gray-700">Storage Location:</span> {selectedReceipt.storageLocation}</div>
                <div><span className="font-semibold text-gray-700">LPO Value:</span> {
                  (() => {
                    const lpo = lposArray.find((l: any) => l.id === selectedReceipt.supplierLpoId);
                    return lpo?.totalAmount ? `${formatCurrency(parseFloat(lpo.totalAmount))} ${lpo.currency || ''}` : "-";
                  })()
                }</div>
                <div><span className="font-semibold text-gray-700">Status:</span> {
                  (() => {
                    let color = "bg-gray-100 text-gray-700 border-gray-300";
                    const v = selectedReceipt.status;
                    if (v === "Draft") color = "bg-yellow-100 text-yellow-700 border-yellow-300";
                    else if (v === "Pending") color = "bg-gray-100 text-gray-700 border-gray-300";
                    else if (v === "Partial") color = "bg-blue-100 text-blue-700 border-blue-300";
                    else if (v === "Complete" || v === "Completed") color = "bg-green-100 text-green-700 border-green-300";
                    else if (v === "Approved") color = "bg-emerald-100 text-emerald-700 border-emerald-300";
                    else if (v === "Discrepancy") color = "bg-red-100 text-red-700 border-red-300";
                    return <Badge className={color}>{v}</Badge>;
                  })()
                }</div>
                <div><span className="font-semibold text-gray-700">Created At:</span> {selectedReceipt.createdAt ? formatDate(selectedReceipt.createdAt) : "-"}</div>
              </div>
              {selectedReceipt.notes && (
                <div className="bg-gray-50 rounded p-2 text-sm text-gray-700"><strong>Notes:</strong> {selectedReceipt.notes}</div>
              )}
              {Array.isArray(selectedReceipt.items) && selectedReceipt.items.length > 0 && (
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Items</div>
                  <ul className="text-xs bg-white rounded border p-2">
                    {selectedReceipt.items.map((item: any, idx: number) => (
                      <li key={idx} className="mb-1 flex gap-2 items-center">
                        <Package className="h-3 w-3 text-orange-500" />
                        <span className="font-mono">{item.barcode}</span> — {item.description || item.itemId} (Qty: {item.quantity})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={editDialogOpen} onOpenChange={(open) => { setEditDialogOpen(open); if (!open) setSelectedReceipt(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Pencil className="h-5 w-5 text-green-600" />
              <DialogTitle className="text-green-700">Edit Goods Receipt</DialogTitle>
            </div>
          </DialogHeader>
          {editForm && (
            <form
              className="space-y-4"
              onSubmit={e => {
                e.preventDefault();
                if (editForm) {
                  updateGoodsReceipt.mutate({ 
                    id: editForm.id, 
                    data: {
                      storageLocation: editForm.storageLocation,
                      status: editForm.status,
                      notes: editForm.notes
                    }
                  });
                }
              }}
            >
              <div className="grid grid-cols-2 gap-4 bg-green-50 rounded p-3 mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Storage Location <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    required
                    value={editForm.storageLocation}
                    onChange={e => setEditForm({ ...editForm, storageLocation: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={editForm.status}
                    required
                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="">Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                    <option value="Complete">Complete</option>
                    <option value="Approved">Approved</option>
                    <option value="Discrepancy">Discrepancy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">LPO Number <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={editForm.lpoNumber || editForm.supplierLpoId}
                    required
                    onChange={e => setEditForm({ ...editForm, lpoNumber: e.target.value })}
                  >
                    <option value="">Select LPO Number</option>
                    {Array.isArray(supplierLpos?.data) && supplierLpos.data.map((lpo: any) => (
                      <option key={lpo.id} value={lpo.lpoNumber}>{lpo.lpoNumber} - {lpo.supplierName}</option>
                    ))}
                    {Array.isArray(supplierLpos) && !supplierLpos?.data && supplierLpos.map((lpo: any) => (
                      <option key={lpo.id} value={lpo.lpoNumber}>{lpo.lpoNumber} - {lpo.supplierName}</option>
                    ))}
                    {!supplierLpos && <option disabled>Loading LPOs...</option>}
                    {supplierLpos && !Array.isArray(supplierLpos?.data) && !Array.isArray(supplierLpos) && <option disabled>No LPOs available</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Receipt Number</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={editForm.receiptNumber || editForm.id}
                    disabled
                  >
                    <option value="">Select Receipt Number</option>
                    {Array.isArray(goodsReceipts) && goodsReceipts.map((gr: any) => (
                      <option key={gr.id} value={gr.receiptNumber || gr.id}>{gr.receiptNumber || gr.id}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <Textarea
                  value={editForm.notes || ""}
                  onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Items</label>
                <div className="border rounded p-2 bg-gray-50">
                  {Array.isArray(editForm.items) && editForm.items.length > 0 ? (
                    <ul className="text-xs">
                      {editForm.items.map((item: any, idx: number) => (
                        <li key={idx} className="mb-1 flex gap-2 items-center">
                          <Package className="h-3 w-3 text-orange-500" />
                          <span className="font-mono">{item.barcode}</span> — {item.description || item.itemId} (Qty: {item.quantity})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">No items</span>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" type="button" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button 
                  type="submit" 
                  disabled={updateGoodsReceipt.isPending}
                >
                  {updateGoodsReceipt.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setSelectedReceipt(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Trash className="h-5 w-5 text-red-600" />
              <DialogTitle className="text-red-700">Delete Goods Receipt</DialogTitle>
            </div>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4 p-2">
              <div className="bg-red-50 rounded p-2 text-sm text-red-700 font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Are you sure you want to delete this goods receipt?
              </div>
              <div className="text-xs text-gray-500">Receipt ID: <span className="font-mono">{selectedReceipt.id}</span></div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" type="button" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => deleteGoodsReceipt.mutate(selectedReceipt.id)}
                  disabled={deleteGoodsReceipt.isPending}
                >
                  {deleteGoodsReceipt.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Goods Receipt Header Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={(open) => { setViewDialogOpen(open); if (!open) setSelectedReceipt(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Goods Receipt Details</DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-3">
              <div><strong>Receipt ID:</strong> {selectedReceipt.id}</div>
              <div><strong>Supplier LPO ID:</strong> {selectedReceipt.supplierLpoId}</div>
              <div><strong>Storage Location:</strong> {selectedReceipt.storageLocation}</div>
              <div><strong>Status:</strong> {selectedReceipt.status}</div>
              <div><strong>Created At:</strong> {selectedReceipt.createdAt ? formatDate(selectedReceipt.createdAt) : "-"}</div>
              {/* Add more fields as needed */}
            </div>
          )}
        </DialogContent>
      </Dialog>

      

      {/* Delete Goods Receipt Header Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setSelectedReceipt(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Goods Receipt</DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4">
              <div>Are you sure you want to delete this goods receipt?</div>
              <div className="text-xs text-gray-500">Receipt ID: {selectedReceipt.id}</div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => deleteGoodsReceipt.mutate(selectedReceipt.id)}
                  disabled={deleteGoodsReceipt.isPending}
                >
                  {deleteGoodsReceipt.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Goods Receipt Dialog */}
      <Dialog open={!!selectedLpo} onOpenChange={() => setSelectedLpo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Process Goods Receipt</DialogTitle>
          </DialogHeader>
          {selectedLpo && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">LPO Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">LPO Number:</span> {selectedLpo.lpoNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Supplier:</span> {selectedLpo.supplier?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Expected Delivery:</span> {selectedLpo.expectedDeliveryDate ? formatDate(selectedLpo.expectedDeliveryDate) : "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">LPO Value:</span> {formatCurrency(selectedLpo.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Storage Location <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter storage location..."
                    value={receiptData.storageLocation}
                    onChange={(e) => setReceiptData({ ...receiptData, storageLocation: e.target.value })}
                    data-testid="input-storage-location"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Receipt Notes
                  </label>
                  <Input
                    type="text"
                    placeholder="Additional notes..."
                    value={receiptData.notes}
                    onChange={(e) => setReceiptData({ ...receiptData, notes: e.target.value })}
                    data-testid="input-receipt-notes"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Items Receipt Verification</h4>
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-6 gap-4 p-3 bg-gray-50 border-b text-sm font-medium text-gray-700">
                    <div>Item</div>
                    <div>Barcode</div>
                    <div>Ordered Qty</div>
                    <div>Received Qty</div>
                    <div>Damaged Qty</div>
                    <div>Status</div>
                  </div>
                  {receiptData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-6 gap-4 p-3 border-b items-center">
                      <div className="text-sm">{item.description || item.itemId}</div>
                      <div className="text-xs font-mono">{item.barcode || "N/A"}</div>
                      <div className="text-sm font-medium">{item.quantity}</div>
                      <div>
                        <Input
                          type="number"
                          min="0"
                          max={item.quantity}
                          value={item.receivedQuantity}
                          onChange={(e) => handleItemQuantityChange(index, "receivedQuantity", parseInt(e.target.value) || 0)}
                          className="w-20"
                          data-testid={`input-received-qty-${index}`}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          min="0"
                          max={item.receivedQuantity}
                          value={item.damagedQuantity}
                          onChange={(e) => handleItemQuantityChange(index, "damagedQuantity", parseInt(e.target.value) || 0)}
                          className="w-20"
                          data-testid={`input-damaged-qty-${index}`}
                        />
                      </div>
                      <div>
                        {item.receivedQuantity === item.quantity && item.damagedQuantity === 0 ? (
                          <Badge className="underline decoration-green-500 text-green-700">
                            <Check className="h-3 w-3 mr-1" />
                            OK
                          </Badge>
                        ) : (
                          <Badge className="underline decoration-orange-500 text-orange-700">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Discrepancy
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedLpo(null)}
                  data-testid="button-cancel-receipt"
                >
                  Cancel
                </Button>
                <Button
                  onClick={processGoodsReceipt}
                  disabled={!receiptData.storageLocation.trim() || createGoodsReceipt.isPending}
                  data-testid="button-process-receipt"
                >
                  {createGoodsReceipt.isPending ? "Processing..." : "Process Receipt"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
