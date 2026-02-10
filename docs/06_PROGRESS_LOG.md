# 06 – Progress Log

> This file tracks every completed task. Updated after each task is done.

---

## Log Format

```
### [DATE] – Task Title
- **Branch**: feature/xxx or fix/xxx
- **Status**: ✅ Done / 🔄 In Progress / ❌ Blocked
- **Summary**: What was done
- **Files changed**: List of key files
- **Open items**: Any follow-ups
```

---

## Completed Tasks

### 2026-02-10 – Project Setup: Documentation & Instructions

- **Branch**: `main` (initial setup)
- **Status**: ✅ Done
- **Summary**: Created project documentation structure, instruction files, Git setup, and coding standards.
- **Files created**:
  - `.github/copilot-instructions.md`
  - `docs/00_PRODUCT_OVERVIEW.md`
  - `docs/01_ARCHITECTURE.md`
  - `docs/02_DATA_MODEL.md`
  - `docs/03_API_SPEC.md`
  - `docs/04_STORAGE_GCS.md`
  - `docs/05_DEV_WORKFLOW.md`
  - `docs/06_PROGRESS_LOG.md`
  - `instructions/mobile.instructions.md`
  - `instructions/admin.instructions.md`
  - `instructions/backend.instructions.md`
  - `instructions/database.instructions.md`
  - `instructions/content-i18n.instructions.md`
  - `instructions/storage-gcs.instructions.md`
  - `CONTRIBUTING.md`
  - `CODEOWNERS`
  - `.gitignore`
- **Open items**: Awaiting user confirmation to proceed with implementation.

---

## Upcoming Tasks

### 2026-02-10 – Monorepo Structure Setup

- **Branch**: `develop`
- **Status**: ✅ Done
- **Summary**: Set up full monorepo structure with npm workspaces + Turborepo. Created server scaffolding (Express + health endpoint), Prisma schema with all tables, shared types package, and placeholder apps.
- **Files created**:
  - Root: `package.json`, `turbo.json`, `tsconfig.base.json`, `.prettierrc`, `.eslintrc.cjs`, `.prettierignore`, `.husky/pre-commit`, `README.md`
  - `packages/shared/` – `package.json`, `tsconfig.json`, `src/index.ts` (all shared types + constants)
  - `server/` – `package.json`, `tsconfig.json`, `.env.example`, `jest.config.js`, `src/` (app, config, routes, middleware), `tests/`
  - `database/` – `package.json`, `tsconfig.json`, `prisma/schema.prisma` (full schema), `prisma/seed.ts`
  - `apps/mobile/` – placeholder `package.json`, `README.md`
  - `apps/admin/` – placeholder `package.json`, `README.md`
  - `scripts/README.md`, `infra/README.md`, `infra/gcs/`, `infra/cloud-sql/`
- **Open items**: Create `emunah_companion` DB on Cloud SQL, initialize Expo + Next.js in feature branches

---

### 2026-02-10 – Database Setup on Cloud SQL

- **Branch**: `develop`
- **Status**: ✅ Done
- **Summary**: Created `emunah_companion` database on Cloud SQL instance `cartech-mysql` (GCP project `cartech-v1`). Created DB user `emunah_app`. Added current dev IP to authorized networks. Ran Prisma initial migration (`20260210170243_init`) – all 11 tables created. Ran seed script: 2 languages (he, en), 3 roles (admin, editor, user), 16 permissions, and role-permission assignments.
- **Infrastructure**:
  - Cloud SQL instance: `cartech-mysql` (region: `me-west1-b`)
  - Database: `emunah_companion` (charset: utf8mb4, collation: utf8mb4_unicode_ci)
  - DB user: `emunah_app`
  - Public IP: `34.165.163.235`
- **Files created/changed**:
  - `database/.env` (local only, gitignored)
  - `database/prisma/migrations/20260210170243_init/migration.sql`
  - `database/prisma/migrations/migration_lock.toml`
- **Tables created**: `languages`, `roles`, `permissions`, `role_permissions`, `users`, `refresh_tokens`, `home_buttons`, `scenarios`, `scenario_steps`, `translations`, `journal_entries`, `anchors`, `media_assets`
- **Seed data**: 2 languages, 3 roles, 16 permissions, 30 role-permission mappings
- **Open items**: Initialize Expo mobile app, initialize Next.js admin panel

---

_Will be populated as tasks are planned and approved._
