import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusKind = 'accepted' | 'approved' | 'pending' | 'in-progress' | 'warning' | 'error' | 'info' | 'default' 
  | 'completed' | 'open' | 'cancelled' | 'rejected' | 'on-hold' | 'overdue';

interface StatusPillProps {
  status: StatusKind | string; // allow free-form but map known ones
  children?: React.ReactNode; // custom label override
  className?: string;
  title?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  accepted: <Info className="h-4 w-4" />,
  confirmed: <Info className="h-4 w-4" />,
  approved: <CheckCircle2 className="h-4 w-4" />,
  completed: <CheckCircle2 className="h-4 w-4" />,
  'in-progress': <Clock className="h-4 w-4" />,
  pending: <Clock className="h-4 w-4" />,
  open: <Info className="h-4 w-4" />,
  'on-hold': <Clock className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
  overdue: <AlertTriangle className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  error: <XCircle className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
  default: <Info className="h-4 w-4" />
};

// Unified style tokens
const baseClasses = 'inline-flex items-center gap-1.5 rounded-full border text-xs font-medium px-2 py-0.5 transition-colors h-6 min-w-[64px] justify-center';

// Status color/style mapping for pill backgrounds and borders
const styleMap: Record<string, string> = {
  accepted: 'bg-blue-50 border-blue-200 text-blue-700',
  confirmed: 'bg-blue-50 border-blue-200 text-blue-700',
  approved: 'bg-green-50 border-green-200 text-green-700',
  completed: 'bg-green-50 border-green-200 text-green-700',
  'in-progress': 'bg-yellow-50 border-yellow-200 text-yellow-700',
  pending: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  open: 'bg-blue-50 border-blue-200 text-blue-700',
  'on-hold': 'bg-gray-50 border-gray-200 text-gray-700',
  cancelled: 'bg-red-50 border-red-200 text-red-700',
  rejected: 'bg-red-50 border-red-200 text-red-700',
  overdue: 'bg-orange-50 border-orange-200 text-orange-700',
  warning: 'bg-orange-50 border-orange-200 text-orange-700',
  error: 'bg-red-50 border-red-200 text-red-700',
  info: 'bg-gray-50 border-gray-200 text-gray-700',
  draft: 'bg-gray-50 border-gray-200 text-gray-700',
  default: 'bg-gray-50 border-gray-200 text-gray-700'
};

const getStatusBadgeClass = (status: string) => {
  const key = status.toLowerCase();
  return styleMap[key] || styleMap.default;
};
function normalize(status: string): keyof typeof styleMap {
  const s = status.toLowerCase();
  if (s === 'draft') return 'draft';
  if (s === 'confirmed') return 'confirmed';
  if (s.includes('complete')) return 'completed';
  if (s.includes('accept')) return 'accepted';
  if (s.includes('approve')) return 'approved';
  if (['pending','awaiting','waiting'].some(w => s.includes(w))) return 'pending';
  if (s.includes('progress')) return 'in-progress';
  if (s.includes('open')) return 'open';
  if (s.includes('hold')) return 'on-hold';
  if (s.includes('cancel')) return 'cancelled';
  if (s.includes('overdue')) return 'overdue';
  if (s.includes('warn')) return 'warning';
  if (['error','fail','reject','declined'].some(w => s.includes(w))) return 'rejected';
  if (['info','information','note'].some(w => s.includes(w))) return 'info';
  return 'default';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, children, className, title }) => {
  const key = normalize(status);
  return (
    <span className={cn(baseClasses, styleMap[key], className)} title={title || status} data-status={key}>
      <span className="flex items-center justify-center text-current">
        {iconMap[key] || iconMap.default}
      </span>
      <span>{children || (status.charAt(0).toUpperCase() + status.slice(1))}</span>
    </span>
  );
};

export default StatusPill;
