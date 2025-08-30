// Enhanced API Server with Agent Collaboration
// src/interfaces/api_server.js

const express = require('express');
const cors = require('cors');
const AgentRegistry = require('../core/agent_registry');
const NutritionAgent = require('../agents/nutrition_agent');
const WorkoutAgent = require('../agents/workout_agent');
const AgentCollaborationSystem = require('../core/agent_collaboration');
const ConversationManager = require('../core/conversation_manager');

class EnhancedAPIServer {
  constructor(port = 3000) {
    this.app = express();
    this.port = port;
    this.server = null;
    
    // Initialize core systems
    this.agentRegistry = new AgentRegistry();
    this.conversationManager = new ConversationManager();
    this.collaborationSystem = new AgentCollaborationSystem(
      this.agentRegistry, 
      this.conversationManager
    );

    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '5.0.0',
        features: ['multi_agent', 'intelligent_routing', 'agent_collaboration'],
        endpoints: ['/health', '/agents', '/chat', '/system/status', '/collaborations']
      });
    });

    // Enhanced chat endpoint with collaboration detection
    this.app.post('/chat', async (req, res) => {
      try {
        const { message, agentType } = req.body;
        
        if (!message) {
          return res.status(400).json({ error: 'Message is required' });
        }

        // Step 1: Determine primary agent (via routing or explicit type)
        const primaryAgentType = agentType || this.routeToAgent(message);
        const primaryAgents = this.agentRegistry.getAgentsByType(primaryAgentType);
        
        if (primaryAgents.length === 0) {
          return res.status(404).json({ 
            error: `No agents of type ${primaryAgentType} available` 
          });
        }

        // Step 2: Check if collaboration is needed
        const collaborationNeed = this.collaborationSystem.detectCollaborationNeed(
          message, 
          primaryAgentType
        );

        if (collaborationNeed && collaborationNeed.confidence > 0.5) {
          // Multi-agent collaboration required
          console.log(`🤝 Collaboration detected: ${collaborationNeed.collaborationType}`);
          console.log(`🎯 Primary: ${collaborationNeed.primaryAgent}, Secondary: ${collaborationNeed.secondaryAgents.join(', ')}`);
          
          const collaborationResult = await this.collaborationSystem.initiateAgentCollaboration(
            collaborationNeed,
            message,
            { ip: req.ip, userAgent: req.get('User-Agent') }
          );

          // Return enhanced response with collaboration info
          res.json({
            ...collaborationResult,
            collaboration_detected: true,
            routing_info: {
              selected_agent_type: collaborationNeed.primaryAgent,
              routing_reason: 'multi_agent_collaboration',
              collaboration_type: collaborationNeed.collaborationType,
              participants: collaborationNeed.requiredAgents
            }
          });

        } else {
          // Single agent response
          const primaryAgent = primaryAgents[0];
          const response = await primaryAgent.processMessage({ content: message }, {});
          
          res.json({
            ...response,
            collaboration_detected: false,
            routing_info: {
              selected_agent_type: primaryAgentType,
              routing_reason: agentType ? 'explicit_agent_type' : 'keyword_analysis'
            }
          });
        }

      } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Direct agent chat (bypasses collaboration)
    this.app.post('/chat/:agentType', async (req, res) => {
      try {
        const { message } = req.body;
        const agentType = req.params.agentType.toUpperCase();
        
        if (!message) {
          return res.status(400).json({ error: 'Message is required' });
        }

        const agents = this.agentRegistry.getAgentsByType(agentType);
        if (agents.length === 0) {
          return res.status(404).json({ 
            error: `No agents of type ${agentType} available` 
          });
        }

        const agent = agents[0];
        const response = await agent.processMessage({ content: message }, {});
        
        res.json({
          ...response,
          collaboration_detected: false,
          routing_info: {
            selected_agent_type: agentType,
            routing_reason: 'direct_agent_access'
          }
        });

      } catch (error) {
        console.error('Direct chat error:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Get all agents
    this.app.get('/agents', (req, res) => {
      const agents = this.agentRegistry.getAllAgents().map(agent => agent.getInfo());
      res.json(agents);
    });

    // Collaboration endpoints
    this.app.get('/collaborations', (req, res) => {
      const history = this.collaborationSystem.getCollaborationHistory();
      res.json(history);
    });

    this.app.get('/collaborations/:id', (req, res) => {
      const collaborationId = req.params.id;
      const active = this.collaborationSystem.activeCollaborations.get(collaborationId);
      const completed = this.collaborationSystem.collaborationHistory.find(
        c => c.id === collaborationId
      );
      
      if (active || completed) {
        res.json(active || completed);
      } else {
        res.status(404).json({ error: 'Collaboration not found' });
      }
    });

    // System status with collaboration stats
    this.app.get('/system/status', (req, res) => {
      const agents = this.agentRegistry.getAllAgents();
      const collaborationStats = this.collaborationSystem.getCollaborationHistory().stats;
      
      const status = {
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === 'active').length,
        agentTypes: {},
        collaborationSystem: {
          enabled: true,
          activeCollaborations: collaborationStats.activeCollaborations,
          totalCollaborations: collaborationStats.totalCollaborations,
          averageParticipants: collaborationStats.averageParticipants,
          mostCommonType: collaborationStats.mostCommonType
        },
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: '5.0.0-collaboration'
      };

      agents.forEach(agent => {
        if (!status.agentTypes[agent.type]) {
          status.agentTypes[agent.type] = 0;
        }
        status.agentTypes[agent.type]++;
      });

      res.json(status);
    });
  }

  // Enhanced routing with collaboration hints
  routeToAgent(message) {
    const messageText = message.toLowerCase();
    
    // Nutrition-focused keywords
    const nutritionKeywords = [
      'meal', 'diet', 'nutrition', 'food', 'calories', 'protein', 'carbs', 'eating',
      'recipe', 'vitamins', 'supplements', 'weight loss', 'weight gain'
    ];
    
    // Fitness-focused keywords  
    const fitnessKeywords = [
      'workout', 'exercise', 'training', 'fitness', 'strength', 'cardio', 'muscle',
      'gym', 'running', 'lifting', 'routine', 'program'
    ];

    // Budget-focused keywords
    const budgetKeywords = [
      'budget', 'cost', 'cheap', 'affordable', 'money', 'price', 'expensive',
      'save', 'financial', 'economic'
    ];

    // Calculate keyword matches
    const nutritionScore = nutritionKeywords.filter(keyword => 
      messageText.includes(keyword)
    ).length;
    
    const fitnessScore = fitnessKeywords.filter(keyword => 
      messageText.includes(keyword)
    ).length;

    const budgetScore = budgetKeywords.filter(keyword =>
      messageText.includes(keyword)  
    ).length;

    // Route to highest scoring agent type
    if (fitnessScore > nutritionScore && fitnessScore > budgetScore) {
      return 'WPA';
    } else if (budgetScore > nutritionScore && budgetScore > fitnessScore) {
      return 'BMA';
    } else {
      return 'NPA'; // Default to nutrition
    }
  }

  async start() {
    await this.agentRegistry.initialize();
    await this.conversationManager.initialize();
    
    // Create and register initial agents
    const nutritionAgent = new NutritionAgent();
    const workoutAgent = new WorkoutAgent();
    
    this.agentRegistry.registerAgent(nutritionAgent);
    this.agentRegistry.registerAgent(workoutAgent);

    this.server = this.app.listen(this.port, () => {
      console.log('🚀 Progressive Framework V5 - Enhanced with Agent Collaboration');
      console.log(`   Running on port ${this.port}`);
      console.log('   🤖 Multi-Agent Intelligence: ENABLED');
      console.log('   🤝 Agent Collaboration: ENABLED');  
      console.log('   💬 Conversation Persistence: ENABLED');
      console.log('');
      console.log('📡 Available endpoints:');
      console.log(`   🏥 Health: http://localhost:${this.port}/health`);
      console.log(`   🤖 Agents: http://localhost:${this.port}/agents`);
      console.log(`   💬 Smart chat: POST http://localhost:${this.port}/chat`);
      console.log(`   🎯 Direct agent: POST http://localhost:${this.port}/chat/NPA`);
      console.log(`   🤝 Collaborations: http://localhost:${this.port}/collaborations`);
      console.log(`   📊 System status: http://localhost:${this.port}/system/status`);
    });

    return this.server;
  }

  async stop() {
    if (this.server) {
      this.server.close();
    }
  }
}

module.exports = EnhancedAPIServer;