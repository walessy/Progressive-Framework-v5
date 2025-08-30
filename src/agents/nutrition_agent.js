const BaseAgent = require('./base_agent');

class NutritionAgent extends BaseAgent {
  constructor() {
    super({
      type: 'NPA',
      version: '1.0.0',
      specification: {
        behavior: { 
          role: 'nutrition_planning',
          focus: 'meal_optimization'
        },
        knowledge: { 
          domain: 'nutrition',
          specialties: ['macros', 'meal_timing', 'dietary_restrictions']
        },
        interactions: { 
          scope: 'nutrition_queries',
          collaboration: ['workout_agents', 'budget_agents']
        }
      }
    });

    this.updateStatus('active');
  }

  async processMessage(message, context) {
    console.log('NPA processing message: ' + message.content);
    
    // Simple nutrition-focused response logic
    const content = message.content.toLowerCase();
    let response = '';
    
    if (content.includes('meal') || content.includes('food')) {
      response = 'I can help you plan nutritious meals based on your goals and dietary requirements.';
    } else if (content.includes('protein') || content.includes('macro')) {
      response = 'Let me calculate optimal macronutrient ratios for your fitness goals.';
    } else if (content.includes('diet') || content.includes('nutrition')) {
      response = 'I specialize in creating personalized nutrition plans. What are your specific goals?';
    } else {
      response = 'I\'m your Nutrition Planning Agent. I can help with meal planning, macro calculations, and dietary recommendations.';
    }

    return {
      response: response,
      agent_id: this.id,
      agent_type: this.type,
      timestamp: new Date().toISOString(),
      confidence: 0.8
    };
  }
}

module.exports = NutritionAgent;
