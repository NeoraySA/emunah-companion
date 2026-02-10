# GCS Bucket Setup

## Create Buckets

```bash
# Media bucket
gcloud storage buckets create gs://emunah-companion-media \
  --project=cartech-v1 \
  --location=ME-WEST1 \
  --uniform-bucket-level-access

# Exports bucket
gcloud storage buckets create gs://emunah-companion-exports \
  --project=cartech-v1 \
  --location=ME-WEST1 \
  --uniform-bucket-level-access

# Backups bucket
gcloud storage buckets create gs://emunah-companion-backups \
  --project=cartech-v1 \
  --location=ME-WEST1 \
  --uniform-bucket-level-access \
  --default-storage-class=NEARLINE
```

## CORS Configuration

```bash
gcloud storage buckets update gs://emunah-companion-media \
  --cors-file=bucket-config.json
```

## Service Account Permissions

```bash
# Create service account (if needed)
gcloud iam service-accounts create emunah-storage \
  --display-name="Emunah Companion Storage"

# Grant permissions
gcloud projects add-iam-policy-binding cartech-v1 \
  --member="serviceAccount:emunah-storage@cartech-v1.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"
```
