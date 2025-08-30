    // Progressive Framework V5 - STANDALONE Memory Enhanced Server
// NO EXTERNAL DEPENDENCIES - Works immediately

const express = require('express');
const path = require('path');
const fs = require('fs').promises;

class StandaloneMemoryFramework {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        
        // In-memory storage
        this.conversations = new Map();
        this.userProfiles = new Map();
        this.messageHistory = [];
        
        // Performance tracking
        this.metrics = {
            totalRequests: 0,
            successfulRequests: 0,
            memoryEnhancedRequests: 0,
            totalResponseTime: 0,
            startTime: Date.now()
        };
        
        this.initialized = false;
    }

    async initialize() {
        console.log('🚀 Initializing Standalone Memory Framework...');
        
        // Create memory directories if they don't exist
        try {
            await fs.mkdir('data/conversations', { recursive: true });
            await fs.mkdir('data/profiles', { recursive: true });
            console.log('✅ Memory directories ready');
        } catch (error) {
            console.log('📁 Memory directories already exist');
        }
        
        // Load existing conversations
        await this.loadExistingData();
        
        // Setup middleware and routes
        this.setupMiddleware();
        this.setupRoutes();
        
        this.initialized = true;
        console.log('✅ Standalone Memory Framework initialized');
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
            
            console.log(`📚 Loaded ${loadedMessages} messages from ${files.length} files`);
            
        } catch (error) {
            console.log('📝 Starting with fresh memory');
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
        // Main chat endpoint with memory
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

                // Generate intelligent response
                const response = await this.generateIntelligentResponse(message, memoryInsights, userId);

                // Store conversation
                await this.storeConversation(userId, sessionId, message, response.text, memoryInsights);

                // Enhanced response
                const enhancedResponse = {
                    response: response.text,
                    agent_type: response.agent,
                    confidence: response.confidence,
                    enhanced_mode: useMemory,
                    memory_insights: memoryInsights,
                    personalization_level: personalizationLevel,
                    context_awareness: memoryInsights.contextItems ? memoryInsights.contextItems.length / 5 : 0,
                    processing_time: Date.now() - req.startTime,
                    memory_status: {
                        conversations_stored: this.conversations.size,
                        user_profiles: this.userProfiles.size,
                        total_messages: this.messageHistory.length
                    }
                };

                console.log(`✅ Response: ${response.agent} (${response.confidence}) - ${personalizationLevel} personalization`);
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

        // Memory search endpoint
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

        // User profile endpoint
        this.app.get('/memory/profile/:userId', async (req, res) => {
            try {
                const { userId } = req.params;
                const profile = this.getUserProfile(userId);

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

        // Status endpoint
        this.app.get('/status', (req, res) => {
            const uptime = Date.now() - this.metrics.startTime;
            
            res.json({
                status: 'operational',
                version: '5.0.0-standalone-memory',
                uptime_ms: uptime,
                uptime_formatted: this.formatUptime(uptime),
                framework: {
                    initialized: this.initialized,
                    memory_system_active: true,
                    conversation_persistence: true,
                    standalone_mode: true
                },
                memory_system: {
                    conversations_in_memory: this.conversations.size,
                    user_profiles: this.userProfiles.size,
                    total_messages: this.messageHistory.length
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
                version: '5.0.0-standalone-memory'
            });
        });

        // Agents endpoint (virtual agents)
        this.app.get('/agents', (req, res) => {
            res.json({
                success: true,
                agents: {
                    MCA: { name: 'Master Control Agent', status: 'active', capabilities: ['routing', 'coordination'] },
                    NPA: { name: 'Nutrition Planning Agent', status: 'active', capabilities: ['nutrition', 'meal_planning'] },
                    WPA: { name: 'Workout Planning Agent', status: 'active', capabilities: ['fitness', 'workout_planning'] },
                    BMA: { name: 'Budget Management Agent', status: 'active', capabilities: ['budgeting', 'cost_optimization'] }
                },
                total_agents: 4,
                memory_enhanced: true,
                standalone_mode: true
            });
        });

        // MCA status endpoint
        this.app.get('/mca/status', (req, res) => {
            res.json({
                agent: 'Master Control Agent',
                status: 'operational',
                version: '5.0.0-standalone',
                memory_integration: true,
                requests_processed: this.metrics.totalRequests,
                success_rate: this.calculateSuccessRate(),
                standalone_mode: true
            });
        });

        // Root endpoint
        this.app.get('/', (req, res) => {
            res.json({
                message: 'Progressive Framework V5 - Standalone Memory Enhanced',
                version: '5.0.0-standalone',
                status: 'operational',
                memory_features: true,
                endpoints: [
                    'POST /chat - Memory-enhanced conversations',
                    'POST /memory/search - Search conversation history',
                    'GET /memory/profile/:userId - User profiles',
                    'GET /status - System status',
                    'GET /health - Health check',
                    'GET /agents - Agent information'
                ]
            });
        });
    }

    // ========================================
    // INTELLIGENT RESPONSE GENERATION
    // ========================================

    async generateIntelligentResponse(message, memoryInsights, userId) {
        const lowerMessage = message.toLowerCase();
        
        // Enhanced routing logic with scoring
        let routingScore = { WPA: 0, NPA: 0, BMA: 0, MCA: 0 };
        
        // Workout keywords (more comprehensive)
        const workoutKeywords = ['workout', 'exercise', 'fitness', 'training', 'gym', 'cardio', 'strength', 'run', 'lift'];
        workoutKeywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) routingScore.WPA += 1;
        });
        
        // Nutrition keywords (more comprehensive)
        const nutritionKeywords = ['food', 'nutrition', 'meal', 'diet', 'protein', 'vegetarian', 'eat', 'calories', 'vegan'];
        nutritionKeywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) routingScore.NPA += 2; // Higher weight for nutrition
        });
        
        // Budget keywords
        const budgetKeywords = ['budget', 'cost', 'money', 'price', 'afford', 'cheap', 'expensive', '$'];
        budgetKeywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) routingScore.BMA += 1;
        });

        // Find highest scoring agent
        const topAgent = Object.keys(routingScore).reduce((a, b) => routingScore[a] > routingScore[b] ? a : b);
        let agent = routingScore[topAgent] > 0 ? topAgent : 'MCA';
        let response = '';
        let confidence = 0.8;

        console.log(`🎯 Routing scores:`, routingScore, `→ Selected: ${agent}`);

        switch (agent) {
            case 'WPA':
                response = this.generateWorkoutResponse(message, memoryInsights);
                break;
            case 'NPA':
                response = this.generateNutritionResponse(message, memoryInsights);
                break;
            case 'BMA':
                response = this.generateBudgetResponse(message, memoryInsights);
                break;
            default:
                response = this.generateGeneralResponse(message, memoryInsights);
        }

        // Add personalization based on memory
        if (memoryInsights.userPreferences && Object.keys(memoryInsights.userPreferences).length > 0) {
            response = this.personalizeResponse(response, memoryInsights.userPreferences);
        }

        return {
            text: response,
            agent: agent,
            confidence: confidence
        };
    }

    generateWorkoutResponse(message, insights) {
        let response = "💪 Workout Planning Agent: ";
        
        if (insights.userPreferences?.workoutLocation === 'home') {
            response += "Perfect for home workouts! ";
        }
        
        if (insights.userPreferences?.timePreference === 'morning') {
            response += "Great choice for morning fitness! ";
        }

        response += "I can help you create a personalized workout routine. ";
        
        if (insights.userPreferences?.goal === 'muscle_building') {
            response += "For muscle building, I recommend compound exercises like push-ups, squats, and planks. ";
        }
        
        if (insights.contextItems?.length > 0) {
            response += `Based on our previous discussions about ${insights.contextItems[0]}, `;
        }
        
        response += "What specific fitness goals would you like to focus on?";
        
        return response;
    }

    generateNutritionResponse(message, insights) {
        let response = "🥗 Nutrition Planning Agent: ";
        
        const lowerMessage = message.toLowerCase();
        
        if (insights.userPreferences?.diet === 'vegetarian') {
            response += "Excellent vegetarian nutrition focus! ";
            
            if (lowerMessage.includes('protein')) {
                response += "For vegetarian muscle-building proteins, I recommend: **quinoa** (complete protein), **lentils** (18g per cup), **chickpeas**, **tofu**, **tempeh**, **Greek yogurt**, **nuts**, and **seeds**. ";
            }
            
            if (lowerMessage.includes('muscle') || insights.userPreferences?.goal === 'muscle_building') {
                response += "For muscle building, aim for 1.6-2.2g protein per kg body weight daily. ";
            }
        }
        
        if (insights.userPreferences?.budget) {
            response += `With your $${insights.userPreferences.budget} budget, lentils and chickpeas are excellent cost-effective protein sources! `;
        }
        
        if (insights.contextItems?.length > 0) {
            response += `Building on our previous discussion about ${insights.contextItems[0]}, `;
        }
        
        response += "What specific nutritional goals would you like to focus on?";
        
        return response;
    }

    generateBudgetResponse(message, insights) {
        let response = "💰 Budget Management Agent: ";
        
        if (insights.userPreferences?.budget) {
            response += `Working with your $${insights.userPreferences.budget}/week budget! `;
            
            const budget = parseInt(insights.userPreferences.budget);
            if (budget <= 50) {
                response += "For cost-effective nutrition: bulk lentils ($2/lb), rice ($1/lb), bananas ($1/lb), and seasonal vegetables. ";
            }
        }
        
        if (insights.userPreferences?.diet === 'vegetarian') {
            response += "Vegetarian proteins like lentils and chickpeas offer excellent value! ";
        }
        
        response += "I can help optimize your health and fitness spending. ";
        response += "What budget planning can I assist with?";
        
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

    personalizeResponse(response, preferences) {
        // Add personalization based on learned preferences
        if (preferences.name) {
            response = response.replace("I can help", `I can help you, ${preferences.name},`);
        }
        
        return response;
    }

    // ========================================
    // MEMORY METHODS
    // ========================================

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

        // Extract preferences from current message
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan')) {
            currentPreferences.diet = 'vegetarian';
        }
        if (lowerMessage.includes('home workout') || lowerMessage.includes('at home') || lowerMessage.includes('home')) {
            currentPreferences.workoutLocation = 'home';
        }
        if (lowerMessage.includes('morning') || lowerMessage.includes('am')) {
            currentPreferences.timePreference = 'morning';
        }
        if (lowerMessage.includes('evening') || lowerMessage.includes('pm')) {
            currentPreferences.timePreference = 'evening';
        }
        if (lowerMessage.includes('muscle') || lowerMessage.includes('build') || lowerMessage.includes('gain')) {
            currentPreferences.goal = 'muscle_building';
        }
        if (lowerMessage.includes('lose weight') || lowerMessage.includes('weight loss')) {
            currentPreferences.goal = 'weight_loss';
        }
        
        // Extract budget information
        const budgetMatch = message.match(/\$(\d+)/);
        if (budgetMatch) {
            currentPreferences.budget = parseInt(budgetMatch[1]);
        }

        // Extract name if provided
        const nameMatch = message.match(/i'm (\w+)|my name is (\w+)|call me (\w+)/i);
        if (nameMatch) {
            currentPreferences.name = nameMatch[1] || nameMatch[2] || nameMatch[3];
        }

        // Merge with stored preferences
        const mergedPreferences = { ...(profile.preferences || {}), ...currentPreferences };
        
        return mergedPreferences;
    }

    findContextualItems(userId, message) {
        // Find related items from past conversations
        const userMessages = this.messageHistory.filter(m => m.userId === userId);
        const contextItems = [];

        for (const pastMessage of userMessages.slice(-10)) {
            if (this.calculateSimilarity(message, pastMessage.message) > 0.3) {
                // Extract topic from past message
                const topic = this.extractMainTopic(pastMessage.message);
                if (topic) contextItems.push(topic);
            }
        }

        return [...new Set(contextItems)].slice(0, 3);
    }

    extractMainTopic(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('vegetarian') || lowerMessage.includes('diet')) return 'dietary preferences';
        if (lowerMessage.includes('workout') || lowerMessage.includes('fitness')) return 'fitness';
        if (lowerMessage.includes('budget') || lowerMessage.includes('money')) return 'budget planning';
        if (lowerMessage.includes('protein')) return 'protein planning';
        
        return 'general health';
    }

    findSimilarPastMessages(message, userId) {
        return this.messageHistory
            .filter(m => m.userId === userId)
            .filter(m => this.calculateSimilarity(message, m.message) > 0.3)
            .slice(0, 3)
            .map(m => ({
                message: m.message.substring(0, 100) + '...',
                timestamp: m.timestamp,
                similarity: Math.round(this.calculateSimilarity(message, m.message) * 100) / 100
            }));
    }

    calculateSimilarity(message1, message2) {
        if (!message1 || !message2) return 0;
        
        const words1 = message1.toLowerCase().split(' ').filter(w => w.length > 2);
        const words2 = message2.toLowerCase().split(' ').filter(w => w.length > 2);
        
        if (words1.length === 0 || words2.length === 0) return 0;
        
        const commonWords = words1.filter(word => words2.includes(word));
        return commonWords.length / Math.max(words1.length, words2.length);
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

        // Store in memory
        this.messageHistory.push(conversationEntry);

        // Update user profile
        this.updateUserProfile(userId, message, insights);

        // Store conversation thread
        const conversationId = `${userId}_${sessionId}`;
        if (!this.conversations.has(conversationId)) {
            this.conversations.set(conversationId, []);
        }
        this.conversations.get(conversationId).push(conversationEntry);

        // Persist to disk (async)
        this.persistConversation(conversationEntry);
        
        console.log(`💾 Stored conversation for ${userId}: "${message.substring(0, 50)}..."`);
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
        
        // Update preferences
        if (insights.userPreferences) {
            profile.preferences = { ...profile.preferences, ...insights.userPreferences };
            console.log(`🧠 Updated profile for ${userId}:`, profile.preferences);
        }

        // Extract goals
        const goals = this.extractGoals(message);
        for (const goal of goals) {
            if (!profile.goals.some(g => g.type === goal.type)) {
                profile.goals.push(goal);
                console.log(`🎯 New goal identified for ${userId}: ${goal.description}`);
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
        if (lowerMessage.includes('get fit') || lowerMessage.includes('fitness')) {
            goals.push({ type: 'general_fitness', description: 'Improve overall fitness' });
        }

        return goals;
    }

    async searchMemory(query, userId, options) {
        const lowerQuery = query.toLowerCase().trim();
        const queryWords = lowerQuery.split(' ').filter(word => word.length > 2);
        const results = [];

        console.log(`🔍 Searching ${this.messageHistory.length} messages for: "${query}"`);
        console.log(`🔎 Query words: [${queryWords.join(', ')}]`);

        for (const message of this.messageHistory) {
            if (userId && message.userId !== userId) continue;

            const messageLower = (message.message || '').toLowerCase();
            const responseLower = (message.response || '').toLowerCase();
            const combinedText = messageLower + ' ' + responseLower;
            
            let matchScore = 0;
            let matchedWords = [];
            
            // Check for exact word matches
            for (const word of queryWords) {
                if (combinedText.includes(word)) {
                    matchScore++;
                    matchedWords.push(word);
                }
            }
            
            // Boost for key concepts
            if (lowerQuery.includes('vegetarian') && (combinedText.includes('vegetarian') || combinedText.includes('vegan'))) {
                matchScore += 2;
                matchedWords.push('vegetarian-match');
            }
            
            if (lowerQuery.includes('workout') && (combinedText.includes('workout') || combinedText.includes('exercise') || combinedText.includes('fitness'))) {
                matchScore += 2;
                matchedWords.push('workout-match');
            }

            if (matchScore > 0) {
                const relevanceScore = matchScore / Math.max(queryWords.length, 1);
                results.push({
                    ...message,
                    relevanceScore: relevanceScore,
                    searchType: 'enhanced_keyword',
                    matchedWords: matchedWords,
                    matchScore: matchScore
                });
                
                console.log(`📍 Match found: "${message.message.substring(0, 50)}..." (score: ${matchScore})`);
            }
        }

        console.log(`🎯 Search complete: ${results.length} results found`);
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    getUserProfile(userId) {
        const profile = this.userProfiles.get(userId);
        
        if (!profile) {
            return {
                userId: userId,
                totalMessages: 0,
                preferences: {},
                goals: [],
                message: 'No conversation history found'
            };
        }

        return {
            ...profile,
            preferencesCount: Object.keys(profile.preferences || {}).length,
            goalsCount: (profile.goals || []).length,
            hasLearningData: Object.keys(profile.preferences || {}).length > 0
        };
    }

    getLearnedData(userId) {
        const profile = this.userProfiles.get(userId);
        if (!profile) return {};

        return {
            totalConversations: profile.totalMessages || 0,
            knownPreferences: Object.keys(profile.preferences || {}),
            identifiedGoals: (profile.goals || []).length,
            profileCompleteness: this.calculateProfileCompleteness(profile)
        };
    }

    calculateProfileCompleteness(profile) {
        let score = 0;
        if (profile.preferences?.diet) score += 0.25;
        if (profile.preferences?.workoutLocation) score += 0.25;
        if (profile.preferences?.goal) score += 0.25;
        if (profile.preferences?.budget) score += 0.25;
        
        return Math.round(score * 100) / 100;
    }

    async persistConversation(conversationEntry) {
        try {
            const date = new Date().toISOString().split('T')[0];
            const filePath = `data/conversations/${conversationEntry.userId}_${date}.json`;
            
            // Load existing day's conversations
            let dayConversations = [];
            try {
                const existingContent = await fs.readFile(filePath, 'utf8');
                dayConversations = JSON.parse(existingContent);
            } catch (error) {
                // File doesn't exist yet, that's fine
            }
            
            dayConversations.push(conversationEntry);
            await fs.writeFile(filePath, JSON.stringify(dayConversations, null, 2));
            
            console.log(`💾 Persisted conversation to: ${filePath}`);
            
        } catch (error) {
            console.error('❌ Error persisting conversation:', error);
        }
    }

    // Helper methods
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
            memory_enhancement_rate: this.metrics.totalRequests > 0 
                ? Math.round((this.metrics.memoryEnhancedRequests / this.metrics.totalRequests) * 100) + '%'
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
            console.log('\n🎯 PROGRESSIVE FRAMEWORK V5 - STANDALONE MEMORY MODE');
            console.log('='.repeat(70));
            console.log(`🌐 Server running on http://localhost:${this.port}`);
            console.log(`🧠 Memory System: ACTIVE (Standalone Mode)`);
            console.log(`📚 Conversation Storage: ACTIVE`);
            console.log(`🤖 Virtual Agents: 4 active (MCA, NPA, WPA, BMA)`);
            console.log('🚀 Ready for intelligent, memory-enhanced conversations!');
            console.log('='.repeat(70));
            
            console.log('\n📍 Available Endpoints:');
            console.log('   POST /chat - Memory-enhanced conversations');
            console.log('   POST /memory/search - Search conversation history');
            console.log('   GET /memory/profile/:userId - User profiles');
            console.log('   GET /status - System status');
            console.log('   GET /health - Health check');
            console.log('   GET /agents - Agent information');
            console.log('\n💡 Test with: node demo-memory-capabilities.js');
            console.log('🎯 Or test manually: POST http://localhost:3000/chat');
        });
    }
}

// Start the framework
const framework = new StandaloneMemoryFramework();
framework.start().catch(error => {
    console.error('❌ Failed to start Standalone Memory Framework:', error);
    process.exit(1);
});