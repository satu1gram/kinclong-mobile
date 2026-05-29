import React from 'react';
import { View, type ViewProps } from 'react-native';

/**
 * components/common/Card.tsx - Container card reusable
 *
 * Wrapper dengan background putih, border-radius, dan shadow.
 * Varian: default | flat | elevated
 */

type CardVariant = 'default' | 'flat' | 'elevated';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
}

const paddingMap: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const variantMap: Record<CardVariant, string> = {
  flat:     '',
  default:  'shadow-sm shadow-slate-100',
  elevated: 'shadow-lg shadow-slate-200',
};

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className,
  ...props
}: CardProps) {
  return (
    <View
      className={`bg-white rounded-2xl ${variantMap[variant]} ${paddingMap[padding]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </View>
  );
}

export default Card;
