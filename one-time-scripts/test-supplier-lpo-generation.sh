#!/usr/bin/env bash
set -euo pipefail
API_BASE_DEFAULT="http://localhost:5000"
API="${API:-${API_BASE_DEFAULT}/api}"
GREEN="\033[32m"; RED="\033[31m"; YELLOW="\033[33m"; NC="\033[0m"
log(){ echo -e "${GREEN}[INFO]${NC} $*"; }
err(){ echo -e "${RED}[ERROR]${NC} $*" >&2; }
warn(){ echo -e "${YELLOW}[WARN]${NC} $*"; }
post(){ curl -s -H 'Content-Type: application/json' -d "$2" "$API$1"; }
get(){ curl -s "$API$1"; }
put(){ curl -s -X PUT -H 'Content-Type: application/json' -d "$2" "$API$1"; }

jq_check(){ command -v jq >/dev/null || { err "jq required"; exit 1; }; }
jq_check

log "Supplier LPO auto-generation test start"
USER_EMAIL="lpo-tester-$(date +%s)@example.com"
USER_RESP=$(post "/users" '{"username":"lpo_user","email":"'$USER_EMAIL'","role":"user"}') || true
USER_ID=$(echo "$USER_RESP" | jq -r '.id')
if [[ -z "$USER_ID" || "$USER_ID" == null ]]; then
  USER_SEARCH=$(get "/users?search=lpo_user")
  USER_ID=$(echo "$USER_SEARCH" | jq -r '.users[0].id')
fi
[[ -z "$USER_ID" || "$USER_ID" == null ]] && { err "User creation failed"; exit 1; }
log "Using user $USER_ID"

CUST_RESP=$(post "/customers" '{"name":"LPO Flow Customer","customerType":"Retail","classification":"Corporate"}')
CUSTOMER_ID=$(echo "$CUST_RESP" | jq -r '.id')
log "Customer $CUSTOMER_ID"

ENQ_RESP=$(post "/enquiries" '{"customerId":"'$CUSTOMER_ID'","source":"Email","notes":"LPO Enquiry","createdBy":"'$USER_ID'"}')
ENQUIRY_ID=$(echo "$ENQ_RESP" | jq -r '.id')
log "Enquiry $ENQUIRY_ID"

QUOT_RESP=$(post "/quotations/generate/$ENQUIRY_ID" '{"userId":"00000000-0000-0000-0000-000000000001"}')
QUOTATION_ID=$(echo "$QUOT_RESP" | jq -r '.id')
log "Quotation $QUOTATION_ID"

QI_RESP=$(post "/quotations/$QUOTATION_ID/items" '{"description":"Promo Shirt","quantity":50,"unitPrice":8.75}')
QI_ID=$(echo "$QI_RESP" | jq -r '.id')
log "Quotation Item $QI_ID"

put "/quotations/$QUOTATION_ID" '{"status":"Accepted"}' >/dev/null

ACCEPT_RESP=$(post "/customer-acceptances" '{"quotationId":"'$QUOTATION_ID'","acceptanceType":"Full","acceptedBy":"Customer"}')
ACCEPT_ID=$(echo "$ACCEPT_RESP" | jq -r '.id')
log "Acceptance $ACCEPT_ID"
post "/customer-acceptances/$ACCEPT_ID/item-acceptances" '{"quotationItemId":"'$QI_ID'","isAccepted":true,"originalQuantity":50,"acceptedQuantity":50}' >/dev/null

PO_NUM="PO-$(date +%s)"
PO_RESP=$(post "/purchase-orders" '{"quotationId":"'$QUOTATION_ID'","customerId":"'$CUSTOMER_ID'","poNumber":"'$PO_NUM'","poDate":"2025-01-15","uploadedBy":"'$USER_ID'","documentPath":"/tmp/'$PO_NUM'.pdf","documentName":"'$PO_NUM'.pdf","documentType":"CustomerPO"}')
PO_ID=$(echo "$PO_RESP" | jq -r '.id')
log "PO $PO_ID"

SO_RESP=$(post "/sales-orders/from-quotation" '{"quotationId":"'$QUOTATION_ID'","userId":"'$USER_ID'"}')
SO_ID=$(echo "$SO_RESP" | jq -r '.id')
log "Sales Order $SO_ID"

# Auto-generate Supplier LPO(s) endpoint (to be implemented): assume POST /supplier-lpos/from-sales-order
LPO_RESP=$(post "/supplier-lpos/from-sales-order" '{"salesOrderId":"'$SO_ID'","userId":"'$USER_ID'"}')
log "Raw LPO resp: $LPO_RESP"
LPO_ID=$(echo "$LPO_RESP" | jq -r '.id')
if [[ -z "$LPO_ID" || "$LPO_ID" == null ]]; then
  err "Failed to create Supplier LPO"; exit 1; fi

ITEMS=$(get "/supplier-lpos/$LPO_ID/items")
ITEM_COUNT=$(echo "$ITEMS" | jq 'length') || ITEM_COUNT=0

[[ "$ITEM_COUNT" -ge 1 ]] || warn "Expected supplier LPO items >=1 (got $ITEM_COUNT)"

echo '{"supplierLpoId":"'$LPO_ID'","salesOrderId":"'$SO_ID'","quotationId":"'$QUOTATION_ID'","purchaseOrderId":"'$PO_ID'"}' | jq '.'
log "Supplier LPO generation test completed"
