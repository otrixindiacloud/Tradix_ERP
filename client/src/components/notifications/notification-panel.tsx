import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Check, 
  CheckCheck, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Info,
  ExternalLink,
  Eye
} from 'lucide-react';
import { useNotifications, Notification } from './notification-context';
import { formatDistanceToNow } from 'date-fns';
import { useLocation } from 'wouter';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'info':
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'border-l-green-500 bg-green-50';
    case 'warning':
      return 'border-l-yellow-500 bg-yellow-50';
    case 'error':
      return 'border-l-red-500 bg-red-50';
    case 'info':
    default:
      return 'border-l-blue-500 bg-blue-50';
  }
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { markAsRead, removeNotification } = useNotifications();
  const [, navigate] = useLocation();

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <div
      className={`p-3 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${
        notification.read ? 'opacity-60' : ''
      } ${getNotificationColor(notification.type)}`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-semibold leading-tight ${notification.read ? 'text-gray-500' : 'text-gray-900'}`}>
              {notification.title}
            </h4>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              </span>
              {notification.actionUrl && (
                <ExternalLink className="h-3 w-3 text-gray-400" />
              )}
            </div>
          </div>
          <p className={`text-xs mt-1 leading-relaxed ${notification.read ? 'text-gray-400' : 'text-gray-600'}`}>
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <Badge variant={notification.read ? "secondary" : "default"} className="text-xs px-2 py-0.5">
                {notification.type}
              </Badge>
              {!notification.read && (
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              )}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            removeNotification(notification.id);
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAllAsRead, clearAllNotifications } = useNotifications();
  const [, navigate] = useLocation();

  if (!isOpen) return null;

  const handleViewAll = () => {
    onClose();
    navigate('/notifications');
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute top-16 right-4 w-80 sm:w-96 max-w-sm" onClick={(e) => e.stopPropagation()}>
        <Card className="shadow-lg border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center">
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewAll}
                  className="h-7 px-2 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View all
                </Button>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-7 px-2 text-xs"
                  >
                    <CheckCheck className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <ScrollArea className="h-80 sm:h-96">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <AlertCircle className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
