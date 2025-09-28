import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, Filter, Package, AlertTriangle, TrendingUp, TrendingDown, Scan, Boxes, DollarSign, Lock, XCircle, Warehouse, Plus, Eye, Edit, Trash2, CheckCircle } from "lucide-react";
import DataTable, { Column } from "@/components/tables/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Form schema for creating inventory items
const createItemSchema = z.object({
  supplierCode: z.string().min(1, "Supplier code is required"),
  barcode: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  unitOfMeasure: z.string().min(1, "Unit of measure is required"),
  costPrice: z.number().min(0, "Cost price must be non-negative"),
  quantity: z.number().min(0, "Initial quantity must be non-negative"),
  totalStock: z.number().min(0, "Total stock must be non-negative"),
  reservedQuantity: z.number().min(0, "Reserved quantity must be non-negative"),
  availableQuantity: z.number().min(0, "Available quantity must be non-negative"),
  storageLocation: z.string().optional(),
});

type CreateItemForm = z.infer<typeof createItemSchema>;

export default function Inventory() {
  // State for edit dialog
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const editItemForm = useForm<CreateItemForm>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      supplierCode: "",
      barcode: "",
      description: "",
      category: "",
      unitOfMeasure: "",
      costPrice: 0,
      quantity: 0,
      totalStock: 0,
      reservedQuantity: 0,
      availableQuantity: 0,
      storageLocation: "",
    },
  });

  // Mutation for updating inventory item
  const updateItem = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateItemForm }) => {
      const response = await apiRequest("PUT", `/api/inventory-items/${id}`, data);
      if (!response.ok) throw new Error("Failed to update item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-items"] });
      setShowEditDialog(false);
      setEditingItem(null);
      editItemForm.reset();
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    },
  });

  // When opening edit dialog, set form values
  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setShowEditDialog(true);
    editItemForm.reset({
      supplierCode: item.supplierCode || "",
      barcode: item.barcode || "",
      description: item.description || "",
      category: item.category || "",
      unitOfMeasure: item.unitOfMeasure || "",
      costPrice: item.costPrice || 0,
      quantity: item.quantity || 0,
      totalStock: item.totalStock || 0,
      reservedQuantity: item.reservedQuantity || 0,
      availableQuantity: item.availableQuantity || 0,
      storageLocation: item.storageLocation || "",
    });
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showStockAdjustDialog, setShowStockAdjustDialog] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<any>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [adjustmentType, setAdjustmentType] = useState<"increase" | "decrease" | "set">("increase");
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form for creating new items
  const createItemForm = useForm<CreateItemForm>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      supplierCode: "",
      barcode: "",
      description: "",
      category: "",
      unitOfMeasure: "",
      costPrice: 0,
      quantity: 0,
      totalStock: 0,
      reservedQuantity: 0,
      availableQuantity: 0,
      storageLocation: "",
    },
  });

  const { data: inventoryItems, isLoading, error: inventoryError } = useQuery({
    queryKey: ["/api/inventory-items"],
    queryFn: async () => {
      const response = await fetch("/api/inventory-items");
      if (!response.ok) {
        throw new Error(`Failed to fetch inventory items: ${response.statusText}`);
      }
      return response.json();
    },
  });

  const updateStock = useMutation({
    mutationFn: async ({ itemId, quantity, type, adjustmentType }: { 
      itemId: string; 
      quantity: number; 
      type: "adjustment" | "cycle_count";
      adjustmentType?: "increase" | "decrease" | "set";
    }) => {
      const response = await apiRequest("PUT", `/api/inventory-items/${itemId}`, { 
        quantity, 
        type, 
        adjustmentType 
      });
      if (!response.ok) {
        throw new Error("Failed to update stock");
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch inventory data to update frontend
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-items"] });
      
      // Close dialog and reset state
      setShowStockAdjustDialog(false);
      setAdjustingItem(null);
      setAdjustmentQuantity(0);
      setAdjustmentType("increase");
      
      // Also close the item details dialog if it's open
      setSelectedItem(null);
      
      toast({
        title: "Success",
        description: `Stock adjusted successfully. New quantity: ${data.quantity || 'updated'}`,
      });
    },
    onError: (error: any) => {
      console.error("Stock adjustment error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to adjust stock",
        variant: "destructive",
      });
    },
  });

  // Create item mutation
  const createItem = useMutation({
    mutationFn: async (data: CreateItemForm) => {
      const response = await apiRequest("POST", "/api/inventory-items", data);
      if (!response.ok) {
        throw new Error("Failed to create item");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-items"] });
      setShowCreateDialog(false);
      createItemForm.reset();
      toast({
        title: "Success",
        description: `Item "${data.description}" created successfully`,
      });
    },
    onError: (error: any) => {
      console.error("Create item error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create item",
        variant: "destructive",
      });
    },
  });

  // Handle create item form submission
  const handleCreateItem = async (data: z.infer<typeof createItemSchema>) => {
    try {
      await createItem.mutateAsync(data);
      setShowCreateDialog(false);
      createItemForm.reset();
    } catch (error) {
      // Error is handled by the mutation
      console.error('Error creating item:', error);
    }
  };

  const handleStockAdjust = (item: any) => {
    setAdjustingItem(item);
    setShowStockAdjustDialog(true);
    setAdjustmentQuantity(1);
    setAdjustmentType("increase");
    setSelectedItem(null);

    // Auto-focus on quantity input after dialog opens
    setTimeout(() => {
      const quantityInput = document.querySelector('[data-testid="adjustment-quantity-input"]') as HTMLInputElement;
      if (quantityInput) {
        quantityInput.focus();
        quantityInput.select();
      }
    }, 100);
  };

  const handleStockAdjustSubmit = () => {
    if (!adjustingItem) {
      toast({
        title: "Error",
        description: "No item selected for adjustment",
        variant: "destructive",
      });
      return;
    }

    if (adjustmentQuantity <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity greater than 0",
        variant: "destructive",
      });
      return;
    }

    let finalQuantity = adjustmentQuantity;
    const currentQuantity = adjustingItem.quantity || 0;
    
    if (adjustmentType === "increase") {
      finalQuantity = currentQuantity + adjustmentQuantity;
    } else if (adjustmentType === "decrease") {
      finalQuantity = Math.max(0, currentQuantity - adjustmentQuantity);
      if (currentQuantity - adjustmentQuantity < 0) {
        toast({
          title: "Warning",
          description: `Reducing quantity to 0 (requested ${adjustmentQuantity} but only ${currentQuantity} available)`,
        });
      }
    } else { // set
      finalQuantity = adjustmentQuantity;
    }

    // Send update to backend
    updateStock.mutate({
      itemId: adjustingItem.id,
      quantity: finalQuantity,
      type: "adjustment",
      adjustmentType,
    });
  };

  // Normalize inventory items so that total stock displays correctly even if backend uses totalStock instead of quantity
  const inventoryWithDetails = inventoryItems?.map((item: any) => {
    // Prefer explicit totalStock, fallback to quantity
    const total =
      typeof item.totalStock === "number"
        ? item.totalStock
        : typeof item.quantity === "number"
          ? item.quantity
          : 0;
    const reserved =
      typeof item.reservedQuantity === "number"
        ? item.reservedQuantity
        : typeof item.reserved === "number"
          ? item.reserved
          : 0;
    const available = Math.max(0, (typeof item.availableQuantity === "number" ? item.availableQuantity : total - reserved));
    return {
      ...item,
      // Ensure both fields are set for downstream components
      totalStock: total,
      quantity: total, // DataTable column keyed on "quantity"
      reservedQuantity: reserved,
      availableQuantity: available,
    };
  });

  // Sort inventory by createdAt descending (newest first)
  const sortedInventory = inventoryWithDetails?.slice().sort((a: any, b: any) => {
    // If createdAt exists, use it; fallback to id (assuming uuid or increment)
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Fallback: sort by id descending
    return (b.id > a.id ? 1 : b.id < a.id ? -1 : 0);
  });

  const filteredInventory = sortedInventory?.filter((item: any) => {
    const matchesSearch = item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplierCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.barcode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === "low") {
      matchesStock = item.availableQuantity <= 10; // Low stock threshold
    } else if (stockFilter === "out") {
      matchesStock = item.availableQuantity <= 0;
    } else if (stockFilter === "reserved") {
      matchesStock = (item.reservedQuantity || 0) > 0;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const columns: Column<any>[] = [
    {
      key: "supplierCode",
      header: "Supplier Code",
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600">{value}</span>
      ),
    },
    {
      key: "barcode",
      header: "Barcode",
      render: (value: string) => (
        <span className="font-mono text-xs text-gray-600">{value || "N/A"}</span>
      ),
    },
    {
      key: "description",
      header: "Item Description",
      render: (value: string, item: any) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-600">
            {item.category} | {item.unitOfMeasure}
          </p>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Total Stock",
      render: (value: number, item: any) => {
        const total = value ?? item.totalStock ?? 0;
        return (
          <span className="text-sm font-medium" data-testid={`cell-total-stock-${item.id}`}>{total}</span>
        );
      },
      className: "text-center",
    },
    {
      key: "reservedQuantity",
      header: "Reserved",
      render: (value: number) => (
        <span className={`text-sm ${(value || 0) > 0 ? "text-orange-600 font-medium" : "text-gray-500"}`}>
          {value || 0}
        </span>
      ),
      className: "text-center",
    },
    {
      key: "availableQuantity",
      header: "Available",
      render: (value: number) => {
        let colorClass = "text-green-600";
        if (value <= 0) colorClass = "text-red-600";
        else if (value <= 10) colorClass = "text-orange-600";
        
        return (
          <span className={`text-sm font-medium ${colorClass}`}>
            {value}
          </span>
        );
      },
      className: "text-center",
    },
    {
      key: "storageLocation",
      header: "Location",
      render: (value: string) => (
        <span className="text-sm">{value || "N/A"}</span>
      ),
    },
    {
      key: "stockStatus",
      header: "Status",
      render: (_: any, item: any) => {
        const available = item.availableQuantity ?? 0;
        // Multi-tier thresholds for richer status feedback
        // 0 => Out, 1-3 => Critical, 4-10 => Low, >10 => In Stock
        let status: string;
        let classes = "";
        let icon: JSX.Element | null = null;

        if (available <= 0) {
          status = "Out of Stock";
          classes = "bg-red-50 text-red-700 border border-red-200";
          icon = <AlertTriangle className="h-3 w-3 mr-1 text-red-600" />;
        } else if (available <= 3) {
          status = "Critical Low";
          classes = "bg-red-600 text-black-900 border border-red-200  animate-pulse";
          icon = <AlertTriangle className="h-3 w-3 mr-1 text-black-900" />;
        } else if (available <= 10) {
          status = "Low Stock";
          classes = "bg-amber-50 text-amber-700 border border-amber-200";
          icon = <AlertTriangle className="h-3 w-3 mr-1 text-amber-600" />;
        } else {
          status = "In Stock";
          classes = "bg-green-50 text-green-700 border border-green-200";
          icon = <CheckCircle className="h-3 w-3 mr-1 text-green-600" />;
        }

        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium leading-none gap-1 ${classes}`}
            title={`Available: ${available}`}
            data-testid={`badge-stock-status-${item.id}`}
          >
            {icon}
            {status}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, item: any) => (
        <div className="flex items-center space-x-2">
          {/* View Icon */}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(item);
            }}
            data-testid={`button-view-${item.id}`}
            title="View Details"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
          {/* Edit Icon */}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(item);
            }}
            data-testid={`button-edit-${item.id}`}
            title="Edit Item"
          >
            <Edit className="h-4 w-4 text-green-600" />
          </Button>
          {/* Delete Icon */}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setDeletingItem(item);
              setShowDeleteDialog(true);
            }}
            data-testid={`button-delete-${item.id}`}
            title="Delete Item"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  const inventoryStats = {
    totalItems: inventoryWithDetails?.length || 0,
    totalValue: inventoryWithDetails?.reduce((sum: number, item: any) => 
      sum + ((item.quantity || 0) * (item.costPrice || 0)), 0) || 0,
    lowStock: inventoryWithDetails?.filter((item: any) => item.availableQuantity <= 10 && item.availableQuantity > 0).length || 0,
    outOfStock: inventoryWithDetails?.filter((item: any) => item.availableQuantity <= 0).length || 0,
    reserved: inventoryWithDetails?.filter((item: any) => (item.reservedQuantity || 0) > 0).length || 0,
  };

  const categories = Array.from(new Set(inventoryItems?.map((item: any) => item.category).filter(Boolean))) as string[];

  return (
    <div>
      {/* Enhanced Card-style header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-lg border border-gray-200 relative overflow-hidden mb-6">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-emerald-50/50 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-48 h-24 bg-gradient-to-tr from-teal-50/30 to-transparent rounded-tr-full"></div>
        
        <div className="relative px-8 py-6 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg border border-gray-200">
                <Warehouse className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1" data-testid="text-page-title">
                  
                  Inventory Items 
                </h2>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <Package className="h-3 w-3 mr-1" />
                    Step 8
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-600 text-sm font-medium">
                      Monitoring stock levels
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
              Monitor stock levels and manage inventory with barcode tracking and real-time analytics
            </p>
          </div>
          
          <div className="flex items-center gap-4 ml-8">
            {/* Add Item Button */}
            <button
              className="group flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-200"
              onClick={() => setShowCreateDialog(true)}
            >
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <Package className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">Add Item</div>
                <div className="text-xs text-gray-500">New Stock</div>
              </div>
            </button>
            {/* Direct Barcode Scan Add Button */}
            <button
              className="group flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-200"
              onClick={() => {
                // Placeholder for barcode scan logic
                // You can integrate a modal or scanner component here
                toast({
                  title: "Barcode Scan",
                  description: "Initiate barcode scan to add item.",
                });
              }}
              data-testid="button-barcode-add"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Scan className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">Add via Barcode</div>
                <div className="text-xs text-gray-500">Scan & Add</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Create Item Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Plus className="h-4 w-4 text-emerald-600" />
              </div>
              Add New Inventory Item
            </DialogTitle>
            <DialogDescription>
              Create a new inventory item with all the necessary details for tracking and management.
            </DialogDescription>
          </DialogHeader>

          <Form {...createItemForm}>
            <form onSubmit={createItemForm.handleSubmit(handleCreateItem)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Package className="h-4 w-4 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createItemForm.control}
                    name="supplierCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Code *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., SUP-001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createItemForm.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barcode (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 1234567890123" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={createItemForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Description *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Premium Office Chair" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createItemForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Furniture, Electronics" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createItemForm.control}
                    name="unitOfMeasure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit of Measure *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., pcs, kg, m" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Pricing and Stock Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <DollarSign className="h-4 w-4 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Pricing & Stock</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createItemForm.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Price *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createItemForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Quantity *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Stock Management Fields */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={createItemForm.control}
                    name="totalStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Stock *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createItemForm.control}
                    name="reservedQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reserved</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createItemForm.control}
                    name="availableQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Warehouse className="h-4 w-4 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Storage</h3>
                </div>
                
                <FormField
                  control={createItemForm.control}
                  name="storageLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage Location (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Warehouse A, Shelf B2" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Summary Preview */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-gray-900">Item Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Description:</span>{" "}
                    <span className="font-medium">
                      {createItemForm.watch("description") || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>{" "}
                    <span className="font-medium">
                      {createItemForm.watch("category") || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cost Price:</span>{" "}
                    <span className="font-medium text-green-600">
                      {formatCurrency(createItemForm.watch("costPrice") || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Initial Stock:</span>{" "}
                    <span className="font-medium text-blue-600">
                      {createItemForm.watch("quantity") || 0} {createItemForm.watch("unitOfMeasure") || "units"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Stock:</span>{" "}
                    <span className="font-medium text-blue-600">
                      {createItemForm.watch("totalStock") || 0} {createItemForm.watch("unitOfMeasure") || "units"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Reserved:</span>{" "}
                    <span className="font-medium text-orange-600">
                      {createItemForm.watch("reservedQuantity") || 0} {createItemForm.watch("unitOfMeasure") || "units"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Available:</span>{" "}
                    <span className="font-medium text-green-600">
                      {createItemForm.watch("availableQuantity") || 0} {createItemForm.watch("unitOfMeasure") || "units"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    createItemForm.reset();
                  }}
                  disabled={createItem.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createItem.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {createItem.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Item
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Inventory Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                <Boxes className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900 font-bold">Total Items</p>
                <p className="text-2xl font-bold text-blue-600" data-testid="stat-total-items">
                  {inventoryStats.totalItems}
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
                <p className="text-sm text-gray-900 font-bold">Inventory Value</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-inventory-value">
                  {formatCurrency(inventoryStats.totalValue)}
                </p>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600">Total stock value</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900 font-bold">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600" data-testid="stat-low-stock">
                  {inventoryStats.lowStock}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  Items with ≤10 units
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mt-1">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900 font-bold">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600" data-testid="stat-out-of-stock">
                  {inventoryStats.outOfStock}
                </p>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-red-600">Requires restocking</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                <Lock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900 font-bold">Reserved Stock</p>
                <p className="text-2xl font-bold text-purple-600" data-testid="stat-reserved-stock">
                  {inventoryStats.reserved}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  Items with reserved qty
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventory Items</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-md shadow-none"
                  data-testid="input-search-inventory"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                  <SelectItem value="reserved">Reserved Stock</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" data-testid="button-filter">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {inventoryError ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">
                Error loading inventory: {inventoryError?.message}
              </p>
              <Button onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/inventory-items"] });
              }}>
                Retry
              </Button>
            </div>
          ) : (
            <DataTable
              data={filteredInventory || []}
              columns={columns}
              isLoading={isLoading}
              emptyMessage="No inventory items found."
              onRowClick={(item) => {
                setSelectedItem(item);
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Item Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <Form {...editItemForm}>
              <form
                onSubmit={editItemForm.handleSubmit((data) => updateItem.mutate({ id: editingItem.id, data }))}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editItemForm.control}
                    name="supplierCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Code *</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editItemForm.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barcode</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={editItemForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editItemForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editItemForm.control}
                    name="unitOfMeasure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit of Measure *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={editItemForm.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Price *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={field.value}
                            onChange={e => field.onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editItemForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Stock *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            value={field.value}
                            onChange={e => field.onChange(e.target.value === "" ? 0 : parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editItemForm.control}
                    name="reservedQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reserved</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            value={field.value}
                            onChange={e => field.onChange(e.target.value === "" ? 0 : parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={editItemForm.control}
                  name="availableQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          value={field.value}
                          onChange={e => field.onChange(e.target.value === "" ? 0 : parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editItemForm.control}
                  name="storageLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" type="button" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateItem.isPending}>
                    {updateItem.isPending ? "Updating..." : "Update Item"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Item Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inventory Item Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Item Information</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Description:</span> {selectedItem.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Supplier Code:</span> {selectedItem.supplierCode}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Barcode:</span> {selectedItem.barcode || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Category:</span> {selectedItem.category || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Stock Information</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Total Quantity:</span> {selectedItem.quantity || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Reserved:</span> {selectedItem.reservedQuantity || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Available:</span> {selectedItem.availableQuantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {selectedItem.storageLocation || "N/A"}
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Pricing Information</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Cost Price</p>
                    <p className="text-sm font-medium">{formatCurrency(selectedItem.costPrice || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Stock Value</p>
                    <p className="text-sm font-medium">
                      {formatCurrency((selectedItem.costPrice || 0) * (selectedItem.quantity || 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Available Value</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency((selectedItem.costPrice || 0) * selectedItem.availableQuantity)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleStockAdjust(selectedItem)}
                  data-testid="button-adjust-stock"
                >
                  Adjust Stock
                </Button>
                <Button
                  onClick={() => setSelectedItem(null)}
                  data-testid="button-close-details"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Stock Adjustment Dialog */}
      <Dialog open={showStockAdjustDialog} onOpenChange={setShowStockAdjustDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
          </DialogHeader>
          {adjustingItem && (
            <div className="space-y-4">
              {/* Item Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Item Details</h4>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Description:</span> {adjustingItem.description}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Supplier Code:</span> {adjustingItem.supplierCode}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Current Stock:</span> {adjustingItem.quantity || 0}
                </p>
              </div>

              {/* Adjustment Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Adjustment Type</label>
                <Select value={adjustmentType} onValueChange={(value: "increase" | "decrease" | "set") => setAdjustmentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">Increase Stock</SelectItem>
                    <SelectItem value="decrease">Decrease Stock</SelectItem>
                    <SelectItem value="set">Set Stock Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  {adjustmentType === "increase" ? "Quantity to Add" : 
                   adjustmentType === "decrease" ? "Quantity to Remove" : 
                   "New Stock Level"}
                </label>
                <Input
                  type="number"
                  min="1"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && adjustmentQuantity > 0 && !updateStock.isPending) {
                      handleStockAdjustSubmit();
                    }
                  }}
                  placeholder="Enter quantity"
                  data-testid="adjustment-quantity-input"
                />
              </div>

              {/* Preview */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Current Stock:</span> {adjustingItem.quantity || 0}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Adjustment:</span> {
                    adjustmentType === "increase" ? `+${adjustmentQuantity}` :
                    adjustmentType === "decrease" ? `-${adjustmentQuantity}` :
                    `Set to ${adjustmentQuantity}`
                  }
                </p>
                <p className="text-sm font-bold text-blue-700 pt-1 border-t border-blue-200 mt-2">
                  <span className="font-medium">New Stock Level:</span>{" "}
                  {adjustmentType === "increase" 
                    ? (adjustingItem.quantity || 0) + adjustmentQuantity
                    : adjustmentType === "decrease"
                    ? Math.max(0, (adjustingItem.quantity || 0) - adjustmentQuantity)
                    : adjustmentQuantity
                  }
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowStockAdjustDialog(false)}
                  disabled={updateStock.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStockAdjustSubmit}
                  disabled={updateStock.isPending || adjustmentQuantity <= 0}
                  className={
                    adjustmentType === "decrease" && adjustmentQuantity > (adjustingItem.quantity || 0)
                      ? "bg-orange-600 hover:bg-orange-700"
                      : ""
                  }
                >
                  {updateStock.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    `Adjust Stock ${adjustmentType === "increase" ? "↑" : adjustmentType === "decrease" ? "↓" : "→"}`
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
