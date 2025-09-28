import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, RefreshCw, Settings, Database, Mail, Shield, Globe, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SystemSetting {
  id: string;
  category: string;
  key: string;
  value: string | null;
  jsonValue: any;
  description: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

const SETTING_CATEGORIES = [
  { value: "system", label: "System", icon: Settings },
  { value: "database", label: "Database", icon: Database },
  { value: "email", label: "Email", icon: Mail },
  { value: "security", label: "Security", icon: Shield },
  { value: "pricing", label: "Pricing", icon: DollarSign },
  { value: "integration", label: "Integration", icon: Globe }
];

const DEFAULT_SETTINGS = {
  system: [
    { key: "company_name", label: "Company Name", type: "text", value: "Golden Tag WLL" },
    { key: "company_address", label: "Company Address", type: "textarea", value: "" },
    { key: "company_phone", label: "Company Phone", type: "text", value: "" },
    { key: "company_email", label: "Company Email", type: "email", value: "" },
    { key: "timezone", label: "Timezone", type: "text", value: "Asia/Kuwait" },
    { key: "currency", label: "Default Currency", type: "text", value: "KWD" },
    { key: "date_format", label: "Date Format", type: "text", value: "DD/MM/YYYY" }
  ],
  database: [
    { key: "backup_frequency", label: "Backup Frequency", type: "select", value: "daily", options: ["hourly", "daily", "weekly", "monthly"] },
    { key: "backup_retention_days", label: "Backup Retention (Days)", type: "number", value: "30" },
    { key: "auto_cleanup_logs", label: "Auto Cleanup Logs", type: "boolean", value: true },
    { key: "log_retention_days", label: "Log Retention (Days)", type: "number", value: "90" }
  ],
  email: [
    { key: "smtp_host", label: "SMTP Host", type: "text", value: "" },
    { key: "smtp_port", label: "SMTP Port", type: "number", value: "587" },
    { key: "smtp_username", label: "SMTP Username", type: "text", value: "" },
    { key: "smtp_password", label: "SMTP Password", type: "password", value: "" },
    { key: "smtp_secure", label: "Use SSL/TLS", type: "boolean", value: true },
    { key: "from_email", label: "From Email", type: "email", value: "" },
    { key: "from_name", label: "From Name", type: "text", value: "Golden Tag WLL ERP" }
  ],
  security: [
    { key: "session_timeout", label: "Session Timeout (Minutes)", type: "number", value: "30" },
    { key: "max_login_attempts", label: "Max Login Attempts", type: "number", value: "5" },
    { key: "password_min_length", label: "Password Min Length", type: "number", value: "8" },
    { key: "require_2fa", label: "Require 2FA", type: "boolean", value: false },
    { key: "audit_log_enabled", label: "Enable Audit Logging", type: "boolean", value: true }
  ],
  pricing: [
    { key: "retail_markup", label: "Retail Markup (%)", type: "number", value: "70" },
    { key: "wholesale_markup", label: "Wholesale Markup (%)", type: "number", value: "40" },
    { key: "default_tax_rate", label: "Default Tax Rate (%)", type: "number", value: "0" },
    { key: "currency_symbol", label: "Currency Symbol", type: "text", value: "د.ك" },
    { key: "price_rounding", label: "Price Rounding", type: "select", value: "2", options: ["0", "1", "2", "3"] }
  ],
  integration: [
    { key: "tally_enabled", label: "Enable Tally Integration", type: "boolean", value: false },
    { key: "tally_server_url", label: "Tally Server URL", type: "text", value: "" },
    { key: "tally_username", label: "Tally Username", type: "text", value: "" },
    { key: "tally_password", label: "Tally Password", type: "password", value: "" },
    { key: "api_enabled", label: "Enable API Access", type: "boolean", value: true },
    { key: "api_rate_limit", label: "API Rate Limit (per minute)", type: "number", value: "100" }
  ]
};

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("system");
  const [formData, setFormData] = useState<Record<string, any>>({});

  const { toast } = useToast();

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      setSettings(data);

      // Initialize form data with current settings
      const initialFormData: Record<string, any> = {};
      data.forEach((setting: SystemSetting) => {
        initialFormData[setting.key] = setting.jsonValue || setting.value;
      });
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const settingsToUpdate = Object.entries(formData).map(([key, value]) => ({
        key,
        value: typeof value === "string" ? value : "",
        jsonValue: typeof value !== "string" ? value : null,
        category: activeCategory,
        updatedBy: "current_user" // This should come from auth context
      }));

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
          description: "Settings saved successfully"
        });
        fetchSettings();
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const getCurrentValue = (key: string) => {
    return formData[key] !== undefined ? formData[key] : "";
  };

  const renderSettingInput = (setting: any) => {
    const value = getCurrentValue(setting.key);

    switch (setting.type) {
      case "boolean":
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) => handleInputChange(setting.key, checked)}
          />
        );
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            placeholder={setting.placeholder || ""}
            rows={3}
          />
        );
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {setting.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "password":
        return (
          <Input
            type="password"
            value={value}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            placeholder={setting.placeholder || ""}
          />
        );
      default:
        return (
          <Input
            type={setting.type}
            value={value}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            placeholder={setting.placeholder || ""}
          />
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryInfo = SETTING_CATEGORIES.find(c => c.value === category);
    return categoryInfo ? categoryInfo.icon : Settings;
  };

  const getCategoryLabel = (category: string) => {
    const categoryInfo = SETTING_CATEGORIES.find(c => c.value === category);
    return categoryInfo ? categoryInfo.label : category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchSettings} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSaveSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {SETTING_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.value} value={category.value} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {SETTING_CATEGORIES.map((category) => (
          <TabsContent key={category.value} value={category.value} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(category.icon, { className: "h-5 w-5" })}
                  {category.label} Settings
                </CardTitle>
                <CardDescription>
                  Configure {category.label.toLowerCase()} related settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {DEFAULT_SETTINGS[category.value as keyof typeof DEFAULT_SETTINGS]?.map((setting, index) => (
                  <div key={setting.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={setting.key} className="text-sm font-medium">
                        {setting.label}
                      </Label>
                      {setting.type === "boolean" && (
                        <Badge variant={getCurrentValue(setting.key) ? "default" : "secondary"}>
                          {getCurrentValue(setting.key) ? "Enabled" : "Disabled"}
                        </Badge>
                      )}
                    </div>
                    {renderSettingInput(setting)}
                    {index < DEFAULT_SETTINGS[category.value as keyof typeof DEFAULT_SETTINGS].length - 1 && (
                      <Separator />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
