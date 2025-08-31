// Emergency Response API Routes
// Location: C:\Projects\Progressive-Framework-v5\src\api\emergencyRoutes.js

const express = require('express');
const router = express.Router();

// Emergency Response System API endpoints
module.exports = (mca) => {
    
    // ========================================
    // SYSTEM HEALTH & MONITORING
    // ========================================
    
    // GET /emergency/health - Comprehensive system health check
    router.get('/health', async (req, res) => {
        try {
            const health = await mca.getSystemHealth();
            
            res.json({
                success: true,
                data: health,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Health check failed',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // GET /emergency/metrics - Enhanced metrics with emergency data
    router.get('/metrics', async (req, res) => {
        try {
            const metrics = mca.getEnhancedMetrics();
            
            res.json({
                success: true,
                data: metrics,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Metrics collection failed',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // GET /emergency/incidents - Get active incidents
    router.get('/incidents', async (req, res) => {
        try {
            const incidents = mca.emergencyInterface.getActiveIncidents();
            
            res.json({
                success: true,
                data: {
                    active_incidents: incidents,
                    count: incidents.length
                },
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve incidents',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // ========================================
    // CIRCUIT BREAKER MANAGEMENT
    // ========================================
    
    // GET /emergency/circuit-breakers - Get circuit breaker status
    router.get('/circuit-breakers', async (req, res) => {
        try {
            const status = mca.getCircuitBreakerStatus();
            
            res.json({
                success: true,
                data: {
                    circuit_breakers: status,
                    summary: {
                        total: Object.keys(status).length,
                        healthy: Object.values(status).filter(cb => cb.healthy).length,
                        unhealthy: Object.values(status).filter(cb => !cb.healthy).length
                    }
                },
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to get circuit breaker status',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // POST /emergency/circuit-breakers/:agent/reset - Reset specific circuit breaker
    router.post('/circuit-breakers/:agent/reset', async (req, res) => {
        try {
            const { agent } = req.params;
            const breaker = mca.emergencySystem.circuitBreakers.get(agent);
            
            if (!breaker) {
                return res.status(404).json({
                    success: false,
                    error: 'Circuit breaker not found',
                    message: `No circuit breaker exists for agent: ${agent}`
                });
            }

            // Reset circuit breaker
            breaker.state = 'closed';
            breaker.failures = 0;
            breaker.lastFailureTime = null;
            breaker.successCount = 0;
            
            console.log(`🔌 Circuit breaker reset for ${agent}`);
            
            res.json({
                success: true,
                message: `Circuit breaker reset for ${agent}`,
                data: {
                    agent,
                    new_state: breaker.state,
                    failures: breaker.failures
                },
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to reset circuit breaker',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // ========================================
    // ROLLBACK & RECOVERY
    // ========================================
    
    // POST /emergency/rollback - Trigger system rollback
    router.post('/rollback', async (req, res) => {
        try {
            const { reason, max_age, not_before } = req.body;
            
            const rollbackCriteria = {
                reason: reason || 'manual_api_trigger',
                maxAge: max_age ? parseInt(max_age) : undefined,
                notBefore: not_before ? parseInt(not_before) : undefined,
                triggeredBy: 'api',
                timestamp: Date.now()
            };
            
            console.log('🚨 Emergency rollback triggered via API');
            
            const rollbackResult = await mca.triggerEmergencyRollback(rollbackCriteria);
            
            res.json({
                success: true,
                message: 'Emergency rollback executed',
                data: rollbackResult,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Rollback failed',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // GET /emergency/rollback/history - Get rollback history
    router.get('/rollback/history', async (req, res) => {
        try {
            // Implementation would read from emergency data files
            const fs = require('fs').promises;
            const path = require('path');
            const historyPath = path.join(__dirname, '../../data/emergency/rollback_history.json');
            
            let history = [];
            try {
                const data = await fs.readFile(historyPath, 'utf8');
                history = JSON.parse(data);
            } catch (e) {
                // File doesn't exist or is empty - this is okay
            }
            
            res.json({
                success: true,
                data: {
                    rollback_history: history.slice(-20), // Last 20 rollbacks
                    total_count: history.length
                },
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve rollback history',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // ========================================
    // EMERGENCY TESTING
    // ========================================
    
    // POST /emergency/test/error - Trigger test error for emergency system testing
    router.post('/test/error', async (req, res) => {
        try {
            const { error_type, severity, agent } = req.body;
            
            // Create test error
            const testError = new Error(`Test error: ${error_type || 'generic'}`);
            testError.code = error_type?.toUpperCase() || 'TEST_ERROR';
            testError.name = 'TestError';
            
            const testContext = {
                severity: severity || 'medium',
                testMode: true,
                triggeredBy: 'api',
                targetAgent: agent,
                timestamp: Date.now()
            };
            
            // Handle through emergency system
            const result = await mca.emergencyInterface.handleError(testError, testContext);
            
            res.json({
                success: true,
                message: 'Test error processed successfully',
                data: {
                    test_error: testError.message,
                    emergency_result: result,
                    context: testContext
                },
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Test error processing failed',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // POST /emergency/test/circuit-breaker - Test circuit breaker functionality
    router.post('/test/circuit-breaker', async (req, res) => {
        try {
            const { agent, failure_count } = req.body;
            
            if (!agent) {
                return res.status(400).json({
                    success: false,
                    error: 'Agent parameter required',
                    message: 'Please specify which agent to test'
                });
            }
            
            const breaker = mca.emergencySystem.circuitBreakers.get(agent);
            if (!breaker) {
                return res.status(404).json({
                    success: false,
                    error: 'Circuit breaker not found',
                    message: `No circuit breaker exists for agent: ${agent}`
                });
            }
            
            // Simulate failures to trigger circuit breaker
            const failures = parseInt(failure_count) || breaker.threshold;
            let circuitOpened = false;
            
            for (let i = 0; i < failures; i++) {
                const testError = new Error(`Test failure ${i + 1}`);
                testError.code = 'TEST_FAILURE';
                
                try {
                    await mca.emergencyInterface.executeWithCircuitBreaker(
                        agent,
                        async () => { throw testError; }
                    );
                } catch (e) {
                    // Expected to fail
                    if (e.message.includes('Circuit breaker is open')) {
                        circuitOpened = true;
                        break;
                    }
                }
            }
            
            const finalStatus = mca.emergencySystem.circuitBreakers.get(agent);
            
            res.json({
                success: true,
                message: `Circuit breaker test completed for ${agent}`,
                data: {
                    agent,
                    failures_simulated: failures,
                    final_state: finalStatus.state,
                    circuit_opened: finalStatus.state === 'open' || circuitOpened
                },
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Circuit breaker test failed',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // ========================================
    // SYSTEM CONTROL
    // ========================================
    
    // POST /emergency/system/freeze - Manually freeze system
    router.post('/system/freeze', async (req, res) => {
        try {
            const previousState = mca.systemHealth;
            
            mca.emergencySystem.systemState = 'frozen';
            mca.systemHealth = 'frozen';
            mca.emergencySystem.emit('system:freeze');
            
            res.json({
                success: true,
                message: 'System manually frozen',
                data: {
                    previous_state: previousState,
                    new_state: 'frozen',
                    frozen_at: new Date().toISOString()
                },
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to freeze system',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // POST /emergency/system/unfreeze - Manually unfreeze system
    router.post('/system/unfreeze', async (req, res) => {
        try {
            mca.emergencySystem.systemState = 'normal';
            mca.systemHealth = 'healthy';
            mca.emergencySystem.emit('system:resume');
            
            res.json({
                success: true,
                message: 'System unfrozen and restored',
                data: {
                    new_state: 'healthy',
                    unfrozen_at: new Date().toISOString()
                },
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to unfreeze system',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // ========================================
    // SYSTEM INFORMATION
    // ========================================
    
    // GET /emergency/status - Overall emergency system status
    router.get('/status', async (req, res) => {
        try {
            const health = await mca.getSystemHealth();
            const incidents = mca.emergencyInterface.getActiveIncidents();
            const circuitBreakers = mca.getCircuitBreakerStatus();
            
            // Count healthy vs unhealthy components
            const healthyComponents = Object.values(circuitBreakers).filter(cb => cb.healthy).length;
            const totalComponents = Object.keys(circuitBreakers).length;
            
            const status = {
                overall_status: health.overall,
                system_state: mca.emergencySystem.systemState,
                active_incidents: incidents.length,
                circuit_breaker_summary: {
                    total: totalComponents,
                    healthy: healthyComponents,
                    unhealthy: totalComponents - healthyComponents,
                    health_percentage: totalComponents > 0 ? Math.round((healthyComponents / totalComponents) * 100) : 100
                },
                uptime_seconds: Math.floor(process.uptime()),
                emergency_system_active: true
            };
            
            res.json({
                success: true,
                data: status,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to get emergency system status',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });

    return router;
};