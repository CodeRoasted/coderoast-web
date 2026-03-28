#!/bin/bash
# ============================================
# CodeRoast Website — MSYS2 / MinGW64 Setup
# ============================================
set -e

echo "🔥 CodeRoast Website — Setup"
echo "============================"

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "⚠️  Node.js not found. Installing via pacman..."
  pacman -S --noconfirm nodejs npm
fi

echo "📦 Node.js $(node -v)"
echo "📦 npm $(npm -v)"

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
npm install

# Start dev server
echo ""
echo "🚀 Starting development server..."
npm run dev
