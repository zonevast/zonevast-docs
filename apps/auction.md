# Auction Dashboard

## Purpose
Auction and group buying management application. Manage auctions, group buying campaigns, products, customers, orders, and sales analytics.

## Key Features
- **Auction Management**: Create and manage auction listings with bidding
- **Group Buying**: Coordinate group purchase campaigns with bulk pricing
- **Product Catalog**: Manage products, categories, and inventory
- **Customer Management**: Track customer profiles and purchase history
- **Order Processing**: Handle auction and group buying orders
- **Sales Analytics**: Reports on auction performance and revenue
- **Dashboard**: Real-time statistics and metrics overview
- **User Management**: Role-based access control for team members
- **Settings**: Store configuration, payment methods, and delivery options

## Tech Stack
- **Framework**: Next.js 15.4.5 (App Router) with React 19
- **State Management**: Zustand (global state)
- **Server State**: @tanstack/react-query v5
- **UI Components**: Radix UI primitives (shadcn/ui pattern)
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod validation
- **GraphQL**: graphql-request with fetch-based queries
- **Charts**: Recharts for analytics
- **File Upload**: react-dropzone
- **i18n**: next-themes (dark/light mode)
- **Testing**: Playwright E2E tests

## GraphQL Endpoints
The app connects to multiple GraphQL services via the API gateway:
- **Auctions**: `https://test.zonevast.com/graphql/auction` or `http://localhost:3000/graphql/auction`
- **Products**: `https://test.zonevast.com/graphql/product` or `http://localhost:3000/graphql/product`
- **Customers**: `https://test.zonevast.com/graphql/customer` or `http://localhost:3000/graphql/customer`
- **Orders**: `https://test.zonevast.com/graphql/order` or `http://localhost:3000/graphql/order`

## Local Development Setup

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
```bash
cd /home/yousef/Documents/workspace/zonevast/apps/auction/dashboard
npm install
```

### Environment Configuration
Create `.env.local` file:
```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/
NEXT_PUBLIC_API_FILE_URL=http://localhost:3000/

# Environment
NODE_ENV=development
```

### Development Commands
```bash
# Start development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Run E2E tests
npx playwright test
```

### Ports
- **Development**: http://localhost:3001
- **Production**: http://localhost:4000 (configured in ecosystem.config.js)

### Running with PM2 (Production)
```bash
pm2 start ecosystem.config.js
pm2 logs test
pm2 stop test
```

## Production URL
Available at: https://test.zonevast.com/auction

## API Integration Pattern

### GraphQL Query Example
```typescript
import { useQuery } from '@tanstack/react-query'
import { fetchGraphQL, GET_AUCTIONS } from '@/hooks/auctions/queries'

const { data, isLoading } = useQuery({
  queryKey: ['auctions'],
  queryFn: () => fetchGraphQL<{ auctions: Auction[] }>(GET_AUCTIONS, { limit: 10 })
})
```

### REST API Example (via useApiData hook)
```typescript
import { useApiData } from '@/hooks/useApi'

const { data, loading, get, post } = useApiData<Product>('/products', {
  enableFetch: true
})

// Manual fetch
await get()

// Create new item
await post({
  data: formData,
  onSuccess: (res) => {
    toast.success('Created successfully')
    get() // Refetch
  }
})
```

## Architecture Highlights

### Three-Layer Design
1. **Data Layer** (`src/hooks/`): Custom hooks for API communication
2. **State Layer** (`src/store/`): Zustand stores with Zod validation
3. **Presentation Layer** (`src/components/`): UI components organized by feature

### Key Directories
- `src/app/(home)/`: Main application pages
- `src/hooks/auctions/`: Auction GraphQL queries/mutations
- `src/hooks/groupBuying/`: Group buying operations
- `src/hooks/products/`: Product catalog hooks
- `src/hooks/customers/`: Customer management hooks
- `src/hooks/orders/`: Order processing hooks
- `src/hooks/useApi/`: Generic REST API hook with auto-auth
- `src/components/features/`: Feature-specific components
- `src/store/`: Zustand state management

### Authentication
- Auto-authenticated API calls via Axios interceptors
- JWT token management (localStorage + cookies)
- Route protection via Next.js middleware
- Login endpoint: `https://test.zonevast.com/api/v1/auth/auth/token/`

## Testing
E2E tests configured with Playwright:
- Authentication flows
- CRUD operations for auctions, products, customers, orders
- GraphQL API integration testing
- Form validation and error handling

Test files location: `tests/` directory

## Additional Features
- **File Upload**: Independent upload system with progress tracking
- **Report Generation**: PDF export with customizable columns
- **Theme Management**: Dark/light mode support
- **Mobile Responsive**: Adaptive layouts for all screen sizes
- **Excel Export**: Data export functionality
- **Real-time Updates**: Refetch on window focus/reconnect
