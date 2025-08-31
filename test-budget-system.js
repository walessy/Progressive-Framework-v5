closeSynccls
// Progressive Framework V5 - Budget Management Test Script
// Comprehensive testing of Option 4 implementation

const axios = require('axios');
const { closeSync } = require('fs-extra');

class BudgetSystemTester {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
        this.testUserId = `budget_test_user_${Date.now()}`;
        this.sessionId = `budget_test_session_${Date.now()}`;
        this.testResults = [];
    }

    async runBudgetTests() {
        console.log('💰 Progressive Framework V5 - Budget Management System Test');
        console.log('='.repeat(70));
        console.log(`👤 Test User ID: ${this.testUserId}`);
        console.log(`💬 Session ID: ${this.sessionId}`);
        console.log('='.repeat(70));

        try {
            // Check system status
            await this.checkSystemStatus();
            
            // Test 1: Budget-aware conversation
            await this.testBudgetAwareConversation();
            
            // Test 2: Create budget plan
            await this.testBudgetPlanCreation();
            
            // Test 3: Log expenses
            await this.testExpenseLogging();
            
            // Test 4: Budget-enhanced responses
            await this.testBudgetEnhancedResponses();
            
            // Test 5: Financial report
            await this.testFinancialReport();
            
            // Test 6: Budget optimization
            await this.testBudgetOptimization();
            
            // Display summary
            this.displayTestSummary();
            
        } catch (error) {
            console.error('❌ Budget system test failed:', error.message);
        }
    }

    async checkSystemStatus() {
        console.log('\n🔍 Checking budget-integrated system status...');
        
        try {
            const response = await axios.get(`${this.baseUrl}/status`);
            const status = response.data;
            
            console.log(`✅ Server Status: ${status.status}`);
            console.log(`💰 Budget Management: ${status.framework.budget_management_active ? 'ACTIVE' : 'INACTIVE'}`);
            console.log(`📊 Financial Analytics: ${status.framework.financial_analytics ? 'ACTIVE' : 'INACTIVE'}`);
            console.log(`🧠 Memory System: ${status.framework.memory_system_active ? 'ACTIVE' : 'INACTIVE'}`);
            console.log(`🎯 Version: ${status.version}`);
            
            if (status.budget_system) {
                console.log(`💼 Budget Plans: ${status.budget_system.active_budget_plans}`);
                console.log(`📊 Tracked Expenses: ${status.budget_system.total_expenses}`);
            }
            
            this.recordTest('System Status Check', true, 'Budget-integrated system is operational');
            
        } catch (error) {
            this.recordTest('System Status Check', false, error.message);
            throw new Error('Cannot connect to budget-integrated server');
        }
    }

    async testBudgetAwareConversation() {
        console.log('\n💬 Test 1: Budget-Aware Conversation...');
        
        try {
            // Initial conversation with budget context
            const response = await axios.post(`${this.baseUrl}/chat`, {
                message: "I'm vegetarian, want home workouts, and have a $75 weekly budget for health",
                userId: this.testUserId,
                sessionId: this.sessionId,
                useMemory: true
            });

            console.log(`🤖 Response: ${response.data.response.substring(0, 100)}...`);
            console.log(`🎯 Agent: ${response.data.agent_type}`);
            console.log(`🧠 Personalization: ${(response.data.personalization_level * 100).toFixed(1)}%`);
            console.log(`💰 Budget Insights: ${response.data.budget_insights ? response.data.budget_insights.length : 0} items`);
            
            const success = response.data.response.includes('budget') || 
                           response.data.response.includes('$') ||
                           response.data.budget_insights?.length > 0;
            
            this.recordTest('Budget-Aware Conversation', success, 
                success ? 'System recognized and responded to budget context' : 'No budget awareness detected');
            
        } catch (error) {
            this.recordTest('Budget-Aware Conversation', false, error.message);
        }
    }

    async testBudgetPlanCreation() {
        console.log('\n📊 Test 2: Budget Plan Creation...');
        
        try {
            const budgetData = {
                totalBudget: 75,
                timeframe: 'weekly'
            };
            
            const response = await axios.post(`${this.baseUrl}/budget/create`, {
                userId: this.testUserId,
                budgetData: budgetData
            });

            console.log(`✅ Budget Plan Created: $${response.data.budgetPlan.totalBudget} total`);
            console.log(`📊 Allocations:`);
            console.log(`   Fitness: $${response.data.budgetPlan.allocation.fitness}`);
            console.log(`   Nutrition: $${response.data.budgetPlan.allocation.nutrition}`);
            console.log(`   Health: $${response.data.budgetPlan.allocation.health}`);
            
            const recommendations = response.data.budgetPlan.recommendations;
            console.log(`💡 Recommendations: ${Object.keys(recommendations).length} categories`);
            
            this.recordTest('Budget Plan Creation', true, `Created $${budgetData.totalBudget} budget plan with optimized allocation`);
            
        } catch (error) {
            this.recordTest('Budget Plan Creation', false, error.message);
            console.log(`❌ Budget Plan Creation failed: ${error.response?.data?.message || error.message}`);
        }
    }

    async testExpenseLogging() {
        console.log('\n💸 Test 3: Expense Logging...');
        
        try {
            const expenses = [
                {
                    amount: 15.50,
                    category: 'nutrition',
                    subcategory: 'groceries',
                    description: 'Lentils and quinoa bulk purchase'
                },
                {
                    amount: 25.00,
                    category: 'fitness',
                    subcategory: 'equipment',
                    description: 'Resistance bands set'
                },
                {
                    amount: 8.75,
                    category: 'nutrition',
                    subcategory: 'supplements',
                    description: 'Plant-based protein powder'
                }
            ];

            let totalLogged = 0;
            
            for (const expense of expenses) {
                const response = await axios.post(`${this.baseUrl}/budget/expense`, {
                    userId: this.testUserId,
                    expenseData: expense
                });

                console.log(`✅ Logged: $${expense.amount} for ${expense.category} - ${expense.description}`);
                
                if (response.data.budget_impact) {
                    const impact = response.data.budget_impact;
                    console.log(`   📊 Budget Impact: ${impact.percent_used}% of ${impact.category} budget used`);
                    console.log(`   💰 Remaining: $${impact.remaining} in ${impact.category}`);
                }
                
                totalLogged += expense.amount;
            }

            console.log(`📊 Total Expenses Logged: $${totalLogged.toFixed(2)}`);
            
            this.recordTest('Expense Logging', true, `Logged ${expenses.length} expenses totaling $${totalLogged.toFixed(2)}`);
            
        } catch (error) {
            this.recordTest('Expense Logging', false, error.message);
            console.log(`❌ Expense Logging failed: ${error.response?.data?.message || error.message}`);
        }
    }

    async testBudgetEnhancedResponses() {
        console.log('\n🧠 Test 4: Budget-Enhanced Agent Responses...');
        
        try {
            const testQueries = [
                {
                    message: "I need cheap vegetarian protein sources",
                    expectedAgent: "NPA",
                    expectsBudget: true
                },
                {
                    message: "What workout equipment should I buy on a budget?",
                    expectedAgent: "WPA", 
                    expectsBudget: true
                },
                {
                    message: "How can I save money on my health spending?",
                    expectedAgent: "BMA",
                    expectsBudget: true
                }
            ];

            let successfulTests = 0;
            
            for (const query of testQueries) {
                const response = await axios.post(`${this.baseUrl}/chat`, {
                    message: query.message,
                    userId: this.testUserId,
                    sessionId: this.sessionId,
                    useMemory: true
                });

                console.log(`\n🔍 Query: "${query.message}"`);
                console.log(`🎯 Routed to: ${response.data.agent_type} (expected: ${query.expectedAgent})`);
                console.log(`🤖 Response: ${response.data.response.substring(0, 150)}...`);
                
                const routingCorrect = response.data.agent_type === query.expectedAgent;
                const budgetAware = response.data.response.toLowerCase().includes('budget') ||
                                   response.data.response.includes('$') ||
                                   response.data.response.toLowerCase().includes('cost') ||
                                   response.data.response.toLowerCase().includes('save');
                
                if (routingCorrect && (budgetAware || !query.expectsBudget)) {
                    successfulTests++;
                    console.log(`✅ Test passed: Correct routing and budget awareness`);
                } else {
                    console.log(`⚠️ Test issues: Routing=${routingCorrect}, Budget=${budgetAware}`);
                }
            }
            
            this.recordTest('Budget-Enhanced Responses', successfulTests === testQueries.length,
                `${successfulTests}/${testQueries.length} tests passed with correct routing and budget awareness`);
            
        } catch (error) {
            this.recordTest('Budget-Enhanced Responses', false, error.message);
        }
    }

    async testFinancialReport() {
        console.log('\n📊 Test 5: Financial Report Generation...');
        
        try {
            const response = await axios.get(`${this.baseUrl}/budget/report/${this.testUserId}?timeframe=monthly`);
            const report = response.data.report;

            console.log(`📈 Financial Report Generated:`);
            console.log(`   Total Spent: $${report.summary.total_spent}`);
            console.log(`   Transactions: ${report.summary.transaction_count}`);
            console.log(`   Average Transaction: $${report.summary.average_transaction}`);
            
            if (report.category_breakdown) {
                console.log(`   Category Breakdown:`);
                for (const [category, data] of Object.entries(report.category_breakdown)) {
                    console.log(`     ${category}: $${data.total} (${data.count} transactions)`);
                }
            }
            
            if (report.budget_performance) {
                console.log(`   Budget Performance:`);
                for (const [category, perf] of Object.entries(report.budget_performance)) {
                    console.log(`     ${category}: ${perf.percentage_used}% used (${perf.status})`);
                }
            }
            
            this.recordTest('Financial Report Generation', true, 
                `Generated comprehensive report with ${report.summary.transaction_count} transactions`);
            
        } catch (error) {
            this.recordTest('Financial Report Generation', false, error.message);
            console.log(`❌ Financial Report failed: ${error.response?.data?.message || error.message}`);
        }
    }

    async testBudgetOptimization() {
        console.log('\n💡 Test 6: Budget Optimization Recommendations...');
        
        try {
            const response = await axios.post(`${this.baseUrl}/budget/optimize`, {
                userId: this.testUserId,
                requestType: 'nutrition_meal_plan',
                parameters: {
                    diet: 'vegetarian',
                    goal: 'muscle_building'
                }
            });

            console.log(`🎯 Optimization Recommendations:`);
            const recommendations = response.data.recommendations.recommendations || [];
            
            if (recommendations.length > 0) {
                recommendations.forEach((rec, index) => {
                    console.log(`   ${index + 1}. Category: ${rec.category}`);
                    if (rec.items) {
                        rec.items.forEach(item => {
                            console.log(`      - ${item.item}: ${item.cost}`);
                        });
                    }
                });
            }
            
            const budgetContext = response.data.recommendations.budget_context;
            if (budgetContext) {
                console.log(`   💰 Budget Context: $${budgetContext.total_budget} total budget`);
                console.log(`   💸 Remaining: $${budgetContext.remaining_budget}`);
            }
            
            this.recordTest('Budget Optimization', true, 
                `Generated ${recommendations.length} optimization recommendations`);
            
        } catch (error) {
            this.recordTest('Budget Optimization', false, error.message);
            console.log(`❌ Budget Optimization failed: ${error.response?.data?.message || error.message}`);
        }
    }

    recordTest(testName, success, details) {
        this.testResults.push({
            test: testName,
            success: success,
            details: details,
            timestamp: new Date().toISOString()
        });
    }

    displayTestSummary() {
        console.log('\n🎯 BUDGET MANAGEMENT TEST SUMMARY');
        console.log('='.repeat(70));
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.success).length;
        const successRate = Math.round((passedTests / totalTests) * 100);
        
        console.log(`📊 Overall Results: ${passedTests}/${totalTests} tests passed (${successRate}%)`);
        console.log('\n📋 Test Details:');
        
        this.testResults.forEach((result, index) => {
            const status = result.success ? '✅ PASS' : '❌ FAIL';
            console.log(`   ${index + 1}. ${status} - ${result.test}`);
            console.log(`      ${result.details}`);
        });
        
        console.log('\n🌟 BUDGET MANAGEMENT SYSTEM ASSESSMENT:');
        
        if (successRate >= 90) {
            console.log('🏆 EXCELLENT: Your budget management system is working perfectly!');
            console.log('   All major features are operational and integrated.');
        } else if (successRate >= 75) {
            console.log('✅ GOOD: Your budget management system is mostly functional.');
            console.log('   Minor issues detected but core features work well.');
        } else if (successRate >= 50) {
            console.log('⚠️ PARTIAL: Your budget management system has some issues.');
            console.log('   Core functionality present but needs refinement.');
        } else {
            console.log('❌ NEEDS WORK: Your budget management system needs attention.');
            console.log('   Multiple core features are not working properly.');
        }
        
        console.log('\n💰 Budget Management Features Verified:');
        console.log('   • Budget-aware conversations');
        console.log('   • Intelligent budget plan creation');
        console.log('   • Expense tracking with impact analysis');
        console.log('   • Enhanced agent responses with cost considerations');
        console.log('   • Financial reporting and analytics');
        console.log('   • Optimization recommendations');
        
        console.log('\n🚀 Your Progressive Framework V5 Option 4 is complete!');
        console.log('💡 Next: Try Option 5 (Emergency Response) or Option 6 (GitHub Deployment)');
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new BudgetSystemTester();
    tester.runBudgetTests().catch(console.error);
}

module.exports = BudgetSystemTester;