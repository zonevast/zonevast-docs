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
2. Set up your environment
3. Install SDK (optional): `npm install @zonevast/sdk`
4. Make your first API call
5. Explore the documentation

### What are the system requirements?

**Frontend Development**:
- Node.js 18+
- npm or yarn
- Modern web browser

**Backend Development**:
- Python 3.9+
- PostgreSQL 13+
- Redis (optional, for caching)

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
- REST: `https://dev-api.zonevast.com/api/v1`
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

### Which frontend framework should I use?

ZoneVast provides Next.js applications. You can use:
- **Portal** (port 3001): Main entry point
- **ProductSuite** (port 3002): Product management
- **InventorySuite** (port 3003): Inventory management
- **OrderSuite** (port 3004): Order processing
- **DebtPro** (port 3005): Debt management
- **RepairPro** (port 3006): Repair services
- **BlogSuite** (port 3007): Content management
- **CustomerSuite** (port 3008): CRM

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

### Can I run backend services locally?

Yes! Use Docker Compose:

```bash
cd kong-gateway/
docker-compose up -d
```

Services will be available on ports 8010-8110.

### How do I deploy a service?

Use `micrzone` CLI:

```bash
micrzone update dev
```

Or use AWS SAM for Lambda deployment.

### How do I add a new microservice?

1. Create Django project
2. Add REST endpoints or GraphQL schema
3. Deploy to Lambda
4. Configure API Gateway routing
5. Update documentation

See [Architecture](./architecture.md) for details.

## Errors

### "Missing Authentication Token"

Means API Gateway isn't receiving your auth token. Check:
1. Token exists in localStorage
2. Authorization header format: `Bearer {token}`
3. Token is not expired
4. Request going through API Gateway

### CORS errors

Configure your environment or use proxy:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8010',
        changeOrigin: true
      }
    }
  }
});
```

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

## Development

### How do I contribute?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Where is the source code?

https://github.com/zonevast/platform

### How do I run tests?

```bash
# Frontend
npm run test

# Backend (Django)
python3 manage.py test
```

## Troubleshooting

### Backend not responding

Check service health:

```bash
curl http://localhost:8010/health/
```

Check logs:

```bash
docker-compose logs zv-auth-service
```

### GraphQL queries not working

Verify query syntax using GraphQL playground:
- Production: https://api.zonevast.com/graphql/product
- Development: http://localhost:3000/graphql/product

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
