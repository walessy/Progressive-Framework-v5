---
file: docs/08-Admin/System-Administration.md
directory: docs/08-Admin/
priority: CRITICAL
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# System Administration - Progressive-Framework-v5

**File Path**: `docs/08-Admin/System-Administration.md`  
**Directory**: `docs/08-Admin/`  
**Priority**: CRITICAL  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive system administration guide for Progressive-Framework-v5, covering daily operations, maintenance procedures, monitoring, security management, backup operations, performance tuning, and administrative tasks for the enterprise health and fitness platform with context agents (MCA, NPA, WPA).

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🔧 **[Common Issues & Resolution](../09-Troubleshooting/Common-Issues-Resolution.md)** - *Troubleshooting procedures*
- 📋 **[Monitoring & Alerting](../05-DevOps/Monitoring-Alerting.md)** - *Monitoring system setup*
- 🐳 **[Container Orchestration](../05-DevOps/Container-Orchestration.md)** - *Kubernetes administration*
- 🛡️ **[Security Overview](../04-Security/Security-Overview.md)** - *Security policies and procedures*

---

## **ADMINISTRATOR QUICK REFERENCE**

### **Daily Operations Checklist**
```bash
#!/bin/bash
# Daily Administrative Tasks - Progressive-Framework-v5

echo "🚀 Progressive Framework v5 - Daily Admin Tasks"
echo "================================================"
echo "Date: $(date)"
echo "Administrator: $(whoami)"
echo ""

# 1. System Health Check
echo "1. 🏥 SYSTEM HEALTH CHECK"
echo "-------------------------"
kubectl get nodes -o wide
kubectl get pods -A | grep -v Running | head -10
kubectl top nodes
kubectl top pods -n progressive-framework-prod --sort-by=memory | head -5
echo ""

# 2. Application Status
echo "2. 📱 APPLICATION STATUS"
echo "------------------------"
kubectl get deployments -n progressive-framework-prod
kubectl get services -n progressive-framework-prod
curl -s https://your-domain.com/health | jq .
echo ""

# 3. Agent Health
echo "3. 🤖 CONTEXT AGENTS STATUS"
echo "---------------------------"
kubectl get pods -l tier=agents -n progressive-framework-prod
kubectl exec -n progressive-framework-prod deployment/mca -- curl -s http://localhost:8000/health | jq .status
kubectl exec -n progressive-framework-prod deployment/npa -- curl -s http://localhost:8000/health | jq .status
kubectl exec -n progressive-framework-prod deployment/wpa -- curl -s http://localhost:8000/health | jq .status
echo ""

# 4. Database Health
echo "4. 🗄️ DATABASE HEALTH"
echo "--------------------"
kubectl exec -n progressive-framework-prod statefulset/postgres -- pg_isready -U progressive_user
kubectl exec -n progressive-framework-prod statefulset/postgres -- psql -U progressive_user -d progressive_framework_v5 -c "SELECT count(*) as active_connections FROM pg_stat_activity;"
kubectl exec -n progressive-framework-prod deployment/redis -- redis-cli ping
echo ""

# 5. Storage & Backup Status
echo "5. 💾 STORAGE & BACKUP STATUS"
echo "-----------------------------"
kubectl get pv,pvc -n progressive-framework-prod
aws s3 ls s3://progressive-backups/$(date +%Y/%m/%d)/ | tail -5
echo ""

# 6. Security Check
echo "6. 🔒 SECURITY STATUS"
echo "-------------------"
kubectl get certificates -n progressive-framework-prod
kubectl get secrets -n progressive-framework-prod | grep -E "(tls|certificate)" | head -5
echo ""

# 7. Performance Metrics
echo "7. 📊 PERFORMANCE SUMMARY"
echo "------------------------"
echo "Active Users (last 15min): $(kubectl exec -n progressive-framework-prod deployment/progressive-framework-v5 -- python manage.py shell -c "from django.contrib.auth.models import User; from datetime import datetime, timedelta; print(User.objects.filter(last_login__gte=datetime.now()-timedelta(minutes=15)).count())")"
echo "API Response Time: $(curl -o /dev/null -s -w '%{time_total}' https://your-domain.com/api/health)s"
echo ""

echo "✅ Daily health check completed at $(date)"
echo "Report saved to: /var/log/admin/daily-check-$(date +%Y%m%d).log"
```

### **Emergency Contact Information**
| Role | Contact | Escalation Level |
|------|---------|-----------------|
| **Primary Admin** | admin@your-domain.com | Level 1 |
| **Database Admin** | dba@your-domain.com | Level 2 |
| **Security Team** | security@your-domain.com | Level 1 |
| **DevOps On-Call** | +1-555-DEVOPS | Level 1 |
| **Management** | management@your-domain.com | Level 3 |

---

## **USER MANAGEMENT**

### **User Account Administration**

**Create New Administrator**
```bash
#!/bin/bash
# Create new administrator account

NEW_ADMIN_EMAIL="$1"
NEW_ADMIN_NAME="$2"

if [ -z "$NEW_ADMIN_EMAIL" ] || [ -z "$NEW_ADMIN_NAME" ]; then
    echo "Usage: $0 <email> <full_name>"
    exit 1
fi

echo "Creating administrator account for: $NEW_ADMIN_NAME ($NEW_ADMIN_EMAIL)"

# Create user in database
kubectl exec -n progressive-framework-prod deployment/progressive-framework-v5 -- python manage.py shell << EOF
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
import secrets
import string

# Generate secure password
password = ''.join(secrets.choice(string.ascii_letters + string.digits + '!@#$%^&*') for _ in range(16))

# Create user
user = User.objects.create_user(
    username='$NEW_ADMIN_EMAIL',
    email='$NEW_ADMIN_EMAIL',
    first_name='$(echo "$NEW_ADMIN_NAME" | cut -d' ' -f1)',
    last_name='$(echo "$NEW_ADMIN_NAME" | cut -d' ' -f2-)',
    password=password,
    is_staff=True,
    is_superuser=True
)

# Add to admin groups
admin_group, created = Group.objects.get_or_create(name='Administrators')
user.groups.add(admin_group)

print(f"User created successfully")
print(f"Username: {user.username}")
print(f"Temporary Password: {password}")
print(f"User must change password on first login")

# Log the action
import logging
logger = logging.getLogger('admin_actions')
logger.info(f'Administrator account created: {user.username} by system admin')
EOF

# Send credentials via secure method
echo "Administrator account created. Secure credentials have been generated."
echo "Next steps:"
echo "1. Securely share credentials with $NEW_ADMIN_NAME"
echo "2. Ensure password is changed on first login"
echo "3. Verify 2FA setup within 24 hours"
```

**User Account Maintenance**
```python
# scripts/user_maintenance.py
"""
User Account Maintenance Script
"""

import os
import django
from datetime import datetime, timedelta
from django.contrib.auth.models import User
from django.core.mail import send_mail
import logging

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'progressive_framework.settings')
django.setup()

def cleanup_inactive_users():
    """Remove users inactive for more than 2 years"""
    
    cutoff_date = datetime.now() - timedelta(days=730)  # 2 years
    
    inactive_users = User.objects.filter(
        last_login__lt=cutoff_date,
        is_active=True,
        is_staff=False  # Don't auto-delete staff accounts
    )
    
    print(f"Found {inactive_users.count()} inactive users")
    
    for user in inactive_users:
        print(f"Deactivating user: {user.username} (last login: {user.last_login})")
        
        # Send notification before deactivation
        send_mail(
            subject='Account Deactivation Notice - Progressive Framework',
            message=f"""
            Dear {user.first_name or user.username},
            
            Your Progressive Framework account has been inactive for over 2 years.
            Your account will be deactivated in 30 days.
            
            To reactivate, please log in at: https://your-domain.com/login
            
            Best regards,
            Progressive Framework Team
            """,
            from_email='noreply@your-domain.com',
            recipient_list=[user.email],
            fail_silently=True
        )
        
        # Mark for deactivation (don't delete immediately)
        user.is_active = False
        user.save()
        
        # Log the action
        logging.info(f'User deactivated for inactivity: {user.username}')

def check_admin_accounts():
    """Audit administrator accounts"""
    
    admin_users = User.objects.filter(is_superuser=True)
    
    print(f"=== ADMINISTRATOR ACCOUNT AUDIT ===")
    print(f"Total administrator accounts: {admin_users.count()}")
    
    for admin in admin_users:
        print(f"Admin: {admin.username}")
        print(f"  Email: {admin.email}")
        print(f"  Last Login: {admin.last_login}")
        print(f"  Date Joined: {admin.date_joined}")
        print(f"  Active: {admin.is_active}")
        print(f"  Staff: {admin.is_staff}")
        print("")
        
        # Check for inactive admin accounts
        if admin.last_login and admin.last_login < (datetime.now() - timedelta(days=90)):
            print(f"  ⚠️  WARNING: Admin {admin.username} not logged in for 90+ days")
            
            # Send alert to security team
            send_mail(
                subject='Inactive Administrator Account Alert',
                message=f'Administrator {admin.username} has not logged in for 90+ days. Last login: {admin.last_login}',
                from_email='security@your-domain.com',
                recipient_list=['security-team@your-domain.com'],
                fail_silently=True
            )

def generate_user_report():
    """Generate comprehensive user statistics"""
    
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    staff_users = User.objects.filter(is_staff=True).count()
    superusers = User.objects.filter(is_superuser=True).count()
    
    # Recent activity
    last_30_days = User.objects.filter(last_login__gte=datetime.now() - timedelta(days=30)).count()
    last_7_days = User.objects.filter(last_login__gte=datetime.now() - timedelta(days=7)).count()
    last_24_hours = User.objects.filter(last_login__gte=datetime.now() - timedelta(days=1)).count()
    
    # New registrations
    new_this_month = User.objects.filter(date_joined__gte=datetime.now() - timedelta(days=30)).count()
    new_this_week = User.objects.filter(date_joined__gte=datetime.now() - timedelta(days=7)).count()
    
    report = f"""
    === PROGRESSIVE FRAMEWORK USER REPORT ===
    Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
    
    ACCOUNT STATISTICS:
    - Total Users: {total_users:,}
    - Active Users: {active_users:,}
    - Staff Users: {staff_users:,}
    - Super Users: {superusers:,}
    
    RECENT ACTIVITY:
    - Last 24 hours: {last_24_hours:,}
    - Last 7 days: {last_7_days:,}
    - Last 30 days: {last_30_days:,}
    
    NEW REGISTRATIONS:
    - This week: {new_this_week:,}
    - This month: {new_this_month:,}
    
    ACTIVITY RATE:
    - Daily active: {(last_24_hours/active_users*100):.1f}%
    - Weekly active: {(last_7_days/active_users*100):.1f}%
    - Monthly active: {(last_30_days/active_users*100):.1f}%
    """
    
    print(report)
    
    # Save report
    with open(f'/var/log/admin/user-report-{datetime.now().strftime("%Y%m%d")}.txt', 'w') as f:
        f.write(report)
    
    return report

if __name__ == "__main__":
    print("=== USER MAINTENANCE SCRIPT ===")
    
    # Generate report
    generate_user_report()
    
    # Audit admin accounts
    check_admin_accounts()
    
    # Cleanup inactive users (commented out for safety)
    # cleanup_inactive_users()
    
    print("=== MAINTENANCE COMPLETED ===")
```

---

## **SERVICE MANAGEMENT**

### **Application Service Management**

**Service Control Commands**
```bash
#!/bin/bash
# Progressive Framework Service Management

# Function to display service status
show_service_status() {
    echo "=== PROGRESSIVE FRAMEWORK SERVICE STATUS ==="
    echo ""
    
    # Main application
    echo "📱 MAIN APPLICATION:"
    kubectl get deployment progressive-framework-v5 -n progressive-framework-prod
    kubectl get pods -l app=progressive-framework-v5 -n progressive-framework-prod
    echo ""
    
    # Context Agents
    echo "🤖 CONTEXT AGENTS:"
    echo "MCA (Master Coordination Agent):"
    kubectl get deployment mca -n progressive-framework-prod
    echo "NPA (Nutrition Planning Agent):"
    kubectl get deployment npa -n progressive-framework-prod
    echo "WPA (Workout Planning Agent):"
    kubectl get deployment wpa -n progressive-framework-prod
    echo ""
    
    # Databases
    echo "🗄️ DATABASES:"
    echo "PostgreSQL:"
    kubectl get statefulset postgres -n progressive-framework-prod
    echo "Redis:"
    kubectl get deployment redis -n progressive-framework-prod
    echo "MongoDB:"
    kubectl get statefulset mongodb -n progressive-framework-prod
    echo ""
    
    # Supporting Services
    echo "🔧 SUPPORTING SERVICES:"
    kubectl get deployments -n progressive-framework-prod | grep -E "(nginx|elasticsearch|logstash)"
}

# Function to restart specific service
restart_service() {
    SERVICE_NAME=$1
    
    if [ -z "$SERVICE_NAME" ]; then
        echo "Usage: restart_service <service_name>"
        echo "Available services: app, mca, npa, wpa, postgres, redis, mongodb, nginx"
        return 1
    fi
    
    echo "🔄 Restarting $SERVICE_NAME..."
    
    case $SERVICE_NAME in
        "app"|"main")
            kubectl rollout restart deployment/progressive-framework-v5 -n progressive-framework-prod
            kubectl rollout status deployment/progressive-framework-v5 -n progressive-framework-prod
            ;;
        "mca")
            kubectl rollout restart deployment/mca -n progressive-framework-prod
            kubectl rollout status deployment/mca -n progressive-framework-prod
            ;;
        "npa")
            kubectl rollout restart deployment/npa -n progressive-framework-prod
            kubectl rollout status deployment/npa -n progressive-framework-prod
            ;;
        "wpa")
            kubectl rollout restart deployment/wpa -n progressive-framework-prod
            kubectl rollout status deployment/wpa -n progressive-framework-prod
            ;;
        "postgres")
            kubectl rollout restart statefulset/postgres -n progressive-framework-prod
            kubectl rollout status statefulset/postgres -n progressive-framework-prod
            ;;
        "redis")
            kubectl rollout restart deployment/redis -n progressive-framework-prod
            kubectl rollout status deployment/redis -n progressive-framework-prod
            ;;
        "mongodb")
            kubectl rollout restart statefulset/mongodb -n progressive-framework-prod
            kubectl rollout status statefulset/mongodb -n progressive-framework-prod
            ;;
        "nginx")
            kubectl rollout restart deployment/nginx-ingress-controller -n ingress-nginx
            kubectl rollout status deployment/nginx-ingress-controller -n ingress-nginx
            ;;
        "all")
            echo "⚠️  WARNING: This will restart ALL services!"
            read -p "Are you sure? (yes/no): " confirm
            if [ "$confirm" = "yes" ]; then
                kubectl rollout restart deployment -n progressive-framework-prod
                kubectl rollout restart statefulset -n progressive-framework-prod
            else
                echo "Operation cancelled."
            fi
            ;;
        *)
            echo "❌ Unknown service: $SERVICE_NAME"
            return 1
            ;;
    esac
    
    echo "✅ Service restart completed: $SERVICE_NAME"
}

# Function to scale services
scale_service() {
    SERVICE_NAME=$1
    REPLICAS=$2
    
    if [ -z "$SERVICE_NAME" ] || [ -z "$REPLICAS" ]; then
        echo "Usage: scale_service <service_name> <replica_count>"
        return 1
    fi
    
    echo "📈 Scaling $SERVICE_NAME to $REPLICAS replicas..."
    
    case $SERVICE_NAME in
        "app"|"main")
            kubectl scale deployment progressive-framework-v5 --replicas=$REPLICAS -n progressive-framework-prod
            ;;
        "mca")
            kubectl scale deployment mca --replicas=$REPLICAS -n progressive-framework-prod
            ;;
        "npa")
            kubectl scale deployment npa --replicas=$REPLICAS -n progressive-framework-prod
            ;;
        "wpa")
            kubectl scale deployment wpa --replicas=$REPLICAS -n progressive-framework-prod
            ;;
        *)
            echo "❌ Scaling not supported for: $SERVICE_NAME"
            return 1
            ;;
    esac
    
    echo "✅ Service scaled: $SERVICE_NAME to $REPLICAS replicas"
}

# Function to check service health
check_service_health() {
    SERVICE_NAME=${1:-"all"}
    
    echo "🏥 Checking service health: $SERVICE_NAME"
    echo ""
    
    case $SERVICE_NAME in
        "app"|"main"|"all")
            echo "Main Application Health:"
            curl -s https://your-domain.com/health | jq . || echo "❌ Main app health check failed"
            echo ""
            ;;& # Fall through to next case
        "agents"|"all")
            echo "Agent Health:"
            kubectl exec -n progressive-framework-prod deployment/mca -- curl -s http://localhost:8000/health | jq . 2>/dev/null || echo "❌ MCA health check failed"
            kubectl exec -n progressive-framework-prod deployment/npa -- curl -s http://localhost:8000/health | jq . 2>/dev/null || echo "❌ NPA health check failed"
            kubectl exec -n progressive-framework-prod deployment/wpa -- curl -s http://localhost:8000/health | jq . 2>/dev/null || echo "❌ WPA health check failed"
            echo ""
            ;;& # Fall through
        "database"|"all")
            echo "Database Health:"
            kubectl exec -n progressive-framework-prod statefulset/postgres -- pg_isready -U progressive_user && echo "✅ PostgreSQL healthy" || echo "❌ PostgreSQL unhealthy"
            kubectl exec -n progressive-framework-prod deployment/redis -- redis-cli ping | grep -q PONG && echo "✅ Redis healthy" || echo "❌ Redis unhealthy"
            kubectl exec -n progressive-framework-prod statefulset/mongodb -- mongosh --eval "db.runCommand('ping')" | grep -q ok && echo "✅ MongoDB healthy" || echo "❌ MongoDB unhealthy"
            ;;
    esac
}

# Parse command line arguments
case "${1:-status}" in
    "status")
        show_service_status
        ;;
    "restart")
        restart_service "$2"
        ;;
    "scale")
        scale_service "$2" "$3"
        ;;
    "health"|"check")
        check_service_health "$2"
        ;;
    "help")
        echo "Progressive Framework Service Management"
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  status              - Show service status (default)"
        echo "  restart <service>   - Restart specific service"
        echo "  scale <service> <n> - Scale service to n replicas"
        echo "  health [service]    - Check service health"
        echo "  help                - Show this help"
        echo ""
        echo "Services: app, mca, npa, wpa, postgres, redis, mongodb, nginx, all"
        ;;
    *)
        echo "Unknown command: $1"
        echo "Use '$0 help' for usage information."
        exit 1
        ;;
esac
```

### **Configuration Management**

**Environment Configuration Updates**
```bash
#!/bin/bash
# Configuration Management Script

update_config() {
    CONFIG_TYPE=$1
    CONFIG_FILE=$2
    
    case $CONFIG_TYPE in
        "app")
            # Update application configuration
            kubectl create configmap app-config \
                --from-file=$CONFIG_FILE \
                --dry-run=client -o yaml | kubectl apply -f -
            
            # Restart pods to pick up new config
            kubectl rollout restart deployment/progressive-framework-v5 -n progressive-framework-prod
            echo "✅ Application configuration updated"
            ;;
        "database")
            # Update database configuration
            kubectl create configmap postgres-config \
                --from-file=$CONFIG_FILE \
                --dry-run=client -o yaml | kubectl apply -f -
            
            # Note: Database restart may be required for some changes
            echo "✅ Database configuration updated (restart may be required)"
            ;;
        "nginx")
            # Update nginx configuration
            kubectl create configmap nginx-config \
                --from-file=$CONFIG_FILE \
                --dry-run=client -o yaml | kubectl apply -f -
            
            kubectl rollout restart deployment/nginx-ingress-controller -n ingress-nginx
            echo "✅ Nginx configuration updated"
            ;;
        *)
            echo "❌ Unknown configuration type: $CONFIG_TYPE"
            echo "Supported types: app, database, nginx"
            exit 1
            ;;
    esac
}

# Function to backup current configuration
backup_config() {
    BACKUP_DIR="/var/backups/config/$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    echo "📦 Backing up configurations to: $BACKUP_DIR"
    
    # Backup ConfigMaps
    kubectl get configmaps -n progressive-framework-prod -o yaml > "$BACKUP_DIR/configmaps.yaml"
    
    # Backup Secrets (names only, not values)
    kubectl get secrets -n progressive-framework-prod -o name > "$BACKUP_DIR/secrets-list.txt"
    
    # Backup Deployments
    kubectl get deployments -n progressive-framework-prod -o yaml > "$BACKUP_DIR/deployments.yaml"
    
    echo "✅ Configuration backup completed"
    echo "Backup location: $BACKUP_DIR"
}

# Function to validate configuration
validate_config() {
    CONFIG_FILE=$1
    
    if [ ! -f "$CONFIG_FILE" ]; then
        echo "❌ Configuration file not found: $CONFIG_FILE"
        return 1
    fi
    
    echo "🔍 Validating configuration file: $CONFIG_FILE"
    
    # Check YAML syntax
    if command -v yamllint >/dev/null 2>&1; then
        yamllint "$CONFIG_FILE" || return 1
    else
        python3 -c "import yaml; yaml.safe_load(open('$CONFIG_FILE'))" || return 1
    fi
    
    echo "✅ Configuration file is valid"
}

# Main script logic
case "${1:-help}" in
    "update")
        backup_config
        validate_config "$3"
        update_config "$2" "$3"
        ;;
    "backup")
        backup_config
        ;;
    "validate")
        validate_config "$2"
        ;;
    "help")
        echo "Configuration Management"
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  update <type> <file>  - Update configuration"
        echo "  backup                - Backup current configurations"
        echo "  validate <file>       - Validate configuration file"
        echo "  help                  - Show this help"
        echo ""
        echo "Types: app, database, nginx"
        ;;
    *)
        echo "Unknown command: $1"
        echo "Use '$0 help' for usage information."
        exit 1
        ;;
esac
```

---

## **DATABASE ADMINISTRATION**

### **PostgreSQL Administration**

**Database Maintenance Tasks**
```sql
-- Daily PostgreSQL Maintenance Tasks

-- 1. Check database size and growth
SELECT 
    datname,
    pg_size_pretty(pg_database_size(datname)) as size
FROM pg_database 
WHERE datistemplate = false
ORDER BY pg_database_size(datname) DESC;

-- 2. Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;

-- 3. Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as size
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC, pg_relation_size(indexname::regclass) DESC;

-- 4. Check for unused indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexname::regclass) DESC;

-- 5. Check slow queries
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time,
    rows
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;

-- 6. Check connection statistics
SELECT 
    datname,
    usename,
    application_name,
    client_addr,
    state,
    query_start,
    now() - query_start as duration
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;

-- 7. Check replication status (if applicable)
SELECT 
    client_addr,
    state,
    sent_lsn,
    write_lsn,
    flush_lsn,
    replay_lsn,
    write_lag,
    flush_lag,
    replay_lag
FROM pg_stat_replication;

-- 8. Vacuum and analyze statistics
SELECT 
    schemaname,
    tablename,
    n_tup_ins,
    n_tup_upd,
    n_tup_del,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_tup_upd + n_tup_del DESC;
```

**Database Backup and Restore**
```bash
#!/bin/bash
# PostgreSQL Backup and Restore Script

NAMESPACE="progressive-framework-prod"
POD_NAME="postgres-0"
DB_NAME="progressive_framework_v5"
DB_USER="progressive_user"
BACKUP_DIR="/var/backups/postgresql"
S3_BUCKET="progressive-backups"

# Function to create database backup
create_backup() {
    BACKUP_DATE=$(date +%Y%m%d-%H%M%S)
    BACKUP_FILE="progressive_framework_v5_$BACKUP_DATE.sql"
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"
    
    echo "🗄️ Creating PostgreSQL backup: $BACKUP_FILE"
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Create database dump
    kubectl exec -n "$NAMESPACE" "$POD_NAME" -- \
        pg_dump -U "$DB_USER" -d "$DB_NAME" \
        --verbose \
        --no-acl \
        --no-owner \
        --format=custom \
        --compress=9 \
    > "$BACKUP_PATH"
    
    if [ $? -eq 0 ]; then
        echo "✅ Database backup completed: $BACKUP_PATH"
        
        # Compress backup
        gzip "$BACKUP_PATH"
        BACKUP_PATH="$BACKUP_PATH.gz"
        
        # Upload to S3
        aws s3 cp "$BACKUP_PATH" "s3://$S3_BUCKET/database/$(date +%Y/%m/%d)/"
        
        if [ $? -eq 0 ]; then
            echo "✅ Backup uploaded to S3"
        else
            echo "❌ Failed to upload backup to S3"
        fi
        
        # Keep only last 7 days of local backups
        find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
        
        # Verify backup integrity
        gunzip -t "$BACKUP_PATH" && echo "✅ Backup integrity verified" || echo "❌ Backup integrity check failed"
        
    else
        echo "❌ Database backup failed"
        exit 1
    fi
}

# Function to restore from backup
restore_backup() {
    BACKUP_FILE=$1
    
    if [ -z "$BACKUP_FILE" ]; then
        echo "Usage: restore_backup <backup_file>"
        echo "Available backups:"
        ls -la "$BACKUP_DIR"/*.sql.gz | tail -10
        return 1
    fi
    
    if [ ! -f "$BACKUP_FILE" ]; then
        echo "❌ Backup file not found: $BACKUP_FILE"
        return 1
    fi
    
    echo "⚠️  WARNING: This will replace the current database!"
    read -p "Are you sure you want to restore from $BACKUP_FILE? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo "Operation cancelled."
        return 0
    fi
    
    echo "🔄 Restoring database from: $BACKUP_FILE"
    
    # Stop application to prevent writes during restore
    kubectl scale deployment progressive-framework-v5 --replicas=0 -n "$NAMESPACE"
    
    # Wait for pods to terminate
    sleep 30
    
    # Uncompress backup if needed
    if [[ "$BACKUP_FILE" == *.gz ]]; then
        TEMP_FILE=$(mktemp)
        gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
        BACKUP_FILE="$TEMP_FILE"
    fi
    
    # Copy backup to pod
    kubectl cp "$BACKUP_FILE" "$NAMESPACE/$POD_NAME:/tmp/restore.sql"
    
    # Drop and recreate database
    kubectl exec -n "$NAMESPACE" "$POD_NAME" -- \
        psql -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
    
    kubectl exec -n "$NAMESPACE" "$POD_NAME" -- \
        psql -U postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    
    # Restore database
    kubectl exec -n "$NAMESPACE" "$POD_NAME" -- \
        pg_restore -U "$DB_USER" -d "$DB_NAME" \
        --verbose \
        --clean \
        --if-exists \
        /tmp/restore.sql
    
    if [ $? -eq 0 ]; then
        echo "✅ Database restore completed"
        
        # Restart application
        kubectl scale deployment progressive-framework-v5 --replicas=3 -n "$NAMESPACE"
        
        # Clean up
        kubectl exec -n "$NAMESPACE" "$POD_NAME" -- rm -f /tmp/restore.sql
        [ -n "$TEMP_FILE" ] && rm -f "$TEMP_FILE"
        
        echo "✅ Application restarted"
    else
        echo "❌ Database restore failed"
        # Restart application anyway
        kubectl scale deployment progressive-framework-v5 --replicas=3 -n "$NAMESPACE"
        exit 1
    fi
}

# Function to check backup status
check_backups() {
    echo "📊 Backup Status Report"
    echo "====================="
    
    # Local backups
    echo "Local Backups:"
    ls -la "$BACKUP_DIR"/*.sql.gz 2>/dev/null | tail -10 || echo "No local backups found"
    echo ""
    
    # S3 backups
    echo "S3 Backups (last 10):"
    aws s3 ls "s3://$S3_BUCKET/database/" --recursive | tail -10
    echo ""
    
    # Backup schedule status
    echo "Backup Schedule Status:"
    kubectl get cronjobs -n "$NAMESPACE" | grep backup
}

# Function to optimize database
optimize_database() {
    echo "🚀 Optimizing PostgreSQL database"
    
    # Update statistics
    kubectl exec -n "$NAMESPACE" "$POD_NAME" -- \
        psql -U "$DB_USER" -d "$DB_NAME" -c "ANALYZE;"
    
    # Vacuum database
    kubectl exec -n "$NAMESPACE" "$POD_NAME" -- \
        psql -U "$DB_USER" -d "$DB_NAME" -c "VACUUM ANALYZE;"
    
    # Reindex if needed
    kubectl exec -n "$NAMESPACE" "$POD_NAME" -- \
        psql -U "$DB_USER" -d "$DB_NAME" -c "REINDEX DATABASE $DB_NAME;"
    
    echo "✅ Database optimization completed"
}

# Main script logic
case "${1:-help}" in
    "backup")
        create_backup
        ;;
    "restore")
        restore_backup "$2"
        ;;
    "status")
        check_backups
        ;;
    "optimize")
        optimize_database
        ;;
    "help")
        echo "PostgreSQL Administration"
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  backup              - Create database backup"
        echo "  restore <file>      - Restore from backup file"
        echo "  status              - Show backup status"
        echo "  optimize            - Optimize database performance"
        echo "  help                - Show this help"
        ;;
    *)
        echo "Unknown command: $1"
        echo "Use '$0 help' for usage information."
        exit 1
        ;;
esac
```

---

## **MONITORING & PERFORMANCE**

### **System Performance Monitoring**

**Performance Monitoring Dashboard**
```python
# scripts/performance_monitor.py
"""
System Performance Monitoring Script
"""

import subprocess
import json
import time
import requests
from datetime import datetime
import smtplib
from email.mime.text import MimeText

class PerformanceMonitor:
    def __init__(self):
        self.namespace = "progressive-framework-prod"
        self.thresholds = {
            'cpu_percent': 80.0,
            'memory_percent': 85.0,
            'response_time': 2.0,
            'error_rate': 5.0,
            'disk_percent': 90.0
        }
        self.alert_email = "ops-team@your-domain.com"
    
    def get_kubernetes_metrics(self):
        """Get Kubernetes resource metrics"""
        try:
            # Get pod metrics
            result = subprocess.run([
                'kubectl', 'top', 'pods', '-n', self.namespace, '--no-headers'
            ], capture_output=True, text=True)
            
            pods = []
            for line in result.stdout.strip().split('\n'):
                if line:
                    parts = line.split()
                    pods.append({
                        'name': parts[0],
                        'cpu': parts[1],
                        'memory': parts[2]
                    })
            
            # Get node metrics
            result = subprocess.run([
                'kubectl', 'top', 'nodes', '--no-headers'
            ], capture_output=True, text=True)
            
            nodes = []
            for line in result.stdout.strip().split('\n'):
                if line:
                    parts = line.split()
                    nodes.append({
                        'name': parts[0],
                        'cpu': parts[1],
                        'memory': parts[2]
                    })
            
            return {'pods': pods, 'nodes': nodes}
            
        except Exception as e:
            print(f"Error getting Kubernetes metrics: {e}")
            return None
    
    def check_application_health(self):
        """Check application response times and error rates"""
        endpoints = [
            {'name': 'Main App', 'url': 'https://your-domain.com/health'},
            {'name': 'API Health', 'url': 'https://your-domain.com/api/health'},
            {'name': 'MCA Health', 'url': 'https://agents.your-domain.com/api/v1/agents/mca/health'},
            {'name': 'NPA Health', 'url': 'https://agents.your-domain.com/api/v1/agents/npa/health'},
            {'name': 'WPA Health', 'url': 'https://agents.your-domain.com/api/v1/agents/wpa/health'}
        ]
        
        results = []
        for endpoint in endpoints:
            try:
                start_time = time.time()
                response = requests.get(endpoint['url'], timeout=10)
                response_time = time.time() - start_time
                
                results.append({
                    'name': endpoint['name'],
                    'url': endpoint['url'],
                    'status_code': response.status_code,
                    'response_time': response_time,
                    'healthy': response.status_code == 200 and response_time < self.thresholds['response_time']
                })
                
            except Exception as e:
                results.append({
                    'name': endpoint['name'],
                    'url': endpoint['url'],
                    'status_code': 0,
                    'response_time': float('inf'),
                    'error': str(e),
                    'healthy': False
                })
        
        return results
    
    def check_database_performance(self):
        """Check database performance metrics"""
        try:
            # PostgreSQL connection check
            result = subprocess.run([
                'kubectl', 'exec', '-n', self.namespace, 'statefulset/postgres', '--',
                'psql', '-U', 'progressive_user', '-d', 'progressive_framework_v5',
                '-c', 'SELECT count(*) FROM pg_stat_activity;'
            ], capture_output=True, text=True)
            
            postgres_healthy = result.returncode == 0
            
            # Redis check
            result = subprocess.run([
                'kubectl', 'exec', '-n', self.namespace, 'deployment/redis', '--',
                'redis-cli', 'ping'
            ], capture_output=True, text=True)
            
            redis_healthy = 'PONG' in result.stdout
            
            # MongoDB check
            result = subprocess.run([
                'kubectl', 'exec', '-n', self.namespace, 'statefulset/mongodb', '--',
                'mongosh', '--eval', 'db.runCommand("ping")'
            ], capture_output=True, text=True)
            
            mongodb_healthy = 'ok' in result.stdout
            
            return {
                'postgres': {'healthy': postgres_healthy},
                'redis': {'healthy': redis_healthy},
                'mongodb': {'healthy': mongodb_healthy}
            }
            
        except Exception as e:
            print(f"Error checking database performance: {e}")
            return None
    
    def generate_report(self):
        """Generate comprehensive performance report"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        print(f"=== PERFORMANCE MONITORING REPORT ===")
        print(f"Generated: {timestamp}")
        print("")
        
        # Kubernetes metrics
        k8s_metrics = self.get_kubernetes_metrics()
        if k8s_metrics:
            print("📊 KUBERNETES RESOURCES:")
            print("Nodes:")
            for node in k8s_metrics['nodes']:
                print(f"  {node['name']}: CPU {node['cpu']}, Memory {node['memory']}")
            
            print("\nPods (Top 10 by memory):")
            sorted_pods = sorted(k8s_metrics['pods'], 
                               key=lambda x: self._parse_memory(x['memory']), 
                               reverse=True)[:10]
            for pod in sorted_pods:
                print(f"  {pod['name']}: CPU {pod['cpu']}, Memory {pod['memory']}")
            print("")
        
        # Application health
        app_health = self.check_application_health()
        print("🏥 APPLICATION HEALTH:")
        for endpoint in app_health:
            status = "✅" if endpoint['healthy'] else "❌"
            print(f"  {status} {endpoint['name']}: {endpoint['response_time']:.3f}s")
            if not endpoint['healthy'] and 'error' in endpoint:
                print(f"    Error: {endpoint['error']}")
        print("")
        
        # Database health
        db_health = self.check_database_performance()
        if db_health:
            print("🗄️ DATABASE HEALTH:")
            for db, status in db_health.items():
                health_icon = "✅" if status['healthy'] else "❌"
                print(f"  {health_icon} {db.title()}: {'Healthy' if status['healthy'] else 'Unhealthy'}")
            print("")
        
        # Generate alerts if needed
        self._check_alerts(k8s_metrics, app_health, db_health)
        
        print("=== END REPORT ===")
    
    def _parse_memory(self, memory_str):
        """Parse memory string to MB for comparison"""
        if 'Mi' in memory_str:
            return float(memory_str.replace('Mi', ''))
        elif 'Gi' in memory_str:
            return float(memory_str.replace('Gi', '')) * 1024
        elif 'Ki' in memory_str:
            return float(memory_str.replace('Ki', '')) / 1024
        return 0
    
    def _check_alerts(self, k8s_metrics, app_health, db_health):
        """Check if any metrics exceed thresholds and send alerts"""
        alerts = []
        
        # Check application health
        unhealthy_apps = [app for app in app_health if not app['healthy']]
        if unhealthy_apps:
            alerts.append(f"🚨 Unhealthy applications: {', '.join([app['name'] for app in unhealthy_apps])}")
        
        # Check database health
        if db_health:
            unhealthy_dbs = [db for db, status in db_health.items() if not status['healthy']]
            if unhealthy_dbs:
                alerts.append(f"🚨 Unhealthy databases: {', '.join(unhealthy_dbs)}")
        
        # Check response times
        slow_endpoints = [app for app in app_health if app.get('response_time', 0) > self.thresholds['response_time']]
        if slow_endpoints:
            alerts.append(f"⚠️ Slow endpoints: {', '.join([app['name'] for app in slow_endpoints])}")
        
        # Send alerts if any found
        if alerts:
            self._send_alert_email(alerts)
    
    def _send_alert_email(self, alerts):
        """Send alert email to operations team"""
        try:
            subject = f"Progressive Framework Performance Alert - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            body = f"""
            Performance Alert - Progressive Framework v5
            
            The following performance issues have been detected:
            
            {chr(10).join(alerts)}
            
            Please investigate immediately.
            
            Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            """
            
            msg = MimeText(body)
            msg['Subject'] = subject
            msg['From'] = 'monitoring@your-domain.com'
            msg['To'] = self.alert_email
            
            # Send email (configure SMTP settings as needed)
            # smtp = smtplib.SMTP('localhost')
            # smtp.send_message(msg)
            # smtp.quit()
            
            print(f"📧 Alert email prepared: {subject}")
            
        except Exception as e:
            print(f"Error sending alert email: {e}")

if __name__ == "__main__":
    monitor = PerformanceMonitor()
    monitor.generate_report()
```

### **Automated Performance Tuning**
```bash
#!/bin/bash
# Automated Performance Tuning Script

NAMESPACE="progressive-framework-prod"

# Function to optimize application performance
optimize_application() {
    echo "🚀 Optimizing application performance..."
    
    # 1. Adjust HPA settings based on current load
    CURRENT_LOAD=$(kubectl top pods -n $NAMESPACE --no-headers | awk '{sum+=$2} END {print sum}')
    if [ "${CURRENT_LOAD%m}" -gt 1000 ]; then
        echo "High load detected, adjusting HPA..."
        kubectl patch hpa progressive-framework-hpa -n $NAMESPACE -p '{
            "spec": {
                "minReplicas": 3,
                "maxReplicas": 15,
                "metrics": [{
                    "type": "Resource",
                    "resource": {
                        "name": "cpu",
                        "target": {
                            "type": "Utilization",
                            "averageUtilization": 60
                        }
                    }
                }]
            }
        }'
    fi
    
    # 2. Optimize resource requests and limits
    kubectl patch deployment progressive-framework-v5 -n $NAMESPACE -p '{
        "spec": {
            "template": {
                "spec": {
                    "containers": [{
                        "name": "app",
                        "resources": {
                            "requests": {"memory": "256Mi", "cpu": "100m"},
                            "limits": {"memory": "1Gi", "cpu": "1000m"}
                        }
                    }]
                }
            }
        }
    }'
    
    # 3. Enable connection pooling
    kubectl set env deployment/progressive-framework-v5 -n $NAMESPACE \
        DATABASE_CONN_MAX_AGE=300 \
        DATABASE_CONN_POOL_SIZE=20
    
    echo "✅ Application optimization completed"
}

# Function to optimize database performance
optimize_database() {
    echo "🗄️ Optimizing database performance..."
    
    # PostgreSQL optimization
    kubectl exec -n $NAMESPACE statefulset/postgres -- psql -U progressive_user -d progressive_framework_v5 -c "
        -- Update PostgreSQL configuration for better performance
        ALTER SYSTEM SET shared_buffers = '256MB';
        ALTER SYSTEM SET effective_cache_size = '1GB';
        ALTER SYSTEM SET maintenance_work_mem = '64MB';
        ALTER SYSTEM SET checkpoint_completion_target = 0.9;
        ALTER SYSTEM SET wal_buffers = '16MB';
        ALTER SYSTEM SET default_statistics_target = 100;
        ALTER SYSTEM SET random_page_cost = 1.1;
        ALTER SYSTEM SET effective_io_concurrency = 200;
        
        -- Reload configuration
        SELECT pg_reload_conf();
        
        -- Update table statistics
        ANALYZE;
        
        -- Vacuum analyze for maintenance
        VACUUM ANALYZE;
    "
    
    # Redis optimization
    kubectl exec -n $NAMESPACE deployment/redis -- redis-cli CONFIG SET maxmemory-policy allkeys-lru
    kubectl exec -n $NAMESPACE deployment/redis -- redis-cli CONFIG SET save "900 1 300 10 60 10000"
    
    echo "✅ Database optimization completed"
}

# Function to optimize network performance
optimize_network() {
    echo "🌐 Optimizing network performance..."
    
    # Update service configurations for better performance
    kubectl patch service progressive-framework-v5-service -n $NAMESPACE -p '{
        "spec": {
            "sessionAffinity": "ClientIP",
            "sessionAffinityConfig": {
                "clientIP": {
                    "timeoutSeconds": 3600
                }
            }
        }
    }'
    
    # Optimize ingress settings
    kubectl patch ingress progressive-framework-ingress -n $NAMESPACE -p '{
        "metadata": {
            "annotations": {
                "nginx.ingress.kubernetes.io/proxy-buffer-size": "16k",
                "nginx.ingress.kubernetes.io/proxy-buffers-number": "8",
                "nginx.ingress.kubernetes.io/proxy-connect-timeout": "600",
                "nginx.ingress.kubernetes.io/proxy-send-timeout": "600",
                "nginx.ingress.kubernetes.io/proxy-read-timeout": "600"
            }
        }
    }'
    
    echo "✅ Network optimization completed"
}

# Function to clean up resources
cleanup_resources() {
    echo "🧹 Cleaning up resources..."
    
    # Clean up completed jobs
    kubectl delete job --field-selector=status.successful=1 -n $NAMESPACE
    
    # Clean up old ReplicaSets
    kubectl get rs -n $NAMESPACE --no-headers | awk '$2 == 0 {print $1}' | xargs -r kubectl delete rs -n $NAMESPACE
    
    # Clean up unused ConfigMaps and Secrets (be careful with this)
    # kubectl get configmap -n $NAMESPACE --no-headers | awk '!/kube-/ && !/default-token/ {print $1}' | head -5
    
    echo "✅ Resource cleanup completed"
}

# Function to check performance after optimization
check_performance() {
    echo "📊 Checking performance after optimization..."
    
    # Wait for changes to take effect
    sleep 30
    
    # Check application response time
    RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' https://your-domain.com/health)
    echo "Application response time: ${RESPONSE_TIME}s"
    
    # Check resource usage
    kubectl top pods -n $NAMESPACE | head -10
    
    # Check service status
    kubectl get pods -n $NAMESPACE | grep -v Running
    
    echo "✅ Performance check completed"
}

# Main optimization workflow
case "${1:-all}" in
    "app"|"application")
        optimize_application
        ;;
    "db"|"database")
        optimize_database
        ;;
    "network")
        optimize_network
        ;;
    "cleanup")
        cleanup_resources
        ;;
    "check")
        check_performance
        ;;
    "all")
        echo "🔧 Running full performance optimization..."
        optimize_application
        optimize_database
        optimize_network
        cleanup_resources
        check_performance
        echo "🎉 Full optimization completed!"
        ;;
    "help")
        echo "Performance Optimization Script"
        echo "Usage: $0 [component]"
        echo ""
        echo "Components:"
        echo "  app       - Optimize application settings"
        echo "  database  - Optimize database performance"
        echo "  network   - Optimize network settings"
        echo "  cleanup   - Clean up unused resources"
        echo "  check     - Check current performance"
        echo "  all       - Run all optimizations (default)"
        ;;
    *)
        echo "Unknown component: $1"
        echo "Use '$0 help' for usage information."
        exit 1
        ;;
esac
```

---

## **BACKUP & RECOVERY**

### **Automated Backup System**

**Complete Backup Solution**
```bash
#!/bin/bash
# Comprehensive Backup Script for Progressive Framework v5

BACKUP_BASE_DIR="/var/backups/progressive-framework"
S3_BUCKET="progressive-backups"
NAMESPACE="progressive-framework-prod"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="$BACKUP_BASE_DIR/$TIMESTAMP"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "🗄️ Progressive Framework v5 - Complete Backup"
echo "=============================================="
echo "Timestamp: $TIMESTAMP"
echo "Backup Directory: $BACKUP_DIR"
echo ""

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$BACKUP_DIR/backup.log"
}

# Function to backup databases
backup_databases() {
    log_message "📊 Starting database backups..."
    
    mkdir -p "$BACKUP_DIR/databases"
    
    # PostgreSQL backup
    log_message "Backing up PostgreSQL..."
    kubectl exec -n "$NAMESPACE" statefulset/postgres -- \
        pg_dump -U progressive_user -d progressive_framework_v5 \
        --verbose --no-acl --no-owner --format=custom --compress=9 \
        > "$BACKUP_DIR/databases/postgresql_$TIMESTAMP.dump"
    
    if [ $? -eq 0 ]; then
        log_message "✅ PostgreSQL backup completed"
    else
        log_message "❌ PostgreSQL backup failed"
        return 1
    fi
    
    # Redis backup
    log_message "Backing up Redis..."
    kubectl exec -n "$NAMESPACE" deployment/redis -- redis-cli --rdb /tmp/dump.rdb
    kubectl cp "$NAMESPACE/$(kubectl get pods -n $NAMESPACE -l app=redis -o jsonpath='{.items[0].metadata.name}'):/tmp/dump.rdb" \
        "$BACKUP_DIR/databases/redis_$TIMESTAMP.rdb"
    
    if [ $? -eq 0 ]; then
        log_message "✅ Redis backup completed"
    else
        log_message "❌ Redis backup failed"
    fi
    
    # MongoDB backup
    log_message "Backing up MongoDB..."
    kubectl exec -n "$NAMESPACE" statefulset/mongodb -- \
        mongodump --out /tmp/mongodb_backup
    kubectl cp "$NAMESPACE/$(kubectl get pods -n $NAMESPACE -l app=mongodb -o jsonpath='{.items[0].metadata.name}'):/tmp/mongodb_backup" \
        "$BACKUP_DIR/databases/mongodb_$TIMESTAMP"
    
    if [ $? -eq 0 ]; then
        log_message "✅ MongoDB backup completed"
    else
        log_message "❌ MongoDB backup failed"
    fi
}

# Function to backup Kubernetes configurations
backup_k8s_config() {
    log_message "⚙️ Backing up Kubernetes configurations..."
    
    mkdir -p "$BACKUP_DIR/kubernetes"
    
    # Backup deployments
    kubectl get deployments -n "$NAMESPACE" -o yaml > "$BACKUP_DIR/kubernetes/deployments.yaml"
    
    # Backup services
    kubectl get services -n "$NAMESPACE" -o yaml > "$BACKUP_DIR/kubernetes/services.yaml"
    
    # Backup configmaps
    kubectl get configmaps -n "$NAMESPACE" -o yaml > "$BACKUP_DIR/kubernetes/configmaps.yaml"
    
    # Backup secrets (metadata only, not values)
    kubectl get secrets -n "$NAMESPACE" -o yaml | \
        sed 's/data:.*$/data: [REDACTED]/' > "$BACKUP_DIR/kubernetes/secrets-metadata.yaml"
    
    # Backup persistent volume claims
    kubectl get pvc -n "$NAMESPACE" -o yaml > "$BACKUP_DIR/kubernetes/pvc.yaml"
    
    # Backup ingress
    kubectl get ingress -n "$NAMESPACE" -o yaml > "$BACKUP_DIR/kubernetes/ingress.yaml"
    
    # Backup horizontal pod autoscalers
    kubectl get hpa -n "$NAMESPACE" -o yaml > "$BACKUP_DIR/kubernetes/hpa.yaml"
    
    # Backup network policies
    kubectl get networkpolicy -n "$NAMESPACE" -o yaml > "$BACKUP_DIR/kubernetes/networkpolicy.yaml"
    
    log_message "✅ Kubernetes configurations backed up"
}

# Function to backup application data
backup_app_data() {
    log_message "📱 Backing up application data..."
    
    mkdir -p "$BACKUP_DIR/application"
    
    # Backup user uploads and media files
    if kubectl get pvc -n "$NAMESPACE" | grep -q "media-storage"; then
        log_message "Backing up media files..."
        MEDIA_POD=$(kubectl get pods -n "$NAMESPACE" -l app=progressive-framework-v5 -o jsonpath='{.items[0].metadata.name}')
        kubectl exec -n "$NAMESPACE" "$MEDIA_POD" -- tar czf /tmp/media_backup.tar.gz -C /app/media .
        kubectl cp "$NAMESPACE/$MEDIA_POD:/tmp/media_backup.tar.gz" "$BACKUP_DIR/application/media_$TIMESTAMP.tar.gz"
    fi
    
    # Backup application logs
    log_message "Backing up application logs..."
    kubectl logs -n "$NAMESPACE" -l app=progressive-framework-v5 --tail=10000 > "$BACKUP_DIR/application/app_logs_$TIMESTAMP.log"
    kubectl logs -n "$NAMESPACE" -l tier=agents --tail=5000 > "$BACKUP_DIR/application/agent_logs_$TIMESTAMP.log"
    
    log_message "✅ Application data backed up"
}

# Function to backup monitoring data
backup_monitoring() {
    log_message "📊 Backing up monitoring data..."
    
    mkdir -p "$BACKUP_DIR/monitoring"
    
    # Backup Prometheus configuration
    kubectl get configmaps -n monitoring -o yaml > "$BACKUP_DIR/monitoring/prometheus_config.yaml"
    
    # Backup Grafana dashboards
    kubectl get configmaps -n monitoring -l grafana_dashboard=1 -o yaml > "$BACKUP_DIR/monitoring/grafana_dashboards.yaml"
    
    # Backup AlertManager configuration
    kubectl get secret -n monitoring alertmanager-main -o yaml > "$BACKUP_DIR/monitoring/alertmanager_config.yaml"
    
    log_message "✅ Monitoring data backed up"
}

# Function to create backup manifest
create_backup_manifest() {
    log_message "📋 Creating backup manifest..."
    
    cat > "$BACKUP_DIR/backup_manifest.json" << EOF
{
    "backup_id": "$TIMESTAMP",
    "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "version": "5.0",
    "components": {
        "postgresql": {
            "backed_up": true,
            "file": "databases/postgresql_$TIMESTAMP.dump",
            "size": "$(du -h $BACKUP_DIR/databases/postgresql_$TIMESTAMP.dump | cut -f1)"
        },
        "redis": {
            "backed_up": true,
            "file": "databases/redis_$TIMESTAMP.rdb",
            "size": "$(du -h $BACKUP_DIR/databases/redis_$TIMESTAMP.rdb | cut -f1)"
        },
        "mongodb": {
            "backed_up": true,
            "file": "databases/mongodb_$TIMESTAMP",
            "size": "$(du -sh $BACKUP_DIR/databases/mongodb_$TIMESTAMP | cut -f1)"
        },
        "kubernetes": {
            "backed_up": true,
            "path": "kubernetes/",
            "size": "$(du -sh $BACKUP_DIR/kubernetes | cut -f1)"
        },
        "application": {
            "backed_up": true,
            "path": "application/",
            "size": "$(du -sh $BACKUP_DIR/application | cut -f1)"
        },
        "monitoring": {
            "backed_up": true,
            "path": "monitoring/",
            "size": "$(du -sh $BACKUP_DIR/monitoring | cut -f1)"
        }
    },
    "total_size": "$(du -sh $BACKUP_DIR | cut -f1)",
    "backup_method": "automated_script",
    "retention_days": $RETENTION_DAYS
}
EOF
    
    log_message "✅ Backup manifest created"
}

# Function to compress and upload backup
compress_and_upload() {
    log_message "📦 Compressing backup..."
    
    cd "$BACKUP_BASE_DIR"
    tar czf "progressive_framework_backup_$TIMESTAMP.tar.gz" "$TIMESTAMP"
    
    if [ $? -eq 0 ]; then
        log_message "✅ Backup compressed successfully"
        
        # Upload to S3
        log_message "☁️ Uploading to S3..."
        aws s3 cp "progressive_framework_backup_$TIMESTAMP.tar.gz" \
            "s3://$S3_BUCKET/full-backups/$(date +%Y/%m/%d)/"
        
        if [ $? -eq 0 ]; then
            log_message "✅ Backup uploaded to S3 successfully"
            
            # Clean up local compressed file
            rm -f "progressive_framework_backup_$TIMESTAMP.tar.gz"
        else
            log_message "❌ Failed to upload backup to S3"
        fi
    else
        log_message "❌ Failed to compress backup"
    fi
}

# Function to cleanup old backups
cleanup_old_backups() {
    log_message "🧹 Cleaning up old backups..."
    
    # Clean up local backups older than retention period
    find "$BACKUP_BASE_DIR" -maxdepth 1 -type d -name "20*" -mtime +$RETENTION_DAYS -exec rm -rf {} \;
    
    # Clean up old S3 backups (keep for longer period in S3)
    aws s3 ls "s3://$S3_BUCKET/full-backups/" --recursive | \
        while read -r line; do
            createDate=$(echo "$line" | awk '{print $1" "$2}')
            createDate=$(date -d "$createDate" +%s)
            olderThan=$(date -d "$RETENTION_DAYS days ago" +%s)
            
            if [[ $createDate -lt $olderThan ]]; then
                fileName=$(echo "$line" | awk '{print $4}')
                if [[ $fileName != "" ]]; then
                    aws s3 rm "s3://$S3_BUCKET/$fileName"
                fi
            fi
        done
    
    log_message "✅ Old backups cleaned up"
}

# Function to send backup notification
send_notification() {
    STATUS=$1
    
    if [ "$STATUS" == "success" ]; then
        MESSAGE="✅ Progressive Framework backup completed successfully"
        WEBHOOK_COLOR="good"
    else
        MESSAGE="❌ Progressive Framework backup failed"
        WEBHOOK_COLOR="danger"
    fi
    
    # Send Slack notification
    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-type: application/json' \
        -d "{
            \"text\": \"$MESSAGE\",
            \"attachments\": [{
                \"color\": \"$WEBHOOK_COLOR\",
                \"fields\": [{
                    \"title\": \"Backup ID\",
                    \"value\": \"$TIMESTAMP\",
                    \"short\": true
                }, {
                    \"title\": \"Size\",
                    \"value\": \"$(du -sh $BACKUP_DIR | cut -f1)\",
                    \"short\": true
                }]
            }]
        }" || log_message "⚠️ Failed to send Slack notification"
    
    # Send email notification
    if command -v mail >/dev/null 2>&1; then
        echo "$MESSAGE - Backup ID: $TIMESTAMP" | \
        mail -s "Progressive Framework Backup Report" admin@your-domain.com
    fi
}

# Main backup workflow
main() {
    log_message "🚀 Starting complete backup process..."
    
    # Run backup components
    if backup_databases && \
       backup_k8s_config && \
       backup_app_data && \
       backup_monitoring; then
        
        create_backup_manifest
        compress_and_upload
        cleanup_old_backups
        
        log_message "🎉 Backup process completed successfully"
        send_notification "success"
        
    else
        log_message "❌ Backup process failed"
        send_notification "failure"
        exit 1
    fi
}

# Parse command line arguments
case "${1:-full}" in
    "full")
        main
        ;;
    "db"|"database")
        backup_databases
        ;;
    "config")
        backup_k8s_config
        ;;
    "app")
        backup_app_data
        ;;
    "monitoring")
        backup_monitoring
        ;;
    "help")
        echo "Progressive Framework Backup Script"
        echo "Usage: $0 [component]"
        echo ""
        echo "Components:"
        echo "  full       - Complete backup (default)"
        echo "  database   - Database backup only"
        echo "  config     - Kubernetes config backup"
        echo "  app        - Application data backup"
        echo "  monitoring - Monitoring config backup"
        echo "  help       - Show this help"
        ;;
    *)
        echo "Unknown component: $1"
        echo "Use '$0 help' for usage information."
        exit 1
        ;;
esac
```

---

## **SECURITY ADMINISTRATION**

### **Security Monitoring & Management**

**Security Health Check Script**
```bash
#!/bin/bash
# Security Health Check for Progressive Framework v5

NAMESPACE="progressive-framework-prod"
SECURITY_LOG="/var/log/security/security_check_$(date +%Y%m%d).log"

mkdir -p "$(dirname "$SECURITY_LOG")"

log_security() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$SECURITY_LOG"
}

echo "🔒 Progressive Framework v5 - Security Health Check"
echo "================================================="

# 1. Certificate Status
log_security "🔐 Checking SSL/TLS certificates..."
kubectl get certificates -n "$NAMESPACE" -o custom-columns=NAME:.metadata.name,READY:.status.conditions[0].status,AGE:.metadata.creationTimestamp

# Check certificate expiration
kubectl get secrets -n "$NAMESPACE" -o json | jq -r '.items[] | select(.type=="kubernetes.io/tls") | "\(.metadata.name): \(.data."tls.crt")"' | while read cert; do
    NAME=$(echo "$cert" | cut -d: -f1)
    CERT_DATA=$(echo "$cert" | cut -d: -f2)
    EXPIRY=$(echo "$CERT_DATA" | base64 -d | openssl x509 -noout -enddate | cut -d= -f2)
    DAYS_UNTIL_EXPIRY=$(( ($(date -d "$EXPIRY" +%s) - $(date +%s)) / 86400 ))
    
    if [ "$DAYS_UNTIL_EXPIRY" -lt 30 ]; then
        log_security "⚠️ Certificate $NAME expires in $DAYS_UNTIL_EXPIRY days"
    else
        log_security "✅ Certificate $NAME expires in $DAYS_UNTIL_EXPIRY days"
    fi
done

# 2. Security Policies
log_security "🛡️ Checking security policies..."
kubectl get networkpolicies -n "$NAMESPACE"
kubectl get podsecuritypolicy 2>/dev/null || log_security "ℹ️ PodSecurityPolicy not configured"

# 3. RBAC Configuration
log_security "👥 Checking RBAC configuration..."
kubectl get rolebindings,clusterrolebindings -o wide | grep "$NAMESPACE"

# 4. Secret Management
log_security "🔑 Checking secret management..."
SECRETS=$(kubectl get secrets -n "$NAMESPACE" --no-headers | wc -l)
log_security "Total secrets in namespace: $SECRETS"

# Check for secrets with default names (potential security issue)
kubectl get secrets -n "$NAMESPACE" -o name | grep -E "(default|secret)" | while read secret; do
    log_security "⚠️ Found potentially insecure secret name: $secret"
done

# 5. Image Security
log_security "📦 Checking container image security..."
kubectl get pods -n "$NAMESPACE" -o jsonpath='{range .items[*]}{.spec.containers[*].image}{"\n"}{end}' | sort -u | while read image; do
    if [[ "$image" == *":latest" ]]; then
        log_security "⚠️ Container using 'latest' tag: $image"
    elif [[ "$image" != *":"* ]]; then
        log_security "⚠️ Container missing explicit tag: $image"
    else
        log_security "✅ Container with explicit tag: $image"
    fi
done

# 6. Resource Limits
log_security "📊 Checking resource limits and requests..."
kubectl get pods -n "$NAMESPACE" -o json | jq -r '
.items[] | 
select(.spec.containers[0].resources.limits == null or .spec.containers[0].resources.requests == null) |
.metadata.name
' | while read pod; do
    log_security "⚠️ Pod without proper resource limits: $pod"
done

# 7. Service Account Security
log_security "👤 Checking service account security..."
kubectl get pods -n "$NAMESPACE" -o json | jq -r '
.items[] |
select(.spec.automountServiceAccountToken == true or .spec.automountServiceAccountToken == null) |
.metadata.name
' | while read pod; do
    log_security "⚠️ Pod with service account token mounted: $pod"
done

# 8. Privileged Containers
log_security "🔓 Checking for privileged containers..."
kubectl get pods -n "$NAMESPACE" -o json | jq -r '
.items[] |
select(.spec.containers[].securityContext.privileged == true) |
.metadata.name
' | while read pod; do
    log_security "🚨 CRITICAL: Privileged container found: $pod"
done

# 9. Host Network/PID
log_security "🌐 Checking host network/PID usage..."
kubectl get pods -n "$NAMESPACE" -o json | jq -r '
.items[] |
select(.spec.hostNetwork == true or .spec.hostPID == true) |
.metadata.name + " (hostNetwork: " + (.spec.hostNetwork | tostring) + ", hostPID: " + (.spec.hostPID | tostring) + ")"
' | while read pod_info; do
    log_security "⚠️ Pod using host namespace: $pod_info"
done

# 10. Security Context
log_security "🔒 Checking security contexts..."
kubectl get pods -n "$NAMESPACE" -o json | jq -r '
.items[] |
select(.spec.containers[].securityContext.runAsUser == null or .spec.containers[].securityContext.runAsUser == 0) |
.metadata.name
' | while read pod; do
    log_security "⚠️ Pod potentially running as root: $pod"
done

# 11. Ingress Security
log_security "🌍 Checking ingress security..."
kubectl get ingress -n "$NAMESPACE" -o json | jq -r '
.items[] |
select(.metadata.annotations."nginx.ingress.kubernetes.io/ssl-redirect" != "true") |
.metadata.name
' | while read ingress; do
    log_security "⚠️ Ingress without SSL redirect: $ingress"
done

# 12. Database Security
log_security "🗄️ Checking database security..."

# PostgreSQL security check
kubectl exec -n "$NAMESPACE" statefulset/postgres -- psql -U postgres -c "
SELECT usename, usesuper, usecreatedb, usebypassrls 
FROM pg_user 
WHERE usesuper = true OR usecreatedb = true OR usebypassrls = true;
" 2>/dev/null | while read user_info; do
    log_security "Database privileged user: $user_info"
done

# 13. Audit Log Analysis
log_security "📝 Analyzing recent security events..."
kubectl get events -n "$NAMESPACE" --field-selector type=Warning | tail -10 | while read event; do
    log_security "Recent warning event: $event"
done

# 14. Generate Security Score
log_security "📊 Calculating security score..."
TOTAL_CHECKS=50
PASSED_CHECKS=$(grep -c "✅" "$SECURITY_LOG" || echo 0)
WARNING_CHECKS=$(grep -c "⚠️" "$SECURITY_LOG" || echo 0)
CRITICAL_CHECKS=$(grep -c "🚨" "$SECURITY_LOG" || echo 0)

SECURITY_SCORE=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))

log_security "=== SECURITY SUMMARY ==="
log_security "Security Score: $SECURITY_SCORE/100"
log_security "Passed Checks: $PASSED_CHECKS"
log_security "Warning Issues: $WARNING_CHECKS"
log_security "Critical Issues: $CRITICAL_CHECKS"

if [ "$CRITICAL_CHECKS" -gt 0 ]; then
    log_security "🚨 IMMEDIATE ACTION REQUIRED - Critical security issues found"
elif [ "$WARNING_CHECKS" -gt 5 ]; then
    log_security "⚠️ Multiple security warnings - review recommended"
else
    log_security "✅ Security status: Good"
fi

log_security "Security check completed. Full report: $SECURITY_LOG"

# Send alert if critical issues found
if [ "$CRITICAL_CHECKS" -gt 0 ]; then
    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-type: application/json' \
        -d "{
            \"text\": \"🚨 CRITICAL: Security issues found in Progressive Framework\",
            \"attachments\": [{
                \"color\": \"danger\",
                \"fields\": [{
                    \"title\": \"Critical Issues\",
                    \"value\": \"$CRITICAL_CHECKS\",
                    \"short\": true
                }, {
                    \"title\": \"Security Score\",
                    \"value\": \"$SECURITY_SCORE/100\",
                    \"short\": true
                }]
            }]
        }" 2>/dev/null || echo "Failed to send alert"
fi

echo "Security health check completed."
```

---

## **SCHEDULED MAINTENANCE**

### **Maintenance Window Procedures**

**Planned Maintenance Script**
```bash
#!/bin/bash
# Planned Maintenance Script for Progressive Framework v5

NAMESPACE="progressive-framework-prod"
MAINTENANCE_LOG="/var/log/maintenance/maintenance_$(date +%Y%m%d-%H%M%S).log"

mkdir -p "$(dirname "$MAINTENANCE_LOG")"

# Function to log maintenance activities
log_maintenance() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$MAINTENANCE_LOG"
}

# Function to send maintenance notification
send_maintenance_notification() {
    MESSAGE=$1
    STATUS=${2:-"info"}
    
    case $STATUS in
        "start")
            COLOR="warning"
            EMOJI="🔧"
            ;;
        "complete")
            COLOR="good"
            EMOJI="✅"
            ;;
        "error")
            COLOR="danger"
            EMOJI="❌"
            ;;
        *)
            COLOR="#36a64f"
            EMOJI="ℹ️"
            ;;
    esac
    
    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-type: application/json' \
        -d "{
            \"text\": \"$EMOJI $MESSAGE\",
            \"attachments\": [{
                \"color\": \"$COLOR\",
                \"fields\": [{
                    \"title\": \"System\",
                    \"value\": \"Progressive Framework v5\",
                    \"short\": true
                }, {
                    \"title\": \"Time\",
                    \"value\": \"$(date '+%Y-%m-%d %H:%M:%S UTC')\",
                    \"short\": true
                }]
            }]
        }" 2>/dev/null || log_maintenance "Failed to send notification"
}

# Pre-maintenance checks
pre_maintenance_checks() {
    log_maintenance "🔍 Running pre-maintenance checks..."
    
    # Check system health
    UNHEALTHY_PODS=$(kubectl get pods -n "$NAMESPACE" | grep -v Running | grep -v Completed | wc -l)
    if [ "$UNHEALTHY_PODS" -gt 0 ]; then
        log_maintenance "⚠️ Warning: $UNHEALTHY_PODS pods are not in running state"
        kubectl get pods -n "$NAMESPACE" | grep -v Running | grep -v Completed
    fi
    
    # Check resource usage
    HIGH_CPU_NODES=$(kubectl top nodes | awk 'NR>1 {print $3}' | sed 's/%//' | awk '$1>80' | wc -l)
    if [ "$HIGH_CPU_NODES" -gt 0 ]; then
        log_maintenance "⚠️ Warning: $HIGH_CPU_NODES nodes have high CPU usage"
    fi
    
    # Check database connections
    DB_CONNECTIONS=$(kubectl exec -n "$NAMESPACE" statefulset/postgres -- \
        psql -U progressive_user -d progressive_framework_v5 -t -c \
        "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null || echo "0")
    log_maintenance "Current database connections: $DB_CONNECTIONS"
    
    # Check recent backups
    LATEST_BACKUP=$(aws s3 ls "s3://progressive-backups/full-backups/" --recursive | sort | tail -1 | awk '{print $1, $2}')
    log_maintenance "Latest backup: $LATEST_BACKUP"
    
    # Check certificate expiry
    CERT_EXPIRY_DAYS=$(kubectl get certificates -n "$NAMESPACE" -o json | \
        jq -r '.items[0].status.notAfter' | \
        xargs -I {} date -d {} +%s | \
        awk -v now="$(date +%s)" '{print int(($1 - now) / 86400)}')
    log_maintenance "Certificate expires in: $CERT_EXPIRY_DAYS days"
    
    if [ "$CERT_EXPIRY_DAYS" -lt 7 ]; then
        log_maintenance "⚠️ Warning: Certificate expires soon!"
    fi
}

# Enable maintenance mode
enable_maintenance_mode() {
    log_maintenance "🔧 Enabling maintenance mode..."
    
    # Scale down non-essential services
    kubectl scale deployment progressive-framework-v5 --replicas=1 -n "$NAMESPACE"
    kubectl scale deployment mca --replicas=1 -n "$NAMESPACE"
    kubectl scale deployment npa --replicas=1 -n "$NAMESPACE"
    kubectl scale deployment wpa --replicas=1 -n "$NAMESPACE"
    
    # Update ingress to show maintenance page
    kubectl patch ingress progressive-framework-ingress -n "$NAMESPACE" -p '{
        "metadata": {
            "annotations": {
                "nginx.ingress.kubernetes.io/configuration-snippet": "return 503;"
            }
        }
    }'
    
    # Wait for changes to take effect
    sleep 30
    
    log_maintenance "✅ Maintenance mode enabled"
}

# Disable maintenance mode
disable_maintenance_mode() {
    log_maintenance "🚀 Disabling maintenance mode..."
    
    # Remove maintenance mode from ingress
    kubectl patch ingress progressive-framework-ingress -n "$NAMESPACE" --type=json -p='[
        {
            "op": "remove",
            "path": "/metadata/annotations/nginx.ingress.kubernetes.io~1configuration-snippet"
        }
    ]'
    
    # Scale services back up
    kubectl scale deployment progressive-framework-v5 --replicas=3 -n "$NAMESPACE"
    kubectl scale deployment mca --replicas=2 -n "$NAMESPACE"
    kubectl scale deployment npa --replicas=2 -n "$NAMESPACE"
    kubectl scale deployment wpa --replicas=2 -n "$NAMESPACE"
    
    # Wait for services to be ready
    kubectl rollout status deployment/progressive-framework-v5 -n "$NAMESPACE" --timeout=300s
    kubectl rollout status deployment/mca -n "$NAMESPACE" --timeout=300s
    kubectl rollout status deployment/npa -n "$NAMESPACE" --timeout=300s
    kubectl rollout status deployment/wpa -n "$NAMESPACE" --timeout=300s
    
    log_maintenance "✅ Maintenance mode disabled"
}

# Database maintenance
database_maintenance() {
    log_maintenance "🗄️ Performing database maintenance..."
    
    # PostgreSQL maintenance
    kubectl exec -n "$NAMESPACE" statefulset/postgres -- \
        psql -U progressive_user -d progressive_framework_v5 -c "
        -- Update table statistics
        ANALYZE;
        
        -- Vacuum database
        VACUUM ANALYZE;
        
        -- Check for index bloat
        SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
        FROM pg_stat_user_indexes
        WHERE idx_scan = 0
        ORDER BY pg_relation_size(indexname::regclass) DESC;
        "
    
    # Redis maintenance
    kubectl exec -n "$NAMESPACE" deployment/redis -- redis-cli BGREWRITEAOF
    
    # MongoDB maintenance
    kubectl exec -n "$NAMESPACE" statefulset/mongodb -- \
        mongosh --eval "db.runCommand({compact: 'users'})"
    
    log_maintenance "✅ Database maintenance completed"
}

# System updates
system_updates() {
    log_maintenance "📦 Performing system updates..."
    
    # Update container images (rolling update)
    kubectl set image deployment/progressive-framework-v5 \
        app=progressive-framework/app:5.0-$(date +%Y%m%d) -n "$NAMESPACE"
    
    kubectl rollout status deployment/progressive-framework-v5 -n "$NAMESPACE" --timeout=300s
    
    # Update agent images
    kubectl set image deployment/mca mca=progressive-framework/mca:5.0-$(date +%Y%m%d) -n "$NAMESPACE"
    kubectl set image deployment/npa npa=progressive-framework/npa:5.0-$(date +%Y%m%d) -n "$NAMESPACE"  
    kubectl set image deployment/wpa wpa=progressive-framework/wpa:5.0-$(date +%Y%m%d) -n "$NAMESPACE"
    
    # Wait for rollouts
    kubectl rollout status deployment/mca -n "$NAMESPACE" --timeout=300s
    kubectl rollout status deployment/npa -n "$NAMESPACE" --timeout=300s
    kubectl rollout status deployment/wpa -n "$NAMESPACE" --timeout=300s
    
    log_maintenance "✅ System updates completed"
}

# Security updates
security_updates() {
    log_maintenance "🔒 Applying security updates..."
    
    # Rotate secrets
    NEW_SECRET=$(openssl rand -base64 32)
    kubectl create secret generic app-secret-new \
        --from-literal=secret-key="$NEW_SECRET" -n "$NAMESPACE"
    
    # Update deployments to use new secret
    kubectl patch deployment progressive-framework-v5 -n "$NAMESPACE" -p '{
        "spec": {
            "template": {
                "spec": {
                    "containers": [{
                        "name": "app",
                        "env": [{
                            "name": "SECRET_KEY",
                            "valueFrom": {
                                "secretKeyRef": {
                                    "name": "app-secret-new",
                                    "key": "secret-key"
                                }
                            }
                        }]
                    }]
                }
            }
        }
    }'
    
    # Wait for rollout
    kubectl rollout status deployment/progressive-framework-v5 -n "$NAMESPACE"
    
    # Clean up old secret
    kubectl delete secret app-secret -n "$NAMESPACE" 2>/dev/null || true
    kubectl patch secret app-secret-new --type='merge' -p='{"metadata":{"name":"app-secret"}}' -n "$NAMESPACE"
    
    log_maintenance "✅ Security updates completed"
}

# Post-maintenance verification
post_maintenance_verification() {
    log_maintenance "✅ Running post-maintenance verification..."
    
    # Check all pods are running
    NOT_RUNNING=$(kubectl get pods -n "$NAMESPACE" | grep -v Running | grep -v Completed | wc -l)
    if [ "$NOT_RUNNING" -eq 0 ]; then
        log_maintenance "✅ All pods are running"
    else
        log_maintenance "❌ $NOT_RUNNING pods are not running"
        kubectl get pods -n "$NAMESPACE" | grep -v Running | grep -v Completed
    fi
    
    # Check application health
    sleep 30  # Wait for services to stabilize
    
    HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" https://your-domain.com/health)
    if [ "$HEALTH_CHECK" == "200" ]; then
        log_maintenance "✅ Application health check passed"
    else
        log_maintenance "❌ Application health check failed (HTTP $HEALTH_CHECK)"
    fi
    
    # Check agent health
    for agent in mca npa wpa; do
        AGENT_HEALTH=$(kubectl exec -n "$NAMESPACE" deployment/$agent -- \
            curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health)
        if [ "$AGENT_HEALTH" == "200" ]; then
            log_maintenance "✅ Agent $agent health check passed"
        else
            log_maintenance "❌ Agent $agent health check failed"
        fi
    done
    
    # Check database connectivity
    DB_CHECK=$(kubectl exec -n "$NAMESPACE" statefulset/postgres -- \
        pg_isready -U progressive_user 2>/dev/null && echo "OK" || echo "FAIL")
    log_maintenance "Database connectivity: $DB_CHECK"
    
    # Performance check
    RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' https://your-domain.com/health)
    log_maintenance "Application response time: ${RESPONSE_TIME}s"
    
    if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
        log_maintenance "✅ Response time within acceptable range"
    else
        log_maintenance "⚠️ Response time higher than expected"
    fi
}

# Main maintenance workflow
main_maintenance() {
    MAINTENANCE_TYPE=${1:-"full"}
    
    log_maintenance "🔧 Starting maintenance: $MAINTENANCE_TYPE"
    send_maintenance_notification "Maintenance started: $MAINTENANCE_TYPE" "start"
    
    # Pre-maintenance checks
    pre_maintenance_checks
    
    case $MAINTENANCE_TYPE in
        "database")
            enable_maintenance_mode
            database_maintenance
            disable_maintenance_mode
            ;;
        "security")
            security_updates
            ;;
        "update")
            enable_maintenance_mode
            system_updates
            disable_maintenance_mode
            ;;
        "full")
            enable_maintenance_mode
            database_maintenance
            system_updates
            security_updates
            disable_maintenance_mode
            ;;
        *)
            log_maintenance "❌ Unknown maintenance type: $MAINTENANCE_TYPE"
            exit 1
            ;;
    esac
    
    # Post-maintenance verification
    post_maintenance_verification
    
    log_maintenance "🎉 Maintenance completed: $MAINTENANCE_TYPE"
    send_maintenance_notification "Maintenance completed successfully: $MAINTENANCE_TYPE" "complete"
}

# Parse command line arguments
case "${1:-help}" in
    "full"|"database"|"security"|"update")
        main_maintenance "$1"
        ;;
    "pre-check")
        pre_maintenance_checks
        ;;
    "post-check")
        post_maintenance_verification
        ;;
    "help")
        echo "Progressive Framework Maintenance Script"
        echo "Usage: $0 [maintenance_type]"
        echo ""
        echo "Maintenance Types:"
        echo "  full       - Complete maintenance (database, updates, security)"
        echo "  database   - Database maintenance only"
        echo "  security   - Security updates only"
        echo "  update     - System updates only"
        echo "  pre-check  - Pre-maintenance checks only"
        echo "  post-check - Post-maintenance verification only"
        echo "  help       - Show this help"
        ;;
    *)
        echo "Unknown maintenance type: $1"
        echo "Use '$0 help' for usage information."
        exit 1
        ;;
esac
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Common Issues & Resolution](../09-Troubleshooting/Common-Issues-Resolution.md)** - Troubleshooting procedures
- **[Monitoring & Alerting](../05-DevOps/Monitoring-Alerting.md)** - Monitoring system setup

### **Follow-up Documents**
- **[User Management](User-Management.md)** - User administration procedures
- **[Documentation Management](Documentation-Management.md)** - Documentation maintenance

### **Operations Context**
- **[Container Orchestration](../05-DevOps/Container-Orchestration.md)** - Kubernetes administration
- **[Database Management](../03-Data-Layer/Database-Management.md)** - Database administration
- **[Security Overview](../04-Security/Security-Overview.md)** - Security policies and procedures

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | System Administrator | Complete system administration guide with automation |
| 4.x | 2025-08-xx | DevOps Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: System Administrator  
**Last Validated**: 2025-09-02