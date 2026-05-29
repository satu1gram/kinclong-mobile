/**
 * theme/index.ts — Barrel export Design System Kinclong
 *
 * Mengekspor semua design tokens dalam satu entry point.
 *
 * Cara pakai:
 *   // Import individual tokens
 *   import { colors, fontSize, spacing, shadows } from '@/theme';
 *
 *   // Import semua sebagai satu objek
 *   import theme from '@/theme';
 *   theme.colors.primary[500]
 *   theme.shadows.md
 */

export { colors, primaryColors, accentColors, neutralColors, semanticColors } from './colors';
export type { Colors } from './colors';

export {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
} from './typography';
export type { FontSize, FontWeight, LineHeight } from './typography';

export { spacing, borderRadius, breakpoints } from './spacing';
export type { SpacingKey, BorderRadiusKey } from './spacing';

export { shadows } from './shadows';
export type { ShadowKey, Shadow } from './shadows';

// ─── Default export: semua tokens dalam satu objek ───────────────────────────
import { colors }                                              from './colors';
import { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } from './typography';
import { spacing, borderRadius, breakpoints }                  from './spacing';
import { shadows }                                             from './shadows';

/**
 * Objek tema lengkap — gunakan ini ketika butuh akses ke
 * beberapa token sekaligus tanpa import terpisah.
 *
 * @example
 * import theme from '@/theme';
 * const primaryBg  = theme.colors.primary[500];
 * const cardShadow = theme.shadows.md;
 * const bodySize   = theme.fontSize.base;
 */
const theme = {
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  spacing,
  borderRadius,
  breakpoints,
  shadows,
} as const;

export default theme;
export type Theme = typeof theme;
