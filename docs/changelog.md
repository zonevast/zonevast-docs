# Changelog

All notable changes to ZoneVast platform and SDKs.

## [Unreleased]

### Added
- WebSocket support for real-time updates
- New analytics service
- Enhanced rate limiting features

### Changed
- Improved API Gateway performance
- Updated dependencies

### Fixed
- Token refresh edge cases
- GraphQL subscription issues

## [2.1.0] - 2024-12-15

### Added
- **New GraphQL Services**:
  - Analytics service for reporting
  - Console service for admin operations

- **Frontend Features**:
  - Dark mode support across all apps
  - Improved mobile responsiveness
  - Export functionality for data tables

- **SDK Features**:
  - Retry logic for failed requests
  - Request caching
  - Automatic token refresh

### Changed
- **Breaking**: Updated authentication flow to use project-aware tokens
- **Improved**: Pagination performance for large datasets
- **Updated**: UI components to NextUI 2.0

### Fixed
- Fixed CORS issues in development mode
- Fixed GraphQL subscription reconnection
- Fixed memory leak in React hooks
- Fixed token expiration handling

### Security
- Updated axios to 1.6.0 (security patches)
- Added input sanitization for GraphQL queries

## [2.0.0] - 2024-11-01

### Major Changes

#### API Gateway Migration
- Migrated from Kong Gateway to AWS SAM Gateway
- New base URL: `https://api.zonevast.com`
- GraphQL endpoint pattern: `https://api.zonevast.com/graphql/{service}`

#### Breaking Changes

**Authentication**:
```typescript
// Old (1.x)
await client.login({ email, password });

// New (2.0)
await client.auth.login({ username: email, password });
```

**REST API URLs**:
```typescript
// Old (1.x)
https://api.zonevast.com/auth/login/

// New (2.0)
https://api.zonevast.com/api/v1/auth/login/
```

**GraphQL Endpoints**:
```typescript
// Old (1.x)
https://test.zonevast.com/graphql

// New (2.0)
https://api.zonevast.com/graphql/{service-name}
```

### Added
- **New Services**:
  - zv_catalog_service (port 8090)
  - zv_credit_finance_service (port 8100)
  - zv_admin_interface (port 8110)

- **Frontend Apps**:
  - BlogSuite (port 3007)
  - CustomerSuite (port 3008)

- **SDK Features**:
  - TypeScript strict mode support
  - React 18 concurrent features
  - Automatic retries with exponential backoff

### Changed
- All services now use `/api/v1/{service}/` URL pattern
- GraphQL schemas updated to support relay-style pagination
- Improved error handling and validation

### Deprecated
- Old Kong Gateway endpoints (will be removed in 3.0)
- Direct service URLs (use API Gateway instead)

### Fixed
- Fixed race conditions in token refresh
- Fixed memory leaks in long-running processes
- Fixed GraphQL query complexity analysis

### Migration Guide
See [Migration Guide](./package.md#migration-guide) for detailed instructions.

## [1.5.0] - 2024-09-15

### Added
- **Inventory Service**: Stock reservations and bulk operations
- **Order Service**: Order status tracking and fulfillment
- **GraphQL Code Generator**: Automatic type generation
- **React Hooks**: Pre-built hooks for common operations

### Changed
- Improved error messages
- Better TypeScript types
- Enhanced caching strategies

### Fixed
- Fixed pagination offset issues
- Fixed file upload encoding
- Fixed date/time serialization

## [1.4.0] - 2024-08-01

### Added
- **Multi-language Support**: Arabic and English
- **Theming System**: Dark/light mode
- **Form Validation**: React Hook Form integration

### Changed
- Updated to Next.js 14
- Migrated to NextUI components
- Improved mobile layouts

### Fixed
- Fixed RTL layout issues
- Fixed date picker localization
- Fixed currency formatting

## [1.3.0] - 2024-07-01

### Added
- **Billing Service**: Payment processing
- **POS Service**: Point of sale features
- **Project Service**: File attachments

### Changed
- Optimized database queries
- Added database indexes
- Improved API response times

### Fixed
- Fixed transaction handling
- Fixed file upload limits
- Fixed permission checks

## [1.2.0] - 2024-06-01

### Added
- **Product Service**: Full product catalog
- **Customer GraphQL**: Customer queries
- **Repair GraphQL**: Repair service queries

### Changed
- Refactored authentication
- Improved JWT handling
- Better error responses

### Fixed
- Fixed token storage issues
- Fixed CORS headers
- Fixed rate limiting

## [1.1.0] - 2024-05-01

### Added
- **Initial Release**:
  - Auth Service (port 8010)
  - Product Service (port 8020)
  - Inventory Service (port 8030)
  - Order Service (port 8040)

- **Frontend Apps**:
  - Portal (port 3001)
  - ProductSuite (port 3002)
  - InventorySuite (port 3003)
  - OrderSuite (port 3004)

- **SDK**: JavaScript/TypeScript SDK v1.0

### Features
- JWT authentication
- REST API endpoints
- GraphQL queries/mutations
- React hooks
- Zustand state management
- React Query for data fetching

## Versioning

ZoneVast follows [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible functionality
- **PATCH**: Backwards-compatible bug fixes

## Migration Guides

### 1.x to 2.0

See [Migration Guide](./package.md#migration-guide)

Key changes:
1. Update base URLs to use API Gateway
2. Change authentication method names
3. Update GraphQL endpoint URLs
4. Regenerate GraphQL types

### 0.x to 1.0

The 0.x was pre-release. 1.0 is the first stable release.

## Deprecation Policy

- **Major versions**: Supported for 12 months
- **Minor versions**: Supported for 6 months
- **Patch versions**: Supported until next minor release

## Upcoming Releases

### [2.2.0] - Planned Q1 2025
- Real-time notifications
- Advanced analytics dashboard
- Mobile SDK (React Native)

### [3.0.0] - Planned Q3 2025
- GraphQL subscriptions
- Event-driven architecture
- Multi-region support

## Security Advisories

### [CVE-2024-XXXX] - 2024-12-01
**Severity**: Medium
**Impact**: Token exposure in localStorage
**Fix**: Use httpOnly cookies (SDK 2.1.0+)
**Action**: Update SDK and implement cookie-based auth

### [CVE-2024-YYYY] - 2024-10-15
**Severity**: Low
**Impact**: Rate limiting bypass
**Fix**: Updated rate limiter (API Gateway 2.0.1+)
**Action**: No action required for cloud users

## Subscribe to Updates

- **GitHub Releases**: https://github.com/zonevast/platform/releases
- **Changelog RSS**: https://zonevast.com/changelog/feed
- **Email**: Subscribe at https://zonevast.com/subscribe

## Reporting Issues

Report issues at: https://github.com/zonevast/platform/issues

## Next Steps

- Read [Quick Start](./quick-start.md) to get started
- Read [Examples](./examples.md) for usage examples
- Check [FAQ](./faq.md) for common questions
