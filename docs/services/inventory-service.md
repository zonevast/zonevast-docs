# Inventory Management Service

## Base URL
`https://test.zonevast.com/api/v1/inventory`

## Authentication
Require JWT token in Authorization header:
```bash
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Headers
- `X-Project`: Project ID for project-specific operations

## Endpoints

### List Inventory Items
Get all inventory records across all products and locations.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/inventory/inventory/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Project: 1"
```

#### Query Parameters
- `product`: Filter by product ID
- `warehouse`: Filter by warehouse/location ID
- `batch`: Filter by batch ID
- `page`: Page number
- `page_size`: Items per page

#### Response
```json
{
  "count": 50,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "product": 1,
      "warehouse": 1,
      "batch": "BATCH-001",
      "quantity_on_hand": 100,
      "quantity_allocated": 20,
      "quantity_available": 80,
      "reorder_level": 10,
      "reorder_quantity": 50,
      "last_stock_update": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Get Inventory Detail
Get detailed inventory information for a specific record.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/inventory/inventory/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Project: 1"
```

#### Response
```json
{
  "id": 1,
  "product": {
    "id": 1,
    "name": "Product Name",
    "sku": "SKU-001"
  },
  "warehouse": {
    "id": 1,
    "name": "Main Warehouse",
    "location": "San Francisco, CA"
  },
  "batch": "BATCH-001",
  "quantity_on_hand": 100,
  "quantity_allocated": 20,
  "quantity_available": 80,
  "reorder_level": 10,
  "reorder_quantity": 50,
  "last_stock_update": "2024-01-01T00:00:00Z",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### Create Inventory Record
Create a new inventory record.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/inventory/inventory/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Project: 1" \
  -d '{
    "product": 1,
    "warehouse": 1,
    "batch": "BATCH-002",
    "quantity_on_hand": 50,
    "reorder_level": 10,
    "reorder_quantity": 25
  }'
```

#### Response
```json
{
  "id": 2,
  "product": 1,
  "warehouse": 1,
  "batch": "BATCH-002",
  "quantity_on_hand": 50,
  "quantity_available": 50,
  "reorder_level": 10
}
```

---

### Update Inventory
Update inventory quantities or settings.

#### Request
```bash
curl -X PUT https://test.zonevast.com/api/v1/inventory/inventory/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Project: 1" \
  -d '{
    "quantity_on_hand": 150,
    "reorder_level": 20
  }'
```

#### Partial Update (PATCH)
```bash
curl -X PATCH https://test.zonevast.com/api/v1/inventory/inventory/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Project: 1" \
  -d '{
    "quantity_on_hand": 150
  }'
```

#### Response
```json
{
  "id": 1,
  "quantity_on_hand": 150,
  "quantity_available": 130,
  "last_stock_update": "2024-01-02T12:00:00Z"
}
```

---

### Delete Inventory Record
Delete an inventory record.

#### Request
```bash
curl -X DELETE https://test.zonevast.com/api/v1/inventory/inventory/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Project: 1"
```

#### Response
```json
{
  "message": "Inventory record deleted successfully"
}
```

---

### List Inventory Movements
Get audit trail of all inventory transactions.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/inventory/movements/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Project: 1"
```

#### Query Parameters
- `product`: Filter by product ID
- `warehouse`: Filter by warehouse ID
- `movement_type`: Filter by type (IN, OUT, TRANSFER, ADJUSTMENT)
- `start_date`: Filter movements after date (YYYY-MM-DD)
- `end_date`: Filter movements before date (YYYY-MM-DD)

#### Response
```json
{
  "count": 100,
  "results": [
    {
      "id": 1,
      "product": 1,
      "warehouse": 1,
      "movement_type": "IN",
      "quantity": 50,
      "reference": "PO-001",
      "notes": "Stock receipt from vendor",
      "performed_by": "admin",
      "timestamp": "2024-01-01T10:00:00Z"
    },
    {
      "id": 2,
      "product": 1,
      "warehouse": 1,
      "movement_type": "OUT",
      "quantity": 10,
      "reference": "ORDER-123",
      "notes": "Order fulfillment",
      "performed_by": "system",
      "timestamp": "2024-01-01T14:30:00Z"
    }
  ]
}
```

---

### Create Inventory Movement
Record a manual inventory adjustment.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/inventory/movements/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Project: 1" \
  -d '{
    "product": 1,
    "warehouse": 1,
    "movement_type": "ADJUSTMENT",
    "quantity": -5,
    "reference": "ADJUST-001",
    "notes": "Damaged goods removed"
  }'
```

#### Movement Types
- `IN`: Stock addition (purchase, return)
- `OUT`: Stock removal (sale, disposal)
- `TRANSFER`: Stock movement between warehouses
- `ADJUSTMENT`: Manual inventory correction

#### Response
```json
{
  "id": 3,
  "product": 1,
  "movement_type": "ADJUSTMENT",
  "quantity": -5,
  "reference": "ADJUST-001",
  "timestamp": "2024-01-02T09:00:00Z"
}
```

---

### List Batches
Get all inventory batches.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/inventory/batches/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Project: 1"
```

#### Query Parameters
- `product`: Filter by product ID
- `warehouse`: Filter by warehouse ID
- `batch_number`: Filter by batch number
- `is_expired`: Filter expired batches (true/false)

#### Response
```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "batch_number": "BATCH-001",
      "product": 1,
      "warehouse": 1,
      "quantity": 100,
      "manufacture_date": "2024-01-01",
      "expiry_date": "2025-01-01",
      "is_expired": false,
      "notes": "Regular stock"
    }
  ]
}
```

---

### Create Batch
Create a new inventory batch.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/inventory/batches/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Project: 1" \
  -d '{
    "batch_number": "BATCH-003",
    "product": 1,
    "warehouse": 1,
    "quantity": 200,
    "manufacture_date": "2024-01-01",
    "expiry_date": "2025-12-31",
    "notes": "New production batch"
  }'
```

#### Response
```json
{
  "id": 3,
  "batch_number": "BATCH-003",
  "product": 1,
  "quantity": 200,
  "expiry_date": "2025-12-31",
  "is_expired": false
}
```

---

### Stock Transfer
Transfer stock between warehouses (using movement type TRANSFER).

#### Request
```bash
# Create OUT movement from source warehouse
curl -X POST https://test.zonevast.com/api/v1/inventory/movements/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Project: 1" \
  -d '{
    "product": 1,
    "warehouse": 1,
    "movement_type": "TRANSFER",
    "quantity": -25,
    "reference": "TRANSFER-001",
    "notes": "Transfer to Warehouse 2"
  }'

# Create IN movement to destination warehouse
curl -X POST https://test.zonevast.com/api/v1/inventory/movements/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Project: 1" \
  -d '{
    "product": 1,
    "warehouse": 2,
    "movement_type": "TRANSFER",
    "quantity": 25,
    "reference": "TRANSFER-001",
    "notes": "Transfer from Warehouse 1"
  }'
```

---

### Low Stock Alert
Check for products below reorder level.

#### Request
```bash
curl -X GET "https://test.zonevast.com/api/v1/inventory/inventory/?reorder_alert=true" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "X-Project: 1"
```

#### Response
```json
{
  "count": 5,
  "results": [
    {
      "id": 3,
      "product": {
        "id": 3,
        "name": "Low Stock Product",
        "sku": "SKU-003"
      },
      "quantity_available": 5,
      "reorder_level": 10,
      "needs_reorder": true
    }
  ]
}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "product": ["This field is required."],
  "quantity": ["Quantity must be positive for IN movements"]
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to modify inventory"
}
```

### 404 Not Found
```json
{
  "detail": "No inventory record found for this product/warehouse combination"
}
```
