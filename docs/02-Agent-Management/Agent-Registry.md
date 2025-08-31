# docs/02-Agent-Management/Agent-Registry.md

# Agent Registry Management

**Last Updated**: August 31, 2025
**Version**: 1.0
**Owner**: Agent Management Team
**Review Cycle**: Monthly

## Quick Reference
- **Purpose**: Core agent registration, discovery, and lifecycle management system
- **Audience**: Agent developers, system administrators, MCA maintainers
- **Dependencies**: [System Overview](../01-Core-System/System-Overview.md), [Getting Started](../08-User-Guides/Getting-Started.md)
- **Status**: Production-Ready → Documentation In Progress

## Table of Contents
- [Registry Overview](#registry-overview)
- [Agent Registration Process](#agent-registration-process)
- [Agent Discovery & Lifecycle](#agent-discovery--lifecycle)
- [Health Monitoring System](#health-monitoring-system)
- [Agent Metadata Management](#agent-metadata-management)
- [Load Balancing & Availability](#load-balancing--availability)
- [Agent States & Transitions](#agent-states--transitions)
- [Registry API Reference](#registry-api-reference)
- [MCA Integration](#mca-integration)
- [Troubleshooting](#troubleshooting)
- [Related Documentation](#related-documentation)

---

## Registry Overview

### Purpose & Architecture
The **Agent Registry** is the central nervous system that manages all agents within the Progressive Framework V5. It provides service discovery, health monitoring, load balancing, and lifecycle management for the Master Control Agent (MCA) and all specialized agents.

```
┌─────────────────────────────────────────────────────────────┐
│                    Agent Registry                           │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Agent Discovery │  │ Health Monitor  │  │Load Balance │ │
│  │                 │  │                 │  │             │ │
│  │ • Registration  │  │ • Health Checks │  │ • Capacity  │ │
│  │ • Capabilities  │  │ • Status Track  │  │ • Selection │ │
│  │ • Metadata      │  │ • Performance   │  │ • Failover  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
    ┌────▼────┐  ┌────▼────┐  ┌───▼────┐
    │   MCA   │  │   NPA   │  │  WPA   │
    │ Router  │  │Nutrition│  │Workout │
    │ Master  │  │Planning │  │Planning│
    └─────────┘  └─────────┘  └────────┘
         │            │            │
         └────────────┼────────────┘
                      │
              ┌───────▼───────┐
              │  Agent Pool   │
              │ • BMA (dev)   │
              │ • Future...   │
              └───────────────┘
```

### Core Responsibilities
- **Agent Registration**: Automated agent discovery and registration process
- **Health Monitoring**: Continuous health checks and status tracking
- **Capability Management**: Agent skill sets and domain expertise tracking  
- **Load Balancing**: Intelligent request distribution across agent instances
- **Failover Management**: Automatic agent failure detection and recovery
- **Performance Analytics**: Agent-level performance metrics and optimization

---

## Agent Registration Process

### Automatic Registration
```javascript
// Agent Self-Registration Protocol
class BaseAgent {
  async registerWithRegistry() {
    const registrationData = {
      agent_id: this.id,
      agent_type: this.type,
      agent_name: this.name,
      version: this.version,
      
      // Capabilities and Domains
      capabilities: this.getCapabilities(),
      domain_expertise: this.getDomainScores(),
      supported_operations: this.getSupportedOperations(),
      
      // Technical Specifications
      max_concurrent_requests: this.maxConcurrency,
      average_response_time: this.baselineResponseTime,
      memory_requirements: this.memoryFootprint,
      
      // Health Check Configuration
      health_check_endpoint: `${this.baseUrl}/health`,
      health_check_interval: this.healthCheckInterval || 30000, // 30 seconds
      
      // Communication
      primary_endpoint: `${this.baseUrl}/process`,
      status_endpoint: `${this.baseUrl}/status`,
      metrics_endpoint: `${this.baseUrl}/metrics`,
      
      // Registration Metadata
      registered_at: new Date().toISOString(),
      startup_time: this.startupTime,
      environment: process.env.NODE_ENV || 'development'
    };
    
    const response = await this.sendRegistration(registrationData);
    
    if (response.success) {
      this.registry_id = response.registry_id;
      this.registration_status = 'registered';
      console.log(`✅ Agent ${this.type} registered successfully`);
    } else {
      throw new Error(`Registration failed: ${response.error}`);
    }
  }
}
```

### Registration Validation
```javascript
// Registry Validation Rules
class RegistryValidator {
  validateAgentRegistration(data) {
    const validation = {
      valid: true,
      errors: [],
      warnings: []
    };
    
    // Required Fields
    const requiredFields = [
      'agent_id', 'agent_type', 'agent_name', 'capabilities', 
      'domain_expertise', 'health_check_endpoint'
    ];
    
    requiredFields.forEach(field => {
      if (!data[field]) {
        validation.errors.push(`Missing required field: ${field}`);
        validation.valid = false;
      }
    });
    
    // Domain Expertise Validation
    if (data.domain_expertise) {
      const validDomains = ['fitness', 'nutrition', 'budget', 'general'];
      const agentDomains = Object.keys(data.domain_expertise);
      
      if (!agentDomains.some(domain => validDomains.includes(domain))) {
        validation.warnings.push('Agent has no recognized domain expertise');
      }
    }
    
    // Health Check Endpoint Validation
    try {
      new URL(data.health_check_endpoint);
    } catch {
      validation.errors.push('Invalid health check endpoint URL');
      validation.valid = false;
    }
    
    return validation;
  }
}
```

### Current Agent Registry
```javascript
// Production Agent Registry Status
{
  "registry_status": "operational",
  "total_agents": 3,
  "active_agents": 3,
  "registry_last_updated": "2024-08-31T10:00:00Z",
  
  "registered_agents": [
    {
      "agent_id": "mca_001",
      "agent_type": "MCA", 
      "agent_name": "Master Control Agent",
      "status": "ready",
      "capabilities": ["routing", "orchestration", "monitoring"],
      "domain_expertise": {
        "general": 1.0,
        "routing": 1.0,
        "system_management": 1.0
      },
      "performance": {
        "average_response_time": "5.17ms",
        "success_rate": "100%",
        "current_load": "0%"
      },
      "health_check_last": "2024-08-31T10:00:00Z",
      "registered_at": "2024-08-31T09:00:00Z"
    },
    {
      "agent_id": "npa_001",
      "agent_type": "NPA",
      "agent_name": "Nutrition Planning Agent", 
      "status": "ready",
      "capabilities": ["meal_planning", "nutrition_analysis", "dietary_recommendations"],
      "domain_expertise": {
        "nutrition": 0.95,
        "health": 0.70,
        "cooking": 0.60
      },
      "performance": {
        "average_response_time": "3.2ms",
        "success_rate": "100%", 
        "current_load": "5%"
      },
      "health_check_last": "2024-08-31T09:59:30Z",
      "registered_at": "2024-08-31T09:00:15Z"
    },
    {
      "agent_id": "wpa_001", 
      "agent_type": "WPA",
      "agent_name": "Workout Planning Agent",
      "status": "ready",
      "capabilities": ["workout_planning", "exercise_programming", "fitness_coaching"],
      "domain_expertise": {
        "fitness": 0.95,
        "health": 0.75,
        "sports": 0.80
      },
      "performance": {
        "average_response_time": "4.1ms",
        "success_rate": "100%",
        "current_load": "8%"
      },
      "health_check_last": "2024-08-31T09:59:45Z", 
      "registered_at": "2024-08-31T09:00:30Z"
    }
  ]
}
```

---

## Agent Discovery & Lifecycle

### Agent Discovery Protocol
```javascript
// Agent Discovery Service
class AgentDiscovery {
  // Find agents by capability
  findAgentsByCapability(capability) {
    return this.registry.filter(agent => 
      agent.capabilities.includes(capability) && 
      agent.status === 'ready'
    );
  }
  
  // Find agents by domain expertise
  findAgentsByDomain(domain, minScore = 0.5) {
    return this.registry.filter(agent => 
      agent.domain_expertise[domain] >= minScore &&
      agent.status === 'ready'
    ).sort((a, b) => 
      b.domain_expertise[domain] - a.domain_expertise[domain]
    );
  }
  
  // Find optimal agent for request
  findOptimalAgent(keywords, domainScores) {
    let bestAgent = null;
    let bestScore = 0;
    
    this.registry.forEach(agent => {
      if (agent.status !== 'ready') return;
      
      let score = 0;
      Object.entries(domainScores).forEach(([domain, domainScore]) => {
        const agentExpertise = agent.domain_expertise[domain] || 0;
        score += domainScore * agentExpertise;
      });
      
      // Apply load balancing factor
      const loadFactor = 1 - (agent.current_load / 100);
      score *= loadFactor;
      
      if (score > bestScore) {
        bestScore = score;
        bestAgent = agent;
      }
    });
    
    return { agent: bestAgent, confidence: bestScore };
  }
}
```

### Agent Lifecycle States
```javascript
// Agent State Machine
const AGENT_STATES = {
  // Startup States
  INITIALIZING: {
    state: 'initializing',
    description: 'Agent starting up, loading configurations',
    can_receive_requests: false,
    next_states: ['ready', 'error']
  },
  
  // Operational States  
  READY: {
    state: 'ready',
    description: 'Agent available and can process requests',
    can_receive_requests: true,
    next_states: ['busy', 'maintenance', 'error', 'shutdown']
  },
  
  BUSY: {
    state: 'busy', 
    description: 'Agent currently processing requests',
    can_receive_requests: true, // Can queue if under capacity
    next_states: ['ready', 'error', 'overloaded']
  },
  
  OVERLOADED: {
    state: 'overloaded',
    description: 'Agent at maximum capacity, rejecting new requests',
    can_receive_requests: false,
    next_states: ['busy', 'ready', 'error']
  },
  
  // Maintenance States
  MAINTENANCE: {
    state: 'maintenance',
    description: 'Agent temporarily unavailable for maintenance',
    can_receive_requests: false,
    next_states: ['ready', 'error', 'shutdown']
  },
  
  // Error States
  ERROR: {
    state: 'error',
    description: 'Agent error state, requires attention',
    can_receive_requests: false,
    next_states: ['ready', 'maintenance', 'shutdown']
  },
  
  // Shutdown States
  SHUTDOWN: {
    state: 'shutdown',
    description: 'Agent gracefully shutting down',
    can_receive_requests: false,
    next_states: [] // Terminal state
  }
};

// State Transition Management
class AgentStateManager {
  transitionState(agentId, newState, reason = '') {
    const agent = this.registry.getAgent(agentId);
    const currentState = AGENT_STATES[agent.status.toUpperCase()];
    
    if (!currentState.next_states.includes(newState)) {
      throw new Error(`Invalid state transition: ${agent.status} → ${newState}`);
    }
    
    const previousState = agent.status;
    agent.status = newState;
    agent.last_state_change = new Date().toISOString();
    agent.state_change_reason = reason;
    
    // Log state transition
    this.logStateTransition(agentId, previousState, newState, reason);
    
    // Notify MCA of state change
    this.notifyMCA(agentId, newState, previousState);
    
    return true;
  }
}
```

---

## Health Monitoring System

### Health Check Protocol
```javascript
// Standardized Health Check Interface
class AgentHealthChecker {
  async performHealthCheck(agent) {
    const healthCheck = {
      agent_id: agent.agent_id,
      check_timestamp: new Date().toISOString(),
      check_type: 'automated',
      results: {}
    };
    
    try {
      const startTime = performance.now();
      
      // Basic connectivity check
      const response = await fetch(agent.health_check_endpoint, {
        method: 'GET',
        timeout: 5000 // 5 second timeout
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      if (response.ok) {
        const healthData = await response.json();
        
        healthCheck.results = {
          status: 'healthy',
          response_time_ms: responseTime,
          agent_load: healthData.load_percentage || 0,
          memory_usage: healthData.memory_usage || 0,
          active_requests: healthData.active_requests || 0,
          uptime: healthData.uptime || 0,
          last_error: healthData.last_error || null,
          custom_metrics: healthData.custom_metrics || {}
        };
        
        // Update registry with health data
        this.updateAgentHealth(agent.agent_id, healthCheck.results);
        
      } else {
        healthCheck.results = {
          status: 'unhealthy',
          response_time_ms: responseTime,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
        
        this.handleUnhealthyAgent(agent.agent_id, healthCheck.results);
      }
      
    } catch (error) {
      healthCheck.results = {
        status: 'error',
        error: error.message,
        error_type: error.constructor.name
      };
      
      this.handleAgentError(agent.agent_id, error);
    }
    
    return healthCheck;
  }
  
  // Health Check Scheduler
  startHealthMonitoring() {
    setInterval(async () => {
      const activeAgents = this.registry.getActiveAgents();
      
      const healthPromises = activeAgents.map(agent => 
        this.performHealthCheck(agent)
      );
      
      const healthResults = await Promise.allSettled(healthPromises);
      
      // Process health check results
      healthResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          this.processHealthCheckResult(result.value);
        } else {
          this.handleHealthCheckFailure(activeAgents[index], result.reason);
        }
      });
      
    }, 30000); // Every 30 seconds
  }
}
```

### Health Metrics Collection
```javascript
// Standard Health Response Format
{
  "agent_id": "npa_001",
  "status": "healthy",
  "timestamp": "2024-08-31T10:00:00Z",
  "uptime": 86400, // seconds
  "performance": {
    "response_time_ms": 3.2,
    "requests_processed": 156,
    "success_rate": "100%",
    "error_count": 0
  },
  "resources": {
    "memory_usage": "45MB",
    "cpu_usage": "12%",
    "active_requests": 2,
    "queue_size": 0
  },
  "capabilities": {
    "meal_planning": "optimal",
    "nutrition_analysis": "optimal", 
    "dietary_restrictions": "optimal",
    "supplement_guidance": "good"
  },
  "last_error": null,
  "custom_metrics": {
    "meal_plans_generated": 45,
    "avg_plan_complexity": "medium",
    "user_satisfaction": 4.8
  }
}
```

---

## Agent Metadata Management

### Agent Capability Definitions
```javascript
// Standardized Capability Framework
const AGENT_CAPABILITIES = {
  // Nutrition Planning Agent (NPA) Capabilities
  NPA: {
    primary_capabilities: [
      'meal_planning',
      'nutrition_analysis', 
      'dietary_recommendations',
      'supplement_guidance'
    ],
    domain_expertise: {
      nutrition: 0.95,
      health: 0.70,
      cooking: 0.60,
      meal_prep: 0.85,
      supplements: 0.75
    },
    supported_operations: [
      'create_meal_plan',
      'analyze_nutrition',
      'suggest_recipes',
      'calculate_macros',
      'recommend_supplements'
    ],
    collaboration_patterns: [
      'fitness_nutrition_coordination', // with WPA
      'budget_nutrition_optimization'   // with BMA
    ]
  },
  
  // Workout Planning Agent (WPA) Capabilities
  WPA: {
    primary_capabilities: [
      'workout_planning',
      'exercise_programming',
      'fitness_coaching',
      'recovery_planning'
    ],
    domain_expertise: {
      fitness: 0.95,
      health: 0.75,
      sports: 0.80,
      strength_training: 0.90,
      cardio: 0.85
    },
    supported_operations: [
      'create_workout_plan',
      'design_exercise_routine',
      'suggest_modifications',
      'track_progress',
      'plan_recovery'
    ],
    collaboration_patterns: [
      'fitness_nutrition_coordination', // with NPA
      'budget_fitness_optimization'     // with BMA
    ]
  },
  
  // Master Control Agent (MCA) Capabilities
  MCA: {
    primary_capabilities: [
      'request_routing',
      'agent_orchestration',
      'performance_monitoring',
      'system_optimization'
    ],
    domain_expertise: {
      general: 1.0,
      routing: 1.0,
      system_management: 1.0,
      optimization: 0.90
    },
    supported_operations: [
      'route_request',
      'orchestrate_agents',
      'monitor_performance',
      'optimize_system',
      'handle_fallback'
    ],
    collaboration_patterns: [
      'coordinates_all_agents'
    ]
  }
};
```

### Dynamic Capability Updates
```javascript
// Agent Capability Updates
class CapabilityManager {
  updateAgentCapabilities(agentId, newCapabilities) {
    const agent = this.registry.getAgent(agentId);
    
    const update = {
      previous_capabilities: agent.capabilities,
      new_capabilities: newCapabilities,
      update_timestamp: new Date().toISOString(),
      update_reason: 'agent_upgrade'
    };
    
    // Validate new capabilities
    const validation = this.validateCapabilities(newCapabilities);
    if (!validation.valid) {
      throw new Error(`Invalid capabilities: ${validation.errors.join(', ')}`);
    }
    
    // Update registry
    agent.capabilities = newCapabilities;
    agent.last_capability_update = update.update_timestamp;
    
    // Notify MCA of capability changes
    this.notifyMCACapabilityChange(agentId, update);
    
    // Log capability change
    this.logCapabilityChange(agentId, update);
    
    return update;
  }
}
```

---

## Load Balancing & Availability

### Load Balancing Algorithm
```javascript
// Intelligent Load Balancing for Agent Selection
class AgentLoadBalancer {
  selectOptimalAgentInstance(agentType, requestComplexity = 'medium') {
    const availableAgents = this.registry.getAgentsByType(agentType)
      .filter(agent => agent.status === 'ready');
    
    if (availableAgents.length === 0) {
      throw new Error(`No available agents of type: ${agentType}`);
    }
    
    if (availableAgents.length === 1) {
      return availableAgents[0];
    }
    
    // Multi-factor selection algorithm
    const scoredAgents = availableAgents.map(agent => ({
      agent,
      score: this.calculateAgentScore(agent, requestComplexity)
    }));
    
    // Sort by score (highest first)
    scoredAgents.sort((a, b) => b.score - a.score);
    
    return scoredAgents[0].agent;
  }
  
  calculateAgentScore(agent, requestComplexity) {
    let score = 100; // Base score
    
    // Load factor (prefer less loaded agents)
    const loadPenalty = agent.current_load * 0.5;
    score -= loadPenalty;
    
    // Performance factor (prefer faster agents)
    const responseTimeBonus = agent.average_response_time < 5 ? 10 : 0;
    score += responseTimeBonus;
    
    // Success rate factor
    const successRateBonus = (agent.success_rate - 95) * 0.2;
    score += successRateBonus;
    
    // Complexity handling (some agents better for complex requests)
    if (requestComplexity === 'high' && agent.handles_complex_requests) {
      score += 15;
    }
    
    // Recent error penalty
    if (agent.last_error_time && 
        Date.now() - new Date(agent.last_error_time).getTime() < 300000) { // 5 minutes
      score -= 20;
    }
    
    return Math.max(score, 0); // Ensure non-negative
  }
}
```

### Availability Management
```javascript
// Agent Availability Tracking
class AvailabilityManager {
  getSystemAvailability() {
    const agents = this.registry.getAllAgents();
    const agentTypes = ['MCA', 'NPA', 'WPA', 'BMA'];
    
    const availability = {
      overall_status: 'healthy',
      agent_availability: {},
      redundancy_status: {},
      critical_agents_down: []
    };
    
    agentTypes.forEach(type => {
      const typeAgents = agents.filter(a => a.agent_type === type);
      const readyAgents = typeAgents.filter(a => a.status === 'ready');
      
      availability.agent_availability[type] = {
        total_instances: typeAgents.length,
        ready_instances: readyAgents.length,
        availability_percentage: (readyAgents.length / typeAgents.length) * 100,
        status: readyAgents.length > 0 ? 'available' : 'unavailable'
      };
      
      // Check redundancy
      availability.redundancy_status[type] = {
        has_redundancy: readyAgents.length > 1,
        single_point_of_failure: readyAgents.length === 1,
        critical_failure: readyAgents.length === 0
      };
      
      // Track critical failures
      if (readyAgents.length === 0) {
        availability.critical_agents_down.push(type);
        availability.overall_status = 'degraded';
      }
    });
    
    return availability;
  }
  
  // Automatic Agent Recovery
  async attemptAgentRecovery(agentId) {
    const agent = this.registry.getAgent(agentId);
    
    const recoverySteps = [
      'ping_health_check',
      'restart_health_monitoring', 
      'clear_error_state',
      'reinitialize_agent',
      'full_agent_restart'
    ];
    
    for (const step of recoverySteps) {
      try {
        const result = await this.executeRecoveryStep(agent, step);
        if (result.success) {
          console.log(`✅ Agent ${agentId} recovered using: ${step}`);
          return { success: true, recovery_method: step };
        }
      } catch (error) {
        console.log(`❌ Recovery step ${step} failed for ${agentId}: ${error.message}`);
      }
    }
    
    return { success: false, error: 'All recovery attempts failed' };
  }
}
```

---

## Registry API Reference

### Agent Management Endpoints
```javascript
// Registry Management API
GET    /registry                     // Get all registered agents
GET    /registry/agents              // List active agents only
GET    /registry/agents/:type        // Get agents by type (NPA, WPA, etc.)
GET    /registry/agents/:id          // Get specific agent details
POST   /registry/agents              // Register new agent
PUT    /registry/agents/:id          // Update agent metadata
DELETE /registry/agents/:id          // Deregister agent
POST   /registry/agents/:id/health   // Manual health check trigger

// Agent Status Management
GET    /registry/status              // Overall registry health
GET    /registry/availability        // System availability report
POST   /registry/optimize            // Trigger load balancing optimization
POST   /registry/agents/:id/restart  // Restart specific agent
POST   /registry/recovery/:id        // Attempt agent recovery

// Performance and Analytics
GET    /registry/metrics             // Registry performance metrics
GET    /registry/agents/:id/metrics  // Specific agent metrics
GET    /registry/load-balance        // Load balancing status
```

### Registration API Examples
```bash
# Register New Agent
curl -X POST http://localhost:3000/registry/agents \
  -H "Content-Type: application/json" \
  -d '{
    "agent_type": "BMA",
    "agent_name": "Budget Management Agent",
    "capabilities": ["budget_planning", "cost_optimization"],
    "domain_expertise": {
      "budget": 0.95,
      "finance": 0.80,
      "optimization": 0.75
    },
    "health_check_endpoint": "http://localhost:3003/health",
    "primary_endpoint": "http://localhost:3003/process"
  }'

# Check Agent Status
curl http://localhost:3000/registry/agents/bma_001

# Manual Health Check
curl -X POST http://localhost:3000/registry/agents/npa_001/health

# Get System Availability
curl http://localhost:3000/registry/availability
```

### Registry Response Formats
```json
// Agent Registration Success
{
  "success": true,
  "registry_id": "reg_abc123",
  "agent_id": "bma_001", 
  "message": "Agent successfully registered",
  "next_steps": [
    "Agent will appear in registry within 30 seconds",
    "Health monitoring will begin automatically",
    "MCA will include agent in routing decisions"
  ]
}

// Registry Status Response
{
  "registry_status": "operational",
  "total_registered_agents": 4,
  "active_agents": 3,
  "agents_in_error": 0,
  "agents_in_maintenance": 1,
  "last_health_check": "2024-08-31T10:00:00Z",
  "load_balancing_active": true,
  "auto_recovery_enabled": true
}

// Agent Details Response
{
  "agent_id": "npa_001",
  "agent_type": "NPA",
  "status": "ready",
  "registration": {
    "registered_at": "2024-08-31T09:00:15Z",
    "registry_id": "reg_npa001",
    "version": "1.0.0"
  },
  "health": {
    "last_check": "2024-08-31T09:59:30Z",
    "status": "healthy",
    "response_time_ms": 3.2,
    "uptime": 86385,
    "load_percentage": 5
  },
  "performance": {
    "total_requests": 42,
    "success_rate": "100%",
    "average_response_time": "3.1ms",
    "peak_load": "25%"
  },
  "capabilities": [
    "meal_planning",
    "nutrition_analysis", 
    "dietary_recommendations"
  ]
}
```

---

## MCA Integration

### Registry-MCA Communication
```javascript
// MCA Registry Integration
class MCARegistryInterface {
  async getAvailableAgents(domainScores, excludeAgents = []) {
    const allAgents = await this.registry.getActiveAgents();
    
    // Filter out excluded agents
    const availableAgents = allAgents.filter(agent => 
      !excludeAgents.includes(agent.agent_id) &&
      agent.status === 'ready' &&
      agent.current_load < agent.max_load_threshold
    );
    
    // Score agents based on domain match
    const scoredAgents = availableAgents.map(agent => ({
      agent,
      domain_score: this.calculateDomainMatchScore(agent, domainScores),
      load_score: this.calculateLoadScore(agent),
      performance_score: this.calculatePerformanceScore(agent)
    }));
    
    // Combined scoring algorithm
    scoredAgents.forEach(item => {
      item.total_score = (
        item.domain_score * 0.6 +        // Domain expertise weight
        item.performance_score * 0.25 +   // Performance weight  
        item.load_score * 0.15            // Load balancing weight
      );
    });
    
    return scoredAgents.sort((a, b) => b.total_score - a.total_score);
  }
  
  // Notify registry of routing decisions
  async recordRoutingDecision(routingResult) {
    const routingRecord = {
      timestamp: new Date().toISOString(),
      request_id: routingResult.request_id,
      selected_agent: routingResult.selected_agent,
      confidence: routingResult.confidence,
      domain_scores: routingResult.domain_scores,
      response_time: routingResult.response_time,
      success: routingResult.success,
      collaboration_agents: routingResult.collaboration_agents || []
    };
    
    // Update agent performance metrics
    await this.registry.updateAgentMetrics(
      routingResult.selected_agent,
      routingRecord
    );
    
    // Store routing decision for analysis
    await this.registry.storeRoutingDecision(routingRecord);
  }
}
```

### Registry-Driven Optimization
```javascript
// Performance-Based Registry Optimization
class RegistryOptimizer {
  async optimizeAgentAllocation() {
    const agents = await this.registry.getAllAgents();
    const routingHistory = await this.registry.getRoutingHistory(24); // Last 24 hours
    
    const optimization = {
      timestamp: new Date().toISOString(),
      analysis: {},
      recommendations: [],
      actions_taken: []
    };
    
    // Analyze routing patterns
    const routingAnalysis = this.analyzeRoutingPatterns(routingHistory);
    optimization.analysis.routing_patterns = routingAnalysis;
    
    // Identify overloaded agents
    const overloadedAgents = agents.filter(agent => 
      agent.current_load > 80 || 
      agent.average_response_time > agent.baseline_response_time * 1.5
    );
    
    if (overloadedAgents.length > 0) {
      optimization.recommendations.push({
        type: 'scale_up',
        agents: overloadedAgents.map(a => a.agent_id),
        reason: 'High load or degraded performance detected'
      });
    }
    
    // Identify underutilized agents
    const underutilizedAgents = agents.filter(agent =>
      agent.current_load < 10 && 
      agent.total_requests_today < 5
    );
    
    if (underutilizedAgents.length > 0) {
      optimization.recommendations.push({
        type: 'scale_down',
        agents: underutilizedAgents.map(a => a.agent_id),
        reason: 'Low utilization detected'
      });
    }
    
    return optimization;
  }
}
```

---

## Troubleshooting

### Common Registry Issues

#### ❌ **Agent Registration Fails**
```bash
Error: Agent registration failed: Invalid health check endpoint
```
**Diagnosis Steps:**
1. Verify agent health endpoint is accessible
2. Check agent is running and responding to health checks  
3. Validate registration data format
4. Check registry service connectivity

**Solution:**
```bash
# Test agent health endpoint manually
curl http://localhost:3003/health

# Verify agent is running
ps aux | grep "your-agent-process"

# Check registry logs
curl http://localhost:3000/registry/status
```

#### ❌ **Agent Appears as "Unhealthy"**
```json
{
  "agent_id": "npa_001",
  "status": "error",
  "last_error": "Health check timeout"
}
```
**Diagnosis Steps:**
1. Check agent process status
2. Verify network connectivity
3. Review agent logs for errors
4. Test health endpoint manually

**Solution:**
```bash
# Manual health check
curl http://localhost:3001/health

# Restart agent if needed
pm2 restart npa_001

# Trigger recovery from registry
curl -X POST http://localhost:3000/registry/recovery/npa_001
```

#### ❌ **MCA Can't Find Suitable Agent**
```json
{
  "success": false,
  "error": {
    "code": "NO_SUITABLE_AGENT",
    "message": "No agents available for this request type"
  }
}
```
**Diagnosis Steps:**
1. Check which agents are registered and healthy
2. Verify domain expertise matches request type
3. Review agent load levels

**Solution:**
```bash
# Check agent availability
curl http://localhost:3000/registry/availability

# Check specific agent status
curl http://localhost:3000/registry/agents/npa_001

# Manual system optimization
curl -X POST http://localhost:3000/registry/optimize
```

### Registry Health Commands
```bash
# Complete registry diagnostics
curl http://localhost:3000/registry/status

# Agent-specific diagnostics  
curl http://localhost:3000/registry/agents/npa_001/metrics

# Trigger registry optimization
curl -X POST http://localhost:3000/registry/optimize

# Force agent health refresh
curl -X POST http://localhost:3000/registry/agents/refresh-health
```

---

## Related Documentation

### Agent Management
- 🔄 [Agent Lifecycle](./Agent-Lifecycle.md) - Agent states and transitions
- 🧠 [Routing Intelligence](./Routing-Intelligence.md) - MCA routing algorithms  
- 📊 [Performance Monitoring](./Performance-Monitoring.md) - Agent performance tracking
- 🤝 [Collaboration Patterns](./Collaboration-Patterns.md) - Inter-agent communication
- 🛠️ [Agent Development Guide](./Agent-Development-Guide.md) - Building new agents

### System Architecture
- 🏗️ [System Overview](../01-Core-System/System-Overview.md) - Complete system architecture
- 📡 [HTTP Communication](../03-Communication-Protocols/HTTP-Communication.md) - API protocols
- 🔧 [Configuration Management](../01-Core-System/Configuration-Management.md) - System configuration

### Operations & Deployment
- 🚀 [Deployment Guide](../05-DevOps/Deployment-Guide.md) - Production deployment
- 📊 [Monitoring & Alerting](../05-DevOps/Monitoring-Alerting.md) - System monitoring
- 🛡️ [Security Overview](../04-Security/Security-Overview.md) - Security architecture

### User & Admin Guides
- 🚀 [Getting Started](../08-User-Guides/Getting-Started.md) - User onboarding guide
- 🛠️ [System Administration](../09-Admin-Guides/System-Administration.md) - Admin procedures
- ❓ [Common Issues](../10-Troubleshooting/Common-Issues.md) - Troubleshooting guide

---

## Document Maintenance

### Review Schedule
- **Weekly**: Agent performance metrics and health status review
- **Monthly**: Full registry configuration and optimization review
- **Quarterly**: Agent capability assessment and expansion planning
- **Per Agent Addition**: Registry integration and load balancing updates

### Change Management Process
1. **Agent Registry Changes**: Must maintain backward compatibility with MCA
2. **Health Check Changes**: Require testing across all agent types
3. **Load Balancing Changes**: Must include performance impact analysis
4. **API Changes**: Follow standard API versioning procedures

### Quality Checklist
- [ ] All agent registration procedures documented and tested
- [ ] Health monitoring covers all critical agent functions
- [ ] Load balancing algorithms verified under load
- [ ] Error recovery procedures tested and validated
- [ ] Performance metrics collection working correctly
- [ ] MCA integration functioning properly
- [ ] Documentation reflects current registry implementation

---

*The Agent Registry is the foundation of agent management in Progressive Framework V5. All agent operations depend on proper registry function and health monitoring.*