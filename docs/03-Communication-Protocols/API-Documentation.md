---
file: docs/03-Interfaces/API-Documentation.md
directory: docs/03-Interfaces/
priority: CRITICAL
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# API Documentation - Progressive-Framework-v5

**File Path**: `docs/03-Interfaces/API-Documentation.md`  
**Directory**: `docs/03-Interfaces/`  
**Priority**: CRITICAL  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive API documentation for Progressive-Framework-v5, covering all REST endpoints, GraphQL schemas, WebSocket connections, and agent-specific APIs. The system provides a unified API gateway with intelligent routing through the Master Control Agent (MCA) and direct access to specialized agents when needed.

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🤖 **[Agent Architecture](../07-Architecture/Agent-Architecture.md)** - *Multi-agent system design*
- 🛡️ **[Security Overview](../04-Security/Security-Overview.md)** - *Security requirements and policies*

---

## **API ARCHITECTURE OVERVIEW**

### **API Gateway Structure**
```
Progressive-Framework-v5 API Architecture:

                         CLIENT APPLICATIONS
                    ┌─────────────────────────────┐
                    │  Web App │ Mobile │ Third-  │
                    │ (React)  │  App   │ Party   │
                    └─────────────────────────────┘
                              │
                    ┌─────────────────────────────┐
                    │       API GATEWAY           │
                    │     (NGINX + Auth)          │
                    │                             │
                    │ • Rate Limiting             │
                    │ • Authentication            │
                    │ • Request Validation        │
                    │ • Response Caching          │
                    │ • Load Balancing            │
                    └─────────────────────────────┘
                              │
                    ┌─────────────────────────────┐
                    │    MASTER CONTROL API       │
                    │        (MCA Core)           │
                    │                             │
                    │ • Intelligent Routing       │
                    │ • Request Analysis          │
                    │ • Response Synthesis        │
                    │ • Agent Coordination        │
                    └─────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ UNIFIED API │      │ DIRECT APIs │      │ ADMIN APIs  │
│             │      │             │      │             │
│ /api/v1/    │      │ /api/v1/    │      │ /api/v1/    │
│ chat        │      │ agents/     │      │ admin/      │
│ plans       │      │ npa/        │      │ system/     │
│ insights    │      │ wpa/        │      │ monitoring/ │
│ users       │      │ bma/        │      │ management/ │
└─────────────┘      └─────────────┘      └─────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────────────────────────┐
                    │      AGENT ECOSYSTEM        │
                    │                             │
                    │ NPA │ WPA │ BMA │ RPA │ EMA │
                    └─────────────────────────────┘
```

### **API Versioning Strategy**
```
API Version Management:

VERSION 1.0 (Current - Production)
├─ Base Path: /api/v1/
├─ Status: Stable, fully supported
├─ Deprecation: Not planned (LTS)
└─ Features: Core functionality, all agents

VERSION 1.1 (Future - Development)
├─ Base Path: /api/v1.1/
├─ Status: Beta, preview features
├─ Features: Enhanced AI, voice interface
└─ Migration Path: Backward compatible

VERSION 2.0 (Roadmap - Planning)
├─ Base Path: /api/v2/
├─ Status: Design phase
├─ Features: GraphQL primary, REST legacy
└─ Breaking Changes: New authentication model

VERSIONING PRINCIPLES:
├─ Semantic Versioning (Major.Minor.Patch)
├─ Backward Compatibility for Minor versions
├─ 18-month support cycle per major version
├─ Progressive enhancement over breaking changes
└─ Clear deprecation timeline (12 months notice)
```

---

## **AUTHENTICATION & AUTHORIZATION**

### **Authentication Methods**
```javascript
// JWT Token Authentication (Primary)
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "securePassword",
  "mfa_code": "123456" // Optional MFA
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600, // 1 hour
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "profile": {
      "name": "John Doe",
      "preferences": {...}
    }
  }
}

// API Key Authentication (Third-Party)
GET /api/v1/plans/meal-plans
Headers:
  X-API-Key: your-api-key-here
  Content-Type: application/json

// OAuth 2.0 (Social Login)
GET /api/v1/auth/oauth/google
  ?client_id=your-client-id
  &redirect_uri=https://your-app.com/callback
  &scope=profile email
  &state=random-state-string
```

### **Authorization Scopes & Permissions**
```yaml
# RBAC Permission Matrix
permissions:
  user:
    plans: ['read', 'create', 'update']
    profile: ['read', 'update']
    insights: ['read']
    
  premium:
    inherits: ['user']
    plans: ['read', 'create', 'update', 'advanced']
    insights: ['read', 'detailed', 'predictive']
    agents: ['direct_access']
    
  admin:
    inherits: ['premium']
    system: ['read', 'update', 'manage']
    users: ['read', 'update', 'suspend']
    monitoring: ['read', 'manage']
    
  api_partner:
    plans: ['read', 'create']
    insights: ['read', 'basic']
    webhooks: ['create', 'manage']
    
scopes:
  - profile: Access user profile information
  - plans:read: Read meal plans, workouts, budgets
  - plans:write: Create and modify plans
  - insights:read: Access analytics and reports
  - agents:direct: Direct agent API access
  - admin:system: System administration
```

---

## **UNIFIED API ENDPOINTS**

### **Chat & Conversation API**
*Unified interface for natural language interaction with the agent system*

#### **Start Conversation**
```http
POST /api/v1/chat
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "message": "I need a meal plan for weight loss with a $50/week budget",
  "context": {
    "user_id": "user-uuid",
    "session_id": "session-uuid", // Optional
    "preferences": {
      "dietary_restrictions": ["gluten-free"],
      "cuisine_types": ["italian", "mediterranean"]
    }
  },
  "options": {
    "include_reasoning": true,
    "max_agents": 3,
    "timeout": 30000
  }
}
```

#### **Response Format**
```json
{
  "conversation_id": "conv-uuid",
  "request_id": "req-uuid",
  "response": {
    "message": "I've created a comprehensive weight loss meal plan that fits your $50 weekly budget and gluten-free requirements. The plan includes Italian and Mediterranean dishes you'll love.",
    "data": {
      "meal_plan": {
        "id": "plan-uuid",
        "duration": "7 days",
        "total_cost": 48.50,
        "calories_per_day": 1500,
        "meals": [
          {
            "day": 1,
            "breakfast": {
              "name": "Gluten-Free Italian Frittata",
              "calories": 350,
              "cost": 3.25,
              "prep_time": "15 minutes"
            }
          }
        ]
      }
    },
    "actions": [
      {
        "type": "generate_shopping_list",
        "label": "Create Shopping List",
        "url": "/api/v1/plans/meal-plans/plan-uuid/shopping-list"
      }
    ]
  },
  "metadata": {
    "processing_time": 1.2,
    "agents_used": ["mca", "npa", "bma"],
    "routing_strategy": "collaborative",
    "confidence": 0.92
  },
  "next_suggestions": [
    "Would you like a workout plan to complement this meal plan?",
    "Should I create a grocery shopping list for you?",
    "Do you want to adjust any meals based on your preferences?"
  ]
}
```

#### **Continue Conversation**
```http
POST /api/v1/chat/{conversation_id}
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "message": "Yes, create the shopping list and add a workout plan too",
  "context": {
    "previous_response_id": "req-uuid"
  }
}
```

### **Plans Management API**
*Create, retrieve, and manage meal plans, workout programs, and budgets*

#### **Get All Plans**
```http
GET /api/v1/plans?type=meal&status=active&limit=10&offset=0
Authorization: Bearer {jwt_token}

Response:
{
  "plans": [
    {
      "id": "plan-uuid",
      "type": "meal_plan",
      "name": "7-Day Weight Loss Plan",
      "status": "active",
      "created_at": "2025-09-01T10:00:00Z",
      "updated_at": "2025-09-02T15:30:00Z",
      "agent": "npa",
      "metadata": {
        "duration": "7 days",
        "goal": "weight_loss",
        "calories_per_day": 1500
      }
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "has_more": true
  }
}
```

#### **Create Plan**
```http
POST /api/v1/plans
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "type": "meal_plan",
  "parameters": {
    "goal": "weight_loss",
    "duration": "14 days",
    "target_calories": 1500,
    "budget": 70,
    "dietary_restrictions": ["vegetarian"],
    "meal_preferences": {
      "breakfast_type": "quick",
      "lunch_type": "portable",
      "dinner_type": "family"
    }
  },
  "options": {
    "include_shopping_list": true,
    "include_prep_instructions": true,
    "alternative_options": 2
  }
}
```

#### **Update Plan**
```http
PUT /api/v1/plans/{plan_id}
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "modifications": {
    "replace_meals": [
      {
        "day": 3,
        "meal": "lunch",
        "replacement_criteria": {
          "max_prep_time": 10,
          "protein_focus": true
        }
      }
    ],
    "adjust_budget": 60,
    "extend_duration": "21 days"
  },
  "regenerate_affected": true
}
```

### **User Profile & Preferences API**
*Manage user profiles, preferences, and personalization data*

#### **Get User Profile**
```http
GET /api/v1/users/profile
Authorization: Bearer {jwt_token}

Response:
{
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "profile": {
      "name": "John Doe",
      "age": 30,
      "height": 180,
      "weight": 75,
      "activity_level": "moderate",
      "goals": ["weight_loss", "muscle_gain"]
    },
    "preferences": {
      "dietary_restrictions": ["gluten-free"],
      "cuisine_preferences": ["italian", "mediterranean"],
      "workout_types": ["strength", "cardio"],
      "equipment_available": ["dumbbells", "resistance_bands"],
      "budget_range": {
        "food_weekly": 50,
        "fitness_monthly": 100
      }
    },
    "settings": {
      "notifications": {
        "meal_reminders": true,
        "workout_reminders": true,
        "progress_updates": true
      },
      "privacy": {
        "data_sharing": "minimal",
        "analytics_opt_in": true
      }
    }
  }
}
```

#### **Update Preferences**
```http
PATCH /api/v1/users/preferences
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "dietary_restrictions": {
    "add": ["dairy-free"],
    "remove": []
  },
  "fitness_goals": {
    "primary": "strength_gain",
    "secondary": ["flexibility"]
  },
  "budget_constraints": {
    "food_weekly": 60,
    "fitness_monthly": 80
  }
}
```

### **Insights & Analytics API**
*Access personalized analytics, progress tracking, and insights*

#### **Get Progress Dashboard**
```http
GET /api/v1/insights/dashboard?period=30d
Authorization: Bearer {jwt_token}

Response:
{
  "period": "30 days",
  "summary": {
    "goals_achieved": 8,
    "total_goals": 12,
    "adherence_rate": 0.85,
    "improvement_trend": "positive"
  },
  "domains": {
    "nutrition": {
      "plans_completed": 3,
      "average_adherence": 0.90,
      "calories_trend": "decreasing",
      "budget_efficiency": 0.92
    },
    "fitness": {
      "workouts_completed": 18,
      "average_adherence": 0.80,
      "strength_progress": "+15%",
      "consistency_score": 0.85
    },
    "budget": {
      "budget_adherence": 0.88,
      "savings_identified": 245.50,
      "spending_optimization": "+12%"
    }
  },
  "recommendations": [
    {
      "type": "improvement",
      "domain": "fitness",
      "message": "Consider adding one more workout per week to improve consistency",
      "impact": "medium"
    }
  ]
}
```

#### **Get Detailed Analytics**
```http
GET /api/v1/insights/analytics/{domain}?metric=adherence&period=90d&granularity=weekly
Authorization: Bearer {jwt_token}

// Supported domains: nutrition, fitness, budget, overall
// Supported metrics: adherence, progress, satisfaction, efficiency
// Supported periods: 7d, 30d, 90d, 1y
// Supported granularity: daily, weekly, monthly
```

---

## **DIRECT AGENT APIs**

### **Nutrition Planning Agent (NPA) API**

#### **Generate Meal Plan**
```http
POST /api/v1/agents/npa/meal-plans
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "parameters": {
    "duration": "7 days",
    "target_calories": 1800,
    "goal": "muscle_gain",
    "dietary_restrictions": ["dairy-free", "gluten-free"],
    "budget": 75,
    "meal_preferences": {
      "breakfast_prep_time": 10,
      "lunch_portability": true,
      "dinner_family_size": 4
    }
  },
  "options": {
    "alternative_count": 2,
    "include_recipes": true,
    "include_shopping_list": true,
    "nutrition_detail_level": "comprehensive"
  }
}
```

#### **Analyze Food Item**
```http
POST /api/v1/agents/npa/analyze
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "food_items": [
    {
      "name": "Grilled chicken breast",
      "quantity": 150,
      "unit": "grams"
    },
    {
      "name": "Brown rice",
      "quantity": 1,
      "unit": "cup"
    }
  ],
  "analysis_type": "comprehensive"
}

Response:
{
  "analysis": {
    "total_nutrition": {
      "calories": 420,
      "protein": 45.2,
      "carbs": 38.1,
      "fat": 8.5,
      "fiber": 3.2
    },
    "breakdown": [
      {
        "item": "Grilled chicken breast (150g)",
        "calories": 165,
        "protein": 31.0,
        "carbs": 0,
        "fat": 3.6
      }
    ],
    "health_score": 8.5,
    "recommendations": [
      "Add vegetables for better micronutrient balance",
      "Consider olive oil for healthy fats"
    ]
  }
}
```

### **Workout Planning Agent (WPA) API**

#### **Generate Workout Program**
```http
POST /api/v1/agents/wpa/workout-programs
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "parameters": {
    "duration": "8 weeks",
    "goal": "strength_building",
    "fitness_level": "intermediate",
    "available_time": 60,
    "frequency": 4,
    "equipment": ["barbell", "dumbbells", "bench"],
    "preferences": {
      "focus_areas": ["chest", "back", "legs"],
      "avoid_exercises": ["overhead_press"]
    }
  },
  "options": {
    "include_warm_up": true,
    "include_cool_down": true,
    "progression_tracking": true,
    "alternative_exercises": 2
  }
}
```

#### **Log Workout Session**
```http
POST /api/v1/agents/wpa/sessions
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "workout_id": "workout-uuid",
  "session_date": "2025-09-02",
  "exercises": [
    {
      "exercise_id": "bench-press",
      "sets": [
        {"reps": 8, "weight": 80, "rpe": 7},
        {"reps": 8, "weight": 80, "rpe": 8},
        {"reps": 6, "weight": 85, "rpe": 9}
      ]
    }
  ],
  "notes": "Felt strong today, increased weight on last set",
  "duration": 65,
  "perceived_effort": 7
}
```

### **Budget Management Agent (BMA) API**

#### **Create Budget**
```http
POST /api/v1/agents/bma/budgets
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "parameters": {
    "period": "monthly",
    "income": 5000,
    "fixed_expenses": {
      "rent": 1500,
      "utilities": 200,
      "insurance": 300
    },
    "categories": {
      "food": 600,
      "fitness": 150,
      "entertainment": 300,
      "savings": 1000
    },
    "goals": {
      "emergency_fund": 10000,
      "vacation": 3000
    }
  },
  "options": {
    "auto_categorization": true,
    "optimization_suggestions": true,
    "alerts_enabled": true
  }
}
```

#### **Analyze Expenses**
```http
POST /api/v1/agents/bma/analyze-expenses
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "period": {
    "start": "2025-08-01",
    "end": "2025-08-31"
  },
  "expenses": [
    {"date": "2025-08-01", "amount": 45.50, "category": "food", "description": "Grocery store"},
    {"date": "2025-08-02", "amount": 12.99, "category": "food", "description": "Coffee shop"}
  ],
  "analysis_type": "comprehensive"
}
```

---

## **REAL-TIME APIS**

### **WebSocket Connections**
*Real-time updates for plan progress, notifications, and system status*

#### **Connection Setup**
```javascript
// WebSocket connection
const ws = new WebSocket('wss://api.progressiveframework.com/ws/v1/user');

// Authentication
ws.send(JSON.stringify({
  type: 'auth',
  token: 'your-jwt-token'
}));

// Subscription management
ws.send(JSON.stringify({
  type: 'subscribe',
  channels: ['progress_updates', 'plan_notifications', 'agent_status']
}));
```

#### **Message Types**
```javascript
// Progress Update
{
  "type": "progress_update",
  "channel": "progress_updates",
  "data": {
    "domain": "fitness",
    "metric": "workout_completion",
    "current_value": 0.85,
    "target_value": 0.80,
    "trend": "improving"
  },
  "timestamp": "2025-09-02T10:30:00Z"
}

// Plan Notification
{
  "type": "notification",
  "channel": "plan_notifications",
  "data": {
    "title": "Meal Prep Reminder",
    "message": "Time to prepare tomorrow's meals based on your plan",
    "action": {
      "type": "view_plan",
      "url": "/api/v1/plans/meal-plans/plan-uuid"
    }
  },
  "priority": "medium",
  "timestamp": "2025-09-02T10:30:00Z"
}

// Agent Status Update
{
  "type": "agent_status",
  "channel": "agent_status", 
  "data": {
    "agent": "npa",
    "status": "processing",
    "request_id": "req-uuid",
    "estimated_completion": "2025-09-02T10:32:00Z"
  },
  "timestamp": "2025-09-02T10:30:00Z"
}
```

### **Server-Sent Events (SSE)**
*Alternative to WebSocket for one-way real-time updates*

```http
GET /api/v1/stream/progress?channels=all
Authorization: Bearer {jwt_token}
Accept: text/event-stream
Cache-Control: no-cache

Response:
data: {"type": "progress_update", "data": {...}}

data: {"type": "notification", "data": {...}}

data: {"type": "heartbeat", "timestamp": "2025-09-02T10:30:00Z"}
```

---

## **WEBHOOK APIS**

### **Webhook Configuration**
*Configure webhooks for external integrations and notifications*

#### **Create Webhook**
```http
POST /api/v1/webhooks
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "url": "https://your-app.com/webhooks/progressive-framework",
  "events": [
    "plan.created",
    "plan.completed",
    "progress.milestone_reached",
    "system.agent_status_changed"
  ],
  "secret": "your-webhook-secret",
  "active": true,
  "retry_policy": {
    "max_retries": 3,
    "retry_delay": 60
  }
}
```

#### **Webhook Payload Format**
```json
{
  "id": "webhook-event-uuid",
  "event": "plan.created",
  "data": {
    "plan": {
      "id": "plan-uuid",
      "type": "meal_plan",
      "user_id": "user-uuid",
      "created_at": "2025-09-02T10:30:00Z"
    }
  },
  "timestamp": "2025-09-02T10:30:00Z",
  "signature": "sha256=calculated-signature"
}
```

---

## **ADMIN & SYSTEM APIs**

### **System Health & Monitoring**

#### **System Status**
```http
GET /api/v1/admin/system/status
Authorization: Bearer {admin_token}

Response:
{
  "status": "healthy",
  "version": "5.0.0",
  "uptime": 172800, // seconds
  "agents": {
    "mca": {"status": "healthy", "instances": 3, "avg_response_time": 120},
    "npa": {"status": "healthy", "instances": 2, "avg_response_time": 450},
    "wpa": {"status": "healthy", "instances": 2, "avg_response_time": 380},
    "bma": {"status": "healthy", "instances": 1, "avg_response_time": 200},
    "rpa": {"status": "healthy", "instances": 1, "avg_response_time": 800}
  },
  "infrastructure": {
    "database": {"status": "healthy", "response_time": 15},
    "cache": {"status": "healthy", "hit_rate": 0.92},
    "queue": {"status": "healthy", "pending_jobs": 5}
  },
  "metrics": {
    "requests_per_minute": 1250,
    "error_rate": 0.002,
    "active_users": 8934
  }
}
```

#### **Agent Management**
```http
POST /api/v1/admin/agents/{agent_type}/scale
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "target_instances": 5,
  "reason": "High load anticipated"
}

# Restart agent
POST /api/v1/admin/agents/{agent_id}/restart

# Update agent configuration
PUT /api/v1/admin/agents/{agent_id}/config
{
  "config": {
    "max_concurrent_requests": 50,
    "timeout": 30000,
    "cache_ttl": 3600
  }
}
```

### **User Management**

#### **Get Users**
```http
GET /api/v1/admin/users?limit=50&offset=0&status=active&sort=created_at:desc
Authorization: Bearer {admin_token}

Response:
{
  "users": [
    {
      "id": "user-uuid",
      "email": "user@example.com",
      "status": "active",
      "plan_type": "premium",
      "created_at": "2025-08-01T10:00:00Z",
      "last_active": "2025-09-02T09:45:00Z",
      "stats": {
        "total_plans": 15,
        "active_plans": 3,
        "api_calls_30d": 450
      }
    }
  ],
  "pagination": {
    "total": 10000,
    "limit": 50,
    "offset": 0
  }
}
```

#### **User Actions**
```http
# Suspend user
POST /api/v1/admin/users/{user_id}/suspend
{
  "reason": "Policy violation",
  "duration": "7 days"
}

# Reset user data
POST /api/v1/admin/users/{user_id}/reset
{
  "scope": ["plans", "preferences"], // What to reset
  "backup": true // Create backup before reset
}

# Export user data (GDPR compliance)
GET /api/v1/admin/users/{user_id}/export
Authorization: Bearer {admin_token}
```

---

## **ERROR HANDLING & STATUS CODES**

### **HTTP Status Codes**
```
SUCCESS RESPONSES:
200 OK - Request successful
201 Created - Resource created successfully
202 Accepted - Request accepted (async processing)
204 No Content - Successful request with no response body

CLIENT ERROR RESPONSES:
400 Bad Request - Invalid request format or parameters
401 Unauthorized - Authentication required or invalid
403 Forbidden - Insufficient permissions
404 Not Found - Resource not found
409 Conflict - Resource conflict (e.g., duplicate plan)
422 Unprocessable Entity - Valid format but semantic errors
429 Too Many Requests - Rate limit exceeded

SERVER ERROR RESPONSES:
500 Internal Server Error - Unexpected server error
502 Bad Gateway - Agent communication error
503 Service Unavailable - System overload or maintenance
504 Gateway Timeout - Agent response timeout
```

### **Error Response Format**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid parameters",
    "details": [
      {
        "field": "target_calories",
        "message": "Must be between 1000 and 4000",
        "value": 500
      }
    ],
    "request_id": "req-uuid",
    "timestamp": "2025-09-02T10:30:00Z",
    "documentation": "https://docs.progressiveframework.com/errors/validation"
  },
  "meta": {
    "api_version": "1.0",
    "rate_limit": {
      "remaining": 95,
      "reset": 1693724400
    }
  }
}
```

### **Common Error Codes**
```yaml
Authentication Errors:
  INVALID_TOKEN: JWT token is invalid or expired
  MISSING_TOKEN: Authorization header missing
  INSUFFICIENT_SCOPE: Token lacks required permissions

Validation Errors:
  VALIDATION_ERROR: Request parameters are invalid
  MISSING_REQUIRED_FIELD: Required field not provided
  INVALID_FORMAT: Field format is incorrect
  OUT_OF_RANGE: Numeric value outside allowed range

Business Logic Errors:
  AGENT_UNAVAILABLE: Requested agent is not available
  PLAN_CONFLICT: Plan conflicts with existing plans
  QUOTA_EXCEEDED: User has reached plan limits
  PROCESSING_TIMEOUT: Request took too long to process

System Errors:
  AGENT_ERROR: Internal agent processing error
  DATABASE_ERROR: Database operation failed
  EXTERNAL_API_ERROR: External service unavailable
  RATE_LIMIT_EXCEEDED: Too many requests from client
```

---

## **RATE LIMITING & QUOTAS**

### **Rate Limits by Plan Type**
```yaml
Rate Limits (per minute):

Free Tier:
  api_calls: 60 # 1 per second
  plan_generations: 2
  agent_direct_access: 0
  
Basic Plan:
  api_calls: 300 # 5 per second
  plan_generations: 10
  agent_direct_access: 30
  
Premium Plan:
  api_calls: 1800 # 30 per second
  plan_generations: 50
  agent_direct_access: 300
  webhooks: 100
  
Enterprise:
  api_calls: 6000 # 100 per second
  plan_generations: 200
  agent_direct_access: 1200
  webhooks: 500
  admin_apis: 60

Rate Limit Headers:
  X-RateLimit-Limit: 300
  X-RateLimit-Remaining: 299
  X-RateLimit-Reset: 1693724460
  X-RateLimit-Retry-After: 60 # When rate limited
```

### **Usage Quotas**
```yaml
Monthly Quotas:

Free Tier:
  plans_created: 10
  storage: 100MB
  ai_requests: 1000
  
Basic Plan ($9.99/month):
  plans_created: 100
  storage: 1GB
  ai_requests: 10000
  
Premium Plan ($19.99/month):
  plans_created: 500
  storage: 5GB
  ai_requests: 50000
  advanced_analytics: true
  
Enterprise (Custom):
  plans_created: unlimited
  storage: unlimited
  ai_requests: unlimited
  dedicated_support: true
  sla_guarantee: 99.9%
```

---

## **SDK & CLIENT LIBRARIES**

### **Official SDKs**

#### **JavaScript/TypeScript SDK**
```bash
npm install progressive-framework-sdk
```

```javascript
import { ProgressiveFrameworkClient } from 'progressive-framework-sdk';

const client = new ProgressiveFrameworkClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.progressiveframework.com/v1',
  timeout: 30000
});

// Natural language interaction
const response = await client.chat.send({
  message: "Create a 7-day meal plan for weight loss",
  context: {
    preferences: {
      dietary_restrictions: ["vegetarian"],
      budget: 50
    }
  }
});

// Direct agent access
const mealPlan = await client.agents.npa.createMealPlan({
  duration: "7 days",
  target_calories: 1500,
  dietary_restrictions: ["vegetarian"]
});

// Real-time updates
client.websocket.subscribe(['progress_updates'], (message) => {
  console.log('Progress update:', message);
});
```

#### **Python SDK**
```bash
pip install progressive-framework-python
```

```python
from progressive_framework import ProgressiveFrameworkClient

client = ProgressiveFrameworkClient(
    api_key="your-api-key",
    base_url="https://api.progressiveframework.com/v1"
)

# Chat interaction
response = client.chat.send(
    message="I need a workout plan for muscle building",
    context={
        "fitness_level": "intermediate",
        "equipment": ["dumbbells", "bench"]
    }
)

# Direct agent calls
workout_plan = client.agents.wpa.create_workout_program({
    "goal": "muscle_building",
    "duration": "8 weeks",
    "fitness_level": "intermediate"
})

# Analytics
progress = client.insights.get_progress_dashboard(period="30d")
```

### **Community SDKs**
- **Go SDK**: `github.com/community/progressive-framework-go`
- **PHP SDK**: `composer require community/progressive-framework-php`
- **Ruby Gem**: `gem install progressive_framework`
- **Java SDK**: Available on Maven Central

---

## **TESTING & DEVELOPMENT**

### **API Testing Environment**
```
Sandbox Environment:
Base URL: https://api-sandbox.progressiveframework.com/v1/

Features:
- Free unlimited testing
- Reset data daily at 00:00 UTC
- All agents available with mock data
- Webhook testing with requestbin.com integration
- No rate limiting
- Detailed debug information in responses

Test Users:
- test@example.com / password: test123
- premium-test@example.com / password: test123 (premium features)

API Key: test-key-progressive-framework-sandbox
```

### **Postman Collection**
```
Download collection:
https://docs.progressiveframework.com/postman-collection.json

Includes:
- All API endpoints with examples
- Authentication setup
- Environment variables
- Automated tests
- Response validation
```

### **OpenAPI Specification**
```yaml
# Download OpenAPI 3.0 spec
GET https://api.progressiveframework.com/v1/openapi.yaml

# Interactive API explorer
https://docs.progressiveframework.com/api-explorer/

# Generate client code
https://docs.progressiveframework.com/codegen/
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Agent Architecture](../07-Architecture/Agent-Architecture.md)** - Multi-agent system design
- **[Security Overview](../04-Security/Security-Overview.md)** - Security requirements and policies

### **Related Documents**
- **[Integration Architecture](../07-Architecture/Integration-Architecture.md)** - Integration patterns and communication
- **[Authentication & Authorization](../04-Security/Authentication-Authorization.md)** - Security implementation details
- **[Monitoring & Observability](../07-Architecture/Monitoring-Observability.md)** - API monitoring and analytics

### **Development Resources**
- **[SDK Documentation](SDK-Documentation.md)** - Client library documentation
- **[Webhook Guide](Webhook-Guide.md)** - Webhook implementation guide
- **[API Testing Guide](API-Testing-Guide.md)** - Testing strategies and tools

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | API Team | Complete API documentation with all endpoints |
| 4.x | 2025-08-xx | Development Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: API Team  
**Last Validated**: 2025-09-02