#!/bin/bash

# Test Customer Management CRUD Operations
echo "Testing Customer Management CRUD Operations..."

BASE_URL="http://localhost:5000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test HTTP endpoint
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "Method: $method"
    echo "URL: $url"
    
    if [ -n "$data" ]; then
        echo "Data: $data"
        response=$(curl -s -w "%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$url")
    else
        response=$(curl -s -w "%{http_code}" -X $method "$url")
    fi
    
    # Extract status code (last 3 characters)
    status_code="${response: -3}"
    body="${response%???}"
    
    echo "Status Code: $status_code"
    echo "Response: $body"
    
    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        return 0
    else
        echo -e "${RED}✗ FAIL - Expected $expected_status, got $status_code${NC}"
        return 1
    fi
}

# Check if server is running
echo "Checking if server is running..."
if ! curl -s "$BASE_URL/api/customers" > /dev/null; then
    echo -e "${RED}Server is not running on $BASE_URL${NC}"
    echo "Please start the server with: npm run dev"
    exit 1
fi

echo -e "${GREEN}Server is running!${NC}"

# Test 1: Get all customers (should work even if empty)
test_endpoint "GET" "$BASE_URL/api/customers" "" 200 "Get all customers"

# Test 2: Get customer stats
test_endpoint "GET" "$BASE_URL/api/customers/stats" "" 200 "Get customer statistics"

# Test 3: Create a new customer
customer_data='{
    "name": "Test Customer Ltd",
    "email": "test@testcustomer.com",
    "phone": "+971501234567",
    "address": "123 Test Street, Dubai, UAE",
    "customerType": "Wholesale",
    "classification": "Corporate",
    "taxId": "123456789",
    "creditLimit": "50000.00",
    "paymentTerms": "Net 30"
}'

test_endpoint "POST" "$BASE_URL/api/customers" "$customer_data" 201 "Create new customer"

# Store the customer ID from the response for subsequent tests
if [ $? -eq 0 ]; then
    customer_id=$(echo "$body" | grep -o '"id":"[^"]*"' | sed 's/"id":"\([^"]*\)"/\1/')
    echo "Created customer with ID: $customer_id"
    
    # Test 4: Get specific customer
    if [ -n "$customer_id" ]; then
        test_endpoint "GET" "$BASE_URL/api/customers/$customer_id" "" 200 "Get specific customer"
        
        # Test 5: Update customer
        update_data='{
            "name": "Updated Test Customer Ltd",
            "creditLimit": "75000.00"
        }'
        test_endpoint "PUT" "$BASE_URL/api/customers/$customer_id" "$update_data" 200 "Update customer"
    else
        echo -e "${RED}Could not extract customer ID from response${NC}"
    fi
else
    echo -e "${RED}Customer creation failed, skipping dependent tests${NC}"
fi

# Test 6: Test validation (should fail with 400)
invalid_data='{
    "name": "",
    "customerType": "InvalidType",
    "classification": "InvalidClassification"
}'
test_endpoint "POST" "$BASE_URL/api/customers" "$invalid_data" 400 "Create customer with invalid data (should fail)"

# Test 7: Get non-existent customer (should return 404)
test_endpoint "GET" "$BASE_URL/api/customers/00000000-0000-0000-0000-000000000000" "" 404 "Get non-existent customer (should fail)"

echo -e "\n${YELLOW}=== Test Summary ===${NC}"
echo "Customer Management API tests completed!"
echo "Check the results above for any failures."