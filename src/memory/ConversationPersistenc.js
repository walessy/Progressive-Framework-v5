// Progressive Framework V5 - Conversation Persistence Enhancement
// Advanced Memory System with Semantic Search and Learning

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const EventEmitter = require('events');

class ConversationPersistence extends EventEmitter {
    constructor() {
        super();
        this.memoryPath = path.join(__dirname, '../../data/conversations');
        this.indexPath = path.join(__dirname, '../../data/conversation_index.json');
        this.semanticIndexPath = path.join(__dirname, '../../data/semantic_index.json');
        
        // Memory storage structures
        this.conversations = new Map();
        this.userProfiles = new Map();
        this.topicIndex = new Map();
        this.semanticIndex = new Map();
        this.contextPatterns = new Map();
        
        // Learning and analysis
        this.learningPatterns = new Map();
        this.conversationSummaries = new Map();
        this.entityExtraction = new Map();
        
        // Configuration
        this.config = {
            maxConversationsInMemory: 1000,
            conversationTimeoutMs: 24 * 60 * 60 * 1000, // 24 hours
            semanticSimilarityThreshold: 0.7,
            contextWindowSize: 10,
            autoSummaryThreshold: 20, // messages
            learningUpdateInterval: 5 * 60 * 1000, // 5 minutes
        };
        
        this.initialized = false;
    }

    async initialize() {
        try {
            await fs.mkdir(this.memoryPath, { recursive: true });
            await fs.mkdir(path.dirname(this.indexPath), { recursive: true });
            
            await this.loadExistingConversations();
            await this.loadIndexes();
            await this.startLearningEngine();
            
            this.initialized = true;
            console.log('🧠 Conversation Persistence System initialized');
            console.log(`📚 Loaded ${this.conversations.size} existing conversations`);
            console.log(`🎯 Tracking ${this.userProfiles.size} user profiles`);
            
            this.emit('system:ready');
            
        } catch (error) {
            console.error('❌ Conversation Persistence initialization failed:', error);
            throw error;
        }
    }

    // ========================================
    // CONVERSATION STORAGE & RETRIEVAL
    // ========================================

    async storeConversation(userId, sessionId, message, response, context = {}) {
        if (!this.initialized) await this.initialize();
        
        const conversationId = this.generateConversationId(userId, sessionId);
        const messageId = this.generateMessageId();
        
        const conversationEntry = {
            id: messageId,
            conversationId: conversationId,
            userId: userId,
            sessionId: sessionId,
            timestamp: new Date().toISOString(),
            message: {
                content: message,
                intent: context.intent || await this.extractIntent(message),
                entities: context.entities || await this.extractEntities(message),
                sentiment: context.sentiment || await this.analyzeSentiment(message),
                complexity: this.calculateMessageComplexity(message)
            },
            response: {
                content: response,
                agentType: context.agentType || 'MCA',
                confidence: context.confidence || 0.8,
                actions: context.actions || [],
                personalization: context.personalization || {}
            },
            context: {
                ...context,
                previousContext: await this.getRecentContext(conversationId, 3),
                userProfile: await this.getUserProfile(userId),
                sessionContext: await this.getSessionContext(sessionId)
            }
        };

        // Store in memory
        if (!this.conversations.has(conversationId)) {
            this.conversations.set(conversationId, []);
        }
        this.conversations.get(conversationId).push(conversationEntry);

        // Update indexes
        await this.updateTopicIndex(conversationEntry);
        await this.updateSemanticIndex(conversationEntry);
        await this.updateUserProfile(userId, conversationEntry);
        
        // Trigger learning
        this.emit('conversation:stored', conversationEntry);
        
        // Persist to disk (async)
        this.persistConversation(conversationEntry);
        
        return messageId;
    }

    async searchConversations(query, options = {}) {
        const {
            userId = null,
            maxResults = 10,
            timeRange = null,
            semanticSearch = true,
            includeContext = true,
            sortBy = 'relevance' // relevance, recency, confidence
        } = options;

        const results = [];

        // Semantic search
        if (semanticSearch) {
            const semanticResults = await this.semanticSearch(query, { userId, maxResults: maxResults * 2 });
            results.push(...semanticResults);
        }

        // Keyword search
        const keywordResults = await this.keywordSearch(query, { userId, maxResults: maxResults * 2 });
        results.push(...keywordResults);

        // Entity-based search
        const entityResults = await this.entitySearch(query, { userId, maxResults: maxResults * 2 });
        results.push(...entityResults);

        // Remove duplicates and rank
        const uniqueResults = this.deduplicateResults(results);
        const rankedResults = this.rankSearchResults(uniqueResults, query, sortBy);

        // Apply filters
        let filteredResults = rankedResults;
        
        if (timeRange) {
            filteredResults = this.filterByTimeRange(filteredResults, timeRange);
        }
        
        if (userId) {
            filteredResults = filteredResults.filter(r => r.userId === userId);
        }

        // Include context if requested
        if (includeContext) {
            for (const result of filteredResults.slice(0, maxResults)) {
                result.contextMessages = await this.getContextMessages(result.conversationId, result.id, 2);
                result.relatedTopics = await this.getRelatedTopics(result.message.entities);
                result.userInsights = await this.getUserInsights(result.userId, result.message.content);
            }
        }

        return {
            query: query,
            totalResults: filteredResults.length,
            results: filteredResults.slice(0, maxResults),
            searchMetadata: {
                semanticMatches: results.filter(r => r.searchType === 'semantic').length,
                keywordMatches: results.filter(r => r.searchType === 'keyword').length,
                entityMatches: results.filter(r => r.searchType === 'entity').length,
                executionTime: Date.now()
            }
        };
    }

    // ========================================
    // ADVANCED LEARNING & CONTEXT ANALYSIS
    // ========================================

    async learnFromConversation(conversationEntry) {
        const userId = conversationEntry.userId;
        const message = conversationEntry.message;
        const response = conversationEntry.response;

        // Learn user preferences
        await this.updateUserPreferences(userId, message, response);

        // Learn conversation patterns
        await this.updateConversationPatterns(conversationEntry);

        // Learn topic relationships
        await this.updateTopicRelationships(message.entities);

        // Learn response effectiveness
        await this.updateResponseEffectiveness(conversationEntry);

        // Detect recurring themes
        await this.detectRecurringThemes(userId, message);

        this.emit('learning:updated', { userId, patterns: this.learningPatterns.get(userId) });
    }

    async generateConversationSummary(conversationId, options = {}) {
        const {
            maxLength = 200,
            includeKeyInsights = true,
            includeUserPreferences = true,
            includeActionItems = true
        } = options;

        const conversation = this.conversations.get(conversationId);
        if (!conversation) return null;

        const summary = {
            conversationId: conversationId,
            totalMessages: conversation.length,
            timeSpan: {
                start: conversation[0]?.timestamp,
                end: conversation[conversation.length - 1]?.timestamp,
                duration: this.calculateConversationDuration(conversation)
            },
            mainTopics: this.extractMainTopics(conversation),
            userGoals: this.extractUserGoals(conversation),
            keyInsights: includeKeyInsights ? this.extractKeyInsights(conversation) : [],
            userPreferences: includeUserPreferences ? this.extractPreferencesFromConversation(conversation) : {},
            actionItems: includeActionItems ? this.extractActionItems(conversation) : [],
            sentiment: this.analyzeConversationSentiment(conversation),
            effectiveness: this.calculateConversationEffectiveness(conversation)
        };

        // Generate natural language summary
        summary.naturalLanguageSummary = this.generateNaturalLanguageSummary(summary, maxLength);

        return summary;
    }

    async getPersonalizedContext(userId, currentMessage, options = {}) {
        const {
            contextWindow = this.config.contextWindowSize,
            includePreferences = true,
            includePastSimilarConversations = true,
            includeGoals = true
        } = options;

        const context = {
            userId: userId,
            timestamp: new Date().toISOString()
        };

        // User profile and preferences
        if (includePreferences) {
            context.userProfile = await this.getUserProfile(userId);
            context.preferences = this.learningPatterns.get(userId)?.preferences || {};
        }

        // Recent conversation context
        context.recentContext = await this.getRecentUserContext(userId, contextWindow);

        // Similar past conversations
        if (includePastSimilarConversations) {
            const similarConversations = await this.findSimilarPastConversations(userId, currentMessage, 3);
            context.similarConversations = similarConversations.map(conv => ({
                summary: conv.summary,
                outcome: conv.outcome,
                relevanceScore: conv.relevanceScore
            }));
        }

        // User goals and ongoing objectives
        if (includeGoals) {
            context.activeGoals = await this.getUserActiveGoals(userId);
            context.progressTowardsGoals = await this.calculateGoalProgress(userId);
        }

        // Contextual recommendations
        context.recommendations = await this.generateContextualRecommendations(userId, currentMessage, context);

        return context;
    }

    // ========================================
    // SEMANTIC SEARCH AND ANALYSIS
    // ========================================

    async semanticSearch(query, options = {}) {
        // Simple semantic search implementation
        // In a production system, you'd use embeddings and vector similarity
        const queryTokens = this.tokenizeText(query.toLowerCase());
        const results = [];

        for (const [conversationId, messages] of this.conversations) {
            for (const message of messages) {
                const messageTokens = this.tokenizeText(message.message.content.toLowerCase());
                const similarity = this.calculateTextSimilarity(queryTokens, messageTokens);
                
                if (similarity > this.config.semanticSimilarityThreshold) {
                    results.push({
                        ...message,
                        searchType: 'semantic',
                        relevanceScore: similarity,
                        matchedTokens: this.findMatchedTokens(queryTokens, messageTokens)
                    });
                }
            }
        }

        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    async keywordSearch(query, options = {}) {
        const keywords = this.extractKeywords(query.toLowerCase());
        const results = [];

        for (const [conversationId, messages] of this.conversations) {
            for (const message of messages) {
                const content = message.message.content.toLowerCase();
                let matchCount = 0;
                const matchedKeywords = [];

                for (const keyword of keywords) {
                    if (content.includes(keyword)) {
                        matchCount++;
                        matchedKeywords.push(keyword);
                    }
                }

                if (matchCount > 0) {
                    results.push({
                        ...message,
                        searchType: 'keyword',
                        relevanceScore: matchCount / keywords.length,
                        matchedKeywords: matchedKeywords
                    });
                }
            }
        }

        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    async entitySearch(query, options = {}) {
        const queryEntities = await this.extractEntities(query);
        const results = [];

        for (const [conversationId, messages] of this.conversations) {
            for (const message of messages) {
                const messageEntities = message.message.entities;
                const entityMatches = this.findEntityMatches(queryEntities, messageEntities);
                
                if (entityMatches.length > 0) {
                    results.push({
                        ...message,
                        searchType: 'entity',
                        relevanceScore: entityMatches.length / Math.max(queryEntities.length, messageEntities.length),
                        matchedEntities: entityMatches
                    });
                }
            }
        }

        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    // ========================================
    // USER PROFILING AND PERSONALIZATION
    // ========================================

    async updateUserProfile(userId, conversationEntry) {
        let profile = this.userProfiles.get(userId) || this.createEmptyUserProfile(userId);

        // Update basic stats
        profile.totalConversations++;
        profile.totalMessages++;
        profile.lastActive = conversationEntry.timestamp;

        // Update preferences based on message content
        const preferences = await this.extractPreferences(conversationEntry.message.content);
        this.mergePreferences(profile.preferences, preferences);

        // Update interests and topics
        for (const entity of conversationEntry.message.entities) {
            if (!profile.interests.has(entity.type)) {
                profile.interests.set(entity.type, new Map());
            }
            const count = profile.interests.get(entity.type).get(entity.value) || 0;
            profile.interests.get(entity.type).set(entity.value, count + 1);
        }

        // Update communication patterns
        profile.communicationStyle = this.analyzeCommunicationStyle(conversationEntry);

        // Update goals and objectives
        const goals = this.extractGoalsFromMessage(conversationEntry.message.content);
        for (const goal of goals) {
            if (!profile.goals.some(g => g.description === goal.description)) {
                profile.goals.push({
                    ...goal,
                    identified: conversationEntry.timestamp,
                    progress: 0
                });
            }
        }

        this.userProfiles.set(userId, profile);
        
        // Persist profile
        await this.persistUserProfile(userId, profile);
    }

    createEmptyUserProfile(userId) {
        return {
            userId: userId,
            created: new Date().toISOString(),
            totalConversations: 0,
            totalMessages: 0,
            lastActive: null,
            preferences: {
                workoutTypes: new Map(),
                nutritionGoals: new Map(),
                budgetRanges: new Map(),
                timePreferences: new Map(),
                communicationStyle: 'default'
            },
            interests: new Map(),
            goals: [],
            conversationTopics: new Map(),
            communicationStyle: {
                preferredResponseLength: 'medium',
                formalityLevel: 'casual',
                detailLevel: 'balanced',
                preferredAgents: []
            },
            learningInsights: {
                mostDiscussedTopics: [],
                preferredTimeOfDay: null,
                averageSessionLength: 0,
                goalAchievementRate: 0
            }
        };
    }

    // ========================================
    // UTILITY METHODS AND TEXT PROCESSING
    // ========================================

    generateConversationId(userId, sessionId) {
        return crypto.createHash('md5').update(`${userId}_${sessionId}`).digest('hex');
    }

    generateMessageId() {
        return `msg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    }

    tokenizeText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(token => token.length > 2);
    }

    extractKeywords(text) {
        const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'are', 'as', 'was', 'will', 'be']);
        return this.tokenizeText(text).filter(token => !stopWords.has(token));
    }

    calculateTextSimilarity(tokens1, tokens2) {
        const set1 = new Set(tokens1);
        const set2 = new Set(tokens2);
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        
        return intersection.size / union.size; // Jaccard similarity
    }

    calculateMessageComplexity(message) {
        const words = message.split(/\s+/);
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        const sentenceCount = message.split(/[.!?]+/).length;
        
        return {
            wordCount: words.length,
            avgWordLength: Math.round(avgWordLength * 100) / 100,
            sentenceCount: sentenceCount,
            complexityScore: Math.min((words.length * avgWordLength) / 100, 1)
        };
    }

    async extractIntent(message) {
        // Simplified intent extraction
        const intents = {
            'workout': ['workout', 'exercise', 'fitness', 'train', 'gym'],
            'nutrition': ['food', 'eat', 'meal', 'diet', 'nutrition', 'calories'],
            'budget': ['budget', 'cost', 'price', 'money', 'afford', 'expensive'],
            'schedule': ['schedule', 'plan', 'time', 'when', 'calendar'],
            'question': ['what', 'how', 'why', 'where', 'when', 'who'],
            'help': ['help', 'assist', 'support', 'guide']
        };

        const lowerMessage = message.toLowerCase();
        const detectedIntents = [];

        for (const [intent, keywords] of Object.entries(intents)) {
            const matches = keywords.filter(keyword => lowerMessage.includes(keyword));
            if (matches.length > 0) {
                detectedIntents.push({
                    intent: intent,
                    confidence: matches.length / keywords.length,
                    matchedKeywords: matches
                });
            }
        }

        return detectedIntents.length > 0 ? detectedIntents[0] : { intent: 'general', confidence: 0.5, matchedKeywords: [] };
    }

    async extractEntities(message) {
        // Simplified entity extraction
        const entityPatterns = {
            'time': /\b(\d{1,2}:\d{2}|\d{1,2}\s?(am|pm)|morning|afternoon|evening|tonight|tomorrow|today)\b/gi,
            'number': /\b\d+(\.\d+)?\b/g,
            'duration': /\b\d+\s?(minutes?|hours?|mins?|hrs?)\b/gi,
            'food': /\b(protein|chicken|beef|fish|rice|pasta|salad|vegetables?|fruits?)\b/gi,
            'workout_type': /\b(cardio|strength|yoga|running|cycling|swimming|weights?)\b/gi,
            'goal': /\b(lose weight|gain muscle|get fit|build strength|lose fat)\b/gi
        };

        const entities = [];
        
        for (const [type, pattern] of Object.entries(entityPatterns)) {
            const matches = message.match(pattern);
            if (matches) {
                for (const match of matches) {
                    entities.push({
                        type: type,
                        value: match.trim(),
                        position: message.indexOf(match)
                    });
                }
            }
        }

        return entities;
    }

    async analyzeSentiment(message) {
        // Simplified sentiment analysis
        const positiveWords = ['good', 'great', 'awesome', 'excellent', 'love', 'like', 'happy', 'excited'];
        const negativeWords = ['bad', 'terrible', 'hate', 'dislike', 'sad', 'frustrated', 'difficult', 'hard'];
        
        const lowerMessage = message.toLowerCase();
        let positiveScore = 0;
        let negativeScore = 0;

        for (const word of positiveWords) {
            if (lowerMessage.includes(word)) positiveScore++;
        }
        
        for (const word of negativeWords) {
            if (lowerMessage.includes(word)) negativeScore++;
        }

        const totalScore = positiveScore + negativeScore;
        if (totalScore === 0) return { sentiment: 'neutral', confidence: 0.5 };

        const sentimentScore = (positiveScore - negativeScore) / totalScore;
        
        return {
            sentiment: sentimentScore > 0.2 ? 'positive' : sentimentScore < -0.2 ? 'negative' : 'neutral',
            confidence: Math.abs(sentimentScore),
            positiveScore: positiveScore,
            negativeScore: negativeScore
        };
    }

    // ========================================
    // PERSISTENCE AND FILE OPERATIONS
    // ========================================

    async persistConversation(conversationEntry) {
        try {
            const filePath = path.join(this.memoryPath, `${conversationEntry.conversationId}.json`);
            
            // Load existing conversation file or create new
            let existingData = [];
            try {
                const fileContent = await fs.readFile(filePath, 'utf8');
                existingData = JSON.parse(fileContent);
            } catch (error) {
                // File doesn't exist, that's okay
            }
            
            // Add new entry
            existingData.push(conversationEntry);
            
            // Write back to file
            await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
            
        } catch (error) {
            console.error('Error persisting conversation:', error);
        }
    }

    async loadExistingConversations() {
        try {
            const files = await fs.readdir(this.memoryPath);
            let loadedCount = 0;

            for (const file of files) {
                if (file.endsWith('.json') && file !== 'conversation_index.json' && file !== 'semantic_index.json') {
                    const filePath = path.join(this.memoryPath, file);
                    const fileContent = await fs.readFile(filePath, 'utf8');
                    const conversationData = JSON.parse(fileContent);
                    
                    const conversationId = file.replace('.json', '');
                    this.conversations.set(conversationId, conversationData);
                    loadedCount += conversationData.length;
                }
            }

            console.log(`📚 Loaded ${loadedCount} messages from ${files.length} conversation files`);
            
        } catch (error) {
            console.log('📝 No existing conversations found, starting fresh');
        }
    }

    async persistUserProfile(userId, profile) {
        try {
            const profilePath = path.join(this.memoryPath, `profile_${userId}.json`);
            
            // Convert Maps to Objects for JSON serialization
            const serializableProfile = {
                ...profile,
                preferences: this.mapToObject(profile.preferences),
                interests: this.mapToObject(profile.interests)
            };
            
            await fs.writeFile(profilePath, JSON.stringify(serializableProfile, null, 2));
        } catch (error) {
            console.error('Error persisting user profile:', error);
        }
    }

    mapToObject(map) {
        const obj = {};
        for (const [key, value] of map) {
            obj[key] = value instanceof Map ? this.mapToObject(value) : value;
        }
        return obj;
    }

    async startLearningEngine() {
        // Start periodic learning updates
        setInterval(() => {
            this.performLearningAnalysis();
        }, this.config.learningUpdateInterval);
    }

    async performLearningAnalysis() {
        // Analyze recent conversations for patterns
        // Update user profiles
        // Generate insights
        // This would be expanded in a full implementation
        this.emit('learning:analysis_complete');
    }

    // Placeholder methods that would be fully implemented
    async updateTopicIndex(conversationEntry) { /* Implementation here */ }
    async updateSemanticIndex(conversationEntry) { /* Implementation here */ }
    async getRecentContext(conversationId, count) { return []; }
    async getUserProfile(userId) { return this.userProfiles.get(userId) || this.createEmptyUserProfile(userId); }
    async getSessionContext(sessionId) { return {}; }
    deduplicateResults(results) { return results; }
    rankSearchResults(results, query, sortBy) { return results; }
    filterByTimeRange(results, timeRange) { return results; }
    async getContextMessages(conversationId, messageId, count) { return []; }
    async getRelatedTopics(entities) { return []; }
    async getUserInsights(userId, content) { return {}; }

    getStatus() {
        return {
            initialized: this.initialized,
            conversationsInMemory: this.conversations.size,
            userProfiles: this.userProfiles.size,
            totalMessages: Array.from(this.conversations.values()).reduce((sum, conv) => sum + conv.length, 0),
            memoryUsage: {
                conversations: this.conversations.size,
                userProfiles: this.userProfiles.size,
                topicIndex: this.topicIndex.size,
                semanticIndex: this.semanticIndex.size
            },
            config: this.config
        };
    }
}

module.exports = ConversationPersistence;
