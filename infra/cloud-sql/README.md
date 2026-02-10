# Cloud SQL Setup

## Instance Details

- **Instance name**: `cartech-mysql`
- **Region**: `me-west1-b`
- **Database version**: MySQL 8.0
- **Project**: `cartech-v1`

## Create Database

```bash
gcloud sql databases create emunah_companion \
  --instance=cartech-mysql \
  --charset=utf8mb4 \
  --collation=utf8mb4_unicode_ci
```

## Create App User

```bash
gcloud sql users create emunah_app \
  --instance=cartech-mysql \
  --password=YOUR_SECURE_PASSWORD
```

## Local Development (Cloud SQL Proxy)

```bash
# Install proxy
gcloud components install cloud-sql-proxy

# Run proxy
cloud-sql-proxy cartech-v1:me-west1-b:cartech-mysql --port=3306
```

Then set `DATABASE_URL` in your `.env`:
```
DATABASE_URL="mysql://emunah_app:YOUR_PASSWORD@127.0.0.1:3306/emunah_companion"
```
