#!/bin/bash

# Test enquiry update functionality to reproduce the 400 error
echo "Testing Enquiry Update API..."

# First, get existing enquiries to see what data exists
echo "1. Getting existing enquiries..."
curl -s -X GET "http://localhost:5000/api/enquiries" | jq '.[0:2]' || echo "No enquiries found or server not running"

echo -e "\n2. Getting specific enquiry (enq-1)..."
curl -s -X GET "http://localhost:5000/api/enquiries/enq-1" | jq '.' || echo "Enquiry enq-1 not found"

# Get first enquiry from the list to use its ID
echo -e "\n3. Getting first enquiry ID for testing..."
ENQUIRY_ID=$(curl -s -X GET "http://localhost:5000/api/enquiries" | jq -r '.[0].id // empty')

if [ -z "$ENQUIRY_ID" ]; then
    echo "No enquiries found. Let's create one first..."
    
    # Create a test enquiry first
    echo "Creating test enquiry..."
    curl -s -X POST "http://localhost:5000/api/enquiries" \
    -H "Content-Type: application/json" \
    -d '{
        "customerId": "6ddeb5e1-51d9-4b50-8c27-441659d87e9d",
        "source": "Email",
        "status": "New",
        "notes": "Test enquiry for debugging"
    }' | jq '.'
    
    # Get the newly created enquiry ID
    ENQUIRY_ID=$(curl -s -X GET "http://localhost:5000/api/enquiries" | jq -r '.[0].id // empty')
fi

if [ -n "$ENQUIRY_ID" ]; then
    echo -e "\n4. Testing update on enquiry ID: $ENQUIRY_ID"
    
    # Test various update scenarios
    echo "Test 1: Valid update with status change"
    curl -s -X PUT "http://localhost:5000/api/enquiries/$ENQUIRY_ID" \
    -H "Content-Type: application/json" \
    -d '{
        "status": "In Progress",
        "notes": "Updated via API test"
    }' | jq '.'
    
    echo -e "\nTest 2: Update with invalid status"
    curl -s -X PUT "http://localhost:5000/api/enquiries/$ENQUIRY_ID" \
    -H "Content-Type: application/json" \
    -d '{
        "status": "Invalid Status"
    }' | jq '.'
    
    echo -e "\nTest 3: Update with invalid date format"
    curl -s -X PUT "http://localhost:5000/api/enquiries/$ENQUIRY_ID" \
    -H "Content-Type: application/json" \
    -d '{
        "targetDeliveryDate": "invalid-date"
    }' | jq '.'
    
    echo -e "\nTest 4: Update with invalid UUID"
    curl -s -X PUT "http://localhost:5000/api/enquiries/$ENQUIRY_ID" \
    -H "Content-Type: application/json" \
    -d '{
        "customerId": "invalid-uuid"
    }' | jq '.'
    
else
    echo "Could not get enquiry ID for testing"
fi

echo -e "\nTesting complete."