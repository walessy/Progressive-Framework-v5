---
file: docs/06-Infrastructure/Scaling-Performance-Optimization.md
directory: docs/06-Infrastructure/
priority: CRITICAL
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# Scaling & Performance Optimization - Progressive-Framework-v5

**File Path**: `docs/06-Infrastructure/Scaling-Performance-Optimization.md`  
**Directory**: `docs/06-Infrastructure/`  
**Priority**: CRITICAL  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive scaling and performance optimization strategies for Progressive-Framework-v5, covering horizontal and vertical scaling, auto-scaling policies, performance tuning, resource optimization, caching strategies, database optimization, and agent-specific performance considerations for MCA, NPA, and WPA.

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🌐 **[Network Architecture & Security](Network-Architecture-Security.md)** - *Network infrastructure setup*
- 🏗️ **[Load Balancing & Resource Management](Load-Balancing-Resource-Management.md)** - *Load balancing strategies*
- 🐳 **[Container Orchestration](../05-DevOps/Container-Orchestration.md)** - *Kubernetes scaling basics*
- 🤖 **[Agent Architecture](../02-Agent-Management/Agent-Architecture.md)** - *Context agent design*

---

## **SCALING STRATEGY OVERVIEW**

### **Progressive Framework V5 Scaling Architecture**
```
Scaling Dimensions for Progressive-Framework-v5:

                    USER TRAFFIC SCALING
                           │
              ┌────────────┼────────────┐
              │            │            │
         HORIZONTAL    VERTICAL    INTELLIGENT
          SCALING       SCALING      SCALING
              │            │            │
    ┌─────────────────┐ ┌──────────┐ ┌────────────────┐
    │                 │ │          │ │                │
    │ • Load Balancers│ │ • CPU    │ │ • Predictive   │
    │ • Pod Replicas  │ │ • Memory │ │ • Context-Aware│
    │ • Service Mesh  │ │ • Storage│ │ • Agent-Driven │
    │ • Multi-AZ      │ │ • Network│ │ • ML-Based     │
    └─────────────────┘ └──────────┘ └────────────────┘
              │            │            │
         ┌─────────────────────────────────────┐
         │        AGENT COORDINATION           │
         │                                     │
         │  ┌─────────┐ ┌─────────┐ ┌─────────┐│
         │  │   MCA   │ │   NPA   │ │   WPA   ││
         │  │ (Master)│ │(Nutrition)│(Workout)││
         │  │         │ │         │ │         ││
         │  │ Scale   │ │ Scale   │ │ Scale   ││
         │  │Orchestr.│ │Predict. │ │Adapt.   ││
         │  └─────────┘ └─────────┘ └─────────┘│
         └─────────────────────────────────────┘
```

### **Scaling Metrics & Thresholds**
```yaml
# Performance Thresholds Configuration
scaling_metrics:
  web_tier:
    cpu_threshold: 70%
    memory_threshold: 80%
    response_time_threshold: 500ms
    error_rate_threshold: 1%
    requests_per_second_max: 1000
  
  application_tier:
    cpu_threshold: 75%
    memory_threshold: 85%
    agent_coordination_latency: 200ms
    concurrent_agent_sessions: 50
    queue_depth_max: 100
  
  database_tier:
    cpu_threshold: 80%
    memory_threshold: 90%
    connection_pool_utilization: 85%
    query_response_time: 100ms
    disk_io_threshold: 80%
  
  agent_specific:
    mca_coordination_latency: 150ms
    npa_calculation_time: 300ms
    wpa_generation_time: 500ms
    inter_agent_communication: 100ms
```

---

## **HORIZONTAL SCALING IMPLEMENTATION**

### **Kubernetes Horizontal Pod Autoscaler (HPA)**
```yaml
# k8s/autoscaling/web-hpa.yml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: progressive-framework-hpa
  namespace: progressive-framework-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: progressive-framework-v5
  minReplicas: 3
  maxReplicas: 50
  metrics:
  # CPU utilization
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  # Memory utilization
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  # Custom metrics - requests per second
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "100"
  # Response time metric
  - type: Pods
    pods:
      metric:
        name: http_request_duration_seconds
      target:
        type: AverageValue
        averageValue: "500m"
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
      - type: Pods
        value: 2
        periodSeconds: 60
      selectPolicy: Min
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
      - type: Pods
        value: 5
        periodSeconds: 60
      selectPolicy: Max

---
# Agent-specific HPA for MCA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: mca-hpa
  namespace: progressive-framework-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mca
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 75
  # Custom metric for coordination requests
  - type: Pods
    pods:
      metric:
        name: agent_coordination_requests_per_second
      target:
        type: AverageValue
        averageValue: "10"
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 600  # Slower scale down for coordination
      policies:
      - type: Pods
        value: 1
        periodSeconds: 120
    scaleUp:
      stabilizationWindowSeconds: 30   # Faster scale up for coordination
      policies:
      - type: Pods
        value: 3
        periodSeconds: 30

---
# Agent-specific HPA for NPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: npa-hpa
  namespace: progressive-framework-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: npa
  minReplicas: 2
  maxReplicas: 15
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Pods
    pods:
      metric:
        name: nutrition_calculations_per_minute
      target:
        type: AverageValue
        averageValue: "20"

---
# Agent-specific HPA for WPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: wpa-hpa
  namespace: progressive-framework-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: wpa
  minReplicas: 2
  maxReplicas: 15
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Pods
    pods:
      metric:
        name: workout_generations_per_minute
      target:
        type: AverageValue
        averageValue: "15"
```

### **Cluster Autoscaler Configuration**
```yaml
# k8s/autoscaling/cluster-autoscaler.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cluster-autoscaler
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cluster-autoscaler
  template:
    metadata:
      labels:
        app: cluster-autoscaler
    spec:
      serviceAccountName: cluster-autoscaler
      containers:
      - image: k8s.gcr.io/autoscaling/cluster-autoscaler:v1.27.3
        name: cluster-autoscaler
        command:
        - ./cluster-autoscaler
        - --v=4
        - --stderrthreshold=info
        - --cloud-provider=aws
        - --skip-nodes-with-local-storage=false
        - --expander=least-waste
        - --node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/progressive-framework-v5
        - --balance-similar-node-groups
        - --scale-down-enabled=true
        - --scale-down-delay-after-add=10m
        - --scale-down-unneeded-time=10m
        - --scale-down-utilization-threshold=0.5
        - --max-node-provision-time=15m
        - --max-empty-bulk-delete=10
        - --max-graceful-termination-sec=600
        env:
        - name: AWS_REGION
          value: us-east-1
        resources:
          limits:
            cpu: 100m
            memory: 300Mi
          requests:
            cpu: 100m
            memory: 300Mi
```

### **Multi-Zone Scaling Strategy**
```yaml
# terraform/aws/autoscaling-groups.tf
# Web tier auto scaling group
resource "aws_autoscaling_group" "web_tier_asg" {
  name                = "progressive-framework-v5-web-${var.environment}"
  vpc_zone_identifier = [
    aws_subnet.public_subnet_az1.id,
    aws_subnet.public_subnet_az2.id,
    aws_subnet.public_subnet_az3.id
  ]
  
  min_size                = 3
  max_size                = 30
  desired_capacity        = 6
  health_check_type       = "ELB"
  health_check_grace_period = 300
  
  launch_template {
    id      = aws_launch_template.web_tier_template.id
    version = "$Latest"
  }
  
  # Scaling policies
  target_group_arns = [aws_lb_target_group.web_tg.arn]
  
  # Distribute across availability zones
  availability_zones = [
    "${var.aws_region}a",
    "${var.aws_region}b", 
    "${var.aws_region}c"
  ]
  
  # Instance refresh for zero-downtime updates
  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 50
      instance_warmup        = 300
    }
    triggers = ["tag"]
  }
  
  tag {
    key                 = "Name"
    value               = "progressive-framework-v5-web"
    propagate_at_launch = true
  }
  
  tag {
    key                 = "Environment"
    value               = var.environment
    propagate_at_launch = true
  }
  
  tag {
    key                 = "Tier"
    value               = "web"
    propagate_at_launch = true
  }
}

# Application tier auto scaling group
resource "aws_autoscaling_group" "app_tier_asg" {
  name                = "progressive-framework-v5-app-${var.environment}"
  vpc_zone_identifier = [
    aws_subnet.private_app_subnet_az1.id,
    aws_subnet.private_app_subnet_az2.id,
    aws_subnet.private_app_subnet_az3.id
  ]
  
  min_size                = 4  # Higher minimum for agent coordination
  max_size                = 50
  desired_capacity        = 8
  health_check_type       = "ELB"
  health_check_grace_period = 300
  
  launch_template {
    id      = aws_launch_template.app_tier_template.id
    version = "$Latest"
  }
  
  target_group_arns = [
    aws_lb_target_group.app_tg.arn,
    aws_lb_target_group.agents_tg.arn
  ]
  
  # Enhanced instance refresh for agents
  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 70  # Higher for agent continuity
      instance_warmup        = 600  # Longer warmup for agent initialization
    }
  }
  
  tag {
    key                 = "Name"
    value               = "progressive-framework-v5-app"
    propagate_at_launch = true
  }
  
  tag {
    key                 = "Tier"
    value               = "application"
    propagate_at_launch = true
  }
  
  tag {
    key                 = "AgentCapable"
    value               = "true"
    propagate_at_launch = true
  }
}

# Scaling policies
resource "aws_autoscaling_policy" "web_scale_up" {
  name                   = "web-scale-up"
  scaling_adjustment     = 2
  adjustment_type        = "ChangeInCapacity"
  cooldown              = 300
  autoscaling_group_name = aws_autoscaling_group.web_tier_asg.name
}

resource "aws_autoscaling_policy" "web_scale_down" {
  name                   = "web-scale-down"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown              = 600
  autoscaling_group_name = aws_autoscaling_group.web_tier_asg.name
}

resource "aws_autoscaling_policy" "app_scale_up" {
  name                   = "app-scale-up"
  scaling_adjustment     = 3  # More aggressive for agent workloads
  adjustment_type        = "ChangeInCapacity"
  cooldown              = 180  # Faster response for agents
  autoscaling_group_name = aws_autoscaling_group.app_tier_asg.name
}

resource "aws_autoscaling_policy" "app_scale_down" {
  name                   = "app-scale-down"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown              = 900  # Slower scale down for agent continuity
  autoscaling_group_name = aws_autoscaling_group.app_tier_asg.name
}
```

---

## **VERTICAL SCALING & RESOURCE OPTIMIZATION**

### **Resource Allocation Strategy**
```yaml
# k8s/resources/resource-optimization.yml
# Main application resource optimization
apiVersion: apps/v1
kind: Deployment
metadata:
  name: progressive-framework-v5
  namespace: progressive-framework-prod
spec:
  replicas: 6
  selector:
    matchLabels:
      app: progressive-framework-v5
  template:
    metadata:
      labels:
        app: progressive-framework-v5
    spec:
      containers:
      - name: progressive-framework
        image: progressive-framework-v5:latest
        ports:
        - containerPort: 3000
        
        # Optimized resource allocation
        resources:
          requests:
            cpu: "500m"      # 0.5 CPU cores
            memory: "1Gi"    # 1GB RAM
          limits:
            cpu: "2000m"     # 2 CPU cores max
            memory: "4Gi"    # 4GB RAM max
        
        # Quality of Service
        # This configuration ensures "Burstable" QoS class
        
        env:
        - name: NODE_ENV
          value: "production"
        - name: MEMORY_LIMIT
          valueFrom:
            resourceFieldRef:
              resource: limits.memory
        - name: CPU_LIMIT
          valueFrom:
            resourceFieldRef:
              resource: limits.cpu
        
        # Health checks
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
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
          successThreshold: 1

---
# MCA Resource Optimization
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mca
  namespace: progressive-framework-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mca
      tier: agents
  template:
    metadata:
      labels:
        app: mca
        tier: agents
    spec:
      containers:
      - name: mca
        image: mca:latest
        ports:
        - containerPort: 8000
        
        resources:
          requests:
            cpu: "300m"      # Lower base for coordination
            memory: "512Mi"  # 512MB for coordination logic
          limits:
            cpu: "1500m"     # Burst capacity for coordination
            memory: "2Gi"    # 2GB max for complex coordination
        
        env:
        - name: AGENT_TYPE
          value: "MCA"
        - name: COORDINATION_MODE
          value: "active"
        - name: MAX_CONCURRENT_AGENTS
          value: "50"
        
        # Enhanced health checks for coordination
        livenessProbe:
          httpGet:
            path: /health/coordination
            port: 8000
          initialDelaySeconds: 45
          periodSeconds: 20
          timeoutSeconds: 8
        
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 20
          periodSeconds: 10
          timeoutSeconds: 5

---
# NPA Resource Optimization
apiVersion: apps/v1
kind: Deployment
metadata:
  name: npa
  namespace: progressive-framework-prod
spec:
  replicas: 2
  selector:
    matchLabels:
      app: npa
      tier: agents
  template:
    metadata:
      labels:
        app: npa
        tier: agents
    spec:
      containers:
      - name: npa
        image: npa:latest
        ports:
        - containerPort: 8000
        
        resources:
          requests:
            cpu: "400m"      # Higher for nutrition calculations
            memory: "768Mi"  # More memory for nutrition data
          limits:
            cpu: "2000m"     # High burst for complex calculations
            memory: "3Gi"    # 3GB for nutrition databases
        
        env:
        - name: AGENT_TYPE
          value: "NPA"
        - name: NUTRITION_DB_CACHE_SIZE
          value: "256MB"
        - name: CALCULATION_TIMEOUT
          value: "30s"
        
        # Volume for nutrition database cache
        volumeMounts:
        - name: nutrition-cache
          mountPath: /app/cache/nutrition
        
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 25
        
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 15
          periodSeconds: 10
      
      volumes:
      - name: nutrition-cache
        emptyDir:
          sizeLimit: 1Gi

---
# WPA Resource Optimization
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wpa
  namespace: progressive-framework-prod
spec:
  replicas: 2
  selector:
    matchLabels:
      app: wpa
      tier: agents
  template:
    metadata:
      labels:
        app: wpa
        tier: agents
    spec:
      containers:
      - name: wpa
        image: wpa:latest
        ports:
        - containerPort: 8000
        
        resources:
          requests:
            cpu: "350m"      # Moderate for workout generation
            memory: "640Mi"  # Workout templates and logic
          limits:
            cpu: "1800m"     # Burst for complex workout generation
            memory: "2.5Gi"  # 2.5GB for exercise databases
        
        env:
        - name: AGENT_TYPE
          value: "WPA"
        - name: WORKOUT_TEMPLATE_CACHE
          value: "128MB"
        - name: GENERATION_TIMEOUT
          value: "45s"
        
        volumeMounts:
        - name: workout-cache
          mountPath: /app/cache/workouts
        
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 30
        
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 15
          periodSeconds: 10
      
      volumes:
      - name: workout-cache
        emptyDir:
          sizeLimit: 512Mi
```

### **Vertical Pod Autoscaler (VPA)**
```yaml
# k8s/autoscaling/vpa-configs.yml
# VPA for main application
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: progressive-framework-vpa
  namespace: progressive-framework-prod
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: progressive-framework-v5
  
  updatePolicy:
    updateMode: "Auto"  # Automatically apply recommendations
  
  resourcePolicy:
    containerPolicies:
    - containerName: progressive-framework
      minAllowed:
        cpu: 200m
        memory: 256Mi
      maxAllowed:
        cpu: 4000m
        memory: 8Gi
      controlledResources: ["cpu", "memory"]
      controlledValues: RequestsAndLimits

---
# VPA for MCA with coordination-specific tuning
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: mca-vpa
  namespace: progressive-framework-prod
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: mca
  
  updatePolicy:
    updateMode: "Off"  # Recommendation mode only for critical coordination
  
  resourcePolicy:
    containerPolicies:
    - containerName: mca
      minAllowed:
        cpu: 100m
        memory: 256Mi
      maxAllowed:
        cpu: 2000m
        memory: 4Gi
      controlledResources: ["cpu", "memory"]

---
# VPA for NPA with nutrition calculation focus
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: npa-vpa
  namespace: progressive-framework-prod
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: npa
  
  updatePolicy:
    updateMode: "Auto"
  
  resourcePolicy:
    containerPolicies:
    - containerName: npa
      minAllowed:
        cpu: 200m
        memory: 384Mi
      maxAllowed:
        cpu: 3000m
        memory: 6Gi
      controlledResources: ["cpu", "memory"]

---
# VPA for WPA with workout generation focus
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: wpa-vpa
  namespace: progressive-framework-prod
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: wpa
  
  updatePolicy:
    updateMode: "Auto"
  
  resourcePolicy:
    containerPolicies:
    - containerName: wpa
      minAllowed:
        cpu: 150m
        memory: 320Mi
      maxAllowed:
        cpu: 2500m
        memory: 5Gi
      controlledResources: ["cpu", "memory"]
```

---

## **CACHING & PERFORMANCE OPTIMIZATION**

### **Multi-Layer Caching Strategy**
```yaml
# k8s/caching/redis-cluster.yml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis-cluster
  namespace: progressive-framework-prod
spec:
  serviceName: redis-cluster-service
  replicas: 6
  selector:
    matchLabels:
      app: redis-cluster
  template:
    metadata:
      labels:
        app: redis-cluster
    spec:
      containers:
      - name: redis
        image: redis:7.0.12-alpine
        ports:
        - containerPort: 6379
          name: client
        - containerPort: 16379
          name: gossip
        
        resources:
          requests:
            cpu: 200m
            memory: 1Gi
          limits:
            cpu: 1000m
            memory: 4Gi
        
        command:
        - redis-server
        args:
        - /etc/redis/redis.conf
        - --cluster-enabled
        - yes
        - --cluster-config-file
        - /data/nodes.conf
        - --cluster-node-timeout
        - "5000"
        - --appendonly
        - yes
        - --appendfsync
        - everysec
        - --maxmemory
        - 3gb
        - --maxmemory-policy
        - allkeys-lru
        
        volumeMounts:
        - name: redis-data
          mountPath: /data
        - name: redis-config
          mountPath: /etc/redis/redis.conf
          subPath: redis.conf
        
        # Health checks
        livenessProbe:
          exec:
            command:
            - redis-cli
            - ping
          initialDelaySeconds: 30
          timeoutSeconds: 5
          periodSeconds: 30
        
        readinessProbe:
          exec:
            command:
            - redis-cli
            - ping
          initialDelaySeconds: 5
          timeoutSeconds: 1
          periodSeconds: 5
      
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
          storage: 20Gi

---
# Redis configuration optimized for Progressive Framework
apiVersion: v1
kind: ConfigMap
metadata:
  name: redis-config
  namespace: progressive-framework-prod
data:
  redis.conf: |
    # Progressive Framework V5 Redis Configuration
    
    # Memory optimization
    maxmemory 3gb
    maxmemory-policy allkeys-lru
    
    # Persistence
    save 900 1
    save 300 10
    save 60 10000
    
    # Network
    timeout 0
    tcp-keepalive 300
    tcp-backlog 511
    
    # Cluster configuration
    cluster-enabled yes
    cluster-config-file nodes.conf
    cluster-node-timeout 5000
    
    # Performance tuning
    hash-max-ziplist-entries 512
    hash-max-ziplist-value 64
    list-max-ziplist-size -2
    set-max-intset-entries 512
    zset-max-ziplist-entries 128
    zset-max-ziplist-value 64
    
    # Agent-specific optimizations
    # Increase client output buffer for agent coordination
    client-output-buffer-limit normal 0 0 0
    client-output-buffer-limit replica 256mb 64mb 60
    client-output-buffer-limit pubsub 32mb 8mb 60
    
    # Enable keyspace notifications for agent coordination
    notify-keyspace-events Ex
```

### **Application-Level Caching Configuration**
```javascript
// src/cache/cache-manager.js
class CacheManager {
  constructor() {
    this.redisCluster = require('ioredis').Cluster([
      { host: 'redis-cluster-0.redis-cluster-service', port: 6379 },
      { host: 'redis-cluster-1.redis-cluster-service', port: 6379 },
      { host: 'redis-cluster-2.redis-cluster-service', port: 6379 }
    ], {
      redisOptions: {
        password: process.env.REDIS_PASSWORD
      },
      enableReadyCheck: true,
      maxRetriesPerRequest: 3
    });

    this.localCache = new NodeCache({
      stdTTL: 300,     // 5 minutes default TTL
      checkperiod: 60, // Check for expired keys every minute
      useClones: false,
      maxKeys: 10000
    });

    this.setupCacheStrategies();
  }

  setupCacheStrategies() {
    this.strategies = {
      // User session cache - short TTL, high consistency
      userSession: {
        ttl: 1800,        // 30 minutes
        useLocal: false,   // Redis only for session consistency
        invalidateOn: ['logout', 'profile_update']
      },

      // Agent coordination cache - very short TTL, eventual consistency OK
      agentCoordination: {
        ttl: 60,          // 1 minute
        useLocal: true,   // Local cache for speed
        invalidateOn: ['agent_state_change', 'coordination_update']
      },

      // Nutrition data cache - longer TTL, can be stale
      nutritionData: {
        ttl: 3600,        // 1 hour
        useLocal: true,   // Local cache preferred
        invalidateOn: ['nutrition_db_update']
      },

      // Workout templates - very long TTL, rarely changes
      workoutTemplates: {
        ttl: 86400,       // 24 hours
        useLocal: true,   // Definitely local cache
        invalidateOn: ['workout_template_update']
      },

      // API response cache - medium TTL, varies by endpoint
      apiResponse: {
        ttl: 300,         // 5 minutes
        useLocal: false,  // Redis for consistency across instances
        invalidateOn: ['data_update']
      }
    };
  }

  async get(key, strategy = 'default') {
    const cacheStrategy = this.strategies[strategy] || this.strategies.apiResponse;
    
    // Try local cache first if enabled
    if (cacheStrategy.useLocal) {
      const localValue = this.localCache.get(key);
      if (localValue !== undefined) {
        return localValue;
      }
    }

    // Fallback to Redis
    try {
      const value = await this.redisCluster.get(key);
      if (value) {
        const parsed = JSON.parse(value);
        
        // Update local cache if strategy allows
        if (cacheStrategy.useLocal) {
          this.localCache.set(key, parsed, cacheStrategy.ttl);
        }
        
        return parsed;
      }
    } catch (error) {
      console.error('Redis cache error:', error);
      // Continue without cache on Redis failure
    }
    
    return null;
  }

  async set(key, value, strategy = 'default') {
    const cacheStrategy = this.strategies[strategy] || this.strategies.apiResponse;
    const serialized = JSON.stringify(value);
    
    // Set in Redis
    try {
      await this.redisCluster.setex(key, cacheStrategy.ttl, serialized);
    } catch (error) {
      console.error('Redis cache set error:', error);
    }
    
    // Set in local cache if enabled
    if (cacheStrategy.useLocal) {
      this.localCache.set(key, value, cacheStrategy.ttl);
    }
  }

  async invalidate(key, strategy = 'default') {
    // Remove from local cache
    this.localCache.del(key);
    
    // Remove from Redis
    try {
      await this.redisCluster.del(key);
    } catch (error) {
      console.error('Redis cache invalidation error:', error);
    }
  }

  // Agent-specific cache methods
  async cacheAgentCoordination(agentId, coordinationData) {
    const key = `agent:coordination:${agentId}`;
    await this.set(key, coordinationData, 'agentCoordination');
  }

  async getAgentCoordination(agentId) {
    const key = `agent:coordination:${agentId}`;
    return await this.get(key, 'agentCoordination');
  }

  async cacheNutritionData(userId, nutritionPlan) {
    const key = `nutrition:plan:${userId}`;
    await this.set(key, nutritionPlan, 'nutritionData');
  }

  async getNutritionData(userId) {
    const key = `nutrition:plan:${userId}`;
    return await this.get(key, 'nutritionData');
  }

  async cacheWorkoutTemplate(templateId, template) {
    const key = `workout:template:${templateId}`;
    await this.set(key, template, 'workoutTemplates');
  }

  async getWorkoutTemplate(templateId) {
    const key = `workout:template:${templateId}`;
    return await this.get(key, 'workoutTemplates');
  }
}

module.exports = CacheManager;
```

### **CDN Configuration for Static Assets**
```yaml
# terraform/aws/cloudfront.tf
resource "aws_cloudfront_distribution" "progressive_framework_cdn" {
  comment             = "Progressive Framework V5 CDN"
  default_root_object = "index.html"
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = "PriceClass_All"
  
  # S3 origin for static assets
  origin {
    domain_name = aws_s3_bucket.static_assets.bucket_regional_domain_name
    origin_id   = "S3-progressive-framework-static"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.static_oai.cloudfront_access_identity_path
    }
  }
  
  # ALB origin for dynamic content
  origin {
    domain_name = aws_lb.application_load_balancer.dns_name
    origin_id   = "ALB-progressive-framework-dynamic"
    
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }
  
  # Static assets cache behavior (long TTL)
  default_cache_behavior {
    target_origin_id       = "S3-progressive-framework-static"
    viewer_protocol_policy = "redirect-to-https"
    compress              = true
    
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    # Long cache for static assets
    min_ttl     = 0
    default_ttl = 86400      # 24 hours
    max_ttl     = 31536000   # 1 year
  }
  
  # API cache behavior (short TTL)
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    target_origin_id = "ALB-progressive-framework-dynamic"
    
    viewer_protocol_policy = "https-only"
    compress              = true
    
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    
    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Host"]
      cookies {
        forward = "all"
      }
    }
    
    # Short cache for API responses
    min_ttl     = 0
    default_ttl = 300       # 5 minutes
    max_ttl     = 3600      # 1 hour
  }
  
  # Agent API cache behavior (very short TTL)
  ordered_cache_behavior {
    path_pattern     = "/api/v1/agents/*"
    target_origin_id = "ALB-progressive-framework-dynamic"
    
    viewer_protocol_policy = "https-only"
    compress              = true
    
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    
    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Host", "User-Agent"]
      cookies {
        forward = "all"
      }
    }
    
    # Very short cache for agent responses
    min_ttl     = 0
    default_ttl = 60        # 1 minute
    max_ttl     = 300       # 5 minutes
  }
  
  # Geographic restrictions
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  # SSL/TLS configuration
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.progressive_framework_cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
  
  tags = {
    Name        = "progressive-framework-v5-cdn"
    Environment = var.environment
    Service     = "cdn"
  }
}
```

---

## **DATABASE OPTIMIZATION**

### **PostgreSQL Optimization for Progressive Framework**
```sql
-- postgresql/optimization/performance-tuning.sql

-- Progressive Framework V5 PostgreSQL Performance Optimization

-- Connection and Memory Settings
ALTER SYSTEM SET shared_buffers = '8GB';                    -- 25% of total RAM
ALTER SYSTEM SET effective_cache_size = '24GB';             -- 75% of total RAM  
ALTER SYSTEM SET maintenance_work_mem = '2GB';              -- For maintenance operations
ALTER SYSTEM SET work_mem = '256MB';                        -- Per query operation
ALTER SYSTEM SET wal_buffers = '64MB';                      -- WAL buffer size
ALTER SYSTEM SET checkpoint_completion_target = 0.9;        -- Spread checkpoints
ALTER SYSTEM SET max_connections = 200;                     -- Limit connections

-- Query Performance
ALTER SYSTEM SET random_page_cost = 1.1;                    -- SSD optimization
ALTER SYSTEM SET seq_page_cost = 1.0;                       -- Sequential scan cost
ALTER SYSTEM SET effective_io_concurrency = 200;            -- SSD concurrent I/O
ALTER SYSTEM SET max_worker_processes = 16;                 -- Background processes
ALTER SYSTEM SET max_parallel_workers_per_gather = 4;       -- Parallel queries
ALTER SYSTEM SET max_parallel_workers = 16;                 -- Total parallel workers
ALTER SYSTEM SET max_parallel_maintenance_workers = 4;      -- Parallel maintenance

-- WAL and Replication
ALTER SYSTEM SET wal_level = 'replica';                     -- Enable replication
ALTER SYSTEM SET archive_mode = 'on';                       -- Enable archiving
ALTER SYSTEM SET archive_command = 'aws s3 cp %p s3://progressive-framework-wal-backup/%f';
ALTER SYSTEM SET max_wal_senders = 3;                       -- Replication slots
ALTER SYSTEM SET wal_keep_segments = 64;                    -- Keep WAL segments

-- Monitoring and Logging
ALTER SYSTEM SET log_min_duration_statement = 1000;         -- Log slow queries (1s+)
ALTER SYSTEM SET log_checkpoints = 'on';                    -- Log checkpoints
ALTER SYSTEM SET log_connections = 'on';                    -- Log connections
ALTER SYSTEM SET log_disconnections = 'on';                 -- Log disconnections
ALTER SYSTEM SET log_lock_waits = 'on';                     -- Log lock waits
ALTER SYSTEM SET log_statement = 'ddl';                     -- Log DDL statements

-- Auto-vacuum tuning
ALTER SYSTEM SET autovacuum_max_workers = 6;                -- Parallel vacuum workers
ALTER SYSTEM SET autovacuum_vacuum_cost_limit = 2000;       -- Higher vacuum rate
ALTER SYSTEM SET autovacuum_vacuum_scale_factor = 0.1;      -- More frequent vacuum
ALTER SYSTEM SET autovacuum_analyze_scale_factor = 0.05;    -- More frequent analyze

-- Apply configuration
SELECT pg_reload_conf();

-- Create indexes for Progressive Framework specific queries
-- User and session indexes
CREATE INDEX CONCURRENTLY idx_users_active ON users(id, active) WHERE active = true;
CREATE INDEX CONCURRENTLY idx_user_sessions_active ON user_sessions(user_id, expires_at) WHERE expires_at > NOW();

-- Agent coordination indexes
CREATE INDEX CONCURRENTLY idx_agent_states_active ON agent_states(agent_id, status, updated_at) WHERE status = 'active';
CREATE INDEX CONCURRENTLY idx_agent_coordination_recent ON agent_coordination(agent_id, created_at DESC) WHERE created_at > NOW() - INTERVAL '1 hour';

-- Nutrition planning indexes  
CREATE INDEX CONCURRENTLY idx_nutrition_plans_user ON nutrition_plans(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_nutrition_foods_search ON nutrition_foods USING GIN(to_tsvector('english', name));

-- Workout planning indexes
CREATE INDEX CONCURRENTLY idx_workout_plans_user ON workout_plans(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_exercises_muscle_group ON exercises(primary_muscle_group, difficulty_level);

-- Performance monitoring views
CREATE OR REPLACE VIEW v_slow_queries AS
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    min_time,
    max_time,
    stddev_time,
    rows
FROM pg_stat_statements 
WHERE mean_time > 100  -- Queries averaging over 100ms
ORDER BY mean_time DESC;

CREATE OR REPLACE VIEW v_table_bloat AS
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS bloat_size
FROM pg_tables 
WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Partitioning for large tables (agent logs, user activity)
CREATE TABLE agent_logs_master (
    id BIGSERIAL,
    agent_id VARCHAR(50) NOT NULL,
    log_level VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE agent_logs_2025_09 PARTITION OF agent_logs_master
FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');

CREATE TABLE agent_logs_2025_10 PARTITION OF agent_logs_master  
FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

-- Function to automatically create future partitions
CREATE OR REPLACE FUNCTION create_monthly_partition(table_name TEXT, start_date DATE)
RETURNS VOID AS $$
DECLARE
    partition_name TEXT;
    end_date DATE;
BEGIN
    partition_name := table_name || '_' || to_char(start_date, 'YYYY_MM');
    end_date := start_date + INTERVAL '1 month';
    
    EXECUTE format('CREATE TABLE %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
                   partition_name, table_name, start_date, end_date);
                   
    EXECUTE format('CREATE INDEX idx_%I_created_at ON %I (created_at)', 
                   partition_name, partition_name);
END;
$$ LANGUAGE plpgsql;
```

### **Redis Cluster Optimization**
```bash
#!/bin/bash
# scripts/redis-optimization.sh

echo "🔧 Optimizing Redis Cluster for Progressive Framework V5..."

# Redis configuration optimization
cat > /tmp/redis-optimization.conf << 'EOF'
# Progressive Framework V5 Redis Optimization

# Memory Management
maxmemory-policy allkeys-lru
lazyfree-lazy-eviction yes
lazyfree-lazy-expire yes
lazyfree-lazy-server-del yes

# Performance Tuning
tcp-keepalive 300
timeout 0
tcp-backlog 511

# Disable potentially expensive commands in production
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command DEBUG ""
rename-command SHUTDOWN ""

# Enable keyspace notifications for agent coordination
notify-keyspace-events "Ex"

# Client output buffer limits
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60  
client-output-buffer-limit pubsub 32mb 8mb 60

# Slow log configuration
slowlog-log-slower-than 10000  # 10ms
slowlog-max-len 128

# Hash optimization for small objects
hash-max-ziplist-entries 512
hash-max-ziplist-value 64

# List optimization
list-max-ziplist-size -2
list-compress-depth 0

# Set optimization
set-max-intset-entries 512

# Sorted set optimization  
zset-max-ziplist-entries 128
zset-max-ziplist-value 64

# HyperLogLog optimization
hll-sparse-max-bytes 3000
EOF

# Apply Redis optimizations to cluster nodes
for i in {0..5}; do
    echo "Optimizing redis-cluster-$i..."
    kubectl exec redis-cluster-$i -n progressive-framework-prod -- \
        redis-cli CONFIG REWRITE
done

# Monitor Redis performance
kubectl create configmap redis-monitoring-script --from-file=/tmp/monitor-redis.sh -n progressive-framework-prod

cat > /tmp/monitor-redis.sh << 'EOF'
#!/bin/bash
# Redis monitoring script for Progressive Framework V5

while true; do
    echo "=== Redis Cluster Status $(date) ==="
    
    for i in {0..5}; do
        echo "--- Node redis-cluster-$i ---"
        kubectl exec redis-cluster-$i -n progressive-framework-prod -- \
            redis-cli INFO memory | grep "used_memory_human\|used_memory_peak_human\|mem_fragmentation_ratio"
        
        kubectl exec redis-cluster-$i -n progressive-framework-prod -- \
            redis-cli INFO stats | grep "instantaneous_ops_per_sec\|total_connections_received"
            
        # Check slow log
        echo "Recent slow queries:"
        kubectl exec redis-cluster-$i -n progressive-framework-prod -- \
            redis-cli SLOWLOG GET 5
            
        echo ""
    done
    
    sleep 60
done
EOF

chmod +x /tmp/monitor-redis.sh

echo "✅ Redis cluster optimization completed"
```

### **MongoDB Performance Tuning**
```javascript
// mongodb/optimization/performance-config.js
// Progressive Framework V5 MongoDB Performance Configuration

// Connect to MongoDB
use progressive_framework_v5;

// Create optimized indexes for agent data
db.agent_conversations.createIndex(
    { "userId": 1, "agentType": 1, "createdAt": -1 },
    { background: true, name: "idx_user_agent_conversations" }
);

db.agent_coordination.createIndex(
    { "masterId": 1, "status": 1, "updatedAt": -1 },
    { background: true, name: "idx_coordination_active" }
);

db.nutrition_data.createIndex(
    { "userId": 1, "date": -1 },
    { background: true, name: "idx_nutrition_user_date" }
);

db.workout_sessions.createIndex(
    { "userId": 1, "completedAt": -1 },
    { background: true, name: "idx_workout_user_completed" }
);

// Text indexes for search functionality
db.nutrition_foods.createIndex(
    { "name": "text", "description": "text", "tags": "text" },
    { background: true, name: "idx_nutrition_search" }
);

db.exercises.createIndex(
    { "name": "text", "description": "text", "muscleGroups": "text" },
    { background: true, name: "idx_exercise_search" }
);

// Compound indexes for complex queries
db.user_progress.createIndex(
    { "userId": 1, "metricType": 1, "recordedAt": -1 },
    { background: true, name: "idx_progress_tracking" }
);

// Agent communication optimization
db.agent_messages.createIndex(
    { "fromAgent": 1, "toAgent": 1, "timestamp": -1 },
    { background: true, name: "idx_agent_communication" }
);

// TTL index for temporary data
db.agent_sessions.createIndex(
    { "expiresAt": 1 },
    { expireAfterSeconds: 0, background: true, name: "idx_session_ttl" }
);

// Partial indexes for active records only
db.users.createIndex(
    { "email": 1 },
    { 
        background: true, 
        unique: true,
        partialFilterExpression: { "status": "active" },
        name: "idx_active_user_email"
    }
);

// Configure MongoDB for performance
// Enable profiler for slow operations
db.setProfilingLevel(2, { slowms: 100 });

// Set read preference for secondary reads where appropriate
db.getMongo().setReadPref("secondaryPreferred");

print("MongoDB optimization for Progressive Framework V5 completed");
print("Indexes created and profiling enabled for queries > 100ms");
```

---

## **PERFORMANCE MONITORING & OPTIMIZATION**

### **Comprehensive Performance Dashboard**
```yaml
# k8s/monitoring/performance-dashboard.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-performance-dashboard
  namespace: monitoring
data:
  progressive-framework-performance.json: |
    {
      "dashboard": {
        "id": null,
        "title": "Progressive Framework V5 - Performance & Scaling",
        "tags": ["progressive-framework", "performance"],
        "timezone": "browser",
        "panels": [
          {
            "title": "Application Response Time",
            "type": "graph",
            "targets": [
              {
                "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job=\"progressive-framework-v5\"}[5m]))",
                "legendFormat": "95th percentile"
              },
              {
                "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket{job=\"progressive-framework-v5\"}[5m]))",
                "legendFormat": "50th percentile"
              }
            ],
            "yAxes": [
              {
                "label": "Response Time (s)",
                "min": 0
              }
            ]
          },
          {
            "title": "Agent Coordination Performance",
            "type": "graph",
            "targets": [
              {
                "expr": "histogram_quantile(0.95, rate(agent_coordination_duration_seconds_bucket{agent=\"mca\"}[5m]))",
                "legendFormat": "MCA Coordination (95th)"
              },
              {
                "expr": "avg(agent_coordination_active_sessions{agent=\"mca\"})",
                "legendFormat": "Active MCA Sessions"
              }
            ]
          },
          {
            "title": "Database Performance",
            "type": "graph", 
            "targets": [
              {
                "expr": "rate(pg_stat_database_tup_returned{datname=\"progressive_framework_v5\"}[5m])",
                "legendFormat": "PostgreSQL Rows/sec"
              },
              {
                "expr": "redis_connected_clients",
                "legendFormat": "Redis Connected Clients"
              },
              {
                "expr": "mongodb_opcounters_total",
                "legendFormat": "MongoDB Operations/sec"
              }
            ]
          },
          {
            "title": "Auto-scaling Status",
            "type": "graph",
            "targets": [
              {
                "expr": "kube_deployment_status_replicas{deployment=\"progressive-framework-v5\"}",
                "legendFormat": "Main App Replicas"
              },
              {
                "expr": "kube_deployment_status_replicas{deployment=\"mca\"}",
                "legendFormat": "MCA Replicas"
              },
              {
                "expr": "kube_deployment_status_replicas{deployment=\"npa\"}",
                "legendFormat": "NPA Replicas" 
              },
              {
                "expr": "kube_deployment_status_replicas{deployment=\"wpa\"}",
                "legendFormat": "WPA Replicas"
              }
            ]
          },
          {
            "title": "Resource Utilization",
            "type": "graph",
            "targets": [
              {
                "expr": "rate(container_cpu_usage_seconds_total{pod=~\"progressive-framework-v5-.*\"}[5m]) * 100",
                "legendFormat": "CPU Usage %"
              },
              {
                "expr": "container_memory_usage_bytes{pod=~\"progressive-framework-v5-.*\"} / container_spec_memory_limit_bytes{pod=~\"progressive-framework-v5-.*\"} * 100",
                "legendFormat": "Memory Usage %"
              }
            ]
          },
          {
            "title": "Cache Performance",
            "type": "graph",
            "targets": [
              {
                "expr": "rate(redis_keyspace_hits_total[5m]) / (rate(redis_keyspace_hits_total[5m]) + rate(redis_keyspace_misses_total[5m])) * 100",
                "legendFormat": "Redis Hit Rate %"
              },
              {
                "expr": "rate(application_cache_hits_total[5m]) / (rate(application_cache_hits_total[5m]) + rate(application_cache_misses_total[5m])) * 100",
                "legendFormat": "Application Cache Hit Rate %"
              }
            ]
          }
        ],
        "time": {
          "from": "now-1h",
          "to": "now"
        },
        "refresh": "30s"
      }
    }
```

### **Performance Testing & Load Generation**
```javascript
// scripts/performance-testing/load-test.js
const autocannon = require('autocannon');
const WebSocket = require('ws');

class ProgressiveFrameworkLoadTest {
  constructor(config) {
    this.config = {
      baseUrl: config.baseUrl || 'https://your-domain.com',
      agentsUrl: config.agentsUrl || 'https://agents.your-domain.com',
      duration: config.duration || 300, // 5 minutes
      connections: config.connections || 100,
      ...config
    };
    
    this.results = {};
  }

  async runMainAppTest() {
    console.log('🚀 Running main application load test...');
    
    const result = await autocannon({
      url: this.config.baseUrl,
      connections: this.config.connections,
      duration: this.config.duration,
      requests: [
        {
          method: 'GET',
          path: '/health',
          weight: 10
        },
        {
          method: 'GET', 
          path: '/api/v1/users/profile',
          headers: {
            'Authorization': 'Bearer test-token'
          },
          weight: 20
        },
        {
          method: 'POST',
          path: '/api/v1/users/preferences',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            theme: 'dark',
            notifications: true
          }),
          weight: 5
        }
      ]
    });

    this.results.mainApp = result;
    console.log('✅ Main app test completed');
    return result;
  }

  async runAgentLoadTest() {
    console.log('🤖 Running agent coordination load test...');
    
    const mcaTest = autocannon({
      url: this.config.agentsUrl,
      connections: Math.floor(this.config.connections / 3),
      duration: this.config.duration,
      requests: [
        {
          method: 'POST',
          path: '/api/v1/agents/mca/coordinate',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            task: 'coordinate_agents',
            agents: ['npa', 'wpa'],
            priority: 'normal'
          })
        }
      ]
    });

    const npaTest = autocannon({
      url: this.config.agentsUrl,
      connections: Math.floor(this.config.connections / 3), 
      duration: this.config.duration,
      requests: [
        {
          method: 'POST',
          path: '/api/v1/agents/npa/plan',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: 'test-user-123',
            goals: ['weight_loss', 'muscle_gain'],
            preferences: ['vegetarian'],
            duration: 7
          })
        }
      ]
    });

    const wpaTest = autocannon({
      url: this.config.agentsUrl,
      connections: Math.floor(this.config.connections / 3),
      duration: this.config.duration,
      requests: [
        {
          method: 'POST',
          path: '/api/v1/agents/wpa/generate',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: 'test-user-123',
            fitnessLevel: 'intermediate',
            equipment: ['dumbbells', 'resistance_bands'],
            duration: 45
          })
        }
      ]
    });

    const [mcaResult, npaResult, wpaResult] = await Promise.all([
      mcaTest, npaTest, wpaTest
    ]);

    this.results.agents = {
      mca: mcaResult,
      npa: npaResult,
      wpa: wpaResult
    };

    console.log('✅ Agent load tests completed');
    return this.results.agents;
  }

  async runWebSocketLoadTest() {
    console.log('🔌 Running WebSocket load test for real-time features...');
    
    const connections = [];
    const messagesSent = [];
    const messagesReceived = [];
    const connectionsCount = Math.min(this.config.connections, 50); // Limit WS connections

    for (let i = 0; i < connectionsCount; i++) {
      const ws = new WebSocket(`wss://your-domain.com/ws?token=test-token-${i}`);
      
      ws.on('open', () => {
        connections.push(ws);
        
        // Send periodic messages
        const interval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            const message = {
              type: 'agent_status_request',
              timestamp: Date.now(),
              connectionId: i
            };
            ws.send(JSON.stringify(message));
            messagesSent.push(message);
          }
        }, 5000); // Every 5 seconds

        setTimeout(() => {
          clearInterval(interval);
          ws.close();
        }, this.config.duration * 1000);
      });

      ws.on('message', (data) => {
        messagesReceived.push(JSON.parse(data.toString()));
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for connection ${i}:`, error);
      });
    }

    // Wait for test duration
    await new Promise(resolve => setTimeout(resolve, this.config.duration * 1000));

    this.results.websocket = {
      connections: connections.length,
      messagesSent: messagesSent.length,
      messagesReceived: messagesReceived.length,
      avgLatency: this.calculateWebSocketLatency(messagesSent, messagesReceived)
    };

    console.log('✅ WebSocket load test completed');
    return this.results.websocket;
  }

  calculateWebSocketLatency(sent, received) {
    const latencies = [];
    
    received.forEach(receivedMsg => {
      if (receivedMsg.originalTimestamp) {
        latencies.push(receivedMsg.timestamp - receivedMsg.originalTimestamp);
      }
    });

    return latencies.length > 0 
      ? latencies.reduce((a, b) => a + b, 0) / latencies.length
      : 0;
  }

  async runFullLoadTest() {
    console.log('🎯 Starting comprehensive load test for Progressive Framework V5...');
    
    const startTime = Date.now();
    
    // Run tests in parallel
    const [mainAppResult, agentResults, wsResults] = await Promise.all([
      this.runMainAppTest(),
      this.runAgentLoadTest(), 
      this.runWebSocketLoadTest()
    ]);

    const totalTime = Date.now() - startTime;

    // Generate comprehensive report
    const report = {
      testDuration: totalTime,
      timestamp: new Date().toISOString(),
      configuration: this.config,
      results: {
        mainApplication: {
          totalRequests: mainAppResult.requests.total,
          requestsPerSecond: mainAppResult.requests.average,
          latency: {
            avg: mainAppResult.latency.average,
            p95: mainAppResult.latency.p95,
            p99: mainAppResult.latency.p99
          },
          throughput: mainAppResult.throughput.average,
          errors: mainAppResult.errors
        },
        agents: {
          mca: {
            totalRequests: agentResults.mca.requests.total,
            requestsPerSecond: agentResults.mca.requests.average,
            avgLatency: agentResults.mca.latency.average,
            errors: agentResults.mca.errors
          },
          npa: {
            totalRequests: agentResults.npa.requests.total,
            requestsPerSecond: agentResults.npa.requests.average,
            avgLatency: agentResults.npa.latency.average,
            errors: agentResults.npa.errors
          },
          wpa: {
            totalRequests: agentResults.wpa.requests.total,
            requestsPerSecond: agentResults.wpa.requests.average,
            avgLatency: agentResults.wpa.latency.average,
            errors: agentResults.wpa.errors
          }
        },
        websocket: wsResults
      }
    };

    console.log('📊 Load test completed! Generating report...');
    this.generateReport(report);
    
    return report;
  }

  generateReport(report) {
    const reportFile = `load-test-report-${Date.now()}.json`;
    require('fs').writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`
🎯 PROGRESSIVE FRAMEWORK V5 LOAD TEST REPORT
============================================

📊 Test Configuration:
   Duration: ${this.config.duration}s
   Connections: ${this.config.connections}
   Base URL: ${this.config.baseUrl}

🚀 Main Application Performance:
   Requests/sec: ${report.results.mainApplication.requestsPerSecond}
   Avg Latency: ${report.results.mainApplication.latency.avg}ms
   95th Percentile: ${report.results.mainApplication.latency.p95}ms
   Total Requests: ${report.results.mainApplication.totalRequests}
   Errors: ${report.results.mainApplication.errors}

🤖 Agent Performance:
   MCA - RPS: ${report.results.agents.mca.requestsPerSecond} | Latency: ${report.results.agents.mca.avgLatency}ms
   NPA - RPS: ${report.results.agents.npa.requestsPerSecond} | Latency: ${report.results.agents.npa.avgLatency}ms  
   WPA - RPS: ${report.results.agents.wpa.requestsPerSecond} | Latency: ${report.results.agents.wpa.avgLatency}ms

🔌 WebSocket Performance:
   Concurrent Connections: ${report.results.websocket.connections}
   Messages Sent: ${report.results.websocket.messagesSent}
   Messages Received: ${report.results.websocket.messagesReceived}
   Avg Latency: ${report.results.websocket.avgLatency}ms

📄 Full report saved to: ${reportFile}
    `);
  }
}

// Usage example
if (require.main === module) {
  const loadTest = new ProgressiveFrameworkLoadTest({
    baseUrl: process.env.BASE_URL || 'https://your-domain.com',
    agentsUrl: process.env.AGENTS_URL || 'https://agents.your-domain.com',
    duration: parseInt(process.env.DURATION) || 300,
    connections: parseInt(process.env.CONNECTIONS) || 100
  });

  loadTest.runFullLoadTest()
    .then(report => {
      console.log('✅ Load test completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Load test failed:', error);
      process.exit(1);
    });
}

module.exports = ProgressiveFrameworkLoadTest;
```

---

## **ADVANCED SCALING STRATEGIES**

### **Predictive Auto-Scaling with Machine Learning**
```python
# scripts/ml-autoscaling/predictive-scaling.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from kubernetes import client, config
import joblib
import logging
from datetime import datetime, timedelta

class PredictiveAutoScaler:
    def __init__(self, namespace='progressive-framework-prod'):
        self.namespace = namespace
        self.models = {}
        self.scalers = {}
        
        # Initialize Kubernetes client
        config.load_incluster_config()
        self.k8s_apps = client.AppsV1Api()
        self.k8s_metrics = client.CustomObjectsApi()
        
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def collect_metrics(self, hours_back=24):
        """Collect historical metrics for training"""
        
        # This would typically connect to your monitoring system
        # For demo purposes, showing the structure
        metrics_data = {
            'timestamp': [],
            'cpu_usage': [],
            'memory_usage': [],
            'request_rate': [],
            'response_time': [],
            'agent_coordination_rate': [],
            'current_replicas': [],
            'day_of_week': [],
            'hour_of_day': []
        }
        
        # Collect metrics from Prometheus/Grafana
        # This is a simplified example
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=hours_back)
        
        # Query your metrics store (Prometheus, CloudWatch, etc.)
        # metrics_data = self.query_prometheus_metrics(start_time, end_time)
        
        return pd.DataFrame(metrics_data)

    def prepare_features(self, df):
        """Prepare features for ML model"""
        
        # Time-based features
        df['hour_sin'] = np.sin(2 * np.pi * df['hour_of_day'] / 24)
        df['hour_cos'] = np.cos(2 * np.pi * df['hour_of_day'] / 24)
        df['day_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
        df['day_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
        
        # Rolling averages
        df['cpu_usage_rolling'] = df['cpu_usage'].rolling(window=12).mean()
        df['request_rate_rolling'] = df['request_rate'].rolling(window=6).mean()
        
        # Lag features
        df['cpu_usage_lag1'] = df['cpu_usage'].shift(1)
        df['request_rate_lag1'] = df['request_rate'].shift(1)
        
        # Progressive Framework specific features
        df['agent_load_ratio'] = df['agent_coordination_rate'] / df['request_rate']
        df['performance_score'] = 1 / (df['response_time'] * df['cpu_usage'])
        
        return df.dropna()

    def train_models(self):
        """Train predictive models for each service"""
        
        services = ['progressive-framework-v5', 'mca', 'npa', 'wpa']
        
        for service in services:
            self.logger.info(f"Training model for {service}")
            
            # Collect training data
            df = self.collect_metrics()
            df = self.prepare_features(df)
            
            # Features for prediction
            feature_columns = [
                'cpu_usage', 'memory_usage', 'request_rate', 'response_time',
                'agent_coordination_rate', 'hour_sin', 'hour_cos', 
                'day_sin', 'day_cos', 'cpu_usage_rolling', 'request_rate_rolling',
                'cpu_usage_lag1', 'request_rate_lag1', 'agent_load_ratio'
            ]
            
            X = df[feature_columns]
            y = df['current_replicas']
            
            # Scale features
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)
            
            # Train Random Forest model
            model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42
            )
            
            model.fit(X_scaled, y)
            
            # Save model and scaler
            self.models[service] = model
            self.scalers[service] = scaler
            
            # Save to disk
            joblib.dump(model, f'/tmp/{service}_model.pkl')
            joblib.dump(scaler, f'/tmp/{service}_scaler.pkl')
            
            self.logger.info(f"Model training completed for {service}")

    def predict_scaling_needs(self, service, current_metrics):
        """Predict optimal replica count"""
        
        if service not in self.models:
            self.logger.warning(f"No model available for {service}")
            return None
            
        # Prepare current metrics
        features = np.array([
            current_metrics['cpu_usage'],
            current_metrics['memory_usage'],
            current_metrics['request_rate'],
            current_metrics['response_time'],
            current_metrics['agent_coordination_rate'],
            current_metrics['hour_sin'],
            current_metrics['hour_cos'],
            current_metrics['day_sin'],
            current_metrics['day_cos'],
            current_metrics['cpu_usage_rolling'],
            current_metrics['request_rate_rolling'],
            current_metrics['cpu_usage_lag1'],
            current_metrics['request_rate_lag1'],
            current_metrics['agent_load_ratio']
        ]).reshape(1, -1)
        
        # Scale features
        features_scaled = self.scalers[service].transform(features)
        
        # Predict
        predicted_replicas = self.models[service].predict(features_scaled)[0]
        
        # Round to nearest integer and apply constraints
        predicted_replicas = max(1, min(50, round(predicted_replicas)))
        
        return int(predicted_replicas)

    def get_current_metrics(self, service):
        """Get current metrics for a service"""
        
        # This would query your monitoring system
        # Returning mock data for demonstration
        current_time = datetime.now()
        
        return {
            'cpu_usage': 65.0,  # Percentage
            'memory_usage': 70.0,  # Percentage  
            'request_rate': 150.0,  # Requests per second
            'response_time': 0.25,  # Seconds
            'agent_coordination_rate': 15.0,  # Coordination requests per second
            'hour_sin': np.sin(2 * np.pi * current_time.hour / 24),
            'hour_cos': np.cos(2 * np.pi * current_time.hour / 24),
            'day_sin': np.sin(2 * np.pi * current_time.weekday() / 7),
            'day_cos': np.cos(2 * np.pi * current_time.weekday() / 7),
            'cpu_usage_rolling': 62.0,
            'request_rate_rolling': 145.0,
            'cpu_usage_lag1': 58.0,
            'request_rate_lag1': 142.0,
            'agent_load_ratio': 0.1
        }

    def scale_deployment(self, service, target_replicas):
        """Scale Kubernetes deployment"""
        
        try:
            # Get current deployment
            deployment = self.k8s_apps.read_namespaced_deployment(
                name=service,
                namespace=self.namespace
            )
            
            current_replicas = deployment.spec.replicas
            
            if current_replicas != target_replicas:
                # Update replica count
                deployment.spec.replicas = target_replicas
                
                self.k8s_apps.patch_namespaced_deployment(
                    name=service,
                    namespace=self.namespace,
                    body=deployment
                )
                
                self.logger.info(
                    f"Scaled {service} from {current_replicas} to {target_replicas} replicas"
                )
                
                return True
            else:
                self.logger.info(f"{service} already at optimal scale: {current_replicas}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error scaling {service}: {e}")
            return False

    def run_predictive_scaling(self):
        """Main scaling loop"""
        
        services = ['progressive-framework-v5', 'mca', 'npa', 'wpa']
        
        for service in services:
            try:
                # Get current metrics
                current_metrics = self.get_current_metrics(service)
                
                # Predict optimal replica count
                predicted_replicas = self.predict_scaling_needs(service, current_metrics)
                
                if predicted_replicas:
                    # Apply scaling decision
                    scaled = self.scale_deployment(service, predicted_replicas)
                    
                    if scaled:
                        self.logger.info(
                            f"Predictive scaling applied to {service}: {predicted_replicas} replicas"
                        )
                
            except Exception as e:
                self.logger.error(f"Error in predictive scaling for {service}: {e}")

if __name__ == "__main__":
    scaler = PredictiveAutoScaler()
    
    # Train models (run periodically, e.g., daily)
    scaler.train_models()
    
    # Run predictive scaling (run every few minutes)
    scaler.run_predictive_scaling()
```

---

## **TROUBLESHOOTING & OPTIMIZATION**

### **Performance Debugging Toolkit**
```bash
#!/bin/bash
# scripts/performance-debugging.sh

echo "🔍 Progressive Framework V5 Performance Debugging Toolkit"

# Function to check application performance
check_app_performance() {
    echo "=== Application Performance Check ==="
    
    # Check response times
    echo "Response time test:"
    for endpoint in "/health" "/api/v1/users/profile" "/api/v1/agents/mca/status"; do
        echo -n "$endpoint: "
        curl -w "%{time_total}s\n" -s -o /dev/null https://your-domain.com$endpoint
    done
    
    # Check agent response times
    echo -e "\nAgent response times:"
    for agent in "mca" "npa" "wpa"; do
        echo -n "$agent health: "
        curl -w "%{time_total}s\n" -s -o /dev/null https://agents.your-domain.com/api/v1/agents/$agent/health
    done
}

# Function to check resource utilization
check_resource_utilization() {
    echo -e "\n=== Resource Utilization Check ==="
    
    # Kubernetes pod resource usage
    kubectl top pods -n progressive-framework-prod --sort-by=cpu
    echo ""
    kubectl top pods -n progressive-framework-prod --sort-by=memory
    
    # Check for resource-constrained pods
    echo -e "\n=== Resource-Constrained Pods ==="
    kubectl get pods -n progressive-framework-prod -o json | jq -r '
        .items[] | 
        select(.status.containerStatuses[].restartCount > 0) |
        "\(.metadata.name) - Restarts: \(.status.containerStatuses[0].restartCount)"
    '
}

# Function to check database performance
check_database_performance() {
    echo -e "\n=== Database Performance Check ==="
    
    # PostgreSQL performance
    echo "PostgreSQL slow queries:"
    kubectl exec statefulset/postgres -n progressive-framework-prod -- \
        psql -d progressive_framework_v5 -c "
            SELECT query, calls, total_time, mean_time 
            FROM pg_stat_statements 
            WHERE mean_time > 100 
            ORDER BY mean_time DESC 
            LIMIT 5;
        "
    
    # Redis performance
    echo -e "\nRedis performance:"
    kubectl exec redis-cluster-0 -n progressive-framework-prod -- \
        redis-cli INFO stats | grep "instantaneous_ops_per_sec\|keyspace_hits\|keyspace_misses"
    
    # MongoDB performance
    echo -e "\nMongoDB slow operations:"
    kubectl exec statefulset/mongodb -n progressive-framework-prod -- \
        mongo progressive_framework_v5 --eval "db.getProfilingData().limit(5)"
}

# Function to analyze scaling metrics
check_scaling_metrics() {
    echo -e "\n=== Auto-Scaling Status ==="
    
    # HPA status
    kubectl get hpa -n progressive-framework-prod
    
    # Current vs desired replicas
    echo -e "\n=== Replica Status ==="
    kubectl get deployments -n progressive-framework-prod -o custom-columns=\
NAME:.metadata.name,DESIRED:.spec.replicas,CURRENT:.status.replicas,READY:.status.readyReplicas
}

# Function to check agent coordination performance
check_agent_coordination() {
    echo -e "\n=== Agent Coordination Analysis ==="
    
    # MCA logs for coordination issues
    echo "Recent MCA coordination activities:"
    kubectl logs deployment/mca -n progressive-framework-prod --tail=20 | grep "coordination"
    
    # Check inter-agent communication latency
    echo -e "\nInter-agent communication test:"
    MCA_POD=$(kubectl get pods -l app=mca -n progressive-framework-prod -o jsonpath='{.items[0].metadata.name}')
    kubectl exec $MCA_POD -n progressive-framework-prod -- \
        curl -w "NPA response time: %{time_total}s\n" -s -o /dev/null http://npa-service:80/health
    kubectl exec $MCA_POD -n progressive-framework-prod -- \
        curl -w "WPA response time: %{time_total}s\n" -s -o /dev/null http://wpa-service:80/health
}

# Function to check cache performance
check_cache_performance() {
    echo -e "\n=== Cache Performance Analysis ==="
    
    # Redis hit rates
    echo "Redis cache hit rate:"
    kubectl exec redis-cluster-0 -n progressive-framework-prod -- \
        redis-cli INFO stats | grep "keyspace_hits\|keyspace_misses" | \
        awk '
        /keyspace_hits/ { hits = $1; gsub(/[^0-9]/, "", hits) }
        /keyspace_misses/ { misses = $1; gsub(/[^0-9]/, "", misses) }
        END { 
            total = hits + misses;
            if (total > 0) {
                hit_rate = (hits / total) * 100;
                printf "Hit Rate: %.2f%% (Hits: %d, Misses: %d)\n", hit_rate, hits, misses
            }
        }'
    
    # Application cache metrics (would need custom metrics endpoint)
    echo -e "\nApplication cache status:"
    curl -s https://your-domain.com/metrics/cache | grep -E "hit_rate|size|entries" || echo "Cache metrics not available"
}

# Function to generate performance report
generate_performance_report() {
    echo -e "\n=== Generating Performance Report ==="
    
    REPORT_FILE="/tmp/performance-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "Progressive Framework V5 Performance Report"
        echo "Generated: $(date)"
        echo "========================================="
        echo ""
        
        check_app_performance
        check_resource_utilization  
        check_database_performance
        check_scaling_metrics
        check_agent_coordination
        check_cache_performance
        
        echo -e "\n=== Recommendations ==="
        
        # Analyze CPU usage and provide recommendations
        HIGH_CPU_PODS=$(kubectl top pods -n progressive-framework-prod --no-headers | awk '$2 > 80 {print $1}')
        if [ ! -z "$HIGH_CPU_PODS" ]; then
            echo "🚨 High CPU usage detected in pods: $HIGH_CPU_PODS"
            echo "   Recommendation: Consider increasing CPU limits or scaling horizontally"
        fi
        
        # Check memory usage
        HIGH_MEM_PODS=$(kubectl top pods -n progressive-framework-prod --no-headers | awk '$3 > 80 {print $1}')
        if [ ! -z "$HIGH_MEM_PODS" ]; then
            echo "🚨 High memory usage detected in pods: $HIGH_MEM_PODS"
            echo "   Recommendation: Review memory leaks or increase memory limits"
        fi
        
        # Check for frequent restarts
        RESTART_PODS=$(kubectl get pods -n progressive-framework-prod -o json | jq -r '.items[] | select(.status.containerStatuses[].restartCount > 3) | .metadata.name')
        if [ ! -z "$RESTART_PODS" ]; then
            echo "🚨 Frequent restarts detected in: $RESTART_PODS"
            echo "   Recommendation: Check logs for crash causes and review resource limits"
        fi
        
    } | tee "$REPORT_FILE"
    
    echo "📄 Performance report saved to: $REPORT_FILE"
}

# Main execution
case "${1:-all}" in
    "app")
        check_app_performance
        ;;
    "resources")
        check_resource_utilization
        ;;
    "database")
        check_database_performance
        ;;
    "scaling")
        check_scaling_metrics
        ;;
    "agents")
        check_agent_coordination
        ;;
    "cache")
        check_cache_performance
        ;;
    "report")
        generate_performance_report
        ;;
    "all"|*)
        check_app_performance
        check_resource_utilization
        check_database_performance
        check_scaling_metrics
        check_agent_coordination
        check_cache_performance
        generate_performance_report
        ;;
esac

echo -e "\n✅ Performance debugging completed"
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Agent Architecture](../02-Agent-Management/Agent-Architecture.md)** - Context agent design patterns
- **[Network Architecture & Security](Network-Architecture-Security.md)** - Network infrastructure setup

### **Follow-up Documents**
- **[Disaster Recovery & Backup](Disaster-Recovery-Backup.md)** - Business continuity and backup strategies
- **[Infrastructure as Code](Infrastructure-as-Code.md)** - Automated infrastructure management

### **Operations Context**
- **[Container Orchestration](../05-DevOps/Container-Orchestration.md)** - Kubernetes deployment strategies
- **[Monitoring & Alerting](../05-DevOps/Monitoring-Alerting.md)** - Performance monitoring integration

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | Performance Team | Complete scaling and optimization implementation for Progressive Framework V5 |
| 4.x | 2025-08-xx | Infrastructure Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: Performance Engineering Team  
**Last Validated**: 2025-09-02