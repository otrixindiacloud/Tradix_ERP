#!/usr/bin/env bash
set -euo pipefail
BASE=${BASE_URL:-http://localhost:5000/api}
ITEM_NAME="Integrity Test Item"

echo "[1] Create inventory item"
ITEM_ID=$(curl -s -X POST "$BASE/inventory-items" -H 'Content-Type: application/json' -d '{"name":"'$ITEM_NAME'","supplierCode":"ITM-INT-1","barcode":"BC-INT-1","category":"General","unitOfMeasure":"EA","costPrice":"10","retailMarkupPercent":20,"wholesaleMarkupPercent":10}' | jq -r '.id')
[[ "$ITEM_ID" == null || -z "$ITEM_ID" ]] && echo "Failed to create item" && exit 1

echo "[2] Receive stock via adjustment (qty +50)"
ADJ1=$(curl -s -X POST "$BASE/inventory-levels/adjust" -H 'Content-Type: application/json' -d '{"itemId":"'$ITEM_ID'","quantityChange":50,"reason":"Initial load"}')
BEFORE_AFTER1=$(echo "$ADJ1" | jq -r '.movement.quantityBefore, .movement.quantityAfter')

echo "[3] Goods receipt header + item (qty 30)"
SUPPLIER_ID=$(curl -s "$BASE/suppliers" | jq -r '.[0].id')
if [[ -z "$SUPPLIER_ID" || "$SUPPLIER_ID" == null ]]; then
  echo "No supplier available; skipping goods receipt test"; exit 0
fi
HEADER=$(curl -s -X POST "$BASE/goods-receipt-headers" -H 'Content-Type: application/json' -d '{"supplierId":"'$SUPPLIER_ID'","receiptNumber":"GRN-INT-'$(date +%s)'","receiptDate":"'$(date +%F)'","status":"Draft"}')
HEADER_ID=$(echo "$HEADER" | jq -r '.id')
ITEM=$(curl -s -X POST "$BASE/goods-receipt-items" -H 'Content-Type: application/json' -d '{"receiptHeaderId":"'$HEADER_ID'","itemId":"'$ITEM_ID'","itemDescription":"Test","quantityExpected":30,"quantityReceived":30}')

# Final level fetch
LEVELS=$(curl -s "$BASE/inventory-levels?itemId=$ITEM_ID")
QTY=$(echo "$LEVELS" | jq -r '.[0].quantityAvailable')

echo "Final quantityAvailable: $QTY (expected 80)"
if [[ "$QTY" != "80" ]]; then
  echo "Integrity test FAILED"; exit 1; fi

echo "Integrity test PASSED"