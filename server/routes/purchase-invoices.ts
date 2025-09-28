import type { Express } from "express";
import { storage } from "../storage";

// Derived Purchase Invoices API (read-only for now)
// We don't have a dedicated purchase_invoices table yet.
// This endpoint derives invoice-like rows from Goods Receipts + Supplier LPOs.

export function registerPurchaseInvoiceRoutes(app: Express) {
  // List derived purchase invoices
  app.get("/api/purchase-invoices", async (req, res) => {
    try {
      const { status, supplier, currency, search, dateFrom, dateTo } = req.query as Record<string, string | undefined>;

      // Fetch goods receipt headers and map to invoice-like objects
      const grHeaders = await storage.getGoodsReceiptHeaders({});
      const results = await Promise.all((grHeaders || []).map(async (gr: any) => {
        // Join supplier LPO to enrich
        const lpo = gr.supplierLpoId ? await storage.getSupplierLpo(gr.supplierLpoId) : null;

        const currencyCode = (lpo?.currency || 'BHD');
        const supplierName = lpo?.supplierId ? (await storage.getSupplier(lpo.supplierId))?.name : undefined;

        // Compute totals from LPO if available; else fallback zeros
        const subtotal = String(lpo?.subtotal ?? '0.00');
        const taxAmount = String(lpo?.taxAmount ?? '0.00');
        const totalAmount = String(lpo?.totalAmount ?? subtotal);

        return {
          id: gr.id,
          invoiceNumber: gr.receiptNumber,
          supplierInvoiceNumber: undefined,
          supplierId: lpo?.supplierId || gr.supplierId,
          supplierName: supplierName || 'Supplier',
          purchaseOrderId: lpo?.id,
          purchaseOrderNumber: lpo?.lpoNumber,
          goodsReceiptId: gr.id,
          goodsReceiptNumber: gr.receiptNumber,
          status: (gr.status === 'Complete' ? 'Approved' : gr.status === 'Pending' ? 'Draft' : gr.status) || 'Draft',
          paymentStatus: 'Unpaid',
          invoiceDate: gr.receiptDate,
          dueDate: gr.expectedDeliveryDate || gr.receiptDate,
          receivedDate: gr.actualDeliveryDate,
          paymentDate: undefined,
          subtotal,
          taxAmount,
          discountAmount: '0.00',
          totalAmount,
          paidAmount: '0.00',
          remainingAmount: totalAmount,
          currency: currencyCode,
          paymentTerms: lpo?.paymentTerms || '',
          attachments: [],
          itemCount: 0,
          isRecurring: false,
          createdAt: gr.createdAt,
          updatedAt: gr.updatedAt,
          notes: gr.notes || ''
        };
      }));

      // Apply lightweight filtering on derived data
      const filtered = (results || []).filter((row) => {
        if (status && status !== 'all' && row.status !== status) return false;
        if (supplier && row.supplierName && !row.supplierName.toLowerCase().includes(supplier.toLowerCase())) return false;
        if (currency && row.currency !== currency) return false;
        if (search) {
          const s = search.toLowerCase();
          const hay = `${row.invoiceNumber} ${row.supplierInvoiceNumber || ''} ${row.supplierName}`.toLowerCase();
          if (!hay.includes(s)) return false;
        }
        if (dateFrom && row.invoiceDate && String(row.invoiceDate) < dateFrom) return false;
        if (dateTo && row.invoiceDate && String(row.invoiceDate) > dateTo) return false;
        return true;
      });

      res.json(filtered);
    } catch (error) {
      console.error("Error fetching purchase invoices:", error);
      res.status(500).json({ message: "Failed to fetch purchase invoices" });
    }
  });
}

export default registerPurchaseInvoiceRoutes;
