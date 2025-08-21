#!/bin/bash

echo "🌾 Welcome to AgriLink - Smart Agriculture Marketplace Setup"
echo "=========================================================="

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
pnpm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pnpm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
pnpm install
cd ..

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Copy backend/env.example to backend/.env and configure your environment variables"
echo "2. Set up your MongoDB database"
echo "3. Configure your OpenAI API key for AI features"
echo "4. Configure your OpenWeatherMap API key for weather features"
echo ""
echo "🚀 To start development:"
echo "pnpm dev"
echo ""
echo "📚 For more information, check the README.md file" 