# Server Infrastructure & Migration Guide

This document provides a technical log of the infrastructure setup performed on the current server and instructions for migrating the Furniture application to a new environment without conflicting with existing services.

## 1. Server Prerequisites (What was installed)
The target server must have the following components installed and running:

| Component | Minimum Version | Note |
|-----------|-----------------|------|
| **Ubuntu/Linux OS** | 22.04+ (Recommended) | Current: Ubuntu (Hostinger VPS) |
| **Docker Engine** | 24.0.0+ | Mandatory for containerization |
| **Docker Compose** | V2.x+ | Mandatory for orchestration |
| **Git** | - | To pull code from repository |

*Note: The Next.js image is built on `node:20-alpine`. The `Dockerfile` handles installing necessary dependencies like `libc6-compat`, `python3`, `make`, `g++` (for native modules like bcrypt), and `openssl` (for the Prisma engine).*

## 2. Infrastructure Architecture & Conflict Avoidance
To allow this project to run alongside existing applications (e.g., `lavyer_website`), specific port mappings were configured.

- **Web Application:** `3001` (Internal: `3000`)
- **PostgreSQL Database:** `5433` (Internal: `5432`)
- **pgAdmin:** `5051` (Internal: `80`)

All services run in their default Docker Compose network, effectively isolated from other projects on the host.

## 3. Security Configuration (What was performed)
The application was deployed securely using a dedicated user and CI/CD pipelines.

1. **User/Directory Location**: Deployed under `/home/mcp-admin/furniture`.
2. **Git Safe Directory**: Configured Git to treat the directory as safe:
   ```bash
   git config --global --add safe.directory /home/mcp-admin/furniture
   ```
3. **CI/CD Pipeline**: GitHub Actions are configured in `.github/workflows/deploy.yml` which securely accesses the server via SSH to pull the latest changes and rebuild the containers.

## 4. Deployment Steps (Migration Workflow)

To set up this application manually on a **brand new server**, follow these steps:

### Step A: Clone & Environment Setup
```bash
git clone https://github.com/mehmet21ozcelik/furniture.git
cd furniture
# Create your .env file
nano .env
```

**Required Environment Variables Checklist:**
| Variable | Description | Example/Note |
|----------|-------------|--------------|
| `DATABASE_URL` | Prisma DB connection string | `postgresql://postgres:postgres@db:5432/furniture?schema=public` |
| `POSTGRES_USER` | DB engine username | Must match `DATABASE_URL` |
| `POSTGRES_PASSWORD`| DB engine password | Strong password recommended |
| `POSTGRES_DB` | DB name | e.g., `furniture` |
| `JWT_SECRET` | Secret for admin auth | Generate: `openssl rand -base64 32` |
| `NEXT_PUBLIC_BASE_URL`| Base URL for the site | `http://187.124.15.224:3001` |

### Step B: Build & Launch Containers
```bash
docker compose up -d --build
```
*Note: The Next.js build requires a database connection to statically render pages. The `try-catch` blocks and `force-dynamic` configurations in the code prevent the build from failing if the database is initially empty.*

### Step C: Database Sync
Synchronize the database schema and push changes:
```bash
docker compose exec web npx prisma@5.10.0 db push
```
*(Specifying `@5.10.0` ensures the CLI version matches the `package.json` dependency, avoiding syntax errors).*

## 5. Backup & Data Migration (Moving to a new server)

If you are migrating from an existing server, you must move the **Volumes**.

### A. Database Backup (PostgreSQL)
Run this on the **old** server:
```bash
docker compose exec -T db pg_dump -U postgres furniture > backup_furniture.sql
```

### B. Persistent Storage
Ensure you backup the following volumes/directories:
- **Database Volume**: `postgres-data` (Managed by Docker)

### C. Restore on New Server
1. Move `backup_furniture.sql` to the new server.
2. Initialize Docker Compose using Step B.
3. Import the SQL backup:
   ```bash
   cat backup_furniture.sql | docker exec -i furniture-db-1 psql -U postgres -d furniture
   ```

## 6. Verification Checklist
- [ ] Application accessible at `http://YOUR_SERVER_IP:3001` (No `ERR_CONNECTION_REFUSED`).
- [ ] Admin panel accessible at `http://YOUR_SERVER_IP:3001/admin`.
- [ ] pgAdmin accessible at `http://YOUR_SERVER_IP:5051`.
- [ ] Database is healthy (`docker compose ps` shows `healthy` for the `db` service).
