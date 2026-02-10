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
| State          | TBD (React Context / Zustand / Redux Toolkit) |
| API Client     | Axios or fetch wrapper                        |
| i18n           | Dynamic from API, local cache                 |

### 2. Admin Web (`apps/admin/`)

| Aspect         | Detail                                 |
| -------------- | -------------------------------------- |
| Framework      | Next.js (App Router)                   |
| Language       | TypeScript                             |
| UI Library     | TBD (Tailwind CSS, shadcn/ui, MUI)    |
| Auth           | TBD                                    |
| API Client     | Fetch / SWR / React Query             |

### 3. Backend API (`server/`)

| Aspect         | Detail                                           |
| -------------- | ------------------------------------------------ |
| Runtime        | Node.js (LTS)                                    |
| Framework      | Express.js                                       |
| Language       | TypeScript                                       |
| ORM / Query    | TBD (Knex.js, Prisma, TypeORM)                   |
| Validation     | Zod or Joi                                       |
| Auth           | TBD                                               |
| File handling  | Multer → GCS upload                              |
| API versioning | URL prefix: `/api/v1/`                           |

### 4. Database (`database/`)

| Aspect         | Detail                                           |
| -------------- | ------------------------------------------------ |
| Engine         | MySQL 8.x                                        |
| Hosting        | Google Cloud SQL (existing instance)             |
| Schema         | New database on existing instance                |
| Migrations     | TBD (Knex migrations, Prisma Migrate, raw SQL)   |
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

| Path                   | Protocol     | Auth              |
| ---------------------- | ------------ | ----------------- |
| Mobile → Backend       | HTTPS / REST | Bearer token (TBD)|
| Admin → Backend        | HTTPS / REST | Bearer token (TBD)|
| Backend → Cloud SQL    | TCP (MySQL)  | IAM / password    |
| Backend → GCS          | HTTPS (SDK)  | Service account   |

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

## Open Architecture Decisions

| #  | Decision                            | Status    |
| -- | ----------------------------------- | --------- |
| 1  | State management library (mobile)   | ❓ Open    |
| 2  | ORM / query builder                 | ❓ Open    |
| 3  | Admin UI component library          | ❓ Open    |
| 4  | Auth strategy (JWT, Firebase, etc.) | ❓ Open    |
| 5  | Backend hosting platform            | ❓ Open    |
| 6  | Caching layer (Redis?)              | ❓ Open    |
