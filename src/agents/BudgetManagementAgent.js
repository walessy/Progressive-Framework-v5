// Budget Management Agent (BMA) - Complete Implementation
// Location: C:\Projects\Progressive-Framework-v5\src\agents\BudgetManagementAgent.js

const BaseAgent = require('./BaseAgent');
const fs = require('fs').promises;
const path = require('path');

class BudgetManagementAgent extends BaseAgent {
    constructor() {
        super('BMA');
        this.budgetDataPath = path.join(__dirname, '../../data/budgets');
        this.expenseCategories = this.initializeExpenseCategories();
        this.budgetingStrategies = this.initializeBudgetingStrategies();
        this.financialGoals = new Map();
        this.expenseTracking = new Map();
        
        this.init();
    }

    async init() {
        try {
            await fs.mkdir(this.budgetDataPath, { recursive: true });
            await this.loadExistingBudgets();
            console.log('Budget Management Agent (BMA) initialized successfully');
        } catch (error) {
            console.error('BMA initialization failed:', error);
        }
    }

    // ========================================
    // MAIN PROCESSING METHOD
    // ========================================

    async processRequest(request, context = {}) {
        const startTime = Date.now();
        
        try {
            // Analyze budget-related intent
            const analysis = this.analyzeBudgetIntent(request);
            
            // Determine specific budget action
            const action = this.determineBudgetAction(analysis, context);
            
            // Execute the appropriate budget function
            let response;
            
            switch (action.type) {
                case 'create_budget':
                    response = await this.createBudget(action.params, context.userId);
                    break;
                case 'track_expense':
                    response = await this.trackExpense(action.params, context.userId);
                    break;
                case 'budget_analysis':
                    response = await this.analyzeBudget(action.params, context.userId);
                    break;
                case 'savings_goal':
                    response = await this.manageSavingsGoal(action.params, context.userId);
                    break;
                case 'expense_categorization':
                    response = await this.categorizeExpenses(action.params, context.userId);
                    break;
                case 'financial_advice':
                    response = await this.provideFinancialAdvice(action.params, context);
                    break;
                case 'budget_comparison':
                    response = await this.compareBudgets(action.params, context.userId);
                    break;
                case 'cost_optimization':
                    response = await this.optimizeCosts(action.params, context);
                    break;
                default:
                    response = await this.provideGeneralBudgetGuidance(request, context);
            }

            return {
                content: response.content,
                confidence: response.confidence || 0.8,
                success: true,
                metadata: {
                    action: action.type,
                    analysisResults: analysis,
                    processingTime: Date.now() - startTime,
                    budgetDataUpdated: response.dataUpdated || false
                }
            };

        } catch (error) {
            console.error('BMA processing error:', error);
            
            return {
                content: "I encountered an issue with your budget request. Let me provide some general financial guidance instead.",
                confidence: 0.3,
                success: false,
                error: error.message,
                metadata: {
                    processingTime: Date.now() - startTime
                }
            };
        }
    }

    // ========================================
    // BUDGET CREATION & MANAGEMENT
    // ========================================

    async createBudget(params, userId) {
        try {
            const budgetData = {
                id: this.generateBudgetId(),
                userId,
                name: params.budgetName || `Budget ${new Date().toISOString().split('T')[0]}`,
                period: params.period || 'monthly', // monthly, weekly, yearly
                totalBudget: params.totalBudget || 0,
                categories: this.createBudgetCategories(params),
                createdAt: new Date().toISOString(),
                status: 'active',
                settings: {
                    alertThreshold: params.alertThreshold || 80, // Alert when 80% spent
                    autoSave: params.autoSave || false,
                    trackingEnabled: true
                }
            };

            // Save budget data
            await this.saveBudgetData(budgetData);

            // Generate budget analysis
            const analysis = this.analyzeBudgetStructure(budgetData);

            return {
                content: this.formatBudgetCreationResponse(budgetData, analysis),
                confidence: 0.9,
                dataUpdated: true,
                budgetId: budgetData.id
            };

        } catch (error) {
            throw new Error(`Budget creation failed: ${error.message}`);
        }
    }

    createBudgetCategories(params) {
        const categories = {};
        
        // Default categories with percentages if no specific allocation provided
        const defaultAllocations = {
            housing: 30, // 30% of budget
            food: 15,
            transportation: 15,
            utilities: 10,
            entertainment: 10,
            savings: 10,
            healthcare: 5,
            other: 5
        };

        const totalBudget = params.totalBudget || 0;
        
        if (params.customCategories) {
            // Use custom categories if provided
            Object.entries(params.customCategories).forEach(([category, amount]) => {
                categories[category] = {
                    budgetAmount: amount,
                    spentAmount: 0,
                    transactions: [],
                    percentage: totalBudget > 0 ? (amount / totalBudget * 100).toFixed(1) : 0
                };
            });
        } else {
            // Use default allocation
            Object.entries(defaultAllocations).forEach(([category, percentage]) => {
                const amount = totalBudget * (percentage / 100);
                categories[category] = {
                    budgetAmount: amount,
                    spentAmount: 0,
                    transactions: [],
                    percentage: percentage
                };
            });
        }

        return categories;
    }

    // ========================================
    // EXPENSE TRACKING
    // ========================================

    async trackExpense(params, userId) {
        try {
            const expense = {
                id: this.generateExpenseId(),
                userId,
                amount: params.amount,
                category: params.category || 'other',
                description: params.description || 'Expense',
                date: params.date || new Date().toISOString(),
                paymentMethod: params.paymentMethod || 'unknown',
                tags: params.tags || [],
                recurring: params.recurring || false
            };

            // Get user's active budget
            const activeBudget = await this.getActiveBudget(userId);
            
            if (activeBudget) {
                // Update budget with expense
                await this.updateBudgetWithExpense(activeBudget, expense);
                
                // Check for budget alerts
                const alerts = this.checkBudgetAlerts(activeBudget);
                
                return {
                    content: this.formatExpenseTrackingResponse(expense, activeBudget, alerts),
                    confidence: 0.9,
                    dataUpdated: true,
                    alerts: alerts
                };
            } else {
                // Store expense without budget
                await this.storeStandaloneExpense(expense);
                
                return {
                    content: `Expense of $${expense.amount} tracked for ${expense.category}. Consider creating a budget to better manage your finances!`,
                    confidence: 0.7,
                    dataUpdated: true,
                    suggestion: 'create_budget'
                };
            }

        } catch (error) {
            throw new Error(`Expense tracking failed: ${error.message}`);
        }
    }

    async updateBudgetWithExpense(budget, expense) {
        // Add expense to appropriate category
        if (!budget.categories[expense.category]) {
            // Create new category if it doesn't exist
            budget.categories[expense.category] = {
                budgetAmount: 0,
                spentAmount: 0,
                transactions: [],
                percentage: 0
            };
        }

        const category = budget.categories[expense.category];
        category.spentAmount += expense.amount;
        category.transactions.push(expense);

        // Update budget timestamp
        budget.lastUpdated = new Date().toISOString();

        // Save updated budget
        await this.saveBudgetData(budget);
    }

    // ========================================
    // BUDGET ANALYSIS
    // ========================================

    async analyzeBudget(params, userId) {
        try {
            const budget = params.budgetId 
                ? await this.getBudgetById(params.budgetId, userId)
                : await this.getActiveBudget(userId);

            if (!budget) {
                return {
                    content: "I couldn't find a budget to analyze. Let's create one first!",
                    confidence: 0.5,
                    suggestion: 'create_budget'
                };
            }

            const analysis = this.performBudgetAnalysis(budget);
            const recommendations = this.generateBudgetRecommendations(analysis, budget);
            const insights = this.generateBudgetInsights(budget);

            return {
                content: this.formatBudgetAnalysisResponse(analysis, recommendations, insights),
                confidence: 0.9,
                analysisData: analysis,
                recommendations: recommendations
            };

        } catch (error) {
            throw new Error(`Budget analysis failed: ${error.message}`);
        }
    }

    performBudgetAnalysis(budget) {
        const analysis = {
            totalBudget: budget.totalBudget,
            totalSpent: 0,
            remainingBudget: 0,
            percentageUsed: 0,
            categoryAnalysis: {},
            overBudgetCategories: [],
            underBudgetCategories: [],
            timeAnalysis: this.analyzeSpendingOverTime(budget)
        };

        // Analyze each category
        Object.entries(budget.categories).forEach(([categoryName, categoryData]) => {
            const categoryAnalysis = {
                budgeted: categoryData.budgetAmount,
                spent: categoryData.spentAmount,
                remaining: categoryData.budgetAmount - categoryData.spentAmount,
                percentageUsed: categoryData.budgetAmount > 0 
                    ? (categoryData.spentAmount / categoryData.budgetAmount * 100).toFixed(1)
                    : 0,
                transactionCount: categoryData.transactions.length,
                averageTransaction: categoryData.transactions.length > 0
                    ? (categoryData.spentAmount / categoryData.transactions.length).toFixed(2)
                    : 0
            };

            analysis.categoryAnalysis[categoryName] = categoryAnalysis;
            analysis.totalSpent += categoryData.spentAmount;

            // Identify over/under budget categories
            if (categoryData.spentAmount > categoryData.budgetAmount) {
                analysis.overBudgetCategories.push({
                    category: categoryName,
                    overage: categoryData.spentAmount - categoryData.budgetAmount,
                    percentageOver: categoryAnalysis.percentageUsed
                });
            } else if (categoryData.spentAmount < categoryData.budgetAmount * 0.5) {
                analysis.underBudgetCategories.push({
                    category: categoryName,
                    underAmount: categoryData.budgetAmount - categoryData.spentAmount,
                    percentageUsed: categoryAnalysis.percentageUsed
                });
            }
        });

        analysis.remainingBudget = budget.totalBudget - analysis.totalSpent;
        analysis.percentageUsed = budget.totalBudget > 0 
            ? (analysis.totalSpent / budget.totalBudget * 100).toFixed(1)
            : 0;

        return analysis;
    }

    // ========================================
    // SAVINGS GOALS MANAGEMENT
    // ========================================

    async manageSavingsGoal(params, userId) {
        try {
            const action = params.action || 'create'; // create, update, check, delete

            switch (action) {
                case 'create':
                    return await this.createSavingsGoal(params, userId);
                case 'update':
                    return await this.updateSavingsGoal(params, userId);
                case 'check':
                    return await this.checkSavingsGoalProgress(params, userId);
                default:
                    return await this.listSavingsGoals(userId);
            }

        } catch (error) {
            throw new Error(`Savings goal management failed: ${error.message}`);
        }
    }

    async createSavingsGoal(params, userId) {
        const goal = {
            id: this.generateGoalId(),
            userId,
            name: params.goalName,
            targetAmount: params.targetAmount,
            currentAmount: params.currentAmount || 0,
            targetDate: params.targetDate,
            category: params.category || 'general',
            priority: params.priority || 'medium',
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        // Calculate required monthly savings
        const monthsToTarget = this.calculateMonthsToTarget(goal.targetDate);
        goal.requiredMonthlySavings = monthsToTarget > 0 
            ? ((goal.targetAmount - goal.currentAmount) / monthsToTarget).toFixed(2)
            : 0;

        this.financialGoals.set(goal.id, goal);
        await this.saveSavingsGoals(userId);

        return {
            content: this.formatSavingsGoalResponse(goal),
            confidence: 0.9,
            dataUpdated: true,
            goalId: goal.id
        };
    }

    // ========================================
    // FINANCIAL ADVICE ENGINE
    // ========================================

    async provideFinancialAdvice(params, context) {
        try {
            const adviceType = params.type || 'general';
            const userContext = await this.gatherUserFinancialContext(context.userId);
            
            let advice;
            
            switch (adviceType) {
                case 'debt_reduction':
                    advice = this.generateDebtReductionAdvice(params, userContext);
                    break;
                case 'investment':
                    advice = this.generateInvestmentAdvice(params, userContext);
                    break;
                case 'emergency_fund':
                    advice = this.generateEmergencyFundAdvice(userContext);
                    break;
                case 'budget_optimization':
                    advice = this.generateBudgetOptimizationAdvice(userContext);
                    break;
                default:
                    advice = this.generateGeneralFinancialAdvice(userContext);
            }

            return {
                content: advice.content,
                confidence: advice.confidence,
                recommendations: advice.recommendations || [],
                resources: advice.resources || []
            };

        } catch (error) {
            throw new Error(`Financial advice generation failed: ${error.message}`);
        }
    }

    generateGeneralFinancialAdvice(userContext) {
        const advice = [];
        const recommendations = [];

        // Analyze current financial situation
        if (userContext.hasActiveBudget) {
            const budgetHealth = this.assessBudgetHealth(userContext.activeBudget);
            
            if (budgetHealth.score < 70) {
                advice.push("Your budget shows some areas for improvement.");
                recommendations.push("Consider reviewing and adjusting your spending in overspending categories");
            } else {
                advice.push("Your budget management looks good overall!");
                recommendations.push("Continue your current disciplined approach to budgeting");
            }
        } else {
            advice.push("Creating a budget would be a great first step toward better financial management.");
            recommendations.push("Start with the 50/30/20 rule: 50% needs, 30% wants, 20% savings");
        }

        // Emergency fund assessment
        if (!userContext.hasEmergencyFund) {
            advice.push("Building an emergency fund should be a priority.");
            recommendations.push("Aim to save 3-6 months of expenses in a readily accessible account");
        }

        // Savings goals
        if (userContext.savingsGoals.length === 0) {
            advice.push("Setting specific savings goals can help motivate your financial journey.");
            recommendations.push("Consider goals like vacation fund, home down payment, or retirement");
        }

        return {
            content: advice.join(' '),
            confidence: 0.8,
            recommendations,
            resources: [
                "Consider using the 50/30/20 budgeting method",
                "Automate your savings to make it effortless",
                "Review your budget monthly and adjust as needed"
            ]
        };
    }

    // ========================================
    // COST OPTIMIZATION
    // ========================================

    async optimizeCosts(params, context) {
        try {
            const userId = context.userId;
            const budget = await this.getActiveBudget(userId);
            
            if (!budget) {
                return {
                    content: "I need access to your budget data to provide cost optimization suggestions. Let's create a budget first!",
                    confidence: 0.6,
                    suggestion: 'create_budget'
                };
            }

            const optimizations = this.identifyCostOptimizations(budget);
            const potentialSavings = this.calculatePotentialSavings(optimizations);

            return {
                content: this.formatCostOptimizationResponse(optimizations, potentialSavings),
                confidence: 0.85,
                optimizations,
                potentialSavings
            };

        } catch (error) {
            throw new Error(`Cost optimization failed: ${error.message}`);
        }
    }

    identifyCostOptimizations(budget) {
        const optimizations = [];
        const analysis = this.performBudgetAnalysis(budget);

        // Check for overspending categories
        analysis.overBudgetCategories.forEach(category => {
            optimizations.push({
                type: 'overspending_reduction',
                category: category.category,
                currentSpending: category.overage + budget.categories[category.category].budgetAmount,
                suggestedReduction: category.overage,
                priority: 'high',
                suggestions: this.getCategorySpecificSuggestions(category.category)
            });
        });

        // Check for underutilized budget categories
        analysis.underBudgetCategories.forEach(category => {
            if (parseFloat(category.percentageUsed) < 30) {
                optimizations.push({
                    type: 'budget_reallocation',
                    category: category.category,
                    underutilizedAmount: category.underAmount,
                    priority: 'medium',
                    suggestion: `Consider reallocating some of the ${category.category} budget to other categories or savings`
                });
            }
        });

        // Identify high-frequency small expenses
        const smallExpenseCategories = this.identifySmallExpensePatterns(budget);
        smallExpenseCategories.forEach(pattern => {
            optimizations.push({
                type: 'small_expense_optimization',
                category: pattern.category,
                frequency: pattern.frequency,
                monthlyTotal: pattern.monthlyTotal,
                priority: 'medium',
                suggestion: pattern.suggestion
            });
        });

        return optimizations;
    }

    getCategorySpecificSuggestions(category) {
        const suggestions = {
            food: [
                "Meal prep at home to reduce restaurant expenses",
                "Use grocery store apps for coupons and discounts",
                "Buy generic brands for basic items",
                "Plan weekly meals to reduce food waste"
            ],
            entertainment: [
                "Look for free local events and activities",
                "Consider streaming service bundling to save money",
                "Use happy hour pricing for dining out",
                "Explore library programs for free entertainment"
            ],
            transportation: [
                "Consider carpooling or public transit options",
                "Maintain your vehicle regularly to avoid costly repairs",
                "Shop around for better insurance rates",
                "Combine errands to reduce fuel consumption"
            ],
            utilities: [
                "Adjust thermostat settings to save energy",
                "Switch to LED bulbs and energy-efficient appliances",
                "Unplug electronics when not in use",
                "Consider switching to a more competitive energy provider"
            ],
            shopping: [
                "Implement a 24-hour waiting period before non-essential purchases",
                "Compare prices across multiple retailers",
                "Use cashback apps and browser extensions",
                "Focus on buying quality items that last longer"
            ]
        };

        return suggestions[category] || [
            "Review recent transactions to identify patterns",
            "Set spending alerts for this category",
            "Consider if all expenses in this category are necessary"
        ];
    }

    // ========================================
    // BUDGET COMPARISON & BENCHMARKING
    // ========================================

    async compareBudgets(params, userId) {
        try {
            const comparisonType = params.type || 'personal'; // personal, demographic, optimal
            
            let comparison;
            
            switch (comparisonType) {
                case 'personal':
                    comparison = await this.comparePersonalBudgets(userId, params);
                    break;
                case 'demographic':
                    comparison = await this.compareToDemographic(userId, params);
                    break;
                case 'optimal':
                    comparison = await this.compareToOptimalBudget(userId);
                    break;
                default:
                    comparison = await this.comparePersonalBudgets(userId, params);
            }

            return {
                content: this.formatBudgetComparisonResponse(comparison),
                confidence: 0.8,
                comparisonData: comparison
            };

        } catch (error) {
            throw new Error(`Budget comparison failed: ${error.message}`);
        }
    }

    async comparePersonalBudgets(userId, params) {
        const currentBudget = await this.getActiveBudget(userId);
        const previousBudgets = await this.getPreviousBudgets(userId, 3);
        
        if (!currentBudget || previousBudgets.length === 0) {
            return {
                type: 'insufficient_data',
                message: "Need more budget history for comparison"
            };
        }

        const comparison = {
            type: 'personal_historical',
            current: this.performBudgetAnalysis(currentBudget),
            previous: previousBudgets.map(budget => this.performBudgetAnalysis(budget)),
            trends: this.calculateBudgetTrends(currentBudget, previousBudgets),
            improvements: [],
            concerns: []
        };

        // Identify improvements and concerns
        comparison.trends.forEach(trend => {
            if (trend.direction === 'improving') {
                comparison.improvements.push(trend);
            } else if (trend.direction === 'concerning') {
                comparison.concerns.push(trend);
            }
        });

        return comparison;
    }

    calculateBudgetTrends(currentBudget, previousBudgets) {
        const trends = [];
        const currentAnalysis = this.performBudgetAnalysis(currentBudget);
        
        if (previousBudgets.length > 0) {
            const previousAnalysis = this.performBudgetAnalysis(previousBudgets[0]);
            
            // Total spending trend
            const spendingChange = currentAnalysis.totalSpent - previousAnalysis.totalSpent;
            trends.push({
                category: 'total_spending',
                change: spendingChange,
                percentage: previousAnalysis.totalSpent > 0 
                    ? ((spendingChange / previousAnalysis.totalSpent) * 100).toFixed(1)
                    : 0,
                direction: spendingChange > 0 ? 'increasing' : 'decreasing'
            });
            
            // Category-wise trends
            Object.keys(currentAnalysis.categoryAnalysis).forEach(category => {
                const currentCategorySpent = currentAnalysis.categoryAnalysis[category]?.spent || 0;
                const previousCategorySpent = previousAnalysis.categoryAnalysis[category]?.spent || 0;
                
                if (previousCategorySpent > 0) {
                    const categoryChange = currentCategorySpent - previousCategorySpent;
                    const categoryPercentageChange = (categoryChange / previousCategorySpent * 100).toFixed(1);
                    
                    trends.push({
                        category,
                        change: categoryChange,
                        percentage: categoryPercentageChange,
                        direction: categoryChange > 0 ? 'increasing' : 'decreasing'
                    });
                }
            });
        }
        
        return trends;
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    analyzeBudgetIntent(request) {
        const lowerRequest = request.toLowerCase();
        const keywords = lowerRequest.split(' ');
        
        const intentKeywords = {
            create_budget: ['create', 'make', 'new', 'budget', 'plan', 'setup'],
            track_expense: ['spend', 'spent', 'expense', 'cost', 'track', 'record', 'add'],
            budget_analysis: ['analyze', 'analysis', 'review', 'check', 'status', 'how', 'doing'],
            savings_goal: ['save', 'saving', 'goal', 'target', 'fund'],
            financial_advice: ['advice', 'help', 'suggest', 'recommend', 'should', 'what'],
            cost_optimization: ['optimize', 'reduce', 'cut', 'save', 'lower', 'cheaper']
        };
        
        const scores = {};
        
        Object.entries(intentKeywords).forEach(([intent, intentKeywords]) => {
            scores[intent] = intentKeywords.reduce((score, keyword) => {
                return score + (keywords.includes(keyword) ? 1 : 0);
            }, 0);
        });
        
        const topIntent = Object.entries(scores).reduce((max, [intent, score]) => 
            score > max.score ? { intent, score } : max, { intent: 'general', score: 0 }
        );
        
        return {
            primaryIntent: topIntent.intent,
            confidence: Math.min(topIntent.score / 3, 1), // Normalize confidence
            keywords: keywords.filter(word => word.length > 2),
            detectedNumbers: this.extractNumbers(request),
            detectedDates: this.extractDates(request)
        };
    }

    determineBudgetAction(analysis, context) {
        const { primaryIntent, detectedNumbers, detectedDates } = analysis;
        
        const params = {
            amount: detectedNumbers.length > 0 ? detectedNumbers[0] : null,
            date: detectedDates.length > 0 ? detectedDates[0] : null
        };
        
        // Extract additional parameters based on intent
        if (primaryIntent === 'create_budget') {
            params.totalBudget = params.amount;
            params.period = this.detectTimePeriod(context.request) || 'monthly';
        } else if (primaryIntent === 'track_expense') {
            params.category = this.detectExpenseCategory(context.request);
            params.description = this.extractExpenseDescription(context.request);
        } else if (primaryIntent === 'savings_goal') {
            params.targetAmount = params.amount;
            params.goalName = this.extractGoalName(context.request);
        }
        
        return {
            type: primaryIntent,
            params,
            confidence: analysis.confidence
        };
    }

    // ========================================
    // DATA MANAGEMENT
    // ========================================

    async saveBudgetData(budgetData) {
        const filePath = path.join(this.budgetDataPath, `${budgetData.userId}_${budgetData.id}.json`);
        await fs.writeFile(filePath, JSON.stringify(budgetData, null, 2));
    }

    async getActiveBudget(userId) {
        try {
            const files = await fs.readdir(this.budgetDataPath);
            const userFiles = files.filter(file => file.startsWith(`${userId}_`));
            
            for (const file of userFiles) {
                const filePath = path.join(this.budgetDataPath, file);
                const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
                
                if (data.status === 'active') {
                    return data;
                }
            }
            
            return null;
        } catch (error) {
            console.error('Error getting active budget:', error);
            return null;
        }
    }

    async loadExistingBudgets() {
        try {
            const files = await fs.readdir(this.budgetDataPath);
            console.log(`Loaded ${files.length} existing budget files`);
        } catch (error) {
            console.error('Error loading existing budgets:', error);
        }
    }

    // ========================================
    // RESPONSE FORMATTERS
    // ========================================

    formatBudgetCreationResponse(budgetData, analysis) {
        const totalBudget = budgetData.totalBudget;
        const categoryCount = Object.keys(budgetData.categories).length;
        
        let response = `Great! I've created your ${budgetData.period} budget of ${totalBudget.toFixed(2)} with ${categoryCount} categories.\n\n`;
        
        response += "**Budget Breakdown:**\n";
        Object.entries(budgetData.categories).forEach(([category, data]) => {
            response += `• ${category.charAt(0).toUpperCase() + category.slice(1)}: ${data.budgetAmount.toFixed(2)} (${data.percentage}%)\n`;
        });
        
        response += `\nYour budget is now active and ready for expense tracking. I'll alert you when you reach ${budgetData.settings.alertThreshold}% of any category limit.`;
        
        return response;
    }

    formatExpenseTrackingResponse(expense, budget, alerts) {
        let response = `Expense recorded: ${expense.amount} for ${expense.category}`;
        
        if (expense.description !== 'Expense') {
            response += ` (${expense.description})`;
        }
        
        // Add category status
        const category = budget.categories[expense.category];
        if (category) {
            const percentageUsed = (category.spentAmount / category.budgetAmount * 100).toFixed(1);
            const remaining = category.budgetAmount - category.spentAmount;
            
            response += `\n\n**${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)} Category Status:**\n`;
            response += `• Spent: ${category.spentAmount.toFixed(2)} of ${category.budgetAmount.toFixed(2)} (${percentageUsed}%)\n`;
            response += `• Remaining: ${remaining.toFixed(2)}`;
        }
        
        // Add alerts if any
        if (alerts.length > 0) {
            response += "\n\n**⚠️ Budget Alerts:**\n";
            alerts.forEach(alert => {
                response += `• ${alert.message}\n`;
            });
        }
        
        return response;
    }

    formatBudgetAnalysisResponse(analysis, recommendations, insights) {
        let response = `**Budget Analysis Summary**\n\n`;
        
        response += `**Overall Status:**\n`;
        response += `• Total Budget: ${analysis.totalBudget.toFixed(2)}\n`;
        response += `• Total Spent: ${analysis.totalSpent.toFixed(2)} (${analysis.percentageUsed}%)\n`;
        response += `• Remaining: ${analysis.remainingBudget.toFixed(2)}\n\n`;
        
        if (analysis.overBudgetCategories.length > 0) {
            response += `**⚠️ Over Budget Categories:**\n`;
            analysis.overBudgetCategories.forEach(category => {
                response += `• ${category.category}: Over by ${category.overage.toFixed(2)} (${category.percentageOver}%)\n`;
            });
            response += "\n";
        }
        
        if (analysis.underBudgetCategories.length > 0) {
            response += `**✅ Under Budget Categories:**\n`;
            analysis.underBudgetCategories.forEach(category => {
                response += `• ${category.category}: ${category.underAmount.toFixed(2)} remaining (${category.percentageUsed}% used)\n`;
            });
            response += "\n";
        }
        
        if (recommendations.length > 0) {
            response += `**💡 Recommendations:**\n`;
            recommendations.forEach(rec => {
                response += `• ${rec}\n`;
            });
        }
        
        return response;
    }

    formatSavingsGoalResponse(goal) {
        const progress = goal.currentAmount > 0 
            ? (goal.currentAmount / goal.targetAmount * 100).toFixed(1)
            : 0;
        
        let response = `**Savings Goal Created: ${goal.name}**\n\n`;
        response += `• Target Amount: ${goal.targetAmount.toFixed(2)}\n`;
        response += `• Current Progress: ${goal.currentAmount.toFixed(2)} (${progress}%)\n`;
        response += `• Target Date: ${new Date(goal.targetDate).toLocaleDateString()}\n`;
        
        if (goal.requiredMonthlySavings > 0) {
            response += `• Required Monthly Savings: ${goal.requiredMonthlySavings}\n`;
        }
        
        response += `\nI'll help you track your progress toward this goal!`;
        
        return response;
    }

    formatCostOptimizationResponse(optimizations, potentialSavings) {
        let response = `**Cost Optimization Analysis**\n\n`;
        
        if (potentialSavings.total > 0) {
            response += `**💰 Potential Monthly Savings: ${potentialSavings.total.toFixed(2)}**\n\n`;
        }
        
        response += `**Optimization Opportunities:**\n`;
        
        optimizations.forEach((opt, index) => {
            response += `\n${index + 1}. **${opt.type.replace(/_/g, ' ').toUpperCase()}**\n`;
            
            if (opt.category) {
                response += `   Category: ${opt.category.charAt(0).toUpperCase() + opt.category.slice(1)}\n`;
            }
            
            if (opt.suggestedReduction) {
                response += `   Potential Savings: ${opt.suggestedReduction.toFixed(2)}/month\n`;
            }
            
            if (opt.suggestions) {
                response += `   Suggestions:\n`;
                opt.suggestions.slice(0, 3).forEach(suggestion => {
                    response += `   • ${suggestion}\n`;
                });
            } else if (opt.suggestion) {
                response += `   • ${opt.suggestion}\n`;
            }
        });
        
        return response;
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    generateBudgetId() {
        return `budget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateExpenseId() {
        return `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateGoalId() {
        return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    extractNumbers(text) {
        const numberRegex = /\d+\.?\d*/g;
        const matches = text.match(numberRegex);
        return matches ? matches.map(Number) : [];
    }

    extractDates(text) {
        // Simple date extraction - can be enhanced
        const dateRegex = /\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}/g;
        return text.match(dateRegex) || [];
    }

    detectExpenseCategory(text) {
        const categoryKeywords = {
            food: ['food', 'restaurant', 'grocery', 'lunch', 'dinner', 'coffee', 'meal'],
            transportation: ['gas', 'fuel', 'uber', 'taxi', 'bus', 'train', 'parking'],
            entertainment: ['movie', 'game', 'concert', 'entertainment', 'fun', 'hobby'],
            utilities: ['electric', 'water', 'gas', 'internet', 'phone', 'utility'],
            healthcare: ['doctor', 'medical', 'pharmacy', 'health', 'medicine'],
            shopping: ['clothes', 'clothing', 'shopping', 'amazon', 'store']
        };
        
        const lowerText = text.toLowerCase();
        
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                return category;
            }
        }
        
        return 'other';
    }

    checkBudgetAlerts(budget) {
        const alerts = [];
        const threshold = budget.settings.alertThreshold / 100;
        
        Object.entries(budget.categories).forEach(([categoryName, categoryData]) => {
            if (categoryData.budgetAmount > 0) {
                const percentageUsed = categoryData.spentAmount / categoryData.budgetAmount;
                
                if (percentageUsed >= 1) {
                    alerts.push({
                        type: 'over_budget',
                        category: categoryName,
                        message: `${categoryName} is over budget by ${(categoryData.spentAmount - categoryData.budgetAmount).toFixed(2)}`
                    });
                } else if (percentageUsed >= threshold) {
                    alerts.push({
                        type: 'approaching_limit',
                        category: categoryName,
                        message: `${categoryName} is at ${(percentageUsed * 100).toFixed(0)}% of budget limit`
                    });
                }
            }
        });
        
        return alerts;
    }

    calculatePotentialSavings(optimizations) {
        let totalSavings = 0;
        
        optimizations.forEach(opt => {
            if (opt.suggestedReduction) {
                totalSavings += opt.suggestedReduction;
            } else if (opt.monthlyTotal) {
                totalSavings += opt.monthlyTotal * 0.2; // Assume 20% reduction potential
            }
        });
        
        return {
            total: totalSavings,
            breakdown: optimizations.map(opt => ({
                type: opt.type,
                category: opt.category,
                savings: opt.suggestedReduction || (opt.monthlyTotal * 0.2) || 0
            }))
        };
    }

    initializeExpenseCategories() {
        return {
            housing: { color: '#FF6B6B', icon: '🏠' },
            food: { color: '#4ECDC4', icon: '🍽️' },
            transportation: { color: '#45B7D1', icon: '🚗' },
            utilities: { color: '#FFA07A', icon: '💡' },
            entertainment: { color: '#98D8C8', icon: '🎬' },
            healthcare: { color: '#FF7171', icon: '🏥' },
            shopping: { color: '#AED6F1', icon: '🛍️' },
            savings: { color: '#90EE90', icon: '💰' },
            other: { color: '#DDA0DD', icon: '📦' }
        };
    }

    initializeBudgetingStrategies() {
        return {
            '50-30-20': {
                name: '50/30/20 Rule',
                description: '50% needs, 30% wants, 20% savings',
                allocation: { needs: 50, wants: 30, savings: 20 }
            },
            'zero-based': {
                name: 'Zero-Based Budgeting',
                description: 'Every dollar has a purpose',
                allocation: 'custom'
            },
            'envelope': {
                name: 'Envelope Method',
                description: 'Physical or digital envelopes for each category',
                allocation: 'custom'
            }
        };
    }

    async provideGeneralBudgetGuidance(request, context) {
        return {
            content: `I'm your Budget Management Agent! I can help you with:

• **Create Budgets** - Set up monthly, weekly, or yearly budgets
• **Track Expenses** - Record and categorize your spending
• **Analyze Spending** - Get insights into your financial habits
• **Set Savings Goals** - Plan for future purchases or emergencies
• **Optimize Costs** - Find ways to reduce expenses
• **Financial Advice** - Get personalized money management tips

What would you like to work on today? You can say things like:
- "Create a $3000 monthly budget"
- "Track a $50 dinner expense"
- "Analyze my current budget"
- "Set a $5000 savings goal for vacation"`,
            confidence: 0.9
        };
    }
}

module.exports = BudgetManagementAgent;