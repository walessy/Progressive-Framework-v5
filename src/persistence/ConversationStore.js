// Enhanced Conversation Persistence System for Progressive Framework V5
// Location: C:\Projects\Progressive-Framework-v5\src\persistence\ConversationStore.js

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class ConversationStore {
    constructor() {
        this.storageDir = path.join(__dirname, '../../data/conversations');
        this.indexFile = path.join(this.storageDir, 'conversation-index.json');
        this.conversationCache = new Map(); // In-memory cache for recent conversations
        this.maxCacheSize = 1000;
        this.init();
    }

    async init() {
        try {
            await fs.mkdir(this.storageDir, { recursive: true });
            await this.loadIndex();
            console.log('ConversationStore initialized successfully');
        } catch (error) {
            console.error('Failed to initialize ConversationStore:', error);
        }
    }

    // Enhanced conversation schema with full metadata
    createConversationEntry(data) {
        const conversationId = this.generateId();
        const timestamp = new Date().toISOString();
        
        return {
            // Core identification
            id: conversationId,
            timestamp,
            sessionId: data.sessionId || this.generateSessionId(),
            userId: data.userId || 'anonymous',
            
            // Agent information
            agentType: data.agentType, // MCA, NPA, WPA, BMA
            routingDecision: data.routingDecision || null,
            
            // Request analysis
            request: {
                original: data.request.original,
                processed: this.processText(data.request.original),
                keywords: this.extractKeywords(data.request.original),
                intent: data.request.intent || 'unknown',
                complexity: this.calculateComplexity(data.request.original),
                domain: this.detectDomain(data.request.original),
                sentiment: this.analyzeSentiment(data.request.original)
            },
            
            // Response details
            response: {
                content: data.response.content,
                confidence: data.response.confidence || 0.5,
                executionTime: data.response.executionTime || 0,
                metadata: data.response.metadata || {},
                success: data.response.success !== false,
                agentCollaboration: data.response.agentCollaboration || null
            },
            
            // Enhanced context tracking
            context: {
                previousConversations: data.context?.previousConversations || [],
                topicContinuity: this.calculateTopicContinuity(data),
                userPreferences: data.context?.userPreferences || {},
                conversationThread: data.context?.conversationThread || null,
                relatedTopics: this.findRelatedTopics(data.request.original)
            },
            
            // Performance metrics
            performance: {
                mcaProcessingTime: data.performance?.mcaProcessingTime || 0,
                routingTime: data.performance?.routingTime || 0,
                agentResponseTime: data.performance?.agentResponseTime || 0,
                totalTime: data.performance?.totalTime || 0
            },
            
            // Search optimization
            searchMetadata: {
                searchableText: this.createSearchableText(data),
                tags: this.generateTags(data),
                category: this.categorizeConversation(data),
                priority: this.calculatePriority(data)
            }
        };
    }

    // Store conversation with enhanced indexing
    async storeConversation(conversationData) {
        try {
            const conversation = this.createConversationEntry(conversationData);
            
            // Store in file system
            const filePath = path.join(this.storageDir, `${conversation.id}.json`);
            await fs.writeFile(filePath, JSON.stringify(conversation, null, 2));
            
            // Add to cache
            this.conversationCache.set(conversation.id, conversation);
            this.manageCacheSize();
            
            // Update index
            await this.updateIndex(conversation);
            
            console.log(`Conversation ${conversation.id} stored successfully`);
            return conversation;
            
        } catch (error) {
            console.error('Failed to store conversation:', error);
            throw error;
        }
    }

    // Advanced search with multiple criteria
    async searchConversations(searchCriteria) {
        const {
            query,           // Text search
            agentType,       // Filter by agent
            userId,          // Filter by user
            dateRange,       // Time range
            tags,            // Specific tags
            intent,          // Intent matching
            minConfidence,   // Minimum confidence score
            limit = 50,      // Result limit
            sortBy = 'timestamp' // Sort field
        } = searchCriteria;

        try {
            const index = await this.loadIndex();
            let results = [];

            // Text search across conversations
            if (query) {
                results = await this.performTextSearch(query, index);
            } else {
                results = Object.values(index);
            }

            // Apply filters
            results = results.filter(conv => {
                if (agentType && conv.agentType !== agentType) return false;
                if (userId && conv.userId !== userId) return false;
                if (intent && conv.request.intent !== intent) return false;
                if (minConfidence && conv.response.confidence < minConfidence) return false;
                
                if (dateRange) {
                    const convDate = new Date(conv.timestamp);
                    if (dateRange.start && convDate < new Date(dateRange.start)) return false;
                    if (dateRange.end && convDate > new Date(dateRange.end)) return false;
                }
                
                if (tags && tags.length > 0) {
                    const hasRequiredTags = tags.some(tag => 
                        conv.searchMetadata.tags.includes(tag)
                    );
                    if (!hasRequiredTags) return false;
                }
                
                return true;
            });

            // Sort results
            results.sort((a, b) => {
                if (sortBy === 'timestamp') {
                    return new Date(b.timestamp) - new Date(a.timestamp);
                }
                if (sortBy === 'confidence') {
                    return b.response.confidence - a.response.confidence;
                }
                if (sortBy === 'priority') {
                    return b.searchMetadata.priority - a.searchMetadata.priority;
                }
                return 0;
            });

            return results.slice(0, limit);
            
        } catch (error) {
            console.error('Search failed:', error);
            return [];
        }
    }

    // Get conversation context for MCA decision making
    async getConversationContext(userId, currentRequest) {
        try {
            // Find recent conversations
            const recentConversations = await this.searchConversations({
                userId,
                dateRange: {
                    start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Last 24 hours
                },
                limit: 10,
                sortBy: 'timestamp'
            });

            // Find related conversations by keywords
            const keywords = this.extractKeywords(currentRequest);
            const relatedConversations = await this.searchConversations({
                userId,
                query: keywords.join(' '),
                limit: 5
            });

            // Analyze user preferences
            const preferences = this.analyzeUserPreferences(recentConversations);

            return {
                recentConversations: recentConversations.slice(0, 5),
                relatedConversations,
                userPreferences: preferences,
                conversationPatterns: this.identifyPatterns(recentConversations)
            };
            
        } catch (error) {
            console.error('Failed to get conversation context:', error);
            return {
                recentConversations: [],
                relatedConversations: [],
                userPreferences: {},
                conversationPatterns: []
            };
        }
    }

    // Helper methods for text processing
    processText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    extractKeywords(text) {
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
        
        return this.processText(text)
            .split(' ')
            .filter(word => word.length > 2 && !stopWords.has(word))
            .slice(0, 10); // Top 10 keywords
    }

    calculateComplexity(text) {
        const factors = {
            length: Math.min(text.length / 100, 3),
            questions: (text.match(/\?/g) || []).length,
            technical: (text.match(/\b(api|database|algorithm|function|method|class|server|client|framework|library|deployment|authentication|optimization)\b/gi) || []).length,
            specificity: (text.match(/\b(specific|exactly|precisely|detailed|comprehensive|advanced|complex)\b/gi) || []).length
        };
        
        return Math.min(Math.round(
            factors.length + 
            factors.questions * 0.5 + 
            factors.technical * 0.3 + 
            factors.specificity * 0.2
        ), 10);
    }

    detectDomain(text) {
        const domains = {
            nutrition: ['nutrition', 'diet', 'food', 'meal', 'calories', 'protein', 'carbs', 'vitamins', 'healthy eating'],
            fitness: ['workout', 'exercise', 'training', 'fitness', 'muscle', 'strength', 'cardio', 'gym', 'sports'],
            budget: ['budget', 'money', 'cost', 'expense', 'financial', 'price', 'savings', 'investment'],
            technical: ['code', 'programming', 'api', 'database', 'server', 'framework', 'development', 'bug', 'feature']
        };
        
        const lowerText = text.toLowerCase();
        let maxScore = 0;
        let detectedDomain = 'general';
        
        for (const [domain, keywords] of Object.entries(domains)) {
            const score = keywords.reduce((count, keyword) => 
                count + (lowerText.includes(keyword) ? 1 : 0), 0
            );
            if (score > maxScore) {
                maxScore = score;
                detectedDomain = domain;
            }
        }
        
        return detectedDomain;
    }

    analyzeSentiment(text) {
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'perfect', 'love', 'like', 'best', 'awesome'];
        const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disgusting', 'annoying', 'frustrated', 'angry'];
        
        const lowerText = text.toLowerCase();
        const positive = positiveWords.reduce((count, word) => count + (lowerText.includes(word) ? 1 : 0), 0);
        const negative = negativeWords.reduce((count, word) => count + (lowerText.includes(word) ? 1 : 0), 0);
        
        if (positive > negative) return 'positive';
        if (negative > positive) return 'negative';
        return 'neutral';
    }

    // Additional utility methods
    generateId() {
        return crypto.randomBytes(16).toString('hex');
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    manageCacheSize() {
        if (this.conversationCache.size > this.maxCacheSize) {
            const oldestKey = this.conversationCache.keys().next().value;
            this.conversationCache.delete(oldestKey);
        }
    }

    createSearchableText(data) {
        return [
            data.request.original,
            data.response.content,
            data.agentType,
            ...(data.request.keywords || [])
        ].join(' ').toLowerCase();
    }

    generateTags(data) {
        const tags = [data.agentType.toLowerCase()];
        if (data.request.intent !== 'unknown') tags.push(data.request.intent);
        if (data.request.domain !== 'general') tags.push(data.request.domain);
        tags.push(data.request.sentiment);
        return tags;
    }

    categorizeConversation(data) {
        const complexity = data.request.complexity;
        if (complexity >= 8) return 'complex';
        if (complexity >= 5) return 'intermediate';
        return 'simple';
    }

    calculatePriority(data) {
        let priority = 1;
        if (data.response.success) priority += 1;
        if (data.response.confidence > 0.8) priority += 1;
        if (data.request.complexity > 7) priority += 1;
        return priority;
    }

    // Index management
    async loadIndex() {
        try {
            const indexData = await fs.readFile(this.indexFile, 'utf8');
            return JSON.parse(indexData);
        } catch (error) {
            return {};
        }
    }

    async updateIndex(conversation) {
        try {
            const index = await this.loadIndex();
            index[conversation.id] = {
                id: conversation.id,
                timestamp: conversation.timestamp,
                userId: conversation.userId,
                agentType: conversation.agentType,
                searchableText: conversation.searchMetadata.searchableText,
                tags: conversation.searchMetadata.tags,
                category: conversation.searchMetadata.category,
                priority: conversation.searchMetadata.priority
            };
            await fs.writeFile(this.indexFile, JSON.stringify(index, null, 2));
        } catch (error) {
            console.error('Failed to update index:', error);
        }
    }

    // Advanced analysis methods
    calculateTopicContinuity(data) {
        // This would analyze if the conversation continues a previous topic
        return 'new'; // Placeholder - implement based on your needs
    }

    findRelatedTopics(text) {
        // Extract related topics using keyword analysis
        return this.extractKeywords(text);
    }

    analyzeUserPreferences(conversations) {
        const preferences = {
            preferredAgents: {},
            commonTopics: {},
            interactionPatterns: {}
        };
        
        conversations.forEach(conv => {
            // Count preferred agents
            preferences.preferredAgents[conv.agentType] = 
                (preferences.preferredAgents[conv.agentType] || 0) + 1;
            
            // Track common topics
            conv.request.keywords.forEach(keyword => {
                preferences.commonTopics[keyword] = 
                    (preferences.commonTopics[keyword] || 0) + 1;
            });
        });
        
        return preferences;
    }

    identifyPatterns(conversations) {
        // Identify patterns in user behavior
        return []; // Placeholder - implement pattern recognition
    }

    async performTextSearch(query, index) {
        // Simple text search - can be enhanced with more sophisticated algorithms
        const searchTerms = this.extractKeywords(query);
        const results = [];
        
        for (const conversation of Object.values(index)) {
            let score = 0;
            searchTerms.forEach(term => {
                if (conversation.searchableText.includes(term)) {
                    score += 1;
                }
            });
            
            if (score > 0) {
                results.push({ ...conversation, searchScore: score });
            }
        }
        
        return results.sort((a, b) => b.searchScore - a.searchScore);
    }
}

module.exports = ConversationStore;