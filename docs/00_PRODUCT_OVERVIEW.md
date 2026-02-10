# 00 – Product Overview: Emunah Companion

> Last updated: 2026-02-10

---

## Vision

Emunah Companion is a mobile app designed to help users strengthen their faith (emunah) and trust in God (bittachon) through structured, guided experiences. It combines scenario-based exercises, journaling, anchoring reminders, and curated content — all managed via a powerful admin CMS.

---

## Target Users

| Persona        | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| **End User**   | Hebrew/English-speaking individual seeking spiritual growth  |
| **Admin**      | Content manager who creates/edits scenarios, translations, and media |

---

## v1 Feature Scope

### Mobile App (End User)

| Feature                  | Description                                                                 |
| ------------------------ | --------------------------------------------------------------------------- |
| **Home Screen**          | Dynamic buttons/cards loaded from DB (not hardcoded)                        |
| **UX Flows (Scenarios)** | Multi-step guided flows for faith/bittachon exercises                        |
| **Journal**              | Personal journal for reflections, linked to scenarios                       |
| **Anchors / Reminders**  | Scheduled reminders & anchoring affirmations                                |
| **Multi-language**       | Hebrew primary, English secondary. All content from DB + translations table |

### Admin Web (CMS)

| Feature                      | Description                                                    |
| ---------------------------- | -------------------------------------------------------------- |
| **Scenario Management**      | CRUD scenarios, steps, flows                                   |
| **Content / Copy Management**| Edit all user-facing text, manage translation keys             |
| **Media Management**         | Upload/manage audio, images via GCS                            |
| **Home Button Config**       | Configure home screen buttons, ordering, visibility            |

### Backend API

| Feature                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| **REST API**           | Versioned endpoints for all app + admin operations   |
| **Auth**               | JWT-based authentication (register, login, refresh)        |
| **Content Delivery**   | Serve content with language negotiation              |
| **File Upload**        | Handle media uploads to GCS                          |

---

## Explicitly Out of Scope for v1

- AI clip parsing / NLP features
- Push notification service (beyond local reminders)
- Payment / subscription system
- Social features (sharing, community)

---

## Success Metrics (v1)

- App loads home screen with dynamic content from DB
- At least one complete scenario flow works end-to-end
- Journal entries can be created, viewed, edited
- Anchors/reminders can be set and fire locally
- Admin can CRUD scenarios and translations
- All content is multilingual (HE + EN)

---

## Resolved Decisions

| # | Question                                   | Decision              |
|---| ------------------------------------------ | --------------------- |
| 1 | Authentication strategy                    | ✅ Standalone JWT       |
| 2 | Journal privacy model                      | ✅ AES-256 encryption   |

## Open Decisions

| # | Question                                   | Status   |
|---| ------------------------------------------ | -------- |
| 1 | Push notification provider                 | ❓ Open   |
| 2 | Exact home screen layout/design            | ❓ Open   |
