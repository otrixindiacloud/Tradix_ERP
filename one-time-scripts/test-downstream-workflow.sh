#!/usr/bin/env bash
set -euo pipefail

# Downstream workflow test: assumes earlier steps (customer, enquiry, quotation, acceptance, PO, sales order) can be created here minimally.
# Creates: Customer -> Item -> Sales Order -> Supplier LPO -> Goods Receipt -> Delivery -> Invoice

API_ROOT="http://localhost:5000/api"
JQ="jq -r"

echo "== Downstream Workflow Test =="

fail() { echo "[FAIL] $1" >&2; exit 1; }

post() { local path=$1; local data=$2; curl -s -X POST -H 'Content-Type: application/json' "$API_ROOT/$path" -d "$data"; }
get() { local path=$1; curl -s "$API_ROOT/$path"; }

echo "Creating customer"; CUSTOMER_JSON=$(post customers '{"name":"Workflow Customer","customerType":"Retail","classification":"Corporate"}') || fail 'customer create'; CUSTOMER_ID=$(echo "$CUSTOMER_JSON" | $JQ '.id')
echo "Customer: $CUSTOMER_ID"

echo "Creating item"; ITEM_JSON=$(post items '{"supplierCode":"SUP-001","barcode":"WF-ITEM-001","description":"Workflow Test Item"}') || fail 'item create'; ITEM_ID=$(echo "$ITEM_JSON" | $JQ '.id')
echo "Item: $ITEM_ID"

echo "Creating sales order"; SO_JSON=$(post sales-orders "{\"customerId\":\"$CUSTOMER_ID\",\"status\":\"Draft\"}") || fail 'SO create'; SO_ID=$(echo "$SO_JSON" | $JQ '.id')
echo "Sales Order: $SO_ID"

echo "Adding sales order item"; SO_ITEM_JSON=$(post sales-order-items "{\"salesOrderId\":\"$SO_ID\",\"itemId\":\"$ITEM_ID\",\"quantity\":10,\"unitPrice\":25,\"description\":\"WF Item\"}") || fail 'SO item'; SO_ITEM_ID=$(echo "$SO_ITEM_JSON" | $JQ '.id')
echo "SO Item: $SO_ITEM_ID"

echo "Creating supplier LPO"; LPO_JSON=$(post supplier-lpos "{\"salesOrderId\":\"$SO_ID\",\"supplierId\":null,\"status\":\"Draft\"}") || fail 'LPO create'; LPO_ID=$(echo "$LPO_JSON" | $JQ '.id')
echo "Supplier LPO: $LPO_ID"

echo "Adding supplier LPO item"; LPO_ITEM_JSON=$(post supplier-lpo-items "{\"supplierLpoId\":\"$LPO_ID\",\"salesOrderItemId\":\"$SO_ITEM_ID\",\"quantity\":10,\"unitCost\":15}") || fail 'LPO item'; LPO_ITEM_ID=$(echo "$LPO_ITEM_JSON" | $JQ '.id')
echo "LPO Item: $LPO_ITEM_ID"

echo "Creating goods receipt"; GR_JSON=$(post goods-receipts "{\"supplierLpoId\":\"$LPO_ID\",\"status\":\"Received\"}") || fail 'goods receipt'; GR_ID=$(echo "$GR_JSON" | $JQ '.id')
echo "Goods Receipt: $GR_ID"

echo "Adding goods receipt item"; GR_ITEM_JSON=$(post goods-receipt-items "{\"goodsReceiptId\":\"$GR_ID\",\"supplierLpoItemId\":\"$LPO_ITEM_ID\",\"quantityReceived\":10,\"quantityOrdered\":10}") || fail 'GR item'; GR_ITEM_ID=$(echo "$GR_ITEM_JSON" | $JQ '.id')
echo "GR Item: $GR_ITEM_ID"

echo "Creating delivery"; DELIVERY_JSON=$(post deliveries "{\"salesOrderId\":\"$SO_ID\",\"status\":\"Draft\"}") || fail 'delivery'; DELIVERY_ID=$(echo "$DELIVERY_JSON" | $JQ '.id')
echo "Delivery: $DELIVERY_ID"

echo "Adding delivery item"; DELIVERY_ITEM_JSON=$(post delivery-items "{\"deliveryId\":\"$DELIVERY_ID\",\"salesOrderItemId\":\"$SO_ITEM_ID\",\"quantity\":10,\"unitPrice\":25}") || fail 'delivery item'; DELIVERY_ITEM_ID=$(echo "$DELIVERY_ITEM_JSON" | $JQ '.id')
echo "Delivery Item: $DELIVERY_ITEM_ID"

echo "Generating invoice from delivery"; INVOICE_JSON=$(post invoices/generate-from-delivery "{\"deliveryId\":\"$DELIVERY_ID\",\"invoiceType\":\"Final\"}") || fail 'invoice generation'; INVOICE_ID=$(echo "$INVOICE_JSON" | $JQ '.id'); INVOICE_NUMBER=$(echo "$INVOICE_JSON" | $JQ '.invoiceNumber')
echo "Invoice: $INVOICE_ID ($INVOICE_NUMBER)"

echo "Mark invoice paid (partial)"; PAID_JSON=$(post invoices/$INVOICE_ID/mark-paid '{"paidAmount":100,"paymentMethod":"Cash","paymentReference":"WFTEST"}') || fail 'mark paid'; OUTSTANDING=$(echo "$PAID_JSON" | $JQ '.outstandingAmount')
echo "Outstanding after payment: $OUTSTANDING"

echo "Fetch invoice items"; II_JSON=$(get invoices/$INVOICE_ID/items) || fail 'invoice items'; COUNT_ITEMS=$(echo "$II_JSON" | jq 'length')
echo "Invoice item count: $COUNT_ITEMS"

echo "== SUCCESS Downstream workflow completed =="
