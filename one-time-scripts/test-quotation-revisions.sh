#!/bin/bash

echo "Testing Quotation Revision Functionality"
echo "========================================"

# Base URL
BASE_URL="http://localhost:5000"

echo "1. Testing Get All Quotations..."
echo "GET $BASE_URL/api/quotations"
curl -s -X GET "$BASE_URL/api/quotations" | jq '.[:2]' || echo "Failed to get quotations"

echo -e "\n\n2. Testing Quotation Revision Creation..."
# First, we need to get a quotation ID
QUOTATION_ID=$(curl -s -X GET "$BASE_URL/api/quotations" | jq -r '.[0].id // empty')

if [ -n "$QUOTATION_ID" ]; then
    echo "Using quotation ID: $QUOTATION_ID"
    echo "POST $BASE_URL/api/quotations/$QUOTATION_ID/revisions"
    
    curl -s -X POST "$BASE_URL/api/quotations/$QUOTATION_ID/revisions" \
        -H "Content-Type: application/json" \
        -d '{
            "revisionReason": "Customer requested price changes",
            "userId": "test-user-id"
        }' | jq '.' || echo "Failed to create revision"
    
    echo -e "\n\n3. Testing Get Quotation Revisions..."
    echo "GET $BASE_URL/api/quotations/$QUOTATION_ID/revisions"
    curl -s -X GET "$BASE_URL/api/quotations/$QUOTATION_ID/revisions" | jq '.' || echo "Failed to get revisions"
    
    echo -e "\n\n4. Testing Get Quotation History..."
    echo "GET $BASE_URL/api/quotations/$QUOTATION_ID/history"
    curl -s -X GET "$BASE_URL/api/quotations/$QUOTATION_ID/history" | jq '.' || echo "Failed to get history"
else
    echo "No quotations found to test with"
fi

echo -e "\n\n5. Testing Database Schema..."
echo "Checking if revision fields exist in database..."
# This will help us understand if our schema changes were applied
