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
    owner: 'zonevast-org',
    repo: 'documentation',
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
      }
    ]
  },
  {
    id: 'guides',
    title: 'Guides',
    type: 'doc',
    children: [
      {
        id: 'api-basics',
        title: 'API Basics',
        path: '/docs/api-basics.md',
        isExternal: true,
        type: 'doc'
      },
      {
        id: 'examples',
        title: 'Examples',
        path: '/docs/examples.md',
        isExternal: true,
        type: 'doc'
      },
      {
        id: 'errors',
        title: 'Errors',
        path: '/docs/errors.md',
        isExternal: true,
        type: 'doc'
      }
    ]
  },
  {
    id: 'sdk-docs',
    title: 'SDKs',
    type: 'doc',
    children: [
      {
        id: 'package',
        title: 'Javascript / TS',
        path: '/docs/package.md',
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
        id: 'oauth-flows',
        title: 'OAuth2 Flows',
        path: '/api/auth/oauth.md',
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
      { id: 'products-api', title: 'Products', path: '/api/commerce/products.md', isExternal: true, type: 'api' },
      { id: 'orders-api', title: 'Orders', path: '/api/commerce/orders.md', isExternal: true, type: 'api' },
      { id: 'cart-api', title: 'Cart & Checkout', path: '/api/commerce/cart.md', isExternal: true, type: 'api' }
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