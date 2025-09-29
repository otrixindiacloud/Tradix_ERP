#!/bin/bash

# Compare API routes between original and modular versions

echo "=== API Route Comparison ==="
echo "Extracting routes from original routes.ts.backup..."

# Extract all API routes from the backup file
grep -n "app\.\(get\|post\|put\|delete\)" /workspaces/gt-erp/server/routes.ts.backup | \
    sed 's/.*app\.\([a-z]*\)("\([^"]*\)".*/\1 \2/' | \
    sort > /tmp/original_routes.txt

echo "Found $(wc -l < /tmp/original_routes.txt) routes in original file"

echo "Extracting routes from modular structure..."

# Extract routes from all modular files
find /workspaces/gt-erp/server/routes -name "*.ts" -not -name "index.ts" -exec grep -n "app\.\(get\|post\|put\|delete\)" {} \; | \
    sed 's/.*app\.\([a-z]*\)("\([^"]*\)".*/\1 \2/' | \
    sort > /tmp/modular_routes.txt

echo "Found $(wc -l < /tmp/modular_routes.txt) routes in modular structure"

echo ""
echo "=== Missing routes in modular structure ==="
diff /tmp/original_routes.txt /tmp/modular_routes.txt | grep "^<" | sed 's/^< //'

echo ""
echo "=== Extra routes in modular structure ==="
diff /tmp/original_routes.txt /tmp/modular_routes.txt | grep "^>" | sed 's/^> //'

echo ""
echo "=== Route distribution by module ==="
find /workspaces/gt-erp/server/routes -name "*.ts" -not -name "index.ts" | while read file; do
    count=$(grep -c "app\.\(get\|post\|put\|delete\)" "$file" 2>/dev/null || echo 0)
    echo "$(basename "$file"): $count routes"
done

echo ""
echo "=== Summary ==="
echo "Original routes: $(wc -l < /tmp/original_routes.txt)"
echo "Modular routes: $(wc -l < /tmp/modular_routes.txt)"

# Clean up
rm -f /tmp/original_routes.txt /tmp/modular_routes.txt
