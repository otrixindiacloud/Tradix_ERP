#!/bin/bash

echo "=== Testing Invoice PDF Generation ==="

# Base URL
BASE_URL="http://localhost:5000/api"

echo "1. Checking if server is running..."
curl -s "$BASE_URL/health" || echo "Server health check failed"

echo -e "\n2. Getting existing invoices..."
INVOICES=$(curl -s "$BASE_URL/invoices")
echo "Response: $INVOICES"

# If no invoices exist, create test data
if [[ "$INVOICES" == "[]" || "$INVOICES" == "" ]]; then
    echo -e "\n3. Creating test invoice..."
    
    # First, let's get a sales order to create an invoice from
    SALES_ORDERS=$(curl -s "$BASE_URL/sales-orders")
    echo "Sales Orders: $SALES_ORDERS"
    
    # Extract first sales order ID if available
    SO_ID=$(echo "$SALES_ORDERS" | jq -r '.[0].id // empty' 2>/dev/null)
    
    if [[ -n "$SO_ID" ]]; then
        echo "Found Sales Order ID: $SO_ID"
        
        # Create invoice from sales order
        INVOICE_DATA=$(cat <<EOF
{
  "salesOrderId": "$SO_ID",
  "invoiceDate": "$(date -Iseconds)",
  "dueDate": "$(date -d '+30 days' -Iseconds)",
  "notes": "Test invoice for PDF generation with comprehensive material details",
  "taxRate": 5.0,
  "discountAmount": 0
}
EOF
)
        
        echo "Creating invoice with data: $INVOICE_DATA"
        CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/invoices" \
            -H "Content-Type: application/json" \
            -d "$INVOICE_DATA")
        echo "Create response: $CREATE_RESPONSE"
        
        # Extract invoice ID from response
        INVOICE_ID=$(echo "$CREATE_RESPONSE" | jq -r '.id // empty' 2>/dev/null)
    else
        echo "No sales orders found. Creating minimal test invoice..."
        
        # Create a minimal test invoice with dummy data
        MINIMAL_INVOICE_DATA=$(cat <<EOF
{
  "customerId": "test-customer-123",
  "customerName": "Test Customer LLC",
  "customerEmail": "test@example.com",
  "invoiceNumber": "INV-TEST-$(date +%s)",
  "invoiceDate": "$(date -Iseconds)",
  "dueDate": "$(date -d '+30 days' -Iseconds)",
  "items": [
    {
      "description": "Test Product with Material Specs",
      "supplierCode": "SP001",
      "barcode": "1234567890123",
      "quantity": 10,
      "unitPrice": 25.00,
      "materialSpecs": {
        "material": "Aluminum Alloy",
        "dimensions": "10cm x 5cm x 2cm",
        "weight": "150g",
        "color": "Silver",
        "finish": "Anodized"
      },
      "logoRequirements": {
        "required": true,
        "position": "Center",
        "size": "2cm x 1cm",
        "colors": ["Blue", "White"]
      }
    }
  ],
  "subtotal": 250.00,
  "taxRate": 5.0,
  "taxAmount": 12.50,
  "total": 262.50,
  "currency": "AED",
  "notes": "Test invoice with comprehensive material specifications"
}
EOF
)
        
        CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/invoices" \
            -H "Content-Type: application/json" \
            -d "$MINIMAL_INVOICE_DATA")
        echo "Minimal invoice create response: $CREATE_RESPONSE"
        
        INVOICE_ID=$(echo "$CREATE_RESPONSE" | jq -r '.id // empty' 2>/dev/null)
    fi
else
    # Use existing invoice
    INVOICE_ID=$(echo "$INVOICES" | jq -r '.[0].id // empty' 2>/dev/null)
    echo "Using existing invoice ID: $INVOICE_ID"
fi

if [[ -n "$INVOICE_ID" && "$INVOICE_ID" != "null" ]]; then
    echo -e "\n4. Testing PDF generation for invoice: $INVOICE_ID"
    
    # Test PDF generation
    PDF_RESPONSE=$(curl -s -w "%{http_code}" -o "/tmp/test-invoice.pdf" \
        "$BASE_URL/invoices/$INVOICE_ID/pdf")
    
    if [[ "$PDF_RESPONSE" == "200" ]]; then
        echo "✅ PDF generated successfully!"
        echo "PDF saved to: /tmp/test-invoice.pdf"
        
        # Check file size
        PDF_SIZE=$(stat -c%s "/tmp/test-invoice.pdf" 2>/dev/null || stat -f%z "/tmp/test-invoice.pdf")
        echo "PDF file size: ${PDF_SIZE} bytes"
        
        if [[ "$PDF_SIZE" -gt 1000 ]]; then
            echo "✅ PDF appears to be valid (size > 1KB)"
        else
            echo "⚠️  PDF seems too small, might be an error"
        fi
        
        # Try to get PDF info if pdfinfo is available
        if command -v pdfinfo >/dev/null 2>&1; then
            echo -e "\nPDF Information:"
            pdfinfo "/tmp/test-invoice.pdf" 2>/dev/null || echo "Could not read PDF info"
        fi
    else
        echo "❌ PDF generation failed with HTTP code: $PDF_RESPONSE"
        
        # Try to get error details
        ERROR_RESPONSE=$(curl -s "$BASE_URL/invoices/$INVOICE_ID/pdf")
        echo "Error response: $ERROR_RESPONSE"
    fi
    
    echo -e "\n5. Testing invoice preview endpoint..."
    PREVIEW_RESPONSE=$(curl -s "$BASE_URL/invoices/$INVOICE_ID")
    echo "Invoice details: $PREVIEW_RESPONSE"
    
else
    echo "❌ Could not create or find invoice ID"
fi

echo -e "\n=== Test Complete ==="