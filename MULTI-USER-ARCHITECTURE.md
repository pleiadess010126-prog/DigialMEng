# 🏢 Multi-User & Multi-Tenancy Architecture

## Overview

When hosted as a SaaS web app with multiple users, the **DigitalMEng** system uses a comprehensive multi-tenancy architecture to ensure:
- ✅ Complete data isolation between users
- ✅ Secure credential management per user
- ✅ Role-based access control
- ✅ Team collaboration support
- ✅ Usage tracking and billing

---

## 🎯 **Architecture Model: Multi-Tenant with Data Isolation**

### **Tenancy Model**

```
Organization (Workspace)
  ├── Owner (Admin)
  ├── Team Members (Editors, Viewers)
  ├── Campaigns (isolated per org)
  ├── Content Items (isolated per org)
  ├── Platform Credentials (encrypted per org)
  └── Settings & Preferences
```

**Key Principle**: Each organization has its own isolated data space.

---

## 📊 **Data Isolation Strategy**

### **DynamoDB Tables with Partition Keys**

All data is partitioned by `organizationId`:

```typescript
// Example DynamoDB Structure

// Users Table
{
  PK: "USER#user-123",
  SK: "PROFILE",
  email: "user@example.com",
  organizationId: "org-456",  // Links to organization
  role: "owner" | "admin" | "editor" | "viewer"
}

// Organizations Table
{
  PK: "ORG#org-456",
  SK: "METADATA",
  name: "Acme Corp",
  ownerId: "user-123",
  plan: "pro",
  members: ["user-123", "user-789"],
  createdAt: "2025-12-26"
}

// Campaigns Table
{
  PK: "ORG#org-456",              // Partition by org
  SK: "CAMPAIGN#camp-123",
  name: "Q1 2025 Campaign",
  // ... campaign data
}

// Content Items Table
{
  PK: "ORG#org-456",              // Partition by org
  SK: "CONTENT#content-789",
  title: "Blog Post Title",
  // ... content data
}

// Platform Credentials Table (Encrypted)
{
  PK: "ORG#org-456",
  SK: "CREDS#wordpress",
  encryptedData: "...",           // Encrypted credentials
  platform: "wordpress"
}
```

**Benefits**:
- ✅ Queries automatically filtered by organization
- ✅ No risk of data leakage between users
- ✅ Efficient access patterns
- ✅ Scalable to millions of users

---

## 🔐 **Authentication & Authorization Flow**

### **User Sign-Up Flow**

```
1. User visits app → Clicks "Sign Up"
   ↓
2. Creates account with Cognito
   ↓
3. System creates:
   - User record in DynamoDB
   - New Organization record
   - User assigned as "owner"
   ↓
4. User completes onboarding
   ↓
5. Platform credentials stored (encrypted) per organization
```

### **User Sign-In Flow**

```
1. User enters credentials
   ↓
2. Cognito authenticates
   ↓
3. Returns JWT token with user ID
   ↓
4. System fetches:
   - User profile
   - Organization ID
   - User role
   ↓
5. All API calls include organizationId
   ↓
6. Data queries filtered by organizationId
```

### **Team Member Invitation Flow**

```
1. Owner invites team member (email)
   ↓
2. System sends invitation email
   ↓
3. Invitee creates account
   ↓
4. Account linked to existing organization
   ↓
5. Assigned role (admin, editor, viewer)
   ↓
6. Access granted to organization's data
```

---

## 👥 **Role-Based Access Control (RBAC)**

### **User Roles**

| Role | Permissions |
|------|-------------|
| **Owner** | Full access, billing, delete org, manage team members |
| **Admin** | Manage campaigns, configure platforms, approve content, invite members |
| **Editor** | Create/edit content, generate with AI, schedule posts |
| **Viewer** | Read-only access, view analytics, no editing |

### **Permission Matrix**

| Action | Owner | Admin | Editor | Viewer |
|--------|-------|-------|--------|--------|
| View dashboard | ✅ | ✅ | ✅ | ✅ |
| Generate content | ✅ | ✅ | ✅ | ❌ |
| Approve content | ✅ | ✅ | ❌ | ❌ |
| Publish content | ✅ | ✅ | ✅ | ❌ |
| Configure platforms | ✅ | ✅ | ❌ | ❌ |
| Manage team members | ✅ | ✅ | ❌ | ❌ |
| Billing & subscription | ✅ | ❌ | ❌ | ❌ |
| Delete organization | ✅ | ❌ | ❌ | ❌ |

---

## 🔒 **Security & Data Protection**

### **1. Credential Encryption**

Platform credentials (WordPress passwords, API keys) are encrypted per organization:

```typescript
import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

// Encrypt credentials before storing
async function encryptCredentials(credentials: any, organizationId: string) {
  const kms = new KMSClient({ region: process.env.AWS_REGION });
  
  const command = new EncryptCommand({
    KeyId: `alias/digitalmeng-${organizationId}`,
    Plaintext: Buffer.from(JSON.stringify(credentials)),
  });
  
  const response = await kms.send(command);
  return response.CiphertextBlob;
}

// Decrypt when needed
async function decryptCredentials(encryptedData: Buffer, organizationId: string) {
  const kms = new KMSClient({ region: process.env.AWS_REGION });
  
  const command = new DecryptCommand({
    CiphertextBlob: encryptedData,
  });
  
  const response = await kms.send(command);
  return JSON.parse(response.Plaintext.toString());
}
```

### **2. API Request Authorization**

Every API request validates organizationId:

```typescript
// Middleware example
async function validateOrganizationAccess(userId: string, organizationId: string) {
  const user = await getUser(userId);
  
  if (user.organizationId !== organizationId) {
    throw new Error('Unauthorized: Access to different organization');
  }
  
  return user.role; // Return role for permission checking
}

// Usage in API route
export async function POST(request: NextRequest) {
  const { userId, organizationId action } = await request.json();
  
  const userRole = await validateOrganizationAccess(userId, organizationId);
  
  if (!hasPermission(userRole, action)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Proceed with action
}
```

### **3. S3 Data Isolation**

Files stored with organization prefix:

```
s3://digital-meng-content/
├── org-456/
│   ├── content-123/
│   │   ├── thumbnail.jpg
│   │   └── video.mp4
│   └── content-124/
│       └── image.png
└── org-789/
    └── content-456/
        └── video.mp4
```

Bucket policy ensures users can only access their organization's folder.

---

## 🏗️ **Multi-Tenant Database Design**

### **DynamoDB Access Patterns**

```typescript
// Get all campaigns for an organization
{
  TableName: 'Campaigns',
  KeyConditionExpression: 'PK = :orgId',
  ExpressionAttributeValues: {
    ':orgId': `ORG#${organizationId}`
  }
}

// Get specific content item (must belong to org)
{
  TableName: 'ContentItems',
  Key: {
    PK: `ORG#${organizationId}`,
    SK: `CONTENT#${contentId}`
  }
}

// Query with secondary index (e.g., by status)
{
  TableName: 'ContentItems',
  IndexName: 'StatusIndex',
  KeyConditionExpression: 'PK = :orgId AND status = :status',
  ExpressionAttributeValues: {
    ':orgId': `ORG#${organizationId}`,
    ':status': 'pending'
  }
}
```

**Key Points**:
- All queries include `organizationId` in partition key
- No cross-organization queries possible
- DynamoDB enforces data isolation at infrastructure level

---

## 👥 **Team Collaboration Features**

### **1. Activity Feed Per Organization**

```typescript
// All team members see same activity feed
{
  PK: "ORG#org-456",
  SK: "ACTIVITY#2025-12-26T10:30:00",
  userId: "user-789",
  userName: "Jane Doe",
  action: "Published content to WordPress",
  details: "Blog Post: SEO Guide"
}
```

### **2. Content Approval Workflow**

```typescript
// Content requires approval from Admin/Owner
{
  PK: "ORG#org-456",
  SK: "CONTENT#content-123",
  status: "pending",
  createdBy: "user-789",      // Editor
  approvedBy: null,
  // When admin approves:
  approvedBy: "user-123",     // Owner
  status: "approved"
}
```

### **3. Notifications**

```typescript
// Notify team members of important events
{
  PK: "USER#user-123",
  SK: "NOTIFICATION#notif-456",
  organizationId: "org-456",
  type: "content_published",
  message: "Jane Doe published 'SEO Guide' to WordPress",
  read: false
}
```

---

## 💰 **Usage Tracking & Billing**

### **Per-Organization Limits**

```typescript
{
  PK: "ORG#org-456",
  SK: "USAGE#2025-12",
  plan: "pro",                     // free, starter, pro, enterprise
  limits: {
    contentGenerated: 100,         // Max per month
    platformsConnected: 4,
    teamMembers: 5
  },
  current: {
    contentGenerated: 23,          // Used this month
    platformsConnected: 2,
    teamMembers: 3
  }
}
```

### **Billing Integration**

```typescript
// Stripe customer per organization
{
  PK: "ORG#org-456",
  SK: "BILLING",
  stripeCustomerId: "cus_xxxxx",
  subscriptionId: "sub_xxxxx",
  plan: "pro",
  billingEmail: "billing@acme.com",
  nextBillingDate: "2025-01-26"
}
```

---

## 🌐 **Session Management**

### **JWT Token Structure**

```json
{
  "sub": "user-123",                    // User ID (Cognito)
  "email": "user@example.com",
  "organizationId": "org-456",          // Injected by our system
  "role": "admin",
  "exp": 1735209600
}
```

### **Client-Side State**

```typescript
// AuthContext stores current user & organization
{
  user: {
    id: "user-123",
    email: "user@example.com",
    name: "John Doe"
  },
  organization: {
    id: "org-456",
    name: "Acme Corp",
    plan: "pro"
  },
  role: "admin",
  permissions: ["generate_content", "approve_content", "configure_platforms"]
}
```

---

## 🔄 **Organization Switching**

For users belonging to multiple organizations:

```typescript
// User can be member of multiple orgs
{
  PK: "USER#user-123",
  SK: "ORGS",
  organizations: [
    {
      id: "org-456",
      name: "Acme Corp",
      role: "owner"
    },
    {
      id: "org-789",
      name: "Beta Inc",
      role: "editor"
    }
  ]
}

// Switch organization
function switchOrganization(newOrgId: string) {
  // Refresh JWT with new organizationId
  // Reload dashboard data for new org
  // Update client-side state
}
```

---

## 📊 **Deployment Architecture**

```
┌─────────────────────────────────────────────┐
│           CloudFront (CDN)                  │
│       Route 53 (DNS: app.digitalmeng.com)   │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│        Next.js App (Vercel/AWS Amplify)     │
│  - Multi-tenant frontend                    │
│  - API Routes with auth middleware          │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼──────┐    ┌───────▼──────┐
│   Cognito    │    │  DynamoDB    │
│  (Auth)      │    │  (Data)      │
│              │    │  Partitioned │
│ User Pools   │    │  by orgId    │
└──────────────┘    └───────┬──────┘
                            │
                    ┌───────▼──────┐
                    │      S3      │
                    │  (Storage)   │
                    │  /org-456/   │
                    │  /org-789/   │
                    └──────────────┘
```

---

## 🚀 **Scalability Considerations**

### **Database Sharding (Future)**

For massive scale (millions of organizations):

```
DynamoDB Tables:
├── Campaigns-A  (orgs 0000-3FFF)
├── Campaigns-B  (orgs 4000-7FFF)
└── Campaigns-C  (orgs 8000-FFFF)

Route by: hash(organizationId) % 3
```

### **Caching Strategy**

```typescript
// Redis cache per organization
cache.set(`org:${orgId}:campaigns`, campaigns, { ttl: 300 });
cache.set(`org:${orgId}:stats`, stats, { ttl: 60 });
```

### **Rate Limiting**

```typescript
// Per organization
const limit = await rateLimiter.check(organizationId, {
  points: 100,      // 100 API calls
  duration: 60      // per minute
});
```

---

## ✅ **Implementation Checklist**

### **Required for Multi-User SaaS**:

- [x] Cognito User Pools (Phase 2)
- [x] DynamoDB with partition keys
- [x] S3 with organization prefixes
- [ ] Organization management UI
- [ ] Team member invitation system
- [ ] Role-based permissions middleware
- [ ] Credential encryption with KMS
- [ ] Usage tracking per org
- [ ] Billing integration (Stripe)
- [ ] Organization switcher UI
- [ ] Audit logs per organization

### **Nice to Have**:
- [ ] SSO (SAML, OAuth)
- [ ] Custom domains per org
- [ ] White-label branding
- [ ] Advanced analytics per team member
- [ ] API keys for programmatic access

---

## 🎯 **Summary**

The DigitalMEng multi-tenant architecture ensures:

1. **Complete Isolation**: Each organization's data is fully separated
2. **Secure Credentials**: Platform credentials encrypted per org
3. **Team Collaboration**: Multiple users can work together
4. **Role-Based Access**: Fine-grained permissions
5. **Scalable**: Designed for millions of users
6. **Secure**: Industry-standard security practices

**Every user gets their own isolated workspace while sharing the same application infrastructure!**

---

**Date**: December 26, 2025
**Status**: Multi-Tenancy Architecture Documented
**Implementation**: Cognito + DynamoDB ready, UI needs org management features
