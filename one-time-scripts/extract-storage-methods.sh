#!/bin/bash

# Script to help extract storage methods by module

STORAGE_FILE="/workspaces/gt-erp/server/storage.ts"

echo "=== QUOTATION METHODS ==="
grep -n "async.*Quotation\|async.*quotation\|generateQuotationFromEnquiry\|createQuotationRevision\|getQuotationRevisions\|getQuotationHistory" "$STORAGE_FILE" | head -20

echo -e "\n=== APPROVAL METHODS ==="
grep -n "async.*Approval\|async.*approval\|determineRequiredApprovalLevel" "$STORAGE_FILE" | head -10

echo -e "\n=== CUSTOMER ACCEPTANCE METHODS ==="
grep -n "async.*CustomerAcceptance\|async.*customerAcceptance\|async.*QuotationItemAcceptance\|async.*quotationItemAcceptance\|async.*AcceptanceConfirmation\|async.*acceptanceConfirmation" "$STORAGE_FILE" | head -15

echo -e "\n=== PURCHASE ORDER METHODS ==="
grep -n "async.*PurchaseOrder\|async.*purchaseOrder\|async.*PoLineItem\|async.*poLineItem\|validatePurchaseOrder" "$STORAGE_FILE" | head -15

echo -e "\n=== SALES ORDER METHODS ==="
grep -n "async.*SalesOrder\|async.*salesOrder\|createSalesOrderFromQuotation\|createAmendedSalesOrder\|validateCustomerLpo" "$STORAGE_FILE" | head -20
