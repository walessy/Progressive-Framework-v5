// test/agents/master_control_agent.test.js
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock EmergencyResponseSystem since it's a complex dependency
vi.mock('../../src/emergency/EmergencyResponseSystem', () => {
  const mockEmergencyInterface = {
    handleError: vi.fn().mockResolvedValue({ success: true, incidentId: 'test-incident-123' }),
    executeWithCircuitBreaker: vi.fn((agent, fn, ...args) => fn(...args)),
    getSystemHealth: vi.fn().mockReturnValue({ overall: 'healthy' }),
    getActiveIncidents: vi.fn().mockReturnValue([]),
    executeRollback: vi.fn().mockResolvedValue({ success: true, rollbackId: 'rollback-123' })
  };

  return vi.fn().mockImplementation(() => ({
    init: vi.fn().mockResolvedValue(true),
    getEmergencyInterface: vi.fn().mockReturnValue(mockEmergencyInterface),
    on: vi.fn(),
    circuitBreakers: new Map()
  }));
});

// Import after mocking
const MasterControlAgent = require('../../src/agents/MasterControlAgent.js');

describe('MasterControlAgent', () => {
  let agent;
  
  beforeEach(() => {
    vi.clearAllMocks();
    agent = new MasterControlAgent();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ========================================
  // STEP 1: METHOD DISCOVERY
  // ========================================
  
  describe('Method Discovery', () => {
    it('should expose core orchestration methods', () => {
      // These will fail and show us what methods actually exist
      expect(typeof agent.init).toBe('function');
      expect(typeof agent.processRequest).toBe('function');
      expect(typeof agent.analyzeRequest).toBe('function');
      expect(typeof agent.routeWithProtection).toBe('function');
      expect(typeof agent.executeAgentRequest).toBe('function');
    });

    it('should expose agent-specific handlers', () => {
      expect(typeof agent.handleNutritionRequest).toBe('function');
      expect(typeof agent.handleWorkoutRequest).toBe('function');
      expect(typeof agent.handleGeneralRequest).toBe('function');
    });

    it('should expose emergency management methods', () => {
      expect(typeof agent.getSystemHealth).toBe('function');
      expect(typeof agent.triggerEmergencyRollback).toBe('function');
      expect(typeof agent.handleCircuitOpen).toBe('function');
      expect(typeof agent.handleIncidentCreated).toBe('function');
    });

    it('should expose metrics methods', () => {
      expect(typeof agent.getBasicMetrics).toBe('function');
      expect(typeof agent.getEnhancedMetrics).toBe('function');
      expect(typeof agent.updateSuccessMetrics).toBe('function');
    });

    it('should expose utility methods', () => {
      expect(typeof agent.extractKeywords).toBe('function');
      expect(typeof agent.calculateComplexity).toBe('function');
      expect(typeof agent.calculateDomainScores).toBe('function');
      expect(typeof agent.getAgentsList).toBe('function');
    });
  });

  // ========================================
  // STEP 1: CONSTRUCTOR BEHAVIOR DISCOVERY
  // ========================================
  
  describe('Constructor Behavior Discovery', () => {
    it('should initialize core properties', () => {
      // Let failures show us actual property structure
      expect(agent.agents).toBeInstanceOf(Map);
      expect(agent.routingLogic).toBeDefined();
      expect(agent.metrics).toBeDefined();
      expect(agent.emergencySystem).toBeDefined();
      expect(agent.errorHistory).toEqual([]);
      expect(agent.systemHealth).toBe('healthy');
    });

    it('should have correct agents map structure', () => {
      // Discover actual agent registration structure
      expect(agent.agents.size).toBe(3); // This might fail and show actual size
      expect(agent.agents.has('MCA')).toBe(true);
      expect(agent.agents.has('NPA')).toBe(true);
      expect(agent.agents.has('WPA')).toBe(true);
    });

    it('should have correct routing logic structure', () => {
      // Discover routing logic properties
      const routing = agent.routingLogic;
      expect(routing.version).toBe('5.0.0');
      expect(routing.strategy).toBe('keyword_analysis');
      expect(routing.fallbackEnabled).toBe(true);
      expect(routing.collaborationEnabled).toBe(true);
      expect(routing.circuitBreakerEnabled).toBe(true);
    });

    it('should have correct initial metrics structure', () => {
      // Discover metrics object structure
      const metrics = agent.metrics;
      expect(metrics.totalRequests).toBe(0);
      expect(metrics.successfulRequests).toBe(0);
      expect(metrics.totalErrors).toBe(0);
      expect(metrics.averageResponseTime).toBe(0);
      expect(metrics.systemStartTime).toBeTypeOf('number');
    });
  });

  // ========================================
  // STEP 1: ASYNC INIT DISCOVERY
  // ========================================
  
  describe('Async Init Discovery', () => {
    it('should initialize emergency system asynchronously', async () => {
      // Discover init behavior
      const result = await agent.init();
      expect(result).toBe(true); // This might fail and show actual return
    });

    it('should handle init failure gracefully', async () => {
      // Mock emergency system init failure
      agent.emergencySystem.init.mockRejectedValue(new Error('Init failed'));
      
      const result = await agent.init();
      expect(result).toBe(false); // Discover error handling behavior
    });
  });

  // ========================================
  // STEP 1: REQUEST ANALYSIS DISCOVERY
  // ========================================
  
  describe('Request Analysis Discovery', () => {
    it('should analyze nutrition request correctly', () => {
      const message = 'I need help with meal planning and protein intake';
      const analysis = agent.analyzeRequest(message);
      
      // Discover analysis structure
      expect(analysis).toHaveProperty('originalMessage');
      expect(analysis).toHaveProperty('keywords');
      expect(analysis).toHaveProperty('domains');
      expect(analysis).toHaveProperty('selectedAgent');
      expect(analysis).toHaveProperty('confidence');
      expect(analysis).toHaveProperty('requiresCollaboration');
      expect(analysis).toHaveProperty('timestamp');
      
      // This might fail and show us actual selectedAgent logic
      expect(analysis.selectedAgent).toBe('NPA');
    });

    it('should analyze workout request correctly', () => {
      const message = 'I want to start strength training and build muscle';
      const analysis = agent.analyzeRequest(message);
      
      // Discover workout routing
      expect(analysis.selectedAgent).toBe('WPA');
    });

    it('should handle forced agent selection', () => {
      const message = 'general question';
      const analysis = agent.analyzeRequest(message, 'NPA');
      
      // Discover forced agent behavior
      expect(analysis.selectedAgent).toBe('NPA');
      expect(analysis.confidence).toBe(1.0);
    });
  });

  // ========================================
  // STEP 1: KEYWORD EXTRACTION DISCOVERY
  // ========================================
  
  describe('Keyword Extraction Discovery', () => {
    it('should extract keywords correctly', () => {
      const message = 'I need help with protein and workout plans!';
      const keywords = agent.extractKeywords(message);
      
      // Discover keyword processing
      expect(Array.isArray(keywords)).toBe(true);
      expect(keywords).toContain('protein');
      expect(keywords).toContain('workout');
      expect(keywords).toContain('plans');
      expect(keywords).not.toContain('and'); // Should filter short words
      expect(keywords).not.toContain('!'); // Should remove punctuation
    });

    it('should handle empty messages', () => {
      const keywords = agent.extractKeywords('');
      expect(keywords).toEqual([]);
    });
  });

  // ========================================
  // STEP 1: DOMAIN SCORING DISCOVERY  
  // ========================================
  
  describe('Domain Scoring Discovery', () => {
    it('should score nutrition keywords correctly', () => {
      const keywords = ['nutrition', 'protein', 'meal', 'calories'];
      const scores = agent.calculateDomainScores(keywords);
      
      // Discover scoring structure and logic
      expect(scores).toHaveProperty('nutrition');
      expect(scores).toHaveProperty('fitness');
      expect(scores.nutrition).toBeGreaterThan(0);
      expect(scores.nutrition).toBeGreaterThan(scores.fitness);
    });

    it('should score fitness keywords correctly', () => {
      const keywords = ['workout', 'exercise', 'strength', 'gym'];
      const scores = agent.calculateDomainScores(keywords);
      
      expect(scores.fitness).toBeGreaterThan(0);
      expect(scores.fitness).toBeGreaterThan(scores.nutrition);
    });
  });

  // ========================================
  // STEP 1: COMPLEXITY CALCULATION DISCOVERY
  // ========================================
  
  describe('Complexity Calculation Discovery', () => {
    it('should calculate complexity for short messages', () => {
      const complexity = agent.calculateComplexity('Help me');
      expect(typeof complexity).toBe('number');
      expect(complexity).toBeLessThan(0.5); // Discover complexity range
    });

    it('should calculate higher complexity for long messages with questions', () => {
      const longMessage = 'Can you help me create a comprehensive meal plan that includes high protein foods and also design a workout routine that focuses on strength training and muscle building? I have several dietary restrictions and fitness goals.';
      const complexity = agent.calculateComplexity(longMessage);
      
      expect(complexity).toBeGreaterThan(0.3); // Discover complexity scaling
      expect(complexity).toBeLessThanOrEqual(1.0); // Should be capped at 1.0
    });
  });

  // ========================================
  // STEP 1: AGENT EXECUTION DISCOVERY
  // ========================================
  
  describe('Agent Execution Discovery', () => {
    it('should execute NPA requests correctly', async () => {
      const requestData = { 
        message: 'nutrition question',
        timestamp: Date.now() 
      };
      const analysis = { confidence: 0.8, keywords: ['nutrition'] };
      
      const result = await agent.executeAgentRequest('NPA', requestData, analysis);
      
      // Discover response structure
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('agent');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('processingTime');
      expect(result).toHaveProperty('data');
      
      expect(result.success).toBe(true);
      expect(result.agent).toBe('NPA');
      expect(typeof result.message).toBe('string');
    });

    it('should execute WPA requests correctly', async () => {
      const requestData = { 
        message: 'workout question',
        timestamp: Date.now() 
      };
      const analysis = { confidence: 0.7, keywords: ['workout'] };
      
      const result = await agent.executeAgentRequest('WPA', requestData, analysis);
      
      expect(result.success).toBe(true);
      expect(result.agent).toBe('WPA');
      expect(typeof result.message).toBe('string');
    });

    it('should execute MCA requests correctly', async () => {
      const requestData = { 
        message: 'general question',
        timestamp: Date.now() 
      };
      const analysis = { confidence: 0.5, keywords: ['general'], domains: [] };
      
      const result = await agent.executeAgentRequest('MCA', requestData, analysis);
      
      expect(result.success).toBe(true);
      expect(result.agent).toBe('MCA');
    });

    it('should throw error for unknown agent type', async () => {
      const requestData = { message: 'test', timestamp: Date.now() };
      const analysis = { keywords: [] };
      
      await expect(agent.executeAgentRequest('UNKNOWN', requestData, analysis))
        .rejects.toThrow('Unknown agent type: UNKNOWN');
    });
  });

  // ========================================
  // STEP 1: SYSTEM HEALTH DISCOVERY
  // ========================================
  
  describe('System Health Discovery', () => {
    it('should return system health information', async () => {
      const health = await agent.getSystemHealth();
      
      // Discover health response structure
      expect(health).toHaveProperty('overall');
      expect(health).toHaveProperty('emergencySystem');
      expect(health).toHaveProperty('activeIncidents');
      expect(health).toHaveProperty('circuitBreakers');
      expect(health).toHaveProperty('uptime');
      expect(health).toHaveProperty('metrics');
      expect(health).toHaveProperty('timestamp');
      
      expect(health.overall).toBe('healthy');
    });

    it('should get circuit breaker status', () => {
      const status = agent.getCircuitBreakerStatus();
      expect(typeof status).toBe('object');
    });
  });

  // ========================================
  // STEP 1: METRICS DISCOVERY
  // ========================================
  
  describe('Metrics Discovery', () => {
    it('should return basic metrics', () => {
      const metrics = agent.getBasicMetrics();
      
      // Discover metrics structure
      expect(metrics).toHaveProperty('total_requests');
      expect(metrics).toHaveProperty('successful_requests');
      expect(metrics).toHaveProperty('total_errors');
      expect(metrics).toHaveProperty('average_response_time');
      expect(metrics).toHaveProperty('success_rate');
      expect(metrics).toHaveProperty('uptime_seconds');
      expect(metrics).toHaveProperty('system_health');
      
      expect(metrics.total_requests).toBe(0);
      expect(metrics.system_health).toBe('healthy');
    });

    it('should return enhanced metrics', () => {
      const metrics = agent.getEnhancedMetrics();
      
      // Should include emergency section
      expect(metrics).toHaveProperty('emergency');
      expect(metrics.emergency).toHaveProperty('systemHealth');
      expect(metrics.emergency).toHaveProperty('activeIncidents');
      expect(metrics.emergency).toHaveProperty('circuitBreakers');
    });

    it('should update success metrics correctly', () => {
      const startTime = Date.now() - 100; // 100ms ago
      agent.updateSuccessMetrics(startTime);
      
      const metrics = agent.getBasicMetrics();
      expect(metrics.successful_requests).toBe(1);
      expect(metrics.average_response_time).toBeGreaterThan(0);
    });
  });

  // ========================================
  // STEP 1: AGENTS LIST DISCOVERY
  // ========================================
  
  describe('Agents List Discovery', () => {
    it('should return list of available agents', () => {
      const agentsList = agent.getAgentsList();
      
      expect(Array.isArray(agentsList)).toBe(true);
      expect(agentsList).toHaveLength(3);
      
      // Check agent structure
      const mcaAgent = agentsList.find(a => a.type === 'MCA');
      expect(mcaAgent).toHaveProperty('name');
      expect(mcaAgent).toHaveProperty('type');
      expect(mcaAgent).toHaveProperty('capabilities');
      expect(mcaAgent).toHaveProperty('specialties');
      expect(mcaAgent).toHaveProperty('status');
      expect(mcaAgent).toHaveProperty('circuit_breaker_status');
    });
  });

  // ========================================
  // STEP 1: EMERGENCY ROLLBACK DISCOVERY
  // ========================================
  
  describe('Emergency Rollback Discovery', () => {
    it('should trigger emergency rollback', async () => {
      const criteria = { reason: 'test' };
      const result = await agent.triggerEmergencyRollback(criteria);
      
      // Discover rollback response structure
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('rollbackId');
      expect(result.success).toBe(true);
    });
  });
});

// Additional test categories to implement after initial discovery:
// - Full request processing flow tests
// - Error handling and fallback strategy tests  
// - Circuit breaker integration tests
// - Emergency event handler tests
// - Performance tests with large datasets
// - Edge cases and error scenarios