// src/config/database.js
// Database mock for Progressive Framework V5 emergency testing

const mockDb = {
  async query(sql) {
    // Simulate response time for Progressive Framework
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 10));
    
    if (sql.includes('SELECT 1')) {
      return { 
        rows: [{ result: 1 }],
        system: 'Progressive Framework V5',
        agent: 'Database Mock'
      };
    }
    
    return { rows: [], system: 'Progressive Framework V5' };
  },
  
  async close() {
    console.log('🔌 Progressive Framework Database Mock: Connection closed');
    return true;
  },
  
  isConnected() {
    return true;
  },
  
  healthCheck: async () => {
    await new Promise(resolve => setTimeout(resolve, 25));
    return {
      status: 'healthy',
      system: 'Progressive Framework V5',
      responseTime: Math.random() * 50 + 10
    };
  }
};

module.exports = mockDb;