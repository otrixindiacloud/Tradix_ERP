import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Edit, Trash2, PlusCircle, Clock, FileText, CheckCircle, BarChart3, MessageSquare, ChevronDown } from "lucide-react";
import DataTable, { Column } from "@/components/tables/data-table";
import EnquiryForm from "@/components/forms/enquiry-form";
import EnquiryFilters from "@/components/enquiry/enquiry-filters";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { formatDate, getStatusColor } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Enquiries() {
  const [showNewEnquiry, setShowNewEnquiry] = useState(false);
  const [showEditEnquiry, setShowEditEnquiry] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<any>(null);
  const [deletingEnquiry, setDeletingEnquiry] = useState<any>(null);
  const [filters, setFilters] = useState<{
    search?: string;
    status?: string;
    source?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
  }>({});

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  const [selectedEnquiries, setSelectedEnquiries] = useState<string[]>([]);
  const [selectedEnquiryForProgress, setSelectedEnquiryForProgress] = useState<string>("");
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [, setLocation] = useLocation();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load selected enquiries from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedEnquiries');
    if (saved) {
      try {
        setSelectedEnquiries(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing selected enquiries from localStorage:', error);
      }
    }
  }, []);

  const { data: enquiries = [], isLoading, error } = useQuery({
    queryKey: ["/api/enquiries", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "") {
          params.append(key, value as string);
        }
      });
      
      const response = await fetch(`/api/enquiries?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch enquiries: ${response.statusText}`);
      }
      return response.json();
    },
  });

  const { data: customersData = { customers: [] } } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  const customers = customersData.customers || [];

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  const deleteEnquiry = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await fetch(`/api/enquiries/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }
        
        // Check if response has content
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          return { success: true };
        }
      } catch (error: any) {
        console.error('Delete enquiry error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enquiries"] });
      toast({
        title: "Success",
        description: "Enquiry deleted successfully",
      });
      setDeletingEnquiry(null);
    },
    onError: (error: any) => {
      console.error('Delete enquiry mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete enquiry. Please try again.",
        variant: "destructive",
      });
      setDeletingEnquiry(null);
    },
  });

  const handleEdit = (enquiry: any) => {
    setEditingEnquiry(enquiry);
    setShowEditEnquiry(true);
  };

  const handleDelete = (enquiry: any) => {
    if (!enquiry || !enquiry.id) {
      toast({
        title: "Error",
        description: "Invalid enquiry selected for deletion",
        variant: "destructive",
      });
      return;
    }
    setDeletingEnquiry(enquiry);
  };

  const handleSelectEnquiry = (enquiryId: string, checked: boolean) => {
    let newSelection;
    if (checked) {
      newSelection = [...selectedEnquiries, enquiryId];
    } else {
      newSelection = selectedEnquiries.filter(id => id !== enquiryId);
    }
    setSelectedEnquiries(newSelection);
    localStorage.setItem('selectedEnquiries', JSON.stringify(newSelection));
  };

  const handleSelectAll = (checked: boolean) => {
    let newSelection;
    if (checked) {
      newSelection = enquiries.map((e: any) => e.id);
    } else {
      newSelection = [];
    }
    setSelectedEnquiries(newSelection);
    localStorage.setItem('selectedEnquiries', JSON.stringify(newSelection));
  };

  const handleViewProgress = () => {
    if (selectedEnquiries.length > 0) {
      setShowProgressDashboard(true);
    } else {
      toast({
        title: "No Enquiries Selected",
        description: "Please select at least one enquiry to view progress.",
        variant: "destructive",
      });
    }
  };

  // Merge enquiries with full customer data
  const enrichedEnquiries = enquiries.map((enquiry: any) => {
    const fullCustomer = customers.find((customer: any) => customer.id === enquiry.customerId);
    return {
      ...enquiry,
      customer: fullCustomer || enquiry.customer // Use full customer data if found, fallback to existing
    };
  });

  // Client-side filtering as fallback
  const filteredEnquiries = enrichedEnquiries.filter((enquiry: any) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = [
        enquiry.enquiryNumber,
        enquiry.customer?.name || '',
        enquiry.notes || '',
        enquiry.source || ''
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (enquiry.status !== filters.status) {
        return false;
      }
    }

    // Source filter
    if (filters.source && filters.source !== 'all') {
      if (enquiry.source !== filters.source) {
        return false;
      }
    }

    // Customer filter
    if (filters.customerId && filters.customerId !== 'all') {
      if (enquiry.customerId !== filters.customerId) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateFrom) {
      const enquiryDate = new Date(enquiry.enquiryDate);
      const fromDate = new Date(filters.dateFrom);
      if (enquiryDate < fromDate) {
        return false;
      }
    }

    if (filters.dateTo) {
      const enquiryDate = new Date(enquiry.enquiryDate);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Include the entire day
      if (enquiryDate > toDate) {
        return false;
      }
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEnquiries.length / pageSize);
  const paginatedEnquiries = filteredEnquiries.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Helper functions for badge styling similar to customer management
  const getSourceBadgeClass = (source: string) => {
    switch (source) {
      case 'Email':
        return "bg-blue-50 text-blue-700 border-blue-200";
      case 'Walk-in':
        return "bg-orange-50 text-orange-700 border-orange-200";
      case 'Web Form':
        return "bg-purple-50 text-purple-700 border-purple-200";
      case 'Phone':
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'New':
        return "bg-blue-50 text-blue-700 border-blue-200";
      case 'In Progress':
        return "bg-transparent text-orange-700 border-orange-300 border-2";
      case 'Quoted':
        return "bg-green-50 text-green-700 border-green-200";
      case 'Closed':
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const columns: Column<any>[] = [
    // {
    //   key: "select",
    //   header: "Select",
    //   render: (value: any, enquiry: any) => (
    //     <Checkbox
    //       checked={selectedEnquiries.includes(enquiry.id)}
    //       onCheckedChange={(checked) => handleSelectEnquiry(enquiry.id, checked as boolean)}
    //       aria-label={`Select enquiry ${enquiry.enquiryNumber}`}
    //     />
    //   ),
    // },
    {
      key: "enquiryNumber",
      header: "Enquiry ID",
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600 font-medium">{value}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (customer: any) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {customer?.name || "Unknown Customer"}
          </p>
        </div>
      ),
    },
    {
      key: "source",
      header: "Source",
      render: (value: string) => (
        <Badge 
          variant="outline"
          className={getSourceBadgeClass(value)}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value: string) => (
        <Badge 
          variant="outline"
          className={getStatusBadgeClass(value)}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "targetDeliveryDate",
      header: "Target Delivery",
      render: (value: string) => value ? formatDate(value) : "-",
    },
    {
      key: "enquiryDate",
      header: "Created",
      className: "text-right",
      render: (value: string) => formatDate(value),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, enquiry: any) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setLocation(`/enquiries/${enquiry.id}`);
            }}
            data-testid={`button-view-${enquiry.id}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(enquiry);
            }}
            data-testid={`button-edit-${enquiry.id}`}
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Delete button clicked for enquiry:', enquiry);
              handleDelete(enquiry);
            }}
            data-testid={`button-delete-${enquiry.id}`}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  const statusCounts = {
    new: Array.isArray(filteredEnquiries) ? filteredEnquiries.filter((e: any) => e.status === "New").length : 0,
    inProgress: Array.isArray(filteredEnquiries) ? filteredEnquiries.filter((e: any) => e.status === "In Progress").length : 0,
    quoted: Array.isArray(filteredEnquiries) ? filteredEnquiries.filter((e: any) => e.status === "Quoted").length : 0,
    closed: Array.isArray(filteredEnquiries) ? filteredEnquiries.filter((e: any) => e.status === "Closed").length : 0,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent" data-testid="text-page-title">
                  Customer Enquiries
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Step 1: Manage customer enquiries from multiple channels
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-amber-600">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <span className="font-medium">Live Tracking</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {Object.keys(filters).length > 0 ? 
                    `Filtered Enquiries: ${filteredEnquiries.length} of ${enquiries.length}` : 
                    `Total Enquiries: ${enquiries.length}`
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {selectedEnquiries.length > 0 && (
              <Button 
                variant="outline" 
                className="flex items-center space-x-2" 
                onClick={handleViewProgress}
                data-testid="button-view-progress"
              >
                <BarChart3 className="h-4 w-4" />
                <span>View Progress ({selectedEnquiries.length})</span>
              </Button>
            )}
            <Dialog open={showNewEnquiry} onOpenChange={setShowNewEnquiry}>
              <DialogTrigger asChild>
                <Button className="btn-primary flex items-center space-x-2" data-testid="button-new-enquiry">
                  <Plus className="h-4 w-4" />
                  <span>New Enquiry</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Enquiry</DialogTitle>
                </DialogHeader>
                <EnquiryForm 
                  onSuccess={() => setShowNewEnquiry(false)} 
                  onCancel={() => setShowNewEnquiry(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="kpi-card card-elevated">
          <div className="kpi-card-content">
            <div className="flex items-start gap-3">
              <div className="kpi-icon bg-blue-100">
                <PlusCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="kpi-label">New Enquiries</p>
                <p className="kpi-value text-blue-600" data-testid="stat-new-enquiries">
                  {statusCounts.new}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="kpi-card card-elevated">
          <div className="kpi-card-content">
            <div className="flex items-start gap-3">
              <div className="kpi-icon bg-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="text-left">
                <p className="kpi-label">In Progress</p>
                <p className="kpi-value text-amber-600" data-testid="stat-in-progress-enquiries">
                  {statusCounts.inProgress}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="kpi-card card-elevated">
          <div className="kpi-card-content">
            <div className="flex items-start gap-3">
              <div className="kpi-icon bg-green-100">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <p className="kpi-label">Quoted</p>
                <p className="kpi-value text-green-600" data-testid="stat-quoted-enquiries">
                  {statusCounts.quoted}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="kpi-card card-elevated">
          <div className="kpi-card-content">
            <div className="flex items-start gap-3">
              <div className="kpi-icon bg-gray-100">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
              <div className="text-left">
                <p className="kpi-label">Closed</p>
                <p className="kpi-value text-gray-600" data-testid="stat-closed-enquiries">
                  {statusCounts.closed}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <EnquiryFilters 
          onFiltersChange={setFilters}
          customers={Array.isArray(customers) ? customers : []}
        />
        
        {/* Active Filters Summary */}
        {Object.keys(filters).length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-900">Active Filters:</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value || value === '') return null;
                    
                    let displayValue: string = value as string;
                    if (key === 'customerId') {
                      const customer = customers.find((c: any) => c.id === value);
                      displayValue = customer?.name || (value as string);
                    } else if (key === 'dateFrom' || key === 'dateTo') {
                      displayValue = formatDate(value as string);
                    }
                    
                    return (
                      <Badge key={key} variant="secondary" className="bg-blue-100 text-blue-800">
                        {key}: {displayValue}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({})}
                className="text-blue-600 hover:text-blue-800"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Enquiries Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Enquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error loading enquiries: {error.message}</p>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/enquiries"] })}>
                Retry
              </Button>
            </div>
          ) : (
            <div>
              {/* Custom header row for select all checkbox */}
              
              <DataTable
                data={paginatedEnquiries || []}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="No enquiries found. Create your first enquiry to get started."
                onRowClick={(enquiry) => {
                  setLocation(`/enquiries/${enquiry.id}`);
                }}
              />
              {/* Pagination Controls */}
              {filteredEnquiries.length > pageSize && (
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Enquiry Dialog */}
      <Dialog open={showEditEnquiry} onOpenChange={setShowEditEnquiry}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Enquiry</DialogTitle>
          </DialogHeader>
          {editingEnquiry && (
            <EnquiryForm
              enquiryId={editingEnquiry.id}
              initialData={{
                customerId: editingEnquiry.customerId,
                source: editingEnquiry.source,
                targetDeliveryDate: editingEnquiry.targetDeliveryDate,
                notes: editingEnquiry.notes,
              }}
              onCancel={() => {
                setShowEditEnquiry(false);
                setEditingEnquiry(null);
              }}
              onSuccess={() => {
                setShowEditEnquiry(false);
                setEditingEnquiry(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingEnquiry} onOpenChange={() => setDeletingEnquiry(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the enquiry
              "{deletingEnquiry?.enquiryNumber}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingEnquiry && deletingEnquiry.id) {
                  deleteEnquiry.mutate(deletingEnquiry.id);
                }
              }}
              disabled={deleteEnquiry.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteEnquiry.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Progress Dashboard Dialog */}
      <Dialog open={showProgressDashboard} onOpenChange={setShowProgressDashboard}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Enquiry Progress Dashboard
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Selected Enquiries Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-4">
                Selected Enquiries ({selectedEnquiries.length}) - Select one to view progress
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ChevronDown className="h-4 w-4 text-blue-600" />
                  <Select value={selectedEnquiryForProgress} onValueChange={setSelectedEnquiryForProgress}>
                    <SelectTrigger className="w-full max-w-md">
                      <SelectValue placeholder="Select an enquiry to view progress..." />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedEnquiries.map(enquiryId => {
                        const enquiry = enquiries.find((e: any) => e.id === enquiryId);
                        if (!enquiry) return null;
                        
                        return (
                          <SelectItem key={enquiryId} value={enquiryId}>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{enquiry.enquiryNumber}</span>
                                <span className="text-gray-500">-</span>
                                <span className="text-sm text-gray-600">
                                  {enquiry.customer?.name || "Unknown Customer"}
                                </span>
                              </div>
                              <Badge variant="outline" className={getStatusColor(enquiry.status)}>
                                {enquiry.status}
                              </Badge>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  
                  {selectedEnquiryForProgress && (
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedEnquiryForProgress("")}
                      variant="outline"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                
                {selectedEnquiryForProgress && (
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Progress Details</h4>
                      <Badge variant="default" className="bg-blue-600">
                        Selected
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {(() => {
                        const enquiry = enquiries.find((e: any) => e.id === selectedEnquiryForProgress);
                        if (!enquiry) return null;
                        
                        const progressPercentage = enquiry.status === "New" ? 0 : 
                                                 enquiry.status === "In Progress" ? 25 :
                                                 enquiry.status === "Quoted" ? 50 :
                                                 enquiry.status === "Closed" ? 100 : 0;
                        
                        return (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              ></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Source:</span>
                                <span className="ml-2 font-medium">{enquiry.source}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Created:</span>
                                <span className="ml-2 font-medium">{formatDate(enquiry.enquiryDate)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Target Delivery:</span>
                                <span className="ml-2 font-medium">
                                  {enquiry.targetDeliveryDate ? formatDate(enquiry.targetDeliveryDate) : "Not set"}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Current Status:</span>
                                <span className="ml-2 font-medium">{enquiry.status}</span>
                              </div>
                            </div>
                            {enquiry.notes && (
                              <div className="mt-3 pt-3 border-t">
                                <span className="text-gray-500 text-sm">Notes:</span>
                                <p className="text-sm text-gray-700 mt-1">{enquiry.notes}</p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedEnquiries.filter(id => {
                          const enquiry = enquiries.find((e: any) => e.id === id);
                          return enquiry?.status === "New";
                        }).length}
                      </div>
                      <div className="text-sm text-gray-600">New Enquiries</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {selectedEnquiries.filter(id => {
                          const enquiry = enquiries.find((e: any) => e.id === id);
                          return enquiry?.status === "Quoted";
                        }).length}
                      </div>
                      <div className="text-sm text-gray-600">Quoted</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-2xl font-bold text-gray-600">
                        {selectedEnquiries.filter(id => {
                          const enquiry = enquiries.find((e: any) => e.id === id);
                          return enquiry?.status === "Closed";
                        }).length}
                      </div>
                      <div className="text-sm text-gray-600">Closed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Progress Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedEnquiries.map(enquiryId => {
                    const enquiry = enquiries.find((e: any) => e.id === enquiryId);
                    if (!enquiry) return null;
                    
                    return (
                      <div key={enquiryId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{enquiry.enquiryNumber}</h4>
                            <p className="text-sm text-gray-600">
                              {enquiry.customer?.name || "Unknown Customer"}
                            </p>
                          </div>
                          <Badge variant="outline" className={getStatusColor(enquiry.status)}>
                            {enquiry.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Source:</span>
                            <span className="ml-2">{enquiry.source}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Created:</span>
                            <span className="ml-2">{formatDate(enquiry.enquiryDate)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Target Delivery:</span>
                            <span className="ml-2">
                              {enquiry.targetDeliveryDate ? formatDate(enquiry.targetDeliveryDate) : "Not set"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Progress:</span>
                            <span className="ml-2">
                              {enquiry.status === "New" ? "0%" : 
                               enquiry.status === "In Progress" ? "25%" :
                               enquiry.status === "Quoted" ? "50%" :
                               enquiry.status === "Closed" ? "100%" : "0%"}
                            </span>
                          </div>
                        </div>
                        
                        {enquiry.notes && (
                          <div className="mt-3 pt-3 border-t">
                            <span className="text-gray-500 text-sm">Notes:</span>
                            <p className="text-sm text-gray-700 mt-1">{enquiry.notes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
