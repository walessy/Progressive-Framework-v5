// Agent Collaboration System - Progressive Framework V5
// src/core/agent_collaboration.js

const path = require('path');
const fs = require('fs').promises;

class AgentCollaborationSystem {
  constructor(agentRegistry, conversationManager) {
    this.agentRegistry = agentRegistry;
    this.conversationManager = conversationManager;
    this.activeCollaborations = new Map();
    this.collaborationHistory = [];
  }

  // Detect if query requires multi-agent collaboration
  detectCollaborationNeed(message, primaryAgentType) {
    const messageText = message.toLowerCase();
    
    // More flexible keyword detection - check for combinations
    const nutritionKeywords = ['meal', 'diet', 'nutrition', 'food', 'eating', 'protein'];
    const fitnessKeywords = ['workout', 'training', 'strength', 'exercise', 'fitness', 'muscle'];
    const budgetKeywords = ['cheap', 'budget', 'affordable', 'cost', 'money', 'low cost'];

    const hasNutrition = nutritionKeywords.some(keyword => messageText.includes(keyword));
    const hasFitness = fitnessKeywords.some(keyword => messageText.includes(keyword));
    const hasBudget = budgetKeywords.some(keyword => messageText.includes(keyword));

    // Determine collaboration type based on combinations
    let collaborationType = null;
    let requiredAgents = [];
    
    if (hasNutrition && hasFitness && !hasBudget) {
      collaborationType = 'nutrition_fitness';
      requiredAgents = ['NPA', 'WPA'];
    } else if (hasNutrition && hasBudget && !hasFitness) {
      collaborationType = 'budget_nutrition';
      requiredAgents = ['NPA']; // Skip BMA for now since it's not implemented
    } else if (hasFitness && hasBudget && !hasNutrition) {
      collaborationType = 'budget_fitness';
      requiredAgents = ['WPA']; // Skip BMA for now
    } else if (hasNutrition && hasFitness && hasBudget) {
      collaborationType = 'complete_wellness';
      requiredAgents = ['NPA', 'WPA']; // Skip BMA for now
    }

    if (collaborationType && requiredAgents.length > 1) {
      // Filter out agents that don't exist
      const availableAgents = requiredAgents.filter(agentType => 
        this.agentRegistry.getAgentsByType(agentType).length > 0
      );

      if (availableAgents.length > 1) {
        return {
          collaborationType: collaborationType,
          requiredAgents: availableAgents,
          primaryAgent: primaryAgentType,
          secondaryAgents: availableAgents.filter(a => a !== primaryAgentType),
          confidence: this.calculateCollaborationConfidence(messageText, [...nutritionKeywords, ...fitnessKeywords, ...budgetKeywords])
        };
      }
    }

    return null;
  }

  calculateCollaborationConfidence(message, keywords) {
    const words = message.toLowerCase().split(' ');
    const matches = keywords.filter(keyword => 
      words.some(word => word.includes(keyword) || keyword.includes(word))
    );
    
    // Base confidence of 0.7, plus 0.05 for each keyword match
    return Math.min(0.95, 0.7 + (matches.length * 0.05));
  }

  // Create agent-to-agent collaboration conversation
  async initiateAgentCollaboration(collaborationInfo, originalMessage, userContext) {
    const collaborationId = this.generateCollaborationId();
    const conversationTitle = this.generateCollaborationTitle(collaborationInfo, collaborationId);
    
    const collaborationContext = {
      id: collaborationId,
      type: collaborationInfo.collaborationType,
      originalMessage: originalMessage,
      userContext: userContext,
      participants: [collaborationInfo.primaryAgent, ...collaborationInfo.secondaryAgents],
      initiatedBy: 'system_auto', // or 'user_triggered'
      timestamp: new Date().toISOString(),
      status: 'active'
    };

    // Store collaboration metadata
    this.activeCollaborations.set(collaborationId, collaborationContext);

    // Create agent-to-agent conversation
    const agentConversation = await this.createAgentConversation(
      conversationTitle,
      collaborationContext
    );

    // Conduct collaboration
    const result = await this.conductCollaboration(collaborationContext, agentConversation);

    return result;
  }

  generateCollaborationId() {
    return 'COLLAB_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }

  generateCollaborationTitle(collaborationInfo, collaborationId) {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '').substr(0, 15);
    const agentList = [collaborationInfo.primaryAgent, ...collaborationInfo.secondaryAgents].join('_TO_');
    
    return `AGENT_${agentList}_${collaborationInfo.collaborationType}_${timestamp}_${collaborationId}`;
  }

  // Create dedicated conversation for agent-to-agent communication
  async createAgentConversation(title, context) {
    const conversationData = {
      title: title,
      type: 'agent_collaboration',
      participants: context.participants,
      originalQuery: context.originalMessage,
      metadata: {
        collaborationType: context.type,
        initiatedBy: context.initiatedBy,
        timestamp: context.timestamp,
        status: context.status
      },
      messages: []
    };

    // Store conversation using your conversation manager
    const conversationPath = await this.conversationManager.createConversation(conversationData);
    
    return {
      id: title,
      path: conversationPath,
      data: conversationData
    };
  }

  // Conduct the actual agent collaboration
  async conductCollaboration(context, conversation) {
    const primaryAgent = this.agentRegistry.getAgentsByType(context.participants[0])[0];
    const secondaryAgents = context.participants.slice(1).map(type => 
      this.agentRegistry.getAgentsByType(type)[0]
    );

    // Step 1: Primary agent analyzes request and identifies collaboration needs
    const primaryAnalysis = await this.getAgentAnalysis(
      primaryAgent, 
      context.originalMessage,
      'analyze_and_identify_collaboration_needs'
    );

    await this.logCollaborationMessage(conversation, {
      agent: primaryAgent.type,
      role: 'primary_analysis',
      content: primaryAnalysis,
      timestamp: new Date().toISOString()
    });

    // Step 2: Secondary agents provide their specialized input
    const secondaryInputs = {};
    
    for (const secondaryAgent of secondaryAgents) {
      const collaborationRequest = this.buildCollaborationRequest(
        context.originalMessage,
        primaryAnalysis,
        secondaryAgent.type
      );

      const secondaryInput = await this.getAgentAnalysis(
        secondaryAgent,
        collaborationRequest,
        'provide_specialized_input'
      );

      secondaryInputs[secondaryAgent.type] = secondaryInput;

      await this.logCollaborationMessage(conversation, {
        agent: secondaryAgent.type,
        role: 'specialized_input',
        content: secondaryInput,
        timestamp: new Date().toISOString()
      });
    }

    // Step 3: Primary agent synthesizes all inputs into final response
    const synthesisRequest = this.buildSynthesisRequest(
      context.originalMessage,
      primaryAnalysis,
      secondaryInputs
    );

    const finalResponse = await this.getAgentAnalysis(
      primaryAgent,
      synthesisRequest,
      'synthesize_collaborative_response'
    );

    await this.logCollaborationMessage(conversation, {
      agent: primaryAgent.type,
      role: 'final_synthesis',
      content: finalResponse,
      timestamp: new Date().toISOString()
    });

    // Step 4: Mark collaboration as complete
    context.status = 'completed';
    context.completedAt = new Date().toISOString();
    context.finalResponse = finalResponse;

    // Archive collaboration
    this.collaborationHistory.push(context);
    this.activeCollaborations.delete(context.id);

    return {
      response: finalResponse.response,
      collaboration_info: {
        id: context.id,
        type: context.type,
        participants: context.participants,
        conversation_title: conversation.id,
        confidence: this.calculateFinalConfidence(primaryAnalysis, secondaryInputs)
      },
      agent_id: primaryAgent.id,
      agent_type: primaryAgent.type,
      timestamp: new Date().toISOString()
    };
  }

  // Helper methods for agent communication
  async getAgentAnalysis(agent, message, mode) {
    const contextualMessage = {
      content: message,
      collaboration_mode: mode,
      timestamp: new Date().toISOString()
    };

    return await agent.processMessage(contextualMessage, {});
  }

  buildCollaborationRequest(originalMessage, primaryAnalysis, secondaryAgentType) {
    const specializations = {
      'NPA': 'nutrition planning and dietary optimization',
      'WPA': 'workout planning and fitness programming',
      'BMA': 'budget management and cost optimization'
    };

    return `Original user request: "${originalMessage}"

Primary analysis from ${primaryAnalysis.agent_type}: ${primaryAnalysis.response}

As the ${specializations[secondaryAgentType]} specialist, please provide your expertise to enhance this plan. Focus on your domain-specific considerations that would improve the overall solution.`;
  }

  buildSynthesisRequest(originalMessage, primaryAnalysis, secondaryInputs) {
    let synthesis = `Original user request: "${originalMessage}"

Your initial analysis: ${primaryAnalysis.response}

Specialist inputs received:
`;

    for (const [agentType, input] of Object.entries(secondaryInputs)) {
      synthesis += `\n${agentType}: ${input.response}`;
    }

    synthesis += `\n\nNow synthesize all this information into a comprehensive, actionable response that addresses the user's original request while incorporating insights from all specialists.`;

    return synthesis;
  }

  async logCollaborationMessage(conversation, messageData) {
    conversation.data.messages.push(messageData);
    
    // Save updated conversation
    await this.conversationManager.updateConversation(
      conversation.id, 
      conversation.data
    );
  }

  calculateFinalConfidence(primaryAnalysis, secondaryInputs) {
    const baseConfidence = primaryAnalysis.confidence || 0.7;
    const collaborationBoost = Object.keys(secondaryInputs).length * 0.1;
    
    return Math.min(0.95, baseConfidence + collaborationBoost);
  }

  // Get collaboration history for analysis
  getCollaborationHistory() {
    return {
      active: Array.from(this.activeCollaborations.values()),
      completed: this.collaborationHistory,
      stats: {
        totalCollaborations: this.collaborationHistory.length,
        activeCollaborations: this.activeCollaborations.size,
        averageParticipants: this.calculateAverageParticipants(),
        mostCommonType: this.getMostCommonCollaborationType()
      }
    };
  }

  calculateAverageParticipants() {
    if (this.collaborationHistory.length === 0) return 0;
    
    const totalParticipants = this.collaborationHistory.reduce(
      (sum, collab) => sum + collab.participants.length, 0
    );
    
    return totalParticipants / this.collaborationHistory.length;
  }

  getMostCommonCollaborationType() {
    const types = this.collaborationHistory.map(c => c.type);
    const frequency = {};
    
    types.forEach(type => {
      frequency[type] = (frequency[type] || 0) + 1;
    });
    
    return Object.keys(frequency).reduce((a, b) => 
      frequency[a] > frequency[b] ? a : b, null
    );
  }
}

module.exports = AgentCollaborationSystem;