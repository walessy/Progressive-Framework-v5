// Enhanced Main.js with Agent Collaboration
// src/main.js

const EnhancedAPIServer = require('./interfaces/api_server');

async function startProgressiveFrameworkV5() {
    console.log('🧬 Progressive Framework V5 - Master Control Agent System');
    console.log('   Starting intelligent agent orchestration platform...');
    console.log('');

    try {
    // Create enhanced API server with MCA orchestration
        const server = new EnhancedAPIServer(3000);
    
        // Start the server (this initializes all subsystems including MCA)
        await server.start();
    
        console.log('');
        console.log('🎉 Progressive Framework V5 with MCA is now LIVE!');
        console.log('');
        console.log('🚀 MASTER CONTROL AGENT FEATURES:');
        console.log('   🧠 Intelligent Request Analysis & Routing');
        console.log('   ⚖️ Dynamic Load Balancing');
        console.log('   🤝 Collaboration Orchestration');
        console.log('   📊 Real-time System Optimization');
        console.log('   🔍 Performance Monitoring');
        console.log('   🚨 High-Load Overflow Handling');
        console.log('');
        console.log('💡 TRY THESE MCA-ORCHESTRATED QUERIES:');
        console.log('   "I need a comprehensive wellness plan" (High complexity routing)');
        console.log('   "Create meal plan for strength training" (Collaborative routing)');
        console.log('   "Quick nutrition tip" (Simple routing with load balancing)');
        console.log('');
        console.log('📊 MONITOR MCA PERFORMANCE:');
        console.log('   GET http://localhost:3000/mca/status');
        console.log('   GET http://localhost:3000/mca/metrics');
        console.log('   POST http://localhost:3000/mca/optimize');
        console.log('');

        // Graceful shutdown handling
        process.on('SIGINT', async () => {
            console.log('\n🛑 Shutting down Progressive Framework V5 with MCA...');
            await server.stop();
            console.log('✅ Server stopped gracefully');
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            console.log('\n🛑 Received SIGTERM, shutting down...');
            await server.stop();
            process.exit(0);
        });

        // Optional: Set up periodic cleanup and optimization checks
        setInterval(async () => {
            try {
                await server.conversationManager.cleanup();
                // MCA handles its own optimization triggers automatically
            } catch (error) {
                console.error('⚠️ Cleanup error:', error);
            }
        }, 60 * 60 * 1000); // Every hour

    } catch (error) {
        console.error('❌ Failed to start Progressive Framework V5 with MCA:', error);
        process.exit(1);
    }
}

// Start the system
startProgressiveFrameworkV5().catch(error => {
    console.error('💥 Fatal startup error:', error);
    process.exit(1);
});

module.exports = { startProgressiveFrameworkV5 };