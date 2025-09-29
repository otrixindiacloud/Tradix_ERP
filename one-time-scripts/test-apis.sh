#!/bin/bash

# Test script to check if APIs are working
echo "Testing ERP API endpoints..."

BASE_URL="https://fictional-xylophone-4jrgpwj7w6pghj6qq-5000.app.github.dev"

echo "1. Testing customers endpoint:"
curl -s "$BASE_URL/api/customers" | head -100

echo -e "\n2. Testing sales orders endpoint:"
curl -s "$BASE_URL/api/sales-orders" | head -100

echo -e "\n3. Testing quotations endpoint:"
curl -s "$BASE_URL/api/quotations" | head -100
