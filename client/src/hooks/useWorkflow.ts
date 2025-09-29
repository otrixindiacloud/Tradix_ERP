import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { WORKFLOW_STEPS } from "@/lib/constants";

interface WorkflowState {
  currentStep: number;
  completedSteps: number[];
  status: "pending" | "in_progress" | "completed" | "blocked" | "cancelled";
  progress: number;
  nextAction: string;
  blockers: string[];
  lastUpdated: string;
  assignedTo?: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  totalValue: number;
  startDate: string;
  completionDate?: string;
  duration: number;
  efficiency: number;
  
  // Enhanced fields for better flow implementation
  stepDetails: {
    stepId: number;
    stepName: string;
    description: string;
    estimatedDuration: number;
    actualDuration?: number;
    requiredFields: string[];
    completedFields: string[];
    missingFields: string[];
    dependencies: number[];
    dependenciesMet: boolean;
    validationRules: Record<string, any>;
    successCriteria: string;
    nextActions: string[];
    status: "not_started" | "in_progress" | "completed" | "blocked";
    startTime?: string;
    endTime?: string;
    notes?: string;
    attachments?: string[];
  }[];
  
  // Workflow metadata
  workflowVersion: string;
  createdBy: string;
  lastModifiedBy: string;
  tags: string[];
  category: string;
  department: string;
  location: string;
  
  // Performance metrics
  stepEfficiency: Record<number, number>;
  averageStepDuration: number;
  bottlenecks: number[];
  riskFactors: string[];
  
  // Compliance and audit
  auditTrail: {
    timestamp: string;
    action: string;
    performedBy: string;
    details: string;
    changes?: Record<string, any>;
  }[];
  
  // Notifications and alerts
  notifications: {
    id: string;
    type: "info" | "warning" | "error" | "success";
    message: string;
    timestamp: string;
    read: boolean;
    actionRequired: boolean;
  }[];
  
  // Escalation
  escalationLevel: number;
  escalationReason?: string;
  escalatedTo?: string;
  escalationDate?: string;
}

interface WorkflowValidation {
  canProceed: boolean;
  message: string;
  nextStep: string;
  requiredActions: string[];
}

interface UseWorkflowOptions {
  entityId?: string;
  entityType?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useWorkflow(options: UseWorkflowOptions = {}) {
  const { entityId, entityType = "enquiry", autoRefresh = true, refreshInterval = 30000 } = options;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch workflow progress
  const { data: workflowState, isLoading, error } = useQuery({
    queryKey: ["workflow-progress", entityId, entityType],
    queryFn: async () => {
      if (!entityId) return null;
      
      const response = await fetch(`/api/workflow/progress/${entityId}?entityType=${entityType}`);
      if (!response.ok) throw new Error("Failed to fetch workflow progress");
      return await response.json();
    },
    enabled: !!entityId,
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  // Validate workflow step
  const validateStep = useCallback(async (step: string, entityId: string): Promise<WorkflowValidation> => {
    try {
      const response = await fetch(`/api/workflow/validate/${step}/${entityId}`);
      if (!response.ok) throw new Error("Failed to validate workflow step");
      return await response.json();
    } catch (error) {
      console.error("Error validating workflow step:", error);
      throw error;
    }
  }, []);

  // Complete workflow step
  const completeStepMutation = useMutation({
    mutationFn: async ({ step, entityId, notes }: { step: string; entityId: string; notes?: string }) => {
      const response = await fetch(`/api/workflow/complete/${step}/${entityId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes })
      });
      if (!response.ok) throw new Error("Failed to complete workflow step");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow-progress"] });
      toast({
        title: "Success",
        description: "Workflow step completed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete workflow step",
        variant: "destructive",
      });
    }
  });

  // Navigate to next step
  const navigateToNextStep = useCallback((currentStep: number) => {
    const nextStep = WORKFLOW_STEPS.find(step => step.id === currentStep + 1);
    if (nextStep) {
      return nextStep.path;
    }
    return null;
  }, []);

  // Get step information
  const getStepInfo = useCallback((stepId: number) => {
    return WORKFLOW_STEPS.find(step => step.id === stepId);
  }, []);

  // Calculate progress percentage
  const calculateProgress = useCallback((completedSteps: number[], currentStep: number) => {
    const totalSteps = WORKFLOW_STEPS.length;
    const completed = completedSteps.length;
    const current = currentStep > 0 ? 1 : 0;
    return Math.round(((completed + current) / totalSteps) * 100);
  }, []);

  // Check if step is accessible
  const isStepAccessible = useCallback(async (stepId: number) => {
    if (!entityId) return false;
    
    const step = getStepInfo(stepId);
    if (!step) return false;

    try {
      const validation = await validateStep(step.name.toLowerCase().replace(' ', '-'), entityId);
      return validation.canProceed;
    } catch (error) {
      console.error("Error checking step accessibility:", error);
      return false;
    }
  }, [entityId, getStepInfo, validateStep]);

  // Get workflow analytics
  const { data: analytics } = useQuery({
    queryKey: ["workflow-analytics"],
    queryFn: async () => {
      const response = await fetch("/api/workflow/analytics?period=30d");
      if (!response.ok) throw new Error("Failed to fetch workflow analytics");
      return await response.json();
    }
  });

  // Get all workflows
  const { data: allWorkflows = [] } = useQuery({
    queryKey: ["workflow-progress"],
    queryFn: async () => {
      const response = await fetch("/api/workflow/progress");
      if (!response.ok) throw new Error("Failed to fetch workflows");
      return await response.json();
    }
  });

  // Workflow state management
  const [localState, setLocalState] = useState<Partial<WorkflowState>>({});

  // Update local state when workflow state changes
  useEffect(() => {
    if (workflowState) {
      setLocalState(workflowState);
    }
  }, [workflowState]);

  // Update workflow state
  const updateWorkflowState = useCallback((updates: Partial<WorkflowState>) => {
    setLocalState(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset workflow state
  const resetWorkflowState = useCallback(() => {
    setLocalState({});
  }, []);

  // Get workflow status color
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100";
      case "in_progress": return "text-blue-600 bg-blue-100";
      case "blocked": return "text-red-600 bg-red-100";
      case "cancelled": return "text-gray-600 bg-gray-100";
      default: return "text-yellow-600 bg-yellow-100";
    }
  }, []);

  // Get priority color
  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case "Urgent": return "text-red-800 bg-red-100 border-red-200";
      case "High": return "text-orange-800 bg-orange-100 border-orange-200";
      case "Medium": return "text-white bg-yellow-100 border-yellow-200";
      case "Low": return "text-green-800 bg-green-100 border-green-200";
      default: return "text-gray-800 bg-gray-100 border-gray-200";
    }
  }, []);

  // Get step status
  const getStepStatus = useCallback((stepId: number) => {
    if (!workflowState) return "pending";
    
    if (workflowState.completedSteps.includes(stepId)) return "completed";
    if (stepId === workflowState.currentStep) return "current";
    if (stepId < workflowState.currentStep) return "completed";
    return "pending";
  }, [workflowState]);

  // Get next available step
  const getNextAvailableStep = useCallback(() => {
    if (!workflowState) return null;
    
    for (let i = workflowState.currentStep; i <= WORKFLOW_STEPS.length; i++) {
      const step = WORKFLOW_STEPS.find(s => s.id === i);
      if (step) {
        return step;
      }
    }
    return null;
  }, [workflowState]);

  // Get previous step
  const getPreviousStep = useCallback(() => {
    if (!workflowState || workflowState.currentStep <= 1) return null;
    
    return WORKFLOW_STEPS.find(s => s.id === workflowState.currentStep - 1);
  }, [workflowState]);

  // Check if workflow is complete
  const isWorkflowComplete = useCallback(() => {
    return workflowState?.status === "completed" || 
           (workflowState?.completedSteps.length === WORKFLOW_STEPS.length);
  }, [workflowState]);

  // Get workflow efficiency
  const getWorkflowEfficiency = useCallback(() => {
    if (!workflowState) return 0;
    
    const expectedDuration = 30; // Expected 30 days for full workflow
    const actualDuration = workflowState.duration;
    return Math.max(0, Math.min(100, (expectedDuration / actualDuration) * 100));
  }, [workflowState]);

  // Get workflow summary
  const getWorkflowSummary = useCallback(() => {
    if (!workflowState) return null;
    
    return {
      currentStep: getStepInfo(workflowState.currentStep),
      completedSteps: workflowState.completedSteps.map(id => getStepInfo(id)).filter(Boolean),
      remainingSteps: WORKFLOW_STEPS.filter(step => 
        step.id > workflowState.currentStep && !workflowState.completedSteps.includes(step.id)
      ),
      progress: calculateProgress(workflowState.completedSteps, workflowState.currentStep),
      isComplete: isWorkflowComplete(),
      efficiency: getWorkflowEfficiency(),
      duration: workflowState.duration,
      status: workflowState.status,
      priority: workflowState.priority,
      totalValue: workflowState.totalValue
    };
  }, [workflowState, getStepInfo, calculateProgress, isWorkflowComplete, getWorkflowEfficiency]);

  return {
    // State
    workflowState: localState as WorkflowState,
    isLoading,
    error,
    analytics,
    allWorkflows,
    
    // Actions
    validateStep,
    completeStep: completeStepMutation.mutate,
    isCompleting: completeStepMutation.isPending,
    navigateToNextStep,
    updateWorkflowState,
    resetWorkflowState,
    
    // Utilities
    getStepInfo,
    getStepStatus,
    getNextAvailableStep,
    getPreviousStep,
    isStepAccessible,
    isWorkflowComplete,
    getWorkflowEfficiency,
    getWorkflowSummary,
    getStatusColor,
    getPriorityColor,
    calculateProgress
  };
}
