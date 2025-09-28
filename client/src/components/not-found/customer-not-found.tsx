import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageNotFound from "@/components/ui/page-not-found";
import { useLocation } from "wouter";

interface CustomerNotFoundProps {
  customerId?: string;
  className?: string;
}

export default function CustomerNotFound({ 
  customerId, 
  className 
}: CustomerNotFoundProps) {
  const [, setLocation] = useLocation();

  const handleCreateCustomer = () => {
    setLocation("/customers/new");
  };

  const handleBrowseCustomers = () => {
    setLocation("/customers");
  };

  return (
    <PageNotFound
      icon={<Users className="h-16 w-16 text-green-500" />}
      title="Customer Not Found"
      description={
        customerId 
          ? `The customer "${customerId}" you're looking for doesn't exist or has been removed.`
          : "The customer you're looking for doesn't exist."
      }
      backUrl="/customers"
      backText="Back to Customers"
      showDefaultActions={false}
      className={className}
      actions={
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleBrowseCustomers}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Browse All Customers
          </Button>
          
          <Button 
            onClick={handleCreateCustomer}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add New Customer
          </Button>
        </div>
      }
    />
  );
}