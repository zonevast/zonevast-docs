# ZoneVast Auth Service - REST API Reference

**Base URL:** `https://test.zonevast.com`

**Service:** zv-auth-service (Django REST Framework)

**Version:** v1

---

## Overview

The ZoneVast Authentication Service provides user authentication, JWT token management, user registration, password reset, and geographical data (countries/regions) for the ZoneVast platform.

---

## Authentication

This service uses JWT (JSON Web Tokens) for authentication. Most endpoints require an `Authorization` header with a valid JWT access token.

### Header Format
```
Authorization: Bearer <access_token>
```

### Getting a Token

Use the **Token Endpoint** to obtain JWT tokens:

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

**Response:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **`access`**: Short-lived token (typically 5 minutes) for API requests
- **`refresh`**: Long-lived token (typically 7 days) for getting new access tokens

### Using the Token

Include the access token in your requests:

```bash
curl https://test.zonevast.com/api/v1/auth/auth/user/ \
  -H "Authorization: Bearer <access_token>"
```

### Refreshing a Token

When your access token expires, use the refresh token to get a new pair:

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "<your_refresh_token>"}'
```

**Response:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## API Endpoints

### Health & Info

#### GET `/health/`
Health check endpoint (no authentication required).

**Request:**
```bash
curl https://test.zonevast.com/api/v1/auth/health/
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "zv-auth-service"
}
```

#### GET `/api/v1/auth/auth/`
API root endpoint listing available endpoints (no authentication required).

**Request:**
```bash
curl https://test.zonevast.com/api/v1/auth/auth/
```

**Response (200 OK):**
```json
{
  "message": "ZoneVast Authentication Service API v1",
  "version": "v1",
  "service": "zv-auth-service",
  "endpoints": {
    "login": "/api/v1/auth/auth/token/",
    "refresh": "/api/v1/auth/auth/token/refresh/",
    "change_project": "/api/v1/auth/auth/token/change_project/",
    "users": "/api/v1/auth/auth/users/",
    "health": "/api/v1/auth/auth/health/"
  },
  "documentation": {
    "swagger": "/docs/swagger/",
    "redoc": "/docs/redoc/"
  }
}
```

#### GET `/api/v1/auth/auth/health/`
Health check for auth module (no authentication required).

**Request:**
```bash
curl https://test.zonevast.com/api/v1/auth/auth/health/
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "zv-auth-service"
}
```

---

### Authentication & Authorization

#### POST `/api/v1/auth/auth/token/`
**Obtain JWT token pair** (recommended for modern clients).

**Method:** `POST`

**Authentication:** Not required

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response (200 OK):**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2ODc3MzA1NywiaWF0IjoxNzY4MTY4MjU3LCJqdGkiOiI1MDE4Y2NjZWRiNjc0NDcxOTMwNWIwZjNhZTc4OTZjYiIsInVzZXJfaWQiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5Aem9uZXZhc3QuY29tIiwicHJvamVjdF9pZCI6bnVsbH0.ORrQ-FUIcz3Aw9oU8sb2eXkW31JeVrbgfKz5U01FtSE",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY4MTcxODU3LCJpYXQiOjE3NjgxNjgyNTcsImp0aSI6IjM0MjJmNzAxMDg2NDQ4YzhiMmI0MWFmMzFiZjMzNzY1IiwidXNlcl9pZCI6IjEiLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkB6b25ldmFzdC5jb20iLCJwcm9qZWN0X2lkIjpudWxsfQ.6DnlmpmZKQSDUOS_spzvrrIL3Njw-1pDs0M3yk_2pzg"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "No active account found with the given credentials"
}
```

#### POST `/api/v1/auth/auth/token/refresh/`
**Refresh access token** using a valid refresh token.

**Method:** `POST`

**Authentication:** Not required (uses refresh token)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh": "your_refresh_token"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "Token is invalid or expired",
  "code": "token_not_valid"
}
```

#### POST `/api/v1/auth/auth/token/change_project/`
**Switch to a different project** and get a new token with the new project context.

**Method:** `POST`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "project_id": 123
}
```

**Response (200 OK):**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "User is not a member of this project."
}
```

#### POST `/api/v1/auth/auth/login/`
**Legacy login endpoint** (for backward compatibility). Returns a token and CSRF token.

**Method:** `POST`

**Authentication:** Not required

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "csrf_token": "qjfMLuZghpVbo5mgEN0jsWG4kXrYmhkUEhQwZZuABv1waPtoKJTrgvoUJ2ch9811",
  "token": "2e2cf285def761306c824fb0fcbeea2531e7e250"
}
```

#### POST `/api/v1/auth/auth/logout/`
**Logout endpoint** (deletes token).

**Method:** `POST`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

### User Management

#### GET `/api/v1/auth/auth/user/`
**Get current user details**.

**Method:** `GET`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "first_name": "admin12",
  "last_name": "yousef",
  "username": "admin",
  "email": "admin@zonevast.com",
  "date_joined": "2025-10-09T19:33:18.789083Z",
  "last_login": "2026-01-11T21:43:26.114836Z",
  "is_active": true,
  "is_staff": true,
  "profile": null
}
```

#### PATCH `/api/v1/auth/auth/user/`
**Update current user details**.

**Method:** `PATCH`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "username": "admin",
  "email": "admin@zonevast.com",
  "date_joined": "2025-10-09T19:33:18.789083Z",
  "last_login": "2026-01-11T21:43:26.114836Z",
  "is_active": true,
  "is_staff": true,
  "profile": null
}
```

#### POST `/api/v1/auth/auth/user/upload-image/`
**Upload user profile image**.

**Method:** `POST`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
```
image: <file>
# OR
profile_picture: <file>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "image_url": "https://test.zonevast.com/media/profile_images/2026/01/12/abc123.jpg",
  "profile_picture_url": "https://test.zonevast.com/media/profile_images/2026/01/12/abc123.jpg"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "No image file provided. Use \"image\" or \"profile_picture\" field."
}
```

---

### Registration & Verification

#### POST `/api/v1/auth/auth/register/`
**Register a new user account**. Sends an OTP to the user's email for verification.

**Method:** `POST`

**Authentication:** Not required

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "SecurePass123",
  "first_name": "New",
  "last_name": "User"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "OTP has been sent to your email. Please verify your account."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Username already exists. Please choose a different username."
}
```

#### POST `/api/v1/auth/auth/send-otp/`
**Send OTP to email** for password reset or verification.

**Method:** `POST`

**Authentication:** Not required

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP has been sent to your email. Please check your inbox."
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "User not found"
}
```

#### POST `/api/v1/auth/auth/verify-otp/`
**Verify OTP code** to activate account or complete password reset.

**Method:** `POST`

**Authentication:** Not required (session-based)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200 OK):**
```json
{
  "message": "OTP verified successfully, account activated."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid or expired OTP"
}
```

---

### Password Management

#### POST `/api/v1/auth/auth/password/reset/`
**Reset password using OTP**. Must call `/send-otp/` first to get the code.

**Method:** `POST`

**Authentication:** Not required (session-based)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "new_password": "NewSecurePass456"
}
```

**Response (200 OK):**
```json
{
  "detail": "Password has been reset."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid or expired OTP"
}
```

#### POST `/api/v1/auth/auth/password/change/`
**Change password** for authenticated user (requires current password).

**Method:** `POST`

**Authentication:** Not required (email-based) or Required

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "current_password": "OldPass123",
  "new_password": "NewPass456"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully."
}
```

**Error Response (400 Bad Request):**
```json
{
  "current_password": "Current password is incorrect."
}
```

---

### Profile Management

#### GET `/api/v1/auth/profile/`
**Get user profile** (extended profile information).

**Method:** `GET`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[]
```

*Note: Returns empty array if no profile exists.*

#### POST `/api/v1/auth/profile/`
**Create user profile**.

**Method:** `POST`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "phone": "+962791234567",
  "bio": "Software developer",
  "date_of_birth": "1990-01-01"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "user": 1,
  "phone": "+962791234567",
  "bio": "Software developer",
  "date_of_birth": "1990-01-01",
  "profile_picture": null
}
```

#### PATCH `/api/v1/auth/profile/`
**Update user profile**.

**Method:** `PATCH`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "bio": "Updated bio"
}
```

#### POST `/api/v1/auth/profile/upload_picture/`
**Upload profile picture** (alternative to user upload-image endpoint).

**Method:** `POST`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
```
profile_picture: <file>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": 1,
  "profile_picture": "/media/profile_images/2026/01/12/abc123.jpg"
}
```

#### DELETE `/api/v1/auth/profile/remove_picture/`
**Remove profile picture**.

**Method:** `DELETE` (or POST with action)

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "Profile picture removed successfully"
}
```

---

### Address Management

#### GET `/api/v1/auth/address/`
**List user addresses**.

**Method:** `GET`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[]
```

#### POST `/api/v1/auth/address/`
**Create new address**.

**Method:** `POST`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "address_line1": "123 Main Street",
  "address_line2": "Apt 4B",
  "city": "Amman",
  "region": "Amman",
  "country": "Jordan",
  "postal_code": "11111",
  "phone": "+962791234567",
  "is_default": true
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "user": 1,
  "address_line1": "123 Main Street",
  "address_line2": "Apt 4B",
  "city": "Amman",
  "region": "Amman",
  "country": "Jordan",
  "postal_code": "11111",
  "phone": "+962791234567",
  "is_default": true
}
```

#### GET `/api/v1/auth/address/{id}/`
**Get specific address**.

**Method:** `GET`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
```

#### PATCH `/api/v1/auth/address/{id}/`
**Update address**.

**Method:** `PATCH`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### DELETE `/api/v1/auth/address/{id}/`
**Delete address**.

**Method:** `DELETE`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

### Payment Cards

#### GET `/api/v1/auth/payment-card/`
**List user payment cards** (paginated).

**Method:** `GET`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "count": 0,
  "total_pages": 1,
  "current_page": 1,
  "next": null,
  "previous": null,
  "limit": 10,
  "results": []
}
```

#### POST `/api/v1/auth/payment-card/`
**Add new payment card**.

**Method:** `POST`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "card_number": "4111111111111111",
  "card_holder_name": "John Doe",
  "expiry_month": 12,
  "expiry_year": 2025,
  "cvv": "123",
  "is_default": true
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "user": 1,
  "card_number_last4": "1111",
  "card_holder_name": "John Doe",
  "expiry_month": 12,
  "expiry_year": 2025,
  "is_default": true
}
```

#### GET `/api/v1/auth/payment-card/{id}/`
**Get specific payment card**.

**Method:** `GET`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
```

#### PATCH `/api/v1/auth/payment-card/{id}/`
**Update payment card**.

**Method:** `PATCH`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### DELETE `/api/v1/auth/payment-card/{id}/`
**Delete payment card**.

**Method:** `DELETE`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

### Geographical Data

#### GET `/api/v1/auth/country/`
**List all countries** (paginated).

**Method:** `GET`

**Authentication:** Not required

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Request:**
```bash
curl https://test.zonevast.com/api/v1/auth/country/
```

**Response (200 OK):**
```json
{
  "count": 252,
  "total_pages": 26,
  "current_page": 1,
  "next": 2,
  "previous": null,
  "limit": 10,
  "results": [
    {
      "id": 3,
      "name": "Afghanistan",
      "name_ascii": "Afghanistan",
      "slug": "afghanistan",
      "geoname_id": 1149361,
      "alternate_names": "",
      "translations": {},
      "code2": "AF",
      "code3": "AFG",
      "continent": "AS",
      "tld": "af",
      "phone": "93"
    }
  ]
}
```

#### GET `/api/v1/auth/country/{slug}/`
**Get specific country details**.

**Method:** `GET`

**Authentication:** Not required

**Request:**
```bash
curl https://test.zonevast.com/api/v1/auth/country/jordan/
```

**Response (200 OK):**
```json
{
  "id": 117,
  "name": "Jordan",
  "name_ascii": "Jordan",
  "slug": "jordan",
  "geoname_id": 248816,
  "alternate_names": "",
  "translations": {},
  "code2": "JO",
  "code3": "JOR",
  "continent": "AS",
  "tld": "jo",
  "phone": "962"
}
```

#### GET `/api/v1/auth/region/{country_slug}/`
**List regions/states for a country**.

**Method:** `GET`

**Authentication:** Not required

**Request:**
```bash
curl https://test.zonevast.com/api/v1/auth/region/jordan/
```

**Response (200 OK):**
```json
[
  {
    "id": 1492,
    "country": "Jordan",
    "name": "Ajlun",
    "name_ascii": "Ajlun",
    "slug": "ajlun",
    "geoname_id": 443120,
    "alternate_names": "",
    "translations": {},
    "display_name": "Ajlun, Jordan",
    "geoname_code": "20"
  },
  {
    "id": 1488,
    "country": "Jordan",
    "name": "Amman",
    "name_ascii": "Amman",
    "slug": "amman",
    "geoname_id": 250439,
    "alternate_names": "",
    "translations": {},
    "display_name": "Amman, Jordan",
    "geoname_code": "16"
  }
]
```

---

## Error Codes

### Common HTTP Status Codes

| Code | Title | Description |
|------|-------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request succeeded, no content returned |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

### Error Response Format

Most errors return a JSON response:

**Validation Error (400):**
```json
{
  "field_name": ["Error message for this field"],
  "another_field": ["Error message for another field"]
}
```

**Authentication Error (401):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Not Found Error (404):**
```json
{
  "detail": "Not found."
}
```

**Permission Error (403):**
```json
{
  "error": "User is not a member of this project."
}
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `"detail": "No active account found with the given credentials"` | Invalid username or password | Check credentials and try again |
| `"detail": "Token is invalid or expired"` | JWT token expired | Use refresh token to get new access token |
| `"detail": "Authentication credentials were not provided."` | Missing Authorization header | Add `Authorization: Bearer <token>` header |
| `"error": "User not found"` | Email not registered | Use a registered email address |
| `"error": "Invalid or expired OTP"` | OTP code wrong or expired (2 min expiry) | Request new OTP and try again |
| `"error": "Username already exists"` | Duplicate username | Choose a different username |
| `"current_password": "Current password is incorrect."` | Wrong current password | Verify current password and try again |

---

## Quick Examples

### Complete Authentication Flow

```bash
# 1. Login to get tokens
TOKENS=$(curl -s -X POST https://test.zonevast.com/api/v1/auth/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}')

ACCESS_TOKEN=$(echo $TOKENS | jq -r '.access')
REFRESH_TOKEN=$(echo $TOKENS | jq -r '.refresh')

# 2. Get user details
curl https://test.zonevast.com/api/v1/auth/auth/user/ \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# 3. Refresh token when expired
NEW_TOKENS=$(curl -s -X POST https://test.zonevast.com/api/v1/auth/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d "{\"refresh\": \"$REFRESH_TOKEN\"}")

NEW_ACCESS_TOKEN=$(echo $NEW_TOKENS | jq -r '.access')
```

### Registration Flow

```bash
# 1. Register new user
curl -X POST https://test.zonevast.com/api/v1/auth/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "SecurePass123",
    "first_name": "New",
    "last_name": "User"
  }'

# 2. Verify OTP (check email for the code)
curl -X POST https://test.zonevast.com/api/v1/auth/auth/verify-otp/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "otp": "123456"
  }'

# 3. Login with verified account
curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "SecurePass123"
  }'
```

### Password Reset Flow

```bash
# 1. Request OTP
curl -X POST https://test.zonevast.com/api/v1/auth/auth/send-otp/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# 2. Reset password with OTP
curl -X POST https://test.zonevast.com/api/v1/auth/auth/password/reset/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456",
    "new_password": "NewSecurePass456"
  }'

# 3. Login with new password
curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user@example.com",
    "password": "NewSecurePass456"
  }'
```

### Fetching Countries and Regions

```bash
# 1. List all countries (first page)
curl https://test.zonevast.com/api/v1/auth/country/

# 2. Get country details
curl https://test.zonevast.com/api/v1/auth/country/jordan/

# 3. Get regions for a country
curl https://test.zonevast.com/api/v1/auth/region/jordan/

# 4. Paginate through countries
curl https://test.zonevast.com/api/v1/auth/country/?page=2&limit=20
```

---

## Testing

All endpoints can be tested using `curl`, Postman, or any HTTP client.

### Using curl

```bash
# Health check
curl https://test.zonevast.com/api/v1/auth/health/

# Get API info
curl https://test.zonevast.com/api/v1/auth/auth/

# Login
curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Get user data
curl https://test.zonevast.com/api/v1/auth/auth/user/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using JavaScript (fetch)

```javascript
// Login
const response = await fetch('https://test.zonevast.com/api/v1/auth/auth/token/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const data = await response.json();
const { access, refresh } = data;

// Get user data
const userResponse = await fetch('https://test.zonevast.com/api/v1/auth/auth/user/', {
  headers: {
    'Authorization': `Bearer ${access}`
  }
});

const userData = await userResponse.json();
```

---

## Notes

1. **Token Expiry**: Access tokens typically expire in 5 minutes. Always implement token refresh logic.
2. **Session-based OTP**: OTP endpoints use server sessions. Ensure cookies are handled correctly.
3. **Pagination**: List endpoints return paginated responses with `count`, `total_pages`, `current_page`, `next`, and `previous` fields.
4. **Image Upload**: Profile images are limited to 5MB and accept JPEG, PNG, GIF, and WebP formats.
5. **Country/Region Data**: Geographical data comes from the `cities-light` package.
6. **Authentication**: Most endpoints require JWT authentication. Only public endpoints (login, register, password reset, countries/regions) work without tokens.

---

## Additional Resources

- **Swagger Documentation**: `https://test.zonevast.com/swagger/`
- **ReDoc Documentation**: `https://test.zonevast.com/redoc/`
- **Django Admin**: `https://test.zonevast.com/admin/` (requires admin login)
- **Service Source**: `/home/yousef/Documents/workspace/zonevast/services/zv-auth-service/`

---

**Last Updated:** 2026-01-12
**API Version:** v1
**Environment:** test.zonevast.com
