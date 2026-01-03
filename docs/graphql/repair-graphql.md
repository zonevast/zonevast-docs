# Repair GraphQL

## Endpoint

```
https://test.zonevast.com/graphql/repair
```

## Authentication

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Example Queries

### Get All Repair Requests

```graphql
query GetRepairRequests($status: RepairStatus, $first: Int, $after: String) {
  repairRequests(status: $status, first: $first, after: $after) {
    edges {
      node {
        id
        ticketNumber
        status
        priority
        customer {
          id
          name
          email
          phone
        }
        device {
          id
          name
          serialNumber
          category
        }
        issueDescription
        estimatedCost
        actualCost
        createdAt
        updatedAt
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

### Get Single Repair Request

```graphql
query GetRepairRequest($id: ID!) {
  repairRequest(id: $id) {
    id
    ticketNumber
    status
    priority
    customer {
      id
      name
      email
      phone
    }
    device {
      id
      name
      serialNumber
      category
      brand
      model
      purchaseDate
      warrantyExpiry
      images {
        url
      }
    }
    issueDescription
    diagnosis
    repairNotes
    estimatedCost
    actualCost
    estimatedCompletionDate
    completedAt
    assignedTechnician {
      id
      name
      email
    }
    parts {
      id
      name
      quantity
      cost
    }
    statusHistory {
      status
      timestamp
      notes
      performedBy {
        id
        name
      }
    }
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

### Get Repair by Ticket Number

```graphql
query GetRepairByTicket($ticketNumber: String!) {
  repairByTicketNumber(ticketNumber: $ticketNumber) {
    id
    ticketNumber
    status
    customer {
      name
    }
    device {
      name
      serialNumber
    }
    issueDescription
    estimatedCompletionDate
  }
}
```

**Variables:**
```json
{
  "ticketNumber": "REP-2024-001234"
}
```

### Get Customer Repairs

```graphql
query GetCustomerRepairs($customerId: ID!) {
  customerRepairs(customerId: $customerId) {
    id
    ticketNumber
    status
    priority
    device {
      name
      serialNumber
    }
    issueDescription
    estimatedCost
    createdAt
  }
}
```

**Variables:**
```json
{
  "customerId": "456"
}
```

### Get Technician Assignments

```graphql
query GetTechnicianRepairs($technicianId: ID!) {
  technicianRepairs(technicianId: $technicianId) {
    id
    ticketNumber
    status
    priority
    customer {
      name
      phone
    }
    device {
      name
      serialNumber
      category
    }
    issueDescription
    estimatedCompletionDate
  }
}
```

**Variables:**
```json
{
  "technicianId": "789"
}
```

### Get Repair Queue

```graphql
query GetRepairQueue($status: RepairStatus, $priority: Priority) {
  repairQueue(status: $status, priority: $priority) {
    id
    ticketNumber
    priority
    customer {
      name
    }
    device {
      name
      category
    }
    issueDescription
    estimatedCompletionDate
    waitingTime
  }
}
```

### Search Repair Requests

```graphql
query SearchRepairs($searchTerm: String!) {
  searchRepairs(searchTerm: $searchTerm) {
    id
    ticketNumber
    status
    customer {
      name
      email
    }
    device {
      name
      serialNumber
    }
  }
}
```

**Variables:**
```json
{
  "searchTerm": "iphone"
}
```

### Get Repair Analytics

```graphql
query GetRepairAnalytics($startDate: DateTime!, $endDate: DateTime!) {
  repairAnalytics(startDate: $startDate, endDate: $endDate) {
    totalRepairs
    completedRepairs
    pendingRepairs
    averageCompletionTime
    averageCost
    repairsByStatus {
      status
      count
    }
    repairsByCategory {
      category
      count
    }
    topTechnicians {
      technician {
        id
        name
      }
      completedRepairs
    }
  }
}
```

## Example Mutations

### Create Repair Request

```graphql
mutation CreateRepairRequest($input: CreateRepairInput!) {
  createRepairRequest(input: $input) {
    repairRequest {
      id
      ticketNumber
      status
      customer {
        name
      }
      device {
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
    "customerId": "456",
    "device": {
      "name": "iPhone 13",
      "serialNumber": "SN123456789",
      "category": "SMARTPHONE",
      "brand": "Apple",
      "model": "iPhone 13",
      "purchaseDate": "2023-01-15",
      "warrantyExpiry": "2024-01-15"
    },
    "issueDescription": "Screen cracked, battery draining quickly",
    "priority": "MEDIUM",
    "estimatedCost": 150.00,
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
  }
}
```

### Update Repair Status

```graphql
mutation UpdateRepairStatus($input: UpdateRepairStatusInput!) {
  updateRepairStatus(input: $input) {
    repairRequest {
      id
      status
      statusHistory {
        status
        timestamp
        notes
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
    "repairId": "123",
    "status": "IN_PROGRESS",
    "notes": "Started diagnosis and repair process"
  }
}
```

### Assign Technician

```graphql
mutation AssignTechnician($input: AssignTechnicianInput!) {
  assignTechnician(input: $input) {
    repairRequest {
      id
      assignedTechnician {
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
    "repairId": "123",
    "technicianId": "789"
  }
}
```

### Add Diagnosis

```graphql
mutation AddDiagnosis($input: AddDiagnosisInput!) {
  addDiagnosis(input: $input) {
    repairRequest {
      id
      diagnosis
      estimatedCost
      estimatedCompletionDate
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
    "repairId": "123",
    "diagnosis": "Screen replacement needed, battery calibration required",
    "estimatedCost": 180.00,
    "estimatedCompletionDate": "2024-01-10T17:00:00Z"
  }
}
```

### Add Parts

```graphql
mutation AddParts($input: AddPartsInput!) {
  addParts(input: $input) {
    repairRequest {
      id
      parts {
        id
        name
        quantity
        cost
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
    "repairId": "123",
    "parts": [
      {
        "name": "iPhone 13 Screen",
        "quantity": 1,
        "cost": 120.00
      },
      {
        "name": "Adhesive Kit",
        "quantity": 1,
        "cost": 10.00
      }
    ]
  }
}
```

### Update Repair Notes

```graphql
mutation UpdateRepairNotes($input: UpdateNotesInput!) {
  updateRepairNotes(input: $input) {
    repairRequest {
      id
      repairNotes
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
    "repairId": "123",
    "notes": "Screen replaced successfully. Battery calibrated. Device tested and working properly."
  }
}
```

### Complete Repair

```graphql
mutation CompleteRepair($input: CompleteRepairInput!) {
  completeRepair(input: $input) {
    repairRequest {
      id
      status
      actualCost
      completedAt
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
    "repairId": "123",
    "actualCost": 175.00,
    "notes": "Repair completed successfully. All tests passed."
  }
}
```

### Update Priority

```graphql
mutation UpdateRepairPriority($input: UpdatePriorityInput!) {
  updateRepairPriority(input: $input) {
    repairRequest {
      id
      priority
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
    "repairId": "123",
    "priority": "HIGH"
  }
}
```

### Cancel Repair Request

```graphql
mutation CancelRepair($repairId: ID!, $reason: String) {
  cancelRepair(repairId: $repairId, reason: $reason) {
    repairRequest {
      id
      status
      cancellationReason
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
  "repairId": "123",
  "reason": "Customer declined repair"
}
```

## Subscriptions

### Repair Request Created

```graphql
subscription OnRepairCreated {
  repairCreated {
    repairRequest {
      id
      ticketNumber
      customer {
        name
      }
      device {
        name
      }
      priority
    }
  }
}
```

### Repair Status Updated

```graphql
subscription OnRepairStatusUpdated($repairId: ID) {
  repairStatusUpdated(repairId: $repairId) {
    repairRequest {
      id
      ticketNumber
      status
      statusHistory {
        status
        timestamp
        notes
      }
    }
  }
}
```

### Repair Assigned

```graphql
subscription OnRepairAssigned {
  repairAssigned {
    repairRequest {
      id
      ticketNumber
      assignedTechnician {
        id
        name
      }
    }
  }
}
```

## Common Use Cases

### Customer Repair Submission

```graphql
mutation SubmitRepairRequest($input: CustomerRepairInput!) {
  submitRepairRequest(input: $input) {
    repairRequest {
      id
      ticketNumber
      status
      estimatedCost
      estimatedCompletionDate
    }
    errors {
      field
      message
    }
  }
}
```

### Track Repair Status

```graphql
query TrackRepair($ticketNumber: String!) {
  repairByTicketNumber(ticketNumber: $ticketNumber) {
    id
    ticketNumber
    status
    device {
      name
      serialNumber
    }
    diagnosis
    repairNotes
    estimatedCompletionDate
    statusHistory {
      status
      timestamp
      notes
    }
  }
}
```

### Technician Workload

```graphql
query GetTechnicianWorkload($technicianId: ID!) {
  technicianRepairs(technicianId: $technicianId) {
    id
    ticketNumber
    status
    priority
    estimatedCompletionDate
  }
  technicianStats(technicianId: $technicianId) {
    activeRepairs
    completedThisWeek
    averageCompletionTime
  }
}
```

### Repair Cost Report

```graphql
query RepairCostReport($startDate: DateTime!, $endDate: DateTime!) {
  repairCostReport(startDate: $startDate, endDate: $endDate) {
    totalRevenue
    totalPartsCost
    totalLaborCost
    profit
    repairsCompleted
    averageRepairCost
    byCategory {
      category
      count
      revenue
    }
  }
}
```
