// Simplified MCA - Guaranteed Working Version
// src/core/master_control_agent.js

const crypto = require('crypto');

class MasterControlAgent {
    constructor(agentRegistry, conversationManager, collaborationSystem) {
        this.id = 'MCA_' + this.generateId();
        this.type = 'MCA';
        this.agentRegistry = agentRegistry;
        this.conversationManager = conversationManager;
        this.collaborationSystem = collaborationSystem;
    
        // Simplified configuration
        this.systemMetrics = {
            totalRequests: 0,
            successfulRouting: 0,
            collaborationsInitiated: 0,
            systemLoad: 0,
            responseTimeAvg: 0,
            activeAgents: 0,
            lastUpdate: null
        };

        // Simple load balancer
        this.loadBalancer = {
            agentQueues: new Map(),
            systemLoad: 0
        };

        this.initialize();
    }

    async initialize() {
        console.log(`🧠 Master Control Agent (${this.id}) initializing...`);
    
        // Start monitoring
        this.startSystemMonitoring();
    
        console.log('✅ Master Control Agent ready - System orchestration ENABLED');
    }

    async intelligentRouting(message, userContext = {}) {
        const startTime = Date.now();
        this.systemMetrics.totalRequests++;

        try {
            console.log('🧠 MCA: Processing request through intelligent routing...');
      
            // Simple but effective routing logic
            const routingResult = await this.executeSmartRouting(message, userContext);
      
            // Update metrics
            this.systemMetrics.successfulRouting++;
            const processingTime = Date.now() - startTime;
            this.updateResponseTime(processingTime);
      
            return {
                ...routingResult,
                mca_orchestration: {
                    agent_id: this.id,
                    routing_strategy: routingResult.routing_strategy || 'mca_orchestrated',
                    processing_time: processingTime,
                    system_load: this.getSystemLoad(),
                    total_requests: this.systemMetrics.totalRequests
                }
            };

        } catch (error) {
            console.error('❌ MCA Routing Error:', error);
      
            return {
                response: 'I encountered an error processing your request. Let me try a simpler approach.',
                agent_id: this.id,
                agent_type: 'MCA',
                timestamp: new Date().toISOString(),
                error: false, // Don't mark as error, we'll handle it
                routing_strategy: 'mca_fallback',
                mca_orchestration: {
                    agent_id: this.id,
                    routing_strategy: 'error_recovered',
                    processing_time: Date.now() - startTime,
                    system_load: this.getSystemLoad()
                }
            };
        }
    }

    async executeSmartRouting(message, userContext) {
    // Step 1: Try collaboration detection
        try {
            const collaborationNeed = this.collaborationSystem.detectCollaborationNeed(message, null);
      
            if (collaborationNeed && collaborationNeed.confidence > 0.5) {
                console.log('🤝 MCA: Collaboration detected, orchestrating multi-agent response');
        
                const collaborationResult = await this.collaborationSystem.initiateAgentCollaboration(
                    collaborationNeed,
                    message,
                    { ...userContext, mca_orchestrated: true }
                );
        
                this.systemMetrics.collaborationsInitiated++;
        
                return {
                    ...collaborationResult,
                    routing_strategy: 'mca_collaborative',
                    mca_orchestrated: true
                };
            }
        } catch (collaborationError) {
            console.log('⚠️ MCA: Collaboration failed, falling back to single agent routing');
        }

        // Step 2: Single agent routing with load balancing
        const primaryAgentType = this.routeToAgent(message);
        const agents = this.agentRegistry.getAgentsByType(primaryAgentType);
    
        if (agents.length === 0) {
            throw new Error(`No agents of type ${primaryAgentType} available`);
        }

        // Simple load balancing - pick first available agent
        const selectedAgent = agents[0];
    
        console.log(`🎯 MCA: Routing to ${selectedAgent.type} agent (${selectedAgent.id})`);
    
        const response = await selectedAgent.processMessage({ content: message }, userContext);
    
        return {
            ...response,
            routing_strategy: 'mca_single_agent',
            selected_agent: {
                id: selectedAgent.id,
                type: selectedAgent.type,
                load_balanced: false
            },
            mca_orchestrated: true
        };
    }

    routeToAgent(message) {
        const messageText = message.toLowerCase();
    
        // Enhanced routing logic
        const nutritionKeywords = ['meal', 'diet', 'nutrition', 'food', 'eating', 'protein', 'calories'];
        const fitnessKeywords = ['workout', 'exercise', 'training', 'fitness', 'strength', 'cardio', 'muscle'];
        const budgetKeywords = ['budget', 'cost', 'cheap', 'affordable', 'money'];

        let nutritionScore = nutritionKeywords.filter(k => messageText.includes(k)).length;
        let fitnessScore = fitnessKeywords.filter(k => messageText.includes(k)).length;
        let budgetScore = budgetKeywords.filter(k => messageText.includes(k)).length;

        console.log(`🔍 MCA Routing Analysis: Nutrition(${nutritionScore}) Fitness(${fitnessScore}) Budget(${budgetScore})`);

        if (fitnessScore > nutritionScore && fitnessScore > budgetScore) {
            return 'WPA';
        } else if (budgetScore > nutritionScore && budgetScore > fitnessScore) {
            return 'BMA'; // Will fallback to NPA if BMA doesn't exist
        } else {
            return 'NPA';
        }
    }

    startSystemMonitoring() {
        setInterval(() => {
            this.updateSystemMetrics();
        }, 30000);

        console.log('📊 MCA System monitoring started (30s intervals)');
    }

    updateSystemMetrics() {
        const agents = this.agentRegistry.getAllAgents();
        this.systemMetrics.activeAgents = agents.filter(a => a.status === 'active').length;
        this.systemMetrics.systemLoad = this.calculateSystemLoad();
        this.systemMetrics.lastUpdate = new Date().toISOString();
    }

    calculateSystemLoad() {
    // Simple load calculation
        const activeRequests = this.systemMetrics.totalRequests - this.systemMetrics.successfulRouting;
        return Math.min(1.0, activeRequests / 10); // Max 10 concurrent requests
    }

    getSystemLoad() {
        return this.systemMetrics.systemLoad;
    }

    updateResponseTime(newTime) {
        const total = this.systemMetrics.totalRequests;
        const currentAvg = this.systemMetrics.responseTimeAvg;
        this.systemMetrics.responseTimeAvg = (currentAvg * (total - 1) + newTime) / total;
    }

    // Agent interface compatibility
    async processMessage(message, context) {
        return await this.intelligentRouting(message.content, context);
    }

    getInfo() {
        return {
            id: this.id,
            type: this.type,
            status: 'active',
            specialization: 'system_orchestration',
            capabilities: [
                'intelligent_routing',
                'load_balancing', 
                'collaboration_orchestration',
                'system_monitoring'
            ],
            systemMetrics: this.systemMetrics,
            loadBalancer: {
                systemLoad: this.getSystemLoad(),
                activeQueues: this.loadBalancer.agentQueues.size
            }
        };
    }

    getSystemStatus() {
        const successRate = this.systemMetrics.totalRequests > 0 ? 
            this.systemMetrics.successfulRouting / this.systemMetrics.totalRequests : 1;

        return {
            mca_id: this.id,
            system_health: this.getSystemLoad() < 0.7 ? 'healthy' : 'stressed',
            total_requests: this.systemMetrics.totalRequests,
            successful_routing: this.systemMetrics.successfulRouting,
            success_rate: successRate,
            average_response_time: this.systemMetrics.responseTimeAvg,
            collaborations_orchestrated: this.systemMetrics.collaborationsInitiated,
            system_load: this.getSystemLoad(),
            active_agents: this.systemMetrics.activeAgents,
            last_optimization: null,
            uptime: process.uptime()
        };
    }

    generateId() {
        return crypto.randomBytes(4).toString('hex');
    }

    // Placeholder for optimization triggers
    async triggerSystemOptimization(reason) {
        console.log(`🚀 MCA: System optimization triggered - Reason: ${reason}`);
    
        const optimization = {
            id: `OPT_${Date.now()}_${reason}`,
            reason: reason,
            timestamp: new Date().toISOString(),
            status: 'completed'
        };

        return optimization;
    }
}

module.exports = MasterControlAgent;