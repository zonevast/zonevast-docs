# Cart API

## Base URL
`https://test.zonevast.com/api/v1/cart`

## Authentication
Most requests require a valid JWT token. Guest carts are supported using session tokens:
```bash
Authorization: Bearer YOUR_TOKEN
# or for guest carts:
X-Guest-Token: GUEST_SESSION_TOKEN
```

---

## Endpoints

### Create Cart

Create a new shopping cart (automatically created on first add).

```bash
curl -X POST https://test.zonevast.com/api/v1/cart/carts/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currency": "USD"
  }'
```

**Request Body (all optional):**
- `currency` (string): Currency code (default: USD)

**Response (201 Created):**
```json
{
  "id": "cart_abc123xyz456",
  "customer": {
    "id": 1001,
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "currency": "USD",
  "items": [],
  "subtotal": "0.00",
  "tax_amount": "0.00",
  "shipping_cost": "0.00",
  "total": "0.00",
  "item_count": 0,
  "is_guest": false,
  "expires_at": "2024-04-20T15:30:00Z",
  "created_at": "2024-03-20T15:30:00Z",
  "updated_at": "2024-03-20T15:30:00Z"
}
```

---

### Get Cart

Retrieve the current user's cart or a specific cart by ID.

```bash
# Get current user's cart
curl -X GET https://test.zonevast.com/api/v1/cart/carts/current/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get specific cart
curl -X GET https://test.zonevast.com/api/v1/cart/carts/cart_abc123xyz456/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "id": "cart_abc123xyz456",
  "customer": {
    "id": 1001,
    "email": "customer@example.com"
  },
  "currency": "USD",
  "items": [
    {
      "id": "item_001",
      "product": {
        "id": 1,
        "name": "Wireless Bluetooth Headphones",
        "sku": "WBH-001",
        "slug": "wireless-bluetooth-headphones"
      },
      "variant": null,
      "quantity": 2,
      "unit_price": "79.99",
      "total_price": "159.98",
      "is_available": true,
      "stock_available": 45,
      "image": {
        "url": "https://cdn.zonevast.com/products/headphones.jpg",
        "alt_text": "Bluetooth Headphones"
      }
    },
    {
      "id": "item_002",
      "product": {
        "id": 5,
        "name": "USB-C Charging Cable",
        "sku": "USB-C-002",
        "slug": "usb-c-charging-cable"
      },
      "variant": null,
      "quantity": 1,
      "unit_price": "12.99",
      "total_price": "12.99",
      "is_available": true,
      "stock_available": 8,
      "image": {
        "url": "https://cdn.zonevast.com/products/cable.jpg",
        "alt_text": "USB-C Cable"
      }
    }
  ],
  "subtotal": "172.97",
  "tax_amount": "13.84",
  "shipping_cost": "9.99",
  "discount_amount": "0.00",
  "total": "196.80",
  "item_count": 3,
  "applied_promotions": [],
  "shipping_address": null,
  "billing_address": null,
  "expires_at": "2024-04-20T15:30:00Z",
  "created_at": "2024-03-20T15:30:00Z",
  "updated_at": "2024-03-20T15:35:00Z"
}
```

---

### Add Item to Cart

Add a product to the cart.

```bash
curl -X POST https://test.zonevast.com/api/v1/cart/carts/current/items/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 2,
    "variant_id": null
  }'
```

**Request Body:**
- `product_id` (integer, required): Product ID
- `quantity` (integer, required): Quantity to add (default: 1)
- `variant_id` (integer): Product variant ID (if applicable)

**Response (201 Created):**
```json
{
  "id": "item_001",
  "product": {
    "id": 1,
    "name": "Wireless Bluetooth Headphones",
    "sku": "WBH-001"
  },
  "quantity": 2,
  "unit_price": "79.99",
  "total_price": "159.98",
  "added_at": "2024-03-20T15:35:00Z",
  "cart_totals": {
    "subtotal": "172.97",
    "tax_amount": "13.84",
    "shipping_cost": "9.99",
    "total": "196.80",
    "item_count": 3
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Insufficient stock",
  "message": "Cannot add requested quantity",
  "details": {
    "requested": 10,
    "available": 5
  }
}
```

---

### Update Cart Item

Update the quantity of an item in the cart.

```bash
curl -X PATCH https://test.zonevast.com/api/v1/cart/carts/current/items/item_001/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'
```

**Request Body:**
- `quantity` (integer, required): New quantity

**Response (200 OK):**
```json
{
  "id": "item_001",
  "quantity": 3,
  "previous_quantity": 2,
  "unit_price": "79.99",
  "total_price": "239.97",
  "cart_totals": {
    "subtotal": "252.96",
    "tax_amount": "20.24",
    "shipping_cost": "9.99",
    "total": "283.19",
    "item_count": 4
  }
}
```

---

### Remove Item from Cart

Remove an item from the cart.

```bash
curl -X DELETE https://test.zonevast.com/api/v1/cart/carts/current/items/item_001/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (204 No Content):**
Item successfully removed.

---

### Clear Cart

Remove all items from the cart.

```bash
curl -X POST https://test.zonevast.com/api/v1/cart/carts/current/clear/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "id": "cart_abc123xyz456",
  "items": [],
  "subtotal": "0.00",
  "tax_amount": "0.00",
  "shipping_cost": "0.00",
  "total": "0.00",
  "item_count": 0,
  "cleared_at": "2024-03-20T16:00:00Z"
}
```

---

### Apply Coupon Code

Apply a promotional coupon code to the cart.

```bash
curl -X POST https://test.zonevast.com/api/v1/cart/carts/current/coupons/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SPRING20"
  }'
```

**Request Body:**
- `code` (string, required): Coupon code

**Response (201 Created):**
```json
{
  "id": "coupon_001",
  "code": "SPRING20",
  "description": "Spring Sale - 20% off",
  "discount_type": "percentage",
  "discount_value": "20.00",
  "discount_amount": "34.59",
  "free_shipping": false,
  "applied_at": "2024-03-20T16:05:00Z",
  "cart_totals": {
    "subtotal": "172.97",
    "discount_amount": "34.59",
    "tax_amount": "11.07",
    "shipping_cost": "9.99",
    "total": "160.44"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid coupon",
  "message": "Coupon code has expired or is not valid"
}
```

---

### Remove Coupon Code

Remove an applied coupon from the cart.

```bash
curl -X DELETE https://test.zonevast.com/api/v1/cart/carts/current/coupons/coupon_001/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (204 No Content):**
Coupon successfully removed.

---

### Set Shipping Address

Set the shipping address for the cart (required for shipping cost calculation).

```bash
curl -X PUT https://test.zonevast.com/api/v1/cart/carts/current/shipping_address/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "address_line1": "123 Main Street",
    "address_line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US",
    "phone": "+1234567890"
  }'
```

**Request Body:**
- `first_name`, `last_name` (string, required)
- `address_line1` (string, required)
- `address_line2` (string)
- `city`, `state`, `postal_code`, `country` (string, required)
- `phone` (string)

**Response (200 OK):**
```json
{
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
  "available_shipping_methods": [
    {
      "id": "standard",
      "name": "Standard Shipping",
      "description": "5-7 business days",
      "cost": "9.99",
      "estimated_days": 5
    },
    {
      "id": "express",
      "name": "Express Shipping",
      "description": "2-3 business days",
      "cost": "19.99",
      "estimated_days": 2
    },
    {
      "id": "overnight",
      "name": "Overnight Shipping",
      "description": "Next business day",
      "cost": "34.99",
      "estimated_days": 1
    }
  ]
}
```

---

### Set Shipping Method

Select a shipping method for the cart.

```bash
curl -X PUT https://test.zonevast.com/api/v1/cart/carts/current/shipping_method/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "express"
  }'
```

**Request Body:**
- `method` (string, required): Shipping method ID (standard, express, overnight)

**Response (200 OK):**
```json
{
  "shipping_method": "express",
  "shipping_cost": "19.99",
  "estimated_delivery": "2024-03-23",
  "cart_totals": {
    "subtotal": "172.97",
    "tax_amount": "13.84",
    "shipping_cost": "19.99",
    "total": "206.80"
  }
}
```

---

### Merge Guest Cart

Merge a guest cart into an authenticated user's cart (typically after login).

```bash
curl -X POST https://test.zonevast.com/api/v1/cart/carts/merge/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "guest_cart_id": "cart_guest_xyz789"
  }'
```

**Request Body:**
- `guest_cart_id` (string, required): Guest cart ID to merge

**Response (200 OK):**
```json
{
  "id": "cart_abc123xyz456",
  "items_merged": 2,
  "items": [
    {
      "id": "item_001",
      "product_id": 1,
      "quantity": 3
    },
    {
      "id": "item_003",
      "product_id": 10,
      "quantity": 1
    }
  ],
  "subtotal": "250.96",
  "total": "284.75",
  "merged_at": "2024-03-20T16:30:00Z"
}
```

---

### Validate Cart

Validate the cart (check stock availability, prices, etc.) before checkout.

```bash
curl -X POST https://test.zonevast.com/api/v1/cart/carts/current/validate/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "is_valid": true,
  "warnings": [],
  "errors": [],
  "cart_totals": {
    "subtotal": "172.97",
    "tax_amount": "13.84",
    "shipping_cost": "9.99",
    "total": "196.80"
  },
  "validated_at": "2024-03-20T16:35:00Z"
}
```

**Response with Warnings (200 OK):**
```json
{
  "is_valid": true,
  "warnings": [
    {
      "type": "low_stock",
      "item_id": "item_002",
      "message": "USB-C Charging Cable has low stock (8 remaining)",
      "available_quantity": 8
    }
  ],
  "errors": [],
  "cart_totals": {
    "subtotal": "172.97",
    "tax_amount": "13.84",
    "shipping_cost": "9.99",
    "total": "196.80"
  }
}
```

**Response with Errors (400 Bad Request):**
```json
{
  "is_valid": false,
  "warnings": [],
  "errors": [
    {
      "type": "out_of_stock",
      "item_id": "item_003",
      "message": "Product is out of stock",
      "product_id": 15
    }
  ]
}
```

---

### Checkout

Convert cart to order and initiate checkout process.

```bash
curl -X POST https://test.zonevast.com/api/v1/cart/carts/current/checkout/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_method": "credit_card",
    "billing_address": {
      "first_name": "John",
      "last_name": "Doe",
      "address_line1": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US"
    },
    "save_addresses": true
  }'
```

**Request Body:**
- `payment_method` (string, required): Payment method (credit_card, paypal, etc.)
- `billing_address` (object, required): Billing address details
- `save_addresses` (boolean): Save addresses to customer profile
- `notes` (string): Order notes

**Response (201 Created):**
```json
{
  "order_id": "ORD-2024-001234",
  "status": "pending_payment",
  "cart_id": "cart_abc123xyz456",
  "payment_required": "196.80",
  "payment_methods": [
    {
      "id": "credit_card",
      "name": "Credit Card",
      "payment_url": "https://payment.zonevast.com/checkout/ORD-2024-001234"
    },
    {
      "id": "paypal",
      "name": "PayPal",
      "payment_url": "https://payment.zonevast.com/paypal/ORD-2024-001234"
    }
  ],
  "expires_at": "2024-03-20T17:05:00Z",
  "created_at": "2024-03-20T16:40:00Z"
}
```

---

### Abandoned Cart Recovery

Retrieve abandoned carts (for admin/marketing purposes).

```bash
curl -X GET https://test.zonevast.com/api/v1/cart/carts/abandoned/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `hours` (integer): Hours since last update (default: 24)
- `has_items` (boolean): Filter carts with items
- `min_value` (decimal): Minimum cart value

**Response (200 OK):**
```json
{
  "count": 15,
  "results": [
    {
      "id": "cart_def456",
      "customer_email": "customer@example.com",
      "item_count": 3,
      "total": "196.80",
      "last_updated": "2024-03-19T10:30:00Z",
      "hours_since_update": 30,
      "recoverable": true
    }
  ]
}
```

---

### Cart Analytics

Get cart analytics and metrics.

```bash
curl -X GET https://test.zonevast.com/api/v1/cart/analytics/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `date_from` (date): Start date (YYYY-MM-DD)
- `date_to` (date): End date (YYYY-MM-DD)

**Response (200 OK):**
```json
{
  "total_carts": 850,
  "active_carts": 245,
  "converted_carts": 385,
  "abandoned_carts": 220,
  "conversion_rate": "45.3",
  "average_cart_value": "125.50",
  "average_items_per_cart": "2.8",
  "top_abandoned_products": [
    {
      "product_id": 1,
      "product_name": "Wireless Bluetooth Headphones",
      "abandon_count": 45,
      "abandon_value": "3599.55"
    }
  ],
  "period": {
    "from": "2024-03-01",
    "to": "2024-03-20"
  }
}
```

---

## Guest Cart Support

### Create Guest Cart

Create a cart without authentication.

```bash
curl -X POST https://test.zonevast.com/api/v1/cart/guest/ \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response (201 Created):**
```json
{
  "id": "cart_guest_xyz789",
  "guest_token": "guest_token_abc123",
  "currency": "USD",
  "items": [],
  "is_guest": true,
  "expires_at": "2024-04-20T15:30:00Z"
}
```

**Note**: Use the `guest_token` in subsequent requests:
```bash
X-Guest-Token: guest_token_abc123
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 204 | Deleted successfully |
| 400 | Bad request / Validation error / Out of stock |
| 401 | Unauthorized / Invalid token |
| 403 | Forbidden / Insufficient permissions |
| 404 | Cart not found |
| 409 | Conflict (coupon already applied) |
| 410 | Cart expired |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Rate Limits

- **Free Tier**: 100 requests / minute
- **Pro Tier**: 1,000 requests / minute
- **Enterprise**: Custom

Check the `X-RateLimit-Remaining` header for your remaining quota.

---

## Best Practices

1. **Cart Expiration**: Carts expire after 30 days of inactivity
2. **Stock Validation**: Always validate cart before checkout
3. **Guest to Authenticated**: Merge guest carts after user login
4. **Price Changes**: Cart prices are not guaranteed until order confirmation
5. **Concurrency**: Handle concurrent modifications using `updated_at` timestamps
