import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageNotFound from "@/components/ui/page-not-found";
import { useLocation } from "wouter";

interface SalesOrderNotFoundProps {
  orderId?: string;
  className?: string;
}

export default function SalesOrderNotFound({ 
  orderId, 
  className 
}: SalesOrderNotFoundProps) {
  const [, setLocation] = useLocation();

  const handleCreateOrder = () => {
    setLocation("/sales-orders/new");
  };

  const handleBrowseOrders = () => {
    setLocation("/sales-orders");
  };

  return (
    <PageNotFound
      icon={<ShoppingCart className="h-16 w-16 text-emerald-500" />}
      title="Sales Order Not Found"
      description={
        orderId 
          ? `The sales order "${orderId}" you're looking for doesn't exist or has been removed.`
          : "The sales order you're looking for doesn't exist."
      }
      backUrl="/sales-orders"
      backText="Back to Sales Orders"
      showDefaultActions={false}
      className={className}
      actions={
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleBrowseOrders}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Browse All Orders
          </Button>
          
          <Button 
            onClick={handleCreateOrder}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Order
          </Button>
        </div>
      }
    />
  );
}