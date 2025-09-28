import React, { useState } from "react";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Play, 
  Pause, 
  RotateCcw,
  Users,
  ShoppingCart,
  Warehouse,
  FileText,
  Upload,
  Truck,
  DollarSign,
  Package,
  Handshake,
  Ship,
  PackageOpen,
  Receipt,
  ClipboardList,
  Hand,
  ArrowDown,
  ArrowUp,
  Undo,
  Replace,
  Flag,
  Eye,
  Edit,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  ENHANCED_WORKFLOW_STEPS, 
  WORKFLOW_MODULES,
  getStepById,
  getStepsByModule,
  type WorkflowStep,
  type StepStatus
} from "@/lib/enhanced-workflow-constants";

interface ComprehensiveWorkflowStepperProps {
  currentStep?: number;
  completedSteps?: number[];
  className?: string;
  entityId?: string;
  entityName?: string;
  onStepClick?: (stepId: number) => void;
  onMarkComplete?: (stepId: number) => void;
  onViewDetails?: (stepId: number) => void;
  showModuleHeaders?: boolean;
  showProgressBar?: boolean;
  showStepDetails?: boolean;
  compact?: boolean;
}

interface StepStatus {
  stepId: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold' | 'requires_approval';
  completedAt?: string;
  assignedTo?: string;
  notes?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export default function ComprehensiveWorkflowStepper({ 
  currentStep = 8,
  completedSteps = [1, 2, 3, 4, 5, 6, 7],
  className,
  entityId,
  entityName,
  onStepClick,
  onMarkComplete,
  onViewDetails,
  showModuleHeaders = true,
  showProgressBar = true,
  showStepDetails = true,
  compact = false
}: ComprehensiveWorkflowStepperProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [stepNotes, setStepNotes] = useState('');
  const [stepPriority, setStepPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');

  // Mock step statuses - replace with actual data
  const stepStatuses: StepStatus[] = ENHANCED_WORKFLOW_STEPS.map(step => ({
    stepId: step.id,
    status: completedSteps.includes(step.id) ? 'completed' : 
            step.id === currentStep ? 'in_progress' : 'pending',
    completedAt: completedSteps.includes(step.id) ? 
                 new Date(Date.now() - (completedSteps.length - step.id) * 24 * 60 * 60 * 1000).toISOString() : undefined,
    assignedTo: step.id === currentStep ? "John Smith" : undefined,
    notes: step.id === currentStep ? "Quote #QT-906876B531 accepted by customer" : undefined,
    priority: step.id === currentStep ? "High" : "Medium"
  }));

  const getStepIcon = (step: WorkflowStep) => {
    switch (step.icon) {
      case "fas fa-users": return <Users className="h-4 w-4" />;
      case "fas fa-question-circle": return <FileText className="h-4 w-4" />;
      case "fas fa-file-alt": return <FileText className="h-4 w-4" />;
      case "fas fa-upload": return <Upload className="h-4 w-4" />;
      case "fas fa-shopping-cart": return <ShoppingCart className="h-4 w-4" />;
      case "fas fa-truck-moving": return <Truck className="h-4 w-4" />;
      case "fas fa-file-invoice": return <DollarSign className="h-4 w-4" />;
      case "fas fa-truck": return <Truck className="h-4 w-4" />;
      case "fas fa-clipboard-list": return <ClipboardList className="h-4 w-4" />;
      case "fas fa-file-contract": return <FileText className="h-4 w-4" />;
      case "fas fa-handshake": return <Handshake className="h-4 w-4" />;
      case "fas fa-shipping-fast": return <Ship className="h-4 w-4" />;
      case "fas fa-box-open": return <PackageOpen className="h-4 w-4" />;
      case "fas fa-receipt": return <Receipt className="h-4 w-4" />;
      case "fas fa-boxes": return <Package className="h-4 w-4" />;
      case "fas fa-hand-holding-box": return <Hand className="h-4 w-4" />;
      case "fas fa-warehouse": return <Warehouse className="h-4 w-4" />;
      case "fas fa-clipboard-check": return <ClipboardList className="h-4 w-4" />;
      case "fas fa-arrow-down": return <ArrowDown className="h-4 w-4" />;
      case "fas fa-arrow-up": return <ArrowUp className="h-4 w-4" />;
      case "fas fa-undo": return <Undo className="h-4 w-4" />;
      case "fas fa-exchange-alt": return <Replace className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress": return <Play className="h-4 w-4 text-blue-500" />;
      case "pending": return <Clock className="h-4 w-4 text-gray-400" />;
      case "cancelled": return <RotateCcw className="h-4 w-4 text-red-500" />;
      case "on_hold": return <Pause className="h-4 w-4 text-yellow-500" />;
      case "requires_approval": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50 border-green-200";
      case "in_progress": return "text-blue-600 bg-blue-50 border-blue-200";
      case "pending": return "text-gray-600 bg-gray-50 border-gray-200";
      case "cancelled": return "text-red-600 bg-red-50 border-red-200";
      case "on_hold": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "requires_approval": return "text-orange-600 bg-orange-50 border-orange-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "text-red-700 bg-red-100 border border-red-300";
      case "High": return "text-orange-700 bg-orange-100 border border-orange-300";
      case "Medium": return "text-yellow-700 bg-yellow-100 border border-yellow-300";
      case "Low": return "text-green-700 bg-green-100 border border-green-300";
      default: return "text-gray-700 bg-gray-100 border border-gray-300";
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case "Sales": return "text-blue-600";
      case "Purchase": return "text-indigo-600";
      case "Inventory": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "Sales": return <Users className="h-5 w-5" />;
      case "Purchase": return <ShoppingCart className="h-5 w-5" />;
      case "Inventory": return <Warehouse className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const calculateProgress = () => {
    return Math.round((completedSteps.length / ENHANCED_WORKFLOW_STEPS.length) * 100);
  };

  const renderModuleHeader = (module: string, steps: WorkflowStep[]) => {
    const moduleStats = {
      total: steps.length,
      completed: steps.filter(step => completedSteps.includes(step.id)).length,
      inProgress: steps.filter(step => step.id === currentStep).length,
      pending: steps.filter(step => !completedSteps.includes(step.id) && step.id !== currentStep).length
    };

    const moduleProgress = Math.round((moduleStats.completed / moduleStats.total) * 100);

    return (
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${getModuleColor(module).replace('text-', 'from-').replace('-600', '-500')} to-gray-500 flex items-center justify-center`}>
            {getModuleIcon(module)}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{module} Management</h3>
            <p className="text-sm text-gray-600">
              {moduleStats.completed} of {moduleStats.total} steps completed ({moduleProgress}%)
            </p>
          </div>
        </div>
        <Progress value={moduleProgress} className="h-2" />
      </div>
    );
  };

  const renderStep = (step: WorkflowStep, index: number, isLastInModule: boolean) => {
    const stepStatus = stepStatuses.find(s => s.stepId === step.id);
    const isCompleted = stepStatus?.status === 'completed';
    const isCurrent = stepStatus?.status === 'in_progress';
    const isPending = stepStatus?.status === 'pending';

    return (
      <div key={step.id} className="relative">
        {/* Step Card */}
        <Card className={cn(
          "transition-all duration-200 cursor-pointer hover:shadow-md",
          isCurrent ? "ring-2 ring-blue-200 shadow-md" : 
          isCompleted ? "bg-green-50 border-green-200" : 
          "hover:shadow-sm"
        )} onClick={() => onStepClick?.(step.id)}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Step Number/Icon */}
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                isCompleted ? "bg-green-500 border-green-500 text-white" :
                isCurrent ? "bg-blue-500 border-blue-500 text-white" :
                "bg-gray-100 border-gray-300 text-gray-500"
              )}>
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : step.id}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-lg">{step.name}</h4>
                  {getStepStatusIcon(stepStatus?.status || 'pending')}
                  {stepStatus?.priority && (
                    <Badge className={getPriorityColor(stepStatus.priority)}>
                      {stepStatus.priority}
                    </Badge>
                  )}
                  {step.requiresApproval && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      <Flag className="h-3 w-3 mr-1" />
                      {step.approvalLevel}
                    </Badge>
                  )}
                </div>
                
                {!compact && (
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    {getStepIcon(step)}
                    {step.subModule || step.module}
                  </span>
                  <span>Duration: {step.estimatedDuration} days</span>
                  {stepStatus?.assignedTo && (
                    <span>Assigned: {stepStatus.assignedTo}</span>
                  )}
                  {stepStatus?.completedAt && (
                    <span>Completed: {new Date(stepStatus.completedAt).toLocaleDateString()}</span>
                  )}
                </div>

                {stepStatus?.notes && !compact && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                    {stepStatus.notes}
                  </div>
                )}
              </div>

              {/* Step Actions */}
              <div className="flex items-center gap-2">
                <Badge className={getStepStatusColor(stepStatus?.status || 'pending')}>
                  {stepStatus?.status?.replace('_', ' ') || 'Pending'}
                </Badge>
                
                {showStepDetails && (
                  <div className="flex items-center gap-1">
                    {!isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStep(step.id);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails?.(step.id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connector Line */}
        {!isLastInModule && (
          <div className="flex justify-center my-2">
            <div className="w-px h-6 bg-gray-300"></div>
          </div>
        )}
      </div>
    );
  };

  const renderModule = (module: string, steps: WorkflowStep[]) => {
    return (
      <div key={module} className="space-y-2">
        {showModuleHeaders && renderModuleHeader(module, steps)}
        <div className="space-y-2">
          {steps.map((step, index) => 
            renderStep(step, index, index === steps.length - 1)
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                Comprehensive Workflow Progress
              </h2>
              <p className="text-muted-foreground text-lg">
                Complete ERP workflow from customer enquiry to inventory management
              </p>
              {entityName && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-blue-700 font-medium">Entity: {entityName}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        {showProgressBar && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {completedSteps.length} of {ENHANCED_WORKFLOW_STEPS.length} steps completed
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="font-medium">{calculateProgress()}% Complete</span>
              <span>100%</span>
            </div>
          </div>
        )}
      </div>

      {/* Workflow Steps by Module */}
      <div className="space-y-8">
        {Object.entries(WORKFLOW_MODULES).map(([moduleKey, module]) => 
          renderModule(moduleKey, module.steps)
        )}
      </div>

      {/* Step Completion Dialog */}
      <Dialog open={selectedStep !== null} onOpenChange={() => setSelectedStep(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedStep && getStepById(selectedStep)?.name} - Mark Complete
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStep && (
              <>
                <div>
                  <Label htmlFor="step-notes">Completion Notes</Label>
                  <Textarea
                    id="step-notes"
                    value={stepNotes}
                    onChange={(e) => setStepNotes(e.target.value)}
                    placeholder="Add notes about the completion of this step..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="step-priority">Priority for Next Steps</Label>
                  <Select value={stepPriority} onValueChange={(value: any) => setStepPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedStep(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      onMarkComplete?.(selectedStep);
                      setSelectedStep(null);
                      setStepNotes('');
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Mark Complete
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
