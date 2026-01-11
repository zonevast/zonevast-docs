# Repair GraphQL API Reference

## Overview

The **repair-graphql** service provides a complete repair management system with device registration, repair tracking, parts inventory, and vendor management. It integrates with billing and inventory services through service bindings.

### Service Details

| Property | Value |
|----------|-------|
| **Service Name** | repair |
| **Version** | v1 |
| **GraphQL Port** | 4010 |
| **Schema** | repair |
| **Database** | zonevast_autoapi |
| **Framework** | Auto-API |

### Endpoints

**Production:**
```
https://api.zonevast.com/graphql/repair
```

**Test:**
```
https://test.zonevast.com/graphql/repair
```

## Architecture

### Service Integrations

The repair service communicates with other services through **Service Bindings**:

```
┌─────────────┐         ┌──────────────┐
│   repair    │────────>│   billing    │
│  (this)     │         │   (invoice)  │
└─────────────┘         └──────────────┘
       │
       │
       v
┌──────────────┐
│  inventory   │
│  (stock)     │
└──────────────┘
```

### Service Bindings

1. **Repair → Billing**: Automatically creates invoice when repair is created
2. **RepairPart → Inventory**: Decrements stock when part is used
3. **PartOrder → Inventory**: Increments stock when order is completed

## Models

### 1. RepairCategory

Categories for repair types (e.g., Electronics, Appliances, Automotive).

#### Fields

| Field | Type | Required | Translatable | Description |
|-------|------|----------|--------------|-------------|
| `id` | Int | Auto | - | Unique identifier |
| `name` | String | Yes | Yes | Category name |
| `description` | String | No | Yes | Category description |
| `slug` | String | Yes | - | URL-friendly slug |
| `icon` | String | No | - | Icon name or URL |
| `is_active` | Bool | No | - | Active status |
| `project_id` | Int | Yes | - | Project identifier |

#### Relationships

- **repair_types**: One-to-many with RepairType

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Usage

```graphql
# Query all repair categories
query {
  repairCategories {
    id
    name
    description
    isActive
    projectId
  }
}

# Create repair category
mutation {
  createRepairCategory(input: {
    name: "Electronics"
    description: "Electronic device repairs"
    projectId: 1
  }) {
    id
    name
    slug
  }
}
```

---

### 2. RepairType

Specific repair services offered (e.g., Screen Replacement, Battery Replacement).

#### Fields

| Field | Type | Required | Translatable | Description |
|-------|------|----------|--------------|-------------|
| `id` | Int | Auto | - | Unique identifier |
| `category_id` | Int | Yes | - | Parent category |
| `name` | String | Yes | Yes | Service name |
| `price` | Float | Yes | - | Standard service price |
| `estimated_duration` | Int | Yes | - | Duration in minutes |
| `is_active` | Bool | No | - | Active status |
| `project_id` | Int | Yes | - | Project identifier |

#### Relationships

- **category**: Many-to-one with RepairCategory
- **repairs**: One-to-many with Repair

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Usage

```graphql
# Query repair types by category
query {
  repairTypes(filter: { categoryId: 1 }) {
    id
    name
    price
    estimatedDuration
    category {
      name
    }
  }
}

# Create repair type
mutation {
  createRepairType(input: {
    categoryId: 1
    name: "Screen Replacement"
    price: 150.0
    estimatedDuration: 60
    projectId: 1
  }) {
    id
    name
    price
  }
}
```

---

### 3. RepairStatus

Custom repair statuses for workflow management.

#### Fields

| Field | Type | Required | Translatable | Description |
|-------|------|----------|--------------|-------------|
| `id` | Int | Auto | - | Unique identifier |
| `name` | String | Yes | Yes | Status name |
| `description` | String | No | Yes | Status description |
| `status` | String | Yes | - | Status category (pending/in_progress/completed/cancelled) |
| `color` | String | No | - | Hex color code for UI |
| `order` | Int | No | - | Display order |
| `is_active` | Bool | No | - | Active status |
| `project_id` | Int | Yes | - | Project identifier |

#### Relationships

- **repairs**: One-to-many with Repair

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Usage

```graphql
# Query all repair statuses
query {
  repairStatuses(sort: { field: "order", order: "ASC" }) {
    id
    name
    status
    color
    order
  }
}

# Create repair status
mutation {
  createRepairStatus(input: {
    name: "Awaiting Parts"
    status: "pending"
    color: "#ffc107"
    order: 2
    projectId: 1
  }) {
    id
    name
    color
  }
}
```

---

### 4. DeviceCategory

Categories for devices (e.g., Smartphones, Laptops, Tablets).

#### Fields

| Field | Type | Required | Translatable | Description |
|-------|------|----------|--------------|-------------|
| `id` | Int | Auto | - | Unique identifier |
| `name` | String | Yes | Yes | Category name |
| `description` | String | No | Yes | Category description |
| `slug` | String | Yes | - | URL-friendly slug |
| `icon` | String | No | - | Icon name or URL |
| `project_id` | Int | Yes | - | Project identifier |

#### Relationships

- **device_models**: One-to-many with DeviceModel

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Usage

```graphql
# Query device categories
query {
  deviceCategories {
    id
    name
    description
    icon
  }
}

# Create device category
mutation {
  createDeviceCategory(input: {
    name: "Smartphones"
    description: "Mobile phone devices"
    projectId: 1
  }) {
    id
    name
    slug
  }
}
```

---

### 5. DeviceModel

Specific device models (e.g., iPhone 13 Pro, MacBook Air M1).

#### Fields

| Field | Type | Required | Translatable | Description |
|-------|------|----------|--------------|-------------|
| `id` | Int | Auto | - | Unique identifier |
| `category_id` | Int | Yes | - | Parent category |
| `model_name` | String | Yes | - | Model name |
| `unique_identifier` | String | No | - | Model number or SKU |
| `manufacturer` | String | Yes | - | Manufacturer name |
| `description` | String | No | - | Model description |
| `specifications` | JSON | No | - | Technical specs |
| `project_id` | Int | Yes | - | Project identifier |

#### Relationships

- **category**: Many-to-one with DeviceCategory
- **devices**: One-to-many with Device

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Usage

```graphql
# Query device models
query {
  deviceModels(filter: { manufacturer: "Apple" }) {
    id
    modelName
    uniqueIdentifier
    manufacturer
    specifications
  }
}

# Create device model
mutation {
  createDeviceModel(input: {
    categoryId: 1
    modelName: "iPhone 13 Pro"
    uniqueIdentifier: "A2639"
    manufacturer: "Apple"
    specifications: {
      screen: "6.1-inch OLED"
      storage: "128GB-1TB"
      processor: "A15 Bionic"
    }
    projectId: 1
  }) {
    id
    modelName
    specifications
  }
}
```

---

### 6. Device

Individual customer devices registered for repair.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Int | Auto | Unique identifier |
| `model_id` | Int | Yes | Device model reference |
| `customer_id` | Int | Yes | Customer ID (from auth service) |
| `serial_number` | String | Yes | Device serial number (unique) |
| `purchase_date` | DateTime | No | Purchase date |
| `warranty_expiry` | DateTime | No | Warranty expiration |
| `notes` | String | No | Additional notes |
| `project_id` | Int | Yes | Project identifier |

#### Relationships

- **model**: Many-to-one with DeviceModel
- **repairs**: One-to-many with Repair

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_user, project_owner, admin |
| Read | project_owner, admin, or customer_id matches user_id |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Usage

```graphql
# Query devices by customer
query {
  devices(filter: { customerId: 1 }) {
    id
    serialNumber
    purchaseDate
    warrantyExpiry
    model {
      modelName
      manufacturer
    }
  }
}

# Create device
mutation {
  createDevice(input: {
    modelId: 1
    customerId: 1
    serialNumber: "SN123456789"
    purchaseDate: "2023-01-15T00:00:00Z"
    warrantyExpiry: "2025-01-15T00:00:00Z"
    projectId: 1
  }) {
    id
    serialNumber
  }
}
```

---

### 7. Repair

Main repair record tracking the entire repair lifecycle.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Int | Auto | Unique identifier |
| `device_id` | Int | Yes | Device reference |
| `repair_type_id` | Int | Yes | Repair type reference |
| `status_id` | Int | Yes | Status reference |
| `customer_id` | Int | Yes | Customer ID (from auth) |
| `technician_id` | Int | No | Technician ID (from auth) |
| `priority` | String | Yes | Priority (low/medium/high/urgent) |
| `priority_reason` | String | No | Reason for priority |
| `scheduled_date` | DateTime | No | Scheduled date |
| `completion_date` | DateTime | No | Completion date |
| `notes` | String | No | Customer initial notes |
| `diagnosis` | String | No | Technician diagnosis |
| `resolution` | String | No | Resolution notes |
| `warranty_period` | Int | No | Warranty period (months) |
| `estimated_cost` | Float | Yes | Estimated cost |
| `actual_cost` | Float | No | Final cost |
| `project_id` | Int | Yes | Project identifier |
| `invoice_id` | Int | No | Invoice reference (auto-created) |

#### Relationships

- **device**: Many-to-one with Device
- **repair_type**: Many-to-one with RepairType
- **status**: Many-to-one with RepairStatus
- **repair_parts**: One-to-many with RepairPart

#### Service Bindings

**After Create**: Automatically creates invoice in billing service

```python
ServiceBinding(
    service='billing',
    action='create_invoice',
    params={
        'invoiceNumber': 'RPR-{id}',
        'customerId': '{customer_id}',
        'totalAmount': '{estimated_cost}',
        'paymentStatus': 'pending',
        'projectId': '{project_id}'
    },
    map_response={'id': 'invoice_id'},
    async_execution=True,
    retry=2
)
```

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_user, project_owner, admin |
| Read | project_owner, admin, or customer_id matches user_id |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Usage

```graphql
# Query repairs with filtering
query {
  repairs(
    filter: { statusId: 1, priority: "high" }
    sort: { field: "scheduledDate", order: "DESC" }
  ) {
    id
    deviceId
    priority
    estimatedCost
    actualCost
    invoiceId
    status {
      name
      color
    }
    device {
      serialNumber
      model {
        modelName
      }
    }
  }
}

# Get single repair
query {
  repair(id: 1) {
    id
    notes
    diagnosis
    resolution
    repairType {
      name
      price
    }
  }
}

# Create repair (triggers invoice creation)
mutation {
  createRepair(input: {
    deviceId: 1
    customerId: 1
    repairTypeId: 1
    statusId: 1
    priority: "high"
    priorityReason: "Urgent business need"
    estimatedCost: 150.0
    scheduledDate: "2024-01-15T10:00:00Z"
    notes: "Screen cracked, touch not working"
    projectId: 1
  }) {
    id
    estimatedCost
    invoiceId  # Auto-populated by service binding
  }
}

# Update repair
mutation {
  updateRepair(
    id: 1
    input: {
      actualCost: 175.0
      diagnosis: "Screen digitizer damaged"
      resolution: "Screen replaced, tested OK"
      completionDate: "2024-01-15T14:30:00Z"
    }
  ) {
    id
    actualCost
    resolution
  }
}

# Delete repair
mutation {
  deleteRepair(id: 1)
}
```

---

### 8. RepairPart

Parts used in a repair with quantity and pricing.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Int | Auto | Unique identifier |
| `repair_id` | Int | Yes | Repair reference |
| `inventory_part_id` | Int | Yes | Inventory part reference |
| `quantity` | Int | Yes | Quantity used |
| `unit_price` | Float | Yes | Price per unit |
| `project_id` | Int | Yes | Project identifier |

#### Relationships

- **repair**: Many-to-one with Repair
- **inventory_part**: Many-to-one with InventoryPart

#### Service Bindings

**After Create**: Decrements inventory stock

```python
ServiceBinding(
    service='inventory',
    action='decrement_stock',
    params={
        'inventoryId': '{inventory_part_id}',
        'movementType': 'OUT',
        'quantity': '-{quantity}',
        'reference': 'repair:{repair_id}',
        'projectId': '{project_id}'
    },
    async_execution=True,
    retry=2
)
```

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Usage

```graphql
# Query parts used in a repair
query {
  repairParts(filter: { repairId: 1 }) {
    id
    quantity
    unitPrice
    inventoryPart {
      name
      sku
    }
  }
}

# Add part to repair (triggers stock decrement)
mutation {
  createRepairPart(input: {
    repairId: 1
    inventoryPartId: 5
    quantity: 2
    unitPrice: 25.0
    projectId: 1
  }) {
    id
    quantity
  }
}
```

---

### 9. Vendor

Vendors/suppliers for repair parts.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Int | Auto | Unique identifier |
| `name` | String | Yes | Vendor name (unique) |
| `contact_name` | String | No | Contact person |
| `email` | String | No | Email address |
| `phone` | String | No | Phone number |
| `address` | String | No | Physical address |
| `project_id` | Int | Yes | Project identifier |

#### Relationships

- **inventory_parts**: One-to-many with InventoryPart
- **part_orders**: One-to-many with PartOrder

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Usage

```graphql
# Query vendors
query {
  vendors {
    id
    name
    contactName
    email
    phone
  }
}

# Create vendor
mutation {
  createVendor(input: {
    name: "TechParts Supply Co."
    contactName: "John Smith"
    email: "john@techparts.com"
    phone: "+1234567890"
    address: "123 Tech Street, Silicon Valley, CA"
    projectId: 1
  }) {
    id
    name
  }
}
```

---

### 10. InventoryPart

Inventory of repair parts and components.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Int | Auto | Unique identifier |
| `name` | String | Yes | Part name |
| `category` | String | No | Part category |
| `description` | String | No | Part description |
| `sku` | String | Yes | SKU (unique) |
| `stock` | Int | Yes | Current stock level |
| `price_per_unit` | Float | Yes | Price per unit |
| `reorder_level` | Int | No | Minimum stock before reorder |
| `vendor_id` | Int | No | Vendor reference |
| `project_id` | Int | Yes | Project identifier |

#### Relationships

- **vendor**: Many-to-one with Vendor
- **repair_parts**: One-to-many with RepairPart
- **part_orders**: One-to-many with PartOrder

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Usage

```graphql
# Query inventory parts with low stock
query {
  inventoryParts(filter: { category: "Screens" }) {
    id
    name
    sku
    stock
    pricePerUnit
    reorderLevel
    vendor {
      name
    }
  }
}

# Create inventory part
mutation {
  createInventoryPart(input: {
    name: "iPhone 13 Pro Screen Assembly"
    category: "Screens"
    sku: "IP13P-SCREEN-OLED"
    stock: 50
    pricePerUnit: 75.0
    reorderLevel: 10
    vendorId: 1
    projectId: 1
  }) {
    id
    name
    stock
  }
}
```

---

### 11. PartOrder

Orders placed to vendors for restocking parts.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Int | Auto | Unique identifier |
| `vendor_id` | Int | Yes | Vendor reference |
| `part_id` | Int | Yes | Part reference |
| `quantity` | Int | Yes | Quantity ordered |
| `total_price` | Float | Yes | Total order price |
| `status` | String | Yes | Status (pending/completed/cancelled) |
| `order_date` | DateTime | No | Order date |
| `project_id` | Int | Yes | Project identifier |

#### Relationships

- **vendor**: Many-to-one with Vendor
- **part**: Many-to-one with InventoryPart

#### Lifecycle Hooks

**After Update**: When status changes to "completed", automatically increments inventory stock

```python
def after_update(self, instance, old_data):
    if old_data.get('status') != 'completed' and instance.status == 'completed':
        # Increment inventory stock by order quantity
        inventory_part.stock += instance.quantity
```

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Usage

```graphql
# Query part orders
query {
  partOrders(filter: { status: "pending" }) {
    id
    quantity
    totalPrice
    status
    orderDate
    vendor {
      name
    }
    part {
      name
      sku
    }
  }
}

# Create part order
mutation {
  createPartOrder(input: {
    vendorId: 1
    partId: 5
    quantity: 100
    totalPrice: 5000.0
    status: "pending"
    orderDate: "2024-01-15T00:00:00Z"
    projectId: 1
  }) {
    id
    quantity
    totalPrice
  }
}

# Mark order as completed (triggers stock increment)
mutation {
  updatePartOrder(
    id: 1
    input: { status: "completed" }
  ) {
    id
    status
  }
}
```

---

## Queries

### List Queries

Fetch multiple records with optional filtering, sorting, and pagination.

```graphql
# List all repairs
query {
  repairs {
    id
    priority
    estimatedCost
    status {
      name
    }
  }
}

# List with filtering
query {
  repairs(
    filter: {
      statusId: 1
      priority: "high"
      projectId: 1
    }
    sort: {
      field: "scheduledDate"
      order: "DESC"
    }
  ) {
    id
    priority
    scheduledDate
  }
}

# List with search
query {
  repairs(search: "screen cracked") {
    id
    notes
    diagnosis
  }
}
```

### Single Record Query

Fetch a specific record by ID.

```graphql
query {
  repair(id: 1) {
    id
    deviceId
    repairTypeId
    statusId
    estimatedCost
    actualCost
    invoiceId
    device {
      serialNumber
      model {
        modelName
        manufacturer
      }
    }
    repairType {
      name
      price
      estimatedDuration
    }
    status {
      name
      color
    }
    repairParts {
      quantity
      unitPrice
      inventoryPart {
        name
        sku
      }
    }
  }
}
```

---

## Mutations

### Create

```graphql
# Create repair
mutation {
  createRepair(input: {
    deviceId: 1
    customerId: 1
    repairTypeId: 1
    statusId: 1
    priority: "high"
    estimatedCost: 150.0
    scheduledDate: "2024-01-15T10:00:00Z"
    notes: "Screen cracked"
    projectId: 1
  }) {
    id
    estimatedCost
    invoiceId  # Auto-populated from billing service
  }
}

# Create device
mutation {
  createDevice(input: {
    modelId: 1
    customerId: 1
    serialNumber: "SN123456789"
    projectId: 1
  }) {
    id
    serialNumber
  }
}

# Create repair type
mutation {
  createRepairType(input: {
    categoryId: 1
    name: "Battery Replacement"
    price: 80.0
    estimatedDuration: 30
    projectId: 1
  }) {
    id
    name
    price
  }
}
```

### Update

```graphql
# Update repair
mutation {
  updateRepair(
    id: 1
    input: {
      actualCost: 175.0
      diagnosis: "Screen damaged"
      resolution: "Replaced with new screen"
      completionDate: "2024-01-15T14:30:00Z"
    }
  ) {
    id
    actualCost
    resolution
  }
}

# Update inventory part
mutation {
  updateInventoryPart(
    id: 5
    input: {
      stock: 45
      pricePerUnit: 80.0
    }
  ) {
    id
    stock
    pricePerUnit
  }
}
```

### Delete

```graphql
# Delete repair
mutation {
  deleteRepair(id: 1)
}

# Delete device
mutation {
  deleteDevice(id: 1)
}
```

---

## Authentication

All operations require authentication via JWT token.

### Headers

```bash
Authorization: Bearer <token>
X-Project-ID: <project_id>
```

### Get Token

```bash
# Login to get token
curl -X POST https://test.zonevast.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Authenticated Request

```bash
curl -X POST https://test.zonevast.com/graphql/repair \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ repairs { id priority estimatedCost } }"
  }'
```

---

## Testing

### Test Queries

```bash
# List repairs (requires admin token)
curl -X POST https://test.zonevast.com/graphql/repair \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ repairs { id priority estimatedCost } }"}'

# Create repair
curl -X POST https://test.zonevast.com/graphql/repair \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateRepair($input: RepairInput!) { createRepair(input: $input) { id estimatedCost invoiceId } }",
    "variables": {
      "input": {
        "deviceId": 1,
        "customerId": 1,
        "repairTypeId": 1,
        "statusId": 1,
        "priority": "medium",
        "estimatedCost": 100.0,
        "projectId": 1
      }
    }
  }'

# Get repair by ID
curl -X POST https://test.zonevast.com/graphql/repair \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ repair(id: 1) { id notes diagnosis resolution } }"}'
```

---

## Filtering and Sorting

### Filter Operators

```graphql
# Equality
query {
  repairs(filter: { statusId: 1 }) {
    id
  }
}

# Multiple filters
query {
  repairs(filter: { statusId: 1, priority: "high" }) {
    id
  }
}
```

### Sorting

```graphql
# Sort ascending
query {
  repairs(sort: { field: "estimatedCost", order: "ASC" }) {
    id
    estimatedCost
  }
}

# Sort descending
query {
  repairs(sort: { field: "created_at", order: "DESC" }) {
    id
    createdAt
  }
}
```

### Search

```graphql
# Search across searchable fields
query {
  repairs(search: "screen") {
    id
    notes
    diagnosis
  }
}
```

---

## Error Handling

### Common Errors

**Authentication Error:**
```json
{
  "errors": [
    {
      "message": "Authentication required",
      "extensions": { "code": "AUTH_REQUIRED" }
    }
  ]
}
```

**Permission Error:**
```json
{
  "errors": [
    {
      "message": "You do not have permission to perform this action",
      "extensions": { "code": "PERMISSION_DENIED" }
    }
  ]
}
```

**Validation Error:**
```json
{
  "errors": [
    {
      "message": "Field 'deviceId' is required",
      "extensions": { "code": "VALIDATION_ERROR" }
    }
  ]
}
```

**Foreign Key Error:**
```json
{
  "errors": [
    {
      "message": "Device with id 999 does not exist",
      "extensions": { "code": "FOREIGN_KEY_ERROR" }
    }
  ]
}
```

---

## Best Practices

### 1. Service Binding Validation

Service bindings are asynchronous and may fail silently. Always validate:

```graphql
# After creating repair, check invoiceId was populated
mutation {
  createRepair(input: { ... }) {
    id
    invoiceId  # Should be populated if billing service is available
  }
}
```

### 2. Stock Management

Always check stock levels before using parts:

```graphql
query CheckStock($partId: Int!) {
  inventoryPart(id: $partId) {
    name
    stock
    reorderLevel
  }
}
```

### 3. Permission Handling

Customers can only view their own devices and repairs:

```graphql
# This query for customer will only return their own devices
query {
  devices {
    id
    serialNumber
    # Automatically filtered by customer_id
  }
}
```

### 4. Status Workflow

Follow proper status transitions:

```
pending → in_progress → completed
                    ↓
                 cancelled
```

---

## Deployment

### Deploy to Lambda

```bash
cd /home/yousef/Documents/workspace/zonevast/services/graphql/autoapi-projects/repair-graphql
python3 manage.py migrate
python3 deploy_lambda.py
```

---

## Schema Reference

### Available Queries

- `repairCategory(id: ID!)`
- `repairCategories`
- `repairType(id: ID!)`
- `repairTypes`
- `repairStatus(id: ID!)`
- `repairStatuses`
- `deviceCategory(id: ID!)`
- `deviceCategories`
- `deviceModel(id: ID!)`
- `deviceModels`
- `device(id: ID!)`
- `devices`
- `repair(id: ID!)`
- `repairs`
- `repairPart(id: ID!)`
- `repairParts`
- `vendor(id: ID!)`
- `vendors`
- `inventoryPart(id: ID!)`
- `inventoryParts`
- `partOrder(id: ID!)`
- `partOrders`

### Available Mutations

- `createRepairCategory(input: RepairCategoryInput!)`
- `updateRepairCategory(id: ID!, input: RepairCategoryInput!)`
- `deleteRepairCategory(id: ID!)`
- `createRepairType(input: RepairTypeInput!)`
- `updateRepairType(id: ID!, input: RepairTypeInput!)`
- `deleteRepairType(id: ID!)`
- `createRepairStatus(input: RepairStatusInput!)`
- `updateRepairStatus(id: ID!, input: RepairStatusInput!)`
- `deleteRepairStatus(id: ID!)`
- `createDeviceCategory(input: DeviceCategoryInput!)`
- `updateDeviceCategory(id: ID!, input: DeviceCategoryInput!)`
- `deleteDeviceCategory(id: ID!)`
- `createDeviceModel(input: DeviceModelInput!)`
- `updateDeviceModel(id: ID!, input: DeviceModelInput!)`
- `deleteDeviceModel(id: ID!)`
- `createDevice(input: DeviceInput!)`
- `updateDevice(id: ID!, input: DeviceInput!)`
- `deleteDevice(id: ID!)`
- `createRepair(input: RepairInput!)`
- `updateRepair(id: ID!, input: RepairInput!)`
- `deleteRepair(id: ID!)`
- `createRepairPart(input: RepairPartInput!)`
- `updateRepairPart(id: ID!, input: RepairPartInput!)`
- `deleteRepairPart(id: ID!)`
- `createVendor(input: VendorInput!)`
- `updateVendor(id: ID!, input: VendorInput!)`
- `deleteVendor(id: ID!)`
- `createInventoryPart(input: InventoryPartInput!)`
- `updateInventoryPart(id: ID!, input: InventoryPartInput!)`
- `deleteInventoryPart(id: ID!)`
- `createPartOrder(input: PartOrderInput!)`
- `updatePartOrder(id: ID!, input: PartOrderInput!)`
- `deletePartOrder(id: ID!)`

---

## Support

For issues or questions:
- Documentation: `/home/yousef/Documents/workspace/zonevast/services/graphql/autoapi-projects/repair-graphql/`
- Service Config: `services_config.py`
- Models: `models/repair.py`
- Tests: `tests/test_repairs.py`
