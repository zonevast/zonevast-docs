import { DocItem } from './docs';

export const API_REFERENCE_DATA: DocItem[] = [
  {
    id: 'guides',
    title: 'Developer Guides',
    children: [
      {
        id: 'quick-start',
        title: 'Quick Start',
        path: '/docs/guides/quick-start',
        isExternal: false
      },
      {
        id: 'authentication',
        title: 'Authentication',
        path: '/docs/guides/authentication',
        isExternal: false
      },
      {
        id: 'multi-language',
        title: 'Multi-language Support',
        path: '/docs/guides/multi-language',
        isExternal: false
      },
      {
        id: 'state-management',
        title: 'State Management',
        path: '/docs/guides/state-management',
        isExternal: false
      },
      {
        id: 'graphql-client',
        title: 'GraphQL Client',
        path: '/docs/guides/graphql-client',
        isExternal: false
      }
    ]
  },
  {
    id: 'services',
    title: 'REST API Services',
    children: [
      {
        id: 'auth-service',
        title: 'Authentication Service',
        path: '/docs/services/auth-service',
        isExternal: false
      },
      {
        id: 'product-service',
        title: 'Product Service',
        path: '/docs/services/product-service',
        isExternal: false
      },
      {
        id: 'inventory-service',
        title: 'Inventory Service',
        path: '/docs/services/inventory-service',
        isExternal: false
      },
      {
        id: 'order-service',
        title: 'Order Service',
        path: '/docs/services/order-service',
        isExternal: false
      },
      {
        id: 'billing-service',
        title: 'Billing Service',
        path: '/docs/services/billing-service',
        isExternal: false
      },
      {
        id: 'project-service',
        title: 'Project Service',
        path: '/docs/services/project-service',
        isExternal: false
      }
    ]
  },
  {
    id: 'graphql',
    title: 'GraphQL Services',
    children: [
      {
        id: 'graphql-overview',
        title: 'GraphQL Overview',
        path: '/docs/graphql/overview',
        isExternal: false
      },
      {
        id: 'product-graphql',
        title: 'Product GraphQL',
        path: '/docs/graphql/product-graphql',
        isExternal: false
      },
      {
        id: 'inventory-graphql',
        title: 'Inventory GraphQL',
        path: '/docs/graphql/inventory-graphql',
        isExternal: false
      },
      {
        id: 'order-graphql',
        title: 'Order GraphQL',
        path: '/docs/graphql/order-graphql',
        isExternal: false
      },
      {
        id: 'customer-graphql',
        title: 'Customer GraphQL',
        path: '/docs/graphql/customer-graphql',
        isExternal: false
      },
      {
        id: 'repair-graphql',
        title: 'Repair GraphQL',
        path: '/docs/graphql/repair-graphql',
        isExternal: false
      },
      {
        id: 'debt-graphql',
        title: 'Debt GraphQL',
        path: '/docs/graphql/debt-graphql',
        isExternal: false
      }
    ]
  },
  {
    id: 'apps',
    title: 'Frontend Applications',
    children: [
      {
        id: 'portal',
        title: 'Portal',
        path: '/docs/apps/portal',
        isExternal: false
      },
      {
        id: 'product-suite',
        title: 'ProductSuite',
        path: '/docs/apps/product-suite',
        isExternal: false
      },
      {
        id: 'inventory-suite',
        title: 'InventorySuite',
        path: '/docs/apps/inventory-suite',
        isExternal: false
      },
      {
        id: 'order-suite',
        title: 'OrderSuite',
        path: '/docs/apps/order-suite',
        isExternal: false
      },
      {
        id: 'customer-suite',
        title: 'CustomerSuite',
        path: '/docs/apps/customer-suite',
        isExternal: false
      },
      {
        id: 'repair-pro',
        title: 'RepairPro',
        path: '/docs/apps/repair-pro',
        isExternal: false
      },
      {
        id: 'debt-pro',
        title: 'DebtPro',
        path: '/docs/apps/debt-pro',
        isExternal: false
      },
      {
        id: 'blog-suite',
        title: 'BlogSuite',
        path: '/docs/apps/blog-suite',
        isExternal: false
      }
    ]
  }
];
