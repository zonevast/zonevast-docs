# Inventory GraphQL

## Endpoint

```
https://test.zonevast.com/graphql/inventory
```

## Authentication

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Example Queries

### Get All Inventory Items

```graphql
query GetInventoryItems {
  inventoryItems {
    id
    product {
      id
      name
      sku
    }
    quantity
    reservedQuantity
    availableQuantity
    location {
      id
      name
      type
    }
    lowStockThreshold
    stockStatus
    lastRestockedAt
  }
}
```

### Get Single Inventory Item

```graphql
query GetInventoryItem($id: ID!) {
  inventoryItem(id: $id) {
    id
    product {
      id
      name
      sku
      category {
        id
        name
      }
    }
    quantity
    reservedQuantity
    availableQuantity
    location {
      id
      name
      type
      address
    }
    lowStockThreshold
    stockStatus
    lastRestockedAt
    movementHistory {
      id
      type
      quantity
      timestamp
      reference
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

### Get Inventory by Product

```graphql
query GetProductInventory($productId: ID!) {
  productInventory(productId: $productId) {
    id
    quantity
    reservedQuantity
    availableQuantity
    location {
      id
      name
    }
    stockStatus
  }
}
```

**Variables:**
```json
{
  "productId": "456"
}
```

### Get Low Stock Items

```graphql
query GetLowStockItems {
  lowStockItems {
    id
    product {
      id
      name
      sku
    }
    quantity
    lowStockThreshold
    stockStatus
  }
}
```

### Get Inventory Movements

```graphql
query GetInventoryMovements($itemId: ID!, $fromDate: DateTime, $toDate: DateTime) {
  inventoryMovements(itemId: $itemId, fromDate: $fromDate, toDate: $toDate) {
    id
    type
    quantity
    quantityBefore
    quantityAfter
    timestamp
    reference
    notes
    performedBy {
      id
      username
    }
  }
}
```

**Variables:**
```json
{
  "itemId": "123",
  "fromDate": "2024-01-01T00:00:00Z",
  "toDate": "2024-12-31T23:59:59Z"
}
```

### Get Warehouses/Locations

```graphql
query GetLocations {
  locations {
    id
    name
    type
    address
    isActive
    capacity
    currentUtilization
  }
}
```

### Get Stock Reservations

```graphql
query GetStockReservations($productId: ID!) {
  stockReservations(productId: $productId) {
    id
    product {
      id
      name
    }
    quantity
    order {
      id
      orderNumber
    }
    status
    expiresAt
    createdAt
  }
}
```

**Variables:**
```json
{
  "productId": "456"
}
```

### Get Inventory Summary

```graphql
query GetInventorySummary {
  inventorySummary {
    totalProducts
    totalItems
    lowStockCount
    outOfStockCount
    totalValue
    locations {
      id
      name
      itemCount
      totalValue
    }
  }
}
```

## Example Mutations

### Adjust Stock

```graphql
mutation AdjustStock($input: StockAdjustmentInput!) {
  adjustStock(input: $input) {
    inventoryItem {
      id
      quantity
      availableQuantity
    }
    movement {
      id
      type
      quantity
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
    "productId": "456",
    "locationId": "789",
    "quantity": 50,
    "type": "ADDITION",
    "reference": "PO-2024-001",
    "notes": "Restock from purchase order"
  }
}
```

### Reserve Stock

```graphql
mutation ReserveStock($input: ReserveStockInput!) {
  reserveStock(input: $input) {
    reservation {
      id
      quantity
      status
      expiresAt
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
    "productId": "456",
    "quantity": 10,
    "orderId": "ORDER-123",
    "expiresInMinutes": 30
  }
}
```

### Release Stock Reservation

```graphql
mutation ReleaseReservation($reservationId: ID!) {
  releaseReservation(reservationId: $reservationId) {
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
  "reservationId": "RES-123"
}
```

### Transfer Stock

```graphql
mutation TransferStock($input: StockTransferInput!) {
  transferStock(input: $input) {
    movement {
      id
      type
      quantity
      fromLocation {
        id
        name
      }
      toLocation {
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
    "productId": "456",
    "fromLocationId": "789",
    "toLocationId": "101",
    "quantity": 25,
    "reference": "TRANSFER-001"
  }
}
```

### Update Low Stock Threshold

```graphql
mutation UpdateLowStockThreshold($input: UpdateThresholdInput!) {
  updateLowStockThreshold(input: $input) {
    inventoryItem {
      id
      lowStockThreshold
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
    "productId": "456",
    "threshold": 20
  }
}
```

### Create Location

```graphql
mutation CreateLocation($input: CreateLocationInput!) {
  createLocation(input: $input) {
    location {
      id
      name
      type
      address
      capacity
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
    "name": "Main Warehouse",
    "type": "WAREHOUSE",
    "address": "123 Storage St",
    "capacity": 10000
  }
}
```

## Subscriptions

### Stock Updated

```graphql
subscription OnStockUpdated {
  stockUpdated {
    inventoryItem {
      id
      product {
        id
        name
      }
      quantity
      availableQuantity
    }
    changeType
    newQuantity
    oldQuantity
  }
}
```

### Low Stock Alert

```graphql
subscription OnLowStockAlert {
  lowStockAlert {
    inventoryItem {
      id
      product {
        id
        name
        sku
      }
      quantity
      lowStockThreshold
    }
    timestamp
  }
}
```

## Common Use Cases

### Order Fulfillment Check

```graphql
query CheckOrderFulfillment($items: [OrderItemInput]!) {
  canFulfillOrder(items: $items) {
    canFulfill
    unavailableItems {
      productId
      requestedQuantity
      availableQuantity
    }
    totalValue
  }
}
```

### Multi-location Inventory

```graphql
query GetMultiLocationInventory($productId: ID!) {
  product(id: $productId) {
    id
    name
    inventoryAcrossLocations {
      location {
        id
        name
        type
      }
      quantity
      availableQuantity
      distance
    }
  }
}
```

### Inventory Valuation

```graphql
query GetInventoryValuation($locationId: ID) {
  inventoryValuation(locationId: $locationId) {
    totalItems
    totalValue
    totalCost
    categories {
      category {
        id
        name
      }
      itemCount
      value
    }
  }
}
```

### Stock Movement Report

```graphql
query GetStockMovementReport($startDate: DateTime!, $endDate: DateTime!) {
  stockMovementReport(startDate: $startDate, endDate: $endDate) {
    movements {
      id
      type
      product {
        id
        name
        sku
      }
      quantity
      timestamp
    }
    summary {
      additions
      removals
      transfers
      adjustments
    }
  }
}
```
