# GraphQL Client Guide

ZoneVast uses Apollo Client with GraphQL Code Generator for type-safe GraphQL operations.

## Overview

- **Client**: Apollo Client
- **Code Generation**: GraphQL Code Generator
- **Generated Hooks**: React Query hooks from GraphQL queries
- **Type Safety**: Full TypeScript support

## Setup

### 1. Install Dependencies

```bash
npm install @apollo/client graphql
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-query
```

### 2. Configure Code Generator

Create `codegen.ts` in project root:

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://test.zonevast.com/graphql/crm', // Your GraphQL endpoint
  documents: 'src/graphql/**/*.js', // Where your queries are
  generates: {
    'src/lib/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query'
      ],
      config: {
        reactQueryVersion: 5,
        exposeQueryKeys: true,
        exposeFetcher: true,
        addInfiniteQuery: false
      }
    }
  }
};

export default config;
```

### 3. Create GraphQL Queries

Create query files in `src/graphql/`:

**src/graphql/queries/solutions.js**
```javascript
import { gql } from '@apollo/client';

export const GET_SOLUTIONS = gql`
  query GetSolutions {
    solutions {
      id
      name
      description
      category
    }
  }
`;

export const GET_SOLUTION_BY_ID = gql`
  query GetSolutionById($id: ID!) {
    solution(id: $id) {
      id
      name
      description
      category
      features {
        id
        name
      }
    }
  }
`;
```

**src/graphql/mutations/solutions.js**
```javascript
import { gql } from '@apollo/client';

export const CREATE_SOLUTION = gql`
  mutation CreateSolution($input: CreateSolutionInput!) {
    createSolution(input: $input) {
      id
      name
      description
    }
  }
`;

export const UPDATE_SOLUTION = gql`
  mutation UpdateSolution($id: ID!, $input: UpdateSolutionInput!) {
    updateSolution(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;
```

### 4. Generate Types and Hooks

Run code generation:

```bash
# One-time generation
npx graphql-codegen

# Watch mode (regenerates on file changes)
npx graphql-codegen -w
```

This creates `src/lib/generated/graphql.ts` with:
- TypeScript types for all queries/mutations
- React Query hooks
- Fetcher functions

### 5. Set Up Apollo Client

**src/graphql/client.ts**
```typescript
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// GraphQL endpoint
const GRAPHQL_URL = process.env.VITE_CRM_GRAPHQL_URL || '/graphql/crm';

// HTTP link
const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
});

// Auth link - adds JWT token
const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined'
    ? window.localStorage.getItem('auth_token')
    : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Apollo Client
export const graphqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default graphqlClient;
```

## Using Generated Hooks

After code generation, you get type-safe React Query hooks:

### Queries

```typescript
import { useGetSolutionsQuery } from '@/lib/generated/graphql';

function SolutionsList() {
  const { data, isLoading, error, refetch } = useGetSolutionsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      <ul>
        {data?.solutions?.map(solution => (
          <li key={solution.id}>
            <h3>{solution.name}</h3>
            <p>{solution.description}</p>
            <span>Category: {solution.category}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Queries with Variables

```typescript
import { useGetSolutionByIdQuery } from '@/lib/generated/graphql';

function SolutionDetail({ id }: { id: string }) {
  const { data, isLoading, error } = useGetSolutionByIdQuery({
    variables: { id }
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>{data?.solution?.name}</h1>
      <p>{data?.solution?.description}</p>

      <h2>Features</h2>
      <ul>
        {data?.solution?.features?.map(feature => (
          <li key={feature.id}>{feature.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Mutations

```typescript
import { useCreateSolutionMutation } from '@/lib/generated/graphql';
import { useQueryClient } from '@tanstack/react-query';

function CreateSolutionForm() {
  const queryClient = useQueryClient();

  const [createSolution, { isLoading, error }] = useCreateSolutionMutation({
    onSuccess: () => {
      // Invalidate and refetch solutions list
      queryClient.invalidateQueries({ queryKey: ['GetSolutions'] });
      alert('Solution created!');
    },
    onError: (error) => {
      console.error('Failed to create solution:', error);
      alert('Error creating solution');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await createSolution({
        variables: {
          input: {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            category: formData.get('category') as string
          }
        }
      });
      form.reset();
    } catch (err) {
      console.error('Mutation error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Solution name" required />
      <textarea name="description" placeholder="Description" />
      <select name="category">
        <option value="ecommerce">E-commerce</option>
        <option value="inventory">Inventory</option>
        <option value="billing">Billing</option>
      </select>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Solution'}
      </button>

      {error && <p className="error">Error: {error.message}</p>}
    </form>
  );
}
```

### Update Mutation

```typescript
import { useUpdateSolutionMutation } from '@/lib/generated/graphql';

function EditSolution({ solution }) {
  const [updateSolution, { isLoading }] = useUpdateSolutionMutation({
    onSuccess: (data) => {
      alert(`Solution "${data.updateSolution.name}" updated!`);
    }
  });

  const handleUpdate = async (updates: Partial<Solution>) => {
    await updateSolution({
      variables: {
        id: solution.id,
        input: updates
      }
    });
  };

  return (
    <div>
      <h1>{solution.name}</h1>
      <button onClick={() => handleUpdate({ name: 'New Name' })}>
        Update Name
      </button>
    </div>
  );
}
```

## Advanced Patterns

### Optimistic Updates

```typescript
import { useUpdateSolutionMutation } from '@/lib/generated/graphql';
import { useQueryClient } from '@tanstack/react-query';

function SolutionItem({ solution }) {
  const queryClient = useQueryClient();

  const [updateSolution] = useUpdateSolutionMutation({
    onMutate: async (variables) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: ['GetSolutionById', { id: variables.id }]
      });

      // Snapshot previous value
      const previousSolution = queryClient.getQueryData([
        'GetSolutionById',
        { id: variables.id }
      ]);

      // Optimistically update
      queryClient.setQueryData(
        ['GetSolutionById', { id: variables.id }],
        (old: any) => ({
          ...old,
          solution: {
            ...old.solution,
            ...variables.input
          }
        })
      );

      // Return context with previous value
      return { previousSolution };
    },

    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ['GetSolutionById', { id: variables.id }],
        context.previousSolution
      );
    },

    onSettled: (variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: ['GetSolutionById', { id: variables.id }]
      });
    }
  });

  return (
    <div>
      <button
        onClick={() => updateSolution({
          variables: { id: solution.id, input: { name: 'Updated!' } }
        })}
      >
        Optimistic Update
      </button>
    </div>
  );
}
```

### Refetching on Interval

```typescript
import { useGetProjectsQuery } from '@/lib/generated/graphql';

function LiveProjectList() {
  // Refetch every 10 seconds
  const { data, isLoading } = useGetProjectsQuery({
    refetchInterval: 10000,
    refetchIntervalInBackground: true
  });

  return (
    <div>
      <h2>Projects (updates every 10s)</h2>
      {data?.projects?.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}
```

### Manual Refetch

```typescript
import { useGetSolutionsQuery } from '@/lib/generated/graphql';

function SolutionsWithRefresh() {
  const { data, refetch, isRefetching } = useGetSolutionsQuery();

  return (
    <div>
      <button
        onClick={() => refetch()}
        disabled={isRefetching}
      >
        {isRefetching ? 'Refreshing...' : 'Refresh'}
      </button>

      {data?.solutions?.map(solution => (
        <div key={solution.id}>{solution.name}</div>
      ))}
    </div>
  );
}
```

### Conditional Queries

```typescript
import { useGetProjectByIdQuery } from '@/lib/generated/graphql';

function ProjectDetail({ projectId, showDetails }) {
  // Only fetch when showDetails is true
  const { data, isLoading } = useGetProjectByIdQuery({
    variables: { id: projectId },
    enabled: !!projectId && showDetails // Skip query if false
  });

  if (!showDetails) return <p>Select a project</p>;
  if (isLoading) return <p>Loading...</p>;

  return <div>{data?.project?.name}</div>;
}
```

### Multiple Queries

```typescript
import {
  useGetSolutionsQuery,
  useGetProjectsQuery,
  useGetUsersQuery
} from '@/lib/generated/graphql';

function Dashboard() {
  // Run multiple queries in parallel
  const solutionsQuery = useGetSolutionsQuery();
  const projectsQuery = useGetProjectsQuery();
  const usersQuery = useGetUsersQuery();

  if (
    solutionsQuery.isLoading ||
    projectsQuery.isLoading ||
    usersQuery.isLoading
  ) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h2>Solutions: {solutionsQuery.data?.solutions?.length}</h2>
      <h2>Projects: {projectsQuery.data?.projects?.length}</h2>
      <h2>Users: {usersQuery.data?.users?.length}</h2>
    </div>
  );
}
```

## Error Handling

### GraphQL Errors

```typescript
import { useGetSolutionsQuery } from '@/lib/generated/graphql';

function SolutionsList() {
  const { data, error, isLoading } = useGetSolutionsQuery({
    onError: (error) => {
      console.error('GraphQL error:', error);
      // Log to error tracking service
    }
  });

  if (isLoading) return <p>Loading...</p>;

  // Check for GraphQL errors
  if (error) {
    if (error.message.includes('401')) {
      return <p>Authentication expired. Please log in again.</p>;
    }
    return <p>Error: {error.message}</p>;
  }

  return <div>{/* ... */}</div>;
}
```

### Network Errors

Configure Apollo Client to handle network errors:

```typescript
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    // Handle 401 Unauthorized
    if (networkError.message?.includes('401')) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
  }
});

// Add to client
export const graphqlClient = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache()
});
```

## Type Safety

### Using Generated Types

Code generator creates TypeScript types for all operations:

```typescript
import type {
  GetSolutionsQuery,
  GetSolutionsQueryVariables,
  CreateSolutionMutation,
  CreateSolutionMutationVariables
} from '@/lib/generated/graphql';

// Use types directly
function processData(data: GetSolutionsQuery) {
  // TypeScript knows data has 'solutions' array
  return data.solutions?.map(s => s.name);
}

// Function with typed variables
async function createSolution(variables: CreateSolutionMutationVariables) {
  // TypeScript knows variables must have 'input' with specific fields
  await createSolutionMutation({ variables });
}
```

### Manual GraphQL Queries

```typescript
import { gql, useQuery } from '@apollo/client';
import type { QueryHookOptions } from '@tanstack/react-query';

const CUSTOM_QUERY = gql`
  query CustomQuery($id: ID!) {
    solution(id: $id) {
      id
      name
    }
  }
`;

function useCustomQuery(id: string, options?: QueryHookOptions) {
  return useQuery({
    queryKey: ['custom', id],
    queryFn: async () => {
      const { data } = await graphqlClient.query({
        query: CUSTOM_QUERY,
        variables: { id }
      });
      return data;
    },
    ...options
  });
}
```

## Best Practices

### 1. Co-locate Queries with Components

```typescript
// components/SolutionCard/SolutionCard.tsx
import { useGetSolutionByIdQuery } from '@/lib/generated/graphql';

const GET_SOLUTION = gql`...`; // Query definition here

export function SolutionCard({ id }) {
  const { data } = useGetSolutionByIdQuery({ variables: { id } });
  return <div>{data?.solution?.name}</div>;
}
```

### 2. Use Query Keys for Invalidation

```typescript
import { useQueryClient } from '@tanstack/react-query';

function invalidateSolution(id: string) {
  const queryClient = useQueryClient();

  // Invalidate specific query
  queryClient.invalidateQueries({
    queryKey: ['GetSolutionById', { id }]
  });

  // Or invalidate all solution queries
  queryClient.invalidateQueries({
    queryKey: ['GetSolutionById']
  });
}
```

### 3. Cache Configuration

```typescript
import { useGetSolutionsQuery } from '@/lib/generated/graphql';

function SolutionsList() {
  const { data } = useGetSolutionsQuery({
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache
    refetchOnWindowFocus: false // Don't refetch on window focus
  });

  return <div>{/* ... */}</div>;
}
```

### 4. Separate Mutations from Queries

```typescript
// hooks/useSolutionMutations.ts
export function useSolutionMutations() {
  const queryClient = useQueryClient();

  const createSolution = useCreateSolutionMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetSolutions'] });
    }
  });

  const updateSolution = useUpdateSolutionMutation({
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['GetSolutionById', { id: variables.id }]
      });
    }
  });

  return { createSolution, updateSolution };
}
```

## Codegen Package.json Scripts

```json
{
  "scripts": {
    "codegen": "graphql-codegen",
    "codegen:watch": "graphql-codegen -w"
  }
}
```

Run `npm run codegen` after adding new queries/mutations.

## Multiple GraphQL Services

ZoneVast has multiple GraphQL endpoints. Configure separate clients:

```typescript
// clients.ts
export const themeClient = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: THEME_GRAPHQL_URL })),
  cache: new InMemoryCache()
});

export const crmClient = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: CRM_GRAPHQL_URL })),
  cache: new InMemoryCache()
});
```

Then run codegen for each schema:

```typescript
// codegen.ts
const config: CodegenConfig = {
  overwrite: true,
  documents: 'src/graphql/**/*.js',
  generates: {
    'src/lib/generated/theme.ts': {
      schema: 'https://test.zonevast.com/theme/graphql',
      plugins: ['typescript', 'typescript-operations', 'typescript-react-query']
    },
    'src/lib/generated/crm.ts': {
      schema: 'https://test.zonevast.com/graphql/crm',
      plugins: ['typescript', 'typescript-operations', 'typescript-react-query']
    }
  }
};
```
