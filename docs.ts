export interface DocItem {
  id: string;
  title: string;
  path?: string; // Path to .md file in public/ folder
  children?: DocItem[]; // Parent nodes have children
}

export const DOCS_DATA: DocItem[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    children: [
      {
        id: 'quick-start',
        title: 'Quick Start',
        path: '/docs/quick-start.md'
      },
      {
        id: 'architecture',
        title: 'Architecture',
        path: '/docs/architecture.md'
      }
    ]
  },
  {
    id: 'api-usage',
    title: 'Usage',
    children: [
      {
        id: 'api-basics',
        title: 'API Basics',
        path: '/docs/api-basics.md'
      },
      {
        id: 'examples',
        title: 'Examples',
        path: '/docs/examples.md'
      },
      {
        id: 'errors',
        title: 'Errors',
        path: '/docs/errors.md'
      }
    ]
  },
  {
    id: 'reference',
    title: 'API Reference',
    children: [
        {
            id: 'resources',
            title: 'Resources',
            path: '/docs/resources.md'
        }
    ]
  },
  {
    id: 'sdk',
    title: 'SDKs',
    children: [
      {
        id: 'package',
        title: 'Javascript / TS',
        path: '/docs/package.md'
      }
    ]
  },
  {
    id: 'support',
    title: 'Support',
    children: [
      {
        id: 'faq',
        title: 'FAQ',
        path: '/docs/faq.md'
      },
      {
        id: 'changelog',
        title: 'Changelog',
        path: '/docs/changelog.md'
      }
    ]
  }
];