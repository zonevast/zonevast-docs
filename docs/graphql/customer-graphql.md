# Customer GraphQL

## Endpoint

```
https://test.zonevast.com/graphql/customer
```

## Authentication

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Example Queries

### Get All Customers

```graphql
query GetCustomers($first: Int, $after: String, $search: String) {
  customers(first: $first, after: $after, search: $search) {
    edges {
      node {
        id
        firstName
        lastName
        email
        phone
        status
        createdAt
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

### Get Single Customer

```graphql
query GetCustomer($id: ID!) {
  customer(id: $id) {
    id
    firstName
    lastName
    email
    phone
    dateOfBirth
    status
    avatar {
      url
    }
    addresses {
      id
      type
      isDefault
      addressLine1
      addressLine2
      city
      state
      postalCode
      country
    }
    preferences {
      language
      currency
      notificationSettings {
        email
        sms
        push
      }
    }
    loyalty {
      points
      tier
      joinDate
    }
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

### Get Customer by Email

```graphql
query GetCustomerByEmail($email: String!) {
  customerByEmail(email: $email) {
    id
    firstName
    lastName
    email
    status
  }
}
```

**Variables:**
```json
{
  "email": "john@example.com"
}
```

### Get Customer Orders

```graphql
query GetCustomerOrders($customerId: ID!, $status: OrderStatus) {
  customerOrders(customerId: $customerId, status: $status) {
    id
    orderNumber
    status
    total
    createdAt
    items {
      product {
        name
      }
      quantity
    }
  }
}
```

**Variables:**
```json
{
  "customerId": "123",
  "status": "COMPLETED"
}
```

### Search Customers

```graphql
query SearchCustomers($searchTerm: String!) {
  searchCustomers(searchTerm: $searchTerm) {
    id
    firstName
    lastName
    email
    phone
    status
  }
}
```

**Variables:**
```json
{
  "searchTerm": "john"
}
```

### Get Customer Analytics

```graphql
query GetCustomerAnalytics($customerId: ID!) {
  customerAnalytics(customerId: $customerId) {
    totalOrders
    totalSpent
    averageOrderValue
    lastOrderDate
    favoriteCategories {
      id
      name
      purchaseCount
    }
    loyaltyStatus {
      tier
      points
      nextTier
      pointsToNextTier
    }
  }
}
```

**Variables:**
```json
{
  "customerId": "123"
}
```

### Get Customer Segments

```graphql
query GetCustomerSegments {
  customerSegments {
    id
    name
    description
    customerCount
    criteria {
      field
      operator
      value
    }
  }
}
```

### Get Customer Reviews

```graphql
query GetCustomerReviews($customerId: ID!) {
  customerReviews(customerId: $customerId) {
    id
    product {
      id
      name
    }
    rating
    title
    comment
    createdAt
  }
}
```

**Variables:**
```json
{
  "customerId": "123"
}
```

## Example Mutations

### Create Customer

```graphql
mutation CreateCustomer($input: CreateCustomerInput!) {
  createCustomer(input: $input) {
    customer {
      id
      firstName
      lastName
      email
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
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "securepassword123",
    "dateOfBirth": "1990-01-15",
    "preferences": {
      "language": "en",
      "currency": "USD"
    }
  }
}
```

### Update Customer

```graphql
mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
  updateCustomer(id: $id, input: $input) {
    customer {
      id
      firstName
      lastName
      email
      phone
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
  "id": "123",
  "input": {
    "firstName": "Jane",
    "phone": "+9876543210"
  }
}
```

### Add Address

```graphql
mutation AddAddress($customerId: ID!, $input: AddressInput!) {
  addAddress(customerId: $customerId, input: $input) {
    address {
      id
      type
      isDefault
      addressLine1
      city
      state
      postalCode
      country
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
  "customerId": "123",
  "input": {
    "type": "SHIPPING",
    "isDefault": true,
    "firstName": "John",
    "lastName": "Doe",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US"
  }
}
```

### Update Address

```graphql
mutation UpdateAddress($addressId: ID!, $input: AddressInput!) {
  updateAddress(addressId: $addressId, input: $input) {
    address {
      id
      addressLine1
      city
      state
      postalCode
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
  "addressId": "ADDR-123",
  "input": {
    "addressLine1": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "postalCode": "90001",
    "country": "US"
  }
}
```

### Delete Address

```graphql
mutation DeleteAddress($addressId: ID!) {
  deleteAddress(addressId: $addressId) {
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
  "addressId": "ADDR-123"
}
```

### Set Default Address

```graphql
mutation SetDefaultAddress($addressId: ID!) {
  setDefaultAddress(addressId: $addressId) {
    address {
      id
      isDefault
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
  "addressId": "ADDR-123"
}
```

### Update Preferences

```graphql
mutation UpdatePreferences($customerId: ID!, $input: PreferencesInput!) {
  updatePreferences(customerId: $customerId, input: $input) {
    customer {
      id
      preferences {
        language
        currency
        notificationSettings {
          email
          sms
          push
        }
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
  "customerId": "123",
  "input": {
    "language": "ar",
    "currency": "SAR",
    "notificationSettings": {
      "email": true,
      "sms": false,
      "push": true
    }
  }
}
```

### Add Loyalty Points

```graphql
mutation AddLoyaltyPoints($input: LoyaltyPointsInput!) {
  addLoyaltyPoints(input: $input) {
    customer {
      id
      loyalty {
        points
        tier
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
    "customerId": "123",
    "points": 100,
    "reason": "Purchase completion",
    "reference": "ORDER-123"
  }
}
```

### Update Customer Status

```graphql
mutation UpdateCustomerStatus($customerId: ID!, $status: CustomerStatus!) {
  updateCustomerStatus(customerId: $customerId, status: $status) {
    customer {
      id
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
  "customerId": "123",
  "status": "ACTIVE"
}
```

### Delete Customer

```graphql
mutation DeleteCustomer($customerId: ID!) {
  deleteCustomer(customerId: $customerId) {
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
  "customerId": "123"
}
```

## Subscriptions

### Customer Created

```graphql
subscription OnCustomerCreated {
  customerCreated {
    customer {
      id
      firstName
      lastName
      email
    }
  }
}
```

### Customer Updated

```graphql
subscription OnCustomerUpdated($customerId: ID) {
  customerUpdated(customerId: $customerId) {
    customer {
      id
      firstName
      lastName
      email
      status
    }
  }
}
```

## Common Use Cases

### Customer Registration

```graphql
mutation RegisterCustomer($input: RegisterCustomerInput!) {
  registerCustomer(input: $input) {
    customer {
      id
      email
      status
    }
    token {
      accessToken
      refreshToken
    }
    errors {
      field
      message
    }
  }
}
```

### Customer Profile

```graphql
query GetCustomerProfile($customerId: ID!) {
  customer(id: $customerId) {
    id
    firstName
    lastName
    email
    phone
    avatar {
      url
    }
    addresses {
      id
      type
      isDefault
      addressLine1
      city
      state
      postalCode
    }
    preferences {
      language
      currency
    }
  }
}
```

### Customer Purchase History

```graphql
query GetCustomerPurchaseHistory($customerId: ID!, $limit: Int) {
  customer(id: $customerId) {
    id
    firstName
    lastName
    email
  }
  customerOrders(customerId: $customerId) {
    id
    orderNumber
    status
    total
    createdAt
    items {
      product {
        name
        images {
          url
        }
      }
      quantity
    }
  }
  customerAnalytics(customerId: $customerId) {
    totalOrders
    totalSpent
    averageOrderValue
  }
}
```

### Customer Segmentation

```graphql
query GetCustomerSegment($segmentId: ID!) {
  customerSegment(id: $segmentId) {
    id
    name
    description
    customers {
      id
      firstName
      lastName
      email
      totalSpent
      lastOrderDate
    }
  }
}
```
