import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  X, 
  ArrowRight, 
  Play, 
  Pause, 
  RotateCcw,
  Calendar,
  User,
  FileText,
  Package,
  Truck,
  DollarSign,
  Eye,
  Edit,
  Download,
  Upload,
  ShoppingCart,
  Save,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { WORKFLOW_STEPS } from "@/lib/constants";

interface WorkflowStepCompletionProps {
  entityId: string;
  entityType: string;
  currentStep: number;
  onStepComplete: (stepId: number, notes: string) => void;
  onStepSkip: (stepId: number, reason: string) => void;
  onStepBlock: (stepId: number, reason: string) => void;
  className?: string;
}

export default function WorkflowStepCompletion({
  entityId,
  entityType,
  currentStep,
  onStepComplete,
  onStepSkip,
  onStepBlock,
  className
}: WorkflowStepCompletionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  const [skipReason, setSkipReason] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [selectedAction, setSelectedAction] = useState<"complete" | "skip" | "block">("complete");

  const currentStepConfig = WORKFLOW_STEPS.find(step => step.id === currentStep);
  const nextStepConfig = WORKFLOW_STEPS.find(step => step.id === currentStep + 1);

  // Complete step mutation
  const completeStepMutation = useMutation({
    mutationFn: async ({ stepId, notes }: { stepId: number; notes: string }) => {
      const response = await fetch(`/api/workflow/complete/${currentStepConfig?.name.toLowerCase().replace(' ', '-')}/${entityId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, nextStep: nextStepConfig?.name.toLowerCase().replace(' ', '-') })
      });
      if (!response.ok) throw new Error("Failed to complete step");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow-progress"] });
      setIsDialogOpen(false);
      setCompletionNotes("");
      toast({
        title: "Success",
        description: "Workflow step completed successfully",
      });
      onStepComplete(currentStep, completionNotes);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete workflow step",
        variant: "destructive",
      });
    }
  });

  const handleAction = () => {
    if (selectedAction === "complete") {
      completeStepMutation.mutate({
        stepId: currentStep,
        notes: completionNotes
      });
    } else if (selectedAction === "skip") {
      onStepSkip(currentStep, skipReason);
      setIsDialogOpen(false);
      setSkipReason("");
    } else if (selectedAction === "block") {
      onStepBlock(currentStep, blockReason);
      setIsDialogOpen(false);
      setBlockReason("");
    }
  };

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

  if (!currentStepConfig) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Step Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
              {getStepIcon(currentStep)}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{currentStepConfig.name}</h3>
              <p className="text-sm text-gray-600">{currentStepConfig.description}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Required Fields */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Required Fields</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {currentStepConfig.requiredFields.map(field => (
                  <div key={field} className="flex items-center space-x-2 text-sm p-2 bg-white rounded border">
                    <Clock className="h-3 w-3 text-yellow-500" />
                    <span className="capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Criteria */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Success Criteria</Label>
              <p className="text-sm text-gray-600 mt-1">{currentStepConfig.successCriteria}</p>
            </div>

            {/* Next Actions */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Next Actions</Label>
              <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                {currentStepConfig.nextActions.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-4 border-t">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Step
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Complete {currentStepConfig.name} Step</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="action-type">Action Type</Label>
                      <Select value={selectedAction} onValueChange={(value: "complete" | "skip" | "block") => setSelectedAction(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="complete">Complete Step</SelectItem>
                          <SelectItem value="skip">Skip Step</SelectItem>
                          <SelectItem value="block">Block Step</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedAction === "complete" && (
                      <div>
                        <Label htmlFor="completion-notes">Completion Notes</Label>
                        <Textarea
                          id="completion-notes"
                          placeholder="Add notes about step completion..."
                          value={completionNotes}
                          onChange={(e) => setCompletionNotes(e.target.value)}
                          rows={3}
                        />
                      </div>
                    )}

                    {selectedAction === "skip" && (
                      <div>
                        <Label htmlFor="skip-reason">Skip Reason</Label>
                        <Textarea
                          id="skip-reason"
                          placeholder="Why is this step being skipped?"
                          value={skipReason}
                          onChange={(e) => setSkipReason(e.target.value)}
                          rows={3}
                        />
                      </div>
                    )}

                    {selectedAction === "block" && (
                      <div>
                        <Label htmlFor="block-reason">Block Reason</Label>
                        <Textarea
                          id="block-reason"
                          placeholder="What is blocking this step?"
                          value={blockReason}
                          onChange={(e) => setBlockReason(e.target.value)}
                          rows={3}
                        />
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAction}
                        disabled={completeStepMutation.isPending}
                        className={
                          selectedAction === "complete" ? "bg-green-600 hover:bg-green-700" :
                          selectedAction === "skip" ? "bg-yellow-600 hover:bg-yellow-700" :
                          "bg-red-600 hover:bg-red-700"
                        }
                      >
                        {selectedAction === "complete" ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Complete
                          </>
                        ) : selectedAction === "skip" ? (
                          <>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Skip
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Block
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Step Preview */}
      {nextStepConfig && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500">
                {getStepIcon(nextStepConfig.id)}
              </div>
              <div>
                <h4 className="text-md font-medium">Next: {nextStepConfig.name}</h4>
                <p className="text-sm text-gray-600">{nextStepConfig.description}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Estimated Duration</span>
                <span className="font-medium">{nextStepConfig.estimatedDuration} days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Dependencies</span>
                <span className="font-medium">
                  {nextStepConfig.dependencies.length > 0 ? 
                    `${nextStepConfig.dependencies.length} required` : 
                    "None"
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
