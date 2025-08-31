// Progressive Framework V5 Server with Emergency Response System
// Location: C:\Projects\Progressive-Framework-v5\server.js

const express = require('express');
const cors = require('cors');
const MasterControlAgent = require('./src/agents/MasterControlAgent');

// Import emergency routes
const createEmergencyRoutes = require('./src/api/emergencyRoutes');

class ProgressiveFrameworkServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.mca = null;
        this.server = null;
        
        this.init();
    }

    async init() {
        try {
            // Initialize Master Control Agent with Emergency System
            console.log('🧠 Initializing Master Control Agent with Emergency Response...');
            this.mca = new MasterControlAgent();
            
            // Initialize MCA (async components)
            await this.mca.init();
            
            // Setup Express middleware
            this.setupMiddleware();
            
            // Setup routes
            this.setupRoutes();
            
            // Setup emergency-specific routes
            this.setupEmergencyRoutes();
            
            // Setup error handling
            this.setupErrorHandling();
            
            console.log('✅ Progressive Framework V5 server initialized successfully');
            
        } catch (error) {
            console.error('❌ Server initialization failed:', error);
            throw error;
        }
    }

    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
        
        // Request logging with emergency context
        this.app.use((req, res, next) => {
            req.timestamp = Date.now();
            req.requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            console.log(`📨 ${req.method} ${req.path} [${req.requestId}]`);
            next();
        });
    }

    setupRoutes() {
        // ========================================
        // ROOT ENDPOINT
        // ========================================
        
        this.app.get('/', (req, res) => {
            res.json({
                success: true,
                message: 'Progressive Framework V5 with Emergency Response System',
                version: '5.0.0',
                features: [
                    'Multi-Agent Intelligence System',
                    'Emergency Response & Circuit Breakers', 
                    'System Rollback Capabilities',
                    'Real-time Health Monitoring',
                    'Enterprise-Grade Reliability'
                ],
                endpoints: {
                    main_chat: 'POST /chat',
                    agent_chat: 'POST /chat/:agentType',
                    agents_list: 'GET /agents',
                    system_status: 'GET /mca/status',
                    system_metrics: 'GET /mca/metrics',
                    emergency_system: 'GET /emergency/*'
                },
                timestamp: new Date().toISOString()
            });
        });

        // ========================================
        // MAIN CHAT ENDPOINTS (Enhanced with Emergency Protection)
        // ========================================
        
        // Main chat endpoint with emergency protection
        this.app.post('/chat', async (req, res) => {
            try {
                // Check system health before processing
                const systemHealth = await this.mca.getSystemHealth();
                
                if (systemHealth.overall === 'frozen') {
                    return res.status(503).json({
                        success: false,
                        error: 'System temporarily frozen',
                        message: 'Emergency response system has frozen the system. Please try again shortly.',
                        system_status: systemHealth,
                        retry_after: 30,
                        timestamp: new Date().toISOString()
                    });
                }

                const result = await this.mca.processRequest({
                    message: req.body.message,
                    requestId: req.requestId,
                    timestamp: req.timestamp,
                    endpoint: 'chat'
                });
                
                res.json({
                    success: true,
                    data: result,
                    request_id: req.requestId,
                    system_health: systemHealth.overall,
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                console.error(`❌ Chat request failed [${req.requestId}]:`, error);
                
                // Emergency system will handle the error automatically through MCA
                res.status(500).json({
                    success: false,
                    error: 'Request processing failed',
                    message: error.fallbackReason || 'An error occurred while processing your request',
                    request_id: req.requestId,
                    emergency_handled: true,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Agent-specific endpoints with circuit breaker protection
        this.app.post('/chat/:agentType', async (req, res) => {
            try {
                const { agentType } = req.params;
                
                // Check if circuit breaker is open for this agent
                const circuitStatus = this.mca.getCircuitBreakerStatus();
                
                if (circuitStatus[agentType] && !circuitStatus[agentType].healthy) {
                    return res.status(503).json({
                        success: false,
                        error: 'Agent temporarily unavailable',
                        message: `${agentType} agent is currently unavailable due to circuit breaker protection`,
                        circuit_breaker: circuitStatus[agentType],
                        fallback_available: true,
                        alternative_endpoint: '/chat',
                        timestamp: new Date().toISOString()
                    });
                }

                const result = await this.mca.processRequest({
                    message: req.body.message,
                    forceAgent: agentType,
                    requestId: req.requestId,
                    timestamp: req.timestamp,
                    endpoint: `chat/${agentType}`
                });
                
                res.json({
                    success: true,
                    data: result,
                    agent: agentType,
                    request_id: req.requestId,
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                console.error(`❌ Agent ${req.params.agentType} request failed [${req.requestId}]:`, error);
                
                res.status(500).json({
                    success: false,
                    error: 'Agent request failed',
                    message: error.message,
                    agent: req.params.agentType,
                    request_id: req.requestId,
                    fallback_available: true,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // ========================================
        // SYSTEM INFORMATION ENDPOINTS
        // ========================================

        // Enhanced agents list endpoint
        this.app.get('/agents', async (req, res) => {
            try {
                const agents = this.mca.getAgentsList();
                const circuitStatus = this.mca.getCircuitBreakerStatus();
                
                // Enhance agent info with health status
                const enhancedAgents = agents.map(agent => ({
                    ...agent,
                    health_status: circuitStatus[agent.type] ? 
                        (circuitStatus[agent.type].healthy ? 'healthy' : 'unhealthy') : 'unknown',
                    circuit_breaker: circuitStatus[agent.type] || null
                }));
                
                res.json({
                    success: true,
                    data: {
                        agents: enhancedAgents,
                        total_count: enhancedAgents.length,
                        healthy_count: enhancedAgents.filter(a => a.health_status === 'healthy').length,
                        emergency_protection: true
                    },
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve agents',
                    message: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Enhanced MCA status endpoint
        this.app.get('/mca/status', async (req, res) => {
            try {
                const status = await this.mca.getSystemHealth();
                
                res.json({
                    success: true,
                    data: status,
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get MCA status',
                    message: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Enhanced metrics endpoint
        this.app.get('/mca/metrics', async (req, res) => {
            try {
                const metrics = this.mca.getEnhancedMetrics();
                
                res.json({
                    success: true,
                    data: metrics,
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve metrics',
                    message: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    setupEmergencyRoutes() {
        // ========================================
        // EMERGENCY RESPONSE SYSTEM ROUTES
        // ========================================
        
        const emergencyRouter = createEmergencyRoutes(this.mca);
        this.app.use('/emergency', emergencyRouter);
        
        console.log('🚨 Emergency Response API endpoints registered:');
        console.log('   GET  /emergency/status         - Overall emergency system status');
        console.log('   GET  /emergency/health         - Comprehensive health check');
        console.log('   GET  /emergency/metrics        - Enhanced metrics with emergency data');
        console.log('   GET  /emergency/incidents      - Active incidents');
        console.log('   GET  /emergency/circuit-breakers - Circuit breaker status');
        console.log('   POST /emergency/circuit-breakers/:agent/reset - Reset circuit breaker');
        console.log('   POST /emergency/rollback       - Trigger system rollback');
        console.log('   GET  /emergency/rollback/history - Rollback history');
        console.log('   POST /emergency/test/error     - Test error handling');
        console.log('   POST /emergency/test/circuit-breaker - Test circuit breaker');
        console.log('   POST /emergency/system/freeze  - Freeze system');
        console.log('   POST /emergency/system/unfreeze - Unfreeze system');
    }

    setupErrorHandling() {
        // Global error handler with emergency system integration
        this.app.use(async (error, req, res, next) => {
            console.error(`🚨 Global error handler triggered [${req.requestId || 'unknown'}]:`, error);
            
            try {
                // Handle error through emergency system
                if (this.mca && this.mca.emergencyInterface) {
                    const errorContext = {
                        requestId: req.requestId,
                        endpoint: req.path,
                        method: req.method,
                        timestamp: req.timestamp,
                        userAgent: req.get('User-Agent'),
                        global: true
                    };
                    
                    await this.mca.emergencyInterface.handleError(error, errorContext);
                }
                
                res.status(500).json({
                    success: false,
                    error: 'Internal server error',
                    message: 'An unexpected error occurred',
                    request_id: req.requestId,
                    emergency_handled: true,
                    timestamp: new Date().toISOString()
                });
                
            } catch (emergencyError) {
                console.error('Emergency system failed to handle error:', emergencyError);
                
                // Fallback response
                res.status(500).json({
                    success: false,
                    error: 'Critical system error',
                    message: 'Multiple system failures detected',
                    request_id: req.requestId,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                error: 'Endpoint not found',
                message: `The endpoint ${req.method} ${req.path} does not exist`,
                available_endpoints: {
                    main_chat: 'POST /chat',
                    agent_chat: 'POST /chat/:agentType (NPA, WPA, MCA)',
                    agents_list: 'GET /agents',
                    system_status: 'GET /mca/status',
                    system_metrics: 'GET /mca/metrics',
                    emergency_system: 'GET /emergency/*'
                },
                request_id: req.requestId,
                timestamp: new Date().toISOString()
            });
        });
    }

    async start() {
        try {
            this.server = this.app.listen(this.port, () => {
                console.log('🚀 Progressive Framework V5 Server Started Successfully!');
                console.log('════════════════════════════════════════════════════════════');
                console.log(`🌐 Server URL: http://localhost:${this.port}`);
                console.log(`🧠 Master Control Agent: ACTIVE with Emergency Response`);
                console.log(`🚨 Emergency System: ACTIVE`);
                console.log(`🔌 Circuit Breakers: ACTIVE`);
                console.log(`🔄 System Rollback: ENABLED`);
                console.log(`❤️ Health Monitoring: ACTIVE`);
                console.log('');
                console.log('📡 Core API Endpoints:');
                console.log('   Main Chat:     POST /chat');
                console.log('   Agent Chat:    POST /chat/:agentType');
                console.log('   Agents List:   GET /agents');
                console.log('   System Status: GET /mca/status');
                console.log('   System Metrics: GET /mca/metrics');
                console.log('');
                console.log('🚨 Emergency API Endpoints:');
                console.log('   Emergency Status: GET /emergency/status');
                console.log('   System Health:    GET /emergency/health');
                console.log('   Circuit Breakers: GET /emergency/circuit-breakers');
                console.log('   Test System:      POST /emergency/test/error');
                console.log('   More endpoints:   GET /emergency/*');
                console.log('');
                console.log('🔥 Ready for production traffic with enterprise-level reliability!');
                console.log('════════════════════════════════════════════════════════════');
            });

            // Graceful shutdown handling
            process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
            process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
            
        } catch (error) {
            console.error('❌ Server startup failed:', error);
            throw error;
        }
    }

    async gracefulShutdown(signal) {
        console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
        
        if (this.server) {
            this.server.close(() => {
                console.log('✅ HTTP server closed');
                
                // Cleanup emergency system
                if (this.mca && this.mca.emergencySystem) {
                    console.log('🚨 Shutting down emergency response system...');
                    // Add cleanup logic here if needed
                }
                
                console.log('👋 Progressive Framework V5 shutdown complete');
                process.exit(0);
            });
        }
    }
}

// Start server if this file is run directly
if (require.main === module) {
    const server = new ProgressiveFrameworkServer();
    server.start().catch(error => {
        console.error('💥 Server failed to start:', error);
        process.exit(1);
    });
}

module.exports = ProgressiveFrameworkServer;