# Phase 2: AWS Integration - Implementation Guide

## 🎯 Overview

This phase integrates AWS services to transform the local prototype into a production-ready, cloud-native application.

---

## 📦 AWS Services Integration

### 1. **Amazon Cognito** - Authentication & User Management
- User registration and login
- Multi-factor authentication (MFA)
- Password reset flows
- Social login (Google, Facebook)
- JWT token management

### 2. **Amazon DynamoDB** - NoSQL Database
- Campaigns table
- Content items table
- Topic pillars table
- Risk alerts table
- User preferences table

### 3. **AWS S3** - Object Storage
- Generated content storage
- Media assets (images, videos)
- Backup and archives
- Presigned URLs for secure access

### 4. **AWS Lambda** - Serverless Functions
- API endpoints for CRUD operations
- Scheduled jobs (content generation)
- Event-driven workflows
- Integration with external APIs

### 5. **API Gateway** - REST API
- Centralized API management
- Request validation
- Rate limiting
- CORS configuration

---

## 🏗️ Infrastructure Setup

### Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **IAM User** with programmatic access
4. **Node.js** 18+ installed

### Step 1: Create AWS Resources

#### A. Amazon Cognito User Pool

```bash
# Create User Pool
aws cognito-idp create-user-pool \
  --pool-name digital-meng-users \
  --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true}" \
  --auto-verified-attributes email \
  --username-attributes email \
  --mfa-configuration OPTIONAL

# Create User Pool Client
aws cognito-idp create-user-pool-client \
  --user-pool-id <USER_POOL_ID> \
  --client-name digital-meng-web \
  --generate-secret false \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH
```

#### B. DynamoDB Tables

```bash
# Campaigns Table
aws dynamodb create-table \
  --table-name DigitalMEng-Campaigns \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=campaignId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=campaignId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# Content Items Table
aws dynamodb create-table \
  --table-name DigitalMEng-ContentItems \
  --attribute-definitions \
    AttributeName=campaignId,AttributeType=S \
    AttributeName=contentId,AttributeType=S \
  --key-schema \
    AttributeName=campaignId,KeyType=HASH \
    AttributeName=contentId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# Topic Pillars Table
aws dynamodb create-table \
  --table-name DigitalMEng-TopicPillars \
  --attribute-definitions \
    AttributeName=campaignId,AttributeType=S \
    AttributeName=pillarId,AttributeType=S \
  --key-schema \
    AttributeName=campaignId,KeyType=HASH \
    AttributeName=pillarId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

#### C. S3 Buckets

```bash
# Content Storage Bucket
aws s3 mb s3://digital-meng-content-<UNIQUE_ID>

# Configure CORS
aws s3api put-bucket-cors \
  --bucket digital-meng-content-<UNIQUE_ID> \
  --cors-configuration file://s3-cors.json
```

**s3-cors.json:**
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

---

## 🔐 Environment Variables

Create `.env.local` in project root:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# Cognito
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_REGION=us-east-1

# DynamoDB
DYNAMODB_CAMPAIGNS_TABLE=DigitalMEng-Campaigns
DYNAMODB_CONTENT_TABLE=DigitalMEng-ContentItems
DYNAMODB_PILLARS_TABLE=DigitalMEng-TopicPillars

# S3
S3_CONTENT_BUCKET=digital-meng-content-<UNIQUE_ID>
S3_REGION=us-east-1

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# JWT
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_EXPIRATION=7d

# External APIs (for Phase 4)
WORDPRESS_API_URL=
META_APP_ID=
META_APP_SECRET=
YOUTUBE_API_KEY=
```

---

## 📁 Project Structure

```
digital-meng/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── campaigns/    # Campaign CRUD
│   │   │   ├── content/      # Content management
│   │   │   └── upload/       # S3 uploads
│   │   ├── auth/             # Auth pages (login, signup)
│   │   ├── dashboard/
│   │   └── onboarding/
│   ├── lib/
│   │   ├── aws/              # AWS service clients
│   │   │   ├── cognito.ts
│   │   │   ├── dynamodb.ts
│   │   │   └── s3.ts
│   │   ├── auth/             # Auth utilities
│   │   │   ├── context.tsx
│   │   │   └── middleware.ts
│   │   └── api/              # API utilities
│   ├── hooks/                # React hooks
│   │   ├── useAuth.ts
│   │   ├── useCampaigns.ts
│   │   └── useContent.ts
│   └── middleware.ts         # Next.js middleware
├── .env.local                # Environment variables
└── aws/                      # AWS deployment configs
    ├── cloudformation.yaml
    └── lambda/               # Lambda functions
```

---

## 🔄 Data Flow

### Authentication Flow
```
User → Login Page → API Route → Cognito → JWT Token → Client Storage
```

### Campaign Creation Flow
```
User → Dashboard → API Route → DynamoDB → Response → UI Update
```

### Content Generation Flow
```
User → Content Queue → Lambda → Bedrock API → S3 Storage → DynamoDB
```

---

## 🛠️ Implementation Checklist

### Phase 2A: Authentication (Complete First)
- [ ] AWS Cognito User Pool created
- [ ] Environment variables configured
- [ ] Cognito client utility created
- [ ] Auth context provider built
- [ ] Login page implemented
- [ ] Signup page implemented
- [ ] Password reset flow
- [ ] Protected route middleware

### Phase 2B: Database Integration
- [ ] DynamoDB tables created
- [ ] DynamoDB client utility created
- [ ] Campaign CRUD API routes
- [ ] Content CRUD API routes
- [ ] Data migration from mock data

### Phase 2C: Storage Integration
- [ ] S3 bucket created and configured
- [ ] S3 client utility created
- [ ] Upload API route
- [ ] Presigned URL generation
- [ ] File management UI

### Phase 2D: API Layer
- [ ] API route structure
- [ ] Error handling middleware
- [ ] Request validation
- [ ] Response formatting
- [ ] Rate limiting

---

## 🧪 Testing Strategy

### Local Testing
```bash
# Install AWS SAM CLI for local Lambda testing
sam local invoke

# Run DynamoDB Local
docker run -p 8000:8000 amazon/dynamodb-local
```

### Integration Testing
- Test authentication flows
- Verify database operations
- Check S3 upload/download
- API endpoint testing

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Next.js)
```bash
vercel --prod
```

### Option 2: AWS Amplify
```bash
amplify init
amplify add hosting
amplify publish
```

### Option 3: Docker + ECS
```dockerfile
FROM node:18-alpine
# ... deployment configuration
```

---

## 📊 Monitoring & Logging

### CloudWatch Integration
- Lambda function logs
- API Gateway logs
- DynamoDB metrics
- Custom application metrics

### Alerts
- High error rates
- Slow API responses
- DynamoDB throttling
- S3 access errors

---

## 💰 Cost Estimation (Monthly)

| Service | Usage | Estimated Cost |
|---------|-------|----------------|
| Cognito | 10,000 MAU | Free (under 50k) |
| DynamoDB | Pay-per-request | ~$5-20 |
| S3 | 50GB storage | ~$1-3 |
| Lambda | 1M requests | Free tier |
| **Total** | | **~$6-25/month** |

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** to git
2. **Use IAM roles** instead of access keys when possible
3. **Enable MFA** on AWS root account
4. **Encrypt sensitive** data at rest
5. **Use HTTPS** everywhere
6. **Implement rate** limiting
7. **Regular security** audits

---

## 📝 Next Steps After Phase 2

1. Test authentication flow end-to-end
2. Migrate mock data to DynamoDB
3. Implement real-time updates
4. Add error boundaries
5. Set up monitoring dashboards
6. Prepare for Phase 3 (Bedrock Integration)

---

**Created**: December 26, 2025  
**Status**: 🔄 In Progress  
**Ready for**: AWS Resource Creation & Configuration
