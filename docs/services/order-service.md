# Order Processing Service

## Base URL
`https://test.zonevast.com/api/v1/order/online_orders`

## Authentication
Require JWT token in Authorization header:
```bash
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Headers
- `X-Project`: Project ID for project-specific operations

## Endpoints

### List Orders
Get all orders with filtering and pagination.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/order/online_orders/orders/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Project: 1"
```

#### Query Parameters
- `status`: Filter by status (pending, processing, shipped, delivered, cancelled, returned)
- `customer`: Filter by customer ID
- `start_date`: Orders created after date (YYYY-MM-DD)
- `end_date`: Orders created before date (YYYY-MM-DD)
- `page`: Page number
- `page_size`: Items per page
- `ordering`: Sort field (e.g., `-created_at`, `total_amount`)

#### Response
```json
{
  "count": 50,
  "next": "https://test.zonevast.com/api/v1/order/online_orders/orders/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "order_number": "ORD-2024-001",
      "customer": {
        "id": 1,
        "username": "customer1",
        "email": "customer@example.com"
      },
      "status": "processing",
      "total_amount": 129.99,
      "currency": "USD",
      "shipping_address": {
        "address_line1": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "postal_code": "94102",
        "country": "US"
      },
      "billing_address": {
        "address_line1": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "postal_code": "94102",
        "country": "US"
      },
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

### Get Order Detail
Get detailed information for a specific order.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/order/online_orders/orders/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Project: 1"
```

#### Response
```json
{
  "id": 1,
  "order_number": "ORD-2024-001",
  "customer": {
    "id": 1,
    "username": "customer1",
    "email": "customer@example.com"
  },
  "status": "processing",
  "status_history": [
    {
      "status": "pending",
      "timestamp": "2024-01-01T10:00:00Z",
      "notes": "Order created"
    },
    {
      "status": "processing",
      "timestamp": "2024-01-01T10:30:00Z",
      "notes": "Payment confirmed"
    }
  ],
  "products": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Product Name",
        "sku": "SKU-001"
      },
      "quantity": 2,
      "unit_price": 29.99,
      "total_price": 59.98,
      "discount": 0
    }
  ],
  "subtotal": 119.98,
  "tax_amount": 10.01,
  "shipping_amount": 0,
  "discount_amount": 0,
  "total_amount": 129.99,
  "currency": "USD",
  "notes": "Customer requested gift wrap",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:30:00Z"
}
```

---

### Create Order
Create a new order.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/order/online_orders/orders/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Project: 1" \
  -d '{
    "customer": 1,
    "products": [
      {
        "product": 1,
        "quantity": 2
      },
      {
        "product": 2,
        "quantity": 1
      }
    ],
    "shipping_address": {
      "address_line1": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "postal_code": "90001",
      "country": "US"
    },
    "billing_address": {
      "address_line1": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "postal_code": "90001",
      "country": "US"
    },
    "notes": "Please deliver after 5 PM"
  }'
```

#### Response
```json
{
  "id": 2,
  "order_number": "ORD-2024-002",
  "customer": 1,
  "status": "pending",
  "total_amount": 89.97,
  "products": [
    {
      "product": 1,
      "quantity": 2,
      "unit_price": 29.99
    },
    {
      "product": 2,
      "quantity": 1,
      "unit_price": 29.99
    }
  ],
  "created_at": "2024-01-02T10:00:00Z"
}
```

---

### Update Order
Update order details (status, addresses, notes).

#### Request
```bash
curl -X PATCH https://test.zonevast.com/api/v1/order/online_orders/orders/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Project: 1" \
  -d '{
    "status": "shipped",
    "notes": "Order shipped via FedEx",
    "tracking_number": "FEDEX123456789"
  }'
```

#### Response
```json
{
  "id": 1,
  "status": "shipped",
  "tracking_number": "FEDEX123456789",
  "notes": "Order shipped via FedEx",
  "updated_at": "2024-01-02T15:00:00Z"
}
```

---

### Cancel Order
Cancel an order.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/order/online_orders/orders/1/cancel/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Project: 1" \
  -d '{
    "reason": "Customer requested cancellation",
    "restock_items": true
  }'
```

#### Response
```json
{
  "id": 1,
  "status": "cancelled",
  "cancellation_reason": "Customer requested cancellation",
  "items_restocked": true,
  "cancelled_at": "2024-01-02T16:00:00Z"
}
```

---

### Order Products
Manage products within an order.

#### List Order Products
```bash
curl -X GET https://test.zonevast.com/api/v1/order/online_orders/order-products/?order=1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Project: 1"
```

#### Response
```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "order": 1,
      "product": {
        "id": 1,
        "name": "Product Name",
        "sku": "SKU-001"
      },
      "quantity": 2,
      "unit_price": 29.99,
      "total_price": 59.98,
      "discount": 0
    }
  ]
}
```

#### Add Product to Order
```bash
curl -X POST https://test.zonevast.com/api/v1/order/online_orders/order-products/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Project: 1" \
  -d '{
    "order": 1,
    "product": 3,
    "quantity": 1
  }'
```

#### Update Order Product Quantity
```bash
curl -X PATCH https://test.zonevast.com/api/v1/order/online_orders/order-products/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Project: 1" \
  -d '{
    "quantity": 3
  }'
```

---

### Order Statuses
Get list of available order statuses.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/order/online_orders/statuses/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Project: 1"
```

#### Response
```json
{
  "count": 6,
  "results": [
    {
      "id": 1,
      "name": "pending",
      "description": "Order placed, awaiting payment"
    },
    {
      "id": 2,
      "name": "processing",
      "description": "Payment confirmed, preparing for shipment"
    },
    {
      "id": 3,
      "name": "shipped",
      "description": "Order has been shipped"
    },
    {
      "id": 4,
      "name": "delivered",
      "description": "Order delivered to customer"
    },
    {
      "id": 5,
      "name": "cancelled",
      "description": "Order cancelled"
    },
    {
      "id": 6,
      "name": "returned",
      "description": "Order returned by customer"
    }
  ]
}
```

---

### Order Returns
Manage order returns and refunds.

#### List Return Reasons
```bash
curl -X GET https://test.zonevast.com/api/v1/order/online_orders/return-reasons/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Project: 1"
```

#### Response
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "name": "Damaged",
      "description": "Product arrived damaged"
    },
    {
      "id": 2,
      "name": "Not as described",
      "description": "Product differs from description"
    },
    {
      "id": 3,
      "name": "No longer needed",
      "description": "Customer changed mind"
    }
  ]
}
```

#### Create Return Request
```bash
curl -X POST https://test.zonevast.com/api/v1/order/online_orders/order-returns/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Project: 1" \
  -d '{
    "order": 1,
    "reason": 1,
    "notes": "Box arrived crushed",
    "refund_amount": 29.99,
    "products": [
      {
        "order_product": 1,
        "quantity": 1
      }
    ]
  }'
```

#### Response
```json
{
  "id": 1,
  "order": 1,
  "reason": {
    "id": 1,
    "name": "Damaged"
  },
  "status": "pending",
  "refund_amount": 29.99,
  "notes": "Box arrived crushed",
  "created_at": "2024-01-02T17:00:00Z"
}
```

---

### Order Statistics
Get order statistics and metrics.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/order/online_orders/orders/statistics/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Project: 1"
```

#### Response
```json
{
  "total_orders": 150,
  "pending_orders": 10,
  "processing_orders": 25,
  "shipped_orders": 50,
  "delivered_orders": 60,
  "cancelled_orders": 5,
  "total_revenue": 15000.00,
  "average_order_value": 100.00,
  "most_popular_products": [
    {
      "product_id": 1,
      "product_name": "Product Name",
      "total_sold": 50
    }
  ]
}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "customer": ["This field is required."],
  "products": ["At least one product is required"]
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to modify this order"
}
```

### 404 Not Found
```json
{
  "detail": "Order not found"
}
```

### 422 Unprocessable Entity
```json
{
  "detail": "Insufficient stock for product SKU-001. Available: 5, Requested: 10"
}
```
