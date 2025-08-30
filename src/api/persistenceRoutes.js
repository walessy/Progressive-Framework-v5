// Enhanced Persistence API Endpoints for Progressive Framework V5
// Location: C:\Projects\Progressive-Framework-v5\src\api\persistenceRoutes.js

const express = require('express');
const ConversationStore = require('../persistence/ConversationStore');
const EnhancedMasterControlAgent = require('../agents/EnhancedMCA');

const router = express.Router();
const conversationStore = new ConversationStore();
const enhancedMCA = new EnhancedMasterControlAgent();

// ========================================
// CONVERSATION SEARCH & RETRIEVAL
// ========================================

/**
 * GET /api/conversations/search
 * Advanced conversation search with multiple criteria
 */
router.get('/search', async (req, res) => {
    try {
        const {
            query,
            agentType,
            userId,
            startDate,
            endDate,
            tags,
            intent,
            minConfidence,
            limit = 50,
            sortBy = 'timestamp'
        } = req.query;

        const searchCriteria = {
            query,
            agentType,
            userId,
            limit: parseInt(limit),
            sortBy
        };

        // Add date range if provided
        if (startDate || endDate) {
            searchCriteria.dateRange = {};
            if (startDate) searchCriteria.dateRange.start = startDate;
            if (endDate) searchCriteria.dateRange.end = endDate;
        }

        // Parse additional filters
        if (tags) searchCriteria.tags = tags.split(',').map(tag => tag.trim());
        if (intent) searchCriteria.intent = intent;
        if (minConfidence) searchCriteria.minConfidence = parseFloat(minConfidence);

        const results = await conversationStore.searchConversations(searchCriteria);

        res.json({
            success: true,
            results,
            count: results.length,
            searchCriteria
        });

    } catch (error) {
        console.error('Conversation search error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search conversations',
            details: error.message
        });
    }
});

/**
 * GET /api/conversations/:id
 * Get specific conversation by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const conversation = await conversationStore.getConversation(id);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        res.json({
            success: true,
            conversation
        });

    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve conversation',
            details: error.message
        });
    }
});

/**
 * GET /api/conversations/context/:userId
 * Get conversation context for a user (used by MCA)
 */
router.get('/context/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { request } = req.query;

        if (!request) {
            return res.status(400).json({
                success: false,
                error: 'Request parameter is required'
            });
        }

        const context = await conversationStore.getConversationContext(userId, request);

        res.json({
            success: true,
            context,
            contextSummary: {
                recentConversationsCount: context.recentConversations.length,
                relatedConversationsCount: context.relatedConversations.length,
                hasUserPreferences: Object.keys(context.userPreferences).length > 0,
                patternsDetected: context.conversationPatterns.length
            }
        });

    } catch (error) {
        console.error('Get context error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve conversation context',
            details: error.message
        });
    }
});

// ========================================
// ANALYTICS & INSIGHTS
// ========================================

/**
 * GET /api/conversations/analytics/:userId
 * Get comprehensive conversation analytics for a user
 */
router.get('/analytics/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { timeRange = 7 } = req.query; // days

        const analytics = await enhancedMCA.getConversationAnalytics(userId, parseInt(timeRange));

        res.json({
            success: true,
            analytics,
            timeRange: parseInt(timeRange),
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate analytics',
            details: error.message
        });
    }
});

/**
 * GET /api/conversations/insights/:userId
 * Get AI-generated insights about user conversation patterns
 */
router.get('/insights/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 10 } = req.query;

        // Get recent conversations for insight generation
        const recentConversations = await conversationStore.searchConversations({
            userId,
            limit: parseInt(limit),
            sortBy: 'timestamp'
        });

        const insights = await generateUserInsights(recentConversations, userId);

        res.json({
            success: true,
            insights,
            basedOnConversations: recentConversations.length,
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Insights generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate insights',
            details: error.message
        });
    }
});

/**
 * GET /api/conversations/trends
 * Get system-wide conversation trends (admin endpoint)
 */
router.get('/trends', async (req, res) => {
    try {
        const { timeRange = 7, includeUserData = false } = req.query;

        // Get all conversations within time range
        const startDate = new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000);
        const conversations = await conversationStore.searchConversations({
            dateRange: { start: startDate.toISOString() },
            limit: 1000
        });

        const trends = {
            totalConversations: conversations.length,
            agentPopularity: calculateAgentPopularity(conversations),
            topDomains: getTopDomains(conversations),
            averageComplexity: calculateAverageComplexity(conversations),
            successRate: calculateSystemSuccessRate(conversations),
            performanceTrends: calculatePerformanceTrends(conversations),
            userEngagement: includeUserData ? calculateUserEngagement(conversations) : null
        };

        res.json({
            success: true,
            trends,
            timeRange: parseInt(timeRange),
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Trends calculation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate trends',
            details: error.message
        });
    }
});

// ========================================
// CONVERSATION MANAGEMENT
// ========================================

/**
 * DELETE /api/conversations/:id
 * Delete a specific conversation
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await conversationStore.deleteConversation(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        res.json({
            success: true,
            message: 'Conversation deleted successfully',
            deletedId: id
        });

    } catch (error) {
        console.error('Delete conversation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete conversation',
            details: error.message
        });
    }
});

/**
 * DELETE /api/conversations/user/:userId
 * Delete all conversations for a user (privacy compliance)
 */
router.delete('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { confirm } = req.query;

        if (confirm !== 'true') {
            return res.status(400).json({
                success: false,
                error: 'Confirmation required. Add ?confirm=true to proceed.'
            });
        }

        const deletedCount = await conversationStore.deleteUserConversations(userId);

        res.json({
            success: true,
            message: `All conversations deleted for user ${userId}`,
            deletedCount
        });

    } catch (error) {
        console.error('Delete user conversations error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user conversations',
            details: error.message
        });
    }
});

// ========================================
// SYSTEM MAINTENANCE
// ========================================

/**
 * POST /api/conversations/maintenance/optimize
 * Optimize conversation storage and indexes
 */
router.post('/maintenance/optimize', async (req, res) => {
    try {
        const result = await conversationStore.optimizeStorage();

        res.json({
            success: true,
            message: 'Storage optimization completed',
            optimizationResults: result
        });

    } catch (error) {
        console.error('Storage optimization error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to optimize storage',
            details: error.message
        });
    }
});

/**
 * GET /api/conversations/health
 * Check conversation store health
 */
router.get('/health', async (req, res) => {
    try {
        const health = await conversationStore.checkHealth();

        res.json({
            success: true,
            health,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            success: false,
            error: 'Health check failed',
            details: error.message
        });
    }
});

// ========================================
// HELPER FUNCTIONS
// ========================================

async function generateUserInsights(conversations, userId) {
    const insights = [];

    if (conversations.length === 0) {
        return [{
            type: 'welcome',
            message: 'Welcome! I\'m learning about your preferences as we chat.',
            confidence: 1.0
        }];
    }

    // Analyze conversation frequency
    const conversationDates = conversations.map(c => new Date(c.timestamp));
    const daysBetween = conversations.length > 1 ? 
        (conversationDates[0] - conversationDates[conversationDates.length - 1]) / (1000 * 60 * 60 * 24) : 0;

    if (daysBetween > 0 && conversations.length / daysBetween > 1) {
        insights.push({
            type: 'engagement',
            message: 'You\'ve been quite active lately! I\'m getting better at understanding your needs.',
            confidence: 0.8
        });
    }

    // Analyze agent preferences
    const agentUsage = {};
    conversations.forEach(conv => {
        agentUsage[conv.agentType] = (agentUsage[conv.agentType] || 0) + 1;
    });

    const preferredAgent = Object.entries(agentUsage).sort(([,a], [,b]) => b - a)[0];
    if (preferredAgent && preferredAgent[1] > conversations.length * 0.5) {
        const agentNames = {
            'NPA': 'nutrition guidance',
            'WPA': 'fitness coaching',
            'BMA': 'budget management',
            'MCA': 'general assistance'
        };
        insights.push({
            type: 'preference',
            message: `I notice you frequently seek ${agentNames[preferredAgent[0]] || 'specialized help'}. I'm optimizing my responses for this area.`,
            confidence: 0.7
        });
    }

    // Analyze improvement trends
    const recentSuccess = conversations.slice(0, 5).filter(c => c.response?.success).length;
    const olderSuccess = conversations.slice(-5).filter(c => c.response?.success).length;

    if (recentSuccess > olderSuccess) {
        insights.push({
            type: 'improvement',
            message: 'My responses have been getting better! I\'m learning from our interactions.',
            confidence: 0.6
        });
    }

    // Analyze complexity trends
    const averageComplexity = conversations.reduce((sum, conv) => 
        sum + (conv.request?.complexity || 0), 0) / conversations.length;

    if (averageComplexity > 7) {
        insights.push({
            type: 'complexity',
            message: 'You often ask sophisticated questions. I\'m enhancing my analytical capabilities to serve you better.',
            confidence: 0.8
        });
    }

    return insights;
}

function calculateAgentPopularity(conversations) {
    const popularity = {};
    conversations.forEach(conv => {
        popularity[conv.agentType] = (popularity[conv.agentType] || 0) + 1;
    });

    const total = conversations.length;
    Object.keys(popularity).forEach(agent => {
        popularity[agent] = {
            count: popularity[agent],
            percentage: (popularity[agent] / total * 100).toFixed(1)
        };
    });

    return popularity;
}

function getTopDomains(conversations) {
    const domains = {};
    conversations.forEach(conv => {
        const domain = conv.request?.domain || 'unknown';
        domains[domain] = (domains[domain] || 0) + 1;
    });

    return Object.entries(domains)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([domain, count]) => ({ domain, count }));
}

function calculateAverageComplexity(conversations) {
    if (conversations.length === 0) return 0;
    
    const totalComplexity = conversations.reduce((sum, conv) => 
        sum + (conv.request?.complexity || 0), 0);
    
    return (totalComplexity / conversations.length).toFixed(2);
}

function calculateSystemSuccessRate(conversations) {
    if (conversations.length === 0) return 0;
    
    const successfulConversations = conversations.filter(conv => conv.response?.success);
    return ((successfulConversations.length / conversations.length) * 100).toFixed(1);
}

function calculatePerformanceTrends(conversations) {
    if (conversations.length === 0) return {};
    
    const totalResponseTime = conversations.reduce((sum, conv) => 
        sum + (conv.performance?.totalTime || 0), 0);
    
    const averageConfidence = conversations.reduce((sum, conv) => 
        sum + (conv.response?.confidence || 0), 0) / conversations.length;
    
    return {
        averageResponseTime: (totalResponseTime / conversations.length).toFixed(2),
        averageConfidence: averageConfidence.toFixed(3)
    };
}

function calculateUserEngagement(conversations) {
    const userActivity = {};
    conversations.forEach(conv => {
        if (!userActivity[conv.userId]) {
            userActivity[conv.userId] = {
                totalConversations: 0,
                lastActivity: null,
                averageComplexity: 0
            };
        }
        
        userActivity[conv.userId].totalConversations++;
        if (!userActivity[conv.userId].lastActivity || conv.timestamp > userActivity[conv.userId].lastActivity) {
            userActivity[conv.userId].lastActivity = conv.timestamp;
        }
    });
    
    const totalUsers = Object.keys(userActivity).length;
    const averageConversationsPerUser = conversations.length / totalUsers;
    
    return {
        totalUniqueUsers: totalUsers,
        averageConversationsPerUser: averageConversationsPerUser.toFixed(1),
        mostActiveUser: Object.entries(userActivity)
            .sort(([,a], [,b]) => b.totalConversations - a.totalConversations)[0]?.[0] || 'none'
    };
}

module.exports = router;