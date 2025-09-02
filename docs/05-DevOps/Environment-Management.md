---
file: docs/05-DevOps/Environment-Management.md
directory: docs/05-DevOps/
priority: HIGH
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# Environment Management - Progressive-Framework-v5

**File Path**: `docs/05-DevOps/Environment-Management.md`  
**Directory**: `docs/05-DevOps/`  
**Priority**: HIGH  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive environment management strategy for Progressive-Framework-v5, covering development, staging, pre-production, and production environments. This guide ensures consistent, secure, and scalable environment configurations for both enterprise core systems and integrated context agents.

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🚀 **[Deployment Guide](Deployment-Guide.md)** - *Deployment procedures*
- 🔄 **[CI/CD Pipeline](CI-CD-Pipeline.md)** - *Automated deployment processes*
- 🛡️ **[Security Overview](../04-Security/Security-Overview.md)** - *Security requirements*

---

## **ENVIRONMENT ARCHITECTURE**

### **Environment Hierarchy**
```
Progressive-Framework-v5 Environment Strategy:

┌─────────────────────────────────────────────────────────────────────┐
│                          PRODUCTION                                 │
│  • Live user traffic                                                │
│  • High availability (99.9%+ uptime)                               │
│  • Blue-green deployments                                          │
│  • Full monitoring & alerting                                      │
│  • All context agents active (MCA, NPA, WPA)                       │
└─────────────────────────────────────────────────────────────────────┘
                                    ▲
                            Manual Approval Required
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                       PRE-PRODUCTION                                │
│  • Production-like environment                                     │
│  • Performance & load testing                                      │
│  • Final integration validation                                    │
│  • Context agent stress testing                                    │
└─────────────────────────────────────────────────────────────────────┘
                                    ▲
                            Automated Promotion
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                           STAGING                                   │
│  • Integration testing                                              │
│  • Agent coordination testing                                      │
│  • API contract validation                                         │
│  • UAT environment                                                 │
└─────────────────────────────────────────────────────────────────────┘
                                    ▲
                            Automated Deployment
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT                                  │
│  • Feature development                                              │
│  • Unit & integration testing                                      │
│  • Agent development & debugging                                   │
│  • Rapid iteration cycles                                          │
└─────────────────────────────────────────────────────────────────────┘
```

### **Environment Characteristics**

| Environment | Purpose | Stability | Data | Monitoring | Agents |
|-------------|---------|-----------|------|------------|---------|
| **Development** | Feature dev | Low | Synthetic | Basic | Dev modes |
| **Staging** | Integration test | Medium | Anonymized | Enhanced | Full testing |
| **Pre-Production** | Performance test | High | Production-like | Full | Stress testing |
| **Production** | Live service | Critical | Live data | 24/7 alerts | Production |

---

## **CONFIGURATION MANAGEMENT**

### **Environment Variables Strategy**

#### **Configuration Hierarchy**
```bash
Configuration Priority (highest to lowest):
1. Runtime environment variables (CI/CD injected)
2. Environment-specific .env files
3. Default configuration files
4. Application defaults
```

#### **Base Configuration Structure**
```bash
config/
├── default.json                 # Default settings
├── development.json             # Development overrides
├── staging.json                 # Staging overrides  
├── preproduction.json           # Pre-prod overrides
├── production.json              # Production overrides
├── agents/
│   ├── default.json             # Default agent settings
│   ├── development.json         # Dev agent settings
│   ├── staging.json             # Staging agent settings
│   ├── preproduction.json       # Pre-prod agent settings
│   └── production.json          # Production agent settings
└── secrets/
    ├── development.env          # Dev secrets (encrypted)
    ├── staging.env              # Staging secrets
    ├── preproduction.env        # Pre-prod secrets
    └── production.env           # Production secrets
```

### **Development Environment Configuration**
```json
// config/development.json
{
  "environment": "development",
  "server": {
    "port": 3000,
    "host": "localhost",
    "cors": {
      "enabled": true,
      "origins": ["http://localhost:3000", "http://localhost:8080"]
    }
  },
  "database": {
    "postgres": {
      "host": "localhost",
      "port": 5432,
      "database": "progressive_framework_v5_dev",
      "username": "dev_user",
      "pool": {
        "min": 2,
        "max": 10
      },
      "logging": true
    },
    "redis": {
      "host": "localhost",
      "port": 6379,
      "db": 0,
      "ttl": 3600
    },
    "mongodb": {
      "host": "localhost",
      "port": 27017,
      "database": "progressive_framework_v5_dev",
      "username": "dev_user"
    }
  },
  "agents": {
    "enabled": true,
    "mode": "development",
    "mca": {
      "enabled": true,
      "debug": true,
      "timeout": 60000,
      "resources": {
        "memory": "256MB",
        "cpu": "0.2"
      }
    },
    "npa": {
      "enabled": true,
      "debug": true,
      "timeout": 30000,
      "mockData": true
    },
    "wpa": {
      "enabled": true,
      "debug": true,
      "timeout": 30000,
      "mockData": true
    }
  },
  "logging": {
    "level": "debug",
    "console": true,
    "file": false
  },
  "security": {
    "jwtSecret": "dev-only-secret-key",
    "encryption": "basic",
    "rateLimit": false
  },
  "features": {
    "hotReload": true,
    "debugMode": true,
    "testEndpoints": true
  }
}
```

### **Staging Environment Configuration**
```json
// config/staging.json
{
  "environment": "staging",
  "server": {
    "port": 3000,
    "host": "0.0.0.0",
    "cors": {
      "enabled": true,
      "origins": ["https://staging.your-domain.com"]
    }
  },
  "database": {
    "postgres": {
      "host": "staging-postgres.internal",
      "port": 5432,
      "database": "progressive_framework_v5_staging",
      "username": "staging_user",
      "pool": {
        "min": 5,
        "max": 25
      },
      "logging": false,
      "ssl": true
    },
    "redis": {
      "host": "staging-redis.internal",
      "port": 6379,
      "db": 0,
      "ttl": 1800,
      "cluster": false
    },
    "mongodb": {
      "host": "staging-mongodb.internal",
      "port": 27017,
      "database": "progressive_framework_v5_staging",
      "username": "staging_user",
      "ssl": true
    }
  },
  "agents": {
    "enabled": true,
    "mode": "staging",
    "mca": {
      "enabled": true,
      "debug": false,
      "timeout": 45000,
      "resources": {
        "memory": "512MB",
        "cpu": "0.5"
      }
    },
    "npa": {
      "enabled": true,
      "debug": false,
      "timeout": 30000,
      "mockData": false
    },
    "wpa": {
      "enabled": true,
      "debug": false,
      "timeout": 30000,
      "mockData": false
    }
  },
  "logging": {
    "level": "info",
    "console": false,
    "file": true,
    "format": "json"
  },
  "security": {
    "encryption": "aes-256-gcm",
    "rateLimit": {
      "enabled": true,
      "requests": 100,
      "window": "15m"
    }
  },
  "monitoring": {
    "prometheus": true,
    "healthChecks": true,
    "metricsInterval": 30000
  },
  "features": {
    "hotReload": false,
    "debugMode": false,
    "testEndpoints": true
  }
}
```

### **Production Environment Configuration**
```json
// config/production.json
{
  "environment": "production",
  "server": {
    "port": 3000,
    "host": "0.0.0.0",
    "cors": {
      "enabled": true,
      "origins": ["https://your-domain.com"]
    },
    "timeout": 30000,
    "keepAlive": true
  },
  "database": {
    "postgres": {
      "host": "prod-postgres-primary.internal",
      "readReplicas": [
        "prod-postgres-replica1.internal",
        "prod-postgres-replica2.internal"
      ],
      "port": 5432,
      "database": "progressive_framework_v5",
      "username": "prod_user",
      "pool": {
        "min": 10,
        "max": 50
      },
      "logging": false,
      "ssl": {
        "required": true,
        "rejectUnauthorized": true
      },
      "connectionTimeout": 10000,
      "idleTimeout": 30000
    },
    "redis": {
      "cluster": [
        "prod-redis-1.internal:6379",
        "prod-redis-2.internal:6379",
        "prod-redis-3.internal:6379"
      ],
      "ttl": 3600,
      "maxRetries": 3,
      "retryDelay": 100
    },
    "mongodb": {
      "cluster": "mongodb+srv://prod-mongodb.internal",
      "database": "progressive_framework_v5",
      "username": "prod_user",
      "replicaSet": "rs0",
      "ssl": true,
      "authSource": "admin"
    }
  },
  "agents": {
    "enabled": true,
    "mode": "production",
    "loadBalancing": true,
    "mca": {
      "enabled": true,
      "instances": 3,
      "timeout": 30000,
      "resources": {
        "memory": "1GB",
        "cpu": "1"
      },
      "scaling": {
        "minReplicas": 2,
        "maxReplicas": 10,
        "targetCPU": 70
      }
    },
    "npa": {
      "enabled": true,
      "instances": 2,
      "timeout": 25000,
      "resources": {
        "memory": "512MB",
        "cpu": "0.5"
      },
      "scaling": {
        "minReplicas": 1,
        "maxReplicas": 5,
        "targetCPU": 80
      }
    },
    "wpa": {
      "enabled": true,
      "instances": 2,
      "timeout": 25000,
      "resources": {
        "memory": "512MB",
        "cpu": "0.5"
      },
      "scaling": {
        "minReplicas": 1,
        "maxReplicas": 5,
        "targetCPU": 80
      }
    }
  },
  "logging": {
    "level": "warn",
    "console": false,
    "file": true,
    "format": "json",
    "rotation": {
      "enabled": true,
      "maxSize": "100MB",
      "maxFiles": 10
    }
  },
  "security": {
    "encryption": "aes-256-gcm",
    "rateLimit": {
      "enabled": true,
      "requests": 1000,
      "window": "15m",
      "skipSuccessfulRequests": false
    },
    "helmet": {
      "enabled": true,
      "hsts": true,
      "noSniff": true,
      "xssFilter": true
    }
  },
  "monitoring": {
    "prometheus": true,
    "grafana": true,
    "healthChecks": true,
    "metricsInterval": 15000,
    "alerts": {
      "enabled": true,
      "channels": ["slack", "email", "pagerduty"]
    }
  },
  "features": {
    "hotReload": false,
    "debugMode": false,
    "testEndpoints": false,
    "maintenance": false
  },
  "performance": {
    "clustering": true,
    "compression": true,
    "caching": {
      "enabled": true,
      "redis": true,
      "memory": true
    }
  }
}
```

---

## **KUBERNETES ENVIRONMENT SETUP**

### **Namespace Strategy**
```bash
# Create dedicated namespaces for each environment
kubectl create namespace progressive-framework-dev
kubectl create namespace progressive-framework-staging  
kubectl create namespace progressive-framework-preprod
kubectl create namespace progressive-framework-prod

# Label namespaces for better organization
kubectl label namespace progressive-framework-dev environment=development
kubectl label namespace progressive-framework-staging environment=staging
kubectl label namespace progressive-framework-preprod environment=preproduction
kubectl label namespace progressive-framework-prod environment=production
```

### **Development Environment (Kubernetes)**
```yaml
# k8s/environments/development/namespace.yml
apiVersion: v1
kind: Namespace
metadata:
  name: progressive-framework-dev
  labels:
    environment: development
    team: development
    project: progressive-framework-v5

---
# k8s/environments/development/configmap.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: progressive-framework-dev
data:
  NODE_ENV: "development"
  PORT: "3000"
  LOG_LEVEL: "debug"
  AGENTS_ENABLED: "true"
  MCA_DEBUG: "true"
  NPA_DEBUG: "true"
  WPA_DEBUG: "true"

---
# k8s/environments/development/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: progressive-framework-v5-dev
  namespace: progressive-framework-dev
spec:
  replicas: 1
  selector:
    matchLabels:
      app: progressive-framework-v5
      environment: development
  template:
    metadata:
      labels:
        app: progressive-framework-v5
        environment: development
    spec:
      containers:
      - name: app
        image: progressive-framework-v5:dev
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "development"
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# Development Agent Deployments
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mca-dev
  namespace: progressive-framework-dev
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mca
      environment: development
  template:
    metadata:
      labels:
        app: mca
        environment: development
    spec:
      containers:
      - name: mca
        image: progressive-agents:dev
        env:
        - name: AGENT_TYPE
          value: "mca"
        - name: NODE_ENV
          value: "development"
        - name: DEBUG
          value: "true"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
```

### **Staging Environment (Kubernetes)**
```yaml
# k8s/environments/staging/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: progressive-framework-v5-staging
  namespace: progressive-framework-staging
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  selector:
    matchLabels:
      app: progressive-framework-v5
      environment: staging
  template:
    metadata:
      labels:
        app: progressive-framework-v5
        environment: staging
    spec:
      containers:
      - name: app
        image: progressive-framework-v5:staging
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "staging"
        envFrom:
        - configMapRef:
            name: app-config-staging
        - secretRef:
            name: app-secrets-staging
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 45
          periodSeconds: 20
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3

---
# Staging HPA (Horizontal Pod Autoscaler)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: progressive-framework-v5-staging-hpa
  namespace: progressive-framework-staging
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: progressive-framework-v5-staging
  minReplicas: 2
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### **Production Environment (Kubernetes)**
```yaml
# k8s/environments/production/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: progressive-framework-v5-production
  namespace: progressive-framework-prod
  labels:
    version: blue
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 2
  selector:
    matchLabels:
      app: progressive-framework-v5
      environment: production
      version: blue
  template:
    metadata:
      labels:
        app: progressive-framework-v5
        environment: production
        version: blue
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - progressive-framework-v5
              topologyKey: kubernetes.io/hostname
      containers:
      - name: app
        image: progressive-framework-v5:production
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: CLUSTER_MODE
          value: "true"
        envFrom:
        - configMapRef:
            name: app-config-production
        - secretRef:
            name: app-secrets-production
        resources:
          requests:
            memory: "1Gi"
            cpu: "1"
          limits:
            memory: "2Gi"
            cpu: "2"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 60
          periodSeconds: 30
          timeoutSeconds: 10
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 2
        lifecycle:
          preStop:
            exec:
              command:
              - /bin/sh
              - -c
              - "sleep 15"

---
# Production HPA with custom metrics
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: progressive-framework-v5-production-hpa
  namespace: progressive-framework-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: progressive-framework-v5-production
  minReplicas: 5
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "1000"
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

---

## **DATABASE ENVIRONMENT MANAGEMENT**

### **Database Separation Strategy**
```bash
Environment Database Isolation:

Development:
├── progressive_framework_v5_dev (PostgreSQL)
├── progressive_redis_dev (Redis DB 0)
└── progressive_mongo_dev (MongoDB)

Staging:
├── progressive_framework_v5_staging (PostgreSQL)
├── progressive_redis_staging (Redis DB 1) 
└── progressive_mongo_staging (MongoDB)

Pre-Production:
├── progressive_framework_v5_preprod (PostgreSQL)
├── progressive_redis_preprod (Redis DB 2)
└── progressive_mongo_preprod (MongoDB)

Production:
├── progressive_framework_v5 (PostgreSQL Primary + 2 Replicas)
├── progressive_redis_cluster (Redis Cluster)
└── progressive_mongo_replicaset (MongoDB Replica Set)
```

### **Data Management Policies**

#### **Development Environment Data**
- **Synthetic data only** - No real user information
- **Refreshed weekly** from anonymized production snapshots
- **Full access** for developers to modify/delete
- **No backup requirements** - Can be rebuilt from scripts

```bash
#!/bin/bash
# scripts/refresh-dev-data.sh

echo "🔄 Refreshing development environment data..."

# Drop and recreate development database
PGPASSWORD=$DEV_DB_PASSWORD dropdb -h localhost -U dev_user progressive_framework_v5_dev
PGPASSWORD=$DEV_DB_PASSWORD createdb -h localhost -U dev_user progressive_framework_v5_dev

# Import anonymized production data
zcat /backups/production/anonymized_snapshot_latest.sql.gz | \
  PGPASSWORD=$DEV_DB_PASSWORD psql -h localhost -U dev_user progressive_framework_v5_dev

# Run data anonymization scripts
npm run db:anonymize:dev

# Flush Redis dev database
redis-cli -h localhost -n 0 FLUSHDB

# Reset MongoDB dev database
mongosh --host localhost --port 27017 --eval "
  use progressive_framework_v5_dev;
  db.dropDatabase();
"

# Import dev seed data
npm run db:seed:dev

echo "✅ Development data refresh completed"
```

#### **Staging Environment Data**
- **Anonymized production data** for realistic testing
- **Refreshed monthly** or before major releases
- **Read-only for most users** - Only test admins can modify
- **7-day retention** for backups

```bash
#!/bin/bash
# scripts/refresh-staging-data.sh

echo "🔄 Refreshing staging environment data..."

# Create snapshot of current staging (rollback option)
pg_dump -h staging-postgres.internal -U staging_user \
  progressive_framework_v5_staging | gzip > \
  /backups/staging/pre-refresh-$(date +%Y%m%d).sql.gz

# Import fresh anonymized production data
zcat /backups/production/anonymized_snapshot_latest.sql.gz | \
  PGPASSWORD=$STAGING_DB_PASSWORD psql \
  -h staging-postgres.internal -U staging_user \
  progressive_framework_v5_staging

# Update staging-specific configurations
psql -h staging-postgres.internal -U staging_user \
  progressive_framework_v5_staging \
  -f scripts/sql/staging-config-updates.sql

echo "✅ Staging data refresh completed"
```

#### **Production Environment Data**
- **Live user data** - Maximum security and compliance
- **Continuous backups** with point-in-time recovery
- **Strict access controls** - Only authorized personnel
- **30-day retention** for full backups, 1-year for archives

### **Data Migration Scripts**
```bash
# Database migration management across environments

# Development: Run all migrations without approval
npm run migrate:dev

# Staging: Run migrations with validation
npm run migrate:staging --validate

# Production: Require explicit approval and rollback plan
npm run migrate:production --dry-run
npm run migrate:production --confirm --rollback-ready
```

---

## **CONTEXT AGENT ENVIRONMENT CONFIGURATION**

### **Agent Environment Scaling**
```yaml
# Agent scaling per environment

Development (1 instance each):
├── MCA: 1 instance (debug mode)
├── NPA: 1 instance (mock data)
└── WPA: 1 instance (mock data)

Staging (Load testing):
├── MCA: 2 instances
├── NPA: 2 instances  
└── WPA: 2 instances

Pre-Production (Performance testing):
├── MCA: 3 instances
├── NPA: 2 instances
└── WPA: 2 instances

Production (High availability):
├── MCA: 3-10 instances (auto-scaling)
├── NPA: 1-5 instances (auto-scaling)
└── WPA: 1-5 instances (auto-scaling)
```

### **Agent Configuration Management**
```yaml
# k8s/agents/base/configmap.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: agent-base-config
data:
  COMMUNICATION_PROTOCOL: "http"
  HEALTH_CHECK_INTERVAL: "30000"
  COORDINATOR_TIMEOUT: "45000"
  
---
# k8s/agents/overlays/development/configmap.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: agent-dev-config
data:
  DEBUG_MODE: "true"
  LOG_LEVEL: "debug"
  MOCK_DATA: "true"
  PERFORMANCE_TRACKING: "false"

---
# k8s/agents/overlays/production/configmap.yml  
apiVersion: v1
kind: ConfigMap
metadata:
  name: agent-prod-config
data:
  DEBUG_MODE: "false"
  LOG_LEVEL: "warn"
  MOCK_DATA: "false"
  PERFORMANCE_TRACKING: "true"
  METRICS_ENABLED: "true"
  ALERT_THRESHOLDS: |
    {
      "response_time_ms": 5000,
      "error_rate_percent": 1,
      "memory_usage_percent": 85
    }
```

### **Agent Service Mesh Configuration**
```yaml
# Istio service mesh configuration for agent communication

# Development: No mesh (direct communication)
# Staging: Basic mesh with monitoring
# Production: Full mesh with security, monitoring, and traffic management

apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: agent-routing-production
  namespace: progressive-framework-prod
spec:
  hosts:
  - mca-service
  - npa-service  
  - wpa-service
  http:
  - match:
    - headers:
        environment:
          exact: production
    route:
    - destination:
        host: mca-service
        subset: v1
      weight: 80
    - destination:
        host: mca-service
        subset: v2
      weight: 20
    timeout: 30s
    retries:
      attempts: 3
      perTryTimeout: 10s

---
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: agent-access-policy
  namespace: progressive-framework-prod
spec:
  selector:
    matchLabels:
      app: progressive-agents
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/progressive-framework-prod/sa/app-service-account"]
  - to:
    - operation:
        methods: ["GET", "POST"]
        paths: ["/health", "/api/v1/*"]
```

---

## **ENVIRONMENT PROMOTION PROCESS**

### **Automated Promotion Pipeline**
```yaml
# .github/workflows/environment-promotion.yml
name: Environment Promotion

on:
  workflow_run:
    workflows: ["Progressive-Framework-v5 CI"]
    types: [completed]
    branches: [develop, main]

jobs:
  promote-to-staging:
    if: github.ref == 'refs/heads/develop' && github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Staging
      run: |
        # Deploy application
        kubectl set image deployment/progressive-framework-v5-staging \
          app=$ECR_REGISTRY/progressive-framework-v5:develop-${{ github.sha }} \
          --namespace=progressive-framework-staging
        
        # Deploy agents
        kubectl set image deployment/mca-staging \
          mca=$ECR_REGISTRY/progressive-agents:develop-${{ github.sha }} \
          --namespace=progressive-framework-staging
        
        # Wait for deployment
        kubectl rollout status deployment/progressive-framework-v5-staging \
          --namespace=progressive-framework-staging --timeout=600s
    
    - name: Run Staging Tests
      run: |
        npm run test:staging:integration
        npm run test:agents:staging
    
    - name: Promote to Pre-Production (if staging tests pass)
      run: |
        if [ $? -eq 0 ]; then
          kubectl set image deployment/progressive-framework-v5-preprod \
            app=$ECR_REGISTRY/progressive-framework-v5:develop-${{ github.sha }} \
            --namespace=progressive-framework-preprod
        fi

  promote-to-production:
    if: github.ref == 'refs/heads/main' && github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    environment: production
    steps:
    - name: Manual Approval Gate
      uses: trstringer/manual-approval@v1
      with:
        secret: ${{ secrets.GITHUB_TOKEN }}
        approvers: devops-team,senior-developers
        minimum-approvals: 2
        issue-title: "Production Deployment Approval Required"
    
    - name: Production Deployment
      run: |
        # Blue-green deployment to production
        ./scripts/blue-green-deploy.sh production ${{ github.sha }}
```

### **Manual Promotion Checklist**
```bash
# scripts/promote-environment.sh

CURRENT_ENV=$1
TARGET_ENV=$2
VERSION=$3

echo "🚀 Promoting from $CURRENT_ENV to $TARGET_ENV"

# Pre-promotion checks
echo "📋 Running pre-promotion checklist..."

# 1. Verify current environment health
echo "✓ Checking $CURRENT_ENV health..."
kubectl get pods -n progressive-framework-$CURRENT_ENV
curl -f https://$CURRENT_ENV.your-domain.com/health || exit 1

# 2. Verify database migration compatibility
echo "✓ Checking database migration compatibility..."
npm run migrate:check --env=$TARGET_ENV --dry-run

# 3. Verify agent compatibility
echo "✓ Checking agent compatibility..." 
./scripts/test-agent-compatibility.sh $TARGET_ENV

# 4. Check resource requirements
echo "✓ Checking resource requirements..."
kubectl describe nodes | grep -A 5 "Allocated resources"

# 5. Backup current target environment
echo "✓ Creating backup of $TARGET_ENV..."
./scripts/backup-environment.sh $TARGET_ENV

# 6. Perform deployment
echo "🚀 Deploying to $TARGET_ENV..."
kubectl set image deployment/progressive-framework-v5-$TARGET_ENV \
  app=$ECR_REGISTRY/progressive-framework-v5:$VERSION \
  --namespace=progressive-framework-$TARGET_ENV

# 7. Wait for rollout
kubectl rollout status deployment/progressive-framework-v5-$TARGET_ENV \
  --namespace=progressive-framework-$TARGET_ENV --timeout=600s

# 8. Run post-deployment tests
echo "🧪 Running post-deployment tests..."
npm run test:$TARGET_ENV:smoke
npm run test:agents:$TARGET_ENV:smoke

# 9. Verify monitoring and alerting
echo "📊 Verifying monitoring..."
curl -f https://grafana.your-domain.com/api/health
curl -f https://prometheus.your-domain.com/-/healthy

echo "✅ Promotion to $TARGET_ENV completed successfully!"
```

---

## **MONITORING & OBSERVABILITY PER ENVIRONMENT**

### **Environment-Specific Monitoring**
```yaml
# Monitoring configuration per environment

Development:
- Basic health checks
- Console logging
- Local metrics collection
- No alerting

Staging:
- Enhanced monitoring
- Structured logging
- Prometheus metrics
- Basic alerting to development team

Pre-Production:
- Full monitoring stack
- Performance profiling
- Load testing metrics
- Enhanced alerting

Production:
- 24/7 monitoring
- Multiple alerting channels
- SLA monitoring
- Business metrics tracking
```

### **Grafana Dashboard Configuration**
```json
// grafana/dashboards/environment-overview.json
{
  "dashboard": {
    "id": null,
    "title": "Progressive-Framework-v5 - Environment Overview",
    "panels": [
      {
        "title": "Application Health by Environment",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=\"progressive-framework-v5\"}",
            "legendFormat": "{{environment}}"
          }
        ]
      },
      {
        "title": "Agent Status by Environment",
        "type": "table",
        "targets": [
          {
            "expr": "agent_health{job=\"progressive-agents\"}",
            "legendFormat": "{{environment}}-{{agent_type}}"
          }
        ]
      },
      {
        "title": "Response Time Comparison",
        "type": "graph", 
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "{{environment}} - 95th percentile"
          }
        ]
      },
      {
        "title": "Database Connections by Environment",
        "type": "graph",
        "targets": [
          {
            "expr": "postgres_connections{job=\"postgres-exporter\"}",
            "legendFormat": "{{environment}} - {{database}}"
          }
        ]
      }
    ]
  }
}
```

### **Alert Rules by Environment**
```yaml
# prometheus/alerts/environment-alerts.yml
groups:
- name: development-alerts
  rules:
  - alert: DevServiceDown
    expr: up{environment="development"} == 0
    for: 5m
    labels:
      severity: warning
      environment: development
    annotations:
      summary: "Development service is down"
      
- name: staging-alerts  
  rules:
  - alert: StagingHighErrorRate
    expr: rate(http_requests_total{environment="staging",status=~"5.."}[5m]) > 0.1
    for: 2m
    labels:
      severity: warning
      environment: staging
    annotations:
      summary: "High error rate in staging environment"
      
- name: production-alerts
  rules:
  - alert: ProductionServiceDown
    expr: up{environment="production"} == 0
    for: 1m
    labels:
      severity: critical
      environment: production
    annotations:
      summary: "CRITICAL: Production service is down!"
      description: "Production service has been down for more than 1 minute"
      
  - alert: ProductionAgentFailure
    expr: agent_health{environment="production"} == 0
    for: 30s
    labels:
      severity: critical
      environment: production
    annotations:
      summary: "CRITICAL: Production agent failure!"
      description: "Agent {{$labels.agent_type}} is failing in production"
```

---

## **SECURITY & COMPLIANCE PER ENVIRONMENT**

### **Environment Security Policies**
```yaml
# Network policies for environment isolation

Development:
- Open internal communication
- External internet access allowed
- No encryption requirements

Staging:
- Restricted internal communication
- Limited external access
- Basic encryption (TLS 1.2+)

Production:
- Strict network segmentation
- No direct external access
- Full encryption (TLS 1.3)
- WAF protection
- DDoS protection
```

### **Kubernetes Network Policies**
```yaml
# k8s/security/network-policies.yml

# Production: Strict isolation
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: production-isolation
  namespace: progressive-framework-prod
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
  - from:
    - namespaceSelector:
        matchLabels:
          name: monitoring
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: database
  - to: []
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53

---
# Development: Permissive for development ease
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: development-permissive
  namespace: progressive-framework-dev
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - {}
  egress:
  - {}
```

---

## **TROUBLESHOOTING**

### **Environment-Specific Issues**

#### **Development Environment Issues**
```bash
# Check development environment status
kubectl get all -n progressive-framework-dev

# View development logs
kubectl logs -l app=progressive-framework-v5 -n progressive-framework-dev --tail=50

# Reset development environment
kubectl delete namespace progressive-framework-dev
kubectl create namespace progressive-framework-dev
kubectl apply -k k8s/environments/development/
```

#### **Staging Environment Issues**
```bash
# Check staging deployment status
kubectl rollout status deployment/progressive-framework-v5-staging -n progressive-framework-staging

# Compare staging vs development config
diff k8s/environments/development/configmap.yml k8s/environments/staging/configmap.yml

# Rollback staging deployment
kubectl rollout undo deployment/progressive-framework-v5-staging -n progressive-framework-staging
```

#### **Production Environment Issues**
```bash
# Check production health without impacting users
kubectl exec -it deployment/progressive-framework-v5-production -n progressive-framework-prod -- curl localhost:3000/health

# View production metrics
kubectl port-forward svc/prometheus-server 9090:80 -n monitoring
# Access http://localhost:9090

# Emergency production rollback
./scripts/emergency-rollback.sh production
```

#### **Agent Environment Issues**
```bash
# Check agent coordination across environments
for env in dev staging prod; do
  echo "=== $env environment agents ==="
  kubectl get pods -l app=progressive-agents -n progressive-framework-$env
done

# Test agent communication
kubectl exec -it deployment/mca-production -n progressive-framework-prod -- \
  curl -f http://npa-service:8080/health
```

### **Environment Sync Issues**
```bash
#!/bin/bash
# scripts/sync-environment-config.sh

SOURCE_ENV=$1
TARGET_ENV=$2

echo "🔄 Syncing configuration from $SOURCE_ENV to $TARGET_ENV"

# Extract configmap from source
kubectl get configmap app-config-$SOURCE_ENV -o yaml > /tmp/source-config.yml

# Apply environment-specific transformations
sed "s/$SOURCE_ENV/$TARGET_ENV/g" /tmp/source-config.yml > /tmp/target-config.yml

# Validate configuration
kubectl apply --dry-run=client -f /tmp/target-config.yml

# Apply to target environment (with confirmation)
echo "Apply configuration to $TARGET_ENV? (y/N)"
read confirmation
if [ "$confirmation" = "y" ]; then
  kubectl apply -f /tmp/target-config.yml
  echo "✅ Configuration synced successfully"
else
  echo "❌ Sync cancelled"
fi
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Deployment Guide](Deployment-Guide.md)** - Manual deployment procedures  
- **[CI/CD Pipeline](CI-CD-Pipeline.md)** - Automated deployment processes

### **Follow-up Documents**
- **[Container Orchestration](Container-Orchestration.md)** - Kubernetes deployment details
- **[Monitoring & Alerting](Monitoring-Alerting.md)** - System monitoring across environments
- **[Agent Deployment Strategies](Agent-Deployment-Strategies.md)** - Context agent deployment patterns

### **Operations Context**
- **[Emergency Procedures & Rollback](../01-Core-System/Emergency-Procedures-Rollback.md)** - Crisis management
- **[Load Balancing & Resource Management](../06-Infrastructure/Load-Balancing-Resource-Management.md)** - Infrastructure scaling

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | DevOps Team | Complete environment management strategy |
| 4.x | 2025-08-xx | Dev Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: DevOps Team  
**Last Validated**: 2025-09-02