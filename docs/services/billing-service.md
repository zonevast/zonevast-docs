# Billing & Payment Service

## Base URL
`https://test.zonevast.com/api/v1/billing`

## Authentication
Require JWT token in Authorization header:
```bash
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Endpoints

### List Invoices
Get all invoices with filtering and pagination.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/billing/m/invoices/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Query Parameters
- `status`: Filter by status (draft, sent, paid, overdue, cancelled)
- `customer`: Filter by customer ID
- `start_date`: Invoices created after date (YYYY-MM-DD)
- `end_date`: Invoices created before date (YYYY-MM-DD)
- `min_amount`, `max_amount`: Filter by amount range
- `page`: Page number
- `page_size`: Items per page

#### Response
```json
{
  "count": 25,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "invoice_number": "INV-2024-001",
      "customer": {
        "id": 1,
        "username": "customer1",
        "email": "customer@example.com"
      },
      "status": "paid",
      "subtotal": 500.00,
      "tax_amount": 50.00,
      "discount_amount": 25.00,
      "total_amount": 525.00,
      "currency": "USD",
      "due_date": "2024-02-01",
      "paid_date": "2024-01-25",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Get Invoice Detail
Get detailed information for a specific invoice.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/billing/m/invoices/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "id": 1,
  "invoice_number": "INV-2024-001",
  "customer": {
    "id": 1,
    "username": "customer1",
    "email": "customer@example.com"
  },
  "status": "paid",
  "order": 1,
  "items": [
    {
      "id": 1,
      "description": "Product A",
      "quantity": 2,
      "unit_price": 250.00,
      "tax_rate": 10,
      "tax_amount": 50.00,
      "discount": 0,
      "total": 550.00
    }
  ],
  "subtotal": 500.00,
  "tax_amount": 50.00,
  "discount_amount": 25.00,
  "total_amount": 525.00,
  "currency": "USD",
  "notes": "Payment due within 30 days",
  "due_date": "2024-02-01",
  "paid_date": "2024-01-25",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-25T10:00:00Z"
}
```

---

### Create Invoice
Create a new invoice.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/billing/m/invoices/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": 1,
    "order": 5,
    "items": [
      {
        "description": "Product A",
        "quantity": 2,
        "unit_price": 250.00,
        "tax_rate": 10
      }
    ],
    "discount_amount": 25.00,
    "currency": "USD",
    "due_date": "2024-02-01",
    "notes": "Payment due within 30 days"
  }'
```

#### Response
```json
{
  "id": 2,
  "invoice_number": "INV-2024-002",
  "customer": 1,
  "status": "draft",
  "total_amount": 525.00,
  "due_date": "2024-02-01",
  "created_at": "2024-01-02T00:00:00Z"
}
```

---

### Update Invoice
Update invoice details or change status.

#### Request
```bash
curl -X PATCH https://test.zonevast.com/api/v1/billing/m/invoices/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paid",
    "paid_date": "2024-01-25",
    "payment_method": "credit_card"
  }'
```

#### Response
```json
{
  "id": 1,
  "status": "paid",
  "paid_date": "2024-01-25",
  "payment_method": "credit_card",
  "updated_at": "2024-01-25T10:00:00Z"
}
```

---

### Delete Invoice
Delete an invoice (only draft status).

#### Request
```bash
curl -X DELETE https://test.zonevast.com/api/v1/billing/m/invoices/2/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "message": "Invoice deleted successfully"
}
```

---

### Send Invoice
Send invoice to customer via email.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/billing/m/invoices/1/send/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_email": "customer@example.com",
    "message": "Please find attached your invoice"
  }'
```

#### Response
```json
{
  "id": 1,
  "status": "sent",
  "sent_at": "2024-01-02T11:00:00Z",
  "message": "Invoice sent successfully"
}
```

---

### List Coupons
Get all discount coupons.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/billing/m/coupons/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Query Parameters
- `code`: Filter by coupon code
- `status`: Filter by status (active, expired, inactive)
- `discount_type`: Filter by type (percentage, fixed_amount)

#### Response
```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "code": "SAVE20",
      "description": "20% off on all products",
      "discount_type": "percentage",
      "discount_value": 20.00,
      "min_order_amount": 100.00,
      "max_discount_amount": 50.00,
      "usage_limit": 100,
      "used_count": 25,
      "valid_from": "2024-01-01",
      "valid_until": "2024-12-31",
      "is_active": true
    }
  ]
}
```

---

### Create Coupon
Create a new discount coupon.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/billing/m/coupons/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WINTER30",
    "description": "30% off winter collection",
    "discount_type": "percentage",
    "discount_value": 30.00,
    "min_order_amount": 150.00,
    "usage_limit": 50,
    "valid_from": "2024-01-01",
    "valid_until": "2024-03-31"
  }'
```

#### Response
```json
{
  "id": 2,
  "code": "WINTER30",
  "discount_type": "percentage",
  "discount_value": 30.00,
  "usage_limit": 50,
  "used_count": 0,
  "is_active": true
}
```

---

### Apply Coupon
Validate and apply coupon to order.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/billing/m/coupons/validate/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SAVE20",
    "order_amount": 200.00
  }'
```

#### Response
```json
{
  "valid": true,
  "coupon": {
    "id": 1,
    "code": "SAVE20",
    "discount_type": "percentage",
    "discount_value": 20.00
  },
  "discount_amount": 40.00,
  "final_amount": 160.00,
  "message": "Coupon applied successfully"
}
```

---

### List Subscriptions
Get all user subscriptions.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/billing/m/subscriptions/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Query Parameters
- `user`: Filter by user ID
- `status`: Filter by status (active, paused, cancelled, expired)
- `plan`: Filter by plan ID

#### Response
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "username": "user1",
        "email": "user@example.com"
      },
      "plan": {
        "id": 1,
        "name": "Premium Plan",
        "price": 29.99,
        "billing_cycle": "monthly"
      },
      "status": "active",
      "start_date": "2024-01-01",
      "next_billing_date": "2024-02-01",
      "auto_renew": true
    }
  ]
}
```

---

### Create Subscription
Create a new subscription for a user.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/billing/m/subscriptions/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user": 1,
    "plan": 1,
    "start_date": "2024-01-01",
    "auto_renew": true
  }'
```

#### Response
```json
{
  "id": 2,
  "user": 1,
  "plan": {
    "id": 1,
    "name": "Premium Plan",
    "price": 29.99
  },
  "status": "active",
  "start_date": "2024-01-01",
  "next_billing_date": "2024-02-01",
  "auto_renew": true
}
```

---

### Update Subscription
Update subscription settings or cancel.

#### Request
```bash
curl -X PATCH https://test.zonevast.com/api/v1/billing/m/subscriptions/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "auto_renew": false,
    "cancel_at_period_end": true
  }'
```

#### Cancel Subscription
```bash
curl -X POST https://test.zonevast.com/api/v1/billing/m/subscriptions/1/cancel/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "No longer needed",
    "cancel_immediately": false
  }'
```

#### Response
```json
{
  "id": 1,
  "status": "cancelled",
  "cancelled_at": "2024-01-15T00:00:00Z",
  "message": "Subscription will be cancelled at the end of the billing period"
}
```

---

### Billing Summary
Get billing summary and statistics.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/billing/m/summary/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Query Parameters
- `start_date`: Start date for summary period
- `end_date`: End date for summary period

#### Response
```json
{
  "period": {
    "start_date": "2024-01-01",
    "end_date": "2024-01-31"
  },
  "total_invoices": 25,
  "paid_invoices": 20,
  "pending_invoices": 3,
  "overdue_invoices": 2,
  "total_revenue": 13125.00,
  "outstanding_amount": 525.00,
  "active_coupons": 5,
  "active_subscriptions": 10,
  "subscription_revenue": 299.90
}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "customer": ["This field is required."],
  "items": ["At least one invoice item is required"]
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to manage invoices"
}
```

### 404 Not Found
```json
{
  "detail": "Invoice not found"
}
```

### 422 Unprocessable Entity
```json
{
  "detail": "Coupon code SAVE20 has expired"
}
```

```json
{
  "detail": "Coupon requires minimum order amount of $100.00"
}
```

```json
{
  "detail": "Cannot delete paid invoice"
}
```
