# ZoneVast Documentation

Welcome to the ZoneVast platform documentation. ZoneVast is a comprehensive microservices ecosystem providing enterprise-grade solutions for e-commerce, inventory management, customer relations, and more.

## Quick Links

| Section | Description |
|---------|-------------|
| [Getting Started](#getting-started) | Authentication, base URLs, and quick examples |
| [GraphQL Services](#graphql-services) | All GraphQL API endpoints |
| [REST APIs](#rest-apis) | Authentication and Project APIs |
| [Frontend Apps](#frontend-apps) | Next.js applications |
| [Core Documentation](#core-documentation) | Architecture, guides, and FAQs |

## Getting Started

### Base URL

All API requests should be made to:
```
https://test.zonevast.com
```

### Authentication

ZoneVast uses JWT (JSON Web Tokens) for authentication. You need to include a valid token in the `Authorization` header for all authenticated requests.

#### Step 1: Get Your Token

Make a POST request to the token endpoint:

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }'
```

**Response:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Step 2: Use the Token

Include the access token in your requests:

```bash
curl -X GET https://test.zonevast.com/api/v1/projects/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

#### Token Refresh

Access tokens expire after a period of time. Use the refresh token to get a new access token:

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "your_refresh_token"
  }'
```

For detailed authentication methods (OAuth, Google SSO), see [Authentication Documentation](api/auth/oauth.md).

### Quick Example: GraphQL Query

Here's a complete example of querying the product service:

```bash
curl -X POST https://test.zonevast.com/graphql/product/en/v1/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "query { products { id title description price } }"
  }'
```

**Response:**
```json
{
  "data": {
    "products": [
      {
        "id": "1",
        "title": "Sample Product",
        "description": "Product description",
        "price": "99.99"
      }
    ]
  }
}
```

### Quick Example: REST API

Querying the orders REST API:

```bash
curl -X GET https://test.zonevast.com/en/api/v1/orders/orders/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Project-ID: 1"
```

## GraphQL Services

ZoneVast provides 15+ GraphQL microservices. Each service has its own endpoint and comprehensive documentation.

### Commerce Services

| Service | Description | Endpoint | Documentation |
|---------|-------------|----------|---------------|
| **Product** | Product catalog, categories, brands, tags | `/graphql/product/en/v1/graphql` | [View Docs](api/graphql/product.md) |
| **Inventory** | Stock management, warehouses, reservations | `/graphql/inventory/en/v1/graphql` | [View Docs](api/graphql/inventory.md) |
| **Order** | Order processing, fulfillment, tracking | `/graphql/order/en/v1/graphql` | [View Docs](api/graphql/order.md) |
| **Billing** | Invoices, payments, transactions | `/graphql/billing/en/v1/graphql` | [View Docs](api/graphql/billing.md) |
| **POS** | Point of sale, in-store transactions | `/graphql/pos/en/v1/graphql` | [View Docs](api/graphql/pos.md) |

### Business Management Services

| Service | Description | Endpoint | Documentation |
|---------|-------------|----------|---------------|
| **Customer** | Customer management, profiles, history | `/graphql/customer/en/v1/graphql` | [View Docs](api/graphql/customer.md) |
| **Debt** | Debt tracking, collections, payment plans | `/graphql/debt/en/v1/graphql` | [View Docs](api/graphql/debt.md) |
| **Repair** | Repair orders, status tracking | `/graphql/repair/en/v1/graphql` | [View Docs](api/graphql/repair.md) |
| **Auction** | Auction platform, bidding management | `/graphql/auction/en/v1/graphql` | [View Docs](api/graphql/auction.md) |

### Platform Services

| Service | Description | Endpoint | Documentation |
|---------|-------------|----------|---------------|
| **Console** | Admin console, platform management | `/graphql/console/en/v1/graphql` | [View Docs](api/graphql/console.md) |
| **CRM** | Customer relationship management | `/graphql/crm/en/v1/graphql` | [View Docs](api/graphql/crm.md) |
| **Analytics** | Reporting, dashboards, insights | `/graphql/analytics/en/v1/graphql` | Coming Soon |
| **Theme** | UI theme management | `/graphql/theme/en/v1/graphql` | Coming Soon |

### GraphQL Gateway

For unified access to all GraphQL services, use the gateway:
```
https://test.zonevast.com/graphql/{service}/en/v1/graphql
```

## REST APIs

### Authentication API

Handles user authentication, token management, and OAuth integration.

| Endpoint | Method | Description | Documentation |
|----------|--------|-------------|---------------|
| `/api/v1/auth/token/` | POST | Get access token | [View](api/auth/token.md) |
| `/api/v1/auth/token/refresh/` | POST | Refresh expired token | [View](api/auth/token.md) |
| `/api/v1/auth/logout/` | POST | Invalidate token | [View](api/auth/rest-api.md) |
| `/api/v1/auth/user/` | GET | Get current user | [View](api/auth/rest-api.md) |
| `/api/v1/auth/oauth/` | POST | OAuth authentication | [View](api/auth/oauth.md) |
| `/api/v1/auth/keys/` | GET/POST | API key management | [View](api/auth/keys.md) |

### Project API

Manages projects, settings, and file attachments.

| Endpoint | Method | Description | Documentation |
|----------|--------|-------------|---------------|
| `/api/v1/projects/` | GET | List all projects | [View](api/project/projects.md) |
| `/api/v1/projects/` | POST | Create new project | [View](api/project/projects.md) |
| `/api/v1/projects/{id}/` | GET | Get project details | [View](api/project/projects.md) |
| `/api/v1/projects/{id}/settings/` | GET | Get project settings | [View](api/project/projects.md) |

### Commerce REST APIs

| Service | Base URL | Documentation |
|---------|----------|---------------|
| **Products** | `/en/api/v1/product/` | [View](api/commerce/products.md) |
| **Inventory** | `/en/api/v1/inventory/` | [View](api/commerce/inventory.md) |
| **Orders** | `/en/api/v1/orders/` | [View](api/commerce/orders.md) |
| **Cart** | `/en/api/v1/cart/` | [View](api/commerce/cart.md) |

### Identity Management

| Resource | Documentation |
|----------|---------------|
| **Users** | [View](api/identity/users.md) |
| **Permissions** | [View](api/identity/permissions.md) |

### Infrastructure

| Service | Documentation |
|---------|---------------|
| **CDN** | [View](api/infra/cdn.md) |
| **Webhooks** | [View](api/infra/webhooks.md) |

## Frontend Apps

ZoneVast frontend applications are built with Next.js 14, providing modern and responsive user interfaces.

### Core Applications

| App | Port | Description | Documentation |
|-----|------|-------------|---------------|
| **Portal** | 3001 | Main portal, authentication, dynamic settings | [View](apps/portal.md) |
| **ProductSuite** | 3002 | Product catalog, reviews, ratings | [View](apps/product-suite.md) |
| **InventorySuite** | 3003 | Inventory management, analytics | [View](apps/inventory-suite.md) |
| **OrderSuite** | 3004 | Order processing, fulfillment | [View](apps/order-suite.md) |
| **CustomerSuite** | 3008 | Customer management, CRM | [View](apps/customer-suite.md) |

### Specialized Applications

| App | Port | Description | Documentation |
|-----|------|-------------|---------------|
| **DebtPro** | 3005 | Debt management system | [View](apps/debt-pro.md) |
| **RepairPro** | 3006 | Repair management system | [View](apps/repair-pro.md) |
| **BlogSuite** | - | Blog platform | [View](apps/blog-suite.md) |
| **Auction** | - | Auction platform | [View](apps/auction.md) |
| **ReportSuite** | - | Reporting and analytics | Coming Soon |

### Developer Tools

| App | Description |
|-----|-------------|
| **Developer Platform** | Developer tools and API playground |
| **ZoneVast Web Client** | Multi-tenant web client |

## Core Documentation

### Guides & Tutorials

| Document | Description |
|----------|-------------|
| [Quick Start Guide](docs/quick-start.md) | Get up and running in 5 minutes |
| [API Basics](docs/api-basics.md) | Learn API fundamentals |
| [Examples](docs/examples.md) | Code examples and patterns |
| [Architecture](docs/architecture.md) | System architecture overview |

### Reference

| Document | Description |
|----------|-------------|
| [Error Handling](docs/errors.md) | Common errors and solutions |
| [FAQ](docs/faq.md) | Frequently asked questions |
| [Changelog](docs/changelog.md) | Version history and updates |
| [Package Info](docs/package.md) | Package structure and dependencies |

## Request Format

### GraphQL Requests

```bash
curl -X POST https://test.zonevast.com/graphql/{service}/en/v1/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "query { ... }",
    "variables": { ... }
  }'
```

### REST Requests

```bash
curl -X GET https://test.zonevast.com/en/api/v1/{service}/{endpoint}/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Project-ID: 1"
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  }
}
```

## Common Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token for authentication |
| `Content-Type` | Yes | `application/json` for POST/PUT |
| `X-Project-ID` | Sometimes | Project context for multi-tenant requests |
| `Accept-Language` | Optional | `en` or `ar` for localization |

## Rate Limiting

API requests are rate-limited to ensure fair usage:
- **Standard**: 1000 requests per hour
- **Premium**: 10,000 requests per hour

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Support

- **Documentation**: https://docs.zonevast.com
- **Issues**: https://github.com/zonevast/issues
- **Email**: support@zonevast.com
- **Discord**: https://discord.gg/zonevast

## License

Copyright © 2026 ZoneVast. All rights reserved.
