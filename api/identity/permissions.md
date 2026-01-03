# Permissions & Roles API

## Base URL
```
https://test.zonevast.com/api/v1
```

## Overview

ZoneVast uses Django's built-in authentication system with role-based access control (RBAC). Permissions are managed through user attributes and Django's permission framework.

---

## User Roles & Permissions

### User Roles

The system supports the following user roles:

| Role | is_staff | is_superuser | Description |
|------|----------|--------------|-------------|
| Regular User | false | false | Standard platform user |
| Staff Member | true | false | Can access admin panel, limited permissions |
| Superuser | true | true | Full system access, all permissions |

### Checking User Role

You can check a user's role through the user details endpoint:

**Endpoint:** `GET /auth/user/`

```bash
curl -X GET https://test.zonevast.com/api/v1/auth/user/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@zonevast.com",
  "is_staff": true,
  "is_superuser": true,
  "is_active": true,
  "date_joined": "2024-01-01T10:00:00Z",
  "last_login": "2024-01-04T15:30:00Z"
}
```

### Role Fields

| Field | Type | Description |
|-------|------|-------------|
| is_active | boolean | Whether the user account is active |
| is_staff | boolean | Whether user can access admin interface |
| is_superuser | boolean | Whether user has all permissions without explicit assignment |

---

## Permission Types

### Model-Level Permissions

Django automatically creates permissions for each model:

- **add_{model}** - Permission to create instances
- **view_{model}** - Permission to view instances
- **change_{model}** - Permission to update instances
- **delete_{model}** - Permission to delete instances

Example:
- `add_user` - Create new users
- `view_product` - View products
- `change_order` - Update orders
- `delete_invoice` - Delete invoices

### Custom Permissions

Models can define custom permissions beyond the standard CRUD operations.

---

## Access Control Patterns

### 1. Authentication Required

Most endpoints require the user to be authenticated:

```python
permission_classes = [IsAuthenticated]
```

**Example Request:**
```bash
curl -X GET https://test.zonevast.com/api/v1/auth/user/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Error (401):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 2. Staff Only Access

Some endpoints are restricted to staff members only:

```python
permission_classes = [IsAdminUser]
```

Or equivalently:
```python
permission_classes = [IsAuthenticated]
# ... in view:
if not request.user.is_staff:
    return Response(status=403)
```

**Example Request:**
```bash
curl -X GET https://test.zonevast.com/api/v1/admin/some-endpoint/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Error (403) - Non-Staff User:**
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 3. Superuser Access

Critical operations may require superuser status:

```python
if not request.user.is_superuser:
    return Response({"error": "Superuser access required"}, status=403)
```

### 4. Object-Level Permissions

Users can only access objects they own:

```python
def get_queryset(self):
    return Address.objects.filter(user=self.request.user)
```

---

## Project-Specific Roles

### Project Members

Users can be members of projects with different roles:

**Note:** Project roles are managed through the zv-project-service. See the project service documentation for details.

Common project roles:
- **Owner** - Full project control
- **Admin** - Manage project settings and members
- **Editor** - Edit project content
- **Viewer** - Read-only access

---

## Permission Checking Examples

### Checking Permissions in Code

```python
# Check if user is staff
if request.user.is_staff:
    # Allow access to admin features
    pass

# Check if user is superuser
if request.user.is_superuser:
    # Allow full system access
    pass

# Check specific model permission
if request.user.has_perm('auth.add_user'):
    # Allow creating users
    pass

# Check object-level permission
if request.user.has_perm('auth.change_user', target_user):
    # Allow modifying this specific user
    pass
```

### Filtering by Permission

```python
# Get only objects user can view
queryset = Model.objects.filter(
    Q(user=request.user) | Q(shared_with=request.user)
)

# Check if user can perform action
if not request.user.has_perm('app.delete_model'):
    return Response(status=403)
```

---

## JWT Token Permissions

JWT tokens include user permissions in the payload:

```json
{
  "user_id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "is_staff": false,
  "is_superuser": false,
  "exp": 1704350400,
  "iat": 1704346800
}
```

### Using Permissions from Token

When validating requests, the system:
1. Decodes the JWT token
2. Extracts user information
3. Checks permissions based on `is_staff` and `is_superuser` claims
4. Grants or denies access accordingly

---

## Common Permission Errors

### 401 Unauthorized

**Cause:** No authentication token provided or invalid token.

**Solution:** Include valid JWT token in Authorization header.

```bash
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden

**Cause:** User lacks required permissions (not staff, not superuser, or object owner).

**Solution:** Ensure user has appropriate role or permissions.

**Response:**
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### Account Inactive

**Cause:** User account is disabled (`is_active=false`).

**Solution:** Contact administrator to activate account.

**Response:**
```json
{
  "detail": "User account is disabled."
}
```

---

## User Status & Permissions

### Account Status Fields

| Field | Type | Impact on Permissions |
|-------|------|----------------------|
| is_active | boolean | Must be true to authenticate |
| is_staff | boolean | Required for admin endpoints |
| is_superuser | boolean | Bypasses all permission checks |
| is_verified | boolean | May be required for certain operations |

### Verification Status

New users must verify their email via OTP before their account is activated:

1. User registers → `is_active=false`, `is_verified=false`
2. OTP verified → `is_active=true`, `is_verified=true`
3. User can now authenticate and access the platform

---

## Best Practices

### 1. Principle of Least Privilege

Grant users only the permissions they need:
- Use `is_staff=false` for regular users
- Use `is_superuser=false` unless absolutely necessary
- Use object-level permissions to restrict data access

### 2. Token Security

- Store JWT tokens securely (e.g., httpOnly cookies or secure storage)
- Implement token refresh mechanisms
- Set appropriate token expiration times
- Invalidate tokens on logout or password change

### 3. Permission Checks

Always check permissions on the backend:
```python
# Good - Backend validates permissions
@permission_classes([IsAuthenticated])
def my_view(request):
    if not request.user.is_staff:
        return Response(status=403)
    # ... proceed

# Bad - Frontend-only check (insecure)
def my_view(request):
    # ... proceed without permission check
```

### 4. Audit Logging

Log permission-related actions:
- Failed authentication attempts
- Unauthorized access attempts
- Permission changes
- Role modifications

---

## Cross-Service Authentication

When calling other services, always include the JWT token:

```bash
curl -X POST https://test.zonevast.com/api/v1/orders/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 2}'
```

Each service will:
1. Validate the JWT token
2. Extract user permissions
3. Grant/deny access based on permissions

---

## Project Context in Tokens

For project-specific operations, include project context in requests:

**Via Header:**
```bash
X-Project-ID: 123
```

**Via JWT Claim:**
Some tokens include `project_id` in the payload for project-scoped operations.

---

## API Gateway Permissions

When accessing services through Kong Gateway:

1. **Authentication:** JWT plugin validates tokens
2. **Rate Limiting:** Applied per user or per API key
3. **Access Control:** Gateway-level ACLs can restrict access

**Example Gateway Request:**
```bash
curl -X GET https://test.zonevast.com/api/v1/profile/profile/ \
  -H "Host: auth.zonevast.com" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Testing Permissions

### Test Authentication

```bash
# Login to get token
curl -X POST https://test.zonevast.com/api/v1/auth/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'

# Use token to access protected endpoint
curl -X GET https://test.zonevast.com/api/v1/auth/user/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Staff Access

```bash
# Try accessing admin endpoint as regular user (should fail)
curl -X GET https://test.zonevast.com/api/v1/admin/users/ \
  -H "Authorization: Bearer REGULAR_USER_TOKEN"

# Expected response: 403 Forbidden
```

### Test Object Ownership

```bash
# Try accessing another user's profile (should fail)
curl -X GET https://test.zonevast.com/api/v1/auth/address/999/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected response: 404 Not Found or 403 Forbidden
```

---

## Permission Management

### Creating Staff Users

Staff users should be created through Django admin or management commands:

```bash
# Via Django shell
python3 manage.py shell
>>> user = User.objects.get(username='john_doe')
>>> user.is_staff = True
>>> user.save()

# Via management command (if available)
python3 manage.py promote_user john_doe
```

### Creating Superusers

```bash
# Via management command
python3 manage.py createsuperuser

# Via Django shell
>>> user = User.objects.get(username='admin')
>>> user.is_superuser = True
>>> user.is_staff = True
>>> user.save()
```

---

## Security Considerations

1. **Token Expiration:** JWT tokens should expire (typically 1-24 hours)
2. **Refresh Tokens:** Use refresh tokens to obtain new access tokens
3. **HTTPS Only:** Always use HTTPS in production
4. **Password Strength:** Enforce strong password policies
5. **Rate Limiting:** Implement rate limiting on authentication endpoints
6. **Account Lockout:** Lock accounts after multiple failed attempts
7. **Audit Logs:** Log all permission changes and access denials

---

## Summary

- **Regular Users:** `is_staff=false`, `is_superuser=false`
- **Staff Members:** `is_staff=true`, can access admin interface
- **Superusers:** `is_superuser=true`, full system access
- **Authentication:** JWT tokens included in Authorization header
- **Authorization:** Checked per endpoint using permission classes
- **Object-Level:** Users can only access their own resources
- **Project Roles:** Managed through project service
- **Cross-Service:** Same token works across all microservices

For service-specific permission implementations, refer to individual service documentation.
