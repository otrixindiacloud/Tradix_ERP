#!/bin/bash

# Database setup script for GT-ERP
echo "Setting up GT-ERP database..."

# Stop any running dev server
pkill -f "tsx server/index.ts" 2>/dev/null || true

# Try to push the schema
echo "Pushing database schema..."
npx drizzle-kit push --force --verbose

if [ $? -eq 0 ]; then
    echo "✅ Database schema updated successfully"
else
    echo "⚠️  Database schema push failed or was interrupted"
    echo "The application will continue to work with existing tables"
fi

# Start the development server
echo "Starting development server..."
npm run dev
