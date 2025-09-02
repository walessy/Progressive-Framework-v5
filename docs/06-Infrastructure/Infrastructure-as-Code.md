---
file: docs/06-Infrastructure/Infrastructure-as-Code.md
directory: docs/06-Infrastructure/
priority: CRITICAL
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# Infrastructure as Code - Progressive-Framework-v5

**File Path**: `docs/06-Infrastructure/Infrastructure-as-Code.md`  
**Directory**: `docs/06-Infrastructure/`  
**Priority**: CRITICAL  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive Infrastructure as Code (IaC) implementation for Progressive-Framework-v5, covering Terraform automation, GitOps workflows, infrastructure provisioning, configuration management, and automated deployment pipelines for both enterprise core systems and context agents (MCA, NPA, WPA).

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🛡️ **[Network Architecture & Security](Network-Architecture-Security.md)** - *Network and security setup*
- 🔄 **[Disaster Recovery & Backup](Disaster-Recovery-Backup.md)** - *Backup and recovery procedures*
- 🐳 **[Container Orchestration](../05-DevOps/Container-Orchestration.md)** - *Kubernetes deployment*
- 🔧 **[CI/CD Pipeline](../05-DevOps/CI-CD-Pipeline.md)** - *Continuous integration and deployment*

---

## **INFRASTRUCTURE AS CODE ARCHITECTURE**

### **IaC Strategy Overview**
```
Progressive-Framework-v5 Infrastructure as Code Architecture:

                    ┌─────────────────────────────────────┐
                    │           VERSION CONTROL          │
                    │              (GitHub)               │
                    │                                     │
                    │  ┌─────────┐  ┌─────────────────┐   │
                    │  │Terraform│  │   Kubernetes    │   │
                    │  │ Modules │  │   Manifests     │   │
                    │  └─────────┘  └─────────────────┘   │
                    └─────────────────────────────────────┘
                                    │
                         ┌─────────────────────┐
                         │    GitOps Engine    │
                         │     (ArgoCD)        │
                         └─────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
    ┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
    │DEVELOPMENT  │       │    STAGING      │       │ PRODUCTION  │
    │ENVIRONMENT  │       │  ENVIRONMENT    │       │ENVIRONMENT  │
    │             │       │                 │       │             │
    │┌───────────┐│       │┌───────────────┐│       │┌───────────┐│
    ││Terraform  ││       ││   Terraform   ││       ││Terraform  ││
    ││Apply      ││       ││   Apply       ││       ││Apply      ││
    │└───────────┘│       │└───────────────┘│       │└───────────┘│
    │┌───────────┐│       │┌───────────────┐│       │┌───────────┐│
    ││K8s Deploy ││  ───► ││ K8s Deploy    ││  ───► ││K8s Deploy ││
    │└───────────┘│       │└───────────────┘│       │└───────────┘│
    │┌───────────┐│       │┌───────────────┐│       │┌───────────┐│
    ││Agent      ││       ││ Agent Config  ││       ││Agent      ││
    ││Config     ││       │└───────────────┘│       ││Config     ││
    │└───────────┘│       │                 │       │└───────────┘│
    └─────────────┘       └─────────────────┘       └─────────────┘
          │                         │                         │
    ┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
    │   AWS       │       │     AWS         │       │    AWS      │
    │  us-west-2  │       │   us-east-1     │       │  us-east-1  │
    │             │       │                 │       │             │
    │ • VPC       │       │ • VPC           │       │ • VPC       │
    │ • EKS       │       │ • EKS           │       │ • EKS       │
    │ • RDS       │       │ • RDS           │       │ • RDS       │
    │ • Agents    │       │ • Agents        │       │ • Agents    │
    └─────────────┘       └─────────────────┘       └─────────────┘

Code Flow:
1. Developers commit IaC changes to Git
2. GitOps engine detects changes
3. Automated validation and testing
4. Environment-specific deployment
5. Health checks and verification
6. Promotion to next environment
```

### **Technology Stack**
```yaml
IaC_Technology_Stack:
  Infrastructure_Provisioning:
    primary: "Terraform"
    version: "1.5.x"
    providers:
      - "AWS Provider 5.x"
      - "Kubernetes Provider 2.x"
      - "Helm Provider 2.x"
      - "Random Provider 3.x"
    
  Configuration_Management:
    kubernetes: "Kubernetes Manifests (YAML)"
    helm: "Helm Charts 3.x"
    kustomize: "Kustomize 5.x"
    
  GitOps_Platform:
    engine: "ArgoCD 2.8.x"
    alternative: "Flux 2.x"
    sync_strategy: "Automated with manual approval for production"
    
  State_Management:
    terraform_backend: "AWS S3 + DynamoDB"
    state_encryption: "AES-256"
    state_locking: "DynamoDB"
    
  CI_CD_Integration:
    primary: "GitHub Actions"
    terraform_cloud: "Optional for enterprise"
    
  Security_Scanning:
    iac_scanning: "Checkov, tfsec"
    container_scanning: "Trivy"
    secrets_detection: "GitLeaks"
    
  Monitoring:
    terraform_changes: "Terraform Cloud/Atlantis"
    drift_detection: "Driftctl"
    cost_monitoring: "Infracost"

Deployment_Strategy:
  Environment_Promotion:
    flow: "dev → staging → production"
    approval_gates: 
      - "Automated testing (dev/staging)"
      - "Manual approval (production)"
    rollback_strategy: "Git revert + automatic rollback"
    
  Agent_Deployment:
    strategy: "Blue-Green for agents"
    coordination: "MCA coordinates deployment"
    validation: "Automated agent health checks"
```

---

## **TERRAFORM INFRASTRUCTURE**

### **Project Structure**
```
terraform/
├── modules/                        # Reusable Terraform modules
│   ├── vpc/                       # VPC module
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── versions.tf
│   ├── eks/                       # EKS cluster module
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── data.tf
│   ├── rds/                       # RDS database module
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── security.tf
│   ├── agents/                    # Agent-specific infrastructure
│   │   ├── mca/
│   │   ├── npa/
│   │   ├── wpa/
│   │   └── shared/
│   └── monitoring/                # Monitoring infrastructure
│       ├── main.tf
│       ├── prometheus.tf
│       └── grafana.tf
├── environments/                   # Environment-specific configurations
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   ├── staging/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   └── production/
│       ├── main.tf
│       ├── variables.tf
│       ├── terraform.tfvars.example
│       └── backend.tf
├── global/                        # Global resources (DNS, IAM, etc.)
│   ├── dns/
│   ├── iam/
│   └── certificates/
└── scripts/                       # Helper scripts
    ├── plan.sh
    ├── apply.sh
    └── destroy.sh
```

### **Core Terraform Modules**

#### **VPC Module**
```hcl
# terraform/modules/vpc/main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-vpc"
    Type = "VPC"
  })
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-igw"
  })
}

# Public Subnets
resource "aws_subnet" "public" {
  count = length(var.public_subnet_cidrs)

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  map_public_ip_on_launch = true

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-public-${count.index + 1}"
    Type = "Public"
    "kubernetes.io/role/elb" = "1"
  })
}

# Private Subnets
resource "aws_subnet" "private" {
  count = length(var.private_subnet_cidrs)

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-private-${count.index + 1}"
    Type = "Private"
    "kubernetes.io/role/internal-elb" = "1"
  })
}

# Database Subnets
resource "aws_subnet" "database" {
  count = length(var.database_subnet_cidrs)

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.database_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-database-${count.index + 1}"
    Type = "Database"
  })
}

# NAT Gateways
resource "aws_eip" "nat" {
  count = var.create_nat_gateways ? length(var.public_subnet_cidrs) : 0

  domain = "vpc"
  depends_on = [aws_internet_gateway.main]

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-nat-eip-${count.index + 1}"
  })
}

resource "aws_nat_gateway" "main" {
  count = var.create_nat_gateways ? length(var.public_subnet_cidrs) : 0

  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-nat-${count.index + 1}"
  })

  depends_on = [aws_internet_gateway.main]
}

# Route Tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-public-rt"
  })
}

resource "aws_route_table" "private" {
  count = var.create_nat_gateways ? length(var.private_subnet_cidrs) : 1

  vpc_id = aws_vpc.main.id

  dynamic "route" {
    for_each = var.create_nat_gateways ? [1] : []
    content {
      cidr_block     = "0.0.0.0/0"
      nat_gateway_id = aws_nat_gateway.main[count.index % length(aws_nat_gateway.main)].id
    }
  }

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-private-rt-${count.index + 1}"
  })
}

resource "aws_route_table" "database" {
  vpc_id = aws_vpc.main.id

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-database-rt"
  })
}

# Route Table Associations
resource "aws_route_table_association" "public" {
  count = length(var.public_subnet_cidrs)

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  count = length(var.private_subnet_cidrs)

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[var.create_nat_gateways ? count.index : 0].id
}

resource "aws_route_table_association" "database" {
  count = length(var.database_subnet_cidrs)

  subnet_id      = aws_subnet.database[count.index].id
  route_table_id = aws_route_table.database.id
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}
```

#### **EKS Module**
```hcl
# terraform/modules/eks/main.tf
resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  role_arn = aws_iam_role.cluster.arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = var.subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = var.enable_public_access
    public_access_cidrs     = var.public_access_cidrs

    security_group_ids = [aws_security_group.cluster.id]
  }

  encryption_config {
    provider {
      key_arn = aws_kms_key.eks.arn
    }
    resources = ["secrets"]
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  depends_on = [
    aws_iam_role_policy_attachment.cluster_AmazonEKSClusterPolicy,
    aws_cloudwatch_log_group.eks_cluster,
  ]

  tags = var.common_tags
}

# EKS Node Groups
resource "aws_eks_node_group" "general" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.cluster_name}-general"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.private_subnet_ids

  capacity_type = "ON_DEMAND"
  ami_type      = "AL2_x86_64"
  disk_size     = var.general_node_disk_size

  instance_types = var.general_node_instance_types

  scaling_config {
    desired_size = var.general_node_desired_size
    max_size     = var.general_node_max_size
    min_size     = var.general_node_min_size
  }

  update_config {
    max_unavailable = 1
  }

  labels = {
    workload-type = "general"
  }

  depends_on = [
    aws_iam_role_policy_attachment.node_AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.node_AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.node_AmazonEC2ContainerRegistryReadOnly,
  ]

  tags = merge(var.common_tags, {
    Name = "${var.cluster_name}-general-node-group"
  })
}

# Agent-optimized node group
resource "aws_eks_node_group" "agents" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.cluster_name}-agents"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.private_subnet_ids

  capacity_type = "ON_DEMAND"
  ami_type      = "AL2_x86_64"
  disk_size     = var.agent_node_disk_size

  instance_types = var.agent_node_instance_types

  scaling_config {
    desired_size = var.agent_node_desired_size
    max_size     = var.agent_node_max_size
    min_size     = var.agent_node_min_size
  }

  update_config {
    max_unavailable = 1
  }

  labels = {
    workload-type = "agents"
  }

  taints {
    key    = "workload-type"
    value  = "agents"
    effect = "NO_SCHEDULE"
  }

  depends_on = [
    aws_iam_role_policy_attachment.node_AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.node_AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.node_AmazonEC2ContainerRegistryReadOnly,
  ]

  tags = merge(var.common_tags, {
    Name = "${var.cluster_name}-agents-node-group"
  })
}

# EKS Addons
resource "aws_eks_addon" "vpc_cni" {
  cluster_name = aws_eks_cluster.main.name
  addon_name   = "vpc-cni"
  addon_version = var.vpc_cni_version
  resolve_conflicts = "OVERWRITE"

  tags = var.common_tags
}

resource "aws_eks_addon" "coredns" {
  cluster_name = aws_eks_cluster.main.name
  addon_name   = "coredns"
  addon_version = var.coredns_version
  resolve_conflicts = "OVERWRITE"

  depends_on = [aws_eks_node_group.general]

  tags = var.common_tags
}

resource "aws_eks_addon" "kube_proxy" {
  cluster_name = aws_eks_cluster.main.name
  addon_name   = "kube-proxy"
  addon_version = var.kube_proxy_version
  resolve_conflicts = "OVERWRITE"

  tags = var.common_tags
}

resource "aws_eks_addon" "ebs_csi" {
  cluster_name = aws_eks_cluster.main.name
  addon_name   = "aws-ebs-csi-driver"
  addon_version = var.ebs_csi_version
  resolve_conflicts = "OVERWRITE"
  service_account_role_arn = aws_iam_role.ebs_csi.arn

  tags = var.common_tags
}

# KMS Key for EKS encryption
resource "aws_kms_key" "eks" {
  description             = "EKS Secret Encryption Key for ${var.cluster_name}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = merge(var.common_tags, {
    Name = "${var.cluster_name}-eks-encryption-key"
  })
}

resource "aws_kms_alias" "eks" {
  name          = "alias/${var.cluster_name}-eks-encryption-key"
  target_key_id = aws_kms_key.eks.key_id
}

# CloudWatch Log Group for EKS
resource "aws_cloudwatch_log_group" "eks_cluster" {
  name              = "/aws/eks/${var.cluster_name}/cluster"
  retention_in_days = var.log_retention_days

  tags = var.common_tags
}
```

#### **RDS Module**
```hcl
# terraform/modules/rds/main.tf
# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.identifier}-subnet-group"
  subnet_ids = var.subnet_ids

  tags = merge(var.common_tags, {
    Name = "${var.identifier}-subnet-group"
  })
}

# DB Parameter Group
resource "aws_db_parameter_group" "main" {
  family = var.parameter_group_family
  name   = "${var.identifier}-parameter-group"

  # Performance optimizations for Progressive Framework
  parameter {
    name  = "shared_buffers"
    value = "{DBInstanceClassMemory/4}"
  }

  parameter {
    name  = "effective_cache_size"
    value = "{DBInstanceClassMemory*3/4}"
  }

  parameter {
    name  = "work_mem"
    value = "32768"  # 32MB
  }

  parameter {
    name  = "maintenance_work_mem"
    value = "262144"  # 256MB
  }

  parameter {
    name  = "checkpoint_completion_target"
    value = "0.9"
  }

  parameter {
    name  = "wal_compression"
    value = "on"
  }

  parameter {
    name  = "random_page_cost"
    value = "1.5"  # For SSD storage
  }

  parameter {
    name  = "effective_io_concurrency"
    value = "200"  # For SSD
  }

  # Logging configuration
  parameter {
    name  = "log_min_duration_statement"
    value = "1000"  # Log queries > 1 second
  }

  parameter {
    name  = "log_checkpoints"
    value = "1"
  }

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  parameter {
    name  = "log_lock_waits"
    value = "1"
  }

  tags = var.common_tags
}

# Primary RDS Instance
resource "aws_db_instance" "main" {
  identifier = var.identifier

  # Engine configuration
  engine         = var.engine
  engine_version = var.engine_version
  instance_class = var.instance_class

  # Database configuration
  db_name  = var.database_name
  username = var.master_username
  password = var.master_password

  # Storage configuration
  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type          = var.storage_type
  storage_encrypted     = true
  kms_key_id           = aws_kms_key.rds.arn

  # Network configuration
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false

  # Parameter and option groups
  parameter_group_name = aws_db_parameter_group.main.name

  # Backup configuration
  backup_retention_period = var.backup_retention_period
  backup_window          = var.backup_window
  copy_tags_to_snapshot  = true
  delete_automated_backups = false
  deletion_protection    = var.deletion_protection

  # Maintenance configuration
  maintenance_window = var.maintenance_window
  auto_minor_version_upgrade = var.auto_minor_version_upgrade

  # Performance Insights
  performance_insights_enabled = true
  performance_insights_retention_period = 7
  performance_insights_kms_key_id = aws_kms_key.rds.arn

  # Monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn

  # Enhanced monitoring
  enabled_cloudwatch_logs_exports = ["postgresql"]

  # Final snapshot
  final_snapshot_identifier = "${var.identifier}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  skip_final_snapshot      = var.skip_final_snapshot

  tags = merge(var.common_tags, {
    Name = var.identifier
    Type = "Primary"
  })
}

# Read Replica for scaling reads
resource "aws_db_instance" "read_replica" {
  count = var.create_read_replica ? var.read_replica_count : 0

  identifier = "${var.identifier}-read-replica-${count.index + 1}"

  # Replica configuration
  replicate_source_db = aws_db_instance.main.id

  # Instance configuration
  instance_class = var.read_replica_instance_class

  # Storage configuration (inherited from primary)
  storage_encrypted = true

  # Network configuration
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false

  # Performance Insights
  performance_insights_enabled = true
  performance_insights_retention_period = 7
  performance_insights_kms_key_id = aws_kms_key.rds.arn

  # Monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn

  # Auto minor version upgrade
  auto_minor_version_upgrade = var.auto_minor_version_upgrade

  tags = merge(var.common_tags, {
    Name = "${var.identifier}-read-replica-${count.index + 1}"
    Type = "ReadReplica"
  })
}

# KMS Key for RDS encryption
resource "aws_kms_key" "rds" {
  description             = "RDS encryption key for ${var.identifier}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = merge(var.common_tags, {
    Name = "${var.identifier}-rds-encryption-key"
  })
}

resource "aws_kms_alias" "rds" {
  name          = "alias/${var.identifier}-rds-encryption-key"
  target_key_id = aws_kms_key.rds.key_id
}

# RDS Security Group
resource "aws_security_group" "rds" {
  name_prefix = "${var.identifier}-rds-"
  vpc_id      = var.vpc_id

  ingress {
    description = "PostgreSQL from application"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
  }

  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.common_tags, {
    Name = "${var.identifier}-rds-sg"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# IAM Role for RDS Enhanced Monitoring
resource "aws_iam_role" "rds_monitoring" {
  name = "${var.identifier}-rds-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = var.common_tags
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}
```

#### **Agent Infrastructure Module**
```hcl
# terraform/modules/agents/main.tf
# Namespace for agents
resource "kubernetes_namespace" "agents" {
  metadata {
    name = var.agents_namespace
    labels = {
      name = var.agents_namespace
      tier = "agents"
    }
  }
}

# Service Account for agents
resource "kubernetes_service_account" "agents" {
  metadata {
    name      = "agent-service-account"
    namespace = kubernetes_namespace.agents.metadata[0].name
    labels = {
      app  = "progressive-agents"
      tier = "agents"
    }
  }
}

# RBAC for agents
resource "kubernetes_cluster_role" "agents" {
  metadata {
    name = "agent-cluster-role"
  }

  rule {
    api_groups = [""]
    resources  = ["pods", "services", "configmaps", "secrets"]
    verbs      = ["get", "list", "watch"]
  }

  rule {
    api_groups = ["apps"]
    resources  = ["deployments", "replicasets"]
    verbs      = ["get", "list", "watch"]
  }

  rule {
    api_groups = ["monitoring.coreos.com"]
    resources  = ["servicemonitors"]
    verbs      = ["get", "list", "create"]
  }
}

resource "kubernetes_cluster_role_binding" "agents" {
  metadata {
    name = "agent-cluster-role-binding"
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = kubernetes_cluster_role.agents.metadata[0].name
  }

  subject {
    kind      = "ServiceAccount"
    name      = kubernetes_service_account.agents.metadata[0].name
    namespace = kubernetes_namespace.agents.metadata[0].name
  }
}

# ConfigMap for agent configuration
resource "kubernetes_config_map" "agents_config" {
  metadata {
    name      = "agents-config"
    namespace = kubernetes_namespace.agents.metadata[0].name
  }

  data = {
    # Database configuration
    "DB_HOST"     = var.database_host
    "DB_PORT"     = "5432"
    "DB_NAME"     = var.database_name
    "DB_SSL_MODE" = "require"

    # Redis configuration
    "REDIS_HOST"    = var.redis_host
    "REDIS_PORT"    = "6379"
    "REDIS_DB"      = "0"

    # MongoDB configuration
    "MONGO_HOST" = var.mongo_host
    "MONGO_PORT" = "27017"
    "MONGO_DB"   = var.mongo_database

    # Agent coordination settings
    "AGENT_COORDINATION_ENABLED" = "true"
    "AGENT_DISCOVERY_ENABLED"    = "true"
    "AGENT_HEALTH_CHECK_INTERVAL" = "30"

    # MCA specific configuration
    "MCA_ENABLED"                    = var.mca_enabled
    "MCA_MAX_COORDINATION_SESSIONS" = var.mca_max_sessions
    "MCA_SESSION_TIMEOUT"           = "300"
    "MCA_HEARTBEAT_INTERVAL"        = "10"

    # NPA specific configuration
    "NPA_ENABLED"              = var.npa_enabled
    "NPA_NUTRITION_DB_ENABLED" = "true"
    "NPA_PLAN_CACHE_SIZE"     = "1000"
    "NPA_PLAN_CACHE_TTL"      = "3600"

    # WPA specific configuration
    "WPA_ENABLED"               = var.wpa_enabled
    "WPA_EXERCISE_DB_ENABLED"   = "true"
    "WPA_PLAN_GENERATION_TIMEOUT" = "15"
    "WPA_EXERCISE_CACHE_SIZE"   = "2000"

    # Logging configuration
    "LOG_LEVEL"  = var.log_level
    "LOG_FORMAT" = "json"

    # Performance settings
    "NODE_ENV" = var.environment
    "NODE_OPTIONS" = "--max-old-space-size=1024"
    "UV_THREADPOOL_SIZE" = "16"
  }
}

# Secrets for agents
resource "kubernetes_secret" "agents_secrets" {
  metadata {
    name      = "agents-secrets"
    namespace = kubernetes_namespace.agents.metadata[0].name
  }

  type = "Opaque"

  data = {
    "DB_USERNAME" = base64encode(var.database_username)
    "DB_PASSWORD" = base64encode(var.database_password)
    "REDIS_PASSWORD" = base64encode(var.redis_password)
    "MONGO_USERNAME" = base64encode(var.mongo_username)
    "MONGO_PASSWORD" = base64encode(var.mongo_password)
    "JWT_SECRET" = base64encode(var.jwt_secret)
    "AGENT_API_KEY" = base64encode(var.agent_api_key)
  }
}

# Persistent Volume Claims for agent data
resource "kubernetes_persistent_volume_claim" "agent_data" {
  for_each = toset(var.agents)

  metadata {
    name      = "${each.key}-data-pvc"
    namespace = kubernetes_namespace.agents.metadata[0].name
    labels = {
      app   = each.key
      tier  = "agents"
    }
  }

  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = var.agent_storage_size
      }
    }
    storage_class_name = var.storage_class_name
  }
}

# Network Policies for agent security
resource "kubernetes_network_policy" "agents_network_policy" {
  metadata {
    name      = "agents-network-policy"
    namespace = kubernetes_namespace.agents.metadata[0].name
  }

  spec {
    pod_selector {
      match_labels = {
        tier = "agents"
      }
    }

    policy_types = ["Ingress", "Egress"]

    ingress {
      from {
        pod_selector {
          match_labels = {
            app = "progressive-framework-v5"
          }
        }
      }

      from {
        pod_selector {
          match_labels = {
            tier = "agents"
          }
        }
      }

      ports {
        protocol = "TCP"
        port     = "8000"
      }

      ports {
        protocol = "TCP"
        port     = "9000"
      }
    }

    egress {
      # Allow DNS resolution
      to {}
      ports {
        protocol = "UDP"
        port     = "53"
      }
    }

    egress {
      # Allow database connections
      to {}
      ports {
        protocol = "TCP"
        port     = "5432"
      }
    }

    egress {
      # Allow Redis connections
      to {}
      ports {
        protocol = "TCP"
        port     = "6379"
      }
    }

    egress {
      # Allow MongoDB connections
      to {}
      ports {
        protocol = "TCP"
        port     = "27017"
      }
    }

    egress {
      # Allow inter-agent communication
      to {
        pod_selector {
          match_labels = {
            tier = "agents"
          }
        }
      }
      ports {
        protocol = "TCP"
        port     = "8000"
      }

      ports {
        protocol = "TCP"
        port     = "9000"
      }
    }
  }
}

# Service Monitor for Prometheus
resource "kubernetes_manifest" "agents_service_monitor" {
  manifest = {
    apiVersion = "monitoring.coreos.com/v1"
    kind       = "ServiceMonitor"
    metadata = {
      name      = "agents-service-monitor"
      namespace = kubernetes_namespace.agents.metadata[0].name
      labels = {
        app  = "progressive-agents"
        tier = "agents"
      }
    }
    spec = {
      selector = {
        matchLabels = {
          tier = "agents"
        }
      }
      endpoints = [
        {
          port = "metrics"
          interval = "30s"
          path = "/metrics"
        }
      ]
    }
  }
}
```

---

## **GITOPS IMPLEMENTATION**

### **ArgoCD Configuration**
```yaml
# gitops/argocd/argocd-values.yaml
global:
  image:
    tag: v2.8.4

redis-ha:
  enabled: false

redis:
  enabled: true

server:
  replicas: 2
  
  config:
    url: https://argocd.your-domain.com
    application.instanceLabelKey: argocd.argoproj.io/instance
    
    # OIDC configuration for authentication
    oidc.config: |
      name: SSO
      issuer: https://your-domain.com/auth
      clientId: argocd
      clientSecret: $oidc.clientSecret
      requestedScopes: ["openid", "profile", "email", "groups"]
      requestedIDTokenClaims: {"groups": {"essential": true}}
    
    # Policy configuration
    policy.default: role:readonly
    policy.csv: |
      p, role:admin, applications, *, *, allow
      p, role:admin, clusters, *, *, allow
      p, role:admin, repositories, *, *, allow
      p, role:developer, applications, get, */*, allow
      p, role:developer, applications, sync, progressive-framework-dev/*, allow
      g, argocd-admins, role:admin
      g, developers, role:developer

  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.class: nginx
      cert-manager.io/cluster-issuer: letsencrypt-prod
      nginx.ingress.kubernetes.io/ssl-redirect: "true"
      nginx.ingress.kubernetes.io/backend-protocol: GRPC
    hosts:
      - argocd.your-domain.com
    tls:
      - secretName: argocd-tls
        hosts:
          - argocd.your-domain.com

repoServer:
  replicas: 2
  
  resources:
    limits:
      cpu: 1000m
      memory: 1Gi
    requests:
      cpu: 250m
      memory: 256Mi

applicationSet:
  enabled: true
  replicas: 2

dex:
  enabled: false  # Using external OIDC

notifications:
  enabled: true
  
  argocdUrl: https://argocd.your-domain.com
  
  subscriptions:
    - recipients:
      - slack:progressive-framework-alerts
      triggers:
      - on-sync-failed
      - on-health-degraded
      
  templates:
    template.app-deployed: |
      message: Application {{.app.metadata.name}} is now running new version.
    template.app-health-degraded: |
      message: Application {{.app.metadata.name}} has degraded health.
    template.app-sync-failed: |
      message: Application {{.app.metadata.name}} sync is failed.

  triggers:
    trigger.on-deployed: |
      - when: app.status.operationState.phase in ['Succeeded'] and app.status.health.status == 'Healthy'
        send: [app-deployed]
    trigger.on-health-degraded: |
      - when: app.status.health.status == 'Degraded'
        send: [app-health-degraded]
    trigger.on-sync-failed: |
      - when: app.status.operationState.phase in ['Error', 'Failed']
        send: [app-sync-failed]

  services:
    service.slack: |
      token: $slack-token
      channel: progressive-framework-alerts
```

### **Application Definitions**
```yaml
# gitops/applications/progressive-framework-prod.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: progressive-framework-prod
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: progressive-framework
  
  source:
    repoURL: https://github.com/your-org/progressive-framework-v5
    targetRevision: main
    path: k8s/environments/production
    
    # Kustomize configuration
    kustomize:
      images:
        - progressive-framework/api:latest
        - progressive-framework/web:latest
    
  destination:
    server: https://kubernetes.default.svc
    namespace: progressive-framework-prod
  
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
    - CreateNamespace=true
    - PrunePropagationPolicy=foreground
    - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m

  # Health checks
  ignoreDifferences:
  - group: apps
    kind: Deployment
    jsonPointers:
    - /spec/replicas
  
  # Sync windows
  syncWindows:
  - kind: deny
    schedule: "0 2 * * 1-5"  # Deny weekday 2 AM deployments
    duration: 2h
    applications:
    - progressive-framework-prod

---
# Agent-specific application
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: progressive-agents-prod
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: progressive-framework
  
  source:
    repoURL: https://github.com/your-org/progressive-framework-v5
    targetRevision: main
    path: k8s/agents/production
    
  destination:
    server: https://kubernetes.default.svc
    namespace: progressive-framework-prod
  
  syncPolicy:
    automated:
      prune: false  # Manual pruning for agents
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
    retry:
      limit: 3
      backoff:
        duration: 10s
        factor: 2
        maxDuration: 5m

  # Agent-specific health checks
  ignoreDifferences:
  - group: apps
    kind: Deployment
    name: mca
    jsonPointers:
    - /spec/replicas
  - group: apps
    kind: Deployment
    name: npa
    jsonPointers:
    - /spec/replicas
  - group: apps
    kind: Deployment
    name: wpa
    jsonPointers:
    - /spec/replicas
```

### **ApplicationSet for Multi-Environment**
```yaml
# gitops/applicationsets/progressive-framework-applicationset.yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: progressive-framework-environments
  namespace: argocd
spec:
  generators:
  - git:
      repoURL: https://github.com/your-org/progressive-framework-v5
      revision: HEAD
      directories:
      - path: k8s/environments/*
  
  template:
    metadata:
      name: 'progressive-framework-{{path.basename}}'
      labels:
        environment: '{{path.basename}}'
    spec:
      project: progressive-framework
      source:
        repoURL: https://github.com/your-org/progressive-framework-v5
        targetRevision: '{{path.basename == "production" | ternary("main", "develop")}}'
        path: '{{path}}'
        
        kustomize:
          images:
          - 'progressive-framework/api:{{path.basename == "production" | ternary("stable", "latest")}}'
          - 'progressive-framework/web:{{path.basename == "production" | ternary("stable", "latest")}}'
          
      destination:
        server: https://kubernetes.default.svc
        namespace: 'progressive-framework-{{path.basename}}'
      
      syncPolicy:
        automated:
          prune: true
          selfHeal: '{{path.basename != "production"}}'
        syncOptions:
        - CreateNamespace=true
        
        # Production requires manual sync
        '{{- if eq path.basename "production" }}'
        automated: {}
        '{{- end }}'

---
# Agent ApplicationSet
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: progressive-agents-environments
  namespace: argocd
spec:
  generators:
  - matrix:
      generators:
      - git:
          repoURL: https://github.com/your-org/progressive-framework-v5
          revision: HEAD
          directories:
          - path: k8s/environments/*
      - list:
          elements:
          - agent: mca
            port: "8000"
            replicas: "2"
          - agent: npa  
            port: "8000"
            replicas: "3"
          - agent: wpa
            port: "8000"
            replicas: "2"
  
  template:
    metadata:
      name: '{{agent}}-{{path.basename}}'
      labels:
        agent: '{{agent}}'
        environment: '{{path.basename}}'
    spec:
      project: progressive-framework
      source:
        repoURL: https://github.com/your-org/progressive-framework-v5
        targetRevision: '{{path.basename == "production" | ternary("main", "develop")}}'
        path: 'k8s/agents/{{agent}}'
        
        helm:
          valueFiles:
          - 'values-{{path.basename}}.yaml'
          parameters:
          - name: 'replicaCount'
            value: '{{replicas}}'
          - name: 'service.port'
            value: '{{port}}'
          - name: 'environment'
            value: '{{path.basename}}'
            
      destination:
        server: https://kubernetes.default.svc
        namespace: 'progressive-framework-{{path.basename}}'
      
      syncPolicy:
        automated:
          prune: '{{path.basename != "production"}}'
          selfHeal: true
        syncOptions:
        - CreateNamespace=true
```

---

## **TERRAFORM AUTOMATION**

### **GitHub Actions Workflow**
```yaml
# .github/workflows/terraform.yml
name: Terraform Infrastructure

on:
  push:
    branches: [main, develop]
    paths: ['terraform/**']
  pull_request:
    branches: [main]
    paths: ['terraform/**']

env:
  TF_VERSION: '1.5.7'
  AWS_REGION: us-east-1
  
jobs:
  terraform-validate:
    name: Terraform Validate
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Terraform Format Check
      run: terraform fmt -check -recursive
      
    - name: Terraform Validate
      run: |
        cd terraform/environments/dev
        terraform init -backend=false
        terraform validate
        
    - name: Security Scan with Checkov
      uses: bridgecrewio/checkov-action@master
      with:
        directory: terraform/
        framework: terraform
        output_format: sarif
        output_file_path: reports/results.sarif
        
    - name: Upload Checkov results to GitHub Security
      uses: github/codeql-action/upload-sarif@v3
      if: always()
      with:
        sarif_file: reports/results.sarif

  terraform-plan:
    name: Terraform Plan
    runs-on: ubuntu-latest
    needs: terraform-validate
    if: github.event_name == 'pull_request'
    
    strategy:
      matrix:
        environment: [dev, staging]
        
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Configure AWS Credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
        
    - name: Terraform Init
      run: |
        cd terraform/environments/${{ matrix.environment }}
        terraform init
        
    - name: Terraform Plan
      run: |
        cd terraform/environments/${{ matrix.environment }}
        terraform plan -out=tfplan
        
    - name: Cost Estimation with Infracost
      uses: infracost/infracost-action@v1
      with:
        api_key: ${{ secrets.INFRACOST_API_KEY }}
        currency: USD
        terraform_plan_file: terraform/environments/${{ matrix.environment }}/tfplan
        
    - name: Post Plan Comment
      uses: actions/github-script@v7
      if: github.event_name == 'pull_request'
      with:
        script: |
          const fs = require('fs');
          const planFile = 'terraform/environments/${{ matrix.environment }}/tfplan';
          if (fs.existsSync(planFile)) {
            const plan = fs.readFileSync(planFile, 'utf8');
            const comment = `
            ## Terraform Plan - ${{ matrix.environment }}
            \`\`\`
            ${plan}
            \`\`\`
            `;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
          }

  terraform-apply-dev:
    name: Terraform Apply (Dev)
    runs-on: ubuntu-latest
    needs: terraform-validate
    if: github.ref == 'refs/heads/develop'
    environment: development
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Configure AWS Credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
        
    - name: Terraform Init
      run: |
        cd terraform/environments/dev
        terraform init
        
    - name: Terraform Plan
      run: |
        cd terraform/environments/dev
        terraform plan -out=tfplan
        
    - name: Terraform Apply
      run: |
        cd terraform/environments/dev
        terraform apply -auto-approve tfplan
        
    - name: Update Agent Configuration
      run: |
        cd terraform/environments/dev
        # Extract outputs and update agent configurations
        terraform output -json > outputs.json
        
        # Update K8s configuration with new infrastructure details
        kubectl apply -f - <<EOF
        apiVersion: v1
        kind: ConfigMap
        metadata:
          name: infrastructure-config
          namespace: progressive-framework-dev
        data:
          rds_endpoint: $(jq -r .rds_endpoint.value outputs.json)
          redis_endpoint: $(jq -r .redis_endpoint.value outputs.json)
          eks_cluster_name: $(jq -r .eks_cluster_name.value outputs.json)
        EOF

  terraform-apply-production:
    name: Terraform Apply (Production)
    runs-on: ubuntu-latest
    needs: terraform-validate
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Configure AWS Credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID_PROD }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY_PROD }}
        aws-region: ${{ env.AWS_REGION }}
        
    - name: Terraform Init
      run: |
        cd terraform/environments/production
        terraform init
        
    - name: Terraform Plan
      run: |
        cd terraform/environments/production
        terraform plan -out=tfplan
        
    - name: Wait for Approval
      uses: trstringer/manual-approval@v1
      with:
        secret: ${{ github.TOKEN }}
        approvers: devops-team,platform-team
        minimum-approvals: 2
        issue-title: "Production Infrastructure Change"
        
    - name: Terraform Apply
      run: |
        cd terraform/environments/production
        terraform apply -auto-approve tfplan
        
    - name: Notify Success
      uses: 8398a7/action-slack@v3
      with:
        status: success
        text: 'Production infrastructure successfully deployed!'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

  drift-detection:
    name: Terraform Drift Detection
    runs-on: ubuntu-latest
    if: github.event_name == 'schedule'
    
    strategy:
      matrix:
        environment: [dev, staging, production]
        
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: ${{ env.TF_VERSION }}
        
    - name: Configure AWS Credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
        
    - name: Install Driftctl
      run: |
        curl -L https://github.com/snyk/driftctl/releases/latest/download/driftctl_linux_amd64 -o driftctl
        chmod +x driftctl
        sudo mv driftctl /usr/local/bin/
        
    - name: Run Drift Detection
      run: |
        cd terraform/environments/${{ matrix.environment }}
        terraform init
        
        # Run driftctl
        driftctl scan --from tfstate+s3://progressive-terraform-state-${{ matrix.environment }}/terraform.tfstate
        
    - name: Report Drift
      if: failure()
      uses: 8398a7/action-slack@v3
      with:
        status: failure
        text: 'Infrastructure drift detected in ${{ matrix.environment }} environment!'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## **CONFIGURATION MANAGEMENT**

### **Kustomize Configuration**
```yaml
# k8s/base/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- ../common/namespace.yaml
- ../common/service-account.yaml
- deployment.yaml
- service.yaml
- ingress.yaml
- configmap.yaml
- secret.yaml

images:
- name: progressive-framework/api
  newTag: latest
- name: progressive-framework/web
  newTag: latest

commonLabels:
  app: progressive-framework-v5
  version: v5.0

commonAnnotations:
  managed-by: kustomize

patchesStrategicMerge:
- resource-limits.yaml

configMapGenerator:
- name: app-config
  files:
  - config/app.properties
  - config/database.properties
  
secretGenerator:
- name: app-secrets
  type: Opaque
  literals:
  - DB_PASSWORD=placeholder
  - JWT_SECRET=placeholder

---
# k8s/overlays/production/kustomization.yaml  
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: progressive-framework-prod

resources:
- ../../base

images:
- name: progressive-framework/api
  newTag: stable
- name: progressive-framework/web  
  newTag: stable

replicas:
- name: progressive-framework-v5
  count: 5

patchesStrategicMerge:
- production-resources.yaml
- production-config.yaml

patchesJson6902:
- target:
    group: apps
    version: v1
    kind: Deployment
    name: progressive-framework-v5
  path: production-deployment-patch.yaml

configMapGenerator:
- name: production-config
  literals:
  - ENVIRONMENT=production
  - LOG_LEVEL=info
  - ENABLE_METRICS=true
  - AGENT_COORDINATION_TIMEOUT=30000

secretGenerator:
- name: production-secrets
  type: Opaque
  files:
  - secrets/db-password.txt
  - secrets/jwt-secret.txt
  - secrets/agent-api-key.txt

---
# k8s/overlays/production/production-resources.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: progressive-framework-v5
spec:
  template:
    spec:
      containers:
      - name: progressive-framework-v5
        resources:
          limits:
            cpu: 2000m
            memory: 4Gi
          requests:
            cpu: 1000m
            memory: 2Gi
            
      # Node selector for production workloads
      nodeSelector:
        workload-type: general
        
      # Tolerations for dedicated nodes
      tolerations:
      - key: workload-type
        operator: Equal
        value: general
        effect: NoSchedule
        
      # Anti-affinity for high availability
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
```

### **Helm Chart Structure**
```
helm/progressive-framework/
├── Chart.yaml                    # Chart metadata
├── values.yaml                   # Default values
├── values-dev.yaml              # Development values
├── values-staging.yaml          # Staging values  
├── values-production.yaml       # Production values
├── templates/
│   ├── deployment.yaml          # Application deployment
│   ├── service.yaml             # Application service
│   ├── ingress.yaml             # Ingress configuration
│   ├── configmap.yaml           # Configuration
│   ├── secret.yaml              # Secrets
│   ├── serviceaccount.yaml      # Service account
│   ├── hpa.yaml                 # Horizontal Pod Autoscaler
│   ├── pdb.yaml                 # Pod Disruption Budget
│   ├── networkpolicy.yaml       # Network policies
│   └── agents/                  # Agent-specific templates
│       ├── mca/
│       │   ├── deployment.yaml
│       │   ├── service.yaml
│       │   └── configmap.yaml
│       ├── npa/
│       │   ├── deployment.yaml
│       │   ├── service.yaml
│       │   └── configmap.yaml
│       └── wpa/
│           ├── deployment.yaml
│           ├── service.yaml
│           └── configmap.yaml
├── charts/                      # Sub-charts
│   ├── postgresql/             # Database chart
│   ├── redis/                  # Redis chart
│   └── mongodb/                # MongoDB chart
└── crds/                       # Custom Resource Definitions
    └── agents-crd.yaml
```

### **Helm Values Structure**
```yaml
# helm/progressive-framework/values-production.yaml
global:
  imageRegistry: progressive-framework
  imagePullSecrets:
    - name: regcred
  storageClass: gp3
  
replicaCount: 5

image:
  repository: progressive-framework/api
  pullPolicy: Always
  tag: stable

nameOverride: ""
fullnameOverride: ""

serviceAccount:
  create: true
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::ACCOUNT:role/progressive-framework-role
  name: progressive-framework-sa

podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "9090"
  prometheus.io/path: "/metrics"

podSecurityContext:
  fsGroup: 2000
  runAsNonRoot: true
  runAsUser: 1000

securityContext:
  allowPrivilegeEscalation: false
  capabilities:
    drop:
    - ALL
  readOnlyRootFilesystem: true

service:
  type: ClusterIP
  port: 80
  targetPort: 3000

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
  hosts:
    - host: your-domain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: progressive-framework-tls
      hosts:
        - your-domain.com

resources:
  limits:
    cpu: 2000m
    memory: 4Gi
  requests:
    cpu: 1000m
    memory: 2Gi

autoscaling:
  enabled: true
  minReplicas: 5
  maxReplicas: 20
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

nodeSelector:
  workload-type: general

tolerations:
  - key: workload-type
    operator: Equal
    value: general
    effect: NoSchedule

affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - weight: 100
      podAffinityTerm:
        labelSelector:
          matchExpressions:
          - key: app.kubernetes.io/name
            operator: In
            values:
            - progressive-framework
        topologyKey: kubernetes.io/hostname

# Agent configurations
agents:
  mca:
    enabled: true
    replicaCount: 2
    image:
      repository: progressive-framework/mca
      tag: stable
    resources:
      limits:
        cpu: 1000m
        memory: 2Gi
      requests:
        cpu: 500m
        memory: 1Gi
    config:
      maxCoordinationSessions: 50
      sessionTimeout: 300
      heartbeatInterval: 10
      
  npa:
    enabled: true
    replicaCount: 3
    image:
      repository: progressive-framework/npa
      tag: stable
    resources:
      limits:
        cpu: 1500m
        memory: 3Gi
      requests:
        cpu: 750m
        memory: 1.5Gi
    config:
      planCacheSize: 1000
      planCacheTTL: 3600
      maxNutrientsCalculation: 500
      
  wpa:
    enabled: true
    replicaCount: 2
    image:
      repository: progressive-framework/wpa
      tag: stable
    resources:
      limits:
        cpu: 1500m
        memory: 2Gi
      requests:
        cpu: 750m
        memory: 1Gi
    config:
      exerciseCacheSize: 2000
      planGenerationTimeout: 15
      maxExerciseCombinations: 1000

# Database configuration
postgresql:
  enabled: true
  auth:
    existingSecret: postgresql-secret
  primary:
    persistence:
      enabled: true
      storageClass: gp3
      size: 100Gi
  readReplicas:
    replicaCount: 2

redis:
  enabled: true
  auth:
    enabled: true
    existingSecret: redis-secret
  master:
    persistence:
      enabled: true
      storageClass: gp3
      size: 20Gi

mongodb:
  enabled: true
  auth:
    existingSecret: mongodb-secret
  persistence:
    enabled: true
    storageClass: gp3
    size: 50Gi
  replicaSet:
    enabled: true
    replicas:
      secondary: 2

# Monitoring
serviceMonitor:
  enabled: true
  interval: 30s
  path: /metrics

networkPolicy:
  enabled: true
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: ingress-nginx
      - namespaceSelector:
          matchLabels:
            name: monitoring
  egress:
    - to: {}
      ports:
      - protocol: TCP
        port: 5432  # PostgreSQL
      - protocol: TCP
        port: 6379  # Redis
      - protocol: TCP
        port: 27017 # MongoDB
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Network Architecture & Security](Network-Architecture-Security.md)** - Network and security setup
- **[Container Orchestration](../05-DevOps/Container-Orchestration.md)** - Kubernetes deployment

### **Follow-up Documents**
- **[Cloud Provider Integration](Cloud-Provider-Integration.md)** - Cloud service integration
- **[Disaster Recovery & Backup](Disaster-Recovery-Backup.md)** - Backup and recovery procedures

### **Operations Context**
- **[CI/CD Pipeline](../05-DevOps/CI-CD-Pipeline.md)** - Continuous integration and deployment
- **[Monitoring & Alerting](../05-DevOps/Monitoring-Alerting.md)** - Monitoring setup

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | Infrastructure Team | Complete Infrastructure as Code implementation |
| 4.x | 2025-08-xx | DevOps Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: Infrastructure Team  
**Last Validated**: 2025-09-02