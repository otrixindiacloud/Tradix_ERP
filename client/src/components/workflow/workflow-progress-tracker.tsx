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
  Upload,
  ShoppingCart
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
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { WORKFLOW_STEPS } from "@/lib/constants";

interface WorkflowProgress {
  id: string;
  entityId: string;
  entityType: string;
  entityName: string;
  currentStep: number;
  completedSteps: number[];
  status: "pending" | "in_progress" | "completed" | "blocked" | "cancelled";
  progress: number;
  nextAction: string;
  estimatedCompletion: string | null;
  blockers: string[];
  lastUpdated: string;
  assignedTo?: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  totalValue: number;
  startDate: string;
  completionDate?: string;
  duration: number; // in days
  efficiency: number; // percentage
  
  // Enhanced fields for better flow implementation
  stepDetails: {
    stepId: number;
    stepName: string;
    description: string;
    estimatedDuration: number;
    actualDuration?: number;
    requiredFields: string[];
    completedFields: string[];
    missingFields: string[];
    dependencies: number[];
    dependenciesMet: boolean;
    validationRules: Record<string, any>;
    successCriteria: string;
    nextActions: string[];
    status: "not_started" | "in_progress" | "completed" | "blocked";
    startTime?: string;
    endTime?: string;
    notes?: string;
    attachments?: string[];
  }[];
  
  // Workflow metadata
  workflowVersion: string;
  createdBy: string;
  lastModifiedBy: string;
  tags: string[];
  category: string;
  department: string;
  location: string;
  
  // Performance metrics
  stepEfficiency: Record<number, number>; // efficiency per step
  averageStepDuration: number;
  bottlenecks: number[]; // step IDs that are bottlenecks
  riskFactors: string[];
  
  // Compliance and audit
  auditTrail: {
    timestamp: string;
    action: string;
    performedBy: string;
    details: string;
    changes?: Record<string, any>;
  }[];
  
  // Notifications and alerts
  notifications: {
    id: string;
    type: "info" | "warning" | "error" | "success";
    message: string;
    timestamp: string;
    read: boolean;
    actionRequired: boolean;
  }[];
  
  // Escalation
  escalationLevel: number;
  escalationReason?: string;
  escalatedTo?: string;
  escalationDate?: string;
}

interface WorkflowAnalytics {
  totalWorkflows: number;
  completedWorkflows: number;
  inProgressWorkflows: number;
  blockedWorkflows: number;
  averageCompletionTime: number;
  efficiency: number;
  stepBreakdown: Record<string, number>;
  priorityDistribution: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    completed: number;
    inProgress: number;
    blocked: number;
  }>;
  
  // Enhanced analytics for better flow implementation
  stepAnalytics: {
    stepId: number;
    stepName: string;
    averageDuration: number;
    completionRate: number;
    bottleneckScore: number;
    commonBlockers: string[];
    efficiency: number;
    successRate: number;
  }[];
  
  performanceMetrics: {
    onTimeDelivery: number;
    averageDelay: number;
    reworkRate: number;
    qualityScore: number;
    customerSatisfaction: number;
    costEfficiency: number;
  };
  
  riskAnalysis: {
    highRiskWorkflows: number;
    mediumRiskWorkflows: number;
    lowRiskWorkflows: number;
    commonRiskFactors: string[];
    escalationRate: number;
  };
  
  complianceMetrics: {
    auditCompliance: number;
    documentationCompleteness: number;
    approvalCycleTime: number;
    regulatoryAdherence: number;
  };
  
  resourceUtilization: {
    departmentUtilization: Record<string, number>;
    workloadDistribution: Record<string, number>;
    capacityPlanning: {
      currentCapacity: number;
      projectedDemand: number;
      capacityGap: number;
    };
  };
  
  predictiveAnalytics: {
    forecastedCompletion: Array<{
      date: string;
      expectedCompletions: number;
      confidence: number;
    }>;
    trendAnalysis: {
      direction: "up" | "down" | "stable";
      changeRate: number;
      seasonality: boolean;
    };
  };
}

interface WorkflowProgressTrackerProps {
  entityId?: string;
  entityType?: string;
  showAnalytics?: boolean;
  className?: string;
}

export default function WorkflowProgressTracker({ 
  entityId, 
  entityType = "enquiry",
  showAnalytics = false,
  className 
}: WorkflowProgressTrackerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowProgress | null>(null);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  const [selectedStep, setSelectedStep] = useState<number>(0);

  // Fetch workflow progress data
  const { data: workflows = [], isLoading: workflowsLoading } = useQuery({
    queryKey: ["workflow-progress", entityId, entityType],
    queryFn: async () => {
      if (entityId) {
        // Get specific workflow progress
        const response = await fetch(`/api/workflow/progress/${entityId}?entityType=${entityType}`);
        if (!response.ok) throw new Error("Failed to fetch workflow progress");
        return [await response.json()];
      } else {
        // Get all workflows
        const response = await fetch("/api/workflow/progress");
        if (!response.ok) throw new Error("Failed to fetch workflows");
        return await response.json();
      }
    }
  });

  // Fetch analytics if requested
  const { data: analytics } = useQuery({
    queryKey: ["workflow-analytics"],
    queryFn: async () => {
      const response = await fetch("/api/workflow/analytics?period=30d");
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return await response.json();
    },
    enabled: showAnalytics
  });

  // Complete workflow step mutation
  const completeStepMutation = useMutation({
    mutationFn: async ({ step, entityId, notes }: { step: string; entityId: string; notes: string }) => {
      const response = await fetch(`/api/workflow/complete/${step}/${entityId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes })
      });
      if (!response.ok) throw new Error("Failed to complete step");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow-progress"] });
      setIsCompleteDialogOpen(false);
      setCompletionNotes("");
      toast({
        title: "Success",
        description: "Workflow step completed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete workflow step",
        variant: "destructive",
      });
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress": return <Play className="h-4 w-4 text-blue-500" />;
      case "blocked": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "cancelled": return <X className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-yellow-100 text-white border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStepIcon = (stepId: number) => {
    const step = WORKFLOW_STEPS.find(s => s.id === stepId);
    switch (step?.name) {
      case "Customer": return <User className="h-4 w-4" />;
      case "Enquiry": return <FileText className="h-4 w-4" />;
      case "Quotation": return <FileText className="h-4 w-4" />;
      case "Acceptance": return <CheckCircle className="h-4 w-4" />;
      case "Customer PO Upload": return <Upload className="h-4 w-4" />;
      case "Sales Order": return <ShoppingCart className="h-4 w-4" />;
      case "Supplier LPO": return <Truck className="h-4 w-4" />;
      case "Goods Receipt": return <Package className="h-4 w-4" />;
      case "Inventory": return <Package className="h-4 w-4" />;
      case "Delivery Note": return <Truck className="h-4 w-4" />;
      case "Invoice": return <DollarSign className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const calculateEfficiency = (workflow: WorkflowProgress) => {
    const expectedDuration = 30; // Expected 30 days for full workflow
    const actualDuration = workflow.duration;
    return Math.max(0, Math.min(100, (expectedDuration / actualDuration) * 100));
  };

  if (workflowsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>

      {/* Analytics Overview */}
      {showAnalytics && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                  <p className="text-2xl font-bold">{analytics.totalWorkflows}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.completedWorkflows}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{analytics.inProgressWorkflows}</p>
                </div>
                <Play className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Efficiency</p>
                  <p className="text-2xl font-bold text-purple-600">{analytics.efficiency}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}


      {/* Workflow Details Dialog */}
      {selectedWorkflow && (
        <Dialog open={!!selectedWorkflow} onOpenChange={() => setSelectedWorkflow(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Workflow Details - {selectedWorkflow.entityName}</span>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(selectedWorkflow.priority)}>
                    {selectedWorkflow.priority}
                  </Badge>
                  <Badge variant="outline">
                    {selectedWorkflow.status.replace('_', ' ')}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Entity ID</Label>
                        <p className="text-sm">{selectedWorkflow.entityId}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Entity Type</Label>
                        <p className="text-sm capitalize">{selectedWorkflow.entityType}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Assigned To</Label>
                        <p className="text-sm">{selectedWorkflow.assignedTo || "Unassigned"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Start Date</Label>
                        <p className="text-sm">{formatDate(selectedWorkflow.startDate)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Progress Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Progress</Label>
                        <div className="flex items-center space-x-2">
                          <Progress value={selectedWorkflow.progress} className="flex-1" />
                          <span className="text-sm font-medium">{selectedWorkflow.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Total Value</Label>
                        <p className="text-sm font-medium">{formatCurrency(selectedWorkflow.totalValue)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Duration</Label>
                        <p className="text-sm">{selectedWorkflow.duration} days</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Efficiency</Label>
                        <p className="text-sm">{calculateEfficiency(selectedWorkflow).toFixed(1)}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="steps" className="space-y-4">
                <div className="space-y-4">
                  {WORKFLOW_STEPS.map((step) => {
                    const isCompleted = selectedWorkflow.completedSteps.includes(step.id);
                    const isCurrent = step.id === selectedWorkflow.currentStep;
                    const isPending = step.id > selectedWorkflow.currentStep;
                    
                    return (
                      <div key={step.id} className={`
                        flex items-center space-x-4 p-4 border rounded-lg
                        ${isCompleted ? 'bg-green-50 border-green-200' : 
                          isCurrent ? 'bg-blue-50 border-blue-200' : 
                          'bg-gray-50 border-gray-200'}
                      `}>
                        <div className={`
                          flex items-center justify-center w-10 h-10 rounded-full border-2
                          ${isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : isCurrent 
                              ? 'bg-blue-500 border-blue-500 text-white' 
                              : 'bg-gray-100 border-gray-300 text-gray-500'
                          }
                        `}>
                          {isCompleted ? <CheckCircle className="h-5 w-5" /> : step.id}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{step.name}</h4>
                          <p className="text-sm text-gray-600">{step.path}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStepIcon(step.id)}
                          <Badge variant={isCompleted ? "default" : isCurrent ? "secondary" : "outline"}>
                            {isCompleted ? "Completed" : isCurrent ? "Current" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Timeline view coming soon</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Efficiency</Label>
                          <p className="text-2xl font-bold text-green-600">
                            {calculateEfficiency(selectedWorkflow).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Average Step Time</Label>
                          <p className="text-sm">{Math.round(selectedWorkflow.duration / 12)} days</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Steps Completed</Label>
                          <p className="text-2xl font-bold">
                            {selectedWorkflow.completedSteps.length} / 12
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Remaining Steps</Label>
                          <p className="text-sm">{12 - selectedWorkflow.completedSteps.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Complete Step Dialog */}
      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Workflow Step</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Step</Label>
              <p className="text-sm font-medium">
                {WORKFLOW_STEPS.find(s => s.id === selectedStep)?.name || "Unknown Step"}
              </p>
            </div>
            <div>
              <Label htmlFor="completion-notes">Completion Notes</Label>
              <Textarea
                id="completion-notes"
                placeholder="Add notes about step completion..."
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedWorkflow) {
                    completeStepMutation.mutate({
                      step: WORKFLOW_STEPS.find(s => s.id === selectedStep)?.name.toLowerCase().replace(' ', '-') || '',
                      entityId: selectedWorkflow.entityId,
                      notes: completionNotes
                    });
                  }
                }}
                disabled={completeStepMutation.isPending}
              >
                Complete Step
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
