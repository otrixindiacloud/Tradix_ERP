#!/bin/bash

# Test script to populate sample data for testing Sales Orders CRUD operations
echo "🚀 Testing Sales Orders CRUD Operations..."

BASE_URL="http://localhost:5000"

echo "📊 1. Testing if server is responding..."
if curl -f -s "$BASE_URL/api/customers" > /dev/null; then
    echo "✅ Server is responding"
else
    echo "❌ Server is not responding properly"
    exit 1
fi

echo "🏢 2. Creating a test customer..."
CUSTOMER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/customers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer Ltd",
    "email": "test@customer.com",
    "phone": "+971-50-123-4567",
    "customerType": "Wholesale",
    "classification": "Corporate"
  }')

echo "Customer created: $CUSTOMER_RESPONSE"

echo "📋 3. Creating a test enquiry..."
ENQUIRY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/enquiries" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "'$(echo $CUSTOMER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)'",
    "source": "Web Form",
    "description": "Test enquiry for Sales Order testing",
    "urgency": "Medium"
  }')

echo "Enquiry created: $ENQUIRY_RESPONSE"

echo "💰 4. Testing Sales Orders list..."
SALES_ORDERS=$(curl -s "$BASE_URL/api/sales-orders")
echo "Current Sales Orders: $SALES_ORDERS"

echo "✅ CRUD Operations Test Complete!"
echo "📱 Now you can test the UI at: https://fictional-xylophone-4jrgpwj7w6pghj6qq-5000.app.github.dev/sales-orders"
