# docs/01-Core-System/Health-Monitoring.md

# Health Monitoring System

## Overview

The Health Monitoring system provides comprehensive visibility into application performance, system health, and operational metrics. It enables proactive identification of issues, performance bottlenecks, and system degradation before they impact users.

> **📊 Context**: This monitoring system covers all components described in the [System Overview](../01-Core-System/System-Overview.md), including the API Gateway, microservices layer, database systems, and external integrations. Understanding the system architecture is essential for effective monitoring implementation.

## Architecture

### Monitoring Targets
Based on the [system architecture](../01-Core-System/System-Overview.md#high-level-architecture), our monitoring covers:

#### Application Layer Monitoring
- **API Gateway** (Kong/NGINX Plus) - Request routing, rate limiting, SSL termination
- **Authentication Service** - OAuth 2.0, JWT validation, user sessions  
- **Core Business Services** - User Management, Order Processing, Payment, Notification services
- **Frontend Applications** - React web app, React Native mobile apps, Vue.js admin dashboard

#### Infrastructure Layer Monitoring
- **Database Systems** - PostgreSQL primary/replica, Redis cluster, MongoDB instances
- **Message Systems** - RabbitMQ queues, Apache Kafka streams
- **Container Platform** - Kubernetes cluster, Docker containers, service mesh (Istio)
- **Cloud Infrastructure** - AWS services, load balancers, auto-scaling groups

### Components

#### Health Check Engine
- **Passive Monitoring**: Continuous background health assessment
- **Active Probes**: On-demand health verification
- **Dependency Tracking**: Monitor external service dependencies
- **Circuit Breaker Integration**: Automatic failover capabilities

#### Metrics Collection
- **Application Metrics**: Business logic performance indicators
- **Infrastructure Metrics**: System resource utilization
- **Custom Metrics**: Domain-specific measurements
- **Real-time Aggregation**: Live metric computation

#### Alerting System
- **Threshold-based Alerts**: Static and dynamic threshold monitoring
- **Anomaly Detection**: ML-powered unusual pattern identification
- **Alert Routing**: Intelligent notification distribution
- **Escalation Policies**: Automated escalation workflows

## Health Check Types

### Application Health Checks

#### Liveness Probe
```yaml
endpoint: /health/live
purpose: Verify application is running
criteria:
  - Process responsiveness
  - Core service availability
  - Critical dependency status
frequency: 10 seconds
timeout: 5 seconds
```

#### Readiness Probe
```yaml
endpoint: /health/ready
purpose: Verify application can serve traffic
criteria:
  - Database connectivity
  - Cache availability
  - External API accessibility
  - Configuration validity
frequency: 5 seconds
timeout: 10 seconds
```

#### Startup Probe
```yaml
endpoint: /health/startup
purpose: Verify application initialization
criteria:
  - Database migrations complete
  - Cache warming finished
  - Configuration loaded
  - Services initialized
frequency: 30 seconds
timeout: 60 seconds
```

### Infrastructure Health Checks

#### Resource Monitoring
- **CPU Usage**: Track processor utilization patterns
- **Memory Consumption**: Monitor heap and non-heap memory
- **Disk Space**: Monitor available storage capacity
- **Network I/O**: Track bandwidth utilization and latency

#### Service Dependencies
- **Database Health**: Connection pool status, query performance
- **Cache Services**: Hit rates, eviction patterns, connectivity
- **Message Queues**: Queue depth, processing rates, dead letters
- **External APIs**: Response times, error rates, availability

## Metrics Framework

### Core Metrics

#### Performance Metrics
```yaml
Response Time:
  - p50, p95, p99 percentiles
  - Average response time
  - Maximum response time
  - Request volume per second

Throughput:
  - Requests per second
  - Transactions per minute
  - Data processing volume
  - Concurrent user sessions

Error Rates:
  - HTTP 4xx/5xx error percentages
  - Application exception rates
  - Failed transaction percentages
  - Retry attempt frequencies
```

#### Business Metrics
```yaml
User Experience:
  - Page load times
  - Feature usage rates
  - User session duration
  - Conversion funnel metrics

Application Specific:
  - Transaction success rates
  - Data processing accuracy
  - Feature adoption rates
  - User engagement scores
```

### Custom Metrics Implementation

#### Counter Metrics
```python
from prometheus_client import Counter

# Request counter
request_counter = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

# Usage
request_counter.labels(
    method='GET',
    endpoint='/api/users',
    status='200'
).inc()
```

#### Histogram Metrics
```python
from prometheus_client import Histogram

# Response time histogram
response_time = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

# Usage with decorator
@response_time.labels('POST', '/api/orders').time()
def create_order():
    # Order creation logic
    pass
```

#### Gauge Metrics
```python
from prometheus_client import Gauge

# Active connections gauge
active_connections = Gauge(
    'database_connections_active',
    'Active database connections'
)

# Usage
active_connections.set(database.get_active_connections())
```

## Alerting Configuration

### Alert Rules

#### Critical Alerts
```yaml
High Error Rate:
  condition: error_rate > 5%
  duration: 2 minutes
  severity: critical
  channels: [pager, slack-critical]

Service Unavailable:
  condition: availability < 99%
  duration: 1 minute
  severity: critical
  channels: [pager, slack-critical, email]

Database Connection Failure:
  condition: db_connections_active == 0
  duration: 30 seconds
  severity: critical
  channels: [pager, slack-critical]
```

#### Warning Alerts
```yaml
High Response Time:
  condition: response_time_p95 > 2000ms
  duration: 5 minutes
  severity: warning
  channels: [slack-monitoring, email]

Memory Usage High:
  condition: memory_usage > 80%
  duration: 10 minutes
  severity: warning
  channels: [slack-monitoring]

Disk Space Low:
  condition: disk_usage > 85%
  duration: 5 minutes
  severity: warning
  channels: [slack-monitoring, email]
```

### Notification Channels

#### Slack Integration
```json
{
  "webhook_url": "https://hooks.slack.com/services/...",
  "channels": {
    "critical": "#alerts-critical",
    "warning": "#alerts-monitoring",
    "info": "#system-status"
  },
  "message_format": {
    "title": "Alert: {{alert.name}}",
    "color": "{{severity.color}}",
    "fields": [
      {"title": "Severity", "value": "{{alert.severity}}"},
      {"title": "Service", "value": "{{alert.service}}"},
      {"title": "Description", "value": "{{alert.description}}"}
    ]
  }
}
```

#### PagerDuty Integration
```json
{
  "integration_key": "your-integration-key",
  "escalation_policy": "primary-on-call",
  "alert_grouping": {
    "enabled": true,
    "window": "5 minutes"
  },
  "severity_mapping": {
    "critical": "error",
    "warning": "warning",
    "info": "info"
  }
}
```

## Monitoring Dashboards

### Application Dashboard

#### Key Metrics Display
```yaml
Request Rate Panel:
  - Time series: requests per second
  - Breakdown by endpoint
  - Success vs error rates

Response Time Panel:
  - Percentile graphs (p50, p95, p99)
  - Heat map visualization
  - Endpoint comparison

Error Rate Panel:
  - Error percentage over time
  - Error type breakdown
  - Top error endpoints

Database Panel:
  - Connection pool status
  - Query performance
  - Slow query identification
```

### Infrastructure Dashboard

#### System Resources
```yaml
CPU Utilization:
  - Per-core utilization
  - Load average trends
  - Process-level breakdown

Memory Usage:
  - Heap vs non-heap memory
  - Garbage collection metrics
  - Memory leak detection

Network I/O:
  - Bandwidth utilization
  - Connection counts
  - Network error rates

Disk I/O:
  - Read/write throughput
  - Queue depth
  - I/O wait time
```

## Implementation Guidelines

### Health Check Endpoints

#### Basic Health Check
```python
from flask import Flask, jsonify
import time
import psutil

app = Flask(__name__)

@app.route('/health/live')
def liveness():
    """Basic liveness check"""
    return jsonify({
        'status': 'healthy',
        'timestamp': time.time(),
        'uptime': time.time() - start_time
    })

@app.route('/health/ready')
def readiness():
    """Comprehensive readiness check"""
    checks = {
        'database': check_database(),
        'cache': check_cache(),
        'external_api': check_external_api(),
        'disk_space': check_disk_space()
    }
    
    overall_status = 'healthy' if all(
        check['status'] == 'healthy' 
        for check in checks.values()
    ) else 'unhealthy'
    
    return jsonify({
        'status': overall_status,
        'checks': checks,
        'timestamp': time.time()
    })

def check_database():
    try:
        # Database connectivity check
        result = db.execute('SELECT 1')
        return {
            'status': 'healthy',
            'response_time': measure_db_response_time()
        }
    except Exception as e:
        return {
            'status': 'unhealthy',
            'error': str(e)
        }
```

#### Advanced Health Checks
```python
@app.route('/health/detailed')
def detailed_health():
    """Detailed system health information"""
    return jsonify({
        'application': {
            'version': get_app_version(),
            'build_time': get_build_time(),
            'config_status': validate_configuration()
        },
        'system': {
            'cpu_usage': psutil.cpu_percent(),
            'memory_usage': psutil.virtual_memory().percent,
            'disk_usage': psutil.disk_usage('/').percent,
            'load_average': psutil.getloadavg()
        },
        'dependencies': {
            'database': detailed_db_check(),
            'cache': detailed_cache_check(),
            'message_queue': detailed_queue_check()
        },
        'performance': {
            'response_times': get_recent_response_times(),
            'error_rates': get_recent_error_rates(),
            'throughput': get_current_throughput()
        }
    })
```

### Metrics Integration

#### Application Metrics
```python
from prometheus_client import start_http_server, Counter, Histogram, Gauge

# Initialize metrics
REQUEST_COUNT = Counter(
    'app_requests_total',
    'Total app requests',
    ['method', 'endpoint', 'status']
)

REQUEST_LATENCY = Histogram(
    'app_request_latency_seconds',
    'Request latency',
    ['method', 'endpoint']
)

ACTIVE_USERS = Gauge(
    'app_active_users',
    'Currently active users'
)

# Middleware for automatic metrics collection
class MetricsMiddleware:
    def __init__(self, app):
        self.app = app
    
    def __call__(self, environ, start_response):
        start_time = time.time()
        
        def new_start_response(status, response_headers):
            duration = time.time() - start_time
            method = environ.get('REQUEST_METHOD')
            path = environ.get('PATH_INFO')
            
            REQUEST_COUNT.labels(
                method=method,
                endpoint=path,
                status=status.split()[0]
            ).inc()
            
            REQUEST_LATENCY.labels(
                method=method,
                endpoint=path
            ).observe(duration)
            
            return start_response(status, response_headers)
        
        return self.app(environ, new_start_response)
```

### Alerting Logic

#### Alert Manager Configuration
```python
class AlertManager:
    def __init__(self, notification_channels):
        self.channels = notification_channels
        self.alert_history = []
    
    def evaluate_alerts(self, metrics):
        """Evaluate all alert conditions"""
        alerts = []
        
        # High error rate check
        if metrics['error_rate'] > 0.05:
            alerts.append({
                'name': 'High Error Rate',
                'severity': 'critical',
                'description': f'Error rate: {metrics["error_rate"]:.2%}',
                'metric_value': metrics['error_rate'],
                'threshold': 0.05
            })
        
        # Response time check
        if metrics['response_time_p95'] > 2000:
            alerts.append({
                'name': 'High Response Time',
                'severity': 'warning',
                'description': f'P95 response time: {metrics["response_time_p95"]}ms',
                'metric_value': metrics['response_time_p95'],
                'threshold': 2000
            })
        
        # Process alerts
        for alert in alerts:
            self.process_alert(alert)
    
    def process_alert(self, alert):
        """Process individual alert"""
        if not self.is_duplicate_alert(alert):
            self.send_notifications(alert)
            self.alert_history.append(alert)
    
    def send_notifications(self, alert):
        """Send alert notifications"""
        for channel in self.get_channels_for_severity(alert['severity']):
            channel.send_alert(alert)
```

## Best Practices

### Monitoring Strategy

#### Layered Approach
1. **Synthetic Monitoring**: Proactive external checks
2. **Application Performance Monitoring**: Internal application metrics
3. **Infrastructure Monitoring**: System-level resource tracking
4. **Log-based Monitoring**: Event and error analysis

#### Key Principles
- **Monitor User Experience**: Focus on customer-impacting metrics
- **Establish Baselines**: Understand normal operational patterns
- **Alert on Symptoms**: Alert on user-visible issues, not just causes
- **Reduce Alert Fatigue**: Implement intelligent alerting with proper thresholds

### Performance Considerations

#### Metric Collection Overhead
```yaml
Sampling Strategies:
  - High-frequency metrics: 1% sampling for detailed analysis
  - Medium-frequency metrics: 10% sampling for trends
  - Low-frequency metrics: 100% sampling for accuracy

Batching:
  - Batch metric submissions every 10 seconds
  - Implement local aggregation before transmission
  - Use efficient serialization formats (Protocol Buffers, MessagePack)
```

#### Storage Optimization
```yaml
Retention Policies:
  - Raw metrics: 7 days
  - 1-minute aggregates: 30 days
  - 1-hour aggregates: 1 year
  - Daily aggregates: 5 years

Compression:
  - Time-series compression algorithms
  - Delta encoding for counter metrics
  - Downsampling for long-term storage
```

## Troubleshooting

### Common Issues

#### False Positive Alerts
**Problem**: Alerts triggering during normal operations
**Solution**: 
- Adjust thresholds based on historical data
- Implement time-based threshold adjustments
- Use statistical approaches (standard deviations from baseline)

#### Missing Metrics
**Problem**: Gaps in metric collection
**Solution**:
- Implement metric collection redundancy
- Add heartbeat metrics to verify collection pipeline
- Monitor the monitoring system itself

#### Performance Impact
**Problem**: Monitoring overhead affecting application performance
**Solution**:
- Implement asynchronous metric collection
- Use sampling for high-volume metrics
- Optimize metric collection code paths

### Diagnostic Queries

#### Performance Analysis
```sql
-- Find slowest endpoints
SELECT endpoint, 
       AVG(response_time) as avg_response_time,
       COUNT(*) as request_count
FROM metrics 
WHERE timestamp > NOW() - INTERVAL '1 hour'
GROUP BY endpoint 
ORDER BY avg_response_time DESC 
LIMIT 10;
```

#### Error Pattern Analysis
```sql
-- Identify error patterns
SELECT error_type, 
       endpoint,
       COUNT(*) as error_count,
       COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as error_percentage
FROM error_logs 
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY error_type, endpoint
ORDER BY error_count DESC;
```

## Integration Points

### External Monitoring Services

#### Prometheus Integration
```yaml
prometheus:
  scrape_configs:
    - job_name: 'application'
      static_configs:
        - targets: ['app:8080']
      scrape_interval: 15s
      metrics_path: /metrics
```

#### Grafana Dashboards
```json
{
  "dashboard": {
    "title": "Application Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      }
    ]
  }
}
```

### Log Integration

#### Structured Logging for Monitoring
```python
import logging
import json

class MonitoringLogFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            'timestamp': record.created,
            'level': record.levelname,
            'message': record.getMessage(),
            'service': 'application',
            'trace_id': getattr(record, 'trace_id', None),
            'metrics': getattr(record, 'metrics', {})
        }
        return json.dumps(log_entry)

# Usage
logger = logging.getLogger(__name__)
logger.info(
    "Request processed",
    extra={
        'trace_id': request.trace_id,
        'metrics': {
            'response_time': 150,
            'status_code': 200
        }
    }
)
```

This health monitoring system provides comprehensive visibility into application and system health, enabling proactive issue resolution and optimal performance maintenance.