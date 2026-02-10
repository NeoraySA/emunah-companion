// ============================================
// Emunah Companion – Shared Types & Constants
// ============================================

// ----- API Response Envelopes -----

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ----- Pagination Query -----

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// ----- Auth -----

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
  preferredLang?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: RoleName;
  iat?: number;
  exp?: number;
}

// ----- Roles -----

export type RoleName = 'admin' | 'editor' | 'user';

export interface Role {
  id: number;
  name: RoleName;
  description: string | null;
}

// ----- User -----

export interface UserProfile {
  id: number;
  email: string;
  displayName: string | null;
  preferredLang: string;
  role: RoleName;
  createdAt: string;
}

// ----- Languages -----

export interface Language {
  id: number;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
}

// ----- Home Buttons -----

export interface HomeButton {
  id: number;
  key: string;
  icon: string;
  route: string;
  sortOrder: number;
  isActive: boolean;
  label?: string; // resolved translation
  description?: string; // resolved translation
}

// ----- Scenarios -----

export interface Scenario {
  id: number;
  key: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  title?: string; // resolved translation
  description?: string; // resolved translation
}

export interface ScenarioWithSteps extends Scenario {
  steps: ScenarioStep[];
}

export type StepType = 'text' | 'prompt' | 'action' | 'summary';

export interface ScenarioStep {
  id: number;
  scenarioId: number;
  stepNumber: number;
  stepType: StepType;
  configJson: Record<string, unknown> | null;
  sortOrder: number;
  title?: string; // resolved translation
  body?: string; // resolved translation
  promptText?: string; // resolved translation
}

// ----- Journal -----

export interface JournalEntry {
  id: number;
  userId: number;
  scenarioId: number | null;
  title: string | null;
  body: string;
  mood: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJournalEntry {
  scenarioId?: number;
  title?: string;
  body: string;
  mood?: string;
}

export interface UpdateJournalEntry {
  title?: string;
  body?: string;
  mood?: string;
}

// ----- Anchors -----

export type ScheduleType = 'once' | 'daily' | 'weekly' | 'custom';

export interface Anchor {
  id: number;
  userId: number;
  title: string;
  body: string | null;
  scheduleType: ScheduleType;
  scheduleConfig: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnchor {
  title: string;
  body?: string;
  scheduleType: ScheduleType;
  scheduleConfig?: Record<string, unknown>;
}

// ----- Media -----

export interface MediaAsset {
  id: number;
  filename: string;
  mimeType: string;
  gcsPath: string;
  sizeBytes: number | null;
  entityType: string | null;
  entityId: number | null;
  createdAt: string;
}

export interface MediaUploadResponse {
  id: number;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

// ----- Translations -----

export interface Translation {
  id: number;
  entityType: string;
  entityId: number;
  languageId: number;
  fieldName: string;
  value: string;
}

export interface UpsertTranslation {
  entityType: string;
  entityId: number;
  languageId: number;
  fieldName: string;
  value: string;
}

// ----- Constants -----

export const SUPPORTED_LANGUAGES = ['he', 'en'] as const;
export const DEFAULT_LANGUAGE = 'he';
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'audio/mpeg',
  'audio/mp4',
  'application/json',
] as const;

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user',
} as const;
