#!/usr/bin/env bash
set -euo pipefail
API="http://localhost:5000/api"

echo "[TEST] Customer PO Upload Fallback"

# 1. Pick an accepted quotation (or just first accepted)
QUO_JSON=$(curl -s "$API/quotations")
QUOTATION_ID=$(echo "$QUO_JSON" | jq -r '[.[] | select(.status=="Accepted")][0].id // empty')
if [ -z "$QUOTATION_ID" ]; then
  echo "No accepted quotation found; cannot test upload." >&2
  exit 0
fi

echo "Using quotation: $QUOTATION_ID"

# 2. Attempt upload WITHOUT uploadedBy to trigger server fallback
PAYLOAD=$(jq -n --arg q "$QUOTATION_ID" --arg pn "PO-TEST-$(date +%s)" '{quotationId:$q,poNumber:$pn,documentPath:"/uploads/test.pdf",documentName:"test.pdf",documentType:"PDF"}')

RESP=$(curl -s -w "\n%{http_code}" -H 'Content-Type: application/json' -X POST "$API/customer-po-upload" -d "$PAYLOAD")
BODY=$(echo "$RESP" | head -n1)
CODE=$(echo "$RESP" | tail -n1)

echo "Response code: $CODE"
echo "$BODY" | jq . || echo "$BODY"

if [ "$CODE" != "201" ]; then
  echo "Upload failed (expected 201)." >&2
  exit 1
fi

UPLOADED_BY=$(echo "$BODY" | jq -r '.uploadedBy // empty')
if [ -z "$UPLOADED_BY" ]; then
  echo "Missing uploadedBy in response (unexpected)." >&2
  exit 1
fi

echo "Success. uploadedBy resolved to: $UPLOADED_BY"
