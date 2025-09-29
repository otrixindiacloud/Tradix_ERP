import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe, 
  FaWalking, 
  FaCalendarAlt, 
  FaStickyNote, 
  FaSave, 
  FaTimes, 
  FaSpinner,
  FaQuestionCircle,
  FaFileAlt,
  FaPlus,
  FaEdit
} from "react-icons/fa";

const ENQUIRY_SOURCES = ["Email", "Phone", "Web Form", "Walk-in"];

const enquiryFormSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  source: z.enum(["Email", "Phone", "Web Form", "Walk-in"]),
  targetDeliveryDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate.getFullYear() > 1900 && parsedDate.getFullYear() < 2100;
  }, "Please enter a valid date"),
  notes: z.string().optional(),
});

type EnquiryFormData = z.infer<typeof enquiryFormSchema>;

interface EnquiryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void; // Called when user presses Cancel
  initialData?: Partial<EnquiryFormData>;
  enquiryId?: string; // For editing existing enquiries
}

export default function EnquiryForm({ onSuccess, onCancel, initialData, enquiryId }: EnquiryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EnquiryFormData>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      source: "Web Form",
      ...initialData,
    },
  });

  const { data: customersData = { customers: [] } } = useQuery({
    queryKey: ["/api/customers"],
  }) as { data: { customers: any[] } };
  
  const customers = customersData.customers || [];

  const createEnquiry = useMutation({
    mutationFn: async (data: EnquiryFormData) => {
      const payload = {
        ...data,
        targetDeliveryDate: data.targetDeliveryDate ? new Date(data.targetDeliveryDate).toISOString() : undefined,
        // createdBy will be handled by the server with a default value
      };
      
      if (enquiryId) {
        // Update existing enquiry
        return await apiRequest("PUT", `/api/enquiries/${enquiryId}`, payload);
      } else {
        // Create new enquiry
        return await apiRequest("POST", "/api/enquiries", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enquiries"] });
      if (enquiryId) {
        queryClient.invalidateQueries({ queryKey: ["/api/enquiries", enquiryId] });
      }
      toast({
        title: "Success",
        description: enquiryId ? "Enquiry updated successfully" : "Enquiry created successfully",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Enquiry creation error:", error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          (enquiryId ? "Failed to update enquiry" : "Failed to create enquiry");
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EnquiryFormData) => {
    createEnquiry.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {enquiryId ? <FaEdit className="h-5 w-5 text-blue-600" /> : <FaPlus className="h-5 w-5 text-green-600" />}
          {enquiryId ? "Edit Enquiry" : "Create New Enquiry"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => {
                  const [search, setSearch] = React.useState("");
                  const filteredCustomers = Array.isArray(customers)
                    ? customers.filter((customer: any) =>
                        customer.name.toLowerCase().includes(search.toLowerCase()) ||
                        customer.customerType.toLowerCase().includes(search.toLowerCase())
                      )
                    : [];
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FaUser className="h-4 w-4 text-gray-600" />
                        Customer
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-customer" className="w-full">
                            <SelectValue placeholder="Search or select a customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-auto">
                          <div className="px-2 py-2">
                            <input
                              type="text"
                              className="border rounded px-2 py-1 w-full mb-2"
                              placeholder="Search customer..."
                              value={search}
                              onChange={e => setSearch(e.target.value)}
                              autoFocus
                            />
                          </div>
                          {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer: any) => (
                              <SelectItem key={customer.id} value={customer.id} className="px-2 py-1 cursor-pointer hover:bg-gray-100">
                                {customer.name} ({customer.customerType})
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-500 text-sm">
                              {customers === undefined
                                ? "Loading customers..."
                                : "No customers found. Please add a customer first."}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FaQuestionCircle className="h-4 w-4 text-gray-600" />
                      Enquiry Source
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-source">
                          <SelectValue placeholder="Select enquiry source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ENQUIRY_SOURCES.map((source) => (
                          <SelectItem key={source} value={source}>
                            <div className="flex items-center gap-2">
                              {source === "Email" && <FaEnvelope className="h-4 w-4 text-blue-600" />}
                              {source === "Phone" && <FaPhone className="h-4 w-4 text-green-600" />}
                              {source === "Web Form" && <FaGlobe className="h-4 w-4 text-purple-600" />}
                              {source === "Walk-in" && <FaWalking className="h-4 w-4 text-orange-600" />}
                              {source}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="targetDeliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FaCalendarAlt className="h-4 w-4 text-gray-600" />
                    Target Delivery Date
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      data-testid="input-delivery-date"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FaStickyNote className="h-4 w-4 text-gray-600" />
                    Notes
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes..."
                      className="min-h-[100px]"
                      {...field}
                      data-testid="textarea-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  onCancel?.();
                }}
                data-testid="button-cancel"
                className="flex items-center gap-2"
              >
                <FaTimes className="h-4 w-4" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createEnquiry.isPending}
                data-testid="button-create-enquiry"
                className="flex items-center gap-2"
              >
                {createEnquiry.isPending ? (
                  <>
                    <FaSpinner className="h-4 w-4 animate-spin" />
                    {enquiryId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <FaSave className="h-4 w-4" />
                    {enquiryId ? "Update Enquiry" : "Create Enquiry"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
