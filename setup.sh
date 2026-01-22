#!/bin/bash

# CRM Template Pro - Installation Script
# Script de configuration et démarrage du projet

set -e

echo "================================================"
echo "CRM Template Pro - Setup & Configuration"
echo "================================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Run development server
echo "================================================"
echo "🚀 Starting development server..."
echo "================================================"
echo ""
echo "The application will be available at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

npm run dev
