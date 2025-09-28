import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  customerType: "Retail" | "Wholesale";
  classification: "Internal" | "Corporate" | "Individual" | "Family" | "Ministry";
  taxId: string | null;
  creditLimit: number | null;
  paymentTerms: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CustomerFormDialogProps {
  customer?: Customer;
  onCustomerSaved: (customer: Customer) => void;
  trigger: React.ReactNode;
}

const CUSTOMER_TYPES = [
  { value: "Retail", label: "Retail" },
  { value: "Wholesale", label: "Wholesale" }
];

const CUSTOMER_CLASSIFICATIONS = [
  { value: "Internal", label: "Internal" },
  { value: "Corporate", label: "Corporate" },
  { value: "Individual", label: "Individual" },
  { value: "Family", label: "Family" },
  { value: "Ministry", label: "Ministry" }
];

const PAYMENT_TERMS = [
  { value: "Net 15", label: "Net 15" },
  { value: "Net 30", label: "Net 30" },
  { value: "Net 45", label: "Net 45" },
  { value: "Net 60", label: "Net 60" },
  { value: "COD", label: "Cash on Delivery" },
  { value: "Prepaid", label: "Prepaid" }
];

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  customerType: z.enum(["Retail", "Wholesale"]),
  classification: z.enum(["Internal", "Corporate", "Individual", "Family", "Ministry"]),
  taxId: z.string().optional(),
  creditLimit: z.string().optional(),
  paymentTerms: z.string().optional(),
  isActive: z.boolean()
});

export function CustomerFormDialog({ customer, onCustomerSaved, trigger }: CustomerFormDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
    customerType: customer?.customerType || "Retail",
    classification: customer?.classification || "Individual",
    taxId: customer?.taxId || "",
    creditLimit: customer?.creditLimit?.toString() || "",
    paymentTerms: customer?.paymentTerms || "Net 30",
    isActive: customer?.isActive ?? true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const checkForDuplicates = async () => {
    const duplicateErrors: Record<string, string> = {};
    
    try {
      // Check for duplicate name
      if (formData.name) {
        const response = await fetch(`/api/customers?name=${encodeURIComponent(formData.name)}`);
        if (response.ok) {
          const data = await response.json();
          const existingCustomer = data.customers?.find((c: any) => 
            c.name.toLowerCase() === formData.name.toLowerCase() && 
            (!customer || c.id !== customer.id)
          );
          if (existingCustomer) {
            duplicateErrors.name = "A customer with this name already exists";
          }
        }
      }

      // Check for duplicate email
      if (formData.email) {
        const response = await fetch(`/api/customers?email=${encodeURIComponent(formData.email)}`);
        if (response.ok) {
          const data = await response.json();
          const existingCustomer = data.customers?.find((c: any) => 
            c.email?.toLowerCase() === formData.email.toLowerCase() && 
            (!customer || c.id !== customer.id)
          );
          if (existingCustomer) {
            duplicateErrors.email = "A customer with this email already exists";
          }
        }
      }
    } catch (error) {
      console.error("Error checking for duplicates:", error);
    }
    
    return duplicateErrors;
  };

  const validateForm = async () => {
    try {
      customerSchema.parse(formData);
      
      // Check for duplicates
      const duplicateErrors = await checkForDuplicates();
      if (Object.keys(duplicateErrors).length > 0) {
        setErrors(duplicateErrors);
        return false;
      }
      
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(formErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!(await validateForm())) {
      return;
    }

    setLoading(true);
    try {
      // Build payload and omit empty optional fields. Keep creditLimit as string per backend schema.
      const submitData: any = {
        name: formData.name,
        customerType: formData.customerType,
        classification: formData.classification,
        isActive: formData.isActive,
      };

      if (formData.email && formData.email.trim() !== "") submitData.email = formData.email.trim();
      if (formData.phone && formData.phone.trim() !== "") submitData.phone = formData.phone.trim();
      if (formData.address && formData.address.trim() !== "") submitData.address = formData.address.trim();
      if (formData.taxId && formData.taxId.trim() !== "") submitData.taxId = formData.taxId.trim();
      if (formData.creditLimit && formData.creditLimit.trim() !== "") submitData.creditLimit = formData.creditLimit.trim();
      if (formData.paymentTerms && formData.paymentTerms.trim() !== "") submitData.paymentTerms = formData.paymentTerms.trim();

      const url = customer ? `/api/customers/${customer.id}` : "/api/customers";
      const method = customer ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save customer");
      }

      const savedCustomer = await response.json();
      onCustomerSaved(savedCustomer);
      setOpen(false);
      
      toast({
        title: "Success",
        description: customer ? "Customer updated successfully" : "Customer created successfully",
      });
      
      // Reset form if creating new customer
      if (!customer) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          customerType: "Retail",
          classification: "Individual",
          taxId: "",
          creditLimit: "",
          paymentTerms: "Net 30",
          isActive: true
        });
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save customer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {customer ? "Edit Customer" : "Add New Customer"}
          </DialogTitle>
          <DialogDescription>
            {customer 
              ? "Update customer information and settings" 
              : "Create a new customer record with all necessary details"
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Customer name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="customer@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+971 50 123 4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) => handleInputChange("taxId", e.target.value)}
                placeholder="Tax registration number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerType">Customer Type *</Label>
              <Select 
                value={formData.customerType} 
                onValueChange={(value) => handleInputChange("customerType", value)}
              >
                <SelectTrigger className={errors.customerType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOMER_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerType && <p className="text-sm text-red-500">{errors.customerType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="classification">Classification *</Label>
              <Select 
                value={formData.classification} 
                onValueChange={(value) => handleInputChange("classification", value)}
              >
                <SelectTrigger className={errors.classification ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select classification" />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOMER_CLASSIFICATIONS.map(classification => (
                    <SelectItem key={classification.value} value={classification.value}>
                      {classification.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.classification && <p className="text-sm text-red-500">{errors.classification}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditLimit">Credit Limit (AED)</Label>
              <Input
                id="creditLimit"
                type="number"
                value={formData.creditLimit}
                onChange={(e) => handleInputChange("creditLimit", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select 
                value={formData.paymentTerms} 
                onValueChange={(value) => handleInputChange("paymentTerms", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TERMS.map(term => (
                    <SelectItem key={term.value} value={term.value}>
                      {term.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Full customer address"
              rows={3}
            />
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            />
            <Label htmlFor="isActive">Active Customer</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : customer ? "Update Customer" : "Create Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}