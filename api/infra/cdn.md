# Media CDN & File Upload API

## Base URL
`https://test.zonevast.com/api/v1`

## Authentication
All file operations require JWT token in Authorization header:
```bash
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Upload via Project Service

### Direct File Upload
Upload file directly through the service (recommended for files < 10MB).

```bash
curl -X POST https://test.zonevast.com/api/v1/project/project/attachment/direct-upload/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "entity_type=order" \
  -F "entity_id=10" \
  -F "file_type=document"
```

**Form Parameters:**
- `file` (file, required): File to upload
- `entity_type` (string, required): Entity type (product, order, invoice, etc.)
- `entity_id` (integer, required): Entity ID
- `file_type` (string, optional): Type category (image, document, video)
- `description` (string, optional): File description

**Response:**
```json
{
  "id": 16,
  "file_name": "document.pdf",
  "file_type": "document",
  "file_size": 2048000,
  "mime_type": "application/pdf",
  "file_url": "https://cdn.zonevast.com/files/document.pdf",
  "thumbnail_url": null,
  "uploaded_at": "2024-01-02T11:05:00Z",
  "project": 1,
  "entity_type": "order",
  "entity_id": 10
}
```

---

### Get Presigned URL
Get presigned S3 URL for direct upload (recommended for files > 10MB).

```bash
curl -X POST https://test.zonevast.com/api/v1/project/project/attachment/presigned-url/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "file_name": "large-video.mp4",
    "file_type": "video/mp4",
    "file_size": 52428800,
    "entity_type": "product",
    "entity_id": 5
  }'
```

**Request Body:**
- `file_name` (string, required): Name of the file
- `file_type` (string, required): MIME type of the file
- `file_size` (integer, required): File size in bytes
- `entity_type` (string, required): Entity type to attach to
- `entity_id` (integer, required): Entity ID

**Response:**
```json
{
  "upload_url": "https://s3.amazonaws.com/zonevast-uploads/xfg123...",
  "file_url": "https://cdn.zonevast.com/files/large-video.mp4",
  "attachment_id": 17,
  "fields": {
    "key": "uploads/large-video.mp4",
    "Content-Type": "video/mp4"
  },
  "expires_in": 3600
}
```

---

### Upload Using Presigned URL
Use the presigned URL to upload directly to S3/MinIO.

```bash
# Using PUT request
curl -X PUT "https://s3.amazonaws.com/zonevast-uploads/xfg123..." \
  -H "Content-Type: video/mp4" \
  --data-binary @/path/to/large-video.mp4

# Or using POST with form-data
curl -X POST "https://s3.amazonaws.com/zonevast-uploads/xfg123..." \
  -F "key=uploads/large-video.mp4" \
  -F "Content-Type=video/mp4" \
  -F "file=@/path/to/large-video.mp4"
```

---

### Confirm Upload
After successful presigned URL upload, confirm with the service.

```bash
curl -X POST https://test.zonevast.com/api/v1/project/project/attachment/confirm-upload/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "attachment_id": 17
  }'
```

**Response:**
```json
{
  "id": 17,
  "status": "uploaded",
  "file_url": "https://cdn.zonevast.com/files/large-video.mp4",
  "uploaded_at": "2024-01-02T12:00:00Z",
  "file_size": 52428800
}
```

---

## File Management

### List Files
Get all file attachments for a project or entity.

```bash
curl -X GET "https://test.zonevast.com/api/v1/project/project/attachment/?entity_type=product&entity_id=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `project`: Filter by project ID
- `entity_type`: Filter by entity type
- `entity_id`: Filter by entity ID
- `file_type`: Filter by file type (image, document, video)
- `page`: Page number
- `page_size`: Items per page

**Response:**
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "project": 1,
      "entity_type": "product",
      "entity_id": 5,
      "file_name": "product-main.jpg",
      "file_type": "image",
      "file_size": 102400,
      "mime_type": "image/jpeg",
      "file_url": "https://cdn.zonevast.com/files/product-main.jpg",
      "thumbnail_url": "https://cdn.zonevast.com/files/thumbs/product-main.jpg",
      "uploaded_at": "2024-01-01T10:00:00Z",
      "uploaded_by": {
        "id": 1,
        "username": "admin"
      }
    }
  ]
}
```

---

### Get File Details
Retrieve metadata for a specific file.

```bash
curl -X GET https://test.zonevast.com/api/v1/project/project/attachment/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "project": 1,
  "entity_type": "product",
  "entity_id": 5,
  "file_name": "product-main.jpg",
  "file_type": "image",
  "file_size": 102400,
  "mime_type": "image/jpeg",
  "dimensions": {
    "width": 1920,
    "height": 1080
  },
  "file_url": "https://cdn.zonevast.com/files/product-main.jpg",
  "thumbnail_url": "https://cdn.zonevast.com/files/thumbs/product-main.jpg",
  "variants": {
    "small": "https://cdn.zonevast.com/files/small/product-main.jpg",
    "medium": "https://cdn.zonevast.com/files/medium/product-main.jpg",
    "large": "https://cdn.zonevast.com/files/large/product-main.jpg"
  },
  "uploaded_at": "2024-01-01T10:00:00Z",
  "description": "Main product image"
}
```

---

### Update File Metadata
Update file description or metadata.

```bash
curl -X PATCH https://test.zonevast.com/api/v1/project/project/attachment/1/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated product description",
    "file_name": "new-product-name.jpg"
  }'
```

---

### Delete File
Remove a file attachment from storage.

```bash
curl -X POST https://test.zonevast.com/api/v1/project/project/attachment/1/delete/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "message": "Attachment deleted successfully",
  "file_name": "product-main.jpg",
  "deleted_at": "2024-01-02T13:00:00Z"
}
```

---

## Image Management

### Upload Image with Variants
Upload image and automatically generate variants.

```bash
curl -X POST https://test.zonevast.com/api/v1/project/project/attachment/upload-image/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/product.jpg" \
  -F "entity_type=product" \
  -F "entity_id=5" \
  -F "generate_variants=true" \
  -F "variant_sizes=small,medium,large"
```

**Response:**
```json
{
  "id": 20,
  "file_name": "product.jpg",
  "file_type": "image",
  "file_url": "https://cdn.zonevast.com/files/product.jpg",
  "variants": {
    "small": {
      "url": "https://cdn.zonevast.com/files/small/product.jpg",
      "width": 150,
      "height": 150,
      "size": 15360
    },
    "medium": {
      "url": "https://cdn.zonevast.com/files/medium/product.jpg",
      "width": 300,
      "height": 300,
      "size": 45000
    },
    "large": {
      "url": "https://cdn.zonevast.com/files/large/product.jpg",
      "width": 800,
      "height": 800,
      "size": 120000
    }
  }
}
```

---

### Get Image Variants
Retrieve all generated variants for an image.

```bash
curl -X GET https://test.zonevast.com/api/v1/project/project/attachment/20/variants/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "original": {
    "url": "https://cdn.zonevast.com/files/product.jpg",
    "width": 1920,
    "height": 1080,
    "size": 512000
  },
  "variants": [
    {
      "name": "small",
      "url": "https://cdn.zonevast.com/files/small/product.jpg",
      "width": 150,
      "height": 150
    },
    {
      "name": "thumbnail",
      "url": "https://cdn.zonevast.com/files/thumbs/product.jpg",
      "width": 80,
      "height": 80
    }
  ]
}
```

---

## CDN Access

### Public URL Structure
Uploaded files are accessible via CDN:
```
https://cdn.zonevast.com/files/{file_path}
```

### Presigned Download URL
Generate time-limited download URL for private files.

```bash
curl -X POST https://test.zonevast.com/api/v1/project/project/attachment/1/download-url/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "expires_in": 300
  }'
```

**Response:**
```json
{
  "download_url": "https://cdn.zonevast.com/files/private/doc.pdf?signature=xxx&expires=123456",
  "expires_at": "2024-01-02T13:10:00Z"
}
```

---

## Bulk Operations

### Bulk Upload
Upload multiple files at once.

```bash
curl -X POST https://test.zonevast.com/api/v1/project/project/attachment/bulk-upload/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@file1.jpg" \
  -F "files=@file2.jpg" \
  -F "files=@file3.pdf" \
  -F "entity_type=product" \
  -F "entity_id=5"
```

**Response:**
```json
{
  "uploaded": 3,
  "failed": 0,
  "attachments": [
    {"id": 21, "file_name": "file1.jpg", "status": "success"},
    {"id": 22, "file_name": "file2.jpg", "status": "success"},
    {"id": 23, "file_name": "file3.pdf", "status": "success"}
  ]
}
```

---

### Bulk Delete
Delete multiple files by ID.

```bash
curl -X POST https://test.zonevast.com/api/v1/project/project/attachment/bulk-delete/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "attachment_ids": [1, 2, 3]
  }'
```

**Response:**
```json
{
  "deleted": 3,
  "failed": 0
}
```

---

## File Size Limits

| File Type | Max Size | Upload Method |
|-----------|----------|---------------|
| Images | 10 MB | Direct or Presigned |
| Documents | 25 MB | Presigned URL |
| Videos | 500 MB | Presigned URL |
| Archives | 100 MB | Presigned URL |

---

## Supported File Types

### Images
- JPEG/JPG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- SVG (.svg)
- BMP (.bmp)

### Documents
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Microsoft Excel (.xls, .xlsx)
- Microsoft PowerPoint (.ppt, .pptx)
- Text (.txt)
- CSV (.csv)

### Videos
- MP4 (.mp4)
- WebM (.webm)
- MOV (.mov)
- AVI (.avi)

### Audio
- MP3 (.mp3)
- WAV (.wav)
- OGG (.ogg)

---

## Best Practices

1. **Use presigned URLs** for files larger than 10MB
2. **Compress images** before uploading (use WebP when possible)
3. **Generate variants** for multiple display sizes
4. **Use bulk operations** for multiple files
5. **Set appropriate Content-Type** headers
6. **Clean up unused files** to manage storage costs
7. **Cache CDN URLs** on client side
8. **Use lazy loading** for images in UI

---

## Error Responses

### 400 Bad Request
```json
{
  "file": ["No file was submitted."]
}
```

### 413 Payload Too Large
```json
{
  "detail": "File size exceeds maximum allowed size of 10MB. Use presigned URL for larger files."
}
```

### 415 Unsupported Media Type
```json
{
  "detail": "File type 'application/exe' is not supported. Allowed types: jpg, png, pdf, docx, mp4, mp3"
}
```

### 507 Insufficient Storage
```json
{
  "detail": "Project storage quota exceeded. Current: 9.8GB, Limit: 10GB"
}
```

---

## JavaScript/TypeScript Example

```typescript
// Upload file with progress tracking
async function uploadFile(file: File, entityId: number, token: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entity_type', 'product');
  formData.append('entity_id', entityId.toString());

  const response = await fetch(
    'https://test.zonevast.com/api/v1/project/project/attachment/direct-upload/',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    }
  );

  return await response.json();
}

// Upload large file via presigned URL
async function uploadLargeFile(file: File, entityId: number, token: string) {
  // Step 1: Get presigned URL
  const { upload_url, file_url, attachment_id } = await fetch(
    'https://test.zonevast.com/api/v1/project/project/attachment/presigned-url/',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        entity_type: 'product',
        entity_id: entityId
      })
    }
  ).then(r => r.json());

  // Step 2: Upload to S3
  await fetch(upload_url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });

  // Step 3: Confirm upload
  await fetch(
    'https://test.zonevast.com/api/v1/project/project/attachment/confirm-upload/',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ attachment_id })
    }
  );

  return file_url;
}
```
