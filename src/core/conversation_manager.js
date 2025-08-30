// Conversation Manager for Agent Persistence
// src/core/conversation_manager.js

const fs = require('fs').promises;
const path = require('path');

class ConversationManager {
  constructor() {
    this.conversationsPath = path.join(__dirname, '..', '..', 'data', 'conversations');
    this.activeConversations = new Map();
    this.conversationIndex = new Map(); // For fast lookups
  }

  async initialize() {
    try {
      // Ensure conversations directory exists
      await fs.mkdir(this.conversationsPath, { recursive: true });
      
      // Create subdirectories for different conversation types
      const subdirs = ['user_sessions', 'agent_collaborations', 'system_optimization'];
      for (const subdir of subdirs) {
        await fs.mkdir(path.join(this.conversationsPath, subdir), { recursive: true });
      }

      // Load existing conversation index
      await this.loadConversationIndex();
      
      console.log('📁 Conversation Manager initialized');
      console.log(`   Storage path: ${this.conversationsPath}`);
      console.log(`   Indexed conversations: ${this.conversationIndex.size}`);
    } catch (error) {
      console.error('❌ Failed to initialize Conversation Manager:', error);
      throw error;
    }
  }

  async createConversation(conversationData) {
    try {
      const conversationType = this.determineConversationType(conversationData);
      const fileName = this.generateFileName(conversationData);
      const filePath = path.join(this.conversationsPath, conversationType, fileName);

      // Enhance conversation data with metadata
      const enhancedData = {
        ...conversationData,
        id: conversationData.title || fileName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        filePath: filePath,
        conversationType: conversationType,
        status: 'active'
      };

      // Write conversation file
      await fs.writeFile(filePath, JSON.stringify(enhancedData, null, 2));

      // Update index
      this.conversationIndex.set(enhancedData.id, {
        filePath: filePath,
        type: conversationType,
        createdAt: enhancedData.createdAt,
        updatedAt: enhancedData.updatedAt,
        participants: conversationData.participants || [],
        title: conversationData.title
      });

      // Add to active conversations
      this.activeConversations.set(enhancedData.id, enhancedData);

      console.log(`💬 Created conversation: ${enhancedData.id}`);
      return filePath;

    } catch (error) {
      console.error('❌ Failed to create conversation:', error);
      throw error;
    }
  }

  async updateConversation(conversationId, updatedData) {
    try {
      const indexEntry = this.conversationIndex.get(conversationId);
      if (!indexEntry) {
        throw new Error(`Conversation ${conversationId} not found in index`);
      }

      // Update the data
      const enhancedData = {
        ...updatedData,
        updatedAt: new Date().toISOString()
      };

      // Write updated file
      await fs.writeFile(indexEntry.filePath, JSON.stringify(enhancedData, null, 2));

      // Update index
      indexEntry.updatedAt = enhancedData.updatedAt;
      
      // Update active conversation if present
      if (this.activeConversations.has(conversationId)) {
        this.activeConversations.set(conversationId, enhancedData);
      }

      console.log(`🔄 Updated conversation: ${conversationId}`);
      return indexEntry.filePath;

    } catch (error) {
      console.error('❌ Failed to update conversation:', error);
      throw error;
    }
  }

  async getConversation(conversationId) {
    try {
      // Check active conversations first
      if (this.activeConversations.has(conversationId)) {
        return this.activeConversations.get(conversationId);
      }

      // Check index and load from file
      const indexEntry = this.conversationIndex.get(conversationId);
      if (!indexEntry) {
        throw new Error(`Conversation ${conversationId} not found`);
      }

      const fileContent = await fs.readFile(indexEntry.filePath, 'utf-8');
      const conversationData = JSON.parse(fileContent);

      // Cache in active conversations
      this.activeConversations.set(conversationId, conversationData);

      return conversationData;

    } catch (error) {
      console.error(`❌ Failed to get conversation ${conversationId}:`, error);
      throw error;
    }
  }

  async searchConversations(query, filters = {}) {
    try {
      const results = [];
      
      for (const [conversationId, indexEntry] of this.conversationIndex) {
        // Apply filters
        if (filters.type && indexEntry.type !== filters.type) continue;
        if (filters.participants && !this.matchesParticipants(indexEntry.participants, filters.participants)) continue;
        if (filters.dateRange) {
          const createdDate = new Date(indexEntry.createdAt);
          if (filters.dateRange.start && createdDate < filters.dateRange.start) continue;
          if (filters.dateRange.end && createdDate > filters.dateRange.end) continue;
        }

        // Simple text matching on title and ID
        const searchText = query.toLowerCase();
        const matchesTitle = indexEntry.title?.toLowerCase().includes(searchText);
        const matchesId = conversationId.toLowerCase().includes(searchText);

        if (matchesTitle || matchesId) {
          results.push({
            id: conversationId,
            title: indexEntry.title,
            type: indexEntry.type,
            participants: indexEntry.participants,
            createdAt: indexEntry.createdAt,
            updatedAt: indexEntry.updatedAt,
            relevanceScore: this.calculateRelevanceScore(query, indexEntry)
          });
        }
      }

      // Sort by relevance score (descending)
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);

      return results;

    } catch (error) {
      console.error('❌ Failed to search conversations:', error);
      throw error;
    }
  }

  async getConversationsByType(type) {
    try {
      const results = [];
      
      for (const [conversationId, indexEntry] of this.conversationIndex) {
        if (indexEntry.type === type) {
          results.push({
            id: conversationId,
            title: indexEntry.title,
            participants: indexEntry.participants,
            createdAt: indexEntry.createdAt,
            updatedAt: indexEntry.updatedAt
          });
        }
      }

      // Sort by creation date (newest first)
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return results;

    } catch (error) {
      console.error(`❌ Failed to get conversations by type ${type}:`, error);
      throw error;
    }
  }

  async archiveConversation(conversationId) {
    try {
      const conversation = await this.getConversation(conversationId);
      conversation.status = 'archived';
      conversation.archivedAt = new Date().toISOString();

      await this.updateConversation(conversationId, conversation);
      
      // Remove from active conversations
      this.activeConversations.delete(conversationId);

      console.log(`📦 Archived conversation: ${conversationId}`);

    } catch (error) {
      console.error(`❌ Failed to archive conversation ${conversationId}:`, error);
      throw error;
    }
  }

  // Private helper methods
  determineConversationType(conversationData) {
    if (conversationData.type === 'agent_collaboration') {
      return 'agent_collaborations';
    } else if (conversationData.type === 'system_optimization') {
      return 'system_optimization';
    } else {
      return 'user_sessions';
    }
  }

  generateFileName(conversationData) {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '').substr(0, 15);
    const safeTitle = (conversationData.title || 'conversation')
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .substr(0, 50);
    
    return `${safeTitle}_${timestamp}.json`;
  }

  matchesParticipants(conversationParticipants, filterParticipants) {
    if (!conversationParticipants || !filterParticipants) return false;
    
    return filterParticipants.some(participant => 
      conversationParticipants.includes(participant)
    );
  }

  calculateRelevanceScore(query, indexEntry) {
    let score = 0;
    const queryTerms = query.toLowerCase().split(' ');
    
    // Title matches (higher weight)
    if (indexEntry.title) {
      const titleLower = indexEntry.title.toLowerCase();
      queryTerms.forEach(term => {
        if (titleLower.includes(term)) {
          score += 10;
        }
      });
    }

    // ID matches (lower weight)
    const idLower = indexEntry.id?.toLowerCase() || '';
    queryTerms.forEach(term => {
      if (idLower.includes(term)) {
        score += 5;
      }
    });

    // Recency bonus (conversations from last 24 hours get bonus)
    const hoursSinceCreation = (new Date() - new Date(indexEntry.createdAt)) / (1000 * 60 * 60);
    if (hoursSinceCreation < 24) {
      score += 3;
    }

    return score;
  }

  async loadConversationIndex() {
    try {
      const indexPath = path.join(this.conversationsPath, 'conversation_index.json');
      
      try {
        const indexContent = await fs.readFile(indexPath, 'utf-8');
        const indexData = JSON.parse(indexContent);
        
        // Rebuild index Map
        for (const [id, data] of Object.entries(indexData)) {
          this.conversationIndex.set(id, data);
        }
        
        console.log(`📇 Loaded conversation index with ${this.conversationIndex.size} entries`);
      } catch (error) {
        // Index doesn't exist yet, that's okay
        console.log('📇 No existing conversation index found, starting fresh');
      }

    } catch (error) {
      console.error('❌ Failed to load conversation index:', error);
    }
  }

  async saveConversationIndex() {
    try {
      const indexPath = path.join(this.conversationsPath, 'conversation_index.json');
      const indexData = Object.fromEntries(this.conversationIndex);
      
      await fs.writeFile(indexPath, JSON.stringify(indexData, null, 2));
      console.log(`💾 Saved conversation index with ${this.conversationIndex.size} entries`);

    } catch (error) {
      console.error('❌ Failed to save conversation index:', error);
    }
  }

  // Cleanup method - call this periodically
  async cleanup() {
    try {
      // Remove old active conversations (older than 1 hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      for (const [id, conversation] of this.activeConversations) {
        const lastUpdated = new Date(conversation.updatedAt);
        if (lastUpdated < oneHourAgo) {
          this.activeConversations.delete(id);
        }
      }

      // Save index
      await this.saveConversationIndex();

      console.log(`🧹 Conversation Manager cleanup completed`);

    } catch (error) {
      console.error('❌ Failed to cleanup conversations:', error);
    }
  }

  // Statistics and monitoring
  getStats() {
    return {
      totalConversations: this.conversationIndex.size,
      activeConversations: this.activeConversations.size,
      conversationsByType: this.getConversationTypeBreakdown(),
      oldestConversation: this.getOldestConversation(),
      newestConversation: this.getNewestConversation()
    };
  }

  getConversationTypeBreakdown() {
    const breakdown = {};
    
    for (const indexEntry of this.conversationIndex.values()) {
      breakdown[indexEntry.type] = (breakdown[indexEntry.type] || 0) + 1;
    }

    return breakdown;
  }

  getOldestConversation() {
    let oldest = null;
    
    for (const indexEntry of this.conversationIndex.values()) {
      if (!oldest || new Date(indexEntry.createdAt) < new Date(oldest.createdAt)) {
        oldest = indexEntry;
      }
    }

    return oldest;
  }

  getNewestConversation() {
    let newest = null;
    
    for (const indexEntry of this.conversationIndex.values()) {
      if (!newest || new Date(indexEntry.createdAt) > new Date(newest.createdAt)) {
        newest = indexEntry;
      }
    }

    return newest;
  }
}

module.exports = ConversationManager;