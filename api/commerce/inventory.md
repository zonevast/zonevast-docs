# Inventory API

## Base URL
`https://test.zonevast.com/api/v1/inventory`

## Authentication
All requests require a valid JWT token in the Authorization header:
```bash
Authorization: Bearer YOUR_TOKEN
```

---

## Endpoints

### List Stock Items

Retrieve a paginated list of all stock items with current quantities.

```bash
curl -X GET https://test.zonevast.com/api/v1/inventory/stock/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `page_size` (integer): Items per page (default: 20, max: 100)
- `product_id` (integer): Filter by product ID
- `sku` (string): Filter by SKU
- `category` (integer): Filter by category ID
- `low_stock` (boolean): Show only low stock items
- `out_of_stock` (boolean): Show only out of stock items
- `search` (string): Search by product name or SKU
- `ordering` (string): Sort order (quantity, -quantity, product__name, -updated_at)

**Response (200 OK):**
```json
{
  "count": 250,
  "next": "https://test.zonevast.com/api/v1/inventory/stock/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Wireless Bluetooth Headphones",
        "sku": "WBH-001"
      },
      "quantity": 45,
      "reserved_quantity": 5,
      "available_quantity": 40,
      "low_stock_threshold": 10,
      "is_low_stock": false,
      "is_out_of_stock": false,
      "location": "Warehouse A - Shelf 12",
      "last_restocked_at": "2024-03-15T10:00:00Z",
      "updated_at": "2024-03-20T14:30:00Z"
    },
    {
      "id": 2,
      "product": {
        "id": 5,
        "name": "USB-C Charging Cable",
        "sku": "USB-C-002"
      },
      "quantity": 8,
      "reserved_quantity": 2,
      "available_quantity": 6,
      "low_stock_threshold": 20,
      "is_low_stock": true,
      "is_out_of_stock": false,
      "location": "Warehouse A - Shelf 15",
      "last_restocked_at": "2024-03-01T09:00:00Z",
      "updated_at": "2024-03-20T14:30:00Z"
    }
  ]
}
```

---

### Get Stock Item

Retrieve detailed information about a specific stock item.

```bash
curl -X GET https://test.zonevast.com/api/v1/inventory/stock/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "id": 1,
  "product": {
    "id": 1,
    "name": "Wireless Bluetooth Headphones",
    "sku": "WBH-001",
    "price": "79.99"
  },
  "quantity": 45,
  "reserved_quantity": 5,
  "available_quantity": 40,
  "low_stock_threshold": 10,
  "is_low_stock": false,
  "is_out_of_stock": false,
  "location": "Warehouse A - Shelf 12",
  "bin_location": "A-12-B",
  "reorder_point": 15,
  "reorder_quantity": 50,
  "last_restocked_at": "2024-03-15T10:00:00Z",
  "updated_at": "2024-03-20T14:30:00Z",
  "recent_movements": [
    {
      "id": 1001,
      "type": "sale",
      "quantity": -2,
      "reference": "ORD-2024-001234",
      "notes": "Order fulfillment",
      "created_at": "2024-03-20T12:00:00Z"
    }
  ]
}
```

---

### Adjust Stock

Manually adjust stock quantity (for corrections, damages, etc.).

```bash
curl -X POST https://test.zonevast.com/api/v1/inventory/movements/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 10,
    "movement_type": "adjustment",
    "reason": "Stock correction after physical count",
    "reference": "INV-2024-03-20",
    "notes": "Annual inventory audit adjustment"
  }'
```

**Request Body:**
- `product_id` (integer, required): Product ID
- `quantity` (integer, required): Quantity to adjust (positive for increase, negative for decrease)
- `movement_type` (string, required): Type of movement
  - `adjustment`: Manual adjustment
  - `restock`: Restocking from supplier
  - `sale`: Sale to customer
  - `return`: Customer return
  - `damage`: Damaged/written off
  - `transfer`: Transfer between locations
  - `production`: Manufacturing output
- `reason` (string, required): Reason for adjustment
- `reference` (string): Reference number (order ID, invoice, etc.)
- `notes` (string): Additional notes
- `location` (string): Warehouse location
- `unit_cost` (decimal): Cost per unit (for valuation)

**Response (201 Created):**
```json
{
  "id": 1002,
  "product": {
    "id": 1,
    "name": "Wireless Bluetooth Headphones",
    "sku": "WBH-001"
  },
  "quantity": 10,
  "previous_quantity": 45,
  "new_quantity": 55,
  "movement_type": "adjustment",
  "reason": "Stock correction after physical count",
  "reference": "INV-2024-03-20",
  "notes": "Annual inventory audit adjustment",
  "created_by": "admin@example.com",
  "created_at": "2024-03-20T15:00:00Z"
}
```

---

### Restock Inventory

Add stock to inventory (typically from supplier).

```bash
curl -X POST https://test.zonevast.com/api/v1/inventory/restock/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product_id": 1,
        "quantity": 50,
        "unit_cost": "45.00"
      },
      {
        "product_id": 5,
        "quantity": 100,
        "unit_cost": "5.00"
      }
    ],
    "supplier": "Tech Supplies Inc.",
    "supplier_reference": "PO-2024-0456",
    "received_date": "2024-03-20",
    "notes": "Monthly restock order"
  }'
```

**Request Body:**
- `items` (array, required): Array of items to restock
  - `product_id` (integer, required): Product ID
  - `quantity` (integer, required): Quantity to add
  - `unit_cost` (decimal): Cost per unit
- `supplier` (string): Supplier name
- `supplier_reference` (string): Supplier reference/PO number
- `received_date` (date): Date received (YYYY-MM-DD)
- `notes` (string): Additional notes

**Response (201 Created):**
```json
{
  "id": "RESTOCK-2024-0001",
  "items": [
    {
      "product_id": 1,
      "product_name": "Wireless Bluetooth Headphones",
      "quantity_added": 50,
      "previous_quantity": 55,
      "new_quantity": 105
    },
    {
      "product_id": 5,
      "product_name": "USB-C Charging Cable",
      "quantity_added": 100,
      "previous_quantity": 8,
      "new_quantity": 108
    }
  ],
  "supplier": "Tech Supplies Inc.",
  "supplier_reference": "PO-2024-0456",
  "total_cost": "2750.00",
  "created_at": "2024-03-20T16:00:00Z"
}
```

---

### List Stock Movements

Retrieve inventory movement history with filtering.

```bash
curl -X GET https://test.zonevast.com/api/v1/inventory/movements/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `page_size` (integer): Items per page (default: 20, max: 100)
- `product_id` (integer): Filter by product ID
- `movement_type` (string): Filter by movement type
- `date_from` (date): Filter movements from this date (YYYY-MM-DD)
- `date_to` (date): Filter movements until this date (YYYY-MM-DD)
- `reference` (string): Filter by reference number
- `ordering` (string): Sort order (created_at, -created_at, quantity)

**Response (200 OK):**
```json
{
  "count": 150,
  "next": "https://test.zonevast.com/api/v1/inventory/movements/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1002,
      "product": {
        "id": 1,
        "name": "Wireless Bluetooth Headphones",
        "sku": "WBH-001"
      },
      "quantity": 10,
      "previous_quantity": 45,
      "new_quantity": 55,
      "movement_type": "adjustment",
      "reason": "Stock correction after physical count",
      "reference": "INV-2024-03-20",
      "created_by": "admin@example.com",
      "created_at": "2024-03-20T15:00:00Z"
    },
    {
      "id": 1001,
      "product": {
        "id": 1,
        "name": "Wireless Bluetooth Headphones",
        "sku": "WBH-001"
      },
      "quantity": -2,
      "previous_quantity": 47,
      "new_quantity": 45,
      "movement_type": "sale",
      "reason": "Order fulfillment",
      "reference": "ORD-2024-001234",
      "created_by": "system",
      "created_at": "2024-03-20T12:00:00Z"
    }
  ]
}
```

---

### Low Stock Alerts

Get list of products that are low on stock.

```bash
curl -X GET https://test.zonevast.com/api/v1/inventory/alerts/low_stock/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `severity` (string): Alert severity (critical, warning, all)
- `category` (integer): Filter by category ID

**Response (200 OK):**
```json
{
  "count": 12,
  "results": [
    {
      "id": 2,
      "product": {
        "id": 5,
        "name": "USB-C Charging Cable",
        "sku": "USB-C-002",
        "category": "Electronics"
      },
      "current_quantity": 8,
      "reserved_quantity": 2,
      "available_quantity": 6,
      "low_stock_threshold": 20,
      "reorder_point": 15,
      "reorder_quantity": 50,
      "severity": "critical",
      "days_since_last_restock": 19,
      "suggested_action": "Immediate restock recommended"
    },
    {
      "id": 15,
      "product": {
        "id": 20,
        "name": "Phone Case",
        "sku": "PC-003",
        "category": "Accessories"
      },
      "current_quantity": 18,
      "reserved_quantity": 5,
      "available_quantity": 13,
      "low_stock_threshold": 25,
      "reorder_point": 20,
      "reorder_quantity": 100,
      "severity": "warning",
      "days_since_last_restock": 7,
      "suggested_action": "Plan restock within 3 days"
    }
  ]
}
```

---

### Stock Reservations

Reserve stock for an order (prevents overselling).

```bash
curl -X POST https://test.zonevast.com/api/v1/inventory/reservations/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "ORD-2024-001234",
    "items": [
      {
        "product_id": 1,
        "quantity": 2
      },
      {
        "product_id": 5,
        "quantity": 1
      }
    ],
    "expires_at": "2024-03-20T18:00:00Z"
  }'
```

**Request Body:**
- `order_id` (string, required): Order reference ID
- `items` (array, required): Items to reserve
  - `product_id` (integer, required): Product ID
  - `quantity` (integer, required): Quantity to reserve
- `expires_at` (datetime): Reservation expiration time (default: 24 hours)

**Response (201 Created):**
```json
{
  "id": "RES-2024-0001",
  "order_id": "ORD-2024-001234",
  "items": [
    {
      "product_id": 1,
      "product_name": "Wireless Bluetooth Headphones",
      "quantity_reserved": 2,
      "available_quantity": 38
    },
    {
      "product_id": 5,
      "product_name": "USB-C Charging Cable",
      "quantity_reserved": 1,
      "available_quantity": 5
    }
  ],
  "status": "active",
  "expires_at": "2024-03-20T18:00:00Z",
  "created_at": "2024-03-20T15:30:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Insufficient stock",
  "message": "Cannot reserve requested quantity",
  "details": {
    "product_id": 5,
    "requested": 10,
    "available": 6
  }
}
```

### Release Reservation

Release a stock reservation (when order is cancelled or expires).

```bash
curl -X POST https://test.zonevast.com/api/v1/inventory/reservations/RES-2024-0001/release/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "id": "RES-2024-0001",
  "status": "released",
  "released_at": "2024-03-20T17:00:00Z",
  "items_released": 2
}
```

---

### Confirm Reservation

Confirm a reservation (convert to actual sale after order fulfillment).

```bash
curl -X POST https://test.zonevast.com/api/v1/inventory/reservations/RES-2024-0001/confirm/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "id": "RES-2024-0001",
  "status": "confirmed",
  "confirmed_at": "2024-03-20T17:00:00Z",
  "movement_id": 1003
}
```

---

### Inventory Summary

Get overall inventory statistics and summary.

```bash
curl -X GET https://test.zonevast.com/api/v1/inventory/summary/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "total_products": 250,
  "total_stock_value": "125450.00",
  "low_stock_count": 12,
  "out_of_stock_count": 5,
  "total_quantity": 8540,
  "reserved_quantity": 340,
  "available_quantity": 8200,
  "movement_summary": {
    "today": {
      "restocked": 250,
      "sold": 85,
      "returned": 5,
      "adjusted": 10
    },
    "this_week": {
      "restocked": 1250,
      "sold": 520,
      "returned": 28,
      "adjusted": 45
    },
    "this_month": {
      "restocked": 5200,
      "sold": 2150,
      "returned": 95,
      "adjusted": 120
    }
  },
  "category_breakdown": [
    {
      "category": "Electronics",
      "product_count": 85,
      "total_value": "75200.00"
    },
    {
      "category": "Accessories",
      "product_count": 120,
      "total_value": "28500.00"
    }
  ],
  "generated_at": "2024-03-20T17:30:00Z"
}
```

---

### Inventory Transfers

Transfer stock between locations.

```bash
curl -X POST https://test.zonevast.com/api/v1/inventory/transfers/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product_id": 1,
        "quantity": 20
      }
    ],
    "from_location": "Warehouse A",
    "to_location": "Warehouse B",
    "reason": "Stock balance adjustment",
    "reference": "TRANSFER-2024-0001"
  }'
```

**Response (201 Created):**
```json
{
  "id": "TRANSFER-2024-0001",
  "items": [
    {
      "product_id": 1,
      "product_name": "Wireless Bluetooth Headphones",
      "quantity": 20,
      "from_location_previous": 45,
      "from_location_new": 25,
      "to_location_previous": 10,
      "to_location_new": 30
    }
  ],
  "from_location": "Warehouse A",
  "to_location": "Warehouse B",
  "status": "completed",
  "created_at": "2024-03-20T18:00:00Z"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request / Validation error / Insufficient stock |
| 401 | Unauthorized / Invalid token |
| 403 | Forbidden / Insufficient permissions |
| 404 | Stock item not found |
| 409 | Conflict (reservation already exists) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Rate Limits

- **Free Tier**: 100 requests / minute
- **Pro Tier**: 1,000 requests / minute
- **Enterprise**: Custom

Check the `X-RateLimit-Remaining` header for your remaining quota.
