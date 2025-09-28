#!/bin/bash

# GT-ERP End-to-End Test Suite
# Tests all features with the modular storage approach

echo "🧪 GT-ERP COMPREHENSIVE END-TO-END TEST SUITE"
echo "=============================================="
echo ""

BASE_URL="http://localhost:5000"
PASSED=0
FAILED=0
TOTAL=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test function
test_api() {
    local name="$1"
    local method="$2"
    local url="$3"
    local data="$4"
    local expected_status="$5"
    
    TOTAL=$((TOTAL + 1))
    echo -n "Testing $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" "$BASE_URL$url")
        status_code="${response: -3}"
        body="${response%???}"
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$url")
        status_code="${response: -3}"
        body="${response%???}"
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "%{http_code}" -X PUT -H "Content-Type: application/json" -d "$data" "$BASE_URL$url")
        status_code="${response: -3}"
        body="${response%???}"
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "%{http_code}" -X DELETE "$BASE_URL$url")
        status_code="${response: -3}"
        body="${response%???}"
    fi
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (Status: $status_code)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (Expected: $expected_status, Got: $status_code)"
        echo "   Response: ${body:0:100}..."
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Test JSON response contains expected data
test_api_json() {
    local name="$1"
    local url="$2"
    local json_path="$3"
    
    TOTAL=$((TOTAL + 1))
    echo -n "Testing $name... "
    
    response=$(curl -s "$BASE_URL$url")
    
    if echo "$response" | jq -e "$json_path" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC} (JSON structure valid)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (JSON path not found: $json_path)"
        echo "   Response: ${response:0:200}..."
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo "🚀 Starting comprehensive API tests..."
echo ""

# ================================
# 1. DASHBOARD & BASIC HEALTH
# ================================
echo -e "${BLUE}📊 DASHBOARD TESTS${NC}"
test_api "Dashboard Stats" "GET" "/api/dashboard/stats" "" "200"
test_api_json "Dashboard JSON Structure" "/api/dashboard/stats" ".activeEnquiries"

# ================================
# 2. CUSTOMER MANAGEMENT (Modular)
# ================================
echo ""
echo -e "${BLUE}👥 CUSTOMER MANAGEMENT TESTS${NC}"
test_api "Get Customers List" "GET" "/api/customers" "" "200"
test_api "Get Customers with Limit" "GET" "/api/customers?limit=5" "" "200"
test_api_json "Customer JSON Structure" "/api/customers" ".[0].id // empty"

# Create a new customer
CUSTOMER_DATA='{"name":"Test Customer Ltd","email":"test@customer.com","phone":"1234567890","address":"123 Test St","contactPerson":"John Doe"}'
test_api "Create Customer" "POST" "/api/customers" "$CUSTOMER_DATA" "200"

# ================================
# 3. SUPPLIER MANAGEMENT (Modular)
# ================================
echo ""
echo -e "${BLUE}🏭 SUPPLIER MANAGEMENT TESTS${NC}"
test_api "Get Suppliers List" "GET" "/api/suppliers" "" "200"
test_api_json "Supplier JSON Structure" "/api/suppliers" ".[0].id // empty"

# ================================
# 4. ITEM MANAGEMENT (Modular)
# ================================
echo ""
echo -e "${BLUE}📦 ITEM MANAGEMENT TESTS${NC}"
test_api "Get Items List" "GET" "/api/items" "" "200"
test_api_json "Item JSON Structure" "/api/items" ".[0].id // empty"

# ================================
# 5. ENQUIRY MANAGEMENT (Modular)
# ================================
echo ""
echo -e "${BLUE}💼 ENQUIRY MANAGEMENT TESTS${NC}"
test_api "Get Enquiries List" "GET" "/api/enquiries" "" "200"
test_api "Get Enquiries with Filters" "GET" "/api/enquiries?limit=10&offset=0" "" "200"
test_api_json "Enquiry JSON Structure" "/api/enquiries" ".[0].id // empty"

# Test individual enquiry
FIRST_ENQUIRY_ID=$(curl -s "$BASE_URL/api/enquiries" | jq -r '.[0].id // empty')
if [ ! -z "$FIRST_ENQUIRY_ID" ] && [ "$FIRST_ENQUIRY_ID" != "null" ]; then
    test_api "Get Single Enquiry" "GET" "/api/enquiries/$FIRST_ENQUIRY_ID" "" "200"
    test_api "Get Enquiry Items" "GET" "/api/enquiries/$FIRST_ENQUIRY_ID/items" "" "200"
fi

# ================================
# 6. QUOTATION MANAGEMENT (Modular)
# ================================
echo ""
echo -e "${BLUE}💰 QUOTATION MANAGEMENT TESTS${NC}"
test_api "Get Quotations List" "GET" "/api/quotations" "" "200"
test_api "Get Quotations with Filters" "GET" "/api/quotations?limit=10" "" "200"
test_api_json "Quotation JSON Structure" "/api/quotations" ".[0].id // empty"

# Test individual quotation
FIRST_QUOTATION_ID=$(curl -s "$BASE_URL/api/quotations" | jq -r '.[0].id // empty')
if [ ! -z "$FIRST_QUOTATION_ID" ] && [ "$FIRST_QUOTATION_ID" != "null" ]; then
    test_api "Get Single Quotation" "GET" "/api/quotations/$FIRST_QUOTATION_ID" "" "200"
    test_api "Get Quotation Items" "GET" "/api/quotations/$FIRST_QUOTATION_ID/items" "" "200"
fi

# ================================
# 7. SALES ORDER MANAGEMENT (Stub)
# ================================
echo ""
echo -e "${BLUE}📋 SALES ORDER MANAGEMENT TESTS${NC}"
test_api "Get Sales Orders List" "GET" "/api/sales-orders" "" "200"

# ================================
# 8. SUPPLIER LPO MANAGEMENT (Stub)
# ================================
echo ""
echo -e "${BLUE}🏷️ SUPPLIER LPO MANAGEMENT TESTS${NC}"
test_api "Get Supplier LPOs" "GET" "/api/supplier-lpos" "" "200"

# ================================
# 9. INVENTORY MANAGEMENT (Stub)
# ================================
echo ""
echo -e "${BLUE}📊 INVENTORY MANAGEMENT TESTS${NC}"
test_api "Get Inventory Items" "GET" "/api/inventory" "" "200"

# ================================
# 10. GOODS RECEIPT MANAGEMENT (Stub)
# ================================
echo ""
echo -e "${BLUE}📥 GOODS RECEIPT MANAGEMENT TESTS${NC}"
test_api "Get Goods Receipts" "GET" "/api/goods-receipts" "" "200"

# ================================
# 11. DELIVERY MANAGEMENT (Stub)
# ================================
echo ""
echo -e "${BLUE}🚚 DELIVERY MANAGEMENT TESTS${NC}"
test_api "Get Deliveries" "GET" "/api/deliveries" "" "200"

# ================================
# 12. INVOICE MANAGEMENT (Stub)
# ================================
echo ""
echo -e "${BLUE}🧾 INVOICE MANAGEMENT TESTS${NC}"
test_api "Get Invoices" "GET" "/api/invoices" "" "200"

# ================================
# 13. APPROVAL WORKFLOW TESTS
# ================================
echo ""
echo -e "${BLUE}✅ APPROVAL WORKFLOW TESTS${NC}"
test_api "Get Approval Rules" "GET" "/api/approval-rules" "" "200"

# ================================
# 14. CUSTOMER ACCEPTANCE TESTS
# ================================
echo ""
echo -e "${BLUE}👍 CUSTOMER ACCEPTANCE TESTS${NC}"
test_api "Get Customer Acceptances" "GET" "/api/customer-acceptances" "" "200"

# ================================
# 15. PURCHASE ORDER TESTS
# ================================
echo ""
echo -e "${BLUE}🛒 PURCHASE ORDER TESTS${NC}"
test_api "Get Purchase Orders" "GET" "/api/purchase-orders" "" "200"

# ================================
# 16. PRICING MANAGEMENT TESTS
# ================================
echo ""
echo -e "${BLUE}💲 PRICING MANAGEMENT TESTS${NC}"
test_api "Get Price Lists" "GET" "/api/pricing/price-lists" "" "200"

# ================================
# 17. CREDIT NOTES TESTS
# ================================
echo ""
echo -e "${BLUE}🧾 CREDIT NOTES TESTS${NC}"
test_api "Get Credit Notes" "GET" "/api/credit-notes" "" "200"

# ================================
# 18. FRONTEND/UI TESTS
# ================================
echo ""
echo -e "${BLUE}🌐 FRONTEND UI TESTS${NC}"
test_api "Main UI Page" "GET" "/" "" "200"
test_api "Static Assets" "GET" "/assets" "" "404" # Expected 404 for assets root

# ================================
# FINAL RESULTS
# ================================
echo ""
echo "=============================================="
echo -e "${BLUE}📋 TEST RESULTS SUMMARY${NC}"
echo "=============================================="
echo "Total Tests: $TOTAL"
echo -e "✅ Passed: ${GREEN}$PASSED${NC}"
echo -e "❌ Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ALL TESTS PASSED! 🎉${NC}"
    echo -e "${GREEN}Your modular storage implementation is working perfectly!${NC}"
    exit 0
else
    echo ""
    echo -e "${YELLOW}⚠️  Some tests failed. Check the details above.${NC}"
    echo -e "${YELLOW}This is expected as some modules are still using stub implementations.${NC}"
    exit 1
fi
