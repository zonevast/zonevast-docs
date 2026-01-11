# Project Service API Reference

**Service Name:** zv-project-service
**Service Port:** 8070
**Base URL:** `/api/v1/project/`
**Health Check:** `/health/` or `/api/v1/project/health/`

## Overview

The Project Service provides comprehensive project management, file attachment handling, reporting, and feature management capabilities for the ZoneVast platform. It serves as a central service for multi-tenant project configuration and collaboration.

---

## Table of Contents

1. [Project Management](#project-management)
2. [File Attachments](#file-attachments)
3. [Account & Collaboration](#account-collaboration)
4. [Features](#features)
5. [Languages](#languages)
6. [Reports](#reports)
7. [Reviews](#reviews)
8. [Project Settings](#project-settings)

---

## Project Management

### List Projects

**Endpoint:** `GET /api/v1/project/project/projects/`
**Alternate:** `GET /{locale}/api/v1/project/project/projects/`

**Authentication:** Required (JWT)
**Headers:**
```
Authorization: Bearer <token>
X-Project: <project_name>
```

**Response (200 OK):**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "My Project",
      "description": "Project description",
      "username": "myproject",
      "unique_identifier": "ABC123",
      "template": "default",
      "owner_id": 123,
      "logo": {
        "id": 456,
        "path": "/media/attachments/logo.jpg"
      },
      "features": ["ecommerce", "blog"],
      "supported_languages": [
        {"code": "en", "name": "English"},
        {"code": "ar", "name": "Arabic"}
      ],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Create Project

**Endpoint:** `POST /api/v1/project/project/projects/`

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description",
  "username": "newproject",
  "template": "default",
  "logo_id": 456,
  "features_add": [1, 2],
  "supported_languages": [
    {"code": "en", "name": "English"},
    {"code": "ar", "name": "Arabic"}
  ]
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "title": "New Project",
  "description": "Project description",
  "username": "newproject",
  "unique_identifier": "XYZ789",
  "template": "default",
  "owner_id": 123,
  "logo": null,
  "features": ["ecommerce", "blog"],
  "supported_languages": [
    {"code": "en", "name": "English"},
    {"code": "ar", "name": "Arabic"}
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### Retrieve Project

**Endpoint:** `GET /api/v1/project/project/projects/{unique_identifier}/`

**Authentication:** Required (JWT)

**Parameters:**
- `unique_identifier` (path): Project's unique identifier (e.g., "ABC123")

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "My Project",
  "description": "Project description",
  "username": "myproject",
  "unique_identifier": "ABC123",
  "template": "default",
  "owner_id": 123,
  "logo": {
    "id": 456,
    "path": "/media/attachments/logo.jpg"
  },
  "features": ["ecommerce"],
  "supported_languages": [
    {"code": "en", "name": "English"}
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### Update Project

**Endpoint:** `PUT /api/v1/project/project/projects/{unique_identifier}/` or `PATCH /api/v1/project/project/projects/{unique_identifier}/`

**Authentication:** Required (JWT)

**Request Body (PATCH example):**
```json
{
  "title": "Updated Project Title",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Updated Project Title",
  "description": "Updated description",
  "username": "myproject",
  "unique_identifier": "ABC123",
  "template": "default",
  "owner_id": 123,
  "logo": null,
  "features": ["ecommerce"],
  "supported_languages": [
    {"code": "en", "name": "English"}
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

---

### Delete Project

**Endpoint:** `DELETE /api/v1/project/project/projects/{unique_identifier}/`

**Authentication:** Required (JWT)

**Response (204 No Content)**

---

### Get Project by Username

**Endpoint:** `GET /api/v1/project/project/projects/by-username/{username}/`

**Authentication:** Not Required (public endpoint for inter-service calls)

**Parameters:**
- `username` (path): Project's username

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "myproject"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Project not found"
}
```

---

### Get Project Info

**Endpoint:** `GET /api/v1/project/project/info/{username}/`

**Authentication:** Not Required

**Parameters:**
- `username` (path): Project's username

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "My Project",
  "username": "myproject",
  "logo": {
    "id": 456,
    "path": "/media/attachments/logo.jpg"
  },
  "unique_identifier": "ABC123",
  "template": "default"
}
```

---

### Get Project Groups

**Endpoint:** `GET /api/v1/project/project/{username}/groups/`

**Authentication:** Required

**Parameters:**
- `username` (path): Project's username

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Admins",
    "permissions": ["add_project", "change_project", "delete_project", "view_project"]
  },
  {
    "id": 2,
    "name": "Editors",
    "permissions": ["add_project", "change_project", "view_project"]
  }
]
```

---

## File Attachments

### List Attachments

**Endpoint:** `GET /api/v1/project/project/attachment/`

**Authentication:** Required (JWT)

**Query Parameters:**
- `entity_type` (optional): Filter by entity type (e.g., "product", "order", "profile")
- `page` (optional): Page number for pagination
- `page_size` (optional): Number of items per page (default: 20, max: 100)

**Response (200 OK):**
```json
{
  "count": 50,
  "next": "/api/v1/project/project/attachment/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "original_name": "document.pdf",
      "type": "document",
      "mime_type": "application/pdf",
      "file_name": "document.pdf",
      "size": 1024000,
      "upload_status": "completed",
      "file_url": "https://s3.zonevast.com/attachments/2024/01/12/abc123.pdf",
      "entity_type": "product",
      "tenant_project_id": 1,
      "created_at": "2024-01-12T10:00:00Z",
      "updated_at": "2024-01-12T10:00:00Z"
    }
  ]
}
```

---

### Get Attachment Details

**Endpoint:** `GET /api/v1/project/project/attachment/{id}/`

**Authentication:** Required (JWT)

**Parameters:**
- `id` (path): Attachment ID

**Response (200 OK):**
```json
{
  "id": 1,
  "original_name": "document.pdf",
  "type": "document",
  "mime_type": "application/pdf",
  "file_name": "document.pdf",
  "size": 1024000,
  "upload_status": "completed",
  "file_url": "https://s3.zonevast.com/attachments/2024/01/12/abc123.pdf",
  "entity_type": "product",
  "tenant_project_id": 1,
  "created_at": "2024-01-12T10:00:00Z",
  "updated_at": "2024-01-12T10:00:00Z"
}
```

---

### Request Presigned Upload URL

**Endpoint:** `POST /api/v1/project/project/attachment/presigned-url/`

**Authentication:** Required (JWT)

**Use Case:** For large files (>10MB) or direct browser-to-S3 uploads

**Request Body:**
```json
{
  "file_name": "large-video.mp4",
  "file_size": 52428800,
  "content_type": "video/mp4",
  "base_path": "videos",
  "entity_type": "product",
  "tenant_project_id": 1
}
```

**Response (201 Created):**
```json
{
  "attachment_id": 2,
  "upload_url": "https://s3.zonevast.com/",
  "fields": {
    "key": "videos/2024/01/12/xyz789.mp4",
    "Content-Type": "video/mp4",
    "policy": "...",
    "x-amz-credential": "...",
    "x-amz-algorithm": "AWS4-HMAC-SHA256",
    "x-amz-date": "20240112T100000Z",
    "x-amz-signature": "..."
  },
  "s3_key": "videos/2024/01/12/xyz789.mp4",
  "expires_in": 3600
}
```

**Client-Side Upload (using presigned URL):**
```javascript
const formData = new FormData();
Object.keys(response.fields).forEach(key => {
  formData.append(key, response.fields[key]);
});
formData.append('file', file);

fetch(response.upload_url, {
  method: 'POST',
  body: formData
}).then(response => {
  // After successful upload, confirm with the server
  return fetch('/api/v1/project/project/attachment/confirm-upload/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ attachment_id: response.attachment_id })
  });
});
```

---

### Confirm Upload

**Endpoint:** `POST /api/v1/project/project/attachment/confirm-upload/`

**Authentication:** Required (JWT)

**Use Case:** Confirm successful upload after using presigned URL

**Request Body:**
```json
{
  "attachment_id": 2,
  "file_hash": "a1b2c3d4e5f6..."
}
```

**Response (200 OK):**
```json
{
  "id": 2,
  "original_name": "large-video.mp4",
  "type": "video",
  "mime_type": "video/mp4",
  "file_name": "large-video.mp4",
  "size": 52428800,
  "upload_status": "completed",
  "file_url": "https://s3.zonevast.com/videos/2024/01/12/xyz789.mp4",
  "entity_type": "product",
  "tenant_project_id": 1,
  "created_at": "2024-01-12T10:00:00Z",
  "updated_at": "2024-01-12T10:05:00Z"
}
```

---

### Direct Upload (Through API Gateway)

**Endpoint:** `POST /api/v1/project/project/attachment/direct-upload/`

**Authentication:** Required (JWT)

**Use Case:** For smaller files (<10MB) that can pass through API Gateway/Lambda

**Request Body (multipart/form-data):**
```
file: <binary file data>
entity_type: "product"
tenant_project_id: 1
```

**Response (201 Created):**
```json
{
  "success": true,
  "method": "direct_upload",
  "attachment_id": 3,
  "s3_key": "direct-upload-test/2024/01/12/def456.jpg",
  "file_info": {
    "name": "image.jpg",
    "size": 524288,
    "content_type": "image/jpeg",
    "size_mb": 0.5
  },
  "performance": {
    "s3_upload_duration": 1.23,
    "total_duration": 1.45,
    "upload_speed_mbps": 0.41
  },
  "gateway_info": {
    "passed_through_api_gateway": true,
    "passed_through_lambda": true,
    "max_api_gateway_size": "10MB"
  }
}
```

---

### Delete Attachment

**Endpoint:** `DELETE /api/v1/project/project/attachment/{id}/delete/`

**Authentication:** Required (JWT)

**Parameters:**
- `id` (path): Attachment ID

**Response (204 No Content)**

**Note:** This will delete both the database record and the S3 object.

---

## Account & Collaboration

### List Users

**Endpoint:** `GET /api/v1/project/project/{username}/account/users/`

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe"
    }
  ]
}
```

---

### List Collaborators

**Endpoint:** `GET /api/v1/project/project/{username}/account/collaborators/`

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "user_id": 123,
      "project_id": 1,
      "group": {
        "id": 1,
        "name": "Admins"
      },
      "joined_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Check Collaborator Membership

**Endpoint:** `GET /api/v1/project/project/{username}/account/collaborators/check_membership/`

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "is_member": true,
  "group": "Admins"
}
```

---

### Verify Users

**Endpoint:** `POST /api/v1/project/project/{username}/account/verify-users/`

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "user_ids": [1, 2, 3]
}
```

**Response (200 OK):**
```json
{
  "verified_users": [
    {"id": 1, "username": "john_doe", "exists": true},
    {"id": 2, "username": "jane_doe", "exists": true},
    {"id": 3, "exists": false}
  ]
}
```

---

### Direct Connect User to Account

**Endpoint:** `POST /api/v1/project/project/{username}/account/connect/{user_id}/to/{account_id}/`

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User connected to account successfully"
}
```

---

### Obtain Token

**Endpoint:** `POST /api/v1/project/project/{username}/account/api/token/`

**Authentication:** Not Required

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user@example.com",
    "email": "user@example.com"
  }
}
```

---

### Refresh Token

**Endpoint:** `POST /api/v1/project/project/{username}/account/api/token/refresh/`

**Authentication:** Not Required

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Features

### List Features

**Endpoint:** `GET /api/v1/project/project/{username}/features/`

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "name": "ecommerce",
      "type": "ecommerce",
      "title": "E-commerce",
      "description": "Enable e-commerce functionality",
      "default_fields": ["products", "orders", "payments"]
    },
    {
      "id": 2,
      "name": "blog",
      "type": "blog",
      "title": "Blog",
      "description": "Enable blog functionality",
      "default_fields": ["posts", "categories", "tags"]
    }
  ]
}
```

---

### Create Feature

**Endpoint:** `POST /api/v1/project/project/{username}/features/`

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "name": "forum",
  "type": "blog",
  "title": "Forum",
  "description": "Community forum feature",
  "default_fields": ["threads", "replies"]
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "name": "forum",
  "type": "blog",
  "title": "Forum",
  "description": "Community forum feature",
  "default_fields": ["threads", "replies"]
}
```

---

## Languages

### Get Supported Languages

**Endpoint:** `GET /api/v1/project/project/data/languages/`

**Authentication:** Not Required

**Response (200 OK):**
```json
[
  {"code": "en", "name": "English"},
  {"code": "ar", "name": "Arabic"},
  {"code": "fr", "name": "French"},
  {"code": "es", "name": "Spanish"}
]
```

---

## Reports

### List Report Templates

**Endpoint:** `GET /api/v1/project/project/{username}/report/templates/`

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "name": "Sales Report",
      "description": "Monthly sales summary",
      "target_model": "product.Order",
      "display_fields": ["id", "created_at", "total"],
      "group_by_fields": ["created_at__month"],
      "aggregations": [
        {"field": "total", "function": "sum", "alias": "total_sales"}
      ],
      "filters": {"status": "completed"},
      "sort_by": ["-created_at"],
      "project": 1,
      "created_by_id": 123,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Create Report Template

**Endpoint:** `POST /api/v1/project/project/{username}/report/templates/`

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "name": "Inventory Report",
  "description": "Current inventory status",
  "target_model": "product.Product",
  "display_fields": ["id", "name", "sku", "stock_quantity"],
  "group_by_fields": ["category"],
  "aggregations": [
    {"field": "stock_quantity", "function": "sum", "alias": "total_stock"}
  ],
  "filters": {"is_active": true},
  "sort_by": ["category", "name"]
}
```

---

### List Archived Reports

**Endpoint:** `GET /api/v1/project/project/{username}/report/archives/`

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "name": "Sales Report - January 2024",
      "description": "Monthly sales summary",
      "target_model": "product.Order",
      "display_fields": ["id", "created_at", "total"],
      "group_by_fields": ["created_at__month"],
      "aggregations": [
        {"field": "total", "function": "sum", "alias": "total_sales"}
      ],
      "filters": {"status": "completed"},
      "result_data": {
        "rows": [
          {"month": "2024-01", "total_sales": 50000}
        ]
      },
      "project": 1,
      "created_by_id": 123,
      "created_at": "2024-01-31T23:59:59Z"
    }
  ]
}
```

---

### List Available Models

**Endpoint:** `GET /api/v1/project/project/{username}/report/models/`

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "models": [
    {
      "app_label": "product",
      "model_name": "Product",
      "verbose_name": "Product"
    },
    {
      "app_label": "product",
      "model_name": "Order",
      "verbose_name": "Order"
    }
  ]
}
```

---

### Get Model Fields

**Endpoint:** `GET /api/v1/project/project/{username}/report/models/{app_label}/{model_name}/fields/`

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "fields": [
    {
      "name": "id",
      "type": "IntegerField",
      "verbose_name": "ID"
    },
    {
      "name": "name",
      "type": "CharField",
      "verbose_name": "Name"
    },
    {
      "name": "price",
      "type": "DecimalField",
      "verbose_name": "Price"
    }
  ]
}
```

---

### Get Model Relationships

**Endpoint:** `GET /api/v1/project/project/{username}/report/models/{app_label}/{model_name}/relationships/`

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "relationships": [
    {
      "name": "category",
      "related_model": "product.Category",
      "type": "ForeignKey"
    },
    {
      "name": "tags",
      "related_model": "product.Tag",
      "type": "ManyToManyField"
    }
  ]
}
```

---

### Get Report Suggestions

**Endpoint:** `GET /api/v1/project/project/{username}/report/models/{app_label}/{model_name}/suggest/`

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "suggested_reports": [
    {
      "name": "Daily Sales Summary",
      "display_fields": ["id", "created_at", "total"],
      "group_by_fields": ["created_at__date"],
      "aggregations": [
        {"field": "total", "function": "sum", "alias": "daily_total"}
      ]
    }
  ]
}
```

---

### Generate Report

**Endpoint:** `POST /api/v1/project/project/{username}/report/generate/`

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "target_model": "product.Order",
  "display_fields": ["id", "created_at", "total"],
  "group_by_fields": ["created_at__month"],
  "aggregations": [
    {"field": "total", "function": "sum", "alias": "monthly_sales"}
  ],
  "filters": {"status": "completed"},
  "sort_by": ["-created_at__month"]
}
```

**Response (200 OK):**
```json
{
  "data": {
    "rows": [
      {
        "created_at__month": "2024-01",
        "monthly_sales": 50000
      },
      {
        "created_at__month": "2024-02",
        "monthly_sales": 65000
      }
    ],
    "meta": {
      "total_rows": 2,
      "generated_at": "2024-02-01T10:00:00Z"
    }
  }
}
```

---

### Generate Report from Template

**Endpoint:** `POST /api/v1/project/project/{username}/report/generate/from-template/{report_id}/`

**Authentication:** Required (JWT)

**Parameters:**
- `report_id` (path): Report template ID

**Response (200 OK):**
```json
{
  "data": {
    "rows": [
      {
        "month": "2024-01",
        "total_sales": 50000
      }
    ],
    "meta": {
      "template_id": 1,
      "template_name": "Sales Report",
      "generated_at": "2024-02-01T10:00:00Z"
    }
  }
}
```

---

### Run Quick Report

**Endpoint:** `POST /api/v1/project/project/{username}/report/run/`

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "target_model": "product.Product",
  "display_fields": ["name", "stock_quantity"],
  "filters": {"is_active": true},
  "limit": 10
}
```

**Response (200 OK):**
```json
{
  "results": [
    {
      "name": "Product A",
      "stock_quantity": 100
    },
    {
      "name": "Product B",
      "stock_quantity": 50
    }
  ],
  "count": 2
}
```

---

## Reviews

### List Reviews

**Endpoint:** `GET /api/v1/project/project/{username}/review/reviews/`

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Excellent product!",
      "review_date": "2024-01-01T00:00:00Z",
      "user_id": 123
    }
  ]
}
```

---

### Create Review

**Endpoint:** `POST /api/v1/project/project/{username}/review/reviews/`

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great service!",
  "review_date": "2024-01-12T10:00:00Z"
}
```

---

## Project Settings

### List Project Settings

**Endpoint:** `GET /api/v1/project/project/{username}/settings/`

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "key": "timezone",
      "value": "UTC",
      "project": 1
    },
    {
      "id": 2,
      "key": "currency",
      "value": "USD",
      "project": 1
    },
    {
      "id": 3,
      "key": "date_format",
      "value": "YYYY-MM-DD",
      "project": 1
    }
  ]
}
```

---

### Create Project Setting

**Endpoint:** `POST /api/v1/project/project/{username}/settings/`

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "key": "language",
  "value": "en"
}
```

**Response (201 Created):**
```json
{
  "id": 4,
  "key": "language",
  "value": "en",
  "project": 1
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Setting 'language' already exists for this project."
}
```

---

### Update Project Setting

**Endpoint:** `PUT /api/v1/project/project/{username}/settings/{id}/` or `PATCH /api/v1/project/project/{username}/settings/{id}/`

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "value": "ar"
}
```

**Response (200 OK):**
```json
{
  "id": 4,
  "key": "language",
  "value": "ar",
  "project": 1
}
```

---

### Delete Project Setting

**Endpoint:** `DELETE /api/v1/project/project/{username}/settings/{id}/`

**Authentication:** Required (JWT)

**Response (204 No Content)**

---

## Error Responses

### Standard Error Format

```json
{
  "error": "Error message",
  "details": {
    "field_name": ["Error details"]
  }
}
```

### Common HTTP Status Codes

- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## Authentication

All endpoints (except where noted) require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Tokens can be obtained from the authentication endpoint:

```
POST /api/v1/project/project/{username}/account/api/token/
```

---

## Project Context

Most endpoints require project context via one of the following:

1. **JWT Token**: Project ID embedded in token claims
2. **X-Project Header**: `X-Project: project_name`
3. **URL Parameter**: Username in URL path for project-specific endpoints

---

## Testing Endpoints

### Health Check

```bash
curl https://test.zonevast.com/api/v1/project/health/
```

**Response:**
```json
{
  "status": "healthy",
  "service": "zv-project-service"
}
```

### List Attachments

```bash
curl https://test.zonevast.com/en/api/v1/project/project/attachment/ \
  -H "Authorization: Bearer <token>" \
  -H "X-Project: myproject"
```

### Get Project Info

```bash
curl https://test.zonevast.com/api/v1/project/project/info/myproject/
```

---

## File Upload Strategies

### 1. Direct Upload (Recommended for files <10MB)

**Advantages:**
- Simpler implementation
- Automatic authentication handling
- Works through API Gateway

**Process:**
1. POST to `/attachment/direct-upload/` with file
2. Server uploads to S3
3. Returns attachment ID

### 2. Presigned URL (Recommended for files >10MB)

**Advantages:**
- Bypasses API Gateway/Lambda payload limits
- Direct browser-to-S3 upload
- Better for large files

**Process:**
1. POST to `/attachment/presigned-url/` with file metadata
2. Receive presigned URL and fields
3. Upload directly to S3 using presigned URL
4. POST to `/attachment/confirm-upload/` to confirm

---

## Swagger Documentation

Interactive API documentation is available:

- **Swagger UI**: `/swagger/`
- **ReDoc**: `/redoc/`
- **OpenAPI JSON**: `/swagger.json`

---

## Notes

- All timestamps are in UTC
- File sizes are in bytes
- Pagination follows Django REST Framework standards
- Soft delete is enabled for projects (check `deleted_at` field)
- Multi-language support via `Accept-Language` header or URL prefix
