#!/bin/bash

# FDHC DMS - Deployment Script
# Run this script to deploy the DMS

echo "=========================================="
echo "FDHC DMS Deployment Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm is installed"

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  .env.local not found!"
    echo "Creating from template..."
    cp .env.local.example .env.local
    echo ""
    echo "📝 Please edit .env.local and add your Supabase credentials:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - DEFAULT_ORG_ID"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ .env.local found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Build the project
echo ""
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo ""
    echo "🚀 Vercel CLI detected"
    echo "Would you like to deploy to Vercel? (y/n)"
    read -r DEPLOY
    
    if [ "$DEPLOY" = "y" ]; then
        echo ""
        echo "Deploying to Vercel..."
        vercel --prod
    fi
else
    echo ""
    echo "ℹ️  To deploy to Vercel, install the CLI:"
    echo "   npm install -g vercel"
    echo "   vercel login"
    echo "   vercel --prod"
fi

echo ""
echo "=========================================="
echo "✅ Deployment preparation complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:3000"
echo "3. Test the application"
echo ""
echo "For production deployment:"
echo "1. Set up environment variables in Vercel"
echo "2. Run: vercel --prod"
echo ""
