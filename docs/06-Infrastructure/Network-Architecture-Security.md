---
file: docs/06-Infrastructure/Network-Architecture-Security.md
directory: docs/06-Infrastructure/
priority: CRITICAL
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# Network Architecture & Security - Progressive-Framework-v5

**File Path**: `docs/06-Infrastructure/Network-Architecture-Security.md`  
**Directory**: `docs/06-Infrastructure/`  
**Priority**: CRITICAL  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Comprehensive network architecture and security framework for Progressive-Framework-v5, covering network topology design, security zones, firewall configurations, VPN setup, service mesh security, agent communication security, and advanced network security patterns for both enterprise core systems and context agents (MCA, NPA, WPA).

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🛡️ **[Security Overview](../04-Security/Security-Overview.md)** - *Security requirements and policies*
- 🏗️ **[Load Balancing & Resource Management](Load-Balancing-Resource-Management.md)** - *Load balancing and resource allocation*
- 🐳 **[Container Orchestration](../05-DevOps/Container-Orchestration.md)** - *Kubernetes networking basics*
- 🌍 **[Environment Management](../05-DevOps/Environment-Management.md)** - *Multi-environment strategies*

---

## **NETWORK ARCHITECTURE OVERVIEW**

### **Network Topology Design**
```
Progressive-Framework-v5 Network Architecture:

                           INTERNET
                               │
                         ┌─────────────┐
                         │   WAF/CDN   │
                         │ (Cloudflare)│
                         └─────────────┘
                               │
                    ┌─────────────────────┐
                    │    EDGE LAYER      │
                    │                    │
         ┌──────────┼──────────┬─────────┼──────────┐
         │          │          │         │          │
    ┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐
    │   LB    ││   LB    ││   LB    ││   LB    ││   LB    │
    │ (Web)   ││  (API)  ││ (Agents)││ (Admin) ││ (Mgmt)  │
    └─────────┘└─────────┘└─────────┘└─────────┘└─────────┘
         │          │          │         │          │
    ┌─────────────────────────────────────────────────────────┐
    │                 DMZ (Public Subnet)                     │
    └─────────────────────────────────────────────────────────┘
                               │
                      ┌────────────────┐
                      │  NAT GATEWAY   │
                      └────────────────┘
                               │
    ┌─────────────────────────────────────────────────────────┐
    │              APPLICATION LAYER                          │
    │             (Private Subnet A)                          │
    │                                                         │
    │  ┌─────────────┐  ┌─────────────────────────────────┐   │
    │  │ ENTERPRISE  │  │       CONTEXT AGENTS            │   │
    │  │    CORE     │  │                                 │   │
    │  │             │  │ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
    │  │ • Web API   │◄─┤ │   MCA   │ │   NPA   │ │   WPA   │ │
    │  │ • Business  │  │ │(Coord.) │ │(Nutrition)│(Workout)│ │
    │  │   Logic     │  │ └─────────┘ └─────────┘ └─────────┘ │
    │  │ • Services  │  └─────────────────────────────────────┘ │
    │  └─────────────┘                                          │
    └─────────────────────────────────────────────────────────┘
                               │
    ┌─────────────────────────────────────────────────────────┐
    │                DATABASE LAYER                           │
    │             (Private Subnet B)                          │
    │                                                         │
    │ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
    │ │ PostgreSQL  │ │    Redis    │ │      MongoDB        │ │
    │ │             │ │             │ │                     │ │
    │ │ • Primary   │ │ • Cluster   │ │ • Replica Set       │ │
    │ │ • Replicas  │ │ • Sentinel  │ │ • Sharded           │ │
    │ └─────────────┘ └─────────────┘ └─────────────────────┘ │
    └─────────────────────────────────────────────────────────┘
                               │
    ┌─────────────────────────────────────────────────────────┐
    │              MANAGEMENT LAYER                           │
    │             (Private Subnet C)                          │
    │                                                         │
    │ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
    │ │ Monitoring  │ │   Logging   │ │    Backup &         │ │
    │ │             │ │             │ │    Storage          │ │
    │ │ • Prometheus│ │ • ELK Stack │ │ • S3/GCS            │ │
    │ │ • Grafana   │ │ • Loki      │ │ • Archive           │ │
    │ └─────────────┘ └─────────────┘ └─────────────────────┘ │
    └─────────────────────────────────────────────────────────┘
```

### **Security Zones Architecture**
```
Security Zone Classification:

┌─────────────────────────────────────────────────────────────────────┐
│                          UNTRUSTED ZONE                            │
│                            (Internet)                              │
│                        Threat Level: HIGH                          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                           ┌────────────────┐
                           │   WAF/DDoS     │
                           │   Protection   │
                           └────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                            DMZ ZONE                                 │
│                      (Public-facing services)                      │
│                        Threat Level: MEDIUM                        │
│                                                                     │
│  • Web Application Firewall                                        │
│  • Load Balancers                                                  │
│  • Reverse Proxies                                                 │
│  • Rate Limiting                                                   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                           ┌────────────────┐
                           │   Firewall     │
                           │   (Stateful)   │
                           └────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                       TRUSTED ZONE                                 │
│                    (Internal applications)                         │
│                        Threat Level: LOW                           │
│                                                                     │
│  • Application Services                                            │
│  • Context Agents (MCA, NPA, WPA)                                 │
│  • Internal APIs                                                   │
│  • Service Mesh (mTLS)                                            │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                           ┌────────────────┐
                           │   Firewall     │
                           │   (Database)   │
                           └────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                       RESTRICTED ZONE                              │
│                        (Data storage)                              │
│                        Threat Level: MINIMAL                       │
│                                                                     │
│  • Databases (PostgreSQL, Redis, MongoDB)                         │
│  • Encrypted Storage                                               │
│  • Backup Systems                                                  │
│  • No Direct Internet Access                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## **CLOUD NETWORK INFRASTRUCTURE**

### **AWS VPC Configuration**
```yaml
# terraform/aws/vpc.tf
resource "aws_vpc" "progressive_framework_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name        = "progressive-framework-v5-vpc"
    Environment = var.environment
    Project     = "progressive-framework-v5"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "progressive_igw" {
  vpc_id = aws_vpc.progressive_framework_vpc.id
  
  tags = {
    Name = "progressive-framework-v5-igw"
  }
}

# Public Subnets (DMZ)
resource "aws_subnet" "public_subnet_az1" {
  vpc_id                  = aws_vpc.progressive_framework_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true
  
  tags = {
    Name = "progressive-public-subnet-az1"
    Type = "public"
    Zone = "dmz"
  }
}

resource "aws_subnet" "public_subnet_az2" {
  vpc_id                  = aws_vpc.progressive_framework_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true
  
  tags = {
    Name = "progressive-public-subnet-az2"
    Type = "public"
    Zone = "dmz"
  }
}

# Private Subnets - Application Layer
resource "aws_subnet" "private_app_subnet_az1" {
  vpc_id            = aws_vpc.progressive_framework_vpc.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "${var.aws_region}a"
  
  tags = {
    Name = "progressive-app-subnet-az1"
    Type = "private"
    Zone = "application"
    "kubernetes.io/role/internal-elb" = "1"
  }
}

resource "aws_subnet" "private_app_subnet_az2" {
  vpc_id            = aws_vpc.progressive_framework_vpc.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "${var.aws_region}b"
  
  tags = {
    Name = "progressive-app-subnet-az2"
    Type = "private"
    Zone = "application"
    "kubernetes.io/role/internal-elb" = "1"
  }
}

# Private Subnets - Database Layer
resource "aws_subnet" "private_db_subnet_az1" {
  vpc_id            = aws_vpc.progressive_framework_vpc.id
  cidr_block        = "10.0.20.0/24"
  availability_zone = "${var.aws_region}a"
  
  tags = {
    Name = "progressive-db-subnet-az1"
    Type = "private"
    Zone = "database"
  }
}

resource "aws_subnet" "private_db_subnet_az2" {
  vpc_id            = aws_vpc.progressive_framework_vpc.id
  cidr_block        = "10.0.21.0/24"
  availability_zone = "${var.aws_region}b"
  
  tags = {
    Name = "progressive-db-subnet-az2"
    Type = "private"
    Zone = "database"
  }
}

# NAT Gateways for outbound internet access
resource "aws_eip" "nat_gateway_eip_az1" {
  domain = "vpc"
  
  tags = {
    Name = "progressive-nat-eip-az1"
  }
}

resource "aws_eip" "nat_gateway_eip_az2" {
  domain = "vpc"
  
  tags = {
    Name = "progressive-nat-eip-az2"
  }
}

resource "aws_nat_gateway" "nat_gateway_az1" {
  allocation_id = aws_eip.nat_gateway_eip_az1.id
  subnet_id     = aws_subnet.public_subnet_az1.id
  
  tags = {
    Name = "progressive-nat-gateway-az1"
  }
  
  depends_on = [aws_internet_gateway.progressive_igw]
}

resource "aws_nat_gateway" "nat_gateway_az2" {
  allocation_id = aws_eip.nat_gateway_eip_az2.id
  subnet_id     = aws_subnet.public_subnet_az2.id
  
  tags = {
    Name = "progressive-nat-gateway-az2"
  }
  
  depends_on = [aws_internet_gateway.progressive_igw]
}

# Route Tables
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.progressive_framework_vpc.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.progressive_igw.id
  }
  
  tags = {
    Name = "progressive-public-rt"
  }
}

resource "aws_route_table" "private_app_route_table_az1" {
  vpc_id = aws_vpc.progressive_framework_vpc.id
  
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gateway_az1.id
  }
  
  tags = {
    Name = "progressive-private-app-rt-az1"
  }
}

resource "aws_route_table" "private_app_route_table_az2" {
  vpc_id = aws_vpc.progressive_framework_vpc.id
  
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gateway_az2.id
  }
  
  tags = {
    Name = "progressive-private-app-rt-az2"
  }
}

# Database route table (no internet access)
resource "aws_route_table" "private_db_route_table" {
  vpc_id = aws_vpc.progressive_framework_vpc.id
  
  tags = {
    Name = "progressive-private-db-rt"
  }
}

# Route Table Associations
resource "aws_route_table_association" "public_subnet_az1_association" {
  subnet_id      = aws_subnet.public_subnet_az1.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "public_subnet_az2_association" {
  subnet_id      = aws_subnet.public_subnet_az2.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "private_app_subnet_az1_association" {
  subnet_id      = aws_subnet.private_app_subnet_az1.id
  route_table_id = aws_route_table.private_app_route_table_az1.id
}

resource "aws_route_table_association" "private_app_subnet_az2_association" {
  subnet_id      = aws_subnet.private_app_subnet_az2.id
  route_table_id = aws_route_table.private_app_route_table_az2.id
}

resource "aws_route_table_association" "private_db_subnet_az1_association" {
  subnet_id      = aws_subnet.private_db_subnet_az1.id
  route_table_id = aws_route_table.private_db_route_table.id
}

resource "aws_route_table_association" "private_db_subnet_az2_association" {
  subnet_id      = aws_subnet.private_db_subnet_az2.id
  route_table_id = aws_route_table.private_db_route_table.id
}
```

### **Azure Virtual Network Configuration**
```yaml
# terraform/azure/vnet.tf
resource "azurerm_resource_group" "progressive_framework_rg" {
  name     = "progressive-framework-v5-rg"
  location = var.azure_region
  
  tags = {
    Environment = var.environment
    Project     = "progressive-framework-v5"
  }
}

resource "azurerm_virtual_network" "progressive_framework_vnet" {
  name                = "progressive-framework-v5-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.progressive_framework_rg.location
  resource_group_name = azurerm_resource_group.progressive_framework_rg.name
  
  tags = {
    Environment = var.environment
    Project     = "progressive-framework-v5"
  }
}

# Public Subnet (DMZ)
resource "azurerm_subnet" "public_subnet" {
  name                 = "progressive-public-subnet"
  resource_group_name  = azurerm_resource_group.progressive_framework_rg.name
  virtual_network_name = azurerm_virtual_network.progressive_framework_vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

# Private Subnet - Application Layer
resource "azurerm_subnet" "private_app_subnet" {
  name                 = "progressive-app-subnet"
  resource_group_name  = azurerm_resource_group.progressive_framework_rg.name
  virtual_network_name = azurerm_virtual_network.progressive_framework_vnet.name
  address_prefixes     = ["10.0.10.0/24"]
}

# Private Subnet - Database Layer
resource "azurerm_subnet" "private_db_subnet" {
  name                 = "progressive-db-subnet"
  resource_group_name  = azurerm_resource_group.progressive_framework_rg.name
  virtual_network_name = azurerm_virtual_network.progressive_framework_vnet.name
  address_prefixes     = ["10.0.20.0/24"]
  
  service_endpoints = ["Microsoft.Sql", "Microsoft.Storage"]
}

# Network Security Groups
resource "azurerm_network_security_group" "public_nsg" {
  name                = "progressive-public-nsg"
  location            = azurerm_resource_group.progressive_framework_rg.location
  resource_group_name = azurerm_resource_group.progressive_framework_rg.name
  
  # Allow HTTP/HTTPS from internet
  security_rule {
    name                       = "allow-web-traffic"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_ranges    = ["80", "443"]
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  
  # Allow SSH for management (restrict source IP in production)
  security_rule {
    name                       = "allow-ssh"
    priority                   = 1002
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "10.0.0.0/16"  # Only from VNet
    destination_address_prefix = "*"
  }
}

resource "azurerm_network_security_group" "private_app_nsg" {
  name                = "progressive-app-nsg"
  location            = azurerm_resource_group.progressive_framework_rg.location
  resource_group_name = azurerm_resource_group.progressive_framework_rg.name
  
  # Allow traffic from public subnet
  security_rule {
    name                       = "allow-from-public"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "10.0.1.0/24"
    destination_address_prefix = "10.0.10.0/24"
  }
  
  # Allow internal app communication
  security_rule {
    name                       = "allow-internal-app"
    priority                   = 1002
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "10.0.10.0/24"
    destination_address_prefix = "10.0.10.0/24"
  }
}

resource "azurerm_network_security_group" "private_db_nsg" {
  name                = "progressive-db-nsg"
  location            = azurerm_resource_group.progressive_framework_rg.location
  resource_group_name = azurerm_resource_group.progressive_framework_rg.name
  
  # Allow database traffic only from app subnet
  security_rule {
    name                       = "allow-database-from-app"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_ranges    = ["5432", "6379", "27017"]
    source_address_prefix      = "10.0.10.0/24"
    destination_address_prefix = "10.0.20.0/24"
  }
  
  # Deny all other traffic
  security_rule {
    name                       = "deny-all"
    priority                   = 4096
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}
```

---

## **KUBERNETES NETWORK SECURITY**

### **Network Policies for Microsegmentation**
```yaml
# k8s/network-policies/default-deny.yml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: progressive-framework-prod
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress

---
# Allow ingress traffic
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress-to-app
  namespace: progressive-framework-prod
spec:
  podSelector:
    matchLabels:
      app: progressive-framework-v5
  policyTypes:
  - Ingress
  ingress:
  # Allow traffic from ingress controller
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 3000
  # Allow traffic from monitoring
  - from:
    - namespaceSelector:
        matchLabels:
          name: monitoring
    ports:
    - protocol: TCP
      port: 9090

---
# Agent communication network policy
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: agent-communication-policy
  namespace: progressive-framework-prod
spec:
  podSelector:
    matchLabels:
      tier: agents
  policyTypes:
  - Ingress
  - Egress
  ingress:
  # Allow communication from main application
  - from:
    - podSelector:
        matchLabels:
          app: progressive-framework-v5
    ports:
    - protocol: TCP
      port: 8000
  # Allow inter-agent communication
  - from:
    - podSelector:
        matchLabels:
          tier: agents
    ports:
    - protocol: TCP
      port: 8000
    - protocol: TCP
      port: 9000  # gRPC coordination port
  egress:
  # Allow outbound to databases
  - to: []
    ports:
    - protocol: TCP
      port: 5432  # PostgreSQL
    - protocol: TCP
      port: 6379  # Redis
    - protocol: TCP
      port: 27017 # MongoDB
  # Allow DNS resolution
  - to: []
    ports:
    - protocol: UDP
      port: 53
  # Allow inter-agent communication
  - to:
    - podSelector:
        matchLabels:
          tier: agents
    ports:
    - protocol: TCP
      port: 8000
    - protocol: TCP
      port: 9000

---
# Database access network policy
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: database-access-policy
  namespace: progressive-framework-prod
spec:
  podSelector:
    matchLabels:
      tier: database
  policyTypes:
  - Ingress
  ingress:
  # Only allow access from application and agents
  - from:
    - podSelector:
        matchLabels:
          app: progressive-framework-v5
    - podSelector:
        matchLabels:
          tier: agents
    ports:
    - protocol: TCP
      port: 5432
    - protocol: TCP
      port: 6379
    - protocol: TCP
      port: 27017
  # Allow monitoring access
  - from:
    - namespaceSelector:
        matchLabels:
          name: monitoring
    ports:
    - protocol: TCP
      port: 9187  # postgres-exporter
    - protocol: TCP
      port: 9121  # redis-exporter
    - protocol: TCP
      port: 9216  # mongodb-exporter
```

### **Service Mesh Security with Istio**
```yaml
# k8s/istio/security/peer-authentication.yml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: progressive-framework-prod
spec:
  mtls:
    mode: STRICT

---
# Namespace-wide mTLS policy
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: namespace-policy
  namespace: progressive-framework-prod
spec:
  mtls:
    mode: STRICT

---
# Authorization policy for application access
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: progressive-framework-authz
  namespace: progressive-framework-prod
spec:
  selector:
    matchLabels:
      app: progressive-framework-v5
  rules:
  # Allow authenticated requests from ingress
  - from:
    - source:
        principals: ["cluster.local/ns/istio-system/sa/istio-ingressgateway-service-account"]
  - to:
    - operation:
        methods: ["GET", "POST", "PUT", "DELETE"]
        paths: ["/api/*", "/health"]

---
# Agent authorization policy
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: agent-authorization-policy
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
        methods: ["GET", "POST"]
        paths: ["/api/v1/*", "/health"]
  
  # Allow MCA to coordinate with other agents
  - from:
    - source:
        principals: ["cluster.local/ns/progressive-framework-prod/sa/agent-sa"]
    when:
    - key: source.labels[app]
      values: ["mca"]
  - to:
    - operation:
        methods: ["GET", "POST"]
        paths: ["/api/v1/coordination/*", "/health"]
  
  # Allow inter-agent communication for specific use cases
  - from:
    - source:
        principals: ["cluster.local/ns/progressive-framework-prod/sa/agent-sa"]
    when:
    - key: source.labels[tier]
      values: ["agents"]
  - to:
    - operation:
        methods: ["POST"]
        paths: ["/api/v1/collaborate/*"]

---
# Request authentication for external traffic
apiVersion: security.istio.io/v1beta1
kind: RequestAuthentication
metadata:
  name: progressive-jwt-auth
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
    fromHeaders:
    - name: Authorization
      prefix: "Bearer "
    fromParams:
    - "access_token"
```

---

## **FIREWALL CONFIGURATIONS**

### **AWS Security Groups**
```yaml
# terraform/aws/security-groups.tf
# Web Application Firewall Security Group
resource "aws_security_group" "web_sg" {
  name        = "progressive-web-sg"
  description = "Security group for web tier"
  vpc_id      = aws_vpc.progressive_framework_vpc.id
  
  # Ingress rules
  ingress {
    description = "HTTPS from internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Health check from ALB
  ingress {
    description     = "Health check from ALB"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }
  
  # Egress rules
  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "progressive-web-sg"
    Tier = "web"
  }
}

# Application Load Balancer Security Group
resource "aws_security_group" "alb_sg" {
  name        = "progressive-alb-sg"
  description = "Security group for Application Load Balancer"
  vpc_id      = aws_vpc.progressive_framework_vpc.id
  
  ingress {
    description = "HTTPS from internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    description     = "To application instances"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.web_sg.id]
  }
  
  tags = {
    Name = "progressive-alb-sg"
    Tier = "load-balancer"
  }
}

# Application Security Group
resource "aws_security_group" "app_sg" {
  name        = "progressive-app-sg"
  description = "Security group for application tier"
  vpc_id      = aws_vpc.progressive_framework_vpc.id
  
  # Allow traffic from web tier
  ingress {
    description     = "From web tier"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.web_sg.id]
  }
  
  # Allow inter-service communication (for agents)
  ingress {
    description = "Inter-service communication"
    from_port   = 8000
    to_port     = 9000
    protocol    = "tcp"
    self        = true
  }
  
  # SSH access from bastion (if needed)
  ingress {
    description     = "SSH from bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }
  
  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "progressive-app-sg"
    Tier = "application"
  }
}

# Database Security Group
resource "aws_security_group" "db_sg" {
  name        = "progressive-db-sg"
  description = "Security group for database tier"
  vpc_id      = aws_vpc.progressive_framework_vpc.id
  
  # PostgreSQL
  ingress {
    description     = "PostgreSQL from application"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }
  
  # Redis
  ingress {
    description     = "Redis from application"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }
  
  # MongoDB
  ingress {
    description     = "MongoDB from application"
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }
  
  # No outbound internet access for databases
  egress {
    description = "Internal VPC only"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [aws_vpc.progressive_framework_vpc.cidr_block]
  }
  
  tags = {
    Name = "progressive-db-sg"
    Tier = "database"
  }
}

# Bastion Host Security Group
resource "aws_security_group" "bastion_sg" {
  name        = "progressive-bastion-sg"
  description = "Security group for bastion host"
  vpc_id      = aws_vpc.progressive_framework_vpc.id
  
  ingress {
    description = "SSH from authorized IPs"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.authorized_ssh_cidrs  # Define in variables
  }
  
  egress {
    description = "SSH to private instances"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.progressive_framework_vpc.cidr_block]
  }
  
  tags = {
    Name = "progressive-bastion-sg"
    Tier = "management"
  }
}
```

### **iptables Rules for Additional Security**
```bash
#!/bin/bash
# scripts/setup-iptables.sh

echo "🔥 Configuring iptables for Progressive-Framework-v5..."

# Flush existing rules
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X

# Set default policies
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback
iptables -I INPUT -i lo -j ACCEPT

# Allow established and related connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow SSH (restrict to specific IPs in production)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP and HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow application ports (from load balancer only)
iptables -A INPUT -p tcp --dport 3000 -s 10.0.1.0/24 -j ACCEPT

# Allow agent communication (internal subnet only)
iptables -A INPUT -p tcp --dport 8000:9000 -s 10.0.10.0/24 -j ACCEPT

# Allow database ports (from app subnet only)
iptables -A INPUT -p tcp --dport 5432 -s 10.0.10.0/24 -j ACCEPT  # PostgreSQL
iptables -A INPUT -p tcp --dport 6379 -s 10.0.10.0/24 -j ACCEPT  # Redis
iptables -A INPUT -p tcp --dport 27017 -s 10.0.10.0/24 -j ACCEPT # MongoDB

# Allow monitoring ports (from monitoring subnet)
iptables -A INPUT -p tcp --dport 9090 -s 10.0.30.0/24 -j ACCEPT # Prometheus
iptables -A INPUT -p tcp --dport 3000 -s 10.0.30.0/24 -j ACCEPT # Grafana

# Rate limiting for SSH (prevent brute force)
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set --name ssh
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 --name ssh -j DROP

# Rate limiting for web traffic
iptables -A INPUT -p tcp --dport 80 -m limit --limit 100/minute --limit-burst 200 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -m limit --limit 100/minute --limit-burst 200 -j ACCEPT

# Log dropped packets (for debugging)
iptables -A INPUT -j LOG --log-prefix "DROPPED: " --log-level 4
iptables -A INPUT -j DROP

# Save rules
iptables-save > /etc/iptables/rules.v4

echo "✅ iptables configuration completed"

# Create systemd service to restore rules on boot
cat > /etc/systemd/system/iptables-restore.service << 'EOF'
[Unit]
Description=Restore iptables rules
After=network.target

[Service]
Type=oneshot
ExecStart=/sbin/iptables-restore /etc/iptables/rules.v4
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

systemctl enable iptables-restore.service
echo "✅ iptables-restore service enabled"
```

---

## **VPN & SECURE ACCESS**

### **WireGuard VPN Setup**
```bash
#!/bin/bash
# scripts/setup-wireguard-vpn.sh

echo "🔐 Setting up WireGuard VPN for secure access..."

# Install WireGuard
apt update
apt install -y wireguard wireguard-tools

# Generate server keys
wg genkey | tee /etc/wireguard/server-private.key | wg pubkey > /etc/wireguard/server-public.key

# Set secure permissions
chmod 600 /etc/wireguard/server-private.key

# Create server configuration
SERVER_PRIVATE_KEY=$(cat /etc/wireguard/server-private.key)
SERVER_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

cat > /etc/wireguard/wg0.conf << EOF
[Interface]
Address = 10.100.0.1/24
PrivateKey = $SERVER_PRIVATE_KEY
ListenPort = 51820
SaveConfig = true

# Enable IP forwarding and NAT
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Admin user peer
[Peer]
PublicKey = CLIENT_PUBLIC_KEY_PLACEHOLDER
AllowedIPs = 10.100.0.10/32

# Developer peer
[Peer]
PublicKey = DEV_CLIENT_PUBLIC_KEY_PLACEHOLDER
AllowedIPs = 10.100.0.11/32
EOF

# Enable IP forwarding
echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
sysctl -p

# Start WireGuard
systemctl enable wg-quick@wg0
systemctl start wg-quick@wg0

# Open firewall port
ufw allow 51820/udp

echo "🔐 WireGuard VPN server setup completed"
echo "Server public key: $(cat /etc/wireguard/server-public.key)"
echo "Server endpoint: $SERVER_PUBLIC_IP:51820"

# Generate client configuration template
cat > /tmp/client-template.conf << EOF
[Interface]
Address = 10.100.0.CLIENT_ID/24
PrivateKey = CLIENT_PRIVATE_KEY
DNS = 10.0.0.2  # VPC DNS

[Peer]
PublicKey = $(cat /etc/wireguard/server-public.key)
Endpoint = $SERVER_PUBLIC_IP:51820
AllowedIPs = 10.0.0.0/16  # Allow access to VPC
PersistentKeepalive = 25
EOF

echo "📋 Client configuration template created at /tmp/client-template.conf"
```

### **Bastion Host Configuration**
```yaml
# terraform/aws/bastion.tf
resource "aws_instance" "bastion" {
  ami                    = var.amazon_linux_ami
  instance_type          = "t3.micro"
  key_name              = var.key_pair_name
  subnet_id             = aws_subnet.public_subnet_az1.id
  vpc_security_group_ids = [aws_security_group.bastion_sg.id]
  
  # Enable detailed monitoring
  monitoring = true
  
  # User data script for initial setup
  user_data = base64encode(templatefile("${path.module}/scripts/bastion-setup.sh", {
    authorized_users = var.authorized_ssh_users
  }))
  
  tags = {
    Name = "progressive-framework-v5-bastion"
    Type = "bastion"
    Environment = var.environment
  }
}

# Elastic IP for bastion
resource "aws_eip" "bastion_eip" {
  instance = aws_instance.bastion.id
  domain   = "vpc"
  
  tags = {
    Name = "progressive-bastion-eip"
  }
}

# CloudWatch log group for bastion logs
resource "aws_cloudwatch_log_group" "bastion_logs" {
  name              = "/aws/ec2/bastion"
  retention_in_days = 30
  
  tags = {
    Environment = var.environment
    Service     = "bastion"
  }
}
```

### **Bastion Setup Script**
```bash
#!/bin/bash
# scripts/bastion-setup.sh

echo "🏰 Setting up bastion host for Progressive-Framework-v5..."

# Update system
yum update -y

# Install required packages
yum install -y \
  fail2ban \
  awscli \
  kubectl \
  postgresql-client \
  redis-tools \
  mongodb-tools \
  htop \
  vim \
  git \
  curl \
  wget

# Configure fail2ban for SSH protection
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF

systemctl enable fail2ban
systemctl start fail2ban

# Configure SSH for security
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config

# Add security banner
cat > /etc/ssh/banner << 'EOF'
WARNING: Authorized access only. All activity is monitored and logged.
Unauthorized access is strictly prohibited and will be prosecuted.
EOF

echo "Banner /etc/ssh/banner" >> /etc/ssh/sshd_config

# Restart SSH service
systemctl restart sshd

# Install kubectl and configure for EKS
curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.27.1/2023-04-19/bin/linux/amd64/kubectl
chmod +x kubectl
mv kubectl /usr/local/bin/

# Configure AWS CLI and kubectl (will be done by user)
cat > /home/ec2-user/.bashrc << 'EOF'
# Progressive Framework V5 Bastion Configuration
export PATH=$PATH:/usr/local/bin

# Aliases for common operations
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'

# Progressive Framework specific aliases
alias pf-pods='kubectl get pods -n progressive-framework-prod'
alias pf-logs='kubectl logs -n progressive-framework-prod'
alias pf-agents='kubectl get pods -l tier=agents -n progressive-framework-prod'

# Database connection helpers
alias pg-prod='psql -h progressive-db-prod.cluster-xxx.us-east-1.rds.amazonaws.com -U progressive_user -d progressive_framework_v5'
alias redis-prod='redis-cli -h progressive-redis-prod.xxx.cache.amazonaws.com -p 6379'

echo "🏰 Progressive-Framework-v5 Bastion Host"
echo "Environment: ${ENVIRONMENT}"
echo "Access Level: Administrative"
echo ""
echo "Available commands:"
echo "  pf-pods     - List Progressive Framework pods"
echo "  pf-logs     - View Progressive Framework logs"  
echo "  pf-agents   - List context agent pods"
echo "  pg-prod     - Connect to production PostgreSQL"
echo "  redis-prod  - Connect to production Redis"
echo ""
EOF

# Set up CloudWatch logs agent
yum install -y awslogs

cat > /etc/awslogs/awslogs.conf << EOF
[general]
state_file = /var/lib/awslogs/agent-state

[/var/log/messages]
datetime_format = %b %d %H:%M:%S
file = /var/log/messages
buffer_duration = 5000
log_stream_name = {instance_id}
initial_position = start_of_file
log_group_name = /aws/ec2/bastion

[/var/log/secure]
datetime_format = %b %d %H:%M:%S
file = /var/log/secure
buffer_duration = 5000
log_stream_name = {instance_id}-secure
initial_position = start_of_file
log_group_name = /aws/ec2/bastion
EOF

systemctl enable awslogs
systemctl start awslogs

# Create login banner with system info
cat > /etc/motd << 'EOF'
   ____                                     _           
  |  _ \ _ __ ___   __ _ _ __ ___  ___ ___(_)_   _____  
  | |_) | '__/ _ \ / _` | '__/ _ \/ __/ __| \ \ / / _ \ 
  |  __/| | | (_) | (_| | | |  __/\__ \__ \ |\ V /  __/ 
  |_|   |_|  \___/ \__, |_|  \___||___/___/_| \_/ \___| 
                   |___/                               
  Framework v5 - Bastion Host
  
  🏰 Secure Access Gateway
  📊 Administrative Access Only
  🔒 All activity is monitored
  
EOF

echo "✅ Bastion host setup completed"
```

---

## **SSL/TLS CONFIGURATION**

### **Certificate Management with Let's Encrypt**
```yaml
# k8s/ssl/cert-manager.yml
apiVersion: v1
kind: Namespace
metadata:
  name: cert-manager

---
# Install cert-manager via Helm
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: cert-manager
  namespace: cert-manager
spec:
  chart: cert-manager
  repo: https://charts.jetstack.io
  targetNamespace: cert-manager
  valuesContent: |-
    installCRDs: true
    global:
      leaderElection:
        namespace: cert-manager

---
# ClusterIssuer for Let's Encrypt production
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@your-domain.com
    privateKeySecretRef:
      name: letsencrypt-prod-private-key
    solvers:
    - http01:
        ingress:
          class: nginx
    - dns01:
        route53:
          region: us-east-1
          accessKeyID: AKIA...
          secretAccessKeySecretRef:
            name: route53-credentials
            key: secret-access-key

---
# ClusterIssuer for Let's Encrypt staging
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: admin@your-domain.com
    privateKeySecretRef:
      name: letsencrypt-staging-private-key
    solvers:
    - http01:
        ingress:
          class: nginx

---
# Certificate for main application
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: progressive-framework-tls
  namespace: progressive-framework-prod
spec:
  secretName: progressive-framework-tls-secret
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - your-domain.com
  - api.your-domain.com
  - agents.your-domain.com
  - admin.your-domain.com

---
# Certificate for wildcard subdomain
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: progressive-framework-wildcard
  namespace: progressive-framework-prod
spec:
  secretName: progressive-framework-wildcard-secret
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - "*.your-domain.com"
  usages:
  - digital signature
  - key encipherment
```

### **NGINX SSL Configuration**
```nginx
# nginx/conf.d/ssl.conf
# SSL configuration for Progressive-Framework-v5

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com api.your-domain.com agents.your-domain.com;
    
    # Let's Encrypt ACME challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect everything else to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Main application HTTPS server
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL certificates
    ssl_certificate /etc/ssl/certs/your-domain.com.crt;
    ssl_certificate_key /etc/ssl/private/your-domain.com.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # SSL optimization
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "no-referrer-when-downgrade";
    
    # Main application proxy
    location / {
        proxy_pass http://progressive-framework-v5-service:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# API server HTTPS
server {
    listen 443 ssl http2;
    server_name api.your-domain.com;
    
    # SSL certificates (same as above)
    ssl_certificate /etc/ssl/certs/your-domain.com.crt;
    ssl_certificate_key /etc/ssl/private/your-domain.com.key;
    
    # SSL configuration (same as above)
    include /etc/nginx/conf.d/ssl-params.conf;
    
    # Rate limiting for API
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=20 nodelay;
    
    # API proxy with enhanced security
    location /api/v1/ {
        proxy_pass http://progressive-framework-v5-service:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Enhanced security for API
        proxy_hide_header X-Powered-By;
        proxy_hide_header Server;
        
        # CORS headers for API
        add_header Access-Control-Allow-Origin "https://your-domain.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        add_header Access-Control-Max-Age 86400;
    }
}

# Agents API server HTTPS
server {
    listen 443 ssl http2;
    server_name agents.your-domain.com;
    
    # SSL certificates
    ssl_certificate /etc/ssl/certs/your-domain.com.crt;
    ssl_certificate_key /etc/ssl/private/your-domain.com.key;
    
    # SSL configuration
    include /etc/nginx/conf.d/ssl-params.conf;
    
    # Rate limiting for agents (more permissive)
    limit_req_zone $binary_remote_addr zone=agents_limit:10m rate=200r/m;
    limit_req zone=agents_limit burst=50 nodelay;
    
    # MCA endpoint
    location /api/v1/agents/mca/ {
        proxy_pass http://mca-service:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Extended timeout for coordination operations
        proxy_connect_timeout 90s;
        proxy_send_timeout 90s;
        proxy_read_timeout 90s;
    }
    
    # NPA endpoint
    location /api/v1/agents/npa/ {
        proxy_pass http://npa-service:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout for nutrition planning
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # WPA endpoint
    location /api/v1/agents/wpa/ {
        proxy_pass http://wpa-service:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout for workout planning
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

---

## **NETWORK MONITORING & SECURITY**

### **Network Monitoring Stack**
```yaml
# k8s/monitoring/network-monitoring.yml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: network-monitor
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: network-monitor
  template:
    metadata:
      labels:
        app: network-monitor
    spec:
      hostNetwork: true
      hostPID: true
      containers:
      - name: node-exporter
        image: prom/node-exporter:v1.6.0
        args:
        - --path.procfs=/host/proc
        - --path.sysfs=/host/sys
        - --collector.filesystem.ignored-mount-points
        - ^/(sys|proc|dev|host|etc|rootfs/var/lib/docker/containers|rootfs/var/lib/docker/overlay2|rootfs/run/docker/netns|rootfs/var/lib/docker/aufs)($$|/)
        ports:
        - name: metrics
          containerPort: 9100
        volumeMounts:
        - name: proc
          mountPath: /host/proc
          readOnly: true
        - name: sys
          mountPath: /host/sys
          readOnly: true
        - name: root
          mountPath: /rootfs
          readOnly: true
      
      # Network traffic monitoring
      - name: netdata
        image: netdata/netdata:v1.40.1
        ports:
        - name: http
          containerPort: 19999
        env:
        - name: PGID
          value: "0"
        cap_add:
        - SYS_PTRACE
        security_context:
          capabilities:
            add:
            - SYS_PTRACE
        volumeMounts:
        - name: proc
          mountPath: /host/proc
          readOnly: true
        - name: sys
          mountPath: /host/sys
          readOnly: true
        - name: var-run
          mountPath: /var/run/docker.sock
          readOnly: true
      
      volumes:
      - name: proc
        hostPath:
          path: /proc
      - name: sys
        hostPath:
          path: /sys
      - name: root
        hostPath:
          path: /
      - name: var-run
        hostPath:
          path: /var/run/docker.sock

---
# Network policy monitoring
apiVersion: apps/v1
kind: Deployment
metadata:
  name: falco
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: falco
  template:
    metadata:
      labels:
        app: falco
    spec:
      serviceAccount: falco
      hostNetwork: true
      dnsPolicy: ClusterFirstWithHostNet
      containers:
      - name: falco
        image: falcosecurity/falco-no-driver:0.35.1
        args:
        - /usr/bin/falco
        - --cri=/run/containerd/containerd.sock
        - --k8s-api=https://kubernetes.default.svc.cluster.local
        - --k8s-api-cert=/var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        - --k8s-api-token-file=/var/run/secrets/kubernetes.io/serviceaccount/token
        - -M 45
        - --disable-source=k8s_audit
        env:
        - name: FALCO_K8S_NODE_NAME
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
        volumeMounts:
        - name: containerd-socket
          mountPath: /run/containerd/containerd.sock
        - name: falco-config
          mountPath: /etc/falco
      volumes:
      - name: containerd-socket
        hostPath:
          path: /run/containerd/containerd.sock
      - name: falco-config
        configMap:
          name: falco-config

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: falco-config
  namespace: monitoring
data:
  falco.yaml: |
    rules_file:
      - /etc/falco/falco_rules.yaml
      - /etc/falco/falco_rules.local.yaml
      - /etc/falco/k8s_audit_rules.yaml
      - /etc/falco/rules.d
    
    json_output: true
    json_include_output_property: true
    
    priority: debug
    
    outputs:
      rate: 1
      max_burst: 1000
    
    syslog_output:
      enabled: false
    
    file_output:
      enabled: false
    
    stdout_output:
      enabled: true
    
    webserver:
      enabled: true
      listen_port: 8765
      k8s_healthz_endpoint: /healthz
    
    http_output:
      enabled: true
      url: http://falco-webhook:8080/webhook
```

---

## **INCIDENT RESPONSE & NETWORK SECURITY**

### **Automated Security Response**
```bash
#!/bin/bash
# scripts/network-security-incident-response.sh

INCIDENT_TYPE=$1
SOURCE_IP=$2
SEVERITY=$3

echo "🚨 Network Security Incident Response Activated"
echo "Incident Type: $INCIDENT_TYPE"
echo "Source IP: $SOURCE_IP" 
echo "Severity: $SEVERITY"
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

case $INCIDENT_TYPE in
  "brute_force_attack")
    echo "🔒 Responding to brute force attack from $SOURCE_IP"
    
    # Block source IP immediately
    iptables -I INPUT -s $SOURCE_IP -j DROP
    
    # Add to fail2ban permanent ban list
    fail2ban-client set sshd banip $SOURCE_IP
    
    # Update AWS Security Group to block IP
    aws ec2 authorize-security-group-ingress \
      --group-id sg-xxxxxxxxx \
      --protocol tcp \
      --port 22 \
      --source-group $SOURCE_IP/32 \
      --rule-action deny
    
    # Alert security team
    curl -X POST $SECURITY_WEBHOOK \
      -H 'Content-type: application/json' \
      -d "{
        \"text\": \"🚨 BRUTE FORCE ATTACK BLOCKED\",
        \"attachments\": [{
          \"color\": \"danger\",
          \"fields\": [{
            \"title\": \"Source IP\",
            \"value\": \"$SOURCE_IP\",
            \"short\": true
          }, {
            \"title\": \"Action Taken\", 
            \"value\": \"IP blocked via iptables and AWS SG\",
            \"short\": true
          }]
        }]
      }"
    ;;
    
  "ddos_attack")
    echo "🛡️ Responding to DDoS attack"
    
    # Activate rate limiting
    iptables -A INPUT -p tcp --dport 80 -m limit --limit 10/minute --limit-burst 25 -j ACCEPT
    iptables -A INPUT -p tcp --dport 443 -m limit --limit 10/minute --limit-burst 25 -j ACCEPT
    
    # Enable CloudFlare "Under Attack" mode (if using CloudFlare)
    curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/security_level" \
      -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
      -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
      -H "Content-Type: application/json" \
      --data '{"value":"under_attack"}'
    
    # Scale up application instances
    kubectl scale deployment progressive-framework-v5 --replicas=10 -n progressive-framework-prod
    
    echo "✅ DDoS mitigation activated"
    ;;
    
  "suspicious_agent_communication")
    echo "🤖 Investigating suspicious agent communication"
    
    # Isolate affected agent pods
    kubectl label pods -l tier=agents suspicious=true -n progressive-framework-prod
    
    # Apply restrictive network policy
    kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: suspicious-agent-isolation
  namespace: progressive-framework-prod
spec:
  podSelector:
    matchLabels:
      suspicious: "true"
  policyTypes:
  - Ingress
  - Egress
  ingress: []
  egress: []
EOF
    
    # Collect forensic data
    kubectl logs -l tier=agents --tail=1000 -n progressive-framework-prod > /tmp/agent-logs-$(date +%s).txt
    
    echo "🔍 Suspicious agents isolated for investigation"
    ;;
    
  "unauthorized_database_access")
    echo "🗄️ Responding to unauthorized database access attempt"
    
    # Rotate database credentials immediately
    kubectl create job rotate-db-creds --from=cronjob/db-credential-rotation -n progressive-framework-prod
    
    # Enable database query logging
    kubectl exec statefulset/postgres -n progressive-framework-prod -- \
      psql -c "ALTER SYSTEM SET log_statement = 'all';"
    
    # Restart database to apply logging
    kubectl rollout restart statefulset/postgres -n progressive-framework-prod
    
    # Alert DBA team
    curl -X POST $DBA_WEBHOOK \
      -H 'Content-type: application/json' \
      -d "{\"text\": \"⚠️ Unauthorized database access detected. Credentials rotated and logging enabled.\"}"
    
    echo "🔐 Database security measures activated"
    ;;
esac

# Log incident to security log
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) | $INCIDENT_TYPE | $SOURCE_IP | $SEVERITY | AUTO_RESPONSE_COMPLETED" >> /var/log/security-incidents.log

# Create Kubernetes event for tracking
kubectl create event security-incident-$INCIDENT_TYPE \
  --type=Warning \
  --reason=SecurityIncident \
  --message="$INCIDENT_TYPE from $SOURCE_IP - automated response completed" \
  --namespace=progressive-framework-prod

echo "✅ Network security incident response completed"
```

---

## **TROUBLESHOOTING**

### **Network Connectivity Issues**
```bash
#!/bin/bash
# scripts/network-troubleshooting.sh

echo "🔍 Network Troubleshooting for Progressive-Framework-v5"

# Test basic connectivity
echo "=== Basic Connectivity Tests ==="
ping -c 3 8.8.8.8
ping -c 3 google.com

# Test DNS resolution
echo "=== DNS Resolution Tests ==="
nslookup your-domain.com
dig your-domain.com

# Test application endpoints
echo "=== Application Endpoint Tests ==="
curl -I https://your-domain.com/health
curl -I https://api.your-domain.com/health
curl -I https://agents.your-domain.com/health

# Test internal services
echo "=== Internal Service Tests ==="
kubectl run test-pod --rm -i --restart=Never --image=curlimages/curl -- \
  curl -v progressive-framework-v5-service.progressive-framework-prod.svc.cluster.local/health

kubectl run test-agent-pod --rm -i --restart=Never --image=curlimages/curl -- \
  curl -v mca-service.progressive-framework-prod.svc.cluster.local/health

# Test database connectivity
echo "=== Database Connectivity Tests ==="
kubectl exec -it statefulset/postgres -n progressive-framework-prod -- \
  psql -c "SELECT version();"

kubectl exec -it deployment/redis -n progressive-framework-prod -- \
  redis-cli ping

# Test agent communication
echo "=== Agent Communication Tests ==="
MCA_POD=$(kubectl get pods -l app=mca -n progressive-framework-prod -o jsonpath='{.items[0].metadata.name}')
kubectl exec $MCA_POD -n progressive-framework-prod -- \
  curl -s http://npa-service:80/health

# Check network policies
echo "=== Network Policy Status ==="
kubectl get networkpolicies -n progressive-framework-prod

# Check service endpoints
echo "=== Service Endpoint Status ==="
kubectl get endpoints -n progressive-framework-prod

# Check ingress status
echo "=== Ingress Status ==="
kubectl get ingress -n progressive-framework-prod
kubectl describe ingress progressive-framework-ingress -n progressive-framework-prod

echo "🔍 Network troubleshooting completed"
```

### **SSL/TLS Certificate Issues**
```bash
#!/bin/bash
# scripts/ssl-troubleshooting.sh

echo "🔒 SSL/TLS Certificate Troubleshooting"

# Check certificate status
echo "=== Certificate Status ==="
kubectl get certificates -n progressive-framework-prod

# Check certificate issuer status
echo "=== Certificate Issuer Status ==="
kubectl get clusterissuers

# Test SSL certificate validity
echo "=== SSL Certificate Validation ==="
echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | \
  openssl x509 -noout -dates

# Check cert-manager logs
echo "=== Cert-Manager Logs ==="
kubectl logs -n cert-manager deployment/cert-manager --tail=50

# Verify ACME challenge
echo "=== ACME Challenge Test ==="
curl -I http://your-domain.com/.well-known/acme-challenge/test

echo "🔒 SSL troubleshooting completed"
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Security Overview](../04-Security/Security-Overview.md)** - Security requirements and policies
- **[Load Balancing & Resource Management](Load-Balancing-Resource-Management.md)** - Load balancing strategies

### **Follow-up Documents**
- **[Scaling & Performance Optimization](Scaling-Performance-Optimization.md)** - Performance and scaling strategies
- **[Disaster Recovery & Backup](Disaster-Recovery-Backup.md)** - Business continuity planning

### **Operations Context**
- **[Container Orchestration](../05-DevOps/Container-Orchestration.md)** - Kubernetes networking
- **[Monitoring & Alerting](../05-DevOps/Monitoring-Alerting.md)** - Network monitoring integration

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | Infrastructure Team | Complete network architecture and security implementation |
| 4.x | 2025-08-xx | Network Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-10-02  
**Document Owner**: Infrastructure Team  
**Last Validated**: 2025-09-02