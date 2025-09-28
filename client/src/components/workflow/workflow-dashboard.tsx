import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  ShoppingCart,
  Warehouse,
  ArrowRight,
  Calendar,
  Target,
  Activity,
  PieChart,
  Filter,
  Search,
  Download,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ENHANCED_WORKFLOW_STEPS, 
  WORKFLOW_MODULES,
  getStepsByModule,
  calculateProgress,
  type WorkflowProgress
} from "@/lib/enhanced-workflow-constants";

interface WorkflowDashboardProps {
  entityId?: string;
  showFilters?: boolean;
  className?: string;
}

interface WorkflowStats {
  totalSteps: number;
  completedSteps: number;
  inProgressSteps: number;
  pendingSteps: number;
  onHoldSteps: number;
  cancelledSteps: number;
  requiresApprovalSteps: number;
  overallProgress: number;
  averageCompletionTime: number;
  moduleStats: {
    [key: string]: {
      total: number;
      completed: number;
      inProgress: number;
      pending: number;
      progress: number;
    };
  };
}

export default function WorkflowDashboard({ 
  entityId,
  showFilters = true,
  className 
}: WorkflowDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedModule, setSelectedModule] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for development - replace with actual API calls
  const { data: workflowStats, isLoading } = useQuery({
    queryKey: ["/api/workflow-stats", selectedTimeRange, selectedModule],
    queryFn: async () => {
      // Mock comprehensive workflow statistics
      const salesSteps = getStepsByModule('Sales');
      const purchaseSteps = getStepsByModule('Purchase');
      const inventorySteps = getStepsByModule('Inventory');
      
      return {
        totalSteps: ENHANCED_WORKFLOW_STEPS.length,
        completedSteps: 12,
        inProgressSteps: 3,
        pendingSteps: 8,
        onHoldSteps: 1,
        cancelledSteps: 0,
        requiresApprovalSteps: 2,
        overallProgress: 65,
        averageCompletionTime: 2.5,
        moduleStats: {
          Sales: {
            total: salesSteps.length,
            completed: 7,
            inProgress: 0,
            pending: 0,
            progress: 100
          },
          Purchase: {
            total: purchaseSteps.length,
            completed: 3,
            inProgress: 2,
            pending: 2,
            progress: 50
          },
          Inventory: {
            total: inventorySteps.length,
            completed: 2,
            inProgress: 1,
            pending: 6,
            progress: 25
          }
        }
      } as WorkflowStats;
    },
  });

  const { data: recentActivities = [] } = useQuery({
    queryKey: ["/api/recent-activities", selectedTimeRange],
    queryFn: async () => {
      // Mock recent activities
      return [
        {
          id: 1,
          action: "Step Completed",
          step: "Customer PO Upload",
          module: "Sales",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: "John Smith",
          status: "completed"
        },
        {
          id: 2,
          action: "Step Started",
          step: "Supplier LPO Management",
          module: "Purchase",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user: "Jane Doe",
          status: "in_progress"
        },
        {
          id: 3,
          action: "Step Completed",
          step: "Sales Order Management",
          module: "Sales",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          user: "Mike Johnson",
          status: "completed"
        },
        {
          id: 4,
          action: "Step Requires Approval",
          step: "Material Requests Management",
          module: "Inventory",
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          user: "Sarah Wilson",
          status: "requires_approval"
        },
        {
          id: 5,
          action: "Step Completed",
          step: "Quotation Management",
          module: "Sales",
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          user: "David Brown",
          status: "completed"
        }
      ];
    },
  });

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
      default: return <BarChart3 className="h-4 w-4" />;
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
                  Workflow Dashboard
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Comprehensive overview of ERP workflow progress and performance
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-blue-700">
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  <span className="font-medium">Overall Progress: {workflowStats?.overallProgress || 0}%</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg. Completion: {workflowStats?.averageCompletionTime || 0} days
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

      {/* Filters */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters</span>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Modules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="Sales">Sales Management</SelectItem>
                <SelectItem value="Purchase">Purchase Management</SelectItem>
                <SelectItem value="Inventory">Inventory Management</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Steps</p>
                <p className="text-3xl font-bold text-gray-900">{workflowStats?.totalSteps || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                <span>+12% from last week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{workflowStats?.completedSteps || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <span>{Math.round(((workflowStats?.completedSteps || 0) / (workflowStats?.totalSteps || 1)) * 100)}% completion rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{workflowStats?.inProgressSteps || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <Activity className="h-4 w-4 mr-1 text-blue-500" />
                <span>Active workflows</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Needs Approval</p>
                <p className="text-3xl font-bold text-orange-600">{workflowStats?.requiresApprovalSteps || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <span>Pending approval</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Module Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(workflowStats?.moduleStats || {}).map(([module, stats]) => (
              <div key={module} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getModuleIcon(module)}
                    <span className="font-medium">{module}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{stats.completed}/{stats.total}</span>
                    <Badge variant="outline" className={getModuleColor(module)}>
                      {stats.progress}%
                    </Badge>
                  </div>
                </div>
                <Progress value={stats.progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Completed: {stats.completed}</span>
                  <span>In Progress: {stats.inProgress}</span>
                  <span>Pending: {stats.pending}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="mt-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{activity.action}</span>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.step} in {activity.module}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>by {activity.user}</span>
                      <span>•</span>
                      <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Module Breakdown */}
      <Tabs defaultValue="Sales" className="space-y-4">
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

        {Object.entries(WORKFLOW_MODULES).map(([moduleKey, module]) => (
          <TabsContent key={moduleKey} value={moduleKey} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${getModuleColor(moduleKey).replace('text-', 'from-').replace('-600', '-500')} to-gray-500 flex items-center justify-center`}>
                      {getModuleIcon(moduleKey)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{module.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{workflowStats?.moduleStats[moduleKey]?.progress || 0}%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {module.steps.map((step) => {
                    const isCompleted = Math.random() > 0.5; // Mock completion status
                    const isCurrent = Math.random() > 0.8; // Mock current status
                    
                    return (
                      <div key={step.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isCurrent ? 'border-blue-200 bg-blue-50' : 
                        isCompleted ? 'border-green-200 bg-green-50' : 
                        'border-gray-200 bg-gray-50'
                      }`}>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                          isCompleted ? 'bg-green-500 border-green-500 text-white' :
                          isCurrent ? 'bg-blue-500 border-blue-500 text-white' :
                          'bg-gray-100 border-gray-300 text-gray-500'
                        }`}>
                          {isCompleted ? <CheckCircle className="h-4 w-4" /> : step.id}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{step.name}</span>
                            {isCurrent && <Badge variant="outline" className="text-blue-600">Current</Badge>}
                            {isCompleted && <Badge variant="outline" className="text-green-600">Completed</Badge>}
                          </div>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {step.estimatedDuration} days
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
