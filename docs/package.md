# SDK Package Information

ZoneVast provides SDK packages for easy integration with your applications.

## Official SDKs

### JavaScript/TypeScript SDK

**Package**: `@zonevast/sdk`

**Installation**:
```bash
npm install @zonevast/sdk
# or
yarn add @zonevast/sdk
# or
pnpm add @zonevast/sdk
```

**Features**:
- TypeScript support with full type definitions
- Authentication management
- REST API client
- GraphQL client with Apollo integration
- React hooks for common operations
- Automatic token refresh
- Error handling
- Retry logic

**Basic Usage**:
```typescript
import { ZoneVastClient } from '@zonevast/sdk';

const client = new ZoneVastClient({
  baseURL: 'https://api.zonevast.com',
  authURL: 'https://api.zonevast.com/api/v1/auth'
});

// Login
await client.auth.login({
  username: 'user@example.com',
  password: 'password123'
});

// Make API calls
const products = await client.product.list();
const product = await client.product.get(123);
```

**React Hooks**:
```typescript
import { useProducts, useCreateProduct } from '@zonevast/sdk/react';

function ProductList() {
  const { data, loading, error } = useProducts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### Python SDK

**Package**: `zonevast`

**Installation**:
```bash
pip install zonevast
```

**Features**:
- Python 3.8+ support
- Async/await support
- Django model integration
- REST API client
- GraphQL client
- Type hints

**Basic Usage**:
```python
from zonevast import ZoneVastClient

client = ZoneVastClient(
    base_url='https://api.zonevast.com',
    auth_url='https://api.zonevast.com/api/v1/auth'
)

# Login
client.auth.login(
    username='user@example.com',
    password='password123'
)

# Make API calls
products = client.product.list()
product = client.product.get(123)
```

### React Hooks Package

**Package**: `@zonevast/hooks`

**Installation**:
```bash
npm install @zonevast/hooks
```

**Features**:
- Pre-built React hooks
- Zustand stores
- React Query integration
- Form hooks
- Auth hooks

**Available Hooks**:
```typescript
import {
  // Auth hooks
  useAuth,
  useLogin,
  useLogout,
  useCurrentUser,

  // Data hooks
  useProducts,
  useOrders,
  useCustomers,
  useInventory,

  // Form hooks
  useProductForm,
  useOrderForm,
  useCustomerForm,

  // Utility hooks
  useDebounce,
  usePagination,
  useLocalStorage
} from '@zonevast/hooks';
```

## UI Components Library

**Package**: `@zonevast/ui-components`

**Installation**:
```bash
npm install @zonevast/ui-components
```

**Features**:
- NextUI-based components
- Tailwind CSS styling
- Theming support
- Responsive design
- Accessibility

**Basic Usage**:
```typescript
import { Button, Card, Table, Modal } from '@zonevast/ui-components';

function ProductList() {
  return (
    <Card>
      <Table data={products} />
      <Button onClick={handleAdd}>Add Product</Button>
    </Card>
  );
}
```

## GraphQL Code Generator

**Package**: `@zonevast/graphql-codegen`

**Installation**:
```bash
npm install -D @zonevast/graphql-codegen
```

**Features**:
- Generate TypeScript types from GraphQL schema
- Generate React Query hooks
- Support for multiple GraphQL services
- Watch mode for development

**Configuration**:
```typescript
// codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://api.zonevast.com/graphql/product',
  documents: 'src/graphql/**/*.graphql',
  generates: {
    'src/lib/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query'
      ]
    }
  }
};

export default config;
```

## Package Structure

### SDK Architecture

```
@zonevast/sdk/
├── src/
│   ├── auth/           # Authentication
│   ├── client/         # HTTP client
│   ├── services/       # API services
│   │   ├── product/
│   │   ├── inventory/
│   │   ├── order/
│   │   └── ...
│   ├── graphql/        # GraphQL client
│   ├── types/          # TypeScript types
│   └── utils/          # Utilities
└── react/              # React hooks
```

### Service Clients

Each microservice has a dedicated client:

```typescript
// Product service
client.product.list()
client.product.get(id)
client.product.create(data)
client.product.update(id, data)
client.product.delete(id)

// Inventory service
client.inventory.list()
client.inventory.get(id)
client.inventory.reserve(item_id, quantity)

// Order service
client.order.list()
client.order.get(id)
client.order.create(data)
client.order.updateStatus(id, status)
```

## Configuration

### Client Configuration

```typescript
const client = new ZoneVastClient({
  // API configuration
  baseURL: 'https://api.zonevast.com',
  authURL: 'https://api.zonevast.com/api/v1/auth',
  graphqlURL: 'https://api.zonevast.com/graphql',

  // Auth configuration
  storage: 'localStorage', // or 'cookie'
  tokenRefreshInterval: 14 * 60 * 1000, // 14 minutes

  // Request configuration
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000,

  // Logging
  logLevel: 'error', // 'debug' | 'info' | 'warn' | 'error'
});
```

### Environment-Specific Configuration

```typescript
const config = {
  development: {
    baseURL: 'http://localhost:8010',
    authURL: 'http://localhost:8010/api/v1/auth',
    graphqlURL: 'http://localhost:3000/graphql'
  },
  staging: {
    baseURL: 'https://dev-api.zonevast.com',
    authURL: 'https://dev-api.zonevast.com/api/v1/auth',
    graphqlURL: 'https://test.zonevast.com/graphql'
  },
  production: {
    baseURL: 'https://api.zonevast.com',
    authURL: 'https://api.zonevast.com/api/v1/auth',
    graphqlURL: 'https://api.zonevast.com/graphql'
  }
};

const client = new ZoneVastClient(config[process.env.NODE_ENV]);
```

## Advanced Usage

### Custom HTTP Client

```typescript
import axios from 'axios';

const customClient = axios.create({
  baseURL: 'https://api.zonevast.com',
  timeout: 30000
});

const client = new ZoneVastClient({
  httpClient: customClient
});
```

### Interceptors

```typescript
// Request interceptor
client.addRequestInterceptor((config) => {
  // Add custom headers
  config.headers['X-Custom-Header'] = 'value';
  return config;
});

// Response interceptor
client.addResponseInterceptor((response) => {
  // Handle response
  return response;
});

// Error interceptor
client.addErrorInterceptor((error) => {
  // Handle errors
  if (error.response?.status === 401) {
    // Refresh token
  }
  return Promise.reject(error);
});
```

### GraphQL Subscriptions

```typescript
import { ZoneVastGraphQLClient } from '@zonevast/sdk/graphql';

const gqlClient = new ZoneVastGraphQLClient({
  url: 'wss://api.zonevast.com/graphql',
  connectionParams: {
    authToken: localStorage.getItem('auth_token')
  }
});

// Subscribe to updates
const subscription = gqlClient.subscribe({
  query: PRODUCT_UPDATED_SUBSCRIPTION,
  variables: { id: 123 }
}).subscribe({
  next: (data) => console.log('Product updated:', data),
  error: (error) => console.error('Subscription error:', error)
});

// Unsubscribe
subscription.unsubscribe();
```

## Version Compatibility

| SDK Version | API Version | Supported Until |
|-------------|-------------|-----------------|
| 1.0.x | v1 | Current |
| 2.0.x | v2 | TBD |

## Dependencies

### @zonevast/sdk

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "@apollo/client": "^3.8.0",
    "graphql": "^16.8.0"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```

### @zonevast/ui-components

```json
{
  "dependencies": {
    "nextui": "^2.0.0",
    "framer-motion": "^10.16.0",
    "react-hook-form": "^7.47.0"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "tailwindcss": ">=3.0.0"
  }
}
```

## Migration Guide

### From 0.x to 1.0

```typescript
// Old (0.x)
import { ZoneVast } from 'zonevast';

const zv = new ZoneVast({ apiKey: 'xxx' });
const products = zv.getProducts();

// New (1.0)
import { ZoneVastClient } from '@zonevast/sdk';

const client = new ZoneVastClient();
const products = await client.product.list();
```

## Support

For SDK-specific issues:
- GitHub: https://github.com/zonevast/sdk/issues
- Discord: https://discord.gg/zonevast
- Email: sdk@zonevast.com

## License

MIT License - see LICENSE file for details

## Next Steps

- Read [Examples](./examples.md) for SDK usage examples
- Read [API Basics](./api-basics.md) for API details
- Check [FAQ](./faq.md) for common questions
