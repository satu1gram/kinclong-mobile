import React from 'react';
import { View, Text, type ViewProps } from 'react-native';

/**
 * Badge — Label/tag status yang ringkas dan berwarna
 *
 * ## Variants (warna)
 * | Variant | BG         | Text       | Kegunaan                         |
 * |---------|------------|------------|----------------------------------|
 * | primary | blue-100   | blue-700   | Role pengguna, kategori utama    |
 * | accent  | orange-100 | orange-700 | Promo, fitur baru, highlight     |
 * | success | green-100  | green-700  | Status selesai / aktif           |
 * | warning | amber-100  | amber-700  | Menunggu / perlu perhatian       |
 * | error   | red-100    | red-700    | Error / dibatalkan               |
 * | neutral | slate-100  | slate-600  | Label netral / info              |
 *
 * ## Sizes
 * | Size | Padding      | Font Size |
 * |------|--------------|-----------|
 * | xs   | px-1.5 py-px | text-xs   |
 * | sm   | px-2 py-0.5  | text-xs   |
 * | md   | px-2.5 py-1  | text-sm   |
 *
 * ## Dot indicator
 * Tambah `dot` prop untuk menampilkan lingkaran status sebelum label.
 *
 * ## Contoh
 * ```tsx
 * // Status antrean
 * <Badge label="Menunggu"  variant="warning" dot />
 * <Badge label="Dikerjakan" variant="primary" dot />
 * <Badge label="Selesai"   variant="success" dot />
 * <Badge label="Dibatalkan" variant="error"  dot />
 *
 * // Role pengguna
 * <Badge label="Owner"    variant="primary" size="sm" />
 * <Badge label="Operator" variant="neutral" size="sm" />
 *
 * // Fitur paket langganan
 * <Badge label="Pro" variant="accent" />
 *
 * // Jenis kendaraan
 * <Badge label="Mobil" variant="neutral" size="xs" />
 * ```
 */

// ─── Types ────────────────────────────────────────────────────────────────────
export type BadgeVariant = 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';
export type BadgeSize    = 'xs' | 'sm' | 'md';

export interface BadgeProps extends ViewProps {
  /** Teks yang ditampilkan dalam badge */
  label: string;
  /** Skema warna. Default: 'neutral' */
  variant?: BadgeVariant;
  /** Ukuran badge. Default: 'md' */
  size?: BadgeSize;
  /** Tampilkan titik status di depan label */
  dot?: boolean;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────
const variantClasses: Record<BadgeVariant, {
  container: string;
  text:      string;
  dot:       string;
}> = {
  primary: {
    container: 'bg-primary-100',
    text:      'text-primary-700',
    dot:       'bg-primary-500',
  },
  accent: {
    container: 'bg-accent-100',
    text:      'text-accent-700',
    dot:       'bg-accent-500',
  },
  success: {
    container: 'bg-green-100',
    text:      'text-green-700',
    dot:       'bg-green-500',
  },
  warning: {
    container: 'bg-amber-100',
    text:      'text-amber-700',
    dot:       'bg-amber-500',
  },
  error: {
    container: 'bg-red-100',
    text:      'text-red-700',
    dot:       'bg-red-500',
  },
  neutral: {
    container: 'bg-slate-100',
    text:      'text-slate-600',
    dot:       'bg-slate-400',
  },
};

const sizeClasses: Record<BadgeSize, {
  container: string;
  text:      string;
  dot:       string;
}> = {
  xs: { container: 'px-1.5 py-px rounded-md',  text: 'text-xs',  dot: 'w-1 h-1' },
  sm: { container: 'px-2 py-0.5 rounded-full',  text: 'text-xs',  dot: 'w-1.5 h-1.5' },
  md: { container: 'px-2.5 py-1 rounded-full',  text: 'text-sm',  dot: 'w-2 h-2' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export function Badge({
  label,
  variant  = 'neutral',
  size     = 'md',
  dot      = false,
  className,
  ...props
}: BadgeProps) {
  const vs = variantClasses[variant];
  const ss = sizeClasses[size];

  return (
    <View
      className={[
        'flex-row items-center self-start',
        vs.container,
        ss.container,
        className ?? '',
      ].join(' ')}
      {...props}
    >
      {dot && (
        <View className={`rounded-full mr-1.5 ${vs.dot} ${ss.dot}`} />
      )}
      <Text className={`font-semibold ${vs.text} ${ss.text}`}>
        {label}
      </Text>
    </View>
  );
}

export default Badge;
