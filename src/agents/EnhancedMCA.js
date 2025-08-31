// MCA Integration with Enhanced Conversation Persistence
// Location: C:\Projects\Progressive-Framework-v5\src\agents\EnhancedMCA.js

const ConversationStore = require('../persistence/ConversationStore');
const BaseAgent = require('./BaseAgent');

class EnhancedMasterControlAgent extends BaseAgent {
    constructor() {
        super('MCA');
        this.conversationStore = new ConversationStore();
        this.contextWindow = 5; // Number of previous conversations to consider
        this.learningEnabled = true;
    }

    // Enhanced request processing with memory integration
    async processRequest(request, userId = 'anonymous') {
        const startTime = Date.now();
        let routingStartTime, agentStartTime;
        
        try {
            // Step 1: Get conversation context from memory
            const context = await this.conversationStore.getConversationContext(userId, request);
            
            // Step 2: Enhanced request analysis with context
            const analysis = await this.analyzeRequestWithContext(request, context);
            
            // Step 3: Make routing decision with historical data
            routingStartTime = Date.now();
            const routingDecision = await this.makeContextAwareRoutingDecision(analysis, context);
            const routingTime = Date.now() - routingStartTime;
            
            // Step 4: Execute with selected agent
            agentStartTime = Date.now();
            const response = await this.executeWithAgent(routingDecision, request, context);
            const agentResponseTime = Date.now() - agentStartTime;
            
            // Step 5: Store conversation with full metadata
            const conversationData = {
                userId,
                agentType: this.agentType,
                routingDecision,
                request: {
                    original: request,
                    intent: analysis.intent,
                    complexity: analysis.complexity,
                    domain: analysis.domain
                },
                response: {
                    content: response.content,
                    confidence: response.confidence,
                    success: response.success,
                    metadata: response.metadata,
                    agentCollaboration: response.agentCollaboration
                },
                context: {
                    previousConversations: context.recentConversations.map(c => c.id),
                    userPreferences: context.userPreferences,
                    conversationThread: this.determineConversationThread(context, analysis)
                },
                performance: {
                    mcaProcessingTime: routingStartTime - startTime,
                    routingTime,
                    agentResponseTime,
                    totalTime: Date.now() - startTime
                }
            };
            
            const storedConversation = await this.conversationStore.storeConversation(conversationData);
            
            // Step 6: Return enhanced response with memory insights
            return {
                ...response,
                conversationId: storedConversation.id,
                sessionInsights: this.generateSessionInsights(context),
                mcaMetadata: {
                    contextUsed: context.recentConversations.length > 0,
                    routingDecision: routingDecision.agent,
                    confidence: routingDecision.confidence,
                    performanceMetrics: conversationData.performance
                }
            };
            
        } catch (error) {
            console.error('Enhanced MCA processing error:', error);
            
            // Store error for learning
            await this.storeErrorConversation(request, error, userId);
            
            return {
                content: 'I apologize, but I encountered an issue processing your request. However, I\'ve learned from this and will handle similar requests better in the future.',
                success: false,
                confidence: 0.1,
                error: error.message
            };
        }
    }

    // Enhanced request analysis with historical context
    async analyzeRequestWithContext(request, context) {
        const baseAnalysis = this.analyzeRequest(request);
        
        // Enhance with context insights
        const contextEnhancement = {
            isFollowUp: this.detectFollowUp(request, context),
            userPreference: this.getUserPreferenceMatch(request, context.userPreferences),
            similarPastRequests: this.findSimilarRequests(request, context.relatedConversations),
            topicContinuity: this.assessTopicContinuity(request, context.recentConversations)
        };
        
        return {
            ...baseAnalysis,
            context: contextEnhancement,
            enhancedIntent: this.refineIntentWithContext(baseAnalysis.intent, contextEnhancement),
            priorityBoost: this.calculatePriorityBoost(contextEnhancement)
        };
    }

    // Context-aware routing with learning from past decisions
    async makeContextAwareRoutingDecision(analysis, context) {
        const baseRouting = this.determineAgent(analysis.keywords);
        
        // Analyze past successful routings for similar requests
        const historicalSuccess = this.analyzeHistoricalRouting(analysis, context);
        
        // Adjust confidence based on context
        let adjustedConfidence = baseRouting.confidence;
        
        if (historicalSuccess.agent === baseRouting.agent && historicalSuccess.successRate > 0.8) {
            adjustedConfidence = Math.min(adjustedConfidence + 0.2, 1.0);
        }
        
        if (analysis.context.isFollowUp && context.recentConversations.length > 0) {
            const lastAgent = context.recentConversations[0].agentType;
            if (lastAgent === baseRouting.agent) {
                adjustedConfidence = Math.min(adjustedConfidence + 0.1, 1.0);
            }
        }
        
        return {
            ...baseRouting,
            confidence: adjustedConfidence,
            reasoningContext: {
                baseReasoning: baseRouting.reasoning,
                historicalInfluence: historicalSuccess,
                contextFactors: analysis.context
            }
        };
    }

    // Generate insights for the user based on conversation history
    generateSessionInsights(context) {
        const insights = [];
        
        if (context.recentConversations.length > 0) {
            const recentTopics = context.recentConversations
                .flatMap(c => c.request?.keywords || [])
                .reduce((acc, keyword) => {
                    acc[keyword] = (acc[keyword] || 0) + 1;
                    return acc;
                }, {});
                
            const topTopic = Object.entries(recentTopics)
                .sort(([,a], [,b]) => b - a)[0];
                
            if (topTopic && topTopic[1] > 1) {
                insights.push(`I notice you've been focusing on ${topTopic[0]} recently. I'm learning your preferences in this area.`);
            }
        }
        
        if (context.userPreferences.preferredAgents) {
            const preferredAgent = Object.entries(context.userPreferences.preferredAgents)
                .sort(([,a], [,b]) => b - a)[0];
                
            if (preferredAgent) {
                const agentNames = {
                    'NPA': 'nutrition',
                    'WPA': 'fitness',
                    'BMA': 'budget management'
                };
                insights.push(`I've learned that you often prefer ${agentNames[preferredAgent[0]] || preferredAgent[0]} related guidance.`);
            }
        }
        
        return insights;
    }

    // Context analysis helpers
    detectFollowUp(request, context) {
        if (context.recentConversations.length === 0) return false;
        
        const followUpIndicators = ['also', 'additionally', 'furthermore', 'and', 'but what about', 'how about'];
        const lowerRequest = request.toLowerCase();
        
        return followUpIndicators.some(indicator => lowerRequest.includes(indicator)) ||
               this.hasSharedKeywords(request, context.recentConversations[0]);
    }

    getUserPreferenceMatch(request, preferences) {
        if (!preferences.commonTopics) return null;
        
        const requestKeywords = this.extractKeywords(request);
        const matchingPreferences = requestKeywords.filter(keyword => 
            preferences.commonTopics[keyword] && preferences.commonTopics[keyword] > 2
        );
        
        return matchingPreferences.length > 0 ? matchingPreferences : null;
    }

    findSimilarRequests(request, relatedConversations) {
        return relatedConversations.filter(conversation => {
            if (!conversation.request?.keywords) return false;
            return this.hasSharedKeywords(request, conversation, 2); // At least 2 shared keywords
        }).slice(0, 3);
    }

    assessTopicContinuity(request, recentConversations) {
        if (recentConversations.length === 0) return 'new_topic';
        
        const currentKeywords = this.extractKeywords(request);
        const lastConversation = recentConversations[0];
        
        if (!lastConversation.request?.keywords) return 'unknown';
        
        const sharedKeywords = currentKeywords.filter(keyword => 
            lastConversation.request.keywords.includes(keyword)
        );
        
        if (sharedKeywords.length >= 2) return 'continuation';
        if (sharedKeywords.length === 1) return 'related';
        return 'new_topic';
    }

    refineIntentWithContext(baseIntent, contextEnhancement) {
        if (contextEnhancement.isFollowUp && contextEnhancement.similarPastRequests.length > 0) {
            const pastIntents = contextEnhancement.similarPastRequests.map(req => req.request?.intent);
            const mostCommonPastIntent = this.getMostFrequent(pastIntents);
            if (mostCommonPastIntent && mostCommonPastIntent !== 'unknown') {
                return mostCommonPastIntent;
            }
        }
        return baseIntent;
    }

    calculatePriorityBoost(contextEnhancement) {
        let boost = 0;
        if (contextEnhancement.userPreference) boost += 0.1;
        if (contextEnhancement.isFollowUp) boost += 0.15;
        if (contextEnhancement.similarPastRequests.length > 0) boost += 0.05;
        return Math.min(boost, 0.3);
    }

    analyzeHistoricalRouting(analysis, context) {
        const similarConversations = context.relatedConversations.filter(conv => 
            conv.request?.domain === analysis.domain
        );
        
        if (similarConversations.length === 0) {
            return { agent: null, successRate: 0, sampleSize: 0 };
        }
        
        const agentPerformance = {};
        
        similarConversations.forEach(conv => {
            if (!agentPerformance[conv.agentType]) {
                agentPerformance[conv.agentType] = { successes: 0, total: 0 };
            }
            
            agentPerformance[conv.agentType].total++;
            if (conv.response?.success && conv.response?.confidence > 0.7) {
                agentPerformance[conv.agentType].successes++;
            }
        });
        
        let bestAgent = null;
        let bestRate = 0;
        
        Object.entries(agentPerformance).forEach(([agent, performance]) => {
            const rate = performance.successes / performance.total;
            if (rate > bestRate && performance.total >= 2) { // Need at least 2 samples
                bestAgent = agent;
                bestRate = rate;
            }
        });
        
        return {
            agent: bestAgent,
            successRate: bestRate,
            sampleSize: similarConversations.length
        };
    }

    determineConversationThread(context, analysis) {
        if (analysis.context.topicContinuity === 'continuation' && context.recentConversations.length > 0) {
            return context.recentConversations[0].context?.conversationThread || 
                   `thread_${Date.now()}_${analysis.domain}`;
        }
        
        if (analysis.context.isFollowUp) {
            return `thread_${Date.now()}_${analysis.domain}`;
        }
        
        return null;
    }

    // Utility methods
    hasSharedKeywords(request, conversation, minShared = 1) {
        if (!conversation.request?.keywords) return false;
        
        const requestKeywords = this.extractKeywords(request);
        const sharedCount = requestKeywords.filter(keyword => 
            conversation.request.keywords.includes(keyword)
        ).length;
        
        return sharedCount >= minShared;
    }

    getMostFrequent(array) {
        if (array.length === 0) return null;
        
        const frequency = {};
        array.forEach(item => {
            if (item) frequency[item] = (frequency[item] || 0) + 1;
        });
        
        return Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || null;
    }

    extractKeywords(text) {
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
        
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .filter(word => word.length > 2 && !stopWords.has(word));
    }

    async storeErrorConversation(request, error, userId) {
        try {
            const errorConversationData = {
                userId,
                agentType: 'MCA',
                request: {
                    original: request,
                    intent: 'error_handling'
                },
                response: {
                    content: 'Error occurred during processing',
                    success: false,
                    confidence: 0,
                    metadata: { error: error.message }
                },
                context: {},
                performance: { totalTime: 0 }
            };
            
            await this.conversationStore.storeConversation(errorConversationData);
        } catch (storeError) {
            console.error('Failed to store error conversation:', storeError);
        }
    }

    // Memory analytics endpoints
    async getConversationAnalytics(userId, timeRange = 7) { // days
        const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);
        
        const conversations = await this.conversationStore.searchConversations({
            userId,
            dateRange: { start: startDate.toISOString() },
            limit: 1000
        });
        
        return {
            totalConversations: conversations.length,
            agentUsage: this.calculateAgentUsage(conversations),
            averageConfidence: this.calculateAverageConfidence(conversations),
            topTopics: this.getTopTopics(conversations),
            performanceMetrics: this.calculatePerformanceMetrics(conversations),
            learningProgress: this.assessLearningProgress(conversations)
        };
    }

    calculateAgentUsage(conversations) {
        const usage = {};
        conversations.forEach(conv => {
            usage[conv.agentType] = (usage[conv.agentType] || 0) + 1;
        });
        return usage;
    }

    calculateAverageConfidence(conversations) {
        if (conversations.length === 0) return 0;
        
        const total = conversations.reduce((sum, conv) => 
            sum + (conv.response?.confidence || 0), 0
        );
        return total / conversations.length;
    }

    getTopTopics(conversations) {
        const topics = {};
        conversations.forEach(conv => {
            if (conv.request?.keywords) {
                conv.request.keywords.forEach(keyword => {
                    topics[keyword] = (topics[keyword] || 0) + 1;
                });
            }
        });
        
        return Object.entries(topics)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([topic, count]) => ({ topic, count }));
    }

    calculatePerformanceMetrics(conversations) {
        if (conversations.length === 0) return {};
        
        const successfulConversations = conversations.filter(conv => conv.response?.success);
        const totalResponseTime = conversations.reduce((sum, conv) => 
            sum + (conv.performance?.totalTime || 0), 0
        );
        
        return {
            successRate: successfulConversations.length / conversations.length,
            averageResponseTime: totalResponseTime / conversations.length,
            totalRequests: conversations.length
        };
    }

    assessLearningProgress(conversations) {
        // Simple learning progress assessment
        const recentConversations = conversations.slice(0, 10);
        const olderConversations = conversations.slice(-10);
        
        const recentAvgConfidence = this.calculateAverageConfidence(recentConversations);
        const olderAvgConfidence = this.calculateAverageConfidence(olderConversations);
        
        return {
            confidenceImprovement: recentAvgConfidence - olderAvgConfidence,
            isLearning: recentAvgConfidence > olderAvgConfidence
        };
    }
}

module.exports = EnhancedMasterControlAgent;