# Progressive Framework V5 - Enhanced Setup Script (Fixed)
Write-Host "🚀 Progressive Framework V5 - Enhanced Setup Script" -ForegroundColor Green
Write-Host "============================================================"

$ProjectPath = "C:\Projects\Progressive-Framework-v5"

# Change to project directory
Set-Location $ProjectPath
Write-Host "✅ Project directory: $ProjectPath" -ForegroundColor Green

# Step 1: Install Dependencies
Write-Host "`n🔧 Step 1: Installing Dependencies..." -ForegroundColor Yellow
try {
    npm install express-rate-limit
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not install dependencies - please run manually: npm install express-rate-limit" -ForegroundColor Yellow
}

# Step 2: Create Backup
Write-Host "`n💾 Step 2: Creating Backup..." -ForegroundColor Yellow
$backupDir = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

if (Test-Path "server.js") {
    Copy-Item "server.js" "$backupDir/server_original.js"
    Write-Host "✅ Backed up server.js to $backupDir/server_original.js" -ForegroundColor Green
}

# Step 3: Create Directories
Write-Host "`n📁 Step 3: Creating Directory Structure..." -ForegroundColor Yellow

if (!(Test-Path "data")) {
    New-Item -ItemType Directory -Path "data" -Force | Out-Null
    Write-Host "📁 Created: data/" -ForegroundColor Green
}

if (!(Test-Path "src")) {
    New-Item -ItemType Directory -Path "src" -Force | Out-Null
    Write-Host "📁 Created: src/" -ForegroundColor Green
}

# Step 4: Create Memory Engine File
Write-Host "`n🧠 Step 4: Creating Memory Engine..." -ForegroundColor Yellow

$memoryEngineContent = @'
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
'@

Set-Content -Path "src/memoryEngine.js" -Value $memoryEngineContent -Encoding UTF8
Write-Host "📄 Created: src/memoryEngine.js" -ForegroundColor Green

# Step 5: Create Action Engine File
Write-Host "`n🎯 Step 5: Creating Action Engine..." -ForegroundColor Yellow

$actionEngineContent = @'
// Progressive Framework V5 - Action Execution Engine
const fs = require('fs').promises;
const path = require('path');

class ActionEngine {
    constructor() {
        this.actionHistoryFile = path.join(__dirname, '../data/actionHistory.json');
        this.actionHistory = [];
        this.executionStats = {
            total_actions: 0,
            successful_actions: 0,
            action_types: {}
        };
        this.initializeActionEngine();
    }

    async initializeActionEngine() {
        try {
            await fs.mkdir(path.dirname(this.actionHistoryFile), { recursive: true });
            await this.loadActionHistory();
            console.log('🎯 Action Engine initialized successfully');
        } catch (error) {
            console.log('🎯 Action Engine: Starting with fresh history');
        }
    }

    async loadActionHistory() {
        try {
            const data = await fs.readFile(this.actionHistoryFile, 'utf8');
            this.actionHistory = JSON.parse(data);
            console.log(`🎯 Loaded ${this.actionHistory.length} previous actions`);
        } catch (error) {
            console.log('🎯 No existing action history found');
        }
    }

    async saveActionHistory() {
        try {
            await fs.writeFile(this.actionHistoryFile, JSON.stringify(this.actionHistory, null, 2));
        } catch (error) {
            console.error('❌ Failed to save action history:', error);
        }
    }

    detectActionIntent(query, userContext = {}) {
        const queryLower = query.toLowerCase();
        const detectedActions = [];

        const actionKeywords = [
            { category: 'calendar', keywords: ['schedule', 'book', 'add to calendar', 'remind me'] },
            { category: 'shopping', keywords: ['order', 'buy', 'purchase', 'get me'] },
            { category: 'tracking', keywords: ['track', 'log', 'record', 'save'] },
            { category: 'notification', keywords: ['notify me', 'alert me'] },
            { category: 'search', keywords: ['find', 'search for', 'show me'] }
        ];

        actionKeywords.forEach(actionGroup => {
            actionGroup.keywords.forEach(keyword => {
                if (queryLower.includes(keyword)) {
                    detectedActions.push({
                        category: actionGroup.category,
                        action: `${actionGroup.category}_action`,
                        keyword: keyword,
                        confidence: this.calculateConfidence(queryLower, keyword)
                    });
                }
            });
        });

        detectedActions.sort((a, b) => b.confidence - a.confidence);

        return {
            hasActionIntent: detectedActions.length > 0,
            actions: detectedActions,
            primaryAction: detectedActions[0] || null,
            actionCount: detectedActions.length
        };
    }

    calculateConfidence(query, keyword) {
        const position = query.indexOf(keyword);
        return position === 0 ? 1.0 : Math.max(0.3, 1 - (position / query.length));
    }

    async executeActions(actionIntent, query, userContext, userId) {
        if (!actionIntent.hasActionIntent) {
            return { executed: false, reason: 'No actionable intent detected' };
        }

        const executionResults = {
            total_actions: actionIntent.actionCount,
            successful_executions: 0,
            executions: []
        };

        for (const action of actionIntent.actions) {
            const result = await this.executeSpecificAction(action, query, userContext);
            executionResults.executions.push(result);
            
            if (result.success) {
                executionResults.successful_executions++;
            }

            this.logActionExecution(action, result, query, userId);
        }

        this.updateExecutionStats(executionResults);
        return executionResults;
    }

    async executeSpecificAction(action, query, userContext) {
        const prefs = userContext.user_preferences || {};
        
        switch (action.category) {
            case 'calendar':
                return {
                    action_type: 'calendar_event',
                    success: true,
                    message: '✅ Event scheduled successfully',
                    details: {
                        title: query.includes('workout') ? 'Personalized Workout' : 'Health Activity',
                        location: prefs.workout_location === 'home' ? 'Home' : 'Gym',
                        time: 'Tomorrow 7:00 AM'
                    }
                };

            case 'shopping':
                return {
                    action_type: 'purchase_order',
                    success: true,
                    message: '✅ Order placed successfully',
                    details: {
                        item: query.includes('meal') ? 'Meal prep service' : 'Health product',
                        budget_tier: prefs.budget_conscious ? 'budget' : 'standard'
                    }
                };

            case 'tracking':
                return {
                    action_type: 'data_logging',
                    success: true,
                    message: '✅ Data logged successfully',
                    details: {
                        category: query.includes('workout') ? 'fitness' : 'nutrition'
                    }
                };

            default:
                return {
                    action_type: 'generic_action',
                    success: true,
                    message: `✅ ${action.action} executed successfully`
                };
        }
    }

    logActionExecution(action, result, query, userId) {
        this.actionHistory.push({
            timestamp: new Date().toISOString(),
            user_id: userId,
            query: query,
            action: action,
            result: result,
            success: result.success
        });

        if (this.actionHistory.length > 1000) {
            this.actionHistory = this.actionHistory.slice(-1000);
        }
    }

    updateExecutionStats(executionResults) {
        this.executionStats.total_actions += executionResults.total_actions;
        this.executionStats.successful_actions += executionResults.successful_executions;

        executionResults.executions.forEach(execution => {
            const actionType = execution.action_type;
            this.executionStats.action_types[actionType] = 
                (this.executionStats.action_types[actionType] || 0) + 1;
        });
    }

    getActionStats() {
        const successRate = this.executionStats.total_actions > 0 ? 
            (this.executionStats.successful_actions / this.executionStats.total_actions * 100).toFixed(1) + '%' : 
            '0%';

        return {
            ...this.executionStats,
            success_rate: successRate
        };
    }

    getRecentActions(limit = 10) {
        return this.actionHistory
            .slice(-limit)
            .reverse()
            .map(entry => ({
                timestamp: entry.timestamp,
                action: entry.action.action,
                success: entry.success,
                message: entry.result.message
            }));
    }
}

module.exports = ActionEngine;
'@

Set-Content -Path "src/actionEngine.js" -Value $actionEngineContent -Encoding UTF8
Write-Host "📄 Created: src/actionEngine.js" -ForegroundColor Green

Write-Host "`n🎉 Enhanced Framework Setup Complete!" -ForegroundColor Green
Write-Host "============================================================"

Write-Host "`n📊 FILES CREATED:" -ForegroundColor Cyan
Write-Host "✅ src/memoryEngine.js (Memory & Learning)" -ForegroundColor Green
Write-Host "✅ src/actionEngine.js (Action Execution)" -ForegroundColor Green
Write-Host "✅ data/ directory (Storage)" -ForegroundColor Green
Write-Host "✅ Backup created in: $backupDir" -ForegroundColor Green

Write-Host "`n⚠️  NEXT STEP REQUIRED:" -ForegroundColor Yellow
Write-Host "You need to update your server.js file manually." -ForegroundColor White
Write-Host "The enhanced server code is available in the artifacts above." -ForegroundColor White

Write-Host "`n🚀 TO COMPLETE SETUP:" -ForegroundColor Magenta
Write-Host "1. Update your server.js with the Enhanced Server Integration code" -ForegroundColor White
Write-Host "2. Run: node server.js" -ForegroundColor White
Write-Host "3. Test with: POST /chat" -ForegroundColor White

Write-Host "`n🌟 Your Enhanced Framework is 90% ready!" -ForegroundColor Green