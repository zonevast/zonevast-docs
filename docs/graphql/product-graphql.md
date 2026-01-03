# Product GraphQL

## Endpoint

```
https://test.zonevast.com/graphql/product
```

## Authentication

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Example Queries

### Get All Products

```graphql
query GetProducts {
  products {
    id
    name
    description
    price
    sku
    category {
      id
      name
    }
    tags {
      id
      name
    }
    isActive
    createdAt
    updatedAt
  }
}
```

### Get Single Product

```graphql
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    name
    description
    price
    sku
    category {
      id
      name
      description
    }
    tags {
      id
      name
    }
    images {
      id
      url
      isPrimary
    }
    attributes {
      name
      value
    }
    stockStatus
    isActive
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "123"
}
```

### Get Products with Pagination

```graphql
query GetProductsPaginated($first: Int, $after: String) {
  products(first: $first, after: $after) {
    edges {
      node {
        id
        name
        price
        sku
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

**Variables:**
```json
{
  "first": 20,
  "after": "eyJpZCI6IjEyMyJ9"
}
```

### Search Products

```graphql
query SearchProducts($searchTerm: String!) {
  searchProducts(searchTerm: $searchTerm) {
    id
    name
    description
    price
    sku
    category {
      id
      name
    }
  }
}
```

**Variables:**
```json
{
  "searchTerm": "laptop"
}
```

### Filter Products by Category

```graphql
query GetProductsByCategory($categoryId: ID!) {
  productsByCategory(categoryId: $categoryId) {
    id
    name
    price
    sku
    category {
      id
      name
    }
  }
}
```

**Variables:**
```json
{
  "categoryId": "456"
}
```

### Get Product Categories

```graphql
query GetCategories {
  categories {
    id
    name
    description
    slug
    parent {
      id
      name
    }
    children {
      id
      name
    }
  }
}
```

### Get Product Tags

```graphql
query GetTags {
  tags {
    id
    name
    slug
    productCount
  }
}
```

## Example Mutations

### Create Product

```graphql
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    product {
      id
      name
      description
      price
      sku
      category {
        id
        name
      }
    }
    errors {
      field
      message
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "sku": "SKU-001",
    "categoryId": "456",
    "tags": ["tag1", "tag2"],
    "isActive": true
  }
}
```

### Update Product

```graphql
mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
  updateProduct(id: $id, input: $input) {
    product {
      id
      name
      description
      price
      sku
    }
    errors {
      field
      message
    }
  }
}
```

**Variables:**
```json
{
  "id": "123",
  "input": {
    "name": "Updated Product Name",
    "price": 149.99
  }
}
```

### Delete Product

```graphql
mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id) {
    success
    errors {
      field
      message
    }
  }
}
```

**Variables:**
```json
{
  "id": "123"
}
```

### Create Category

```graphql
mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    category {
      id
      name
      description
      slug
    }
    errors {
      field
      message
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "Electronics",
    "description": "Electronic products",
    "parentId": null,
    "slug": "electronics"
  }
}
```

### Add Product Image

```graphql
mutation AddProductImage($productId: ID!, $input: ProductImageInput!) {
  addProductImage(productId: $productId, input: $input) {
    productImage {
      id
      url
      isPrimary
    }
    errors {
      field
      message
    }
  }
}
```

**Variables:**
```json
{
  "productId": "123",
  "input": {
    "url": "https://example.com/image.jpg",
    "isPrimary": true
  }
}
```

## Subscriptions

### Product Updated

```graphql
subscription OnProductUpdated {
  productUpdated {
    product {
      id
      name
      price
      stockStatus
    }
    mutationType
  }
}
```

### Product Created

```graphql
subscription OnProductCreated {
  productCreated {
    product {
      id
      name
      category {
        id
        name
      }
    }
  }
}
```

## Common Use Cases

### E-commerce Product Listing

```graphql
query GetProductList($categorySlug: String, $first: Int) {
  products(first: $first) {
    edges {
      node {
        id
        name
        price
        sku
        images {
          url
          isPrimary
        }
        category {
          slug
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

### Product Detail Page

```graphql
query GetProductDetail($slug: String!) {
  product(slug: $slug) {
    id
    name
    description
    price
    sku
    images {
      url
      isPrimary
    }
    category {
      name
      slug
    }
    tags {
      name
      slug
    }
    attributes {
      name
      value
    }
    relatedProducts {
      id
      name
      price
      images {
        url
      }
    }
  }
}
```

### Inventory Status Check

```graphql
query GetProductStock($productId: ID!) {
  product(id: $productId) {
    id
    name
    stockStatus
    stockQuantity
    lowStockThreshold
  }
}
```
