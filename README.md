# Emunah Companion

> Faith & Bittachon mobile app, admin CMS, and backend API.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment files
cp server/.env.example server/.env
# Edit server/.env with your values

# Build shared package
npm run build -w @emunah/shared

# Start server in dev mode
npm run dev:server
```

## Project Structure

```
emunah-companion/
├── apps/
│   ├── mobile/          # React Native + Expo
│   └── admin/           # Next.js admin panel
├── packages/
│   └── shared/          # Shared TypeScript types & constants
├── server/              # Express API server
├── database/            # Prisma schema, migrations, seeds
├── docs/                # Documentation
├── instructions/        # AI agent instructions
├── scripts/             # Utility scripts
├── infra/               # GCS & Cloud SQL config
└── ...config files
```

## Documentation

See the [docs/](docs/) folder for full documentation:

- [Product Overview](docs/00_PRODUCT_OVERVIEW.md)
- [Architecture](docs/01_ARCHITECTURE.md)
- [Data Model](docs/02_DATA_MODEL.md)
- [API Spec](docs/03_API_SPEC.md)
- [Storage (GCS)](docs/04_STORAGE_GCS.md)
- [Dev Workflow](docs/05_DEV_WORKFLOW.md)
- [Progress Log](docs/06_PROGRESS_LOG.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for git workflow and commit conventions.

## Tech Stack

| Layer     | Technology                      |
| --------- | ------------------------------- |
| Mobile    | React Native + Expo             |
| Admin     | Next.js + Tailwind + shadcn/ui  |
| Backend   | Node.js + Express + Prisma      |
| Database  | MySQL 8.0 (Google Cloud SQL)    |
| Storage   | Google Cloud Storage            |
| Auth      | JWT + bcrypt                    |
| Language  | TypeScript everywhere           |
