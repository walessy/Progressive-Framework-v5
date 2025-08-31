const fs = require('fs');
const path = require('path');
// Emergency System Integration & API
// Location: C:\Projects\Progressive-Framework-v5\src\emergency\EmergencyIntegration.js

const EmergencyResponseSystem = require('./EmergencyResponseSystem');
const RollbackBackupSystem = require('./RollbackBackupSystem');

class EmergencyIntegration {
    constructor() {
        this.emergencySystem = new EmergencyResponseSystem();
        this.backupSystem = new RollbackBackupSystem();
        this.isInitialized = false;
        this.errorInterceptors = new Map();
        
        this.init();
    }

    async init() {
        try {
            // Wait for both systems to initialize
            await Promise.all([
                this.emergencySystem.init(),
                this.backupSystem.init()
            ]);

            // Set up event listeners
            this.setupEventListeners();

            // Register global error handlers
            this.setupGlobalErrorHandling();

            this.isInitialized = true;
            console.log('🚨 Emergency Integration System ready');

        } catch (error) {
            console.error('Emergency Integration initialization failed:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Listen to emergency system events
        this.emergencySystem.on('system:emergency', async (data) => {
            console.log('🚨 SYSTEM EMERGENCY detected:', data);
            
            // Create emergency backup
            try {
                await this.backupSystem.createFullSystemBackup(
                    `emergency_${data.incident?.id || 'unknown'}`,
                    { emergency: true, incident: data }
                );
            } catch (backupError) {
                console.error('Emergency backup failed:', backupError);
            }
        });

        this.emergencySystem.on('circuit_breaker:opened', async (data) => {
            console.log('⚡ Circuit breaker opened for:', data.component);
            
            // Create component backup before isolation
            try {
                await this.backupSystem.createComponentBackup(
                    data.component.toLowerCase(),
                    `circuit_breaker_${data.component}`
                );
            } catch (error) {
                console.error(`Failed to backup ${data.component} before isolation:`, error);
            }
        });

        this.emergencySystem.on('health:degraded', async (data) => {
            console.log('⚠️ System health degraded:', data);
            
            // Create health snapshot backup
            try {
                await this.backupSystem.createIncrementalBackup(
                    'system_state',
                    { healthStatus: data, degradationReason: 'health_monitor' },
                    'health_degradation'
                );
            } catch (error) {
                console.error('Failed to create health degradation backup:', error);
            }
        });
    }

    setupGlobalErrorHandling() {
        // Handle uncaught exceptions
        process.on('uncaughtException', async (error) => {
            console.error('🚨 UNCAUGHT EXCEPTION:', error);
            
            try {
                await this.handleCriticalError(error, {
                    type: 'uncaught_exception',
                    systemWide: true
                });
            } catch (emergencyError) {
                console.error('Emergency handling for uncaught exception failed:', emergencyError);
            }

            // Graceful shutdown
            process.exit(1);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', async (reason, promise) => {
            console.error('🚨 UNHANDLED REJECTION:', reason, 'at:', promise);
            
            try {
                await this.handleCriticalError(new Error(reason), {
                    type: 'unhandled_rejection',
                    promise: promise.toString(),
                    systemWide: true
                });
            } catch (emergencyError) {
                console.error('Emergency handling for unhandled rejection failed:', emergencyError);
            }
        });

        // Handle system signals
        process.on('SIGTERM', async () => {
            console.log('🚨 SIGTERM received, initiating graceful shutdown');
            await this.gracefulShutdown('SIGTERM');
        });

        process.on('SIGINT', async () => {
            console.log('🚨 SIGINT received, initiating graceful shutdown');
            await this.gracefulShutdown('SIGINT');
        });
    }

    // ========================================
    // ERROR HANDLING INTEGRATION
    // ========================================

    async handleError(error, context = {}) {
        if (!this.isInitialized) {
            console.error('Emergency system not initialized, using fallback error handling');
            return this.fallbackErrorHandling(error, context);
        }

        try {
            // Add integration context
            const enhancedContext = {
                ...context,
                timestamp: new Date().toISOString(),
                systemIntegrated: true,
                backupSystemAvailable: this.backupSystem !== null,
                emergencySystemAvailable: this.emergencySystem !== null
            };

            // Handle the error through the emergency system
            const emergencyResponse = await this.emergencySystem.handleError(error, enhancedContext);

            // If rollback was recommended, execute it
            if (emergencyResponse.response.rollback) {
                await this.executeEmergencyRollback(emergencyResponse.incident);
            }

            // If backup was recommended, create it
            if (emergencyResponse.response.actions.includes('create_emergency_backup')) {
                await this.backupSystem.createFullSystemBackup(
                    `error_response_${emergencyResponse.incident.id}`,
                    { errorResponse: true, incident: emergencyResponse.incident }
                );
            }

            return {
                handled: true,
                emergency: emergencyResponse,
                systemRecovered: emergencyResponse.recovery.success,
                backupCreated: emergencyResponse.response.actions.includes('create_emergency_backup'),
                rollbackPerformed: emergencyResponse.recovery.rollbackPerformed
            };

        } catch (emergencyError) {
            console.error('Emergency handling failed, using fallback:', emergencyError);
            return this.fallbackErrorHandling(error, context);
        }
    }

    async handleCriticalError(error, context = {}) {
        console.error('🚨 CRITICAL ERROR detected:', error.message);

        try {
            // Immediately create emergency backup
            const emergencyBackup = await this.backupSystem.createFullSystemBackup(
                'critical_error_emergency',
                { 
                    criticalError: true, 
                    error: error.message,
                    context: context,
                    timestamp: new Date().toISOString()
                }
            );

            console.log(`💾 Emergency backup created: ${emergencyBackup.id}`);

            // Handle through emergency system
            const response = await this.emergencySystem.handleError(error, {
                ...context,
                critical: true,
                emergencyBackup: emergencyBackup.id
            });

            return response;

        } catch (criticalHandlingError) {
            console.error('Critical error handling failed:', criticalHandlingError);
            
            // Last resort: save error to file
            await this.saveErrorToFile(error, context, criticalHandlingError);
            throw criticalHandlingError;
        }
    }

    fallbackErrorHandling(error, context) {
        console.error('🔧 Fallback error handling activated');
        
        return {
            handled: true,
            fallback: true,
            error: error.message,
            context: context,
            timestamp: new Date().toISOString(),
            message: 'Error handled with fallback system - emergency systems unavailable'
        };
    }

    async executeEmergencyRollback(incident) {
        try {
            console.log('🔄 Executing emergency rollback for incident:', incident.id);

            // Get the most recent stable backup
            const availableBackups = this.backupSystem.getAvailableBackups()
                .filter(backup => backup.status === 'completed' && backup.type === 'full_system');

            if (availableBackups.length === 0) {
                throw new Error('No stable backups available for emergency rollback');
            }

            const targetBackup = availableBackups[0]; // Most recent stable backup
            
            // Perform emergency rollback
            const rollbackResult = await this.backupSystem.performRollback(targetBackup.id, {
                createPreRollbackBackup: true,
                verifyIntegrity: true,
                dryRun: false
            });

            if (rollbackResult.success) {
                console.log('✅ Emergency rollback completed successfully');
                
                // Update system state
                this.emergencySystem.systemState = 'recovery';
                
                return { success: true, rollbackResult };
            } else {
                throw new Error(`Emergency rollback failed: ${rollbackResult.componentsFailed.length} components failed`);
            }

        } catch (rollbackError) {
            console.error('Emergency rollback failed:', rollbackError);
            throw rollbackError;
        }
    }

    // ========================================
    // AGENT INTEGRATION METHODS
    // ========================================

    wrapAgentWithErrorHandling(agent, agentType) {
        const originalProcessRequest = agent.processRequest.bind(agent);
        
        agent.processRequest = async (request, context = {}) => {
            try {
                // Report component availability
                this.emergencySystem.reportComponentSuccess(agentType);
                
                // Check if component is available via circuit breaker
                if (!this.emergencySystem.isComponentAvailable(agentType)) {
                    throw new Error(`Agent ${agentType} is currently unavailable (circuit breaker OPEN)`);
                }

                // Execute original request
                const result = await originalProcessRequest(request, {
                    ...context,
                    agentType: agentType,
                    emergencyIntegration: true
                });

                // Report success
                this.emergencySystem.reportComponentSuccess(agentType);
                
                return result;

            } catch (error) {
                // Report failure
                this.emergencySystem.reportComponentFailure(agentType, error);
                
                // Handle the error through emergency system
                const emergencyResponse = await this.handleError(error, {
                    ...context,
                    agentType: agentType,
                    request: request
                });

                // If emergency response provided a fallback, return it
                if (emergencyResponse.handled && emergencyResponse.emergency?.recovery?.success) {
                    return {
                        content: 'I encountered an issue but I\'ve recovered. Please try your request again.',
                        success: false,
                        confidence: 0.3,
                        emergency: true,
                        recovery: emergencyResponse.emergency.recovery
                    };
                }

                // If no recovery, throw original error
                throw error;
            }
        };

        return agent;
    }

    wrapMCAWithEmergencyIntegration(mca) {
        const originalProcessRequest = mca.processRequest.bind(mca);
        
        mca.processRequest = async (request, userId = 'anonymous') => {
            try {
                // Pre-request backup trigger (for critical operations)
                if (this.shouldCreatePreRequestBackup(request)) {
                    await this.backupSystem.createIncrementalBackup(
                        'pre_request',
                        { request, userId, timestamp: new Date().toISOString() },
                        'pre_critical_request'
                    );
                }

                // Execute original request
                const result = await originalProcessRequest(request, userId);

                // Post-request health check
                if (this.shouldPerformPostRequestHealthCheck(request)) {
                    setTimeout(async () => {
                        await this.emergencySystem.performHealthCheck();
                    }, 1000); // Non-blocking health check
                }

                return result;

            } catch (error) {
                // Enhanced error context for MCA
                const enhancedContext = {
                    userId: userId,
                    request: request,
                    agentType: 'MCA',
                    timestamp: new Date().toISOString(),
                    systemWide: this.isSystemWideError(error)
                };

                // Handle through emergency system
                const emergencyResponse = await this.handleError(error, enhancedContext);

                // If emergency handling succeeded, return enhanced error response
                if (emergencyResponse.handled) {
                    return {
                        content: this.generateEmergencyResponse(error, emergencyResponse),
                        success: false,
                        confidence: 0.2,
                        emergency: true,
                        incident: emergencyResponse.emergency?.incident?.id,
                        recovery: emergencyResponse.emergency?.recovery,
                        systemState: this.emergencySystem.systemState
                    };
                }

                // If emergency handling failed, throw original error
                throw error;
            }
        };

        return mca;
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    shouldCreatePreRequestBackup(request) {
        const criticalKeywords = [
            'delete', 'remove', 'clear', 'reset', 'purge',
            'modify all', 'change all', 'update all',
            'critical', 'emergency', 'urgent'
        ];

        const lowerRequest = request.toLowerCase();
        return criticalKeywords.some(keyword => lowerRequest.includes(keyword));
    }

    shouldPerformPostRequestHealthCheck(request) {
        const healthCheckKeywords = [
            'system', 'health', 'status', 'performance',
            'memory', 'cpu', 'load', 'metrics'
        ];

        const lowerRequest = request.toLowerCase();
        return healthCheckKeywords.some(keyword => lowerRequest.includes(keyword));
    }

    isSystemWideError(error) {
        const systemWideIndicators = [
            'ENOSPC', 'ENOMEM', 'ENOTDIR', 'EACCES',
            'database', 'connection', 'network', 'timeout',
            'system', 'critical', 'fatal'
        ];

        const errorString = error.toString().toLowerCase();
        return systemWideIndicators.some(indicator => errorString.includes(indicator));
    }

    generateEmergencyResponse(originalError, emergencyResponse) {
        const incident = emergencyResponse.emergency?.incident;
        const recovery = emergencyResponse.emergency?.recovery;

        let response = 'I encountered an issue and activated emergency protocols. ';

        if (recovery?.success) {
            response += 'The system has recovered successfully. ';
        } else if (recovery?.fallbackActivated) {
            response += 'I\'ve activated backup systems to continue serving you. ';
        } else {
            response += 'I\'m working to resolve the issue. ';
        }

        if (incident?.id) {
            response += `Incident ${incident.id} has been logged for review. `;
        }

        if (emergencyResponse.backupCreated) {
            response += 'A system backup has been created for safety. ';
        }

        response += 'Please try your request again or rephrase it if the issue persists.';

        return response;
    }

    async saveErrorToFile(error, context, emergencyError) {
        try {
            const errorLog = {
                timestamp: new Date().toISOString(),
                originalError: {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                },
                context: context,
                emergencyError: {
                    message: emergencyError.message,
                    stack: emergencyError.stack
                },
                systemState: {
                    uptime: process.uptime(),
                    memoryUsage: process.memoryUsage(),
                    pid: process.pid
                }
            };

            const errorFile = path.join(__dirname, '../../data/emergency', `critical_error_${Date.now()}.json`);
            await fs.writeFile(errorFile, JSON.stringify(errorLog, null, 2));
            
            console.log(`💾 Critical error saved to: ${errorFile}`);

        } catch (saveError) {
            console.error('Failed to save critical error to file:', saveError);
        }
    }

    async gracefulShutdown(signal) {
        console.log(`🚨 Graceful shutdown initiated by ${signal}`);

        try {
            // Create final system backup
            const shutdownBackup = await this.backupSystem.createFullSystemBackup(
                `shutdown_${signal}`,
                { 
                    gracefulShutdown: true, 
                    signal: signal,
                    timestamp: new Date().toISOString()
                }
            );

            console.log(`💾 Shutdown backup created: ${shutdownBackup.id}`);

            // Close connections and cleanup
            this.emergencySystem.systemState = 'shutdown';
            
            console.log('✅ Graceful shutdown completed');

        } catch (shutdownError) {
            console.error('Graceful shutdown failed:', shutdownError);
        }

        process.exit(0);
    }

    // ========================================
    // PUBLIC API METHODS
    // ========================================

    getSystemStatus() {
        return {
            emergencySystem: {
                available: this.emergencySystem !== null,
                systemState: this.emergencySystem?.systemState || 'unknown',
                activeIncidents: this.emergencySystem?.activeIncidents.size || 0,
                circuitBreakers: this.getCircuitBreakerStatus()
            },
            backupSystem: {
                available: this.backupSystem !== null,
                availableBackups: this.backupSystem?.getAvailableBackups().length || 0,
                lastBackup: this.getLastBackupInfo(),
                statistics: this.backupSystem?.getBackupStatistics() || {}
            },
            integration: {
                initialized: this.isInitialized,
                errorInterceptors: this.errorInterceptors.size,
                globalHandlersActive: true
            }
        };
    }

    getCircuitBreakerStatus() {
        if (!this.emergencySystem?.circuitBreakers) return {};

        const status = {};
        for (const [component, breaker] of this.emergencySystem.circuitBreakers.entries()) {
            status[component] = {
                state: breaker.state,
                failureCount: breaker.failureCount,
                successCount: breaker.successCount,
                lastFailure: breaker.lastFailure,
                available: breaker.state !== 'OPEN'
            };
        }
        return status;
    }

    getLastBackupInfo() {
        const backups = this.backupSystem?.getAvailableBackups() || [];
        if (backups.length === 0) return null;

        const lastBackup = backups[0]; // Already sorted by newest first
        return {
            id: lastBackup.id,
            timestamp: lastBackup.timestamp,
            type: lastBackup.type,
            reason: lastBackup.reason,
            size: lastBackup.size
        };
    }

    async createEmergencyBackup() {
        if (!this.backupSystem) {
            throw new Error('Backup system not available');
        }

        return await this.backupSystem.createFullSystemBackup('manual_emergency', {
            manualEmergency: true,
            timestamp: new Date().toISOString()
        });
    }

    async performEmergencyRollback(backupId) {
        if (!this.backupSystem) {
            throw new Error('Backup system not available');
        }

        return await this.backupSystem.performRollback(backupId, {
            createPreRollbackBackup: true,
            verifyIntegrity: true
        });
    }

    async testEmergencySystem() {
        const testResults = {
            timestamp: new Date().toISOString(),
            tests: [],
            overallResult: 'pass'
        };

        try {
            // Test emergency system
            if (this.emergencySystem) {
                const testError = new Error('Emergency system test');
                const response = await this.emergencySystem.handleError(testError, { test: true });
                testResults.tests.push({
                    name: 'emergency_response',
                    result: 'pass',
                    details: `Handled test error with ${response.response.actions.length} actions`
                });
            } else {
                testResults.tests.push({
                    name: 'emergency_response',
                    result: 'fail',
                    error: 'Emergency system not available'
                });
                testResults.overallResult = 'fail';
            }

            // Test backup system
            if (this.backupSystem) {
                const testBackup = await this.backupSystem.createIncrementalBackup(
                    'system_test',
                    { test: true },
                    'emergency_system_test'
                );
                testResults.tests.push({
                    name: 'backup_creation',
                    result: 'pass',
                    details: `Created test backup: ${testBackup.id}`
                });

                // Test rollback (dry run)
                const availableBackups = this.backupSystem.getAvailableBackups();
                if (availableBackups.length > 0) {
                    const rollbackTest = await this.backupSystem.testRollback(availableBackups[0].id);
                    testResults.tests.push({
                        name: 'rollback_test',
                        result: rollbackTest.success ? 'pass' : 'fail',
                        details: `Rollback test for ${availableBackups[0].id}`
                    });
                }
            } else {
                testResults.tests.push({
                    name: 'backup_system',
                    result: 'fail',
                    error: 'Backup system not available'
                });
                testResults.overallResult = 'fail';
            }

            // Test circuit breakers
            const cbStatus = this.getCircuitBreakerStatus();
            const cbTest = Object.keys(cbStatus).length > 0;
            testResults.tests.push({
                name: 'circuit_breakers',
                result: cbTest ? 'pass' : 'fail',
                details: `${Object.keys(cbStatus).length} circuit breakers monitored`
            });

        } catch (testError) {
            testResults.tests.push({
                name: 'test_execution',
                result: 'fail',
                error: testError.message
            });
            testResults.overallResult = 'fail';
        }

        return testResults;
    }
}

module.exports = EmergencyIntegration;
