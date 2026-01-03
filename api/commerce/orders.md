# Orders API

## Base URL
`https://test.zonevast.com/api/v1/orders`

## Authentication
All requests require a valid JWT token in the Authorization header:
```bash
Authorization: Bearer YOUR_TOKEN
```

---

## Endpoints

### Create Order

Create a new order with items and shipping details.

```bash
curl -X POST https://test.zonevast.com/api/v1/orders/orders/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "customer@example.com",
    "customer_phone": "+1234567890",
    "shipping_address": {
      "first_name": "John",
      "last_name": "Doe",
      "address_line1": "123 Main Street",
      "address_line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US",
      "phone": "+1234567890"
    },
    "billing_address": {
      "first_name": "John",
      "last_name": "Doe",
      "address_line1": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US"
    },
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "unit_price": "79.99"
      },
      {
        "product_id": 5,
        "quantity": 1,
        "unit_price": "29.99"
      }
    ],
    "shipping_method": "standard",
    "payment_method": "credit_card",
    "currency": "USD",
    "notes": "Please deliver before 5 PM"
  }'
```

**Request Body:**
- `customer_email` (string, required): Customer email address
- `customer_phone` (string): Customer phone number
- `shipping_address` (object, required): Shipping details
  - `first_name`, `last_name` (string, required)
  - `address_line1` (string, required)
  - `address_line2` (string)
  - `city`, `state`, `postal_code`, `country` (string, required)
  - `phone` (string)
- `billing_address` (object, required): Billing details (same structure as shipping)
- `items` (array, required): Order items
  - `product_id` (integer, required): Product ID
  - `quantity` (integer, required): Quantity to order
  - `unit_price` (decimal, required): Price per unit
- `shipping_method` (string): Shipping method (standard, express, overnight)
- `payment_method` (string): Payment method (credit_card, paypal, etc.)
- `currency` (string): Currency code (default: USD)
- `notes` (string): Order notes

**Response (201 Created):**
```json
{
  "id": "ORD-2024-001234",
  "status": "pending",
  "customer_email": "customer@example.com",
  "customer_phone": "+1234567890",
  "currency": "USD",
  "subtotal": "189.97",
  "shipping_cost": "9.99",
  "tax_amount": "15.20",
  "discount_amount": "0.00",
  "total": "215.16",
  "items": [
    {
      "id": 1001,
      "product_id": 1,
      "product_name": "Wireless Bluetooth Headphones",
      "sku": "WBH-001",
      "quantity": 2,
      "unit_price": "79.99",
      "total": "159.98"
    },
    {
      "id": 1002,
      "product_id": 5,
      "product_name": "USB-C Charging Cable",
      "sku": "USB-C-002",
      "quantity": 1,
      "unit_price": "29.99",
      "total": "29.99"
    }
  ],
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_line1": "123 Main Street",
    "address_line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US"
  },
  "billing_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_line1": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US"
  },
  "shipping_method": "standard",
  "payment_method": "credit_card",
  "payment_status": "pending",
  "notes": "Please deliver before 5 PM",
  "created_at": "2024-03-20T15:30:00Z",
  "updated_at": "2024-03-20T15:30:00Z"
}
```

---

### List Orders

Retrieve a paginated list of orders with filtering options.

```bash
curl -X GET https://test.zonevast.com/api/v1/orders/orders/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `page_size` (integer): Items per page (default: 20, max: 100)
- `status` (string): Filter by status (pending, confirmed, processing, shipped, delivered, cancelled, returned)
- `payment_status` (string): Filter by payment status (pending, paid, failed, refunded)
- `customer_email` (string): Filter by customer email
- `date_from` (date): Filter orders from this date (YYYY-MM-DD)
- `date_to` (date): Filter orders until this date (YYYY-MM-DD)
- `ordering` (string): Sort order (created_at, -created_at, total, -total)

**Response (200 OK):**
```json
{
  "count": 45,
  "next": "https://test.zonevast.com/api/v1/orders/orders/?page=2",
  "previous": null,
  "results": [
    {
      "id": "ORD-2024-001234",
      "status": "confirmed",
      "customer_email": "customer@example.com",
      "total": "215.16",
      "payment_status": "paid",
      "created_at": "2024-03-20T15:30:00Z",
      "items_count": 2
    }
  ]
}
```

---

### Get Order Details

Retrieve complete details of a specific order.

```bash
curl -X GET https://test.zonevast.com/api/v1/orders/orders/ORD-2024-001234/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
Returns the full order object (same format as Create Order response).

**Error Response (404 Not Found):**
```json
{
  "error": "Order not found",
  "message": "No order exists with ID: ORD-2024-001234"
}
```

---

### Update Order Status

Update the status of an order.

```bash
curl -X PATCH https://test.zonevast.com/api/v1/orders/orders/ORD-2024-001234/status/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped",
    "tracking_number": "1Z999AA10123456784",
    "carrier": "UPS",
    "notes": "Order shipped via UPS Ground"
  }'
```

**Request Body:**
- `status` (string, required): New order status
  - `pending`: Order placed, awaiting confirmation
  - `confirmed`: Order confirmed, preparing for fulfillment
  - `processing`: Order is being processed
  - `shipped`: Order has been shipped
  - `delivered`: Order delivered to customer
  - `cancelled`: Order cancelled
  - `returned`: Order returned by customer
- `tracking_number` (string): Shipment tracking number
- `carrier` (string): Shipping carrier (UPS, FedEx, DHL, etc.)
- `notes` (string): Status update notes

**Response (200 OK):**
```json
{
  "id": "ORD-2024-001234",
  "status": "shipped",
  "previous_status": "confirmed",
  "tracking_number": "1Z999AA10123456784",
  "carrier": "UPS",
  "notes": "Order shipped via UPS Ground",
  "updated_at": "2024-03-21T10:15:00Z"
}
```

---

### Update Payment Status

Update the payment status of an order.

```bash
curl -X PATCH https://test.zonevast.com/api/v1/orders/orders/ORD-2024-001234/payment/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_status": "paid",
    "transaction_id": "txn_3PqG2w2eZvKYlo2C1234ABCD",
    "payment_gateway": "stripe",
    "paid_amount": "215.16"
  }'
```

**Request Body:**
- `payment_status` (string, required): New payment status
  - `pending`: Payment awaiting processing
  - `paid`: Payment successfully completed
  - `failed`: Payment failed
  - `refunded`: Payment refunded
  - `partially_refunded`: Payment partially refunded
- `transaction_id` (string): Payment gateway transaction ID
- `payment_gateway` (string): Payment gateway used
- `paid_amount` (decimal): Amount paid

**Response (200 OK):**
```json
{
  "id": "ORD-2024-001234",
  "payment_status": "paid",
  "transaction_id": "txn_3PqG2w2eZvKYlo2C1234ABCD",
  "payment_gateway": "stripe",
  "paid_amount": "215.16",
  "updated_at": "2024-03-20T15:35:00Z"
}
```

---

### Cancel Order

Cancel an order (only possible for orders in 'pending' or 'confirmed' status).

```bash
curl -X POST https://test.zonevast.com/api/v1/orders/orders/ORD-2024-001234/cancel/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Customer requested cancellation",
    "refund": true
  }'
```

**Request Body:**
- `reason` (string, required): Cancellation reason
- `refund` (boolean): Whether to process refund (default: false)

**Response (200 OK):**
```json
{
  "id": "ORD-2024-001234",
  "status": "cancelled",
  "cancellation_reason": "Customer requested cancellation",
  "refund_processed": true,
  "refund_amount": "215.16",
  "cancelled_at": "2024-03-20T16:00:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Cannot cancel order",
  "message": "Order cannot be cancelled in current status: shipped"
}
```

---

### Order Items

#### Add Item to Order

Add an item to an existing order (only possible for pending orders).

```bash
curl -X POST https://test.zonevast.com/api/v1/orders/orders/ORD-2024-001234/items/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 10,
    "quantity": 1,
    "unit_price": "49.99"
  }'
```

**Response (201 Created):**
```json
{
  "id": 1003,
  "product_id": 10,
  "product_name": "Phone Stand",
  "sku": "PS-001",
  "quantity": 1,
  "unit_price": "49.99",
  "total": "49.99",
  "order_total": "265.15"
}
```

#### Remove Item from Order

Remove an item from an order.

```bash
curl -X DELETE https://test.zonevast.com/api/v1/orders/orders/ORD-2024-001234/items/1001/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (204 No Content):**
Item successfully removed.

#### Update Order Item Quantity

Update the quantity of an existing order item.

```bash
curl -X PATCH https://test.zonevast.com/api/v1/orders/orders/ORD-2024-001234/items/1001/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'
```

**Response (200 OK):**
```json
{
  "id": 1001,
  "quantity": 3,
  "unit_price": "79.99",
  "total": "239.97",
  "order_total": "295.15"
}
```

---

### Order Notes

#### Add Note to Order

Add a note or comment to an order.

```bash
curl -X POST https://test.zonevast.com/api/v1/orders/orders/ORD-2024-001234/notes/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "note": "Customer called to request expedited shipping",
    "is_internal": true
  }'
```

**Request Body:**
- `note` (string, required): Note content
- `is_internal` (boolean): Whether note is internal only (default: false)

**Response (201 Created):**
```json
{
  "id": 501,
  "note": "Customer called to request expedited shipping",
  "is_internal": true,
  "created_by": "admin@example.com",
  "created_at": "2024-03-20T17:00:00Z"
}
```

---

### Order Statistics

Get order statistics and analytics.

```bash
curl -X GET https://test.zonevast.com/api/v1/orders/orders/statistics/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `date_from` (date): Start date (YYYY-MM-DD)
- `date_to` (date): End date (YYYY-MM-DD)

**Response (200 OK):**
```json
{
  "total_orders": 1250,
  "total_revenue": "45230.50",
  "average_order_value": "36.18",
  "status_breakdown": {
    "pending": 45,
    "confirmed": 120,
    "processing": 85,
    "shipped": 340,
    "delivered": 620,
    "cancelled": 35,
    "returned": 5
  },
  "payment_status_breakdown": {
    "paid": 1150,
    "pending": 65,
    "failed": 30,
    "refunded": 5
  },
  "period": {
    "from": "2024-03-01",
    "to": "2024-03-20"
  }
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 204 | Deleted successfully |
| 400 | Bad request / Validation error |
| 401 | Unauthorized / Invalid token |
| 403 | Forbidden / Insufficient permissions |
| 404 | Order not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Rate Limits

- **Free Tier**: 100 requests / minute
- **Pro Tier**: 1,000 requests / minute
- **Enterprise**: Custom

Check the `X-RateLimit-Remaining` header for your remaining quota.
