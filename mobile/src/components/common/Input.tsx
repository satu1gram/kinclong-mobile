import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  type TextInputProps,
} from 'react-native';

/**
 * components/common/Input.tsx - Input field reusable
 *
 * Fitur: label, error state, hint text, password toggle,
 * left/right icon, required indicator.
 */

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

export function Input({
  label,
  error,
  hint,
  isPassword = false,
  leftIcon,
  rightIcon,
  required,
  className,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-slate-700 mb-1.5">
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}
      <View
        className={`flex-row items-center border rounded-xl px-3 bg-white ${
          error ? 'border-red-400' : 'border-slate-200'
        }`}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          className={`flex-1 py-3 text-base text-slate-800 ${className ?? ''}`}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor="#94a3b8"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text className="text-slate-400 text-xs px-1">
              {showPassword ? 'Sembunyikan' : 'Tampilkan'}
            </Text>
          </TouchableOpacity>
        )}
        {!isPassword && rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
      {hint && !error && <Text className="text-slate-400 text-xs mt-1">{hint}</Text>}
    </View>
  );
}

export default Input;
