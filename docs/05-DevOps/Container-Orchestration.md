---
file: docs/05-DevOps/Container-Orchestration.md
directory: docs/05-DevOps/
priority: HIGH
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# Container Orchestration - Progressive-Framework-v5

**File Path**: `docs/05-DevOps/Container-Orchestration.md`  
**Directory**: `docs/05-DevOps/`  
**Priority**: HIGH  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive container orchestration strategy for Progressive-Framework-v5, covering Docker containerization, Kubernetes cluster management, service mesh implementation, and advanced orchestration patterns for both enterprise core systems and context agents (MCA, NPA, WPA).

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🚀 **[Deployment Guide](Deployment-Guide.md)** - *Manual deployment procedures*
- 🔄 **[CI/CD Pipeline](CI-CD-Pipeline.md)** - *Automated deployment processes*
- 🌍 **[Environment Management](Environment-Management.md)** - *Multi-environment strategies*

---

## **CONTAINER ARCHITECTURE**

### **Containerization Strategy**
```
Progressive-Framework-v5 Container Architecture:

┌─────────────────────────────────────────────────────────────────────┐
│                     KUBERNETES CLUSTER                             │
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │  INGRESS LAYER  │    │  SERVICE MESH   │    │  MONITORING     │ │
│  │                 │    │                 │    │                 │ │
│  │ • NGINX Ingress │    │ • Istio/Linkerd │    │ • Prometheus    │ │
│  │ • TLS Termination│   │ • Traffic Mgmt  │    │ • Grafana       │ │
│  │ • Load Balancing│    │ • Security      │    │ • Jaeger        │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  APPLICATION LAYER                          │   │
│  │                                                             │   │
│  │  ┌─────────────────┐                                       │   │
│  │  │ ENTERPRISE CORE │                                       │   │
│  │  │                 │                                       │   │
│  │  │ • Main App API  │                                       │   │
│  │  │ • Business Logic│                                       │   │
│  │  │ • Web Interface │                                       │   │
│  │  │ • 3-20 Replicas │                                       │   │
│  │  └─────────────────┘                                       │   │
│  │                                                             │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │              CONTEXT AGENTS LAYER                   │   │   │
│  │  │                                                     │   │   │
│  │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │   │
│  │  │  │     MCA     │ │     NPA     │ │     WPA     │   │   │   │
│  │  │  │             │ │             │ │             │   │   │   │
│  │  │  │ • Coordination│ • Nutrition │ • Workout   │   │   │   │
│  │  │  │ • Orchestration│ • Planning  │ • Planning  │   │   │   │
│  │  │  │ • 2-10 Replicas│ • 1-5 Replicas│ • 1-5 Replicas│ │   │   │
│  │  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    DATABASE LAYER                           │   │
│  │                                                             │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │   │
│  │  │ PostgreSQL  │ │    Redis    │ │      MongoDB        │   │   │
│  │  │             │ │             │ │                     │   │   │
│  │  │ • Primary   │ │ • Cluster   │ │ • Replica Set       │   │   │
│  │  │ • 2 Replicas│ │ • 3 Nodes   │ │ • 3 Members         │   │   │
│  │  │ • StatefulSet│ │ • StatefulSet│ │ • StatefulSet       │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### **Container Design Principles**

#### **Microservices Architecture**
- **Single Responsibility**: Each container has one primary function
- **Loose Coupling**: Containers communicate via well-defined APIs
- **Stateless Design**: Application containers are stateless where possible
- **Data Persistence**: Databases use persistent volumes and StatefulSets

#### **12-Factor App Compliance**
- **Configuration via Environment**: All config via environment variables
- **Dependency Isolation**: All dependencies packaged in containers
- **Backing Services**: Databases treated as attached resources
- **Disposability**: Fast startup and graceful shutdown
- **Development/Production Parity**: Same containers across environments

---

## **DOCKER CONTAINERIZATION**

### **Multi-Stage Dockerfile Strategy**
```dockerfile
# Progressive-Framework-v5 Multi-stage Dockerfile
ARG NODE_VERSION=18-alpine
ARG NGINX_VERSION=1.24-alpine

# ===============================================
# Base image with security updates
# ===============================================
FROM node:${NODE_VERSION} AS base

# Install security updates
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init curl && \
    rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

# ===============================================
# Dependencies stage
# ===============================================
FROM base AS dependencies

# Copy package files first (for better caching)
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production --prefer-offline --no-audit && \
    npm cache clean --force

# Install development dependencies (for building)
RUN npm ci --prefer-offline --no-audit

# ===============================================
# Build stage
# ===============================================
FROM dependencies AS builder

# Copy source code
COPY . .

# Build application and agents
RUN npm run build && \
    npm run build:agents && \
    npm run build:assets

# Remove development dependencies
RUN npm prune --production

# ===============================================
# Production application image
# ===============================================
FROM base AS production

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Copy configuration and scripts
COPY --chown=nodejs:nodejs config/ ./config/
COPY --chown=nodejs:nodejs scripts/health-check.js ./scripts/

# Create logs directory
RUN mkdir -p logs && chown nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node scripts/health-check.js || exit 1

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]

# ===============================================
# Agent-specific image
# ===============================================
FROM base AS agents

# Copy agent dependencies and built files
COPY --from=builder --chown=nodejs:nodejs /app/dist/agents ./agents
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Copy agent configuration
COPY --chown=nodejs:nodejs config/agents/ ./config/agents/
COPY --chown=nodejs:nodejs scripts/agent-health-check.js ./scripts/

USER nodejs

HEALTHCHECK --interval=30s --timeout=15s --start-period=45s --retries=3 \
    CMD node scripts/agent-health-check.js || exit 1

EXPOSE 8000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "agents/coordinator.js"]

# ===============================================
# Static assets / Frontend (if applicable)
# ===============================================
FROM nginx:${NGINX_VERSION} AS frontend

# Copy built static assets
COPY --from=builder /app/dist/public /usr/share/nginx/html

# Copy custom nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Run nginx as non-root
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S nginx-user -u 1001 -G nginx-user

# Change ownership of nginx files
RUN chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    chown -R nginx-user:nginx-user /etc/nginx/conf.d && \
    chown -R nginx-user:nginx-user /usr/share/nginx/html

USER nginx-user

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### **Container Optimization Techniques**

#### **Layer Optimization**
```dockerfile
# Bad: Creates many layers
RUN apk update
RUN apk upgrade  
RUN apk add curl
RUN apk add vim
RUN rm -rf /var/cache/apk/*

# Good: Single layer with cleanup
RUN apk update && apk upgrade && \
    apk add --no-cache curl vim && \
    rm -rf /var/cache/apk/*
```

#### **Build Cache Optimization**
```dockerfile
# Copy package files first (changes less frequently)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code last (changes most frequently)
COPY . .
RUN npm run build
```

#### **Multi-Architecture Support**
```dockerfile
# Support ARM64 and AMD64
FROM --platform=$BUILDPLATFORM node:18-alpine AS base

ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN echo "Building on $BUILDPLATFORM, targeting $TARGETPLATFORM"
```

### **Docker Compose for Development**
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    image: progressive-framework-v5:dev
    container_name: progressive-app-dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DEBUG=progressive:*
    volumes:
      - ./src:/app/src:ro
      - ./config:/app/config:ro
      - app-logs:/app/logs
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - progressive-network
    restart: unless-stopped

  agents:
    build:
      context: .
      dockerfile: Dockerfile
      target: agents
    image: progressive-agents:dev
    container_name: progressive-agents-dev
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
      - MCA_ENABLED=true
      - NPA_ENABLED=true
      - WPA_ENABLED=true
    volumes:
      - ./src/agents:/app/agents:ro
      - agent-logs:/app/logs
    depends_on:
      - app
    networks:
      - progressive-network
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    container_name: progressive-postgres-dev
    environment:
      POSTGRES_DB: progressive_framework_v5_dev
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./scripts/sql/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev_user -d progressive_framework_v5_dev"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - progressive-network

  redis:
    image: redis:7-alpine
    container_name: progressive-redis-dev
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - progressive-network

  mongodb:
    image: mongo:7.0
    container_name: progressive-mongodb-dev
    environment:
      MONGO_INITDB_ROOT_USERNAME: dev_user
      MONGO_INITDB_ROOT_PASSWORD: dev_password
      MONGO_INITDB_DATABASE: progressive_framework_v5_dev
    volumes:
      - mongodb-data:/data/db
      - ./scripts/mongo/init.js:/docker-entrypoint-initdb.d/init.js:ro
    ports:
      - "27017:27017"
    networks:
      - progressive-network

volumes:
  postgres-data:
    driver: local
  redis-data:
    driver: local
  mongodb-data:
    driver: local
  app-logs:
    driver: local
  agent-logs:
    driver: local

networks:
  progressive-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

---

## **KUBERNETES ORCHESTRATION**

### **Cluster Architecture**

#### **Production Cluster Specification**
```yaml
# Cluster requirements for Progressive-Framework-v5

Node Types:
├── Control Plane Nodes (3 replicas)
│   ├── Instance Type: t3.medium (2 vCPU, 4GB RAM)
│   ├── Storage: 100GB gp3 SSD
│   └── Purpose: API server, etcd, scheduler, controller

├── Application Nodes (5-20 replicas, auto-scaling)
│   ├── Instance Type: c5.2xlarge (8 vCPU, 16GB RAM)
│   ├── Storage: 200GB gp3 SSD
│   └── Purpose: Application workloads, agents

├── Database Nodes (3 replicas)
│   ├── Instance Type: r5.xlarge (4 vCPU, 32GB RAM)
│   ├── Storage: 1TB gp3 SSD + 2TB EBS for data
│   └── Purpose: Database workloads (PostgreSQL, MongoDB)

└── Cache Nodes (3 replicas)
    ├── Instance Type: r5.large (2 vCPU, 16GB RAM)
    ├── Storage: 100GB gp3 SSD
    └── Purpose: Redis cluster
```

### **Kubernetes Manifests Structure**
```bash
k8s/
├── base/                           # Base configurations (Kustomize)
│   ├── namespace.yml
│   ├── configmap.yml
│   ├── secret.yml
│   ├── deployment.yml
│   ├── service.yml
│   ├── ingress.yml
│   └── kustomization.yml
│
├── components/                     # Reusable components
│   ├── database/
│   │   ├── postgres/
│   │   │   ├── statefulset.yml
│   │   │   ├── service.yml
│   │   │   └── pvc.yml
│   │   ├── redis/
│   │   └── mongodb/
│   │
│   ├── monitoring/
│   │   ├── prometheus/
│   │   ├── grafana/
│   │   └── jaeger/
│   │
│   └── agents/
│       ├── mca/
│       ├── npa/
│       └── wpa/
│
├── overlays/                       # Environment-specific configurations
│   ├── development/
│   │   ├── kustomization.yml
│   │   ├── deployment-patch.yml
│   │   └── configmap-patch.yml
│   │
│   ├── staging/
│   ├── preproduction/
│   └── production/
│
└── operators/                      # Custom operators and CRDs
    ├── progressive-operator/
    └── agent-operator/
```

### **Core Application Deployment**
```yaml
# k8s/base/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: progressive-framework-v5
  labels:
    app: progressive-framework-v5
    tier: application
    component: core
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 2
  selector:
    matchLabels:
      app: progressive-framework-v5
  template:
    metadata:
      labels:
        app: progressive-framework-v5
        tier: application
        component: core
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
        prometheus.io/path: "/metrics"
    spec:
      # Anti-affinity to spread pods across nodes
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
      
      # Service account for RBAC
      serviceAccountName: progressive-app-sa
      
      # Security context
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        runAsGroup: 1001
        fsGroup: 1001
        seccompProfile:
          type: RuntimeDefault
      
      # Init containers for database migrations
      initContainers:
      - name: db-migrate
        image: progressive-framework-v5:latest
        command: ["npm", "run", "migrate:up"]
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        securityContext:
          runAsNonRoot: true
          runAsUser: 1001
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
      
      containers:
      - name: app
        image: progressive-framework-v5:latest
        imagePullPolicy: IfNotPresent
        
        ports:
        - name: http
          containerPort: 3000
          protocol: TCP
        - name: metrics
          containerPort: 9090
          protocol: TCP
        
        # Environment configuration
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        
        env:
        - name: NODE_NAME
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: POD_IP
          valueFrom:
            fieldRef:
              fieldPath: status.podIP
        
        # Resource management
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
            ephemeral-storage: "1Gi"
          limits:
            memory: "2Gi"
            cpu: "2"
            ephemeral-storage: "5Gi"
        
        # Security context
        securityContext:
          runAsNonRoot: true
          runAsUser: 1001
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
            add:
            - NET_BIND_SERVICE
        
        # Health checks
        livenessProbe:
          httpGet:
            path: /health
            port: http
            scheme: HTTP
          initialDelaySeconds: 60
          periodSeconds: 30
          timeoutSeconds: 10
          successThreshold: 1
          failureThreshold: 3
        
        readinessProbe:
          httpGet:
            path: /health/ready
            port: http
            scheme: HTTP
          initialDelaySeconds: 15
          periodSeconds: 10
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 3
        
        startupProbe:
          httpGet:
            path: /health/startup
            port: http
            scheme: HTTP
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          successThreshold: 1
          failureThreshold: 12  # 60 seconds total
        
        # Volume mounts
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: app-logs
          mountPath: /app/logs
        - name: app-cache
          mountPath: /app/.cache
      
      # Volumes
      volumes:
      - name: tmp
        emptyDir: {}
      - name: app-logs
        emptyDir: {}
      - name: app-cache
        emptyDir: {}

---
# Service for application
apiVersion: v1
kind: Service
metadata:
  name: progressive-framework-v5-service
  labels:
    app: progressive-framework-v5
    tier: application
spec:
  type: ClusterIP
  ports:
  - name: http
    port: 80
    targetPort: 3000
    protocol: TCP
  - name: metrics
    port: 9090
    targetPort: 9090
    protocol: TCP
  selector:
    app: progressive-framework-v5

---
# Service account with proper RBAC
apiVersion: v1
kind: ServiceAccount
metadata:
  name: progressive-app-sa
  labels:
    app: progressive-framework-v5

---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: progressive-app-role
rules:
- apiGroups: [""]
  resources: ["configmaps", "secrets"]
  verbs: ["get", "list"]
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: progressive-app-rolebinding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: progressive-app-role
subjects:
- kind: ServiceAccount
  name: progressive-app-sa
```

### **Context Agents Orchestration**

#### **Master Coordination Agent (MCA) Deployment**
```yaml
# k8s/components/agents/mca/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mca-deployment
  labels:
    app: mca
    component: coordination-agent
    tier: agents
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  selector:
    matchLabels:
      app: mca
  template:
    metadata:
      labels:
        app: mca
        component: coordination-agent
        tier: agents
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8090"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: agent-sa
      
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      
      containers:
      - name: mca
        image: progressive-agents:latest
        imagePullPolicy: IfNotPresent
        
        env:
        - name: AGENT_TYPE
          value: "mca"
        - name: AGENT_ID
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        
        envFrom:
        - configMapRef:
            name: agent-config
        - secretRef:
            name: agent-secrets
        
        ports:
        - name: http
          containerPort: 8000
        - name: metrics
          containerPort: 8090
        - name: grpc
          containerPort: 9000
        
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "1"
        
        securityContext:
          runAsNonRoot: true
          runAsUser: 1001
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
        
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 45
          periodSeconds: 30
          timeoutSeconds: 10
          failureThreshold: 3
        
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 15
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: agent-logs
          mountPath: /app/logs
      
      volumes:
      - name: tmp
        emptyDir: {}
      - name: agent-logs
        emptyDir: {}

---
# MCA Service
apiVersion: v1
kind: Service
metadata:
  name: mca-service
  labels:
    app: mca
    component: coordination-agent
spec:
  type: ClusterIP
  ports:
  - name: http
    port: 80
    targetPort: 8000
  - name: metrics
    port: 9090
    targetPort: 8090
  - name: grpc
    port: 9000
    targetPort: 9000
  selector:
    app: mca

---
# MCA Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: mca-hpa
  labels:
    app: mca
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mca-deployment
  minReplicas: 2
  maxReplicas: 10
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
        name: agent_requests_per_second
      target:
        type: AverageValue
        averageValue: "50"
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

#### **Nutrition Planning Agent (NPA) Deployment**
```yaml
# k8s/components/agents/npa/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: npa-deployment
  labels:
    app: npa
    component: nutrition-agent
    tier: agents
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  selector:
    matchLabels:
      app: npa
  template:
    metadata:
      labels:
        app: npa
        component: nutrition-agent
        tier: agents
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8090"
    spec:
      serviceAccountName: agent-sa
      
      containers:
      - name: npa
        image: progressive-agents:latest
        
        env:
        - name: AGENT_TYPE
          value: "npa"
        - name: AGENT_SPECIALIZATION
          value: "nutrition"
        
        envFrom:
        - configMapRef:
            name: agent-config
        - configMapRef:
            name: npa-config
        - secretRef:
            name: agent-secrets
        
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        
        # Same security and health check patterns as MCA

---
# NPA Service with session affinity for nutrition tracking
apiVersion: v1
kind: Service
metadata:
  name: npa-service
  labels:
    app: npa
    component: nutrition-agent
spec:
  type: ClusterIP
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 3600  # 1 hour session stickiness
  ports:
  - name: http
    port: 80
    targetPort: 8000
  selector:
    app: npa
```

#### **Workout Planning Agent (WPA) Deployment**
```yaml
# k8s/components/agents/wpa/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wpa-deployment
  labels:
    app: wpa
    component: workout-agent
    tier: agents
spec:
  replicas: 2
  selector:
    matchLabels:
      app: wpa
  template:
    metadata:
      labels:
        app: wpa
        component: workout-agent
        tier: agents
    spec:
      serviceAccountName: agent-sa
      
      containers:
      - name: wpa
        image: progressive-agents:latest
        
        env:
        - name: AGENT_TYPE
          value: "wpa"
        - name: AGENT_SPECIALIZATION
          value: "workout"
        
        # Similar configuration to NPA but workout-specific
```

---

## **SERVICE MESH IMPLEMENTATION**

### **Istio Service Mesh Configuration**

#### **Istio Installation**
```bash
#!/bin/bash
# scripts/install-istio.sh

# Download and install Istio
curl -L https://istio.io/downloadIstio | sh -
cd istio-1.19.0
export PATH=$PWD/bin:$PATH

# Install Istio with production configuration
istioctl install --set values.pilot.resources.requests.memory=512Mi \
                 --set values.pilot.resources.requests.cpu=500m \
                 --set values.global.proxy.resources.requests.memory=128Mi \
                 --set values.global.proxy.resources.requests.cpu=100m \
                 --set values.gateways.istio-ingressgateway.resources.requests.memory=256Mi \
                 --set values.gateways.istio-ingressgateway.resources.requests.cpu=200m

# Enable automatic sidecar injection for progressive namespaces
kubectl label namespace progressive-framework-prod istio-injection=enabled
kubectl label namespace progressive-framework-staging istio-injection=enabled

# Install Istio addons (Prometheus, Grafana, Jaeger, Kiali)
kubectl apply -f samples/addons/prometheus.yaml
kubectl apply -f samples/addons/grafana.yaml
kubectl apply -f samples/addons/jaeger.yaml
kubectl apply -f samples/addons/kiali.yaml

echo "✅ Istio installation completed"
```

#### **Traffic Management**
```yaml
# k8s/istio/gateway.yml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: progressive-gateway
  namespace: progressive-framework-prod
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: progressive-tls-secret
    hosts:
    - "your-domain.com"
    - "api.your-domain.com"
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "your-domain.com"
    - "api.your-domain.com"
    tls:
      httpsRedirect: true

---
# Virtual Service for traffic routing
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: progressive-virtualservice
  namespace: progressive-framework-prod
spec:
  hosts:
  - "your-domain.com"
  - "api.your-domain.com"
  gateways:
  - progressive-gateway
  http:
  # API routes to backend
  - match:
    - uri:
        prefix: "/api/v1"
    route:
    - destination:
        host: progressive-framework-v5-service
        port:
          number: 80
    timeout: 30s
    retries:
      attempts: 3
      perTryTimeout: 10s
      retryOn: gateway-error,connect-failure,refused-stream
  
  # Agent routes with load balancing
  - match:
    - uri:
        prefix: "/api/v1/agents/mca"
    route:
    - destination:
        host: mca-service
        port:
          number: 80
    timeout: 45s
    retries:
      attempts: 2
      perTryTimeout: 20s
  
  - match:
    - uri:
        prefix: "/api/v1/agents/npa"
    route:
    - destination:
        host: npa-service
        port:
          number: 80
      weight: 90
    - destination:
        host: npa-service-canary
        port:
          number: 80
      weight: 10
    timeout: 30s
    
  # Default route to main application
  - match:
    - uri:
        prefix: "/"
    route:
    - destination:
        host: progressive-framework-v5-service
        port:
          number: 80

---
# Destination Rules for load balancing and circuit breaking
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: progressive-destination-rules
  namespace: progressive-framework-prod
spec:
  host: progressive-framework-v5-service
  trafficPolicy:
    loadBalancer:
      consistentHash:
        httpHeaderName: "user-id"
    connectionPool:
      tcp:
        maxConnections: 100
        connectTimeout: 30s
      http:
        http1MaxPendingRequests: 50
        http2MaxRequests: 100
        maxRequestsPerConnection: 10
        maxRetries: 3
        consecutiveGatewayErrors: 5
        interval: 30s
        baseEjectionTime: 30s
        maxEjectionPercent: 50
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
      minHealthPercent: 30

---
# Agent-specific destination rules
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: mca-destination-rule
  namespace: progressive-framework-prod
spec:
  host: mca-service
  trafficPolicy:
    loadBalancer:
      simple: LEAST_CONN
    connectionPool:
      tcp:
        maxConnections: 50
      http:
        http1MaxPendingRequests: 25
        maxRequestsPerConnection: 5
    outlierDetection:
      consecutive5xxErrors: 3
      interval: 30s
      baseEjectionTime: 30s
```

#### **Security Policies**
```yaml
# k8s/istio/security.yml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: progressive-framework-prod
spec:
  mtls:
    mode: STRICT

---
# Authorization policy for agents
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: agent-access-policy
  namespace: progressive-framework-prod
spec:
  selector:
    matchLabels:
      tier: agents
  rules:
  # Allow main application to call agents
  - from:
    - source:
        principals: ["cluster.local/ns/progressive-framework-prod/sa/progressive-app-sa"]
  - to:
    - operation:
        methods: ["GET", "POST", "PUT"]
        paths: ["/health", "/api/*"]
  
  # Allow MCA to orchestrate other agents
  - from:
    - source:
        principals: ["cluster.local/ns/progressive-framework-prod/sa/agent-sa"]
    when:
    - key: source.labels[app]
      values: ["mca"]
  - to:
    - operation:
        methods: ["GET", "POST"]
        paths: ["/api/v1/*"]

---
# Request authentication for external traffic
apiVersion: security.istio.io/v1beta1
kind: RequestAuthentication
metadata:
  name: jwt-auth
  namespace: progressive-framework-prod
spec:
  selector:
    matchLabels:
      app: progressive-framework-v5
  jwtRules:
  - issuer: "https://your-domain.com/auth"
    jwksUri: "https://your-domain.com/auth/.well-known/jwks.json"
    audiences:
    - "progressive-framework-v5"
    forwardOriginalToken: true
```

---

## **STATEFUL SERVICES ORCHESTRATION**

### **PostgreSQL StatefulSet**
```yaml
# k8s/components/database/postgres/statefulset.yml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  labels:
    app: postgres
    tier: database
spec:
  serviceName: postgres-headless
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
        tier: database
    spec:
      securityContext:
        runAsUser: 999
        runAsGroup: 999
        fsGroup: 999
      
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_DB
          value: progressive_framework_v5
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        - name: POSTGRES_REPLICATION_MODE
          value: slave
        - name: POSTGRES_REPLICATION_USER
          value: replicator
        - name: POSTGRES_REPLICATION_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: replication-password
        - name: POSTGRES_MASTER_SERVICE
          value: postgres-primary
        
        ports:
        - name: postgres
          containerPort: 5432
        
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
            storage: "100Gi"
          limits:
            memory: "4Gi"
            cpu: "2"
        
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        - name: postgres-config
          mountPath: /etc/postgresql/postgresql.conf
          subPath: postgresql.conf
        - name: postgres-config
          mountPath: /etc/postgresql/pg_hba.conf
          subPath: pg_hba.conf
        
        livenessProbe:
          exec:
            command:
            - /bin/bash
            - -c
            - exec pg_isready -U $POSTGRES_USER -d $POSTGRES_DB -h 127.0.0.1 -p 5432
          initialDelaySeconds: 60
          periodSeconds: 30
          timeoutSeconds: 10
          failureThreshold: 3
        
        readinessProbe:
          exec:
            command:
            - /bin/bash
            - -c
            - exec pg_isready -U $POSTGRES_USER -d $POSTGRES_DB -h 127.0.0.1 -p 5432
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
      
      volumes:
      - name: postgres-config
        configMap:
          name: postgres-config
  
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: fast-ssd
      resources:
        requests:
          storage: 1Ti

---
# PostgreSQL Primary Service
apiVersion: v1
kind: Service
metadata:
  name: postgres-primary
  labels:
    app: postgres
    role: primary
spec:
  type: ClusterIP
  ports:
  - name: postgres
    port: 5432
    targetPort: 5432
  selector:
    app: postgres
    role: primary

---
# PostgreSQL Read Replica Service
apiVersion: v1
kind: Service
metadata:
  name: postgres-replica
  labels:
    app: postgres
    role: replica
spec:
  type: ClusterIP
  ports:
  - name: postgres
    port: 5432
    targetPort: 5432
  selector:
    app: postgres
    role: replica
```

### **Redis Cluster**
```yaml
# k8s/components/database/redis/statefulset.yml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis-cluster
  labels:
    app: redis-cluster
    tier: cache
spec:
  serviceName: redis-cluster-headless
  replicas: 6
  selector:
    matchLabels:
      app: redis-cluster
  template:
    metadata:
      labels:
        app: redis-cluster
        tier: cache
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        command:
        - redis-server
        args:
        - /etc/redis/redis.conf
        - --cluster-enabled
        - "yes"
        - --cluster-config-file
        - nodes.conf
        - --cluster-node-timeout
        - "5000"
        - --appendonly
        - "yes"
        - --maxmemory
        - 1gb
        - --maxmemory-policy
        - allkeys-lru
        
        ports:
        - name: redis
          containerPort: 6379
        - name: cluster
          containerPort: 16379
        
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        
        volumeMounts:
        - name: redis-data
          mountPath: /data
        - name: redis-config
          mountPath: /etc/redis/redis.conf
          subPath: redis.conf
        
        livenessProbe:
          exec:
            command:
            - redis-cli
            - ping
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        
        readinessProbe:
          exec:
            command:
            - redis-cli
            - ping
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
      
      volumes:
      - name: redis-config
        configMap:
          name: redis-config
  
  volumeClaimTemplates:
  - metadata:
      name: redis-data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: fast-ssd
      resources:
        requests:
          storage: 100Gi

---
# Redis cluster initialization job
apiVersion: batch/v1
kind: Job
metadata:
  name: redis-cluster-init
  labels:
    app: redis-cluster
spec:
  template:
    spec:
      restartPolicy: OnFailure
      containers:
      - name: cluster-init
        image: redis:7-alpine
        command:
        - /bin/bash
        - -c
        - |
          # Wait for all Redis instances to be ready
          sleep 60
          
          # Create cluster
          redis-cli --cluster create \
            redis-cluster-0.redis-cluster-headless:6379 \
            redis-cluster-1.redis-cluster-headless:6379 \
            redis-cluster-2.redis-cluster-headless:6379 \
            redis-cluster-3.redis-cluster-headless:6379 \
            redis-cluster-4.redis-cluster-headless:6379 \
            redis-cluster-5.redis-cluster-headless:6379 \
            --cluster-replicas 1 \
            --cluster-yes
```

---

## **MONITORING & OBSERVABILITY**

### **Prometheus Configuration for Containers**
```yaml
# k8s/monitoring/prometheus/configmap.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
      
    rule_files:
      - "/etc/prometheus/rules/*.yml"
      
    scrape_configs:
    # Kubernetes API server
    - job_name: 'kubernetes-apiservers'
      kubernetes_sd_configs:
      - role: endpoints
      scheme: https
      tls_config:
        ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
      relabel_configs:
      - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
        action: keep
        regex: default;kubernetes;https
    
    # Progressive Framework application
    - job_name: 'progressive-framework-v5'
      kubernetes_sd_configs:
      - role: endpoints
        namespaces:
          names:
          - progressive-framework-prod
          - progressive-framework-staging
      relabel_configs:
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_service_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
      - action: labelmap
        regex: __meta_kubernetes_service_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_service_name]
        action: replace
        target_label: kubernetes_name
    
    # Context Agents
    - job_name: 'progressive-agents'
      kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
          - progressive-framework-prod
          - progressive-framework-staging
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_tier]
        action: keep
        regex: agents
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
      - action: labelmap
        regex: __meta_kubernetes_pod_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        target_label: kubernetes_pod_name
    
    # Database monitoring
    - job_name: 'postgres'
      static_configs:
      - targets: ['postgres-exporter:9187']
      
    - job_name: 'redis'
      static_configs:
      - targets: ['redis-exporter:9121']
```

### **Container Resource Monitoring**
```yaml
# Alert rules for container resources
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-rules
  namespace: monitoring
data:
  container-alerts.yml: |
    groups:
    - name: container-resources
      rules:
      # High CPU usage in containers
      - alert: ContainerCPUUsageHigh
        expr: (rate(container_cpu_usage_seconds_total{container!="POD",container!=""}[5m]) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage in container {{ $labels.container }}"
          description: "Container {{ $labels.container }} in pod {{ $labels.pod }} is using {{ $value }}% CPU"
      
      # High memory usage in containers  
      - alert: ContainerMemoryUsageHigh
        expr: (container_memory_usage_bytes{container!="POD",container!=""} / container_spec_memory_limit_bytes{container!="POD",container!=""} * 100) > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage in container {{ $labels.container }}"
          description: "Container {{ $labels.container }} in pod {{ $labels.pod }} is using {{ $value }}% memory"
      
      # Container restart frequency
      - alert: ContainerRestartingFrequently
        expr: rate(kube_pod_container_status_restarts_total[1h]) > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Container restarting frequently"
          description: "Container {{ $labels.container }} in pod {{ $labels.pod }} is restarting {{ $value }} times per hour"
      
      # Agent-specific alerts
      - alert: AgentResponseTimeHigh
        expr: histogram_quantile(0.95, rate(agent_request_duration_seconds_bucket[5m])) > 10
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "Agent response time high"
          description: "Agent {{ $labels.agent_type }} 95th percentile response time is {{ $value }}s"
      
      - alert: AgentErrorRateHigh
        expr: rate(agent_errors_total[5m]) / rate(agent_requests_total[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Agent error rate high"
          description: "Agent {{ $labels.agent_type }} error rate is {{ $value }}%"
```

---

## **SCALING & PERFORMANCE**

### **Vertical Pod Autoscaler (VPA)**
```yaml
# k8s/scaling/vpa.yml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: progressive-framework-v5-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: progressive-framework-v5
  updatePolicy:
    updateMode: "Auto"  # or "Off" for recommendations only
  resourcePolicy:
    containerPolicies:
    - containerName: app
      minAllowed:
        cpu: 200m
        memory: 256Mi
      maxAllowed:
        cpu: 4
        memory: 8Gi
      controlledResources: ["cpu", "memory"]
      controlledValues: RequestsAndLimits

---
# VPA for agents
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: mca-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mca-deployment
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: mca
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 2
        memory: 2Gi
```

### **Cluster Autoscaler Configuration**
```yaml
# k8s/scaling/cluster-autoscaler.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cluster-autoscaler
  namespace: kube-system
  labels:
    app: cluster-autoscaler
spec:
  selector:
    matchLabels:
      app: cluster-autoscaler
  replicas: 1
  template:
    metadata:
      labels:
        app: cluster-autoscaler
    spec:
      serviceAccountName: cluster-autoscaler
      containers:
      - image: k8s.gcr.io/autoscaling/cluster-autoscaler:v1.27.0
        name: cluster-autoscaler
        resources:
          limits:
            cpu: 100m
            memory: 300Mi
          requests:
            cpu: 100m
            memory: 300Mi
        command:
        - ./cluster-autoscaler
        - --v=4
        - --stderrthreshold=info
        - --cloud-provider=aws
        - --skip-nodes-with-local-storage=false
        - --expander=least-waste
        - --node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/progressive-framework-v5
        - --balance-similar-node-groups
        - --scale-down-delay-after-add=10m
        - --scale-down-unneeded-time=10m
        - --scale-down-delay-after-delete=10s
        - --scale-down-delay-after-failure=3m
        - --max-node-provision-time=15m
        env:
        - name: AWS_REGION
          value: us-east-1
```

### **Performance Optimization**

#### **Pod Disruption Budgets**
```yaml
# k8s/scaling/pdb.yml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: progressive-framework-v5-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: progressive-framework-v5

---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: mca-pdb
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: mca

---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: agents-pdb
spec:
  minAvailable: 50%
  selector:
    matchLabels:
      tier: agents
```

#### **Node Affinity and Taints**
```yaml
# Node affinity for database workloads
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  template:
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: node-type
                operator: In
                values: ["database"]
              - key: storage-type
                operator: In
                values: ["ssd"]
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            preference:
              matchExpressions:
              - key: instance-size
                operator: In
                values: ["large", "xlarge"]
      
      # Toleration for dedicated database nodes
      tolerations:
      - key: "database-workload"
        operator: "Equal"
        value: "true"
        effect: "NoSchedule"
```

---

## **TROUBLESHOOTING**

### **Common Container Issues**

#### **Container Startup Issues**
```bash
# Check pod status and events
kubectl get pods -n progressive-framework-prod
kubectl describe pod <pod-name> -n progressive-framework-prod

# Check container logs
kubectl logs <pod-name> -c <container-name> -n progressive-framework-prod --previous

# Debug startup issues
kubectl exec -it <pod-name> -n progressive-framework-prod -- /bin/sh

# Check resource constraints
kubectl top pods -n progressive-framework-prod
kubectl describe nodes
```

#### **Agent Communication Issues**
```bash
# Test agent connectivity
kubectl exec -it deployment/progressive-framework-v5 -n progressive-framework-prod -- \
  curl -v http://mca-service:80/health

# Check service discovery
kubectl get endpoints -n progressive-framework-prod
kubectl get services -n progressive-framework-prod

# Debug DNS resolution
kubectl exec -it deployment/progressive-framework-v5 -n progressive-framework-prod -- \
  nslookup mca-service
```

#### **Performance Issues**
```bash
# Check resource usage
kubectl top pods -n progressive-framework-prod --containers
kubectl top nodes

# Check HPA status
kubectl get hpa -n progressive-framework-prod
kubectl describe hpa progressive-framework-v5-hpa -n progressive-framework-prod

# Check VPA recommendations
kubectl describe vpa progressive-framework-v5-vpa
```

#### **Database Connection Issues**
```bash
# Check StatefulSet status
kubectl get statefulsets -n progressive-framework-prod
kubectl describe statefulset postgres

# Test database connectivity
kubectl exec -it postgres-0 -n progressive-framework-prod -- \
  psql -U postgres -c "SELECT version();"

# Check persistent volume status
kubectl get pv
kubectl get pvc -n progressive-framework-prod
```

### **Debugging Scripts**
```bash
#!/bin/bash
# scripts/debug-container-issues.sh

NAMESPACE=${1:-progressive-framework-prod}
POD_NAME=$2

echo "🔍 Debugging container issues in namespace: $NAMESPACE"

if [ -z "$POD_NAME" ]; then
  echo "📋 Available pods:"
  kubectl get pods -n $NAMESPACE
  exit 1
fi

echo "🏃 Pod status:"
kubectl get pod $POD_NAME -n $NAMESPACE -o wide

echo "📝 Pod events:"
kubectl describe pod $POD_NAME -n $NAMESPACE | grep -A 20 Events:

echo "📊 Resource usage:"
kubectl top pod $POD_NAME -n $NAMESPACE --containers

echo "🔗 Service endpoints:"
kubectl get endpoints -n $NAMESPACE

echo "📱 Container logs (last 50 lines):"
kubectl logs $POD_NAME -n $NAMESPACE --tail=50

echo "🩺 Health check:"
kubectl exec $POD_NAME -n $NAMESPACE -- curl -f http://localhost:3000/health 2>/dev/null && echo "✅ Health OK" || echo "❌ Health Failed"

echo "🔧 Debug complete for pod: $POD_NAME"
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Deployment Guide](Deployment-Guide.md)** - Manual deployment procedures
- **[CI/CD Pipeline](CI-CD-Pipeline.md)** - Automated deployment processes
- **[Environment Management](Environment-Management.md)** - Multi-environment strategies

### **Follow-up Documents**
- **[Monitoring & Alerting](Monitoring-Alerting.md)** - Comprehensive monitoring setup
- **[Agent Deployment Strategies](Agent-Deployment-Strategies.md)** - Advanced agent deployment patterns

### **Operations Context**
- **[Emergency Procedures & Rollback](../01-Core-System/Emergency-Procedures-Rollback.md)** - Crisis management
- **[Load Balancing & Resource Management](../06-Infrastructure/Load-Balancing-Resource-Management.md)** - Infrastructure scaling

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | DevOps Team | Complete container orchestration strategy |
| 4.x | 2025-08-xx | Dev Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: DevOps Team  
**Last Validated**: 2025-09-02