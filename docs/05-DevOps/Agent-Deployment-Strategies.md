---
file: docs/05-DevOps/Agent-Deployment-Strategies.md
directory: docs/05-DevOps/
priority: HIGH
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# Agent Deployment Strategies - Progressive-Framework-v5

**File Path**: `docs/05-DevOps/Agent-Deployment-Strategies.md`  
**Directory**: `docs/05-DevOps/`  
**Priority**: HIGH  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Advanced deployment strategies specifically designed for Progressive-Framework-v5 context agents (MCA, NPA, WPA), covering specialized patterns for AI agent coordination, intelligent scaling, blue-green deployments for stateful agents, canary releases for agent models, and advanced orchestration techniques that ensure seamless agent coordination during deployments.

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🤖 **[Agent Lifecycle Management](../02-Agent-Management/Agent-Lifecycle-Management.md)** - *Agent management basics*
- 🚀 **[Deployment Guide](Deployment-Guide.md)** - *Basic deployment procedures*
- 🔄 **[CI/CD Pipeline](CI-CD-Pipeline.md)** - *Automated deployment processes*
- 🐳 **[Container Orchestration](Container-Orchestration.md)** - *Kubernetes orchestration*
- 📊 **[Monitoring & Alerting](Monitoring-Alerting.md)** - *Observability stack*

---

## **AGENT DEPLOYMENT ARCHITECTURE**

### **Agent-Specific Deployment Challenges**
```
Traditional vs Agent-Aware Deployment Patterns:

TRADITIONAL DEPLOYMENT:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Service A     │───▶│   Service B     │───▶│   Service C     │
│   (Stateless)   │    │   (Stateless)   │    │   (Stateless)   │
│                 │    │                 │    │                 │
│ • Independent   │    │ • Independent   │    │ • Independent   │
│ • No State      │    │ • No State      │    │ • No State      │
│ • Simple Rolling│    │ • Simple Rolling│    │ • Simple Rolling│
└─────────────────┘    └─────────────────┘    └─────────────────┘

AGENT-AWARE DEPLOYMENT:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│       MCA       │◄──▶│       NPA       │◄──▶│       WPA       │
│ (Coordination)  │    │   (Nutrition)   │    │   (Workout)     │
│                 │    │                 │    │                 │
│ • Stateful      │    │ • Model State   │    │ • Model State   │
│ • Coordination  │    │ • User Context  │    │ • User Context  │
│ • Dependencies  │    │ • Plan History  │    │ • Plan History  │
│ • Gradual Deploy│    │ • Canary Deploy │    │ • Canary Deploy │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                      │                      │
          └──────── Agent Coordination Bus ─────────────┘
```

### **Agent Deployment Considerations**

#### **State Management During Deployment**
- **MCA (Master Coordination Agent)**: Maintains active coordination state
- **NPA (Nutrition Planning Agent)**: Preserves user nutritional preferences and history
- **WPA (Workout Planning Agent)**: Retains workout progressions and user fitness data
- **Cross-Agent Dependencies**: Ensures communication paths remain stable

#### **Coordination Continuity**
- **Active Sessions**: Preserve ongoing agent interactions
- **State Synchronization**: Maintain consistency across agent versions
- **Communication Channels**: Ensure uninterrupted inter-agent messaging
- **Coordination Handoff**: Seamless transfer of coordination responsibilities

---

## **MCA (MASTER COORDINATION AGENT) DEPLOYMENT**

### **MCA Blue-Green Deployment Strategy**
```yaml
# k8s/agents/mca/blue-green-deployment.yml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: mca-rollout
  namespace: progressive-framework-prod
  labels:
    app: mca
    component: coordination-agent
spec:
  replicas: 3
  strategy:
    blueGreen:
      # Pre-promotion analysis
      prePromotionAnalysis:
        templates:
        - templateName: mca-coordination-test
        args:
        - name: service-name
          value: mca-service-preview
      
      # Auto-promote after successful tests
      autoPromotionEnabled: true
      
      # Scale down delay for rollback capability
      scaleDownDelaySeconds: 300
      
      # Preview service for testing
      previewService: mca-service-preview
      activeService: mca-service
      
      # Preview replica count
      previewReplicaCount: 2
      
  selector:
    matchLabels:
      app: mca
  
  template:
    metadata:
      labels:
        app: mca
        component: coordination-agent
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8090"
    spec:
      serviceAccountName: mca-service-account
      
      # Anti-affinity for MCA instances
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - mca
            topologyKey: kubernetes.io/hostname
      
      # Init container for coordination state transfer
      initContainers:
      - name: coordination-state-sync
        image: progressive-agents:latest
        command:
        - /bin/sh
        - -c
        - |
          echo "Syncing coordination state..."
          # Check if this is a blue-green deployment
          if [ "$DEPLOYMENT_TYPE" = "blue-green" ]; then
            # Wait for active MCA to transfer state
            while ! curl -s http://mca-service:8000/api/v1/coordination/ready-for-handoff; do
              echo "Waiting for active MCA to prepare for handoff..."
              sleep 5
            done
            
            # Download coordination state
            curl http://mca-service:8000/api/v1/coordination/export-state > /tmp/coordination-state.json
            
            # Verify state integrity
            if [ -s /tmp/coordination-state.json ]; then
              echo "Coordination state downloaded successfully"
            else
              echo "Failed to download coordination state"
              exit 1
            fi
          fi
        env:
        - name: DEPLOYMENT_TYPE
          value: "blue-green"
        volumeMounts:
        - name: coordination-state
          mountPath: /tmp
      
      containers:
      - name: mca
        image: progressive-agents:latest
        env:
        - name: AGENT_TYPE
          value: "mca"
        - name: AGENT_ID
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: COORDINATION_MODE
          value: "active"
        - name: BLUE_GREEN_DEPLOYMENT
          value: "true"
        
        # Coordination state import
        - name: IMPORT_STATE_ON_STARTUP
          value: "true"
        
        envFrom:
        - configMapRef:
            name: mca-config
        - secretRef:
            name: mca-secrets
        
        ports:
        - name: http
          containerPort: 8000
        - name: metrics
          containerPort: 8090
        - name: coordination
          containerPort: 9000
        
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2"
        
        # Enhanced health checks for coordination
        livenessProbe:
          httpGet:
            path: /health/coordination
            port: 8000
          initialDelaySeconds: 60
          periodSeconds: 30
          timeoutSeconds: 10
          failureThreshold: 3
        
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 2
        
        # Startup probe for coordination state loading
        startupProbe:
          httpGet:
            path: /health/coordination-ready
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 20  # Allow 100 seconds for state loading
        
        volumeMounts:
        - name: coordination-state
          mountPath: /tmp/coordination
        
        # Graceful shutdown for coordination handoff
        lifecycle:
          preStop:
            exec:
              command:
              - /bin/sh
              - -c
              - |
                echo "Preparing MCA for shutdown..."
                # Export current coordination state
                curl -X POST http://localhost:8000/api/v1/coordination/export-state
                # Notify other agents of impending shutdown
                curl -X POST http://localhost:8000/api/v1/coordination/prepare-handoff
                # Allow time for coordination transfer
                sleep 30
      
      volumes:
      - name: coordination-state
        emptyDir: {}

---
# Analysis Template for MCA Deployment Testing
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: mca-coordination-test
  namespace: progressive-framework-prod
spec:
  args:
  - name: service-name
  
  metrics:
  # Test MCA coordination capabilities
  - name: mca-coordination-health
    interval: 30s
    count: 5
    successCondition: result[0] == 1
    failureLimit: 2
    provider:
      prometheus:
        address: http://prometheus-server.monitoring:9090
        query: |
          up{job="progressive-agents",service="{{args.service-name}}"}
  
  # Test agent communication
  - name: agent-communication-test
    interval: 30s  
    count: 3
    successCondition: result[0] > 0.95
    provider:
      prometheus:
        address: http://prometheus-server.monitoring:9090
        query: |
          rate(progressive_agent_requests_total{agent_type="mca",status="success"}[5m]) /
          rate(progressive_agent_requests_total{agent_type="mca"}[5m])
  
  # Test coordination response time
  - name: coordination-latency-test
    interval: 30s
    count: 3
    successCondition: result[0] < 5
    provider:
      prometheus:
        address: http://prometheus-server.monitoring:9090
        query: |
          histogram_quantile(0.95, 
            rate(progressive_agent_coordination_time_seconds_bucket{source_agent="mca"}[5m])
          )
  
  # Manual coordination functionality test
  - name: coordination-functionality-test
    interval: 60s
    count: 2
    successCondition: result == "success"
    provider:
      web:
        url: "http://{{args.service-name}}:8000/api/v1/coordination/test"
        headers:
          - key: Content-Type
            value: application/json
        method: POST
        body: |
          {
            "test_type": "coordination_capabilities",
            "agents": ["npa", "wpa"],
            "test_scenario": "nutrition_workout_sync"
          }
        jsonPath: "{$.status}"
```

### **MCA Rolling Update with Coordination Handoff**
```yaml
# k8s/agents/mca/rolling-update-coordination.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mca-coordination-script
  namespace: progressive-framework-prod
data:
  coordination-handoff.sh: |
    #!/bin/bash
    set -e
    
    CURRENT_MCA_POD=$1
    NEW_MCA_POD=$2
    
    echo "🔄 Starting MCA coordination handoff: $CURRENT_MCA_POD -> $NEW_MCA_POD"
    
    # Step 1: Prepare current MCA for handoff
    echo "📤 Preparing current MCA for coordination transfer..."
    kubectl exec $CURRENT_MCA_POD -n progressive-framework-prod -- \
      curl -X POST http://localhost:8000/api/v1/coordination/prepare-handoff
    
    # Step 2: Export coordination state
    echo "💾 Exporting coordination state..."
    kubectl exec $CURRENT_MCA_POD -n progressive-framework-prod -- \
      curl http://localhost:8000/api/v1/coordination/export > /tmp/coord-state.json
    
    # Step 3: Wait for new MCA to be ready
    echo "⏳ Waiting for new MCA to be ready..."
    kubectl wait --for=condition=ready pod/$NEW_MCA_POD -n progressive-framework-prod --timeout=300s
    
    # Step 4: Import state to new MCA
    echo "📥 Importing coordination state to new MCA..."
    kubectl cp /tmp/coord-state.json progressive-framework-prod/$NEW_MCA_POD:/tmp/coordination-state.json
    kubectl exec $NEW_MCA_POD -n progressive-framework-prod -- \
      curl -X POST http://localhost:8000/api/v1/coordination/import \
      -H "Content-Type: application/json" \
      -d @/tmp/coordination-state.json
    
    # Step 5: Activate new MCA
    echo "🚀 Activating new MCA coordination..."
    kubectl exec $NEW_MCA_POD -n progressive-framework-prod -- \
      curl -X POST http://localhost:8000/api/v1/coordination/activate
    
    # Step 6: Verify coordination transfer
    echo "✅ Verifying coordination transfer..."
    ACTIVE_COORDINATOR=$(kubectl exec $NEW_MCA_POD -n progressive-framework-prod -- \
      curl -s http://localhost:8000/api/v1/coordination/status | jq -r .active)
    
    if [ "$ACTIVE_COORDINATOR" = "true" ]; then
      echo "✅ Coordination handoff successful"
      
      # Step 7: Gracefully shutdown old MCA
      echo "🔄 Gracefully shutting down old MCA..."
      kubectl exec $CURRENT_MCA_POD -n progressive-framework-prod -- \
        curl -X POST http://localhost:8000/api/v1/coordination/shutdown
      
    else
      echo "❌ Coordination handoff failed"
      exit 1
    fi
    
    echo "🎉 MCA rolling update completed successfully"

---
# Custom deployment hook for MCA coordination
apiVersion: batch/v1
kind: Job
metadata:
  name: mca-coordination-handoff
  namespace: progressive-framework-prod
  annotations:
    argocd.argoproj.io/hook: Sync
    argocd.argoproj.io/hook-delete-policy: BeforeHookCreation
spec:
  template:
    spec:
      restartPolicy: OnFailure
      containers:
      - name: coordination-handoff
        image: bitnami/kubectl:latest
        command: ["/bin/bash"]
        args:
        - -c
        - |
          # Get current and new MCA pods
          OLD_POD=$(kubectl get pods -l app=mca,version=old -o jsonpath='{.items[0].metadata.name}')
          NEW_POD=$(kubectl get pods -l app=mca,version=new -o jsonpath='{.items[0].metadata.name}')
          
          if [ -n "$OLD_POD" ] && [ -n "$NEW_POD" ]; then
            /scripts/coordination-handoff.sh $OLD_POD $NEW_POD
          else
            echo "No coordination handoff needed"
          fi
        volumeMounts:
        - name: coordination-script
          mountPath: /scripts
      volumes:
      - name: coordination-script
        configMap:
          name: mca-coordination-script
          defaultMode: 0755
```

---

## **DOMAIN AGENT DEPLOYMENT (NPA/WPA)**

### **Canary Deployment for Agent Models**
```yaml
# k8s/agents/npa/canary-deployment.yml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: npa-rollout
  namespace: progressive-framework-prod
  labels:
    app: npa
    component: nutrition-agent
spec:
  replicas: 5
  strategy:
    canary:
      # Canary steps with gradual traffic increase
      steps:
      - setWeight: 10    # 10% traffic to canary
      - pause:
          duration: 5m   # Wait 5 minutes
      
      # Analysis during canary
      - setWeight: 25    # 25% traffic
      - pause:
          duration: 10m
      
      - setWeight: 50    # 50% traffic
      - pause:
          duration: 15m
      
      - setWeight: 75    # 75% traffic
      - pause:
          duration: 10m
      
      # Full rollout if all analysis passes
      - setWeight: 100
      
      # Analysis configuration
      analysis:
        templates:
        - templateName: npa-success-rate
        - templateName: npa-latency-test
        - templateName: npa-plan-quality
        startingStep: 1    # Start analysis at 10% traffic
        args:
        - name: service-name
          value: npa-service
        - name: canary-hash
          valueFrom:
            podTemplateHashValue: Latest
      
      # Traffic routing
      trafficRouting:
        istio:
          virtualService:
            name: npa-virtual-service
            routes:
            - primary
          destinationRule:
            name: npa-destination-rule
            canarySubsetName: canary
            stableSubsetName: stable
      
      # Rollback on failure
      abortScaleDownDelaySeconds: 600
      maxUnavailable: 1
  
  selector:
    matchLabels:
      app: npa
  
  template:
    metadata:
      labels:
        app: npa
        component: nutrition-agent
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8090"
    spec:
      serviceAccountName: agent-service-account
      
      # Init container for model compatibility check
      initContainers:
      - name: model-compatibility-check
        image: progressive-agents:latest
        command:
        - /bin/sh
        - -c
        - |
          echo "🧪 Checking model compatibility..."
          
          # Check if this is a model update
          if [ "$MODEL_UPDATE" = "true" ]; then
            # Validate new model against test dataset
            python /app/scripts/validate-model.py \
              --model-path /models/nutrition-model-v2 \
              --test-data /app/test-data/nutrition-test.json \
              --compatibility-threshold 0.95
            
            if [ $? -eq 0 ]; then
              echo "✅ Model compatibility validated"
            else
              echo "❌ Model compatibility failed"
              exit 1
            fi
          fi
        env:
        - name: MODEL_UPDATE
          value: "true"
        - name: MODEL_VERSION
          value: "v2.1.0"
        volumeMounts:
        - name: model-storage
          mountPath: /models
      
      containers:
      - name: npa
        image: progressive-agents:latest
        env:
        - name: AGENT_TYPE
          value: "npa"
        - name: AGENT_SPECIALIZATION
          value: "nutrition"
        - name: MODEL_VERSION
          value: "v2.1.0"
        - name: CANARY_DEPLOYMENT
          value: "true"
        
        # A/B testing configuration
        - name: ENABLE_AB_TESTING
          value: "true"
        - name: AB_TEST_PERCENTAGE
          value: "10"
        
        envFrom:
        - configMapRef:
            name: npa-config
        - secretRef:
            name: npa-secrets
        
        ports:
        - name: http
          containerPort: 8000
        - name: metrics
          containerPort: 8090
        
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "1"
        
        # Health checks specific to nutrition planning
        livenessProbe:
          httpGet:
            path: /health/nutrition-model
            port: 8000
          initialDelaySeconds: 45
          periodSeconds: 30
          timeoutSeconds: 15
          failureThreshold: 3
        
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 20
          periodSeconds: 10
          timeoutSeconds: 10
          failureThreshold: 3
        
        # Custom startup probe for model loading
        startupProbe:
          httpGet:
            path: /health/model-loaded
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 5
          failureThreshold: 24  # Allow 2 minutes for model loading
        
        volumeMounts:
        - name: model-storage
          mountPath: /models
        - name: user-context-cache
          mountPath: /cache
        
        # Graceful shutdown for plan completion
        lifecycle:
          preStop:
            exec:
              command:
              - /bin/sh
              - -c
              - |
                echo "🥗 Completing active nutrition plans..."
                curl -X POST http://localhost:8000/api/v1/nutrition/complete-active-plans
                sleep 15
      
      volumes:
      - name: model-storage
        persistentVolumeClaim:
          claimName: nutrition-models-pvc
      - name: user-context-cache
        emptyDir:
          sizeLimit: 1Gi

---
# Analysis Templates for NPA Canary Deployment
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: npa-success-rate
  namespace: progressive-framework-prod
spec:
  args:
  - name: service-name
  - name: canary-hash
  
  metrics:
  - name: success-rate
    interval: 60s
    count: 5
    successCondition: result[0] >= 0.95
    failureLimit: 3
    provider:
      prometheus:
        address: http://prometheus-server.monitoring:9090
        query: |
          sum(rate(progressive_agent_requests_total{agent_type="npa",status="success"}[5m])) /
          sum(rate(progressive_agent_requests_total{agent_type="npa"}[5m]))

---
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: npa-latency-test
  namespace: progressive-framework-prod
spec:
  args:
  - name: service-name
  
  metrics:
  - name: latency-p95
    interval: 60s
    count: 5
    successCondition: result[0] <= 10
    failureLimit: 2
    provider:
      prometheus:
        address: http://prometheus-server.monitoring:9090
        query: |
          histogram_quantile(0.95,
            rate(progressive_agent_response_time_seconds_bucket{agent_type="npa"}[5m])
          )

---
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: npa-plan-quality
  namespace: progressive-framework-prod
spec:
  args:
  - name: service-name
  
  metrics:
  - name: plan-quality-score
    interval: 300s  # Check every 5 minutes
    count: 3
    successCondition: result[0] >= 0.85
    failureLimit: 2
    provider:
      web:
        url: "http://{{args.service-name}}:8000/api/v1/nutrition/quality-metrics"
        headers:
        - key: Content-Type
          value: application/json
        jsonPath: "{$.average_quality_score}"
```

### **WPA (Workout Planning Agent) Deployment**
```yaml
# k8s/agents/wpa/deployment-with-ab-testing.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wpa-deployment
  namespace: progressive-framework-prod
  labels:
    app: wpa
    component: workout-agent
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 2
  
  selector:
    matchLabels:
      app: wpa
  
  template:
    metadata:
      labels:
        app: wpa
        component: workout-agent
        version: v2-1-0
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8090"
        # Feature flag for A/B testing
        feature-flags: "workout-ai-v2,progressive-difficulty"
    spec:
      serviceAccountName: agent-service-account
      
      # Init container for workout model validation
      initContainers:
      - name: workout-model-validator
        image: progressive-agents:latest
        command:
        - /bin/sh
        - -c
        - |
          echo "🏋️ Validating workout planning model..."
          
          # Test model against fitness scenarios
          python /app/scripts/validate-workout-model.py \
            --model-version v2.1.0 \
            --test-scenarios /app/test-data/workout-scenarios.json \
            --performance-threshold 0.9
          
          if [ $? -eq 0 ]; then
            echo "✅ Workout model validation passed"
          else
            echo "❌ Workout model validation failed"
            exit 1
          fi
        volumeMounts:
        - name: workout-models
          mountPath: /app/models
      
      containers:
      - name: wpa
        image: progressive-agents:latest
        env:
        - name: AGENT_TYPE
          value: "wpa"
        - name: AGENT_SPECIALIZATION
          value: "workout"
        - name: WORKOUT_MODEL_VERSION
          value: "v2.1.0"
        
        # A/B testing configuration
        - name: AB_TEST_GROUPS
          value: "control,enhanced-ai,progressive-difficulty"
        - name: AB_TEST_SPLIT
          value: "40,30,30"  # Percentage split
        
        # Feature flags
        - name: ENABLE_AI_ENHANCED_PLANNING
          value: "true"
        - name: ENABLE_PROGRESSIVE_DIFFICULTY
          value: "true"
        - name: ENABLE_REAL_TIME_ADAPTATION
          value: "false"  # Feature flag for future release
        
        envFrom:
        - configMapRef:
            name: wpa-config
        - secretRef:
            name: wpa-secrets
        
        ports:
        - name: http
          containerPort: 8000
        - name: metrics
          containerPort: 8090
        
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "1"
        
        # Workout-specific health checks
        livenessProbe:
          httpGet:
            path: /health/workout-engine
            port: 8000
          initialDelaySeconds: 60
          periodSeconds: 45
          timeoutSeconds: 20
          failureThreshold: 3
        
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 15
          timeoutSeconds: 10
          failureThreshold: 2
        
        # Startup probe for model and exercise database loading
        startupProbe:
          httpGet:
            path: /health/models-loaded
            port: 8000
          initialDelaySeconds: 15
          periodSeconds: 10
          timeoutSeconds: 10
          failureThreshold: 18  # Allow 3 minutes for loading
        
        volumeMounts:
        - name: workout-models
          mountPath: /app/models
        - name: exercise-database
          mountPath: /app/data/exercises
        - name: user-progress-cache
          mountPath: /cache/progress
        
        # Graceful shutdown for workout completion
        lifecycle:
          preStop:
            exec:
              command:
              - /bin/sh
              - -c
              - |
                echo "🏋️ Saving active workout sessions..."
                curl -X POST http://localhost:8000/api/v1/workout/save-active-sessions
                echo "Completing ongoing workout generations..."
                curl -X POST http://localhost:8000/api/v1/workout/complete-active-generations
                sleep 20
      
      volumes:
      - name: workout-models
        persistentVolumeClaim:
          claimName: workout-models-pvc
      - name: exercise-database
        configMap:
          name: exercise-database-config
      - name: user-progress-cache
        emptyDir:
          sizeLimit: 2Gi

---
# WPA Service with session affinity for workout continuity
apiVersion: v1
kind: Service
metadata:
  name: wpa-service
  namespace: progressive-framework-prod
  labels:
    app: wpa
spec:
  type: ClusterIP
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 7200  # 2 hours for workout session continuity
  ports:
  - name: http
    port: 80
    targetPort: 8000
  - name: metrics
    port: 9090
    targetPort: 8090
  selector:
    app: wpa
```

---

## **MULTI-AGENT COORDINATION DEPLOYMENT**

### **Agent Mesh Deployment Pattern**
```yaml
# k8s/agents/coordination/agent-mesh.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: agent-mesh-config
  namespace: progressive-framework-prod
data:
  mesh-topology.json: |
    {
      "mesh_version": "v1.0",
      "coordination_pattern": "hub-and-spoke",
      "agents": {
        "mca": {
          "role": "coordinator",
          "replicas": 3,
          "connections": ["npa", "wpa"],
          "priority": 1,
          "failure_mode": "immediate_escalation"
        },
        "npa": {
          "role": "domain_specialist",
          "replicas": 3,
          "connections": ["mca", "wpa"],
          "priority": 2,
          "failure_mode": "graceful_degradation"
        },
        "wpa": {
          "role": "domain_specialist", 
          "replicas": 3,
          "connections": ["mca", "npa"],
          "priority": 2,
          "failure_mode": "graceful_degradation"
        }
      },
      "communication": {
        "protocol": "grpc",
        "timeout": "30s",
        "retry_policy": {
          "max_attempts": 3,
          "backoff": "exponential"
        },
        "circuit_breaker": {
          "failure_threshold": 5,
          "timeout": "60s"
        }
      },
      "deployment_constraints": {
        "min_healthy_agents": 2,
        "coordination_quorum": 2,
        "max_deployment_parallelism": 1
      }
    }

---
# Agent deployment orchestrator
apiVersion: batch/v1
kind: Job
metadata:
  name: agent-mesh-deployment
  namespace: progressive-framework-prod
spec:
  template:
    spec:
      restartPolicy: OnFailure
      serviceAccountName: agent-deployment-sa
      containers:
      - name: agent-orchestrator
        image: progressive-deployment-orchestrator:latest
        command: ["python", "/app/orchestrate-agent-deployment.py"]
        env:
        - name: DEPLOYMENT_MODE
          value: "coordinated"
        - name: MESH_CONFIG
          value: "/config/mesh-topology.json"
        - name: KUBERNETES_NAMESPACE
          value: "progressive-framework-prod"
        
        volumeMounts:
        - name: mesh-config
          mountPath: /config
        
        # Script for coordinated agent deployment
        command:
        - /bin/bash
        - -c
        - |
          #!/bin/bash
          set -e
          
          echo "🕸️ Starting coordinated agent mesh deployment..."
          
          # Load mesh configuration
          MESH_CONFIG="/config/mesh-topology.json"
          
          # Phase 1: Deploy MCA with coordination readiness
          echo "📊 Phase 1: Deploying Master Coordination Agent..."
          kubectl apply -f /manifests/mca-deployment.yml
          kubectl rollout status deployment/mca-deployment --timeout=300s
          
          # Wait for MCA coordination readiness
          echo "⏳ Waiting for MCA coordination readiness..."
          timeout 180s bash -c '
            while [[ "$(kubectl get pods -l app=mca -o jsonpath="{.items[*].status.phase}")" != "Running Running Running" ]]; do
              sleep 5
            done
          '
          
          # Test MCA coordination capabilities
          MCA_READY=$(kubectl exec -l app=mca -- curl -s http://localhost:8000/health/coordination-ready | jq -r .ready)
          if [ "$MCA_READY" != "true" ]; then
            echo "❌ MCA coordination not ready"
            exit 1
          fi
          
          # Phase 2: Deploy domain agents with coordination registration
          echo "🥗 Phase 2: Deploying Nutrition Planning Agent..."
          kubectl apply -f /manifests/npa-deployment.yml
          
          echo "🏋️ Phase 3: Deploying Workout Planning Agent..."  
          kubectl apply -f /manifests/wpa-deployment.yml
          
          # Wait for domain agents to be ready
          kubectl rollout status deployment/npa-deployment --timeout=300s
          kubectl rollout status deployment/wpa-deployment --timeout=300s
          
          # Phase 4: Establish agent mesh connectivity
          echo "🔗 Phase 4: Establishing agent mesh connectivity..."
          
          # Register agents with MCA
          kubectl exec -l app=mca -- curl -X POST http://localhost:8000/api/v1/coordination/register-agent \
            -H "Content-Type: application/json" \
            -d '{"agent_type": "npa", "endpoint": "http://npa-service:80"}'
          
          kubectl exec -l app=mca -- curl -X POST http://localhost:8000/api/v1/coordination/register-agent \
            -H "Content-Type: application/json" \
            -d '{"agent_type": "wpa", "endpoint": "http://wpa-service:80"}'
          
          # Test mesh connectivity
          echo "🧪 Phase 5: Testing mesh connectivity..."
          CONNECTIVITY_TEST=$(kubectl exec -l app=mca -- \
            curl -s http://localhost:8000/api/v1/coordination/test-mesh | jq -r .all_agents_connected)
          
          if [ "$CONNECTIVITY_TEST" = "true" ]; then
            echo "✅ Agent mesh deployment successful"
          else
            echo "❌ Agent mesh connectivity failed"
            exit 1
          fi
          
          echo "🎉 Coordinated agent mesh deployment completed"
      
      volumes:
      - name: mesh-config
        configMap:
          name: agent-mesh-config

---
# RBAC for agent deployment orchestrator
apiVersion: v1
kind: ServiceAccount
metadata:
  name: agent-deployment-sa
  namespace: progressive-framework-prod

---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: agent-deployment-role
  namespace: progressive-framework-prod
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "create", "update", "patch", "delete"]
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "create", "update", "patch", "delete"]
- apiGroups: [""]
  resources: ["pods/exec"]
  verbs: ["create"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: agent-deployment-rolebinding
  namespace: progressive-framework-prod
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: agent-deployment-role
subjects:
- kind: ServiceAccount
  name: agent-deployment-sa
  namespace: progressive-framework-prod
```

---

## **AGENT MODEL VERSIONING & DEPLOYMENT**

### **Model Update Strategy**
```yaml
# k8s/agents/models/model-update-pipeline.yml
apiVersion: argoproj.io/v1alpha1
kind: WorkflowTemplate
metadata:
  name: agent-model-update
  namespace: progressive-framework-prod
spec:
  entrypoint: model-update-pipeline
  
  templates:
  - name: model-update-pipeline
    steps:
    # Step 1: Model validation
    - - name: validate-model
        template: validate-new-model
        arguments:
          parameters:
          - name: model-version
            value: "{{workflow.parameters.model-version}}"
          - name: agent-type
            value: "{{workflow.parameters.agent-type}}"
    
    # Step 2: Staging deployment
    - - name: deploy-to-staging
        template: deploy-model-staging
        arguments:
          parameters:
          - name: model-version
            value: "{{workflow.parameters.model-version}}"
          - name: agent-type
            value: "{{workflow.parameters.agent-type}}"
    
    # Step 3: Staging validation
    - - name: validate-staging
        template: validate-staging-deployment
        arguments:
          parameters:
          - name: agent-type
            value: "{{workflow.parameters.agent-type}}"
    
    # Step 4: Production canary deployment
    - - name: canary-deployment
        template: deploy-model-canary
        arguments:
          parameters:
          - name: model-version
            value: "{{workflow.parameters.model-version}}"
          - name: agent-type
            value: "{{workflow.parameters.agent-type}}"
    
    # Step 5: A/B testing
    - - name: ab-testing
        template: run-ab-tests
        arguments:
          parameters:
          - name: agent-type
            value: "{{workflow.parameters.agent-type}}"
          - name: test-duration
            value: "1h"
    
    # Step 6: Full rollout (if A/B tests pass)
    - - name: full-rollout
        template: full-model-rollout
        when: "{{steps.ab-testing.outputs.result}} == 'success'"
        arguments:
          parameters:
          - name: model-version
            value: "{{workflow.parameters.model-version}}"
          - name: agent-type
            value: "{{workflow.parameters.agent-type}}"
  
  # Model validation template
  - name: validate-new-model
    inputs:
      parameters:
      - name: model-version
      - name: agent-type
    script:
      image: progressive-model-validator:latest
      command: [python]
      source: |
        import json
        import requests
        import sys
        
        model_version = "{{inputs.parameters.model-version}}"
        agent_type = "{{inputs.parameters.agent-type}}"
        
        print(f"🧪 Validating {agent_type} model version {model_version}")
        
        # Load test dataset
        with open(f"/test-data/{agent_type}-validation.json") as f:
            test_data = json.load(f)
        
        # Run model validation
        validation_results = []
        for test_case in test_data["test_cases"]:
            # Simulate model prediction
            result = validate_model_prediction(
                model_version, 
                agent_type, 
                test_case["input"]
            )
            validation_results.append({
                "test_id": test_case["id"],
                "expected": test_case["expected"],
                "actual": result,
                "passed": result["quality_score"] >= test_case["min_quality"]
            })
        
        # Calculate success rate
        passed_tests = sum(1 for r in validation_results if r["passed"])
        success_rate = passed_tests / len(validation_results)
        
        print(f"📊 Validation Results: {passed_tests}/{len(validation_results)} tests passed")
        print(f"📈 Success Rate: {success_rate:.2%}")
        
        # Require 95% success rate for production deployment
        if success_rate >= 0.95:
            print("✅ Model validation passed")
            sys.exit(0)
        else:
            print("❌ Model validation failed")
            sys.exit(1)
        
        def validate_model_prediction(model_version, agent_type, input_data):
            # Implementation for model validation
            return {"quality_score": 0.96, "latency_ms": 150}
  
  # A/B testing template
  - name: run-ab-tests
    inputs:
      parameters:
      - name: agent-type
      - name: test-duration
    script:
      image: progressive-ab-tester:latest
      command: [python]
      source: |
        import time
        import requests
        import statistics
        from datetime import datetime, timedelta
        
        agent_type = "{{inputs.parameters.agent-type}}"
        test_duration = "{{inputs.parameters.test-duration}}"
        
        print(f"🔬 Starting A/B test for {agent_type} agent")
        
        # Configure A/B test
        ab_test_config = {
            "test_name": f"{agent_type}_model_update_ab_test",
            "control_group": "stable_model",
            "treatment_group": "new_model", 
            "split_percentage": 50,
            "metrics": [
                "response_time",
                "quality_score",
                "user_satisfaction",
                "error_rate"
            ]
        }
        
        # Start A/B test
        response = requests.post(
            f"http://{agent_type}-service:80/api/v1/ab-test/start",
            json=ab_test_config
        )
        
        if response.status_code != 200:
            print(f"❌ Failed to start A/B test: {response.text}")
            exit(1)
        
        test_id = response.json()["test_id"]
        print(f"🧪 A/B test started with ID: {test_id}")
        
        # Wait for test duration
        duration_seconds = parse_duration(test_duration)
        print(f"⏳ Running A/B test for {test_duration}")
        time.sleep(duration_seconds)
        
        # Get test results
        results_response = requests.get(
            f"http://{agent_type}-service:80/api/v1/ab-test/{test_id}/results"
        )
        
        if results_response.status_code != 200:
            print(f"❌ Failed to get A/B test results: {results_response.text}")
            exit(1)
        
        results = results_response.json()
        
        # Evaluate results
        print("📊 A/B Test Results:")
        print(f"Control Group Performance: {results['control']['metrics']}")
        print(f"Treatment Group Performance: {results['treatment']['metrics']}")
        
        # Decision criteria
        treatment_better = (
            results['treatment']['quality_score'] >= results['control']['quality_score'] * 1.02 and  # 2% improvement
            results['treatment']['response_time'] <= results['control']['response_time'] * 1.1 and   # No more than 10% slower
            results['treatment']['error_rate'] <= results['control']['error_rate'] * 1.05            # No more than 5% more errors
        )
        
        if treatment_better:
            print("✅ A/B test successful - new model performs better")
            print("success")
        else:
            print("❌ A/B test failed - new model does not meet criteria")
            print("failure")
        
        def parse_duration(duration_str):
            # Simple duration parser (1h = 3600s, 30m = 1800s, etc.)
            if duration_str.endswith('h'):
                return int(duration_str[:-1]) * 3600
            elif duration_str.endswith('m'):
                return int(duration_str[:-1]) * 60
            elif duration_str.endswith('s'):
                return int(duration_str[:-1])
            else:
                return int(duration_str)
```

---

## **AGENT STATE MANAGEMENT**

### **Stateful Agent Deployment with State Preservation**
```yaml
# k8s/agents/state/stateful-agent-deployment.yml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mca-stateful
  namespace: progressive-framework-prod
  labels:
    app: mca-stateful
    component: coordination-agent
spec:
  serviceName: mca-stateful-headless
  replicas: 3
  
  # Update strategy for stateful agents
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      partition: 0
      maxUnavailable: 1
  
  selector:
    matchLabels:
      app: mca-stateful
  
  template:
    metadata:
      labels:
        app: mca-stateful
        component: coordination-agent
    spec:
      serviceAccountName: mca-service-account
      
      # Init container for state recovery
      initContainers:
      - name: state-recovery
        image: progressive-agents:latest
        command:
        - /bin/sh
        - -c
        - |
          echo "🔄 Recovering coordination state..."
          
          # Check for existing state
          if [ -f /data/coordination-state.json ]; then
            echo "📂 Found existing coordination state"
            
            # Validate state integrity
            python /app/scripts/validate-state.py /data/coordination-state.json
            
            if [ $? -eq 0 ]; then
              echo "✅ State validation passed"
            else
              echo "⚠️ State validation failed, using backup"
              cp /data/backup/coordination-state-backup.json /data/coordination-state.json
            fi
          else
            echo "🆕 No existing state found, initializing new state"
            python /app/scripts/initialize-state.py > /data/coordination-state.json
          fi
        volumeMounts:
        - name: coordination-state
          mountPath: /data
      
      containers:
      - name: mca
        image: progressive-agents:latest
        env:
        - name: AGENT_TYPE
          value: "mca"
        - name: STATEFUL_MODE
          value: "true"
        - name: STATE_PERSISTENCE
          value: "enabled"
        - name: COORDINATION_STATE_PATH
          value: "/data/coordination-state.json"
        - name: BACKUP_INTERVAL
          value: "300"  # 5 minutes
        
        ports:
        - name: http
          containerPort: 8000
        - name: coordination
          containerPort: 9000
        
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "4Gi"
            cpu: "2"
        
        # Health checks with state awareness
        livenessProbe:
          httpGet:
            path: /health/coordination-with-state
            port: 8000
          initialDelaySeconds: 60
          periodSeconds: 30
          timeoutSeconds: 15
          failureThreshold: 3
        
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 10
          failureThreshold: 2
        
        volumeMounts:
        - name: coordination-state
          mountPath: /data
        
        # Graceful shutdown with state persistence
        lifecycle:
          preStop:
            exec:
              command:
              - /bin/sh
              - -c
              - |
                echo "💾 Persisting coordination state before shutdown..."
                
                # Create state backup
                cp /data/coordination-state.json /data/backup/coordination-state-backup-$(date +%s).json
                
                # Export current state
                curl -X POST http://localhost:8000/api/v1/coordination/persist-state
                
                # Notify other coordinators
                curl -X POST http://localhost:8000/api/v1/coordination/announce-shutdown
                
                # Allow time for coordination handoff
                sleep 30
      
      # Sidecar for state synchronization
      - name: state-sync
        image: progressive-state-sync:latest
        env:
        - name: AGENT_TYPE
          value: "mca"
        - name: SYNC_INTERVAL
          value: "60"  # 1 minute
        - name: BACKUP_RETENTION
          value: "24h"
        
        volumeMounts:
        - name: coordination-state
          mountPath: /data
        
        # State synchronization script
        command:
        - /bin/bash
        - -c
        - |
          #!/bin/bash
          
          echo "🔄 Starting state synchronization sidecar..."
          
          while true; do
            # Backup current state
            if [ -f /data/coordination-state.json ]; then
              # Create timestamped backup
              TIMESTAMP=$(date +%Y%m%d_%H%M%S)
              cp /data/coordination-state.json /data/backup/coordination-state-${TIMESTAMP}.json
              
              # Sync to external storage (S3, GCS, etc.)
              # aws s3 cp /data/coordination-state.json s3://agent-state-backups/mca/
              
              # Clean up old backups (keep last 24 hours)
              find /data/backup -name "coordination-state-*.json" -mtime +1 -delete
              
              echo "📤 State synchronized at $(date)"
            fi
            
            sleep $SYNC_INTERVAL
          done
  
  # Persistent volume claim template for state storage
  volumeClaimTemplates:
  - metadata:
      name: coordination-state
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: "fast-ssd"
      resources:
        requests:
          storage: 10Gi

---
# Headless service for StatefulSet
apiVersion: v1
kind: Service
metadata:
  name: mca-stateful-headless
  namespace: progressive-framework-prod
  labels:
    app: mca-stateful
spec:
  clusterIP: None
  selector:
    app: mca-stateful
  ports:
  - name: http
    port: 8000
    targetPort: 8000
  - name: coordination
    port: 9000
    targetPort: 9000
```

---

## **ADVANCED DEPLOYMENT PATTERNS**

### **Feature Flag Driven Deployments**
```yaml
# k8s/agents/feature-flags/feature-flag-deployment.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: agent-feature-flags
  namespace: progressive-framework-prod
data:
  feature-flags.json: |
    {
      "feature_flags": {
        "enhanced_nutrition_ai": {
          "enabled": true,
          "rollout_percentage": 25,
          "target_users": ["beta_testers"],
          "environments": ["production"]
        },
        "adaptive_workout_difficulty": {
          "enabled": true,
          "rollout_percentage": 50,
          "target_users": ["premium_users"],
          "environments": ["production"]
        },
        "real_time_plan_adjustment": {
          "enabled": false,
          "rollout_percentage": 0,
          "target_users": [],
          "environments": ["staging"]
        },
        "multi_modal_input": {
          "enabled": true,
          "rollout_percentage": 10,
          "target_users": ["alpha_testers"],
          "environments": ["production"]
        }
      },
      "killswitches": {
        "disable_ai_recommendations": false,
        "fallback_to_basic_plans": false,
        "emergency_readonly_mode": false
      }
    }

---
# Feature flag controller deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: feature-flag-controller
  namespace: progressive-framework-prod
spec:
  replicas: 2
  selector:
    matchLabels:
      app: feature-flag-controller
  template:
    metadata:
      labels:
        app: feature-flag-controller
    spec:
      containers:
      - name: controller
        image: progressive-feature-flag-controller:latest
        env:
        - name: FEATURE_FLAGS_CONFIG
          value: "/config/feature-flags.json"
        - name: UPDATE_INTERVAL
          value: "30s"
        
        ports:
        - name: http
          containerPort: 8080
        
        volumeMounts:
        - name: feature-flags-config
          mountPath: /config
        
        # Feature flag management endpoints
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          periodSeconds: 30
        
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          periodSeconds: 10
      
      volumes:
      - name: feature-flags-config
        configMap:
          name: agent-feature-flags

---
# Feature flag service
apiVersion: v1
kind: Service
metadata:
  name: feature-flag-service
  namespace: progressive-framework-prod
spec:
  selector:
    app: feature-flag-controller
  ports:
  - name: http
    port: 80
    targetPort: 8080
```

### **Circuit Breaker Deployment Pattern**
```yaml
# k8s/agents/circuit-breaker/agent-with-circuit-breaker.yml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: agent-circuit-breaker
  namespace: progressive-framework-prod
spec:
  host: "*.progressive-framework-prod.svc.cluster.local"
  trafficPolicy:
    outlierDetection:
      # Circuit breaker configuration for agents
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
      minHealthPercent: 30
    
    connectionPool:
      tcp:
        maxConnections: 100
        connectTimeout: 30s
        tcpKeepalive:
          time: 7200s
          interval: 75s
      http:
        http1MaxPendingRequests: 50
        http2MaxRequests: 100
        maxRequestsPerConnection: 10
        maxRetries: 3
        consecutiveGatewayErrors: 5
        h2UpgradePolicy: UPGRADE
  
  portLevelSettings:
  - port:
      number: 8000
    outlierDetection:
      # More aggressive circuit breaking for agent coordination
      consecutive5xxErrors: 3
      interval: 30s
      baseEjectionTime: 60s
      maxEjectionPercent: 70

---
# Agent deployment with circuit breaker sidecar
apiVersion: apps/v1
kind: Deployment
metadata:
  name: npa-with-circuit-breaker
  namespace: progressive-framework-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: npa
      version: circuit-breaker
  template:
    metadata:
      labels:
        app: npa
        version: circuit-breaker
      annotations:
        sidecar.istio.io/inject: "true"
    spec:
      containers:
      - name: npa
        image: progressive-agents:latest
        env:
        - name: AGENT_TYPE
          value: "npa"
        - name: CIRCUIT_BREAKER_ENABLED
          value: "true"
        - name: FALLBACK_MODE_ENABLED
          value: "true"
        
        # Circuit breaker configuration
        - name: CB_FAILURE_THRESHOLD
          value: "5"
        - name: CB_RECOVERY_TIMEOUT
          value: "60s"
        - name: CB_SUCCESS_THRESHOLD
          value: "3"
        
        ports:
        - name: http
          containerPort: 8000
        
        # Health checks that work with circuit breaker
        livenessProbe:
          httpGet:
            path: /health/circuit-breaker-aware
            port: 8000
          periodSeconds: 30
          failureThreshold: 5  # More tolerant during circuit breaker activation
        
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          periodSeconds: 10
          failureThreshold: 3
```

---

## **DEPLOYMENT MONITORING & VALIDATION**

### **Deployment Health Validation**
```yaml
# k8s/agents/validation/deployment-validation.yml
apiVersion: batch/v1
kind: Job
metadata:
  name: agent-deployment-validation
  namespace: progressive-framework-prod
spec:
  template:
    spec:
      restartPolicy: OnFailure
      containers:
      - name: deployment-validator
        image: progressive-deployment-validator:latest
        command: ["python", "/app/validate-agent-deployment.py"]
        env:
        - name: NAMESPACE
          value: "progressive-framework-prod"
        - name: VALIDATION_TIMEOUT
          value: "600"  # 10 minutes
        
        # Comprehensive deployment validation script
        command:
        - /bin/bash
        - -c
        - |
          #!/bin/bash
          set -e
          
          echo "🔍 Starting comprehensive agent deployment validation..."
          
          # Phase 1: Infrastructure validation
          echo "🏗️ Phase 1: Infrastructure Validation"
          
          # Check all agent deployments are ready
          AGENTS=("mca-deployment" "npa-deployment" "wpa-deployment")
          
          for agent in "${AGENTS[@]}"; do
            echo "Checking $agent..."
            kubectl rollout status deployment/$agent -n progressive-framework-prod --timeout=300s
            
            # Verify minimum replica count
            READY_REPLICAS=$(kubectl get deployment $agent -n progressive-framework-prod -o jsonpath='{.status.readyReplicas}')
            MIN_REPLICAS=$(kubectl get deployment $agent -n progressive-framework-prod -o jsonpath='{.spec.replicas}')
            
            if [ "$READY_REPLICAS" -lt "$MIN_REPLICAS" ]; then
              echo "❌ $agent: Only $READY_REPLICAS/$MIN_REPLICAS replicas ready"
              exit 1
            fi
            
            echo "✅ $agent: $READY_REPLICAS/$MIN_REPLICAS replicas ready"
          done
          
          # Phase 2: Service connectivity validation
          echo "🔗 Phase 2: Service Connectivity Validation"
          
          SERVICES=("mca-service" "npa-service" "wpa-service")
          
          for service in "${SERVICES[@]}"; do
            echo "Testing connectivity to $service..."
            
            # Test service endpoint
            kubectl run test-pod-$service --rm -i --restart=Never \
              --image=curlimages/curl -- \
              curl -f http://$service.progressive-framework-prod.svc.cluster.local/health
            
            if [ $? -eq 0 ]; then
              echo "✅ $service connectivity verified"
            else
              echo "❌ $service connectivity failed"
              exit 1
            fi
          done
          
          # Phase 3: Agent coordination validation
          echo "🤖 Phase 3: Agent Coordination Validation"
          
          # Test MCA coordination capabilities
          MCA_POD=$(kubectl get pods -l app=mca -n progressive-framework-prod -o jsonpath='{.items[0].metadata.name}')
          
          echo "Testing MCA coordination with $MCA_POD..."
          COORDINATION_TEST=$(kubectl exec $MCA_POD -n progressive-framework-prod -- \
            curl -s http://localhost:8000/api/v1/coordination/test-all-agents | jq -r .success)
          
          if [ "$COORDINATION_TEST" = "true" ]; then
            echo "✅ MCA coordination test passed"
          else
            echo "❌ MCA coordination test failed"
            exit 1
          fi
          
          # Phase 4: Performance validation
          echo "📊 Phase 4: Performance Validation"
          
          # Test agent response times
          for agent_type in mca npa wpa; do
            AGENT_POD=$(kubectl get pods -l app=$agent_type -n progressive-framework-prod -o jsonpath='{.items[0].metadata.name}')
            
            echo "Testing $agent_type response time..."
            START_TIME=$(date +%s%3N)
            kubectl exec $AGENT_POD -n progressive-framework-prod -- \
              curl -s http://localhost:8000/health >/dev/null
            END_TIME=$(date +%s%3N)
            
            RESPONSE_TIME=$((END_TIME - START_TIME))
            echo "$agent_type response time: ${RESPONSE_TIME}ms"
            
            if [ $RESPONSE_TIME -gt 5000 ]; then  # 5 second timeout
              echo "❌ $agent_type response time too high: ${RESPONSE_TIME}ms"
              exit 1
            fi
            
            echo "✅ $agent_type response time acceptable: ${RESPONSE_TIME}ms"
          done
          
          # Phase 5: Data integrity validation
          echo "💾 Phase 5: Data Integrity Validation"
          
          # Test database connectivity from agents
          for agent_type in mca npa wpa; do
            AGENT_POD=$(kubectl get pods -l app=$agent_type -n progressive-framework-prod -o jsonpath='{.items[0].metadata.name}')
            
            echo "Testing $agent_type database connectivity..."
            DB_TEST=$(kubectl exec $AGENT_POD -n progressive-framework-prod -- \
              curl -s http://localhost:8000/health/database | jq -r .connected)
            
            if [ "$DB_TEST" = "true" ]; then
              echo "✅ $agent_type database connectivity verified"
            else
              echo "❌ $agent_type database connectivity failed"
              exit 1
            fi
          done
          
          echo "🎉 All deployment validations passed successfully!"
          
          # Generate deployment report
          cat > /tmp/deployment-report.json <<EOF
          {
            "validation_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
            "validation_status": "success",
            "agents_validated": ["mca", "npa", "wpa"],
            "services_tested": ["mca-service", "npa-service", "wpa-service"],
            "coordination_test": "passed",
            "performance_test": "passed",
            "data_integrity_test": "passed"
          }
          EOF
          
          # Store report in ConfigMap for reference
          kubectl create configmap deployment-validation-report \
            --from-file=/tmp/deployment-report.json \
            -n progressive-framework-prod \
            --dry-run=client -o yaml | kubectl apply -f -
          
          echo "📋 Deployment validation report stored in ConfigMap"
```

---

## **ROLLBACK & DISASTER RECOVERY**

### **Automated Agent Rollback**
```bash
#!/bin/bash
# scripts/agent-rollback.sh

AGENT_TYPE=$1
TARGET_VERSION=$2
REASON=$3

echo "🔄 Starting automated rollback for $AGENT_TYPE agent"
echo "📋 Target version: $TARGET_VERSION"
echo "📝 Reason: $REASON"

# Validate inputs
if [ -z "$AGENT_TYPE" ] || [ -z "$TARGET_VERSION" ]; then
    echo "❌ Usage: $0 <agent_type> <target_version> [reason]"
    exit 1
fi

if [[ ! "$AGENT_TYPE" =~ ^(mca|npa|wpa)$ ]]; then
    echo "❌ Invalid agent type. Must be: mca, npa, or wpa"
    exit 1
fi

# Set namespace
NAMESPACE="progressive-framework-prod"

echo "🚨 EMERGENCY ROLLBACK INITIATED"
echo "Agent: $AGENT_TYPE"
echo "Target Version: $TARGET_VERSION"
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# Step 1: Immediate traffic redirection (if needed)
if [ "$AGENT_TYPE" = "mca" ]; then
    echo "🚦 Redirecting coordination traffic to backup MCA..."
    kubectl patch service mca-service -n $NAMESPACE -p '{"spec":{"selector":{"version":"backup"}}}'
fi

# Step 2: Create rollback deployment
echo "📦 Creating rollback deployment..."
kubectl set image deployment/${AGENT_TYPE}-deployment \
    ${AGENT_TYPE}=progressive-agents:${TARGET_VERSION} \
    -n $NAMESPACE \
    --record

# Step 3: Monitor rollback progress
echo "⏳ Monitoring rollback progress..."
kubectl rollout status deployment/${AGENT_TYPE}-deployment -n $NAMESPACE --timeout=300s

if [ $? -ne 0 ]; then
    echo "❌ Rollback failed - deployment did not complete successfully"
    
    # Emergency fallback
    echo "🚨 Activating emergency fallback..."
    kubectl rollout undo deployment/${AGENT_TYPE}-deployment -n $NAMESPACE --to-revision=2
    exit 1
fi

# Step 4: Validate rollback
echo "✅ Validating rollback..."

# Health check
HEALTH_CHECK=$(kubectl exec -n $NAMESPACE deployment/${AGENT_TYPE}-deployment -- \
    curl -s http://localhost:8000/health | jq -r .status)

if [ "$HEALTH_CHECK" != "healthy" ]; then
    echo "❌ Health check failed after rollback"
    exit 1
fi

# Agent-specific validation
case $AGENT_TYPE in
    "mca")
        echo "🔍 Validating MCA coordination capabilities..."
        COORD_TEST=$(kubectl exec -n $NAMESPACE deployment/mca-deployment -- \
            curl -s http://localhost:8000/api/v1/coordination/test | jq -r .success)
        
        if [ "$COORD_TEST" != "true" ]; then
            echo "❌ MCA coordination test failed"
            exit 1
        fi
        
        # Restore coordination traffic
        kubectl patch service mca-service -n $NAMESPACE -p '{"spec":{"selector":{"app":"mca"}}}'
        ;;
        
    "npa"|"wpa")
        echo "🔍 Validating ${AGENT_TYPE} planning capabilities..."
        PLAN_TEST=$(kubectl exec -n $NAMESPACE deployment/${AGENT_TYPE}-deployment -- \
            curl -s http://localhost:8000/api/v1/planning/test | jq -r .success)
        
        if [ "$PLAN_TEST" != "true" ]; then
            echo "❌ ${AGENT_TYPE} planning test failed"
            exit 1
        fi
        ;;
esac

# Step 5: Create incident record
echo "📝 Creating incident record..."
cat > /tmp/rollback-incident.json <<EOF
{
    "incident_id": "rollback-$(date +%s)",
    "agent_type": "$AGENT_TYPE",
    "rollback_version": "$TARGET_VERSION",
    "rollback_time": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "reason": "$REASON",
    "status": "completed",
    "validation": "passed"
}
EOF

kubectl create configmap rollback-incident-$(date +%s) \
    --from-file=/tmp/rollback-incident.json \
    -n $NAMESPACE

# Step 6: Notify stakeholders
echo "📢 Notifying stakeholders..."
curl -X POST $SLACK_WEBHOOK \
    -H 'Content-type: application/json' \
    -d "{
        \"text\": \"✅ ROLLBACK COMPLETED: $AGENT_TYPE agent rolled back to $TARGET_VERSION\",
        \"channel\": \"#critical-alerts\"
    }"

echo "🎉 Agent rollback completed successfully"
echo "📊 Current deployment status:"
kubectl get deployments -l app=$AGENT_TYPE -n $NAMESPACE
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Agent Lifecycle Management](../02-Agent-Management/Agent-Lifecycle-Management.md)** - Agent management basics
- **[Deployment Guide](Deployment-Guide.md)** - Basic deployment procedures
- **[CI/CD Pipeline](CI-CD-Pipeline.md)** - Automated deployment processes
- **[Container Orchestration](Container-Orchestration.md)** - Kubernetes orchestration
- **[Monitoring & Alerting](Monitoring-Alerting.md)** - Observability stack

### **Follow-up Documents**
- **[Load Balancing & Resource Management](../06-Infrastructure/Load-Balancing-Resource-Management.md)** - Infrastructure scaling strategies

### **Operations Context**
- **[Emergency Procedures & Rollback](../01-Core-System/Emergency-Procedures-Rollback.md)** - Crisis management procedures
- **[Communication Threading Architecture](../03-Communication-Protocols/Communication-Threading-Architecture.md)** - Agent communication patterns

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | DevOps Team | Complete agent deployment strategies implementation |
| 4.x | 2025-08-xx | Dev Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: DevOps Team  
**Last Validated**: 2025-09-02