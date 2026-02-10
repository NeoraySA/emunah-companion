# Database Instructions

> Domain: `database/` – MySQL on Google Cloud SQL

---

## Responsibilities

- Store all application data: content, users, journals, anchors, media metadata.
- Provide a translation system for multi-language content.
- Support schema migrations (versioned, reversible).
- Provide seed data for development and testing.

---

## Conventions

### General
- **Engine**: MySQL 8.x on Google Cloud SQL (existing instance, new database/schema).
- **Database name**: `emunah_companion` (or as configured in env).
- **Character set**: `utf8mb4` (full Unicode support for Hebrew + emoji).
- **Collation**: `utf8mb4_unicode_ci`.

### Naming
| Element           | Convention       | Example                |
| ----------------- | ---------------- | ---------------------- |
| Tables            | snake_case       | `scenario_steps`       |
| Columns           | snake_case       | `created_at`           |
| Primary keys      | `id`             | `id INT AUTO_INCREMENT`|
| Foreign keys      | `<table>_id`     | `scenario_id`          |
| Indexes           | `idx_<table>_<cols>` | `idx_translations_entity` |
| Unique constraints| `uq_<table>_<cols>`  | `uq_translations_composite` |

### Standard Columns

Every table should include:
```sql
created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

Tables supporting soft delete should also include:
```sql
deleted_at  TIMESTAMP NULL DEFAULT NULL
```

### File Structure
```
database/
├── migrations/
│   ├── 001_create_languages.sql
│   ├── 002_create_users.sql
│   ├── 003_create_home_buttons.sql
│   ├── 004_create_scenarios.sql
│   ├── 005_create_scenario_steps.sql
│   ├── 006_create_translations.sql
│   ├── 007_create_journal_entries.sql
│   ├── 008_create_anchors.sql
│   └── 009_create_media_assets.sql
├── seeds/
│   ├── 001_languages.sql
│   ├── 002_sample_home_buttons.sql
│   └── 003_sample_scenarios.sql
├── schema.sql            # Full schema dump (generated)
└── README.md             # Migration instructions
```

---

## Migration Rules

1. **One migration per change**: Each migration file does ONE thing.
2. **Sequential numbering**: `NNN_description.sql` (e.g., `010_add_user_avatar.sql`).
3. **Reversible**: Every migration must have an UP and DOWN section (or separate files).
4. **Never edit past migrations**: Create a new migration to alter existing tables.
5. **Test locally first**: Run migration against local DB before applying to Cloud SQL.

### Migration File Format
```sql
-- UP
CREATE TABLE example (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DOWN
DROP TABLE IF EXISTS example;
```

---

## Acceptance Criteria (per migration)

- [ ] Migration runs without error on a clean database.
- [ ] DOWN migration cleanly reverses the UP migration.
- [ ] Foreign keys have proper ON DELETE behavior defined.
- [ ] Indexes exist on frequently queried columns.
- [ ] `utf8mb4` charset used for all text columns.
- [ ] Soft delete columns (`deleted_at`) where applicable.
- [ ] Seed data runs after migration and populates expected defaults.

---

## Testing & Verification

| Type            | Method                                | Command              |
| --------------- | ------------------------------------- | -------------------- |
| Migration test  | Run UP + DOWN on clean local DB       | `npm run migrate`    |
| Seed test       | Run seeds and verify data             | `npm run seed`       |
| Schema check    | Compare live schema to expected       | Manual / diff tool   |
| Query test      | Test complex queries in isolation     | MySQL client / Jest  |

### Checklist
- [ ] All tables created with correct types and constraints.
- [ ] Foreign keys reference correct parent tables.
- [ ] Unique constraints prevent duplicate data.
- [ ] Default values set correctly.
- [ ] Translations table can handle all entity types.
- [ ] Sample data is realistic and covers edge cases.

---

## Security Notes

- Never store passwords in plain text (use bcrypt/argon2 if doing local auth).
- Use parameterized queries in all application code.
- Cloud SQL access: use IAM authentication or strong passwords.
- Restrict DB user permissions (no `DROP DATABASE` in app account).
- Never expose connection strings in client code or logs.

---

## Cloud SQL Connection

```bash
# Local development via Cloud SQL Proxy
cloud-sql-proxy <INSTANCE_CONNECTION_NAME> --port=3306 &

# Environment variables
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=emunah_app
DB_PASSWORD=<from-secret-manager>
DB_NAME=emunah_companion
```
