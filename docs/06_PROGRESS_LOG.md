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

### 2026-02-10 – Expo Mobile App Initialization

- **Branch**: `develop`
- **Status**: ✅ Done
- **Summary**: Initialized full Expo SDK 52 project with expo-router (file-based routing). Created 5-tab navigation layout (Home, Scenarios, Journal, Anchors, Settings) with Hebrew RTL placeholders. Set up service layer (Axios + JWT interceptors), Zustand auth store, React Query provider, and reusable components.
- **Tech choices**:
  - Expo SDK 52, React Native 0.76.6
  - expo-router v4 (file-based routing with typed routes)
  - @tanstack/react-query v5 (data fetching & caching)
  - Zustand v5 (client state management)
  - expo-secure-store (token storage)
  - expo-localization (i18n support)
- **Files created**:
  - Config: `app.json`, `package.json`, `tsconfig.json`, `babel.config.js`, `.gitignore`, `.env.example`
  - Routing: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`
  - Screens: `app/(tabs)/index.tsx`, `scenarios.tsx`, `journal.tsx`, `anchors.tsx`, `settings.tsx`
  - Services: `services/api-client.ts`, `services/api-helpers.ts`, `services/index.ts`
  - Store: `store/auth-store.ts`, `store/index.ts`
  - Hooks: `hooks/use-auth.ts`, `hooks/index.ts`
  - Constants: `constants/config.ts`, `constants/index.ts`
  - Utils: `utils/helpers.ts`, `utils/index.ts`
  - Components: `components/LoadingScreen.tsx`, `components/ErrorScreen.tsx`, `components/index.ts`
  - Assets: `assets/images/README.md` (placeholder)
- **Verification**: TypeScript compiles with zero errors (`tsc --noEmit`)
- **Open items**: Initialize Next.js admin panel, implement Auth feature

---

### 2026-02-10 – Next.js Admin Panel Initialization

- **Branch**: `develop`
- **Status**: ✅ Done
- **Summary**: Initialized Next.js 15.2 admin panel with App Router and React 19. Created dashboard layout with RTL Hebrew support, sidebar navigation, and 7 page stubs. Set up shadcn/ui style components, React Query hooks, and API client with JWT interceptors.
- **Tech choices**:
  - Next.js 15.2 (App Router)
  - React 19
  - Tailwind CSS 3.4 + shadcn/ui style components
  - @tanstack/react-query v5 (data fetching)
  - React Hook Form + Zod (form validation)
  - Axios (API client)
  - TypeScript strict mode with path aliases
- **Files created**:
  - Config: `next.config.js`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `.env.example`, `.gitignore`
  - Layouts: `src/app/layout.tsx`, `src/app/(dashboard)/layout.tsx`
  - Pages: `src/app/page.tsx`, `src/app/(dashboard)/dashboard/page.tsx`, `scenarios/`, `home-buttons/`, `translations/`, `media/`, `users/`, `settings/`
  - Components: `src/components/ui/button.tsx`, `card.tsx`, `index.ts`
  - Layout: `src/components/layout/sidebar.tsx`, `header.tsx`, `index.ts`
  - Services: `src/services/api-client.ts`, `index.ts`
  - Hooks: `src/hooks/use-scenarios.ts`, `index.ts`
  - Utils: `src/lib/utils.ts`
  - Providers: `src/app/providers.tsx`, `globals.css`
- **Verification**: TypeScript compiles with zero errors, Next.js build succeeds
- **Open items**: Implement Auth feature, build out dashboard pages

---

_Will be populated as tasks are planned and approved._
