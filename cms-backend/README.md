# Backend Requirements Compliance

Enterprise-grade NestJS backend for a full-stack CMS with REST API, JWT authentication, RBAC, and PostgreSQL.

## Architecture

**Clean Layered Design:**

- **Controllers** → HTTP handling + request validation
- **Services** → Business logic & orchestration
- **Repositories** → Data access (Prisma ORM)
- **Database** → PostgreSQL with Prisma schema

**SOLID Principles:**

- Single Responsibility: Each module handles one domain
- Dependency Inversion: Services depend on repository abstractions
- Open/Closed: Guards, interceptors, decorators extend without modification

## Tech Stack

- **Framework:** NestJS 11 (TypeScript)
- **ORM:** Prisma 5.8
- **Database:** PostgreSQL 16
- **Authentication:** JWT + bcrypt
- **Authorization:** Role-Based Access Control (RBAC)
- **API Docs:** Swagger/OpenAPI
- **Testing:** Jest + Supertest
- **Deployment:** Docker + Kubernetes-ready

## Quick Start

### Prerequisites

- Node.js 22+
- PostgreSQL 16
- npm 10+

### Local Development

1. **Clone & install:**

```bash
cd d-full-stack-cms-assessment
npm install --legacy-peer-deps
```

2. **Configure environment:**

```bash
cp .env.example .env
# Update DATABASE_URL if needed
```

3. **Run migrations & seed:**

```bash
npx prisma generate
npm run prisma:migrate
npm run seed
```

4. **Start dev server:**

```bash
npm run start:dev
# Server runs on http://localhost:3000
```

### Docker Deployment

**Local with Docker Compose:**

```bash
docker-compose up -d
# Automatically runs migrations and seeds
# Access: http://localhost:3000
```

**Production Docker Image:**

```bash
docker build -t cms-backend:latest .
docker run -e DATABASE_URL="postgresql://..." -p 3000:3000 cms-backend:latest
```

## API Documentation

### Swagger/OpenAPI

A standalone **OpenAPI 3.0 specification** is available at:

- **File**: `openapi.json` in project root
- **Format**: OpenAPI 3.0 JSON

**View API Docs Using:**

1. **Swagger UI** - Upload `openapi.json` to https://editor.swagger.io or use {baseurl}/api/docs
2. **Postman** - Import `openapi.json` as a collection
3. **ReDoc** - Use ReDoc viewer with the spec
4. **VS Code** - Install OpenAPI extension and open the file

All endpoints and request/response schemas are documented in `openapi.json`.

### Authentication

- `POST /auth/login` — Login (email, password)
  - Returns JWT access token
  - Default: `admin@example.com` / `changeme123`

### Users (Admin only)

- `GET /users?page=1&limit=10&search=term` — List users (paginated with optional search)
- `GET /users/:id` — Get user by ID
- `PATCH /users/:id` — Update user
- `PATCH /users/:id/status` — Enable/disable user
- `DELETE /users/:id` — Delete user

**Search filters by:** email, firstName, lastName (case-insensitive)

### Roles (Admin only)

- `POST /roles` — Create role
- `GET /roles?page=1&limit=10&search=term` — List roles (with optional search)
- `GET /roles/:id` — Get role details
- `PATCH /roles/:id` — Update role
- `PATCH /roles/:id/permissions` — Assign permissions
- `DELETE /roles/:id` — Delete role

**Search filters by:** name, description (case-insensitive)

### Permissions (Admin only)

- `POST /permissions` — Create permission
- `GET /permissions?page=1&limit=10&search=term` — List permissions (with optional search)

**Search filters by:** key, description (case-insensitive)

### Blogs (Admin)

- `POST /blogs` — Create blog post (supports multi-language translations)
- `GET /blogs?page=1&limit=10&search=term` — List all blog posts (with optional search)
- `GET /blogs/:id` — Get blog post by ID
- `PATCH /blogs/:id` — Update blog post
- `DELETE /blogs/:id` — Delete blog post

**Search filters by:** title, content across all translations (case-insensitive)

### Blogs (Public)

- `GET /blogs/public?language=en&page=1&limit=10` — Get published blogs (by language)

### News (Admin)

- `POST /news` — Create news item
- `GET /news?page=1&limit=10&search=term` — List news (with optional search)
- `GET /news/:id` — Get news by ID
- `PATCH /news/:id` — Update news
- `DELETE /news/:id` — Delete news

**Search filters by:** title, content across all translations (case-insensitive)

### News (Public)

- `GET /news/public?language=en&page=1&limit=10` — Get published news (respects expiresAt)

### Health

- `GET /health` — Health check (for load balancers)

## Authentication

All protected endpoints require JWT bearer token in `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/users
```

### Login & Get Token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "changeme123"
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

## RBAC Permissions

**Roles:**

- `ADMIN` — Full access (all permissions)
- `EDITOR` — Create/update blogs & news
- `VIEWER` — Read-only access

**Permission Keys:**

- `blog.create`, `blog.read`, `blog.update`, `blog.delete`
- `news.create`, `news.read`, `news.update`, `news.delete`
- `user.manage` (roles, permissions, users)

Custom roles can be created via API and assigned permissions.

## Database Schema

### Core Tables

- **User** — Email, password hash, status, timestamps
- **Role** — Name, optional description
- **Permission** — Permission key (e.g., `blog.create`)
- **UserRole** — Many-to-many user ↔ role mapping
- **RolePermission** — Many-to-many role ↔ permission mapping

### Content Tables

- **Blog** — Slug, status (draft/published), author, timestamps
- **BlogTranslation** — Title, content by language (en, ar, etc.)
- **News** — Slug, status, author, publishedAt, expiresAt
- **NewsTranslation** — Title, content by language

All IDs are UUIDs. Queries use indexes on `slug`, `email`, `publishedAt` for performance.

## Error Handling

Global exception filters provide consistent error responses:

**HTTP Exception Filter:**
Wraps all HTTP errors with a standard format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

**Prisma Exception Filter:**
Catches database errors and transforms them:

- `P2002`: Unique constraint violation → 409 Conflict
- `P2025`: Record not found → 404 Not Found
- `P2003`: Foreign key violation → 400 Bad Request

**Validation Errors:**
Class-validator automatically validates DTOs and returns:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "constraints": ["email must be a valid email"]
    }
  ]
}
```

See [ERROR_HANDLING.md](ERROR_HANDLING.md) for complete documentation.

## Testing

**Run unit tests:**

```bash
npm run test
```

**Run e2e tests:**

```bash
npm run test:e2e
```

**Run with coverage:**

```bash
npm run test:cov
```

**Test files:**

- Unit tests: Co-located with source files (`*.spec.ts`)
- E2E tests: `test/app.e2e-spec.ts`, `test/blog.e2e-spec.ts`

See [BLOG_TESTING.md](BLOG_TESTING.md) for blog module test documentation.

## Scalability

**Built for 10,000+ users/hour:**

- ✅ Stateless JWT (no server state)
- ✅ Pagination enforced (no SELECT \*)
- ✅ Connection pooling (PostgreSQL)
- ✅ Indexed queries (slug, email, publishedAt)
- ✅ Global compression & helmet middleware
- ✅ Docker & Kubernetes ready
- ✅ Health checks for load balancers

**Future Enhancements:**

- Redis caching layer
- Request rate limiting
- Async job queue (BullMQ)
- Database read replicas
- CDN for public assets

## Configuration

Environment variables (`.env`):

```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=password123
PORT=3000
```

## Project Structure

```
src/
├── modules/
│   ├── auth/           # JWT, login
│   ├── users/          # User management
│   ├── roles/          # Role CRUD
│   ├── permissions/    # Permission CRUD
│   ├── blog/           # Blog admin + public
│   ├── news/           # News admin + public
├── common/
│   ├── decorators/     # @Permissions()
│   ├── guards/         # JwtAuthGuard, PermissionsGuard
│   ├── filters/        # Global exception filter
│   ├── interceptors/   # Response wrapper
├── prisma/             # ORM & database
├── health/             # Health check endpoint
├── main.ts             # Bootstrap
└── app.module.ts       # Root module

prisma/
├── schema.prisma       # Database schema
└── seed.ts             # Seed script

test/
└── app.e2e-spec.ts     # End-to-end tests

Dockerfile              # Production image
docker-compose.yml      # Local development stack
```

## Deployment with Docker

**Build image:**

```bash
docker build -t cms-backend:1.0.0 .
```

**Run container:**

```bash
docker run \
  -e DATABASE_URL="postgresql://user:pass@postgres:5432/dbname" \
  -e JWT_SECRET="your-secret" \
  -p 3000:3000 \
  cms-backend:1.0.0
```

**Kubernetes deployment example:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cms-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cms-backend
  template:
    metadata:
      labels:
        app: cms-backend
    spec:
      containers:
        - name: cms-backend
          image: cms-backend:1.0.0
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: cms-secrets
                  key: database-url
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: cms-secrets
                  key: jwt-secret
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

## Common Scripts

```bash
npm run build              # Build for production
npm run start              # Run production build
npm run start:dev         # Dev server with watch
npm run lint              # Lint & fix code
npm run format            # Format with Prettier
npm run test              # Run unit tests
npm run test:e2e          # Run e2e tests
npm run test:cov          # Tests with coverage
npm run prisma:migrate    # Create & apply migrations
npm run seed              # Run seed script
```

## Production Checklist

- [ ] Set strong `JWT_SECRET` environment variable
- [ ] Enable HTTPS/TLS
- [ ] Use strong database credentials
- [ ] Enable rate limiting
- [ ] Set up log aggregation
- [ ] Configure monitoring & alerts
- [ ] Use `NODE_ENV=production`
- [ ] Enable database backups
- [ ] Set up CI/CD pipeline
- [ ] Mock external services

## Contributing

1. Create feature branch (`git checkout -b feature/amazing`)
2. Make changes & test (`npm run test`)
3. Format code (`npm run format`)
4. Commit with clear message
5. Push & open PR

## License

UNLICENSED

## Additional Documentation

- [../MAIN-README.md](../README.md) — Engineering reflection with architecture decisions

## Support

For issues or questions, please contact the Mohammad Aamir.
