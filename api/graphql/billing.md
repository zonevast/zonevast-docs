# Billing GraphQL API Reference

Auto-API GraphQL service for billing operations, invoicing, subscriptions, and payment processing.

## Base URL

```
Production: https://api.zonevast.com/graphql/billing/v1/graphql
Test: https://test.zonevast.com/billing/graphql
Local: http://localhost:4003/graphql
```

## Authentication

All requests require JWT authentication via the `Authorization` header:

```bash
curl -X POST https://test.zonevast.com/billing/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{"query": "{ coupons { id key } }"}'
```

The `project_id` is automatically extracted from the JWT token - do not provide it manually.

## Data Models

### Coupon
Discount coupon model supporting percentage and fixed amount discounts with configurable validity periods and usage limits.

**Fields:**
- `id` (ID!) - Unique identifier
- `key` (String!) - The unique coupon code (e.g., "SUMMER25")
- `discountType` (String!) - Type: "percentage" or "fixed"
- `discountValue` (Float!) - Discount amount
- `startDate` (DateTime) - Coupon validity start date
- `endDate` (DateTime) - Coupon validity end date
- `usageLimit` (Int) - Maximum times coupon can be used (default: 1)
- `usageLimitPerCustomer` (Int) - Max uses per customer (default: 1)
- `isActive` (Boolean) - Whether coupon is active (default: true)
- `description` (String) - Coupon description
- `minimumPurchaseAmount` (Float) - Minimum purchase required (default: 0.0)
- `maximumDiscountAmount` (Float) - Maximum discount that can be applied (default: 0.0)
- `projectId` (Int!) - Project ID (from JWT)
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Update timestamp

**Permissions:**
- Create: `project_owner`, `admin`
- Read: `project_user`, `project_owner`, `admin`
- Update: `project_owner`, `admin`
- Delete: `project_owner`, `admin`

---

### Invoice
Invoice/billing record tracking pricing, discounts, taxes, shipping, and payment status.

**Fields:**
- `id` (ID!) - Unique identifier
- `price` (Float!) - Base price
- `discount` (Float) - Discount applied (default: 0.0)
- `tax` (Float) - Tax amount (default: 0.0)
- `shipping` (Float) - Shipping cost (default: 0.0)
- `total` (Float!) - Total amount
- `payment` (String) - Payment status: "PENDING", "PAID", "REFUNDED", "CANCELLED" (default: "PENDING")
- `profit` (Float) - Calculated profit (default: 0.0)
- `projectId` (Int!) - Project ID (from JWT)
- `deletedAt` (DateTime) - Soft delete timestamp
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Update timestamp

**Permissions:** Same as Coupon

---

### UserSubscription
Manages user subscriptions to catalog items/services with billing cycles and status tracking.

**Fields:**
- `id` (ID!) - Unique identifier
- `userId` (Int!) - User who owns this subscription
- `catalogItemId` (String!) - Catalog item UUID
- `catalogItemName` (String!) - Catalog item name for reference
- `catalogItemType` (String) - Type: service, system, template, etc.
- `subscriptionStatus` (String) - Status: "active", "paused", "cancelled", "expired", "pending" (default: "pending")
- `renewalPeriod` (String) - Billing cycle: "monthly", "quarterly", "yearly", "lifetime" (default: "monthly")
- `price` (Float) - Subscription price per period (default: 0.0)
- `currency` (String) - Currency code (default: "USD")
- `startDate` (DateTime!) - Subscription start date
- `endDate` (DateTime) - Subscription end date (null for ongoing)
- `nextBillingDate` (DateTime) - Next billing cycle date
- `lastInvoiceId` (Int) - Most recent invoice reference
- `notes` (String) - Additional notes
- `configuration` (JSON) - Subscription-specific settings
- `projectId` (Int!) - Project ID (from JWT)
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Update timestamp

**Permissions:** Same as Coupon

---

### PaymentMethod
Payment method model for storing customer payment options (cards, bank accounts, wallets).

**Fields:**
- `id` (ID!) - Unique identifier
- `customerId` (Int!) - Customer who owns this payment method
- `paymentType` (String!) - Type: "credit_card", "debit_card", "bank_account", "wallet", "cash"
- `cardLastFour` (String) - Last 4 digits of card
- `cardBrand` (String) - Card brand: Visa, Mastercard, etc.
- `cardExpiryMonth` (Int) - Card expiration month (1-12)
- `cardExpiryYear` (Int) - Card expiration year
- `bankName` (String) - Bank name for transfers
- `accountLastFour` (String) - Last 4 digits of account
- `billingAddress` (String) - Billing address
- `isDefault` (Boolean) - Whether this is the default method (default: false)
- `isVerified` (Boolean) - Whether method is verified (default: false)
- `isActive` (Boolean) - Whether method is active (default: true)
- `gatewayCustomerId` (String) - Customer ID in payment gateway (Stripe, PayPal)
- `gatewayPaymentMethodId` (String) - Payment method ID in gateway
- `projectId` (Int!) - Project ID (from JWT)
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Update timestamp

**Permissions:**
- Create: `project_user`, `project_owner`, `admin`
- Read: `project_user`, `project_owner`, `admin`
- Update: `project_user`, `project_owner`, `admin`
- Delete: `project_owner`, `admin`

---

### Transaction
Transaction model for tracking all financial transactions including payments, refunds, and adjustments.

**Fields:**
- `id` (ID!) - Unique identifier
- `transactionId` (String!) - Unique transaction identifier
- `transactionType` (String!) - Type: "payment", "refund", "adjustment", "chargeback"
- `amount` (Float!) - Transaction amount
- `currency` (String) - Currency code (default: "USD")
- `status` (String) - Status: "pending", "processing", "completed", "failed", "cancelled" (default: "pending")
- `invoiceId` (Int) - Associated invoice
- `paymentMethodId` (Int) - Payment method used
- `customerId` (Int) - Customer ID
- `gatewayName` (String) - Payment gateway: Stripe, PayPal, etc.
- `gatewayTransactionId` (String) - Transaction ID from gateway
- `gatewayResponse` (JSON) - Full gateway response
- `description` (String) - Transaction description
- `metadata` (JSON) - Additional metadata
- `transactionDate` (DateTime!) - When transaction occurred
- `processedDate` (DateTime) - When transaction was processed
- `errorCode` (String) - Error code if failed
- `errorMessage` (String) - Error message if failed
- `projectId` (Int!) - Project ID (from JWT)
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Update timestamp

**Permissions:** Same as PaymentMethod

## Example Queries

### List Coupons

```graphql
query GetCoupons {
  coupons(limit: 10, offset: 0) {
    id
    key
    discountType
    discountValue
    isActive
    usageLimit
  }
}
```

### Get Single Coupon

```graphql
query GetCoupon($id: ID!) {
  coupon(id: $id) {
    id
    key
    discountType
    discountValue
    startDate
    endDate
    minimumPurchaseAmount
    maximumDiscountAmount
  }
}
```

### List Invoices

```graphql
query GetInvoices {
  invoices(limit: 20) {
    id
    price
    discount
    tax
    shipping
    total
    payment
    profit
    createdAt
  }
}
```

### Get User Subscriptions

```graphql
query GetUserSubscriptions($userId: Int!) {
  userSubscriptions(where: "{\"userId\": $userId}") {
    id
    userId
    catalogItemName
    subscriptionStatus
    renewalPeriod
    price
    currency
    nextBillingDate
  }
}
```

### List Payment Methods

```graphql
query GetPaymentMethods($customerId: Int!) {
  paymentMethods(where: "{\"customerId\": $customerId}") {
    id
    customerId
    paymentType
    cardLastFour
    cardBrand
    isDefault
    isVerified
  }
}
```

### Search Coupons

```graphql
query SearchCoupons($searchTerm: String!) {
  coupons(search: $searchTerm) {
    id
    key
    discountValue
    isActive
  }
}
```

### Filter Active Coupons

```graphql
query GetActiveCoupons {
  coupons(where: "{\"isActive\": true}") {
    id
    key
    discountType
    discountValue
    endDate
  }
}
```

### Get Transactions by Invoice

```graphql
query GetInvoiceTransactions($invoiceId: Int!) {
  transactions(where: "{\"invoiceId\": $invoiceId}") {
    id
    transactionId
    transactionType
    amount
    status
    transactionDate
  }
}
```

## Example Mutations

### Create Coupon (Percentage)

```graphql
mutation CreatePercentageCoupon {
  createCoupon(input: {
    key: "SUMMER25"
    discountType: "percentage"
    discountValue: 25.0
    usageLimit: 100
    usageLimitPerCustomer: 1
    isActive: true
    description: "Summer sale discount"
    minimumPurchaseAmount: 50.0
    maximumDiscountAmount: 100.0
  }) {
    id
    key
    discountType
    discountValue
    projectId
  }
}
```

### Create Coupon (Fixed Amount)

```graphql
mutation CreateFixedCoupon {
  createCoupon(input: {
    key: "FLAT50"
    discountType: "fixed"
    discountValue: 50.0
    usageLimit: 50
    minimumPurchaseAmount: 100.0
    maximumDiscountAmount: 50.0
  }) {
    id
    key
    discountType
    discountValue
  }
}
```

### Create Coupon with Dates

```graphql
mutation CreateDatedCoupon {
  createCoupon(input: {
    key: "HOLIDAY30"
    discountType: "percentage"
    discountValue: 30.0
    startDate: "2025-01-01T00:00:00Z"
    endDate: "2025-12-31T23:59:59Z"
    usageLimit: 1000
  }) {
    id
    key
    startDate
    endDate
  }
}
```

### Create Invoice

```graphql
mutation CreateInvoice {
  createInvoice(input: {
    price: 100.0
    discount: 10.0
    tax: 8.5
    shipping: 5.0
    total: 103.5
    payment: "PENDING"
  }) {
    id
    price
    discount
    total
    payment
    projectId
  }
}
```

### Create User Subscription

```graphql
mutation CreateSubscription {
  createUserSubscription(input: {
    userId: 88
    catalogItemId: "catalog-premium-plan"
    catalogItemName: "Premium Plan"
    catalogItemType: "service"
    subscriptionStatus: "active"
    renewalPeriod: "monthly"
    price: 49.0
    currency: "USD"
    startDate: "2025-01-12T00:00:00Z"
    nextBillingDate: "2025-02-12T00:00:00Z"
    lastInvoiceId: 1
  }) {
    id
    userId
    catalogItemName
    subscriptionStatus
    renewalPeriod
    price
    nextBillingDate
  }
}
```

### Create Payment Method (Credit Card)

```graphql
mutation CreatePaymentMethod {
  createPaymentMethod(input: {
    customerId: 501
    paymentType: "credit_card"
    cardLastFour: "4242"
    cardBrand: "VISA"
    cardExpiryMonth: 12
    cardExpiryYear: 2026
    billingAddress: "123 Main St, City, Country"
    isDefault: true
  }) {
    id
    customerId
    paymentType
    cardLastFour
    cardBrand
    isDefault
  }
}
```

### Create Payment Method (Bank Account)

```graphql
mutation CreateBankPaymentMethod {
  createPaymentMethod(input: {
    customerId: 501
    paymentType: "bank_account"
    bankName: "Chase Bank"
    accountLastFour: "6789"
    isDefault: false
  }) {
    id
    customerId
    paymentType
    bankName
    accountLastFour
  }
}
```

### Create Transaction

```graphql
mutation CreateTransaction {
  createTransaction(input: {
    transactionId: "TXN-001"
    transactionType: "payment"
    amount: 103.5
    currency: "USD"
    status: "completed"
    invoiceId: 1
    paymentMethodId: 1
    customerId: 501
    gatewayName: "Stripe"
    gatewayTransactionId: "ch_3abc123xyz"
    transactionDate: "2025-01-12T10:00:00Z"
    processedDate: "2025-01-12T10:01:00Z"
    description: "Payment for invoice #1"
  }) {
    id
    transactionId
    transactionType
    amount
    status
    gatewayName
  }
}
```

### Create Refund Transaction

```graphql
mutation CreateRefund {
  createTransaction(input: {
    transactionId: "REFUND-001"
    transactionType: "refund"
    amount: 50.0
    currency: "USD"
    status: "completed"
    invoiceId: 1
    customerId: 501
    gatewayName: "Stripe"
    transactionDate: "2025-01-15T10:00:00Z"
    description: "Partial refund for invoice #1"
  }) {
    id
    transactionId
    transactionType
    amount
    status
  }
}
```

### Update Coupon

```graphql
mutation UpdateCoupon($id: ID!) {
  updateCoupon(id: $id, input: {
    discountValue: 35.0
    isActive: false
  }) {
    id
    key
    discountValue
    isActive
  }
}
```

### Update Subscription

```graphql
mutation UpdateSubscription($id: ID!) {
  updateUserSubscription(id: $id, input: {
    subscriptionStatus: "paused"
    renewalPeriod: "yearly"
    nextBillingDate: "2026-01-12T00:00:00Z"
  }) {
    id
    subscriptionStatus
    renewalPeriod
    nextBillingDate
  }
}
```

### Update Payment Method

```graphql
mutation UpdatePaymentMethod($id: ID!) {
  updatePaymentMethod(id: $id, input: {
    isDefault: true
    isVerified: true
  }) {
    id
    isDefault
    isVerified
  }
}
```

### Delete Coupon

```graphql
mutation DeleteCoupon($id: ID!) {
  deleteCoupon(id: $id)
}
```

### Delete Invoice

```graphql
mutation DeleteInvoice($id: ID!) {
  deleteInvoice(id: $id)
}
```

## Common Workflows

### Apply Coupon to Invoice

```graphql
# Step 1: Create coupon
mutation CreateCoupon {
  createCoupon(input: {
    key: "SAVE10"
    discountType: "fixed"
    discountValue: 10.0
  }) {
    id
    key
    discountValue
  }
}

# Step 2: Create invoice with discount
mutation CreateInvoiceWithDiscount {
  createInvoice(input: {
    price: 100.0
    discount: 10.0  # Applied from coupon
    tax: 9.0
    total: 99.0
    payment: "PENDING"
  }) {
    id
    price
    discount
    total
  }
}
```

### Complete Payment Flow

```graphql
# Step 1: Create invoice
mutation CreateInvoice {
  createInvoice(input: {
    price: 200.0
    discount: 0.0
    tax: 16.0
    shipping: 10.0
    total: 226.0
    payment: "PENDING"
  }) {
    id
    total
  }
}

# Step 2: Create payment method
mutation CreatePaymentMethod {
  createPaymentMethod(input: {
    customerId: 501
    paymentType: "credit_card"
    cardLastFour: "4242"
    cardBrand: "VISA"
    isDefault: true
  }) {
    id
    cardLastFour
  }
}

# Step 3: Create transaction linking invoice and payment method
mutation CreateTransaction {
  createTransaction(input: {
    transactionId: "TXN-FLOW-001"
    transactionType: "payment"
    amount: 226.0
    currency: "USD"
    status: "completed"
    invoiceId: 1
    paymentMethodId: 1
    customerId: 501
    transactionDate: "2025-01-12T10:00:00Z"
  }) {
    id
    transactionId
    status
  }
}

# Step 4: Update invoice payment status
mutation UpdateInvoicePayment($id: ID!) {
  updateInvoice(id: $id, input: {
    payment: "PAID"
  }) {
    id
    payment
  }
}
```

### Subscription Renewal Flow

```graphql
# Step 1: Create initial subscription
mutation CreateSubscription {
  createUserSubscription(input: {
    userId: 88
    catalogItemId: "catalog-premium"
    catalogItemName: "Premium Plan"
    subscriptionStatus: "active"
    renewalPeriod: "monthly"
    price: 49.0
    currency: "USD"
    startDate: "2025-01-12T00:00:00Z"
  }) {
    id
    userId
    nextBillingDate
  }
}

# Step 2: Generate renewal invoice
mutation CreateRenewalInvoice {
  createInvoice(input: {
    price: 49.0
    discount: 0.0
    tax: 0.0
    total: 49.0
    payment: "PENDING"
  }) {
    id
    total
  }
}

# Step 3: Update subscription with new billing date
mutation RenewSubscription($id: ID!) {
  updateUserSubscription(id: $id, input: {
    lastInvoiceId: 2
    nextBillingDate: "2025-02-12T00:00:00Z"
  }) {
    id
    lastInvoiceId
    nextBillingDate
  }
}
```

## Pagination & Filtering

### Pagination
```graphql
query GetPaginatedCoupons($limit: Int, $offset: Int) {
  coupons(limit: $limit, offset: $offset) {
    id
    key
    discountValue
  }
}
```

### Advanced Filtering
```graphql
query FilterInvoices {
  invoices(where: "{\"payment\": \"PENDING\", \"total__gte\": 100}") {
    id
    total
    payment
  }
}
```

### Sorting
```graphql
query SortedTransactions {
  transactions(orderBy: "-transactionDate") {
    id
    amount
    transactionDate
  }
}
```

## Enum Values Reference

### Payment Status
- `PENDING` - Payment not yet received
- `PAID` - Payment successfully completed
- `REFUNDED` - Payment refunded
- `CANCELLED` - Payment cancelled

### Subscription Status
- `active` - Subscription is active
- `paused` - Subscription is paused
- `cancelled` - Subscription is cancelled
- `expired` - Subscription has expired
- `pending` - Subscription is pending activation

### Renewal Period
- `monthly` - Monthly billing cycle
- `quarterly` - Quarterly billing cycle
- `yearly` - Yearly billing cycle
- `lifetime` - One-time payment, no renewal

### Transaction Type
- `payment` - Incoming payment
- `refund` - Outgoing refund
- `adjustment` - Manual adjustment
- `chargeback` - Payment chargeback

### Transaction Status
- `pending` - Transaction pending
- `processing` - Transaction being processed
- `completed` - Transaction completed successfully
- `failed` - Transaction failed
- `cancelled` - Transaction cancelled

### Payment Method Type
- `credit_card` - Credit card
- `debit_card` - Debit card
- `bank_account` - Bank account transfer
- `wallet` - Digital wallet (PayPal, Apple Pay, etc.)
- `cash` - Cash payment

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
      "message": "Field 'key' is required",
      "extensions": { "code": "VALIDATION_ERROR" }
    }
  ]
}
```

### Duplicate Entry Error
```json
{
  "errors": [
    {
      "message": "Coupon with this key already exists",
      "extensions": { "code": "UNIQUE_CONSTRAINT_ERROR" }
    }
  ]
}
```

## Testing

Test the endpoint:

```bash
# Health check
curl -X POST https://test.zonevast.com/billing/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'

# With authentication (replace TOKEN)
curl -X POST https://test.zonevast.com/billing/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"query": "{ coupons { id key discountValue } }"}'

# Local testing
curl -X POST http://localhost:4003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"query": "mutation { createCoupon(input: {key: \"TEST20\", discountType: \"percentage\", discountValue: 20.0}) { id key } }"}'
```

## Deployment Information

- **AWS Region:** me-south-1
- **Runtime:** Python 3.11
- **Handler:** handler.lambda_handler
- **Lambda Function:** autoapi-billing-graphql-dev
- **Database Schema:** billing
- **JWT Secret:** Configured via environment
- **Default Port:** 4003 (local development)

## Notes

- All `projectId` values are extracted from JWT token - never include in mutations
- Coupon `key` field must be unique per project
- Invoice `total` should equal `price - discount + tax + shipping`
- UserSubscription uses `catalogItemId` as a string UUID reference
- Payment method sensitive data (card numbers) should be tokenized before storage
- Transaction records provide complete audit trail for all financial operations
- Use `where` parameter with JSON string for complex filtering
- Subscriptions can be renewed by updating `nextBillingDate` and `lastInvoiceId`
- Payment status transitions: PENDING → PAID → (optional) REFUNDED/CANCELLED
