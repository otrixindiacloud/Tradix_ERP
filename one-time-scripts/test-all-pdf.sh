#!/bin/bash
# Comprehensive PDF endpoint validation
set -e
BASE=http://localhost:5000/api

function need_jq(){ if ! command -v jq >/dev/null; then echo "jq required"; exit 1; fi }
need_jq

echo "=== PDF Endpoints Comprehensive Test ==="

# Fetch or create quotation placeholder (non-destructive assumption)
Q_ID=$(curl -s $BASE/quotations | jq -r '.[0].id // empty')
if [ -z "$Q_ID" ]; then
  echo "No quotations available; skipping quotation PDF test (seeding flow not implemented here)."
else
  echo "Testing quotation PDF ($Q_ID)";
  curl -s -D /tmp/q.h -o /tmp/q.pdf $BASE/quotations/$Q_ID/pdf -w 'HTTP:%{http_code}\n' | tee /tmp/q.status
  if grep -q 'HTTP:200' /tmp/q.status; then
    size=$(stat -c%s /tmp/q.pdf); echo "Quotation PDF size: $size";
    head -c4 /tmp/q.pdf | xxd -p
  else echo "Quotation PDF failed"; fi
fi

INV_ID=$(curl -s $BASE/invoices | jq -r '.[0].id // empty')
if [ -z "$INV_ID" ]; then
  echo "No invoices available; skipping invoice PDF test."
else
  echo "Testing invoice PDF ($INV_ID)";
  curl -s -D /tmp/i.h -o /tmp/i.pdf $BASE/invoices/$INV_ID/pdf -w 'HTTP:%{http_code}\n' | tee /tmp/i.status
  if grep -q 'HTTP:200' /tmp/i.status; then
    size=$(stat -c%s /tmp/i.pdf); echo "Invoice PDF size: $size";
    head -c4 /tmp/i.pdf | xxd -p
  else echo "Invoice PDF failed"; fi
fi

echo "=== Done ==="