# 04 – Storage Strategy (Google Cloud Storage)

> Last updated: 2026-02-10

---

## Overview

All uploaded/managed binary assets (audio files, images, JSON exports, etc.) are stored in **Google Cloud Storage (GCS)**. The database stores metadata and GCS paths; actual files live in GCS buckets.

---

## Bucket Strategy

| Bucket Name (proposed)              | Purpose                          | Access           |
| ----------------------------------- | -------------------------------- | ---------------- |
| `emunah-companion-media`            | Audio, images, media assets      | Signed URLs      |
| `emunah-companion-exports`          | JSON/CSV admin exports           | Admin only       |
| `emunah-companion-backups`          | Database backups (automated)     | Service account  |

> **Note**: Bucket names must be globally unique. Final names will include a project-specific suffix.

---

## Folder Structure Within Buckets

### `emunah-companion-media`

```
media/
├── audio/
│   ├── scenarios/       # Audio for scenario steps
│   └── general/         # General audio content
├── images/
│   ├── scenarios/       # Scenario images & thumbnails
│   ├── home-buttons/    # Home button icons
│   └── general/         # General images
└── other/               # Any other file types
```

### `emunah-companion-exports`

```
exports/
├── content/             # Content JSON exports
├── translations/        # Translation exports
└── reports/             # Admin reports
```

---

## Access Patterns

### Upload Flow (Admin → Backend → GCS)

```
Admin Web                    Backend                     GCS
   │                           │                          │
   ├── POST /media/upload ────►│                          │
   │   (multipart/form-data)   │                          │
   │                           ├── Upload via GCS SDK ───►│
   │                           │                          │
   │                           │◄── Object path ──────────┤
   │                           │                          │
   │                           ├── Save metadata to DB    │
   │                           │                          │
   │◄── { success, data } ────┤                          │
```

### Read Flow (Mobile → Backend → Signed URL)

```
Mobile App                   Backend                     GCS
   │                           │                          │
   ├── GET /media/:id/url ────►│                          │
   │                           │                          │
   │                           ├── Generate signed URL ──►│
   │                           │                          │
   │◄── { url: "signed..." } ─┤                          │
   │                           │                          │
   ├── GET signed URL ────────────────────────────────────►│
   │◄── Binary content ──────────────────────────────────┤
```

---

## Authentication & Permissions

| Context         | Method                                                    |
| --------------- | --------------------------------------------------------- |
| Backend → GCS   | Service Account key or Workload Identity (preferred)     |
| Client reads    | Time-limited Signed URLs (1 hour expiry, configurable)   |
| Client uploads  | NOT allowed directly; always through backend             |

### Service Account Permissions

```
roles/storage.objectCreator   – for uploads
roles/storage.objectViewer    – for generating signed URLs
roles/storage.objectAdmin     – for deletes (backend only)
```

---

## Signed URL Configuration

| Parameter         | Value              |
| ----------------- | ------------------ |
| Default expiry    | 1 hour (3600s)     |
| Max expiry        | 24 hours           |
| HTTP method       | GET (reads only)   |
| Content type      | Preserved from upload |

---

## File Naming Convention

Files are stored with a unique path to avoid collisions:

```
{category}/{sub-category}/{uuid}.{extension}

Example: audio/scenarios/a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp3
```

- **UUID** generated server-side at upload time.
- Original filename stored in `media_assets.filename` DB column.
- MIME type validated server-side before upload.

---

## File Validation

| Check               | Rule                                           |
| -------------------- | ---------------------------------------------- |
| Max file size        | 50 MB (configurable via env)                   |
| Allowed MIME types   | `image/jpeg`, `image/png`, `image/webp`, `audio/mpeg`, `audio/mp4`, `application/json` |
| Filename sanitize    | Strip special chars, limit length              |

---

## Lifecycle & Cleanup

| Policy                       | Detail                                           |
| ---------------------------- | ------------------------------------------------ |
| Soft delete in DB            | `media_assets.deleted_at` set                    |
| GCS cleanup                  | Scheduled job deletes orphaned objects (>30 days) |
| Backup bucket retention      | 90 days                                          |
| Export bucket retention       | 30 days                                          |

---

## Environment Variables

```bash
# GCS Configuration
GCS_PROJECT_ID=your-gcp-project-id
GCS_MEDIA_BUCKET=emunah-companion-media
GCS_EXPORTS_BUCKET=emunah-companion-exports
GCS_BACKUPS_BUCKET=emunah-companion-backups
GCS_SIGNED_URL_EXPIRY=3600

# Credentials (local dev only – use workload identity in prod)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

---

## Open Questions

| # | Question                                                | Status   |
|---|---------------------------------------------------------|----------|
| 1 | Exact GCS bucket names (need GCP project ID)            | ❓ Open   |
| 2 | CDN in front of GCS? (Cloud CDN)                        | ❓ Open   |
| 3 | Image resizing/thumbnailing on upload?                  | ❓ Open   |
| 4 | Audio transcoding requirements?                         | ❓ Open   |
| 5 | Should exports be auto-deleted or manually managed?     | ❓ Open   |
