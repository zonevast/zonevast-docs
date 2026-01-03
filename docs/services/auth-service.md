# Authentication Service

## Base URL
`https://test.zonevast.com/api/v1/auth/auth`

## Authentication
All endpoints (except token and registration) require JWT token in Authorization header:
```bash
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Endpoints

### Get JWT Token
Obtain access and refresh tokens using username/email and password.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }'
```

#### Response
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "your_username",
    "email": "user@example.com"
  }
}
```

#### Notes
- `access` token: Short-lived (typically 5-15 minutes), use in API requests
- `refresh` token: Long-lived (typically 24 hours), use to get new access token

---

### Refresh Token
Get a new access token using refresh token.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "YOUR_REFRESH_TOKEN"
  }'
```

#### Response
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### Register New User
Create a new user account.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/auth/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "securepassword123"
  }'
```

#### Response
```json
{
  "id": 2,
  "username": "newuser",
  "email": "newuser@example.com",
  "message": "Registration successful"
}
```

---

### Get User Details
Get current user information.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/auth/auth/user/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "id": 1,
  "username": "your_username",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

---

### Update User Profile
Update user profile information.

#### Request
```bash
curl -X PATCH https://test.zonevast.com/api/v1/auth/auth/user/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe"
  }'
```

#### Response
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "username": "your_username"
}
```

---

### Change Password
Change user password.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/auth/auth/password/change/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "old_password": "oldpassword",
    "new_password": "newpassword123"
  }'
```

#### Response
```json
{
  "message": "Password changed successfully"
}
```

---

### Reset Password
Request password reset via email.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/auth/auth/password/reset/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

#### Response
```json
{
  "message": "Password reset email sent"
}
```

---

### List Countries
Get list of available countries.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/auth/auth/country/
```

#### Response
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "United States",
      "code": "US",
      "slug": "united-states"
    }
  ]
}
```

---

### Get Regions by Country
Get regions/states for a specific country.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/auth/auth/region/united-states/
```

#### Response
```json
{
  "regions": [
    {
      "id": 1,
      "name": "California",
      "code": "CA"
    }
  ]
}
```

---

### User Addresses
Manage user addresses.

#### List Addresses
```bash
curl -X GET https://test.zonevast.com/api/v1/auth/auth/address/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Create Address
```bash
curl -X POST https://test.zonevast.com/api/v1/auth/auth/address/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "address_line1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94102",
    "country": "US",
    "is_default": true
  }'
```

#### Response
```json
{
  "id": 1,
  "address_line1": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "postal_code": "94102",
  "country": "US",
  "is_default": true
}
```

---

### Payment Cards
Manage payment methods.

#### List Payment Cards
```bash
curl -X GET https://test.zonevast.com/api/v1/auth/auth/payment-card/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Add Payment Card
```bash
curl -X POST https://test.zonevast.com/api/v1/auth/auth/payment-card/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "card_number": "4242424242424242",
    "expiry_month": 12,
    "expiry_year": 2025,
    "cvv": "123"
  }'
```

#### Response
```json
{
  "id": 1,
  "last_four": "4242",
  "brand": "Visa",
  "expiry_month": 12,
  "expiry_year": 2025,
  "is_default": true
}
```

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid"
}
```
**Solution**: Refresh your access token or re-authenticate.

### 400 Bad Request
```json
{
  "username": ["This field is required."],
  "password": ["This field is required."]
}
```
**Solution**: Check required fields in request body.
