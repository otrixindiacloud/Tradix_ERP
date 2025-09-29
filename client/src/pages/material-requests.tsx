import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Package2,
  Plus, 
  Search, 
  Filter,
  Edit, 
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  Building2,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DataTable from "@/components/tables/data-table";
import type { Requisition } from "@shared/schema";
import { formatDate, formatCurrency } from "@/lib/utils";

// Form schemas
const materialRequestSchema = z.object({
  requestedBy: z.string().min(1, "Requested by is required"),
  department: z.string().min(1, "Department is required"),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  requiredDate: z.string().min(1, "Required date is required"),
  totalEstimatedCost: z.number().min(0, "Total estimated cost must be positive"),
  justification: z.string().min(1, "Justification is required"),
  notes: z.string().optional(),
});

const materialRequestItemSchema = z.object({
  itemDescription: z.string().min(1, "Item description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitOfMeasure: z.string().min(1, "Unit of measure is required"),
  estimatedCost: z.number().min(0, "Estimated cost must be positive"),
  specification: z.string().optional(),
  preferredSupplier: z.string().optional(),
  urgency: z.enum(["Standard", "Urgent"]).default("Standard"),
});

type MaterialRequestForm = z.infer<typeof materialRequestSchema>;
type MaterialRequestItemForm = z.infer<typeof materialRequestItemSchema>;

interface RequestItem extends MaterialRequestItemForm {
  id: string;
}

// Status badge minimal colors (no background) - only text + border
const getStatusColor = (status: string) => {
  switch (status) {
    case "Draft":
      return "text-slate-600 border-slate-300";
    case "Pending Approval":
      return "text-amber-600 border-amber-400";
    case "Approved":
      return "text-green-600 border-green-500";
    case "Rejected":
      return "text-red-600 border-red-500";
    case "Processing":
      return "text-blue-600 border-blue-400";
    case "Completed":
      return "text-purple-600 border-purple-500";
    case "Cancelled":
      return "text-slate-500 border-slate-300";
    default:
      return "text-slate-600 border-slate-300";
  }
};

// Icon mapping for statuses
const statusIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Draft: FileText,
  "Pending Approval": Clock,
  Approved: CheckCircle,
  Rejected: XCircle,
  Processing: TrendingUp,
  Completed: CheckCircle,
  Cancelled: XCircle,
};

const getPriorityColor = (priority: string) => {
  // Professional minimal style: no background fill, just semantic text + subtle border
  switch (priority) {
    case "Low":
      return "bg-transparent text-blue-700 border-blue-300";
    case "Medium":
      return "bg-transparent text-amber-700 border-amber-300";
    case "High":
      return "bg-transparent text-orange-600 border-orange-300";
    case "Urgent":
      return "bg-transparent text-red-600 border-red-300";
    default:
      return "bg-transparent text-slate-600 border-slate-300";
  }
};

export default function MaterialRequestsPage() {
  // Pagination state for requests table
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  // Item-level edit dialog state
  // Duplicate declarations removed (already declared above)
  // Item-level edit dialog state
  const [showEditItemDialog, setShowEditItemDialog] = useState(false);
  const [editItem, setEditItem] = useState<RequestItem | null>(null);

  // Item-level edit form
  const editItemForm = useForm<MaterialRequestItemForm>({
    resolver: zodResolver(materialRequestItemSchema),
    defaultValues: {
      itemDescription: "",
      quantity: 1,
      unitOfMeasure: "",
      estimatedCost: 0,
      specification: "",
      preferredSupplier: "",
      urgency: "Standard",
    },
  });

  React.useEffect(() => {
    if (editItem) {
      editItemForm.reset(editItem);
    }
  }, [editItem]);

  // Update item in state
  const onEditItemSubmit = (data: MaterialRequestItemForm) => {
    if (!editItem) return;
    setRequestItems(prev => prev.map(item => item.id === editItem.id ? { ...item, ...data } : item));
    setShowEditItemDialog(false);
    setEditItem(null);
    // Update total cost
    const newTotal = requestItems.map(item => item.id === editItem.id ? { ...item, ...data } : item).reduce((sum, item) => sum + (item.quantity * item.estimatedCost), 0);
    form.setValue("totalEstimatedCost", newTotal);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Requisition | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [requestItems, setRequestItems] = useState<RequestItem[]>([]);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch material requests
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["material-requests"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/material-requests");
      const data = await response.json();
      return Array.isArray(data) ? data as Requisition[] : [];
    },
  });

  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ["material-requests-stats"],
    queryFn: async () => {
      const requestsArray = Array.isArray(requests) ? requests : [];
      const total = requestsArray.length;
      const pending = requestsArray.filter(r => r.status === "Pending Approval").length;
      const approved = requestsArray.filter(r => r.status === "Approved").length;
      const processing = requestsArray.filter(r => r.status === "Processing").length;
      const totalValue = requestsArray.reduce((sum, r) => sum + Number(r.totalEstimatedCost || 0), 0);
      
      return { total, pending, approved, processing, totalValue };
    },
    enabled: Array.isArray(requests) && requests.length > 0,
  });

  // Create material request mutation
  const createRequestMutation = useMutation({
    mutationFn: async (data: MaterialRequestForm) => {
      const requestData = {
        ...data,
        status: "Draft",
        itemCount: requestItems.length,
        items: requestItems,
      };
      return await apiRequest("POST", "/api/material-requests", requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["material-requests"] });
      setShowCreateDialog(false);
      setRequestItems([]);
      form.reset();
      toast({
        title: "Success",
        description: "Material request created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create material request",
        variant: "destructive",
      });
    },
  });

  const form = useForm<MaterialRequestForm>({
    resolver: zodResolver(materialRequestSchema),
    defaultValues: {
      requestedBy: "",
      department: "",
      priority: "Medium",
      requiredDate: "",
      totalEstimatedCost: 0,
      justification: "",
      notes: "",
    },
  });

  const itemForm = useForm<MaterialRequestItemForm>({
    resolver: zodResolver(materialRequestItemSchema),
    defaultValues: {
      itemDescription: "",
      quantity: 1,
      unitOfMeasure: "",
      estimatedCost: 0,
      specification: "",
      preferredSupplier: "",
      urgency: "Standard",
    },
  });

  const onSubmit = (data: MaterialRequestForm) => {
    // Calculate total estimated cost from items
    const calculatedTotal = requestItems.reduce((sum, item) => sum + (item.quantity * item.estimatedCost), 0);
    
    createRequestMutation.mutate({
      ...data,
      totalEstimatedCost: calculatedTotal,
    });
  };

  const onAddItem = (data: MaterialRequestItemForm) => {
    const newItem: RequestItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    setRequestItems(prev => [...prev, newItem]);
    setShowAddItemDialog(false);
    itemForm.reset();
    
    // Update total estimated cost in main form
    const newTotal = [...requestItems, newItem].reduce((sum, item) => sum + (item.quantity * item.estimatedCost), 0);
    form.setValue("totalEstimatedCost", newTotal);
  };

  const removeItem = (itemId: string) => {
    setRequestItems(prev => {
      const updated = prev.filter(item => item.id !== itemId);
      const newTotal = updated.reduce((sum, item) => sum + (item.quantity * item.estimatedCost), 0);
      form.setValue("totalEstimatedCost", newTotal);
      return updated;
    });
  };

  // Filter requests
  const filteredRequests = (Array.isArray(requests) ? requests : []).filter((request: Requisition) => {
    const matchesSearch = 
      request.requisitionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.justification || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    const matchesDepartment = departmentFilter === "all" || request.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Get unique departments for filter
  const departments = Array.from(new Set((Array.isArray(requests) ? requests : []).map((r: Requisition) => r.department))).filter(Boolean);

  // Table columns
  const columns = [
    {
      key: "requisitionNumber",
      header: "Request Number",
      render: (value: string) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      key: "requestedBy",
      header: "Requested By",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-500" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (value: string) => (
        <Badge variant="outline" className={`shadow-none ${getPriorityColor(value)} px-2 py-0.5 text-xs font-medium`}> 
          {value}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value: string) => {
        const Icon = statusIconMap[value] || FileText;
        return (
          <Badge
            variant="outline"
            className={`shadow-none inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium ${getStatusColor(value)}`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{value}</span>
          </Badge>
        );
      },
    },
    {
      key: "requestDate",
      header: "Request Date",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{formatDate(value)}</span>
        </div>
      ),
    },
    {
      key: "requiredDate",
      header: "Required Date",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>{formatDate(value)}</span>
        </div>
      ),
    },
    {
      key: "totalEstimatedCost",
      header: "Estimated Cost",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{formatCurrency(Number(value))}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, request: Requisition) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedRequest(request);
              setShowDetailsDialog(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedRequest(request);
              setShowEditDialog(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300"
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this request?")) {
                await apiRequest("DELETE", `/api/material-requests/${request.id}`);
                queryClient.invalidateQueries({ queryKey: ["material-requests"] });
                toast({ title: "Deleted", description: "Material request deleted." });
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  // Edit material request mutation
  const editRequestMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MaterialRequestForm> }) => {
      return await apiRequest("PUT", `/api/material-requests/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["material-requests"] });
      setShowEditDialog(false);
      toast({ title: "Success", description: "Material request updated." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update request", variant: "destructive" });
    },
  });
  // Edit dialog form
  const editForm = useForm<MaterialRequestForm>({
    resolver: zodResolver(materialRequestSchema),
    defaultValues: selectedRequest
      ? {
          requestedBy: selectedRequest.requestedBy || "",
          department: selectedRequest.department || "",
          priority: selectedRequest.priority || "Medium",
          requiredDate: selectedRequest.requiredDate
            ? typeof selectedRequest.requiredDate === "string"
              ? selectedRequest.requiredDate
              : new Date(selectedRequest.requiredDate).toISOString().slice(0, 10)
            : "",
          totalEstimatedCost: typeof selectedRequest.totalEstimatedCost === "number"
            ? selectedRequest.totalEstimatedCost
            : Number(selectedRequest.totalEstimatedCost) || 0,
          justification: selectedRequest.justification || "",
          notes: selectedRequest.notes || "",
        }
      : {
          requestedBy: "",
          department: "",
          priority: "Medium",
          requiredDate: "",
          totalEstimatedCost: 0,
          justification: "",
          notes: "",
        },
  });

  // When selectedRequest changes, reset editForm
  React.useEffect(() => {
    if (selectedRequest) {
      editForm.reset({
        requestedBy: selectedRequest.requestedBy || "",
        department: selectedRequest.department || "",
        priority: selectedRequest.priority || "Medium",
        requiredDate: selectedRequest.requiredDate
          ? typeof selectedRequest.requiredDate === "string"
            ? selectedRequest.requiredDate
            : new Date(selectedRequest.requiredDate).toISOString().slice(0, 10)
          : "",
        totalEstimatedCost: typeof selectedRequest.totalEstimatedCost === "number"
          ? selectedRequest.totalEstimatedCost
          : Number(selectedRequest.totalEstimatedCost) || 0,
        justification: selectedRequest.justification || "",
        notes: selectedRequest.notes || "",
      });
    }
  }, [selectedRequest]);
  // Edit dialog UI
  <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
    <DialogContent className="max-w-4xl w-[90vw] max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Material Request</DialogTitle>
        <DialogDescription>Update the details of this material request.</DialogDescription>
      </DialogHeader>
      <Form {...editForm}>
        <form
          onSubmit={editForm.handleSubmit((data) => {
            if (selectedRequest) {
              editRequestMutation.mutate({ id: selectedRequest.id, data });
            }
          })}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField control={editForm.control} name="requestedBy" render={({ field }) => (
              <FormItem>
                <FormLabel>Requested By</FormLabel>
                <FormControl><Input placeholder="Enter name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={editForm.control} name="department" render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl><Input placeholder="Enter department" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={editForm.control} name="priority" render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={editForm.control} name="requiredDate" render={({ field }) => (
              <FormItem>
                <FormLabel>Required Date</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField control={editForm.control} name="totalEstimatedCost" render={({ field }) => (
              <FormItem>
                <FormLabel>Total Estimated Cost</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || 0} readOnly className="bg-gray-50" />
                </FormControl>
                <p className="text-xs text-gray-600">Auto-calculated from items</p>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={editForm.control} name="justification" render={({ field }) => (
              <FormItem>
                <FormLabel>Justification</FormLabel>
                <FormControl><Textarea placeholder="Explain the business need for this request..." rows={2} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={editForm.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl><Textarea placeholder="Any additional information..." rows={2} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button type="submit" disabled={editRequestMutation.isPending}>{editRequestMutation.isPending ? "Saving..." : "Save Changes"}</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  </Dialog>

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/50 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200/50">
              <Package2 className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">Material Requests</h1>
              <p className="text-slate-600 text-base">Manage and track material requisitions across departments</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>System Active</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="px-6 py-2.5 font-medium">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl w-[90vw] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Material Request</DialogTitle>
              <DialogDescription>
                Submit a new material requisition for approval
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="requestedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requested By</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter department" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requiredDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="totalEstimatedCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Estimated Cost</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            value={field.value || 0}
                            readOnly
                            className="bg-gray-50"
                          />
                        </FormControl>
                        <p className="text-xs text-gray-600">Auto-calculated from items</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="justification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Justification</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Explain the business need for this request..."
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional information..."
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Request Items Section */}
                <div className="space-y-4">
                  <div className="flex flex-row items-center justify-between mb-2 gap-2">
                    <Label className="text-base font-semibold">Request Items <span className="ml-1 text-xs font-normal text-gray-500">({requestItems.length})</span></Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setShowAddItemDialog(true)}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Item</span>
                    </Button>
                  </div>
                  {requestItems.length > 0 ? (
                    <div className="border rounded-lg overflow-x-auto">
                      <div className="min-w-[700px] grid grid-cols-12 gap-0 p-3 bg-gray-50 text-sm font-semibold border-b">
                        <div className="col-span-4 pl-2">Description</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-2 text-center">Unit</div>
                        <div className="col-span-2 text-center">Cost</div>
                        <div className="col-span-1 text-center">Total</div>
                        <div className="col-span-1 text-center">Actions</div>
                      </div>
                      {requestItems.map((item) => (
                        <div key={item.id} className="min-w-[700px] grid grid-cols-12 gap-0 p-3 border-b last:border-b-0 items-center">
                          <div className="col-span-4 pl-2">
                            <p className="font-medium leading-tight">{item.itemDescription}</p>
                            {item.specification && (
                              <p className="text-xs text-gray-600 mt-1">{item.specification}</p>
                            )}
                          </div>
                          <div className="col-span-2 text-center">{item.quantity}</div>
                          <div className="col-span-2 text-center">{item.unitOfMeasure}</div>
                          <div className="col-span-2 text-center">{formatCurrency(item.estimatedCost)}</div>
                          <div className="col-span-1 text-center font-medium">
                            {formatCurrency(item.quantity * item.estimatedCost)}
                          </div>
                          <div className="col-span-1 text-center flex gap-1 justify-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditItem(item);
                                setShowEditItemDialog(true);
                              }}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
      {/* Item-level Edit Dialog */}
      <Dialog open={showEditItemDialog} onOpenChange={setShowEditItemDialog}>
        <DialogContent className="max-w-3xl w-[80vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Request Item</DialogTitle>
            <DialogDescription>Edit the details of this material item.</DialogDescription>
          </DialogHeader>
          <Form {...editItemForm}>
            <form onSubmit={editItemForm.handleSubmit(onEditItemSubmit)} className="space-y-3">
              <FormField control={editItemForm.control} name="itemDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Description</FormLabel>
                  <FormControl><Input placeholder="Enter item description" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-3 gap-4">
                <FormField control={editItemForm.control} name="quantity" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl><Input type="number" min="1" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editItemForm.control} name="unitOfMeasure" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit of Measure</FormLabel>
                    <FormControl><Input placeholder="e.g., pieces, kg, liters" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editItemForm.control} name="estimatedCost" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Cost</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={editItemForm.control} name="preferredSupplier" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Supplier (Optional)</FormLabel>
                    <FormControl><Input placeholder="Enter supplier name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editItemForm.control} name="urgency" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={editItemForm.control} name="specification" render={({ field }) => (
                <FormItem>
                  <FormLabel>Specification (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="Enter detailed specifications..." rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowEditItemDialog(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* Item-level Edit Dialog */}
      <Dialog open={showEditItemDialog} onOpenChange={setShowEditItemDialog}>
        <DialogContent className="max-w-3xl w-[80vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Request Item</DialogTitle>
            <DialogDescription>Edit the details of this material item.</DialogDescription>
          </DialogHeader>
          <Form {...editItemForm}>
            <form onSubmit={editItemForm.handleSubmit(onEditItemSubmit)} className="space-y-3">
              <FormField control={editItemForm.control} name="itemDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Description</FormLabel>
                  <FormControl><Input placeholder="Enter item description" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-3 gap-4">
                <FormField control={editItemForm.control} name="quantity" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl><Input type="number" min="1" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editItemForm.control} name="unitOfMeasure" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit of Measure</FormLabel>
                    <FormControl><Input placeholder="e.g., pieces, kg, liters" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editItemForm.control} name="estimatedCost" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Cost</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={editItemForm.control} name="preferredSupplier" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Supplier (Optional)</FormLabel>
                    <FormControl><Input placeholder="Enter supplier name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editItemForm.control} name="urgency" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={editItemForm.control} name="specification" render={({ field }) => (
                <FormItem>
                  <FormLabel>Specification (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="Enter detailed specifications..." rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowEditItemDialog(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  // ...existing code...
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
                      <Package2 className="mx-auto h-12 w-12 mb-2 text-gray-400" />
                      <p className="font-medium">No items added yet</p>
                      <p className="text-sm">Click "Add Item" to include materials in this request</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createRequestMutation.isPending}>
                    {createRequestMutation.isPending ? "Creating..." : "Create Request"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Package2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Ready for processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
              <p className="text-xs text-muted-foreground">Currently processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalValue >= 1000
                  ? `${Math.round(stats.totalValue / 1000)}k`
                  : Math.round(stats.totalValue)}
              </div>
              <p className="text-xs text-muted-foreground">Estimated cost</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept: string) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table with Pagination */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Material Requests</CardTitle>
          <CardDescription>
            {filteredRequests.length} of {Array.isArray(requests) ? requests.length : 0} requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={paginatedRequests}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No material requests found. Create your first request to get started."
          />
          {/* Pagination Controls */}
          {filteredRequests.length > pageSize && (
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
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Material Request Details</DialogTitle>
            <DialogDescription>
              Request #{selectedRequest?.requisitionNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Requested By</Label>
                    <p className="text-sm font-medium">{selectedRequest.requestedBy}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Department</Label>
                    <p className="text-sm font-medium">{selectedRequest.department}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Priority</Label>
                    <Badge variant="outline" className={`shadow-none ${getPriorityColor(selectedRequest.priority)} px-2 py-0.5 text-xs font-medium`}>
                      {selectedRequest.priority}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    {(() => {
                      const currentStatus = selectedRequest.status || "Draft";
                      const Icon = statusIconMap[currentStatus] || FileText;
                      return (
                        <Badge
                          variant="outline"
                          className={`shadow-none inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium ${getStatusColor(currentStatus)}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{currentStatus}</span>
                        </Badge>
                      );
                    })()}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Request Date</Label>
                    <p className="text-sm font-medium">
                      {selectedRequest.requestDate ? formatDate(selectedRequest.requestDate) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Required Date</Label>
                    <p className="text-sm font-medium">
                      {selectedRequest.requiredDate ? formatDate(selectedRequest.requiredDate) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Total Estimated Cost</Label>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(Number(selectedRequest.totalEstimatedCost))}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Justification</Label>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedRequest.justification}
                </p>
              </div>
              {selectedRequest.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Additional Notes</Label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                    {selectedRequest.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent className="max-w-3xl w-[80vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Request Item</DialogTitle>
            <DialogDescription>
              Add a material item to this request
            </DialogDescription>
          </DialogHeader>
          <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(onAddItem)} className="space-y-3">
              <FormField
                control={itemForm.control}
                name="itemDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={itemForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={itemForm.control}
                  name="unitOfMeasure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit of Measure</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., pieces, kg, liters" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={itemForm.control}
                  name="estimatedCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Cost</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={itemForm.control}
                  name="preferredSupplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Supplier (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter supplier name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={itemForm.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={itemForm.control}
                name="specification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specification (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter detailed specifications..."
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddItemDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add Item
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}