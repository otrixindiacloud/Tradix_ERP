#!/usr/bin/env bash
set -euo pipefail

API=${API_BASE:-http://localhost:5000/api}
JQ=${JQ_BIN:-jq}
GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'

log() { echo -e "${GREEN}[$(date +%H:%M:%S)]${NC} $*"; }
warn() { echo -e "${YELLOW}[$(date +%H:%M:%S)] WARN:${NC} $*"; }
fail() { echo -e "${RED}[$(date +%H:%M:%S)] FAIL:${NC} $*" >&2; exit 1; }

require() { command -v "$1" >/dev/null 2>&1 || fail "Required tool '$1' not found"; }
require curl
require jq

log "1. Create customer"
CUST=$(curl -s -X POST "$API/customers" -H 'Content-Type: application/json' -d '{"name":"QA Approval Cust","customerType":"Retail","classification":"Corporate"}')
CUST_ID=$(echo "$CUST" | $JQ -r '.id')
[[ $CUST_ID == null ]] && fail "Customer creation failed: $CUST"

log "2. Create enquiry"
ENQ=$(curl -s -X POST "$API/enquiries" -H 'Content-Type: application/json' -d '{"customerId":"'$CUST_ID'","source":"Email","notes":"Approval flow test"}')
ENQ_ID=$(echo "$ENQ" | $JQ -r '.id')
[[ $ENQ_ID == null ]] && fail "Enquiry creation failed: $ENQ"

log "3. Add enquiry item"
EITEM=$(curl -s -X POST "$API/enquiry-items" -H 'Content-Type: application/json' -d '{"enquiryId":"'$ENQ_ID'","description":"Premium Banner","quantity":10,"unitPrice":"55.00"}')
EITEM_ID=$(echo "$EITEM" | $JQ -r '.id')
[[ $EITEM_ID == null ]] && fail "Enquiry item creation failed: $EITEM"

log "4. Generate quotation from enquiry"
QUO=$(curl -s -X POST "$API/quotations/generate/$ENQ_ID" -H 'Content-Type: application/json' -d '{}')
QUO_ID=$(echo "$QUO" | $JQ -r '.id')
[[ $QUO_ID == null ]] && fail "Quotation generation failed: $QUO"
APPROVAL_STATUS=$(echo "$QUO" | $JQ -r '.approvalStatus')
REQ_LEVEL=$(echo "$QUO" | $JQ -r '.requiredApprovalLevel')

log "Generated quotation $QUO_ID approvalStatus=$APPROVAL_STATUS requiredApprovalLevel=${REQ_LEVEL:-none}"

# If still Draft totals may not yet reflect items - fetch items
Q_ITEMS=$(curl -s "$API/quotations/$QUO_ID/items")
ITEM_COUNT=$(echo "$Q_ITEMS" | $JQ 'length')
[[ $ITEM_COUNT -lt 1 ]] && fail "Quotation has no items (expected at least 1)"

# If approval required, approve
if [[ "$APPROVAL_STATUS" == "Pending" ]]; then
  log "5. Approve quotation (status was Pending)"
  UPDATED=$(curl -s -X PUT "$API/quotations/$QUO_ID" -H 'Content-Type: application/json' -d '{"approvalStatus":"Approved"}')
  APPROVAL_STATUS=$(echo "$UPDATED" | $JQ -r '.approvalStatus')
  [[ "$APPROVAL_STATUS" != "Approved" ]] && fail "Approval update failed: $UPDATED"
else
  log "5. Skipping approval (status=$APPROVAL_STATUS)"
fi

log "6. Mark quotation Sent"
SENT=$(curl -s -X PUT "$API/quotations/$QUO_ID" -H 'Content-Type: application/json' -d '{"status":"Sent"}')
[[ $(echo "$SENT" | $JQ -r '.status') != "Sent" ]] && fail "Failed to mark Sent: $SENT"

log "7. Create customer acceptance header (Full acceptance)"
ACPT=$(curl -s -X POST "$API/customer-acceptances" -H 'Content-Type: application/json' -d '{"quotationId":"'$QUO_ID'","status":"Active","acceptanceType":"Full","acceptedBy":"Test Contact","customerEmail":"contact@example.com"}')
ACPT_ID=$(echo "$ACPT" | $JQ -r '.id')
[[ $ACPT_ID == null ]] && fail "Acceptance creation failed: $ACPT"
echo "DEBUG Acceptance Response: $ACPT" >&2

log "8. Bulk accept all quotation items"
# Build bulk payload dynamically (accept everything)
echo "DEBUG Quotation Items: $Q_ITEMS" >&2
BULK_PAYLOAD=$(echo "$Q_ITEMS" | $JQ --arg ACCEPT_ID "$ACPT_ID" '[ .[] | { quotationItemId: .id, isAccepted: true, originalQuantity: .quantity, acceptedQuantity: .quantity } ]')
echo "DEBUG Bulk Payload: $BULK_PAYLOAD" >&2
BULK_RESP=$(curl -s -X POST "$API/customer-acceptances/$ACPT_ID/item-acceptances/bulk" -H 'Content-Type: application/json' -d "$BULK_PAYLOAD")
BULK_COUNT=$(echo "$BULK_RESP" | $JQ 'length')
[[ $BULK_COUNT -ne $ITEM_COUNT ]] && fail "Item acceptance count mismatch (expected $ITEM_COUNT got $BULK_COUNT)"

log "9. Mark quotation Accepted"
ACCEPTED=$(curl -s -X PUT "$API/quotations/$QUO_ID" -H 'Content-Type: application/json' -d '{"status":"Accepted"}')
[[ $(echo "$ACCEPTED" | $JQ -r '.status') != "Accepted" ]] && fail "Failed to mark Accepted: $ACCEPTED"

log "10. Workflow validation (acceptance -> po-upload should now be allowed)"
WF=$(curl -s "$API/workflow/validate/po-upload/$QUO_ID")
CAN_PROCEED=$(echo "$WF" | $JQ -r '.canProceed')
[[ "$CAN_PROCEED" != "true" ]] && warn "Workflow did not allow next step yet: $WF" || log "Workflow progression OK"

log "SUMMARY" 
echo "Quotation: $QUO_ID" 
echo "Approval Status: $APPROVAL_STATUS" 
echo "Items: $ITEM_COUNT, Accepted: $BULK_COUNT" 
echo "Customer Acceptance: $ACPT_ID" 

log "SUCCESS: Quotation approval & acceptance flow validated"
