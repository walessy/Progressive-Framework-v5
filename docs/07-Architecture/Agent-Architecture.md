---
file: docs/07-Architecture/Agent-Architecture.md
directory: docs/07-Architecture/
priority: CRITICAL
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# Agent Architecture - Progressive-Framework-v5

**File Path**: `docs/07-Architecture/Agent-Architecture.md`  
**Directory**: `docs/07-Architecture/`  
**Priority**: CRITICAL  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive architecture for the multi-agent intelligence system in Progressive-Framework-v5. This document defines the Master Control Agent (MCA), specialized context agents (NPA, WPA, BMA, RPA, EMA), agent communication protocols, coordination patterns, and the evolutionary intelligence framework that enables sophisticated AI-driven user interactions.

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🔗 **[Integration Architecture](Integration-Architecture.md)** - *Integration patterns and communication*
- 🛡️ **[Security Overview](../04-Security/Security-Overview.md)** - *Security requirements and policies*
- 📈 **[API Documentation](../03-Interfaces/API-Documentation.md)** - *API design and contracts*

---

## **MULTI-AGENT SYSTEM ARCHITECTURE**

### **Agent Ecosystem Overview**
```
Progressive-Framework-v5 Agent Ecosystem:

                           USER REQUEST
                               │
                               ▼
                    ┌─────────────────────┐
                    │  MASTER CONTROL     │
                    │    AGENT (MCA)      │
                    │                     │
                    │ • Request Analysis  │
                    │ • Agent Selection   │
                    │ • Load Balancing    │
                    │ • Response Synthesis│
                    │ • System Oversight  │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   INTELLIGENT       │
                    │   ROUTING ENGINE    │
                    │                     │
                    │ • Keyword Analysis  │
                    │ • Context Detection │
                    │ • Confidence Scoring│
                    │ • Multi-Agent Coord │
                    └─────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │ SPECIALIZED │    │ SPECIALIZED │    │ SPECIALIZED │
    │   AGENTS    │    │   AGENTS    │    │   AGENTS    │
    │             │    │             │    │             │
    │ NPA (Nutrition) │ │ WPA (Workout)  │ │ BMA (Budget)   │
    │ • Meal Planning │ │ • Exercise Design│ │ • Expense Track │
    │ • Nutrition Calc│ │ • Progress Track │ │ • Budget Optim │
    │ • Diet Analysis │ │ • Equipment Rec │ │ • Financial Plan│
    └─────────────┘    └─────────────┘    └─────────────┘
            │                  │                  │
            └──────────────────┼──────────────────┘
                               │
                               ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │ RPA (Report)│    │ EMA (Emergency)│ │ Future Agents│
    │ • Analytics │    │ • Error Handle │ │ • Extensible  │
    │ • Insights  │    │ • Recovery     │ │ • Modular     │
    │ • Reporting │    │ • Rollback     │ │ • Pluggable   │
    └─────────────┘    └─────────────┘    └─────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   AGENT REGISTRY    │
                    │                     │
                    │ • Agent Discovery   │
                    │ • Health Monitoring │
                    │ • Version Control   │
                    │ • Fingerprinting    │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ PERSISTENCE LAYER   │
                    │                     │
                    │ • Conversation Mem  │
                    │ • Agent State       │
                    │ • Learning Data     │
                    │ • Performance Metrics│
                    └─────────────────────┘
```

### **Agent Classification Matrix**
```
Agent Type Classification:

┌─────────────────┬──────────────┬─────────────────┬───────────────────┐
│    AGENT TYPE   │ COMPLEXITY   │   DOMAIN        │   COORDINATION    │
├─────────────────┼──────────────┼─────────────────┼───────────────────┤
│ MCA (Master)    │ High         │ System Control  │ Orchestrator      │
│ NPA (Nutrition) │ Medium       │ Health/Food     │ Specialist        │
│ WPA (Workout)   │ Medium       │ Fitness/Exercise│ Specialist        │
│ BMA (Budget)    │ Medium       │ Financial       │ Specialist        │
│ RPA (Reporting) │ Low-Medium   │ Analytics       │ Support           │
│ EMA (Emergency) │ High         │ Error/Recovery  │ System Support    │
└─────────────────┴──────────────┴─────────────────┴───────────────────┘

Agent Interaction Patterns:
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│    PATTERN      │   TRIGGER       │   PARTICIPANTS  │    OUTCOME      │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Direct Request  │ Single domain   │ User → MCA → X  │ Direct response │
│ Multi-Agent     │ Cross-domain    │ MCA + 2-3 agents│ Combined result │
│ Sequential      │ Complex workflow│ Chain of agents │ Step-by-step    │
│ Parallel        │ Independent tasks│ Multiple agents │ Concurrent proc │
│ Consensus       │ Decision needed │ Expert agents   │ Best decision   │
│ Emergency       │ System failure  │ EMA + affected  │ Recovery        │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

---

## **MASTER CONTROL AGENT (MCA)**

### **MCA Core Implementation**
```javascript
// src/agents/master-control-agent.js
const { BaseAgent } = require('./base-agent');
const { AgentRegistry } = require('../core/agent-registry');
const { CollaborationPatterns } = require('../patterns/collaboration-patterns');

class MasterControlAgent extends BaseAgent {
  constructor() {
    super('MCA', 'master-control', '1.0.0');
    this.agentRegistry = new AgentRegistry();
    this.collaborationPatterns = new CollaborationPatterns();
    this.requestAnalyzer = new RequestAnalyzer();
    this.responseOrchestrator = new ResponseOrchestrator();
    this.systemMonitor = new SystemMonitor();
    
    // MCA-specific capabilities
    this.capabilities = new Set([
      'request-analysis',
      'agent-selection',
      'load-balancing',
      'response-synthesis',
      'system-orchestration',
      'error-recovery',
      'performance-monitoring',
      'multi-agent-coordination'
    ]);

    // Request routing statistics
    this.routingStats = {
      totalRequests: 0,
      routingDecisions: new Map(),
      averageResponseTime: 0,
      multiAgentRequests: 0,
      directRoutes: 0,
      errorRate: 0
    };

    // Agent performance tracking
    this.agentPerformance = new Map();
    
    console.log('🧠 Master Control Agent (MCA) initialized');
  }

  /**
   * Initialize MCA with agent discovery and system setup
   */
  async initialize() {
    console.log('🚀 Initializing Master Control Agent...');
    
    try {
      // Discover and register all available agents
      await this.discoverAgents();
      
      // Initialize collaboration patterns
      await this.collaborationPatterns.initialize();
      
      // Setup system monitoring
      await this.setupSystemMonitoring();
      
      // Initialize request analyzer
      await this.requestAnalyzer.initialize();
      
      // Start health monitoring of agents
      this.startAgentHealthMonitoring();
      
      this.status = 'operational';
      console.log('✅ MCA initialization completed successfully');
      
      return {
        status: 'initialized',
        registeredAgents: this.agentRegistry.getAgentCount(),
        capabilities: Array.from(this.capabilities),
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ MCA initialization failed:', error);
      this.status = 'error';
      throw error;
    }
  }

  /**
   * Main request processing entry point
   */
  async processRequest(request) {
    const startTime = Date.now();
    const requestId = require('crypto').randomUUID();
    
    console.log(`🎯 MCA processing request: ${requestId}`);
    
    try {
      this.routingStats.totalRequests++;
      
      // Step 1: Analyze request complexity and requirements
      const analysis = await this.requestAnalyzer.analyzeRequest(request);
      
      // Step 2: Determine optimal routing strategy
      const strategy = await this.determineRoutingStrategy(analysis);
      
      // Step 3: Execute routing strategy
      const result = await this.executeRoutingStrategy(requestId, request, strategy, analysis);
      
      // Step 4: Synthesize and enhance response
      const enhancedResponse = await this.responseOrchestrator.enhanceResponse(
        result, 
        request, 
        analysis
      );
      
      // Step 5: Update performance metrics
      const processingTime = Date.now() - startTime;
      await this.updatePerformanceMetrics(strategy, processingTime, true);
      
      console.log(`✅ MCA request completed: ${requestId} (${processingTime}ms)`);
      
      return {
        requestId,
        response: enhancedResponse,
        strategy: strategy.name,
        processingTime,
        agentsUsed: strategy.agentsUsed || [],
        confidence: analysis.confidence || 0.85,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      await this.updatePerformanceMetrics(null, processingTime, false);
      
      console.error(`❌ MCA request failed: ${requestId}`, error);
      
      // Attempt error recovery
      const recovery = await this.attemptErrorRecovery(requestId, request, error);
      
      return {
        requestId,
        error: error.message,
        recovery,
        processingTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Analyze request to determine complexity and agent requirements
   */
  async analyzeRequest(request) {
    return await this.requestAnalyzer.analyzeRequest(request);
  }

  /**
   * Determine optimal routing strategy based on analysis
   */
  async determineRoutingStrategy(analysis) {
    const strategies = {
      direct: {
        name: 'direct',
        description: 'Direct routing to single specialist agent',
        complexity: 'simple',
        agentCount: 1,
        estimatedTime: 2000
      },
      collaborative: {
        name: 'collaborative',
        description: 'Multiple agents working together',
        complexity: 'moderate',
        agentCount: 2-3,
        estimatedTime: 5000
      },
      orchestrated: {
        name: 'orchestrated',
        description: 'Complex workflow with sequential steps',
        complexity: 'high',
        agentCount: 3-5,
        estimatedTime: 10000
      },
      parallel: {
        name: 'parallel',
        description: 'Parallel processing by multiple agents',
        complexity: 'high',
        agentCount: 2-4,
        estimatedTime: 6000
      }
    };

    // Strategy selection algorithm
    if (analysis.agentRequirements.length === 1 && analysis.complexity <= 3) {
      const targetAgent = analysis.agentRequirements[0];
      return {
        ...strategies.direct,
        targetAgent,
        agentsUsed: [targetAgent]
      };
    }
    
    if (analysis.agentRequirements.length === 2 && analysis.requiresCollaboration) {
      return {
        ...strategies.collaborative,
        agentsUsed: analysis.agentRequirements,
        collaborationType: analysis.collaborationType || 'sequential'
      };
    }
    
    if (analysis.complexity > 7 || analysis.multiStep) {
      return {
        ...strategies.orchestrated,
        agentsUsed: analysis.agentRequirements,
        workflow: analysis.workflowSteps || []
      };
    }
    
    if (analysis.agentRequirements.length > 2 && analysis.parallelizable) {
      return {
        ...strategies.parallel,
        agentsUsed: analysis.agentRequirements,
        parallelTasks: analysis.parallelTasks || []
      };
    }
    
    // Default to collaborative
    return {
      ...strategies.collaborative,
      agentsUsed: analysis.agentRequirements.slice(0, 3)
    };
  }

  /**
   * Execute the determined routing strategy
   */
  async executeRoutingStrategy(requestId, request, strategy, analysis) {
    console.log(`🎭 Executing strategy: ${strategy.name} with agents: ${strategy.agentsUsed.join(', ')}`);
    
    switch (strategy.name) {
      case 'direct':
        return await this.executeDirect(requestId, request, strategy);
        
      case 'collaborative':
        return await this.executeCollaborative(requestId, request, strategy);
        
      case 'orchestrated':
        return await this.executeOrchestrated(requestId, request, strategy);
        
      case 'parallel':
        return await this.executeParallel(requestId, request, strategy);
        
      default:
        throw new Error(`Unknown routing strategy: ${strategy.name}`);
    }
  }

  /**
   * Execute direct routing to single agent
   */
  async executeDirect(requestId, request, strategy) {
    const targetAgent = strategy.targetAgent;
    const agent = this.agentRegistry.getAgent(targetAgent);
    
    if (!agent) {
      throw new Error(`Target agent not available: ${targetAgent}`);
    }
    
    this.routingStats.directRoutes++;
    
    console.log(`➡️ Direct routing to ${targetAgent}`);
    
    const result = await agent.processRequest(request);
    
    return {
      type: 'direct',
      primaryAgent: targetAgent,
      result,
      processingPath: [targetAgent]
    };
  }

  /**
   * Execute collaborative routing with multiple agents
   */
  async executeCollaborative(requestId, request, strategy) {
    const agents = strategy.agentsUsed;
    const collaborationType = strategy.collaborationType || 'sequential';
    
    console.log(`🤝 Collaborative processing: ${collaborationType}`);
    
    let result;
    
    switch (collaborationType) {
      case 'sequential':
        result = await this.collaborationPatterns.sequentialProcessing(request, agents);
        break;
        
      case 'parallel':
        result = await this.collaborationPatterns.parallelProcessing(
          request, 
          agents, 
          this.createCombineFunction(request)
        );
        break;
        
      case 'consensus':
        result = await this.collaborationPatterns.consensusProcessing(
          request, 
          agents, 
          this.createConsensusFunction(request)
        );
        break;
        
      default:
        result = await this.collaborationPatterns.sequentialProcessing(request, agents);
    }
    
    return {
      type: 'collaborative',
      collaborationType,
      agentsUsed: agents,
      result,
      processingPath: result.processingChain || agents
    };
  }

  /**
   * Execute orchestrated routing with complex workflow
   */
  async executeOrchestrated(requestId, request, strategy) {
    console.log(`🎼 Orchestrated processing with ${strategy.agentsUsed.length} agents`);
    
    const workflow = this.buildWorkflow(request, strategy);
    const workflowEngine = global.workflowEngine; // Injected dependency
    
    if (!workflowEngine) {
      // Fallback to simple sequential processing
      return await this.executeCollaborative(requestId, request, {
        ...strategy,
        collaborationType: 'sequential'
      });
    }
    
    const result = await workflowEngine.executeWorkflow(
      `request-${requestId}`, 
      request, 
      { timeout: strategy.estimatedTime }
    );
    
    return {
      type: 'orchestrated',
      workflowId: result.executionId,
      agentsUsed: strategy.agentsUsed,
      result: result.result,
      processingPath: result.stepResults.map(step => step.stepName)
    };
  }

  /**
   * Execute parallel routing for independent tasks
   */
  async executeParallel(requestId, request, strategy) {
    console.log(`⚡ Parallel processing with ${strategy.agentsUsed.length} agents`);
    
    const result = await this.collaborationPatterns.parallelProcessing(
      request, 
      strategy.agentsUsed,
      this.createCombineFunction(request)
    );
    
    return {
      type: 'parallel',
      agentsUsed: strategy.agentsUsed,
      result,
      processingPath: result.successfulAgents,
      parallelEfficiency: result.parallelEfficiency
    };
  }

  /**
   * Discover and register all available agents
   */
  async discoverAgents() {
    const agentDefinitions = [
      {
        id: 'npa',
        type: 'nutrition-planning',
        name: 'Nutrition Planning Agent',
        capabilities: ['meal-planning', 'nutrition-analysis', 'dietary-recommendations'],
        priority: 'high',
        loadCapacity: 100
      },
      {
        id: 'wpa',
        type: 'workout-planning',
        name: 'Workout Planning Agent', 
        capabilities: ['workout-design', 'exercise-selection', 'progress-tracking'],
        priority: 'high',
        loadCapacity: 100
      },
      {
        id: 'bma',
        type: 'budget-management',
        name: 'Budget Management Agent',
        capabilities: ['expense-tracking', 'budget-optimization', 'financial-planning'],
        priority: 'medium',
        loadCapacity: 80
      },
      {
        id: 'rpa',
        type: 'reporting-planning',
        name: 'Report Planning Agent',
        capabilities: ['data-analysis', 'report-generation', 'insights'],
        priority: 'low',
        loadCapacity: 60
      },
      {
        id: 'ema',
        type: 'emergency-management',
        name: 'Emergency Management Agent',
        capabilities: ['error-handling', 'system-recovery', 'rollback'],
        priority: 'critical',
        loadCapacity: 50
      }
    ];

    for (const agentDef of agentDefinitions) {
      try {
        // Load agent implementation
        const AgentClass = require(`../${agentDef.type.replace('-', '_')}_agent`);
        const agentInstance = new AgentClass();
        
        // Initialize agent
        await agentInstance.initialize();
        
        // Register with registry
        await this.agentRegistry.registerAgent(agentInstance, agentDef);
        
        console.log(`✅ Discovered and registered agent: ${agentDef.name}`);
        
      } catch (error) {
        console.warn(`⚠️ Could not load agent ${agentDef.name}:`, error.message);
        
        // Register as unavailable but keep in registry for future discovery
        await this.agentRegistry.registerAgent(null, { 
          ...agentDef, 
          status: 'unavailable',
          error: error.message
        });
      }
    }
    
    console.log(`🔍 Agent discovery completed: ${this.agentRegistry.getAgentCount()} agents registered`);
  }

  /**
   * Create combine function for parallel processing
   */
  createCombineFunction(request) {
    // Analyze request to determine best combination strategy
    const requestType = this.requestAnalyzer.getRequestType(request);
    
    switch (requestType) {
      case 'comparison':
        return (results) => this.combineComparisonResults(results);
      case 'aggregation':
        return (results) => this.combineAggregationResults(results);
      case 'planning':
        return (results) => this.combinePlanningResults(results);
      default:
        return (results) => this.combineDefaultResults(results);
    }
  }

  /**
   * Create consensus function for decision making
   */
  createConsensusFunction(request) {
    return (opinions) => {
      // Weighted consensus based on agent expertise and confidence
      const weights = opinions.map(opinion => {
        const agent = this.agentRegistry.getAgent(opinion.agentId);
        const expertiseWeight = agent?.getExpertiseWeight(request) || 0.5;
        const confidenceWeight = opinion.confidence || 0.5;
        return expertiseWeight * confidenceWeight;
      });
      
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      
      // Find weighted consensus
      let bestOpinion = opinions[0];
      let bestScore = weights[0];
      
      for (let i = 1; i < opinions.length; i++) {
        if (weights[i] > bestScore) {
          bestOpinion = opinions[i];
          bestScore = weights[i];
        }
      }
      
      return {
        decision: bestOpinion.opinion,
        confidence: totalWeight / opinions.length,
        method: 'weighted-expertise',
        contributingAgents: opinions.map(o => o.agentId)
      };
    };
  }

  /**
   * Build workflow for orchestrated processing
   */
  buildWorkflow(request, strategy) {
    const workflow = {
      name: `orchestrated-request-${Date.now()}`,
      version: '1.0',
      description: 'Orchestrated multi-agent request processing',
      steps: []
    };

    // Build workflow steps based on agent requirements and strategy
    strategy.agentsUsed.forEach((agentId, index) => {
      workflow.steps.push({
        name: `agent-${agentId}-processing`,
        type: 'agent_call',
        config: {
          agentType: agentId,
          method: 'processRequest',
          parameters: {
            data: index === 0 ? '${inputData}' : '${previousResults}',
            context: '${context}'
          }
        },
        outputVariable: `agent_${agentId}_result`,
        errorHandling: {
          strategy: 'retry',
          maxRetries: 2,
          retryDelay: 1000
        }
      });
    });

    // Add final synthesis step
    workflow.steps.push({
      name: 'result-synthesis',
      type: 'transform',
      config: {
        function: 'synthesizeResults',
        parameters: strategy.agentsUsed.reduce((params, agentId) => {
          params[`${agentId}_result`] = `\${agent_${agentId}_result}`;
          return params;
        }, {})
      },
      outputVariable: 'finalResult'
    });

    return workflow;
  }

  /**
   * Get MCA system status and performance metrics
   */
  getSystemStatus() {
    const agentStatus = this.agentRegistry.getSystemStatus();
    
    return {
      status: this.status,
      mca: {
        version: this.version,
        uptime: Date.now() - this.startTime,
        capabilities: Array.from(this.capabilities),
        performance: {
          totalRequests: this.routingStats.totalRequests,
          averageResponseTime: this.routingStats.averageResponseTime,
          directRoutes: this.routingStats.directRoutes,
          multiAgentRequests: this.routingStats.multiAgentRequests,
          errorRate: this.routingStats.errorRate,
          successRate: ((this.routingStats.totalRequests - this.routingStats.errorRate) / 
                       this.routingStats.totalRequests * 100).toFixed(2) + '%'
        }
      },
      agents: agentStatus,
      routing: {
        strategies: Object.fromEntries(this.routingStats.routingDecisions),
        recentDecisions: Array.from(this.routingStats.routingDecisions.entries())
          .slice(-10)
          .map(([strategy, count]) => ({ strategy, count }))
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Update performance metrics
   */
  async updatePerformanceMetrics(strategy, processingTime, success) {
    // Update routing statistics
    this.routingStats.totalRequests = Math.max(1, this.routingStats.totalRequests);
    
    const currentAvg = this.routingStats.averageResponseTime;
    const totalRequests = this.routingStats.totalRequests;
    
    this.routingStats.averageResponseTime = 
      ((currentAvg * (totalRequests - 1)) + processingTime) / totalRequests;
    
    if (strategy) {
      const current = this.routingStats.routingDecisions.get(strategy.name) || 0;
      this.routingStats.routingDecisions.set(strategy.name, current + 1);
      
      if (strategy.agentsUsed && strategy.agentsUsed.length > 1) {
        this.routingStats.multiAgentRequests++;
      }
    }
    
    if (!success) {
      this.routingStats.errorRate++;
    }
  }

  /**
   * Start agent health monitoring
   */
  startAgentHealthMonitoring() {
    setInterval(async () => {
      try {
        const agents = this.agentRegistry.getAllAgents();
        
        for (const [agentId, agent] of agents) {
          if (agent && agent.getHealth) {
            const health = await agent.getHealth();
            this.agentPerformance.set(agentId, {
              ...health,
              lastCheck: new Date().toISOString()
            });
          }
        }
        
      } catch (error) {
        console.error('❌ Agent health monitoring failed:', error);
      }
    }, 30000); // Check every 30 seconds
    
    console.log('🏥 Agent health monitoring started');
  }
}

// Request Analysis Engine
class RequestAnalyzer {
  constructor() {
    this.keywords = {
      nutrition: ['meal', 'food', 'diet', 'nutrition', 'calories', 'eat', 'recipe', 'ingredient'],
      workout: ['workout', 'exercise', 'fitness', 'training', 'gym', 'muscle', 'cardio', 'strength'],
      budget: ['budget', 'money', 'cost', 'expense', 'financial', 'price', 'afford', 'savings'],
      reporting: ['report', 'analysis', 'data', 'statistics', 'trend', 'summary', 'insights'],
      emergency: ['error', 'problem', 'issue', 'broken', 'failed', 'help', 'urgent', 'fix']
    };
    
    this.complexityFactors = {
      multiDomain: 3,
      timeConstraints: 2,
      dataProcessing: 2,
      userPersonalization: 1,
      externalAPIs: 2,
      calculations: 1
    };
  }

  async initialize() {
    console.log('🧮 Request Analyzer initialized');
  }

  async analyzeRequest(request) {
    const text = this.extractText(request);
    const analysis = {
      originalRequest: request,
      extractedText: text,
      detectedDomains: [],
      agentRequirements: [],
      complexity: 0,
      confidence: 0,
      requiresCollaboration: false,
      parallelizable: false,
      multiStep: false,
      estimatedTime: 2000
    };

    // Domain detection
    for (const [domain, keywords] of Object.entries(this.keywords)) {
      const matches = keywords.filter(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (matches.length > 0) {
        const confidence = matches.length / keywords.length;
        analysis.detectedDomains.push({
          domain,
          confidence: confidence,
          matchedKeywords: matches
        });
      }
    }

    // Sort domains by confidence
    analysis.detectedDomains.sort((a, b) => b.confidence - a.confidence);

    // Determine agent requirements
    analysis.agentRequirements = analysis.detectedDomains
      .filter(domain => domain.confidence > 0.1)
      .map(domain => this.domainToAgentMapping(domain.domain))
      .filter(Boolean);

    // Calculate complexity
    analysis.complexity = this.calculateComplexity(text, analysis);

    // Determine collaboration requirements
    if (analysis.agentRequirements.length > 1) {
      analysis.requiresCollaboration = true;
      
      // Check if tasks can be parallelized
      analysis.parallelizable = this.checkParallelizability(analysis.detectedDomains);
    }

    // Check for multi-step requirements
    analysis.multiStep = this.checkMultiStep(text);

    // Calculate overall confidence
    analysis.confidence = this.calculateConfidence(analysis);

    // Estimate processing time
    analysis.estimatedTime = this.estimateProcessingTime(analysis);

    return analysis;
  }

  extractText(request) {
    if (typeof request === 'string') return request;
    if (request.message) return request.message;
    if (request.query) return request.query;
    if (request.text) return request.text;
    return JSON.stringify(request);
  }

  domainToAgentMapping(domain) {
    const mapping = {
      nutrition: 'npa',
      workout: 'wpa', 
      budget: 'bma',
      reporting: 'rpa',
      emergency: 'ema'
    };
    return mapping[domain];
  }

  calculateComplexity(text, analysis) {
    let complexity = 0;
    
    // Multi-domain complexity
    if (analysis.detectedDomains.length > 1) {
      complexity += this.complexityFactors.multiDomain;
    }
    
    // Time constraint indicators
    if (text.toLowerCase().includes('urgent') || 
        text.toLowerCase().includes('quickly') ||
        text.toLowerCase().includes('asap')) {
      complexity += this.complexityFactors.timeConstraints;
    }
    
    // Data processing indicators
    if (text.toLowerCase().includes('analyze') ||
        text.toLowerCase().includes('calculate') ||
        text.toLowerCase().includes('compare')) {
      complexity += this.complexityFactors.dataProcessing;
    }
    
    // Personalization requirements
    if (text.toLowerCase().includes('my') ||
        text.toLowerCase().includes('personalized') ||
        text.toLowerCase().includes('custom')) {
      complexity += this.complexityFactors.userPersonalization;
    }
    
    return complexity;
  }

  checkParallelizability(domains) {
    // Domains that can work independently
    const independentDomains = ['nutrition', 'workout', 'budget', 'reporting'];
    return domains.every(domain => independentDomains.includes(domain.domain));
  }

  checkMultiStep(text) {
    const multiStepIndicators = [
      'first', 'then', 'next', 'after', 'finally',
      'step', 'phase', 'stage', 'followed by'
    ];
    
    return multiStepIndicators.some(indicator => 
      text.toLowerCase().includes(indicator)
    );
  }

  calculateConfidence(analysis) {
    if (analysis.detectedDomains.length === 0) return 0.3;
    
    const avgDomainConfidence = analysis.detectedDomains
      .reduce((sum, domain) => sum + domain.confidence, 0) / analysis.detectedDomains.length;
    
    // Boost confidence if we have clear single domain
    if (analysis.detectedDomains.length === 1 && avgDomainConfidence > 0.5) {
      return Math.min(0.95, avgDomainConfidence + 0.2);
    }
    
    return Math.min(0.9, avgDomainConfidence);
  }

  estimateProcessingTime(analysis) {
    let baseTime = 2000; // 2 seconds baseline
    
    baseTime += analysis.complexity * 1000; // 1 second per complexity point
    baseTime += (analysis.agentRequirements.length - 1) * 1500; // Additional time per extra agent
    
    if (analysis.multiStep) baseTime += 3000;
    if (analysis.requiresCollaboration) baseTime += 2000;
    
    return Math.min(30000, baseTime); // Cap at 30 seconds
  }

  getRequestType(request) {
    const text = this.extractText(request).toLowerCase();
    
    if (text.includes('compare') || text.includes('versus') || text.includes('vs')) {
      return 'comparison';
    }
    
    if (text.includes('total') || text.includes('sum') || text.includes('aggregate')) {
      return 'aggregation';
    }
    
    if (text.includes('plan') || text.includes('schedule') || text.includes('design')) {
      return 'planning';
    }
    
    return 'general';
  }
}

// Response Orchestration Engine  
class ResponseOrchestrator {
  constructor() {
    this.enhancementStrategies = new Map();
  }

  async enhanceResponse(result, request, analysis) {
    // Apply response enhancement based on request type and complexity
    const enhancement = {
      originalResult: result,
      enhancedResponse: null,
      metadata: {
        processingStrategy: result.type,
        agentsInvolved: result.agentsUsed || [],
        confidenceScore: analysis.confidence,
        processingTime: result.processingTime || 0
      }
    };

    // Strategy-specific enhancement
    switch (result.type) {
      case 'direct':
        enhancement.enhancedResponse = await this.enhanceDirectResponse(result, request);
        break;
      case 'collaborative':
        enhancement.enhancedResponse = await this.enhanceCollaborativeResponse(result, request);
        break;
      case 'orchestrated':
        enhancement.enhancedResponse = await this.enhanceOrchestratedResponse(result, request);
        break;
      case 'parallel':
        enhancement.enhancedResponse = await this.enhanceParallelResponse(result, request);
        break;
      default:
        enhancement.enhancedResponse = result.result;
    }

    // Add system context
    enhancement.enhancedResponse = {
      ...enhancement.enhancedResponse,
      systemContext: {
        requestProcessedBy: 'Progressive Framework V5 - MCA',
        agentsInvolved: enhancement.metadata.agentsInvolved,
        processingStrategy: enhancement.metadata.processingStrategy,
        confidence: enhancement.metadata.confidenceScore,
        timestamp: new Date().toISOString()
      }
    };

    return enhancement.enhancedResponse;
  }

  async enhanceDirectResponse(result, request) {
    return {
      answer: result.result,
      source: `Specialized ${result.primaryAgent.toUpperCase()} Agent`,
      reliability: 'high',
      processingPath: result.processingPath
    };
  }

  async enhanceCollaborativeResponse(result, request) {
    return {
      answer: result.result.finalResult || result.result.combinedResult || result.result,
      collaborationType: result.collaborationType,
      agentContributions: result.result.history || result.result.parallelResults || [],
      reliability: 'very-high',
      processingPath: result.processingPath
    };
  }

  async enhanceOrchestratedResponse(result, request) {
    return {
      answer: result.result.result || result.result,
      workflowExecuted: result.workflowId,
      processingSteps: result.result.stepResults || [],
      reliability: 'enterprise-grade',
      processingPath: result.processingPath
    };
  }

  async enhanceParallelResponse(result, request) {
    return {
      answer: result.result.combinedResult,
      parallelProcessing: {
        efficiency: result.parallelEfficiency,
        successfulAgents: result.result.successfulAgents,
        failedAgents: result.result.failedAgents
      },
      reliability: 'high-performance',
      processingPath: result.processingPath
    };
  }
}

module.exports = { MasterControlAgent, RequestAnalyzer, ResponseOrchestrator };
```

---

## **SPECIALIZED CONTEXT AGENTS**

### **Base Agent Implementation**
```javascript
// src/agents/base-agent.js
const { EventEmitter } = require('events');
const crypto = require('crypto');

class BaseAgent extends EventEmitter {
  constructor(agentId, agentType, version) {
    super();
    this.agentId = agentId;
    this.agentType = agentType;
    this.version = version;
    this.status = 'initializing';
    this.capabilities = new Set();
    this.fingerprint = this.generateFingerprint();
    this.startTime = Date.now();
    this.requestCount = 0;
    this.errorCount = 0;
    this.averageResponseTime = 0;
    this.lastActivity = Date.now();
    
    // Agent-specific configuration
    this.config = {
      maxConcurrentRequests: 10,
      timeout: 30000,
      retryAttempts: 3,
      healthCheckInterval: 30000
    };
    
    // Performance metrics
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      totalResponseTime: 0,
      lastRequestTime: null,
      uptime: 0
    };
  }

  /**
   * Generate unique fingerprint for agent version control
   */
  generateFingerprint() {
    const content = `${this.agentId}-${this.agentType}-${this.version}-${Date.now()}`;
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
  }

  /**
   * Initialize agent - to be overridden by specialized agents
   */
  async initialize() {
    console.log(`🤖 Initializing ${this.agentType} agent (${this.agentId})`);
    this.status = 'operational';
    this.startHealthMonitoring();
    return { status: 'initialized', fingerprint: this.fingerprint };
  }

  /**
   * Process request - main entry point for all agents
   */
  async processRequest(request) {
    const startTime = Date.now();
    this.requestCount++;
    this.metrics.totalRequests++;
    this.lastActivity = Date.now();

    try {
      console.log(`📥 ${this.agentType} processing request: ${request.id || 'unknown'}`);
      
      // Validate request
      const validationResult = await this.validateRequest(request);
      if (!validationResult.valid) {
        throw new Error(`Invalid request: ${validationResult.error}`);
      }

      // Process request using specialized logic
      const result = await this.processSpecializedRequest(request);
      
      // Update metrics
      const processingTime = Date.now() - startTime;
      this.updateMetrics(processingTime, true);
      
      console.log(`✅ ${this.agentType} completed request in ${processingTime}ms`);
      
      return {
        agentId: this.agentId,
        agentType: this.agentType,
        result,
        processingTime,
        confidence: this.calculateConfidence(request, result),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.errorCount++;
      this.metrics.failedRequests++;
      const processingTime = Date.now() - startTime;
      this.updateMetrics(processingTime, false);
      
      console.error(`❌ ${this.agentType} request failed:`, error);
      
      throw {
        agentId: this.agentId,
        agentType: this.agentType,
        error: error.message,
        processingTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Process specialized request - to be implemented by each agent
   */
  async processSpecializedRequest(request) {
    throw new Error('processSpecializedRequest must be implemented by specialized agent');
  }

  /**
   * Validate request format and content
   */
  async validateRequest(request) {
    if (!request) {
      return { valid: false, error: 'Request is null or undefined' };
    }

    // Basic validation - can be extended by specialized agents
    return { valid: true };
  }

  /**
   * Calculate confidence score for response
   */
  calculateConfidence(request, result) {
    // Base confidence calculation - can be overridden
    let confidence = 0.7; // Base confidence
    
    // Boost confidence based on agent expertise match
    if (this.isExpertiseMatch(request)) {
      confidence += 0.2;
    }
    
    // Reduce confidence if request is complex for this agent
    if (this.isComplexRequest(request)) {
      confidence -= 0.1;
    }
    
    return Math.max(0.1, Math.min(0.99, confidence));
  }

  /**
   * Check if request matches agent expertise
   */
  isExpertiseMatch(request) {
    // To be implemented by specialized agents
    return true;
  }

  /**
   * Check if request is complex for this agent
   */
  isComplexRequest(request) {
    // To be implemented by specialized agents
    return false;
  }

  /**
   * Update agent performance metrics
   */
  updateMetrics(processingTime, success) {
    this.metrics.totalResponseTime += processingTime;
    this.metrics.averageResponseTime = this.metrics.totalResponseTime / this.metrics.totalRequests;
    this.metrics.lastRequestTime = new Date().toISOString();
    
    if (success) {
      this.metrics.successfulRequests++;
    }
    
    // Update instance-level average
    this.averageResponseTime = this.metrics.averageResponseTime;
  }

  /**
   * Get agent health status
   */
  async getHealth() {
    const uptime = Date.now() - this.startTime;
    const timeSinceLastActivity = Date.now() - this.lastActivity;
    
    return {
      agentId: this.agentId,
      agentType: this.agentType,
      status: this.status,
      uptime,
      timeSinceLastActivity,
      metrics: { ...this.metrics, uptime },
      isHealthy: this.status === 'operational' && timeSinceLastActivity < 300000, // 5 minutes
      fingerprint: this.fingerprint,
      version: this.version,
      capabilities: Array.from(this.capabilities)
    };
  }

  /**
   * Get agent expertise weight for specific request
   */
  getExpertiseWeight(request) {
    // Default implementation - should be overridden by specialized agents
    return 0.5;
  }

  /**
   * Start health monitoring
   */
  startHealthMonitoring() {
    setInterval(async () => {
      try {
        const health = await this.getHealth();
        this.emit('healthCheck', health);
        
        // Auto-recovery if unhealthy
        if (!health.isHealthy && this.status !== 'recovering') {
          await this.attemptRecovery();
        }
        
      } catch (error) {
        console.error(`❌ Health monitoring failed for ${this.agentType}:`, error);
      }
    }, this.config.healthCheckInterval);
  }

  /**
   * Attempt agent recovery
   */
  async attemptRecovery() {
    console.log(`🔄 Attempting recovery for ${this.agentType} agent`);
    this.status = 'recovering';
    
    try {
      // Basic recovery steps
      await this.clearCache();
      await this.resetConnections();
      
      this.status = 'operational';
      this.lastActivity = Date.now();
      
      console.log(`✅ Recovery successful for ${this.agentType} agent`);
      this.emit('recoveryComplete', { agentId: this.agentId, timestamp: new Date().toISOString() });
      
    } catch (error) {
      this.status = 'failed';
      console.error(`❌ Recovery failed for ${this.agentType} agent:`, error);
      this.emit('recoveryFailed', { agentId: this.agentId, error: error.message });
    }
  }

  /**
   * Clear agent cache - can be overridden
   */
  async clearCache() {
    // Default implementation
    console.log(`🧹 Clearing cache for ${this.agentType} agent`);
  }

  /**
   * Reset connections - can be overridden
   */
  async resetConnections() {
    // Default implementation
    console.log(`🔌 Resetting connections for ${this.agentType} agent`);
  }

  /**
   * Shutdown agent gracefully
   */
  async shutdown() {
    console.log(`🛑 Shutting down ${this.agentType} agent`);
    this.status = 'shutting-down';
    
    // Wait for ongoing requests to complete (with timeout)
    const shutdownTimeout = 10000; // 10 seconds
    const startShutdown = Date.now();
    
    while (this.requestCount > 0 && (Date.now() - startShutdown) < shutdownTimeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.status = 'shutdown';
    this.emit('shutdown', { agentId: this.agentId, timestamp: new Date().toISOString() });
  }
}

module.exports = { BaseAgent };
```

### **Nutrition Planning Agent (NPA)**
```javascript
// src/agents/nutrition-planning-agent.js
const { BaseAgent } = require('./base-agent');

class NutritionPlanningAgent extends BaseAgent {
  constructor() {
    super('npa', 'nutrition-planning', '1.0.0');
    
    // NPA-specific capabilities
    this.capabilities = new Set([
      'meal-planning',
      'nutrition-analysis', 
      'calorie-calculation',
      'dietary-recommendations',
      'recipe-suggestions',
      'macro-tracking',
      'allergy-management',
      'dietary-restrictions'
    ]);
    
    // Nutrition knowledge base
    this.nutritionDB = new Map();
    this.mealTemplates = new Map();
    this.dietaryProfiles = new Map();
    
    // NPA configuration
    this.config = {
      ...this.config,
      maxMealsPerPlan: 21, // 3 meals * 7 days
      nutritionAPIs: ['usda-food-data', 'nutritionix'],
      defaultCalorieTarget: 2000
    };
  }

  async initialize() {
    await super.initialize();
    
    console.log('🥗 Initializing Nutrition Planning Agent...');
    
    // Load nutrition database
    await this.loadNutritionDatabase();
    
    // Load meal templates
    await this.loadMealTemplates();
    
    // Initialize external API connections
    await this.initializeNutritionAPIs();
    
    console.log('✅ NPA initialization completed');
    return { status: 'initialized', capabilities: Array.from(this.capabilities) };
  }

  async processSpecializedRequest(request) {
    const requestType = this.determineRequestType(request);
    
    switch (requestType) {
      case 'meal-plan':
        return await this.createMealPlan(request);
      case 'nutrition-analysis':
        return await this.analyzeNutrition(request);
      case 'calorie-calculation':
        return await this.calculateCalories(request);
      case 'recipe-suggestion':
        return await this.suggestRecipes(request);
      case 'dietary-assessment':
        return await this.assessDiet(request);
      default:
        return await this.handleGeneralNutritionQuery(request);
    }
  }

  determineRequestType(request) {
    const text = this.extractText(request).toLowerCase();
    
    if (text.includes('meal plan') || text.includes('weekly plan')) return 'meal-plan';
    if (text.includes('analyze') || text.includes('nutrition facts')) return 'nutrition-analysis';
    if (text.includes('calories') || text.includes('calorie')) return 'calorie-calculation';
    if (text.includes('recipe') || text.includes('cooking')) return 'recipe-suggestion';
    if (text.includes('assess') || text.includes('evaluate')) return 'dietary-assessment';
    
    return 'general';
  }

  async createMealPlan(request) {
    console.log('🍽️ Creating personalized meal plan...');
    
    const parameters = this.extractMealPlanParameters(request);
    
    // Generate meal plan based on parameters
    const mealPlan = {
      duration: parameters.days || 7,
      targetCalories: parameters.calories || this.config.defaultCalorieTarget,
      dietaryRestrictions: parameters.restrictions || [],
      preferences: parameters.preferences || [],
      meals: []
    };

    // Generate meals for each day
    for (let day = 1; day <= mealPlan.duration; day++) {
      const dailyMeals = await this.generateDailyMeals(parameters, day);
      mealPlan.meals.push({
        day,
        breakfast: dailyMeals.breakfast,
        lunch: dailyMeals.lunch,
        dinner: dailyMeals.dinner,
        snacks: dailyMeals.snacks || [],
        totalCalories: dailyMeals.totalCalories,
        macros: dailyMeals.macros
      });
    }

    // Add nutritional summary
    mealPlan.nutritionalSummary = this.calculatePlanNutrition(mealPlan);

    return {
      type: 'meal-plan',
      plan: mealPlan,
      recommendations: await this.generateNutritionRecommendations(mealPlan),
      shoppingList: await this.generateShoppingList(mealPlan)
    };
  }

  async analyzeNutrition(request) {
    console.log('🔬 Analyzing nutritional content...');
    
    const food = this.extractFoodInfo(request);
    
    // Get nutrition data from APIs or database
    const nutritionData = await this.getNutritionData(food);
    
    const analysis = {
      food: food.name,
      quantity: food.quantity,
      unit: food.unit,
      nutrition: {
        calories: nutritionData.calories,
        macros: {
          protein: nutritionData.protein,
          carbs: nutritionData.carbohydrates,
          fat: nutritionData.fat,
          fiber: nutritionData.fiber
        },
        micros: {
          vitamins: nutritionData.vitamins || {},
          minerals: nutritionData.minerals || {}
        }
      },
      healthScore: this.calculateHealthScore(nutritionData),
      recommendations: this.generateHealthRecommendations(nutritionData)
    };

    return {
      type: 'nutrition-analysis',
      analysis
    };
  }

  async calculateCalories(request) {
    console.log('🧮 Calculating calories...');
    
    const foods = this.extractFoodList(request);
    let totalCalories = 0;
    const breakdown = [];

    for (const food of foods) {
      const nutrition = await this.getNutritionData(food);
      const calories = nutrition.calories * (food.quantity || 1);
      
      totalCalories += calories;
      breakdown.push({
        food: food.name,
        quantity: food.quantity,
        unit: food.unit,
        calories: calories
      });
    }

    return {
      type: 'calorie-calculation',
      totalCalories: Math.round(totalCalories),
      breakdown,
      dailyPercentage: ((totalCalories / this.config.defaultCalorieTarget) * 100).toFixed(1)
    };
  }

  async suggestRecipes(request) {
    console.log('👨‍🍳 Suggesting recipes...');
    
    const criteria = this.extractRecipeCriteria(request);
    
    // Find matching recipes
    const recipes = await this.findRecipes(criteria);
    
    return {
      type: 'recipe-suggestions',
      criteria,
      recipes: recipes.map(recipe => ({
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        nutrition: recipe.nutrition,
        prepTime: recipe.prepTime,
        difficulty: recipe.difficulty,
        rating: recipe.rating
      }))
    };
  }

  // Utility methods
  extractText(request) {
    if (typeof request === 'string') return request;
    return request.message || request.query || request.text || '';
  }

  extractMealPlanParameters(request) {
    const text = this.extractText(request);
    
    return {
      days: this.extractDays(text),
      calories: this.extractCalories(text),
      restrictions: this.extractDietaryRestrictions(text),
      preferences: this.extractPreferences(text),
      goals: this.extractGoals(text)
    };
  }

  extractDays(text) {
    const dayMatches = text.match(/(\d+)\s*days?/i);
    if (dayMatches) return parseInt(dayMatches[1]);
    
    if (text.includes('week')) return 7;
    if (text.includes('month')) return 30;
    
    return 7; // Default to 1 week
  }

  extractCalories(text) {
    const calorieMatches = text.match(/(\d+)\s*calories?/i);
    return calorieMatches ? parseInt(calorieMatches[1]) : null;
  }

  extractDietaryRestrictions(text) {
    const restrictions = [];
    const restrictionKeywords = {
      'vegetarian': ['vegetarian', 'veggie'],
      'vegan': ['vegan'],
      'gluten-free': ['gluten-free', 'gluten free', 'celiac'],
      'dairy-free': ['dairy-free', 'dairy free', 'lactose'],
      'keto': ['keto', 'ketogenic'],
      'paleo': ['paleo'],
      'low-carb': ['low-carb', 'low carb'],
      'low-fat': ['low-fat', 'low fat']
    };

    for (const [restriction, keywords] of Object.entries(restrictionKeywords)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        restrictions.push(restriction);
      }
    }

    return restrictions;
  }

  async generateDailyMeals(parameters, day) {
    const calorieDistribution = {
      breakfast: 0.25,
      lunch: 0.35,
      dinner: 0.35,
      snacks: 0.05
    };

    const targetCalories = parameters.calories || this.config.defaultCalorieTarget;
    
    return {
      breakfast: await this.generateMeal('breakfast', targetCalories * calorieDistribution.breakfast, parameters),
      lunch: await this.generateMeal('lunch', targetCalories * calorieDistribution.lunch, parameters),
      dinner: await this.generateMeal('dinner', targetCalories * calorieDistribution.dinner, parameters),
      snacks: await this.generateMeal('snacks', targetCalories * calorieDistribution.snacks, parameters),
      totalCalories: targetCalories,
      macros: this.calculateTargetMacros(targetCalories)
    };
  }

  async generateMeal(mealType, targetCalories, parameters) {
    // This would integrate with meal template database
    const mealOptions = this.mealTemplates.get(mealType) || [];
    
    // Filter by dietary restrictions
    const filteredOptions = mealOptions.filter(meal => 
      this.meetsDietaryRestrictions(meal, parameters.restrictions)
    );

    // Select meal closest to target calories
    const selectedMeal = filteredOptions.reduce((best, current) => {
      const bestDiff = Math.abs(best.calories - targetCalories);
      const currentDiff = Math.abs(current.calories - targetCalories);
      return currentDiff < bestDiff ? current : best;
    });

    return selectedMeal || {
      name: `${mealType} placeholder`,
      calories: targetCalories,
      ingredients: ['ingredient1', 'ingredient2'],
      instructions: 'Preparation instructions...'
    };
  }

  isExpertiseMatch(request) {
    const text = this.extractText(request).toLowerCase();
    const nutritionKeywords = Array.from(this.capabilities).join('|').replace(/-/g, '|');
    const regex = new RegExp(nutritionKeywords, 'i');
    return regex.test(text);
  }

  getExpertiseWeight(request) {
    if (this.isExpertiseMatch(request)) {
      return 0.9; // High expertise in nutrition domain
    }
    return 0.2; // Low expertise outside domain
  }

  async loadNutritionDatabase() {
    // Load basic nutrition data - in production this would connect to real databases
    console.log('📚 Loading nutrition database...');
    // Implementation would load from actual nutrition APIs/databases
  }

  async loadMealTemplates() {
    console.log('🍽️ Loading meal templates...');
    // Load meal templates for different meal types
    this.mealTemplates.set('breakfast', [
      { name: 'Oatmeal with berries', calories: 300, ingredients: ['oats', 'berries', 'milk'] },
      { name: 'Scrambled eggs with toast', calories: 350, ingredients: ['eggs', 'bread', 'butter'] }
    ]);
    
    this.mealTemplates.set('lunch', [
      { name: 'Grilled chicken salad', calories: 400, ingredients: ['chicken', 'lettuce', 'tomatoes'] },
      { name: 'Turkey sandwich', calories: 450, ingredients: ['turkey', 'bread', 'cheese'] }
    ]);
    
    this.mealTemplates.set('dinner', [
      { name: 'Baked salmon with vegetables', calories: 500, ingredients: ['salmon', 'broccoli', 'rice'] },
      { name: 'Pasta with marinara sauce', calories: 550, ingredients: ['pasta', 'tomato sauce', 'cheese'] }
    ]);
  }

  async initializeNutritionAPIs() {
    console.log('🌐 Initializing nutrition API connections...');
    // Initialize connections to external nutrition APIs
  }
}

module.exports = { NutritionPlanningAgent };
```

### **Workout Planning Agent (WPA)**
```javascript
// src/agents/workout-planning-agent.js
const { BaseAgent } = require('./base-agent');

class WorkoutPlanningAgent extends BaseAgent {
  constructor() {
    super('wpa', 'workout-planning', '1.0.0');
    
    // WPA-specific capabilities
    this.capabilities = new Set([
      'workout-design',
      'exercise-selection',
      'progress-tracking',
      'fitness-assessment',
      'equipment-recommendations',
      'routine-optimization',
      'injury-prevention',
      'performance-analysis'
    ]);
    
    // Workout knowledge base
    this.exerciseDB = new Map();
    this.workoutTemplates = new Map();
    this.fitnessProfiles = new Map();
    
    // WPA configuration
    this.config = {
      ...this.config,
      maxExercisesPerWorkout: 12,
      fitnessAPIs: ['exercisedb', 'wger'],
      defaultWorkoutDuration: 45 // minutes
    };
  }

  async initialize() {
    await super.initialize();
    
    console.log('💪 Initializing Workout Planning Agent...');
    
    // Load exercise database
    await this.loadExerciseDatabase();
    
    // Load workout templates
    await this.loadWorkoutTemplates();
    
    // Initialize fitness API connections
    await this.initializeFitnessAPIs();
    
    console.log('✅ WPA initialization completed');
    return { status: 'initialized', capabilities: Array.from(this.capabilities) };
  }

  async processSpecializedRequest(request) {
    const requestType = this.determineRequestType(request);
    
    switch (requestType) {
      case 'workout-plan':
        return await this.createWorkoutPlan(request);
      case 'exercise-recommendation':
        return await this.recommendExercises(request);
      case 'fitness-assessment':
        return await this.assessFitness(request);
      case 'progress-tracking':
        return await this.trackProgress(request);
      case 'equipment-recommendation':
        return await this.recommendEquipment(request);
      default:
        return await this.handleGeneralFitnessQuery(request);
    }
  }

  determineRequestType(request) {
    const text = this.extractText(request).toLowerCase();
    
    if (text.includes('workout plan') || text.includes('training plan')) return 'workout-plan';
    if (text.includes('exercise') || text.includes('movement')) return 'exercise-recommendation';
    if (text.includes('assess') || text.includes('fitness level')) return 'fitness-assessment';
    if (text.includes('progress') || text.includes('track')) return 'progress-tracking';
    if (text.includes('equipment') || text.includes('gear')) return 'equipment-recommendation';
    
    return 'general';
  }

  async createWorkoutPlan(request) {
    console.log('🏋️ Creating personalized workout plan...');
    
    const parameters = this.extractWorkoutParameters(request);
    
    // Generate workout plan based on parameters
    const workoutPlan = {
      duration: parameters.weeks || 4,
      frequency: parameters.frequency || 3, // workouts per week
      goals: parameters.goals || ['general-fitness'],
      fitnessLevel: parameters.level || 'intermediate',
      equipment: parameters.equipment || ['bodyweight'],
      timePerWorkout: parameters.duration || this.config.defaultWorkoutDuration,
      workouts: []
    };

    // Generate workouts for the plan
    const totalWorkouts = workoutPlan.duration * workoutPlan.frequency;
    for (let i = 0; i < totalWorkouts; i++) {
      const workout = await this.generateWorkout(parameters, i + 1);
      workoutPlan.workouts.push(workout);
    }

    // Add progression tracking
    workoutPlan.progression = this.generateProgressionPlan(workoutPlan);

    return {
      type: 'workout-plan',
      plan: workoutPlan,
      recommendations: await this.generateFitnessRecommendations(workoutPlan),
      safetyGuidelines: this.generateSafetyGuidelines(parameters)
    };
  }

  async recommendExercises(request) {
    console.log('🎯 Recommending exercises...');
    
    const criteria = this.extractExerciseCriteria(request);
    
    // Find matching exercises
    const exercises = await this.findExercises(criteria);
    
    return {
      type: 'exercise-recommendations',
      criteria,
      exercises: exercises.map(exercise => ({
        name: exercise.name,
        targetMuscles: exercise.targetMuscles,
        equipment: exercise.equipment,
        difficulty: exercise.difficulty,
        instructions: exercise.instructions,
        variations: exercise.variations || [],
        safetyTips: exercise.safetyTips || []
      }))
    };
  }

  async assessFitness(request) {
    console.log('📊 Assessing fitness level...');
    
    const userInfo = this.extractUserFitnessInfo(request);
    
    const assessment = {
      currentLevel: this.determineFitnessLevel(userInfo),
      strengths: this.identifyStrengths(userInfo),
      weaknesses: this.identifyWeaknesses(userInfo),
      recommendations: this.generateImprovementRecommendations(userInfo),
      goals: this.suggestRealisticGoals(userInfo)
    };

    return {
      type: 'fitness-assessment',
      assessment
    };
  }

  // Utility methods
  extractWorkoutParameters(request) {
    const text = this.extractText(request);
    
    return {
      weeks: this.extractWeeks(text),
      frequency: this.extractFrequency(text),
      goals: this.extractGoals(text),
      level: this.extractFitnessLevel(text),
      equipment: this.extractEquipment(text),
      duration: this.extractDuration(text)
    };
  }

  extractWeeks(text) {
    const weekMatches = text.match(/(\d+)\s*weeks?/i);
    return weekMatches ? parseInt(weekMatches[1]) : 4;
  }

  extractFrequency(text) {
    const freqMatches = text.match(/(\d+)\s*times?\s*per\s*week/i);
    if (freqMatches) return parseInt(freqMatches[1]);
    
    if (text.includes('daily')) return 7;
    if (text.includes('every other day')) return 3;
    
    return 3; // Default 3 times per week
  }

  extractGoals(text) {
    const goals = [];
    const goalKeywords = {
      'weight-loss': ['lose weight', 'weight loss', 'burn fat'],
      'muscle-gain': ['build muscle', 'gain muscle', 'muscle growth'],
      'strength': ['get stronger', 'strength', 'power'],
      'endurance': ['endurance', 'stamina', 'cardio'],
      'flexibility': ['flexibility', 'stretching', 'mobility'],
      'general-fitness': ['fitness', 'health', 'general']
    };

    for (const [goal, keywords] of Object.entries(goalKeywords)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        goals.push(goal);
      }
    }

    return goals.length > 0 ? goals : ['general-fitness'];
  }

  extractFitnessLevel(text) {
    if (text.toLowerCase().includes('beginner') || text.toLowerCase().includes('new')) return 'beginner';
    if (text.toLowerCase().includes('advanced') || text.toLowerCase().includes('expert')) return 'advanced';
    return 'intermediate';
  }

  extractEquipment(text) {
    const equipment = [];
    const equipmentKeywords = {
      'dumbbells': ['dumbbell', 'weights'],
      'barbell': ['barbell'],
      'resistance-bands': ['band', 'resistance band'],
      'kettlebell': ['kettlebell'],
      'bodyweight': ['bodyweight', 'no equipment'],
      'gym': ['gym', 'full gym']
    };

    for (const [equip, keywords] of Object.entries(equipmentKeywords)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        equipment.push(equip);
      }
    }

    return equipment.length > 0 ? equipment : ['bodyweight'];
  }

  async generateWorkout(parameters, workoutNumber) {
    const workoutType = this.determineWorkoutType(parameters, workoutNumber);
    const exercises = await this.selectExercises(workoutType, parameters);
    
    return {
      number: workoutNumber,
      type: workoutType,
      duration: parameters.duration || this.config.defaultWorkoutDuration,
      exercises: exercises.map(exercise => ({
        name: exercise.name,
        sets: exercise.sets || 3,
        reps: exercise.reps || '10-12',
        rest: exercise.rest || 60, // seconds
        notes: exercise.notes || '',
        targetMuscles: exercise.targetMuscles
      })),
      warmup: this.generateWarmup(workoutType),
      cooldown: this.generateCooldown()
    };
  }

  determineWorkoutType(parameters, workoutNumber) {
    const goals = parameters.goals || ['general-fitness'];
    
    if (goals.includes('strength')) {
      return workoutNumber % 3 === 1 ? 'upper-body-strength' : 
             workoutNumber % 3 === 2 ? 'lower-body-strength' : 'full-body-strength';
    }
    
    if (goals.includes('endurance')) {
      return 'cardio-endurance';
    }
    
    // Default to alternating upper/lower/full body
    return workoutNumber % 3 === 1 ? 'upper-body' : 
           workoutNumber % 3 === 2 ? 'lower-body' : 'full-body';
  }

  async selectExercises(workoutType, parameters) {
    const exercisePool = this.getExercisePool(workoutType, parameters);
    const selectedExercises = [];
    
    // Select 4-8 exercises based on workout type and duration
    const exerciseCount = Math.min(8, Math.max(4, Math.floor(parameters.duration / 6)));
    
    for (let i = 0; i < exerciseCount; i++) {
      const availableExercises = exercisePool.filter(ex => 
        !selectedExercises.some(sel => sel.targetMuscles.some(muscle => 
          ex.targetMuscles.includes(muscle)
        ))
      );
      
      if (availableExercises.length > 0) {
        selectedExercises.push(availableExercises[0]);
      }
    }
    
    return selectedExercises;
  }

  getExercisePool(workoutType, parameters) {
    // This would query the actual exercise database
    // For now, return sample exercises based on workout type
    const exercisePool = {
      'upper-body': [
        { name: 'Push-ups', targetMuscles: ['chest', 'triceps'], sets: 3, reps: '8-12' },
        { name: 'Pull-ups', targetMuscles: ['back', 'biceps'], sets: 3, reps: '5-10' },
        { name: 'Shoulder Press', targetMuscles: ['shoulders'], sets: 3, reps: '10-12' }
      ],
      'lower-body': [
        { name: 'Squats', targetMuscles: ['quads', 'glutes'], sets: 3, reps: '12-15' },
        { name: 'Lunges', targetMuscles: ['quads', 'glutes'], sets: 3, reps: '10-12 each leg' },
        { name: 'Deadlifts', targetMuscles: ['hamstrings', 'glutes'], sets: 3, reps: '8-10' }
      ],
      'full-body': [
        { name: 'Burpees', targetMuscles: ['full-body'], sets: 3, reps: '8-12' },
        { name: 'Mountain Climbers', targetMuscles: ['core', 'shoulders'], sets: 3, reps: '30 seconds' },
        { name: 'Plank', targetMuscles: ['core'], sets: 3, reps: '30-60 seconds' }
      ]
    };
    
    return exercisePool[workoutType] || exercisePool['full-body'];
  }

  generateWarmup(workoutType) {
    return {
      duration: 5, // minutes
      exercises: [
        'Light cardio (2-3 minutes)',
        'Dynamic stretching (2-3 minutes)',
        'Activation exercises specific to ' + workoutType
      ]
    };
  }

  generateCooldown() {
    return {
      duration: 5, // minutes
      exercises: [
        'Light walking (2 minutes)',
        'Static stretching (3 minutes)'
      ]
    };
  }

  isExpertiseMatch(request) {
    const text = this.extractText(request).toLowerCase();
    const fitnessKeywords = Array.from(this.capabilities).join('|').replace(/-/g, '|');
    const regex = new RegExp(fitnessKeywords, 'i');
    return regex.test(text);
  }

  getExpertiseWeight(request) {
    if (this.isExpertiseMatch(request)) {
      return 0.9; // High expertise in fitness domain
    }
    return 0.2; // Low expertise outside domain
  }

  async loadExerciseDatabase() {
    console.log('📚 Loading exercise database...');
    // Implementation would load from actual fitness APIs/databases
  }

  async loadWorkoutTemplates() {
    console.log('🏋️ Loading workout templates...');
    // Load workout templates for different goals and levels
  }

  async initializeFitnessAPIs() {
    console.log('🌐 Initializing fitness API connections...');
    // Initialize connections to external fitness APIs
  }
}

module.exports = { WorkoutPlanningAgent };
```

### **Budget Management Agent (BMA)**
```javascript
// src/agents/budget-management-agent.js
const { BaseAgent } = require('./base-agent');

class BudgetManagementAgent extends BaseAgent {
  constructor() {
    super('bma', 'budget-management', '1.0.0');
    
    // BMA-specific capabilities
    this.capabilities = new Set([
      'expense-tracking',
      'budget-optimization',
      'financial-planning',
      'cost-analysis',
      'savings-recommendations',
      'spending-insights',
      'financial-goal-setting',
      'budget-alerts'
    ]);
    
    // Financial knowledge base
    this.expenseCategories = new Map();
    this.budgetTemplates = new Map();
    this.financialGoals = new Map();
    
    // BMA configuration
    this.config = {
      ...this.config,
      defaultCurrency: 'USD',
      paymentAPIs: ['stripe'],
      budgetPeriods: ['weekly', 'monthly', 'yearly']
    };
  }

  async initialize() {
    await super.initialize();
    
    console.log('💰 Initializing Budget Management Agent...');
    
    // Load expense categories
    await this.loadExpenseCategories();
    
    // Load budget templates
    await this.loadBudgetTemplates();
    
    // Initialize payment API connections
    await this.initializePaymentAPIs();
    
    console.log('✅ BMA initialization completed');
    return { status: 'initialized', capabilities: Array.from(this.capabilities) };
  }

  async processSpecializedRequest(request) {
    const requestType = this.determineRequestType(request);
    
    switch (requestType) {
      case 'budget-creation':
        return await this.createBudget(request);
      case 'expense-analysis':
        return await this.analyzeExpenses(request);
      case 'savings-plan':
        return await this.createSavingsPlan(request);
      case 'cost-optimization':
        return await this.optimizeCosts(request);
      case 'financial-goal':
        return await this.setFinancialGoal(request);
      default:
        return await this.handleGeneralFinancialQuery(request);
    }
  }

  determineRequestType(request) {
    const text = this.extractText(request).toLowerCase();
    
    if (text.includes('budget') || text.includes('budgeting')) return 'budget-creation';
    if (text.includes('expenses') || text.includes('spending')) return 'expense-analysis';
    if (text.includes('savings') || text.includes('save money')) return 'savings-plan';
    if (text.includes('optimize') || text.includes('reduce costs')) return 'cost-optimization';
    if (text.includes('goal') || text.includes('target')) return 'financial-goal';
    
    return 'general';
  }

  async createBudget(request) {
    console.log('📊 Creating personalized budget...');
    
    const parameters = this.extractBudgetParameters(request);
    
    // Generate budget based on parameters
    const budget = {
      period: parameters.period || 'monthly',
      totalIncome: parameters.income || 0,
      currency: parameters.currency || this.config.defaultCurrency,
      categories: await this.generateBudgetCategories(parameters),
      savingsTarget: parameters.savingsTarget || (parameters.income * 0.2), // 20% default
      emergencyFund: parameters.emergencyFund || (parameters.income * 3) // 3 months expenses
    };

    // Calculate allocations
    budget.allocations = this.calculateBudgetAllocations(budget);
    
    // Add recommendations
    budget.recommendations = await this.generateBudgetRecommendations(budget);

    return {
      type: 'budget-plan',
      budget,
      insights: this.generateBudgetInsights(budget),
      actionItems: this.generateActionItems(budget)
    };
  }

  async analyzeExpenses(request) {
    console.log('🔍 Analyzing expenses...');
    
    const expenseData = this.extractExpenseData(request);
    
    const analysis = {
      totalExpenses: expenseData.total,
      categoryBreakdown: expenseData.categories,
      trends: this.analyzeTrends(expenseData),
      unusualSpending: this.detectUnusualSpending(expenseData),
      savingsOpportunities: this.identifySavingsOpportunities(expenseData)
    };

    return {
      type: 'expense-analysis',
      analysis,
      recommendations: this.generateExpenseRecommendations(analysis)
    };
  }

  async createSavingsPlan(request) {
    console.log('🎯 Creating savings plan...');
    
    const parameters = this.extractSavingsParameters(request);
    
    const savingsPlan = {
      goal: parameters.goal || 'Emergency Fund',
      targetAmount: parameters.amount || 10000,
      timeframe: parameters.timeframe || 12, // months
      currentSavings: parameters.currentSavings || 0,
      monthlyContribution: 0,
      strategies: []
    };

    // Calculate required monthly contribution
    const remainingAmount = savingsPlan.targetAmount - savingsPlan.currentSavings;
    savingsPlan.monthlyContribution = Math.ceil(remainingAmount / savingsPlan.timeframe);

    // Generate savings strategies
    savingsPlan.strategies = await this.generateSavingsStrategies(savingsPlan);

    return {
      type: 'savings-plan',
      plan: savingsPlan,
      milestones: this.generateSavingsMilestones(savingsPlan),
      tips: this.generateSavingsTips()
    };
  }

  // Utility methods
  extractBudgetParameters(request) {
    const text = this.extractText(request);
    
    return {
      income: this.extractIncome(text),
      period: this.extractPeriod(text),
      currency: this.extractCurrency(text),
      goals: this.extractFinancialGoals(text),
      constraints: this.extractConstraints(text)
    };
  }

  extractIncome(text) {
    const incomeMatches = text.match(/income[:\s]*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i) ||
                         text.match(/earn[:\s]*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i) ||
                         text.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:per|\/)\s*month/i);
    
    if (incomeMatches) {
      return parseFloat(incomeMatches[1].replace(',', ''));
    }
    return null;
  }

  extractPeriod(text) {
    if (text.includes('weekly')) return 'weekly';
    if (text.includes('yearly') || text.includes('annual')) return 'yearly';
    return 'monthly'; // default
  }

  async generateBudgetCategories(parameters) {
    const categories = [
      { name: 'Housing', allocation: 0.30, essential: true },
      { name: 'Food', allocation: 0.15, essential: true },
      { name: 'Transportation', allocation: 0.15, essential: true },
      { name: 'Utilities', allocation: 0.10, essential: true },
      { name: 'Healthcare', allocation: 0.05, essential: true },
      { name: 'Entertainment', allocation: 0.10, essential: false },
      { name: 'Shopping', allocation: 0.05, essential: false },
      { name: 'Savings', allocation: 0.10, essential: true }
    ];

    // Adjust allocations based on income and goals
    return categories.map(category => ({
      ...category,
      amount: Math.round(parameters.income * category.allocation),
      remaining: Math.round(parameters.income * category.allocation)
    }));
  }

  calculateBudgetAllocations(budget) {
    const totalAllocated = budget.categories.reduce((sum, cat) => sum + cat.amount, 0);
    const remaining = budget.totalIncome - totalAllocated;
    
    return {
      totalAllocated,
      remaining,
      allocationPercentage: (totalAllocated / budget.totalIncome * 100).toFixed(1),
      isBalanced: remaining >= 0
    };
  }

  generateBudgetInsights(budget) {
    const insights = [];
    
    // Check if savings rate is healthy
    const savingsCategory = budget.categories.find(cat => cat.name === 'Savings');
    const savingsRate = savingsCategory ? (savingsCategory.amount / budget.totalIncome) : 0;
    
    if (savingsRate < 0.10) {
      insights.push({
        type: 'warning',
        message: 'Consider increasing your savings rate to at least 10% of income'
      });
    } else if (savingsRate > 0.20) {
      insights.push({
        type: 'positive',
        message: 'Great job! You\'re saving above the recommended 20% of income'
      });
    }

    // Check housing costs
    const housingCategory = budget.categories.find(cat => cat.name === 'Housing');
    const housingRate = housingCategory ? (housingCategory.amount / budget.totalIncome) : 0;
    
    if (housingRate > 0.35) {
      insights.push({
        type: 'warning',
        message: 'Housing costs exceed 35% of income - consider reducing housing expenses'
      });
    }

    return insights;
  }

  isExpertiseMatch(request) {
    const text = this.extractText(request).toLowerCase();
    const financialKeywords = Array.from(this.capabilities).join('|').replace(/-/g, '|');
    const regex = new RegExp(financialKeywords, 'i');
    return regex.test(text);
  }

  getExpertiseWeight(request) {
    if (this.isExpertiseMatch(request)) {
      return 0.85; // High expertise in financial domain
    }
    return 0.15; // Low expertise outside domain
  }

  async loadExpenseCategories() {
    console.log('📚 Loading expense categories...');
    // Load standard expense categories and their typical percentages
  }

  async loadBudgetTemplates() {
    console.log('💼 Loading budget templates...');
    // Load budget templates for different income levels and lifestyles
  }

  async initializePaymentAPIs() {
    console.log('🌐 Initializing payment API connections...');
    // Initialize connections to payment processing APIs
  }
}

module.exports = { BudgetManagementAgent };
```

---

## **AGENT REGISTRY & MANAGEMENT**

### **Agent Registry Implementation**
```javascript
// src/core/agent-registry.js
const { EventEmitter } = require('events');

class AgentRegistry extends EventEmitter {
  constructor() {
    super();
    this.agents = new Map();
    this.agentMetadata = new Map();
    this.agentTypes = new Map();
    this.healthStatus = new Map();
    this.loadBalancer = new LoadBalancer();
  }

  /**
   * Register new agent with the registry
   */
  async registerAgent(agent, metadata) {
    const agentId = metadata.id;
    
    if (this.agents.has(agentId)) {
      console.warn(`⚠️ Agent ${agentId} already registered, updating...`);
    }

    // Store agent instance and metadata
    if (agent) {
      this.agents.set(agentId, agent);
    }
    
    this.agentMetadata.set(agentId, {
      ...metadata,
      registeredAt: new Date().toISOString(),
      lastHealthCheck: null,
      requestCount: 0,
      errorCount: 0
    });

    // Group by type
    if (!this.agentTypes.has(metadata.type)) {
      this.agentTypes.set(metadata.type, new Set());
    }
    this.agentTypes.get(metadata.type).add(agentId);

    // Initialize health status
    this.healthStatus.set(agentId, {
      status: agent ? 'healthy' : 'unavailable',
      lastCheck: new Date().toISOString()
    });

    // Register with load balancer
    if (agent) {
      this.loadBalancer.addAgent(agentId, metadata);
    }

    console.log(`✅ Agent registered: ${metadata.name} (${agentId})`);
    
    // Emit registration event
    this.emit('agentRegistered', {
      agentId,
      metadata,
      timestamp: new Date().toISOString()
    });

    return { success: true, agentId };
  }

  /**
   * Get agent instance by ID
   */
  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  /**
   * Get agent by type with load balancing
   */
  getAgentByType(agentType) {
    const agentIds = this.agentTypes.get(agentType);
    if (!agentIds || agentIds.size === 0) {
      throw new Error(`No agents available for type: ${agentType}`);
    }

    // Use load balancer to select best agent
    return this.loadBalancer.selectAgent(Array.from(agentIds));
  }

  /**
   * Get all agents of a specific type
   */
  getAgentsByType(agentType) {
    const agentIds = this.agentTypes.get(agentType);
    if (!agentIds) return [];

    return Array.from(agentIds).map(id => ({
      id,
      agent: this.agents.get(id),
      metadata: this.agentMetadata.get(id),
      health: this.healthStatus.get(id)
    })).filter(item => item.agent);
  }

  /**
   * Get all registered agents
   */
  getAllAgents() {
    return this.agents;
  }

  /**
   * Get agent count
   */
  getAgentCount() {
    return this.agents.size;
  }

  /**
   * Update agent health status
   */
  updateAgentHealth(agentId, healthData) {
    this.healthStatus.set(agentId, {
      ...healthData,
      lastCheck: new Date().toISOString()
    });

    // Update load balancer
    this.loadBalancer.updateAgentHealth(agentId, healthData);
  }

  /**
   * Remove agent from registry
   */
  async unregisterAgent(agentId) {
    const agent = this.agents.get(agentId);
    const metadata = this.agentMetadata.get(agentId);

    if (!agent || !metadata) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    // Shutdown agent gracefully
    if (agent.shutdown) {
      await agent.shutdown();
    }

    // Remove from all collections
    this.agents.delete(agentId);
    this.agentMetadata.delete(agentId);
    this.healthStatus.delete(agentId);

    // Remove from type grouping
    const typeSet = this.agentTypes.get(metadata.type);
    if (typeSet) {
      typeSet.delete(agentId);
      if (typeSet.size === 0) {
        this.agentTypes.delete(metadata.type);
      }
    }

    // Remove from load balancer
    this.loadBalancer.removeAgent(agentId);

    console.log(`🗑️ Agent unregistered: ${metadata.name} (${agentId})`);

    // Emit unregistration event
    this.emit('agentUnregistered', {
      agentId,
      metadata,
      timestamp: new Date().toISOString()
    });

    return { success: true };
  }

  /**
   * Get system status
   */
  getSystemStatus() {
    const totalAgents = this.agents.size;
    const healthyAgents = Array.from(this.healthStatus.values())
      .filter(health => health.status === 'healthy').length;

    const typeDistribution = {};
    for (const [type, agentSet] of this.agentTypes) {
      typeDistribution[type] = agentSet.size;
    }

    return {
      totalAgents,
      healthyAgents,
      unhealthyAgents: totalAgents - healthyAgents,
      typeDistribution,
      loadBalancer: this.loadBalancer.getStatus(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}

// Load Balancer for agent selection
class LoadBalancer {
  constructor() {
    this.agentStats = new Map();
    this.strategies = {
      roundRobin: new RoundRobinStrategy(),
      leastConnections: new LeastConnectionsStrategy(),
      weightedRoundRobin: new WeightedRoundRobinStrategy()
    };
    this.currentStrategy = 'weightedRoundRobin';
  }

  addAgent(agentId, metadata) {
    this.agentStats.set(agentId, {
      activeConnections: 0,
      totalRequests: 0,
      errorCount: 0,
      averageResponseTime: 0,
      weight: metadata.loadCapacity || 100,
      lastUsed: 0
    });
  }

  removeAgent(agentId) {
    this.agentStats.delete(agentId);
  }

  selectAgent(availableAgentIds) {
    const strategy = this.strategies[this.currentStrategy];
    return strategy.selectAgent(availableAgentIds, this.agentStats);
  }

  updateAgentHealth(agentId, healthData) {
    const stats = this.agentStats.get(agentId);
    if (stats && healthData.metrics) {
      stats.totalRequests = healthData.metrics.totalRequests || stats.totalRequests;
      stats.errorCount = healthData.metrics.failedRequests || stats.errorCount;
      stats.averageResponseTime = healthData.metrics.averageResponseTime || stats.averageResponseTime;
    }
  }

  getStatus() {
    return {
      strategy: this.currentStrategy,
      agentCount: this.agentStats.size,
      stats: Object.fromEntries(this.agentStats)
    };
  }
}

// Load balancing strategies
class WeightedRoundRobinStrategy {
  selectAgent(agentIds, agentStats) {
    // Select agent based on weight and current load
    let bestAgent = agentIds[0];
    let bestScore = -1;

    for (const agentId of agentIds) {
      const stats = agentStats.get(agentId);
      if (!stats) continue;

      // Calculate score based on weight and current load
      const loadFactor = stats.activeConnections / (stats.weight / 100);
      const timeFactor = Date.now() - stats.lastUsed;
      const errorFactor = stats.totalRequests > 0 ? (1 - stats.errorCount / stats.totalRequests) : 1;
      
      const score = (stats.weight * errorFactor * timeFactor) / (loadFactor + 1);

      if (score > bestScore) {
        bestScore = score;
        bestAgent = agentId;
      }
    }

    // Update last used time
    const stats = agentStats.get(bestAgent);
    if (stats) {
      stats.lastUsed = Date.now();
      stats.activeConnections++;
    }

    return bestAgent;
  }
}

class LeastConnectionsStrategy {
  selectAgent(agentIds, agentStats) {
    let bestAgent = agentIds[0];
    let leastConnections = Infinity;

    for (const agentId of agentIds) {
      const stats = agentStats.get(agentId);
      if (stats && stats.activeConnections < leastConnections) {
        leastConnections = stats.activeConnections;
        bestAgent = agentId;
      }
    }

    const stats = agentStats.get(bestAgent);
    if (stats) {
      stats.activeConnections++;
    }

    return bestAgent;
  }
}

class RoundRobinStrategy {
  constructor() {
    this.currentIndex = 0;
  }

  selectAgent(agentIds, agentStats) {
    const selectedAgent = agentIds[this.currentIndex % agentIds.length];
    this.currentIndex++;

    const stats = agentStats.get(selectedAgent);
    if (stats) {
      stats.activeConnections++;
    }

    return selectedAgent;
  }
}

module.exports = { AgentRegistry, LoadBalancer };
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Integration Architecture](Integration-Architecture.md)** - Integration patterns and communication
- **[Security Overview](../04-Security/Security-Overview.md)** - Security requirements and policies
- **[API Documentation](../03-Interfaces/API-Documentation.md)** - API design and contracts

### **Follow-up Documents**
- **[Deployment Architecture](Deployment-Architecture.md)** - Deployment strategies and environments
- **[Monitoring & Observability](Monitoring-Observability.md)** - System monitoring and observability

### **Operations Context**
- **[Container Orchestration](../05-DevOps/Container-Orchestration.md)** - Kubernetes deployment
- **[CI/CD Pipeline](../05-DevOps/CI-CD-Pipeline.md)** - Continuous integration and deployment

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | Architecture Team | Complete agent architecture implementation |
| 4.x | 2025-08-xx | Agent Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: Architecture Team  
**Last Validated**: 2025-09-02