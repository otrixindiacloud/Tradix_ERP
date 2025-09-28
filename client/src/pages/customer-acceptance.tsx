import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { CustomerAcceptanceForm } from "@/components/forms/customer-acceptance-form";
import { PurchaseOrderUpload } from "@/components/forms/purchase-order-upload";
import { ItemAcceptanceList } from "@/components/acceptance/item-acceptance-list";
import { AcceptanceHistory } from "@/components/acceptance/acceptance-history";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, Upload, AlertTriangle } from "lucide-react";
import type { Quotation, CustomerAcceptance, PurchaseOrder } from "@shared/schema";

export default function CustomerAcceptancePage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const quotationId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");

  const queryClient = useQueryClient();

  // Fetch quotation details
  const { data: quotation, isLoading: isLoadingQuotation } = useQuery<Quotation>({
    queryKey: ["/api/quotations", quotationId],
    queryFn: async () => {
      const response = await fetch(`/api/quotations/${quotationId}`);
      if (!response.ok) throw new Error("Failed to fetch quotation");
      return response.json();
    },
    enabled: !!quotationId,
  });

  // Fetch customer acceptances for this quotation
  const { data: acceptances = [], isLoading: isLoadingAcceptances } = useQuery({
    queryKey: ["/api/customer-acceptances", { quotationId }],
    queryFn: async () => {
      const response = await fetch(`/api/customer-acceptances?quotationId=${quotationId}`);
      if (!response.ok) throw new Error("Failed to fetch customer acceptances");
      return response.json();
    },
    enabled: !!quotationId,
  });

  // Fetch purchase orders for this quotation
  const { data: purchaseOrders = [], isLoading: isLoadingPOs } = useQuery({
    queryKey: ["/api/purchase-orders", { quotationId }],
    queryFn: async () => {
      const response = await fetch(`/api/purchase-orders?quotationId=${quotationId}`);
      if (!response.ok) throw new Error("Failed to fetch purchase orders");
      return response.json();
    },
    enabled: !!quotationId,
  });

  const isLoading = isLoadingQuotation || isLoadingAcceptances || isLoadingPOs;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Quotation not found</h3>
              <p className="mt-1 text-sm text-gray-500">
                The quotation you're looking for doesn't exist or has been removed.
              </p>
              <div className="mt-6">
                <Button onClick={() => navigate("/quotations")} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Quotations
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Active": { variant: "default" as const, icon: CheckCircle },
      "Superseded": { variant: "secondary" as const, icon: Clock },
      "Cancelled": { variant: "destructive" as const, icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Active"];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getValidationStatusBadge = (status: string) => {
    const statusConfig = {
      "Pending": { variant: "secondary" as const, icon: Clock },
      "Valid": { variant: "default" as const, icon: CheckCircle },
      "Invalid": { variant: "destructive" as const, icon: XCircle },
      "Requires Review": { variant: "outline" as const, icon: AlertTriangle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Pending"];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const hasActiveAcceptance = acceptances.some((acc: CustomerAcceptance) => acc.status === "Active");
  const latestAcceptance = acceptances.find((acc: CustomerAcceptance) => acc.status === "Active");

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/quotations")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quotations
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Customer Acceptance & PO Upload</h1>
            <p className="text-muted-foreground">
              Quote: {quotation.quoteNumber} • Total: ${quotation.totalAmount}
            </p>
          </div>
        </div>
      </div>

      {/* Quotation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quotation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Quote Number</p>
              <p className="text-lg font-semibold">{quotation.quoteNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={quotation.status === "Sent" ? "default" : "secondary"}>
                {quotation.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valid Until</p>
              <p className="text-lg font-semibold">
                {quotation.validUntil ? format(new Date(quotation.validUntil), "MMM dd, yyyy") : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="text-lg font-semibold">${quotation.totalAmount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="acceptance">Customer Acceptance</TabsTrigger>
          <TabsTrigger value="customer-po">Customer PO</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Acceptance Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Acceptances</CardTitle>
                <CardDescription>
                  {acceptances.length} acceptance record(s) for this quotation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {acceptances.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No Acceptances</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No customer acceptances have been recorded yet.
                    </p>
                    <div className="mt-6">
                      <Button 
                        onClick={() => setActiveTab("acceptance")}
                        size="sm"
                      >
                        Create Acceptance
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {acceptances.slice(0, 3).map((acceptance: CustomerAcceptance) => (
                      <div key={acceptance.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{acceptance.acceptanceType} Acceptance</p>
                          <p className="text-sm text-muted-foreground">
                            by {acceptance.acceptedBy} • {format(new Date(acceptance.acceptedAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                        {getStatusBadge(acceptance.status)}
                      </div>
                    ))}
                    {acceptances.length > 3 && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setActiveTab("history")}
                      >
                        View All ({acceptances.length})
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Purchase Orders</CardTitle>
                <CardDescription>
                  {purchaseOrders.length} purchase order(s) uploaded
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchaseOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No Purchase Orders</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No purchase orders have been uploaded yet.
                    </p>
                    <div className="mt-6">
                      <Button 
                        onClick={() => setActiveTab("customer-po")}
                        size="sm"
                        disabled={!hasActiveAcceptance}
                      >
                        Upload PO
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchaseOrders.slice(0, 3).map((po: PurchaseOrder) => (
                      <div key={po.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">PO: {po.poNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {po.documentName} • {format(new Date(po.createdAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                        {getValidationStatusBadge(po.validationStatus)}
                      </div>
                    ))}
                    {purchaseOrders.length > 3 && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setActiveTab("customer-po")}
                      >
                        View All ({purchaseOrders.length})
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Workflow Status */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Status</CardTitle>
              <CardDescription>
                Track progress through the acceptance and purchase order workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 ${quotation.status === "Sent" ? "text-green-600" : "text-gray-400"}`}>
                    <div className={`w-3 h-3 rounded-full ${quotation.status === "Sent" ? "bg-green-600" : "bg-gray-400"}`} />
                    <span className="text-sm font-medium">Quote Sent</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasActiveAcceptance ? "text-green-600" : "text-gray-400"}`}>
                    <div className={`w-3 h-3 rounded-full ${hasActiveAcceptance ? "bg-green-600" : "bg-gray-400"}`} />
                    <span className="text-sm font-medium">Customer Acceptance</span>
                  </div>
                  <div className={`flex items-center gap-2 ${purchaseOrders.some((po: PurchaseOrder) => po.validationStatus === "Valid") ? "text-green-600" : "text-gray-400"}`}>
                    <div className={`w-3 h-3 rounded-full ${purchaseOrders.some((po: PurchaseOrder) => po.validationStatus === "Valid") ? "bg-green-600" : "bg-gray-400"}`} />
                    <span className="text-sm font-medium">PO Validated</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                    <span className="text-sm font-medium">Sales Order</span>
                  </div>
                </div>
                <Button 
                  disabled={!purchaseOrders.some((po: PurchaseOrder) => po.validationStatus === "Valid")}
                  onClick={() => navigate(`/sales-orders/new?quotationId=${quotationId}`)}
                >
                  Create Sales Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acceptance" className="space-y-6">
          <CustomerAcceptanceForm 
            quotationId={quotationId} 
            quotation={quotation}
            existingAcceptances={acceptances}
          />
        </TabsContent>

        <TabsContent value="customer-po" className="space-y-6">
          <PurchaseOrderUpload 
            quotationId={quotationId} 
            customerAcceptance={latestAcceptance}
            disabled={!hasActiveAcceptance}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <AcceptanceHistory 
            quotationId={quotationId}
            acceptances={acceptances}
            purchaseOrders={purchaseOrders}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}