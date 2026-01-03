# Product Catalog Service

## Base URL
`https://test.zonevast.com/api/v1/product/products`

## Authentication
Require JWT token in Authorization header:
```bash
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Endpoints

### List Products
Get paginated list of all products.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/product/products/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Query Parameters
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20)
- `search`: Search in name, description
- `category`: Filter by category ID
- `brand`: Filter by brand ID
- `min_price`, `max_price`: Price range filter
- `ordering`: Sort field (e.g., `price`, `-price`, `name`, `-created_at`)

#### Response
```json
{
  "count": 100,
  "next": "https://test.zonevast.com/api/v1/product/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "sku": "SKU-001",
      "price": 29.99,
      "compare_at_price": 39.99,
      "cost_price": 15.00,
      "is_active": true,
      "track_inventory": true,
      "category": {
        "id": 1,
        "name": "Electronics"
      },
      "brand": {
        "id": 1,
        "name": "Brand Name"
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Get Product Detail
Get detailed information for a specific product.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/product/products/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Full product description with details",
  "sku": "SKU-001",
  "price": 29.99,
  "compare_at_price": 39.99,
  "cost_price": 15.00,
  "is_active": true,
  "track_inventory": true,
  "weight": 1.5,
  "weight_unit": "kg",
  "category": {
    "id": 1,
    "name": "Electronics",
    "slug": "electronics"
  },
  "brand": {
    "id": 1,
    "name": "Brand Name",
    "slug": "brand-name"
  },
  "specifications": [
    {
      "schema": {
        "id": 1,
        "name": "Technical Specs"
      },
      "key": "material",
      "value": "Aluminum"
    }
  ],
  "images": [],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### Create Product
Create a new product.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/product/products/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "sku": "SKU-002",
    "price": 49.99,
    "cost_price": 25.00,
    "is_active": true,
    "track_inventory": true,
    "category": 1,
    "brand": 1
  }'
```

#### Response
```json
{
  "id": 2,
  "name": "New Product",
  "sku": "SKU-002",
  "price": 49.99,
  "is_active": true
}
```

---

### Update Product
Update an existing product.

#### Request
```bash
curl -X PUT https://test.zonevast.com/api/v1/product/products/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Product Name",
    "price": 34.99
  }'
```

#### Partial Update (PATCH)
```bash
curl -X PATCH https://test.zonevast.com/api/v1/product/products/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 34.99
  }'
```

#### Response
```json
{
  "id": 1,
  "name": "Updated Product Name",
  "price": 34.99
}
```

---

### Delete Product
Delete a product.

#### Request
```bash
curl -X DELETE https://test.zonevast.com/api/v1/product/products/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "message": "Product deleted successfully"
}
```

---

### List Categories
Get all product categories.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/product/products/categories/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic products",
      "parent": null,
      "image": null
    }
  ]
}
```

---

### Create Category
Create a new product category.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/product/products/categories/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Category",
    "description": "Category description",
    "parent": null
  }'
```

#### Response
```json
{
  "id": 2,
  "name": "New Category",
  "slug": "new-category",
  "description": "Category description"
}
```

---

### List Brands
Get all product brands.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/product/products/brands/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "name": "Brand Name",
      "slug": "brand-name",
      "logo": null,
      "description": "Brand description"
    }
  ]
}
```

---

### Create Brand
Create a new brand.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/product/products/brands/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Brand",
    "description": "Brand description"
  }'
```

#### Response
```json
{
  "id": 2,
  "name": "New Brand",
  "slug": "new-brand"
}
```

---

### Product Specifications
Manage product specifications.

#### List Specification Schemas
```bash
curl -X GET https://test.zonevast.com/api/v1/product/products/schemas/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "name": "Technical Specs",
      "description": "Technical specifications"
    }
  ]
}
```

#### Create Specification Schema
```bash
curl -X POST https://test.zonevast.com/api/v1/product/products/schemas/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Features",
    "description": "Key product features"
  }'
```

---

### Product Barcodes
Manage product barcodes/SKUs.

#### List Barcodes
```bash
curl -X GET https://test.zonevast.com/api/v1/product/products/barcodes/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "product": 1,
      "barcode": "1234567890123",
      "barcode_type": "EAN13",
      "is_primary": true
    }
  ]
}
```

#### Add Barcode
```bash
curl -X POST https://test.zonevast.com/api/v1/product/products/barcodes/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product": 1,
    "barcode": "1234567890123",
    "barcode_type": "EAN13",
    "is_primary": true
  }'
```

---

### Price History
View historical price changes for products.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/product/products/price-history/?product=1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "product": 1,
      "old_price": 39.99,
      "new_price": 29.99,
      "changed_at": "2024-01-01T00:00:00Z",
      "changed_by": "admin"
    }
  ]
}
```

---

### Shipping Information
Manage product shipping details.

#### List Shipping
```bash
curl -X GET https://test.zonevast.com/api/v1/product/products/shipping/?product=1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "product": 1,
      "length": 10,
      "width": 5,
      "height": 3,
      "dimension_unit": "cm",
      "weight": 0.5,
      "weight_unit": "kg"
    }
  ]
}
```

---

## Common Error Responses

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 400 Bad Request
```json
{
  "name": ["This field is required."],
  "price": ["A valid number is required."]
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```
