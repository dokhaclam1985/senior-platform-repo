
# CAD/BOM Platform — API Contract v1

## 1. Overview

Backend: Node.js + Express + TypeScript
Frontend: Next.js
Database: PostgreSQL

Base Path: /api/v1

Status: Draft — Design Only

## 2. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /assemblies | List assemblies |
| GET | /assemblies/:assemblyNo | Assembly details |
| GET | /assemblies/:assemblyNo/bom | Assembly BOM |
| GET | /parts/:partNo | Part details |

## 3. List Assemblies

GET /api/v1/assemblies

Optional Query Parameters:
- limit: number (default 20)
- offset: number (default 0)

Example Response (200):

```json
{
  "data": [
    {
      "assemblyNo": "PUMP-SKID",
      "name": "Pump Skid Assembly"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 1
  }
}
```

## 4. Get Assembly Details

GET /api/v1/assemblies/:assemblyNo

Example:
GET /api/v1/assemblies/PUMP-SKID

Example Response (200):

```json
{
  "data": {
    "assemblyNo": "PUMP-SKID",
    "name": "Pump Skid Assembly"
  }
}
```

## 5. Get Assembly BOM

GET /api/v1/assemblies/:assemblyNo/bom

Example:
GET /api/v1/assemblies/PUMP-SKID/bom

Example Response (200):

```json
{
  "data": {
    "assemblyNo": "PUMP-SKID",
    "items": [
      {
        "partNo": "MOTOR-001",
        "name": "Electric Motor",
        "quantity": 2
      },
      {
        "partNo": "PUMP-001",
        "name": "Water Pump",
        "quantity": 1
      }
    ]
  }
}
```

Example data is illustrative,
not actual database records.

## 6. Get Part Details

GET /api/v1/parts/:partNo

Example:
GET /api/v1/parts/MOTOR-001

Example Response (200):

```json
{
  "data": {
    "partNo": "MOTOR-001",
    "name": "Electric Motor",
    "description": "Industrial motor"
  }
}
```

## 7. Authentication & Authorization

Reuse existing Express authentication.

- Require valid authentication for CAD/BOM endpoints.
- Apply RBAC using existing middleware.
- Return 401 for unauthenticated requests.
- Return 403 for insufficient permissions.

Actual roles must be verified against
the current Express implementation.

## 8. Error Handling

Standard HTTP Status Codes:

- 200: Successful request
- 400: Invalid parameters
- 401: Authentication required or invalid
- 403: Access denied
- 404: Assembly or part not found
- 500: Unexpected server error

Error response format must be aligned
with the existing Express error handler.

## 9. Business Rules

- PostgreSQL is the source of truth.
- Assembly numbers are business identifiers.
- Part numbers are business identifiers.
- BOM quantities must be greater than zero.
- Read endpoints must not modify BOM data.
- Validate and encode route parameters.
- Apply pagination limits.
- Do not expose internal database errors.

## 10. Planned Extensions

Future API Contracts:

- CAD/BOM ingestion jobs
- Exact CAD/BOM search
- Semantic search
- AI-assisted RAG questions
- BOM revision history

## 11. Reuse Existing Components

- Express app.ts / existing API app
- Authentication middleware
- RBAC middleware
- PostgreSQL connection pool
- Request ID and Pino logging
- Error handling middleware
- Prometheus metrics

## 12. Current Status

API Contract draft only.

Endpoints have not been implemented.

Validate against the original Phase 4
CAD/BOM schema before implementation.

## 13. Compatibility Decisions

### ADR-API-001: Response Format

- Keep existing Users API responses unchanged.
- New CAD/BOM APIs use a consistent data envelope.
- Successful single-record responses use `{ "data": {} }`.
- List responses use `{ "data": [], "pagination": {} }`.
- Do not break existing Next.js Users CRUD.

### ADR-API-002: Error Handling

- Reuse the existing asyncHandler and AppError.
- Reuse the global errorHandler.
- Current error responses use `{ "message": "..." }`.
- PostgreSQL 23505 means unique constraint violation.
- Do not assume every 23505 error is a duplicate email.
- Add domain-specific error handling during implementation.

### ADR-API-003: Authentication

- Reuse existing JWT middleware.
- Existing demo authentication is disabled in production.
- Production-ready authentication is required before release.
- Define read/write authorization separately.
- Do not remove fail-closed authentication safeguards.

### ADR-API-004: Backend Architecture

Follow the architecture:

Route -> Controller -> Service -> Repository -> PostgreSQL

Reuse:
- src/config/db.ts
- src/middleware/jwtAuth.ts
- src/middleware/requireRole.ts
- src/middleware/errorHandler.ts
- src/utils/asyncHandler.ts

New CAD/BOM functionality belongs under src/.

### ADR-API-005: Database Readiness

- CAD/BOM tables are not yet restored on Mac.
- Original Phase 4 schema must be verified.
- No CAD/BOM production migrations have been applied.
- API contracts remain drafts until schema validation.

## 14. Implementation Readiness

Completed:
- API endpoint design
- Response structure decision
- Authentication and RBAC review
- Controller and Service review
- Error handling review

Pending:
- Original CAD/BOM schema verification
- CAD/BOM migrations
- CAD/BOM endpoints implementation
- Integration tests
- Production authentication verification
