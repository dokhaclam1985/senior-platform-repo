
# Senior Platform Engineer - Platform Lab

A hands-on engineering project focused on building, operating,
securing, and monitoring a modern full-stack platform.

This repository is part of my Senior Platform Engineer
learning roadmap.

## 1. Project Overview

The project demonstrates practical platform engineering
concepts through a working full-stack application.

Main objectives:

- Backend API development
- Frontend application development
- PostgreSQL database integration
- Docker containerization
- Environment isolation (DEV / STAGING)
- Observability and monitoring
- Automated CI using GitHub Actions
- Security and Git workflow practices

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| Backend | Node.js, Express, TypeScript |
| Frontend | Next.js, React, TypeScript |
| Database | PostgreSQL |
| Containers | Docker, Docker Compose |
| Monitoring | Prometheus, Grafana |
| Authentication | JWT, Refresh Tokens |
| Authorization | Role-Based Access Control |
| CI | GitHub Actions |
| Version Control | Git, GitHub |

## 3. Architecture

```text
             Developer
                 |
                 v
              GitHub
                 |
                 v
           GitHub Actions
           (CI Pipeline)
                 |
                 v
          Docker Platform
                 |
       +---------+---------+
       |                   |
       v                   v
   Next.js Web         Express API
       |                   |
       +--------+----------+
                |
                v
            PostgreSQL

   Express API --> Prometheus --> Grafana
```

## 4. Repository Structure

```text
senior-platform-repo/
|
|-- .github/workflows/
|   |-- ci.yml
|
|-- express-senior-demo/
|   |-- src/
|   |-- controllers/
|   |-- services/
|   |-- migrations/
|   |-- Dockerfile
|
|-- nextjs-senior-demo/
|   |-- src/
|   |-- public/
|   |-- Dockerfile
|
|-- compose.yaml
|-- compose.dev.yaml
|-- compose.staging.yaml
|-- prometheus.yml
|-- .env.example
|-- .gitignore
```

## 5. Implemented Features

### Express Backend

- REST API
- JWT authentication
- Refresh token handling
- Role-based authorization
- PostgreSQL integration
- Database migrations
- Health check endpoints
- Request logging and metrics

### Next.js Frontend

- Login and logout
- Dashboard
- User management
- User details
- Create, update, and delete users
- Authentication integration

### Platform Infrastructure

- Multi-service Docker Compose
- Separate DEV and STAGING configurations
- PostgreSQL persistence
- Container health checks
- Prometheus metrics collection
- Grafana dashboards

## 6. Local Development

Prerequisites:

- Node.js
- Docker Desktop
- Git

Clone the repository:

```bash
git clone https://github.com/dokhaclam1985/senior-platform-repo.git
cd senior-platform-repo
```

Create a local environment configuration based on
`.env.example` and provide the required values.

Never commit real passwords, API keys, or JWT secrets.

Start the DEV environment after configuring `.env.dev`:

```bash
docker compose --env-file .env.dev \
  -p senior-dev \
  -f compose.yaml \
  -f compose.dev.yaml \
  up -d --build
```

Use the STAGING override with its own environment file
when running the staging environment.

## 7. CI Pipeline

GitHub Actions automatically checks incoming changes
through two independent jobs.

### Express API CI

- Install dependencies
- TypeScript validation
- Production dependency security audit

### Next.js Web CI

- Install dependencies
- TypeScript validation
- Production dependency security audit
- Production build

The workflow runs on pushes to main and on pull requests
targeting main.

## 8. Git Workflow

Development uses feature branches and pull requests.

```text
main
 |
 +-- feature/my-feature
 |
 +-- docs/update-documentation
 |
 +-- fix/bug-fix
```

Changes are validated by GitHub Actions before merging.

The main branch has a configured protection ruleset
requiring CI checks.

## 9. Security Practices

- Environment variables for secrets
- Secret files excluded from Git
- JWT authentication
- Role-based access control
- Dependency vulnerability auditing
- GitHub Actions security checks
- Branch protection rules

## 10. Current Status

Implemented locally:

- Backend and frontend
- PostgreSQL database
- Docker Compose environments
- Prometheus and Grafana monitoring
- GitHub Actions CI
- CI failure and recovery testing
- Branch protection configuration

Production deployment is a future milestone.

## 11. Roadmap

Planned improvements:

- Expand automated testing
- Strengthen CI security checks
- Add continuous deployment
- Deploy the platform to cloud infrastructure
- Integrate CAD/BOM ingestion services
- Add semantic search and RAG capabilities

## Author

Senior Platform Engineer learning project.

GitHub:
https://github.com/dokhaclam1985
