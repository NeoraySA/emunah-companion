# 03 – API Specification

> Last updated: 2026-02-10  
> Status: **Draft** – endpoints will be refined during implementation.

---

## General Conventions

| Aspect          | Convention                                                    |
| --------------- | ------------------------------------------------------------- |
| Base URL        | `/api/v1`                                                     |
| Format          | JSON (request & response)                                     |
| Auth            | JWT – Bearer token in `Authorization` header      |
| Language        | `Accept-Language` header (`he`, `en`) for content negotiation |
| Pagination      | `?page=1&limit=20` → response includes `meta.totalPages`     |
| Sorting         | `?sort=created_at&order=desc`                                 |

### Success Response Envelope

```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
}
```

### Error Response Envelope

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'title' is required.",
    "details": []
  }
}
```

### HTTP Status Codes

| Code | Usage                         |
| ---- | ----------------------------- |
| 200  | Success                       |
| 201  | Created                       |
| 204  | Deleted (no content)          |
| 400  | Bad request / validation      |
| 401  | Unauthorized                  |
| 403  | Forbidden                     |
| 404  | Not found                     |
| 409  | Conflict (duplicate)          |
| 500  | Internal server error         |

---

## Endpoints

### Health

| Method | Path              | Description         | Auth  |
| ------ | ----------------- | ------------------- | ----- |
| GET    | `/api/v1/health`  | Health check        | None  |

---

### Auth

| Method | Path                        | Description                     | Auth   |
| ------ | --------------------------- | ------------------------------- | ------ |
| POST   | `/api/v1/auth/register`     | Register new user               | None   |
| POST   | `/api/v1/auth/login`        | Login, returns JWT tokens       | None   |
| POST   | `/api/v1/auth/refresh`      | Refresh access token            | Refresh token |
| POST   | `/api/v1/auth/logout`       | Invalidate refresh token        | User   |
| POST   | `/api/v1/auth/change-password` | Change password              | User   |

---

### Languages

| Method | Path                    | Description              | Auth   |
| ------ | ----------------------- | ------------------------ | ------ |
| GET    | `/api/v1/languages`     | List active languages    | None   |

---

### Home Buttons

| Method | Path                        | Description                    | Auth   |
| ------ | --------------------------- | ------------------------------ | ------ |
| GET    | `/api/v1/home-buttons`      | List active home buttons       | None   |
| POST   | `/api/v1/home-buttons`      | Create a home button           | Admin  |
| PUT    | `/api/v1/home-buttons/:id`  | Update a home button           | Admin  |
| DELETE | `/api/v1/home-buttons/:id`  | Soft-delete a home button      | Admin  |

---

### Scenarios

| Method | Path                                          | Description                       | Auth   |
| ------ | --------------------------------------------- | --------------------------------- | ------ |
| GET    | `/api/v1/scenarios`                           | List active scenarios             | User   |
| GET    | `/api/v1/scenarios/:id`                       | Get scenario with steps           | User   |
| POST   | `/api/v1/scenarios`                           | Create scenario                   | Admin  |
| PUT    | `/api/v1/scenarios/:id`                       | Update scenario                   | Admin  |
| DELETE | `/api/v1/scenarios/:id`                       | Soft-delete scenario              | Admin  |

### Scenario Steps

| Method | Path                                                  | Description             | Auth   |
| ------ | ----------------------------------------------------- | ----------------------- | ------ |
| GET    | `/api/v1/scenarios/:scenarioId/steps`                 | List steps for scenario | User   |
| POST   | `/api/v1/scenarios/:scenarioId/steps`                 | Add step                | Admin  |
| PUT    | `/api/v1/scenarios/:scenarioId/steps/:stepId`         | Update step             | Admin  |
| DELETE | `/api/v1/scenarios/:scenarioId/steps/:stepId`         | Soft-delete step        | Admin  |

---

### Translations

| Method | Path                          | Description                                  | Auth   |
| ------ | ----------------------------- | -------------------------------------------- | ------ |
| GET    | `/api/v1/translations`        | Get translations (query: entity_type, etc.)  | None   |
| PUT    | `/api/v1/translations`        | Upsert translations (bulk)                   | Admin  |

---

### Journal

| Method | Path                        | Description                     | Auth   |
| ------ | --------------------------- | ------------------------------- | ------ |
| GET    | `/api/v1/journal`           | List user's journal entries     | User   |
| GET    | `/api/v1/journal/:id`       | Get single journal entry        | User   |
| POST   | `/api/v1/journal`           | Create journal entry            | User   |
| PUT    | `/api/v1/journal/:id`       | Update journal entry            | User   |
| DELETE | `/api/v1/journal/:id`       | Soft-delete journal entry       | User   |

---

### Anchors (Reminders)

| Method | Path                       | Description                    | Auth   |
| ------ | -------------------------- | ------------------------------ | ------ |
| GET    | `/api/v1/anchors`          | List user's anchors            | User   |
| POST   | `/api/v1/anchors`          | Create anchor                  | User   |
| PUT    | `/api/v1/anchors/:id`      | Update anchor                  | User   |
| DELETE | `/api/v1/anchors/:id`      | Soft-delete anchor             | User   |

---

### Media

| Method | Path                       | Description                      | Auth   |
| ------ | -------------------------- | -------------------------------- | ------ |
| POST   | `/api/v1/media/upload`     | Upload file to GCS               | Admin  |
| GET    | `/api/v1/media`            | List media assets                | Admin  |
| GET    | `/api/v1/media/:id/url`    | Get signed URL for asset         | User   |
| DELETE | `/api/v1/media/:id`        | Soft-delete media record         | Admin  |

---

### Users (if needed)

| Method | Path                       | Description                     | Auth   |
| ------ | -------------------------- | ------------------------------- | ------ |
| GET    | `/api/v1/users/me`         | Get current user profile        | User   |
| PUT    | `/api/v1/users/me`         | Update profile / preferences    | User   |

---

## Resolved Decisions

| # | Question                                          | Decision              |
|---|---------------------------------------------------|-----------------------|
| 1 | Auth flow                                         | ✅ JWT register/login/refresh/logout |
| 2 | Translations in entity GETs                       | ❓ Open (TBD during impl) |

## Open Questions

| # | Question                                          | Status   |
|---|---------------------------------------------------|----------|
| 1 | Rate limiting strategy                            | ❓ Open   |
| 2 | Webhook/event endpoints for admin?                | ❓ Open   |
