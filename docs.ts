export interface DocItem {
  id: string;
  title: string;
  path?: string; // Path to .md file
  children?: DocItem[]; // Parent nodes have children
  isExternal?: boolean; // If true, fetches from the configured GitHub repo
  type?: 'doc' | 'api'; // Categorize for filtering
}

// Configuration for remote documentation
// Set enabled to false to use local /public/docs/*.md files
export const GITHUB_DOCS_CONFIG = {
  owner: 'zonevast',
  repo: 'zonevast-docs',
  branch: 'main',
  enabled: true
};

export const ALL_DOCS_DATA: DocItem[] = [
  // --- GENERAL DOCUMENTATION ---
  {
    id: 'getting-started',
    title: 'Getting Started',
    type: 'doc',
    children: [
      {
        id: 'quick-start',
        title: 'Quick Start',
        path: '/docs/quick-start.md',
        isExternal: true,
        type: 'doc'
      },
      {
        id: 'architecture',
        title: 'Architecture',
        path: '/docs/architecture.md',
        isExternal: true,
        type: 'doc'
      },
      {
        id: 'api-basics',
        title: 'API Basics',
        path: '/docs/api-basics.md',
        isExternal: true,
        type: 'doc'
      }
    ]
  },
  {
    id: 'guides',
    title: 'Developer Guides',
    type: 'doc',
    children: [
      {
        id: 'examples',
        title: 'Code Examples',
        path: '/docs/examples.md',
        isExternal: true,
        type: 'doc'
      },
      {
        id: 'errors',
        title: 'Errors & Troubleshooting',
        path: '/docs/errors.md',
        isExternal: true,
        type: 'doc'
      },
      {
        id: 'package',
        title: 'Package Reference',
        path: '/docs/package.md',
        isExternal: true,
        type: 'doc'
      }
    ]
  },
  {
    id: 'apps',
    title: 'Frontend Applications',
    type: 'doc',
    children: [
      {
        id: 'portal',
        title: 'Portal',
        path: '/apps/portal.md',
        isExternal: true,
        type: 'doc'
      },
      {
        id: 'product-suite',
        title: 'ProductSuite',
        path: '/apps/product-suite.md',
        isExternal: true,
        type: 'doc'
      },
      {
        id: 'inventory-suite',
        title: 'InventorySuite',
        path: '/apps/inventory-suite.md',
        isExternal: true,
        type: 'doc'
      },
      {
        id: 'order-suite',
        title: 'OrderSuite',
        path: '/apps/order-suite.md',
        isExternal: true,
        type: 'doc'
      },
      {
        id: 'debt-pro',
        title: 'DebtPro',
        path: '/apps/debt-pro.md',
        isExternal: true,
        type: 'doc'
      },
      {
        id: 'repair-pro',
        title: 'RepairPro',
        path: '/apps/repair-pro.md',
        isExternal: true,
        type: 'doc'
      },
      {
        id: 'customer-suite',
        title: 'CustomerSuite',
        path: '/apps/customer-suite.md',
        isExternal: true,
        type: 'doc'
      },
      {
        id: 'blog-suite',
        title: 'BlogSuite',
        path: '/apps/blog-suite.md',
        isExternal: true,
        type: 'doc'
      }
    ]
  },

  // --- API REFERENCE ---
  {
    id: 'auth-ref',
    title: 'Authentication',
    type: 'api',
    children: [
      {
        id: 'api-keys',
        title: 'API Keys',
        path: '/api/auth/keys.md',
        isExternal: true,
        type: 'api'
      },
      {
        id: 'oauth',
        title: 'JWT Authentication',
        path: '/api/auth/oauth.md',
        isExternal: true,
        type: 'api'
      },
      {
        id: 'token',
        title: 'Token Management',
        path: '/api/auth/token.md',
        isExternal: true,
        type: 'api'
      }
    ]
  },
  {
    id: 'commerce-ref',
    title: 'Commerce APIs',
    type: 'api',
    children: [
      {
        id: 'products-api',
        title: 'Products',
        path: '/api/commerce/products.md',
        isExternal: true,
        type: 'api'
      },
      {
        id: 'orders-api',
        title: 'Orders',
        path: '/api/commerce/orders.md',
        isExternal: true,
        type: 'api'
      },
      {
        id: 'inventory-api',
        title: 'Inventory',
        path: '/api/commerce/inventory.md',
        isExternal: true,
        type: 'api'
      },
      {
        id: 'cart-api',
        title: 'Cart & Checkout',
        path: '/api/commerce/cart.md',
        isExternal: true,
        type: 'api'
      }
    ]
  },
  {
    id: 'identity-ref',
    title: 'Identity & Users',
    type: 'api',
    children: [
      {
        id: 'users-api',
        title: 'Users',
        path: '/api/identity/users.md',
        isExternal: true,
        type: 'api'
      },
      {
        id: 'permissions-api',
        title: 'Permissions',
        path: '/api/identity/permissions.md',
        isExternal: true,
        type: 'api'
      }
    ]
  },
  {
    id: 'infra-ref',
    title: 'Infrastructure',
    type: 'api',
    children: [
      {
        id: 'webhooks-api',
        title: 'Webhooks',
        path: '/api/infra/webhooks.md',
        isExternal: true,
        type: 'api'
      },
      {
        id: 'cdn-api',
        title: 'File Upload & CDN',
        path: '/api/infra/cdn.md',
        isExternal: true,
        type: 'api'
      }
    ]
  },

  // --- SUPPORT ---
  {
    id: 'support-docs',
    title: 'Support',
    type: 'doc',
    children: [
      {
        id: 'faq',
        title: 'FAQ',
        path: '/docs/faq.md',
        isExternal: true,
        type: 'doc'
      },
      {
        id: 'changelog',
        title: 'Changelog',
        path: '/docs/changelog.md',
        isExternal: true,
        type: 'doc'
      }
    ]
  }
];
