import React from 'react';
import {
  View,
  TouchableOpacity,
  type ViewProps,
  type TouchableOpacityProps,
} from 'react-native';

/**
 * Card — Container visual untuk mengelompokkan konten
 *
 * ## Variants
 * | Variant  | Kegunaan                                    |
 * |----------|---------------------------------------------|
 * | default  | Card standar dengan shadow tipis            |
 * | flat     | Tanpa shadow — cocok di background putih    |
 * | elevated | Shadow lebih besar — floating panel/modal   |
 * | outline  | Border tipis tanpa shadow                   |
 *
 * ## Padding
 * none → sm (12px) → md (16px, default) → lg (24px)
 *
 * ## Pressable Card
 * Berikan `onPress` untuk membuat card menjadi touchable.
 * Tampilan akan berubah menggunakan active:opacity-80.
 *
 * ## Contoh
 * ```tsx
 * // Card info statistik
 * <Card padding="sm">
 *   <Text>Total Antrean</Text>
 *   <Text className="text-2xl font-bold">42</Text>
 * </Card>
 *
 * // Card yang bisa ditekan (navigasi)
 * <Card onPress={() => navigation.navigate('Detail', { id })} variant="outline">
 *   <QueueItemRow item={queue} />
 * </Card>
 *
 * // Card dengan shadow besar
 * <Card variant="elevated" padding="lg">
 *   <FormContent />
 * </Card>
 * ```
 */

// ─── Types ────────────────────────────────────────────────────────────────────
export type CardVariant = 'default' | 'flat' | 'elevated' | 'outline';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface BaseCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
}

// Card statis (View)
interface StaticCardProps extends Omit<ViewProps, 'children'>, BaseCardProps {
  onPress?: never;
}

// Card pressable (TouchableOpacity)
interface PressableCardProps extends Omit<TouchableOpacityProps, 'children'>, BaseCardProps {
  onPress: () => void;
}

export type CardProps = StaticCardProps | PressableCardProps;

// ─── Style Maps ───────────────────────────────────────────────────────────────
const variantClasses: Record<CardVariant, string> = {
  default:  'shadow-sm shadow-slate-100',
  flat:     '',
  elevated: 'shadow-lg shadow-slate-200',
  outline:  'border border-slate-200',
};

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
};

// ─── Component ────────────────────────────────────────────────────────────────
export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className,
  onPress,
  ...props
}: CardProps) {
  const baseClass = [
    'bg-white rounded-2xl',
    variantClasses[variant],
    paddingClasses[padding],
    className ?? '',
  ].join(' ');

  // Pressable variant
  if (onPress) {
    return (
      <TouchableOpacity
        className={`${baseClass} active:opacity-80`}
        onPress={onPress}
        activeOpacity={0.8}
        {...(props as TouchableOpacityProps)}
      >
        {children}
      </TouchableOpacity>
    );
  }

  // Static variant
  return (
    <View className={baseClass} {...(props as ViewProps)}>
      {children}
    </View>
  );
}

export default Card;
