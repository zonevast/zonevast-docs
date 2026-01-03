# Debt GraphQL

## Endpoint

```
https://test.zonevast.com/graphql/debt
```

## Authentication

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Example Queries

### Get All Debts

```graphql
query GetDebts($status: DebtStatus, $first: Int, $after: String) {
  debts(status: $status, first: $first, after: $after) {
    edges {
      node {
        id
        debtNumber
        type
        status
        amount
        paidAmount
        remainingAmount
        customer {
          id
          name
          email
          phone
        }
        dueDate
        overdueDays
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

### Get Single Debt

```graphql
query GetDebt($id: ID!) {
  debt(id: $id) {
    id
    debtNumber
    type
    status
    amount
    paidAmount
    remainingAmount
    customer {
      id
      name
      email
      phone
      addresses {
        addressLine1
        city
        state
        postalCode
      }
    }
    order {
      id
      orderNumber
    }
    invoice {
      id
      invoiceNumber
    }
    dueDate
    paidDate
    overdueDays
    paymentSchedule {
      id
      dueDate
      amount
      status
      paidDate
    }
    notes
    metadata
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

### Get Customer Debts

```graphql
query GetCustomerDebts($customerId: ID!, $status: DebtStatus) {
  customerDebts(customerId: $customerId, status: $status) {
    id
    debtNumber
    type
    status
    amount
    remainingAmount
    dueDate
    overdueDays
  }
  customerDebtSummary(customerId: $customerId) {
    totalDebt
    totalPaid
    totalRemaining
    overdueCount
    overdueAmount
  }
}
```

**Variables:**
```json
{
  "customerId": "456",
  "status": "OVERDUE"
}
```

### Get Overdue Debts

```graphql
query GetOverdueDebts($days: Int) {
  overdueDebts(days: $days) {
    id
    debtNumber
    amount
    remainingAmount
    customer {
      name
      email
      phone
    }
    dueDate
    overdueDays
    lastPaymentDate
  }
}
```

**Variables:**
```json
{
  "days": 30
}
```

### Get Debt Payments

```graphql
query GetDebtPayments($debtId: ID!) {
  debt(id: $debtId) {
    id
    debtNumber
    amount
    remainingAmount
  }
  debtPayments(debtId: $debtId) {
    id
    amount
    paymentMethod
    transactionId
    notes
    createdAt
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
  "debtId": "123"
}
```

### Get Debt Analytics

```graphql
query GetDebtAnalytics($startDate: DateTime!, $endDate: DateTime!) {
  debtAnalytics(startDate: $startDate, endDate: $endDate) {
    totalDebtAmount
    totalCollected
    totalOutstanding
    overdueAmount
    collectionRate
    averageCollectionTime
    debtsByStatus {
      status
      count
      amount
    }
    debtsByType {
      type
      count
      amount
    }
    topDebtors {
      customer {
        id
        name
      }
      totalDebt
      overdueAmount
    }
  }
}
```

### Search Debts

```graphql
query SearchDebts($searchTerm: String!) {
  searchDebts(searchTerm: $searchTerm) {
    id
    debtNumber
    customer {
      name
      email
    }
    amount
    remainingAmount
    status
    dueDate
  }
}
```

**Variables:**
```json
{
  "searchTerm": "john"
}
```

### Get Payment Schedule

```graphql
query GetPaymentSchedule($debtId: ID!) {
  debt(id: $debtId) {
    id
    debtNumber
    amount
    paymentSchedule {
      id
      installmentNumber
      dueDate
      amount
      status
      paidDate
      paymentMethod
    }
  }
}
```

**Variables:**
```json
{
  "debtId": "123"
}
```

## Example Mutations

### Create Debt

```graphql
mutation CreateDebt($input: CreateDebtInput!) {
  createDebt(input: $input) {
    debt {
      id
      debtNumber
      type
      amount
      customer {
        name
      }
      dueDate
      status
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
    "type": "CREDIT_SALE",
    "amount": 1500.00,
    "dueDate": "2024-02-15T23:59:59Z",
    "orderId": "ORDER-123",
    "invoiceId": "INV-456",
    "notes": "Credit sale for bulk order"
  }
}
```

### Create Debt with Payment Schedule

```graphql
mutation CreateScheduledDebt($input: CreateScheduledDebtInput!) {
  createScheduledDebt(input: $input) {
    debt {
      id
      debtNumber
      amount
      paymentSchedule {
        id
        installmentNumber
        dueDate
        amount
        status
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
    "type": "INSTALLMENT",
    "amount": 3000.00,
    "numberOfInstallments": 6,
    "frequency": "MONTHLY",
    "startDate": "2024-01-15T23:59:59Z",
    "notes": "6-month installment plan"
  }
}
```

### Record Payment

```graphql
mutation RecordPayment($input: RecordPaymentInput!) {
  recordPayment(input: $input) {
    payment {
      id
      amount
      paymentMethod
      transactionId
      createdAt
    }
    debt {
      id
      debtNumber
      amount
      paidAmount
      remainingAmount
      status
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
    "debtId": "123",
    "amount": 500.00,
    "paymentMethod": "CASH",
    "transactionId": "TXN-789",
    "notes": "Monthly payment",
    "paymentDate": "2024-01-15T10:00:00Z"
  }
}
```

### Update Debt Status

```graphql
mutation UpdateDebtStatus($input: UpdateDebtStatusInput!) {
  updateDebtStatus(input: $input) {
    debt {
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
    "debtId": "123",
    "status": "PAID",
    "notes": "Full payment received"
  }
}
```

### Write Off Debt

```graphql
mutation WriteOffDebt($input: WriteOffDebtInput!) {
  writeOffDebt(input: $input) {
    debt {
      id
      status
      remainingAmount
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
    "debtId": "123",
    "reason": "Uncollectible debt after multiple attempts",
    "writeOffAmount": 500.00
  }
}
```

### Update Payment Schedule

```graphql
mutation UpdatePaymentSchedule($input: UpdateScheduleInput!) {
  updatePaymentSchedule(input: $input) {
    debt {
      id
      paymentSchedule {
        id
        installmentNumber
        dueDate
        amount
        status
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
    "debtId": "123",
    "scheduleItems": [
      {
        "id": "SCH-1",
        "newDueDate": "2024-02-01T23:59:59Z",
        "notes": "Rescheduled per customer request"
      }
    ]
  }
}
```

### Add Debt Note

```graphql
mutation AddDebtNote($input: AddNoteInput!) {
  addDebtNote(input: $input) {
    debt {
      id
      notes
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
    "debtId": "123",
    "note": "Customer contacted, promised payment by end of month",
    "isInternal": true
  }
}
```

### Send Payment Reminder

```graphql
mutation SendPaymentReminder($debtId: ID!) {
  sendPaymentReminder(debtId: $debtId) {
    success
    reminder {
      id
      sentAt
      method
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
  "debtId": "123"
}
```

### Refund Payment

```graphql
mutation RefundPayment($input: RefundPaymentInput!) {
  refundPayment(input: $input) {
    refund {
      id
      amount
      reason
      createdAt
    }
    debt {
      id
      paidAmount
      remainingAmount
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
    "paymentId": "PAY-123",
    "amount": 200.00,
    "reason": "Payment processed in error"
  }
}
```

## Subscriptions

### Debt Created

```graphql
subscription OnDebtCreated {
  debtCreated {
    debt {
      id
      debtNumber
      customer {
        name
      }
      amount
      type
    }
  }
}
```

### Payment Received

```graphql
subscription OnPaymentReceived($debtId: ID) {
  paymentReceived(debtId: $debtId) {
    payment {
      id
      amount
      paymentMethod
    }
    debt {
      id
      debtNumber
      remainingAmount
      status
    }
  }
}
```

### Debt Overdue

```graphql
subscription OnDebtOverdue {
  debtOverdue {
    debt {
      id
      debtNumber
      customer {
        name
        email
        phone
      }
      amount
      dueDate
      overdueDays
    }
  }
}
```

## Common Use Cases

### Customer Debt Statement

```graphql
query GetCustomerDebtStatement($customerId: ID!) {
  customer(id: $customerId) {
    id
    name
    email
  }
  customerDebts(customerId: $customerId) {
    id
    debtNumber
    type
    amount
    paidAmount
    remainingAmount
    dueDate
    status
  }
  customerDebtSummary(customerId: $customerId) {
    totalDebt
    totalPaid
    totalRemaining
    overdueCount
    overdueAmount
  }
}
```

### Collections Report

```graphql
query GetCollectionsReport($startDate: DateTime!, $endDate: DateTime!) {
  collectionsReport(startDate: $startDate, endDate: $endDate) {
    totalDebts
    totalAmount
    collectedAmount
    overdueAmount
    writtenOffAmount
    collectionRate
    averageDaysToCollect
    byType {
      type
      totalAmount
      collectedAmount
      collectionRate
    }
  }
}
```

### Aging Report

```graphql
query GetAgingReport {
  agingReport {
    current {
      count
      amount
    }
    days1To30 {
      count
      amount
    }
    days31To60 {
      count
      amount
    }
    days61To90 {
      count
      amount
    }
    over90Days {
      count
      amount
    }
  }
}
```

### Payment History

```graphql
query GetPaymentHistory($debtId: ID!) {
  debt(id: $debtId) {
    id
    debtNumber
    amount
    remainingAmount
  }
  debtPayments(debtId: $debtId) {
    id
    amount
    paymentMethod
    transactionId
    notes
    createdAt
    performedBy {
      username
    }
  }
}
```

### Installment Tracking

```graphql
query GetInstallmentTracking($debtId: ID!) {
  debt(id: $debtId) {
    id
    debtNumber
    amount
    paymentSchedule {
      id
      installmentNumber
      dueDate
      amount
      status
      paidDate
      overdueDays
    }
  }
  installmentSummary(debtId: $debtId) {
    totalInstallments
    paidInstallments
    pendingInstallments
    overdueInstallments
    nextPayment {
      installmentNumber
      dueDate
      amount
    }
  }
}
```
