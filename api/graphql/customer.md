# Customer GraphQL API Reference

Complete API reference for the Customer GraphQL Service (customer-graphql) - Part of the ZoneVast Auto-API microservices ecosystem.

## Table of Contents

- [Overview](#overview)
- [Base URLs](#base-urls)
- [Authentication](#authentication)
- [Models](#models)
  - [Customer](#customer)
  - [CustomerSegment](#customersegment)
  - [CustomerTag](#customertag)
  - [Interaction](#interaction)
  - [Communication](#communication)
  - [Lead](#lead)
  - [Opportunity](#opportunity)
  - [EmailCampaign](#emailcampaign)
  - [Message](#message)
  - [Chat](#chat)
  - [DashboardMetrics](#dashboardmetrics)
  - [LoyaltyProgram](#loyaltyprogram)
  - [LoyaltyPoints](#loyaltypoints)
  - [LoyaltyReward](#loyaltyreward)
  - [LoyaltyTransaction](#loyaltytransaction)
  - [Event](#event)
- [Queries](#queries)
- [Mutations](#mutations)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## Overview

The Customer GraphQL Service provides comprehensive CRM (Customer Relationship Management) functionality including:

- **Customer Management**: Full customer profiles with contact information, segmentation, and tagging
- **Sales Pipeline**: Lead tracking, opportunity management, and sales forecasting
- **Communication**: Email, SMS, and messaging tracking
- **Marketing**: Email campaigns with analytics
- **Loyalty Programs**: Points, rewards, and tier management
- **Calendar/Scheduling**: Events, meetings, and appointments
- **Analytics**: Dashboard metrics and reporting

### Features

- ✅ **16 Models** covering all CRM aspects
- ✅ **GraphQL API** with full CRUD operations
- ✅ **Project Scoping**: Multi-tenant data isolation
- ✅ **Soft Delete**: Recoverable deletions
- ✅ **Search**: Full-text search on key fields
- ✅ **Filtering**: Advanced filtering capabilities
- ✅ **Sorting**: Multi-field sorting
- ✅ **Pagination**: Efficient data retrieval
- ✅ **Relationships**: Nested data queries
- ✅ **Audit Trail**: Track changes and history
- ✅ **RBAC**: Role-based access control

---

## Base URLs

| Environment | Endpoint |
|-------------|----------|
| **Local Development** | `http://localhost:4005/graphql` |
| **Via SAM Gateway (Local)** | `http://localhost:3000/graphql/customer/en/v1/graphql` |
| **Production** | `https://api.zonevast.com/graphql/customer/en/v1/graphql` |
| **Development** | `https://dev-api.zonevast.com/graphql/customer/en/v1/graphql` |

---

## Authentication

### Headers Required

All requests must include:

```http
Authorization: Bearer <JWT_TOKEN>
x-project-id: <PROJECT_ID>
Content-Type: application/json
```

### Getting JWT Token

```bash
curl -X POST https://api.zonevast.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "user@example.com", "password": "password123"}'
```

**Response:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIs...",
  "refresh": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "project_id": 1
  }
}
```

### Using the Token

```bash
curl -X POST http://localhost:4005/graphql \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "x-project-id: 1" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { customers { id firstName lastName } }"}'
```

### Authentication Status

**Current State**: Authentication is configured but **disabled** in all models (`require_auth: False`).

**Note**: Without authentication, all requests are treated as `guest` role, which limits access. See [Error Handling](#error-handling) for details.

---

## Models

### Customer

Core customer/contact model with full CRM profile.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `firstName` | String | ✅ | First name |
| `lastName` | String | ✅ | Last name |
| `email` | String | ✅ | Email address (searchable) |
| `phone` | String | ❌ | Phone number |
| `companyName` | String | ❌ | Company name (searchable) |
| `jobTitle` | String | ❌ | Job title |
| `addressLine1` | String | ❌ | Address line 1 |
| `addressLine2` | String | ❌ | Address line 2 |
| `city` | String | ❌ | City |
| `state` | String | ❌ | State/Province |
| `postalCode` | String | ❌ | Postal code |
| `country` | String | ❌ | Country |
| `status` | String | ❌ | Status: `active`, `inactive`, `prospect`, `lead` |
| `customerType` | String | ❌ | Type: `individual`, `business` |
| `lifetimeValue` | Float | ❌ | Total customer lifetime value |
| `totalOrders` | Int | ❌ | Total number of orders |
| `totalSpent` | Float | ❌ | Total amount spent |
| `segmentId` | Int | ❌ | Associated segment ID |
| `website` | String | ❌ | Website URL |
| `linkedinUrl` | String | ❌ | LinkedIn profile URL |
| `twitterHandle` | String | ❌ | Twitter handle |
| `emailOptIn` | Boolean | ❌ | Email marketing opt-in |
| `smsOptIn` | Boolean | ❌ | SMS marketing opt-in |
| `preferredLanguage` | String | ❌ | Preferred language code |
| `notes` | String | ❌ | Additional notes |
| `additionalData` | JSON | ❌ | Custom metadata |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Relationships:**
- `tags`: [CustomerTag!] - Many-to-many relationship
- `interactions`: [Interaction!] - One-to-many relationship
- `communications`: [Communication!] - One-to-many relationship
- `opportunities`: [Opportunity!] - One-to-many relationship

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `project_owner`, `admin`, `user` |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin`, `user` |
| Delete | `project_owner`, `admin` |

---

### CustomerSegment

Customer segmentation for targeted marketing.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `name` | String | ✅ | Segment name (searchable) |
| `description` | String | ❌ | Segment description |
| `criteria` | JSON | ❌ | Filter rules for segment |
| `customerCount` | Int | ❌ | Number of customers |
| `totalValue` | Float | ❌ | Total segment value |
| `isActive` | Boolean | ❌ | Segment active status |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `project_owner`, `admin` |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin` |
| Delete | `project_owner`, `admin` |

---

### CustomerTag

Tags for organizing and categorizing customers.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `name` | String | ✅ | Tag name (searchable) |
| `description` | String | ❌ | Tag description |
| `color` | String | ❌ | Hex color code (default: `#007bff`) |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `project_owner`, `admin`, `user` |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin`, `user` |
| Delete | `project_owner`, `admin`, `user` |

---

### Interaction

Customer interaction tracking (calls, meetings, emails, etc.).

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `customerId` | Int | ✅ | Associated customer |
| `interactionType` | String | ✅ | Type: `call`, `email`, `meeting`, `chat`, `note` |
| `subject` | String | ✅ | Interaction subject (searchable) |
| `description` | String | ❌ | Detailed description (searchable) |
| `interactionDate` | DateTime | ✅ | When interaction occurred |
| `durationMinutes` | Int | ❌ | Duration in minutes |
| `outcome` | String | ❌ | Result: `successful`, `follow_up_needed`, `closed` |
| `userId` | Int | ❌ | User who handled interaction |
| `userName` | String | ❌ | User name |
| `notes` | String | ❌ | Additional notes |
| `additionalData` | JSON | ❌ | Custom metadata |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Relationships:**
- `customer`: Customer! - Many-to-one relationship

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `project_owner`, `admin`, `user` |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin`, `user` |
| Delete | `project_owner`, `admin` |

---

### Communication

Email/SMS/push communication tracking.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `customerId` | Int | ✅ | Target customer |
| `communicationType` | String | ✅ | Type: `email`, `sms`, `push`, `whatsapp` |
| `subject` | String | ❌ | Message subject |
| `body` | String | ✅ | Message content (searchable) |
| `status` | String | ❌ | Status: `pending`, `sent`, `delivered`, `failed`, `opened`, `clicked` |
| `sentAt` | DateTime | ❌ | When sent |
| `deliveredAt` | DateTime | ❌ | When delivered |
| `openedAt` | DateTime | ❌ | When opened |
| `clickedAt` | DateTime | ❌ | When clicked |
| `campaignId` | Int | ❌ | Associated campaign |
| `additionalData` | JSON | ❌ | Custom metadata |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Relationships:**
- `customer`: Customer! - Many-to-one relationship

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `project_owner`, `admin`, `user` |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin`, `user` |
| Delete | `project_owner`, `admin` |

---

### Lead

Sales lead pipeline management.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `firstName` | String | ✅ | First name (searchable) |
| `lastName` | String | ✅ | Last name (searchable) |
| `email` | String | ✅ | Email address (searchable) |
| `phone` | String | ❌ | Phone number |
| `companyName` | String | ❌ | Company name (searchable) |
| `jobTitle` | String | ❌ | Job title |
| `status` | String | ❌ | Status: `new`, `contacted`, `qualified`, `converted`, `lost` |
| `leadSource` | String | ❌ | Source: `website`, `referral`, `social`, `ad` |
| `leadScore` | Int | ❌ | Lead quality score |
| `convertedToCustomerId` | Int | ❌ | Converted customer ID |
| `convertedAt` | DateTime | ❌ | Conversion date |
| `assignedToUserId` | Int | ❌ | Assigned to user |
| `assignedToUserName` | String | ❌ | Assignee name |
| `notes` | String | ❌ | Additional notes |
| `additionalData` | JSON | ❌ | Custom metadata |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Relationships:**
- `opportunities`: [Opportunity!] - One-to-many relationship

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `project_owner`, `admin`, `user` |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin`, `user` |
| Delete | `project_owner`, `admin` |

---

### Opportunity

Sales opportunity and deal tracking.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `name` | String | ✅ | Opportunity name (searchable) |
| `description` | String | ❌ | Detailed description (searchable) |
| `customerId` | Int | ❌ | Associated customer |
| `leadId` | Int | ❌ | Associated lead |
| `amount` | Float | ✅ | Deal value |
| `currency` | String | ❌ | Currency code (default: `USD`) |
| `stage` | String | ✅ | Stage: `prospecting`, `qualification`, `proposal`, `negotiation`, `closed_won`, `closed_lost` |
| `probability` | Int | ❌ | Win probability 0-100 |
| `expectedCloseDate` | DateTime | ❌ | Expected close date |
| `actualCloseDate` | DateTime | ❌ | Actual close date |
| `ownerUserId` | Int | ❌ | Owner user ID |
| `ownerUserName` | String | ❌ | Owner name |
| `isActive` | Boolean | ❌ | Active status |
| `notes` | String | ❌ | Additional notes |
| `additionalData` | JSON | ❌ | Custom metadata |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Relationships:**
- `customer`: Customer - Many-to-one relationship
- `lead`: Lead - Many-to-one relationship

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `project_owner`, `admin`, `user` |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin`, `user` |
| Delete | `project_owner`, `admin` |

---

### EmailCampaign

Email marketing campaign management.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `name` | String | ✅ | Campaign name (searchable) |
| `subject` | String | ✅ | Email subject |
| `body` | String | ✅ | Email content (searchable) |
| `segmentId` | Int | ❌ | Target segment |
| `targetCustomerIds` | [Int] | ❌ | Specific customer IDs |
| `status` | String | ❌ | Status: `draft`, `scheduled`, `sending`, `sent`, `paused` |
| `scheduledAt` | DateTime | ❌ | Scheduled send time |
| `sentAt` | DateTime | ❌ | Actual send time |
| `totalRecipients` | Int | ❌ | Total recipients |
| `sentCount` | Int | ❌ | Emails sent |
| `deliveredCount` | Int | ❌ | Emails delivered |
| `openedCount` | Int | ❌ | Emails opened |
| `clickedCount` | Int | ❌ | Links clicked |
| `bouncedCount` | Int | ❌ | Emails bounced |
| `unsubscribedCount` | Int | ❌ | Unsubscribes |
| `openRate` | Float | ❌ | Open rate percentage |
| `clickRate` | Float | ❌ | Click rate percentage |
| `notes` | String | ❌ | Additional notes |
| `additionalData` | JSON | ❌ | Custom metadata |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `project_owner`, `admin` |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin` |
| Delete | `project_owner`, `admin` |

---

### Message

Direct messaging between customers and support/sales.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `customerId` | Int | ✅ | Associated customer |
| `subject` | String | ❌ | Message subject |
| `body` | String | ✅ | Message content (searchable) |
| `direction` | String | ✅ | Direction: `inbound`, `outbound` |
| `status` | String | ❌ | Status: `new`, `read`, `replied`, `resolved` |
| `assignedToUserId` | Int | ❌ | Assigned to user |
| `assignedToUserName` | String | ❌ | Assignee name |
| `readAt` | DateTime | ❌ | Read timestamp |
| `repliedAt` | DateTime | ❌ | Reply timestamp |
| `threadId` | Int | ❌ | Thread ID for grouping |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Relationships:**
- `customer`: Customer! - Many-to-one relationship

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `*` (everyone) |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin`, `user` |
| Delete | `project_owner`, `admin` |

---

### Chat

Live chat session management.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `customerId` | Int | ✅ | Associated customer |
| `title` | String | ❌ | Chat title |
| `status` | String | ❌ | Status: `active`, `closed`, `transferred` |
| `agentUserId` | Int | ❌ | Assigned agent |
| `agentUserName` | String | ❌ | Agent name |
| `messages` | [JSON] | ❌ | Chat messages array |
| `startedAt` | DateTime | ❌ | Start time |
| `endedAt` | DateTime | ❌ | End time |
| `customerRating` | Int | ❌ | Rating 1-5 |
| `customerFeedback` | String | ❌ | Feedback text |
| `additionalData` | JSON | ❌ | Custom metadata |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Relationships:**
- `customer`: Customer! - Many-to-one relationship

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `*` (everyone) |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin`, `user` |
| Delete | `project_owner`, `admin` |

---

### DashboardMetrics

Cached dashboard metrics for performance.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `metricType` | String | ✅ | Metric type identifier |
| `metricValue` | Float | ✅ | Metric value |
| `metricData` | JSON | ❌ | Additional metric data |
| `periodStart` | DateTime | ❌ | Period start |
| `periodEnd` | DateTime | ❌ | Period end |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `project_owner`, `admin` |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin` |
| Delete | `project_owner`, `admin` |

---

### LoyaltyProgram

Customer loyalty program configuration.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `name` | String | ✅ | Program name (searchable) |
| `description` | String | ❌ | Program description |
| `pointsPerDollar` | Float | ❌ | Points earned per dollar spent |
| `pointsPerOrder` | Int | ❌ | Bonus points per order |
| `tierThresholds` | JSON | ❌ | Tier point requirements |
| `tierMultipliers` | JSON | ❌ | Tier point multipliers |
| `isActive` | Boolean | ❌ | Program active status |
| `startDate` | DateTime | ❌ | Program start date |
| `endDate` | DateTime | ❌ | Program end date |
| `totalMembers` | Int | ❌ | Total members count |
| `totalPointsIssued` | Int | ❌ | Total points issued |
| `totalPointsRedeemed` | Int | ❌ | Total points redeemed |
| `termsAndConditions` | String | ❌ | Program terms |
| `additionalData` | JSON | ❌ | Custom metadata |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Default Tier Thresholds:**
```json
{
  "bronze": 0,
  "silver": 500,
  "gold": 1000,
  "platinum": 2500
}
```

**Default Tier Multipliers:**
```json
{
  "bronze": 1.0,
  "silver": 1.25,
  "gold": 1.5,
  "platinum": 2.0
}
```

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `project_owner`, `admin` |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin` |
| Delete | `project_owner`, `admin` |

---

### LoyaltyPoints

Customer loyalty points balance.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `customerId` | Int | ✅ | Associated customer |
| `programId` | Int | ✅ | Loyalty program |
| `pointsBalance` | Int | ❌ | Current points balance |
| `pointsEarnedLifetime` | Int | ❌ | Total points earned |
| `pointsRedeemedLifetime` | Int | ❌ | Total points redeemed |
| `pointsExpired` | Int | ❌ | Expired points |
| `currentTier` | String | ❌ | Current tier level |
| `tierProgress` | Float | ❌ | Progress to next tier (0-100) |
| `lastEarnedDate` | DateTime | ❌ | Last earn date |
| `lastRedeemedDate` | DateTime | ❌ | Last redeem date |
| `isActive` | Boolean | ❌ | Active status |
| `additionalData` | JSON | ❌ | Custom metadata |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Relationships:**
- `customer`: Customer! - Many-to-one relationship
- `program`: LoyaltyProgram! - Many-to-one relationship

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `project_owner`, `admin`, `user` |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin`, `user` |
| Delete | `project_owner`, `admin` |

---

### LoyaltyReward

Loyalty reward catalog items.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `name` | String | ✅ | Reward name (searchable) |
| `description` | String | ❌ | Reward description (searchable) |
| `rewardType` | String | ✅ | Type: `discount`, `product`, `service`, `voucher` |
| `rewardValue` | Float | ✅ | Reward value (amount or percentage) |
| `pointsRequired` | Int | ✅ | Points needed to redeem |
| `isActive` | Boolean | ❌ | Available for redemption |
| `stockQuantity` | Int | ❌ | Available stock (null = unlimited) |
| `maxRedemptionsPerCustomer` | Int | ❌ | Max per customer (null = unlimited) |
| `validFrom` | DateTime | ❌ | Valid from date |
| `validUntil` | DateTime | ❌ | Valid until date |
| `minTierRequired` | String | ❌ | Minimum tier required |
| `totalRedemptions` | Int | ❌ | Total times redeemed |
| `imageUrl` | String | ❌ | Reward image URL |
| `terms` | String | ❌ | Reward terms |
| `additionalData` | JSON | ❌ | Custom metadata |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `project_owner`, `admin` |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin` |
| Delete | `project_owner`, `admin` |

---

### LoyaltyTransaction

Loyalty points transaction history.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `customerId` | Int | ✅ | Associated customer |
| `programId` | Int | ✅ | Loyalty program |
| `pointsRecordId` | Int | ❌ | LoyaltyPoints record |
| `transactionType` | String | ✅ | Type: `earned`, `redeemed`, `expired`, `adjusted` |
| `pointsAmount` | Int | ✅ | Points (+earned, -redeemed) |
| `sourceType` | String | ❌ | Source: `order`, `manual`, `reward_redemption`, `bonus` |
| `sourceId` | Int | ❌ | Source ID (order, reward, etc.) |
| `description` | String | ❌ | Transaction description |
| `balanceAfter` | Int | ✅ | Balance after transaction |
| `rewardId` | Int | ❌ | Redeemed reward ID |
| `expiresAt` | DateTime | ❌ | Points expiry date |
| `status` | String | ❌ | Status: `pending`, `completed`, `cancelled`, `expired` |
| `createdByUserId` | Int | ❌ | Creator user ID |
| `createdByUserName` | String | ❌ | Creator name |
| `additionalData` | JSON | ❌ | Custom metadata |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Relationships:**
- `customer`: Customer! - Many-to-one relationship
- `program`: LoyaltyProgram! - Many-to-one relationship
- `reward`: LoyaltyReward - Many-to-one relationship

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `project_owner`, `admin`, `user` |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin` |
| Delete | `project_owner`, `admin` |

---

### Event

Calendar events, meetings, and scheduled activities.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Unique identifier |
| `title` | String | ✅ | Event title (searchable) |
| `description` | String | ❌ | Event description (searchable) |
| `startTime` | DateTime | ✅ | Event start time |
| `endTime` | DateTime | ✅ | Event end time |
| `allDay` | Boolean | ❌ | All-day event |
| `eventType` | String | ✅ | Type: `meeting`, `call`, `demo`, `follow-up`, `task`, `reminder` |
| `status` | String | ❌ | Status: `scheduled`, `completed`, `cancelled`, `rescheduled` |
| `customerId` | Int | ❌ | Related customer |
| `leadId` | Int | ❌ | Related lead |
| `opportunityId` | Int | ❌ | Related opportunity |
| `location` | String | ❌ | Physical location |
| `locationType` | String | ❌ | Type: `in-person`, `virtual`, `phone` |
| `meetingUrl` | String | ❌ | Virtual meeting URL |
| `attendees` | [String] | ❌ | Attendee emails/names |
| `organizerUserId` | Int | ❌ | Event organizer |
| `organizerUserName` | String | ❌ | Organizer name |
| `isRecurring` | Boolean | ❌ | Recurring event |
| `recurrence` | JSON | ❌ | Recurrence rules |
| `parentEventId` | Int | ❌ | Parent recurring event |
| `reminders` | [Int] | ❌ | Reminder minutes before |
| `priority` | String | ❌ | Priority: `low`, `normal`, `high`, `urgent` |
| `isPrivate` | Boolean | ❌ | Private event |
| `notes` | String | ❌ | Additional notes |
| `attachments` | [String] | ❌ | File attachment URLs |
| `additionalData` | JSON | ❌ | Custom metadata |
| `projectId` | Int | ✅* | Project ID (auto from header) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Recurrence Format:**
```json
{
  "frequency": "daily|weekly|monthly|yearly",
  "interval": 1,
  "until": "2024-12-31"
}
```

**Relationships:**
- `customer`: Customer - Many-to-one relationship
- `lead`: Lead - Many-to-one relationship
- `opportunity`: Opportunity - Many-to-one relationship

#### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Create | `project_owner`, `admin`, `user` |
| Read | `*` (everyone) |
| Update | `project_owner`, `admin`, `user` |
| Delete | `project_owner`, `admin`, `user` |

---

## Queries

### List Query Pattern

All list queries support:

- **Pagination**: `limit`, `offset`
- **Filtering**: `where` (see Filtering section)
- **Sorting**: `sort` (see Sorting section)
- **Search**: `search` on searchable fields

### customers

List all customers with filtering, pagination, search, and sorting.

```graphql
query GetCustomers {
  customers(limit: 10, offset: 0) {
    id
    firstName
    lastName
    email
    companyName
    status
    customerType
    lifetimeValue
    totalSpent
    createdAt
  }
}
```

**With filtering:**
```graphql
query GetActiveCustomers {
  customers(
    where: { status: { equals: "active" } }
    limit: 20
  ) {
    id
    firstName
    lastName
    email
    status
  }
}
```

**With relationships:**
```graphql
query GetCustomersWithTags {
  customers(limit: 10) {
    id
    firstName
    lastName
    tags {
      id
      name
      color
    }
    interactions {
      id
      interactionType
      subject
      interactionDate
    }
  }
}
```

**With search:**
```graphql
query SearchCustomers {
  customers(search: "john") {
    id
    firstName
    lastName
    email
  }
}
```

---

### customer

Get customer by ID.

```graphql
query GetCustomer($id: ID!) {
  customer(id: $id) {
    id
    firstName
    lastName
    email
    phone
    companyName
    jobTitle
    addressLine1
    city
    state
    country
    status
    customerType
    lifetimeValue
    totalOrders
    totalSpent
    tags {
      id
      name
      color
    }
    interactions {
      id
      interactionType
      subject
      interactionDate
    }
    communications {
      id
      communicationType
      status
      sentAt
    }
    opportunities {
      id
      name
      amount
      stage
    }
  }
}
```

**Variables:**
```json
{
  "id": "3"
}
```

---

### leads

List all leads.

```graphql
query GetLeads {
  leads(limit: 20) {
    id
    firstName
    lastName
    email
    companyName
    status
    leadSource
    leadScore
    createdAt
  }
}
```

**Filter by status:**
```graphql
query GetNewLeads {
  leads(
    where: { status: { equals: "new" } }
    orderBy: { leadScore: DESC }
    limit: 50
  ) {
    id
    firstName
    lastName
    email
    leadScore
    leadSource
  }
}
```

---

### opportunities

List all opportunities.

```graphql
query GetOpportunities {
  opportunities(
    where: { isActive: { equals: true } }
    orderBy: { amount: DESC }
    limit: 20
  ) {
    id
    name
    amount
    currency
    stage
    probability
    expectedCloseDate
    customer {
      id
      firstName
      lastName
      companyName
    }
    ownerUserName
  }
}
```

**Pipeline summary:**
```graphql
query GetOpportunityPipeline {
  opportunities(where: { isActive: { equals: true } }) {
    id
    name
    amount
    stage
    probability
  }
}
```

---

### loyaltyPrograms

List all loyalty programs.

```graphql
query GetLoyaltyPrograms {
  loyaltyPrograms(where: { isActive: { equals: true } }) {
    id
    name
    description
    pointsPerDollar
    tierThresholds
    tierMultipliers
    totalMembers
    totalPointsIssued
  }
}
```

---

### loyaltyPoints

List customer loyalty points.

```graphql
query GetCustomerPoints($customerId: Int!) {
  loyaltyPoints(
    where: { customerId: { equals: $customerId } }
  ) {
    id
    customerId
    programId
    pointsBalance
    pointsEarnedLifetime
    pointsRedeemedLifetime
    currentTier
    tierProgress
    program {
      id
      name
      tierThresholds
    }
  }
}
```

---

### loyaltyTransactions

List loyalty transaction history.

```graphql
query GetLoyaltyTransactions($customerId: Int!) {
  loyaltyTransactions(
    where: {
      customerId: { equals: $customerId }
      status: { equals: "completed" }
    }
    orderBy: { createdAt: DESC }
    limit: 50
  ) {
    id
    transactionType
    pointsAmount
    balanceAfter
    description
    createdAt
  }
}
```

---

### events

List calendar events.

```graphql
query GetUpcomingEvents {
  events(
    where: {
      status: { equals: "scheduled" }
      startTime: { gte: "2024-01-01T00:00:00Z" }
    }
    orderBy: { startTime: ASC }
    limit: 20
  ) {
    id
    title
    startTime
    endTime
    eventType
    status
    priority
    customer {
      id
      firstName
      lastName
    }
  }
}
```

---

## Mutations

### createCustomer

Create a new customer.

```graphql
mutation CreateCustomer($input: CreateCustomerInput!) {
  createCustomer(input: $input) {
    id
    firstName
    lastName
    email
    phone
    companyName
    jobTitle
    status
    customerType
    createdAt
  }
}
```

**Input:**
```json
{
  "input": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123",
    "companyName": "Acme Corporation",
    "jobTitle": "CEO",
    "addressLine1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "postalCode": "94102",
    "status": "active",
    "customerType": "business"
  }
}
```

**Response:**
```json
{
  "data": {
    "createCustomer": {
      "id": "123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "status": "active",
      "customerType": "business",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

### updateCustomer

Update an existing customer.

```graphql
mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
  updateCustomer(id: $id, input: $input) {
    id
    firstName
    lastName
    email
    phone
    companyName
    status
    updatedAt
  }
}
```

**Input:**
```json
{
  "id": "123",
  "input": {
    "phone": "+1-555-9999",
    "status": "inactive",
    "lifetimeValue": 5000.00
  }
}
```

---

### deleteCustomer

Delete a customer (soft delete).

```graphql
mutation DeleteCustomer($id: ID!) {
  deleteCustomer(id: $id) {
    id
    firstName
    lastName
    deletedAt
  }
}
```

---

### addCustomerCustomerTags

Add tags to a customer.

```graphql
mutation AddCustomerTags($customerId: ID!, $tagIds: [ID!]!) {
  addCustomerCustomerTags(customerId: $customerId, tagIds: $tagIds) {
    id
    firstName
    lastName
    tags {
      id
      name
      color
    }
  }
}
```

**Input:**
```json
{
  "customerId": "123",
  "tagIds": ["1", "2", "3"]
}
```

---

### createLead

Create a new lead.

```graphql
mutation CreateLead($input: CreateLeadInput!) {
  createLead(input: $input) {
    id
    firstName
    lastName
    email
    companyName
    status
    leadSource
    leadScore
    createdAt
  }
}
```

**Input:**
```json
{
  "input": {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@company.com",
    "companyName": "Tech Solutions Inc",
    "leadSource": "website",
    "leadScore": 75,
    "status": "new"
  }
}
```

---

### createOpportunity

Create a new sales opportunity.

```graphql
mutation CreateOpportunity($input: CreateOpportunityInput!) {
  createOpportunity(input: $input) {
    id
    name
    amount
    currency
    stage
    probability
    expectedCloseDate
    customer {
      id
      firstName
      lastName
      companyName
    }
    createdAt
  }
}
```

**Input:**
```json
{
  "input": {
    "name": "Enterprise Software License",
    "description": "Annual enterprise license for 500 users",
    "customerId": 123,
    "amount": 50000.00,
    "currency": "USD",
    "stage": "proposal",
    "probability": 60,
    "expectedCloseDate": "2024-03-31T00:00:00Z",
    "ownerUserId": 5
  }
}
```

---

### createInteraction

Log a customer interaction.

```graphql
mutation CreateInteraction($input: CreateInteractionInput!) {
  createInteraction(input: $input) {
    id
    customerId
    interactionType
    subject
    description
    interactionDate
    durationMinutes
    outcome
    createdAt
  }
}
```

**Input:**
```json
{
  "input": {
    "customerId": 123,
    "interactionType": "meeting",
    "subject": "Product Demo",
    "description": "Demonstrated new features to decision makers",
    "interactionDate": "2024-01-15T14:00:00Z",
    "durationMinutes": 45,
    "outcome": "successful"
  }
}
```

---

### createLoyaltyProgram

Create a new loyalty program.

```graphql
mutation CreateLoyaltyProgram($input: CreateLoyaltyProgramInput!) {
  createLoyaltyProgram(input: $input) {
    id
    name
    description
    pointsPerDollar
    tierThresholds
    tierMultipliers
    isActive
    createdAt
  }
}
```

**Input:**
```json
{
  "input": {
    "name": "VIP Rewards",
    "description": "Exclusive benefits for our loyal customers",
    "pointsPerDollar": 2.0,
    "pointsPerOrder": 100,
    "tierThresholds": {
      "bronze": 0,
      "silver": 1000,
      "gold": 2500,
      "platinum": 5000
    },
    "tierMultipliers": {
      "bronze": 1.0,
      "silver": 1.5,
      "gold": 2.0,
      "platinum": 3.0
    },
    "isActive": true
  }
}
```

---

### createLoyaltyTransaction

Record a loyalty points transaction.

```graphql
mutation CreateLoyaltyTransaction($input: CreateLoyaltyTransactionInput!) {
  createLoyaltyTransaction(input: $input) {
    id
    customerId
    transactionType
    pointsAmount
    balanceAfter
    description
    createdAt
  }
}
```

**Input (Earn points):**
```json
{
  "input": {
    "customerId": 123,
    "programId": 1,
    "transactionType": "earned",
    "pointsAmount": 250,
    "balanceAfter": 1250,
    "sourceType": "order",
    "sourceId": 456,
    "description": "Earned from order #456"
  }
}
```

**Input (Redeem points):**
```json
{
  "input": {
    "customerId": 123,
    "programId": 1,
    "transactionType": "redeemed",
    "pointsAmount": -500,
    "balanceAfter": 750,
    "sourceType": "reward_redemption",
    "rewardId": 10,
    "description": "Redeemed for $10 discount"
  }
}
```

---

### createEvent

Create a calendar event.

```graphql
mutation CreateEvent($input: CreateEventInput!) {
  createEvent(input: $input) {
    id
    title
    description
    startTime
    endTime
    eventType
    status
    priority
    attendees
    createdAt
  }
}
```

**Input:**
```json
{
  "input": {
    "title": "Customer Follow-up Call",
    "description": "Quarterly business review with Acme Corp",
    "startTime": "2024-02-01T10:00:00Z",
    "endTime": "2024-02-01T11:00:00Z",
    "eventType": "call",
    "status": "scheduled",
    "customerId": 123,
    "locationType": "virtual",
    "meetingUrl": "https://zoom.us/j/123456789",
    "attendees": ["john.doe@example.com", "jane.smith@acme.com"],
    "priority": "high",
    "reminders": [15, 60]
  }
}
```

---

## Filtering

### Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Exact match | `{ status: { equals: "active" } }` |
| `not` | Not equal | `{ status: { not: "inactive" } }` |
| `in` | In list | `{ status: { in: ["active", "prospect"] } }` |
| `gt` | Greater than | `{ lifetimeValue: { gt: 1000 } }` |
| `gte` | Greater or equal | `{ totalOrders: { gte: 5 } }` |
| `lt` | Less than | `{ leadScore: { lt: 50 } }` |
| `lte` | Less or equal | `{ amount: { lte: 10000 } }` |
| `contains` | Contains substring | `{ name: { contains: "test" } }` |
| `startsWith` | Starts with | `{ email: { startsWith: "john" } }` |
| `endsWith` | Ends with | `{ email: { endsWith: "@example.com" } }` |
| `and` | Logical AND | `{ and: [{ status: { equals: "active" } }, { lifetimeValue: { gt: 1000 } }] }` |
| `or` | Logical OR | `{ or: [{ status: { equals: "active" } }, { status: { equals: "prospect" } }] }` |

### Filter Examples

**Active customers with high value:**
```graphql
query {
  customers(
    where: {
      and: [
        { status: { equals: "active" } },
        { lifetimeValue: { gte: 5000 } }
      ]
    }
  ) {
    id
    firstName
    lastName
    lifetimeValue
  }
}
```

**Leads from specific sources:**
```graphql
query {
  leads(
    where: {
      leadSource: { in: ["website", "referral"] }
    }
  ) {
    id
    firstName
    lastName
    leadSource
  }
}
```

**Open opportunities in negotiation:**
```graphql
query {
  opportunities(
    where: {
      and: [
        { isActive: { equals: true } },
        { stage: { equals: "negotiation" } },
        { amount: { gte: 10000 } }
      ]
    }
  ) {
    id
    name
    amount
    stage
  }
}
```

**Search by email domain:**
```graphql
query {
  customers(
    where: {
      email: { endsWith: "@acme.com" }
    }
  ) {
    id
    firstName
    lastName
    email
    companyName
  }
}
```

---

## Sorting

### Sort Format

```graphql
query {
  customers(orderBy: { field: ASC }) {
    id
    firstName
  }
}
```

### Sort Examples

**Sort by name ascending:**
```graphql
query {
  customers(orderBy: { firstName: ASC }) {
    id
    firstName
    lastName
  }
}
```

**Sort by lifetime value descending:**
```graphql
query {
  customers(orderBy: { lifetimeValue: DESC }) {
    id
    firstName
    lastName
    lifetimeValue
  }
}
```

**Multi-field sorting:**
```graphql
query {
  customers(orderBy: [{ status: ASC }, { lifetimeValue: DESC }]) {
    id
    status
    lifetimeValue
  }
}
```

---

## Pagination

### Basic Pagination

```graphql
query {
  customers(limit: 20, offset: 0) {
    id
    firstName
    lastName
  }
}
```

**Second page:**
```graphql
query {
  customers(limit: 20, offset: 20) {
    id
    firstName
    lastName
  }
}
```

### With Total Count

```graphql
query {
  customers(limit: 20, offset: 0) {
    id
    firstName
    lastName
  }
  _customersMeta {
    count
  }
}
```

---

## Error Handling

### Permission Denied

```json
{
  "data": {
    "createCustomer": null
  },
  "errors": [
    {
      "message": "Permission denied: Role 'guest' not allowed to create Customer. Required roles: ['project_owner', 'admin', 'user']",
      "type": "Exception",
      "locations": [
        {
          "line": 1,
          "column": 12
        }
      ],
      "path": ["createCustomer"]
    }
  ]
}
```

**Solution**: Ensure you have a valid JWT token with appropriate permissions. See [Authentication](#authentication).

---

### Project ID Required

```json
{
  "data": {
    "customers": null
  },
  "errors": [
    {
      "message": "Project ID is required. Please provide 'project-id' header or ensure it is in your auth token.",
      "type": "Exception"
    }
  ]
}
```

**Solution**: Include `x-project-id` header with your request.

---

### Validation Error

```json
{
  "data": {
    "createCustomer": null
  },
  "errors": [
    {
      "message": "Validation error: 'email' is required",
      "type": "ValidationError"
    }
  ]
}
```

**Solution**: Ensure all required fields are included in your mutation input.

---

### Not Found

```json
{
  "data": {
    "customer": null
  },
  "errors": [
    {
      "message": "Customer with id '999' not found",
      "type": "NotFound"
    }
  ]
}
```

**Solution**: Verify the ID exists in the database.

---

## Best Practices

### 1. Always Include Required Headers

```bash
curl -X POST http://localhost:4005/graphql \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-project-id: 1" \
  -H "Content-Type: application/json" \
  -d '{"query": "..."}'
```

---

### 2. Use Query Fragments for Reusability

```graphql
fragment CustomerBasic on Customer {
  id
  firstName
  lastName
  email
  companyName
  status
}

query GetCustomers {
  customers {
    ...CustomerBasic
  }
}

query GetCustomer($id: ID!) {
  customer(id: $id) {
    ...CustomerBasic
    lifetimeValue
    totalSpent
  }
}
```

---

### 3. Request Only Needed Fields

**Bad:**
```graphql
query {
  customers {
    id
    firstName
    lastName
    email
    phone
    company
    addressLine1
    addressLine2
    city
    state
    country
    postalCode
    # ... 20 more fields
  }
}
```

**Good:**
```graphql
query {
  customers {
    id
    firstName
    lastName
    email
    companyName
  }
}
```

---

### 4. Use Aliases for Multiple Fields

```graphql
query {
  activeCustomers: customers(where: { status: { equals: "active" } }) {
    id
    firstName
    lastName
  }
  inactiveCustomers: customers(where: { status: { equals: "inactive" } }) {
    id
    firstName
    lastName
  }
}
```

---

### 5. Implement Pagination for Large Lists

```graphql
query GetCustomersPaginated($limit: Int, $offset: Int) {
  customers(limit: $limit, offset: $offset) {
    id
    firstName
    lastName
    email
  }
  _customersMeta {
    count
  }
}
```

---

### 6. Use Variables for Dynamic Queries

**Bad:**
```graphql
mutation {
  createCustomer(input: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com"
  }) {
    id
  }
}
```

**Good:**
```graphql
mutation CreateCustomer($input: CreateCustomerInput!) {
  createCustomer(input: $input) {
    id
  }
}
```

**Variables:**
```json
{
  "input": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

---

### 7. Handle Errors Gracefully

```typescript
const { data, error } = await client.query({
  query: GET_CUSTOMERS,
  variables: { limit: 20 }
});

if (error) {
  // Handle GraphQL errors
  error.graphQLErrors.forEach(err => {
    console.error(err.message);
  });
}

if (data && data.customers) {
  // Process data
}
```

---

### 8. Cache Frequently Accessed Data

```typescript
const { data, loading } = useQuery(GET_CUSTOMERS, {
  fetchPolicy: 'cache-first', // Use cache if available
  nextFetchPolicy: 'cache-and-network'
});
```

---

### 9. Use Batching for Multiple Mutations

```graphql
mutation BatchUpdate(
  $updateCustomer: UpdateCustomerInput
  $addTags: [ID!]!
) {
  updateCustomer(id: "123", input: $updateCustomer) {
    id
  }
  addCustomerCustomerTags(customerId: "123", tagIds: $addTags) {
    id
  }
}
```

---

### 10. Monitor Query Complexity

```graphql
query {
  customers {
    id
    tags {
      id
      customers {  # Nested relationship - be careful!
        id
      }
    }
  }
}
```

**Avoid deep nesting** to prevent performance issues.

---

## Testing the API

### Using cURL

**Query:**
```bash
curl -X POST http://localhost:4005/graphql \
  -H "x-project-id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { customers(limit: 5) { id firstName lastName email } }"
  }'
```

**Mutation:**
```bash
curl -X POST http://localhost:4005/graphql \
  -H "x-project-id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createCustomer(input: { firstName: \"Test\", lastName: \"User\", email: \"test@example.com\" }) { id firstName lastName } }"
  }'
```

---

### Using Postman

1. Set method to `POST`
2. URL: `http://localhost:4005/graphql`
3. Headers:
   - `x-project-id`: `1`
   - `Authorization`: `Bearer YOUR_TOKEN`
   - `Content-Type`: `application/json`
4. Body (raw JSON):
```json
{
  "query": "query { customers { id firstName lastName } }"
}
```

---

### Using GraphQL Playground

Navigate to `http://localhost:4005/graphql` in your browser to use the built-in GraphQL Playground (if enabled).

---

## Schema Introspection

Get the full schema:

```graphql
query {
  __schema {
    queryType {
      fields {
        name
        description
      }
    }
    mutationType {
      fields {
        name
        description
      }
    }
  }
}
```

Get type details:

```graphql
query {
  __type(name: "Customer") {
    name
    description
    fields {
      name
      type {
        name
        kind
      }
    }
  }
}
```

---

## Support & Resources

- **Documentation**: [ZoneVast Docs](https://docs.zonevast.com)
- **Issues**: [GitHub Issues](https://github.com/zonevast/customer-graphql/issues)
- **Service Source**: `/services/graphql/autoapi-projects/customer-graphql/`
- **Frontend App**: [CustomerSuite](../../apps/CustomerSuite/)

---

## Changelog

### Version 1.0.0 (2024-01-15)

**Initial Release**
- 16 CRM models implemented
- GraphQL API with full CRUD operations
- Project scoping and RBAC
- Soft delete, search, filtering, sorting, pagination
- Loyalty program management
- Calendar and event management
- Email campaign tracking
- Messaging and chat functionality

---

**Last Updated**: 2024-01-15
**Service Version**: v1
**Schema Version**: 1.0.0
