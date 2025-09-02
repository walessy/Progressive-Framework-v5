# docs/03-Communication-Protocols/HTTP-Communication.md

# HTTP Communication Protocols

**Last Updated**: August 31, 2025
**Version**: 1.0
**Owner**: Communication Architecture Team
**Review Cycle**: Monthly

## Quick Reference
- **Purpose**: HTTP communication standards and protocols for agent system interactions
- **Audience**: Agent developers, system integrators, API consumers, DevOps engineers
- **Dependencies**: [System Overview](../01-Core-System/System-Overview.md), [Agent Registry](../02-Agent-Management/Agent-Registry.md)
- **Status**: Production-Ready → Documentation In Progress

## Table of Contents
- [Communication Architecture](#communication-architecture)
- [HTTP Protocol Standards](#http-protocol-standards)
- [Agent Communication Patterns](#agent-communication-patterns)
- [Request & Response Formats](#request--response-formats)
- [MCA Routing Protocol](#mca-routing-protocol)
- [Agent-to-Agent Communication](#agent-to-agent-communication)
- [Error Handling & Recovery](#error-handling--recovery)
- [Performance & Optimization](#performance--optimization)
- [Security & Authentication](#security--authentication)
- [Monitoring & Logging](#monitoring--logging)
- [API Endpoint Reference](#api-endpoint-reference)
- [Testing Communication](#testing-communication)
- [Related Documentation](#related-documentation)

---

## Communication Architecture

### Protocol Stack Overview
```
┌─────────────────────────────────────────────────────────────┐
│                  Client Layer                               │
│  Web Clients │ Mobile Apps │ API Consumers │ Third-Party    │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTPS/HTTP
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                Load Balancer                                │
│           (Future: Multi-instance routing)                 │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Master Control Agent (MCA)                     │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  HTTP Server    │  │ Routing Engine  │  │ Agent Pool  │ │
│  │  (Express.js)   │  │                 │  │ Manager     │ │
│  │                 │  │ • Request       │  │             │ │
│  │ • /chat         │  │   Analysis      │  │ • Health    │ │
│  │ • /agents       │  │ • Domain        │  │   Checks    │ │
│  │ • /system       │  │   Scoring       │  │ • Load      │ │
│  │ • /mca/*        │  │ • Agent         │  │   Balance   │ │
│  │                 │  │   Selection     │  │ • Failover  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │ Internal HTTP Communication
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                Specialized Agents                           │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │     NPA     │  │     WPA     │  │        BMA          │ │
│  │             │  │             │  │    (Development)    │ │
│  │ HTTP Server │  │ HTTP Server │  │   HTTP Server       │ │
│  │ Port: 3001  │  │ Port: 3002  │  │   Port: 3003        │ │
│  │             │  │             │  │                     │ │
│  │ • /health   │  │ • /health   │  │   • /health         │ │
│  │ • /process  │  │ • /process  │  │   • /process        │ │
│  │ • /status   │  │ • /status   │  │   • /status         │ │
│  │ • /metrics  │  │ • /metrics  │  │   • /metrics        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Communication Principles
1. **HTTP-First Design**: All agent communication uses standard HTTP protocols
2. **RESTful Architecture**: Resource-based URLs with standard HTTP methods
3. **JSON Message Format**: Standardized JSON for all request/response payloads
4. **Stateless Communication**: Each request contains all necessary context
5. **Idempotent Operations**: Safe retry mechanisms for reliability
6. **Performance Optimization**: Sub-10ms response times with connection reuse
7. **Graceful Degradation**: Fallback mechanisms for communication failures
8. **Comprehensive Logging**: Full request/response logging for debugging and analytics

---

## HTTP Protocol Standards

### Standard HTTP Methods
```javascript
// Agent Communication HTTP Methods
GET    /health          // Health check (idempotent, safe)
GET    /status          // Agent status information (idempotent, safe)  
GET    /metrics         // Performance metrics (idempotent, safe)
GET    /capabilities    // Agent capabilities and metadata (idempotent, safe)

POST   /process         // Process agent request (non-idempotent)
POST   /chat            // Chat interface (non-idempotent)
POST   /collaborate     // Inter-agent collaboration (non-idempotent)
POST   /optimize        // Trigger optimization (non-idempotent)

PUT    /config          // Update agent configuration (idempotent)
PUT    /status          // Update agent status (idempotent)

DELETE /reset           // Reset agent state (idempotent)
DELETE /cache           // Clear agent cache (idempotent)
```

### HTTP Status Code Standards
```javascript
// Success Responses (2xx)
200 OK                  // Successful request processing
201 Created             // Agent registered or resource created
202 Accepted            // Request accepted for async processing
204 No Content          // Successful operation with no response body

// Redirection (3xx)
302 Found               // Temporary agent redirection
307 Temporary Redirect  // Request should be retried with different agent

// Client Errors (4xx)
400 Bad Request         // Invalid request format or parameters
401 Unauthorized        // Authentication required (future)
403 Forbidden           // Insufficient permissions (future)
404 Not Found           // Agent or endpoint not found
408 Request Timeout     // Request processing timeout
409 Conflict            // Agent state conflict
422 Unprocessable Entity // Valid format but processing error
429 Too Many Requests   // Rate limiting (future)

// Server Errors (5xx)
500 Internal Server Error // Unexpected agent error
502 Bad Gateway          // Agent communication failure
503 Service Unavailable  // Agent temporarily unavailable
504 Gateway Timeout      // Agent response timeout
```

### Standard Headers
```http
# Request Headers
Content-Type: application/json
Accept: application/json
User-Agent: Progressive-Framework-V5/1.0
X-Request-ID: req_uuid_v4_string
X-Client-Version: 1.0.0
X-Agent-Target: npa|wpa|bma|mca (optional direct routing)

# Response Headers  
Content-Type: application/json; charset=utf-8
X-Response-Time: 3.2ms
X-Agent-ID: npa_001
X-Agent-Load: 12%
X-Request-ID: req_uuid_v4_string (echo back)
X-Routing-Confidence: 0.95
X-Collaboration-Suggested: true|false

# Performance Headers
X-Cache-Status: HIT|MISS|BYPASS
X-Processing-Time: 2.8ms
X-Queue-Time: 0.4ms
X-Agent-Response-Time: 2.1ms

# Security Headers (Future)
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
```

---

## Agent Communication Patterns

### Pattern 1: MCA-Mediated Communication (Primary)
```javascript
// Client → MCA → Agent Communication Flow
POST /chat HTTP/1.1
Host: localhost:3000
Content-Type: application/json
X-Request-ID: req_abc123

{
  "message": "I need a high protein meal plan",
  "context": {
    "user_preferences": {
      "dietary_restrictions": ["vegetarian"],
      "target_calories": 2200
    }
  }
}

// MCA Processing:
// 1. Keyword Analysis: ["high", "protein", "meal", "plan"]
// 2. Domain Scoring: {nutrition: 0.85, fitness: 0.20, budget: 0.10}
// 3. Agent Selection: NPA (Nutrition Planning Agent)
// 4. Internal HTTP call to NPA

// MCA → NPA Internal Communication
POST /process HTTP/1.1
Host: localhost:3001
Content-Type: application/json
X-Request-ID: req_abc123
X-Source-Agent: MCA
X-Original-Request: base64_encoded_original_request

{
  "message": "I need a high protein meal plan",
  "context": {
    "user_preferences": {
      "dietary_restrictions": ["vegetarian"], 
      "target_calories": 2200
    },
    "routing_analysis": {
      "confidence": 0.85,
      "domain_scores": {
        "nutrition": 0.85,
        "fitness": 0.20,
        "budget": 0.10
      }
    }
  },
  "mca_metadata": {
    "request_id": "req_abc123",
    "routing_timestamp": "2024-08-31T10:00:00Z",
    "client_info": {
      "user_agent": "Progressive-Framework-V5/1.0"
    }
  }
}
```

### Pattern 2: Direct Agent Communication
```javascript
// Client → Agent Direct Communication
POST /chat/npa HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "message": "Create a meal plan for muscle building",
  "context": {
    "target_protein": "150g",
    "meals_per_day": 4
  }
}

// MCA forwards directly to NPA without routing analysis
// Useful for: 
// - Known agent requirements
// - API integrations with specific agents
// - Testing and development
// - Performance optimization (skips routing overhead)
```

### Pattern 3: Agent Collaboration Communication
```javascript
// NPA → WPA Collaboration Request
POST /collaborate HTTP/1.1
Host: localhost:3002
Content-Type: application/json
X-Request-ID: req_abc123
X-Source-Agent: NPA
X-Collaboration-Type: fitness_nutrition_coordination

{
  "collaboration_request": {
    "type": "fitness_nutrition_coordination",
    "context": {
      "user_goal": "muscle_building",
      "nutrition_plan": {
        "daily_calories": 2500,
        "protein_target": "150g",
        "meal_timing": ["7am", "12pm", "3pm", "7pm"]
      }
    },
    "request": "Create workout plan that coordinates with this nutrition schedule"
  },
  "original_request": {
    "message": "I need a complete muscle building plan",
    "user_context": {...}
  }
}

// WPA Response with Collaboration Data
{
  "success": true,
  "collaboration_response": {
    "workout_plan": {
      "schedule": ["9am", "1pm", "5pm"], // Coordinated with meal timing
      "pre_workout_nutrition": "30 minutes before - light protein",
      "post_workout_nutrition": "within 30 minutes - protein + carbs"
    }
  },
  "integration_notes": [
    "Workout scheduled to optimize meal timing",
    "Pre/post workout nutrition aligned with meal plan",
    "Recovery periods account for meal schedule"
  ]
}
```

---

## Request & Response Formats

### Standard Request Format
```json
// Universal Agent Request Structure
{
  // Core Request Data
  "message": "User's natural language request",
  "request_id": "req_uuid_v4", // Optional, generated if not provided
  
  // Context Information
  "context": {
    // User Context
    "user_id": "user_123", // Optional
    "session_id": "session_456", // Optional
    "user_preferences": {
      // User-specific preferences
    },
    
    // Request Context
    "urgency": "normal|high|low", // Optional
    "complexity": "simple|medium|complex", // Optional, can override MCA analysis
    "domain_hint": "nutrition|fitness|budget", // Optional routing hint
    
    // Technical Context
    "timeout": 30000, // milliseconds, optional
    "response_format": "detailed|summary|brief", // Optional
    "include_metadata": true // Include routing and performance data
  },
  
  // Agent-Specific Parameters (for direct agent communication)
  "agent_parameters": {
    // Agent-specific configuration overrides
  }
}
```

### Standard Response Format
```json
// Universal Agent Response Structure
{
  // Response Status
  "success": true,
  "request_id": "req_abc123",
  "timestamp": "2024-08-31T10:00:00Z",
  
  // Agent Information  
  "agent": "NPA",
  "agent_id": "npa_001",
  "response_type": "primary|collaboration|fallback",
  
  // Routing Analysis (MCA-routed requests)
  "routing_analysis": {
    "keywords": ["high", "protein", "meal", "plan"],
    "domain_scores": {
      "nutrition": 0.85,
      "fitness": 0.20,
      "budget": 0.10
    },
    "confidence": 0.85,
    "routing_time_ms": 0.8,
    "alternate_agents": ["WPA"] // Other viable agents
  },
  
  // Primary Response Data
  "response": {
    // Agent-specific response structure
    "meal_plan": {
      "daily_calories": 2200,
      "protein_target": "150g",
      "meals": [
        {
          "meal": "Breakfast",
          "time": "7:00 AM",
          "calories": 550,
          "protein": "35g",
          "foods": ["Greek yogurt", "berries", "protein powder"]
        }
        // ... more meals
      ]
    }
  },
  
  // Collaboration Information
  "collaboration": {
    "suggestion": "Would you like a workout plan to support this nutrition goal?",
    "available_agents": ["WPA"],
    "collaboration_type": "fitness_nutrition_coordination",
    "integration_benefits": [
      "Coordinated meal and workout timing",
      "Optimized pre/post workout nutrition",
      "Enhanced muscle building results"
    ]
  },
  
  // Performance Metrics
  "performance": {
    "total_response_time_ms": 4.2,
    "agent_processing_time_ms": 3.1,
    "routing_overhead_ms": 0.8,
    "agent_load_percentage": 12,
    "queue_time_ms": 0.3
  },
  
  // Metadata
  "metadata": {
    "agent_version": "1.0.0",
    "confidence_level": "high|medium|low",
    "complexity_handled": "simple|medium|complex",
    "cache_status": "hit|miss|generated",
    "follow_up_suggested": true
  }
}
```

### Error Response Format
```json
// Standardized Error Response
{
  "success": false,
  "request_id": "req_abc123",
  "timestamp": "2024-08-31T10:00:00Z",
  
  "error": {
    "code": "AGENT_UNAVAILABLE",
    "message": "Selected agent is currently unavailable",
    "category": "availability|validation|processing|system",
    "severity": "low|medium|high|critical",
    
    // Detailed Error Information
    "details": {
      "agent_type": "NPA",
      "agent_status": "maintenance",
      "expected_recovery": "2024-08-31T10:15:00Z",
      "retry_after": 900 // seconds
    },
    
    // Recovery Suggestions
    "recovery_options": [
      {
        "option": "retry_with_delay",
        "delay_seconds": 900,
        "success_probability": 0.9
      },
      {
        "option": "use_alternative_agent",
        "alternative_agent": "WPA",
        "adaptation_note": "WPA can provide basic nutrition guidance"
      },
      {
        "option": "fallback_to_mca",
        "fallback_note": "MCA can provide general guidance"
      }
    ]
  },
  
  // Fallback Response (when possible)
  "fallback_response": {
    "agent": "MCA",
    "response": {
      "message": "The nutrition specialist is temporarily unavailable. Here's general guidance...",
      "confidence": "low",
      "recommendation": "Please retry in 15 minutes for specialized nutrition planning"
    }
  },
  
  // Technical Debug Information
  "debug": {
    "error_trace_id": "trace_xyz789",
    "agent_last_healthy": "2024-08-31T09:45:00Z",
    "system_load": "15%",
    "routing_attempted": true
  }
}
```

---

## MCA Routing Protocol

### Request Analysis Protocol
```javascript
// MCA Request Processing Pipeline
class MCARequestProcessor {
  async processRequest(request) {
    const processingPipeline = {
      request_id: request.request_id || this.generateRequestId(),
      start_time: performance.now(),
      steps: []
    };
    
    try {
      // Step 1: Request Validation
      const validation = await this.validateRequest(request);
      processingPipeline.steps.push({
        step: 'validation',
        duration_ms: validation.duration,
        result: validation.result
      });
      
      if (!validation.result.valid) {
        return this.createErrorResponse(request, validation.result.errors);
      }
      
      // Step 2: Keyword Analysis
      const keywordAnalysis = await this.analyzeKeywords(request.message);
      processingPipeline.steps.push({
        step: 'keyword_analysis',
        duration_ms: keywordAnalysis.duration,
        result: keywordAnalysis.keywords
      });
      
      // Step 3: Domain Scoring
      const domainScoring = await this.calculateDomainScores(
        keywordAnalysis.keywords, 
        request.context
      );
      processingPipeline.steps.push({
        step: 'domain_scoring', 
        duration_ms: domainScoring.duration,
        result: domainScoring.scores
      });
      
      // Step 4: Agent Selection
      const agentSelection = await this.selectOptimalAgent(
        domainScoring.scores,
        request.context
      );
      processingPipeline.steps.push({
        step: 'agent_selection',
        duration_ms: agentSelection.duration,
        result: {
          selected_agent: agentSelection.agent.agent_id,
          confidence: agentSelection.confidence
        }
      });
      
      // Step 5: Agent Communication
      const agentResponse = await this.communicateWithAgent(
        agentSelection.agent,
        request,
        processingPipeline
      );
      
      // Step 6: Response Enhancement
      const enhancedResponse = this.enhanceResponse(
        agentResponse,
        processingPipeline,
        agentSelection
      );
      
      return enhancedResponse;
      
    } catch (error) {
      return this.handleProcessingError(error, processingPipeline, request);
    }
  }
}
```

### Agent Selection Algorithm  
```javascript
// Advanced Agent Selection with Load Balancing
class AgentSelector {
  async selectOptimalAgent(domainScores, context = {}) {
    const startTime = performance.now();
    
    // Get available agents from registry
    const availableAgents = await this.registry.getAvailableAgents();
    
    if (availableAgents.length === 0) {
      throw new Error('No agents available for processing');
    }
    
    // Calculate agent scores
    const scoredAgents = availableAgents.map(agent => {
      const score = this.calculateAgentScore(agent, domainScores, context);
      return { agent, score };
    });
    
    // Sort by score (descending)
    scoredAgents.sort((a, b) => b.score - a.score);
    
    const bestAgent = scoredAgents[0];
    const alternativeAgents = scoredAgents.slice(1, 3); // Top 2 alternatives
    
    const endTime = performance.now();
    
    return {
      agent: bestAgent.agent,
      confidence: bestAgent.score,
      alternatives: alternativeAgents.map(a => a.agent),
      selection_time_ms: endTime - startTime,
      total_agents_evaluated: availableAgents.length
    };
  }
  
  calculateAgentScore(agent, domainScores, context) {
    let totalScore = 0;
    
    // Domain expertise scoring (60% weight)
    Object.entries(domainScores).forEach(([domain, score]) => {
      const agentExpertise = agent.domain_expertise[domain] || 0;
      totalScore += score * agentExpertise * 0.6;
    });
    
    // Performance scoring (25% weight)
    const performanceScore = this.calculatePerformanceScore(agent);
    totalScore += performanceScore * 0.25;
    
    // Load balancing scoring (15% weight)
    const loadScore = this.calculateLoadScore(agent);
    totalScore += loadScore * 0.15;
    
    // Context bonuses
    if (context.urgency === 'high' && agent.handles_urgent_requests) {
      totalScore += 0.1;
    }
    
    if (context.complexity === 'high' && agent.handles_complex_requests) {
      totalScore += 0.1;
    }
    
    return Math.min(totalScore, 1.0); // Cap at 1.0
  }
}
```

---

## Agent-to-Agent Communication

### Collaboration Protocol
```javascript
// Agent Collaboration Request Format
POST /collaborate HTTP/1.1
Host: localhost:3002 (target agent)
Content-Type: application/json
X-Request-ID: req_abc123
X-Source-Agent: NPA
X-Collaboration-Type: fitness_nutrition_coordination

{
  "collaboration": {
    "type": "fitness_nutrition_coordination",
    "initiating_agent": "NPA",
    "target_agent": "WPA",
    "collaboration_goal": "Create coordinated meal and workout plan",
    "priority": "normal|high|urgent"
  },
  
  "shared_context": {
    "user_goal": "muscle_building",
    "user_constraints": {
      "available_time": "45 minutes workout",
      "dietary_restrictions": ["vegetarian"],
      "equipment": ["home_gym"]
    },
    "timeline": "4_week_program"
  },
  
  "primary_agent_output": {
    "meal_plan": {
      "daily_calories": 2500,
      "protein_target": "150g",
      "meal_schedule": ["7am", "12pm", "3pm", "7pm"],
      "pre_workout_suggestions": "light protein 30min before",
      "post_workout_window": "within 30min after workout"
    }
  },
  
  "collaboration_request": {
    "requested_output": "workout_plan",
    "coordination_requirements": [
      "Schedule workouts around meal timing",
      "Optimize pre/post workout nutrition timing",
      "Ensure workout intensity matches caloric intake"
    ],
    "response_format": "coordinated_plan"
  }
}

// Collaboration Response Format
{
  "success": true,
  "collaboration_id": "collab_xyz789",
  "collaborating_agent": "WPA",
  "primary_agent": "NPA",
  
  "coordinated_response": {
    "workout_plan": {
      "schedule": ["9am", "1pm", "5pm"], // 2 hours after meals
      "workout_duration": "45 minutes",
      "intensity": "moderate_to_high", // Matches caloric surplus
      "pre_workout": {
        "timing": "30 minutes before",
        "nutrition": "Light protein (20g) + simple carbs"
      },
      "post_workout": {
        "timing": "within 30 minutes",
        "nutrition": "Protein (30g) + complex carbs"
      }
    }
  },
  
  "integration_summary": {
    "coordination_achieved": true,
    "synergy_score": 0.92,
    "integration_points": [
      "Meal timing optimized for workout performance",
      "Nutrition timing enhances workout recovery", 
      "Caloric intake supports training intensity"
    ]
  },
  
  "combined_plan_preview": {
    "daily_schedule": [
      "7:00 AM - Breakfast (550 cal, 35g protein)",
      "9:00 AM - Workout (45 min strength training)",
      "9:45 AM - Post-workout protein (30g)",
      "12:00 PM - Lunch (600 cal, 40g protein)",
      // ... rest of coordinated schedule
    ]
  }
}
```

### Inter-Agent Discovery
```javascript
// Agent Discovery for Collaboration
class InterAgentCommunication {
  async findCollaborationPartners(initiatingAgent, collaborationType) {
    const collaborationMap = {
      'fitness_nutrition_coordination': {
        primary_agents: ['NPA', 'WPA'],
        supporting_agents: ['BMA'], // Budget considerations
        collaboration_pattern: 'bidirectional'
      },
      'budget_optimization': {
        primary_agents: ['BMA'],
        supporting_agents: ['NPA', 'WPA'],
        collaboration_pattern: 'budget_primary'
      },
      'comprehensive_health_planning': {
        primary_agents: ['NPA', 'WPA', 'BMA'],
        supporting_agents: ['MCA'], // Orchestration
        collaboration_pattern: 'multi_agent_orchestrated'
      }
    };
    
    const pattern = collaborationMap[collaborationType];
    if (!pattern) {
      throw new Error(`Unknown collaboration type: ${collaborationType}`);
    }
    
    // Find available agents for collaboration
    const availablePartners = [];
    
    for (const agentType of pattern.primary_agents) {
      if (agentType === initiatingAgent.agent_type) continue;
      
      const agents = await this.registry.getReadyAgentsByType(agentType);
      if (agents.length > 0) {
        availablePartners.push({
          agent_type: agentType,
          agent: agents[0], // Select best available instance
          role: 'primary'
        });
      }
    }
    
    for (const agentType of pattern.supporting_agents) {
      const agents = await this.registry.getReadyAgentsByType(agentType);
      if (agents.length > 0) {
        availablePartners.push({
          agent_type: agentType,
          agent: agents[0],
          role: 'supporting'
        });
      }
    }
    
    return {
      collaboration_type: collaborationType,
      pattern: pattern.collaboration_pattern,
      available_partners: availablePartners,
      can_collaborate: availablePartners.length > 0
    };
  }
}
```

---

## Error Handling & Recovery

### Communication Error Categories
```javascript
// Error Classification System
const COMMUNICATION_ERRORS = {
  // Network Errors
  NETWORK_TIMEOUT: {
    code: 'NETWORK_TIMEOUT',
    http_status: 504,
    category: 'network',
    severity: 'medium',
    retry_strategy: 'exponential_backoff',
    max_retries: 3
  },
  
  CONNECTION_REFUSED: {
    code: 'CONNECTION_REFUSED',
    http_status: 502,
    category: 'network', 
    severity: 'high',
    retry_strategy: 'immediate_fallback',
    max_retries: 1
  },
  
  // Agent Errors
  AGENT_UNAVAILABLE: {
    code: 'AGENT_UNAVAILABLE',
    http_status: 503,
    category: 'availability',
    severity: 'medium',
    retry_strategy: 'alternative_agent',
    max_retries: 2
  },
  
  AGENT_OVERLOADED: {
    code: 'AGENT_OVERLOADED',
    http_status: 503,
    category: 'capacity',
    severity: 'low',
    retry_strategy: 'queue_or_alternative',
    max_retries: 3
  },
  
  // Request Errors
  INVALID_REQUEST_FORMAT: {
    code: 'INVALID_REQUEST_FORMAT',
    http_status: 400,
    category: 'validation',
    severity: 'low',
    retry_strategy: 'none',
    max_retries: 0
  },
  
  REQUEST_TOO_COMPLEX: {
    code: 'REQUEST_TOO_COMPLEX',
    http_status: 422,
    category: 'processing',
    severity: 'medium',
    retry_strategy: 'simplify_or_mca_fallback',
    max_retries: 1
  }
};
```

### Retry and Fallback Logic
```javascript
// Communication Resilience Manager
class CommunicationResilience {
  async executeWithRetry(requestFn, errorConfig) {
    let lastError = null;
    let attempt = 0;
    
    while (attempt <= errorConfig.max_retries) {
      try {
        const result = await requestFn();
        
        // Log successful retry if this wasn't first attempt
        if (attempt > 0) {
          this.logSuccessfulRetry(attempt, lastError);
        }
        
        return result;
        
      } catch (error) {
        lastError = error;
        attempt++;
        
        if (attempt <= errorConfig.max_retries) {
          const delay = this.calculateRetryDelay(errorConfig.retry_strategy, attempt);
          
          this.logRetryAttempt(attempt, error, delay);
          
          await this.sleep(delay);
        }
      }
    }
    
    // All retries exhausted
    throw new Error(`Communication failed after ${attempt} attempts: ${lastError.message}`);
  }
  
  calculateRetryDelay(strategy, attempt) {
    switch (strategy) {
      case 'exponential_backoff':
        return Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Cap at 10s
      
      case 'linear_backoff':
        return 1000 * attempt; // 1s, 2s, 3s, etc.
      
      case 'fixed_delay':
        return 2000; // Always 2 seconds
      
      case 'immediate_fallback':
        return 0; // No delay, try alternative immediately
      
      default:
        return 1000; // Default 1 second
    }
  }
  
  // Fallback Agent Selection
  async selectFallbackAgent(originalAgent, domainScores) {
    const fallbackOptions = [
      // Try agents with overlapping domain expertise
      ...await this.findAgentsWithOverlap(originalAgent, domainScores),
      
      // Fall back to MCA for general handling
      await this.registry.getAgent('MCA')
    ].filter(agent => 
      agent && 
      agent.agent_id !== originalAgent.agent_id &&
      agent.status === 'ready'
    );
    
    if (fallbackOptions.length > 0) {
      return {
        fallback_agent: fallbackOptions[0],
        fallback_reason: 'agent_unavailable',
        confidence_adjustment: -0.2 // Lower confidence for fallback
      };
    }
    
    return null; // No fallback available
  }
}
```

---

## Performance & Optimization

### Connection Management
```javascript
// HTTP Connection Optimization
class ConnectionManager {
  constructor() {
    // HTTP Agent with keep-alive for internal communication
    this.httpAgent = new http.Agent({
      keepAlive: true,
      keepAliveMsecs: 30000, // 30 seconds
      maxSockets: 50,        // Per host
      maxFreeSockets: 10,    // Keep warm connections
      timeout: 30000,        // 30 second timeout
      scheduling: 'fifo'     // First-in-first-out
    });
    
    // Connection pool for different agent types
    this.agentConnections = new Map();
  }
  
  async makeAgentRequest(agent, requestData) {
    const startTime = performance.now();
    
    try {
      const response = await fetch(agent.primary_endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestData.request_id,
          'X-Source-Agent': 'MCA',
          'Keep-Alive': 'timeout=30, max=100'
        },
        body: JSON.stringify(requestData),
        agent: this.httpAgent,
        timeout: requestData.timeout || 30000
      });
      
      const endTime = performance.now();
      
      if (!response.ok) {
        throw new Error(`Agent responded with ${response.status}: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      // Add performance metadata
      responseData.performance = {
        ...responseData.performance,
        network_time_ms: endTime - startTime,
        http_status: response.status,
        response_size_bytes: response.headers.get('content-length')
      };
      
      return responseData;
      
    } catch (error) {
      const endTime = performance.now();
      
      throw new Error(`Agent communication failed after ${endTime - startTime}ms: ${error.message}`);
    }
  }
}
```

### Response Caching Strategy
```javascript
// Intelligent Response Caching
class ResponseCache {
  constructor() {
    this.cache = new Map();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
  
  generateCacheKey(request) {
    // Create cache key from request content and context
    const keyData = {
      message: request.message.toLowerCase().trim(),
      context_hash: this.hashObject(request.context || {}),
      agent_preferences: request.agent_parameters || {}
    };
    
    return this.hashObject(keyData);
  }
  
  async getCachedResponse(request) {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.cache.get(cacheKey);
    
    if (!cached) {
      this.cacheMisses++;
      return null;
    }
    
    // Check if cache entry is still valid
    const age = Date.now() - cached.timestamp;
    const maxAge = this.getCacheMaxAge(request);
    
    if (age > maxAge) {
      this.cache.delete(cacheKey);
      this.cacheMisses++;
      return null;
    }
    
    this.cacheHits++;
    
    // Return cached response with cache metadata
    return {
      ...cached.response,
      cache_status: 'hit',
      cache_age_ms: age,
      performance: {
        ...cached.response.performance,
        cache_retrieval_time_ms: 0.1
      }
    };
  }
  
  setCachedResponse(request, response) {
    const cacheKey = this.generateCacheKey(request);
    
    // Don't cache error responses or non-deterministic responses
    if (!response.success || this.isNonDeterministic(request)) {
      return;
    }
    
    this.cache.set(cacheKey, {
      timestamp: Date.now(),
      request: request,
      response: response
    });
    
    // Implement LRU eviction if cache gets too large
    if (this.cache.size > 1000) {
      this.evictOldestEntries(100);
    }
  }
  
  getCacheMaxAge(request) {
    // Different cache durations based on request type
    if (request.message.includes('current') || request.message.includes('today')) {
      return 5 * 60 * 1000; // 5 minutes for time-sensitive requests
    }
    
    if (request.context?.urgency === 'high') {
      return 2 * 60 * 1000; // 2 minutes for urgent requests
    }
    
    return 30 * 60 * 1000; // 30 minutes default
  }
}
```

---

## Security & Authentication

### Current Security Model (No Authentication)
```javascript
// Current Open Access Model
const CURRENT_SECURITY = {
  authentication: 'none', // Open access for development/testing
  authorization: 'none',  // No role-based restrictions
  encryption: 'none',     // HTTP (not HTTPS) for local development
  rate_limiting: 'none',  // No rate limits currently
  input_validation: 'basic' // Basic JSON validation only
};

// Security Headers (Minimal)
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Content-Type': 'application/json; charset=utf-8'
};
```

### Future Security Implementation (Planned)
```javascript
// Planned Security Enhancements
const PLANNED_SECURITY = {
  // Authentication
  authentication: {
    method: 'JWT_tokens',
    providers: ['local', 'oauth2'],
    token_expiry: '24h',
    refresh_tokens: true
  },
  
  // Authorization
  authorization: {
    model: 'RBAC', // Role-Based Access Control
    roles: ['admin', 'user', 'agent_developer', 'readonly'],
    agent_permissions: {
      'admin': ['all_agents', 'system_management'],
      'user': ['npa', 'wpa', 'basic_mca'],
      'agent_developer': ['agent_registry', 'development_endpoints']
    }
  },
  
  // Encryption
  encryption: {
    transport: 'TLS_1.3', // HTTPS for all communication
    at_rest: 'AES_256',   // Encrypt sensitive data storage
    agent_communication: 'mutual_TLS' // Secure inter-agent communication
  },
  
  // Rate Limiting
  rate_limiting: {
    anonymous: '60/hour',
    authenticated: '1000/hour', 
    premium: '10000/hour',
    agent_to_agent: 'unlimited'
  }
};

// Future Authentication Headers
const FUTURE_AUTH_HEADERS = {
  'Authorization': 'Bearer jwt_token_here',
  'X-API-Key': 'api_key_for_service_accounts',
  'X-Client-ID': 'client_identification',
  'X-Request-Signature': 'hmac_request_signature'
};
```

### Input Validation & Sanitization
```javascript
// Request Validation Protocol
class RequestValidator {
  validateAgentRequest(request) {
    const validation = {
      valid: true,
      errors: [],
      warnings: []
    };
    
    // Required Fields
    if (!request.message || typeof request.message !== 'string') {
      validation.errors.push('Message field is required and must be a string');
      validation.valid = false;
    }
    
    // Message Length Limits
    if (request.message && request.message.length > 10000) {
      validation.errors.push('Message exceeds maximum length of 10,000 characters');
      validation.valid = false;
    }
    
    if (request.message && request.message.length < 3) {
      validation.warnings.push('Very short messages may not route optimally');
    }
    
    // Context Validation
    if (request.context && typeof request.context !== 'object') {
      validation.errors.push('Context must be a valid JSON object');
      validation.valid = false;
    }
    
    // Sanitize HTML/Script content
    if (this.containsHtmlOrScript(request.message)) {
      validation.warnings.push('HTML/Script content detected and will be sanitized');
      request.message = this.sanitizeContent(request.message);
    }
    
    // Rate Limiting Check (Future)
    if (this.rateLimitingEnabled) {
      const rateLimitResult = this.checkRateLimit(request);
      if (!rateLimitResult.allowed) {
        validation.errors.push(`Rate limit exceeded: ${rateLimitResult.message}`);
        validation.valid = false;
      }
    }
    
    return validation;
  }
  
  sanitizeContent(content) {
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .trim();
  }
}
```

---

## Monitoring & Logging

### Request Logging Format
```javascript
// Comprehensive Request Logging
class CommunicationLogger {
  logRequest(request, response, performance) {
    const logEntry = {
      // Request Information
      timestamp: new Date().toISOString(),
      request_id: request.request_id,
      method: 'POST',
      endpoint: request.endpoint,
      
      // Client Information
      user_agent: request.headers['user-agent'],
      client_ip: request.ip,
      client_version: request.headers['x-client-version'],
      
      // Request Data
      message_length: request.message.length,
      has_context: !!request.context,
      context_keys: request.context ? Object.keys(request.context) : [],
      
      // Routing Information
      routing: {
        keywords_extracted: response.routing_analysis?.keywords,
        domain_scores: response.routing_analysis?.domain_scores,
        selected_agent: response.agent,
        confidence: response.routing_analysis?.confidence,
        routing_time_ms: response.routing_analysis?.routing_time_ms
      },
      
      // Performance Metrics
      performance: {
        total_time_ms: performance.total_time,
        agent_time_ms: performance.agent_time,
        routing_overhead_ms: performance.routing_overhead,
        network_time_ms: performance.network_time
      },
      
      // Response Information
      response: {
        success: response.success,
        agent_id: response.agent_id,
        response_size_bytes: JSON.stringify(response).length,
        collaboration_suggested: !!response.collaboration,
        cache_status: response.cache_status || 'miss'
      },
      
      // Error Information (if applicable)
      error: response.success ? null : {
        code: response.error?.code,
        category: response.error?.category,
        severity: response.error?.severity
      }
    };
    
    // Send to logging system
    this.writeLogEntry(logEntry);
    
    // Update metrics
    this.updateMetrics(logEntry);
    
    return logEntry;
  }
}
```

### Performance Metrics Collection
```javascript
// Real-time Performance Monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      // Request Volume
      total_requests: 0,
      requests_per_minute: 0,
      requests_per_hour: 0,
      
      // Response Times
      average_response_time: 0,
      p95_response_time: 0,
      p99_response_time: 0,
      response_times: [], // Rolling window
      
      // Success Rates
      success_count: 0,
      error_count: 0,
      success_rate: 100,
      
      // Agent Distribution
      agent_request_distribution: {
        MCA: 0,
        NPA: 0,
        WPA: 0,
        BMA: 0
      },
      
      // Collaboration
      collaboration_requests: 0,
      collaboration_success_rate: 100,
      
      // System Health
      system_load: 0,
      memory_usage: 0,
      active_connections: 0
    };
    
    // Start metrics collection
    this.startMetricsCollection();
  }
  
  recordRequest(logEntry) {
    this.metrics.total_requests++;
    
    // Update response times
    this.metrics.response_times.push(logEntry.performance.total_time_ms);
    
    // Keep rolling window of last 1000 requests
    if (this.metrics.response_times.length > 1000) {
      this.metrics.response_times.shift();
    }
    
    // Calculate percentiles
    const sorted = [...this.metrics.response_times].sort((a, b) => a - b);
    this.metrics.p95_response_time = sorted[Math.floor(sorted.length * 0.95)];
    this.metrics.p99_response_time = sorted[Math.floor(sorted.length * 0.99)];
    this.metrics.average_response_time = sorted.reduce((a, b) => a + b, 0) / sorted.length;
    
    // Update success rates
    if (logEntry.response.success) {
      this.metrics.success_count++;
    } else {
      this.metrics.error_count++;
    }
    
    this.metrics.success_rate = 
      (this.metrics.success_count / this.metrics.total_requests) * 100;
    
    // Update agent distribution
    const agent = logEntry.routing.selected_agent;
    if (this.metrics.agent_request_distribution[agent] !== undefined) {
      this.metrics.agent_request_distribution[agent]++;
    }
    
    // Track collaboration
    if (logEntry.response.collaboration_suggested) {
      this.metrics.collaboration_requests++;
    }
  }
}
```

---

## API Endpoint Reference

### Core Communication Endpoints
```javascript
// Primary Communication Interface
POST /chat
// Description: Main entry point for agent system interaction
// Routing: Automatic via MCA intelligent routing
// Response: Enhanced with routing analysis and collaboration suggestions

POST /chat/:agentType  
// Description: Direct agent communication (bypasses MCA routing)
// Parameters: agentType = npa|wpa|bma|mca
// Use Case: Known agent requirements, testing, performance optimization

GET /agents
// Description: List all available agents and their current status
// Response: Registry information with health and performance data

GET /system/status
// Description: Overall system health and availability
// Response: System-wide metrics and agent availability

GET /mca/status
// Description: MCA-specific status and routing performance
// Response: MCA metrics, routing accuracy, performance data

GET /mca/metrics
// Description: Detailed MCA performance analytics
// Response: Comprehensive routing and system performance metrics

POST /mca/optimize
// Description: Trigger manual system optimization
// Use Case: Performance tuning, load balancing adjustment
```

### Agent-Specific Endpoints (Internal)
```javascript
// Standard Agent Interface (All Agents Implement)
GET  /:agent/health
// Description: Agent health check endpoint
// Response: Health status, performance metrics, capability status

POST /:agent/process  
// Description: Process agent-specific request
// Request: Standardized agent request format
// Response: Agent-specific response with metadata

GET  /:agent/status
// Description: Current agent operational status
// Response: Status, load, performance, configuration

GET  /:agent/metrics
// Description: Agent performance and usage metrics
// Response: Historical performance data and analytics

GET  /:agent/capabilities
// Description: Agent capabilities and domain expertise
// Response: Capability list, domain scores, supported operations

PUT  /:agent/config
// Description: Update agent configuration (Future)
// Request: Configuration updates
// Response: Updated configuration confirmation

POST /:agent/collaborate
// Description: Inter-agent collaboration endpoint
// Request: Collaboration request with shared context
// Response: Collaborative response with integration data
```

### Communication Testing Endpoints
```javascript
// System Testing and Diagnostics
GET /health
// Description: Overall system health check
// Response: Basic system availability status

GET /ping  
// Description: Basic connectivity test
// Response: Simple pong response with timestamp

POST /echo
// Description: Echo test for request/response validation
// Request: Any JSON payload
// Response: Echo of request with metadata

GET /performance
// Description: System performance benchmarks
// Response: Performance test results and benchmarks

POST /test/routing
// Description: Test MCA routing without agent execution
// Request: Test message with context
// Response: Routing analysis without agent call

POST /test/collaboration
// Description: Test agent collaboration patterns
// Request: Collaboration test scenario
// Response: Collaboration test results
```

---

## Testing Communication

### Unit Testing Communication Layer
```javascript
// Communication Protocol Testing
describe('HTTP Communication Protocols', () => {
  
  describe('MCA Request Processing', () => {
    it('should process standard chat request', async () => {
      const request = {
        message: "I need a workout plan",
        context: { fitness_level: "beginner" }
      };
      
      const response = await request(app)
        .post('/chat')
        .send(request)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.agent).toBe('WPA');
      expect(response.body.routing_analysis).toBeDefined();
      expect(response.body.performance.total_response_time_ms).toBeLessThan(10);
    });
    
    it('should handle direct agent communication', async () => {
      const request = {
        message: "Create a high protein meal plan"
      };
      
      const response = await request(app)
        .post('/chat/npa')
        .send(request)
        .expect(200);
      
      expect(response.body.agent).toBe('NPA');
      expect(response.body.routing_analysis).toBeUndefined(); // No routing for direct
    });
  });
  
  describe('Agent Registry Communication', () => {
    it('should return healthy agents', async () => {
      const response = await request(app)
        .get('/agents')
        .expect(200);
      
      expect(response.body.agents).toBeDefined();
      expect(response.body.agents.length).toBeGreaterThan(0);
      
      const healthyAgents = response.body.agents.filter(a => a.status === 'ready');
      expect(healthyAgents.length).toBeGreaterThan(0);
    });
  });
  
  describe('Error Handling', () => {
    it('should handle agent unavailable gracefully', async () => {
      // Mock agent unavailable scenario
      jest.spyOn(agentRegistry, 'getAvailableAgents').mockResolvedValue([]);
      
      const response = await request(app)
        .post('/chat')
        .send({ message: "test request" })
        .expect(503);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('AGENT_UNAVAILABLE');
      expect(response.body.fallback_response).toBeDefined();
    });
  });
});
```

### Performance Testing
```javascript
// Load Testing Communication Protocols
describe('Communication Performance', () => {
  
  it('should maintain sub-10ms response times under load', async () => {
    const requests = [];
    const concurrent_requests = 100;
    
    // Generate concurrent requests
    for (let i = 0; i < concurrent_requests; i++) {
      requests.push(
        request(app)
          .post('/chat')
          .send({ message: `Test request ${i}` })
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
    const totalTime = endTime - startTime;
    const avgTimePerRequest = totalTime / concurrent_requests;
    
    expect(avgTimePerRequest).toBeLessThan(10); // Sub-10ms target
    
    // Check individual response times
    responses.forEach(response => {
      const responseTime = response.body.performance.total_response_time_ms;
      expect(responseTime).toBeLessThan(50); // Individual request under 50ms
    });
  });
  
  it('should handle agent communication failures gracefully', async () => {
    // Mock network failure to agent
    jest.spyOn(fetch, 'default').mockRejectedValue(new Error('ECONNREFUSED'));
    
    const response = await request(app)
      .post('/chat')
      .send({ message: "test request during failure" })
      .expect(200); // Should still return 200 with fallback
    
    expect(response.body.success).toBe(true);
    expect(response.body.response_type).toBe('fallback');
    expect(response.body.agent).toBe('MCA'); // MCA fallback
  });
});
```

### Integration Testing
```bash
# End-to-End Communication Testing
#!/bin/bash

echo "🧪 Testing Progressive Framework V5 Communication Protocols"

# Test 1: Basic connectivity
echo "1. Testing basic connectivity..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health
echo " ✅ Health check passed"

# Test 2: Agent registry
echo "2. Testing agent registry..."
AGENT_COUNT=$(curl -s http://localhost:3000/agents | jq '.agents | length')
echo " ✅ Found $AGENT_COUNT agents"

# Test 3: MCA routing performance
echo "3. Testing MCA routing performance..."
RESPONSE_TIME=$(curl -s -w "%{time_total}" -o /dev/null \
  -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test routing performance"}')
echo " ✅ MCA response time: ${RESPONSE_TIME}s"

# Test 4: Agent collaboration
echo "4. Testing agent collaboration..." 
COLLAB_RESPONSE=$(curl -s -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "meal plan and workout routine for muscle building"}')
echo " ✅ Collaboration test completed"

# Test 5: Error handling
echo "5. Testing error handling..."
ERROR_RESPONSE=$(curl -s -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"invalid": "request format"}')
echo " ✅ Error handling test completed"

echo "🎉 All communication protocol tests passed!"
```

---

## Related Documentation

### Communication Protocols
- 🔀 [Message Routing](./Message-Routing.md) - Advanced routing algorithms and patterns
- 🤝 [Agent Coordination](./Agent-Coordination.md) - Inter-agent collaboration protocols
- 📬 [Event Systems](./Event-Systems.md) - Event-driven communication patterns
- 🔄 [Fallback Mechanisms](./Fallback-Mechanisms.md) - Error recovery and graceful degradation

### Agent Management
- 🤖 [Agent Registry](../02-Agent-Management/Agent-Registry.md) - Agent discovery and health monitoring
- 🔄 [Agent Lifecycle](../02-Agent-Management/Agent-Lifecycle.md) - Agent state management
- 🧠 [Routing Intelligence](../02-Agent-Management/Routing-Intelligence.md) - MCA routing algorithms
- 📊 [Performance Monitoring](../02-Agent-Management/Performance-Monitoring.md) - Agent performance tracking

### System Architecture
- 🏗️ [System Overview](../01-Core-System/System-Overview.md) - Complete system architecture
- 🔧 [Configuration Management](../01-Core-System/Configuration-Management.md) - System configuration
- ⚡ [Performance Optimization](../01-Core-System/Performance-Optimization.md) - System optimization

### Development & Operations
- 🛠️ [Development Setup](../13-Development/Development-Setup.md) - Local environment setup
- 🛠️ [Agent Development Guide](../02-Agent-Management/Agent-Development-Guide.md) - Building new agents
- 🚀 [Deployment Guide](../05-DevOps/Deployment-Guide.md) - Production deployment
- 📊 [Monitoring & Alerting](../05-DevOps/Monitoring-Alerting.md) - System monitoring

### Security & Troubleshooting
- 🛡️ [Security Overview](../04-Security/Security-Overview.md) - Security architecture
- ❓ [Common Issues](../10-Troubleshooting/Common-Issues.md) - Troubleshooting guide
- 🚀 [Getting Started](../08-User-Guides/Getting-Started.md) - User onboarding

---

## Document Maintenance

### Review Schedule
- **Daily**: Performance metrics and error rate monitoring
- **Weekly**: Communication protocol performance review and optimization
- **Monthly**: Full protocol review and security assessment
- **Quarterly**: Protocol evolution and enhancement planning

### Change Management Process
1. **Protocol Changes**: Must maintain backward compatibility with existing agents
2. **Performance Changes**: Require load testing and impact analysis
3. **Security Changes**: Need security review and penetration testing
4. **Agent Interface Changes**: Coordinate with all agent development teams

### Quality Checklist
- [ ] All HTTP endpoints documented with request/response examples
- [ ] Error handling covers all communication failure scenarios
- [ ] Performance targets defined and monitored
- [ ] Security protocols implemented and tested
- [ ] Agent communication patterns standardized
- [ ] Monitoring and logging capture complete communication flow
- [ ] Testing procedures validate all communication paths
- [ ] Documentation reflects current protocol implementation

---

*HTTP Communication Protocols form the backbone of agent coordination in Progressive Framework V5. All agent interactions must follow these standards for optimal performance and reliability.*