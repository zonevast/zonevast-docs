# State Management Guide

ZoneVast platform uses a dual-state management approach:
- **Zustand** for global client state
- **React Query** (TanStack Query) for server state

## Overview

### Zustand (Global State)
Use for: UI state, user preferences, theme, language, forms
- Lightweight and fast
- No Provider needed
- Easy to test and debug

### React Query (Server State)
Use for: API data, caching, synchronization
- Automatic caching and refetching
- Optimistic updates
- Background refetching

## Zustand for Global State

### Creating a Store

```typescript
// stores/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;

  // Actions
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      setAuth: (user, token) => set({
        isAuthenticated: true,
        user,
        token
      }),

      clearAuth: () => set({
        isAuthenticated: false,
        user: null,
        token: null
      })
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ token: state.token }) // Persist only token
    }
  )
);
```

### Using a Store

```typescript
import { useAuthStore } from '@/stores/useAuthStore';

function UserProfile() {
  // Get state
  const { isAuthenticated, user } = useAuthStore();

  // Get actions
  const { clearAuth } = useAuthStore();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={clearAuth}>Logout</button>
    </div>
  );
}
```

### Selective State Updates

```typescript
// Subscribe to specific state (more performant)
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// Subscribe to multiple values
const { user, token } = useAuthStore((state) => ({
  user: state.user,
  token: state.token
}));
```

### Async Actions

```typescript
// stores/useProjectStore.ts
import { create } from 'zustand';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  createProject: (data: CreateProjectData) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/v1/project/projects/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      const projects = await response.json();
      set({ projects, isLoading: false });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
    }
  },

  createProject: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/v1/project/projects/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const newProject = await response.json();

      // Add to existing projects
      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
    }
  }
}));
```

### Using Async Store

```typescript
function ProjectList() {
  const { projects, isLoading, error, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {projects.map(project => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  );
}
```

## React Query for Server State

### Setting Up React Query

```typescript
// lib/react-query/index.ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Using Queries (Fetching Data)

```typescript
import { useQuery } from '@tanstack/react-query';

function fetchProjects() {
  return fetch('/api/v1/project/projects/', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    }
  }).then(res => res.json());
}

function ProjectList() {
  const {
    data: projects,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      <ul>
        {projects?.map(project => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Using Mutations (Creating/Updating Data)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function createProject(data: CreateProjectData) {
  return fetch('/api/v1/project/projects/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

function CreateProjectForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Failed to create project:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    mutation.mutate({
      name: formData.get('name'),
      description: formData.get('description')
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Project name" />
      <textarea name="description" placeholder="Description" />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Project'}
      </button>
      {mutation.error && <p>Error: {mutation.error.message}</p>}
    </form>
  );
}
```

### Optimistic Updates

```typescript
function UpdateProject({ projectId }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateProjectData) =>
      fetch(`/api/v1/project/projects/${projectId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),

    onMutate: async (newData) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ['projects', projectId] });

      // Snapshot previous value
      const previousProject = queryClient.getQueryData(['projects', projectId]);

      // Optimistically update
      queryClient.setQueryData(['projects', projectId], (old: any) => ({
        ...old,
        ...newData
      }));

      // Return context with previous value
      return { previousProject };
    },

    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(['projects', projectId], context.previousProject);
    },

    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    }
  });
}
```

## Combining Zustand + React Query

### Pattern: Zustand for filters, React Query for data

```typescript
// stores/useProjectFilters.ts
import { create } from 'zustand';

interface ProjectFilters {
  search: string;
  status: string;
  category: string;

  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setCategory: (category: string) => void;
  resetFilters: () => void;
}

export const useProjectFilters = create<ProjectFilters>((set) => ({
  search: '',
  status: 'all',
  category: 'all',

  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  setCategory: (category) => set({ category }),
  resetFilters: () => set({
    search: '',
    status: 'all',
    category: 'all'
  })
}));
```

```typescript
function ProjectList() {
  // Filters from Zustand
  const { search, status, category } = useProjectFilters();

  // Data from React Query (reacts to filter changes)
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', { search, status, category }],
    queryFn: () => fetchProjects({ search, status, category })
  });

  return (
    <div>
      <ProjectFilters /> // Zustand store
      {isLoading ? <p>Loading...</p> : <ProjectItems projects={projects} />}
    </div>
  );
}
```

## Common Patterns

### Loading State

```typescript
function DataComponent() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;

  return <DataView data={data} />;
}
```

### Pagination

```typescript
function PaginatedList() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['items', page],
    queryFn: () => fetchItems(page)
  });

  return (
    <div>
      {data?.items.map(item => <Item key={item.id} {...item} />)}
      <button
        onClick={() => setPage(p => p - 1)}
        disabled={page === 1}
      >
        Previous
      </button>
      <button
        onClick={() => setPage(p => p + 1)}
        disabled={!data?.hasMore}
      >
        Next
      </button>
    </div>
  );
}
```

### Infinite Scroll

```typescript
function InfiniteList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: ({ pageParam = 0 }) => fetchItems(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });

  return (
    <div>
      {data?.pages.map(page => (
        <div key={page.cursor}>
          {page.items.map(item => <Item key={item.id} {...item} />)}
        </div>
      ))}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Loading more...' : 'Load more'}
      </button>
    </div>
  );
}
```

### Form State

```typescript
// stores/useFormStore.ts
import { create } from 'zustand';

interface FormState {
  formData: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;

  setFieldValue: (name: string, value: any) => void;
  setError: (name: string, error: string) => void;
  setTouched: (name: string, touched: boolean) => void;
  resetForm: () => void;
}

export const useFormStore = create<FormState>((set) => ({
  formData: {},
  errors: {},
  touched: {},

  setFieldValue: (name, value) =>
    set((state) => ({
      formData: { ...state.formData, [name]: value }
    })),

  setError: (name, error) =>
    set((state) => ({
      errors: { ...state.errors, [name]: error }
    })),

  setTouched: (name, touched) =>
    set((state) => ({
      touched: { ...state.touched, [name]: touched }
    })),

  resetForm: () => set({ formData: {}, errors: {}, touched: {} })
}));
```

## Best Practices

### When to Use Zustand
- UI state (modals, sidebars, dropdowns)
- User preferences (theme, language, settings)
- Form state (especially multi-step forms)
- Client-side filters and sorting
- Global notifications/toasts

### When to Use React Query
- All server data fetching
- API responses
- Database records
- Data that needs caching
- Data that can become stale
- Background synchronization

### Performance Tips

```typescript
// ❌ Bad - causes re-renders on any state change
const state = useStore();

// ✅ Good - only re-renders when user changes
const user = useStore((state) => state.user);

// ✅ Good - select multiple values
const { user, token } = useStore((state) => ({
  user: state.user,
  token: state.token
}));

// ✅ Good - shallow comparison for objects
import { shallow } from 'zustand/shallow';
const { user, posts } = useStore(
  (state) => ({ user: state.user, posts: state.posts }),
  shallow
);
```

### DevTools

```typescript
// Zustand DevTools
import { devtools } from 'zustand/middleware';

export const useStore = create()(
  devtools(
    (set) => ({ /* ... */ }),
    { name: 'AppStore' }
  )
);

// React Query DevTools (already included in QueryProvider)
// Press Alt+T or click the React Query icon in browser
```

## Testing

### Testing Zustand Stores

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/stores/useAuthStore';

test('should set auth data', () => {
  const { result } = renderHook(() => useAuthStore());

  act(() => {
    result.current.setAuth({ id: 1, name: 'Test' }, 'token123');
  });

  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user.name).toBe('Test');
});
```

### Testing React Query

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProjects } from '@/hooks/useProjects';

test('should fetch projects', async () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useProjects(), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toHaveLength(10);
});
```
