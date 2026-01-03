# Frequently Asked Questions

Common questions about ZoneVast platform.

## General

### What is ZoneVast?

ZoneVast is a comprehensive microservices platform providing:
- **Backend Services**: Django REST + GraphQL microservices
- **Frontend Applications**: Next.js applications for various business needs
- **API Gateway**: AWS SAM Gateway for unified API access
- **SDK**: Official SDKs for JavaScript/TypeScript and Python

### How do I get started?

1. Read the [Quick Start Guide](./quick-start.md)
2. Get your API credentials
3. Make your first API call
4. Explore the documentation

## Authentication

### How do I authenticate?

ZoneVast uses JWT tokens:

```typescript
// Login
const response = await fetch('/api/v1/auth/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'user@example.com',
    password: 'password123'
  })
});

const { access, refresh } = await response.json();
localStorage.setItem('auth_token', access);
```

See [API Basics](./api-basics.md) for details.

### How long do tokens last?

- **Access tokens**: 15 minutes
- **Refresh tokens**: 7 days

Implement auto-refresh for seamless experience:

```typescript
setInterval(async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  const response = await fetch('/api/v1/auth/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh: refreshToken })
  });
  const { access } = await response.json();
  localStorage.setItem('auth_token', access);
}, 14 * 60 * 1000); // Every 14 minutes
```

### Why am I getting 401 errors?

Common causes:
1. **Token expired**: Refresh your token
2. **Invalid token**: Log in again
3. **Missing token**: Include `Authorization: Bearer {token}` header
4. **Wrong format**: Ensure format is `Bearer {token}` (with space)

### How do I handle token expiration?

Implement auto-refresh or use the SDK which handles it automatically:

```typescript
import { ZoneVastClient } from '@zonevast/sdk';

const client = new ZoneVastClient({
  autoRefresh: true // Automatically refresh tokens
});
```

## API Usage

### What's the base URL?

**Production**:
- REST: `https://api.zonevast.com/api/v1`
- GraphQL: `https://api.zonevast.com/graphql/{service}`

**Staging**:
- REST: `https://test.zonevast.com/api/v1`
- GraphQL: `https://test.zonevast.com/graphql/{service}`

### How do I make API calls?

**REST API**:
```typescript
const response = await fetch('/api/v1/product/products/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

**GraphQL**:
```typescript
const response = await fetch('/graphql/product', {
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
        }
      }
    `
  })
});
```

### Which GraphQL services are available?

- `product` - Product catalog
- `inventory` - Stock management
- `order` - Order processing
- `customer` - Customer data
- `repair` - Repair services
- `debt` - Debt management
- `billing` - Payments
- `pos` - Point of sale

### How do I handle pagination?

REST API uses cursor-based pagination:

```typescript
const response = await fetch('/api/v1/product/products/?page=1&page_size=20');
const { count, next, previous, results } = await response.json();
```

GraphQL uses relay-style pagination:

```graphql
query GetProducts($first: Int, $after: String) {
  products(first: $first, after: $after) {
    edges {
      node {
        id
        name
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## Frontend

### Which frontend applications are available?

ZoneVast provides Next.js applications:
- **Portal**: Main entry point at https://test.zonevast.com
- **ProductSuite**: Product management at https://test.zonevast.com/products
- **InventorySuite**: Inventory management at https://test.zonevast.com/inventory
- **OrderSuite**: Order processing at https://test.zonevast.com/orders
- **DebtPro**: Debt management at https://test.zonevast.com/debt
- **RepairPro**: Repair services at https://test.zonevast.com/repair
- **BlogSuite**: Content management at https://test.zonevast.com/blog
- **CustomerSuite**: CRM at https://test.zonevast.com/customers

Or build your own with the SDK.

### How do I integrate with my React app?

```bash
npm install @zonevast/sdk
```

```typescript
import { ZoneVastProvider, useProducts } from '@zonevast/sdk/react';

function App() {
  return (
    <ZoneVastProvider baseURL="https://api.zonevast.com">
      <ProductList />
    </ZoneVastProvider>
  );
}

function ProductList() {
  const { data, loading } = useProducts();
  // ...
}
```

### How do I handle multi-language?

ZoneVast supports Arabic and English via next-intl:

```typescript
// Language is stored in cookies
document.cookie = 'language=ar; path=/';
window.location.reload();
```

See [Multi-Language Guide](../guides/multi-language.md) for details.

### How do I manage state?

ZoneVast uses:
- **Zustand** for global state
- **React Query** for server state
- **React Context** for theme/auth

```typescript
import { create } from 'zustand';

const useStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products })
}));
```

## Backend

### How do I integrate backend services?

Use the API endpoints documented in this portal. All services are accessible through the API Gateway at `https://test.zonevast.com/api/v1/`.

For GraphQL services, use `https://test.zonevast.com/graphql/{service-name}`.

See [Architecture](./architecture.md) for details.

## Errors

### "Missing Authentication Token"

Means API Gateway isn't receiving your auth token. Check:
1. Token exists in localStorage
2. Authorization header format: `Bearer {token}`
3. Token is not expired
4. Request going through API Gateway

### CORS errors

If you encounter CORS errors, ensure your requests are going to the correct API endpoint:

```typescript
// Correct API endpoint
const response = await fetch('https://test.zonevast.com/api/v1/products/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

If issues persist, contact support with your domain information.

### 429 Too Many Requests

You're being rate-limited. Implement throttling:

```typescript
import pLimit from 'p-limit';

const limit = pLimit(5); // Max 5 concurrent requests

await Promise.all(
  items.map(item => limit(() => fetch(`/api/items/${item}`)))
);
```

## Billing

### How much does it cost?

See pricing page: https://zonevast.com/pricing

### How do I check my usage?

```typescript
const usage = await client.billing.getUsage();
console.log('API calls:', usage.apiCalls);
console.log('Storage:', usage.storage);
```

## Support

### How do I get help?

- **Documentation**: Read these docs
- **GitHub Issues**: Report bugs
- **Discord**: Community chat
- **Email**: support@zonevast.com

### Where do I report bugs?

https://github.com/zonevast/platform/issues

### How do I request features?

https://github.com/zonevast/platform/discussions

## Troubleshooting

### Backend not responding

Check service health:

```bash
curl https://test.zonevast.com/api/v1/auth/health/
```

### GraphQL queries not working

Verify query syntax using GraphQL playground:
- Staging: https://test.zonevast.com/graphql/product
- Production: https://api.zonevast.com/graphql/product

### Slow performance

1. Enable caching
2. Use pagination
3. Select only needed fields
4. Use GraphQL field selection

See [Errors](./errors.md) for more troubleshooting.

## Next Steps

- Read [Quick Start](./quick-start.md) to get started
- Read [Examples](./examples.md) for code examples
- Read [Errors](./errors.md) for troubleshooting
