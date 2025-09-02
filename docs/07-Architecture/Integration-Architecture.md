---
file: docs/07-Architecture/Integration-Architecture.md
directory: docs/07-Architecture/
priority: CRITICAL
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# Integration Architecture - Progressive-Framework-v5

**File Path**: `docs/07-Architecture/Integration-Architecture.md`  
**Directory**: `docs/07-Architecture/`  
**Priority**: CRITICAL  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive integration architecture for Progressive-Framework-v5, defining how the multi-agent intelligence system integrates with external services, databases, APIs, and enterprise systems. This document covers agent communication patterns, data flow integration, third-party service connections, and the Master Control Agent (MCA) orchestration layer.

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🤖 **[Agent Architecture](Agent-Architecture.md)** - *Multi-agent system design*
- 🛡️ **[Security Overview](../04-Security/Security-Overview.md)** - *Security requirements and policies*
- 🌐 **[Network Architecture & Security](../06-Infrastructure/Network-Architecture-Security.md)** - *Network topology and security*
- 📈 **[API Documentation](../03-Interfaces/API-Documentation.md)** - *API design and contracts*

---

## **INTEGRATION ARCHITECTURE OVERVIEW**

### **Multi-Agent Integration Topology**
```
Progressive-Framework-v5 Integration Architecture:

                             EXTERNAL WORLD
                                   │
                         ┌─────────────────────┐
                         │    API GATEWAY      │
                         │   (Rate Limiting)   │
                         │  (Authentication)   │
                         └─────────────────────┘
                                   │
                    ┌──────────────────────────────┐
                    │   MASTER CONTROL AGENT      │
                    │        (MCA Core)           │
                    │                             │
                    │ • Request Routing           │
                    │ • Load Balancing           │
                    │ • Cross-Agent Coordination │
                    │ • System Orchestration     │
                    └──────────────────────────────┘
                                   │
                      ┌─────────────────────┐
                      │  AGENT ECOSYSTEM    │
                      └─────────────────────┘
                                   │
    ┌─────────────┬─────────────────┼─────────────────┬─────────────┐
    │             │                 │                 │             │
┌─────────┐  ┌─────────┐       ┌─────────┐       ┌─────────┐   ┌─────────┐
│   NPA   │  │   WPA   │       │   BMA   │       │   RPA   │   │   EMA   │
│(Nutrition)│(Workout) │       │(Budget) │       │(Report) │   │(Emergency)│
│Planning │  │Planning │       │Management│      │Planning │   │Management│
└─────────┘  └─────────┘       └─────────┘       └─────────┘   └─────────┘
    │             │                 │                 │             │
    └─────────────┼─────────────────┼─────────────────┼─────────────┘
                  │                 │                 │
           ┌──────────────────────────────────────────────────────────┐
           │                INTEGRATION LAYER                         │
           │                                                          │
           │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
           │  │  Database   │  │ Third-Party │  │   Enterprise    │  │
           │  │ Connectors  │  │    APIs     │  │   Systems       │  │
           │  │             │  │             │  │                 │  │
           │  │ • PostgreSQL│  │ • Stripe    │  │ • ERP Systems   │  │
           │  │ • Redis     │  │ • Nutrition │  │ • CRM Systems   │  │
           │  │ • MongoDB   │  │ • Fitness   │  │ • Identity Mgmt │  │
           │  │ • Vector DB │  │ • Payment   │  │ • Legacy APIs   │  │
           │  └─────────────┘  └─────────────┘  └─────────────────┘  │
           └──────────────────────────────────────────────────────────┘
                                   │
                         ┌─────────────────────┐
                         │  EVENT BUS SYSTEM   │
                         │                     │
                         │ • Message Queues    │
                         │ • Event Sourcing    │
                         │ • Pub/Sub Patterns  │
                         │ • Workflow Engine   │
                         └─────────────────────┘
```

### **Integration Patterns Architecture**
```
Integration Communication Patterns:

┌─────────────────────────────────────────────────────────────────────┐
│                    SYNCHRONOUS INTEGRATION                          │
│                                                                     │
│  Client Request → MCA → Agent Selection → Direct API Call          │
│                    ↓                                                │
│            Real-time Response                                       │
│                                                                     │
│  Use Cases: User queries, immediate responses, health checks        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    ASYNCHRONOUS INTEGRATION                         │
│                                                                     │
│  Request → Event Queue → Background Processing → Notification      │
│                    ↓                                                │
│             Event-Driven Workflow                                   │
│                                                                     │
│  Use Cases: Complex calculations, batch processing, integrations    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                   HYBRID INTEGRATION                                │
│                                                                     │
│  Immediate Ack → Background Processing → Progressive Updates        │
│                    ↓                                                │
│            Best of Both Worlds                                      │
│                                                                     │
│  Use Cases: File uploads, complex queries, multi-step workflows    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## **MASTER CONTROL AGENT (MCA) INTEGRATION**

### **MCA Core Integration Engine**
```javascript
// src/core/mca-integration-engine.js
const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');

class MCAIntegrationEngine extends EventEmitter {
  constructor() {
    super();
    this.integrationRegistry = new Map();
    this.activeIntegrations = new Map();
    this.requestCache = new Map();
    this.circuitBreakers = new Map();
    this.performanceMetrics = {
      totalRequests: 0,
      successfulIntegrations: 0,
      failedIntegrations: 0,
      averageResponseTime: 0,
      activeConnections: 0
    };
  }

  /**
   * Initialize MCA Integration Engine
   */
  async initialize() {
    console.log('🧠 Initializing MCA Integration Engine...');
    
    // Register available integrations
    await this.registerIntegrations();
    
    // Initialize circuit breakers
    this.initializeCircuitBreakers();
    
    // Setup health monitoring
    this.setupHealthMonitoring();
    
    // Initialize connection pools
    await this.initializeConnectionPools();
    
    console.log('✅ MCA Integration Engine initialized successfully');
    
    return {
      status: 'initialized',
      integrationsCount: this.integrationRegistry.size,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Process integration request with intelligent routing
   */
  async processIntegrationRequest(request) {
    const startTime = Date.now();
    const requestId = uuidv4();
    
    try {
      // Analyze request complexity and requirements
      const analysis = await this.analyzeIntegrationRequest(request);
      
      // Select optimal integration strategy
      const strategy = this.selectIntegrationStrategy(analysis);
      
      // Execute integration based on strategy
      const result = await this.executeIntegration(requestId, request, strategy);
      
      // Update performance metrics
      this.updateMetrics(startTime, true);
      
      return {
        requestId,
        result,
        strategy: strategy.name,
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      // Handle integration failures
      const recovery = await this.handleIntegrationFailure(requestId, error);
      this.updateMetrics(startTime, false);
      
      return {
        requestId,
        error: error.message,
        recovery,
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Analyze integration request complexity and requirements
   */
  async analyzeIntegrationRequest(request) {
    const analysis = {
      complexity: 'simple',
      requiredIntegrations: [],
      estimatedDuration: 0,
      agentRequirements: [],
      securityLevel: 'standard'
    };

    // Complexity scoring algorithm
    let complexityScore = 0;
    
    // Check for multi-agent requirements
    if (request.requiresMultipleAgents) {
      complexityScore += 3;
      analysis.agentRequirements = request.agentTypes || [];
    }
    
    // Check for external API calls
    if (request.externalAPIs && request.externalAPIs.length > 0) {
      complexityScore += request.externalAPIs.length * 2;
      analysis.requiredIntegrations = request.externalAPIs;
    }
    
    // Check for database operations
    if (request.databaseOperations) {
      complexityScore += request.databaseOperations.length;
    }
    
    // Check for real-time requirements
    if (request.realTimeRequired) {
      complexityScore += 1;
      analysis.securityLevel = 'high';
    }
    
    // Determine complexity level
    if (complexityScore <= 2) analysis.complexity = 'simple';
    else if (complexityScore <= 6) analysis.complexity = 'moderate';
    else analysis.complexity = 'complex';
    
    // Estimate duration based on complexity
    analysis.estimatedDuration = complexityScore * 500; // milliseconds
    
    return analysis;
  }

  /**
   * Select optimal integration strategy
   */
  selectIntegrationStrategy(analysis) {
    const strategies = {
      direct: {
        name: 'direct',
        description: 'Direct synchronous integration',
        maxComplexity: 'simple',
        timeout: 5000
      },
      orchestrated: {
        name: 'orchestrated',
        description: 'MCA-orchestrated multi-step integration',
        maxComplexity: 'moderate',
        timeout: 15000
      },
      eventDriven: {
        name: 'eventDriven',
        description: 'Asynchronous event-driven integration',
        maxComplexity: 'complex',
        timeout: 30000
      },
      hybrid: {
        name: 'hybrid',
        description: 'Hybrid sync/async integration',
        maxComplexity: 'complex',
        timeout: 20000
      }
    };

    // Strategy selection logic
    if (analysis.complexity === 'simple' && !analysis.agentRequirements.length) {
      return strategies.direct;
    }
    
    if (analysis.complexity === 'moderate' && analysis.agentRequirements.length <= 2) {
      return strategies.orchestrated;
    }
    
    if (analysis.complexity === 'complex' || analysis.estimatedDuration > 10000) {
      return analysis.realTimeRequired ? strategies.hybrid : strategies.eventDriven;
    }
    
    // Default to orchestrated
    return strategies.orchestrated;
  }

  /**
   * Execute integration based on selected strategy
   */
  async executeIntegration(requestId, request, strategy) {
    switch (strategy.name) {
      case 'direct':
        return await this.executeDirectIntegration(requestId, request);
      
      case 'orchestrated':
        return await this.executeOrchestratedIntegration(requestId, request);
      
      case 'eventDriven':
        return await this.executeEventDrivenIntegration(requestId, request);
      
      case 'hybrid':
        return await this.executeHybridIntegration(requestId, request);
      
      default:
        throw new Error(`Unknown integration strategy: ${strategy.name}`);
    }
  }

  /**
   * Direct integration execution
   */
  async executeDirectIntegration(requestId, request) {
    console.log(`🔄 Executing direct integration for request ${requestId}`);
    
    // Single-step execution
    if (request.targetAgent) {
      const agent = this.getAgent(request.targetAgent);
      return await agent.processRequest(request.payload);
    }
    
    if (request.externalAPI) {
      return await this.callExternalAPI(request.externalAPI, request.payload);
    }
    
    throw new Error('No valid target for direct integration');
  }

  /**
   * Orchestrated integration execution
   */
  async executeOrchestratedIntegration(requestId, request) {
    console.log(`🎭 Executing orchestrated integration for request ${requestId}`);
    
    const results = [];
    const workflow = this.buildWorkflow(request);
    
    for (const step of workflow.steps) {
      try {
        const stepResult = await this.executeWorkflowStep(step, results);
        results.push({
          stepId: step.id,
          result: stepResult,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        // Handle step failure
        const recovery = await this.handleStepFailure(step, error);
        results.push({
          stepId: step.id,
          error: error.message,
          recovery,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return {
      workflowId: workflow.id,
      steps: results,
      summary: this.generateWorkflowSummary(results)
    };
  }

  /**
   * Event-driven integration execution
   */
  async executeEventDrivenIntegration(requestId, request) {
    console.log(`📡 Executing event-driven integration for request ${requestId}`);
    
    // Create integration context
    const context = {
      requestId,
      status: 'initiated',
      progress: 0,
      steps: []
    };
    
    // Emit integration started event
    this.emit('integrationStarted', { requestId, context });
    
    // Queue background processing
    setImmediate(async () => {
      try {
        const result = await this.processBackgroundIntegration(requestId, request);
        context.status = 'completed';
        context.result = result;
        this.emit('integrationCompleted', { requestId, context });
      } catch (error) {
        context.status = 'failed';
        context.error = error.message;
        this.emit('integrationFailed', { requestId, context, error });
      }
    });
    
    return {
      requestId,
      status: 'processing',
      message: 'Integration started in background',
      trackingId: requestId
    };
  }

  /**
   * Hybrid integration execution
   */
  async executeHybridIntegration(requestId, request) {
    console.log(`⚡ Executing hybrid integration for request ${requestId}`);
    
    // Immediate acknowledgment
    const ackResponse = {
      requestId,
      status: 'accepted',
      estimatedCompletion: Date.now() + 15000
    };
    
    // Start background processing with progress updates
    setImmediate(async () => {
      const progressCallback = (progress) => {
        this.emit('integrationProgress', {
          requestId,
          progress,
          timestamp: new Date().toISOString()
        });
      };
      
      try {
        const result = await this.processProgressiveIntegration(
          requestId, 
          request, 
          progressCallback
        );
        
        this.emit('integrationCompleted', {
          requestId,
          result,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        this.emit('integrationFailed', {
          requestId,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    return ackResponse;
  }

  /**
   * Register available integrations
   */
  async registerIntegrations() {
    const integrations = [
      {
        id: 'agent-npa',
        type: 'agent',
        name: 'Nutrition Planning Agent',
        endpoint: 'internal://agents/npa',
        capabilities: ['meal-planning', 'nutrition-analysis', 'dietary-recommendations']
      },
      {
        id: 'agent-wpa',
        type: 'agent',
        name: 'Workout Planning Agent',
        endpoint: 'internal://agents/wpa',
        capabilities: ['workout-design', 'exercise-selection', 'progress-tracking']
      },
      {
        id: 'agent-bma',
        type: 'agent',
        name: 'Budget Management Agent',
        endpoint: 'internal://agents/bma',
        capabilities: ['expense-tracking', 'budget-optimization', 'financial-planning']
      },
      {
        id: 'nutrition-api',
        type: 'external',
        name: 'USDA Food Data API',
        endpoint: 'https://api.nal.usda.gov/fdc/v1/',
        auth: 'api-key',
        rateLimit: 1000 // requests per hour
      },
      {
        id: 'fitness-api',
        type: 'external',
        name: 'Exercise Database API',
        endpoint: 'https://exercisedb.p.rapidapi.com/',
        auth: 'rapid-api-key',
        rateLimit: 500
      },
      {
        id: 'payment-api',
        type: 'external',
        name: 'Stripe Payment API',
        endpoint: 'https://api.stripe.com/v1/',
        auth: 'bearer-token',
        rateLimit: 100
      }
    ];
    
    integrations.forEach(integration => {
      this.integrationRegistry.set(integration.id, integration);
    });
    
    console.log(`📋 Registered ${integrations.length} integrations`);
  }

  /**
   * Get system status and integration health
   */
  getSystemStatus() {
    return {
      status: 'operational',
      integrations: {
        registered: this.integrationRegistry.size,
        active: this.activeIntegrations.size,
        healthy: Array.from(this.integrationRegistry.values())
          .filter(i => !this.circuitBreakers.get(i.id)?.isOpen()).length
      },
      performance: this.performanceMetrics,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { MCAIntegrationEngine };
```

---

## **AGENT COMMUNICATION PROTOCOLS**

### **Inter-Agent Communication Framework**
```javascript
// src/core/agent-communication.js
const EventEmitter = require('events');
const WebSocket = require('ws');

class AgentCommunicationFramework extends EventEmitter {
  constructor() {
    super();
    this.agents = new Map();
    this.communicationChannels = new Map();
    this.messageQueue = [];
    this.broadcastChannels = new Set(['system-alerts', 'coordination', 'health-checks']);
  }

  /**
   * Register agent for communication
   */
  async registerAgent(agentId, agentType, capabilities) {
    const agent = {
      id: agentId,
      type: agentType,
      capabilities,
      status: 'online',
      lastHeartbeat: Date.now(),
      messageHistory: [],
      subscriptions: new Set()
    };
    
    this.agents.set(agentId, agent);
    
    // Create dedicated communication channel
    this.createCommunicationChannel(agentId);
    
    // Announce agent availability
    await this.broadcastMessage('system-alerts', {
      type: 'agent-registered',
      agentId,
      agentType,
      capabilities,
      timestamp: new Date().toISOString()
    });
    
    console.log(`🤖 Agent ${agentId} (${agentType}) registered for communication`);
    return agent;
  }

  /**
   * Send message between agents
   */
  async sendMessage(fromAgentId, toAgentId, message) {
    const fromAgent = this.agents.get(fromAgentId);
    const toAgent = this.agents.get(toAgentId);
    
    if (!fromAgent || !toAgent) {
      throw new Error(`Agent not found: ${!fromAgent ? fromAgentId : toAgentId}`);
    }
    
    const messagePacket = {
      id: require('crypto').randomUUID(),
      from: fromAgentId,
      to: toAgentId,
      message,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    // Store in message history
    fromAgent.messageHistory.push(messagePacket);
    toAgent.messageHistory.push(messagePacket);
    
    // Deliver message
    const channel = this.communicationChannels.get(toAgentId);
    if (channel && channel.readyState === WebSocket.OPEN) {
      channel.send(JSON.stringify(messagePacket));
      messagePacket.status = 'delivered';
    } else {
      // Queue message for later delivery
      this.messageQueue.push(messagePacket);
      messagePacket.status = 'queued';
    }
    
    // Emit communication event
    this.emit('messageSent', messagePacket);
    
    return messagePacket;
  }

  /**
   * Broadcast message to all agents or specific channel
   */
  async broadcastMessage(channel, message) {
    const broadcastPacket = {
      id: require('crypto').randomUUID(),
      channel,
      message,
      timestamp: new Date().toISOString(),
      recipients: []
    };
    
    // Send to all agents subscribed to channel
    for (const [agentId, agent] of this.agents) {
      if (agent.subscriptions.has(channel) || channel === 'system-alerts') {
        const agentChannel = this.communicationChannels.get(agentId);
        if (agentChannel && agentChannel.readyState === WebSocket.OPEN) {
          agentChannel.send(JSON.stringify({
            ...broadcastPacket,
            to: agentId
          }));
          broadcastPacket.recipients.push(agentId);
        }
      }
    }
    
    this.emit('messageBroadcast', broadcastPacket);
    return broadcastPacket;
  }

  /**
   * Coordinate cross-agent task execution
   */
  async coordinateTask(taskId, requiredAgents, taskData) {
    console.log(`🎯 Coordinating task ${taskId} across agents: ${requiredAgents.join(', ')}`);
    
    const coordination = {
      taskId,
      requiredAgents,
      taskData,
      status: 'initiating',
      agentResponses: new Map(),
      startTime: Date.now(),
      timeout: 30000 // 30 seconds default
    };
    
    // Send coordination request to required agents
    const coordinationPromises = requiredAgents.map(async (agentId) => {
      const agent = this.agents.get(agentId);
      if (!agent) {
        throw new Error(`Required agent ${agentId} not available`);
      }
      
      const coordinationMessage = {
        type: 'coordination-request',
        taskId,
        taskData,
        requiredAgents: requiredAgents.filter(id => id !== agentId), // Other agents in task
        timeout: coordination.timeout
      };
      
      return this.sendMessage('mca', agentId, coordinationMessage);
    });
    
    try {
      // Wait for all coordination messages to be sent
      await Promise.all(coordinationPromises);
      coordination.status = 'coordinating';
      
      // Set up response collection
      const responsePromise = this.collectAgentResponses(taskId, requiredAgents, coordination.timeout);
      
      // Return coordination context
      return {
        taskId,
        status: coordination.status,
        requiredAgents,
        coordinationStarted: new Date().toISOString(),
        responsePromise // Can be awaited for completion
      };
      
    } catch (error) {
      coordination.status = 'failed';
      console.error(`❌ Task coordination failed for ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Collect responses from agents for coordinated task
   */
  async collectAgentResponses(taskId, requiredAgents, timeout) {
    return new Promise((resolve, reject) => {
      const responses = new Map();
      const startTime = Date.now();
      
      const responseHandler = (messagePacket) => {
        if (messagePacket.message.taskId === taskId && 
            messagePacket.message.type === 'coordination-response') {
          
          responses.set(messagePacket.from, {
            response: messagePacket.message.response,
            timestamp: messagePacket.timestamp,
            success: messagePacket.message.success !== false
          });
          
          // Check if all responses received
          if (responses.size === requiredAgents.length) {
            this.removeListener('messageSent', responseHandler);
            resolve({
              taskId,
              responses: Object.fromEntries(responses),
              completedIn: Date.now() - startTime,
              allSuccessful: Array.from(responses.values()).every(r => r.success)
            });
          }
        }
      };
      
      // Set up response listener
      this.on('messageSent', responseHandler);
      
      // Set timeout
      setTimeout(() => {
        this.removeListener('messageSent', responseHandler);
        const missingAgents = requiredAgents.filter(id => !responses.has(id));
        reject(new Error(`Coordination timeout for task ${taskId}. Missing responses from: ${missingAgents.join(', ')}`));
      }, timeout);
    });
  }
}

module.exports = { AgentCommunicationFramework };
```

### **Agent Collaboration Patterns**
```javascript
// src/patterns/collaboration-patterns.js

class CollaborationPatterns {
  constructor(communicationFramework, mca) {
    this.comm = communicationFramework;
    this.mca = mca;
  }

  /**
   * Sequential Processing Pattern
   * Agent A → Agent B → Agent C
   */
  async sequentialProcessing(taskData, agentChain) {
    console.log(`🔄 Starting sequential processing with chain: ${agentChain.join(' → ')}`);
    
    let result = taskData;
    const processingHistory = [];
    
    for (let i = 0; i < agentChain.length; i++) {
      const currentAgent = agentChain[i];
      const previousAgent = i > 0 ? agentChain[i - 1] : 'mca';
      
      try {
        const stepResult = await this.comm.sendMessage(previousAgent, currentAgent, {
          type: 'sequential-task',
          stepNumber: i + 1,
          totalSteps: agentChain.length,
          data: result,
          previousResults: processingHistory
        });
        
        // Wait for agent response
        const response = await this.waitForAgentResponse(currentAgent, stepResult.id);
        result = response.processedData;
        
        processingHistory.push({
          agent: currentAgent,
          step: i + 1,
          result,
          processingTime: response.processingTime,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.error(`❌ Sequential processing failed at step ${i + 1} (${currentAgent}):`, error);
        throw new Error(`Sequential processing chain broken at ${currentAgent}: ${error.message}`);
      }
    }
    
    return {
      finalResult: result,
      processingChain: agentChain,
      history: processingHistory,
      totalProcessingTime: processingHistory.reduce((sum, step) => sum + step.processingTime, 0)
    };
  }

  /**
   * Parallel Processing Pattern
   * Multiple agents process simultaneously, results combined
   */
  async parallelProcessing(taskData, agents, combineFunction) {
    console.log(`⚡ Starting parallel processing with agents: ${agents.join(', ')}`);
    
    const processingTasks = agents.map(async (agentId) => {
      try {
        const message = await this.comm.sendMessage('mca', agentId, {
          type: 'parallel-task',
          data: taskData,
          collaboratingAgents: agents.filter(id => id !== agentId)
        });
        
        const response = await this.waitForAgentResponse(agentId, message.id);
        return {
          agent: agentId,
          result: response.processedData,
          processingTime: response.processingTime,
          success: true
        };
        
      } catch (error) {
        console.error(`❌ Parallel processing failed for agent ${agentId}:`, error);
        return {
          agent: agentId,
          error: error.message,
          success: false
        };
      }
    });
    
    const results = await Promise.allSettled(processingTasks);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
    const failed = results.filter(r => r.status === 'rejected' || !r.value.success);
    
    if (successful.length === 0) {
      throw new Error('All parallel processing tasks failed');
    }
    
    // Combine results using provided function
    const combinedResult = combineFunction ? 
      combineFunction(successful.map(r => r.value.result)) :
      successful.map(r => r.value.result);
    
    return {
      combinedResult,
      successfulAgents: successful.map(r => r.value.agent),
      failedAgents: failed.map(r => r.value?.agent || 'unknown'),
      totalProcessingTime: Math.max(...successful.map(r => r.value.processingTime)),
      parallelEfficiency: successful.length / agents.length
    };
  }

  /**
   * Consensus Pattern
   * Multiple agents provide opinions, best consensus selected
   */
  async consensusProcessing(taskData, agents, consensusFunction) {
    console.log(`🤝 Starting consensus processing with agents: ${agents.join(', ')}`);
    
    const opinions = new Map();
    const confidenceScores = new Map();
    
    // Collect opinions from all agents
    const opinionTasks = agents.map(async (agentId) => {
      const message = await this.comm.sendMessage('mca', agentId, {
        type: 'consensus-request',
        data: taskData,
        participatingAgents: agents
      });
      
      const response = await this.waitForAgentResponse(agentId, message.id);
      opinions.set(agentId, response.opinion);
      confidenceScores.set(agentId, response.confidence || 0.5);
      
      return { agentId, opinion: response.opinion, confidence: response.confidence };
    });
    
    const opinionResults = await Promise.all(opinionTasks);
    
    // Apply consensus function
    const consensus = consensusFunction ? 
      consensusFunction(opinionResults) :
      this.defaultConsensusFunction(opinionResults);
    
    return {
      consensus: consensus.decision,
      confidence: consensus.confidence,
      participatingAgents: agents,
      opinions: Object.fromEntries(opinions),
      confidenceScores: Object.fromEntries(confidenceScores),
      consensusMethod: consensusFunction ? 'custom' : 'default'
    };
  }

  /**
   * Default consensus function (weighted average by confidence)
   */
  defaultConsensusFunction(opinionResults) {
    // Simple implementation - can be enhanced based on specific needs
    const totalWeight = opinionResults.reduce((sum, result) => sum + result.confidence, 0);
    const averageConfidence = totalWeight / opinionResults.length;
    
    // For now, return the opinion with highest confidence
    const bestOpinion = opinionResults.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
    
    return {
      decision: bestOpinion.opinion,
      confidence: averageConfidence,
      method: 'highest-confidence'
    };
  }

  /**
   * Wait for agent response with timeout
   */
  async waitForAgentResponse(agentId, messageId, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const responseHandler = (messagePacket) => {
        if (messagePacket.from === agentId && 
            messagePacket.message.responseToMessageId === messageId) {
          this.comm.removeListener('messageSent', responseHandler);
          resolve(messagePacket.message);
        }
      };
      
      this.comm.on('messageSent', responseHandler);
      
      setTimeout(() => {
        this.comm.removeListener('messageSent', responseHandler);
        reject(new Error(`Timeout waiting for response from agent ${agentId}`));
      }, timeout);
    });
  }
}

module.exports = { CollaborationPatterns };
```

---

## **DATABASE INTEGRATION LAYER**

### **Multi-Database Integration Manager**
```javascript
// src/integration/database-integration.js
const { Pool } = require('pg'); // PostgreSQL
const Redis = require('redis'); // Redis
const { MongoClient } = require('mongodb'); // MongoDB
const { VectorDB } = require('./vector-db-client'); // Vector database for embeddings

class DatabaseIntegrationManager {
  constructor() {
    this.connections = new Map();
    this.connectionPools = new Map();
    this.queryMetrics = new Map();
    this.healthChecks = new Map();
  }

  /**
   * Initialize all database connections
   */
  async initialize() {
    console.log('📊 Initializing Database Integration Layer...');
    
    try {
      // Initialize PostgreSQL connection pool
      await this.initializePostgreSQL();
      
      // Initialize Redis connection
      await this.initializeRedis();
      
      // Initialize MongoDB connection
      await this.initializeMongoDB();
      
      // Initialize Vector Database
      await this.initializeVectorDB();
      
      // Set up health monitoring
      this.setupHealthMonitoring();
      
      console.log('✅ All database connections initialized successfully');
      
      return {
        status: 'initialized',
        connections: Array.from(this.connections.keys()),
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize PostgreSQL connection pool
   */
  async initializePostgreSQL() {
    const config = {
      user: process.env.POSTGRES_USER || 'progressive_user',
      host: process.env.POSTGRES_HOST || 'localhost',
      database: process.env.POSTGRES_DB || 'progressive_framework_v5',
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT || 5432,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum connections in pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };
    
    const pool = new Pool(config);
    
    // Test connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    
    this.connectionPools.set('postgresql', pool);
    this.connections.set('postgresql', { status: 'connected', type: 'relational' });
    
    console.log('✅ PostgreSQL connection pool initialized');
  }

  /**
   * Initialize Redis connection
   */
  async initializeRedis() {
    const config = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    };
    
    const client = Redis.createClient(config);
    
    client.on('error', (error) => {
      console.error('Redis connection error:', error);
    });
    
    client.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });
    
    await client.connect();
    
    // Test connection
    await client.ping();
    
    this.connectionPools.set('redis', client);
    this.connections.set('redis', { status: 'connected', type: 'cache' });
  }

  /**
   * Initialize MongoDB connection
   */
  async initializeMongoDB() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/progressive-framework-v5';
    
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    await client.connect();
    
    // Test connection
    await client.db().admin().ping();
    
    this.connectionPools.set('mongodb', client);
    this.connections.set('mongodb', { status: 'connected', type: 'document' });
    
    console.log('✅ MongoDB connection initialized');
  }

  /**
   * Initialize Vector Database for embeddings
   */
  async initializeVectorDB() {
    const vectorDB = new VectorDB({
      endpoint: process.env.VECTOR_DB_ENDPOINT || 'http://localhost:8000',
      apiKey: process.env.VECTOR_DB_API_KEY,
      dimension: 1536 // OpenAI embedding dimension
    });
    
    await vectorDB.connect();
    
    this.connectionPools.set('vectordb', vectorDB);
    this.connections.set('vectordb', { status: 'connected', type: 'vector' });
    
    console.log('✅ Vector Database connection initialized');
  }

  /**
   * Execute query with automatic connection selection
   */
  async executeQuery(queryType, query, params = {}) {
    const startTime = Date.now();
    
    try {
      let result;
      
      switch (queryType) {
        case 'sql':
          result = await this.executeSQLQuery(query, params);
          break;
        case 'cache':
          result = await this.executeCacheOperation(query, params);
          break;
        case 'document':
          result = await this.executeDocumentQuery(query, params);
          break;
        case 'vector':
          result = await this.executeVectorQuery(query, params);
          break;
        default:
          throw new Error(`Unknown query type: ${queryType}`);
      }
      
      // Record metrics
      this.recordQueryMetrics(queryType, Date.now() - startTime, true);
      
      return {
        success: true,
        result,
        executionTime: Date.now() - startTime,
        queryType
      };
      
    } catch (error) {
      this.recordQueryMetrics(queryType, Date.now() - startTime, false);
      
      console.error(`Database query failed (${queryType}):`, error);
      throw error;
    }
  }

  /**
   * Execute SQL query on PostgreSQL
   */
  async executeSQLQuery(query, params) {
    const pool = this.connectionPools.get('postgresql');
    if (!pool) throw new Error('PostgreSQL connection not available');
    
    const client = await pool.connect();
    
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Execute cache operations on Redis
   */
  async executeCacheOperation(operation, params) {
    const client = this.connectionPools.get('redis');
    if (!client) throw new Error('Redis connection not available');
    
    switch (operation) {
      case 'get':
        return await client.get(params.key);
      case 'set':
        return await client.set(params.key, params.value, { EX: params.ttl });
      case 'del':
        return await client.del(params.key);
      case 'mget':
        return await client.mGet(params.keys);
      case 'hget':
        return await client.hGet(params.key, params.field);
      case 'hset':
        return await client.hSet(params.key, params.field, params.value);
      default:
        throw new Error(`Unknown cache operation: ${operation}`);
    }
  }

  /**
   * Execute document query on MongoDB
   */
  async executeDocumentQuery(operation, params) {
    const client = this.connectionPools.get('mongodb');
    if (!client) throw new Error('MongoDB connection not available');
    
    const db = client.db(params.database || 'progressive-framework-v5');
    const collection = db.collection(params.collection);
    
    switch (operation) {
      case 'find':
        return await collection.find(params.query || {}).toArray();
      case 'findOne':
        return await collection.findOne(params.query || {});
      case 'insertOne':
        return await collection.insertOne(params.document);
      case 'insertMany':
        return await collection.insertMany(params.documents);
      case 'updateOne':
        return await collection.updateOne(params.filter, params.update);
      case 'updateMany':
        return await collection.updateMany(params.filter, params.update);
      case 'deleteOne':
        return await collection.deleteOne(params.filter);
      case 'deleteMany':
        return await collection.deleteMany(params.filter);
      case 'aggregate':
        return await collection.aggregate(params.pipeline).toArray();
      default:
        throw new Error(`Unknown document operation: ${operation}`);
    }
  }

  /**
   * Execute vector database operations
   */
  async executeVectorQuery(operation, params) {
    const vectorDB = this.connectionPools.get('vectordb');
    if (!vectorDB) throw new Error('Vector Database connection not available');
    
    switch (operation) {
      case 'insert':
        return await vectorDB.insert(params.vectors, params.metadata);
      case 'search':
        return await vectorDB.search(params.query, params.k, params.filters);
      case 'update':
        return await vectorDB.update(params.id, params.vector, params.metadata);
      case 'delete':
        return await vectorDB.delete(params.id);
      default:
        throw new Error(`Unknown vector operation: ${operation}`);
    }
  }

  /**
   * Record query performance metrics
   */
  recordQueryMetrics(queryType, executionTime, success) {
    if (!this.queryMetrics.has(queryType)) {
      this.queryMetrics.set(queryType, {
        totalQueries: 0,
        successfulQueries: 0,
        failedQueries: 0,
        totalExecutionTime: 0,
        averageExecutionTime: 0
      });
    }
    
    const metrics = this.queryMetrics.get(queryType);
    metrics.totalQueries++;
    metrics.totalExecutionTime += executionTime;
    metrics.averageExecutionTime = metrics.totalExecutionTime / metrics.totalQueries;
    
    if (success) {
      metrics.successfulQueries++;
    } else {
      metrics.failedQueries++;
    }
  }

  /**
   * Get database health status
   */
  async getHealthStatus() {
    const health = {
      status: 'healthy',
      connections: {},
      metrics: Object.fromEntries(this.queryMetrics),
      timestamp: new Date().toISOString()
    };
    
    // Check each connection
    for (const [dbName, connection] of this.connections) {
      try {
        await this.performHealthCheck(dbName);
        health.connections[dbName] = {
          status: 'healthy',
          type: connection.type
        };
      } catch (error) {
        health.connections[dbName] = {
          status: 'unhealthy',
          type: connection.type,
          error: error.message
        };
        health.status = 'degraded';
      }
    }
    
    return health;
  }

  /**
   * Perform health check for specific database
   */
  async performHealthCheck(dbName) {
    switch (dbName) {
      case 'postgresql':
        const pool = this.connectionPools.get('postgresql');
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        break;
        
      case 'redis':
        const redis = this.connectionPools.get('redis');
        await redis.ping();
        break;
        
      case 'mongodb':
        const mongo = this.connectionPools.get('mongodb');
        await mongo.db().admin().ping();
        break;
        
      case 'vectordb':
        const vector = this.connectionPools.get('vectordb');
        await vector.healthCheck();
        break;
        
      default:
        throw new Error(`Unknown database: ${dbName}`);
    }
  }

  /**
   * Setup periodic health monitoring
   */
  setupHealthMonitoring() {
    setInterval(async () => {
      try {
        const health = await this.getHealthStatus();
        
        // Emit health status
        this.emit('healthCheck', health);
        
        // Log unhealthy connections
        for (const [dbName, status] of Object.entries(health.connections)) {
          if (status.status !== 'healthy') {
            console.warn(`⚠️ Database ${dbName} health check failed:`, status.error);
          }
        }
        
      } catch (error) {
        console.error('❌ Health monitoring failed:', error);
      }
    }, 30000); // Check every 30 seconds
  }
}

module.exports = { DatabaseIntegrationManager };
```

---

## **THIRD-PARTY API INTEGRATIONS**

### **External API Integration Framework**
```javascript
// src/integration/external-api-framework.js
const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const circuitBreaker = require('opossum');

class ExternalAPIFramework {
  constructor() {
    this.apiClients = new Map();
    this.circuitBreakers = new Map();
    this.rateLimiters = new Map();
    this.apiMetrics = new Map();
    this.authTokens = new Map();
  }

  /**
   * Initialize external API integrations
   */
  async initialize() {
    console.log('🌐 Initializing External API Integration Framework...');
    
    // Configure API integrations
    await this.configureNutritionAPIs();
    await this.configureFitnessAPIs();
    await this.configurePaymentAPIs();
    await this.configureNotificationAPIs();
    
    console.log('✅ External API integrations initialized');
    
    return {
      status: 'initialized',
      configuredAPIs: Array.from(this.apiClients.keys()),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Configure Nutrition-related APIs
   */
  async configureNutritionAPIs() {
    // USDA Food Data Central API
    this.registerAPI('usda-food-data', {
      baseURL: 'https://api.nal.usda.gov/fdc/v1',
      auth: {
        type: 'api-key',
        key: process.env.USDA_API_KEY,
        paramName: 'api_key'
      },
      rateLimit: {
        maxRequests: 1000,
        perMilliseconds: 3600000 // per hour
      },
      circuitBreaker: {
        timeout: 5000,
        errorThresholdPercentage: 50,
        resetTimeout: 30000
      },
      retryConfig: {
        retries: 3,
        retryDelay: 1000
      }
    });
    
    // Nutritionix API
    this.registerAPI('nutritionix', {
      baseURL: 'https://trackapi.nutritionix.com/v2',
      auth: {
        type: 'headers',
        headers: {
          'x-app-id': process.env.NUTRITIONIX_APP_ID,
          'x-app-key': process.env.NUTRITIONIX_API_KEY
        }
      },
      rateLimit: {
        maxRequests: 1000,
        perMilliseconds: 86400000 // per day
      },
      circuitBreaker: {
        timeout: 5000,
        errorThresholdPercentage: 50,
        resetTimeout: 30000
      }
    });
  }

  /**
   * Configure Fitness-related APIs
   */
  async configureFitnessAPIs() {
    // ExerciseDB API
    this.registerAPI('exercisedb', {
      baseURL: 'https://exercisedb.p.rapidapi.com',
      auth: {
        type: 'headers',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      },
      rateLimit: {
        maxRequests: 500,
        perMilliseconds: 86400000 // per day
      },
      circuitBreaker: {
        timeout: 10000,
        errorThresholdPercentage: 50,
        resetTimeout: 60000
      }
    });
    
    // Wger Workout Manager API
    this.registerAPI('wger', {
      baseURL: 'https://wger.de/api/v2',
      auth: {
        type: 'none'
      },
      rateLimit: {
        maxRequests: 200,
        perMilliseconds: 3600000 // per hour
      },
      circuitBreaker: {
        timeout: 8000,
        errorThresholdPercentage: 40,
        resetTimeout: 45000
      }
    });
  }

  /**
   * Configure Payment APIs
   */
  async configurePaymentAPIs() {
    // Stripe API
    this.registerAPI('stripe', {
      baseURL: 'https://api.stripe.com/v1',
      auth: {
        type: 'bearer',
        token: process.env.STRIPE_SECRET_KEY
      },
      rateLimit: {
        maxRequests: 100,
        perMilliseconds: 1000 // per second
      },
      circuitBreaker: {
        timeout: 10000,
        errorThresholdPercentage: 25, // More strict for payments
        resetTimeout: 60000
      },
      retryConfig: {
        retries: 5, // More retries for critical payment operations
        retryDelay: 2000
      }
    });
  }

  /**
   * Configure Notification APIs
   */
  async configureNotificationAPIs() {
    // SendGrid Email API
    this.registerAPI('sendgrid', {
      baseURL: 'https://api.sendgrid.com/v3',
      auth: {
        type: 'bearer',
        token: process.env.SENDGRID_API_KEY
      },
      rateLimit: {
        maxRequests: 600,
        perMilliseconds: 60000 // per minute
      },
      circuitBreaker: {
        timeout: 5000,
        errorThresholdPercentage: 50,
        resetTimeout: 30000
      }
    });
    
    // Push notification service
    this.registerAPI('push-notifications', {
      baseURL: 'https://fcm.googleapis.com/fcm',
      auth: {
        type: 'bearer',
        token: process.env.FCM_SERVER_KEY
      },
      rateLimit: {
        maxRequests: 1000,
        perMilliseconds: 60000 // per minute
      },
      circuitBreaker: {
        timeout: 3000,
        errorThresholdPercentage: 60,
        resetTimeout: 20000
      }
    });
  }

  /**
   * Register API with rate limiting and circuit breaker
   */
  registerAPI(apiName, config) {
    // Create axios instance with base configuration
    const client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 5000,
      headers: config.auth?.headers || {}
    });

    // Configure authentication
    if (config.auth) {
      this.configureAuth(client, config.auth);
    }

    // Apply rate limiting
    if (config.rateLimit) {
      const rateLimiter = rateLimit(client, config.rateLimit);
      this.rateLimiters.set(apiName, rateLimiter);
      this.apiClients.set(apiName, rateLimiter);
    } else {
      this.apiClients.set(apiName, client);
    }

    // Setup circuit breaker
    if (config.circuitBreaker) {
      const breaker = circuitBreaker(
        this.createCircuitBreakerFunction(apiName),
        config.circuitBreaker
      );
      
      breaker.on('open', () => {
        console.warn(`⚡ Circuit breaker OPEN for ${apiName} API`);
      });
      
      breaker.on('halfOpen', () => {
        console.info(`🔄 Circuit breaker HALF-OPEN for ${apiName} API`);
      });
      
      breaker.on('close', () => {
        console.info(`✅ Circuit breaker CLOSED for ${apiName} API`);
      });

      this.circuitBreakers.set(apiName, breaker);
    }

    // Initialize metrics
    this.apiMetrics.set(apiName, {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      totalResponseTime: 0,
      rateLimitHits: 0,
      circuitBreakerActivations: 0
    });

    console.log(`📡 Registered API integration: ${apiName}`);
  }

  /**
   * Make API request with all safety mechanisms
   */
  async makeRequest(apiName, method, endpoint, data, options = {}) {
    const startTime = Date.now();
    
    try {
      // Get API client
      const client = this.apiClients.get(apiName);
      if (!client) {
        throw new Error(`API client not found: ${apiName}`);
      }

      // Check circuit breaker
      const breaker = this.circuitBreakers.get(apiName);
      if (breaker && breaker.opened) {
        throw new Error(`Circuit breaker is open for ${apiName} API`);
      }

      // Prepare request configuration
      const requestConfig = {
        method: method.toLowerCase(),
        url: endpoint,
        ...options
      };

      if (data) {
        if (method.toLowerCase() === 'get') {
          requestConfig.params = data;
        } else {
          requestConfig.data = data;
        }
      }

      // Make request through circuit breaker if available
      let response;
      if (breaker) {
        response = await breaker.fire(requestConfig);
      } else {
        response = await client.request(requestConfig);
      }

      // Update metrics
      const responseTime = Date.now() - startTime;
      this.updateApiMetrics(apiName, responseTime, true);

      return {
        success: true,
        data: response.data,
        status: response.status,
        headers: response.headers,
        responseTime,
        apiName,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateApiMetrics(apiName, responseTime, false);

      // Handle specific error types
      if (error.response) {
        // API returned error status
        const apiError = {
          success: false,
          error: 'API_ERROR',
          status: error.response.status,
          message: error.response.data?.message || error.message,
          apiName,
          responseTime,
          timestamp: new Date().toISOString()
        };

        // Check for rate limiting
        if (error.response.status === 429) {
          const metrics = this.apiMetrics.get(apiName);
          metrics.rateLimitHits++;
          apiError.error = 'RATE_LIMITED';
          apiError.retryAfter = error.response.headers['retry-after'];
        }

        throw apiError;

      } else if (error.code === 'OPOSSUM_OPEN') {
        // Circuit breaker is open
        const metrics = this.apiMetrics.get(apiName);
        metrics.circuitBreakerActivations++;
        
        throw {
          success: false,
          error: 'CIRCUIT_BREAKER_OPEN',
          message: `Circuit breaker is open for ${apiName} API`,
          apiName,
          responseTime,
          timestamp: new Date().toISOString()
        };

      } else {
        // Network or other error
        throw {
          success: false,
          error: 'NETWORK_ERROR',
          message: error.message,
          apiName,
          responseTime,
          timestamp: new Date().toISOString()
        };
      }
    }
  }

  /**
   * Configure authentication for API client
   */
  configureAuth(client, authConfig) {
    switch (authConfig.type) {
      case 'api-key':
        // Add API key as query parameter or header
        client.interceptors.request.use(config => {
          if (authConfig.paramName) {
            config.params = config.params || {};
            config.params[authConfig.paramName] = authConfig.key;
          } else {
            config.headers['X-API-Key'] = authConfig.key;
          }
          return config;
        });
        break;

      case 'bearer':
        // Add bearer token
        client.interceptors.request.use(config => {
          config.headers.Authorization = `Bearer ${authConfig.token}`;
          return config;
        });
        break;

      case 'headers':
        // Add custom headers
        client.interceptors.request.use(config => {
          Object.assign(config.headers, authConfig.headers);
          return config;
        });
        break;

      case 'oauth':
        // OAuth token management (to be implemented)
        this.setupOAuthTokenManagement(client, authConfig);
        break;
    }
  }

  /**
   * Create circuit breaker function
   */
  createCircuitBreakerFunction(apiName) {
    return async (requestConfig) => {
      const client = this.apiClients.get(apiName);
      return await client.request(requestConfig);
    };
  }

  /**
   * Update API metrics
   */
  updateApiMetrics(apiName, responseTime, success) {
    const metrics = this.apiMetrics.get(apiName);
    if (!metrics) return;

    metrics.totalRequests++;
    metrics.totalResponseTime += responseTime;
    metrics.averageResponseTime = metrics.totalResponseTime / metrics.totalRequests;

    if (success) {
      metrics.successfulRequests++;
    } else {
      metrics.failedRequests++;
    }
  }

  /**
   * Get API integration status and metrics
   */
  getIntegrationStatus() {
    const status = {
      totalAPIs: this.apiClients.size,
      healthyAPIs: 0,
      unhealthyAPIs: 0,
      apis: {},
      timestamp: new Date().toISOString()
    };

    for (const [apiName, metrics] of this.apiMetrics) {
      const breaker = this.circuitBreakers.get(apiName);
      const isHealthy = !breaker || !breaker.opened;
      
      if (isHealthy) {
        status.healthyAPIs++;
      } else {
        status.unhealthyAPIs++;
      }

      status.apis[apiName] = {
        status: isHealthy ? 'healthy' : 'circuit_breaker_open',
        metrics: { ...metrics },
        circuitBreakerOpen: breaker?.opened || false,
        successRate: metrics.totalRequests > 0 ? 
          (metrics.successfulRequests / metrics.totalRequests * 100).toFixed(2) + '%' : '0%'
      };
    }

    return status;
  }
}

module.exports = { ExternalAPIFramework };
```

---

## **EVENT-DRIVEN INTEGRATION PATTERNS**

### **Event Bus System**
```javascript
// src/integration/event-bus.js
const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');

class EventBusSystem extends EventEmitter {
  constructor() {
    super();
    this.eventStore = [];
    this.subscriptions = new Map();
    this.eventHandlers = new Map();
    this.deadLetterQueue = [];
    this.retryQueue = [];
    this.eventMetrics = {
      totalEvents: 0,
      processedEvents: 0,
      failedEvents: 0,
      retriedEvents: 0,
      deadLetterEvents: 0
    };
  }

  /**
   * Publish event to the bus
   */
  async publishEvent(eventType, data, metadata = {}) {
    const event = {
      id: uuidv4(),
      type: eventType,
      data,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        source: metadata.source || 'unknown',
        version: metadata.version || '1.0'
      }
    };

    // Store event
    this.eventStore.push(event);
    this.eventMetrics.totalEvents++;

    try {
      // Process event
      await this.processEvent(event);
      this.eventMetrics.processedEvents++;
      
      console.log(`📡 Event published: ${eventType} (${event.id})`);
      
      return event;
      
    } catch (error) {
      console.error(`❌ Event processing failed: ${eventType} (${event.id})`, error);
      await this.handleEventFailure(event, error);
      throw error;
    }
  }

  /**
   * Subscribe to event type
   */
  subscribe(eventType, handler, options = {}) {
    const subscription = {
      id: uuidv4(),
      eventType,
      handler,
      options: {
        retries: options.retries || 3,
        retryDelay: options.retryDelay || 1000,
        deadLetterOnFailure: options.deadLetterOnFailure !== false,
        filter: options.filter || null
      }
    };

    // Store subscription
    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, new Set());
    }
    this.subscriptions.get(eventType).add(subscription);

    console.log(`📋 Subscribed to event: ${eventType} (${subscription.id})`);
    
    return subscription.id;
  }

  /**
   * Unsubscribe from event
   */
  unsubscribe(subscriptionId) {
    for (const [eventType, subscriptions] of this.subscriptions) {
      for (const subscription of subscriptions) {
        if (subscription.id === subscriptionId) {
          subscriptions.delete(subscription);
          console.log(`❌ Unsubscribed: ${eventType} (${subscriptionId})`);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Process event through all subscribers
   */
  async processEvent(event) {
    const subscribers = this.subscriptions.get(event.type) || new Set();
    const processingPromises = [];

    for (const subscription of subscribers) {
      // Apply filter if present
      if (subscription.options.filter && 
          !subscription.options.filter(event)) {
        continue;
      }

      const processingPromise = this.executeHandler(event, subscription);
      processingPromises.push(processingPromise);
    }

    // Wait for all handlers to complete
    const results = await Promise.allSettled(processingPromises);
    
    // Check for failures
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.warn(`⚠️ ${failures.length}/${results.length} handlers failed for event ${event.type}`);
    }

    return results;
  }

  /**
   * Execute individual event handler
   */
  async executeHandler(event, subscription) {
    let attempt = 0;
    const maxRetries = subscription.options.retries;

    while (attempt <= maxRetries) {
      try {
        await subscription.handler(event);
        
        if (attempt > 0) {
          this.eventMetrics.retriedEvents++;
          console.log(`✅ Handler succeeded on retry ${attempt} for event ${event.id}`);
        }
        
        return;
        
      } catch (error) {
        attempt++;
        
        if (attempt <= maxRetries) {
          console.warn(`🔄 Handler failed, retrying (${attempt}/${maxRetries}) for event ${event.id}:`, error.message);
          await this.delay(subscription.options.retryDelay * attempt); // Exponential backoff
        } else {
          console.error(`❌ Handler failed permanently for event ${event.id}:`, error);
          
          if (subscription.options.deadLetterOnFailure) {
            await this.sendToDeadLetter(event, subscription, error);
          }
          
          throw error;
        }
      }
    }
  }

  /**
   * Handle event processing failure
   */
  async handleEventFailure(event, error) {
    this.eventMetrics.failedEvents++;
    
    // Store failure information
    const failure = {
      eventId: event.id,
      eventType: event.type,
      error: error.message,
      timestamp: new Date().toISOString(),
      retryCount: 0
    };

    // Add to retry queue if retryable
    if (this.isRetryableError(error)) {
      this.retryQueue.push(failure);
      console.log(`🔄 Event added to retry queue: ${event.id}`);
    } else {
      await this.sendToDeadLetter(event, null, error);
    }
  }

  /**
   * Send event to dead letter queue
   */
  async sendToDeadLetter(event, subscription, error) {
    const deadLetter = {
      originalEvent: event,
      subscription: subscription ? {
        id: subscription.id,
        eventType: subscription.eventType
      } : null,
      error: error.message,
      timestamp: new Date().toISOString(),
      reason: 'max_retries_exceeded'
    };

    this.deadLetterQueue.push(deadLetter);
    this.eventMetrics.deadLetterEvents++;
    
    console.error(`💀 Event sent to dead letter queue: ${event.id}`);
    
    // Emit dead letter event for monitoring
    this.emit('deadLetter', deadLetter);
  }

  /**
   * Process retry queue
   */
  async processRetryQueue() {
    if (this.retryQueue.length === 0) return;

    console.log(`🔄 Processing retry queue: ${this.retryQueue.length} events`);

    const eventsToRetry = this.retryQueue.splice(0, 10); // Process batch of 10
    
    for (const failure of eventsToRetry) {
      try {
        const originalEvent = this.eventStore.find(e => e.id === failure.eventId);
        if (originalEvent) {
          await this.processEvent(originalEvent);
          console.log(`✅ Retry successful for event: ${failure.eventId}`);
        }
      } catch (error) {
        failure.retryCount++;
        
        if (failure.retryCount < 5) {
          this.retryQueue.push(failure);
        } else {
          const originalEvent = this.eventStore.find(e => e.id === failure.eventId);
          if (originalEvent) {
            await this.sendToDeadLetter(originalEvent, null, error);
          }
        }
      }
    }
  }

  /**
   * Check if error is retryable
   */
  isRetryableError(error) {
    const retryableErrors = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'DATABASE_CONNECTION_ERROR',
      'RATE_LIMITED'
    ];

    return retryableErrors.some(retryableError => 
      error.message.includes(retryableError)
    );
  }

  /**
   * Get event bus metrics and status
   */
  getEventBusStatus() {
    return {
      status: 'operational',
      metrics: { ...this.eventMetrics },
      subscriptions: {
        total: Array.from(this.subscriptions.values())
          .reduce((sum, subs) => sum + subs.size, 0),
        byEventType: Object.fromEntries(
          Array.from(this.subscriptions.entries()).map(([type, subs]) => [type, subs.size])
        )
      },
      queues: {
        eventStore: this.eventStore.length,
        retryQueue: this.retryQueue.length,
        deadLetterQueue: this.deadLetterQueue.length
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Utility delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { EventBusSystem };
```

### **Workflow Engine Integration**
```javascript
// src/integration/workflow-engine.js
const { EventBusSystem } = require('./event-bus');

class WorkflowEngine {
  constructor(eventBus) {
    this.eventBus = eventBus || new EventBusSystem();
    this.workflows = new Map();
    this.activeExecutions = new Map();
    this.workflowTemplates = new Map();
  }

  /**
   * Define workflow template
   */
  defineWorkflow(name, definition) {
    const workflow = {
      name,
      version: definition.version || '1.0',
      description: definition.description || '',
      steps: definition.steps || [],
      conditions: definition.conditions || {},
      errorHandling: definition.errorHandling || { strategy: 'fail' },
      timeout: definition.timeout || 300000, // 5 minutes default
      created: new Date().toISOString()
    };

    this.workflowTemplates.set(name, workflow);
    
    console.log(`📋 Workflow template defined: ${name} v${workflow.version}`);
    return workflow;
  }

  /**
   * Execute workflow instance
   */
  async executeWorkflow(workflowName, inputData, executionOptions = {}) {
    const template = this.workflowTemplates.get(workflowName);
    if (!template) {
      throw new Error(`Workflow template not found: ${workflowName}`);
    }

    const executionId = require('crypto').randomUUID();
    const execution = {
      id: executionId,
      workflowName,
      template,
      inputData,
      status: 'running',
      currentStep: 0,
      stepResults: [],
      startTime: Date.now(),
      timeout: executionOptions.timeout || template.timeout,
      context: {
        ...inputData,
        executionId,
        startTime: new Date().toISOString()
      }
    };

    this.activeExecutions.set(executionId, execution);

    try {
      console.log(`🚀 Starting workflow execution: ${workflowName} (${executionId})`);
      
      // Publish workflow started event
      await this.eventBus.publishEvent('workflow.started', {
        executionId,
        workflowName,
        inputData
      });

      const result = await this.executeSteps(execution);
      
      execution.status = 'completed';
      execution.result = result;
      execution.endTime = Date.now();
      execution.duration = execution.endTime - execution.startTime;

      // Publish workflow completed event
      await this.eventBus.publishEvent('workflow.completed', {
        executionId,
        workflowName,
        result,
        duration: execution.duration
      });

      console.log(`✅ Workflow completed: ${workflowName} (${executionId}) in ${execution.duration}ms`);
      
      return {
        executionId,
        status: 'completed',
        result,
        duration: execution.duration,
        stepResults: execution.stepResults
      };

    } catch (error) {
      execution.status = 'failed';
      execution.error = error.message;
      execution.endTime = Date.now();
      execution.duration = execution.endTime - execution.startTime;

      // Publish workflow failed event
      await this.eventBus.publishEvent('workflow.failed', {
        executionId,
        workflowName,
        error: error.message,
        duration: execution.duration
      });

      console.error(`❌ Workflow failed: ${workflowName} (${executionId}):`, error);
      
      throw {
        executionId,
        status: 'failed',
        error: error.message,
        duration: execution.duration,
        stepResults: execution.stepResults
      };
    } finally {
      // Clean up active execution
      setTimeout(() => {
        this.activeExecutions.delete(executionId);
      }, 60000); // Keep for 1 minute for debugging
    }
  }

  /**
   * Execute workflow steps
   */
  async executeSteps(execution) {
    const { template, context } = execution;
    let stepResults = [];

    for (let i = 0; i < template.steps.length; i++) {
      const step = template.steps[i];
      execution.currentStep = i;

      try {
        console.log(`📍 Executing step ${i + 1}/${template.steps.length}: ${step.name || step.type}`);

        // Check step conditions
        if (step.condition && !this.evaluateCondition(step.condition, context)) {
          console.log(`⏭️ Step ${i + 1} skipped due to condition: ${step.condition}`);
          stepResults.push({
            stepIndex: i,
            stepName: step.name || step.type,
            status: 'skipped',
            reason: 'condition_not_met'
          });
          continue;
        }

        const stepResult = await this.executeStep(step, context, execution.id);
        
        stepResults.push({
          stepIndex: i,
          stepName: step.name || step.type,
          status: 'completed',
          result: stepResult,
          executionTime: stepResult.executionTime
        });

        // Update context with step results
        if (step.outputVariable) {
          context[step.outputVariable] = stepResult.data;
        }

        // Publish step completed event
        await this.eventBus.publishEvent('workflow.step.completed', {
          executionId: execution.id,
          stepIndex: i,
          stepName: step.name || step.type,
          result: stepResult
        });

      } catch (error) {
        console.error(`❌ Step ${i + 1} failed: ${step.name || step.type}`, error);

        stepResults.push({
          stepIndex: i,
          stepName: step.name || step.type,
          status: 'failed',
          error: error.message
        });

        // Handle step failure based on error handling strategy
        const shouldContinue = await this.handleStepFailure(
          step, 
          error, 
          execution, 
          template.errorHandling
        );

        if (!shouldContinue) {
          throw new Error(`Workflow execution failed at step ${i + 1}: ${error.message}`);
        }
      }
    }

    execution.stepResults = stepResults;
    return {
      success: true,
      stepResults,
      finalContext: context
    };
  }

  /**
   * Execute individual workflow step
   */
  async executeStep(step, context, executionId) {
    const startTime = Date.now();

    let result;
    
    switch (step.type) {
      case 'agent_call':
        result = await this.executeAgentCall(step, context);
        break;
        
      case 'api_call':
        result = await this.executeApiCall(step, context);
        break;
        
      case 'database_operation':
        result = await this.executeDatabaseOperation(step, context);
        break;
        
      case 'condition':
        result = await this.executeCondition(step, context);
        break;
        
      case 'parallel':
        result = await this.executeParallelSteps(step, context, executionId);
        break;
        
      case 'wait':
        result = await this.executeWait(step, context);
        break;
        
      case 'transform':
        result = await this.executeTransform(step, context);
        break;
        
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }

    return {
      data: result,
      executionTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute agent call step
   */
  async executeAgentCall(step, context) {
    const { agentType, method, parameters } = step.config;
    
    // Resolve parameters from context
    const resolvedParams = this.resolveParameters(parameters, context);
    
    // Get MCA instance (assuming it's available)
    const mca = global.mcaInstance; // This would be injected properly
    
    if (!mca) {
      throw new Error('MCA instance not available for agent call');
    }

    const response = await mca.routeRequest({
      targetAgent: agentType,
      method,
      parameters: resolvedParams
    });

    return response;
  }

  /**
   * Execute API call step
   */
  async executeApiCall(step, context) {
    const { api, method, endpoint, data, headers } = step.config;
    
    // Get external API framework (assuming it's available)
    const apiFramework = global.externalAPIFramework;
    
    if (!apiFramework) {
      throw new Error('External API framework not available');
    }

    const resolvedData = this.resolveParameters(data, context);
    const resolvedHeaders = this.resolveParameters(headers, context);

    const response = await apiFramework.makeRequest(
      api,
      method,
      endpoint,
      resolvedData,
      { headers: resolvedHeaders }
    );

    return response.data;
  }

  /**
   * Execute parallel steps
   */
  async executeParallelSteps(step, context, executionId) {
    const { steps } = step.config;
    
    console.log(`⚡ Executing ${steps.length} steps in parallel`);

    const parallelTasks = steps.map(async (parallelStep, index) => {
      try {
        return await this.executeStep(parallelStep, context, `${executionId}_p${index}`);
      } catch (error) {
        return { error: error.message, stepIndex: index };
      }
    });

    const results = await Promise.all(parallelTasks);
    
    return {
      parallelResults: results,
      successCount: results.filter(r => !r.error).length,
      failureCount: results.filter(r => r.error).length
    };
  }

  /**
   * Handle step failure based on error handling strategy
   */
  async handleStepFailure(step, error, execution, errorHandling) {
    const strategy = step.errorHandling?.strategy || errorHandling.strategy || 'fail';

    switch (strategy) {
      case 'fail':
        return false; // Stop execution
        
      case 'continue':
        console.warn(`⚠️ Continuing workflow despite step failure: ${error.message}`);
        return true;
        
      case 'retry':
        const maxRetries = step.errorHandling?.maxRetries || 3;
        const currentRetries = step.retryCount || 0;
        
        if (currentRetries < maxRetries) {
          step.retryCount = currentRetries + 1;
          console.log(`🔄 Retrying step (${step.retryCount}/${maxRetries})`);
          
          // Add delay before retry
          await this.delay(step.errorHandling?.retryDelay || 1000);
          return 'retry';
        }
        
        return false; // Max retries exceeded
        
      case 'fallback':
        if (step.errorHandling?.fallbackStep) {
          console.log(`🔀 Executing fallback step`);
          await this.executeStep(step.errorHandling.fallbackStep, execution.context, execution.id);
          return true;
        }
        return false;
        
      default:
        return false;
    }
  }

  /**
   * Resolve parameters from context
   */
  resolveParameters(parameters, context) {
    if (!parameters) return parameters;
    
    if (typeof parameters === 'string') {
      // Simple variable substitution
      return parameters.replace(/\${(\w+)}/g, (match, varName) => {
        return context[varName] || match;
      });
    }
    
    if (Array.isArray(parameters)) {
      return parameters.map(param => this.resolveParameters(param, context));
    }
    
    if (typeof parameters === 'object') {
      const resolved = {};
      for (const [key, value] of Object.entries(parameters)) {
        resolved[key] = this.resolveParameters(value, context);
      }
      return resolved;
    }
    
    return parameters;
  }

  /**
   * Get workflow engine status
   */
  getEngineStatus() {
    return {
      status: 'operational',
      workflowTemplates: this.workflowTemplates.size,
      activeExecutions: this.activeExecutions.size,
      executionDetails: Array.from(this.activeExecutions.entries()).map(([id, exec]) => ({
        executionId: id,
        workflowName: exec.workflowName,
        status: exec.status,
        currentStep: exec.currentStep,
        progress: exec.template.steps.length > 0 ? 
          (exec.currentStep / exec.template.steps.length * 100).toFixed(1) + '%' : '0%',
        runningTime: Date.now() - exec.startTime
      })),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Utility delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { WorkflowEngine };
```

---

## **INTEGRATION TESTING & MONITORING**

### **Integration Health Monitor**
```javascript
// src/monitoring/integration-health-monitor.js
class IntegrationHealthMonitor {
  constructor() {
    this.healthChecks = new Map();
    this.healthHistory = [];
    this.alertThresholds = {
      responseTime: 5000, // 5 seconds
      errorRate: 0.05, // 5%
      availability: 0.99 // 99%
    };
    this.monitoringInterval = 30000; // 30 seconds
  }

  /**
   * Initialize health monitoring
   */
  async initialize() {
    console.log('🏥 Initializing Integration Health Monitor...');
    
    // Register health checks for all integrations
    await this.registerHealthChecks();
    
    // Start continuous monitoring
    this.startContinuousMonitoring();
    
    console.log('✅ Integration Health Monitor initialized');
  }

  /**
   * Register health checks for all integration points
   */
  async registerHealthChecks() {
    const integrations = [
      {
        name: 'mca-coordination',
        type: 'agent',
        healthCheck: this.checkMCAHealth.bind(this)
      },
      {
        name: 'agent-communication',
        type: 'internal',
        healthCheck: this.checkAgentCommunication.bind(this)
      },
      {
        name: 'database-connectivity',
        type: 'database',
        healthCheck: this.checkDatabaseHealth.bind(this)
      },
      {
        name: 'external-apis',
        type: 'external',
        healthCheck: this.checkExternalAPIs.bind(this)
      },
      {
        name: 'event-bus',
        type: 'internal',
        healthCheck: this.checkEventBusHealth.bind(this)
      }
    ];

    integrations.forEach(integration => {
      this.healthChecks.set(integration.name, {
        ...integration,
        status: 'unknown',
        lastCheck: null,
        consecutiveFailures: 0,
        metrics: {
          totalChecks: 0,
          successfulChecks: 0,
          averageResponseTime: 0
        }
      });
    });

    console.log(`📋 Registered ${integrations.length} health checks`);
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck() {
    console.log('🔍 Performing comprehensive integration health check...');
    
    const healthReport = {
      timestamp: new Date().toISOString(),
      overallStatus: 'healthy',
      integrations: {},
      summary: {
        healthy: 0,
        degraded: 0,
        unhealthy: 0
      }
    };

    for (const [name, integration] of this.healthChecks) {
      const startTime = Date.now();
      
      try {
        const healthResult = await integration.healthCheck();
        const responseTime = Date.now() - startTime;
        
        // Update integration status
        integration.status = healthResult.healthy ? 'healthy' : 'degraded';
        integration.lastCheck = new Date().toISOString();
        integration.consecutiveFailures = healthResult.healthy ? 0 : integration.consecutiveFailures + 1;
        
        // Update metrics
        integration.metrics.totalChecks++;
        if (healthResult.healthy) {
          integration.metrics.successfulChecks++;
        }
        integration.metrics.averageResponseTime = 
          ((integration.metrics.averageResponseTime * (integration.metrics.totalChecks - 1)) + responseTime) / 
          integration.metrics.totalChecks;

        // Add to health report
        healthReport.integrations[name] = {
          status: integration.status,
          responseTime,
          details: healthResult.details || {},
          lastCheck: integration.lastCheck,
          consecutiveFailures: integration.consecutiveFailures
        };

        // Update summary
        healthReport.summary[integration.status]++;

      } catch (error) {
        const responseTime = Date.now() - startTime;
        
        // Mark as unhealthy
        integration.status = 'unhealthy';
        integration.lastCheck = new Date().toISOString();
        integration.consecutiveFailures++;
        integration.metrics.totalChecks++;

        healthReport.integrations[name] = {
          status: 'unhealthy',
          responseTime,
          error: error.message,
          lastCheck: integration.lastCheck,
          consecutiveFailures: integration.consecutiveFailures
        };

        healthReport.summary.unhealthy++;
        
        console.error(`❌ Health check failed for ${name}:`, error);
      }
    }

    // Determine overall status
    if (healthReport.summary.unhealthy > 0) {
      healthReport.overallStatus = 'unhealthy';
    } else if (healthReport.summary.degraded > 0) {
      healthReport.overallStatus = 'degraded';
    }

    // Store in history
    this.healthHistory.push(healthReport);
    
    // Keep only last 24 hours of history
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.healthHistory = this.healthHistory.filter(report => 
      new Date(report.timestamp).getTime() > oneDayAgo
    );

    // Check for alerts
    await this.checkForAlerts(healthReport);

    console.log(`🏥 Health check completed: ${healthReport.overallStatus} (${healthReport.summary.healthy} healthy, ${healthReport.summary.degraded} degraded, ${healthReport.summary.unhealthy} unhealthy)`);
    
    return healthReport;
  }

  /**
   * Check MCA coordination health
   */
  async checkMCAHealth() {
    try {
      // Simulate MCA health check
      const mca = global.mcaInstance;
      if (!mca) {
        return { healthy: false, details: { error: 'MCA instance not available' } };
      }

      const status = mca.getSystemStatus();
      const isHealthy = status.status === 'operational' && 
                       status.performance.averageResponseTime < this.alertThresholds.responseTime;

      return {
        healthy: isHealthy,
        details: {
          status: status.status,
          averageResponseTime: status.performance.averageResponseTime,
          activeAgents: status.agents?.active || 0
        }
      };
    } catch (error) {
      return { healthy: false, details: { error: error.message } };
    }
  }

  /**
   * Check agent communication health
   */
  async checkAgentCommunication() {
    try {
      const comm = global.agentCommunicationFramework;
      if (!comm) {
        return { healthy: false, details: { error: 'Agent communication framework not available' } };
      }

      // Simulate communication test
      const agents = Array.from(comm.agents.keys());
      const onlineAgents = agents.filter(agentId => {
        const agent = comm.agents.get(agentId);
        return agent && agent.status === 'online' && 
               Date.now() - agent.lastHeartbeat < 60000; // Last heartbeat within 1 minute
      });

      const healthPercentage = agents.length > 0 ? onlineAgents.length / agents.length : 1;
      
      return {
        healthy: healthPercentage >= this.alertThresholds.availability,
        details: {
          totalAgents: agents.length,
          onlineAgents: onlineAgents.length,
          healthPercentage: (healthPercentage * 100).toFixed(1) + '%'
        }
      };
    } catch (error) {
      return { healthy: false, details: { error: error.message } };
    }
  }

  /**
   * Check database connectivity health
   */
  async checkDatabaseHealth() {
    try {
      const dbManager = global.databaseIntegrationManager;
      if (!dbManager) {
        return { healthy: false, details: { error: 'Database integration manager not available' } };
      }

      const health = await dbManager.getHealthStatus();
      
      const unhealthyDbs = Object.entries(health.connections)
        .filter(([name, status]) => status.status !== 'healthy');

      return {
        healthy: unhealthyDbs.length === 0,
        details: {
          totalDatabases: Object.keys(health.connections).length,
          healthyDatabases: Object.keys(health.connections).length - unhealthyDbs.length,
          unhealthyDatabases: unhealthyDbs.map(([name, status]) => ({
            name,
            error: status.error
          }))
        }
      };
    } catch (error) {
      return { healthy: false, details: { error: error.message } };
    }
  }

  /**
   * Check external APIs health
   */
  async checkExternalAPIs() {
    try {
      const apiFramework = global.externalAPIFramework;
      if (!apiFramework) {
        return { healthy: false, details: { error: 'External API framework not available' } };
      }

      const status = apiFramework.getIntegrationStatus();
      
      const totalAPIs = status.totalAPIs;
      const healthyAPIs = status.healthyAPIs;
      const healthPercentage = totalAPIs > 0 ? healthyAPIs / totalAPIs : 1;

      return {
        healthy: healthPercentage >= this.alertThresholds.availability,
        details: {
          totalAPIs,
          healthyAPIs,
          unhealthyAPIs: status.unhealthyAPIs,
          healthPercentage: (healthPercentage * 100).toFixed(1) + '%',
          apiStatus: Object.fromEntries(
            Object.entries(status.apis).map(([name, apiStatus]) => [
              name, 
              { 
                status: apiStatus.status, 
                successRate: apiStatus.successRate 
              }
            ])
          )
        }
      };
    } catch (error) {
      return { healthy: false, details: { error: error.message } };
    }
  }

  /**
   * Check event bus health
   */
  async checkEventBusHealth() {
    try {
      const eventBus = global.eventBusSystem;
      if (!eventBus) {
        return { healthy: false, details: { error: 'Event bus system not available' } };
      }

      const status = eventBus.getEventBusStatus();
      
      // Calculate error rate
      const errorRate = status.metrics.totalEvents > 0 ? 
        status.metrics.failedEvents / status.metrics.totalEvents : 0;

      const isHealthy = status.status === 'operational' && 
                       errorRate < this.alertThresholds.errorRate;

      return {
        healthy: isHealthy,
        details: {
          status: status.status,
          totalEvents: status.metrics.totalEvents,
          successfulEvents: status.metrics.processedEvents,
          failedEvents: status.metrics.failedEvents,
          errorRate: (errorRate * 100).toFixed(2) + '%',
          activeSubscriptions: status.subscriptions.total,
          queueSizes: status.queues
        }
      };
    } catch (error) {
      return { healthy: false, details: { error: error.message } };
    }
  }

  /**
   * Check for alerts based on health report
   */
  async checkForAlerts(healthReport) {
    const alerts = [];

    // Check overall system health
    if (healthReport.overallStatus === 'unhealthy') {
      alerts.push({
        severity: 'critical',
        message: 'System integration health is unhealthy',
        details: healthReport.summary
      });
    } else if (healthReport.overallStatus === 'degraded') {
      alerts.push({
        severity: 'warning',
        message: 'System integration health is degraded',
        details: healthReport.summary
      });
    }

    // Check individual integrations
    for (const [name, integration] of Object.entries(healthReport.integrations)) {
      if (integration.status === 'unhealthy') {
        alerts.push({
          severity: 'critical',
          message: `Integration ${name} is unhealthy`,
          details: integration
        });
      }

      if (integration.consecutiveFailures >= 3) {
        alerts.push({
          severity: 'warning',
          message: `Integration ${name} has ${integration.consecutiveFailures} consecutive failures`,
          details: integration
        });
      }

      if (integration.responseTime > this.alertThresholds.responseTime) {
        alerts.push({
          severity: 'warning',
          message: `Integration ${name} response time (${integration.responseTime}ms) exceeds threshold`,
          details: integration
        });
      }
    }

    // Send alerts if any
    if (alerts.length > 0) {
      await this.sendAlerts(alerts);
    }
  }

  /**
   * Send alerts to monitoring systems
   */
  async sendAlerts(alerts) {
    for (const alert of alerts) {
      console.log(`🚨 ${alert.severity.toUpperCase()}: ${alert.message}`);
      
      // Here you would integrate with your alerting system
      // Examples: PagerDuty, Slack, email, etc.
      
      // For now, emit an event
      if (global.eventBusSystem) {
        await global.eventBusSystem.publishEvent('integration.alert', {
          severity: alert.severity,
          message: alert.message,
          details: alert.details,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Start continuous monitoring
   */
  startContinuousMonitoring() {
    setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        console.error('❌ Continuous health monitoring failed:', error);
      }
    }, this.monitoringInterval);

    console.log(`🔄 Continuous monitoring started (interval: ${this.monitoringInterval / 1000}s)`);
  }

  /**
   * Get health history and trends
   */
  getHealthHistory(hours = 24) {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
    
    return {
      history: this.healthHistory.filter(report => 
        new Date(report.timestamp).getTime() > cutoffTime
      ),
      trends: this.calculateHealthTrends(hours),
      currentStatus: this.healthHistory.length > 0 ? 
        this.healthHistory[this.healthHistory.length - 1] : null
    };
  }

  /**
   * Calculate health trends
   */
  calculateHealthTrends(hours) {
    const recentReports = this.healthHistory.filter(report => 
      new Date(report.timestamp).getTime() > Date.now() - hours * 60 * 60 * 1000
    );

    if (recentReports.length === 0) return {};

    const trends = {};
    
    for (const integrationName of this.healthChecks.keys()) {
      const integrationData = recentReports.map(report => 
        report.integrations[integrationName]
      ).filter(Boolean);

      if (integrationData.length === 0) continue;

      const healthyCount = integrationData.filter(data => data.status === 'healthy').length;
      const averageResponseTime = integrationData.reduce((sum, data) => 
        sum + (data.responseTime || 0), 0) / integrationData.length;

      trends[integrationName] = {
        availabilityPercentage: (healthyCount / integrationData.length * 100).toFixed(2) + '%',
        averageResponseTime: Math.round(averageResponseTime),
        totalChecks: integrationData.length,
        healthyChecks: healthyCount
      };
    }

    return trends;
  }
}

module.exports = { IntegrationHealthMonitor };
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Agent Architecture](Agent-Architecture.md)** - Multi-agent system design
- **[Security Overview](../04-Security/Security-Overview.md)** - Security requirements and policies
- **[Network Architecture & Security](../06-Infrastructure/Network-Architecture-Security.md)** - Network topology and security
- **[API Documentation](../03-Interfaces/API-Documentation.md)** - API design and contracts

### **Follow-up Documents**
- **[Deployment Architecture](Deployment-Architecture.md)** - Deployment strategies and environments
- **[Monitoring & Observability](Monitoring-Observability.md)** - System monitoring and observability

### **Operations Context**
- **[Container Orchestration](../05-DevOps/Container-Orchestration.md)** - Kubernetes integration
- **[CI/CD Pipeline](../05-DevOps/CI-CD-Pipeline.md)** - Continuous integration and deployment

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | Architecture Team | Complete integration architecture implementation |
| 4.x | 2025-08-xx | Integration Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: Architecture Team  
**Last Validated**: 2025-09-02