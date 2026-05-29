/**
 * theme/typography.ts — Typography tokens Design System Kinclong
 *
 * Mendefinisikan skala font size, weight, line height, dan letter spacing.
 * Font family menggunakan system font default per platform.
 *
 * Cara pakai:
 *   import { fontSize, fontWeight } from '@/theme';
 *   style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold }}
 *
 * Atau lewat Tailwind (lebih disarankan di komponen):
 *   className="text-lg font-semibold"
 */
import { Platform } from 'react-native';

// ─── Font Family ───────────────────────────────────────────────────────────────
export const fontFamily = {
  /** Font system default per platform */
  sans: Platform.select({
    ios:     'System',
    android: 'sans-serif',
    default: 'System',
  }),
  medium: Platform.select({
    ios:     'System',
    android: 'sans-serif-medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios:     'System',
    android: 'sans-serif-bold',
    default: 'System',
  }),
  mono: Platform.select({
    ios:     'Courier New',
    android: 'monospace',
    default: 'monospace',
  }),
} as const;

// ─── Font Size (px) ────────────────────────────────────────────────────────────
/**
 * Skala font size dalam pixel.
 * Tailwind equivalents: text-xs (12) → text-5xl (48)
 */
export const fontSize = {
  xs:    12,   // text-xs     — label kecil, caption
  sm:    14,   // text-sm     — body secondary, hint
  base:  16,   // text-base   — body primary
  lg:    18,   // text-lg     — body besar, subheading kecil
  xl:    20,   // text-xl     — heading level 4
  '2xl': 24,   // text-2xl    — heading level 3
  '3xl': 30,   // text-3xl    — heading level 2
  '4xl': 36,   // text-4xl    — heading level 1
  '5xl': 48,   // text-5xl    — display / hero
} as const;

// ─── Font Weight ───────────────────────────────────────────────────────────────
export const fontWeight = {
  regular:   '400' as const,
  medium:    '500' as const,
  semibold:  '600' as const,
  bold:      '700' as const,
  extrabold: '800' as const,
} as const;

// ─── Line Height (multiplier) ──────────────────────────────────────────────────
export const lineHeight = {
  none:    1,
  tight:   1.25,  // leading-tight
  snug:    1.375, // leading-snug
  normal:  1.5,   // leading-normal (default)
  relaxed: 1.625, // leading-relaxed
  loose:   2,     // leading-loose
} as const;

// ─── Letter Spacing (px) ──────────────────────────────────────────────────────
export const letterSpacing = {
  tight:   -0.5,
  normal:  0,
  wide:    0.5,
  wider:   1,
  widest:  2,
} as const;

export type FontSize      = keyof typeof fontSize;
export type FontWeight    = keyof typeof fontWeight;
export type LineHeight    = keyof typeof lineHeight;
