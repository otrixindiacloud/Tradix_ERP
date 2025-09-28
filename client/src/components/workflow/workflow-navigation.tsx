import React from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  BarChart3, 
  Settings,
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  X,
  User,
  FileText,
  Package,
  Truck,
  DollarSign,
  Upload,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { WORKFLOW_STEPS } from "@/lib/constants";

interface WorkflowNavigationProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (stepId: number) => void;
  className?: string;
}

export default function WorkflowNavigation({
  currentStep,
  completedSteps,
  onStepClick,
  className
}: WorkflowNavigationProps) {
  const [, navigate] = useLocation();

  const getStepIcon = (stepId: number) => {
    const step = WORKFLOW_STEPS.find(s => s.id === stepId);
    switch (step?.name) {
      case "Customer": return <User className="h-4 w-4" />;
      case "Enquiry": return <FileText className="h-4 w-4" />;
      case "Quotation": return <FileText className="h-4 w-4" />;
      case "Acceptance": return <CheckCircle className="h-4 w-4" />;
      case "Customer PO Upload": return <Upload className="h-4 w-4" />;
      case "Sales Order": return <ShoppingCart className="h-4 w-4" />;
      case "Supplier LPO": return <Truck className="h-4 w-4" />;
      case "Goods Receipt": return <Package className="h-4 w-4" />;
      case "Inventory": return <Package className="h-4 w-4" />;
      case "Delivery Note": return <Truck className="h-4 w-4" />;
      case "Invoice": return <DollarSign className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return "completed";
    if (stepId === currentStep) return "current";
    if (stepId < currentStep) return "completed";
    return "pending";
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500 border-green-500 text-white";
      case "current": return "bg-blue-500 border-blue-500 text-white";
      case "pending": return "bg-gray-100 border-gray-300 text-gray-500";
      default: return "bg-gray-100 border-gray-300 text-gray-500";
    }
  };

  const getStepBadgeColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "current": return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const progress = (completedSteps.length / WORKFLOW_STEPS.length) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Workflow Progress</h2>
            <p className="text-sm text-gray-600">Step {currentStep} of {WORKFLOW_STEPS.length}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/workflow-dashboard")}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/workflow")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{completedSteps.length} completed</span>
              <span>{WORKFLOW_STEPS.length - completedSteps.length} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <div className="space-y-2">
        {WORKFLOW_STEPS.map((step, index) => {
          const status = getStepStatus(step.id);
          const isClickable = status === "completed" || status === "current";
          
          return (
            <Card 
              key={step.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                status === "current" ? "border-blue-500 bg-blue-50" :
                status === "completed" ? "border-green-500 bg-green-50" :
                "border-gray-200 bg-gray-50"
              }`}
              onClick={() => isClickable && onStepClick(step.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${getStepColor(status)}`}>
                    {status === "completed" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      getStepIcon(step.id)
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {step.name}
                      </h3>
                      <Badge className={getStepBadgeColor(status)}>
                        {status === "completed" ? "Completed" :
                         status === "current" ? "Current" :
                         "Pending"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {step.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Est: {step.estimatedDuration}d</span>
                      <span>•</span>
                      <span>{step.requiredFields.length} fields</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {status === "completed" && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {status === "current" && (
                      <Clock className="h-4 w-4 text-blue-500" />
                    )}
                    {status === "pending" && (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Quick Actions</h4>
              <p className="text-xs text-gray-600">Navigate to specific workflow sections</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/customers")}
              >
                <User className="h-4 w-4 mr-2" />
                Customers
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/enquiries")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Enquiries
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/quotations")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Quotations
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/sales-orders")}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Sales Orders
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}