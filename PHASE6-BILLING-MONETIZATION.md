# 💰 Phase 6: Billing & Subscription Management

## Overview

Phase 6 implements the complete monetization and billing system for **DigitalMEng**, transforming it from a working product into a revenue-generating SaaS business.

---

## 🎯 **Subscription Management Architecture**

### **Pricing Tiers**

```typescript
interface PricingPlan {
  id: string;
  name: 'free' | 'starter' | 'pro' | 'enterprise';
  price: number; // per month
  limits: {
    contentGeneration: number; // posts per month
    platformsConnected: number;
    teamMembers: number;
    aiTokens: number;
    videoGeneration?: number; // Phase 5B
    storage: number; // GB
  };
  features: string[];
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'free',
    price: 0,
    limits: {
      contentGeneration: 10,
      platformsConnected: 1,
      teamMembers: 1,
      aiTokens: 50000,
      storage: 1,
    },
    features: [
      'AI content generation',
      '1 platform connection',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    id: 'starter',
    name: 'starter',
    price: 29,
    limits: {
      contentGeneration: 50,
      platformsConnected: 3,
      teamMembers: 3,
      aiTokens: 250000,
      storage: 10,
    },
    features: [
      'Everything in Free',
      '50 posts per month',
      '3 platform connections',
      '3 team members',
      'Priority email support',
    ],
  },
  {
    id: 'pro',
    name: 'pro',
    price: 79,
    limits: {
      contentGeneration: 200,
      platformsConnected: 10,
      teamMembers: 10,
      aiTokens: 1000000,
      videoGeneration: 20,
      storage: 50,
    },
    features: [
      'Everything in Starter',
      '200 posts per month',
      '10 platform connections',
      '10 team members',
      'Video generation (Phase 5)',
      'Advanced analytics',
      'A/B testing',
      'Priority chat support',
    ],
  },
  {
    id: 'enterprise',
    name: 'enterprise',
    price: 299,
    limits: {
      contentGeneration: -1, // unlimited
      platformsConnected: -1,
      teamMembers: -1,
      aiTokens: -1,
      videoGeneration: -1,
      storage: 500,
    },
    features: [
      'Everything in Pro',
      'Unlimited everything',
      'White-label option',
      'Custom integrations',
      'Dedicated account manager',
      '24/7 phone support',
      'SLA guarantee',
    ],
  },
];
```

---

## 💳 **Stripe Integration**

### **1. Stripe Setup**

```typescript
// lib/billing/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default stripe;
```

### **2. Create Customer**

```typescript
// When user signs up
async function createStripeCustomer(user: User) {
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: user.id,
      organizationId: user.organizationId,
    },
  });
  
  // Save to DynamoDB
  await saveCustomer(user.id, {
    stripeCustomerId: customer.id,
    plan: 'free',
    subscriptionStatus: 'active',
  });
  
  return customer;
}
```

### **3. Create Subscription**

```typescript
async function createSubscription(
  customerId: string,
  planId: string
) {
  // Get Stripe price ID for plan
  const priceId = getPriceIdForPlan(planId);
  
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
  });
  
  return subscription;
}
```

### **4. Handle Webhooks**

```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Handle events
  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
    
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
  }
  
  return NextResponse.json({ received: true });
}
```

---

## 📊 **Usage Tracking**

### **Track Content Generation**

```typescript
// lib/billing/usage.ts
async function trackContentGeneration(organizationId: string) {
  const currentMonth = new Date().toISOString().slice(0, 7); // "2025-12"
  
  // Get current usage
  const usage = await getUsage(organizationId, currentMonth);
  
  // Check limits
  const organization = await getOrganization(organizationId);
  const plan = PRICING_PLANS.find(p => p.id === organization.planId);
  
  if (plan!.limits.contentGeneration !== -1 && 
      usage.contentGenerated >= plan!.limits.contentGeneration) {
    throw new Error('Content generation limit reached. Upgrade to generate more.');
  }
  
  // Increment usage
  await incrementUsage(organizationId, currentMonth, 'contentGenerated');
  
  // Report to Stripe for metered billing (optional)
  await stripe.subscriptionItems.createUsageRecord(
    organization.stripeSubscriptionItemId,
    {
      quantity: 1,
      timestamp: Math.floor(Date.now() / 1000),
    }
  );
}
```

### **Usage Monitoring Dashboard**

```typescript
interface UsageMetrics {
  current: {
    contentGenerated: number;
    platformsConnected: number;
    teamMembers: number;
    storageUsed: number; // GB
    aiTokensUsed: number;
  };
  limits: {
    contentGeneration: number;
    platformsConnected: number;
    teamMembers: number;
    storage: number;
    aiTokens: number;
  };
  percentUsed: {
    content: number;
    platforms: number;
    members: number;
    storage: number;
    tokens: number;
  };
}
```

---

## 🎨 **Billing UI Components**

### **1. Pricing Page**

```typescript
// app/pricing/page.tsx
export default function PricingPage() {
  return (
    <div className="pricing-container">
      <h1>Choose Your Plan</h1>
      
      <div className="plans-grid">
        {PRICING_PLANS.map(plan => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
```

### **2. Subscription Management UI**

```typescript
// components/SubscriptionManager.tsx
export default function SubscriptionManager() {
  const { organization, subscription } = useSubscription();
  
  return (
    <div className="card">
      <h2>Your Subscription</h2>
      
      {/* Current Plan */}
      <div className="current-plan">
        <h3>{organization.plan.name}</h3>
        <p>${organization.plan.price}/month</p>
        <span className="badge">
          {subscription.status}
        </span>
      </div>
      
      {/* Usage Metrics */}
      <div className="usage-metrics">
        <UsageBar
          label="Content Generated"
          current={usage.contentGenerated}
          limit={plan.limits.contentGeneration}
        />
        <UsageBar
          label="Platforms Connected"
          current={usage.platformsConnected}
          limit={plan.limits.platformsConnected}
        />
        <UsageBar
          label="Team Members"
          current={usage.teamMembers}
          limit={plan.limits.teamMembers}
        />
      </div>
      
      {/* Actions */}
      <div className="actions">
        <button onClick={handleUpgrade}>
          Upgrade Plan
        </button>
        <button onClick={handleManageBilling}>
          Manage Billing
        </button>
        <button onClick={handleCancelSubscription}>
          Cancel Subscription
        </button>
      </div>
    </div>
  );
}
```

### **3. Usage Warning Banner**

```typescript
export function UsageWarningBanner() {
  const { usage, limits } = useUsage();
  
  const contentPercent = (usage.contentGenerated / limits.contentGeneration) * 100;
  
  if (contentPercent < 80) return null;
  
  return (
    <div className={`banner ${contentPercent >= 100 ? 'error' : 'warning'}`}>
      {contentPercent >= 100 ? (
        <>
          ⚠️ You've reached your content generation limit for this month.
          <button onClick={handleUpgrade}>Upgrade Now</button>
        </>
      ) : (
        <>
          ⚠️ You've used {contentPercent.toFixed(0)}% of your monthly content limit.
          <button onClick={handleUpgrade}>Upgrade Plan</button>
        </>
      )}
    </div>
  );
}
```

### **4. Payment Method Management**

```typescript
async function updatePaymentMethod() {
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}/settings/billing`,
  });
  
  window.location.href = session.url;
}
```

---

## 🔒 **Middleware for Plan Enforcement**

```typescript
// middleware/requirePlan.ts
export function requirePlan(minimumPlan: PricingPlan['name']) {
  return async (req: NextRequest) => {
    const user = await getUser(req);
    const organization = await getOrganization(user.organizationId);
    
    const userPlanTier = PLAN_TIERS[organization.planId];
    const requiredTier = PLAN_TIERS[minimumPlan];
    
    if (userPlanTier < requiredTier) {
      return NextResponse.json({
        error: 'This feature requires a higher plan',
        requiredPlan: minimumPlan,
        currentPlan: organization.planId,
      }, { status: 403 });
    }
    
    return NextResponse.next();
  };
}

// Usage in API route
export const POST = requirePlan('pro')(async (req) => {
  // Only Pro and Enterprise users can access
  await generateVideo(req.body);
});
```

---

## 📈 **Revenue Optimization**

### **1. Usage-Based Pricing (Optional)**

```typescript
// Charge per content piece generated
const PRICING = {
  base: {
    free: 0,
    starter: 29,
    pro: 79,
  },
  perContent: 0.50, // $0.50 per extra content piece
  perPlatform: 5,    // $5 per extra platform
  perMember: 10,     // $10 per extra team member
};
```

### **2. Annual Discount**

```typescript
const ANNUAL_DISCOUNT = 0.20; // 20% off

function getAnnualPrice(monthlyPrice: number) {
  const annualBase = monthlyPrice * 12;
  return annualBase * (1 - ANNUAL_DISCOUNT);
}

// $29/mo × 12 = $348
// With 20% discount = $278/year ($23.17/mo)
```

### **3. Add-ons**

```typescript
const ADDONS = {
  extraContent: {
    name: 'Extra Content Pack',
    description: '+100 posts per month',
    price: 20,
  },
  whiteLabel: {
    name: 'White Label',
    description: 'Remove DigitalMEng branding',
    price: 99,
  },
  prioritySupport: {
    name: 'Priority Support',
    description: '1-hour response time',
    price: 49,
  },
};
```

---

## 📊 **DynamoDB Schema for Billing**

```typescript
// Subscriptions Table
{
  PK: "ORG#org-456",
  SK: "SUBSCRIPTION",
  stripeCustomerId: "cus_xxxxx",
  stripeSubscriptionId: "sub_xxxxx",
  planId: "pro",
  status: "active",
  currentPeriodStart: "2025-12-01",
  currentPeriodEnd: "2026-01-01",
  cancelAtPeriodEnd: false,
  trialEnd: null,
}

// Usage Table
{
  PK: "ORG#org-456",
  SK: "USAGE#2025-12",
  contentGenerated: 45,
  platformsConnected: 3,
  teamMembers: 5,
  storageUsed: 12.5, // GB
  aiTokensUsed: 234567,
}

// Invoices Table
{
  PK: "ORG#org-456",
  SK: "INVOICE#in_xxxxx",
  amount: 79.00,
  status: "paid",
  date: "2025-12-01",
  pdfUrl: "https://...",
}
```

---

## 🎯 **Implementation Checklist**

### **Phase 6A: Stripe Integration** (6-8 hours)
- [ ] Set up Stripe account
- [ ] Create products & prices
- [ ] Implement subscription API
- [ ] Set up webhooks
- [ ] Test payment flow

### **Phase 6B: Usage Tracking** (4-6 hours)
- [ ] Usage tracking middleware
- [ ] DynamoDB usage schema
- [ ] Limit enforcement
- [ ] Usage dashboard UI

### **Phase 6C: Billing UI** (8-10 hours)
- [ ] Pricing page
- [ ] Subscription management
- [ ] Payment method update
- [ ] Invoice history
- [ ] Usage warnings

### **Phase 6D: Plan Enforcement** (3-4 hours)
- [ ] Middleware for feature gates
- [ ] Upgrade prompts
- [ ] Downgrade handling
- [ ] Trial period logic

---

## 💰 **Revenue Model Comparison**

### **Model 1: Flat Subscription** (Recommended)
```
Free: $0
Starter: $29/mo
Pro: $79/mo
Enterprise: $299/mo
```

**Pros**: Simple, predictable  
**Cons**: May leave money on table from power users

---

### **Model 2: Usage-Based**
```
Base: $19/mo
+ $0.50 per content piece
+ $5 per platform
+ $10 per team member
```

**Pros**: Fair, scales with value  
**Cons**: Unpredictable costs for users

---

### **Model 3: Hybrid** ⭐ **Best**
```
Starter: $29/mo (50 posts included)
Pro: $79/mo (200 posts included)
Enterprise: $299/mo (unlimited)

Overages:
- Extra content: $0.40 per post
- Extra platform: $5/mo
```

**Pros**: Best of both worlds  
**Cons**: Slightly more complex

---

## 📊 **Cost Analysis**

### **Your Costs** (BYOC Model):
```
Vercel hosting: $20/mo
Stripe fees: 2.9% + $0.30
OpenAI API: ~$0.02 per post
Total: ~$20-50/mo (fixed)
```

### **User Costs** (They Pay Directly):
```
AWS (if BYOC): $5-15/mo
OpenAI (if they provide key): ~$2-5/mo
Total: $7-20/mo
```

### **Profit Per User**:
```
Starter Plan ($29/mo):
- Your cost: ~$2 (Stripe fees)
- Profit: $27/mo

Pro Plan ($79/mo):
- Your cost: ~$3
- Profit: $76/mo

100 Pro users = $7,600/mo profit!
```

---

## 🎯 **When to Implement Phase 6?**

**Implement Phase 6 when**:
1. ✅ Core product working (Phases 1-4)
2. ✅ Deployed to production
3. ✅ At least 10 beta users
4. ✅ Product-market fit validated
5. ✅ Ready to scale

**Don't implement too early!** Get users first, monetize later.

---

## 🚀 **Quick Start**

### **Week 1: Stripe Setup**
```bash
# 1. Create Stripe account
# Visit: https://stripe.com

# 2. Install Stripe CLI
npm install stripe

# 3. Set up products
stripe products create --name="DigitalMEng Pro" --description="..."
stripe prices create --product=prod_xxx --unit-amount=7900 --currency=usd

# 4. Test webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### **Week 2: Integration**
- Implement subscription API
- Add billing UI
- Set up usage tracking
- Test end-to-end

### **Week 3: Launch**
- Deploy billing system
- Migrate existing users
- Launch pricing page
- Start charging!

---

## ✅ **Phase 6 Summary**

**What's Built**:
- ✅ Stripe integration
- ✅ Subscription management
- ✅ Usage tracking
- ✅ Plan enforcement
- ✅ Billing UI
- ✅ Invoice management

**Time**: 20-25 hours total  
**Outcome**: Revenue-generating SaaS  
**Priority**: After product validation

---

**Date**: December 26, 2025  
**Phase**: 6 - Billing & Monetization  
**Status**: Defined, ready to implement  
**Implement**: After Phases 1-4 deployed + user validation
