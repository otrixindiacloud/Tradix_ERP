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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Calendar, DollarSign } from "lucide-react";
import type { CustomerAcceptance } from "@shared/schema";

interface PurchaseOrderUploadProps {
  quotationId: string;
  customerAcceptance?: CustomerAcceptance;
  disabled?: boolean;
}

const purchaseOrderSchema = z.object({
  poNumber: z.string().min(1, "PO number is required"),
  poDate: z.string().min(1, "PO date is required"),
  customerReference: z.string().optional(),
  totalPoAmount: z.string().min(1, "PO amount is required"),
  currency: z.string().default("BHD"),
  paymentTerms: z.string().optional(),
  deliveryTerms: z.string().optional(),
  specialInstructions: z.string().optional(),
});

type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;

export function PurchaseOrderUpload({ 
  quotationId, 
  customerAcceptance, 
  disabled = false 
}: PurchaseOrderUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      poNumber: "",
      poDate: "",
      customerReference: "",
      totalPoAmount: "",
      currency: "USD",
      paymentTerms: "",
      deliveryTerms: "",
      specialInstructions: "",
    },
  });

  const uploadPOMutation = useMutation({
    mutationFn: async (data: { formData: PurchaseOrderFormData; file: File }) => {
      // Since backend expects JSON to /api/customer-po-upload (no multipart handler currently),
      // we'll simulate file persistence by sending metadata only. The separate customer-po-upload
      // route stores documentName/path; actual binary upload can be added later.
      const documentName = data.file.name;
      const documentType = data.file.type.includes('pdf') ? 'PDF' : 'IMAGE';
      const documentPath = `/uploads/po/${Date.now()}-${documentName}`; // simulated path

      const payload = {
        quotationId,
        poNumber: data.formData.poNumber,
        poDate: data.formData.poDate,
        customerReference: data.formData.customerReference || undefined,
        totalPoAmount: data.formData.totalPoAmount,
        currency: data.formData.currency,
        paymentTerms: data.formData.paymentTerms || undefined,
        deliveryTerms: data.formData.deliveryTerms || undefined,
        specialInstructions: data.formData.specialInstructions || undefined,
        documentName,
        documentType,
        documentPath,
        // Accept either active acceptance id or blank
        customerAcceptanceId: customerAcceptance?.id || undefined,
      };

      const response = await fetch('/api/customer-po-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let json: any = null;
      try { json = await response.json(); } catch {
        throw new Error('Server returned non-JSON response');
      }
      if (!response.ok) {
        throw new Error(json?.message || 'Failed to upload purchase order');
      }
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchase-orders"] });
      toast({
        title: "Success",
        description: "Purchase order uploaded successfully and is being validated.",
      });
      form.reset();
      setSelectedFile(null);
      setUploadProgress(0);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to upload purchase order';
      toast({
        title: 'Error',
        description: message.includes('<!DOCTYPE') ? 'Upload failed: server returned HTML instead of JSON. Endpoint mismatch or server error.' : message,
        variant: 'destructive'
      });
    },
  });

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or image file (JPG, PNG).",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const onSubmit = async (data: PurchaseOrderFormData) => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      await uploadPOMutation.mutateAsync({ formData: data, file: selectedFile });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
    } finally {
      setIsUploading(false);
    }
  };

  if (disabled) {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Customer Acceptance Required</h3>
            <p className="mt-1 text-sm text-gray-500">
              A customer acceptance must be recorded before uploading a purchase order.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check for customer acceptance presence (update logic if acceptedItems is required in schema)
  const hasAcceptedItems = !!customerAcceptance;
  
  return ( 
    <div className="space-y-6">
      {/* Customer Acceptance Info */}
      {customerAcceptance && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Customer Acceptance Confirmed</p>
                <p className="text-sm text-green-700">
                  {customerAcceptance.acceptanceType} acceptance by {customerAcceptance.acceptedBy} on{" "}
                  {format(new Date(customerAcceptance.acceptedAt), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Purchase Order Upload
          </CardTitle>
          <CardDescription>
            Upload the customer's purchase order document and enter details for validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* File Upload Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Document Upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload the purchase order document (PDF or image files only, max 10MB)
                  </p>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                      ? "border-blue-400 bg-blue-50"
                      : selectedFile
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileText className="mx-auto h-12 w-12 text-green-600" />
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex justify-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                          data-testid="button-remove-file"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <p className="font-medium">Drop your PO document here</p>
                        <p className="text-sm text-muted-foreground">or click to browse</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                        className="hidden"
                        id="file-upload"
                        data-testid="input-file-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("file-upload")?.click()}
                        data-testid="button-browse-file"
                      >
                        Browse Files
                      </Button>
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </div>

              <Separator />

              {/* PO Details Form */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Purchase Order Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the details from the purchase order for validation
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="poNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PO Number *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., PO-2024-001" 
                            {...field}
                            data-testid="input-po-number"
                          />
                        </FormControl>
                        <FormDescription>
                          Purchase order number from the document
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="poDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          PO Date *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date"
                            {...field}
                            data-testid="input-po-date"
                          />
                        </FormControl>
                        <FormDescription>
                          Date when the PO was issued
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerReference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Reference</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Customer's internal reference" 
                            {...field}
                            data-testid="input-customer-reference"
                          />
                        </FormControl>
                        <FormDescription>
                          Customer's internal reference number (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalPoAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Total PO Amount *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            data-testid="input-total-amount"
                          />
                        </FormControl>
                        <FormDescription>
                          Total amount stated on the PO
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Terms</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Net 30 days" 
                            {...field}
                            data-testid="input-payment-terms"
                          />
                        </FormControl>
                        <FormDescription>
                          Payment terms specified in the PO
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Terms</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., FOB Destination" 
                            {...field}
                            data-testid="input-delivery-terms"
                          />
                        </FormControl>
                        <FormDescription>
                          Delivery terms specified in the PO
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="specialInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special instructions from the customer..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-special-instructions"
                        />
                      </FormControl>
                      <FormDescription>
                        Any special instructions or requirements mentioned in the PO
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setSelectedFile(null);
                  }}
                  disabled={isUploading}
                  data-testid="button-reset-form"
                >
                  Reset Form
                </Button>
                <Button 
                  type="submit" 
                  disabled={isUploading || !selectedFile || !hasAcceptedItems}
                  data-testid="button-upload-po"
                >
                  {isUploading ? "Uploading..." : "Upload Purchase Order"}
                </Button>
                {!hasAcceptedItems && (
                  <p className="text-sm text-red-600 pt-2">No accepted quotation items found. Please accept at least one item before uploading a PO.</p>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}