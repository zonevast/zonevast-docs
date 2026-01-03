
import { DocItem } from './docs';

export const API_REFERENCE_DATA: DocItem[] = [
  {
    id: 'authentication',
    title: 'Authentication',
    children: [
      {
        id: 'api-keys',
        title: 'API Keys',
        path: '/api/auth/keys.md',
        isExternal: false
      },
      {
        id: 'oauth-flows',
        title: 'OAuth2 Flows',
        path: '/api/auth/oauth.md',
        isExternal: false
      }
    ]
  },
  {
    id: 'commerce-apis',
    title: 'Commerce',
    children: [
      {
        id: 'products-api',
        title: 'Products',
        path: '/api/commerce/products.md',
        isExternal: false
      },
      {
        id: 'orders-api',
        title: 'Orders',
        path: '/api/commerce/orders.json', // Demonstration of JSON data support
        isExternal: false
      },
      {
        id: 'cart-api',
        title: 'Cart & Checkout',
        path: '/api/commerce/cart.md',
        isExternal: false
      },
      {
        id: 'inventory-api',
        title: 'Inventory',
        path: '/api/commerce/inventory.md',
        isExternal: false
      }
    ]
  },
  {
    id: 'identity-apis',
    title: 'Identity & Users',
    children: [
      {
        id: 'users-api',
        title: 'Users',
        path: '/api/identity/users.md',
        isExternal: false
      },
      {
        id: 'permissions-api',
        title: 'Permissions',
        path: '/api/identity/permissions.md',
        isExternal: false
      }
    ]
  },
  {
    id: 'infrastructure-apis',
    title: 'Infrastructure',
    children: [
      {
        id: 'webhooks-api',
        title: 'Webhooks',
        path: '/api/infra/webhooks.md',
        isExternal: false
      },
      {
        id: 'cdn-api',
        title: 'Media CDN',
        path: '/api/infra/cdn.md',
        isExternal: false
      }
    ]
  },
  {
    id: 'web-utilities',
    title: 'Utilities',
    children: [
        {
            id: 'rate-limits',
            title: 'Rate Limits',
            path: '/api/utils/limits.md',
            isExternal: false
        }
    ]
  }
];
