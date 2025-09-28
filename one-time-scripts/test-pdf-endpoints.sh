#!/bin/bash
set -e
BASE_URL="http://localhost:5000/api"

printf "=== Unified PDF Endpoints Test ===\n"

# Helper to check header
function check_pdf() {
  local path=$1
  local label=$2
  local tmp=$(mktemp)
  http_code=$(curl -s -w "%{http_code}" -o "$tmp" "$BASE_URL/$path") || http_code=0
  if [ "$http_code" != "200" ]; then
    echo "❌ $label PDF request failed ($http_code)"
    rm -f "$tmp"; return 1
  fi
  head_bytes=$(head -c 4 "$tmp" | xxd -p)
  size=$(stat -c%s "$tmp" 2>/dev/null || stat -f%z "$tmp")
  if [[ $size -lt 500 ]]; then
    echo "⚠️  $label PDF suspiciously small ($size bytes)"
  fi
  if grep -qa '%PDF' "$tmp" || [[ "$head_bytes" == 25504446* ]]; then
    echo "✅ $label looks like a PDF ($size bytes)"
  else
    echo "⚠️  $label file not detected as PDF (size $size)"
  fi
  rm -f "$tmp"
}

# Attempt to find an invoice id
INV_ID=$(curl -s "$BASE_URL/invoices" | jq -r '.[0].id // empty')
if [ -n "$INV_ID" ]; then
  check_pdf "invoices/$INV_ID/pdf" "Invoice"
else
  echo "No invoices found; skipping invoice PDF test"
fi

# Attempt to find a quotation id
QUOTE_ID=$(curl -s "$BASE_URL/quotations" | jq -r '.[0].id // empty')
if [ -n "$QUOTE_ID" ]; then
  check_pdf "quotations/$QUOTE_ID/pdf" "Quotation"
else
  echo "No quotations found; skipping quotation PDF test"
fi

printf "=== PDF Tests Complete ===\n"
