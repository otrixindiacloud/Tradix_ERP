import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageNotFound from "@/components/ui/page-not-found";
import { useLocation } from "wouter";

interface InventoryNotFoundProps {
  itemId?: string;
  className?: string;
}

export default function InventoryNotFound({ 
  itemId, 
  className 
}: InventoryNotFoundProps) {
  const [, setLocation] = useLocation();

  const handleAddItem = () => {
    setLocation("/inventory/new");
  };

  const handleBrowseInventory = () => {
    setLocation("/inventory");
  };

  return (
    <PageNotFound
      icon={<Package className="h-16 w-16 text-amber-500" />}
      title="Inventory Item Not Found"
      description={
        itemId 
          ? `The inventory item "${itemId}" you're looking for doesn't exist or has been removed.`
          : "The inventory item you're looking for doesn't exist."
      }
      backUrl="/inventory"
      backText="Back to Inventory"
      showDefaultActions={false}
      className={className}
      actions={
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleBrowseInventory}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            Browse All Items
          </Button>
          
          <Button 
            onClick={handleAddItem}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Item
          </Button>
        </div>
      }
    />
  );
}