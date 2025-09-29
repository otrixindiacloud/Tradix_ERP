import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusPill from "@/components/status/status-pill";
import { format as formatDateFns } from "date-fns";
import { Eye, Truck, Package, Navigation, MapPin, FileText, BarChart3, ArrowLeft, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Shipment {
  id: string;
  shipmentNumber: string;
  trackingNumber: string;
  salesOrderId?: string;
  salesOrderNumber?: string;
  supplierId?: string;
  supplierName?: string;
  carrierId: string;
  carrierName: string;
  serviceType: "Standard" | "Express" | "Overnight" | "Economy";
  status: "Pending" | "Picked Up" | "In Transit" | "Out for Delivery" | "Delivered" | "Delayed" | "Cancelled" | "Lost";
  priority: "Low" | "Medium" | "High" | "Urgent";
  origin: string;
  destination: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  weight: string;
  dimensions: string;
  declaredValue: string;
  currency: string;
  shippingCost: string;
  customerReference?: string;
  specialInstructions?: string;
  packageCount: number;
  isInsured: boolean;
  requiresSignature: boolean;
  currentLocation?: string;
  lastUpdate: string;
  createdAt: string;
  updatedAt: string;
}

function formatDate(dateStr?: string, pattern = 'MMM dd, yyyy') {
  if (!dateStr) return '—';
  try { return formatDateFns(new Date(dateStr), pattern); } catch { return dateStr; }
}

const priorityColor = (p: string) => {
  switch (p) {
    case 'Low': return 'text-green-700 bg-green-100';
    case 'Medium': return 'text-yellow-700 bg-yellow-100';
    case 'High': return 'text-orange-700 bg-orange-100';
    case 'Urgent': return 'text-red-700 bg-red-100';
    default: return 'text-gray-700 bg-gray-100';
  }
};
const serviceColor = (s: string) => {
  switch (s) {
    case 'Economy': return 'text-gray-700 bg-gray-100';
    case 'Standard': return 'text-blue-700 bg-blue-100';
    case 'Express': return 'text-purple-700 bg-purple-100';
    case 'Overnight': return 'text-red-700 bg-red-100';
    default: return 'text-gray-700 bg-gray-100';
  }
};

export default function ShipmentDetailPage() {
  const [, params] = useRoute('/shipment-tracking/:id');
  const shipmentId = (params as any)?.id;
  const { toast } = useToast();

  const { data: shipment, isLoading, error } = useQuery<Shipment | null>({
    queryKey: ['shipment', shipmentId],
    enabled: !!shipmentId,
    queryFn: async () => {
      if (!shipmentId) return null;
      const res = await fetch(`/api/shipments/${shipmentId}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to load shipment');
      }
      return res.json();
    }
  });

  useEffect(() => {
    if (error) {
      toast({ title: 'Error', description: (error as any).message || 'Failed to load shipment', variant: 'destructive' });
    }
  }, [error]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/shipment-tracking">
            <Button variant="outline" className="shadow-sm" data-testid="button-back-shipment-list">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
            <Eye className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shipment Detail</h1>
            <p className="text-muted-foreground">Comprehensive shipment information</p>
          </div>
        </div>
        <div className="flex gap-2">
          {shipment?.trackingNumber && (
            <Button onClick={() => window.open(`https://track.carrier.com/${shipment.trackingNumber}`, '_blank')} data-testid="button-track-online">
              <Globe className="h-4 w-4 mr-2" /> Track Online
            </Button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      )}

      {!isLoading && !shipment && (
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Shipment not found.</p>
          <Link href="/shipment-tracking"><Button>Go Back</Button></Link>
        </Card>
      )}

      {shipment && (
        <div className="space-y-8">
          {/* Summary Badges */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="text-xs">{shipment.status}</Badge>
            <Badge className={priorityColor(shipment.priority)}>{shipment.priority}</Badge>
            <Badge className={serviceColor(shipment.serviceType)}>{shipment.serviceType}</Badge>
            {shipment.isInsured && <Badge variant="outline" className="text-xs">Insured</Badge>}
            {shipment.requiresSignature && <Badge variant="outline" className="text-xs">Signature Required</Badge>}
          </div>

          {/* Identification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 space-y-3">
              <h2 className="font-semibold text-gray-700 flex items-center gap-2"><Package className="h-4 w-4 text-blue-600" /> Identification</h2>
              <div className="grid grid-cols-2 text-sm gap-y-2">
                <span className="text-gray-500">Shipment #</span><span className="font-mono font-medium">{shipment.shipmentNumber}</span>
                <span className="text-gray-500">Tracking #</span><span className="font-mono font-medium">{shipment.trackingNumber}</span>
                {shipment.salesOrderNumber && (<><span className="text-gray-500">Sales Order</span><span>{shipment.salesOrderNumber}</span></>)}
                {shipment.customerReference && (<><span className="text-gray-500">Customer Ref</span><span>{shipment.customerReference}</span></>)}
                <span className="text-gray-500">Carrier</span><span>{shipment.carrierName}</span>
                <span className="text-gray-500">Service</span><span>{shipment.serviceType}</span>
              </div>
            </Card>
            <Card className="p-5 space-y-3">
              <h2 className="font-semibold text-gray-700 flex items-center gap-2"><Navigation className="h-4 w-4 text-purple-600" /> Route & Timing</h2>
              <div className="grid grid-cols-2 text-sm gap-y-2">
                <span className="text-gray-500">Origin</span><span className="font-medium flex items-center gap-1"><MapPin className="h-3 w-3 text-green-600" /> {shipment.origin}</span>
                <span className="text-gray-500">Destination</span><span className="font-medium flex items-center gap-1"><MapPin className="h-3 w-3 text-red-600" /> {shipment.destination}</span>
                <span className="text-gray-500">Est Delivery</span><span>{formatDate(shipment.estimatedDelivery)}</span>
                <span className="text-gray-500">Actual</span><span>{formatDate(shipment.actualDelivery)}</span>
                <span className="text-gray-500">Current Location</span><span>{shipment.currentLocation || 'Updating...'}</span>
                <span className="text-gray-500">Last Update</span><span>{formatDate(shipment.lastUpdate, 'MMM dd, yyyy HH:mm')}</span>
              </div>
            </Card>
          </div>

          {/* Package & Value */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 space-y-3">
              <h2 className="font-semibold text-gray-700 flex items-center gap-2"><Package className="h-4 w-4 text-orange-600" /> Package</h2>
              <div className="grid grid-cols-2 text-sm gap-y-2">
                <span className="text-gray-500">Weight</span><span>{shipment.weight || '—'} kg</span>
                <span className="text-gray-500">Dimensions</span><span>{shipment.dimensions || '—'}</span>
                <span className="text-gray-500">Packages</span><span>{shipment.packageCount}</span>
                <span className="text-gray-500">Signature</span><span>{shipment.requiresSignature ? 'Required' : 'No'}</span>
              </div>
            </Card>
            <Card className="p-5 space-y-3">
              <h2 className="font-semibold text-gray-700 flex items-center gap-2"><FileText className="h-4 w-4 text-purple-600" /> Value</h2>
              <div className="grid grid-cols-2 text-sm gap-y-2">
                <span className="text-gray-500">Declared</span><span>{shipment.declaredValue} {shipment.currency}</span>
                <span className="text-gray-500">Shipping Cost</span><span>{shipment.shippingCost} {shipment.currency}</span>
                <span className="text-gray-500">Insured</span><span>{shipment.isInsured ? 'Yes' : 'No'}</span>
                <span className="text-gray-500">Priority</span><span>{shipment.priority}</span>
              </div>
            </Card>
            <Card className="p-5 space-y-3">
              <h2 className="font-semibold text-gray-700 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-green-600" /> Timestamps</h2>
              <div className="grid grid-cols-2 text-sm gap-y-2">
                <span className="text-gray-500">Created</span><span>{formatDate(shipment.createdAt)}</span>
                <span className="text-gray-500">Updated</span><span>{formatDate(shipment.updatedAt, 'MMM dd, yyyy HH:mm')}</span>
                <span className="text-gray-500">Last Update</span><span>{formatDate(shipment.lastUpdate, 'MMM dd, yyyy HH:mm')}</span>
                <span className="text-gray-500">Est Lead (days)</span><span>{shipment.estimatedDelivery ? Math.max(0, Math.round((new Date(shipment.estimatedDelivery).getTime() - new Date(shipment.createdAt).getTime()) / (1000*60*60*24))) : '—'}</span>
              </div>
            </Card>
          </div>

          {shipment.specialInstructions && (
            <Card className="p-5 space-y-2">
              <h2 className="font-semibold text-gray-700">Special Instructions</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md border">{shipment.specialInstructions}</p>
            </Card>
          )}

          {/* Status Pill */}
          <div>
            <StatusPill status={shipment.status.toLowerCase().replace(' ', '-')} />
          </div>
        </div>
      )}
    </div>
  );
}
