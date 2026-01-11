# Inventory GraphQL API Reference

Auto-API GraphQL service for inventory management, stock tracking, and warehouse operations.

## Base URL

```
Production: https://api.zonevast.com/graphql/inventory
Test: https://test.zonevast.com/graphql/inventory
```

## Authentication

All requests require JWT authentication via the `Authorization` header:

```bash
curl -X POST https://test.zonevast.com/inventory/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{"query": "{ warehouses { id name } }"}'
```

The `project_id` is automatically extracted from the JWT token - do not provide it manually.

## Data Models

### Warehouse
Storage facility/warehouse with multi-language support.

**Fields:**
- `id` (ID!) - Unique identifier
- `name` (String!) - Warehouse name (translatable)
- `description` (String) - Description (translatable)
- `address` (String!) - Physical address
- `projectId` (Int!) - Project ID (from JWT)
- `locations` - Related storage locations

**Permissions:**
- Create: `project_owner`, `admin`
- Read: `project_user`, `project_owner`, `admin`
- Update: `project_owner`, `admin`
- Delete: `project_owner`, `admin`

---

### LocationType
Categorizes locations within warehouses (e.g., racks, shelves, bins).

**Fields:**
- `id` (ID!) - Unique identifier
- `name` (String!) - Type name (translatable)
- `description` (String) - Description (translatable)
- `warehouseId` (Int!) - Parent warehouse
- `order` (Int) - Sort order
- `projectId` (Int!) - Project ID (from JWT)
- `warehouse` - Parent warehouse relationship

**Permissions:** Same as Warehouse

---

### Location
Physical storage location within a warehouse.

**Fields:**
- `id` (ID!) - Unique identifier
- `name` (String!) - Location name (translatable)
- `description` (String) - Description (translatable)
- `warehouseId` (Int!) - Parent warehouse
- `locationTypeId` (Int) - Location type
- `parentId` (Int) - Parent location (for hierarchy)
- `capacity` (Int) - Maximum capacity
- `projectId` (Int!) - Project ID (from JWT)
- `warehouse` - Parent warehouse
- `locationType` - Location type relationship

**Permissions:** Same as Warehouse

---

### Vendor
Supplier/vendor information.

**Fields:**
- `id` (ID!) - Unique identifier
- `name` (String!) - Vendor name (searchable)
- `contactPerson` (String) - Primary contact
- `email` (String) - Email address
- `phone` (String) - Phone number
- `address` (String) - Physical address
- `projectId` (Int!) - Project ID (from JWT)
- `batches` - Related batches

**Permissions:** Same as Warehouse

---

### Batch
Inventory batch for tracking stock lots.

**Fields:**
- `id` (ID!) - Unique identifier
- `batchNumber` (String!) - Unique batch number
- `quantity` (Int!) - Batch quantity
- `expiryDate` (DateTime) - Expiration date
- `vendorId` (Int) - Supplier vendor
- `projectId` (Int!) - Project ID (from JWT)
- `vendor` - Vendor relationship

**Permissions:**
- Create: `project_user`, `project_owner`, `admin`
- Read: `project_user`, `project_owner`, `admin`
- Update: `project_user`, `project_owner`, `admin`
- Delete: `project_owner`, `admin`

---

### Inventory
Main inventory tracking model.

**Fields:**
- `id` (ID!) - Unique identifier
- `serialNumber` (String) - Optional serial number (unique)
- `productId` (Int!) - Product reference (from product service)
- `warehouseId` (Int!) - Warehouse location
- `locationId` (Int) - Specific location
- `batchId` (Int) - Batch reference
- `quantity` (Int!) - Current quantity
- `minimumStockLevel` (Int) - Reorder threshold (default: 10)
- `maximumStockLevel` (Int) - Max capacity (default: 100)
- `projectId` (Int!) - Project ID (from JWT)
- `warehouse` - Warehouse relationship
- `location` - Location relationship
- `batch` - Batch relationship
- `movements` - Inventory movement history

**Permissions:** Same as Batch

---

### InventoryMovement
Tracks all inventory movements for audit trail.

**Fields:**
- `id` (ID!) - Unique identifier
- `inventoryId` (Int!) - Related inventory
- `movementType` (String!) - Type: IN, OUT, TRANSFER, ADJUSTMENT
- `quantity` (Int!) - Quantity moved (positive/negative)
- `reference` (String) - Order/transfer reference
- `notes` (String) - Movement notes
- `projectId` (Int!) - Project ID (from JWT)
- `inventory` - Inventory relationship

**Important:**
- Creating a movement **automatically updates** inventory quantity
- Movements are **immutable** - cannot be updated after creation (audit trail)
- Negative quantity for OUT movements, positive for IN

**Permissions:**
- Create: `project_user`, `project_owner`, `admin`
- Read: `project_user`, `project_owner`, `admin`
- Update: `project_owner`, `admin` (blocked - immutable)
- Delete: `project_owner`, `admin`

## Example Queries

### List Warehouses

```graphql
query GetWarehouses {
  warehouses(limit: 10, offset: 0) {
    id
    name
    address
    projectId
  }
}
```

### Filter Inventories by Product

```graphql
query GetInventoriesByProduct($productId: Int!) {
  inventories(where: "{\"productId\": $productId}") {
    id
    productId
    quantity
    minimumStockLevel
    warehouse {
      id
      name
    }
    location {
      id
      name
    }
  }
}
```

### Get Inventory with Movements

```graphql
query GetInventoryWithMovements($id: ID!) {
  inventory(id: $id) {
    id
    productId
    quantity
    movements {
      id
      movementType
      quantity
      reference
      createdAt
    }
  }
}
```

### Search Warehouses by Name

```graphql
query SearchWarehouses($searchTerm: String!) {
  warehouses(search: $searchTerm) {
    id
    name
    description
    address
  }
}
```

## Example Mutations

### Create Warehouse

```graphql
mutation CreateWarehouse {
  createWarehouse(input: {
    name: "Central Distribution Hub"
    description: "Main distribution center"
    address: "123 Logistics Way, Industrial Zone"
  }) {
    id
    name
    address
    projectId
  }
}
```

### Create Location

```graphql
mutation CreateLocation {
  createLocation(input: {
    name: "Rack A-15"
    description: "Shelf location for electronics"
    warehouseId: 1
    locationTypeId: 2
    capacity: 100
  }) {
    id
    name
    capacity
    warehouse {
      id
      name
    }
  }
}
```

### Create Vendor

```graphql
mutation CreateVendor {
  createVendor(input: {
    name: "TechSupply Inc."
    contactPerson: "John Smith"
    email: "john@techsupply.com"
    phone: "+1-555-0123"
    address: "500 Supplier Blvd, Commerce City"
  }) {
    id
    name
    email
  }
}
```

### Create Batch

```graphql
mutation CreateBatch {
  createBatch(input: {
    batchNumber: "BATCH-2024-001"
    quantity: 500
    expiryDate: "2025-12-31T00:00:00Z"
    vendorId: 1
  }) {
    id
    batchNumber
    quantity
    expiryDate
  }
}
```

### Create Inventory

```graphql
mutation CreateInventory {
  createInventory(input: {
    productId: 150
    warehouseId: 1
    locationId: 5
    batchId: 3
    quantity: 50
    minimumStockLevel: 10
    maximumStockLevel: 200
    serialNumber: "SN-1000"
  }) {
    id
    productId
    quantity
    warehouse {
      id
      name
    }
    batch {
      id
      batchNumber
    }
  }
}
```

### Create Inventory Movement (Auto-Updates Quantity)

```graphql
mutation CreateMovement {
  createInventoryMovement(input: {
    inventoryId: 1
    movementType: "IN"
    quantity: 25
    reference: "PO-12345"
    notes: "Stock replenishment"
  }) {
    id
    movementType
    quantity
    inventory {
      id
      quantity  # This will be auto-incremented by 25
    }
  }
}
```

### Update Warehouse

```graphql
mutation UpdateWarehouse($id: ID!) {
  updateWarehouse(id: $id, input: {
    address: "500 Updated Logistics Drive"
  }) {
    id
    name
    address
  }
}
```

### Delete Warehouse

```graphql
mutation DeleteWarehouse($id: ID!) {
  deleteWarehouse(id: $id)
}
```

## Pagination & Filtering

### Pagination
```graphql
query GetPaginatedWarehouses($limit: Int, $offset: Int) {
  warehouses(limit: $limit, offset: $offset) {
    id
    name
  }
}
```

### Advanced Filtering
```graphql
query FilterInventories {
  inventories(where: "{\"productId__gte\": 100, \"quantity__lt\": 20}") {
    id
    productId
    quantity
  }
}
```

### Sorting
```graphql
query SortedInventories {
  inventories(orderBy: "-quantity") {
    id
    quantity
  }
}
```

## Movement Types

- `IN` - Stock receipt/purchase
- `OUT` - Stock sale/usage
- `TRANSFER` - Movement between locations
- `ADJUSTMENT` - Manual correction

## Error Responses

### Authentication Error
```json
{
  "errors": [
    {
      "message": "Authentication required",
      "extensions": { "code": "AUTH_AUTHENTICATION_ERROR" }
    }
  ]
}
```

### Permission Error
```json
{
  "errors": [
    {
      "message": "You do not have permission to perform this action",
      "extensions": { "code": "AUTH_PERMISSION_ERROR" }
    }
  ]
}
```

### Validation Error
```json
{
  "errors": [
    {
      "message": "Field 'name' is required",
      "extensions": { "code": "VALIDATION_ERROR" }
    }
  ]
}
```

## Multi-Language Support

Translatable fields support English, Arabic, and French:

```graphql
query GetWarehouseArabic {
  warehouses {
    id
    name(language: "ar")
    description(language: "ar")
  }
}
```

## Testing

Test the endpoint:

```bash
# Health check
curl -X POST https://test.zonevast.com/inventory/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'

# With authentication (replace TOKEN)
curl -X POST https://test.zonevast.com/inventory/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"query": "{ warehouses { id name } }"}'
```

## Deployment Information

- **AWS Region:** me-south-1
- **Runtime:** Python 3.11
- **Handler:** handler.lambda_handler
- **Lambda Function:** autoapi-inventory-graphql-dev
- **Database Schema:** inventory
- **JWT Secret:** Configured via environment

## Notes

- All `projectId` values are extracted from JWT token - never include in mutations
- Inventory movements automatically update inventory quantities
- Movement records are immutable for audit compliance
- Use `where` parameter with JSON string for complex filtering
- Translatable fields: `name`, `description` (on applicable models)
