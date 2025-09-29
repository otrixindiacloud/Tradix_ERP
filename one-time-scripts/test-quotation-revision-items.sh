#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:5000/api"
echo "=== Quotation Revision Item Duplication Test ==="

ensure_server() {
  if ! curl -s -o /dev/null -w '%{http_code}' "$BASE/quotations" | grep -qE '200|404'; then
    echo "Server not responding on $BASE. Start it before running this script." >&2
    exit 1
  fi
}

ensure_server

ts() { date '+%H:%M:%S'; }

fail() { echo "[FAIL] $1"; exit 1; }

json() { jq -r "$1" <<<"$2"; }

echo "[$(ts)] Step 1: Create customer"
CUST_PAYLOAD='{"name":"Rev Test Cust","customerType":"Retail","classification":"Corporate"}'
CUSTOMER_RESP=$(curl -s -X POST "$BASE/customers" -H 'Content-Type: application/json' -d "$CUST_PAYLOAD")
CUSTOMER_ID=$(json .id "$CUSTOMER_RESP")
[[ "$CUSTOMER_ID" != null ]] || fail "Customer creation failed: $CUSTOMER_RESP"

echo "[$(ts)] Step 2: Create enquiry"
ENQ_PAYLOAD=$(jq -n --arg cid "$CUSTOMER_ID" '{customerId:$cid,source:"Email",notes:"Revision base test"}')
ENQ_RESP=$(curl -s -X POST "$BASE/enquiries" -H 'Content-Type: application/json' -d "$ENQ_PAYLOAD")
ENQ_ID=$(json .id "$ENQ_RESP")
[[ "$ENQ_ID" != null ]] || fail "Enquiry creation failed: $ENQ_RESP"

echo "[$(ts)] Step 3: Add enquiry item"
EI_PAYLOAD=$(jq -n --arg eid "$ENQ_ID" '{enquiryId:$eid,description:"Promo Pen",quantity:10,unitPrice:"5.00"}')
EI_RESP=$(curl -s -X POST "$BASE/enquiry-items" -H 'Content-Type: application/json' -d "$EI_PAYLOAD")
EI_ID=$(json .id "$EI_RESP")
[[ "$EI_ID" != null ]] || fail "Enquiry item creation failed: $EI_RESP"

echo "[$(ts)] Step 4: Generate quotation from enquiry"
QUO_RESP=$(curl -s -X POST "$BASE/quotations/generate/$ENQ_ID" -H 'Content-Type: application/json' -d '{}')
QUO_ID=$(json .id "$QUO_RESP")
[[ "$QUO_ID" != null ]] || fail "Quotation generation failed: $QUO_RESP"

echo "[$(ts)] Step 5: Add manual quotation item"
QITEM_PAYLOAD='{"description":"Notebook","quantity":4,"unitPrice":3.2,"costPrice":2.5,"markup":20}'
QITEM_RESP=$(curl -s -X POST "$BASE/quotations/$QUO_ID/items" -H 'Content-Type: application/json' -d "$QITEM_PAYLOAD")
QITEM_ID=$(json .id "$QITEM_RESP")
[[ "$QITEM_ID" != null ]] || fail "Manual quotation item creation failed: $QITEM_RESP"

echo "[$(ts)] Step 6: Count original quotation items"
ORIG_ITEMS_RESP=$(curl -s "$BASE/quotations/$QUO_ID/items")
ORIG_COUNT=$(jq 'length' <<<"$ORIG_ITEMS_RESP")
[[ $ORIG_COUNT -ge 2 ]] || fail "Expected at least 2 items (auto + manual), got $ORIG_COUNT"

echo "[$(ts)] Step 7: Create revision"
REV_REQ='{"revisionReason":"Price adjustment for bulk"}'
REV_RESP=$(curl -s -X POST "$BASE/quotations/$QUO_ID/revisions" -H 'Content-Type: application/json' -d "$REV_REQ")
REV_ID=$(json .id "$REV_RESP")
[[ "$REV_ID" != null ]] || fail "Revision creation failed: $REV_RESP"

echo "[$(ts)] Step 8: Fetch revision items"
REV_ITEMS_RESP=$(curl -s "$BASE/quotations/$REV_ID/items")
REV_COUNT=$(jq 'length' <<<"$REV_ITEMS_RESP")

echo "Original item count: $ORIG_COUNT"
echo "Revision item count: $REV_COUNT"

if [[ "$REV_COUNT" -ne "$ORIG_COUNT" ]]; then
  echo "[FAIL] Revision item count mismatch"
  echo "Original Items: $ORIG_ITEMS_RESP" | jq '.'
  echo "Revision Items: $REV_ITEMS_RESP" | jq '.'
  exit 1
fi

echo "[$(ts)] Step 9: Validate field parity (description, quantity, unitPrice, lineTotal)"
MISMATCH=$(jq -n --argjson o "$ORIG_ITEMS_RESP" --argjson r "$REV_ITEMS_RESP" '
  [range(0; $o|length) | select(($o[.]|{d:.description,q:.quantity,u:.unitPrice,l:.lineTotal}) != ($r[.]|{d:.description,q:.quantity,u:.unitPrice,l:.lineTotal}))] | length')

if [[ "$MISMATCH" -ne 0 ]]; then
  echo "[FAIL] Field mismatches detected between original and revision items"
  exit 1
fi

echo "[$(ts)] Step 10: Fetch revision header totals"
REV_HEADER=$(curl -s "$BASE/quotations/$REV_ID" | jq '{revision,subtotal,totalAmount,parentQuotationId}')
echo "Revision header: $REV_HEADER"

echo "[PASS] Quotation revision successfully duplicated items and totals"
exit 0
