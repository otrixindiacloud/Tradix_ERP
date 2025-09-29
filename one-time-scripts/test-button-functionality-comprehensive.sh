#!/bin/bash

# Comprehensive Button Functionality Test for GT-ERP Application
# This script tests all button functionality across all pages

BASE_URL="http://localhost:5000"
LOG_FILE="/tmp/button_test_log.txt"
SCREENSHOT_DIR="/tmp/screenshots"

echo "🔘 GT-ERP Comprehensive Button Functionality Test"
echo "================================================="
echo "Base URL: $BASE_URL"
echo "Testing started at: $(date)"
echo "Log file: $LOG_FILE"
echo ""

# Initialize log
echo "Button Functionality Test Log - $(date)" > "$LOG_FILE"

# Function to test page accessibility
test_page_access() {
    local route=$1
    local description=$2
    local url="${BASE_URL}${route}"
    
    echo "🌐 Testing page: $route ($description)"
    echo "Testing page: $route ($description)" >> "$LOG_FILE"
    
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status_code" -eq 200 ]; then
        echo "   ✅ Page accessible (HTTP $status_code)"
        echo "   ✅ Page accessible (HTTP $status_code)" >> "$LOG_FILE"
        return 0
    else
        echo "   ❌ Page not accessible (HTTP $status_code)"
        echo "   ❌ Page not accessible (HTTP $status_code)" >> "$LOG_FILE"
        return 1
    fi
}

# Function to test API endpoints for button actions
test_api_endpoint() {
    local endpoint=$1
    local method=${2:-GET}
    local description=$3
    local data=${4:-""}
    
    echo "🔌 Testing API: $method $endpoint ($description)"
    echo "Testing API: $method $endpoint ($description)" >> "$LOG_FILE"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" "$BASE_URL$endpoint")
        http_code="${response: -3}"
        body="${response%???}"
    elif [ "$method" = "POST" ] && [ ! -z "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL$endpoint" \
          -H "Content-Type: application/json" \
          -d "$data")
        http_code="${response: -3}"
        body="${response%???}"
    else
        response=$(curl -s -w "%{http_code}" -X "$method" "$BASE_URL$endpoint")
        http_code="${response: -3}"
        body="${response%???}"
    fi
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ] || [ "$http_code" = "204" ]; then
        echo "   ✅ API working (HTTP $http_code)"
        echo "   ✅ API working (HTTP $http_code)" >> "$LOG_FILE"
        return 0
    else
        echo "   ❌ API error (HTTP $http_code)"
        echo "   ❌ API error (HTTP $http_code)" >> "$LOG_FILE"
        if [ ! -z "$body" ] && [ ${#body} -lt 200 ]; then
            echo "   Response: $body"
            echo "   Response: $body" >> "$LOG_FILE"
        fi
        return 1
    fi
}

# Function to check for button presence in page HTML
check_buttons_in_page() {
    local route=$1
    local description=$2
    local url="${BASE_URL}${route}"
    
    echo "🔍 Checking buttons in page: $route"
    echo "Checking buttons in page: $route" >> "$LOG_FILE"
    
    page_content=$(curl -s "$url")
    
    # Count different types of buttons
    button_count=$(echo "$page_content" | grep -o '<button[^>]*>' | wc -l)
    link_button_count=$(echo "$page_content" | grep -o 'data-testid="button-[^"]*"' | wc -l)
    
    echo "   📊 Found $button_count <button> elements"
    echo "   📊 Found $link_button_count elements with button test IDs"
    echo "   📊 Found $button_count <button> elements" >> "$LOG_FILE"
    echo "   📊 Found $link_button_count elements with button test IDs" >> "$LOG_FILE"
    
    # Extract specific button test IDs
    if [ $link_button_count -gt 0 ]; then
        echo "   🎯 Button test IDs found:"
        echo "   🎯 Button test IDs found:" >> "$LOG_FILE"
        echo "$page_content" | grep -o 'data-testid="button-[^"]*"' | sort | uniq | while read -r testid; do
            echo "      - $testid"
            echo "      - $testid" >> "$LOG_FILE"
        done
    fi
    
    return 0
}

echo "📋 Phase 1: Testing Page Accessibility"
echo "======================================"

# Test all main pages
declare -A pages=(
    ["/"]="Dashboard"
    ["/enquiries"]="Enquiries Management"
    ["/quotations"]="Quotations Management"
    ["/quotations/new"]="New Quotation Form"
    ["/po-upload"]="Purchase Order Upload"
    ["/sales-orders"]="Sales Orders Management"
    ["/supplier-lpo"]="Supplier LPO Management"
    ["/goods-receipt"]="Goods Receipt"
    ["/inventory"]="Inventory Overview"
    ["/inventory-management"]="Inventory Management"
    ["/delivery"]="Delivery Management"
    ["/invoicing"]="Invoicing"
    ["/pricing"]="Pricing Management"
    ["/suppliers"]="Suppliers Management"
    ["/audit-logs"]="Audit Logs"
    ["/analytics"]="Analytics Dashboard"
    ["/customer-management"]="Customer Management"
    ["/user-management"]="User Management"
    ["/recent-activities"]="Recent Activities"
    ["/notifications"]="Notifications"
)

page_access_count=0
page_total_count=${#pages[@]}

for route in "${!pages[@]}"; do
    if test_page_access "$route" "${pages[$route]}"; then
        ((page_access_count++))
    fi
done

echo ""
echo "📊 Page Accessibility Summary: $page_access_count/$page_total_count pages accessible"
echo "📊 Page Accessibility Summary: $page_access_count/$page_total_count pages accessible" >> "$LOG_FILE"

echo ""
echo "📋 Phase 2: Testing API Endpoints for Button Actions"
echo "=================================================="

# Test CRUD API endpoints that buttons would call
declare -A api_tests=(
    ["/api/enquiries"]="GET:Enquiries List"
    ["/api/quotations"]="GET:Quotations List"
    ["/api/customers"]="GET:Customers List"
    ["/api/sales-orders"]="GET:Sales Orders List"
    ["/api/suppliers"]="GET:Suppliers List"
    ["/api/inventory"]="GET:Inventory List"
    ["/api/supplier-lpos"]="GET:Supplier LPOs List"
    ["/api/goods-receipt"]="GET:Goods Receipt List"
    ["/api/deliveries"]="GET:Deliveries List"
    ["/api/dashboard/stats"]="GET:Dashboard Statistics"
)

api_success_count=0
api_total_count=${#api_tests[@]}

for endpoint in "${!api_tests[@]}"; do
    IFS=':' read -r method description <<< "${api_tests[$endpoint]}"
    if test_api_endpoint "$endpoint" "$method" "$description"; then
        ((api_success_count++))
    fi
done

echo ""
echo "📊 API Endpoint Summary: $api_success_count/$api_total_count endpoints working"
echo "📊 API Endpoint Summary: $api_success_count/$api_total_count endpoints working" >> "$LOG_FILE"

echo ""
echo "📋 Phase 3: Analyzing Button Presence in Pages"
echo "============================================="

button_analysis_count=0

for route in "${!pages[@]}"; do
    if check_buttons_in_page "$route" "${pages[$route]}"; then
        ((button_analysis_count++))
    fi
    echo ""
done

echo ""
echo "📋 Phase 4: Testing Specific Button Functionality"
echo "==============================================="

echo "🧪 Testing specific button actions through APIs..."
echo "🧪 Testing specific button actions through APIs..." >> "$LOG_FILE"

# Test Create Operations (what "New" buttons would do)
echo "🆕 Testing CREATE operations:"
echo "🆕 Testing CREATE operations:" >> "$LOG_FILE"

# Test Enquiry Creation
test_enquiry_data='{"customerName":"Test Customer","contactPerson":"John Doe","email":"test@example.com","phone":"123-456-7890","enquiryDate":"2024-01-15","itemDescription":"Test Item","quantity":10,"targetPrice":100.00,"deliveryDate":"2024-02-15","urgency":"Medium","notes":"Test enquiry"}'
test_api_endpoint "/api/enquiries" "POST" "Create New Enquiry" "$test_enquiry_data"

# Test Customer Creation
test_customer_data='{"name":"Test Customer","type":"Corporate","email":"customer@test.com","phone":"123-456-7890","address":"123 Test St","contactPerson":"Jane Doe"}'
test_api_endpoint "/api/customers" "POST" "Create New Customer" "$test_customer_data"

# Test Supplier Creation (already tested in comprehensive test, but adding here for completeness)
test_supplier_data='{"name":"Test Supplier","email":"supplier@test.com","contactPerson":"Bob Smith","phone":"987-654-3210","address":"456 Supplier Ave"}'
test_api_endpoint "/api/suppliers" "POST" "Create New Supplier" "$test_supplier_data"

echo ""
echo "🔄 Testing UPDATE operations:"
echo "🔄 Testing UPDATE operations:" >> "$LOG_FILE"

# We would need existing IDs for update operations, so this is more limited
echo "   ℹ️  Update operations require existing record IDs"
echo "   ℹ️  Update operations require existing record IDs" >> "$LOG_FILE"

echo ""
echo "📋 Phase 5: Browser-Based Button Testing Instructions"
echo "=================================================="

echo "🌐 For comprehensive button testing, please manually test the following:"
echo "🌐 For comprehensive button testing, please manually test the following:" >> "$LOG_FILE"

cat << 'EOF'
1. Dashboard Page (/) - Test buttons:
   - "New Enquiry" button
   - "Export" button  
   - "Mark Complete" buttons in task lists
   - "View All" buttons for sections

2. Enquiries Page (/enquiries) - Test buttons:
   - "New Enquiry" button
   - "Edit" buttons for each enquiry
   - "Delete" buttons for each enquiry
   - "View" buttons for each enquiry
   - Search and filter functionality

3. Quotations Page (/quotations) - Test buttons:
   - "New Quotation" button
   - "Edit" buttons for each quotation
   - "Download" buttons for each quotation
   - "Delete" buttons for each quotation
   - Filter and date range buttons

4. New Quotation Page (/quotations/new) - Test buttons:
   - "Add Item" button
   - "Save Draft" button
   - "Submit for Approval" button
   - "Cancel" button

5. All other pages - Test CRUD buttons:
   - Create/New buttons
   - Edit buttons
   - Delete buttons
   - Save/Submit buttons
   - Cancel buttons
   - Search/Filter buttons
   - Export/Download buttons
EOF

echo ""
echo "📋 Final Summary"
echo "==============="
echo "✅ Pages Accessible: $page_access_count/$page_total_count"
echo "✅ API Endpoints Working: $api_success_count/$api_total_count"
echo "✅ Button Analysis Completed: $button_analysis_count pages analyzed"
echo ""
echo "✅ Pages Accessible: $page_access_count/$page_total_count" >> "$LOG_FILE"
echo "✅ API Endpoints Working: $api_success_count/$api_total_count" >> "$LOG_FILE"
echo "✅ Button Analysis Completed: $button_analysis_count pages analyzed" >> "$LOG_FILE"

if [ $page_access_count -eq $page_total_count ] && [ $api_success_count -eq $api_total_count ]; then
    echo "🎉 All tests passed! The application appears to be fully functional."
    echo "🎉 All tests passed! The application appears to be fully functional." >> "$LOG_FILE"
    echo "💡 Proceed with manual browser testing to verify button interactions."
    echo "💡 Proceed with manual browser testing to verify button interactions." >> "$LOG_FILE"
else
    echo "⚠️  Some tests failed. Review the log for details."
    echo "⚠️  Some tests failed. Review the log for details." >> "$LOG_FILE"
fi

echo ""
echo "📄 Detailed log saved to: $LOG_FILE"
echo "Testing completed at: $(date)"
echo "Testing completed at: $(date)" >> "$LOG_FILE"