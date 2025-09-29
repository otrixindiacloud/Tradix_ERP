import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Package,
  Boxes,
  Search,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ScanLine,
  Truck,
  FileText,
  History,
  Filter,
  LayoutGrid,
  List,
  Download
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/hooks/use-toast";
import type { Item, InventoryLevel, GoodsReceiptHeader, StockMovement } from "@shared/schema";

// Form schemas
const inventoryItemSchema = z.object({
  supplierCode: z.string().min(1, "Supplier code is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  unitOfMeasure: z.string().min(1, "Unit of measure is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  barcode: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  isActive: z.boolean().default(true),
});

const inventoryVariantSchema = z.object({
  inventoryItemId: z.string().min(1, "Item is required"),
  variantName: z.string().min(1, "Variant name is required"),
  variantValue: z.string().min(1, "Variant value is required"),
  additionalCost: z.number().optional(),
  barcode: z.string().optional(),
});

const goodsReceiptSchema = z.object({
  receiptNumber: z.string().min(1, "Receipt number is required"),
  supplierLpoId: z.string().min(1, "Supplier LPO is required"),
  receiptDate: z.string().min(1, "Receipt date is required"),
  receivedBy: z.string().min(1, "Received by is required"),
  status: z.enum(["Draft", "Completed", "Partially Received"]),
  notes: z.string().optional(),
});

const supplierReturnSchema = z.object({
  returnNumber: z.string().min(1, "Return number is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  returnDate: z.string().min(1, "Return date is required"),
  reason: z.string().min(1, "Return reason is required"),
  status: z.enum(["Draft", "Pending", "Approved", "Completed"]),
  totalAmount: z.number().min(0, "Total amount must be positive"),
  notes: z.string().optional(),
});

type InventoryItemForm = z.infer<typeof inventoryItemSchema>;
type InventoryVariantForm = z.infer<typeof inventoryVariantSchema>;
type GoodsReceiptForm = z.infer<typeof goodsReceiptSchema>;
type SupplierReturnForm = z.infer<typeof supplierReturnSchema>;

function InventoryItemsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showInactiveItems, setShowInactiveItems] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InventoryItemForm>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      supplierCode: "",
      description: "",
      category: "",
      unitOfMeasure: "",
      supplierId: "",
      barcode: "",
      weight: undefined,
      dimensions: "",
      isActive: true,
    },
  });

  // Fetch inventory items
  const { data: inventoryItems = [], isLoading, error: itemsError } = useQuery({
    queryKey: ["/api/inventory-items", { 
      search: searchQuery, 
      category: selectedCategory === "all" ? undefined : selectedCategory,
      isActive: !showInactiveItems ? true : undefined 
    }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (!showInactiveItems) params.append('isActive', 'true');
      
      const url = `/api/inventory-items${params.toString() ? '?' + params.toString() : ''}`;
      console.log("Fetching inventory items from:", url);
      const response = await fetch(url, { credentials: "include" });
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch inventory items: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Inventory items data:", data);
      return data;
    },
    enabled: true,
  });

  // Fetch suppliers for the form
  const { data: suppliers = [], error: suppliersError } = useQuery({
    queryKey: ["/api/suppliers"],
    queryFn: async () => {
      const response = await fetch("/api/suppliers");
      if (!response.ok) {
        throw new Error(`Failed to fetch suppliers: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: true,
  });

  // Create inventory item mutation
  const createItemMutation = useMutation({
    mutationFn: async (data: InventoryItemForm) => {
      return await apiRequest("POST", "/api/inventory-items", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-items"] });
      setShowCreateDialog(false);
      form.reset();
      toast({ title: "Success", description: "Inventory item created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Update inventory item mutation
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InventoryItemForm> }) => {
      return await apiRequest("PUT", `/api/inventory-items/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-items"] });
      setEditingItem(null);
      form.reset();
      toast({ title: "Success", description: "Inventory item updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Delete inventory item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/inventory-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-items"] });
      toast({ title: "Success", description: "Inventory item deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: InventoryItemForm) => {
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data });
    } else {
      createItemMutation.mutate(data);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    form.reset({
      supplierCode: item.supplierCode,
      description: item.description,
      category: item.category,
      unitOfMeasure: item.unitOfMeasure,
      supplierId: item.supplierId,
      barcode: item.barcode || "",
      weight: item.weight || undefined,
      dimensions: item.dimensions || "",
      isActive: item.isActive,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this inventory item?")) {
      deleteItemMutation.mutate(id);
    }
  };

  // Get unique categories for filter
  const categories = Array.from(new Set((inventoryItems as any[]).map((item: any) => item.category).filter(Boolean)));

  return (
    <div className="space-y-6" data-testid="inventory-items-tab">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by supplier code, description, or barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-items"
            />
          </div>
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48" data-testid="select-category-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
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

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showInactive"
            checked={showInactiveItems}
            onChange={(e) => setShowInactiveItems(e.target.checked)}
            data-testid="checkbox-show-inactive"
          />
          <Label htmlFor="showInactive">Show inactive items</Label>
        </div>

        <Dialog open={showCreateDialog || !!editingItem} onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingItem(null);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-item">
              <Plus className="h-4 w-4 mr-2" />
              Add Inventory Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Inventory Item" : "Create New Inventory Item"}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the inventory item details." : "Add a new item to your inventory."}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="supplierCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Code</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-supplier-code" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barcode (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-barcode" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-category" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="unitOfMeasure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit of Measure</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., kg, pcs, m" data-testid="input-unit-measure" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-supplier">
                            <SelectValue placeholder="Select a supplier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.map((supplier: any) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            value={field.value || ""}
                            data-testid="input-weight"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensions (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 10x20x30 cm" data-testid="input-dimensions" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          data-testid="checkbox-is-active"
                        />
                      </FormControl>
                      <FormLabel>Active Item</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateDialog(false);
                      setEditingItem(null);
                      form.reset();
                    }}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createItemMutation.isPending || updateItemMutation.isPending}
                    data-testid="button-save"
                  >
                    {editingItem ? "Update Item" : "Create Item"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Items Grid */}
      {itemsError || suppliersError ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            Error loading data: {itemsError?.message || suppliersError?.message}
          </p>
          <Button onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["/api/inventory-items"] });
            queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
          }}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(inventoryItems as any[]).map((item: any) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow border border-gray-200 bg-white rounded-xl" data-testid={`card-item-${item.id}`}> 
              <CardHeader className="pb-2 flex flex-row items-center gap-3">
                {/* Avatar or placeholder image */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                  <Boxes className="h-7 w-7 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold text-gray-900 truncate">
                    {item.description}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded">{item.supplierCode}</span>
                    <span className="text-xs text-gray-400">{item.category}</span>
                  </div>
                </div>
                <Badge variant={item.isActive ? "default" : "secondary"} className="ml-2">
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent className="pt-0 pb-2">
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Supplier:</span>
                    <span className="font-medium text-gray-900">{item.supplierName || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Unit:</span>
                    <span>{item.unitOfMeasure}</span>
                  </div>
                  {item.barcode && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Barcode:</span>
                      <span className="font-mono text-blue-700">{item.barcode}</span>
                    </div>
                  )}
                  {item.weight && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Weight:</span>
                      <span>{item.weight} kg</span>
                    </div>
                  )}
                  {item.dimensions && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Dimensions:</span>
                      <span>{item.dimensions}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                    data-testid={`button-edit-${item.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700"
                    data-testid={`button-delete-${item.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {inventoryItems.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
            <p className="text-gray-600 text-center mb-4">
              Get started by adding your first inventory item to the system.
            </p>
            <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-first-item">
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StockLevelsTab() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  // UI enhancements for Total Stock Distribution section
  const [itemSearch, setItemSearch] = useState("");
  const [viewMode, setViewMode] = useState<'bar' | 'compact'>('bar');

  const { data: stockLevels = [], isLoading } = useQuery({
    queryKey: ["/api/inventory-levels", { location: selectedLocation, lowStock: showLowStock }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedLocation) params.append('location', selectedLocation);
      if (showLowStock) params.append('lowStock', 'true');
      
      const url = `/api/inventory-levels${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: true,
  });

  // Fetch inventory items to enrich stock level cards with descriptive data
  const { data: invItems = [] } = useQuery({
    queryKey: ["/api/inventory-items", { basic: true }],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        params.append('isActive', 'true');
        // fetch all; filtering will be client-side for now
        const resp = await fetch(`/api/inventory-items?${params.toString()}`, { credentials: "include" });
        if (!resp.ok) return [];
        return resp.json();
      } catch (e) {
        console.error("Failed to load inventory items for stock status summary", e);
        return [];
      }
    },
    // Always enabled for summary; lightweight list used only for display
    enabled: true,
  });

  // Map for quick lookup by item id
  const inventoryItemMap = useMemo(() => {
    const map: Record<string, any> = {};
    (invItems as any[]).forEach((it: any) => { if (it?.id) map[it.id] = it; });
    return map;
  }, [invItems]);

  const locations = Array.from(new Set((stockLevels as any[]).map((level: any) => level.storageLocation).filter(Boolean)));

  // Category list derived from inventory items for new summary bar chart
  const invCategories = useMemo(() => {
    const set = new Set<string>();
    (invItems as any[]).forEach((it: any) => { if (it?.category) set.add(it.category); });
    return Array.from(set).sort();
  }, [invItems]);

  // Filtered items for bar visualization (totalStock field)
  const filteredInvItems = useMemo(() => {
    const list = Array.isArray(invItems) ? (invItems as any[]) : [];
    return list
      .filter(it => (categoryFilter === 'all' || !categoryFilter) ? true : it.category === categoryFilter)
      .map(it => ({
        id: it.id,
        description: it.description || it.supplierCode || it.id,
        category: it.category || 'Uncategorized',
        totalStock: typeof it.totalStock === 'number' ? it.totalStock : (it.quantityOnHand ?? it.quantity ?? 0),
      }));
  }, [invItems, categoryFilter]);

  const maxTotalStock = useMemo(() => filteredInvItems.reduce((m, it) => it.totalStock > m ? it.totalStock : m, 0), [filteredInvItems]);

  // Derive highest / lowest stock summaries (by available quantity)
  const { highestStock, lowestStock, maxAvailable } = useMemo(() => {
    const levels = Array.isArray(stockLevels) ? [...(stockLevels as any[])] : [];
    if (levels.length === 0) return { highestStock: [], lowestStock: [], maxAvailable: 0 };
    const sortedDesc = [...levels].sort((a, b) => (b.quantityAvailable || 0) - (a.quantityAvailable || 0));
    const sortedAsc = [...levels].sort((a, b) => (a.quantityAvailable || 0) - (b.quantityAvailable || 0));
    const top = sortedDesc.slice(0, 5);
    const bottom = sortedAsc.slice(0, 5);
    const maxAvail = top[0]?.quantityAvailable || 0;
    return { highestStock: top, lowestStock: bottom, maxAvailable: maxAvail };
  }, [stockLevels]);

  return (
    <div className="space-y-6" data-testid="stock-levels-tab">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-48" data-testid="select-location-filter">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showLowStock"
            checked={showLowStock}
            onChange={(e) => setShowLowStock(e.target.checked)}
            data-testid="checkbox-low-stock"
          />
          <Label htmlFor="showLowStock">Show only low stock items</Label>
        </div>

        {/* Category Filter for Total Stock Bar Chart */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-52" data-testid="select-inventory-category-filter">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {invCategories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Global Stock Status Summary */}
      {(highestStock.length > 0 || lowestStock.length > 0) && (
        <Card className="border border-gray-200" data-testid="stock-status-summary">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-600" />
              Stock Status Summary
            </CardTitle>
            <CardDescription className="text-xs">Top and bottom stocked items (by available quantity)</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Highest Stock */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Highest Stock</h4>
                <div className="space-y-2" data-testid="highest-stock-list">
                  {highestStock.map((lvl: any) => {
                    const pct = maxAvailable ? Math.min(100, (lvl.quantityAvailable / maxAvailable) * 100) : 0;
                    const item = inventoryItemMap[lvl.itemId];
                    return (
                      <div key={lvl.id || lvl.itemId} className="space-y-1" data-testid={`highest-stock-item-${lvl.itemId}`}>
                        <div className="flex justify-between text-[10px] text-gray-600 font-medium">
                          <span className="truncate max-w-[140px]" title={item?.description || lvl.itemId}>{item?.description || lvl.itemId}</span>
                          <span className="font-mono text-gray-800">{lvl.quantityAvailable}</span>
                        </div>
                        <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all"
                            style={{ width: pct + '%' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {highestStock.length === 0 && (
                    <div className="text-[10px] text-gray-400 italic">No data</div>
                  )}
                </div>
              </div>
              {/* Lowest Stock */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Lowest Stock</h4>
                <div className="space-y-2" data-testid="lowest-stock-list">
                  {lowestStock.map((lvl: any) => {
                    // Use maxAvailable for consistent scaling across both lists
                    const pct = maxAvailable ? Math.min(100, (lvl.quantityAvailable / maxAvailable) * 100) : 0;
                    const item = inventoryItemMap[lvl.itemId];
                    const isLow = lvl.quantityAvailable < lvl.reorderLevel;
                    return (
                      <div key={lvl.id || lvl.itemId} className="space-y-1" data-testid={`lowest-stock-item-${lvl.itemId}`}>
                        <div className="flex justify-between text-[10px] text-gray-600 font-medium">
                          <span className="truncate max-w-[140px]" title={item?.description || lvl.itemId}>{item?.description || lvl.itemId}</span>
                          <span className={`font-mono ${isLow ? 'text-red-600' : 'text-gray-800'}`}>{lvl.quantityAvailable}</span>
                        </div>
                        <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`absolute left-0 top-0 h-full transition-all ${
                              isLow
                                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                                : 'bg-gradient-to-r from-emerald-500 to-green-600'
                            }`}
                            style={{ width: pct + '%' }}
                          />
                          {/* Reorder marker */}
                          {lvl.reorderLevel > 0 && maxAvailable > 0 && (
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-orange-400/80"
                              style={{ left: `${Math.min(100, (lvl.reorderLevel / maxAvailable) * 100)}%` }}
                              title={`Reorder Level: ${lvl.reorderLevel}`}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {lowestStock.length === 0 && (
                    <div className="text-[10px] text-gray-400 italic">No data</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced: Total Stock Distribution (Inventory Items) */}
      {filteredInvItems.length > 0 && (() => {
        const displayItems = filteredInvItems
          .filter(it => itemSearch ? it.description.toLowerCase().includes(itemSearch.toLowerCase()) : true)
          .sort((a,b) => b.totalStock - a.totalStock);
        const totalItemsCount = filteredInvItems.length;
        const aggregateStock = filteredInvItems.reduce((s,i) => s + (i.totalStock || 0), 0);
        const avgStock = totalItemsCount ? Math.round(aggregateStock / totalItemsCount) : 0;
        return (
          <Card className="border border-gray-200" data-testid="total-stock-distribution">
            <CardHeader className="pb-3 border-b border-gray-100/80 bg-gradient-to-r from-slate-50 to-white rounded-t-lg">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    Total Stock by Item {categoryFilter !== 'all' && (<span className="text-xs font-normal text-gray-500">({categoryFilter})</span>)}
                  </CardTitle>
                  <CardDescription className="text-[11px] mt-0.5">Distribution of total on-hand stock across inventory items. Search, filter or toggle view.</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <div className="relative flex-1 min-w-[160px]">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <Input
                      value={itemSearch}
                      onChange={(e) => setItemSearch(e.target.value)}
                      placeholder="Search items..."
                      className="pl-7 h-8 text-xs"
                      data-testid="input-search-total-stock"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-1 bg-gray-50 rounded-md p-1 border border-gray-200">
                    <Button
                      type="button"
                      variant={viewMode === 'bar' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => setViewMode('bar')}
                      data-testid="button-view-bar"
                      title="Bar view"
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant={viewMode === 'compact' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => setViewMode('compact')}
                      data-testid="button-view-compact"
                      title="Compact list view"
                    >
                      <List className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
              {/* KPI Row */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-3" data-testid="total-stock-kpis">
                <div className="col-span-1 bg-white/70 border border-gray-200 rounded-md px-3 py-2 flex flex-col">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">Items</span>
                  <span className="text-sm font-semibold text-gray-800">{totalItemsCount}</span>
                </div>
                <div className="col-span-1 bg-white/70 border border-gray-200 rounded-md px-3 py-2 flex flex-col">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">Aggregate</span>
                  <span className="text-sm font-semibold text-gray-800" title="Total stock across items">{aggregateStock}</span>
                </div>
                <div className="col-span-1 bg-white/70 border border-gray-200 rounded-md px-3 py-2 flex flex-col">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">Average</span>
                  <span className="text-sm font-semibold text-gray-800">{avgStock}</span>
                </div>
                <div className="col-span-1 bg-white/70 border border-gray-200 rounded-md px-3 py-2 flex flex-col">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">Maximum</span>
                  <span className="text-sm font-semibold text-gray-800">{maxTotalStock}</span>
                </div>
                <div className="col-span-1 bg-white/70 border border-gray-200 rounded-md px-3 py-2 flex flex-col">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">&gt; 70%</span>
                  <span className="text-sm font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text">{displayItems.filter(i => maxTotalStock ? (i.totalStock / maxTotalStock) * 100 >= 70 : false).length}</span>
                </div>
                <div className="col-span-1 bg-white/70 border border-gray-200 rounded-md px-3 py-2 flex flex-col">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">&lt; 40%</span>
                  <span className="text-sm font-semibold text-rose-600">{displayItems.filter(i => maxTotalStock ? (i.totalStock / maxTotalStock) * 100 < 40 : false).length}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              {/* Scrollable list */}
              <div className="max-h-80 overflow-y-auto pr-1 custom-scrollbar" data-testid="total-stock-scroll">
                <div className={viewMode === 'bar' ? 'space-y-3' : 'grid grid-cols-2 md:grid-cols-3 gap-3'}>
                  {displayItems.map(it => {
                    const pct = maxTotalStock ? (it.totalStock / maxTotalStock) * 100 : 0;
                    // Determine color band
                    let barColor = 'from-sky-500 via-blue-500 to-indigo-600';
                    if (pct < 40) barColor = 'from-rose-500 via-red-500 to-orange-500';
                    else if (pct < 70) barColor = 'from-amber-400 via-yellow-400 to-orange-500';
                    if (viewMode === 'compact') {
                      return (
                        <div
                          key={it.id}
                          className="group border border-gray-200 rounded-md px-2 py-2 bg-white hover:shadow-sm transition cursor-default"
                          data-testid={`total-stock-item-${it.id}`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <div className="text-[11px] font-medium text-gray-800 truncate" title={it.description}>{it.description}</div>
                              <div className="text-[10px] text-gray-500">{Math.round(pct)}% of max</div>
                            </div>
                            <div className="text-[11px] font-mono text-gray-700">{it.totalStock}</div>
                          </div>
                          <div className="mt-1 relative h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`absolute left-0 top-0 h-full bg-gradient-to-r ${barColor}`} style={{ width: pct + '%' }} />
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={it.id} className="space-y-1" data-testid={`total-stock-item-${it.id}`}> 
                        <div className="flex justify-between text-[10px] text-gray-600 font-medium">
                          <span className="truncate max-w-[180px]" title={it.description}>{it.description}</span>
                          <span className="font-mono text-gray-800">{it.totalStock}</span>
                        </div>
                        <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden group">
                          <div
                            className={`absolute left-0 top-0 h-full bg-gradient-to-r ${barColor} transition-all`}
                            style={{ width: pct + '%' }}
                          />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[9px] font-medium text-white/90">
                            {Math.round(pct)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {displayItems.length === 0 && (
                    <div className="text-[10px] text-gray-400 italic">No items match search</div>
                  )}
                </div>
              </div>
              {/* Legend */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-gray-500 border-t border-gray-100 pt-3" data-testid="total-stock-legend">
                <div className="flex items-center gap-1"><span className="h-2 w-5 rounded bg-gradient-to-r from-rose-500 to-orange-500" /> <span>&lt; 40%</span></div>
                <div className="flex items-center gap-1"><span className="h-2 w-5 rounded bg-gradient-to-r from-amber-400 to-orange-500" /> <span>40-69%</span></div>
                <div className="flex items-center gap-1"><span className="h-2 w-5 rounded bg-gradient-to-r from-indigo-500 to-blue-500" /> <span>≥ 70%</span></div>
                <div className="ml-auto text-[9px] italic">Relative to max item stock = {maxTotalStock}</div>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Stock Levels Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(stockLevels as any[]).map((level: any) => {
            const isLowStock = level.quantityAvailable < level.reorderLevel;
            
            return (
              <Card key={level.id} className="hover:shadow-md transition-shadow" data-testid={`card-stock-${level.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium">Item: {level.itemId}</CardTitle>
                    {isLowStock && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Low Stock
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs">{level.storageLocation}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">On Hand:</span>
                      <span className="font-medium">{level.quantityOnHand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available:</span>
                      <span className="font-medium text-green-600">{level.quantityAvailable}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reserved:</span>
                      <span className="font-medium text-orange-600">{level.quantityReserved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reorder Level:</span>
                      <span className="font-medium">{level.reorderLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Level:</span>
                      <span className="font-medium">{level.maxLevel}</span>
                    </div>
                  </div>

                  {/* Stock Status Indicator */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Stock Level</span>
                      {isLowStock ? (
                        <span className="text-red-600 flex items-center">
                          <XCircle className="h-3 w-3 mr-1" />
                          Low Stock
                        </span>
                      ) : level.quantityAvailable > level.maxLevel * 0.8 ? (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          High Stock
                        </span>
                      ) : (
                        <span className="text-blue-600 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Normal Stock
                        </span>
                      )}
                    </div>
                    
                    {/* Main Stock Level Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>{level.maxLevel}</span>
                      </div>
                      <div className="relative w-full bg-gray-200 rounded-full h-3">
                        {/* Background markers for reorder level */}
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-orange-400 z-10"
                          style={{ left: `${(level.reorderLevel / level.maxLevel) * 100}%` }}
                          title={`Reorder Level: ${level.reorderLevel}`}
                        />
                        
                        {/* Available stock bar */}
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            isLowStock 
                              ? "bg-gradient-to-r from-red-500 to-red-600" 
                              : level.quantityAvailable > level.maxLevel * 0.8
                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                : "bg-gradient-to-r from-blue-500 to-blue-600"
                          }`}
                          style={{
                            width: `${Math.min((level.quantityAvailable / level.maxLevel) * 100, 100)}%`,
                          }}
                        />
                        
                        {/* Reserved stock overlay */}
                        {level.quantityReserved > 0 && (
                          <div
                            className="absolute top-0 h-3 bg-orange-300 opacity-60 rounded-full"
                            style={{
                              left: `${Math.max(0, ((level.quantityAvailable - level.quantityReserved) / level.maxLevel) * 100)}%`,
                              width: `${Math.min((level.quantityReserved / level.maxLevel) * 100, 100)}%`,
                            }}
                            title={`Reserved: ${level.quantityReserved}`}
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Stock Composition Mini Chart */}
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className="text-center">
                        <div className="h-1 bg-blue-500 rounded mb-1"></div>
                        <span className="text-gray-600">Available</span>
                        <div className="font-medium">{level.quantityAvailable}</div>
                      </div>
                      <div className="text-center">
                        <div className="h-1 bg-orange-300 rounded mb-1"></div>
                        <span className="text-gray-600">Reserved</span>
                        <div className="font-medium">{level.quantityReserved}</div>
                      </div>
                      <div className="text-center">
                        <div className="h-1 bg-gray-300 rounded mb-1"></div>
                        <span className="text-gray-600">Total</span>
                        <div className="font-medium">{level.quantityOnHand}</div>
                      </div>
                    </div>
                    
                    {/* Stock Status Summary */}
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <BarChart3 className="h-3 w-3 text-gray-500" />
                        Stock Status Summary
                      </div>
                      {(() => {
                        const item = inventoryItemMap[level.itemId];
                        if (!item) {
                          return (
                            <div className="text-[10px] text-gray-400 italic" data-testid={`stock-summary-missing-${level.itemId}`}>
                              Item details unavailable
                            </div>
                          );
                        }
                        return (
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] leading-relaxed" data-testid={`stock-summary-${level.itemId}`}>
                            <div className="text-gray-500">Description:</div>
                            <div className="font-medium truncate" title={item.description}>{item.description || '—'}</div>
                            <div className="text-gray-500">Supplier Code:</div>
                            <div className="font-mono text-blue-700">{item.supplierCode || '—'}</div>
                            <div className="text-gray-500">Category:</div>
                            <div>{item.category || '—'}</div>
                            <div className="text-gray-500">Unit:</div>
                            <div>{item.unitOfMeasure || '—'}</div>
                            {item.barcode && (
                              <>
                                <div className="text-gray-500">Barcode:</div>
                                <div className="font-mono" title={item.barcode}>{item.barcode}</div>
                              </>
                            )}
                            <div className="text-gray-500">Active:</div>
                            <div className={item.isActive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                              {item.isActive ? 'Yes' : 'No'}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Fill Rate:</span>
                        <span className="font-medium">
                          {Math.round((level.quantityAvailable / level.maxLevel) * 100)}%
                        </span>
                      </div>
                      {isLowStock && (
                        <div className="mt-1 text-xs text-red-600">
                          Reorder needed: {level.reorderLevel - level.quantityAvailable} units
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GoodsReceiptsTab() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [editingReceipt, setEditingReceipt] = useState<any | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    receiptNumber: "",
    receiptDate: "",
    receivedBy: "",
    status: "Draft",
    notes: "",
  });
  const [editFormData, setEditFormData] = useState({
    receiptNumber: "",
    receiptDate: "",
    receivedBy: "",
    status: "Draft",
    notes: "",
    expectedDeliveryDate: "",
    actualDeliveryDate: "",
    totalItems: 0,
    totalQuantityExpected: 0,
    totalQuantityReceived: 0,
    discrepancyFlag: false,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: goodsReceipts = [], isLoading } = useQuery({
    queryKey: ["/api/goods-receipt-headers", { status: statusFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "all") params.append('status', statusFilter);
      
      const url = `/api/goods-receipt-headers${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error('Failed to fetch goods receipts');
      }
      return response.json();
    },
    enabled: true,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="default" className="bg-green-500">{status}</Badge>;
      case "Partially Received":
        return <Badge variant="secondary" className="bg-yellow-500 text-white">{status}</Badge>;
      case "Draft":
        return <Badge variant="outline">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Helper: derive accent color classes based on status
  const statusAccentClasses = (status: string) => {
    switch (status) {
      case 'Completed': return 'border-l-green-500/70';
      case 'Partially Received': return 'border-l-yellow-500/70';
      case 'Draft': return 'border-l-slate-400/60';
      default: return 'border-l-blue-500/60';
    }
  };

  // Central PDF generator for reuse (row + dialog)
  const generateGoodsReceiptPdf = (r: any) => {
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginX = 40;
      let cursorY = 52;

      // Header branding placeholder
      doc.setFillColor(248,250,252);
      doc.rect(0,0,pageWidth,90,'F');
      doc.setFontSize(20); doc.setTextColor(30,41,59);
      doc.text('GOODS RECEIPT', marginX, cursorY);
      doc.setFontSize(10); doc.setTextColor(100,116,139);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - marginX - 180, cursorY - 14, { align: 'left' });
      cursorY += 30;

      // Meta block columns
      doc.setFontSize(11); doc.setTextColor(30,41,59);
      const col1: string[] = [];
      col1.push(`Receipt #: ${r.receiptNumber || ''}`);
      col1.push(`Status: ${r.status || ''}`);
      col1.push(`Receipt Date: ${r.receiptDate ? new Date(r.receiptDate).toLocaleDateString() : ''}`);
      col1.push(`Received By: ${r.receivedBy || ''}`);
      const col2: string[] = [];
      if (r.supplierLpoId) col2.push(`Supplier LPO: ${r.supplierLpoId}`);
      if (r.supplierId) col2.push(`Supplier ID: ${r.supplierId}`);
      if (r.expectedDeliveryDate) col2.push(`Expected: ${new Date(r.expectedDeliveryDate).toLocaleDateString()}`);
      if (r.actualDeliveryDate) col2.push(`Actual: ${new Date(r.actualDeliveryDate).toLocaleDateString()}`);

      const lineHeight = 14;
      col1.forEach((ln, idx) => doc.text(ln, marginX, cursorY + idx * lineHeight));
      col2.forEach((ln, idx) => doc.text(ln, marginX + 250, cursorY + idx * lineHeight));
      cursorY += Math.max(col1.length, col2.length) * lineHeight + 20;

      // KPI table
      const kpiBody: any[] = [[
        r.totalItems ?? '-',
        r.totalQuantityExpected ?? '-',
        r.totalQuantityReceived ?? '-',
        r.discrepancyFlag ? 'YES' : 'NO'
      ]];
      autoTable(doc, {
        head: [['Items','Expected','Received','Discrepancy']],
        body: kpiBody,
        startY: cursorY,
        styles: { fontSize: 9, halign: 'center' },
        headStyles: { fillColor: [30,41,59] },
        theme: 'grid',
        margin: { left: marginX, right: marginX }
      });
      cursorY = (doc as any).lastAutoTable.finalY + 18;

      // Notes
      if (r.notes) {
        doc.setFontSize(11); doc.setTextColor(30,41,59);
        doc.text('Notes', marginX, cursorY);
        cursorY += 10;
        doc.setFontSize(10); doc.setTextColor(55,65,81);
        const wrapped = doc.splitTextToSize(r.notes, pageWidth - marginX * 2);
        doc.text(wrapped, marginX, cursorY);
        cursorY += wrapped.length * 12 + 10;
      }

      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 40;
      doc.setDrawColor(226,232,240); doc.line(marginX, footerY - 16, pageWidth - marginX, footerY - 16);
      doc.setFontSize(8); doc.setTextColor(100,116,139);
      doc.text('Generated by Golden Tag ERP • Confidential', marginX, footerY - 4);

      doc.save(`goods-receipt-${r.receiptNumber || r.id || 'document'}.pdf`);
      toast({ title: 'Download', description: 'Goods receipt PDF downloaded' });
    } catch (err) {
      console.error('Failed to generate goods receipt PDF', err);
      toast({ title: 'Error', description: 'Failed to generate PDF', variant: 'destructive' });
    }
  };

  // State for selected Supplier LPO ID
  const [selectedLpoId, setSelectedLpoId] = useState("");
  const [editSelectedLpoId, setEditSelectedLpoId] = useState("");
  // Fetch supplier LPOs for dropdown
  const { data: supplierLpos = [] } = useQuery({
    queryKey: ["/api/supplier-lpos"],
    queryFn: async () => {
      const response = await fetch("/api/supplier-lpos");
      if (!response.ok) return [];
      return response.json();
    },
    enabled: showCreateDialog || showEditDialog,
  });

  // Create goods receipt mutation
  const createGoodsReceiptMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/goods-receipt-headers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goods-receipt-headers"] });
      setShowCreateDialog(false);
      setSelectedLpoId("");
      setReceiptFile(null);
      setFormData({
        receiptNumber: "",
        receiptDate: "",
        receivedBy: "",
        status: "Draft",
        notes: "",
      });
      toast({
        title: "Success",
        description: "Goods receipt created successfully",
      });
    },
    onError: (error: any) => {
      console.error("Error creating goods receipt:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create goods receipt",
        variant: "destructive",
      });
    },
  });

  // Update goods receipt mutation
  const updateGoodsReceiptMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PUT", `/api/goods-receipt-headers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goods-receipt-headers"] });
      setShowEditDialog(false);
      setEditingReceipt(null);
      setEditSelectedLpoId("");
      setEditFormData({
        receiptNumber: "",
        receiptDate: "",
        receivedBy: "",
        status: "Draft",
        notes: "",
        expectedDeliveryDate: "",
        actualDeliveryDate: "",
        totalItems: 0,
        totalQuantityExpected: 0,
        totalQuantityReceived: 0,
        discrepancyFlag: false,
      });
      toast({
        title: "Success",
        description: "Goods receipt updated successfully",
      });
    },
    onError: (error: any) => {
      console.error("Error updating goods receipt:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update goods receipt",
        variant: "destructive",
      });
    },
  });

  const handleCreateReceipt = async () => {
    if (!formData.receiptNumber || !selectedLpoId || !formData.receiptDate || !formData.receivedBy) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the selected LPO to extract supplier information
      const selectedLpo = supplierLpos.find((lpo: any) => lpo.id === selectedLpoId);
      if (!selectedLpo) {
        toast({
          title: "Error",
          description: "Selected supplier LPO not found",
          variant: "destructive",
        });
        return;
      }

      console.log("Selected LPO:", selectedLpo);
      console.log("Form Data:", formData);

      const submitData = {
        receiptNumber: formData.receiptNumber,
        supplierLpoId: selectedLpoId,
        supplierId: selectedLpo.supplierId || selectedLpo.supplier?.id,
        receiptDate: formData.receiptDate,
        receivedBy: formData.receivedBy,
        status: formData.status,
        notes: formData.notes || null,
      };

      console.log("Submit Data:", submitData);

      // TODO: Handle file upload separately if needed
      if (receiptFile) {
        console.log("File upload not yet implemented:", receiptFile.name);
      }

      createGoodsReceiptMutation.mutate(submitData);
    } catch (error) {
      console.error("Error preparing goods receipt data:", error);
      toast({
        title: "Error",
        description: "Failed to prepare goods receipt data",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleViewReceipt = (receipt: any) => {
    setSelectedReceipt(receipt);
    setShowViewDialog(true);
  };

  const handleEditReceipt = (receipt: any) => {
    setEditingReceipt(receipt);
    setEditFormData({
      receiptNumber: receipt.receiptNumber,
      receiptDate: receipt.receiptDate,
      receivedBy: receipt.receivedBy,
      status: receipt.status,
      notes: receipt.notes || "",
      expectedDeliveryDate: receipt.expectedDeliveryDate || "",
      actualDeliveryDate: receipt.actualDeliveryDate || "",
      totalItems: typeof receipt.totalItems !== "undefined" ? receipt.totalItems : 0,
      totalQuantityExpected: typeof receipt.totalQuantityExpected !== "undefined" ? receipt.totalQuantityExpected : 0,
      totalQuantityReceived: typeof receipt.totalQuantityReceived !== "undefined" ? receipt.totalQuantityReceived : 0,
      discrepancyFlag: typeof receipt.discrepancyFlag !== "undefined" ? receipt.discrepancyFlag : false,
    });
    setEditSelectedLpoId(receipt.supplierLpoId || "");
    setShowEditDialog(true);
  };

  const handleUpdateReceipt = async () => {
    if (!editFormData.receiptNumber || !editSelectedLpoId || !editFormData.receiptDate || !editFormData.receivedBy) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!editingReceipt) {
      toast({
        title: "Error",
        description: "No receipt selected for editing",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the selected LPO to extract supplier information
      const selectedLpo = supplierLpos.find((lpo: any) => lpo.id === editSelectedLpoId);
      if (!selectedLpo) {
        toast({
          title: "Error",
          description: "Selected supplier LPO not found",
          variant: "destructive",
        });
        return;
      }

      const updateData = {
        receiptNumber: editFormData.receiptNumber,
        supplierLpoId: editSelectedLpoId,
        supplierId: selectedLpo.supplierId || selectedLpo.supplier?.id,
        receiptDate: editFormData.receiptDate,
        receivedBy: editFormData.receivedBy,
        status: editFormData.status,
        notes: editFormData.notes || null,
        expectedDeliveryDate: editFormData.expectedDeliveryDate || editingReceipt.expectedDeliveryDate || null,
        actualDeliveryDate: editFormData.actualDeliveryDate || editingReceipt.actualDeliveryDate || null,
        totalItems: typeof editFormData.totalItems !== 'undefined' ? editFormData.totalItems : (editingReceipt.totalItems || 0),
        totalQuantityExpected: typeof editFormData.totalQuantityExpected !== 'undefined' ? editFormData.totalQuantityExpected : (editingReceipt.totalQuantityExpected || 0),
        totalQuantityReceived: typeof editFormData.totalQuantityReceived !== 'undefined' ? editFormData.totalQuantityReceived : (editingReceipt.totalQuantityReceived || 0),
        discrepancyFlag: typeof editFormData.discrepancyFlag !== 'undefined' ? editFormData.discrepancyFlag : (editingReceipt.discrepancyFlag || false),
      };

      updateGoodsReceiptMutation.mutate({ id: editingReceipt.id, data: updateData });
    } catch (error) {
      console.error("Error preparing goods receipt update data:", error);
      toast({
        title: "Error",
        description: "Failed to prepare goods receipt update data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6" data-testid="goods-receipts-tab">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48" data-testid="select-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Partially Received">Partially Received</SelectItem>
          </SelectContent>
        </Select>

        <Button data-testid="button-create-receipt" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Goods Receipt
        </Button>
      </div>

      {/* New Goods Receipt Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Goods Receipt</DialogTitle>
            <DialogDescription>Enter details for the new goods receipt.</DialogDescription>
          </DialogHeader>
          {/* TODO: Add form fields for goods receipt creation */}
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="receiptNumber">Receipt Number *</Label>
              <Input
                id="receiptNumber"
                placeholder="Enter receipt number"
                value={formData.receiptNumber}
                onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                data-testid="input-receipt-number"
              />
            </div>
            
            <div>
              <Label htmlFor="supplierLpo">Supplier LPO *</Label>
              {/* Supplier LPO Dropdown */}
              <Select value={selectedLpoId} onValueChange={setSelectedLpoId}>
                <SelectTrigger data-testid="select-supplier-lpo">
                  <SelectValue placeholder="Select Supplier LPO" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(supplierLpos) && supplierLpos.map((lpo: any) => (
                    <SelectItem key={lpo.id} value={lpo.id}>
                      {lpo.lpoNumber} - {lpo.supplier?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="receiptDate">Receipt Date *</Label>
              <Input
                id="receiptDate"
                type="date"
                value={formData.receiptDate}
                onChange={(e) => setFormData({ ...formData, receiptDate: e.target.value })}
                data-testid="input-receipt-date"
              />
            </div>
            
            <div>
              <Label htmlFor="receivedBy">Received By *</Label>
              <Input
                id="receivedBy"
                placeholder="Enter name of person who received"
                value={formData.receivedBy}
                onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                data-testid="input-received-by"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Partially Received">Partially Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="receiptFile">Receipt Document (Optional)</Label>
              <Input
                id="receiptFile"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileChange}
                data-testid="input-receipt-file"
                className="cursor-pointer"
              />
              {receiptFile && (
                <div className="text-sm text-gray-600 mt-1">
                  Selected: {receiptFile.name}
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about the receipt"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                data-testid="textarea-notes"
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateDialog(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateReceipt}
                disabled={createGoodsReceiptMutation.isPending}
                data-testid="button-create-receipt"
              >
                {createGoodsReceiptMutation.isPending ? "Creating..." : "Create Receipt"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Goods Receipt Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between w-full">
              <span>Goods Receipt Details</span>
              {selectedReceipt && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => {
                    try {
                      const r = selectedReceipt;
                      const doc = new jsPDF();
                      // Title
                      doc.setFontSize(16);
                      doc.text('GOODS RECEIPT', 14, 18);
                      doc.setFontSize(10);
                      // Basic info block
                      const leftYStart = 30;
                      doc.text(`Receipt #: ${r.receiptNumber || ''}`, 14, leftYStart);
                      doc.text(`Status: ${r.status || ''}`, 14, leftYStart + 6);
                      doc.text(`Receipt Date: ${r.receiptDate ? new Date(r.receiptDate).toLocaleDateString() : ''}`, 14, leftYStart + 12);
                      doc.text(`Received By: ${r.receivedBy || ''}`, 14, leftYStart + 18);
                      if (r.supplierLpoId) doc.text(`Supplier LPO ID: ${r.supplierLpoId}`, 14, leftYStart + 24);
                      if (r.supplierId) doc.text(`Supplier ID: ${r.supplierId}`, 14, leftYStart + 30);
                      if (typeof r.totalItems !== 'undefined') doc.text(`Total Items: ${r.totalItems}`, 14, leftYStart + 36);
                      if (typeof r.totalQuantityExpected !== 'undefined') doc.text(`Qty Expected: ${r.totalQuantityExpected}`, 14, leftYStart + 42);
                      if (typeof r.totalQuantityReceived !== 'undefined') doc.text(`Qty Received: ${r.totalQuantityReceived}`, 14, leftYStart + 48);
                      if (r.discrepancyFlag) doc.text('Discrepancy: YES', 14, leftYStart + 54);
                      // Notes (wrap simple)
                      if (r.notes) {
                        const notes = doc.splitTextToSize(`Notes: ${r.notes}`, 180);
                        doc.text(notes, 14, leftYStart + 62);
                      }
                      // Footer
                      doc.setFontSize(8);
                      doc.text('Generated by ERP System', 14, 285);
                      doc.save(`goods-receipt-${r.receiptNumber || r.id || 'document'}.pdf`);
                      toast({ title: 'Download', description: 'Goods receipt PDF downloaded' });
                    } catch (err) {
                      console.error('Failed to generate goods receipt PDF', err);
                      toast({ title: 'Error', description: 'Failed to generate PDF', variant: 'destructive' });
                    }
                  }}
                  data-testid="button-download-goods-receipt"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedReceipt ? `Receipt #${selectedReceipt.receiptNumber}` : "Loading..."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReceipt && (
            <div className="space-y-6">
              {/* Enhanced Header Information */}
              <div className="rounded-xl border bg-gradient-to-br from-slate-50 via-white to-slate-100 p-5 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left Primary Info */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold flex items-center gap-1">Receipt</div>
                        <div className="mt-1 font-mono text-base font-semibold text-slate-800">{selectedReceipt.receiptNumber}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Receipt Date</div>
                        <div className="mt-1 text-sm font-medium text-slate-700">{new Date(selectedReceipt.receiptDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Received By</div>
                        <div className="mt-1 text-sm font-medium text-slate-700">{selectedReceipt.receivedBy}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Status</div>
                        <div className="mt-1">{getStatusBadge(selectedReceipt.status)}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Supplier LPO</div>
                        <div className="mt-1 text-sm font-medium text-slate-700">{selectedReceipt.supplierLpoId || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Supplier</div>
                        <div className="mt-1 text-sm font-medium text-slate-700">{selectedReceipt.supplierId || 'N/A'}</div>
                      </div>
                      {selectedReceipt.expectedDeliveryDate && (
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Expected Delivery</div>
                          <div className="mt-1 text-sm font-medium text-slate-700">{new Date(selectedReceipt.expectedDeliveryDate).toLocaleDateString()}</div>
                        </div>
                      )}
                      {selectedReceipt.actualDeliveryDate && (
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Actual Delivery</div>
                          <div className="mt-1 text-sm font-medium text-slate-700">{new Date(selectedReceipt.actualDeliveryDate).toLocaleDateString()}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Right Summary Pills */}
                  <div className="flex flex-col gap-3 min-w-[210px]">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-white border p-3 text-center shadow-sm">
                        <div className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">Items</div>
                        <div className="mt-1 text-lg font-bold text-slate-800">{selectedReceipt.totalItems ?? '-'}</div>
                      </div>
                      <div className="rounded-lg bg-white border p-3 text-center shadow-sm">
                        <div className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">Expected</div>
                        <div className="mt-1 text-lg font-bold text-slate-800">{selectedReceipt.totalQuantityExpected ?? '-'}</div>
                      </div>
                      <div className="rounded-lg bg-white border p-3 text-center shadow-sm">
                        <div className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">Received</div>
                        <div className="mt-1 text-lg font-bold text-green-600">{selectedReceipt.totalQuantityReceived ?? '-'}</div>
                      </div>
                    </div>
                    {selectedReceipt.discrepancyFlag && (
                      <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800 text-xs font-medium">
                        <AlertTriangle className="h-4 w-4" /> Discrepancy Detected
                      </div>
                    )}
                    <div className="mt-1 text-[10px] text-slate-400 text-right">Generated: {selectedReceipt.createdAt ? new Date(selectedReceipt.createdAt).toLocaleDateString() : '—'}</div>
                  </div>
                </div>
              </div>

              {/* Quantity Summary */}
              {(selectedReceipt.totalItems || selectedReceipt.totalQuantityExpected || selectedReceipt.totalQuantityReceived) && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium mb-3">Quantity Summary</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedReceipt.totalItems !== undefined && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Total Items</Label>
                        <div className="mt-1 text-lg font-semibold">{selectedReceipt.totalItems}</div>
                      </div>
                    )}
                    {selectedReceipt.totalQuantityExpected !== undefined && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Expected Quantity</Label>
                        <div className="mt-1 text-lg font-semibold">{selectedReceipt.totalQuantityExpected}</div>
                      </div>
                    )}
                    {selectedReceipt.totalQuantityReceived !== undefined && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Received Quantity</Label>
                        <div className="mt-1 text-lg font-semibold text-green-600">{selectedReceipt.totalQuantityReceived}</div>
                      </div>
                    )}
                  </div>
                  {selectedReceipt.discrepancyFlag && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center text-yellow-800">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Discrepancy Detected</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {selectedReceipt.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Notes</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded border text-sm">
                    {selectedReceipt.notes}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Created At</Label>
                    <div className="mt-1">
                      {selectedReceipt.createdAt ? new Date(selectedReceipt.createdAt).toLocaleString() : "N/A"}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Updated At</Label>
                    <div className="mt-1">
                      {selectedReceipt.updatedAt ? new Date(selectedReceipt.updatedAt).toLocaleString() : "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowViewDialog(false)}
                  data-testid="button-close-view"
                >
                  Close
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowViewDialog(false);
                    handleEditReceipt(selectedReceipt);
                  }}
                  data-testid="button-edit-receipt"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Goods Receipt Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Goods Receipt</DialogTitle>
            <DialogDescription>
              {editingReceipt ? `Edit receipt #${editingReceipt.receiptNumber}` : "Loading..."}
            </DialogDescription>
          </DialogHeader>
          
          {editingReceipt && (
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="editReceiptNumber">Receipt Number *</Label>
                <Input
                  id="editReceiptNumber"
                  placeholder="Enter receipt number"
                  value={editFormData.receiptNumber}
                  onChange={(e) => setEditFormData({ ...editFormData, receiptNumber: e.target.value })}
                  data-testid="input-edit-receipt-number"
                />
              </div>
              
              <div>
                <Label htmlFor="editSupplierLpo">Supplier LPO *</Label>
                <Select value={editSelectedLpoId} onValueChange={setEditSelectedLpoId}>
                  <SelectTrigger data-testid="select-edit-supplier-lpo">
                    <SelectValue placeholder="Select Supplier LPO" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(supplierLpos) && supplierLpos.map((lpo: any) => (
                      <SelectItem key={lpo.id} value={lpo.id}>
                        {lpo.lpoNumber} - {lpo.supplier?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="editReceiptDate">Receipt Date *</Label>
                <Input
                  id="editReceiptDate"
                  type="date"
                  value={editFormData.receiptDate}
                  onChange={(e) => setEditFormData({ ...editFormData, receiptDate: e.target.value })}
                  data-testid="input-edit-receipt-date"
                />
              </div>
              
              <div>
                <Label htmlFor="editReceivedBy">Received By *</Label>
                <Input
                  id="editReceivedBy"
                  placeholder="Enter name of person who received"
                  value={editFormData.receivedBy}
                  onChange={(e) => setEditFormData({ ...editFormData, receivedBy: e.target.value })}
                  data-testid="input-edit-received-by"
                />
              </div>
              
              <div>
                <Label htmlFor="editStatus">Status</Label>
                <Select 
                  value={editFormData.status} 
                  onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
                >
                  <SelectTrigger data-testid="select-edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Partially Received">Partially Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="editNotes">Notes (Optional)</Label>
                <Textarea
                  id="editNotes"
                  placeholder="Additional notes about the receipt"
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  data-testid="textarea-edit-notes"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowEditDialog(false);
                    setEditingReceipt(null);
                    setEditSelectedLpoId("");
                    setEditFormData({
                      receiptNumber: "",
                      receiptDate: "",
                      receivedBy: "",
                      status: "Draft",
                      notes: "",
                      expectedDeliveryDate: "",
                      actualDeliveryDate: "",
                      totalItems: 0,
                      totalQuantityExpected: 0,
                      totalQuantityReceived: 0,
                      discrepancyFlag: false,
                    });
                  }}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateReceipt}
                  disabled={updateGoodsReceiptMutation.isPending}
                  data-testid="button-update-receipt"
                >
                  {updateGoodsReceiptMutation.isPending ? "Updating..." : "Update Receipt"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Goods Receipts List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {goodsReceipts.map((receipt: GoodsReceiptHeader) => {
            const hasMetrics = typeof receipt.totalItems !== 'undefined' || typeof receipt.totalQuantityExpected !== 'undefined' || typeof receipt.totalQuantityReceived !== 'undefined';
            return (
              <Card 
                key={receipt.id} 
                className={`hover:shadow-md transition-shadow border-l-4 ${statusAccentClasses(receipt.status)} bg-white/90 backdrop-blur-sm`} 
                data-testid={`card-receipt-${receipt.id}`}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Left info block */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-slate-700">{receipt.receiptNumber}</span>
                        {getStatusBadge(receipt.status)}
                        {receipt.discrepancyFlag && (
                          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-amber-100 text-amber-700 border border-amber-200">
                            <AlertTriangle className="h-3 w-3" /> Discrepancy
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-xs text-slate-600">
                        <div>
                          <span className="block font-medium text-[11px] uppercase tracking-wide text-slate-500">Date</span>
                          <span className="mt-0.5 block text-slate-700">{new Date(receipt.receiptDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="block font-medium text-[11px] uppercase tracking-wide text-slate-500">Received By</span>
                          <span className="mt-0.5 block text-slate-700">{receipt.receivedBy}</span>
                        </div>
                        {receipt.supplierLpoId && (
                          <div>
                            <span className="block font-medium text-[11px] uppercase tracking-wide text-slate-500">Supplier LPO</span>
                            <span className="mt-0.5 block text-slate-700">{receipt.supplierLpoId}</span>
                          </div>
                        )}
                        {receipt.supplierId && (
                          <div>
                            <span className="block font-medium text-[11px] uppercase tracking-wide text-slate-500">Supplier</span>
                            <span className="mt-0.5 block text-slate-700">{receipt.supplierId}</span>
                          </div>
                        )}
                      </div>
                      {receipt.notes && (
                        <div className="text-xs text-slate-600 line-clamp-2">
                          <span className="font-medium text-slate-500">Notes: </span>{receipt.notes}
                        </div>
                      )}
                      {hasMetrics && (
                        <div className="flex flex-wrap gap-3 pt-1">
                          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium text-slate-700">Items: <span className="font-semibold">{receipt.totalItems ?? '-'}</span></div>
                          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium text-slate-700">Expected: <span className="font-semibold">{receipt.totalQuantityExpected ?? '-'}</span></div>
                          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium text-slate-700">Received: <span className="font-semibold text-green-600">{receipt.totalQuantityReceived ?? '-'}</span></div>
                        </div>
                      )}
                    </div>
                    {/* Right actions */}
                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewReceipt(receipt)}
                          data-testid={`button-view-receipt-${receipt.id}`}
                        >
                          <FileText className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateGoodsReceiptPdf(receipt)}
                          data-testid={`button-download-receipt-${receipt.id}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-[10px] text-slate-400">Updated {receipt.updatedAt ? new Date(receipt.updatedAt).toLocaleDateString() : new Date(receipt.receiptDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {goodsReceipts.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Truck className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goods receipts found</h3>
            <p className="text-gray-600 text-center mb-4">
              Goods receipts will appear here when you receive items from suppliers.
            </p>
            <Button data-testid="button-create-first-receipt" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Receipt
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SupplierReturnsTab() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: supplierReturns = [], isLoading } = useQuery({
    queryKey: ["/api/supplier-returns", { status: statusFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "all") params.append('status', statusFilter);
      
      const url = `/api/supplier-returns${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: true,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="success">{status}</Badge>;
      case "Approved":
        return <Badge variant="default">{status}</Badge>;
      case "Pending":
        return <Badge variant="warning">{status}</Badge>;
      case "Draft":
        return <Badge variant="outline">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // State for create dialog and form
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    returnNumber: "",
    supplierId: "",
    returnDate: "",
    reason: "",
    status: "Draft",
    totalAmount: 0,
    notes: "",
  });

  // Fetch suppliers for dropdown
  const { data: suppliers = [] } = useQuery({
    queryKey: ["/api/suppliers"],
    queryFn: async () => {
      const response = await fetch("/api/suppliers");
      if (!response.ok) return [];
      return response.json();
    },
    enabled: showCreateDialog,
  });

  // Mutation for creating supplier return
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createSupplierReturnMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/supplier-returns", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supplier-returns"] });
      setShowCreateDialog(false);
      setFormData({
        returnNumber: "",
        supplierId: "",
        returnDate: "",
        reason: "",
        status: "Draft",
        totalAmount: 0,
        notes: "",
      });
      toast({ title: "Success", description: "Supplier return created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Handler for submit
  const handleCreateReturn = () => {
    if (!formData.returnNumber || !formData.supplierId || !formData.returnDate || !formData.reason || formData.totalAmount <= 0) {
      toast({ title: "Error", description: "Please fill in all required fields and total amount must be positive", variant: "destructive" });
      return;
    }
    createSupplierReturnMutation.mutate(formData);
  };

  return (
    <div className="space-y-6" data-testid="supplier-returns-tab">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48" data-testid="select-return-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Button data-testid="button-create-return" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Supplier Return
        </Button>
      </div>

      {/* Create Supplier Return Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Supplier Return</DialogTitle>
            <DialogDescription>Enter details for the new supplier return.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="returnNumber">Return Number *</Label>
              <Input
                id="returnNumber"
                placeholder="Enter return number"
                value={formData.returnNumber}
                onChange={(e) => setFormData({ ...formData, returnNumber: e.target.value })}
                data-testid="input-return-number"
              />
            </div>
            <div>
              <Label htmlFor="supplier">Supplier *</Label>
              <Select value={formData.supplierId} onValueChange={(value) => setFormData({ ...formData, supplierId: value })}>
                <SelectTrigger data-testid="select-supplier">
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(suppliers) && suppliers.map((supplier: any) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="returnDate">Return Date *</Label>
              <Input
                id="returnDate"
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                data-testid="input-return-date"
              />
            </div>
            <div>
              <Label htmlFor="reason">Return Reason *</Label>
              <Input
                id="reason"
                placeholder="Enter reason for return"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                data-testid="input-return-reason"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger data-testid="select-return-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="totalAmount">Total Amount *</Label>
              <Input
                id="totalAmount"
                type="number"
                min={0}
                step={0.01}
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })}
                data-testid="input-total-amount"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about the return"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                data-testid="textarea-return-notes"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateDialog(false)}
                data-testid="button-cancel-create-return"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateReturn}
                disabled={createSupplierReturnMutation.isPending}
                data-testid="button-create-return"
              >
                {createSupplierReturnMutation.isPending ? "Creating..." : "Create Return"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ...existing code for Supplier Returns List... */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {(supplierReturns as any[]).map((supplierReturn: any) => (
            <Card key={supplierReturn.id} className="hover:shadow-md transition-shadow" data-testid={`card-return-${supplierReturn.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium">{supplierReturn.returnNumber}</h3>
                      {getStatusBadge(supplierReturn.status)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Return Date: {new Date(supplierReturn.returnDate).toLocaleDateString()}</div>
                      <div>Reason: {supplierReturn.reason}</div>
                      <div>Total Amount: ${supplierReturn.totalAmount.toFixed(2)}</div>
                      {supplierReturn.notes && <div>Notes: {supplierReturn.notes}</div>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" data-testid={`button-view-return-${supplierReturn.id}`}>
                      <FileText className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" data-testid={`button-edit-return-${supplierReturn.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(supplierReturns as any[]).length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Truck className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No supplier returns found</h3>
            <p className="text-gray-600 text-center mb-4">
              Supplier returns will appear here when you need to return items to suppliers.
            </p>
            <Button data-testid="button-create-first-return" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Return
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StockMovementsTab() {
  const [movementTypeFilter, setMovementTypeFilter] = useState("all");

  const { data: stockMovements = [], isLoading } = useQuery({
    queryKey: ["/api/stock-movements", { movementType: movementTypeFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (movementTypeFilter && movementTypeFilter !== "all") params.append('movementType', movementTypeFilter);
      
      const url = `/api/stock-movements${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: true,
  });

  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case "Receipt":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case "Issue":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case "Transfer":
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case "Adjustment":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6" data-testid="stock-movements-tab">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={movementTypeFilter} onValueChange={setMovementTypeFilter}>
          <SelectTrigger className="w-48" data-testid="select-movement-type-filter">
            <SelectValue placeholder="Filter by movement type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Movement Types</SelectItem>
            <SelectItem value="Receipt">Receipt</SelectItem>
            <SelectItem value="Issue">Issue</SelectItem>
            <SelectItem value="Transfer">Transfer</SelectItem>
            <SelectItem value="Adjustment">Adjustment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stock Movements List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {(stockMovements as any[]).map((movement: any) => (
            <Card key={movement.id} className="hover:shadow-md transition-shadow" data-testid={`card-movement-${movement.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getMovementTypeIcon(movement.movementType)}
                    <div>
                      <div className="font-medium text-sm">
                        {movement.movementType} - Item: {movement.itemId}
                      </div>
                      <div className="text-xs text-gray-600">
                        {movement.storageLocation} • {movement.createdAt ? new Date(movement.createdAt).toLocaleString() : 'Unknown date'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      Qty: {movement.quantityMoved}
                    </div>
                    <div className="text-xs text-gray-600">
                      {movement.quantityBefore} → {movement.quantityAfter}
                    </div>
                  </div>
                </div>
                
                {movement.notes && (
                  <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    {movement.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(stockMovements as any[]).length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <History className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stock movements found</h3>
            <p className="text-gray-600 text-center">
              Stock movements will appear here when inventory levels change.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function InventoryManagementPage() {
  return (
    <div className="container mx-auto py-6" data-testid="inventory-management-page">
      <div className="mb-6">
        {/* Enhanced Card-style header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 relative overflow-hidden px-8 py-8">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-48 h-24 bg-gradient-to-bl from-blue-50/50 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-16 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-tr-full"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg border border-blue-100">
              <Boxes className="h-12 w-12 text-white" aria-label="Inventory Management Icon" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">Inventory Management</h1>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                  Step 8
                </span>
                <span className="text-gray-600 text-sm font-medium">Monitor stock levels and manage inventory with barcode tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="items" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="items" data-testid="tab-items">
            <Package className="h-4 w-4 mr-2" />
            Items
          </TabsTrigger>
          <TabsTrigger value="stock" data-testid="tab-stock">
            <BarChart3 className="h-4 w-4 mr-2" />
            Stock Levels
          </TabsTrigger>
          <TabsTrigger value="receipts" data-testid="tab-receipts">
            <Truck className="h-4 w-4 mr-2" />
            Goods Receipts
          </TabsTrigger>
          <TabsTrigger value="returns" data-testid="tab-returns">
            <FileText className="h-4 w-4 mr-2" />
            Supplier Returns
          </TabsTrigger>
          <TabsTrigger value="movements" data-testid="tab-movements">
            <History className="h-4 w-4 mr-2" />
            Stock Movements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <InventoryItemsTab />
        </TabsContent>

        <TabsContent value="stock">
          <StockLevelsTab />
        </TabsContent>

        <TabsContent value="receipts">
          <GoodsReceiptsTab />
        </TabsContent>

        <TabsContent value="returns">
          <SupplierReturnsTab />
        </TabsContent>

        <TabsContent value="movements">
          <StockMovementsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}