/**
 * theme/shadows.ts — Shadow tokens untuk React Native
 *
 * Menyediakan shadow values yang bekerja di iOS dan Android.
 * - iOS   : shadowColor + shadowOffset + shadowOpacity + shadowRadius
 * - Android: elevation (integer, semakin besar semakin gelap)
 *
 * Karena React Native style objects hanya memproses properti
 * yang relevan per platform, aman untuk menyertakan keduanya.
 *
 * Cara pakai:
 *   import { shadows } from '@/theme';
 *   style={[styles.card, shadows.md]}
 *
 * Catatan: NativeWind shadow-* classes hanya bekerja optimal di iOS.
 * Untuk Android, selalu gunakan JS shadow tokens ini + elevation.
 */

// Warna shadow sedikit biru-gelap agar lebih natural di atas white background
const SHADOW_COLOR = '#0F172A'; // slate-900

export const shadows = {
  /** Tidak ada shadow */
  none: {},

  /**
   * Shadow tipis — cocok untuk card di background putih
   * Contoh: kartu statistik, list item
   */
  sm: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  /**
   * Shadow sedang — default untuk kartu dan panel
   * Contoh: Card, Input focus state
   */
  md: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  /**
   * Shadow besar — untuk elemen yang melayang di atas konten
   * Contoh: Modal, Dropdown, FAB button
   */
  lg: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },

  /**
   * Shadow sangat besar — untuk bottom sheet atau full-screen overlay
   * Contoh: Action sheet, context menu
   */
  xl: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  },
};

export type ShadowKey = keyof typeof shadows;
export type Shadow = (typeof shadows)[ShadowKey];
