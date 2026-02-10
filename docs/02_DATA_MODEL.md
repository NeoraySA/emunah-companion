# 02 – Data Model

> Last updated: 2026-02-10  
> Status: **Draft** – schema will be refined before implementation.

---

## Design Principles

1. **Content-driven**: All user-facing text lives in the database, never hardcoded.
2. **Multi-language from day 1**: Every content entity has translations via a dedicated table.
3. **Soft deletes**: Use `deleted_at` timestamps instead of hard deletes.
4. **Audit fields**: Every table has `created_at`, `updated_at`.
5. **snake_case**: All table and column names.

---

## Core Entities (v1)

### Languages

```sql
languages
├── id              INT PK AUTO_INCREMENT
├── code            VARCHAR(10) UNIQUE   -- 'he', 'en'
├── name            VARCHAR(50)          -- 'Hebrew', 'English'
├── is_default      BOOLEAN DEFAULT FALSE
├── is_active       BOOLEAN DEFAULT TRUE
├── created_at      TIMESTAMP
└── updated_at      TIMESTAMP
```

### Home Buttons

```sql
home_buttons
├── id              INT PK AUTO_INCREMENT
├── key             VARCHAR(100) UNIQUE  -- programmatic key
├── icon            VARCHAR(255)         -- icon name or URL
├── route           VARCHAR(255)         -- navigation target
├── sort_order      INT DEFAULT 0
├── is_active       BOOLEAN DEFAULT TRUE
├── created_at      TIMESTAMP
├── updated_at      TIMESTAMP
└── deleted_at      TIMESTAMP NULL
```

### Scenarios

```sql
scenarios
├── id              INT PK AUTO_INCREMENT
├── key             VARCHAR(100) UNIQUE  -- programmatic key
├── category        VARCHAR(100)         -- e.g., 'faith', 'bittachon'
├── sort_order      INT DEFAULT 0
├── is_active       BOOLEAN DEFAULT TRUE
├── created_at      TIMESTAMP
├── updated_at      TIMESTAMP
└── deleted_at      TIMESTAMP NULL
```

### Scenario Steps

```sql
scenario_steps
├── id              INT PK AUTO_INCREMENT
├── scenario_id     INT FK → scenarios.id
├── step_number     INT
├── step_type       ENUM('text','prompt','action','summary')
├── config_json     JSON NULL            -- step-specific config
├── sort_order      INT DEFAULT 0
├── created_at      TIMESTAMP
├── updated_at      TIMESTAMP
└── deleted_at      TIMESTAMP NULL
```

### Translations

```sql
translations
├── id              INT PK AUTO_INCREMENT
├── entity_type     VARCHAR(50)          -- 'home_button', 'scenario', 'scenario_step'
├── entity_id       INT                  -- FK to parent entity
├── language_id     INT FK → languages.id
├── field_name      VARCHAR(100)         -- 'title', 'description', 'body'
├── value           TEXT                 -- translated content
├── created_at      TIMESTAMP
├── updated_at      TIMESTAMP
```

> **Composite unique**: (`entity_type`, `entity_id`, `language_id`, `field_name`)

### Journal Entries

```sql
journal_entries
├── id              INT PK AUTO_INCREMENT
├── user_id         INT FK → users.id
├── scenario_id     INT FK → scenarios.id NULL
├── title           VARCHAR(255) NULL
├── body            TEXT
├── mood            VARCHAR(50) NULL
├── created_at      TIMESTAMP
├── updated_at      TIMESTAMP
└── deleted_at      TIMESTAMP NULL
```

### Anchors (Reminders)

```sql
anchors
├── id              INT PK AUTO_INCREMENT
├── user_id         INT FK → users.id
├── title           VARCHAR(255)
├── body            TEXT NULL
├── schedule_type   ENUM('once','daily','weekly','custom')
├── schedule_config JSON NULL            -- cron/time details
├── is_active       BOOLEAN DEFAULT TRUE
├── created_at      TIMESTAMP
├── updated_at      TIMESTAMP
└── deleted_at      TIMESTAMP NULL
```

### Users

```sql
users
├── id              INT PK AUTO_INCREMENT
├── external_id     VARCHAR(255) UNIQUE NULL  -- from auth provider
├── email           VARCHAR(255) UNIQUE NULL
├── display_name    VARCHAR(255) NULL
├── preferred_lang  VARCHAR(10) DEFAULT 'he'
├── is_active       BOOLEAN DEFAULT TRUE
├── created_at      TIMESTAMP
├── updated_at      TIMESTAMP
└── deleted_at      TIMESTAMP NULL
```

### Media Assets

```sql
media_assets
├── id              INT PK AUTO_INCREMENT
├── filename        VARCHAR(255)
├── mime_type       VARCHAR(100)
├── gcs_path        VARCHAR(500)         -- full GCS object path
├── size_bytes      BIGINT NULL
├── uploaded_by     INT FK → users.id NULL
├── entity_type     VARCHAR(50) NULL     -- optional link to parent
├── entity_id       INT NULL
├── created_at      TIMESTAMP
├── updated_at      TIMESTAMP
└── deleted_at      TIMESTAMP NULL
```

---

## Relationships Diagram (simplified)

```
users ─────┬──── journal_entries
           └──── anchors

scenarios ──┬──── scenario_steps
            └──── journal_entries (optional link)

translations ──── (polymorphic: any entity_type + entity_id)

media_assets ──── (polymorphic: any entity_type + entity_id)

languages ──────── translations
```

---

## Indexes (planned)

| Table             | Index                                                    |
| ----------------- | -------------------------------------------------------- |
| translations      | `(entity_type, entity_id, language_id, field_name)` UQ   |
| scenario_steps    | `(scenario_id, step_number)` UQ                         |
| journal_entries   | `(user_id, created_at)`                                  |
| anchors           | `(user_id, is_active)`                                   |
| home_buttons      | `(sort_order)`                                           |
| media_assets      | `(entity_type, entity_id)`                               |

---

## Migration Strategy

- Migrations will be managed via a tool (TBD: Knex, Prisma, or raw SQL files).
- All migrations live in `database/migrations/`.
- Seed data (default languages, sample content) in `database/seeds/`.
- Every migration must be reversible (up + down).

---

## Open Questions

| # | Question                                             | Status   |
|---|------------------------------------------------------|----------|
| 1 | Auth provider → impacts `users` table design         | ❓ Open   |
| 2 | Should journal entries be encrypted at rest?          | ❓ Open   |
| 3 | Do we need a `roles` / `permissions` table for admin? | ❓ Open   |
| 4 | Which ORM/migration tool to use?                     | ❓ Open   |
