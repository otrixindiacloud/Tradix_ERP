#!/bin/bash

echo "Storage Modularization Testing Script"
echo "====================================="
echo

# Start server in background
echo "Starting server..."
npm run dev &
SERVER_PID=$!
sleep 3

echo "Testing API endpoints..."
echo "========================"

# Test basic endpoints
echo "1. Testing /api/health endpoint:"
curl -s http://localhost:5000/api/health | jq '.' || echo "Failed to connect or parse JSON"

echo
echo "2. Testing /api/customers endpoint:"
curl -s http://localhost:5000/api/customers | jq '.length' || echo "Failed to get customers"

echo
echo "3. Testing /api/enquiries endpoint:"
curl -s http://localhost:5000/api/enquiries | jq '.length' || echo "Failed to get enquiries"

echo
echo "4. Testing /api/quotations endpoint:"
curl -s http://localhost:5000/api/quotations | jq '.length' || echo "Failed to get quotations"

echo
echo "5. Testing /api/items endpoint:"
curl -s http://localhost:5000/api/items | jq '.length' || echo "Failed to get items"

# Stop the server
echo
echo "Stopping server..."
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null

echo
echo "API testing completed!"
