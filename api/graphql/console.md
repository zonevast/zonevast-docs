# Console GraphQL API Reference

**Service:** console-graphql
**Version:** v1
**Status:** Active
**Last Updated:** 2026-01-12

---

## Overview

The Console GraphQL service provides a complete API for managing developer console projects, tasks, deployments, code reviews, API keys, and developer deals. Built with the Auto-API framework, it automatically generates GraphQL schemas from Python models with full CRUD operations, filtering, pagination, search, and multi-language support.

### Key Features

- **Project Management** - Create and manage developer projects with team tracking
- **Task Management** - Detailed tasks with step tracking, priorities, and rewards
- **Deployment Tracking** - Version-controlled deployments with metrics
- **Code Reviews** - Review workflow with diff tracking and comments
- **API Key Management** - Secure developer API keys with usage tracking
- **Deal Management** - Developer contracts and payment terms
- **Complete CRUD Operations** - Queries and mutations for all models
- **Advanced Filtering** - String, numeric, boolean, date filters with logical operators
- **Pagination** - Offset-based and cursor-based pagination support
- **Multi-Language Support** - Automatic translation fields for English and Arabic
- **Authentication** - JWT-based auth with role-based permissions

---

## Endpoint URLs

### Environment URLs

| Environment | GraphQL Endpoint |
|------------|------------------|
| **Production** | `https://api.zonevast.com/graphql/console` |
| **Staging** | `https://test.zonevast.com/graphql/console` |

### Current Deployment Status

- **Region:** me-south-1
- **Lambda Function:** `console-graphql`
- **Local Port:** 4013
- **Status:** Active

---

## Authentication

### JWT Token Required

Most operations require authentication. Include JWT token in the Authorization header:

```bash
curl -X POST https://test.zonevast.com/graphql/console \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query": "mutation { createConsoleProject(...) }"}'
```

### Getting a JWT Token

```bash
# Login via auth service
curl -X POST https://test.zonevast.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

### Project Context

All operations require a `project_id` context, which can be provided via:

1. **Header:** `X-Project-Id: 1`
2. **JWT Token:** Included in token claims
3. **Auto-population:** From authenticated user context

---

## Available Models

The service includes the following GraphQL models:

| Model | Table | Description | Auth Required |
|-------|-------|-------------|---------------|
| **ConsoleProject** | `console_projects` | Developer console projects | Authenticated |
| **ConsoleTask** | `console_tasks` | Tasks within projects | Authenticated |
| **Deployment** | `deployments` | Deployment records | Authenticated |
| **DeploymentMetrics** | `deployment_metrics` | Performance metrics | Authenticated |
| **CodeReview** | `code_reviews` | Code review records | Authenticated |
| **DeveloperApiKey** | `developer_api_keys` | Developer API keys | Authenticated |
| **DeveloperDeal** | `developer_deals` | Developer contracts/deals | Authenticated |

---

## ConsoleProject Schema

### Type Definition

```graphql
type ConsoleProject {
  # ID
  id: ID!

  # User reference (from zv-auth-service)
  user_id: Int!

  # Translatable fields
  name: String!           # Language-aware
  name_en: String         # English
  name_ar: String         # Arabic

  description: String     # Language-aware
  description_en: String
  description_ar: String

  # Project configuration
  type: String!           # web, mobile, api, microservice (default: web)
  mode: String!           # development, staging, production (default: development)
  status: String!         # planning, active, completed, archived (default: planning)

  # Progress tracking
  progress: Int!          # 0-100 percentage
  team_size: Int!         # Number of team members (default: 1)
  bonus: Float!           # Bonus allocated for project (default: 0.0)

  # Timestamps
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime    # Soft delete

  # Relationships
  tasks: [ConsoleTask!]!
  deployments: [Deployment!]!
}
```

### Permissions

- **Create:** `authenticated`
- **Read:** `authenticated`
- **Update:** `project_owner`, `admin`
- **Delete:** `project_owner`, `admin`

### Searchable Fields

- `name`
- `description`
- `type`

### Filterable Fields

- `user_id`
- `type`
- `mode`
- `status`
- `team_size`

### Sortable Fields

- `name`
- `created_at`
- `progress`
- `bonus`

---

## ConsoleTask Schema

### Type Definition

```graphql
type ConsoleTask {
  # ID
  id: ID!

  # References
  project_id: Int!
  user_id: Int!

  # Translatable fields
  title: String!          # Language-aware
  title_en: String
  title_ar: String

  description: String     # Language-aware
  description_en: String
  description_ar: String

  # Task configuration
  status: String!         # pending, in_progress, completed, cancelled (default: pending)
  priority: String!       # low, medium, high, critical (default: medium)

  # Dates and rewards
  due_date: DateTime
  reward: Float!          # Reward amount (default: 0.0)
  estimated_hours: Float! # Hours to complete (default: 0.0)

  # Lists
  steps: [TaskStep!]      # [{"step": "Design UI", "completed": false}, ...]
  attachments: [Attachment!] # [{"name": "spec.pdf", "url": "s3://...", "type": "application/pdf"}, ...]

  # Timestamps
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime

  # Relationships
  project: ConsoleProject!
  reviews: [CodeReview!]!
}
```

### Permissions

- **Create:** `authenticated`
- **Read:** `authenticated`
- **Update:** `project_owner`, `admin`
- **Delete:** `project_owner`, `admin`

### Searchable Fields

- `title`
- `description`

### Filterable Fields

- `project_id`
- `user_id`
- `status`
- `priority`
- `due_date`

### Sortable Fields

- `title`
- `created_at`
- `due_date`
- `priority`
- `reward`

---

## Deployment Schema

### Type Definition

```graphql
type Deployment {
  # ID
  id: ID!

  # References
  project_id: Int!

  # Deployment info
  name: String!
  description: String
  type: String!          # lambda, ecs, ec2, fargate (default: lambda)
  url: String            # Deployment URL
  status: String!        # pending, deploying, success, failed, rolled_back (default: pending)

  # Version control
  version: String!
  latest_version: String
  branch: String         # Git branch
  commit_hash: String    # Commit hash

  # Infrastructure
  region: String!        # AWS region (default: me-south-1)

  # Metrics (legacy fields, use DeploymentMetrics instead)
  cpu_usage: Float!      # CPU percentage (default: 0.0)
  memory_usage: Float!   # Memory percentage (default: 0.0)

  # Template tracking
  is_template: Boolean!  # Is this a template? (default: false)
  downloads: Int!        # Download count (default: 0)
  views: Int!            # View count (default: 0)

  # Timestamps
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime

  # Relationships
  project: ConsoleProject!
  metrics: [DeploymentMetrics!]!
}
```

### Permissions

- **Create:** `authenticated`
- **Read:** `authenticated`
- **Update:** `project_owner`, `admin`
- **Delete:** `project_owner`, `admin`

### Searchable Fields

- `name`
- `description`
- `version`

### Filterable Fields

- `project_id`
- `type`
- `status`
- `region`
- `is_template`

### Sortable Fields

- `name`
- `created_at`
- `version`
- `cpu_usage`
- `memory_usage`
- `downloads`
- `views`

---

## DeploymentMetrics Schema

### Type Definition

```graphql
type DeploymentMetrics {
  # ID
  id: ID!

  # References
  deployment_id: Int!

  # Performance metrics
  cpu_usage: Float!              # CPU percentage (default: 0.0)
  memory_usage: Float!           # Memory percentage (default: 0.0)
  response_time: Float!          # Response time in ms (default: 0.0)
  error_rate: Float!             # Error percentage (default: 0.0)
  requests_per_minute: Float!    # RPM (default: 0.0)

  # Timestamps
  created_at: DateTime!
  updated_at: DateTime!

  # Relationships
  deployment: Deployment!
}
```

### Permissions

- **Create:** `authenticated`
- **Read:** `authenticated`
- **Update:** `project_owner`, `admin`
- **Delete:** `project_owner`, `admin`

### Filterable Fields

- `deployment_id`

### Sortable Fields

- `created_at`
- `cpu_usage`
- `memory_usage`
- `response_time`
- `error_rate`

---

## CodeReview Schema

### Type Definition

```graphql
type CodeReview {
  # ID
  id: ID!

  # References
  task_id: Int!
  reviewer_id: Int!

  # Review info
  status: String!        # pending, approved, changes_requested, rejected (default: pending)
  feedback: String       # Review feedback
  date: DateTime         # Review date

  # Lists
  diff: [DiffChange!]    # [{"file": "app.js", "additions": 10, "deletions": 5}, ...]
  comments: [ReviewComment!] # [{"file": "app.js", "line": 42, "comment": "Consider refactoring"}, ...]

  # Timestamps
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime

  # Relationships
  task: ConsoleTask!
}
```

### Permissions

- **Create:** `authenticated`
- **Read:** `authenticated`
- **Update:** `project_owner`, `admin`, `reviewer`
- **Delete:** `project_owner`, `admin`

### Searchable Fields

- `feedback`

### Filterable Fields

- `task_id`
- `reviewer_id`
- `status`
- `date`

### Sortable Fields

- `created_at`
- `date`
- `status`

---

## DeveloperApiKey Schema

### Type Definition

```graphql
type DeveloperApiKey {
  # ID
  id: ID!

  # User reference
  user_id: Int!

  # Key info
  name: String!          # API key name
  key: String!           # The actual API key (unique)
  key_prefix: String!    # Display prefix (e.g., "zk_live_...")
  last_used: DateTime    # Last used timestamp
  status: String!        # active, inactive, revoked, expired (default: active)

  # Timestamps
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}
```

### Permissions

- **Create:** `authenticated`
- **Read:** `authenticated`
- **Update:** `project_owner`, `admin`
- **Delete:** `project_owner`, `admin`

### Searchable Fields

- `name`
- `key_prefix`

### Filterable Fields

- `user_id`
- `status`
- `last_used`

### Sortable Fields

- `name`
- `created_at`
- `last_used`

### Auto-Generation

The `key` and `key_prefix` fields are automatically generated on create:
- Key format: `zk_live_{32_random_characters}`
- Prefix: First 12 characters of key

---

## DeveloperDeal Schema

### Type Definition

```graphql
type DeveloperDeal {
  # ID
  id: ID!

  # References
  project_id: Int!

  # Deal info (translatable)
  title: String!         # Language-aware
  title_en: String
  title_ar: String

  # Financials
  price: Float!          # Deal price/amount (default: 0.0)

  # Terms
  conditions: JSON       # Deal conditions as JSON
  payment_terms: String! # upfront, milestone, completion (default: completion)

  # Dates
  start_date: DateTime
  end_date: DateTime

  # Status
  status: String!        # draft, active, completed, cancelled, expired (default: draft)

  # Attachments and notes
  attachments: [Attachment!] # [{"name": "contract.pdf", "url": "s3://...", "type": "application/pdf"}, ...]
  reviewer_notes: String

  # Timestamps
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime

  # Relationships
  project: ConsoleProject!
}
```

### Permissions

- **Create:** `authenticated`
- **Read:** `authenticated`
- **Update:** `project_owner`, `admin`
- **Delete:** `project_owner`, `admin`

### Searchable Fields

- `title`
- `reviewer_notes`

### Filterable Fields

- `project_id`
- `status`
- `payment_terms`
- `start_date`
- `end_date`

### Sortable Fields

- `title`
- `created_at`
- `price`
- `start_date`
- `end_date`

---

## Queries

### Get Single Project

```graphql
query GetConsoleProject($id: ID!) {
  consoleProject(id: $id) {
    id
    name
    description
    type
    mode
    status
    progress
    team_size
    bonus
    created_at
  }
}
```

**Variables:**
```json
{
  "id": "123"
}
```

### List Projects

```graphql
query GetConsoleProjects {
  consoleProjects(
    filter: {
      status: "active"
      type: "web"
    }
    pagination: {
      offset: 0
      limit: 20
    }
    orderBy: "created_at:DESC"
  ) {
    edges {
      id
      name
      type
      status
      progress
      team_size
      createdAt
    }
    pageInfo {
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
}
```

### Search Projects

```graphql
query SearchProjects {
  consoleProjects(
    search: "ecommerce platform"
    filter: {
      status: "active"
    }
  ) {
    edges {
      id
      name
      description
    }
  }
}
```

### Get Project with Tasks

```graphql
query GetProjectWithTasks($id: ID!) {
  consoleProject(id: $id) {
    id
    name
    description
    status
    progress
    tasks(
      filter: {
        status: "in_progress"
      }
      orderBy: "priority:DESC"
    ) {
      edges {
        id
        title
        status
        priority
        dueDate
        reward
      }
    }
  }
}
```

### Get Tasks

```graphql
query GetTasks {
  consoleTasks(
    filter: {
      project_id: 1
      status: "pending"
    }
    orderBy: "priority:DESC"
  ) {
    edges {
      id
      title
      description
      status
      priority
      dueDate
      reward
      estimatedHours
      steps
    }
  }
}
```

### Get Deployments

```graphql
query GetDeployments {
  deployments(
    filter: {
      project_id: 1
      status: "success"
    }
    orderBy: "created_at:DESC"
  ) {
    edges {
      id
      name
      version
      status
      type
      region
      cpu_usage
      memory_usage
      createdAt
    }
  }
}
```

### Get Deployment with Metrics

```graphql
query GetDeploymentWithMetrics($id: ID!) {
  deployment(id: $id) {
    id
    name
    version
    status
    type
    url
    metrics(
      orderBy: "created_at:DESC"
      pagination: {
        limit: 10
      }
    ) {
      edges {
        id
        cpu_usage
        memory_usage
        response_time
        error_rate
        requests_per_minute
        createdAt
      }
    }
  }
}
```

### Get Code Reviews

```graphql
query GetCodeReviews {
  codeReviews(
    filter: {
      status: "pending"
    }
    orderBy: "created_at:ASC"
  ) {
    edges {
      id
      task_id
      reviewer_id
      status
      feedback
      date
      diff
      comments
    }
  }
}
```

### Get Developer API Keys

```graphql
query GetApiKeys {
  developerApiKeys(
    filter: {
      status: "active"
    }
  ) {
    edges {
      id
      name
      key_prefix
      last_used
      status
      createdAt
    }
  }
}
```

### Get Developer Deals

```graphql
query GetDeals {
  developerDeals(
    filter: {
      status: "active"
      payment_terms: "milestone"
    }
    orderBy: "price:DESC"
  ) {
    edges {
      id
      title
      price
      payment_terms
      status
      start_date
      end_date
    }
  }
}
```

### Multi-Language Query

```graphql
query GetProjectI18n($id: ID!) {
  consoleProject(id: $id) {
    id
    name_en
    name_ar
    description_en
    description_ar
  }
}
```

---

## Mutations

### Create Console Project

```graphql
mutation CreateConsoleProject {
  createConsoleProject(input: {
    user_id: 1
    name: "E-Commerce Platform"
    description: "Multi-vendor marketplace platform"
    type: "web"
    mode: "development"
    status: "planning"
    team_size: 5
    bonus: 5000.0
  }) {
    id
    name
    description
    type
    status
    progress
    team_size
    bonus
    created_at
  }
}
```

**Required Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Console Project

```graphql
mutation UpdateConsoleProject($id: ID!) {
  updateConsoleProject(
    id: $id
    input: {
      status: "active"
      progress: 75
    }
  ) {
    id
    name
    status
    progress
    updated_at
  }
}
```

### Create Console Task

```graphql
mutation CreateConsoleTask {
  createConsoleTask(input: {
    project_id: 1
    user_id: 1
    title: "Design User Authentication System"
    description: "Implement JWT-based authentication with OAuth support"
    status: "pending"
    priority: "high"
    reward: 500.0
    estimated_hours: 40.0
    steps: [
      {step: "Design database schema", completed: true},
      {step: "Implement auth endpoints", completed: false},
      {step: "Add OAuth providers", completed: false},
      {step: "Write tests", completed: false}
    ]
    attachments: []
  }) {
    id
    title
    status
    priority
    reward
    steps
  }
}
```

### Update Console Task

```graphql
mutation UpdateConsoleTask($id: ID!) {
  updateConsoleTask(
    id: $id
    input: {
      status: "completed"
      steps: [
        {step: "Design database schema", completed: true},
        {step: "Implement auth endpoints", completed: true},
        {step: "Add OAuth providers", completed: true},
        {step: "Write tests", completed: true}
      ]
    }
  ) {
    id
    title
    status
    steps
  }
}
```

### Create Deployment

```graphql
mutation CreateDeployment {
  createDeployment(input: {
    project_id: 1
    name: "Production Release v1.0.0"
    description: "First production deployment"
    type: "lambda"
    version: "1.0.0"
    region: "me-south-1"
    status: "deploying"
    branch: "main"
    commit_hash: "abc123def456"
  }) {
    id
    name
    version
    status
    type
    region
    created_at
  }
}
```

### Create Deployment Metrics

```graphql
mutation CreateDeploymentMetrics {
  createDeploymentMetrics(input: {
    deployment_id: 1
    cpu_usage: 45.5
    memory_usage: 62.3
    response_time: 120.5
    error_rate: 0.01
    requests_per_minute: 150.0
  }) {
    id
    deployment_id
    cpu_usage
    memory_usage
    response_time
    created_at
  }
}
```

### Create Code Review

```graphql
mutation CreateCodeReview {
  createCodeReview(input: {
    task_id: 1
    reviewer_id: 2
    status: "approved"
    feedback: "Great implementation! Consider adding more error handling."
    date: "2026-01-12T10:00:00Z"
    diff: [
      {file: "auth.py", additions: 45, deletions: 12},
      {file: "models.py", additions: 20, deletions: 5}
    ]
    comments: [
      {file: "auth.py", line: 42, comment: "Consider using async here"},
      {file: "models.py", line: 15, comment: "Add field validation"}
    ]
  }) {
    id
    task_id
    status
    feedback
    diff
    comments
  }
}
```

### Create Developer API Key

```graphql
mutation CreateApiKey {
  createDeveloperApiKey(input: {
    user_id: 1
    name: "Production API Key"
    status: "active"
  }) {
    id
    name
    key
    key_prefix
    status
    created_at
  }
}
```

**Note:** The `key` and `key_prefix` are auto-generated if not provided.

### Create Developer Deal

```graphql
mutation CreateDeveloperDeal {
  createDeveloperDeal(input: {
    project_id: 1
    title: "Frontend Development Contract"
    price: 15000.0
    payment_terms: "milestone"
    start_date: "2026-01-01T00:00:00Z"
    end_date: "2026-06-30T00:00:00Z"
    status: "active"
    conditions: {
      milestones: [
        {name: "UI Design", amount: 3000},
        {name: "Frontend Development", amount: 8000},
        {name: "Testing & Deployment", amount: 4000}
      ]
    }
    reviewer_notes: "Experienced developer with strong React skills"
  }) {
    id
    title
    price
    payment_terms
    status
    start_date
    end_date
  }
}
```

### Delete (Soft Delete)

```graphql
mutation DeleteProject($id: ID!) {
  deleteConsoleProject(id: $id)
}
```

### Restore

```graphql
mutation RestoreProject($id: ID!) {
  restoreConsoleProject(id: $id) {
    id
    name
    deleted_at
  }
}
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

**Numeric Fields:**
- `field` - Exact match
- `field_gte` - Greater than or equal
- `field_lte` - Less than or equal
- `field_gt` - Greater than
- `field_lt` - Less than

**Boolean Fields:**
- `field` - Exact match

**Date Fields:**
- `field` - Exact match
- `field_gte` - Date is after or on
- `field_lte` - Date is before or on

### Logical Operators

**AND:**
```graphql
filter: {
  AND: [
    { status: "active" }
    { type: "web" }
    { progress_gte: 50 }
  ]
}
```

**OR:**
```graphql
filter: {
  OR: [
    { status: "pending" }
    { status: "in_progress" }
  ]
}
```

**NOT:**
```graphql
filter: {
  NOT: {
    status: "archived"
  }
}
```

**Complex Nested:**
```graphql
filter: {
  AND: [
    {
      OR: [
        { type: "web" }
        { type: "api" }
      ]
    }
    { status: "active" }
    { progress_gte: 25 }
  ]
}
```

---

## Error Handling

### Error Response Format

```json
{
  "errors": [{
    "message": "Permission denied: Authentication required",
    "locations": [{"line": 2, "column": 3}],
    "path": ["createConsoleProject"],
    "extensions": {
      "code": "UNAUTHENTICATED",
      "status": 401
    }
  }],
  "data": null
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHENTICATED` | 401 | No JWT token or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `SERVICE_ERROR` | 500 | External service failure |
| `DATABASE_ERROR` | 500 | Database operation failed |

---

## Schema Introspection

### Get Schema Types

```graphql
query Introspection {
  __schema {
    types {
      name
      kind
      description
    }
  }
}
```

### Get Query Type

```graphql
query GetQueries {
  __schema {
    queryType {
      fields {
        name
        description
        args {
          name
          type {
            name
          }
        }
      }
    }
  }
}
```

### Get Mutation Type

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

---

## Testing the API

### Using cURL

```bash
# Simple query
curl -X POST https://test.zonevast.com/graphql/console \
  -H "Content-Type: application/json" \
  -d '{"query": "query { consoleProjects { edges { id name } } }"}'

# Authenticated mutation
curl -X POST https://test.zonevast.com/graphql/console \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query": "mutation { createConsoleProject(input: {name: \"Test\"}) { id name } }"}'
```

### Using GraphQL Playground

1. Open GraphQL Playground or Postman
2. Set URL to: `https://test.zonevast.com/graphql/console`
3. Add header: `Authorization: Bearer YOUR_TOKEN` (for mutations)
4. Execute queries

---

## Language Support

The service supports two languages with automatic field generation:

- **English (en)** - Default/source language
- **Arabic (ar)** - Auto-translated

### Language-Aware Fields

Translatable fields automatically get language-specific versions:

```graphql
type ConsoleProject {
  name: String!      # Returns language based on Accept-Language header
  name_en: String    # Explicit English
  name_ar: String    # Explicit Arabic
}
```

### Setting Language

Via HTTP Header:
```
Accept-Language: ar
```

---

## Performance Tips

1. **Use Filters Over Search** - Filters are more efficient for exact matching
2. **Limit Result Sets** - Always use pagination for large datasets
3. **Select Specific Fields** - Only request fields you need
4. **Use Aggregates** - Better than counting results manually
5. **Leverage Indexes** - Filterable fields are automatically indexed

---

## Deployment

### Deploy to Lambda

```bash
cd /home/yousef/Documents/workspace/zonevast/services/graphql/autoapi-projects/console-graphql

# Run migrations
python3 manage.py migrate

# Deploy to staging
python3 deploy_lambda.py

# Or via manage.py
python3 manage.py deploy staging
```

### Check Service Status

```bash
python3 manage.py info
```

---

## Related Documentation

- **Auto-API Framework:** `/services/graphql/auto-api-framework/`
- **Console Models:** `/services/graphql/autoapi-projects/console-graphql/models/`
- **Handler Config:** `/services/graphql/autoapi-projects/console-graphql/handler.py`
- **GraphQL Overview:** `/zonevast-docs/docs/graphql.md`

---

## Support

For issues or questions:
1. Check deployment status: `python3 manage.py info`
2. Check logs in CloudWatch for Lambda function
3. Verify JWT token is valid and includes user context
4. Test locally to isolate the issue
