#!/bin/bash

echo "=== Route Comparison: Original vs Modular ==="
echo

# Extract all route patterns from the backup file
echo "Extracting routes from routes.ts.backup..."
grep -E "app\.(get|post|put|delete)\(" server/routes.ts.backup | sed 's/.*app\.\(get\|post\|put\|delete\)("\([^"]*\)".*/\2 [\1]/' | sort > /tmp/original_routes.txt

echo "Found $(wc -l < /tmp/original_routes.txt) routes in original file"
echo

# Extract all route patterns from modular files
echo "Extracting routes from modular files..."
find server/routes -name "*.ts" -exec grep -H -E "app\.(get|post|put|delete)\(" {} \; | sed 's/.*app\.\(get\|post\|put\|delete\)("\([^"]*\)".*/\2 [\1]/' | sort > /tmp/modular_routes.txt

echo "Found $(wc -l < /tmp/modular_routes.txt) routes in modular files"
echo

# Compare the routes
echo "=== MISSING ROUTES IN MODULAR FILES ==="
diff /tmp/original_routes.txt /tmp/modular_routes.txt | grep "^<" | sed 's/^< //'
echo

echo "=== EXTRA ROUTES IN MODULAR FILES ==="
diff /tmp/original_routes.txt /tmp/modular_routes.txt | grep "^>" | sed 's/^> //'
echo

echo "=== ROUTE COUNT COMPARISON ==="
echo "Original: $(wc -l < /tmp/original_routes.txt) routes"
echo "Modular:  $(wc -l < /tmp/modular_routes.txt) routes"
echo

# Show the route distribution across modules
echo "=== ROUTE DISTRIBUTION BY MODULE ==="
find server/routes -name "*.ts" -exec sh -c 'echo "$(basename "$1" .ts): $(grep -c "app\." "$1") routes"' _ {} \; | sort

echo
echo "=== DETAILED ROUTE ANALYSIS ==="
echo "Original routes:"
cat /tmp/original_routes.txt
echo
echo "Modular routes:"
cat /tmp/modular_routes.txt

# Clean up
rm -f /tmp/original_routes.txt /tmp/modular_routes.txt
