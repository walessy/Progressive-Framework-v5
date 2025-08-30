const crypto = require('crypto');

class BaseAgent {
  constructor(config) {
    this.id = config.id || (config.type + '_' + this.generateId());
    this.type = config.type;
    this.version = config.version || '1.0.0';
    this.specification = config.specification || {};
    this.fingerprint = this.generateFingerprint();
    this.status = 'initialized';
    this.createdAt = new Date().toISOString();
    this.conversationHistory = [];
    this.collaborationNetwork = [];
  }

  generateId() {
    return Math.random().toString(36).substr(2, 8);
  }

  generateFingerprint() {
    const components = {
      behavior: this.hashObject(this.specification.behavior || {}),
      knowledge: this.hashObject(this.specification.knowledge || {}),
      interactions: this.hashObject(this.specification.interactions || {})
    };
    
    return {
      fingerprint: crypto.createHash('sha256')
        .update(JSON.stringify(components))
        .digest('hex'),
      components,
      timestamp: new Date().toISOString()
    };
  }

  hashObject(obj) {
    return crypto.createHash('sha256')
      .update(JSON.stringify(obj))
      .digest('hex');
  }

  async processMessage(message, context) {
    // Override in child classes
    return {
      response: 'Base agent response to: ' + message.content,
      agent_id: this.id,
      timestamp: new Date().toISOString()
    };
  }

  async initiateCollaboration(targetAgent, purpose, context) {
    const conversationId = 'AGENT_' + this.id + '_TO_' + targetAgent.id + '_' + purpose + '_' + Date.now();
    
    return {
      conversationId,
      participants: [this.id, targetAgent.id],
      purpose,
      context,
      createdAt: new Date().toISOString()
    };
  }

  updateStatus(status) {
    this.status = status;
    this.lastUpdated = new Date().toISOString();
    console.log('Agent ' + this.id + ' status updated to: ' + status);
  }

  getInfo() {
    return {
      id: this.id,
      type: this.type,
      version: this.version,
      status: this.status,
      createdAt: this.createdAt,
      fingerprint: this.fingerprint.fingerprint,
      conversationCount: this.conversationHistory.length
    };
  }
}

module.exports = BaseAgent;
