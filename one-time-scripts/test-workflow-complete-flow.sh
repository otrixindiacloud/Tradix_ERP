#!/bin/bash

# Comprehensive Workflow Test Script
# Tests the complete workflow flow from customer creation to invoice generation

echo "=== GT-ERP Complete Workflow Flow Test ==="
echo "Testing all workflow steps and functionality..."

BASE_URL="http://localhost:5000/api"

# Function to make API requests and check responses
test_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_status=${3:-200}
    local method=${4:-GET}
    local data=${5:-""}
    
    echo -n "Testing $description... "
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" -o /tmp/test_response.json "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "%{http_code}" -o /tmp/test_response.json "$BASE_URL$endpoint")
    fi
    
    status_code="${response: -3}"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo "✅ PASS ($status_code)"
        return 0
    else
        echo "❌ FAIL ($status_code)"
        echo "Response: $(cat /tmp/test_response.json)"
        return 1
    fi
}

# Function to create test data
create_test_data() {
    echo -e "\n🔧 Creating test data..."
    
    # Create test customer
    customer_data='{
        "customerName": "Test Customer Workflow",
        "contactInfo": "test@workflow.com",
        "customerType": "Retail",
        "classification": "Corporate",
        "phone": "+1234567890",
        "address": "123 Test Street, Test City, TC 12345"
    }'
    
    echo -n "Creating test customer... "
    customer_response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$customer_data" -o /tmp/customer_response.json "$BASE_URL/customers")
    customer_status="${customer_response: -3}"
    
    if [ "$customer_status" = "200" ] || [ "$customer_status" = "201" ]; then
        echo "✅ PASS ($customer_status)"
        CUSTOMER_ID=$(cat /tmp/customer_response.json | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
        echo "Customer ID: $CUSTOMER_ID"
    else
        echo "❌ FAIL ($customer_status)"
        echo "Response: $(cat /tmp/customer_response.json)"
        return 1
    fi
    
    # Create test enquiry
    enquiry_data="{
        \"customerId\": \"$CUSTOMER_ID\",
        \"enquiryDetails\": \"Test enquiry for workflow testing\",
        \"productRequirements\": \"Test products for workflow\",
        \"quantity\": 10,
        \"urgency\": \"Medium\",
        \"source\": \"Web Form\",
        \"status\": \"New\"
    }"
    
    echo -n "Creating test enquiry... "
    enquiry_response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$enquiry_data" -o /tmp/enquiry_response.json "$BASE_URL/enquiries")
    enquiry_status="${enquiry_response: -3}"
    
    if [ "$enquiry_status" = "200" ] || [ "$enquiry_status" = "201" ]; then
        echo "✅ PASS ($enquiry_status)"
        ENQUIRY_ID=$(cat /tmp/enquiry_response.json | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
        echo "Enquiry ID: $ENQUIRY_ID"
    else
        echo "❌ FAIL ($enquiry_status)"
        echo "Response: $(cat /tmp/enquiry_response.json)"
        return 1
    fi
    
    # Create test quotation
    quotation_data="{
        \"enquiryId\": \"$ENQUIRY_ID\",
        \"quotationNumber\": \"QT-TEST-001\",
        \"lineItems\": [
            {
                \"description\": \"Test Product 1\",
                \"quantity\": 5,
                \"unitPrice\": 100.00,
                \"totalPrice\": 500.00
            },
            {
                \"description\": \"Test Product 2\",
                \"quantity\": 5,
                \"unitPrice\": 150.00,
                \"totalPrice\": 750.00
            }
        ],
        \"totalAmount\": 1250.00,
        \"validityPeriod\": 30,
        \"termsAndConditions\": \"Standard terms and conditions for test quotation\",
        \"status\": \"Draft\"
    }"
    
    echo -n "Creating test quotation... "
    quotation_response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$quotation_data" -o /tmp/quotation_response.json "$BASE_URL/quotations")
    quotation_status="${quotation_response: -3}"
    
    if [ "$quotation_status" = "200" ] || [ "$quotation_status" = "201" ]; then
        echo "✅ PASS ($quotation_status)"
        QUOTATION_ID=$(cat /tmp/quotation_response.json | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
        echo "Quotation ID: $QUOTATION_ID"
    else
        echo "❌ FAIL ($quotation_status)"
        echo "Response: $(cat /tmp/quotation_response.json)"
        return 1
    fi
    
    # Create test sales order
    sales_order_data="{
        \"quotationId\": \"$QUOTATION_ID\",
        \"salesOrderNumber\": \"SO-TEST-001\",
        \"orderItems\": [
            {
                \"description\": \"Test Product 1\",
                \"quantity\": 5,
                \"unitPrice\": 100.00,
                \"totalPrice\": 500.00
            },
            {
                \"description\": \"Test Product 2\",
                \"quantity\": 5,
                \"unitPrice\": 150.00,
                \"totalPrice\": 750.00
            }
        ],
        \"totalAmount\": 1250.00,
        \"deliveryDate\": \"2024-12-31\",
        \"paymentTerms\": \"Net 30\",
        \"status\": \"Pending\"
    }"
    
    echo -n "Creating test sales order... "
    sales_order_response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$sales_order_data" -o /tmp/sales_order_response.json "$BASE_URL/sales-orders")
    sales_order_status="${sales_order_response: -3}"
    
    if [ "$sales_order_status" = "200" ] || [ "$sales_order_status" = "201" ]; then
        echo "✅ PASS ($sales_order_status)"
        SALES_ORDER_ID=$(cat /tmp/sales_order_response.json | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
        echo "Sales Order ID: $SALES_ORDER_ID"
    else
        echo "❌ FAIL ($sales_order_status)"
        echo "Response: $(cat /tmp/sales_order_response.json)"
        return 1
    fi
    
    echo "Test data created successfully!"
    echo "Customer ID: $CUSTOMER_ID"
    echo "Enquiry ID: $ENQUIRY_ID"
    echo "Quotation ID: $QUOTATION_ID"
    echo "Sales Order ID: $SALES_ORDER_ID"
}

# Initialize counters
total_tests=0
passed_tests=0

# Test Core Workflow API Endpoints
echo -e "\n🔍 Testing Core Workflow API Endpoints..."

# Test workflow progress endpoint
total_tests=$((total_tests + 1))
if test_endpoint "/workflow/progress" "Workflow Progress List"; then
    passed_tests=$((passed_tests + 1))
fi

# Test workflow analytics endpoint
total_tests=$((total_tests + 1))
if test_endpoint "/workflow/analytics" "Workflow Analytics"; then
    passed_tests=$((passed_tests + 1))
fi

# Test workflow validation endpoints
total_tests=$((total_tests + 1))
if test_endpoint "/workflow/validate/customer/test-customer" "Customer Step Validation"; then
    passed_tests=$((passed_tests + 1))
fi

total_tests=$((total_tests + 1))
if test_endpoint "/workflow/validate/enquiry/test-enquiry" "Enquiry Step Validation"; then
    passed_tests=$((passed_tests + 1))
fi

# Test workflow step completion
total_tests=$((total_tests + 1))
if test_endpoint "/workflow/complete/customer/test-customer" "Customer Step Completion" "POST" '{"notes": "Test completion"}'; then
    passed_tests=$((passed_tests + 1))
fi

# Test Frontend Workflow Pages
echo -e "\n🌐 Testing Frontend Workflow Pages..."

total_tests=$((total_tests + 1))
echo -n "Testing Workflow Dashboard... "
workflow_dashboard_response=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:5000/workflow-dashboard")
workflow_dashboard_status="${workflow_dashboard_response: -3}"

if [ "$workflow_dashboard_status" = "200" ]; then
    echo "✅ PASS ($workflow_dashboard_status)"
    passed_tests=$((passed_tests + 1))
else
    echo "❌ FAIL ($workflow_dashboard_status)"
fi

total_tests=$((total_tests + 1))
echo -n "Testing Workflow Page... "
workflow_page_response=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:5000/workflow")
workflow_page_status="${workflow_page_response: -3}"

if [ "$workflow_page_status" = "200" ]; then
    echo "✅ PASS ($workflow_page_status)"
    passed_tests=$((passed_tests + 1))
else
    echo "❌ FAIL ($workflow_page_status)"
fi

# Test Workflow Step Navigation
echo -e "\n🔄 Testing Workflow Step Navigation..."

workflow_steps=(
    "Customer Management:/customer-management"
    "Enquiry Management:/enquiries"
    "Quotation Management:/quotations"
    "Customer PO Upload:/customer-po-upload"
    "Sales Order Management:/sales-orders"
    "Delivery Note Management:/delivery-note"
    "Invoicing Management:/invoicing"
    "Supplier Management:/suppliers"
    "Requisition Management:/requisitions"
    "Supplier Quotes Management:/supplier-quotes"
    "Supplier LPO Management:/supplier-lpo"
    "Shipment Tracking:/shipment-tracking"
)

for step_info in "${workflow_steps[@]}"; do
    IFS=':' read -r step_name step_path <<< "$step_info"
    total_tests=$((total_tests + 1))
    echo -n "Testing $step_name page... "
    step_response=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:5000$step_path")
    step_status="${step_response: -3}"
    
    if [ "$step_status" = "200" ]; then
        echo "✅ PASS ($step_status)"
        passed_tests=$((passed_tests + 1))
    else
        echo "❌ FAIL ($step_status)"
    fi
done

# Test Workflow Data Flow
echo -e "\n📊 Testing Workflow Data Flow..."

# Create test data
create_test_data

if [ -n "$CUSTOMER_ID" ] && [ -n "$ENQUIRY_ID" ] && [ -n "$QUOTATION_ID" ] && [ -n "$SALES_ORDER_ID" ]; then
    # Test workflow progress for specific entities
    total_tests=$((total_tests + 1))
    if test_endpoint "/workflow/progress/$ENQUIRY_ID?entityType=enquiry" "Enquiry Workflow Progress"; then
        passed_tests=$((passed_tests + 1))
    fi
    
    total_tests=$((total_tests + 1))
    if test_endpoint "/workflow/progress/$QUOTATION_ID?entityType=quotation" "Quotation Workflow Progress"; then
        passed_tests=$((passed_tests + 1))
    fi
    
    total_tests=$((total_tests + 1))
    if test_endpoint "/workflow/progress/$SALES_ORDER_ID?entityType=sales-order" "Sales Order Workflow Progress"; then
        passed_tests=$((passed_tests + 1))
    fi
fi

# Test Workflow Step Validation
echo -e "\n✅ Testing Workflow Step Validation..."

if [ -n "$CUSTOMER_ID" ]; then
    total_tests=$((total_tests + 1))
    if test_endpoint "/workflow/validate/customer/$CUSTOMER_ID" "Customer Validation"; then
        passed_tests=$((passed_tests + 1))
    fi
fi

if [ -n "$ENQUIRY_ID" ]; then
    total_tests=$((total_tests + 1))
    if test_endpoint "/workflow/validate/enquiry/$ENQUIRY_ID" "Enquiry Validation"; then
        passed_tests=$((passed_tests + 1))
    fi
fi

if [ -n "$QUOTATION_ID" ]; then
    total_tests=$((total_tests + 1))
    if test_endpoint "/workflow/validate/quotation/$QUOTATION_ID" "Quotation Validation"; then
        passed_tests=$((passed_tests + 1))
    fi
fi

# Test Workflow Step Completion
echo -e "\n🎯 Testing Workflow Step Completion..."

if [ -n "$CUSTOMER_ID" ]; then
    total_tests=$((total_tests + 1))
    if test_endpoint "/workflow/complete/customer/$CUSTOMER_ID" "Customer Step Completion" "POST" '{"notes": "Customer step completed for workflow test"}'; then
        passed_tests=$((passed_tests + 1))
    fi
fi

if [ -n "$ENQUIRY_ID" ]; then
    total_tests=$((total_tests + 1))
    if test_endpoint "/workflow/complete/enquiry/$ENQUIRY_ID" "Enquiry Step Completion" "POST" '{"notes": "Enquiry step completed for workflow test"}'; then
        passed_tests=$((passed_tests + 1))
    fi
fi

# Test Workflow Analytics
echo -e "\n📈 Testing Workflow Analytics..."

total_tests=$((total_tests + 1))
if test_endpoint "/workflow/analytics?period=30d" "Workflow Analytics 30d"; then
    passed_tests=$((passed_tests + 1))
fi

total_tests=$((total_tests + 1))
if test_endpoint "/workflow/analytics?period=90d" "Workflow Analytics 90d"; then
    passed_tests=$((passed_tests + 1))
fi

# Test Workflow Filters
echo -e "\n🔍 Testing Workflow Filters..."

total_tests=$((total_tests + 1))
if test_endpoint "/workflow/progress?status=pending" "Workflow Filter by Status"; then
    passed_tests=$((passed_tests + 1))
fi

total_tests=$((total_tests + 1))
if test_endpoint "/workflow/progress?priority=medium" "Workflow Filter by Priority"; then
    passed_tests=$((passed_tests + 1))
fi

total_tests=$((total_tests + 1))
if test_endpoint "/workflow/progress?search=test" "Workflow Filter by Search"; then
    passed_tests=$((passed_tests + 1))
fi

# Test Database Connection
echo -e "\n💾 Testing Database Connection..."
total_tests=$((total_tests + 1))
if test_endpoint "/dashboard/stats" "Database Connection via Stats"; then
    passed_tests=$((passed_tests + 1))
fi

# Summary
echo -e "\n📋 Workflow Test Summary"
echo "========================"
echo "Total Tests: $total_tests"
echo "Passed: $passed_tests"
echo "Failed: $((total_tests - passed_tests))"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "\n🎉 ALL WORKFLOW TESTS PASSED! Complete workflow flow is functional."
    echo "✅ Workflow API endpoints working"
    echo "✅ Workflow dashboard accessible"
    echo "✅ Workflow step navigation working"
    echo "✅ Workflow data flow functional"
    echo "✅ Workflow validation working"
    echo "✅ Workflow step completion working"
    echo "✅ Workflow analytics working"
    echo "✅ Workflow filters working"
    echo "✅ Database connectivity confirmed"
    exit 0
else
    echo -e "\n⚠️  Some workflow tests failed. Check the output above for details."
    echo "Failed tests: $((total_tests - passed_tests))"
    exit 1
fi
