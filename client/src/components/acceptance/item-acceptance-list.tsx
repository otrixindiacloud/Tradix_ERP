import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Package, AlertTriangle } from "lucide-react";
import type { QuotationItem } from "@shared/schema";

interface ItemAcceptanceListProps {
  quotationItems: QuotationItem[];
  selectedItems: Record<string, { accepted: boolean; quantity: number; notes?: string }>;
  onItemChange: (items: Record<string, { accepted: boolean; quantity: number; notes?: string }>) => void;
}

export function ItemAcceptanceList({ 
  quotationItems, 
  selectedItems, 
  onItemChange 
}: ItemAcceptanceListProps) {
  const handleItemToggle = (itemId: string, accepted: boolean) => {
    const item = quotationItems.find(qi => qi.id === itemId);
    if (!item) return;

    onItemChange({
      ...selectedItems,
      [itemId]: {
        accepted,
        quantity: accepted ? item.quantity : 0,
        notes: selectedItems[itemId]?.notes || "",
      },
    });
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = quotationItems.find(qi => qi.id === itemId);
    if (!item) return;

    const maxQuantity = item.quantity;
    const validQuantity = Math.min(Math.max(0, quantity), maxQuantity);

    onItemChange({
      ...selectedItems,
      [itemId]: {
        ...selectedItems[itemId],
        quantity: validQuantity,
        accepted: validQuantity > 0,
      },
    });
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    onItemChange({
      ...selectedItems,
      [itemId]: {
        ...selectedItems[itemId],
        notes,
      },
    });
  };

  const totalAcceptedItems = Object.values(selectedItems).filter(item => item.accepted).length;
  const totalAcceptedValue = quotationItems
    .filter(item => selectedItems[item.id]?.accepted)
    .reduce((total, item) => {
      const acceptedQuantity = selectedItems[item.id]?.quantity || 0;
      return total + (acceptedQuantity * Number(item.unitPrice));
    }, 0);

  if (quotationItems.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No Items</h3>
            <p className="mt-1 text-sm text-gray-500">
              This quotation doesn't have any items to accept.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{totalAcceptedItems}</p>
              <p className="text-sm text-blue-700">Items Selected</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{quotationItems.length}</p>
              <p className="text-sm text-blue-700">Total Items</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">${totalAcceptedValue.toFixed(2)}</p>
              <p className="text-sm text-blue-700">Accepted Value</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const allSelected = quotationItems.reduce((acc, item) => {
              acc[item.id] = {
                accepted: true,
                quantity: item.quantity,
                notes: selectedItems[item.id]?.notes || "",
              };
              return acc;
            }, {} as Record<string, { accepted: boolean; quantity: number; notes?: string }>);
            onItemChange(allSelected);
          }}
          data-testid="button-select-all"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Select All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onItemChange({})}
          data-testid="button-clear-all"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>

      {/* Items List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Quotation Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quotationItems.map((item, index) => {
            const isSelected = selectedItems[item.id]?.accepted || false;
            const selectedQuantity = selectedItems[item.id]?.quantity || 0;
            const itemNotes = selectedItems[item.id]?.notes || "";
            const lineTotal = selectedQuantity * Number(item.unitPrice);

            return (
              <div key={item.id} className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleItemToggle(item.id, !!checked)}
                    data-testid={`checkbox-item-${index}`}
                  />
                  
                  <div className="flex-1 space-y-3">
                    {/* Item Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Label 
                          htmlFor={`item-${item.id}`}
                          className="text-base font-medium cursor-pointer"
                        >
                          {item.description}
                        </Label>

                      </div>
                      <Badge variant={isSelected ? "default" : "secondary"}>
                        {isSelected ? "Selected" : "Not Selected"}
                      </Badge>
                    </div>

                    {/* Item Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Unit Price</p>
                        <p className="font-medium">${Number(item.unitPrice).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quoted Qty</p>
                        <p className="font-medium">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quoted Total</p>
                        <p className="font-medium">${(item.quantity * Number(item.unitPrice)).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Accepted Total</p>
                        <p className="font-medium text-green-600">${lineTotal.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Quantity Input */}
                    {isSelected && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`quantity-${item.id}`}>Accepted Quantity</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id={`quantity-${item.id}`}
                              type="number"
                              min="0"
                              max={item.quantity}
                              value={selectedQuantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                              className="w-24"
                              data-testid={`input-quantity-${index}`}
                            />
                            <span className="text-sm text-muted-foreground">
                              of {item.quantity} max
                            </span>
                          </div>
                          {selectedQuantity > item.quantity && (
                            <div className="flex items-center gap-1 text-sm text-orange-600">
                              <AlertTriangle className="h-4 w-4" />
                              <span>Quantity exceeds quoted amount</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`notes-${item.id}`}>Item Notes (Optional)</Label>
                          <Textarea
                            id={`notes-${item.id}`}
                            placeholder="Any specific notes for this item..."
                            value={itemNotes}
                            onChange={(e) => handleNotesChange(item.id, e.target.value)}
                            className="min-h-[80px]"
                            data-testid={`textarea-notes-${index}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {index < quotationItems.length - 1 && <Separator />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Validation Messages */}
      {totalAcceptedItems === 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">No Items Selected</p>
                <p className="text-sm text-yellow-700">
                  Please select at least one item to proceed with partial acceptance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}