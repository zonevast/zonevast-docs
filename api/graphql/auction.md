# Auction GraphQL API Reference

**Service:** auction-graphql
**Version:** v1
**Status:** Active
**Last Updated:** 2026-01-12

---

## Overview

The Auction GraphQL service provides a complete API for managing auction listings, bidding system, and group buying campaigns. Built with the Auto-API framework, it automatically generates GraphQL schemas from Python models with full CRUD operations, filtering, pagination, search, and role-based authentication.

### Key Features

- **Auction Management** - Create, schedule, and manage auction listings
- **Real-time Bidding** - Bid placement, auto-bidding, and bid tracking
- **Group Buying** - Group deal campaigns with participant management
- **Auction Extensions** - Auto-extend auctions when bids placed near end
- **Reserve Pricing** - Hidden minimum price support
- **Buy Now Option** - Instant purchase functionality
- **Role-based Permissions** - Public read, authenticated write operations
- **Soft Delete** - Built-in trash/restore functionality

---

## Endpoint URLs

### Environment URLs

| Environment | GraphQL Endpoint |
|------------|------------------|
| **Production** | `https://api.zonevast.com/graphql/auction` |
| **Staging** | `https://test.zonevast.com/graphql/auction` |

### Service Configuration

- **Service Name:** `auction`
- **Database Schema:** `auction`
- **Default Port:** 4009
- **Translation:** Disabled (English/Arabic planned)
- **CORS:** Enabled
- **JWT:** Enabled

---

## Authentication

### JWT Token Required

Most mutations require authentication. Include JWT token in the Authorization header:

```bash
curl -X POST https://test.zonevast.com/graphql/auction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query": "mutation { createAuction(...) }"}'
```

### Getting a JWT Token

```bash
# Login via auth service
curl -X POST https://test.zonevast.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

### Project Context

All operations include a `project_id` context, automatically injected from:

1. **Header:** `X-Project-Id: 1`
2. **JWT Token:** Included in token claims
3. **Auto-population:** From authenticated user context

**Default:** `project_id = 11` (fallback for backward compatibility)

---

## Available Models

The service includes the following GraphQL models:

| Model | Table | Description | Public Read | Auth Write |
|-------|-------|-------------|-------------|------------|
| **Auction** | `auctions` | Auction listings | Yes | User, Admin |
| **Bid** | `bids` | Auction bids | No | User, Admin |
| **GroupBuying** | `group_buying` | Group deal campaigns | Yes | User, Admin |
| **GroupParticipant** | `group_participants` | Group deal participants | No | User, Admin |

### Permission Matrix

| Operation | Auction | Bid | GroupBuying | GroupParticipant |
|-----------|---------|-----|-------------|------------------|
| **Read (List)** | Public | Auth | Public | Auth |
| **Create** | Auth | Auth | Auth | Auth |
| **Update** | Admin | Admin | Admin | Admin |
| **Delete** | Admin | Admin | Admin | User (own) |

**Roles:** `user`, `project_user`, `project_owner`, `admin`

---

## Auction Schema

### Type Definition

```graphql
type Auction {
  id: ID!
  title: String!
  description: String
  slug: String!
  productId: Int!
  sellerId: Int!
  winnerId: Int
  startPrice: Float!
  currentBid: Float
  reservePrice: Float
  buyNowPrice: Float
  startTime: DateTime!
  endTime: DateTime!
  status: String!
  bidIncrement: Float
  autoExtend: Boolean
  autoExtendMinutes: Int
  totalBids: Int
  viewCount: Int
  finalPrice: Float
  projectId: Int
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Yes | Unique identifier |
| `title` | String | Yes | Auction title (searchable) |
| `description` | String | No | Detailed description (max 5000 chars) |
| `slug` | String | Yes | URL-friendly identifier (auto-generated) |
| `productId` | Int | Yes | Reference to product |
| `sellerId` | Int | Yes | Reference to seller/user |
| `winnerId` | Int | No | Winning bidder ID (when auction ends) |
| `startPrice` | Float | Yes | Starting bid amount |
| `currentBid` | Float | No | Current highest bid |
| `reservePrice` | Float | No | Hidden minimum price |
| `buyNowPrice` | Float | No | Instant purchase price |
| `startTime` | DateTime | Yes | Auction start timestamp |
| `endTime` | DateTime | Yes | Auction end timestamp |
| `status` | String | Yes | Auction status (see choices) |
| `bidIncrement` | Float | No | Minimum bid increment (default: 1000) |
| `autoExtend` | Boolean | No | Enable auto-extension (default: true) |
| `autoExtendMinutes` | Int | No | Extension minutes (default: 5) |
| `totalBids` | Int | No | Total number of bids |
| `viewCount` | Int | No | Number of views |
| `finalPrice` | Float | No | Final sale price |
| `projectId` | Int | No | Project scope |
| `createdAt` | DateTime | No | Creation timestamp |
| `updatedAt` | DateTime | No | Last update timestamp |
| `deletedAt` | DateTime | No | Soft delete timestamp |

### Status Choices

- `draft` - Draft, not visible publicly
- `scheduled` - Scheduled to start
- `active` - Currently active
- `paused` - Temporarily paused
- `ended` - Auction ended
- `cancelled` - Auction cancelled
- `sold` - Item sold

### Filterable Fields

- `productId`, `sellerId`, `winnerId`
- `startPrice`, `currentBid`, `reservePrice`, `buyNowPrice`, `finalPrice`
- `startTime`, `endTime`
- `status`

---

## Bid Schema

### Type Definition

```graphql
type Bid {
  id: ID!
  auctionId: Int!
  bidderId: Int!
  amount: Float!
  status: String
  isAutoBid: Boolean
  maxAmount: Float
  ipAddress: String
  userAgent: String
  projectId: Int
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Yes | Unique identifier |
| `auctionId` | Int | Yes | Reference to auction |
| `bidderId` | Int | Yes | Reference to bidder/user |
| `amount` | Float | Yes | Bid amount |
| `status` | String | No | Bid status (default: active) |
| `isAutoBid` | Boolean | No | Auto-bid flag (default: false) |
| `maxAmount` | Float | No | Maximum auto-bid amount |
| `ipAddress` | String | No | Bidder IP address |
| `userAgent` | String | No | Bidder user agent |
| `projectId` | Int | No | Project scope |
| `createdAt` | DateTime | No | Creation timestamp |
| `updatedAt` | DateTime | No | Last update timestamp |
| `deletedAt` | DateTime | No | Soft delete timestamp |

### Status Choices

- `active` - Currently winning
- `outbid` - Outbid by another bidder
- `winning` - Winning at auction end
- `cancelled` - Cancelled

### Filterable Fields

- `auctionId`, `bidderId`
- `amount`, `maxAmount`
- `status`

---

## GroupBuying Schema

### Type Definition

```graphql
type GroupBuying {
  id: ID!
  title: String!
  description: String
  slug: String!
  productId: Int!
  originalPrice: Float!
  dealPrice: Float!
  minParticipants: Int!
  maxParticipants: Int!
  currentParticipants: Int
  startTime: DateTime!
  endTime: DateTime!
  status: String!
  isUnlocked: Boolean
  autoCreateOrder: Boolean
  projectId: Int
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Yes | Unique identifier |
| `title` | String | Yes | Deal title (searchable) |
| `description` | String | No | Deal description (max 5000 chars) |
| `slug` | String | Yes | URL-friendly identifier (auto-generated) |
| `productId` | Int | Yes | Reference to product |
| `originalPrice` | Float | Yes | Original product price |
| `dealPrice` | Float | Yes | Discounted deal price |
| `minParticipants` | Int | Yes | Minimum participants to unlock |
| `maxParticipants` | Int | Yes | Maximum participants allowed |
| `currentParticipants` | Int | No | Current participant count |
| `startTime` | DateTime | Yes | Deal start timestamp |
| `endTime` | DateTime | Yes | Deal end timestamp |
| `status` | String | Yes | Deal status |
| `isUnlocked` | Boolean | No | Deal unlocked flag |
| `autoCreateOrder` | Boolean | No | Auto-create orders (default: true) |
| `projectId` | Int | No | Project scope |
| `createdAt` | DateTime | No | Creation timestamp |
| `updatedAt` | DateTime | No | Last update timestamp |
| `deletedAt` | DateTime | No | Soft delete timestamp |

### Status Choices

- `draft` - Draft, not visible
- `scheduled` - Scheduled to start
- `active` - Currently active
- `unlocked` - Minimum participants reached
- `completed` - Deal completed
- `cancelled` - Deal cancelled
- `expired` - Deal expired

### Filterable Fields

- `productId`
- `originalPrice`, `dealPrice`
- `minParticipants`, `maxParticipants`, `currentParticipants`
- `startTime`, `endTime`
- `status`

---

## GroupParticipant Schema

### Type Definition

```graphql
type GroupParticipant {
  id: ID!
  dealId: Int!
  userId: Int!
  orderId: Int
  status: String
  paymentStatus: String
  projectId: Int
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Yes | Unique identifier |
| `dealId` | Int | Yes | Reference to group buying deal |
| `userId` | Int | Yes | Reference to user |
| `orderId` | Int | No | Reference to created order |
| `status` | String | No | Participation status (default: joined) |
| `paymentStatus` | String | No | Payment status (default: pending) |
| `projectId` | Int | No | Project scope |
| `createdAt` | DateTime | No | Creation timestamp |
| `updatedAt` | DateTime | No | Last update timestamp |
| `deletedAt` | DateTime | No | Soft delete timestamp |

### Status Choices

**Participation Status:**
- `joined` - Joined the deal
- `confirmed` - Participation confirmed
- `cancelled` - Cancelled participation
- `refunded` - Refunded

**Payment Status:**
- `pending` - Payment pending
- `paid` - Paid successfully
- `failed` - Payment failed
- `refunded` - Refunded

### Filterable Fields

- `dealId`, `userId`, `orderId`
- `status`, `paymentStatus`

---

## Queries

### List Auctions

```graphql
query GetAuctions($filter: AuctionFilter, $pagination: Pagination) {
  auctions(filter: $filter, pagination: $pagination) {
    id
    title
    slug
    productId
    startPrice
    currentBid
    status
    startTime
    endTime
  }
}
```

**Variables:**
```json
{
  "filter": {
    "status": { "equals": "active" },
    "startTime": { "lte": "2026-01-12T10:00:00Z" },
    "endTime": { "gte": "2026-01-20T10:00:00Z" }
  },
  "pagination": {
    "limit": 20,
    "offset": 0
  }
}
```

### Get Single Auction

```graphql
query GetAuction($id: ID!) {
  auction(id: $id) {
    id
    title
    description
    productId
    sellerId
    startPrice
    currentBid
    buyNowPrice
    status
    totalBids
    viewCount
  }
}
```

### Search Auctions

```graphql
query SearchAuctions($search: String!) {
  searchAuctions(search: $search) {
    id
    title
    description
    slug
    status
  }
}
```

### List Bids

```graphql
query GetBids($auctionId: Int!) {
  bids(filter: {
    auctionId: { "equals": $auctionId }
  }) {
    id
    auctionId
    bidderId
    amount
    status
    createdAt
  }
}
```

### List Group Buying Deals

```graphql
query GetGroupDeals($filter: GroupBuyingFilter) {
  groupBuyings(filter: $filter) {
    id
    title
    slug
    productId
    originalPrice
    dealPrice
    minParticipants
    currentParticipants
    isUnlocked
    status
  }
}
```

### Get Group Participants

```graphql
query GetGroupParticipants($dealId: Int!) {
  groupParticipants(filter: {
    dealId: { "equals": $dealId }
  }) {
    id
    dealId
    userId
    status
    paymentStatus
    createdAt
  }
}
```

---

## Mutations

### Create Auction

**Required Roles:** `user`, `project_user`, `project_owner`, `admin`

```graphql
mutation CreateAuction($input: AuctionInput!) {
  createAuction(input: $input) {
    id
    title
    slug
    productId
    sellerId
    startPrice
    status
  }
}
```

**Input:**
```json
{
  "input": {
    "title": "Vintage Camera Auction",
    "description": "Rare vintage camera in excellent condition",
    "slug": "vintage-camera-auction",
    "productId": 123,
    "sellerId": 456,
    "startPrice": 5000,
    "reservePrice": 10000,
    "buyNowPrice": 15000,
    "startTime": "2026-01-15T10:00:00Z",
    "endTime": "2026-01-25T22:00:00Z",
    "status": "scheduled",
    "bidIncrement": 500,
    "autoExtend": true,
    "autoExtendMinutes": 5
  }
}
```

**Note:** If `slug` is not provided, it will be auto-generated from `title`.

### Update Auction

**Required Roles:** `admin`

```graphql
mutation UpdateAuction($id: ID!, $input: AuctionInput!) {
  updateAuction(id: $id, input: $input) {
    id
    title
    status
    currentBid
    totalBids
  }
}
```

### Delete Auction

**Required Roles:** `admin`

```graphql
mutation DeleteAuction($id: ID!) {
  deleteAuction(id: $id) {
    id
    deletedAt
  }
}
```

### Place Bid

**Required Roles:** `user`, `project_user`, `project_owner`, `admin`

```graphql
mutation PlaceBid($input: BidInput!) {
  createBid(input: $input) {
    id
    auctionId
    bidderId
    amount
    status
    createdAt
  }
}
```

**Input:**
```json
{
  "input": {
    "auctionId": 789,
    "bidderId": 456,
    "amount": 7500,
    "isAutoBid": false,
    "maxAmount": null
  }
}
```

### Place Auto-Bid

**Required Roles:** `user`, `project_user`, `project_owner`, `admin`

```graphql
mutation CreateAutoBid($input: BidInput!) {
  createBid(input: $input) {
    id
    auctionId
    bidderId
    amount
    isAutoBid
    maxAmount
    status
  }
}
```

**Input:**
```json
{
  "input": {
    "auctionId": 789,
    "bidderId": 456,
    "amount": 7500,
    "isAutoBid": true,
    "maxAmount": 12000
  }
}
```

### Create Group Buying Deal

**Required Roles:** `user`, `project_user`, `project_owner`, `admin`

```graphql
mutation CreateGroupBuying($input: GroupBuyingInput!) {
  createGroupBuying(input: $input) {
    id
    title
    slug
    productId
    originalPrice
    dealPrice
    minParticipants
    maxParticipants
    status
  }
}
```

**Input:**
```json
{
  "input": {
    "title": "Bulk Electronics Deal",
    "description": "Get 50% off when 10 people join",
    "slug": "bulk-electronics-deal",
    "productId": 234,
    "originalPrice": 20000,
    "dealPrice": 10000,
    "minParticipants": 10,
    "maxParticipants": 50,
    "startTime": "2026-01-15T00:00:00Z",
    "endTime": "2026-01-30T23:59:59Z",
    "status": "scheduled",
    "autoCreateOrder": true
  }
}
```

### Join Group Buying Deal

**Required Roles:** `user`, `project_user`, `project_owner`, `admin`

```graphql
mutation JoinGroupDeal($input: GroupParticipantInput!) {
  createGroupParticipant(input: $input) {
    id
    dealId
    userId
    status
    paymentStatus
    createdAt
  }
}
```

**Input:**
```json
{
  "input": {
    "dealId": 345,
    "userId": 456,
    "status": "joined",
    "paymentStatus": "pending"
  }
}
```

### Leave Group Deal

**Required Roles:** `user`, `project_user`, `project_owner`, `admin`

```graphql
mutation LeaveGroupDeal($id: ID!) {
  deleteGroupParticipant(id: $id) {
    id
    deletedAt
  }
}
```

---

## Filtering

### Filter Operators

All filterable fields support the following operators:

| Operator | Type | Example |
|----------|------|---------|
| `equals` | Any | `{"status": {"equals": "active"}}` |
| `notEquals` | Any | `{"status": {"notEquals": "draft"}}` |
| `in` | Any | `{"status": {"in": ["active", "ended"]}}` |
| `gt` | Number, Date | `{"startPrice": {"gt": 1000}}` |
| `gte` | Number, Date | `{"startPrice": {"gte": 1000}}` |
| `lt` | Number, Date | `{"startTime": {"lt": "2026-01-20"}}` |
| `lte` | Number, Date | `{"endTime": {"lte": "2026-01-30"}}` |
| `contains` | String | `{"title": {"contains": "camera"}}` |
| `startsWith` | String | `{"slug": {"startsWith": "vintage-"}}` |
| `endsWith` | String | `{"slug": {"endsWith": "-auction"}}` |

### Logical Operators

Combine filters with logical operators:

```json
{
  "filter": {
    "AND": [
      {"status": {"equals": "active"}},
      {"startTime": {"lte": "2026-01-12T10:00:00Z"}},
      {"endTime": {"gte": "2026-01-20T10:00:00Z"}}
    ]
  }
}
```

```json
{
  "filter": {
    "OR": [
      {"status": {"equals": "active"}},
      {"status": {"equals": "scheduled"}}
    ]
  }
}
```

### Example Filters

**Active auctions:**
```json
{
  "filter": {
    "status": {"equals": "active"}
  }
}
```

**Auctions ending soon:**
```json
{
  "filter": {
    "endTime": {
      "lte": "2026-01-15T23:59:59Z",
      "gte": "2026-01-12T00:00:00Z"
    }
  }
}
```

**Auctions by seller:**
```json
{
  "filter": {
    "sellerId": {"equals": 456}
  }
}
```

**Bids for auction:**
```json
{
  "filter": {
    "auctionId": {"equals": 789},
    "status": {"equals": "winning"}
  }
}
```

**Unlocked group deals:**
```json
{
  "filter": {
    "isUnlocked": {"equals": true}
  }
}
```

---

## Pagination

### Offset Pagination

```graphql
query GetAuctionsPage($page: Int!, $limit: Int!) {
  auctions(pagination: {
    offset: ($page - 1) * $limit,
    limit: $limit
  }) {
    id
    title
  }
}
```

**Example:**
```json
{
  "pagination": {
    "offset": 0,
    "limit": 20
  }
}
```

### Cursor Pagination

```graphql
query GetAuctionsCursor($first: Int, $after: String) {
  auctionsCursor(first: $first, after: $after) {
    edges {
      node {
        id
        title
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
    totalCount
  }
}
```

---

## Sorting

```graphql
query GetSortedAuctions {
  auctions(sort: [
    { field: "endTime", order: "ASC" },
    { field: "startPrice", order: "DESC" }
  ]) {
    id
    title
    endTime
    startPrice
  }
}
```

**Available Sort Fields:** All filterable fields

**Order:** `ASC` or `DESC`

---

## Error Handling

### Common Errors

**Authentication Required:**
```json
{
  "errors": [
    {
      "message": "Permission denied: Role 'guest' not allowed to create Auction. Required roles: ['user', 'project_user', 'project_owner', 'admin']",
      "type": "Exception"
    }
  ]
}
```

**Validation Error:**
```json
{
  "errors": [
    {
      "message": "Validation error: startPrice is required",
      "type": "ValidationError"
    }
  ]
}
```

**Not Found:**
```json
{
  "errors": [
    {
      "message": "Auction with id '999' not found",
      "type": "NotFoundError"
    }
  ]
}
```

---

## Lifecycle Hooks

### Auction Hooks

**Before Create:**
- Auto-generates `slug` from `title` if not provided

**Before Update:**
- Updates `slug` if `title` changed

### Group Buying Hooks

**Before Create:**
- Auto-generates `slug` from `title` if not provided
- Sets `isUnlocked = true` if `currentParticipants >= minParticipants`
- Sets `status = unlocked` when deal unlocks

**Before Update:**
- Updates `isUnlocked` and `status` when participants reach minimum

### Bid Hooks

**Before Create:**
- Sets `status = active` if not provided

### GroupParticipant Hooks

**Before Create:**
- Sets `status = joined` if not provided

---

## Testing Examples

### Test Auction Creation

```bash
curl -X POST https://test.zonevast.com/graphql/auction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateAuction($input: AuctionInput!) { createAuction(input: $input) { id title slug status } }",
    "variables": {
      "input": {
        "title": "Test Auction",
        "slug": "test-auction-123",
        "productId": 1,
        "sellerId": 1,
        "startPrice": 1000,
        "startTime": "2026-01-12T10:00:00Z",
        "endTime": "2026-01-20T10:00:00Z",
        "status": "active"
      }
    }
  }'
```

### Test Query Auctions

```bash
curl -X POST https://test.zonevast.com/graphql/auction \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { auctions(filter: { status: { equals: \"active\" } }) { id title slug startPrice currentBid status } }"
  }'
```

### Test Create Bid

```bash
curl -X POST https://test.zonevast.com/graphql/auction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation PlaceBid($input: BidInput!) { createBid(input: $input) { id auctionId amount status } }",
    "variables": {
      "input": {
        "auctionId": 1,
        "bidderId": 1,
        "amount": 1500
      }
    }
  }'
```

### Test Group Buying

```bash
curl -X POST https://test.zonevast.com/graphql/auction \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { groupBuyings { id title slug originalPrice dealPrice minParticipants currentParticipants isUnlocked status } }"
  }'
```

---

## Deployment

### Lambda Deployment

```bash
cd /home/yousef/Documents/workspace/zonevast/services/graphql/autoapi-projects/auction-graphql
python3 deploy_lambda.py
```

### Environment Variables

**Environment Variables:**
- `JWT_SECRET` - JWT signing secret
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Database connection

---

## Best Practices

### Auction Management

1. **Slug Management:** Let the system auto-generate slugs from titles
2. **Reserve Price:** Use hidden reserve prices for seller protection
3. **Auto-Extend:** Enable auto-extend for competitive bidding
4. **Status Flow:** Use `draft` → `scheduled` → `active` → `ended` → `sold`

### Bidding Strategy

1. **Minimum Bids:** Enforce `bidIncrement` to prevent bid spamming
2. **Auto-Bids:** Implement auto-bidding with `maxAmount` limits
3. **Bid Tracking:** Monitor `totalBids` and `viewCount` for analytics

### Group Buying

1. **Participant Limits:** Set realistic `minParticipants` and `maxParticipants`
2. **Auto-Create Orders:** Enable `autoCreateOrder` for seamless checkout
3. **Unlock Notifications:** Monitor `isUnlocked` status changes

### Security

1. **Authentication:** Always use JWT tokens for mutations
2. **Project Scoping:** Verify `project_id` in all operations
3. **Permission Checks:** Validate user roles before updates/deletes

---

## Related Services

- **Product Service** - Get product details for auctions
- **Auth Service** - User authentication and JWT tokens
- **Order Service** - Create orders for buy-now and completed auctions
- **Billing Service** - Process payments for winning bids

---

## Changelog

### Version 1.0 (2026-01-12)

- Initial release
- Auction model with full CRUD
- Bid model with auto-bid support
- Group buying model
- Group participant model
- Role-based permissions
- Soft delete support
- Auto-extend functionality
- Lifecycle hooks

---

## Support

For issues or questions:
- Check logs: `/tmp/auction-graphql.log`
- Database schema: `auction` schema
- Service logs in CloudWatch (production)
