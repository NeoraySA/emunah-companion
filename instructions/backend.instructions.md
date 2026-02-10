# Backend Instructions

> Domain: `server/` – Node.js + Express

---

## Responsibilities

- Serve RESTful API endpoints for mobile app and admin web.
- Handle authentication and authorization.
- Validate and sanitize all input.
- Interact with MySQL (Cloud SQL) for data operations.
- Interact with GCS for file upload/download/signed URLs.
- Serve content with multi-language support (Accept-Language header).
- Handle errors consistently with standard envelopes.

---

## Conventions

### Tech
- **Runtime**: Node.js (20 LTS+)
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **ORM/Query Builder**: Prisma (type-safe, auto-generated types)
- **Validation**: Zod
- **Auth**: JWT (access + refresh tokens), bcrypt for passwords
- **File Handling**: Multer (memory storage) → GCS upload
- **Testing**: Jest + Supertest

### File Structure
```
server/
├── src/
│   ├── index.ts              # Entry point
│   ├── app.ts                # Express app setup
│   ├── config/               # Environment config
│   │   └── index.ts
│   ├── routes/               # Route definitions
│   │   ├── index.ts          # Route aggregator
│   │   ├── health.routes.ts
│   │   ├── scenario.routes.ts
│   │   ├── journal.routes.ts
│   │   ├── anchor.routes.ts
│   │   ├── home-button.routes.ts
│   │   ├── translation.routes.ts
│   │   └── media.routes.ts
│   ├── controllers/          # Request handlers
│   ├── services/             # Business logic
│   ├── models/               # Data access layer
│   ├── middleware/            # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error-handler.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── language.middleware.ts
│   ├── utils/                # Utility functions
│   ├── types/                # TypeScript types
│   └── validators/           # Zod/Joi schemas
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── tsconfig.json
└── package.json
```

### Naming
| Element           | Convention     | Example                       |
| ----------------- | -------------- | ----------------------------- |
| Route files       | kebab-case     | `scenario.routes.ts`          |
| Controllers       | kebab-case     | `scenario.controller.ts`      |
| Services          | kebab-case     | `scenario.service.ts`         |
| Middleware         | kebab-case     | `auth.middleware.ts`          |
| Validators        | kebab-case     | `scenario.validator.ts`       |

### API Pattern
```
Route → Validate → Controller → Service → Model/DB → Response
```

### Response Envelopes

```typescript
// Success
{ success: true, data: T, meta?: PaginationMeta }

// Error
{ success: false, error: { code: string, message: string, details?: any[] } }
```

---

## Acceptance Criteria (per endpoint)

- [ ] Endpoint returns correct status code.
- [ ] Request body validated; invalid input returns 400.
- [ ] Auth required where specified; returns 401/403 otherwise.
- [ ] Response matches documented envelope format.
- [ ] Soft deletes set `deleted_at` (not hard delete).
- [ ] Translations resolved based on `Accept-Language` header.
- [ ] SQL injection prevented (parameterized queries).
- [ ] No sensitive data in error messages.
- [ ] Integration test covers happy path + error case.

---

## Testing & Verification

| Type         | Tool             | Run Command       |
| ------------ | ---------------- | ----------------- |
| Unit tests   | Jest             | `npm test`        |
| Integration  | Jest + Supertest | `npm test`        |
| Type check   | TypeScript       | `npx tsc --noEmit`|
| Lint         | ESLint           | `npm run lint`    |
| Manual       | Postman / curl   | N/A               |

### Test Checklist
- [ ] All CRUD operations tested.
- [ ] Validation errors return proper messages.
- [ ] Auth middleware blocks unauthenticated requests.
- [ ] Pagination works correctly.
- [ ] Language negotiation returns correct translations.
- [ ] File upload endpoint handles valid and invalid files.

---

## Security Notes

- Validate and sanitize ALL input (params, body, query, headers).
- Use parameterized queries only (never concatenate SQL).
- Rate limit sensitive endpoints (auth, uploads).
- Helmet.js for security headers.
- CORS configured for allowed origins only.
- File upload: validate MIME type, enforce size limits.
- Never expose stack traces in production errors.
