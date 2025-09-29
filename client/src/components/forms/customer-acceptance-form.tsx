import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { ItemAcceptanceList } from "@/components/acceptance/item-acceptance-list";
import { CheckCircle, XCircle, AlertTriangle, Users, Mail, Phone } from "lucide-react";
import type { Quotation, QuotationItem, CustomerAcceptance } from "@shared/schema";

interface QuotationWithItems extends Quotation {
  items?: QuotationItem[];
}

interface CustomerAcceptanceFormProps {
  quotationId: string;
  quotation: QuotationWithItems;
  existingAcceptances: CustomerAcceptance[];
}

const customerAcceptanceSchema = z.object({
  acceptanceType: z.enum(["Full", "Partial"]),
  acceptedBy: z.string().min(2, "Contact name is required"),
  customerEmail: z.string().email("Valid email is required").optional().or(z.literal("")),
  customerNotes: z.string().optional(),
  internalNotes: z.string().optional(),
});

type CustomerAcceptanceFormData = z.infer<typeof customerAcceptanceSchema>;

export function CustomerAcceptanceForm({ 
  quotationId, 
  quotation, 
  existingAcceptances 
}: CustomerAcceptanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, { accepted: boolean; quantity: number; notes?: string }>>({});
  
  const queryClient = useQueryClient();

  const form = useForm<CustomerAcceptanceFormData>({
    resolver: zodResolver(customerAcceptanceSchema),
    defaultValues: {
      acceptanceType: "Full",
      acceptedBy: "",
      customerEmail: "",
      customerNotes: "",
      internalNotes: "",
    },
  });

  const acceptanceType = form.watch("acceptanceType");

  const createAcceptanceMutation = useMutation({
    mutationFn: async (data: CustomerAcceptanceFormData & { itemAcceptances?: any[] }) => {
      const response = await fetch("/api/customer-acceptances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotationId,
          ...data,
        }),
      });
      if (!response.ok) throw new Error("Failed to create acceptance");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer-acceptances"] });
      toast({
        title: "Success",
        description: "Customer acceptance has been recorded successfully.",
      });
      form.reset();
      setSelectedItems({});
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create acceptance",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CustomerAcceptanceFormData) => {
    setIsSubmitting(true);
    
    try {
      // Supersede any existing active acceptances
      if (existingAcceptances.some(acc => acc.status === "Active")) {
        await fetch("/api/customer-acceptances/supersede", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quotationId }),
        });
      }

      // Prepare item acceptances for partial acceptance
      let itemAcceptances: any[] = [];
      if (acceptanceType === "Partial") {
        itemAcceptances = Object.entries(selectedItems)
          .filter(([_, item]) => item.accepted)
          .map(([itemId, item]) => ({
            quotationItemId: itemId,
            isAccepted: true,
            acceptedQuantity: item.quantity,
            customerNotes: item.notes,
          }));

        if (itemAcceptances.length === 0) {
          toast({
            title: "Error",
            description: "Please select at least one item for partial acceptance.",
            variant: "destructive",
          });
          return;
        }
      }

      await createAcceptanceMutation.mutateAsync({
        ...data,
        itemAcceptances,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasActiveAcceptance = existingAcceptances.some(acc => acc.status === "Active");

  return (
    <div className="space-y-6">
      {hasActiveAcceptance && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Active Acceptance Exists</p>
                <p className="text-sm text-yellow-700">
                  Creating a new acceptance will supersede the current active acceptance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Customer Acceptance Details
          </CardTitle>
          <CardDescription>
            Record customer acceptance for quotation {quotation.quoteNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Acceptance Type */}
              <FormField
                control={form.control}
                name="acceptanceType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-medium">Acceptance Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Full" id="full" />
                          <Label htmlFor="full" className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Full Acceptance
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Partial" id="partial" />
                          <Label htmlFor="partial" className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-orange-600" />
                            Partial Acceptance
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      {acceptanceType === "Full" 
                        ? "Customer accepts all items in the quotation"
                        : "Customer accepts only selected items with specified quantities"
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Customer Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="acceptedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Contact Person *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., John Smith" 
                          {...field}
                          data-testid="input-accepted-by"
                        />
                      </FormControl>
                      <FormDescription>
                        Name of the person accepting the quotation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="john.smith@company.com" 
                          {...field}
                          data-testid="input-customer-email"
                        />
                      </FormControl>
                      <FormDescription>
                        Customer's email address (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notes Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customerNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any customer comments or requirements..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-customer-notes"
                        />
                      </FormControl>
                      <FormDescription>
                        Notes or comments from the customer
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="internalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Internal notes for staff reference..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-internal-notes"
                        />
                      </FormControl>
                      <FormDescription>
                        Internal notes (not visible to customer)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Item Selection for Partial Acceptance */}
              {acceptanceType === "Partial" && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Item Selection</h3>
                      <p className="text-sm text-muted-foreground">
                        Select the items and quantities the customer has accepted
                      </p>
                    </div>
                    <ItemAcceptanceList
                      quotationItems={quotation.items || []}
                      selectedItems={selectedItems}
                      onItemChange={setSelectedItems}
                    />
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isSubmitting}
                  data-testid="button-reset"
                >
                  Reset Form
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  data-testid="button-submit-acceptance"
                >
                  {isSubmitting ? "Recording..." : "Record Acceptance"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}