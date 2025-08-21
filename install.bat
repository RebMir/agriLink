@echo off
echo 🌾 Welcome to AgriLink - Smart Agriculture Marketplace Setup
echo ==========================================================

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pnpm is not installed. Please install pnpm first:
    echo npm install -g pnpm
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

REM Install root dependencies
echo 📦 Installing root dependencies...
pnpm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
pnpm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
pnpm install
cd ..

echo.
echo 🎉 Installation completed successfully!
echo.
echo 📋 Next steps:
echo 1. Copy backend/env.example to backend/.env and configure your environment variables
echo 2. Set up your MongoDB database
echo 3. Configure your OpenAI API key for AI features
echo 4. Configure your OpenWeatherMap API key for weather features
echo.
echo 🚀 To start development:
echo pnpm dev
echo.
echo 📚 For more information, check the README.md file
pause 