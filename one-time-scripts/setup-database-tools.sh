#!/bin/bash

# Database Management Tools Setup Script
# This script makes the database management tools executable and sets up the environment

echo "🔧 Setting up Database Management Tools"
echo "======================================"

# Make scripts executable
echo "Making scripts executable..."
chmod +x one-time-scripts/validate-and-fix-database.mjs
chmod +x one-time-scripts/database-health-check.mjs
chmod +x one-time-scripts/comprehensive-database-check.mjs

echo "✅ Scripts are now executable"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm is installed"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=your_database_connection_string_here

# Environment
NODE_ENV=development

# Add your other environment variables here
EOF
    echo "📝 Please update .env file with your database connection string"
else
    echo "✅ .env file exists"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies are installed"
fi

echo ""
echo "🎉 Database Management Tools Setup Complete!"
echo ""
echo "Available commands:"
echo "  node one-time-scripts/database-health-check.mjs [--verbose] [--export]"
echo "  node one-time-scripts/validate-and-fix-database.mjs [--fix] [--verbose] [--export]"
echo "  node one-time-scripts/comprehensive-database-check.mjs [--fix] [--verbose] [--export]"
echo ""
echo "Frontend access:"
echo "  Navigate to /database-management in your application"
echo ""
echo "Documentation:"
echo "  See documentation/DATABASE_MANAGEMENT_SYSTEM.md for detailed usage"
