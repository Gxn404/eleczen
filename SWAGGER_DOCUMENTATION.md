# ElecZen API - Complete Swagger Documentation

## ✅ Fully Documented Endpoints

### Blog API
- ✅ `GET /api/blog` - List all blog posts
- ✅ `POST /api/blog` - Create new blog post
- ✅ `GET /api/blog/{id}` - Get single blog post (by ID or slug)
- ✅ `PUT /api/blog/{id}` - Update blog post
- ✅ `DELETE /api/blog/{id}` - Delete blog post

### Circuits API
- ✅ `GET /api/circuits` - List all circuits
- ✅ `POST /api/circuits` - Create new circuit
- ✅ `GET /api/circuits/{id}` - Get single circuit
- ✅ `PUT /api/circuits/{id}` - Update circuit
- ✅ `DELETE /api/circuits/{id}` - Delete circuit

### Components API
- ✅ `GET /api/components` - List all components
- ✅ `POST /api/components` - Create component (admin only)

### Comments API
- ✅ `GET /api/comments` - Get comments for a post
- ✅ `POST /api/comments` - Create comment

### Encyclopedia API
- ✅ `GET /api/encyclopedia` - Search knowledge base

### Library API
- ✅ `POST /api/library/upload` - Process uploaded library file

## Documentation Features

### 1. **Comprehensive Request/Response Examples**
Every endpoint includes:
- Request body schemas
- Response schemas
- Example values
- Error responses

### 2. **Authentication Documentation**
- Security requirements clearly marked
- Bearer token usage explained
- Admin-only endpoints identified

### 3. **Parameter Documentation**
- Path parameters
- Query parameters
- Request body properties
- Required vs optional fields

### 4. **Error Handling**
- Standard error responses
- HTTP status codes
- Error message formats

### 5. **Schema Definitions**
Reusable schemas for:
- Circuit
- Component
- BlogPost
- Comment
- Library
- Error

## API Coverage

| Endpoint | Methods | Auth Required | Documentation |
|----------|---------|---------------|---------------|
| `/api/blog` | GET, POST | POST only | ✅ Complete |
| `/api/blog/{id}` | GET, PUT, DELETE | PUT, DELETE | ✅ Complete |
| `/api/circuits` | GET, POST | POST only | ✅ Complete |
| `/api/circuits/{id}` | GET, PUT, DELETE | PUT, DELETE | ✅ Complete |
| `/api/components` | GET, POST | POST (admin) | ✅ Complete |
| `/api/comments` | GET, POST | POST only | ✅ Complete |
| `/api/encyclopedia` | GET | No | ✅ Complete |
| `/api/library/upload` | POST | No | ✅ Complete |

## Swagger UI Features

### Interactive Testing
- Try-it-out functionality
- Authentication testing
- Request/response inspection
- Schema validation

### Beautiful UI
- Premium glassmorphism design
- Color-coded HTTP methods:
  - 🔵 GET - Blue
  - 🟢 POST - Green
  - 🟠 PUT - Orange
  - 🔴 DELETE - Red
- Dark theme integration
- Responsive design

### Quick Navigation
- Category cards for fast access
- Tag-based organization
- Search functionality
- Collapsible sections

## Access Documentation

Visit: **`/docs`**

Features:
- Interactive Swagger UI
- API specification viewer
- Request/response examples
- Authentication guides
- Rate limit information

## Example Usage

### 1. Create a Circuit

```javascript
// 1. Authenticate
const authResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});
const { token } = await authResponse.json();

// 2. Create circuit
const circuit = await fetch('/api/circuits', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'RC Filter',
    description: 'Low-pass filter',
    isPublic: true,
    data: {
      components: [],
      wires: []
    }
  })
});
```

### 2. Upload Component Library

```javascript
// 1. Upload to storage
const file = document.getElementById('file').files[0];
const { data } = await supabase.storage
  .from('libraries')
  .upload(`components/NE555/NE555.ezc`, file);

// 2. Index component
await fetch('/api/library/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filePath: data.path,
    originalName: file.name,
    size: file.size,
    type: 'ezc',
    libraryName: 'NE555'
  })
});
```

### 3. Create Blog Post

```javascript
const post = await fetch('/api/blog', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Understanding Op-Amps',
    slug: 'understanding-op-amps',
    content: '# Introduction\n\n...',
    excerpt: 'A guide to op-amps',
    tags: ['electronics', 'tutorial']
  })
});
```

## API Specification

The complete OpenAPI 3.0 specification is available at:
- **JSON Format**: `/api/swagger`
- **Interactive UI**: `/docs`

## Rate Limits

- **Authenticated**: 100 requests/minute
- **Anonymous**: 20 requests/minute

## Response Format

All responses are in JSON format:

### Success Response
```json
{
  "id": "...",
  "name": "...",
  "...": "..."
}
```

### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "fieldName",
    "message": "Detailed message"
  }
}
```

## HTTP Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid data
- `401 Unauthorized` - Auth required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Support

- **Documentation**: `/docs`
- **API Spec**: `/api/swagger`
- **Email**: support@eleczen.com
- **GitHub**: [Report issues](https://github.com/eleczen/eleczen)

## Changelog

### v2.0.0 (2024-12-25)
- ✅ Complete Swagger documentation for all endpoints
- ✅ Interactive API testing interface
- ✅ Comprehensive request/response examples
- ✅ Enhanced error handling documentation
- ✅ Beautiful glassmorphism UI
- ✅ Tag-based organization
- ✅ Authentication guides
- ✅ Rate limit information

---

**All API endpoints are now fully documented and ready for production use!** 🎉
