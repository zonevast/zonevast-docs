# Code Examples

Practical code examples for common tasks in ZoneVast platform.

## Table of Contents

- [Authentication Examples](#authentication-examples)
- [REST API Examples](#rest-api-examples)
- [GraphQL Examples](#graphql-examples)
- [Form Handling](#form-handling)
- [Data Fetching Patterns](#data-fetching-patterns)
- [State Management](#state-management)
- [Error Handling](#error-handling)

## Authentication Examples

### Login with Error Handling

```typescript
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

function LoginForm() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const user = await login({ email, password });
      if (user) {
        console.log('Login successful:', user);
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### Protected Route Component

```typescript
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Usage
function App() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
```

### Auto-Refresh Token

```typescript
import { useEffect } from 'react';

function useTokenRefresh() {
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await fetch('/api/v1/auth/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('auth_token', data.access);
          } else {
            // Refresh token expired, logout
            localStorage.clear();
            window.location.href = '/login';
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes

    return () => clearInterval(refreshInterval);
  }, []);
}
```

## REST API Examples

### Fetch with Retry Logic

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      if (response.status === 401 && i < retries - 1) {
        // Try refreshing token
        await refreshAccessToken();
        continue;
      }

      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  throw new Error('Max retries reached');
}

// Usage
const response = await fetchWithRetry('/api/v1/product/products/', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
});
```

### Paginated List

```typescript
function usePaginatedList(endpoint: string, pageSize = 20) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${endpoint}?page=${pageNum}&page_size=${pageSize}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );

      const result = await response.json();

      if (pageNum === 1) {
        setData(result.results);
      } else {
        setData(prev => [...prev, ...result.results]);
      }

      setHasMore(result.results.length === pageSize);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPage(nextPage);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, [endpoint]);

  return { data, loading, hasMore, loadMore };
}

// Usage
function ProductList() {
  const { data, loading, hasMore, loadMore } = usePaginatedList(
    '/api/v1/product/products/'
  );

  return (
    <div>
      {data.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### Create Resource with File Upload

```typescript
async function createProductWithImage(productData: any, imageFile: File) {
  const formData = new FormData();

  // Add product fields
  Object.keys(productData).forEach(key => {
    formData.append(key, productData[key]);
  });

  // Add image file
  formData.append('image', imageFile);

  try {
    const response = await fetch('/api/v1/product/products/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        // Don't set Content-Type for FormData, browser does it automatically
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
async function handleCreateProduct() {
  const product = {
    name: 'New Product',
    price: 99.99,
    description: 'Product description'
  };

  const image = document.querySelector('input[type="file"]').files[0];

  try {
    const created = await createProductWithImage(product, image);
    alert('Product created successfully!');
    console.log('Created product:', created);
  } catch (error) {
    alert('Failed to create product');
  }
}
```

## GraphQL Examples

### Query with Variables

```typescript
import { useQuery } from '@apollo/client';
import { GET_PRODUCT_BY_ID } from '@/graphql/queries';

function ProductDetail({ productId }: { productId: string }) {
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: productId },
    skip: !productId, // Skip query if no ID
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data?.product?.name}</h1>
      <p>{data?.product?.description}</p>
      <p>Price: ${data?.product?.price}</p>
    </div>
  );
}
```

### Mutation with Cache Update

```typescript
import { useMutation, useQueryClient } from '@apollo/client';
import { UPDATE_PRODUCT, GET_PRODUCTS } from '@/graphql/queries';

function UpdateProductForm({ product }: { product: any }) {
  const queryClient = useQueryClient();

  const [updateProduct, { loading, error }] = useMutation(UPDATE_PRODUCT, {
    onMutate: async (variables) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['GetProducts'] });

      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(['GetProducts']);

      // Optimistically update cache
      queryClient.setQueryData(['GetProducts'], (old: any) => ({
        ...old,
        products: old.products.map((p: any) =>
          p.id === variables.id
            ? { ...p, ...variables.input }
            : p
        )
      }));

      return { previousProducts };
    },

    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['GetProducts'], context.previousProducts);
    },

    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['GetProducts'] });
    }
  });

  const handleSubmit = async (updates: any) => {
    try {
      await updateProduct({
        variables: { id: product.id, input: updates }
      });
      alert('Product updated!');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleSubmit({
        name: formData.get('name'),
        price: parseFloat(formData.get('price') as string)
      });
    }}>
      <input name="name" defaultValue={product.name} />
      <input name="price" type="number" defaultValue={product.price} />
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

### Infinite Scroll with GraphQL

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { graphqlClient } from '@/graphql/client';
import { GET_PRODUCTS } from '@/graphql/queries';

function ProductInfiniteList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await graphqlClient.query({
        query: GET_PRODUCTS,
        variables: { offset: pageParam, limit: 20 }
      });
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.products.length < 20) return undefined;
      return allPages.length * 20;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.pages.map(page =>
        page.products.map((product: any) => (
          <div key={product.id}>{product.name}</div>
        ))
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

## Form Handling

### Form with Validation

```typescript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  price: yup.number().positive('Price must be positive').required('Price is required')
});

function ProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/v1/product/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      alert('Product created successfully!');
    } catch (error) {
      alert('Error creating product');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('name')} placeholder="Product name" />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <input {...register('email')} placeholder="Email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <input type="number" {...register('price')} placeholder="Price" />
        {errors.price && <span>{errors.price.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
```

### Multi-Step Form

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const steps = ['Basic Info', 'Details', 'Review'];

function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const { register, handleSubmit, watch } = useForm();
  const formData = watch();

  const Step1 = () => (
    <div>
      <h2>Step 1: Basic Info</h2>
      <input {...register('name')} placeholder="Name" />
      <input {...register('email')} placeholder="Email" />
    </div>
  );

  const Step2 = () => (
    <div>
      <h2>Step 2: Details</h2>
      <input {...register('phone')} placeholder="Phone" />
      <input {...register('address')} placeholder="Address" />
    </div>
  );

  const Step3 = () => (
    <div>
      <h2>Step 3: Review</h2>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );

  const onSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    // Submit to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="progress">
        {steps.map((step, index) => (
          <div
            key={index}
            className={index === currentStep ? 'active' : ''}
          >
            {step}
          </div>
        ))}
      </div>

      {currentStep === 0 && <Step1 />}
      {currentStep === 1 && <Step2 />}
      {currentStep === 2 && <Step3 />}

      <div className="buttons">
        {currentStep > 0 && (
          <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
            Previous
          </button>
        )}
        {currentStep < steps.length - 1 ? (
          <button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
            Next
          </button>
        ) : (
          <button type="submit">Submit</button>
        )}
      </div>
    </form>
  );
}
```

## Data Fetching Patterns

### Fetch on Mount

```typescript
import { useEffect, useState } from 'react';

function useUserProfile(userId: string) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/v1/users/${userId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
}
```

### Fetch with Cache

```typescript
const cache = new Map();

async function fetchWithCache(url: string, options?: RequestInit) {
  const cacheKey = JSON.stringify({ url, options });

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  // Cache for 5 minutes
  cache.set(cacheKey, data);
  setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);

  return data;
}
```

### Parallel Requests

```typescript
import { useQuery } from '@tanstack/react-query';

function Dashboard() {
  // Fetch multiple queries in parallel
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/v1/product/products/').then(r => r.json())
  });

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetch('/api/v1/order/orders/').then(r => r.json())
  });

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => fetch('/api/v1/customer/customers/').then(r => r.json())
  });

  if (!products || !orders || !customers) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h2>Products: {products.count}</h2>
      <h2>Orders: {orders.count}</h2>
      <h2>Customers: {customers.count}</h2>
    </div>
  );
}
```

## State Management

### Zustand Store

```typescript
import { create } from 'zustand';

interface ProductStore {
  products: any[];
  selectedProduct: any | null;
  setProducts: (products: any[]) => void;
  selectProduct: (product: any) => void;
  clearSelection: () => void;
}

const useProductStore = create<ProductStore>((set) => ({
  products: [],
  selectedProduct: null,
  setProducts: (products) => set({ products }),
  selectProduct: (product) => set({ selectedProduct: product }),
  clearSelection: () => set({ selectedProduct: null })
}));

// Usage
function ProductList() {
  const { products, setProducts, selectProduct } = useProductStore();

  useEffect(() => {
    fetch('/api/v1/product/products/')
      .then(r => r.json())
      .then(data => setProducts(data.results));
  }, [setProducts]);

  return (
    <ul>
      {products.map(product => (
        <li key={product.id} onClick={() => selectProduct(product)}>
          {product.name}
        </li>
      ))}
    </ul>
  );
}
```

## Error Handling

### Global Error Handler

```typescript
import { useEffect } from 'react';

function useErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Log to error tracking service
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      // Log to error tracking service
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);
}

// Usage in App component
function App() {
  useErrorHandler();
  return <YourApp />;
}
```

### API Error Handler

```typescript
class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleApiRequest(
  request: () => Promise<Response>
): Promise<any> {
  try {
    const response = await request();

    if (!response.ok) {
      const error = await response.json();

      switch (response.status) {
        case 401:
          // Unauthorized - redirect to login
          window.location.href = '/login';
          throw new ApiError(401, 'UNAUTHORIZED', 'Please log in');

        case 403:
          throw new ApiError(403, 'FORBIDDEN', 'Access denied');

        case 404:
          throw new ApiError(404, 'NOT_FOUND', 'Resource not found');

        case 422:
          throw new ApiError(422, 'VALIDATION_ERROR', error.detail);

        case 500:
          throw new ApiError(500, 'SERVER_ERROR', 'Server error');

        default:
          throw new ApiError(response.status, 'UNKNOWN', 'An error occurred');
      }
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'NETWORK_ERROR', 'Network error');
  }
}

// Usage
try {
  const products = await handleApiRequest(() =>
    fetch('/api/v1/product/products/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  );
  console.log(products);
} catch (error) {
  if (error instanceof ApiError) {
    alert(`Error ${error.code}: ${error.message}`);
  }
}
```

## Next Steps

- Read [API Basics](./api-basics.md) for authentication
- Read [Errors](./errors.md) for error codes
- Check [FAQ](./faq.md) for common questions
