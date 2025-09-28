
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Plus } from "lucide-react";

const mockItems = [
  { id: 1, name: "Item A", sku: "SKU001", category: "Category 1", stock: 120, status: "Active" },
  { id: 2, name: "Item B", sku: "SKU002", category: "Category 2", stock: 80, status: "Inactive" },
  { id: 3, name: "Item C", sku: "SKU003", category: "Category 1", stock: 45, status: "Active" },
];

export default function ItemsPage() {
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const filteredItems = mockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  // Status counts
  const total = mockItems.length;
  const active = mockItems.filter(i => i.status === "Active").length;
  const inactive = mockItems.filter(i => i.status === "Inactive").length;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold">Inventory Items</h1>
          <p className="text-gray-600 mt-1">View, edit, and manage all inventory items</p>
        </div>
        <Button variant="success" className="flex items-center gap-2" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="bg-blue-50">
          <CardContent className="flex flex-col items-center py-6">
            <span className="text-2xl font-bold text-blue-900">{total}</span>
            <span className="text-blue-700 mt-1">Total Items</span>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent className="flex flex-col items-center py-6">
            <span className="text-2xl font-bold text-green-900">{active}</span>
            <span className="text-green-700 mt-1">Active</span>
          </CardContent>
        </Card>
        <Card className="bg-gray-50">
          <CardContent className="flex flex-col items-center py-6">
            <span className="text-2xl font-bold text-gray-900">{inactive}</span>
            <span className="text-gray-700 mt-1">Inactive</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Items List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search by name, SKU, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Total: {filteredItems.length}
              </Badge>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    No items found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-medium text-blue-900">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Active" ? "success" : "outline"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>Fill in the details to add a new inventory item.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Item Name" required />
            </div>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" placeholder="SKU Code" required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="Category" required />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" placeholder="Stock Quantity" required />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select id="status" className="w-full border rounded px-2 py-2">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Description (optional)" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Add Item
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}