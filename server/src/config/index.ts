const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  databaseUrl: process.env.DATABASE_URL || '',

  // JWT
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Journal encryption
  journalEncryptionKey: process.env.JOURNAL_ENCRYPTION_KEY || '',

  // GCS
  gcs: {
    projectId: process.env.GCS_PROJECT_ID || 'cartech-v1',
    mediaBucket: process.env.GCS_MEDIA_BUCKET || 'emunah-companion-media',
    exportsBucket: process.env.GCS_EXPORTS_BUCKET || 'emunah-companion-exports',
    signedUrlExpiry: parseInt(process.env.GCS_SIGNED_URL_EXPIRY || '3600', 10),
  },

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

export { config };
