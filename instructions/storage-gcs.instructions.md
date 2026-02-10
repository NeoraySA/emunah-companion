# Storage (GCS) Instructions

> Domain: `infra/` + `server/` – Google Cloud Storage integration

---

## Responsibilities

- Store all uploaded binary assets (audio, images, exports) in GCS.
- Provide secure signed URLs for client-side access.
- Manage file metadata in the `media_assets` database table.
- Enforce file validation (type, size) on upload.
- Handle cleanup of orphaned files.

---

## Conventions

### Buckets

| Bucket                        | Purpose              | Details in `docs/04_STORAGE_GCS.md` |
| ----------------------------- | -------------------- | ----------------------------------- |
| `emunah-companion-media`      | Media assets         | ✅                                   |
| `emunah-companion-exports`    | Admin exports        | ✅                                   |
| `emunah-companion-backups`    | DB backups           | ✅                                   |

### File Path Pattern

```
{category}/{sub-category}/{uuid}.{extension}

Example: audio/scenarios/a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp3
```

### Upload Flow

1. Admin uploads file via POST `/api/v1/media/upload`.
2. Backend validates file (type, size).
3. Backend generates UUID filename.
4. Backend uploads to GCS via `@google-cloud/storage` SDK.
5. Backend saves metadata to `media_assets` table.
6. Backend returns asset ID + metadata.

### Download Flow

1. Client requests signed URL via GET `/api/v1/media/:id/url`.
2. Backend generates time-limited signed URL.
3. Client uses signed URL to fetch file directly from GCS.

---

## File Structure

### Server-side GCS code
```
server/src/
├── services/
│   └── storage.service.ts     # GCS upload, delete, signed URL generation
├── middleware/
│   └── upload.middleware.ts    # Multer config for file handling
├── validators/
│   └── media.validator.ts     # File type/size validation
└── config/
    └── gcs.config.ts          # Bucket names, signed URL expiry, etc.
```

### Infrastructure config
```
infra/
├── gcs/
│   ├── bucket-config.json     # Bucket settings (CORS, lifecycle)
│   └── README.md              # Setup instructions
└── ...
```

---

## Acceptance Criteria (per feature)

### Upload
- [ ] File type validated against whitelist.
- [ ] File size checked against maximum (50 MB).
- [ ] UUID generated for filename (no collisions).
- [ ] File uploaded to correct GCS bucket/path.
- [ ] Metadata saved to `media_assets` table.
- [ ] Error returned for invalid file type/size.
- [ ] Original filename preserved in DB record.

### Signed URL
- [ ] Signed URL generated with correct expiry.
- [ ] URL allows GET access only.
- [ ] Expired URLs return 403 from GCS.
- [ ] Non-existent assets return 404 from API.

### Delete
- [ ] Soft delete sets `deleted_at` in DB.
- [ ] Actual GCS object retained until cleanup job runs.
- [ ] Cleanup job only deletes objects >30 days post soft-delete.

---

## Testing & Verification

| Type                | Method                                          |
| ------------------- | ----------------------------------------------- |
| Upload test         | Upload valid file → verify in GCS + DB          |
| Invalid upload      | Upload wrong type/too large → verify rejection  |
| Signed URL test     | Get URL → fetch file → verify content           |
| Expiry test         | Wait for expiry → verify 403 from GCS           |
| Delete test         | Soft-delete → verify `deleted_at` set           |
| Cleanup test        | Run cleanup → verify orphaned objects removed   |

### Checklist
- [ ] GCS service account has correct IAM permissions.
- [ ] CORS configured on media bucket for client access.
- [ ] Environment variables set for all bucket names.
- [ ] Service gracefully handles GCS SDK errors.
- [ ] No credentials leaked in logs or error messages.

---

## Security Notes

- **Never** commit service account JSON files.
- Use Workload Identity in production (not key files).
- Signed URLs should have minimum necessary expiry time.
- Validate MIME type server-side (don't trust client Content-Type).
- Block executable file types (`.exe`, `.sh`, `.bat`, etc.).
- Use private bucket ACL; all access via signed URLs.
- CORS should only allow requests from our domains.
