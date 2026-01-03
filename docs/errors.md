# Error Codes and Troubleshooting

Common errors, their causes, and solutions.

## HTTP Status Codes

### 400 Bad Request

**Cause**: Invalid request data or malformed request

**Examples**:
- Missing required fields
- Invalid data format
- Validation errors

**Solution**:
```typescript
try {
  const response = await fetch('/api/v1/product/products/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '' }) // Empty name
  });

  if (response.status === 400) {
    const error = await response.json();
    console.error('Validation errors:', error);
    // Display errors to user
  }
} catch (error) {
  console.error('Request failed:', error);
}
```

**Prevention**:
- Validate data on client before sending
- Use TypeScript types
- Implement form validation

### 401 Unauthorized

**Cause**: Missing, invalid, or expired JWT token

**Examples**:
- Token not provided
- Token expired
- Token malformed

**Solution**:
```typescript
// Check if token exists
const token = localStorage.getItem('auth_token');

if (!token) {
  // Redirect to login
  window.location.href = '/login';
}

// Or refresh token
const refreshToken = localStorage.getItem('refresh_token');
const response = await fetch('/api/v1/auth/token/refresh/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refresh: refreshToken })
});

const { access } = await response.json();
localStorage.setItem('auth_token', access);
```

**Prevention**:
- Implement auto-refresh logic
- Check token expiration before requests
- Use axios interceptors or Apollo authLink

### 403 Forbidden

**Cause**: User doesn't have permission to access resource

**Examples**:
- Accessing other user's data
- Missing role/permission
- Project access denied

**Solution**:
```typescript
if (response.status === 403) {
  alert('You do not have permission to access this resource');
  // Redirect or show access denied message
}
```

**Prevention**:
- Check user permissions before showing UI
- Implement proper RBAC
- Use project-based access control

### 404 Not Found

**Cause**: Resource doesn't exist

**Examples**:
- Invalid ID
- Resource deleted
- Wrong endpoint URL

**Solution**:
```typescript
const response = await fetch(`/api/v1/product/products/${id}/`);

if (response.status === 404) {
  alert('Product not found');
  // Redirect to list or show 404 page
}
```

**Prevention**:
- Validate IDs before making requests
- Handle deleted resources gracefully
- Check API documentation

### 422 Unprocessable Entity

**Cause**: Business logic validation failed

**Examples**:
- Duplicate unique field
- Invalid state transition
- Referential integrity error

**Solution**:
```typescript
if (response.status === 422) {
  const error = await response.json();
  // error.detail contains validation message
  alert(`Validation error: ${error.detail}`);
}
```

**Common 422 Errors**:
- `Product with this name already exists`
- `Cannot delete product with active orders`
- `Insufficient stock`

### 429 Too Many Requests

**Cause**: Rate limit exceeded

**Examples**:
- Too many requests in short time
- API quota exceeded

**Solution**:
```typescript
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  alert(`Rate limited. Try again in ${retryAfter} seconds`);
}
```

**Prevention**:
- Implement request throttling
- Use pagination for large datasets
- Cache responses

### 500 Internal Server Error

**Cause**: Server-side error

**Examples**:
- Unhandled exception
- Service unavailable
- Temporary service outage

**Solution**:
```typescript
if (response.status === 500) {
  alert('Server error. Please try again later');
  // Log error for debugging
}
```

**Prevention**:
- Implement retry logic
- Show user-friendly error messages
- Log errors for monitoring

## GraphQL Errors

### GraphQL Validation Errors

**Cause**: Invalid GraphQL query

**Examples**:
- Syntax error in query
- Unknown field
- Type mismatch

**Solution**:
```typescript
const { error } = useQuery(GET_PRODUCTS);

if (error) {
  console.error('GraphQL error:', error.message);
  // Check query syntax
  // Verify field names
}
```

**Common Errors**:
- `Cannot query field "xyz" on type "Query"`
- `Field "id" of type "ID" is required`
- `Variable "$xyz" of type "String" is not provided`

### GraphQL Network Errors

**Cause**: Network or server error

**Examples**:
- Endpoint not reachable
- Invalid auth token
- Server error

**Solution**:
```typescript
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    // Handle 401
    if (networkError.message?.includes('401')) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
  }
});
```

## CORS Errors

**Cause**: Cross-origin request blocked

**Examples**:
- Frontend on different domain than API
- Missing CORS headers
- Preflight request failed

**Solution**:
Ensure you're using the correct API endpoint URL for your environment:

```typescript
// For staging
const API_BASE = 'https://test.zonevast.com/api/v1';

// For production
const API_BASE = 'https://api.zonevast.com/api/v1';
```

**Prevention**:
- Use correct environment URLs
- Contact support if CORS issues persist
- Use same domain in production

## Common Client Errors

### TypeError: Failed to fetch

**Cause**: Network error or CORS issue

**Solution**:
```typescript
try {
  const response = await fetch('/api/v1/products/');
} catch (error) {
  if (error instanceof TypeError) {
    console.error('Network error or CORS issue');
    // Check if backend is running
    // Check CORS configuration
  }
}
```

### SyntaxError: Unexpected token

**Cause**: Invalid JSON response

**Solution**:
```typescript
const response = await fetch('/api/v1/products/');

const text = await response.text();
try {
  const data = JSON.parse(text);
} catch (error) {
  console.error('Invalid JSON:', text);
  // Might be HTML error page
}
```

### ReferenceError: localStorage is not defined

**Cause**: Code running on server (SSR)

**Solution**:
```typescript
// Check if browser
const token = typeof window !== 'undefined'
  ? window.localStorage.getItem('auth_token')
  : null;

// Or use conditional check
if (typeof window !== 'undefined') {
  // Browser-only code
}
```

## Authentication Errors

### "Missing Authentication Token"

**Cause**: API Gateway not receiving auth token

**Solution**:
```typescript
// Ensure token is in Authorization header
const response = await fetch('/api/v1/products/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Check token format
if (!token) {
  console.error('No token found');
}
```

### Token expired

**Cause**: Access token expired (typically 15 minutes)

**Solution**:
```typescript
// Implement auto-refresh
async function getValidToken() {
  const token = localStorage.getItem('auth_token');
  const refreshToken = localStorage.getItem('refresh_token');

  // Try request with current token
  const response = await fetch('/api/v1/products/', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (response.status === 401) {
    // Refresh token
    const refreshResponse = await fetch('/api/v1/auth/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    });

    const { access } = await refreshResponse.json();
    localStorage.setItem('auth_token', access);

    return access;
  }

  return token;
}
```

## Performance Issues

### Slow API responses

**Causes**:
- Large payloads
- Unoptimized queries
- Network latency

**Solutions**:
```typescript
// Use pagination
const response = await fetch('/api/v1/products/?page=1&page_size=20');

// Use field selection
const query = gql`
  query GetProducts {
    products {
      id
      name
      price
      # Only select needed fields
    }
  }
`;

// Use caching
const { data } = useQuery(GET_PRODUCTS, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000 // 10 minutes
});
```

### Memory leaks

**Causes**:
- Not cleaning up subscriptions
- Not aborting requests
- Event listeners not removed

**Solution**:
```typescript
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/v1/products/', {
    signal: controller.signal
  })
    .then(r => r.json())
    .then(data => setData(data));

  return () => {
    // Cleanup on unmount
    controller.abort();
  };
}, []);
```

## Debugging Tips

### Enable verbose logging

```typescript
// Log all requests
fetch.interceptors.request.use(request => {
  console.log('Request:', request);
  return request;
});

fetch.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
});
```

### Check network tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Make request
4. Check:
   - Request URL
   - Request headers (especially Authorization)
   - Response status
   - Response body
   - Timing

### Use GraphQL playground

```bash
# Access GraphQL playground
# Staging: https://test.zonevast.com/graphql/product
# Production: https://api.zonevast.com/graphql/product
```

### Check service health

```bash
# Check if service is running
curl https://test.zonevast.com/api/v1/auth/health/

# Or in browser
fetch('https://test.zonevast.com/api/v1/auth/health/')
  .then(r => r.json())
  .then(console.log);
```

## Error Monitoring

### Sentry integration

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.NODE_ENV
});

// Capture errors
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error);
}
```

### Custom error logging

```typescript
function logError(error: Error, context?: any) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Send to logging service
  fetch('/api/v1/logs/errors/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorData)
  });
}
```

## Getting Help

### Check logs

For production issues, check CloudWatch logs or contact support at support@zonevast.com

### Enable debug mode

```typescript
// .env.development
VITE_DEBUG=true
```

### Common issues checklist

- [ ] Backend service is running
- [ ] Environment variables are set
- [ ] Token exists and is valid
- [ ] Request URL is correct
- [ ] Request body is valid JSON
- [ ] User has permissions
- [ ] Resource exists
- [ ] Not rate limited
- [ ] Network connection is stable
- [ ] CORS is configured

## Next Steps

- Read [Examples](./examples.md) for error handling patterns
- Check [FAQ](./faq.md) for common questions
- Read [Architecture](./architecture.md) for system overview
