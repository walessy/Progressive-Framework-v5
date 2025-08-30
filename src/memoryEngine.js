// Progressive Framework V5 - Memory System Integration
const fs = require('fs').promises;
const path = require('path');

class MemoryEngine {
    constructor() {
        this.memoryFile = path.join(__dirname, '../data/userMemory.json');
        this.userProfiles = new Map();
        this.initializeMemorySystem();
    }

    async initializeMemorySystem() {
        try {
            await fs.mkdir(path.dirname(this.memoryFile), { recursive: true });
            await this.loadMemoryFromDisk();
            console.log('🧠 Memory Engine initialized successfully');
        } catch (error) {
            console.log('🧠 Memory Engine: Starting with fresh memory');
            this.userProfiles = new Map();
        }
    }

    async loadMemoryFromDisk() {
        try {
            const data = await fs.readFile(this.memoryFile, 'utf8');
            const memoryData = JSON.parse(data);
            Object.entries(memoryData).forEach(([userId, profile]) => {
                this.userProfiles.set(userId, profile);
            });
            console.log(`🧠 Loaded memory for ${this.userProfiles.size} users`);
        } catch (error) {
            console.log('🧠 No existing memory file found - starting fresh');
        }
    }

    async saveMemoryToDisk() {
        try {
            const memoryData = Object.fromEntries(this.userProfiles);
            await fs.writeFile(this.memoryFile, JSON.stringify(memoryData, null, 2));
            console.log('💾 Memory saved to disk');
        } catch (error) {
            console.error('❌ Failed to save memory:', error);
        }
    }

    learnFromInteraction(userId, query, response, agentType) {
        if (!this.userProfiles.has(userId)) {
            this.initializeUserProfile(userId);
        }

        const userProfile = this.userProfiles.get(userId);
        const learningData = this.extractLearningData(query);

        Object.assign(userProfile.preferences, learningData);

        userProfile.interactions.push({
            timestamp: new Date().toISOString(),
            query: query,
            response: response,
            agent: agentType,
            learned: learningData
        });

        if (userProfile.interactions.length > 50) {
            userProfile.interactions = userProfile.interactions.slice(-50);
        }

        this.updateUserPatterns(userId);

        if (userProfile.interactions.length % 5 === 0) {
            this.saveMemoryToDisk();
        }

        console.log(`🧠 Learned ${Object.keys(learningData).length} new preferences for user ${userId}`);
        return learningData;
    }

    initializeUserProfile(userId) {
        this.userProfiles.set(userId, {
            id: userId,
            created: new Date().toISOString(),
            preferences: {},
            interactions: [],
            patterns: {},
            goals: {},
            personalizationLevel: 0
        });
    }

    extractLearningData(query) {
        const queryLower = query.toLowerCase();
        const learned = {};

        if (queryLower.includes('vegetarian')) learned.diet = 'vegetarian';
        if (queryLower.includes('vegan')) learned.diet = 'vegan';
        if (queryLower.includes('keto')) learned.diet = 'keto';
        if (queryLower.includes('home workout')) learned.workout_location = 'home';
        if (queryLower.includes('gym')) learned.workout_location = 'gym';
        if (queryLower.includes('quick') || queryLower.includes('short')) learned.time_preference = 'quick';
        if (queryLower.includes('lose weight')) learned.fitness_goal = 'weight_loss';
        if (queryLower.includes('build muscle')) learned.fitness_goal = 'muscle_gain';
        if (queryLower.includes('strength')) learned.workout_focus = 'strength';
        if (queryLower.includes('budget') || queryLower.includes('cheap')) learned.budget_conscious = true;
        if (queryLower.includes('premium')) learned.premium_preference = true;

        return learned;
    }

    updateUserPatterns(userId) {
        const userProfile = this.userProfiles.get(userId);
        const interactions = userProfile.interactions;

        const agentCounts = interactions.reduce((acc, int) => {
            acc[int.agent] = (acc[int.agent] || 0) + 1;
            return acc;
        }, {});

        if (Object.keys(agentCounts).length > 0) {
            userProfile.patterns.preferred_agent = Object.entries(agentCounts)
                .sort(([,a], [,b]) => b - a)[0][0];
        }

        const prefCount = Object.keys(userProfile.preferences).length;
        const interactionCount = interactions.length;
        userProfile.personalizationLevel = Math.min(prefCount * 0.2 + interactionCount * 0.05, 1.0);
    }

    getPersonalizedContext(userId) {
        if (!this.userProfiles.has(userId)) {
            return {
                user_preferences: {},
                personalization_level: 0,
                interaction_count: 0,
                patterns: {},
                is_new_user: true
            };
        }

        const userProfile = this.userProfiles.get(userId);
        return {
            user_preferences: userProfile.preferences,
            personalization_level: userProfile.personalizationLevel,
            interaction_count: userProfile.interactions.length,
            patterns: userProfile.patterns,
            recent_interactions: userProfile.interactions.slice(-3),
            is_new_user: false
        };
    }

    enhanceResponseWithMemory(baseResponse, userId, agentType) {
        const context = this.getPersonalizedContext(userId);
        const prefs = context.user_preferences;

        if (context.personalization_level === 0) {
            return baseResponse;
        }

        const personalizedTags = [];
        if (prefs.diet) personalizedTags.push(`${prefs.diet} optimized`);
        if (prefs.workout_location === 'home') personalizedTags.push('home-friendly');
        if (prefs.fitness_goal) personalizedTags.push(`${prefs.fitness_goal.replace('_', ' ')} focused`);
        if (prefs.budget_conscious) personalizedTags.push('budget-conscious');

        let enhancement = '';
        if (personalizedTags.length > 0) {
            enhancement = `\n\n💡 **Personalized**: ${personalizedTags.join(', ')} | `;
            enhancement += `${Math.round(context.personalization_level * 100)}% personalized`;
        }

        return baseResponse + enhancement;
    }

    getMemoryStats() {
        const stats = {
            total_users: this.userProfiles.size,
            total_interactions: 0,
            average_personalization: 0
        };

        let totalPersonalization = 0;
        for (const [userId, profile] of this.userProfiles) {
            stats.total_interactions += profile.interactions.length;
            totalPersonalization += profile.personalizationLevel;
        }

        stats.average_personalization = stats.total_users > 0 ? 
            totalPersonalization / stats.total_users : 0;

        return stats;
    }
}

module.exports = MemoryEngine;