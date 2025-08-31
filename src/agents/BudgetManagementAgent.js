// Progressive Framework V5 - Enhanced Budget Management Agent
// Option 4: Complete Financial Ecosystem Integration

const fs = require('fs').promises;
const path = require('path');

class EnhancedBudgetManagementAgent {
    constructor() {
        this.agentName = 'Budget Management Agent';
        this.agentCode = 'BMA';
        this.version = '5.0.0';
        
        // Financial data storage
        this.budgetProfiles = new Map();
        this.expenseHistory = new Map();
        this.budgetPlans = new Map();
        this.savingGoals = new Map();
        
        // Budget categories and tracking
        this.budgetCategories = {
            fitness: {
                name: 'Fitness & Equipment',
                subcategories: ['gym_membership', 'home_equipment', 'workout_clothes', 'supplements']
            },
            nutrition: {
                name: 'Food & Nutrition',
                subcategories: ['groceries', 'supplements', 'meal_prep', 'dining_out']
            },
            health: {
                name: 'Health & Wellness',
                subcategories: ['medical', 'supplements', 'health_apps', 'wellness_services']
            },
            general: {
                name: 'General Health Spending',
                subcategories: ['miscellaneous', 'emergency_health']
            }
        };
        
        // Cost optimization rules and recommendations
        this.costOptimizationRules = new Map();
        this.financialInsights = new Map();
        
        // Integration with other agents
        this.nutritionIntegration = true;
        this.workoutIntegration = true;
        
        this.initialized = false;
    }

    async initialize() {
        console.log('💰 Initializing Enhanced Budget Management Agent...');
        
        try {
            // Create budget data directories
            await fs.mkdir('data/budgets', { recursive: true });
            await fs.mkdir('data/expenses', { recursive: true });
            await fs.mkdir('data/financial_plans', { recursive: true });
            
            // Load existing budget data
            await this.loadBudgetData();
            
            // Initialize cost optimization rules
            this.initializeCostOptimization();
            
            this.initialized = true;
            console.log('✅ Enhanced Budget Management Agent ready');
            
        } catch (error) {
            console.error('❌ BMA initialization error:', error);
            throw error;
        }
    }

    async loadBudgetData() {
        try {
            // Load existing budget profiles
            const budgetFiles = await fs.readdir('data/budgets');
            let loadedProfiles = 0;
            
            for (const file of budgetFiles) {
                if (file.endsWith('.json')) {
                    const filePath = path.join('data/budgets', file);
                    const content = await fs.readFile(filePath, 'utf8');
                    const budgetData = JSON.parse(content);
                    
                    this.budgetProfiles.set(budgetData.userId, budgetData);
                    loadedProfiles++;
                }
            }
            
            // Load expense history
            const expenseFiles = await fs.readdir('data/expenses');
            let loadedExpenses = 0;
            
            for (const file of expenseFiles) {
                if (file.endsWith('.json')) {
                    const filePath = path.join('data/expenses', file);
                    const content = await fs.readFile(filePath, 'utf8');
                    const expenseData = JSON.parse(content);
                    
                    if (!this.expenseHistory.has(expenseData.userId)) {
                        this.expenseHistory.set(expenseData.userId, []);
                    }
                    this.expenseHistory.get(expenseData.userId).push(...expenseData.expenses);
                    loadedExpenses++;
                }
            }
            
            console.log(`💰 Loaded ${loadedProfiles} budget profiles and ${loadedExpenses} expense records`);
            
        } catch (error) {
            console.log('📝 Starting with fresh budget data');
        }
    }

    initializeCostOptimization() {
        // Fitness cost optimization rules
        this.costOptimizationRules.set('fitness_beginner', {
            maxBudget: 50,
            recommendations: [
                'Start with bodyweight exercises (free)',
                'Use resistance bands ($15-25)',
                'Try free YouTube workout videos',
                'Consider used equipment marketplace'
            ],
            costSavings: '80-90% vs gym membership'
        });

        this.costOptimizationRules.set('fitness_intermediate', {
            maxBudget: 150,
            recommendations: [
                'Home gym setup: adjustable dumbbells ($50-80)',
                'Pull-up bar ($20-30)',
                'Yoga mat ($15-25)',
                'Basic equipment over gym membership'
            ],
            costSavings: '60-70% vs premium gym'
        });

        // Nutrition cost optimization rules
        this.costOptimizationRules.set('nutrition_vegetarian_budget', {
            maxBudget: 50,
            recommendations: [
                'Bulk dried beans and lentils ($2-3/lb)',
                'Brown rice in bulk ($1.50/lb)',
                'Seasonal vegetables',
                'Protein powder for convenience ($30-40/month)'
            ],
            costSavings: '40-50% vs meat-based diet'
        });

        this.costOptimizationRules.set('nutrition_muscle_building', {
            maxBudget: 80,
            recommendations: [
                'Greek yogurt in bulk ($15-20/week)',
                'Quinoa and lentil combinations',
                'Peanut butter for calories ($5-8/jar)',
                'Seasonal protein-rich vegetables'
            ],
            costSavings: '30-40% vs pre-made protein foods'
        });
    }

    // ========================================
    // BUDGET PLANNING AND ANALYSIS
    // ========================================

    async createBudgetPlan(userId, budgetData, userProfile = {}) {
        console.log(`💰 Creating budget plan for user: ${userId}`);
        
        const budgetPlan = {
            userId: userId,
            created: new Date().toISOString(),
            totalBudget: budgetData.totalBudget || 100,
            timeframe: budgetData.timeframe || 'weekly',
            preferences: {
                diet: userProfile.diet || 'general',
                fitnessLevel: userProfile.fitnessLevel || 'beginner',
                goals: userProfile.goals || []
            },
            allocation: this.calculateOptimalAllocation(budgetData, userProfile),
            recommendations: await this.generateBudgetRecommendations(budgetData, userProfile),
            costOptimizations: this.identifyCostOptimizations(budgetData, userProfile),
            savingOpportunities: this.findSavingOpportunities(budgetData, userProfile)
        };

        // Store budget plan
        this.budgetPlans.set(userId, budgetPlan);
        await this.saveBudgetPlan(budgetPlan);
        
        return budgetPlan;
    }

    calculateOptimalAllocation(budgetData, userProfile) {
        const totalBudget = budgetData.totalBudget || 100;
        const allocation = {};
        
        // Base allocation percentages
        let fitnessPercent = 0.30; // 30% for fitness
        let nutritionPercent = 0.60; // 60% for nutrition
        let healthPercent = 0.10; // 10% for general health
        
        // Adjust based on user goals
        if (userProfile.goals?.includes('muscle_building')) {
            nutritionPercent += 0.10;
            fitnessPercent -= 0.05;
            healthPercent -= 0.05;
        }
        
        if (userProfile.goals?.includes('weight_loss')) {
            fitnessPercent += 0.10;
            nutritionPercent -= 0.10;
        }
        
        // Adjust based on fitness level
        if (userProfile.fitnessLevel === 'beginner') {
            fitnessPercent -= 0.10;
            nutritionPercent += 0.10;
        } else if (userProfile.fitnessLevel === 'advanced') {
            fitnessPercent += 0.10;
            nutritionPercent -= 0.10;
        }
        
        allocation.fitness = Math.round(totalBudget * fitnessPercent);
        allocation.nutrition = Math.round(totalBudget * nutritionPercent);
        allocation.health = Math.round(totalBudget * healthPercent);
        
        // Ensure total matches budget
        const allocatedTotal = allocation.fitness + allocation.nutrition + allocation.health;
        if (allocatedTotal !== totalBudget) {
            allocation.nutrition += (totalBudget - allocatedTotal);
        }
        
        console.log(`💡 Optimal allocation for $${totalBudget}: Fitness: $${allocation.fitness}, Nutrition: $${allocation.nutrition}, Health: $${allocation.health}`);
        
        return allocation;
    }

    async generateBudgetRecommendations(budgetData, userProfile) {
        const recommendations = {
            fitness: [],
            nutrition: [],
            health: [],
            general: []
        };

        const totalBudget = budgetData.totalBudget || 100;
        const diet = userProfile.diet || 'general';
        const fitnessLevel = userProfile.fitnessLevel || 'beginner';

        // Fitness recommendations based on budget
        if (totalBudget <= 50) {
            recommendations.fitness = [
                'Focus on bodyweight exercises (free)',
                'Invest in basic equipment: resistance bands ($15)',
                'Use free online workout videos',
                'Consider outdoor activities (running, hiking)'
            ];
        } else if (totalBudget <= 150) {
            recommendations.fitness = [
                'Home gym basics: adjustable dumbbells ($60-80)',
                'Pull-up bar ($25)',
                'Yoga mat ($20)',
                'Consider used equipment marketplace'
            ];
        } else {
            recommendations.fitness = [
                'Complete home gym setup possible',
                'Consider gym membership if preferred',
                'Invest in quality equipment that lasts',
                'Personal training sessions (1-2/month)'
            ];
        }

        // Nutrition recommendations based on diet and budget
        if (diet === 'vegetarian') {
            recommendations.nutrition = [
                'Bulk protein sources: lentils, chickpeas ($2-3/lb)',
                'Quinoa for complete protein ($4-5/lb)',
                'Seasonal vegetables for variety',
                'Plant-based protein powder if needed ($30-40/month)'
            ];
            
            if (totalBudget >= 80) {
                recommendations.nutrition.push(
                    'Premium organic options when possible',
                    'Variety of nuts and seeds',
                    'Specialty vegetarian protein products'
                );
            }
        } else {
            recommendations.nutrition = [
                'Lean proteins in bulk (chicken, fish)',
                'Complex carbs: brown rice, oats',
                'Fresh vegetables and fruits',
                'Basic supplements if needed'
            ];
        }

        // Health recommendations
        recommendations.health = [
            'Basic multivitamin ($10-15/month)',
            'Emergency health fund allocation',
            'Preventive care budget'
        ];

        // General money-saving tips
        recommendations.general = [
            'Buy non-perishables in bulk',
            'Use seasonal produce for better prices',
            'Compare prices across stores',
            'Consider generic brands for basics'
        ];

        return recommendations;
    }

    identifyCostOptimizations(budgetData, userProfile) {
        const optimizations = [];
        const totalBudget = budgetData.totalBudget || 100;
        
        // Identify relevant optimization rules
        const fitnessKey = `fitness_${userProfile.fitnessLevel || 'beginner'}`;
        const nutritionKey = userProfile.diet === 'vegetarian' ? 
            'nutrition_vegetarian_budget' : 'nutrition_general';

        if (this.costOptimizationRules.has(fitnessKey)) {
            optimizations.push({
                category: 'fitness',
                ...this.costOptimizationRules.get(fitnessKey)
            });
        }

        if (this.costOptimizationRules.has(nutritionKey)) {
            optimizations.push({
                category: 'nutrition',
                ...this.costOptimizationRules.get(nutritionKey)
            });
        }

        // Budget-specific optimizations
        if (totalBudget <= 50) {
            optimizations.push({
                category: 'low_budget',
                recommendations: [
                    'Prioritize nutrition over equipment',
                    'Use free resources (apps, videos)',
                    'Focus on bodyweight fitness',
                    'Buy generic brands'
                ],
                costSavings: '50-70% vs premium options'
            });
        }

        return optimizations;
    }

    findSavingOpportunities(budgetData, userProfile) {
        const opportunities = [];
        
        // Common saving opportunities
        opportunities.push({
            area: 'Meal Prep',
            potential_savings: '$20-40/week',
            description: 'Preparing meals at home vs eating out',
            effort_level: 'medium'
        });

        opportunities.push({
            area: 'Generic Supplements',
            potential_savings: '$10-20/month',
            description: 'Generic vs brand name vitamins and protein',
            effort_level: 'low'
        });

        opportunities.push({
            area: 'Bulk Purchasing',
            potential_savings: '$15-25/month',
            description: 'Buying non-perishables in larger quantities',
            effort_level: 'low'
        });

        if (userProfile.diet === 'vegetarian') {
            opportunities.push({
                area: 'Plant-Based Proteins',
                potential_savings: '$30-50/month',
                description: 'Dried beans/lentils vs processed vegetarian products',
                effort_level: 'medium'
            });
        }

        return opportunities;
    }

    // ========================================
    // EXPENSE TRACKING AND ANALYSIS
    // ========================================

    async logExpense(userId, expenseData) {
        const expense = {
            id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: userId,
            amount: expenseData.amount,
            category: expenseData.category || 'general',
            subcategory: expenseData.subcategory || 'miscellaneous',
            description: expenseData.description || '',
            date: expenseData.date || new Date().toISOString(),
            tags: expenseData.tags || [],
            receipt_url: expenseData.receiptUrl || null,
            recurring: expenseData.recurring || false,
            optimization_opportunity: await this.identifyOptimizationOpportunity(expenseData)
        };

        // Store expense
        if (!this.expenseHistory.has(userId)) {
            this.expenseHistory.set(userId, []);
        }
        this.expenseHistory.get(userId).push(expense);

        // Update financial insights
        await this.updateFinancialInsights(userId, expense);

        // Save to disk
        await this.saveExpense(expense);

        console.log(`💰 Logged expense: $${expense.amount} for ${expense.category} (${userId})`);

        return {
            success: true,
            expenseId: expense.id,
            optimization_suggestion: expense.optimization_opportunity,
            budget_impact: await this.calculateBudgetImpact(userId, expense)
        };
    }

    async identifyOptimizationOpportunity(expenseData) {
        const opportunities = [];
        
        // High-cost item optimization
        if (expenseData.amount > 50) {
            opportunities.push({
                type: 'high_cost_review',
                suggestion: 'Consider if this high-cost item aligns with your priorities',
                potential_action: 'Research alternatives or wait for sales'
            });
        }

        // Category-specific optimizations
        if (expenseData.category === 'nutrition' && expenseData.amount > 30) {
            opportunities.push({
                type: 'nutrition_optimization',
                suggestion: 'Consider bulk purchasing or meal prep alternatives',
                potential_saving: '20-40%'
            });
        }

        if (expenseData.category === 'fitness' && expenseData.subcategory === 'gym_membership') {
            opportunities.push({
                type: 'fitness_alternative',
                suggestion: 'Evaluate if home workouts could provide similar value',
                potential_saving: '60-80%'
            });
        }

        return opportunities;
    }

    async calculateBudgetImpact(userId, expense) {
        const budgetPlan = this.budgetPlans.get(userId);
        if (!budgetPlan) return null;

        const categoryBudget = budgetPlan.allocation[expense.category] || 0;
        const categorySpent = this.calculateCategorySpent(userId, expense.category);
        
        const remaining = categoryBudget - categorySpent;
        const percentUsed = Math.round((categorySpent / categoryBudget) * 100);

        return {
            category: expense.category,
            budget_allocated: categoryBudget,
            amount_spent: categorySpent,
            remaining: remaining,
            percent_used: percentUsed,
            status: remaining > 0 ? 'within_budget' : 'over_budget',
            warning: percentUsed > 80 ? 'approaching_limit' : null
        };
    }

    calculateCategorySpent(userId, category) {
        const expenses = this.expenseHistory.get(userId) || [];
        const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
        
        return expenses
            .filter(exp => exp.category === category)
            .filter(exp => exp.date.substring(0, 7) === currentMonth)
            .reduce((total, exp) => total + exp.amount, 0);
    }

    // ========================================
    // FINANCIAL INSIGHTS AND ANALYTICS
    // ========================================

    async generateFinancialReport(userId, timeframe = 'monthly') {
        console.log(`📊 Generating financial report for ${userId} (${timeframe})`);
        
        const expenses = this.expenseHistory.get(userId) || [];
        const budgetPlan = this.budgetPlans.get(userId);
        
        // Filter expenses by timeframe
        const filteredExpenses = this.filterExpensesByTimeframe(expenses, timeframe);
        
        const report = {
            userId: userId,
            timeframe: timeframe,
            generated_at: new Date().toISOString(),
            summary: this.calculateExpenseSummary(filteredExpenses),
            category_breakdown: this.analyzeCategorySpending(filteredExpenses),
            budget_performance: budgetPlan ? this.analyzeBudgetPerformance(budgetPlan, filteredExpenses) : null,
            spending_trends: this.analyzeSpendingTrends(expenses, timeframe),
            optimization_recommendations: await this.generateOptimizationRecommendations(userId, filteredExpenses),
            cost_saving_opportunities: this.identifyNewSavingOpportunities(filteredExpenses),
            financial_health_score: this.calculateFinancialHealthScore(userId, filteredExpenses)
        };

        // Store insights
        this.financialInsights.set(`${userId}_${timeframe}`, report);

        return report;
    }

    filterExpensesByTimeframe(expenses, timeframe) {
        const now = new Date();
        let startDate;

        switch (timeframe) {
        case 'weekly':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'quarterly':
            startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            break;
        default:
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        return expenses.filter(exp => new Date(exp.date) >= startDate);
    }

    calculateExpenseSummary(expenses) {
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const average = expenses.length > 0 ? total / expenses.length : 0;
        const highest = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;
        const lowest = expenses.length > 0 ? Math.min(...expenses.map(e => e.amount)) : 0;

        return {
            total_spent: Math.round(total * 100) / 100,
            transaction_count: expenses.length,
            average_transaction: Math.round(average * 100) / 100,
            highest_expense: highest,
            lowest_expense: lowest,
            daily_average: expenses.length > 0 ? Math.round((total / 30) * 100) / 100 : 0
        };
    }

    analyzeCategorySpending(expenses) {
        const categories = {};
        
        expenses.forEach(expense => {
            const category = expense.category;
            if (!categories[category]) {
                categories[category] = {
                    total: 0,
                    count: 0,
                    average: 0,
                    percentage: 0,
                    subcategories: {}
                };
            }
            
            categories[category].total += expense.amount;
            categories[category].count += 1;
            
            // Subcategory breakdown
            const subcategory = expense.subcategory;
            if (!categories[category].subcategories[subcategory]) {
                categories[category].subcategories[subcategory] = {
                    total: 0,
                    count: 0
                };
            }
            categories[category].subcategories[subcategory].total += expense.amount;
            categories[category].subcategories[subcategory].count += 1;
        });

        // Calculate averages and percentages
        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        Object.keys(categories).forEach(category => {
            const cat = categories[category];
            cat.average = Math.round((cat.total / cat.count) * 100) / 100;
            cat.percentage = Math.round((cat.total / totalSpent) * 100);
        });

        return categories;
    }

    analyzeBudgetPerformance(budgetPlan, expenses) {
        const performance = {};
        
        Object.keys(budgetPlan.allocation).forEach(category => {
            const budgeted = budgetPlan.allocation[category];
            const spent = expenses
                .filter(exp => exp.category === category)
                .reduce((sum, exp) => sum + exp.amount, 0);
            
            performance[category] = {
                budgeted: budgeted,
                spent: Math.round(spent * 100) / 100,
                remaining: Math.round((budgeted - spent) * 100) / 100,
                percentage_used: Math.round((spent / budgeted) * 100),
                status: spent <= budgeted ? 'on_track' : 'over_budget',
                variance: Math.round((spent - budgeted) * 100) / 100
            };
        });

        return performance;
    }

    analyzeSpendingTrends(expenses, timeframe) {
        // Simple trend analysis - could be enhanced with more sophisticated algorithms
        const trends = {
            direction: 'stable',
            velocity: 0,
            peak_periods: [],
            insights: []
        };

        if (expenses.length < 10) {
            trends.insights.push('Need more transaction history for reliable trend analysis');
            return trends;
        }

        // Calculate weekly/monthly averages for trend
        const periods = this.groupExpensesByPeriod(expenses, 'weekly');
        const averages = Object.values(periods).map(period => 
            period.reduce((sum, exp) => sum + exp.amount, 0)
        );

        if (averages.length >= 2) {
            const recent = averages.slice(-2).reduce((sum, val) => sum + val, 0) / 2;
            const older = averages.slice(0, -2).reduce((sum, val) => sum + val, 0) / Math.max(averages.length - 2, 1);
            
            const change = ((recent - older) / older) * 100;
            
            if (change > 10) {
                trends.direction = 'increasing';
                trends.velocity = Math.round(change);
                trends.insights.push(`Spending has increased by ${Math.round(change)}% recently`);
            } else if (change < -10) {
                trends.direction = 'decreasing';
                trends.velocity = Math.round(Math.abs(change));
                trends.insights.push(`Spending has decreased by ${Math.round(Math.abs(change))}% recently`);
            }
        }

        return trends;
    }

    groupExpensesByPeriod(expenses, period) {
        const groups = {};
        
        expenses.forEach(expense => {
            const date = new Date(expense.date);
            let key;
            
            if (period === 'weekly') {
                const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
                key = weekStart.toISOString().substring(0, 10);
            } else {
                key = expense.date.substring(0, 7); // YYYY-MM
            }
            
            if (!groups[key]) groups[key] = [];
            groups[key].push(expense);
        });
        
        return groups;
    }

    async generateOptimizationRecommendations(userId, expenses) {
        const recommendations = [];
        
        // High-spend category analysis
        const categoryTotals = {};
        expenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        });

        const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
            categoryTotals[a] > categoryTotals[b] ? a : b, 'none'
        );

        if (topCategory && categoryTotals[topCategory] > 100) {
            recommendations.push({
                type: 'high_category_spending',
                category: topCategory,
                amount: categoryTotals[topCategory],
                suggestion: `Consider reviewing ${topCategory} spending - it's your highest category`,
                potential_saving: '15-25%'
            });
        }

        // Frequent small purchases
        const smallFrequentPurchases = expenses.filter(exp => exp.amount < 10).length;
        if (smallFrequentPurchases > expenses.length * 0.3) {
            recommendations.push({
                type: 'small_frequent_purchases',
                count: smallFrequentPurchases,
                suggestion: 'Many small purchases detected - consider consolidating shopping trips',
                potential_saving: '10-15%'
            });
        }

        return recommendations;
    }

    identifyNewSavingOpportunities(expenses) {
        const opportunities = [];
        
        // Generic brand opportunity
        const brandedExpenses = expenses.filter(exp => 
            exp.description && (exp.description.toLowerCase().includes('premium') || 
                               exp.description.toLowerCase().includes('brand'))
        );
        
        if (brandedExpenses.length > 0) {
            opportunities.push({
                area: 'Generic Alternatives',
                potential_savings: '$10-30/month',
                description: 'Switch to generic brands for basic items',
                affected_purchases: brandedExpenses.length
            });
        }

        return opportunities;
    }

    calculateFinancialHealthScore(userId, expenses) {
        let score = 100;
        const budgetPlan = this.budgetPlans.get(userId);
        
        if (!budgetPlan) {
            return {
                score: 50,
                grade: 'C',
                factors: ['No budget plan established']
            };
        }

        const factors = [];
        
        // Budget adherence
        let overBudgetCategories = 0;
        Object.keys(budgetPlan.allocation).forEach(category => {
            const spent = expenses
                .filter(exp => exp.category === category)
                .reduce((sum, exp) => sum + exp.amount, 0);
            
            if (spent > budgetPlan.allocation[category]) {
                overBudgetCategories++;
                score -= 15;
            }
        });

        if (overBudgetCategories > 0) {
            factors.push(`${overBudgetCategories} categories over budget`);
        }

        // Spending consistency
        const dailySpending = this.calculateDailySpendingVariance(expenses);
        if (dailySpending.variance > 50) {
            score -= 10;
            factors.push('High spending variance');
        }

        // Saving opportunities utilized
        const savingOpps = this.findSavingOpportunities({}, {});
        if (savingOpps.length > 3) {
            score -= 10;
            factors.push('Multiple unused saving opportunities');
        }

        let grade = 'A';
        if (score < 90) grade = 'B';
        if (score < 80) grade = 'C';
        if (score < 70) grade = 'D';
        if (score < 60) grade = 'F';

        return {
            score: Math.max(score, 0),
            grade: grade,
            factors: factors.length > 0 ? factors : ['Good financial discipline']
        };
    }

    calculateDailySpendingVariance(expenses) {
        const dailyTotals = {};
        expenses.forEach(exp => {
            const day = exp.date.substring(0, 10);
            dailyTotals[day] = (dailyTotals[day] || 0) + exp.amount;
        });

        const amounts = Object.values(dailyTotals);
        const average = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
        const variance = amounts.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / amounts.length;

        return {
            average: Math.round(average * 100) / 100,
            variance: Math.round(Math.sqrt(variance) * 100) / 100
        };
    }

    // ========================================
    // INTEGRATION WITH OTHER AGENTS
    // ========================================

    async getOptimizedRecommendations(userId, requestType, parameters = {}) {
        console.log(`💡 Getting optimized recommendations for ${requestType}`);
        
        const budgetPlan = this.budgetPlans.get(userId);
        const expenses = this.expenseHistory.get(userId) || [];
        
        let recommendations = [];

        switch (requestType) {
        case 'nutrition_meal_plan':
            recommendations = await this.getNutritionBudgetRecommendations(budgetPlan, parameters);
            break;
        case 'workout_equipment':
            recommendations = await this.getWorkoutBudgetRecommendations(budgetPlan, parameters);
            break;
        case 'health_supplements':
            recommendations = await this.getSupplementBudgetRecommendations(budgetPlan, parameters);
            break;
        default:
            recommendations = await this.getGeneralBudgetRecommendations(budgetPlan, parameters);
        }

        return {
            success: true,
            recommendations: recommendations,
            budget_context: budgetPlan ? {
                total_budget: budgetPlan.totalBudget,
                remaining_budget: this.calculateRemainingBudget(userId),
                category_budgets: budgetPlan.allocation
            } : null
        };
    }

    async getNutritionBudgetRecommendations(budgetPlan, parameters) {
        const nutritionBudget = budgetPlan?.allocation?.nutrition || 60;
        const recommendations = [];

        if (nutritionBudget <= 30) {
            recommendations.push({
                category: 'budget_nutrition',
                items: [
                    { item: 'Dried beans/lentils', cost: '$3-4/week', protein: '20g per cup' },
                    { item: 'Brown rice (bulk)', cost: '$2/week', carbs: 'Complex carbs' },
                    { item: 'Seasonal vegetables', cost: '$8-12/week', vitamins: 'A, C, K' },
                    { item: 'Bananas', cost: '$2-3/week', potassium: 'High' }
                ],
                total_estimated: '$15-21/week',
                savings_tip: 'Buy in bulk and prep meals to maximize value'
            });
        } else if (nutritionBudget <= 60) {
            recommendations.push({
                category: 'moderate_nutrition',
                items: [
                    { item: 'Quinoa', cost: '$5-6/week', protein: 'Complete protein' },
                    { item: 'Greek yogurt', cost: '$6-8/week', protein: '15-20g per serving' },
                    { item: 'Nuts and seeds', cost: '$8-10/week', fats: 'Healthy fats' },
                    { item: 'Protein powder', cost: '$10-12/week', protein: '25g per scoop' },
                    { item: 'Fresh produce variety', cost: '$15-20/week', nutrients: 'Varied vitamins' }
                ],
                total_estimated: '$44-56/week',
                optimization_tip: 'Mix premium items with budget staples'
            });
        } else {
            recommendations.push({
                category: 'premium_nutrition',
                items: [
                    { item: 'Organic produce', cost: '$20-25/week', quality: 'Organic' },
                    { item: 'Specialty proteins', cost: '$15-18/week', variety: 'Tempeh, seitan' },
                    { item: 'Superfoods', cost: '$10-12/week', nutrients: 'Chia, hemp seeds' },
                    { item: 'Quality supplements', cost: '$15-20/week', targeted: 'Specific goals' }
                ],
                total_estimated: '$60-75/week',
                luxury_tip: 'Focus on quality and variety within budget'
            });
        }

        return recommendations;
    }

    async getWorkoutBudgetRecommendations(budgetPlan, parameters) {
        const fitnessBudget = budgetPlan?.allocation?.fitness || 30;
        const recommendations = [];

        if (fitnessBudget <= 25) {
            recommendations.push({
                category: 'minimal_equipment',
                items: [
                    { item: 'Resistance bands set', cost: '$15-20', versatility: 'Full body workouts' },
                    { item: 'Yoga mat', cost: '$15-25', use: 'Floor exercises, stretching' },
                    { item: 'Jump rope', cost: '$10-15', cardio: 'High intensity cardio' }
                ],
                total_cost: '$40-60 one-time',
                free_alternatives: ['Bodyweight exercises', 'YouTube workouts', 'Running/walking']
            });
        } else if (fitnessBudget <= 75) {
            recommendations.push({
                category: 'home_gym_basics',
                items: [
                    { item: 'Adjustable dumbbells', cost: '$60-80', versatility: 'Strength training' },
                    { item: 'Pull-up bar', cost: '$25-35', muscle_groups: 'Upper body' },
                    { item: 'Kettlebell', cost: '$30-40', workout_type: 'Functional fitness' },
                    { item: 'Stability ball', cost: '$15-25', core: 'Core strengthening' }
                ],
                total_cost: '$130-180 one-time',
                monthly_alternative: 'Basic gym membership ($25-40/month)'
            });
        }

        return recommendations;
    }

    calculateRemainingBudget(userId) {
        const budgetPlan = this.budgetPlans.get(userId);
        if (!budgetPlan) return 0;

        const totalBudget = budgetPlan.totalBudget;
        const expenses = this.expenseHistory.get(userId) || [];
        const currentMonth = new Date().toISOString().substring(0, 7);
        
        const monthlySpent = expenses
            .filter(exp => exp.date.substring(0, 7) === currentMonth)
            .reduce((sum, exp) => sum + exp.amount, 0);

        return Math.max(totalBudget - monthlySpent, 0);
    }

    // ========================================
    // FILE OPERATIONS
    // ========================================

    async saveBudgetPlan(budgetPlan) {
        try {
            const filePath = `data/budgets/${budgetPlan.userId}_plan.json`;
            await fs.writeFile(filePath, JSON.stringify(budgetPlan, null, 2));
            console.log(`💾 Saved budget plan for ${budgetPlan.userId}`);
        } catch (error) {
            console.error('❌ Error saving budget plan:', error);
        }
    }

    async saveExpense(expense) {
        try {
            const date = expense.date.substring(0, 7); // YYYY-MM
            const filePath = `data/expenses/${expense.userId}_${date}.json`;
            
            // Load existing expenses for the month
            let monthlyExpenses = { userId: expense.userId, month: date, expenses: [] };
            try {
                const existing = await fs.readFile(filePath, 'utf8');
                monthlyExpenses = JSON.parse(existing);
            } catch (error) {
                // File doesn't exist, that's fine
            }
            
            monthlyExpenses.expenses.push(expense);
            await fs.writeFile(filePath, JSON.stringify(monthlyExpenses, null, 2));
            
        } catch (error) {
            console.error('❌ Error saving expense:', error);
        }
    }

    async updateFinancialInsights(userId, expense) {
        // Update running financial insights
        if (!this.financialInsights.has(userId)) {
            this.financialInsights.set(userId, {
                total_spent: 0,
                category_totals: {},
                recent_trends: []
            });
        }

        const insights = this.financialInsights.get(userId);
        insights.total_spent += expense.amount;
        insights.category_totals[expense.category] = (insights.category_totals[expense.category] || 0) + expense.amount;
        insights.recent_trends.push({
            date: expense.date,
            amount: expense.amount,
            category: expense.category
        });

        // Keep only recent trends (last 30 entries)
        if (insights.recent_trends.length > 30) {
            insights.recent_trends = insights.recent_trends.slice(-30);
        }
    }

    // ========================================
    // STATUS AND UTILITY METHODS
    // ========================================

    getStatus() {
        return {
            agent: this.agentName,
            code: this.agentCode,
            version: this.version,
            initialized: this.initialized,
            active_budgets: this.budgetPlans.size,
            tracked_users: this.expenseHistory.size,
            total_expenses: Array.from(this.expenseHistory.values()).reduce((sum, expenses) => sum + expenses.length, 0),
            capabilities: this.getCapabilities(),
            integrations: {
                nutrition_agent: this.nutritionIntegration,
                workout_agent: this.workoutIntegration
            }
        };
    }

    getCapabilities() {
        return [
            'Budget Planning & Optimization',
            'Expense Tracking & Analysis',
            'Cost Optimization Recommendations',
            'Financial Health Scoring',
            'Savings Opportunity Identification',
            'Cross-Agent Integration',
            'Real-time Budget Monitoring',
            'Spending Trend Analysis',
            'Category-based Budget Allocation',
            'Financial Reporting & Insights'
        ];
    }

    async generateBudgetResponse(message, userPreferences = {}, memoryInsights = {}) {
        let response = '💰 Budget Management Agent: ';
        
        // Analyze the message for budget-related intent
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('budget plan') || lowerMessage.includes('create budget')) {
            response += 'I\'ll help you create an optimized budget plan! ';
            
            if (userPreferences.budget) {
                response += `With your $${userPreferences.budget} budget, I can allocate funds optimally across fitness, nutrition, and health. `;
            }
            
            if (userPreferences.diet === 'vegetarian') {
                response += 'For vegetarian nutrition, I recommend allocating 60-70% to food with focus on cost-effective protein sources. ';
            }
        } else if (lowerMessage.includes('save money') || lowerMessage.includes('reduce costs')) {
            response += 'Excellent! I can identify multiple cost-saving opportunities. ';
            
            if (userPreferences.diet === 'vegetarian') {
                response += 'Vegetarian diets can save 40-50% compared to meat-based diets when optimized properly. ';
            }
            
            response += 'Key areas for savings: bulk purchasing, generic brands, and meal prep. ';
        } else if (lowerMessage.includes('expense') || lowerMessage.includes('track spending')) {
            response += 'I can help you track and analyze your health-related spending. ';
            response += 'This includes categorizing expenses and identifying optimization opportunities. ';
        } else {
            response += 'I can help you optimize your health and fitness budget. ';
            
            if (memoryInsights.userPreferences?.budget) {
                response += `Working with your $${memoryInsights.userPreferences.budget} budget, `;
            }
            
            response += 'I provide budget planning, expense tracking, and cost optimization recommendations. ';
        }
        
        response += 'What specific budget goals would you like to work on?';
        
        return response;
    }
}

module.exports = EnhancedBudgetManagementAgent;