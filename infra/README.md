# Infrastructure

Configuration files for Google Cloud infrastructure.

## Structure

```
infra/
├── gcs/
│   ├── bucket-config.json    # GCS bucket settings (CORS, lifecycle)
│   └── README.md             # Bucket setup instructions
└── cloud-sql/
    └── README.md             # Cloud SQL connection setup
```

## GCP Project

- **Project ID**: `cartech-v1`
- **Cloud SQL Instance**: `cartech-mysql` (me-west1-b)
- **Database**: `emunah_companion` (to be created)
