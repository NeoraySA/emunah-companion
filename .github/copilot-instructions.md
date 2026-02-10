# Copilot Instructions – Emunah Companion

> **This file is the single source of truth for how the AI coding agent operates in this project.**
> If these instructions conflict with code, update docs and ask the human.

---

## 🌐 Language Requirement

- **All replies to the user must be in Hebrew.**
- Code, folder names, identifiers, and comments may remain in English (preferred).
- All explanations, plans, summaries, and questions → **Hebrew only**.

---

## 🔒 Non-Negotiable Operating Rules

### 1. One Task at a Time
- Work on exactly **ONE** scoped task, then **STOP** and ask the user to confirm before continuing.
- Never start multiple features/areas in the same iteration.

### 2. Ask When Uncertain
- If **anything** is unclear (requirements, naming, infra, schema, permissions, costs, security) → **STOP** and ask questions **before** implementing.

### 3. Plan → Implement
- For any coding task, **first** write a short plan with checkboxes.
- **Wait** for user approval, **then** implement.

### 4. Keep Docs Authoritative
- All decisions must be recorded in the `docs/` folder.
- If docs conflict with code → update docs and ask the user.

### 5. No Parallel Work
- Never start multiple features/areas in the same iteration.

### 6. Progress Tracking
- Update `docs/06_PROGRESS_LOG.md` after every completed task.
- Use the todo list tool to track multi-step work.

---

## 🛠 Tech Stack

| Layer           | Technology                          |
| --------------- | ----------------------------------- |
| Mobile App      | React Native + Expo (iOS + Android) |
| Admin Web       | Next.js (React)                     |
| Backend API     | Node.js + Express                   |
| Database        | MySQL 8.0 (Google Cloud SQL – instance: `cartech-mysql`, project: `cartech-v1`) |
| Cloud Storage   | Google Cloud Storage (GCS)          |
| ORM             | Prisma                              |
| Auth            | Standalone JWT + bcrypt             |
| Monorepo        | npm workspaces + Turborepo          |
| Language        | TypeScript everywhere               |

---

## 📐 Coding Standards

### General
- **Language**: TypeScript for all projects (strict mode).
- **Formatter**: Prettier (config at root).
- **Linter**: ESLint with recommended + TypeScript rules.
- **Package manager**: npm (lockfile committed).

### Naming Conventions
| Element          | Convention       | Example                    |
| ---------------- | ---------------- | -------------------------- |
| Files/folders    | kebab-case       | `user-service.ts`          |
| React components | PascalCase file  | `ScenarioCard.tsx`         |
| Variables/funcs  | camelCase        | `getUserById`              |
| Constants        | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`          |
| DB tables        | snake_case       | `scenario_steps`           |
| DB columns       | snake_case       | `created_at`               |
| API routes       | kebab-case       | `/api/v1/scenario-steps`   |
| Env variables    | UPPER_SNAKE_CASE | `DATABASE_URL`             |

### Project Structure (target)
```
emunah-companion/
├── apps/
│   ├── mobile/          # Expo React Native app
│   └── admin/           # Next.js admin panel
├── packages/
│   └── shared/          # Shared types, utils, constants
├── server/              # Express API server
├── database/            # Migrations, seeds, schema
├── docs/                # All documentation
├── instructions/        # Per-domain AI instructions
├── scripts/             # Utility scripts
├── .github/             # GitHub config + Copilot instructions
└── infra/               # Infrastructure config (GCS, Cloud SQL)
```

### API Conventions
- RESTful with versioned routes: `/api/v1/...`
- JSON request/response bodies.
- Standard error envelope: `{ success: false, error: { code, message } }`.
- Standard success envelope: `{ success: true, data: ... }`.

### Git Conventions
- See `CONTRIBUTING.md` for full details.
- Branch naming: `feature/<name>`, `fix/<name>`.
- Commit messages: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`).
- One task per branch. PR per task. Merge only after verification + docs update.

---

## 📂 Key Documentation Files

| File                          | Purpose                              |
| ----------------------------- | ------------------------------------ |
| `docs/00_PRODUCT_OVERVIEW.md` | Product vision, scope, user stories  |
| `docs/01_ARCHITECTURE.md`     | System architecture, diagrams        |
| `docs/02_DATA_MODEL.md`       | Database schema, ERD                 |
| `docs/03_API_SPEC.md`         | API endpoints specification          |
| `docs/04_STORAGE_GCS.md`      | GCS strategy, buckets, access        |
| `docs/05_DEV_WORKFLOW.md`     | Dev environment setup, workflows     |
| `docs/06_PROGRESS_LOG.md`     | Task completion log                  |
| `CONTRIBUTING.md`             | Git workflow, commit conventions     |

---

## ⚠️ Security Reminders

- **NEVER** commit secrets, API keys, or service account JSON files.
- Use `.env` files locally; they are gitignored.
- GCS credentials: use workload identity or environment-provided credentials in production.
- All user input must be validated and sanitized on the backend.

---

## 🧪 Testing & Verification

- Every feature must include basic tests before merging.
- Backend: Jest for unit/integration tests.
- Mobile: React Native Testing Library.
- Admin: Jest + React Testing Library.
- Run `npm test` before every PR.

---

## 📋 Content & i18n

- All user-facing content is stored in the database, **never hardcoded**.
- Multi-language support built in from day 1 (Hebrew primary, English secondary).
- Translation keys and content managed via Admin CMS.
- See `instructions/content-i18n.instructions.md` for details.
