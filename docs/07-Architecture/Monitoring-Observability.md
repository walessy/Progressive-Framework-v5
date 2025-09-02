---
file: docs/07-Architecture/Monitoring-Observability.md
directory: docs/07-Architecture/
priority: CRITICAL
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# Monitoring & Observability - Progressive-Framework-v5

**File Path**: `docs/07-Architecture/Monitoring-Observability.md`  
**Directory**: `docs/07-Architecture/`  
**Priority**: CRITICAL  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive monitoring and observability architecture for Progressive-Framework-v5, implementing the three pillars of observability: metrics, logs, and traces. This document covers agent-specific monitoring, system health tracking, performance analytics, alerting strategies, and distributed tracing for the multi-agent intelligence system.

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🤖 **[Agent Architecture](Agent-Architecture.md)** - *Multi-agent system design*
- 🚀 **[Deployment Architecture](Deployment-Architecture.md)** - *Deployment strategies and environments*
- 🌐 **[Network Architecture & Security](../06-Infrastructure/Network-Architecture-Security.md)** - *Network topology and security*

---

## **OBSERVABILITY ARCHITECTURE OVERVIEW**

### **Three Pillars Implementation**
```
Progressive-Framework-v5 Observability Stack:

                    OBSERVABILITY PLATFORM
                ┌─────────────────────────────┐
                │       GRAFANA UNIFIED       │
                │      OBSERVABILITY UI       │
                │                             │
                │ • Dashboards & Visualization│
                │ • Alerting & Notifications  │
                │ • Query & Analysis          │
                │ • Incident Management       │
                └─────────────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │   METRICS   │    │    LOGS     │    │   TRACES    │
    │             │    │             │    │             │
    │ Prometheus  │    │    Loki     │    │   Jaeger    │
    │             │    │             │    │             │
    │ • Agent KPIs│    │ • App Logs  │    │ • Distrib.  │
    │ • System    │    │ • Error     │    │   Tracing   │
    │   Health    │    │   Tracking  │    │ • Request   │
    │ • Business  │    │ • Audit     │    │   Journey   │
    │   Metrics   │    │   Trails    │    │ • Latency   │
    └─────────────┘    └─────────────┘    └─────────────┘
            │                  │                  │
            └──────────────────┼──────────────────┘
                               │
                    ┌─────────────────────┐
                    │   AGENT ECOSYSTEM   │
                    │     MONITORING      │
                    │                     │
        ┌───────────┼───────────┬─────────┼───────────┐
        │           │           │         │           │
    ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
    │   MCA   │ │   NPA   │ │   WPA   │ │   BMA   │ │   RPA   │
    │ Monitor │ │ Monitor │ │ Monitor │ │ Monitor │ │ Monitor │
    │         │ │         │ │         │ │         │ │         │
    │• Routing│ │• Meals  │ │• Workout│ │• Budget │ │• Reports│
    │• Health │ │• Nutrit.│ │• Fitness│ │• Finance│ │• Analytics│
    │• Load   │ │• APIs   │ │• Progress│ │• Costs  │ │• Insights│
    └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
                               │
                    ┌─────────────────────┐
                    │ INFRASTRUCTURE      │
                    │ MONITORING          │
                    │                     │
                    │ • Kubernetes Metrics│
                    │ • Container Health  │
                    │ • Database Monitor  │
                    │ • Network Analytics │
                    │ • Security Events   │
                    └─────────────────────┘
```

### **Agent-Specific Monitoring Strategy**
```
Multi-Agent Monitoring Architecture:

┌─────────────────────────────────────────────────────────────────────┐
│                    MASTER CONTROL AGENT (MCA)                      │
│                                                                     │
│  Metrics:                    Logs:                    Traces:       │
│  • Request routing time     • Routing decisions      • Request flow │
│  • Agent selection logic   • Load balancing logs    • End-to-end   │
│  • System coordination     • Error coordination     • Latency      │
│  • Load distribution       • Agent health checks    • Dependencies │
│  • Error recovery rate     • Performance warnings   • Bottlenecks  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                 SPECIALIZED AGENTS (NPA/WPA/BMA)                   │
│                                                                     │
│  Agent-Specific Metrics:           Shared Metrics:                 │
│                                                                     │
│  NPA: • Meal plan generation      • Response time                  │
│       • Nutrition API calls       • Success rate                   │
│       • Calorie calculations      • Error count                    │
│                                   • Memory usage                   │
│  WPA: • Workout plan creation     • CPU utilization               │
│       • Exercise recommendations  • Request queue                 │
│       • Fitness API integrations  • Health status                 │
│                                                                     │
│  BMA: • Budget calculations       • Agent uptime                   │
│       • Financial API calls       • Coordination calls            │
│       • Cost optimizations        • Cache hit rate               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      SYSTEM-WIDE OBSERVABILITY                     │
│                                                                     │
│  Business Metrics:              Technical Metrics:                 │
│  • User satisfaction scores    • Service availability (99.9%)     │
│  • Feature adoption rates      • API response times (<200ms)      │
│  • Agent utilization balance   • Database connection pools        │
│  • Cross-agent collaboration   • Message queue depths             │
│  • Customer journey analytics  • Resource utilization trends      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## **METRICS COLLECTION & MONITORING**

### **Prometheus Configuration for Agents**
```yaml
# config/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'progressive-framework-v5'
    environment: 'production'

rule_files:
  - "progressive_framework_rules.yml"
  - "agent_specific_rules.yml"
  - "sla_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  # Master Control Agent (MCA) metrics
  - job_name: 'mca'
    static_configs:
      - targets: ['mca-service:3000']
    metrics_path: '/api/v1/metrics'
    scrape_interval: 10s
    scrape_timeout: 5s
    params:
      format: ['prometheus']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        regex: '([^:]+):.*'
        replacement: '${1}'
      - target_label: agent_type
        replacement: 'mca'
      - target_label: tier
        replacement: 'control-plane'

  # Nutrition Planning Agent (NPA) metrics
  - job_name: 'npa'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names: ['progressive-framework-v5']
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: npa
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
      - target_label: agent_type
        replacement: 'npa'

  # Workout Planning Agent (WPA) metrics  
  - job_name: 'wpa'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names: ['progressive-framework-v5']
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: wpa
      - target_label: agent_type
        replacement: 'wpa'
    # Similar configuration as NPA

  # Budget Management Agent (BMA) metrics
  - job_name: 'bma'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names: ['progressive-framework-v5']
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: bma
      - target_label: agent_type
        replacement: 'bma'

  # Infrastructure metrics
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true

  # Node metrics
  - job_name: 'kubernetes-nodes'
    kubernetes_sd_configs:
      - role: node
    relabel_configs:
      - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)

  # Database metrics
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
    metrics_path: '/metrics'

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']

  - job_name: 'mongodb'
    static_configs:
      - targets: ['mongodb-exporter:9216']
```

### **Custom Agent Metrics Implementation**
```javascript
// src/monitoring/agent-metrics.js
const promClient = require('prom-client');

class AgentMetrics {
  constructor(agentType, agentId) {
    this.agentType = agentType;
    this.agentId = agentId;
    
    // Create custom registry for this agent
    this.register = new promClient.Registry();
    
    // Add default Node.js metrics
    promClient.collectDefaultMetrics({ 
      register: this.register,
      prefix: `${agentType}_`
    });
    
    // Initialize custom metrics
    this.initializeMetrics();
  }

  initializeMetrics() {
    // Request metrics
    this.requestDuration = new promClient.Histogram({
      name: `${this.agentType}_request_duration_seconds`,
      help: `Duration of ${this.agentType} requests in seconds`,
      labelNames: ['method', 'status_code', 'endpoint'],
      buckets: [0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.register]
    });

    this.requestsTotal = new promClient.Counter({
      name: `${this.agentType}_requests_total`,
      help: `Total number of ${this.agentType} requests`,
      labelNames: ['method', 'status_code', 'endpoint'],
      registers: [this.register]
    });

    // Agent health metrics
    this.agentHealth = new promClient.Gauge({
      name: `${this.agentType}_health_status`,
      help: `Health status of ${this.agentType} (1=healthy, 0=unhealthy)`,
      labelNames: ['agent_id', 'version'],
      registers: [this.register]
    });

    this.activeConnections = new promClient.Gauge({
      name: `${this.agentType}_active_connections`,
      help: `Number of active connections to ${this.agentType}`,
      labelNames: ['agent_id'],
      registers: [this.register]
    });

    // Agent-specific business metrics
    this.initializeBusinessMetrics();
  }

  initializeBusinessMetrics() {
    switch (this.agentType) {
      case 'mca':
        this.initializeMCAMetrics();
        break;
      case 'npa':
        this.initializeNPAMetrics();
        break;
      case 'wpa':
        this.initializeWPAMetrics();
        break;
      case 'bma':
        this.initializeBMAMetrics();
        break;
    }
  }

  initializeMCAMetrics() {
    // MCA-specific metrics
    this.routingDecisions = new promClient.Counter({
      name: 'mca_routing_decisions_total',
      help: 'Total number of routing decisions made by MCA',
      labelNames: ['strategy', 'target_agent', 'success'],
      registers: [this.register]
    });

    this.agentLoadBalance = new promClient.Gauge({
      name: 'mca_agent_load_balance',
      help: 'Load balance distribution across agents',
      labelNames: ['target_agent'],
      registers: [this.register]
    });

    this.coordinationLatency = new promClient.Histogram({
      name: 'mca_coordination_latency_seconds',
      help: 'Latency of agent coordination requests',
      labelNames: ['coordination_type'],
      buckets: [0.1, 0.25, 0.5, 1, 2, 5],
      registers: [this.register]
    });

    this.systemErrors = new promClient.Counter({
      name: 'mca_system_errors_total',
      help: 'Total number of system errors encountered by MCA',
      labelNames: ['error_type', 'recovery_action'],
      registers: [this.register]
    });
  }

  initializeNPAMetrics() {
    // NPA-specific metrics
    this.mealPlansGenerated = new promClient.Counter({
      name: 'npa_meal_plans_generated_total',
      help: 'Total number of meal plans generated',
      labelNames: ['plan_type', 'dietary_restrictions'],
      registers: [this.register]
    });

    this.nutritionApiCalls = new promClient.Counter({
      name: 'npa_nutrition_api_calls_total',
      help: 'Total number of external nutrition API calls',
      labelNames: ['api_provider', 'status'],
      registers: [this.register]
    });

    this.calorieCalculations = new promClient.Counter({
      name: 'npa_calorie_calculations_total',
      help: 'Total number of calorie calculations performed',
      labelNames: ['calculation_type'],
      registers: [this.register]
    });

    this.userSatisfactionScore = new promClient.Gauge({
      name: 'npa_user_satisfaction_score',
      help: 'User satisfaction score for nutrition plans (1-5)',
      labelNames: ['plan_category'],
      registers: [this.register]
    });
  }

  initializeWPAMetrics() {
    // WPA-specific metrics
    this.workoutPlansGenerated = new promClient.Counter({
      name: 'wpa_workout_plans_generated_total',
      help: 'Total number of workout plans generated',
      labelNames: ['plan_type', 'fitness_level', 'equipment'],
      registers: [this.register]
    });

    this.exerciseRecommendations = new promClient.Counter({
      name: 'wpa_exercise_recommendations_total',
      help: 'Total number of exercise recommendations made',
      labelNames: ['muscle_group', 'difficulty'],
      registers: [this.register]
    });

    this.fitnessApiCalls = new promClient.Counter({
      name: 'wpa_fitness_api_calls_total',
      help: 'Total number of external fitness API calls',
      labelNames: ['api_provider', 'status'],
      registers: [this.register]
    });

    this.workoutCompletionRate = new promClient.Gauge({
      name: 'wpa_workout_completion_rate',
      help: 'Workout completion rate percentage',
      labelNames: ['plan_type'],
      registers: [this.register]
    });
  }

  initializeBMAMetrics() {
    // BMA-specific metrics
    this.budgetsCreated = new promClient.Counter({
      name: 'bma_budgets_created_total',
      help: 'Total number of budgets created',
      labelNames: ['budget_type', 'period'],
      registers: [this.register]
    });

    this.expenseAnalyses = new promClient.Counter({
      name: 'bma_expense_analyses_total',
      help: 'Total number of expense analyses performed',
      labelNames: ['analysis_type'],
      registers: [this.register]
    });

    this.savingsIdentified = new promClient.Gauge({
      name: 'bma_savings_identified_dollars',
      help: 'Total savings identified in dollars',
      labelNames: ['category'],
      registers: [this.register]
    });

    this.budgetCompliance = new promClient.Gauge({
      name: 'bma_budget_compliance_percentage',
      help: 'Budget compliance percentage',
      labelNames: ['user_id', 'category'],
      registers: [this.register]
    });
  }

  // Metric recording methods
  recordRequest(method, endpoint, statusCode, duration) {
    const labels = { method, endpoint, status_code: statusCode };
    
    this.requestsTotal.inc(labels);
    this.requestDuration.observe(labels, duration / 1000); // Convert to seconds
  }

  updateHealth(isHealthy) {
    this.agentHealth.set(
      { agent_id: this.agentId, version: process.env.VERSION || '5.0.0' },
      isHealthy ? 1 : 0
    );
  }

  updateActiveConnections(count) {
    this.activeConnections.set({ agent_id: this.agentId }, count);
  }

  // Business metric recording methods
  recordRoutingDecision(strategy, targetAgent, success) {
    if (this.agentType === 'mca') {
      this.routingDecisions.inc({
        strategy,
        target_agent: targetAgent,
        success: success.toString()
      });
    }
  }

  recordMealPlanGeneration(planType, dietaryRestrictions) {
    if (this.agentType === 'npa') {
      this.mealPlansGenerated.inc({
        plan_type: planType,
        dietary_restrictions: dietaryRestrictions || 'none'
      });
    }
  }

  recordWorkoutPlanGeneration(planType, fitnessLevel, equipment) {
    if (this.agentType === 'wpa') {
      this.workoutPlansGenerated.inc({
        plan_type: planType,
        fitness_level: fitnessLevel,
        equipment: equipment || 'bodyweight'
      });
    }
  }

  recordBudgetCreation(budgetType, period) {
    if (this.agentType === 'bma') {
      this.budgetsCreated.inc({
        budget_type: budgetType,
        period
      });
    }
  }

  // Get metrics for Prometheus scraping
  getMetrics() {
    return this.register.metrics();
  }

  // Get metrics as JSON for internal monitoring
  getMetricsJson() {
    return promClient.register.getMetricsAsJSON();
  }
}

module.exports = { AgentMetrics };
```

### **Alerting Rules Configuration**
```yaml
# config/prometheus/progressive_framework_rules.yml
groups:
  - name: progressive_framework.rules
    interval: 30s
    rules:
    # MCA Health and Performance
    - alert: MCAHighResponseTime
      expr: histogram_quantile(0.95, rate(mca_request_duration_seconds_bucket[5m])) > 2
      for: 2m
      labels:
        severity: warning
        service: mca
        tier: control-plane
      annotations:
        summary: "MCA response time is high"
        description: "MCA 95th percentile response time is {{ $value }}s, above the 2s threshold"
        runbook_url: "https://docs.progressive-framework.com/runbooks/mca-performance"

    - alert: MCAHighErrorRate
      expr: rate(mca_requests_total{status_code=~"5.."}[5m]) / rate(mca_requests_total[5m]) > 0.05
      for: 1m
      labels:
        severity: critical
        service: mca
        tier: control-plane
      annotations:
        summary: "MCA error rate is high"
        description: "MCA error rate is {{ $value | humanizePercentage }}, above 5% threshold"
        runbook_url: "https://docs.progressive-framework.com/runbooks/mca-errors"

    - alert: MCAAgentDown
      expr: up{job="mca"} == 0
      for: 1m
      labels:
        severity: critical
        service: mca
        tier: control-plane
      annotations:
        summary: "MCA is down"
        description: "Master Control Agent has been down for more than 1 minute"
        runbook_url: "https://docs.progressive-framework.com/runbooks/mca-down"

    # Agent Health Monitoring
    - alert: AgentUnhealthy
      expr: agent_health_status < 1
      for: 2m
      labels:
        severity: warning
        service: "{{ $labels.agent_type }}"
        tier: agents
      annotations:
        summary: "Agent {{ $labels.agent_type }} is unhealthy"
        description: "Agent {{ $labels.agent_type }} ({{ $labels.agent_id }}) has been unhealthy for more than 2 minutes"

    - alert: AgentHighMemoryUsage
      expr: (process_resident_memory_bytes / 1024 / 1024) > 1024
      for: 5m
      labels:
        severity: warning
        tier: agents
      annotations:
        summary: "Agent {{ $labels.agent_type }} high memory usage"
        description: "Agent {{ $labels.agent_type }} is using {{ $value }}MB of memory, above 1GB threshold"

    # Business Logic Alerts
    - alert: NPAMealPlanGenerationFailure
      expr: increase(npa_requests_total{status_code=~"5..", endpoint=~".*meal.*plan.*"}[10m]) > 5
      for: 0m
      labels:
        severity: warning
        service: npa
        business_impact: high
      annotations:
        summary: "NPA meal plan generation failures"
        description: "NPA has had {{ $value }} meal plan generation failures in the last 10 minutes"

    - alert: WPAWorkoutRecommendationFailure
      expr: increase(wpa_requests_total{status_code=~"5..", endpoint=~".*workout.*"}[10m]) > 5
      for: 0m
      labels:
        severity: warning
        service: wpa
        business_impact: high
      annotations:
        summary: "WPA workout recommendation failures"
        description: "WPA has had {{ $value }} workout recommendation failures in the last 10 minutes"

    # System-wide SLA Monitoring
    - alert: SystemAvailabilityBelow99_9
      expr: |
        (
          sum(rate(requests_total{status_code!~"5.."}[5m])) /
          sum(rate(requests_total[5m]))
        ) < 0.999
      for: 5m
      labels:
        severity: critical
        sla: availability
      annotations:
        summary: "System availability below 99.9%"
        description: "System availability is {{ $value | humanizePercentage }}, below SLA threshold"

    - alert: AverageResponseTimeAboveSLA
      expr: |
        histogram_quantile(0.95,
          sum(rate(request_duration_seconds_bucket[5m])) by (le)
        ) > 0.5
      for: 3m
      labels:
        severity: warning
        sla: performance
      annotations:
        summary: "Average response time above SLA"
        description: "95th percentile response time is {{ $value }}s, above 500ms SLA"

  - name: infrastructure.rules
    interval: 30s
    rules:
    # Database Connectivity
    - alert: PostgreSQLDown
      expr: up{job="postgres"} == 0
      for: 1m
      labels:
        severity: critical
        service: postgresql
        tier: database
      annotations:
        summary: "PostgreSQL is down"
        description: "PostgreSQL database has been unreachable for more than 1 minute"

    - alert: RedisDown
      expr: up{job="redis"} == 0
      for: 1m
      labels:
        severity: critical
        service: redis
        tier: cache
      annotations:
        summary: "Redis is down"
        description: "Redis cache has been unreachable for more than 1 minute"

    # Kubernetes Resources
    - alert: HighPodCPUUsage
      expr: |
        (
          rate(container_cpu_usage_seconds_total{namespace="progressive-framework-v5"}[5m]) * 100
        ) > 80
      for: 5m
      labels:
        severity: warning
        tier: infrastructure
      annotations:
        summary: "High CPU usage on pod {{ $labels.pod }}"
        description: "Pod {{ $labels.pod }} has been using {{ $value }}% CPU for more than 5 minutes"

    - alert: PodRestartLoop
      expr: |
        increase(kube_pod_container_status_restarts_total{namespace="progressive-framework-v5"}[1h]) > 3
      for: 0m
      labels:
        severity: warning
        tier: infrastructure
      annotations:
        summary: "Pod {{ $labels.pod }} is restart looping"
        description: "Pod {{ $labels.pod }} has restarted {{ $value }} times in the last hour"
```

---

## **LOGGING & LOG AGGREGATION**

### **Structured Logging Implementation**
```javascript
// src/monitoring/structured-logger.js
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

class StructuredLogger {
  constructor(agentType, agentId) {
    this.agentType = agentType;
    this.agentId = agentId;
    this.logger = this.createLogger();
  }

  createLogger() {
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.printf((info) => {
        return JSON.stringify({
          timestamp: info.timestamp,
          level: info.level,
          message: info.message,
          agent_type: this.agentType,
          agent_id: this.agentId,
          correlation_id: info.correlationId || null,
          request_id: info.requestId || null,
          user_id: info.userId || null,
          trace_id: info.traceId || null,
          span_id: info.spanId || null,
          stack: info.stack || null,
          ...info.metadata
        });
      })
    );

    const transports = [
      // Console transport for development
      new winston.transports.Console({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }),

      // File transport for persistent logs
      new winston.transports.File({
        filename: `/app/logs/${this.agentType}-error.log`,
        level: 'error',
        format: logFormat,
        maxsize: 50 * 1024 * 1024, // 50MB
        maxFiles: 5,
        tailable: true
      }),

      new winston.transports.File({
        filename: `/app/logs/${this.agentType}-combined.log`,
        format: logFormat,
        maxsize: 100 * 1024 * 1024, // 100MB
        maxFiles: 3,
        tailable: true
      })
    ];

    // Add Elasticsearch transport for production
    if (process.env.ELASTICSEARCH_URL) {
      transports.push(
        new ElasticsearchTransport({
          level: 'info',
          clientOpts: {
            node: process.env.ELASTICSEARCH_URL,
            auth: {
              username: process.env.ELASTICSEARCH_USERNAME,
              password: process.env.ELASTICSEARCH_PASSWORD
            }
          },
          index: `progressive-framework-v5-${new Date().toISOString().slice(0, 7)}`, // monthly indices
          indexTemplate: {
            name: 'progressive-framework-v5',
            body: {
              index_patterns: ['progressive-framework-v5-*'],
              settings: {
                number_of_shards: 2,
                number_of_replicas: 1,
                'index.lifecycle.name': 'progressive-framework-policy',
                'index.lifecycle.rollover_alias': 'progressive-framework-logs'
              },
              mappings: {
                properties: {
                  timestamp: { type: 'date' },
                  level: { type: 'keyword' },
                  message: { type: 'text' },
                  agent_type: { type: 'keyword' },
                  agent_id: { type: 'keyword' },
                  correlation_id: { type: 'keyword' },
                  request_id: { type: 'keyword' },
                  user_id: { type: 'keyword' },
                  trace_id: { type: 'keyword' },
                  span_id: { type: 'keyword' }
                }
              }
            }
          }
        })
      );
    }

    // Add Loki transport for Grafana integration
    if (process.env.LOKI_URL) {
      transports.push(
        new LokiTransport({
          host: process.env.LOKI_URL,
          labels: {
            app: 'progressive-framework-v5',
            agent_type: this.agentType,
            environment: process.env.NODE_ENV || 'production'
          },
          json: true,
          format: logFormat
        })
      );
    }

    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      defaultMeta: {
        service: 'progressive-framework-v5',
        agent_type: this.agentType,
        agent_id: this.agentId
      },
      transports,
      exceptionHandlers: [
        new winston.transports.File({
          filename: `/app/logs/${this.agentType}-exceptions.log`,
          format: logFormat
        })
      ],
      rejectionHandlers: [
        new winston.transports.File({
          filename: `/app/logs/${this.agentType}-rejections.log`,
          format: logFormat
        })
      ]
    });
  }

  // Structured logging methods
  logRequest(requestId, method, endpoint, userId = null, correlationId = null) {
    this.logger.info('Request received', {
      requestId,
      method,
      endpoint,
      userId,
      correlationId,
      event_type: 'request_start'
    });
  }

  logResponse(requestId, statusCode, duration, correlationId = null) {
    this.logger.info('Request completed', {
      requestId,
      statusCode,
      duration,
      correlationId,
      event_type: 'request_end'
    });
  }

  logAgentInteraction(targetAgent, action, requestId, correlationId) {
    this.logger.info('Agent interaction', {
      target_agent: targetAgent,
      action,
      requestId,
      correlationId,
      event_type: 'agent_interaction'
    });
  }

  logBusinessEvent(eventType, data, userId = null, correlationId = null) {
    this.logger.info('Business event', {
      event_type: eventType,
      business_data: data,
      userId,
      correlationId
    });
  }

  logError(error, context = {}) {
    this.logger.error(error.message, {
      error_type: error.constructor.name,
      stack: error.stack,
      ...context,
      event_type: 'error'
    });
  }

  logPerformanceMetric(metricName, value, unit = 'ms', context = {}) {
    this.logger.info('Performance metric', {
      metric_name: metricName,
      metric_value: value,
      metric_unit: unit,
      ...context,
      event_type: 'performance'
    });
  }

  logSecurityEvent(eventType, details, userId = null, ipAddress = null) {
    this.logger.warn('Security event', {
      security_event_type: eventType,
      details,
      userId,
      ip_address: ipAddress,
      event_type: 'security'
    });
  }

  // Agent-specific logging methods
  logMCARouting(strategy, targetAgent, confidence, requestId) {
    if (this.agentType === 'mca') {
      this.logger.info('MCA routing decision', {
        routing_strategy: strategy,
        target_agent: targetAgent,
        confidence,
        requestId,
        event_type: 'mca_routing'
      });
    }
  }

  logNPAMealPlan(planType, mealCount, calorieTarget, restrictions) {
    if (this.agentType === 'npa') {
      this.logger.info('Meal plan generated', {
        plan_type: planType,
        meal_count: mealCount,
        calorie_target: calorieTarget,
        dietary_restrictions: restrictions,
        event_type: 'meal_plan_generated'
      });
    }
  }

  logWPAWorkoutPlan(planType, duration, exercises, fitnessLevel) {
    if (this.agentType === 'wpa') {
      this.logger.info('Workout plan generated', {
        plan_type: planType,
        duration,
        exercise_count: exercises.length,
        fitness_level: fitnessLevel,
        event_type: 'workout_plan_generated'
      });
    }
  }

  logBMABudgetAnalysis(budgetType, totalAmount, categories, savingsIdentified) {
    if (this.agentType === 'bma') {
      this.logger.info('Budget analysis completed', {
        budget_type: budgetType,
        total_amount: totalAmount,
        category_count: categories.length,
        savings_identified: savingsIdentified,
        event_type: 'budget_analysis_completed'
      });
    }
  }

  // Create child logger with additional context
  child(context) {
    return {
      ...this,
      logger: this.logger.child(context)
    };
  }
}

// Custom Loki Transport (simplified implementation)
class LokiTransport extends winston.Transport {
  constructor(options) {
    super(options);
    this.host = options.host;
    this.labels = options.labels || {};
    this.json = options.json || false;
  }

  log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    // Send to Loki (implementation would use actual Loki client)
    const logEntry = {
      streams: [{
        stream: this.labels,
        values: [[
          (Date.now() * 1000000).toString(), // nanosecond timestamp
          this.json ? JSON.stringify(info) : info.message
        ]]
      }]
    };

    // In real implementation, this would be an HTTP POST to Loki
    console.log('Sending to Loki:', JSON.stringify(logEntry));

    callback();
  }
}

module.exports = { StructuredLogger };
```

### **Loki Configuration for Log Aggregation**
```yaml
# config/loki/loki-config.yml
auth_enabled: false

server:
  http_listen_port: 3100
  grpc_listen_port: 9096

common:
  path_prefix: /loki
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    instance_addr: 127.0.0.1
    kvstore:
      store: inmemory

query_range:
  results_cache:
    cache:
      embedded_cache:
        enabled: true
        max_size_mb: 100

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: progressive_framework_index_
        period: 24h

ruler:
  alertmanager_url: http://alertmanager:9093

# Progressive Framework specific configuration
limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h
  ingestion_rate_mb: 16
  ingestion_burst_size_mb: 32

chunk_store_config:
  max_look_back_period: 0s

table_manager:
  retention_deletes_enabled: true
  retention_period: 336h  # 2 weeks retention

frontend:
  compress_responses: true
  log_queries_longer_than: 5s

query_scheduler:
  max_outstanding_requests_per_tenant: 256

analytics:
  reporting_enabled: false
```

---

## **DISTRIBUTED TRACING**

### **Jaeger Integration for Request Tracing**
```javascript
// src/monitoring/distributed-tracing.js
const { initTracer } = require('jaeger-client');
const opentracing = require('opentracing');

class DistributedTracing {
  constructor(agentType, agentId) {
    this.agentType = agentType;
    this.agentId = agentId;
    this.tracer = this.initializeTracer();
  }

  initializeTracer() {
    const config = {
      serviceName: `progressive-framework-${this.agentType}`,
      sampler: {
        type: 'probabilistic',
        param: process.env.NODE_ENV === 'production' ? 0.1 : 1.0 // Sample 10% in prod, 100% in dev
      },
      reporter: {
        logSpans: process.env.NODE_ENV !== 'production',
        agentHost: process.env.JAEGER_AGENT_HOST || 'jaeger-agent',
        agentPort: process.env.JAEGER_AGENT_PORT || 6832,
        collectorEndpoint: process.env.JAEGER_COLLECTOR_ENDPOINT,
        flushIntervalMs: 2000
      },
      tags: {
        'agent.type': this.agentType,
        'agent.id': this.agentId,
        'version': process.env.VERSION || '5.0.0',
        'environment': process.env.NODE_ENV || 'production'
      }
    };

    const tracer = initTracer(config);
    opentracing.initGlobalTracer(tracer);
    
    return tracer;
  }

  // Start a new trace for incoming requests
  startTrace(operationName, parentSpanContext = null) {
    const spanOptions = {
      tags: {
        'component': this.agentType,
        'span.kind': 'server'
      }
    };

    if (parentSpanContext) {
      spanOptions.childOf = parentSpanContext;
    }

    const span = this.tracer.startSpan(operationName, spanOptions);
    
    // Add agent-specific tags
    span.setTag('agent.type', this.agentType);
    span.setTag('agent.id', this.agentId);
    
    return span;
  }

  // Start a child span for outgoing requests or internal operations
  startChildSpan(parentSpan, operationName, tags = {}) {
    const span = this.tracer.startSpan(operationName, {
      childOf: parentSpan,
      tags: {
        'component': this.agentType,
        ...tags
      }
    });

    return span;
  }

  // Trace agent-to-agent communication
  traceAgentCall(parentSpan, targetAgent, operation, payload) {
    const span = this.startChildSpan(parentSpan, `call.${targetAgent}.${operation}`, {
      'span.kind': 'client',
      'agent.target': targetAgent,
      'operation': operation,
      'payload.size': JSON.stringify(payload).length
    });

    // Inject trace context for propagation
    const headers = {};
    this.tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, headers);

    return { span, headers };
  }

  // Trace external API calls
  traceExternalCall(parentSpan, apiName, endpoint, method = 'GET') {
    const span = this.startChildSpan(parentSpan, `external.${apiName}`, {
      'span.kind': 'client',
      'http.method': method,
      'http.url': endpoint,
      'external.api': apiName
    });

    return span;
  }

  // Trace database operations
  traceDatabaseOperation(parentSpan, operation, table, query = null) {
    const span = this.startChildSpan(parentSpan, `db.${operation}`, {
      'span.kind': 'client',
      'db.operation': operation,
      'db.table': table,
      'component': 'database'
    });

    if (query) {
      span.setTag('db.statement', query);
    }

    return span;
  }

  // Trace business operations
  traceBusinessOperation(parentSpan, operationType, details = {}) {
    const span = this.startChildSpan(parentSpan, `business.${operationType}`, {
      'business.operation': operationType,
      'span.kind': 'internal',
      ...details
    });

    return span;
  }

  // Extract trace context from incoming headers
  extractTraceContext(headers) {
    try {
      return this.tracer.extract(opentracing.FORMAT_HTTP_HEADERS, headers);
    } catch (error) {
      console.warn('Failed to extract trace context:', error.message);
      return null;
    }
  }

  // Add error information to span
  recordError(span, error) {
    span.setTag(opentracing.Tags.ERROR, true);
    span.setTag('error.type', error.constructor.name);
    span.setTag('error.message', error.message);
    
    if (error.stack) {
      span.log({
        event: 'error',
        'error.object': error,
        'error.kind': 'Exception',
        message: error.message,
        stack: error.stack
      });
    }
  }

  // Record performance metrics in span
  recordMetrics(span, metrics) {
    Object.entries(metrics).forEach(([key, value]) => {
      span.setTag(`metrics.${key}`, value);
    });
  }

  // Finish span with optional result
  finishSpan(span, result = null, error = null) {
    if (error) {
      this.recordError(span, error);
    }

    if (result) {
      span.setTag('result.success', true);
      span.log({
        event: 'result',
        result: typeof result === 'object' ? JSON.stringify(result) : result
      });
    }

    span.finish();
  }

  // Create trace-aware middleware for Express
  createTracingMiddleware() {
    return (req, res, next) => {
      const parentSpanContext = this.extractTraceContext(req.headers);
      const span = this.startTrace(`${req.method} ${req.path}`, parentSpanContext);

      // Add request details to span
      span.setTag(opentracing.Tags.HTTP_METHOD, req.method);
      span.setTag(opentracing.Tags.HTTP_URL, req.url);
      span.setTag('http.path', req.path);
      span.setTag('http.user_agent', req.get('User-Agent'));

      if (req.user && req.user.id) {
        span.setTag('user.id', req.user.id);
      }

      // Add correlation ID if present
      if (req.headers['x-correlation-id']) {
        span.setTag('correlation.id', req.headers['x-correlation-id']);
      }

      // Store span in request object for use in handlers
      req.span = span;

      // Capture response details
      res.on('finish', () => {
        span.setTag(opentracing.Tags.HTTP_STATUS_CODE, res.statusCode);
        
        if (res.statusCode >= 400) {
          span.setTag(opentracing.Tags.ERROR, true);
        }

        this.finishSpan(span);
      });

      next();
    };
  }

  // Agent-specific tracing methods
  traceMCARouting(parentSpan, strategy, candidates, selectedAgent) {
    const span = this.startChildSpan(parentSpan, 'mca.routing', {
      'routing.strategy': strategy,
      'routing.candidates': candidates.length,
      'routing.selected': selectedAgent,
      'business.operation': 'agent_selection'
    });

    span.log({
      event: 'routing_decision',
      strategy,
      candidates,
      selected: selectedAgent,
      timestamp: Date.now()
    });

    return span;
  }

  traceNPAMealPlanning(parentSpan, parameters) {
    const span = this.startChildSpan(parentSpan, 'npa.meal_planning', {
      'meal_plan.type': parameters.type,
      'meal_plan.duration': parameters.duration,
      'meal_plan.calories': parameters.targetCalories,
      'business.operation': 'meal_plan_generation'
    });

    if (parameters.restrictions && parameters.restrictions.length > 0) {
      span.setTag('meal_plan.restrictions', parameters.restrictions.join(','));
    }

    return span;
  }

  traceWPAWorkoutPlanning(parentSpan, parameters) {
    const span = this.startChildSpan(parentSpan, 'wpa.workout_planning', {
      'workout.type': parameters.type,
      'workout.duration': parameters.duration,
      'workout.level': parameters.fitnessLevel,
      'business.operation': 'workout_plan_generation'
    });

    if (parameters.equipment) {
      span.setTag('workout.equipment', parameters.equipment.join(','));
    }

    return span;
  }

  traceBMABudgetAnalysis(parentSpan, parameters) {
    const span = this.startChildSpan(parentSpan, 'bma.budget_analysis', {
      'budget.type': parameters.type,
      'budget.period': parameters.period,
      'budget.amount': parameters.totalAmount,
      'business.operation': 'budget_analysis'
    });

    return span;
  }

  // Get current trace ID for correlation
  getCurrentTraceId() {
    const activeSpan = opentracing.globalTracer().activeSpan;
    if (activeSpan) {
      return activeSpan.context().toTraceId();
    }
    return null;
  }

  // Get current span ID
  getCurrentSpanId() {
    const activeSpan = opentracing.globalTracer().activeSpan;
    if (activeSpan) {
      return activeSpan.context().toSpanId();
    }
    return null;
  }
}

module.exports = { DistributedTracing };
```

### **Jaeger Deployment Configuration**
```yaml
# k8s/monitoring/jaeger.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger-deployment
  namespace: progressive-framework-v5
  labels:
    app: jaeger
    component: all-in-one
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jaeger
  template:
    metadata:
      labels:
        app: jaeger
        component: all-in-one
    spec:
      containers:
      - name: jaeger
        image: jaegertracing/all-in-one:1.47
        ports:
        - containerPort: 5775
          protocol: UDP
          name: zk-compact-trft
        - containerPort: 6831
          protocol: UDP
          name: jg-compact-trft
        - containerPort: 6832
          protocol: UDP
          name: jg-binary-trft
        - containerPort: 5778
          protocol: TCP
          name: config-rest
        - containerPort: 16686
          protocol: TCP
          name: query-http
        - containerPort: 9411
          protocol: TCP
          name: zipkin
        env:
        - name: COLLECTOR_ZIPKIN_HOST_PORT
          value: ":9411"
        - name: QUERY_BASE_PATH
          value: "/jaeger"
        - name: SPAN_STORAGE_TYPE
          value: "elasticsearch"
        - name: ES_SERVER_URLS
          value: "http://elasticsearch:9200"
        - name: ES_TAGS_AS_FIELDS_ALL
          value: "true"
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi

---
apiVersion: v1
kind: Service
metadata:
  name: jaeger-service
  namespace: progressive-framework-v5
  labels:
    app: jaeger
spec:
  ports:
  - name: query-http
    port: 80
    targetPort: 16686
    protocol: TCP
  - name: config-rest
    port: 5778
    targetPort: 5778
    protocol: TCP
  - name: jg-compact-trft-udp
    port: 6831
    targetPort: 6831
    protocol: UDP
  - name: jg-binary-trft-udp
    port: 6832
    targetPort: 6832
    protocol: UDP
  - name: zipkin
    port: 9411
    targetPort: 9411
    protocol: TCP
  selector:
    app: jaeger
  type: ClusterIP
```

---

## **COMPREHENSIVE DASHBOARDS**

### **MCA Performance Dashboard**
```json
{
  "dashboard": {
    "id": null,
    "title": "Progressive Framework V5 - Master Control Agent (MCA)",
    "tags": ["progressive-framework", "mca", "control-plane"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "MCA Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(mca_requests_total[5m])",
            "legendFormat": "Requests/sec",
            "refId": "A"
          }
        ],
        "yAxes": [
          {
            "label": "Requests per second"
          }
        ]
      },
      {
        "id": 2,
        "title": "MCA Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.50, rate(mca_request_duration_seconds_bucket[5m]))",
            "legendFormat": "50th percentile"
          },
          {
            "expr": "histogram_quantile(0.95, rate(mca_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.99, rate(mca_request_duration_seconds_bucket[5m]))",
            "legendFormat": "99th percentile"
          }
        ],
        "yAxes": [
          {
            "label": "Response time (seconds)"
          }
        ]
      },
      {
        "id": 3,
        "title": "Routing Decisions",
        "type": "stat",
        "targets": [
          {
            "expr": "sum by (strategy) (mca_routing_decisions_total)",
            "legendFormat": "{{ strategy }}"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "palette-classic"
            },
            "custom": {
              "displayMode": "basic"
            }
          }
        }
      },
      {
        "id": 4,
        "title": "Agent Load Distribution",
        "type": "bargauge",
        "targets": [
          {
            "expr": "mca_agent_load_balance",
            "legendFormat": "{{ target_agent }}"
          }
        ]
      },
      {
        "id": 5,
        "title": "System Coordination Latency",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(mca_coordination_latency_seconds_bucket[5m]))",
            "legendFormat": "{{ coordination_type }}"
          }
        ]
      },
      {
        "id": 6,
        "title": "Error Rate by Type",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(mca_system_errors_total[5m])",
            "legendFormat": "{{ error_type }}"
          }
        ],
        "yAxes": [
          {
            "label": "Errors per second"
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

### **Agent Health Overview Dashboard**
```json
{
  "dashboard": {
    "id": null,
    "title": "Progressive Framework V5 - Agent Health Overview",
    "tags": ["progressive-framework", "agents", "health"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Agent Status Overview",
        "type": "stat",
        "targets": [
          {
            "expr": "count by (agent_type) (up{job=~\".*-service\"})",
            "legendFormat": "{{ agent_type }} - Running"
          },
          {
            "expr": "count by (agent_type) (agent_health_status == 1)",
            "legendFormat": "{{ agent_type }} - Healthy"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "thresholds"
            },
            "thresholds": {
              "steps": [
                {"color": "red", "value": 0},
                {"color": "yellow", "value": 1},
                {"color": "green", "value": 2}
              ]
            }
          }
        }
      },
      {
        "id": 2,
        "title": "Request Success Rate by Agent",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(requests_total{status_code!~\"5..\"}[5m]) / rate(requests_total[5m]) * 100",
            "legendFormat": "{{ agent_type }}"
          }
        ],
        "yAxes": [
          {
            "label": "Success Rate (%)",
            "min": 95,
            "max": 100
          }
        ]
      },
      {
        "id": 3,
        "title": "Memory Usage by Agent",
        "type": "graph",
        "targets": [
          {
            "expr": "process_resident_memory_bytes / 1024 / 1024",
            "legendFormat": "{{ agent_type }} - {{ instance }}"
          }
        ],
        "yAxes": [
          {
            "label": "Memory (MB)"
          }
        ]
      },
      {
        "id": 4,
        "title": "CPU Usage by Agent",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(process_cpu_seconds_total[5m]) * 100",
            "legendFormat": "{{ agent_type }} - {{ instance }}"
          }
        ],
        "yAxes": [
          {
            "label": "CPU Usage (%)"
          }
        ]
      },
      {
        "id": 5,
        "title": "Agent Response Time Heatmap",
        "type": "heatmap",
        "targets": [
          {
            "expr": "sum(rate(request_duration_seconds_bucket[5m])) by (le, agent_type)",
            "format": "heatmap",
            "legendFormat": "{{ agent_type }}"
          }
        ]
      }
    ]
  }
}
```

### **Business Metrics Dashboard**
```json
{
  "dashboard": {
    "id": null,
    "title": "Progressive Framework V5 - Business Metrics",
    "tags": ["progressive-framework", "business", "kpi"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Meal Plans Generated (Daily)",
        "type": "stat",
        "targets": [
          {
            "expr": "increase(npa_meal_plans_generated_total[24h])",
            "legendFormat": "Total Plans"
          },
          {
            "expr": "avg_over_time(npa_user_satisfaction_score[24h])",
            "legendFormat": "Avg Satisfaction"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "short",
            "decimals": 0
          }
        }
      },
      {
        "id": 2,
        "title": "Workout Plans Generated (Daily)",
        "type": "stat",
        "targets": [
          {
            "expr": "increase(wpa_workout_plans_generated_total[24h])",
            "legendFormat": "Total Plans"
          },
          {
            "expr": "avg_over_time(wpa_workout_completion_rate[24h])",
            "legendFormat": "Completion Rate (%)"
          }
        ]
      },
      {
        "id": 3,
        "title": "Budget Analysis Trend",
        "type": "graph",
        "targets": [
          {
            "expr": "increase(bma_budgets_created_total[1h])",
            "legendFormat": "Budgets Created/hour"
          },
          {
            "expr": "increase(bma_expense_analyses_total[1h])",
            "legendFormat": "Analyses/hour"
          }
        ]
      },
      {
        "id": 4,
        "title": "User Engagement Metrics",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(requests_total[5m])) by (endpoint)",
            "legendFormat": "{{ endpoint }}"
          }
        ]
      },
      {
        "id": 5,
        "title": "Feature Adoption",
        "type": "piechart",
        "targets": [
          {
            "expr": "sum by (agent_type) (increase(requests_total[24h]))",
            "legendFormat": "{{ agent_type }}"
          }
        ]
      },
      {
        "id": 6,
        "title": "Revenue Impact Metrics",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(bma_savings_identified_dollars)",
            "legendFormat": "Total Savings Identified ($)"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "currencyUSD",
            "decimals": 2
          }
        }
      }
    ]
  }
}
```

---

## **ALERTING & INCIDENT MANAGEMENT**

### **AlertManager Configuration**
```yaml
# config/alertmanager/alertmanager.yml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alerts@progressive-framework.com'
  smtp_auth_username: 'alerts@progressive-framework.com'
  smtp_auth_password: 'app-password'

templates:
  - '/etc/alertmanager/templates/*.tmpl'

route:
  group_by: ['alertname', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'default'
  routes:
  # Critical alerts for MCA
  - match:
      service: mca
      severity: critical
    receiver: 'mca-critical'
    group_wait: 0s
    repeat_interval: 5m
  
  # Agent health issues
  - match:
      tier: agents
      severity: warning
    receiver: 'agent-health-team'
    group_interval: 5m
    repeat_interval: 30m
  
  # Business impact alerts
  - match:
      business_impact: high
    receiver: 'business-team'
    group_interval: 2m
    repeat_interval: 15m
  
  # SLA violations
  - match:
      sla: availability
    receiver: 'sre-team'
    group_wait: 0s
    repeat_interval: 10m
  
  # Infrastructure alerts
  - match:
      tier: infrastructure
    receiver: 'infrastructure-team'
    group_interval: 10m
    repeat_interval: 1h

receivers:
- name: 'default'
  email_configs:
  - to: 'team@progressive-framework.com'
    subject: 'Progressive Framework Alert: {{ .GroupLabels.alertname }}'
    body: |
      {{ range .Alerts }}
      Alert: {{ .Annotations.summary }}
      Description: {{ .Annotations.description }}
      Labels: {{ range .Labels.SortedPairs }}{{ .Name }}={{ .Value }} {{ end }}
      {{ end }}

- name: 'mca-critical'
  email_configs:
  - to: 'sre-oncall@progressive-framework.com'
    subject: 'CRITICAL: MCA System Alert'
    body: |
      🚨 CRITICAL MCA ALERT 🚨
      
      {{ range .Alerts }}
      Summary: {{ .Annotations.summary }}
      Description: {{ .Annotations.description }}
      Runbook: {{ .Annotations.runbook_url }}
      Time: {{ .StartsAt }}
      {{ end }}
  
  pagerduty_configs:
  - routing_key: 'YOUR_PAGERDUTY_ROUTING_KEY'
    description: 'MCA Critical Alert: {{ .GroupLabels.alertname }}'
  
  slack_configs:
  - api_url: 'YOUR_SLACK_WEBHOOK_URL'
    channel: '#alerts-critical'
    title: 'Critical MCA Alert'
    text: |
      {{ range .Alerts }}
      :rotating_light: *{{ .Annotations.summary }}*
      {{ .Annotations.description }}
      <{{ .Annotations.runbook_url }}|View Runbook>
      {{ end }}

- name: 'agent-health-team'
  slack_configs:
  - api_url: 'YOUR_SLACK_WEBHOOK_URL'
    channel: '#agent-health'
    title: 'Agent Health Alert'
    text: |
      {{ range .Alerts }}
      :warning: *{{ .Annotations.summary }}*
      Agent: {{ .Labels.agent_type }}
      {{ .Annotations.description }}
      {{ end }}

- name: 'business-team'
  email_configs:
  - to: 'business-team@progressive-framework.com'
    subject: 'Business Impact Alert: {{ .GroupLabels.alertname }}'
  
  slack_configs:
  - api_url: 'YOUR_SLACK_WEBHOOK_URL'
    channel: '#business-alerts'
    title: 'Business Impact Alert'

- name: 'sre-team'
  email_configs:
  - to: 'sre-team@progressive-framework.com'
    subject: 'SLA Violation: {{ .GroupLabels.alertname }}'
  
  pagerduty_configs:
  - routing_key: 'SRE_PAGERDUTY_ROUTING_KEY'
    description: 'SLA Violation: {{ .GroupLabels.alertname }}'

- name: 'infrastructure-team'
  email_configs:
  - to: 'infrastructure-team@progressive-framework.com'
    subject: 'Infrastructure Alert: {{ .GroupLabels.alertname }}'

inhibit_rules:
- source_match:
    severity: 'critical'
  target_match:
    severity: 'warning'
  equal: ['alertname', 'service', 'instance']
```

### **Incident Response Automation**
```bash
#!/bin/bash
# scripts/incident-response.sh

set -e

INCIDENT_TYPE=${1:-"unknown"}
SEVERITY=${2:-"medium"}
AFFECTED_SERVICE=${3:-"unknown"}
NAMESPACE="progressive-framework-v5"

echo "🚨 Progressive Framework V5 - Incident Response Activated"
echo "Incident Type: $INCIDENT_TYPE"
echo "Severity: $SEVERITY"
echo "Affected Service: $AFFECTED_SERVICE"
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# Create incident ID
INCIDENT_ID="PF5-$(date +%Y%m%d%H%M%S)-$(echo $RANDOM | md5sum | head -c 6)"
echo "Incident ID: $INCIDENT_ID"

# Function to scale up healthy replicas
scale_healthy_replicas() {
    local service_name=$1
    local target_replicas=${2:-5}
    
    echo "🔄 Scaling up $service_name to $target_replicas replicas..."
    
    kubectl scale deployment $service_name-deployment -n $NAMESPACE --replicas=$target_replicas
    
    # Wait for rollout
    kubectl rollout status deployment/$service_name-deployment -n $NAMESPACE --timeout=300s
    
    echo "✅ $service_name scaled successfully"
}

# Function to enable circuit breaker
enable_circuit_breaker() {
    local service_name=$1
    
    echo "⚡ Enabling circuit breaker for $service_name..."
    
    # Update service configuration to enable circuit breaker
    kubectl patch deployment $service_name-deployment -n $NAMESPACE -p \
      '{"spec":{"template":{"spec":{"containers":[{"name":"'$service_name'","env":[{"name":"CIRCUIT_BREAKER_ENABLED","value":"true"},{"name":"CIRCUIT_BREAKER_THRESHOLD","value":"50"}]}]}}}}'
    
    echo "✅ Circuit breaker enabled for $service_name"
}

# Function to route traffic to healthy instances
route_traffic_to_healthy() {
    echo "🚦 Routing traffic to healthy instances..."
    
    # Update ingress to route to healthy services only
    kubectl annotate ingress progressive-framework-ingress -n $NAMESPACE \
      nginx.ingress.kubernetes.io/upstream-vhost="healthy-only" \
      --overwrite
    
    echo "✅ Traffic rerouted to healthy instances"
}

# Function to collect diagnostic information
collect_diagnostics() {
    local output_dir="/tmp/incident-$INCIDENT_ID"
    mkdir -p $output_dir
    
    echo "🔍 Collecting diagnostic information..."
    
    # Collect pod logs
    kubectl logs -l tier=agents -n $NAMESPACE --tail=1000 > $output_dir/agent-logs.txt
    kubectl logs -l app=mca -n $NAMESPACE --tail=1000 > $output_dir/mca-logs.txt
    
    # Collect resource usage
    kubectl top pods -n $NAMESPACE > $output_dir/resource-usage.txt
    kubectl top nodes > $output_dir/node-usage.txt
    
    # Collect events
    kubectl get events -n $NAMESPACE --sort-by=.metadata.creationTimestamp > $output_dir/events.txt
    
    # Collect service status
    kubectl get pods,services,deployments -n $NAMESPACE -o wide > $output_dir/service-status.txt
    
    # Collect metrics snapshot (if Prometheus is accessible)
    if curl -s http://prometheus:9090/api/v1/query?query=up > /dev/null 2>&1; then
        curl -s "http://prometheus:9090/api/v1/query?query=up" > $output_dir/service-health.json
        curl -s "http://prometheus:9090/api/v1/query?query=rate(requests_total[5m])" > $output_dir/request-rates.json
    fi
    
    echo "📋 Diagnostics collected in $output_dir"
}

# Function to notify incident channels
notify_incident() {
    local status=$1
    local message=$2
    
    # Create incident notification
    cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Event
metadata:
  name: incident-$INCIDENT_ID
  namespace: $NAMESPACE
type: Warning
reason: IncidentResponse
involvedObject:
  apiVersion: apps/v1
  kind: Deployment
  name: $AFFECTED_SERVICE-deployment
message: "$message"
eventTime: "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
EOF

    # Send to monitoring systems (Slack, PagerDuty, etc.)
    if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
        curl -X POST -H 'Content-type: application/json' \
          --data "{\"text\":\"🚨 Incident $INCIDENT_ID: $message\"}" \
          $SLACK_WEBHOOK_URL
    fi
    
    echo "📢 Incident notification sent"
}

# Main incident response logic
case $INCIDENT_TYPE in
    "mca_down")
        echo "🧠 Responding to MCA failure..."
        
        # Scale up MCA replicas
        scale_healthy_replicas "mca" 5
        
        # Enable circuit breakers for all agents
        for agent in npa wpa bma rpa; do
            enable_circuit_breaker $agent
        done
        
        # Route traffic to healthy instances
        route_traffic_to_healthy
        
        notify_incident "ACTIVE" "MCA failure detected and mitigation activated"
        ;;
        
    "agent_degraded")
        echo "🤖 Responding to agent degradation..."
        
        # Scale up affected service
        scale_healthy_replicas $AFFECTED_SERVICE 3
        
        # Enable circuit breaker for affected service
        enable_circuit_breaker $AFFECTED_SERVICE
        
        notify_incident "ACTIVE" "Agent $AFFECTED_SERVICE degradation detected and scaling applied"
        ;;
        
    "high_error_rate")
        echo "📊 Responding to high error rate..."
        
        # Scale up all services
        for service in mca npa wpa bma rpa; do
            scale_healthy_replicas $service 3
        done
        
        # Enable circuit breakers
        for service in npa wpa bma rpa; do
            enable_circuit_breaker $service
        done
        
        notify_incident "ACTIVE" "High error rate detected - scaling and circuit breakers activated"
        ;;
        
    "database_connectivity")
        echo "🗄️ Responding to database connectivity issues..."
        
        # Restart database connections
        kubectl rollout restart deployment/mca-deployment -n $NAMESPACE
        for agent in npa wpa bma rpa; do
            kubectl rollout restart deployment/$agent-deployment -n $NAMESPACE
        done
        
        notify_incident "ACTIVE" "Database connectivity issues - restarting connections"
        ;;
        
    *)
        echo "❓ Unknown incident type, applying general mitigation..."
        
        # General mitigation - scale up and enable monitoring
        scale_healthy_replicas "mca" 3
        
        notify_incident "ACTIVE" "General incident response activated for $INCIDENT_TYPE"
        ;;
esac

# Always collect diagnostics
collect_diagnostics

# Wait for system to stabilize
echo "⏳ Waiting for system stabilization..."
sleep 60

# Verify system health after mitigation
echo "🔍 Verifying system health..."

healthy_pods=$(kubectl get pods -n $NAMESPACE --field-selector=status.phase=Running | wc -l)
total_pods=$(kubectl get pods -n $NAMESPACE | wc -l)

if [[ $healthy_pods -eq $total_pods ]]; then
    echo "✅ System appears healthy after mitigation"
    notify_incident "RESOLVED" "Incident $INCIDENT_ID resolved - all pods healthy"
else
    echo "⚠️ System still showing issues - escalating..."
    notify_incident "ESCALATED" "Incident $INCIDENT_ID requires manual intervention"
fi

echo "📋 Incident response completed for $INCIDENT_ID"
echo "📁 Diagnostics available in /tmp/incident-$INCIDENT_ID"
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Agent Architecture](Agent-Architecture.md)** - Multi-agent system design
- **[Deployment Architecture](Deployment-Architecture.md)** - Deployment strategies and environments
- **[Network Architecture & Security](../06-Infrastructure/Network-Architecture-Security.md)** - Network topology and security

### **Follow-up Documents**
- **[Load Balancing & Resource Management](../06-Infrastructure/Load-Balancing-Resource-Management.md)** - Load balancing strategies
- **[Scaling & Performance Optimization](../06-Infrastructure/Scaling-Performance-Optimization.md)** - Performance optimization
- **[Disaster Recovery & Backup](../06-Infrastructure/Disaster-Recovery-Backup.md)** - Business continuity planning

### **Operations Context**
- **[CI/CD Pipeline](../05-DevOps/CI-CD-Pipeline.md)** - Continuous integration and deployment
- **[Container Orchestration](../05-DevOps/Container-Orchestration.md)** - Kubernetes deployment details
- **[Environment Management](../05-DevOps/Environment-Management.md)** - Multi-environment strategies

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | Observability Team | Complete monitoring and observability implementation |
| 4.x | 2025-08-xx | Monitoring Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: Observability Team  
**Last Validated**: 2025-09-02