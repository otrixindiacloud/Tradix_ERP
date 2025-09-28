#!/bin/bash

echo "Storage Modularization Comparison Report"
echo "========================================"
echo

# Check file sizes
echo "File Size Comparison:"
echo "Original storage.ts.backup: $(wc -l < server/storage.ts.backup) lines"
echo "Modularized storage.ts: $(wc -l < server/storage.ts) lines"
echo "Reduction: $(($(wc -l < server/storage.ts.backup) - $(wc -l < server/storage.ts))) lines"
echo

# List all storage modules created
echo "Storage Modules Created:"
echo "========================"
if [ -d "server/storage" ]; then
    ls -la server/storage/
    echo
    for file in server/storage/*.ts; do
        if [ -f "$file" ]; then
            echo "$(basename "$file"): $(wc -l < "$file") lines"
        fi
    done
else
    echo "Storage modules directory not found!"
fi

echo
echo "Total modular files: $(find server/storage -name "*.ts" -type f | wc -l) files"
echo "Total modular lines: $(find server/storage -name "*.ts" -type f -exec cat {} \; | wc -l) lines"

echo
echo "Checking for compilation errors..."
npx tsc --noEmit --project tsconfig.json > /tmp/storage-errors.log 2>&1
if [ $? -eq 0 ]; then
    echo "✅ No TypeScript compilation errors found"
else
    echo "❌ TypeScript compilation errors found:"
    head -20 /tmp/storage-errors.log
fi

echo
echo "Checking if server can start..."
timeout 10s npm run dev > /tmp/server-start.log 2>&1 &
SERVER_PID=$!
sleep 5
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server started successfully"
    kill $SERVER_PID
else
    echo "❌ Server failed to start:"
    head -10 /tmp/server-start.log
fi

echo
echo "API endpoints status (sample check):"
echo "===================================="
# This would need the server running to actually test
echo "To test APIs manually, run: npm run dev"
echo "Then test endpoints like:"
echo "- GET /api/enquiries"
echo "- GET /api/customers" 
echo "- GET /api/quotations"
echo "- etc."
