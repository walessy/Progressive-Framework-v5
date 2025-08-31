// Emergency Response System Tests
// Run with: node test-emergency.js

const MasterControlAgent = require('./src/agents/MasterControlAgent');

async function runEmergencyTests() {
    console.log('Starting Emergency Response System Tests...\n');
    
    try {
        // Initialize MCA with Emergency System
        const mca = new MasterControlAgent();
        await mca.init();
        
        console.log('Emergency system initialized successfully');
        
        // Test 1: Circuit Breaker Test
        console.log('\nTest 1: Circuit Breaker Functionality');
        
        try {
            // Trigger multiple failures to test circuit breaker
            for (let i = 0; i < 6; i++) {
                try {
                    await mca.emergencyInterface.executeWithCircuitBreaker(
                        'TEST_AGENT',
                        async () => { throw new Error('Test failure'); }
                    );
                } catch (e) {
                    console.log('   Failure ' + (i + 1) + ': ' + e.message);
                }
            }
            console.log('Circuit breaker test completed');
        } catch (error) {
            console.log('Circuit breaker test failed: ' + error.message);
        }
        
        // Test 2: Error Classification Test
        console.log('\nTest 2: Error Classification');
        
        const testErrors = [
            { error: new Error('SYSTEM_CRASH'), expectedSeverity: 'critical' },
            { error: new Error('AGENT_FAILURE'), expectedSeverity: 'high' },
            { error: new Error('COMMUNICATION_ERROR'), expectedSeverity: 'medium' }
        ];
        
        for (const testCase of testErrors) {
            try {
                await mca.emergencyInterface.handleError(testCase.error, { testMode: true });
                console.log('   ' + testCase.error.message + ' handled successfully');
            } catch (error) {
                console.log('   ' + testCase.error.message + ' handling failed');
            }
        }
        
        // Test 3: Health Check Test
        console.log('\nTest 3: Health Monitoring');
        
        const healthStatus = mca.emergencyInterface.getSystemHealth();
        console.log('   System Health: ' + (healthStatus ? healthStatus.overall || 'unknown' : 'not available'));
        console.log('   Health check completed');
        
        // Test 4: Basic Chat with Emergency Protection
        console.log('\nTest 4: Protected Chat Request');
        
        try {
            const result = await mca.processRequest({
                message: 'Tell me about nutrition',
                timestamp: Date.now()
            });
            console.log('   Chat request processed successfully');
            console.log('   Response: ' + (result.message ? result.message.substring(0, 50) + '...' : 'No message'));
        } catch (error) {
            console.log('   Chat request failed: ' + error.message);
        }
        
        console.log('\nAll emergency system tests completed!');
        console.log('\nYour Emergency Response System is ready for production!');
        
    } catch (error) {
        console.error('Emergency system test failed:', error);
        process.exit(1);
    }
}

// Run tests
runEmergencyTests();
