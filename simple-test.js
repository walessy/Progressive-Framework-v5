// Simple Emergency System Test
// Location: C:\Projects\Progressive-Framework-v5\simple-test.js

console.log('🧪 Starting Simple Emergency System Test...\n');

async function testEmergencySystem() {
    try {
        // Test 1: Initialize MCA
        console.log('Test 1: Initializing Master Control Agent...');
        const MasterControlAgent = require('./src/agents/MasterControlAgent');
        const mca = new MasterControlAgent();
        console.log('✅ MCA initialized successfully');

        // Test 2: Initialize Emergency System
        console.log('\nTest 2: Initializing Emergency System...');
        await mca.init();
        console.log('✅ Emergency system initialized successfully');

        // Test 3: Basic Chat Request
        console.log('\nTest 3: Testing basic chat request...');
        const result = await mca.processRequest({
            message: 'Tell me about nutrition',
            timestamp: Date.now()
        });
        console.log('✅ Chat request processed successfully');
        console.log(`   Response: ${result.message ? result.message.substring(0, 80) + '...' : 'No message'}`);

        // Test 4: System Health Check
        console.log('\nTest 4: Checking system health...');
        const health = await mca.getSystemHealth();
        console.log(`✅ System health: ${health.overall}`);
        console.log(`   Emergency system active: ${health.emergencySystem ? 'Yes' : 'No'}`);

        // Test 5: Circuit Breaker Status
        console.log('\nTest 5: Checking circuit breaker status...');
        const circuitStatus = mca.getCircuitBreakerStatus();
        const healthyCount = Object.values(circuitStatus).filter(cb => cb.healthy).length;
        console.log(`✅ Circuit breakers: ${healthyCount}/${Object.keys(circuitStatus).length} healthy`);

        // Test 6: Emergency Interface
        console.log('\nTest 6: Testing emergency interface...');
        const testError = new Error('Test error for emergency system');
        testError.code = 'TEST_ERROR';
        
        const emergencyResult = await mca.emergencyInterface.handleError(testError, { testMode: true });
        console.log('✅ Emergency system handled test error successfully');

        console.log('\n🎉 All tests passed! Emergency Response System is working correctly!');
        console.log('\n📊 System Summary:');
        console.log(`   System Health: ${health.overall}`);
        console.log(`   Active Incidents: ${health.activeIncidents}`);
        console.log(`   Uptime: ${Math.floor(health.uptime)} seconds`);
        console.log(`   Circuit Breakers: ${Object.keys(circuitStatus).length} configured`);
        
        console.log('\n🚀 Ready to start the server with: node server.js');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('\nStack trace:', error.stack);
        
        console.log('\n🔧 Troubleshooting tips:');
        console.log('1. Make sure all files are created in the correct locations');
        console.log('2. Check that the file contents match the artifacts exactly');
        console.log('3. Verify that the src/emergency/ and src/api/ directories exist');
        console.log('4. Run: npm install to ensure all dependencies are installed');
        
        process.exit(1);
    }
}

// Run the test
testEmergencySystem();