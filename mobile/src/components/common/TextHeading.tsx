import React from 'react';
import { Text, type TextProps } from 'react-native';

/**
 * TextHeading — Komponen heading/judul dengan sistem tipografi baku
 *
 * ## Levels
 * | Level | Size  | Weight   | Kegunaan                           |
 * |-------|-------|----------|------------------------------------|
 * | h1    | 36px  | bold     | Judul halaman utama / hero          |
 * | h2    | 28px  | bold     | Judul section / grup konten         |
 * | h3    | 22px  | semibold | Judul card / sub-section            |
 * | h4    | 18px  | semibold | Label heading kecil / widget title  |
 *
 * ## Colors
 * | Color   | Hex       | Kegunaan                      |
 * |---------|-----------|-------------------------------|
 * | default | slate-900 | Teks utama (hitam pekat)      |
 * | primary | blue-600  | Emphasis dengan warna brand   |
 * | accent  | orange-500| Highlight / promo             |
 * | muted   | slate-500 | Teks sekunder / subtitle      |
 * | white   | #FFFFFF   | Di atas background gelap      |
 *
 * ## Contoh
 * ```tsx
 * // Judul halaman
 * <TextHeading level="h1">Dashboard</TextHeading>
 *
 * // Section title dengan warna brand
 * <TextHeading level="h2" color="primary">Antrean Aktif</TextHeading>
 *
 * // Card title
 * <TextHeading level="h3">Ringkasan Hari Ini</TextHeading>
 *
 * // Di atas header biru
 * <TextHeading level="h2" color="white">Selamat datang</TextHeading>
 *
 * // Subtitle kecil
 * <TextHeading level="h4" color="muted">Statistik</TextHeading>
 * ```
 */

// ─── Types ────────────────────────────────────────────────────────────────────
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';
export type HeadingColor = 'default' | 'primary' | 'accent' | 'muted' | 'white';

export interface TextHeadingProps extends TextProps {
  /** Level heading. Default: 'h2' */
  level?: HeadingLevel;
  /** Warna teks. Default: 'default' */
  color?: HeadingColor;
  children: React.ReactNode;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────
const levelClasses: Record<HeadingLevel, string> = {
  h1: 'text-4xl font-bold leading-tight',    // 36px bold
  h2: 'text-3xl font-bold leading-tight',    // 30px bold — adjusted ke text-3xl = 30px
  h3: 'text-xl font-semibold leading-snug',  // 20px semibold
  h4: 'text-lg font-semibold leading-snug',  // 18px semibold
};

// Catatan: text-3xl di Tailwind default = 30px (bukan 28px).
// Jika butuh 28px tepat, tambahkan custom fontSize di tailwind.config.js.

const colorClasses: Record<HeadingColor, string> = {
  default: 'text-slate-900',
  primary: 'text-primary-600',
  accent:  'text-accent-500',
  muted:   'text-slate-500',
  white:   'text-white',
};

// ─── Component ────────────────────────────────────────────────────────────────
export function TextHeading({
  level    = 'h2',
  color    = 'default',
  className,
  children,
  ...props
}: TextHeadingProps) {
  return (
    <Text
      className={[
        levelClasses[level],
        colorClasses[color],
        className ?? '',
      ].join(' ')}
      {...props}
    >
      {children}
    </Text>
  );
}

export default TextHeading;
