# POS GraphQL API Reference

Point of Sale (POS) GraphQL microservice for handling in-store transactions, customer management, and returns.

**Service Details**
- **Service Name**: `pos`
- **Version**: `v1`
- **Default Port**: `4004`
- **Database Schema**: `pos`
- **Repository**: `/services/graphql/autoapi-projects/pos-graphql/`

**Base URLs**
- **Local (Direct)**: `http://localhost:4004/graphql`
- **Local (SAM Gateway)**: `http://localhost:3000/graphql/pos/en/v1/graphql`
- **Development**: `https://dev-api.zonevast.com/graphql/pos/en/v1/graphql`
- **Production**: `https://api.zonevast.com/graphql/pos/en/v1/graphql`

---

## Table of Contents

- [Models](#models)
  - [Address](#address)
  - [POSCustomer](#poscustomer)
  - [Sale](#sale)
  - [SaleReturn](#salereturn)
- [Authentication](#authentication)
- [Operations](#operations)
  - [Queries](#queries)
  - [Mutations](#mutations)
- [Features](#features)

---

## Models

### Address

Customer address model that can be reused across multiple customers.

**Table**: `addresses`

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Primary key |
| `governorate` | String | No | Governorate or state (searchable) |
| `cityMayor` | String | No | City mayor or district |
| `region` | String | No | Region or area (searchable) |
| `nearestLandmark` | String | No | Nearest landmark for reference (searchable) |
| `city` | String | No | City name (searchable) |
| `projectId` | Int | **Yes** | Reference to project (from JWT) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Permissions**: Open (no authentication required)

**Searchable Fields**: `city`, `region`, `governorate`, `nearestLandmark`

**Filterable Fields**: `project_id`, `city`, `region`, `governorate`

**Sortable Fields**: `created_at`, `updated_at`

**Default Ordering**: `-created_at` (newest first)

---

### POSCustomer

Customers who make purchases at physical POS locations. Can be walk-in or registered customers.

**Table**: `pos_customers`

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Primary key |
| `firstName` | String | No | Customer's first name (searchable) |
| `lastName` | String | No | Customer's last name (searchable) |
| `phoneNumber` | String | No | Customer's phone number (searchable) |
| `email` | String | No | Customer's email address |
| `sex` | String | No | Customer's gender (male, female) |
| `addressId` | Int | No | Reference to Address |
| `projectId` | Int | **Yes** | Reference to project (from JWT) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Relationships**:
- `address` → `Address` (many-to-one)

**Permissions**: Open (no authentication required)

**Searchable Fields**: `first_name`, `last_name`, `phone_number`, `email`

**Filterable Fields**: `project_id`, `sex`, `phone_number`, `address_id`

**Sortable Fields**: `created_at`, `first_name`, `last_name`

**Default Ordering**: `-created_at` (newest first)

---

### Sale

Point of Sale transactions tracking products sold, quantity, and pricing.

**Table**: `sales`

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Primary key |
| `status` | String | No | Sale status: `pending`, `processing`, `completed`, `canceled`, `returned` (default: `pending`) |
| `customerId` | Int | No | Reference to POSCustomer |
| `productId` | Int | **Yes** | Reference to product in product service |
| `quantity` | Int | No | Quantity sold (default: 1) |
| `unitPrice` | Float | **Yes** | Price per unit |
| `totalAmount` | Float | **Yes** | Total sale amount (quantity × unit_price) |
| `projectId` | Int | **Yes** | Reference to project (from JWT) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Relationships**:
- `customer` → `POSCustomer` (many-to-one)

**Permissions**: Open (no authentication required)

**Filterable Fields**: `status`, `project_id`, `customer_id`, `product_id`

**Searchable Fields**: `id`

**Sortable Fields**: `created_at`, `updated_at`, `status`, `total_amount`

**Default Ordering**: `-created_at` (newest first)

---

### SaleReturn

Returns for POS sales tracking returned items and refund amounts.

**Table**: `sale_returns`

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | ID | Auto | Primary key |
| `saleId` | Int | **Yes** | Reference to Sale being returned |
| `returnQuantity` | Int | No | Quantity being returned (default: 1) |
| `status` | String | No | Return status: `pending`, `processing`, `completed`, `canceled` (default: `pending`) |
| `reason` | String | **Yes** | Reason for return (searchable) |
| `refundAmount` | Float | **Yes** | Amount to refund |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Relationships**:
- `sale` → `Sale` (many-to-one)

**Permissions**: Open (no authentication required)

**Filterable Fields**: `status`, `sale_id`

**Searchable Fields**: `reason`

**Sortable Fields**: `created_at`, `updated_at`, `status`

**Default Ordering**: `-created_at` (newest first)

---

## Authentication

**Important**: `projectId` is automatically extracted from the JWT token and should NOT be included in mutation inputs.

### JWT Token Structure

```json
{
  "sub": "user_id",
  "username": "username",
  "email": "user@example.com",
  "project_id": 1,
  "exp": 1234567890
}
```

### Request Headers

```bash
# For authenticated requests
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Obtaining a Token

Get JWT tokens from the `zv-auth-service`:

```bash
# Local
curl -X POST http://localhost:8010/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Production
curl -X POST https://api.zonevast.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

---

## Operations

### Queries

#### Get Single Address

```graphql
query GetAddress($id: ID!) {
  address(id: $id) {
    id
    governorate
    cityMayor
    region
    nearestLandmark
    city
    projectId
    createdAt
  }
}
```

**Variables**:
```json
{
  "id": "1"
}
```

#### List Addresses

```graphql
query GetAddresses($limit: Int, $offset: Int, $search: String, $where: JSONString) {
  addresses(limit: $limit, offset: $offset, search: $search, where: $where) {
    id
    city
    region
    governorate
    createdAt
  }
}
```

**Variables**:
```json
{
  "limit": 10,
  "offset": 0,
  "search": "Cairo",
  "where": "{\"city\": \"Cairo\"}"
}
```

#### Get Single Customer

```graphql
query GetPosCustomer($id: ID!) {
  posCustomer(id: $id) {
    id
    firstName
    lastName
    phoneNumber
    email
    sex
    addressId
    address {
      id
      city
      region
    }
    projectId
    createdAt
  }
}
```

#### List Customers

```graphql
query GetPosCustomers($limit: Int, $offset: Int, $search: String, $where: JSONString) {
  posCustomers(limit: $limit, offset: $offset, search: $search, where: $where) {
    id
    firstName
    lastName
    phoneNumber
    email
    sex
    createdAt
  }
}
```

**Variables**:
```json
{
  "limit": 20,
  "offset": 0,
  "search": "Ahmed",
  "where": "{\"sex\": \"male\"}"
}
```

#### Get Single Sale

```graphql
query GetSale($id: ID!) {
  sale(id: $id) {
    id
    status
    customerId
    customer {
      id
      firstName
      lastName
      phoneNumber
    }
    productId
    quantity
    unitPrice
    totalAmount
    projectId
    createdAt
  }
}
```

#### List Sales

```graphql
query GetSales($limit: Int, $offset: Int, $where: JSONString) {
  sales(limit: $limit, offset: $offset, where: $where) {
    id
    status
    productId
    quantity
    totalAmount
    customer {
      id
      firstName
      lastName
    }
    createdAt
  }
}
```

**Variables**:
```json
{
  "limit": 25,
  "offset": 0,
  "where": "{\"status\": \"completed\"}"
}
```

#### Get Single Sale Return

```graphql
query GetSaleReturn($id: ID!) {
  saleReturn(id: $id) {
    id
    saleId
    sale {
      id
      productId
      totalAmount
    }
    returnQuantity
    status
    reason
    refundAmount
    createdAt
  }
}
```

#### List Sale Returns

```graphql
query GetSaleReturns($limit: Int, $offset: Int, $where: JSONString) {
  saleReturns(limit: $limit, offset: $offset, where: $where) {
    id
    saleId
    returnQuantity
    status
    reason
    refundAmount
    createdAt
  }
}
```

---

### Mutations

#### Create Address

```graphql
mutation CreateAddress($input: AddressInput!) {
  createAddress(input: $input) {
    id
    governorate
    cityMayor
    region
    nearestLandmark
    city
    projectId
    createdAt
  }
}
```

**Variables**:
```json
{
  "input": {
    "governorate": "Cairo",
    "cityMayor": "Nasr City",
    "region": "District 1",
    "nearestLandmark": "Near City Stars Mall",
    "city": "Cairo"
  }
}
```

**Note**: `projectId` is automatically added from JWT token.

#### Update Address

```graphql
mutation UpdateAddress($id: ID!, $input: AddressInput!) {
  updateAddress(id: $id, input: $input) {
    id
    city
    region
    updatedAt
  }
}
```

**Variables**:
```json
{
  "id": "1",
  "input": {
    "city": "Giza",
    "region": "District 2"
  }
}
```

#### Delete Address

```graphql
mutation DeleteAddress($id: ID!) {
  deleteAddress(id: $id)
}
```

---

#### Create Customer

```graphql
mutation CreatePosCustomer($input: PosCustomerInput!) {
  createPosCustomer(input: $input) {
    id
    firstName
    lastName
    phoneNumber
    email
    sex
    addressId
    projectId
    createdAt
  }
}
```

**Variables** (Minimal):
```json
{
  "input": {
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Variables** (Full):
```json
{
  "input": {
    "firstName": "Jane",
    "lastName": "Smith",
    "phoneNumber": "+1234567890",
    "email": "jane.smith@example.com",
    "sex": "female",
    "addressId": 1
  }
}
```

#### Update Customer

```graphql
mutation UpdatePosCustomer($id: ID!, $input: PosCustomerInput!) {
  updatePosCustomer(id: $id, input: $input) {
    id
    firstName
    lastName
    phoneNumber
    email
    updatedAt
  }
}
```

**Variables**:
```json
{
  "id": "1",
  "input": {
    "firstName": "Updated",
    "lastName": "Customer",
    "phoneNumber": "+9876543210"
  }
}
```

#### Delete Customer

```graphql
mutation DeletePosCustomer($id: ID!) {
  deletePosCustomer(id: $id)
}
```

---

#### Create Sale

```graphql
mutation CreateSale($input: SaleInput!) {
  createSale(input: $input) {
    id
    status
    customerId
    productId
    quantity
    unitPrice
    totalAmount
    projectId
    createdAt
  }
}
```

**Variables** (Minimal):
```json
{
  "input": {
    "productId": 1,
    "quantity": 1,
    "unitPrice": 99.99,
    "totalAmount": 99.99
  }
}
```

**Variables** (With Customer):
```json
{
  "input": {
    "productId": 2,
    "customerId": 1,
    "quantity": 2,
    "unitPrice": 50.0,
    "totalAmount": 100.0,
    "status": "pending"
  }
}
```

#### Update Sale

```graphql
mutation UpdateSale($id: ID!, $input: SaleInput!) {
  updateSale(id: $id, input: $input) {
    id
    status
    quantity
    totalAmount
    updatedAt
  }
}
```

**Variables** (Update Status):
```json
{
  "id": "1",
  "input": {
    "status": "completed"
  }
}
```

**Variables** (Update Quantity):
```json
{
  "id": "1",
  "input": {
    "quantity": 3,
    "totalAmount": 150.0
  }
}
```

#### Delete Sale

```graphql
mutation DeleteSale($id: ID!) {
  deleteSale(id: $id)
}
```

---

#### Create Sale Return

```graphql
mutation CreateSaleReturn($input: SaleReturnInput!) {
  createSaleReturn(input: $input) {
    id
    saleId
    sale {
      id
      productId
      totalAmount
    }
    returnQuantity
    status
    reason
    refundAmount
    createdAt
  }
}
```

**Variables**:
```json
{
  "input": {
    "saleId": 1,
    "returnQuantity": 1,
    "status": "pending",
    "reason": "Product damaged upon delivery",
    "refundAmount": 99.99
  }
}
```

#### Update Sale Return

```graphql
mutation UpdateSaleReturn($id: ID!, $input: SaleReturnInput!) {
  updateSaleReturn(id: $id, input: $input) {
    id
    status
    refundAmount
    updatedAt
  }
}
```

**Variables**:
```json
{
  "id": "1",
  "input": {
    "status": "completed",
    "refundAmount": 99.99
  }
}
```

#### Delete Sale Return

```graphql
mutation DeleteSaleReturn($id: ID!) {
  deleteSaleReturn(id: $id)
}
```

---

## Features

### Enabled Features

- **Soft Delete**: Records are marked as deleted instead of being permanently removed
- **Audit Log**: Automatic tracking of creation and modification timestamps
- **Search**: Full-text search across searchable fields
- **Filtering**: Advanced filtering using `where` parameter with JSON criteria
- **Sorting**: Sort results using `orderBy` parameter
- **Pagination**: Use `limit` and `offset` for pagination (NOT `first`/`skip`)
- **Analytics**: Built-in analytics endpoints

### Disabled Features

- **Auto Slug**: SEO-friendly URLs are not enabled for POS models

### Filtering

Use the `where` parameter with JSON string to filter results:

```json
{
  "where": "{\"status\": \"completed\", \"projectId\": 1}"
}
```

### Searching

Use the `search` parameter for full-text search across searchable fields:

```json
{
  "search": "Ahmed Cairo"
}
```

### Sorting

Use the `orderBy` parameter to sort results:

```graphql
query GetSortedSales {
  sales(orderBy: "-total_amount") {
    id
    totalAmount
  }
}
```

Prefix with `-` for descending order.

### Pagination

Use `limit` and `offset` for pagination:

```graphql
query GetPaginatedSales {
  sales(limit: 10, offset: 20) {
    id
    totalAmount
  }
}
```

This returns records 21-30.

---

## Testing

### Run All Tests

```bash
cd /home/yousef/Documents/workspace/zonevast/services/graphql/autoapi-projects/pos-graphql
python3 manage.py test
```

### Run Specific Test Module

```bash
# Address CRUD tests
python3 manage.py test tests.crud.test_address

# Customer CRUD tests
python3 manage.py test tests.crud.test_pos_customer

# Sale CRUD tests
python3 manage.py test tests.crud.test_sale

# Sale Return CRUD tests
python3 manage.py test tests.crud.test_sale_return

# Authentication tests
python3 manage.py test tests.auth.test_authentication

# Permission tests
python3 manage.py test tests.auth.test_permissions

# Integration tests
python3 manage.py test tests.integration.test_customer_sale_relationships
python3 manage.py test tests.integration.test_sale_return_flow
```

### Run Specific Test

```bash
python3 manage.py test tests.crud.test_sale.TestSaleCRUD.test_create_sale_minimal
```

### Health Check

```bash
# Local (direct)
curl http://localhost:4004/health

# Local (SAM Gateway)
curl http://localhost:3000/health

# Development
curl https://dev-api.zonevast.com/health

# Production
curl https://api.zonevast.com/health
```

---

## Common Workflows

### Complete Sale Flow

1. **Create Customer** (optional)
```graphql
mutation CreateCustomer {
  createPosCustomer(input: {
    firstName: "Ahmed",
    lastName: "Mohamed",
    phoneNumber: "+201234567890"
  }) {
    id
    firstName
    lastName
  }
}
```

2. **Create Sale**
```graphql
mutation CreateSale {
  createSale(input: {
    productId: 1,
    customerId: 1,
    quantity: 2,
    unitPrice: 100.0,
    totalAmount: 200.0,
    status: "pending"
  }) {
    id
    status
    totalAmount
  }
}
```

3. **Update Sale Status**
```graphql
mutation CompleteSale {
  updateSale(id: "1", input: {
    status: "completed"
  }) {
    id
    status
  }
}
```

### Return Flow

1. **Create Return**
```graphql
mutation CreateReturn {
  createSaleReturn(input: {
    saleId: 1,
    returnQuantity: 1,
    status: "pending",
    reason: "Defective product",
    refundAmount: 100.0
  }) {
    id
    status
    refundAmount
  }
}
```

2. **Process Return**
```graphql
mutation ProcessReturn {
  updateSaleReturn(id: "1", input: {
    status: "completed"
  }) {
    id
    status
  }
}
```

3. **Update Original Sale**
```graphql
mutation MarkSaleAsReturned {
  updateSale(id: "1", input: {
    status: "returned"
  }) {
    id
    status
  }
}
```

---

## Error Handling

### Common Errors

**Authentication Error**:
```json
{
  "errors": [
    {
      "message": "Authentication required",
      "extensions": {
        "code": "AUTHENTICATION_ERROR"
      }
    }
  ]
}
```

**Validation Error**:
```json
{
  "errors": [
    {
      "message": "Field 'productId' is required",
      "extensions": {
        "code": "VALIDATION_ERROR"
      }
    }
  ]
}
```

**Not Found**:
```json
{
  "data": {
    "sale": null
  }
}
```

**Permission Denied**:
```json
{
  "errors": [
    {
      "message": "You don't have permission to perform this action",
      "extensions": {
        "code": "PERMISSION_DENIED"
      }
    }
  ]
}
```

---

## Deployment

### Deploy to Lambda

```bash
cd /home/yousef/Documents/workspace/zonevast/services/graphql/autoapi-projects/pos-graphql
python3 deploy_lambda.py
```

### Local Development Server

```bash
cd /home/yousef/Documents/workspace/zonevast/services/graphql/autoapi-projects/pos-graphql
python3 handler.py
```

Service will start on `http://localhost:4004/graphql`

---

## Related Services

- **product-graphql**: Product catalog for POS items
- **auth-service**: JWT token management
- **billing-graphql**: Invoice generation for completed sales
- **inventory-graphql**: Stock level updates after sales

---

## Schema Introspection

To query the GraphQL schema directly:

```graphql
query GetSchema {
  __schema {
    types {
      name
      description
      fields {
        name
        type {
          name
        }
      }
    }
  }
}
```

---

## Support

For issues or questions:
1. Check the test files in `/tests/` for usage examples
2. Review model definitions in `/models/pos.py`
3. Check service handler in `/handler.py`
