import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Activity,
  HardDrive,
  Table as TableIcon,
  BarChart3,
  Settings,
  Wrench,
  Eye,
  Download,
  Upload,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import TableValidation from './TableValidation';
import DatabaseHealth from './DatabaseHealth';

const DatabaseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'health', label: 'Health Check', icon: Activity },
    { id: 'tables', label: 'Table Management', icon: TableIcon },
    { id: 'validation', label: 'Validation', icon: CheckCircle },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench }
  ];

  const handleRunHealthCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      // This would trigger a health check
      console.log('Running health check...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      setError('Failed to run health check');
    } finally {
      setLoading(false);
    }
  };

  const handleRunValidation = async () => {
    setLoading(true);
    setError(null);
    try {
      // This would trigger a validation
      console.log('Running validation...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      setError('Failed to run validation');
    } finally {
      setLoading(false);
    }
  };

  const handleRunMaintenance = async () => {
    setLoading(true);
    setError(null);
    try {
      // This would trigger maintenance tasks
      console.log('Running maintenance...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      setError('Failed to run maintenance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Database Management</h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleRunHealthCheck} disabled={loading}>
            <Activity className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Health Check
          </Button>
          <Button onClick={handleRunValidation} disabled={loading}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Validate
          </Button>
          <Button onClick={handleRunMaintenance} disabled={loading}>
            <Wrench className="h-4 w-4 mr-2" />
            Maintenance
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  All systems operational
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
                <TableIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">50+</div>
                <p className="text-xs text-muted-foreground">
                  Database tables
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">95%</div>
                <Progress value={95} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Excellent condition
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Check</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2m</div>
                <p className="text-xs text-muted-foreground">
                  Minutes ago
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Tables
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Database Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Health check completed</span>
                  <span className="text-muted-foreground">2m ago</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Validation passed</span>
                  <span className="text-muted-foreground">5m ago</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span>Minor issues found</span>
                  <span className="text-muted-foreground">1h ago</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Maintenance completed</span>
                  <span className="text-muted-foreground">2h ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health">
          <DatabaseHealth />
        </TabsContent>

        <TabsContent value="tables">
          <TableValidation />
        </TabsContent>

        <TabsContent value="validation">
          <Card>
            <CardHeader>
              <CardTitle>Database Validation</CardTitle>
              <p className="text-sm text-muted-foreground">
                Comprehensive validation of all database tables and relationships
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Table Structure Validation</h3>
                    <p className="text-sm text-muted-foreground">
                      Check all tables for proper structure and constraints
                    </p>
                  </div>
                  <Button onClick={handleRunValidation} disabled={loading}>
                    <Play className="h-4 w-4 mr-2" />
                    Run Validation
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Data Integrity Check</h3>
                    <p className="text-sm text-muted-foreground">
                      Verify data consistency and foreign key relationships
                    </p>
                  </div>
                  <Button onClick={handleRunValidation} disabled={loading}>
                    <Play className="h-4 w-4 mr-2" />
                    Run Check
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Performance Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Analyze query performance and suggest optimizations
                    </p>
                  </div>
                  <Button onClick={handleRunValidation} disabled={loading}>
                    <Play className="h-4 w-4 mr-2" />
                    Run Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Database Maintenance</CardTitle>
              <p className="text-sm text-muted-foreground">
                Automated maintenance tasks to keep your database optimized
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Vacuum & Analyze</h3>
                    <p className="text-sm text-muted-foreground">
                      Clean up dead tuples and update table statistics
                    </p>
                  </div>
                  <Button onClick={handleRunMaintenance} disabled={loading}>
                    <Play className="h-4 w-4 mr-2" />
                    Run Now
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Index Rebuild</h3>
                    <p className="text-sm text-muted-foreground">
                      Rebuild fragmented indexes for better performance
                    </p>
                  </div>
                  <Button onClick={handleRunMaintenance} disabled={loading}>
                    <Play className="h-4 w-4 mr-2" />
                    Run Now
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Cleanup Orphaned Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Remove orphaned records and fix data inconsistencies
                    </p>
                  </div>
                  <Button onClick={handleRunMaintenance} disabled={loading}>
                    <Play className="h-4 w-4 mr-2" />
                    Run Now
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Backup Database</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a full backup of the database
                    </p>
                  </div>
                  <Button onClick={handleRunMaintenance} disabled={loading}>
                    <Download className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseManagement;
