# 01 – Architecture

> Last updated: 2026-02-10

---

## High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Mobile App    │     │   Admin Web     │
│  (Expo / RN)    │     │  (Next.js)      │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │      HTTPS / REST     │
         └───────────┬───────────┘
                     │
              ┌──────▼──────┐
              │   Backend   │
              │  (Express)  │
              └──────┬──────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
   ┌─────▼─────┐ ┌──▼───┐ ┌────▼────┐
   │  MySQL     │ │ GCS  │ │ Cache   │
   │ Cloud SQL  │ │      │ │ (TBD)   │
   └───────────┘  └──────┘ └─────────┘
```

---

## Component Breakdown

### 1. Mobile App (`apps/mobile/`)

| Aspect         | Detail                                        |
| -------------- | --------------------------------------------- |
| Framework      | React Native + Expo (managed workflow)        |
| Language       | TypeScript                                    |
| Navigation     | React Navigation                              |
| State          | Zustand (lightweight, TS-friendly)             |
| API Client     | Axios with typed wrapper                      |
| i18n           | Dynamic from API, local cache                 |

### 2. Admin Web (`apps/admin/`)

| Aspect         | Detail                                 |
| -------------- | -------------------------------------- |
| Framework      | Next.js (App Router)                   |
| Language       | TypeScript                             |
| UI Library     | Tailwind CSS + shadcn/ui               |
| Auth           | JWT (standalone)                       |
| API Client     | React Query (TanStack Query)           |

### 3. Backend API (`server/`)

| Aspect         | Detail                                           |
| -------------- | ------------------------------------------------ |
| Runtime        | Node.js (LTS)                                    |
| Framework      | Express.js                                       |
| Language       | TypeScript                                       |
| ORM / Query    | Prisma (type-safe, auto-generated types)          |
| Validation     | Zod                                               |
| Auth           | JWT (standalone, bcrypt for passwords)             |
| File handling  | Multer → GCS upload                              |
| API versioning | URL prefix: `/api/v1/`                           |

### 4. Database (`database/`)

| Aspect         | Detail                                           |
| -------------- | ------------------------------------------------ |
| Engine         | MySQL 8.0                                        |
| Hosting        | Google Cloud SQL (instance: `cartech-mysql`, region: `me-west1-b`) |
| Schema         | New database `emunah_companion` on existing instance |
| Migrations     | Prisma Migrate                                    |
| Naming         | snake_case tables and columns                    |

### 5. Cloud Storage (`infra/`)

| Aspect         | Detail                                        |
| -------------- | --------------------------------------------- |
| Provider       | Google Cloud Storage                          |
| Buckets        | See `docs/04_STORAGE_GCS.md`                  |
| Access         | Signed URLs for reads, service account writes |
| CDN            | TBD (Cloud CDN or direct GCS)                 |

### 6. Shared Package (`packages/shared/`)

| Aspect         | Detail                              |
| -------------- | ----------------------------------- |
| Purpose        | Shared TypeScript types, constants  |
| Consumed by    | Mobile, Admin, Server               |

---

## Communication Patterns

| Path                   | Protocol     | Auth                    |
| ---------------------- | ------------ | ----------------------- |
| Mobile → Backend       | HTTPS / REST | Bearer JWT token        |
| Admin → Backend        | HTTPS / REST | Bearer JWT token        |
| Backend → Cloud SQL    | TCP (MySQL)  | IAM / password          |
| Backend → GCS          | HTTPS (SDK)  | Service account         |

---

## Deployment Strategy (v1)

| Component    | Hosting                        |
| ------------ | ------------------------------ |
| Backend      | TBD (Cloud Run / GCE / GKE)   |
| Admin Web    | TBD (Vercel / Cloud Run)      |
| Mobile       | Expo EAS Build → App Stores   |
| Database     | Google Cloud SQL (existing)    |
| Storage      | Google Cloud Storage           |

---

## Architecture Decisions

| #  | Decision                            | Status       | Choice                      |
| -- | ----------------------------------- | ------------ | --------------------------- |
| 1  | State management library (mobile)   | ✅ Decided    | Zustand                     |
| 2  | ORM / query builder                 | ✅ Decided    | Prisma                      |
| 3  | Admin UI component library          | ✅ Decided    | Tailwind CSS + shadcn/ui    |
| 4  | Auth strategy                       | ✅ Decided    | Standalone JWT + bcrypt     |
| 5  | Backend hosting platform            | ❓ Open       |                             |
| 6  | Caching layer (Redis?)              | ❓ Open       |                             |
| 7  | Monorepo tooling                    | ✅ Decided    | npm workspaces + Turborepo  |
