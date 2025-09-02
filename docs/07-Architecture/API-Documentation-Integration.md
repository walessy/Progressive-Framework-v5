# API Documentation & Integration Guide - Progressive-Framework-v5

**File Path**: `docs/07-API-Integration/API-Documentation-Integration.md`  
**Directory**: `docs/07-API-Integration/`  
**Priority**: CRITICAL  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive API documentation and integration guide for Progressive-Framework-v5, covering REST API endpoints, GraphQL schemas, webhook implementations, third-party service integrations, authentication flows, rate limiting, and integration patterns for enterprise core systems and context agents (MCA, NPA, WPA).

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🤖 **[AI Agent Framework](../03-Agents/AI-Agent-Framework.md)** - *Agent architecture and communication*
- 🛡️ **[Security Overview](../04-Security/Security-Overview.md)** - *Authentication and authorization*
- 🗄️ **[Data Models & Management](../02-Data/Data-Models-Management.md)** - *Data structures and schemas*
- 🌐 **[Network Architecture & Security](../06-Infrastructure/Network-Architecture-Security.md)** - *Network and security context*

---

## **API ARCHITECTURE OVERVIEW**

### **API Design Philosophy**
```
Progressive-Framework-v5 API Architecture:

                    ┌─────────────────────────────────────┐
                    │          API GATEWAY               │
                    │     (Kong/AWS API Gateway)         │
                    │                                     │
                    │  • Rate Limiting                   │
                    │  • Authentication                  │
                    │  • Request Validation              │
                    │  • Response Transformation         │
                    │  • Monitoring & Analytics          │
                    └─────────────────────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
    ┌───▼────┐                   ┌────▼────┐                   ┌────▼────┐
    │        │                   │         │                   │         │
    │  REST  │                   │ GraphQL │                   │WebSocket│
    │  APIs  │                   │   API   │                   │   API   │
    │        │                   │         │                   │         │
    └───┬────┘                   └────┬────┘                   └────┬────┘
        │                             │                             │
    ┌───▼──────────────────────────────▼─────────────────────────────▼───┐
    │                    BUSINESS LOGIC LAYER                           │
    │                                                                    │
    │  ┌─────────────┐  ┌─────────────────────────────────────────────┐ │
    │  │ ENTERPRISE  │  │            CONTEXT AGENTS                   │ │
    │  │    CORE     │  │                                             │ │
    │  │             │  │  ┌─────────┐ ┌─────────────┐ ┌─────────────┐ │ │
    │  │ • User Mgmt │◄─┤  │   MCA   │ │     NPA     │ │     WPA     │ │ │
    │  │ • Auth      │  │  │(Master  │ │(Nutrition   │ │(Workout     │ │ │
    │  │ • Profiles  │  │  │Coord.)  │ │Planning)    │ │Planning)    │ │ │
    │  │ • Analytics │  │  └─────────┘ └─────────────┘ └─────────────┘ │ │
    │  └─────────────┘  └─────────────────────────────────────────────┘ │
    └────────────────────────────────────────────────────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
    ┌───────▼────────┐    ┌───────────▼──────────┐    ┌────────▼────────┐
    │   PostgreSQL   │    │       Redis          │    │    MongoDB      │
    │   (Primary)    │    │   (Cache/Queue)      │    │  (Documents)    │
    └────────────────┘    └──────────────────────┘    └─────────────────┘
```

### **API Versioning Strategy**
```
API Versioning Approach:

┌─────────────────────────────────────────────────────────────┐
│                    VERSION MANAGEMENT                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Current: v1 (Stable)     │  Future: v2 (Beta)            │
│  • /api/v1/*             │  • /api/v2/*                   │
│  • Backward Compatible   │  • New Features                │
│  • Long-term Support     │  • Breaking Changes OK        │
│                          │                                │
│  Legacy: v0 (Deprecated) │  Alpha: v3 (Development)      │
│  • /api/v0/*            │  • /api/v3/* (Internal)       │
│  • Sunset: 2025-12-31   │  • Experimental Features      │
│                          │                                │
└─────────────────────────────────────────────────────────────┘

Version Selection Methods:
1. URL Path: /api/v1/users
2. Header: Accept: application/vnd.progressive.v1+json
3. Query Parameter: ?version=v1
4. Content Negotiation: application/json; version=1.0
```

---

## **REST API DOCUMENTATION**

### **Core Authentication Endpoints**
```yaml
# Authentication & Authorization APIs
/api/v1/auth:
  post:
    summary: "Authenticate user and obtain JWT token"
    operationId: "authenticateUser"
    tags: ["Authentication"]
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: ["email", "password"]
            properties:
              email:
                type: string
                format: email
                example: "user@example.com"
              password:
                type: string
                format: password
                minLength: 8
                example: "SecurePass123!"
              rememberMe:
                type: boolean
                default: false
              mfaCode:
                type: string
                pattern: "^[0-9]{6}$"
                description: "6-digit MFA code if MFA is enabled"
    responses:
      200:
        description: "Authentication successful"
        content:
          application/json:
            schema:
              type: object
              properties:
                access_token:
                  type: string
                  description: "JWT access token"
                refresh_token:
                  type: string
                  description: "JWT refresh token"
                token_type:
                  type: string
                  enum: ["Bearer"]
                expires_in:
                  type: integer
                  description: "Token expiration in seconds"
                user:
                  $ref: '#/components/schemas/User'
      401:
        description: "Invalid credentials"
      429:
        description: "Too many login attempts"

/api/v1/auth/refresh:
  post:
    summary: "Refresh access token using refresh token"
    security: 
      - refreshToken: []
    responses:
      200:
        description: "Token refreshed successfully"
        content:
          application/json:
            schema:
              type: object
              properties:
                access_token:
                  type: string
                expires_in:
                  type: integer

/api/v1/auth/logout:
  post:
    summary: "Logout and invalidate tokens"
    security:
      - bearerAuth: []
    responses:
      200:
        description: "Logout successful"

/api/v1/auth/register:
  post:
    summary: "Register new user account"
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: ["email", "password", "firstName", "lastName"]
            properties:
              email:
                type: string
                format: email
              password:
                type: string
                minLength: 8
                pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
              firstName:
                type: string
                minLength: 1
                maxLength: 50
              lastName:
                type: string
                minLength: 1
                maxLength: 50
              dateOfBirth:
                type: string
                format: date
              termsAccepted:
                type: boolean
                enum: [true]
    responses:
      201:
        description: "User registered successfully"
      400:
        description: "Invalid input data"
      409:
        description: "Email already exists"
```

### **User Management APIs**
```yaml
/api/v1/users:
  get:
    summary: "List users (Admin only)"
    security:
      - bearerAuth: []
    parameters:
      - name: page
        in: query
        schema:
          type: integer
          minimum: 1
          default: 1
      - name: limit
        in: query
        schema:
          type: integer
          minimum: 1
          maximum: 100
          default: 20
      - name: search
        in: query
        schema:
          type: string
          description: "Search by name or email"
      - name: role
        in: query
        schema:
          type: string
          enum: ["admin", "user", "premium"]
      - name: active
        in: query
        schema:
          type: boolean
    responses:
      200:
        description: "Users retrieved successfully"
        content:
          application/json:
            schema:
              type: object
              properties:
                users:
                  type: array
                  items:
                    $ref: '#/components/schemas/User'
                pagination:
                  $ref: '#/components/schemas/Pagination'
                filters:
                  type: object
                  properties:
                    applied:
                      type: object
                    available:
                      type: object

/api/v1/users/{userId}:
  get:
    summary: "Get user by ID"
    security:
      - bearerAuth: []
    parameters:
      - name: userId
        in: path
        required: true
        schema:
          type: string
          format: uuid
    responses:
      200:
        description: "User retrieved successfully"
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
      404:
        description: "User not found"

  put:
    summary: "Update user information"
    security:
      - bearerAuth: []
    parameters:
      - name: userId
        in: path
        required: true
        schema:
          type: string
          format: uuid
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/UserUpdateRequest'
    responses:
      200:
        description: "User updated successfully"
      400:
        description: "Invalid input data"
      403:
        description: "Insufficient permissions"
      404:
        description: "User not found"

/api/v1/users/me:
  get:
    summary: "Get current user profile"
    security:
      - bearerAuth: []
    responses:
      200:
        description: "Current user profile"
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'

/api/v1/users/me/profile:
  patch:
    summary: "Update current user profile"
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              firstName:
                type: string
              lastName:
                type: string
              dateOfBirth:
                type: string
                format: date
              height:
                type: number
                minimum: 0
                description: "Height in centimeters"
              weight:
                type: number
                minimum: 0
                description: "Weight in kilograms"
              activityLevel:
                type: string
                enum: ["sedentary", "lightly_active", "moderately_active", "very_active", "extra_active"]
              goals:
                type: array
                items:
                  type: string
                  enum: ["weight_loss", "muscle_gain", "maintenance", "endurance", "strength"]
              preferences:
                $ref: '#/components/schemas/UserPreferences'
    responses:
      200:
        description: "Profile updated successfully"
```

### **Context Agent APIs**
```yaml
# Master Coordination Agent (MCA) APIs
/api/v1/agents/mca/coordinate:
  post:
    summary: "Request cross-agent coordination"
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: ["task", "agents", "priority"]
            properties:
              task:
                type: string
                enum: ["create_plan", "update_plan", "sync_progress", "resolve_conflict"]
              agents:
                type: array
                items:
                  type: string
                  enum: ["npa", "wpa"]
                minItems: 1
              priority:
                type: string
                enum: ["low", "medium", "high", "urgent"]
              context:
                type: object
                description: "Additional context for coordination"
              deadline:
                type: string
                format: date-time
    responses:
      200:
        description: "Coordination request accepted"
        content:
          application/json:
            schema:
              type: object
              properties:
                coordinationId:
                  type: string
                  format: uuid
                status:
                  type: string
                  enum: ["initiated", "in_progress", "completed", "failed"]
                estimatedCompletion:
                  type: string
                  format: date-time
                involvedAgents:
                  type: array
                  items:
                    type: string

/api/v1/agents/mca/status:
  get:
    summary: "Get coordination status"
    security:
      - bearerAuth: []
    parameters:
      - name: coordinationId
        in: query
        schema:
          type: string
          format: uuid
      - name: status
        in: query
        schema:
          type: string
          enum: ["active", "completed", "failed"]
    responses:
      200:
        description: "Coordination status"
        content:
          application/json:
            schema:
              type: object
              properties:
                coordinations:
                  type: array
                  items:
                    $ref: '#/components/schemas/CoordinationStatus'

# Nutrition Planning Agent (NPA) APIs
/api/v1/agents/npa/plans:
  get:
    summary: "Get nutrition plans for user"
    security:
      - bearerAuth: []
    parameters:
      - name: userId
        in: query
        schema:
          type: string
          format: uuid
      - name: dateRange
        in: query
        schema:
          type: string
          enum: ["today", "week", "month"]
      - name: status
        in: query
        schema:
          type: string
          enum: ["active", "draft", "archived"]
    responses:
      200:
        description: "Nutrition plans retrieved"
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/NutritionPlan'

  post:
    summary: "Create new nutrition plan"
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: ["userId", "goals", "duration"]
            properties:
              userId:
                type: string
                format: uuid
              goals:
                type: array
                items:
                  type: string
                  enum: ["weight_loss", "muscle_gain", "maintenance", "performance"]
              duration:
                type: integer
                minimum: 1
                maximum: 365
                description: "Plan duration in days"
              dietaryRestrictions:
                type: array
                items:
                  type: string
                  enum: ["vegetarian", "vegan", "gluten_free", "dairy_free", "keto", "paleo"]
              targetCalories:
                type: integer
                minimum: 1000
                maximum: 5000
              macroTargets:
                type: object
                properties:
                  protein:
                    type: number
                    minimum: 0
                    maximum: 100
                  carbs:
                    type: number
                    minimum: 0
                    maximum: 100
                  fats:
                    type: number
                    minimum: 0
                    maximum: 100
    responses:
      201:
        description: "Nutrition plan created"
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NutritionPlan'

/api/v1/agents/npa/meals:
  get:
    summary: "Get meal suggestions"
    security:
      - bearerAuth: []
    parameters:
      - name: mealType
        in: query
        required: true
        schema:
          type: string
          enum: ["breakfast", "lunch", "dinner", "snack"]
      - name: calories
        in: query
        schema:
          type: integer
          minimum: 50
          maximum: 2000
      - name: prepTime
        in: query
        schema:
          type: integer
          minimum: 5
          maximum: 120
          description: "Maximum preparation time in minutes"
      - name: cuisine
        in: query
        schema:
          type: string
          enum: ["american", "italian", "asian", "mexican", "mediterranean"]
    responses:
      200:
        description: "Meal suggestions"
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/MealSuggestion'

# Workout Planning Agent (WPA) APIs
/api/v1/agents/wpa/workouts:
  get:
    summary: "Get workout plans for user"
    security:
      - bearerAuth: []
    parameters:
      - name: userId
        in: query
        schema:
          type: string
          format: uuid
      - name: type
        in: query
        schema:
          type: string
          enum: ["strength", "cardio", "flexibility", "hiit", "sports"]
      - name: difficulty
        in: query
        schema:
          type: string
          enum: ["beginner", "intermediate", "advanced"]
      - name: duration
        in: query
        schema:
          type: integer
          minimum: 10
          maximum: 180
          description: "Workout duration in minutes"
    responses:
      200:
        description: "Workout plans retrieved"
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/WorkoutPlan'

  post:
    summary: "Create new workout plan"
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: ["userId", "type", "duration", "frequency"]
            properties:
              userId:
                type: string
                format: uuid
              type:
                type: string
                enum: ["strength", "cardio", "flexibility", "hiit", "sports", "mixed"]
              duration:
                type: integer
                minimum: 10
                maximum: 180
              frequency:
                type: integer
                minimum: 1
                maximum: 7
                description: "Workouts per week"
              equipment:
                type: array
                items:
                  type: string
                  enum: ["none", "dumbbells", "barbell", "resistance_bands", "gym_access"]
              fitnessLevel:
                type: string
                enum: ["beginner", "intermediate", "advanced"]
              injuries:
                type: array
                items:
                  type: string
              goals:
                type: array
                items:
                  type: string
                  enum: ["strength", "endurance", "flexibility", "weight_loss", "muscle_gain"]
    responses:
      201:
        description: "Workout plan created"
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/WorkoutPlan'

/api/v1/agents/wpa/exercises:
  get:
    summary: "Search exercises"
    security:
      - bearerAuth: []
    parameters:
      - name: muscle_group
        in: query
        schema:
          type: string
          enum: ["chest", "back", "shoulders", "arms", "legs", "core", "full_body"]
      - name: equipment
        in: query
        schema:
          type: string
          enum: ["bodyweight", "dumbbells", "barbell", "machine", "cable"]
      - name: difficulty
        in: query
        schema:
          type: string
          enum: ["beginner", "intermediate", "advanced"]
      - name: search
        in: query
        schema:
          type: string
          description: "Search by exercise name"
    responses:
      200:
        description: "Exercise list"
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/Exercise'
```

### **Progress Tracking APIs**
```yaml
/api/v1/progress/nutrition:
  get:
    summary: "Get nutrition progress"
    security:
      - bearerAuth: []
    parameters:
      - name: date
        in: query
        schema:
          type: string
          format: date
      - name: period
        in: query
        schema:
          type: string
          enum: ["day", "week", "month"]
          default: "day"
    responses:
      200:
        description: "Nutrition progress data"
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NutritionProgress'

  post:
    summary: "Log nutrition intake"
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: ["mealType", "foods"]
            properties:
              mealType:
                type: string
                enum: ["breakfast", "lunch", "dinner", "snack"]
              foods:
                type: array
                items:
                  type: object
                  required: ["foodId", "quantity"]
                  properties:
                    foodId:
                      type: string
                    quantity:
                      type: number
                      minimum: 0
                    unit:
                      type: string
                      enum: ["grams", "ounces", "cups", "pieces"]
              timestamp:
                type: string
                format: date-time
    responses:
      201:
        description: "Nutrition intake logged"

/api/v1/progress/workouts:
  get:
    summary: "Get workout progress"
    security:
      - bearerAuth: []
    parameters:
      - name: date
        in: query
        schema:
          type: string
          format: date
      - name: period
        in: query
        schema:
          type: string
          enum: ["day", "week", "month"]
    responses:
      200:
        description: "Workout progress data"
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/WorkoutProgress'

  post:
    summary: "Log workout completion"
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: ["workoutId", "exercises"]
            properties:
              workoutId:
                type: string
                format: uuid
              exercises:
                type: array
                items:
                  type: object
                  required: ["exerciseId", "sets"]
                  properties:
                    exerciseId:
                      type: string
                    sets:
                      type: array
                      items:
                        type: object
                        properties:
                          reps:
                            type: integer
                            minimum: 1
                          weight:
                            type: number
                            minimum: 0
                          duration:
                            type: integer
                            description: "Duration in seconds"
                          distance:
                            type: number
                            description: "Distance in meters"
              duration:
                type: integer
                description: "Total workout duration in minutes"
              caloriesBurned:
                type: integer
                minimum: 0
              notes:
                type: string
                maxLength: 500
    responses:
      201:
        description: "Workout logged successfully"
```

---

## **GRAPHQL API SCHEMA**

### **Core GraphQL Schema**
```graphql
# schema.graphql
scalar DateTime
scalar Upload

type Query {
  # User queries
  me: User!
  user(id: ID!): User
  users(
    page: Int = 1
    limit: Int = 20
    search: String
    role: UserRole
    active: Boolean
  ): UserConnection!
  
  # Nutrition queries
  nutritionPlans(
    userId: ID
    status: PlanStatus
    dateRange: DateRange
  ): [NutritionPlan!]!
  
  nutritionPlan(id: ID!): NutritionPlan
  
  mealSuggestions(
    mealType: MealType!
    calories: Int
    prepTime: Int
    cuisine: Cuisine
    restrictions: [DietaryRestriction!]
  ): [MealSuggestion!]!
  
  # Workout queries
  workoutPlans(
    userId: ID
    type: WorkoutType
    difficulty: Difficulty
  ): [WorkoutPlan!]!
  
  workoutPlan(id: ID!): WorkoutPlan
  
  exercises(
    muscleGroup: MuscleGroup
    equipment: Equipment
    difficulty: Difficulty
    search: String
  ): [Exercise!]!
  
  # Progress queries
  nutritionProgress(
    date: DateTime
    period: Period = DAY
  ): NutritionProgress!
  
  workoutProgress(
    date: DateTime
    period: Period = DAY
  ): WorkoutProgress!
  
  # Agent coordination
  coordinationStatus(
    id: ID
    status: CoordinationStatus
  ): [Coordination!]!
}

type Mutation {
  # Authentication
  login(input: LoginInput!): AuthPayload!
  register(input: RegisterInput!): AuthPayload!
  refreshToken(token: String!): AuthPayload!
  logout: Boolean!
  
  # User management
  updateProfile(input: UpdateProfileInput!): User!
  changePassword(input: ChangePasswordInput!): Boolean!
  deleteAccount: Boolean!
  
  # Nutrition planning
  createNutritionPlan(input: CreateNutritionPlanInput!): NutritionPlan!
  updateNutritionPlan(id: ID!, input: UpdateNutritionPlanInput!): NutritionPlan!
  deleteNutritionPlan(id: ID!): Boolean!
  logNutritionIntake(input: NutritionIntakeInput!): NutritionLog!
  
  # Workout planning
  createWorkoutPlan(input: CreateWorkoutPlanInput!): WorkoutPlan!
  updateWorkoutPlan(id: ID!, input: UpdateWorkoutPlanInput!): WorkoutPlan!
  deleteWorkoutPlan(id: ID!): Boolean!
  logWorkout(input: WorkoutLogInput!): WorkoutLog!
  
  # Agent coordination
  requestCoordination(input: CoordinationInput!): Coordination!
  
  # File upload
  uploadFile(file: Upload!): FileUpload!
}

type Subscription {
  # Real-time updates
  progressUpdated(userId: ID!): ProgressUpdate!
  coordinationStatusChanged(coordinationId: ID!): Coordination!
  planUpdated(planId: ID!): PlanUpdate!
  notificationReceived(userId: ID!): Notification!
}

# User Types
type User {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  dateOfBirth: DateTime
  height: Float
  weight: Float
  activityLevel: ActivityLevel!
  goals: [Goal!]!
  preferences: UserPreferences!
  role: UserRole!
  isActive: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Relationships
  nutritionPlans: [NutritionPlan!]!
  workoutPlans: [WorkoutPlan!]!
  progressLogs: [ProgressLog!]!
}

type UserPreferences {
  timezone: String!
  units: UnitSystem!
  notifications: NotificationSettings!
  privacy: PrivacySettings!
  theme: Theme!
}

# Nutrition Types
type NutritionPlan {
  id: ID!
  userId: ID!
  name: String!
  description: String
  goals: [Goal!]!
  targetCalories: Int!
  macroTargets: MacroTargets!
  duration: Int!
  status: PlanStatus!
  meals: [Meal!]!
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Computed fields
  progress: NutritionProgress!
  adherenceRate: Float!
}

type Meal {
  id: ID!
  name: String!
  type: MealType!
  foods: [Food!]!
  calories: Int!
  macros: Macros!
  prepTime: Int
  instructions: String
}

type Food {
  id: ID!
  name: String!
  brand: String
  quantity: Float!
  unit: String!
  calories: Int!
  macros: Macros!
  micronutrients: [Micronutrient!]!
}

# Workout Types
type WorkoutPlan {
  id: ID!
  userId: ID!
  name: String!
  description: String
  type: WorkoutType!
  difficulty: Difficulty!
  duration: Int!
  frequency: Int!
  equipment: [Equipment!]!
  workouts: [Workout!]!
  status: PlanStatus!
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Computed fields
  progress: WorkoutProgress!
  completionRate: Float!
}

type Workout {
  id: ID!
  name: String!
  description: String
  type: WorkoutType!
  estimatedDuration: Int!
  exercises: [WorkoutExercise!]!
  restBetweenSets: Int
  notes: String
}

type Exercise {
  id: ID!
  name: String!
  description: String!
  instructions: String!
  muscleGroups: [MuscleGroup!]!
  equipment: Equipment!
  difficulty: Difficulty!
  videoUrl: String
  imageUrls: [String!]!
  tips: [String!]!
}

type WorkoutExercise {
  exercise: Exercise!
  sets: Int!
  reps: Int
  weight: Float
  duration: Int
  distance: Float
  restBetween: Int
}

# Progress Types
type NutritionProgress {
  date: DateTime!
  targetCalories: Int!
  consumedCalories: Int!
  targetMacros: MacroTargets!
  consumedMacros: Macros!
  meals: [MealLog!]!
  adherenceScore: Float!
}

type WorkoutProgress {
  date: DateTime!
  targetWorkouts: Int!
  completedWorkouts: Int!
  totalDuration: Int!
  caloriesBurned: Int!
  exerciseCount: Int!
  adherenceScore: Float!
}

# Agent Coordination Types
type Coordination {
  id: ID!
  task: CoordinationTask!
  agents: [AgentType!]!
  status: CoordinationStatus!
  priority: Priority!
  context: JSON
  result: JSON
  startedAt: DateTime!
  completedAt: DateTime
  estimatedCompletion: DateTime
}

# Enums
enum UserRole {
  ADMIN
  USER
  PREMIUM
}

enum ActivityLevel {
  SEDENTARY
  LIGHTLY_ACTIVE
  MODERATELY_ACTIVE
  VERY_ACTIVE
  EXTRA_ACTIVE
}

enum Goal {
  WEIGHT_LOSS
  MUSCLE_GAIN
  MAINTENANCE
  ENDURANCE
  STRENGTH
  PERFORMANCE
}

enum MealType {
  BREAKFAST
  LUNCH
  DINNER
  SNACK
}

enum WorkoutType {
  STRENGTH
  CARDIO
  FLEXIBILITY
  HIIT
  SPORTS
  MIXED
}

enum Difficulty {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum Equipment {
  NONE
  DUMBBELLS
  BARBELL
  RESISTANCE_BANDS
  MACHINE
  CABLE
  GYM_ACCESS
}

enum MuscleGroup {
  CHEST
  BACK
  SHOULDERS
  ARMS
  LEGS
  CORE
  FULL_BODY
}

enum PlanStatus {
  DRAFT
  ACTIVE
  COMPLETED
  ARCHIVED
}

enum CoordinationTask {
  CREATE_PLAN
  UPDATE_PLAN
  SYNC_PROGRESS
  RESOLVE_CONFLICT
}

enum CoordinationStatus {
  INITIATED
  IN_PROGRESS
  COMPLETED
  FAILED
}

enum AgentType {
  MCA
  NPA
  WPA
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum Period {
  DAY
  WEEK
  MONTH
  YEAR
}

# Input Types
input LoginInput {
  email: String!
  password: String!
  rememberMe: Boolean = false
  mfaCode: String
}

input RegisterInput {
  email: String!
  password: String!
  firstName: String!
  lastName: String!
  dateOfBirth: DateTime
  termsAccepted: Boolean!
}

input CreateNutritionPlanInput {
  name: String!
  description: String
  goals: [Goal!]!
  duration: Int!
  targetCalories: Int!
  macroTargets: MacroTargetsInput!
  dietaryRestrictions: [DietaryRestriction!]
}

input CreateWorkoutPlanInput {
  name: String!
  description: String
  type: WorkoutType!
  duration: Int!
  frequency: Int!
  equipment: [Equipment!]!
  fitnessLevel: Difficulty!
  goals: [Goal!]!
  injuries: [String!]
}

input CoordinationInput {
  task: CoordinationTask!
  agents: [AgentType!]!
  priority: Priority!
  context: JSON
  deadline: DateTime
}
```

---

## **WEBHOOK IMPLEMENTATIONS**

### **Webhook Architecture**
```
Webhook Event Flow:

┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   EVENT SOURCE  │───▶│  WEBHOOK ENGINE  │───▶│   SUBSCRIBERS   │
│                 │    │                  │    │                 │
│ • User Actions  │    │ • Event Queue    │    │ • External APIs │
│ • System Events │    │ • Retry Logic    │    │ • Integrations  │
│ • Agent Updates │    │ • Rate Limiting  │    │ • Notifications │
│ • Data Changes  │    │ • Security       │    │ • Analytics     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### **Webhook Event Types**
```typescript
// types/webhooks.ts
export interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  timestamp: string;
  version: string;
  data: any;
  metadata: {
    source: string;
    userId?: string;
    correlationId?: string;
  };
}

export enum WebhookEventType {
  // User events
  USER_REGISTERED = 'user.registered',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  
  // Plan events
  NUTRITION_PLAN_CREATED = 'nutrition_plan.created',
  NUTRITION_PLAN_UPDATED = 'nutrition_plan.updated',
  NUTRITION_PLAN_COMPLETED = 'nutrition_plan.completed',
  WORKOUT_PLAN_CREATED = 'workout_plan.created',
  WORKOUT_PLAN_UPDATED = 'workout_plan.updated',
  WORKOUT_PLAN_COMPLETED = 'workout_plan.completed',
  
  // Progress events
  NUTRITION_LOGGED = 'nutrition.logged',
  WORKOUT_COMPLETED = 'workout.completed',
  GOAL_ACHIEVED = 'goal.achieved',
  MILESTONE_REACHED = 'milestone.reached',
  
  // Agent events
  COORDINATION_REQUESTED = 'coordination.requested',
  COORDINATION_COMPLETED = 'coordination.completed',
  AGENT_RECOMMENDATION = 'agent.recommendation',
  
  // System events
  SYSTEM_ALERT = 'system.alert',
  BACKUP_COMPLETED = 'backup.completed',
  MAINTENANCE_SCHEDULED = 'maintenance.scheduled',
}

// Specific event data structures
export interface UserRegisteredEvent extends WebhookEvent {
  type: WebhookEventType.USER_REGISTERED;
  data: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    registrationMethod: 'email' | 'oauth' | 'invitation';
    referralCode?: string;
  };
}

export interface NutritionPlanCreatedEvent extends WebhookEvent {
  type: WebhookEventType.NUTRITION_PLAN_CREATED;
  data: {
    planId: string;
    userId: string;
    planName: string;
    goals: string[];
    duration: number;
    targetCalories: number;
    createdBy: 'user' | 'npa' | 'mca';
  };
}

export interface WorkoutCompletedEvent extends WebhookEvent {
  type: WebhookEventType.WORKOUT_COMPLETED;
  data: {
    workoutId: string;
    userId: string;
    workoutName: string;
    duration: number;
    caloriesBurned: number;
    exerciseCount: number;
    completionRate: number;
    difficulty: string;
  };
}

export interface CoordinationRequestedEvent extends WebhookEvent {
  type: WebhookEventType.COORDINATION_REQUESTED;
  data: {
    coordinationId: string;
    task: string;
    requestingAgent: string;
    targetAgents: string[];
    priority: string;
    context: any;
  };
}
```

### **Webhook Configuration API**
```yaml
/api/v1/webhooks:
  get:
    summary: "List webhook subscriptions"
    security:
      - bearerAuth: []
    parameters:
      - name: active
        in: query
        schema:
          type: boolean
    responses:
      200:
        description: "Webhook subscriptions"
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/WebhookSubscription'

  post:
    summary: "Create webhook subscription"
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: ["url", "events"]
            properties:
              url:
                type: string
                format: uri
                description: "Webhook endpoint URL"
              events:
                type: array
                items:
                  type: string
                  enum: [
                    "user.registered", "user.updated", "user.deleted",
                    "nutrition_plan.created", "nutrition_plan.updated",
                    "workout_plan.created", "workout_plan.updated",
                    "nutrition.logged", "workout.completed",
                    "coordination.requested", "coordination.completed"
                  ]
              secret:
                type: string
                description: "Secret for webhook signature verification"
              active:
                type: boolean
                default: true
              retryPolicy:
                type: object
                properties:
                  maxRetries:
                    type: integer
                    minimum: 0
                    maximum: 10
                    default: 3
                  backoffStrategy:
                    type: string
                    enum: ["linear", "exponential"]
                    default: "exponential"
              filters:
                type: object
                description: "Event filtering criteria"
    responses:
      201:
        description: "Webhook subscription created"

/api/v1/webhooks/{webhookId}:
  get:
    summary: "Get webhook subscription"
    security:
      - bearerAuth: []
    parameters:
      - name: webhookId
        in: path
        required: true
        schema:
          type: string
          format: uuid
    responses:
      200:
        description: "Webhook subscription details"

  put:
    summary: "Update webhook subscription"
    security:
      - bearerAuth: []
    parameters:
      - name: webhookId
        in: path
        required: true
        schema:
          type: string
          format: uuid
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/WebhookUpdateRequest'
    responses:
      200:
        description: "Webhook subscription updated"

  delete:
    summary: "Delete webhook subscription"
    security:
      - bearerAuth: []
    parameters:
      - name: webhookId
        in: path
        required: true
        schema:
          type: string
          format: uuid
    responses:
      204:
        description: "Webhook subscription deleted"

/api/v1/webhooks/{webhookId}/deliveries:
  get:
    summary: "Get webhook delivery history"
    security:
      - bearerAuth: []
    parameters:
      - name: webhookId
        in: path
        required: true
        schema:
          type: string
          format: uuid
      - name: status
        in: query
        schema:
          type: string
          enum: ["success", "failed", "pending"]
      - name: since
        in: query
        schema:
          type: string
          format: date-time
    responses:
      200:
        description: "Webhook delivery history"
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/WebhookDelivery'

/api/v1/webhooks/test:
  post:
    summary: "Test webhook endpoint"
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: ["url", "eventType"]
            properties:
              url:
                type: string
                format: uri
              eventType:
                type: string
              payload:
                type: object
    responses:
      200:
        description: "Webhook test completed"
```

---

## **THIRD-PARTY INTEGRATIONS**

### **Fitness Tracker Integration**
```typescript
// integrations/fitness-trackers.ts
export class FitnessTrackerIntegration {
  private providers: Map<string, FitnessProvider> = new Map();
  
  constructor() {
    this.registerProviders();
  }
  
  private registerProviders() {
    this.providers.set('fitbit', new FitbitProvider());
    this.providers.set('garmin', new GarminProvider());
    this.providers.set('apple_health', new AppleHealthProvider());
    this.providers.set('google_fit', new GoogleFitProvider());
    this.providers.set('strava', new StravaProvider());
    this.providers.set('myfitnesspal', new MyFitnessPalProvider());
  }
  
  async connectDevice(userId: string, provider: string, authData: any): Promise<Connection> {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    
    const connection = await providerInstance.connect(authData);
    
    // Store connection details
    await this.storeConnection(userId, provider, connection);
    
    // Start data sync
    await this.initiateDataSync(userId, provider);
    
    return connection;
  }
  
  async syncData(userId: string, provider: string, dataTypes: string[] = []): Promise<SyncResult> {
    const providerInstance = this.providers.get(provider);
    const connection = await this.getConnection(userId, provider);
    
    if (!connection || !connection.isValid()) {
      throw new Error('Invalid or expired connection');
    }
    
    const syncResults: SyncResult = {
      provider,
      timestamp: new Date(),
      dataTypes: {},
      errors: []
    };
    
    try {
      // Sync different data types
      if (dataTypes.length === 0 || dataTypes.includes('steps')) {
        syncResults.dataTypes.steps = await providerInstance.getSteps(connection, {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          endDate: new Date()
        });
      }
      
      if (dataTypes.length === 0 || dataTypes.includes('workouts')) {
        syncResults.dataTypes.workouts = await providerInstance.getWorkouts(connection, {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          endDate: new Date()
        });
      }
      
      if (dataTypes.length === 0 || dataTypes.includes('nutrition')) {
        syncResults.dataTypes.nutrition = await providerInstance.getNutrition(connection, {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          endDate: new Date()
        });
      }
      
      if (dataTypes.length === 0 || dataTypes.includes('biometrics')) {
        syncResults.dataTypes.biometrics = await providerInstance.getBiometrics(connection, {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          endDate: new Date()
        });
      }
      
      // Process and store synced data
      await this.processSyncedData(userId, syncResults);
      
    } catch (error) {
      syncResults.errors.push({
        type: 'sync_error',
        message: error.message,
        timestamp: new Date()
      });
    }
    
    return syncResults;
  }
}

abstract class FitnessProvider {
  abstract connect(authData: any): Promise<Connection>;
  abstract getSteps(connection: Connection, options: DateRangeOptions): Promise<StepsData[]>;
  abstract getWorkouts(connection: Connection, options: DateRangeOptions): Promise<WorkoutData[]>;
  abstract getNutrition(connection: Connection, options: DateRangeOptions): Promise<NutritionData[]>;
  abstract getBiometrics(connection: Connection, options: DateRangeOptions): Promise<BiometricData[]>;
}

class FitbitProvider extends FitnessProvider {
  async connect(authData: { accessToken: string; refreshToken: string; expiresAt: Date }): Promise<Connection> {
    return new FitbitConnection(authData);
  }
  
  async getSteps(connection: FitbitConnection, options: DateRangeOptions): Promise<StepsData[]> {
    const response = await fetch(
      `https://api.fitbit.com/1/user/-/activities/steps/date/${this.formatDate(options.startDate)}/${this.formatDate(options.endDate)}.json`,
      {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`
        }
      }
    );
    
    const data = await response.json();
    
    return data['activities-steps'].map((entry: any) => ({
      date: new Date(entry.dateTime),
      steps: parseInt(entry.value),
      source: 'fitbit'
    }));
  }
  
  async getWorkouts(connection: FitbitConnection, options: DateRangeOptions): Promise<WorkoutData[]> {
    const response = await fetch(
      `https://api.fitbit.com/1/user/-/activities/list.json?afterDate=${this.formatDate(options.startDate)}&sort=asc&offset=0&limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`
        }
      }
    );
    
    const data = await response.json();
    
    return data.activities.map((activity: any) => ({
      id: activity.logId.toString(),
      name: activity.activityName,
      type: this.mapActivityType(activity.activityName),
      startTime: new Date(activity.startTime),
      duration: activity.duration,
      calories: activity.calories,
      distance: activity.distance,
      averageHeartRate: activity.averageHeartRate,
      source: 'fitbit'
    }));
  }
  
  private mapActivityType(activityName: string): string {
    const mapping: { [key: string]: string } = {
      'Run': 'cardio',
      'Walk': 'cardio',
      'Bike': 'cardio',
      'Weight Lifting': 'strength',
      'Yoga': 'flexibility',
      'Swimming': 'cardio'
    };
    
    return mapping[activityName] || 'general';
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
```

### **Nutrition Database Integration**
```typescript
// integrations/nutrition-databases.ts
export class NutritionDatabaseIntegration {
  private databases: Map<string, NutritionDatabase> = new Map();
  
  constructor() {
    this.registerDatabases();
  }
  
  private registerDatabases() {
    this.databases.set('usda', new USDADatabase());
    this.databases.set('edamam', new EdamamDatabase());
    this.databases.set('spoonacular', new SpoonacularDatabase());
    this.databases.set('nutritionix', new NutritionixDatabase());
  }
  
  async searchFood(query: string, options: FoodSearchOptions = {}): Promise<FoodSearchResult[]> {
    const results: FoodSearchResult[] = [];
    const databases = options.databases || ['usda', 'edamam'];
    
    // Search across multiple databases
    const searchPromises = databases.map(async (dbName) => {
      const database = this.databases.get(dbName);
      if (database) {
        try {
          const dbResults = await database.searchFood(query, options);
          return dbResults.map(result => ({ ...result, source: dbName }));
        } catch (error) {
          console.error(`Error searching ${dbName}:`, error);
          return [];
        }
      }
      return [];
    });
    
    const allResults = await Promise.all(searchPromises);
    const flatResults = allResults.flat();
    
    // Deduplicate and rank results
    return this.rankAndDeduplicateResults(flatResults);
  }
  
  async getFoodDetails(foodId: string, source: string): Promise<FoodDetails | null> {
    const database = this.databases.get(source);
    if (!database) {
      throw new Error(`Unknown database source: ${source}`);
    }
    
    return await database.getFoodDetails(foodId);
  }
  
  async getRecipeSuggestions(ingredients: string[], options: RecipeOptions = {}): Promise<Recipe[]> {
    const spoonacular = this.databases.get('spoonacular') as SpoonacularDatabase;
    if (!spoonacular) {
      return [];
    }
    
    return await spoonacular.findRecipesByIngredients(ingredients, options);
  }
  
  private rankAndDeduplicateResults(results: FoodSearchResult[]): FoodSearchResult[] {
    // Group by similar names
    const grouped = new Map<string, FoodSearchResult[]>();
    
    results.forEach(result => {
      const normalizedName = this.normalizeFood.name(result.name);
      if (!grouped.has(normalizedName)) {
        grouped.set(normalizedName, []);
      }
      grouped.get(normalizedName)!.push(result);
    });
    
    // Select best result from each group
    const deduplicated: FoodSearchResult[] = [];
    grouped.forEach((group) => {
      // Sort by data quality score
      group.sort((a, b) => {
        const scoreA = this.calculateDataQualityScore(a);
        const scoreB = this.calculateDataQualityScore(b);
        return scoreB - scoreA;
      });
      
      deduplicated.push(group[0]);
    });
    
    // Sort final results by relevance
    return deduplicated.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
  
  private calculateDataQualityScore(food: FoodSearchResult): number {
    let score = 0;
    
    // Source preference
    const sourceScores: { [key: string]: number } = {
      'usda': 10,
      'edamam': 8,
      'nutritionix': 6,
      'spoonacular': 4
    };
    score += sourceScores[food.source] || 0;
    
    // Data completeness
    if (food.nutrition.protein !== undefined) score += 2;
    if (food.nutrition.carbs !== undefined) score += 2;
    if (food.nutrition.fat !== undefined) score += 2;
    if (food.nutrition.fiber !== undefined) score += 1;
    if (food.nutrition.sugar !== undefined) score += 1;
    
    // Brand information
    if (food.brand) score += 2;
    
    return score;
  }
}

class USDADatabase implements NutritionDatabase {
  private apiKey: string;
  private baseUrl = 'https://api.nal.usda.gov/fdc/v1';
  
  constructor() {
    this.apiKey = process.env.USDA_API_KEY!;
  }
  
  async searchFood(query: string, options: FoodSearchOptions): Promise<FoodSearchResult[]> {
    const params = new URLSearchParams({
      query,
      api_key: this.apiKey,
      pageSize: (options.limit || 10).toString(),
      dataType: 'Foundation,SR Legacy',
      sortBy: 'dataType.keyword',
      sortOrder: 'asc'
    });
    
    const response = await fetch(`${this.baseUrl}/foods/search?${params}`);
    const data = await response.json();
    
    return data.foods.map((food: any) => ({
      id: food.fdcId.toString(),
      name: food.description,
      brand: food.brandOwner,
      calories: this.extractNutrient(food.foodNutrients, 1008),
      nutrition: {
        protein: this.extractNutrient(food.foodNutrients, 1003),
        carbs: this.extractNutrient(food.foodNutrients, 1005),
        fat: this.extractNutrient(food.foodNutrients, 1004),
        fiber: this.extractNutrient(food.foodNutrients, 1079),
        sugar: this.extractNutrient(food.foodNutrients, 1063),
        sodium: this.extractNutrient(food.foodNutrients, 1093)
      },
      servingSize: {
        amount: 100,
        unit: 'g'
      },
      relevanceScore: 0.8
    }));
  }
  
  async getFoodDetails(foodId: string): Promise<FoodDetails> {
    const response = await fetch(`${this.baseUrl}/food/${foodId}?api_key=${this.apiKey}`);
    const food = await response.json();
    
    return {
      id: food.fdcId.toString(),
      name: food.description,
      brand: food.brandOwner,
      category: food.foodCategory?.description,
      ingredients: food.ingredients,
      allergens: this.extractAllergens(food),
      nutrition: {
        calories: this.extractNutrient(food.foodNutrients, 1008),
        protein: this.extractNutrient(food.foodNutrients, 1003),
        carbs: this.extractNutrient(food.foodNutrients, 1005),
        fat: this.extractNutrient(food.foodNutrients, 1004),
        fiber: this.extractNutrient(food.foodNutrients, 1079),
        sugar: this.extractNutrient(food.foodNutrients, 1063),
        sodium: this.extractNutrient(food.foodNutrients, 1093),
        vitamins: this.extractVitamins(food.foodNutrients),
        minerals: this.extractMinerals(food.foodNutrients)
      },
      servingSizes: this.extractServingSizes(food),
      source: 'usda'
    };
  }
  
  private extractNutrient(nutrients: any[], nutrientId: number): number | undefined {
    const nutrient = nutrients.find(n => n.nutrient.id === nutrientId);
    return nutrient ? nutrient.amount : undefined;
  }
  
  private extractAllergens(food: any): string[] {
    // USDA doesn't provide allergen data directly
    // This would need to be inferred from ingredients
    return [];
  }
  
  private extractVitamins(nutrients: any[]): { [key: string]: number } {
    const vitaminIds: { [key: number]: string } = {
      1106: 'vitaminA',
      1162: 'vitaminC',
      1114: 'vitaminD',
      1109: 'vitaminE',
      1185: 'vitaminK',
      1165: 'thiamin',
      1166: 'riboflavin',
      1167: 'niacin',
      1175: 'vitaminB6',
      1177: 'folate',
      1178: 'vitaminB12'
    };
    
    const vitamins: { [key: string]: number } = {};
    
    nutrients.forEach(nutrient => {
      const vitaminName = vitaminIds[nutrient.nutrient.id];
      if (vitaminName) {
        vitamins[vitaminName] = nutrient.amount;
      }
    });
    
    return vitamins;
  }
  
  private extractMinerals(nutrients: any[]): { [key: string]: number } {
    const mineralIds: { [key: number]: string } = {
      1087: 'calcium',
      1089: 'iron',
      1090: 'magnesium',
      1091: 'phosphorus',
      1092: 'potassium',
      1093: 'sodium',
      1095: 'zinc',
      1098: 'copper',
      1101: 'manganese',
      1103: 'selenium'
    };
    
    const minerals: { [key: string]: number } = {};
    
    nutrients.forEach(nutrient => {
      const mineralName = mineralIds[nutrient.nutrient.id];
      if (mineralName) {
        minerals[mineralName] = nutrient.amount;
      }
    });
    
    return minerals;
  }
  
  private extractServingSizes(food: any): ServingSize[] {
    const servingSizes: ServingSize[] = [
      { amount: 100, unit: 'g', description: '100 grams' }
    ];
    
    if (food.foodPortions) {
      food.foodPortions.forEach((portion: any) => {
        servingSizes.push({
          amount: portion.gramWeight,
          unit: 'g',
          description: portion.portionDescription,
          householdAmount: portion.amount,
          householdUnit: portion.modifier
        });
      });
    }
    
    return servingSizes;
  }
}
```

### **Payment Gateway Integration**
```yaml
/api/v1/payments/subscribe:
  post:
    summary: "Create subscription"
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: ["planId", "paymentMethod"]
            properties:
              planId:
                type: string
                enum: ["basic", "premium", "enterprise"]
              paymentMethod:
                type: object
                required: ["type"]
                properties:
                  type:
                    type: string
                    enum: ["card", "paypal", "bank_transfer"]
                  cardToken:
                    type: string
                    description: "Stripe token for card payments"
                  paypalToken:
                    type: string
                    description: "PayPal payment token"
              billingCycle:
                type: string
                enum: ["monthly", "yearly"]
                default: "monthly"
              couponCode:
                type: string
    responses:
      201:
        description: "Subscription created"
        content:
          application/json:
            schema:
              type: object
              properties:
                subscriptionId:
                  type: string
                status:
                  type: string
                  enum: ["active", "pending", "trial"]
                nextBillingDate:
                  type: string
                  format: date
                amount:
                  type: number
                currency:
                  type: string

/api/v1/payments/webhooks/stripe:
  post:
    summary: "Stripe webhook endpoint"
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
    responses:
      200:
        description: "Webhook processed"

/api/v1/payments/subscriptions:
  get:
    summary: "Get user subscriptions"
    security:
      - bearerAuth: []
    responses:
      200:
        description: "User subscriptions"
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: string
                  plan:
                    type: string
                  status:
                    type: string
                  currentPeriodStart:
                    type: string
                    format: date-time
                  currentPeriodEnd:
                    type: string
                    format: date-time
                  cancelAtPeriodEnd:
                    type: boolean

/api/v1/payments/subscriptions/{subscriptionId}/cancel:
  post:
    summary: "Cancel subscription"
    security:
      - bearerAuth: []
    parameters:
      - name: subscriptionId
        in: path
        required: true
        schema:
          type: string
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              cancelAt:
                type: string
                enum: ["now", "period_end"]
                default: "period_end"
              reason:
                type: string
                enum: ["too_expensive", "missing_features", "technical_issues", "other"]
              feedback:
                type: string
                maxLength: 500
    responses:
      200:
        description: "Subscription cancelled"
```

---

## **API SECURITY & RATE LIMITING**

### **Authentication & Authorization**
```typescript
// middleware/auth.ts
export class AuthenticationMiddleware {
  private jwtService: JWTService;
  private userService: UserService;
  
  constructor() {
    this.jwtService = new JWTService();
    this.userService = new UserService();
  }
  
  async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'authentication_required',
          message: 'Bearer token required'
        });
      }
      
      const token = authHeader.substring(7);
      const payload = await this.jwtService.verifyToken(token);
      
      // Check if token is blacklisted
      if (await this.jwtService.isTokenBlacklisted(token)) {
        return res.status(401).json({
          error: 'token_revoked',
          message: 'Token has been revoked'
        });
      }
      
      // Load user
      const user = await this.userService.findById(payload.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({
          error: 'user_inactive',
          message: 'User account is inactive'
        });
      }
      
      // Add user to request context
      req.user = user;
      req.token = token;
      
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({
          error: 'token_expired',
          message: 'Token has expired'
        });
      }
      
      return res.status(401).json({
        error: 'invalid_token',
        message: 'Invalid authentication token'
      });
    }
  }
  
  requireRole(roles: string | string[]) {
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'authentication_required',
          message: 'Authentication required'
        });
      }
      
      if (!requiredRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: 'insufficient_permissions',
          message: 'Insufficient permissions for this resource'
        });
      }
      
      next();
    };
  }
  
  requirePermission(permission: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'authentication_required'
        });
      }
      
      const hasPermission = await this.userService.hasPermission(req.user.id, permission);
      if (!hasPermission) {
        return res.status(403).json({
          error: 'insufficient_permissions',
          message: `Permission '${permission}' required`
        });
      }
      
      next();
    };
  }
}
```

### **Rate Limiting Configuration**
```typescript
// middleware/rate-limiting.ts
export class RateLimitingMiddleware {
  private redis: Redis;
  private configs: Map<string, RateLimitConfig>;
  
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
    this.setupRateLimitConfigs();
  }
  
  private setupRateLimitConfigs() {
    this.configs = new Map([
      // Authentication endpoints
      ['auth:login', {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5,
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
        keyGenerator: (req) => req.ip
      }],
      
      ['auth:register', {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 3,
        keyGenerator: (req) => req.ip
      }],
      
      // API endpoints by user role
      ['api:free', {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 100,
        keyGenerator: (req) => req.user?.id || req.ip
      }],
      
      ['api:premium', {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 1000,
        keyGenerator: (req) => req.user.id
      }],
      
      ['api:admin', {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 10000,
        keyGenerator: (req) => req.user.id
      }],
      
      // Agent endpoints
      ['agents:coordination', {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10,
        keyGenerator: (req) => req.user.id
      }],
      
      // File upload
      ['upload:file', {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 20,
        keyGenerator: (req) => req.user.id
      }],
      
      // Webhook testing
      ['webhooks:test', {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 5,
        keyGenerator: (req) => req.user.id
      }]
    ]);
  }
  
  createLimiter(configKey: string) {
    const config = this.configs.get(configKey);
    if (!config) {
      throw new Error(`Rate limit config not found: ${configKey}`);
    }
    
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const key = `rate_limit:${configKey}:${config.keyGenerator(req)}`;
        const now = Date.now();
        const windowStart = now - config.windowMs;
        
        // Clean old entries and count current requests
        await this.redis.zremrangebyscore(key, 0, windowStart);
        const currentRequests = await this.redis.zcard(key);
        
        if (currentRequests >= config.maxRequests) {
          const oldestRequest = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
          const resetTime = oldestRequest.length > 0 
            ? parseInt(oldestRequest[1]) + config.windowMs 
            : now + config.windowMs;
          
          res.set({
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString()
          });
          
          return res.status(429).json({
            error: 'rate_limit_exceeded',
            message: 'Too many requests',
            retryAfter: Math.ceil((resetTime - now) / 1000)
          });
        }
        
        // Add current request
        await this.redis.zadd(key, now, `${now}-${Math.random()}`);
        await this.redis.expire(key, Math.ceil(config.windowMs / 1000));
        
        // Set rate limit headers
        res.set({
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': (config.maxRequests - currentRequests - 1).toString(),
          'X-RateLimit-Reset': Math.ceil((now + config.windowMs) / 1000).toString()
        });
        
        next();
      } catch (error) {
        console.error('Rate limiting error:', error);
        // Allow request to proceed if rate limiting fails
        next();
      }
    };
  }
}

// Usage in routes
app.post('/api/v1/auth/login', rateLimiter.createLimiter('auth:login'), authController.login);
app.post('/api/v1/auth/register', rateLimiter.createLimiter('auth:register'), authController.register);

// Dynamic rate limiting based on user role
app.use('/api/v1', (req, res, next) => {
  if (!req.user) {
    return rateLimiter.createLimiter('api:free')(req, res, next);
  }
  
  const limiterKey = req.user.role === 'admin' ? 'api:admin' 
    : req.user.isPremium ? 'api:premium' 
    : 'api:free';
    
  return rateLimiter.createLimiter(limiterKey)(req, res, next);
});
```

### **Input Validation & Sanitization**
```typescript
// middleware/validation.ts
export class ValidationMiddleware {
  static validateRequest(schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = schema.validate({
        body: req.body,
        query: req.query,
        params: req.params
      }, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false
      });
      
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }));
        
        return res.status(400).json({
          error: 'validation_failed',
          message: 'Request validation failed',
          details: errors
        });
      }
      
      // Replace request data with validated data
      req.body = value.body;
      req.query = value.query;
      req.params = value.params;
      
      next();
    };
  }
  
  static sanitizeHtml() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.body) {
        req.body = this.deepSanitize(req.body);
      }
      next();
    };
  }
  
  private static deepSanitize(obj: any): any {
    if (typeof obj === 'string') {
      return DOMPurify.sanitize(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.deepSanitize(item));
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.deepSanitize(value);
      }
      return sanitized;
    }
    
    return obj;
  }
}

// Validation schemas using Joi
const schemas = {
  auth: {
    login: Joi.object({
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        rememberMe: Joi.boolean().default(false),
        mfaCode: Joi.string().pattern(/^[0-9]{6}$/).optional()
      }),
      query: Joi.object().unknown(false),
      params: Joi.object().unknown(false)
    }),
    
    register: Joi.object({
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
          .min(8)
          .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
          .required()
          .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
          }),
        firstName: Joi.string().min(1).max(50).required(),
        lastName: Joi.string().min(1).max(50).required(),
        dateOfBirth: Joi.date().max('now').optional(),
        termsAccepted: Joi.boolean().valid(true).required()
      })
    })
  },
  
  nutrition: {
    createPlan: Joi.object({
      body: Joi.object({
        name: Joi.string().min(1).max(100).required(),
        description: Joi.string().max(500).optional(),
        goals: Joi.array().items(
          Joi.string().valid('weight_loss', 'muscle_gain', 'maintenance', 'performance')
        ).min(1).required(),
        duration: Joi.number().integer().min(1).max(365).required(),
        targetCalories: Joi.number().integer().min(1000).max(5000).required(),
        macroTargets: Joi.object({
          protein: Joi.number().min(0).max(100).required(),
          carbs: Joi.number().min(0).max(100).required(),
          fats: Joi.number().min(0).max(100).required()
        }).required(),
        dietaryRestrictions: Joi.array().items(
          Joi.string().valid('vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'keto', 'paleo')
        ).optional()
      })
    }),
    
    logIntake: Joi.object({
      body: Joi.object({
        mealType: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').required(),
        foods: Joi.array().items(Joi.object({
          foodId: Joi.string().required(),
          quantity: Joi.number().min(0).required(),
          unit: Joi.string().valid('grams', 'ounces', 'cups', 'pieces').default('grams')
        })).min(1).required(),
        timestamp: Joi.date().default(Date.now)
      })
    })
  }
};
```

---

## **API DOCUMENTATION TOOLS**

### **OpenAPI/Swagger Configuration**
```yaml
# swagger/openapi.yml
openapi: 3.0.3
info:
  title: Progressive Framework v5 API
  version: 1.0.0
  description: |
    Comprehensive API for Progressive Framework v5, a health and fitness platform
    with AI-powered nutrition and workout planning agents.
    
    ## Authentication
    
    This API uses JWT Bearer tokens for authentication. Include the token in the
    Authorization header:
    
    ```
    Authorization: Bearer <your_jwt_token>
    ```
    
    ## Rate Limiting
    
    API requests are rate-limited based on your subscription tier:
    
    - **Free**: 100 requests/hour
    - **Premium**: 1,000 requests/hour  
    - **Admin**: 10,000 requests/hour
    
    Rate limit headers are included in all responses.
    
    ## Webhooks
    
    The API supports webhooks for real-time event notifications. Configure
    webhook endpoints via the `/api/v1/webhooks` endpoints.
    
  contact:
    name: API Support
    url: https://progressive-framework.com/support
    email: api-support@progressive-framework.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.progressive-framework.com/v1
    description: Production server
  - url: https://staging-api.progressive-framework.com/v1
    description: Staging server
  - url: http://localhost:3000/api/v1
    description: Development server

security:
  - bearerAuth: []

paths:
  # Authentication endpoints
  /auth/login:
    $ref: './paths/auth.yml#/login'
  /auth/register:
    $ref: './paths/auth.yml#/register'
  /auth/refresh:
    $ref: './paths/auth.yml#/refresh'
  /auth/logout:
    $ref: './paths/auth.yml#/logout'
  
  # User management
  /users:
    $ref: './paths/users.yml#/users'
  /users/{userId}:
    $ref: './paths/users.yml#/userById'
  /users/me:
    $ref: './paths/users.yml#/currentUser'
  /users/me/profile:
    $ref: './paths/users.yml#/updateProfile'
  
  # Agent endpoints
  /agents/mca/coordinate:
    $ref: './paths/agents.yml#/mcaCoordinate'
  /agents/mca/status:
    $ref: './paths/agents.yml#/mcaStatus'
  /agents/npa/plans:
    $ref: './paths/agents.yml#/npaPlans'
  /agents/npa/meals:
    $ref: './paths/agents.yml#/npaMeals'
  /agents/wpa/workouts:
    $ref: './paths/agents.yml#/wpaWorkouts'
  /agents/wpa/exercises:
    $ref: './paths/agents.yml#/wpaExercises'
  
  # Progress tracking
  /progress/nutrition:
    $ref: './paths/progress.yml#/nutritionProgress'
  /progress/workouts:
    $ref: './paths/progress.yml#/workoutProgress'
  
  # Webhooks
  /webhooks:
    $ref: './paths/webhooks.yml#/webhooks'
  /webhooks/{webhookId}:
    $ref: './paths/webhooks.yml#/webhookById'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      
  schemas:
    # Common schemas
    User:
      $ref: './schemas/user.yml#/User'
    Error:
      $ref: './schemas/common.yml#/Error'
    Pagination:
      $ref: './schemas/common.yml#/Pagination'
    
    # Nutrition schemas
    NutritionPlan:
      $ref: './schemas/nutrition.yml#/NutritionPlan'
    Meal:
      $ref: './schemas/nutrition.yml#/Meal'
    Food:
      $ref: './schemas/nutrition.yml#/Food'
    
    # Workout schemas
    WorkoutPlan:
      $ref: './schemas/workout.yml#/WorkoutPlan'
    Workout:
      $ref: './schemas/workout.yml#/Workout'
    Exercise:
      $ref: './schemas/workout.yml#/Exercise'
    
    # Agent schemas
    CoordinationStatus:
      $ref: './schemas/agents.yml#/CoordinationStatus'
    
    # Webhook schemas
    WebhookSubscription:
      $ref: './schemas/webhooks.yml#/WebhookSubscription'
    WebhookDelivery:
      $ref: './schemas/webhooks.yml#/WebhookDelivery'

  responses:
    BadRequest:
      description: Bad request - invalid input
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Unauthorized:
      description: Unauthorized - invalid or missing token
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Forbidden:
      description: Forbidden - insufficient permissions
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    TooManyRequests:
      description: Rate limit exceeded
      headers:
        X-RateLimit-Limit:
          schema:
            type: integer
          description: Request limit per time window
        X-RateLimit-Remaining:
          schema:
            type: integer
          description: Remaining requests in current window
        X-RateLimit-Reset:
          schema:
            type: integer
          description: Time when rate limit resets (Unix timestamp)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
            
tags:
  - name: Authentication
    description: User authentication and authorization
  - name: Users
    description: User management and profiles
  - name: Agents
    description: AI agent coordination and planning
  - name: Nutrition
    description: Nutrition planning and tracking
  - name: Workouts
    description: Workout planning and tracking
  - name: Progress
    description: Progress tracking and analytics
  - name: Webhooks
    description: Webhook subscriptions and delivery
  - name: Integrations
    description: Third-party service integrations
  - name: Payments
    description: Subscription and payment management
```

### **GraphQL Documentation**
```typescript
// graphql/documentation.ts
export const graphqlDocumentation = {
  description: `
    # Progressive Framework v5 GraphQL API
    
    This GraphQL API provides a flexible interface for accessing and manipulating
    data in the Progressive Framework v5 health and fitness platform.
    
    ## Features
    
    - **Strongly Typed**: All queries and mutations are strongly typed
    - **Real-time Subscriptions**: Subscribe to real-time updates
    - **Efficient Data Fetching**: Request only the data you need
    - **Introspection**: Full schema introspection support
    
    ## Authentication
    
    Include JWT token in the Authorization header:
    \`Authorization: Bearer <token>\`
    
    ## Rate Limiting
    
    GraphQL queries are analyzed for complexity and depth to prevent abuse.
    Maximum query complexity: 1000
    Maximum query depth: 10
    
    ## Examples
    
    ### Get User Profile with Plans
    \`\`\`graphql
    query GetUserProfile {
      me {
        id
        firstName
        lastName
        email
        nutritionPlans(status: ACTIVE) {
          id
          name
          targetCalories
          progress {
            adherenceRate
          }
        }
        workoutPlans(status: ACTIVE) {
          id
          name
          type
          progress {
            completionRate
          }
        }
      }
    }
    \`\`\`
    
    ### Create Nutrition Plan
    \`\`\`graphql
    mutation CreateNutritionPlan($input: CreateNutritionPlanInput!) {
      createNutritionPlan(input: $input) {
        id
        name
        targetCalories
        macroTargets {
          protein
          carbs
          fats
        }
        status
      }
    }
    \`\`\`
    
    ### Subscribe to Progress Updates
    \`\`\`graphql
    subscription ProgressUpdates($userId: ID!) {
      progressUpdated(userId: $userId) {
        type
        data
        timestamp
      }
    }
    \`\`\`
  `,
  
  examples: {
    queries: {
      getUserProfile: `
        query GetUserProfile {
          me {
            id
            firstName
            lastName
            email
            height
            weight
            activityLevel
            goals
            nutritionPlans(status: ACTIVE) {
              id
              name
              description
              targetCalories
              macroTargets {
                protein
                carbs
                fats
              }
              meals {
                id
                name
                type
                calories
                macros {
                  protein
                  carbs
                  fats
                }
              }
              progress {
                adherenceRate
                averageDailyCalories
              }
            }
            workoutPlans(status: ACTIVE) {
              id
              name
              type
              difficulty
              frequency
              workouts {
                id
                name
                estimatedDuration
                exercises {
                  exercise {
                    name
                    muscleGroups
                  }
                  sets
                  reps
                  weight
                }
              }
              progress {
                completionRate
                averageWorkoutsPerWeek
              }
            }
          }
        }
      `,
      
      searchFoods: `
        query SearchFoods($query: String!, $limit: Int = 10) {
          mealSuggestions(
            mealType: LUNCH,
            calories: 500,
            prepTime: 30
          ) {
            id
            name
            description
            calories
            macros {
              protein
              carbs
              fats
            }
            prepTime
            ingredients
          }
        }
      `,
      
      getWorkoutProgress: `
        query GetWorkoutProgress($period: Period = WEEK) {
          workoutProgress(period: $period) {
            date
            targetWorkouts
            completedWorkouts
            totalDuration
            caloriesBurned
            exerciseCount
            adherenceScore
          }
        }
      `
    },
    
    mutations: {
      createNutritionPlan: `
        mutation CreateNutritionPlan($input: CreateNutritionPlanInput!) {
          createNutritionPlan(input: $input) {
            id
            name
            description
            goals
            duration
            targetCalories
            macroTargets {
              protein
              carbs
              fats
            }
            dietaryRestrictions
            status
            createdAt
          }
        }
      `,
      
      logWorkout: `
        mutation LogWorkout($input: WorkoutLogInput!) {
          logWorkout(input: $input) {
            id
            workoutId
            userId
            duration
            caloriesBurned
            exercises {
              exerciseId
              sets {
                reps
                weight
                duration
              }
            }
            completedAt
          }
        }
      `,
      
      requestCoordination: `
        mutation RequestCoordination($input: CoordinationInput!) {
          requestCoordination(input: $input) {
            id
            task
            agents
            status
            priority
            estimatedCompletion
            context
          }
        }
      `
    },
    
    subscriptions: {
      progressUpdated: `
        subscription ProgressUpdates($userId: ID!) {
          progressUpdated(userId: $userId) {
            type
            userId
            data
            timestamp
          }
        }
      `,
      
      coordinationStatus: `
        subscription CoordinationUpdates($coordinationId: ID!) {
          coordinationStatusChanged(coordinationId: $coordinationId) {
            id
            status
            result
            completedAt
            agents
          }
        }
      `,
      
      notifications: `
        subscription UserNotifications($userId: ID!) {
          notificationReceived(userId: $userId) {
            id
            type
            title
            message
            data
            createdAt
            read
          }
        }
      `
    }
  }
};
```

---

## **ERROR HANDLING & MONITORING**

### **Standardized Error Responses**
```typescript
// utils/error-handler.ts
export class APIError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;
  
  constructor(
    message: string, 
    statusCode: number = 500, 
    code: string = 'internal_error',
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 400, 'validation_error', details);
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'authentication_error');
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'authorization_error');
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'not_found');
  }
}

export class ConflictError extends APIError {
  constructor(message: string) {
    super(message, 409, 'conflict');
  }
}

export class RateLimitError extends APIError {
  constructor(retryAfter: number) {
    super('Rate limit exceeded', 429, 'rate_limit_exceeded', { retryAfter });
  }
}

export class ErrorHandler {
  static handle(error: Error, req: Request, res: Response, next: NextFunction) {
    // Log error
    logger.error('API Error:', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id,
      timestamp: new Date().toISOString()
    });
    
    // Handle different error types
    if (error instanceof APIError) {
      return res.status(error.statusCode).json({
        error: error.code,
        message: error.message,
        details: error.details,
        timestamp: new Date().toISOString(),
        path: req.path
      });
    }
    
    if (error instanceof SyntaxError && 'body' in error) {
      return res.status(400).json({
        error: 'invalid_json',
        message: 'Invalid JSON in request body',
        timestamp: new Date().toISOString(),
        path: req.path
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'database_validation_error',
        message: 'Database validation failed',
        details: error.errors?.map((e: any) => ({
          field: e.path,
          message: e.message
        })),
        timestamp: new Date().toISOString(),
        path: req.path
      });
    }
    
    // Default server error
    res.status(500).json({
      error: 'internal_server_error',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      path: req.path,
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.message,
        stack: error.stack 
      })
    });
  }
  
  static async notFound(req: Request, res: Response) {
    res.status(404).json({
      error: 'endpoint_not_found',
      message: `Endpoint ${req.method} ${req.path} not found`,
      timestamp: new Date().toISOString(),
      path: req.path
    });
  }
}
```

### **API Monitoring & Analytics**
```typescript
// middleware/monitoring.ts
export class MonitoringMiddleware {
  private metrics: PrometheusRegister;
  private analytics: AnalyticsService;
  
  constructor() {
    this.setupMetrics();
    this.analytics = new AnalyticsService();
  }
  
  private setupMetrics() {
    // HTTP request duration histogram
    const httpDuration = new prometheus.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code', 'user_type'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
    });
    
    // HTTP request counter
    const httpRequests = new prometheus.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code', 'user_type']
    });
    
    // Active connections gauge
    const activeConnections = new prometheus.Gauge({
      name: 'http_active_connections',
      help: 'Number of active HTTP connections'
    });
    
    // Agent coordination metrics
    const agentCoordinations = new prometheus.Counter({
      name: 'agent_coordinations_total',
      help: 'Total number of agent coordinations',
      labelNames: ['task', 'status', 'agents']
    });
    
    // Database query metrics
    const dbQueries = new prometheus.Histogram({
      name: 'database_query_duration_seconds',
      help: 'Duration of database queries in seconds',
      labelNames: ['operation', 'table', 'status'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
    });
    
    this.metrics = prometheus.register;
    this.metrics.registerMetric(httpDuration);
    this.metrics.registerMetric(httpRequests);
    this.metrics.registerMetric(activeConnections);
    this.metrics.registerMetric(agentCoordinations);
    this.metrics.registerMetric(dbQueries);
  }
  
  collectMetrics() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      
      // Increment active connections
      const activeConnections = this.metrics.getSingleMetric('http_active_connections') as prometheus.Gauge;
      activeConnections.inc();
      
      // Track request
      res.on('finish', () => {
        const duration = (Date.now() - startTime) / 1000;
        const route = req.route?.path || req.path;
        const userType = req.user?.role || 'anonymous';
        
        // Record metrics
        const httpDuration = this.metrics.getSingleMetric('http_request_duration_seconds') as prometheus.Histogram;
        const httpRequests = this.metrics.getSingleMetric('http_requests_total') as prometheus.Counter;
        
        httpDuration.observe(
          { method: req.method, route, status_code: res.statusCode.toString(), user_type: userType },
          duration
        );
        
        httpRequests.inc({
          method: req.method, 
          route, 
          status_code: res.statusCode.toString(), 
          user_type: userType
        });
        
        // Decrement active connections
        activeConnections.dec();
        
        // Log slow requests
        if (duration > 2) {
          logger.warn('Slow API request', {
            method: req.method,
            url: req.url,
            duration,
            statusCode: res.statusCode,
            userAgent: req.get('User-Agent'),
            userId: req.user?.id
          });
        }
      });
      
      next();
    };
  }
  
  trackAnalytics() {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Track API usage analytics
      res.on('finish', () => {
        if (req.user) {
          this.analytics.track({
            event: 'api_request',
            userId: req.user.id,
            properties: {
              endpoint: req.path,
              method: req.method,
              statusCode: res.statusCode,
              userAgent: req.get('User-Agent'),
              timestamp: new Date().toISOString()
            }
          });
        }
      });
      
      next();
    };
  }
  
  healthCheck() {
    return async (req: Request, res: Response) => {
      const startTime = Date.now();
      
      try {
        // Check database connectivity
        await Promise.race([
          this.checkDatabase(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database timeout')), 5000)
          )
        ]);
        
        // Check Redis connectivity
        await Promise.race([
          this.checkRedis(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Redis timeout')), 5000)
          )
        ]);
        
        // Check external services
        const externalServices = await this.checkExternalServices();
        
        const responseTime = Date.now() - startTime;
        
        res.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          responseTime,
          services: {
            database: 'healthy',
            redis: 'healthy',
            ...externalServices
          },
          version: process.env.API_VERSION || '1.0.0',
          environment: process.env.NODE_ENV
        });
        
      } catch (error) {
        res.status(503).json({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error.message,
          version: process.env.API_VERSION || '1.0.0',
          environment: process.env.NODE_ENV
        });
      }
    };
  }
  
  private async checkDatabase(): Promise<void> {
    await sequelize.authenticate();
  }
  
  private async checkRedis(): Promise<void> {
    await redis.ping();
  }
  
  private async checkExternalServices(): Promise<{ [key: string]: string }> {
    const services = {
      stripe: 'unknown',
      sendgrid: 'unknown',
      aws: 'unknown'
    };
    
    // Check Stripe
    try {
      await stripe.customers.list({ limit: 1 });
      services.stripe = 'healthy';
    } catch (error) {
      services.stripe = 'unhealthy';
    }
    
    // Check SendGrid
    try {
      await sgMail.send({
        to: 'test@progressive-framework.com',
        from: 'noreply@progressive-framework.com',
        subject: 'Health Check',
        text: 'Health check email'
      });
      services.sendgrid = 'healthy';
    } catch (error) {
      services.sendgrid = 'unhealthy';
    }
    
    return services;
  }
}
```

---

## **TESTING & QUALITY ASSURANCE**

### **API Testing Framework**
```typescript
// tests/integration/api.test.ts
describe('Progressive Framework v5 API Integration Tests', () => {
  let testUser: any;
  let authToken: string;
  let testServer: any;
  
  beforeAll(async () => {
    testServer = await createTestServer();
    testUser = await createTestUser();
    authToken = await getAuthToken(testUser);
  });
  
  afterAll(async () => {
    await cleanupTestData();
    await testServer.close();
  });
  
  describe('Authentication Endpoints', () => {
    describe('POST /api/v1/auth/login', () => {
      test('should login with valid credentials', async () => {
        const response = await request(testServer)
          .post('/api/v1/auth/login')
          .send({
            email: testUser.email,
            password: 'TestPassword123!'
          })
          .expect(200);
        
        expect(response.body).toMatchObject({
          access_token: expect.any(String),
          refresh_token: expect.any(String),
          token_type: 'Bearer',
          expires_in: expect.any(Number),
          user: {
            id: testUser.id,
            email: testUser.email,
            firstName: testUser.firstName,
            lastName: testUser.lastName
          }
        });
      });
      
      test('should reject invalid credentials', async () => {
        const response = await request(testServer)
          .post('/api/v1/auth/login')
          .send({
            email: testUser.email,
            password: 'wrongpassword'
          })
          .expect(401);
        
        expect(response.body).toMatchObject({
          error: 'authentication_failed',
          message: expect.any(String)
        });
      });
      
      test('should enforce rate limiting', async () => {
        const promises = Array(10).fill(null).map(() =>
          request(testServer)
            .post('/api/v1/auth/login')
            .send({
              email: testUser.email,
              password: 'wrongpassword'
            })
        );
        
        const responses = await Promise.all(promises);
        const rateLimitedResponses = responses.filter(r => r.status === 429);
        
        expect(rateLimitedResponses.length).toBeGreaterThan(0);
      });
    });
    
    describe('POST /api/v1/auth/register', () => {
      test('should register new user with valid data', async () => {
        const userData = {
          email: 'newuser@test.com',
          password: 'NewPassword123!',
          firstName: 'New',
          lastName: 'User',
          termsAccepted: true
        };
        
        const response = await request(testServer)
          .post('/api/v1/auth/register')
          .send(userData)
          .expect(201);
        
        expect(response.body).toMatchObject({
          access_token: expect.any(String),
          user: {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName
          }
        });
      });
      
      test('should reject duplicate email', async () => {
        const userData = {
          email: testUser.email,
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User',
          termsAccepted: true
        };
        
        await request(testServer)
          .post('/api/v1/auth/register')
          .send(userData)
          .expect(409);
      });
      
      test('should validate password strength', async () => {
        const userData = {
          email: 'weak@test.com',
          password: 'weak',
          firstName: 'Test',
          lastName: 'User',
          termsAccepted: true
        };
        
        const response = await request(testServer)
          .post('/api/v1/auth/register')
          .send(userData)
          .expect(400);
        
        expect(response.body.details).toContainEqual(
          expect.objectContaining({
            field: 'body.password'
          })
        );
      });
    });
  });
  
  describe('Nutrition Planning Endpoints', () => {
    let testNutritionPlan: any;
    
    beforeEach(async () => {
      testNutritionPlan = await createTestNutritionPlan(testUser.id);
    });
    
    describe('GET /api/v1/agents/npa/plans', () => {
      test('should return user nutrition plans', async () => {
        const response = await request(testServer)
          .get('/api/v1/agents/npa/plans')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toMatchObject({
          id: expect.any(String),
          userId: testUser.id,
          name: expect.any(String),
          goals: expect.any(Array),
          targetCalories: expect.any(Number),
          macroTargets: {
            protein: expect.any(Number),
            carbs: expect.any(Number),
            fats: expect.any(Number)
          }
        });
      });
      
      test('should filter plans by status', async () => {
        await updateNutritionPlan(testNutritionPlan.id, { status: 'archived' });
        
        const activeResponse = await request(testServer)
          .get('/api/v1/agents/npa/plans?status=active')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        const archivedResponse = await request(testServer)
          .get('/api/v1/agents/npa/plans?status=archived')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(activeResponse.body.length).toBe(0);
        expect(archivedResponse.body.length).toBe(1);
      });
    });
    
    describe('POST /api/v1/agents/npa/plans', () => {
      test('should create new nutrition plan', async () => {
        const planData = {
          name: 'Test Plan',
          goals: ['weight_loss'],
          duration: 30,
          targetCalories: 2000,
          macroTargets: {
            protein: 30,
            carbs: 40,
            fats: 30
          },
          dietaryRestrictions: ['vegetarian']
        };
        
        const response = await request(testServer)
          .post('/api/v1/agents/npa/plans')
          .set('Authorization', `Bearer ${authToken}`)
          .send(planData)
          .expect(201);
        
        expect(response.body).toMatchObject({
          ...planData,
          id: expect.any(String),
          userId: testUser.id,
          status: 'draft'
        });
      });
      
      test('should validate macro targets sum to 100', async () => {
        const planData = {
          name: 'Invalid Plan',
          goals: ['weight_loss'],
          duration: 30,
          targetCalories: 2000,
          macroTargets: {
            protein: 50,
            carbs: 50,
            fats: 50 // Total = 150%
          }
        };
        
        const response = await request(testServer)
          .post('/api/v1/agents/npa/plans')
          .set('Authorization', `Bearer ${authToken}`)
          .send(planData)
          .expect(400);
        
        expect(response.body.details).toContainEqual(
          expect.objectContaining({
            field: 'macroTargets',
            message: expect.stringContaining('sum to 100')
          })
        );
      });
    });
  });
  
  describe('Agent Coordination Endpoints', () => {
    describe('POST /api/v1/agents/mca/coordinate', () => {
      test('should request agent coordination', async () => {
        const coordinationRequest = {
          task: 'create_plan',
          agents: ['npa', 'wpa'],
          priority: 'medium',
          context: {
            userId: testUser.id,
            goals: ['weight_loss', 'muscle_gain']
          }
        };
        
        const response = await request(testServer)
          .post('/api/v1/agents/mca/coordinate')
          .set('Authorization', `Bearer ${authToken}`)
          .send(coordinationRequest)
          .expect(200);
        
        expect(response.body).toMatchObject({
          coordinationId: expect.any(String),
          status: 'initiated',
          estimatedCompletion: expect.any(String),
          involvedAgents: ['npa', 'wpa']
        });
      });
      
      test('should require valid agents', async () => {
        const coordinationRequest = {
          task: 'create_plan',
          agents: ['invalid_agent'],
          priority: 'medium'
        };
        
        await request(testServer)
          .post('/api/v1/agents/mca/coordinate')
          .set('Authorization', `Bearer ${authToken}`)
          .send(coordinationRequest)
          .expect(400);
      });
    });
  });
  
  describe('Rate Limiting', () => {
    test('should enforce different limits based on user role', async () => {
      // Test free user limits
      const freeUser = await createTestUser({ role: 'user', isPremium: false });
      const freeUserToken = await getAuthToken(freeUser);
      
      // Make requests up to the free limit
      const freeRequests = Array(100).fill(null).map(() =>
        request(testServer)
          .get('/api/v1/users/me')
          .set('Authorization', `Bearer ${freeUserToken}`)
      );
      
      const freeResponses = await Promise.all(freeRequests);
      expect(freeResponses.filter(r => r.status === 429).length).toBeGreaterThan(0);
      
      // Test premium user limits (should be higher)
      const premiumUser = await createTestUser({ role: 'user', isPremium: true });
      const premiumUserToken = await getAuthToken(premiumUser);
      
      const premiumRequests = Array(100).fill(null).map(() =>
        request(testServer)
          .get('/api/v1/users/me')
          .set('Authorization', `Bearer ${premiumUserToken}`)
      );
      
      const premiumResponses = await Promise.all(premiumRequests);
      expect(premiumResponses.filter(r => r.status === 200).length).toBe(100);
    });
  });
  
  describe('Error Handling', () => {
    test('should return consistent error format', async () => {
      const response = await request(testServer)
        .get('/api/v1/users/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
      
      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
        timestamp: expect.any(String),
        path: expect.any(String)
      });
    });
    
    test('should handle malformed JSON', async () => {
      const response = await request(testServer)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);
      
      expect(response.body).toMatchObject({
        error: 'invalid_json',
        message: expect.any(String)
      });
    });
  });
});

// Test utilities
async function createTestServer() {
  return app.listen(0); // Random port
}

async function createTestUser(overrides = {}) {
  return await User.create({
    email: `test-${Date.now()}@example.com`,
    password: await bcrypt.hash('TestPassword123!', 10),
    firstName: 'Test',
    lastName: 'User',
    isActive: true,
    role: 'user',
    ...overrides
  });
}

async function getAuthToken(user: any): Promise<string> {
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
  return token;
}

async function createTestNutritionPlan(userId: string) {
  return await NutritionPlan.create({
    userId,
    name: 'Test Nutrition Plan',
    goals: ['weight_loss'],
    duration: 30,
    targetCalories: 2000,
    macroTargets: {
      protein: 30,
      carbs: 40,
      fats: 30
    },
    status: 'active'
  });
}
```

---

## **DEPLOYMENT & VERSIONING**

### **API Versioning Strategy**
```typescript
// versioning/strategy.ts
export class APIVersioningStrategy {
  private versions: Map<string, APIVersion> = new Map();
  
  constructor() {
    this.setupVersions();
  }
  
  private setupVersions() {
    // Version 1.0 - Initial release
    this.versions.set('v1', {
      version: '1.0',
      status: 'stable',
      supportEndsAt: new Date('2026-01-01'),
      routes: this.getV1Routes(),
      middleware: [
        this.rateLimiting('v1'),
        this.authentication,
        this.validation('v1')
      ]
    });
    
    // Version 1.1 - Minor updates
    this.versions.set('v1.1', {
      version: '1.1',
      status: 'stable',
      supportEndsAt: new Date('2026-06-01'),
      routes: this.getV1_1Routes(),
      middleware: [
        this.rateLimiting('v1.1'),
        this.authentication,
        this.validation('v1.1')
      ]
    });
    
    // Version 2.0 - Major revision (beta)
    this.versions.set('v2', {
      version: '2.0',
      status: 'beta',
      supportEndsAt: new Date('2027-01-01'),
      routes: this.getV2Routes(),
      middleware: [
        this.rateLimiting('v2'),
        this.authentication,
        this.validation('v2'),
        this.betaWarning
      ]
    });
  }
  
  getVersion(versionString: string): APIVersion | null {
    return this.versions.get(versionString) || null;
  }
  
  getSupportedVersions(): string[] {
    return Array.from(this.versions.keys()).filter(version => {
      const versionInfo = this.versions.get(version)!;
      return versionInfo.supportEndsAt > new Date();
    });
  }
  
  getDeprecatedVersions(): VersionDeprecation[] {
    const deprecations: VersionDeprecation[] = [];
    const now = new Date();
    const sixMonthsFromNow = new Date(now.getTime() + (6 * 30 * 24 * 60 * 60 * 1000));
    
    this.versions.forEach((versionInfo, versionKey) => {
      if (versionInfo.supportEndsAt <= sixMonthsFromNow) {
        deprecations.push({
          version: versionKey,
          deprecatedAt: new Date(),
          supportEndsAt: versionInfo.supportEndsAt,
          migrationGuide: `/docs/migration/${versionKey}`,
          replacementVersion: this.getLatestVersion()
        });
      }
    });
    
    return deprecations;
  }
  
  private getLatestVersion(): string {
    const versions = Array.from(this.versions.keys());
    versions.sort((a, b) => {
      const aVersion = this.versions.get(a)!;
      const bVersion = this.versions.get(b)!;
      return aVersion.version.localeCompare(bVersion.version, undefined, { numeric: true });
    });
    
    return versions[versions.length - 1];
  }
}

// Version detection middleware
export function versionDetection() {
  return (req: Request, res: Response, next: NextFunction) => {
    let version = 'v1'; // default
    
    // Check URL path
    const pathMatch = req.path.match(/^\/api\/(v[\d\.]+)\//);
    if (pathMatch) {
      version = pathMatch[1];
    }
    
    // Check Accept header
    const acceptHeader = req.get('Accept');
    if (acceptHeader) {
      const versionMatch = acceptHeader.match(/version=(\d+(?:\.\d+)?)/);
      if (versionMatch) {
        version = `v${versionMatch[1]}`;
      }
    }
    
    // Check custom header
    const customVersion = req.get('API-Version');
    if (customVersion) {
      version = customVersion.startsWith('v') ? customVersion : `v${customVersion}`;
    }
    
    req.apiVersion = version;
    next();
  };
}

// Migration support
export class MigrationSupport {
  private migrations: Map<string, Migration[]> = new Map();
  
  constructor() {
    this.setupMigrations();
  }
  
  private setupMigrations() {
    // v1 to v1.1 migrations
    this.migrations.set('v1->v1.1', [
      {
        type: 'request_transform',
        description: 'Convert old date format to ISO 8601',
        transform: (data: any) => {
          if (data.dateOfBirth && typeof data.dateOfBirth === 'string') {
            // Convert MM/DD/YYYY to YYYY-MM-DD
            const parts = data.dateOfBirth.split('/');
            if (parts.length === 3) {
              data.dateOfBirth = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
            }
          }
          return data;
        }
      }
    ]);
    
    // v1.1 to v2 migrations
    this.migrations.set('v1.1->v2', [
      {
        type: 'request_transform',
        description: 'Update nutrition plan structure',
        transform: (data: any) => {
          if (data.nutritionPlan) {
            // Convert flat macro targets to nested structure
            if (typeof data.nutritionPlan.proteinTarget === 'number') {
              data.nutritionPlan.macroTargets = {
                protein: data.nutritionPlan.proteinTarget,
                carbs: data.nutritionPlan.carbTarget,
                fats: data.nutritionPlan.fatTarget
              };
              
              delete data.nutritionPlan.proteinTarget;
              delete data.nutritionPlan.carbTarget;
              delete data.nutritionPlan.fatTarget;
            }
          }
          return data;
        }
      },
      
      {
        type: 'response_transform',
        description: 'Add new fields to user response',
        transform: (data: any) => {
          if (data.user) {
            data.user.preferences = data.user.preferences || {
              timezone: 'UTC',
              units: 'metric',
              notifications: { email: true, push: false }
            };
          }
          return data;
        }
      }
    ]);
  }
  
  getMigrationPath(fromVersion: string, toVersion: string): Migration[] {
    const migrationKey = `${fromVersion}->${toVersion}`;
    return this.migrations.get(migrationKey) || [];
  }
  
  applyRequestMigrations(data: any, fromVersion: string, toVersion: string): any {
    const migrations = this.getMigrationPath(fromVersion, toVersion);
    
    return migrations
      .filter(m => m.type === 'request_transform')
      .reduce((acc, migration) => migration.transform(acc), data);
  }
  
  applyResponseMigrations(data: any, fromVersion: string, toVersion: string): any {
    const migrations = this.getMigrationPath(fromVersion, toVersion);
    
    return migrations
      .filter(m => m.type === 'response_transform')
      .reduce((acc, migration) => migration.transform(acc), data);
  }
}
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[AI Agent Framework](../03-Agents/AI-Agent-Framework.md)** - Agent architecture and communication
- **[Security Overview](../04-Security/Security-Overview.md)** - Authentication and authorization
- **[Data Models & Management](../02-Data/Data-Models-Management.md)** - Data structures and schemas

### **Follow-up Documents**
- **[Performance Monitoring & Optimization](../08-Performance/Performance-Monitoring-Optimization.md)** - API performance optimization
- **[Deployment & Operations](../05-DevOps/Deployment-Operations.md)** - API deployment strategies

### **Integration Context**
- **[Network Architecture & Security](../06-Infrastructure/Network-Architecture-Security.md)** - Network security for APIs
- **[System Administration Guide](../05-DevOps/System-Administration-Guide.md)** - API maintenance and operations

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | API Team | Complete API documentation and integration framework |
| 4.x | 2025-08-xx | Development Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: API Team  
**Last Validated**: 2025-09-02