// BMA Integration with Enhanced MCA and Complete API
// Location: C:\Projects\Progressive-Framework-v5\src\api\budgetRoutes.js

const express = require('express');
const BudgetManagementAgent = require('../agents/BudgetManagementAgent');

const router = express.Router();
const bma = new BudgetManagementAgent();

// ========================================
// BUDGET MANAGEMENT ENDPOINTS
// ========================================

/**
 * POST /api/budget/create
 * Create a new budget
 */
router.post('/create', async (req, res) => {
    try {
        const { userId, budgetName, totalBudget, period = 'monthly', customCategories, alertThreshold = 80 } = req.body;

        if (!userId || !totalBudget) {
            return res.status(400).json({
                success: false,
                error: 'userId and totalBudget are required'
            });
        }

        const response = await bma.processRequest(
            `Create a ${period} budget of $${totalBudget}${budgetName ? ` named ${budgetName}` : ''}`,
            { 
                userId,
                request: `Create a ${period} budget of $${totalBudget}`,
                budgetData: { budgetName, totalBudget, period, customCategories, alertThreshold }
            }
        );

        res.json({
            success: response.success,
            message: response.content,
            budgetId: response.metadata?.budgetId,
            confidence: response.confidence,
            processingTime: response.metadata?.processingTime
        });

    } catch (error) {
        console.error('Budget creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create budget',
            details: error.message
        });
    }
});

/**
 * POST /api/budget/expense
 * Track a new expense
 */
router.post('/expense', async (req, res) => {
    try {
        const { 
            userId, 
            amount, 
            category = 'other', 
            description = 'Expense',
            paymentMethod = 'unknown',
            tags = [],
            recurring = false,
            date = new Date().toISOString()
        } = req.body;

        if (!userId || !amount) {
            return res.status(400).json({
                success: false,
                error: 'userId and amount are required'
            });
        }

        const response = await bma.processRequest(
            `Track expense of $${amount} for ${category}${description !== 'Expense' ? ` - ${description}` : ''}`,
            {
                userId,
                request: `Track expense of $${amount} for ${category}`,
                expenseData: { amount, category, description, paymentMethod, tags, recurring, date }
            }
        );

        res.json({
            success: response.success,
            message: response.content,
            alerts: response.alerts || [],
            confidence: response.confidence,
            dataUpdated: response.metadata?.budgetDataUpdated || false
        });

    } catch (error) {
        console.error('Expense tracking error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to track expense',
            details: error.message
        });
    }
});

/**
 * GET /api/budget/analysis/:userId
 * Get budget analysis for user
 */
router.get('/analysis/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { budgetId } = req.query;

        const response = await bma.processRequest(
            `Analyze my current budget${budgetId ? ` with ID ${budgetId}` : ''}`,
            {
                userId,
                request: 'Analyze my current budget',
                analysisParams: { budgetId }
            }
        );

        res.json({
            success: response.success,
            analysis: response.content,
            data: response.metadata?.analysisResults || {},
            recommendations: response.recommendations || [],
            confidence: response.confidence
        });

    } catch (error) {
        console.error('Budget analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze budget',
            details: error.message
        });
    }
});

/**
 * POST /api/budget/savings-goal
 * Create or manage savings goal
 */
router.post('/savings-goal', async (req, res) => {
    try {
        const { 
            userId, 
            action = 'create',
            goalName,
            targetAmount,
            currentAmount = 0,
            targetDate,
            category = 'general',
            priority = 'medium'
        } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required'
            });
        }

        if (action === 'create' && (!goalName || !targetAmount || !targetDate)) {
            return res.status(400).json({
                success: false,
                error: 'goalName, targetAmount, and targetDate are required for creating goals'
            });
        }

        const response = await bma.processRequest(
            `${action} savings goal${goalName ? ` ${goalName}` : ''}${targetAmount ? ` for $${targetAmount}` : ''}`,
            {
                userId,
                request: `${action} savings goal`,
                goalData: { action, goalName, targetAmount, currentAmount, targetDate, category, priority }
            }
        );

        res.json({
            success: response.success,
            message: response.content,
            goalId: response.metadata?.goalId,
            confidence: response.confidence
        });

    } catch (error) {
        console.error('Savings goal error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to manage savings goal',
            details: error.message
        });
    }
});

/**
 * GET /api/budget/optimization/:userId
 * Get cost optimization suggestions
 */
router.get('/optimization/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const response = await bma.processRequest(
            'Optimize my costs and reduce expenses',
            {
                userId,
                request: 'Optimize my costs and reduce expenses'
            }
        );

        res.json({
            success: response.success,
            analysis: response.content,
            optimizations: response.optimizations || [],
            potentialSavings: response.potentialSavings || { total: 0, breakdown: [] },
            confidence: response.confidence
        });

    } catch (error) {
        console.error('Cost optimization error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate optimization suggestions',
            details: error.message
        });
    }
});

/**
 * GET /api/budget/advice/:userId
 * Get personalized financial advice
 */
router.get('/advice/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { type = 'general' } = req.query; // general, debt_reduction, investment, emergency_fund, etc.

        const response = await bma.processRequest(
            `Give me ${type} financial advice`,
            {
                userId,
                request: `Give me ${type} financial advice`,
                adviceParams: { type }
            }
        );

        res.json({
            success: response.success,
            advice: response.content,
            recommendations: response.recommendations || [],
            resources: response.resources || [],
            confidence: response.confidence
        });

    } catch (error) {
        console.error('Financial advice error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to provide financial advice',
            details: error.message
        });
    }
});

/**
 * GET /api/budget/comparison/:userId
 * Compare budgets (personal historical, demographic, optimal)
 */
router.get('/comparison/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { type = 'personal' } = req.query; // personal, demographic, optimal

        const response = await bma.processRequest(
            `Compare my budget with ${type} standards`,
            {
                userId,
                request: `Compare my budget with ${type} standards`,
                comparisonParams: { type }
            }
        );

        res.json({
            success: response.success,
            analysis: response.content,
            comparisonData: response.comparisonData || {},
            confidence: response.confidence
        });

    } catch (error) {
        console.error('Budget comparison error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to compare budgets',
            details: error.message
        });
    }
});

// ========================================
// BUDGET DATA MANAGEMENT
// ========================================

/**
 * GET /api/budget/list/:userId
 * Get all budgets for user
 */
router.get('/list/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { status = 'all' } = req.query; // all, active, archived

        // Get budget list (implement in BMA)
        const budgets = await bma.getUserBudgets(userId, status);

        res.json({
            success: true,
            budgets,
            count: budgets.length
        });

    } catch (error) {
        console.error('Budget list error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve budgets',
            details: error.message
        });
    }
});

/**
 * GET /api/budget/:budgetId
 * Get specific budget details
 */
router.get('/:budgetId', async (req, res) => {
    try {
        const { budgetId } = req.params;
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required'
            });
        }

        const budget = await bma.getBudgetById(budgetId, userId);

        if (!budget) {
            return res.status(404).json({
                success: false,
                error: 'Budget not found'
            });
        }

        // Include analysis with budget details
        const analysis = bma.performBudgetAnalysis(budget);

        res.json({
            success: true,
            budget,
            analysis
        });

    } catch (error) {
        console.error('Get budget error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve budget',
            details: error.message
        });
    }
});

/**
 * PUT /api/budget/:budgetId
 * Update budget
 */
router.put('/:budgetId', async (req, res) => {
    try {
        const { budgetId } = req.params;
        const { userId, ...updateData } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required'
            });
        }

        const updatedBudget = await bma.updateBudget(budgetId, userId, updateData);

        if (!updatedBudget) {
            return res.status(404).json({
                success: false,
                error: 'Budget not found or update failed'
            });
        }

        res.json({
            success: true,
            message: 'Budget updated successfully',
            budget: updatedBudget
        });

    } catch (error) {
        console.error('Update budget error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update budget',
            details: error.message
        });
    }
});

/**
 * DELETE /api/budget/:budgetId
 * Delete budget
 */
router.delete('/:budgetId', async (req, res) => {
    try {
        const { budgetId } = req.params;
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required'
            });
        }

        const deleted = await bma.deleteBudget(budgetId, userId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Budget not found'
            });
        }

        res.json({
            success: true,
            message: 'Budget deleted successfully'
        });

    } catch (error) {
        console.error('Delete budget error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete budget',
            details: error.message
        });
    }
});

// ========================================
// EXPENSE MANAGEMENT
// ========================================

/**
 * GET /api/budget/expenses/:userId
 * Get expenses for user
 */
router.get('/expenses/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { 
            category,
            startDate,
            endDate,
            limit = 50,
            sortBy = 'date',
            budgetId
        } = req.query;

        const expenses = await bma.getUserExpenses(userId, {
            category,
            startDate,
            endDate,
            limit: parseInt(limit),
            sortBy,
            budgetId
        });

        res.json({
            success: true,
            expenses,
            count: expenses.length
        });

    } catch (error) {
        console.error('Get expenses error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve expenses',
            details: error.message
        });
    }
});

/**
 * PUT /api/budget/expense/:expenseId
 * Update expense
 */
router.put('/expense/:expenseId', async (req, res) => {
    try {
        const { expenseId } = req.params;
        const { userId, ...updateData } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required'
            });
        }

        const updatedExpense = await bma.updateExpense(expenseId, userId, updateData);

        if (!updatedExpense) {
            return res.status(404).json({
                success: false,
                error: 'Expense not found'
            });
        }

        res.json({
            success: true,
            message: 'Expense updated successfully',
            expense: updatedExpense
        });

    } catch (error) {
        console.error('Update expense error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update expense',
            details: error.message
        });
    }
});

/**
 * DELETE /api/budget/expense/:expenseId
 * Delete expense
 */
router.delete('/expense/:expenseId', async (req, res) => {
    try {
        const { expenseId } = req.params;
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required'
            });
        }

        const deleted = await bma.deleteExpense(expenseId, userId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Expense not found'
            });
        }

        res.json({
            success: true,
            message: 'Expense deleted successfully'
        });

    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete expense',
            details: error.message
        });
    }
});

// ========================================
// SAVINGS GOALS MANAGEMENT
// ========================================

/**
 * GET /api/budget/goals/:userId
 * Get savings goals for user
 */
router.get('/goals/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { status = 'active' } = req.query;

        const goals = await bma.getUserSavingsGoals(userId, status);

        res.json({
            success: true,
            goals,
            count: goals.length
        });

    } catch (error) {
        console.error('Get savings goals error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve savings goals',
            details: error.message
        });
    }
});

/**
 * PUT /api/budget/goal/:goalId/progress
 * Update savings goal progress
 */
router.put('/goal/:goalId/progress', async (req, res) => {
    try {
        const { goalId } = req.params;
        const { userId, amount, action = 'add' } = req.body; // add or set

        if (!userId || amount === undefined) {
            return res.status(400).json({
                success: false,
                error: 'userId and amount are required'
            });
        }

        const updatedGoal = await bma.updateGoalProgress(goalId, userId, amount, action);

        if (!updatedGoal) {
            return res.status(404).json({
                success: false,
                error: 'Goal not found'
            });
        }

        res.json({
            success: true,
            message: 'Goal progress updated successfully',
            goal: updatedGoal
        });

    } catch (error) {
        console.error('Update goal progress error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update goal progress',
            details: error.message
        });
    }
});

// ========================================
// BUDGET ANALYTICS & INSIGHTS
// ========================================

/**
 * GET /api/budget/analytics/:userId
 * Get comprehensive budget analytics
 */
router.get('/analytics/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { timeRange = 30, includeGoals = true } = req.query; // days

        const analytics = await bma.getBudgetAnalytics(userId, {
            timeRange: parseInt(timeRange),
            includeGoals: includeGoals === 'true'
        });

        res.json({
            success: true,
            analytics,
            timeRange: parseInt(timeRange),
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Budget analytics error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate analytics',
            details: error.message
        });
    }
});

/**
 * GET /api/budget/insights/:userId
 * Get AI-generated budget insights
 */
router.get('/insights/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const response = await bma.processRequest(
            'Generate insights about my spending and budget patterns',
            {
                userId,
                request: 'Generate insights about my spending and budget patterns'
            }
        );

        res.json({
            success: response.success,
            insights: response.content,
            confidence: response.confidence,
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Budget insights error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate insights',
            details: error.message
        });
    }
});

// ========================================
// BUDGET CATEGORIES
// ========================================

/**
 * GET /api/budget/categories
 * Get available expense categories
 */
router.get('/categories', async (req, res) => {
    try {
        const categories = bma.expenseCategories;

        res.json({
            success: true,
            categories,
            count: Object.keys(categories).length
        });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve categories',
            details: error.message
        });
    }
});

/**
 * GET /api/budget/strategies
 * Get available budgeting strategies
 */
router.get('/strategies', async (req, res) => {
    try {
        const strategies = bma.budgetingStrategies;

        res.json({
            success: true,
            strategies,
            count: Object.keys(strategies).length
        });

    } catch (error) {
        console.error('Get strategies error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve strategies',
            details: error.message
        });
    }
});

module.exports = router;