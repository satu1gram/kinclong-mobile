import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  type TouchableOpacityProps,
} from 'react-native';

/**
 * components/common/Button.tsx - Tombol reusable dengan multiple varian
 *
 * Varian: primary | secondary | outline | danger | ghost
 * Ukuran: sm | md | lg
 * State: loading, disabled
 */

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary:   { container: 'bg-blue-800 active:bg-blue-900',            text: 'text-white font-semibold' },
  secondary: { container: 'bg-slate-100 active:bg-slate-200',          text: 'text-slate-700 font-semibold' },
  outline:   { container: 'border border-blue-800 active:bg-blue-50',  text: 'text-blue-800 font-semibold' },
  danger:    { container: 'bg-red-600 active:bg-red-700',              text: 'text-white font-semibold' },
  ghost:     { container: 'bg-transparent active:bg-slate-100',        text: 'text-blue-800 font-medium' },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: { container: 'px-3 py-2 rounded-lg',  text: 'text-sm' },
  md: { container: 'px-5 py-3 rounded-xl',  text: 'text-base' },
  lg: { container: 'px-6 py-4 rounded-xl',  text: 'text-lg' },
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const { container, text } = variantStyles[variant];
  const { container: sizeContainer, text: sizeText } = sizeStyles[size];

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center ${container} ${sizeContainer} ${
        isDisabled ? 'opacity-50' : ''
      } ${className ?? ''}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#ffffff' : '#1e40af'}
        />
      ) : (
        <>
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <Text className={`${text} ${sizeText}`}>{title}</Text>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}

export default Button;
