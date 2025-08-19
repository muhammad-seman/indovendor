# 🏗️ CLEAN ARCHITECTURE RULES - IndoVendor

## 📋 **MANDATORY RULES FOR DEVELOPMENT**

### **1. DIRECTORY MANAGEMENT** 
⚠️ **ALWAYS verify working directory before ANY command:**
```bash
pwd  # Check current directory BEFORE running commands
cd /Users/macbook/Documents/PROJECT/FULLSTACK/indovendor/backend  # Navigate explicitly
cd /Users/macbook/Documents/PROJECT/FULLSTACK/indovendor/frontend # Navigate explicitly
```

### **2. NO CONTAMINATION BETWEEN PROJECTS**
❌ **NEVER install frontend packages in backend**
❌ **NEVER install backend packages in frontend**
❌ **NEVER create root-level dependencies**

✅ **Correct dependency separation:**
- **Backend**: Express, Prisma, JWT, bcrypt, etc.
- **Frontend**: Next.js, React, axios, zod, etc.

### **3. NO BUILD ARTIFACTS IN REPO**
❌ **NEVER commit these folders:**
- `backend/dist/`
- `backend/build/`
- `frontend/.next/`
- `frontend/out/`
- `node_modules/` (any level)

✅ **Always add proper .gitignore files**

### **4. CLEAN ARCHITECTURE LAYERS**

#### **Backend Structure:**
```
backend/src/
├── domain/           # Business logic (entities, repositories)
├── application/      # Use cases and controllers  
├── infrastructure/   # External concerns (DB, DI)
├── middleware/       # Express middleware
├── routes/           # API routes (adapters)
├── services/         # Application services
├── utils/            # Shared utilities
└── types/            # TypeScript types
```

#### **Frontend Structure:**
```
frontend/src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── common/       # Shared components
│   ├── forms/        # Form components
│   └── ui/           # UI primitives
├── contexts/         # React contexts (state)
├── hooks/            # Custom React hooks
├── lib/              # External integrations
├── constants/        # App constants
├── utils/            # Utility functions
├── stores/           # Global state (Zustand)
└── types/            # TypeScript types
```

### **5. FILE AND FOLDER CREATION RULES**
✅ **ONLY create files/folders that serve immediate purpose**
✅ **Follow established naming conventions**
✅ **Add index.ts files for clean exports**
❌ **NO empty folders without purpose**
❌ **NO random experimental files**

### **6. PACKAGE INSTALLATION PROTOCOL**
1. **Always verify directory:** `pwd`
2. **Navigate to correct project:** `cd [project-path]`
3. **Verify package.json exists:** `ls package.json`
4. **Install only relevant packages:** `npm install [package]`
5. **Never install cross-project dependencies**

### **7. GIT MANAGEMENT**
✅ **Proper .gitignore at each level:**
- Root: OS files, build artifacts
- Backend: dist/, .env, node_modules/
- Frontend: .next/, .env*, node_modules/

### **8. COMMAND EXECUTION SAFETY**
🔒 **Before ANY terminal command:**
1. Check working directory: `pwd`
2. Verify target files exist: `ls [file]`
3. Use absolute paths when uncertain
4. Never assume context

### **9. CLEAN ARCHITECTURE PRINCIPLES**
- **Domain**: Core business logic, no external dependencies
- **Application**: Use cases, orchestration  
- **Infrastructure**: External services, frameworks
- **Presentation**: UI, API adapters

### **10. QUALITY GATES**
❌ **NEVER proceed if:**
- Working directory is unclear
- Dependencies are mixed between projects
- Build artifacts exist in repo
- Empty folders without purpose exist

✅ **ALWAYS ensure:**
- Clean separation of concerns
- Proper dependency injection
- Type safety throughout
- Consistent file structure

---

## 🚨 **VIOLATION CONSEQUENCES**
Breaking these rules leads to:
- Dependency contamination
- Build failures  
- Architecture decay
- Maintenance nightmares

## ✅ **COMPLIANCE CHECKLIST**
- [ ] Correct working directory verified
- [ ] Dependencies properly separated
- [ ] No build artifacts in repo
- [ ] Clean architecture maintained
- [ ] Proper .gitignore files present
- [ ] All folders have purpose and content

**FOLLOW THESE RULES RELIGIOUSLY!** 🎯