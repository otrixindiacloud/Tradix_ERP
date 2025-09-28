import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Eye,
  Pause,
  Ban,
  Timer
} from 'lucide-react';

// Status type definition for precise typing
export type StatusType = 
  | 'Completed' 
  | 'Approved' 
  | 'In Progress' 
  | 'Open' 
  | 'Pending' 
  | 'Cancelled' 
  | 'Rejected' 
  | 'On Hold' 
  | 'Overdue';

// Icon mapping for each status
const statusIcons: Record<StatusType, React.ReactNode> = {
  'Completed': <CheckCircle2 className="h-3 w-3" />,
  'Approved': <CheckCircle2 className="h-3 w-3" />,
  'In Progress': <Clock className="h-3 w-3" />,
  'Open': <Eye className="h-3 w-3" />,
  'Pending': <Clock className="h-3 w-3" />,
  'Cancelled': <Ban className="h-3 w-3" />,
  'Rejected': <XCircle className="h-3 w-3" />,
  'On Hold': <Pause className="h-3 w-3" />,
  'Overdue': <Timer className="h-3 w-3" />
};

// Status color mapping as specified
const statusColors: Record<StatusType, string> = {
  'Completed': 'bg-green-600 text-white',
  'Approved': 'bg-teal-600 text-white',
  'In Progress': 'bg-blue-600 text-white',
  'Open': 'bg-sky-400 text-white',
  'Pending': 'bg-orange-500 text-white',
  'Cancelled': 'bg-gray-500 text-white',
  'Rejected': 'bg-red-600 text-white',
  'On Hold': 'bg-yellow-400 text-black',
  'Overdue': 'bg-red-800 text-white'
};

// Create the component variants using cva
const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border-0 px-2.5 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm",
  {
    variants: {
      status: {
        'Completed': statusColors['Completed'],
        'Approved': statusColors['Approved'],
        'In Progress': statusColors['In Progress'],
        'Open': statusColors['Open'],
        'Pending': statusColors['Pending'],
        'Cancelled': statusColors['Cancelled'],
        'Rejected': statusColors['Rejected'],
        'On Hold': statusColors['On Hold'],
        'Overdue': statusColors['Overdue']
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType | string; // Allow string for flexibility but type for intellisense
  showIcon?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'minimal'; // Add minimal variant for tables
}

/**
 * StatusBadge Component
 * 
 * A reusable status badge component with predefined color mapping
 * for common business status types.
 * 
 * @param status - The status type (supports both typed and string values)
 * @param showIcon - Whether to show an icon next to the status text (default: true)
 * @param size - Size variant of the badge (sm, default, lg)
 * @param className - Additional CSS classes
 * @param variant - Style variant: 'default' for full badge, 'minimal' for simple text (default: 'default')
 * 
 * @example
 * <StatusBadge status="Completed" />
 * <StatusBadge status="In Progress" showIcon={false} />
 * <StatusBadge status="Pending" size="lg" />
 * <StatusBadge status="Approved" variant="minimal" /> // For tables
 */
export function StatusBadge({ 
  status, 
  showIcon = true, 
  size = "default",
  variant = "default",
  className, 
  ...props 
}: StatusBadgeProps) {
  // Normalize status to match our predefined types
  const normalizedStatus = status as StatusType;
  
  // Get the appropriate color class
  const colorClass = statusColors[normalizedStatus] || 'bg-gray-500 text-white';
  
  // Get the appropriate icon
  const icon = showIcon ? (statusIcons[normalizedStatus] || <Clock className="h-3 w-3" />) : null;

  // Minimal variant for tables - just colored text
  if (variant === "minimal") {
    const textColorMap: Record<StatusType, string> = {
      'Completed': 'text-green-600',
      'Approved': 'text-teal-600',
      'In Progress': 'text-blue-600',
      'Open': 'text-sky-600',
      'Pending': 'text-orange-600',
      'Cancelled': 'text-gray-600',
      'Rejected': 'text-red-600',
      'On Hold': 'text-yellow-600',
      'Overdue': 'text-red-800'
    };
    
    const textColor = textColorMap[normalizedStatus] || 'text-gray-600';
    
    return (
      <span 
        className={cn(
          "font-medium",
          textColor,
          size === 'sm' && "text-xs",
          size === 'lg' && "text-sm",
          className
        )} 
        {...props}
      >
        {status}
      </span>
    );
  }

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-0 px-2.5 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm",
        colorClass,
        size === 'sm' && "px-2 py-0.5 text-xs",
        size === 'lg' && "px-3 py-1.5 text-sm",
        className
      )} 
      {...props}
    >
      {icon}
      <span>{status}</span>
    </div>
  );
}

// Helper function to get status color class for use in other components
export function getStatusColorClass(status: StatusType | string): string {
  return statusColors[status as StatusType] || 'bg-gray-500 text-white';
}

// Helper function to get status icon for use in other components
export function getStatusIcon(status: StatusType | string): React.ReactNode {
  return statusIcons[status as StatusType] || <Clock className="h-3 w-3" />;
}

export default StatusBadge;