---
file: docs/05-DevOps/CI-CD-Pipeline.md
directory: docs/05-DevOps/
priority: HIGH
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# CI/CD Pipeline - Progressive-Framework-v5

**File Path**: `docs/05-DevOps/CI-CD-Pipeline.md`  
**Directory**: `docs/05-DevOps/`  
**Priority**: HIGH  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive Continuous Integration and Continuous Deployment (CI/CD) pipeline for Progressive-Framework-v5, covering automated testing, building, security scanning, and deployment of both the enterprise core system and integrated context agents.

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🚀 **[Deployment Guide](Deployment-Guide.md)** - *Manual deployment procedures*
- 🛡️ **[Security Overview](../04-Security/Security-Overview.md)** - *Security requirements*
- 🏗️ **[Load Balancing & Resource Management](../06-Infrastructure/Load-Balancing-Resource-Management.md)** - *Infrastructure context*

---

## **CI/CD ARCHITECTURE**

### **Pipeline Overview**
```
Progressive-Framework-v5 CI/CD Flow:

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Developer     │    │   Git Repository │    │    CI Server    │
│   Push Code     │───▶│   (GitHub/GitLab)│───▶│   (Jenkins/     │
│                 │    │                 │    │   GitHub Actions)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                       ┌─────────────────────────────────┼─────────────────────────────────┐
                       │                                 │                                 │
                       ▼                                 ▼                                 ▼
          ┌─────────────────┐              ┌─────────────────┐              ┌─────────────────┐
          │   Build Stage   │              │   Test Stage    │              │  Security Stage │
          │                 │              │                 │              │                 │
          │ • Dependencies  │              │ • Unit Tests    │              │ • SAST Scanning│
          │ • Compilation   │              │ • Integration   │              │ • Dependency    │
          │ • Asset Build   │              │ • Agent Tests   │              │   Vulnerability │
          │ • Docker Images │              │ • E2E Tests     │              │ • Container Scan│
          └─────────────────┘              └─────────────────┘              └─────────────────┘
                       │                                 │                                 │
                       └─────────────────────────────────┼─────────────────────────────────┘
                                                         │
                                                         ▼
                                            ┌─────────────────┐
                                            │  Deploy Stage   │
                                            │                 │
                                            │ • Staging       │
                                            │ • Production    │
                                            │ • Agent Deploy  │
                                            │ • Health Checks │
                                            └─────────────────┘
```

### **Environment Flow**
```
Code Flow Through Environments:

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Development │    │   Staging    │    │  Pre-Production │ │  Production  │
│              │───▶│              │───▶│               │──▶│              │
│ • Feature    │    │ • Integration│    │ • Performance │   │ • Live Users │
│   Development│    │   Testing    │    │   Testing     │   │ • Full Agent │
│ • Unit Tests │    │ • Agent Tests│    │ • Load Tests  │   │   Deployment │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
     │                    │                    │                    │
     ▼                    ▼                    ▼                    ▼
Auto Deploy        Manual Approval    Manual Approval    Manual Approval
  (Push)           (PR Merge)         (Release Tag)      (Production Tag)
```

---

## **GITHUB ACTIONS IMPLEMENTATION**

### **Workflow Structure**
```bash
.github/
└── workflows/
    ├── ci.yml                    # Main CI pipeline
    ├── cd-staging.yml           # Staging deployment
    ├── cd-production.yml        # Production deployment  
    ├── security-scan.yml        # Security scanning
    ├── agent-tests.yml          # Context agent testing
    └── dependency-update.yml    # Dependency management
```

### **Main CI Pipeline (.github/workflows/ci.yml)**
```yaml
name: Progressive-Framework-v5 CI

on:
  push:
    branches: [ main, develop, feature/* ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '18.x'
  POSTGRES_VERSION: '15'
  REDIS_VERSION: '7'
  MONGODB_VERSION: '7.0'

jobs:
  # ===============================================
  # BUILD STAGE
  # ===============================================
  build:
    name: Build Application
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - name: Checkout Code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0
    
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Cache Dependencies
      uses: actions/cache@v3
      with:
        path: |
          node_modules
          ~/.npm
        key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-node-
    
    - name: Install Dependencies
      run: |
        npm ci --prefer-offline
        npm audit --audit-level=moderate
    
    - name: Build Application
      run: |
        npm run build
        npm run build:agents
    
    - name: Build Docker Images
      run: |
        docker build -t progressive-framework-v5:${{ github.sha }} .
        docker build -f docker/agents/Dockerfile -t progressive-agents:${{ github.sha }} .
    
    - name: Upload Build Artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-artifacts-${{ matrix.node-version }}
        path: |
          dist/
          build/
          docker-images/
        retention-days: 7

  # ===============================================
  # TESTING STAGE
  # ===============================================
  test:
    name: Test Suite
    runs-on: ubuntu-latest
    needs: build
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test_password
          POSTGRES_USER: test_user
          POSTGRES_DB: test_db
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
        image: mongo:7.0
        env:
          MONGO_INITDB_ROOT_USERNAME: test_user
          MONGO_INITDB_ROOT_PASSWORD: test_password
        ports:
          - 27017:27017
    
    steps:
    - name: Checkout Code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Download Build Artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-artifacts-18.x
    
    - name: Install Dependencies
      run: npm ci
    
    - name: Setup Test Environment
      run: |
        cp .env.test .env
        npm run db:setup:test
        npm run agents:setup:test
    
    - name: Run Unit Tests
      run: |
        npm run test:unit -- --coverage --ci
        npm run test:agents:unit
      
    - name: Run Integration Tests
      run: |
        npm run test:integration
        npm run test:agents:integration
    
    - name: Run API Tests
      run: npm run test:api
    
    - name: Run End-to-End Tests
      run: |
        npm run test:e2e:ci
        npm run test:agents:e2e
    
    - name: Upload Test Results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results
        path: |
          coverage/
          test-results/
          screenshots/
    
    - name: Upload Coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella

  # ===============================================
  # AGENT-SPECIFIC TESTING
  # ===============================================
  test-agents:
    name: Context Agent Testing
    runs-on: ubuntu-latest
    needs: build
    
    strategy:
      matrix:
        agent: [mca, npa, wpa]
    
    steps:
    - name: Checkout Code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install Dependencies
      run: npm ci
    
    - name: Test ${{ matrix.agent }} Agent
      run: |
        npm run test:agent:${{ matrix.agent }}
        npm run test:agent:${{ matrix.agent }}:integration
        npm run test:agent:${{ matrix.agent }}:performance
    
    - name: Generate Agent Test Report
      run: npm run test:agent:${{ matrix.agent }}:report
    
    - name: Upload Agent Test Results
      uses: actions/upload-artifact@v3
      with:
        name: agent-test-results-${{ matrix.agent }}
        path: test-results/agents/${{ matrix.agent }}/

  # ===============================================
  # SECURITY SCANNING
  # ===============================================
  security:
    name: Security Scanning
    runs-on: ubuntu-latest
    needs: build
    
    steps:
    - name: Checkout Code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
    
    - name: Install Dependencies
      run: npm ci
    
    - name: Run SAST with CodeQL
      uses: github/codeql-action/init@v2
      with:
        languages: javascript
    
    - name: Autobuild
      uses: github/codeql-action/autobuild@v2
    
    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2
    
    - name: Run ESLint Security Rules
      run: npm run lint:security
    
    - name: Run npm audit
      run: |
        npm audit --audit-level=high
        npm audit --parseable | npm-audit-html --output audit-report.html
    
    - name: Run Snyk Security Scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high
    
    - name: Run OWASP Dependency Check
      run: |
        wget https://github.com/jeremylong/DependencyCheck/releases/download/v8.4.0/dependency-check-8.4.0-release.zip
        unzip dependency-check-8.4.0-release.zip
        ./dependency-check/bin/dependency-check.sh --scan . --format HTML --format JSON --out dependency-check-report
    
    - name: Scan Docker Images
      run: |
        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
          -v $PWD:/tmp aquasec/trivy:latest image \
          --exit-code 1 --severity HIGH,CRITICAL \
          progressive-framework-v5:${{ github.sha }}
    
    - name: Upload Security Reports
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: security-reports
        path: |
          audit-report.html
          dependency-check-report/
          snyk-report.json

  # ===============================================
  # PERFORMANCE TESTING
  # ===============================================
  performance:
    name: Performance Testing
    runs-on: ubuntu-latest
    needs: [build, test]
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    
    steps:
    - name: Checkout Code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
    
    - name: Install Dependencies
      run: npm ci
    
    - name: Start Application
      run: |
        npm run start:test &
        sleep 30
        curl -f http://localhost:3000/health || exit 1
    
    - name: Run Load Tests
      run: |
        npm run test:load
        npm run test:agents:load
    
    - name: Run Lighthouse CI
      run: |
        npm install -g @lhci/cli
        lhci autorun
      env:
        LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
    
    - name: Upload Performance Reports
      uses: actions/upload-artifact@v3
      with:
        name: performance-reports
        path: |
          performance-results/
          lighthouse-results/

  # ===============================================
  # CODE QUALITY
  # ===============================================
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    needs: build
    
    steps:
    - name: Checkout Code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
    
    - name: Install Dependencies
      run: npm ci
    
    - name: Run ESLint
      run: npm run lint -- --format=json --output-file=eslint-report.json
    
    - name: Run Prettier Check
      run: npm run format:check
    
    - name: Run JSDoc Validation
      run: npm run docs:validate
    
    - name: SonarCloud Scan
      uses: SonarSource/sonarcloud-github-action@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    
    - name: Upload Quality Reports
      uses: actions/upload-artifact@v3
      with:
        name: quality-reports
        path: |
          eslint-report.json
          sonar-reports/
```

### **Staging Deployment (.github/workflows/cd-staging.yml)**
```yaml
name: Deploy to Staging

on:
  push:
    branches: [ develop ]
  workflow_run:
    workflows: ["Progressive-Framework-v5 CI"]
    branches: [develop]
    types: [completed]

jobs:
  deploy-staging:
    name: Deploy to Staging Environment
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    
    environment:
      name: staging
      url: https://staging.your-domain.com
    
    steps:
    - name: Checkout Code
      uses: actions/checkout@v4
    
    - name: Configure AWS Credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Download Build Artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-artifacts-18.x
    
    - name: Deploy to Staging
      run: |
        # Build and push Docker images
        docker build -t $ECR_REGISTRY/progressive-framework-v5:staging-${{ github.sha }} .
        aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY
        docker push $ECR_REGISTRY/progressive-framework-v5:staging-${{ github.sha }}
        
        # Deploy to ECS
        aws ecs update-service --cluster staging-cluster --service progressive-framework-v5-staging --force-new-deployment
      env:
        ECR_REGISTRY: ${{ secrets.ECR_REGISTRY }}
    
    - name: Deploy Context Agents
      run: |
        # Deploy each agent
        kubectl config use-context staging
        envsubst < k8s/agents/mca-deployment.yml | kubectl apply -f -
        envsubst < k8s/agents/npa-deployment.yml | kubectl apply -f -
        envsubst < k8s/agents/wpa-deployment.yml | kubectl apply -f -
      env:
        KUBE_CONFIG_DATA: ${{ secrets.KUBE_CONFIG_DATA_STAGING }}
        IMAGE_TAG: staging-${{ github.sha }}
    
    - name: Run Staging Health Checks
      run: |
        sleep 60
        curl -f https://staging.your-domain.com/health
        curl -f https://staging.your-domain.com/api/v1/agents/health
    
    - name: Run Staging Tests
      run: |
        npm run test:staging
        npm run test:agents:staging
    
    - name: Notify Deployment Status
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        message: |
          Staging deployment completed! 🚀
          Branch: ${{ github.ref }}
          Commit: ${{ github.sha }}
          URL: https://staging.your-domain.com
```

### **Production Deployment (.github/workflows/cd-production.yml)**
```yaml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  deploy-production:
    name: Deploy to Production Environment
    runs-on: ubuntu-latest
    
    environment:
      name: production
      url: https://your-domain.com
    
    steps:
    - name: Checkout Code
      uses: actions/checkout@v4
    
    - name: Verify Tag Format
      run: |
        if [[ ! ${{ github.ref }} =~ ^refs/tags/v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
          echo "Invalid tag format. Use v1.2.3"
          exit 1
        fi
    
    - name: Download Release Artifacts
      run: |
        # Download pre-built artifacts from staging
        aws s3 cp s3://build-artifacts/staging-${{ github.sha }}.tar.gz .
        tar -xzf staging-${{ github.sha }}.tar.gz
    
    - name: Blue-Green Deployment Setup
      run: |
        # Create new version deployment
        export NEW_VERSION=${GITHUB_REF#refs/tags/}
        export CURRENT_VERSION=$(kubectl get deployment progressive-framework-v5-production -o jsonpath='{.metadata.labels.version}')
        
        echo "Deploying version: $NEW_VERSION"
        echo "Current version: $CURRENT_VERSION"
        
        # Deploy new version alongside current
        envsubst < k8s/production/blue-green-deployment.yml | kubectl apply -f -
    
    - name: Health Check New Deployment
      run: |
        # Wait for new deployment to be ready
        kubectl wait --for=condition=available --timeout=300s deployment/progressive-framework-v5-production-green
        
        # Run health checks
        GREEN_SERVICE_IP=$(kubectl get service progressive-framework-v5-production-green -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
        curl -f http://$GREEN_SERVICE_IP/health
        curl -f http://$GREEN_SERVICE_IP/api/v1/agents/health
    
    - name: Run Production Smoke Tests
      run: |
        npm run test:smoke:production
        npm run test:agents:smoke:production
    
    - name: Switch Traffic to New Version
      run: |
        # Switch traffic from blue to green
        kubectl patch service progressive-framework-v5-production -p '{"spec":{"selector":{"version":"green"}}}'
        
        # Wait and verify traffic switch
        sleep 30
        curl -f https://your-domain.com/health
    
    - name: Cleanup Old Version
      run: |
        # Wait 5 minutes before cleanup
        sleep 300
        
        # Remove old version
        kubectl delete deployment progressive-framework-v5-production-blue
        kubectl delete service progressive-framework-v5-production-blue
    
    - name: Update Agent Production Deployments
      run: |
        # Deploy agents to production
        export NEW_VERSION=${GITHUB_REF#refs/tags/}
        
        # Rolling update for each agent
        kubectl set image deployment/mca-production mca=$ECR_REGISTRY/progressive-agents:$NEW_VERSION
        kubectl set image deployment/npa-production npa=$ECR_REGISTRY/progressive-agents:$NEW_VERSION
        kubectl set image deployment/wpa-production wpa=$ECR_REGISTRY/progressive-agents:$NEW_VERSION
        
        # Wait for rollout
        kubectl rollout status deployment/mca-production
        kubectl rollout status deployment/npa-production
        kubectl rollout status deployment/wpa-production
    
    - name: Create GitHub Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: Release ${{ github.ref }}
        body: |
          ## Changes in this Release
          - Enterprise core system updates
          - Context agent improvements
          - Performance optimizations
          - Security enhancements
        draft: false
        prerelease: false
    
    - name: Post-Deployment Monitoring
      run: |
        # Set up enhanced monitoring for 24 hours
        kubectl apply -f monitoring/production-enhanced-alerts.yml
        
        # Schedule alert cleanup
        echo "kubectl delete -f monitoring/production-enhanced-alerts.yml" | at now + 24 hours
    
    - name: Notify Production Deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#production-alerts'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        message: |
          🎉 PRODUCTION DEPLOYMENT SUCCESSFUL! 🎉
          Version: ${{ github.ref }}
          Commit: ${{ github.sha }}
          URL: https://your-domain.com
          
          All systems operational ✅
          Context agents deployed ✅
          Health checks passing ✅
```

---

## **JENKINS IMPLEMENTATION**

### **Jenkinsfile (Alternative to GitHub Actions)**
```groovy
pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        DOCKER_REGISTRY = 'your-registry.com'
        KUBECONFIG = credentials('k8s-config')
        SONAR_TOKEN = credentials('sonar-token')
        SLACK_WEBHOOK = credentials('slack-webhook')
    }
    
    options {
        timeout(time: 45, unit: 'MINUTES')
        retry(2)
        skipDefaultCheckout(false)
    }
    
    stages {
        stage('Checkout & Setup') {
            parallel {
                stage('Code Checkout') {
                    steps {
                        checkout scm
                        script {
                            env.GIT_COMMIT_SHORT = sh(
                                script: 'git rev-parse --short HEAD',
                                returnStdout: true
                            ).trim()
                        }
                    }
                }
                stage('Environment Setup') {
                    steps {
                        sh '''
                            node --version
                            npm --version
                            docker --version
                            kubectl version --client
                        '''
                    }
                }
            }
        }
        
        stage('Build') {
            parallel {
                stage('Application Build') {
                    steps {
                        sh '''
                            npm ci --prefer-offline
                            npm run build
                            npm run build:agents
                        '''
                    }
                }
                stage('Docker Images') {
                    steps {
                        script {
                            def app_image = docker.build("progressive-framework-v5:${env.GIT_COMMIT_SHORT}")
                            def agent_image = docker.build("progressive-agents:${env.GIT_COMMIT_SHORT}", "-f docker/agents/Dockerfile .")
                        }
                    }
                }
            }
        }
        
        stage('Quality & Security') {
            parallel {
                stage('Code Quality') {
                    steps {
                        sh '''
                            npm run lint
                            npm run format:check
                        '''
                        
                        script {
                            def sonarqube = tool 'SonarScanner'
                            withSonarQubeEnv('SonarQube') {
                                sh "${sonarqube}/bin/sonar-scanner"
                            }
                        }
                    }
                }
                stage('Security Scan') {
                    steps {
                        sh '''
                            npm audit --audit-level=moderate
                            npm run lint:security
                        '''
                        
                        script {
                            sh 'docker run --rm -v $PWD:/tmp aquasec/trivy:latest fs --exit-code 1 --severity HIGH,CRITICAL /tmp'
                        }
                    }
                }
            }
        }
        
        stage('Testing') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh '''
                            npm run test:unit -- --coverage
                            npm run test:agents:unit
                        '''
                    }
                    post {
                        always {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                        }
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh '''
                            npm run test:integration
                            npm run test:agents:integration
                        '''
                    }
                }
                stage('E2E Tests') {
                    steps {
                        sh '''
                            npm run test:e2e:ci
                            npm run test:agents:e2e
                        '''
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    // Push images to registry
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'registry-credentials') {
                        def app_image = docker.image("progressive-framework-v5:${env.GIT_COMMIT_SHORT}")
                        app_image.push("staging-${env.BUILD_NUMBER}")
                        app_image.push("staging-latest")
                        
                        def agent_image = docker.image("progressive-agents:${env.GIT_COMMIT_SHORT}")
                        agent_image.push("staging-${env.BUILD_NUMBER}")
                        agent_image.push("staging-latest")
                    }
                    
                    // Deploy to staging
                    sh '''
                        kubectl config use-context staging
                        kubectl set image deployment/progressive-framework-v5-staging \
                            app=${DOCKER_REGISTRY}/progressive-framework-v5:staging-${BUILD_NUMBER}
                        kubectl rollout status deployment/progressive-framework-v5-staging
                        
                        # Deploy agents
                        kubectl set image deployment/mca-staging mca=${DOCKER_REGISTRY}/progressive-agents:staging-${BUILD_NUMBER}
                        kubectl set image deployment/npa-staging npa=${DOCKER_REGISTRY}/progressive-agents:staging-${BUILD_NUMBER}
                        kubectl set image deployment/wpa-staging wpa=${DOCKER_REGISTRY}/progressive-agents:staging-${BUILD_NUMBER}
                        
                        kubectl rollout status deployment/mca-staging
                        kubectl rollout status deployment/npa-staging
                        kubectl rollout status deployment/wpa-staging
                    '''
                }
            }
        }
        
        stage('Staging Tests') {
            when {
                branch 'develop'
            }
            steps {
                sh '''
                    sleep 60
                    npm run test:staging
                    npm run test:agents:staging
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                tag pattern: 'v\\d+\\.\\d+\\.\\d+', comparator: 'REGEXP'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                
                script {
                    // Push production images
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'registry-credentials') {
                        def app_image = docker.image("progressive-framework-v5:${env.GIT_COMMIT_SHORT}")
                        app_image.push("production-${env.TAG_NAME}")
                        app_image.push("production-latest")
                        
                        def agent_image = docker.image("progressive-agents:${env.GIT_COMMIT_SHORT}")
                        agent_image.push("production-${env.TAG_NAME}")
                        agent_image.push("production-latest")
                    }
                    
                    // Blue-green deployment
                    sh '''
                        kubectl config use-context production
                        
                        # Deploy new version (green)
                        export IMAGE_TAG=production-${TAG_NAME}
                        envsubst < k8s/production/green-deployment.yml | kubectl apply -f -
                        kubectl rollout status deployment/progressive-framework-v5-production-green
                        
                        # Health check green deployment
                        kubectl run health-check --rm -i --restart=Never --image=curlimages/curl -- \
                            curl -f http://progressive-framework-v5-production-green:3000/health
                        
                        # Switch traffic to green
                        kubectl patch service progressive-framework-v5-production \
                            -p '{"spec":{"selector":{"version":"green"}}}'
                        
                        # Clean up blue deployment after 5 minutes
                        sleep 300
                        kubectl delete deployment progressive-framework-v5-production-blue || true
                    '''
                }
            }
        }
    }
    
    post {
        always {
            // Archive artifacts
            archiveArtifacts artifacts: 'dist/**, build/**, coverage/**, test-results/**', 
                            fingerprint: true, allowEmptyArchive: true
            
            // Publish test results
            publishTestResults testResultsPattern: 'test-results/**/*.xml'
        }
        
        success {
            script {
                def message = """
                    ✅ Pipeline Success!
                    Branch: ${env.BRANCH_NAME}
                    Commit: ${env.GIT_COMMIT_SHORT}
                    Build: ${env.BUILD_NUMBER}
                """
                
                if (env.BRANCH_NAME == 'main' || env.TAG_NAME) {
                    message += "\n🚀 Deployed to Production!"
                }
                
                slackSend(
                    channel: '#ci-cd',
                    color: 'good',
                    message: message,
                    teamDomain: 'your-workspace',
                    token: env.SLACK_WEBHOOK
                )
            }
        }
        
        failure {
            slackSend(
                channel: '#ci-cd',
                color: 'danger',
                message: """
                    ❌ Pipeline Failed!
                    Branch: ${env.BRANCH_NAME}
                    Commit: ${env.GIT_COMMIT_SHORT}
                    Build: ${env.BUILD_NUMBER}
                    Check: ${env.BUILD_URL}
                """,
                teamDomain: 'your-workspace',
                token: env.SLACK_WEBHOOK
            )
        }
    }
}
```

---

## **PACKAGE.JSON SCRIPTS**

### **CI/CD Related Scripts**
```json
{
  "scripts": {
    "build": "npm run build:app && npm run build:assets",
    "build:app": "babel src -d dist --copy-files --source-maps",
    "build:assets": "webpack --mode=production",
    "build:agents": "npm run build:agent:mca && npm run build:agent:npa && npm run build:agent:wpa",
    "build:agent:mca": "babel src/agents/mca -d dist/agents/mca",
    "build:agent:npa": "babel src/agents/npa -d dist/agents/npa",
    "build:agent:wpa": "babel src/agents/wpa -d dist/agents/wpa",
    
    "test": "npm run test:unit && npm run test:integration",
    "test:unit": "jest --testPathPattern=unit --coverage",
    "test:integration": "jest --testPathPattern=integration --runInBand",
    "test:e2e": "cypress run",
    "test:e2e:ci": "cypress run --record --key=$CYPRESS_RECORD_KEY",
    "test:api": "newman run tests/api/collection.json -e tests/api/environment.json",
    "test:load": "k6 run tests/load/load-test.js",
    
    "test:agents": "npm run test:agents:unit && npm run test:agents:integration",
    "test:agents:unit": "jest --testPathPattern=agents/unit",
    "test:agents:integration": "jest --testPathPattern=agents/integration",
    "test:agents:e2e": "cypress run --spec 'tests/e2e/agents/**/*'",
    "test:agents:load": "k6 run tests/load/agents-load-test.js",
    
    "test:agent:mca": "jest --testPathPattern=agents/mca",
    "test:agent:npa": "jest --testPathPattern=agents/npa", 
    "test:agent:wpa": "jest --testPathPattern=agents/wpa",
    
    "test:staging": "ENVIRONMENT=staging npm run test:api && npm run test:e2e",
    "test:agents:staging": "ENVIRONMENT=staging npm run test:agents:e2e",
    "test:smoke:production": "ENVIRONMENT=production npm run test:smoke",
    "test:agents:smoke:production": "ENVIRONMENT=production npm run test:agents:smoke",
    
    "lint": "eslint src/ tests/",
    "lint:fix": "eslint src/ tests/ --fix",
    "lint:security": "eslint src/ --config .eslintrc.security.js",
    
    "format": "prettier --write src/ tests/",
    "format:check": "prettier --check src/ tests/",
    
    "db:setup:test": "NODE_ENV=test npm run db:migrate && npm run db:seed",
    "agents:setup:test": "NODE_ENV=test npm run agents:init",
    "agents:init": "node scripts/init-agents.js",
    "agents:test": "node scripts/test-agents.js",
    
    "security:audit": "npm audit --audit-level=moderate",
    "security:fix": "npm audit fix",
    "security:check": "npm run security:audit && npm run lint:security",
    
    "docs:validate": "jsdoc -c jsdoc.conf.json --dry-run",
    "docs:generate": "jsdoc -c jsdoc.conf.json",
    
    "start:test": "NODE_ENV=test pm2-runtime start ecosystem.test.config.js",
    "start:staging": "NODE_ENV=staging pm2-runtime start ecosystem.staging.config.js",
    "start:production": "NODE_ENV=production pm2-runtime start ecosystem.production.config.js"
  }
}
```

---

## **DOCKER CONFIGURATIONS**

### **Main Application Dockerfile**
```dockerfile
# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --prefer-offline

# Copy source code
COPY . .

# Build application
RUN npm run build

# ===============================================
# Production stage
# ===============================================
FROM node:18-alpine AS production

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy built application and dependencies
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --chown=nodejs:nodejs scripts/ ./scripts/

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node scripts/health-check.js || exit 1

# Expose port
EXPOSE 3000

# Start application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

### **Context Agents Dockerfile**
```dockerfile
FROM node:18-alpine AS agent-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy agent source code
COPY src/agents/ ./src/agents/
COPY src/core/ ./src/core/
COPY src/lib/ ./src/lib/

# Build agents
RUN npm run build:agents

# ===============================================
# Agent runtime
# ===============================================
FROM node:18-alpine AS agent-runtime

RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy built agents
COPY --from=agent-builder --chown=nodejs:nodejs /app/dist/agents ./agents
COPY --from=agent-builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=agent-builder --chown=nodejs:nodejs /app/package*.json ./

USER nodejs

# Health check for agents
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node agents/health-check.js || exit 1

EXPOSE 8000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "agents/coordinator.js"]
```

### **Docker Compose for CI Testing**
```yaml
version: '3.8'

services:
  app:
    build: 
      context: .
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=test
      - POSTGRES_HOST=postgres
      - REDIS_HOST=redis
      - MONGODB_HOST=mongodb
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      mongodb:
        condition: service_started
    ports:
      - "3000:3000"
  
  agents:
    build:
      context: .
      dockerfile: docker/agents/Dockerfile
    environment:
      - NODE_ENV=test
      - MCA_ENABLED=true
      - NPA_ENABLED=true
      - WPA_ENABLED=true
    depends_on:
      - app
    ports:
      - "8000:8000"
  
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: test_db
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U test_user"]
      interval: 10s
      timeout: 5s
      retries: 5
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    ports:
      - "6379:6379"
  
  mongodb:
    image: mongo:7.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: test_user
      MONGO_INITDB_ROOT_PASSWORD: test_password
    ports:
      - "27017:27017"
  
  nginx:
    image: nginx:alpine
    volumes:
      - ./docker/nginx/ci.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
    ports:
      - "80:80"
```

---

## **MONITORING & ALERTS**

### **Pipeline Performance Monitoring**
```yaml
# .github/workflows/pipeline-monitor.yml
name: Pipeline Performance Monitor

on:
  workflow_run:
    workflows: ["Progressive-Framework-v5 CI"]
    types: [completed]

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
    - name: Collect Pipeline Metrics
      run: |
        # Get pipeline duration
        DURATION=${{ github.event.workflow_run.run_time }}
        
        # Send metrics to monitoring system
        curl -X POST "$METRICS_ENDPOINT/pipeline/duration" \
          -H "Authorization: Bearer $METRICS_TOKEN" \
          -d "{
            \"workflow\": \"ci\",
            \"duration\": $DURATION,
            \"status\": \"${{ github.event.workflow_run.conclusion }}\",
            \"branch\": \"${{ github.event.workflow_run.head_branch }}\"
          }"
      env:
        METRICS_ENDPOINT: ${{ secrets.METRICS_ENDPOINT }}
        METRICS_TOKEN: ${{ secrets.METRICS_TOKEN }}
    
    - name: Check for Performance Regression
      run: |
        # Alert if pipeline takes more than 30 minutes
        if [ ${{ github.event.workflow_run.run_time }} -gt 1800 ]; then
          curl -X POST $SLACK_WEBHOOK \
            -H 'Content-type: application/json' \
            -d '{"text":"⚠️ CI Pipeline performance regression detected! Duration: ${{ github.event.workflow_run.run_time }}s"}'
        fi
      env:
        SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```

### **Deployment Success Rate Tracking**
```bash
#!/bin/bash
# scripts/track-deployment-success.sh

ENVIRONMENT=$1
STATUS=$2
VERSION=$3

# Send deployment metrics to monitoring system
curl -X POST "$METRICS_ENDPOINT/deployment/status" \
  -H "Authorization: Bearer $METRICS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"environment\": \"$ENVIRONMENT\",
    \"status\": \"$STATUS\",
    \"version\": \"$VERSION\",
    \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
    \"deployment_id\": \"$GITHUB_RUN_ID\"
  }"

# Calculate success rate for last 30 days
SUCCESS_RATE=$(curl -s "$METRICS_ENDPOINT/deployment/success-rate?days=30&environment=$ENVIRONMENT" | jq -r '.rate')

# Alert if success rate drops below 95%
if (( $(echo "$SUCCESS_RATE < 0.95" | bc -l) )); then
  curl -X POST $SLACK_WEBHOOK \
    -H 'Content-type: application/json' \
    -d "{\"text\":\"🚨 Deployment success rate for $ENVIRONMENT is below 95%: $SUCCESS_RATE\"}"
fi
```

---

## **ROLLBACK PROCEDURES**

### **Automated Rollback Script**
```bash
#!/bin/bash
# scripts/rollback.sh

ENVIRONMENT=$1
TARGET_VERSION=$2

echo "🔄 Starting rollback for $ENVIRONMENT to version $TARGET_VERSION"

case $ENVIRONMENT in
  "staging")
    kubectl config use-context staging
    kubectl set image deployment/progressive-framework-v5-staging \
      app=$DOCKER_REGISTRY/progressive-framework-v5:staging-$TARGET_VERSION
    kubectl rollout undo deployment/progressive-framework-v5-staging
    ;;
    
  "production")
    echo "⚠️  Production rollback requires manual confirmation"
    read -p "Are you sure you want to rollback production? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
      kubectl config use-context production
      
      # Blue-green rollback
      kubectl patch service progressive-framework-v5-production \
        -p '{"spec":{"selector":{"version":"blue"}}}'
      
      # Update blue deployment to target version
      kubectl set image deployment/progressive-framework-v5-production-blue \
        app=$DOCKER_REGISTRY/progressive-framework-v5:production-$TARGET_VERSION
      
      echo "✅ Rollback completed to version $TARGET_VERSION"
    else
      echo "❌ Rollback cancelled"
      exit 1
    fi
    ;;
    
  *)
    echo "❌ Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac

# Health check after rollback
sleep 60
if [ "$ENVIRONMENT" = "staging" ]; then
  curl -f https://staging.your-domain.com/health
else
  curl -f https://your-domain.com/health
fi

echo "✅ Rollback completed and health check passed"
```

---

## **BEST PRACTICES**

### **Security Best Practices**
1. **Secrets Management**
   - Use encrypted secrets in CI/CD platform
   - Rotate secrets regularly
   - Never commit secrets to repository
   - Use separate secrets for each environment

2. **Image Security**
   - Scan images for vulnerabilities
   - Use minimal base images (Alpine)
   - Run containers as non-root users
   - Keep images updated

3. **Access Control**
   - Implement least privilege principle
   - Use service accounts for deployments
   - Enable audit logging
   - Require approval for production deployments

### **Performance Optimization**
1. **Build Optimization**
   - Use build caches effectively
   - Parallel job execution
   - Incremental builds where possible
   - Optimize Docker layer caching

2. **Test Optimization**
   - Run tests in parallel
   - Use test result caching
   - Fail fast on critical issues
   - Smart test selection based on changes

3. **Deployment Optimization**
   - Blue-green deployments for zero downtime
   - Health checks before traffic switching
   - Gradual rollouts for large changes
   - Quick rollback procedures

### **Monitoring & Observability**
1. **Pipeline Monitoring**
   - Track build times and success rates
   - Monitor resource usage
   - Alert on failures or performance regression
   - Collect deployment metrics

2. **Application Monitoring**
   - Health checks at multiple levels
   - Performance monitoring post-deployment
   - Error tracking and alerting
   - User experience monitoring

---

## **TROUBLESHOOTING**

### **Common CI/CD Issues**

#### **Build Failures**
```bash
# Check build logs
gh workflow view --log

# Re-run specific job
gh workflow run ci.yml

# Debug locally with act (GitHub Actions)
act -j build -v
```

#### **Test Failures**
```bash
# Run tests locally with same environment
docker-compose -f docker-compose.ci.yml up -d
npm run test:integration
docker-compose -f docker-compose.ci.yml down

# Check test artifacts
gh run download <run-id> -n test-results
```

#### **Deployment Issues**
```bash
# Check deployment status
kubectl get deployments -n production
kubectl describe deployment progressive-framework-v5-production

# Check pod logs
kubectl logs -l app=progressive-framework-v5 -n production --tail=100

# Rollback if needed
./scripts/rollback.sh production <previous-version>
```

#### **Agent Deployment Issues**
```bash
# Check agent status
curl -f https://your-domain.com/api/v1/agents/health

# Check individual agent logs
kubectl logs -l app=mca -n production
kubectl logs -l app=npa -n production 
kubectl logs -l app=wpa -n production

# Restart specific agent
kubectl rollout restart deployment/npa-production
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Deployment Guide](Deployment-Guide.md)** - Manual deployment procedures
- **[Security Overview](../04-Security/Security-Overview.md)** - Security requirements

### **Follow-up Documents**
- **[Environment Management](Environment-Management.md)** - Multi-environment strategies
- **[Container Orchestration](Container-Orchestration.md)** - Kubernetes deployment details
- **[Monitoring & Alerting](Monitoring-Alerting.md)** - System monitoring setup

### **Operations Context**
- **[Emergency Procedures & Rollback](../01-Core-System/Emergency-Procedures-Rollback.md)** - Crisis management
- **[Load Balancing & Resource Management](../06-Infrastructure/Load-Balancing-Resource-Management.md)** - Infrastructure scaling

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | DevOps Team | Complete CI/CD pipeline implementation |
| 4.x | 2025-08-xx | Dev Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: DevOps Team  
**Last Validated**: 2025-09-02