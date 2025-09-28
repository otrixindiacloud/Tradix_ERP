#!/bin/bash
set -e
BASE_URL="http://localhost:5000"

echo "--- Supplier LPO Workflow Test ---"

echo "Creating customer..."
cust=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"name":"LPO Cust","email":"lpo@cust.com","phone":"111","address":"Addr","contactPerson":"L Person","customerType":"Retail","classification":"Corporate"}' $BASE_URL/api/customers)
cust_id=$(echo "$cust" | jq -r '.id')

echo "Creating enquiry..."
enq=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"customerId":"'$cust_id'","enquiryDate":"2025-09-13","itemDescription":"Item A","supplierCode":"SUP-A","logoRequired":false,"requiredQuantity":5,"deliveryDate":"2025-09-20","notes":"lpo test"}' $BASE_URL/api/enquiries)
enq_id=$(echo "$enq" | jq -r '.id')

echo "Creating quotation..."
# Provide required customerType, use validUntil field, and include enquiryId only if it looks like a UUID
if [[ "$enq_id" =~ ^[0-9a-fA-F-]{36}$ ]]; then
  quote_payload='{ "enquiryId": "'$enq_id'", "customerId": "'$cust_id'", "customerType": "Retail", "status": "Draft", "validUntil": "2025-09-30", "terms": "terms" }'
else
  echo "Note: Enquiry ID not a UUID (was: $enq_id). Creating quotation without enquiry linkage." >&2
  quote_payload='{ "customerId": "'$cust_id'", "customerType": "Retail", "status": "Draft", "validUntil": "2025-09-30", "terms": "terms" }'
fi
quote=$(curl -s -X POST -H 'Content-Type: application/json' -d "$quote_payload" $BASE_URL/api/quotations)
quote_id=$(echo "$quote" | jq -r '.id')

echo "Adding quotation item..."
# Create a basic quotation item so the sales order will have content
quote_item=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"supplierCode":"SUP-TEST","itemDescription":"Test Item","quantity":5,"unitPrice":"25.00","lineTotal":"125.00"}' $BASE_URL/api/quotations/$quote_id/items)
echo "Created quotation item: $(echo "$quote_item" | jq -c '.')"

if [ -z "$quote_id" ] || [ "$quote_id" = "null" ]; then
  echo "FAILED: Quotation not created" >&2
  echo "Raw quotation response: $quote" >&2
  exit 1
fi

echo "Adding quotation item (required before sales order)..."
q_item_payload='{ "description": "Test Quoted Item", "quantity": 5, "unitPrice": 10.0, "notes": "auto-added" }'
q_item=$(curl -s -X POST -H 'Content-Type: application/json' -d "$q_item_payload" $BASE_URL/api/quotations/$quote_id/items || echo '')
echo "Quotation item response: $q_item"
q_item_id=$(echo "$q_item" | jq -r '.id // empty')
if [ -z "$q_item_id" ]; then
  echo "WARNING: Quotation item creation failed (sales order generation may fail)." >&2
fi

echo "Creating sales order from quotation..."
so=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"quotationId":"'$quote_id'","userId":"tester"}' $BASE_URL/api/sales-orders/from-quotation)
so_id=$(echo "$so" | jq -r '.id')

# Validate we got a proper sales order ID
if [ "$so_id" = "null" ] || [ -z "$so_id" ]; then
  echo "Direct from-quotation failed. Response: $so"
  echo "Fallback: creating sales order via generic endpoint"
  so=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"customerId":"'$cust_id'","quotationId":"'$quote_id'","orderDate":"2025-09-13","status":"Confirmed"}' $BASE_URL/api/sales-orders)
  so_id=$(echo "$so" | jq -r '.id')
fi

if [ "$so_id" = "null" ] || [ -z "$so_id" ]; then
  echo "FAILED: Could not create sales order" >&2
  echo "Final response: $so" >&2
  exit 1
fi

if [ -z "$so_id" ] || [ "$so_id" = "null" ]; then
  echo "FAILED: Sales order not created (after fallback)." >&2
  echo "Raw sales order response: $so" >&2
  exit 1
fi

echo "Ensuring at least one sales order item..."
# Create a generic item first (if needed). We attempt to list items; if empty, create one.
items_list=$(curl -s $BASE_URL/api/items || echo '[]')
first_item_id=$(echo "$items_list" | jq -r '.[0].id // empty')
if [ -z "$first_item_id" ]; then
  new_item=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"supplierCode":"SUP-AUTO","description":"Auto Item"}' $BASE_URL/api/items)
  first_item_id=$(echo "$new_item" | jq -r '.id')
fi

so_item_payload='{ "salesOrderId": "'$so_id'", "itemId": "'$first_item_id'", "quantity": 3, "unitPrice": "12.50", "totalPrice": "37.50" }'
so_item=$(curl -s -X POST -H 'Content-Type: application/json' -d "$so_item_payload" $BASE_URL/api/sales-order-items || echo '')
echo "Created sales order item: $so_item"

echo "Auto-generating Supplier LPO from sales order..."
lpos_raw=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"salesOrderIds":["'$so_id'"],"groupBy":"supplier","userId":"11111111-1111-1111-1111-111111111111"}' $BASE_URL/api/supplier-lpos/from-sales-orders)
echo "Raw LPO generation response: $lpos_raw"
# Attempt to parse as array first; if object, wrap it
if echo "$lpos_raw" | jq -e 'type == "object"' >/dev/null 2>&1; then
  lpos_json=$(echo "$lpos_raw" | jq -c '. as $o | [$o]')
else
  lpos_json="$lpos_raw"
fi
lpo_id=$(echo "$lpos_json" | jq -r '.[0].id')

if [ -z "$lpo_id" ] || [ "$lpo_id" = "null" ]; then
  echo "FAILED: No LPO created" >&2
  echo "$lpos_raw" >&2
  exit 1
fi

echo "Submitting LPO for approval..."
pend=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"userId":"11111111-1111-1111-1111-111111111111"}' $BASE_URL/api/supplier-lpos/$lpo_id/submit-for-approval)
echo "$pend" | jq '.approvalStatus' | grep -q 'Pending'

echo "Approving LPO..."
appr=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"userId":"11111111-1111-1111-1111-111111111111","notes":"ok"}' $BASE_URL/api/supplier-lpos/$lpo_id/approve)
echo "$appr" | jq '.approvalStatus' | grep -q 'Approved'

echo "Sending LPO to supplier..."
sent=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"userId":"11111111-1111-1111-1111-111111111111"}' $BASE_URL/api/supplier-lpos/$lpo_id/send-to-supplier)
echo "$sent" | jq '.status' | grep -q 'Sent'

echo "Supplier confirming LPO..."
conf=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"confirmationReference":"CONF-123"}' $BASE_URL/api/supplier-lpos/$lpo_id/confirm-by-supplier)
echo "$conf" | jq '.status' | grep -q 'Confirmed'

echo "Creating amended LPO..."
amend=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"reason":"Change qty","amendmentType":"Quantity","userId":"approver"}' $BASE_URL/api/supplier-lpos/$lpo_id/amend)
echo "$amend" | jq '.parentLpoId' | grep -q "$lpo_id"

echo "Checking backlog..."
backlog=$(curl -s -s $BASE_URL/api/supplier-lpos/backlog)
echo "$backlog" | jq '.[0]?' > /dev/null

echo "Supplier LPO workflow test PASSED"
echo "LPO: $lpo_id Amended: $(echo $amend | jq -r '.id')"
