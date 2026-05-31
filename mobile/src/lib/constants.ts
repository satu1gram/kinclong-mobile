/**
 * lib/constants.ts — Konfigurasi global aplikasi
 */

// ─── Supabase Config ──────────────────────────────────────────────────────────

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// ─── AsyncStorage Keys ────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  ACCESS_TOKEN:   '@kinclong/auth/access_token',
  REFRESH_TOKEN:  '@kinclong/auth/refresh_token',
  USER_PROFILE:   '@kinclong/auth/profile',
  TENANT:         '@kinclong/auth/tenant',
  OUTLET:         '@kinclong/auth/outlet',
} as const;

// ─── Request timeouts ─────────────────────────────────────────────────────────

export const API_TIMEOUT_MS = 15_000;

// ─── Queue polling interval ───────────────────────────────────────────────────

export const QUEUE_POLL_INTERVAL_MS = 10_000;
