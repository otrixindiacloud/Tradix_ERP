import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import { ReactNode } from "react";
import { 
  FaSpinner, 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaClock, 
  FaTimes, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaDownload, 
  FaPrint,
  FaCalendarAlt,
  FaDollarSign,
  FaTag,
  FaInfoCircle,
  FaDatabase
} from "react-icons/fa";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (value: any, item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  isLoading,
  emptyMessage = "No data available",
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="h-6 w-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Loading data...</span>
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <FaDatabase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500" data-testid="text-empty-state">
          {emptyMessage}
        </p>
      </div>
    );
  }

  const renderCellValue = (column: Column<T>, item: T) => {
    const keyStr = column.key.toString();
    const value = keyStr.includes('.') 
      ? keyStr.split('.').reduce((obj: any, key: string) => obj?.[key], item)
      : item[column.key];

    // Always use custom render function if provided
    if (column.render) {
      return column.render(value, item);
    }

    // Default renderers for common types (only if no custom render function)
    if (column.key.toString().toLowerCase().includes('date') && value) {
      return (
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="h-4 w-4 text-gray-500" />
          <span>{formatDate(value)}</span>
        </div>
      );
    }

    if (column.key.toString().toLowerCase().includes('amount') && typeof value === 'number') {
      return (
        <div className="flex items-center gap-2">
          <FaDollarSign className="h-4 w-4 text-green-600" />
          <span className="font-medium">{formatCurrency(value)}</span>
        </div>
      );
    }

    // Only apply default status renderer if the key is exactly 'status' or doesn't have a custom renderer
    if (column.key.toString().toLowerCase() === 'status' && typeof value === 'string') {
      const getStatusIcon = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('pending') || statusLower.includes('waiting')) {
          return <FaClock className="h-3 w-3" />;
        }
        if (statusLower.includes('completed') || statusLower.includes('approved') || statusLower.includes('accepted')) {
          return <FaCheckCircle className="h-3 w-3" />;
        }
        if (statusLower.includes('rejected') || statusLower.includes('cancelled') || statusLower.includes('failed')) {
          return <FaTimes className="h-3 w-3" />;
        }
        if (statusLower.includes('urgent') || statusLower.includes('error')) {
          return <FaExclamationCircle className="h-3 w-3" />;
        }
        return <FaInfoCircle className="h-3 w-3" />;
      };

      return (
        <Badge variant="outline" className={getStatusColor(value)}>
          <div className="flex items-center gap-1">
            {getStatusIcon(value)}
            {value}
          </div>
        </Badge>
      );
    }

    return value || '-';
  };

  return (
  <div className={cn("bg-white border border-indigo-200 rounded-xl", className)}>
    <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.key.toString()} 
                className={cn(column.className)}
                style={{ width: column.width }}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={item.id || index}
              className={cn(
                onRowClick && "cursor-pointer transition-colors"
              )}
              onClick={() => onRowClick?.(item)}
              data-testid={`row-${item.id || index}`}
            >
              {columns.map((column) => (
                <TableCell 
                  key={column.key.toString()}
                  className={cn(column.className)}
                  data-testid={`cell-${column.key.toString()}-${item.id || index}`}
                >
                  {renderCellValue(column, item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
