import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Platform,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import KIcon from './KIcon';

/**
 * Input — Field input form yang reusable
 *
 * ## Fitur
 * - Label + required indicator (*)
 * - Error message merah di bawah
 * - Hint text abu di bawah
 * - Password toggle (tampilkan/sembunyikan)
 * - Left / right icon slot
 * - Multiline (textarea) support
 * - Focus state dengan border biru
 * - Disabled state dengan opacity
 *
 * ## Contoh
 * ```tsx
 * // Input email biasa
 * <Input label="Email" placeholder="email@example.com" required
 *        keyboardType="email-address" value={email} onChangeText={setEmail} />
 *
 * // Password dengan toggle
 * <Input label="Kata Sandi" isPassword value={password} onChangeText={setPassword} />
 *
 * // Textarea / catatan
 * <Input label="Catatan" multiline numberOfLines={4} value={notes}
 *        onChangeText={setNotes} />
 *
 * // Dengan error
 * <Input label="Plat Nomor" error="Format tidak valid" value={plate} />
 * ```
 */

export interface InputProps extends TextInputProps {
  /** Label di atas input */
  label?: string;
  /** Pesan error — mengubah border menjadi merah */
  error?: string;
  /** Teks hint abu-abu di bawah input */
  hint?: string;
  /** Mode password: teks tersembunyi + toggle show/hide */
  isPassword?: boolean;
  /** Tambah tanda * merah di belakang label */
  required?: boolean;
  /** Icon/element di sebelah kiri input */
  leftIcon?: React.ReactNode;
  /** Icon/element di sebelah kanan input (diabaikan jika isPassword) */
  rightIcon?: React.ReactNode;
  /** Override style container luar */
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  hint,
  isPassword  = false,
  required,
  leftIcon,
  rightIcon,
  containerStyle,
  className,
  multiline,
  numberOfLines = 1,
  editable = true,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused]       = useState(false);

  // Border color: error > focus > default
  const borderClass = error
    ? 'border-red-400'
    : isFocused
    ? 'border-primary-500'
    : 'border-slate-200';

  const iconColor = error
    ? '#f87171' // red-400
    : isFocused
    ? '#3b82f6' // primary-500
    : '#94a3b8'; // slate-400

  return (
    <View className="mb-4" style={containerStyle}>
      {/* ── Label ─────────────────────────────────────────────────── */}
      {label && (
        <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}

      {/* ── Input Row ─────────────────────────────────────────────── */}
      <View
        className={[
          'flex-row items-center border rounded-xl px-3 bg-white min-h-[48px]',
          borderClass,
          !editable ? 'bg-slate-50 opacity-60' : '',
        ].join(' ')}
      >
        {leftIcon && (
          <View className="mr-2">
            {React.isValidElement(leftIcon)
              ? React.cloneElement(leftIcon as React.ReactElement<any>, { color: iconColor })
              : leftIcon}
          </View>
        )}

        <TextInput
          style={[
            Platform.OS === 'android' && { paddingVertical: 0 },
            props.style,
          ]}
          className={[
            'flex-1 text-[16px] text-slate-800',
            multiline ? 'min-h-[80px] py-3' : (Platform.OS === 'ios' ? 'py-3' : 'h-12'),
            className ?? '',
          ].join(' ')}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor="#94A3B8"
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Password toggle */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((p) => !p)}
            className="px-1 py-2"
          >
            <KIcon name={showPassword ? 'eye-off' : 'eye'} size={18} color={iconColor} />
          </TouchableOpacity>
        )}

        {/* Right icon (hanya jika bukan password) */}
        {!isPassword && rightIcon && (
          <View className="ml-2">
            {React.isValidElement(rightIcon)
              ? React.cloneElement(rightIcon as React.ReactElement<any>, { color: iconColor })
              : rightIcon}
          </View>
        )}
      </View>

      {/* ── Feedback Text ─────────────────────────────────────────── */}
      {error && (
        <Text className="text-red-500 text-xs mt-1.5">{error}</Text>
      )}
      {!error && hint && (
        <Text className="text-slate-400 text-xs mt-1.5">{hint}</Text>
      )}
    </View>
  );
}

export default Input;
