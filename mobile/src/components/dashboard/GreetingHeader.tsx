import React from 'react';
import { View, Text } from 'react-native';
import { getTimeBasedGreeting } from '../../lib/mockDashboardData';

/**
 * GreetingHeader — Header sapaan dinamis untuk Dashboard.
 *
 * Menampilkan:
 * - Sapaan berdasarkan waktu lokal (Pagi/Siang/Sore/Malam)
 * - Nama lengkap user
 * - Sub-text outlet / role
 *
 * @example
 * <GreetingHeader name="Budi Santoso" subtitle="Pemilik Kinclong Pusat" />
 */
export interface GreetingHeaderProps {
  name:      string;
  subtitle?: string;
  /** Untuk testing — override jam saat ini. */
  now?:      Date;
}

export function GreetingHeader({ name, subtitle, now }: GreetingHeaderProps) {
  const { greeting, emoji } = getTimeBasedGreeting(now);

  return (
    <View
      className="bg-primary-500 px-5 pt-4 pb-10 rounded-b-3xl"
      testID="greeting-header"
    >
      <View className="flex-row items-center">
        <Text className="text-2xl mr-2">{emoji}</Text>
        <Text className="text-primary-100 text-sm font-medium">
          {greeting},
        </Text>
      </View>
      <Text
        className="text-white text-2xl font-bold mt-1"
        numberOfLines={1}
        testID="greeting-name"
      >
        {name}
      </Text>
      {subtitle ? (
        <Text className="text-primary-100 text-xs mt-1">{subtitle}</Text>
      ) : null}
    </View>
  );
}

export default GreetingHeader;
