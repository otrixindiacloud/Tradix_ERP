#!/bin/bash
# Test approve/reject API for quotation

set -e

QUOTATION_ID="$1"
API_URL="http://localhost:3000/api/quotations/$QUOTATION_ID"

if [ -z "$QUOTATION_ID" ]; then
  echo "Usage: $0 <quotation_id>"
  exit 1
fi

echo "Testing Approve..."
curl -s -X PUT "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"approvalStatus":"Approved","status":"Approved"}' | jq

echo "Testing Reject..."
curl -s -X PUT "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"approvalStatus":"Rejected","status":"Rejected"}' | jq

echo "Done."
