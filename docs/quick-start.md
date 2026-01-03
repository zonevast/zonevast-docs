# Quick Start Guide

Get started with ZoneVast API in minutes.

## Prerequisites

Before you start, ensure you have:
- Basic knowledge of REST APIs and/or GraphQL
- A code editor or IDE
- cURL or Postman for testing APIs (optional)

## Step 1: Get Your API Credentials

### Sign Up for an Account

1. Navigate to https://test.zonevast.com
2. Click "Register" or "Sign Up"
3. Fill in the form:
   - Name: Your full name
   - Email: your.email@example.com
   - Password: (minimum 8 characters)
4. Click "Register"

### Get Your JWT Token

Once registered, authenticate to receive your JWT tokens:

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your.email@example.com",
    "password": "your_password"
  }'
```

Response:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "your.email@example.com",
    "username": "yourname"
  }
}
```

Save the `access` token - you'll need it for API requests.

## Step 2: Make Your First API Call

### REST API Example

```bash
curl -X GET https://test.zonevast.com/api/v1/project/projects/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

Or with JavaScript:

```javascript
const token = 'YOUR_ACCESS_TOKEN';

const response = await fetch('https://test.zonevast.com/api/v1/project/projects/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const projects = await response.json();
console.log('Projects:', projects);
```

### GraphQL Example

```bash
curl -X POST https://test.zonevast.com/graphql/product \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetProducts { products { id name price } }"
  }'
```

Or with JavaScript:

```javascript
const response = await fetch('https://test.zonevast.com/graphql/product', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: `
      query GetProducts {
        products {
          id
          name
          price
        }
      }
    `
  })
});

const data = await response.json();
console.log('Products:', data.data.products);
```

## API Endpoints Reference

### Base URLs

| Environment | REST API | GraphQL |
|-------------|----------|---------|
| Staging | `https://test.zonevast.com/api/v1` | `https://test.zonevast.com/graphql/{service}` |
| Production | `https://api.zonevast.com/api/v1` | `https://api.zonevast.com/graphql/{service}` |

### Available Services

| Service | REST Path | GraphQL Endpoint |
|---------|-----------|------------------|
| Auth | `/api/v1/auth/` | N/A |
| Product | `/api/v1/product/` | `/graphql/product` |
| Inventory | `/api/v1/inventory/` | `/graphql/inventory` |
| Orders | `/api/v1/orders/` | `/graphql/order` |
| Billing | `/api/v1/billing/` | `/graphql/billing` |
| Project | `/api/v1/project/` | `/graphql/project` |

## Next Steps

- Read [API Basics](./api-basics.md) for detailed authentication setup
- Read [Architecture](./architecture.md) for system overview
- Read [Examples](./examples.md) for code examples
- Check [Errors](./errors.md) for troubleshooting
