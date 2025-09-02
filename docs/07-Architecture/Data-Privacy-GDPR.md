---
file: docs/07-Compliance/Data-Privacy-GDPR.md
directory: docs/07-Compliance/
priority: CRITICAL
version: 5.0
last_updated: 2025-09-02
status: PRODUCTION_READY
---

# Data Privacy & GDPR Compliance - Progressive-Framework-v5

**File Path**: `docs/07-Compliance/Data-Privacy-GDPR.md`  
**Directory**: `docs/07-Compliance/`  
**Priority**: CRITICAL  
**Version**: 5.0  
**Last Updated**: 2025-09-02  
**Status**: PRODUCTION_READY

---

## **OVERVIEW**

Complete GDPR compliance implementation for Progressive-Framework-v5, covering data protection principles, lawful basis for processing, data subject rights, consent management, privacy by design, international transfers, and breach notification procedures for health and fitness data processing.

### **Prerequisites (Read First)**
- 📊 **[System Overview](../01-Core-System/System-Overview.md)** - *System architecture foundation*
- 🛡️ **[Security Overview](../04-Security/Security-Overview.md)** - *Security framework and controls*
- 📋 **[Compliance Documentation](Compliance-Documentation.md)** - *Overall compliance framework*
- 📝 **[Audit Trail Logging](Audit-Trail-Logging.md)** - *GDPR audit logging requirements*
- 🔒 **[Data Encryption](../04-Security/Data-Encryption.md)** - *Data protection technical measures*

---

## **GDPR COMPLIANCE FRAMEWORK**

### **Data Protection Principles Implementation**
```
GDPR Article 5 - Principles of Data Processing:

┌─────────────────────────────────────────────────────────────────────┐
│                    LAWFULNESS, FAIRNESS & TRANSPARENCY             │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   LAWFUL    │  │    FAIR     │  │ TRANSPARENT │  │  INFORMED   │ │
│  │   BASIS     │  │ PROCESSING  │  │    NOTICE   │  │   CONSENT   │ │
│  │             │  │             │  │             │  │             │ │
│  │ • Consent   │  │ • Balanced  │  │ • Privacy   │  │ • Clear     │ │
│  │ • Contract  │  │ • Justified │  │   Policy    │  │ • Specific  │ │
│  │ • Legal     │  │ • Ethical   │  │ • Data Use  │  │ • Granular  │ │
│  │ • Vital     │  │ • Necessary │  │   Notice    │  │ • Revocable │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                      PURPOSE LIMITATION                            │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  SPECIFIC   │  │  EXPLICIT   │  │ LEGITIMATE  │  │ COMPATIBLE  │ │
│  │  PURPOSES   │  │   STATED    │  │  PURPOSES   │  │   FURTHER   │ │
│  │             │  │             │  │             │  │ PROCESSING  │ │
│  │ • Fitness   │  │ • Clearly   │  │ • Health    │  │ • Research  │ │
│  │   Goals     │  │   Defined   │  │   Improve-  │  │ • Statistics│ │
│  │ • Nutrition │  │ • Specific  │  │   ment      │  │ • Archive   │ │
│  │   Planning  │  │ • Bounded   │  │ • Service   │  │ • Compat-   │ │
│  │             │  │             │  │   Delivery  │  │   ibility   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                     DATA MINIMISATION                              │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  ADEQUATE   │  │  RELEVANT   │  │   LIMITED   │  │ NECESSARY   │ │
│  │             │  │             │  │             │  │             │ │
│  │ • Sufficient│  │ • Related   │  │ • Minimum   │  │ • Required  │ │
│  │   for       │  │   to        │  │   Required  │  │   for       │ │
│  │   Purpose   │  │   Purpose   │  │ • No Excess │  │   Purpose   │ │
│  │ • Complete  │  │ • Targeted  │  │ • Focused   │  │ • Justified │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                        ACCURACY                                    │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   ACCURATE  │  │ UP-TO-DATE  │  │ CORRECTION  │  │  ERASURE    │ │
│  │             │  │             │  │             │  │             │ │
│  │ • Correct   │  │ • Current   │  │ • Rectify   │  │ • Remove    │ │
│  │ • Verified  │  │ • Fresh     │  │   Errors    │  │   Inaccurate│ │
│  │ • Validated │  │ • Recent    │  │ • Update    │  │ • Delete    │ │
│  │ • Quality   │  │ • Relevant  │  │   Changes   │  │   Outdated  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                    STORAGE LIMITATION                              │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ RETENTION   │  │  DELETION   │  │  ARCHIVAL   │  │ PSEUDONYM-  │ │
│  │   POLICY    │  │ SCHEDULE    │  │ STRATEGY    │  │  ISATION    │ │
│  │             │  │             │  │             │  │             │ │
│  │ • Time      │  │ • Auto      │  │ • Long-term │  │ • Research  │ │
│  │   Limits    │  │   Delete    │  │   Storage   │  │   Purpose   │ │
│  │ • Purpose   │  │ • Secure    │  │ • Statistical│ │ • Historical│ │
│  │   Based     │  │   Erasure   │  │   Purpose   │  │   Analysis  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│               INTEGRITY & CONFIDENTIALITY                          │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ ENCRYPTION  │  │   ACCESS    │  │  INTEGRITY  │  │ RESILIENCE  │ │
│  │             │  │  CONTROL    │  │   CHECKS    │  │             │ │
│  │ • At Rest   │  │ • RBAC      │  │ • Checksums │  │ • Backup    │ │
│  │ • In Transit│  │ • MFA       │  │ • Audit     │  │ • Recovery  │ │
│  │ • Processing│  │ • Least     │  │ • Monitor   │  │ • Redundancy│ │
│  │ • Key Mgmt  │  │   Privilege │  │ • Validate  │  │ • Testing   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                     ACCOUNTABILITY                                 │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ DEMONSTRATE │  │   RECORD    │  │   AUDIT     │  │    DPIA     │ │
│  │ COMPLIANCE  │  │ PROCESSING  │  │    TRAIL    │  │             │ │
│  │             │  │             │  │             │  │ • Risk      │ │
│  │ • Policies  │  │ • Article   │  │ • All       │  │   Assess    │ │
│  │ • Procedures│  │   30 Record │  │   Actions   │  │ • Impact    │ │
│  │ • Evidence  │  │ • Purposes  │  │ • Changes   │  │ • Mitigation│ │
│  │ • Training  │  │ • Legal     │  │ • Access    │  │ • Review    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### **Lawful Basis for Processing Matrix**
```yaml
# Lawful Basis Implementation (GDPR Article 6)
lawful_basis_matrix:
  progressive_framework_v5:
    
    # User Account Management
    user_accounts:
      data_categories: [name, email, password_hash, account_preferences]
      lawful_basis: "Article 6(1)(b) - Contract"
      description: "Processing necessary for account creation and management"
      retention_period: "Account active + 12 months after deletion request"
      
    # Health and Fitness Data
    health_fitness_data:
      data_categories: [fitness_goals, health_metrics, workout_data, progress_tracking]
      lawful_basis: "Article 6(1)(a) - Consent"
      description: "Processing for personalized fitness and health services"
      consent_required: true
      granular_consent: true
      withdrawal_mechanism: "User dashboard settings"
      retention_period: "Active consent + 24 months after withdrawal"
      
    # Nutrition Data
    nutrition_data:
      data_categories: [dietary_preferences, meal_plans, nutritional_tracking, food_logs]
      lawful_basis: "Article 6(1)(a) - Consent"
      description: "Processing for personalized nutrition services"
      consent_required: true
      granular_consent: true
      withdrawal_mechanism: "User dashboard settings"
      retention_period: "Active consent + 24 months after withdrawal"
      
    # Medical Information
    medical_information:
      data_categories: [medical_conditions, allergies, medications, health_restrictions]
      lawful_basis: "Article 6(1)(a) - Consent + Article 9(2)(a) - Explicit Consent"
      description: "Processing special category health data for service customization"
      explicit_consent_required: true
      high_protection_measures: true
      dpo_review_required: true
      retention_period: "Explicit consent active + 36 months after withdrawal"
      
    # Service Analytics
    service_analytics:
      data_categories: [usage_patterns, performance_metrics, feature_utilization, error_logs]
      lawful_basis: "Article 6(1)(f) - Legitimate Interests"
      description: "Service improvement and optimization"
      legitimate_interest_assessment: true
      balancing_test_completed: true
      opt_out_mechanism: "Privacy settings"
      retention_period: "24 months from collection"
      
    # Customer Support
    customer_support:
      data_categories: [support_requests, communication_logs, issue_resolution_data]
      lawful_basis: "Article 6(1)(b) - Contract"
      description: "Providing customer support services"
      retention_period: "Issue resolution + 24 months"
      
    # Security and Fraud Prevention
    security_fraud_prevention:
      data_categories: [login_attempts, ip_addresses, device_fingerprints, suspicious_activity]
      lawful_basis: "Article 6(1)(f) - Legitimate Interests"
      description: "Protecting service security and preventing fraud"
      legitimate_interest_assessment: true
      high_security_justification: true
      retention_period: "12 months from collection"
      
    # Marketing Communications
    marketing_communications:
      data_categories: [email_preferences, communication_history, engagement_metrics]
      lawful_basis: "Article 6(1)(a) - Consent"
      description: "Direct marketing communications"
      consent_required: true
      easy_withdrawal: "Unsubscribe link + account settings"
      retention_period: "Active consent + 6 months after withdrawal"
      
    # Legal Compliance
    legal_compliance:
      data_categories: [audit_logs, compliance_records, regulatory_reports]
      lawful_basis: "Article 6(1)(c) - Legal Obligation"
      description: "Compliance with legal and regulatory requirements"
      retention_period: "As required by applicable law (typically 6-7 years)"
```

---

## **DATA SUBJECT RIGHTS IMPLEMENTATION**

### **Complete Rights Management System**
```python
# src/gdpr/data_subject_rights.py
"""
Comprehensive GDPR Data Subject Rights Implementation
"""

import asyncio
import uuid
from typing import Dict, Any, List, Optional, Union
from datetime import datetime, timedelta
from enum import Enum
import json
import hashlib
from dataclasses import dataclass

class GDPRRight(Enum):
    """GDPR Data Subject Rights"""
    ACCESS = "access"                    # Article 15 - Right of Access
    RECTIFICATION = "rectification"      # Article 16 - Right to Rectification  
    ERASURE = "erasure"                 # Article 17 - Right to Erasure
    RESTRICTION = "restriction"         # Article 18 - Right to Restrict Processing
    PORTABILITY = "portability"         # Article 20 - Right to Data Portability
    OBJECTION = "objection"            # Article 21 - Right to Object
    AUTOMATED_DECISION = "automated"    # Article 22 - Automated Decision-making

class RequestStatus(Enum):
    """Request processing status"""
    RECEIVED = "received"
    VERIFIED = "verified"
    PROCESSING = "processing"
    COMPLETED = "completed"
    REJECTED = "rejected"
    OVERDUE = "overdue"

class RequestComplexity(Enum):
    """Request complexity levels"""
    SIMPLE = "simple"        # Can be completed automatically
    STANDARD = "standard"    # Requires human review
    COMPLEX = "complex"      # Requires extensive review and/or legal consultation

@dataclass
class DataSubjectRequest:
    """Data subject request structure"""
    request_id: str
    user_id: str
    right_type: GDPRRight
    status: RequestStatus
    created_at: datetime
    updated_at: datetime
    deadline: datetime
    
    # Request details
    description: str
    complexity: RequestComplexity
    priority: int = 1  # 1 = normal, 2 = high, 3 = urgent
    
    # Processing information
    assigned_to: Optional[str] = None
    processor_notes: List[str] = None
    
    # Identity verification
    verification_method: str = ""
    verified_at: Optional[datetime] = None
    verification_token: Optional[str] = None
    
    # Response information
    response_data: Optional[Dict[str, Any]] = None
    response_sent_at: Optional[datetime] = None
    
    # Audit trail
    actions_taken: List[Dict[str, Any]] = None
    
    def __post_init__(self):
        if not self.processor_notes:
            self.processor_notes = []
        if not self.actions_taken:
            self.actions_taken = []

class DataSubjectRightsManager:
    """Comprehensive GDPR Data Subject Rights Manager"""
    
    def __init__(self, db_manager, audit_logger, notification_service, dpo_service):
        self.db = db_manager
        self.audit = audit_logger
        self.notifications = notification_service
        self.dpo = dpo_service
        
        # Response time limits (Article 12)
        self.standard_response_days = 30
        self.complex_extension_days = 60  # Additional 2 months for complex requests
        
    async def submit_request(self,
                           user_id: str,
                           right_type: GDPRRight,
                           description: str,
                           contact_method: str = "email",
                           ip_address: Optional[str] = None,
                           user_agent: Optional[str] = None) -> str:
        """Submit a new data subject request"""
        
        # Generate unique request ID
        request_id = f"DSR-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        # Determine complexity and deadline
        complexity = await self._assess_request_complexity(right_type, description)
        deadline_days = self.standard_response_days
        
        if complexity == RequestComplexity.COMPLEX:
            deadline_days = self.complex_extension_days
        
        deadline = datetime.utcnow() + timedelta(days=deadline_days)
        
        # Create request
        request = DataSubjectRequest(
            request_id=request_id,
            user_id=user_id,
            right_type=right_type,
            status=RequestStatus.RECEIVED,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            deadline=deadline,
            description=description,
            complexity=complexity
        )
        
        # Store request
        await self.db.store_dsr_request(request)
        
        # Initiate identity verification
        verification_token = await self._initiate_identity_verification(
            request_id, user_id, contact_method
        )
        request.verification_token = verification_token
        await self.db.update_dsr_request(request)
        
        # Audit logging
        await self.audit.log_compliance_event(
            event_type=f"gdpr_dsr_{right_type.value}_submitted",
            regulation="GDPR",
            user_id=user_id,
            action="data_subject_request",
            resource_id=request_id,
            additional_data={
                "right_type": right_type.value,
                "complexity": complexity.value,
                "deadline": deadline.isoformat(),
                "ip_address": ip_address,
                "user_agent": user_agent
            }
        )
        
        # Notify DPO for complex requests
        if complexity == RequestComplexity.COMPLEX:
            await self.dpo.notify_complex_request(request)
        
        return request_id
    
    async def verify_identity(self,
                            request_id: str,
                            verification_token: str,
                            additional_verification: Optional[Dict[str, Any]] = None) -> bool:
        """Verify data subject identity"""
        
        request = await self.db.get_dsr_request(request_id)
        if not request:
            return False
        
        # Verify token
        if request.verification_token != verification_token:
            await self.audit.log_compliance_event(
                event_type="gdpr_dsr_verification_failed",
                regulation="GDPR",
                user_id=request.user_id,
                resource_id=request_id,
                additional_data={"reason": "invalid_token"}
            )
            return False
        
        # Additional verification checks (if provided)
        if additional_verification:
            if not await self._validate_additional_verification(request.user_id, additional_verification):
                await self.audit.log_compliance_event(
                    event_type="gdpr_dsr_verification_failed",
                    regulation="GDPR", 
                    user_id=request.user_id,
                    resource_id=request_id,
                    additional_data={"reason": "additional_verification_failed"}
                )
                return False
        
        # Update request status
        request.status = RequestStatus.VERIFIED
        request.verified_at = datetime.utcnow()
        request.updated_at = datetime.utcnow()
        
        await self.db.update_dsr_request(request)
        
        # Start processing
        await self._start_request_processing(request)
        
        # Audit successful verification
        await self.audit.log_compliance_event(
            event_type="gdpr_dsr_verified",
            regulation="GDPR",
            user_id=request.user_id,
            resource_id=request_id
        )
        
        return True
    
    async def process_access_request(self, request: DataSubjectRequest) -> Dict[str, Any]:
        """Process Article 15 - Right of Access"""
        
        try:
            # Collect all personal data
            personal_data = await self._collect_personal_data(request.user_id)
            
            # Get processing information
            processing_info = await self._get_processing_information(request.user_id)
            
            # Get retention information
            retention_info = await self._get_retention_information(request.user_id)
            
            # Get third party information
            third_party_info = await self._get_third_party_recipients(request.user_id)
            
            # Compile comprehensive response
            response_data = {
                "request_id": request.request_id,
                "data_subject_id": request.user_id,
                "processed_at": datetime.utcnow().isoformat(),
                "personal_data": personal_data,
                "processing_purposes": processing_info["purposes"],
                "legal_basis": processing_info["legal_basis"],
                "categories_of_data": processing_info["data_categories"],
                "retention_periods": retention_info,
                "recipients": third_party_info,
                "source_of_data": processing_info["data_sources"],
                "existence_of_automated_decision_making": processing_info["automated_decisions"],
                "data_subject_rights": self._get_data_subject_rights_info(),
                "right_to_complain": {
                    "supervisory_authority": "Data Protection Authority",
                    "contact_info": "https://example-dpa.gov"
                }
            }
            
            # Log data access for audit
            await self.audit.log_data_access(
                user_id="SYSTEM_DSR",
                data_type="comprehensive_profile",
                data_id=request.user_id,
                action="subject_access_request",
                ip_address="internal",
                user_agent="dsr_processor",
                gdpr_applicable=True
            )
            
            return response_data
            
        except Exception as e:
            await self._handle_processing_error(request, str(e))
            raise
    
    async def process_rectification_request(self,
                                         request: DataSubjectRequest,
                                         corrections: Dict[str, Any]) -> Dict[str, Any]:
        """Process Article 16 - Right to Rectification"""
        
        try:
            # Validate corrections
            validated_corrections = await self._validate_corrections(request.user_id, corrections)
            
            # Store original data for audit
            original_data = await self._get_current_data(request.user_id, validated_corrections.keys())
            
            # Apply corrections
            updated_fields = []
            for field, new_value in validated_corrections.items():
                try:
                    await self.db.update_user_field(request.user_id, field, new_value)
                    updated_fields.append(field)
                    
                    # Log individual field update
                    await self.audit.log_compliance_event(
                        event_type="gdpr_data_rectification",
                        regulation="GDPR",
                        user_id=request.user_id,
                        action="data_rectified",
                        resource_id=field,
                        additional_data={
                            "original_value_hash": hashlib.sha256(str(original_data.get(field, "")).encode()).hexdigest(),
                            "new_value_hash": hashlib.sha256(str(new_value).encode()).hexdigest(),
                            "request_id": request.request_id
                        }
                    )
                except Exception as field_error:
                    await self.audit.log_compliance_event(
                        event_type="gdpr_rectification_error",
                        regulation="GDPR",
                        user_id=request.user_id,
                        resource_id=field,
                        additional_data={
                            "error": str(field_error),
                            "request_id": request.request_id
                        }
                    )
            
            # Notify third parties if necessary
            await self._notify_third_parties_of_rectification(request.user_id, updated_fields)
            
            return {
                "request_id": request.request_id,
                "updated_fields": updated_fields,
                "failed_fields": [f for f in corrections.keys() if f not in updated_fields],
                "third_parties_notified": True,
                "processed_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            await self._handle_processing_error(request, str(e))
            raise
    
    async def process_erasure_request(self,
                                    request: DataSubjectRequest,
                                    erasure_scope: str = "full") -> Dict[str, Any]:
        """Process Article 17 - Right to Erasure (Right to be Forgotten)"""
        
        try:
            # Assess erasure grounds
            erasure_assessment = await self._assess_erasure_grounds(request.user_id)
            
            if not erasure_assessment["can_erase"]:
                return {
                    "request_id": request.request_id,
                    "status": "rejected",
                    "reason": erasure_assessment["reason"],
                    "legal_basis_for_retention": erasure_assessment["legal_basis"],
                    "processed_at": datetime.utcnow().isoformat()
                }
            
            # Backup data before erasure (for audit purposes)
            pre_erasure_backup = await self._create_erasure_backup(request.user_id)
            
            # Perform erasure based on scope
            erasure_result = await self._perform_data_erasure(
                request.user_id, 
                erasure_scope,
                erasure_assessment["erasable_categories"]
            )
            
            # Notify third parties
            third_party_notifications = await self._notify_third_parties_of_erasure(
                request.user_id,
                erasure_result["erased_categories"]
            )
            
            # Log erasure completion
            await self.audit.log_compliance_event(
                event_type="gdpr_data_erasure_completed",
                regulation="GDPR",
                user_id=request.user_id,
                action="data_erased",
                resource_id=request.request_id,
                additional_data={
                    "erasure_scope": erasure_scope,
                    "erased_categories": erasure_result["erased_categories"],
                    "retained_categories": erasure_result.get("retained_categories", []),
                    "third_parties_notified": third_party_notifications,
                    "backup_id": pre_erasure_backup["backup_id"]
                }
            )
            
            return {
                "request_id": request.request_id,
                "status": "completed",
                "erasure_scope": erasure_scope,
                "erased_categories": erasure_result["erased_categories"],
                "retained_data": erasure_result.get("retained_data_justification"),
                "third_parties_notified": len(third_party_notifications),
                "processed_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            await self._handle_processing_error(request, str(e))
            raise
    
    async def process_portability_request(self,
                                        request: DataSubjectRequest,
                                        export_format: str = "json") -> Dict[str, Any]:
        """Process Article 20 - Right to Data Portability"""
        
        try:
            # Collect portable data (data provided by user + processed by consent/contract)
            portable_data = await self._collect_portable_data(request.user_id)
            
            # Structure data in machine-readable format
            structured_data = await self._structure_portable_data(portable_data)
            
            # Generate export file
            export_file = await self._generate_export_file(
                structured_data, 
                export_format,
                request.user_id,
                request.request_id
            )
            
            # Create secure download link (expires in 7 days)
            download_info = await self._create_secure_download(
                export_file,
                request.user_id,
                expiry_days=7
            )
            
            # Log portability completion
            await self.audit.log_compliance_event(
                event_type="gdpr_data_portability_completed",
                regulation="GDPR",
                user_id=request.user_id,
                action="data_exported",
                resource_id=request.request_id,
                additional_data={
                    "export_format": export_format,
                    "file_size": download_info["file_size"],
                    "data_categories": list(structured_data.keys()),
                    "expiry_date": download_info["expiry_date"]
                }
            )
            
            return {
                "request_id": request.request_id,
                "status": "completed",
                "download_url": download_info["download_url"],
                "download_token": download_info["download_token"],
                "expiry_date": download_info["expiry_date"],
                "file_format": export_format,
                "file_size": download_info["file_size"],
                "data_categories": list(structured_data.keys()),
                "processed_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            await self._handle_processing_error(request, str(e))
            raise
    
    async def process_restriction_request(self,
                                        request: DataSubjectRequest,
                                        restriction_reason: str,
                                        restriction_scope: List[str]) -> Dict[str, Any]:
        """Process Article 18 - Right to Restriction of Processing"""
        
        try:
            # Assess restriction grounds
            restriction_assessment = await self._assess_restriction_grounds(
                request.user_id, 
                restriction_reason
            )
            
            if not restriction_assessment["can_restrict"]:
                return {
                    "request_id": request.request_id,
                    "status": "rejected",
                    "reason": restriction_assessment["reason"],
                    "processed_at": datetime.utcnow().isoformat()
                }
            
            # Apply processing restrictions
            restriction_result = await self._apply_processing_restrictions(
                request.user_id,
                restriction_scope,
                restriction_reason
            )
            
            # Notify third parties
            await self._notify_third_parties_of_restriction(
                request.user_id,
                restriction_result["restricted_processing"]
            )
            
            # Log restriction completion
            await self.audit.log_compliance_event(
                event_type="gdpr_processing_restriction_applied",
                regulation="GDPR",
                user_id=request.user_id,
                action="processing_restricted",
                resource_id=request.request_id,
                additional_data={
                    "restriction_reason": restriction_reason,
                    "restricted_processing": restriction_result["restricted_processing"],
                    "restriction_scope": restriction_scope
                }
            )
            
            return {
                "request_id": request.request_id,
                "status": "completed",
                "restriction_reason": restriction_reason,
                "restricted_processing": restriction_result["restricted_processing"],
                "allowed_processing": restriction_result["allowed_processing"],
                "processed_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            await self._handle_processing_error(request, str(e))
            raise
    
    async def process_objection_request(self,
                                      request: DataSubjectRequest,
                                      objection_reason: str,
                                      processing_activities: List[str]) -> Dict[str, Any]:
        """Process Article 21 - Right to Object"""
        
        try:
            # Assess objection grounds
            objection_assessment = await self._assess_objection_grounds(
                request.user_id,
                objection_reason,
                processing_activities
            )
            
            stopped_processing = []
            continued_processing = []
            
            for activity in processing_activities:
                activity_assessment = objection_assessment.get(activity, {})
                
                if activity_assessment.get("can_object", False):
                    # Stop processing
                    await self._stop_processing_activity(request.user_id, activity)
                    stopped_processing.append(activity)
                else:
                    # Continue processing due to compelling legitimate grounds
                    continued_processing.append({
                        "activity": activity,
                        "reason": activity_assessment.get("reason", "Compelling legitimate grounds"),
                        "legal_basis": activity_assessment.get("legal_basis")
                    })
            
            # Notify third parties
            if stopped_processing:
                await self._notify_third_parties_of_objection(
                    request.user_id,
                    stopped_processing
                )
            
            # Log objection processing
            await self.audit.log_compliance_event(
                event_type="gdpr_objection_processed",
                regulation="GDPR",
                user_id=request.user_id,
                action="processing_objection",
                resource_id=request.request_id,
                additional_data={
                    "objection_reason": objection_reason,
                    "stopped_processing": stopped_processing,
                    "continued_processing": [cp["activity"] for cp in continued_processing]
                }
            )
            
            return {
                "request_id": request.request_id,
                "status": "completed",
                "objection_reason": objection_reason,
                "stopped_processing": stopped_processing,
                "continued_processing": continued_processing,
                "processed_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            await self._handle_processing_error(request, str(e))
            raise
    
    async def get_request_status(self, request_id: str) -> Optional[Dict[str, Any]]:
        """Get current status of data subject request"""
        
        request = await self.db.get_dsr_request(request_id)
        if not request:
            return None
        
        # Calculate time remaining
        now = datetime.utcnow()
        time_remaining = request.deadline - now
        is_overdue = time_remaining.total_seconds() < 0
        
        return {
            "request_id": request.request_id,
            "right_type": request.right_type.value,
            "status": RequestStatus.OVERDUE.value if is_overdue else request.status.value,
            "created_at": request.created_at.isoformat(),
            "updated_at": request.updated_at.isoformat(),
            "deadline": request.deadline.isoformat(),
            "days_remaining": max(0, time_remaining.days),
            "is_overdue": is_overdue,
            "complexity": request.complexity.value,
            "description": request.description,
            "verification_required": request.status == RequestStatus.RECEIVED,
            "response_available": request.status == RequestStatus.COMPLETED and request.response_data is not None
        }
    
    async def _collect_personal_data(self, user_id: str) -> Dict[str, Any]:
        """Collect all personal data for a data subject"""
        
        personal_data = {
            "profile": await self.db.get_user_profile(user_id),
            "account": await self.db.get_account_data(user_id),
            "health_data": await self.db.get_health_data(user_id),
            "fitness_data": await self.db.get_fitness_data(user_id),
            "nutrition_data": await self.db.get_nutrition_data(user_id),
            "preferences": await self.db.get_user_preferences(user_id),
            "communication_preferences": await self.db.get_communication_preferences(user_id),
            "activity_logs": await self.db.get_activity_logs(user_id),
            "support_interactions": await self.db.get_support_interactions(user_id),
            "agent_interactions": await self.db.get_agent_interactions(user_id),
            "consent_records": await self.db.get_consent_records(user_id)
        }
        
        # Remove any None values or empty collections
        return {k: v for k, v in personal_data.items() if v is not None and v != []}
    
    async def _assess_erasure_grounds(self, user_id: str) -> Dict[str, Any]:
        """Assess if data can be erased under Article 17"""
        
        # Get current legal basis for processing
        processing_activities = await self.db.get_user_processing_activities(user_id)
        
        can_erase = True
        reason = ""
        legal_basis = []
        erasable_categories = []
        
        for activity in processing_activities:
            legal_basis_type = activity.get("lawful_basis")
            
            # Check exceptions to erasure (Article 17(3))
            if legal_basis_type == "legal_obligation":
                can_erase = False
                reason = "Processing necessary for compliance with legal obligation"
                legal_basis.append(activity["activity_name"])
                
            elif activity.get("public_interest") or activity.get("official_authority"):
                can_erase = False
                reason = "Processing for public interest or official authority"
                legal_basis.append(activity["activity_name"])
                
            elif activity.get("freedom_of_expression"):
                can_erase = False
                reason = "Processing for freedom of expression and information"
                legal_basis.append(activity["activity_name"])
                
            elif activity.get("archiving_research_statistics"):
                can_erase = False
                reason = "Processing for archiving, research, or statistical purposes"
                legal_basis.append(activity["activity_name"])
                
            else:
                # Data can be erased
                erasable_categories.append(activity["data_category"])
        
        return {
            "can_erase": can_erase,
            "reason": reason,
            "legal_basis": legal_basis,
            "erasable_categories": erasable_categories
        }

# Consent Management System
class ConsentManager:
    """Advanced GDPR Consent Management"""
    
    def __init__(self, db_manager, audit_logger):
        self.db = db_manager
        self.audit = audit_logger
    
    async def collect_consent(self,
                            user_id: str,
                            consent_purposes: List[str],
                            consent_text: str,
                            ip_address: str,
                            user_agent: str,
                            consent_method: str = "explicit_opt_in",
                            granular_choices: Optional[Dict[str, bool]] = None) -> str:
        """Collect GDPR-compliant consent"""
        
        consent_id = f"CONSENT-{datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        # Validate consent requirements
        validation_result = await self._validate_consent_requirements(
            consent_purposes, consent_text, granular_choices
        )
        
        if not validation_result["valid"]:
            raise ValueError(f"Invalid consent: {validation_result['reason']}")
        
        # Create consent record
        consent_record = {
            "consent_id": consent_id,
            "user_id": user_id,
            "purposes": consent_purposes,
            "consent_text": consent_text,
            "consent_text_hash": hashlib.sha256(consent_text.encode()).hexdigest(),
            "timestamp": datetime.utcnow(),
            "ip_address": ip_address,
            "user_agent": user_agent,
            "consent_method": consent_method,
            "granular_choices": granular_choices or {},
            "status": "active",
            "version": "1.0",
            "withdrawal_method": "account_settings",
            "freely_given": True,
            "specific": True,
            "informed": True,
            "unambiguous": True
        }
        
        # Store consent
        await self.db.store_consent_record(consent_record)
        
        # Update user processing permissions
        await self._update_processing_permissions(user_id, consent_purposes, granular_choices)
        
        # Audit consent collection
        await self.audit.log_compliance_event(
            event_type="gdpr_consent_collected",
            regulation="GDPR",
            user_id=user_id,
            action="consent_given",
            resource_id=consent_id,
            additional_data={
                "purposes": consent_purposes,
                "method": consent_method,
                "granular": granular_choices is not None,
                "ip_address": ip_address
            }
        )
        
        return consent_id
    
    async def withdraw_consent(self,
                             user_id: str,
                             consent_id: str,
                             withdrawal_purposes: Optional[List[str]] = None) -> Dict[str, Any]:
        """Process consent withdrawal"""
        
        # Get current consent record
        consent_record = await self.db.get_consent_record(consent_id)
        if not consent_record or consent_record["user_id"] != user_id:
            raise ValueError("Invalid consent ID")
        
        if consent_record["status"] != "active":
            raise ValueError("Consent already withdrawn")
        
        # Determine what to withdraw
        if withdrawal_purposes is None:
            # Withdraw entire consent
            withdrawal_purposes = consent_record["purposes"]
            consent_record["status"] = "withdrawn"
        else:
            # Partial withdrawal
            remaining_purposes = [p for p in consent_record["purposes"] if p not in withdrawal_purposes]
            if not remaining_purposes:
                consent_record["status"] = "withdrawn"
            else:
                consent_record["purposes"] = remaining_purposes
        
        consent_record["withdrawal_date"] = datetime.utcnow()
        consent_record["withdrawal_purposes"] = withdrawal_purposes
        
        # Update consent record
        await self.db.update_consent_record(consent_record)
        
        # Stop processing for withdrawn purposes
        await self._stop_processing_for_purposes(user_id, withdrawal_purposes)
        
        # Audit consent withdrawal
        await self.audit.log_compliance_event(
            event_type="gdpr_consent_withdrawn",
            regulation="GDPR",
            user_id=user_id,
            action="consent_withdrawn", 
            resource_id=consent_id,
            additional_data={
                "withdrawn_purposes": withdrawal_purposes,
                "partial_withdrawal": len(withdrawal_purposes) < len(consent_record["purposes"])
            }
        )
        
        return {
            "consent_id": consent_id,
            "withdrawn_purposes": withdrawal_purposes,
            "remaining_purposes": consent_record.get("purposes", []),
            "withdrawal_effective": datetime.utcnow().isoformat()
        }
    
    async def _validate_consent_requirements(self,
                                           purposes: List[str],
                                           consent_text: str,
                                           granular_choices: Optional[Dict[str, bool]]) -> Dict[str, Any]:
        """Validate GDPR consent requirements (Article 7)"""
        
        # Check if consent text is clear and understandable
        if len(consent_text) < 50:
            return {"valid": False, "reason": "Consent text too short - must be clear and informative"}
        
        # Check for prohibited language
        prohibited_phrases = [
            "by using this service",
            "continued use",
            "automatic",
            "bundled",
            "pre-ticked"
        ]
        
        for phrase in prohibited_phrases:
            if phrase.lower() in consent_text.lower():
                return {"valid": False, "reason": f"Consent text contains prohibited phrase: {phrase}"}
        
        # Check purposes are specific
        if not purposes:
            return {"valid": False, "reason": "At least one specific purpose required"}
        
        for purpose in purposes:
            if len(purpose) < 10:
                return {"valid": False, "reason": f"Purpose '{purpose}' not sufficiently specific"}
        
        # Validate granular consent if provided
        if granular_choices:
            for purpose in purposes:
                if purpose not in granular_choices:
                    return {"valid": False, "reason": f"Granular choice missing for purpose: {purpose}"}
        
        return {"valid": True, "reason": "Consent meets GDPR requirements"}
```

---

## **PRIVACY BY DESIGN IMPLEMENTATION**

### **Privacy Engineering Framework**
```python
# src/gdpr/privacy_by_design.py
"""
Privacy by Design Implementation (Article 25)
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from enum import Enum

class PrivacyPrinciple(Enum):
    """Privacy by Design Principles"""
    PROACTIVE = "proactive"
    DEFAULT = "default"
    EMBEDDED = "embedded"
    FULL_FUNCTIONALITY = "full_functionality"
    END_TO_END = "end_to_end"
    VISIBILITY = "visibility"
    RESPECT_PRIVACY = "respect_privacy"

class DataMinimizer:
    """Implements data minimization principle"""
    
    def __init__(self, processing_purposes_config: Dict[str, Any]):
        self.purposes_config = processing_purposes_config
    
    async def minimize_data_collection(self,
                                     requested_data: Dict[str, Any],
                                     processing_purpose: str) -> Dict[str, Any]:
        """Minimize data collection based on purpose"""
        
        purpose_config = self.purposes_config.get(processing_purpose)
        if not purpose_config:
            raise ValueError(f"Unknown processing purpose: {processing_purpose}")
        
        required_fields = purpose_config.get("required_fields", [])
        optional_fields = purpose_config.get("optional_fields", [])
        prohibited_fields = purpose_config.get("prohibited_fields", [])
        
        minimized_data = {}
        
        # Include only necessary data
        for field, value in requested_data.items():
            if field in prohibited_fields:
                continue  # Skip prohibited fields
                
            if field in required_fields:
                minimized_data[field] = value
            elif field in optional_fields:
                # Include optional fields only if they add value for the purpose
                if await self._is_optional_field_valuable(field, value, processing_purpose):
                    minimized_data[field] = value
        
        # Log minimization action
        await self._log_data_minimization(
            original_fields=list(requested_data.keys()),
            minimized_fields=list(minimized_data.keys()),
            purpose=processing_purpose
        )
        
        return minimized_data
    
    async def assess_data_necessity(self,
                                  data_fields: List[str],
                                  processing_purpose: str) -> Dict[str, str]:
        """Assess necessity of each data field for processing purpose"""
        
        necessity_assessment = {}
        purpose_config = self.purposes_config.get(processing_purpose, {})
        
        for field in data_fields:
            if field in purpose_config.get("required_fields", []):
                necessity_assessment[field] = "necessary"
            elif field in purpose_config.get("optional_fields", []):
                necessity_assessment[field] = "optional"
            elif field in purpose_config.get("prohibited_fields", []):
                necessity_assessment[field] = "prohibited"
            else:
                necessity_assessment[field] = "not_required"
        
        return necessity_assessment

class PurposeLimitation:
    """Implements purpose limitation principle"""
    
    def __init__(self, db_manager, audit_logger):
        self.db = db_manager
        self.audit = audit_logger
    
    async def validate_purpose_compatibility(self,
                                           original_purpose: str,
                                           new_purpose: str,
                                           data_categories: List[str]) -> Dict[str, Any]:
        """Validate if new purpose is compatible with original purpose"""
        
        # Get purpose compatibility matrix
        compatibility_matrix = await self._get_purpose_compatibility_matrix()
        
        compatibility_score = compatibility_matrix.get(original_purpose, {}).get(new_purpose, 0)
        
        # GDPR compatibility assessment
        is_compatible = compatibility_score >= 0.7  # 70% compatibility threshold
        
        if not is_compatible:
            # Further processing requires new legal basis
            required_legal_basis = await self._determine_required_legal_basis(
                new_purpose, data_categories
            )
        else:
            required_legal_basis = None
        
        assessment_result = {
            "original_purpose": original_purpose,
            "new_purpose": new_purpose,
            "is_compatible": is_compatible,
            "compatibility_score": compatibility_score,
            "data_categories": data_categories,
            "required_legal_basis": required_legal_basis,
            "assessment_date": datetime.utcnow().isoformat(),
            "gdpr_article": "Article 6(4)" if not is_compatible else "Article 5(1)(b)"
        }
        
        # Log purpose compatibility assessment
        await self.audit.log_compliance_event(
            event_type="gdpr_purpose_compatibility_assessment",
            regulation="GDPR",
            action="purpose_assessment",
            additional_data=assessment_result
        )
        
        return assessment_result
    
    async def enforce_purpose_limitation(self,
                                       user_id: str,
                                       requested_purpose: str,
                                       data_access_request: List[str]) -> Dict[str, Any]:
        """Enforce purpose limitation for data access"""
        
        # Get user's current consents and legal basis
        user_consents = await self.db.get_user_consents(user_id)
        
        allowed_data = []
        denied_data = []
        
        for data_category in data_access_request:
            purpose_allowed = False
            
            # Check if requested purpose is covered by existing consent/legal basis
            for consent in user_consents:
                if (consent["status"] == "active" and 
                    requested_purpose in consent["purposes"] and
                    data_category in consent.get("data_categories", [])):
                    purpose_allowed = True
                    break
            
            if purpose_allowed:
                allowed_data.append(data_category)
            else:
                denied_data.append(data_category)
        
        # Log purpose limitation enforcement
        await self.audit.log_compliance_event(
            event_type="gdpr_purpose_limitation_enforced",
            regulation="GDPR",
            user_id=user_id,
            action="purpose_enforcement",
            additional_data={
                "requested_purpose": requested_purpose,
                "allowed_data": allowed_data,
                "denied_data": denied_data
            }
        )
        
        return {
            "user_id": user_id,
            "requested_purpose": requested_purpose,
            "allowed_data_categories": allowed_data,
            "denied_data_categories": denied_data,
            "enforcement_result": "partial" if denied_data else "full_access"
        }

class PrivacyByDesignController:
    """Main Privacy by Design controller"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.data_minimizer = DataMinimizer(config["processing_purposes"])
        self.purpose_limiter = PurposeLimitation(config["db_manager"], config["audit_logger"])
    
    async def apply_privacy_by_design(self,
                                    operation: str,
                                    data_request: Dict[str, Any],
                                    user_context: Dict[str, Any]) -> Dict[str, Any]:
        """Apply Privacy by Design principles to data operation"""
        
        privacy_measures = {
            "proactive_measures": [],
            "default_privacy": [],
            "embedded_protection": [],
            "data_minimization": [],
            "purpose_limitation": [],
            "transparency": []
        }
        
        # 1. Proactive measures
        proactive_result = await self._apply_proactive_measures(operation, data_request)
        privacy_measures["proactive_measures"] = proactive_result
        
        # 2. Privacy by Default
        default_result = await self._apply_privacy_by_default(user_context)
        privacy_measures["default_privacy"] = default_result
        
        # 3. Data Minimization
        if "data_collection" in operation:
            minimized_data = await self.data_minimizer.minimize_data_collection(
                data_request.get("requested_data", {}),
                data_request.get("purpose")
            )
            privacy_measures["data_minimization"] = {
                "original_fields": len(data_request.get("requested_data", {})),
                "minimized_fields": len(minimized_data),
                "reduction_percentage": ((len(data_request.get("requested_data", {})) - len(minimized_data)) / 
                                       max(len(data_request.get("requested_data", {})), 1)) * 100
            }
            data_request["requested_data"] = minimized_data
        
        # 4. Purpose Limitation
        if "data_access" in operation:
            purpose_result = await self.purpose_limiter.enforce_purpose_limitation(
                user_context.get("user_id"),
                data_request.get("purpose"),
                data_request.get("requested_categories", [])
            )
            privacy_measures["purpose_limitation"] = purpose_result
        
        # 5. Transparency measures
        transparency_result = await self._apply_transparency_measures(operation, user_context)
        privacy_measures["transparency"] = transparency_result
        
        return {
            "operation": operation,
            "privacy_measures_applied": privacy_measures,
            "modified_request": data_request,
            "privacy_score": await self._calculate_privacy_score(privacy_measures)
        }
    
    async def _calculate_privacy_score(self, privacy_measures: Dict[str, Any]) -> float:
        """Calculate overall privacy protection score (0-100)"""
        
        score = 0
        max_score = 0
        
        # Proactive measures (20 points)
        if privacy_measures["proactive_measures"]:
            score += 20
        max_score += 20
        
        # Privacy by default (15 points)
        if privacy_measures["default_privacy"]:
            score += 15
        max_score += 15
        
        # Data minimization (25 points)
        if privacy_measures["data_minimization"]:
            reduction_percentage = privacy_measures["data_minimization"].get("reduction_percentage", 0)
            score += (reduction_percentage / 100) * 25
        max_score += 25
        
        # Purpose limitation (20 points)
        if privacy_measures["purpose_limitation"]:
            enforcement_result = privacy_measures["purpose_limitation"].get("enforcement_result")
            if enforcement_result == "full_access":
                score += 20
            elif enforcement_result == "partial":
                score += 10
        max_score += 20
        
        # Transparency (20 points)
        if privacy_measures["transparency"]:
            score += 20
        max_score += 20
        
        return (score / max_score) * 100 if max_score > 0 else 0
```

---

## **INTERNATIONAL TRANSFERS & ADEQUACY**

### **Transfer Impact Assessment**
```python
# src/gdpr/international_transfers.py
"""
GDPR Chapter V - International Transfer Controls
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from enum import Enum

class TransferMechanism(Enum):
    """GDPR Transfer mechanisms"""
    ADEQUACY_DECISION = "adequacy_decision"      # Article 45
    STANDARD_CONTRACTUAL_CLAUSES = "scc"        # Article 46(2)(c)
    BINDING_CORPORATE_RULES = "bcr"             # Article 47
    CERTIFICATION = "certification"              # Article 46(2)(f)
    DEROGATIONS = "derogations"                 # Article 49

class TransferRisk(Enum):
    """Transfer risk levels"""
    LOW = "low"
    MEDIUM = "medium" 
    HIGH = "high"
    PROHIBITED = "prohibited"

class InternationalTransferController:
    """Manages GDPR international transfer compliance"""
    
    def __init__(self, db_manager, audit_logger):
        self.db = db_manager
        self.audit = audit_logger
        
        # Adequacy decisions (as of 2025)
        self.adequate_countries = {
            "AD", "AR", "CA", "CH", "FO", "GG", "IL", "IM", "JE", "JP", 
            "NZ", "KR", "UY", "GB"  # Including UK
        }
        
        # Countries with partial adequacy
        self.partial_adequacy = {
            "US": ["Privacy Shield certified companies", "DPF participants"]
        }
    
    async def assess_transfer_legality(self,
                                     destination_country: str,
                                     data_categories: List[str],
                                     transfer_purpose: str,
                                     recipient_entity: str,
                                     existing_safeguards: List[str]) -> Dict[str, Any]:
        """Assess legality of international transfer (Chapter V)"""
        
        assessment = {
            "transfer_id": f"TIA-{datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}",
            "destination_country": destination_country,
            "data_categories": data_categories,
            "transfer_purpose": transfer_purpose,
            "recipient_entity": recipient_entity,
            "assessment_date": datetime.utcnow().isoformat(),
            "gdpr_chapter": "Chapter V"
        }
        
        # Check adequacy decision (Article 45)
        if destination_country.upper() in self.adequate_countries:
            assessment.update({
                "transfer_mechanism": TransferMechanism.ADEQUACY_DECISION.value,
                "legal_basis": "Article 45 - Adequacy Decision",
                "risk_level": TransferRisk.LOW.value,
                "additional_safeguards_required": False,
                "transfer_permitted": True,
                "conditions": []
            })
        
        # Check partial adequacy (e.g., US Privacy Shield)
        elif destination_country.upper() in self.partial_adequacy:
            partial_mechanisms = self.partial_adequacy[destination_country.upper()]
            assessment.update({
                "transfer_mechanism": "partial_adequacy",
                "legal_basis": "Article 45 - Partial Adequacy",
                "risk_level": TransferRisk.MEDIUM.value,
                "additional_safeguards_required": True,
                "transfer_permitted": "conditional",
                "conditions": partial_mechanisms
            })
        
        # Require appropriate safeguards (Article 46)
        else:
            safeguards_assessment = await self._assess_available_safeguards(
                destination_country, existing_safeguards
            )
            
            assessment.update({
                "transfer_mechanism": safeguards_assessment["recommended_mechanism"],
                "legal_basis": safeguards_assessment["legal_basis"],
                "risk_level": safeguards_assessment["risk_level"],
                "additional_safeguards_required": True,
                "transfer_permitted": safeguards_assessment["permitted"],
                "required_safeguards": safeguards_assessment["required_safeguards"],
                "conditions": safeguards_assessment["conditions"]
            })
        
        # Special category data additional checks (Article 9)
        if await self._contains_special_category_data(data_categories):
            assessment["special_category_data"] = True
            assessment["additional_protections"] = await self._get_special_category_protections()
        
        # Log transfer assessment
        await self.audit.log_compliance_event(
            event_type="gdpr_transfer_assessment",
            regulation="GDPR",
            action="international_transfer_assessment",
            resource_id=assessment["transfer_id"],
            additional_data=assessment
        )
        
        return assessment
    
    async def implement_transfer_safeguards(self,
                                          transfer_assessment: Dict[str, Any],
                                          implementation_plan: Dict[str, Any]) -> Dict[str, Any]:
        """Implement required safeguards for international transfer"""
        
        safeguards_implemented = []
        
        # Standard Contractual Clauses (Article 46(2)(c))
        if transfer_assessment["transfer_mechanism"] == TransferMechanism.STANDARD_CONTRACTUAL_CLAUSES.value:
            scc_implementation = await self._implement_standard_contractual_clauses(
                transfer_assessment, implementation_plan.get("scc_details", {})
            )
            safeguards_implemented.append(scc_implementation)
        
        # Binding Corporate Rules (Article 47)
        elif transfer_assessment["transfer_mechanism"] == TransferMechanism.BINDING_CORPORATE_RULES.value:
            bcr_implementation = await self._implement_binding_corporate_rules(
                transfer_assessment, implementation_plan.get("bcr_details", {})
            )
            safeguards_implemented.append(bcr_implementation)
        
        # Additional technical and organizational measures
        technical_measures = await self._implement_technical_safeguards(
            transfer_assessment, implementation_plan.get("technical_measures", {})
        )
        safeguards_implemented.extend(technical_measures)
        
        # Create transfer record
        transfer_record = {
            "transfer_id": transfer_assessment["transfer_id"],
            "implementation_date": datetime.utcnow().isoformat(),
            "safeguards_implemented": safeguards_implemented,
            "monitoring_requirements": await self._get_monitoring_requirements(transfer_assessment),
            "review_schedule": await self._create_review_schedule(transfer_assessment),
            "status": "active"
        }
        
        # Store transfer record
        await self.db.store_transfer_record(transfer_record)
        
        # Log safeguards implementation
        await self.audit.log_compliance_event(
            event_type="gdpr_transfer_safeguards_implemented",
            regulation="GDPR",
            action="safeguards_implementation",
            resource_id=transfer_assessment["transfer_id"],
            additional_data={
                "safeguards_count": len(safeguards_implemented),
                "destination_country": transfer_assessment["destination_country"],
                "transfer_mechanism": transfer_assessment["transfer_mechanism"]
            }
        )
        
        return transfer_record
    
    async def conduct_transfer_impact_assessment(self,
                                               destination_country: str,
                                               data_categories: List[str],
                                               transfer_volume: str,
                                               recipient_guarantees: Dict[str, Any]) -> Dict[str, Any]:
        """Conduct Transfer Impact Assessment (TIA) - Schrems II requirements"""
        
        tia = {
            "tia_id": f"TIA-{datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}",
            "destination_country": destination_country,
            "assessment_date": datetime.utcnow().isoformat(),
            "legal_framework": await self._assess_destination_legal_framework(destination_country),
            "government_access": await self._assess_government_access_risks(destination_country),
            "recipient_assessment": await self._assess_recipient_guarantees(recipient_guarantees),
            "data_sensitivity": await self._assess_data_sensitivity(data_categories),
            "transfer_circumstances": {
                "data_categories": data_categories,
                "transfer_volume": transfer_volume,
                "transfer_frequency": "regular",  # or "one-time", "occasional"
                "number_of_data_subjects": "unknown"  # Should be estimated
            }
        }
        
        # Calculate overall risk score
        risk_score = await self._calculate_transfer_risk_score(tia)
        
        # Determine if additional safeguards are needed
        if risk_score >= 7:  # High risk threshold
            additional_safeguards = await self._recommend_additional_safeguards(tia)
            tia["additional_safeguards_required"] = True
            tia["recommended_safeguards"] = additional_safeguards
            tia["transfer_recommendation"] = "implement_additional_safeguards"
        elif risk_score >= 4:  # Medium risk threshold
            tia["additional_safeguards_required"] = True
            tia["recommended_safeguards"] = ["enhanced_encryption", "regular_monitoring"]
            tia["transfer_recommendation"] = "proceed_with_caution"
        else:
            tia["additional_safeguards_required"] = False
            tia["transfer_recommendation"] = "proceed"
        
        tia["risk_score"] = risk_score
        tia["risk_level"] = self._get_risk_level(risk_score)
        
        # Store TIA
        await self.db.store_transfer_impact_assessment(tia)
        
        # Log TIA completion
        await self.audit.log_compliance_event(
            event_type="gdpr_transfer_impact_assessment",
            regulation="GDPR",
            action="tia_completed",
            resource_id=tia["tia_id"],
            additional_data={
                "destination_country": destination_country,
                "risk_score": risk_score,
                "risk_level": tia["risk_level"],
                "recommendation": tia["transfer_recommendation"]
            }
        )
        
        return tia
    
    async def _assess_destination_legal_framework(self, country: str) -> Dict[str, Any]:
        """Assess destination country's legal framework for data protection"""
        
        # This would typically integrate with external legal databases
        # For demo purposes, using static assessment
        
        legal_frameworks = {
            "US": {
                "data_protection_law": "State-level laws (CCPA, etc.)",
                "surveillance_laws": ["FISA", "USA PATRIOT Act"],
                "judicial_redress": "Limited for non-US persons",
                "independent_authority": "No federal DPA",
                "risk_level": "high"
            },
            "GB": {
                "data_protection_law": "UK GDPR",
                "surveillance_laws": ["Investigatory Powers Act"],
                "judicial_redress": "Available",
                "independent_authority": "ICO",
                "risk_level": "low"
            },
            # Add more countries as needed
        }
        
        return legal_frameworks.get(country.upper(), {
            "data_protection_law": "Unknown",
            "surveillance_laws": ["Unknown"],
            "judicial_redress": "Unknown",
            "independent_authority": "Unknown",
            "risk_level": "high"
        })
    
    async def _implement_standard_contractual_clauses(self,
                                                    transfer_assessment: Dict[str, Any],
                                                    scc_details: Dict[str, Any]) -> Dict[str, Any]:
        """Implement Standard Contractual Clauses (2021 SCCs)"""
        
        scc_implementation = {
            "safeguard_type": "standard_contractual_clauses",
            "scc_version": "2021",  # Latest EU Commission SCCs
            "module_used": scc_details.get("module", "Module 2"),  # Controller to Processor
            "implementation_date": datetime.utcnow().isoformat(),
            "parties": {
                "data_exporter": "Progressive-Framework-v5",
                "data_importer": transfer_assessment["recipient_entity"]
            },
            "additional_measures": scc_details.get("additional_measures", []),
            "monitoring_obligations": [
                "Regular compliance reviews",
                "Data subject complaint handling",
                "Cooperation with supervisory authorities"
            ]
        }
        
        return scc_implementation
```

---

## **BREACH NOTIFICATION SYSTEM**

### **Automated Breach Detection and Notification**
```python
# src/gdpr/breach_notification.py
"""
GDPR Articles 33 & 34 - Data Breach Notification System
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from enum import Enum
import uuid

class BreachSeverity(Enum):
    """Data breach severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class BreachType(Enum):
    """Types of data breaches"""
    CONFIDENTIALITY = "confidentiality_breach"
    INTEGRITY = "integrity_breach"
    AVAILABILITY = "availability_breach"
    COMBINED = "combined_breach"

class NotificationStatus(Enum):
    """Breach notification status"""
    DETECTED = "detected"
    ASSESSED = "assessed"
    AUTHORITY_NOTIFIED = "authority_notified"
    INDIVIDUALS_NOTIFIED = "individuals_notified"
    COMPLETED = "completed"

class BreachNotificationManager:
    """GDPR Data Breach Notification Manager"""
    
    def __init__(self, db_manager, audit_logger, notification_service, dpo_service):
        self.db = db_manager
        self.audit = audit_logger
        self.notifications = notification_service
        self.dpo = dpo_service
        
        # GDPR notification deadlines
        self.authority_notification_hours = 72  # Article 33
        self.individual_notification_hours = 72  # Article 34 (when required)
    
    async def detect_and_assess_breach(self,
                                     incident_data: Dict[str, Any],
                                     detection_source: str) -> str:
        """Detect and initially assess potential data breach"""
        
        breach_id = f"BREACH-{datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        # Initial breach assessment
        initial_assessment = await self._conduct_initial_assessment(incident_data)
        
        # Create breach record
        breach_record = {
            "breach_id": breach_id,
            "detection_timestamp": datetime.utcnow(),
            "detection_source": detection_source,
            "status": NotificationStatus.DETECTED.value,
            "incident_data": incident_data,
            "assessment": initial_assessment,
            "severity": initial_assessment["severity"],
            "breach_type": initial_assessment["breach_type"],
            "affected_individuals_estimate": initial_assessment["affected_count"],
            "data_categories_affected": initial_assessment["data_categories"],
            "notification_deadlines": {
                "authority_deadline": datetime.utcnow() + timedelta(hours=self.authority_notification_hours),
                "individual_deadline": datetime.utcnow() + timedelta(hours=self.individual_notification_hours)
            },
            "actions_taken": [],
            "timeline": [
                {
                    "timestamp": datetime.utcnow().isoformat(),
                    "action": "breach_detected",
                    "details": f"Detected by {detection_source}"
                }
            ]
        }
        
        # Store breach record
        await self.db.store_breach_record(breach_record)
        
        # Immediate actions based on severity
        if initial_assessment["severity"] in [BreachSeverity.HIGH.value, BreachSeverity.CRITICAL.value]:
            # Immediate containment
            await self._initiate_emergency_containment(breach_record)
            
            # Notify DPO immediately
            await self.dpo.notify_emergency_breach(breach_record)
        
        # Start formal assessment process
        await self._start_formal_assessment(breach_record)
        
        # Log breach detection
        await self.audit.log_compliance_event(
            event_type="gdpr_data_breach_detected",
            regulation="GDPR",
            action="breach_detection",
            resource_id=breach_id,
            additional_data={
                "severity": initial_assessment["severity"],
                "breach_type": initial_assessment["breach_type"],
                "affected_count": initial_assessment["affected_count"],
                "detection_source": detection_source
            }
        )
        
        return breach_id
    
    async def conduct_formal_assessment(self, breach_id: str) -> Dict[str, Any]:
        """Conduct formal 72-hour assessment (Article 33)"""
        
        breach_record = await self.db.get_breach_record(breach_id)
        if not breach_record:
            raise ValueError(f"Breach record not found: {breach_id}")
        
        # Detailed assessment
        formal_assessment = {
            "assessment_timestamp": datetime.utcnow().isoformat(),
            "assessor": "DPO_TEAM",
            "breach_confirmed": await self._confirm_breach_occurrence(breach_record),
            "nature_of_breach": await self._analyze_breach_nature(breach_record),
            "affected_individuals": await self._identify_affected_individuals(breach_record),
            "data_categories": await self._catalog_affected_data(breach_record),
            "likely_consequences": await self._assess_likely_consequences(breach_record),
            "containment_measures": await self._document_containment_measures(breach_record),
            "risk_to_individuals": await self._assess_risk_to_individuals(breach_record)
        }
        
        # Determine notification requirements
        authority_notification_required = await self._requires_authority_notification(formal_assessment)
        individual_notification_required = await self._requires_individual_notification(formal_assessment)
        
        formal_assessment.update({
            "authority_notification_required": authority_notification_required,
            "individual_notification_required": individual_notification_required,
            "notification_rationale": await self._get_notification_rationale(formal_assessment)
        })
        
        # Update breach record
        breach_record["formal_assessment"] = formal_assessment
        breach_record["status"] = NotificationStatus.ASSESSED.value
        breach_record["timeline"].append({
            "timestamp": datetime.utcnow().isoformat(),
            "action": "formal_assessment_completed",
            "details": "72-hour assessment completed"
        })
        
        await self.db.update_breach_record(breach_record)
        
        # Initiate required notifications
        if authority_notification_required:
            await self._notify_supervisory_authority(breach_record)
        
        if individual_notification_required:
            await self._notify_affected_individuals(breach_record)
        
        # Log assessment completion
        await self.audit.log_compliance_event(
            event_type="gdpr_breach_assessment_completed",
            regulation="GDPR",
            action="breach_assessment",
            resource_id=breach_id,
            additional_data={
                "authority_notification_required": authority_notification_required,
                "individual_notification_required": individual_notification_required,
                "risk_level": formal_assessment["risk_to_individuals"]["risk_level"]
            }
        )
        
        return formal_assessment
    
    async def notify_supervisory_authority(self, breach_id: str) -> Dict[str, Any]:
        """Notify supervisory authority within 72 hours (Article 33)"""
        
        breach_record = await self.db.get_breach_record(breach_id)
        assessment = breach_record.get("formal_assessment", {})
        
        # Prepare Article 33 notification
        authority_notification = {
            "notification_id": f"SA-{breach_id}",
            "controller_details": {
                "name": "Progressive-Framework-v5",
                "contact_person": "Data Protection Officer",
                "email": "dpo@your-domain.com",
                "phone": "+1-555-0123"
            },
            "breach_details": {
                "nature_of_breach": assessment.get("nature_of_breach"),
                "breach_type": breach_record.get("breach_type"),
                "categories_of_data_subjects": assessment.get("affected_individuals", {}).get("categories", []),
                "approximate_number_of_data_subjects": assessment.get("affected_individuals", {}).get("count", 0),
                "categories_of_data": assessment.get("data_categories", []),
                "approximate_number_of_records": assessment.get("affected_individuals", {}).get("record_count", 0)
            },
            "likely_consequences": assessment.get("likely_consequences", []),
            "measures_taken": {
                "containment_measures": assessment.get("containment_measures", []),
                "assessment_measures": ["Formal 72-hour assessment conducted"],
                "mitigation_measures": breach_record.get("mitigation_actions", [])
            },
            "measures_proposed": await self._get_proposed_measures(breach_record),
            "timeline": {
                "breach_detected": breach_record["detection_timestamp"].isoformat(),
                "assessment_completed": datetime.utcnow().isoformat(),
                "notification_sent": datetime.utcnow().isoformat()
            },
            "dpo_involvement": True,
            "cross_border_implications": await self._assess_cross_border_implications(breach_record)
        }
        
        # Send notification to supervisory authority
        notification_result = await self.notifications.send_supervisory_authority_notification(
            authority_notification
        )
        
        # Update breach record
        breach_record["authority_notification"] = {
            "notification_sent": datetime.utcnow().isoformat(),
            "notification_id": authority_notification["notification_id"],
            "confirmation_received": notification_result.get("confirmation_id"),
            "within_72_hours": self._is_within_deadline(
                breach_record["detection_timestamp"], 
                datetime.utcnow(), 
                72
            )
        }
        
        breach_record["status"] = NotificationStatus.AUTHORITY_NOTIFIED.value
        breach_record["timeline"].append({
            "timestamp": datetime.utcnow().isoformat(),
            "action": "authority_notified",
            "details": f"Supervisory authority notified - ID: {authority_notification['notification_id']}"
        })
        
        await self.db.update_breach_record(breach_record)
        
        # Log authority notification
        await self.audit.log_compliance_event(
            event_type="gdpr_authority_notification_sent",
            regulation="GDPR",
            action="authority_notification",
            resource_id=breach_id,
            additional_data={
                "notification_id": authority_notification["notification_id"],
                "within_deadline": breach_record["authority_notification"]["within_72_hours"],
                "affected_individuals": authority_notification["breach_details"]["approximate_number_of_data_subjects"]
            }
        )
        
        return authority_notification
    
    async def notify_affected_individuals(self, breach_id: str) -> Dict[str, Any]:
        """Notify affected individuals when required (Article 34)"""
        
        breach_record = await self.db.get_breach_record(breach_id)
        assessment = breach_record.get("formal_assessment", {})
        
        # Check if individual notification is required
        if not assessment.get("individual_notification_required", False):
            return {"individual_notification_required": False, "reason": "Low risk to individuals"}
        
        # Get affected individuals
        affected_individuals = await self._get_affected_individuals_for_notification(breach_record)
        
        # Prepare individual notification
        individual_notifications = []
        
        for individual in affected_individuals:
            notification = {
                "notification_id": f"IND-{breach_id}-{individual['user_id'][:8]}",
                "user_id": individual["user_id"],
                "communication_method": individual.get("preferred_method", "email"),
                "contact_address": individual.get("email") or individual.get("phone"),
                "notification_content": await self._prepare_individual_notification_content(
                    individual, breach_record, assessment
                ),
                "data_categories_affected": individual.get("affected_data_categories", []),
                "recommended_actions": await self._get_individual_recommended_actions(
                    individual, assessment
                )
            }
            individual_notifications.append(notification)
        
        # Send notifications
        sent_notifications = 0
        failed_notifications = 0
        
        for notification in individual_notifications:
            try:
                result = await self.notifications.send_individual_breach_notification(notification)
                if result.get("sent"):
                    sent_notifications += 1
                else:
                    failed_notifications += 1
            except Exception as e:
                failed_notifications += 1
                # Log individual notification failure
                await self.audit.log_compliance_event(
                    event_type="gdpr_individual_notification_failed",
                    regulation="GDPR",
                    user_id=notification["user_id"],
                    resource_id=breach_id,
                    additional_data={"error": str(e)}
                )
        
        # Update breach record
        individual_notification_summary = {
            "notifications_sent": datetime.utcnow().isoformat(),
            "total_individuals": len(affected_individuals),
            "successful_notifications": sent_notifications,
            "failed_notifications": failed_notifications,
            "within_72_hours": self._is_within_deadline(
                breach_record["detection_timestamp"],
                datetime.utcnow(),
                72
            ),
            "notification_method": "direct_communication",
            "public_communication_used": False
        }
        
        breach_record["individual_notifications"] = individual_notification_summary
        breach_record["status"] = NotificationStatus.INDIVIDUALS_NOTIFIED.value
        breach_record["timeline"].append({
            "timestamp": datetime.utcnow().isoformat(),
            "action": "individuals_notified",
            "details": f"Notified {sent_notifications} individuals"
        })
        
        await self.db.update_breach_record(breach_record)
        
        # Log individual notifications
        await self.audit.log_compliance_event(
            event_type="gdpr_individual_notifications_sent",
            regulation="GDPR",
            action="individual_notification",
            resource_id=breach_id,
            additional_data={
                "total_notifications": len(affected_individuals),
                "successful": sent_notifications,
                "failed": failed_notifications,
                "within_deadline": individual_notification_summary["within_72_hours"]
            }
        )
        
        return individual_notification_summary
    
    async def _conduct_initial_assessment(self, incident_data: Dict[str, Any]) -> Dict[str, Any]:
        """Conduct initial breach assessment"""
        
        # Analyze incident data to determine if it's a breach
        is_breach = await self._determine_if_breach(incident_data)
        
        if not is_breach:
            return {
                "is_breach": False,
                "severity": BreachSeverity.LOW.value,
                "reason": "Incident does not meet GDPR breach criteria"
            }
        
        # Classify breach type
        breach_type = await self._classify_breach_type(incident_data)
        
        # Estimate affected individuals
        affected_count = await self._estimate_affected_individuals(incident_data)
        
        # Identify data categories
        data_categories = await self._identify_affected_data_categories(incident_data)
        
        # Assess severity
        severity = await self._assess_initial_severity(
            breach_type, affected_count, data_categories
        )
        
        return {
            "is_breach": True,
            "breach_type": breach_type.value,
            "severity": severity.value,
            "affected_count": affected_count,
            "data_categories": data_categories,
            "assessment_confidence": "preliminary"
        }
    
    async def _prepare_individual_notification_content(self,
                                                     individual: Dict[str, Any],
                                                     breach_record: Dict[str, Any],
                                                     assessment: Dict[str, Any]) -> str:
        """Prepare personalized breach notification for individual (Article 34)"""
        
        content = f"""
Subject: Important Security Notice - Your Personal Information

Dear {individual.get('name', 'Valued User')},

We are writing to inform you of a security incident that may have affected your personal information in our Progressive Framework system.

WHAT HAPPENED:
{assessment.get('nature_of_breach', {}).get('description', 'A security incident occurred that may have compromised personal data.')}

WHEN IT HAPPENED:
The incident was detected on {breach_record['detection_timestamp'].strftime('%B %d, %Y at %I:%M %p UTC')}.

INFORMATION INVOLVED:
The following categories of your personal information may have been affected:
{', '.join(individual.get('affected_data_categories', []))}

WHAT WE ARE DOING:
• We immediately contained the incident and implemented additional security measures
• We are conducting a thorough investigation with cybersecurity experts
• We have notified the relevant data protection authorities
• We are working with law enforcement where appropriate

WHAT YOU SHOULD DO:
{chr(10).join([f"• {action}" for action in individual.get('recommended_actions', [])])}

CONTACT INFORMATION:
If you have questions about this incident, please contact our Data Protection Officer:
• Email: dpo@your-domain.com
• Phone: +1-555-0123
• Address: [Company Address]

We sincerely apologize for this incident and any inconvenience it may cause. We are committed to protecting your personal information and have taken steps to prevent similar incidents in the future.

Sincerely,
Progressive Framework Security Team

You have the right to lodge a complaint with the supervisory authority.
"""
        
        return content.strip()
```

---

## **GDPR COMPLIANCE MONITORING**

### **Real-time Compliance Dashboard**
```yaml
# k8s/monitoring/gdpr-compliance.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gdpr-compliance-monitor
  namespace: monitoring
spec:
  replicas: 2
  selector:
    matchLabels:
      app: gdpr-compliance-monitor
  template:
    metadata:
      labels:
        app: gdpr-compliance-monitor
    spec:
      containers:
      - name: compliance-monitor
        image: progressive-framework/gdpr-monitor:5.0
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-config
              key: url
        - name: DPO_EMAIL
          value: "dpo@your-domain.com"
        - name: SUPERVISORY_AUTHORITY_API
          value: "https://api.data-authority.gov/notifications"
        ports:
        - containerPort: 8080
          name: http
        resources:
          requests:
            memory: "512Mi"
            cpu: "200m"
          limits:
            memory: "1Gi"
            cpu: "500m"

---
# GDPR alert rules
apiVersion: v1
kind: ConfigMap
metadata:
  name: gdpr-alert-rules
  namespace: monitoring
data:
  gdpr-rules.yml: |
    groups:
    - name: gdpr_compliance_alerts
      interval: 15m
      rules:
      
      - alert: DataSubjectRequestOverdue
        expr: max(time() - gdpr_request_received_timestamp) > 2592000
        for: 0m
        labels:
          severity: critical
          compliance: gdpr
          article: "12"
        annotations:
          summary: "GDPR data subject request overdue"
          description: "Request {{ $labels.request_id }} has exceeded 30-day response deadline"
          
      - alert: ConsentWithdrawalNotProcessed
        expr: max(time() - gdpr_consent_withdrawal_timestamp) > 86400
        for: 0m
        labels:
          severity: high
          compliance: gdpr
          article: "7"
        annotations:
          summary: "Consent withdrawal not processed within 24 hours"
          description: "Consent withdrawal {{ $labels.consent_id }} requires immediate processing"
          
      - alert: DataBreachNotificationOverdue
        expr: max(time() - gdpr_breach_detected_timestamp) > 259200
        for: 0m
        labels:
          severity: critical
          compliance: gdpr
          article: "33"
        annotations:
          summary: "Data breach notification overdue (72h limit)"
          description: "Breach {{ $labels.breach_id }} must be reported to supervisory authority"
          
      - alert: InternationalTransferWithoutSafeguards
        expr: gdpr_international_transfer_without_safeguards > 0
        for: 5m
        labels:
          severity: high
          compliance: gdpr
          chapter: "5"
        annotations:
          summary: "International transfer without adequate safeguards"
          description: "Transfer to {{ $labels.destination_country }} lacks proper safeguards"
          
      - alert: ProcessingWithoutLawfulBasis
        expr: gdpr_processing_without_legal_basis > 0
        for: 0m
        labels:
          severity: critical
          compliance: gdpr
          article: "6"
        annotations:
          summary: "Data processing without lawful basis"
          description: "Processing activity {{ $labels.activity }} lacks valid legal basis"
```

---

## **TESTING & VALIDATION**

### **GDPR Compliance Test Suite**
```python
# tests/compliance/test_gdpr_compliance.py
"""
GDPR Compliance Test Suite
"""

import pytest
import asyncio
from datetime import datetime, timedelta
from unittest.mock import Mock, patch
import json

class TestDataSubjectRights:
    """Test GDPR Data Subject Rights implementation"""
    
    @pytest.mark.asyncio
    async def test_subject_access_request_within_30_days(self):
        """Test Article 15 compliance - 30-day response time"""
        
        # Setup
        rights_manager = DataSubjectRightsManager(Mock(), Mock(), Mock(), Mock())
        user_id = "test_user_123"
        
        with patch.object(rights_manager, '_collect_personal_data') as mock_collect:
            mock_collect.return_value = {
                "profile": {"name": "John Doe", "email": "john@example.com"},
                "health_data": {"goals": ["weight_loss"], "metrics": []}
            }
            
            # Submit request
            request_id = await rights_manager.submit_request(
                user_id=user_id,
                right_type=GDPRRight.ACCESS,
                description="I want to access all my personal data",
                ip_address="192.168.1.1"
            )
            
            # Verify identity
            request = await rights_manager.db.get_dsr_request(request_id)
            verification_success = await rights_manager.verify_identity(
                request_id, request.verification_token
            )
            assert verification_success
            
            # Process request
            response = await rights_manager.process_access_request(request)
            
            # Verify response
            assert response["request_id"] == request_id
            assert response["user_id"] == user_id
            assert "personal_data" in response
            assert "processing_purposes" in response
            assert "retention_periods" in response
            
            # Verify timeline
            updated_request = await rights_manager.db.get_dsr_request(request_id)
            processing_time = updated_request.updated_at - updated_request.created_at
            assert processing_time <= timedelta(days=30)
    
    @pytest.mark.asyncio
    async def test_right_to_erasure_with_valid_grounds(self):
        """Test Article 17 - Right to Erasure"""
        
        rights_manager = DataSubjectRightsManager(Mock(), Mock(), Mock(), Mock())
        user_id = "test_user_456"
        
        with patch.object(rights_manager, '_assess_erasure_grounds') as mock_assess:
            mock_assess.return_value = {
                "can_erase": True,
                "reason": "Consent withdrawn",
                "erasable_categories": ["profile", "health_data"]
            }
            
            with patch.object(rights_manager, '_perform_data_erasure') as mock_erase:
                mock_erase.return_value = {
                    "erased_categories": ["profile", "health_data"],
                    "retained_categories": []
                }
                
                # Submit erasure request
                request_id = await rights_manager.submit_request(
                    user_id=user_id,
                    right_type=GDPRRight.ERASURE,
                    description="Please delete all my personal data"
                )
                
                # Process request
                request = await rights_manager.db.get_dsr_request(request_id)
                await rights_manager.verify_identity(request_id, request.verification_token)
                
                response = await rights_manager.process_erasure_request(request)
                
                # Verify erasure
                assert response["status"] == "completed"
                assert "profile" in response["erased_categories"]
                assert "health_data" in response["erased_categories"]
    
    @pytest.mark.asyncio
    async def test_data_portability_json_format(self):
        """Test Article 20 - Right to Data Portability"""
        
        rights_manager = DataSubjectRightsManager(Mock(), Mock(), Mock(), Mock())
        user_id = "test_user_789"
        
        with patch.object(rights_manager, '_collect_portable_data') as mock_collect:
            mock_collect.return_value = {
                "profile": {"name": "Jane Doe", "email": "jane@example.com"},
                "fitness_goals": ["marathon_training"]
            }
            
            with patch.object(rights_manager, '_create_secure_download') as mock_download:
                mock_download.return_value = {
                    "download_url": "https://secure-downloads.example.com/token123",
                    "download_token": "token123",
                    "expiry_date": (datetime.utcnow() + timedelta(days=7)).isoformat(),
                    "file_size": 2048
                }
                
                # Submit portability request
                request_id = await rights_manager.submit_request(
                    user_id=user_id,
                    right_type=GDPRRight.PORTABILITY,
                    description="Export my data in JSON format"
                )
                
                # Process request
                request = await rights_manager.db.get_dsr_request(request_id)
                await rights_manager.verify_identity(request_id, request.verification_token)
                
                response = await rights_manager.process_portability_request(request, "json")
                
                # Verify export
                assert response["status"] == "completed"
                assert response["file_format"] == "json"
                assert "download_url" in response
                assert response["file_size"] > 0

class TestConsentManagement:
    """Test GDPR Consent Management"""
    
    @pytest.mark.asyncio
    async def test_valid_consent_collection(self):
        """Test valid GDPR consent collection (Article 7)"""
        
        consent_manager = ConsentManager(Mock(), Mock())
        user_id = "consent_test_user"
        
        # Valid consent parameters
        consent_purposes = ["fitness_tracking", "nutrition_planning", "progress_analytics"]
        consent_text = "I consent to Progressive Framework processing my health and fitness data for the purposes of personalized fitness tracking, nutrition planning, and progress analytics. I understand I can withdraw this consent at any time through my account settings."
        granular_choices = {
            "fitness_tracking": True,
            "nutrition_planning": True,
            "progress_analytics": False
        }
        
        # Collect consent
        consent_id = await consent_manager.collect_consent(
            user_id=user_id,
            consent_purposes=consent_purposes,
            consent_text=consent_text,
            ip_address="192.168.1.100",
            user_agent="Mozilla/5.0...",
            granular_choices=granular_choices
        )
        
        assert consent_id is not None
        assert consent_id.startswith("CONSENT-")
        
        # Verify consent record
        consent_record = await consent_manager.db.get_consent_record(consent_id)
        assert consent_record["status"] == "active"
        assert consent_record["freely_given"] is True
        assert consent_record["specific"] is True
        assert consent_record["informed"] is True
        assert consent_record["unambiguous"] is True
    
    @pytest.mark.asyncio
    async def test_consent_withdrawal(self):
        """Test consent withdrawal (Article 7(3))"""
        
        consent_manager = ConsentManager(Mock(), Mock())
        user_id = "consent_test_user"
        
        # First collect consent
        consent_id = await consent_manager.collect_consent(
            user_id=user_id,
            consent_purposes=["fitness_tracking", "nutrition_planning"],
            consent_text="Valid consent text here...",
            ip_address="192.168.1.100",
            user_agent="Mozilla/5.0..."
        )
        
        # Withdraw partial consent
        withdrawal_result = await consent_manager.withdraw_consent(
            user_id=user_id,
            consent_id=consent_id,
            withdrawal_purposes=["nutrition_planning"]
        )
        
        # Verify withdrawal
        assert "nutrition_planning" in withdrawal_result["withdrawn_purposes"]
        assert "fitness_tracking" in withdrawal_result["remaining_purposes"]
        
        # Verify processing stopped for withdrawn purposes
        consent_manager._stop_processing_for_purposes.assert_called_with(
            user_id, ["nutrition_planning"]
        )

class TestBreachNotification:
    """Test GDPR Breach Notification (Articles 33 & 34)"""
    
    @pytest.mark.asyncio
    async def test_breach_detection_and_72_hour_notification(self):
        """Test 72-hour breach notification to supervisory authority"""
        
        breach_manager = BreachNotificationManager(Mock(), Mock(), Mock(), Mock())
        
        # Simulate breach incident
        incident_data = {
            "incident_type": "unauthorized_access",
            "affected_systems": ["user_database"],
            "estimated_affected_users": 1500,
            "data_categories": ["profile_data", "health_metrics"]
        }
        
        # Detect breach
        breach_id = await breach_manager.detect_and_assess_breach(
            incident_data, "security_monitoring_system"
        )
        
        assert breach_id.startswith("BREACH-")
        
        # Conduct formal assessment
        assessment = await breach_manager.conduct_formal_assessment(breach_id)
        
        assert assessment["breach_confirmed"] is True
        assert assessment["authority_notification_required"] is True
        
        # Verify 72-hour deadline tracking
        breach_record = await breach_manager.db.get_breach_record(breach_id)
        deadline = breach_record["notification_deadlines"]["authority_deadline"]
        detection_time = breach_record["detection_timestamp"]
        
        time_diff = deadline - detection_time
        assert time_diff == timedelta(hours=72)
    
    @pytest.mark.asyncio
    async def test_individual_notification_when_high_risk(self):
        """Test individual notification for high-risk breaches (Article 34)"""
        
        breach_manager = BreachNotificationManager(Mock(), Mock(), Mock(), Mock())
        
        # High-risk breach scenario
        incident_data = {
            "incident_type": "data_exfiltration",
            "affected_systems": ["health_data", "medical_records"],
            "estimated_affected_users": 500,
            "data_categories": ["special_category_health_data"],
            "severity": "high"
        }
        
        breach_id = await breach_manager.detect_and_assess_breach(
            incident_data, "intrusion_detection"
        )
        
        # Mock affected individuals
        with patch.object(breach_manager, '_get_affected_individuals_for_notification') as mock_individuals:
            mock_individuals.return_value = [
                {
                    "user_id": "user1",
                    "email": "user1@example.com",
                    "affected_data_categories": ["health_metrics", "medical_conditions"]
                },
                {
                    "user_id": "user2", 
                    "email": "user2@example.com",
                    "affected_data_categories": ["fitness_data"]
                }
            ]
            
            # Process notifications
            notification_result = await breach_manager.notify_affected_individuals(breach_id)
            
            assert notification_result["total_individuals"] == 2
            assert notification_result["successful_notifications"] >= 0

class TestPrivacyByDesign:
    """Test Privacy by Design implementation (Article 25)"""
    
    @pytest.mark.asyncio
    async def test_data_minimization(self):
        """Test data minimization principle"""
        
        config = {
            "processing_purposes": {
                "fitness_tracking": {
                    "required_fields": ["user_id", "workout_data", "goals"],
                    "optional_fields": ["location_data"],
                    "prohibited_fields": ["financial_data", "political_opinions"]
                }
            }
        }
        
        minimizer = DataMinimizer(config["processing_purposes"])
        
        # Test data request with excess data
        requested_data = {
            "user_id": "user123",
            "workout_data": {"exercises": [], "duration": 60},
            "goals": ["weight_loss"],
            "location_data": {"gym": "Downtown Fitness"},
            "financial_data": {"credit_card": "1234-5678"},  # Should be removed
            "political_opinions": ["privacy_advocate"]       # Should be removed
        }
        
        minimized = await minimizer.minimize_data_collection(
            requested_data, "fitness_tracking"
        )
        
        # Verify minimization
        assert "user_id" in minimized
        assert "workout_data" in minimized
        assert "goals" in minimized
        assert "financial_data" not in minimized
        assert "political_opinions" not in minimized
        
    @pytest.mark.asyncio
    async def test_purpose_limitation_enforcement(self):
        """Test purpose limitation enforcement"""
        
        purpose_limiter = PurposeLimitation(Mock(), Mock())
        
        with patch.object(purpose_limiter.db, 'get_user_consents') as mock_consents:
            mock_consents.return_value = [
                {
                    "status": "active",
                    "purposes": ["fitness_tracking"],
                    "data_categories": ["workout_data", "goals"]
                }
            ]
            
            # Test purpose limitation
            result = await purpose_limiter.enforce_purpose_limitation(
                user_id="user123",
                requested_purpose="fitness_tracking",
                data_access_request=["workout_data", "goals", "financial_data"]
            )
            
            assert "workout_data" in result["allowed_data_categories"]
            assert "goals" in result["allowed_data_categories"] 
            assert "financial_data" in result["denied_data_categories"]

# Performance Tests
class TestGDPRPerformance:
    """Test GDPR system performance under load"""
    
    @pytest.mark.asyncio
    async def test_subject_access_request_performance(self):
        """Test SAR processing performance"""
        
        rights_manager = DataSubjectRightsManager(Mock(), Mock(), Mock(), Mock())
        
        # Mock data collection to return large dataset
        with patch.object(rights_manager, '_collect_personal_data') as mock_collect:
            mock_collect.return_value = {
                "profile": {"name": "Test User", "email": "test@example.com"},
                "health_data": {"records": [{"date": "2025-01-01", "weight": 70}] * 1000},
                "activity_logs": [{"timestamp": "2025-01-01T10:00:00Z", "action": "login"}] * 5000
            }
            
            start_time = datetime.utcnow()
            
            # Process large SAR
            request = Mock()
            request.request_id = "test-request"
            request.user_id = "test-user"
            
            response = await rights_manager.process_access_request(request)
            
            end_time = datetime.utcnow()
            processing_time = (end_time - start_time).total_seconds()
            
            # Should process within reasonable time (30 seconds for large dataset)
            assert processing_time < 30
            assert len(response["personal_data"]) == 3
    
    @pytest.mark.asyncio
    async def test_concurrent_consent_collection(self):
        """Test concurrent consent collection performance"""
        
        consent_manager = ConsentManager(Mock(), Mock())
        
        async def collect_single_consent(user_id: str) -> str:
            return await consent_manager.collect_consent(
                user_id=user_id,
                consent_purposes=["fitness_tracking"],
                consent_text="Valid consent text for testing purposes.",
                ip_address="192.168.1.1",
                user_agent="Test Agent"
            )
        
        # Test 100 concurrent consent collections
        start_time = datetime.utcnow()
        
        tasks = [collect_single_consent(f"user_{i}") for i in range(100)]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        end_time = datetime.utcnow()
        processing_time = (end_time - start_time).total_seconds()
        
        # Should handle 100 concurrent consents within 10 seconds
        assert processing_time < 10
        assert len([r for r in results if isinstance(r, str)]) == 100  # All successful
```

---

## **RELATED DOCUMENTATION**

### **Prerequisites**
- **[System Overview](../01-Core-System/System-Overview.md)** - System architecture foundation
- **[Security Overview](../04-Security/Security-Overview.md)** - Security framework and controls
- **[Compliance Documentation](Compliance-Documentation.md)** - Overall compliance framework

### **Follow-up Documents**
- **[Audit Trail Logging](Audit-Trail-Logging.md)** - GDPR audit logging implementation
- **[System Administration](../08-Admin/System-Administration.md)** - Administrative procedures

### **Operations Context**
- **[Data Encryption](../04-Security/Data-Encryption.md)** - Technical data protection measures
- **[User Management](../08-Admin/User-Management.md)** - User rights and permissions management

---

## **VERSION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0 | 2025-09-02 | Data Protection Officer | Complete GDPR compliance implementation |
| 4.x | 2025-08-xx | Legal Team | Previous iteration documentation |

---

**Document Status**: ✅ PRODUCTION_READY  
**Next Review**: 2025-12-02  
**Document Owner**: Data Protection Officer  
**Last Validated**: 2025-09-02