# CRM GraphQL API Reference

**Service:** crm-graphql
**Version:** v1
**Status:** Development
**Last Updated:** 2026-01-12

---

## Overview

The CRM GraphQL service provides a complete API for managing customer relationships, including project briefs, contact messages, sales requests, and custom template requests. Built with the Auto-API framework, it automatically generates GraphQL schemas from Python models with full CRUD operations, filtering, pagination, search, and multi-language support.

### Key Features

- **Public Form Submission** - Allow public users to submit contact forms, project briefs, and sales requests
- **Role-Based Permissions** - Public create, admin-only read/update/delete
- **Multi-Language Support** - Automatic translation fields for English and Arabic
- **Status Tracking** - Built-in workflow status fields for sales and project management
- **Contact Management** - Centralized customer contact information and inquiries
- **Sales Pipeline** - Track meeting requests and conversion status

---

## Endpoint URLs

### Environment URLs

| Environment | GraphQL Endpoint |
|------------|------------------|
| **Production** | `https://api.zonevast.com/graphql/crm` |
| **Staging** | `https://test.zonevast.com/graphql/crm` |

### Current Deployment Status

- **Port:** 4014 (local development)
- **Database:** `zonevast_autoapi` (schema: `crm`)
- **Status:** Local testing ready
- **Features:** Full preset with translations enabled

---

## Authentication

### Permission Model

The CRM service uses a hybrid authentication model:

1. **Public Creation** - Unauthenticated users can create records (form submissions)
2. **Admin Access** - Only authenticated admins can read/update/delete records

### Public Form Submission

For public forms (website contact forms, landing pages):

```bash
curl -X POST https://test.zonevast.com/graphql/crm \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { createContactMessage(...) }"}'
```

**No authentication required** for create operations.

### Admin Access

For admin operations (viewing, updating, deleting):

```bash
curl -X POST https://test.zonevast.com/graphql/crm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query": "query { contactMessages }"}'
```

### Getting a JWT Token

```bash
# Login via auth service
curl -X POST https://test.zonevast.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your_password"}'
```

---

## Available Models

The service includes the following GraphQL models:

| Model | Table | Description | Create Access | Read Access |
|-------|-------|-------------|---------------|-------------|
| **ProjectBrief** | `project_briefs` | Project requirements from potential clients | Public (`*`) | Public (`*`) |
| **ContactMessage** | `contact_messages` | General website contact form submissions | Public (`*`) | Admin only |
| **SalesRequest** | `sales_requests` | Sales meeting/appointment requests | Public (`*`) | Admin only |
| **CustomTemplateRequest** | `custom_template_requests` | Custom theme/template requests | Public (`*`) | Admin only |

---

## ProjectBrief Schema

### Type Definition

```graphql
type ProjectBrief {
  # ID
  id: ID!

  # Contact Information
  contactName: String!      # Client name
  contactEmail: String!     # Client email
  contactPhone: String      # Client phone (optional)

  # Budget Information
  budgetMin: String         # Minimum budget range
  budgetMax: String         # Maximum budget range

  # Payment Method
  paymentMethod: String     # 'one-time', 'monthly', 'milestone'

  # Status Tracking
  status: String            # 'new', 'contacted', 'quoted', 'converted', 'lost'

  # Internal Notes
  notes: String             # Sales team notes (internal use)

  # Timestamps
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime       # Soft delete
}
```

### Permissions

- **Create:** Public (`*`) - Anyone can submit project brief
- **Read:** Public (`*`) - Open access
- **Update:** `admin` only
- **Delete:** `admin` only

---

## ContactMessage Schema

### Type Definition

```graphql
type ContactMessage {
  # ID
  id: ID!

  # Sender Information
  name: String!             # Sender name
  email: String!            # Sender email

  # Message Content
  subject: String!          # Message subject line
  message: String!          # Message body

  # Read Status
  isRead: Boolean           # Whether message has been reviewed (default: false)

  # Timestamps
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime       # Soft delete
}
```

### Permissions

- **Create:** Public (`*`) - Website contact form
- **Read:** `admin` only - Protect user privacy
- **Update:** `admin` only - Mark as read
- **Delete:** `admin` only

---

## SalesRequest Schema

### Type Definition

```graphql
type SalesRequest {
  # ID
  id: ID!

  # Contact Information
  name: String!             # Client name
  email: String!            # Client email
  phone: String!            # Client phone number

  # Preferred Meeting Time
  preferredDate: DateTime!  # Preferred date for meeting
  preferredTime: String!    # Preferred time (e.g., "10:00 AM", "2:00 PM")

  # Additional Context
  message: String           # Meeting purpose or additional notes

  # Status Tracking
  status: String            # 'pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'

  # Timestamps
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime       # Soft delete
}
```

### Permissions

- **Create:** Public (`*`) - Meeting request form
- **Read:** `admin` only
- **Update:** `admin` only - Update status, confirm meetings
- **Delete:** `admin` only

---

## CustomTemplateRequest Schema

### Type Definition

```graphql
type CustomTemplateRequest {
  # ID
  id: ID!

  # Contact Information
  name: String!             # Client/Company name
  email: String!            # Contact email

  # Project Requirements
  requirements: String!     # Detailed requirements description

  # Budget and Timeline
  budget: Float             # Proposed budget
  deadline: DateTime        # Required completion date

  # Status Tracking
  status: String            # 'pending', 'under_review', 'quoted', 'in_progress', 'completed', 'cancelled'

  # Internal Notes
  notes: String             # Internal notes from design team

  # Timestamps
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime       # Soft delete
}
```

### Permissions

- **Create:** Public (`*`) - Custom template request form
- **Read:** `admin` only
- **Update:** `admin` only - Update status, add notes
- **Delete:** `admin` only

---

## Queries

### Get Single Project Brief

```graphql
query GetProjectBrief($id: ID!) {
  projectbrief(id: $id) {
    id
    contactName
    contactEmail
    contactPhone
    budgetMin
    budgetMax
    paymentMethod
    status
    notes
    createdAt
  }
}
```

**Variables:**
```json
{
  "id": "1"
}
```

### List Project Briefs

```graphql
query GetProjectBriefs {
  projectBriefs(
    filter: {
      status: "new"
    }
    orderBy: "createdAt:DESC"
  ) {
    id
    contactName
    contactEmail
    budgetMin
    budgetMax
    status
    createdAt
  }
}
```

### Get Single Contact Message (Admin)

```graphql
query GetContactMessage($id: ID!) {
  contactmessage(id: $id) {
    id
    name
    email
    subject
    message
    isRead
    createdAt
  }
}
```

**Required Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### List Contact Messages (Admin)

```graphql
query GetContactMessages {
  contactMessages(
    filter: {
      isRead: false
    }
    orderBy: "createdAt:DESC"
  ) {
    id
    name
    email
    subject
    isRead
    createdAt
  }
}
```

**Required Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Single Sales Request (Admin)

```graphql
query GetSalesRequest($id: ID!) {
  salesrequest(id: $id) {
    id
    name
    email
    phone
    preferredDate
    preferredTime
    message
    status
    createdAt
  }
}
```

### List Sales Requests (Admin)

```graphql
query GetSalesRequests {
  salesRequests(
    filter: {
      status: "pending"
    }
    orderBy: "preferredDate:ASC"
  ) {
    id
    name
    email
    phone
    preferredDate
    preferredTime
    status
    createdAt
  }
}
```

### Get Custom Template Request (Admin)

```graphql
query GetCustomTemplateRequest($id: ID!) {
  customtemplaterequest(id: $id) {
    id
    name
    email
    requirements
    budget
    deadline
    status
    notes
    createdAt
  }
}
```

### List Custom Template Requests (Admin)

```graphql
query GetCustomTemplateRequests {
  customTemplateRequests(
    filter: {
      status: "pending"
    }
    orderBy: "deadline:ASC"
  ) {
    id
    name
    email
    requirements
    budget
    deadline
    status
    createdAt
  }
}
```

---

## Mutations

### Create Project Brief (Public)

```graphql
mutation CreateProjectBrief {
  createProjectBrief(input: {
    contactName: "John Doe"
    contactEmail: "john@example.com"
    contactPhone: "+1234567890"
    budgetMin: "5000"
    budgetMax: "10000"
    paymentMethod: "milestone"
    status: "new"
  }) {
    id
    contactName
    contactEmail
    status
    createdAt
  }
}
```

**No authentication required.**

### Update Project Brief (Admin)

```graphql
mutation UpdateProjectBrief($id: ID!) {
  updateProjectBrief(
    id: $id
    input: {
      status: "contacted"
      notes: "Initial call scheduled for next week"
    }
  ) {
    id
    status
    notes
    updatedAt
  }
}
```

**Required Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Create Contact Message (Public)

```graphql
mutation CreateContactMessage {
  createContactMessage(input: {
    name: "Test User"
    email: "test@example.com"
    subject: "Test Inquiry"
    message: "This is a test message from the CRM API documentation"
  }) {
    id
    name
    email
    subject
    message
    isRead
    createdAt
  }
}
```

**No authentication required.**

### Mark Contact Message as Read (Admin)

```graphql
mutation MarkAsRead($id: ID!) {
  updateContactMessage(
    id: $id
    input: {
      isRead: true
    }
  ) {
    id
    isRead
    updatedAt
  }
}
```

**Required Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Create Sales Request (Public)

```graphql
mutation CreateSalesRequest {
  createSalesRequest(input: {
    name: "Jane Smith"
    email: "jane@example.com"
    phone: "+1987654321"
    preferredDate: "2026-02-01T10:00:00"
    preferredTime: "2:00 PM"
    message: "Interested in enterprise solution"
    status: "pending"
  }) {
    id
    name
    email
    preferredDate
    preferredTime
    status
    createdAt
  }
}
```

**No authentication required.**

### Confirm Sales Meeting (Admin)

```graphql
mutation ConfirmMeeting($id: ID!) {
  updateSalesRequest(
    id: $id
    input: {
      status: "confirmed"
    }
  ) {
    id
    status
    updatedAt
  }
}
```

**Required Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Create Custom Template Request (Public)

```graphql
mutation CreateCustomTemplateRequest {
  createCustomTemplateRequest(input: {
    name: "Acme Corp"
    email: "contact@acme.com"
    requirements: "Need custom e-commerce theme with dark mode"
    budget: 15000
    deadline: "2026-03-15T00:00:00"
    status: "pending"
  }) {
    id
    name
    email
    budget
    deadline
    status
    createdAt
  }
}
```

**No authentication required.**

### Update Template Request Status (Admin)

```graphql
mutation UpdateTemplateRequest($id: ID!) {
  updateCustomTemplateRequest(
    id: $id
    input: {
      status: "under_review"
      notes: "Reviewing requirements, will prepare quote"
    }
  ) {
    id
    status
    notes
    updatedAt
  }
}
```

**Required Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Delete Records (Admin)

```graphql
mutation DeleteContactMessage($id: ID!) {
  deleteContactMessage(id: $id)
}

mutation DeleteSalesRequest($id: ID!) {
  deleteSalesRequest(id: $id)
}

mutation DeleteProjectBrief($id: ID!) {
  deleteProjectBrief(id: $id)
}
```

**Required Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Filtering

### Filter Operators

**String Fields:**
- `field` - Exact match
- `field_contains` - Contains substring
- `field_startswith` - Starts with
- `field_endswith` - Ends with
- `field_icontains` - Case-insensitive contains

**Boolean Fields:**
- `field` - Exact match (true/false)

**Date Fields:**
- `field` - Exact match
- `field_gte` - Date is after or on
- `field_lte` - Date is before or on

**Numeric Fields:**
- `field` - Exact match
- `field_gte` - Greater than or equal
- `field_lte` - Less than or equal

### Examples

**Filter by Status:**
```graphql
query {
  projectBriefs(filter: {
    status: "new"
  }) {
    id
    contactName
    status
  }
}
```

**Filter Unread Messages:**
```graphql
query {
  contactMessages(filter: {
    isRead: false
  }) {
    id
    name
    subject
    isRead
  }
}
```

**Filter by Date Range:**
```graphql
query {
  salesRequests(filter: {
    preferredDate_gte: "2026-02-01"
    preferredDate_lte: "2026-02-28"
    status: "pending"
  }) {
    id
    name
    preferredDate
    status
  }
}
```

**Filter by Budget:**
```graphql
query {
  customTemplateRequests(filter: {
    budget_gte: 10000
    status: "pending"
  }) {
    id
    name
    budget
    status
  }
}
```

**Email Search:**
```graphql
query {
  contactMessages(filter: {
    email_contains: "example.com"
  }) {
    id
    name
    email
  }
}
```

---

## Sorting

### Sorting Options

Use the `orderBy` parameter with format: `"field:DIRECTION"`

**Direction:** `ASC` (ascending) or `DESC` (descending)

**Sortable Fields:**
- **ProjectBrief:** `createdAt`, `updatedAt`, `status`
- **ContactMessage:** `createdAt`, `updatedAt`, `isRead`
- **SalesRequest:** `createdAt`, `updatedAt`, `preferredDate`, `status`
- **CustomTemplateRequest:** `createdAt`, `updatedAt`, `deadline`, `budget`, `status`

### Examples

```graphql
# Newest first
query {
  projectBriefs(orderBy: "createdAt:DESC") {
    id
    contactName
    createdAt
  }
}

# Oldest unread first
query {
  contactMessages(
    filter: { isRead: false }
    orderBy: "createdAt:ASC"
  ) {
    id
    name
    createdAt
  }
}

# Upcoming meetings
query {
  salesRequests(
    filter: { status: "pending" }
    orderBy: "preferredDate:ASC"
  ) {
    id
    name
    preferredDate
  }
}

# High budget requests first
query {
  customTemplateRequests(
    orderBy: "budget:DESC"
  ) {
    id
    name
    budget
  }
}
```

---

## Error Handling

### Error Response Format

```json
{
  "errors": [{
    "message": "Permission denied: Role 'guest' not allowed to read ContactMessage. Required roles: ['admin']",
    "type": "Exception",
    "locations": [{"line": 1, "column": 9}],
    "path": ["contactMessages"]
  }],
  "data": null
}
```

### Common Error Codes

| Error | Description | Solution |
|-------|-------------|----------|
| `Permission denied` | Insufficient permissions | Provide JWT token for admin operations |
| `Required roles: ['admin']` | Admin-only operation | Authenticate with admin account |
| `Cannot query field` | Invalid field name | Check schema for correct field names (camelCase) |
| `Unknown argument` | Invalid filter/sort parameter | Use valid filter/sort options |
| `VALIDATION_ERROR` | Invalid input data | Check required fields and data types |

### Field Naming Convention

The GraphQL API uses **camelCase** for field names:

| Python Model | GraphQL Field |
|--------------|---------------|
| `contact_name` | `contactName` |
| `contact_email` | `contactEmail` |
| `is_read` | `isRead` |
| `created_at` | `createdAt` |
| `preferred_date` | `preferredDate` |
| `preferred_time` | `preferredTime` |

---

## Testing Examples

### Test Contact Form Submission

```bash
curl -X POST https://test.zonevast.com/graphql/crm \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createContactMessage(input: {name: \"Test User\", email: \"test@example.com\", subject: \"Test Inquiry\", message: \"This is a test message\"}) { id name email subject createdAt } }"
  }'
```

**Expected Response:**
```json
{
  "data": {
    "createContactMessage": {
      "id": "2",
      "name": "Test User",
      "email": "test@example.com",
      "subject": "Test Inquiry",
      "createdAt": "2026-01-11T21:58:04.887896"
    }
  }
}
```

### Test Project Brief Submission

```bash
curl -X POST https://test.zonevast.com/graphql/crm \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createProjectBrief(input: {contactName: \"John Doe\", contactEmail: \"john@example.com\", contactPhone: \"+1234567890\", budgetMin: \"5000\", budgetMax: \"10000\", paymentMethod: \"milestone\", status: \"new\"}) { id contactName contactEmail status createdAt } }"
  }'
```

### Test Sales Request Submission

```bash
curl -X POST https://test.zonevast.com/graphql/crm \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createSalesRequest(input: {name: \"Jane Smith\", email: \"jane@example.com\", phone: \"+1987654321\", preferredDate: \"2026-02-01T10:00:00\", preferredTime: \"2:00 PM\", message: \"Interested in enterprise solution\", status: \"pending\"}) { id name email preferredDate preferredTime status } }"
  }'
```

**Expected Response:**
```json
{
  "data": {
    "createSalesRequest": {
      "id": "1",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "preferredDate": "2026-02-01T10:00:00",
      "preferredTime": "2:00 PM",
      "status": "pending"
    }
  }
}
```

### Test Custom Template Request

```bash
curl -X POST https://test.zonevast.com/graphql/crm \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createCustomTemplateRequest(input: {name: \"Acme Corp\", email: \"contact@acme.com\", requirements: \"Need custom e-commerce theme\", budget: 15000, deadline: \"2026-03-15T00:00:00\", status: \"pending\"}) { id name email budget deadline status } }"
  }'
```

**Expected Response:**
```json
{
  "data": {
    "createCustomTemplateRequest": {
      "id": "1",
      "name": "Acme Corp",
      "email": "contact@acme.com",
      "budget": 15000.0,
      "deadline": "2026-03-15T00:00:00",
      "status": "pending"
    }
  }
}
```

---

## Schema Introspection

### Get All Queries

```graphql
query GetQueries {
  __schema {
    queryType {
      fields {
        name
        description
      }
    }
  }
}
```

### Get All Mutations

```graphql
query GetMutations {
  __schema {
    mutationType {
      fields {
        name
        description
      }
    }
  }
}
```

### Get Model Type

```graphql
query GetProjectBriefType {
  __type(name: "ProjectBrief") {
    fields {
      name
      type {
        name
        ofType {
          name
        }
      }
      description
    }
  }
}
```

---

## Use Cases

### 1. Website Contact Form

Allow visitors to submit general inquiries:

```graphql
mutation SubmitContactForm {
  createContactMessage(input: {
    name: "Website Visitor"
    email: "visitor@example.com"
    subject: "General Inquiry"
    message: "I have a question about your services"
  }) {
    id
    createdAt
  }
}
```

### 2. Project Brief Collection

Capture potential client requirements:

```graphql
mutation SubmitProjectBrief {
  createProjectBrief(input: {
    contactName: "Sarah Johnson"
    contactEmail: "sarah@company.com"
    contactPhone: "+1-555-0123"
    budgetMin: "10000"
    budgetMax: "25000"
    paymentMethod: "milestone"
    status: "new"
  }) {
    id
    status
  }
}
```

### 3. Sales Meeting Scheduling

Let prospects request sales meetings:

```graphql
mutation RequestSalesMeeting {
  createSalesRequest(input: {
    name: "Mike Chen"
    email: "mike@startup.io"
    phone: "+1-555-9876"
    preferredDate: "2026-02-15T14:00:00"
    preferredTime: "2:00 PM"
    message: "Interested in enterprise plan for 50 users"
    status: "pending"
  }) {
    id
    preferredDate
    status
  }
}
```

### 4. Custom Template Requests

Collect custom design work requests:

```graphql
mutation RequestCustomTemplate {
  createCustomTemplateRequest(input: {
    name: "Tech Startup Inc"
    email: "design@techstartup.com"
    requirements: "Modern SaaS dashboard theme with dark mode, responsive design, and RTL support for Arabic"
    budget: 20000
    deadline: "2026-04-01T00:00:00"
    status: "pending"
  }) {
    id
    status
  }
}
```

### 5. Admin Dashboard - New Leads

Admin view of new project briefs requiring follow-up:

```graphql
query GetNewLeads {
  projectBriefs(
    filter: {
      status: "new"
    }
    orderBy: "createdAt:DESC"
  ) {
    id
    contactName
    contactEmail
    budgetMin
    budgetMax
    paymentMethod
    createdAt
  }
}
```

**Required Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### 6. Admin Dashboard - Unread Messages

Admin view of unread contact messages:

```graphql
query GetUnreadMessages {
  contactMessages(
    filter: {
      isRead: false
    }
    orderBy: "createdAt:DESC"
  ) {
    id
    name
    email
    subject
    message
    createdAt
  }
}
```

**Required Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### 7. Sales Pipeline - Upcoming Meetings

View upcoming confirmed meetings:

```graphql
query GetUpcomingMeetings {
  salesRequests(
    filter: {
      status: "confirmed"
      preferredDate_gte: "2026-01-12"
    }
    orderBy: "preferredDate:ASC"
  ) {
    id
    name
    email
    phone
    preferredDate
    preferredTime
    message
  }
}
```

**Required Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Deployment

### Deploy to Lambda

```bash
cd /home/yousef/Documents/workspace/zonevast/services/graphql/autoapi-projects/crm-graphql

# Build deployment package
python3 deploy_lambda.py

# Or using manage.py
python3 manage.py deploy staging
```

---

## Database Schema

### Tables

```sql
-- Project Briefs
CREATE TABLE project_briefs (
  id SERIAL PRIMARY KEY,
  contact_name VARCHAR(200) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  budget_min VARCHAR(50),
  budget_max VARCHAR(50),
  payment_method VARCHAR(50),
  status VARCHAR(20),
  notes VARCHAR(5000),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Contact Messages
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message VARCHAR(5000) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Sales Requests
CREATE TABLE sales_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  preferred_date TIMESTAMP NOT NULL,
  preferred_time VARCHAR(50) NOT NULL,
  message VARCHAR(2000),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Custom Template Requests
CREATE TABLE custom_template_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  requirements VARCHAR(5000) NOT NULL,
  budget FLOAT,
  deadline TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending',
  notes VARCHAR(5000),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

---

### Environment Variables

Required for production deployment:

```bash
JWT_SECRET=your-secret-key
DB_HOST=your-db-host
DB_PORT=5432
DB_DATABASE=zonevast_autoapi
DB_USER=postgres
DB_PASSWORD=your-password
```

---

## Related Documentation

- **Auto-API Framework:** `/services/graphql/auto-api-framework/`
- **CRM Models:** `/services/graphql/autoapi-projects/crm-graphql/models/`
- **Handler Config:** `/services/graphql/autoapi-projects/crm-graphql/handler.py`
- **Product GraphQL:** `/zonevast-docs/api/graphql/product.md`
- **Inventory GraphQL:** `/zonevast-docs/api/graphql/inventory.md`

---

## Support

For issues or questions:
1. Check service logs: Check console output when running locally
2. Verify JWT token is valid for admin operations
3. Test mutations without authentication (public create)
4. Test queries with JWT authentication (admin read)
5. Check field names use camelCase convention
6. Verify database connection and migrations

---

## Status Workflows

### Project Brief Status Flow

```
new → contacted → quoted → converted
                  ↓
                lost
```

### Sales Request Status Flow

```
pending → confirmed → completed
            ↓
        rescheduled → cancelled
```

### Custom Template Request Status Flow

```
pending → under_review → quoted → in_progress → completed
                                     ↓
                                 cancelled
```

### Contact Message Status

```
isRead: false → true (mark as reviewed)
```

---

## Testing Checklist

- [x] Create ContactMessage (public)
- [x] Create ProjectBrief (public)
- [x] Create SalesRequest (public)
- [x] Create CustomTemplateRequest (public)
- [x] Query returns permission error for guest (expected)
- [x] Fields use camelCase naming convention
- [x] DateTime fields accept ISO 8601 format
- [x] Float fields accept numeric values
- [ ] Query with JWT authentication (admin)
- [ ] Update operations (admin)
- [ ] Delete operations (admin)
- [ ] Deploy to staging environment
