import { cn } from "@/lib/utils";
import { ENHANCED_WORKFLOW_STEPS } from "@/lib/enhanced-workflow-constants";
import { CheckIcon } from "lucide-react";
import { useLocation } from "wouter";
import { 
  FaCheckCircle, 
  FaClock, 
  FaArrowRight, 
  FaPlay, 
  FaPause, 
  FaStop, 
  FaEye, 
  FaCheck, 
  FaExclamationCircle,
  FaInfoCircle,
  FaQuestionCircle,
  FaFileInvoice,
  FaShoppingCart,
  FaTruck,
  FaWarehouse,
  FaDollarSign,
  FaReceipt,
  FaBox,
  FaBuilding,
  FaUser,
  FaCog,
  FaChartBar,
  FaTasks,
  FaFlag,
  FaFlagCheckered
} from "react-icons/fa";

interface WorkflowStepperProps {
  currentStep?: number;
  completedSteps?: number[];
  className?: string;
  quotationId?: string;
  quotationNumber?: string;
  quotationStatus?: string;
  onMarkComplete?: () => void;
  onViewDetails?: () => void;
  reflectionCard?: React.ReactNode;
}

export default function WorkflowStepper({ 
  currentStep = 3, 
  completedSteps = [1, 2], 
  className,
  quotationId,
  quotationNumber = "QT-2024-001",
  quotationStatus,
  onMarkComplete,
  onViewDetails
}: WorkflowStepperProps) {
  const [, navigate] = useLocation();
  // Progress expressed as a fraction (0-1) instead of percent so we can
  // accurately size the active bar when we add horizontal insets to hide
  // the left "extra" line before the first step circle.
  const progressFraction = (completedSteps.length + (currentStep > 0 ? 1 : 0)) / ENHANCED_WORKFLOW_STEPS.length;
  const progressPercent = progressFraction * 100; // still available if needed elsewhere

  const handleMarkComplete = () => {
    console.log('Mark Complete button clicked', { onMarkComplete, quotationId });
    if (onMarkComplete) {
      console.log('Using onMarkComplete callback');
      onMarkComplete();
    } else if (quotationId) {
      console.log('Navigating to customer acceptance page:', `/quotations/${quotationId}/acceptance`);
      // Navigate to customer acceptance page for this quotation
      navigate(`/quotations/${quotationId}/acceptance`);
    } else {
      console.warn('No onMarkComplete callback or quotationId provided');
    }
  };

  const handleViewDetails = () => {
    console.log('View Details button clicked', { onViewDetails, quotationId });
    if (onViewDetails) {
      console.log('Using onViewDetails callback');
      onViewDetails();
    } else {
      console.log('Navigating to process flow details page:', `/process-flow-details`);
      // Navigate to process flow details page
      navigate(`/process-flow-details`);
    }
  };

  // Derive current step meta
  const currentStepMeta = ENHANCED_WORKFLOW_STEPS.find(s => s.id === currentStep);
  const currentStepName = currentStepMeta ? currentStepMeta.name : '—';

  // Dynamic descriptive line based on quotation status & step
  const description = (() => {
    if (!quotationNumber) return 'No quotation yet.';
    if (!quotationStatus) return `Quote #${quotationNumber}`;
    switch (quotationStatus) {
      case 'Draft': return `Quote #${quotationNumber} is in draft`; 
      case 'Under Review': return `Quote #${quotationNumber} under internal review`;
      case 'Approved': return `Quote #${quotationNumber} approved – ready to send`;
      case 'Sent': return `Quote #${quotationNumber} sent – awaiting customer response`;
      case 'Accepted': return `Quote #${quotationNumber} accepted by customer`;
      case 'Rejected': return `Quote #${quotationNumber} rejected internally`;
      case 'Rejected by Customer': return `Quote #${quotationNumber} rejected by customer`;
      case 'Expired': return `Quote #${quotationNumber} expired – create revision`;
      default: return `Quote #${quotationNumber} (${quotationStatus})`;
    }
  })();

  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200 p-6", className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FaTasks className="h-5 w-5 text-gray-600" />
        Sequential Workflow Progress
      </h3>
      
      <div className="flex items-center justify-between relative">
        {/* Progress Line (track) - positioned to start and end at the center of first and last circles */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200" style={{ left: '2rem', right: '2rem' }} />
        {/* Active progress bar sized relative to the track width */}
        <div
          className="absolute top-4 h-0.5 bg-gray-400 transition-all duration-500"
          style={{ 
            left: '2rem',
            width: `calc(100% - 4rem) * ${progressFraction}` 
          }}
        />
        
        {/* Steps */}
        <div className="flex items-center justify-between w-full relative z-10">
          {ENHANCED_WORKFLOW_STEPS.slice(0, 12).map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            const isPending = step.id > currentStep;

            // Show only first 5 steps on mobile
            if (step.id > 5) {
              return (
                <div key={step.id} className="hidden lg:flex flex-col items-center">
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      isPending 
                        ? "bg-gray-200 text-gray-500"
                        : isCompleted 
                        ? "bg-gray-600 text-white"
                        : isCurrent
                        ? "bg-gray-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    )}
                    data-testid={`step-${step.id}`}
                  >
                    {isCompleted ? <FaCheckCircle className="h-4 w-4" /> : step.id}
                  </div>
                  <span className={cn(
                    "text-xs mt-2 text-center",
                    isCurrent ? "text-gray-900 font-medium" : "text-gray-400"
                  )}>
                    {step.name}
                  </span>
                </div>
              );
            }

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    isPending 
                      ? "bg-gray-200 text-gray-500"
                      : isCompleted 
                      ? "bg-gray-600 text-white"
                      : isCurrent
                      ? "bg-gray-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  )}
                  data-testid={`step-${step.id}`}
                >
                  {isCompleted ? <FaCheckCircle className="h-4 w-4" /> : step.id}
                </div>
                <span className={cn(
                  "text-xs mt-2 text-center",
                  isCurrent ? "text-gray-900 font-medium" : "text-gray-400"
                )}>
                  {step.name}
                </span>
              </div>
            );
          })}
          
          {/* Show final step on mobile */}
          <div className="flex lg:hidden flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">
              10
            </div>
            <span className="text-xs text-gray-400 mt-2 text-center">Invoice</span>
          </div>
        </div>
      </div>
      
      {/* Current Step Details */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 flex items-center gap-2" data-testid="text-current-step">
                <FaFlag className="h-4 w-4 text-gray-600" />
                Current Step: {currentStepName}
              </h4>
              <p className="text-sm text-gray-600 flex items-center gap-2" data-testid="text-step-description">
                <FaFileInvoice className="h-4 w-4 text-gray-500" />
                {description}
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                className="border border-green-500 text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1 rounded text-sm transition-colors flex items-center gap-2"
                data-testid="button-mark-complete"
                onClick={handleMarkComplete}
              >
                <FaCheck className="h-3 w-3" />
                Mark Complete
              </button>
              <button 
                className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                data-testid="button-view-details"
                onClick={handleViewDetails}
              >
                <FaEye className="h-3 w-3" />
                View Details
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}
