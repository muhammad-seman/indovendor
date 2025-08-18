#!/bin/bash

echo "🚀 Setting up IndoVendor Monorepo..."

# Navigate to project root
cd /Users/macbook/Documents/PROJECT/FULLSTACK/indovendor

echo "📁 Current directory: $(pwd)"

# Remove any existing git repositories
echo "🧹 Cleaning up any existing git repositories..."
rm -rf .git 2>/dev/null || true
rm -rf frontend/.git 2>/dev/null || true
rm -rf backend/.git 2>/dev/null || true

# Initialize new git repository
echo "🔧 Initializing git repository..."
git init

# Set default branch to main
echo "🌿 Setting default branch to main..."
git branch -M main

# Add GitHub remote
echo "🔗 Adding GitHub remote..."
git remote add origin https://github.com/muhammad-seman/indovendor.git

# Add all files to staging
echo "📦 Adding all files to staging..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: IndoVendor EO/WO Marketplace Monorepo

✨ Complete marketplace foundation:
• Backend: Express.js + TypeScript + Prisma ORM + MySQL
• Frontend: Next.js 14 + TypeScript + Tailwind CSS
• Authentication: JWT middleware ready
• Database: 15-model schema (Users, Vendors, Products, Orders, etc.)
• Payment: Midtrans integration ready
• Real-time: Socket.io setup
• File Upload: Multer configuration
• Development: ESLint + Prettier configured
• Monorepo: Unified workspace with npm scripts

📁 Project Structure:
├── backend/     (Express API)
├── frontend/    (Next.js App)
├── package.json (Monorepo config)
└── docs/        (Complete documentation)

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to main branch
echo "🚀 Pushing to main branch..."
git push -u origin main

echo "✅ IndoVendor monorepo successfully initialized and pushed!"
echo "🌐 Repository: https://github.com/muhammad-seman/indovendor.git"
echo ""
echo "📋 Next steps:"
echo "  1. cd backend && npm run dev    (Start backend server)"
echo "  2. cd frontend && npm run dev   (Start frontend app)"
echo "  3. Setup database connection in backend/.env"
echo ""
echo "🎉 Happy coding!"