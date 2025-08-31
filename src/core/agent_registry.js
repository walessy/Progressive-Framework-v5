class AgentRegistry {
    constructor() {
        this.agents = new Map();
        this.agentTypes = new Map();
    }

    async initialize() {
        console.log('Initializing Agent Registry...');
        // Load any existing agents from storage
        return true;
    }

    registerAgent(agent) {
        this.agents.set(agent.id, agent);
    
        if (!this.agentTypes.has(agent.type)) {
            this.agentTypes.set(agent.type, []);
        }
        this.agentTypes.get(agent.type).push(agent.id);
    
        console.log('Agent registered: ' + agent.id + ' (type: ' + agent.type + ')');
        return agent;
    }

    getAgent(agentId) {
        return this.agents.get(agentId);
    }

    getAllAgents() {
        return Array.from(this.agents.values());
    }

    getActiveAgents() {
        return Array.from(this.agents.values()).filter(agent => agent.status === 'active');
    }

    getAgentsByType(type) {
        const agentIds = this.agentTypes.get(type) || [];
        return agentIds.map(id => this.agents.get(id)).filter(Boolean);
    }

    updateAgentStatus(agentId, status) {
        const agent = this.agents.get(agentId);
        if (agent) {
            agent.updateStatus(status);
            console.log('Agent ' + agentId + ' status updated to: ' + status);
        }
    }

    removeAgent(agentId) {
        const agent = this.agents.get(agentId);
        if (agent) {
            this.agents.delete(agentId);
      
            // Remove from type index
            const typeAgents = this.agentTypes.get(agent.type);
            if (typeAgents) {
                const index = typeAgents.indexOf(agentId);
                if (index > -1) {
                    typeAgents.splice(index, 1);
                }
            }
      
            console.log('Agent removed: ' + agentId);
            return true;
        }
        return false;
    }
}

module.exports = AgentRegistry;
