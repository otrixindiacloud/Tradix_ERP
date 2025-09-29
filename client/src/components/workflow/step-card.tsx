import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StepCardProps {
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed" | "error";
  count?: number;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
  className?: string;
}

export default function StepCard({
  title,
  description,
  status,
  count,
  icon,
  action,
  children,
  className,
}: StepCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "underline decoration-green-500 text-green-700";
      case "in-progress":
        return "underline decoration-gray-500 text-gray-700";
      case "error":
        return "underline decoration-red-500 text-red-700";
      default:
        return "underline decoration-gray-500 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "error":
        return "Requires Action";
      default:
        return "Pending";
    }
  };

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-lg">{icon}</div>}
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          {count !== undefined && (
            <Badge variant="secondary" data-testid={`count-${title.toLowerCase().replace(' ', '-')}`}>
              {count}
            </Badge>
          )}
          <Badge 
            className={getStatusColor(status)}
            data-testid={`status-${title.toLowerCase().replace(' ', '-')}`}
          >
            {getStatusLabel(status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-gray-600 mb-4" data-testid={`description-${title.toLowerCase().replace(' ', '-')}`}>
            {description}
          </p>
        )}
        {children}
        {action && (
          <div className="mt-4">
            <Button 
              onClick={action.onClick} 
              size="sm"
              data-testid={`button-${action.label.toLowerCase().replace(' ', '-')}`}
            >
              {action.label}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
