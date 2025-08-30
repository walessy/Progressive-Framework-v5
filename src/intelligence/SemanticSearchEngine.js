// Advanced Semantic Search & Conversation Threading System
// Location: C:\Projects\Progressive-Framework-v5\src\intelligence\SemanticSearchEngine.js

const fs = require('fs').promises;
const path = require('path');

class SemanticSearchEngine {
    constructor() {
        this.vectorCache = new Map();
        this.conversationThreads = new Map();
        this.topicClusters = new Map();
        this.semanticIndex = new Map();
        
        // Semantic similarity threshold
        this.similarityThreshold = 0.75;
        
        // Topic modeling vocabulary
        this.topicVocabulary = this.initializeTopicVocabulary();
        
        console.log('SemanticSearchEngine initialized');
    }

    // ========================================
    // SEMANTIC VECTOR GENERATION
    // ========================================

    /**
     * Generate semantic vector for text using lightweight TF-IDF approach
     * (Can be upgraded to transformer models later)
     */
    generateSemanticVector(text) {
        const cacheKey = this.hashText(text);
        if (this.vectorCache.has(cacheKey)) {
            return this.vectorCache.get(cacheKey);
        }

        const vector = this.createTFIDFVector(text);
        this.vectorCache.set(cacheKey, vector);
        
        // Limit cache size
        if (this.vectorCache.size > 1000) {
            const firstKey = this.vectorCache.keys().next().value;
            this.vectorCache.delete(firstKey);
        }
        
        return vector;
    }

    createTFIDFVector(text) {
        const words = this.preprocessText(text);
        const wordFreq = this.calculateTermFrequency(words);
        
        // Create vector based on topic vocabulary
        const vector = {};
        
        for (const [category, categoryWords] of Object.entries(this.topicVocabulary)) {
            let categoryScore = 0;
            
            for (const word of categoryWords) {
                if (wordFreq[word]) {
                    // TF-IDF calculation (simplified)
                    const tf = wordFreq[word] / words.length;
                    const idf = Math.log(1000 / (this.getDocumentFrequency(word) + 1));
                    categoryScore += tf * idf;
                }
            }
            
            vector[category] = categoryScore;
        }
        
        // Normalize vector
        const magnitude = Math.sqrt(Object.values(vector).reduce((sum, val) => sum + val * val, 0));
        if (magnitude > 0) {
            for (const key in vector) {
                vector[key] = vector[key] / magnitude;
            }
        }
        
        return vector;
    }

    // ========================================
    // SEMANTIC SIMILARITY CALCULATION
    // ========================================

    calculateSemanticSimilarity(text1, text2) {
        const vector1 = this.generateSemanticVector(text1);
        const vector2 = this.generateSemanticVector(text2);
        
        return this.cosineSimilarity(vector1, vector2);
    }

    cosineSimilarity(vector1, vector2) {
        const keys = new Set([...Object.keys(vector1), ...Object.keys(vector2)]);
        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;
        
        for (const key of keys) {
            const val1 = vector1[key] || 0;
            const val2 = vector2[key] || 0;
            
            dotProduct += val1 * val2;
            magnitude1 += val1 * val1;
            magnitude2 += val2 * val2;
        }
        
        const magnitude = Math.sqrt(magnitude1) * Math.sqrt(magnitude2);
        return magnitude > 0 ? dotProduct / magnitude : 0;
    }

    // ========================================
    // ADVANCED SEMANTIC SEARCH
    // ========================================

    async performSemanticSearch(query, conversations, options = {}) {
        const {
            minSimilarity = 0.3,
            maxResults = 50,
            boostRecent = true,
            includeContext = true
        } = options;

        const queryVector = this.generateSemanticVector(query);
        const results = [];

        for (const conversation of conversations) {
            const searchableText = this.createSearchableText(conversation);
            const similarity = this.calculateSemanticSimilarity(query, searchableText);
            
            if (similarity >= minSimilarity) {
                let score = similarity;
                
                // Boost recent conversations
                if (boostRecent) {
                    const daysSinceConversation = this.getDaysSince(conversation.timestamp);
                    const recencyBoost = Math.max(0, 1 - (daysSinceConversation / 30)); // 30-day decay
                    score = score * (1 + recencyBoost * 0.2);
                }
                
                // Boost based on conversation success
                if (conversation.response?.confidence) {
                    score = score * (1 + conversation.response.confidence * 0.1);
                }
                
                results.push({
                    conversation,
                    semanticSimilarity: similarity,
                    boostedScore: score,
                    matchedTopics: this.identifyMatchedTopics(query, searchableText)
                });
            }
        }

        // Sort by boosted score
        results.sort((a, b) => b.boostedScore - a.boostedScore);
        
        const topResults = results.slice(0, maxResults);
        
        // Add context if requested
        if (includeContext) {
            return await this.addSemanticContext(topResults);
        }
        
        return topResults;
    }

    async addSemanticContext(results) {
        return results.map(result => ({
            ...result,
            semanticContext: {
                topicDistribution: this.analyzeTopicDistribution(result.conversation),
                conceptualKeywords: this.extractConceptualKeywords(result.conversation),
                semanticCluster: this.identifySemanticCluster(result.conversation)
            }
        }));
    }

    // ========================================
    // CONVERSATION THREADING SYSTEM
    // ========================================

    async analyzeConversationThreads(conversations) {
        const threads = new Map();
        
        // Sort conversations by timestamp
        const sortedConversations = conversations.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        );
        
        for (const conversation of sortedConversations) {
            const threadId = await this.determineThread(conversation, threads);
            
            if (!threads.has(threadId)) {
                threads.set(threadId, {
                    id: threadId,
                    conversations: [],
                    mainTopic: null,
                    coherenceScore: 0,
                    duration: 0,
                    participants: new Set()
                });
            }
            
            const thread = threads.get(threadId);
            thread.conversations.push(conversation);
            thread.participants.add(conversation.userId);
            
            // Update thread metadata
            this.updateThreadMetadata(thread);
        }
        
        return Array.from(threads.values());
    }

    async determineThread(conversation, existingThreads) {
        const conversationText = this.createSearchableText(conversation);
        
        // Check if this continues an existing thread
        let bestMatch = null;
        let bestSimilarity = 0;
        
        for (const [threadId, thread] of existingThreads) {
            if (thread.conversations.length === 0) continue;
            
            // Check temporal proximity (within 2 hours)
            const lastConversation = thread.conversations[thread.conversations.length - 1];
            const timeDiff = new Date(conversation.timestamp) - new Date(lastConversation.timestamp);
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            if (hoursDiff > 2) continue; // Too much time passed
            
            // Check semantic similarity with recent conversations in thread
            const recentThreadText = thread.conversations.slice(-3)
                .map(c => this.createSearchableText(c))
                .join(' ');
            
            const similarity = this.calculateSemanticSimilarity(conversationText, recentThreadText);
            
            if (similarity > bestSimilarity && similarity > this.similarityThreshold) {
                bestSimilarity = similarity;
                bestMatch = threadId;
            }
        }
        
        // Return existing thread or create new one
        return bestMatch || `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    updateThreadMetadata(thread) {
        if (thread.conversations.length === 0) return;
        
        // Calculate main topic
        const allText = thread.conversations
            .map(c => this.createSearchableText(c))
            .join(' ');
        
        thread.mainTopic = this.identifyMainTopic(allText);
        
        // Calculate coherence score
        thread.coherenceScore = this.calculateThreadCoherence(thread.conversations);
        
        // Calculate duration
        const firstConversation = thread.conversations[0];
        const lastConversation = thread.conversations[thread.conversations.length - 1];
        thread.duration = new Date(lastConversation.timestamp) - new Date(firstConversation.timestamp);
    }

    calculateThreadCoherence(conversations) {
        if (conversations.length < 2) return 1.0;
        
        let totalSimilarity = 0;
        let comparisons = 0;
        
        for (let i = 0; i < conversations.length - 1; i++) {
            const text1 = this.createSearchableText(conversations[i]);
            const text2 = this.createSearchableText(conversations[i + 1]);
            
            totalSimilarity += this.calculateSemanticSimilarity(text1, text2);
            comparisons++;
        }
        
        return comparisons > 0 ? totalSimilarity / comparisons : 0;
    }

    // ========================================
    // TOPIC MODELING & CLUSTERING
    // ========================================

    async performTopicModeling(conversations) {
        const topicClusters = new Map();
        
        for (const conversation of conversations) {
            const topics = this.identifyConversationTopics(conversation);
            
            for (const topic of topics) {
                if (!topicClusters.has(topic.name)) {
                    topicClusters.set(topic.name, {
                        name: topic.name,
                        conversations: [],
                        totalWeight: 0,
                        averageConfidence: 0,
                        timeSpread: { earliest: null, latest: null }
                    });
                }
                
                const cluster = topicClusters.get(topic.name);
                cluster.conversations.push({
                    conversation,
                    weight: topic.weight
                });
                cluster.totalWeight += topic.weight;
                
                // Update time spread
                const timestamp = new Date(conversation.timestamp);
                if (!cluster.timeSpread.earliest || timestamp < cluster.timeSpread.earliest) {
                    cluster.timeSpread.earliest = timestamp;
                }
                if (!cluster.timeSpread.latest || timestamp > cluster.timeSpread.latest) {
                    cluster.timeSpread.latest = timestamp;
                }
            }
        }
        
        // Calculate cluster metrics
        for (const cluster of topicClusters.values()) {
            const confidences = cluster.conversations.map(c => c.conversation.response?.confidence || 0);
            cluster.averageConfidence = confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
        }
        
        return Array.from(topicClusters.values())
            .sort((a, b) => b.totalWeight - a.totalWeight);
    }

    identifyConversationTopics(conversation) {
        const text = this.createSearchableText(conversation);
        const vector = this.generateSemanticVector(text);
        
        const topics = [];
        
        for (const [topicName, weight] of Object.entries(vector)) {
            if (weight > 0.1) { // Threshold for topic relevance
                topics.push({
                    name: topicName,
                    weight: weight,
                    confidence: Math.min(weight * 2, 1.0) // Convert to confidence score
                });
            }
        }
        
        return topics.sort((a, b) => b.weight - a.weight);
    }

    // ========================================
    // ADVANCED CONTEXT ANALYSIS
    // ========================================

    async generateSemanticInsights(conversations, userId) {
        const insights = [];
        
        // Analyze topic evolution
        const topicEvolution = await this.analyzeTopicEvolution(conversations);
        if (topicEvolution.trending.length > 0) {
            insights.push({
                type: 'topic_evolution',
                message: `Your interests have been evolving toward ${topicEvolution.trending[0]} recently.`,
                confidence: 0.8,
                data: topicEvolution
            });
        }
        
        // Analyze conversation complexity trends
        const complexityTrend = this.analyzeComplexityTrend(conversations);
        if (complexityTrend.trend === 'increasing') {
            insights.push({
                type: 'complexity_growth',
                message: 'Your questions are becoming more sophisticated over time. I\'m adapting to provide deeper insights.',
                confidence: 0.7,
                data: complexityTrend
            });
        }
        
        // Analyze semantic clusters
        const clusters = await this.performTopicModeling(conversations);
        if (clusters.length > 0) {
            const dominantCluster = clusters[0];
            insights.push({
                type: 'dominant_interest',
                message: `Your primary area of interest appears to be ${dominantCluster.name} with ${dominantCluster.conversations.length} related conversations.`,
                confidence: 0.9,
                data: { cluster: dominantCluster }
            });
        }
        
        return insights;
    }

    async analyzeTopicEvolution(conversations) {
        if (conversations.length < 5) {
            return { trending: [], declining: [], stable: [] };
        }
        
        const timeWindow = 7; // days
        const now = new Date();
        const recentCutoff = new Date(now.getTime() - timeWindow * 24 * 60 * 60 * 1000);
        
        const recentConversations = conversations.filter(c => new Date(c.timestamp) > recentCutoff);
        const olderConversations = conversations.filter(c => new Date(c.timestamp) <= recentCutoff);
        
        const recentTopics = await this.performTopicModeling(recentConversations);
        const olderTopics = await this.performTopicModeling(olderConversations);
        
        // Compare topic weights
        const trending = [];
        const declining = [];
        const stable = [];
        
        for (const recentTopic of recentTopics) {
            const olderTopic = olderTopics.find(t => t.name === recentTopic.name);
            
            if (!olderTopic) {
                trending.push(recentTopic.name);
            } else {
                const change = (recentTopic.totalWeight - olderTopic.totalWeight) / olderTopic.totalWeight;
                
                if (change > 0.2) {
                    trending.push(recentTopic.name);
                } else if (change < -0.2) {
                    declining.push(recentTopic.name);
                } else {
                    stable.push(recentTopic.name);
                }
            }
        }
        
        return { trending, declining, stable };
    }

    analyzeComplexityTrend(conversations) {
        if (conversations.length < 3) {
            return { trend: 'insufficient_data', change: 0 };
        }
        
        const recentComplexity = conversations.slice(0, Math.floor(conversations.length / 2))
            .reduce((sum, c) => sum + (c.request?.complexity || 0), 0) / Math.floor(conversations.length / 2);
        
        const olderComplexity = conversations.slice(Math.floor(conversations.length / 2))
            .reduce((sum, c) => sum + (c.request?.complexity || 0), 0) / Math.ceil(conversations.length / 2);
        
        const change = recentComplexity - olderComplexity;
        
        let trend = 'stable';
        if (change > 1) trend = 'increasing';
        else if (change < -1) trend = 'decreasing';
        
        return { trend, change, recentComplexity, olderComplexity };
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    initializeTopicVocabulary() {
        return {
            nutrition: ['nutrition', 'food', 'diet', 'meal', 'calories', 'protein', 'carbs', 'vitamins', 'healthy', 'eating', 'recipe', 'nutrients', 'supplements'],
            fitness: ['workout', 'exercise', 'training', 'fitness', 'muscle', 'strength', 'cardio', 'gym', 'sports', 'running', 'weightlifting', 'bodybuilding'],
            budget: ['budget', 'money', 'cost', 'expense', 'financial', 'price', 'savings', 'investment', 'income', 'spending', 'economy'],
            health: ['health', 'medical', 'doctor', 'symptoms', 'treatment', 'medicine', 'wellness', 'recovery', 'prevention', 'diagnosis'],
            lifestyle: ['lifestyle', 'habits', 'routine', 'daily', 'schedule', 'balance', 'productivity', 'goals', 'planning', 'organization'],
            technical: ['code', 'programming', 'api', 'database', 'server', 'framework', 'development', 'software', 'technology', 'algorithm']
        };
    }

    preprocessText(text) {
        return text.toLowerCase()
                  .replace(/[^\w\s]/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim()
                  .split(' ')
                  .filter(word => word.length > 2);
    }

    calculateTermFrequency(words) {
        const frequency = {};
        words.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });
        return frequency;
    }

    getDocumentFrequency(word) {
        // Simplified IDF calculation - in production, use actual document frequency
        const commonWords = ['the', 'and', 'for', 'you', 'your', 'can', 'how', 'what', 'when', 'where'];
        return commonWords.includes(word) ? 500 : 50;
    }

    createSearchableText(conversation) {
        const parts = [
            conversation.request?.original || '',
            conversation.response?.content || '',
            ...(conversation.request?.keywords || [])
        ];
        return parts.join(' ').toLowerCase();
    }

    identifyMainTopic(text) {
        const vector = this.generateSemanticVector(text);
        const sortedTopics = Object.entries(vector)
            .sort(([,a], [,b]) => b - a);
        
        return sortedTopics.length > 0 ? sortedTopics[0][0] : 'general';
    }

    identifyMatchedTopics(query, text) {
        const queryTopics = this.identifyConversationTopics({ request: { original: query }, response: { content: '' } });
        const textTopics = this.identifyConversationTopics({ request: { original: text }, response: { content: '' } });
        
        const matches = [];
        
        for (const queryTopic of queryTopics) {
            const textTopic = textTopics.find(t => t.name === queryTopic.name);
            if (textTopic) {
                matches.push({
                    topic: queryTopic.name,
                    queryWeight: queryTopic.weight,
                    textWeight: textTopic.weight,
                    similarity: Math.min(queryTopic.weight, textTopic.weight)
                });
            }
        }
        
        return matches.sort((a, b) => b.similarity - a.similarity);
    }

    analyzeTopicDistribution(conversation) {
        const topics = this.identifyConversationTopics(conversation);
        const total = topics.reduce((sum, topic) => sum + topic.weight, 0);
        
        return topics.map(topic => ({
            ...topic,
            percentage: total > 0 ? (topic.weight / total * 100).toFixed(1) : 0
        }));
    }

    extractConceptualKeywords(conversation) {
        const text = this.createSearchableText(conversation);
        const words = this.preprocessText(text);
        
        // Extract concepts based on topic vocabulary
        const concepts = new Set();
        
        for (const [category, vocabulary] of Object.entries(this.topicVocabulary)) {
            for (const word of words) {
                if (vocabulary.includes(word)) {
                    concepts.add(word);
                }
            }
        }
        
        return Array.from(concepts);
    }

    identifySemanticCluster(conversation) {
        const topics = this.identifyConversationTopics(conversation);
        
        if (topics.length === 0) return 'uncategorized';
        
        const dominantTopic = topics[0];
        
        if (dominantTopic.weight > 0.5) return `${dominantTopic.name}_focused`;
        if (topics.length > 3) return 'multi_topic';
        
        return dominantTopic.name;
    }

    hashText(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    getDaysSince(timestamp) {
        return (Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60 * 24);
    }
}

module.exports = SemanticSearchEngine;