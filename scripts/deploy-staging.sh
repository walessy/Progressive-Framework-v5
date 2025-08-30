#!/bin/bash
# Deployment Scripts & Monitoring Configuration
# Location: C:\Projects\Progressive-Framework-v5\scripts\

# ========================================
# DEPLOYMENT SCRIPT - STAGING
# scripts/deploy-staging.sh
# ========================================

#!/bin/bash
set -euo pipefail

echo "🚀 Starting Progressive Framework V5 Staging Deployment..."

# Configuration
STAGING_HOST="${STAGING_HOST:-staging.progressive-framework.com}"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-ghcr.io/your-org}"
IMAGE_NAME="progressive-framework-v5"
STAGING_TAG="staging-$(git rev-parse --short HEAD)"

# Build and tag image
echo "📦 Building Docker image..."
docker build -t "$DOCKER_REGISTRY/$IMAGE_NAME:$STAGING_TAG" .
docker build -t "$DOCKER_REGISTRY/$IMAGE_NAME:staging" .

# Push to registry
echo "⬆️ Pushing to container registry..."
docker push "$DOCKER_REGISTRY/$IMAGE_NAME:$STAGING_TAG"
docker push "$DOCKER_REGISTRY/$IMAGE_NAME:staging"

# Create pre-deployment backup
echo "💾 Creating pre-deployment backup..."
curl -X POST "https://$STAGING_HOST/api/emergency/backups/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STAGING_API_KEY" \
  -d '{"reason": "pre_deployment_staging", "type": "full_system"}' || true

# Deploy to staging
echo "🚀 Deploying to staging environment..."
if command -v kubectl &> /dev/null; then
    # Kubernetes deployment
    kubectl set image deployment/progressive-framework-v5 \
        progressive-framework="$DOCKER_REGISTRY/$IMAGE_NAME:$STAGING_TAG" \
        --namespace=progressive-framework-staging
    kubectl rollout status deployment/progressive-framework-v5 \
        --namespace=progressive-framework-staging --timeout=300s
else
    # Docker Compose deployment
    export IMAGE_TAG=$STAGING_TAG
    docker-compose -f deploy/docker-compose.staging.yml up -d
fi

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
timeout 300s bash -c "
    until curl -f -s https://$STAGING_HOST/api/agents/status > /dev/null; do
        echo 'Waiting for staging to be ready...'
        sleep 10
    done
"

# Run smoke tests
echo "🧪 Running smoke tests..."
npm run test:smoke:staging

# Run emergency system validation
echo "🚨 Validating emergency system..."
npm run test:emergency:staging

# Create post-deployment backup
echo "💾 Creating post-deployment backup..."
curl -X POST "https://$STAGING_HOST/api/emergency/backups/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STAGING_API_KEY" \
  -d '{"reason": "post_deployment_staging", "type": "full_system"}' || true

echo "✅ Staging deployment completed successfully!"
echo "🌐 Staging URL: https://$STAGING_HOST"
echo "📊 Monitoring: https://$STAGING_HOST:3001" # Grafana
echo "🚨 Emergency Dashboard: https://$STAGING_HOST/api/emergency/status"

---

# ========================================
# DEPLOYMENT SCRIPT - PRODUCTION  
# scripts/deploy-production.sh
# ========================================

#!/bin/bash
set -euo pipefail

echo "🌟 Starting Progressive Framework V5 Production Deployment..."

# Configuration
PRODUCTION_HOST="${PRODUCTION_HOST:-progressive-framework.com}"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-ghcr.io/your-org}"
IMAGE_NAME="progressive-framework-v5"
PRODUCTION_TAG="v$(jq -r '.version' package.json)"
ROLLBACK_TAG="previous"

# Safety checks
if [[ "$NODE_ENV" != "production" ]]; then
    echo "❌ NODE_ENV must be set to 'production'"
    exit 1
fi

if [[ -z "${PRODUCTION_API_KEY:-}" ]]; then
    echo "❌ PRODUCTION_API_KEY must be set"
    exit 1
fi

# Confirmation prompt
echo "🚨 You are about to deploy to PRODUCTION!"
echo "📦 Image: $DOCKER_REGISTRY/$IMAGE_NAME:$PRODUCTION_TAG"
echo "🌐 Host: $PRODUCTION_HOST"
read -p "Are you sure? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Production deployment cancelled"
    exit 1
fi

# Tag current production as rollback
echo "🏷️ Tagging current production for rollback..."
docker pull "$DOCKER_REGISTRY/$IMAGE_NAME:production" || true
docker tag "$DOCKER_REGISTRY/$IMAGE_NAME:production" \
    "$DOCKER_REGISTRY/$IMAGE_NAME:$ROLLBACK_TAG" || true
docker push "$DOCKER_REGISTRY/$IMAGE_NAME:$ROLLBACK_TAG" || true

# Build and tag production image
echo "📦 Building production Docker image..."
docker build --target production -t "$DOCKER_REGISTRY/$IMAGE_NAME:$PRODUCTION_TAG" .
docker tag "$DOCKER_REGISTRY/$IMAGE_NAME:$PRODUCTION_TAG" \
    "$DOCKER_REGISTRY/$IMAGE_NAME:production"

# Push to registry
echo "⬆️ Pushing to container registry..."
docker push "$DOCKER_REGISTRY/$IMAGE_NAME:$PRODUCTION_TAG"
docker push "$DOCKER_REGISTRY/$IMAGE_NAME:production"

# Create pre-deployment backup
echo "💾 Creating critical pre-deployment backup..."
BACKUP_RESPONSE=$(curl -s -X POST "https://$PRODUCTION_HOST/api/emergency/backups/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PRODUCTION_API_KEY" \
  -d '{"reason": "pre_production_deployment", "type": "full_system"}')

BACKUP_ID=$(echo "$BACKUP_RESPONSE" | jq -r '.backup.id // empty')
if [[ -z "$BACKUP_ID" ]]; then
    echo "❌ Failed to create pre-deployment backup"
    exit 1
fi
echo "✅ Pre-deployment backup created: $BACKUP_ID"

# Deploy with blue-green strategy
echo "🚀 Deploying to production (blue-green)..."
if command -v kubectl &> /dev/null; then
    # Kubernetes blue-green deployment
    kubectl set image deployment/progressive-framework-v5 \
        progressive-framework="$DOCKER_REGISTRY/$IMAGE_NAME:$PRODUCTION_TAG" \
        --namespace=progressive-framework
    
    # Wait for rollout to complete
    kubectl rollout status deployment/progressive-framework-v5 \
        --namespace=progressive-framework --timeout=600s
        
    # Verify new pods are healthy
    kubectl wait --for=condition=ready pod \
        -l app=progressive-framework-v5 \
        --namespace=progressive-framework --timeout=300s
else
    # Docker Compose blue-green deployment
    export IMAGE_TAG=$PRODUCTION_TAG
    docker-compose -f deploy/docker-compose.prod.yml up -d --no-deps progressive-framework
    
    # Wait for health check
    timeout 300s bash -c "
        until curl -f -s https://$PRODUCTION_HOST/api/emergency/health > /dev/null; do
            echo 'Waiting for production to be healthy...'
            sleep 15
        done
    "
fi

# Extended production health validation
echo "🏥 Running extended production health checks..."
for i in {1..10}; do
    echo "Health check $i/10..."
    HEALTH_RESPONSE=$(curl -s "https://$PRODUCTION_HOST/api/emergency/health" || echo '{"overall":"unhealthy"}')
    HEALTH_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.health.overall // "unhealthy"')
    
    if [[ "$HEALTH_STATUS" == "healthy" ]]; then
        echo "✅ Health check $i passed"
    else
        echo "❌ Health check $i failed: $HEALTH_STATUS"
        echo "🚨 Initiating automatic rollback..."
        ./scripts/rollback-production.sh "$BACKUP_ID"
        exit 1
    fi
    
    if [[ $i -lt 10 ]]; then
        sleep 30
    fi
done

# Test emergency systems
echo "🚨 Testing emergency systems..."
npm run test:emergency:production

# Test critical agent functionality  
echo "🤖 Testing agent functionality..."
AGENT_TEST_RESPONSE=$(curl -s -X POST "https://$PRODUCTION_HOST/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PRODUCTION_API_KEY" \
  -d '{"message": "system health check", "userId": "deployment_test"}')

AGENT_SUCCESS=$(echo "$AGENT_TEST_RESPONSE" | jq -r '.success // false')
if [[ "$AGENT_SUCCESS" != "true" ]]; then
    echo "❌ Agent functionality test failed"
    echo "🚨 Initiating automatic rollback..."
    ./scripts/rollback-production.sh "$BACKUP_ID"
    exit 1
fi

# Create post-deployment backup
echo "💾 Creating post-deployment backup..."
curl -s -X POST "https://$PRODUCTION_HOST/api/emergency/backups/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PRODUCTION_API_KEY" \
  -d '{"reason": "post_production_deployment", "type": "full_system"}' > /dev/null

# Setup enhanced monitoring
echo "📊 Activating enhanced post-deployment monitoring..."
curl -s -X POST "https://$PRODUCTION_HOST/api/emergency/monitoring/enhance" \
  -H "Authorization: Bearer $PRODUCTION_API_KEY" \
  -d '{"duration": "24h", "reason": "post_deployment"}' > /dev/null || true

echo "🎉 Production deployment completed successfully!"
echo "🌐 Production URL: https://$PRODUCTION_HOST"
echo "📊 Monitoring: https://$PRODUCTION_HOST:3001"
echo "🚨 Emergency Dashboard: https://$PRODUCTION_HOST/api/emergency/status"
echo "💾 Rollback available with backup: $BACKUP_ID"

---

# ========================================
# ROLLBACK SCRIPT
# scripts/rollback-production.sh  
# ========================================

#!/bin/bash
set -euo pipefail

BACKUP_ID="${1:-}"
PRODUCTION_HOST="${PRODUCTION_HOST:-progressive-framework.com}"

echo "🚨 EMERGENCY: Initiating Production Rollback!"

if [[ -z "$BACKUP_ID" ]]; then
    echo "📋 Available backups:"
    curl -s "https://$PRODUCTION_HOST/api/emergency/backups" \
        -H "Authorization: Bearer $PRODUCTION_API_KEY" | \
        jq -r '.backups[] | "\(.id) - \(.timestamp) - \(.reason)"' | head -10
    
    echo ""
    read -p "Enter backup ID to rollback to: " BACKUP_ID
fi

if [[ -z "$BACKUP_ID" ]]; then
    echo "❌ No backup ID provided"
    exit 1
fi

echo "🔄 Rolling back to backup: $BACKUP_ID"

# Perform emergency rollback
ROLLBACK_RESPONSE=$(curl -s -X POST "https://$PRODUCTION_HOST/api/emergency/rollback" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PRODUCTION_API_KEY" \
  -d "{\"backupId\": \"$BACKUP_ID\", \"confirm\": true, \"reason\": \"production_emergency_rollback\"}")

ROLLBACK_SUCCESS=$(echo "$ROLLBACK_RESPONSE" | jq -r '.success // false')

if [[ "$ROLLBACK_SUCCESS" == "true" ]]; then
    echo "✅ Emergency rollback completed successfully"
    echo "🏥 System restored to stable state"
else
    echo "❌ Emergency rollback failed!"
    echo "$ROLLBACK_RESPONSE" | jq .
    exit 1
fi

# Verify system health post-rollback
echo "🏥 Verifying system health post-rollback..."
sleep 30

HEALTH_RESPONSE=$(curl -s "https://$PRODUCTION_HOST/api/emergency/health")
HEALTH_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.health.overall // "unknown"')

echo "📊 Post-rollback system health: $HEALTH_STATUS"

if [[ "$HEALTH_STATUS" == "healthy" ]]; then
    echo "✅ Rollback successful - system is healthy"
else
    echo "⚠️ System health status: $HEALTH_STATUS"
    echo "🚨 Manual intervention may be required"
fi

---

# ========================================
# HEALTH CHECK SCRIPT
# scripts/health-check.js
# ========================================

#!/usr/bin/env node

const http = require('http');
const https = require('https');

async function healthCheck() {
    const port = process.env.PORT || 3000;
    const protocol = process.env.NODE_ENV === 'production' ? https : http;
    
    try {
        // Check main health endpoint
        const healthResponse = await makeRequest(protocol, 'localhost', port, '/api/emergency/health');
        
        if (healthResponse.health && healthResponse.health.overall === 'healthy') {
            console.log('✅ Health check passed');
            process.exit(0);
        } else {
            console.error('❌ Health check failed:', healthResponse.health?.overall || 'unknown');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        process.exit(1);
    }
}

function makeRequest(protocol, hostname, port, path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname,
            port,
            path,
            method: 'GET',
            timeout: 5000
        };
        
        const req = protocol.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (res.statusCode === 200) {
                        resolve(parsed);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                    }
                } catch (parseError) {
                    reject(new Error(`Parse error: ${parseError.message}`));
                }
            });
        });
        
        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.end();
    });
}

if (require.main === module) {
    healthCheck();
}

module.exports = { healthCheck };

---

# ========================================
# MONITORING CONFIGURATION - PROMETHEUS
# monitoring/prometheus.prod.yml
# ========================================

global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'progressive-framework'
    static_configs:
      - targets: ['progressive-framework:3000']
    metrics_path: '/api/emergency/metrics'
    scrape_interval: 30s
    scrape_timeout: 10s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

---

# ========================================  
# NGINX CONFIGURATION
# nginx/nginx.conf
# ========================================

upstream progressive_framework {
    server progressive-framework:3000 max_fails=3 fail_timeout=30s;
    server progressive-framework:3000 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name progressive-framework.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=chat_limit:10m rate=5r/s;
    
    # Health check endpoint (no rate limit)
    location /api/emergency/health {
        proxy_pass http://progressive_framework;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Chat endpoint (stricter rate limit)
    location /chat {
        limit_req zone=chat_limit burst=10 nodelay;
        proxy_pass http://progressive_framework;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # API endpoints
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://progressive_framework;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files (if any)
    location /static/ {
        expires 1d;
        add_header Cache-Control "public, immutable";
    }
}

server {
    listen 443 ssl http2;
    server_name progressive-framework.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Include HTTP configuration
    include /etc/nginx/conf.d/progressive-framework-http.conf;
}