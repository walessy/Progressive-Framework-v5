---
file: docs/13-Development/Development-Setup.md
directory: docs/13-Development/
priority: CRITICAL
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# Development Setup Guide - Progressive-Framework-v5

**File Path**: `docs/13-Development/Development-Setup.md`  
**Directory**: `docs/13-Development/`  
**Priority**: CRITICAL  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive development environment setup guide for Progressive-Framework-v5 Multi-Agent Intelligence System. This guide provides step-by-step instructions for setting up a local development environment, configuring dependencies, IDE setup, and first-time developer onboarding procedures.

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🤖 **[Agent Architecture](../02-Agent-Management/Agent-Development-Guide.md)** - *Agent development patterns*
- 🔗 **[API Documentation](../03-Communication-Protocols/API-Documentation.md)** - *API integration guide*
- 🚀 **[Getting Started](../08-User-Guides/Getting-Started.md)** - *Basic system introduction*

---

## **QUICK START CHECKLIST**

### **⚡ 15-Minute Setup (Experienced Developers)**
```bash
# 1. Clone repository
git clone https://github.com/your-org/progressive-framework-v5.git
cd progressive-framework-v5

# 2. Install dependencies
npm install
pip install -r requirements.txt

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Start development servers
npm run dev:agents     # Start agent services
npm run dev:api       # Start main API
npm run dev:web       # Start web interface

# 5. Verify installation
curl http://localhost:3000/api/v1/agents/status
```

### **📋 Prerequisites Checklist**
- [ ] **Node.js** v18+ and npm v9+
- [ ] **Python** 3.9+ and pip
- [ ] **Git** v2.30+
- [ ] **Docker** v20+ and Docker Compose
- [ ] **VS Code** or preferred IDE
- [ ] **Database** (PostgreSQL, Redis, MongoDB)
- [ ] **Cloud CLI** (AWS/Azure/GCP - optional)

---

## **DETAILED SETUP INSTRUCTIONS**

### **1. System Requirements**

#### **Hardware Requirements**
```
Minimum:
• CPU: 4 cores, 2.5GHz+
• RAM: 8GB
• Storage: 10GB free space
• Network: Broadband internet connection

Recommended:
• CPU: 8 cores, 3.0GHz+
• RAM: 16GB+
• Storage: 25GB+ SSD
• Network: High-speed internet for API calls
```

#### **Operating System Support**
```
✅ Windows 10/11 (WSL2 recommended)
✅ macOS 12.0+ (Intel/Apple Silicon)
✅ Ubuntu 20.04+ LTS
✅ CentOS 8+ / RHEL 8+
✅ Docker Desktop (all platforms)
```

### **2. Core Dependencies Installation**

#### **Node.js and npm**
```bash
# Using Node Version Manager (recommended)
# Windows (using nvm-windows)
nvm install 18.17.0
nvm use 18.17.0

# macOS/Linux (using nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
source ~/.bashrc
nvm install 18.17.0
nvm use 18.17.0

# Verify installation
node --version  # Should show v18.17.0+
npm --version   # Should show v9.0.0+

# Alternative: Direct installation
# Download from https://nodejs.org/
# Install LTS version (18.x)
```

#### **Python Environment Setup**
```bash
# Install Python 3.9+ (if not already installed)
# Windows: Download from python.org
# macOS: brew install python@3.9
# Ubuntu: sudo apt install python3.9 python3.9-pip

# Verify Python installation
python3 --version  # Should show 3.9+
pip3 --version     # Should show recent version

# Create virtual environment (recommended)
python3 -m venv progressive-framework-env
source progressive-framework-env/bin/activate  # Linux/macOS
# OR
progressive-framework-env\Scripts\activate     # Windows

# Upgrade pip
pip install --upgrade pip

# Install Python dependencies
pip install -r requirements.txt
```

#### **Git Configuration**
```bash
# Install Git (if not already installed)
# Windows: Download from git-scm.com
# macOS: brew install git
# Ubuntu: sudo apt install git

# Configure Git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main

# Verify installation
git --version  # Should show v2.30+

# Setup SSH keys for GitHub (recommended)
ssh-keygen -t ed25519 -C "your.email@example.com"
# Add ~/.ssh/id_ed25519.pub to GitHub account
```

#### **Docker Setup**
```bash
# Install Docker Desktop
# Windows: Download from docker.com/products/docker-desktop
# macOS: Download from docker.com/products/docker-desktop
# Ubuntu: 
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER
# Log out and log back in

# Verify Docker installation
docker --version         # Should show v20.0+
docker-compose --version # Should show v2.0+

# Test Docker installation
docker run hello-world
```

### **3. Database Setup**

#### **Option A: Docker Compose (Recommended for Development)**
```bash
# Start all required databases with Docker Compose
cd progressive-framework-v5
docker-compose up -d postgres redis mongodb

# Verify databases are running
docker-compose ps

# Database URLs for .env.local:
# POSTGRES_URL=postgresql://progressive_user:dev_password@localhost:5432/progressive_framework_v5
# REDIS_URL=redis://localhost:6379
# MONGODB_URL=mongodb://localhost:27017/progressive_framework_v5
```

#### **Option B: Local Installation**

**PostgreSQL Setup:**
```bash
# Install PostgreSQL
# Windows: Download from postgresql.org
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
# Windows: Start from Services or pgAdmin
# macOS: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE progressive_framework_v5;
CREATE USER progressive_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE progressive_framework_v5 TO progressive_user;
\q
```

**Redis Setup:**
```bash
# Install Redis
# Windows: Download from github.com/MicrosoftArchive/redis
# macOS: brew install redis
# Ubuntu: sudo apt install redis-server

# Start Redis service
# Windows: Start redis-server.exe
# macOS: brew services start redis
# Ubuntu: sudo systemctl start redis-server

# Test Redis connection
redis-cli ping  # Should return "PONG"
```

**MongoDB Setup:**
```bash
# Install MongoDB Community Edition
# Follow instructions at mongodb.com/docs/manual/installation/

# Start MongoDB service
# Windows: Start from Services or MongoDB Compass
# macOS: brew services start mongodb-community
# Ubuntu: sudo systemctl start mongod

# Test MongoDB connection
mongosh  # Should connect to MongoDB shell
```

### **4. Repository Setup**

#### **Clone Repository**
```bash
# Clone the main repository
git clone https://github.com/your-org/progressive-framework-v5.git
cd progressive-framework-v5

# Or fork and clone your fork for contributing
# 1. Fork repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/progressive-framework-v5.git
cd progressive-framework-v5
git remote add upstream https://github.com/your-org/progressive-framework-v5.git
```

#### **Repository Structure Overview**
```
progressive-framework-v5/
├── agents/                     # Agent implementations
│   ├── mca/                   # Master Control Agent
│   ├── npa/                   # Nutrition Planning Agent  
│   ├── wpa/                   # Workout Planning Agent
│   └── bma/                   # Budget Management Agent (in dev)
├── api/                       # Core API server
│   ├── routes/                # API route definitions
│   ├── middleware/            # Custom middleware
│   ├── models/                # Data models
│   └── utils/                 # Utility functions
├── web/                       # Web interface (Next.js)
│   ├── components/            # React components
│   ├── pages/                 # Next.js pages
│   ├── styles/                # CSS/styling
│   └── utils/                 # Frontend utilities
├── shared/                    # Shared libraries
│   ├── types/                 # TypeScript type definitions
│   ├── constants/             # System constants
│   └── utils/                 # Shared utilities
├── infrastructure/            # Infrastructure as Code
│   ├── docker/                # Docker configurations
│   ├── k8s/                   # Kubernetes manifests
│   └── terraform/             # Terraform configurations
├── tests/                     # Test suites
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── e2e/                   # End-to-end tests
├── docs/                      # Documentation
├── scripts/                   # Development scripts
├── .env.example               # Environment variable template
├── docker-compose.yml         # Local development databases
├── package.json               # Node.js dependencies
├── requirements.txt           # Python dependencies
└── README.md                  # Project overview
```

### **5. Environment Configuration**

#### **Environment Variables Setup**
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
nano .env.local  # or use your preferred editor
```

#### **Sample .env.local Configuration**
```bash
# ==============================================
# Progressive Framework V5 - Development Config
# ==============================================

# Application Settings
NODE_ENV=development
PORT=3000
API_VERSION=v1
LOG_LEVEL=debug

# Database URLs
POSTGRES_URL=postgresql://progressive_user:dev_password@localhost:5432/progressive_framework_v5
REDIS_URL=redis://localhost:6379
MONGODB_URL=mongodb://localhost:27017/progressive_framework_v5

# Agent Configuration
AGENTS_ENABLED=mca,npa,wpa
AGENT_TIMEOUT_MS=30000
AGENT_MAX_RETRIES=3

# Master Control Agent (MCA)
MCA_PORT=8000
MCA_HOST=localhost
MCA_LOG_LEVEL=debug

# Nutrition Planning Agent (NPA)
NPA_PORT=8001
NPA_HOST=localhost
NPA_CONFIDENCE_THRESHOLD=0.7

# Workout Planning Agent (WPA)
WPA_PORT=8002
WPA_HOST=localhost
WPA_CONFIDENCE_THRESHOLD=0.7

# Budget Management Agent (BMA) - Development
BMA_PORT=8003
BMA_HOST=localhost
BMA_ENABLED=false

# Authentication & Security
JWT_SECRET=your-super-secure-jwt-secret-key-change-this
JWT_EXPIRES_IN=24h
API_KEY_SECRET=your-api-key-secret-change-this
BCRYPT_ROUNDS=12

# External APIs (optional for development)
OPENAI_API_KEY=your-openai-api-key-here
NUTRITIONIX_APP_ID=your-nutritionix-app-id
NUTRITIONIX_API_KEY=your-nutritionix-api-key

# Monitoring & Logging
SENTRY_DSN=your-sentry-dsn-here
LOG_FILE_PATH=./logs/development.log
METRICS_ENABLED=true

# Development Flags
DEBUG_MODE=true
MOCK_EXTERNAL_APIS=true
ENABLE_API_DOCS=true
ENABLE_PLAYGROUND=true
```

#### **Database Schema Initialization**
```bash
# Initialize database schemas
npm run db:migrate

# Seed development data
npm run db:seed

# Verify database setup
npm run db:status
```

### **6. Dependencies Installation**

#### **Install Node.js Dependencies**
```bash
# Install main project dependencies
npm install

# Install development dependencies  
npm install --only=dev

# Install global tools (optional)
npm install -g @types/node typescript ts-node nodemon

# Verify installation
npm list --depth=0
```

#### **Install Python Dependencies**
```bash
# Activate virtual environment (if using)
source progressive-framework-env/bin/activate  # Linux/macOS
# OR
progressive-framework-env\Scripts\activate     # Windows

# Install Python packages
pip install -r requirements.txt

# Install development dependencies
pip install -r requirements-dev.txt

# Verify installation
pip list
```

#### **Key Dependencies Overview**
```json
{
  "node_dependencies": {
    "production": [
      "express@4.18.x - Web framework",
      "next@13.x - React framework", 
      "typescript@5.x - Type safety",
      "prisma@5.x - Database ORM",
      "redis@4.x - Redis client",
      "jsonwebtoken@9.x - JWT authentication",
      "bcryptjs@2.x - Password hashing",
      "winston@3.x - Logging",
      "axios@1.x - HTTP client"
    ],
    "development": [
      "jest@29.x - Testing framework",
      "supertest@6.x - API testing",
      "nodemon@3.x - Development server",
      "eslint@8.x - Code linting",
      "prettier@3.x - Code formatting"
    ]
  },
  "python_dependencies": {
    "production": [
      "fastapi@0.103.x - Python web framework",
      "uvicorn@0.23.x - ASGI server", 
      "pydantic@2.x - Data validation",
      "sqlalchemy@2.x - Database ORM",
      "redis@4.x - Redis client",
      "pymongo@4.x - MongoDB client",
      "openai@0.28.x - OpenAI API client",
      "numpy@1.24.x - Numerical computing",
      "pandas@2.x - Data manipulation"
    ],
    "development": [
      "pytest@7.x - Testing framework",
      "black@23.x - Code formatting",
      "flake8@6.x - Code linting",
      "mypy@1.x - Type checking"
    ]
  }
}
```

### **7. IDE Configuration**

#### **Visual Studio Code Setup (Recommended)**
```bash
# Install VS Code extensions
code --install-extension ms-python.python
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-json
code --install-extension ms-vscode-remote.remote-containers
code --install-extension GitHub.copilot  # Optional, requires subscription

# Open project in VS Code
code .
```

#### **VS Code Workspace Settings**
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "python.defaultInterpreterPath": "./progressive-framework-env/bin/python",
  "python.terminal.activateEnvironment": true,
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "files.exclude": {
    "**/node_modules": true,
    "**/.git": true,
    "**/.DS_Store": true,
    "**/build": true,
    "**/dist": true,
    "**/__pycache__": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/build": true,
    "**/dist": true
  }
}
```

#### **VS Code Launch Configuration**
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main API",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/api/src/server.ts",
      "outFiles": ["${workspaceFolder}/api/dist/**/*.js"],
      "envFile": "${workspaceFolder}/.env.local",
      "console": "integratedTerminal"
    },
    {
      "name": "Debug MCA Agent",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/agents/mca/main.py",
      "envFile": "${workspaceFolder}/.env.local",
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}/agents/mca"
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--detectOpenHandles"],
      "envFile": "${workspaceFolder}/.env.test",
      "console": "integratedTerminal"
    }
  ]
}
```

#### **Alternative IDE Configurations**

**JetBrains WebStorm/PyCharm:**
- Import project from existing sources
- Set Node.js interpreter to project's node binary
- Set Python interpreter to virtual environment
- Enable TypeScript service
- Configure ESLint and Prettier integration

**Sublime Text:**
- Install Package Control
- Install TypeScript, Python, and Git packages
- Configure build systems for Node.js and Python
- Set up linting with SublimeLinter

### **8. Development Server Startup**

#### **Start All Services**
```bash
# Option 1: Start all services with one command
npm run dev

# Option 2: Start services individually
# Terminal 1: Start databases
docker-compose up postgres redis mongodb

# Terminal 2: Start main API
npm run dev:api

# Terminal 3: Start agent services  
npm run dev:agents

# Terminal 4: Start web interface
npm run dev:web

# Terminal 5: Monitor logs
npm run logs:dev
```

#### **Available npm Scripts**
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:api\" \"npm run dev:agents\" \"npm run dev:web\"",
    "dev:api": "nodemon api/src/server.ts",
    "dev:agents": "python agents/orchestrator.py",
    "dev:web": "cd web && next dev",
    "dev:mca": "cd agents/mca && python main.py",
    "dev:npa": "cd agents/npa && python main.py", 
    "dev:wpa": "cd agents/wpa && python main.py",
    "build": "npm run build:api && npm run build:web",
    "build:api": "tsc -p api/tsconfig.json",
    "build:web": "cd web && next build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:agents": "cd agents && python -m pytest",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:status": "prisma migrate status",
    "logs:dev": "tail -f logs/development.log"
  }
}
```

#### **Service Health Verification**
```bash
# Check main API health
curl http://localhost:3000/api/v1/health

# Check agent status  
curl http://localhost:3000/api/v1/agents/status

# Check MCA agent directly
curl http://localhost:8000/health

# Check NPA agent directly  
curl http://localhost:8001/health

# Check WPA agent directly
curl http://localhost:8002/health

# Check web interface
open http://localhost:3000  # or curl http://localhost:3000
```

### **9. First-Time Development Workflow**

#### **1. Verify Installation**
```bash
# Run comprehensive health check
npm run health-check

# Expected output:
# ✅ Node.js v18.17.0
# ✅ Python 3.9.16
# ✅ Git 2.41.0
# ✅ Docker 24.0.5
# ✅ PostgreSQL connected
# ✅ Redis connected  
# ✅ MongoDB connected
# ✅ All agents responding
# ✅ API server healthy
# ✅ Web interface accessible
```

#### **2. Run Test Suite**
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:agents        # Agent-specific tests
npm run test:e2e           # End-to-end tests

# Expected output: All tests passing
```

#### **3. Agent Communication Test**
```bash
# Test intelligent agent routing
curl -X POST http://localhost:3000/api/v1/agents/route \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need a workout plan for muscle building",
    "context": {"user_id": "test_user"}
  }'

# Expected: Route to WPA with high confidence
# Test nutrition agent
curl -X POST http://localhost:3000/api/v1/agents/npa/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create a high-protein meal plan",
    "context": {"user_profile": {"goal": "muscle_gain"}}
  }'

# Expected: Detailed meal plan response
```

#### **4. Database Verification**
```bash
# Check database migrations
npm run db:status

# Verify seed data
npm run db:verify-seed

# Check agent registry
curl http://localhost:3000/api/v1/agents/registry
```

---

## **TROUBLESHOOTING**

### **Common Installation Issues**

#### **Node.js/npm Issues**
```bash
# Problem: npm install fails with permission errors
# Solution: Use nvm or fix npm permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# Problem: Node version conflicts
# Solution: Use nvm to manage versions
nvm install 18.17.0
nvm alias default 18.17.0

# Problem: Package vulnerabilities  
# Solution: Audit and fix
npm audit fix
```

#### **Python Environment Issues**
```bash
# Problem: Python module not found
# Solution: Activate virtual environment
source progressive-framework-env/bin/activate

# Problem: pip install fails
# Solution: Upgrade pip and try again
pip install --upgrade pip
pip install -r requirements.txt

# Problem: Permission denied on macOS/Linux
# Solution: Use --user flag or virtual environment
pip install --user package-name
```

#### **Database Connection Issues**
```bash
# Problem: PostgreSQL connection refused
# Solutions:
# 1. Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# 2. Check connection settings in .env.local
# 3. Verify user permissions
sudo -u postgres psql -c "\du"

# Problem: Redis connection issues
# Solutions:
# 1. Start Redis service
sudo systemctl start redis-server  # Linux
brew services start redis  # macOS

# 2. Check Redis configuration
redis-cli ping
```

#### **Docker Issues**
```bash
# Problem: Docker daemon not running
# Solution: Start Docker Desktop or daemon
sudo systemctl start docker  # Linux
# Or start Docker Desktop on Windows/macOS

# Problem: Permission denied (Linux)
# Solution: Add user to docker group
sudo usermod -aG docker $USER
# Log out and log back in

# Problem: Port conflicts
# Solution: Check and stop conflicting services
sudo lsof -i :5432  # Check PostgreSQL port
docker-compose down  # Stop all containers
```

#### **Agent Communication Issues**
```bash
# Problem: Agents not responding
# Solutions:
# 1. Check agent logs
npm run logs:agents

# 2. Restart agent services
npm run restart:agents

# 3. Verify agent ports are not blocked
netstat -tlnp | grep :8000  # Check MCA port
netstat -tlnp | grep :8001  # Check NPA port  
netstat -tlnp | grep :8002  # Check WPA port

# Problem: Agent routing failures
# Solutions:
# 1. Check agent registry
curl http://localhost:3000/api/v1/agents/registry

# 2. Verify agent health
curl http://localhost:8000/health
curl http://localhost:8001/health
curl http://localhost:8002/health
```

### **Performance Optimization**

#### **Development Performance Tips**
```bash
# 1. Use SSD storage for better I/O performance
# 2. Increase Node.js memory limit for large projects
export NODE_OPTIONS="--max-old-space-size=4096"

# 3. Use nodemon efficiently
# Add to package.json:
"nodemon": {
  "ignore": ["**/*.test.ts", "node_modules"],
  "delay": 2500
}

# 4. Optimize Docker for development
# Use bind mounts instead of volumes for faster file sync
# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1
```

#### **Memory and CPU Usage**
```bash
# Monitor Node.js processes
ps aux | grep node

# Monitor Python processes  
ps aux | grep python

# Monitor system resources
htop  # Linux/macOS
# Or use Task Manager on Windows

# Optimize for your system:
# - Close unnecessary applications
# - Use development database instead of full dataset
# - Disable heavy IDE extensions during development
```

---

## **DEVELOPMENT BEST PRACTICES**

### **Code Organization Standards**

#### **File Naming Conventions**
```
TypeScript/JavaScript:
✅ camelCase for variables and functions
✅ PascalCase for classes and components  
✅ kebab-case for file names
✅ UPPER_SNAKE_CASE for constants

Python:
✅ snake_case for variables and functions
✅ PascalCase for classes
✅ snake_case for file names
✅ UPPER_SNAKE_CASE for constants

Examples:
✅ user-service.ts
✅ agent_registry.py
✅ UserProfile.tsx
✅ NutritionAgent.py
❌ User_Service.ts
❌ agent-registry.py
```

#### **Import Organization**
```typescript
// TypeScript/JavaScript import order:
// 1. External libraries
import express from 'express';
import { Request, Response } from 'express';

// 2. Internal modules (absolute paths)
import { AgentRegistry } from '@/shared/agent-registry';
import { Logger } from '@/shared/utils/logger';

// 3. Relative imports
import { validateRequest } from '../middleware/validation';
import { AgentService } from './agent-service';
```

```python
# Python import order:
# 1. Standard library
import os
import json
from typing import Dict, List, Optional

# 2. Third-party libraries
import redis
import openai
from fastapi import FastAPI, HTTPException

# 3. Local imports
from shared.types import AgentResponse
from agents.base_agent import BaseAgent
```

### **Git Workflow**

#### **Branch Naming Convention**
```bash
# Feature branches
feature/agent-communication-optimization
feature/npa-meal-planning-enhancement

# Bug fixes
bugfix/agent-timeout-handling
bugfix/database-connection-retry

# Hotfixes
hotfix/security-vulnerability-fix
hotfix/critical-agent-error

# Release branches
release/v5.1.0
release/v5.2.0
```

#### **Commit Message Format**
```bash
# Format: <type>(<scope>): <subject>
# 
# Types: feat, fix, docs, style, refactor, test, chore
# Scope: component or file being modified
# Subject: imperative, lowercase, no period

# Examples:
feat(agents): implement Budget Management Agent (BMA)
fix(mca): resolve agent routing timeout issues
docs(api): update authentication documentation
test(npa): add unit tests for meal plan generation
refactor(shared): optimize agent communication protocol
```

#### **Pre-commit Hooks**
```bash
# Install husky for git hooks
npm install --save-dev husky

# Setup pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test"

# Setup commit message validation
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

### **Testing Strategy**

#### **Test File Organization**
```
tests/
├── unit/                      # Fast, isolated tests
│   ├── agents/
│   │   ├── mca.test.ts
│   │   ├── npa.test.py
│   │   └── wpa.test.py
│   ├── api/
│   │   ├── routes.test.ts
│   │   └── middleware.test.ts
│   └── shared/
│       └── utils.test.ts
├── integration/               # API and database tests
│   ├── agent-communication.test.ts
│   ├── database-operations.test.ts
│   └── api-endpoints.test.ts
└── e2e/                       # Full system tests
    ├── user-workflows.test.ts
    ├── agent-interactions.test.ts
    └── admin-operations.test.ts
```

#### **Testing Commands**
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- --testNamePattern="Agent Communication"

# Run tests in watch mode
npm run test:watch

# Run Python tests
cd agents && python -m pytest

# Run tests with verbose output
npm test -- --verbose
```

---

## **ADVANCED DEVELOPMENT**

### **Custom Development Scripts**

#### **Agent Development Helper**
```bash
# Create new agent template
npm run create:agent -- --name="CustomAgent" --type="specialized"

# Generate agent boilerplate files
npm run generate:agent-boilerplate CustomAgent

# Test individual agent
npm run test:agent CustomAgent

# Deploy agent to development
npm run deploy:agent CustomAgent --env=dev
```

#### **API Development Helper**
```bash
# Generate API route template
npm run create:route -- --path="/api/v1/custom" --methods="get,post"

# Validate API schema
npm run validate:api-schema

# Generate API documentation
npm run generate:api-docs

# Test API endpoints
npm run test:api-endpoints
```

### **Hot Reloading Setup**

#### **Advanced Nodemon Configuration**
```json
{
  "watch": ["api/src", "shared"],
  "ext": "ts,js,json",
  "ignore": [
    "**/*.test.ts",
    "**/node_modules/**",
    "**/build/**"
  ],
  "exec": "ts-node api/src/server.ts",
  "env": {
    "NODE_ENV": "development"
  },
  "delay": 2000
}
```

#### **Python Hot Reloading**
```bash
# Install uvicorn with auto-reload
pip install uvicorn[standard]

# Start agent with hot reloading
uvicorn agents.mca.main:app --reload --host 0.0.0.0 --port 8000

# Or use development script
python agents/mca/main.py --dev --reload
```

### **Debugging Configuration**

#### **VS Code Debugging**
```json
{
  "name": "Debug Full System",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/scripts/debug-system.js",
  "env": {
    "DEBUG": "*",
    "NODE_ENV": "development"
  },
  "console": "integratedTerminal",
  "serverReadyAction": {
    "pattern": "Server running on port ([0-9]+)",
    "uriFormat": "http://localhost:%s",
    "action": "openExternally"
  }
}
```

#### **Remote Debugging**
```bash
# Node.js remote debugging
node --inspect=0.0.0.0:9229 api/src/server.ts

# Python remote debugging (using debugpy)
python -m debugpy --listen 0.0.0.0:5678 --wait-for-client agents/mca/main.py
```

---

## **DEPLOYMENT PREPARATION**

### **Build Process**
```bash
# Production build
npm run build

# Build specific components
npm run build:api      # Build API server
npm run build:web      # Build web interface
npm run build:agents   # Build agent services

# Verify build output
ls -la build/          # Check build artifacts
npm run test:build     # Test production build
```

### **Docker Development**
```bash
# Build development Docker image
docker build -t progressive-framework-v5:dev .

# Run development container
docker run -p 3000:3000 --env-file .env.local progressive-framework-v5:dev

# Docker Compose for full development stack
docker-compose -f docker-compose.dev.yml up
```

### **Environment Promotion**
```bash
# Copy environment config
cp .env.local .env.staging

# Deploy to staging
npm run deploy:staging

# Run staging tests
npm run test:staging

# Promote to production
npm run deploy:production
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Agent Development Guide](../02-Agent-Management/Agent-Development-Guide.md)** - Agent development patterns
- **[API Documentation](../03-Communication-Protocols/API-Documentation.md)** - API integration guide

### **Follow-up Documents**  
- **[Contributing Guidelines](Contributing-Guidelines.md)** - Code standards and contribution process
- **[Testing Strategy](Testing-Strategy.md)** - Comprehensive testing approaches
- **[Deployment Guide](../05-DevOps/Deployment-Guide.md)** - Production deployment procedures

### **Operations Context**
- **[Common Issues Resolution](../10-Troubleshooting/Common-Issues-Resolution.md)** - Troubleshooting guide
- **[System Administration](../09-Admin-Guides/System-Administration.md)** - Administrative procedures
- **[Monitoring & Alerting](../05-DevOps/Monitoring-Alerting.md)** - System monitoring setup

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | Development Team | Complete development setup guide for Progressive Framework V5 |
| 4.x | 2025-08-xx | Development Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: Development Team  
**Last Validated**: 2025-09-02