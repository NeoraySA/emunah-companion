# Content & Internationalization (i18n) Instructions

> Domain: Cross-cutting – applies to all layers

---

## Responsibilities

- Ensure ALL user-facing text is stored in the database, never hardcoded.
- Provide multi-language support from day 1 (Hebrew primary, English secondary).
- Manage translations via the Admin CMS.
- Serve content in the user's preferred language via API.
- Handle RTL (Hebrew) and LTR (English) layout differences.

---

## Architecture

### Translation Storage

The `translations` table uses a **polymorphic** pattern:

```
translations
├── entity_type     -- 'scenario', 'home_button', 'scenario_step', etc.
├── entity_id       -- ID of the parent entity
├── language_id     -- FK to languages table
├── field_name      -- 'title', 'description', 'body', 'label', etc.
└── value           -- The translated text
```

**Unique constraint**: `(entity_type, entity_id, language_id, field_name)`

### Language Resolution Flow

```
1. Client sends Accept-Language header (e.g., "he", "en")
2. Backend middleware extracts language preference
3. When fetching content, backend JOINs translations table
4. If requested language not found → fall back to default (Hebrew)
5. Response includes resolved translations inline
```

### Content Structure Example

A scenario response might look like:

```json
{
  "id": 1,
  "key": "faith-basics",
  "category": "faith",
  "title": "יסודות האמונה",         // Resolved from translations
  "description": "תרגול בסיסי...",   // Resolved from translations
  "steps": [
    {
      "id": 1,
      "step_number": 1,
      "step_type": "text",
      "title": "הקדמה",
      "body": "ברוכים הבאים..."
    }
  ]
}
```

---

## Conventions

### What Gets Translated

| Entity           | Translatable Fields                    |
| ---------------- | -------------------------------------- |
| `home_buttons`   | `label`, `description`                 |
| `scenarios`      | `title`, `description`                 |
| `scenario_steps` | `title`, `body`, `prompt_text`         |
| App UI strings   | Stored as a special entity (TBD)       |

### What Does NOT Get Translated

- System fields (IDs, keys, dates, config)
- Admin-only interface text (English only is acceptable)
- Logs and error codes

### Adding a New Language

1. Insert row in `languages` table.
2. Add translations for all existing content via Admin CMS.
3. No code changes needed (data-driven).

### Translation Keys for App UI

For non-content UI strings (button labels, headers, etc.), we use a special entity type:

```
entity_type = 'ui_string'
entity_id = 0 (or a dedicated ui_strings table)
field_name = 'home.welcome_message', 'common.save', etc.
```

---

## Acceptance Criteria

- [ ] All user-facing text comes from the database.
- [ ] API correctly resolves language from `Accept-Language` header.
- [ ] Fallback to default language (Hebrew) when translation missing.
- [ ] Admin CMS allows editing translations for all languages.
- [ ] Adding a new language requires zero code changes.
- [ ] RTL layout works correctly for Hebrew content.
- [ ] LTR layout works correctly for English content.
- [ ] No hardcoded user-facing strings in mobile or admin code.

---

## Testing & Verification

| Test                          | How                                           |
| ----------------------------- | --------------------------------------------- |
| Language fallback             | Request with unsupported lang → get default   |
| Translation resolution        | Request with `Accept-Language: en` → English  |
| Missing translation           | Missing field → falls back to default lang    |
| Admin CRUD                    | Create/edit/delete translations via CMS       |
| RTL rendering                 | Visual check on Hebrew content in mobile      |
| New language                  | Add language + translations, verify display   |

### Checklist
- [ ] `translations` table has correct unique constraint.
- [ ] API middleware extracts and validates language.
- [ ] Service layer JOINs translations correctly.
- [ ] Mobile app switches layout direction based on language.
- [ ] Admin CMS shows all languages side by side for editing.
- [ ] Export/import translations works (JSON format).

---

## Security Notes

- Sanitize all translated content before rendering (XSS prevention).
- Admin-only access for editing translations.
- Validate language codes against `languages` table (no arbitrary values).
