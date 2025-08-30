// Emergency System API Routes
// Location: C:\Projects\Progressive-Framework-v5\src\api\emergencyRoutes.js

const express = require('express');
const EmergencyIntegration = require('../emergency/EmergencyIntegration');

const router = express.Router();
const emergencyIntegration = new EmergencyIntegration();

// ========================================
// SYSTEM STATUS & MONITORING
// ========================================

/**
 * GET /api/emergency/status
 * Get comprehensive emergency system status
 */
router.get('/status', async (req, res) => {
    try {
        const status = emergencyIntegration.getSystemStatus();
        
        res.json({
            success: true,
            status,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Emergency status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve emergency system status',
            details: error.message
        });
    }
});

/**
 * GET /api/emergency/health
 * Get current system health status
 */
router.get('/health', async (req, res) => {
    try {
        const healthStatus = await emergencyIntegration.emergencySystem.performHealthCheck();
        
        res.json({
            success: true,
            health: healthStatus,
            recommendations: generateHealthRecommendations(healthStatus)
        });

    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            success: false,
            error: 'Health check failed',
            details: error.message,
            health: {
                overall: 'unhealthy',
                reason: 'health_check_failed'
            }
        });
    }
});

/**
 * GET /api/emergency/incidents
 * Get active and recent incidents
 */
router.get('/incidents', async (req, res) => {
    try {
        const { status = 'active', limit = 50 } = req.query;
        
        const incidents = Array.from(emergencyIntegration.emergencySystem.activeIncidents.values())
            .filter(incident => status === 'all' || incident.status === status)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, parseInt(limit));

        res.json({
            success: true,
            incidents,
            total: incidents.length,
            filters: { status, limit: parseInt(limit) }
        });

    } catch (error) {
        console.error('Incidents retrieval error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve incidents',
            details: error.message
        });
    }
});

/**
 * GET /api/emergency/incidents/:incidentId
 * Get detailed information about specific incident
 */
router.get('/incidents/:incidentId', async (req, res) => {
    try {
        const { incidentId } = req.params;
        
        const incident = emergencyIntegration.emergencySystem.activeIncidents.get(incidentId);
        
        if (!incident) {
            return res.status(404).json({
                success: false,
                error: 'Incident not found'
            });
        }

        res.json({
            success: true,
            incident
        });

    } catch (error) {
        console.error('Incident detail error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve incident details',
            details: error.message
        });
    }
});

/**
 * GET /api/emergency/circuit-breakers
 * Get circuit breaker status for all components
 */
router.get('/circuit-breakers', async (req, res) => {
    try {
        const circuitBreakerStatus = emergencyIntegration.getCircuitBreakerStatus();
        
        res.json({
            success: true,
            circuitBreakers: circuitBreakerStatus,
            summary: {
                total: Object.keys(circuitBreakerStatus).length,
                open: Object.values(circuitBreakerStatus).filter(cb => cb.state === 'OPEN').length,
                halfOpen: Object.values(circuitBreakerStatus).filter(cb => cb.state === 'HALF_OPEN').length,
                closed: Object.values(circuitBreakerStatus).filter(cb => cb.state === 'CLOSED').length
            }
        });

    } catch (error) {
        console.error('Circuit breaker status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve circuit breaker status',
            details: error.message
        });
    }
});

// ========================================
// BACKUP MANAGEMENT
// ========================================

/**
 * GET /api/emergency/backups
 * Get list of available backups
 */
router.get('/backups', async (req, res) => {
    try {
        const { type, limit = 20 } = req.query;
        
        let backups = emergencyIntegration.backupSystem.getAvailableBackups();
        
        if (type) {
            backups = backups.filter(backup => backup.type === type);
        }
        
        backups = backups.slice(0, parseInt(limit));

        res.json({
            success: true,
            backups,
            total: backups.length,
            statistics: emergencyIntegration.backupSystem.getBackupStatistics()
        });

    } catch (error) {
        console.error('Backups retrieval error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve backups',
            details: error.message
        });
    }
});

/**
 * GET /api/emergency/backups/:backupId
 * Get detailed backup information
 */
router.get('/backups/:backupId', async (req, res) => {
    try {
        const { backupId } = req.params;
        
        const backup = emergencyIntegration.backupSystem.getBackupDetails(backupId);
        
        if (!backup) {
            return res.status(404).json({
                success: false,
                error: 'Backup not found'
            });
        }

        res.json({
            success: true,
            backup
        });

    } catch (error) {
        console.error('Backup detail error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve backup details',
            details: error.message
        });
    }
});

/**
 * POST /api/emergency/backups/create
 * Create a manual backup
 */
router.post('/backups/create', async (req, res) => {
    try {
        const { reason = 'manual', type = 'full_system', components } = req.body;

        let backup;
        if (type === 'full_system') {
            backup = await emergencyIntegration.backupSystem.createFullSystemBackup(reason);
        } else if (type === 'incremental' && components) {
            // Create incremental backup for specific components
            const backupPromises = components.map(component => 
                emergencyIntegration.backupSystem.createComponentBackup(component, reason)
            );
            const componentBackups = await Promise.all(backupPromises);
            backup = {
                id: `multi_${Date.now()}`,
                type: 'multi_component',
                components: componentBackups,
                reason: reason
            };
        } else {
            return res.status(400).json({
                success: false,
                error: 'Invalid backup type or missing components'
            });
        }

        res.json({
            success: true,
            message: 'Backup created successfully',
            backup: {
                id: backup.id,
                type: backup.type,
                timestamp: backup.timestamp,
                reason: backup.reason
            }
        });

    } catch (error) {
        console.error('Backup creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create backup',
            details: error.message
        });
    }
});

/**
 * POST /api/emergency/backups/test-rollback
 * Test rollback without actually performing it
 */
router.post('/backups/test-rollback', async (req, res) => {
    try {
        const { backupId, components } = req.body;

        if (!backupId) {
            return res.status(400).json({
                success: false,
                error: 'backupId is required'
            });
        }

        const rollbackTest = await emergencyIntegration.backupSystem.performRollback(
            backupId,
            {
                dryRun: true,
                components: components,
                verifyIntegrity: true
            }
        );

        res.json({
            success: true,
            message: 'Rollback test completed',
            testResult: rollbackTest,
            wouldSucceed: rollbackTest.success,
            estimatedTime: rollbackTest.estimatedTime || 'unknown'
        });

    } catch (error) {
        console.error('Rollback test error:', error);
        res.status(500).json({
            success: false,
            error: 'Rollback test failed',
            details: error.message
        });
    }
});

// ========================================
// EMERGENCY OPERATIONS
// ========================================

/**
 * POST /api/emergency/rollback
 * Perform emergency rollback to specified backup
 */
router.post('/rollback', async (req, res) => {
    try {
        const { backupId, confirm, components, reason } = req.body;

        if (!backupId) {
            return res.status(400).json({
                success: false,
                error: 'backupId is required'
            });
        }

        if (!confirm) {
            return res.status(400).json({
                success: false,
                error: 'Rollback must be explicitly confirmed with confirm: true'
            });
        }

        console.log(`🚨 EMERGENCY ROLLBACK initiated to backup: ${backupId}`);

        const rollbackResult = await emergencyIntegration.performEmergencyRollback(backupId);

        res.json({
            success: rollbackResult.success,
            message: rollbackResult.success ? 'Emergency rollback completed successfully' : 'Emergency rollback completed with errors',
            rollback: rollbackResult,
            systemState: emergencyIntegration.emergencySystem.systemState
        });

    } catch (error) {
        console.error('Emergency rollback error:', error);
        res.status(500).json({
            success: false,
            error: 'Emergency rollback failed',
            details: error.message,
            systemState: emergencyIntegration.emergencySystem.systemState
        });
    }
});

/**
 * POST /api/emergency/circuit-breaker/:component/reset
 * Reset circuit breaker for specific component
 */
router.post('/circuit-breaker/:component/reset', async (req, res) => {
    try {
        const { component } = req.params;
        const { force = false } = req.body;

        const circuitBreaker = emergencyIntegration.emergencySystem.circuitBreakers.get(component);
        
        if (!circuitBreaker) {
            return res.status(404).json({
                success: false,
                error: `Circuit breaker for ${component} not found`
            });
        }

        if (circuitBreaker.state === 'OPEN' || force) {
            circuitBreaker.state = 'CLOSED';
            circuitBreaker.failureCount = 0;
            circuitBreaker.openedAt = null;
            circuitBreaker.lastFailure = null;

            console.log(`⚡ Circuit breaker for ${component} manually reset`);

            res.json({
                success: true,
                message: `Circuit breaker for ${component} reset successfully`,
                circuitBreaker: {
                    component: component,
                    state: circuitBreaker.state,
                    failureCount: circuitBreaker.failureCount
                }
            });
        } else {
            res.json({
                success: false,
                message: `Circuit breaker for ${component} is not in OPEN state`,
                currentState: circuitBreaker.state
            });
        }

    } catch (error) {
        console.error('Circuit breaker reset error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to reset circuit breaker',
            details: error.message
        });
    }
});

/**
 * POST /api/emergency/simulate-error
 * Simulate error for testing emergency systems (dev/test only)
 */
router.post('/simulate-error', async (req, res) => {
    try {
        // Only allow in development/testing environments
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({
                success: false,
                error: 'Error simulation not allowed in production'
            });
        }

        const { 
            errorType = 'generic',
            severity = 'medium',
            component = 'test',
            message = 'Simulated error for testing'
        } = req.body;

        const simulatedError = new Error(message);
        simulatedError.name = `Simulated${errorType}Error`;
        simulatedError.code = `SIM_${errorType.toUpperCase()}`;

        const response = await emergencyIntegration.handleError(simulatedError, {
            simulated: true,
            errorType: errorType,
            severity: severity,
            agentType: component,
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Error simulation completed',
            simulation: {
                errorType: errorType,
                severity: severity,
                component: component
            },
            emergencyResponse: response
        });

    } catch (error) {
        console.error('Error simulation failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to simulate error',
            details: error.message
        });
    }
});

/**
 * POST /api/emergency/test-system
 * Run comprehensive emergency system test
 */
router.post('/test-system', async (req, res) => {
    try {
        const testResults = await emergencyIntegration.testEmergencySystem();

        res.json({
            success: testResults.overallResult === 'pass',
            message: `Emergency system test ${testResults.overallResult}`,
            testResults
        });

    } catch (error) {
        console.error('Emergency system test error:', error);
        res.status(500).json({
            success: false,
            error: 'Emergency system test failed',
            details: error.message
        });
    }
});

// ========================================
// SYSTEM MAINTENANCE
// ========================================

/**
 * POST /api/emergency/maintenance/cleanup
 * Clean up old incidents, logs, and backups
 */
router.post('/maintenance/cleanup', async (req, res) => {
    try {
        const { 
            olderThanDays = 30,
            keepBackups = 10,
            dryRun = false 
        } = req.body;

        const cleanupResults = {
            incidents: { cleaned: 0, kept: 0 },
            backups: { cleaned: 0, kept: 0 },
            logs: { cleaned: 0, kept: 0 },
            dryRun: dryRun
        };

        const cutoffDate = new Date(Date.now() - (olderThanDays * 24 * 60 * 60 * 1000));

        // Clean up old incidents
        const incidents = Array.from(emergencyIntegration.emergencySystem.activeIncidents.entries());
        for (const [id, incident] of incidents) {
            if (new Date(incident.timestamp) < cutoffDate && incident.status !== 'active') {
                if (!dryRun) {
                    emergencyIntegration.emergencySystem.activeIncidents.delete(id);
                }
                cleanupResults.incidents.cleaned++;
            } else {
                cleanupResults.incidents.kept++;
            }
        }

        // Clean up old backups (keep most recent ones)
        const backups = emergencyIntegration.backupSystem.getAvailableBackups();
        const backupsToCleanup = backups.slice(keepBackups);
        
        for (const backup of backupsToCleanup) {
            if (!dryRun) {
                await emergencyIntegration.backupSystem.deleteBackup(backup.id);
            }
            cleanupResults.backups.cleaned++;
        }
        cleanupResults.backups.kept = Math.min(backups.length, keepBackups);

        res.json({
            success: true,
            message: `Cleanup ${dryRun ? 'simulation' : 'operation'} completed`,
            results: cleanupResults
        });

    } catch (error) {
        console.error('Cleanup operation error:', error);
        res.status(500).json({
            success: false,
            error: 'Cleanup operation failed',
            details: error.message
        });
    }
});

/**
 * GET /api/emergency/metrics
 * Get emergency system performance metrics
 */
router.get('/metrics', async (req, res) => {
    try {
        const { timeRange = 24 } = req.query; // hours
        
        const metrics = {
            timestamp: new Date().toISOString(),
            timeRange: `${timeRange} hours`,
            systemState: emergencyIntegration.emergencySystem.systemState,
            incidents: {
                total: emergencyIntegration.emergencySystem.activeIncidents.size,
                active: Array.from(emergencyIntegration.emergencySystem.activeIncidents.values())
                    .filter(i => i.status === 'active').length,
                resolved: Array.from(emergencyIntegration.emergencySystem.activeIncidents.values())
                    .filter(i => i.status === 'resolved').length
            },
            circuitBreakers: {
                total: emergencyIntegration.emergencySystem.circuitBreakers.size,
                open: Array.from(emergencyIntegration.emergencySystem.circuitBreakers.values())
                    .filter(cb => cb.state === 'OPEN').length,
                failures: Array.from(emergencyIntegration.emergencySystem.circuitBreakers.values())
                    .reduce((sum, cb) => sum + cb.failureCount, 0)
            },
            backups: emergencyIntegration.backupSystem.getBackupStatistics(),
            system: {
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage()
            }
        };

        res.json({
            success: true,
            metrics
        });

    } catch (error) {
        console.error('Metrics retrieval error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve metrics',
            details: error.message
        });
    }
});

// ========================================
// HELPER FUNCTIONS
// ========================================

function generateHealthRecommendations(healthStatus) {
    const recommendations = [];

    if (healthStatus.overall === 'unhealthy') {
        recommendations.push({
            priority: 'critical',
            action: 'investigate_critical_alerts',
            message: 'System is unhealthy. Investigate critical alerts immediately.'
        });
    }

    healthStatus.alerts.forEach(alert => {
        if (alert.type === 'memory' && alert.severity === 'warning') {
            recommendations.push({
                priority: 'medium',
                action: 'optimize_memory_usage',
                message: 'Consider optimizing memory usage or scaling resources.'
            });
        } else if (alert.type === 'circuit_breaker') {
            recommendations.push({
                priority: 'high',
                action: 'check_component_health',
                message: `Check health of component with open circuit breaker.`
            });
        }
    });

    if (recommendations.length === 0) {
        recommendations.push({
            priority: 'low',
            action: 'maintain_monitoring',
            message: 'System appears healthy. Continue monitoring.'
        });
    }

    return recommendations;
}

module.exports = router;