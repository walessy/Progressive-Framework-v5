// Complete MCA Integration with All Four Agents (MCA + NPA + WPA + BMA)
// Location: C:\Projects\Progressive-Framework-v5\src\agents\CompleteMasterControlAgent.js

const EnhancedConversationStore = require('../persistence/EnhancedConversationStore');
const BaseAgent = require('./BaseAgent');

class CompleteMasterControlAgent extends BaseAgent {
    constructor() {
        super('MCA');
        this.conversationStore = new EnhancedConversationStore();
        
        // Initialize all specialized agents
        this.agents = {};
        this.initializeAgents();
        
        // Enhanced routing intelligence
        this.domainKeywords = this.initializeDomainKeywords();
        this.routingHistory = new Map();
        this.learningEnabled = true;
        
        console.log('Complete Master Control Agent initialized with 4 specialized agents');
    }

    async initializeAgents() {
        try {
            // Import and initialize all agents
            const NutritionPlanningAgent = require('./NutritionPlanningAgent');
            const WorkoutPlanningAgent = require('./WorkoutPlanningAgent');
            const BudgetManagementAgent = require('./BudgetManagementAgent');
            
            this.agents = {
                NPA: new NutritionPlanningAgent(),
                WPA: new WorkoutPlanningAgent(),
                BMA: new BudgetManagementAgent()
            };
            
            console.log('All specialized agents initialized successfully');
        } catch (error) {
            console.error('Agent initialization error:', error);
            this.agents = {}; // Fallback to MCA-only mode
        }
    }

    initializeDomainKeywords() {
        return {
            nutrition: {
                primary: ['nutrition', 'diet', 'food', 'meal', 'eat', 'calories', 'protein', 'carbs', 'vitamins', 'recipe'],
                secondary: ['healthy', 'weight', 'fat', 'muscle', 'supplements', 'nutrients', 'cooking', 'ingredients'],
                weight: 1.0
            },
            fitness: {
                primary: ['workout', 'exercise', 'training', 'fitness', 'gym', 'muscle', 'strength', 'cardio', 'sports'],
                secondary: ['run', 'lift', 'weights', 'reps', 'sets', 'program', 'routine', 'bodybuilding', 'crossfit'],
                weight: 1.0
            },
            budget: {
                primary: ['budget', 'money', 'cost', 'expense', 'financial', 'spend', 'save', 'savings', 'investment'],
                secondary: ['price', 'affordable', 'cheap', 'expensive', 'bank', 'income', 'debt', 'goal', 'fund'],
                weight: 1.0
            },
            // Cross-domain keywords that could apply to multiple agents
            planning: {
                primary: ['plan', 'planning', 'schedule', 'organize', 'prepare', 'strategy'],
                secondary: ['goal', 'target', 'objective', 'timeline', 'roadmap'],
                weight: 0.3
            }
        };
    }

    // ========================================
    // ENHANCED REQUEST PROCESSING
    // ========================================

    async processRequest(request, userId = 'anonymous') {
        const startTime = Date.now();
        
        try {
            // Step 1: Get enhanced conversation context
            const context = await this.conversationStore.getEnhancedConversationContext(userId, request);
            
            // Step 2: Advanced request analysis with semantic understanding
            const analysis = await this.performAdvancedAnalysis(request, context);
            
            // Step 3: Intelligent agent routing with learning
            const routingDecision = await this.performIntelligentRouting(analysis, context, userId);
            
            // Step 4: Execute with selected agent
            const response = await this.executeWithSelectedAgent(routingDecision, request, context, userId);
            
            // Step 5: Learn from the interaction
            await this.updateRoutingIntelligence(routingDecision, response, analysis);
            
            // Step 6: Store conversation with full semantic metadata
            const conversationData = this.createConversationData(
                request, response, routingDecision, analysis, context, userId, startTime
            );
            
            const storedConversation = await this.conversationStore.storeConversation(conversationData);
            
            // Step 7: Generate enhanced response with insights
            return this.createEnhancedResponse(response, storedConversation, context, routingDecision);
            
        } catch (error) {
            console.error('Complete MCA processing error:', error);
            return this.createErrorResponse(error, request, userId);
        }
    }

    // ========================================
    // ADVANCED ANALYSIS SYSTEM
    // ========================================

    async performAdvancedAnalysis(request, context) {
        // Base analysis
        const baseAnalysis = this.analyzeRequest(request);
        
        // Semantic analysis using enhanced conversation store
        const semanticAnalysis = context.semanticContext ? {
            predictedIntent: context.semanticContext.predictedIntent,
            semanticSimilarity: context.semanticContext.semanticMatches.length > 0 
                ? context.semanticContext.semanticMatches[0].semanticSimilarity 
                : 0,
            relatedTopics: this.extractRelatedTopics(context.semanticContext.semanticMatches)
        } : {};
        
        // Multi-domain analysis
        const domainScores = this.calculateMultiDomainScores(request, context);
        
        // User preference integration
        const preferenceAnalysis = this.analyzeUserPreferences(context, domainScores);
        
        // Context continuity analysis
        const continuityAnalysis = this.analyzeContinuity(request, context);
        
        return {
            ...baseAnalysis,
            semantic: semanticAnalysis,
            domains: domainScores,
            preferences: preferenceAnalysis,
            continuity: continuityAnalysis,
            complexity: this.calculateComplexity(request, context),
            confidence: this.calculateAnalysisConfidence([
                baseAnalysis, semanticAnalysis, domainScores, preferenceAnalysis
            ])
        };
    }

    calculateMultiDomainScores(request, context) {
        const scores = {};
        const lowerRequest = request.toLowerCase();
        const words = lowerRequest.split(' ');
        
        // Calculate base domain scores
        Object.entries(this.domainKeywords).forEach(([domain, keywords]) => {
            let score = 0;
            
            // Primary keywords (higher weight)
            keywords.primary.forEach(keyword => {
                if (lowerRequest.includes(keyword)) {
                    score += 2 * keywords.weight;
                }
            });
            
            // Secondary keywords (lower weight)
            keywords.secondary.forEach(keyword => {
                if (lowerRequest.includes(keyword)) {
                    score += 1 * keywords.weight;
                }
            });
            
            scores[domain] = score;
        });
        
        // Boost scores based on user history
        if (context.userPreferences?.preferredAgents) {
            Object.entries(context.userPreferences.preferredAgents).forEach(([agent, count]) => {
                const domain = this.agentToDomain(agent);
                if (domain && scores[domain] !== undefined) {
                    scores[domain] += Math.min(count * 0.1, 1.0); // Max 1.0 boost
                }
            });
        }
        
        // Context continuity boost
        if (context.recentConversations?.length > 0) {
            const lastAgent = context.recentConversations[0].agentType;
            const lastDomain = this.agentToDomain(lastAgent);
            if (lastDomain && scores[lastDomain] !== undefined) {
                scores[lastDomain] += 0.5; // Continuity boost
            }
        }
        
        return scores;
    }

    // ========================================
    // INTELLIGENT ROUTING SYSTEM
    // ========================================

    async performIntelligentRouting(analysis, context, userId) {
        const routingOptions = [];
        
        // Generate routing options for each agent
        Object.keys(this.agents).forEach(agentType => {
            const domain = this.agentToDomain(agentType);
            const domainScore = analysis.domains[domain] || 0;
            
            let confidence = this.calculateBaseConfidence(domainScore, analysis);
            
            // Adjust confidence based on historical performance
            const historicalPerformance = this.getHistoricalPerformance(agentType, analysis, userId);
            confidence = this.adjustConfidenceWithHistory(confidence, historicalPerformance);
            
            // Adjust for semantic similarity
            if (analysis.semantic.semanticSimilarity > 0.7) {
                confidence += 0.1;
            }
            
            // Adjust for user preferences
            if (analysis.preferences.strongPreference === agentType) {
                confidence += 0.15;
            }
            
            routingOptions.push({
                agent: agentType,
                confidence: Math.min(confidence, 1.0),
                reasoning: this.generateRoutingReasoning(agentType, domainScore, historicalPerformance, analysis),
                domainScore: domainScore
            });
        });
        
        // Add MCA option for general queries
        routingOptions.push({
            agent: 'MCA',
            confidence: this.calculateMCAConfidence(analysis),
            reasoning: 'General query best handled by Master Control Agent',
            domainScore: 0
        });
        
        // Sort by confidence and return best option
        routingOptions.sort((a, b) => b.confidence - a.confidence);
        
        const selectedOption = routingOptions[0];
        
        // Log routing decision for learning
        this.logRoutingDecision(selectedOption, routingOptions, analysis, userId);
        
        return {
            ...selectedOption,
            alternativeOptions: routingOptions.slice(1, 3), // Top 2 alternatives
            routingMetrics: {
                totalOptions: routingOptions.length,
                confidenceSpread: routingOptions[0].confidence - routingOptions[routingOptions.length - 1].confidence,
                domainCertainty: Math.max(...Object.values(analysis.domains))
            }
        };
    }

    calculateBaseConfidence(domainScore, analysis) {
        // Base confidence from domain score
        let confidence = Math.min(domainScore / 5, 0.8); // Max 0.8 from domain score
        
        // Boost for clear intent
        if (analysis.intent !== 'unknown') {
            confidence += 0.1;
        }
        
        // Boost for high complexity (specialized agents better for complex queries)
        if (analysis.complexity > 7) {
            confidence += 0.1;
        }
        
        return confidence;
    }

    adjustConfidenceWithHistory(baseConfidence, historicalPerformance) {
        if (!historicalPerformance || historicalPerformance.sampleSize < 3) {
            return baseConfidence;
        }
        
        // Adjust based on success rate
        const successRateAdjustment = (historicalPerformance.successRate - 0.5) * 0.2; // ±0.2 max adjustment
        
        // Adjust based on average confidence of past interactions
        const confidenceAdjustment = (historicalPerformance.avgConfidence - 0.5) * 0.1; // ±0.1 max adjustment
        
        return Math.max(0, Math.min(1, baseConfidence + successRateAdjustment + confidenceAdjustment));
    }

    // ========================================
    // AGENT EXECUTION WITH ERROR HANDLING
    // ========================================

    async executeWithSelectedAgent(routingDecision, request, context, userId) {
        const startTime = Date.now();
        
        try {
            let response;
            
            if (routingDecision.agent === 'MCA') {
                // Handle with MCA's general capabilities
                response = await this.handleGeneralQuery(request, context);
            } else if (this.agents[routingDecision.agent]) {
                // Route to specialized agent
                response = await this.agents[routingDecision.agent].processRequest(request, {
                    userId,
                    context,
                    routingDecision
                });
                
                // Enhance response with MCA metadata
                response.mcaRouting = {
                    selectedAgent: routingDecision.agent,
                    routingConfidence: routingDecision.confidence,
                    alternativeOptions: routingDecision.alternativeOptions
                };
            } else {
                // Fallback to MCA if agent not available
                console.warn(`Agent ${routingDecision.agent} not available, falling back to MCA`);
                response = await this.handleGeneralQuery(request, context);
            }
            
            // Add execution metadata
            response.executionTime = Date.now() - startTime;
            response.executedBy = routingDecision.agent;
            
            return response;
            
        } catch (error) {
            console.error(`Agent ${routingDecision.agent} execution error:`, error);
            
            // Intelligent fallback
            return await this.handleAgentFailure(routingDecision, request, context, error);
        }
    }

    async handleAgentFailure(routingDecision, request, context, error) {
        // Try alternative agents
        for (const alternative of routingDecision.alternativeOptions || []) {
            if (alternative.agent !== 'MCA' && this.agents[alternative.agent]) {
                try {
                    console.log(`Trying fallback agent: ${alternative.agent}`);
                    const response = await this.agents[alternative.agent].processRequest(request, {
                        context,
                        fallback: true,
                        originalError: error.message
                    });
                    
                    response.mcaRouting = {
                        selectedAgent: alternative.agent,
                        routingConfidence: alternative.confidence,
                        fallbackUsed: true,
                        originalAgent: routingDecision.agent
                    };
                    
                    return response;
                    
                } catch (fallbackError) {
                    console.error(`Fallback agent ${alternative.agent} also failed:`, fallbackError);
                    continue;
                }
            }
        }
        
        // Final fallback to MCA general handling
        return await this.handleGeneralQuery(request, context, {
            agentFailure: true,
            originalAgent: routingDecision.agent,
            error: error.message
        });
    }

    // ========================================
    // LEARNING & OPTIMIZATION
    // ========================================

    async updateRoutingIntelligence(routingDecision, response, analysis) {
        if (!this.learningEnabled) return;
        
        try {
            const performanceData = {
                agent: routingDecision.agent,
                success: response.success !== false,
                confidence: response.confidence || 0,
                executionTime: response.executionTime || 0,
                domainScores: analysis.domains,
                complexity: analysis.complexity,
                timestamp: new Date().toISOString()
            };
            
            // Store in routing history for learning
            const historyKey = `${routingDecision.agent}_${this.getDomainKey(analysis.domains)}`;
            
            if (!this.routingHistory.has(historyKey)) {
                this.routingHistory.set(historyKey, []);
            }
            
            const history = this.routingHistory.get(historyKey);
            history.push(performanceData);
            
            // Keep only recent history (last 50 interactions per pattern)
            if (history.length > 50) {
                history.shift();
            }
            
            // Update domain keyword weights based on performance
            await this.updateDomainWeights(analysis.domains, performanceData);
            
        } catch (error) {
            console.error('Failed to update routing intelligence:', error);
        }
    }

    getDomainKey(domainScores) {
        return Object.entries(domainScores)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2)
            .map(([domain]) => domain)
            .join('_');
    }

    async updateDomainWeights(domainScores, performanceData) {
        const dominantDomain = Object.entries(domainScores)
            .reduce((max, [domain, score]) => score > max.score ? {domain, score} : max, 
                    {domain: null, score: 0});
        
        if (dominantDomain.domain && this.domainKeywords[dominantDomain.domain]) {
            const adjustment = performanceData.success ? 0.01 : -0.01;
            const currentWeight = this.domainKeywords[dominantDomain.domain].weight;
            
            this.domainKeywords[dominantDomain.domain].weight = 
                Math.max(0.5, Math.min(2.0, currentWeight + adjustment));
        }
    }

    // ========================================
    // RESPONSE ENHANCEMENT
    // ========================================

    createEnhancedResponse(response, storedConversation, context, routingDecision) {
        const insights = this.generateSessionInsights(context);
        
        return {
            content: response.content,
            success: response.success !== false,
            confidence: response.confidence || 0.8,
            conversationId: storedConversation.id,
            
            // Enhanced session insights
            sessionInsights: insights,
            
            // Routing intelligence metadata
            mcaMetadata: {
                routingDecision: {
                    selectedAgent: routingDecision.agent,
                    confidence: routingDecision.confidence,
                    reasoning: routingDecision.reasoning,
                    alternatives: routingDecision.alternativeOptions?.map(opt => ({
                        agent: opt.agent,
                        confidence: opt.confidence
                    })) || []
                },
                contextUtilization: {
                    semanticContext: !!context.semanticContext,
                    recentConversations: context.recentConversations?.length || 0,
                    userPreferences: Object.keys(context.userPreferences || {}).length > 0,
                    threadContinuity: context.semanticContext?.activeThreads?.length || 0
                },
                performanceMetrics: {
                    executionTime: response.executionTime || 0,
                    routingTime: routingDecision.routingMetrics?.routingTime || 0,
                    totalProcessingTime: storedConversation.performance?.totalTime || 0
                },
                learningIndicators: {
                    domainCertainty: routingDecision.routingMetrics?.domainCertainty || 0,
                    confidenceSpread: routingDecision.routingMetrics?.confidenceSpread || 0,
                    historicalAccuracy: this.getHistoricalAccuracy(routingDecision.agent)
                }
            },
            
            // Agent-specific metadata
            agentMetadata: response.metadata || {},
            
            // Cross-agent collaboration suggestions
            collaborationSuggestions: this.generateCollaborationSuggestions(routingDecision, context),
            
            // Semantic insights from enhanced conversation store
            semanticInsights: context.semanticContext?.contextualRecommendations || []
        };
    }

    generateCollaborationSuggestions(routingDecision, context) {
        const suggestions = [];
        const selectedAgent = routingDecision.agent;
        
        // Suggest complementary agents based on current query
        const collaborationPatterns = {
            'NPA': {
                'WPA': 'Consider creating a workout plan to complement your nutrition goals',
                'BMA': 'Track your food expenses to optimize your nutrition budget'
            },
            'WPA': {
                'NPA': 'Optimize your nutrition to support your fitness goals',
                'BMA': 'Budget for gym memberships and fitness equipment'
            },
            'BMA': {
                'NPA': 'Set a budget for healthy eating and meal planning',
                'WPA': 'Plan financially for your fitness and health goals'
            }
        };
        
        if (collaborationPatterns[selectedAgent]) {
            Object.entries(collaborationPatterns[selectedAgent]).forEach(([targetAgent, suggestion]) => {
                // Check if user has shown interest in the target domain
                const targetDomain = this.agentToDomain(targetAgent);
                const userInterest = context.userPreferences?.commonTopics || {};
                
                const hasRelatedInterest = Object.keys(userInterest).some(topic => {
                    const domainKeywords = this.domainKeywords[targetDomain]?.primary || [];
                    return domainKeywords.includes(topic.toLowerCase());
                });
                
                if (hasRelatedInterest || Math.random() > 0.7) { // 30% chance for new suggestions
                    suggestions.push({
                        targetAgent,
                        suggestion,
                        confidence: hasRelatedInterest ? 0.8 : 0.4
                    });
                }
            });
        }
        
        return suggestions;
    }

    // ========================================
    // UTILITY AND HELPER METHODS
    // ========================================

    agentToDomain(agent) {
        const mapping = {
            'NPA': 'nutrition',
            'WPA': 'fitness',
            'BMA': 'budget',
            'MCA': 'general'
        };
        return mapping[agent] || 'general';
    }

    domainToAgent(domain) {
        const mapping = {
            'nutrition': 'NPA',
            'fitness': 'WPA',
            'budget': 'BMA',
            'general': 'MCA'
        };
        return mapping[domain] || 'MCA';
    }

    getHistoricalPerformance(agentType, analysis, userId) {
        const historyKey = `${agentType}_${this.getDomainKey(analysis.domains)}`;
        const history = this.routingHistory.get(historyKey) || [];
        
        if (history.length === 0) return null;
        
        const recentHistory = history.slice(-10); // Last 10 interactions
        
        return {
            sampleSize: recentHistory.length,
            successRate: recentHistory.filter(h => h.success).length / recentHistory.length,
            avgConfidence: recentHistory.reduce((sum, h) => sum + h.confidence, 0) / recentHistory.length,
            avgExecutionTime: recentHistory.reduce((sum, h) => sum + h.executionTime, 0) / recentHistory.length
        };
    }

    getHistoricalAccuracy(agent) {
        let totalInteractions = 0;
        let successfulInteractions = 0;
        
        for (const [key, history] of this.routingHistory.entries()) {
            if (key.startsWith(agent + '_')) {
                totalInteractions += history.length;
                successfulInteractions += history.filter(h => h.success).length;
            }
        }
        
        return totalInteractions > 0 ? successfulInteractions / totalInteractions : 0.5;
    }

    logRoutingDecision(selectedOption, allOptions, analysis, userId) {
        // Log for debugging and system monitoring
        console.log(`[MCA Routing] User: ${userId}, Selected: ${selectedOption.agent} (${selectedOption.confidence.toFixed(2)}), Domain Scores:`, 
                   Object.entries(analysis.domains).map(([d, s]) => `${d}:${s.toFixed(1)}`).join(', '));
    }

    calculateMCAConfidence(analysis) {
        // MCA confidence is higher for general queries and lower for specialized domains
        const maxDomainScore = Math.max(...Object.values(analysis.domains));
        
        // If no domain has a strong score, MCA might be best
        if (maxDomainScore < 2) {
            return 0.8;
        }
        
        // If query is very general or meta (asking about the system itself)
        const generalKeywords = ['help', 'what', 'how', 'can', 'you', 'assist', 'capable', 'do'];
        const lowerRequest = analysis.keywords.join(' ').toLowerCase();
        const generalScore = generalKeywords.reduce((score, keyword) => 
            score + (lowerRequest.includes(keyword) ? 1 : 0), 0);
        
        if (generalScore > 2) {
            return 0.9;
        }
        
        // Lower confidence for domain-specific queries
        return Math.max(0.2, 0.7 - (maxDomainScore * 0.1));
    }

    generateRoutingReasoning(agentType, domainScore, historicalPerformance, analysis) {
        const reasons = [];
        
        if (domainScore > 3) {
            reasons.push(`Strong ${this.agentToDomain(agentType)} domain match (${domainScore.toFixed(1)})`);
        } else if (domainScore > 1) {
            reasons.push(`Moderate ${this.agentToDomain(agentType)} domain match (${domainScore.toFixed(1)})`);
        }
        
        if (historicalPerformance && historicalPerformance.successRate > 0.8) {
            reasons.push(`High historical success rate (${(historicalPerformance.successRate * 100).toFixed(0)}%)`);
        }
        
        if (analysis.preferences.strongPreference === agentType) {
            reasons.push('Matches user preference pattern');
        }
        
        if (analysis.continuity.isFollowUp && analysis.continuity.lastAgent === agentType) {
            reasons.push('Continues previous conversation topic');
        }
        
        if (reasons.length === 0) {
            reasons.push('General capability match');
        }
        
        return reasons.join('; ');
    }

    analyzeUserPreferences(context, domainScores) {
        const preferences = context.userPreferences || {};
        
        // Find user's most preferred agent
        let strongPreference = null;
        if (preferences.preferredAgents) {
            const sortedPreferences = Object.entries(preferences.preferredAgents)
                .sort(([,a], [,b]) => b - a);
            
            if (sortedPreferences.length > 0 && sortedPreferences[0][1] > 5) {
                strongPreference = sortedPreferences[0][0];
            }
        }
        
        // Analyze topic preferences alignment with current query
        const topicAlignment = {};
        if (preferences.commonTopics) {
            Object.entries(this.domainKeywords).forEach(([domain, keywords]) => {
                let alignment = 0;
                Object.keys(preferences.commonTopics).forEach(userTopic => {
                    if (keywords.primary.includes(userTopic.toLowerCase()) || 
                        keywords.secondary.includes(userTopic.toLowerCase())) {
                        alignment += preferences.commonTopics[userTopic];
                    }
                });
                topicAlignment[domain] = alignment;
            });
        }
        
        return {
            strongPreference,
            topicAlignment,
            preferenceStrength: strongPreference ? 
                preferences.preferredAgents[strongPreference] : 0
        };
    }

    analyzeContinuity(request, context) {
        const recentConversations = context.recentConversations || [];
        
        if (recentConversations.length === 0) {
            return { isFollowUp: false, lastAgent: null, topicShift: 'new' };
        }
        
        const lastConversation = recentConversations[0];
        const timeDiff = Date.now() - new Date(lastConversation.timestamp).getTime();
        const hoursSinceLastConversation = timeDiff / (1000 * 60 * 60);
        
        // Check for follow-up indicators
        const followUpKeywords = ['also', 'and', 'additionally', 'furthermore', 'plus', 'what about'];
        const hasFollowUpKeywords = followUpKeywords.some(keyword => 
            request.toLowerCase().includes(keyword)
        );
        
        // Semantic continuity check
        const semanticContinuity = context.semanticContext?.semanticMatches?.[0]?.semanticSimilarity > 0.6;
        
        const isFollowUp = (hoursSinceLastConversation < 1 && hasFollowUpKeywords) || 
                          (hoursSinceLastConversation < 0.5 && semanticContinuity);
        
        return {
            isFollowUp,
            lastAgent: lastConversation.agentType,
            hoursSinceLast: hoursSinceLastConversation,
            semanticContinuity,
            topicShift: semanticContinuity ? 'continuation' : 'shift'
        };
    }

    calculateAnalysisConfidence(analysisComponents) {
        // Calculate overall confidence in the analysis
        let totalConfidence = 0;
        let componentCount = 0;
        
        analysisComponents.forEach(component => {
            if (component && typeof component === 'object') {
                // Extract confidence indicators from each component
                if (component.confidence !== undefined) {
                    totalConfidence += component.confidence;
                    componentCount++;
                } else {
                    // Estimate confidence based on component completeness
                    const keys = Object.keys(component);
                    const completeness = keys.length / 5; // Assuming 5 is ideal
                    totalConfidence += Math.min(completeness, 1);
                    componentCount++;
                }
            }
        });
        
        return componentCount > 0 ? totalConfidence / componentCount : 0.5;
    }

    calculateComplexity(request, context) {
        let complexity = 0;
        
        // Base complexity from request length and structure
        complexity += Math.min(request.length / 100, 3);
        
        // Question complexity
        const questionMarks = (request.match(/\?/g) || []).length;
        complexity += questionMarks * 0.5;
        
        // Technical/specific terms
        const technicalTerms = request.toLowerCase().match(/\b(specific|detailed|comprehensive|advanced|optimize|analyze|compare|plan|strategy|goal)\b/g);
        complexity += (technicalTerms?.length || 0) * 0.3;
        
        // Multi-domain queries (more complex)
        const domainCount = Object.values(context.domains || {}).filter(score => score > 1).length;
        complexity += Math.max(0, domainCount - 1) * 0.5;
        
        // Context dependency (complex if relies heavily on previous context)
        if (context.continuity?.isFollowUp) {
            complexity += 0.5;
        }
        
        return Math.min(Math.round(complexity), 10);
    }

    extractRelatedTopics(semanticMatches) {
        if (!semanticMatches || semanticMatches.length === 0) return [];
        
        const topics = new Set();
        
        semanticMatches.slice(0, 5).forEach(match => {
            if (match.matchedTopics) {
                match.matchedTopics.forEach(topic => {
                    if (topic.similarity > 0.5) {
                        topics.add(topic.topic);
                    }
                });
            }
        });
        
        return Array.from(topics);
    }

    createConversationData(request, response, routingDecision, analysis, context, userId, startTime) {
        return {
            userId,
            agentType: 'MCA', // This conversation is stored under MCA
            routingDecision: {
                selectedAgent: routingDecision.agent,
                confidence: routingDecision.confidence,
                reasoning: routingDecision.reasoning,
                alternativeOptions: routingDecision.alternativeOptions
            },
            request: {
                original: request,
                intent: analysis.semantic.predictedIntent || analysis.intent,
                complexity: analysis.complexity,
                domain: Object.entries(analysis.domains)
                    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'general'
            },
            response: {
                content: response.content,
                confidence: response.confidence || 0.8,
                success: response.success !== false,
                metadata: {
                    executedBy: routingDecision.agent,
                    routingConfidence: routingDecision.confidence,
                    collaborationSuggested: response.collaborationSuggestions?.length > 0,
                    semanticEnhanced: !!context.semanticContext
                },
                agentCollaboration: routingDecision.agent !== 'MCA' ? {
                    primaryAgent: routingDecision.agent,
                    fallbackUsed: response.mcaRouting?.fallbackUsed || false
                } : null
            },
            context: {
                previousConversations: context.recentConversations?.map(c => c.id) || [],
                userPreferences: context.userPreferences || {},
                conversationThread: context.semanticContext?.activeThreads?.[0]?.id || null,
                semanticContext: !!context.semanticContext
            },
            performance: {
                mcaProcessingTime: routingDecision.routingMetrics?.routingTime || 0,
                routingTime: routingDecision.routingMetrics?.routingTime || 0,
                agentResponseTime: response.executionTime || 0,
                totalTime: Date.now() - startTime
            }
        };
    }

    createErrorResponse(error, request, userId) {
        return {
            content: "I encountered an issue processing your request, but I'm learning from this to improve future interactions. Could you please try rephrasing your question?",
            success: false,
            confidence: 0.1,
            error: error.message,
            mcaMetadata: {
                errorHandling: true,
                fallbackUsed: true,
                routingDecision: {
                    selectedAgent: 'MCA',
                    confidence: 0.1,
                    reasoning: 'Error fallback'
                }
            }
        };
    }

    async handleGeneralQuery(request, context, metadata = {}) {
        // MCA's general query handling capabilities
        const response = {
            content: this.generateGeneralResponse(request, context, metadata),
            confidence: 0.8,
            success: true,
            metadata: {
                handledBy: 'MCA',
                isGeneral: true,
                ...metadata
            }
        };
        
        return response;
    }

    generateGeneralResponse(request, context, metadata) {
        if (metadata.agentFailure) {
            return `I had trouble with the ${metadata.originalAgent} agent, but I'm here to help! I can assist you with nutrition planning (NPA), workout planning (WPA), budget management (BMA), or general guidance. What would you like to focus on?`;
        }
        
        // Check if user is asking about system capabilities
        const lowerRequest = request.toLowerCase();
        if (lowerRequest.includes('what can you') || lowerRequest.includes('help me') || lowerRequest.includes('capabilities')) {
            return `I'm your Complete Master Control Agent with access to specialized AI agents:

🥗 **Nutrition Planning Agent (NPA)** - Meal plans, diet advice, nutritional guidance
💪 **Workout Planning Agent (WPA)** - Exercise routines, fitness programs, training advice  
💰 **Budget Management Agent (BMA)** - Financial planning, expense tracking, savings goals

I intelligently route your requests to the best specialist and can coordinate between agents. I also learn from our conversations to provide increasingly personalized assistance.

What would you like help with today?`;
        }
        
        // General helpful response
        return `I'm here to help with nutrition, fitness, budgeting, or any general questions. My specialized agents are ready to provide expert guidance in their domains. What's on your mind?`;
    }

    generateSessionInsights(context) {
        const insights = [];
        
        // Insights from semantic context
        if (context.semanticContext?.userSemanticProfile?.insights) {
            insights.push(...context.semanticContext.userSemanticProfile.insights);
        }
        
        // Multi-agent coordination insights
        const recentAgents = context.recentConversations
            ?.slice(0, 5)
            ?.map(c => c.agentType)
            ?.filter((agent, index, arr) => arr.indexOf(agent) === index) || [];
        
        if (recentAgents.length > 2) {
            insights.push({
                type: 'coordination',
                message: `I notice you're using multiple specialized agents (${recentAgents.join(', ')}). I'm coordinating their responses to give you comprehensive assistance.`,
                confidence: 0.9
            });
        }
        
        // Learning progress insight
        if (context.recentConversations?.length > 10) {
            const avgConfidence = context.recentConversations
                .slice(0, 10)
                .reduce((sum, c) => sum + (c.response?.confidence || 0), 0) / 10;
            
            if (avgConfidence > 0.8) {
                insights.push({
                    type: 'learning_progress',
                    message: `My responses have been consistently high-quality (${(avgConfidence * 100).toFixed(0)}% average confidence). I'm getting better at understanding your needs!`,
                    confidence: 0.8
                });
            }
        }
        
        return insights;
    }

    // ========================================
    // SYSTEM HEALTH & MONITORING
    // ========================================

    getSystemStatus() {
        const agentStatus = {};
        
        Object.entries(this.agents).forEach(([agentType, agent]) => {
            agentStatus[agentType] = {
                available: !!agent,
                type: agentType,
                description: this.getAgentDescription(agentType)
            };
        });
        
        return {
            masterControlAgent: 'operational',
            specializedAgents: agentStatus,
            conversationStore: 'enhanced_semantic',
            routingIntelligence: this.learningEnabled ? 'learning_enabled' : 'static',
            totalRoutingHistory: this.routingHistory.size,
            systemCapabilities: {
                semanticSearch: true,
                conversationThreading: true,
                userProfiling: true,
                crossAgentCollaboration: true,
                learningRouting: this.learningEnabled
            }
        };
    }

    getAgentDescription(agentType) {
        const descriptions = {
            'NPA': 'Nutrition Planning Agent - Meal plans, dietary advice, nutritional guidance',
            'WPA': 'Workout Planning Agent - Exercise routines, fitness programs, training advice',
            'BMA': 'Budget Management Agent - Financial planning, expense tracking, savings goals'
        };
        return descriptions[agentType] || 'Unknown agent type';
    }
}

module.exports = CompleteMasterControlAgent;