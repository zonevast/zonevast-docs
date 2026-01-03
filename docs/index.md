# ZoneVast Platform Documentation

Welcome to the ZoneVast developer documentation. This platform provides a comprehensive suite of microservices and frontend applications for building enterprise-grade solutions.

## Base URLs

| Environment | REST API | GraphQL |
|-------------|----------|---------|
| Production | `https://test.zonevast.com/api/v1` | `https://test.zonevast.com/graphql/{service}` |

## Documentation Sections

### Developer Guides
- [Quick Start](/docs/guides/quick-start) - Get started with ZoneVast
- [Authentication](/docs/guides/authentication) - JWT token usage
- [Multi-language Support](/docs/guides/multi-language) - Arabic/English i18n
- [State Management](/docs/guides/state-management) - Zustand & React Query
- [GraphQL Client](/docs/guides/graphql-client) - GraphQL patterns

### REST API Services
- [Authentication Service](/docs/services/auth-service) - User auth & JWT tokens
- [Product Service](/docs/services/product-service) - Product catalog
- [Inventory Service](/docs/services/inventory-service) - Stock management
- [Order Service](/docs/services/order-service) - Order processing
- [Billing Service](/docs/services/billing-service) - Payments & invoicing
- [Project Service](/docs/services/project-service) - Projects & file attachments

### GraphQL Services
- [Overview](/docs/graphql/overview) - GraphQL introduction
- [Product GraphQL](/docs/graphql/product-graphql) - Product catalog queries
- [Inventory GraphQL](/docs/graphql/inventory-graphql) - Inventory queries
- [Order GraphQL](/docs/graphql/order-graphql) - Order queries
- [Customer GraphQL](/docs/graphql/customer-graphql) - Customer data
- [Repair GraphQL](/docs/graphql/repair-graphql) - Repair services
- [Debt GraphQL](/docs/graphql/debt-graphql) - Debt management

### Frontend Applications
- [Portal](/docs/apps/portal) - Main portal (port 3001)
- [ProductSuite](/docs/apps/product-suite) - Product catalog (port 3002)
- [InventorySuite](/docs/apps/inventory-suite) - Inventory management (port 3003)
- [OrderSuite](/docs/apps/order-suite) - Order processing (port 3004)
- [DebtPro](/docs/apps/debt-pro) - Debt management (port 3005)
- [RepairPro](/docs/apps/repair-pro) - Repair services (port 3006)
- [BlogSuite](/docs/apps/blog-suite) - Content management (port 3007)
- [CustomerSuite](/docs/apps/customer-suite) - CRM (port 3008)

## Quick Reference

### Authentication
All API requests require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN
```

### GraphQL Endpoint Pattern
```
https://test.zonevast.com/graphql/{service-name}
```

Available services: `product`, `inventory`, `order`, `customer`, `repair`, `debt`, `billing`, `pos`, `analytics`, `console`

### REST API Pattern
```
https://test.zonevast.com/api/v1/{service}/{endpoint}
```

## Support
For issues or questions, contact the ZoneVast development team.
