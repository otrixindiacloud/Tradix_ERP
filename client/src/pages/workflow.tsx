import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  FileText, 
  Package, 
  Truck, 
  DollarSign,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Bell,
  Search,
  Plus,
  X,
  Upload,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { WORKFLOW_STEPS } from "@/lib/constants";
import WorkflowProgressTracker from "@/components/workflow/workflow-progress-tracker";
import WorkflowStepCompletion from "@/components/workflow/workflow-step-completion";
import WorkflowNavigation from "@/components/workflow/workflow-navigation";

interface WorkflowStats {
  totalWorkflows: number;
  completedWorkflows: number;
  inProgressWorkflows: number;
  blockedWorkflows: number;
  averageCompletionTime: number;
  efficiency: number;
  totalValue: number;
  stepBreakdown: Record<string, number>;
  priorityDistribution: Record<string, number>;
}

interface WorkflowFilter {
  status: string;
  priority: string;
  assignedTo: string;
  dateRange: string;
  searchTerm: string;
}

export default function Workflow() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [filters, setFilters] = useState<WorkflowFilter>({
    status: "all",
    priority: "all",
    assignedTo: "all",
    dateRange: "30d",
    searchTerm: ""
  });
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Fetch workflow statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["workflow-stats", filters],
    queryFn: async () => {
      const response = await fetch(`/api/workflow/analytics?period=${filters.dateRange}`);
      if (!response.ok) throw new Error("Failed to fetch workflow stats");
      return await response.json();
    }
  });

  // Fetch workflow data
  const { data: workflows = [], isLoading: workflowsLoading } = useQuery({
    queryKey: ["workflow-data", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.priority !== "all") params.append("priority", filters.priority);
      if (filters.assignedTo !== "all") params.append("assignedTo", filters.assignedTo);
      if (filters.searchTerm) params.append("search", filters.searchTerm);

      const response = await fetch(`/api/workflow/progress?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch workflows");
      return await response.json();
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

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
    // Navigate to the appropriate page based on step
    const step = WORKFLOW_STEPS.find(s => s.id === stepId);
    if (step) {
      navigate(step.path);
    }
  };

  const handleStepComplete = (stepId: number, notes: string) => {
    setCompletedSteps(prev => [...prev, stepId]);
    setCurrentStep(stepId + 1);
    toast({
      title: "Step Completed",
      description: `Step ${stepId} has been completed successfully`,
    });
  };

  const handleStepSkip = (stepId: number, reason: string) => {
    setCurrentStep(stepId + 1);
    toast({
      title: "Step Skipped",
      description: `Step ${stepId} has been skipped: ${reason}`,
      variant: "destructive",
    });
  };

  const handleStepBlock = (stepId: number, reason: string) => {
    toast({
      title: "Step Blocked",
      description: `Step ${stepId} has been blocked: ${reason}`,
      variant: "destructive",
    });
  };

  if (statsLoading || workflowsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workflow Management</h1>
            <p className="text-gray-600">Manage and track all workflow processes</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                <p className="text-2xl font-bold">{stats?.totalWorkflows || 0}</p>
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
                <p className="text-2xl font-bold text-green-600">{stats?.completedWorkflows || 0}</p>
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
                <p className="text-2xl font-bold text-blue-600">{stats?.inProgressWorkflows || 0}</p>
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
                <p className="text-2xl font-bold text-purple-600">{stats?.efficiency || 0}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workflow Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Progress Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {WORKFLOW_STEPS.map((step, index) => {
                    const stepCount = stats?.stepBreakdown?.[step.name] || 0;
                    const percentage = stats?.totalWorkflows ? (stepCount / stats.totalWorkflows) * 100 : 0;
                    
                    return (
                      <div key={step.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                              {step.id}
                            </div>
                            <span className="text-sm font-medium">{step.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{stepCount} workflows</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats?.priorityDistribution || {}).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          priority === "Urgent" ? "bg-red-500" :
                          priority === "High" ? "bg-orange-500" :
                          priority === "Medium" ? "bg-yellow-500" :
                          "bg-green-500"
                        }`} />
                        <span className="text-sm font-medium">{priority}</span>
                      </div>
                      <span className="text-sm text-gray-500">{count} workflows</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.slice(0, 5).map((workflow: any) => (
                  <div key={workflow.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(workflow.status)}
                      <div>
                        <p className="text-sm font-medium">{workflow.entityName}</p>
                        <p className="text-xs text-gray-500">
                          {WORKFLOW_STEPS.find(s => s.id === workflow.currentStep)?.name || "Unknown Step"}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Progress value={workflow.progress} className="h-2" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(workflow.totalValue)}</p>
                      <p className="text-xs text-gray-500">{workflow.duration} days</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation" className="space-y-4">
          <WorkflowNavigation
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <WorkflowProgressTracker showAnalytics={false} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.monthlyTrends?.slice(-6).map((trend: any) => (
                    <div key={trend.month} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{trend.month}</span>
                        <span className="text-sm text-gray-500">
                          {trend.completed + trend.inProgress + trend.blocked} total
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{trend.completed}</div>
                          <div className="text-xs text-gray-500">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{trend.inProgress}</div>
                          <div className="text-xs text-gray-500">In Progress</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">{trend.blocked}</div>
                          <div className="text-xs text-gray-500">Blocked</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Average Completion Time</Label>
                    <p className="text-2xl font-bold">{stats?.averageCompletionTime || 0} days</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Total Value Processed</Label>
                    <p className="text-2xl font-bold">{formatCurrency(stats?.totalValue || 0)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Success Rate</Label>
                    <p className="text-2xl font-bold">
                      {stats?.totalWorkflows ? 
                        Math.round((stats.completedWorkflows / stats.totalWorkflows) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Step Completion Dialog */}
      {selectedWorkflow && (
        <WorkflowStepCompletion
          entityId={selectedWorkflow.entityId}
          entityType={selectedWorkflow.entityType}
          currentStep={selectedWorkflow.currentStep}
          onStepComplete={handleStepComplete}
          onStepSkip={handleStepSkip}
          onStepBlock={handleStepBlock}
        />
      )}
    </div>
  );
}