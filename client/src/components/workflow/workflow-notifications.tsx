import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  X, 
  Eye, 
  Play, 
  Pause,
  RotateCcw,
  Calendar,
  User,
  FileText,
  Package,
  Truck,
  DollarSign,
  ShoppingCart,
  Upload,
  Building,
  Warehouse,
  Settings,
  Filter,
  Check,
  Archive,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatCurrency } from "@/lib/utils";
import { WORKFLOW_STEPS } from "@/lib/constants";

interface WorkflowNotification {
  id: string;
  type: "step_completed" | "step_blocked" | "workflow_completed" | "workflow_stalled" | "deadline_approaching" | "deadline_missed" | "approval_required" | "system_alert";
  title: string;
  message: string;
  entityId: string;
  entityType: string;
  entityName: string;
  stepId?: number;
  stepName?: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "unread" | "read" | "archived";
  createdAt: string;
  readAt?: string;
  archivedAt?: string;
  assignedTo?: string;
  actionRequired: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  stepCompleted: boolean;
  stepBlocked: boolean;
  workflowCompleted: boolean;
  deadlineApproaching: boolean;
  approvalRequired: boolean;
  systemAlerts: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface WorkflowNotificationsProps {
  showSettings?: boolean;
  className?: string;
}

export default function WorkflowNotifications({ 
  showSettings = true,
  className 
}: WorkflowNotificationsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["workflow-notifications", filter, priorityFilter, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("status", filter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/workflow/notifications?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return await response.json();
    }
  });

  // Fetch notification settings
  const { data: settings } = useQuery({
    queryKey: ["workflow-notification-settings"],
    queryFn: async () => {
      const response = await fetch("/api/workflow/notifications/settings");
      if (!response.ok) throw new Error("Failed to fetch notification settings");
      return await response.json();
    }
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/workflow/notifications/${notificationId}/read`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Failed to mark notification as read");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow-notifications"] });
    }
  });

  // Archive notification
  const archiveMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/workflow/notifications/${notificationId}/archive`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Failed to archive notification");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow-notifications"] });
      toast({
        title: "Success",
        description: "Notification archived",
      });
    }
  });

  // Delete notification
  const deleteMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/workflow/notifications/${notificationId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete notification");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow-notifications"] });
      toast({
        title: "Success",
        description: "Notification deleted",
      });
    }
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/workflow/notifications/mark-all-read", {
        method: "POST"
      });
      if (!response.ok) throw new Error("Failed to mark all notifications as read");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow-notifications"] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    }
  });

  // Update notification settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<NotificationSettings>) => {
      const response = await fetch("/api/workflow/notifications/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings)
      });
      if (!response.ok) throw new Error("Failed to update notification settings");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow-notification-settings"] });
      toast({
        title: "Success",
        description: "Notification settings updated",
      });
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "step_completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "step_blocked": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "workflow_completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "workflow_stalled": return <Pause className="h-4 w-4 text-yellow-500" />;
      case "deadline_approaching": return <Clock className="h-4 w-4 text-orange-500" />;
      case "deadline_missed": return <X className="h-4 w-4 text-red-500" />;
      case "approval_required": return <FileText className="h-4 w-4 text-blue-500" />;
      case "system_alert": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
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

  const getStepIcon = (stepName?: string) => {
    if (!stepName) return <Clock className="h-4 w-4" />;
    
    switch (stepName) {
      case "Customer": return <User className="h-4 w-4" />;
      case "Enquiry": return <FileText className="h-4 w-4" />;
      case "Quotation": return <FileText className="h-4 w-4" />;
      case "Acceptance": return <CheckCircle className="h-4 w-4" />;
      case "Customer PO Upload": return <Upload className="h-4 w-4" />;
      case "Sales Order": return <ShoppingCart className="h-4 w-4" />;
      case "Supplier LPO": return <Truck className="h-4 w-4" />;
      case "Goods Receipt": return <Package className="h-4 w-4" />;
      case "Inventory": return <Warehouse className="h-4 w-4" />;
      case "Delivery Note": return <Truck className="h-4 w-4" />;
      case "Invoice": return <DollarSign className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredNotifications = notifications.filter((notification: WorkflowNotification) => {
    const matchesFilter = filter === "all" || notification.status === filter;
    const matchesPriority = priorityFilter === "all" || notification.priority.toLowerCase() === priorityFilter;
    const matchesSearch = searchTerm === "" || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.entityName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesPriority && matchesSearch;
  });

  const unreadCount = notifications.filter((n: WorkflowNotification) => n.status === "unread").length;
  const urgentCount = notifications.filter((n: WorkflowNotification) => n.priority === "Urgent" && n.status === "unread").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflow Notifications</h2>
          <p className="text-gray-600">Stay updated on workflow progress and alerts</p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
            >
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          {showSettings && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-600">{notifications.length}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications ({filteredNotifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification: WorkflowNotification) => (
              <div
                key={notification.id}
                className={`
                  flex items-start space-x-4 p-4 border rounded-lg transition-all
                  ${notification.status === "unread" ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"}
                  ${notification.actionRequired ? "ring-2 ring-orange-200" : ""}
                `}
              >
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        {notification.actionRequired && (
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <span>Entity:</span>
                          <span className="font-medium">{notification.entityName}</span>
                        </div>
                        {notification.stepName && (
                          <div className="flex items-center space-x-1">
                            {getStepIcon(notification.stepName)}
                            <span>{notification.stepName}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(notification.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {notification.status === "unread" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => archiveMutation.mutate(notification.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredNotifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications found</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings Dialog */}
      {showSettings && (
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Notification Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="step-completed">Step Completed</Label>
                      <p className="text-sm text-gray-500">Notify when a workflow step is completed</p>
                    </div>
                    <Switch
                      id="step-completed"
                      checked={settings?.stepCompleted || false}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({ stepCompleted: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="step-blocked">Step Blocked</Label>
                      <p className="text-sm text-gray-500">Notify when a workflow step is blocked</p>
                    </div>
                    <Switch
                      id="step-blocked"
                      checked={settings?.stepBlocked || false}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({ stepBlocked: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="workflow-completed">Workflow Completed</Label>
                      <p className="text-sm text-gray-500">Notify when an entire workflow is completed</p>
                    </div>
                    <Switch
                      id="workflow-completed"
                      checked={settings?.workflowCompleted || false}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({ workflowCompleted: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="deadline-approaching">Deadline Approaching</Label>
                      <p className="text-sm text-gray-500">Notify when deadlines are approaching</p>
                    </div>
                    <Switch
                      id="deadline-approaching"
                      checked={settings?.deadlineApproaching || false}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({ deadlineApproaching: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="approval-required">Approval Required</Label>
                      <p className="text-sm text-gray-500">Notify when approvals are required</p>
                    </div>
                    <Switch
                      id="approval-required"
                      checked={settings?.approvalRequired || false}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({ approvalRequired: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings?.emailNotifications || false}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({ emailNotifications: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings?.pushNotifications || false}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({ pushNotifications: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsSettingsOpen(false)}>
                  Save Settings
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
