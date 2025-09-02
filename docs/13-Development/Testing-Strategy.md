---
file: docs/13-Development/Testing-Strategy.md
directory: docs/13-Development/
priority: CRITICAL
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# Testing Strategy - Progressive-Framework-v5

**File Path**: `docs/13-Development/Testing-Strategy.md`  
**Directory**: `docs/13-Development/`  
**Priority**: CRITICAL  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive testing strategy for Progressive-Framework-v5, covering the complete testing pyramid from unit tests to end-to-end integration, performance testing, security validation, and specialized agent coordination testing. This strategy ensures robust quality assurance across all system components including the enterprise core, context agents (MCA, NPA, WPA), and supporting infrastructure.

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🏗️ **[Agent Architecture](../02-Agent-System/Agent-Architecture.md)** - *Context agent system design*
- 🔧 **[Development Setup](Development-Setup.md)** - *Development environment configuration*
- 🚀 **[CI/CD Pipeline](../05-DevOps/CI-CD-Pipeline.md)** - *Deployment and automation workflows*
- 🛡️ **[Security Overview](../04-Security/Security-Overview.md)** - *Security requirements and testing*

---

## **TESTING PHILOSOPHY & STRATEGY**

### **Testing Pyramid Architecture**
```
Progressive-Framework-v5 Testing Pyramid:

                    🔺 E2E Tests (5%)
                   /              \
                  /   User Flows   \
                 /   Performance    \
                /    Security       \
               /_____________________\
              🔹 Integration Tests (20%)
             /                       \
            /    Service APIs         \
           /    Agent Coordination    \
          /     Database Integration  \
         /___________________________\
        🔸 Unit Tests (75%)
       /                             \
      /     Component Logic           \
     /     Business Rules             \
    /     Agent Intelligence          \
   /     Data Transformations         \
  /___________________________________\
```

### **Testing Principles**
1. **Test-Driven Development (TDD)** - Write tests before implementation
2. **Behavior-Driven Development (BDD)** - Tests express business requirements
3. **Fast Feedback Loops** - Quick test execution for rapid development
4. **Comprehensive Coverage** - Minimum 90% code coverage target
5. **Agent-Aware Testing** - Specialized testing for AI agent behavior
6. **Production Parity** - Test environments mirror production closely
7. **Automated Quality Gates** - No manual intervention for standard tests
8. **Continuous Testing** - Tests run on every code change

### **Testing Scope Coverage**
```yaml
testing_coverage:
  enterprise_core:
    - web_api_layer: 95%
    - business_logic: 98%
    - data_access: 92%
    - authentication: 100%
    - authorization: 100%
  
  context_agents:
    mca_coordination:
      - agent_orchestration: 95%
      - task_delegation: 98%
      - inter_agent_communication: 100%
    npa_nutrition:
      - meal_planning: 95%
      - nutrition_analysis: 92%
      - dietary_restrictions: 100%
    wpa_workout:
      - exercise_planning: 95%
      - progress_tracking: 90%
      - adaptive_programming: 88%
  
  infrastructure:
    - database_operations: 90%
    - caching_layer: 85%
    - message_queuing: 88%
    - monitoring: 95%
  
  security:
    - authentication_flows: 100%
    - authorization_policies: 100%
    - input_validation: 95%
    - encryption_decryption: 100%
```

---

## **UNIT TESTING FRAMEWORK**

### **Technology Stack**
```json
{
  "frameworks": {
    "javascript": {
      "testing_framework": "Jest 29.x",
      "assertion_library": "Jest + @testing-library/jest-dom",
      "mocking": "Jest mocks + MSW (Mock Service Worker)",
      "coverage": "Jest built-in coverage"
    },
    "python": {
      "testing_framework": "pytest 7.x",
      "assertion_library": "pytest + pytest-mock",
      "mocking": "unittest.mock + responses",
      "coverage": "pytest-cov"
    },
    "database": {
      "postgres_testing": "pytest-postgresql + factory-boy",
      "redis_testing": "fakeredis",
      "mongodb_testing": "mongomock"
    }
  },
  "test_runners": {
    "local_development": "npm test, pytest",
    "ci_cd_pipeline": "Jest/Pytest with parallel execution",
    "coverage_reporting": "Codecov integration"
  }
}
```

### **Unit Test Structure & Standards**
```javascript
// tests/unit/enterprise-core/auth/AuthService.test.js
import { AuthService } from '../../../../src/enterprise-core/auth/AuthService';
import { UserRepository } from '../../../../src/enterprise-core/repositories/UserRepository';
import { JWTService } from '../../../../src/enterprise-core/auth/JWTService';
import { PasswordHasher } from '../../../../src/enterprise-core/auth/PasswordHasher';

jest.mock('../../../../src/enterprise-core/repositories/UserRepository');
jest.mock('../../../../src/enterprise-core/auth/JWTService');
jest.mock('../../../../src/enterprise-core/auth/PasswordHasher');

describe('AuthService', () => {
  let authService;
  let mockUserRepository;
  let mockJWTService;
  let mockPasswordHasher;

  beforeEach(() => {
    mockUserRepository = new UserRepository();
    mockJWTService = new JWTService();
    mockPasswordHasher = new PasswordHasher();
    
    authService = new AuthService(
      mockUserRepository,
      mockJWTService,
      mockPasswordHasher
    );
  });

  describe('authenticateUser', () => {
    it('should successfully authenticate valid user credentials', async () => {
      // Arrange
      const email = 'user@example.com';
      const password = 'validPassword123';
      const hashedPassword = 'hashedPassword123';
      const user = {
        id: 1,
        email,
        password: hashedPassword,
        isActive: true
      };
      const expectedToken = 'jwt-token-123';

      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockPasswordHasher.verify.mockResolvedValue(true);
      mockJWTService.generateToken.mockReturnValue(expectedToken);

      // Act
      const result = await authService.authenticateUser(email, password);

      // Assert
      expect(result).toEqual({
        success: true,
        token: expectedToken,
        user: {
          id: user.id,
          email: user.email
        }
      });
      
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockPasswordHasher.verify).toHaveBeenCalledWith(password, hashedPassword);
      expect(mockJWTService.generateToken).toHaveBeenCalledWith({
        userId: user.id,
        email: user.email
      });
    });

    it('should reject authentication for invalid password', async () => {
      // Arrange
      const email = 'user@example.com';
      const password = 'invalidPassword';
      const user = { id: 1, email, password: 'hashedPassword123', isActive: true };

      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockPasswordHasher.verify.mockResolvedValue(false);

      // Act
      const result = await authService.authenticateUser(email, password);

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Invalid credentials'
      });
      
      expect(mockJWTService.generateToken).not.toHaveBeenCalled();
    });

    it('should reject authentication for non-existent user', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const password = 'password123';

      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await authService.authenticateUser(email, password);

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Invalid credentials'
      });
      
      expect(mockPasswordHasher.verify).not.toHaveBeenCalled();
      expect(mockJWTService.generateToken).not.toHaveBeenCalled();
    });

    it('should reject authentication for inactive user', async () => {
      // Arrange
      const email = 'inactive@example.com';
      const password = 'password123';
      const user = { id: 1, email, password: 'hashedPassword123', isActive: false };

      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockPasswordHasher.verify.mockResolvedValue(true);

      // Act
      const result = await authService.authenticateUser(email, password);

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Account is inactive'
      });
      
      expect(mockJWTService.generateToken).not.toHaveBeenCalled();
    });
  });

  describe('validateToken', () => {
    it('should successfully validate valid JWT token', () => {
      // Arrange
      const token = 'valid-jwt-token';
      const decodedPayload = { userId: 1, email: 'user@example.com' };

      mockJWTService.verifyToken.mockReturnValue(decodedPayload);

      // Act
      const result = authService.validateToken(token);

      // Assert
      expect(result).toEqual({
        valid: true,
        payload: decodedPayload
      });
      
      expect(mockJWTService.verifyToken).toHaveBeenCalledWith(token);
    });

    it('should reject invalid JWT token', () => {
      // Arrange
      const token = 'invalid-jwt-token';

      mockJWTService.verifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      const result = authService.validateToken(token);

      // Assert
      expect(result).toEqual({
        valid: false,
        error: 'Invalid token'
      });
    });
  });
});
```

### **Agent Unit Testing**
```python
# tests/unit/agents/mca/test_coordination_service.py
import pytest
from unittest.mock import Mock, AsyncMock, patch
from src.agents.mca.coordination_service import CoordinationService
from src.agents.mca.models.task import Task, TaskPriority, TaskStatus
from src.agents.common.communication.agent_client import AgentClient

class TestCoordinationService:
    
    @pytest.fixture
    def coordination_service(self):
        mock_npa_client = Mock(spec=AgentClient)
        mock_wpa_client = Mock(spec=AgentClient)
        return CoordinationService(
            npa_client=mock_npa_client,
            wpa_client=mock_wpa_client
        )
    
    @pytest.mark.asyncio
    async def test_coordinate_user_goal_success(self, coordination_service):
        """Test successful coordination of user goal across agents."""
        # Arrange
        user_goal = {
            'user_id': 'user123',
            'goal_type': 'weight_loss',
            'target_weight': 70.0,
            'timeframe_days': 90,
            'dietary_preferences': ['vegetarian'],
            'fitness_level': 'intermediate'
        }
        
        mock_nutrition_plan = {
            'daily_calories': 1800,
            'macros': {'protein': 30, 'carbs': 40, 'fat': 30},
            'meal_schedule': ['breakfast', 'lunch', 'dinner', 'snack']
        }
        
        mock_workout_plan = {
            'weekly_schedule': 4,
            'workout_types': ['cardio', 'strength'],
            'duration_minutes': 45,
            'intensity': 'moderate'
        }
        
        coordination_service.npa_client.create_nutrition_plan = AsyncMock(
            return_value=mock_nutrition_plan
        )
        coordination_service.wpa_client.create_workout_plan = AsyncMock(
            return_value=mock_workout_plan
        )
        
        # Act
        result = await coordination_service.coordinate_user_goal(user_goal)
        
        # Assert
        assert result['success'] is True
        assert result['coordination_id'] is not None
        assert result['nutrition_plan'] == mock_nutrition_plan
        assert result['workout_plan'] == mock_workout_plan
        
        # Verify agent interactions
        coordination_service.npa_client.create_nutrition_plan.assert_called_once_with(
            user_id='user123',
            goal_type='weight_loss',
            target_weight=70.0,
            dietary_preferences=['vegetarian']
        )
        
        coordination_service.wpa_client.create_workout_plan.assert_called_once_with(
            user_id='user123',
            goal_type='weight_loss',
            fitness_level='intermediate'
        )
    
    @pytest.mark.asyncio
    async def test_coordinate_user_goal_npa_failure(self, coordination_service):
        """Test handling of NPA failure during coordination."""
        # Arrange
        user_goal = {
            'user_id': 'user123',
            'goal_type': 'weight_loss',
            'target_weight': 70.0
        }
        
        coordination_service.npa_client.create_nutrition_plan = AsyncMock(
            side_effect=Exception("NPA service unavailable")
        )
        
        # Act
        result = await coordination_service.coordinate_user_goal(user_goal)
        
        # Assert
        assert result['success'] is False
        assert 'NPA service unavailable' in result['error']
        assert 'nutrition_plan' not in result
        assert 'workout_plan' not in result
    
    def test_prioritize_tasks(self, coordination_service):
        """Test task prioritization algorithm."""
        # Arrange
        tasks = [
            Task(id='1', priority=TaskPriority.LOW, estimated_duration=30),
            Task(id='2', priority=TaskPriority.HIGH, estimated_duration=15),
            Task(id='3', priority=TaskPriority.MEDIUM, estimated_duration=45),
            Task(id='4', priority=TaskPriority.HIGH, estimated_duration=60)
        ]
        
        # Act
        prioritized_tasks = coordination_service.prioritize_tasks(tasks)
        
        # Assert
        assert len(prioritized_tasks) == 4
        
        # High priority tasks should come first
        assert prioritized_tasks[0].priority == TaskPriority.HIGH
        assert prioritized_tasks[1].priority == TaskPriority.HIGH
        
        # Among same priority, shorter duration should come first
        assert prioritized_tasks[0].estimated_duration < prioritized_tasks[1].estimated_duration
        
        # Medium and low priority should follow
        assert prioritized_tasks[2].priority == TaskPriority.MEDIUM
        assert prioritized_tasks[3].priority == TaskPriority.LOW
    
    @pytest.mark.asyncio
    async def test_monitor_agent_health(self, coordination_service):
        """Test agent health monitoring functionality."""
        # Arrange
        coordination_service.npa_client.health_check = AsyncMock(
            return_value={'status': 'healthy', 'response_time': 50}
        )
        coordination_service.wpa_client.health_check = AsyncMock(
            return_value={'status': 'degraded', 'response_time': 200}
        )
        
        # Act
        health_status = await coordination_service.monitor_agent_health()
        
        # Assert
        assert health_status['npa']['status'] == 'healthy'
        assert health_status['npa']['response_time'] == 50
        assert health_status['wpa']['status'] == 'degraded'
        assert health_status['wpa']['response_time'] == 200
        assert health_status['overall'] == 'degraded'  # Degraded if any agent is degraded

@pytest.fixture
def mock_database():
    """Mock database fixture for testing."""
    with patch('src.common.database.get_connection') as mock_conn:
        yield mock_conn

@pytest.fixture
def mock_redis():
    """Mock Redis fixture for testing."""
    with patch('src.common.cache.redis_client') as mock_redis:
        yield mock_redis
```

---

## **INTEGRATION TESTING**

### **API Integration Testing**
```javascript
// tests/integration/api/auth.integration.test.js
import request from 'supertest';
import { app } from '../../../src/app';
import { DatabaseTestHelper } from '../../helpers/DatabaseTestHelper';
import { RedisTestHelper } from '../../helpers/RedisTestHelper';

describe('Authentication API Integration', () => {
  let dbHelper;
  let redisHelper;

  beforeAll(async () => {
    dbHelper = new DatabaseTestHelper();
    redisHelper = new RedisTestHelper();
    await dbHelper.setup();
    await redisHelper.setup();
  });

  afterAll(async () => {
    await dbHelper.cleanup();
    await redisHelper.cleanup();
  });

  beforeEach(async () => {
    await dbHelper.clearTables(['users', 'sessions']);
    await redisHelper.flushAll();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should authenticate user and return JWT token', async () => {
      // Arrange - Create test user in database
      const testUser = await dbHelper.createUser({
        email: 'test@example.com',
        password: 'hashedPassword123',
        isActive: true
      });

      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'  // Raw password
        })
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        token: expect.any(String),
        user: {
          id: testUser.id,
          email: testUser.email
        }
      });

      // Verify JWT token structure
      const tokenParts = response.body.token.split('.');
      expect(tokenParts).toHaveLength(3);

      // Verify session is cached in Redis
      const cachedSession = await redisHelper.get(`session:${testUser.id}`);
      expect(cachedSession).toBeTruthy();
    });

    it('should return 401 for invalid credentials', async () => {
      // Arrange
      await dbHelper.createUser({
        email: 'test@example.com',
        password: 'hashedPassword123',
        isActive: true
      });

      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongPassword'
        })
        .expect(401);

      // Assert
      expect(response.body).toEqual({
        success: false,
        error: 'Invalid credentials'
      });
    });

    it('should return 401 for inactive user', async () => {
      // Arrange
      await dbHelper.createUser({
        email: 'inactive@example.com',
        password: 'hashedPassword123',
        isActive: false
      });

      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'inactive@example.com',
          password: 'password123'
        })
        .expect(401);

      // Assert
      expect(response.body).toEqual({
        success: false,
        error: 'Account is inactive'
      });
    });
  });

  describe('GET /api/v1/auth/profile', () => {
    it('should return user profile for authenticated request', async () => {
      // Arrange
      const testUser = await dbHelper.createUser({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true
      });

      const authToken = await getAuthToken(testUser.id);

      // Act
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        id: testUser.id,
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it('should return 401 for missing authorization header', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .expect(401);

      // Assert
      expect(response.body).toEqual({
        error: 'Authorization token required'
      });
    });

    it('should return 401 for invalid token', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      // Assert
      expect(response.body).toEqual({
        error: 'Invalid token'
      });
    });
  });
});

// Helper function to generate auth tokens for testing
async function getAuthToken(userId) {
  const { JWTService } = require('../../../src/enterprise-core/auth/JWTService');
  const jwtService = new JWTService();
  return jwtService.generateToken({ userId });
}
```

### **Agent Communication Integration Testing**
```python
# tests/integration/agents/test_agent_communication.py
import pytest
import asyncio
from httpx import AsyncClient
from fastapi import FastAPI
from unittest.mock import AsyncMock

from src.agents.mca.app import create_mca_app
from src.agents.npa.app import create_npa_app
from src.agents.wpa.app import create_wpa_app
from tests.helpers.agent_test_helper import AgentTestHelper

class TestAgentCommunication:
    
    @pytest.fixture
    async def agent_apps(self):
        """Create test instances of all agent applications."""
        mca_app = create_mca_app(testing=True)
        npa_app = create_npa_app(testing=True)
        wpa_app = create_wpa_app(testing=True)
        
        return {
            'mca': mca_app,
            'npa': npa_app,
            'wpa': wpa_app
        }
    
    @pytest.fixture
    async def agent_clients(self, agent_apps):
        """Create HTTP clients for each agent."""
        clients = {}
        for agent_name, app in agent_apps.items():
            clients[agent_name] = AsyncClient(app=app, base_url=f"http://test-{agent_name}")
        
        yield clients
        
        # Cleanup
        for client in clients.values():
            await client.aclose()
    
    @pytest.mark.asyncio
    async def test_mca_coordinates_nutrition_and_workout_planning(self, agent_clients):
        """Test MCA coordination of NPA and WPA for complete user goal."""
        
        # Arrange
        user_goal_request = {
            "user_id": "test-user-123",
            "goal_type": "weight_loss",
            "target_weight": 70.0,
            "current_weight": 80.0,
            "timeframe_days": 90,
            "dietary_preferences": ["vegetarian", "low_sodium"],
            "fitness_level": "intermediate",
            "available_workout_days": ["monday", "wednesday", "friday", "saturday"]
        }
        
        # Act - Send coordination request to MCA
        mca_response = await agent_clients['mca'].post(
            "/api/v1/coordinate/user-goal",
            json=user_goal_request
        )
        
        # Assert
        assert mca_response.status_code == 200
        coordination_result = mca_response.json()
        
        assert coordination_result['success'] is True
        assert 'coordination_id' in coordination_result
        assert 'nutrition_plan' in coordination_result
        assert 'workout_plan' in coordination_result
        
        # Verify nutrition plan details
        nutrition_plan = coordination_result['nutrition_plan']
        assert nutrition_plan['daily_calories'] > 0
        assert 'macros' in nutrition_plan
        assert nutrition_plan['dietary_restrictions'] == ['vegetarian', 'low_sodium']
        
        # Verify workout plan details
        workout_plan = coordination_result['workout_plan']
        assert workout_plan['weekly_sessions'] <= 4  # Based on available days
        assert 'exercise_types' in workout_plan
        assert workout_plan['fitness_level'] == 'intermediate'
    
    @pytest.mark.asyncio
    async def test_agent_health_checks(self, agent_clients):
        """Test health check endpoints for all agents."""
        
        for agent_name, client in agent_clients.items():
            # Act
            response = await client.get("/health")
            
            # Assert
            assert response.status_code == 200
            health_data = response.json()
            
            assert health_data['status'] in ['healthy', 'degraded', 'unhealthy']
            assert 'timestamp' in health_data
            assert 'version' in health_data
            assert health_data['agent_type'] == agent_name.upper()
    
    @pytest.mark.asyncio
    async def test_cross_agent_data_consistency(self, agent_clients):
        """Test data consistency across agents for shared user data."""
        
        # Arrange
        user_profile_data = {
            "user_id": "consistency-test-user",
            "age": 30,
            "gender": "female",
            "height_cm": 165,
            "weight_kg": 70,
            "activity_level": "moderate",
            "dietary_preferences": ["gluten_free"],
            "fitness_goals": ["strength", "endurance"]
        }
        
        # Act - Update user profile in both NPA and WPA
        npa_update_response = await agent_clients['npa'].put(
            "/api/v1/user/profile",
            json=user_profile_data
        )
        
        wpa_update_response = await agent_clients['wpa'].put(
            "/api/v1/user/profile",
            json=user_profile_data
        )
        
        # Assert updates were successful
        assert npa_update_response.status_code == 200
        assert wpa_update_response.status_code == 200
        
        # Act - Retrieve user profile from both agents
        npa_profile_response = await agent_clients['npa'].get(
            f"/api/v1/user/profile/{user_profile_data['user_id']}"
        )
        
        wpa_profile_response = await agent_clients['wpa'].get(
            f"/api/v1/user/profile/{user_profile_data['user_id']}"
        )
        
        # Assert profiles are consistent
        assert npa_profile_response.status_code == 200
        assert wpa_profile_response.status_code == 200
        
        npa_profile = npa_profile_response.json()
        wpa_profile = wpa_profile_response.json()
        
        # Verify critical shared data consistency
        assert npa_profile['age'] == wpa_profile['age']
        assert npa_profile['weight_kg'] == wpa_profile['weight_kg']
        assert npa_profile['activity_level'] == wpa_profile['activity_level']
    
    @pytest.mark.asyncio
    async def test_agent_error_handling_and_fallbacks(self, agent_clients):
        """Test agent behavior when dependent services are unavailable."""
        
        # Simulate NPA being unavailable by using invalid endpoint
        coordination_request = {
            "user_id": "error-test-user",
            "goal_type": "muscle_gain",
            "target_weight": 75.0
        }
        
        # Mock NPA service failure in MCA
        with pytest.MonkeyPatch().context() as m:
            # This would require dependency injection in production code
            # For this example, we'll test the error response directly
            
            # Act - Send request when NPA is "unavailable"
            response = await agent_clients['mca'].post(
                "/api/v1/coordinate/user-goal-with-npa-failure",
                json=coordination_request
            )
            
            # Assert
            assert response.status_code in [503, 500]  # Service unavailable or internal error
            error_response = response.json()
            
            assert error_response['success'] is False
            assert 'error' in error_response
            assert 'NPA' in error_response['error'] or 'nutrition' in error_response['error'].lower()
    
    @pytest.mark.asyncio
    async def test_agent_concurrent_request_handling(self, agent_clients):
        """Test agent performance under concurrent requests."""
        
        # Arrange
        concurrent_requests = 10
        user_requests = []
        
        for i in range(concurrent_requests):
            user_requests.append({
                "user_id": f"concurrent-user-{i}",
                "goal_type": "weight_maintenance",
                "current_weight": 70 + i,  # Vary weights
                "target_weight": 70 + i
            })
        
        # Act - Send concurrent requests to MCA
        tasks = []
        for request_data in user_requests:
            task = agent_clients['mca'].post(
                "/api/v1/coordinate/user-goal",
                json=request_data
            )
            tasks.append(task)
        
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Assert
        successful_responses = 0
        for response in responses:
            if not isinstance(response, Exception):
                assert response.status_code in [200, 201]
                successful_responses += 1
        
        # At least 80% of requests should succeed under load
        success_rate = successful_responses / concurrent_requests
        assert success_rate >= 0.8, f"Success rate {success_rate} below threshold"
```

---

## **END-TO-END TESTING**

### **E2E Test Framework Setup**
```javascript
// tests/e2e/framework/E2ETestFramework.js
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Chrome } from 'selenium-webdriver/chrome';
import { DatabaseTestHelper } from '../../helpers/DatabaseTestHelper';
import { RedisTestHelper } from '../../helpers/RedisTestHelper';

export class E2ETestFramework {
  constructor(config = {}) {
    this.config = {
      baseUrl: process.env.E2E_BASE_URL || 'http://localhost:3000',
      timeout: process.env.E2E_TIMEOUT || 30000,
      headless: process.env.E2E_HEADLESS === 'true',
      ...config
    };
    
    this.driver = null;
    this.dbHelper = new DatabaseTestHelper();
    this.redisHelper = new RedisTestHelper();
  }

  async setup() {
    // Setup test databases
    await this.dbHelper.setup();
    await this.redisHelper.setup();
    
    // Configure Chrome options
    const chromeOptions = new Chrome.Options();
    
    if (this.config.headless) {
      chromeOptions.addArguments('--headless');
    }
    
    chromeOptions.addArguments(
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080'
    );
    
    // Create WebDriver instance
    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();
    
    await this.driver.manage().setTimeouts({ implicit: this.config.timeout });
  }

  async teardown() {
    if (this.driver) {
      await this.driver.quit();
    }
    
    await this.dbHelper.cleanup();
    await this.redisHelper.cleanup();
  }

  async navigateToPage(path) {
    const url = `${this.config.baseUrl}${path}`;
    await this.driver.get(url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.driver.wait(
      until.elementLocated(By.css('body')),
      this.config.timeout
    );
    
    // Wait for any loading indicators to disappear
    try {
      await this.driver.wait(
        until.stalenessOf(await this.driver.findElement(By.css('.loading'))),
        5000
      );
    } catch (e) {
      // Loading indicator might not be present
    }
  }

  async login(email, password) {
    await this.navigateToPage('/login');
    
    // Fill login form
    await this.driver.findElement(By.name('email')).sendKeys(email);
    await this.driver.findElement(By.name('password')).sendKeys(password);
    
    // Submit form
    await this.driver.findElement(By.css('button[type="submit"]')).click();
    
    // Wait for redirect to dashboard
    await this.driver.wait(
      until.urlContains('/dashboard'),
      this.config.timeout
    );
  }

  async createTestUser(userData = {}) {
    const defaultUser = {
      email: 'e2e-test@example.com',
      password: 'TestPassword123!',
      firstName: 'E2E',
      lastName: 'Test',
      isActive: true,
      ...userData
    };
    
    return await this.dbHelper.createUser(defaultUser);
  }

  async waitForElement(locator, timeout = this.config.timeout) {
    return await this.driver.wait(
      until.elementLocated(locator),
      timeout
    );
  }

  async waitForText(locator, text, timeout = this.config.timeout) {
    return await this.driver.wait(
      until.elementTextContains(await this.driver.findElement(locator), text),
      timeout
    );
  }

  async takeScreenshot(filename) {
    const screenshot = await this.driver.takeScreenshot();
    const fs = require('fs');
    const path = require('path');
    
    const screenshotPath = path.join(__dirname, '../screenshots', `${filename}.png`);
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
    
    return screenshotPath;
  }
}
```

### **Complete User Journey E2E Tests**
```javascript
// tests/e2e/user-journeys/CompleteHealthJourney.e2e.test.js
import { E2ETestFramework } from '../framework/E2ETestFramework';
import { By, until } from 'selenium-webdriver';

describe('Complete Health Journey - E2E Tests', () => {
  let e2eFramework;
  let testUser;

  beforeAll(async () => {
    e2eFramework = new E2ETestFramework();
    await e2eFramework.setup();
  }, 60000);

  afterAll(async () => {
    if (e2eFramework) {
      await e2eFramework.teardown();
    }
  }, 30000);

  beforeEach(async () => {
    // Clean state for each test
    await e2eFramework.dbHelper.clearTables(['users', 'user_profiles', 'nutrition_plans', 'workout_plans']);
    await e2eFramework.redisHelper.flushAll();
    
    // Create test user
    testUser = await e2eFramework.createTestUser({
      email: 'health-journey@example.com',
      firstName: 'Journey',
      lastName: 'Tester'
    });
  });

  test('Complete User Onboarding and Goal Setting Journey', async () => {
    try {
      // Step 1: User Registration and Login
      await e2eFramework.navigateToPage('/register');
      
      // Fill registration form
      await e2eFramework.driver.findElement(By.name('firstName')).sendKeys('New');
      await e2eFramework.driver.findElement(By.name('lastName')).sendKeys('User');
      await e2eFramework.driver.findElement(By.name('email')).sendKeys('new-user@example.com');
      await e2eFramework.driver.findElement(By.name('password')).sendKeys('SecurePassword123!');
      await e2eFramework.driver.findElement(By.name('confirmPassword')).sendKeys('SecurePassword123!');
      
      // Submit registration
      await e2eFramework.driver.findElement(By.css('button[type="submit"]')).click();
      
      // Wait for email verification page
      await e2eFramework.driver.wait(
        until.urlContains('/verify-email'),
        10000
      );
      
      // For E2E testing, simulate email verification by directly updating database
      await e2eFramework.dbHelper.verifyUserEmail('new-user@example.com');
      
      // Navigate to login
      await e2eFramework.navigateToPage('/login');
      await e2eFramework.login('new-user@example.com', 'SecurePassword123!');
      
      // Step 2: Profile Setup
      await e2eFramework.driver.wait(
        until.urlContains('/onboarding/profile'),
        10000
      );
      
      // Fill profile information
      await e2eFramework.driver.findElement(By.name('age')).sendKeys('28');
      await e2eFramework.driver.findElement(By.name('gender')).sendKeys('female');
      await e2eFramework.driver.findElement(By.name('height')).sendKeys('165');
      await e2eFramework.driver.findElement(By.name('weight')).sendKeys('70');
      
      // Select activity level
      await e2eFramework.driver.findElement(By.css('[data-testid="activity-moderate"]')).click();
      
      // Continue to next step
      await e2eFramework.driver.findElement(By.css('[data-testid="continue-button"]')).click();
      
      // Step 3: Health Goals Setting
      await e2eFramework.driver.wait(
        until.urlContains('/onboarding/goals'),
        10000
      );
      
      // Select weight loss goal
      await e2eFramework.driver.findElement(By.css('[data-testid="goal-weight-loss"]')).click();
      
      // Set target weight
      await e2eFramework.driver.findElement(By.name('targetWeight')).clear();
      await e2eFramework.driver.findElement(By.name('targetWeight')).sendKeys('65');
      
      // Set timeframe
      await e2eFramework.driver.findElement(By.name('timeframe')).sendKeys('12');
      
      // Continue to preferences
      await e2eFramework.driver.findElement(By.css('[data-testid="continue-button"]')).click();
      
      // Step 4: Dietary Preferences
      await e2eFramework.driver.wait(
        until.urlContains('/onboarding/dietary-preferences'),
        10000
      );
      
      // Select dietary preferences
      await e2eFramework.driver.findElement(By.css('[data-testid="preference-vegetarian"]')).click();
      await e2eFramework.driver.findElement(By.css('[data-testid="preference-low-sodium"]')).click();
      
      // Add food allergies
      await e2eFramework.driver.findElement(By.name('allergies')).sendKeys('nuts, shellfish');
      
      // Continue to workout preferences
      await e2eFramework.driver.findElement(By.css('[data-testid="continue-button"]')).click();
      
      // Step 5: Workout Preferences
      await e2eFramework.driver.wait(
        until.urlContains('/onboarding/workout-preferences'),
        10000
      );
      
      // Select workout types
      await e2eFramework.driver.findElement(By.css('[data-testid="workout-cardio"]')).click();
      await e2eFramework.driver.findElement(By.css('[data-testid="workout-strength"]')).click();
      
      // Select available days
      await e2eFramework.driver.findElement(By.css('[data-testid="day-monday"]')).click();
      await e2eFramework.driver.findElement(By.css('[data-testid="day-wednesday"]')).click();
      await e2eFramework.driver.findElement(By.css('[data-testid="day-friday"]')).click();
      
      // Set preferred workout duration
      await e2eFramework.driver.findElement(By.name('workoutDuration')).sendKeys('45');
      
      // Complete onboarding
      await e2eFramework.driver.findElement(By.css('[data-testid="complete-onboarding"]')).click();
      
      // Step 6: Verify Plan Generation
      await e2eFramework.driver.wait(
        until.urlContains('/dashboard'),
        15000  // Allow time for agent coordination
      );
      
      // Verify nutrition plan is displayed
      const nutritionPlan = await e2eFramework.waitForElement(
        By.css('[data-testid="nutrition-plan"]')
      );
      expect(await nutritionPlan.isDisplayed()).toBe(true);
      
      // Verify workout plan is displayed
      const workoutPlan = await e2eFramework.waitForElement(
        By.css('[data-testid="workout-plan"]')
      );
      expect(await workoutPlan.isDisplayed()).toBe(true);
      
      // Verify goal summary
      const goalSummary = await e2eFramework.driver.findElement(
        By.css('[data-testid="goal-summary"]')
      );
      const goalText = await goalSummary.getText();
      expect(goalText).toContain('Weight Loss');
      expect(goalText).toContain('65 kg');
      
      // Step 7: Verify Agent Coordination Worked
      // Check that both nutrition and workout plans contain personalized data
      const dailyCalories = await e2eFramework.driver.findElement(
        By.css('[data-testid="daily-calories"]')
      );
      expect(await dailyCalories.getText()).toMatch(/\d+/); // Should contain numbers
      
      const weeklyWorkouts = await e2eFramework.driver.findElement(
        By.css('[data-testid="weekly-workouts"]')
      );
      expect(await weeklyWorkouts.getText()).toContain('3'); // Should match selected days
      
      console.log('✅ Complete user onboarding journey successful');
      
    } catch (error) {
      // Take screenshot on failure
      await e2eFramework.takeScreenshot(`onboarding-failure-${Date.now()}`);
      throw error;
    }
  }, 120000); // 2 minutes timeout for complete journey

  test('Nutrition Plan Interaction and Modification', async () => {
    try {
      // Setup: Login with existing user
      await e2eFramework.login(testUser.email, 'TestPassword123!');
      
      // Navigate to nutrition plan
      await e2eFramework.driver.findElement(By.css('[data-testid="nutrition-tab"]')).click();
      
      await e2eFramework.driver.wait(
        until.urlContains('/nutrition'),
        10000
      );
      
      // Step 1: View current meal plan
      const mealPlan = await e2eFramework.waitForElement(
        By.css('[data-testid="meal-plan"]')
      );
      expect(await mealPlan.isDisplayed()).toBe(true);
      
      // Step 2: Request meal plan modification
      await e2eFramework.driver.findElement(By.css('[data-testid="modify-plan"]')).click();
      
      // Wait for modification modal
      await e2eFramework.waitForElement(By.css('[data-testid="modification-modal"]'));
      
      // Select modification type
      await e2eFramework.driver.findElement(By.css('[data-testid="reduce-carbs"]')).click();
      await e2eFramework.driver.findElement(By.name('reason')).sendKeys('Feeling too full after meals');
      
      // Submit modification request
      await e2eFramework.driver.findElement(By.css('[data-testid="submit-modification"]')).click();
      
      // Step 3: Wait for NPA to process the modification
      await e2eFramework.driver.wait(
        until.elementLocated(By.css('[data-testid="plan-updated-message"]')),
        20000
      );
      
      // Step 4: Verify plan was updated
      const updatedPlan = await e2eFramework.driver.findElement(
        By.css('[data-testid="meal-plan"]')
      );
      const planContent = await updatedPlan.getText();
      
      // Should contain indication of reduced carbs
      expect(planContent).toMatch(/reduced|lower|carb/i);
      
      console.log('✅ Nutrition plan modification successful');
      
    } catch (error) {
      await e2eFramework.takeScreenshot(`nutrition-modification-failure-${Date.now()}`);
      throw error;
    }
  }, 90000);

  test('Workout Plan Adaptation Based on Progress', async () => {
    try {
      // Setup: Login and navigate to workout section
      await e2eFramework.login(testUser.email, 'TestPassword123!');
      await e2eFramework.driver.findElement(By.css('[data-testid="workout-tab"]')).click();
      
      // Step 1: View current workout plan
      await e2eFramework.waitForElement(By.css('[data-testid="workout-plan"]'));
      
      // Step 2: Log workout completion
      await e2eFramework.driver.findElement(By.css('[data-testid="log-workout"]')).click();
      
      // Fill workout completion form
      await e2eFramework.driver.findElement(By.name('workoutType')).sendKeys('strength');
      await e2eFramework.driver.findElement(By.name('duration')).sendKeys('50');
      await e2eFramework.driver.findElement(By.name('intensity')).sendKeys('high');
      await e2eFramework.driver.findElement(By.name('notes')).sendKeys('Felt strong, could increase weight next time');
      
      // Submit workout log
      await e2eFramework.driver.findElement(By.css('[data-testid="submit-workout-log"]')).click();
      
      // Step 3: Repeat workout logging for progression
      for (let i = 0; i < 3; i++) {
        await e2eFramework.driver.findElement(By.css('[data-testid="log-workout"]')).click();
        
        await e2eFramework.driver.findElement(By.name('workoutType')).clear();
        await e2eFramework.driver.findElement(By.name('workoutType')).sendKeys('strength');
        await e2eFramework.driver.findElement(By.name('duration')).clear();
        await e2eFramework.driver.findElement(By.name('duration')).sendKeys('55');
        await e2eFramework.driver.findElement(By.name('intensity')).clear();
        await e2eFramework.driver.findElement(By.name('intensity')).sendKeys('high');
        
        await e2eFramework.driver.findElement(By.css('[data-testid="submit-workout-log"]')).click();
        
        // Wait a bit between logs
        await e2eFramework.driver.sleep(1000);
      }
      
      // Step 4: Trigger plan adaptation
      await e2eFramework.driver.findElement(By.css('[data-testid="request-adaptation"]')).click();
      
      // Wait for WPA to analyze progress and adapt plan
      await e2eFramework.driver.wait(
        until.elementLocated(By.css('[data-testid="plan-adapted-message"]')),
        25000
      );
      
      // Step 5: Verify plan adaptation
      const adaptedPlan = await e2eFramework.driver.findElement(
        By.css('[data-testid="workout-plan"]')
      );
      const planContent = await adaptedPlan.getText();
      
      // Should contain indication of progression (increased weight, duration, etc.)
      expect(planContent).toMatch(/increased|progress|advanced/i);
      
      console.log('✅ Workout plan adaptation successful');
      
    } catch (error) {
      await e2eFramework.takeScreenshot(`workout-adaptation-failure-${Date.now()}`);
      throw error;
    }
  }, 120000);
});
```

---

## **PERFORMANCE TESTING**

### **Load Testing Configuration**
```javascript
// tests/performance/load-testing.k6.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics
export let apiErrorRate = new Rate('api_errors');
export let apiRequestDuration = new Trend('api_request_duration');
export let agentCoordinationDuration = new Trend('agent_coordination_duration');
export let databaseQueryDuration = new Trend('database_query_duration');

// Test configuration
export let options = {
  stages: [
    // Ramp up
    { duration: '2m', target: 10 },   // Ramp up to 10 users
    { duration: '3m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 200 },  // Ramp up to 200 users
    
    // Sustained load
    { duration: '10m', target: 200 }, // Stay at 200 users
    
    // Peak load
    { duration: '3m', target: 500 },  // Spike to 500 users
    { duration: '2m', target: 500 },  // Stay at 500 users
    
    // Ramp down
    { duration: '3m', target: 100 },  // Scale down to 100 users
    { duration: '2m', target: 0 },    // Scale down to 0 users
  ],
  
  thresholds: {
    'http_req_duration': ['p(95)<2000'], // 95% of requests under 2s
    'http_req_failed': ['rate<0.1'],     // Error rate under 10%
    'api_errors': ['rate<0.05'],         // API error rate under 5%
    'agent_coordination_duration': ['p(95)<5000'], // Agent coordination under 5s
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/v1`;

// Test data
const testUsers = [
  { email: 'loadtest1@example.com', password: 'LoadTest123!' },
  { email: 'loadtest2@example.com', password: 'LoadTest123!' },
  { email: 'loadtest3@example.com', password: 'LoadTest123!' },
  // Add more test users as needed
];

let authTokens = [];

export function setup() {
  console.log('Setting up load test...');
  
  // Authenticate test users and store tokens
  for (let user of testUsers) {
    let loginResponse = http.post(`${API_URL}/auth/login`, JSON.stringify({
      email: user.email,
      password: user.password
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (loginResponse.status === 200) {
      let token = JSON.parse(loginResponse.body).token;
      authTokens.push(token);
    }
  }
  
  console.log(`Setup complete. ${authTokens.length} users authenticated.`);
  return { authTokens };
}

export default function(data) {
  // Select random auth token
  let token = data.authTokens[Math.floor(Math.random() * data.authTokens.length)];
  
  let headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  
  // Test scenario distribution
  let scenario = Math.random();
  
  if (scenario < 0.4) {
    // 40% - Dashboard and profile access
    testDashboardAccess(headers);
  } else if (scenario < 0.7) {
    // 30% - Nutrition plan operations
    testNutritionOperations(headers);
  } else if (scenario < 0.9) {
    // 20% - Workout plan operations
    testWorkoutOperations(headers);
  } else {
    // 10% - Agent coordination (most resource intensive)
    testAgentCoordination(headers);
  }
  
  sleep(Math.random() * 3 + 1); // Random sleep 1-4 seconds
}

function testDashboardAccess(headers) {
  let responses = http.batch([
    ['GET', `${API_URL}/dashboard`, null, { headers }],
    ['GET', `${API_URL}/user/profile`, null, { headers }],
    ['GET', `${API_URL}/user/goals`, null, { headers }],
    ['GET', `${API_URL}/user/progress`, null, { headers }],
  ]);
  
  responses.forEach((response, index) => {
    let success = check(response, {
      [`Dashboard endpoint ${index} status 200`]: (r) => r.status === 200,
      [`Dashboard endpoint ${index} response time OK`]: (r) => r.timings.duration < 1000,
    });
    
    apiErrorRate.add(!success);
    apiRequestDuration.add(response.timings.duration);
  });
}

function testNutritionOperations(headers) {
  // Get current nutrition plan
  let nutritionPlanResponse = http.get(`${API_URL}/nutrition/plan`, { headers });
  
  let success = check(nutritionPlanResponse, {
    'Nutrition plan status 200': (r) => r.status === 200,
    'Nutrition plan response time OK': (r) => r.timings.duration < 1500,
    'Nutrition plan has content': (r) => r.body.length > 100,
  });
  
  apiErrorRate.add(!success);
  apiRequestDuration.add(nutritionPlanResponse.timings.duration);
  
  // Log food intake (simulate user interaction)
  let foodLogResponse = http.post(`${API_URL}/nutrition/food-log`, JSON.stringify({
    date: new Date().toISOString().split('T')[0],
    meals: [
      {
        type: 'breakfast',
        items: [
          { food: 'oatmeal', quantity: 100, unit: 'g' },
          { food: 'banana', quantity: 1, unit: 'medium' }
        ]
      }
    ]
  }), { headers });
  
  success = check(foodLogResponse, {
    'Food log status 200/201': (r) => [200, 201].includes(r.status),
    'Food log response time OK': (r) => r.timings.duration < 1000,
  });
  
  apiErrorRate.add(!success);
  apiRequestDuration.add(foodLogResponse.timings.duration);
}

function testWorkoutOperations(headers) {
  // Get current workout plan
  let workoutPlanResponse = http.get(`${API_URL}/workout/plan`, { headers });
  
  let success = check(workoutPlanResponse, {
    'Workout plan status 200': (r) => r.status === 200,
    'Workout plan response time OK': (r) => r.timings.duration < 1500,
    'Workout plan has content': (r) => r.body.length > 100,
  });
  
  apiErrorRate.add(!success);
  apiRequestDuration.add(workoutPlanResponse.timings.duration);
  
  // Log workout completion
  let workoutLogResponse = http.post(`${API_URL}/workout/log`, JSON.stringify({
    date: new Date().toISOString().split('T')[0],
    workoutType: 'strength',
    duration: 45,
    exercises: [
      { name: 'squats', sets: 3, reps: 12, weight: 60 },
      { name: 'bench press', sets: 3, reps: 10, weight: 70 }
    ]
  }), { headers });
  
  success = check(workoutLogResponse, {
    'Workout log status 200/201': (r) => [200, 201].includes(r.status),
    'Workout log response time OK': (r) => r.timings.duration < 1000,
  });
  
  apiErrorRate.add(!success);
  apiRequestDuration.add(workoutLogResponse.timings.duration);
}

function testAgentCoordination(headers) {
  // Test MCA coordination endpoint (most resource intensive)
  let coordinationStart = Date.now();
  
  let coordinationResponse = http.post(`${API_URL}/agents/mca/coordinate`, JSON.stringify({
    goalType: 'weight_loss',
    targetWeight: 65,
    timeframeDays: 90,
    urgency: 'normal'
  }), { headers });
  
  let coordinationDuration = Date.now() - coordinationStart;
  
  let success = check(coordinationResponse, {
    'Agent coordination status 200': (r) => r.status === 200,
    'Agent coordination response time OK': (r) => r.timings.duration < 8000,
    'Agent coordination has results': (r) => {
      try {
        let body = JSON.parse(r.body);
        return body.nutritionPlan && body.workoutPlan;
      } catch (e) {
        return false;
      }
    },
  });
  
  apiErrorRate.add(!success);
  apiRequestDuration.add(coordinationResponse.timings.duration);
  agentCoordinationDuration.add(coordinationDuration);
}

export function teardown(data) {
  console.log('Load test completed');
  console.log(`Tested with ${data.authTokens.length} authenticated users`);
}
```

### **Database Performance Testing**
```python
# tests/performance/database_performance.py
import asyncio
import time
import statistics
import psycopg2
import redis
import pymongo
from concurrent.futures import ThreadPoolExecutor
import pytest

class DatabasePerformanceTest:
    
    def __init__(self):
        self.postgres_config = {
            'host': 'localhost',
            'database': 'progressive_framework_v5_test',
            'user': 'test_user',
            'password': 'test_password'
        }
        
        self.redis_config = {
            'host': 'localhost',
            'port': 6379,
            'db': 1  # Test database
        }
        
        self.mongodb_config = {
            'host': 'localhost',
            'port': 27017,
            'database': 'progressive_framework_v5_test'
        }
        
        self.test_results = {}
    
    def setup_test_data(self):
        """Create test data for performance testing."""
        # Setup PostgreSQL test data
        conn = psycopg2.connect(**self.postgres_config)
        cursor = conn.cursor()
        
        # Create test users
        for i in range(10000):
            cursor.execute("""
                INSERT INTO users (email, first_name, last_name, created_at)
                VALUES (%s, %s, %s, NOW())
                ON CONFLICT (email) DO NOTHING
            """, (f'perftest{i}@example.com', f'User{i}', 'Test'))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        # Setup Redis test data
        redis_client = redis.Redis(**self.redis_config)
        for i in range(1000):
            redis_client.set(f'session:user{i}', f'session_data_{i}')
            redis_client.expire(f'session:user{i}', 3600)
        
        # Setup MongoDB test data
        mongo_client = pymongo.MongoClient(
            host=self.mongodb_config['host'],
            port=self.mongodb_config['port']
        )
        db = mongo_client[self.mongodb_config['database']]
        
        nutrition_plans = []
        for i in range(1000):
            nutrition_plans.append({
                'user_id': f'user{i}',
                'plan_type': 'weight_loss',
                'daily_calories': 1800,
                'meals': [
                    {'type': 'breakfast', 'calories': 400},
                    {'type': 'lunch', 'calories': 600},
                    {'type': 'dinner', 'calories': 600},
                    {'type': 'snack', 'calories': 200}
                ],
                'created_at': time.time()
            })
        
        db.nutrition_plans.insert_many(nutrition_plans)
    
    def test_postgresql_performance(self, concurrent_users=100, operations_per_user=10):
        """Test PostgreSQL performance under load."""
        def run_postgres_operations(user_id):
            conn = psycopg2.connect(**self.postgres_config)
            cursor = conn.cursor()
            
            operation_times = []
            
            for i in range(operations_per_user):
                start_time = time.time()
                
                # Mix of read and write operations
                if i % 3 == 0:
                    # Insert user profile
                    cursor.execute("""
                        INSERT INTO user_profiles (user_id, age, weight_kg, height_cm)
                        VALUES (%s, %s, %s, %s)
                        ON CONFLICT (user_id) DO UPDATE SET
                        weight_kg = EXCLUDED.weight_kg,
                        updated_at = NOW()
                    """, (user_id, 30, 70.5, 170))
                    conn.commit()
                elif i % 3 == 1:
                    # Read user data with joins
                    cursor.execute("""
                        SELECT u.email, u.first_name, up.age, up.weight_kg
                        FROM users u
                        LEFT JOIN user_profiles up ON u.id = up.user_id
                        WHERE u.id = %s
                    """, (user_id,))
                    cursor.fetchone()
                else:
                    # Complex query with aggregation
                    cursor.execute("""
                        SELECT COUNT(*), AVG(weight_kg), MIN(age), MAX(age)
                        FROM user_profiles
                        WHERE created_at > NOW() - INTERVAL '30 days'
                    """)
                    cursor.fetchone()
                
                operation_times.append(time.time() - start_time)
            
            cursor.close()
            conn.close()
            return operation_times
        
        # Run concurrent operations
        with ThreadPoolExecutor(max_workers=concurrent_users) as executor:
            futures = []
            for i in range(concurrent_users):
                futures.append(executor.submit(run_postgres_operations, i + 1))
            
            all_operation_times = []
            for future in futures:
                all_operation_times.extend(future.result())
        
        # Calculate performance metrics
        self.test_results['postgresql'] = {
            'total_operations': len(all_operation_times),
            'avg_response_time': statistics.mean(all_operation_times),
            'p95_response_time': statistics.quantiles(all_operation_times, n=20)[18],  # 95th percentile
            'p99_response_time': statistics.quantiles(all_operation_times, n=100)[98], # 99th percentile
            'min_response_time': min(all_operation_times),
            'max_response_time': max(all_operation_times),
            'operations_per_second': len(all_operation_times) / sum(all_operation_times) if sum(all_operation_times) > 0 else 0
        }
        
        return self.test_results['postgresql']
    
    def test_redis_performance(self, concurrent_users=100, operations_per_user=50):
        """Test Redis performance under load."""
        def run_redis_operations(user_id):
            redis_client = redis.Redis(**self.redis_config)
            operation_times = []
            
            for i in range(operations_per_user):
                start_time = time.time()
                
                if i % 4 == 0:
                    # Set operation
                    redis_client.set(f'test:user{user_id}:op{i}', f'data_{user_id}_{i}')
                elif i % 4 == 1:
                    # Get operation
                    redis_client.get(f'session:user{user_id % 1000}')
                elif i % 4 == 2:
                    # Hash operations
                    redis_client.hset(f'user:{user_id}', 'last_activity', int(time.time()))
                    redis_client.hget(f'user:{user_id}', 'last_activity')
                else:
                    # List operations
                    redis_client.lpush(f'notifications:user{user_id}', f'notification_{i}')
                    redis_client.lrange(f'notifications:user{user_id}', 0, 10)
                
                operation_times.append(time.time() - start_time)
            
            return operation_times
        
        with ThreadPoolExecutor(max_workers=concurrent_users) as executor:
            futures = []
            for i in range(concurrent_users):
                futures.append(executor.submit(run_redis_operations, i + 1))
            
            all_operation_times = []
            for future in futures:
                all_operation_times.extend(future.result())
        
        self.test_results['redis'] = {
            'total_operations': len(all_operation_times),
            'avg_response_time': statistics.mean(all_operation_times),
            'p95_response_time': statistics.quantiles(all_operation_times, n=20)[18],
            'p99_response_time': statistics.quantiles(all_operation_times, n=100)[98],
            'min_response_time': min(all_operation_times),
            'max_response_time': max(all_operation_times),
            'operations_per_second': len(all_operation_times) / sum(all_operation_times) if sum(all_operation_times) > 0 else 0
        }
        
        return self.test_results['redis']
    
    def test_mongodb_performance(self, concurrent_users=50, operations_per_user=20):
        """Test MongoDB performance under load."""
        def run_mongodb_operations(user_id):
            mongo_client = pymongo.MongoClient(
                host=self.mongodb_config['host'],
                port=self.mongodb_config['port']
            )
            db = mongo_client[self.mongodb_config['database']]
            
            operation_times = []
            
            for i in range(operations_per_user):
                start_time = time.time()
                
                if i % 3 == 0:
                    # Insert document
                    db.workout_logs.insert_one({
                        'user_id': f'user{user_id}',
                        'workout_type': 'strength',
                        'duration': 45,
                        'exercises': [
                            {'name': 'squats', 'sets': 3, 'reps': 12},
                            {'name': 'bench_press', 'sets': 3, 'reps': 10}
                        ],
                        'timestamp': time.time()
                    })
                elif i % 3 == 1:
                    # Find documents
                    list(db.nutrition_plans.find({'user_id': f'user{user_id % 1000}'}).limit(5))
                else:
                    # Aggregation query
                    list(db.workout_logs.aggregate([
                        {'$match': {'user_id': f'user{user_id % 100}'}},
                        {'$group': {
                            '_id': '$workout_type',
                            'total_duration': {'$sum': '$duration'},
                            'count': {'$sum': 1}
                        }}
                    ]))
                
                operation_times.append(time.time() - start_time)
            
            mongo_client.close()
            return operation_times
        
        with ThreadPoolExecutor(max_workers=concurrent_users) as executor:
            futures = []
            for i in range(concurrent_users):
                futures.append(executor.submit(run_mongodb_operations, i + 1))
            
            all_operation_times = []
            for future in futures:
                all_operation_times.extend(future.result())
        
        self.test_results['mongodb'] = {
            'total_operations': len(all_operation_times),
            'avg_response_time': statistics.mean(all_operation_times),
            'p95_response_time': statistics.quantiles(all_operation_times, n=20)[18],
            'p99_response_time': statistics.quantiles(all_operation_times, n=100)[98],
            'min_response_time': min(all_operation_times),
            'max_response_time': max(all_operation_times),
            'operations_per_second': len(all_operation_times) / sum(all_operation_times) if sum(all_operation_times) > 0 else 0
        }
        
        return self.test_results['mongodb']
    
    def run_full_performance_suite(self):
        """Run complete database performance test suite."""
        print("🚀 Starting Database Performance Test Suite")
        print("=" * 50)
        
        # Setup test data
        print("📊 Setting up test data...")
        self.setup_test_data()
        
        # Run PostgreSQL tests
        print("🐘 Testing PostgreSQL performance...")
        postgres_results = self.test_postgresql_performance()
        
        # Run Redis tests
        print("🔴 Testing Redis performance...")
        redis_results = self.test_redis_performance()
        
        # Run MongoDB tests
        print("🍃 Testing MongoDB performance...")
        mongodb_results = self.test_mongodb_performance()
        
        # Print results
        self.print_performance_report()
        
        # Validate performance thresholds
        self.validate_performance_thresholds()
    
    def print_performance_report(self):
        """Print detailed performance report."""
        print("\n" + "=" * 60)
        print("📊 DATABASE PERFORMANCE REPORT")
        print("=" * 60)
        
        for db_name, results in self.test_results.items():
            print(f"\n🔍 {db_name.upper()} PERFORMANCE:")
            print(f"  Total Operations: {results['total_operations']:,}")
            print(f"  Operations/Second: {results['operations_per_second']:.2f}")
            print(f"  Average Response: {results['avg_response_time']*1000:.2f}ms")
            print(f"  95th Percentile: {results['p95_response_time']*1000:.2f}ms")
            print(f"  99th Percentile: {results['p99_response_time']*1000:.2f}ms")
            print(f"  Min Response: {results['min_response_time']*1000:.2f}ms")
            print(f"  Max Response: {results['max_response_time']*1000:.2f}ms")
    
    def validate_performance_thresholds(self):
        """Validate performance against defined thresholds."""
        thresholds = {
            'postgresql': {
                'p95_response_time': 0.1,  # 100ms
                'operations_per_second': 50
            },
            'redis': {
                'p95_response_time': 0.01,  # 10ms
                'operations_per_second': 1000
            },
            'mongodb': {
                'p95_response_time': 0.05,  # 50ms
                'operations_per_second': 100
            }
        }
        
        print("\n" + "=" * 60)
        print("✅ PERFORMANCE VALIDATION")
        print("=" * 60)
        
        for db_name, results in self.test_results.items():
            if db_name in thresholds:
                threshold = thresholds[db_name]
                print(f"\n{db_name.upper()}:")
                
                # Check P95 response time
                p95_ok = results['p95_response_time'] <= threshold['p95_response_time']
                print(f"  P95 Response Time: {'✅' if p95_ok else '❌'} "
                      f"{results['p95_response_time']*1000:.2f}ms "
                      f"(threshold: {threshold['p95_response_time']*1000:.0f}ms)")
                
                # Check operations per second
                ops_ok = results['operations_per_second'] >= threshold['operations_per_second']
                print(f"  Operations/Second: {'✅' if ops_ok else '❌'} "
                      f"{results['operations_per_second']:.2f} "
                      f"(threshold: {threshold['operations_per_second']})")
                
                if not (p95_ok and ops_ok):
                    print(f"  ⚠️  {db_name.upper()} performance below thresholds!")

if __name__ == "__main__":
    test = DatabasePerformanceTest()
    test.run_full_performance_suite()
```

---

## **SECURITY TESTING**

### **Automated Security Testing**
```javascript
// tests/security/security-testing.js
import { test, expect } from '@playwright/test';
import { SecurityTestHelper } from '../helpers/SecurityTestHelper';

class SecurityTestSuite {
  constructor() {
    this.helper = new SecurityTestHelper();
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  }

  // Authentication Security Tests
  async testAuthenticationSecurity() {
    console.log('🔒 Testing Authentication Security...');
    
    const tests = [
      this.testBruteForceProtection(),
      this.testPasswordPolicyEnforcement(),
      this.testSessionManagement(),
      this.testTokenSecurity(),
    ];
    
    return Promise.all(tests);
  }

  async testBruteForceProtection() {
    // Test rate limiting on login attempts
    const loginAttempts = [];
    
    for (let i = 0; i < 10; i++) {
      loginAttempts.push(
        fetch(`${this.baseUrl}/api/v1/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'brute-force-test@example.com',
            password: 'wrong-password'
          })
        })
      );
    }
    
    const responses = await Promise.all(loginAttempts);
    
    // Should see rate limiting kick in
    const rateLimitedResponses = responses.filter(r => r.status === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
    
    console.log('✅ Brute force protection working');
  }

  async testPasswordPolicyEnforcement() {
    const weakPasswords = [
      'password',
      '123456',
      'qwerty',
      'abc123',
      'password123'
    ];
    
    for (const weakPassword of weakPasswords) {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `weakpass-test-${Date.now()}@example.com`,
          password: weakPassword,
          firstName: 'Test',
          lastName: 'User'
        })
      });
      
      // Should reject weak passwords
      expect(response.status).toBe(400);
      
      const errorData = await response.json();
      expect(errorData.error).toMatch(/password.*weak|password.*requirements/i);
    }
    
    console.log('✅ Password policy enforcement working');
  }

  async testSessionManagement() {
    // Test session timeout and invalidation
    const loginResponse = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'session-test@example.com',
        password: 'ValidPassword123!'
      })
    });
    
    expect(loginResponse.status).toBe(200);
    const { token } = await loginResponse.json();
    
    // Test logout invalidates session
    const logoutResponse = await fetch(`${this.baseUrl}/api/v1/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    expect(logoutResponse.status).toBe(200);
    
    // Token should be invalid after logout
    const profileResponse = await fetch(`${this.baseUrl}/api/v1/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    expect(profileResponse.status).toBe(401);
    
    console.log('✅ Session management working');
  }

  async testTokenSecurity() {
    // Test JWT token manipulation
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSJ9.invalid_signature';
    
    const response = await fetch(`${this.baseUrl}/api/v1/auth/profile`, {
      headers: { 'Authorization': `Bearer ${validToken}` }
    });
    
    expect(response.status).toBe(401);
    
    console.log('✅ Token security working');
  }

  // Input Validation Security Tests
  async testInputValidationSecurity() {
    console.log('🛡️ Testing Input Validation Security...');
    
    const tests = [
      this.testSQLInjection(),
      this.testXSSPrevention(),
      this.testCSRFProtection(),
      this.testInputSanitization(),
    ];
    
    return Promise.all(tests);
  }

  async testSQLInjection() {
    const sqlInjectionPayloads = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "' UNION SELECT * FROM users --",
      "admin'--",
      "admin' /*"
    ];
    
    for (const payload of sqlInjectionPayloads) {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payload,
          password: 'any_password'
        })
      });
      
      // Should not cause internal server error (500)
      // Should return proper validation error (400) or unauthorized (401)
      expect([400, 401]).toContain(response.status);
      expect(response.status).not.toBe(500);
    }
    
    console.log('✅ SQL injection protection working');
  }

  async testXSSPrevention() {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '"><script>alert("XSS")</script>',
      '<img src="x" onerror="alert(\'XSS\')">',
      'javascript:alert("XSS")',
      '<svg onload="alert(\'XSS\')">'
    ];
    
    const token = await this.helper.getValidAuthToken();
    
    for (const payload of xssPayloads) {
      // Test XSS in profile update
      const response = await fetch(`${this.baseUrl}/api/v1/user/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: payload,
          lastName: 'Test'
        })
      });
      
      if (response.status === 200) {
        // If accepted, verify it's properly escaped in response
        const userData = await response.json();
        expect(userData.firstName).not.toContain('<script>');
        expect(userData.firstName).not.toContain('javascript:');
      }
    }
    
    console.log('✅ XSS prevention working');
  }

  async testCSRFProtection() {
    // Test CSRF protection on state-changing operations
    const token = await this.helper.getValidAuthToken();
    
    // Attempt to make state-changing request without CSRF protection
    const response = await fetch(`${this.baseUrl}/api/v1/user/profile`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://malicious-site.com'  // Different origin
      }
    });
    
    // Should have CSRF protection (either token required or origin check)
    expect([403, 400]).toContain(response.status);
    
    console.log('✅ CSRF protection working');
  }

  async testInputSanitization() {
    const token = await this.helper.getValidAuthToken();
    
    // Test various dangerous input patterns
    const dangerousInputs = [
      '../../../etc/passwd',
      '../../admin/config',
      'null',
      'undefined',
      '${7*7}',
      '#{7*7}',
      '<%= 7*7 %>',
    ];
    
    for (const input of dangerousInputs) {
      const response = await fetch(`${this.baseUrl}/api/v1/user/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: input,
          lastName: 'Test'
        })
      });
      
      // Should either reject the input or sanitize it
      if (response.status === 200) {
        const userData = await response.json();
        expect(userData.firstName).not.toBe(input); // Should be sanitized
      } else {
        expect(response.status).toBe(400); // Should reject invalid input
      }
    }
    
    console.log('✅ Input sanitization working');
  }

  // Agent Security Tests
  async testAgentSecurity() {
    console.log('🤖 Testing Agent Security...');
    
    const tests = [
      this.testAgentAuthentication(),
      this.testAgentAuthorization(),
      this.testAgentInputValidation(),
      this.testInterAgentCommunicationSecurity(),
    ];
    
    return Promise.all(tests);
  }

  async testAgentAuthentication() {
    // Test agent endpoint authentication
    const agentEndpoints = [
      '/api/v1/agents/mca/coordinate',
      '/api/v1/agents/npa/nutrition-plan',
      '/api/v1/agents/wpa/workout-plan'
    ];
    
    for (const endpoint of agentEndpoints) {
      // Test without authentication
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' })
      });
      
      expect(response.status).toBe(401);
    }
    
    console.log('✅ Agent authentication working');
  }

  async testAgentAuthorization() {
    // Test agent authorization levels
    const userToken = await this.helper.getValidAuthToken();
    const adminToken = await this.helper.getAdminAuthToken();
    
    // Test user access to agent coordination (should be allowed)
    const userResponse = await fetch(`${this.baseUrl}/api/v1/agents/mca/coordinate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        goalType: 'weight_loss',
        targetWeight: 70
      })
    });
    
    expect([200, 201, 400]).toContain(userResponse.status); // Not 403
    
    // Test admin access to agent management (should be allowed)
    const adminResponse = await fetch(`${this.baseUrl}/api/v1/agents/admin/status`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    expect([200, 201]).toContain(adminResponse.status);
    
    console.log('✅ Agent authorization working');
  }

  async testAgentInputValidation() {
    const token = await this.helper.getValidAuthToken();
    
    // Test agent input validation with malformed data
    const malformedRequests = [
      { goalType: 'invalid_goal', targetWeight: 'not_a_number' },
      { goalType: null, targetWeight: -50 },
      { goalType: '<script>alert("xss")</script>', targetWeight: 1000000 },
    ];
    
    for (const malformedData of malformedRequests) {
      const response = await fetch(`${this.baseUrl}/api/v1/agents/mca/coordinate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(malformedData)
      });
      
      expect(response.status).toBe(400); // Should reject invalid input
    }
    
    console.log('✅ Agent input validation working');
  }

  async testInterAgentCommunicationSecurity() {
    // Test that inter-agent communication is properly secured
    // This would require access to agent internal endpoints
    
    // Attempt to access internal agent communication endpoints
    const internalEndpoints = [
      '/internal/agents/npa/process',
      '/internal/agents/wpa/process',
      '/internal/coordination/sync'
    ];
    
    const token = await this.helper.getValidAuthToken();
    
    for (const endpoint of internalEndpoints) {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ test: 'data' })
      });
      
      // Internal endpoints should not be accessible externally
      expect([404, 403]).toContain(response.status);
    }
    
    console.log('✅ Inter-agent communication security working');
  }

  // Run complete security test suite
  async runSecurityTestSuite() {
    console.log('🛡️ Starting Security Test Suite');
    console.log('=' * 50);
    
    try {
      await this.testAuthenticationSecurity();
      await this.testInputValidationSecurity();
      await this.testAgentSecurity();
      
      console.log('\n✅ All security tests passed!');
      return true;
    } catch (error) {
      console.error('\n❌ Security test failed:', error);
      return false;
    }
  }
}

// Security Test Helper
class SecurityTestHelper {
  constructor() {
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  }

  async getValidAuthToken() {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'security-test@example.com',
        password: 'ValidPassword123!'
      })
    });
    
    if (response.status === 200) {
      const data = await response.json();
      return data.token;
    }
    
    throw new Error('Failed to get valid auth token');
  }

  async getAdminAuthToken() {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'AdminPassword123!'
      })
    });
    
    if (response.status === 200) {
      const data = await response.json();
      return data.token;
    }
    
    throw new Error('Failed to get admin auth token');
  }
}

export { SecurityTestSuite, SecurityTestHelper };
```

---

## **CI/CD INTEGRATION**

### **Test Pipeline Configuration**
```yaml
# .github/workflows/testing-pipeline.yml
name: Progressive-Framework-v5 Testing Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '18.x'
  PYTHON_VERSION: '3.11'
  POSTGRES_DB: progressive_framework_v5_test
  POSTGRES_USER: test_user
  POSTGRES_PASSWORD: test_password
  REDIS_URL: redis://localhost:6379/1
  MONGODB_URL: mongodb://localhost:27017/progressive_framework_v5_test

jobs:
  # Unit Tests
  unit-tests:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        component: [enterprise-core, mca-agent, npa-agent, wpa-agent]
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: ${{ env.POSTGRES_DB }}
          POSTGRES_USER: ${{ env.POSTGRES_USER }}
          POSTGRES_PASSWORD: ${{ env.POSTGRES_PASSWORD }}
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
      
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: ${{ env.PYTHON_VERSION }}
    
    - name: Install dependencies
      run: |
        npm ci
        pip install -r requirements-test.txt
    
    - name: Setup test databases
      run: |
        npm run db:test:setup
        python scripts/setup_test_data.py
    
    - name: Run unit tests - ${{ matrix.component }}
      run: |
        if [[ "${{ matrix.component }}" == "enterprise-core" ]]; then
          npm run test:unit:core -- --coverage
        else
          python -m pytest tests/unit/${{ matrix.component }}/ -v --cov=src/${{ matrix.component }} --cov-report=xml
        fi
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
        flags: unit-tests,${{ matrix.component }}
        name: ${{ matrix.component }}-unit-tests
  
  # Integration Tests
  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: ${{ env.POSTGRES_DB }}
          POSTGRES_USER: ${{ env.POSTGRES_USER }}
          POSTGRES_PASSWORD: ${{ env.POSTGRES_PASSWORD }}
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
      
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: ${{ env.PYTHON_VERSION }}
    
    - name: Install dependencies
      run: |
        npm ci
        pip install -r requirements-test.txt
    
    - name: Start application services
      run: |
        docker-compose -f docker-compose.test.yml up -d
        sleep 30  # Wait for services to be ready
    
    - name: Run integration tests
      run: |
        npm run test:integration
        python -m pytest tests/integration/ -v
    
    - name: Upload integration test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: integration-test-results
        path: |
          test-results/
          logs/
  
  # End-to-End Tests
  e2e-tests:
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright
      run: npx playwright install --with-deps
    
    - name: Start full application stack
      run: |
        docker-compose -f docker-compose.e2e.yml up -d
        sleep 60  # Wait for full stack to be ready
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload E2E test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: e2e-test-results
        path: |
          test-results/
          screenshots/
          videos/
  
  # Performance Tests
  performance-tests:
    runs-on: ubuntu-latest
    needs: [integration-tests]
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install k6
      run: |
        sudo gpg -k
        sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
        echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
        sudo apt-get update
        sudo apt-get install k6
    
    - name: Start performance test environment
      run: |
        docker-compose -f docker-compose.perf.yml up -d
        sleep 45
    
    - name: Run load tests
      run: |
        k6 run tests/performance/load-testing.k6.js
    
    - name: Run database performance tests
      run: |
        python tests/performance/database_performance.py
    
    - name: Upload performance results
      uses: actions/upload-artifact@v3
      with:
        name: performance-test-results
        path: performance-results/
  
  # Security Tests
  security-tests:
    runs-on: ubuntu-latest
    needs: [unit-tests]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Start security test environment
      run: |
        docker-compose -f docker-compose.security.yml up -d
        sleep 30
    
    - name: Run security tests
      run: npm run test:security
    
    - name: Run OWASP ZAP scan
      uses: zaproxy/action-full-scan@v0.7.0
      with:
        target: 'http://localhost:3000'
        rules_file_name: '.zap/rules.tsv'
        cmd_options: '-a'
    
    - name: Upload security test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: security-test-results
        path: |
          security-results/
          zap-report.html
  
  # Test Summary and Quality Gates
  test-summary:
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests, e2e-tests, security-tests]
    if: always()
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Download all test artifacts
      uses: actions/download-artifact@v3
    
    - name: Generate test summary report
      run: |
        python scripts/generate_test_report.py
    
    - name: Check quality gates
      run: |
        python scripts/check_quality_gates.py
    
    - name: Upload final test report
      uses: actions/upload-artifact@v3
      with:
        name: complete-test-report
        path: test-summary-report.html
    
    - name: Comment test results on PR
      if: github.event_name == 'pull_request'
      uses: actions/github-script@v6
      with:
        script: |
          const fs = require('fs');
          const testSummary = fs.readFileSync('test-summary.md', 'utf8');
          
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: testSummary
          });

# Quality gates script
quality_gates:
  coverage_threshold: 90
  performance_thresholds:
    api_p95_response_time: 2000
    database_p95_response_time: 100
    error_rate: 0.1
  security_requirements:
    critical_vulnerabilities: 0
    high_vulnerabilities: 0
    medium_vulnerabilities: 5
```

---

## **TEST REPORTING & METRICS**

### **Test Dashboard Configuration**
```javascript
// scripts/test-dashboard.js
const express = require('express');
const path = require('path');
const fs = require('fs');

class TestDashboard {
  constructor() {
    this.app = express();
    this.port = process.env.TEST_DASHBOARD_PORT || 8080;
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.use(express.static(path.join(__dirname, '../test-results')));
    
    // Main dashboard
    this.app.get('/', (req, res) => {
      res.send(this.generateDashboardHTML());
    });
    
    // API for test metrics
    this.app.get('/api/metrics', (req, res) => {
      const metrics = this.collectTestMetrics();
      res.json(metrics);
    });
    
    // Coverage report
    this.app.get('/coverage', (req, res) => {
      res.sendFile(path.join(__dirname, '../coverage/index.html'));
    });
  }

  collectTestMetrics() {
    const testResults = {
      unit_tests: this.parseJestResults(),
      integration_tests: this.parseIntegrationResults(),
      e2e_tests: this.parseE2EResults(),
      performance_tests: this.parsePerformanceResults(),
      security_tests: this.parseSecurityResults()
    };

    return {
      summary: {
        total_tests: Object.values(testResults).reduce((sum, result) => sum + result.total, 0),
        passed_tests: Object.values(testResults).reduce((sum, result) => sum + result.passed, 0),
        failed_tests: Object.values(testResults).reduce((sum, result) => sum + result.failed, 0),
        coverage_percentage: this.calculateOverallCoverage(),
        last_run: new Date().toISOString()
      },
      details: testResults,
      quality_gates: this.checkQualityGates(testResults)
    };
  }

  parseJestResults() {
    try {
      const jestResults = JSON.parse(fs.readFileSync('./test-results/jest-results.json', 'utf8'));
      return {
        total: jestResults.numTotalTests,
        passed: jestResults.numPassedTests,
        failed: jestResults.numFailedTests,
        duration: jestResults.testResults.reduce((sum, result) => sum + result.perfStats.runtime, 0),
        coverage: jestResults.coverageMap ? this.parseCoverage(jestResults.coverageMap) : null
      };
    } catch (error) {
      return { total: 0, passed: 0, failed: 0, duration: 0, error: error.message };
    }
  }

  parseIntegrationResults() {
    try {
      const integrationResults = JSON.parse(fs.readFileSync('./test-results/integration-results.json', 'utf8'));
      return {
        total: integrationResults.tests?.length || 0,
        passed: integrationResults.tests?.filter(t => t.status === 'passed').length || 0,
        failed: integrationResults.tests?.filter(t => t.status === 'failed').length || 0,
        duration: integrationResults.duration || 0
      };
    } catch (error) {
      return { total: 0, passed: 0, failed: 0, duration: 0, error: error.message };
    }
  }

  parseE2EResults() {
    try {
      const e2eResults = JSON.parse(fs.readFileSync('./test-results/e2e-results.json', 'utf8'));
      return {
        total: e2eResults.suites?.reduce((sum, suite) => sum + suite.specs.length, 0) || 0,
        passed: e2eResults.suites?.reduce((sum, suite) => sum + suite.specs.filter(s => s.ok).length, 0) || 0,
        failed: e2eResults.suites?.reduce((sum, suite) => sum + suite.specs.filter(s => !s.ok).length, 0) || 0,
        duration: e2eResults.duration || 0
      };
    } catch (error) {
      return { total: 0, passed: 0, failed: 0, duration: 0, error: error.message };
    }
  }

  parsePerformanceResults() {
    try {
      const perfResults = JSON.parse(fs.readFileSync('./test-results/performance-results.json', 'utf8'));
      return {
        api_p95_response_time: perfResults.api_p95_response_time || 0,
        database_p95_response_time: perfResults.database_p95_response_time || 0,
        operations_per_second: perfResults.operations_per_second || 0,
        error_rate: perfResults.error_rate || 0
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  parseSecurityResults() {
    try {
      const securityResults = JSON.parse(fs.readFileSync('./test-results/security-results.json', 'utf8'));
      return {
        vulnerabilities: {
          critical: securityResults.vulnerabilities?.critical || 0,
          high: securityResults.vulnerabilities?.high || 0,
          medium: securityResults.vulnerabilities?.medium || 0,
          low: securityResults.vulnerabilities?.low || 0
        },
        tests_passed: securityResults.tests_passed || 0,
        tests_failed: securityResults.tests_failed || 0
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  calculateOverallCoverage() {
    try {
      const coverage = JSON.parse(fs.readFileSync('./coverage/coverage-summary.json', 'utf8'));
      return coverage.total?.lines?.pct || 0;
    } catch (error) {
      return 0;
    }
  }

  checkQualityGates(testResults) {
    const gates = {
      coverage_threshold: 90,
      max_api_response_time: 2000,
      max_database_response_time: 100,
      max_error_rate: 0.1,
      max_critical_vulnerabilities: 0,
      max_high_vulnerabilities: 0
    };

    const coverage = this.calculateOverallCoverage();
    const performance = testResults.performance_tests;
    const security = testResults.security_tests;

    return {
      coverage_gate: coverage >= gates.coverage_threshold,
      performance_gate: (
        (performance.api_p95_response_time || 0) <= gates.max_api_response_time &&
        (performance.database_p95_response_time || 0) <= gates.max_database_response_time &&
        (performance.error_rate || 0) <= gates.max_error_rate
      ),
      security_gate: (
        (security.vulnerabilities?.critical || 0) <= gates.max_critical_vulnerabilities &&
        (security.vulnerabilities?.high || 0) <= gates.max_high_vulnerabilities
      ),
      overall_gate: function() {
        return this.coverage_gate && this.performance_gate && this.security_gate;
      }
    };
  }

  generateDashboardHTML() {
    const metrics = this.collectTestMetrics();
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Progressive-Framework-v5 Test Dashboard</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
            .metric-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .metric-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #2c3e50; }
            .metric-value { font-size: 24px; font-weight: bold; margin: 10px 0; }
            .passed { color: #27ae60; }
            .failed { color: #e74c3c; }
            .warning { color: #f39c12; }
            .quality-gates { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
            .gate { display: inline-block; padding: 10px 20px; margin: 5px; border-radius: 20px; font-weight: bold; }
            .gate.pass { background: #d5f4e6; color: #27ae60; }
            .gate.fail { background: #fdf2f2; color: #e74c3c; }
            .progress-bar { width: 100%; height: 20px; background: #ecf0f1; border-radius: 10px; overflow: hidden; }
            .progress-fill { height: 100%; background: #3498db; transition: width 0.3s ease; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🧪 Progressive-Framework-v5 Test Dashboard</h1>
            <p>Last updated: ${metrics.summary.last_run}</p>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-title">📊 Test Summary</div>
                <div class="metric-value passed">${metrics.summary.passed_tests} Passed</div>
                <div class="metric-value failed">${metrics.summary.failed_tests} Failed</div>
                <div class="metric-value">${metrics.summary.total_tests} Total</div>
                
                <div class="progress-bar" style="margin-top: 15px;">
                    <div class="progress-fill" style="width: ${(metrics.summary.passed_tests / metrics.summary.total_tests) * 100}%"></div>
                </div>
                <p>Success Rate: ${Math.round((metrics.summary.passed_tests / metrics.summary.total_tests) * 100)}%</p>
            </div>
            
            <div class="metric-card">
                <div class="metric-title">📈 Code Coverage</div>
                <div class="metric-value ${metrics.summary.coverage_percentage >= 90 ? 'passed' : 'failed'}">
                    ${metrics.summary.coverage_percentage.toFixed(1)}%
                </div>
                
                <div class="progress-bar" style="margin-top: 15px;">
                    <div class="progress-fill" style="width: ${metrics.summary.coverage_percentage}%"></div>
                </div>
                <p>Target: 90%</p>
                <a href="/coverage">View Detailed Coverage Report</a>
            </div>
            
            <div class="metric-card">
                <div class="metric-title">⚡ Performance</div>
                <div>API P95: <span class="metric-value">${metrics.details.performance_tests.api_p95_response_time || 'N/A'}ms</span></div>
                <div>DB P95: <span class="metric-value">${metrics.details.performance_tests.database_p95_response_time || 'N/A'}ms</span></div>
                <div>Error Rate: <span class="metric-value">${((metrics.details.performance_tests.error_rate || 0) * 100).toFixed(2)}%</span></div>
                <div>Ops/Sec: <span class="metric-value">${metrics.details.performance_tests.operations_per_second || 'N/A'}</span></div>
            </div>
            
            <div class="metric-card">
                <div class="metric-title">🛡️ Security</div>
                <div class="failed">Critical: ${metrics.details.security_tests.vulnerabilities?.critical || 0}</div>
                <div class="warning">High: ${metrics.details.security_tests.vulnerabilities?.high || 0}</div>
                <div>Medium: ${metrics.details.security_tests.vulnerabilities?.medium || 0}</div>
                <div>Low: ${metrics.details.security_tests.vulnerabilities?.low || 0}</div>
                <div class="passed">Tests Passed: ${metrics.details.security_tests.tests_passed || 0}</div>
            </div>
        </div>
        
        <div class="quality-gates">
            <h2>🚪 Quality Gates</h2>
            <div class="gate ${metrics.quality_gates.coverage_gate ? 'pass' : 'fail'}">
                Coverage: ${metrics.quality_gates.coverage_gate ? '✅ PASS' : '❌ FAIL'}
            </div>
            <div class="gate ${metrics.quality_gates.performance_gate ? 'pass' : 'fail'}">
                Performance: ${metrics.quality_gates.performance_gate ? '✅ PASS' : '❌ FAIL'}
            </div>
            <div class="gate ${metrics.quality_gates.security_gate ? 'pass' : 'fail'}">
                Security: ${metrics.quality_gates.security_gate ? '✅ PASS' : '❌ FAIL'}
            </div>
            <div class="gate ${metrics.quality_gates.overall_gate() ? 'pass' : 'fail'}">
                Overall: ${metrics.quality_gates.overall_gate() ? '✅ PASS' : '❌ FAIL'}
            </div>
        </div>
        
        <script>
            // Auto-refresh every 30 seconds
            setTimeout(() => location.reload(), 30000);
        </script>
    </body>
    </html>
    `;
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🧪 Test Dashboard running at http://localhost:${this.port}`);
    });
  }
}

module.exports = TestDashboard;

// Start dashboard if run directly
if (require.main === module) {
  const dashboard = new TestDashboard();
  dashboard.start();
}
```

---

## **TROUBLESHOOTING & DEBUGGING**

### **Test Debugging Guide**
```bash
#!/bin/bash
# scripts/debug-tests.sh

echo "🔍 Progressive-Framework-v5 Test Debugging Guide"
echo "=================================================="

function debug_unit_tests() {
    echo "🧪 Debugging Unit Tests"
    echo "----------------------"
    
    # Run tests with debug output
    echo "Running Jest tests with debug output..."
    DEBUG=* npm run test:unit -- --verbose --no-cache
    
    # Check for common issues
    echo "Checking for common unit test issues..."
    
    # Check test file structure
    find tests/unit -name "*.test.js" -exec echo "Found test file: {}" \;
    
    # Check for missing mocks
    echo "Checking for unmocked dependencies..."
    grep -r "require.*src/" tests/unit/ || echo "No direct src imports found in unit tests ✅"
    
    # Check Jest configuration
    echo "Jest configuration:"
    cat jest.config.js || echo "No Jest config found"
}

function debug_integration_tests() {
    echo "🔗 Debugging Integration Tests"
    echo "------------------------------"
    
    # Check service connectivity
    echo "Testing database connections..."
    
    # PostgreSQL
    pg_isready -h localhost -p 5432 -U test_user && echo "✅ PostgreSQL connected" || echo "❌ PostgreSQL connection failed"
    
    # Redis
    redis-cli ping && echo "✅ Redis connected" || echo "❌ Redis connection failed"
    
    # MongoDB
    mongo --eval "db.runCommand('ping')" localhost:27017/test && echo "✅ MongoDB connected" || echo "❌ MongoDB connection failed"
    
    # Check API endpoints
    echo "Testing API endpoint availability..."
    curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health && echo "✅ Main API available" || echo "❌ Main API unavailable"
    curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health && echo "✅ Agent API available" || echo "❌ Agent API unavailable"
    
    # Run integration tests with verbose output
    npm run test:integration -- --verbose
}

function debug_e2e_tests() {
    echo "🎭 Debugging E2E Tests"
    echo "----------------------"
    
    # Check browser dependencies
    echo "Checking browser setup..."
    npx playwright install --with-deps
    
    # Run E2E tests with debug mode
    echo "Running E2E tests with debug output..."
    PWDEBUG=1 npm run test:e2e
    
    # Check for common E2E issues
    echo "Checking for common E2E issues..."
    
    # Check if application is running
    curl -s http://localhost:3000 > /dev/null && echo "✅ Application accessible" || echo "❌ Application not accessible"
    
    # Check test data setup
    echo "Verifying test data setup..."
    psql -h localhost -U test_user -d progressive_framework_v5_test -c "SELECT COUNT(*) FROM users;" || echo "❌ Test data setup failed"
}

function debug_performance_tests() {
    echo "⚡ Debugging Performance Tests"
    echo "------------------------------"
    
    # Check system resources
    echo "System resource check:"
    echo "CPU Usage:" && top -l 1 | grep "CPU usage" || echo "N/A"
    echo "Memory Usage:" && free -h || echo "N/A"
    echo "Disk Usage:" && df -h
    
    # Check database performance
    echo "Database performance check..."
    
    # PostgreSQL stats
    psql -h localhost -U test_user -d progressive_framework_v5_test -c "
        SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del
        FROM pg_stat_user_tables
        ORDER BY n_tup_ins + n_tup_upd + n_tup_del DESC
        LIMIT 5;
    " || echo "Could not fetch PostgreSQL stats"
    
    # Redis memory usage
    redis-cli info memory | grep used_memory_human || echo "Could not fetch Redis memory info"
    
    # Run performance tests with detailed output
    k6 run --out json=performance-debug.json tests/performance/load-testing.k6.js
}

function debug_security_tests() {
    echo "🛡️ Debugging Security Tests"
    echo "----------------------------"
    
    # Check SSL/TLS configuration
    echo "Checking SSL/TLS setup..."
    openssl s_client -connect localhost:443 -verify_return_error < /dev/null && echo "✅ SSL certificate valid" || echo "❌ SSL issues detected"
    
    # Check for security headers
    echo "Checking security headers..."
    curl -I https://localhost:443 | grep -E "(Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options)" || echo "❌ Missing security headers"
    
    # Run security tests with verbose output
    npm run test:security -- --verbose
    
    # Check OWASP ZAP results
    if [ -f "zap-report.html" ]; then
        echo "OWASP ZAP scan completed. Check zap-report.html for details."
    else
        echo "No OWASP ZAP report found."
    fi
}

function debug_agent_coordination() {
    echo "🤖 Debugging Agent Coordination"
    echo "-------------------------------"
    
    # Check agent service health
    echo "Checking agent health..."
    curl -s http://localhost:8001/health && echo "✅ MCA healthy" || echo "❌ MCA unhealthy"
    curl -s http://localhost:8002/health && echo "✅ NPA healthy" || echo "❌ NPA unhealthy"
    curl -s http://localhost:8003/health && echo "✅ WPA healthy" || echo "❌ WPA unhealthy"
    
    # Test agent communication
    echo "Testing agent communication..."
    
    # Mock coordination request
    curl -X POST http://localhost:8001/api/v1/coordinate \
         -H "Content-Type: application/json" \
         -d '{"goalType":"weight_loss","targetWeight":70}' \
         --silent --output /dev/null --write-out "%{http_code}" \
         && echo "✅ MCA coordination endpoint responsive" \
         || echo "❌ MCA coordination endpoint failed"
    
    # Check agent logs
    echo "Recent agent logs:"
    docker logs progressive-framework-mca --tail 10 || echo "Could not fetch MCA logs"
    docker logs progressive-framework-npa --tail 10 || echo "Could not fetch NPA logs"
    docker logs progressive-framework-wpa --tail 10 || echo "Could not fetch WPA logs"
}

function debug_test_data() {
    echo "📊 Debugging Test Data"
    echo "----------------------"
    
    # Check test database state
    echo "Checking test database state..."
    
    # PostgreSQL test data
    echo "PostgreSQL test data counts:"
    psql -h localhost -U test_user -d progressive_framework_v5_test -c "
        SELECT 
            'users' as table_name, COUNT(*) as row_count FROM users
        UNION ALL
        SELECT 
            'user_profiles' as table_name, COUNT(*) as row_count FROM user_profiles
        UNION ALL
        SELECT 
            'nutrition_plans' as table_name, COUNT(*) as row_count FROM nutrition_plans
        UNION ALL
        SELECT 
            'workout_plans' as table_name, COUNT(*) as row_count FROM workout_plans;
    " || echo "Could not query PostgreSQL test data"
    
    # Redis test data
    echo "Redis test data:"
    redis-cli dbsize || echo "Could not query Redis test data"
    
    # MongoDB test data
    echo "MongoDB test data:"
    mongo progressive_framework_v5_test --eval "
        db.nutrition_plans.count();
        db.workout_logs.count();
    " || echo "Could not query MongoDB test data"
}

function full_test_debug() {
    echo "🔍 Running Full Test Debug Suite"
    echo "================================="
    
    debug_unit_tests
    echo ""
    debug_integration_tests
    echo ""
    debug_e2e_tests
    echo ""
    debug_performance_tests
    echo ""
    debug_security_tests
    echo ""
    debug_agent_coordination
    echo ""
    debug_test_data
    
    echo ""
    echo "🎯 Debug Summary Complete"
    echo "========================="
    echo "Check the output above for any ❌ failures and address them accordingly."
    echo ""
    echo "💡 Common Test Issues & Solutions:"
    echo "- Unit test failures: Check mocks and dependencies"
    echo "- Integration test failures: Verify service connectivity"
    echo "- E2E test failures: Ensure application is running and accessible"
    echo "- Performance test failures: Check system resources and thresholds"
    echo "- Security test failures: Verify SSL/TLS setup and security headers"
    echo "- Agent test failures: Check agent health and communication"
}

# Parse command line arguments
case "$1" in
    "unit")
        debug_unit_tests
        ;;
    "integration")
        debug_integration_tests
        ;;
    "e2e")
        debug_e2e_tests
        ;;
    "performance")
        debug_performance_tests
        ;;
    "security")
        debug_security_tests
        ;;
    "agents")
        debug_agent_coordination
        ;;
    "data")
        debug_test_data
        ;;
    "all"|"")
        full_test_debug
        ;;
    *)
        echo "Usage: $0 [unit|integration|e2e|performance|security|agents|data|all]"
        echo ""
        echo "Options:"
        echo "  unit        - Debug unit tests only"
        echo "  integration - Debug integration tests only"
        echo "  e2e         - Debug end-to-end tests only"
        echo "  performance - Debug performance tests only"
        echo "  security    - Debug security tests only"
        echo "  agents      - Debug agent coordination only"
        echo "  data        - Debug test data only"
        echo "  all         - Run full debug suite (default)"
        exit 1
        ;;
esac
```

### **Test Environment Troubleshooting**
```yaml
# docker-compose.test-debug.yml
version: '3.8'
services:
  # Debug version of PostgreSQL with logging
  postgres-debug:
    image: postgres:15
    environment:
      POSTGRES_DB: progressive_framework_v5_test
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_password
    ports:
      - "5432:5432"
    volumes:
      - ./scripts/init-test-db.sql:/docker-entrypoint-initdb.d/init.sql
    command: 
      - "postgres"
      - "-c"
      - "log_statement=all"
      - "-c" 
      - "log_destination=stderr"
      - "-c"
      - "logging_collector=on"
      - "-c"
      - "log_min_duration_statement=0"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U test_user -d progressive_framework_v5_test"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Debug Redis with verbose logging
  redis-debug:
    image: redis:7
    ports:
      - "6379:6379"
    command: redis-server --loglevel verbose --logfile /var/log/redis.log
    volumes:
      - redis-debug-data:/data
      - redis-debug-logs:/var/log
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

  # Debug MongoDB with profiling
  mongodb-debug:
    image: mongo:6
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: progressive_framework_v5_test
    volumes:
      - mongodb-debug-data:/data/db
    command: mongod --profile=2 --slowms=0 --logpath /var/log/mongodb.log --logappend

  # Test application with debug settings
  app-debug:
    build:
      context: .
      dockerfile: Dockerfile.test
    environment:
      NODE_ENV: test
      DEBUG: "*"
      LOG_LEVEL: debug
      DATABASE_URL: postgresql://test_user:test_password@postgres-debug:5432/progressive_framework_v5_test
      REDIS_URL: redis://redis-debug:6379
      MONGODB_URL: mongodb://mongodb-debug:27017/progressive_framework_v5_test
    ports:
      - "3000:3000"
    depends_on:
      postgres-debug:
        condition: service_healthy
      redis-debug:
        condition: service_healthy
      mongodb-debug:
        condition: service_started
    volumes:
      - ./logs:/app/logs
      - ./test-results:/app/test-results

volumes:
  redis-debug-data:
  redis-debug-logs:
  mongodb-debug-data:
```

---

## **TEST MAINTENANCE & OPTIMIZATION**

### **Test Performance Optimization**
```javascript
// scripts/optimize-tests.js
const fs = require('fs');
const path = require('path');

class TestOptimizer {
  constructor() {
    this.testMetrics = {};
    this.slowTests = [];
    this.duplicateTests = [];
    this.unusedMocks = [];
  }

  async analyzeTestPerformance() {
    console.log('🔍 Analyzing test performance...');
    
    // Analyze Jest test timing
    await this.analyzeJestTiming();
    
    // Find slow tests
    await this.findSlowTests();
    
    // Detect duplicate test logic
    await this.detectDuplicateTests();
    
    // Find unused mocks
    await this.findUnusedMocks();
    
    // Generate optimization report
    this.generateOptimizationReport();
  }

  async analyzeJestTiming() {
    try {
      const jestResults = JSON.parse(
        fs.readFileSync('./test-results/jest-results.json', 'utf8')
      );
      
      jestResults.testResults.forEach(testFile => {
        const filePath = testFile.name;
        const duration = testFile.perfStats.runtime;
        
        this.testMetrics[filePath] = {
          duration,
          numTests: testFile.numPassingTests + testFile.numFailingTests,
          avgTestDuration: duration / (testFile.numPassingTests + testFile.numFailingTests),
          status: testFile.status
        };
        
        // Mark as slow if average test duration > 100ms
        if (this.testMetrics[filePath].avgTestDuration > 100) {
          this.slowTests.push({
            file: filePath,
            duration: this.testMetrics[filePath].avgTestDuration,
            numTests: this.testMetrics[filePath].numTests
          });
        }
      });
    } catch (error) {
      console.warn('Could not analyze Jest timing:', error.message);
    }
  }

  async findSlowTests() {
    // Sort slow tests by duration
    this.slowTests.sort((a, b) => b.duration - a.duration);
    
    console.log(`Found ${this.slowTests.length} slow test files`);
    
    // Analyze individual slow tests for optimization opportunities
    this.slowTests.forEach(slowTest => {
      const suggestions = this.generateOptimizationSuggestions(slowTest);
      slowTest.suggestions = suggestions;
    });
  }

  generateOptimizationSuggestions(slowTest) {
    const suggestions = [];
    
    if (slowTest.duration > 1000) {
      suggestions.push('Consider breaking this test file into smaller, focused test files');
      suggestions.push('Review setup/teardown operations for unnecessary work');
    }
    
    if (slowTest.numTests > 50) {
      suggestions.push('Large number of tests in one file - consider splitting by functionality');
    }
    
    if (slowTest.file.includes('integration')) {
      suggestions.push('Integration test - consider mocking external services');
      suggestions.push('Review database operations for optimization opportunities');
    }
    
    if (slowTest.file.includes('e2e')) {
      suggestions.push('E2E test - consider using test fixtures to speed up setup');
      suggestions.push('Review browser automation for unnecessary waits');
    }
    
    return suggestions;
  }

  async detectDuplicateTests() {
    const testFiles = this.getAllTestFiles();
    const testPatterns = new Map();
    
    for (const file of testFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const testBlocks = this.extractTestBlocks(content);
      
      testBlocks.forEach(block => {
        const pattern = this.normalizeTestPattern(block);
        
        if (testPatterns.has(pattern)) {
          testPatterns.get(pattern).push(file);
        } else {
          testPatterns.set(pattern, [file]);
        }
      });
    }
    
    // Find patterns that appear in multiple files
    testPatterns.forEach((files, pattern) => {
      if (files.length > 1) {
        this.duplicateTests.push({
          pattern,
          files,
          suggestion: 'Consider extracting common test logic into shared utilities'
        });
      }
    });
  }

  extractTestBlocks(content) {
    // Simple regex to extract test blocks
    const testRegex = /(?:test|it)\s*\(\s*['"`](.+?)['"`]\s*,/g;
    const blocks = [];
    let match;
    
    while ((match = testRegex.exec(content)) !== null) {
      blocks.push(match[1]);
    }
    
    return blocks;
  }

  normalizeTestPattern(testName) {
    // Normalize test names to detect similar patterns
    return testName
      .toLowerCase()
      .replace(/\d+/g, 'X')  // Replace numbers with X
      .replace(/['"]/g, '')  // Remove quotes
      .trim();
  }

  getAllTestFiles() {
    const testDirs = ['tests/unit', 'tests/integration', 'tests/e2e'];
    const testFiles = [];
    
    testDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = this.getFilesRecursively(dir, /\.(test|spec)\.(js|ts)$/);
        testFiles.push(...files);
      }
    });
    
    return testFiles;
  }

  getFilesRecursively(dir, pattern) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getFilesRecursively(fullPath, pattern));
      } else if (pattern.test(fullPath)) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  async findUnusedMocks() {
    const mockFiles = this.getAllMockFiles();
    const testFiles = this.getAllTestFiles();
    
    mockFiles.forEach(mockFile => {
      const mockName = path.basename(mockFile, path.extname(mockFile));
      const isUsed = testFiles.some(testFile => {
        const content = fs.readFileSync(testFile, 'utf8');
        return content.includes(mockName) || content.includes(mockFile);
      });
      
      if (!isUsed) {
        this.unusedMocks.push(mockFile);
      }
    });
  }

  getAllMockFiles() {
    const mockDirs = ['tests/__mocks__', 'tests/mocks'];
    const mockFiles = [];
    
    mockDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = this.getFilesRecursively(dir, /\.(js|ts)$/);
        mockFiles.push(...files);
      }
    });
    
    return mockFiles;
  }

  generateOptimizationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTestFiles: Object.keys(this.testMetrics).length,
        slowTestFiles: this.slowTests.length,
        duplicatePatterns: this.duplicateTests.length,
        unusedMocks: this.unusedMocks.length
      },
      slowTests: this.slowTests.slice(0, 10), // Top 10 slowest
      duplicateTests: this.duplicateTests.slice(0, 5), // Top 5 duplicates
      unusedMocks: this.unusedMocks,
      recommendations: this.generateRecommendations()
    };
    
    // Write report to file
    fs.writeFileSync(
      './test-results/optimization-report.json',
      JSON.stringify(report, null, 2)
    );
    
    // Print summary
    this.printOptimizationSummary(report);
    
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.slowTests.length > 0) {
      recommendations.push({
        category: 'Performance',
        priority: 'High',
        description: `${this.slowTests.length} test files are running slowly`,
        action: 'Review and optimize slow test files, consider parallel execution'
      });
    }
    
    if (this.duplicateTests.length > 0) {
      recommendations.push({
        category: 'Maintainability',
        priority: 'Medium',
        description: `${this.duplicateTests.length} duplicate test patterns detected`,
        action: 'Extract common test utilities and reduce duplication'
      });
    }
    
    if (this.unusedMocks.length > 0) {
      recommendations.push({
        category: 'Cleanup',
        priority: 'Low',
        description: `${this.unusedMocks.length} unused mock files detected`,
        action: 'Remove unused mock files to reduce maintenance overhead'
      });
    }
    
    // Calculate overall test suite health
    const totalDuration = Object.values(this.testMetrics)
      .reduce((sum, metric) => sum + metric.duration, 0);
    
    if (totalDuration > 300000) { // 5 minutes
      recommendations.push({
        category: 'Performance',
        priority: 'High',
        description: 'Test suite taking too long to execute',
        action: 'Consider parallel test execution and test optimization'
      });
    }
    
    return recommendations;
  }

  printOptimizationSummary(report) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST OPTIMIZATION REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n📈 Summary:`);
    console.log(`  Total Test Files: ${report.summary.totalTestFiles}`);
    console.log(`  Slow Test Files: ${report.summary.slowTestFiles}`);
    console.log(`  Duplicate Patterns: ${report.summary.duplicatePatterns}`);
    console.log(`  Unused Mocks: ${report.summary.unusedMocks}`);
    
    if (report.slowTests.length > 0) {
      console.log(`\n⏱️ Top Slow Tests:`);
      report.slowTests.slice(0, 5).forEach(test => {
        console.log(`  ${test.file}: ${test.duration.toFixed(0)}ms avg`);
      });
    }
    
    if (report.recommendations.length > 0) {
      console.log(`\n💡 Recommendations:`);
      report.recommendations.forEach(rec => {
        console.log(`  [${rec.priority}] ${rec.category}: ${rec.description}`);
        console.log(`      → ${rec.action}`);
      });
    }
    
    console.log(`\n📋 Full report saved to: ./test-results/optimization-report.json`);
  }
}

module.exports = TestOptimizer;

// Run optimization if called directly
if (require.main === module) {
  const optimizer = new TestOptimizer();
  optimizer.analyzeTestPerformance().catch(console.error);
}
```

---

## **BEST PRACTICES & GUIDELINES**

### **Test Writing Standards**
```markdown
# Progressive-Framework-v5 Test Writing Standards

## 🎯 General Principles

### 1. **Test Naming Convention**
- Use descriptive test names that explain the scenario
- Follow pattern: `should [expected behavior] when [condition]`
- Examples:
  ✅ `should return 401 when authentication token is invalid`
  ✅ `should successfully coordinate nutrition and workout plans when valid user goal provided`
  ❌ `test login`
  ❌ `user auth test`

### 2. **Test Structure (AAA Pattern)**
```javascript
test('should authenticate user when valid credentials provided', async () => {
  // Arrange - Set up test data and mocks
  const validCredentials = { email: 'test@example.com', password: 'ValidPass123!' };
  mockUserRepository.findByEmail.mockResolvedValue(mockUser);
  mockPasswordHasher.verify.mockResolvedValue(true);
  
  // Act - Execute the functionality being tested
  const result = await authService.authenticateUser(validCredentials.email, validCredentials.password);
  
  // Assert - Verify the expected outcome
  expect(result).toEqual({
    success: true,
    token: expect.any(String),
    user: expect.objectContaining({
      id: mockUser.id,
      email: mockUser.email
    })
  });
});
```

### 3. **Mock Strategy**
- **Mock external dependencies**, not internal logic
- **Use dependency injection** to make mocking easier
- **Keep mocks simple** and focused on the test scenario
- **Reset mocks** between tests to avoid interference

```javascript
// ✅ Good - Mock external service
const mockEmailService = {
  sendEmail: jest.fn().mockResolvedValue(true)
};

// ❌ Bad - Mock internal business logic
const mockUserService = {
  validateUser: jest.fn().mockReturnValue(true) // This IS the logic we should test
};
```

### 4. **Test Data Management**
- **Use factories** for consistent test data creation
- **Keep test data minimal** - only include necessary fields
- **Use meaningful values** that reflect real-world usage
- **Avoid hardcoded test data** in multiple places

```javascript
// ✅ Good - Use factory
const testUser = UserFactory.create({
  email: 'nutrition-test@example.com',
  dietaryPreferences: ['vegetarian']
});

// ❌ Bad - Hardcoded data
const testUser = {
  id: 123,
  email: 'test@test.com',
  name: 'Test User',
  // ... 20 more irrelevant fields
};
```

## 🧪 Unit Test Guidelines

### **What to Test**
- **Business logic** and data transformations
- **Error handling** and edge cases
- **Input validation** and boundary conditions
- **Algorithm correctness** (calculations, sorting, filtering)

### **What NOT to Test**
- **Framework code** (Express routes, database ORM methods)
- **Third-party library behavior**
- **Simple getters/setters** without logic
- **Configuration constants**

### **Agent-Specific Testing**
```python
# ✅ Good - Test agent decision-making logic
def test_nutrition_plan_macros_calculation():
    """Test that macro calculations are correct for different user profiles."""
    user_profile = UserProfile(weight=70, height=170, age=30, activity_level='moderate')
    goal = WeightLossGoal(target_weight=65, timeframe_weeks=12)
    
    nutrition_agent = NutritionPlanningAgent()
    macros = nutrition_agent.calculate_macros(user_profile, goal)
    
    assert macros.protein_percentage >= 25  # High protein for weight loss
    assert macros.total_calories < user_profile.maintenance_calories
    assert macros.protein_grams >= user_profile.minimum_protein_needs()

# ❌ Bad - Test framework integration
def test_nutrition_agent_api_endpoint():
    """This should be an integration test, not unit test."""
    response = client.post('/api/nutrition/plan', json={'user_id': 123})
    assert response.status_code == 200
```

## 🔗 Integration Test Guidelines

### **Service Integration Testing**
- **Test real service interactions** without mocking internal services
- **Use test databases** with realistic data
- **Test error scenarios** and recovery mechanisms
- **Verify data consistency** across services

### **API Integration Testing**
- **Test complete request-response cycles**
- **Include authentication and authorization**
- **Test various HTTP methods and status codes**
- **Validate response schemas and data formats**

```javascript
// ✅ Good - Complete API integration test
describe('Nutrition Plan API Integration', () => {
  beforeEach(async () => {
    await testDatabase.clear();
    testUser = await testDatabase.createUser({ 
      email: 'integration-test@example.com',
      profileComplete: true 
    });
    authToken = await authHelper.getToken(testUser.id);
  });
  
  test('should create personalized nutrition plan', async () => {
    const planRequest = {
      goalType: 'weight_loss',
      targetWeight: 65,
      dietaryRestrictions: ['vegetarian']
    };
    
    const response = await request(app)
      .post('/api/v1/nutrition/plan')
      .set('Authorization', `Bearer ${authToken}`)
      .send(planRequest)
      .expect(201);
    
    expect(response.body).toMatchSchema(nutritionPlanSchema);
    expect(response.body.dailyCalories).toBeGreaterThan(1200);
    expect(response.body.dietaryRestrictions).toContain('vegetarian');
    
    // Verify plan was saved to database
    const savedPlan = await testDatabase.getNutritionPlan(testUser.id);
    expect(savedPlan).toBeTruthy();
  });
});
```

## 🎭 E2E Test Guidelines

### **User Journey Testing**
- **Test complete user workflows** from start to finish
- **Use realistic test data** and scenarios
- **Include error paths** and edge cases
- **Test across different browsers/devices** when relevant

### **Page Object Pattern**
```javascript
// ✅ Good - Use Page Object Pattern
class NutritionPlanPage {
  constructor(page) {
    this.page = page;
    this.planContainer = '[data-testid="nutrition-plan"]';
    this.modifyButton = '[data-testid="modify-plan"]';
    this.saveButton = '[data-testid="save-plan"]';
  }
  
  async modifyPlan(changes) {
    await this.page.click(this.modifyButton);
    await this.page.fill('[name="calories"]', changes.calories.toString());
    await this.page.click(this.saveButton);
  }
  
  async getPlanDetails() {
    return await this.page.textContent(this.planContainer);
  }
}

// Usage in test
test('user can modify nutrition plan', async ({ page }) => {
  const nutritionPage = new NutritionPlanPage(page);
  
  await page.goto('/nutrition');
  await nutritionPage.modifyPlan({ calories: 1800 });
  
  const planDetails = await nutritionPage.getPlanDetails();
  expect(planDetails).toContain('1800 calories');
});
```

## ⚡ Performance Test Guidelines

### **Load Testing Strategy**
- **Start with baseline performance** measurements
- **Gradually increase load** to find breaking points
- **Test realistic user scenarios**, not just simple endpoints
- **Monitor system resources** during tests

### **Database Performance Testing**
```python
# ✅ Good - Test realistic database scenarios
def test_nutrition_plan_query_performance():
    """Test that nutrition plan queries perform well under load."""
    # Setup realistic data volume
    create_test_users(1000)
    create_nutrition_plans(5000)
    
    start_time = time.time()
    
    # Test complex query that represents real usage
    plans = db.query("""
        SELECT np.*, u.email, up.weight_kg, up.height_cm
        FROM nutrition_plans np
        JOIN users u ON np.user_id = u.id
        JOIN user_profiles up ON u.id = up.user_id
        WHERE np.created_at >= NOW() - INTERVAL '30 days'
          AND np.plan_type = 'weight_loss'
        ORDER BY np.created_at DESC
        LIMIT 50
    """)
    
    query_time = time.time() - start_time
    
    assert len(plans) <= 50
    assert query_time < 0.1  # Query should complete in < 100ms
```

## 🛡️ Security Test Guidelines

### **Authentication Testing**
- **Test all authentication methods** (JWT, OAuth, etc.)
- **Verify session management** and timeout behavior
- **Test brute force protection** and rate limiting
- **Check token validation** and expiration handling

### **Authorization Testing**
- **Test role-based access control**
- **Verify user can only access own data**
- **Test admin/user permission boundaries**
- **Check API endpoint protection**

### **Input Validation Testing**
```javascript
// ✅ Good - Comprehensive input validation test
const maliciousInputs = [
  '<script>alert("xss")</script>',
  "'; DROP TABLE users; --",
  '../../../../etc/passwd',
  '${7*7}',
  null,
  undefined,
  '',
  ' '.repeat(1000000), // Large string
  -1,
  999999999999999999, // Large number
];

maliciousInputs.forEach(input => {
  test(`should handle malicious input: ${input}`, async () => {
    const response = await request(app)
      .post('/api/v1/user/profile')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ firstName: input })
      .expect(400);
    
    expect(response.body.error).toMatch(/invalid|validation|bad request/i);
  });
});
```

## 📊 Test Maintenance

### **Regular Maintenance Tasks**
1. **Review slow tests** monthly and optimize
2. **Update test data** to reflect current business rules
3. **Remove obsolete tests** when features are removed
4. **Refactor duplicated test code** into utilities
5. **Update test dependencies** and fix compatibility issues

### **Test Coverage Goals**
- **Unit Tests**: 95% line coverage minimum
- **Integration Tests**: Cover all critical user journeys
- **E2E Tests**: Cover all major user workflows
- **Performance Tests**: All critical endpoints tested
- **Security Tests**: All authentication/authorization paths tested

### **Quality Metrics Tracking**
```javascript
// Track these metrics in your CI/CD pipeline
const qualityMetrics = {
  coverage: {
    lines: 95,
    branches: 90,
    functions: 95,
    statements: 95
  },
  performance: {
    unitTestsMaxDuration: 60000,      // 1 minute
    integrationTestsMaxDuration: 300000, // 5 minutes
    e2eTestsMaxDuration: 900000,      // 15 minutes
  },
  reliability: {
    flakyTestThreshold: 0.02,         // Max 2% flaky tests
    testFailureRate: 0.01,            // Max 1% failure rate
  }
};
```
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites (Read First)**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Agent Architecture](../02-Agent-System/Agent-Architecture.md)** - Context agent system design
- **[Development Setup](Development-Setup.md)** - Development environment configuration
- **[Security Overview](../04-Security/Security-Overview.md)** - Security requirements and testing

### **Development Context**
- **[Development Setup](Development-Setup.md)** - Complete development environment
- **[API Documentation](../03-API-Integration/API-Documentation.md)** - API testing reference
- **[Database Schema](../07-Database-Design/Database-Schema.md)** - Database testing requirements

### **Operations Context**  
- **[CI/CD Pipeline](../05-DevOps/CI-CD-Pipeline.md)** - Testing pipeline integration
- **[Monitoring & Alerting](../05-DevOps/Monitoring-Alerting.md)** - Test monitoring setup
- **[Performance Monitoring](../06-Infrastructure/Performance-Monitoring.md)** - Performance testing integration

### **Quality Assurance**
- **[Security Testing](../04-Security/Security-Testing.md)** - Detailed security testing procedures
- **[Performance Testing](../06-Infrastructure/Performance-Testing.md)** - Infrastructure performance testing
- **[Error Handling](../10-Troubleshooting/Error-Handling.md)** - Error scenario testing

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | QA Team | Complete testing strategy implementation with agent testing |
| 4.x | 2025-08-xx | Development Team | Previous iteration testing procedures |
| 3.x | 2025-07-xx | QA Team | Initial testing framework setup |

---

## **APPENDICES**

### **Appendix A: Test Data Factories**
```javascript
// tests/factories/UserFactory.js
export class UserFactory {
  static create(overrides = {}) {
    return {
      id: faker.datatype.uuid(),
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }
  
  static createBatch(count, overrides = {}) {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

// tests/factories/NutritionPlanFactory.js
export class NutritionPlanFactory {
  static create(overrides = {}) {
    return {
      id: faker.datatype.uuid(),
      userId: faker.datatype.uuid(),
      goalType: faker.random.arrayElement(['weight_loss', 'weight_gain', 'maintenance']),
      dailyCalories: faker.datatype.number({ min: 1200, max: 3000 }),
      macros: {
        protein: faker.datatype.number({ min: 20, max: 40 }),
        carbs: faker.datatype.number({ min: 30, max: 50 }),
        fat: faker.datatype.number({ min: 20, max: 35 })
      },
      dietaryRestrictions: faker.random.arrayElements(
        ['vegetarian', 'vegan', 'gluten_free', 'dairy_free'], 
        faker.datatype.number({ min: 0, max: 2 })
      ),
      createdAt: new Date(),
      ...overrides
    };
  }
}
```

### **Appendix B: Test Utilities**
```javascript
// tests/utils/TestHelpers.js
export class TestHelpers {
  static async waitForCondition(conditionFn, timeout = 5000, interval = 100) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await conditionFn()) {
        return true;
      }
      await this.sleep(interval);
    }
    
    throw new Error(`Condition not met within ${timeout}ms`);
  }
  
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  static async retryOperation(operation, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await this.sleep(delay);
        }
      }
    }
    
    throw lastError;
  }
  
  static generateTestEmail(prefix = 'test') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
  }
  
  static cleanTestData(entities) {
    // Helper to clean up test data after tests
    const promises = entities.map(entity => entity.destroy?.() || entity.delete?.());
    return Promise.all(promises);
  }
}
```

### **Appendix C: Test Configuration Templates**
```json
{
  "jest_config_template": {
    "testEnvironment": "node",
    "roots": ["<rootDir>/tests"],
    "testMatch": ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/**/*.test.js",
      "!src/config/**",
      "!src/migrations/**"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 90,
        "functions": 95,
        "lines": 95,
        "statements": 95
      }
    },
    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],
    "testTimeout": 30000
  },
  
  "playwright_config_template": {
    "testDir": "./tests/e2e",
    "timeout": 30000,
    "expect": {
      "timeout": 5000
    },
    "fullyParallel": true,
    "forbidOnly": true,
    "retries": 2,
    "workers": 1,
    "reporter": "html",
    "use": {
      "baseURL": "http://localhost:3000",
      "trace": "on-first-retry",
      "screenshot": "only-on-failure"
    },
    "projects": [
      {
        "name": "chromium",
        "use": {
          "...devices": "Desktop Chrome"
        }
      }
    ]
  }
}
```

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: QA Team  
**Last Validated**: 2025-09-02

---

## **🎯 TESTING SUCCESS CRITERIA**

This testing strategy ensures Progressive-Framework-v5 meets the highest quality standards through:

✅ **Comprehensive Coverage** - 95%+ code coverage across all components  
✅ **Multi-Layer Testing** - Unit, Integration, E2E, Performance, and Security testing  
✅ **Agent-Aware Testing** - Specialized testing for AI agent coordination and behavior  
✅ **Automated Quality Gates** - CI/CD integration with automated quality validation  
✅ **Performance Validation** - Load testing and performance monitoring  
✅ **Security Assurance** - Comprehensive security testing and vulnerability scanning  
✅ **Maintainable Test Suite** - Well-structured, optimized, and maintainable test code  

**Ready for production deployment with confidence in system quality and reliability! 🚀**