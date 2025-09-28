import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Check, 
  CheckCheck, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Info,
  Search,
  Filter,
  MoreVertical,
  Archive,
  Settings,
  Bell,
  BellOff
} from 'lucide-react';
import { useNotifications, Notification } from '@/components/notifications/notification-context';
import { formatDistanceToNow, format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'info':
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'border-l-green-500 bg-green-50 hover:bg-green-100';
    case 'warning':
      return 'border-l-yellow-500 bg-yellow-50 hover:bg-yellow-100';
    case 'error':
      return 'border-l-red-500 bg-red-50 hover:bg-red-100';
    case 'info':
    default:
      return 'border-l-blue-500 bg-blue-50 hover:bg-blue-100';
  }
};

const NotificationItem: React.FC<{ 
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}> = ({ notification, onMarkAsRead, onRemove }) => {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div
      className={`p-4 lg:p-5 border-l-4 cursor-pointer transition-all duration-200 ${
        notification.read ? 'opacity-60' : 'shadow-sm'
      } ${getNotificationColor(notification.type)}`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3 lg:space-x-4">
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h4 className={`text-sm lg:text-base font-semibold leading-tight ${notification.read ? 'text-gray-500' : 'text-gray-900'}`}>
              {notification.title}
            </h4>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="text-sm">Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {!notification.read && (
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }} className="text-sm">
                      <Check className="h-4 w-4 mr-2" />
                      Mark as read
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(notification.id);
                    }}
                    className="text-sm text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className={`text-sm mt-2 leading-relaxed ${notification.read ? 'text-gray-400' : 'text-gray-600'}`}>
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <Badge variant={notification.read ? "secondary" : "default"} className="text-xs">
                {notification.type}
              </Badge>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </div>
            <span className="text-xs text-gray-400">
              {format(notification.timestamp, 'MMM dd, yyyy HH:mm')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications 
  } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'read' && notification.read) ||
                         (filterStatus === 'unread' && !notification.read);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const unreadFiltered = filteredNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                <Bell className="h-6 w-6 lg:h-8 lg:w-8 mr-3 text-blue-600" />
                Notifications
              </h1>
              <p className="text-sm lg:text-base text-gray-600 mt-2">
                Manage your notifications and stay updated with important information
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <Badge variant="outline" className="text-sm px-3 py-1.5">
                {unreadCount} unread
              </Badge>
              <Button
                variant="outline"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center text-sm"
                size="sm"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
              <Button
                variant="outline"
                onClick={clearAllNotifications}
                className="flex items-center text-sm text-red-600 hover:text-red-700"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-40 h-10">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40 h-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center text-lg">
                <Filter className="h-5 w-5 mr-2" />
                Notifications
                {unreadFiltered > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {unreadFiltered} unread
                  </Badge>
                )}
              </CardTitle>
              <div className="text-sm text-gray-500">
                {filteredNotifications.length} of {notifications.length} notifications
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] lg:h-[600px]">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 lg:p-12 text-center text-gray-500">
                  <BellOff className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-base lg:text-lg font-medium mb-2">No notifications found</h3>
                  <p className="text-sm lg:text-base">
                    {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                      ? 'Try adjusting your filters or search terms'
                      : 'You have no notifications at the moment'
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onRemove={removeNotification}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4 lg:p-5">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm lg:text-base">Info Notifications</h3>
                <p className="text-xs lg:text-sm text-gray-500">
                  {notifications.filter(n => n.type === 'info').length} total
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 lg:p-5">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm lg:text-base">Success Notifications</h3>
                <p className="text-xs lg:text-sm text-gray-500">
                  {notifications.filter(n => n.type === 'success').length} total
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 lg:p-5 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm lg:text-base">Alerts & Warnings</h3>
                <p className="text-xs lg:text-sm text-gray-500">
                  {notifications.filter(n => n.type === 'warning' || n.type === 'error').length} total
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
