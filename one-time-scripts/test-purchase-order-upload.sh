#!/usr/bin/env bash
set -euo pipefail

# Purpose: Validate Purchase Order upload (Step 4) workflow
# Flow: Create customer -> enquiry -> quotation (+items) -> approve -> accept items -> attempt PO before acceptance (expect fail) -> create acceptance + item acceptance -> create PO (success) -> upload via /api/po-upload (success) -> list POs

API_BASE_DEFAULT="http://localhost:5000"
API="${API:-${API_BASE_DEFAULT}/api}"
JQ="jq -r"

log(){ echo -e "\n==== $1 ====\n"; }
fail(){ echo "ERROR: $1" >&2; exit 1; }
expect_http(){ local code=$1 expected=$2 msg=$3; if [[ "$code" != "$expected" ]]; then fail "$msg (got $code expected $expected)"; fi }

start_server(){
  if curl -s "$API/health" | grep -q '"ok"'; then
    echo "Server already healthy at $API"; return 0; fi

  # Derive port from API
  PORT=$(echo "$API" | sed -E 's#http://[^:]+:([0-9]+)/.*#\1#')
  [[ -z "$PORT" || "$PORT" == "$API" ]] && PORT=5000
  if lsof -i:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Port $PORT in use but health check failed; proceeding (maybe different base path).";
  else
    echo "Starting server on port $PORT...";
    npm run dev >/tmp/po-upload-server.log 2>&1 &
    for i in {1..40}; do
      sleep 1
      if curl -s "$API/health" | grep -q '"ok"'; then
        echo "Server up."; return 0; fi
    done
    echo "Server failed to start. Last log lines:"; tail -n 80 /tmp/po-upload-server.log; exit 1
  fi
}

start_server

log "Create customer"
# Ensure test user exists (or create one) for uploadedBy FK
log "Ensure test user"
USER=$(curl -s -X POST "$API/users" -H 'Content-Type: application/json' -d '{"username":"po_test_user","role":"user"}') || true
if echo "$USER" | grep -q 'exists'; then
  # Fetch existing
  USER_LIST=$(curl -s "$API/users?search=po_test_user")
  USER_ID=$(echo "$USER_LIST" | jq -r '.users[0].id')
else
  USER_ID=$(echo "$USER" | $JQ '.id')
fi
[[ -z "$USER_ID" || "$USER_ID" == null ]] && fail "Could not establish test user: $USER $USER_LIST"
echo "User ID: $USER_ID"
CUSTOMER=$(curl -s -X POST "$API/customers" -H 'Content-Type: application/json' -d '{"name":"PO Test Customer","customerType":"Retail","classification":"Corporate"}')
CUSTOMER_ID=$(echo "$CUSTOMER" | $JQ '.id')
[[ "$CUSTOMER_ID" == null ]] && fail "Customer creation failed: $CUSTOMER"

echo "Customer ID: $CUSTOMER_ID"

log "Create enquiry"
ENQUIRY=$(curl -s -X POST "$API/enquiries" -H 'Content-Type: application/json' -d '{"customerId":"'$CUSTOMER_ID'","description":"PO Flow Enquiry","source":"Email"}')
ENQUIRY_ID=$(echo "$ENQUIRY" | $JQ '.id')
[[ "$ENQUIRY_ID" == null ]] && fail "Enquiry creation failed: $ENQUIRY"

echo "Enquiry ID: $ENQUIRY_ID"

log "Generate quotation from enquiry"
QUOTE=$(curl -s -X POST "$API/quotations/generate/$ENQUIRY_ID" -H 'Content-Type: application/json' -d '{"userId":"00000000-0000-0000-0000-000000000001"}')
QUOTATION_ID=$(echo "$QUOTE" | $JQ '.id')
[[ "$QUOTATION_ID" == null ]] && fail "Quotation generation failed: $QUOTE"

echo "Quotation ID: $QUOTATION_ID"

log "Add quotation item"
ITEM=$(curl -s -X POST "$API/quotations/$QUOTATION_ID/items" -H 'Content-Type: application/json' -d '{"description":"Test Item","quantity":10,"unitPrice":5.25}')
ITEM_ID=$(echo "$ITEM" | $JQ '.id')
[[ "$ITEM_ID" == null ]] && fail "Quotation item creation failed: $ITEM"

echo "Item ID: $ITEM_ID"

log "Approve quotation (simulate direct status update if needed)"
# Attempt approval route first; fallback to patching quotation if approval API not ready
if curl -s -X POST "$API/quotations/$QUOTATION_ID/approve" -H 'Content-Type: application/json' -d '{"approverLevel":"SalesManager"}' | grep -q 'Approved'; then
  echo "Approval endpoint used.";
else
  echo "Approval endpoint fallback: updating quotation status directly.";
  curl -s -X PUT "$API/quotations/$QUOTATION_ID" -H 'Content-Type: application/json' -d '{"status":"Approved"}' >/dev/null
fi

log "Attempt PO creation BEFORE acceptance (expect 400)"
CREATE_PO_RESP_CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$API/purchase-orders" -H 'Content-Type: application/json' -d '{"quotationId":"'$QUOTATION_ID'","poNumber":"PRE-ACCEPT","poDate":"2025-01-01T00:00:00.000Z","documentPath":"/tmp/pre.pdf","documentName":"pre.pdf","documentType":"PDF","uploadedBy":"'$USER_ID'"}')
[[ "$CREATE_PO_RESP_CODE" == 201 ]] && fail "PO should NOT be creatable before acceptance"
echo "Got expected non-201 response: $CREATE_PO_RESP_CODE"

log "Create customer acceptance (Active)"
ACCEPTANCE=$(curl -s -X POST "$API/customer-acceptances" -H 'Content-Type: application/json' -d '{"quotationId":"'$QUOTATION_ID'","status":"Active","acceptanceType":"Full","acceptedBy":"Test Contact"}')
ACCEPTANCE_ID=$(echo "$ACCEPTANCE" | $JQ '.id')
[[ "$ACCEPTANCE_ID" == null ]] && fail "Customer acceptance creation failed: $ACCEPTANCE"

echo "Acceptance ID: $ACCEPTANCE_ID"

log "Create item acceptance (isAccepted:true)"
ITEM_ACC=$(curl -s -X POST "$API/customer-acceptances/$ACCEPTANCE_ID/item-acceptances" -H 'Content-Type: application/json' -d '{"quotationItemId":"'$ITEM_ID'","isAccepted":true,"originalQuantity":10,"acceptedQuantity":10}')
ITEM_ACC_ID=$(echo "$ITEM_ACC" | $JQ '.id')
[[ "$ITEM_ACC_ID" == null ]] && fail "Item acceptance failed: $ITEM_ACC"

echo "Item Acceptance ID: $ITEM_ACC_ID"

log "Mark quotation Accepted (simulate customer acceptance completion)"
curl -s -X PUT "$API/quotations/$QUOTATION_ID" -H 'Content-Type: application/json' -d '{"status":"Accepted"}' >/dev/null

log "Create Purchase Order (should succeed now)"
PO=$(curl -s -X POST "$API/purchase-orders" -H 'Content-Type: application/json' -d '{"quotationId":"'$QUOTATION_ID'","poNumber":"PO-123","poDate":"2025-01-02T00:00:00.000Z","documentPath":"/docs/po-123.pdf","documentName":"po-123.pdf","documentType":"PDF","uploadedBy":"'$USER_ID'"}')
PO_ID=$(echo "$PO" | $JQ '.id')
[[ "$PO_ID" == null ]] && fail "Purchase order creation failed: $PO"

echo "PO ID: $PO_ID"

log "Upload PO via /api/po-upload (duplicate test)"
PO_UPLOAD=$(curl -s -X POST "$API/po-upload" -H 'Content-Type: application/json' -d '{"quotationId":"'$QUOTATION_ID'","poNumber":"PO-123-UP","documentPath":"/docs/po-123-up.pdf","documentName":"po-123-up.pdf","documentType":"PDF","uploadedBy":"'$USER_ID'"}')
PO_UPLOAD_ID=$(echo "$PO_UPLOAD" | $JQ '.id')
[[ "$PO_UPLOAD_ID" == null ]] && fail "PO upload endpoint failed: $PO_UPLOAD"

echo "Uploaded PO ID: $PO_UPLOAD_ID"

log "List purchase orders filtered by quotation"
PO_LIST=$(curl -s "$API/purchase-orders?quotationId=$QUOTATION_ID")
COUNT=$(echo "$PO_LIST" | jq 'length')
echo "PO Count for quotation: $COUNT"
[[ $COUNT -lt 2 ]] && fail "Expected at least 2 POs after direct create + upload, got $COUNT"

echo "SUCCESS: Purchase Order upload flow validated."