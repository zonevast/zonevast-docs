# Debt GraphQL API Reference

## Overview

The Debt GraphQL service provides comprehensive debt management functionality including installment payments, customer tracking, debt contracts, and payment scheduling. Built with the Auto-API framework, it offers full CRUD operations with advanced filtering, sorting, and search capabilities.

**Service Name:** `debt`
**Database Schema:** `debt`
**Default Port:** `4011`
**Version:** `v1`

## Endpoints

### Production

```
https://api.zonevast.com/graphql/debt/en/v1/graphql
```

### Development

```
https://dev-api.zonevast.com/graphql/debt/en/v1/graphql
```

### Local (via SAM Gateway)

```
http://localhost:3000/graphql/debt/en/v1/graphql
```

### Local (direct service)

```
http://localhost:4011/graphql
```

## Authentication

All GraphQL queries require JWT authentication. Include the token in the `Authorization` header:

```bash
curl -X POST https://api.zonevast.com/graphql/debt/en/v1/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query": "{ debtContracts { id totalAmount status } }"}'
```

See [JWT Authentication Documentation](/api/auth/oauth.md) for details on obtaining tokens.

## Models

### Directorate

Government directorates/ministries for Iraqi government departments.

#### Type Definition

```graphql
type Directorate {
  id: ID!
  ministry: String!
  name: String!
  nameAr: String
  nameFr: String
  description: String
  descriptionAr: String
  descriptionFr: String
  slug: String!
  projectId: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime
}
```

#### Enums

**Ministry Types:**
- `health` - Ministry of Health
- `education` - Ministry of Education
- `interior` - Ministry of Interior
- `defense` - Ministry of Defense
- `oil` - Ministry of Oil
- `finance` - Ministry of Finance
- `trade` - Ministry of Trade
- `agriculture` - Ministry of Agriculture
- `transport` - Ministry of Transport
- `construction` - Ministry of Construction
- `labor` - Ministry of Labor
- `industry` - Ministry of Industry
- `justice` - Ministry of Justice
- `culture` - Ministry of Culture
- `planning` - Ministry of Planning
- `electricity` - Ministry of Electricity
- `water` - Ministry of Water Resources
- `communications` - Ministry of Communications
- `science_technology` - Ministry of Science & Technology
- `environment` - Ministry of Environment
- `migration` - Ministry of Migration
- `youth_sports` - Ministry of Youth & Sports
- `tourism` - Ministry of Tourism
- `higher_education` - Ministry of Higher Education
- `foreign_affairs` - Ministry of Foreign Affairs
- `other` - Other ministries

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin |
| Read | Public (*) |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Queries

**Query Directorates:**

```graphql
query GetDirectorates {
  directorates(
    first: 20
    filter: { ministry: "health" }
    sort: { field: "name", order: "asc" }
  ) {
    edges {
      node {
        id
        ministry
        name
        description
        slug
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    totalCount
  }
}
```

**Create Directorate:**

```graphql
mutation CreateDirectorate {
  createDirectorate(
    input: {
      ministry: "health"
      name: "Baghdad Health Directorate"
      description: "Main health directorate for Baghdad province"
      projectId: "1"
    }
  ) {
    id
    name
    slug
    ministry
  }
}
```

---

### DebtCustomer

Customer profiles with KYC and credit information.

#### Type Definition

```graphql
type DebtCustomer {
  id: ID!
  firstName: String!
  lastName: String!
  phoneNumber: String!
  birthDate: DateTime
  sex: String!
  location: String
  directorateId: ID
  workplace: String
  status: String!
  creditScore: Int
  address: String
  nationalId: String!
  projectId: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime
  directorate: Directorate
  documents: [CustomerDocument!]!
  guarantors: [Guarantor!]!
}
```

#### Enums

**Sex:**
- `male`
- `female`
- `other`

**Status:**
- `active` - Active customer
- `suspended` - Suspended customer
- `blacklisted` - Blacklisted customer

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin, user |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Queries

**Query Customers:**

```graphql
query GetCustomers {
  debtCustomers(
    first: 20
    filter: { status: "active" }
    search: "Ahmed"
    sort: { field: "createdAt", order: "desc" }
  ) {
    edges {
      node {
        id
        firstName
        lastName
        phoneNumber
        nationalId
        status
        creditScore
        directorate {
          id
          name
        }
      }
    }
    totalCount
  }
}
```

**Create Customer:**

```graphql
mutation CreateCustomer {
  createDebtCustomer(
    input: {
      firstName: "Ahmed"
      lastName: "Mohammed"
      phoneNumber: "+9647701234567"
      nationalId: "19900101234567"
      sex: "male"
      status: "active"
      birthDate: "1990-01-01T00:00:00Z"
      address: "Baghdad, Karrada district"
      directorateId: "1"
      workplace: "Ministry of Health"
      creditScore: 750
      projectId: "1"
    }
  ) {
    id
    firstName
    lastName
    nationalId
    status
  }
}
```

**Update Customer Credit Score:**

```graphql
mutation UpdateCreditScore {
  updateDebtCustomer(
    id: "1"
    input: {
      creditScore: 800
      status: "active"
    }
  ) {
    id
    creditScore
    status
  }
}
```

---

### CustomerDocument

Identity documents (national card, residence card, etc.)

#### Type Definition

```graphql
type CustomerDocument {
  id: ID!
  customerId: ID!
  documentType: String!
  mode: String!
  fileUrl: String!
  verified: Boolean!
  projectId: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime
  customer: DebtCustomer
}
```

#### Enums

**Document Type:**
- `national_card` - National identity card
- `residence_card` - Residence card
- `mayor_card` - Mayor/official card
- `job_card` - Employment card

**Mode:**
- `front` - Front side of document
- `back` - Back side of document

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin, user |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Queries

**Upload Customer Document:**

```graphql
mutation UploadDocument {
  createCustomerDocument(
    input: {
      customerId: "1"
      documentType: "national_card"
      mode: "front"
      fileUrl: "https://files.zonevast.com/documents/nid_front_123.jpg"
      verified: false
      projectId: "1"
    }
  ) {
    id
    documentType
    fileUrl
    verified
  }
}
```

**Get Customer Documents:**

```graphql
query GetCustomerDocuments {
  customerDocuments(
    filter: { customerId: "1" }
    sort: { field: "createdAt", order: "desc" }
  ) {
    edges {
      node {
        id
        documentType
        mode
        fileUrl
        verified
        createdAt
      }
    }
  }
}
```

---

### Guarantor

Guarantor relationships linking two customers.

#### Type Definition

```graphql
type Guarantor {
  id: ID!
  customerId: ID!
  guarantorCustomerId: ID!
  relationship: String
  notes: String
  projectId: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime
  customer: DebtCustomer
}
```

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin, user |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Queries

**Add Guarantor:**

```graphql
mutation AddGuarantor {
  createGuarantor(
    input: {
      customerId: "1"
      guarantorCustomerId: "2"
      relationship: "family"
      notes: "Brother of the main customer"
      projectId: "1"
    }
  ) {
    id
    relationship
    customer {
      firstName
      lastName
    }
  }
}
```

**Get Customer Guarantors:**

```graphql
query GetGuarantors {
  guarantors(filter: { customerId: "1" }) {
    edges {
      node {
        id
        relationship
        notes
        guarantorCustomerId
      }
    }
  }
}
```

---

### Plan

Installment payment plan templates.

#### Type Definition

```graphql
type Plan {
  id: ID!
  name: String!
  nameAr: String
  nameFr: String
  description: String
  descriptionAr: String
  descriptionFr: String
  slug: String!
  totalPrice: Float!
  downPayment: Float!
  installmentsCount: Int!
  installmentFrequency: String!
  interestRate: Float!
  durationMonths: Int!
  isActive: Boolean!
  projectId: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime
  contracts: [DebtContract!]!
}
```

#### Enums

**Installment Frequency:**
- `daily` - Daily payments
- `weekly` - Weekly payments
- `biweekly` - Bi-weekly payments
- `monthly` - Monthly payments (default)
- `quarterly` - Quarterly payments

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin |
| Read | Public (*) |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Queries

**Create Payment Plan:**

```graphql
mutation CreatePlan {
  createPlan(
    input: {
      name: "12 Months Premium Plan"
      description: "Premium installment plan with 10% interest"
      totalPrice: 1200000
      downPayment: 200000
      installmentsCount: 12
      installmentFrequency: "monthly"
      interestRate: 10.0
      durationMonths: 12
      isActive: true
      projectId: "1"
    }
  ) {
    id
    name
    slug
    totalPrice
    installmentsCount
  }
}
```

**Query Active Plans:**

```graphql
query GetPlans {
  plans(
    filter: { isActive: true }
    sort: { field: "durationMonths", order: "asc" }
  ) {
    edges {
      node {
        id
        name
        totalPrice
        downPayment
        installmentsCount
        interestRate
        durationMonths
      }
    }
  }
}
```

---

### DebtContract

Active debt contracts for customers.

#### Type Definition

```graphql
type DebtContract {
  id: ID!
  customerId: ID!
  planId: ID!
  guarantorId: ID
  agentId: ID
  productDescription: String
  startDate: DateTime!
  endDate: DateTime!
  status: String!
  totalAmount: Float!
  paidAmount: Float!
  remainingBalance: Float!
  transactionReference: String
  projectId: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime
  customer: DebtCustomer
  plan: Plan
  guarantor: Guarantor
  payments: [DebtPayment!]!
}
```

#### Enums

**Status:**
- `active` - Active contract
- `completed` - Contract fully paid
- `cancelled` - Contract cancelled
- `defaulted` - Contract in default

#### Service Bindings

When a contract is created, it automatically creates an invoice in the billing service:
- Service: `billing`
- Action: `create_invoice`
- Invoice Number: `DEBT-{contract_id}`
- Async execution with retry

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Queries

**Create Debt Contract:**

```graphql
mutation CreateContract {
  createDebtContract(
    input: {
      customerId: "1"
      planId: "1"
      guarantorId: "1"
      agentId: "5"
      productDescription: "iPhone 15 Pro Max - 256GB"
      startDate: "2024-01-01T00:00:00Z"
      endDate: "2025-01-01T00:00:00Z"
      status: "active"
      totalAmount: 1500000
      paidAmount: 200000
      remainingBalance: 1300000
      projectId: "1"
    }
  ) {
    id
    status
    totalAmount
    remainingBalance
    customer {
      firstName
      lastName
    }
  }
}
```

**Query Active Contracts:**

```graphql
query GetContracts {
  debtContracts(
    filter: {
      status: "active"
      customerId: "1"
    }
    sort: { field: "startDate", order: "desc" }
  ) {
    edges {
      node {
        id
        productDescription
        startDate
        endDate
        totalAmount
        paidAmount
        remainingBalance
        status
        customer {
          firstName
          lastName
          phoneNumber
        }
        plan {
          name
          installmentsCount
        }
      }
    }
    totalCount
  }
}
```

**Update Contract Payment:**

```graphql
mutation UpdateContract {
  updateDebtContract(
    id: "1"
    input: {
      paidAmount: 400000
      remainingBalance: 1100000
      status: "active"
    }
  ) {
    id
    paidAmount
    remainingBalance
    status
  }
}
```

---

### DebtPayment

Payment schedule and tracking for debt contracts.

#### Type Definition

```graphql
type DebtPayment {
  id: ID!
  contractId: ID!
  dueDate: DateTime!
  amount: Float!
  principal: Float!
  interest: Float!
  status: String!
  paymentDate: DateTime
  receiptId: String
  paymentMethod: String
  discountAmount: Float
  discountReason: String
  notes: String
  projectId: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime
  contract: DebtContract
}
```

#### Enums

**Status:**
- `pending` - Payment pending
- `paid` - Payment completed
- `late` - Payment is late
- `deferred` - Payment deferred
- `cancelled` - Payment cancelled
- `discounted` - Payment with discount

**Payment Method:**
- `cash` - Cash payment
- `credit_card` - Credit card
- `bank_transfer` - Bank transfer
- `check` - Check payment

#### Service Bindings

When payment status changes to `paid`, it creates a transaction in billing service:
- Service: `billing`
- Action: `create_transaction`
- Transaction Type: `payment`
- Condition: `status == 'paid'`
- Async execution with retry

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Queries

**Create Payment Schedule:**

```graphql
mutation CreatePayment {
  createDebtPayment(
    input: {
      contractId: "1"
      dueDate: "2024-02-01T00:00:00Z"
      amount: 125000
      principal: 100000
      interest: 25000
      status: "pending"
      projectId: "1"
    }
  ) {
    id
    dueDate
    amount
    status
  }
}
```

**Process Payment:**

```graphql
mutation ProcessPayment {
  updateDebtPayment(
    id: "1"
    input: {
      status: "paid"
      paymentDate: "2024-02-01T10:30:00Z"
      paymentMethod: "cash"
      receiptId: "RCPT-2024-001"
      notes: "Payment received at branch"
    }
  ) {
    id
    status
    paymentDate
    paymentMethod
    receiptId
    contract {
      remainingBalance
      status
    }
  }
}
```

**Query Upcoming Payments:**

```graphql
query GetUpcomingPayments {
  debtPayments(
    filter: {
      status: "pending"
      contractId: "1"
    }
    sort: { field: "dueDate", order: "asc" }
  ) {
    edges {
      node {
        id
        dueDate
        amount
        principal
        interest
        status
        contract {
          customer {
            firstName
            lastName
            phoneNumber
          }
        }
      }
    }
  }
}
```

**Query Overdue Payments:**

```graphql
query GetOverduePayments {
  debtPayments(
    filter: { status: "late" }
    sort: { field: "dueDate", order: "asc" }
  ) {
    edges {
      node {
        id
        dueDate
        amount
        daysOverdue: calculateDaysOverdue(dueDate: $dueDate)
        contract {
          id
          customer {
            firstName
            lastName
            phoneNumber
          }
        }
      }
    }
  }
}
```

---

### DebtOrder

Debt order requests (before contract approval).

#### Type Definition

```graphql
type DebtOrder {
  id: ID!
  customerId: ID!
  contractId: ID
  agentId: ID
  guarantorId: ID
  totalAmount: Float!
  totalPeriod: Int!
  profit: Float!
  downPayment: Float!
  status: String!
  note: String
  projectId: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime
  customer: DebtCustomer
  guarantor: Guarantor
  orderProducts: [DebtOrderProduct!]!
}
```

#### Enums

**Status:**
- `pending` - Order pending approval
- `approved` - Order approved
- `rejected` - Order rejected
- `completed` - Order completed

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_user, project_owner, admin |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Queries

**Create Debt Order:**

```graphql
mutation CreateOrder {
  createDebtOrder(
    input: {
      customerId: "1"
      guarantorId: "1"
      agentId: "5"
      totalAmount: 1500000
      totalPeriod: 12
      profit: 150000
      downPayment: 200000
      status: "pending"
      note: "Customer wants 12-month installment plan"
      projectId: "1"
    }
  ) {
    id
    status
    totalAmount
    customer {
      firstName
      lastName
    }
  }
}
```

**Approve Order:**

```graphql
mutation ApproveOrder {
  updateDebtOrder(
    id: "1"
    input: {
      status: "approved"
      contractId: "5"
    }
  ) {
    id
    status
    contractId
  }
}
```

---

### DebtOrderProduct

Products included in debt orders.

#### Type Definition

```graphql
type DebtOrderProduct {
  id: ID!
  orderId: ID!
  productId: ID!
  variantId: ID
  quantity: Int!
  unitPrice: Float!
  specification: String
  projectId: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime
  order: DebtOrder
}
```

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_user, project_owner, admin |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Queries

**Add Product to Order:**

```graphql
mutation AddOrderProduct {
  createDebtOrderProduct(
    input: {
      orderId: "1"
      productId: "123"
      variantId: "456"
      quantity: 1
      unitPrice: 1500000
      specification: "iPhone 15 Pro Max - 256GB - Blue Titanium"
      projectId: "1"
    }
  ) {
    id
    productId
    quantity
    unitPrice
  }
}
```

**Get Order Products:**

```graphql
query GetOrderProducts {
  debtOrderProducts(
    filter: { orderId: "1" }
  ) {
    edges {
      node {
        id
        productId
        variantId
        quantity
        unitPrice
        specification
      }
    }
  }
}
```

---

### Alert

Payment alerts and notifications system.

#### Type Definition

```graphql
type Alert {
  id: ID!
  alertType: String!
  customerId: ID!
  contractId: ID
  paymentId: ID
  title: String!
  message: String!
  severity: String!
  priority: String!
  status: String!
  acknowledgedAt: DateTime
  acknowledgedBy: ID
  resolvedAt: DateTime
  resolvedBy: ID
  triggeredBy: String!
  dueDate: DateTime
  amount: Float
  daysUntilDue: Int
  metadata: String
  projectId: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime
  customer: DebtCustomer
  contract: DebtContract
  payment: DebtPayment
}
```

#### Enums

**Alert Type:**
- `payment_due` - Payment due soon
- `payment_overdue` - Payment is overdue
- `payment_received` - Payment received
- `low_credit_score` - Customer credit score dropped
- `contract_created` - New contract created
- `contract_completed` - Contract fully paid
- `contract_defaulted` - Contract in default

**Severity:**
- `critical` - Critical alert
- `high` - High severity
- `medium` - Medium severity
- `low` - Low severity
- `info` - Informational

**Priority:**
- `high` - High priority
- `medium` - Medium priority
- `low` - Low priority

**Status:**
- `new` - New alert
- `acknowledged` - Alert acknowledged
- `resolved` - Alert resolved
- `ignored` - Alert ignored

**Trigger Source:**
- `system` - Automatic system trigger
- `admin` - Created by admin
- `scheduled_job` - Scheduled job trigger
- `manual` - Manual entry

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin (system) |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Queries

**Query Active Alerts:**

```graphql
query GetAlerts {
  alerts(
    filter: {
      status: "new"
      severity: "critical"
    }
    sort: { field: "createdAt", order: "desc" }
  ) {
    edges {
      node {
        id
        alertType
        title
        message
        severity
        priority
        dueDate
        amount
        daysUntilDue
        customer {
          firstName
          lastName
          phoneNumber
        }
      }
    }
  }
}
```

**Acknowledge Alert:**

```graphql
mutation AcknowledgeAlert {
  updateAlert(
    id: "1"
    input: {
      status: "acknowledged"
      acknowledgedBy: "5"
    }
  ) {
    id
    status
    acknowledgedAt
  }
}
```

**Resolve Alert:**

```graphql
mutation ResolveAlert {
  updateAlert(
    id: "1"
    input: {
      status: "resolved"
      resolvedBy: "5"
    }
  ) {
    id
    status
    resolvedAt
  }
}
```

---

### AlertNotification

Notification delivery tracking for alerts.

#### Type Definition

```graphql
type AlertNotification {
  id: ID!
  alertId: ID!
  customerId: ID!
  notificationChannel: String!
  recipient: String!
  status: String!
  sentAt: DateTime
  deliveredAt: DateTime
  readAt: DateTime
  deliveryResponse: String
  errorMessage: String
  retryCount: Int!
  lastRetryAt: DateTime
  externalId: String
  projectId: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime
  alert: Alert
  customer: DebtCustomer
}
```

#### Enums

**Notification Channel:**
- `email` - Email notification
- `sms` - SMS notification
- `push` - Push notification
- `in_app` - In-app notification
- `webhook` - Webhook notification

**Status:**
- `pending` - Pending delivery
- `sent` - Sent to provider
- `delivered` - Successfully delivered
- `failed` - Delivery failed
- `bounced` - Bounced by provider
- `read` - Read by recipient

#### Permissions

| Operation | Roles |
|-----------|-------|
| Create | project_owner, admin (system) |
| Read | project_user, project_owner, admin |
| Update | project_owner, admin |
| Delete | project_owner, admin |

#### Example Queries

**Query Notification Status:**

```graphql
query GetNotifications {
  alertNotifications(
    filter: {
      alertId: "1"
      status: "delivered"
    }
    sort: { field: "sentAt", order: "desc" }
  ) {
    edges {
      node {
        id
        notificationChannel
        recipient
        status
        sentAt
        deliveredAt
        deliveryResponse
        retryCount
      }
    }
  }
}
```

---

## Common Operations

### Filtering

```graphql
query FilterContracts {
  debtContracts(
    filter: {
      status: "active"
      customerId: "1"
      startDate: { gte: "2024-01-01T00:00:00Z" }
      totalAmount: { gte: 1000000, lte: 2000000 }
    }
  ) {
    edges {
      node {
        id
        status
        totalAmount
      }
    }
  }
}
```

**Filter Operators:**
- `eq` - Equals
- `ne` - Not equals
- `gt` - Greater than
- `gte` - Greater than or equal
- `lt` - Less than
- `lte` - Less than or equal
- `like` - Contains (string)
- `in` - In list
- `nin` - Not in list

### Sorting

```graphql
query SortPayments {
  debtPayments(
    sort: [
      { field: "dueDate", order: "asc" }
      { field: "amount", order: "desc" }
    ]
  ) {
    edges {
      node {
        id
        dueDate
        amount
      }
    }
  }
}
```

### Search

```graphql
query SearchCustomers {
  debtCustomers(
    search: "Ahmed Baghdad"
    first: 10
  ) {
    edges {
      node {
        id
        firstName
        lastName
        address
      }
    }
  }
}
```

### Pagination

```graphql
query PaginateContracts {
  debtContracts(
    first: 20
    after: "eyJpZCI6IjEwIn0="
  ) {
    edges {
      cursor
      node {
        id
        totalAmount
        status
      }
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

---

## Testing

### Test Setup

```bash
# Set environment variables
export DEBT_GRAPHQL_URL="http://localhost:4011/graphql"
export JWT_TOKEN="your_jwt_token_here"
```

### Test Customer Creation

```bash
curl -X POST $DEBT_GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "query": "mutation { createDebtCustomer(input: { firstName: \"Test\", lastName: \"Customer\", phoneNumber: \"+9647700000000\", nationalId: \"1234567890\", sex: \"male\", status: \"active\", projectId: \"1\" }) { id firstName lastName } }"
  }'
```

### Test Query

```bash
curl -X POST $DEBT_GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "query": "query { debtCustomers(first: 10) { edges { node { id firstName lastName status } } totalCount } }"
  }'
```

### Test Payment Creation

```bash
curl -X POST $DEBT_GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "query": "mutation { createDebtPayment(input: { contractId: \"1\", dueDate: \"2024-02-01T00:00:00Z\", amount: 125000, principal: 100000, interest: 25000, status: \"pending\", projectId: \"1\" }) { id dueDate amount status } }"
  }'
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
      "extensions": {
        "code": "AUTH_REQUIRED"
      }
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
      "extensions": {
        "code": "PERMISSION_DENIED"
      }
    }
  ]
}
```

**Validation Error:**

```json
{
  "errors": [
    {
      "message": "national_id: Debt customer with this national id already exists.",
      "extensions": {
        "code": "VALIDATION_ERROR",
        "field": "national_id"
      }
    }
  ]
}
```

---

## Best Practices

### 1. Always Filter by Project

```graphql
query GetProjectData {
  debtCustomers(
    filter: { projectId: "1" }
  ) {
    edges {
      node {
        id
        firstName
        lastName
      }
    }
  }
}
```

### 2. Use Specific Fields

```graphql
# Good - specific fields
query {
  debtCustomers {
    edges {
      node {
        id
        firstName
        lastName
      }
    }
  }
}

# Avoid - asking for everything
query {
  debtCustomers {
    edges {
      node {
        ...allFields  # Don't do this
      }
    }
  }
}
```

### 3. Batch Queries

```graphql
query BatchQueries {
  customers: debtCustomers(first: 10) {
    edges {
      node {
        id
        firstName
      }
    }
  }
  contracts: debtContracts(first: 10) {
    edges {
      node {
        id
        status
      }
    }
  }
  plans: plans(first: 10) {
    edges {
      node {
        id
        name
      }
    }
  }
}
```

### 4. Use Fragments for Reusable Fields

```graphql
fragment CustomerInfo on DebtCustomer {
  id
  firstName
  lastName
  phoneNumber
  nationalId
  status
}

query {
  debtCustomers(first: 10) {
    edges {
      node {
        ...CustomerInfo
      }
    }
  }
}
```

---

## Related Documentation

- [Authentication](/api/auth/oauth.md) - JWT authentication guide
- [API Gateway](/api/infra/gateway.md) - API gateway configuration
- [GraphQL Overview](/api/graphql/overview.md) - GraphQL concepts and patterns

---

## Support

For issues or questions:
- Email: support@zonevast.com
- Documentation: https://docs.zonevast.com
- Status Page: https://status.zonevast.com
