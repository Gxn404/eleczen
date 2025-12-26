# ElecZen API

The official backend service and API documentation for the **ElecZen Circuit Simulator**.

## 🚀 Features

- **JSON Dashboard**: The root endpoint (`/`) returns a live system status and metadata dashboard.
- **RESTful Endpoints**: Standardized API for authentication, circuit management, and component libraries.
- **Swagger Documentation**: Interactive API testing available at `/api/swagger`.

## 📡 Base URL

```bash
https://api.eleczen.com  # Production (Example)
http://localhost:3000    # Development
```

## 🛠 Getting Started

### 1. Run the Development Server

```bash
npm install
npm run dev
# or
bun install
bun run dev
```

### 2. Access the Dashboard

Open [http://localhost:3000](http://localhost:3000) in your browser or HTTP client (like Postman/Curl) to see the JSON dashboard:

```json
{
  "service": "ElecZen API",
  "version": "1.0.0",
  "status": "operational",
  ...
}
```

## 🔐 Authentication

Most endpoints require a **Bearer Token** (JWT).

```http
Authorization: Bearer <your_token>
```

## 📚 Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API Dashboard (JSON) |
| `GET` | `/api/swagger` | OpenAPI Spec / Docs |
| `POST` | `/api/auth/login` | User Login |
| `POST` | `/api/auth/signup` | User Registration |
| `GET` | `/api/admin/*` | Admin Resources |

> **Note**: This is a sub-project of the main ElecZen repository.
