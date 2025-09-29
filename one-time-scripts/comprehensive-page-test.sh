#!/bin/bash

# Comprehensive Page Functionality Test
# This script opens each page in the browser and provides instructions for manual testing

BASE_URL="http://localhost:5000"

echo "🧪 GT-ERP Comprehensive Page Testing Guide"
echo "=========================================="
echo "Base URL: $BASE_URL"
echo "Testing started at: $(date)"
echo ""

echo "📋 Test Results Summary:"
echo "========================"

# Test each main page and provide guidance
declare -A pages=(
    ["/"]="Dashboard - Main landing page with overview widgets"
    ["/ai-demo"]="AI Demo - AI assistant functionality"
    ["/enquiries"]="Enquiries - Customer enquiry management"
    ["/quotations"]="Quotations - Quote management and creation"
    ["/quotations/new"]="New Quotation - Create new quotes"
    ["/po-upload"]="PO Upload - Purchase order upload functionality"
    ["/sales-orders"]="Sales Orders - Order management"
    ["/supplier-lpo"]="Supplier LPO - Local purchase orders"
    ["/goods-receipt"]="Goods Receipt - Inventory receiving"
    ["/inventory"]="Inventory - Stock overview"
    ["/inventory-management"]="Inventory Management - Advanced inventory controls"
    ["/delivery"]="Delivery Management - Shipment tracking"
    ["/invoicing"]="Invoicing - Invoice generation and management"
    ["/pricing"]="Pricing Management - Price list management"
)

# Function to test page accessibility and provide description
test_page_functionality() {
    local route=$1
    local description=$2
    local url="${BASE_URL}${route}"
    
    echo "🔍 Testing: $route"
    echo "   Description: $description"
    echo "   URL: $url"
    
    # Test HTTP status
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status_code" -eq 200 ]; then
        echo "   ✅ HTTP Status: $status_code (OK)"
        echo "   📖 Manual Test: Open $url in browser to verify functionality"
    else
        echo "   ❌ HTTP Status: $status_code (ERROR)"
        echo "   🔧 Issue: Page not accessible"
    fi
    echo ""
}

# Test all pages
for route in "${!pages[@]}"; do
    test_page_functionality "$route" "${pages[$route]}"
done

echo "🔧 API Status Check:"
echo "==================="

# Quick API health check
echo "Testing key API endpoints..."

apis=("/api/enquiries" "/api/quotations" "/api/customers" "/api/sales-orders" "/api/inventory")

for api in "${apis[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${api}")
    if [ "$status" -eq 200 ]; then
        echo "✅ $api: Working"
    elif [ "$status" -eq 500 ]; then
        echo "⚠️  $api: Server Error (might be database related)"
    else
        echo "❌ $api: HTTP $status"
    fi
done

echo ""
echo "📝 Manual Testing Checklist:"
echo "=========================="
echo "For each page, verify:"
echo "1. ✅ Page loads without errors"
echo "2. ✅ Navigation menu is functional"
echo "3. ✅ UI components render correctly"
echo "4. ✅ Forms can be filled out (if applicable)"
echo "5. ✅ Data displays properly (if applicable)"
echo "6. ✅ No console errors in browser developer tools"
echo ""

echo "🎯 Priority Issues to Address:"
echo "=============================="
echo "1. API endpoints returning 500 errors - database connection issues"
echo "2. Verify data loading on pages that depend on APIs"
echo "3. Test form submissions and CRUD operations"
echo ""

echo "Testing completed at: $(date)"
