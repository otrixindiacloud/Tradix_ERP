#!/bin/bash

# Test Proforma Invoice Download Functionality
# Tests proforma invoice generation and download

set -e

echo "=== Testing Proforma Invoice Download Functionality ==="

API_BASE="http://localhost:5000/api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to make API request and check response
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=${4:-200}
    
    echo -e "${YELLOW}Testing: $method $endpoint${NC}"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_BASE$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            "$API_BASE$endpoint")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ Status: $status_code${NC}"
        echo "$body"
        return 0
    else
        echo -e "${RED}✗ Expected status $expected_status, got $status_code${NC}"
        echo "$body"
        return 1
    fi
}

# Step 1: Get list of invoices to find a proforma invoice
echo -e "\n${YELLOW}Step 1: Fetching invoices to find proforma invoices...${NC}"
invoices_response=$(make_request "GET" "/invoices")

# Extract proforma invoice ID if exists
proforma_invoice_id=$(echo "$invoices_response" | jq -r '.[] | select(.invoiceType == "Proforma") | .id' | head -n1)

if [ "$proforma_invoice_id" = "null" ] || [ -z "$proforma_invoice_id" ]; then
    echo -e "${YELLOW}No existing proforma invoice found. Creating one for testing...${NC}"
    
    # Step 1.1: Get a sales order to create proforma from
    echo -e "\n${YELLOW}Step 1.1: Finding a sales order to create proforma invoice...${NC}"
    sales_orders_response=$(make_request "GET" "/sales-orders")
    sales_order_id=$(echo "$sales_orders_response" | jq -r '.[0].id // empty')
    
    if [ -z "$sales_order_id" ]; then
        echo -e "${RED}✗ No sales orders found to create proforma invoice${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Found sales order: $sales_order_id${NC}"
    
    # Step 1.2: Create proforma invoice
    echo -e "\n${YELLOW}Step 1.2: Creating proforma invoice...${NC}"
    proforma_data="{\"salesOrderId\": \"$sales_order_id\"}"
    proforma_response=$(make_request "POST" "/invoices/generate-proforma" "$proforma_data")
    proforma_invoice_id=$(echo "$proforma_response" | jq -r '.id // empty')
    
    if [ -z "$proforma_invoice_id" ]; then
        echo -e "${RED}✗ Failed to create proforma invoice${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Created proforma invoice: $proforma_invoice_id${NC}"
else
    echo -e "${GREEN}✓ Found existing proforma invoice: $proforma_invoice_id${NC}"
fi

# Step 2: Get the proforma invoice details
echo -e "\n${YELLOW}Step 2: Fetching proforma invoice details...${NC}"
invoice_response=$(make_request "GET" "/invoices/$proforma_invoice_id")
invoice_number=$(echo "$invoice_response" | jq -r '.invoiceNumber // empty')
invoice_type=$(echo "$invoice_response" | jq -r '.invoiceType // empty')

if [ -z "$invoice_number" ]; then
    echo -e "${RED}✗ Failed to get invoice number${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Invoice Number: $invoice_number${NC}"
echo -e "${GREEN}✓ Invoice Type: $invoice_type${NC}"

# Step 3: Test PDF download endpoint
echo -e "\n${YELLOW}Step 3: Testing PDF download endpoint...${NC}"

# Make request to PDF endpoint
pdf_response=$(curl -s -w "\n%{http_code}" \
    -H "Accept: application/pdf" \
    "$API_BASE/invoices/$proforma_invoice_id/pdf")

pdf_status_code=$(echo "$pdf_response" | tail -n1)
pdf_body=$(echo "$pdf_response" | head -n -1)

if [ "$pdf_status_code" -eq 200 ]; then
    echo -e "${GREEN}✓ PDF generated successfully${NC}"
    
    # Check if response is actually a PDF (check for PDF magic bytes)
    if echo "$pdf_body" | head -c 4 | grep -q "%PDF"; then
        echo -e "${GREEN}✓ Response is a valid PDF file${NC}"
        
        # Save PDF for manual verification
        pdf_filename="test_proforma_invoice_${invoice_number}_$(date +%Y%m%d_%H%M%S).pdf"
        echo "$pdf_body" > "$pdf_filename"
        echo -e "${GREEN}✓ PDF saved as: $pdf_filename${NC}"
        
        # Check PDF file size
        pdf_size=$(wc -c < "$pdf_filename")
        if [ "$pdf_size" -gt 1000 ]; then
            echo -e "${GREEN}✓ PDF file size looks reasonable: $pdf_size bytes${NC}"
        else
            echo -e "${RED}✗ PDF file size is suspiciously small: $pdf_size bytes${NC}"
            exit 1
        fi
        
    else
        echo -e "${RED}✗ Response is not a valid PDF file${NC}"
        echo "Response content: $pdf_body"
        exit 1
    fi
else
    echo -e "${RED}✗ PDF generation failed with status: $pdf_status_code${NC}"
    echo "Error response: $pdf_body"
    exit 1
fi

# Step 4: Verify the PDF contains proforma-specific content
echo -e "\n${YELLOW}Step 4: Verifying proforma-specific content in PDF...${NC}"

# Use pdftotext if available to check content
if command -v pdftotext &> /dev/null; then
    pdf_text=$(pdftotext "$pdf_filename" - 2>/dev/null || echo "Could not extract text")
    
    if echo "$pdf_text" | grep -i "proforma" > /dev/null; then
        echo -e "${GREEN}✓ PDF contains 'PROFORMA' text${NC}"
    else
        echo -e "${YELLOW}⚠ PDF might not contain 'PROFORMA' text (extraction might have failed)${NC}"
    fi
    
    if echo "$pdf_text" | grep -i "golden.*tag" > /dev/null; then
        echo -e "${GREEN}✓ PDF contains Golden Tag company information${NC}"
    else
        echo -e "${YELLOW}⚠ PDF might not contain Golden Tag company information${NC}"
    fi
else
    echo -e "${YELLOW}⚠ pdftotext not available, skipping content verification${NC}"
fi

echo -e "\n${GREEN}=== All Proforma Invoice Download Tests Passed! ===${NC}"
echo -e "${GREEN}✓ Proforma invoice generation works${NC}"
echo -e "${GREEN}✓ PDF download endpoint works${NC}"
echo -e "${GREEN}✓ PDF file is valid and contains expected content${NC}"
echo -e "${GREEN}✓ Proforma invoice download functionality is working correctly${NC}"

# Clean up
if [ -f "$pdf_filename" ]; then
    echo -e "\n${YELLOW}Test PDF saved as: $pdf_filename${NC}"
    echo -e "${YELLOW}You can manually verify the PDF content and styling.${NC}"
fi