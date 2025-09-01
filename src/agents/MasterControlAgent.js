// Master Control Agent with Emergency Response System Integration
// Location: C:\Projects\Progressive-Framework-v5\src\agents\MasterControlAgent.js

const EmergencyResponseSystem = require('../emergency/EmergencyResponseSystem');

class MasterControlAgent {
    constructor() {
        // Core MCA properties
        this.agents = new Map();
        this.routingLogic = this.initializeRouting();
        this.metrics = this.initializeMetrics();
        
        // Emergency Response System integration
        this.emergencySystem = new EmergencyResponseSystem();
        this.emergencyInterface = null;
        
        // Enhanced error tracking
        this.errorHistory = [];
        this.systemHealth = 'healthy';
        
        // Initialize synchronously for immediate availability
        this.initializeAgents();npm testcls
        this.emergencyInterface = this.emergencySystem.getEmergencyInterface();
        this.setupEmergencyHandlers();
    }

    async init() {
        try {
            // Initialize emergency system fully (async components)
            await this.emergencySystem.init();
            
            console.log('🧠 MCA initialized with Emergency Response System');
            return true;
            
        } catch (error) {
            console.error('MCA initialization failed:', error);
            // Don't throw - allow system to continue with basic emergency features
            return false;
        }
    }

    setupEmergencyHandlers() {
        this.emergencySystem.on('circuit:opened', (data) => {
            console.log(`⚠️ Circuit opened for agent: ${data.agent}`);
            this.handleCircuitOpen(data.agent, data.error);
        });

        this.emergencySystem.on('system:freeze', () => {
            console.log('🧊 System freeze initiated - stopping new requests');
            this.systemHealth = 'frozen';
        });

        this.emergencySystem.on('system:resume', () => {
            console.log('▶️ System resumed - accepting new requests');
            this.systemHealth = 'healthy';
        });

        this.emergencySystem.on('incident:created', (incident) => {
            console.log(`📋 Emergency incident: ${incident.id} [${incident.classification.severity}]`);
            this.handleIncidentCreated(incident);
        });

        this.emergencySystem.on('rollback:success', (data) => {
            console.log(`✅ System rollback successful: ${data.rollbackId}`);
            this.systemHealth = 'healthy';
        });
    }

    initializeRouting() {
        return {
            version: '5.0.0',
            strategy: 'keyword_analysis',
            fallbackEnabled: true,
            collaborationEnabled: true,
            circuitBreakerEnabled: true
        };
    }

    initializeMetrics() {
        return {
            totalRequests: 0,
            successfulRequests: 0,
            totalErrors: 0,
            totalResponseTime: 0,
            averageResponseTime: 0,
            lastRequestTime: null,
            systemStartTime: Date.now(),
            collaborationsAttempted: 0,
            collaborationsSuccessful: 0,
            incidents: []
        };
    }

    initializeAgents() {
        // Register agents with their capabilities
        this.agents.set('MCA', {
            name: 'Master Control Agent',
            type: 'MCA',
            capabilities: ['coordination', 'routing', 'emergency'],
            specialties: ['system_management', 'agent_coordination'],
            status: 'active'
        });

        this.agents.set('NPA', {
            name: 'Nutrition Planning Agent',
            type: 'NPA',
            capabilities: ['nutrition', 'meal_planning', 'dietary_advice'],
            specialties: ['nutrition_facts', 'meal_plans', 'dietary_restrictions'],
            status: 'active'
        });

        this.agents.set('WPA', {
            name: 'Workout Planning Agent', 
            type: 'WPA',
            capabilities: ['fitness', 'exercise', 'workout_plans'],
            specialties: ['exercise_routines', 'fitness_goals', 'training_programs'],
            status: 'active'
        });

        console.log('🤖 Agents initialized:', Array.from(this.agents.keys()));
    }

    // Enhanced processRequest with emergency protection
    async processRequest(requestData) {
        const startTime = Date.now();
        let analysis = null;
        
        try {
            // Check system health before processing
            if (this.systemHealth === 'frozen') {
                throw new Error('System is frozen due to emergency response');
            }

            // Analyze request (existing logic)
            analysis = this.analyzeRequest(requestData.message, requestData.forceAgent);
            
            // Update request metrics
            this.metrics.totalRequests++;
            this.metrics.lastRequestTime = startTime;
            
            // Route with circuit breaker protection
            const result = await this.routeWithProtection(analysis, requestData);
            
            // Update success metrics
            this.updateSuccessMetrics(startTime);
            
            return result;
            
        } catch (error) {
            // Handle errors through emergency system
            const errorContext = {
                requestData,
                analysis: analysis || null,
                processingTime: Date.now() - startTime,
                systemState: this.systemHealth,
                endpoint: requestData.endpoint || 'chat'
            };
            
            // Update error metrics
            this.metrics.totalErrors++;
            
            try {
                const emergencyResult = await this.emergencyInterface.handleError(error, errorContext);
                
                // Provide fallback response if emergency system handled the error
                if (emergencyResult.success) {
                    return this.generateFallbackResponse(requestData, error, emergencyResult);
                }
            } catch (emergencyError) {
                console.error('Emergency system failed to handle error:', emergencyError);
            }
            
            // Final fallback if everything fails
            return this.generateBasicFallbackResponse(requestData, error);
        }
    }

    analyzeRequest(message, forceAgent = null) {
        const analysis = {
            originalMessage: message,
            keywords: this.extractKeywords(message),
            domains: [],
            complexity: this.calculateComplexity(message),
            selectedAgent: forceAgent || null,
            confidence: 0,
            requiresCollaboration: false,
            timestamp: Date.now()
        };

        // If agent is forced, use it directly
        if (forceAgent && this.agents.has(forceAgent)) {
            analysis.selectedAgent = forceAgent;
            analysis.confidence = 1.0;
            return analysis;
        }

        // Domain scoring
        const domainScores = this.calculateDomainScores(analysis.keywords);
        analysis.domains = Object.entries(domainScores)
            .sort(([,a], [,b]) => b - a)
            .map(([domain, score]) => ({ domain, score }));

        // Agent selection based on highest domain score
        if (analysis.domains.length > 0) {
            const topDomain = analysis.domains[0];
            analysis.confidence = topDomain.score;
            
            if (topDomain.domain === 'nutrition' && topDomain.score > 0.3) {
                analysis.selectedAgent = 'NPA';
            } else if (topDomain.domain === 'fitness' && topDomain.score > 0.3) {
                analysis.selectedAgent = 'WPA';
            } else {
                analysis.selectedAgent = 'MCA'; // Default to MCA for general queries
            }
        } else {
            analysis.selectedAgent = 'MCA'; // Default fallback
        }

        // Check if collaboration might be beneficial
        if (analysis.domains.length > 1 && analysis.domains[1].score > 0.2) {
            analysis.requiresCollaboration = true;
        }

        return analysis;
    }

    extractKeywords(message) {
        return message.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2);
    }

    calculateComplexity(message) {
        const factors = {
            length: message.length > 100 ? 0.3 : 0.1,
            questions: (message.match(/\?/g) || []).length * 0.2,
            keywords: this.extractKeywords(message).length * 0.1
        };
        
        return Math.min(Object.values(factors).reduce((a, b) => a + b, 0), 1.0);
    }

    calculateDomainScores(keywords) {
        const domainKeywords = {
            nutrition: ['nutrition', 'food', 'eat', 'meal', 'diet', 'protein', 'carb', 'vitamin', 'calories', 'healthy', 'recipe'],
            fitness: ['workout', 'exercise', 'fitness', 'muscle', 'strength', 'cardio', 'training', 'gym', 'weight', 'running']
        };

        const scores = {};
        
        for (const [domain, domainWords] of Object.entries(domainKeywords)) {
            let score = 0;
            for (const keyword of keywords) {
                for (const domainWord of domainWords) {
                    if (keyword.includes(domainWord) || domainWord.includes(keyword)) {
                        score += keyword === domainWord ? 1.0 : 0.5;
                    }
                }
            }
            scores[domain] = Math.min(score / keywords.length, 1.0);
        }

        return scores;
    }

    async routeWithProtection(analysis, requestData) {
        const selectedAgent = analysis.selectedAgent;
        
        try {
            // Execute agent operation with circuit breaker protection
            return await this.emergencyInterface.executeWithCircuitBreaker(
                selectedAgent,
                this.executeAgentRequest.bind(this),
                selectedAgent,
                requestData,
                analysis
            );
            
        } catch (error) {
            // If circuit breaker trips, try fallback strategies
            console.log(`⚠️ Agent ${selectedAgent} failed, trying fallback...`);
            
            return await this.executeFallbackStrategy(analysis, requestData, error);
        }
    }

    async executeAgentRequest(agentType, requestData, analysis) {
        // Simulate agent processing with potential for controlled failures
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 10)); // 10-60ms

        // Handle different agent types
        switch (agentType) {
        case 'NPA':
            return this.handleNutritionRequest(requestData, analysis);
        case 'WPA':
            return this.handleWorkoutRequest(requestData, analysis);
        case 'MCA':
            return this.handleGeneralRequest(requestData, analysis);
        default:
            throw new Error(`Unknown agent type: ${agentType}`);
        }
    }

    handleNutritionRequest(requestData, analysis) {
        const nutritionResponses = [
            'For optimal nutrition, focus on whole foods including lean proteins, complex carbohydrates, and plenty of vegetables.',
            'A balanced meal should include protein (25%), healthy carbs (50%), and vegetables (25%) with some healthy fats.',
            'Stay hydrated and aim for 5-7 servings of fruits and vegetables daily for optimal micronutrient intake.',
            'Consider timing your meals around your activity level - more carbs around workouts, protein throughout the day.'
        ];

        return {
            success: true,
            agent: 'NPA',
            message: nutritionResponses[Math.floor(Math.random() * nutritionResponses.length)],
            confidence: analysis.confidence,
            processingTime: Date.now() - requestData.timestamp,
            data: {
                domain: 'nutrition',
                keywords: analysis.keywords.join(', '),
                analysis: analysis
            }
        };
    }

    handleWorkoutRequest(requestData, analysis) {
        const workoutResponses = [
            'For effective workouts, combine strength training 3x/week with cardiovascular exercise 2-3x/week.',
            'Progressive overload is key - gradually increase weight, reps, or intensity over time.',
            'Focus on compound movements like squats, deadlifts, and push-ups for maximum efficiency.',
            'Allow 48-72 hours between training the same muscle groups for optimal recovery.'
        ];

        return {
            success: true,
            agent: 'WPA',
            message: workoutResponses[Math.floor(Math.random() * workoutResponses.length)],
            confidence: analysis.confidence,
            processingTime: Date.now() - requestData.timestamp,
            data: {
                domain: 'fitness',
                keywords: analysis.keywords.join(', '),
                analysis: analysis
            }
        };
    }

    handleGeneralRequest(requestData, analysis) {
        return {
            success: true,
            agent: 'MCA',
            message: `I can help you with nutrition and fitness questions. Your query about "${requestData.message}" seems to be ${analysis.domains[0]?.domain || 'general'} related. Feel free to ask me anything about healthy eating or exercise!`,
            confidence: analysis.confidence,
            processingTime: Date.now() - requestData.timestamp,
            data: {
                domain: 'general',
                keywords: analysis.keywords.join(', '),
                analysis: analysis
            }
        };
    }

    async executeFallbackStrategy(analysis, requestData, originalError) {
        // Strategy 1: Try alternative agent if available
        const alternativeAgents = this.findAlternativeAgents(analysis);
        
        for (const altAgent of alternativeAgents) {
            try {
                return await this.emergencyInterface.executeWithCircuitBreaker(
                    altAgent,
                    this.executeAgentRequest.bind(this),
                    altAgent,
                    requestData,
                    { ...analysis, selectedAgent: altAgent }
                );
            } catch (altError) {
                console.log(`⚠️ Alternative agent ${altAgent} also failed`);
                continue;
            }
        }

        // Strategy 2: Provide degraded service response
        return this.generateDegradedResponse(requestData, originalError);
    }

    findAlternativeAgents(analysis) {
        const alternatives = [];
        
        // If nutrition query failed, try workout agent as backup (they overlap)
        if (analysis.selectedAgent === 'NPA') {
            alternatives.push('WPA');
        } else if (analysis.selectedAgent === 'WPA') {
            alternatives.push('NPA');
        }
        
        // MCA can always provide basic responses
        if (analysis.selectedAgent !== 'MCA') {
            alternatives.push('MCA');
        }
        
        return alternatives;
    }

    generateFallbackResponse(requestData, error, emergencyResult) {
        return {
            success: true,
            message: `I encountered a temporary issue but recovered automatically. Here's what I can help with based on your request: "${requestData.message}"`,
            fallbackReason: error.message,
            emergencyHandled: true,
            emergencyId: emergencyResult.incidentId,
            data: {
                suggestions: this.generateBasicSuggestions(requestData.message),
                timestamp: new Date().toISOString(),
                responseTime: `${Date.now() - (requestData.timestamp || Date.now())}ms`
            }
        };
    }

    generateDegradedResponse(requestData, error) {
        return {
            success: true,
            message: `I'm running in safe mode due to system issues. I can still provide basic assistance for: "${requestData.message}"`,
            degradedMode: true,
            originalError: error.message,
            data: {
                basicResponse: this.generateBasicResponse(requestData.message),
                suggestions: [
                    'Try asking a simpler question',
                    'Check back in a few minutes when systems recover',
                    'Contact support if this continues'
                ],
                timestamp: new Date().toISOString()
            }
        };
    }

    generateBasicFallbackResponse(requestData, error) {
        return {
            success: false,
            message: 'I\'m experiencing technical difficulties. Please try again shortly.',
            error: error.message,
            fallback: true,
            data: {
                timestamp: new Date().toISOString(),
                requestId: requestData.requestId
            }
        };
    }

    // System health and emergency management
    async getSystemHealth() {
        const health = this.emergencyInterface.getSystemHealth() || { overall: 'unknown' };
        const incidents = this.emergencyInterface.getActiveIncidents();
        
        return {
            overall: this.systemHealth,
            emergencySystem: health,
            activeIncidents: incidents.length,
            circuitBreakers: this.getCircuitBreakerStatus(),
            uptime: process.uptime(),
            metrics: this.getBasicMetrics(),
            timestamp: new Date().toISOString()
        };
    }

    getCircuitBreakerStatus() {
        const status = {};
        for (const [agent, breaker] of this.emergencySystem.circuitBreakers) {
            status[agent] = {
                state: breaker.state,
                failures: breaker.failures,
                healthy: breaker.state === 'closed'
            };
        }
        return status;
    }

    async triggerEmergencyRollback(criteria = {}) {
        console.log('🚨 Emergency rollback triggered manually');
        
        return await this.emergencyInterface.executeRollback({
            reason: 'manual_trigger',
            criteria,
            timestamp: Date.now()
        });
    }

    // Event handlers
    handleCircuitOpen(agentType, error) {
        console.log(`🔌 Circuit opened for ${agentType} - implementing recovery strategy`);
        
        // Log the failure
        this.errorHistory.push({
            agent: agentType,
            error: error.message,
            timestamp: Date.now(),
            circuitOpened: true
        });
        
        // Update system health if critical agent is down
        if (agentType === 'MCA') {
            this.systemHealth = 'critical';
        } else {
            this.systemHealth = 'degraded';
        }
    }

    handleIncidentCreated(incident) {
        // Add incident tracking to MCA metrics
        this.metrics.incidents = this.metrics.incidents || [];
        this.metrics.incidents.push({
            id: incident.id,
            severity: incident.classification.severity,
            timestamp: incident.timestamp
        });
        
        // Keep only last 100 incidents in memory
        if (this.metrics.incidents.length > 100) {
            this.metrics.incidents = this.metrics.incidents.slice(-100);
        }
    }

    updateSuccessMetrics(startTime) {
        this.metrics.successfulRequests++;
        const responseTime = Date.now() - startTime;
        this.metrics.totalResponseTime += responseTime;
        this.metrics.averageResponseTime = Math.round(
            this.metrics.totalResponseTime / this.metrics.successfulRequests
        );
    }

    getBasicMetrics() {
        return {
            total_requests: this.metrics.totalRequests,
            successful_requests: this.metrics.successfulRequests,
            total_errors: this.metrics.totalErrors,
            average_response_time: this.metrics.averageResponseTime,
            success_rate: this.metrics.totalRequests > 0 ? 
                (this.metrics.successfulRequests / this.metrics.totalRequests) : 0,
            uptime_seconds: Math.floor((Date.now() - this.metrics.systemStartTime) / 1000),
            system_health: this.systemHealth
        };
    }

    getEnhancedMetrics() {
        const baseMetrics = this.getBasicMetrics();
        const systemHealth = this.emergencyInterface.getSystemHealth() || { overall: 'unknown' };
        
        return {
            ...baseMetrics,
            emergency: {
                systemHealth: this.systemHealth,
                activeIncidents: this.emergencyInterface.getActiveIncidents().length,
                circuitBreakers: this.getCircuitBreakerStatus(),
                errorHistory: this.errorHistory.slice(-10), // Last 10 errors
                uptime: process.uptime()
            }
        };
    }

    // Agent management
    getAgentsList() {
        return Array.from(this.agents.values()).map(agent => ({
            ...agent,
            circuit_breaker_status: this.emergencySystem.circuitBreakers.get(agent.type)?.state || 'unknown'
        }));
    }

    // Utility methods for fallback responses
    generateBasicSuggestions(message) {
        const keywords = message.toLowerCase().split(' ');
        const suggestions = [];
        
        if (keywords.some(word => ['nutrition', 'meal', 'food', 'eat'].includes(word))) {
            suggestions.push('Try asking about basic nutrition principles');
            suggestions.push('Ask for simple meal ideas');
        }
        
        if (keywords.some(word => ['workout', 'exercise', 'fitness', 'train'].includes(word))) {
            suggestions.push('Try asking about basic exercises');
            suggestions.push('Ask for simple workout routines');
        }
        
        return suggestions.length > 0 ? suggestions : [
            'Ask me about nutrition or fitness basics',
            'Try a simpler version of your question'
        ];
    }

    generateBasicResponse(message) {
        // Simple keyword-based response for emergency situations
        const keywords = message.toLowerCase();
        
        if (keywords.includes('nutrition') || keywords.includes('food')) {
            return 'For nutrition basics: focus on whole foods, balanced macronutrients, and staying hydrated.';
        }
        
        if (keywords.includes('workout') || keywords.includes('exercise')) {
            return 'For fitness basics: aim for 150 minutes of moderate exercise weekly, include strength training.';
        }
        
        return 'I\'m here to help with nutrition and fitness questions. Please try rephrasing your request.';
    }
}

module.exports = MasterControlAgent;