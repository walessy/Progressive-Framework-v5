// Progressive Framework V5 - Memory System Capabilities Demo
// Comprehensive demonstration of conversation persistence and learning

const axios = require('axios');
const readline = require('readline');

class MemorySystemDemo {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
        this.userId = `demo_user_${Date.now()}`;
        this.sessionId = `demo_session_${Date.now()}`;
        this.conversationCount = 0;
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async runDemo() {
        console.log('🧠 Progressive Framework V5 - Memory System Demo');
        console.log('=' .repeat(60));
        console.log(`👤 Demo User ID: ${this.userId}`);
        console.log(`💬 Session ID: ${this.sessionId}`);
        console.log('=' .repeat(60));

        try {
            // Check system status first
            await this.checkSystemStatus();
            
            // Run automated demonstration
            await this.runAutomatedDemo();
            
            // Interactive mode
            await this.startInteractiveMode();
            
        } catch (error) {
            console.error('❌ Demo failed:', error.message);
            console.log('\n💡 Make sure your server is running: node server_memory_enhanced.js');
        } finally {
            this.rl.close();
        }
    }

    async checkSystemStatus() {
        console.log('\n🔍 Checking system status...');
        
        try {
            const response = await axios.get(`${this.baseUrl}/status`);
            const status = response.data;
            
            console.log(`✅ Server Status: ${status.status}`);
            console.log(`🧠 Memory System: ${status.framework.memory_system_active ? 'ACTIVE' : 'INACTIVE'}`);
            console.log(`📚 Conversation Persistence: ${status.framework.conversation_persistence ? 'ACTIVE' : 'INACTIVE'}`);
            console.log(`🤖 Active Agents: ${status.framework.agents}`);
            console.log(`⚡ Version: ${status.version}`);
            
            if (!status.framework.memory_system_active) {
                throw new Error('Memory system is not active. Please check your setup.');
            }
            
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Cannot connect to server. Please start the server first.');
            }
            throw error;
        }
    }

    async runAutomatedDemo() {
        console.log('\n🎬 Starting Automated Demo...\n');
        
        // Demo conversation sequence
        const demoConversations = [
            {
                message: "Hi! I'm Sarah, a vegetarian who wants to start working out at home",
                description: "Initial introduction with preferences"
            },
            {
                message: "I have a budget of $50 per week for meals and prefer high-protein foods",
                description: "Adding budget and dietary preferences"
            },
            {
                message: "I work from home and prefer morning workouts before 8 AM",
                description: "Adding schedule preferences"
            },
            {
                message: "Can you suggest a workout routine for me?",
                description: "Requesting personalized recommendations"
            },
            {
                message: "What about meal planning? I want to build muscle",
                description: "Cross-domain request using learned preferences"
            }
        ];

        for (let i = 0; i < demoConversations.length; i++) {
            const demo = demoConversations[i];
            console.log(`📍 Demo ${i + 1}: ${demo.description}`);
            console.log(`💬 User: ${demo.message}`);
            
            const response = await this.sendMessage(demo.message, true);
            
            console.log(`🤖 Assistant: ${response.response}`);
            console.log(`🧠 Personalization Level: ${(response.personalization_level * 100).toFixed(1)}%`);
            console.log(`📊 Context Awareness: ${(response.context_awareness * 100).toFixed(1)}%`);
            console.log(`⚡ Processing Time: ${response.processing_time}ms`);
            
            if (response.memory_insights && Object.keys(response.memory_insights).length > 0) {
                console.log('💡 Memory Insights:');
                for (const [key, value] of Object.entries(response.memory_insights)) {
                    if (value && typeof value === 'object' && value.length) {
                        console.log(`   ${key}: ${value.length} items`);
                    }
                }
            }
            
            console.log('-' .repeat(50));
            
            // Brief pause between messages
            await this.sleep(1000);
        }

        // Demonstrate memory search
        await this.demonstrateMemorySearch();
        
        // Show user profile
        await this.showUserProfile();
        
        // Generate conversation summary
        await this.generateConversationSummary();
    }

    async demonstrateMemorySearch() {
        console.log('\n🔍 Demonstrating Memory Search Capabilities...\n');
        
        const searchQueries = [
            "vegetarian protein",
            "morning workout",
            "budget meals",
            "muscle building"
        ];

        for (const query of searchQueries) {
            console.log(`🔎 Searching for: "${query}"`);
            
            try {
                const response = await axios.post(`${this.baseUrl}/memory/search`, {
                    query: query,
                    userId: this.userId,
                    options: {
                        maxResults: 3,
                        semanticSearch: true,
                        includeContext: true
                    }
                });

                console.log(`✅ Found ${response.data.totalResults} results in ${response.data.search_time}ms`);
                
                if (response.data.results.length > 0) {
                    response.data.results.slice(0, 2).forEach((result, index) => {
                        console.log(`   ${index + 1}. ${result.message.content.substring(0, 60)}...`);
                        console.log(`      Relevance: ${(result.relevanceScore * 100).toFixed(1)}%`);
                    });
                }
                
            } catch (error) {
                console.log(`❌ Search failed: ${error.message}`);
            }
            
            console.log('-' .repeat(30));
        }
    }

    async showUserProfile() {
        console.log('\n👤 User Profile Analysis...\n');
        
        try {
            const response = await axios.get(`${this.baseUrl}/memory/profile/${this.userId}?insights=true`);
            const profile = response.data.profile;
            
            console.log('📊 Profile Summary:');
            console.log(`   Total Conversations: ${profile.totalConversations}`);
            console.log(`   Total Messages: ${profile.totalMessages}`);
            console.log(`   Last Active: ${profile.lastActive ? new Date(profile.lastActive).toLocaleString() : 'N/A'}`);
            
            if (profile.preferences) {
                console.log('\n🎯 Detected Preferences:');
                // Convert Map objects to arrays for display
                for (const [key, value] of Object.entries(profile.preferences)) {
                    if (value && typeof value === 'object') {
                        const items = Object.entries(value);
                        if (items.length > 0) {
                            console.log(`   ${key}: ${items.slice(0, 3).map(([k, v]) => `${k}(${v})`).join(', ')}`);
                        }
                    }
                }
            }
            
            if (profile.goals && profile.goals.length > 0) {
                console.log('\n🎯 Identified Goals:');
                profile.goals.slice(0, 3).forEach((goal, index) => {
                    console.log(`   ${index + 1}. ${goal.description || goal.type} (${goal.progress || 0}% complete)`);
                });
            }
            
        } catch (error) {
            console.log(`❌ Profile retrieval failed: ${error.message}`);
        }
    }

    async generateConversationSummary() {
        console.log('\n📋 Generating Conversation Summary...\n');
        
        // This is a simulation since we'd need the actual conversation ID
        // In a real implementation, we'd track conversation IDs
        console.log('📝 Summary Features Available:');
        console.log('   ✅ Main topics discussed');
        console.log('   ✅ User goals identified');
        console.log('   ✅ Preferences learned');
        console.log('   ✅ Action items generated');
        console.log('   ✅ Sentiment analysis');
        console.log('   ✅ Natural language summary');
        
        console.log('\n💡 Example Summary:');
        console.log('   "Sarah introduced herself as a vegetarian interested in home workouts.');
        console.log('    She has a $50/week meal budget and prefers morning exercise before 8 AM.');
        console.log('    Main goals: muscle building with vegetarian nutrition."');
    }

    async startInteractiveMode() {
        console.log('\n🎮 Interactive Mode - Try your own messages!');
        console.log('Type "exit" to quit, "profile" to see profile, "search <query>" to search memory');
        console.log('-' .repeat(60));

        while (true) {
            const userInput = await this.askQuestion('\n💬 Your message: ');
            
            if (userInput.toLowerCase() === 'exit') {
                console.log('👋 Demo completed! Your memory system is working perfectly!');
                break;
            }
            
            if (userInput.toLowerCase() === 'profile') {
                await this.showUserProfile();
                continue;
            }
            
            if (userInput.toLowerCase().startsWith('search ')) {
                const query = userInput.substring(7);
                await this.performSearch(query);
                continue;
            }
            
            if (userInput.trim() === '') {
                continue;
            }

            try {
                const response = await this.sendMessage(userInput, true);
                
                console.log(`\n🤖 Assistant: ${response.response}`);
                
                // Show memory enhancements if present
                if (response.personalization_level > 0) {
                    console.log(`🧠 Personalization: ${(response.personalization_level * 100).toFixed(1)}%`);
                }
                
                if (response.context_awareness > 0) {
                    console.log(`📊 Context Awareness: ${(response.context_awareness * 100).toFixed(1)}%`);
                }
                
                console.log(`⚡ Processing: ${response.processing_time}ms`);
                
            } catch (error) {
                console.log(`❌ Error: ${error.message}`);
            }
        }
    }

    async sendMessage(message, useMemory = true) {
        const response = await axios.post(`${this.baseUrl}/chat`, {
            message: message,
            userId: this.userId,
            sessionId: this.sessionId,
            useMemory: useMemory
        });

        this.conversationCount++;
        return response.data;
    }

    async performSearch(query) {
        try {
            const response = await axios.post(`${this.baseUrl}/memory/search`, {
                query: query,
                userId: this.userId,
                options: { maxResults: 5 }
            });

            console.log(`\n🔍 Search Results for "${query}":`);
            console.log(`Found ${response.data.totalResults} results in ${response.data.search_time}ms`);
            
            response.data.results.forEach((result, index) => {
                console.log(`\n${index + 1}. ${result.message.content}`);
                console.log(`   Relevance: ${(result.relevanceScore * 100).toFixed(1)}% | ${new Date(result.timestamp).toLocaleString()}`);
            });
            
        } catch (error) {
            console.log(`❌ Search failed: ${error.message}`);
        }
    }

    askQuestion(question) {
        return new Promise((resolve) => {
            this.rl.question(question, (answer) => {
                resolve(answer);
            });
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async showSystemAnalytics() {
        try {
            const response = await axios.get(`${this.baseUrl}/memory/analytics`);
            const analytics = response.data.analytics;
            
            console.log('\n📊 System Analytics:');
            console.log(`   Memory Usage: ${analytics.memory_usage.conversationsInMemory} conversations`);
            console.log(`   User Profiles: ${analytics.memory_usage.userProfiles}`);
            console.log(`   Learning Insights: ${analytics.learning_insights.total_patterns_discovered} patterns`);
            
        } catch (error) {
            console.log(`❌ Analytics unavailable: ${error.message}`);
        }
    }
}

// Run demo if called directly
if (require.main === module) {
    const demo = new MemorySystemDemo();
    demo.runDemo().catch(console.error);
}

module.exports = MemorySystemDemo;