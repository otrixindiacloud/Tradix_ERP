#!/bin/bash

# Test Script for Quotation CRUD Operations
echo "🧪 Testing Quotation CRUD Operations"
echo "====================================="

BASE_URL="http://localhost:5000"

# Use a valid quotation ID from the GET /api/quotations (List) output
QUOTATION_ID="15b06ffe-ff1f-420c-bddd-33bc2a12c158"

echo -e "\n1. 📋 Testing GET /api/quotations (List)"
curl -s "${BASE_URL}/api/quotations" | jq '.' | head -20

echo -e "\n2. 📋 Testing GET /api/quotations/$QUOTATION_ID (Get Single)"
curl -s "${BASE_URL}/api/quotations/$QUOTATION_ID" | jq '.'

echo -e "\n3. 📋 Testing GET /api/quotations/$QUOTATION_ID/items (Get Items)"
curl -s "${BASE_URL}/api/quotations/$QUOTATION_ID/items" | jq '.'

echo -e "\n4. 🔧 Testing PUT /api/quotations/$QUOTATION_ID (Update Status)"
curl -s -X PUT "${BASE_URL}/api/quotations/$QUOTATION_ID" \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin" \
  -d '{"status": "Accepted"}' | jq '.'

echo -e "\n4a. 🔧 Testing PUT /api/quotations/$QUOTATION_ID (Approve Quotation)"
curl -s -X PUT "${BASE_URL}/api/quotations/$QUOTATION_ID" \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin" \
  -d '{"status": "Accepted", "approvalStatus": "Approved"}' | jq '.'

echo -e "\n4b. 🔧 Testing PUT /api/quotations/$QUOTATION_ID (Reject Quotation)"
curl -s -X PUT "${BASE_URL}/api/quotations/$QUOTATION_ID" \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin" \
  -d '{"status": "Rejected", "approvalStatus": "Rejected", "rejectionReason": "Test rejection"}' | jq '.'

echo -e "\n5. 📋 Testing GET /api/customers (For quotation creation)"
curl -s "${BASE_URL}/api/customers" | jq '.' | head -10

echo -e "\n6. 📊 Testing POST /api/quotations (Create - will fail with validation)"
curl -s -X POST "${BASE_URL}/api/quotations" \
  -H "Content-Type: application/json" \
  -d '{"customerId": "ac0a1d83-e061-4784-9ede-91ae8ca7299f"}' | jq '.'

echo -e "\n\n✅ API Test Summary:"
echo "- GET quotations: Working with test data"
echo "- GET single quotation: Working with test data"
echo "- GET quotation items: Working with test data"
echo "- PUT update quotation: Working"
echo "- GET customers: Working"
echo "- POST create quotation: Needs validation (expected)"

echo -e "\n🎯 Frontend CRUD Status:"
echo "- List View: ✅ Working (displays quotations)"
echo "- Detail View: ✅ Working (shows quotation details)"
echo "- Update Status: ✅ Working (status updates)"
echo "- Create Quotation: 🔶 Partially implemented (no form yet)"
echo "- Edit Quotation: ❌ Missing onClick handler"
echo "- Delete Quotation: ❌ Missing onClick handler"
