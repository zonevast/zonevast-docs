# Token Management Documentation

## Overview

This guide covers token management operations including validity checks, logout, and best practices for secure token handling in ZoneVast applications.

## Check Token Validity

### Method 1: Decode and Check Expiration

```javascript
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true; // If token is invalid, consider it expired
  }
}

// Usage
const token = localStorage.getItem('access_token');
if (isTokenExpired(token)) {
  console.log('Token is expired');
  // Refresh token
}
```

### Method 2: Make an Authenticated Request

### Endpoint
`GET https://test.zonevast.com/api/v1/auth/users/me/`

```bash
curl -X GET https://test.zonevast.com/api/v1/auth/users/me/ \
  -H "Authorization: Bearer your_access_token"
```

```javascript
async function checkTokenValidity(token) {
  try {
    const response = await fetch('https://test.zonevast.com/api/v1/auth/users/me/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok; // true if valid, false if expired
  } catch (error) {
    return false;
  }
}
```

**Response if Valid (200 OK):**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@zonevast.com",
  "first_name": "Admin",
  "last_name": "User"
}
```

**Response if Invalid (401 Unauthorized):**
```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid"
}
```

### Method 3: Verify Endpoint

### Endpoint
`POST https://test.zonevast.com/api/v1/auth/auth/token/verify/`

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/verify/ \
  -H "Content-Type: application/json" \
  -d '{"token": "your_access_token"}'
```

```javascript
async function verifyToken(token) {
  const response = await fetch('https://test.zonevast.com/api/v1/auth/auth/token/verify/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token })
  });

  return response.ok;
}
```

**Response if Valid (200 OK):**
```json
{}
```

**Response if Invalid (401 Unauthorized):**
```json
{
  "detail": "Token is invalid or expired",
  "code": "token_not_valid"
}
```

## Logout

### Client-Side Logout

**Simple Logout (Clear Local Storage):**
```javascript
function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
}
```

**Logout with API Call:**

### Endpoint
`POST https://test.zonevast.com/api/v1/auth/auth/logout/`

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/auth/logout/ \
  -H "Authorization: Bearer your_access_token" \
  -H "Content-Type: application/json" \
  -d '{"refresh": "your_refresh_token"}'
```

```javascript
async function logout() {
  const refreshToken = localStorage.getItem('refresh_token');

  try {
    await fetch('https://test.zonevast.com/api/v1/auth/auth/logout/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh: refreshToken })
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear tokens regardless of API call success
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }
}
```

**Response (200 OK):**
```json
{
  "detail": "Successfully logged out"
}
```

**Response (401 Unauthorized - Token Already Blacklisted):**
```json
{
  "detail": "Token is blacklisted"
}
```

## Token Storage Best Practices

### Storage Methods Comparison

#### 1. localStorage (Not Recommended for Production)

**Pros:**
- Easy to use
- Persists across sessions
- Simple API

**Cons:**
- **Vulnerable to XSS attacks**
- Accessible by any JavaScript code
- Not sent automatically with requests

```javascript
// Bad practice for production
localStorage.setItem('access_token', token);
```

#### 2. sessionStorage (Better, But Still Not Ideal)

**Pros:**
- Cleared when tab/window closes
- Simple API

**Cons:**
- **Still vulnerable to XSS**
- Lost on tab close

```javascript
const token = getAccessToken();
sessionStorage.setItem('access_token', token);
```

#### 3. httpOnly Cookies (Recommended for Web)

**Pros:**
- **Protected from XSS attacks**
- Sent automatically with requests
- Can have Secure and SameSite flags

**Cons:**
- Requires server-side configuration
- Vulnerable to CSRF (need CSRF protection)

**Server-Side Implementation (Django):**

```python
# settings.py
SIMPLE_JWT = {
    'AUTH_COOKIE': 'access_token',
    'AUTH_COOKIE_DOMAIN': None,
    'AUTH_COOKIE_SECURE': True,  # HTTPS only
    'AUTH_COOKIE_HTTPONLY': True,  # Not accessible via JavaScript
    'AUTH_COOKIE_PATH': '/',
    'AUTH_COOKIE_SAMESITE': 'Lax',  # CSRF protection
}
```

**Client-Side Usage:**
```javascript
// No need to manually store tokens
// Cookies are sent automatically with requests

const response = await fetch('https://test.zonevast.com/api/v1/auth/users/me/', {
  method: 'GET',
  credentials: 'include'  // Include cookies in request
});

const data = await response.json();
```

#### 4. Memory Only (Most Secure for SPA)

**Pros:**
- **Most secure - not persisted**
- Cleared on page refresh
- No XSS vulnerability

**Cons:**
- User must login again on refresh
- Need to refresh tokens before expiry

```javascript
class TokenManager {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
  }

  setTokens(access, refresh) {
    this.accessToken = access;
    this.refreshToken = refresh;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
  }
}

// Usage
const tokenManager = new TokenManager();
tokenManager.setTokens(access, refresh);
```

#### 5. Secure Storage (Recommended for Mobile)

**React Native (expo-secure-store):**
```javascript
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('access_token', token);
const token = await SecureStore.getItemAsync('access_token');
```

**iOS (Keychain):**
```swift
let keychain = Keychain(service: "com.zonevast.app")
try keychain.set(token, key: "access_token")
let token = try keychain.get("access_token")
```

**Android (EncryptedSharedPreferences):**
```kotlin
val sharedPref = getEncryptedSharedPreferences(
    "com.zonevast.app",
    Context.MODE_PRIVATE
)
with(sharedPref.edit()) {
    putString("access_token", token)
    apply()
}
```

## Token Refresh Strategy

### Automatic Refresh Before Expiration

```javascript
class TokenRefreshManager {
  constructor() {
    this.refreshTimer = null;
  }

  // Decode token to get expiration time
  getTokenExpiration(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  }

  // Schedule refresh before expiration
  scheduleRefresh(accessToken, refreshToken, refreshCallback) {
    const expirationTime = this.getTokenExpiration(accessToken);
    const currentTime = Date.now();
    const refreshBefore = 60000; // Refresh 1 minute before expiration

    const timeUntilRefresh = expirationTime - currentTime - refreshBefore;

    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Schedule refresh
    this.refreshTimer = setTimeout(async () => {
      try {
        const newToken = await this.refreshAccessToken(refreshToken);
        refreshCallback(newToken);
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Force logout
        window.location.href = '/login';
      }
    }, Math.max(timeUntilRefresh, 0));
  }

  async refreshAccessToken(refreshToken) {
    const response = await fetch('https://test.zonevast.com/api/v1/auth/auth/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    return data;
  }

  stopRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

// Usage
const refreshManager = new TokenRefreshManager();

const { access, refresh } = await login('admin', 'admin123');
refreshManager.scheduleRefresh(access, refresh, (newTokens) => {
  console.log('Tokens refreshed:', newTokens);
});
```

## Complete Token Management Example

```javascript
class AuthTokenManager {
  constructor() {
    this.baseURL = 'https://test.zonevast.com/api/v1';
    this.refreshManager = new TokenRefreshManager();
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

    // Store tokens securely (use httpOnly cookies in production)
    document.cookie = `access_token=${access}; path=/; secure; httponly; samesite=lax`;
    document.cookie = `refresh_token=${refresh}; path=/; secure; httponly; samesite=lax`;

    // Schedule automatic refresh
    this.refreshManager.scheduleRefresh(access, refresh, (newTokens) => {
      this.updateTokens(newTokens);
    });

    return { access, refresh };
  }

  async logout() {
    // Get refresh token from cookie
    const refreshToken = this.getCookie('refresh_token');

    try {
      await fetch(`${this.baseURL}/auth/auth/logout/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear cookies
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      // Stop automatic refresh
      this.refreshManager.stopRefresh();

      // Redirect to login
      window.location.href = '/login';
    }
  }

  async checkTokenValidity() {
    try {
      const response = await fetch(`${this.baseURL}/auth/users/me/`, {
        method: 'GET',
        credentials: 'include'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  updateTokens({ access, refresh }) {
    document.cookie = `access_token=${access}; path=/; secure; httponly; samesite=lax`;
    document.cookie = `refresh_token=${refresh}; path=/; secure; httponly; samesite=lax`;
  }
}

// Initialize
const authManager = new AuthTokenManager();

// Login
await authManager.login('admin', 'admin123');

// Check validity
const isValid = await authManager.checkTokenValidity();
console.log('Token valid:', isValid);

// Logout
await authManager.logout();
```

## Security Checklist

### Token Storage
- [ ] Use httpOnly cookies for web applications
- [ ] Use Secure flag (HTTPS only)
- [ ] Use SameSite flag (Lax or Strict)
- [ ] Never store tokens in localStorage for production
- [ ] Use Keychain/KeyStore for mobile apps

### Token Transmission
- [ ] Always use HTTPS
- [ ] Include tokens in Authorization header
- [ ] Never include tokens in URLs
- [ ] Never log tokens

### Token Lifecycle
- [ ] Implement automatic token refresh
- [ ] Clear tokens on logout
- [ ] Handle token expiration gracefully
- [ ] Implement proper error handling
- [ ] Use short expiration for access tokens (5 minutes)
- [ ] Use longer expiration for refresh tokens (24 hours)

### Additional Security
- [ ] Implement CSRF protection
- [ ] Use token binding (IP address, user agent)
- [ ] Monitor suspicious activity
- [ ] Implement rate limiting
- [ ] Log authentication events (without tokens)

## Testing Token Management

### Test Token Validity

```bash
# Get token first
TOKEN=$(curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.access')

# Verify token
curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/verify/ \
  -H "Content-Type: application/json" \
  -d "{\"token\": \"$TOKEN\"}"

# Check with authenticated endpoint
curl -X GET https://test.zonevast.com/api/v1/auth/users/me/ \
  -H "Authorization: Bearer $TOKEN"
```

### Test Logout

```bash
# Get tokens
TOKENS=$(curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}')

ACCESS=$(echo $TOKENS | jq -r '.access')
REFRESH=$(echo $TOKENS | jq -r '.refresh')

# Logout
curl -X POST https://test.zonevast.com/api/v1/auth/auth/logout/ \
  -H "Authorization: Bearer $ACCESS" \
  -H "Content-Type: application/json" \
  -d "{\"refresh\": \"$REFRESH\"}"

# Try to use token (should fail)
curl -X GET https://test.zonevast.com/api/v1/auth/users/me/ \
  -H "Authorization: Bearer $ACCESS"
```

## Troubleshooting

### Common Issues

**Token expires too quickly**
- Check token expiration time in payload
- Implement automatic refresh before expiration
- Adjust SIMPLE_JWT settings on backend

**Token refresh fails**
- Verify refresh token is still valid
- Check if refresh token was blacklisted
- Ensure user is still active

**Cannot logout**
- Verify refresh token is provided
- Check if token is already blacklisted
- Ensure API endpoint is accessible

**"Token is invalid or expired" error**
- Token has expired, refresh it
- Token was tampered with
- User account was deactivated

## Support

For token management issues:
- Documentation: https://docs.zonevast.com/auth/tokens
- Email: support@zonevast.com
- GitHub: https://github.com/zonevast/auth-service
