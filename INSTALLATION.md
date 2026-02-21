# Installation Guide: CMS Assessment Project

Complete step-by-step guide to set up the full-stack CMS application (NestJS backend + Next.js frontend) on your local machine.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Database Setup](#database-setup)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Running the Application](#running-the-application)
8. [Verification](#verification)
9. [Troubleshooting](#troubleshooting)
10. [Docker Installation (Alternative)](#docker-installation-alternative)

---

## Prerequisites

### Required Software

Install the following software before proceeding:

| Software       | Minimum Version | Installation                                     |
| -------------- | --------------- | ------------------------------------------------ |
| **Node.js**    | 22.x            | [Download](https://nodejs.org/)                  |
| **npm**        | 10.x            | Included with Node.js                            |
| **PostgreSQL** | 16.x            | [Download](https://www.postgresql.org/download/) |
| **Git**        | 2.x             | [Download](https://git-scm.com/)                 |

### Optional (Recommended)

- **Docker Desktop** 4.x - For containerized setup
- **VS Code** - Recommended IDE with extensions:
  - ESLint
  - Prettier
  - Prisma
  - REST Client

---

## System Requirements

### Minimum Hardware

- **CPU:** 2 cores
- **RAM:** 4 GB
- **Disk Space:** 2 GB free space
- **OS:** macOS 10.15+, Windows 10+, Linux (Ubuntu 20.04+)

### Recommended Hardware

- **CPU:** 4+ cores
- **RAM:** 8+ GB
- **Disk Space:** 5+ GB free space
- **SSD:** For better database performance

---

## Installation Steps

### Step 1: Clone Repository

Open your terminal and run:

```bash
# Clone the repository
git clone <repository-url>
cd d-cms-assessment

# Verify directory structure
ls -la
# You should see: cms-backend/ cms-frontend/ README.md REFLECTION.md
```

### Step 2: Verify Node.js Installation

```bash
# Check Node.js version (should be 22.x or higher)
node --version

# Check npm version (should be 10.x or higher)
npm --version

# If versions are incorrect, install/update Node.js from nodejs.org
```

### Step 3: Verify PostgreSQL Installation

```bash
# Check PostgreSQL version
psql --version

# Start PostgreSQL service
# macOS (Homebrew):
brew services start postgresql@16

# macOS (App):
# Open PostgreSQL.app and start server

# Linux (Ubuntu):
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Windows:
# Start from Services or PostgreSQL pgAdmin
```

---

## Database Setup

### Step 1: Create Database

```bash
# Login to PostgreSQL
psql postgres

# Inside psql prompt, create database and user:
CREATE DATABASE cms_db;
CREATE USER cms_user WITH PASSWORD 'cms_password';
GRANT ALL PRIVILEGES ON DATABASE cms_db TO cms_user;

# Grant schema permissions (PostgreSQL 15+)
\c cms_db
GRANT ALL ON SCHEMA public TO cms_user;

# Exit psql
\q
```

### Step 2: Test Database Connection

```bash
# Test connection with new credentials
psql -U cms_user -d cms_db -h localhost

# If successful, you'll see the psql prompt
# Exit with: \q
```

### Alternative: Use Default PostgreSQL User

If you prefer to use the default `postgres` user:

```bash
# Create only the database
psql postgres
CREATE DATABASE cms_db;
\q

# Use this DATABASE_URL later:
# postgresql://postgres:your_postgres_password@localhost:5432/cms_db
```

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd cms-backend
pwd
# Should show: /path/to/d-cms-assessment/cms-backend
```

### Step 2: Install Dependencies

```bash
# Install all backend dependencies
npm install --legacy-peer-deps

# This may take 2-5 minutes depending on your internet speed
# You should see: added XXX packages
```

**Note:** The `--legacy-peer-deps` flag is used to handle peer dependency conflicts.

### Step 3: Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Or create .env manually
touch .env
```

Edit `.env` file with your favorite editor:

```bash
# Using nano
nano .env

# Using vim
vim .env

# Using VS Code
code .env
```

Add the following configuration:

```env
# Database Connection
DATABASE_URL="postgresql://cms_user:cms_password@localhost:5432/cms_db?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="1h"

# Server Configuration
PORT=3000
NODE_ENV=development

# Seed Data Configuration
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="changeme123"

# CORS Configuration
FRONTEND_URL="http://localhost:3001"
```

**Important:**

- Replace `cms_user` and `cms_password` with your PostgreSQL credentials
- Change `JWT_SECRET` to a strong random string (min 32 characters)
- Keep `SEED_ADMIN_PASSWORD` secure if deploying to production

### Step 4: Generate Prisma Client

```bash
# Generate Prisma client from schema
npx prisma generate

# Expected output:
# ✔ Generated Prisma Client
```

### Step 5: Run Database Migrations

```bash
# Apply all migrations to create database tables
npm run prisma:migrate

# Alternative command:
npx prisma migrate deploy

# Expected output:
# ✔ Applied migrations:
#   └─ 20260219203314_init
```

### Step 6: Seed Database

```bash
# Populate database with initial data
npm run seed

# Expected output:
# ✅ Seeded 1 admin user
# ✅ Seeded 20 users
# ✅ Seeded 3 roles with permissions
# ✅ Seeded 20 blogs
# ✅ Seeded 20 news
# ✅ Database seeded successfully
```

This creates:

- 1 admin user (admin@example.com / changeme123)
- 20 test users
- 3 roles (Admin, Editor, Viewer) with permissions
- 20 blog posts with English/Arabic translations
- 20 news items with English/Arabic translations

### Step 7: Verify Backend Setup

```bash
# Check if Prisma client was generated
ls -la node_modules/.prisma/client
# Should show index.js, index.d.ts, etc.

# Verify database tables were created
psql -U cms_user -d cms_db -c "\dt"
# Should show: Blog, BlogTranslation, News, NewsTranslation,
#              User, Role, Permission, UserRole, RolePermission, etc.
```

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
# From project root
cd cms-frontend

# Or from backend directory
cd ../cms-frontend

pwd
# Should show: /path/to/d-cms-assessment/cms-frontend
```

### Step 2: Install Dependencies

```bash
# Install all frontend dependencies
npm install

# This may take 3-7 minutes
# You should see: added XXX packages
```

### Step 3: Configure Environment Variables

```bash
# Create .env.local file
touch .env.local

# Edit the file
nano .env.local
```

Add the following configuration:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

**Note:** Next.js requires `NEXT_PUBLIC_` prefix for client-side environment variables.

### Step 4: Verify Frontend Setup

```bash
# Check if node_modules exists
ls -la node_modules | head

# Verify Next.js installation
npx next --version
# Should show: 15.x.x or similar
```

---

## Running the Application

### Option 1: Run Backend and Frontend Separately

#### Terminal 1: Start Backend

```bash
cd cms-backend
npm run start:dev

# Expected output:
# [Nest] INFO [NestFactory] Starting Nest application...
# [Nest] INFO [InstanceLoader] AppModule dependencies initialized
# [Nest] INFO Application is running on: http://localhost:3000
```

**Backend will be available at:** `http://localhost:3000`

#### Terminal 2: Start Frontend

Open a **new terminal window/tab**:

```bash
cd cms-frontend
npm run dev

# Expected output:
# ▲ Next.js 15.x.x
# - Local:        http://localhost:3001
# - Ready in 2.5s
```

**Frontend will be available at:** `http://localhost:3001`

### Option 2: Use Process Manager (pm2)

Install pm2 globally:

```bash
npm install -g pm2

# Start backend
cd cms-backend
pm2 start npm --name "cms-backend" -- run start:dev

# Start frontend
cd ../cms-frontend
pm2 start npm --name "cms-frontend" -- run dev

# View logs
pm2 logs

# Stop all
pm2 stop all

# Restart all
pm2 restart all
```

---

## Verification

### Step 1: Backend Health Check

```bash
# Test backend is running
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","info":{"database":{"status":"up"}}}
```

### Step 2: Backend Login Test

```bash
# Test authentication endpoint
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "changeme123"
  }'

# Expected response (truncated):
# {
#   "success": true,
#   "data": {
#     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
#   }
# }
```

### Step 3: Frontend Access Test

1. **Open browser:** Navigate to `http://localhost:3001`
2. **Expected:** Landing page with Blogs and News lists
3. **Test login:** Go to `http://localhost:3001/admin/login`
4. **Credentials:**
   - Email: `admin@example.com`
   - Password: `changeme123`
5. **Expected:** Redirect to admin dashboard with sidebar navigation

### Step 4: Admin Panel Test

After logging in, verify these pages load:

- ✅ Users: `http://localhost:3001/admin/users`
- ✅ Roles: `http://localhost:3001/admin/roles`
- ✅ Permissions: `http://localhost:3001/admin/permissions`
- ✅ Blogs: `http://localhost:3001/admin/blogs`
- ✅ News: `http://localhost:3001/admin/news`

### Step 5: API Documentation

Visit Swagger UI (if configured):

```
http://localhost:3000/api
```

Or import `cms-backend/openapi.json` into Postman/Insomnia.

---

## Troubleshooting

### Issue 1: Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
# In cms-backend/.env:
PORT=3001

# In cms-frontend/.env.local:
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Issue 2: Database Connection Failed

**Error:** `Error: P1001: Can't reach database server`

**Solution:**

```bash
# Check if PostgreSQL is running
# macOS:
brew services list | grep postgresql

# Linux:
sudo systemctl status postgresql

# Start PostgreSQL if stopped:
brew services start postgresql@16  # macOS
sudo systemctl start postgresql    # Linux

# Verify credentials in cms-backend/.env match database
# Test connection manually:
psql -U cms_user -d cms_db -h localhost
```

### Issue 3: Prisma Client Not Generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**

```bash
cd cms-backend
npx prisma generate
npm run prisma:migrate
```

### Issue 4: CORS Error in Browser

**Error:** `Access to fetch at 'http://localhost:3000' from origin 'http://localhost:3001' has been blocked by CORS`

**Solution:**

Check `cms-backend/src/main.ts` has CORS enabled:

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true,
});
```

Verify `cms-backend/.env` has:

```env
FRONTEND_URL="http://localhost:3001"
```

### Issue 5: npm install fails

**Error:** `ERESOLVE unable to resolve dependency tree`

**Solution:**

```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps

# Or use --force (not recommended)
npm install --force

# Clear npm cache if issues persist
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Issue 6: Frontend Shows "API Error"

**Error:** Frontend console shows network errors

**Solution:**

1. Verify backend is running: `curl http://localhost:3000/health`
2. Check `.env.local` has correct API URL
3. Check browser console for exact error
4. Clear browser cache and reload

### Issue 7: Permission Denied (PostgreSQL)

**Error:** `FATAL: role "cms_user" does not exist`

**Solution:**

```bash
# Connect as postgres superuser
psql postgres

# Create user
CREATE USER cms_user WITH PASSWORD 'cms_password';

# Grant privileges
\c cms_db
GRANT ALL ON SCHEMA public TO cms_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cms_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cms_user;
\q
```

### Issue 8: Seed Script Fails

**Error:** `Error: Unique constraint violation`

**Solution:**

```bash
# Database already has data. Reset it:
cd cms-backend

# Method 1: Reset with Prisma
npx prisma migrate reset --force
# This will drop & recreate database, apply migrations, run seed

# Method 2: Manual reset
psql -U cms_user -d cms_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npx prisma migrate deploy
npm run seed
```

### Issue 9: Frontend Build Fails

**Error:** `Module not found: Can't resolve '@/components/...'`

**Solution:**

Verify `cms-frontend/tsconfig.json` has correct paths:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue 10: Environment Variables Not Loading

**Error:** `undefined` when accessing `process.env.XXX`

**Solution:**

- Backend: Use `.env` (loaded by NestJS automatically)
- Frontend: Use `.env.local` and prefix with `NEXT_PUBLIC_`
- Restart dev servers after changing env files
- Never commit `.env` or `.env.local` to git

---

## Docker Installation (Alternative)

### Prerequisites

- Docker Desktop 4.x installed and running
- Docker Compose included (bundled with Docker Desktop)

### Step 1: Setup Environment

```bash
# Navigate to project root
cd d-cms-assessment

# Create backend .env
cd cms-backend
cp .env.example .env

# Edit DATABASE_URL to use Docker service name:
# DATABASE_URL="postgresql://cms_user:cms_password@postgres:5432/cms_db"
```

### Step 2: Build and Start Containers

```bash
# From project root or cms-backend directory
docker-compose up -d

# This will:
# 1. Build backend image
# 2. Start PostgreSQL container
# 3. Start backend container
# 4. Run migrations automatically
# 5. Seed database
```

### Step 3: Verify Docker Setup

```bash
# Check running containers
docker-compose ps

# Should show:
# cms-backend  (port 3000)
# postgres     (port 5432)

# View logs
docker-compose logs -f backend

# Test backend
curl http://localhost:3000/health
```

### Step 4: Start Frontend

```bash
# Frontend still runs locally (or add to docker-compose.yml)
cd cms-frontend
npm install
npm run dev
```

### Docker Commands

```bash
# Stop containers
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v

# Rebuild images
docker-compose build

# View logs
docker-compose logs backend
docker-compose logs postgres

# Execute commands in container
docker-compose exec backend npm run seed
docker-compose exec postgres psql -U cms_user -d cms_db
```

---

## Post-Installation Steps

### 1. Update Default Credentials

```bash
# Login to admin panel
# Navigate to Users → Edit admin@example.com
# Change password from 'changeme123' to a strong password
```

### 2. Configure Production Settings

For production deployment, update:

```env
# cms-backend/.env
NODE_ENV=production
JWT_SECRET="<generate-strong-random-secret>"
DATABASE_URL="<production-database-url>"
FRONTEND_URL="https://yourdomain.com"
```

### 3. Enable Additional Features

```bash
# Setup Redis for caching (optional)
brew install redis
brew services start redis

# Add to .env:
REDIS_URL="redis://localhost:6379"
```

### 4. Setup IDE

Recommended VS Code extensions:

```bash
# Install via VS Code Extensions Marketplace:
# - ESLint (dbaeumer.vscode-eslint)
# - Prettier (esbenp.prettier-vscode)
# - Prisma (Prisma.prisma)
# - REST Client (humao.rest-client)
# - GitLens (eamodio.gitlens)
```

---

## Quick Reference Commands

### Backend

```bash
cd cms-backend
npm run start:dev          # Start dev server
npm run build              # Build for production
npm run start              # Run production build
npm run seed               # Seed database
npm run test               # Run tests
npx prisma studio          # Open Prisma GUI
```

### Frontend

```bash
cd cms-frontend
npm run dev                # Start dev server
npm run build              # Build for production
npm run start              # Run production build
npm run lint               # Lint code
```

### Database

```bash
# Access database
psql -U cms_user -d cms_db

# Inside psql:
\dt                        # List tables
\d users                   # Describe users table
SELECT * FROM users;       # Query users
\q                         # Exit

# Prisma commands
npx prisma studio          # GUI database browser
npx prisma migrate dev     # Create new migration
npx prisma migrate deploy  # Apply migrations
npx prisma migrate reset   # Reset database
```

---

## Next Steps

After successful installation:

1. **Read Documentation:**
   - [README.md](README.md) - Project overview
   - [REFLECTION.md](REFLECTION.md) - Architecture decisions
   - [cms-backend/README.md](cms-backend/README.md) - Backend API docs
   - [cms-frontend/FRONTEND_REQUIREMENTS.md](cms-frontend/FRONTEND_REQUIREMENTS.md) - Frontend architecture

2. **Explore Features:**
   - Login to admin panel
   - Create test users
   - Create/edit blog posts in multiple languages
   - Test search filtering
   - Try language switcher (English/Arabic)

3. **Development:**
   - Review code structure
   - Run tests
   - Make changes and see hot reload
   - Check API endpoints with Swagger

4. **Deployment:**
   - Follow deployment guides for your platform
   - Configure production environment variables
   - Setup CI/CD pipeline
   - Enable monitoring and logging

---

## Support

If you encounter issues not covered in this guide:

1. Check [Troubleshooting](#troubleshooting) section
2. Review error logs in terminal
3. Verify all prerequisites are met
4. Check Node.js, npm, and PostgreSQL versions
5. Contact development team

---

## Version Information

- **Document Version:** 1.0
- **Last Updated:** February 22, 2026
- **Node.js:** 22.x
- **PostgreSQL:** 16.x
- **NestJS:** 11.x
- **Next.js:** 15.x

---

## License

UNLICENSED - Internal use only
