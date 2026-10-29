
# CAD/BOM Platform — Deployment Architecture v1

## 1. Purpose

Define how the CAD/BOM Platform is developed,
tested, deployed, monitored and maintained.

Reuse existing Phase 6 infrastructure.

## 2. Environments

### Development

Primary machine: Mac

Components:
- Express API
- Next.js
- PostgreSQL 17 via Docker
- Docker Compose
- Python ETL (pending source restoration)
- Ollama optional, available on Windows

PostgreSQL:
- Host: 127.0.0.1
- Published port: 5544
- Internal Docker port: 5432
- Database: senior_demo

Configuration:
- compose.yaml
- compose.dev.yaml
- Local .env (gitignored)

### Staging

Platform: Railway

Goals:
- Validate application deployments
- Execute integration tests
- Verify migrations
- Verify monitoring and health checks

Use dedicated Staging credentials and database.

### Production

Platform: Railway

Goals:
- Reliable deployment
- Secure configuration
- Monitoring and logging
- Controlled releases
- Backup and recovery

Use dedicated Production credentials and database.

## 3. Source Control

Repository:
dokhaclam1985/senior-platform-repo

Main branch:
main

Current development branch:
feature/phase7-cad-bom

Workflow:

Feature Branch
    |
    v
Pull Request
    |
    v
GitHub Actions CI
    |
    v
Code Review
    |
    v
Merge to main
    |
    v
Deployment according to environment rules

Verify branch protection and deployment
triggers before merging changes.

## 4. Application Deployment

### Express API

Technology:
- Node.js
- TypeScript
- Docker

Existing capabilities:
- Authentication and RBAC
- PostgreSQL connection
- Health checks
- Structured logging
- Prometheus metrics

CAD/BOM routes will be added under src/.

### Next.js

Existing application:
nextjs-senior-demo

Planned additions:
- Assemblies pages
- CAD Parts pages
- BOM details
- Search UI
- AI Search UI

Do not assume the frontend is already
deployed to every Railway environment.

### Python ETL

Existing Windows project:
python-etl-platform

Planned:
- Restore existing Python source to Mac
- Validate database connections
- Integrate CAD/BOM ingestion
- Evaluate worker deployment later

## 5. AI Infrastructure

Existing Phase 5:
- Embeddings
- pgvector
- Chroma
- Ollama Qwen2.5
- SQL_BOM / SEMANTIC RAG Router

Initial plan:
- Do not install Ollama on Mac
- Reuse Windows Ollama when needed
- Keep AI service optional initially
- Define secure networking before remote access
- Avoid exposing Ollama publicly without protection

## 6. Security

- Keep environment secrets separate
- Never commit .env
- Use dedicated database credentials
- Restrict database network access
- Preserve authentication fail-closed behavior
- Define production-ready authentication
- Apply RBAC to CAD/BOM endpoints
- Review migration effects before deployment

## 7. Observability

Reuse:
- Pino logging
- Request IDs
- Prometheus metrics
- Grafana dashboards
- 5xx alerts
- P95 latency alerts

Planned CAD/BOM metrics:
- Ingestion job success/failure
- Ingestion duration
- CAD/BOM API request rate
- CAD/BOM API error rate
- Search latency
- AI service availability

## 8. Database Strategy

- PostgreSQL is the source of truth
- Use separate database environments
- Migrations require controlled execution
- Align SQL Runner and node-pg-migrate strategy
- Preserve existing data and backups
- Verify schema before CAD/BOM migrations

## 9. Release Readiness

Before Production deployment:
- CI checks pass
- Database migrations reviewed
- Integration tests pass
- Production authentication verified
- Secrets configured
- Health checks verified
- Monitoring and rollback plan reviewed
- Backup and recovery approach validated

## 10. Current Status

Completed:
- GitHub collaboration on Mac
- Feature branch setup
- Docker Development environment
- PostgreSQL Development setup
- Base database migrations
- Architecture, Data Flow, ERD and API Contract drafts

Pending:
- Original Python ETL source restoration
- CAD/BOM schema restoration
- CAD/BOM API implementation
- Frontend integration
- AI Search integration
- Production deployment design verification
