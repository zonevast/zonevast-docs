# Users API

## Base URL
```
https://test.zonevast.com/api/v1/auth
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```bash
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## Get Current User Details

Retrieve the authenticated user's profile information.

**Endpoint:** `GET /user/`

**Authentication:** Required

```bash
curl -X GET https://test.zonevast.com/api/v1/auth/user/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "date_joined": "2024-01-01T10:00:00Z",
  "last_login": "2024-01-04T15:30:00Z",
  "is_active": true,
  "is_staff": false,
  "address": [],
  "profile": {
    "id": 1,
    "profile_picture_url": "https://test.zonevast.com/media/profile_images/...",
    "bio": "Software developer",
    "phone": "+1234567890",
    "birth_date": "1990-01-01",
    "gender": "male",
    "company_name": "Tech Corp",
    "position_title": "Developer"
  }
}
```

---

## Update User Details

Update the authenticated user's profile information.

**Endpoint:** `PUT /user/` or `PATCH /user/`

**Authentication:** Required

```bash
curl -X PUT https://test.zonevast.com/api/v1/auth/user/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Smith",
    "email": "john.smith@example.com"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| first_name | string | No | First name |
| last_name | string | No | Last name |
| username | string | No | Unique username |
| email | string | No | Email address |

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john.smith@example.com",
  "first_name": "John",
  "last_name": "Smith",
  "date_joined": "2024-01-01T10:00:00Z",
  "last_login": "2024-01-04T15:30:00Z",
  "is_active": true,
  "is_staff": false,
  "address": [],
  "profile": {
    "id": 1,
    "profile_picture_url": null,
    "bio": "",
    "phone": "",
    "birth_date": null,
    "gender": "",
    "company_name": "",
    "position_title": ""
  }
}
```

---

## Register New User

Create a new user account. An OTP will be sent to the provided email for verification.

**Endpoint:** `POST /register/`

**Authentication:** Not Required

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_user",
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "first_name": "New",
    "last_name": "User"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | Unique username |
| email | string | Yes | Valid email address |
| password | string | Yes | Password (min 8 characters) |
| first_name | string | No | First name |
| last_name | string | No | Last name |
| address | array | No | Array of address objects |

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

---

## Get User Profile

Retrieve the authenticated user's extended profile.

**Endpoint:** `GET /profile/`

**Authentication:** Required

```bash
curl -X GET https://test.zonevast.com/api/v1/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "id": 1,
  "profile_picture_url": "https://test.zonevast.com/media/profile_images/2024/01/04/...",
  "bio": "Software developer and tech enthusiast",
  "phone": "+1234567890",
  "birth_date": "1990-01-01",
  "gender": "male",
  "company_name": "Tech Corp",
  "position_title": "Senior Developer"
}
```

---

## Update User Profile

Update the authenticated user's extended profile information.

**Endpoint:** `PUT /profile/` or `PATCH /profile/`

**Authentication:** Required

```bash
curl -X PUT https://test.zonevast.com/api/v1/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Full-stack developer",
    "phone": "+9876543210",
    "gender": "male",
    "company_name": "New Company",
    "position_title": "Tech Lead"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| bio | string | No | User biography |
| phone | string | No | Phone number |
| birth_date | date | No | Birth date (YYYY-MM-DD) |
| gender | string | No | male, female, other, prefer_not_to_say |
| company_name | string | No | Company name |
| position_title | string | No | Job position/title |

**Response (200 OK):**
```json
{
  "id": 1,
  "profile_picture_url": "https://test.zonevast.com/media/profile_images/...",
  "bio": "Full-stack developer",
  "phone": "+9876543210",
  "birth_date": "1990-01-01",
  "gender": "male",
  "company_name": "New Company",
  "position_title": "Tech Lead"
}
```

---

## Upload Profile Picture

Upload a profile picture for the authenticated user.

**Endpoint:** `POST /user/upload-image/`

**Authentication:** Required

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/user/upload-image/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "image=@/path/to/profile.jpg"
```

**Form Data:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| image | file | Yes | Image file (JPEG, PNG, GIF, WebP) |
| profile_picture | file | Yes | Alternative field name |

**File Constraints:**
- Max size: 5MB
- Allowed types: JPEG, PNG, GIF, WebP

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "image_url": "https://test.zonevast.com/media/profile_images/2024/01/04/...",
  "profile_picture_url": "https://test.zonevast.com/media/profile_images/2024/01/04/..."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Image file too large. Maximum size is 5MB"
}
```

---

## Send OTP (One-Time Password)

Send an OTP to the user's email for verification or password reset.

**Endpoint:** `POST /send-otp/`

**Authentication:** Not Required

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/send-otp/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP has been sent to your email. Please check your inbox."
}
```

---

## Verify OTP

Verify the OTP sent to the user's email and activate the account.

**Endpoint:** `POST /verify-otp/`

**Authentication:** Not Required

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/verify-otp/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |
| otp | string | Yes | 6-digit OTP code |

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

## Reset Password

Reset the user's password using OTP verification.

**Endpoint:** `POST /password/reset/`

**Authentication:** Not Required

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/password/reset/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456",
    "new_password": "NewSecurePass123!"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |
| otp | string | Yes | 6-digit OTP code |
| new_password | string | Yes | New password (min 8 characters) |

**Response (200 OK):**
```json
{
  "detail": "Password has been reset."
}
```

---

## Change Password

Change the authenticated user's password (requires current password).

**Endpoint:** `POST /password/change/`

**Authentication:** Optional (can use email for password change)

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/password/change/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "OldPass123!",
    "new_password": "NewSecurePass456!"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | No* | Email (required if not authenticated) |
| current_password | string | Yes | Current password |
| old_password | string | No | Alias for current_password |
| new_password | string | Yes | New password (min 8 characters) |

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

## Create Address

Add a new address for the authenticated user.

**Endpoint:** `POST /address/`

**Authentication:** Required

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/address/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "address_type": "home",
    "street_address": "123 Main Street",
    "city": "Amman",
    "country": "Jordan",
    "postal_code": "11110",
    "nearest_landmark": "City Mall"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| address_type | string | No | home, work, other (default: home) |
| street_address | string | No | Street address |
| city | string | No | City name |
| governorate | int | No | Region/governorate ID |
| country | string | No | Country name (default: Jordan) |
| postal_code | string | No | Postal/ZIP code |
| nearest_landmark | string | No | Nearest landmark |

**Response (201 Created):**
```json
{
  "id": 1,
  "address_type": "home",
  "street_address": "123 Main Street",
  "city": "Amman",
  "governorate": 1,
  "country": "Jordan",
  "postal_code": "11110",
  "nearest_landmark": "City Mall"
}
```

---

## List Addresses

Get all addresses for the authenticated user.

**Endpoint:** `GET /address/`

**Authentication:** Required

```bash
curl -X GET https://test.zonevast.com/api/v1/auth/address/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "address_type": "home",
    "street_address": "123 Main Street",
    "city": "Amman",
    "country": "Jordan",
    "postal_code": "11110"
  },
  {
    "id": 2,
    "address_type": "work",
    "street_address": "456 Business Ave",
    "city": "Amman",
    "country": "Jordan",
    "postal_code": "11110"
  }
]
```

---

## Update Address

Update an existing address.

**Endpoint:** `PUT /address/{id}/` or `PATCH /address/{id}/`

**Authentication:** Required

```bash
curl -X PATCH https://test.zonevast.com/api/v1/auth/address/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "street_address": "123 New Street"
  }'
```

**Response (200 OK):**
```json
{
  "id": 1,
  "address_type": "home",
  "street_address": "123 New Street",
  "city": "Amman",
  "country": "Jordan",
  "postal_code": "11110"
}
```

---

## Delete Address

Delete an address.

**Endpoint:** `DELETE /address/{id}/`

**Authentication:** Required

```bash
curl -X DELETE https://test.zonevast.com/api/v1/auth/address/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (204 No Content)**

---

## List Countries

Get a list of all available countries.

**Endpoint:** `GET /country/`

**Authentication:** Not Required

```bash
curl -X GET https://test.zonevast.com/api/v1/auth/country/
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Jordan",
    "code2": "JO",
    "code3": "JOR",
    "slug": "jordan"
  },
  {
    "id": 2,
    "name": "United States",
    "code2": "US",
    "code3": "USA",
    "slug": "united-states"
  }
]
```

---

## Get Regions by Country

Get regions/governorates for a specific country.

**Endpoint:** `GET /region/{country_slug}/`

**Authentication:** Not Required

```bash
curl -X GET https://test.zonevast.com/api/v1/auth/region/jordan/
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Amman",
    "slug": "amman",
    "country": "Jordan"
  },
  {
    "id": 2,
    "name": "Irbid",
    "slug": "irbid",
    "country": "Jordan"
  }
]
```

---

## Legacy Login (Token-based)

**Note:** This is a legacy endpoint. Use JWT token endpoints instead.

**Endpoint:** `POST /login/`

**Authentication:** Not Required

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "csrf_token": "...",
  "token": "abc123token..."
}
```

---

## Logout

**Note:** Currently unused in the system.

**Endpoint:** `POST /logout/`

**Authentication:** Required

```bash
curl -X POST https://test.zonevast.com/api/v1/auth/logout/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

## API Root

Get API information and available endpoints.

**Endpoint:** `GET /`

**Authentication:** Not Required

```bash
curl -X GET https://test.zonevast.com/api/v1/auth/
```

**Response (200 OK) - Unauthenticated:**
```json
{
  "authenticated": false,
  "message": "Authentication required for personalized data",
  "endpoints": {
    "token": "/api/v1/auth/auth/token/",
    "token-refresh": "/api/v1/auth/auth/token/refresh/",
    "login": "/api/v1/auth/login/",
    "register": "/api/v1/auth/register/",
    "send-otp": "/api/v1/auth/send-otp/",
    "verify-otp": "/api/v1/auth/verify-otp/",
    "password-reset": "/api/v1/auth/password/reset/",
    "password-change": "/api/v1/auth/password/change/",
    "user-details": "/api/v1/auth/user/",
    "payment-cards": "/api/v1/auth/payment-card/",
    "addresses": "/api/v1/auth/address/",
    "countries": "/api/v1/auth/country/"
  }
}
```

**Response (200 OK) - Authenticated:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_staff": false,
    "date_joined": "2024-01-01T10:00:00Z"
  },
  "authenticated": true,
  "message": "Welcome back, John!",
  "endpoints": {
    "token": "/api/v1/auth/auth/token/",
    "token-refresh": "/api/v1/auth/auth/token/refresh/",
    "login": "/api/v1/auth/login/",
    "register": "/api/v1/auth/register/",
    "send-otp": "/api/v1/auth/send-otp/",
    "verify-otp": "/api/v1/auth/verify-otp/",
    "password-reset": "/api/v1/auth/password/reset/",
    "password-change": "/api/v1/auth/password/change/",
    "user-details": "/api/v1/auth/user/",
    "payment-cards": "/api/v1/auth/payment-card/",
    "addresses": "/api/v1/auth/address/",
    "countries": "/api/v1/auth/country/"
  }
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```
