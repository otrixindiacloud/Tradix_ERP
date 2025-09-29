import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Settings, 
  Database, 
  AlertTriangle,
  ExternalLink,
  Download,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TallyConfig {
  enabled: boolean;
  serverUrl: string;
  username: string;
  password: string;
  port: number;
  timeout: number;
  autoSync: boolean;
  syncInterval: number; // in minutes
}

interface SyncStatus {
  lastSync: string | null;
  status: "idle" | "syncing" | "success" | "error";
  progress: number;
  error: string | null;
  recordsSynced: number;
  totalRecords: number;
}

interface SyncLog {
  id: string;
  timestamp: string;
  type: "export" | "import";
  module: string;
  status: "success" | "error";
  recordsCount: number;
  error?: string;
}

const INTEGRATION_MODULES = [
  { 
    value: "suppliers", 
    label: "Suppliers", 
    description: "Sync supplier master data",
    enabled: true 
  },
  { 
    value: "customers", 
    label: "Customers", 
    description: "Sync customer master data",
    enabled: true 
  },
  { 
    value: "purchase", 
    label: "Purchase Orders", 
    description: "Export purchase transactions",
    enabled: true 
  },
  { 
    value: "sales", 
    label: "Sales Orders", 
    description: "Export sales transactions",
    enabled: true 
  },
  { 
    value: "inventory", 
    label: "Inventory", 
    description: "Sync stock and item data",
    enabled: true 
  },
  { 
    value: "purchase_return", 
    label: "Purchase Returns", 
    description: "Export purchase return transactions",
    enabled: false 
  },
  { 
    value: "sales_return", 
    label: "Sales Returns", 
    description: "Export sales return transactions",
    enabled: false 
  }
];

export default function TallyIntegrationPage() {
  const [config, setConfig] = useState<TallyConfig>({
    enabled: false,
    serverUrl: "",
    username: "",
    password: "",
    port: 9000,
    timeout: 30,
    autoSync: false,
    syncInterval: 60
  });
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: null,
    status: "idle",
    progress: 0,
    error: null,
    recordsSynced: 0,
    totalRecords: 0
  });
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  const { toast } = useToast();

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/settings/category/integration");
      const data = await response.json();
      
      const tallyConfig: TallyConfig = {
        enabled: data.find((s: any) => s.key === "tally_enabled")?.jsonValue || false,
        serverUrl: data.find((s: any) => s.key === "tally_server_url")?.value || "",
        username: data.find((s: any) => s.key === "tally_username")?.value || "",
        password: data.find((s: any) => s.key === "tally_password")?.value || "",
        port: parseInt(data.find((s: any) => s.key === "tally_port")?.value || "9000"),
        timeout: parseInt(data.find((s: any) => s.key === "tally_timeout")?.value || "30"),
        autoSync: data.find((s: any) => s.key === "tally_auto_sync")?.jsonValue || false,
        syncInterval: parseInt(data.find((s: any) => s.key === "tally_sync_interval")?.value || "60")
      };
      
      setConfig(tallyConfig);
    } catch (error) {
      console.error("Error fetching Tally config:", error);
    }
  };

  const fetchSyncLogs = async () => {
    try {
      // This would typically fetch from an API endpoint
      const mockLogs: SyncLog[] = [
        {
          id: "1",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: "export",
          module: "suppliers",
          status: "success",
          recordsCount: 25
        },
        {
          id: "2",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          type: "import",
          module: "customers",
          status: "success",
          recordsCount: 150
        },
        {
          id: "3",
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          type: "export",
          module: "sales",
          status: "error",
          recordsCount: 0,
          error: "Connection timeout"
        }
      ];
      setSyncLogs(mockLogs);
    } catch (error) {
      console.error("Error fetching sync logs:", error);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchSyncLogs();
  }, []);

  const handleConfigChange = (key: keyof TallyConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      const settings = [
        { key: "tally_enabled", value: config.enabled.toString(), jsonValue: config.enabled, category: "integration" },
        { key: "tally_server_url", value: config.serverUrl, category: "integration" },
        { key: "tally_username", value: config.username, category: "integration" },
        { key: "tally_password", value: config.password, category: "integration" },
        { key: "tally_port", value: config.port.toString(), category: "integration" },
        { key: "tally_timeout", value: config.timeout.toString(), category: "integration" },
        { key: "tally_auto_sync", value: config.autoSync.toString(), jsonValue: config.autoSync, category: "integration" },
        { key: "tally_sync_interval", value: config.syncInterval.toString(), category: "integration" }
      ];

      const response = await fetch("/api/settings/bulk", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          settings,
          updatedBy: "current_user"
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Tally configuration saved successfully"
        });
      } else {
        throw new Error("Failed to save configuration");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Tally configuration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const response = await fetch("/api/tally/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          serverUrl: config.serverUrl,
          username: config.username,
          password: config.password,
          port: config.port,
          timeout: config.timeout
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Connection to Tally successful"
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || "Connection failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to connect to Tally",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSync = async (module?: string) => {
    setSyncStatus(prev => ({ ...prev, status: "syncing", progress: 0, error: null }));
    
    try {
      const response = await fetch("/api/tally/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ module })
      });

      if (response.ok) {
        // Simulate progress updates
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setSyncStatus(prev => ({ 
            ...prev, 
            progress: i,
            recordsSynced: Math.floor(i / 10) * 10,
            totalRecords: 100
          }));
        }

        setSyncStatus(prev => ({ 
          ...prev, 
          status: "success", 
          progress: 100,
          lastSync: new Date().toISOString(),
          recordsSynced: 100,
          totalRecords: 100
        }));

        toast({
          title: "Success",
          description: "Sync completed successfully"
        });

        fetchSyncLogs();
      } else {
        throw new Error("Sync failed");
      }
    } catch (error) {
      setSyncStatus(prev => ({ 
        ...prev, 
        status: "error", 
        error: error.message || "Sync failed"
      }));
      
      toast({
        title: "Error",
        description: "Sync failed",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error": return <XCircle className="h-4 w-4 text-red-500" />;
      case "syncing": return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <RefreshCw className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "success": return "default";
      case "error": return "destructive";
      case "syncing": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tally Integration</h1>
          <p className="text-muted-foreground">
            Integrate with Tally accounting system for seamless data synchronization
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchConfig} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="sync">Sync Status</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tally Server Configuration
              </CardTitle>
              <CardDescription>
                Configure connection settings for Tally server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enabled" className="text-base font-medium">
                    Enable Tally Integration
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable Tally integration
                  </p>
                </div>
                <Switch
                  id="enabled"
                  checked={config.enabled}
                  onCheckedChange={(checked) => handleConfigChange("enabled", checked)}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serverUrl">Server URL</Label>
                  <Input
                    id="serverUrl"
                    value={config.serverUrl}
                    onChange={(e) => handleConfigChange("serverUrl", e.target.value)}
                    placeholder="http://localhost"
                    disabled={!config.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={config.port}
                    onChange={(e) => handleConfigChange("port", parseInt(e.target.value))}
                    placeholder="9000"
                    disabled={!config.enabled}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={config.username}
                    onChange={(e) => handleConfigChange("username", e.target.value)}
                    placeholder="Tally username"
                    disabled={!config.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={config.password}
                    onChange={(e) => handleConfigChange("password", e.target.value)}
                    placeholder="Tally password"
                    disabled={!config.enabled}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={config.timeout}
                    onChange={(e) => handleConfigChange("timeout", parseInt(e.target.value))}
                    placeholder="30"
                    disabled={!config.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="syncInterval">Auto Sync Interval (minutes)</Label>
                  <Input
                    id="syncInterval"
                    type="number"
                    value={config.syncInterval}
                    onChange={(e) => handleConfigChange("syncInterval", parseInt(e.target.value))}
                    placeholder="60"
                    disabled={!config.enabled}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSync" className="text-base font-medium">
                    Enable Auto Sync
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync data at specified intervals
                  </p>
                </div>
                <Switch
                  id="autoSync"
                  checked={config.autoSync}
                  onCheckedChange={(checked) => handleConfigChange("autoSync", checked)}
                  disabled={!config.enabled}
                />
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button
                  onClick={handleTestConnection}
                  disabled={!config.enabled || testing}
                  variant="outline"
                >
                  {testing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4 mr-2" />
                  )}
                  Test Connection
                </Button>
                <Button
                  onClick={handleSaveConfig}
                  disabled={loading}
                >
                  <Database className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save Configuration"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Sync Status
              </CardTitle>
              <CardDescription>
                Current synchronization status and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(syncStatus.status)}
                  <span className="font-medium">
                    {syncStatus.status === "idle" ? "Ready to Sync" : 
                     syncStatus.status === "syncing" ? "Syncing..." :
                     syncStatus.status === "success" ? "Last Sync Successful" : "Sync Failed"}
                  </span>
                </div>
                <Badge variant={getStatusBadgeVariant(syncStatus.status)}>
                  {syncStatus.status}
                </Badge>
              </div>

              {syncStatus.status === "syncing" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>{syncStatus.progress}%</span>
                  </div>
                  <Progress value={syncStatus.progress} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    {syncStatus.recordsSynced} of {syncStatus.totalRecords} records synced
                  </div>
                </div>
              )}

              {syncStatus.error && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {syncStatus.error}
                  </AlertDescription>
                </Alert>
              )}

              {syncStatus.lastSync && (
                <div className="text-sm text-muted-foreground">
                  Last sync: {new Date(syncStatus.lastSync).toLocaleString()}
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Integration Modules</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {INTEGRATION_MODULES.map((module) => (
                    <div key={module.value} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{module.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {module.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={module.enabled ? "default" : "secondary"}>
                          {module.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSync(module.value)}
                          disabled={!module.enabled || syncStatus.status === "syncing"}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleSync()}
                  disabled={syncStatus.status === "syncing"}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync All Modules
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Logs</CardTitle>
              <CardDescription>
                History of synchronization activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No sync logs found
                  </div>
                ) : (
                  syncLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(log.status)}
                        <div>
                          <div className="font-medium">
                            {log.type === "export" ? "Export" : "Import"} - {log.module}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                          {log.error && (
                            <div className="text-sm text-red-600">
                              Error: {log.error}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusBadgeVariant(log.status)}>
                          {log.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {log.recordsCount} records
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
