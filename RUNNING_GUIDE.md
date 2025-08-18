# 🚀 IndoVendor - Development Running Guide

## 📁 Project Structure
```
indovendor/
├── backend/           # Express.js API server
├── frontend/          # Next.js web application  
├── package.json       # Monorepo configuration
└── RUNNING_GUIDE.md   # This guide
```

---

## ⚡ Quick Start (Both Backend + Frontend)

### 1. Install All Dependencies
```bash
cd /Users/macbook/Documents/PROJECT/FULLSTACK/indovendor
npm run install:all
```

### 2. Setup Environment Variables
```bash
# Copy and configure backend environment
cp backend/.env.example backend/.env

# Edit backend/.env with your settings:
# - DATABASE_URL (MySQL)
# - JWT_SECRET & JWT_REFRESH_SECRET
# - BCRYPT_SALT_ROUNDS
```

### 3. Setup Database
```bash
cd backend
npm run db:setup    # Generate + Migrate + Seed
```

### 4. Start Development Servers

**Option A: Both servers in separate terminals**
```bash
# Terminal 1 - Backend (Port 5000)
cd /Users/macbook/Documents/PROJECT/FULLSTACK/indovendor
npm run dev:backend

# Terminal 2 - Frontend (Port 3000)  
cd /Users/macbook/Documents/PROJECT/FULLSTACK/indovendor
npm run dev:frontend
```

**Option B: From individual directories**
```bash
# Backend only
cd /Users/macbook/Documents/PROJECT/FULLSTACK/indovendor/backend
npm run dev

# Frontend only  
cd /Users/macbook/Documents/PROJECT/FULLSTACK/indovendor/frontend
npm run dev
```

---

## 🔧 Backend Development

### 📍 Backend Directory: `backend/`

### Available Scripts:
```bash
cd /Users/macbook/Documents/PROJECT/FULLSTACK/indovendor/backend

# Development
npm run dev              # Start development server (nodemon)
npm run build           # Build TypeScript to JavaScript
npm run start           # Start production server

# Code Quality
npm run lint            # Check code with ESLint
npm run lint:fix        # Fix ESLint errors automatically
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting

# Database Management
npm run db:generate     # Generate Prisma client
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio (GUI)
npm run db:reset        # Reset database (WARNING: deletes data)
npm run db:setup        # Complete setup (generate + migrate + seed)
npm run db:test         # Test database connection

# Authentication Testing
npm run auth:test       # Test authentication system
npm run auth:health     # Quick auth health check
npm run test:all        # Test database + authentication
```

### 🌐 Backend Server Details:
- **URL**: `http://localhost:5000`
- **API Base**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`
- **Database Health**: `http://localhost:5000/api/health/database`

### 🔐 Authentication Endpoints:
```
POST /api/auth/register      # Register new user (all roles)
POST /api/auth/login         # User login
POST /api/auth/logout        # User logout
GET  /api/auth/me           # Get current user profile
POST /api/auth/refresh-token # Refresh access token
GET  /api/auth/verify-token  # Verify token validity
```

### 🗄️ Database Requirements:
- **MySQL** server running
- **DATABASE_URL** configured in `.env`
- **Migrations** applied: `npm run db:migrate`
- **Seed data** loaded: `npm run db:seed`

---

## 🎨 Frontend Development

### 📍 Frontend Directory: `frontend/`

### Available Scripts:
```bash
cd /Users/macbook/Documents/PROJECT/FULLSTACK/indovendor/frontend

# Development
npm run dev             # Start Next.js development server
npm run build           # Build for production
npm run start           # Start production server
npm run export          # Export static site

# Code Quality
npm run lint            # Check code with ESLint
npm run lint:fix        # Fix ESLint errors automatically
npm run type-check      # Check TypeScript types
```

### 🌐 Frontend Server Details:
- **URL**: `http://localhost:3000`
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **API Integration**: Ready for backend connection

### 🔗 Frontend → Backend Connection:
- API calls to: `http://localhost:5000/api`
- Authentication integration ready
- Type-safe API client configured

---

## 🔍 Testing & Health Checks

### Backend Testing:
```bash
cd /Users/macbook/Documents/PROJECT/FULLSTACK/indovendor/backend

# Test everything
npm run test:all

# Test individual systems
npm run db:test         # Database connection
npm run auth:test       # Authentication system
npm run auth:health     # Quick auth check
```

### Health Check URLs:
- **API Health**: `http://localhost:5000/api/health`
- **DB Health**: `http://localhost:5000/api/health/database`
- **Frontend**: `http://localhost:3000`

---

## 🚨 Troubleshooting

### Backend Won't Start:
```bash
# Check database connection
npm run db:test

# Check environment variables
cat backend/.env

# Check if migrations are applied
npm run db:migrate

# Check for TypeScript errors
npm run build
```

### Frontend Won't Start:
```bash
# Check if dependencies installed
npm install

# Check for TypeScript errors  
npm run type-check

# Check Next.js configuration
npm run build
```

### Database Issues:
```bash
# Reset database (WARNING: deletes data)
npm run db:reset

# Reapply migrations
npm run db:migrate

# Reseed data
npm run db:seed

# Open database GUI
npm run db:studio
```

### Authentication Issues:
```bash
# Test auth system
npm run auth:test

# Check JWT secrets in .env
echo $JWT_SECRET

# Test specific endpoints with curl
curl -X GET http://localhost:5000/api/health
```

---

## 🔧 Development Workflow

### 1. Daily Development:
```bash
# Start both servers
cd /Users/macbook/Documents/PROJECT/FULLSTACK/indovendor

# Terminal 1
npm run dev:backend

# Terminal 2  
npm run dev:frontend
```

### 2. Before Committing:
```bash
# Backend checks
cd backend
npm run lint
npm run format:check
npm run build
npm run test:all

# Frontend checks
cd ../frontend
npm run lint
npm run type-check
npm run build
```

### 3. Production Build:
```bash
# Build both
npm run build:backend
npm run build:frontend

# Start production
cd backend && npm start
cd frontend && npm start
```

---

## 📋 Environment Variables

### Backend `.env` Template:
```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/indovendor"

# JWT Secrets (use strong, unique values)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-jwt-refresh-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Password Security
BCRYPT_SALT_ROUNDS=12

# Optional Features
REQUIRE_EMAIL_VERIFICATION=false
NODE_ENV=development
PORT=5000
```

### Frontend `.env.local` Template:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional
NEXT_PUBLIC_NODE_ENV=development
```

---

## 🎯 Current Status

### ✅ Phase 1 - COMPLETE:
- ✅ Project setup (Next.js + Express.js)
- ✅ Database schema (MySQL + Prisma)  
- ✅ Authentication foundation

### ✅ Phase 2.1 - COMPLETE:
- ✅ Backend Auth APIs (5 endpoints)
- ✅ Enhanced security features
- ✅ Production-ready error handling

### 🔄 Next: Phase 2.2:
- Frontend Auth Integration
- Login/Register forms
- Protected routes
- User dashboard

---

## 💡 Tips & Best Practices

1. **Always run both servers** for full development
2. **Check health endpoints** if something's not working  
3. **Use `npm run test:all`** before committing
4. **Keep `.env` files secure** (never commit them)
5. **Use TypeScript strictly** for better code quality
6. **Check database connection** if auth fails
7. **Use Prisma Studio** for database inspection
8. **Monitor server logs** for debugging

---

**Happy Coding!** 🚀

Need help? Check the logs, run health checks, or refer to the authentication documentation in `AUTHENTICATION.md`.