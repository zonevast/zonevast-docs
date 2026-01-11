# Order GraphQL API Reference

**Service:** `order-graphql`
**Version:** v1
**Default Port:** 4001
**Base URL:** `http://localhost:4001/graphql` (local) | `https://api.zonevast.com/graphql/order/en/v1/graphql` (production)

## Overview

The Order GraphQL service handles order management, order products (line items), order statuses, tags, returns, and payments. It integrates with billing and inventory services through ServiceBindings for automatic invoice creation and stock management.

## Authentication

All mutations require JWT authentication. Include the token in the Authorization header:

```bash
curl -X POST http://localhost:4001/graphql \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"query": "..."}'
```

## Models

### 1. Order

Main order model representing customer orders.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID! | - | Unique order identifier |
| `customerId` | Int | No | Customer ID from auth service |
| `mainStatus` | String | No | Main status category (default: "pending") |
| `statusId` | Int | No | Reference to custom Status |
| `note` | String | No | Order notes (max 2000 chars) |
| `totalAmount` | Float! | Yes | Total order amount |
| `invoiceId` | Int | No | Reference to billing invoice |
| `projectId` | Int! | Yes | Project ID for multi-tenancy |
| `createdAt` | DateTime | - | Creation timestamp |
| `updatedAt` | DateTime | - | Last update timestamp |

#### Relationships

- `status` - Status (many-to-one)
- `tags` - Tag (many-to-many)
- `orderProducts` - OrderProduct (one-to-many)

#### Permissions

| Operation | Roles |
|-----------|-------|
| create | project_user, project_owner, admin |
| read | project_user, project_owner, admin |
| update | project_owner, admin, or order customer |
| delete | project_owner, admin |

#### Service Bindings

**After Create:**
- Creates invoice in billing service (async, optional)
- Maps `invoice_id` to order

**After Update:**
- When `main_status` changes to "completed": Creates transaction in billing service

---

### 2. OrderProduct

Line items within an order.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID! | - | Unique identifier |
| `orderId` | Int! | Yes | Parent order ID |
| `productId` | Int! | Yes | Product ID from product service |
| `inventoryId` | Int | No | Inventory ID for stock tracking |
| `quantity` | Int! | Yes | Quantity ordered (default: 1) |
| `unitPrice` | Float! | Yes | Price per unit |
| `totalPrice` | Float! | Yes | Total price (quantity × unitPrice) |
| `projectId` | Int! | Yes | Project ID |
| `createdAt` | DateTime | - | Creation timestamp |
| `updatedAt` | DateTime | - | Last update timestamp |

#### Relationships

- `order` - Order (many-to-one)

#### Permissions

| Operation | Roles |
|-----------|-------|
| create | project_user, project_owner, admin |
| read | project_user, project_owner, admin |
| update | project_owner, admin |
| delete | project_owner, admin |

#### Service Bindings

**After Create:**
- Decrements inventory stock via inventory service (async, optional)

---

### 3. Status

Custom order statuses with translations.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID! | - | Unique identifier |
| `name` | String! | Yes | Status name (translatable, searchable) |
| `description` | String | No | Description (translatable) |
| `mainStatus` | String | No | Main category (default: "pending") |
| `isActive` | Boolean | No | Active flag (default: true) |
| `isCustomerVisible` | Boolean | No | Show to customers (default: true) |
| `order` | Int | No | Sort order (default: 0) |
| `projectId` | Int! | Yes | Project ID |

#### Permissions

| Operation | Roles |
|-----------|-------|
| create, read, update, delete | project_owner, admin |

---

### 4. Tag

Order tags for categorization.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID! | - | Unique identifier |
| `name` | String! | Yes | Tag name (unique, searchable) |
| `color` | String | No | Hex color code (default: "#FFFFFF") |
| `projectId` | Int! | Yes | Project ID |

#### Permissions

| Operation | Roles |
|-----------|-------|
| create, read, update, delete | project_owner, admin |

---

### 5. ReturnReason

Predefined reasons for order returns.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID! | - | Unique identifier |
| `reason` | String! | Yes | Reason category (DAMAGED, DEFECTIVE, NOT_AS_DESCRIBED, OTHER) |
| `description` | String | No | Detailed description |
| `projectId` | Int! | Yes | Project ID |

#### Permissions

| Operation | Roles |
|-----------|-------|
| create, read, update, delete | project_owner, admin |

---

### 6. OrderReturn

Return/refund requests for orders.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID! | - | Unique identifier |
| `orderId` | Int! | Yes | Order being returned |
| `returnType` | String | No | Type: partial, full, store_credit (default: "full") |
| `status` | String | No | Status: pending, processing, completed, canceled (default: "pending") |
| `reasonId` | Int | No | Reference to ReturnReason |
| `note` | String | No | Return notes |
| `resolvedDate` | DateTime | No | Resolution date |
| `projectId` | Int! | Yes | Project ID |
| `createdAt` | DateTime | - | Creation timestamp |
| `updatedAt` | DateTime | - | Last update timestamp |

#### Relationships

- `order` - Order (many-to-one)
- `reason` - ReturnReason (many-to-one)
- `returnProducts` - ReturnOrderRating (one-to-many)

#### Permissions

| Operation | Roles |
|-----------|-------|
| create | project_user, project_owner, admin |
| read | project_owner, admin, or order customer |
| update, delete | project_owner, admin |

---

### 7. ReturnOrderRating

Product ratings within returns.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID! | - | Unique identifier |
| `orderReturnId` | Int! | Yes | Parent return ID |
| `productId` | Int! | Yes | Product being rated |
| `rating` | Int! | Yes | Rating 1-5 |
| `isDamaged` | Boolean | No | Product damaged flag (default: false) |
| `quantity` | Int! | Yes | Quantity being returned (default: 1) |
| `createdAt` | DateTime | - | Creation timestamp |
| `updatedAt` | DateTime | - | Last update timestamp |

#### Relationships

- `orderReturn` - OrderReturn (many-to-one)

#### Permissions

| Operation | Roles |
|-----------|-------|
| create, read | project_user, project_owner, admin |
| update, delete | project_owner, admin |

---

### 8. Payment

Payment tracking for orders.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID! | - | Unique identifier |
| `orderId` | Int! | Yes | Order ID |
| `paymentMethod` | String! | Yes | Method: credit_card, debit_card, cash, bank_transfer, wallet |
| `amount` | Float! | Yes | Payment amount |
| `status` | String | No | Status: pending, processing, completed, failed, refunded (default: "pending") |
| `transactionReference` | String | No | Gateway transaction ID |
| `paymentDate` | DateTime | No | Payment completion date |
| `notes` | String | No | Payment notes |
| `projectId` | Int! | Yes | Project ID |
| `createdAt` | DateTime | - | Creation timestamp |
| `updatedAt` | DateTime | - | Last update timestamp |

#### Relationships

- `order` - Order (many-to-one)

#### Permissions

| Operation | Roles |
|-----------|-------|
| create | project_user, project_owner, admin |
| read | project_owner, admin, or order customer |
| update, delete | project_owner, admin |

---

## Query Operations

### Get Orders (List)

```graphql
query GetOrders($limit: Int, $offset: Int, $where: JSONString, $search: String, $sortBy: String) {
  orders(limit: 10, offset: 0, where: "{\"mainStatus\": \"completed\"}", search: "gift", sortBy: "-createdAt") {
    id
    customerId
    mainStatus
    note
    totalAmount
    projectId
    createdAt
    status {
      id
      name
    }
    tags {
      id
      name
      color
    }
    orderProducts {
      id
      productId
      quantity
      totalPrice
    }
  }
}
```

**Parameters:**
- `limit` - Max results (default: 50)
- `offset` - Pagination offset
- `where` - JSON filter string
- `search` - Full-text search
- `sortBy` - Sort field (prefix `-` for descending)

**Filterable Fields:** `customer_id`, `main_status`, `status_id`, `project_id`
**Sortable Fields:** `created_at`, `total_amount`
**Searchable Fields:** `note`

---

### Get Order by ID

```graphql
query GetOrder($id: ID!) {
  order(id: $id) {
    id
    customerId
    mainStatus
    statusId
    note
    totalAmount
    invoiceId
    projectId
    createdAt
    updatedAt
    status {
      id
      name
      mainStatus
    }
    tags {
      id
      name
      color
    }
    orderProducts {
      id
      productId
      quantity
      unitPrice
      totalPrice
    }
  }
}
```

---

### Get Order Products

```graphql
query GetOrderProducts($orderId: Int!) {
  orderProducts(where: "{\"order_id\": $orderId}") {
    id
    orderId
    productId
    inventoryId
    quantity
    unitPrice
    totalPrice
    order {
      id
      totalAmount
    }
  }
}
```

**Filterable Fields:** `order_id`, `product_id`, `project_id`
**Sortable Fields:** `quantity`, `total_price`

---

### Get Statuses

```graphql
query GetStatuses {
  statuses(where: "{\"is_active\": true}", sortBy: "order") {
    id
    name
    description
    mainStatus
    isActive
    isCustomerVisible
    order
  }
}
```

---

### Get Payments

```graphql
query GetPayments($orderId: Int!) {
  payments(where: "{\"order_id\": $orderId}") {
    id
    orderId
    paymentMethod
    amount
    status
    transactionReference
    paymentDate
    notes
    order {
      id
      totalAmount
    }
  }
}
```

**Filterable Fields:** `order_id`, `payment_method`, `status`, `project_id`
**Sortable Fields:** `payment_date`, `amount`

---

### Get Order Returns

```graphql
query GetOrderReturns {
  orderReturns(where: "{\"status\": \"pending\"}") {
    id
    orderId
    returnType
    status
    reasonId
    note
    resolvedDate
    projectId
    order {
      id
      totalAmount
    }
    reason {
      id
      reason
      description
    }
    returnProducts {
      id
      productId
      rating
      quantity
      isDamaged
    }
  }
}
```

**Filterable Fields:** `order_id`, `return_type`, `status`, `project_id`
**Sortable Fields:** `created_at`, `resolved_date`

---

## Mutation Operations

### Create Order

```graphql
mutation CreateOrder($input: OrderInput!) {
  createOrder(input: {
    customerId: 100
    mainStatus: "pending"
    statusId: 5
    note: "Customer requested gift wrap"
    totalAmount: 299.99
    projectId: 1
  }) {
    id
    customerId
    mainStatus
    note
    totalAmount
    invoiceId
    createdAt
  }
}
```

**Triggers:**
- Creates invoice in billing service (async)
- Maps `invoice_id` to order

---

### Update Order

```graphql
mutation UpdateOrder($id: ID!, $input: OrderInput!) {
  updateOrder(id: $id, input: {
    mainStatus: "completed"
    note: "Order delivered successfully"
    totalAmount: 299.99
  }) {
    id
    mainStatus
    note
    totalAmount
    updatedAt
  }
}
```

**Triggers:**
- When `mainStatus` becomes "completed": Creates transaction in billing service

---

### Delete Order

```graphql
mutation DeleteOrder($id: ID!) {
  deleteOrder(id: $id)
}
```

---

### Create Order Product

```graphql
mutation CreateOrderProduct($input: OrderProductInput!) {
  createOrderProduct(input: {
    orderId: 123
    productId: 456
    inventoryId: 789
    quantity: 2
    unitPrice: 49.99
    totalPrice: 99.98
    projectId: 1
  }) {
    id
    orderId
    productId
    quantity
    totalPrice
    createdAt
  }
}
```

**Triggers:**
- Decrements stock in inventory service (async)

---

### Create Payment

```graphql
mutation CreatePayment($input: PaymentInput!) {
  createPayment(input: {
    orderId: 123
    paymentMethod: "credit_card"
    amount: 299.99
    status: "completed"
    transactionReference: "txn_abc123"
    paymentDate: "2026-01-12T10:30:00Z"
    notes: "Paid via Stripe"
    projectId: 1
  }) {
    id
    orderId
    paymentMethod
    amount
    status
    transactionReference
    createdAt
  }
}
```

---

### Create Order Return

```graphql
mutation CreateOrderReturn($input: OrderReturnInput!) {
  createOrderReturn(input: {
    orderId: 123
    returnType: "partial"
    status: "pending"
    reasonId: 2
    note: "Product arrived damaged"
    projectId: 1
  }) {
    id
    orderId
    returnType
    status
    note
    createdAt
  }
}
```

---

### Manage Order Tags

**Add Tags:**
```graphql
mutation AddOrderTags($id: ID!, $relatedIds: [Int]!) {
  addOrderTags(id: $id, relatedIds: [1, 2, 3])
}
```

**Remove Tags:**
```graphql
mutation RemoveOrderTags($id: ID!, $relatedIds: [Int]!) {
  removeOrderTags(id: $id, relatedIds: [1, 2])
}
```

---

### Create Status

```graphql
mutation CreateStatus($input: StatusInput!) {
  createStatus(input: {
    name: "Processing"
    description: "Order is being prepared"
    mainStatus: "processing"
    isActive: true
    isCustomerVisible: true
    order: 1
    projectId: 1
  }) {
    id
    name
    mainStatus
    order
  }
}
```

---

### Create Tag

```graphql
mutation CreateTag($input: TagInput!) {
  createTag(input: {
    name: "Priority"
    color: "#FF5733"
    projectId: 1
  }) {
    id
    name
    color
  }
}
```

---

### Create Return Reason

```graphql
mutation CreateReturnReason($input: ReturnReasonInput!) {
  createReturnReason(input: {
    reason: "DAMAGED"
    description: "Product arrived damaged"
    projectId: 1
  }) {
    id
    reason
    description
  }
}
```

---

## Complete Example Workflow

### 1. Create an Order with Products

```graphql
mutation CreateFullOrder {
  # Create order
  order: createOrder(input: {
    customerId: 100
    mainStatus: "pending"
    note: "Urgent delivery"
    totalAmount: 599.97
    projectId: 1
  }) {
    id
    totalAmount
  }
}

# Then add products
mutation AddProducts {
  product1: createOrderProduct(input: {
    orderId: 123  # from above
    productId: 10
    inventoryId: 20
    quantity: 2
    unitPrice: 199.99
    totalPrice: 399.98
    projectId: 1
  }) {
    id
  }

  product2: createOrderProduct(input: {
    orderId: 123
    productId: 15
    inventoryId: 25
    quantity: 1
    unitPrice: 199.99
    totalPrice: 199.99
    projectId: 1
  }) {
    id
  }
}
```

**Automatic Actions:**
- Invoice created in billing service
- Stock decremented in inventory service

---

### 2. Process Payment

```graphql
mutation ProcessPayment {
  createPayment(input: {
    orderId: 123
    paymentMethod: "credit_card"
    amount: 599.97
    status: "completed"
    transactionReference: "stripe_ch_123abc"
    paymentDate: "2026-01-12T14:30:00Z"
    projectId: 1
  }) {
    id
    status
    amount
  }
}
```

---

### 3. Complete Order

```graphql
mutation CompleteOrder {
  updateOrder(id: "123", input: {
    mainStatus: "completed"
    note: "Delivered to customer"
    totalAmount: 599.97
  }) {
    id
    mainStatus
    invoiceId  # Created automatically
  }
}
```

**Automatic Action:**
- Transaction created in billing service

---

### 4. Handle Return

```graphql
mutation CreateReturn {
  returnRequest: createOrderReturn(input: {
    orderId: 123
    returnType: "partial"
    status: "pending"
    reasonId: 1  # DAMAGED
    note: "One item damaged"
    projectId: 1
  }) {
    id
    status
  }

  rating: createReturnOrderRating(input: {
    orderReturnId: 456  # from above
    productId: 10
    rating: 2
    isDamaged: true
    quantity: 1
  }) {
    id
    rating
  }
}
```

---

## Error Handling

### Authentication Error

```json
{
  "errors": [
    {
      "message": "Authentication required",
      "extensions": { "code": "AUTH_REQUIRED" }
    }
  ]
}
```

### Permission Error

```json
{
  "errors": [
    {
      "message": "Insufficient permissions",
      "extensions": { "code": "FORBIDDEN" }
    }
  ]
}
```

### Validation Error

```json
{
  "errors": [
    {
      "message": "Field 'totalAmount' is required",
      "extensions": { "code": "VALIDATION_ERROR" }
    }
  ]
}
```

---

## Testing with cURL

### Create Order

```bash
curl -X POST http://localhost:4001/graphql \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateOrder($input: OrderInput!) { createOrder(input: $input) { id totalAmount invoiceId } }",
    "variables": {
      "input": {
        "customerId": 100,
        "mainStatus": "pending",
        "note": "Test order",
        "totalAmount": 99.99,
        "projectId": 1
      }
    }
  }'
```

### Query Orders

```bash
curl -X POST http://localhost:4001/graphql \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { orders(limit: 10) { id mainStatus totalAmount createdAt } }"
  }'
```

---

## Service Integrations

### Billing Service

**Trigger:** Order creation
**Action:** Creates invoice
**Fields Mapped:** `invoice_id`
**Async:** Yes

**Trigger:** Order status → "completed"
**Action:** Creates transaction
**Async:** Yes

### Inventory Service

**Trigger:** OrderProduct creation
**Action:** Decrements stock
**Async:** Yes

---

## Pagination

Use cursor-based or offset-based pagination:

```graphql
query GetPaginatedOrders($limit: Int, $offset: Int) {
  orders(limit: 20, offset: 0) {
    id
    totalAmount
    createdAt
  }
}
```

---

## Search

Full-text search across searchable fields:

```graphql
query SearchOrders($search: String) {
  orders(search: "gift urgent") {
    id
    note
    totalAmount
  }
}
```

---

## Filtering

Advanced filtering with JSON:

```graphql
query FilterOrders {
  orders(where: "{\"mainStatus\": \"completed\", \"customer_id\": 100}") {
    id
    mainStatus
    totalAmount
  }
}
```

---

## Sorting

Single field sorting:

```graphql
query SortOrders {
  orders(sortBy: "-createdAt") {  # Descending
    id
    createdAt
  }
}
```

---

## Translations

For models with `translatable: true`, query with language header:

```bash
curl -X POST http://localhost:4001/graphql \
  -H "Accept-Language: ar" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { statuses { name description } }"}'
```

Translatable fields:
- `Status.name`, `Status.description`

---

## Deployment

### Local Development

```bash
cd /home/yousef/Documents/workspace/zonevast/services/graphql/autoapi-projects/order-graphql
python3 handler.py
```

### SAM Gateway (Local)

```bash
cd /home/yousef/Documents/workspace/zonevast/services/sam-api-gateway
sam build
sam local start-api --port 3000
```

Access via: `http://localhost:3000/graphql/order/en/v1/graphql`

### Production

Deploy via micrzone:

```bash
micrzone update order-graphql dev
```

---

## Health Check

```bash
curl http://localhost:4001/health
```

Response:
```json
{
  "status": "healthy",
  "service": "order-graphql",
  "version": "v1"
}
```

---

## Database Schema

**Schema:** `order`
**Tables:**
- `orders`
- `order_products`
- `statuses`
- `tags`
- `order_tags` (junction)
- `return_reasons`
- `order_returns`
- `return_order_ratings`
- `payments`

---

## Related Documentation

- [GraphQL Basics](/home/yousef/Documents/workspace/zonevast/zonevast-docs/docs/api-basics.md)
- [Examples](/home/yousef/Documents/workspace/zonevast/zonevast-docs/docs/examples.md)
- [Auto-API Framework](/home/yousef/Documents/workspace/zonevast/services/graphql/auto-api-framework/)

---

## Support

For issues or questions:
- Check: `/home/yousef/Documents/workspace/zonevast/zonevast-docs/docs/faq.md`
- Service logs: Check service-specific logs
- Database: PostgreSQL database `zv_order`
