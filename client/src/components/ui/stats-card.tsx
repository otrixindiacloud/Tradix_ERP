import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  description: string;
  className?: string;
  iconClassName?: string;
  valueClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  description,
  className,
  iconClassName,
  valueClassName,
  labelClassName,
  descriptionClassName,
}: StatsCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4",
      className
    )}>
      {/* Icon Container */}
      <div className={cn(
        "w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0",
        iconClassName
      )}>
        <Icon className="h-8 w-8 text-blue-600" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={cn(
          "text-sm font-semibold text-gray-700 mb-1",
          labelClassName
        )}>
          {label}
        </div>
        <div className={cn(
          "text-3xl font-bold text-gray-900 mb-1",
          valueClassName
        )}>
          {value}
        </div>
        <div className={cn(
          "text-sm text-gray-600",
          descriptionClassName
        )}>
          {description}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
