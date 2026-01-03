# Products API

## Base URL
`https://test.zonevast.com/api/v1/product`

## Authentication
All requests require a valid JWT token in the Authorization header:
```bash
Authorization: Bearer YOUR_TOKEN
```

---

## Endpoints

### List Products

Retrieve a paginated list of products with optional filtering.

```bash
curl -X GET https://test.zonevast.com/api/v1/product/products/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `page_size` (integer): Items per page (default: 20, max: 100)
- `search` (string): Search in name, SKU, or description
- `category` (integer): Filter by category ID
- `is_active` (boolean): Filter by active status
- `min_price` (decimal): Minimum price filter
- `max_price` (decimal): Maximum price filter
- `ordering` (string): Sort order (e.g., `price`, `-price`, `name`, `-created_at`)

**Response (200 OK):**
```json
{
  "count": 150,
  "next": "https://test.zonevast.com/api/v1/product/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Wireless Bluetooth Headphones",
      "sku": "WBH-001",
      "description": "High-quality wireless headphones with noise cancellation",
      "price": "79.99",
      "compare_at_price": "99.99",
      "cost_price": "45.00",
      "is_active": true,
      "track_inventory": true,
      "category": {
        "id": 5,
        "name": "Electronics",
        "slug": "electronics"
      },
      "tags": ["wireless", "bluetooth", "audio"],
      "images": [
        {
          "id": 101,
          "url": "https://cdn.zonevast.com/products/headphones.jpg",
          "alt_text": "Bluetooth Headphones",
          "is_primary": true
        }
      ],
      "stock_quantity": 45,
      "low_stock_threshold": 10,
      "weight": 0.5,
      "weight_unit": "kg",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-03-20T14:22:00Z"
    }
  ]
}
```

---

### Create Product

Create a new product.

```bash
curl -X POST https://test.zonevast.com/api/v1/product/products/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "USB-C Charging Cable",
    "sku": "USB-C-002",
    "description": "Fast charging USB-C cable, 2 meters",
    "price": "12.99",
    "compare_at_price": "15.99",
    "cost_price": "5.00",
    "is_active": true,
    "track_inventory": true,
    "category": 5,
    "tags": ["cable", "usb-c", "charging"],
    "stock_quantity": 100,
    "low_stock_threshold": 20,
    "weight": 0.1,
    "weight_unit": "kg"
  }'
```

**Request Body:**
- `name` (string, required): Product name
- `sku` (string, required): Unique stock keeping unit
- `description` (string): Product description
- `price` (decimal, required): Selling price
- `compare_at_price` (decimal): Original price for display
- `cost_price` (decimal): Internal cost price
- `is_active` (boolean): Product visibility (default: true)
- `track_inventory` (boolean): Enable inventory tracking (default: true)
- `category` (integer): Category ID
- `tags` (array of strings): Product tags
- `stock_quantity` (integer): Initial stock count
- `low_stock_threshold` (integer): Alert threshold
- `weight` (decimal): Product weight
- `weight_unit` (string): Weight unit (kg, g, lb, oz)

**Response (201 Created):**
Returns the created product object (same format as List Products response).

**Error Response (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": {
    "sku": ["A product with this SKU already exists"],
    "price": ["This field is required"]
  }
}
```

---

### Get Product

Retrieve details of a specific product.

```bash
curl -X GET https://test.zonevast.com/api/v1/product/products/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
Returns a single product object (same format as List Products response).

**Error Response (404 Not Found):**
```json
{
  "error": "Product not found",
  "message": "No product exists with ID: 1"
}
```

---

### Update Product

Update an existing product (supports partial updates).

```bash
curl -X PATCH https://test.zonevast.com/api/v1/product/products/1/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": "69.99",
    "description": "Updated description with new features"
  }'
```

**Request Body:**
Same fields as Create Product (all optional).

**Response (200 OK):**
Returns the updated product object.

---

### Delete Product

Permanently delete a product.

```bash
curl -X DELETE https://test.zonevast.com/api/v1/product/products/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (204 No Content):**
Product successfully deleted.

**Error Response (403 Forbidden):**
```json
{
  "error": "Cannot delete product",
  "message": "Product has associated orders and cannot be deleted. Consider archiving instead."
}
```

---

### Bulk Operations

#### Bulk Update Products

Update multiple products at once.

```bash
curl -X POST https://test.zonevast.com/api/v1/product/products/bulk_update/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {"id": 1, "price": "75.99"},
      {"id": 2, "is_active": false}
    ]
  }'
```

**Response (200 OK):**
```json
{
  "updated": 2,
  "failed": 0,
  "errors": []
}
```

---

### Product Images

#### Upload Product Image

```bash
curl -X POST https://test.zonevast.com/api/v1/product/products/1/images/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/product.jpg" \
  -F "alt_text=Product front view" \
  -F "is_primary=true"
```

**Response (201 Created):**
```json
{
  "id": 102,
  "url": "https://cdn.zonevast.com/products/product_1_102.jpg",
  "alt_text": "Product front view",
  "is_primary": true
}
```

#### Delete Product Image

```bash
curl -X DELETE https://test.zonevast.com/api/v1/product/products/1/images/102/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Product Variants (if applicable)

#### List Product Variants

```bash
curl -X GET https://test.zonevast.com/api/v1/product/products/1/variants/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "sku": "WBH-001-BLK",
      "name": "Black",
      "price": "79.99",
      "stock_quantity": 15,
      "attributes": {
        "color": "Black",
        "size": "Standard"
      }
    },
    {
      "id": 2,
      "sku": "WBH-001-WHT",
      "name": "White",
      "price": "79.99",
      "stock_quantity": 20,
      "attributes": {
        "color": "White",
        "size": "Standard"
      }
    }
  ]
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 204 | Deleted successfully |
| 400 | Bad request / Validation error |
| 401 | Unauthorized / Invalid token |
| 403 | Forbidden / Insufficient permissions |
| 404 | Product not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Rate Limits

- **Free Tier**: 100 requests / minute
- **Pro Tier**: 1,000 requests / minute
- **Enterprise**: Custom

Check the `X-RateLimit-Remaining` header for your remaining quota.
