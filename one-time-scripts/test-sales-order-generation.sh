#!/usr/bin/env bash
set -euo pipefail

API_BASE_DEFAULT="http://localhost:5000"
API="${API:-${API_BASE_DEFAULT}/api}"
GREEN="\033[32m"; RED="\033[31m"; YELLOW="\033[33m"; NC="\033[0m"

log() { echo -e "${GREEN}[INFO]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
err() { echo -e "${RED}[ERROR]${NC} $*" >&2; }

jq_check() { command -v jq >/dev/null 2>&1 || { err "jq is required"; exit 1; }; }

post() { local path="$1"; local data="$2"; curl -s -H 'Content-Type: application/json' -d "$data" "$API$path"; }
get() { local path="$1"; curl -s "$API$path"; }
put() { local path="$1"; local data="$2"; curl -s -X PUT -H 'Content-Type: application/json' -d "$data" "$API$path"; }

failures=0
assert() { local cond="$1"; local msg="$2"; if [[ "$cond" != "0" ]]; then err "Assertion failed: $msg"; failures=$((failures+1)); fi }

jq_check
log "Starting Sales Order generation end-to-end test"

# 1. Create user (for createdBy / uploadedBy references)
USER_EMAIL="so-tester-$(date +%s)@example.com"
USER_RESP=$(post "/users" "{\"username\":\"so_tester_$USER_EMAIL\",\"email\":\"$USER_EMAIL\",\"role\":\"user\"}") || true
USER_ID=$(echo "$USER_RESP" | jq -r '.id')
if [[ -z "$USER_ID" || "$USER_ID" == null ]]; then
	# Try search existing
	USER_SEARCH=$(get "/users?search=so_tester")
	USER_ID=$(echo "$USER_SEARCH" | jq -r '.users[0].id')
fi
[[ -z "$USER_ID" || "$USER_ID" == null ]] && { err "Failed to obtain user id"; exit 1; }
log "Using test user: $USER_ID"

# 2. Create customer
CUST_RESP=$(post "/customers" '{"name":"SO Flow Customer","customerType":"Retail","classification":"Corporate"}')
CUSTOMER_ID=$(echo "$CUST_RESP" | jq -r '.id')
log "Created customer: $CUSTOMER_ID"

# 3. Create enquiry (minimum required: customerId, source)
ENQ_PAYLOAD="{\"customerId\":\"$CUSTOMER_ID\",\"source\":\"Email\",\"notes\":\"SO Flow Enquiry\",\"createdBy\":\"$USER_ID\"}"
log "Enquiry payload: $ENQ_PAYLOAD"
ENQ_RESP=$(post "/enquiries" "$ENQ_PAYLOAD")
log "Enquiry raw response: $ENQ_RESP"
ENQUIRY_ID=$(echo "$ENQ_RESP" | jq -r '.id')
if [[ -z "$ENQUIRY_ID" || "$ENQUIRY_ID" == null ]]; then
	err "Enquiry creation failed. Raw response: $ENQ_RESP"; exit 1; fi
log "Created enquiry: $ENQUIRY_ID"

# 4. Create quotation from enquiry (simpler: direct quotation create)
QUOT_RESP=$(post "/quotations/generate/$ENQUIRY_ID" "{\"userId\":\"00000000-0000-0000-0000-000000000001\"}")
QUOTATION_ID=$(echo "$QUOT_RESP" | jq -r '.id')
if [[ -z "$QUOTATION_ID" || "$QUOTATION_ID" == null ]]; then
	err "Quotation generation failed: $QUOT_RESP"; exit 1; fi
log "Generated quotation: $QUOTATION_ID"

# 5. Add quotation item
QI_RESP=$(post "/quotations/$QUOTATION_ID/items" '{"description":"Branded Mug","quantity":100,"unitPrice":12.5}')
QI_ID=$(echo "$QI_RESP" | jq -r '.id')
[[ -z "$QI_ID" || "$QI_ID" == null ]] && { err "Quotation item creation failed: $QI_RESP"; exit 1; }
log "Added quotation item: $QI_ID"

# 6. Approve quotation (simplified: set status Approved if endpoint allows)
PATCH_RESP=$(put "/quotations/$QUOTATION_ID" '{"status":"Accepted"}')
NEW_STATUS=$(echo "$PATCH_RESP" | jq -r '.status')
log "Quotation status after patch: $NEW_STATUS"
if [[ "$NEW_STATUS" != "Accepted" ]]; then
  err "Quotation not in Accepted status; cannot proceed"; exit 1; fi

# 7. Accept customer quotation items (full acceptance)
ACCEPT_RESP=$(post "/customer-acceptances" '{"quotationId":"'$QUOTATION_ID'","acceptanceType":"Full","acceptedBy":"Customer Contact","customerNotes":"All items accepted"}')
ACCEPT_ID=$(echo "$ACCEPT_RESP" | jq -r '.id')
if [[ -z "$ACCEPT_ID" || "$ACCEPT_ID" == null ]]; then
	err "Customer acceptance failed: $ACCEPT_RESP"; exit 1; fi
log "Created customer acceptance: $ACCEPT_ID"

# 7b. Accept quotation item at item level (required for PO validation)
ITEM_ACCEPT_PAYLOAD='{"quotationItemId":"'$QI_ID'","isAccepted":true,"originalQuantity":100,"acceptedQuantity":100}'
log "Item acceptance payload: $ITEM_ACCEPT_PAYLOAD"
ITEM_ACCEPT_RESP=$(post "/customer-acceptances/$ACCEPT_ID/item-acceptances" "$ITEM_ACCEPT_PAYLOAD")
log "Item acceptance raw response: $ITEM_ACCEPT_RESP"
ITEM_ACCEPT_ID=$(echo "$ITEM_ACCEPT_RESP" | jq -r '.id')
if [[ -z "$ITEM_ACCEPT_ID" || "$ITEM_ACCEPT_ID" == null ]]; then
	err "Item acceptance creation failed"; exit 1; fi
log "Created item acceptance: $ITEM_ACCEPT_ID"

# 8. Upload Customer PO (required for Sales Order)
PO_NUMBER="PO-$(date +%s)"
PO_PAYLOAD='{"quotationId":"'$QUOTATION_ID'","customerId":"'$CUSTOMER_ID'","poNumber":"'$PO_NUMBER'","poDate":"2025-01-15","uploadedBy":"'$USER_ID'","documentPath":"/tmp/'$PO_NUMBER'.pdf","documentName":"'$PO_NUMBER'.pdf","documentType":"CustomerPO"}'
log "PO payload: $PO_PAYLOAD"
PO_RESP=$(post "/purchase-orders" "$PO_PAYLOAD")
log "PO raw response: $PO_RESP"
PO_ID=$(echo "$PO_RESP" | jq -r '.id')
if [[ -z "$PO_ID" || "$PO_ID" == null ]]; then
	err "Purchase Order creation failed: $PO_RESP"; exit 1; fi
log "Uploaded customer PO: $PO_ID number $PO_NUMBER"

# 9. Generate Sales Order from quotation
SO_RESP=$(post "/sales-orders/from-quotation" '{"quotationId":"'$QUOTATION_ID'","userId":"'$USER_ID'"}')
SO_ID=$(echo "$SO_RESP" | jq -r '.id')
SO_NUMBER=$(echo "$SO_RESP" | jq -r '.orderNumber')
log "Raw Sales Order response: $SO_RESP"
log "Generated Sales Order: $SO_ID number $SO_NUMBER"

# 10. Fetch sales order items
SO_ITEMS=$(get "/sales-orders/$SO_ID/items")
ITEM_COUNT=$(echo "$SO_ITEMS" | jq 'length')
log "Sales Order items count: $ITEM_COUNT"

# Basic assertions
[[ "$NEW_STATUS" == "Approved" ]] || { warn "Quotation status not Approved (was $NEW_STATUS)"; }
[[ -n "$SO_ID" && "$SO_ID" != "null" ]] || { err "Sales Order not created"; exit 1; }
[[ "$ITEM_COUNT" -ge 1 ]] || { err "Expected at least one sales order item"; exit 1; }

log "Sales Order generation test completed successfully"

echo '{"salesOrderId":"'$SO_ID'","salesOrderNumber":"'$SO_NUMBER'","quotationId":"'$QUOTATION_ID'","poId":"'$PO_ID'"}' | jq '.'
