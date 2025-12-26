# ElecZen API Documentation

## Overview

The ElecZen API provides comprehensive endpoints for managing circuits, components, libraries, blog posts, and user authentication. This API powers the ElecZen Circuit Simulator platform.

## Base URL

```
Development: http://localhost:3000/api
Production: https://eleczen.com/api
```

## Documentation

Interactive API documentation is available at:
- **Swagger UI**: [/docs](/docs)
- **API Spec**: [/api/swagger](/api/swagger)

## Authentication

Most endpoints require authentication using JWT tokens obtained from the login endpoint.

### Getting a Token

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

### Using the Token

Include the token in the Authorization header:

```bash
Authorization: Bearer <your_token>
```

## Rate Limiting

- **Authenticated users**: 100 requests per minute
- **Anonymous users**: 20 requests per minute

## API Endpoints

### Circuits

#### GET /api/circuits
Retrieve a list of circuits.

**Query Parameters:**
- `userId` (string, optional) - Filter by user ID
- `public` (boolean, optional) - Show only public circuits

**Response:**
```json
[
  {
    "_id": "circuit_id",
    "name": "RC Low-Pass Filter",
    "description": "A simple RC filter",
    "isPublic": true,
    "author": {
      "name": "John Doe",
      "image": "https://..."
    }
  }
]
```

#### POST /api/circuits
Create a new circuit. **Requires authentication.**

**Request Body:**
```json
{
  "name": "My Circuit",
  "description": "Circuit description",
  "isPublic": false,
  "data": {
    "components": [...],
    "wires": [...]
  }
}
```

### Components

#### GET /api/components
List all available components.

**Response:**
```json
[
  {
    "id": "component_id",
    "name": "NE555",
    "type": "ic",
    "category": "ICs/Timer",
    "metadata": {
      "description": "555 Timer IC",
      "manufacturer": "Texas Instruments"
    }
  }
]
```

### Library

#### POST /api/library/upload
Process and index an uploaded component library file.

**Request Body:**
```json
{
  "filePath": "components/NE555/NE555.ezc",
  "originalName": "NE555.ezc",
  "size": 2048,
  "type": "ezc",
  "componentName": "NE555",
  "libraryName": "NE555"
}
```

**Supported File Types:**
- `.ezc` - ElecZen Component definition
- `.ezl` - ElecZen Library index
- `.svg` - Component symbol preview
- `.kicad_sym` - KiCad symbol files
- `.lib` - SPICE library files
- `.sub` - SPICE subcircuit files

### Blog

#### GET /api/blog
Get all blog posts.

**Query Parameters:**
- `published` (boolean) - Filter by published status
- `limit` (number) - Limit results
- `offset` (number) - Pagination offset

#### POST /api/blog
Create a new blog post. **Requires authentication.**

**Request Body:**
```json
{
  "title": "Understanding Op-Amps",
  "slug": "understanding-op-amps",
  "content": "# Introduction\n\n...",
  "excerpt": "A guide to operational amplifiers",
  "published": false
}
```

### Comments

#### GET /api/comments
Get comments for a blog post.

**Query Parameters:**
- `postId` (string, required) - Blog post ID

#### POST /api/comments
Add a comment. **Requires authentication.**

**Request Body:**
```json
{
  "postId": "post_id",
  "content": "Great article!"
}
```

### Encyclopedia

#### GET /api/encyclopedia
Search the electronics knowledge base.

**Query Parameters:**
- `q` (string) - Search query
- `category` (string) - Filter by category

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "fieldName",
    "message": "Detailed error message"
  }
}
```

### Common Error Codes

- `AUTH_REQUIRED` - Authentication required
- `INVALID_TOKEN` - Invalid or expired token
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

## Response Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Pagination

List endpoints support pagination using `limit` and `offset` parameters:

```bash
GET /api/circuits?limit=10&offset=20
```

**Response includes pagination metadata:**
```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 20,
    "hasMore": true
  }
}
```

## Filtering & Sorting

Many endpoints support filtering and sorting:

```bash
GET /api/circuits?sort=-createdAt&filter[isPublic]=true
```

**Sort Options:**
- `createdAt` - Creation date (ascending)
- `-createdAt` - Creation date (descending)
- `updatedAt` - Last update date
- `name` - Alphabetical

## Webhooks

Subscribe to events using webhooks:

```bash
POST /api/webhooks
{
  "url": "https://your-server.com/webhook",
  "events": ["circuit.created", "circuit.updated"]
}
```

**Available Events:**
- `circuit.created`
- `circuit.updated`
- `circuit.deleted`
- `component.uploaded`
- `blog.published`

## SDKs & Libraries

Official SDKs are available for:
- JavaScript/TypeScript
- Python
- Go

```bash
npm install @eleczen/sdk
```

## Examples

### Create and Save a Circuit

```javascript
// 1. Authenticate
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});
const { token } = await response.json();

// 2. Create circuit
const circuit = await fetch('/api/circuits', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'My Circuit',
    data: { components: [], wires: [] }
  })
});
```

### Upload a Component Library

```javascript
// 1. Upload file to Supabase Storage
const file = document.getElementById('file').files[0];
const { data, error } = await supabase.storage
  .from('libraries')
  .upload(`components/MyLib/MyLib.ezc`, file);

// 2. Index the component
await fetch('/api/library/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filePath: data.path,
    originalName: file.name,
    size: file.size,
    type: 'ezc',
    libraryName: 'MyLib'
  })
});
```

## Support

- **Documentation**: [/docs](/docs)
- **Email**: support@eleczen.com
- **Discord**: [Join our community](https://discord.gg/eleczen)
- **GitHub**: [Report issues](https://github.com/eleczen/eleczen)

## Changelog

### v2.0.0 (2024-12-25)
- Enhanced Swagger documentation
- Added comprehensive API examples
- Improved error handling
- Added streaming support for file uploads
- Better caching strategies

### v1.0.0 (2024-01-01)
- Initial API release
- Basic CRUD operations
- Authentication system
- Component library support

## License

MIT License - See LICENSE file for details
