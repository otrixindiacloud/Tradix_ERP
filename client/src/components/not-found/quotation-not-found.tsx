import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageNotFound from "@/components/ui/page-not-found";
import { useLocation } from "wouter";

interface QuotationNotFoundProps {
  quotationId?: string;
  className?: string;
}

export default function QuotationNotFound({ 
  quotationId, 
  className 
}: QuotationNotFoundProps) {
  const [, setLocation] = useLocation();

  const handleCreateQuotation = () => {
    setLocation("/quotations/new");
  };

  const handleBrowseQuotations = () => {
    setLocation("/quotations");
  };

  return (
    <PageNotFound
      icon={<FileText className="h-16 w-16 text-purple-500" />}
      title="Quotation Not Found"
      description={
        quotationId 
          ? `The quotation "${quotationId}" you're looking for doesn't exist or has been removed.`
          : "The quotation you're looking for doesn't exist."
      }
      backUrl="/quotations"
      backText="Back to Quotations"
      showDefaultActions={false}
      className={className}
      actions={
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleBrowseQuotations}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Browse All Quotations
          </Button>
          
          <Button 
            onClick={handleCreateQuotation}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Quotation
          </Button>
        </div>
      }
    />
  );
}