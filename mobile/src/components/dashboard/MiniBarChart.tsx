import React from 'react';
import { View, Text } from 'react-native';
import { formatCompactIDR } from '../../lib/mockDashboardData';
import type { DailyRevenuePoint } from '../../lib/mockDashboardData';

/**
 * MiniBarChart — Grafik batang sederhana tanpa library eksternal.
 *
 * Dirancang pure React Native (View + flex) agar ringan dan tidak perlu
 * dependency tambahan seperti victory-native atau react-native-svg.
 *
 * Tinggi bar dihitung proporsional dari nilai terbesar di dataset.
 * Bar tertinggi mendapat warna accent (oranye), sisanya primary biru.
 *
 * @example
 * <MiniBarChart data={dashboardData.weeklyRevenue} height={140} />
 */

export interface MiniBarChartProps {
  data:    DailyRevenuePoint[];
  /** Tinggi area chart (tanpa label hari di bawah). Default 140 */
  height?: number;
}

export function MiniBarChart({ data, height = 140 }: MiniBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.revenue), 1);
  const maxIndex = data.findIndex((d) => d.revenue === maxValue);

  return (
    <View className="w-full" testID="mini-bar-chart">
      {/* Y-axis label (maximum) */}
      <View className="flex-row justify-between items-end mb-2">
        <Text className="text-[10px] text-slate-400 font-medium">
          Pendapatan 7 hari
        </Text>
        <Text className="text-[10px] text-slate-400 font-medium">
          Maks {formatCompactIDR(maxValue)}
        </Text>
      </View>

      {/* Bars */}
      <View
        className="flex-row items-end justify-between"
        style={{ height }}
      >
        {data.map((point, i) => {
          const ratio  = point.revenue / maxValue;
          const barH   = Math.max(ratio * height, 4); // min 4px agar terlihat
          const isMax  = i === maxIndex;
          const colorClass = isMax ? 'bg-accent-500' : 'bg-primary-400';

          return (
            <View
              key={point.date}
              className="flex-1 items-center"
              testID={`bar-${point.day.toLowerCase()}`}
            >
              {/* Value label muncul hanya pada bar tertinggi */}
              {isMax && (
                <Text className="text-[10px] font-semibold text-accent-600 mb-1">
                  {formatCompactIDR(point.revenue)}
                </Text>
              )}
              <View
                className={`w-[60%] rounded-t-md ${colorClass}`}
                style={{ height: barH }}
              />
            </View>
          );
        })}
      </View>

      {/* X-axis labels (hari) */}
      <View className="flex-row justify-between mt-2">
        {data.map((point, i) => {
          const isMax = i === maxIndex;
          return (
            <View key={point.date} className="flex-1 items-center">
              <Text
                className={[
                  'text-[11px]',
                  isMax ? 'text-accent-600 font-semibold' : 'text-slate-500',
                ].join(' ')}
              >
                {point.day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default MiniBarChart;
