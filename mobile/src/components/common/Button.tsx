import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  type TouchableOpacityProps,
} from 'react-native';

/**
 * Button — Tombol aksi reusable
 *
 * ## Variants
 * | Variant   | Kegunaan                                      |
 * |-----------|-----------------------------------------------|
 * | primary   | Aksi utama (submit, simpan, login)            |
 * | secondary | Aksi sekunder (filter, lihat detail)          |
 * | outline   | Aksi alternatif inline dengan border          |
 * | danger    | Aksi destruktif (hapus, batalkan)             |
 * | ghost     | Aksi ringan tanpa background (link-style)     |
 * | accent    | CTA high-emphasis: orange (tambah ke antrean) |
 *
 * ## Sizes
 * xs → sm → md (default) → lg → xl
 *
 * ## Contoh
 * ```tsx
 * // Primary CTA
 * <Button title="Masuk" onPress={handleLogin} isLoading={loading} />
 *
 * // Accent CTA dengan full width
 * <Button title="Tambah Kendaraan" variant="accent" size="lg" fullWidth />
 *
 * // Outline dengan icon kiri
 * <Button title="Filter" variant="outline" size="sm" leftIcon={<Icon />} />
 * ```
 */

// ─── Types ────────────────────────────────────────────────────────────────────
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'accent';
export type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends TouchableOpacityProps {
  /** Teks yang ditampilkan dalam tombol */
  title: string;
  /** Tampilan visual tombol. Default: 'primary' */
  variant?: ButtonVariant;
  /** Ukuran tombol. Default: 'md' */
  size?: ButtonSize;
  /** Tampilkan spinner & nonaktifkan tombol */
  isLoading?: boolean;
  /** Icon di sebelah kiri teks */
  leftIcon?: React.ReactNode;
  /** Icon di sebelah kanan teks */
  rightIcon?: React.ReactNode;
  /** Tombol mengisi lebar penuh container */
  fullWidth?: boolean;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────
const variantStyles: Record<ButtonVariant, { container: string; text: string; spinnerColor: string }> = {
  primary:   {
    container:    'bg-primary-500 active:bg-primary-600',
    text:         'text-white font-semibold',
    spinnerColor: '#FFFFFF',
  },
  secondary: {
    container:    'bg-slate-100 active:bg-slate-200',
    text:         'text-slate-700 font-semibold',
    spinnerColor: '#475569',
  },
  outline: {
    container:    'border border-primary-500 active:bg-primary-50',
    text:         'text-primary-600 font-semibold',
    spinnerColor: '#3B82F6',
  },
  danger: {
    container:    'bg-red-500 active:bg-red-600',
    text:         'text-white font-semibold',
    spinnerColor: '#FFFFFF',
  },
  ghost: {
    container:    'active:bg-slate-50',
    text:         'text-primary-600 font-medium',
    spinnerColor: '#3B82F6',
  },
  accent: {
    container:    'bg-accent-500 active:bg-accent-600',
    text:         'text-white font-semibold',
    spinnerColor: '#FFFFFF',
  },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string; spinner: 'small' | 'large' }> = {
  xs: { container: 'px-2.5 py-1.5 rounded-lg',   text: 'text-xs',   spinner: 'small' },
  sm: { container: 'px-3 py-2 rounded-lg',        text: 'text-sm',   spinner: 'small' },
  md: { container: 'px-5 py-3 rounded-xl',        text: 'text-base', spinner: 'small' },
  lg: { container: 'px-6 py-3.5 rounded-xl',      text: 'text-lg',   spinner: 'small' },
  xl: { container: 'px-8 py-4 rounded-2xl',       text: 'text-xl',   spinner: 'large' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export function Button({
  title,
  variant    = 'primary',
  size       = 'md',
  isLoading  = false,
  leftIcon,
  rightIcon,
  fullWidth  = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const vs = variantStyles[variant];
  const ss = sizeStyles[size];

  return (
    <TouchableOpacity
      className={[
        'flex-row items-center justify-center',
        vs.container,
        ss.container,
        fullWidth  ? 'w-full' : 'self-start',
        isDisabled ? 'opacity-50' : '',
        className ?? '',
      ].join(' ')}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size={ss.spinner} color={vs.spinnerColor} />
      ) : (
        <>
          {leftIcon  && <View className="mr-2">{leftIcon}</View>}
          <Text className={`${vs.text} ${ss.text}`}>{title}</Text>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}

export default Button;
