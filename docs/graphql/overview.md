# GraphQL Overview

## Base URL

All GraphQL endpoints follow this pattern:

```
https://test.zonevast.com/graphql/{service}
```

Replace `{service}` with the specific service name (e.g., `product`, `inventory`, `order`).

## Authentication

All GraphQL requests require authentication via JWT token:

### Authorization Header

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### How to Get a Token

1. Obtain a JWT token from the authentication service
2. Include the token in the `Authorization` header
3. Tokens expire after a set time - refresh as needed

### Example Request with Authentication

```graphql
# HTTP Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Query
query GetProducts {
  products {
    id
    name
  }
}
```

## Basic Query Structure

### Query Format

```graphql
query OperationName($variable: Type!) {
  field {
    subField
    nestedField {
      id
      name
    }
  }
}
```

### Variables

```json
{
  "variable": "value"
}
```

## Common Response Structure

### Success Response

```json
{
  "data": {
    "products": [
      {
        "id": "1",
        "name": "Product Name"
      }
    ]
  }
}
```

### Error Response

```json
{
  "errors": [
    {
      "message": "Error message here",
      "locations": [{ "line": 2, "column": 3 }]
    }
  ]
}
```

## Available Services

- **Product GraphQL** - `https://test.zonevast.com/graphql/product`
- **Inventory GraphQL** - `https://test.zonevast.com/graphql/inventory`
- **Order GraphQL** - `https://test.zonevast.com/graphql/order`
- **Customer GraphQL** - `https://test.zonevast.com/graphql/customer`
- **Repair GraphQL** - `https://test.zonevast.com/graphql/repair`
- **Debt GraphQL** - `https://test.zonevast.com/graphql/debt`

## GraphQL Clients

### Using cURL

```bash
curl -X POST \
  https://test.zonevast.com/graphql/product \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "query GetProducts { products { id name } }"
  }'
```

### Using JavaScript (fetch)

```javascript
fetch('https://test.zonevast.com/graphql/product', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: `
      query GetProducts {
        products {
          id
          name
        }
      }
    `
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Best Practices

1. **Use Introspection** - Explore the schema with `__schema`
2. **Batch Queries** - Request multiple fields in a single query
3. **Use Fragments** - Reuse query logic
4. **Handle Errors** - Always check for errors in responses
5. **Cache Responsibly** - Implement caching strategies
6. **Rate Limiting** - Respect API rate limits

## Introspection Query

To explore the full schema:

```graphql
query IntrospectionQuery {
  __schema {
    types {
      name
      kind
      description
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
}
```
