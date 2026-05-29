/**
 * theme/spacing.ts — Spacing & Border Radius tokens
 *
 * Sistem spacing berbasis 4px (4pt grid).
 * Semua nilai spacing adalah kelipatan 4 untuk konsistensi visual.
 *
 * Cara pakai:
 *   import { spacing, borderRadius } from '@/theme';
 *   style={{ padding: spacing[4], borderRadius: borderRadius.xl }}
 *
 * Atau via Tailwind (lebih disarankan):
 *   className="p-4 rounded-xl"
 */

// ─── Spacing Scale (px, berbasis 4pt grid) ────────────────────────────────────
export const spacing = {
  0:    0,     // 0px
  0.5:  2,     // 2px
  1:    4,     // 4px
  1.5:  6,     // 6px
  2:    8,     // 8px
  2.5:  10,    // 10px
  3:    12,    // 12px
  3.5:  14,    // 14px
  4:    16,    // 16px
  5:    20,    // 20px
  6:    24,    // 24px
  7:    28,    // 28px
  8:    32,    // 32px
  9:    36,    // 36px
  10:   40,    // 40px
  11:   44,    // 44px (minimum tap target iOS)
  12:   48,    // 48px (minimum tap target Android)
  14:   56,    // 56px
  16:   64,    // 64px
  20:   80,    // 80px
  24:   96,    // 96px
  32:   128,   // 128px
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────
export const borderRadius = {
  none:  0,
  sm:    4,     // rounded-sm — subtle
  md:    8,     // rounded-md — tombol kecil, badge
  lg:    12,    // rounded-lg — card kecil
  xl:    16,    // rounded-xl — card, input (default)
  '2xl': 20,    // rounded-2xl — card besar
  '3xl': 24,    // rounded-3xl — modal, sheet
  full:  9999,  // rounded-full — pill, avatar
} as const;

// ─── Breakpoints (screen width) ───────────────────────────────────────────────
export const breakpoints = {
  sm:  375,  // iPhone SE / kecil
  md:  390,  // iPhone 14 standard
  lg:  430,  // iPhone 14 Plus / Pro Max
  xl:  768,  // iPad mini / tablet
} as const;

export type SpacingKey      = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
