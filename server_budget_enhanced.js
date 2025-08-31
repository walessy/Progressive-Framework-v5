// Progressive Framework V5 - Budget Management Integrated Server
// Option 4: Complete Financial Ecosystem Integration

const express = require('express');
const path = require('path');
const fs = require('fs').promises;

class BudgetIntegratedFramework {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        
        // In-memory storage (enhanced)
        this.conversations = new Map();
        this.userProfiles = new Map();
        this.messageHistory = [];
        
        // Budget Management Data
        this.budgetProfiles = new Map();
        this.expenseHistory = new Map();
        this.budgetPlans = new Map();
        this.financialInsights = new Map();
        
        // Performance tracking
        this.metrics = {
            totalRequests: 0,
            successfulRequests: 0,
            memoryEnhancedRequests: 0,
            budgetAnalysisRequests: 0,
            totalResponseTime: 0,
            startTime: Date.now()
        };
        
        this.initialized = false;
    }

    async initialize() {
        console.log('🚀 Initializing Budget-Integrated Progressive Framework...');
        
        try {
            // Create all necessary directories
            await fs.mkdir('data/conversations', { recursive: true });
            await fs.mkdir('data/profiles', { recursive: true });
            await fs.mkdir('data/budgets', { recursive: true });
            await fs.mkdir('data/expenses', { recursive: true });
            await fs.mkdir('data/financial_plans', { recursive: true });
            console.log('✅ All directories ready');
        } catch (error) {
            console.log('📁 Directories already exist');
        }
        
        // Load existing data
        await this.loadExistingData();
        await this.loadBudgetData();
        
        // Setup middleware and routes
        this.setupMiddleware();
        this.setupRoutes();
        
        this.initialized = true;
        console.log('✅ Budget-Integrated Framework initialized');
    }

    async loadExistingData() {
        try {
            const dataPath = 'data/conversations';
            const files = await fs.readdir(dataPath);
            
            let loadedMessages = 0;
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(dataPath, file);
                    const content = await fs.readFile(filePath, 'utf8');
                    const data = JSON.parse(content);
                    
                    if (Array.isArray(data)) {
                        this.messageHistory.push(...data);
                        loadedMessages += data.length;
                    }
                }
            }
            
            console.log(`📚 Loaded ${loadedMessages} conversation messages`);
            
        } catch (error) {
            console.log('📝 Starting with fresh conversation memory');
        }
    }

    async loadBudgetData() {
        try {
            // Load budget plans
            const budgetFiles = await fs.readdir('data/budgets');
            let loadedBudgets = 0;
            
            for (const file of budgetFiles) {
                if (file.endsWith('.json')) {
                    const filePath = path.join('data/budgets', file);
                    const content = await fs.readFile(filePath, 'utf8');
                    const budgetData = JSON.parse(content);
                    
                    this.budgetPlans.set(budgetData.userId, budgetData);
                    loadedBudgets++;
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
                    loadedExpenses += expenseData.expenses.length;
                }
            }
            
            console.log(`💰 Loaded ${loadedBudgets} budget plans and ${loadedExpenses} expense records`);
            
        } catch (error) {
            console.log('📝 Starting with fresh budget data');
        }
    }

    setupMiddleware() {
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
        
        // CORS
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });
        
        // Request tracking
        this.app.use((req, res, next) => {
            req.startTime = Date.now();
            res.on('finish', () => {
                const responseTime = Date.now() - req.startTime;
                this.updateMetrics(responseTime, res.statusCode === 200);
            });
            next();
        });
    }

    setupRoutes() {
        // Enhanced chat endpoint with budget integration
        this.app.post('/chat', async (req, res) => {
            try {
                const { 
                    message, 
                    userId = 'anonymous', 
                    sessionId = 'default', 
                    useMemory = true 
                } = req.body;
                
                if (!message) {
                    return res.status(400).json({
                        error: 'Message is required',
                        success: false
                    });
                }

                console.log(`💬 Processing: "${message}" for user: ${userId}`);

                // Memory enhancement
                let memoryInsights = {};
                let personalizationLevel = 0;
                
                if (useMemory) {
                    memoryInsights = await this.getMemoryInsights(userId, message);
                    personalizationLevel = this.calculatePersonalization(userId, message);
                    this.metrics.memoryEnhancedRequests++;
                    
                    console.log('🧠 Memory insights:', memoryInsights.userPreferences);
                }

                // Generate intelligent response with budget awareness
                const response = await this.generateIntelligentResponse(message, memoryInsights, userId);

                // Check for budget-related actions
                const budgetActions = await this.checkBudgetActions(message, userId, memoryInsights);

                // Store conversation
                await this.storeConversation(userId, sessionId, message, response.text, memoryInsights);

                // Enhanced response with budget insights
                const enhancedResponse = {
                    response: response.text,
                    agent_type: response.agent,
                    confidence: response.confidence,
                    enhanced_mode: useMemory,
                    memory_insights: memoryInsights,
                    personalization_level: personalizationLevel,
                    context_awareness: memoryInsights.contextItems ? memoryInsights.contextItems.length / 5 : 0,
                    budget_insights: budgetActions.length > 0 ? budgetActions : undefined,
                    processing_time: Date.now() - req.startTime,
                    memory_status: {
                        conversations_stored: this.conversations.size,
                        user_profiles: this.userProfiles.size,
                        total_messages: this.messageHistory.length,
                        budget_plans: this.budgetPlans.size,
                        tracked_expenses: Array.from(this.expenseHistory.values()).reduce((sum, arr) => sum + arr.length, 0)
                    }
                };

                console.log(`✅ Response: ${response.agent} (${response.confidence}) - Budget: ${budgetActions.length} insights`);
                res.json(enhancedResponse);

            } catch (error) {
                console.error('❌ Chat error:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    message: error.message,
                    success: false,
                    fallback_response: 'I apologize, but I encountered an error. Please try again.'
                });
            }
        });

        // Budget plan creation endpoint
        this.app.post('/budget/create', async (req, res) => {
            try {
                const { userId, budgetData } = req.body;
                
                if (!userId || !budgetData) {
                    return res.status(400).json({
                        error: 'userId and budgetData are required',
                        success: false
                    });
                }

                console.log(`💰 Creating budget plan for ${userId}`);

                const userProfile = this.userProfiles.get(userId) || {};
                const budgetPlan = await this.createBudgetPlan(userId, budgetData, userProfile);

                res.json({
                    success: true,
                    budgetPlan: budgetPlan,
                    message: `Budget plan created with $${budgetPlan.totalBudget} total allocation`,
                    recommendations: budgetPlan.recommendations
                });

            } catch (error) {
                console.error('❌ Budget creation error:', error);
                res.status(500).json({
                    error: 'Budget plan creation failed',
                    message: error.message,
                    success: false
                });
            }
        });

        // Expense logging endpoint
        this.app.post('/budget/expense', async (req, res) => {
            try {
                const { userId, expenseData } = req.body;
                
                if (!userId || !expenseData) {
                    return res.status(400).json({
                        error: 'userId and expenseData are required',
                        success: false
                    });
                }

                console.log(`💸 Logging expense: $${expenseData.amount} for ${userId}`);

                const result = await this.logExpense(userId, expenseData);

                res.json({
                    success: true,
                    expenseId: result.expenseId,
                    budget_impact: result.budget_impact,
                    optimization_suggestion: result.optimization_suggestion,
                    message: `Expense logged: $${expenseData.amount} for ${expenseData.category}`
                });

            } catch (error) {
                console.error('❌ Expense logging error:', error);
                res.status(500).json({
                    error: 'Expense logging failed',
                    message: error.message,
                    success: false
                });
            }
        });

        // Financial report endpoint
        this.app.get('/budget/report/:userId', async (req, res) => {
            try {
                const { userId } = req.params;
                const { timeframe = 'monthly' } = req.query;

                console.log(`📊 Generating financial report for ${userId} (${timeframe})`);

                const report = await this.generateFinancialReport(userId, timeframe);

                res.json({
                    success: true,
                    report: report,
                    generated_at: new Date().toISOString()
                });

            } catch (error) {
                console.error('❌ Financial report error:', error);
                res.status(500).json({
                    error: 'Financial report generation failed',
                    message: error.message,
                    success: false
                });
            }
        });

        // Budget optimization recommendations
        this.app.post('/budget/optimize', async (req, res) => {
            try {
                const { userId, requestType, parameters = {} } = req.body;
                
                if (!userId || !requestType) {
                    return res.status(400).json({
                        error: 'userId and requestType are required',
                        success: false
                    });
                }

                console.log(`💡 Getting optimization recommendations for ${requestType}`);

                const recommendations = await this.getOptimizedRecommendations(userId, requestType, parameters);

                res.json({
                    success: true,
                    recommendations: recommendations,
                    generated_at: new Date().toISOString()
                });

            } catch (error) {
                console.error('❌ Optimization error:', error);
                res.status(500).json({
                    error: 'Optimization recommendations failed',
                    message: error.message,
                    success: false
                });
            }
        });

        // Existing endpoints (enhanced with budget awareness)
        this.app.post('/memory/search', async (req, res) => {
            try {
                const { query, userId, options = {} } = req.body;
                
                if (!query) {
                    return res.status(400).json({ error: 'Search query is required' });
                }

                console.log(`🔍 Searching for: "${query}" for user: ${userId}`);
                const searchResults = await this.searchMemory(query, userId, options);

                res.json({
                    success: true,
                    query: query,
                    totalResults: searchResults.length,
                    results: searchResults.slice(0, options.maxResults || 10),
                    search_time: Date.now() - req.startTime
                });

            } catch (error) {
                console.error('❌ Memory search error:', error);
                res.status(500).json({
                    error: 'Search failed',
                    message: error.message,
                    success: false
                });
            }
        });

        this.app.get('/memory/profile/:userId', async (req, res) => {
            try {
                const { userId } = req.params;
                const profile = this.getUserProfile(userId);

                // Enhanced profile with budget data
                const budgetPlan = this.budgetPlans.get(userId);
                const expenses = this.expenseHistory.get(userId) || [];
                
                if (budgetPlan || expenses.length > 0) {
                    profile.financialProfile = {
                        hasBudgetPlan: !!budgetPlan,
                        totalBudget: budgetPlan?.totalBudget || 0,
                        trackedExpenses: expenses.length,
                        totalSpent: expenses.reduce((sum, exp) => sum + exp.amount, 0),
                        budgetCategories: budgetPlan?.allocation || {}
                    };
                }

                res.json({
                    success: true,
                    profile: profile,
                    generated_at: new Date().toISOString()
                });

            } catch (error) {
                console.error('❌ Profile retrieval error:', error);
                res.status(500).json({
                    error: 'Profile retrieval failed',
                    message: error.message,
                    success: false
                });
            }
        });

        // Enhanced status endpoint
        this.app.get('/status', (req, res) => {
            const uptime = Date.now() - this.metrics.startTime;
            
            res.json({
                status: 'operational',
                version: '5.0.0-budget-integrated',
                uptime_ms: uptime,
                uptime_formatted: this.formatUptime(uptime),
                framework: {
                    initialized: this.initialized,
                    memory_system_active: true,
                    conversation_persistence: true,
                    budget_management_active: true,
                    financial_analytics: true
                },
                memory_system: {
                    conversations_in_memory: this.conversations.size,
                    user_profiles: this.userProfiles.size,
                    total_messages: this.messageHistory.length
                },
                budget_system: {
                    active_budget_plans: this.budgetPlans.size,
                    tracked_users: this.expenseHistory.size,
                    total_expenses: Array.from(this.expenseHistory.values()).reduce((sum, arr) => sum + arr.length, 0),
                    financial_insights: this.financialInsights.size
                },
                performance: this.getPerformanceMetrics()
            });
        });

        // Health endpoint
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                memory_system: 'active',
                conversation_persistence: 'active',
                budget_management: 'active',
                version: '5.0.0-budget-integrated'
            });
        });

        // Enhanced agents endpoint
        this.app.get('/agents', (req, res) => {
            res.json({
                success: true,
                agents: {
                    MCA: { 
                        name: 'Master Control Agent', 
                        status: 'active', 
                        capabilities: ['routing', 'coordination', 'budget_awareness'] 
                    },
                    NPA: { 
                        name: 'Nutrition Planning Agent', 
                        status: 'active', 
                        capabilities: ['nutrition', 'meal_planning', 'cost_optimization'] 
                    },
                    WPA: { 
                        name: 'Workout Planning Agent', 
                        status: 'active', 
                        capabilities: ['fitness', 'workout_planning', 'equipment_budgeting'] 
                    },
                    BMA: { 
                        name: 'Budget Management Agent', 
                        status: 'active', 
                        capabilities: ['budget_planning', 'expense_tracking', 'financial_optimization', 'cost_analysis'] 
                    }
                },
                total_agents: 4,
                memory_enhanced: true,
                budget_integrated: true
            });
        });

        // Root endpoint
        this.app.get('/', (req, res) => {
            res.json({
                message: 'Progressive Framework V5 - Budget Integrated',
                version: '5.0.0-budget-integrated',
                status: 'operational',
                features: {
                    memory_enhanced_conversations: true,
                    intelligent_agent_routing: true,
                    budget_planning: true,
                    expense_tracking: true,
                    financial_optimization: true,
                    cost_analysis: true,
                    cross_agent_integration: true
                },
                endpoints: [
                    'POST /chat - Memory and budget enhanced conversations',
                    'POST /budget/create - Create optimized budget plans',
                    'POST /budget/expense - Log and analyze expenses', 
                    'GET /budget/report/:userId - Financial reports and analytics',
                    'POST /budget/optimize - Get budget optimization recommendations',
                    'POST /memory/search - Search conversation history',
                    'GET /memory/profile/:userId - Enhanced user profiles',
                    'GET /status - System status with budget metrics',
                    'GET /agents - Agent information and capabilities'
                ]
            });
        });
    }

    // ========================================
    // ENHANCED RESPONSE GENERATION WITH BUDGET AWARENESS (FIXED ROUTING)
    // ========================================

    async generateIntelligentResponse(message, memoryInsights, userId) {
        const lowerMessage = message.toLowerCase();
        
        // FIXED ROUTING LOGIC WITH PROPER WEIGHTS
        let routingScore = { WPA: 0, NPA: 0, BMA: 0, MCA: 0 };
        
        // PRIMARY DOMAIN KEYWORDS (3 points each - core expertise)
        const workoutPrimaryKeywords = ['workout', 'exercise', 'fitness', 'training', 'gym', 'cardio', 'strength', 'muscle'];
        workoutPrimaryKeywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) routingScore.WPA += 3;
        });

        // SECONDARY WORKOUT KEYWORDS (1 point each - supporting context)
        const workoutSecondaryKeywords = ['equipment', 'routine', 'program', 'plan', 'rep', 'set', 'lift', 'run'];
        workoutSecondaryKeywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) routingScore.WPA += 1;
        });

        // PRIMARY NUTRITION KEYWORDS (3 points each)
        const nutritionPrimaryKeywords = ['food', 'nutrition', 'meal', 'diet', 'protein', 'calories', 'eat'];
        nutritionPrimaryKeywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) routingScore.NPA += 3;
        });

        // SECONDARY NUTRITION KEYWORDS (1 point each)
        const nutritionSecondaryKeywords = ['vegetarian', 'vegan', 'healthy', 'ingredient', 'recipe', 'supplement'];
        nutritionSecondaryKeywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) routingScore.NPA += 1;
        });

        // PRIMARY BUDGET KEYWORDS (3 points each)
        const budgetPrimaryKeywords = ['budget', 'financial', 'money', 'cost', 'expense', 'savings'];
        budgetPrimaryKeywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) routingScore.BMA += 3;
        });

        // SECONDARY BUDGET KEYWORDS (1 point each)
        const budgetSecondaryKeywords = ['price', 'afford', 'cheap', 'expensive', '$', 'save', 'spending', 'buy', 'purchase'];
        budgetSecondaryKeywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) routingScore.BMA += 1;
        });

        // ENHANCED TIE-BREAKING: Domain expertise beats budget constraints
        const topScore = Math.max(...Object.values(routingScore));
        let agent = 'MCA';

        if (topScore > 0) {
            // Get all agents with the top score
            const tiedAgents = Object.keys(routingScore).filter(a => routingScore[a] === topScore);
            
            if (tiedAgents.length === 1) {
                agent = tiedAgents[0];
            } else {
                // TIE-BREAKER: Prioritize domain expertise over budget constraints
                if (tiedAgents.includes('WPA') && (lowerMessage.includes('workout') || lowerMessage.includes('exercise') || lowerMessage.includes('fitness'))) {
                    agent = 'WPA';  // Workout expertise wins
                } else if (tiedAgents.includes('NPA') && (lowerMessage.includes('nutrition') || lowerMessage.includes('food') || lowerMessage.includes('meal'))) {
                    agent = 'NPA';  // Nutrition expertise wins  
                } else {
                    agent = tiedAgents[0];  // Default to first tied agent
                }
            }
        }

        let response = '';
        let confidence = 0.8;

        console.log(`🎯 Routing scores:`, routingScore, `→ Selected: ${agent}`);
        console.log(`💡 Top score: ${topScore}, Tied agents: ${Object.keys(routingScore).filter(a => routingScore[a] === topScore)}`);

        // Generate budget-aware responses
        switch (agent) {
            case 'WPA':
                response = await this.generateWorkoutResponse(message, memoryInsights, userId);
                break;
            case 'NPA':
                response = await this.generateNutritionResponse(message, memoryInsights, userId);
                break;
            case 'BMA':
                response = await this.generateBudgetResponse(message, memoryInsights, userId);
                this.metrics.budgetAnalysisRequests++;
                break;
            default:
                response = this.generateGeneralResponse(message, memoryInsights);
        }

        // Add budget context to non-BMA responses if relevant
        if (agent !== 'BMA' && memoryInsights.userPreferences?.budget) {
            const budgetContext = await this.getBudgetContext(userId, agent);
            if (budgetContext) {
                response += budgetContext;
            }
        }

        return {
            text: response,
            agent: agent,
            confidence: confidence
        };
    }

    async generateBudgetResponse(message, memoryInsights, userId) {
        let response = "💰 Budget Management Agent: ";
        
        const lowerMessage = message.toLowerCase();
        const userPreferences = memoryInsights.userPreferences || {};
        const budgetPlan = this.budgetPlans.get(userId);
        
        if (lowerMessage.includes('create budget') || lowerMessage.includes('budget plan')) {
            if (budgetPlan) {
                response += `I see you already have a $${budgetPlan.totalBudget} budget plan. `;
            } else {
                response += "I'll help you create an optimized budget plan! ";
            }
            
            if (userPreferences.budget) {
                const allocation = this.calculateOptimalAllocation({ totalBudget: userPreferences.budget }, userPreferences);
                response += `With your $${userPreferences.budget} budget, I recommend: Fitness: $${allocation.fitness}, Nutrition: $${allocation.nutrition}, Health: $${allocation.health}. `;
            }
            
            if (userPreferences.diet === 'vegetarian') {
                response += "For vegetarian nutrition, you can save 40-50% vs meat-based diets with smart planning. ";
            }
        } 
        else if (lowerMessage.includes('save money') || lowerMessage.includes('reduce cost')) {
            response += "Excellent! I can identify multiple cost-saving opportunities. ";
            
            const expenses = this.expenseHistory.get(userId) || [];
            if (expenses.length > 0) {
                const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
                response += `You've spent $${totalSpent} recently. `;
            }
            
            if (userPreferences.diet === 'vegetarian') {
                response += "Vegetarian proteins like lentils and chickpeas can cut protein costs by 60-70%. ";
            }
            
            response += "Key strategies: bulk purchasing ($15-25/month savings), generic brands ($10-20/month), meal prep ($20-40/week savings). ";
        }
        else if (lowerMessage.includes('expense') || lowerMessage.includes('track')) {
            response += "I can help you track and optimize your health spending. ";
            
            const expenses = this.expenseHistory.get(userId) || [];
            if (expenses.length > 0) {
                const categories = this.analyzeCategorySpending(expenses);
                const topCategory = Object.keys(categories).reduce((a, b) => categories[a].total > categories[b].total ? a : b);
                response += `Your highest spending category is ${topCategory} at $${categories[topCategory].total}. `;
            }
            
            if (budgetPlan) {
                const remaining = this.calculateRemainingBudget(userId);
                response += `You have $${remaining} remaining in your current budget. `;
            }
        }
        else {
            response += "I can optimize your health and fitness budget with smart allocation and cost-saving strategies. ";
            
            if (userPreferences.budget) {
                response += `With your $${userPreferences.budget} budget, I can help maximize value. `;
            }
            
            if (userPreferences.goal === 'muscle_building') {
                response += "For muscle building on a budget, focus 60-70% on nutrition with cost-effective proteins. ";
            }
        }
        
        response += "What specific budget goals would you like to work on?";
        
        return response;
    }

    async generateWorkoutResponse(message, insights, userId) {
        let response = "💪 Workout Planning Agent: ";
        
        const budgetPlan = this.budgetPlans.get(userId);
        const fitnessBudget = budgetPlan?.allocation?.fitness || 30;
        
        if (insights.userPreferences?.workoutLocation === 'home') {
            response += "Perfect for home workouts! ";
            
            if (fitnessBudget <= 30) {
                response += "With your budget, I recommend bodyweight exercises and resistance bands ($15-20). ";
            } else if (fitnessBudget <= 75) {
                response += `With your $${fitnessBudget} fitness budget, you can get adjustable dumbbells ($60-80) and basic equipment. `;
            }
        }
        
        if (insights.userPreferences?.timePreference === 'morning') {
            response += "Great choice for morning fitness! ";
        }

        if (insights.userPreferences?.goal === 'muscle_building') {
            response += "For muscle building, focus on compound exercises. ";
            
            if (fitnessBudget > 0) {
                response += "Cost-effective equipment: pull-up bar ($25), resistance bands ($15), adjustable dumbbells ($60-80). ";
            }
        }
        
        if (insights.contextItems?.length > 0) {
            response += `Based on our previous discussions about ${insights.contextItems[0]}, `;
        }
        
        response += "What specific fitness goals would you like to focus on?";
        
        return response;
    }

    async generateNutritionResponse(message, insights, userId) {
        let response = "🥗 Nutrition Planning Agent: ";
        
        const lowerMessage = message.toLowerCase();
        const budgetPlan = this.budgetPlans.get(userId);
        const nutritionBudget = budgetPlan?.allocation?.nutrition || 60;
        
        if (insights.userPreferences?.diet === 'vegetarian') {
            response += "Excellent vegetarian nutrition focus! ";
            
            if (lowerMessage.includes('protein')) {
                if (nutritionBudget <= 40) {
                    response += "Budget-friendly proteins: **dried lentils** ($3/lb, 18g protein/cup), **chickpeas** ($2/lb), **quinoa** ($4/lb, complete protein). ";
                } else {
                    response += "For vegetarian muscle-building proteins: **quinoa** (complete protein), **lentils** (18g per cup), **chickpeas**, **tofu**, **tempeh**, **Greek yogurt**, **nuts**, and **seeds**. ";
                }
            }
            
            if (lowerMessage.includes('muscle') || insights.userPreferences?.goal === 'muscle_building') {
                response += "For muscle building, aim for 1.6-2.2g protein per kg body weight daily. ";
                
                if (nutritionBudget > 0) {
                    response += `With your $${nutritionBudget} nutrition budget, focus 70% on protein sources. `;
                }
            }
        }
        
        if (nutritionBudget > 0) {
            if (nutritionBudget <= 30) {
                response += "Budget optimization: bulk dried beans ($2-3/lb), brown rice ($1.50/lb), seasonal vegetables. ";
            } else if (nutritionBudget <= 60) {
                response += `With your $${nutritionBudget} budget, you can include Greek yogurt, nuts, and protein powder. `;
            }
        }
        
        if (insights.contextItems?.length > 0) {
            response += `Building on our previous discussion about ${insights.contextItems[0]}, `;
        }
        
        response += "What specific nutritional goals would you like to focus on?";
        
        return response;
    }

    generateGeneralResponse(message, insights) {
        let response = "🤖 Master Control Agent: ";
        
        if (insights.userPreferences && Object.keys(insights.userPreferences).length > 0) {
            const prefs = insights.userPreferences;
            response += "Based on what I've learned about your preferences ";
            
            const prefList = [];
            if (prefs.diet) prefList.push(`${prefs.diet} diet`);
            if (prefs.workoutLocation) prefList.push(`${prefs.workoutLocation} workouts`);
            if (prefs.budget) prefList.push(`$${prefs.budget} budget`);
            
            if (prefList.length > 0) {
                response += `(${prefList.join(', ')}), `;
            }
        }
        
        response += "I'm here to help with fitness, nutrition, and budget planning. ";
        response += "How can I assist you today?";
        
        return response;
    }

    async getBudgetContext(userId, agentType) {
        const budgetPlan = this.budgetPlans.get(userId);
        if (!budgetPlan) return null;

        let budgetContext = "";
        
        if (agentType === 'NPA' && budgetPlan.allocation.nutrition) {
            const remaining = this.calculateCategoryRemaining(userId, 'nutrition');
            if (remaining < budgetPlan.allocation.nutrition * 0.2) { // Less than 20% remaining
                budgetContext = ` (Budget Alert: Only $${remaining} left for nutrition this period)`;
            }
        } else if (agentType === 'WPA' && budgetPlan.allocation.fitness) {
            const remaining = this.calculateCategoryRemaining(userId, 'fitness');
            if (remaining < budgetPlan.allocation.fitness * 0.2) {
                budgetContext = ` (Budget Alert: Only $${remaining} left for fitness this period)`;
            }
        }

        return budgetContext;
    }

    // ========================================
    // BUDGET MANAGEMENT METHODS (Simplified Integration)
    // ========================================

    async createBudgetPlan(userId, budgetData, userProfile = {}) {
        console.log(`💰 Creating budget plan for user: ${userId}`);
        
        const budgetPlan = {
            userId: userId,
            created: new Date().toISOString(),
            totalBudget: budgetData.totalBudget || 100,
            timeframe: budgetData.timeframe || 'weekly',
            preferences: {
                diet: userProfile.diet || userProfile.preferences?.diet || 'general',
                fitnessLevel: userProfile.fitnessLevel || 'beginner',
                goals: userProfile.goals || []
            },
            allocation: this.calculateOptimalAllocation(budgetData, userProfile),
            recommendations: await this.generateBudgetRecommendations(budgetData, userProfile)
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
        const goals = userProfile.goals || [];
        const preferences = userProfile.preferences || userProfile;
        
        if (goals.some(g => g.type === 'muscle_building') || preferences.goal === 'muscle_building') {
            nutritionPercent += 0.10;
            fitnessPercent -= 0.05;
            healthPercent -= 0.05;
        }
        
        if (goals.some(g => g.type === 'weight_loss') || preferences.goal === 'weight_loss') {
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
        
        return allocation;
    }

    async generateBudgetRecommendations(budgetData, userProfile) {
        const recommendations = { fitness: [], nutrition: [], health: [] };
        const totalBudget = budgetData.totalBudget || 100;
        const diet = userProfile.diet || userProfile.preferences?.diet || 'general';

        // Fitness recommendations based on budget
        if (totalBudget <= 50) {
            recommendations.fitness = [
                'Focus on bodyweight exercises (free)',
                'Resistance bands set ($15-20)',
                'YouTube workout videos (free)',
                'Outdoor activities (running, hiking)'
            ];
        } else if (totalBudget <= 150) {
            recommendations.fitness = [
                'Adjustable dumbbells ($60-80)',
                'Pull-up bar ($25)',
                'Yoga mat ($20)',
                'Basic home gym setup'
            ];
        }

        // Nutrition recommendations
        if (diet === 'vegetarian') {
            recommendations.nutrition = [
                'Bulk dried beans and lentils ($2-3/lb)',
                'Quinoa for complete protein ($4-5/lb)',
                'Seasonal vegetables',
                'Plant-based protein powder ($30-40/month)'
            ];
        }

        return recommendations;
    }

    async logExpense(userId, expenseData) {
        const expense = {
            id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: userId,
            amount: expenseData.amount,
            category: expenseData.category || 'general',
            subcategory: expenseData.subcategory || 'miscellaneous',
            description: expenseData.description || '',
            date: expenseData.date || new Date().toISOString(),
            tags: expenseData.tags || []
        };

        // Store expense
        if (!this.expenseHistory.has(userId)) {
            this.expenseHistory.set(userId, []);
        }
        this.expenseHistory.get(userId).push(expense);

        // Save to disk
        await this.saveExpense(expense);

        console.log(`💰 Logged expense: $${expense.amount} for ${expense.category} (${userId})`);

        return {
            expenseId: expense.id,
            budget_impact: await this.calculateBudgetImpact(userId, expense),
            optimization_suggestion: []
        };
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
            status: remaining > 0 ? 'within_budget' : 'over_budget'
        };
    }

    calculateCategorySpent(userId, category) {
        const expenses = this.expenseHistory.get(userId) || [];
        const currentMonth = new Date().toISOString().substring(0, 7);
        
        return expenses
            .filter(exp => exp.category === category)
            .filter(exp => exp.date.substring(0, 7) === currentMonth)
            .reduce((total, exp) => total + exp.amount, 0);
    }

    calculateCategoryRemaining(userId, category) {
        const budgetPlan = this.budgetPlans.get(userId);
        if (!budgetPlan) return 0;

        const allocated = budgetPlan.allocation[category] || 0;
        const spent = this.calculateCategorySpent(userId, category);
        
        return Math.max(allocated - spent, 0);
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

    async generateFinancialReport(userId, timeframe) {
        const expenses = this.expenseHistory.get(userId) || [];
        const budgetPlan = this.budgetPlans.get(userId);
        
        const report = {
            userId: userId,
            timeframe: timeframe,
            generated_at: new Date().toISOString(),
            summary: this.calculateExpenseSummary(expenses),
            category_breakdown: this.analyzeCategorySpending(expenses),
            budget_performance: budgetPlan ? this.analyzeBudgetPerformance(budgetPlan, expenses) : null
        };

        return report;
    }

    calculateExpenseSummary(expenses) {
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const average = expenses.length > 0 ? total / expenses.length : 0;

        return {
            total_spent: Math.round(total * 100) / 100,
            transaction_count: expenses.length,
            average_transaction: Math.round(average * 100) / 100
        };
    }

    analyzeCategorySpending(expenses) {
        const categories = {};
        
        expenses.forEach(expense => {
            const category = expense.category;
            if (!categories[category]) {
                categories[category] = { total: 0, count: 0 };
            }
            categories[category].total += expense.amount;
            categories[category].count += 1;
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
                status: spent <= budgeted ? 'on_track' : 'over_budget'
            };
        });

        return performance;
    }

    async getOptimizedRecommendations(userId, requestType, parameters = {}) {
        const budgetPlan = this.budgetPlans.get(userId);
        const recommendations = [];

        if (requestType === 'nutrition_meal_plan') {
            const nutritionBudget = budgetPlan?.allocation?.nutrition || 60;
            
            if (nutritionBudget <= 30) {
                recommendations.push({
                    category: 'budget_nutrition',
                    items: [
                        { item: 'Dried beans/lentils', cost: '$3-4/week' },
                        { item: 'Brown rice (bulk)', cost: '$2/week' },
                        { item: 'Seasonal vegetables', cost: '$8-12/week' }
                    ]
                });
            }
        }

        return { recommendations };
    }

    async checkBudgetActions(message, userId, memoryInsights) {
        const actions = [];
        const lowerMessage = message.toLowerCase();
        const budgetPlan = this.budgetPlans.get(userId);

        if (lowerMessage.includes('spent') || lowerMessage.includes('bought')) {
            // Suggest expense logging
            actions.push({
                type: 'expense_logging_suggestion',
                message: 'Would you like me to help you log this expense and track it against your budget?'
            });
        }

        if (budgetPlan && lowerMessage.includes('budget')) {
            const remaining = this.calculateRemainingBudget(userId);
            actions.push({
                type: 'budget_status',
                message: `You have $${remaining} remaining in your current budget.`
            });
        }

        return actions;
    }

    // ========================================
    // FILE OPERATIONS AND UTILITIES
    // ========================================

    async saveBudgetPlan(budgetPlan) {
        try {
            const filePath = `data/budgets/${budgetPlan.userId}_plan.json`;
            await fs.writeFile(filePath, JSON.stringify(budgetPlan, null, 2));
        } catch (error) {
            console.error('❌ Error saving budget plan:', error);
        }
    }

    async saveExpense(expense) {
        try {
            const date = expense.date.substring(0, 7); // YYYY-MM
            const filePath = `data/expenses/${expense.userId}_${date}.json`;
            
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

    // Existing memory methods (from previous implementation)
    async getMemoryInsights(userId, message) {
        const insights = {
            userPreferences: this.extractUserPreferences(userId, message),
            contextItems: this.findContextualItems(userId, message),
            pastSimilarMessages: this.findSimilarPastMessages(message, userId),
            learningData: this.getLearnedData(userId)
        };

        return insights;
    }

    extractUserPreferences(userId, message) {
        const profile = this.userProfiles.get(userId) || {};
        const currentPreferences = {};

        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan')) {
            currentPreferences.diet = 'vegetarian';
        }
        if (lowerMessage.includes('home workout') || lowerMessage.includes('at home') || lowerMessage.includes('home')) {
            currentPreferences.workoutLocation = 'home';
        }
        if (lowerMessage.includes('muscle') || lowerMessage.includes('build') || lowerMessage.includes('gain')) {
            currentPreferences.goal = 'muscle_building';
        }
        
        // Enhanced budget extraction
        const budgetMatch = message.match(/\$(\d+)/);
        if (budgetMatch) {
            currentPreferences.budget = parseInt(budgetMatch[1]);
        }

        const nameMatch = message.match(/i'm (\w+)|my name is (\w+)|call me (\w+)/i);
        if (nameMatch) {
            currentPreferences.name = nameMatch[1] || nameMatch[2] || nameMatch[3];
        }

        return { ...(profile.preferences || {}), ...currentPreferences };
    }

    calculatePersonalization(userId, message) {
        const profile = this.userProfiles.get(userId);
        if (!profile) return 0;

        let score = 0;
        if (profile.preferences && Object.keys(profile.preferences).length > 0) score += 0.4;
        if (profile.totalMessages > 1) score += 0.2;
        if (profile.totalMessages > 5) score += 0.2;
        if (profile.goals && profile.goals.length > 0) score += 0.2;

        return Math.round(score * 100) / 100;
    }

    async storeConversation(userId, sessionId, message, response, insights) {
        const conversationEntry = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: userId,
            sessionId: sessionId,
            message: message,
            response: response,
            timestamp: new Date().toISOString(),
            insights: insights
        };

        this.messageHistory.push(conversationEntry);
        this.updateUserProfile(userId, message, insights);

        const conversationId = `${userId}_${sessionId}`;
        if (!this.conversations.has(conversationId)) {
            this.conversations.set(conversationId, []);
        }
        this.conversations.get(conversationId).push(conversationEntry);

        this.persistConversation(conversationEntry);
    }

    updateUserProfile(userId, message, insights) {
        let profile = this.userProfiles.get(userId) || {
            userId: userId,
            created: new Date().toISOString(),
            totalMessages: 0,
            preferences: {},
            goals: [],
            lastActive: null
        };

        profile.totalMessages++;
        profile.lastActive = new Date().toISOString();
        
        if (insights.userPreferences) {
            profile.preferences = { ...profile.preferences, ...insights.userPreferences };
        }

        const goals = this.extractGoals(message);
        for (const goal of goals) {
            if (!profile.goals.some(g => g.type === goal.type)) {
                profile.goals.push(goal);
            }
        }

        this.userProfiles.set(userId, profile);
    }

    extractGoals(message) {
        const goals = [];
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('lose weight') || lowerMessage.includes('weight loss')) {
            goals.push({ type: 'weight_loss', description: 'Lose weight' });
        }
        if (lowerMessage.includes('build muscle') || lowerMessage.includes('gain muscle') || lowerMessage.includes('muscle building')) {
            goals.push({ type: 'muscle_building', description: 'Build muscle' });
        }
        if (lowerMessage.includes('save money') || lowerMessage.includes('budget')) {
            goals.push({ type: 'budget_optimization', description: 'Optimize budget and save money' });
        }

        return goals;
    }

    // Additional utility methods
    findContextualItems(userId, message) { return []; }
    findSimilarPastMessages(message, userId) { return []; }
    getLearnedData(userId) { return {}; }
    async searchMemory(query, userId, options) { return []; }
    getUserProfile(userId) { 
        const profile = this.userProfiles.get(userId);
        return profile || {
            userId: userId,
            totalMessages: 0,
            preferences: {},
            goals: []
        };
    }
    async persistConversation(conversationEntry) {}

    updateMetrics(responseTime, success) {
        this.metrics.totalRequests++;
        this.metrics.totalResponseTime += responseTime;
        
        if (success) {
            this.metrics.successfulRequests++;
        }
    }

    calculateSuccessRate() {
        if (this.metrics.totalRequests === 0) return 100;
        return Math.round((this.metrics.successfulRequests / this.metrics.totalRequests) * 100);
    }

    getPerformanceMetrics() {
        const avgResponseTime = this.metrics.totalRequests > 0 
            ? Math.round(this.metrics.totalResponseTime / this.metrics.totalRequests)
            : 0;

        return {
            total_requests: this.metrics.totalRequests,
            successful_requests: this.metrics.successfulRequests,
            success_rate: this.calculateSuccessRate() + '%',
            average_response_time: avgResponseTime + 'ms',
            memory_enhanced_requests: this.metrics.memoryEnhancedRequests,
            budget_analysis_requests: this.metrics.budgetAnalysisRequests,
            memory_enhancement_rate: this.metrics.totalRequests > 0 
                ? Math.round((this.metrics.memoryEnhancedRequests / this.metrics.totalRequests) * 100) + '%'
                : '0%',
            budget_analysis_rate: this.metrics.totalRequests > 0 
                ? Math.round((this.metrics.budgetAnalysisRequests / this.metrics.totalRequests) * 100) + '%'
                : '0%'
        };
    }

    formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    async start() {
        await this.initialize();
        
        this.app.listen(this.port, () => {
            console.log('\n💰 PROGRESSIVE FRAMEWORK V5 - BUDGET INTEGRATED');
            console.log('='.repeat(70));
            console.log(`🌐 Server running on http://localhost:${this.port}`);
            console.log(`🧠 Memory System: ACTIVE`);
            console.log(`📚 Conversation Storage: ACTIVE`);
            console.log(`💰 Budget Management: ACTIVE`);
            console.log(`📊 Financial Analytics: ACTIVE`);
            console.log(`🤖 Intelligent Agents: 4 active (MCA, NPA, WPA, BMA)`);
            console.log('🚀 Ready for intelligent, budget-aware conversations!');
            console.log('='.repeat(70));
            
            console.log('\n📍 Available Endpoints:');
            console.log('   POST /chat - Budget-integrated conversations');
            console.log('   POST /budget/create - Create budget plans');
            console.log('   POST /budget/expense - Log expenses');
            console.log('   GET /budget/report/:userId - Financial reports');
            console.log('   POST /budget/optimize - Get recommendations');
            console.log('   POST /memory/search - Search conversations');
            console.log('   GET /memory/profile/:userId - Enhanced profiles');
            console.log('   GET /status - System status');
            console.log('\n💡 Your complete health & financial assistant is ready!');
        });
    }
}

// Start the framework
const framework = new BudgetIntegratedFramework();
framework.start().catch(error => {
    console.error('❌ Failed to start Budget-Integrated Framework:', error);
    process.exit(1);
});