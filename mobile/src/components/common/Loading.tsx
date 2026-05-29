import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

/**
 * components/common/Loading.tsx - Loading state component
 *
 * Digunakan untuk:
 * - Full screen loading (fullScreen=true) saat inisialisasi app
 * - Inline loading (fullScreen=false) dalam list atau section
 */

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export function Loading({ message, size = 'large', fullScreen = true }: LoadingProps) {
  return (
    <View
      className={`items-center justify-center bg-white ${fullScreen ? 'flex-1' : 'py-8'}`}
    >
      <ActivityIndicator size={size} color="#1e40af" />
      {message && <Text className="mt-3 text-slate-500 text-sm">{message}</Text>}
    </View>
  );
}

export default Loading;
