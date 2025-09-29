import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Upload, 
  AlertTriangle, 
  Eye, 
  Download,
  History,
  User,
  Mail
} from "lucide-react";
import type { CustomerAcceptance, PurchaseOrder } from "@shared/schema";

interface AcceptanceHistoryProps {
  quotationId: string;
  acceptances: CustomerAcceptance[];
  purchaseOrders: PurchaseOrder[];
}

export function AcceptanceHistory({ 
  quotationId, 
  acceptances, 
  purchaseOrders 
}: AcceptanceHistoryProps) {
  const [selectedAcceptance, setSelectedAcceptance] = useState<CustomerAcceptance | null>(null);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

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

  // Combine and sort all events chronologically
  const allEvents = [
    ...acceptances.map(acc => ({ ...acc, type: 'acceptance' as const })),
    ...purchaseOrders.map(po => ({ ...po, type: 'purchase_order' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="acceptances">Acceptances ({acceptances.length})</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders ({purchaseOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Activity Timeline
              </CardTitle>
              <CardDescription>
                Chronological view of all acceptance and purchase order activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allEvents.length === 0 ? (
                <div className="text-center py-8">
                  <History className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No Activity</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No acceptance or purchase order activity recorded yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allEvents.map((event, index) => (
                    <div key={`${event.type}-${event.id}`} className="relative">
                      {index < allEvents.length - 1 && (
                        <div className="absolute left-4 top-8 h-full w-0.5 bg-gray-200" />
                      )}
                      
                      <div className="flex items-start gap-4">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          event.type === 'acceptance' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {event.type === 'acceptance' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Upload className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">
                                {event.type === 'acceptance' 
                                  ? `${(event as CustomerAcceptance).acceptanceType} Acceptance Created`
                                  : `Purchase Order Uploaded: ${(event as PurchaseOrder).poNumber}`
                                }
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {event.type === 'acceptance' 
                                  ? `by ${(event as CustomerAcceptance).acceptedBy}`
                                  : `Document: ${(event as PurchaseOrder).documentName}`
                                } • {format(new Date(event.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {event.type === 'acceptance' 
                                ? getStatusBadge((event as CustomerAcceptance).status)
                                : getValidationStatusBadge((event as PurchaseOrder).validationStatus)
                              }
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (event.type === 'acceptance') {
                                    setSelectedAcceptance(event as CustomerAcceptance);
                                  } else {
                                    setSelectedPO(event as PurchaseOrder);
                                  }
                                }}
                                data-testid={`button-view-${event.type}-${index}`}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acceptances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Customer Acceptances
              </CardTitle>
              <CardDescription>
                All customer acceptance records for this quotation
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
                </div>
              ) : (
                <div className="space-y-4">
                  {acceptances.map((acceptance, index) => (
                    <Card key={acceptance.id} className="border">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <h3 className="font-medium">{acceptance.acceptanceType} Acceptance</h3>
                              {getStatusBadge(acceptance.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Accepted by: {acceptance.acceptedBy}</span>
                              </div>
                              {acceptance.customerEmail && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span>{acceptance.customerEmail}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{format(new Date(acceptance.acceptedAt), "MMM dd, yyyy 'at' h:mm a")}</span>
                              </div>
                              {acceptance.totalAcceptedAmount && (
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Amount:</span>
                                  <span className="font-medium">${acceptance.totalAcceptedAmount}</span>
                                </div>
                              )}
                            </div>

                            {acceptance.customerNotes && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Customer Notes: </span>
                                <span>{acceptance.customerNotes}</span>
                              </div>
                            )}
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedAcceptance(acceptance)}
                            data-testid={`button-view-acceptance-${index}`}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Purchase Orders
              </CardTitle>
              <CardDescription>
                All purchase orders uploaded for this quotation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {purchaseOrders.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No Purchase Orders</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No purchase orders have been uploaded yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchaseOrders.map((po, index) => (
                    <Card key={po.id} className="border">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <h3 className="font-medium">PO: {po.poNumber}</h3>
                              {getValidationStatusBadge(po.validationStatus)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Document: </span>
                                <span>{po.documentName}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">PO Date: </span>
                                <span>{format(new Date(po.poDate), "MMM dd, yyyy")}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Total: </span>
                                <span className="font-medium">${po.totalPoAmount}</span>
                              </div>
                              {po.customerReference && (
                                <div>
                                  <span className="text-muted-foreground">Customer Ref: </span>
                                  <span>{po.customerReference}</span>
                                </div>
                              )}
                              {po.paymentTerms && (
                                <div>
                                  <span className="text-muted-foreground">Payment: </span>
                                  <span>{po.paymentTerms}</span>
                                </div>
                              )}
                              {po.deliveryTerms && (
                                <div>
                                  <span className="text-muted-foreground">Delivery: </span>
                                  <span>{po.deliveryTerms}</span>
                                </div>
                              )}
                            </div>

                            {po.validationNotes && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Validation Notes: </span>
                                <span>{po.validationNotes}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/api/purchase-orders/${po.id}/download`, '_blank')}
                              data-testid={`button-download-po-${index}`}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPO(po)}
                              data-testid={`button-view-po-${index}`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Modals would go here - for now, we'll show basic info */}
      {selectedAcceptance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Acceptance Details</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAcceptance(null)}
                className="absolute top-4 right-4"
                data-testid="button-close-acceptance-modal"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <p>{selectedAcceptance.acceptanceType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <div>{getStatusBadge(selectedAcceptance.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Accepted By</label>
                    <p>{selectedAcceptance.acceptedBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <p>{format(new Date(selectedAcceptance.acceptedAt), "MMM dd, yyyy 'at' h:mm a")}</p>
                  </div>
                </div>
                {selectedAcceptance.customerNotes && (
                  <div>
                    <label className="text-sm font-medium">Customer Notes</label>
                    <p className="text-sm">{selectedAcceptance.customerNotes}</p>
                  </div>
                )}
                {selectedAcceptance.internalNotes && (
                  <div>
                    <label className="text-sm font-medium">Internal Notes</label>
                    <p className="text-sm">{selectedAcceptance.internalNotes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedPO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Purchase Order Details</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPO(null)}
                className="absolute top-4 right-4"
                data-testid="button-close-po-modal"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">PO Number</label>
                    <p>{selectedPO.poNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Validation Status</label>
                    <div>{getValidationStatusBadge(selectedPO.validationStatus)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">PO Date</label>
                    <p>{format(new Date(selectedPO.poDate), "MMM dd, yyyy")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Total Amount</label>
                    <p>${selectedPO.totalPoAmount}</p>
                  </div>
                </div>
                {selectedPO.specialInstructions && (
                  <div>
                    <label className="text-sm font-medium">Special Instructions</label>
                    <p className="text-sm">{selectedPO.specialInstructions}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}