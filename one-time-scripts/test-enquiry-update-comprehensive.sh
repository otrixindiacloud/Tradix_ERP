#!/bin/bash

echo "Testing Enquiry Update with various customerId values..."

# Test with the development server running
BASE_URL="http://localhost:5000"

# First, get an existing enquiry to update
echo "1. Getting existing enquiries..."
ENQUIRIES=$(curl -s -X GET "$BASE_URL/api/enquiries")
ENQUIRY_ID=$(echo $ENQUIRIES | jq -r '.[0].id // empty')

if [ -z "$ENQUIRY_ID" ]; then
    echo "No enquiries found. Creating one first..."
    
    # Get a valid customer ID first
    CUSTOMERS=$(curl -s -X GET "$BASE_URL/api/customers")
    CUSTOMER_ID=$(echo $CUSTOMERS | jq -r '.[0].id // empty')
    
    if [ -z "$CUSTOMER_ID" ]; then
        echo "No customers found. Cannot proceed with test."
        exit 1
    fi
    
    # Create a test enquiry
    RESULT=$(curl -s -X POST "$BASE_URL/api/enquiries" \
        -H "Content-Type: application/json" \
        -d "{
            \"customerId\": \"$CUSTOMER_ID\",
            \"source\": \"Email\",
            \"status\": \"New\",
            \"notes\": \"Test enquiry for debugging\"
        }")
    
    ENQUIRY_ID=$(echo $RESULT | jq -r '.id // empty')
    echo "Created enquiry with ID: $ENQUIRY_ID"
fi

if [ -n "$ENQUIRY_ID" ]; then
    echo -e "\n2. Testing various update scenarios with enquiry ID: $ENQUIRY_ID"
    
    echo -e "\nTest A: Update with empty string customerId (should be handled gracefully)"
    curl -s -X PUT "$BASE_URL/api/enquiries/$ENQUIRY_ID" \
        -H "Content-Type: application/json" \
        -d '{
            "customerId": "",
            "notes": "Updated with empty customerId"
        }' | jq '.'
    
    echo -e "\nTest B: Update with null customerId"
    curl -s -X PUT "$BASE_URL/api/enquiries/$ENQUIRY_ID" \
        -H "Content-Type: application/json" \
        -d '{
            "customerId": null,
            "notes": "Updated with null customerId"
        }' | jq '.'
    
    echo -e "\nTest C: Update with invalid UUID format"
    curl -s -X PUT "$BASE_URL/api/enquiries/$ENQUIRY_ID" \
        -H "Content-Type: application/json" \
        -d '{
            "customerId": "invalid-uuid-format",
            "notes": "Updated with invalid UUID"
        }' | jq '.'
    
    echo -e "\nTest D: Update with just notes (no customerId field)"
    curl -s -X PUT "$BASE_URL/api/enquiries/$ENQUIRY_ID" \
        -H "Content-Type: application/json" \
        -d '{
            "notes": "Updated without customerId field"
        }' | jq '.'
    
    echo -e "\nTest E: Update with valid UUID"
    CUSTOMERS=$(curl -s -X GET "$BASE_URL/api/customers")
    VALID_CUSTOMER_ID=$(echo $CUSTOMERS | jq -r '.[0].id // empty')
    
    if [ -n "$VALID_CUSTOMER_ID" ]; then
        curl -s -X PUT "$BASE_URL/api/enquiries/$ENQUIRY_ID" \
            -H "Content-Type: application/json" \
            -d "{
                \"customerId\": \"$VALID_CUSTOMER_ID\",
                \"notes\": \"Updated with valid customerId\"
            }" | jq '.'
    fi
    
else
    echo "Could not get or create enquiry for testing"
fi

echo -e "\nTesting complete."