import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  X, 
  ArrowRight, 
  Play, 
  Pause, 
  RotateCcw,
  BarChart3,
  TrendingUp,
  Calendar,
  User,
  FileText,
  Package,
  Truck,
  DollarSign,
  Eye,
  Edit,
  Download,
  ChevronDown,
  ChevronRight,
  Flag,
  Users,
  ShoppingCart,
  Warehouse,
  Settings,
  Filter,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { 
  ENHANCED_WORKFLOW_STEPS, 
  WORKFLOW_MODULES, 
  WORKFLOW_STATUSES,
  getStepById,
  getStepsByModule,
  getNextSteps,
  calculateProgress,
  getModuleColor,
  getModuleIcon,
  type WorkflowProgress,
  type StepStatus
} from "@/lib/enhanced-workflow-constants";

interface EnhancedWorkflowProgressProps {
  entityId: string;
  entityType?: string;
  entityName?: string;
  showAnalytics?: boolean;
  showFilters?: boolean;
  className?: string;
}

interface WorkflowStepStatus {
  stepId: number;
  status: StepStatus;
  completedAt?: string;
  assignedTo?: string;
  notes?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export default function EnhancedWorkflowProgress({ 
  entityId, 
  entityType = "enquiry",
  entityName,
  showAnalytics = false,
  showFilters = false,
  className 
}: EnhancedWorkflowProgressProps) {
  const [selectedModule, setSelectedModule] = useState<'Sales' | 'Purchase' | 'Inventory'>('Sales');
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStepDetails, setShowStepDetails] = useState<number | null>(null);
  const [stepNotes, setStepNotes] = useState('');
  const [stepPriority, setStepPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for development - replace with actual API calls
  const { data: workflowProgress, isLoading } = useQuery({
    queryKey: ["/api/workflow-progress", entityId],
    queryFn: async () => {
      // Mock workflow progress data
      return {
        id: `wf-${entityId}`,
        entityId,
        entityType,
        currentStep: 8, // Supplier LPO
        completedSteps: [1, 2, 3, 4, 5, 6, 7], // Customer through Sales Order
        status: "in_progress" as StepStatus,
        progress: 58, // 7/12 steps completed
        lastUpdated: new Date().toISOString(),
        module: "Purchase" as const,
        subModule: "Supplier LPO Management",
        estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Quote #QT-906876B531 accepted by customer",
        assignedTo: "John Smith",
        priority: "High" as const
      } as WorkflowProgress;
    },
  });

  const { data: stepStatuses = [] } = useQuery({
    queryKey: ["/api/step-statuses", entityId],
    queryFn: async () => {
      // Mock step statuses
      return ENHANCED_WORKFLOW_STEPS.map(step => ({
        stepId: step.id,
        status: workflowProgress?.completedSteps.includes(step.id) ? 'completed' : 
                step.id === workflowProgress?.currentStep ? 'in_progress' : 'pending',
        completedAt: workflowProgress?.completedSteps.includes(step.id) ? 
                     new Date(Date.now() - (workflowProgress.completedSteps.length - step.id) * 24 * 60 * 60 * 1000).toISOString() : undefined,
        assignedTo: step.id === workflowProgress?.currentStep ? "John Smith" : undefined,
        notes: step.id === workflowProgress?.currentStep ? "Quote #QT-906876B531 accepted by customer" : undefined,
        priority: step.id === workflowProgress?.currentStep ? "High" : "Medium"
      })) as WorkflowStepStatus[];
    },
  });

  // Update step status mutation
  const updateStepStatus = useMutation({
    mutationFn: async (data: { stepId: number; status: StepStatus; notes?: string; priority?: string }) => {
      const res = await fetch(`/api/workflow-progress/${entityId}/steps/${data.stepId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to update step status");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflow-progress", entityId] });
      queryClient.invalidateQueries({ queryKey: ["/api/step-statuses", entityId] });
      toast({
        title: "Success",
        description: "Step status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update step status",
        variant: "destructive",
      });
    },
  });

  // Mark step complete mutation
  const markStepComplete = useMutation({
    mutationFn: async (stepId: number) => {
      const res = await fetch(`/api/workflow-progress/${entityId}/steps/${stepId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: stepNotes, priority: stepPriority })
      });
      if (!res.ok) throw new Error("Failed to mark step complete");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflow-progress", entityId] });
      queryClient.invalidateQueries({ queryKey: ["/api/step-statuses", entityId] });
      toast({
        title: "Success",
        description: "Step marked as complete",
      });
      setShowStepDetails(null);
      setStepNotes('');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark step complete",
        variant: "destructive",
      });
    },
  });

  const getStepIcon = (stepId: number) => {
    const step = getStepById(stepId);
    if (!step) return <Clock className="h-4 w-4" />;
    
    switch (step.icon) {
      case "fas fa-users": return <Users className="h-4 w-4" />;
      case "fas fa-question-circle": return <FileText className="h-4 w-4" />;
      case "fas fa-file-alt": return <FileText className="h-4 w-4" />;
      case "fas fa-upload": return <Download className="h-4 w-4" />;
      case "fas fa-shopping-cart": return <ShoppingCart className="h-4 w-4" />;
      case "fas fa-truck-moving": return <Truck className="h-4 w-4" />;
      case "fas fa-file-invoice": return <DollarSign className="h-4 w-4" />;
      case "fas fa-truck": return <Truck className="h-4 w-4" />;
      case "fas fa-clipboard-list": return <FileText className="h-4 w-4" />;
      case "fas fa-file-contract": return <FileText className="h-4 w-4" />;
      case "fas fa-handshake": return <Users className="h-4 w-4" />;
      case "fas fa-shipping-fast": return <Truck className="h-4 w-4" />;
      case "fas fa-box-open": return <Package className="h-4 w-4" />;
      case "fas fa-receipt": return <FileText className="h-4 w-4" />;
      case "fas fa-boxes": return <Package className="h-4 w-4" />;
      case "fas fa-hand-holding-box": return <Package className="h-4 w-4" />;
      case "fas fa-warehouse": return <Warehouse className="h-4 w-4" />;
      case "fas fa-clipboard-check": return <FileText className="h-4 w-4" />;
      case "fas fa-arrow-down": return <ArrowRight className="h-4 w-4" />;
      case "fas fa-arrow-up": return <ArrowRight className="h-4 w-4" />;
      case "fas fa-undo": return <RotateCcw className="h-4 w-4" />;
      case "fas fa-exchange-alt": return <ArrowRight className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStepStatusIcon = (status: StepStatus) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress": return <Play className="h-4 w-4 text-blue-500" />;
      case "pending": return <Clock className="h-4 w-4 text-gray-400" />;
      case "cancelled": return <X className="h-4 w-4 text-red-500" />;
      case "on_hold": return <Pause className="h-4 w-4 text-yellow-500" />;
      case "requires_approval": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStepStatusColor = (status: StepStatus) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50 border-green-200";
      case "in_progress": return "text-blue-600 bg-blue-50 border-blue-200";
      case "pending": return "text-gray-600 bg-gray-50 border-gray-200";
      case "cancelled": return "text-red-600 bg-red-50 border-red-200";
      case "on_hold": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "requires_approval": return "text-orange-600 bg-orange-50 border-orange-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "text-red-700 bg-red-100 border border-red-300";
      case "High": return "text-orange-700 bg-orange-100 border border-orange-300";
      case "Medium": return "text-yellow-700 bg-yellow-100 border border-yellow-300";
      case "Low": return "text-green-700 bg-green-100 border border-green-300";
      default: return "text-gray-700 bg-gray-100 border border-gray-300";
    }
  };

  const filteredSteps = getStepsByModule(selectedModule).filter(step => {
    const stepStatus = stepStatuses.find(s => s.stepId === step.id);
    const statusMatch = filterStatus === 'all' || (stepStatus?.status === filterStatus);
    const searchMatch = searchTerm === '' || 
      step.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      step.description.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const toggleStepExpansion = (stepId: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const handleStepAction = (stepId: number, action: 'complete' | 'start' | 'hold' | 'cancel') => {
    const step = getStepById(stepId);
    if (!step) return;

    if (action === 'complete') {
      setShowStepDetails(stepId);
    } else {
      const statusMap = {
        'start': 'in_progress' as StepStatus,
        'hold': 'on_hold' as StepStatus,
        'cancel': 'cancelled' as StepStatus
      };
      
      updateStepStatus.mutate({
        stepId,
        status: statusMap[action],
        notes: stepNotes,
        priority: stepPriority
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                  Enhanced Workflow Progress
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Comprehensive ERP workflow management across Sales, Purchase, and Inventory
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-blue-700">
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  <span className="font-medium">Entity: {entityName || entityId}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Progress: {workflowProgress?.progress || 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Tabs */}
      <Tabs value={selectedModule} onValueChange={(value) => setSelectedModule(value as 'Sales' | 'Purchase' | 'Inventory')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="Sales" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Sales Management
          </TabsTrigger>
          <TabsTrigger value="Purchase" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Purchase Management
          </TabsTrigger>
          <TabsTrigger value="Inventory" className="flex items-center gap-2">
            <Warehouse className="h-4 w-4" />
            Inventory Management
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        {showFilters && (
          <Card className="mt-4 p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filters</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search steps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="requires_approval">Requires Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        )}

        {/* Module Content */}
        <TabsContent value={selectedModule} className="space-y-4">
          {/* Module Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${getModuleColor(selectedModule).replace('text-', 'from-').replace('-600', '-500')} to-gray-500 flex items-center justify-center`}>
                    <div className="h-6 w-6 text-white">
                      {selectedModule === 'Sales' && <Users className="h-6 w-6" />}
                      {selectedModule === 'Purchase' && <ShoppingCart className="h-6 w-6" />}
                      {selectedModule === 'Inventory' && <Warehouse className="h-6 w-6" />}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{WORKFLOW_MODULES[selectedModule].name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{WORKFLOW_MODULES[selectedModule].description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  {filteredSteps.length} steps
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stepStatuses.filter(s => s.status === 'completed' && getStepsByModule(selectedModule).some(step => step.id === s.stepId)).length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stepStatuses.filter(s => s.status === 'in_progress' && getStepsByModule(selectedModule).some(step => step.id === s.stepId)).length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {stepStatuses.filter(s => s.status === 'pending' && getStepsByModule(selectedModule).some(step => step.id === s.stepId)).length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {stepStatuses.filter(s => s.status === 'requires_approval' && getStepsByModule(selectedModule).some(step => step.id === s.stepId)).length}
                  </div>
                  <div className="text-sm text-gray-600">Needs Approval</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Steps */}
          <div className="space-y-3">
            {filteredSteps.map((step) => {
              const stepStatus = stepStatuses.find(s => s.stepId === step.id);
              const isExpanded = expandedSteps.has(step.id);
              const isCompleted = stepStatus?.status === 'completed';
              const isCurrent = stepStatus?.status === 'in_progress';
              const isPending = stepStatus?.status === 'pending';

              return (
                <Card key={step.id} className={`transition-all duration-200 ${
                  isCurrent ? 'ring-2 ring-blue-200 shadow-md' : 
                  isCompleted ? 'bg-green-50 border-green-200' : 
                  'hover:shadow-sm'
                }`}>
                  <Collapsible open={isExpanded} onOpenChange={() => toggleStepExpansion(step.id)}>
                    <CollapsibleTrigger asChild>
                      <div className="p-4 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                              isCompleted ? 'bg-green-500 border-green-500 text-white' :
                              isCurrent ? 'bg-blue-500 border-blue-500 text-white' :
                              'bg-gray-100 border-gray-300 text-gray-500'
                            }`}>
                              {isCompleted ? <CheckCircle className="h-5 w-5" /> : step.id}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{step.name}</h3>
                                {getStepStatusIcon(stepStatus?.status || 'pending')}
                                {stepStatus?.priority && (
                                  <Badge className={getPriorityColor(stepStatus.priority)}>
                                    {stepStatus.priority}
                                  </Badge>
                                )}
                                {step.requiresApproval && (
                                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                                    <Flag className="h-3 w-3 mr-1" />
                                    {step.approvalLevel}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>Duration: {step.estimatedDuration} days</span>
                                <span>Module: {step.subModule || step.module}</span>
                                {stepStatus?.assignedTo && (
                                  <span>Assigned: {stepStatus.assignedTo}</span>
                                )}
                                {stepStatus?.completedAt && (
                                  <span>Completed: {formatDate(new Date(stepStatus.completedAt), "MMM dd, yyyy")}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStepStatusColor(stepStatus?.status || 'pending')}>
                              {stepStatus?.status?.replace('_', ' ') || 'Pending'}
                            </Badge>
                            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">Required Fields</h4>
                            <div className="flex flex-wrap gap-1">
                              {step.requiredFields.map((field) => (
                                <Badge key={field} variant="outline" className="text-xs">
                                  {field}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">Success Criteria</h4>
                            <p className="text-sm text-gray-600">{step.successCriteria}</p>
                          </div>
                        </div>
                        
                        {stepStatus?.notes && (
                          <div className="mt-4">
                            <h4 className="font-medium text-sm text-gray-700 mb-2">Notes</h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{stepStatus.notes}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-4">
                          {!isCompleted && (
                            <Button
                              size="sm"
                              onClick={() => handleStepAction(step.id, 'complete')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark Complete
                            </Button>
                          )}
                          {isPending && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStepAction(step.id, 'start')}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          )}
                          {isCurrent && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStepAction(step.id, 'hold')}
                              >
                                <Pause className="h-4 w-4 mr-1" />
                                Hold
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStepAction(step.id, 'cancel')}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowStepDetails(step.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Step Details Dialog */}
      <Dialog open={showStepDetails !== null} onOpenChange={() => setShowStepDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {showStepDetails && getStepById(showStepDetails)?.name} - Step Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {showStepDetails && (
              <>
                <div>
                  <Label htmlFor="step-notes">Notes</Label>
                  <Textarea
                    id="step-notes"
                    value={stepNotes}
                    onChange={(e) => setStepNotes(e.target.value)}
                    placeholder="Add notes for this step..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="step-priority">Priority</Label>
                  <Select value={stepPriority} onValueChange={(value: any) => setStepPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowStepDetails(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => showStepDetails && markStepComplete.mutate(showStepDetails)}
                    disabled={markStepComplete.isPending}
                  >
                    {markStepComplete.isPending ? "Completing..." : "Mark Complete"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
