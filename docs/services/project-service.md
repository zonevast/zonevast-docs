# Project Management Service

## Base URL
`https://test.zonevast.com/api/v1/project`

## Authentication
Require JWT token in Authorization header:
```bash
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Endpoints

### List Projects
Get all projects accessible to the user.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/project/project/projects/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Query Parameters
- `username`: Filter by username
- `is_active`: Filter active projects (true/false)
- `page`: Page number
- `page_size`: Items per page

#### Response
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "username": "myproject",
      "display_name": "My Project",
      "description": "Project description",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "settings": {
        "language": "en",
        "timezone": "UTC"
      }
    }
  ]
}
```

---

### Get Project Detail
Get detailed information for a specific project.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/project/project/projects/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "id": 1,
  "username": "myproject",
  "display_name": "My Project",
  "description": "Project description",
  "is_active": true,
  "owner": {
    "id": 1,
    "username": "owner",
    "email": "owner@example.com"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "settings": {
    "language": "en",
    "timezone": "UTC",
    "currency": "USD"
  }
}
```

---

### Create Project
Create a new project.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/project/project/projects/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newproject",
    "display_name": "New Project",
    "description": "Project description",
    "is_active": true
  }'
```

#### Response
```json
{
  "id": 2,
  "username": "newproject",
  "display_name": "New Project",
  "description": "Project description",
  "is_active": true,
  "created_at": "2024-01-02T00:00:00Z"
}
```

---

### Update Project
Update project details.

#### Request
```bash
curl -X PATCH https://test.zonevast.com/api/v1/project/project/projects/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Updated Project Name",
    "description": "Updated description"
  }'
```

#### Response
```json
{
  "id": 1,
  "display_name": "Updated Project Name",
  "description": "Updated description",
  "updated_at": "2024-01-02T10:00:00Z"
}
```

---

### Delete Project
Delete a project.

#### Request
```bash
curl -X DELETE https://test.zonevast.com/api/v1/project/project/projects/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "message": "Project deleted successfully"
}
```

---

### Get Project by Username
Lookup project by username (for inter-service calls).

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/project/project/projects/by-username/myproject/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "id": 1,
  "username": "myproject",
  "display_name": "My Project",
  "is_active": true
}
```

---

### Project Settings
Manage project-specific settings.

#### List Settings
```bash
curl -X GET https://test.zonevast.com/api/v1/project/project/myproject/settings/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "key": "language",
      "value": "en",
      "description": "Default language"
    },
    {
      "id": 2,
      "key": "timezone",
      "value": "UTC",
      "description": "Timezone setting"
    },
    {
      "id": 3,
      "key": "currency",
      "value": "USD",
      "description": "Default currency"
    }
  ]
}
```

#### Update Setting
```bash
curl -X PATCH https://test.zonevast.com/api/v1/project/project/myproject/settings/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "fr"
  }'
```

---

### File Attachments
Manage file attachments for projects.

#### List Attachments
```bash
curl -X GET https://test.zonevast.com/api/v1/project/project/attachment/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Query Parameters
- `project`: Filter by project ID
- `entity_type`: Filter by entity type (product, order, invoice, etc.)
- `entity_id`: Filter by entity ID
- `file_type`: Filter by file type (image, document, etc.)

#### Response
```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "project": 1,
      "entity_type": "product",
      "entity_id": 5,
      "file_name": "product-image.jpg",
      "file_type": "image",
      "file_size": 102400,
      "mime_type": "image/jpeg",
      "file_url": "https://s3.amazonaws.com/bucket/product-image.jpg",
      "uploaded_at": "2024-01-01T10:00:00Z",
      "uploaded_by": 1
    }
  ]
}
```

---

### Get Presigned URL
Get presigned URL for direct file upload to S3.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/project/project/attachment/presigned-url/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "file_name": "document.pdf",
    "file_type": "application/pdf",
    "file_size": 2048000,
    "entity_type": "order",
    "entity_id": 10
  }'
```

#### Response
```json
{
  "upload_url": "https://s3.amazonaws.com/bucket/presigned-url...",
  "file_url": "https://s3.amazonaws.com/bucket/document.pdf",
  "attachment_id": 15,
  "fields": {
    "key": "uploads/document.pdf",
    "Content-Type": "application/pdf"
  },
  "expires_in": 3600
}
```

#### Upload File Using Presigned URL
```bash
# Use the presigned URL to upload file directly to S3
curl -X PUT -F "file=@/path/to/document.pdf" \
  "https://s3.amazonaws.com/bucket/presigned-url..."
```

---

### Confirm Upload
Confirm file upload after direct S3 upload.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/project/project/attachment/confirm-upload/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "attachment_id": 15
  }'
```

#### Response
```json
{
  "id": 15,
  "status": "uploaded",
  "file_url": "https://s3.amazonaws.com/bucket/document.pdf",
  "uploaded_at": "2024-01-02T11:00:00Z"
}
```

---

### Direct Upload
Upload file directly through the service (for small files).

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/project/project/attachment/direct-upload/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "entity_type=order" \
  -F "entity_id=10"
```

#### Response
```json
{
  "id": 16,
  "file_name": "document.pdf",
  "file_url": "https://s3.amazonaws.com/bucket/document.pdf",
  "file_size": 2048000,
  "uploaded_at": "2024-01-02T11:05:00Z"
}
```

---

### Get Attachment Detail
Get details for a specific attachment.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/project/project/attachment/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "id": 1,
  "project": 1,
  "entity_type": "product",
  "entity_id": 5,
  "file_name": "product-image.jpg",
  "file_type": "image",
  "file_size": 102400,
  "mime_type": "image/jpeg",
  "file_url": "https://s3.amazonaws.com/bucket/product-image.jpg",
  "thumbnail_url": "https://s3.amazonaws.com/bucket/thumbs/product-image.jpg",
  "uploaded_at": "2024-01-01T10:00:00Z",
  "uploaded_by": {
    "id": 1,
    "username": "admin"
  }
}
```

---

### Delete Attachment
Delete a file attachment.

#### Request
```bash
curl -X POST https://test.zonevast.com/api/v1/project/project/attachment/1/delete/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "message": "Attachment deleted successfully",
  "file_name": "product-image.jpg"
}
```

---

### Project Collaborators
Manage project team members.

#### List Collaborators
```bash
curl -X GET https://test.zonevast.com/api/v1/project/account/collaborators/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Query Parameters
- `project`: Filter by project ID
- `role`: Filter by role (admin, editor, viewer)

#### Response
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "user": {
        "id": 2,
        "username": "collaborator1",
        "email": "collab1@example.com"
      },
      "role": "admin",
      "joined_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Add Collaborator
```bash
curl -X POST https://test.zonevast.com/api/v1/project/account/collaborators/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user": 3,
    "project": 1,
    "role": "editor"
  }'
```

---

### Check Membership
Check if user is a project collaborator.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/project/account/collaborators/check_membership/?project=1&user=2 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "is_member": true,
  "role": "admin",
  "joined_at": "2024-01-01T00:00:00Z"
}
```

---

### Supported Languages
Get list of supported languages for projects.

#### Request
```bash
curl -X GET https://test.zonevast.com/api/v1/project/project/data/languages/
```

#### Response
```json
{
  "languages": [
    {
      "code": "en",
      "name": "English"
    },
    {
      "code": "fr",
      "name": "French"
    },
    {
      "code": "ar",
      "name": "Arabic"
    }
  ]
}
```

---

### Project Groups
Manage project groups/categories.

#### List Groups
```bash
curl -X GET https://test.zonevast.com/api/v1/project/project/myproject/groups/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "name": "Development",
      "description": "Development projects"
    },
    {
      "id": 2,
      "name": "Marketing",
      "description": "Marketing projects"
    }
  ]
}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "username": ["This field is required."],
  "display_name": ["This field is required."]
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to access this project"
}
```

### 404 Not Found
```json
{
  "detail": "Project not found"
}
```

### 413 Payload Too Large
```json
{
  "detail": "File size exceeds maximum allowed size of 10MB"
}
```

### 415 Unsupported Media Type
```json
{
  "detail": "File type not supported. Allowed types: jpg, png, pdf, doc, docx"
}
```
