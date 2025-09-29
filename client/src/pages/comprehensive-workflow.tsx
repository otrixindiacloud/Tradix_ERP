import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3,
  Settings,
  Users,
  ShoppingCart,
  Warehouse,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  Search,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ComprehensiveWorkflowStepper from "@/components/workflow/comprehensive-workflow-stepper";
import EnhancedWorkflowProgress from "@/components/workflow/enhanced-workflow-progress";
import WorkflowDashboard from "@/components/workflow/workflow-dashboard";
import { 
  ENHANCED_WORKFLOW_STEPS, 
  WORKFLOW_MODULES,
  getStepsByModule,
  calculateProgress,
  type WorkflowProgress
} from "@/lib/enhanced-workflow-constants";

export default function ComprehensiveWorkflowPage() {
  const [viewMode, setViewMode] = useState<'stepper' | 'progress' | 'dashboard'>('stepper');
  const [selectedEntity, setSelectedEntity] = useState('QT-906876B531');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const { toast } = useToast();

  // Mock data for development
  const { data: workflowEntities = [] } = useQuery({
    queryKey: ["/api/workflow-entities"],
    queryFn: async () => {
      return [
        {
          id: "QT-906876B531",
          name: "Quote #QT-906876B531",
          type: "quotation",
          currentStep: 8,
          completedSteps: [1, 2, 3, 4, 5, 6, 7],
          status: "in_progress",
          progress: 58,
          module: "Purchase",
          subModule: "Supplier LPO Management",
          lastUpdated: new Date().toISOString(),
          assignedTo: "John Smith",
          priority: "High"
        },
        {
          id: "SO-2024-001",
          name: "Sales Order #SO-2024-001",
          type: "sales_order",
          currentStep: 5,
          completedSteps: [1, 2, 3, 4],
          status: "in_progress",
          progress: 33,
          module: "Sales",
          subModule: "Sales Order Management",
          lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          assignedTo: "Jane Doe",
          priority: "Medium"
        },
        {
          id: "REQ-2024-015",
          name: "Requisition #REQ-2024-015",
          type: "requisition",
          currentStep: 15,
          completedSteps: [8, 9, 10, 11, 12, 13, 14],
          status: "in_progress",
          progress: 47,
          module: "Inventory",
          subModule: "Inventory Items Management",
          lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          assignedTo: "Mike Johnson",
          priority: "Low"
        }
      ];
    },
  });

  const { data: currentWorkflow } = useQuery({
    queryKey: ["/api/workflow-progress", selectedEntity],
    queryFn: async () => {
      const entity = workflowEntities.find(e => e.id === selectedEntity);
      if (!entity) return null;

      return {
        id: `wf-${entity.id}`,
        entityId: entity.id,
        entityType: entity.type,
        currentStep: entity.currentStep,
        completedSteps: entity.completedSteps,
        status: entity.status,
        progress: entity.progress,
        lastUpdated: entity.lastUpdated,
        module: entity.module,
        subModule: entity.subModule,
        assignedTo: entity.assignedTo,
        priority: entity.priority
      } as WorkflowProgress;
    },
  });

  const handleStepClick = (stepId: number) => {
    const step = ENHANCED_WORKFLOW_STEPS.find(s => s.id === stepId);
    if (step) {
      toast({
        title: "Step Clicked",
        description: `Clicked on ${step.name} in ${step.module} Management`,
      });
    }
  };

  const handleMarkComplete = (stepId: number) => {
    const step = ENHANCED_WORKFLOW_STEPS.find(s => s.id === stepId);
    if (step) {
      toast({
        title: "Step Completed",
        description: `${step.name} has been marked as complete`,
      });
    }
  };

  const handleViewDetails = (stepId: number) => {
    const step = ENHANCED_WORKFLOW_STEPS.find(s => s.id === stepId);
    if (step) {
      toast({
        title: "View Details",
        description: `Viewing details for ${step.name}`,
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress": return <Clock className="h-4 w-4 text-blue-500" />;
      case "requires_approval": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50 border-green-200";
      case "in_progress": return "text-blue-600 bg-blue-50 border-blue-200";
      case "requires_approval": return "text-orange-600 bg-orange-50 border-orange-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "Sales": return <Users className="h-4 w-4" />;
      case "Purchase": return <ShoppingCart className="h-4 w-4" />;
      case "Inventory": return <Warehouse className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case "Sales": return "text-blue-600";
      case "Purchase": return "text-indigo-600";
      case "Inventory": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                Comprehensive ERP Workflow
              </h1>
              <p className="text-muted-foreground text-lg">
                Complete end-to-end workflow management across Sales, Purchase, and Inventory modules
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-blue-700">
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  <span className="font-medium">23 Total Steps</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Entity: {selectedEntity}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">View Mode</span>
          </div>
          <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <TabsList>
              <TabsTrigger value="stepper">Sequential Stepper</TabsTrigger>
              <TabsTrigger value="progress">Module Progress</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search entities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <Select value={selectedEntity} onValueChange={setSelectedEntity}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Entity" />
            </SelectTrigger>
            <SelectContent>
              {workflowEntities.map((entity) => (
                <SelectItem key={entity.id} value={entity.id}>
                  <div className="flex items-center gap-2">
                    {getModuleIcon(entity.module)}
                    <span>{entity.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>


      {/* Main Content */}
      <div className="space-y-6">
        {viewMode === 'stepper' && (
          <ComprehensiveWorkflowStepper
            currentStep={currentWorkflow?.currentStep || 8}
            completedSteps={currentWorkflow?.completedSteps || [1, 2, 3, 4, 5, 6, 7]}
            entityId={selectedEntity}
            entityName={workflowEntities.find(e => e.id === selectedEntity)?.name}
            onStepClick={handleStepClick}
            onMarkComplete={handleMarkComplete}
            onViewDetails={handleViewDetails}
            showModuleHeaders={true}
            showProgressBar={true}
            showStepDetails={true}
            compact={false}
          />
        )}

        {viewMode === 'progress' && (
          <EnhancedWorkflowProgress
            entityId={selectedEntity}
            entityType={currentWorkflow?.entityType || "quotation"}
            entityName={workflowEntities.find(e => e.id === selectedEntity)?.name}
            showAnalytics={true}
            showFilters={true}
          />
        )}

        {viewMode === 'dashboard' && (
          <WorkflowDashboard
            entityId={selectedEntity}
            showFilters={true}
          />
        )}
      </div>
    </div>
  );
}
