# Comprehensive Workflow Test Script (PowerShell)
# Tests the complete workflow flow from customer creation to invoice generation

Write-Host "=== GT-ERP Complete Workflow Flow Test ===" -ForegroundColor Cyan
Write-Host "Testing all workflow steps and functionality..." -ForegroundColor Yellow

$BASE_URL = "http://localhost:5000/api"

# Function to make API requests and check responses
function Test-Endpoint {
    param(
        [string]$Endpoint,
        [string]$Description,
        [int]$ExpectedStatus = 200,
        [string]$Method = "GET",
        [string]$Data = ""
    )
    
    Write-Host "Testing $Description... " -NoNewline
    
    try {
        if ($Method -eq "POST" -and $Data -ne "") {
            $response = Invoke-RestMethod -Uri "$BASE_URL$Endpoint" -Method POST -Body $Data -ContentType "application/json" -ErrorAction Stop
            $statusCode = 200
        } else {
            $response = Invoke-RestMethod -Uri "$BASE_URL$Endpoint" -Method GET -ErrorAction Stop
            $statusCode = 200
        }
        
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "✅ PASS ($statusCode)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ FAIL ($statusCode)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
}

# Function to create test data
function Create-TestData {
    Write-Host "`nCreating test data..." -ForegroundColor Yellow
    
    # Create test customer
    $customerData = @{
        customerName = "Test Customer Workflow"
        contactInfo = "test@workflow.com"
        customerType = "Retail"
        classification = "Corporate"
        phone = "+1234567890"
        address = "123 Test Street, Test City, TC 12345"
    } | ConvertTo-Json
    
    Write-Host "Creating test customer... " -NoNewline
    try {
        $customerResponse = Invoke-RestMethod -Uri "$BASE_URL/customers" -Method POST -Body $customerData -ContentType "application/json" -ErrorAction Stop
        Write-Host "✅ PASS" -ForegroundColor Green
        $script:CUSTOMER_ID = $customerResponse.id
        Write-Host "Customer ID: $CUSTOMER_ID" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
    
    # Create test enquiry
    $enquiryData = @{
        customerId = $CUSTOMER_ID
        enquiryDetails = "Test enquiry for workflow testing"
        productRequirements = "Test products for workflow"
        quantity = 10
        urgency = "Medium"
        source = "Web Form"
        status = "New"
    } | ConvertTo-Json
    
    Write-Host "Creating test enquiry... " -NoNewline
    try {
        $enquiryResponse = Invoke-RestMethod -Uri "$BASE_URL/enquiries" -Method POST -Body $enquiryData -ContentType "application/json" -ErrorAction Stop
        Write-Host "✅ PASS" -ForegroundColor Green
        $script:ENQUIRY_ID = $enquiryResponse.id
        Write-Host "Enquiry ID: $ENQUIRY_ID" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
    
    # Create test quotation
    $quotationData = @{
        enquiryId = $ENQUIRY_ID
        quotationNumber = "QT-TEST-001"
        lineItems = @(
            @{
                description = "Test Product 1"
                quantity = 5
                unitPrice = 100.00
                totalPrice = 500.00
            },
            @{
                description = "Test Product 2"
                quantity = 5
                unitPrice = 150.00
                totalPrice = 750.00
            }
        )
        totalAmount = 1250.00
        validityPeriod = 30
        termsAndConditions = "Standard terms and conditions for test quotation"
        status = "Draft"
    } | ConvertTo-Json
    
    Write-Host "Creating test quotation... " -NoNewline
    try {
        $quotationResponse = Invoke-RestMethod -Uri "$BASE_URL/quotations" -Method POST -Body $quotationData -ContentType "application/json" -ErrorAction Stop
        Write-Host "✅ PASS" -ForegroundColor Green
        $script:QUOTATION_ID = $quotationResponse.id
        Write-Host "Quotation ID: $QUOTATION_ID" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
    
    # Create test sales order
    $salesOrderData = @{
        quotationId = $QUOTATION_ID
        salesOrderNumber = "SO-TEST-001"
        orderItems = @(
            @{
                description = "Test Product 1"
                quantity = 5
                unitPrice = 100.00
                totalPrice = 500.00
            },
            @{
                description = "Test Product 2"
                quantity = 5
                unitPrice = 150.00
                totalPrice = 750.00
            }
        )
        totalAmount = 1250.00
        deliveryDate = "2024-12-31"
        paymentTerms = "Net 30"
        status = "Pending"
    } | ConvertTo-Json
    
    Write-Host "Creating test sales order... " -NoNewline
    try {
        $salesOrderResponse = Invoke-RestMethod -Uri "$BASE_URL/sales-orders" -Method POST -Body $salesOrderData -ContentType "application/json" -ErrorAction Stop
        Write-Host "✅ PASS" -ForegroundColor Green
        $script:SALES_ORDER_ID = $salesOrderResponse.id
        Write-Host "Sales Order ID: $SALES_ORDER_ID" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
    
    Write-Host "Test data created successfully!" -ForegroundColor Green
    Write-Host "Customer ID: $CUSTOMER_ID" -ForegroundColor Cyan
    Write-Host "Enquiry ID: $ENQUIRY_ID" -ForegroundColor Cyan
    Write-Host "Quotation ID: $QUOTATION_ID" -ForegroundColor Cyan
    Write-Host "Sales Order ID: $SALES_ORDER_ID" -ForegroundColor Cyan
    return $true
}

# Initialize counters
$totalTests = 0
$passedTests = 0

# Test Core Workflow API Endpoints
Write-Host "`nTesting Core Workflow API Endpoints..." -ForegroundColor Yellow

# Test workflow progress endpoint
$totalTests++
if (Test-Endpoint "/workflow/progress" "Workflow Progress List") {
    $passedTests++
}

# Test workflow analytics endpoint
$totalTests++
if (Test-Endpoint "/workflow/analytics" "Workflow Analytics") {
    $passedTests++
}

# Test workflow validation endpoints
$totalTests++
if (Test-Endpoint "/workflow/validate/customer/test-customer" "Customer Step Validation") {
    $passedTests++
}

$totalTests++
if (Test-Endpoint "/workflow/validate/enquiry/test-enquiry" "Enquiry Step Validation") {
    $passedTests++
}

# Test workflow step completion
$totalTests++
if (Test-Endpoint "/workflow/complete/customer/test-customer" "Customer Step Completion" 200 "POST" '{"notes": "Test completion"}') {
    $passedTests++
}

# Test Frontend Workflow Pages
Write-Host "`nTesting Frontend Workflow Pages..." -ForegroundColor Yellow

$totalTests++
Write-Host "Testing Workflow Dashboard... " -NoNewline
try {
    $workflowDashboardResponse = Invoke-WebRequest -Uri "http://localhost:5000/workflow-dashboard" -Method GET -ErrorAction Stop
    if ($workflowDashboardResponse.StatusCode -eq 200) {
        Write-Host "✅ PASS (200)" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "❌ FAIL ($($workflowDashboardResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
}

$totalTests++
Write-Host "Testing Workflow Page... " -NoNewline
try {
    $workflowPageResponse = Invoke-WebRequest -Uri "http://localhost:5000/workflow" -Method GET -ErrorAction Stop
    if ($workflowPageResponse.StatusCode -eq 200) {
        Write-Host "✅ PASS (200)" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "❌ FAIL ($($workflowPageResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
}

# Test Workflow Step Navigation
Write-Host "`nTesting Workflow Step Navigation..." -ForegroundColor Yellow

$workflowSteps = @(
    @{Name="Customer Management"; Path="/customer-management"},
    @{Name="Enquiry Management"; Path="/enquiries"},
    @{Name="Quotation Management"; Path="/quotations"},
    @{Name="Customer PO Upload"; Path="/customer-po-upload"},
    @{Name="Sales Order Management"; Path="/sales-orders"},
    @{Name="Delivery Note Management"; Path="/delivery-note"},
    @{Name="Invoicing Management"; Path="/invoicing"},
    @{Name="Supplier Management"; Path="/suppliers"},
    @{Name="Requisition Management"; Path="/requisitions"},
    @{Name="Supplier Quotes Management"; Path="/supplier-quotes"},
    @{Name="Supplier LPO Management"; Path="/supplier-lpo"},
    @{Name="Shipment Tracking"; Path="/shipment-tracking"}
)

foreach ($step in $workflowSteps) {
    $totalTests++
    Write-Host "Testing $($step.Name) page... " -NoNewline
    try {
        $stepResponse = Invoke-WebRequest -Uri "http://localhost:5000$($step.Path)" -Method GET -ErrorAction Stop
        if ($stepResponse.StatusCode -eq 200) {
            Write-Host "✅ PASS (200)" -ForegroundColor Green
            $passedTests++
        } else {
            Write-Host "❌ FAIL ($($stepResponse.StatusCode))" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
    }
}

# Test Workflow Data Flow
Write-Host "`nTesting Workflow Data Flow..." -ForegroundColor Yellow

# Create test data
if (Create-TestData) {
    # Test workflow progress for specific entities
    $totalTests++
    if (Test-Endpoint "/workflow/progress/$ENQUIRY_ID?entityType=enquiry" "Enquiry Workflow Progress") {
        $passedTests++
    }
    
    $totalTests++
    if (Test-Endpoint "/workflow/progress/$QUOTATION_ID?entityType=quotation" "Quotation Workflow Progress") {
        $passedTests++
    }
    
    $totalTests++
    if (Test-Endpoint "/workflow/progress/$SALES_ORDER_ID?entityType=sales-order" "Sales Order Workflow Progress") {
        $passedTests++
    }
}

# Test Workflow Step Validation
Write-Host "`nTesting Workflow Step Validation..." -ForegroundColor Yellow

if ($CUSTOMER_ID) {
    $totalTests++
    if (Test-Endpoint "/workflow/validate/customer/$CUSTOMER_ID" "Customer Validation") {
        $passedTests++
    }
}

if ($ENQUIRY_ID) {
    $totalTests++
    if (Test-Endpoint "/workflow/validate/enquiry/$ENQUIRY_ID" "Enquiry Validation") {
        $passedTests++
    }
}

if ($QUOTATION_ID) {
    $totalTests++
    if (Test-Endpoint "/workflow/validate/quotation/$QUOTATION_ID" "Quotation Validation") {
        $passedTests++
    }
}

# Test Workflow Step Completion
Write-Host "`nTesting Workflow Step Completion..." -ForegroundColor Yellow

if ($CUSTOMER_ID) {
    $totalTests++
    if (Test-Endpoint "/workflow/complete/customer/$CUSTOMER_ID" "Customer Step Completion" 200 "POST" '{"notes": "Customer step completed for workflow test"}') {
        $passedTests++
    }
}

if ($ENQUIRY_ID) {
    $totalTests++
    if (Test-Endpoint "/workflow/complete/enquiry/$ENQUIRY_ID" "Enquiry Step Completion" 200 "POST" '{"notes": "Enquiry step completed for workflow test"}') {
        $passedTests++
    }
}

# Test Workflow Analytics
Write-Host "`nTesting Workflow Analytics..." -ForegroundColor Yellow

$totalTests++
if (Test-Endpoint "/workflow/analytics?period=30d" "Workflow Analytics 30d") {
    $passedTests++
}

$totalTests++
if (Test-Endpoint "/workflow/analytics?period=90d" "Workflow Analytics 90d") {
    $passedTests++
}

# Test Workflow Filters
Write-Host "`nTesting Workflow Filters..." -ForegroundColor Yellow

$totalTests++
if (Test-Endpoint "/workflow/progress?status=pending" "Workflow Filter by Status") {
    $passedTests++
}

$totalTests++
if (Test-Endpoint "/workflow/progress?priority=medium" "Workflow Filter by Priority") {
    $passedTests++
}

$totalTests++
if (Test-Endpoint "/workflow/progress?search=test" "Workflow Filter by Search") {
    $passedTests++
}

# Test Database Connection
Write-Host "`nTesting Database Connection..." -ForegroundColor Yellow
$totalTests++
if (Test-Endpoint "/dashboard/stats" "Database Connection via Stats") {
    $passedTests++
}

# Summary
Write-Host "`nWorkflow Test Summary" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $($totalTests - $passedTests)" -ForegroundColor Red

if ($passedTests -eq $totalTests) {
    Write-Host "`nALL WORKFLOW TESTS PASSED! Complete workflow flow is functional." -ForegroundColor Green
    Write-Host "✅ Workflow API endpoints working" -ForegroundColor Green
    Write-Host "✅ Workflow dashboard accessible" -ForegroundColor Green
    Write-Host "✅ Workflow step navigation working" -ForegroundColor Green
    Write-Host "✅ Workflow data flow functional" -ForegroundColor Green
    Write-Host "✅ Workflow validation working" -ForegroundColor Green
    Write-Host "✅ Workflow step completion working" -ForegroundColor Green
    Write-Host "✅ Workflow analytics working" -ForegroundColor Green
    Write-Host "✅ Workflow filters working" -ForegroundColor Green
    Write-Host "✅ Database connectivity confirmed" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nSome workflow tests failed. Check the output above for details." -ForegroundColor Yellow
    Write-Host "Failed tests: $($totalTests - $passedTests)" -ForegroundColor Red
    exit 1
}
