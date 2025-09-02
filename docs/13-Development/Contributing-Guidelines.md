---
file: docs/13-Development/Contributing-Guidelines.md
directory: docs/13-Development/
priority: HIGH
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# Contributing Guidelines - Progressive-Framework-v5

**File Path**: `docs/13-Development/Contributing-Guidelines.md`  
**Directory**: `docs/13-Development/`  
**Priority**: HIGH  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive contributing guidelines for Progressive-Framework-v5 Multi-Agent Intelligence System. This document provides code standards, contribution workflows, testing requirements, and documentation standards for developers contributing to the project.

### **Prerequisites (Read First)**
- 📊 **[Development Setup](Development-Setup.md)** - *Local development environment*
- 🤖 **[Agent Development Guide](../02-Agent-Management/Agent-Development-Guide.md)** - *Agent development patterns*
- 🔗 **[API Documentation](../03-Communication-Protocols/API-Documentation.md)** - *API standards and patterns*
- 📋 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture understanding*

---

## **QUICK CONTRIBUTION CHECKLIST**

### **🚀 Before You Start**
- [ ] Read and understand the [Code of Conduct](#code-of-conduct)
- [ ] Set up your [development environment](Development-Setup.md)
- [ ] Fork the repository and create a feature branch
- [ ] Review existing [issues](https://github.com/your-org/progressive-framework-v5/issues) and [PRs](https://github.com/your-org/progressive-framework-v5/pulls)

### **📝 Before You Submit**
- [ ] Code follows [coding standards](#coding-standards)
- [ ] All [tests pass](#testing-requirements) (`npm test`)
- [ ] Code is properly [documented](#documentation-standards)
- [ ] [Commit messages](#commit-message-format) follow conventions
- [ ] [Pull request](#pull-request-process) template is completed
- [ ] Changes are [backwards compatible](#backwards-compatibility)

---

## **CODE OF CONDUCT**

### **Our Pledge**
We are committed to making participation in the Progressive Framework V5 project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### **Expected Behavior**
- **Be respectful** and inclusive in all interactions
- **Be collaborative** and help others learn and grow
- **Be constructive** in feedback and discussions
- **Be patient** with newcomers and questions
- **Focus on the code and ideas**, not personal attacks

### **Unacceptable Behavior**
- Harassment, discrimination, or offensive language
- Personal attacks or trolling
- Publishing private information without permission
- Any conduct that would be inappropriate in a professional setting

### **Reporting Issues**
Report any violations to [conduct@your-domain.com](mailto:conduct@your-domain.com). All reports will be reviewed and investigated confidentially.

---

## **CONTRIBUTION WORKFLOW**

### **1. Getting Started**

#### **Fork and Clone**
```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork locally
git clone https://github.com/YOUR_USERNAME/progressive-framework-v5.git
cd progressive-framework-v5

# 3. Add upstream remote
git remote add upstream https://github.com/your-org/progressive-framework-v5.git

# 4. Create development branch
git checkout -b feature/your-feature-name
```

#### **Environment Setup**
```bash
# Install dependencies
npm install
pip install -r requirements.txt

# Copy environment configuration
cp .env.example .env.local
# Edit .env.local with your settings

# Start development servers
npm run dev
```

### **2. Development Process**

#### **Branch Naming Convention**
```
Feature Development:
✅ feature/agent-performance-optimization
✅ feature/npa-meal-planning-enhancement
✅ feature/user-authentication-system

Bug Fixes:
✅ bugfix/agent-timeout-handling
✅ bugfix/database-connection-retry
✅ bugfix/api-validation-error

Documentation:
✅ docs/api-documentation-update
✅ docs/contributing-guidelines-improvement
✅ docs/troubleshooting-guide-expansion

Refactoring:
✅ refactor/agent-communication-optimization
✅ refactor/database-query-performance
✅ refactor/code-organization-cleanup

❌ Avoid generic names:
❌ fix-bug
❌ update-docs  
❌ improvements
```

#### **Development Workflow**
```bash
# 1. Sync with upstream before starting
git fetch upstream
git checkout main
git merge upstream/main
git push origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes
# ... develop your feature ...

# 4. Test thoroughly
npm test
npm run test:agents
npm run lint

# 5. Commit changes
git add .
git commit -m "feat(agents): implement Budget Management Agent (BMA)"

# 6. Push to your fork
git push origin feature/your-feature-name

# 7. Create pull request on GitHub
```

### **3. Keeping Your Fork Updated**
```bash
# Regular sync with upstream
git fetch upstream
git checkout main
git merge upstream/main
git push origin main

# Update feature branch with latest changes
git checkout feature/your-feature-name
git rebase main
# Resolve conflicts if any
git push --force-with-lease origin feature/your-feature-name
```

---

## **CODING STANDARDS**

### **General Principles**

#### **Code Quality**
- **Readability**: Code should be self-documenting and easy to understand
- **Consistency**: Follow established patterns and conventions
- **Simplicity**: Prefer simple, clear solutions over complex ones
- **Performance**: Write efficient code but prioritize clarity
- **Security**: Consider security implications in all code

#### **Architecture Principles**
- **Separation of Concerns**: Each module should have a single responsibility
- **DRY (Don't Repeat Yourself)**: Avoid code duplication
- **SOLID Principles**: Follow SOLID design principles
- **Agent Independence**: Agents should be loosely coupled and independently deployable
- **API First**: Design APIs before implementation

### **TypeScript/JavaScript Standards**

#### **File Organization**
```typescript
// File structure for TypeScript files
import statements (external libraries first)
import statements (internal modules)
import statements (relative imports)

type definitions
interface definitions
constant declarations
class/function implementations
default export (if applicable)
```

#### **Naming Conventions**
```typescript
// Variables and functions: camelCase
const userName = 'john_doe';
const calculateAgentConfidence = (score: number): number => { };

// Classes and interfaces: PascalCase
class AgentRegistry { }
interface UserProfile { }

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 30000;

// Files: kebab-case
agent-service.ts
user-profile.component.tsx
api-client.utils.ts

// Enums: PascalCase
enum AgentType {
  MCA = 'mca',
  NPA = 'npa', 
  WPA = 'wpa',
  BMA = 'bma'
}
```

#### **Code Structure Example**
```typescript
// agents/shared/base-agent.ts
import { FastifyInstance } from 'fastify';
import { Logger } from '@/shared/utils/logger';
import { AgentConfig, AgentResponse, AgentRequest } from '@/shared/types';

/**
 * Base class for all Progressive Framework V5 agents
 * Provides common functionality and interfaces
 */
export abstract class BaseAgent {
  protected readonly logger: Logger;
  protected readonly config: AgentConfig;
  
  constructor(config: AgentConfig) {
    this.config = config;
    this.logger = new Logger(config.name);
    this.validateConfig();
  }
  
  /**
   * Process incoming request and generate response
   * @param request - Incoming agent request
   * @returns Promise<AgentResponse> - Agent response
   */
  abstract async processRequest(request: AgentRequest): Promise<AgentResponse>;
  
  /**
   * Health check endpoint implementation
   * @returns Promise<boolean> - Health status
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Implement health check logic
      return true;
    } catch (error) {
      this.logger.error('Health check failed', error);
      return false;
    }
  }
  
  private validateConfig(): void {
    if (!this.config.name) {
      throw new Error('Agent name is required');
    }
    
    if (!this.config.port || this.config.port < 1000) {
      throw new Error('Valid agent port is required');
    }
  }
}
```

#### **TypeScript Best Practices**
```typescript
// Use strict type definitions
interface StrictUserProfile {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

// Use union types for enums
type AgentStatus = 'active' | 'inactive' | 'maintenance' | 'error';

// Use generic types for reusable functions
function processAgentResponse<T>(
  response: AgentResponse<T>
): ProcessedResponse<T> {
  return {
    data: response.data,
    success: response.success,
    timestamp: new Date(),
  };
}

// Use proper error handling
async function callAgent(request: AgentRequest): Promise<AgentResponse> {
  try {
    const response = await agentClient.post('/process', request);
    return response.data;
  } catch (error) {
    if (error instanceof AgentTimeoutError) {
      throw new Error(`Agent timeout: ${error.message}`);
    }
    throw error;
  }
}
```

### **Python Standards**

#### **Code Organization**
```python
"""
Module docstring describing purpose and functionality
"""
# Standard library imports
import os
import json
from typing import Dict, List, Optional, Union
from datetime import datetime

# Third-party imports
import redis
import openai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, validator

# Local imports
from shared.types import AgentResponse, AgentRequest
from shared.utils.logger import Logger
from agents.base_agent import BaseAgent
```

#### **Naming Conventions**
```python
# Variables and functions: snake_case
user_name = 'john_doe'
def calculate_agent_confidence(score: float) -> float:
    """Calculate confidence score for agent routing."""
    pass

# Classes: PascalCase
class AgentRegistry:
    """Central registry for all system agents."""
    pass

class UserProfile(BaseModel):
    """User profile data model."""
    pass

# Constants: UPPER_SNAKE_CASE
MAX_RETRY_ATTEMPTS = 3
DEFAULT_TIMEOUT_SECONDS = 30

# Files: snake_case
agent_service.py
user_profile_model.py
api_client_utils.py
```

#### **Code Structure Example**
```python
# agents/shared/base_agent.py
"""
Base agent implementation for Progressive Framework V5
Provides common functionality and interfaces for all agents
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import asyncio
import logging
from datetime import datetime

from shared.types import AgentRequest, AgentResponse, AgentConfig
from shared.utils.logger import get_logger


class BaseAgent(ABC):
    """
    Abstract base class for all Progressive Framework V5 agents
    
    Provides common functionality including:
    - Request processing interface
    - Health checking
    - Logging and monitoring
    - Configuration validation
    """
    
    def __init__(self, config: AgentConfig) -> None:
        """
        Initialize base agent with configuration
        
        Args:
            config: Agent configuration object
            
        Raises:
            ValueError: If configuration is invalid
        """
        self.config = config
        self.logger = get_logger(config.name)
        self.start_time = datetime.utcnow()
        self._validate_config()
    
    @abstractmethod
    async def process_request(self, request: AgentRequest) -> AgentResponse:
        """
        Process incoming request and generate response
        
        Args:
            request: Incoming agent request
            
        Returns:
            AgentResponse: Processed response
            
        Raises:
            AgentProcessingError: If processing fails
        """
        pass
    
    async def health_check(self) -> Dict[str, Any]:
        """
        Perform health check and return status
        
        Returns:
            Dict containing health status and metrics
        """
        try:
            uptime = (datetime.utcnow() - self.start_time).total_seconds()
            
            return {
                'status': 'healthy',
                'uptime_seconds': uptime,
                'agent_type': self.config.agent_type,
                'version': self.config.version,
                'timestamp': datetime.utcnow().isoformat(),
            }
        except Exception as error:
            self.logger.error(f"Health check failed: {error}")
            return {
                'status': 'unhealthy',
                'error': str(error),
                'timestamp': datetime.utcnow().isoformat(),
            }
    
    def _validate_config(self) -> None:
        """Validate agent configuration"""
        if not self.config.name:
            raise ValueError("Agent name is required")
            
        if not self.config.port or self.config.port < 1000:
            raise ValueError("Valid agent port is required")
            
        if not self.config.agent_type:
            raise ValueError("Agent type is required")
```

#### **Python Best Practices**
```python
# Use type hints consistently
def process_nutrition_data(
    user_profile: UserProfile,
    dietary_preferences: List[str],
    calorie_target: Optional[int] = None
) -> NutritionPlan:
    """Process nutrition data and generate meal plan."""
    pass

# Use dataclasses for simple data structures
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class MealPlan:
    """Represents a complete meal plan."""
    id: str
    user_id: str
    meals: List[Meal]
    daily_calories: int
    daily_macros: MacroNutrients
    created_at: datetime
    duration_days: int = 7

# Use proper exception handling
class AgentProcessingError(Exception):
    """Raised when agent processing fails."""
    pass

async def call_external_api(url: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Call external API with proper error handling."""
    try:
        response = await http_client.post(url, json=data)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as error:
        logger.error(f"API call failed: {error}")
        raise AgentProcessingError(f"External API error: {error}")
```

### **Agent Development Standards**

#### **Agent Structure**
```
agents/
├── shared/
│   ├── __init__.py
│   ├── base_agent.py          # Base agent class
│   ├── agent_types.py         # Agent type definitions
│   └── communication.py       # Agent communication utilities
├── mca/                       # Master Control Agent
│   ├── __init__.py
│   ├── main.py               # Agent entry point
│   ├── mca_agent.py          # MCA implementation
│   ├── routing_engine.py     # Request routing logic
│   └── tests/
│       ├── test_mca.py
│       └── test_routing.py
├── npa/                       # Nutrition Planning Agent
│   ├── __init__.py
│   ├── main.py
│   ├── npa_agent.py
│   ├── meal_planner.py       # Core meal planning logic
│   └── nutrition_analyzer.py # Nutrition analysis
└── wpa/                       # Workout Planning Agent
    ├── __init__.py
    ├── main.py
    ├── wpa_agent.py
    ├── workout_designer.py    # Workout plan generation
    └── exercise_database.py   # Exercise data management
```

#### **Agent Implementation Template**
```python
# agents/example/example_agent.py
"""
Example Agent implementation for Progressive Framework V5
"""

from typing import Dict, Any, Optional
import asyncio
from datetime import datetime

from shared.base_agent import BaseAgent
from shared.types import AgentRequest, AgentResponse, AgentConfig
from shared.utils.metrics import record_metric


class ExampleAgent(BaseAgent):
    """
    Example Agent for demonstrating agent development patterns
    
    This agent provides a template for creating new specialized agents
    within the Progressive Framework V5 ecosystem.
    """
    
    def __init__(self, config: AgentConfig) -> None:
        """Initialize Example Agent with specific configuration."""
        super().__init__(config)
        self.specialization = config.get('specialization', 'general')
        self.confidence_threshold = config.get('confidence_threshold', 0.7)
        
        # Initialize agent-specific resources
        self._initialize_resources()
    
    async def process_request(self, request: AgentRequest) -> AgentResponse:
        """
        Process request and generate appropriate response
        
        Args:
            request: Incoming agent request
            
        Returns:
            AgentResponse: Processed response with confidence score
        """
        start_time = datetime.utcnow()
        
        try:
            # Validate request
            self._validate_request(request)
            
            # Process request based on agent logic
            result = await self._process_core_logic(request)
            
            # Calculate confidence score
            confidence = self._calculate_confidence(request, result)
            
            # Record metrics
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            record_metric('agent_processing_time', processing_time, {
                'agent_type': self.config.agent_type,
                'request_type': request.request_type
            })
            
            return AgentResponse(
                success=True,
                data=result,
                confidence=confidence,
                agent_id=self.config.agent_id,
                processing_time_ms=int(processing_time * 1000),
                metadata={
                    'specialization': self.specialization,
                    'timestamp': datetime.utcnow().isoformat(),
                }
            )
            
        except Exception as error:
            self.logger.error(f"Request processing failed: {error}")
            return AgentResponse(
                success=False,
                error=str(error),
                agent_id=self.config.agent_id,
                confidence=0.0
            )
    
    async def _process_core_logic(self, request: AgentRequest) -> Dict[str, Any]:
        """Implement agent-specific processing logic here."""
        # This is where agent-specific logic goes
        return {
            'message': 'Request processed successfully',
            'request_id': request.request_id,
            'specialization': self.specialization
        }
    
    def _calculate_confidence(
        self, 
        request: AgentRequest, 
        result: Dict[str, Any]
    ) -> float:
        """Calculate confidence score for the response."""
        # Implement confidence calculation logic
        base_confidence = 0.8
        
        # Adjust based on request complexity, data quality, etc.
        if request.context and len(request.context) > 0:
            base_confidence += 0.1
            
        return min(base_confidence, 1.0)
    
    def _validate_request(self, request: AgentRequest) -> None:
        """Validate incoming request."""
        if not request.message:
            raise ValueError("Request message is required")
            
        if not request.request_id:
            raise ValueError("Request ID is required")
    
    def _initialize_resources(self) -> None:
        """Initialize agent-specific resources."""
        self.logger.info(f"Initializing {self.config.agent_type} resources")
        # Initialize databases, external APIs, models, etc.
```

---

## **TESTING REQUIREMENTS**

### **Testing Philosophy**
- **Test-Driven Development**: Write tests before or alongside code
- **Comprehensive Coverage**: Aim for >90% code coverage
- **Fast Feedback**: Unit tests should run quickly (<5 seconds)
- **Isolation**: Tests should not depend on external services
- **Reliability**: Tests should be deterministic and not flaky

### **Testing Structure**

#### **Test Organization**
```
tests/
├── unit/                      # Fast, isolated tests
│   ├── agents/
│   │   ├── test_base_agent.py
│   │   ├── test_mca.py
│   │   ├── test_npa.py
│   │   └── test_wpa.py
│   ├── api/
│   │   ├── test_routes.ts
│   │   ├── test_middleware.ts
│   │   └── test_validation.ts
│   └── shared/
│       ├── test_utils.ts
│       └── test_types.py
├── integration/               # API and service tests
│   ├── test_agent_communication.ts
│   ├── test_database_operations.ts
│   ├── test_api_endpoints.ts
│   └── test_external_apis.py
├── e2e/                       # End-to-end tests
│   ├── test_user_workflows.ts
│   ├── test_agent_interactions.ts
│   └── test_admin_operations.ts
└── fixtures/                  # Test data and mocks
    ├── agent_responses.json
    ├── user_profiles.json
    └── mock_data.py
```

### **Unit Testing Standards**

#### **TypeScript/Jest Testing**
```typescript
// tests/unit/agents/test-agent-service.ts
import { AgentService } from '@/agents/agent-service';
import { AgentRegistry } from '@/shared/agent-registry';
import { Logger } from '@/shared/utils/logger';

// Mock external dependencies
jest.mock('@/shared/utils/logger');
jest.mock('@/shared/agent-registry');

describe('AgentService', () => {
  let agentService: AgentService;
  let mockLogger: jest.Mocked<Logger>;
  let mockRegistry: jest.Mocked<AgentRegistry>;

  beforeEach(() => {
    mockLogger = new Logger('test') as jest.Mocked<Logger>;
    mockRegistry = new AgentRegistry() as jest.Mocked<AgentRegistry>;
    
    agentService = new AgentService(mockRegistry, mockLogger);
  });

  describe('routeRequest', () => {
    it('should route nutrition requests to NPA', async () => {
      // Arrange
      const request = {
        message: 'I need a meal plan for weight loss',
        context: { userId: 'test-user' }
      };
      
      const mockAgent = {
        type: 'NPA',
        confidence: 0.9,
        processRequest: jest.fn().mockResolvedValue({
          success: true,
          data: { mealPlan: 'sample plan' }
        })
      };
      
      mockRegistry.findBestAgent.mockReturnValue(mockAgent);

      // Act
      const result = await agentService.routeRequest(request);

      // Assert
      expect(mockRegistry.findBestAgent).toHaveBeenCalledWith(request.message);
      expect(mockAgent.processRequest).toHaveBeenCalledWith(request);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ mealPlan: 'sample plan' });
    });

    it('should handle agent processing errors gracefully', async () => {
      // Arrange
      const request = {
        message: 'test message',
        context: { userId: 'test-user' }
      };
      
      const mockAgent = {
        type: 'NPA',
        processRequest: jest.fn().mockRejectedValue(new Error('Processing failed'))
      };
      
      mockRegistry.findBestAgent.mockReturnValue(mockAgent);

      // Act
      const result = await agentService.routeRequest(request);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Processing failed');
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('validateRequest', () => {
    it('should validate required fields', () => {
      // Test validation logic
      expect(() => {
        agentService.validateRequest({ message: '' });
      }).toThrow('Message is required');
    });
  });
});
```

#### **Python/pytest Testing**
```python
# tests/unit/agents/test_npa.py
"""Tests for Nutrition Planning Agent (NPA)"""

import pytest
from unittest.mock import Mock, AsyncMock, patch
from datetime import datetime

from agents.npa.npa_agent import NPAAgent
from shared.types import AgentRequest, AgentConfig
from shared.exceptions import AgentProcessingError


@pytest.fixture
def npa_config():
    """Create NPA configuration for testing."""
    return AgentConfig(
        name='test-npa',
        agent_type='NPA',
        port=8001,
        confidence_threshold=0.7
    )


@pytest.fixture
def npa_agent(npa_config):
    """Create NPA agent instance for testing."""
    return NPAAgent(npa_config)


@pytest.fixture
def sample_request():
    """Create sample agent request."""
    return AgentRequest(
        request_id='test-123',
        message='Create a high-protein meal plan',
        context={
            'user_id': 'user-123',
            'dietary_preferences': ['high-protein'],
            'calorie_target': 2000
        }
    )


class TestNPAAgent:
    """Test suite for Nutrition Planning Agent."""
    
    @pytest.mark.asyncio
    async def test_process_meal_plan_request(self, npa_agent, sample_request):
        """Test successful meal plan generation."""
        # Arrange
        expected_meal_plan = {
            'daily_calories': 2000,
            'meals': [
                {'type': 'breakfast', 'calories': 500},
                {'type': 'lunch', 'calories': 600},
                {'type': 'dinner', 'calories': 700},
                {'type': 'snack', 'calories': 200}
            ]
        }
        
        with patch.object(npa_agent, '_generate_meal_plan', 
                         return_value=expected_meal_plan) as mock_generate:
            
            # Act
            response = await npa_agent.process_request(sample_request)
            
            # Assert
            assert response.success is True
            assert response.confidence >= 0.7
            assert 'meal_plan' in response.data
            assert response.data['meal_plan'] == expected_meal_plan
            mock_generate.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_process_request_with_invalid_input(self, npa_agent):
        """Test error handling for invalid requests."""
        # Arrange
        invalid_request = AgentRequest(
            request_id='test-456',
            message='',  # Empty message should fail
            context={}
        )
        
        # Act
        response = await npa_agent.process_request(invalid_request)
        
        # Assert
        assert response.success is False
        assert 'Message is required' in response.error
        assert response.confidence == 0.0
    
    @pytest.mark.asyncio
    async def test_health_check(self, npa_agent):
        """Test agent health check functionality."""
        # Act
        health_status = await npa_agent.health_check()
        
        # Assert
        assert health_status['status'] == 'healthy'
        assert 'uptime_seconds' in health_status
        assert health_status['agent_type'] == 'NPA'
    
    def test_calculate_confidence_score(self, npa_agent, sample_request):
        """Test confidence score calculation."""
        # Arrange
        mock_result = {'meal_plan': {'meals': ['breakfast', 'lunch']}}
        
        # Act
        confidence = npa_agent._calculate_confidence(sample_request, mock_result)
        
        # Assert
        assert 0.0 <= confidence <= 1.0
        assert confidence >= 0.7  # Should meet threshold for good request
    
    @pytest.mark.parametrize('message,expected_confidence', [
        ('meal plan', 0.8),
        ('nutrition advice', 0.9),
        ('workout plan', 0.3),  # Low confidence for non-nutrition request
    ])
    def test_confidence_scoring_patterns(self, npa_agent, expected_confidence):
        """Test confidence scoring for different message patterns."""
        # Arrange
        request = AgentRequest(
            request_id='test',
            message=message,
            context={}
        )
        
        # Act
        confidence = npa_agent._calculate_message_confidence(request.message)
        
        # Assert
        assert abs(confidence - expected_confidence) < 0.2  # Allow some variance


@pytest.mark.integration
class TestNPAIntegration:
    """Integration tests for NPA agent."""
    
    @pytest.mark.asyncio
    async def test_full_meal_planning_workflow(self, npa_agent):
        """Test complete meal planning workflow."""
        # This would test the full integration with external APIs,
        # database operations, etc.
        pass
```

### **Integration Testing**

#### **API Integration Tests**
```typescript
// tests/integration/test-agent-api.ts
import request from 'supertest';
import { app } from '@/api/server';
import { testDb } from '@/tests/utils/test-database';

describe('Agent API Integration', () => {
  beforeEach(async () => {
    await testDb.reset();
    await testDb.seedTestData();
  });

  describe('POST /api/v1/agents/route', () => {
    it('should route nutrition requests correctly', async () => {
      const response = await request(app)
        .post('/api/v1/agents/route')
        .send({
          message: 'I need a meal plan for muscle building',
          context: {
            userId: 'test-user-123'
          }
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.routedTo).toBe('NPA');
      expect(response.body.confidence).toBeGreaterThan(0.7);
    });
  });

  describe('Agent Health Checks', () => {
    it('should return health status for all agents', async () => {
      const response = await request(app)
        .get('/api/v1/agents/status')
        .expect(200);

      expect(response.body.agents).toHaveProperty('MCA');
      expect(response.body.agents).toHaveProperty('NPA'); 
      expect(response.body.agents).toHaveProperty('WPA');
      
      Object.values(response.body.agents).forEach((agent: any) => {
        expect(agent.status).toBe('healthy');
        expect(agent.uptime_seconds).toBeGreaterThan(0);
      });
    });
  });
});
```

### **E2E Testing**

#### **End-to-End Test Example**
```typescript
// tests/e2e/test-user-workflows.ts
import { test, expect } from '@playwright/test';

test.describe('User Workflows', () => {
  test('complete nutrition consultation workflow', async ({ page }) => {
    // Navigate to application
    await page.goto('http://localhost:3000');
    
    // User authentication
    await page.click('[data-testid=login-button]');
    await page.fill('[data-testid=email-input]', 'test@example.com');
    await page.fill('[data-testid=password-input]', 'testpassword');
    await page.click('[data-testid=submit-login]');
    
    // Wait for dashboard
    await expect(page.locator('[data-testid=dashboard]')).toBeVisible();
    
    // Start nutrition consultation
    await page.click('[data-testid=nutrition-consultation]');
    
    // Fill nutrition form
    await page.fill('[data-testid=goal-input]', 'muscle building');
    await page.selectOption('[data-testid=diet-preference]', 'vegetarian');
    await page.fill('[data-testid=calorie-target]', '2500');
    
    // Submit request
    await page.click('[data-testid=generate-plan]');
    
    // Wait for agent processing
    await expect(page.locator('[data-testid=processing]')).toBeVisible();
    await expect(page.locator('[data-testid=processing]')).toBeHidden({ timeout: 30000 });
    
    // Verify meal plan generation
    await expect(page.locator('[data-testid=meal-plan]')).toBeVisible();
    await expect(page.locator('[data-testid=breakfast-meal]')).toBeVisible();
    await expect(page.locator('[data-testid=lunch-meal]')).toBeVisible();
    await expect(page.locator('[data-testid=dinner-meal]')).toBeVisible();
    
    // Verify calorie targets
    const totalCalories = await page.textContent('[data-testid=total-calories]');
    expect(parseInt(totalCalories!)).toBeCloseTo(2500, -2); // Within 100 calories
  });
});
```

### **Running Tests**

#### **Test Commands**
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit          # Fast unit tests
npm run test:integration   # API and service tests
npm run test:e2e           # End-to-end tests
npm run test:agents        # Agent-specific tests

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with specific pattern
npm test -- --testNamePattern="Agent.*routing"

# Run Python tests
cd agents && python -m pytest
cd agents && python -m pytest --cov=. --cov-report=html
```

#### **Test Configuration Files**
```json
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/api/src'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  collectCoverageFrom: [
    'api/src/**/*.ts',
    'shared/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};
```

```ini
# pytest.ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = 
    --verbose
    --tb=short
    --strict-markers
    --cov=agents
    --cov=shared
    --cov-report=term-missing
    --cov-report=html
    --cov-fail-under=85
markers =
    unit: Unit tests
    integration: Integration tests
    e2e: End-to-end tests
    slow: Tests that take a long time
```

---

## **PULL REQUEST PROCESS**

### **Pull Request Checklist**
- [ ] **Branch** is up-to-date with main branch
- [ ] **Tests** pass locally (`npm test`)
- [ ] **Linting** passes (`npm run lint`)
- [ ] **Type checking** passes (TypeScript)
- [ ] **Documentation** is updated if needed
- [ ] **Backwards compatibility** is maintained
- [ ] **Security** implications considered
- [ ] **Performance** impact assessed

### **Pull Request Template**
```markdown
## Description
Brief description of what this PR does and why.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement

## Related Issues
Closes #[issue_number]
Related to #[issue_number]

## Changes Made
- Bullet point list of changes
- Include any architectural decisions
- Mention any new dependencies

## Agent Impact
- [ ] No agent changes
- [ ] MCA (Master Control Agent) changes
- [ ] NPA (Nutrition Planning Agent) changes  
- [ ] WPA (Workout Planning Agent) changes
- [ ] New agent implementation
- [ ] Agent communication protocol changes

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed
- [ ] Performance testing completed (if applicable)

## Breaking Changes
Describe any breaking changes and migration path.

## Security Considerations
Describe any security implications of this change.

## Performance Impact
Describe any performance implications of this change.

## Screenshots/Videos
Include screenshots or videos if UI changes are involved.

## Checklist
- [ ] Code follows project coding standards
- [ ] Self-review of code completed
- [ ] Code is commented, particularly hard-to-understand areas
- [ ] Documentation updated (if applicable)
- [ ] Tests added/updated and passing
- [ ] No merge conflicts with main branch
```

### **Review Process**

#### **Code Review Guidelines**
1. **Automated Checks**: All CI checks must pass
2. **Required Reviewers**: At least 2 reviewers for code changes
3. **Domain Expertise**: Agent changes require review from agent domain expert
4. **Security Review**: Security-sensitive changes require security team review
5. **Documentation Review**: Documentation changes require technical writer review

#### **Review Criteria**
- **Functionality**: Does the code work as intended?
- **Code Quality**: Is the code clean, readable, and maintainable?
- **Testing**: Are there adequate tests covering the changes?
- **Performance**: Are there any performance implications?
- **Security**: Are there any security vulnerabilities?
- **Documentation**: Is the code properly documented?

#### **Review Response Time**
- **Bug fixes**: 24 hours
- **New features**: 48 hours
- **Documentation**: 72 hours
- **Breaking changes**: 1 week (requires architectural review)

---

## **COMMIT MESSAGE FORMAT**

### **Commit Message Structure**
```
<type>(<scope>): <subject>

<body>

<footer>
```

### **Types**
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect meaning (white-space, formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process or auxiliary tools

### **Scopes**
- **agents**: Agent-related changes (mca, npa, wpa, bma)
- **api**: API server changes
- **web**: Web interface changes
- **shared**: Shared utilities and types
- **docs**: Documentation changes
- **tests**: Test-related changes
- **ci**: CI/CD pipeline changes

### **Examples**
```bash
# Feature addition
feat(agents): implement Budget Management Agent (BMA)

Add new Budget Management Agent with core functionality:
- Budget planning and optimization
- Expense tracking and categorization
- Financial goal setting and monitoring
- Integration with existing agent ecosystem

Resolves #123

# Bug fix
fix(mca): resolve agent timeout handling

Fix issue where agent requests would timeout inconsistently
due to improper promise handling in the routing engine.

- Add proper timeout handling with configurable values
- Improve error messaging for timeout scenarios
- Add retry logic for transient failures

Fixes #456

# Documentation update
docs(api): update authentication documentation

Update API documentation to reflect new JWT implementation:
- Add examples for token refresh
- Document new error codes
- Update authentication flow diagrams

# Refactoring
refactor(shared): optimize agent communication protocol

Improve performance of inter-agent communication:
- Reduce message payload size by 30%
- Implement connection pooling
- Add compression for large responses

Performance improvement: ~200ms faster average response time
```

---

## **DOCUMENTATION STANDARDS**

### **Code Documentation**

#### **TypeScript Documentation**
```typescript
/**
 * Agent service responsible for routing requests to appropriate agents
 * and managing agent lifecycle within the Progressive Framework V5 ecosystem.
 * 
 * @example
 * ```typescript
 * const agentService = new AgentService(registry, logger);
 * const response = await agentService.routeRequest({
 *   message: "I need a workout plan",
 *   context: { userId: "123" }
 * });
 * ```
 */
export class AgentService {
  
  /**
   * Routes incoming request to the most appropriate agent based on content analysis
   * 
   * @param request - The incoming agent request containing message and context
   * @returns Promise resolving to agent response with confidence score
   * 
   * @throws {ValidationError} When request validation fails
   * @throws {AgentNotAvailableError} When no suitable agent is available
   * 
   * @example
   * ```typescript
   * const response = await agentService.routeRequest({
   *   message: "Create a meal plan for weight loss",
   *   context: { 
   *     userId: "user123",
   *     preferences: { diet: "vegetarian" }
   *   }
   * });
   * 
   * if (response.success) {
   *   console.log(`Routed to ${response.agentType} with ${response.confidence} confidence`);
   * }
   * ```
   */
  async routeRequest(request: AgentRequest): Promise<AgentResponse> {
    // Implementation...
  }
}
```

#### **Python Documentation**
```python
class NPAAgent(BaseAgent):
    """
    Nutrition Planning Agent specializing in meal planning and dietary analysis.
    
    The NPA provides comprehensive nutrition planning services including:
    - Personalized meal plan generation
    - Macro and micronutrient analysis
    - Dietary restriction accommodation
    - Caloric intake optimization
    
    Attributes:
        nutrition_database: Database of nutritional information
        meal_planner: Core meal planning engine
        confidence_threshold: Minimum confidence for recommendations
    
    Example:
        >>> config = AgentConfig(name='npa', port=8001, agent_type='NPA')
        >>> npa = NPAAgent(config)
        >>> request = AgentRequest(
        ...     message="Create a high-protein meal plan",
        ...     context={"calorie_target": 2000}
        ... )
        >>> response = await npa.process_request(request)
        >>> print(f"Generated meal plan with {response.confidence} confidence")
    """
    
    async def generate_meal_plan(
        self,
        user_profile: UserProfile,
        dietary_preferences: List[str],
        calorie_target: int,
        duration_days: int = 7
    ) -> MealPlan:
        """
        Generate personalized meal plan based on user requirements.
        
        Creates a comprehensive meal plan optimized for the user's specific
        dietary needs, preferences, and caloric targets. The plan includes
        macro and micronutrient optimization.
        
        Args:
            user_profile: User's demographic and health information
            dietary_preferences: List of dietary restrictions/preferences
                (e.g., ['vegetarian', 'gluten-free', 'high-protein'])
            calorie_target: Daily caloric intake target
            duration_days: Number of days to plan for (default: 7)
        
        Returns:
            MealPlan: Complete meal plan with daily meals and nutrition info
        
        Raises:
            ValidationError: If input parameters are invalid
            NutritionDatabaseError: If nutrition data is unavailable
            MealPlanningError: If meal plan generation fails
        
        Example:
            >>> profile = UserProfile(age=30, weight=70, height=175)
            >>> preferences = ['vegetarian', 'high-protein']
            >>> plan = await npa.generate_meal_plan(
            ...     profile, preferences, 2000, 7
            ... )
            >>> print(f"Generated {len(plan.meals)} meals")
        """
        # Implementation...
```

### **README Documentation**

#### **Project README Structure**
```markdown
# Progressive Framework V5

> Multi-Agent Intelligence System for comprehensive health and fitness management

[![Build Status](https://github.com/your-org/progressive-framework-v5/workflows/CI/badge.svg)](https://github.com/your-org/progressive-framework-v5/actions)
[![Coverage Status](https://codecov.io/gh/your-org/progressive-framework-v5/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/progressive-framework-v5)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Progressive Framework V5 is an advanced Multi-Agent Intelligence System that provides personalized health and fitness recommendations through specialized AI agents.

### Key Features

- **🤖 Multi-Agent Architecture**: Specialized agents for nutrition, workouts, and budget management
- **🧠 Intelligent Routing**: Automatic request routing to the most appropriate agent
- **📊 Comprehensive API**: RESTful API with full OpenAPI documentation
- **🔒 Enterprise Security**: JWT authentication, rate limiting, and audit logging
- **🚀 Production Ready**: Containerized, scalable, and cloud-native

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/progressive-framework-v5.git
   cd progressive-framework-v5
   ```

2. **Install dependencies**
   ```bash
   npm install
   pip install -r requirements.txt
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start services**
   ```bash
   npm run dev
   ```

5. **Verify installation**
   ```bash
   curl http://localhost:3000/api/v1/agents/status
   ```

Visit [Development Setup Guide](docs/13-Development/Development-Setup.md) for detailed instructions.

## Documentation

- **[📚 Complete Documentation](docs/)** - Comprehensive project documentation
- **[🚀 Getting Started](docs/08-User-Guides/Getting-Started.md)** - User onboarding guide
- **[💻 Development Setup](docs/13-Development/Development-Setup.md)** - Developer environment setup
- **[🤝 Contributing](docs/13-Development/Contributing-Guidelines.md)** - Contribution guidelines
- **[📡 API Reference](docs/03-Communication-Protocols/API-Documentation.md)** - Complete API documentation

## Architecture

### System Overview

Progressive Framework V5 consists of four main agents:

- **MCA (Master Control Agent)**: Intelligent request routing and coordination
- **NPA (Nutrition Planning Agent)**: Meal planning and dietary analysis
- **WPA (Workout Planning Agent)**: Exercise program design and fitness planning
- **BMA (Budget Management Agent)**: Financial planning and budget optimization

### Technology Stack

- **Backend**: Node.js, TypeScript, Express.js
- **Agents**: Python, FastAPI, Pydantic
- **Databases**: PostgreSQL, Redis, MongoDB
- **Frontend**: Next.js, React, Tailwind CSS
- **Infrastructure**: Docker, Kubernetes, Terraform

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](docs/13-Development/Contributing-Guidelines.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Run tests (`npm test`)
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **📖 Documentation**: [docs/](docs/)
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/your-org/progressive-framework-v5/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-org/progressive-framework-v5/discussions)
- **📧 Contact**: support@your-domain.com

---

Made with ❤️ by the Progressive Framework Team
```

---

## **BACKWARDS COMPATIBILITY**

### **Compatibility Guidelines**
- **API Versioning**: Use semantic versioning for API changes
- **Database Migrations**: Always provide forward and backward migrations
- **Configuration Changes**: Maintain backwards compatibility for config files
- **Agent Interfaces**: Preserve existing agent communication protocols

### **Breaking Changes Process**
1. **RFC Process**: Major changes require Request for Comments (RFC)
2. **Deprecation Warnings**: Mark deprecated features with warnings
3. **Migration Guide**: Provide clear migration documentation
4. **Gradual Rollout**: Phase out old features over multiple releases

---

## **SECURITY CONSIDERATIONS**

### **Code Security Standards**
- **Input Validation**: Validate all user inputs
- **SQL Injection Prevention**: Use parameterized queries
- **XSS Prevention**: Sanitize all output
- **Authentication**: Implement proper authentication mechanisms
- **Authorization**: Follow principle of least privilege

### **Sensitive Data Handling**
- **Environment Variables**: Store secrets in environment variables
- **API Keys**: Never commit API keys to repository
- **Database Credentials**: Use secure credential management
- **Logging**: Never log sensitive information

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[Development Setup](Development-Setup.md)** - Local development environment setup
- **[Agent Development Guide](../02-Agent-Management/Agent-Development-Guide.md)** - Agent development patterns
- **[API Documentation](../03-Communication-Protocols/API-Documentation.md)** - API standards and integration

### **Follow-up Documents**
- **[Testing Strategy](Testing-Strategy.md)** - Comprehensive testing approaches
- **[Deployment Guide](../05-DevOps/Deployment-Guide.md)** - Production deployment procedures
- **[System Administration](../09-Admin-Guides/System-Administration.md)** - Administrative procedures

### **Operations Context**
- **[Common Issues Resolution](../10-Troubleshooting/Common-Issues-Resolution.md)** - Troubleshooting guide
- **[Security Overview](../04-Security/Security-Overview.md)** - Security policies and procedures
- **[Monitoring & Alerting](../05-DevOps/Monitoring-Alerting.md)** - System monitoring setup

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | Development Team | Complete contributing guidelines for Progressive Framework V5 |
| 4.x | 2025-08-xx | Development Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: Development Team  
**Last Validated**: 2025-09-02