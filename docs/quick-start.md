# Quick Start Guide

Get up and running with ZoneVast platform in minutes.

## Prerequisites

Before you start, ensure you have:

- **Node.js 18+** and **npm** installed
- **Python 3.9+** (for backend services)
- **PostgreSQL 13+** running locally
- **Git** for cloning repositories
- Basic knowledge of React and TypeScript

## Step 1: Clone and Setup

### Clone the Repository

```bash
git clone https://github.com/zonevast/platform.git
cd platform
```

### Install Dependencies

```bash
# For the platform
npm install
```

## Step 2: Environment Configuration

Create environment configuration files:

**For local development:**
```bash
# .env.local
VITE_AUTH_REST_URL=http://localhost:8010/api/v1/auth
VITE_THEME_GRAPHQL_URL=http://localhost:3000/theme/graphql
VITE_CRM_GRAPHQL_URL=http://localhost:3000/graphql/crm
```

**For development server:**
```bash
# .env.development
VITE_AUTH_REST_URL=https://dev-api.zonevast.com/api/v1/auth
VITE_THEME_GRAPHQL_URL=https://test.zonevast.com/theme/graphql
VITE_CRM_GRAPHQL_URL=/graphql/crm
```

**For production:**
```bash
# .env.production
VITE_AUTH_REST_URL=https://api.zonevast.com/api/v1/auth
VITE_THEME_GRAPHQL_URL=https://api.zonevast.com/theme/graphql
VITE_CRM_GRAPHQL_URL=/graphql/crm
```

## Step 3: Start Development Server

```bash
npm run dev
```

The platform will be available at:
- **URL**: http://localhost:5173
- **Network**: http://192.168.x.x:5173 (for mobile testing)

## Step 4: Create an Account

### Option A: Register New Account

1. Navigate to http://localhost:5173
2. Click "Register" or "Sign Up"
3. Fill in the form:
   - Name: Your full name
   - Email: your.email@example.com
   - Password: (minimum 8 characters)
4. Click "Register"

### Option B: Use Demo Account

For testing without backend:

```typescript
// These demo accounts work without backend
Email: demo@example.com
Password: any (works with any password)
```

```typescript
// Or in your code
import { useAuth } from '@/hooks/useAuth';

const { login } = useAuth();
await login({ email: 'demo@example.com', password: 'any' });
```

## Step 5: Make Your First API Call

### REST API Example

```typescript
// After logging in, make an authenticated request
import { isAuthenticated } from '@/api/auth';

if (isAuthenticated()) {
  const token = localStorage.getItem('auth_token');

  const response = await fetch('/api/v1/project/projects/', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const projects = await response.json();
  console.log('Projects:', projects);
}
```

### GraphQL Example

```typescript
import { useQuery, gql } from '@apollo/client';

const GET_SOLUTIONS = gql`
  query GetSolutions {
    solutions {
      id
      name
      description
    }
  }
`;

function SolutionList() {
  const { data, loading, error } = useQuery(GET_SOLUTIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.solutions.map(solution => (
        <li key={solution.id}>
          <h3>{solution.name}</h3>
          <p>{solution.description}</p>
        </li>
      ))}
    </ul>
  );
}
```

## Step 6: Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Step 7: Preview Production Build

```bash
npm run preview
```

Test the production build locally before deploying.

## Service URLs Reference

### Development Environment

| Service | URL |
|---------|-----|
| Platform Frontend | http://localhost:5173 |
| Auth Service | http://localhost:8010 |
| Product Service | http://localhost:8020 |
| Inventory Service | http://localhost:8030 |
| Order Service | http://localhost:8040 |
| Kong Gateway | http://localhost:8000 |

### Staging Environment

| Service | URL |
|---------|-----|
| API Base | https://dev-api.zonevast.com |
| GraphQL (Theme) | https://test.zonevast.com/theme/graphql |
| GraphQL (CRM) | https://test.zonevast.com/graphql/crm |

### Production Environment

| Service | URL |
|---------|-----|
| API Base | https://api.zonevast.com |
| GraphQL (Theme) | https://api.zonevast.com/theme/graphql |
| GraphQL (CRM) | https://api.zonevast.com/graphql/crm |

## Common Tasks

### Change Language

```typescript
// Language is stored in cookies
document.cookie = 'language=ar; path=/';
window.location.reload();
```

### Logout

```typescript
import { logout } from '@/api/auth';

await logout();
// Redirects to login page automatically
```

### Check Token Status

```typescript
import { isAuthenticated, getUserData } from '@/api/auth';

if (isAuthenticated()) {
  const user = getUserData();
  console.log('Logged in as:', user.email);
}
```

## Troubleshooting

### "Failed to fetch" Error

- Check if backend services are running
- Verify environment variables are set correctly
- Check browser console for CORS errors

### "401 Unauthorized" Error

- Your token may be expired
- Try logging out and logging back in
- Check that token is being sent in headers

### GraphQL Errors

- Verify GraphQL endpoint URL in environment variables
- Check Apollo Client configuration
- Review network tab in browser DevTools

### Language Not Changing

- Clear browser cookies
- Ensure cookie is being set with correct path
- Refresh page after changing language

## Next Steps

- Read [API Basics](./api-basics.md) for detailed authentication setup
- Read [Architecture](./architecture.md) for system overview
- Read [Examples](./examples.md) for code examples
- Check [Errors](./errors.md) for troubleshooting
