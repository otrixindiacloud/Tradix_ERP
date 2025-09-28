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
  X
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

interface WorkflowDashboardStats {
  totalWorkflows: number;
  completedWorkflows: number;
  inProgressWorkflows: number;
  blockedWorkflows: number;
  cancelledWorkflows: number;
  averageCompletionTime: number;
  efficiency: number;
  totalValue: number;
  monthlyTrends: Array<{
    month: string;
    completed: number;
    inProgress: number;
    blocked: number;
    cancelled: number;
  }>;
  stepBreakdown: Record<string, number>;
  priorityDistribution: Record<string, number>;
  teamPerformance: Array<{
    userId: string;
    userName: string;
    completedWorkflows: number;
    averageTime: number;
    efficiency: number;
  }>;
}

interface WorkflowFilter {
  status: string;
  priority: string;
  assignedTo: string;
  dateRange: string;
  searchTerm: string;
}

export default function WorkflowDashboard() {
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

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["workflow-dashboard-stats", filters],
    queryFn: async () => {
      const response = await fetch(`/api/workflow/analytics?period=${filters.dateRange}`);
      if (!response.ok) throw new Error("Failed to fetch dashboard stats");
      return await response.json();
    }
  });

  // Fetch workflow data
  const { data: workflows = [], isLoading: workflowsLoading } = useQuery({
    queryKey: ["workflow-dashboard-workflows", filters],
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
            <h1 className="text-2xl font-bold text-gray-900">Workflow Dashboard</h1>
            <p className="text-gray-600">Monitor and manage all workflow processes</p>
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

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search workflows..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select value={filters.assignedTo} onValueChange={(value) => setFilters(prev => ({ ...prev, assignedTo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
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

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.teamPerformance?.map((member: any) => (
                  <div key={member.userId} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{member.userName}</h4>
                      <p className="text-sm text-gray-500">User ID: {member.userId}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold">{member.completedWorkflows}</div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{member.averageTime} days</div>
                        <div className="text-xs text-gray-500">Avg Time</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{member.efficiency}%</div>
                        <div className="text-xs text-gray-500">Efficiency</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
