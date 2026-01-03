# Order GraphQL

## Endpoint

```
https://test.zonevast.com/graphql/order
```

## Authentication

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Example Queries

### Get All Orders

```graphql
query GetOrders($status: OrderStatus, $first: Int, $after: String) {
  orders(status: $status, first: $first, after: $after) {
    edges {
      node {
        id
        orderNumber
        status
        customer {
          id
          name
          email
        }
        items {
          id
          product {
            id
            name
            sku
          }
          quantity
          unitPrice
          totalPrice
        }
        subtotal
        tax
        shipping
        total
        createdAt
        updatedAt
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

### Get Single Order

```graphql
query GetOrder($id: ID!) {
  order(id: $id) {
    id
    orderNumber
    status
    customer {
      id
      name
      email
      phone
    }
    billingAddress {
      firstName
      lastName
      addressLine1
      addressLine2
      city
      state
      postalCode
      country
    }
    shippingAddress {
      firstName
      lastName
      addressLine1
      addressLine2
      city
      state
      postalCode
      country
    }
    items {
      id
      product {
        id
        name
        sku
        images {
          url
        }
      }
      quantity
      unitPrice
      discount
      totalPrice
    }
    subtotal
    tax
    shipping
    discount
    total
    paymentStatus
    paymentMethod
    shippingMethod
    trackingNumber
    notes
    createdAt
    updatedAt
    statusHistory {
      status
      timestamp
      notes
      performedBy {
        id
        username
      }
    }
  }
}
```

**Variables:**
```json
{
  "id": "123"
}
```

### Get Order by Order Number

```graphql
query GetOrderByNumber($orderNumber: String!) {
  orderByNumber(orderNumber: $orderNumber) {
    id
    orderNumber
    status
    total
    items {
      id
      product {
        name
        sku
      }
      quantity
      totalPrice
    }
  }
}
```

**Variables:**
```json
{
  "orderNumber": "ORD-2024-001234"
}
```

### Get Customer Orders

```graphql
query GetCustomerOrders($customerId: ID!, $status: OrderStatus) {
  customerOrders(customerId: $customerId, status: $status) {
    id
    orderNumber
    status
    total
    createdAt
    items {
      product {
        name
      }
      quantity
    }
  }
}
```

**Variables:**
```json
{
  "customerId": "456",
  "status": "PENDING"
}
```

### Get Orders by Date Range

```graphql
query GetOrdersByDateRange($startDate: DateTime!, $endDate: DateTime!) {
  ordersByDateRange(startDate: $startDate, endDate: $endDate) {
    id
    orderNumber
    status
    total
    createdAt
    customer {
      name
    }
  }
}
```

**Variables:**
```json
{
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z"
}
```

### Get Order Analytics

```graphql
query GetOrderAnalytics($startDate: DateTime!, $endDate: DateTime!) {
  orderAnalytics(startDate: $startDate, endDate: $endDate) {
    totalOrders
    totalRevenue
    averageOrderValue
    ordersByStatus {
      status
      count
    }
    topProducts {
      product {
        id
        name
      }
      quantitySold
      revenue
    }
  }
}
```

### Search Orders

```graphql
query SearchOrders($searchTerm: String!) {
  searchOrders(searchTerm: $searchTerm) {
    id
    orderNumber
    status
    customer {
      name
      email
    }
    total
    createdAt
  }
}
```

**Variables:**
```json
{
  "searchTerm": "john@example.com"
}
```

## Example Mutations

### Create Order

```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    order {
      id
      orderNumber
      status
      total
      items {
        id
        product {
          name
        }
        quantity
        totalPrice
      }
    }
    errors {
      field
      message
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "customerId": "456",
    "items": [
      {
        "productId": "789",
        "quantity": 2
      }
    ],
    "billingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "addressLine1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    },
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "addressLine1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    },
    "shippingMethod": "STANDARD",
    "paymentMethod": "CREDIT_CARD"
  }
}
```

### Update Order Status

```graphql
mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
  updateOrderStatus(input: $input) {
    order {
      id
      status
      statusHistory {
        status
        timestamp
        notes
      }
    }
    errors {
      field
      message
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "orderId": "123",
    "status": "SHIPPED",
    "notes": "Order shipped via standard delivery",
    "trackingNumber": "TRACK123456789"
  }
}
```

### Add Order Item

```graphql
mutation AddOrderItem($input: AddOrderItemInput!) {
  addOrderItem(input: $input) {
    orderItem {
      id
      product {
        name
      }
      quantity
      unitPrice
      totalPrice
    }
    errors {
      field
      message
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "orderId": "123",
    "productId": "789",
    "quantity": 1
  }
}
```

### Remove Order Item

```graphql
mutation RemoveOrderItem($orderItemId: ID!) {
  removeOrderItem(orderItemId: $orderItemId) {
    success
    order {
      id
      total
      items {
        id
      }
    }
    errors {
      field
      message
    }
  }
}
```

**Variables:**
```json
{
  "orderItemId": "ITEM-123"
}
```

### Update Shipping Address

```graphql
mutation UpdateShippingAddress($input: UpdateShippingAddressInput!) {
  updateShippingAddress(input: $input) {
    order {
      id
      shippingAddress {
        firstName
        lastName
        addressLine1
        city
        state
        postalCode
      }
    }
    errors {
      field
      message
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "orderId": "123",
    "shippingAddress": {
      "firstName": "Jane",
      "lastName": "Smith",
      "addressLine1": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "postalCode": "90001",
      "country": "US"
    }
  }
}
```

### Apply Discount

```graphql
mutation ApplyDiscount($input: ApplyDiscountInput!) {
  applyDiscount(input: $input) {
    order {
      id
      discount
      total
    }
    errors {
      field
      message
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "orderId": "123",
    "discountCode": "SAVE10",
    "discountPercentage": 10
  }
}
```

### Cancel Order

```graphql
mutation CancelOrder($orderId: ID!, $reason: String) {
  cancelOrder(orderId: $orderId, reason: $reason) {
    order {
      id
      status
      cancellationReason
    }
    errors {
      field
      message
    }
  }
}
```

**Variables:**
```json
{
  "orderId": "123",
  "reason": "Customer request"
}
```

## Subscriptions

### Order Created

```graphql
subscription OnOrderCreated {
  orderCreated {
    order {
      id
      orderNumber
      customer {
        name
      }
      total
    }
  }
}
```

### Order Status Updated

```graphql
subscription OnOrderStatusUpdated($orderId: ID) {
  orderStatusUpdated(orderId: $orderId) {
    order {
      id
      orderNumber
      status
      statusHistory {
        status
        timestamp
      }
    }
  }
}
```

## Common Use Cases

### Order Processing Workflow

```graphql
mutation ProcessOrder($orderId: ID!) {
  processOrder(orderId: $orderId) {
    order {
      id
      status
      paymentStatus
    }
    paymentIntent {
      id
      clientSecret
      amount
    }
    errors {
      field
      message
    }
  }
}
```

### Fulfillment Check

```graphql
query CheckFulfillment($orderId: ID!) {
  order(id: $orderId) {
    id
    status
    canFulfill
    fulfillmentItems {
      productId
      quantity
      available
      location {
        id
        name
      }
    }
  }
}
```

### Customer Order History

```graphql
query CustomerOrderHistory($customerId: ID!, $limit: Int) {
  customerOrders(customerId: $customerId) {
    id
    orderNumber
    status
    total
    createdAt
    items {
      product {
        name
        images {
          url
        }
      }
      quantity
    }
  }
}
```

### Order Report

```graphql
query OrderReport($startDate: DateTime!, $endDate: DateTime!) {
  orderReport(startDate: $startDate, endDate: $endDate) {
    summary {
      totalOrders
      totalRevenue
      averageOrderValue
      completionRate
    }
    byStatus {
      status
      count
      revenue
    }
    byPaymentMethod {
      method
      count
      revenue
    }
  }
}
```
