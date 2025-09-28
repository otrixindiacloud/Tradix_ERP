import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  Users,
  Table as TableIcon,
  BarChart3,
  PieChart,
  AlertCircle
} from 'lucide-react';

interface DatabaseHealth {
  connected: boolean;
  databaseSize: string;
  tableCount: number;
  totalRows: number;
  tableRowCounts: Array<{
    tableName: string;
    rowCount: number;
    error?: string;
  }>;
  timestamp: string;
}

interface ValidationReport {
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  totalTables: number;
  validTables: number;
  tablesWithIssues: number;
  totalRows: number;
  totalIssues: number;
  tableResults: Array<{
    tableName: string;
    exists: boolean;
    rowCount: number;
    hasData: boolean;
    issues: string[];
    warnings: string[];
    recommendations: string[];
    isValid: boolean;
  }>;
  recommendations: string[];
  timestamp: string;
}

const DatabaseHealth: React.FC = () => {
  const [health, setHealth] = useState<DatabaseHealth | null>(null);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch database health
  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/table-validation/health');
      const result = await response.json();
      
      if (result.success) {
        setHealth(result.health);
        setLastUpdated(new Date());
      } else {
        setError(result.error || 'Failed to fetch database health');
      }
    } catch (err) {
      setError('Network error while fetching database health');
      console.error('Error fetching database health:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch validation report
  const fetchValidationReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/table-validation/validate');
      const result = await response.json();
      
      if (result.success) {
        setValidationReport(result.report);
      } else {
        setError(result.error || 'Failed to fetch validation report');
      }
    } catch (err) {
      setError('Network error while fetching validation report');
      console.error('Error fetching validation report:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get health status color
  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get health status icon
  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'good': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'fair': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'poor': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  // Get health percentage
  const getHealthPercentage = (status: string) => {
    switch (status) {
      case 'excellent': return 100;
      case 'good': return 80;
      case 'fair': return 60;
      case 'poor': return 30;
      default: return 0;
    }
  };

  // Get table health status
  const getTableHealthStatus = (table: any) => {
    if (!table.exists) return 'error';
    if (table.issues.length > 0) return 'error';
    if (table.warnings.length > 0) return 'warning';
    if (table.rowCount === 0) return 'empty';
    return 'healthy';
  };

  // Get table health color
  const getTableHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'empty': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  // Get table health icon
  const getTableHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'empty': return <TableIcon className="h-4 w-4 text-gray-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchValidationReport();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Database Health Dashboard</h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchHealth} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Health
          </Button>
          <Button onClick={fetchValidationReport} disabled={loading}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Run Validation
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Overall Health Status */}
      {validationReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getHealthIcon(validationReport.overallHealth)}
              <span>Overall Database Health</span>
              <Badge variant="outline" className={getHealthColor(validationReport.overallHealth)}>
                {validationReport.overallHealth.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Health Score</span>
                    <span>{getHealthPercentage(validationReport.overallHealth)}%</span>
                  </div>
                  <Progress 
                    value={getHealthPercentage(validationReport.overallHealth)} 
                    className="h-2"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{validationReport.validTables}</div>
                  <div className="text-sm text-muted-foreground">Valid Tables</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{validationReport.tablesWithIssues}</div>
                  <div className="text-sm text-muted-foreground">Issues Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{validationReport.totalIssues}</div>
                  <div className="text-sm text-muted-foreground">Total Issues</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{validationReport.totalRows.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Rows</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Database Statistics */}
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {health.connected ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={health.connected ? 'text-green-600' : 'text-red-600'}>
                  {health.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Size</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{health.databaseSize}</div>
              <p className="text-xs text-muted-foreground">Total storage used</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
              <TableIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{health.tableCount}</div>
              <p className="text-xs text-muted-foreground">Database tables</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{health.totalRows.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Data records</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table Health Status */}
      {validationReport && (
        <Card>
          <CardHeader>
            <CardTitle>Table Health Status</CardTitle>
            <p className="text-sm text-muted-foreground">
              Detailed health status for each table in the database
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {validationReport.tableResults.map((table) => {
                const healthStatus = getTableHealthStatus(table);
                return (
                  <div key={table.tableName} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTableHealthIcon(healthStatus)}
                      <div>
                        <div className="font-medium">{table.tableName}</div>
                        <div className="text-sm text-muted-foreground">
                          {table.rowCount.toLocaleString()} rows
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getTableHealthColor(healthStatus)}>
                        {healthStatus}
                      </Badge>
                      {table.issues.length > 0 && (
                        <Badge variant="destructive">
                          {table.issues.length} issues
                        </Badge>
                      )}
                      {table.warnings.length > 0 && (
                        <Badge variant="secondary">
                          {table.warnings.length} warnings
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {validationReport && validationReport.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span>Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {validationReport.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <div className="text-center text-sm text-muted-foreground">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default DatabaseHealth;
