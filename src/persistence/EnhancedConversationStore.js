// Enhanced ConversationStore with Semantic Intelligence Integration
// Location: C:\Projects\Progressive-Framework-v5\src\persistence/EnhancedConversationStore.js

const ConversationStore = require('./ConversationStore');
const SemanticSearchEngine = require('../intelligence/SemanticSearchEngine');

class EnhancedConversationStore extends ConversationStore {
    constructor() {
        super();
        this.semanticEngine = new SemanticSearchEngine();
        this.conversationThreads = new Map();
        this.topicClusters = new Map();
        this.userSemanticProfiles = new Map();
        
        console.log('Enhanced ConversationStore with Semantic Intelligence initialized');
    }

    // ========================================
    // ENHANCED STORAGE WITH SEMANTIC ANALYSIS
    // ========================================

    async storeConversation(conversationData) {
        try {
            // Store conversation with base functionality
            const conversation = await super.storeConversation(conversationData);
            
            // Add semantic enhancements
            await this.addSemanticMetadata(conversation);
            
            // Update user semantic profile
            await this.updateUserSemanticProfile(conversation);
            
            // Update conversation threads
            await this.updateConversationThreads(conversation);
            
            console.log(`Enhanced conversation ${conversation.id} stored with semantic metadata`);
            return conversation;
            
        } catch (error) {
            console.error('Enhanced conversation storage failed:', error);
            throw error;
        }
    }

    async addSemanticMetadata(conversation) {
        try {
            const searchableText = this.createSearchableText(conversation);
            
            // Generate semantic vector
            const semanticVector = this.semanticEngine.generateSemanticVector(searchableText);
            
            // Identify topics with confidence scores
            const topics = this.semanticEngine.identifyConversationTopics(conversation);
            
            // Determine semantic cluster
            const semanticCluster = this.semanticEngine.identifySemanticCluster(conversation);
            
            // Add semantic metadata to conversation
            conversation.semanticMetadata = {
                vector: semanticVector,
                topics: topics,
                semanticCluster: semanticCluster,
                conceptualKeywords: this.semanticEngine.extractConceptualKeywords(conversation),
                topicDistribution: this.semanticEngine.analyzeTopicDistribution(conversation),
                generatedAt: new Date().toISOString()
            };
            
            // Update the stored file with semantic metadata
            const filePath = path.join(this.storageDir, `${conversation.id}.json`);
            await fs.writeFile(filePath, JSON.stringify(conversation, null, 2));
            
        } catch (error) {
            console.error('Failed to add semantic metadata:', error);
        }
    }

    // ========================================
    // ADVANCED SEMANTIC SEARCH
    // ========================================

    async semanticSearch(query, options = {}) {
        const {
            userId,
            minSimilarity = 0.3,
            maxResults = 50,
            includeContext = true,
            boostRecent = true,
            agentType,
            dateRange
        } = options;

        try {
            // Get conversations with traditional search first
            const baseSearchResults = await this.searchConversations({
                userId,
                agentType,
                dateRange,
                limit: 200 // Get more for semantic filtering
            });

            // Apply semantic search
            const semanticResults = await this.semanticEngine.performSemanticSearch(
                query, 
                baseSearchResults, 
                {
                    minSimilarity,
                    maxResults,
                    boostRecent,
                    includeContext
                }
            );

            return {
                query,
                results: semanticResults,
                searchMetadata: {
                    totalCandidates: baseSearchResults.length,
                    semanticMatches: semanticResults.length,
                    averageSimilarity: semanticResults.length > 0 
                        ? semanticResults.reduce((sum, r) => sum + r.semanticSimilarity, 0) / semanticResults.length 
                        : 0,
                    searchType: 'semantic',
                    processedAt: new Date().toISOString()
                }
            };

        } catch (error) {
            console.error('Semantic search failed:', error);
            return { query, results: [], error: error.message };
        }
    }

    // ========================================
    // CONVERSATION THREADING
    // ========================================

    async updateConversationThreads(conversation) {
        try {
            // Get user's recent conversations for threading analysis
            const recentConversations = await this.searchConversations({
                userId: conversation.userId,
                limit: 20,
                sortBy: 'timestamp'
            });

            // Analyze threads including the new conversation
            const threads = await this.semanticEngine.analyzeConversationThreads([
                conversation,
                ...recentConversations
            ]);

            // Update thread information
            for (const thread of threads) {
                this.conversationThreads.set(thread.id, thread);
                
                // Update conversation with thread ID
                if (thread.conversations.some(c => c.id === conversation.id)) {
                    conversation.threadId = thread.id;
                    conversation.threadMetadata = {
                        mainTopic: thread.mainTopic,
                        coherenceScore: thread.coherenceScore,
                        threadPosition: thread.conversations.findIndex(c => c.id === conversation.id) + 1,
                        totalInThread: thread.conversations.length
                    };
                }
            }

        } catch (error) {
            console.error('Failed to update conversation threads:', error);
        }
    }

    async getConversationThread(threadId) {
        try {
            const thread = this.conversationThreads.get(threadId);
            if (!thread) return null;

            // Enhance with semantic analysis
            const enhancedThread = {
                ...thread,
                semanticAnalysis: {
                    topicEvolution: await this.analyzeThreadTopicEvolution(thread),
                    coherenceTrend: this.analyzeThreadCoherenceTrend(thread),
                    participantEngagement: this.analyzeThreadParticipation(thread)
                }
            };

            return enhancedThread;

        } catch (error) {
            console.error('Failed to get conversation thread:', error);
            return null;
        }
    }

    // ========================================
    // USER SEMANTIC PROFILING
    // ========================================

    async updateUserSemanticProfile(conversation) {
        try {
            const userId = conversation.userId;
            
            if (!this.userSemanticProfiles.has(userId)) {
                this.userSemanticProfiles.set(userId, {
                    userId,
                    topicInterests: {},
                    semanticVector: {},
                    conversationPatterns: {},
                    lastUpdated: new Date().toISOString()
                });
            }

            const profile = this.userSemanticProfiles.get(userId);

            // Update topic interests
            if (conversation.semanticMetadata?.topics) {
                for (const topic of conversation.semanticMetadata.topics) {
                    if (!profile.topicInterests[topic.name]) {
                        profile.topicInterests[topic.name] = {
                            totalWeight: 0,
                            conversationCount: 0,
                            averageConfidence: 0,
                            firstSeen: conversation.timestamp,
                            lastSeen: conversation.timestamp
                        };
                    }

                    const topicData = profile.topicInterests[topic.name];
                    topicData.totalWeight += topic.weight;
                    topicData.conversationCount += 1;
                    topicData.averageConfidence = (
                        topicData.averageConfidence * (topicData.conversationCount - 1) + 
                        topic.confidence
                    ) / topicData.conversationCount;
                    topicData.lastSeen = conversation.timestamp;
                }
            }

            // Update semantic vector (running average)
            if (conversation.semanticMetadata?.vector) {
                const alpha = 0.1; // Learning rate
                for (const [dimension, value] of Object.entries(conversation.semanticMetadata.vector)) {
                    profile.semanticVector[dimension] = 
                        (profile.semanticVector[dimension] || 0) * (1 - alpha) + value * alpha;
                }
            }

            profile.lastUpdated = new Date().toISOString();

        } catch (error) {
            console.error('Failed to update user semantic profile:', error);
        }
    }

    async getUserSemanticProfile(userId) {
        const profile = this.userSemanticProfiles.get(userId);
        if (!profile) return null;

        // Generate insights based on profile
        const insights = await this.generateProfileInsights(profile, userId);

        return {
            ...profile,
            insights,
            generatedAt: new Date().toISOString()
        };
    }

    async generateProfileInsights(profile, userId) {
        try {
            // Get user's recent conversations for trend analysis
            const recentConversations = await this.searchConversations({
                userId,
                limit: 30,
                sortBy: 'timestamp'
            });

            // Generate semantic insights
            const semanticInsights = await this.semanticEngine.generateSemanticInsights(
                recentConversations, 
                userId
            );

            // Add profile-specific insights
            const profileInsights = [];

            // Dominant interests
            const topInterests = Object.entries(profile.topicInterests)
                .sort(([,a], [,b]) => b.totalWeight - a.totalWeight)
                .slice(0, 3);

            if (topInterests.length > 0) {
                profileInsights.push({
                    type: 'dominant_interests',
                    message: `Your main areas of interest are: ${topInterests.map(([topic]) => topic).join(', ')}.`,
                    confidence: 0.9,
                    data: { topInterests }
                });
            }

            // Interest evolution
            const recentTopics = this.getRecentTopics(profile.topicInterests);
            if (recentTopics.length > 0) {
                profileInsights.push({
                    type: 'recent_focus',
                    message: `Recently, you've been particularly interested in ${recentTopics[0]}.`,
                    confidence: 0.8,
                    data: { recentTopics }
                });
            }

            return [...semanticInsights, ...profileInsights];

        } catch (error) {
            console.error('Failed to generate profile insights:', error);
            return [];
        }
    }

    // ========================================
    // ADVANCED ANALYTICS WITH SEMANTIC DATA
    // ========================================

    async getSemanticAnalytics(userId, timeRange = 7) {
        try {
            const baseAnalytics = await this.getConversationAnalytics(userId, timeRange);
            
            // Get conversations for semantic analysis
            const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);
            const conversations = await this.searchConversations({
                userId,
                dateRange: { start: startDate.toISOString() },
                limit: 1000
            });

            // Perform topic modeling
            const topicClusters = await this.semanticEngine.performTopicModeling(conversations);
            
            // Analyze conversation threads
            const threads = await this.semanticEngine.analyzeConversationThreads(conversations);
            
            // Get user semantic profile
            const semanticProfile = await this.getUserSemanticProfile(userId);

            return {
                ...baseAnalytics,
                semanticAnalysis: {
                    topicClusters,
                    conversationThreads: threads,
                    semanticProfile,
                    topicEvolution: await this.semanticEngine.analyzeTopicEvolution(conversations),
                    semanticCoherence: this.calculateSemanticCoherence(conversations),
                    conceptualDiversity: this.calculateConceptualDiversity(conversations)
                },
                enhancedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('Failed to generate semantic analytics:', error);
            return await this.getConversationAnalytics(userId, timeRange);
        }
    }

    // ========================================
    // INTELLIGENT CONVERSATION CONTEXT
    // ========================================

    async getEnhancedConversationContext(userId, currentRequest) {
        try {
            // Get base context
            const baseContext = await super.getConversationContext(userId, currentRequest);

            // Enhance with semantic search
            const semanticMatches = await this.semanticSearch(currentRequest, {
                userId,
                maxResults: 10,
                includeContext: true
            });

            // Find conversation threads
            const userThreads = Array.from(this.conversationThreads.values())
                .filter(thread => thread.participants.has(userId))
                .sort((a, b) => b.conversations.length - a.conversations.length);

            // Get user semantic profile
            const semanticProfile = await this.getUserSemanticProfile(userId);

            return {
                ...baseContext,
                semanticContext: {
                    semanticMatches: semanticMatches.results,
                    activeThreads: userThreads.slice(0, 3),
                    userSemanticProfile: semanticProfile,
                    predictedIntent: this.predictIntentFromContext(semanticMatches.results, currentRequest),
                    contextualRecommendations: await this.generateContextualRecommendations(
                        userId, 
                        currentRequest, 
                        semanticMatches.results
                    )
                }
            };

        } catch (error) {
            console.error('Failed to get enhanced conversation context:', error);
            return await super.getConversationContext(userId, currentRequest);
        }
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    analyzeThreadTopicEvolution(thread) {
        if (thread.conversations.length < 2) return [];

        const evolution = [];
        
        for (let i = 0; i < thread.conversations.length - 1; i++) {
            const current = thread.conversations[i];
            const next = thread.conversations[i + 1];
            
            if (current.semanticMetadata && next.semanticMetadata) {
                const topicShift = this.calculateTopicShift(
                    current.semanticMetadata.topics,
                    next.semanticMetadata.topics
                );
                
                evolution.push({
                    position: i + 1,
                    topicShift,
                    timestamp: next.timestamp
                });
            }
        }
        
        return evolution;
    }

    analyzeThreadCoherenceTrend(thread) {
        // Calculate coherence over time within thread
        const coherencePoints = [];
        
        for (let i = 1; i < thread.conversations.length; i++) {
            const windowConversations = thread.conversations.slice(Math.max(0, i - 2), i + 1);
            const coherence = this.semanticEngine.calculateThreadCoherence(windowConversations);
            
            coherencePoints.push({
                position: i + 1,
                coherence,
                timestamp: thread.conversations[i].timestamp
            });
        }
        
        return coherencePoints;
    }

    analyzeThreadParticipation(thread) {
        const participation = {};
        
        thread.conversations.forEach((conv, index) => {
            if (!participation[conv.userId]) {
                participation[conv.userId] = {
                    messageCount: 0,
                    positions: [],
                    averageComplexity: 0,
                    topicContributions: new Set()
                };
            }
            
            const userParticipation = participation[conv.userId];
            userParticipation.messageCount++;
            userParticipation.positions.push(index);
            
            if (conv.request?.complexity) {
                userParticipation.averageComplexity = 
                    (userParticipation.averageComplexity * (userParticipation.messageCount - 1) + 
                     conv.request.complexity) / userParticipation.messageCount;
            }
            
            if (conv.semanticMetadata?.topics) {
                conv.semanticMetadata.topics.forEach(topic => {
                    userParticipation.topicContributions.add(topic.name);
                });
            }
        });
        
        // Convert Sets to Arrays for JSON serialization
        Object.values(participation).forEach(userData => {
            userData.topicContributions = Array.from(userData.topicContributions);
        });
        
        return participation;
    }

    calculateTopicShift(topics1, topics2) {
        const topicMap1 = new Map(topics1.map(t => [t.name, t.weight]));
        const topicMap2 = new Map(topics2.map(t => [t.name, t.weight]));
        
        const allTopics = new Set([...topicMap1.keys(), ...topicMap2.keys()]);
        let totalShift = 0;
        
        for (const topic of allTopics) {
            const weight1 = topicMap1.get(topic) || 0;
            const weight2 = topicMap2.get(topic) || 0;
            totalShift += Math.abs(weight2 - weight1);
        }
        
        return totalShift;
    }

    getRecentTopics(topicInterests) {
        return Object.entries(topicInterests)
            .sort(([,a], [,b]) => new Date(b.lastSeen) - new Date(a.lastSeen))
            .slice(0, 3)
            .map(([topic]) => topic);
    }

    calculateSemanticCoherence(conversations) {
        if (conversations.length < 2) return 1.0;
        
        let totalSimilarity = 0;
        let comparisons = 0;
        
        for (let i = 0; i < conversations.length - 1; i++) {
            const conv1 = conversations[i];
            const conv2 = conversations[i + 1];
            
            if (conv1.semanticMetadata?.vector && conv2.semanticMetadata?.vector) {
                const similarity = this.semanticEngine.cosineSimilarity(
                    conv1.semanticMetadata.vector,
                    conv2.semanticMetadata.vector
                );
                totalSimilarity += similarity;
                comparisons++;
            }
        }
        
        return comparisons > 0 ? totalSimilarity / comparisons : 0;
    }

    calculateConceptualDiversity(conversations) {
        const allConcepts = new Set();
        
        conversations.forEach(conv => {
            if (conv.semanticMetadata?.conceptualKeywords) {
                conv.semanticMetadata.conceptualKeywords.forEach(concept => {
                    allConcepts.add(concept);
                });
            }
        });
        
        return {
            uniqueConcepts: allConcepts.size,
            averageConceptsPerConversation: conversations.length > 0 
                ? Array.from(allConcepts).length / conversations.length 
                : 0,
            conceptList: Array.from(allConcepts)
        };
    }

    predictIntentFromContext(semanticMatches, currentRequest) {
        if (semanticMatches.length === 0) return 'unknown';
        
        // Analyze patterns in similar conversations
        const intentCounts = {};
        
        semanticMatches.forEach(match => {
            const intent = match.conversation.request?.intent || 'unknown';
            intentCounts[intent] = (intentCounts[intent] || 0) + match.semanticSimilarity;
        });
        
        // Return most likely intent based on weighted similarity
        const sortedIntents = Object.entries(intentCounts)
            .sort(([,a], [,b]) => b - a);
        
        return sortedIntents.length > 0 ? sortedIntents[0][0] : 'unknown';
    }

    async generateContextualRecommendations(userId, currentRequest, semanticMatches) {
        const recommendations = [];
        
        if (semanticMatches.length > 0) {
            // Find successful similar conversations
            const successfulMatches = semanticMatches.filter(match => 
                match.conversation.response?.success && 
                match.conversation.response?.confidence > 0.8
            );
            
            if (successfulMatches.length > 0) {
                recommendations.push({
                    type: 'similar_success',
                    message: `Based on similar successful conversations, I recommend focusing on specific actionable steps.`,
                    confidence: 0.8,
                    basedOn: successfulMatches.length
                });
            }
        }
        
        return recommendations;
    }
}

module.exports = EnhancedConversationStore;