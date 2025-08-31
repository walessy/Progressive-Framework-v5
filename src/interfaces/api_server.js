// Enhanced API Server with Agent Collaboration
// src/interfaces/api_server.js

const express = require('express');
const cors = require('cors');
const AgentRegistry = require('../core/agent_registry');
const NutritionAgent = require('../agents/nutrition_agent');
const WorkoutAgent = require('../agents/workout_agent');
const AgentCollaborationSystem = require('../core/agent_collaboration');
const ConversationManager = require('../core/conversation_manager');
const MasterControlAgent = require('../core/master_control_agent');

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

        // Initialize Master Control Agent (MCA)
        this.masterControlAgent = new MasterControlAgent(
            this.agentRegistry,
            this.conversationManager,
            this.collaborationSystem
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

        // Enhanced chat endpoint with MCA orchestration
        this.app.post('/chat', async (req, res) => {
            try {
                const { message, agentType } = req.body;
        
                if (!message) {
                    return res.status(400).json({ error: 'Message is required' });
                }

                // Route through Master Control Agent for intelligent orchestration
                console.log('🧠 Routing through Master Control Agent...');
                const mcaResponse = await this.masterControlAgent.intelligentRouting(
                    message, 
                    { 
                        ip: req.ip, 
                        userAgent: req.get('User-Agent'),
                        explicitAgentType: agentType,
                        timestamp: new Date().toISOString()
                    }
                );

                res.json(mcaResponse);

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

        // MCA-specific endpoints
        this.app.get('/mca/status', (req, res) => {
            const mcaInfo = this.masterControlAgent.getInfo();
            const mcaStatus = this.masterControlAgent.getSystemStatus();
      
            res.json({
                mca_info: mcaInfo,
                system_status: mcaStatus,
                orchestration_capabilities: {
                    intelligent_routing: true,
                    load_balancing: true,
                    collaboration_orchestration: true,
                    system_optimization: true,
                    performance_monitoring: true
                }
            });
        });

        this.app.get('/mca/metrics', (req, res) => {
            const metrics = this.masterControlAgent.systemMetrics;
            res.json({
                system_metrics: metrics,
                load_balancer: {
                    system_load: this.masterControlAgent.getSystemLoad(),
                    agent_queues: Array.from(this.masterControlAgent.loadBalancer.agentQueues.entries()).map(
                        ([agentId, queue]) => ({
                            agent_id: agentId,
                            queue_length: queue.length,
                            recent_requests: queue.slice(-5)
                        })
                    )
                }
            });
        });

        this.app.post('/mca/optimize', async (req, res) => {
            try {
                const { reason = 'manual_trigger' } = req.body;
                const optimization = await this.masterControlAgent.triggerSystemOptimization(reason);
        
                res.json({
                    message: 'System optimization triggered',
                    optimization_id: optimization.id,
                    reason: reason,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // System status with MCA orchestration metrics
        this.app.get('/system/status', (req, res) => {
            const agents = this.agentRegistry.getAllAgents();
            const collaborationStats = this.collaborationSystem.getCollaborationHistory().stats;
            const mcaStatus = this.masterControlAgent.getSystemStatus();
      
            const status = {
                totalAgents: agents.length,
                activeAgents: agents.filter(a => a.status === 'active').length,
                agentTypes: {},
                masterControlAgent: {
                    enabled: true,
                    id: this.masterControlAgent.id,
                    system_health: mcaStatus.system_health,
                    total_requests: mcaStatus.total_requests,
                    success_rate: mcaStatus.success_rate,
                    average_response_time: mcaStatus.average_response_time,
                    system_load: mcaStatus.system_load,
                    last_optimization: mcaStatus.last_optimization
                },
                collaborationSystem: {
                    enabled: true,
                    activeCollaborations: collaborationStats.activeCollaborations,
                    totalCollaborations: collaborationStats.totalCollaborations,
                    averageParticipants: collaborationStats.averageParticipants,
                    mostCommonType: collaborationStats.mostCommonType,
                    orchestrated_by_mca: mcaStatus.collaborations_orchestrated
                },
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
                version: '5.0.0-mca-orchestration'
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
            console.log('🚀 Progressive Framework V5 - Master Control Agent Orchestration');
            console.log(`   Running on port ${this.port}`);
            console.log('   🧠 Master Control Agent: ENABLED');
            console.log('   🤖 Multi-Agent Intelligence: ENABLED');
            console.log('   🤝 Agent Collaboration: ENABLED');  
            console.log('   💬 Conversation Persistence: ENABLED');
            console.log('   ⚖️ Load Balancing: ENABLED');
            console.log('   📊 System Optimization: ENABLED');
            console.log('');
            console.log('📡 Available endpoints:');
            console.log(`   🏥 Health: http://localhost:${this.port}/health`);
            console.log(`   🤖 Agents: http://localhost:${this.port}/agents`);
            console.log(`   🧠 MCA Chat: POST http://localhost:${this.port}/chat`);
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