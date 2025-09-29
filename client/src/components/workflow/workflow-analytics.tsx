import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Calendar,
  DollarSign,
  Target,
  Zap,
  Activity,
  PieChart,
  LineChart,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils";
import { WORKFLOW_STEPS } from "@/lib/constants";

interface WorkflowAnalyticsData {
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
    totalValue: number;
  }>;
  stepBreakdown: Record<string, number>;
  priorityDistribution: Record<string, number>;
  teamPerformance: Array<{
    userId: string;
    userName: string;
    completedWorkflows: number;
    averageTime: number;
    efficiency: number;
    totalValue: number;
  }>;
  stepEfficiency: Array<{
    stepName: string;
    averageTime: number;
    completionRate: number;
    bottleneck: boolean;
  }>;
  customerPerformance: Array<{
    customerId: string;
    customerName: string;
    totalWorkflows: number;
    completedWorkflows: number;
    averageTime: number;
    totalValue: number;
  }>;
}

interface WorkflowAnalyticsProps {
  period?: string;
  showFilters?: boolean;
  className?: string;
}

export default function WorkflowAnalytics({ 
  period = "30d", 
  showFilters = true,
  className 
}: WorkflowAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [selectedMetric, setSelectedMetric] = useState("overview");

  // Fetch analytics data
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ["workflow-analytics", selectedPeriod],
    queryFn: async () => {
      const response = await fetch(`/api/workflow/analytics?period=${selectedPeriod}`);
      if (!response.ok) throw new Error("Failed to fetch workflow analytics");
      return await response.json();
    }
  });

  // Calculate derived metrics
  const derivedMetrics = useMemo(() => {
    if (!analytics) return null;

    const completionRate = analytics.totalWorkflows > 0 
      ? (analytics.completedWorkflows / analytics.totalWorkflows) * 100 
      : 0;

    const averageValue = analytics.completedWorkflows > 0 
      ? analytics.totalValue / analytics.completedWorkflows 
      : 0;

    const efficiencyTrend = analytics.monthlyTrends?.length > 1 
      ? analytics.monthlyTrends[analytics.monthlyTrends.length - 1].completed - 
        analytics.monthlyTrends[analytics.monthlyTrends.length - 2].completed
      : 0;

    return {
      completionRate,
      averageValue,
      efficiencyTrend,
      totalSteps: WORKFLOW_STEPS.length
    };
  }, [analytics]);

  // Get step efficiency data
  const stepEfficiencyData = useMemo(() => {
    if (!analytics?.stepEfficiency) return [];

    return analytics.stepEfficiency.map(step => ({
      ...step,
      efficiency: step.completionRate * 100,
      status: step.bottleneck ? "bottleneck" : step.completionRate > 0.8 ? "good" : "needs_attention"
    }));
  }, [analytics]);

  // Get top performers
  const topPerformers = useMemo(() => {
    if (!analytics?.teamPerformance) return [];

    return [...analytics.teamPerformance]
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 5);
  }, [analytics]);

  // Get bottleneck steps
  const bottleneckSteps = useMemo(() => {
    if (!analytics?.stepEfficiency) return [];

    return analytics.stepEfficiency
      .filter(step => step.bottleneck)
      .sort((a, b) => b.averageTime - a.averageTime);
  }, [analytics]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-400 mb-4" />
          <p className="text-red-600">Failed to load analytics data</p>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflow Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into workflow performance</p>
        </div>
        <div className="flex items-center space-x-2">
          {showFilters && (
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
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
                <p className="text-2xl font-bold">{analytics.totalWorkflows}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-600">Completion Rate:</span>
                <span className="ml-2 font-medium">{derivedMetrics?.completionRate.toFixed(1)}%</span>
              </div>
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
            <div className="mt-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-600">Success Rate:</span>
                <span className="ml-2 font-medium text-green-600">
                  {derivedMetrics?.completionRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Completion Time</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.averageCompletionTime} days</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-600">Efficiency:</span>
                <span className="ml-2 font-medium">{analytics.efficiency}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(analytics.totalValue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-600">Avg. Value:</span>
                <span className="ml-2 font-medium">
                  {formatCurrency(derivedMetrics?.averageValue || 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="steps">Step Analysis</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workflow Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">{analytics.completedWorkflows}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({derivedMetrics?.completionRate.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">In Progress</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">{analytics.inProgressWorkflows}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({((analytics.inProgressWorkflows / analytics.totalWorkflows) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Blocked</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">{analytics.blockedWorkflows}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({((analytics.blockedWorkflows / analytics.totalWorkflows) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span className="text-sm">Cancelled</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">{analytics.cancelledWorkflows}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({((analytics.cancelledWorkflows / analytics.totalWorkflows) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
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
                  {Object.entries(analytics.priorityDistribution || {}).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          priority === "Urgent" ? "bg-red-500" :
                          priority === "High" ? "bg-orange-500" :
                          priority === "Medium" ? "bg-yellow-500" :
                          "bg-green-500"
                        }`} />
                        <span className="text-sm">{priority}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{count}</span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({((count / analytics.totalWorkflows) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="steps" className="space-y-4">
          <div className="space-y-6">
            {/* Step Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle>Step Efficiency Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stepEfficiencyData.map((step, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{step.stepName}</span>
                          {step.bottleneck && (
                            <Badge variant="destructive" className="text-xs">Bottleneck</Badge>
                          )}
                          {step.status === "good" && (
                            <Badge variant="default" className="bg-green-100 text-green-800 text-xs">Good</Badge>
                          )}
                          {step.status === "needs_attention" && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs">Needs Attention</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {step.averageTime} days avg
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Progress value={step.efficiency} className="h-2" />
                        </div>
                        <div className="text-sm font-medium">
                          {step.completionRate.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bottleneck Analysis */}
            {bottleneckSteps.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span>Bottleneck Steps</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bottleneckSteps.map((step, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-red-900">{step.stepName}</span>
                          <span className="text-sm text-red-700">{step.averageTime} days average</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          This step is causing delays in workflow completion
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((member, index) => (
                  <div key={member.userId} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{member.userName}</h4>
                      <p className="text-sm text-gray-500">User ID: {member.userId}</p>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-center">
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
                      <div>
                        <div className="text-lg font-bold">{formatCurrency(member.totalValue)}</div>
                        <div className="text-xs text-gray-500">Total Value</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyTrends?.slice(-6).map((trend, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{trend.month}</span>
                      <span className="text-sm text-gray-500">
                        {trend.completed + trend.inProgress + trend.blocked} total
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
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
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">
                          {formatCurrency(trend.totalValue)}
                        </div>
                        <div className="text-xs text-gray-500">Value</div>
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
