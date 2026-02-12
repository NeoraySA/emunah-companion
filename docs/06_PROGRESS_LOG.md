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

### 2026-02-11 – Server Auth System (JWT)

- **Branch**: `develop`
- **Status**: ✅ Done
- **Summary**: Implemented full JWT authentication system in the Express server. Includes register, login, refresh, logout, change-password, and profile endpoints. Auth middleware with RBAC support for role-based access control (`admin`, `editor`, `user`). Zod validation for all inputs. Prisma client integration.
- **Architecture**:
  - **JWT strategy**: Access token (15m, signed) + Refresh token (7d, opaque random, stored in DB with rotation)
  - **Password**: bcrypt with 12 salt rounds
  - **RBAC**: `authenticate` middleware → `authorize('admin', 'editor')` middleware
  - **Validation**: Zod schemas → `validate()` middleware
  - **Error handling**: `AppError` hierarchy → central `errorHandler`
- **Routes**:
  - `POST /api/v1/auth/register` – Register new user (public)
  - `POST /api/v1/auth/login` – Login, returns JWT tokens (public)
  - `POST /api/v1/auth/refresh` – Refresh access token (public)
  - `POST /api/v1/auth/logout` – Invalidate refresh token (authenticated)
  - `POST /api/v1/auth/change-password` – Change password (authenticated)
  - `GET /api/v1/auth/me` – Get user profile (authenticated)
- **Files created**:
  - Utils: `utils/errors.ts`, `utils/prisma.ts`, `utils/jwt.ts`, `utils/password.ts`, `utils/index.ts`
  - Middleware: `middleware/auth.middleware.ts`, `middleware/validate.middleware.ts`
  - Validators: `validators/auth.validator.ts`
  - Service: `services/auth.service.ts`
  - Controller: `controllers/auth.controller.ts`
  - Routes: `routes/auth.routes.ts`
  - Types: `types/express.d.ts`
- **Files modified**:
  - `routes/index.ts` – wired auth routes
  - `middleware/error-handler.middleware.ts` – AppError support
  - `package.json` – added @prisma/client
- **Tests**: 43 tests passing (6 suites: JWT, password, errors, validators, auth middleware, health)
- **Open items**: Admin login page, Mobile login screen, Integration tests with DB

---

### 2026-02-11 – Admin Auth Integration

- **Branch**: `develop`
- **Status**: ✅ Done
- **Summary**: Integrated authentication into the Next.js admin panel. Created a login page with email/password form (Hebrew UI), AuthProvider context, token management with localStorage + cookie flag for Edge middleware, AuthGuard for dashboard protection, updated Header with user info and logout, Sidebar with RBAC-filtered navigation.
- **Architecture**:
  - **Token storage**: localStorage (access + refresh tokens) + lightweight cookie (`emunah_auth`) for Next.js Edge middleware
  - **Auth flow**: Login → store tokens → redirect to /dashboard; Logout → clear tokens → redirect to /login
  - **Route protection**: 2 layers – Next.js Edge middleware (cookie check) + client-side AuthGuard (JWT verification via /auth/me)
  - **RBAC**: Only admin/editor can access CMS; Sidebar hides Users/Settings for non-admin
- **Files created**:
  - `src/services/auth-service.ts` – Login/logout/refresh/me API + token management
  - `src/hooks/use-auth.tsx` – AuthProvider + useAuth hook
  - `src/components/auth-guard.tsx` – Client-side auth guard
  - `src/middleware.ts` – Next.js Edge middleware
  - `src/app/login/page.tsx` – Login page with form
  - `src/components/ui/input.tsx` – Input component (shadcn/ui)
  - `src/components/ui/label.tsx` – Label component (shadcn/ui)
- **Files modified**:
  - `src/app/providers.tsx` – Added AuthProvider
  - `src/app/(dashboard)/layout.tsx` – Wrapped with AuthGuard
  - `src/app/page.tsx` – Smart redirect based on auth state
  - `src/components/layout/header.tsx` – User name, role badge, logout
  - `src/components/layout/sidebar.tsx` – RBAC-filtered nav items
  - Barrel exports: `ui/index.ts`, `services/index.ts`, `hooks/index.ts`
- **Verification**: TypeScript compiles with zero errors, Next.js build succeeds (12 pages + middleware)
- **Open items**: Mobile login/register screens, end-to-end auth testing

---

### 2026-02-11 – Mobile Auth Screens

- **Branch**: `develop`
- **Status**: ✅ Done
- **Summary**: Implemented full authentication flow in the Expo mobile app. Created Login and Register screens with Hebrew RTL UI, auth service layer with SecureStore token management, updated Zustand store with login/register/initialize actions, protected routing via useProtectedRoute hook, and a full Settings screen with user info and logout.
- **Architecture**:
  - **Token storage**: expo-secure-store (encrypted on device)
  - **Auth flow**: App launch → initialize (check token + /auth/me) → route to (auth) or (tabs)
  - **Route protection**: `useProtectedRoute` hook in root layout – redirects based on auth state
  - **API client**: Axios interceptors use auth-service helpers; clears auth store on refresh failure
  - **State**: Zustand store with login/register/logout/initialize actions
- **Files created**:
  - `services/auth-service.ts` – login/register/logout/refresh/me API + token helpers
  - `app/(auth)/_layout.tsx` – Auth route group layout
  - `app/(auth)/login.tsx` – Login screen (email + password, Hebrew UI)
  - `app/(auth)/register.tsx` – Register screen (name + email + password + confirm, Hebrew UI)
- **Files modified**:
  - `store/auth-store.ts` – Added login/register/initialize actions, uses auth-service
  - `hooks/use-auth.ts` – Simplified as convenience wrapper around store
  - `services/api-client.ts` – Uses auth-service helpers, clears auth state on failed refresh
  - `services/index.ts` – Added auth-service exports
  - `app/_layout.tsx` – Auth-based routing with useProtectedRoute + initialize on mount
  - `app/(tabs)/settings.tsx` – Full Settings screen with user card, settings rows, logout with Alert
- **Verification**: TypeScript compiles with zero errors
- **Open items**: End-to-end auth testing, forgot password flow

---

### 2026-02-12 – Server CRUD APIs – Core Entities

- **Branch**: `develop`
- **Status**: ✅ Done
- **Summary**: Implemented full CRUD API endpoints for all core content entities: Languages, Home Buttons, Translations, and Scenarios + Steps. Added reusable pagination/sorting helpers, Zod validators, service layer with Prisma, controllers, and route wiring. All endpoints follow RESTful conventions with proper RBAC (public/authenticated/admin).
- **Architecture**:
  - **Pagination**: Reusable `parsePagination`, `parseSort`, `buildPaginationMeta` helpers (defaults: page=1, limit=20, max=100)
  - **Soft-delete**: Home Buttons, Scenarios, Steps use `deletedAt` field
  - **Translations**: Bulk upsert via `$transaction` on composite unique [entityType, entityId, languageId, fieldName]
  - **Nested resources**: Scenario Steps nested under `/scenarios/:scenarioId/steps`
  - **Prisma JSON**: `Prisma.JsonNull` sentinel for nullable JSON fields, `InputJsonValue` cast for configJson
- **Routes**:
  - `GET /api/v1/languages` – List active languages (public)
  - `GET /api/v1/home-buttons` – List active buttons (public)
  - `GET /api/v1/home-buttons/all` – List all buttons (admin)
  - `GET/POST/PUT/DELETE /api/v1/home-buttons/:id` – Admin CRUD
  - `GET /api/v1/translations` – Filter by entityType, entityId, languageId (public)
  - `PUT /api/v1/translations` – Bulk upsert (admin, max 500)
  - `GET /api/v1/scenarios` – Paginated list (authenticated)
  - `GET /api/v1/scenarios/all` – Admin list (admin)
  - `GET/POST/PUT/DELETE /api/v1/scenarios/:id` – Admin CRUD
  - `GET/POST /api/v1/scenarios/:scenarioId/steps` – List + create steps
  - `PUT/DELETE /api/v1/scenarios/:scenarioId/steps/:stepId` – Update + delete steps
- **Files created**:
  - Utils: `utils/pagination.ts`
  - Validators: `validators/common.validator.ts`, `home-button.validator.ts`, `translation.validator.ts`, `scenario.validator.ts`
  - Services: `services/language.service.ts`, `home-button.service.ts`, `translation.service.ts`, `scenario.service.ts`
  - Controllers: `controllers/language.controller.ts`, `home-button.controller.ts`, `translation.controller.ts`, `scenario.controller.ts`
  - Routes: `routes/language.routes.ts`, `home-button.routes.ts`, `translation.routes.ts`, `scenario.routes.ts`
  - Tests: `tests/utils/pagination.test.ts`, `tests/validators/home-button.validator.test.ts`, `translation.validator.test.ts`, `scenario.validator.test.ts`
- **Files modified**:
  - `routes/index.ts` – Wired 4 new routers
  - `utils/index.ts` – Added pagination exports
- **Tests**: 95 total (52 new: 12 pagination + 10 home-button + 10 translation + 20 scenario validators)
- **Open items**: Journal API, Anchors API, Media API, Users API

---

### 2026-02-12 – Journal API (Encrypted) + Anchors API

- **Branch**: `develop`
- **Status**: ✅ Done
- **Summary**: Implemented Journal and Anchors APIs. Journal entries use AES-256-CBC encryption at the application level (title + body encrypted, per-entry IV). Anchors support schedule types (once, daily, weekly, custom). Both APIs are user-scoped with pagination and soft-delete.
- **Architecture**:
  - **Journal encryption**: AES-256-CBC with random 16-byte IV per entry. Key from `JOURNAL_ENCRYPTION_KEY` env (64-char hex). Title and body encrypted with same IV, stored as `Bytes` in MySQL.
  - **User-scoping**: Both Journal and Anchors filter by `userId` from JWT token — users can only access their own data.
  - **Anchor schedules**: `scheduleType` enum (once/daily/weekly/custom) + `scheduleConfig` JSON for cron/time details. Uses `Prisma.JsonNull` for nullable JSON.
- **Routes**:
  - `GET /api/v1/journal` – List entries (paginated, filter by scenarioId/mood)
  - `GET /api/v1/journal/:id` – Get single entry (decrypted)
  - `POST /api/v1/journal` – Create entry (encrypted)
  - `PUT /api/v1/journal/:id` – Update entry (re-encrypted)
  - `DELETE /api/v1/journal/:id` – Soft-delete entry
  - `GET /api/v1/anchors` – List anchors (paginated)
  - `POST /api/v1/anchors` – Create anchor
  - `PUT /api/v1/anchors/:id` – Update anchor
  - `DELETE /api/v1/anchors/:id` – Soft-delete anchor
- **Files created**:
  - Utils: `utils/encryption.ts` (AES-256-CBC encrypt/decrypt)
  - Validators: `validators/journal.validator.ts`, `validators/anchor.validator.ts`
  - Services: `services/journal.service.ts`, `services/anchor.service.ts`
  - Controllers: `controllers/journal.controller.ts`, `controllers/anchor.controller.ts`
  - Routes: `routes/journal.routes.ts`, `routes/anchor.routes.ts`
  - Tests: `tests/utils/encryption.test.ts`, `tests/validators/journal.validator.test.ts`, `tests/validators/anchor.validator.test.ts`
- **Files modified**:
  - `routes/index.ts` – Wired journal + anchor routers
  - `utils/index.ts` – Added encryption exports
- **Tests**: 130 total (35 new: 10 encryption + 13 journal validators + 12 anchor validators)
- **Open items**: Media API, Users API

---

### 2026-02-12 – Media API (GCS) + Users API (Profile)

- **Branch**: `develop`
- **Status**: ✅ Done
- **Summary**: Implemented Media API with GCS upload (multer + @google-cloud/storage) and signed URLs, plus Users API for profile management. All API endpoints from the spec are now implemented.
- **Architecture**:
  - **GCS client**: `utils/gcs.ts` – upload, signed URL (v4, configurable expiry), delete operations
  - **Multer**: Memory storage, 10MB limit, MIME whitelist (images, audio, video, PDF)
  - **Media paths**: `media/<year>/<month>/<uuid>-<filename>` pattern for organized storage
  - **Soft-delete**: Media records soft-deleted; GCS objects retained for recovery
  - **User profile**: Separate from auth – GET/PUT `/users/me` for display name + preferred language
- **Routes**:
  - `POST /api/v1/media/upload` – Upload file to GCS (admin, multipart/form-data)
  - `GET /api/v1/media` – List media assets (admin, paginated, filterable by entity)
  - `GET /api/v1/media/:id/url` – Get signed URL (authenticated)
  - `DELETE /api/v1/media/:id` – Soft-delete (admin)
  - `GET /api/v1/users/me` – Get current user profile (authenticated)
  - `PUT /api/v1/users/me` – Update display name + preferred language (authenticated)
- **Files created**:
  - Utils: `utils/gcs.ts`
  - Middleware: `middleware/upload.middleware.ts` (multer config)
  - Validators: `validators/media.validator.ts`, `validators/user.validator.ts`
  - Services: `services/media.service.ts`, `services/user.service.ts`
  - Controllers: `controllers/media.controller.ts`, `controllers/user.controller.ts`
  - Routes: `routes/media.routes.ts`, `routes/user.routes.ts`
  - Tests: `tests/validators/media.validator.test.ts`, `tests/validators/user.validator.test.ts`
- **Files modified**:
  - `routes/index.ts` – Wired media + user routers (all 12 route groups now active)
- **Tests**: 143 total (13 new: 6 media + 7 user validators)
- **Open items**: All server APIs complete! Next: Admin panel pages, Mobile app screens

---

### 2026-02-12 – Admin Panel Management Pages (Step 12)

- **Branch**: `develop`
- **Status**: ✅ Done
- **Summary**: Built full admin panel management pages replacing all 5 placeholder pages with functional CRUD interfaces. Created 6 new shadcn/ui components, 6 new React Query hooks, and implemented 4 management pages + live dashboard stats.
- **Architecture**:
  - **Data fetching**: React Query hooks with optimistic invalidation
  - **Forms**: Controlled state + Dialog-based create/edit workflows
  - **CRUD pattern**: Table → Create/Edit Dialog → Delete Confirm Dialog (consistent across all pages)
  - **Translations**: Entity-based editor with per-language per-field editing grid
  - **Media**: File upload via FormData + grid display with pagination
  - **Dashboard**: Parallel API calls for live counts
- **UI Components created** (shadcn/ui style):
  - `components/ui/table.tsx` – Table, TableHeader, TableBody, TableRow, TableHead, TableCell
  - `components/ui/badge.tsx` – Badge with success/warning/destructive variants
  - `components/ui/dialog.tsx` – Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
  - `components/ui/select.tsx` – Select with radix-ui dropdown
  - `components/ui/textarea.tsx` – Multi-line text input
  - `components/ui/separator.tsx` – Visual separator
- **React Query Hooks created**:
  - `hooks/use-home-buttons.ts` – useHomeButtons, useCreateHomeButton, useUpdateHomeButton, useDeleteHomeButton
  - `hooks/use-translations.ts` – useTranslations, useUpsertTranslations
  - `hooks/use-media.ts` – useMedia, useUploadMedia, useMediaUrl, useDeleteMedia
  - `hooks/use-languages.ts` – useLanguages
  - `hooks/use-stats.ts` – useDashboardStats
  - `hooks/use-scenarios.ts` – Extended with useScenarioSteps, useCreateStep, useUpdateStep, useDeleteStep
- **Pages implemented**:
  - **Dashboard** (`/dashboard`) – Live stats cards (clickable), quick action links
  - **Scenarios** (`/dashboard/scenarios`) – Full table + create/edit/delete dialogs + steps management sub-dialog
  - **Home Buttons** (`/dashboard/home-buttons`) – Full table + CRUD dialogs
  - **Translations** (`/dashboard/translations`) – Entity type/entity selector + per-language per-field editing grid + batch save
  - **Media** (`/dashboard/media`) – Upload button + media grid + pagination + delete confirm
- **Files created**: 12 new files
- **Files modified**: 8 existing files (pages, barrel exports, hooks)
- **Dependencies added**: radix-ui peer deps (react-id, react-focus-guards, react-remove-scroll, floating-ui, aria-hidden, etc.)
- **Verification**: TypeScript compiles with zero errors, Next.js build succeeds (12 pages, 1 middleware)
- **Open items**: Mobile app screens integration, end-to-end testing, Users page CRUD

---

### 2026-02-12 – Step 13: Mobile App Content Screens

- **Branch**: `develop`
- **Commit**: `0e19dc6`
- **Status**: ✅ Done
- **Summary**: Replaced all 5 placeholder mobile tab screens with fully functional, API-connected screens. Created React Query hooks for all data fetching/mutation, a reusable EmptyState component, and a dedicated scenario step-by-step flow screen.
- **Technical highlights**:
  - **React Query hooks** (5 new files): home-buttons, scenarios (list + single), journal (CRUD), anchors (CRUD), profile (read + update)
  - **EmptyState component**: Reusable with icon/emoji, title, subtitle, optional action button
  - **Home tab**: Dynamic buttons from `/home-buttons` API, personalized greeting with user name, pull-to-refresh, icon/color mapping
  - **Scenarios tab**: Fetches list from `/scenarios` API, category color dots, navigates to flow screen
  - **Scenario flow screen** (`/scenario/[id]`): Step-by-step walkthrough with progress bar, step type icons (text/prompt/action/summary), prev/next/finish navigation
  - **Journal tab**: Full CRUD with modal editor, mood emoji selector, date formatting (he-IL locale), delete confirmation, FAB for new entry
  - **Anchors tab**: Full CRUD with schedule type selector (once/daily/weekly/custom), active toggle, delete confirmation, FAB
  - **Settings tab**: Profile editing via API (display name modal, language toggle with confirmation), syncs auth store on update
  - **Root layout**: Added `scenario/[id]` as stack screen above tabs
  - **All RTL**: writingDirection, row-reverse, text-align right throughout
- **React Query hooks created**:
  - `hooks/use-home-buttons.ts` – useHomeButtons
  - `hooks/use-scenarios.ts` – useScenarios, useScenario
  - `hooks/use-journal.ts` – useJournalEntries, useJournalEntry, useCreateJournalEntry, useUpdateJournalEntry, useDeleteJournalEntry
  - `hooks/use-anchors.ts` – useAnchors, useCreateAnchor, useUpdateAnchor, useDeleteAnchor
  - `hooks/use-profile.ts` – useProfile, useUpdateProfile
- **Files created**: 7 new files
- **Files modified**: 8 existing files (5 tab screens, root layout, hooks barrel, components barrel)
- **Verification**: TypeScript compiles with zero errors
- **Open items**: Admin Users page, E2E testing, deploy prep

---

_Will be populated as tasks are planned and approved._
