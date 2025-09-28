import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Package, Calculator } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const quotationItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  costPrice: z.number().min(0, "Cost price must be positive"),
  markup: z.number().min(0, "Markup must be positive"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  notes: z.string().optional(),
});

type QuotationItemFormData = z.infer<typeof quotationItemSchema>;

interface QuotationItemsManagerProps {
  quotationId: string;
  customerType: "Retail" | "Wholesale";
  editable?: boolean;
}

interface QuotationItem {
  id: string;
  quotationId: string;
  description: string;
  quantity: number;
  costPrice: string;
  markup: string;
  unitPrice: string;
  lineTotal: string;
  notes?: string;
  isAccepted: boolean;
  rejectionReason?: string;
}

export default function QuotationItemsManager({ 
  quotationId, 
  customerType, 
  editable = true 
}: QuotationItemsManagerProps) {
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<QuotationItem | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  // Role-based permission: client user (id: 'client') is view-only
  const authUser = (window as any).authUser || null;
  const isClientViewOnly = authUser?.id === "client";

  const { data: itemsResponse, isLoading } = useQuery({
    queryKey: ["/api/quotations", quotationId, "items"],
    queryFn: async () => {
      const response = await fetch(`/api/quotations/${quotationId}/items`);
      if (!response.ok) throw new Error("Failed to fetch items");
      return response.json();
    },
  });

  // Ensure items is always an array
  const items = Array.isArray(itemsResponse) ? itemsResponse : [];

  const form = useForm<QuotationItemFormData>({
    resolver: zodResolver(quotationItemSchema),
    defaultValues: {
      quantity: 1,
      costPrice: 0,
      markup: customerType === "Retail" ? 70 : 40,
      unitPrice: 0,
    },
  });

  // Watch cost price and markup to calculate unit price
  const costPrice = form.watch("costPrice") || 0;
  const markup = form.watch("markup") || 0;
  const quantity = form.watch("quantity") || 1;
  
  // Calculate unit price based on cost and markup
  const calculatedUnitPrice = costPrice * (1 + markup / 100);
  const lineTotal = calculatedUnitPrice * quantity;

  // Update unit price when cost or markup changes
  const handleCostOrMarkupChange = () => {
    form.setValue("unitPrice", calculatedUnitPrice);
  };

  const createItem = useMutation({
    mutationFn: async (data: QuotationItemFormData) => {
  if (isClientViewOnly) throw new Error("Client user cannot perform any changes");
      const response = await fetch(`/api/quotations/${quotationId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          lineTotal: (data.unitPrice * data.quantity).toFixed(2),
        }),
      });
      if (!response.ok) throw new Error("Failed to create item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotations", quotationId, "items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotations", quotationId] });
      toast({
        title: "Success",
        description: "Item added successfully",
      });
      setShowAddItem(false);
      form.reset({
        quantity: 1,
        costPrice: 0,
        markup: customerType === "Retail" ? 70 : 40,
        unitPrice: 0,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<QuotationItemFormData> }) => {
  if (isClientViewOnly) throw new Error("Client user cannot perform any changes");
      const response = await fetch(`/api/quotation-items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          lineTotal: data.unitPrice && data.quantity 
            ? (data.unitPrice * data.quantity).toFixed(2) 
            : undefined,
        }),
      });
      if (!response.ok) throw new Error("Failed to update item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotations", quotationId, "items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotations", quotationId] });
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      setEditingItem(null);
      form.reset({
        quantity: 1,
        costPrice: 0,
        markup: customerType === "Retail" ? 70 : 40,
        unitPrice: 0,
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

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      if (isClientViewOnly) throw new Error("You do not have permission to delete this");
      const response = await fetch(`/api/quotation-items/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotations", quotationId, "items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotations", quotationId] });
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message === "You do not have permission to delete this"
          ? "You do not have permission to delete this"
          : "Failed to delete item",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: QuotationItemFormData) => {
    if (editingItem) {
      updateItem.mutate({ id: editingItem.id, data });
    } else {
      createItem.mutate(data);
    }
  };

  const handleEdit = (item: QuotationItem) => {
    setEditingItem(item);
    form.reset({
      description: item.description,
      quantity: item.quantity,
      costPrice: parseFloat(item.costPrice),
      markup: parseFloat(item.markup),
      unitPrice: parseFloat(item.unitPrice),
      notes: item.notes || "",
    });
    setShowAddItem(true);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setShowAddItem(false);
    form.reset({
      quantity: 1,
      costPrice: 0,
      markup: customerType === "Retail" ? 70 : 40,
      unitPrice: 0,
    });
  };

  // Calculate total amount with safety check
  const totalAmount = Array.isArray(items) && items.length > 0 
    ? items.reduce((sum: number, item: QuotationItem) => 
        sum + parseFloat(item.lineTotal || "0"), 0
      )
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Quotation Items
          </CardTitle>
          {editable && !isClientViewOnly && (
            <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  onClick={() => setShowAddItem(true)}
                  data-testid="button-add-item"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Edit Item" : "Add New Item"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Item description..."
                              {...field}
                              data-testid="input-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(parseInt(e.target.value) || 1);
                                }}
                                data-testid="input-quantity"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="costPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cost Price *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0;
                                  field.onChange(value);
                                  handleCostOrMarkupChange();
                                }}
                                data-testid="input-cost-price"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="markup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Markup % *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    field.onChange(value);
                                    handleCostOrMarkupChange();
                                  }}
                                  data-testid="input-markup"
                                />
                                <span className="absolute right-3 top-3 text-gray-500">%</span>
                              </div>
                            </FormControl>
                            <FormMessage />
                            <div className="text-xs text-gray-600">
                              Default: {customerType} markup ({customerType === "Retail" ? "70" : "40"}%)
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="unitPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit Price *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                data-testid="input-unit-price"
                              />
                            </FormControl>
                            <FormMessage />
                            <div className="text-xs text-gray-600">
                              Calculated: ${calculatedUnitPrice.toFixed(2)}
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Pricing Calculation</span>
                      </div>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div>Cost Price: ${costPrice.toFixed(2)}</div>
                        <div>Markup: {markup}% = ${(costPrice * markup / 100).toFixed(2)}</div>
                        <div className="font-medium border-t border-blue-200 pt-1">
                          Unit Price: ${calculatedUnitPrice.toFixed(2)}
                        </div>
                        <div className="font-medium">
                          Line Total ({quantity} × ${calculatedUnitPrice.toFixed(2)}): ${lineTotal.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Additional notes..."
                              {...field}
                              data-testid="input-notes"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createItem.isPending || updateItem.isPending}
                        data-testid="button-save-item"
                      >
                        {editingItem ? "Update" : "Add"} Item
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading items...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {editable ? (
              <>
                No items added yet. Click "Add Item" to get started.
                <div className="mt-4">
                  <Button 
                    onClick={() => setShowAddItem(true)}
                    variant="outline"
                    data-testid="button-add-first-item"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Item
                  </Button>
                </div>
              </>
            ) : (
              "No items found for this quotation."
            )}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-16">Qty</TableHead>
                  <TableHead className="w-24">Cost</TableHead>
                  <TableHead className="w-20">Markup</TableHead>
                  <TableHead className="w-24">Unit Price</TableHead>
                  <TableHead className="w-24">Line Total</TableHead>
                  <TableHead className="w-20">Status</TableHead>
                  {editable && <TableHead className="w-20">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: QuotationItem) => (
                  <TableRow key={item.id} data-testid={`row-item-${item.id}`}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.description}</p>
                        {item.notes && (
                          <p className="text-sm text-muted-foreground">{item.notes}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell data-testid={`text-quantity-${item.id}`}>
                      {item.quantity}
                    </TableCell>
                    <TableCell data-testid={`text-cost-${item.id}`}>
                      ${parseFloat(item.costPrice).toFixed(2)}
                    </TableCell>
                    <TableCell data-testid={`text-markup-${item.id}`}>
                      {parseFloat(item.markup).toFixed(1)}%
                    </TableCell>
                    <TableCell data-testid={`text-unit-price-${item.id}`}>
                      ${parseFloat(item.unitPrice).toFixed(2)}
                    </TableCell>
                    <TableCell data-testid={`text-line-total-${item.id}`}>
                      ${parseFloat(item.lineTotal).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.isAccepted ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {item.isAccepted ? "Accepted" : "Rejected"}
                      </Badge>
                    </TableCell>
                    {editable && (
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            data-testid={`button-edit-${item.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteItem.mutate(item.id)}
                            disabled={deleteItem.isPending}
                            data-testid={`button-delete-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {items.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Amount:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
