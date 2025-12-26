# 🚀 AWS Setup - Step-by-Step Guide

Follow these steps in order. After completing each step, you'll get values to save.

---

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] An AWS account (create at https://aws.amazon.com if needed)
- [ ] AWS Console access
- [ ] Billing enabled (Free tier is sufficient for testing)

---

## Step 1️⃣: Create Amazon Cognito User Pool

### Instructions:

1. **Open AWS Console** → Search for "Cognito" → Click "Cognito"

2. **Click "Create user pool"**

3. **Configure sign-in experience**:
   - ✅ Check "Email"
   - Click "Next"

4. **Configure security requirements**:
   - Password policy: Keep defaults
   - Multi-factor authentication: Choose "No MFA" (for simplicity)
   - Click "Next"

5. **Configure sign-up experience**:
   - Self-service sign-up: ✅ Enable
   - Attribute verification: ✅ Send email message, verify email
   - Required attributes: Select "name" 
   - Click "Next"

6. **Configure message delivery**:
   - Email provider: Choose "Send email with Amazon SES - Recommended"
   - SES Region: Choose your region (e.g., us-east-1)
   - FROM email address: Use default or configure custom
   - Click "Next"

7. **Integrate your app**:
   - User pool name: `digital-meng-users`
   - App client name: `digital-meng-web`
   - Authentication flows: ✅ Check "ALLOW_USER_PASSWORD_AUTH"
   - Click "Next"

8. **Review and create**:
   - Click "Create user pool"

### ✅ After Creation - Save These Values:

Once created, you'll see:

```
User Pool ID: us-east-1_xxxxxxxxx
```

Click on the user pool → Go to "App integration" tab → Click on "digital-meng-web":

```
App client ID: xxxxxxxxxxxxxxxxxxxx
```

**📝 SAVE THESE VALUES - You'll need them later!**

---

## Step 2️⃣: Create DynamoDB Tables

You need to create **3 tables**. Follow these steps for each:

### Table 1: Campaigns Table

1. **Open AWS Console** → Search for "DynamoDB" → Click "DynamoDB"

2. **Click "Create table"**

3. **Table settings**:
   - Table name: `DigitalMEng-Campaigns`
   - Partition key: `userId` (String)
   - Sort key: `campaignId` (String)
   - Table settings: "Customize settings"
   - Read/write capacity: "On-demand"
   - Click "Create table"

### Table 2: Content Items Table

Repeat the process:
   - Table name: `DigitalMEng-ContentItems`
   - Partition key: `campaignId` (String)
   - Sort key: `contentId` (String)
   - Table settings: "Customize settings"
   - Read/write capacity: "On-demand"
   - Click "Create table"

### Table 3: Topic Pillars Table

Repeat the process:
   - Table name: `DigitalMEng-TopicPillars`
   - Partition key: `campaignId` (String)
   - Sort key: `pillarId` (String)
   - Table settings: "Customize settings"
   - Read/write capacity: "On-demand"
   - Click "Create table"

### ✅ After Creation - Verify:

All three tables should show status "Active" in the DynamoDB console.

**📝 Table names to use:**
```
DYNAMODB_CAMPAIGNS_TABLE=DigitalMEng-Campaigns
DYNAMODB_CONTENT_TABLE=DigitalMEng-ContentItems
DYNAMODB_PILLARS_TABLE=DigitalMEng-TopicPillars
```

---

## Step 3️⃣: Create S3 Bucket

1. **Open AWS Console** → Search for "S3" → Click "S3"

2. **Click "Create bucket"**

3. **Bucket settings**:
   - Bucket name: `digital-meng-content-YOUR_UNIQUE_ID`
     (Replace YOUR_UNIQUE_ID with something like your initials + date, e.g., `digital-meng-content-jd20251226`)
   - AWS Region: Choose your region (e.g., us-east-1)
   - Object Ownership: ACLs disabled
   - Block Public Access: Keep all checkboxes ✅ CHECKED (for security)
   - Bucket Versioning: Disabled
   - Click "Create bucket"

4. **Configure CORS** (for web uploads):
   - Click on your newly created bucket
   - Go to "Permissions" tab
   - Scroll down to "Cross-origin resource sharing (CORS)"
   - Click "Edit"
   - Paste this configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["http://localhost:3000"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```
   - Click "Save changes"

### ✅ After Creation - Save This Value:

```
S3_CONTENT_BUCKET=digital-meng-content-YOUR_UNIQUE_ID
```

**📝 SAVE THIS BUCKET NAME!**

---

## Step 4️⃣: Create IAM User (for programmatic access)

1. **Open AWS Console** → Search for "IAM" → Click "IAM"

2. **Click "Users"** (left sidebar) → Click "Create user"

3. **User details**:
   - User name: `digital-meng-app`
   - Check ✅ "Provide user access to the AWS Management Console" - Optional (unchecked is fine)
   - Click "Next"

4. **Set permissions**:
   - Click "Attach policies directly"
   - Search and select these policies:
     - ✅ `AmazonCognitoPowerUser`
     - ✅ `AmazonDynamoDBFullAccess`
     - ✅ `AmazonS3FullAccess`
   - Click "Next"

5. **Review and create**:
   - Click "Create user"

6. **Create access keys**:
   - Click on the newly created user `digital-meng-app`
   - Go to "Security credentials" tab
   - Scroll to "Access keys"
   - Click "Create access key"
   - Use case: Choose "Application running outside AWS"
   - Click "Next"
   - Description: `DigitalMEng App`
   - Click "Create access key"

### ✅ CRITICAL - Save These Credentials NOW:

```
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ WARNING: You can only see the secret key ONCE! Save it immediately!**

If you close the window without saving, you'll need to create a new access key.

**📝 SAVE THESE CREDENTIALS SECURELY!**

---

## Step 5️⃣: Summary - Provide These Values

Once you've completed all steps, you should have:

✅ **Cognito**:
- User Pool ID: `us-east-1_xxxxxxxxx`
- App Client ID: `xxxxxxxxxxxxxxxxxxxxxxxxxx`
- Region: `us-east-1` (or your chosen region)

✅ **DynamoDB**:
- Campaigns Table: `DigitalMEng-Campaigns`
- Content Table: `DigitalMEng-ContentItems`
- Pillars Table: `DigitalMEng-TopicPillars`

✅ **S3**:
- Bucket Name: `digital-meng-content-YOUR_UNIQUE_ID`
- Region: `us-east-1` (or your chosen region)

✅ **IAM Credentials**:
- Access Key ID: `AKIAxxxxxxxxxxxxxxxxxx`
- Secret Access Key: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Region: `us-east-1` (or your chosen region)

---

## 📝 When Ready, Provide These Values:

Copy this template and fill in your values:

```
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
COGNITO_REGION=us-east-1

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

S3_BUCKET=digital-meng-content-YOUR_UNIQUE_ID
```

**Send me these values and I'll configure your application!**

---

## 💰 Estimated Costs

With the free tier:
- Cognito: FREE for up to 50,000 monthly active users
- DynamoDB: FREE for 25GB storage + 200M requests/month
- S3: FREE for first 5GB storage + 20,000 GET requests
- IAM: Always FREE

**Expected monthly cost for development: $0 - $5**

---

## 🔐 Security Notes

1. ✅ Never share your SECRET_ACCESS_KEY publicly
2. ✅ Use environment variables (never hardcode)
3. ✅ Enable MFA on your AWS root account
4. ✅ Rotate access keys every 90 days
5. ✅ Use IAM roles instead of keys in production

---

**Ready? Complete the steps above and send me the values!** 🚀
