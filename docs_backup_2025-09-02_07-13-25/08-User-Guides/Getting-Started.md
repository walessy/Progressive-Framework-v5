# docs/08-User-Guides/Getting-Started.md

# Getting Started with Progressive Framework V5

**Last Updated**: August 31, 2025
**Version**: 1.0
**Owner**: User Experience Team
**Review Cycle**: Monthly

## Quick Reference
- **Purpose**: New user onboarding and first steps with the Multi-Agent Intelligence System
- **Audience**: New users, API consumers, developers integrating with the system
- **Dependencies**: [System Overview](../01-Core-System/System-Overview.md)
- **Status**: Ready for Review

## Table of Contents
- [Welcome to Progressive Framework V5](#welcome-to-progressive-framework-v5)
- [System Overview](#system-overview)
- [Quick Start Guide](#quick-start-guide)
- [Your First Agent Interaction](#your-first-agent-interaction)
- [Understanding Agent Routing](#understanding-agent-routing)
- [Available Agents](#available-agents)
- [Common Use Cases](#common-use-cases)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

---

## Welcome to Progressive Framework V5

Progressive Framework V5 is an **intelligent Multi-Agent system** that understands your requests and automatically connects you with the most suitable specialized AI agent. Instead of figuring out which tool to use, simply describe what you need - our **Master Control Agent (MCA)** handles the intelligent routing for you.

### What Makes This Different
- **🧠 Intelligent Routing**: Advanced keyword analysis automatically selects the best agent
- **⚡ Lightning Fast**: Sub-10ms response times with 100% success rates
- **🤝 Agent Collaboration**: Agents work together when your request spans multiple domains
- **🔄 Graceful Fallback**: System never fails - always provides helpful responses
- **📊 Performance Monitoring**: Real-time system health and optimization

### Key Benefits
- **Single Interface**: One endpoint handles all your diverse needs
- **Domain Expertise**: Each agent specializes in specific areas for superior results
- **Automatic Optimization**: System learns and improves routing decisions over time
- **Production Reliability**: Enterprise-grade performance and error handling

---

## System Overview

### How It Works
```
Your Request → Master Control Agent → Intelligent Analysis → Optimal Agent → Response
     ↓              ↓                      ↓                    ↓           ↓
"meal plan"    Keyword        nutrition: 0.85           Nutrition      Personalized
"for muscle    Analysis +     fitness: 0.40     →      Planning   →   meal plan +
 building"     Domain         budget: 0.10             Agent (NPA)    collaboration
               Scoring                                                 suggestion
```

### The Agent Ecosystem
- **Master Control Agent (MCA)**: The orchestrator that analyzes your requests and routes them intelligently
- **Nutrition Planning Agent (NPA)**: Specialized in meal planning, nutrition analysis, and dietary recommendations
- **Workout Planning Agent (WPA)**: Expert in fitness routines, exercise programming, and training optimization
- **Budget Management Agent (BMA)**: *(Coming Soon)* Cost optimization and financial planning integration

---

## Quick Start Guide

### Method 1: Simple Chat Interface
**Endpoint**: `POST /chat`

```bash
# Basic request - let MCA route intelligently
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need a muscle building workout plan"
  }'
```

**What happens:**
1. MCA analyzes your message: "muscle building workout plan"
2. Keyword analysis scores domains: fitness (0.95), nutrition (0.20), budget (0.05)
3. Routes to **Workout Planning Agent (WPA)**
4. Returns specialized workout plan + collaboration suggestions

### Method 2: Direct Agent Communication
**Endpoint**: `POST /chat/:agentType`

```bash
# Direct communication with specific agent
curl -X POST http://localhost:3000/chat/npa \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create a high protein meal plan"
  }'
```

**When to use direct communication:**
- You know exactly which agent you need
- Building automated integrations
- Testing specific agent capabilities

---

## Your First Agent Interaction

### Example 1: Fitness Planning
```json
// Request
POST /chat
{
  "message": "I want to build muscle strength training",
  "context": {
    "fitness_level": "beginner",
    "available_time": "30 minutes",
    "equipment": "home gym"
  }
}

// Response  
{
  "success": true,
  "agent": "WPA",
  "routing_analysis": {
    "keywords": ["build", "muscle", "strength", "training"],
    "domain_scores": {
      "fitness": 0.95,
      "nutrition": 0.25,
      "budget": 0.05
    },
    "confidence": 0.95
  },
  "response": {
    "workout_plan": {
      "duration": "30 minutes",
      "focus": "Strength training for muscle building",
      "exercises": [
        {
          "name": "Push-ups",
          "sets": 3,
          "reps": "8-12",
          "rest": "60 seconds"
        },
        {
          "name": "Bodyweight Squats", 
          "sets": 3,
          "reps": "12-15",
          "rest": "60 seconds"
        }
      ]
    }
  },
  "collaboration": {
    "suggestion": "Would you like nutritional guidance to support muscle building?",
    "available_agents": ["NPA"]
  },
  "performance": {
    "response_time_ms": 4.2,
    "agent_load": "12%"
  }
}
```

### Example 2: Nutrition Planning
```json
// Request
POST /chat
{
  "message": "meal plan for muscle building",
  "context": {
    "dietary_restrictions": ["vegetarian"],
    "target_calories": 2500,
    "meals_per_day": 4
  }
}

// Response
{
  "success": true,
  "agent": "NPA", 
  "routing_analysis": {
    "keywords": ["meal", "plan", "muscle", "building"],
    "domain_scores": {
      "nutrition": 0.80,
      "fitness": 0.60,
      "budget": 0.15
    },
    "confidence": 0.87
  },
  "response": {
    "meal_plan": {
      "daily_calories": 2500,
      "protein_target": "150g",
      "meals": [
        {
          "meal": "Breakfast",
          "calories": 625,
          "protein": "35g",
          "foods": ["Greek yogurt", "berries", "protein powder"]
        }
      ]
    }
  },
  "collaboration": {
    "suggestion": "This meal plan supports your muscle building goals. Would you like a coordinated workout routine?",
    "available_agents": ["WPA"]
  }
}
```

---

## Understanding Agent Routing

### How MCA Selects Agents
```javascript
// Routing Intelligence Process
1. Message Analysis
   ↓
2. Keyword Extraction → ["meal", "plan", "workout", "routine"]
   ↓  
3. Domain Scoring → {nutrition: 0.70, fitness: 0.65, budget: 0.15}
   ↓
4. Agent Selection → Primary: NPA, Collaboration: WPA
   ↓
5. Confidence Check → 87% confidence (high)
   ↓
6. Route Request → Send to Nutrition Planning Agent
   ↓
7. Monitor Performance → Track response time and success
```

### Routing Examples
| Your Message | MCA Analysis | Selected Agent | Reasoning |
|--------------|--------------|----------------|-----------|
| "build muscle strength training" | fitness: 0.95 | **WPA** | Clear fitness domain |
| "proteins for muscle building" | fitness: 0.60, nutrition: 0.55 | **WPA** | Smart prioritization |
| "meal plan workout routine" | nutrition: 0.70, fitness: 0.65 | **NPA** + WPA collab | Multi-domain request |
| "nutrition tip" | nutrition: 0.90 | **NPA** | Clear nutrition domain |
| "cheap protein sources" | nutrition: 0.60, budget: 0.45 | **NPA** + BMA collab | Budget-aware nutrition |

### When Agents Collaborate
- **Cross-Domain Requests**: "meal plan and workout routine for weight loss"
- **Budget Considerations**: "affordable nutrition for muscle building"  
- **Comprehensive Planning**: "complete health and fitness transformation"
- **Follow-up Suggestions**: Agents suggest complementary services

---

## Available Agents

### 🧠 Master Control Agent (MCA)
- **Role**: Orchestrator and intelligent router
- **Capabilities**: 
  - Advanced request analysis and keyword extraction
  - Domain scoring and agent selection
  - Performance monitoring and system optimization
  - Load balancing and graceful fallback management
- **When MCA Responds Directly**: Complex multi-domain requests requiring orchestration
- **Performance**: 5.17ms average response time, 100% success rate

### 🥗 Nutrition Planning Agent (NPA)
- **Domain**: Nutrition, meal planning, dietary analysis
- **Specializations**:
  - Personalized meal planning and recipe recommendations
  - Nutritional analysis and macro/micronutrient optimization
  - Dietary restriction management (allergies, preferences, medical needs)
  - Supplement guidance and timing recommendations
- **Best For**: "meal plan", "nutrition advice", "healthy recipes", "protein intake"
- **Collaboration**: Works with WPA for fitness-nutrition coordination

### 💪 Workout Planning Agent (WPA)
- **Domain**: Fitness, exercise programming, training optimization
- **Specializations**:
  - Custom workout routine creation based on goals and constraints
  - Exercise form guidance and technique recommendations
  - Progressive training programs and periodization
  - Recovery and rest day planning
- **Best For**: "workout plan", "exercise routine", "strength training", "fitness goals"
- **Collaboration**: Works with NPA for nutrition-fitness integration

### 💰 Budget Management Agent (BMA) *(Coming Soon)*
- **Domain**: Cost optimization, financial planning, budget-conscious recommendations
- **Planned Specializations**:
  - Budget-aware meal planning and grocery optimization
  - Cost-effective fitness solutions and equipment recommendations
  - Financial goal integration with health and fitness planning
  - Expense tracking and cost-benefit analysis
- **Best For**: "affordable", "budget", "cheap", "cost-effective", "save money"
- **Collaboration**: Enhanced nutrition and fitness planning with cost considerations

---

## Common Use Cases

### 🎯 Single-Domain Requests
```bash
# Nutrition Focus
"Create a vegetarian meal plan for 2000 calories"
→ Routes to NPA, gets specialized nutrition expertise

# Fitness Focus  
"30-minute home workout for beginners"
→ Routes to WPA, gets customized exercise routine

# Budget Focus (when BMA is ready)
"Cheapest way to get 150g protein daily"
→ Routes to BMA + NPA collaboration
```

### 🤝 Multi-Domain Requests
```bash
# Nutrition + Fitness
"meal plan and workout routine for weight loss"
→ Primary: NPA, Collaboration: WPA
→ Gets coordinated nutrition and fitness plan

# Fitness + Budget  
"effective muscle building without expensive gym"
→ Primary: WPA, Collaboration: BMA
→ Gets home workout plan with cost considerations

# Complete Health Planning
"comprehensive health transformation plan"
→ MCA orchestrates all available agents
→ Gets integrated nutrition, fitness, and budget plan
```

### 📱 Follow-up and Refinement
```bash
# Initial Request
"I need to lose 20 pounds"
→ MCA routes to NPA for nutrition-focused weight loss

# Follow-up Request  
"Add workout routine to support my weight loss plan"
→ MCA remembers context, routes to WPA with nutrition coordination

# Refinement Request
"Make this more budget-friendly" 
→ MCA integrates BMA for cost optimization
```

---

## API Integration

### Authentication (Future)
```javascript
// When authentication is implemented
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer your-api-token',
  'X-Client-Version': '1.0.0'
};
```

### Basic Integration Pattern
```javascript
// JavaScript/Node.js Integration
async function askAgent(message, context = {}) {
  try {
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        context: context
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`Routed to: ${result.agent}`);
      console.log(`Response: ${JSON.stringify(result.response, null, 2)}`);
      
      // Handle collaboration suggestions
      if (result.collaboration) {
        console.log(`Suggestion: ${result.collaboration.suggestion}`);
      }
      
      return result;
    } else {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Agent request failed:', error);
    throw error;
  }
}

// Usage examples
await askAgent("I need a workout plan for muscle building");
await askAgent("Create a meal plan", { 
  dietary_restrictions: ["vegetarian"],
  target_calories: 2200 
});
```

### Python Integration
```python
import requests
import json

class AgentClient:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
    
    def chat(self, message, context=None):
        """Send message to agent system via MCA routing"""
        payload = {
            "message": message,
            "context": context or {}
        }
        
        response = requests.post(
            f"{self.base_url}/chat",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            
            if result["success"]:
                print(f"✅ Routed to: {result['agent']}")
                print(f"📊 Confidence: {result['routing_analysis']['confidence']:.1%}")
                
                if result.get("collaboration"):
                    print(f"💡 {result['collaboration']['suggestion']}")
                    
                return result["response"]
            else:
                raise Exception(f"Agent error: {result['error']['message']}")
        else:
            raise Exception(f"HTTP {response.status_code}: {response.text}")

# Usage
client = AgentClient()
workout_plan = client.chat("I need a 45-minute strength training workout")
meal_plan = client.chat("High protein meal plan", {"target_calories": 2500})
```

---

## Troubleshooting

### Common Issues & Solutions

#### ❌ **"Connection Refused" Error**
```bash
Error: connect ECONNREFUSED 127.0.0.1:3000
```
**Solution**: Ensure the agent system is running
```bash
cd C:\Projects\Progressive-Framework-v5
node src/main.js
# Or your specific startup command
```

#### ❌ **"Agent Not Available" Response**  
```json
{
  "success": false,
  "error": {
    "code": "AGENT_UNAVAILABLE",
    "message": "Selected agent is currently unavailable"
  }
}
```
**Solution**: Check agent status and try again
```bash
curl http://localhost:3000/agents
curl http://localhost:3000/system/status
```

#### ❌ **Poor Routing Decisions**
If MCA consistently routes to wrong agents:

1. **Check your message clarity**:
   ```bash
   ❌ "help me" (too vague)
   ✅ "create a workout plan" (clear domain)
   ```

2. **Add context for better routing**:
   ```json
   {
     "message": "I need help with planning",
     "context": {
       "domain_hint": "fitness",
       "user_goal": "muscle building"
     }
   }
   ```

3. **Use direct agent communication**:
   ```bash
   POST /chat/wpa  # Direct to Workout Planning Agent
   POST /chat/npa  # Direct to Nutrition Planning Agent
   ```

### Getting Help

#### System Status Check
```bash
# Check overall system health
curl http://localhost:3000/system/status

# Check MCA specific metrics
curl http://localhost:3000/mca/status

# List available agents
curl http://localhost:3000/agents
```

#### Manual System Optimization
```bash
# Trigger manual optimization (if system seems sluggish)
curl -X POST http://localhost:3000/mca/optimize
```

#### Common Request Patterns
```bash
# ✅ Good request patterns
"Create a vegetarian meal plan for 2000 calories"
"45-minute strength training workout for beginners"  
"Budget-friendly protein sources for muscle building"
"Weekly meal prep plan with high protein"

# ❌ Avoid vague requests
"help me"
"what should I do"
"give me advice"
"tell me something"
```

---

## Next Steps

### Immediate Next Actions
1. **📋 Try Your First Request**: Start with a simple, clear request to see MCA routing in action
2. **🧪 Experiment with Different Domains**: Try nutrition, fitness, and budget-related requests
3. **🤝 Test Agent Collaboration**: Ask for requests that span multiple domains
4. **📊 Monitor Performance**: Check the `/mca/metrics` endpoint to see system performance

### Learning Path
1. **Master Basic Usage**: Get comfortable with the `/chat` endpoint and MCA routing
2. **Explore Agent Specializations**: Understand what each agent excels at  
3. **Learn Collaboration Patterns**: See how agents work together for complex requests
4. **Advanced Integration**: Build applications that leverage the agent system
5. **Performance Optimization**: Learn to use context and hints for optimal routing

### Advanced Usage
- **📱 Build Mobile Apps**: Integrate agent system into mobile applications
- **🌐 Web Interfaces**: Create web dashboards using the agent APIs
- **🔗 Third-Party Integration**: Connect other systems to the agent ecosystem
- **📊 Analytics Integration**: Track and analyze agent usage patterns

### Development Resources
- 🔧 [Development Setup](../13-Development/Development-Setup.md) - Set up local development environment
- 🤖 [Agent Development Guide](../02-Agent-Management/Agent-Development-Guide.md) - Create new specialized agents
- 📡 [HTTP Communication](../03-Communication-Protocols/HTTP-Communication.md) - Deep dive into communication patterns
- 🛠️ [Agent Registry](../02-Agent-Management/Agent-Registry.md) - Agent management and lifecycle

### Community & Support
- **📚 Documentation**: Complete documentation available in this repository
- **🐛 Issues**: Report issues through the standard project issue tracker
- **💡 Feature Requests**: Suggest new agents or capabilities
- **🤝 Contributions**: Guidelines for contributing to agent development

---

## Related Documentation

### User Guides
- 📋 [Feature Documentation](./Feature-Documentation.md) - Detailed feature descriptions
- 📱 [Mobile App Guide](./Mobile-App-Guide.md) - Mobile-specific features  
- ❓ [FAQ](./FAQ.md) - Frequently asked questions
- 🎥 [Video Tutorials](./Video-Tutorials.md) - Training videos and demos

### Technical References
- 🧠 [System Overview](../01-Core-System/System-Overview.md) - Complete system architecture
- 🤖 [Agent Registry](../02-Agent-Management/Agent-Registry.md) - Agent management
- 📡 [HTTP Communication](../03-Communication-Protocols/HTTP-Communication.md) - API protocols
- 🔧 [Development Setup](../13-Development/Development-Setup.md) - Local development

### Administrative Guides  
- 🛠️ [Agent Management](../09-Admin-Guides/Agent-Management.md) - Admin procedures
- 📊 [System Administration](../09-Admin-Guides/System-Administration.md) - System management
- 🔍 [Performance Analytics](../09-Admin-Guides/Performance-Analytics.md) - Advanced monitoring

---

*Welcome to the future of intelligent agent interaction! The Progressive Framework V5 makes AI assistance as simple as describing what you need.*