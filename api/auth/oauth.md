# JWT Authentication Documentation

## Overview

ZoneVast uses JWT (JSON Web Token) based authentication for secure API access. JWT tokens are obtained by providing valid credentials to the authentication endpoint.

## Get JWT Token

### Endpoint
`POST https://test.zonevast.com/api/v1/auth/auth/token/`

### Request with cURL

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Request with JavaScript

```javascript
const response = await fetch('https://test.zonevast.com/api/v1/auth/auth/token/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const data = await response.json();
console.log(data.access);  // Access token
console.log(data.refresh); // Refresh token
```

### Request with Axios

```javascript
import axios from 'axios';

const response = await axios.post('https://test.zonevast.com/api/v1/auth/auth/token/', {
  username: 'admin',
  password: 'admin123'
});

const { access, refresh } = response.data;
```

## Response

### Success Response (200 OK)

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMDQ5MjAwLCJpYXQiOjE3MDMwNDU2MDAsImp0aSI6IjEyMzQ1Njc4OTAiLCJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkB6b25ldmFzdC5jb20ifQ.VjZWqVGxPYcxoHQ8e8xQmYqRqfXLvHKLp8MqPYFyV8",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcwMzEzMjAwMCwiaWF0IjoxNzAzMDQ1NjAwLCJqdGkiOiJhYmMxMjM0NTYiLCJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIn0.YnL3RsEQvYHx0hG8QnKLd8VpHqKLp8MqPYFyV8W2Xr"
}
```

**Token Types:**
- **access**: Short-lived token (5 minutes) for API requests
- **refresh**: Long-lived token (24 hours) for getting new access tokens

### Error Response (401 Unauthorized)

```json
{
  "detail": "No active account found with the given credentials"
}
```

## Using JWT Tokens in Requests

Once you have an access token, include it in the `Authorization` header with the `Bearer` prefix.

### cURL Example

```bash
curl -X GET https://test.zonevast.com/api/v1/auth/users/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### JavaScript Example

```javascript
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...';

const response = await fetch('https://test.zonevast.com/api/v1/auth/users/', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

### Axios with Interceptor

```javascript
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://test.zonevast.com/api/v1/'
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Make requests
const response = await api.get('auth/users/');
```

## Token Refresh

Access tokens expire after 5 minutes. Use the refresh token to get a new access token without re-authenticating.

### Endpoint
`POST https://test.zonevast.com/api/v1/auth/auth/token/refresh/`

### Request

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }'
```

```javascript
const response = await fetch('https://test.zonevast.com/api/v1/auth/auth/token/refresh/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    refresh: localStorage.getItem('refresh_token')
  })
});

const data = await response.json();
localStorage.setItem('access_token', data.access);
```

### Response

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## Automatic Token Refresh with Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://test.zonevast.com/api/v1/'
});

// Request interceptor - add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get new access token
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('https://test.zonevast.com/api/v1/auth/auth/token/refresh/', {
          refresh: refreshToken
        });

        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

## Token Structure

JWT tokens contain three parts separated by dots: `header.payload.signature`

### Decoded Access Token Payload

```json
{
  "token_type": "access",
  "exp": 1703049200,
  "iat": 1703045600,
  "jti": "1234567890",
  "user_id": 1,
  "username": "admin",
  "email": "admin@zonevast.com"
}
```

**Fields:**
- `token_type`: Token type (access or refresh)
- `exp`: Expiration timestamp (Unix timestamp)
- `iat`: Issued at timestamp (Unix timestamp)
- `jti`: JWT ID (unique identifier)
- `user_id`: User ID
- `username`: Username
- `email`: User email

## Error Handling

### Common Error Responses

**401 Unauthorized - Invalid Credentials**
```json
{
  "detail": "No active account found with the given credentials"
}
```

**401 Unauthorized - Invalid Token**
```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid",
  "messages": [
    {
      "token_class": "AccessToken",
      "token_type": "access",
      "message": "Token is invalid or expired"
    }
  ]
}
```

**400 Bad Request - Missing Fields**
```json
{
  "username": ["This field is required."],
  "password": ["This field is required."]
}
```

## Security Best Practices

### Storage
- **Never** store tokens in localStorage for production apps
- Use **httpOnly cookies** for web applications
- Use **Keychain/KeyStore** for mobile applications
- Use **environment variables** for server-side applications

### Transmission
- **Always** use HTTPS
- Include tokens in the `Authorization` header, not in URL parameters
- Never log tokens or include them in error messages

### Token Management
- Implement automatic token refresh before expiration
- Clear tokens on logout
- Implement proper error handling for expired tokens
- Use short expiration times for access tokens (5 minutes)

## Complete Authentication Flow Example

```javascript
class AuthManager {
  constructor() {
    this.baseURL = 'https://test.zonevast.com/api/v1';
  }

  async login(username, password) {
    const response = await fetch(`${this.baseURL}/auth/auth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const { access, refresh } = await response.json();
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    return { access, refresh };
  }

  async refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    const response = await fetch(`${this.baseURL}/auth/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const { access, refresh: newRefresh } = await response.json();
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', newRefresh);
    return access;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
}

// Usage
const auth = new AuthManager();

// Login
await auth.login('admin', 'admin123');

// Make authenticated request
const response = await fetch('https://test.zonevast.com/api/v1/auth/users/', {
  headers: auth.getAuthHeaders()
});

// Logout
auth.logout();
```

## Testing

### Test Authentication Flow

```bash
# 1. Get token
TOKEN_RESPONSE=$(curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}')

# Extract access token
ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access')

# 2. Use token
curl -X GET https://test.zonevast.com/api/v1/auth/users/ \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# 3. Refresh token
REFRESH_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.refresh')
curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d "{\"refresh\": \"$REFRESH_TOKEN\"}"
```

## Support

For authentication issues:
- Documentation: https://docs.zonevast.com/auth
- Email: support@zonevast.com
- Status Page: https://status.zonevast.com
