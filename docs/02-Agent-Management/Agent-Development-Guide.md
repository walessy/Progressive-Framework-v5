# docs/13-Development/Development-Setup.md

# Development Setup Guide

**Last Updated**: August 31, 2025
**Version**: 1.0
**Owner**: Development Team
**Review Cycle**: Monthly

## Quick Reference
- **Purpose**: Complete local development environment setup for Progressive Framework V5
- **Audience**: New developers, contributors, system integrators
- **Dependencies**: [System Overview](../01-Core-System/System-Overview.md), [HTTP Communication](../03-Communication-Protocols/HTTP-Communication.md)
- **Status**: Production-Ready → Documentation In Progress

## Table of Contents
- [Prerequisites](#prerequisites)
- [System Requirements](#system-requirements)
- [Quick Start Setup](#quick-start-setup)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [Agent System Startup](#agent-system-startup)
- [Development Workflow](#development-workflow)
- [Testing Your Setup](#testing-your-setup)
- [Agent Development Environment](#agent-development-environment)
- [Debugging & Monitoring](#debugging--monitoring)
- [Common Setup Issues](#common-setup-issues)
- [IDE Configuration](#ide-configuration)
- [Contributing Guidelines](#contributing-guidelines)
- [Related Documentation](#related-documentation)

---

## Prerequisites

### Required Software
```bash
# Node.js (Latest LTS version recommended)
node --version    # Should be >= 18.0.0
npm --version     # Should be >= 9.0.0

# Git for version control
git --version     # Any recent version

# Optional but Recommended
code --version    # VS Code for development
curl --version    # For API testing
```

### Recommended Development Tools
```bash
# Package managers (choose one)
npm install -g npm@latest        # Standard npm
npm install -g yarn             # Alternative: Yarn
npm install -g pnpm             # Alternative: pnpm (faster)

# Development utilities
npm install -g nodemon          # Auto-restart on file changes
npm install -g pm2              # Process management (production-like)
npm install -g concurrently     # Run multiple processes

# Testing and debugging
npm install -g jest             # Testing framework
npm install -g postman         # API testing (or use curl)
```

### System Requirements
```yaml
# Minimum Requirements
RAM: 4GB available
CPU: 2 cores minimum
Disk: 2GB free space
OS: Windows 10+, macOS 12+, Ubuntu 20.04+

# Recommended for Optimal Performance
RAM: 8GB+ available
CPU: 4+ cores
Disk: 10GB free space (for logs and development)
Network: Stable internet for package downloads

# Port Requirements
3000: Main MCA HTTP server
3001: NPA (Nutrition Planning Agent)
3002: WPA (Workout Planning Agent) 
3003: BMA (Budget Management Agent, in development)
3004-3010: Reserved for future agents
```

---

## Quick Start Setup

### 1. Clone and Navigate
```bash
# Clone the repository
git clone https://github.com/yourusername/Progressive-Framework-v5.git
cd Progressive-Framework-v5

# Verify you're in the correct directory
pwd
# Should show: /path/to/Progressive-Framework-v5
```

### 2. Install Dependencies
```bash
# Install all project dependencies
npm install

# Verify installation
npm list --depth=0

# Expected core dependencies:
# express@4.18.x - HTTP server framework
# cors@2.8.x - Cross-origin resource sharing
# helmet@7.x.x - Security middleware
# dotenv@16.x.x - Environment variable management
# uuid@9.x.x - UUID generation for request IDs
# jest@29.x.x - Testing framework
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment configuration
# Windows: notepad .env
# macOS/Linux: nano .env

# Verify environment variables loaded
node -e "require('dotenv').config(); console.log(process.env.NODE_ENV);"
```

### 4. Start the Agent System
```bash
# Option 1: Start all agents together (recommended for development)
npm run dev

# Option 2: Start components individually (for debugging)
npm run start:mca    # Master Control Agent on port 3000
npm run start:npa    # Nutrition Agent on port 3001  
npm run start:wpa    # Workout Agent on port 3002
npm run start:bma    # Budget Agent on port 3003 (when ready)

# Option 3: Production-like startup with PM2
npm run start:prod
```

### 5. Verify Setup
```bash
# Check system health
curl http://localhost:3000/health

# Expected response:
# {"status":"healthy","timestamp":"2024-08-31T10:00:00Z"}

# Check agent registry
curl http://localhost:3000/agents

# Expected: List of active agents (MCA, NPA, WPA, potentially BMA)

# Test basic routing
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test setup"}'

# Expected: Successful routing response
```

---

## Project Structure

### Directory Layout
```
Progressive-Framework-v5/
├── 📄 README.md                    # Project overview and quick start
├── 📄 package.json                 # Dependencies and scripts
├── 📄 .env.example                 # Environment template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 docker-compose.yml           # Docker development setup
├── 📄 Documentation-Phases.md      # Documentation development plan
│
├── 📁 docs/                        # Complete documentation system
│   ├── 📁 01-Core-System/          # System architecture docs
│   ├── 📁 02-Agent-Management/     # Agent development and management
│   ├── 📁 03-Communication-Protocols/ # HTTP and messaging protocols
│   ├── 📁 04-Security/             # Security architecture
│   ├── 📁 05-DevOps/               # Deployment and operations
│   ├── 📁 06-Infrastructure/       # Infrastructure management
│   ├── 📁 07-Architecture/         # Detailed architecture docs
│   ├── 📁 08-User-Guides/          # End-user documentation
│   ├── 📁 09-Admin-Guides/         # Administrative procedures
│   ├── 📁 10-Troubleshooting/      # Problem resolution guides
│   ├── 📁 11-Integration/          # Third-party integrations
│   ├── 📁 12-Compliance/           # Legal and compliance docs
│   └── 📁 13-Development/          # Development procedures (this doc)
│
├── 📁 src/                         # Source code
│   ├── 📄 main.js                  # Application entry point
│   │
│   ├── 📁 core/                    # Core system components
│   │   ├── 📄 mca.js               # Master Control Agent
│   │   ├── 📄 agent_registry.js    # Agent registration and discovery
│   │   ├── 📄 conversation_manager.js # Chat and context management
│   │   └── 📄 fingerprint_system.js  # Request fingerprinting
│   │
│   ├── 📁 agents/                  # Specialized agent implementations
│   │   ├── 📄 base_agent.js        # Base agent class and interface
│   │   ├── 📄 nutrition_agent.js   # NPA implementation
│   │   ├── 📄 workout_agent.js     # WPA implementation
│   │   └── 📄 budget_agent.js      # BMA implementation (in development)
│   │
│   ├── 📁 interfaces/              # User interfaces and APIs
│   │   ├── 📄 web_interface.js     # Web dashboard (future)
│   │   ├── 📄 api_server.js        # REST API server
│   │   └── 📄 dashboard.js         # Admin dashboard (future)
│   │
│   ├── 📁 persistence/             # Data persistence and memory
│   │   ├── 📄 conversation_store.js # Chat history storage
│   │   ├── 📄 session_manager.js   # Session management
│   │   └── 📄 version_control.js   # Version tracking
│   │
│   └── 📁 monitoring/              # Performance and health monitoring
│       ├── 📄 resource_monitor.js  # System resource tracking
│       ├── 📄 performance_tracker.js # Performance metrics
│       └── 📄 alert_system.js      # Alert and notification system
│
├── 📁 tests/                       # Test suites
│   ├── 📁 unit/                    # Unit tests for individual components
│   ├── 📁 integration/             # Integration tests for agent communication
│   ├── 📁 performance/             # Load and performance tests
│   └── 📄 test-setup.js            # Test configuration and utilities
│
├── 📁 config/                      # Configuration files
│   ├── 📄 development.json         # Development environment config
│   ├── 📄 production.json          # Production environment config
│   └── 📄 agents.json              # Agent configuration templates
│
└── 📁 logs/                        # Application logs
    ├── 📄 mca.log                  # MCA logs
    ├── 📄 agents.log               # Agent communication logs
    └── 📄 performance.log          # Performance metrics logs
```

### Key Configuration Files
```json
// package.json - Development Scripts
{
  "scripts": {
    "dev": "concurrently \"npm:start:mca\" \"npm:start:npa\" \"npm:start:wpa\"",
    "start": "node src/main.js",
    "start:mca": "nodemon src/main.js --port 3000",
    "start:npa": "nodemon src/agents/nutrition_agent.js --port 3001",
    "start:wpa": "nodemon src/agents/workout_agent.js --port 3002", 
    "start:bma": "nodemon src/agents/budget_agent.js --port 3003",
    "start:prod": "pm2 start ecosystem.config.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:integration": "jest tests/integration",
    "test:performance": "jest tests/performance",
    "lint": "eslint src/ --fix",
    "health": "curl http://localhost:3000/health"
  }
}
```

---

## Environment Configuration

### .env Configuration Template
```bash
# Progressive Framework V5 Environment Configuration

# === Application Settings ===
NODE_ENV=development
APP_NAME=Progressive-Framework-V5
APP_VERSION=1.0.0

# === Server Configuration ===
# Main MCA Server
MCA_PORT=3000
MCA_HOST=localhost

# Agent Ports
NPA_PORT=3001  # Nutrition Planning Agent
WPA_PORT=3002  # Workout Planning Agent  
BMA_PORT=3003  # Budget Management Agent (development)

# === Performance Settings ===
# Response Time Targets (milliseconds)
MAX_RESPONSE_TIME=10
HEALTH_CHECK_INTERVAL=30000  # 30 seconds
AGENT_TIMEOUT=30000          # 30 seconds

# === Logging Configuration ===
LOG_LEVEL=info              # error, warn, info, debug
LOG_FORMAT=json             # json, simple, combined
LOG_FILE=logs/application.log
ENABLE_ACCESS_LOGS=true

# === Agent Registry Settings ===
REGISTRY_HEALTH_CHECK_INTERVAL=30000  # 30 seconds
REGISTRY_CLEANUP_INTERVAL=300000      # 5 minutes
MAX_UNHEALTHY_TIME=180000             # 3 minutes before marking agent as failed

# === Performance Monitoring ===
ENABLE_PERFORMANCE_TRACKING=true
METRICS_COLLECTION_INTERVAL=10000     # 10 seconds  
PERFORMANCE_LOG_FILE=logs/performance.log

# === MCA Routing Configuration ===
# Routing Intelligence Settings
ENABLE_KEYWORD_ANALYSIS=true
DOMAIN_SCORING_ALGORITHM=weighted_hybrid
DEFAULT_ROUTING_CONFIDENCE_THRESHOLD=0.6
ENABLE_AGENT_COLLABORATION=true

# Cache Settings
ENABLE_RESPONSE_CACHING=false         # Disable in development
CACHE_TTL=1800000                     # 30 minutes (when enabled)
CACHE_MAX_ENTRIES=1000

# === Security Settings (Future) ===
# Authentication (currently disabled)
ENABLE_AUTHENTICATION=false
JWT_SECRET=your_jwt_secret_here
TOKEN_EXPIRY=24h

# Rate Limiting (currently disabled)
ENABLE_RATE_LIMITING=false
RATE_LIMIT_WINDOW=3600000             # 1 hour
RATE_LIMIT_MAX_REQUESTS=1000

# === Development Tools ===
# Enable development features
ENABLE_DEBUG_ENDPOINTS=true
ENABLE_AGENT_MOCKING=false
DEVELOPMENT_AGENT_DELAYS=false        # Add artificial delays for testing

# === Agent-Specific Configuration ===
# NPA Configuration
NPA_ENABLE_MEAL_PLANNING=true
NPA_ENABLE_NUTRITION_ANALYSIS=true
NPA_DEFAULT_CALORIE_TARGET=2000

# WPA Configuration  
WPA_ENABLE_WORKOUT_PLANNING=true
WPA_ENABLE_EXERCISE_LIBRARY=true
WPA_DEFAULT_WORKOUT_DURATION=45

# BMA Configuration (Development)
BMA_ENABLE=true                       # Enable BMA in development
BMA_DEVELOPMENT_MODE=true
BMA_MOCK_RESPONSES=false
```

### Configuration Validation
```javascript
// Environment Validation Script
class EnvironmentValidator {
  validateEnvironment() {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      recommendations: []
    };
    
    // Required environment variables
    const requiredVars = [
      'NODE_ENV', 'MCA_PORT', 'NPA_PORT', 'WPA_PORT'
    ];
    
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        validation.errors.push(`Missing required environment variable: ${varName}`);
        validation.valid = false;
      }
    });
    
    // Port conflict checking
    const ports = [
      process.env.MCA_PORT,
      process.env.NPA_PORT, 
      process.env.WPA_PORT,
      process.env.BMA_PORT
    ].filter(Boolean);
    
    const uniquePorts = new Set(ports);
    if (ports.length !== uniquePorts.size) {
      validation.errors.push('Port conflicts detected in environment configuration');
      validation.valid = false;
    }
    
    // Performance settings validation
    if (process.env.MAX_RESPONSE_TIME && parseInt(process.env.MAX_RESPONSE_TIME) > 100) {
      validation.warnings.push('MAX_RESPONSE_TIME > 100ms may impact user experience');
    }
    
    // Development recommendations
    if (process.env.NODE_ENV === 'development') {
      validation.recommendations.push('Consider enabling ENABLE_DEBUG_ENDPOINTS for development');
      validation.recommendations.push('Set LOG_LEVEL=debug for detailed debugging information');
    }
    
    return validation;
  }
}

// Run validation
node -e "
const validator = new EnvironmentValidator();
const result = validator.validateEnvironment();
console.log('Environment Validation:', result);
"
```

---

## Agent System Startup

### Development Startup Options

#### Option 1: All-in-One Development (Recommended)
```bash
# Start all agents simultaneously with auto-restart
npm run dev

# This runs:
# - MCA on port 3000 (Master Control Agent)
# - NPA on port 3001 (Nutrition Planning Agent)  
# - WPA on port 3002 (Workout Planning Agent)
# - BMA on port 3003 (Budget Management Agent, when ready)

# Console output will show:
# [MCA] Master Control Agent starting on port 3000...
# [NPA] Nutrition Planning Agent starting on port 3001...
# [WPA] Workout Planning Agent starting on port 3002...
# [MCA] Agent registry initialized...
# [MCA] All agents registered successfully ✅
# [MCA] System ready - Performance: 5.17ms avg response time
```

#### Option 2: Individual Agent Startup (For Debugging)
```bash
# Terminal 1: Start MCA first (required for registry)
npm run start:mca

# Wait for MCA ready message, then in separate terminals:

# Terminal 2: Start NPA
npm run start:npa

# Terminal 3: Start WPA  
npm run start:wpa

# Terminal 4: Start BMA (when developing budget features)
npm run start:bma
```

#### Option 3: Production-Like Startup (For Testing)
```bash
# Install PM2 process manager
npm install -g pm2

# Start with PM2 (production-like environment)
npm run start:prod

# Monitor processes
pm2 status
pm2 logs
pm2 monit

# Stop all processes
pm2 stop all
pm2 delete all
```

### Startup Verification Checklist
```bash
# ✅ 1. Check MCA Health
curl http://localhost:3000/health
# Expected: {"status":"healthy","timestamp":"..."}

# ✅ 2. Verify Agent Registry
curl http://localhost:3000/agents
# Expected: Array with MCA, NPA, WPA (and BMA if enabled)

# ✅ 3. Test MCA Routing
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test routing"}'
# Expected: Successful routing response

# ✅ 4. Test Direct Agent Communication
curl -X POST http://localhost:3000/chat/npa \
  -H "Content-Type: application/json" \
  -d '{"message": "test nutrition agent"}'
# Expected: Direct NPA response

# ✅ 5. Verify Performance Metrics
curl http://localhost:3000/mca/metrics
# Expected: Performance metrics with response times < 10ms

# ✅ 6. Test Agent Collaboration
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "meal plan and workout routine"}'
# Expected: NPA response with WPA collaboration suggestion
```

---

## Development Workflow

### Daily Development Routine
```bash
# 1. Start your development session
cd C:\Projects\Progressive-Framework-v5
git pull origin main                 # Get latest changes
npm install                          # Update dependencies if needed

# 2. Start the agent system
npm run dev                          # All agents with auto-restart

# 3. Verify system health
npm run health                       # Quick health check script

# 4. Start development work
# - Edit agent code in src/agents/
# - Modify MCA routing in src/core/mca.js
# - Update communication protocols
# - nodemon will auto-restart on changes

# 5. Test your changes
npm test                            # Run unit tests
npm run test:integration            # Test agent communication
curl commands...                    # Manual API testing

# 6. Before committing
npm run lint                        # Fix code style
npm test                           # Ensure all tests pass
git add .
git commit -m "descriptive message"
```

### Hot Reload Development
```javascript
// Nodemon Configuration (nodemon.json)
{
  "watch": [
    "src/"
  ],
  "ext": "js,json",
  "ignore": [
    "logs/*",
    "tests/*",
    "node_modules/*"
  ],
  "delay": 1000,
  "env": {
    "NODE_ENV": "development"
  },
  "events": {
    "restart": "echo '\n🔄 Agent system restarting due to file changes...\n'"
  }
}

// Development Server with Auto-Restart
// File: src/dev-server.js
const chokidar = require('chokidar');

class DevelopmentServer {
  startWithHotReload() {
    // Start agent system
    this.startAgentSystem();
    
    // Watch for file changes
    const watcher = chokidar.watch('src/', {
      ignored: /node_modules/,
      persistent: true
    });
    
    watcher.on('change', (path) => {
      console.log(`📝 File changed: ${path}`);
      console.log('🔄 Restarting affected agents...');
      
      // Intelligent restart - only restart affected agents
      if (path.includes('mca.js')) {
        this.restartMCA();
      } else if (path.includes('nutrition_agent.js')) {
        this.restartAgent('NPA');
      } else if (path.includes('workout_agent.js')) {
        this.restartAgent('WPA');
      } else {
        this.restartAllAgents();
      }
    });
  }
}
```

---

## Testing Your Setup

### Unit Testing Setup
```bash
# Run all tests
npm test

# Run specific test suites
npm test -- --testPathPattern=unit          # Unit tests only
npm test -- --testPathPattern=integration   # Integration tests only
npm test -- --testPathPattern=performance   # Performance tests only

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode (for development)
npm run test:watch
```

### Integration Testing
```javascript
// Integration Test Example
// File: tests/integration/agent-communication.test.js

describe('Agent Communication Integration', () => {
  let server;
  
  beforeAll(async () => {
    // Start test server
    server = await startTestServer();
    await waitForAgentsReady();
  });
  
  afterAll(async () => {
    await server.close();
  });
  
  describe('MCA Routing', () => {
    it('should route nutrition requests to NPA', async () => {
      const response = await request(server)
        .post('/chat')
        .send({ message: 'I need a meal plan' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.agent).toBe('NPA');
      expect(response.body.routing_analysis.confidence).toBeGreaterThan(0.8);
    });
    
    it('should route fitness requests to WPA', async () => {
      const response = await request(server)
        .post('/chat') 
        .send({ message: 'create a workout routine' })
        .expect(200);
      
      expect(response.body.agent).toBe('WPA');
      expect(response.body.performance.total_response_time_ms).toBeLessThan(10);
    });
  });
  
  describe('Agent Collaboration', () => {
    it('should suggest collaboration for multi-domain requests', async () => {
      const response = await request(server)
        .post('/chat')
        .send({ message: 'complete health and fitness plan' })
        .expect(200);
      
      expect(response.body.collaboration).toBeDefined();
      expect(response.body.collaboration.available_agents).toContain('WPA');
    });
  });
});
```

### Performance Testing
```javascript
// Performance Benchmark Tests
// File: tests/performance/response-time.test.js

describe('Performance Benchmarks', () => {
  it('should maintain sub-10ms response times', async () => {
    const requests = [];
    const iterations = 100;
    
    // Generate concurrent requests
    for (let i = 0; i < iterations; i++) {
      requests.push(
        request(app)
          .post('/chat')
          .send({ message: `performance test ${i}` })
      );
    }
    
    const startTime = performance.now();
    const responses = await Promise.all(requests);
    const endTime = performance.now();
    
    // Verify all requests succeeded
    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    
    // Check performance targets
    const avgResponseTime = (endTime - startTime) / iterations;
    expect(avgResponseTime).toBeLessThan(10); // Sub-10ms target
    
    // Verify individual response times
    responses.forEach(response => {
      const responseTime = response.body.performance.total_response_time_ms;
      expect(responseTime).toBeLessThan(50); // Individual requests under 50ms
    });
  });
  
  it('should handle high concurrency', async () => {
    const concurrentUsers = 50;
    const requestsPerUser = 5;
    
    const userSessions = [];
    
    for (let user = 0; user < concurrentUsers; user++) {
      const userRequests = [];
      
      for (let req = 0; req < requestsPerUser; req++) {
        userRequests.push(
          request(app)
            .post('/chat')
            .send({ 
              message: `user ${user} request ${req}`,
              context: { user_id: `user_${user}` }
            })
        );
      }
      
      userSessions.push(Promise.all(userRequests));
    }
    
    const allResponses = await Promise.all(userSessions);
    
    // Flatten responses and verify success
    const flatResponses = allResponses.flat();
    const successCount = flatResponses.filter(r => r.body.success).length;
    const successRate = (successCount / flatResponses.length) * 100;
    
    expect(successRate).toBeGreaterThan(99); // > 99% success rate under load
  });
});
```

---

## Agent Development Environment

### Creating a New Agent
```javascript
// Agent Development Template
// File: src/agents/new_agent_template.js

const BaseAgent = require('./base_agent');

class NewAgent extends BaseAgent {
  constructor() {
    super();
    
    // Agent Identity
    this.id = 'new_agent_001';
    this.type = 'NEW';
    this.name = 'New Specialized Agent';
    this.version = '1.0.0';
    
    // Agent Capabilities
    this.capabilities = [
      'new_capability_1',
      'new_capability_2',
      'specialized_feature'
    ];
    
    // Domain Expertise (0.0 to 1.0 scale)
    this.domain_expertise = {
      new_domain: 0.95,     // Primary expertise
      related_domain: 0.60, // Secondary expertise
      general: 0.30         // General knowledge
    };
    
    // Performance Configuration
    this.max_concurrent_requests = 10;
    this.baseline_response_time = 5; // ms
    this.handles_complex_requests = true;
    this.handles_urgent_requests = false;
    
    // Collaboration Configuration
    this.collaboration_patterns = [
      'new_domain_coordination',
      'budget_optimization_support'
    ];
  }
  
  // Implement required agent methods
  async processRequest(request, context) {
    const startTime = performance.now();
    
    try {
      // Your agent-specific processing logic here
      const result = await this.handleSpecializedRequest(request, context);
      
      const endTime = performance.now();
      
      return {
        success: true,
        agent_response: result,
        processing_time_ms: endTime - startTime,
        confidence: this.calculateResponseConfidence(result),
        suggestions: this.generateFollowUpSuggestions(result)
      };
      
    } catch (error) {
      return this.handleError(error, request);
    }
  }
  
  async handleSpecializedRequest(request, context) {
    // Implement your agent's core functionality
    // Example: Parse request, apply domain logic, generate response
    
    return {
      specialized_response: "Your agent's response here",
      metadata: {
        request_complexity: this.assessComplexity(request),
        processing_method: 'specialized_algorithm',
        confidence_level: 'high'
      }
    };
  }
  
  // Health check implementation
  async healthCheck() {
    return {
      status: 'healthy',
      agent_id: this.id,
      uptime: process.uptime(),
      memory_usage: process.memoryUsage(),
      active_requests: this.active_requests,
      load_percentage: this.calculateLoadPercentage(),
      last_error: this.last_error,
      custom_metrics: {
        // Agent-specific health metrics
        specialized_feature_status: 'operational',
        cache_hit_rate: this.cache_hit_rate || 0
      }
    };
  }
}

module.exports = NewAgent;
```

### Agent Registration Process
```javascript
// Agent Registration Script
// File: scripts/register-new-agent.js

async function registerNewAgent(agentClass, port) {
  console.log(`🚀 Starting agent registration process...`);
  
  try {
    // 1. Initialize agent
    const agent = new agentClass();
    await agent.initialize();
    console.log(`✅ Agent ${agent.type} initialized`);
    
    // 2. Start agent HTTP server
    await agent.startHttpServer(port);
    console.log(`✅ Agent server started on port ${port}`);
    
    // 3. Register with MCA
    const registrationResult = await agent.registerWithMCA();
    if (registrationResult.success) {
      console.log(`✅ Agent registered with MCA: ${registrationResult.registry_id}`);
    } else {
      throw new Error(`Registration failed: ${registrationResult.error}`);
    }
    
    // 4. Verify health check
    const healthCheck = await agent.healthCheck();
    if (healthCheck.status === 'healthy') {
      console.log(`✅ Agent health check passed`);
    } else {
      console.warn(`⚠️ Agent health check warning: ${healthCheck.status}`);
    }
    
    // 5. Test basic functionality
    const testResult = await agent.processRequest({
      message: "test agent functionality",
      context: { test: true }
    });
    
    if (testResult.success) {
      console.log(`✅ Agent functionality test passed`);
    } else {
      throw new Error(`Functionality test failed: ${testResult.error}`);
    }
    
    console.log(`🎉 Agent ${agent.type} successfully registered and operational!`);
    
    return {
      agent_id: agent.id,
      agent_type: agent.type,
      port: port,
      status: 'ready'
    };
    
  } catch (error) {
    console.error(`❌ Agent registration failed: ${error.message}`);
    throw error;
  }
}

// Usage
const NewAgent = require('../src/agents/new_agent');
registerNewAgent(NewAgent, 3004)
  .then(result => console.log('Registration complete:', result))
  .catch(error => console.error('Registration failed:', error));
```

---

## Debugging & Monitoring

### Development Debugging Tools
```javascript
// Debug Utilities for Development
// File: src/utils/debug-tools.js

class DevelopmentDebugger {
  constructor() {
    this.debug_mode = process.env.NODE_ENV === 'development';
    this.log_level = process.env.LOG_LEVEL || 'info';
  }
  
  // Enhanced request logging for development
  logRequestDebug(request, routing_analysis, performance) {
    if (!this.debug_mode) return;
    
    console.log('\n🔍 === REQUEST DEBUG ===');
    console.log(`📨 Message: "${request.message}"`);
    console.log(`🏷️ Keywords: [${routing_analysis.keywords.join(', ')}]`);
    console.log('📊 Domain Scores:');
    
    Object.entries(routing_analysis.domain_scores).forEach(([domain, score]) => {
      const bar = '█'.repeat(Math.floor(score * 20));
      console.log(`   ${domain.padEnd(10)} ${score.toFixed(2)} |${bar}`);
    });
    
    console.log(`🎯 Selected Agent: ${routing_analysis.selected_agent}`);
    console.log(`💫 Confidence: ${(routing_analysis.confidence * 100).toFixed(1)}%`);
    console.log(`⚡ Total Time: ${performance.total_time_ms.toFixed(2)}ms`);
    console.log('========================\n');
  }
  
  // Agent performance profiling
  profileAgentPerformance(agent_id, operation, duration) {
    if (!this.debug_mode) return;
    
    const profile = {
      agent_id,
      operation,
      duration_ms: duration,
      timestamp: new Date().toISOString(),
      memory_before: process.memoryUsage(),
      cpu_usage: process.cpuUsage()
    };
    
    // Log slow operations
    if (duration > 20) {
      console.warn(`🐌 Slow operation detected: ${agent_id}.${operation} took ${duration}ms`);
    }
    
    // Store for analysis
    this.storePerformanceProfile(profile);
  }
  
  // Network communication debugging
  debugNetworkCommunication(fromAgent, toAgent, request, response, duration) {
    if (!this.debug_mode) return;
    
    console.log(`\n🌐 Network Communication Debug`);
    console.log(`📤 From: ${fromAgent} → To: ${toAgent}`);
    console.log(`⏱️ Duration: ${duration.toFixed(2)}ms`);
    console.log(`📊 Request Size: ${JSON.stringify(request).length} bytes`);
    console.log(`📋 Response Size: ${JSON.stringify(response).length} bytes`);
    console.log(`✅ Success: ${response.success}`);
    
    if (!response.success) {
      console.error(`❌ Error: ${response.error?.message}`);
    }
    
    console.log('─────────────────────────\n');
  }
}
```

### Live Monitoring Dashboard (Console)
```javascript
// Console-Based Live Monitoring
// File: src/monitoring/console-monitor.js

class ConsoleMonitor {
  startLiveMonitoring() {
    // Clear console and show header
    console.clear();
    console.log('🤖 Progressive Framework V5 - Live Agent Monitoring\n');
    
    // Update every 5 seconds
    this.monitoringInterval = setInterval(() => {
      this.updateDisplay();
    }, 5000);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      clearInterval(this.monitoringInterval);
      console.log('\n👋 Monitoring stopped');
      process.exit(0);
    });
  }
  
  async updateDisplay() {
    // Move cursor to top
    process.stdout.write('\u001b[H');
    
    // Get current metrics
    const systemStatus = await this.getSystemStatus();
    const agentMetrics = await this.getAgentMetrics();
    
    // Display system overview
    console.log('📊 SYSTEM STATUS'.padEnd(50) + `Updated: ${new Date().toLocaleTimeString()}`);
    console.log('─'.repeat(70));
    console.log(`Overall Health: ${systemStatus.status === 'healthy' ? '🟢' : '🔴'} ${systemStatus.status.toUpperCase()}`);
    console.log(`Total Requests: ${systemStatus.total_requests}`);
    console.log(`Success Rate: ${systemStatus.success_rate}%`);
    console.log(`Avg Response: ${systemStatus.avg_response_time.toFixed(2)}ms`);
    console.log('');
    
    // Display agent status
    console.log('🤖 AGENT STATUS');
    console.log('─'.repeat(70));
    
    agentMetrics.forEach(agent => {
      const status_icon = agent.status === 'ready' ? '🟢' : 
                         agent.status === 'busy' ? '🟡' : '🔴';
      const load_bar = '█'.repeat(Math.floor(agent.load / 10));
      
      console.log(`${status_icon} ${agent.type.padEnd(4)} | Load: ${agent.load.toString().padStart(2)}% |${load_bar.padEnd(10)}| Resp: ${agent.avg_response_time.toFixed(1)}ms`);
    });
    
    console.log('\n💡 Press Ctrl+C to stop monitoring');
  }
}

// Start monitoring
if (require.main === module) {
  const monitor = new ConsoleMonitor();
  monitor.startLiveMonitoring();
}
```

---

## Common Setup Issues

### Issue 1: Port Already in Use
```bash
# Error message:
# Error: listen EADDRINUSE: address already in use :::3000

# Solution 1: Check what's using the port
# Windows:
netstat -ano | findstr :3000
# macOS/Linux:  
lsof -i :3000

# Solution 2: Kill the process
# Windows:
taskkill /PID [PID_NUMBER] /F
# macOS/Linux:
kill -9 [PID_NUMBER]

# Solution 3: Use different ports
# Edit .env file:
MCA_PORT=3010
NPA_PORT=3011
WPA_PORT=3012
```

### Issue 2: Agent Registration Failures
```bash
# Error: Agent registration failed: Connection refused

# Diagnosis steps:
# 1. Verify MCA is running first
curl http://localhost:3000/health

# 2. Check agent service status
curl http://localhost:3001/health  # NPA
curl http://localhost:3002/health  # WPA

# 3. Check agent registry status
curl http://localhost:3000/agents

# 4. Review logs for specific errors
tail -f logs/mca.log
tail -f logs/agents.log
```

### Issue 3: Slow Performance in Development
```bash
# If response times > 10ms in development

# Check system resources
node -e "console.log(process.memoryUsage()); console.log(process.cpuUsage());"

# Optimize for development
# In .env:
ENABLE_RESPONSE_CACHING=true
LOG_LEVEL=warn                    # Reduce logging overhead
ENABLE_DEBUG_ENDPOINTS=false      # Disable debug features

# Use production-like startup
npm run start:prod
```

### Issue 4: Agent Communication Timeouts
```bash
# Error: Agent communication timeout

# Check agent health individually
curl http://localhost:3001/health  # Should respond < 1s
curl http://localhost:3002/health

# Test direct agent communication
curl -X POST http://localhost:3001/process \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "context": {}}'

# Increase timeout in development
# In .env:
AGENT_TIMEOUT=60000  # 60 seconds for debugging
```

---

## IDE Configuration

### VS Code Setup
```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/logs": true,
    "**/.git": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/logs": true
  },
  "javascript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}

// .vscode/launch.json - Debugging Configuration
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug MCA",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/main.js",
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "mca:*"
      },
      "console": "integratedTerminal",
      "restart": true
    },
    {
      "name": "Debug NPA",
      "type": "node", 
      "request": "launch",
      "program": "${workspaceFolder}/src/agents/nutrition_agent.js",
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "npa:*"
      },
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal"
    }
  ]
}

// .vscode/tasks.json - Build Tasks
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start All Agents",
      "type": "shell",
      "command": "npm run dev",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "npm test",
      "group": "test"
    },
    {
      "label": "Check System Health", 
      "type": "shell",
      "command": "curl http://localhost:3000/health && curl http://localhost:3000/agents",
      "group": "build"
    }
  ]
}
```

### Code Quality Configuration
```json
// .eslintrc.json
{
  "env": {
    "node": true,
    "es2022": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-console": "off",
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-arrow-callback": "error"
  }
}

// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}

// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/test-setup.js']
};
```

---

## Contributing Guidelines

### Development Process
```bash
# 1. Create feature branch
git checkout -b feature/new-agent-feature
git checkout -b fix/routing-bug
git checkout -b docs/update-api-docs

# 2. Make changes following coding standards
# - Follow existing agent patterns
# - Add tests for new functionality  
# - Update documentation
# - Verify performance impact

# 3. Test changes thoroughly
npm test                          # Unit tests
npm run test:integration          # Integration tests
npm run test:performance          # Performance tests

# 4. Submit for review
git add .
git commit -m "feat: add new agent capability"
git push origin feature/new-agent-feature
# Create pull request
```

### Code Review Checklist
```markdown
## Code Review Checklist

### Functionality
- [ ] New agent follows BaseAgent interface
- [ ] Agent registration works correctly
- [ ] Health checks implemented and passing
- [ ] Error handling covers failure scenarios
- [ ] Performance meets sub-10ms targets

### Testing
- [ ] Unit tests cover new functionality
- [ ] Integration tests verify agent communication
- [ ] Performance tests validate response times
- [ ] Error scenarios tested and handled

### Documentation
- [ ] Code comments explain complex logic
- [ ] API changes documented
- [ ] Agent capabilities documented
- [ ] Setup instructions updated if needed

### Performance
- [ ] No performance regressions introduced
- [ ] Memory usage reasonable
- [ ] Response times under target thresholds
- [ ] Load testing shows acceptable performance

### Security (Future)
- [ ] Input validation implemented
- [ ] No sensitive data logged
- [ ] Authentication integration ready
- [ ] Rate limiting compatible
```

### Coding Standards
```javascript
// Agent Development Standards

// 1. Use consistent naming conventions
class NutritionPlanningAgent extends BaseAgent {  // PascalCase for classes
  constructor() {
    this.agent_type = 'NPA';                      // snake_case for properties
    this.maxConcurrentRequests = 10;              // camelCase for methods/variables
  }
  
  async processNutritionRequest(request) {         // camelCase for methods
    const meal_plan = this.generateMealPlan();     // snake_case for data objects
    return meal_plan;
  }
}

// 2. Error handling patterns
async processRequest(request) {
  try {
    const result = await this.handleRequest(request);
    return this.formatSuccessResponse(result);
  } catch (error) {
    return this.formatErrorResponse(error, request);
  }
}

// 3. Performance monitoring
async processRequest(request) {
  const startTime = performance.now();
  
  const result = await this.handleRequest(request);
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // Log slow requests in development
  if (duration > 20 && process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Slow request: ${duration.toFixed(2)}ms`);
  }
  
  return {
    ...result,
    performance: { processing_time_ms: duration }
  };
}

// 4. Logging standards
const logger = require('../utils/logger');

// Use structured logging
logger.info('Agent request processed', {
  agent_id: this.id,
  request_id: request.request_id,
  duration_ms: duration,
  success: true
});

// Avoid console.log in production code (use logger instead)
```

---

## Related Documentation

### Development Process
- 🛠️ [Agent Development Guide](../02-Agent-Management/Agent-Development-Guide.md) - Building new agents
- 📝 [Coding Standards](./Coding-Standards.md) - Code style and conventions
- 🔄 [Code Review Process](./Code-Review-Process.md) - Review procedures
- 🚀 [Release Process](./Release-Process.md) - Version control and releases

### System Architecture
- 🏗️ [System Overview](../01-Core-System/System-Overview.md) - Complete system architecture
- 🤖 [Agent Registry](../02-Agent-Management/Agent-Registry.md) - Agent management
- 📡 [HTTP Communication](../03-Communication-Protocols/HTTP-Communication.md) - Communication protocols
- 🔧 [Configuration Management](../01-Core-System/Configuration-Management.md) - System configuration

### Testing & Quality
- 🧪 [Testing Strategy](../06-Testing/Testing-Strategy.md) - Complete testing approach
- ⚡ [Performance Testing](../06-Testing/Performance-Testing.md) - Load and performance testing
- 🔗 [Integration Testing](../06-Testing/Integration-Testing.md) - Agent communication testing

### Operations & Deployment
- 🚀 [Deployment Guide](../05-DevOps/Deployment-Guide.md) - Production deployment
- 📊 [Monitoring & Alerting](../05-DevOps/Monitoring-Alerting.md) - Production monitoring
- ❓ [Common Issues](../10-Troubleshooting/Common-Issues.md) - Troubleshooting guide

---

## Document Maintenance

### Review Schedule
- **Weekly**: Development tool updates and dependency management
- **Monthly**: Development workflow optimization and tool evaluation
- **Quarterly**: Complete development environment review and improvement
- **Per Major Release**: Update setup procedures and requirements

### Change Management Process
1. **Environment Changes**: Test on multiple platforms before documenting
2. **Tool Updates**: Verify compatibility with existing development workflow
3. **Process Changes**: Get approval from development team leads
4. **Documentation Updates**: Keep in sync with actual development practices

### Quality Checklist
- [ ] Setup procedures tested on Windows, macOS, and Linux
- [ ] All required software versions documented and verified
- [ ] Environment configuration covers all development scenarios
- [ ] Testing procedures validate complete setup
- [ ] Debugging tools provide effective development support
- [ ] IDE configuration optimizes development workflow
- [ ] Contributing guidelines clear and actionable
- [ ] Performance monitoring works in development environment

---

*The Development Setup provides the foundation for all agent development work. Following these procedures ensures consistent, high-performance agent development across the team.*