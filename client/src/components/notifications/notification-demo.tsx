import React from 'react';
import { Button } from '@/components/ui/button';
import { useNotifications } from './notification-context';

export const NotificationDemo: React.FC = () => {
  const { addNotification } = useNotifications();

  const addSampleNotification = (type: 'info' | 'success' | 'warning' | 'error') => {
    const notifications = {
      info: {
        title: 'System Update',
        message: 'A new system update is available. Please restart the application to apply changes.',
        type: 'info' as const
      },
      success: {
        title: 'Order Completed',
        message: 'Order #ORD-2024-123 has been successfully processed and shipped.',
        type: 'success' as const
      },
      warning: {
        title: 'Low Stock Alert',
        message: 'Product inventory is running low. Consider placing a reorder soon.',
        type: 'warning' as const
      },
      error: {
        title: 'Payment Failed',
        message: 'Payment processing failed for Invoice #INV-2024-456. Please retry or contact support.',
        type: 'error' as const
      }
    };

    addNotification(notifications[type]);
  };

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-lg font-semibold mb-4">Test Notifications</h3>
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={() => addSampleNotification('info')}
          variant="outline"
          size="sm"
        >
          Add Info Notification
        </Button>
        <Button 
          onClick={() => addSampleNotification('success')}
          variant="outline"
          size="sm"
          className="text-green-600 border-green-600 hover:bg-green-50"
        >
          Add Success Notification
        </Button>
        <Button 
          onClick={() => addSampleNotification('warning')}
          variant="outline"
          size="sm"
          className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
        >
          Add Warning Notification
        </Button>
        <Button 
          onClick={() => addSampleNotification('error')}
          variant="outline"
          size="sm"
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          Add Error Notification
        </Button>
      </div>
    </div>
  );
};
