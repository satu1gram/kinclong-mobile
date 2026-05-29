/**
 * theme/colors.ts — Color tokens Design System Kinclong
 *
 * Sumber kebenaran (single source of truth) untuk semua warna.
 * Nilai ini di-mirror ke tailwind.config.js agar Tailwind classes
 * dan JS values selalu sinkron.
 *
 * Cara pakai di komponen:
 *   import { colors } from '@/theme';
 *   style={{ backgroundColor: colors.primary[500] }}
 *
 * Atau via Tailwind class (lebih disarankan):
 *   className="bg-primary-500 text-white"
 */

// ─── Brand Primary: Blue ───────────────────────────────────────────────────────
export const primaryColors = {
  50:       '#EFF6FF',
  100:      '#DBEAFE',
  200:      '#BFDBFE',
  300:      '#93C5FD',
  400:      '#60A5FA',
  500:      '#3B82F6', // ← Brand Blue (main)
  600:      '#2563EB',
  700:      '#1D4ED8',
  800:      '#1E40AF',
  900:      '#1E3A8A',
  DEFAULT:  '#3B82F6',
} as const;

// ─── Brand Accent: Orange ──────────────────────────────────────────────────────
export const accentColors = {
  50:       '#FFF7ED',
  100:      '#FFEDD5',
  200:      '#FED7AA',
  300:      '#FDBA74',
  400:      '#FB923C',
  500:      '#F97316', // ← Brand Orange (main)
  600:      '#EA580C',
  700:      '#C2410C',
  800:      '#9A3412',
  900:      '#7C2D12',
  DEFAULT:  '#F97316',
} as const;

// ─── Neutral ───────────────────────────────────────────────────────────────────
export const neutralColors = {
  white: '#FFFFFF',
  50:    '#F8FAFC',
  100:   '#F1F5F9',
  200:   '#E2E8F0',
  300:   '#CBD5E1',
  400:   '#94A3B8',
  500:   '#64748B',
  600:   '#475569',
  700:   '#334155',
  800:   '#1E293B',
  900:   '#0F172A',
  black: '#000000',
} as const;

// ─── Semantic ──────────────────────────────────────────────────────────────────
export const semanticColors = {
  success: {
    50:      '#F0FDF4',
    100:     '#DCFCE7',
    500:     '#22C55E',
    600:     '#16A34A',
    DEFAULT: '#22C55E',
  },
  warning: {
    50:      '#FEFCE8',
    100:     '#FEF9C3',
    500:     '#EAB308',
    600:     '#CA8A04',
    DEFAULT: '#EAB308',
  },
  error: {
    50:      '#FEF2F2',
    100:     '#FEE2E2',
    500:     '#EF4444',
    600:     '#DC2626',
    DEFAULT: '#EF4444',
  },
  info: {
    50:      '#EFF6FF',
    500:     '#3B82F6',
    DEFAULT: '#3B82F6',
  },
} as const;

// ─── Barrel export ─────────────────────────────────────────────────────────────
export const colors = {
  primary: primaryColors,
  accent:  accentColors,
  neutral: neutralColors,
  ...semanticColors,
} as const;

export type Colors = typeof colors;
