import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageNotFound from "@/components/ui/page-not-found";
import { useLocation } from "wouter";

interface SupplierQuoteNotFoundProps {
  quoteId?: string;
  className?: string;
}

export default function SupplierQuoteNotFound({ 
  quoteId, 
  className 
}: SupplierQuoteNotFoundProps) {
  const [, setLocation] = useLocation();

  const handleCreateQuote = () => {
    setLocation("/supplier-quotes/new");
  };

  const handleBrowseQuotes = () => {
    setLocation("/supplier-quotes");
  };

  return (
    <PageNotFound
      icon={<FileText className="h-16 w-16 text-blue-500" />}
      title="Supplier Quote Not Found"
      description={
        quoteId 
          ? `The supplier quote "${quoteId}" you're looking for doesn't exist or has been removed.`
          : "The supplier quote you're looking for doesn't exist."
      }
      backUrl="/supplier-quotes"
      backText="Back to Supplier Quotes"
      showDefaultActions={false}
      className={className}
      actions={
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleBrowseQuotes}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Browse All Quotes
          </Button>
          
          <Button 
            onClick={handleCreateQuote}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Create New Quote
          </Button>
        </div>
      }
    />
  );
}