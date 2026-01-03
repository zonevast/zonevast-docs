# Webhooks API

## Base URL
`https://test.zonevast.com/api/v1`

## Authentication
All webhook endpoints require JWT token in Authorization header:
```bash
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Webhook Configuration

### List Webhooks
Get all webhooks configured for your project.

```bash
curl -X GET https://test.zonevast.com/api/v1/projects/webhooks/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "project": 1,
      "name": "Order Created Hook",
      "url": "https://your-app.com/webhooks/orders",
      "events": ["order.created", "order.updated"],
      "is_active": true,
      "secret": "whsec_xxxxxxxx",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Create Webhook
Register a new webhook for your project.

```bash
curl -X POST https://test.zonevast.com/api/v1/projects/webhooks/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Payment Hook",
    "url": "https://your-app.com/webhooks/payments",
    "events": ["payment.success", "payment.failed"],
    "secret": "your_custom_secret"
  }'
```

**Request Body:**
- `name` (string, required): Webhook identifier
- `url` (string, required): HTTPS endpoint URL
- `events` (array, required): List of event types to subscribe
- `secret` (string, optional): Custom signing secret (auto-generated if not provided)

**Response:**
```json
{
  "id": 2,
  "project": 1,
  "name": "Payment Hook",
  "url": "https://your-app.com/webhooks/payments",
  "events": ["payment.success", "payment.failed"],
  "is_active": true,
  "secret": "whsec_a1b2c3d4",
  "created_at": "2024-01-02T10:00:00Z"
}
```

---

### Update Webhook
Modify existing webhook configuration.

```bash
curl -X PATCH https://test.zonevast.com/api/v1/projects/webhooks/1/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_active": false,
    "events": ["order.created", "order.updated", "order.deleted"]
  }'
```

---

### Delete Webhook
Remove a webhook configuration.

```bash
curl -X DELETE https://test.zonevast.com/api/v1/projects/webhooks/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "message": "Webhook deleted successfully"
}
```

---

### Rotate Secret
Generate a new signing secret for a webhook.

```bash
curl -X POST https://test.zonevast.com/api/v1/projects/webhooks/1/rotate-secret/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "secret": "whsec_new_secret_here",
  "previous_secret": "whsec_old_secret",
  "rotated_at": "2024-01-02T11:00:00Z"
}
```

---

## Event Types

### Available Events

#### Order Events
- `order.created` - New order created
- `order.updated` - Order details modified
- `order.deleted` - Order cancelled/deleted
- `order.fulfilled` - Order fulfillment completed

#### Payment Events
- `payment.success` - Payment processed successfully
- `payment.failed` - Payment attempt failed
- `payment.refunded` - Payment refunded

#### Inventory Events
- `inventory.low_stock` - Product stock below threshold
- `inventory.out_of_stock` - Product out of stock
- `inventory.restocked` - Product restocked

#### Product Events
- `product.created` - New product added
- `product.updated` - Product details modified
- `product.deleted` - Product removed

#### Project Events
- `project.user_added` - User added to project
- `project.user_removed` - User removed from project
- `project.settings_changed` - Project settings updated

---

### Event Payload Structure

All webhook events follow this structure:

```json
{
  "id": "evt_1234567890",
  "event": "order.created",
  "timestamp": "2024-01-02T10:00:00Z",
  "project": 1,
  "data": {
    "id": 123,
    "order_number": "ORD-001",
    "status": "pending",
    "total": 99.99,
    "currency": "USD"
  }
}
```

---

## Signature Verification

Each webhook request includes these headers:

### Headers
- `X-Webhook-ID`: Unique webhook event identifier
- `X-Webhook-Signature`: HMAC signature for verification
- `X-Webhook-Timestamp`: Unix timestamp of event
- `X-Webhook-Event`: Event type name

### Verification Process

#### Node.js Example
```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return signature === `sha256=${digest}`;
}

// In your webhook endpoint
app.post('/webhook', (req) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = req.body;

  if (verifySignature(JSON.stringify(payload), signature, WEBHOOK_SECRET)) {
    // Process verified webhook
  } else {
    // Reject invalid signature
  }
});
```

#### Python Example
```python
import hmac
import hashlib

def verify_signature(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return signature == f'sha256={expected}'

# In your Flask/Django view
def webhook_view(request):
    signature = request.headers.get('X-Webhook-Signature')
    payload = request.body

    if verify_signature(payload, signature, WEBHOOK_SECRET):
        # Process webhook
    else:
        # Return 401
```

#### cURL Test
```bash
# Test signature verification manually
PAYLOAD='{"id":"evt_123","event":"order.created"}'
SECRET='whsec_your_secret'

SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')

curl -X POST https://your-app.com/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: sha256=$SIGNATURE" \
  -d "$PAYLOAD"
```

---

## Webhook Delivery

### Retry Policy
Webhooks are retried with exponential backoff:
- **Attempt 1**: Immediate
- **Attempt 2**: 1 minute later
- **Attempt 3**: 5 minutes later
- **Attempt 4**: 30 minutes later
- **Attempt 5**: 2 hours later

After 5 failed attempts, the webhook is disabled.

### Delivery Status

#### Check Webhook Delivery Status
```bash
curl -X GET https://test.zonevast.com/api/v1/projects/webhooks/1/deliveries/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "webhook": 1,
      "event_id": "evt_1234567890",
      "status": "success",
      "http_status": 200,
      "attempt": 1,
      "sent_at": "2024-01-02T10:00:00Z",
      "response_time_ms": 245
    },
    {
      "id": 2,
      "webhook": 1,
      "event_id": "evt_0987654321",
      "status": "failed",
      "http_status": 500,
      "attempt": 3,
      "sent_at": "2024-01-02T10:05:00Z",
      "error_message": "Connection timeout"
    }
  ]
}
```

---

## Best Practices

1. **Always verify signatures** before processing webhook data
2. **Return 2xx status codes** quickly (within 5 seconds)
3. **Use HTTPS** endpoints only
4. **Handle idempotency** - same event may be delivered multiple times
5. **Log all events** for debugging and reconciliation
6. **Implement retry logic** on your server for handling failures

---

## Error Responses

### 400 Bad Request
```json
{
  "url": ["This field is required."],
  "events": ["At least one event must be specified"]
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to manage webhooks for this project"
}
```

### 404 Not Found
```json
{
  "detail": "Webhook not found"
}
```

### 415 Unsupported Media Type
```json
{
  "detail": "Invalid event type: invalid.event"
}
```
