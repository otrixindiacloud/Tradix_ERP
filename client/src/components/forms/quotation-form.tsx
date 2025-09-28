import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SYSTEM_USER_ID } from "@shared/utils/uuid";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Plus, Calculator, DollarSign, ArrowLeft } from "lucide-react";
import { 
  FaUser, 
  FaCalendarAlt, 
  FaPercentage, 
  FaFileContract, 
  FaStickyNote, 
  FaSave, 
  FaTimes, 
  FaSpinner,
  FaCalculator,
  FaDollarSign,
  FaFileInvoice,
  FaPlus,
  FaEdit,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const quotationSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  validUntil: z.string().min(1, "Valid until date is required"),
  terms: z.string().optional(),
  notes: z.string().optional(),
  discountPercentage: z.string().optional(),
});

type QuotationFormData = z.infer<typeof quotationSchema>;

interface Customer {
  id: string;
  name: string;
  customerType: "Retail" | "Wholesale";
  email: string;
}

interface QuotationFormProps {
  enquiryId?: string;
  onSuccess?: (quotation: any) => void;
  onCancel?: () => void;
}

export default function QuotationForm({ enquiryId: propEnquiryId, onSuccess, onCancel }: QuotationFormProps) {
  // Check URL parameters for enquiry ID
  const urlParams = new URLSearchParams(window.location.search);
  const enquiryId = propEnquiryId || urlParams.get('enquiry');
  const [date, setDate] = useState<Date>();
  const [customerType, setCustomerType] = useState<"Retail" | "Wholesale">();
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      customerId: "",
      validUntil: "",
      terms: "Payment due within 30 days of invoice date. Prices valid for 30 days.",
      notes: "",
      discountPercentage: "0",
    },
  });

  // Fetch customers for dropdown
  const { data: customersData = { customers: [] }, isLoading: customersLoading, error: customersError } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");
      if (!response.ok) throw new Error("Failed to fetch customers");
      return response.json();
    },
  });

  const customers = customersData.customers || [];

  // Fetch enquiry details if enquiryId is provided
  const { data: enquiry } = useQuery({
    queryKey: ["/api/enquiries", enquiryId],
    queryFn: async () => {
      if (!enquiryId) return null;
      const response = await fetch(`/api/enquiries/${enquiryId}`);
      if (!response.ok) throw new Error("Failed to fetch enquiry");
      return response.json();
    },
    enabled: !!enquiryId,
  });

  // Pre-fill form when enquiry is loaded
  useEffect(() => {
    if (enquiry) {
      form.setValue("customerId", enquiry.customerId);
      form.setValue("notes", enquiry.notes || "");
      
      // Set default valid until date (30 days from now)
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);
      setDate(validUntil);
      form.setValue("validUntil", validUntil.toISOString().split('T')[0]);
    }
  }, [enquiry, form]);

  // Update customer type when customer is selected
  useEffect(() => {
    const customerId = form.watch("customerId");
    if (customerId && customers) {
      const selectedCustomer = customers.find((c: Customer) => c.id === customerId);
      if (selectedCustomer) {
        setCustomerType(selectedCustomer.customerType);
      }
    }
  }, [form.watch("customerId"), customers]);

  // Calculate totals
  useEffect(() => {
    const discountPercentage = parseFloat(form.watch("discountPercentage") || "0");
    const discountAmount = subtotal * (discountPercentage / 100);
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * 0.05; // 5% tax
    const totalAmount = taxableAmount + taxAmount;

    setDiscount(discountAmount);
    setTax(taxAmount);
    setTotal(totalAmount);
  }, [subtotal, form.watch("discountPercentage")]);

  const createQuotationMutation = useMutation({
    mutationFn: async (data: QuotationFormData) => {
      const payload = {
        ...data,
        customerType,
        subtotal: subtotal.toString(),
        discountAmount: discount.toString(),
        taxAmount: tax.toString(),
        totalAmount: total.toString(),
        validUntil: data.validUntil ? new Date(data.validUntil).toISOString() : undefined,
        createdBy: SYSTEM_USER_ID, // System user ID
      };

      if (enquiryId) {
        // Generate from enquiry
        const response = await fetch(`/api/quotations/generate/${enquiryId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, userId: SYSTEM_USER_ID }),
        });
        if (!response.ok) throw new Error("Failed to generate quotation");
        return response.json();
      } else {
        // Create new quotation
        const response = await fetch("/api/quotations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to create quotation");
        return response.json();
      }
    },
    onSuccess: (quotation) => {
      toast({
        title: "Success",
        description: "Quotation created successfully",
      });
      // Invalidate all quotation queries to ensure the list updates
      queryClient.invalidateQueries({ queryKey: ["/api/quotations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      // Also invalidate any specific quotation queries with filters
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "/api/quotations";
        }
      });
      onSuccess?.(quotation);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create quotation",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: QuotationFormData) => {
    createQuotationMutation.mutate(data);
  };

  const getMarkupPercentage = () => {
    return customerType === "Retail" ? 70 : 40;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          {/* <h2 className="text-2xl font-bold flex items-center gap-2">
            {enquiryId ? <FaFileInvoice className="h-6 w-6 text-blue-600" /> : <FaPlus className="h-6 w-6 text-green-600" />}
            {enquiryId ? "Generate Quotation from Enquiry" : "Create New Quotation"}
          </h2> */}
          {/* <p className="text-gray-600">
            Create a quotation with automated pricing based on customer type
          </p> */}
        </div>
        {customerType && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Customer Type: {customerType}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Markup: {getMarkupPercentage()}%
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaFileContract className="h-5 w-5 text-blue-600" />
                Quotation Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FaUser className="h-4 w-4 text-gray-600" />
                          Customer *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-customer">
                              <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customersLoading ? (
                              <div className="px-4 py-2 text-blue-500 text-sm">
                                Loading customers...
                              </div>
                            ) : customersError ? (
                              <div className="px-4 py-2 text-red-500 text-sm">
                                Error loading customers
                              </div>
                            ) : Array.isArray(customers) && customers.length > 0 ? (
                              customers.map((customer: Customer) => (
                                <SelectItem key={customer.id} value={customer.id}>
                                  <div className="flex items-center justify-between w-full">
                                    <span>{customer.name}</span>
                                    <Badge variant="outline" className="ml-2">
                                      {customer.customerType}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-gray-500 text-sm">
                                No customers available. Please add a customer first.
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="validUntil"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center gap-2">
                          <FaCalendarAlt className="h-4 w-4 text-gray-600" />
                          Valid Until *
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="pl-3 text-left font-normal"
                                data-testid="button-date-picker"
                              >
                                {date ? (
                                  format(date, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(selectedDate) => {
                                setDate(selectedDate);
                                if (selectedDate) {
                                  field.onChange(selectedDate.toISOString().split('T')[0]);
                                }
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FaPercentage className="h-4 w-4 text-gray-600" />
                          Discount Percentage
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              placeholder="0.00"
                              {...field}
                              data-testid="input-discount"
                            />
                            <span className="absolute right-3 top-3 text-gray-500">%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FaFileContract className="h-4 w-4 text-gray-600" />
                          Terms & Conditions
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter terms and conditions..."
                            rows={3}
                            {...field}
                            data-testid="textarea-terms"
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
                            placeholder="Additional notes..."
                            rows={3}
                            {...field}
                            data-testid="textarea-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-4">
                    {onCancel && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        data-testid="button-back"
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={createQuotationMutation.isPending}
                      data-testid="button-submit"
                      className="flex items-center gap-2"
                    >
                      {createQuotationMutation.isPending ? (
                        <>
                          <FaSpinner className="h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <FaSave className="h-4 w-4" />
                          Create Quotation
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCalculator className="h-5 w-5 text-green-600" />
                Pricing Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FaDollarSign className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <div className="text-sm text-gray-600 mb-1">
                  {customerType} Customer Pricing
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {getMarkupPercentage()}% Markup Applied
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount ({form.watch("discountPercentage") || "0"}%):</span>
                  <span className="text-green-600">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (5%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {enquiryId && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-800 flex items-start gap-2">
                    <FaCheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Auto-generation enabled:</strong>
                      <br />
                      Items from the enquiry will be automatically added with appropriate pricing.
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}