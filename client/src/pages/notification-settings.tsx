import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  RefreshCw, 
  Save, 
  Mail, 
  Bell, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Send,
  TestTube
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettings {
  email: {
    enabled: boolean;
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    smtpSecure: boolean;
    fromEmail: string;
    fromName: string;
  };
  system: {
    enabled: boolean;
    soundEnabled: boolean;
    desktopNotifications: boolean;
    autoRefresh: boolean;
    refreshInterval: number; // in minutes
  };
  alerts: {
    enquiryReceived: boolean;
    quotationCreated: boolean;
    quotationAccepted: boolean;
    quotationRejected: boolean;
    salesOrderCreated: boolean;
    salesOrderShipped: boolean;
    salesOrderDelivered: boolean;
    invoiceGenerated: boolean;
    paymentReceived: boolean;
    lowStock: boolean;
    systemError: boolean;
  };
  roles: {
    admin: string[];
    manager: string[];
    sales: string[];
    warehouse: string[];
    finance: string[];
  };
}

const NOTIFICATION_TYPES = [
  { 
    key: "enquiryReceived", 
    label: "New Enquiry Received", 
    description: "Notify when a new customer enquiry is received",
    category: "enquiries"
  },
  { 
    key: "quotationCreated", 
    label: "Quotation Created", 
    description: "Notify when a quotation is created",
    category: "quotations"
  },
  { 
    key: "quotationAccepted", 
    label: "Quotation Accepted", 
    description: "Notify when a quotation is accepted by customer",
    category: "quotations"
  },
  { 
    key: "quotationRejected", 
    label: "Quotation Rejected", 
    description: "Notify when a quotation is rejected by customer",
    category: "quotations"
  },
  { 
    key: "salesOrderCreated", 
    label: "Sales Order Created", 
    description: "Notify when a sales order is created",
    category: "orders"
  },
  { 
    key: "salesOrderShipped", 
    label: "Sales Order Shipped", 
    description: "Notify when a sales order is shipped",
    category: "orders"
  },
  { 
    key: "salesOrderDelivered", 
    label: "Sales Order Delivered", 
    description: "Notify when a sales order is delivered",
    category: "orders"
  },
  { 
    key: "invoiceGenerated", 
    label: "Invoice Generated", 
    description: "Notify when an invoice is generated",
    category: "invoicing"
  },
  { 
    key: "paymentReceived", 
    label: "Payment Received", 
    description: "Notify when a payment is received",
    category: "invoicing"
  },
  { 
    key: "lowStock", 
    label: "Low Stock Alert", 
    description: "Notify when inventory levels are low",
    category: "inventory"
  },
  { 
    key: "systemError", 
    label: "System Error", 
    description: "Notify when system errors occur",
    category: "system"
  }
];

const ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Manager" },
  { value: "sales", label: "Sales Representative" },
  { value: "warehouse", label: "Warehouse Staff" },
  { value: "finance", label: "Finance" }
];

const NOTIFICATION_METHODS = [
  { value: "email", label: "Email" },
  { value: "system", label: "System Notification" },
  { value: "both", label: "Both Email & System" }
];

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: false,
      smtpHost: "",
      smtpPort: 587,
      smtpUsername: "",
      smtpPassword: "",
      smtpSecure: true,
      fromEmail: "",
      fromName: "Golden Tag WLL ERP"
    },
    system: {
      enabled: true,
      soundEnabled: true,
      desktopNotifications: true,
      autoRefresh: true,
      refreshInterval: 5
    },
    alerts: {
      enquiryReceived: true,
      quotationCreated: true,
      quotationAccepted: true,
      quotationRejected: true,
      salesOrderCreated: true,
      salesOrderShipped: true,
      salesOrderDelivered: true,
      invoiceGenerated: true,
      paymentReceived: true,
      lowStock: true,
      systemError: true
    },
    roles: {
      admin: ["email", "system"],
      manager: ["email", "system"],
      sales: ["email", "system"],
      warehouse: ["system"],
      finance: ["email", "system"]
    }
  });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings/category/email");
      const data = await response.json();
      
      // This would typically parse the settings from the API response
      // For now, we'll use the default settings
    } catch (error) {
      console.error("Error fetching notification settings:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleEmailSettingChange = (key: keyof NotificationSettings['email'], value: any) => {
    setSettings(prev => ({
      ...prev,
      email: { ...prev.email, [key]: value }
    }));
  };

  const handleSystemSettingChange = (key: keyof NotificationSettings['system'], value: any) => {
    setSettings(prev => ({
      ...prev,
      system: { ...prev.system, [key]: value }
    }));
  };

  const handleAlertChange = (key: keyof NotificationSettings['alerts'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      alerts: { ...prev.alerts, [key]: value }
    }));
  };

  const handleRoleChange = (role: string, methods: string[]) => {
    setSettings(prev => ({
      ...prev,
      roles: { ...prev.roles, [role]: methods }
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const settingsToUpdate = [
        // Email settings
        { key: "email_enabled", value: settings.email.enabled.toString(), jsonValue: settings.email.enabled, category: "email" },
        { key: "smtp_host", value: settings.email.smtpHost, category: "email" },
        { key: "smtp_port", value: settings.email.smtpPort.toString(), category: "email" },
        { key: "smtp_username", value: settings.email.smtpUsername, category: "email" },
        { key: "smtp_password", value: settings.email.smtpPassword, category: "email" },
        { key: "smtp_secure", value: settings.email.smtpSecure.toString(), jsonValue: settings.email.smtpSecure, category: "email" },
        { key: "from_email", value: settings.email.fromEmail, category: "email" },
        { key: "from_name", value: settings.email.fromName, category: "email" },
        
        // System settings
        { key: "notifications_enabled", value: settings.system.enabled.toString(), jsonValue: settings.system.enabled, category: "system" },
        { key: "sound_enabled", value: settings.system.soundEnabled.toString(), jsonValue: settings.system.soundEnabled, category: "system" },
        { key: "desktop_notifications", value: settings.system.desktopNotifications.toString(), jsonValue: settings.system.desktopNotifications, category: "system" },
        { key: "auto_refresh", value: settings.system.autoRefresh.toString(), jsonValue: settings.system.autoRefresh, category: "system" },
        { key: "refresh_interval", value: settings.system.refreshInterval.toString(), category: "system" },
        
        // Alert settings
        ...Object.entries(settings.alerts).map(([key, value]) => ({
          key: `alert_${key}`,
          value: value.toString(),
          jsonValue: value,
          category: "notifications"
        })),
        
        // Role settings
        ...Object.entries(settings.roles).map(([role, methods]) => ({
          key: `role_${role}_notifications`,
          value: methods.join(","),
          jsonValue: methods,
          category: "notifications"
        }))
      ];

      const response = await fetch("/api/settings/bulk", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          settings: settingsToUpdate,
          updatedBy: "current_user"
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Notification settings saved successfully"
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const response = await fetch("/api/notifications/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: "test@example.com",
          subject: "Test Email from Golden Tag WLL ERP",
          message: "This is a test email to verify email configuration."
        })
      });

      if (response.ok) {
        setTestResult({ success: true, message: "Test email sent successfully" });
        toast({
          title: "Success",
          description: "Test email sent successfully"
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to send test email");
      }
    } catch (error) {
      setTestResult({ success: false, message: error.message || "Failed to send test email" });
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "enquiries": return <Bell className="h-4 w-4" />;
      case "quotations": return <Mail className="h-4 w-4" />;
      case "orders": return <Settings className="h-4 w-4" />;
      case "invoicing": return <CheckCircle className="h-4 w-4" />;
      case "inventory": return <AlertTriangle className="h-4 w-4" />;
      case "system": return <Settings className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "enquiries": return "text-blue-500";
      case "quotations": return "text-green-500";
      case "orders": return "text-purple-500";
      case "invoicing": return "text-orange-500";
      case "inventory": return "text-red-500";
      case "system": return "text-gray-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Settings</h1>
          <p className="text-muted-foreground">
            Configure email alerts and system notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchSettings} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email">Email Configuration</TabsTrigger>
          <TabsTrigger value="alerts">Alert Settings</TabsTrigger>
          <TabsTrigger value="roles">Role Permissions</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Configure SMTP settings for email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailEnabled" className="text-base font-medium">
                    Enable Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications via email
                  </p>
                </div>
                <Switch
                  id="emailEnabled"
                  checked={settings.email.enabled}
                  onCheckedChange={(checked) => handleEmailSettingChange("enabled", checked)}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => handleEmailSettingChange("smtpHost", e.target.value)}
                    placeholder="smtp.gmail.com"
                    disabled={!settings.email.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => handleEmailSettingChange("smtpPort", parseInt(e.target.value))}
                    placeholder="587"
                    disabled={!settings.email.enabled}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.email.smtpUsername}
                    onChange={(e) => handleEmailSettingChange("smtpUsername", e.target.value)}
                    placeholder="your-email@gmail.com"
                    disabled={!settings.email.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => handleEmailSettingChange("smtpPassword", e.target.value)}
                    placeholder="App password"
                    disabled={!settings.email.enabled}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => handleEmailSettingChange("fromEmail", e.target.value)}
                    placeholder="noreply@goldentag.com"
                    disabled={!settings.email.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.email.fromName}
                    onChange={(e) => handleEmailSettingChange("fromName", e.target.value)}
                    placeholder="Golden Tag WLL ERP"
                    disabled={!settings.email.enabled}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smtpSecure" className="text-base font-medium">
                    Use SSL/TLS
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable secure connection for SMTP
                  </p>
                </div>
                <Switch
                  id="smtpSecure"
                  checked={settings.email.smtpSecure}
                  onCheckedChange={(checked) => handleEmailSettingChange("smtpSecure", checked)}
                  disabled={!settings.email.enabled}
                />
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button
                  onClick={handleTestEmail}
                  disabled={!settings.email.enabled || testing}
                  variant="outline"
                >
                  {testing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <TestTube className="h-4 w-4 mr-2" />
                  )}
                  Test Email
                </Button>
              </div>

              {testResult && (
                <Alert>
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {testResult.message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert Settings
              </CardTitle>
              <CardDescription>
                Configure which events trigger notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(
                  NOTIFICATION_TYPES.reduce((acc, type) => {
                    if (!acc[type.category]) acc[type.category] = [];
                    acc[type.category].push(type);
                    return acc;
                  }, {} as Record<string, typeof NOTIFICATION_TYPES>)
                ).map(([category, types]) => (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className={`${getCategoryColor(category)}`}>
                        {getCategoryIcon(category)}
                      </span>
                      <h4 className="font-medium capitalize">{category}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {types.map((type) => (
                        <div key={type.key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {type.description}
                            </div>
                          </div>
                          <Switch
                            checked={settings.alerts[type.key as keyof NotificationSettings['alerts']]}
                            onCheckedChange={(checked) => handleAlertChange(type.key as keyof NotificationSettings['alerts'], checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Role Permissions
              </CardTitle>
              <CardDescription>
                Configure notification methods for each user role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ROLES.map((role) => (
                  <div key={role.value} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{role.label}</h4>
                      <Badge variant="outline">
                        {settings.roles[role.value as keyof NotificationSettings['roles']].length} methods
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {NOTIFICATION_METHODS.map((method) => (
                        <div
                          key={method.value}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            settings.roles[role.value as keyof NotificationSettings['roles']].includes(method.value)
                              ? 'border-primary bg-primary/5'
                              : 'border-muted'
                          }`}
                          onClick={() => {
                            const currentMethods = settings.roles[role.value as keyof NotificationSettings['roles']];
                            const newMethods = currentMethods.includes(method.value)
                              ? currentMethods.filter(m => m !== method.value)
                              : [...currentMethods, method.value];
                            handleRoleChange(role.value, newMethods);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={settings.roles[role.value as keyof NotificationSettings['roles']].includes(method.value)}
                              onChange={() => {}}
                              className="rounded"
                            />
                            <span className="text-sm font-medium">{method.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure system notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="systemEnabled" className="text-base font-medium">
                    Enable System Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications within the application
                  </p>
                </div>
                <Switch
                  id="systemEnabled"
                  checked={settings.system.enabled}
                  onCheckedChange={(checked) => handleSystemSettingChange("enabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="soundEnabled" className="text-base font-medium">
                    Enable Sound Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when notifications are received
                  </p>
                </div>
                <Switch
                  id="soundEnabled"
                  checked={settings.system.soundEnabled}
                  onCheckedChange={(checked) => handleSystemSettingChange("soundEnabled", checked)}
                  disabled={!settings.system.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="desktopNotifications" className="text-base font-medium">
                    Desktop Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show desktop notifications (requires browser permission)
                  </p>
                </div>
                <Switch
                  id="desktopNotifications"
                  checked={settings.system.desktopNotifications}
                  onCheckedChange={(checked) => handleSystemSettingChange("desktopNotifications", checked)}
                  disabled={!settings.system.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoRefresh" className="text-base font-medium">
                    Auto Refresh
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh data at specified intervals
                  </p>
                </div>
                <Switch
                  id="autoRefresh"
                  checked={settings.system.autoRefresh}
                  onCheckedChange={(checked) => handleSystemSettingChange("autoRefresh", checked)}
                />
              </div>

              {settings.system.autoRefresh && (
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Refresh Interval (minutes)</Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    value={settings.system.refreshInterval}
                    onChange={(e) => handleSystemSettingChange("refreshInterval", parseInt(e.target.value))}
                    placeholder="5"
                    min="1"
                    max="60"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
