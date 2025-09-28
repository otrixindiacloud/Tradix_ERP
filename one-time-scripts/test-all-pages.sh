#!/bin/bash

# Test All Pages Script for GT-ERP Application
# This script tests all the routes defined in the application

BASE_URL="http://localhost:5000"
echo "Testing GT-ERP Application Pages"
echo "================================="
echo "Base URL: $BASE_URL"
echo "Testing started at: $(date)"
echo ""

# Array of all routes to test
declare -a routes=(
    "/"
    "/ai-demo"
    "/enquiries"
    "/quotations"
    "/quotations/new"
    "/customer-po-upload"
    "/sales-orders"
    "/supplier-lpo"
    "/goods-receipt"
    "/inventory"
    "/inventory-management"
    "/delivery"
    "/invoicing"
    "/pricing"
)

# Function to test a route
test_route() {
    local route=$1
    local url="${BASE_URL}${route}"
    echo "Testing: $route"
    
    # Test HTTP status
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status_code" -eq 200 ]; then
        echo "  ✅ Status: $status_code (OK)"
        
        # Test if page loads content (check for HTML)
        content=$(curl -s "$url" | head -c 100)
        if [[ $content == *"<html"* ]] || [[ $content == *"<!DOCTYPE"* ]]; then
            echo "  ✅ Content: HTML page loads successfully"
        else
            echo "  ⚠️  Content: Response doesn't appear to be HTML"
        fi
    else
        echo "  ❌ Status: $status_code (ERROR)"
    fi
    echo ""
}

# Test all routes
for route in "${routes[@]}"; do
    test_route "$route"
done

echo "API Endpoints Testing"
echo "===================="

# Test some key API endpoints
declare -a api_routes=(
    "/api/enquiries"
    "/api/quotations"
    "/api/customers"
    "/api/items"
    "/api/sales-orders"
    "/api/inventory"
)

for api_route in "${api_routes[@]}"; do
    echo "Testing API: $api_route"
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${api_route}")
    
    if [ "$status_code" -eq 200 ] || [ "$status_code" -eq 401 ] || [ "$status_code" -eq 403 ]; then
        echo "  ✅ Status: $status_code (API accessible)"
    else
        echo "  ❌ Status: $status_code (ERROR)"
    fi
    echo ""
done

echo "Testing completed at: $(date)"
echo "================================="
