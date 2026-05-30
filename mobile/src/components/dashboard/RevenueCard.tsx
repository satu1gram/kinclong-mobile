import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../common/Card';
import { formatRupiah, changePercent } from '../../lib/mockDashboardData';

/**
 * RevenueCard — Card highlight pendapatan dengan trend indicator.
 *
 * Menampilkan:
 * - Label periode (e.g. "Omzet Hari Ini")
 * - Nilai dalam Rupiah
 * - Indicator perubahan vs periode sebelumnya (jika `previous` diberikan)
 *
 * Variant `featured` memakai background gradient-like (accent solid).
 *
 * @example
 * <RevenueCard label="Omzet Hari Ini" value={1850000} previous={1600000} featured />
 */

export interface RevenueCardProps {
  label:     string;
  value:     number;
  /** Nilai pembanding untuk trend indicator. Opsional. */
  previous?: number;
  /** Tampilan menonjol dengan background accent. Default false. */
  featured?: boolean;
  /** testID untuk e2e/unit test */
  testID?:   string;
}

export function RevenueCard({
  label, value, previous, featured = false, testID,
}: RevenueCardProps) {
  const showTrend = typeof previous === 'number';
  const pct       = showTrend ? changePercent(value, previous!) : 0;
  const isUp      = pct >= 0;

  if (featured) {
    return (
      <Card
        variant="flat"
        padding="lg"
        className="bg-accent-500"
        testID={testID}
      >
        <Text className="text-accent-50 text-xs font-medium uppercase tracking-wider">
          {label}
        </Text>
        <Text
          className="text-white text-3xl font-bold mt-2"
          testID={testID ? `${testID}-value` : undefined}
        >
          {formatRupiah(value)}
        </Text>
        {showTrend && (
          <View className="flex-row items-center mt-2">
            <Text className="text-white/90 text-xs font-semibold">
              {isUp ? '↑' : '↓'} {Math.abs(pct).toFixed(1)}%
            </Text>
            <Text className="text-accent-50 text-xs ml-2">
              vs periode sebelumnya
            </Text>
          </View>
        )}
      </Card>
    );
  }

  return (
    <Card variant="outline" padding="md" testID={testID}>
      <Text className="text-slate-500 text-xs font-medium">{label}</Text>
      <Text
        className="text-slate-800 text-xl font-bold mt-1.5"
        testID={testID ? `${testID}-value` : undefined}
      >
        {formatRupiah(value)}
      </Text>
      {showTrend && (
        <View className="flex-row items-center mt-1.5">
          <Text
            className={[
              'text-xs font-semibold',
              isUp ? 'text-green-600' : 'text-red-500',
            ].join(' ')}
          >
            {isUp ? '↑' : '↓'} {Math.abs(pct).toFixed(1)}%
          </Text>
        </View>
      )}
    </Card>
  );
}

export default RevenueCard;
