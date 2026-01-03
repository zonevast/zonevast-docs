# Authentication Guide

This guide shows how to authenticate with ZoneVast platform APIs.

## Overview

ZoneVast uses JWT (JSON Web Token) authentication. When you log in, you receive:
- **access token**: Short-lived token for API requests
- **refresh token**: Long-lived token for getting new access tokens
- **user data**: User profile information

## Getting a JWT Token

### Using the Auth Hook (React Apps)

```tsx
import { useAuth } from '@/hooks/useAuth';

function LoginForm() {
  const { login, isLoading, authError } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = 'user@example.com';
    const password = 'password123';

    const user = await login({ email, password });

    if (user) {
      console.log('Logged in:', user);
      // Token automatically stored in localStorage
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {authError && <p className="error">{authError}</p>}
    </form>
  );
}
```

### Direct API Call (Fetch)

```typescript
const response = await fetch('/api/v1/auth/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
// data.access - JWT access token
// data.refresh - JWT refresh token
// data.user - User profile data

// Store token
localStorage.setItem('auth_token', data.access);
```

### Direct API Call (Axios)

```typescript
import axios from 'axios';

const response = await axios.post('/api/v1/auth/login/', {
  username: 'user@example.com',
  password: 'password123'
});

const { access, refresh, user } = response.data;

// Store token
localStorage.setItem('auth_token', access);
```

## Using Token in Requests

### With Fetch

```typescript
const token = localStorage.getItem('auth_token');

const response = await fetch('/api/v1/inventory/items/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### With Axios

```typescript
import axios from 'axios';

const token = localStorage.getItem('auth_token');

// Single request
const response = await axios.get('/api/v1/inventory/items/', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Or set up axios interceptors
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### With Apollo Client (GraphQL)

Apollo Client is configured to automatically include tokens:

```typescript
import { useQuery, gql } from '@apollo/client';

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
    }
  }
`;

function ProjectList() {
  // Token automatically added from localStorage
  const { data, loading, error } = useQuery(GET_PROJECTS);

  // Token is retrieved from localStorage by authLink
  // See: graphql/client.ts
}
```

## Token Management

### Check if User is Authenticated

```typescript
import { isAuthenticated, getUserData } from '@/api/auth';

if (isAuthenticated()) {
  const user = getUserData();
  console.log('Current user:', user);
}
```

### Get Current User Data

```typescript
import { getCurrentUser } from '@/api/auth';

try {
  const user = await getCurrentUser();
  console.log('User profile:', user);
} catch (error) {
  console.error('Not authenticated');
}
```

### Refresh Token

When your access token expires, use the refresh token:

```typescript
const refreshToken = localStorage.getItem('refresh_token');

const response = await fetch('/api/v1/auth/token/refresh/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refresh: refreshToken })
});

const data = await response.json();

// Store new access token
localStorage.setItem('auth_token', data.access);
```

### Logout

```typescript
import { logout } from '@/api/auth';

// Using the logout function
await logout();

// Or manually
localStorage.removeItem('auth_token');
localStorage.removeItem('refresh_token');
localStorage.removeItem('user_email');
localStorage.removeItem('user_data');
```

## Complete Authentication Flow Example

```typescript
import { login, isAuthenticated, getCurrentUser, logout } from '@/api/auth';

async function authenticateAndFetch() {
  // 1. Login
  const authResponse = await login({
    username: 'user@example.com',
    password: 'password123'
  });

  console.log('Logged in as:', authResponse.user);

  // 2. Make authenticated request
  if (isAuthenticated()) {
    const response = await fetch('/api/v1/project/projects/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    const projects = await response.json();
    console.log('Projects:', projects);

    // 3. Get current user
    const user = await getCurrentUser();
    console.log('Current user:', user);

    // 4. Logout when done
    await logout();
  }
}
```

## Error Handling

### Handle 401 Unauthorized

```typescript
const response = await fetch('/api/v1/some-endpoint/', {
  headers: { 'Authorization': `Bearer ${token}` }
});

if (response.status === 401) {
  // Token expired or invalid
  localStorage.removeItem('auth_token');
  // Redirect to login
  window.location.href = '/login';
}
```

### Handle Network Errors

```typescript
try {
  const response = await fetch('/api/v1/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  const data = await response.json();
  // Success
} catch (error) {
  console.error('Authentication error:', error.message);
  // Show error to user
}
```

## cURL Examples

### Login

```bash
curl -X POST http://localhost:8010/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"password123"}'
```

### Authenticated Request

```bash
curl -X GET http://localhost:8010/api/v1/project/projects/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token

```bash
curl -X POST http://localhost:8010/api/v1/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh":"YOUR_REFRESH_TOKEN"}'
```

## Best Practices

1. **Store tokens securely**: Use httpOnly cookies in production (not localStorage)
2. **Handle token expiration**: Implement automatic refresh logic
3. **Clear tokens on logout**: Always remove all auth data
4. **Validate tokens server-side**: Never trust tokens only on the client
5. **Use HTTPS**: Always use HTTPS in production for auth endpoints
6. **Handle 401 errors**: Redirect to login when tokens expire

## Demo Mode

For development, you can use demo accounts with any password:

```typescript
// These will work without backend
await login({ email: 'demo@example.com', password: 'any' });
await login({ email: 'test@example.com', password: 'any' });
```

## Service Endpoints

- **Auth Service**: `http://localhost:8010` (local)
- **Login**: `/api/v1/auth/login/`
- **Register**: `/api/v1/auth/register/`
- **Logout**: `/api/v1/auth/logout/`
- **Refresh Token**: `/api/v1/auth/token/refresh/`
- **Get Current User**: `/api/v1/auth/me/`
