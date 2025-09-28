#!/bin/bash

echo "🔍 Storage Modularization Completeness Check"
echo "============================================="
echo

# Extract all method signatures from backup
echo "📋 Extracting methods from original storage.ts.backup..."
grep -E "^\s*async\s+(get|create|update|delete|bulk|generate|validate|approve|reject|confirm|start|complete|send|mark|log|determine|adjust|scan|verify|convert)" server/storage.ts.backup | \
sed 's/^\s*//' | \
sed 's/\s*{.*$//' | \
sort > /tmp/backup_methods.txt

echo "Found $(wc -l < /tmp/backup_methods.txt) methods in backup"

# Extract all method signatures from current modular storage
echo "📋 Extracting methods from current modular storage.ts..."
grep -E "^\s*async\s+(get|create|update|delete|bulk|generate|validate|approve|reject|confirm|start|complete|send|mark|log|determine|adjust|scan|verify|convert)" server/storage.ts | \
sed 's/^\s*//' | \
sed 's/\s*{.*$//' | \
sort > /tmp/current_methods.txt

echo "Found $(wc -l < /tmp/current_methods.txt) methods in current"

# Extract methods from storage modules
echo "📋 Extracting methods from storage modules..."
find server/storage -name "*.ts" -exec grep -H -E "^\s*async\s+(get|create|update|delete|bulk)" {} \; | \
cut -d: -f2- | \
sed 's/^\s*//' | \
sed 's/\s*{.*$//' | \
sort > /tmp/module_methods.txt

echo "Found $(wc -l < /tmp/module_methods.txt) methods in modules"

echo
echo "🔍 Comparing methods..."

# Find missing methods
echo "❌ MISSING METHODS from modular storage:"
echo "========================================"
comm -23 /tmp/backup_methods.txt /tmp/current_methods.txt > /tmp/missing_methods.txt

if [ -s /tmp/missing_methods.txt ]; then
    cat /tmp/missing_methods.txt
    echo
    echo "Total missing: $(wc -l < /tmp/missing_methods.txt) methods"
else
    echo "✅ No missing methods found!"
fi

echo
echo "📊 CATEGORY BREAKDOWN:"
echo "====================="

# Count methods by category
echo "User methods:"
echo "  Backup: $(grep -c "User\|user" /tmp/backup_methods.txt)"
echo "  Current: $(grep -c -i "user" /tmp/current_methods.txt)"

echo "Customer methods:"
echo "  Backup: $(grep -c -i "customer" /tmp/backup_methods.txt)"
echo "  Current: $(grep -c -i "customer" /tmp/current_methods.txt)"

echo "Supplier methods:"
echo "  Backup: $(grep -c -i "supplier" /tmp/backup_methods.txt)"
echo "  Current: $(grep -c -i "supplier" /tmp/current_methods.txt)"

echo "Item methods:"
echo "  Backup: $(grep -c -i "item\|inventory" /tmp/backup_methods.txt)"
echo "  Current: $(grep -c -i "item\|inventory" /tmp/current_methods.txt)"

echo "Enquiry methods:"
echo "  Backup: $(grep -c -i "enquiry" /tmp/backup_methods.txt)"
echo "  Current: $(grep -c -i "enquiry" /tmp/current_methods.txt)"

echo "Quotation methods:"
echo "  Backup: $(grep -c -i "quotation" /tmp/backup_methods.txt)"
echo "  Current: $(grep -c -i "quotation" /tmp/current_methods.txt)"

echo "Sales Order methods:"
echo "  Backup: $(grep -c -i "salesorder\|sales" /tmp/backup_methods.txt)"
echo "  Current: $(grep -c -i "salesorder\|sales" /tmp/current_methods.txt)"

echo "Purchase Order methods:"
echo "  Backup: $(grep -c -i "purchaseorder\|purchase" /tmp/backup_methods.txt)"
echo "  Current: $(grep -c -i "purchaseorder\|purchase" /tmp/current_methods.txt)"

echo "Delivery methods:"
echo "  Backup: $(grep -c -i "delivery" /tmp/backup_methods.txt)"
echo "  Current: $(grep -c -i "delivery" /tmp/current_methods.txt)"

echo "Invoice methods:"
echo "  Backup: $(grep -c -i "invoice" /tmp/backup_methods.txt)"
echo "  Current: $(grep -c -i "invoice" /tmp/current_methods.txt)"

echo "Credit Note methods:"
echo "  Backup: $(grep -c -i "creditnote\|credit" /tmp/backup_methods.txt)"
echo "  Current: $(grep -c -i "creditnote\|credit" /tmp/current_methods.txt)"

echo "Inventory methods:"
echo "  Backup: $(grep -c -i "inventory\|stock\|goods" /tmp/backup_methods.txt)"
echo "  Current: $(grep -c -i "inventory\|stock\|goods" /tmp/current_methods.txt)"

echo "Pricing methods:"
echo "  Backup: $(grep -c -i "pricing\|price\|markup\|cost" /tmp/backup_methods.txt)"
echo "  Current: $(grep -c -i "pricing\|price\|markup\|cost" /tmp/current_methods.txt)"

echo
echo "🔍 COMPLEX OPERATIONS STATUS:"
echo "============================="

# Check for complex operations that might be missing
echo "Checking critical business operations..."

missing_complex=()

# Check for pricing operations
if ! grep -q "calculatePricesForItem\|calculateEffectivePrice" server/storage.ts; then
    missing_complex+=("❌ Pricing calculation methods")
else
    echo "✅ Pricing calculation methods found"
fi

# Check for approval workflows
if ! grep -q "approveSupplierLpo\|rejectSupplierLpo" server/storage.ts; then
    missing_complex+=("❌ Approval workflow methods")
else
    echo "✅ Approval workflow methods found"
fi

# Check for bulk operations
if ! grep -q "bulkCreate\|processBulkMarkupUpdate" server/storage.ts; then
    missing_complex+=("❌ Bulk operation methods")
else
    echo "✅ Bulk operation methods found"
fi

# Check for dashboard stats
if ! grep -q "getDashboardStats" server/storage.ts; then
    missing_complex+=("❌ Dashboard statistics methods")
else
    echo "✅ Dashboard statistics methods found"
fi

# Check for barcode scanning
if ! grep -q "verifyItemBarcode\|scanItemForPicking" server/storage.ts; then
    missing_complex+=("❌ Barcode scanning methods")
else
    echo "✅ Barcode scanning methods found"
fi

# Check for currency conversion
if ! grep -q "convertCurrency\|getExchangeRate" server/storage.ts; then
    missing_complex+=("❌ Currency conversion methods")
else
    echo "✅ Currency conversion methods found"
fi

echo
if [ ${#missing_complex[@]} -gt 0 ]; then
    echo "⚠️ MISSING COMPLEX OPERATIONS:"
    for op in "${missing_complex[@]}"; do
        echo "  $op"
    done
else
    echo "✅ All complex operations preserved!"
fi

echo
echo "🧪 INTERFACE COMPLIANCE CHECK:"
echo "=============================="

# Check if all interface methods are implemented
if [ -f "server/storage/interfaces.ts" ]; then
    interface_methods=$(grep -E "^\s*(get|create|update|delete|bulk)" server/storage/interfaces.ts | wc -l)
    echo "Interface methods defined: $interface_methods"
    
    implemented_methods=$(grep -E "^\s*async\s*(get|create|update|delete|bulk)" server/storage.ts | wc -l)
    echo "Methods implemented: $implemented_methods"
    
    if [ $implemented_methods -ge $interface_methods ]; then
        echo "✅ Interface compliance: GOOD"
    else
        echo "⚠️ Interface compliance: Some methods may be missing"
    fi
else
    echo "⚠️ Interface file not found"
fi

echo
echo "📝 SUMMARY:"
echo "==========="
echo "Original methods: $(wc -l < /tmp/backup_methods.txt)"
echo "Current methods: $(wc -l < /tmp/current_methods.txt)"
echo "Missing methods: $(wc -l < /tmp/missing_methods.txt)"

coverage=$(( 100 * ($(wc -l < /tmp/current_methods.txt) / $(wc -l < /tmp/backup_methods.txt)) ))
echo "Coverage: ${coverage}%"

if [ $coverage -ge 95 ]; then
    echo "🎉 EXCELLENT: Modularization is nearly complete!"
elif [ $coverage -ge 80 ]; then
    echo "👍 GOOD: Most functionality preserved"
elif [ $coverage -ge 60 ]; then
    echo "⚠️ FAIR: Significant methods missing"
else
    echo "❌ POOR: Major functionality missing"
fi

echo
echo "💡 RECOMMENDATIONS:"
echo "==================="
if [ -s /tmp/missing_methods.txt ]; then
    echo "1. Implement missing methods identified above"
    echo "2. Focus on complex business operations first"
    echo "3. Add placeholder implementations for less critical methods"
    echo "4. Test critical user journeys (quotation → sales order → delivery → invoice)"
else
    echo "1. ✅ All methods are present!"
    echo "2. Run functional tests to ensure business logic is preserved"
    echo "3. Consider performance testing with the new modular structure"
fi

# Clean up temp files
rm -f /tmp/backup_methods.txt /tmp/current_methods.txt /tmp/module_methods.txt /tmp/missing_methods.txt
