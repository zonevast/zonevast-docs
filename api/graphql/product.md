# Product GraphQL API Reference

**Service:** product-graphql
**Version:** v1
**Status:** Deployed (test.zonevast.com)
**Last Updated:** 2026-01-12

---

## Overview

The Product GraphQL service provides a complete API for managing products, categories, tags, brands, variants, and more. Built with the Auto-API framework, it automatically generates GraphQL schemas from Python models with full CRUD operations, filtering, pagination, search, and multi-language support.

### Key Features

- **Complete CRUD Operations** - Queries and mutations for all models
- **Advanced Filtering** - String, numeric, boolean, date filters with logical operators (AND/OR/NOT)
- **Pagination** - Offset-based and cursor-based pagination support
- **Full-Text Search** - PostgreSQL full-text search with relevance ranking
- **Multi-Language Support** - Automatic translation fields for English, Arabic, French
- **Soft Delete** - Built-in trash/restore functionality
- **Authentication** - JWT-based auth with role-based permissions

---

## Endpoint URLs

### Environment URLs

| Environment | GraphQL Endpoint |
|------------|------------------|
| **Production** | `https://api.zonevast.com/graphql/product` |
| **Staging** | `https://test.zonevast.com/graphql/product` |

### Current Deployment Status

- **Region:** me-south-1
- **Lambda Function:** `product-graphql`
- **Gateway:** `https://test.zonevast.com/graphql/product`
- **Status:** Deployed (currently experiencing 502 errors - needs investigation)

---

## Authentication

### JWT Token Required

Most mutations require authentication. Include JWT token in the Authorization header:

```bash
curl -X POST https://test.zonevast.com/graphql/product \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query": "mutation { createProduct(...) }"}'
```

### Getting a JWT Token

```bash
# Login via auth service
curl -X POST https://test.zonevast.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

### Project Context

All operations require a `project_id` context, which can be provided via:

1. **Header:** `X-Project-Id: 1`
2. **JWT Token:** Included in token claims
3. **Auto-population:** From authenticated user context

---

## Available Models

The service includes the following GraphQL models:

| Model | Table | Description | Auth Required |
|-------|-------|-------------|---------------|
| **Product** | `products` | Main product catalog | Public read, auth write |
| **Category** | `categories` | Product categories with hierarchy | Public read, auth write |
| **Tag** | `tags` | Product tags/labels | Public read, auth write |
| **Brand** | `brands` | Product brands | Public read, auth write |
| **VariantSchema** | `variant_schemas` | Product variant templates | Public read, auth write |
| **Variant** | `variants` | Product SKUs with pricing | Public read, auth write |
| **Barcode** | `barcodes` | Product barcodes (UPC, EAN, etc.) | Public read, auth write |
| **Discount** | `discounts` | Discount campaigns and codes | Public read, auth write |
| **Collection** | `collections` | Product bundles/groups | Public read, auth write |
| **Shipping** | `shippings` | Shipping configuration | Auth required |
| **ProductCollection** | `product_collections` | Product-collection junction | Public read, auth write |
| **ProductDiscount** | `product_discounts` | Product-discount junction | Public read, auth write |

---

## Product Schema

### Type Definition

```graphql
type Product {
  # ID
  id: ID!

  # Translatable fields
  title: String!           # Language-aware
  title_en: String         # English
  title_ar: String         # Arabic
  title_fr: String         # French

  content: String          # Language-aware
  content_en: String
  content_ar: String
  content_fr: String

  # Non-translatable fields
  slug: String!
  status: String!          # Default: "created"

  # Foreign keys
  brand_id: Int
  shipping_id: Int
  group_id: Int
  category_id: Int
  schema_id: Int

  # Multi-tenant
  project_id: Int!

  # Additional
  additional_data: JSON
  reorder: Int

  # Timestamps
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime     # Soft delete
  created_by: Int

  # Relationships
  tags: [Tag!]!
  schema: VariantSchema
  variants: [Variant!]!
}
```

### Permissions

- **Create:** `project_owner`, `admin`
- **Read:** Public (`*`)
- **Update:** `project_owner`, `admin`
- **Delete:** `project_owner`, `admin`

---

## Queries

### Get Single Product

```graphql
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    title
    content
    slug
    status
    brand_id
    category_id
    project_id
    created_at
    updated_at
  }
}
```

**Variables:**
```json
{
  "id": "123"
}
```

### List Products

```graphql
query GetProducts {
  products(
    filter: {
      status: "active"
      is_active: true
    }
    pagination: {
      offset: 0
      limit: 20
    }
    orderBy: "created_at:DESC"
  ) {
    edges {
      id
      title
      slug
      status
      createdAt
    }
    pageInfo {
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
}
```

### Search Products

```graphql
query SearchProducts {
  products(
    search: "laptop gaming"
    filter: {
      price_gte: 1000
    }
  ) {
    edges {
      id
      title
      content
    }
  }
}
```

### With Relationships

```graphql
query GetProductWithRelations($id: ID!) {
  product(id: $id) {
    id
    title
    category {
      id
      name
    }
    brand {
      id
      name
    }
    tags {
      id
      name
    }
    variants {
      id
      sku
      sellingPrice
    }
  }
}
```

### Multi-Language Query

```graphql
query GetProductI18n($id: ID!) {
  product(id: $id) {
    id
    title_en
    title_ar
    title_fr
    content_en
    content_ar
  }
}
```

---

## Mutations

### Create Product

```graphql
mutation CreateProduct {
  createProduct(input: {
    title: "New Laptop"
    content: "High performance laptop for gaming"
    slug: "new-laptop"
    status: "active"
    brand_id: 1
    category_id: 5
  }) {
    id
    title
    slug
    status
    created_at
  }
}
```

**Required Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
X-Project-Id: 1
```

### Update Product

```graphql
mutation UpdateProduct($id: ID!) {
  updateProduct(
    id: $id
    input: {
      title: "Updated Laptop Title"
      status: "published"
    }
  ) {
    id
    title
    status
    updated_at
  }
}
```

### Delete Product (Soft Delete)

```graphql
mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id)
}
```

### Restore Product

```graphql
mutation RestoreProduct($id: ID!) {
  restoreProduct(id: $id) {
    id
    title
    deleted_at
  }
}
```

---

## Filtering

### Filter Operators

**String Fields:**
- `field` - Exact match
- `field_contains` - Contains substring
- `field_startswith` - Starts with
- `field_endswith` - Ends with
- `field_icontains` - Case-insensitive contains

**Numeric Fields:**
- `field` - Exact match
- `field_gte` - Greater than or equal
- `field_lte` - Less than or equal
- `field_gt` - Greater than
- `field_lt` - Less than

**Boolean Fields:**
- `field` - Exact match

**Date Fields:**
- `field` - Exact match
- `field_gte` - Date is after or on
- `field_lte` - Date is before or on

### Logical Operators

**AND:**
```graphql
filter: {
  AND: [
    { price_gte: 100 }
    { price_lte: 1000 }
    { status: "active" }
  ]
}
```

**OR:**
```graphql
filter: {
  OR: [
    { category_id: 1 }
    { category_id: 2 }
  ]
}
```

**NOT:**
```graphql
filter: {
  NOT: {
    category_id: 5
  }
}
```

**Complex Nested:**
```graphql
filter: {
  AND: [
    {
      OR: [
        { category_id: 1 }
        { category_id: 2 }
      ]
    }
    { price_gte: 50 }
    { status: "active" }
  ]
}
```

---

## Other Model Examples

### Category Queries

```graphql
query GetCategories {
  categories(
    filter: {
      featured: true
      parent_id: null
    }
    orderBy: "order:ASC"
  ) {
    edges {
      id
      name
      name_en
      name_ar
      description
      slug
      featured
      order
    }
  }
}
```

### Brand Queries

```graphql
query GetBrands {
  brands(
    filter: {
      featured: true
    }
  ) {
    edges {
      id
      name
      slug
      featured
    }
  }
}
```

### Tag Queries

```graphql
query GetTags {
  tags(
    search: "electronics"
  ) {
    edges {
      id
      name
      color
    }
  }
}
```

### Variant Queries

```graphql
query GetVariants($productId: ID!) {
  variants(
    filter: {
      product_id: $productId
      is_active: true
    }
  ) {
    edges {
      id
      sku
      costPrice
      sellingPrice
      profitPercent
      isActive
    }
  }
}
```

---

## Aggregate Queries

### Product Aggregates

```graphql
query GetProductStats {
  productsAggregate(
    filter: {
      status: "active"
    }
  ) {
    count
    sum {
      # Add numeric fields here
    }
    avg {
      # Add numeric fields here
    }
    min {
      created_at
    }
    max {
      created_at
    }
  }
}
```

---

## Error Handling

### Error Response Format

```json
{
  "errors": [{
    "message": "Permission denied: Authentication required",
    "locations": [{"line": 2, "column": 3}],
    "path": ["createProduct"],
    "extensions": {
      "code": "UNAUTHENTICATED",
      "status": 401
    }
  }],
  "data": null
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHENTICATED` | 401 | No JWT token or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `SERVICE_ERROR` | 500 | External service failure |
| `DATABASE_ERROR` | 500 | Database operation failed |

---

## Schema Introspection

### Get Schema Types

```graphql
query Introspection {
  __schema {
    types {
      name
      kind
      description
    }
  }
}
```

### Get Query Type

```graphql
query GetQueries {
  __schema {
    queryType {
      fields {
        name
        description
        args {
          name
          type {
            name
          }
        }
      }
    }
  }
}
```

### Get Mutation Type

```graphql
query GetMutations {
  __schema {
    mutationType {
      fields {
        name
        description
      }
    }
  }
}
```

---

## Testing the API

### Using cURL

```bash
# Simple query
curl -X POST https://test.zonevast.com/graphql/product \
  -H "Content-Type: application/json" \
  -d '{"query": "query { products { edges { id title } } }"}'

# Authenticated mutation
curl -X POST https://test.zonevast.com/graphql/product \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query": "mutation { createProduct(input: {title: \"Test\"}) { id title } }"}'
```

### Using GraphQL Playground

1. Open GraphQL Playground or Postman
2. Set URL to: `https://test.zonevast.com/graphql/product`
3. Add header: `Authorization: Bearer YOUR_TOKEN` (for mutations)
4. Add header: `X-Project-Id: 1`
5. Execute queries

---

## Language Support

The service supports three languages with automatic field generation:

- **English (en)** - Default/source language
- **Arabic (ar)** - Auto-translated
- **French (fr)** - Auto-translated

### Language-Aware Fields

Translatable fields automatically get language-specific versions:

```graphql
type Product {
  title: String!      # Returns language based on Accept-Language header
  title_en: String    # Explicit English
  title_ar: String    # Explicit Arabic
  title_fr: String    # Explicit French
}
```

### Setting Language

Via HTTP Header:
```
Accept-Language: ar
```

Via GraphQL Context (if supported):
```graphql
query {
  products @locale(language: "ar") {
    title  # Will return Arabic title
  }
}
```

---

## Performance Tips

1. **Use Filters Over Search** - Filters are more efficient for exact matching
2. **Limit Result Sets** - Always use pagination for large datasets
3. **Select Specific Fields** - Only request fields you need
4. **Use Aggregates** - Better than counting results manually
5. **Leverage Indexes** - Filterable fields are automatically indexed

---

## Deployment

### Deploy to Lambda

```bash
cd /home/yousef/Documents/workspace/zonevast/services/graphql/autoapi-projects/product-graphql

# Run migrations
python3 manage.py migrate

# Deploy to staging
python3 deploy_lambda.py

# Or via manage.py
python3 manage.py deploy staging
```

### Deploy to Lambda

```bash
# Deploy to staging
python3 deploy_lambda.py

# Or via manage.py
python3 manage.py deploy staging
```

---

## Related Documentation

- **Auto-API Framework:** `/services/graphql/auto-api-framework/`
- **Product Models:** `/services/graphql/autoapi-projects/product-graphql/models/product.py`
- **Handler Config:** `/services/graphql/autoapi-projects/product-graphql/handler.py`
- **Deployment Guide:** `MANAGE_CLI_GUIDE.md`

---

## Support

For issues or questions:
1. Check deployment status: `python3 manage.py info`
2. Check logs in CloudWatch for Lambda function
3. Verify JWT token is valid and includes project_id
4. Test locally to isolate the issue
