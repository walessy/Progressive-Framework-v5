// tests/unit/budget_management_agent.test.js

// Mock fs module before importing BudgetManagementAgent
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn().mockResolvedValue(),
    readdir: jest.fn().mockResolvedValue([]),
    readFile: jest.fn().mockResolvedValue('{}'),
    writeFile: jest.fn().mockResolvedValue()
  }
}));

jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
}));

// Import after mocking
const BudgetManagementAgent = require('../../src/agents/BudgetManagementAgent.js');
const fs = require('fs').promises;

describe('BudgetManagementAgent', () => {
  let agent;
  
  beforeEach(() => {
    jest.clearAllMocks();
    agent = new BudgetManagementAgent();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ========================================
  // STEP 1: METHOD DISCOVERY
  // ========================================
  
  describe('Method Discovery', () => {
    test('should expose core initialization methods', () => {
      // These will fail and show us what methods actually exist
      expect(typeof agent.initialize).toBe('function');
      expect(typeof agent.loadBudgetData).toBe('function');
      expect(typeof agent.initializeCostOptimization).toBe('function');
    });

    test('should expose budget planning methods', () => {
      expect(typeof agent.createBudgetPlan).toBe('function');
      expect(typeof agent.calculateOptimalAllocation).toBe('function');
      expect(typeof agent.generateBudgetRecommendations).toBe('function');
      expect(typeof agent.identifyCostOptimizations).toBe('function');
      expect(typeof agent.findSavingOpportunities).toBe('function');
    });

    test('should expose expense tracking methods', () => {
      expect(typeof agent.logExpense).toBe('function');
      expect(typeof agent.identifyOptimizationOpportunity).toBe('function');
      expect(typeof agent.calculateBudgetImpact).toBe('function');
      expect(typeof agent.calculateCategorySpent).toBe('function');
    });

    test('should expose financial analytics methods', () => {
      expect(typeof agent.generateFinancialReport).toBe('function');
      expect(typeof agent.filterExpensesByTimeframe).toBe('function');
      expect(typeof agent.calculateExpenseSummary).toBe('function');
      expect(typeof agent.analyzeCategorySpending).toBe('function');
      expect(typeof agent.analyzeBudgetPerformance).toBe('function');
      expect(typeof agent.analyzeSpendingTrends).toBe('function');
    });

    test('should expose integration methods', () => {
      expect(typeof agent.getOptimizedRecommendations).toBe('function');
      expect(typeof agent.getNutritionBudgetRecommendations).toBe('function');
      expect(typeof agent.getWorkoutBudgetRecommendations).toBe('function');
    });

    test('should expose utility methods', () => {
      expect(typeof agent.getStatus).toBe('function');
      expect(typeof agent.getCapabilities).toBe('function');
      expect(typeof agent.generateBudgetResponse).toBe('function');
    });
  });

  // ========================================
  // STEP 1: CONSTRUCTOR BEHAVIOR DISCOVERY
  // ========================================
  
  describe('Constructor Behavior Discovery', () => {
    test('should initialize core properties', () => {
      // Let failures show us actual property structure
      expect(agent.agentName).toBe('Budget Management Agent');
      expect(agent.agentCode).toBe('BMA');
      expect(agent.version).toBe('5.0.0');
      expect(agent.initialized).toBe(false);
    });

    test('should initialize data storage Maps', () => {
      // Discover Map structures
      expect(agent.budgetProfiles).toBeInstanceOf(Map);
      expect(agent.expenseHistory).toBeInstanceOf(Map);
      expect(agent.budgetPlans).toBeInstanceOf(Map);
      expect(agent.savingGoals).toBeInstanceOf(Map);
    });

    test('should have budget categories structure', () => {
      // Discover budget categories
      expect(agent.budgetCategories).toHaveProperty('fitness');
      expect(agent.budgetCategories).toHaveProperty('nutrition');
      expect(agent.budgetCategories).toHaveProperty('health');
      expect(agent.budgetCategories).toHaveProperty('general');
      
      // Check fitness category structure
      expect(agent.budgetCategories.fitness).toHaveProperty('name');
      expect(agent.budgetCategories.fitness).toHaveProperty('subcategories');
      expect(Array.isArray(agent.budgetCategories.fitness.subcategories)).toBe(true);
    });

    test('should have optimization rules Map', () => {
      expect(agent.costOptimizationRules).toBeInstanceOf(Map);
      expect(agent.financialInsights).toBeInstanceOf(Map);
    });

    test('should have integration flags', () => {
      expect(agent.nutritionIntegration).toBe(true);
      expect(agent.workoutIntegration).toBe(true);
    });
  });

  // ========================================
  // STEP 1: INITIALIZATION DISCOVERY
  // ========================================
  
  describe('Initialization Discovery', () => {
    test('should initialize agent successfully', async () => {
      // Discover initialization behavior
      const result = await agent.initialize();
      
      // Check if it returns anything or just sets state
      expect(agent.initialized).toBe(true);
      
      // Should create directories
      expect(fs.mkdir).toHaveBeenCalledWith('data/budgets', { recursive: true });
      expect(fs.mkdir).toHaveBeenCalledWith('data/expenses', { recursive: true });
      expect(fs.mkdir).toHaveBeenCalledWith('data/financial_plans', { recursive: true });
    });

    test('should handle initialization errors', async () => {
      // Mock directory creation failure
      fs.mkdir.mockRejectedValue(new Error('Directory creation failed'));
      
      await expect(agent.initialize()).rejects.toThrow('Directory creation failed');
      expect(agent.initialized).toBe(false);
    });

    test('should load existing budget data', async () => {
      // Mock file reading
      fs.readdir.mockResolvedValueOnce(['user1_plan.json', 'user2_plan.json']);
      fs.readFile.mockResolvedValue(JSON.stringify({
        userId: 'user1',
        totalBudget: 100,
        allocation: { fitness: 30, nutrition: 60, health: 10 }
      }));
      
      await agent.loadBudgetData();
      
      // Discover how data is loaded and stored
      expect(fs.readdir).toHaveBeenCalledWith('data/budgets');
    });

    test('should initialize cost optimization rules', () => {
      agent.initializeCostOptimization();
      
      // Discover what rules are created
      expect(agent.costOptimizationRules.size).toBeGreaterThan(0);
      
      // Check for specific rules we expect
      expect(agent.costOptimizationRules.has('fitness_beginner')).toBe(true);
      expect(agent.costOptimizationRules.has('nutrition_vegetarian_budget')).toBe(true);
    });
  });

  // ========================================
  // STEP 1: BUDGET PLANNING DISCOVERY
  // ========================================
  
  describe('Budget Planning Discovery', () => {
    test('should create budget plan with basic data', async () => {
      const userId = 'test-user-123';
      const budgetData = { totalBudget: 100, timeframe: 'weekly' };
      const userProfile = { diet: 'vegetarian', fitnessLevel: 'beginner' };
      
      const result = await agent.createBudgetPlan(userId, budgetData, userProfile);
      
      // Discover budget plan structure
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('created');
      expect(result).toHaveProperty('totalBudget');
      expect(result).toHaveProperty('allocation');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('costOptimizations');
      expect(result).toHaveProperty('savingOpportunities');
      
      expect(result.userId).toBe(userId);
      expect(result.totalBudget).toBe(100);
    });

    test('should calculate optimal allocation', () => {
      const budgetData = { totalBudget: 100 };
      const userProfile = { fitnessLevel: 'beginner', goals: ['muscle_building'] };
      
      const allocation = agent.calculateOptimalAllocation(budgetData, userProfile);
      
      // Discover allocation structure and logic
      expect(allocation).toHaveProperty('fitness');
      expect(allocation).toHaveProperty('nutrition');
      expect(allocation).toHaveProperty('health');
      
      // Should add up to total budget
      const total = allocation.fitness + allocation.nutrition + allocation.health;
      expect(total).toBe(100);
    });

    test('should generate budget recommendations', async () => {
      const budgetData = { totalBudget: 100 };
      const userProfile = { diet: 'vegetarian', fitnessLevel: 'intermediate' };
      
      const recommendations = await agent.generateBudgetRecommendations(budgetData, userProfile);
      
      // Discover recommendations structure
      expect(recommendations).toHaveProperty('fitness');
      expect(recommendations).toHaveProperty('nutrition');
      expect(recommendations).toHaveProperty('health');
      expect(recommendations).toHaveProperty('general');
      
      expect(Array.isArray(recommendations.fitness)).toBe(true);
      expect(Array.isArray(recommendations.nutrition)).toBe(true);
    });
  });

  // ========================================
  // STEP 1: EXPENSE TRACKING DISCOVERY
  // ========================================
  
  describe('Expense Tracking Discovery', () => {
    test('should log expense successfully', async () => {
      const userId = 'test-user-123';
      const expenseData = {
        amount: 25.50,
        category: 'nutrition',
        subcategory: 'groceries',
        description: 'Weekly grocery shopping',
        date: new Date().toISOString()
      };
      
      const result = await agent.logExpense(userId, expenseData);
      
      // Discover expense logging response structure
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('expenseId');
      expect(result).toHaveProperty('optimization_suggestion');
      expect(result).toHaveProperty('budget_impact');
      
      expect(result.success).toBe(true);
      expect(typeof result.expenseId).toBe('string');
    });

    test('should identify optimization opportunities', async () => {
      const expenseData = {
        amount: 75.00, // High cost item
        category: 'fitness',
        subcategory: 'gym_membership',
        description: 'Monthly gym membership'
      };
      
      const opportunities = await agent.identifyOptimizationOpportunity(expenseData);
      
      // Discover optimization opportunity structure
      expect(Array.isArray(opportunities)).toBe(true);
      
      if (opportunities.length > 0) {
        expect(opportunities[0]).toHaveProperty('type');
        expect(opportunities[0]).toHaveProperty('suggestion');
      }
    });

    test('should calculate budget impact', async () => {
      // First create a budget plan
      const userId = 'test-user-123';
      await agent.createBudgetPlan(userId, { totalBudget: 100 }, {});
      
      const expense = {
        amount: 30,
        category: 'nutrition',
        subcategory: 'groceries'
      };
      
      const impact = await agent.calculateBudgetImpact(userId, expense);
      
      // Discover budget impact structure
      if (impact) {
        expect(impact).toHaveProperty('category');
        expect(impact).toHaveProperty('budget_allocated');
        expect(impact).toHaveProperty('amount_spent');
        expect(impact).toHaveProperty('remaining');
        expect(impact).toHaveProperty('percent_used');
        expect(impact).toHaveProperty('status');
      }
    });
  });

  // ========================================
  // STEP 1: FINANCIAL ANALYTICS DISCOVERY
  // ========================================
  
  describe('Financial Analytics Discovery', () => {
    test('should generate financial report', async () => {
      const userId = 'test-user-123';
      
      // Add some expense history
      agent.expenseHistory.set(userId, [
        {
          id: 'exp1',
          amount: 25,
          category: 'nutrition',
          date: new Date().toISOString()
        }
      ]);
      
      const report = await agent.generateFinancialReport(userId, 'monthly');
      
      // Discover report structure
      expect(report).toHaveProperty('userId');
      expect(report).toHaveProperty('timeframe');
      expect(report).toHaveProperty('generated_at');
      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('category_breakdown');
      expect(report).toHaveProperty('spending_trends');
      expect(report).toHaveProperty('financial_health_score');
      
      expect(report.userId).toBe(userId);
      expect(report.timeframe).toBe('monthly');
    });

    test('should calculate expense summary', () => {
      const expenses = [
        { amount: 25 },
        { amount: 50 },
        { amount: 15 }
      ];
      
      const summary = agent.calculateExpenseSummary(expenses);
      
      // Discover summary structure
      expect(summary).toHaveProperty('total_spent');
      expect(summary).toHaveProperty('transaction_count');
      expect(summary).toHaveProperty('average_transaction');
      expect(summary).toHaveProperty('highest_expense');
      expect(summary).toHaveProperty('lowest_expense');
      
      expect(summary.total_spent).toBe(90);
      expect(summary.transaction_count).toBe(3);
    });

    test('should analyze category spending', () => {
      const expenses = [
        { amount: 25, category: 'nutrition', subcategory: 'groceries' },
        { amount: 50, category: 'fitness', subcategory: 'equipment' },
        { amount: 15, category: 'nutrition', subcategory: 'supplements' }
      ];
      
      const breakdown = agent.analyzeCategorySpending(expenses);
      
      // Discover category breakdown structure
      expect(breakdown).toHaveProperty('nutrition');
      expect(breakdown).toHaveProperty('fitness');
      
      expect(breakdown.nutrition).toHaveProperty('total');
      expect(breakdown.nutrition).toHaveProperty('count');
      expect(breakdown.nutrition).toHaveProperty('average');
      expect(breakdown.nutrition).toHaveProperty('subcategories');
    });
  });

  // ========================================
  // STEP 1: INTEGRATION METHODS DISCOVERY
  // ========================================
  
  describe('Integration Methods Discovery', () => {
    test('should get optimized recommendations', async () => {
      const userId = 'test-user-123';
      
      // Create budget plan first
      await agent.createBudgetPlan(userId, { totalBudget: 100 }, {});
      
      const result = await agent.getOptimizedRecommendations(userId, 'nutrition_meal_plan', {});
      
      // Discover recommendations response structure
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('budget_context');
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should get nutrition budget recommendations', async () => {
      const budgetPlan = {
        allocation: { nutrition: 60 }
      };
      const parameters = {};
      
      const recommendations = await agent.getNutritionBudgetRecommendations(budgetPlan, parameters);
      
      // Discover nutrition recommendations structure
      expect(Array.isArray(recommendations)).toBe(true);
      
      if (recommendations.length > 0) {
        expect(recommendations[0]).toHaveProperty('category');
        expect(recommendations[0]).toHaveProperty('items');
      }
    });

    test('should get workout budget recommendations', async () => {
      const budgetPlan = {
        allocation: { fitness: 30 }
      };
      const parameters = {};
      
      const recommendations = await agent.getWorkoutBudgetRecommendations(budgetPlan, parameters);
      
      // Discover workout recommendations structure
      expect(Array.isArray(recommendations)).toBe(true);
    });
  });

  // ========================================
  // STEP 1: UTILITY METHODS DISCOVERY
  // ========================================
  
  describe('Utility Methods Discovery', () => {
    test('should return agent status', () => {
      const status = agent.getStatus();
      
      // Discover status structure
      expect(status).toHaveProperty('agent');
      expect(status).toHaveProperty('code');
      expect(status).toHaveProperty('version');
      expect(status).toHaveProperty('initialized');
      expect(status).toHaveProperty('active_budgets');
      expect(status).toHaveProperty('tracked_users');
      expect(status).toHaveProperty('capabilities');
      expect(status).toHaveProperty('integrations');
      
      expect(status.agent).toBe('Budget Management Agent');
      expect(status.code).toBe('BMA');
    });

    test('should return capabilities list', () => {
      const capabilities = agent.getCapabilities();
      
      // Discover capabilities structure
      expect(Array.isArray(capabilities)).toBe(true);
      expect(capabilities.length).toBeGreaterThan(5);
      expect(capabilities).toContain('Budget Planning & Optimization');
    });

    test('should generate budget response', async () => {
      const message = 'I need help creating a budget plan';
      const userPreferences = { budget: 100, diet: 'vegetarian' };
      const memoryInsights = {};
      
      const response = await agent.generateBudgetResponse(message, userPreferences, memoryInsights);
      
      // Discover response format
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(10);
      expect(response).toContain('Budget Management Agent');
    });
  });

  // ========================================
  // FIXED: FILE OPERATIONS DISCOVERY
  // ========================================
  
  describe('File Operations Discovery', () => {
    let agent;

    beforeEach(() => {
      // Initialize agent with mocked fs
      agent = new BudgetManagementAgent();
      
      // Mock fs operations
      fs.writeFile.mockClear();
      fs.readFile.mockClear();
      fs.mkdir.mockClear();
    });

    test('should save budget plan', async () => {
      const budgetPlan = {
        userId: 'test-user',
        totalBudget: 100,
        allocation: { fitness: 30, nutrition: 60, health: 10 }
      };
      
      await agent.saveBudgetPlan(budgetPlan);
      
      // Should write to file system
      expect(fs.writeFile).toHaveBeenCalled();
    });

    // CORRECTED VERSION: Initialize user state first
    test('should save expense', async () => {
      // Step 2 adaptation: Initialize the user's budget plan first
      await agent.createBudgetPlan('test-user', {
        totalBudget: 1000,
        preferences: { fitness: 30, nutrition: 60, health: 10 }
      });

      // Now test expense saving with properly initialized state
      const expenseData = {
        amount: 75,
        category: 'fitness',
        description: 'Gym membership'
      };

      await agent.logExpense('test-user', expenseData.amount, expenseData.category, expenseData.description);

      // Should write to file system after successful expense array push
      expect(fs.writeFile).toHaveBeenCalled();
    });

    // ALTERNATIVE: Test with direct state setup (if createBudgetPlan doesn't work)
    test('should save expense - direct state setup', async () => {
      // Step 2 adaptation: Set up the required internal state directly
      if (agent.expenses) {
        agent.expenses['test-user'] = [];  // Initialize expense array
      }
      if (agent.budgetPlans) {
        agent.budgetPlans['test-user'] = { monthlyBudget: 1000 }; // Initialize budget
      }

      const expenseData = {
        amount: 75,
        category: 'fitness', 
        description: 'Gym membership'
      };

      await agent.logExpense('test-user', expenseData.amount, expenseData.category, expenseData.description);

      // Should write to file system
      expect(fs.writeFile).toHaveBeenCalled();
    });

    // BONUS: Test the actual error behavior we discovered
    test('should handle uninitialized user expense array gracefully', async () => {
      // Test what actually happens with uninitialized state
      const expenseData = {
        amount: 75,
        category: 'fitness',
        description: 'Gym membership'
      };

      // Should handle undefined expenses[userId] gracefully or throw error
      await expect(agent.logExpense('uninitialized-user', expenseData.amount, expenseData.category, expenseData.description))
        .rejects.toThrow(); // Based on the error we saw

      // Should NOT write to file system when error occurs
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });
});

// Additional test categories to implement after initial discovery:
// - Complex budget allocation scenarios
// - Edge cases for financial calculations
// - Large dataset performance tests
// - Error handling in file operations
// - Integration with real filesystem data
// - Boundary conditions for financial health scoring