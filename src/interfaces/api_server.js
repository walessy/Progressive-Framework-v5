const express = require('express');
const cors = require('cors');
const AgentRegistry = require('../core/agent_registry');
const BaseAgent = require('../agents/base_agent');
const NutritionAgent = require('../agents/nutrition_agent');
const WorkoutAgent = require('../agents/workout_agent');

class APIServer {
  constructor(port = 3000) {
    this.app = express();
    this.port = port;
    this.agentRegistry = new AgentRegistry();
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        activeAgents: this.agentRegistry.getActiveAgents().length
      });
    });

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({ 
        message: 'Progressive Framework V5 API', 
        version: '1.0.0',
        endpoints: ['/health', '/agents', '/chat', '/chat/:agentType', '/system/status']
      });
    });

    // Get all agents
    this.app.get('/agents', (req, res) => {
      const agents = this.agentRegistry.getAllAgents().map(agent => agent.getInfo());
      res.json(agents);
    });

    // Chat with specific agent type
    this.app.post('/chat/:agentType', async (req, res) => {
      try {
        const { message } = req.body;
        const agentType = req.params.agentType.toUpperCase();
        
        if (!message) {
          return res.status(400).json({ error: 'Message is required' });
        }

        const agents = this.agentRegistry.getAgentsByType(agentType);
        if (agents.length === 0) {
          return res.status(404).json({ error: 'No agents of type ' + agentType + ' available' });
        }

        const agent = agents[0];
        const response = await agent.processMessage({ content: message }, {});
        
        res.json(response);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Smart chat routing (auto-select best agent)
    this.app.post('/chat', async (req, res) => {
      try {
        const { message } = req.body;
        
        if (!message) {
          return res.status(400).json({ error: 'Message is required' });
        }

        // Simple keyword-based routing
        const content = message.toLowerCase();
        let selectedAgentType = 'NPA'; // Default to nutrition
        
        if (content.includes('workout') || content.includes('exercise') || 
            content.includes('fitness') || content.includes('training') ||
            content.includes('muscle') || content.includes('cardio')) {
          selectedAgentType = 'WPA';
        }

        const agents = this.agentRegistry.getAgentsByType(selectedAgentType);
        if (agents.length === 0) {
          return res.status(404).json({ error: 'No suitable agents available' });
        }

        const agent = agents[0];
        const response = await agent.processMessage({ content: message }, {});
        
        // Add routing info
        response.routing_info = {
          selected_agent_type: selectedAgentType,
          routing_reason: 'keyword_analysis'
        };
        
        res.json(response);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // System status
    this.app.get('/system/status', (req, res) => {
      const agents = this.agentRegistry.getAllAgents();
      const status = {
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === 'active').length,
        agentTypes: {},
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
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

  async start() {
    await this.agentRegistry.initialize();
    
    // Create and register initial agents
    const nutritionAgent = new NutritionAgent();
    const workoutAgent = new WorkoutAgent();
    
    this.agentRegistry.registerAgent(nutritionAgent);
    this.agentRegistry.registerAgent(workoutAgent);

    this.server = this.app.listen(this.port, () => {
      console.log('Progressive Framework V5 running on port ' + this.port);
      console.log('Health check: http://localhost:' + this.port + '/health');
      console.log('Agents endpoint: http://localhost:' + this.port + '/agents');
      console.log('Smart chat: POST http://localhost:' + this.port + '/chat');
      console.log('Agent-specific: POST http://localhost:' + this.port + '/chat/NPA or /chat/WPA');
    });

    return this.server;
  }

  async stop() {
    if (this.server) {
      this.server.close();
    }
  }
}

module.exports = APIServer;
