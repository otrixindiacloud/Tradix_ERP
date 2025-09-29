import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from './notification-context';
import { Bell, Plus, Settings, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export const NotificationDemoEnhanced: React.FC = () => {
  const { addNotification } = useNotifications();

  const addSampleNotification = (type: 'info' | 'success' | 'warning' | 'error') => {
    const notifications = {
      info: {
        title: 'System Update Available',
        message: 'A new system update is available. Please restart the application to apply changes. This update includes performance improvements and bug fixes.',
        type: 'info' as const,
        actionUrl: '/settings'
      },
      success: {
        title: 'Order Successfully Processed',
        message: 'Order #ORD-2024-123 has been successfully processed and shipped. Tracking number: TRK-789456123.',
        type: 'success' as const,
        actionUrl: '/sales-orders'
      },
      warning: {
        title: 'Low Stock Alert',
        message: 'Product "Premium Widget" inventory is running low (3 units remaining). Consider placing a reorder soon to avoid stockouts.',
        type: 'warning' as const,
        actionUrl: '/inventory'
      },
      error: {
        title: 'Payment Processing Failed',
        message: 'Payment processing failed for Invoice #INV-2024-456. Error: Insufficient funds. Please retry or contact support.',
        type: 'error' as const,
        actionUrl: '/invoicing'
      }
    };

    addNotification(notifications[type]);
  };

  const addBulkNotifications = () => {
    const bulkNotifications = [
      {
        title: 'New Customer Registration',
        message: 'ABC Corporation has registered as a new customer.',
        type: 'info' as const,
        actionUrl: '/customers'
      },
      {
        title: 'Quotation Approved',
        message: 'Quotation #QUO-2024-789 has been approved by the customer.',
        type: 'success' as const,
        actionUrl: '/quotations'
      },
      {
        title: 'Delivery Scheduled',
        message: 'Delivery for Order #ORD-2024-124 has been scheduled for tomorrow.',
        type: 'info' as const,
        actionUrl: '/delivery'
      },
      {
        title: 'Inventory Reorder Required',
        message: 'Product "Standard Widget" needs to be reordered. Current stock: 2 units.',
        type: 'warning' as const,
        actionUrl: '/inventory'
      },
      {
        title: 'Invoice Overdue',
        message: 'Invoice #INV-2024-123 is overdue by 5 days. Follow up required.',
        type: 'error' as const,
        actionUrl: '/invoicing'
      }
    ];

    bulkNotifications.forEach((notification, index) => {
      setTimeout(() => {
        addNotification(notification);
      }, index * 500); // Stagger the notifications
    });
  };

  return (
    // Expanded width to align with AI Assistant page layout
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notification System Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Single Notifications</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => addSampleNotification('info')}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Info className="h-4 w-4 mr-2" />
                Add Info
              </Button>
              <Button 
                onClick={() => addSampleNotification('success')}
                variant="outline"
                size="sm"
                className="flex items-center text-green-600 border-green-600 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Add Success
              </Button>
              <Button 
                onClick={() => addSampleNotification('warning')}
                variant="outline"
                size="sm"
                className="flex items-center text-yellow-600 border-yellow-600 hover:bg-yellow-50"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Add Warning
              </Button>
              <Button 
                onClick={() => addSampleNotification('error')}
                variant="outline"
                size="sm"
                className="flex items-center text-red-600 border-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Add Error
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Bulk Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={addBulkNotifications}
                variant="default"
                size="sm"
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Multiple Notifications
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Notification Types</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Info - General information</li>
                <li>• Success - Completed actions</li>
                <li>• Warning - Important alerts</li>
                <li>• Error - Failed operations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Features</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Real-time notifications</li>
                <li>• Click to navigate</li>
                <li>• Mark as read/unread</li>
                <li>• Delete individual notifications</li>
                <li>• Bulk actions (mark all read, clear all)</li>
                <li>• Search and filter</li>
                <li>• Full page view</li>
                <li>• Popup quick view</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900">How to Use</h4>
              <p className="text-sm text-blue-700 mt-1">
                Click the bell icon in the header to go to the full notifications page, or click the small blue dot next to it for a quick popup view. 
                Use the demo buttons above to add sample notifications and test the functionality.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
