# 05 – Development Workflow

> Last updated: 2026-02-10

---

## Prerequisites

| Tool       | Version       | Purpose                    |
| ---------- | ------------- | -------------------------- |
| Node.js    | 20 LTS+       | Runtime for all projects   |
| npm        | 10+           | Package manager            |
| Git        | 2.40+         | Version control            |
| MySQL      | 8.x           | Local DB (or connect to Cloud SQL) |
| Expo CLI   | Latest        | Mobile dev                 |
| VS Code    | Latest        | IDE                        |

---

## Environment Setup

### 1. Clone & Install

```bash
git clone <remote-url> emunah-companion
cd emunah-companion
npm install          # When package.json exists
```

### 2. Environment Variables

Copy `.env.example` to `.env` in each project that needs it:

```bash
cp server/.env.example server/.env
cp apps/admin/.env.example apps/admin/.env
cp apps/mobile/.env.example apps/mobile/.env
```

> **NEVER commit `.env` files.** They are gitignored.

### 3. Database

```bash
# Option A: Local MySQL
mysql -u root -p -e "CREATE DATABASE emunah_companion;"

# Option B: Cloud SQL via proxy
cloud-sql-proxy <INSTANCE_CONNECTION_NAME> &
```

### 4. Run Migrations

```bash
cd database
npm run migrate      # TBD – exact command depends on migration tool
npm run seed         # Populate with default data
```

---

## Development Commands (planned)

| Command              | Location      | Purpose                        |
| -------------------- | ------------- | ------------------------------ |
| `npm run dev`        | `server/`     | Start Express dev server       |
| `npm run dev`        | `apps/admin/` | Start Next.js dev server       |
| `npx expo start`    | `apps/mobile/`| Start Expo dev server          |
| `npm run test`       | Any project   | Run tests                      |
| `npm run lint`       | Any project   | Run ESLint                     |
| `npm run format`     | Root          | Run Prettier                   |
| `npm run migrate`    | `database/`   | Run pending migrations         |
| `npm run seed`       | `database/`   | Seed default data              |

---

## Git Workflow

### Branching Strategy

```
main           ← production-ready (protected)
  └── develop  ← integration branch
       ├── feature/home-buttons
       ├── feature/scenario-flow
       ├── fix/translation-bug
       └── ...
```

| Branch Pattern     | Purpose                     | Base        | Merge Into |
| ------------------ | --------------------------- | ----------- | ---------- |
| `main`             | Production release           | –           | –          |
| `develop`          | Integration                 | `main`      | `main`     |
| `feature/<name>`   | New feature                 | `develop`   | `develop`  |
| `fix/<name>`       | Bug fix                     | `develop`   | `develop`  |
| `hotfix/<name>`    | Urgent production fix       | `main`      | `main` + `develop` |

### Flow

1. Create branch from `develop`: `git checkout -b feature/<name> develop`
2. Implement ONE task (code + tests + docs).
3. Push branch: `git push -u origin feature/<name>`
4. Open PR against `develop`.
5. Review: code review + docs updated + tests pass.
6. Merge (squash preferred).
7. Update `docs/06_PROGRESS_LOG.md`.
8. Delete branch after merge.

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

feat(api): add scenario CRUD endpoints
fix(mobile): resolve navigation crash on iOS
docs(arch): update architecture diagram
chore(deps): upgrade express to 4.19
refactor(server): extract validation middleware
test(api): add journal endpoint tests
```

---

## Code Quality

### Pre-commit (planned)

- ESLint check
- Prettier format check
- TypeScript compilation check
- Run affected tests

### CI Pipeline (planned)

```
PR opened → Lint → Type check → Test → Build → ✅ Ready for review
```

---

## Project Structure Reference

```
emunah-companion/
├── .github/
│   └── copilot-instructions.md
├── apps/
│   ├── mobile/          # Expo React Native
│   └── admin/           # Next.js admin
├── packages/
│   └── shared/          # Shared types & utils
├── server/              # Express API
├── database/
│   ├── migrations/
│   └── seeds/
├── docs/                # Documentation (authoritative)
├── instructions/        # AI agent instructions
├── scripts/             # Utility scripts
├── infra/               # Infrastructure config
├── .gitignore
├── .prettierrc
├── .eslintrc.js
├── CONTRIBUTING.md
├── CODEOWNERS
├── package.json         # Root workspace config
└── README.md
```

---

## Open Questions

| # | Question                                   | Status   |
|---|--------------------------------------------|----------|
| 1 | Monorepo tool? (npm workspaces / Turborepo)| ❓ Open   |
| 2 | CI/CD platform (GitHub Actions, Cloud Build)| ❓ Open  |
| 3 | Pre-commit hook tool (Husky, lint-staged)  | ❓ Open   |
| 4 | Docker for local dev?                      | ❓ Open   |
